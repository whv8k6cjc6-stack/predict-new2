"""M8 回測：逐日模擬（開盤 → 收盤），無前視。

時序與成交規則
- 進場：訊號 entry_date 開盤以原始開盤價成交。開盤 >= 漲停價不得買、<= 跌停價不得賣（含融券賣出），
  停牌不得成交；不可成交則順延到下一個交易日開盤，最多 max_entry_delay 日，超過放棄。
- 出場（先到先出）：
  * 期滿：第 entry+h 個交易日收盤（與 CAR[entry,h] 同窗，收盤集合競價）；
  * 停損：收盤觸及停損（-2.5×ATR20 或 -10%，取距離近者）→ 次一交易日開盤出場（收盤後才知道，不用當日收盤價成交）；
  * 反向事件：同股反向事件（events 傳入）於其 entry_date 開盤出場；
  * 下市：最後交易日收盤價（delist_mode='zero' 時以 0 計，做 -100% 敏感度）；
  * 期末：end 當日收盤強制平倉（exit_reason='period_end'）。
  出場遇鎖跌停（賣）/鎖漲停（買回）/停牌則順延到下一個開盤。
- 部位大小（只用進場日之前的資料）：w = min(單檔上限, risk_unit/σ60)，再受產業(20%)、總曝險(100%)上限，
  名目金額 = w × 前一日收盤權益，且 <= 5% × ADV20（20 日均成交金額，不含當日）。同股已有部位不加碼。
- 股票池：上市 >= 250 交易日且 ADV20 >= 3000 萬（皆用進場前資料）。
- 做空：僅限 marginable（融券）或 has_stock_futures（個股期貨），且通過股票池門檻；
  不可空的負向訊號不交易，改為在 [entry, entry+h] 期間排除該股多單。
- 損益用還原價（close*adj_factor）計算；漲跌停/成交判斷用原始價。
成本（每邊，比例皆對成交金額）
- 多：買 = 手續費 + 滑價；賣 = 手續費 + 證交稅 + 滑價。
- 融券：賣出 = 手續費 + 證交稅 + 融券借券費 + 滑價；買回 = 手續費 + 滑價；另計借券年化 × 日曆天數/365（保守：兩者都計）。
- 個股期貨：每邊 期交稅 + 滑價（未計轉倉成本與期貨手續費）。
- 滑價 = (slippage_base_bp/1e4 + slippage_k·sqrt(下單額/ADV20)) × (處置股 ? disposition_slippage_mult : 1)。
trades 欄位（SPEC）：event_id,ticker,side,entry_date,entry_px,exit_date,exit_px,exit_reason,gross,cost,net,fold
  （gross/cost/net 為占進場名目金額的比例），另附 notional, weight, h, event_type, route, cost_entry, cost_exit,
  cost_carry, gross_pnl, net_pnl。
"""
import math

import numpy as np
import pandas as pd

from . import get_config

TRADE_COLS = ["event_id", "ticker", "side", "entry_date", "entry_px", "exit_date", "exit_px", "exit_reason",
              "gross", "cost", "net", "fold"]
_EPS = 1e-9


def _cfgs(cost_cfg, strategy_cfg, thresholds):
    cfg = get_config()
    return ({**cfg["costs"], **(cost_cfg or {})}, {**cfg["strategy"], **(strategy_cfg or {})},
            {**cfg["thresholds"], **(thresholds or {})})


