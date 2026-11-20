"""M5/M8/M9 驗收測試（合成資料；結果不代表真實市場）。"""
import math
import sys
from pathlib import Path

import numpy as np
import pandas as pd
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from src import get_config  # noqa: E402
from src.backtest import backtest, pre_entry_features, slippage, write_trades, TRADE_COLS  # noqa: E402
from src.calendar import trading_days_between  # noqa: E402
from src.event_study import bh_fdr, events_from_truth, run_event_study, W_ENTRY  # noqa: E402
from src.synthetic import make_synthetic  # noqa: E402
from src.walkforward import deflated_sharpe, make_folds, walk_forward  # noqa: E402

Q = get_config()["thresholds"]["fdr_q"]
NULL_TYPES = [6, 16, 17, 19]


@pytest.fixture(scope="module")
def syn():
    return make_synthetic(seed=42, n_tickers=60, years=7)


@pytest.fixture(scope="module")
def events(syn):
    return events_from_truth(syn["events_truth"])


@pytest.fixture(scope="module")
def es(syn, events):
    return run_event_study(events, syn["prices_daily"], syn["benchmark_daily"], master=syn["company_master"], n_boot=300)


# ======================================================== M5 事件研究
@pytest.mark.parametrize("etype,h,truth", [
    (3, 20, 0.03), (3, 21, 0.03),            # 重大訂單 +3%（entry..entry+20）
    (9, 10, -0.02), (4, 10, -0.015),         # 處置股 / 現增（entry..entry+9）
    (6, 10, 0.0), (6, 20, 0.0), (16, 10, 0.0), (16, 20, 0.0), (19, 10, 0.0), (19, 20, 0.0), (17, 20, 0.0),
])
def test_recover_planted_effects(es, etype, h, truth):
    _, st = es
    r = st[(st.window == W_ENTRY) & (st.event_type == etype) & (st.h == h)].iloc[0]
    assert r.N >= 100
    assert abs(r.mean_car - truth) <= 2 * r.se_car, (r.mean_car, truth, r.se_car)
    if truth:   # 有效果者：各檢定都要顯著、方向正確、bootstrap CI 不含 0、兩模型同向
        assert abs(r.t_kp) > 3 and np.sign(r.t_kp) == np.sign(truth)
        assert abs(r.z_corrado) > 3 and np.sign(r.z_corrado) == np.sign(truth)
        assert (r.boot_lo > 0) if truth > 0 else (r.boot_hi < 0)
        assert r.agree and r.sig_fdr


def test_recover_supplier_lag(syn):
    """供應商滯後 +1%（T0+1..T0+20），以自訂視窗 CAR[1,20] 驗證。"""
    sl = syn["effects_truth"].query("kind == 'supplier_lag'")
    ev = pd.DataFrame(dict(event_id=[f"S{i}" for i in range(len(sl))], ticker=sl.ticker.values, event_type=103,
                           sentiment=1, event_date=sl.t0.values, entry_date=sl.start_date.values))
    _, st = run_event_study(ev, syn["prices_daily"], syn["benchmark_daily"], master=syn["company_master"],
                            horizons=[], extra_windows={"CAR[1,20]": (1, 20)}, n_boot=0, clean_only=False)
    r = st[st.window == "CAR[1,20]"].iloc[0]
    assert r.N >= 100 and abs(r.mean_car - 0.01) <= 2 * r.se_car, (r.mean_car, r.se_car)


def test_null_categories_fdr(es):
    """無效果類別：FDR 後顯著比例 <= q；也不得進策略。"""
    _, st = es
    nul = st[st.event_type.isin(NULL_TYPES) & st.reportable]
    assert len(nul) >= 20
    assert nul.sig_fdr.mean() <= Q
    assert not nul.strategy_ok.any()


def test_placebo_events_fdr(syn):
    """隨機日期/個股的安慰劑事件分 8 個假類別：FDR 後顯著比例 <= q。"""
    rng = np.random.default_rng(3)
    p = syn["prices_daily"]
    days = np.sort(p.date.unique())[300:-80]
    n = 1600
    ev = pd.DataFrame(dict(event_id=[f"P{i}" for i in range(n)], ticker=rng.choice(p.ticker.unique(), n),
                           event_type=rng.integers(100, 108, n), sentiment=1))
    ev["event_date"] = pd.to_datetime(rng.choice(days, n))
    ev["entry_date"] = ev["event_date"]
    ev = ev.merge(p[["ticker", "date"]], left_on=["ticker", "event_date"], right_on=["ticker", "date"]).drop(columns="date")
    _, st = run_event_study(ev, p, syn["benchmark_daily"], master=syn["company_master"], n_boot=0, clean_only=False)
    rep = st[st.reportable]
    assert len(rep) >= 50
    assert rep.sig_fdr.mean() <= Q


