"""Google News RSS (news.google.com) -> news_raw rows with source_tier=2.

Caveats (important for look-ahead): RSS <pubDate> is what Google lists; for some items it is the
update/re-index time rather than first publication, so published_at may be LATER than the true time
(conservative) but occasionally the story was edited. Each query returns at most ~100 items, so a date
range is split into windows and windows that hit the cap are bisected. Links are Google redirect URLs
(news.google.com/rss/articles/...), the publisher is stored in `publisher`.
Output: news_id,published_at,first_seen_at(NaT),source('gnews'),title,body(''),url,source_tier=2,
        + ticker,publisher,query,is_synthetic
"""
from __future__ import annotations

import hashlib
import logging
import re
from email.utils import parsedate_to_datetime

import pandas as pd
from defusedxml import ElementTree as ET   # no entity expansion / DTD tricks

from . import settings as S
from ._http import Fetcher, FetchError
from ._io import save_parquet

log = logging.getLogger("fetch.gnews")
COLS = ["news_id", "published_at", "first_seen_at", "source", "title", "body", "url", "source_tier",
        "ticker", "publisher", "query", "is_synthetic"]
CAP = 95


def parse_rss(body: bytes, ticker: str = "", query: str = "") -> pd.DataFrame:
    try:
        root = ET.fromstring(body)
    except (ET.ParseError, ValueError) as e:   # DefusedXmlException subclasses ValueError
        raise FetchError(f"bad RSS: {e}")
    rows = []
    for it in root.iter("item"):
        title = (it.findtext("title") or "").strip()
        link = (it.findtext("link") or "").strip()
        pub = it.findtext("pubDate")
        if not title or not link or not pub:
            continue
        src_el = it.find("source")
        publisher = (src_el.text or "").strip() if src_el is not None else ""
        if publisher and title.endswith(f" - {publisher}"):
            title = title[: -len(publisher) - 3].rstrip()
        try:
            ts = pd.Timestamp(parsedate_to_datetime(pub)).tz_convert(S.TAIPEI)
        except (TypeError, ValueError):
            continue
        rows.append(dict(published_at=ts, source="gnews", title=title, body="", url=link, ticker=ticker,
                         publisher=publisher, query=query))
    if not rows:
        return pd.DataFrame(columns=COLS)
    df = pd.DataFrame(rows)
    df["news_id"] = [hashlib.sha1(f"{s}{u}{t}".encode()).hexdigest() for s, u, t in zip(df["source"], df["url"], df["title"])]
    df["first_seen_at"] = pd.Series(pd.NaT, index=df.index, dtype="datetime64[ns, Asia/Taipei]")
    df["source_tier"] = 2
    df["is_synthetic"] = False
    return df[COLS].drop_duplicates("news_id").reset_index(drop=True)


def _query_window(f: Fetcher, name: str, ticker: str, a: pd.Timestamp, b: pd.Timestamp) -> pd.DataFrame:
    """a inclusive, b exclusive (Google's before: is exclusive)."""
    q = f"{name} {ticker} after:{a:%Y-%m-%d} before:{b:%Y-%m-%d}"
    ttl = None if b < pd.Timestamp.today() - pd.Timedelta(days=3) else S.RECENT_TTL
    body = f.get(S.GNEWS_RSS, params={"q": q, "hl": "zh-TW", "gl": "TW", "ceid": "TW:zh-Hant"}, ttl=ttl,
                 validator=lambda x: b"<rss" in x[:500] or b"<?xml" in x[:100])
    df = parse_rss(body, ticker, q)
    if len(df) >= CAP and (b - a).days > 1:
        mid = a + (b - a) / 2
        mid = mid.normalize()
        return pd.concat([_query_window(f, name, ticker, a, mid), _query_window(f, name, ticker, mid, b)], ignore_index=True)
    return df


def fetch_google_news(name: str, ticker: str, start, end, window_days: int = 30, fetcher: Fetcher | None = None,
                      save: bool = True) -> pd.DataFrame:
    """Headlines mentioning '<name> <ticker>' with start <= date <= end (inclusive) -> data/raw/news/gnews_<ticker>.parquet.
    Failed windows are skipped with a warning (df.attrs['failed_windows'])."""
    f = fetcher or Fetcher()
    s, e = pd.Timestamp(start).normalize(), pd.Timestamp(end).normalize() + pd.Timedelta(days=1)
    parts, failed = [], []
    cur = s
    while cur < e:
        nxt = min(cur + pd.Timedelta(days=window_days), e)
        try:
            parts.append(_query_window(f, name, ticker, cur, nxt))
        except FetchError as ex:
            failed.append(f"{cur:%Y-%m-%d}~{nxt:%Y-%m-%d}"); log.warning("gnews %s %s: %s", ticker, cur, ex)
        cur = nxt
    parts = [p for p in parts if len(p)]
    df = pd.concat(parts, ignore_index=True).drop_duplicates("news_id") if parts else pd.DataFrame(columns=COLS)
    df.attrs["failed_windows"] = failed
    if save and len(df):
        save_parquet(df, "news", f"gnews_{ticker}", ["news_id"])
    return df
