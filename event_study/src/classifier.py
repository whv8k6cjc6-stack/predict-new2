"""M3 事件分類：classify(news_raw, master) -> events_raw。規則全在 rules.yaml。

流程：標題前綴清理 -> 個股連結（aliases/名稱 + 四碼代號，as-of master）-> 提及 > max 檔視為盤勢文丟棄
-> 20 類關鍵字計分（標題 2、內文 1）-> 方向（情緒詞計分 + 否定詞反轉）-> 澄清稿標記。
月營收（類別 2）以文中 YoY/MoM 數值判定；併購（類別 11）依個股相對於「收購」動詞的位置判定被收購方(+)/收購方(0)。
規則凍結請記錄 rules_version()。"""
import hashlib
import json
import re
from pathlib import Path

import pandas as pd

from . import get_config

RULES_PATH = Path(__file__).resolve().parent / "rules.yaml"
EVENTS_RAW_COLS = ["news_id", "ticker", "event_type", "sentiment", "score", "rule_id", "published_at",
                   "first_seen_at", "source_tier", "title", "is_clarification", "cat_rank", "link_rank",
                   "is_synthetic"]
_PUNCT = "，,。；;:：、！!？?\n\r\t "


# ------------------------------------------------------------------ 規則載入
def _parse_term(t):
    t = str(t)
    w = 1.0
    m = re.match(r"^(.*)@(\d+(?:\.\d+)?)$", t, re.S)
    if m:
        t, w = m.group(1), float(m.group(2))
    pat = t[3:] if t.startswith("re:") else re.escape(t)
    return re.compile(pat, re.I), w, t


class Rules:
    def __init__(self, path=None, cfg=None):
        import yaml
        self.path = Path(path) if path else RULES_PATH
        with open(self.path, encoding="utf-8") as f:
            self.raw = yaml.safe_load(f)
        th = (cfg or get_config()).get("thresholds", {})
        self.max_tickers = int(th.get("max_tickers_per_article", 5))
        self.neg_window = int(th.get("negation_window_chars", 6))
        self.version = self._hash(th)
        g = self.raw["global"]
        self.min_trigger = float(g.get("min_trigger_score", 2))
        self.max_secondary = int(g.get("max_secondary_categories", 2))
        self.priority = list(g.get("priority", []))
        self.strip = [re.compile(x[3:] if x.startswith("re:") else re.escape(x)) for x in g.get("title_strip_prefix", [])]
        self.negations = [_parse_term(x)[0] for x in g.get("negations", [])]
        self.clar = [_parse_term(x)[0] for x in g.get("clarification", [])]
        self.stop = set(g.get("alias_stoplist", []))
        units = g.get("code_follow_units", "元億萬點張股年月日季度%％筆家檔")
        self.code_re = re.compile(r"(?<![\d.,])(\d{4})(?![\d])(?![.,]\d)(?![ ]?[" + re.escape(units) + "])")
        self.types = []
        for t in self.raw["types"]:
            self.types.append(dict(
                id=int(t["id"]), rule_id=t["rule_id"], special=t.get("special"),
                triggers=[_parse_term(x)[:2] for x in t.get("triggers", [])],
                pos=[_parse_term(x)[:2] for x in t.get("pos", [])],
                neg=[_parse_term(x)[:2] for x in t.get("neg", [])]))
        self.by_id = {t["id"]: t for t in self.types}

    def _hash(self, th):
        payload = dict(rules=self.raw, negation_window_chars=self.neg_window, max_tickers=self.max_tickers)
        s = json.dumps(payload, sort_keys=True, ensure_ascii=False)
        return hashlib.sha1(s.encode("utf-8")).hexdigest()[:12]

    # ---- 文字處理
    def clean_title(self, title):
        t = "" if title is None or (isinstance(title, float) and pd.isna(title)) else str(title)
        for p in self.strip:
            t = p.sub("", t, count=1)
        return t.strip()

    def _field_score(self, terms, text, mult):
        s = 0.0
        for pat, w in terms:
            if pat.search(text):
                s += mult * w
        return s

    def trigger_score(self, t, title, body):
        return (self._field_score(t["triggers"], title, 2.0), self._field_score(t["triggers"], body, 1.0))

    def categorize(self, title, body):
        """回傳 [(type_id, score, title_score)] 依分數、優先序排序（僅 >= min_trigger_score）。"""
        out = []
        for t in self.types:
            ts, bs = self.trigger_score(t, title, body)
            if ts + bs >= self.min_trigger:
                out.append((t["id"], ts + bs, ts))
        pri = {k: i for i, k in enumerate(self.priority)}
        out.sort(key=lambda x: (-x[1], pri.get(x[0], 99), x[0]))
        return out

    def is_clarification(self, title, body):
        if any(p.search(title) for p in self.clar):
            return True
        return sum(1 for p in self.clar if p.search(body)) >= 2

    def _polarity_matches(self, text, t):
        ms = []
        for sign, terms in ((1, t["pos"]), (-1, t["neg"])):
            for pat, w in terms:
                m = pat.search(text)
                if m and m.end() > m.start():
                    ms.append((m.start(), m.end(), sign, w))
        ms.sort(key=lambda x: (-(x[1] - x[0]), x[0]))      # 較長者優先，之後略過重疊
        taken, used = [], []
        for s, e, sign, w in ms:
            if any(s < ue and us < e for us, ue in used):
                continue
            used.append((s, e))
            taken.append((s, e, sign, w))
        return taken

    def _negated(self, text, start):
        lo = max(0, start - self.neg_window)
        win = text[lo:start]
        cut = max((win.rfind(c) for c in _PUNCT), default=-1)
        win = win[cut + 1:]
        return any(p.search(win) for p in self.negations)

    def direction(self, t, title, body):
        """score = Σ正 - Σ負（標題×2、內文×1），否定詞於情緒詞前 N 字內則該詞反轉；|score|<1 -> 0。"""
        if t.get("special") == "monthly_revenue":
            r = monthly_revenue_sentiment(title + "。" + body)
            if r is not None:
                return r
        score = 0.0
        for text, mult in ((title, 2.0), (body, 1.0)):
            for s, e, sign, w in self._polarity_matches(text, t):
                if self._negated(text, s):
                    sign = -sign
                score += sign * w * mult
        sent = 0 if abs(score) < 1 else (1 if score > 0 else -1)
        return score, sent