def test_bh_fdr_hand():
    p = np.array([0.01, 0.04, 0.03, 0.20, np.nan])
    # 排序 0.01,0.03,0.04,0.20 -> 0.04,0.06,0.0533,0.20 -> 單調化 0.04,0.0533,0.0533,0.20
    np.testing.assert_allclose(bh_fdr(p)[:4], [0.04, 0.16 / 3, 0.16 / 3, 0.20])
    assert np.isnan(bh_fdr(p)[4])


def test_fdr_merges_20_21(es):
    _, st = es
    g = st[(st.window == W_ENTRY) & st.h.isin([20, 21])].groupby(["event_type", "sentiment"])["q_fdr"].nunique()
    assert (g == 1).all()


def test_estimation_window_and_truncation(syn, events):
    p, b = syn["prices_daily"], syn["benchmark_daily"]
    cut = pd.Timestamp("2021-06-30")
    cp, _ = run_event_study(events, p[p.date <= cut], b[b.date <= cut], master=syn["company_master"], n_boot=0)
    assert cp.end_date.max() <= cut                     # 截斷後的視窗不得產生
    assert (cp.n_est >= 120).all()
    assert cp.groupby("event_id").alpha.nunique().max() == 1
    # 估計窗不足 120：上市不久的事件被剔除
    one = events.iloc[[0]].copy()
    one["event_date"] = one["entry_date"] = p.date.min() + pd.Timedelta(days=200)
    cp1, _ = run_event_study(one, p, b, n_boot=0, clean_only=False)
    assert cp1.empty and "est_obs" in cp1.attrs["skipped"][0][1]


def test_kp_adjustment_clustered():
    """同日同股重複事件 -> 視窗完全重疊 -> r̄>0 且 |t_KP| < |t_BMP|。"""
    rng = np.random.default_rng(0)
    days = trading_days_between("2019-01-02", "2020-12-31")
    rm = rng.normal(0, 0.01, len(days))
    rows = []
    for k in range(5):
        r = 0.9 * rm + rng.normal(0, 0.015, len(days))
        r[300:311] += 0.004
        c = 100 * np.cumprod(1 + r)
        rows.append(pd.DataFrame(dict(ticker=f"T{k}", date=days, close=c, adj_factor=1.0)))
    p = pd.concat(rows)
    b = pd.DataFrame(dict(index_id="TAIEX", date=days, ret=rm))
    ev = pd.DataFrame([dict(event_id=f"E{k}_{d}", ticker=f"T{k}", event_type=1, sentiment=1,
                            event_date=days[300], entry_date=days[300]) for k in range(5) for d in range(8)])
    _, st = run_event_study(ev, p, b, horizons=[10], n_boot=0, clean_only=False)
    r = st[st.window == W_ENTRY].iloc[0]
    assert r.rbar > 0.1 and abs(r.t_kp) < abs(r.t_bmp)


