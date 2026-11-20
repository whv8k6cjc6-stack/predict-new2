"""合成資料：植入已知效果，供管線驗收。所有表 is_synthetic=True，不得當成真實結論。

植入效果（以 EVENT_SPECS/SUPPLIER_LAG 為準；效果均勻攤在 d 個交易日、不含雜訊）：
  重大訂單(3)  +3.0% 攤在 entry..entry+20 (21 日) -> CAR[entry,h>=20/21]=+3%
  處置/注意股(9) -2.0% 攤在 entry..entry+9 (10 日)；is_disposition 同期為 True
  現增/可轉債(4) -1.5% 攤在 entry..entry+9
  供應商滯後    重大訂單客戶的供應商 +1.0% 攤在 T0+1..T0+20 (20 日)
  高層異動(17)  報酬均值 0，但個股殘差波動 x1.6 持續 entry..entry+20（波動研究用）
  庫藏股(6)/擴產(16)/評等(19) 均為 0 效果（FDR 對照）
額外鍵：events_truth / effects_truth / news_truth（真值標籤，非 SPEC 表）。
"""
import numpy as np
import pandas as pd

from . import get_config
from .calendar import get_calendar
from .schemas import EVENT_TYPES, coerce, make_news_id

TZ = "Asia/Taipei"

# name: (type_id, 每檔每年事件數, 攤開天數, 植入CAR, sentiment)
EVENT_SPECS = {
    "major_order": dict(type_id=3, rate=1.5, days=21, car=0.03, sentiment=1),
    "disposition": dict(type_id=9, rate=0.7, days=10, car=-0.02, sentiment=-1),
    "equity_raise": dict(type_id=4, rate=0.7, days=10, car=-0.015, sentiment=-1),
    "buyback": dict(type_id=6, rate=0.7, days=0, car=0.0, sentiment=1),
    "expansion": dict(type_id=16, rate=0.7, days=0, car=0.0, sentiment=1),
    "exec_change": dict(type_id=17, rate=1.0, days=0, car=0.0, sentiment=0),
    "rating": dict(type_id=19, rate=1.0, days=0, car=0.0, sentiment=1),
}
SUPPLIER_LAG = dict(car=0.01, start_offset=1, days=20)
EXEC_VOL_MULT, EXEC_VOL_DAYS = 1.6, 21
SLOT, WARMUP = 32, 270

_CH = list("宏達聯華旭晶欣鴻泰碩揚偉冠佳雄展億豐盛茂群興昌瑞勝順嘉恆鼎凱捷訊拓")
_SUF = ["科技", "電子", "材料", "精密", "化工", "光電", "生技", "能源", "營造", "食品", "紡織", "鋼鐵"]
_MEDIA = ["經濟日報", "工商時報", "鉅亨網", "財經新報"]
_CUST = ["國際大廠", "歐美客戶", "車用客戶", "政府標案", "海外電信商"]

TITLES = {
    3: ["{m}公告取得{c}逾{x}億元重大訂單", "{m}接獲{c}{x}億元大單 營運添動能", "{m}簽下{c}長約 訂單金額達{x}億元"],
    9: ["{m}列入處置股票 自明日起分盤交易", "{m}股價異常波動 公告處置10個營業日"],
    4: ["{m}董事會通過辦理現金增資發行新股", "{m}擬發行可轉換公司債 籌資{x}億元"],
    6: ["{m}董事會決議買回庫藏股 護盤", "{m}宣布實施庫藏股 買回區間{p}元"],
    16: ["{m}宣布擴產 新廠動工 投資{x}億元", "{m}董事會通過擴建廠房 擴大產能"],
    17: ["{m}宣布總經理異動 新任由內部升任", "{m}財務長請辭 董事會通過新任人選"],
    19: ["外資發布{m}報告 目標價調整至{p}元", "{m}獲券商評等 目標價{p}元"],
}
BODIES = {
    3: "{n}今日公告，取得{c}訂單，金額約{x}億元，預計未來兩年陸續出貨，對營收具正面貢獻。",
    9: "證交所公告，{n}因近期股價與成交量異常，自明日起列入處置股票，採分盤撮合，為期10個營業日。",
    4: "{n}董事會決議辦理現金增資，預計發行新股籌資，股本將擴大，市場關注稀釋效應。",
    6: "{n}董事會決議買回庫藏股，預計買回股數約{x}千張，買回期間一個月。",
    16: "{n}公告擴產計畫，新廠預計明年完工，資本支出約{x}億元，盼提升產能。",
    17: "{n}公告人事異動，相關接任安排已提報董事會通過，公司表示營運不受影響。",
    19: "分析師指出{n}展望穩健，維持評等，目標價{p}元，提醒留意市場波動。",
}
NOISE_T = ["{m}董事長出席公益活動 捐贈物資", "{m}舉辦員工運動會 凝聚向心力",
           "{m}推出新品 參加國際展覽", "{m}獲選為永續企業 發布年度報告書"]