# ------------------------------------------------------------------ 月營收
_YOY = re.compile(r"(?P<k>年增率?|年減率?|YoY|年成長|年衰退|較去年同期(?:成長|增加|減少|衰退|下滑|增|減)?|年比|年增減)"
                  r"(?P<mid>[^0-9\-+%％。；;]{0,8})(?P<n>[+\-]?\d+(?:,\d{3})*(?:\.\d+)?)\s*[%％]", re.I)
_MOM = re.compile(r"(?P<k>月增率?|月減率?|MoM|較上月(?:成長|增加|減少|衰退|下滑|增|減)?|較上個月(?:成長|增加|減少|衰退|下滑|增|減)?|"
                  r"月比|較前月(?:成長|增加|減少|衰退|下滑|增|減)?)"
                  r"(?P<mid>[^0-9\-+%％。；;]{0,8})(?P<n>[+\-]?\d+(?:,\d{3})*(?:\.\d+)?)\s*[%％]", re.I)
_NEGW = re.compile(r"減|衰退|下滑|縮|跌")


def _first_pct(rx, text):
    for m in rx.finditer(text):
        v = float(m.group("n").replace(",", ""))
        if _NEGW.search(m.group("k") + m.group("mid")) and v > 0:
            v = -v
        return v
    return None


def monthly_revenue_sentiment(text):
    """YoY 與 MoM 皆 >= +20% 為 +，皆 <= -20% 為 -，其餘 0。缺任一個數值 -> 0（保守）。
    無法解析任何數值時回傳 None（交由一般情緒詞判定）。score = (YoY+MoM)/2/20。"""
    yoy, mom = _first_pct(_YOY, text), _first_pct(_MOM, text)
    if yoy is None and mom is None:
        return None
    if yoy is None or mom is None:
        return 0.0, 0
    sc = (yoy + mom) / 2 / 20
    if yoy >= 20 and mom >= 20:
        return sc, 1
    if yoy <= -20 and mom <= -20:
        return sc, -1
    return sc, 0


# ------------------------------------------------------------------ 個股連結
class AliasIndex:
    def __init__(self, master, rules):
        self.rules = rules
        self.alias = {}          # lower alias -> list of (ticker, valid_from, valid_to, delist)
        self.codes = {}          # ticker -> list of (valid_from, valid_to, delist)
        m = master.copy()
        for r in m.itertuples(index=False):
            tk = str(r.ticker)
            vf = pd.Timestamp(r.valid_from) if pd.notna(r.valid_from) else pd.Timestamp.min
            vt = pd.Timestamp(r.valid_to) if pd.notna(getattr(r, "valid_to", pd.NaT)) else pd.Timestamp.max
            dl = pd.Timestamp(r.delist_date) + pd.Timedelta(days=30) if pd.notna(getattr(r, "delist_date", pd.NaT)) else pd.Timestamp.max
            self.codes.setdefault(tk, []).append((vf, vt, dl))
            names = [getattr(r, "name", None)] + str(getattr(r, "aliases", "") or "").split("|")
            for a in names:
                if a is None or (isinstance(a, float) and pd.isna(a)):
                    continue
                a = str(a).strip()
                if len(a) < 2 or a in rules.stop:
                    continue
                self.alias.setdefault(a.lower(), []).append((tk, vf, vt, dl))
        self.lengths = sorted({len(a) for a in self.alias}, reverse=True)

    def _active(self, d, vf, vt, dl):
        return d is None or vf <= d <= min(vt, dl)

    def scan(self, text, d):
        """回傳依出現順序的 [(ticker, pos)]（去重，保留首次位置）。含別名與四碼代號。d=None 表示不做 as-of 篩選。"""
        found = {}
        low = text.lower()
        i, n = 0, len(low)
        while i < n:
            hit = False
            for L in self.lengths:
                if i + L > n:
                    continue
                seg = low[i:i + L]
                ents = self.alias.get(seg)
                if not ents:
                    continue
                if seg.isascii() and seg[0].isalnum():          # 英文別名需詞界
                    if (i > 0 and low[i - 1].isascii() and low[i - 1].isalnum()) or \
                       (i + L < n and low[i + L].isascii() and low[i + L].isalnum()):
                        continue
                tks = {e[0] for e in ents if self._active(d, e[1], e[2], e[3])}
                if len(tks) == 1:
                    found.setdefault(next(iter(tks)), i)
                i += L
                hit = True
                break
            if not hit:
                i += 1
        for m in self.rules.code_re.finditer(text):
            tk = m.group(1)
            if tk in self.codes and any(self._active(d, *e) for e in self.codes[tk]):
                found.setdefault(tk, m.start())
        return sorted(found.items(), key=lambda kv: kv[1])