# ======================================================== M8 回測：成本對帳與成交規則
def _toy_market():
    """5 檔手工價格：收盤在 100/101 間交替，成交金額固定 1e6（ADV20=1e6）。"""
    days = trading_days_between("2020-01-02", "2021-06-30")
    n = len(days)
    e = 280                                       # 進場日索引
    base = np.where(np.arange(n) % 2 == 0, 100.0, 101.0)
    out = {}
    for tk in ["A", "B", "C", "D", "E"]:
        c = base.copy()
        o = np.r_[c[0], c[:-1]]
        out[tk] = dict(o=o, c=c)
    # A 多：e 開盤 100，e+5 收盤 105
    out["A"]["o"][e] = 100.0; out["A"]["c"][e + 5] = 105.0
    # B 空（融券）：e 開盤 100，e+5 收盤 95；進場日為處置股
    out["B"]["o"][e] = 100.0; out["B"]["c"][e + 5] = 95.0
    # C 多：e 開盤鎖漲停 -> 順延到 e+1 開盤 101
    out["C"]["o"][e] = 101.0 * 1.1; out["C"]["c"][e] = 101.0 * 1.1; out["C"]["o"][e + 1] = 101.0
    # D 多：e 開盤 100，e+2 收盤 96（跌破停損 97.5）-> e+3 開盤 96.5 出場
    out["D"]["o"][e] = 100.0; out["D"]["c"][e + 2] = 96.0; out["D"]["o"][e + 3] = 96.5
    # E 空但不可融券且無期貨 -> 不交易
    rows = []
    for tk, v in out.items():
        c, o = v["c"], v["o"]
        prev = np.r_[c[0], c[:-1]]
        rows.append(pd.DataFrame(dict(
            ticker=tk, date=days, open=o, high=np.maximum(o, c), low=np.minimum(o, c), close=c, adj_factor=1.0,
            volume=1e4, turnover=1e6, limit_up_px=np.round(prev * 1.1, 2), limit_down_px=np.round(prev * 0.9, 2),
            is_suspended=False, is_disposition=(tk == "B") & (np.arange(n) == e))))
    prices = pd.concat(rows, ignore_index=True)
    master = pd.DataFrame(dict(ticker=list(out), valid_from=pd.Timestamp("2000-01-01"), industry_code=["1", "2", "3", "4", "5"],
                               list_date=pd.Timestamp("2000-01-01"), delist_date=pd.NaT,
                               marginable=[True, True, True, True, False], has_stock_futures=False))
    sig = pd.DataFrame(dict(event_id=["eA", "eB", "eC", "eD", "eE"], ticker=list(out), side=[1, -1, 1, 1, -1],
                            entry_date=days[e], h=5, event_type=[3, 9, 3, 3, 9], fold=0))
    return prices, master, sig, days, e


def test_cost_reconciliation_by_hand():
    prices, master, sig, days, e = _toy_market()
    cfg = get_config()["costs"]
    cap = 1e7
    tr, eq = backtest(sig, prices, master=master, capital=cap, thresholds={"universe_min_adv20_twd": 0})
    tr = tr.set_index("event_id")
    cm, tax, fee, lend = cfg["commission_rate"], cfg["securities_tax_sell"], cfg["short_borrow_fee"], cfg["stock_lending_annual"]

    def slip(v, mult=1.0):
        return (cfg["slippage_base_bp"] / 1e4 + cfg["slippage_k"] * math.sqrt(v / 1e6)) * mult

    N = 0.05 * 1e6          # 單筆 <= 5% ADV20 綁定（risk 權重下的金額遠大於 5 萬）
    # A：多單，期滿
    a = tr.loc["eA"]
    assert a.exit_reason == "expiry" and a.exit_date == days[e + 5] and a.entry_px == 100 and a.exit_px == 105
    assert a.notional == pytest.approx(N)
    V = N * 1.05
    cost_a = N * (cm + slip(N)) + V * (cm + tax + slip(V))
    assert a.gross == pytest.approx(0.05) and a.cost * N == pytest.approx(cost_a) and a.net == pytest.approx(0.05 - cost_a / N)
    # B：融券空單，處置股進場滑價 x3，借券年化按日曆天
    b = tr.loc["eB"]
    assert b.route == "margin" and b.side == -1 and b.exit_reason == "expiry"
    Vb = N * 0.95
    dd = (days[e + 5] - days[e]).days
    cost_b = (N * (cm + tax + fee + slip(N, cfg["disposition_slippage_mult"])) + Vb * (cm + slip(Vb))
              + N * lend * dd / 365)
    assert b.gross == pytest.approx(0.05) and b.cost * N == pytest.approx(cost_b)
    # C：開盤鎖漲停不得買 -> 次日開盤
    c = tr.loc["eC"]
    assert c.entry_date == days[e + 1] and c.entry_px == 101.0
    # D：收盤破停損 -> 次日開盤出場
    d = tr.loc["eD"]
    assert d.exit_reason == "stop" and d.exit_date == days[e + 3] and d.exit_px == 96.5
    # E：不可空 -> 不交易
    assert "eE" not in tr.index
    assert ("eE", "not_shortable") in tr.attrs["skipped"]
    # 權益曲線 = 期初 + Σ 淨損益
    assert eq.equity.iloc[-1] - cap == pytest.approx(tr.net_pnl.sum(), rel=1e-9, abs=1e-6)


