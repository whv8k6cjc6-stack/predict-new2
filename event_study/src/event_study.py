"""M5 事件研究：市場模型 AR，產業調整對照，多重檢定。

慣例（全部閉區間）
- 報酬：還原價 close*adj_factor 的日報酬（相對該股前一筆），時間軸 = 基準指數交易日
  （截到價格表最後一日）。T0 不在軸上時取其後第一個交易日。
- 事件時間 τ：T0 在軸上的位置記為 a；進場日位置 e，eoff = e - a（0 或 1）。
- 估計窗 τ∈[-250,-31]，有效筆數 >=120 才算；OLS 得 α、β、殘差 σ（自由度 n-2）。
- 視窗：CAR[0,h] = Σ_{τ=0..h} AR；CAR[entry,h] = Σ_{τ=eoff..eoff+h} AR（自進場日起 h+1 個收盤報酬，
  注意：含進場日開盤前的跳空，非完全可交易；可交易報酬以 backtest 為準）；CAR[-10,-1]（h 記為 -1）。
- 視窗超出時間軸（樣本尾端/訓練期截斷）→ 該列不產生（不填補，避免用到未來）。
  時間軸內但個股無報酬（停牌、下市後）→ AR=0（等同以最後成交價結算），列上記 n_filled。
- 產業調整：AR_ind = R_i - 同產業（as-of T0，排除自己）當日等權平均；無同業時退回 R_i - Rm。
檢定（每個 (event_type, sentiment, window, h) 一列）
- 橫斷面 t、BMP（Mikkelson-Partch 預測誤差修正的標準化 CAR）、Kolari-Pynnönen 修正；
  KP 的 r̄ 取「個股估計窗殘差相關 × 事件視窗日曆重疊比例」的配對平均（同股=1，視窗不重疊=0），
  只用估計窗資料，不含事件後資訊。
- Corrado 秩檢定（Campbell-Wasley 多日版；秩在估計窗+事件區間內計算）。
- 以 T0 所在月份為區塊的 bootstrap 95% CI。
- p 值用常態近似（N>=30 才報）。BH-FDR 在同一次呼叫內所有可報告列中進行，
  20/21 視為同一假設（取兩者較大 p，q 值共用）。
"""
import math

import numpy as np
import pandas as pd

from . import get_config

PRE_WINDOW = (-10, -1)
W_T0, W_ENTRY, W_PRE = "CAR[0,h]", "CAR[entry,h]", "CAR[-10,-1]"
_SQRT2 = math.sqrt(2.0)


def p_two_sided(z):
    z = np.asarray(z, float)
    out = np.full(z.shape, np.nan)
    ok = np.isfinite(z)
    out[ok] = [math.erfc(abs(v) / _SQRT2) for v in z[ok]]
    return out


def bh_fdr(p):
    """Benjamini-Hochberg q 值（NaN 不參與）。"""
    p = np.asarray(p, float)
    q = np.full(p.shape, np.nan)
    ok = np.flatnonzero(np.isfinite(p))
    m = len(ok)
    if m == 0:
        return q
    order = ok[np.argsort(p[ok], kind="mergesort")]
    ranked = p[order] * m / np.arange(1, m + 1)
    ranked = np.minimum.accumulate(ranked[::-1])[::-1]
    q[order] = np.minimum(ranked, 1.0)
    return q