# ------------------------------------------------------------------ 併購方向
_MNA = re.compile(r"公開收購|收購|併購|購併|並購|合併|入主|標購|要約|換股|股份轉換|私有化")
_PASSIVE = re.compile(r"[被遭獲]|將由|擬由")


def _mna_sentiment(text, pos):
    m = _MNA.search(text)
    if not m:
        return 0, 0.0
    v = m.start()
    if pos >= v:                                  # 收購動詞之後：被收購方
        return 1, 2.0
    between = text[pos:v]
    if _PASSIVE.search(between):
        return 1, 2.0
    return 0, 0.0                                 # 動詞之前：收購方（或「A與B合併」）


# ------------------------------------------------------------------ 主函式
def rules_version(path=None):
    """rules.yaml（含否定視窗/盤勢文門檻等相關 config 門檻）的內容雜湊，凍結規則時記錄。"""
    return Rules(path).version


def classify(news_raw, master, rules=None):
    """news_raw + company_master -> events_raw（每筆 新聞×個股×類別 一列，含 rule_id）。
    欄位見 EVENTS_RAW_COLS；is_clarification=True 為澄清稿（不進主檢定）；cat_rank=1 為該新聞主類別，
    link_rank 為個股在標題中的出現順序。>max_tickers 檔個股的盤勢文整篇丟棄。
    attrs['rules_version'] 為規則版本雜湊。"""
    R = rules or Rules()
    idx = AliasIndex(master, R)
    rows = []
    has_syn = "is_synthetic" in news_raw.columns
    for r in news_raw.itertuples(index=False):
        title = R.clean_title(r.title)
        body = "" if r.body is None or (isinstance(r.body, float) and pd.isna(r.body)) else str(r.body)
        pub = pd.Timestamp(r.published_at)
        d = (pub.tz_localize(None) if pub.tzinfo is None else pub.tz_convert("Asia/Taipei").tz_localize(None)).normalize()
        t_tk, b_tk = idx.scan(title, d), idx.scan(body, d)
        # 盤勢文判斷不看 as-of（已下市/未上市者也算一檔）
        all_tk = {k for k, _ in idx.scan(title, None)} | {k for k, _ in idx.scan(body, None)}
        if len(all_tk) > R.max_tickers:
            continue
        cats = R.categorize(title, body)
        if not cats:
            continue
        clar = R.is_clarification(title, body)
        if clar:
            cats = cats[:1]
        else:
            first_title = [c for c in cats if c[2] > 0]
            cats = cats[:1] + [c for c in first_title if c[0] != cats[0][0]][:R.max_secondary]
        if t_tk:
            tickers, src_text = t_tk, title
        elif b_tk:
            tickers, src_text = b_tk[:1], body
        else:
            tickers, src_text = [], title
        for cr, (tid, _, _) in enumerate(cats, 1):
            t = R.by_id[tid]
            tk_list = tickers
            if tid == 12:
                tk_list = tickers[:1]
            if not tk_list:
                if tid == 14:
                    tk_list = [("MARKET", 0)]
                else:
                    continue
            score, sent = R.direction(t, title, body)
            for lr, (tk, pos) in enumerate(tk_list, 1):
                sc, se = score, sent
                if t["special"] == "mna" and tk != "MARKET":
                    ctx = src_text if _MNA.search(src_text) else title
                    se, sc = _mna_sentiment(ctx, pos if ctx is src_text else 0)
                rows.append(dict(
                    news_id=r.news_id, ticker=tk, event_type=tid, sentiment=int(se), score=float(sc),
                    rule_id=t["rule_id"], published_at=r.published_at,
                    first_seen_at=getattr(r, "first_seen_at", pd.NaT), source_tier=getattr(r, "source_tier", pd.NA),
                    title=title, is_clarification=bool(clar), cat_rank=cr, link_rank=lr,
                    is_synthetic=bool(getattr(r, "is_synthetic", False)) if has_syn else False))
    out = pd.DataFrame(rows, columns=EVENTS_RAW_COLS)
    if len(out):
        out["event_type"] = out["event_type"].astype(int)
        out["sentiment"] = out["sentiment"].astype(int)
    out.attrs["rules_version"] = R.version
    return out


if __name__ == "__main__":
    print("rules_version:", rules_version())
