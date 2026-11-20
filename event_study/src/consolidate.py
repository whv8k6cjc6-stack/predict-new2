"""M4 事件整併：consolidate(events_raw, calendar) -> events（SPEC events 表）。

步驟（皆以 config.thresholds 為參數）：
 1. 澄清稿（is_clarification）剔除，放 attrs['clarifications']，不進主檢定。
 2. 去重：同股同類、標題 2-gram Jaccard >= jaccard_dedup 且 dedup_hours 小時內的不同新聞視為同一則。
 3. 合併：同股同類同向、T0 在 merge_trading_days 個交易日內併為一事件（T0/entry 取最早一則）。
 4. 同股同 T0 多事件：依優先序 18>1>11>3>2>其他（同級以 |score|、篇數）只留一筆，被淘汰者放 attrs['dropped']；
    該組內任兩筆方向相反 -> is_mixed。
 5. is_confounded：同股在 T0 前後 confound_days 個交易日內另有其他事件（含被淘汰者）。
T0 / entry_date 由 calendar.event_dates(published_at) 決定。"""
import hashlib

import numpy as np
import pandas as pd

from . import get_config
from .calendar import get_calendar
from .schemas import coerce

PRIORITY = [18, 1, 11, 3, 2]


def _bigrams(s):
    s = "".join(str(s).split())
    return {s[i:i + 2] for i in range(len(s) - 1)} or {s}


def jaccard(a, b):
    A, B = _bigrams(a), _bigrams(b)
    return len(A & B) / len(A | B) if (A | B) else 0.0


def _prio(t):
    if t == 12:                      # 供應鏈傳聞（tier2）一律排在具體公告之後
        return len(PRIORITY) + 1
    return PRIORITY.index(t) if t in PRIORITY else len(PRIORITY)


def _dedup(df, thr, hours):
    """同 ticker+event_type 內，後到的相似標題(24h內、不同 news_id)併入最早者。回傳每組一列，news_ids 為 list。"""
    out = []
    for (_, _), g in df.sort_values("published_at").groupby(["ticker", "event_type"], sort=False):
        groups = []     # [rep_row_dict, ids, last_idx]
        for r in g.to_dict("records"):
            placed = False
            for grp in groups:
                rep = grp["rep"]
                if (r["published_at"] - rep["published_at"]) <= pd.Timedelta(hours=hours) and \
                        (r["news_id"] in grp["ids"] or jaccard(r["title"], rep["title"]) >= thr):
                    if r["news_id"] not in grp["ids"]:
                        grp["ids"].append(r["news_id"])
                    placed = True
                    break
            if not placed:
                groups.append(dict(rep=r, ids=[r["news_id"]]))
        for grp in groups:
            row = dict(grp["rep"])
            row["news_ids"] = grp["ids"]
            out.append(row)
    return out


def consolidate(events_raw, calendar=None, cfg=None):
    th = (cfg or get_config()).get("thresholds", {})
    thr, hours = float(th.get("jaccard_dedup", 0.8)), float(th.get("dedup_hours", 24))
    merge_days, conf_days = int(th.get("merge_trading_days", 3)), int(th.get("confound_days", 2))
    cal = calendar or get_calendar()
    cols = ["event_id", "ticker", "event_type", "sentiment", "score", "rule_id", "published_at", "event_date",
            "entry_date", "n_articles", "news_ids", "is_mixed", "is_confounded"]
    ev = events_raw
    clar = ev[ev["is_clarification"]] if "is_clarification" in ev.columns else ev.iloc[0:0]
    main = ev[~ev["is_clarification"]] if "is_clarification" in ev.columns else ev
    if main.empty:
        empty = coerce("events", pd.DataFrame(columns=cols))
        empty.attrs.update(clarifications=clar, dropped=pd.DataFrame(), rules_version=ev.attrs.get("rules_version"))
        return empty
    main = main.copy()
    # 同一則新聞的次要類別/多檔個股保留；只有 (ticker,type) 內才去重

    # ---- 2 去重
    rows = _dedup(main, thr, hours)

    # ---- T0 / entry
    for r in rows:
        r["t0"], r["entry"] = cal.event_dates(r["published_at"])
    allt0 = [r["t0"] for r in rows]
    days = cal.trading_days_between(min(allt0) - pd.Timedelta(days=20), max(allt0) + pd.Timedelta(days=20))
    ordn = lambda d: int(days.searchsorted(pd.Timestamp(d)))        # noqa: E731

    # ---- 3 合併（同股同類同向，3 交易日內，窗口以首則 T0 起算）
    merged = []
    bykey = {}
    for r in sorted(rows, key=lambda x: x["published_at"]):
        bykey.setdefault((r["ticker"], r["event_type"], r["sentiment"]), []).append(r)
    for key, lst in bykey.items():
        cur = None
        for r in lst:
            if cur is not None and ordn(r["t0"]) - ordn(cur["t0"]) <= merge_days:
                cur["news_ids"] = cur["news_ids"] + [n for n in r["news_ids"] if n not in cur["news_ids"]]
                cur["score"] += r["score"]
                cur["source_tier"] = min(cur["source_tier"], r["source_tier"]) if pd.notna(r["source_tier"]) and pd.notna(cur["source_tier"]) else cur["source_tier"]
                cur["is_synthetic"] = cur["is_synthetic"] or r["is_synthetic"]
            else:
                cur = dict(r)
                cur["news_ids"] = list(r["news_ids"])
                merged.append(cur)

    # ---- 4 同股同 T0 優先序、is_mixed
    byday = {}
    for m in merged:
        byday.setdefault((m["ticker"], m["t0"]), []).append(m)
    kept, dropped = [], []
    for _, g in byday.items():
        g = sorted(g, key=lambda m: (_prio(m["event_type"]), -abs(m["score"]), -len(m["news_ids"]), m["event_type"]))
        sents = [m["sentiment"] for m in g]
        mixed = any(a * b < 0 for i, a in enumerate(sents) for b in sents[i + 1:])
        top = dict(g[0])
        top["is_mixed"] = bool(mixed)
        kept.append(top)
        dropped += g[1:]

    # ---- 5 干擾
    pool = {}
    for m in kept + dropped:
        pool.setdefault(m["ticker"], []).append((ordn(m["t0"]), id(m)))
    out = []
    for m in kept:
        me = ordn(m["t0"])
        conf = any(abs(o - me) <= conf_days and i != id(m) for o, i in pool[m["ticker"]])
        first = m["news_ids"][0]
        eid = hashlib.sha1(f"{m['ticker']}|{m['event_type']}|{m['t0']:%Y-%m-%d}|{first}".encode()).hexdigest()
        out.append(dict(event_id=eid, ticker=m["ticker"], event_type=m["event_type"], sentiment=m["sentiment"],
                        score=m["score"], rule_id=m["rule_id"], published_at=m["published_at"],
                        event_date=m["t0"], entry_date=m["entry"], n_articles=len(m["news_ids"]),
                        news_ids=",".join(m["news_ids"]), is_mixed=m["is_mixed"], is_confounded=bool(conf),
                        source_tier=m["source_tier"], is_synthetic=bool(m["is_synthetic"])))
    res = pd.DataFrame(out).sort_values(["published_at", "ticker", "event_type"]).reset_index(drop=True)
    res = coerce("events", res)
    res.attrs.update(clarifications=clar, rules_version=ev.attrs.get("rules_version"),
                     dropped=pd.DataFrame([{k: d[k] for k in ("ticker", "event_type", "sentiment", "t0")} for d in dropped]))
    return res
