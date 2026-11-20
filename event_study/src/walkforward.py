"""M9 Walk-forward：訓練 3 年 / 測試 1 年 / 禁區 63 交易日 / 最後 1 年封存只跑一次。

防前視設計
- 每個 fold 的訓練只拿 date <= train_end 的價格與基準（run_event_study 遇到超出資料的視窗直接不產生，
  等同 purge：標籤未在 train_end 前結束的事件不進訓練），訓練事件 T0 ∈ [train_start, train_end]。
- 訓練期與測試期之間隔 embargo 個交易日。
- 測試期訊號只用：訓練期選出的 (類別, 方向, 持有期 h*)、事件本身欄位（不用 is_confounded/is_mixed，
  因其定義含 T0 之後 2 日的資訊）、以及進場日之前的價格特徵。
- 非封存的樣本外回測價格截在封存年開始前一日（持倉在該日收盤強制平倉），封存年資料完全不被讀取。
- 封存年：run_holdout=True 時才跑，跑完寫 lock 檔，之後再跑會 raise（只跑一次）。
"""
import hashlib
import json
import math
from datetime import datetime, timezone
from pathlib import Path
from statistics import NormalDist

import numpy as np
import pandas as pd

from . import PROJECT_ROOT, get_config
from .backtest import _cfgs, backtest, pre_entry_features
from .event_study import W_ENTRY, _merge_key, _pick_bench, run_event_study

PERIODS = 245
_ND = NormalDist()


# ---------------------------------------------------------------- fold 切分
def make_folds(dates, train_y=3, test_y=1, embargo=63, holdout_y=1):
    """回傳 (folds DataFrame, holdout dict)。全部以交易日 dates 為準，日期閉區間。"""
    dates = pd.DatetimeIndex(sorted(pd.DatetimeIndex(dates).unique()))
    end = dates[-1]
    i_hs = int(dates.searchsorted(end - pd.DateOffset(years=holdout_y), side="right"))

    def fold_for(i_ts, i_te):
        i_tr_end = i_ts - embargo - 1
        if i_tr_end < 0:
            return None
        tr_end = dates[i_tr_end]
        lo = tr_end - pd.DateOffset(years=train_y)
        if lo < dates[0]:
            return None
        return dict(train_start=dates[int(dates.searchsorted(lo, side="right"))], train_end=tr_end,
                    test_start=dates[i_ts], test_end=dates[i_te], embargo_days=i_ts - i_tr_end - 1)

    folds, i_next = [], i_hs
    while True:
        i_ts = int(dates.searchsorted(dates[i_next] - pd.DateOffset(years=test_y)))
        if i_ts >= i_next:
            break
        f = fold_for(i_ts, i_next - 1)
        if f is None:
            break
        folds.append(f)
        i_next = i_ts
    folds = pd.DataFrame(folds[::-1])
    folds.insert(0, "fold", range(len(folds)))
    hold = fold_for(i_hs, len(dates) - 1)
    if hold is not None:
        hold["fold"] = "holdout"
    return folds, hold


# ---------------------------------------------------------------- 規則選擇
def est_round_trip_cost(side, h, costs, impact=0.0):
    """訓練期估計的來回成本（比例）。impact = 每邊額外衝擊（k·sqrt(下單額/ADV) 的估計）。"""
    slip = 2 * (costs["slippage_base_bp"] / 1e4 + impact)
    c = 2 * costs["commission_rate"] + costs["securities_tax_sell"] + slip
    if side < 0:
        c += costs["short_borrow_fee"] + costs["stock_lending_annual"] * (h * 365 / PERIODS) / 365
    return c


def select_rules(stats, costs, impact=0.0, window=W_ENTRY):
    """每個 (event_type, sentiment)：h* = argmax_h (side·CAR[entry,h] - 成本)/h，限成本後為正且相鄰持有期同號；
    selected = h* 那一列 strategy_ok（N/年度/FDR/|t|/模型同向/相鄰同號）。"""
    out = []
    st = stats[(stats["window"] == window) & (stats["h"] > 0)]
    for (typ, sen), g in st.groupby(["event_type", "sentiment"]):
        best = None
        for r in g.itertuples(index=False):
            if not (pd.notna(r.adj_same_sign) and bool(r.adj_same_sign)) or not np.isfinite(r.mean_car):
                continue
            side = int(np.sign(r.mean_car))
            if side == 0:
                continue
            net = side * r.mean_car - est_round_trip_cost(side, r.h, costs, impact)
            score = net / r.h
            if net > 0 and (best is None or score > best["score"]):
                best = dict(event_type=int(typ), sentiment=int(sen), side=side, h=int(r.h), N=int(r.N),
                            mean_car=r.mean_car, net_car=net, score=score, t_kp=r.t_kp, q_fdr=r.q_fdr,
                            strategy_ok=bool(r.strategy_ok))
        if best is None:
            r0 = g.iloc[0]
            best = dict(event_type=int(typ), sentiment=int(sen), side=0, h=np.nan, N=int(r0.N), mean_car=np.nan,
                        net_car=np.nan, score=np.nan, t_kp=np.nan, q_fdr=np.nan, strategy_ok=False)
        best["selected"] = bool(best["strategy_ok"] and best["side"] != 0)
        out.append(best)
    return pd.DataFrame(out)


