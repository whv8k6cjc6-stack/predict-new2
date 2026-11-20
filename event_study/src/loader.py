"""load(table, source='auto')：優先 data/raw/<子目錄>/，否則回退 data/synthetic 並警告。
（M1 抓取器由 src/fetch/ 負責。）"""
import warnings
from pathlib import Path

import pandas as pd

from . import PROJECT_ROOT, get_config
from .schemas import TABLES, coerce, validate

SYNTH_EXTRA = ("events_truth", "effects_truth", "news_truth")


def _files(folder, table):
    """folder 內檔名為 table 或以 table_ 開頭的 parquet/csv（含子目錄）。"""
    if not folder.is_dir():
        return []
    out = []
    for p in sorted(folder.rglob("*")):
        if p.suffix in (".parquet", ".csv") and (p.stem == table or p.stem.startswith(table + "_")):
            out.append(p)
    return out


def _read(p):
    return pd.read_parquet(p) if p.suffix == ".parquet" else pd.read_csv(p, low_memory=False)


def _read_all(paths):
    dfs = [_read(p) for p in paths]
    return pd.concat(dfs, ignore_index=True) if len(dfs) > 1 else dfs[0]


def write_table(df, path_noext):
    """寫 parquet，失敗則 csv。回傳實際路徑。"""
    path_noext = Path(path_noext)
    path_noext.parent.mkdir(parents=True, exist_ok=True)
    try:
        df.to_parquet(path_noext.with_suffix(".parquet"), index=False)
        return path_noext.with_suffix(".parquet")
    except Exception:
        df.to_csv(path_noext.with_suffix(".csv"), index=False)
        return path_noext.with_suffix(".csv")


def load(table, source="auto", root=None):
    """source: 'auto'(raw 優先，缺則合成+警告) | 'raw'(缺則 FileNotFoundError) | 'synthetic'。
    回傳已轉型 DataFrame；合成資料 is_synthetic=True，真實資料 False。"""
    root = Path(root) if root else PROJECT_ROOT
    is_extra = table in SYNTH_EXTRA
    if table not in TABLES and not is_extra:
        raise KeyError(f"未知資料表: {table}")
    raw_dir = root / "data" / "raw" / TABLES[table]["subdir"] if (table in TABLES and TABLES[table]["subdir"]) else None
    synth_dir = root / "data" / "synthetic"

    if source in ("auto", "raw") and raw_dir is not None:
        files = _files(raw_dir, table)
        if files:
            df = _read_all(files)
            if "is_synthetic" not in df.columns:
                df["is_synthetic"] = False
            return _finish(table, df)
    if source == "raw":
        raise FileNotFoundError(f"data/raw 下找不到 {table}")

    files = _files(synth_dir, table)
    if not files:
        from .synthetic import write_synthetic
        syn = get_config().get("synthetic", {})
        write_synthetic(synth_dir, seed=syn.get("seed", 42), n_tickers=syn.get("n_tickers", 60),
                        years=syn.get("years", 7))
        files = _files(synth_dir, table)
    if source == "auto":
        warnings.warn(f"找不到真實資料 {table}，已回退合成資料 (is_synthetic=True)；結果不得當成真實結論。",
                      UserWarning, stacklevel=2)
    return _finish(table, _read_all(files))


def _finish(table, df):
    if table in SYNTH_EXTRA:
        return df
    df = coerce(table, df)
    return validate(table, df)
