"""Offline tests for src/fetch (no network: fixtures + fake HTTP session)."""
import json
import sys
from pathlib import Path

import numpy as np
import pandas as pd
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from src.fetch import announcements as ann  # noqa: E402
from src.fetch import gnews, master, prices, settings as S, taifex  # noqa: E402
from src.fetch._http import Fetcher, FetchError, json_validator  # noqa: E402
from src.fetch._io import num, roc_to_date, save_parquet  # noqa: E402

FX = Path(__file__).parent / "fixtures"
jl = lambda n: json.loads((FX / n).read_text(encoding="utf-8"))  # noqa: E731


# ---------------------------------------------------------------- helpers
def test_roc_and_num():
    assert roc_to_date("113/03/01") == pd.Timestamp("2024-03-01")
    assert roc_to_date("1151119") == pd.Timestamp("2026-11-19")
    assert roc_to_date("20240301") == pd.Timestamp("2024-03-01")
    assert pd.isna(roc_to_date("--"))
    assert num("1,234.5") == 1234.5 and np.isnan(num("--")) and num("X0.00") == 0.0


# ---------------------------------------------------------------- prices
def test_twse_parse_and_limits():
    df = prices.parse_twse_stock_day(jl("twse_stock_day_2330.json"), "2330")
    assert list(df.columns) == prices.COLS and len(df) == 6
    r = df.iloc[0]
    assert r.date == pd.Timestamp("2024-03-01") and r.close == 689 and r.volume == 24167721
    # ref = close - change = 690 -> limits 759 / 621 (tick 5 above 500... 759 is floor to 1.0 tick (500-1000))
    assert (r.limit_up_px, r.limit_down_px) == (759.0, 621.0)
    assert not df.is_suspended.any() and df.adj_factor.isna().all() and not df.is_disposition.any()


def test_twse_empty_and_suspended():
    assert prices.parse_twse_stock_day({"stat": "很抱歉，沒有符合條件的資料!"}, "2330").empty
    p = jl("twse_stock_day_2330.json")
    p["data"][1][1] = "0"; p["data"][1][6] = "--"
    df = prices.parse_twse_stock_day(p, "2330")
    assert bool(df.iloc[1].is_suspended) and np.isnan(df.iloc[1].close)


def test_tpex_parse_units():
    df = prices.parse_tpex_stock_day(jl("tpex_stock_day_6488.json"), "6488")
    assert len(df) == 6 and df.iloc[0].volume == 1851000 and df.iloc[0].turnover == 1030617000
    assert np.isnan(df.iloc[0].limit_up_px) and df.iloc[1].limit_up_px == 616.0   # prev close 560*1.1


def test_limit_price_rules():
    assert prices.limit_prices(100.0, pd.Timestamp("2024-01-02")) == (110.0, 90.0)
    assert prices.limit_prices(100.0, pd.Timestamp("2014-01-02")) == (107.0, 93.0)    # 7% before 2015-06
    assert prices.limit_prices(9.9, pd.Timestamp("2024-01-02")) == (10.85, 8.91)


def test_yahoo_parse():
    df = prices.parse_yahoo_chart(jl("yahoo_chart_2330.json"), "2330", "TWSE")
    assert len(df) == 2 and df.date.iloc[0] == pd.Timestamp("2024-03-01")
    assert abs(df.adj_factor.iloc[0] - 660.8 / 689) < 1e-9 and df.limit_up_px.isna().all()
    assert prices.parse_yahoo_chart({"chart": {"result": None, "error": {"code": "x"}}}, "2330", "TWSE").empty


# ---------------------------------------------------------------- master
def test_master_build():
    tw = master.parse_twse_listed(jl("twse_master.json"))
    tp = master.parse_tpex_listed(jl("tpex_master.json"))
    de = master.parse_twse_delisted(jl("twse_delisted.json"))
    m = master.build_master(tw, tp, de, futures_codes={"2330"})
    assert list(m.columns) == master.COLS
    assert {"2330", "1101", "6488", "1240"} <= set(m.ticker)
    r = m[m.ticker == "2330"].iloc[0]
    assert r.market == "TWSE" and r.industry_code == "24" and r.list_date == pd.Timestamp("1994-09-05") and r.has_stock_futures
    assert m[m.ticker == "6488"].iloc[0].market == "TPEX"
    assert (m.ticker == "2330").sum() == 1                      # delisted dup of a current ticker is dropped
    d = m[m.delist_date.notna()]
    assert len(d) >= 1 and (d.valid_from == master.SENTINEL).all() and (d.valid_to == d.delist_date).all()


