"""Daily prices: TWSE STOCK_DAY (listed), TPEX tradingStock (OTC), Yahoo chart (fallback only).

Output columns follow SPEC prices_daily:
  ticker,date,open,high,low,close,adj_factor,volume,turnover,limit_up_px,limit_down_px,
  is_suspended,is_disposition  (+ market, source)
close etc. are RAW prices. adj_factor is NaN unless Yahoo adj-close is merged (TWSE/TPEX give raw only).
limit px are derived from the reference price (close - change) with the tick table; ETF ticks differ (approx).
is_disposition is False here (fill from announcements.fetch_disposition()).
"""
from __future__ import annotations

import json
import logging
import math
from datetime import date

import numpy as np
import pandas as pd

from . import settings as S
from ._http import Fetcher, FetchError, json_validator
from ._io import num, roc_to_date, save_parquet

log = logging.getLogger("fetch.prices")

COLS = ["ticker", "date", "open", "high", "low", "close", "adj_factor", "volume", "turnover",
        "limit_up_px", "limit_down_px", "is_suspended", "is_disposition", "market", "source"]


def _tick(p: float) -> float:
    if p < 10: return 0.01
    if p < 50: return 0.05
    if p < 100: return 0.1
    if p < 500: return 0.5
    if p < 1000: return 1.0
    return 5.0


def limit_prices(ref: float, d: pd.Timestamp) -> tuple[float, float]:
    if not ref or math.isnan(ref):
        return np.nan, np.nan
    pct = 0.10 if d >= pd.Timestamp(S.PCT_LIMIT_CHANGE) else 0.07
    up_raw, dn_raw = ref * (1 + pct), ref * (1 - pct)
    tu, td = _tick(up_raw), _tick(dn_raw)
    up = math.floor(round(up_raw / tu, 6)) * tu
    dn = math.ceil(round(dn_raw / td, 6)) * td
    return round(up, 2), round(dn, 2)


def _finish(df: pd.DataFrame, ticker, market, source, ref: pd.Series | None) -> pd.DataFrame:
    """Add flags/limits. `ref` = reference price per row (NaN -> use previous close)."""
    df = df.sort_values("date").reset_index(drop=True)
    prev_close = df["close"].ffill().shift(1)
    if ref is None:
        ref = prev_close
    else:
        ref = ref.reset_index(drop=True).fillna(prev_close)
    lims = [limit_prices(r, d) for r, d in zip(ref, df["date"])]
    df["limit_up_px"] = [x[0] for x in lims]
    df["limit_down_px"] = [x[1] for x in lims]
    df["is_suspended"] = df["close"].isna() | (df["volume"].fillna(0) == 0)
    df["adj_factor"] = np.nan
    df["is_disposition"] = False
    df["ticker"], df["market"], df["source"] = ticker, market, source
    return df[COLS]


# ---------------------------------------------------------------- TWSE
def parse_twse_stock_day(payload: dict, ticker: str) -> pd.DataFrame:
    if payload.get("stat") != "OK" or not payload.get("data"):
        return pd.DataFrame(columns=COLS)
    rows = []
    for r in payload["data"]:
        # 日期,成交股數,成交金額,開盤,最高,最低,收盤,漲跌價差,成交筆數,註記
        chg = str(r[7]).replace(",", "").strip()
        sign = -1.0 if chg.startswith("-") else 1.0
        close = num(r[6])
        c = num(chg.lstrip("+-"))
        rows.append(dict(date=roc_to_date(r[0]), open=num(r[3]), high=num(r[4]), low=num(r[5]),
                         close=close, volume=num(r[1]), turnover=num(r[2]),
                         _ref=close - sign * c if not (math.isnan(close) or math.isnan(c)) else np.nan))
    df = pd.DataFrame(rows)
    ref = df.pop("_ref")
    return _finish(df, ticker, "TWSE", "twse_stock_day", ref)