# ---------------------------------------------------------------- 輔助
def events_from_truth(events_truth, confound_days=None):
    """合成資料 events_truth -> SPEC events 表（暫代 M3/M4）。
    is_confounded：同股他類事件 T0 相差 <= confound_days 交易日（雙方都標）。"""
    from .calendar import get_calendar
    from .schemas import coerce
    k = confound_days if confound_days is not None else get_config()["thresholds"].get("confound_days", 2)
    et = events_truth.sort_values(["published_at", "ticker", "news_id"]).reset_index(drop=True)
    ev = pd.DataFrame(dict(
        event_id=["T" + str(n)[:12] for n in et.news_id], ticker=et.ticker.astype(str),
        event_type=et.event_type_id.astype(int), sentiment=et.sentiment.astype(int),
        score=et.sentiment.astype(float), rule_id="truth", published_at=et.published_at,
        event_date=pd.to_datetime(et.event_date), entry_date=pd.to_datetime(et.entry_date),
        n_articles=1, news_ids=et.news_id, is_mixed=False, is_confounded=False))
    cal = get_calendar()
    days = cal.trading_days_between(ev.event_date.min() - pd.Timedelta(days=10), ev.event_date.max() + pd.Timedelta(days=10))
    pos = pd.Series(np.arange(len(days)), index=days)
    ev["_i"] = pos.reindex(ev.event_date).to_numpy()
    conf = np.zeros(len(ev), bool)
    for _, g in ev.groupby("ticker"):
        ii, tt, ix = g["_i"].to_numpy(), g.event_type.to_numpy(), g.index.to_numpy()
        for a in range(len(g)):
            near = (np.abs(ii - ii[a]) <= k) & (tt != tt[a])
            if near.any():
                conf[ix[a]] = True
    ev["is_confounded"] = conf
    ev = ev.drop(columns="_i")
    ev["is_synthetic"] = bool(events_truth.get("is_synthetic", pd.Series([False])).all())
    return coerce("events", ev)


def _pick_bench(bench, index_id=None):
    b = bench
    if "index_id" in b.columns and b["index_id"].nunique() > 1:
        want = index_id or ("TAIEX" if (b["index_id"] == "TAIEX").any() else b["index_id"].iloc[0])
        b = b[b["index_id"] == want]
    return b.sort_values("date").drop_duplicates("date")


def return_panel(prices, bench, index_id=None):
    """(dates, tickers, R[D,T], Rm[D])；R 為還原價日報酬。"""
    b = _pick_bench(bench, index_id)
    p = prices[["ticker", "date", "close", "adj_factor"]].copy()
    p["ticker"] = p["ticker"].astype(str)
    p = p.sort_values(["ticker", "date"])
    adj = p["close"] * p["adj_factor"].fillna(1.0)
    p["r"] = adj / adj.groupby(p["ticker"]).shift(1) - 1.0
    dates = pd.DatetimeIndex(b["date"][b["date"] <= p["date"].max()])
    R = p.pivot(index="date", columns="ticker", values="r").reindex(dates)
    Rm = b.set_index("date")["ret"].reindex(dates).to_numpy(float)
    return dates, list(R.columns), R.to_numpy(float), Rm


def _industry_lookup(master):
    """回傳 f(date) -> {ticker: industry_code}（as-of valid_from<=date）。"""
    if master is None or len(master) == 0:
        return lambda d: {}
    m = master[["ticker", "valid_from", "industry_code"]].copy()
    m["ticker"] = m["ticker"].astype(str)
    m = m.sort_values(["ticker", "valid_from"])
    if not m["ticker"].duplicated().any():
        static = dict(zip(m.ticker, m.industry_code))
        vf = dict(zip(m.ticker, m.valid_from))
        return lambda d: {t: c for t, c in static.items() if pd.isna(vf[t]) or vf[t] <= d}
    cache = {}

    def f(d):
        if d not in cache:
            x = m[m.valid_from <= d].groupby("ticker").tail(1)
            cache[d] = dict(zip(x.ticker, x.industry_code))
        return cache[d]
    return f


def _windows(horizons, extra_windows):
    w = [(W_PRE, "t0", PRE_WINDOW[0], PRE_WINDOW[1], -1)]
    for h in horizons:
        w.append((W_T0, "t0", 0, int(h), int(h)))
        w.append((W_ENTRY, "entry", 0, int(h), int(h)))
    for name, (s, e) in (extra_windows or {}).items():
        w.append((name, "t0", int(s), int(e), int(e)))
    return w