def pre_entry_features(prices):
    """長表 (ticker,date) 的進場前特徵：sigma60（還原日報酬 60 日標準差）、atr20（還原價 ATR）、
    adv20（20 日均成交金額）、n_rows（之前已有的交易筆數）。date 當列的值只用 date 之前的資料。"""
    p = prices[["ticker", "date", "high", "low", "close", "adj_factor", "turnover"]].copy()
    p["ticker"] = p["ticker"].astype(str)
    p = p.sort_values(["ticker", "date"]).reset_index(drop=True)
    af = p["adj_factor"].fillna(1.0)
    c, hi, lo = p["close"] * af, p["high"] * af, p["low"] * af
    g = p.groupby("ticker", sort=False)
    pc = c.groupby(p["ticker"]).shift(1)
    r = c / pc - 1
    tr = pd.concat([hi - lo, (hi - pc).abs(), (lo - pc).abs()], axis=1).max(axis=1, skipna=False)
    out = p[["ticker", "date"]].copy()
    out["sigma60"] = r.groupby(p["ticker"]).transform(lambda s: s.rolling(60, min_periods=60).std().shift(1))
    out["atr20"] = tr.groupby(p["ticker"]).transform(lambda s: s.rolling(20, min_periods=20).mean().shift(1))
    out["adv20"] = p["turnover"].groupby(p["ticker"]).transform(lambda s: s.rolling(20, min_periods=20).mean().shift(1))
    out["n_rows"] = g.cumcount()
    return out


def slippage(order_value, adv, costs, disposition=False):
    base = costs["slippage_base_bp"] / 1e4
    imp = costs["slippage_k"] * math.sqrt(order_value / adv) if (adv and adv > 0 and np.isfinite(adv)) else 0.0
    return (base + imp) * (costs["disposition_slippage_mult"] if disposition else 1.0)


def trade_cost(side, route, notional, exit_value, slip_in, slip_out, cal_days, costs):
    """回傳 (entry_cost, exit_cost, carry)，單位 TWD。供回測與手算對帳共用。"""
    cm, tax = costs["commission_rate"], costs["securities_tax_sell"]
    if side > 0:
        return notional * (cm + slip_in), exit_value * (cm + tax + slip_out), 0.0
    if route == "futures":
        ft = costs["futures_tax_per_side"]
        return notional * (ft + slip_in), exit_value * (ft + slip_out), 0.0
    carry = notional * costs["stock_lending_annual"] * cal_days / 365.0
    return notional * (cm + tax + costs["short_borrow_fee"] + slip_in), exit_value * (cm + slip_out), carry


class _Asof:
    """company_master as-of 查詢（valid_from <= d 的最後一筆）。"""

    def __init__(self, master):
        self.m = {}
        if master is not None and len(master):
            m = master.copy()
            m["ticker"] = m["ticker"].astype(str)
            for t, g in m.sort_values("valid_from").groupby("ticker"):
                self.m[t] = g.reset_index(drop=True)

    def get(self, t, d):
        g = self.m.get(t)
        if g is None:
            return None
        ok = g[(g["valid_from"].isna()) | (g["valid_from"] <= d)]
        return ok.iloc[-1].to_dict() if len(ok) else None


