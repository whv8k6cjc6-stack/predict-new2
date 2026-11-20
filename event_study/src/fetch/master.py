"""company_master from official open data (current listings + TWSE delisted list).

Columns (SPEC): ticker,valid_from,name,aliases,market,industry_code,list_date,delist_date,
                has_stock_futures,marginable,valid_to
Limits: only the CURRENT name/industry is known (no history of renames); TPEX delisted list has no
open-data endpoint (TPEX-delisted names are missing); delisted rows have list_date=NaT and
valid_from=1990-01-01 (sentinel). marginable is NA (not in these sources).
"""
from __future__ import annotations

import json
import logging

import pandas as pd

from . import settings as S
from ._http import Fetcher, FetchError, json_validator
from ._io import roc_to_date, save_parquet

log = logging.getLogger("fetch.master")
COLS = ["ticker", "valid_from", "name", "aliases", "market", "industry_code", "list_date", "delist_date",
        "has_stock_futures", "marginable", "valid_to"]
SENTINEL = pd.Timestamp("1990-01-01")


def _date8(s):
    s = str(s or "").strip()
    return pd.Timestamp(int(s[:4]), int(s[4:6]), int(s[6:8])) if len(s) == 8 and s.isdigit() and s[:4] > "1900" else pd.NaT


def parse_twse_listed(records: list[dict]) -> pd.DataFrame:
    rows = []
    for r in records:
        code = str(r.get("公司代號", "")).strip()
        if not code:
            continue
        ld = _date8(r.get("上市日期"))
        al = [x.strip() for x in (r.get("公司簡稱"), r.get("公司名稱"), r.get("英文簡稱")) if x and x.strip()]
        rows.append(dict(ticker=code, name=(r.get("公司簡稱") or "").strip(), aliases=al, market="TWSE",
                         industry_code=str(r.get("產業別", "")).strip(), list_date=ld, delist_date=pd.NaT))
    return pd.DataFrame(rows)


def parse_tpex_listed(records: list[dict]) -> pd.DataFrame:
    rows = []
    for r in records:
        code = str(r.get("SecuritiesCompanyCode", "")).strip()
        if not code:
            continue
        al = [x.strip() for x in (r.get("CompanyAbbreviation"), r.get("CompanyName")) if x and x.strip()]
        rows.append(dict(ticker=code, name=(r.get("CompanyAbbreviation") or "").strip(), aliases=al, market="TPEX",
                         industry_code=str(r.get("SecuritiesIndustryCode", "")).strip(),
                         list_date=_date8(r.get("DateOfListing")), delist_date=pd.NaT))
    return pd.DataFrame(rows)


def parse_twse_delisted(records: list[dict]) -> pd.DataFrame:
    rows = []
    for r in records:
        code = str(r.get("Code", "")).strip()
        if code:
            nm = (r.get("Company") or "").strip()
            rows.append(dict(ticker=code, name=nm, aliases=[nm] if nm else [], market="TWSE", industry_code="",
                             list_date=pd.NaT, delist_date=roc_to_date(r.get("DelistingDate"))))
    return pd.DataFrame(rows)


def _json(f: Fetcher, url, ttl=S.SNAPSHOT_TTL):
    return json.loads(f.get(url, validator=json_validator, ttl=ttl).decode("utf-8"))


def build_master(twse, tpex, delisted, futures_codes: set[str] | None = None) -> pd.DataFrame:
    cur = pd.concat([twse, tpex], ignore_index=True)
    cur = cur.drop_duplicates("ticker", keep="first")
    if len(delisted):
        delisted = delisted[~delisted["ticker"].isin(set(cur["ticker"]))]
    df = pd.concat([cur, delisted], ignore_index=True)
    df["valid_from"] = df["list_date"].fillna(SENTINEL)
    df["valid_to"] = df["delist_date"]
    df["has_stock_futures"] = df["ticker"].isin(futures_codes) if futures_codes is not None else pd.NA
    df["marginable"] = pd.NA
    return df[COLS].sort_values(["ticker", "valid_from"]).reset_index(drop=True)


def fetch_company_master(fetcher: Fetcher | None = None, futures_codes: set[str] | None = None,
                         save: bool = True) -> pd.DataFrame:
    """-> data/raw/master/company_master.parquet. Each source failing degrades to the others (warning)."""
    f = fetcher or Fetcher()
    parts = {}
    for name, url, fn in (
        ("twse", f"{S.TWSE_OPENAPI}/opendata/t187ap03_L", parse_twse_listed),
        ("tpex", f"{S.TPEX_OPENAPI}/mopsfin_t187ap03_O", parse_tpex_listed),
        ("delisted", f"{S.TWSE_OPENAPI}/company/suspendListingCsvAndHtml", parse_twse_delisted),
    ):
        try:
            parts[name] = fn(_json(f, url))
        except (FetchError, ValueError) as e:
            log.warning("master source %s failed: %s", name, e)
            parts[name] = pd.DataFrame()
    df = build_master(parts["twse"], parts["tpex"], parts["delisted"], futures_codes)
    if save and len(df):
        save_parquet(df, "master", "company_master", ["ticker", "valid_from"])
    return df