def test_short_futures_and_lock_exit():
    prices, master, sig, days, e = _toy_market()
    master.loc[master.ticker == "E", "has_stock_futures"] = True
    # A 期滿日收盤鎖跌停 -> 順延到下一個開盤
    i = prices.index[(prices.ticker == "A") & (prices.date == days[e + 5])][0]
    prices.loc[i, ["close", "low"]] = prices.loc[i, "limit_down_px"]
    tr, _ = backtest(sig, prices, master=master, capital=1e7, thresholds={"universe_min_adv20_twd": 0})
    tr = tr.set_index("event_id")
    assert tr.loc["eE", "route"] == "futures"
    N, V = tr.loc["eE", "notional"], tr.loc["eE", "notional"] * (1 - tr.loc["eE", "gross"])
    cfg = get_config()["costs"]
    ce = N * (cfg["futures_tax_per_side"] + slippage(N, 1e6, cfg))
    cx = V * (cfg["futures_tax_per_side"] + slippage(V, 1e6, cfg))
    assert tr.loc["eE", "cost"] * N == pytest.approx(ce + cx)
    assert tr.loc["eA", "exit_date"] == days[e + 6] and tr.loc["eA", "exit_reason"] == "expiry"


def test_position_caps_and_no_pyramiding():
    prices, master, sig, days, e = _toy_market()
    big = prices.assign(turnover=1e12)                 # 取消 ADV 上限，讓權重上限生效
    s2 = pd.concat([sig, sig.assign(event_id=lambda d: d.event_id + "_dup")])   # 同股重複訊號
    tr, _ = backtest(s2, big, master=master.assign(industry_code="1"), capital=1e7, risk_unit=1.0,
                     strategy_cfg={"max_weight_industry": 0.12}, thresholds={"universe_min_adv20_twd": 0})
    w = tr.set_index("event_id").weight
    assert w["eA"] == pytest.approx(0.05) and w["eB"] == pytest.approx(0.05)    # 單檔上限 5%
    assert w["eD"] == pytest.approx(0.02, rel=1e-6)                            # 產業上限 12% 只剩 2%
    assert "eC" not in w.index and ("eC", "exposure_cap") in tr.attrs["skipped"]
    assert not tr.event_id.str.endswith("_dup").any()                          # 同股不加碼
    assert ("eA_dup", "already_in_position") in tr.attrs["skipped"]


def test_trades_schema_parquet(tmp_path):
    prices, master, sig, days, e = _toy_market()
    tr, _ = backtest(sig, prices, master=master, thresholds={"universe_min_adv20_twd": 0})
    assert list(tr.columns[:len(TRADE_COLS)]) == TRADE_COLS
    p = write_trades(tr, tmp_path / "trades.parquet")
    back = pd.read_parquet(p)
    assert list(back.columns[:len(TRADE_COLS)]) == TRADE_COLS and len(back) == len(tr)


def test_pre_entry_features_causal(syn):
    p = syn["prices_daily"]
    p = p[p.ticker.isin(p.ticker.unique()[:5])]
    cut = pd.Timestamp("2020-06-30")
    f0 = pre_entry_features(p)
    f1 = pre_entry_features(_shuffle_after(p, cut, seed=1))
    k = ["ticker", "date"]
    a = f0[f0.date <= cut + pd.Timedelta(days=1)].sort_values(k).reset_index(drop=True)
    b = f1[f1.date <= cut + pd.Timedelta(days=1)].sort_values(k).reset_index(drop=True)
    pd.testing.assert_frame_equal(a, b)


# ======================================================== M9 walk-forward：前視與封存
def _shuffle_after(df, cut, seed, cols=("open", "high", "low", "close", "volume", "turnover", "limit_up_px",
                                        "limit_down_px", "is_disposition", "is_suspended", "adj_factor")):
    rng = np.random.default_rng(seed)
    df = df.copy()
    for _, idx in df[df.date > cut].groupby("ticker").groups.items():
        perm = rng.permutation(np.asarray(idx))
        df.loc[idx, list(cols)] = df.loc[perm, list(cols)].to_numpy()
    return df


WF_KW = dict(n_boot=0, capital_scales=[], market_neutral=False)


@pytest.fixture(scope="module")
def wf(syn, events):
    return walk_forward(events, syn["prices_daily"], syn["benchmark_daily"], syn["company_master"], **WF_KW)


def test_make_folds_geometry(syn):
    d = pd.DatetimeIndex(sorted(syn["benchmark_daily"].date))
    folds, hold = make_folds(d, 3, 1, 63, 1)
    assert len(folds) >= 2 and hold is not None
    pos = pd.Series(np.arange(len(d)), index=d)
    for f in folds.to_dict("records") + [hold]:
        assert pos[f["test_start"]] - pos[f["train_end"]] - 1 == 63            # 禁區 63 交易日
        assert f["train_end"] - f["train_start"] <= pd.Timedelta(days=366 * 3)
    assert (folds.test_start.iloc[1:].to_numpy() > folds.test_end.iloc[:-1].to_numpy()).all()
    assert folds.test_end.max() < hold["test_start"]