# ---------------------------------------------------------------- announcements
def test_material():
    t = ann.parse_material(jl("twse_material.json"), "TWSE")
    assert len(t) == 2 and (t.source_tier == 1).all() and t.published_at.dt.tz is not None
    assert t.title.str.contains(r"\(\d{4}\)").all() and not t.title.str.contains("\n").any()
    assert t.first_seen_at.isna().all() and t.news_id.is_unique and set(t.columns) == set(ann.NEWS_COLS)
    assert ann.parse_material(jl("tpex_material.json"), "TPEX").source.iloc[0] == "tpex_material"
    assert ann.news_id("a", "b", "c") == __import__("hashlib").sha1(b"abc").hexdigest()


def test_revenue():
    news, tab = ann.parse_revenue(jl("twse_revenue.json"), "TWSE")
    assert len(news) == 1 and len(tab) == 1
    r = tab.iloc[0]
    assert r.ticker == "2330" and r.ym == "2026-10" and r.yoy_pct > 50 and r.revenue > 0
    assert news.iloc[0].published_at.hour == 18 and news.iloc[0].time_precision == "date"
    n2, _ = ann.parse_revenue(jl("tpex_revenue.json"), "TPEX")
    assert n2.source.iloc[0] == "tpex_monthly_revenue"


def test_dividend():
    d = ann.parse_dividend(jl("twse_dividend.json"), "TWSE")
    assert len(d) == 2 and d.title.str.contains("現金").all() and (d.ann_type == "dividend").all()
    assert len(ann.parse_dividend(jl("tpex_dividend.json"), "TPEX")) == 2


def test_disposition():
    d = ann.parse_disposition_twse(jl("twse_punish.json"))
    assert list(d.ticker) == ["2466"]                    # warrant (6-digit) filtered
    assert d.iloc[0].start == pd.Timestamp("2026-11-19") and d.iloc[0].end == pd.Timestamp("2026-11-25")
    h = ann.parse_disposition_tpex_hist(jl("tpex_disposal_hist.json"))
    assert list(h.ticker) == ["6666"]                    # '本日無處置資料' rows skipped
    n = ann.disposition_to_news(pd.concat([d, h], ignore_index=True))
    assert len(n) == 2 and (n.ann_type == "disposition").all()


# ---------------------------------------------------------------- gnews
def test_rss():
    df = gnews.parse_rss((FX / "gnews_sample.xml").read_bytes(), "2330", "q")
    assert len(df) == 2 and (df.source_tier == 2).all() and (df.source == "gnews").all()
    r = df[df.publisher == "鉅亨網"].iloc[0]
    assert r.title == "台積電先進封裝廠進駐嘉義 首座新廠5月動工2026年完工"
    assert r.published_at == pd.Timestamp("2024-03-18 15:00", tz="Asia/Taipei")
    assert df.news_id.is_unique


def test_rss_rejects_xml_entities():
    with pytest.raises(FetchError):
        gnews.parse_rss((FX / "gnews_malicious.xml").read_bytes())


# ---------------------------------------------------------------- taifex
def test_futures_csv():
    df = taifex.parse_futures_csv((FX / "taifex_futdata.csv").read_bytes(), "2330")
    assert list(df.columns) == taifex.COLS
    assert len(df) == 3                                  # spread row dropped, after-hours merged
    a = df[(df.instrument == "CDF_202403") & (df.date == pd.Timestamp("2024-03-01"))].iloc[0]
    assert a.settle == 692 and a.oi == 25362 and a.volume == 5695 and a.volume_ah == 507 and a.data_tier == "C"
    s = pd.DataFrame({"date": [pd.Timestamp("2024-03-01")], "close": [690.0]})
    assert taifex.add_basis(df, s).basis.iloc[0] == 2.0


def test_stock_futures_map():
    m = taifex.parse_stock_futures_list((FX / "taifex_stocklist.html").read_bytes())
    h = m[(m.ticker == "2330") & m.is_stock_futures_underlying].sort_values("unit", ascending=False)
    assert h.iloc[0].commodity_code == "CD"              # standard (2000 sh) before mini
    assert "00679B" in set(m.ticker)


# ---------------------------------------------------------------- http layer (fake session)
class FakeResp:
    def __init__(self, status, body=b"", headers=None):
        self.status_code, self.content, self.headers = status, body, headers or {}

    def iter_content(self, n):
        yield self.content

    def close(self):
        pass


class FakeSession:
    def __init__(self, script):
        self.script, self.calls = list(script), []

    def request(self, method, url, **kw):
        self.calls.append((method, url, kw))
        return self.script.pop(0)


