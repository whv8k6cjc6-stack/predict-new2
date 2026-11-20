"""TAIFEX futures daily data via the public download form (POST www.taifex.com.tw/cht/3/futDataDown).

Probe findings: GET on that URL 302s to a 404 page, but a POST with the form fields works and returns CSV
(cp950). History reaches back at least to 2010 (TX); one month per request is used. Options download
(optDataDown) is reachable too but carries no IV, so only futures are implemented (data_tier='C').
Output (derivatives_daily-aligned): underlying,date,instrument,settle,basis,volume,oi,iv_atm_30d,skew_25d,
pc_ratio,data_tier (+ contract_month,open,high,low,close,volume_ah,source). Regular-session rows only for
settle/oi; after-hours volume is in volume_ah. Spread rows (month like 202403/202404) are dropped.
basis is NaN here: use add_basis(df, spot_prices).
"""
from __future__ import annotations

import io
import logging
from datetime import date

import numpy as np
import pandas as pd

from . import settings as S
from ._http import Fetcher, FetchError
from ._io import num, save_parquet

log = logging.getLogger("fetch.taifex")
COLS = ["underlying", "date", "instrument", "settle", "basis", "volume", "oi", "iv_atm_30d", "skew_25d",
        "pc_ratio", "data_tier", "contract_month", "open", "high", "low", "close", "volume_ah", "source"]


def _valid_csv(body: bytes) -> bool:
    head = body[:400].decode("cp950", errors="replace")
    return "契約" in head and "," in head


def parse_futures_csv(body: bytes, underlying: str) -> pd.DataFrame:
    txt = body.decode("cp950", errors="replace")
    raw = pd.read_csv(io.StringIO(txt), dtype=str, index_col=False)
    raw.columns = [c.strip() for c in raw.columns]
    c_date, c_con, c_mon = raw.columns[0], raw.columns[1], raw.columns[2]
    raw = raw[~raw[c_mon].fillna("").str.contains("/")]
    raw["_d"] = pd.to_datetime(raw[c_date].str.strip(), format="%Y/%m/%d", errors="coerce")
    raw["_m"] = raw[c_mon].str.strip()
    raw["_c"] = raw[c_con].str.strip()
    raw = raw.dropna(subset=["_d"])
    sess = raw["交易時段"].fillna("").str.strip()
    reg, ah = raw[sess != "盤後"].copy(), raw[sess == "盤後"]
    ahv = ah.assign(_v=ah["成交量"].map(num)).groupby(["_d", "_c", "_m"])["_v"].sum()
    out = pd.DataFrame({
        "underlying": underlying, "date": reg["_d"].values,
        "instrument": (reg["_c"] + "_" + reg["_m"]).values, "contract_month": reg["_m"].values,
        "open": reg["開盤價"].map(num).values, "high": reg["最高價"].map(num).values,
        "low": reg["最低價"].map(num).values, "close": reg[reg.columns[6]].map(num).values,
        "settle": reg["結算價"].map(num).values, "volume": reg["成交量"].map(num).values,
        "oi": reg["未沖銷契約數"].map(num).values})
    keys = list(zip(reg["_d"], reg["_c"], reg["_m"]))
    out["volume_ah"] = [ahv.get(k, np.nan) for k in keys]
    out["basis"] = np.nan; out["iv_atm_30d"] = np.nan; out["skew_25d"] = np.nan; out["pc_ratio"] = np.nan
    out["data_tier"] = "C"; out["source"] = "taifex_futDataDown"
    return out[COLS]