def test_lookahead_shuffle_after_t0(syn, events, wf):
    """T0（=C）之後價格與指數全打亂：T0<=C 的事件訊號（含進場前特徵）、各 fold 規則、
    以及 C 之前已結束的樣本外交易完全不變。"""
    f1 = wf["folds"].iloc[-1]
    C = f1.test_start + pd.Timedelta(days=180)
    p2 = _shuffle_after(syn["prices_daily"], C, seed=7)
    b = syn["benchmark_daily"].copy()
    m = b.date > C
    b.loc[m, "ret"] = np.random.default_rng(8).permutation(b.loc[m, "ret"].to_numpy())
    wf2 = walk_forward(events, p2, b, syn["company_master"], **WF_KW)
    pd.testing.assert_frame_equal(wf["rules"], wf2["rules"])
    k = ["event_id"]
    s1 = wf["signals_oos"].query("event_date <= @C").sort_values(k).reset_index(drop=True)
    s2 = wf2["signals_oos"].query("event_date <= @C").sort_values(k).reset_index(drop=True)
    assert len(s1) > 20
    pd.testing.assert_frame_equal(s1, s2)
    t1 = wf["trades_oos"].query("exit_date <= @C").sort_values(k).reset_index(drop=True)
    t2 = wf2["trades_oos"].query("exit_date <= @C").sort_values(k).reset_index(drop=True)
    assert len(t1) > 20
    pd.testing.assert_frame_equal(t1, t2)
    # 打亂確實有影響之後的結果（測試本身有效）
    assert not wf["trades_oos"].net.sum() == pytest.approx(wf2["trades_oos"].net.sum())


def test_holdout_not_used_in_training(syn, events, wf, tmp_path):
    hs = wf["holdout_fold"]["test_start"]
    assert (wf["folds"].train_data_max_date < hs).all()
    assert wf["trades_oos"].exit_date.max() < hs and wf["signals_oos"].entry_date.max() < hs
    # 封存年價格亂改、封存年事件刪掉：非封存結果完全不變
    p2 = _shuffle_after(syn["prices_daily"], hs - pd.Timedelta(days=1), seed=11)
    p2.loc[p2.date >= hs, ["open", "high", "low", "close"]] *= 1.7
    e2 = events[events.entry_date < hs]
    wf2 = walk_forward(e2, p2, syn["benchmark_daily"], syn["company_master"], **WF_KW)
    pd.testing.assert_frame_equal(wf["rules"], wf2["rules"])
    pd.testing.assert_frame_equal(wf["trades_oos"].reset_index(drop=True), wf2["trades_oos"].reset_index(drop=True))
    # 封存年只跑一次
    lock = tmp_path / "lock.json"
    wf3 = walk_forward(events, syn["prices_daily"], syn["benchmark_daily"], syn["company_master"],
                       run_holdout=True, lock_path=lock, **WF_KW)
    assert lock.exists() and "metrics" in wf3["holdout"]
    with pytest.raises(RuntimeError, match="只能跑一次"):
        walk_forward(events, syn["prices_daily"], syn["benchmark_daily"], syn["company_master"],
                     run_holdout=True, lock_path=lock, **WF_KW)


def test_walkforward_selects_true_effects_only(wf):
    sel = wf["rules"][wf["rules"].selected]
    assert set(sel.event_type) <= {3, 4, 9}                 # 只會選到植入效果的類別
    assert 3 in set(sel.event_type)
    assert (sel[sel.event_type == 3].side == 1).all() and (sel[sel.event_type.isin([4, 9])].side == -1).all()
    m = wf["metrics"]["oos"]
    for k in ("sharpe", "sortino", "mdd", "calmar", "win_rate", "payoff_ratio", "turnover_annual",
              "cost_share_of_gross", "by_side", "by_event_type", "deflated_sharpe"):
        assert k in m


def test_deflated_sharpe_basic():
    rng = np.random.default_rng(0)
    r = rng.normal(0.001, 0.01, 1000)
    a = deflated_sharpe(r, rng.normal(0, 0.02, 10))
    b = deflated_sharpe(r, rng.normal(0, 0.02, 1000), n_trials=1000)
    assert 0 <= b["dsr"] < a["dsr"] <= 1                    # 試驗越多，DSR 越低