def make_signals(events, rules, prices, start, end, fold=None):
    """測試期訊號：entry_date ∈ [start,end] 且 (event_type, sentiment) 被選中的事件。
    附上進場前特徵（sigma60/atr20/adv20，只用 entry_date 之前的價格），供前視檢查與部位計算對照。"""
    sel = rules[rules["selected"]] if len(rules) else rules
    cols = ["event_id", "ticker", "event_type", "sentiment", "event_date", "entry_date", "side", "h", "fold"]
    if len(sel) == 0:
        return pd.DataFrame(columns=cols + ["sigma60", "atr20", "adv20"])
    ev = events[(events["entry_date"] >= pd.Timestamp(start)) & (events["entry_date"] <= pd.Timestamp(end))]
    sig = ev.merge(sel[["event_type", "sentiment", "side", "h"]], on=["event_type", "sentiment"], how="inner")
    sig["fold"] = fold
    sig["ticker"] = sig["ticker"].astype(str)
    sig = sig[cols].sort_values(["entry_date", "event_id"]).reset_index(drop=True)
    tickers = set(sig["ticker"])
    pp = prices[(prices["ticker"].astype(str).isin(tickers)) & (prices["date"] < pd.Timestamp(end) + pd.Timedelta(days=1))]
    f = pre_entry_features(pp)
    f = f[["ticker", "date", "sigma60", "atr20", "adv20"]].rename(columns={"date": "entry_date"})
    return sig.merge(f, on=["ticker", "entry_date"], how="left")


# ---------------------------------------------------------------- 績效
def perf_metrics(equity, trades, capital=None, periods=PERIODS):
    capital = capital or equity.attrs.get("capital") or equity["equity"].iloc[0]
    out = {}
    if len(equity) < 2:
        return out
    r = equity["ret"].to_numpy()
    yrs = len(r) / periods
    total = equity["equity"].iloc[-1] / capital - 1
    sd = r.std(ddof=1)
    dn = math.sqrt(np.mean(np.minimum(r, 0) ** 2))
    curve = equity["equity"]
    mdd = float((curve / curve.cummax() - 1).min())
    ann = (1 + total) ** (1 / yrs) - 1 if total > -1 else -1.0
    out.update(total_return=total, ann_return=ann, ann_vol=sd * math.sqrt(periods),
               sharpe=r.mean() / sd * math.sqrt(periods) if sd > 0 else np.nan,
               sortino=r.mean() * periods / (dn * math.sqrt(periods)) if dn > 0 else np.nan,
               mdd=mdd, calmar=ann / abs(mdd) if mdd < 0 else np.nan, n_days=len(r),
               skew=float(pd.Series(r).skew()), kurt=float(pd.Series(r).kurt() + 3))
    if trades is not None and len(trades):
        t = trades
        win, loss = t["net"] > 0, t["net"] < 0
        exit_val = t["notional"] * (1 + t["side"] * t["gross"])
        gross_pnl, cost_pnl = t["gross_pnl"].sum(), (t["gross_pnl"] - t["net_pnl"]).sum()
        out.update(n_trades=len(t), win_rate=float(win.mean()),
                   payoff_ratio=float(t.loc[win, "net"].mean() / abs(t.loc[loss, "net"].mean())) if win.any() and loss.any() else np.nan,
                   profit_factor=float(t.loc[win, "net_pnl"].sum() / abs(t.loc[loss, "net_pnl"].sum())) if loss.any() else np.nan,
                   turnover_annual=float((t["notional"].sum() + exit_val.sum()) / 2 / curve.mean() / yrs),
                   gross_pnl=float(gross_pnl), cost_pnl=float(cost_pnl), net_pnl=float(t["net_pnl"].sum()),
                   cost_share_of_gross=float(cost_pnl / gross_pnl) if gross_pnl > 0 else np.nan,
                   avg_net_per_trade=float(t["net"].mean()))
        out["by_side"] = {("long" if s > 0 else "short"): dict(n=int(len(g)), net_pnl=float(g["net_pnl"].sum()),
                                                               gross_pnl=float(g["gross_pnl"].sum()),
                                                               win_rate=float((g["net"] > 0).mean()),
                                                               avg_net=float(g["net"].mean()))
                          for s, g in t.groupby("side")}
        out["by_event_type"] = {int(k): dict(n=int(len(g)), net_pnl=float(g["net_pnl"].sum()),
                                             share_of_net=float(g["net_pnl"].sum() / t["net_pnl"].sum()) if t["net_pnl"].sum() else np.nan)
                                for k, g in t.groupby("event_type")}
        out["exit_reasons"] = t["exit_reason"].value_counts().to_dict()
    return out


