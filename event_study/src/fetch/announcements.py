"""Official announcements -> news_raw (source_tier=1) plus structured side tables.

news_raw columns: news_id,published_at(Asia/Taipei),first_seen_at,source,title,body,url,source_tier
  extras: ticker, ann_type, time_precision, is_synthetic
- news_id = sha1(source+url+title). url is the open-data endpoint plus a '#<id>' fragment (no per-item page).
- first_seen_at is left NaT on purpose (SPEC: published_at + 30min). Snapshot endpoints only return the
  LATEST data, so history accumulates only by running this daily (upsert by news_id).
- Date-only sources (monthly revenue, dividends) get published_at = date 18:00 Taipei (after close,
  conservative) with time_precision='date'. Material info has a real timestamp.
Availability probe (2026-11): TWSE/TPEX openapi OK; mops/mopsov (GET/POST) are blocked by WAF -> not used;
treasury-stock (庫藏股) has no openapi endpoint -> appears only as material-info subjects.
"""
from __future__ import annotations

import hashlib
import json
import logging
import re

import numpy as np
import pandas as pd

from . import settings as S
from ._http import Fetcher, FetchError, json_validator
from ._io import num, roc_to_date, save_parquet, taipei

log = logging.getLogger("fetch.announcements")
NEWS_COLS = ["news_id", "published_at", "first_seen_at", "source", "title", "body", "url", "source_tier",
             "ticker", "ann_type", "time_precision", "is_synthetic"]


def news_id(source: str, url: str, title: str) -> str:
    return hashlib.sha1(f"{source}{url}{title}".encode("utf-8")).hexdigest()


def _news_df(rows: list[dict]) -> pd.DataFrame:
    if not rows:
        return pd.DataFrame(columns=NEWS_COLS)
    df = pd.DataFrame(rows)
    df["news_id"] = [news_id(s, u, t) for s, u, t in zip(df["source"], df["url"], df["title"])]
    df["published_at"] = pd.to_datetime(df["published_at"])
    df["published_at"] = taipei(df["published_at"])
    df["first_seen_at"] = pd.Series(pd.NaT, index=df.index, dtype="datetime64[ns, Asia/Taipei]")
    df["source_tier"] = 1
    df["is_synthetic"] = False
    return df[NEWS_COLS].drop_duplicates("news_id").reset_index(drop=True)


def _clock(hms) -> str:
    s = re.sub(r"\D", "", str(hms or "")).zfill(6)[-6:]
    return f"{s[:2]}:{s[2:4]}:{s[4:6]}"


def _day_1800(d: pd.Timestamp):
    return d + pd.Timedelta(hours=18) if pd.notna(d) else pd.NaT


# ------------------------------------------------------------- material information (重大訊息)
def parse_material(records: list[dict], market: str) -> pd.DataFrame:
    rows = []
    base = f"{S.TWSE_OPENAPI}/opendata/t187ap04_L" if market == "TWSE" else f"{S.TPEX_OPENAPI}/mopsfin_t187ap04_O"
    for r in records:
        code = str(r.get("公司代號") or r.get("SecuritiesCompanyCode") or "").strip()
        subj = str(r.get("主旨 ") or r.get("主旨") or "").strip()
        d = roc_to_date(r.get("發言日期"))
        if not code or not subj or pd.isna(d):
            continue
        name = (r.get("公司名稱") or r.get("CompanyName") or "").strip()
        t = _clock(r.get("發言時間"))
        rows.append(dict(
            published_at=pd.Timestamp(f"{d:%Y-%m-%d} {t}"), source=f"{market.lower()}_material",
            title=re.sub(r"\s+", " ", f"{name}({code}) {subj}").strip(), body=str(r.get("說明") or "").strip(),
            url=f"{base}#{code}-{d:%Y%m%d}{t.replace(':', '')}", ticker=code,
            ann_type=f"material:{str(r.get('符合條款') or '').strip()}", time_precision="second"))
    return _news_df(rows)


