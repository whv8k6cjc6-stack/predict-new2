"""Shared helpers: ROC dates, number parsing, atomic parquet upsert."""
from __future__ import annotations

import os
import re
from pathlib import Path

import numpy as np
import pandas as pd

from . import settings as S


def roc_to_date(s) -> pd.Timestamp:
    """'113/03/01' | '1130301' | '113/03' -> Timestamp (NaT if unparsable). Also accepts 8-digit Gregorian."""
    if s is None:
        return pd.NaT
    t = re.sub(r"\D", " ", str(s)).split()
    try:
        if len(t) == 1:
            d = t[0]
            if len(d) == 8:
                return pd.Timestamp(int(d[:4]), int(d[4:6]), int(d[6:8]))
            if len(d) in (6, 7):
                return pd.Timestamp(int(d[:-4]) + 1911, int(d[-4:-2]), int(d[-2:]))
            return pd.NaT
        y, m, d = (int(t[0]), int(t[1]), int(t[2]) if len(t) > 2 else 1)
        if y < 1911:
            y += 1911
        return pd.Timestamp(y, m, d)
    except (ValueError, IndexError):
        return pd.NaT


def num(x) -> float:
    """'1,234.50' -> 1234.5 ; '--', '-', '', None, 'X0.00' -> nan (leading X stripped)."""
    if x is None:
        return np.nan
    s = str(x).replace(",", "").strip().lstrip("X").strip()
    if s in ("", "-", "--", "---", "nan", "None"):
        return np.nan
    try:
        return float(s)
    except ValueError:
        return np.nan


def taipei(ts: pd.Series | pd.Timestamp):
    if isinstance(ts, pd.Series):
        return ts.dt.tz_localize(S.TAIPEI) if ts.dt.tz is None else ts.dt.tz_convert(S.TAIPEI)
    return ts.tz_localize(S.TAIPEI) if ts.tzinfo is None else ts.tz_convert(S.TAIPEI)


def save_parquet(df: pd.DataFrame, subdir: str, name: str, keys: list[str], root: Path | None = None) -> Path:
    """Upsert df into data/raw/<subdir>/<name>.parquet (existing rows with same keys replaced). Atomic."""
    out_dir = (root or S.RAW_DIR) / subdir
    out_dir.mkdir(parents=True, exist_ok=True)
    path = out_dir / f"{name}.parquet"
    if path.exists():
        try:
            old = pd.read_parquet(path)
            df = pd.concat([old, df], ignore_index=True)
        except Exception:
            pass
    if keys and len(df):
        df = df.drop_duplicates(keys, keep="last").sort_values(keys).reset_index(drop=True)
    tmp = path.with_suffix(".tmp")
    df.to_parquet(tmp, index=False)
    os.replace(tmp, path)
    return path