def fetch_futures_daily(commodity_id: str, underlying: str, start, end, fetcher: Fetcher | None = None,
                        save: bool = True) -> pd.DataFrame:
    """commodity_id e.g. 'TX' (TAIEX futures), 'CDF' (2330 stock futures). Monthly requests, cached."""
    f = fetcher or Fetcher()
    parts, failed = [], []
    cur = pd.Timestamp(start).replace(day=1)
    while cur <= pd.Timestamp(end) and cur <= pd.Timestamp(date.today()):
        a = max(cur, pd.Timestamp(start)); b = min(cur + pd.offsets.MonthEnd(0), pd.Timestamp(end))
        form = {"down_type": "1", "commodity_id": commodity_id,
                "queryStartDate": a.strftime("%Y/%m/%d"), "queryEndDate": b.strftime("%Y/%m/%d")}
        ttl = None if b + pd.Timedelta(days=5) < pd.Timestamp(date.today()) else S.RECENT_TTL
        try:
            body = f.get(S.TAIFEX_FUT_DOWN, data=form, validator=_valid_csv, ttl=ttl)
            parts.append(parse_futures_csv(body, underlying))
        except FetchError as e:
            failed.append(cur.strftime("%Y-%m")); log.warning("TAIFEX %s %s: %s", commodity_id, cur.strftime("%Y-%m"), e)
        cur += pd.offsets.MonthBegin(1)
    df = pd.concat(parts, ignore_index=True) if parts else pd.DataFrame(columns=COLS)
    df.attrs["failed_months"] = failed
    if save and len(df):
        save_parquet(df, "derivatives", f"fut_{commodity_id}", ["underlying", "date", "instrument"])
    return df


def parse_stock_futures_list(html: bytes | str) -> pd.DataFrame:
    """Product list page -> DataFrame(commodity_code, ticker, name, is_stock_futures_underlying, unit)."""
    txt = html.decode("utf-8", errors="replace") if isinstance(html, bytes) else html
    tables = pd.read_html(io.StringIO(txt), flavor="lxml")
    t = max(tables, key=len)
    cols = list(t.columns)
    out = pd.DataFrame({"commodity_code": t[cols[0]].astype(str).str.strip(),
                        "ticker": t[cols[2]].astype(str).str.strip().str.replace(r"\.0$", "", regex=True),
                        "name": t[cols[3]].astype(str).str.strip(),
                        "is_stock_futures_underlying": t[cols[4]].notna(),
                        "unit": pd.to_numeric(t[cols[-3]], errors="coerce")})   # shares per contract (mini=100/1000)
    return out[out["ticker"].str.match(r"^\w{4,6}$")].reset_index(drop=True)


def fetch_stock_futures_map(fetcher: Fetcher | None = None) -> pd.DataFrame:
    """Which tickers have stock futures and their TAIFEX product code (futures commodity_id = code + 'F')."""
    f = fetcher or Fetcher()
    body = f.get(S.TAIFEX_STOCK_LIST, ttl=7 * 86400, validator=lambda b: b"<table" in b)
    return parse_stock_futures_list(body)


def fetch_stock_future(ticker: str, start, end, fetcher: Fetcher | None = None, save: bool = True) -> pd.DataFrame:
    f = fetcher or Fetcher()
    m = fetch_stock_futures_map(f)
    hit = m[(m["ticker"] == str(ticker)) & m["is_stock_futures_underlying"]].sort_values("unit", ascending=False)
    if hit.empty:
        log.warning("%s has no stock futures", ticker)
        return pd.DataFrame(columns=COLS)
    return fetch_futures_daily(hit.iloc[0]["commodity_code"] + "F", str(ticker), start, end, f, save)


def fetch_taiex_futures(start, end, fetcher: Fetcher | None = None, save: bool = True) -> pd.DataFrame:
    return fetch_futures_daily("TX", "TAIEX", start, end, fetcher, save)


def add_basis(deriv: pd.DataFrame, spot: pd.DataFrame) -> pd.DataFrame:
    """basis = settle - spot close of the same date. spot: DataFrame(date, close) for the underlying."""
    s = spot.set_index("date")["close"]
    out = deriv.copy()
    out["basis"] = out["settle"] - out["date"].map(s)
    return out