# ---------------------------------------------------------------- 主函式
def run_event_study(events, prices, bench, horizons=None, master=None, *, clean_only=True,
                    est_window=None, min_est_obs=None, n_boot=2000, seed=0, extra_windows=None,
                    return_ar=False, fdr_q=None, index_id=None, est_mask=(0, 21)):
    """M5。回傳 (car_panel, stats)。

    events: SPEC events 表（需 event_id, ticker, event_type, sentiment, event_date, entry_date；
            clean_only=True 時剔除 is_confounded / is_mixed）。
    prices/bench: SPEC prices_daily / benchmark_daily。只會用到傳入範圍內的資料；
            呼叫端截斷價格即可保證無前視（超出的視窗直接不產生）。
    master: company_master（產業調整用；None 則產業調整退回市場調整 R-Rm）。
    est_mask: 估計窗中剔除同股「較早」事件（T0_k < T0_i，含不乾淨事件）的 [T0_k+lo, T0_k+hi] 交易日，
            避免他事件效果灌進 α（否則 CAR 系統性偏負）；由最近的事件往前剔除，剩餘筆數會低於
            min_est_obs 時停止（部分剔除）。None=不剔除。
    car_panel: 每 (event, window, h) 一列：car_mm, scar_mm, car_ind, L, n_filled, alpha, beta, sigma, n_est...
               attrs['skipped'] = [(event_id, 原因)]。
    return_ar=True 時回傳 (car_panel, stats, ar)，ar = 進場日起逐日 AR 長表（event_id, date, tau_entry, ar, ar_ind）。
    stats: 每 (event_type, sentiment, window, h) 一列；欄位見 _group_stats 與下方旗標。
    """
    cfg = get_config()
    th = cfg["thresholds"]
    horizons = list(horizons or cfg.get("holding_periods", [10, 20, 21, 42, 63]))
    est = tuple(est_window or th["estimation_window"])
    min_obs = int(min_est_obs or th["min_estimation_obs"])
    q_level = float(fdr_q or th["fdr_q"])

    ev = events.copy()
    ev["ticker"] = ev["ticker"].astype(str)
    all_t0 = {t: np.sort(pd.to_datetime(g["event_date"]).to_numpy()) for t, g in ev.groupby("ticker")}
    if clean_only:
        for c in ("is_confounded", "is_mixed"):
            if c in ev.columns:
                ev = ev[~ev[c].fillna(False).astype(bool)]
    ev = ev.sort_values(["event_date", "event_id"]).reset_index(drop=True)

    dates, tickers, R, Rm = return_panel(prices, bench, index_id)
    D = len(dates)
    col = {t: i for i, t in enumerate(tickers)}
    ind_at = _industry_lookup(master)
    wins = _windows(horizons, extra_windows)
    t_lo = min(PRE_WINDOW[0], min(w[2] for w in wins))
    max_end = max(w[3] for w in wins)          # 進場錨點的視窗還要 + eoff
    n_est_days = est[1] - est[0] + 1

    rows, skipped, kstore, ar_rows = [], [], {}, []
    res_sum = np.zeros((D, len(tickers)))
    res_cnt = np.zeros((D, len(tickers)))
    for r in ev.itertuples(index=False):
        j = col.get(r.ticker)
        if j is None:
            skipped.append((r.event_id, "no_prices")); continue
        a = int(dates.searchsorted(pd.Timestamp(r.event_date)))
        e = int(dates.searchsorted(pd.Timestamp(r.entry_date)))
        if a >= D:
            skipped.append((r.event_id, "t0_beyond_data")); continue
        eoff = e - a
        s0, s1 = a + est[0], a + est[1]
        if s1 < 0:
            skipped.append((r.event_id, "no_estimation")); continue
        lo = max(s0, 0)
        y, x = R[lo:s1 + 1, j], Rm[lo:s1 + 1]
        ok = np.isfinite(y) & np.isfinite(x)
        n_masked = 0
        if est_mask is not None:
            prior = all_t0[r.ticker]
            prior = prior[prior < np.datetime64(pd.Timestamp(r.event_date))]
            if len(prior):
                keep = np.ones(len(y), bool)
                for pk in dates.searchsorted(prior)[::-1]:        # 由近到遠，剩餘不足門檻即停
                    trial = keep.copy()
                    trial[max(pk + est_mask[0] - lo, 0):max(pk + est_mask[1] + 1 - lo, 0)] = False
                    if int((ok & trial).sum()) < min_obs:
                        break
                    keep = trial
                n_masked = int((ok & ~keep).sum())
                ok = ok & keep
        n = int(ok.sum())
        if n < min_obs:
            skipped.append((r.event_id, f"est_obs<{min_obs}")); continue
        xo, yo = x[ok], y[ok]
        xb = xo.mean()
        sxx = float(((xo - xb) ** 2).sum())
        if sxx <= 0:
            skipped.append((r.event_id, "degenerate_market")); continue
        beta = float(((xo - xb) * (yo - yo.mean())).sum() / sxx)
        alpha = float(yo.mean() - beta * xb)
        res = yo - alpha - beta * xo
        sig = float(np.sqrt(res @ res / (n - 2)))
        if not np.isfinite(sig) or sig <= 0:
            skipped.append((r.event_id, "zero_resid_var")); continue
        est_idx = np.arange(lo, s1 + 1)[ok]
        res_sum[est_idx, j] += res
        res_cnt[est_idx, j] += 1

        t_hi = eoff + max_end
        taus = np.arange(t_lo, t_hi + 1)
        idx = a + taus
        in_axis = (idx >= 0) & (idx < D)
        rr = np.full(len(taus), np.nan); rm = np.full(len(taus), np.nan)
        rr[in_axis] = R[idx[in_axis], j]; rm[in_axis] = Rm[idx[in_axis]]
        ar = rr - alpha - beta * rm
        filled = in_axis & ~np.isfinite(rr)
        ar[filled] = 0.0
        # 產業調整
        imap = ind_at(pd.Timestamp(r.event_date))
        code = imap.get(r.ticker)
        peers = [col[t] for t, c in imap.items() if c == code and t != r.ticker and t in col] if code is not None else []
        if peers:
            with np.errstate(all="ignore"):
                pm = np.full(len(taus), np.nan)
                blk = R[idx[in_axis]][:, peers]
                cnt = np.isfinite(blk).sum(1)
                pm[in_axis] = np.where(cnt > 0, np.nansum(blk, 1) / np.maximum(cnt, 1), np.nan)
            pm = np.where(np.isfinite(pm), pm, rm)
        else:
            pm = rm
        ar_ind = rr - pm
        ar_ind[filled] = 0.0
        # Corrado 秩：估計窗殘差 + 事件區間 AR（不含補 0 日）
        k_est = np.full(n_est_days, np.nan)
        ranked_evt = in_axis & ~filled & np.isfinite(ar)
        comb = np.concatenate([res, ar[ranked_evt]])
        rk = pd.Series(comb).rank(method="average").to_numpy() / (len(comb) + 1)
        k_est[(np.arange(lo, s1 + 1) - s0)[ok]] = rk[:n]
        k_evt = np.full(len(taus), np.nan)
        k_evt[ranked_evt] = rk[n:]
        kstore[r.event_id] = (k_est, k_evt)

        base = dict(event_id=r.event_id, ticker=r.ticker, event_type=int(r.event_type), sentiment=int(r.sentiment),
                    event_date=pd.Timestamp(r.event_date), entry_date=pd.Timestamp(r.entry_date), eoff=eoff,
                    alpha=alpha, beta=beta, sigma=sig, n_est=n, n_est_masked=n_masked)
        for (label, anchor, ws, we, h) in wins:
            st = ws + (eoff if anchor == "entry" else 0)
            en = we + (eoff if anchor == "entry" else 0)
            sl = slice(st - t_lo, en - t_lo + 1)
            if not in_axis[sl].all():
                continue        # 視窗超出資料（尾端/截斷）：不產生
            L = en - st + 1
            car = float(ar[sl].sum())
            vf = L + L * L / n + float((rm[sl] - xb).sum()) ** 2 / sxx
            rows.append(dict(base, window=label, h=h, k_start=st - t_lo, L=L, car_mm=car,
                             scar_mm=car / (sig * math.sqrt(vf)), car_ind=float(ar_ind[sl].sum()),
                             n_filled=int(filled[sl].sum()), d_start=a + st, d_end=a + en,
                             start_date=dates[a + st], end_date=dates[a + en]))
        if return_ar:
            m = (taus >= eoff) & in_axis
            ar_rows.append(pd.DataFrame(dict(event_id=r.event_id, date=dates[idx[m]], tau_entry=taus[m] - eoff,
                                             ar=ar[m], ar_ind=ar_ind[m])))

    car_panel = pd.DataFrame(rows)
    car_panel.attrs["skipped"] = list(skipped)
    ar_df = None
    if return_ar:
        ar_df = (pd.concat(ar_rows, ignore_index=True) if ar_rows
                 else pd.DataFrame(columns=["event_id", "date", "tau_entry", "ar", "ar_ind"]))

    def _ret(cp, st):
        return (cp, st, ar_df) if return_ar else (cp, st)
    if car_panel.empty:
        return _ret(car_panel, pd.DataFrame())

    # 估計窗殘差相關（KP 用）
    with np.errstate(all="ignore"):
        resid = pd.DataFrame(np.where(res_cnt > 0, res_sum / np.maximum(res_cnt, 1), np.nan), columns=tickers)
    C = resid.corr(min_periods=60).to_numpy()
    C = np.where(np.isfinite(C), C, 0.0)
    np.fill_diagonal(C, 1.0)

    rng = np.random.default_rng(seed)
    out = []
    for key, g in car_panel.groupby(["event_type", "sentiment", "window", "h"], sort=True):
        out.append(dict(zip(["event_type", "sentiment", "window", "h"], key),
                        **_group_stats(g, kstore, C, col, rng, n_boot, est)))
    stats = pd.DataFrame(out)
    stats = _flags(stats, th, q_level)
    return _ret(car_panel, stats)