def deflated_sharpe(returns, trial_srs, n_trials=None):
    """Bailey & López de Prado (2014)。returns：日報酬；trial_srs：各試驗的日 Sharpe（同頻率）。
    回傳 dict(dsr, sr, sr0, n_trials, var_trials)。"""
    r = np.asarray(returns, float)
    r = r[np.isfinite(r)]
    T = len(r)
    if T < 10 or r.std(ddof=1) == 0:
        return dict(dsr=np.nan)
    sr = r.mean() / r.std(ddof=1)
    srs = np.asarray([x for x in trial_srs if np.isfinite(x)], float)
    N = int(n_trials or len(srs))
    v = float(srs.var(ddof=1)) if len(srs) > 1 else 0.0
    g = 0.5772156649
    sr0 = math.sqrt(v) * ((1 - g) * _ND.inv_cdf(1 - 1 / N) + g * _ND.inv_cdf(1 - 1 / (N * math.e))) if N > 1 else 0.0
    sk = float(pd.Series(r).skew()); ku = float(pd.Series(r).kurt() + 3)
    den = 1 - sk * sr + (ku - 1) / 4 * sr ** 2
    z = (sr - sr0) * math.sqrt(T - 1) / math.sqrt(den) if den > 0 else np.nan
    return dict(dsr=_ND.cdf(z) if np.isfinite(z) else np.nan, sr_daily=sr, sr0_daily=sr0, n_trials=N,
                var_trials=v, T=T)


def _trial_sharpes(car_panel, stats, ar, train_dates):
    """每個候選 (類別, 方向, h 節點) 的日曆時間組合（當日在持有窗內事件的方向調整 AR 均值，無事件=0）日 Sharpe。"""
    if ar is None or ar.empty:
        return []
    meta = car_panel.drop_duplicates("event_id").set_index("event_id")[["event_type", "sentiment"]]
    ar = ar.join(meta, on="event_id")
    st = stats[(stats["window"] == W_ENTRY) & (stats["h"] > 0)]
    out = []
    for (typ, sen), g in st.groupby(["event_type", "sentiment"]):
        a = ar[(ar["event_type"] == typ) & (ar["sentiment"] == sen)]
        for hk in sorted({_merge_key(h) for h in g["h"]}):
            row = g[g["h"] == hk]
            if row.empty or not np.isfinite(row["mean_car"].iloc[0]):
                continue
            side = np.sign(row["mean_car"].iloc[0]) or 1.0
            daily = side * a[a["tau_entry"] <= hk].groupby("date")["ar"].mean()
            daily = daily.reindex(train_dates).fillna(0.0)
            if daily.std() > 0:
                out.append(float(daily.mean() / daily.std()))
    return out


# ---------------------------------------------------------------- 主流程
def _data_hash(events, prices):
    h = hashlib.sha1()
    h.update(",".join(sorted(map(str, events["event_id"]))).encode())
    h.update(f"{prices['date'].min()}|{prices['date'].max()}|{len(prices)}|{float(prices['close'].sum()):.6f}".encode())
    return h.hexdigest()