# ---------------------------------------------------------------- TPEX
def parse_tpex_stock_day(payload: dict, ticker: str) -> pd.DataFrame:
    tabs = payload.get("tables") or []
    data = tabs[0].get("data") if tabs else None
    if not data:
        return pd.DataFrame(columns=COLS)
    rows = []
    for r in data:
        # 日期,成交仟股,成交仟元,開盤,最高,最低,收盤,漲跌(unsigned),筆數  (units: 1000 shares / 1000 NTD)
        rows.append(dict(date=roc_to_date(r[0]), open=num(r[3]), high=num(r[4]), low=num(r[5]),
                         close=num(r[6]), volume=num(r[1]) * 1000, turnover=num(r[2]) * 1000))
    return _finish(pd.DataFrame(rows), ticker, "TPEX", "tpex_stock_day", None)


# ---------------------------------------------------------------- Yahoo
def parse_yahoo_chart(payload: dict, ticker: str, market: str) -> pd.DataFrame:
    try:
        res = payload["chart"]["result"][0]
        ts = res["timestamp"]
        q = res["indicators"]["quote"][0]
        adj = (res["indicators"].get("adjclose") or [{}])[0].get("adjclose")
        off = res.get("meta", {}).get("gmtoffset", 28800)
    except (KeyError, IndexError, TypeError):
        return pd.DataFrame(columns=COLS)
    d = pd.to_datetime(pd.Series(ts) + off, unit="s").dt.normalize()
    df = pd.DataFrame({k: pd.Series(q[k], dtype="float64") for k in ("open", "high", "low", "close", "volume")})
    df.insert(0, "date", d)
    df["turnover"] = np.nan
    df = df.dropna(subset=["close"]).reset_index(drop=True)
    out = _finish(df, ticker, market, "yahoo_chart", None)
    if adj is not None:
        a = pd.Series(adj, dtype="float64")
        a.index = d.values
        a = a[~a.index.duplicated()]
        out["adj_factor"] = (a.reindex(out["date"]).values / out["close"].values)
    out["limit_up_px"] = np.nan   # prices from Yahoo may be adjusted-for-split; do not trust derived limits
    out["limit_down_px"] = np.nan
    return out


def fetch_yahoo(ticker: str, start, end, market: str = "TWSE", fetcher: Fetcher | None = None) -> pd.DataFrame:
    """Fallback. Yahoo currently answers 429 -> few retries then graceful empty DataFrame."""
    f = fetcher or Fetcher()
    sym = f"{ticker}.{'TWO' if market == 'TPEX' else 'TW'}"
    p1 = int(pd.Timestamp(start).timestamp()); p2 = int((pd.Timestamp(end) + pd.Timedelta(days=1)).timestamp())
    url = S.YAHOO_CHART.format(symbol=sym)
    params = {"period1": p1, "period2": p2, "interval": "1d", "events": "div,splits"}
    for host_url in (url, url.replace("query1", "query2")):
        try:
            body = f.get(host_url, params=params, validator=json_validator, ttl=None,
                         max_retries=2, backoff_base=8.0)
            df = parse_yahoo_chart(json.loads(body), ticker, market)
            return df[(df["date"] >= pd.Timestamp(start)) & (df["date"] <= pd.Timestamp(end))].reset_index(drop=True)
        except FetchError as e:
            log.warning("yahoo failed (%s): %s", sym, e)
    return pd.DataFrame(columns=COLS)


# ---------------------------------------------------------------- monthly drivers
def _months(start, end):
    s, e = pd.Timestamp(start).replace(day=1), pd.Timestamp(end)
    cur = s
    while cur <= e:
        yield cur
        cur = (cur + pd.offsets.MonthBegin(1))


def _ttl_for(month: pd.Timestamp):
    # months that are over by >5 days are immutable -> cache forever
    return None if month + pd.offsets.MonthEnd(0) + pd.Timedelta(days=5) < pd.Timestamp(date.today()) else S.RECENT_TTL