# ------------------------------------------------------------- monthly revenue
def parse_revenue(records: list[dict], market: str) -> tuple[pd.DataFrame, pd.DataFrame]:
    """-> (news_raw rows, structured monthly_revenue table)."""
    rows, tab = [], []
    base = f"{S.TWSE_OPENAPI}/opendata/t187ap05_L" if market == "TWSE" else f"{S.TPEX_OPENAPI}/mopsfin_t187ap05_O"
    for r in records:
        code = str(r.get("公司代號", "")).strip()
        ym = str(r.get("資料年月", "")).strip()
        if not code or len(ym) < 4:
            continue
        year, mon = int(ym[:-2]) + 1911, int(ym[-2:])
        rev, prev, ly = (num(r.get("營業收入-當月營收")), num(r.get("營業收入-上月營收")), num(r.get("營業收入-去年當月營收")))
        mom, yoy = num(r.get("營業收入-上月比較增減(%)")), num(r.get("營業收入-去年同月增減(%)"))
        pub = _day_1800(roc_to_date(r.get("出表日期")))
        name = str(r.get("公司名稱", "")).strip()
        tab.append(dict(ticker=code, ym=f"{year}-{mon:02d}", revenue=rev, revenue_prev_month=prev, revenue_prev_year=ly,
                        mom_pct=mom, yoy_pct=yoy, published_at=pub, market=market))
        if pd.isna(pub):
            continue
        rows.append(dict(
            published_at=pub, source=f"{market.lower()}_monthly_revenue",
            title=f"{name}({code}) {year}年{mon}月營收 {rev:,.0f}千元 年增{yoy:.1f}% 月增{mom:.1f}%",
            body=str(r.get("備註", "")).strip(), url=f"{base}#{code}-{year}{mon:02d}", ticker=code,
            ann_type="monthly_revenue", time_precision="date"))
    t = pd.DataFrame(tab)
    if len(t):
        t["published_at"] = taipei(pd.to_datetime(t["published_at"]))
    return _news_df(rows), t


# ------------------------------------------------------------- dividends
def parse_dividend(records: list[dict], market: str) -> pd.DataFrame:
    rows = []
    base = f"{S.TWSE_OPENAPI}/opendata/t187ap45_L" if market == "TWSE" else f"{S.TPEX_OPENAPI}/mopsfin_t187ap39_O"
    for r in records:
        code = str(r.get("公司代號", "")).strip()
        bkey = next((k for k in r if "董事會" in k and "日" in k), None)
        d = roc_to_date(r.get(bkey)) if bkey else pd.NaT
        if not code or pd.isna(d):
            continue
        cash = sum(0 if np.isnan(v := num(x)) else v for k, x in r.items() if "現金" in k and "(元/股)" in k)
        stock = sum(0 if np.isnan(v := num(x)) else v for k, x in r.items() if "配股(元/股)" in k)
        yr, per = str(r.get("股利年度", "")).strip(), str(r.get("期別", "")).strip()
        status = str(r.get("決議（擬議）進度", "")).strip()
        name = str(r.get("公司名稱", "")).strip()
        rows.append(dict(
            published_at=_day_1800(d), source=f"{market.lower()}_dividend",
            title=f"{name}({code}) {yr}年度第{per}期 股利分派 現金{cash:g}元/股 股票{stock:g}元/股 {status}".strip(),
            body="", url=f"{base}#{code}-{yr}-{per}-{status}-{d:%Y%m%d}", ticker=code,
            ann_type="dividend", time_precision="date"))
    return _news_df(rows)


# ------------------------------------------------------------- disposition / attention
def parse_disposition_twse(records: list[dict]) -> pd.DataFrame:
    rows = []
    for r in records:
        code = str(r.get("Code", "")).strip()
        if not re.fullmatch(r"\d{4}", code):   # skip warrants etc.
            continue
        per = re.findall(r"\d+/\d+/\d+", str(r.get("DispositionPeriod", "")))
        d = roc_to_date(r.get("Date"))
        rows.append(dict(ticker=code, name=str(r.get("Name", "")).strip(), announce_date=d,
                         start=roc_to_date(per[0]) if per else pd.NaT, end=roc_to_date(per[1]) if len(per) > 1 else pd.NaT,
                         reason=str(r.get("ReasonsOfDisposition", "")).strip(),
                         measure=str(r.get("DispositionMeasures", "")).strip(), market="TWSE"))
    return pd.DataFrame(rows)