def _train_fold(f, events, prices, bench, master, horizons, costs, n_boot, impact_mult, capital):
    tr_end = pd.Timestamp(f["train_end"])
    p_tr = prices[prices["date"] <= tr_end]
    b_tr = bench[bench["date"] <= tr_end]
    ev_tr = events[(events["event_date"] >= pd.Timestamp(f["train_start"])) & (events["event_date"] <= tr_end)]
    car_panel, stats, ar = run_event_study(ev_tr, p_tr, b_tr, horizons, master, n_boot=n_boot, return_ar=True)
    # 衝擊估計：典型部位(2.5%×資金)相對訓練期 ADV20 中位數
    adv = pre_entry_features(p_tr[p_tr["date"] >= pd.Timestamp(f["train_start"])])["adv20"].median()
    impact = costs["slippage_k"] * math.sqrt(0.025 * capital / adv) * impact_mult if adv and adv > 0 else 0.0
    rules = select_rules(stats, costs, impact) if len(stats) else pd.DataFrame(
        columns=["event_type", "sentiment", "side", "h", "selected"])
    td = pd.DatetimeIndex(sorted(b_tr["date"][b_tr["date"] >= pd.Timestamp(f["train_start"])].unique()))
    trials = _trial_sharpes(car_panel, stats, ar, td) if len(stats) else []
    info = dict(train_data_max_date=max(p_tr["date"].max(), b_tr["date"].max()),
                n_train_events=int(len(ev_tr)), n_train_used=int(car_panel["event_id"].nunique()) if len(car_panel) else 0,
                impact_est=impact)
    return rules, stats, trials, info


def walk_forward(events, prices, bench, master=None, *, cost_cfg=None, strategy_cfg=None, train_y=3, test_y=1,
                 embargo=63, holdout_y=1, horizons=None, capital=1e7, n_boot=500, run_holdout=False,
                 lock_path=None, capital_scales=None, market_neutral=True, impact_mult=1.0, index_id=None):
    """M9。回傳 dict：folds, rules, stats(各 fold), signals_oos, trades_is/equity_is, trades_oos/equity_oos,
    metrics(is 各 fold / oos / capacity / market_neutral / dsr), 以及 run_holdout=True 時的 holdout 結果。"""
    cfg = get_config()
    wf = cfg["strategy"].get("walk_forward", {})
    train_y = train_y or wf.get("train_years", 3)
    embargo = embargo if embargo is not None else wf.get("embargo_days", 63)
    costs, _, _ = _cfgs(cost_cfg, strategy_cfg, None)
    horizons = list(horizons or cfg.get("holding_periods", [10, 20, 21, 42, 63]))
    capital_scales = capital_scales if capital_scales is not None else cfg["costs"].get("capital_scales", [])
    bench = _pick_bench(bench, index_id)
    events = events.copy()
    events["ticker"] = events["ticker"].astype(str)
    dates = pd.DatetimeIndex(sorted(set(bench["date"]) & set(prices["date"])))
    folds, hold = make_folds(dates, train_y, test_y, embargo, holdout_y)
    if folds.empty:
        raise ValueError("資料長度不足以切出任何 walk-forward fold")
    hs = pd.Timestamp(hold["test_start"]) if hold else dates[-1] + pd.Timedelta(days=1)

    # 非封存部分：所有資料截在封存年之前
    p_pre = prices[prices["date"] < hs]
    b_pre = bench[bench["date"] < hs]
    e_pre = events[events["entry_date"] < hs]
    bt_kw = dict(cost_cfg=cost_cfg, master=master, strategy_cfg=strategy_cfg)

    rules_all, stats_all, sig_all, trials_all, info_rows = [], {}, [], [], []
    tr_is, eq_is, met_is = [], {}, {}
    for f in folds.to_dict("records"):
        k = f["fold"]
        rules, stats, trials, info = _train_fold(f, e_pre, p_pre, b_pre, master, horizons, costs, n_boot,
                                                 impact_mult, capital)
        assert info["train_data_max_date"] < hs, "訓練資料觸及封存年"
        info_rows.append(info)
        rules_all.append(rules.assign(fold=k))
        stats_all[k] = stats
        trials_all += trials
        sig_all.append(make_signals(e_pre, rules, p_pre, f["test_start"], f["test_end"], fold=k))
        # 樣本內：同一套規則套在訓練期（價格截到 train_end）
        sig_is = make_signals(e_pre, rules, p_pre, f["train_start"], f["train_end"], fold=k)
        p_tr = p_pre[p_pre["date"] <= f["train_end"]]
        e_tr = e_pre[e_pre["entry_date"] <= f["train_end"]]
        t_i, q_i = backtest(sig_is, p_tr, events=e_tr, capital=capital, start=f["train_start"], end=f["train_end"], **bt_kw)
        tr_is.append(t_i); eq_is[k] = q_i
        met_is[k] = perf_metrics(q_i, t_i, capital)
    folds = pd.concat([folds, pd.DataFrame(info_rows)], axis=1)
    rules_all = pd.concat(rules_all, ignore_index=True)
    signals_oos = pd.concat(sig_all, ignore_index=True)
    oos_start, oos_end = folds["test_start"].min(), folds["test_end"].max()
    p_oos = p_pre[p_pre["date"] <= oos_end]
    t_o, q_o = backtest(signals_oos, p_oos, events=e_pre, capital=capital, start=oos_start, end=oos_end, **bt_kw)
    metrics = dict(is_by_fold=met_is, oos=perf_metrics(q_o, t_o, capital))
    n_trials = len(trials_all)
    metrics["oos"]["deflated_sharpe"] = deflated_sharpe(q_o["ret"], trials_all, n_trials)
    metrics["oos_by_fold"] = {}
    for k, g in t_o.groupby("fold"):
        f = folds[folds["fold"] == k].iloc[0]
        qq = q_o[(q_o["date"] >= f["test_start"]) & (q_o["date"] <= f["test_end"])].copy()
        qq["equity"] = (1 + qq["ret"]).cumprod() * capital
        metrics["oos_by_fold"][int(k)] = perf_metrics(qq, g, capital)
    if capital_scales:
        metrics["capacity"] = {}
        for cap in capital_scales:
            t_c, q_c = backtest(signals_oos, p_oos, events=e_pre, capital=cap, start=oos_start, end=oos_end, **bt_kw)
            m = perf_metrics(q_c, t_c, cap)
            metrics["capacity"][cap] = {k2: m.get(k2) for k2 in ("ann_return", "sharpe", "mdd", "n_trades", "cost_share_of_gross")}
    if market_neutral:
        t_h, q_h = backtest(signals_oos, p_oos, events=e_pre, capital=capital, start=oos_start, end=oos_end,
                            hedge=True, bench=b_pre, **bt_kw)
        metrics["market_neutral"] = {k2: v for k2, v in perf_metrics(q_h, t_h, capital).items()
                                     if not isinstance(v, dict)}
    res = dict(folds=folds, holdout_fold=hold, rules=rules_all, stats=stats_all, signals_oos=signals_oos,
               trades_is=pd.concat(tr_is, ignore_index=True), equity_is=eq_is, trades_oos=t_o, equity_oos=q_o,
               metrics=metrics, n_trials=n_trials, is_synthetic=bool(prices.get("is_synthetic", pd.Series([False])).any()))
    if run_holdout:
        res["holdout"] = run_holdout_once(events, prices, bench, master, hold, horizons=horizons, costs=costs,
                                          n_boot=n_boot, impact_mult=impact_mult, capital=capital, lock_path=lock_path,
                                          trials=trials_all, bt_kw=bt_kw)
    return res


