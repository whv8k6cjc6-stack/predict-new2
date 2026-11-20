"""台股交易日曆：週末 + 固定月日假日 + 可設定假日清單（config.yaml: calendar）。
所有函式接受 str/date/Timestamp，回傳 tz-naive 正規化 pd.Timestamp。"""
import pandas as pd

TZ = "Asia/Taipei"


def _d(x):
    ts = pd.Timestamp(x)
    if ts.tzinfo is not None:
        ts = ts.tz_convert(TZ).tz_localize(None)
    return ts.normalize()


class TradingCalendar:
    def __init__(self, holidays=(), fixed_md=()):
        self.holidays = {_d(h) for h in holidays}
        self.fixed_md = set(fixed_md)

    def add_holidays(self, holidays):
        self.holidays |= {_d(h) for h in holidays}

    def is_trading_day(self, d):
        d = _d(d)
        return (d.weekday() < 5 and d not in self.holidays
                and d.strftime("%m-%d") not in self.fixed_md)

    def next_trading_day(self, ts, include_self=False):
        d = _d(ts)
        if include_self and self.is_trading_day(d):
            return d
        d += pd.Timedelta(days=1)
        while not self.is_trading_day(d):
            d += pd.Timedelta(days=1)
        return d

    def prev_trading_day(self, ts, include_self=False):
        d = _d(ts)
        if include_self and self.is_trading_day(d):
            return d
        d -= pd.Timedelta(days=1)
        while not self.is_trading_day(d):
            d -= pd.Timedelta(days=1)
        return d

    def trading_days_between(self, start, end, inclusive="both"):
        """start..end 之間的交易日 DatetimeIndex；inclusive: both/left/right/neither。"""
        rng = pd.date_range(_d(start), _d(end), freq="D", inclusive=inclusive)
        return pd.DatetimeIndex([d for d in rng if self.is_trading_day(d)])

    def add_trading_days(self, ts, n):
        d = _d(ts)
        step = 1 if n >= 0 else -1
        for _ in range(abs(int(n))):
            d = self.next_trading_day(d) if step > 0 else self.prev_trading_day(d)
        return d

    def event_dates(self, published_at):
        """SPEC 事件日規則 -> (T0, entry_date)。
        09:00前->(當日,當日開盤進)；盤中->(當日,次日開盤進)；13:30後/非交易日->(次一交易日,T0開盤進)。
        tz-naive 輸入視為台北時間。"""
        ts = pd.Timestamp(published_at)
        ts = ts.tz_localize(TZ) if ts.tzinfo is None else ts.tz_convert(TZ)
        d = ts.tz_localize(None).normalize()
        minutes = ts.hour * 60 + ts.minute
        if self.is_trading_day(d):
            if minutes < 9 * 60:
                return d, d
            if minutes < 13 * 60 + 30:
                return d, self.next_trading_day(d)
        n = self.next_trading_day(d)
        return n, n


_DEFAULT = None


def get_calendar(reload=False):
    global _DEFAULT
    if _DEFAULT is None or reload:
        from . import get_config
        c = get_config().get("calendar", {})
        _DEFAULT = TradingCalendar(c.get("holidays", []), c.get("fixed_holidays_md", []))
    return _DEFAULT


def set_holidays(holidays):
    get_calendar().add_holidays(holidays)


def is_trading_day(d): return get_calendar().is_trading_day(d)
def next_trading_day(ts, include_self=False): return get_calendar().next_trading_day(ts, include_self)
def prev_trading_day(ts, include_self=False): return get_calendar().prev_trading_day(ts, include_self)
def trading_days_between(start, end, inclusive="both"): return get_calendar().trading_days_between(start, end, inclusive)
def add_trading_days(ts, n): return get_calendar().add_trading_days(ts, n)
def event_dates(published_at): return get_calendar().event_dates(published_at)
