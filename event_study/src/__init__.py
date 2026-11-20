"""事件驅動策略研究套件。"""
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
_CFG = {}


def get_config(path=None, reload=False):
    """讀取 config.yaml（預設專案根目錄），結果快取。"""
    import yaml
    p = Path(path) if path else PROJECT_ROOT / "config.yaml"
    key = str(p)
    if reload or key not in _CFG:
        with open(p, encoding="utf-8") as f:
            _CFG[key] = yaml.safe_load(f)
    return _CFG[key]