def run_holdout_once(events, prices, bench, master, hold, *, horizons, costs, n_boot, impact_mult, capital,
                     lock_path=None, trials=(), bt_kw=None):
    """封存年：只跑一次。lock 檔存在即拒絕。"""
    if hold is None:
        raise ValueError("沒有封存年可跑")
    lock = Path(lock_path) if lock_path else PROJECT_ROOT / "reports" / "holdout_lock.json"
    if lock.exists():
        raise RuntimeError(f"封存年已跑過（{lock}）；只能跑一次。若確需重跑，請人工刪除 lock 並記錄原因。")
    lock.parent.mkdir(parents=True, exist_ok=True)
    lock.write_text(json.dumps(dict(run_at=datetime.now(timezone.utc).isoformat(), holdout_start=str(hold["test_start"]),
                                    holdout_end=str(hold["test_end"]), data_hash=_data_hash(events, prices)),
                               ensure_ascii=False, indent=1), encoding="utf-8")
    rules, stats, tr, info = _train_fold(hold, events, prices, bench, master, horizons, costs, n_boot,
                                         impact_mult, capital)
    sig = make_signals(events, rules, prices, hold["test_start"], hold["test_end"], fold="holdout")
    t, q = backtest(sig, prices, events=events, capital=capital, start=hold["test_start"], end=hold["test_end"],
                    **(bt_kw or {}))
    m = perf_metrics(q, t, capital)
    m["deflated_sharpe"] = deflated_sharpe(q["ret"], list(trials) + tr)
    return dict(rules=rules, info=info, signals=sig, trades=t, equity=q, metrics=m, lock=str(lock))