# ---------------------------------------------------------------- 統計
def _group_stats(g, kstore, C, col, rng, n_boot, est):
    N = len(g)
    car = g["car_mm"].to_numpy(); scar = g["scar_mm"].to_numpy(); cind = g["car_ind"].to_numpy()
    yrs = g["event_date"].dt.year
    vc = yrs.value_counts()
    o = dict(N=N, n_years=int(vc.size), max_year_share=float(vc.max() / N),
             mean_car=float(car.mean()), median_car=float(np.median(car)),
             sd_car=float(car.std(ddof=1)) if N > 1 else np.nan,
             mean_car_ind=float(cind.mean()))
    if N < 2:
        return o
    o["se_car"] = o["sd_car"] / math.sqrt(N)
    o["t_cs"] = o["mean_car"] / o["se_car"] if o["se_car"] > 0 else np.nan
    sd_ind = cind.std(ddof=1)
    o["t_ind"] = o["mean_car_ind"] / (sd_ind / math.sqrt(N)) if sd_ind > 0 else np.nan
    sd_s = scar.std(ddof=1)
    o["t_bmp"] = scar.mean() * math.sqrt(N) / sd_s if sd_s > 0 else np.nan
    # Kolari-Pynnönen
    ti = np.array([col[t] for t in g["ticker"]])
    s, e = g["d_start"].to_numpy(), g["d_end"].to_numpy()
    L = (e - s + 1).astype(float)
    ov = np.clip(np.minimum(e[:, None], e[None]) - np.maximum(s[:, None], s[None]) + 1, 0, None) / np.sqrt(L[:, None] * L[None])
    M = C[np.ix_(ti, ti)] * ov
    np.fill_diagonal(M, 0.0)
    rbar = max(float(M.sum() / (N * (N - 1))), 0.0)
    o["rbar"] = rbar
    o["t_kp"] = o["t_bmp"] * math.sqrt((1 - rbar) / (1 + (N - 1) * rbar))
    o["p_kp"] = float(p_two_sided(o["t_kp"]))
    # Corrado（Campbell-Wasley 多日）
    Lw = int(g["L"].iloc[0])
    ke = np.vstack([kstore[i][0] for i in g["event_id"]])
    kw = np.vstack([kstore[i][1][k:k + Lw] for i, k in zip(g["event_id"], g["k_start"])])
    with np.errstate(all="ignore"):
        kb_e = np.nanmean(ke, 0) - 0.5
        kb_w = np.nanmean(kw, 0) - 0.5
    dev = np.concatenate([kb_e[np.isfinite(kb_e)], kb_w[np.isfinite(kb_w)]])
    sk = math.sqrt(float((dev ** 2).mean())) if len(dev) else np.nan
    kw_ok = kb_w[np.isfinite(kb_w)]
    o["z_corrado"] = float(kw_ok.sum() / (math.sqrt(len(kw_ok)) * sk)) if sk and len(kw_ok) else np.nan
    o["p_corrado"] = float(p_two_sided(o["z_corrado"]))
    # 事件月區塊 bootstrap
    if n_boot:
        mon = g["event_date"].dt.to_period("M")
        sums = pd.Series(car).groupby(mon.to_numpy()).agg(["sum", "count"])
        S, K = sums["sum"].to_numpy(), sums["count"].to_numpy()
        pick = rng.integers(0, len(S), (n_boot, len(S)))
        bm = S[pick].sum(1) / K[pick].sum(1)
        o["boot_lo"], o["boot_hi"] = (float(v) for v in np.percentile(bm, [2.5, 97.5]))
        o["n_months"] = int(len(S))
    o["agree"] = bool(np.sign(o["mean_car"]) == np.sign(o["mean_car_ind"]) and o["mean_car"] != 0)
    return o