def parse_disposition_tpex_current(records: list[dict]) -> pd.DataFrame:
    rows = []
    for r in records:
        code = str(r.get("SecuritiesCompanyCode", "")).strip()
        per = re.findall(r"\d{7}", str(r.get("DispositionPeriod", "")))
        if code:
            rows.append(dict(ticker=code, name=str(r.get("CompanyName", "")).strip(),
                             announce_date=roc_to_date(r.get("Date")),
                             start=roc_to_date(per[0]) if per else pd.NaT, end=roc_to_date(per[1]) if len(per) > 1 else pd.NaT,
                             reason=str(r.get("DispositionReasons", "")).strip(), measure="", market="TPEX"))
    return pd.DataFrame(rows)


def parse_disposition_tpex_hist(payload: dict) -> pd.DataFrame:
    rows = []
    for t in payload.get("tables") or []:
        for r in t.get("data") or []:
            code = str(r[2]).strip()
            if not code:
                continue
            per = re.findall(r"\d+/\d+/\d+", str(r[5]))
            rows.append(dict(ticker=code, name=str(r[3]).strip(), announce_date=roc_to_date(r[1]),
                             start=roc_to_date(per[0]) if per else pd.NaT, end=roc_to_date(per[1]) if len(per) > 1 else pd.NaT,
                             reason=str(r[6]).strip(), measure=str(r[7]).strip(), market="TPEX"))
    return pd.DataFrame(rows)


def disposition_to_news(d: pd.DataFrame) -> pd.DataFrame:
    rows = []
    for r in d.itertuples():
        if pd.isna(r.announce_date):
            continue
        rows.append(dict(
            published_at=_day_1800(r.announce_date), source=f"{r.market.lower()}_disposition",
            title=f"{r.name}({r.ticker}) 公布處置股票 {r.reason} 處置期間{r.start:%Y/%m/%d}~{r.end:%Y/%m/%d}" if pd.notna(r.start) and pd.notna(r.end)
            else f"{r.name}({r.ticker}) 公布處置股票 {r.reason}",
            body=r.measure, url=f"disposition#{r.market}-{r.ticker}-{r.announce_date:%Y%m%d}", ticker=r.ticker,
            ann_type="disposition", time_precision="date"))
    return _news_df(rows)


# ------------------------------------------------------------- drivers
def _get_json(f: Fetcher, url, ttl=S.SNAPSHOT_TTL, **kw):
    return json.loads(f.get(url, validator=json_validator, ttl=ttl, **kw).decode("utf-8"))


def _try(label, fn):
    try:
        return fn()
    except (FetchError, ValueError, KeyError) as e:
        log.warning("%s failed: %s", label, e)
        return None


def fetch_material(fetcher: Fetcher | None = None, save: bool = True) -> pd.DataFrame:
    """Latest-day 重大訊息, TWSE + TPEX -> data/raw/news/announcements_material.parquet (upsert)."""
    f = fetcher or Fetcher()
    parts = []
    for mk, url in (("TWSE", f"{S.TWSE_OPENAPI}/opendata/t187ap04_L"), ("TPEX", f"{S.TPEX_OPENAPI}/mopsfin_t187ap04_O")):
        rec = _try(f"material {mk}", lambda u=url: _get_json(f, u))
        if rec is not None:
            parts.append(parse_material(rec, mk))
    df = pd.concat(parts, ignore_index=True) if parts else pd.DataFrame(columns=NEWS_COLS)
    if save and len(df):
        save_parquet(df, "news", "announcements_material", ["news_id"])
    return df


