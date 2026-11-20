"""Fetch settings (kept here on purpose; config.yaml is owned by someone else).

Security: only hosts in ALLOWED_HOSTS may be contacted, https only, no credentials.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]          # event_study/
RAW_DIR = ROOT / "data" / "raw"
CACHE_DIR = RAW_DIR / "_cache"

USER_AGENT = "event-study-research"                  # generic, no personal data

ALLOWED_HOSTS = frozenset({
    "www.twse.com.tw", "openapi.twse.com.tw", "mops.twse.com.tw", "mopsov.twse.com.tw",
    "www.tpex.org.tw", "openapi.tpex.org.tw", "www.taifex.com.tw",
    "query1.finance.yahoo.com", "query2.finance.yahoo.com", "news.google.com",
})

# minimum seconds between requests to the same host (never below 1.0)
MIN_INTERVAL = {
    "www.twse.com.tw": 5.0,      # TWSE WAF bans the IP for minutes on bursts (HTTP 307 page); stay slow
    "news.google.com": 2.0,
    "query1.finance.yahoo.com": 2.0,
    "query2.finance.yahoo.com": 2.0,
}
DEFAULT_MIN_INTERVAL = 1.0

TIMEOUT = 30
MAX_RETRIES = 4
BACKOFF_BASE = 4.0               # seconds; sleep = base * 2**attempt (capped)
BACKOFF_CAP = 90.0
MAX_BYTES = 80 * 1024 * 1024     # reject bigger responses
SNAPSHOT_TTL = 6 * 3600          # cache lifetime for "latest snapshot" endpoints
RECENT_TTL = 6 * 3600            # cache lifetime for the current / just-ended month

# endpoints
TWSE_STOCK_DAY = "https://www.twse.com.tw/exchangeReport/STOCK_DAY"
TPEX_STOCK_DAY = "https://www.tpex.org.tw/www/zh-tw/afterTrading/tradingStock"
TPEX_DISPOSAL_HIST = "https://www.tpex.org.tw/www/zh-tw/bulletin/disposal"
YAHOO_CHART = "https://query1.finance.yahoo.com/v8/finance/chart/{symbol}"
TWSE_OPENAPI = "https://openapi.twse.com.tw/v1"
TPEX_OPENAPI = "https://www.tpex.org.tw/openapi/v1"
GNEWS_RSS = "https://news.google.com/rss/search"
TAIFEX_FUT_DOWN = "https://www.taifex.com.tw/cht/3/futDataDown"
TAIFEX_STOCK_LIST = "https://www.taifex.com.tw/cht/2/stockLists"

TWSE_PRICE_START = "2010-01-01"   # STOCK_DAY documented history start
PCT_LIMIT_CHANGE = "2015-06-01"   # daily limit 7% -> 10%
TAIPEI = "Asia/Taipei"