def backtest(signals, prices, cost_cfg=None, master=None, events=None, *, capital=1e7, strategy_cfg=None,
             thresholds=None, start=None, end=None, bench=None, hedge=False, delist_mode="last",
             max_entry_delay=3, risk_unit=0.0005, allow_short=True):
    """M8。signals 需 event_id, ticker, side(+1/-1), entry_date, h；可選 event_type, fold。
    回傳 (trades, equity)。trades.attrs['skipped'] = [(event_id, 未成交原因)]。
    end：之後的價格完全不讀（用於封存年/訓練期截斷）。"""
    costs, strat, th = _cfgs(cost_cfg, strategy_cfg, thresholds)
    px = prices.copy()
    px["ticker"] = px["ticker"].astype(str)
    if end is not None:
        px = px[px["date"] <= pd.Timestamp(end)]
    feats = pre_entry_features(px)
    dates = pd.DatetimeIndex(np.sort(px["date"].unique()))
    tickers = sorted(px["ticker"].unique())
    col = {t: i for i, t in enumerate(tickers)}

    def wide(df, c):
        return df.pivot(index="date", columns="ticker", values=c).reindex(index=dates, columns=tickers).to_numpy()

    O, H, Lo, C = (wide(px, c).astype(float) for c in ("open", "high", "low", "close"))
    AF = np.nan_to_num(wide(px, "adj_factor").astype(float), nan=1.0)
    LU, LD = wide(px, "limit_up_px").astype(float), wide(px, "limit_down_px").astype(float)
    SUSP = wide(px, "is_suspended").astype(float) > 0
    DISP = wide(px, "is_disposition").astype(float) > 0
    SIG, ATR, ADV, NROW = (wide(feats, c).astype(float) for c in ("sigma60", "atr20", "adv20", "n_rows"))
    has = np.isfinite(C)
    last_idx = np.array([np.flatnonzero(has[:, j]).max() if has[:, j].any() else -1 for j in range(len(tickers))])
    asof = _Asof(master)
    D = len(dates)
    t0 = int(dates.searchsorted(pd.Timestamp(start))) if start is not None else 0
    t1 = D - 1
    Rm = None
    if hedge:
        from .event_study import _pick_bench
        Rm = _pick_bench(bench).set_index("date")["ret"].reindex(dates).fillna(0.0).to_numpy()

    def delisted(j, t):
        m = asof.get(tickers[j], dates[t])
        if m is None:
            return True                      # 無主檔資訊：資料中斷即視為下市（保守）
        return pd.notna(m.get("delist_date")) and pd.Timestamp(m["delist_date"]) <= dates[t]

    def listed_days(j, t):
        m = asof.get(tickers[j], dates[t])
        if m is not None and pd.notna(m.get("list_date")):
            ld = pd.Timestamp(m["list_date"])
            return t - int(dates.searchsorted(ld)) if ld >= dates[0] else 10 ** 6
        return NROW[t, j]

    def can(t, j, buy, at):
        if SUSP[t, j]:
            return False
        p = O[t, j] if at == "open" else C[t, j]
        if not np.isfinite(p):
            return False
        return (p < LU[t, j] - _EPS) if buy else (p > LD[t, j] + _EPS)

    # 訊號
    sg = signals.copy()
    sg["ticker"] = sg["ticker"].astype(str)
    sg["entry_date"] = pd.to_datetime(sg["entry_date"])
    if "fold" not in sg.columns:
        sg["fold"] = np.nan
    if "event_type" not in sg.columns:
        sg["event_type"] = np.nan
    sg = sg[(sg["entry_date"] >= dates[t0]) & (sg["entry_date"] <= dates[t1])]
    sg = sg.sort_values(["entry_date", "event_id"]).reset_index(drop=True)
    sg["e0"] = dates.searchsorted(sg["entry_date"])
    by_day = {k: list(g.itertuples(index=False)) for k, g in sg.groupby("e0")}
    rev = {}
    if events is not None and len(events):
        evv = events[events["sentiment"].fillna(0) != 0].copy()
        evv["ticker"] = evv["ticker"].astype(str)
        evv = evv[(evv["entry_date"] >= dates[0]) & (evv["entry_date"] <= dates[t1])]
        for r in evv.itertuples(index=False):
            rev.setdefault((r.ticker, int(dates.searchsorted(pd.Timestamp(r.entry_date)))), []).append(
                (int(r.sentiment), r.event_id))

    equity = float(capital)
    pos = {}                 # ticker -> dict
    pending_entries = []
    long_block = {}          # ticker -> 最後封鎖日 index
    trades, skipped, eq_rows = [], [], []
    hedge_n, hedge_prev = 0.0, 0.0

    def close_pos(p, t, px_raw, reason):
        nonlocal equity
        j = p["j"]
        adj_exit = px_raw * AF[t, j]
        equity += p["side"] * p["shares"] * (adj_exit - p["last_adj"])
        p["last_adj"] = adj_exit
        V = p["notional"] * adj_exit / p["adj_entry"]
        adv = ADV[t, j] if np.isfinite(ADV[t, j]) else p["adv_entry"]
        s_out = slippage(V, adv, costs, bool(DISP[t, j]))
        days = (dates[t] - dates[p["t_in"]]).days
        ce, cx, cc = trade_cost(p["side"], p["route"], p["notional"], V, p["slip_in"], s_out, days, costs)
        equity -= cx + cc
        gross = p["side"] * (adj_exit / p["adj_entry"] - 1)
        cost = (ce + cx + cc) / p["notional"]
        trades.append(dict(event_id=p["event_id"], ticker=tickers[j], side=p["side"], entry_date=dates[p["t_in"]],
                           entry_px=p["entry_px"], exit_date=dates[t], exit_px=px_raw, exit_reason=reason,
                           gross=gross, cost=cost, net=gross - cost, fold=p["fold"], notional=p["notional"],
                           weight=p["weight"], h=p["h"], event_type=p["event_type"], route=p["route"],
                           cost_entry=ce, cost_exit=cx, cost_carry=cc, slip_in=p["slip_in"], slip_out=s_out,
                           gross_pnl=gross * p["notional"], net_pnl=(gross - cost) * p["notional"]))
        del pos[tickers[j]]

    for t in range(t0, t1 + 1):
        cost_today = 0.0
        eq_open = equity
        # ---------- 開盤：待出場 / 反向事件 ----------
        for tk in list(pos):
            p = pos[tk]
            j = p["j"]
            if p["pending"] is None and t > p["t_in"]:
                for s, eid in rev.get((tk, t), []):
                    if s == -p["side"] and eid != p["event_id"]:
                        p["pending"] = "reverse"
            if p["pending"] is not None and can(t, j, p["side"] < 0, "open"):
                close_pos(p, t, O[t, j], p["pending"])
        # ---------- 開盤：進場 ----------
        todays = pending_entries + by_day.get(t, [])
        pending_entries = []
        gross_mv = sum(abs(p["shares"] * p["last_adj"]) for p in pos.values())
        for r in todays:
            j = col.get(r.ticker)
            side, e0 = int(np.sign(r.side)), int(r.e0)
            if j is None:
                skipped.append((r.event_id, "no_prices")); continue
            if t == e0:   # 首次評估：做空資格
                if side < 0:
                    m = asof.get(r.ticker, dates[t]) or {}
                    route = "margin" if m.get("marginable") else ("futures" if m.get("has_stock_futures") else None)
                    if not allow_short or route is None:
                        long_block[r.ticker] = max(long_block.get(r.ticker, -1), e0 + int(r.h))
                        if r.ticker in pos and pos[r.ticker]["side"] > 0 and pos[r.ticker]["pending"] is None:
                            pos[r.ticker]["pending"] = "reverse"
                        skipped.append((r.event_id, "not_shortable")); continue
            if r.ticker in pos:
                skipped.append((r.event_id, "already_in_position")); continue
            if side > 0 and long_block.get(r.ticker, -1) >= t:
                skipped.append((r.event_id, "long_blocked_by_negative")); continue
            if listed_days(j, t) < th["universe_min_listed_days"] or not (ADV[t, j] >= th["universe_min_adv20_twd"]):
                skipped.append((r.event_id, "universe")); continue
            if not can(t, j, side > 0, "open"):
                if t - e0 < max_entry_delay and t + 1 <= e0 + int(r.h):
                    pending_entries.append(r)
                else:
                    skipped.append((r.event_id, "entry_blocked"))
                continue
            sig = SIG[t, j]
            if not (np.isfinite(sig) and sig > 0):
                skipped.append((r.event_id, "no_sigma60")); continue
            m = asof.get(r.ticker, dates[t]) or {}
            ind = m.get("industry_code")
            w = min(strat["max_weight_single"], risk_unit / sig)
            ind_mv = sum(abs(p["shares"] * p["last_adj"]) for p in pos.values() if p["ind"] == ind and ind is not None)
            w = min(w, strat["max_weight_industry"] - ind_mv / eq_open, strat["max_gross_exposure"] - gross_mv / eq_open)
            if w <= 1e-4:
                skipped.append((r.event_id, "exposure_cap")); continue
            notional = min(w * eq_open, costs["max_order_adv_frac"] * ADV[t, j])
            if notional <= 0:
                skipped.append((r.event_id, "size")); continue
            route = "long"
            if side < 0:
                route = "margin" if m.get("marginable") else "futures"
            entry_px = O[t, j]
            adj_entry = entry_px * AF[t, j]
            s_in = slippage(notional, ADV[t, j], costs, bool(DISP[t, j]))
            ce, _, _ = trade_cost(side, route, notional, 0.0, s_in, 0.0, 0, costs)
            equity -= ce
            cost_today += ce
            dist = strat["stop_pct"] * adj_entry
            if np.isfinite(ATR[t, j]):
                dist = min(dist, strat["stop_atr_mult"] * ATR[t, j])
            pos[r.ticker] = dict(event_id=r.event_id, j=j, side=side, route=route, notional=notional,
                                 weight=notional / eq_open, shares=notional / adj_entry, t_in=t, entry_px=entry_px,
                                 adj_entry=adj_entry, last_adj=adj_entry, t_exp=e0 + int(r.h),
                                 stop_adj=adj_entry - side * dist, slip_in=s_in, adv_entry=ADV[t, j],
                                 pending=None, ind=ind, h=int(r.h), event_type=r.event_type, fold=r.fold)
            gross_mv += notional
        # ---------- 收盤 ----------
        for tk in list(pos):
            p = pos[tk]
            j = p["j"]
            if np.isfinite(C[t, j]):
                c = C[t, j] * AF[t, j]
                equity += p["side"] * p["shares"] * (c - p["last_adj"])
                p["last_adj"] = c
            if t == last_idx[j] and t < t1 and delisted(j, t):
                if delist_mode == "zero":
                    close_pos(p, t, 0.0, "delist_zero")
                else:
                    close_pos(p, t, C[t, j], "delist")
                continue
            if t == t1:
                close_pos(p, t, C[t, j] if np.isfinite(C[t, j]) else p["last_adj"] / AF[t, j], "period_end")
                continue
            if p["pending"] is None and t >= p["t_exp"]:
                if can(t, j, p["side"] < 0, "close"):
                    close_pos(p, t, C[t, j], "expiry")
                    continue
                p["pending"] = "expiry"
            if p["pending"] is None and np.isfinite(C[t, j]) and p["side"] * (C[t, j] * AF[t, j] - p["stop_adj"]) <= 0:
                p["pending"] = "stop"
        net_mv = sum(p["side"] * p["shares"] * p["last_adj"] for p in pos.values())
        long_mv = sum(p["shares"] * p["last_adj"] for p in pos.values() if p["side"] > 0)
        short_mv = sum(p["shares"] * p["last_adj"] for p in pos.values() if p["side"] < 0)
        hedge_pnl = 0.0
        if hedge:
            hedge_pnl = hedge_prev * Rm[t]
            equity += hedge_pnl
            hedge_n = -net_mv
            hc = abs(hedge_n - hedge_prev) * costs["futures_tax_per_side"]
            equity -= hc
            cost_today += hc
            hedge_prev = hedge_n
        eq_rows.append(dict(date=dates[t], equity=equity, long_mv=long_mv, short_mv=short_mv,
                            gross_exposure=(long_mv + short_mv) / equity if equity else np.nan,
                            n_pos=len(pos), hedge_notional=hedge_n if hedge else 0.0, hedge_pnl=hedge_pnl))
    for r in pending_entries:
        skipped.append((r.event_id, "entry_blocked"))

    tr = pd.DataFrame(trades)
    if tr.empty:
        tr = pd.DataFrame(columns=TRADE_COLS)
    else:
        tr = tr[TRADE_COLS + [c for c in tr.columns if c not in TRADE_COLS]]
    tr.attrs["skipped"] = list(skipped)       # [(event_id, 原因)]
    eq = pd.DataFrame(eq_rows)
    if len(eq):
        eq["ret"] = eq["equity"].pct_change().fillna(eq["equity"].iloc[0] / capital - 1)
    eq.attrs["capital"] = capital
    return tr, eq


def write_trades(trades, path):
    """輸出 trades.parquet（SPEC 欄位在前）。"""
    from .loader import write_table
    from pathlib import Path
    p = Path(path)
    return write_table(trades.reset_index(drop=True), p.with_suffix(""))