NEG_T = ["{m}未獲重大訂單 市場傳聞落空", "{m}無處置之虞 公司表示股價波動屬正常",
         "{m}並未辦理現金增資 籌資傳言不實", "{m}尚無擴產計畫 回應市場關切"]


def _write_markets(rng, n):
    return rng.choice(["TWSE"] * 3 + ["TPEX"], n)


def make_synthetic(seed=42, n_tickers=60, years=7, start=None):
    cfg = get_config().get("synthetic", {})
    rng = np.random.default_rng(seed)
    cal = get_calendar()
    start = pd.Timestamp(start or cfg.get("start_date", "2017-01-03"))
    days = cal.trading_days_between(start, start + pd.DateOffset(years=years) - pd.Timedelta(days=1))
    nd, n = len(days), n_tickers
    codes = [f"{2301 + 13 * i:04d}" for i in range(n)]

    # ---------- company_master ----------
    pairs, seen = [], set()
    while len(pairs) < n:
        p = "".join(rng.choice(_CH, 2, replace=False))
        if p not in seen:
            seen.add(p); pairs.append(p)
    sufi = rng.integers(0, len(_SUF), n)
    names = [pairs[i] + _SUF[sufi[i]] for i in range(n)]
    ind = [f"{10 + s}" for s in sufi]
    li = np.zeros(n, int); di = np.full(n, nd - 1)
    late = rng.choice(n, max(1, n // 20), replace=False)
    li[late] = rng.integers(300, 600, len(late))
    rest = np.setdiff1d(np.arange(n), late)
    dead = rng.choice(rest, max(1, n // 30), replace=False)
    di[dead] = rng.integers(nd - 450, nd - 150, len(dead))
    list_dates = [days[0] - pd.Timedelta(days=int(rng.integers(800, 4000))) if li[j] == 0 else days[li[j]] for j in range(n)]
    master = pd.DataFrame(dict(
        ticker=codes, valid_from=list_dates, name=names, aliases=pairs,
        market=_write_markets(rng, n), industry_code=ind, list_date=list_dates,
        delist_date=[days[di[j]] if di[j] < nd - 1 else pd.NaT for j in range(n)],
        has_stock_futures=rng.random(n) < 0.4, marginable=rng.random(n) < 0.8, valid_to=pd.NaT))

    # ---------- relations ----------
    rel = []
    for i in range(n):
        for j in rng.choice([k for k in range(n) if k != i], int(rng.integers(1, 3)), replace=False):
            vf = max(days[0], days[max(li[i], li[j])])
            rel += [(codes[i], codes[j], "supplier", vf), (codes[j], codes[i], "customer", vf)]
    for s in set(ind):
        m = [k for k in range(n) if ind[k] == s]
        for a, b in zip(m[:-1], m[1:]):
            vf = max(days[0], days[max(li[a], li[b])])
            rel += [(codes[a], codes[b], "peer", vf), (codes[b], codes[a], "peer", vf)]
    relations = pd.DataFrame(rel, columns=["src", "dst", "rel_type", "valid_from"]).drop_duplicates(
        ["src", "dst", "rel_type"])
    relations["weight"] = 1.0
    relations["valid_to"] = pd.NaT
    relations["source"] = "synthetic"
    suppliers = {codes[i]: [] for i in range(n)}
    for r in relations[relations.rel_type == "supplier"].itertuples():
        suppliers[r.src].append(codes.index(r.dst))

    # ---------- 事件排程 ----------
    sched = []   # dict(j, spec, ts, t0, entry, confounder)
    for j in range(n):
        lo, hi = li[j] + WARMUP, di[j] - 45
        nslot = (hi - lo) // SLOT
        if nslot < 3:
            continue
        slots = lo + SLOT * np.arange(nslot) + rng.integers(0, 7, nslot)
        free = list(rng.permutation(nslot))
        for name, sp in EVENT_SPECS.items():
            c = min(rng.poisson(sp["rate"] * nslot * SLOT / 245), len(free))
            for _ in range(c):
                s = int(slots[free.pop()])
                ts = _pub_time(rng, days, s, cal)
                t0, entry = cal.event_dates(ts)
                sched.append(dict(j=j, spec=name, ts=ts, t0=t0, entry=entry, confounder=False))
    extra = []
    for ev in sched:
        if EVENT_SPECS[ev["spec"]]["car"] != 0 and rng.random() < 0.06:   # 干擾：隔日另一則無效果的評等
            ts = ev["ts"] + pd.Timedelta(hours=float(rng.uniform(18, 30)))
            t0, entry = cal.event_dates(ts)
            extra.append(dict(j=ev["j"], spec="rating", ts=ts, t0=t0, entry=entry, confounder=True))
    sched += extra

    # ---------- 報酬 ----------
    sig_m = 0.010 * np.exp(0.3 * _ar1(rng, nd, 0.98))
    Rm = rng.normal(0.0004, 1.0, nd) * sig_m
    beta = rng.uniform(0.7, 1.3, n)
    sig_i = rng.uniform(0.012, 0.020, n)
    inj = np.zeros((nd, n)); volm = np.ones((nd, n)); vmult = np.ones((nd, n))
    disp = np.zeros((nd, n), bool)
    ev_rows, eff_rows = [], []
    idx_of = {d: k for k, d in enumerate(days)}
    own_events = {j: [] for j in range(n)}
    for ev in sched:
        j, sp = ev["j"], EVENT_SPECS[ev["spec"]]
        e = idx_of[ev["entry"]]
        ev["e"] = e
        own_events[j].append(idx_of[ev["t0"]])
        if sp["car"] != 0:
            inj[e:e + sp["days"], j] += sp["car"] / sp["days"]
            eff_rows.append(dict(kind="event", ticker=codes[j], source_ticker=codes[j], event_type_id=sp["type_id"],
                                 t0=ev["t0"], start_date=days[e], end_date=days[e + sp["days"] - 1], planted_car=sp["car"]))
        if ev["spec"] == "exec_change":
            volm[e:e + EXEC_VOL_DAYS, j] = EXEC_VOL_MULT
            eff_rows.append(dict(kind="vol_mult", ticker=codes[j], source_ticker=codes[j], event_type_id=17,
                                 t0=ev["t0"], start_date=days[e], end_date=days[e + EXEC_VOL_DAYS - 1], planted_car=0.0))
        if ev["spec"] == "disposition":
            disp[e:e + 10, j] = True
        vmult[e, j] *= 2.5; vmult[min(e + 1, nd - 1), j] *= 1.5
    busy = np.zeros((nd, n), bool)
    for ev in sched:
        if ev["spec"] != "major_order" or ev["confounder"]:
            continue
        i, t0i = ev["j"], idx_of[ev["t0"]]
        for j in suppliers[codes[i]]:
            a, b = t0i + SUPPLIER_LAG["start_offset"], t0i + SUPPLIER_LAG["start_offset"] + SUPPLIER_LAG["days"]
            if b >= di[j] or a <= li[j] + 1:
                continue
            if any(t0i - 5 <= t <= t0i + 22 for t in own_events[j]) or busy[a - 5:b + 1, j].any():
                continue
            inj[a:b, j] += SUPPLIER_LAG["car"] / SUPPLIER_LAG["days"]
            busy[a:b, j] = True
            eff_rows.append(dict(kind="supplier_lag", ticker=codes[j], source_ticker=codes[i], event_type_id=3,
                                 t0=ev["t0"], start_date=days[a], end_date=days[b - 1], planted_car=SUPPLIER_LAG["car"]))
    eps = rng.normal(0, 1, (nd, n)) * sig_i * volm
    R = np.clip(beta * Rm[:, None] + eps + inj, -0.095, 0.095)
    susp = rng.random((nd, n)) < 0.0005
    R[susp] = 0.0

    # ---------- 價量 ----------
    p0 = rng.uniform(20, 150, n); base_vol = np.exp(rng.uniform(np.log(2e5), np.log(4e6), n))
    pr, dv = [], []
    for j in range(n):
        a, b = li[j], di[j] + 1
        r = R[a:b, j]
        adj = p0[j] * np.cumprod(1 + r)
        m = b - a
        f = np.ones(m)
        for y in range(m // 245 + 1):
            k = int(rng.integers(0, 245)) + 245 * y
            if 5 < k < m - 1:
                f[k] = 1 - rng.uniform(0.01, 0.05)
        cp = np.cumprod(f[::-1])[::-1]
        A = np.append(cp[1:], 1.0)                      # A_t = prod_{k>t} f_k
        close = np.round(adj / A, 2)
        prev = np.append(close[0], close[:-1])
        ref = np.round(prev * f, 2)
        up, dn = np.round(ref * 1.1, 2), np.round(ref * 0.9, 2)
        rr = close / prev - 1
        op = np.clip(np.round(prev * (1 + 0.5 * rr + rng.normal(0, 0.003, m)), 2), dn, up)
        hi_ = np.minimum(np.round(np.maximum(op, close) * (1 + np.abs(rng.normal(0, 0.004, m))), 2), up)
        lo_ = np.maximum(np.round(np.minimum(op, close) * (1 - np.abs(rng.normal(0, 0.004, m))), 2), dn)
        s = susp[a:b, j]
        op = np.where(s, prev, op); hi_ = np.where(s, prev, hi_); lo_ = np.where(s, prev, lo_)
        vol = np.round(base_vol[j] * rng.lognormal(0, 0.35, m) * (1 + 8 * np.abs(r)) * vmult[a:b, j])
        vol = np.where(s, 0, vol)
        pr.append(pd.DataFrame(dict(
            ticker=codes[j], date=days[a:b], open=op, high=hi_, low=lo_, close=close, adj_factor=A,
            volume=vol, turnover=np.round(vol * close), limit_up_px=up, limit_down_px=dn,
            is_suspended=s, is_disposition=disp[a:b, j])))
    prices = pd.concat(pr, ignore_index=True)
    bench = pd.DataFrame(dict(index_id="TAIEX", date=days, ret=Rm))

    # ---------- 衍生品 ----------
    dv = []
    pidx = prices.set_index(["ticker", "date"])
    for j in range(n):
        if not master.has_stock_futures[j]:
            continue
        p = prices[prices.ticker == codes[j]]
        m = len(p)
        basis = p.close.values * rng.normal(0.001, 0.002, m)
        oi = np.maximum(1000 + np.cumsum(rng.normal(0, 80, m)), 100).round()
        dv.append(pd.DataFrame(dict(underlying=codes[j], date=p.date.values, instrument="STF",
                                    settle=p.close.values + basis, basis=basis,
                                    volume=(p.volume.values * rng.uniform(0.02, 0.1, m) / 1000).round(), oi=oi,
                                    iv_atm_30d=np.nan, skew_25d=np.nan, pc_ratio=np.nan, data_tier="C")))
    lvl = 10000 * np.cumprod(1 + Rm)
    rv = pd.Series(Rm).rolling(30).std().values * np.sqrt(252)
    dv.append(pd.DataFrame(dict(underlying="TAIEX", date=days, instrument="TXF", settle=lvl * (1 + rng.normal(0, 0.001, nd)),
                                basis=lvl * rng.normal(0, 0.001, nd), volume=rng.integers(80000, 150000, nd).astype(float),
                                oi=rng.integers(80000, 120000, nd).astype(float),
                                iv_atm_30d=rv * rng.uniform(0.95, 1.1, nd), skew_25d=rng.normal(0.03, 0.01, nd),
                                pc_ratio=rng.uniform(0.7, 1.3, nd), data_tier="B")))
    for j in np.flatnonzero(master.has_stock_futures.values)[:2]:
        a, b = li[j], di[j] + 1
        rvj = pd.Series(R[a:b, j]).rolling(30).std().values * np.sqrt(252)
        dv.append(pd.DataFrame(dict(underlying=codes[j], date=days[a:b], instrument="OPT", settle=np.nan, basis=np.nan,
                                    volume=rng.integers(100, 2000, b - a).astype(float), oi=rng.integers(1000, 9000, b - a).astype(float),
                                    iv_atm_30d=rvj * rng.uniform(0.95, 1.1, b - a), skew_25d=rng.normal(0.03, 0.01, b - a),
                                    pc_ratio=rng.uniform(0.5, 1.5, b - a), data_tier="A")))
    deriv = pd.concat(dv, ignore_index=True)

    # ---------- 新聞 ----------
    news, truth, ev_truth = [], [], []
    ctr = [0]

    def add(ts, tier, title, body, kind, ticker=None, type_id=None, media=None):
        ctr[0] += 1
        if tier == 1:
            src, url = "MOPS", f"https://mops.twse.com.tw/mops/web/ann?id={ctr[0]:07d}"
        else:
            src = media or str(rng.choice(_MEDIA))
            url = f"https://news.google.com/rss/articles/CBMi{ctr[0]:08x}"
        nid = make_news_id(src, url, title)
        fs = ts + pd.Timedelta(minutes=float(rng.uniform(0, 30)))
        news.append(dict(news_id=nid, published_at=ts, first_seen_at=fs, source=src, title=title, body=body,
                         url=url, source_tier=tier))
        truth.append(dict(news_id=nid, kind=kind, ticker=ticker, event_type_id=type_id))
        return nid

    def mention(j, force_code=False):
        f = rng.integers(0, 4) if not force_code else 0
        return [f"{names[j]}({codes[j]})", pairs[j], names[j], f"{pairs[j]}({codes[j]})"][f]

    for ev in sched:
        j, sp = ev["j"], EVENT_SPECS[ev["spec"]]
        tid = sp["type_id"]
        x = int(rng.integers(3, 80)); px = int(rng.integers(20, 400)); cu = str(rng.choice(_CUST))
        title = str(rng.choice(TITLES[tid])).format(m=mention(j), c=cu, x=x, p=px)
        body = BODIES[tid].format(n=names[j], c=cu, x=x, p=px)
        tier = 1 if (tid in (3, 4, 6, 9, 16, 17) and rng.random() < 0.7) else 2
        nid = add(ev["ts"], tier, title, body, "event", codes[j], tid)
        ev_truth.append(dict(news_id=nid, ticker=codes[j], event_type_id=tid, event_type=EVENT_TYPES[tid],
                             published_at=ev["ts"], event_date=ev["t0"], entry_date=ev["entry"],
                             sentiment=sp["sentiment"], planted_car=sp["car"], planted_days=sp["days"],
                             is_confounder=ev["confounder"]))
        if rng.random() < 0.3:     # 轉載：24 小時內近似標題
            for _ in range(int(rng.integers(1, 3))):
                add(ev["ts"] + pd.Timedelta(minutes=float(rng.uniform(10, 600))), 2,
                    title + str(rng.choice(["－即時", "－快訊", "－財經"])), body, "duplicate", codes[j], tid)
    for _ in range(int(n * years * 0.5)):          # 傳聞 + 澄清稿（無效果）
        j, k = rng.choice(n, 2, replace=False)
        d = days[int(rng.integers(WARMUP, nd - 5))]
        ts = (d + pd.Timedelta(hours=float(rng.uniform(8, 17)))).tz_localize(TZ)
        add(ts, 2, f"傳{mention(j)}搶下{mention(k)}供應鏈訂單", f"市場傳出{names[j]}取得{names[k]}訂單，公司尚未證實。", "rumor", codes[j], 12)
        add(ts + pd.Timedelta(hours=20), 1, f"{names[j]}澄清：未取得{names[k]}訂單 媒體報導不實",
            f"{names[j]}發布重大訊息澄清，並無取得相關訂單，媒體報導與事實不符。", "clarification", codes[j], None)
    for _ in range(int(n * years * 1.5)):          # 否定句 / 無關雜訊
        j = int(rng.integers(n)); d = days[int(rng.integers(WARMUP, nd - 5))]
        ts = (d + pd.Timedelta(hours=float(rng.uniform(8, 18)))).tz_localize(TZ)
        if rng.random() < 0.4:
            add(ts, 2, str(rng.choice(NEG_T)).format(m=mention(j)), f"{names[j]}表示相關傳聞與公司規劃不符。", "negation", codes[j], None)
        else:
            add(ts, 2, str(rng.choice(NOISE_T)).format(m=mention(j)), f"{names[j]}近期活動報導。", "noise", codes[j], None)
    for d in days[WARMUP::5]:                       # 盤勢文：提及 >5 檔
        ks = rng.choice(n, int(rng.integers(6, 9)), replace=False)
        ts = (d + pd.Timedelta(hours=float(rng.uniform(13.6, 17)))).tz_localize(TZ)
        add(ts, 2, "台股盤後 " + "、".join(mention(int(k)) for k in ks) + " 等個股漲跌互見",
            "大盤收盤，法人買賣超互見，處置股與重大訂單題材輪動。", "market_wrap", None, None)
    news_df = pd.DataFrame(news).sort_values("published_at").reset_index(drop=True)

    out = dict(news_raw=news_df, prices_daily=prices, benchmark_daily=bench, company_master=master,
               relations=relations, derivatives_daily=deriv)
    out = {k: coerce(k, v.assign(is_synthetic=True)) for k, v in out.items()}
    out["events_truth"] = pd.DataFrame(ev_truth).assign(is_synthetic=True)
    out["effects_truth"] = pd.DataFrame(eff_rows).assign(is_synthetic=True)
    out["news_truth"] = pd.DataFrame(truth).assign(is_synthetic=True)
    return out


def _ar1(rng, n, rho):
    x = np.zeros(n)
    e = rng.normal(0, np.sqrt(1 - rho ** 2), n)
    for t in range(1, n):
        x[t] = rho * x[t - 1] + e[t]
    return x


def _pub_time(rng, days, s, cal):
    """依目標 T0 交易日索引 s 產生發佈時間（盤前/盤中/盤後/非交易日）。"""
    u = rng.random()
    d = days[s]
    if u < 0.25:
        mins = rng.uniform(450, 530)
    elif u < 0.60:
        mins = rng.uniform(545, 800)
    else:
        prev = days[s - 1]
        gap = [x for x in pd.date_range(prev + pd.Timedelta(days=1), d - pd.Timedelta(days=1))]
        if u >= 0.95 and gap:
            d, mins = gap[-1], rng.uniform(480, 1000)
        else:
            d, mins = prev, rng.uniform(815, 1200)
    return (d + pd.Timedelta(minutes=float(mins))).tz_localize(TZ)


def write_synthetic(out_dir, seed=42, n_tickers=60, years=7):
    from .loader import write_table
    from pathlib import Path
    syn = make_synthetic(seed, n_tickers, years)
    for k, df in syn.items():
        write_table(df, Path(out_dir) / k)
    return syn