def mk(script, tmp_path):
    sleeps = []
    t = {"now": 0.0}
    f = Fetcher(cache_dir=tmp_path, session=FakeSession(script), sleep=lambda s: (sleeps.append(s), t.__setitem__("now", t["now"] + s)),
                clock=lambda: t["now"])
    return f, sleeps


def test_whitelist_blocks(tmp_path):
    f, _ = mk([], tmp_path)
    for u in ("https://example.com/x", "http://www.twse.com.tw/x", "https://evil.twse.com.tw.attacker.io/"):
        with pytest.raises(FetchError):
            f.get(u)
    assert f.session.calls == []


def test_throttle_backoff_cache_and_ua(tmp_path):
    f, sleeps = mk([FakeResp(429, headers={"Retry-After": "2"}), FakeResp(500), FakeResp(200, b'{"a":1}')], tmp_path)
    url = "https://openapi.twse.com.tw/v1/x"
    assert f.get(url, validator=json_validator) == b'{"a":1}'
    assert len(f.session.calls) == 3
    assert f.session.calls[0][2]["headers"]["User-Agent"] == "event-study-research" and f.session.calls[0][2]["allow_redirects"] is False
    assert sleeps[0] >= 1.0                                # throttle between requests
    assert any(s >= 4.0 for s in sleeps) and any(s >= 8.0 for s in sleeps)   # exponential backoff
    assert f.get(url, validator=json_validator) == b'{"a":1}' and len(f.session.calls) == 3   # cache hit
    assert f.n_cache_hits == 1


def test_waf_page_retried_and_not_cached(tmp_path):
    waf = FakeResp(200, b"<html>FOR SECURITY REASONS</html>")
    f, _ = mk([waf, waf, FakeResp(200, b'{"ok":1}')], tmp_path)
    assert f.get("https://www.twse.com.tw/exchangeReport/STOCK_DAY", validator=json_validator) == b'{"ok":1}'
    f2, _ = mk([waf] * 3, tmp_path / "c2")
    with pytest.raises(FetchError):
        f2.get("https://www.twse.com.tw/y", validator=json_validator, max_retries=2)
    assert not list((tmp_path / "c2").rglob("*.bin")) if (tmp_path / "c2").exists() else True


def test_redirect_offsite_rejected(tmp_path):
    f, _ = mk([FakeResp(302, headers={"Location": "https://evil.example.org/"})], tmp_path)
    with pytest.raises(FetchError):
        f.get("https://www.taifex.com.tw/cht/3/futDataDown")
    f, _ = mk([FakeResp(302, headers={"Location": "http://www.taifex.com.tw/file/taifex/404.htm"})], tmp_path / "b")
    with pytest.raises(FetchError):
        f.get("https://www.taifex.com.tw/cht/3/futDataDown")


def test_fetch_prices_graceful_and_resume(tmp_path, monkeypatch):
    """TWSE month fails (WAF) -> skipped & reported, cached months are not refetched."""
    body = (FX / "twse_stock_day_2330.json").read_bytes()
    waf = FakeResp(307, b"<html>blocked</html>")
    f, _ = mk([FakeResp(200, body)] + [waf] * 3, tmp_path)
    df = prices.fetch_twse_stock_day("2330", "2024-03-01", "2024-04-30", f)
    assert len(df) == 6 and df.attrs["failed_months"] == ["2024-04"]
    assert f.session.calls[0][2]["params"]["stockNo"] == "2330"


def test_save_parquet_upsert(tmp_path):
    a = pd.DataFrame({"ticker": ["1"], "date": [pd.Timestamp("2024-01-01")], "v": [1]})
    b = pd.DataFrame({"ticker": ["1", "1"], "date": [pd.Timestamp("2024-01-01"), pd.Timestamp("2024-01-02")], "v": [2, 3]})
    save_parquet(a, "x", "t", ["ticker", "date"], root=tmp_path)
    p = save_parquet(b, "x", "t", ["ticker", "date"], root=tmp_path)
    out = pd.read_parquet(p)
    assert list(out.v) == [2, 3]


def test_settings_safe():
    assert S.USER_AGENT == "event-study-research"
    assert all(h.endswith(("twse.com.tw", "tpex.org.tw", "taifex.com.tw", "yahoo.com", "google.com")) for h in S.ALLOWED_HOSTS)
    assert all(v >= 1.0 for v in S.MIN_INTERVAL.values()) and S.DEFAULT_MIN_INTERVAL >= 1.0
