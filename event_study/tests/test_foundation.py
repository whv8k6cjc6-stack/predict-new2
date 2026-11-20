import sys
import warnings
from pathlib import Path

import numpy as np
import pandas as pd
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from src import calendar as cal  # noqa: E402
from src import schemas  # noqa: E402
from src.loader import load  # noqa: E402
from src.synthetic import make_synthetic, write_synthetic  # noqa: E402


@pytest.fixture(scope="module")
def syn():
    return make_synthetic(seed=42, n_tickers=60, years=7)


# ---------- calendar ----------
def test_calendar_basic():
    assert cal.next_trading_day("2024-03-01") == pd.Timestamp("2024-03-04")      # 週五 -> 週一
    assert cal.prev_trading_day("2024-03-04") == pd.Timestamp("2024-03-01")
    assert cal.next_trading_day("2024-02-27") == pd.Timestamp("2024-02-29")      # 2/28 固定假日
    assert cal.next_trading_day("2024-03-04", include_self=True) == pd.Timestamp("2024-03-04")
    d = cal.trading_days_between("2024-03-01", "2024-03-08")
    assert list(d.day) == [1, 4, 5, 6, 7, 8]
    assert len(cal.trading_days_between("2024-03-01", "2024-03-08", inclusive="neither")) == 4
    assert cal.add_trading_days("2024-03-01", 2) == pd.Timestamp("2024-03-05")


def test_calendar_custom_holidays():
    c = cal.TradingCalendar(holidays=["2024-03-04"])
    assert c.next_trading_day("2024-03-01") == pd.Timestamp("2024-03-05")
    assert not c.is_trading_day("2024-03-04")


@pytest.mark.parametrize("ts,t0,entry", [
    ("2024-03-05 08:30", "2024-03-05", "2024-03-05"),     # 盤前
    ("2024-03-05 10:00", "2024-03-05", "2024-03-06"),     # 盤中
    ("2024-03-05 14:00", "2024-03-06", "2024-03-06"),     # 盤後
    ("2024-03-02 10:00", "2024-03-04", "2024-03-04"),     # 週六
])
def test_event_dates(ts, t0, entry):
    assert cal.event_dates(ts) == (pd.Timestamp(t0), pd.Timestamp(entry))


# ---------- schemas / loader ----------
def test_synthetic_schema_and_flags(syn):
    for t in schemas.TABLES:
        if t == "events":
            continue
        df = syn[t]
        assert df["is_synthetic"].all()
        schemas.validate(t, df)
    n = syn["news_raw"].iloc[0]
    assert n.news_id == schemas.make_news_id(n.source, n.url, n.title)
    assert str(syn["news_raw"].published_at.dt.tz) == "Asia/Taipei"


def test_synthetic_deterministic():
    a = make_synthetic(seed=7, n_tickers=15, years=4)
    b = make_synthetic(seed=7, n_tickers=15, years=4)
    pd.testing.assert_frame_equal(a["prices_daily"], b["prices_daily"])
    pd.testing.assert_frame_equal(a["news_raw"], b["news_raw"])


def test_master_contains_delisted_and_prices_stop(syn):
    m, p = syn["company_master"], syn["prices_daily"]
    dl = m[m.delist_date.notna()]
    assert len(dl) >= 1
    for r in dl.itertuples():
        assert p[p.ticker == r.ticker].date.max() == r.delist_date


def test_price_sanity(syn):
    p = syn["prices_daily"]
    assert (p.high >= p[["open", "close"]].max(axis=1) - 1e-9).all()
    assert (p.low <= p[["open", "close"]].min(axis=1) + 1e-9).all()
    assert (p.close <= p.limit_up_px + 1e-9).all() and (p.close >= p.limit_down_px - 1e-9).all()
    assert p.is_disposition.any() and p.is_suspended.any()