def fetch_monthly_revenue(fetcher: Fetcher | None = None, save: bool = True) -> pd.DataFrame:
    """Latest month 營收 for all listed + OTC. -> news/announcements_revenue.parquet and news/monthly_revenue.parquet."""
    f = fetcher or Fetcher()
    news, tabs = [], []
    for mk, url in (("TWSE", f"{S.TWSE_OPENAPI}/opendata/t187ap05_L"), ("TPEX", f"{S.TPEX_OPENAPI}/mopsfin_t187ap05_O")):
        rec = _try(f"revenue {mk}", lambda u=url: _get_json(f, u))
        if rec is not None:
            n, t = parse_revenue(rec, mk)
            news.append(n); tabs.append(t)
    df = pd.concat(news, ignore_index=True) if news else pd.DataFrame(columns=NEWS_COLS)
    if save and len(df):
        save_parquet(df, "news", "announcements_revenue", ["news_id"])
        save_parquet(pd.concat(tabs, ignore_index=True), "news", "monthly_revenue", ["ticker", "ym"])
    return df


def fetch_dividends(fetcher: Fetcher | None = None, save: bool = True) -> pd.DataFrame:
    """Dividend resolutions (TWSE endpoint has several years; TPEX ~5MB) -> news/announcements_dividend.parquet."""
    f = fetcher or Fetcher()
    parts = []
    for mk, url in (("TWSE", f"{S.TWSE_OPENAPI}/opendata/t187ap45_L"), ("TPEX", f"{S.TPEX_OPENAPI}/mopsfin_t187ap39_O")):
        rec = _try(f"dividend {mk}", lambda u=url: _get_json(f, u))
        if rec is not None:
            parts.append(parse_dividend(rec, mk))
    df = pd.concat(parts, ignore_index=True) if parts else pd.DataFrame(columns=NEWS_COLS)
    if save and len(df):
        save_parquet(df, "news", "announcements_dividend", ["news_id"])
    return df


def fetch_disposition(start=None, end=None, fetcher: Fetcher | None = None, save: bool = True) -> tuple[pd.DataFrame, pd.DataFrame]:
    """Disposition (處置股). TWSE: current snapshot only (history endpoint blocked by WAF). TPEX: current + history
    for [start,end] via the bulletin endpoint (monthly chunks). -> (structured table, news_raw rows).
    Structured table saved to data/raw/master/disposition.parquet (use it to set prices_daily.is_disposition)."""
    f = fetcher or Fetcher()
    parts = []
    r = _try("disposition TWSE", lambda: _get_json(f, f"{S.TWSE_OPENAPI}/announcement/punish"))
    if r is not None:
        parts.append(parse_disposition_twse(r))
    r = _try("disposition TPEX now", lambda: _get_json(f, f"{S.TPEX_OPENAPI}/tpex_disposal_information"))
    if r is not None:
        parts.append(parse_disposition_tpex_current(r))
    if start is not None and end is not None:
        cur = pd.Timestamp(start).replace(day=1)
        while cur <= pd.Timestamp(end):
            a, b = max(cur, pd.Timestamp(start)), min(cur + pd.offsets.MonthEnd(0), pd.Timestamp(end))
            j = _try(f"disposition TPEX {cur:%Y-%m}", lambda: _get_json(
                f, S.TPEX_DISPOSAL_HIST, ttl=None if b < pd.Timestamp.today() - pd.Timedelta(days=5) else S.RECENT_TTL,
                params={"startDate": a.strftime("%Y/%m/%d"), "endDate": b.strftime("%Y/%m/%d"), "response": "json"}))
            if j is not None:
                parts.append(parse_disposition_tpex_hist(j))
            cur += pd.offsets.MonthBegin(1)
    parts = [p for p in parts if len(p)]
    d = pd.concat(parts, ignore_index=True) if parts else pd.DataFrame(
        columns=["ticker", "name", "announce_date", "start", "end", "reason", "measure", "market"])
    d = d.drop_duplicates(["ticker", "announce_date", "start"]).reset_index(drop=True)
    news = disposition_to_news(d) if len(d) else pd.DataFrame(columns=NEWS_COLS)
    if save and len(d):
        save_parquet(d, "master", "disposition", ["market", "ticker", "announce_date", "start"])
        save_parquet(news, "news", "announcements_disposition", ["news_id"])
    return d, news
