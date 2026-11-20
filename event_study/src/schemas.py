"""資料表 schema（SPEC 資料表）、型別轉換與驗證。"""
import hashlib

import numpy as np
import pandas as pd

TZ = "Asia/Taipei"

EVENT_TYPES = {
    1: "財報/法說", 2: "月營收", 3: "重大訂單", 4: "現增/可轉債", 5: "減資", 6: "庫藏股",
    7: "股利政策", 8: "董監大股東交易", 9: "處置/注意股", 10: "訴訟裁罰", 11: "併購",
    12: "供應鏈傳聞", 13: "天災停工", 14: "政策關稅", 15: "漲降價", 16: "擴產",
    17: "高層異動", 18: "會計查核異常", 19: "評等目標價", 20: "指數成分調整",
}

# kind: str / float / int / bool / date / ts(台北時區)
TABLES = {
    "news_raw": dict(subdir="news", pk=["news_id"], cols=dict(
        news_id="str", published_at="ts", first_seen_at="ts", source="str", title="str",
        body="str", url="str", source_tier="int")),
    "events": dict(subdir=None, pk=["event_id"], cols=dict(
        event_id="str", ticker="str", event_type="int", sentiment="int", score="float",
        rule_id="str", published_at="ts", event_date="date", entry_date="date",
        n_articles="int", news_ids="str", is_mixed="bool", is_confounded="bool")),
    "prices_daily": dict(subdir="prices", pk=["ticker", "date"], cols=dict(
        ticker="str", date="date", open="float", high="float", low="float", close="float",
        adj_factor="float", volume="float", turnover="float", limit_up_px="float",
        limit_down_px="float", is_suspended="bool", is_disposition="bool")),
    "benchmark_daily": dict(subdir="prices", pk=["index_id", "date"], cols=dict(
        index_id="str", date="date", ret="float")),
    "company_master": dict(subdir="master", pk=["ticker", "valid_from"], cols=dict(
        ticker="str", valid_from="date", name="str", aliases="str", market="str",
        industry_code="str", list_date="date", delist_date="date", has_stock_futures="bool",
        marginable="bool", valid_to="date")),
    "relations": dict(subdir="relations", pk=["src", "dst", "rel_type", "valid_from"], cols=dict(
        src="str", dst="str", rel_type="str", valid_from="date", weight="float",
        valid_to="date", source="str")),
    "derivatives_daily": dict(subdir="derivatives", pk=["underlying", "date", "instrument"], cols=dict(
        underlying="str", date="date", instrument="str", settle="float", basis="float",
        volume="float", oi="float", iv_atm_30d="float", skew_25d="float", pc_ratio="float",
        data_tier="str")),
}
# adj_factor 慣例：調整後價 = close * adj_factor（除權息後的最新一天為 1）。
# relations 慣例：src=事件公司；rel_type=supplier 表示 dst 是 src 的供應商，customer 表示 dst 是 src 的客戶。
# aliases 以 '|' 分隔。


def make_news_id(source, url, title):
    return hashlib.sha1(f"{source}{url}{title}".encode("utf-8")).hexdigest()


def to_taipei(s):
    """轉成台北時區 tz-aware；tz-naive 視為台北當地時間。"""
    s = pd.Series(s)
    if getattr(s.dtype, "tz", None) is None:
        out = pd.to_datetime(s, errors="coerce")
        if getattr(out.dtype, "tz", None) is None:
            return out.dt.tz_localize(TZ)
        return out.dt.tz_convert(TZ)
    return s.dt.tz_convert(TZ)


def _to_bool(s):
    if s.dtype == object or str(s.dtype) in ("string", "str"):
        s = s.map({"True": True, "False": False, "true": True, "false": False, "1": True, "0": False}).where(s.notna())
    return s.fillna(False).astype(bool)


def coerce(table, df):
    """補缺欄、轉型。is_synthetic 缺值視為 False；news first_seen_at 缺值 = published_at+30 分鐘。"""
    spec = TABLES[table]
    df = df.copy()
    for c, kind in spec["cols"].items():
        if c not in df.columns:
            df[c] = False if kind == "bool" else pd.NA
        s = df[c]
        if kind == "str":
            df[c] = s.astype("object").where(s.notna(), None)
            df[c] = df[c].map(lambda v: v if v is None else str(v))
        elif kind == "float":
            df[c] = pd.to_numeric(s, errors="coerce").astype("float64")
        elif kind == "int":
            df[c] = pd.to_numeric(s, errors="coerce").astype("Int64")
        elif kind == "bool":
            df[c] = _to_bool(s)
        elif kind == "date":
            df[c] = pd.to_datetime(s, errors="coerce").dt.normalize()
        elif kind == "ts":
            df[c] = to_taipei(s)
    if table == "news_raw":
        miss = df["first_seen_at"].isna()
        df.loc[miss, "first_seen_at"] = df.loc[miss, "published_at"] + pd.Timedelta(minutes=30)
    df["is_synthetic"] = _to_bool(df["is_synthetic"]) if "is_synthetic" in df.columns else False
    first = list(spec["cols"]) + ["is_synthetic"]
    return df[first + [c for c in df.columns if c not in first]]


def validate(table, df):
    """缺欄或主鍵重複即 raise ValueError；回傳 df。"""
    spec = TABLES[table]
    missing = [c for c in spec["cols"] if c not in df.columns]
    if missing:
        raise ValueError(f"{table} 缺欄位: {missing}")
    if df.duplicated(spec["pk"]).any():
        raise ValueError(f"{table} 主鍵 {spec['pk']} 有重複")
    return df