def test_news_noise_present(syn):
    k = syn["news_truth"].kind.value_counts()
    for kind in ["event", "duplicate", "clarification", "market_wrap", "negation", "rumor", "noise"]:
        assert k.get(kind, 0) > 0
    nr = syn["news_raw"]
    assert nr.title.str.contains("[一-鿿]").all()
    assert set(nr.source_tier) == {1, 2}


def test_loader_raw_preferred_then_fallback(tmp_path):
    write_synthetic(tmp_path / "data" / "synthetic", seed=1, n_tickers=8, years=3)
    # 無 raw -> 回退合成 + 警告
    with pytest.warns(UserWarning, match="合成"):
        df = load("company_master", root=tmp_path)
    assert df.is_synthetic.all()
    # 放入 raw csv -> 優先使用，無警告
    raw = tmp_path / "data" / "raw" / "master"
    raw.mkdir(parents=True)
    pd.DataFrame(dict(ticker=["2330"], valid_from=["2000-01-01"], name=["測試"], aliases=["測"], market="TWSE",
                      industry_code="24", list_date="2000-01-01", delist_date=None, has_stock_futures=True,
                      marginable=True, valid_to=None)).to_csv(raw / "company_master.csv", index=False)
    with warnings.catch_warnings():
        warnings.simplefilter("error")
        df = load("company_master", root=tmp_path)
    assert list(df.ticker) == ["2330"] and not df.is_synthetic.any()
    with pytest.raises(FileNotFoundError):
        load("relations", source="raw", root=tmp_path)


# ---------- 植入效果可還原 ----------
def _cars(syn, ar_start_fn, n_days, rows):
    p = syn["prices_daily"].copy()
    p["adj"] = p.close * p.adj_factor
    p["r"] = p.groupby("ticker").adj.pct_change()
    rm = syn["benchmark_daily"].set_index("date").ret
    R = p.pivot(index="date", columns="ticker", values="r")
    days = rm.index
    out = []
    for r in rows:
        a = days.get_loc(ar_start_fn(r))
        y = R[r.ticker].iloc[a - 250:a - 30]
        x = rm.iloc[a - 250:a - 30]
        ok = y.notna()
        if ok.sum() < 120:
            continue
        b, c = np.polyfit(x[ok], y[ok], 1)
        w = slice(a, a + n_days)
        out.append((R[r.ticker].iloc[w] - (c + b * rm.iloc[w])).sum())
    return np.array(out)


def _check(arr, truth, k=2.5):
    se = arr.std(ddof=1) / np.sqrt(len(arr))
    assert len(arr) >= 30
    assert abs(arr.mean() - truth) < k * se, (arr.mean(), truth, se)


def test_planted_event_effects(syn):
    et = syn["events_truth"]
    et = et[~et.is_confounder]
    for tid, days_, truth in [(3, 21, 0.03), (9, 10, -0.02), (4, 10, -0.015), (6, 21, 0.0), (16, 21, 0.0), (19, 21, 0.0)]:
        rows = list(et[et.event_type_id == tid].itertuples())
        _check(_cars(syn, lambda r: r.entry_date, days_, rows), truth)


def test_planted_supplier_lag(syn):
    ef = syn["effects_truth"]
    rows = list(ef[ef.kind == "supplier_lag"].itertuples())
    _check(_cars(syn, lambda r: r.start_date, 20, rows), 0.01)


def test_planted_vol_effect(syn):
    ef = syn["effects_truth"]
    rows = ef[ef.kind == "vol_mult"]
    p = syn["prices_daily"].copy()
    p["r"] = (p.close * p.adj_factor).groupby(p.ticker).pct_change()
    R = p.pivot(index="date", columns="ticker", values="r")
    days = R.index
    ratios = []
    for r in rows.itertuples():
        a = days.get_loc(r.start_date)
        post = R[r.ticker].iloc[a:a + 21].pow(2).mean()
        pre = R[r.ticker].iloc[a - 60:a - 5].pow(2).mean()
        ratios.append(np.sqrt(post / pre))
    assert 1.3 < np.nanmedian(ratios) < 1.9