def _merge_key(h, pairs=((20, 21),)):
    for a, b in pairs:
        if h in (a, b):
            return a
    return h


def _flags(stats, th, q_level):
    st = stats.copy()
    for c in ("p_kp", "t_kp", "agree"):
        if c not in st.columns:
            st[c] = np.nan
    st["reportable"] = st["N"] >= th["min_n_report"]
    # BH-FDR：可報告列，20/21 合併為一個假設
    st["_hk"] = [(_merge_key(h) if h >= 0 else h) for h in st["h"]]
    fam = st[st["reportable"] & st["p_kp"].notna()]
    hyp = fam.groupby(["event_type", "sentiment", "window", "_hk"])["p_kp"].max()
    q = pd.Series(bh_fdr(hyp.to_numpy()), index=hyp.index, name="q_fdr")
    st = st.merge(q.reset_index(), on=["event_type", "sentiment", "window", "_hk"], how="left")
    st["sig_fdr"] = st["q_fdr"] <= q_level
    # 相鄰持有期同號（20/21 視為同一節點，兩者都須同號）
    adj = pd.Series(pd.NA, index=st.index, dtype="boolean")
    for _, g in st[st["h"] >= 0].groupby(["event_type", "sentiment", "window"]):
        node_sign = {}
        for h, m in zip(g["h"], g["mean_car"]):
            node_sign.setdefault(_merge_key(h), set()).add(np.sign(m))
        nodes = sorted(node_sign)
        for i_row, h, m in zip(g.index, g["h"], g["mean_car"]):
            k = nodes.index(_merge_key(h))
            nb = [nodes[x] for x in (k - 1, k + 1) if 0 <= x < len(nodes)] + [nodes[k]]
            adj.loc[i_row] = bool(m != 0 and all(node_sign[n] == {np.sign(m)} for n in nb))
    st["adj_same_sign"] = adj
    st["strategy_ok"] = (st["reportable"] & (st["N"] >= th["min_n_strategy"])
                         & (st["n_years"] >= th["min_years_strategy"])
                         & (st["max_year_share"] < th["max_single_year_share"])
                         & st["sig_fdr"].fillna(False).astype(bool)
                         & (st["t_kp"].abs() >= th["strategy_min_abs_t"])
                         & st["agree"].fillna(False).astype(bool)
                         & st["adj_same_sign"].fillna(False).astype(bool))
    return st.drop(columns="_hk")