def fetch_twse_stock_day(ticker: str, start, end, fetcher: Fetcher | None = None) -> pd.DataFrame:
    """Monthly STOCK_DAY loop. Failed months are skipped with a warning (not cached -> retried on re-run)."""
    f = fetcher or Fetcher()
    parts, failed = [], []
    for m in _months(max(pd.Timestamp(start), pd.Timestamp(S.TWSE_PRICE_START)), end):
        if m > pd.Timestamp(date.today()):
            break
        try:
            body = f.get(S.TWSE_STOCK_DAY, params={"response": "json", "date": m.strftime("%Y%m01"), "stockNo": ticker},
                         validator=json_validator, ttl=_ttl_for(m))
            parts.append(parse_twse_stock_day(json.loads(body), ticker))
        except FetchError as e:
            failed.append(m.strftime("%Y-%m")); log.warning("TWSE %s %s failed: %s", ticker, m.strftime("%Y-%m"), e)
    df = pd.concat([p for p in parts if len(p)], ignore_index=True) if any(len(p) for p in parts) else pd.DataFrame(columns=COLS)
    df.attrs["failed_months"] = failed
    return _clip(df, start, end)


def fetch_tpex_stock_day(ticker: str, start, end, fetcher: Fetcher | None = None) -> pd.DataFrame:
    f = fetcher or Fetcher()
    parts, failed = [], []
    for m in _months(start, end):
        if m > pd.Timestamp(date.today()):
            break
        try:
            body = f.get(S.TPEX_STOCK_DAY, params={"code": ticker, "date": m.strftime("%Y/%m/01"), "response": "json"},
                         validator=json_validator, ttl=_ttl_for(m))
            parts.append(parse_tpex_stock_day(json.loads(body), ticker))
        except FetchError as e:
            failed.append(m.strftime("%Y-%m")); log.warning("TPEX %s %s failed: %s", ticker, m.strftime("%Y-%m"), e)
    df = pd.concat([p for p in parts if len(p)], ignore_index=True) if any(len(p) for p in parts) else pd.DataFrame(columns=COLS)
    if len(df):  # recompute limits across month boundaries (first row of each month had no prev close)
        df = _finish(df.drop(columns=["limit_up_px", "limit_down_px", "is_suspended", "adj_factor", "is_disposition"]),
                     ticker, "TPEX", "tpex_stock_day", None)
    df.attrs["failed_months"] = failed
    return _clip(df, start, end)


def _clip(df, start, end):
    if not len(df):
        return df
    out = df[(df["date"] >= pd.Timestamp(start)) & (df["date"] <= pd.Timestamp(end))].reset_index(drop=True)
    out.attrs.update(df.attrs)
    return out


def _market_from_master(ticker: str):
    p = S.RAW_DIR / "master" / "company_master.parquet"
    try:
        m = pd.read_parquet(p, columns=["ticker", "market"])
        hit = m.loc[m["ticker"] == ticker, "market"]
        return hit.iloc[0] if len(hit) else None
    except Exception:
        return None


def fetch_prices(ticker: str, start, end, market: str = "auto", use_yahoo_fallback: bool = True,
                 save: bool = True, fetcher: Fetcher | None = None) -> pd.DataFrame:
    """Daily raw prices for one ticker -> data/raw/prices/<ticker>.parquet (upsert, resumable via cache).
    market: 'TWSE' | 'TPEX' | 'auto' (company_master lookup, else probe TPEX then TWSE). Yahoo only if both official sources give nothing."""
    f = fetcher or Fetcher()
    df = pd.DataFrame(columns=COLS)
    if market == "auto":
        market = _market_from_master(ticker) or "auto"
    if market == "auto":
        # TPEX answers unknown tickers with a clean empty table; TWSE's WAF answers HTTP 307 for them
        # (slow retries), so probe TPEX first.
        df = fetch_tpex_stock_day(ticker, start, end, f)
        if not len(df) and not df.attrs.get("failed_months"):
            df = fetch_twse_stock_day(ticker, start, end, f)
    elif market == "TWSE":
        df = fetch_twse_stock_day(ticker, start, end, f)
    elif market == "TPEX":
        df = fetch_tpex_stock_day(ticker, start, end, f)
    if not len(df) and use_yahoo_fallback:
        df = fetch_yahoo(ticker, start, end, "TPEX" if market == "TPEX" else "TWSE", f)
    if save and len(df):
        save_parquet(df, "prices", ticker, ["ticker", "date"])
    return df
