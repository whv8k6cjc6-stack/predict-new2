import sys
from pathlib import Path

import pandas as pd
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from src import calendar as cal  # noqa: E402
from src.classifier import Rules, classify, monthly_revenue_sentiment, rules_version  # noqa: E402
from src.consolidate import consolidate, jaccard  # noqa: E402
from src.schemas import EVENT_TYPES, make_news_id  # noqa: E402
from src.synthetic import EVENT_SPECS, make_synthetic  # noqa: E402

TZ = "Asia/Taipei"
SENT_BY_TYPE = {sp["type_id"]: sp["sentiment"] for sp in EVENT_SPECS.values()}


@pytest.fixture(scope="module")
def syn():
    return make_synthetic(seed=42, n_tickers=60, years=7)


@pytest.fixture(scope="module")
def ev_raw(syn):
    return classify(syn["news_raw"], syn["company_master"])


@pytest.fixture(scope="module")
def primary(syn, ev_raw):
    """每則新聞的主列（類別 rank1、個股 rank1）接上真值。"""
    p = ev_raw[(ev_raw.cat_rank == 1) & (ev_raw.link_rank == 1)].drop_duplicates("news_id").set_index("news_id")
    p = p[["ticker", "event_type", "sentiment", "is_clarification", "rule_id"]].add_suffix("_p")
    return syn["news_truth"].set_index("news_id").join(p)


# ---------------------------------------------------------------- 合成資料準確率
def test_category_accuracy(primary):
    e = primary[primary.kind.isin(["event", "duplicate", "rumor"])]
    acc = (e.event_type_p == e.event_type_id).mean()
    print("類別準確率", acc, len(e))
    assert acc >= 0.85
    for k, g in e.groupby("kind"):
        assert (g.event_type_p == g.event_type_id).mean() >= 0.85, k


def test_direction_accuracy(primary):
    d = primary[primary.kind.isin(["event", "duplicate"])].copy()
    d["truth"] = d.event_type_id.map(SENT_BY_TYPE)
    acc = (d.sentiment_p == d.truth).mean()
    print("方向準確率", acc, len(d))
    assert acc >= 0.85
    for t, g in d.groupby("event_type_id"):
        assert (g.sentiment_p == g.truth).mean() >= 0.8, t


def test_ticker_link_accuracy(primary):
    # 排除 noise（真值有 ticker 但本就不該出事件）；已下市/未上市日期的提及依 as-of 規則可能不連結
    l = primary[primary.kind.isin(["event", "duplicate", "rumor", "clarification", "negation"])]
    acc = (l.ticker == l.ticker_p).mean()
    print("個股連結準確率", acc, len(l))
    assert acc >= 0.97
    evt = primary[primary.kind.isin(["event", "duplicate"])]
    assert (evt.ticker == evt.ticker_p).mean() >= 0.99


def test_market_wrap_and_noise_dropped(primary):
    assert primary[primary.kind == "market_wrap"].ticker_p.notna().mean() <= 0.02     # >5 檔丟棄
    assert primary[primary.kind == "noise"].ticker_p.notna().mean() <= 0.02            # 無關雜訊不出事件


def test_clarification_flagged(primary):
    c = primary[primary.kind == "clarification"]
    assert c.is_clarification_p.mean() >= 0.95
    n = primary[(primary.kind == "negation") & primary.ticker_p.notna()]
    assert n.is_clarification_p.mean() >= 0.9
    real = primary[primary.kind.isin(["event", "duplicate"])]
    assert real.is_clarification_p.mean() <= 0.01


def test_every_row_has_rule_id_and_version(ev_raw):
    assert ev_raw.rule_id.notna().all() and (ev_raw.rule_id != "").all()
    assert ev_raw.attrs["rules_version"] == rules_version()
    assert set(ev_raw.event_type.unique()) <= set(EVENT_TYPES)


def test_rules_cover_20_types_and_version_hash(tmp_path):
    R = Rules()
    assert sorted(R.by_id) == list(range(1, 21))
    assert len({t["rule_id"] for t in R.types}) == 20
    v = rules_version()
    assert len(v) == 12 and v == rules_version()
    p = tmp_path / "rules.yaml"
    p.write_text(Path(R.path).read_text(encoding="utf-8").replace("買回@1,", "買回@1.5,"), encoding="utf-8")
    assert rules_version(p) != v


# ---------------------------------------------------------------- 手寫中文語感
MASTER = pd.DataFrame(dict(
    ticker=["2330", "2317", "2303", "2603", "2344", "3008", "2353", "2368"],
    valid_from=pd.Timestamp("2000-01-01"),
    name=["台灣積體電路", "鴻海精密", "聯華電子", "長榮海運", "華邦電子", "大立光電", "宏碁", "金像電"],
    aliases=["台積電|TSMC", "鴻海|Foxconn", "聯電", "長榮", "華邦電", "大立光", "宏碁", "金像電"],
    market="TWSE", industry_code="24", list_date=pd.Timestamp("2000-01-01"), delist_date=pd.NaT,
    has_stock_futures=True, marginable=True, valid_to=pd.NaT))


def mk(items):
    rows = []
    for i, it in enumerate(items):
        title, body = (it, "") if isinstance(it, str) else it
        rows.append(dict(news_id=make_news_id("t", str(i), title), published_at=pd.Timestamp("2024-05-06 10:00", tz=TZ),
                         first_seen_at=pd.Timestamp("2024-05-06 10:30", tz=TZ), source="t", title=title, body=body,
                         url=str(i), source_tier=1))
    return pd.DataFrame(rows)


def run(title, body=""):
    out = classify(mk([(title, body)]), MASTER)
    return out[(out.cat_rank == 1)].reset_index(drop=True)


@pytest.mark.parametrize("title,tid,sent", [
    ("鴻海公告取得美國大廠逾50億元重大訂單", 3, 1),
    ("【重大訊息】鴻海(2317)簽下歐洲車廠長約 接單能見度提升", 3, 1),
    ("鴻海未取得蘋果新機訂單", 3, -1),                         # 否定詞反轉（非澄清稿）
    ("鴻海遭砍單 客戶取消訂單", 3, -1),
    ("長榮列入處置股票 自明日起分盤交易", 9, -1),
    ("長榮(2603)股票列為注意交易資訊 公布注意股票", 9, -1),
    ("華邦電董事會決議買回庫藏股 護盤", 6, 1),
    ("宏碁董事會通過減資彌補虧損", 5, -1),
    ("宏碁辦理現金減資 退還股款每股2元", 5, 1),
    ("聯電董事會通過辦理私募普通股", 4, -1),
    ("聯電擬發行可轉換公司債 籌資50億元", 4, -1),
    ("大立光董事長申報轉讓持股 持股比率降至5%", 8, -1),
    ("大立光董監增持 大股東買進持股", 8, 1),
    ("鴻海遭公平會裁罰 罰款5000萬元", 10, -1),
    ("華邦電專利訴訟勝訴 獲賠逾10億元", 10, 1),
    ("鴻海未來三年擴產 新廠動工", 16, 1),
    ("華邦電宣布減產 縮減產能", 16, -1),
    ("長榮廠區因地震停工 受損情況評估中", 13, -1),
    ("地震後華邦電廠區未受損 已恢復生產", 13, 1),
    ("宏碁財務長請辭 董事會通過新任人選", 17, 0),
    ("會計師對宏碁出具無法表示意見", 18, -1),
    ("宏碁財報重編 簽證會計師更換", 18, -1),
    ("外資調升聯電目標價至80元 給予買進評等", 19, 1),
    ("大摩調降鴻海目標價 降評為中立", 19, -1),
    ("聯電納入MSCI成分股 指數調整生效", 20, 1),
    ("宏碁遭剔除富時指數成分股", 20, -1),
    ("金像電調漲產品報價 漲價效應顯現", 15, 1),
    ("華邦電DRAM現貨價下跌 價格下滑", 15, -1),
    ("金像電董事會通過配息 現金股利調高至5元", 7, 1),
    ("宏碁宣布不配息 股利政策保守", 7, -1),
    ("傳鴻海搶下蘋果供應鏈訂單 業界消息指出", 12, 1),
    ("台積電法說會 第二季獲利創高 EPS優於預期", 1, 1),
    ("台積電第三季虧損擴大 獲利低於預期", 1, -1),
])
def test_handwritten_category_direction(title, tid, sent):
    r = run(title)
    assert len(r) >= 1, title
    assert r.loc[0, "event_type"] == tid, (title, r.loc[0, "event_type"])
    assert r.loc[0, "sentiment"] == sent, (title, r.loc[0, "sentiment"], r.loc[0, "score"])
    assert r.loc[0, "rule_id"]


@pytest.mark.parametrize("title", [
    "鴻海澄清：未取得蘋果訂單 媒體報導不實",
    "聯電否認將辦理現金增資",
    "長榮無處置之虞 公司表示股價波動屬正常",
    "華邦電闢謠 並無減資計畫",
    "宏碁回應媒體報導 尚無併購計畫",
])
def test_clarification_flag(title):
    r = run(title)
    assert len(r) >= 1 and r.is_clarification.all(), title


def test_non_clarification_not_flagged():
    for t in ["鴻海公告取得重大訂單", "長榮列入處置股票", "聯電董事會通過減資"]:
        assert not run(t).is_clarification.any()


def test_negation_window_and_future_word():
    R = Rules()
    t = R.by_id[3]
    assert R.direction(t, "鴻海未來取得訂單", "")[1] == 1                 # 「未來」不是否定
    assert R.direction(t, "鴻海並未取得訂單", "")[1] == -1
    assert R.direction(t, "鴻海取得訂單，但客戶並未下單", "")[1] == 1     # 否定詞被標點隔開，不影響前句
    assert R.direction(t, "鴻海的法人推測股價可望走高並且不論如何都取得訂單", "")[1] == 1    # 「不論」不是否定


def test_title_weight_over_body():
    R = Rules()
    t = R.by_id[3]
    assert R.direction(t, "鴻海取得訂單", "")[0] > R.direction(t, "鴻海訂單", "取得")[0]


def test_monthly_revenue_numeric():
    f = monthly_revenue_sentiment
    assert f("金像電4月營收年增35.2%，月增28.1%")[1] == 1
    assert f("金像電4月營收年增35.2%，月減12%")[1] == 0
    assert f("金像電4月營收年減25.1%，月減30%")[1] == -1
    assert f("金像電4月營收年增19.9%、月增25%")[1] == 0               # 邊界：未達 20
    assert f("金像電4月營收年增20%、月增20%")[1] == 1
    assert f("4月營收年增60%")[1] == 0                                # 缺 MoM -> 保守 0
    assert f("營收創新高") is None
    r = run("金像電4月營收創同期新高 年增35.2%、月增28.1%")
    assert r.loc[0, "event_type"] == 2 and r.loc[0, "sentiment"] == 1 and r.loc[0, "rule_id"] == "R02_revenue"
    r = run("金像電4月營收年增40%、月減8% 創同期新高")
    assert r.loc[0, "sentiment"] == 0


def test_mna_roles():
    out = classify(mk(["鴻海公開收購宏碁"]), MASTER).sort_values("link_rank")
    out = out[out.event_type == 11]
    assert dict(zip(out.ticker, out.sentiment)) == {"2317": 0, "2353": 1}
    out = classify(mk(["宏碁將被鴻海收購"]), MASTER)
    out = out[out.event_type == 11]
    assert dict(zip(out.ticker, out.sentiment)) == {"2353": 1, "2317": 0}


def test_ticker_linking_rules():
    # 別名、英文別名、四碼代號；數字金額/點數不誤判
    assert run("TSMC董事會通過買回庫藏股").ticker[0] == "2330"
    assert run("2317 董事會決議買回庫藏股").ticker[0] == "2317"
    assert run("買回庫藏股公告(2303)").ticker[0] == "2303"
    assert classify(mk(["董事會決議買回庫藏股 買回金額2330萬元，加權指數收2317點"]), MASTER).empty
    assert run("聯電宣布擴產", "聯電與鴻海合作，另外宏碁也跟進").ticker.tolist() == ["2303"]   # 標題有個股時以標題為準


def test_market_wrap_discard_and_market_policy():
    wrap = "台股盤後 台積電、鴻海、聯電、長榮、華邦電、大立光 等個股漲跌互見 處置股增加"
    assert classify(mk([wrap]), MASTER).empty
    r = run("美國宣布對半導體加徵關稅 出口管制擴大")
    assert r.loc[0, "ticker"] == "MARKET" and r.loc[0, "event_type"] == 14 and r.loc[0, "sentiment"] == -1


def test_asset_disposal_not_disposition():
    r = run("鴻海處置不動產 認列處分利益")
    assert r.empty or r.loc[0, "event_type"] != 9


def test_as_of_master():
    m = MASTER.copy()
    m.loc[m.ticker == "2603", "delist_date"] = pd.Timestamp("2020-01-01")
    assert classify(mk(["長榮列入處置股票"]), m).empty          # 下市超過 30 天不再連結


# ---------------------------------------------------------------- consolidate
def raw_row(nid, tk, tid, sent, ts, title="t", score=2.0, clar=False, tier=1):
    return dict(news_id=nid, ticker=tk, event_type=tid, sentiment=sent, score=score, rule_id=f"R{tid:02d}",
                published_at=pd.Timestamp(ts, tz=TZ), first_seen_at=pd.NaT, source_tier=tier, title=title,
                is_clarification=clar, cat_rank=1, link_rank=1, is_synthetic=False)


def cons(rows):
    return consolidate(pd.DataFrame(rows), cal.get_calendar())


def test_consolidate_t0_entry_rules():
    e = cons([raw_row("a", "2330", 3, 1, "2024-03-05 08:30"),
              raw_row("b", "2317", 3, 1, "2024-03-05 10:00"),
              raw_row("c", "2303", 3, 1, "2024-03-05 14:00"),
              raw_row("d", "2603", 3, 1, "2024-03-02 11:00")]).set_index("ticker")     # 週六
    d = lambda s: pd.Timestamp(s)                                                       # noqa: E731
    assert (e.loc["2330", "event_date"], e.loc["2330", "entry_date"]) == (d("2024-03-05"), d("2024-03-05"))
    assert (e.loc["2317", "event_date"], e.loc["2317", "entry_date"]) == (d("2024-03-05"), d("2024-03-06"))
    assert (e.loc["2303", "event_date"], e.loc["2303", "entry_date"]) == (d("2024-03-06"), d("2024-03-06"))
    assert (e.loc["2603", "event_date"], e.loc["2603", "entry_date"]) == (d("2024-03-04"), d("2024-03-04"))


def test_consolidate_dedup_and_merge():
    t = "鴻海公告取得美國大廠逾50億元重大訂單"
    assert jaccard(t, t + "－即時") >= 0.8
    e = cons([raw_row("a", "2317", 3, 1, "2024-03-05 10:00", t),
              raw_row("b", "2317", 3, 1, "2024-03-05 15:00", t + "－即時"),          # 去重
              raw_row("c", "2317", 3, 1, "2024-03-07 10:00", "鴻海再接大單 訂單破百億"),   # 3 交易日內同向 -> 併
              raw_row("d", "2317", 3, 1, "2024-03-20 10:00", "鴻海另一則大單"),          # 太遠 -> 另一事件
              raw_row("e", "2317", 3, -1, "2024-03-06 10:00", "鴻海訂單遭取消")])        # 反向不併
    assert len(e[(e.event_type == 3) & (e.sentiment == 1)]) == 2
    first = e[(e.sentiment == 1)].sort_values("published_at").iloc[0]
    assert first.n_articles == 3 and first.event_date == pd.Timestamp("2024-03-05")    # T0 取最早
    assert e.news_ids.str.contains("a").any()


def test_consolidate_priority_mixed_confounded():
    e = cons([raw_row("a", "2317", 18, -1, "2024-03-05 10:00", score=-3),
              raw_row("b", "2317", 3, 1, "2024-03-05 10:30", score=4),
              raw_row("c", "2317", 19, 1, "2024-03-05 11:00", score=2),
              raw_row("x", "2330", 1, 1, "2024-03-05 10:00"),
              raw_row("y", "2330", 3, 1, "2024-03-05 10:10"),               # 同向：優先序 1 > 3，不是 mixed
              raw_row("z", "2303", 6, 1, "2024-03-05 10:00"),
              raw_row("w", "2303", 9, -1, "2024-03-11 10:00"),             # 4 交易日後：不干擾
              raw_row("v", "2603", 6, 1, "2024-03-05 10:00"),
              raw_row("u", "2603", 16, 1, "2024-03-07 10:00")])             # 2 交易日後：干擾
    e = e.set_index(["ticker", "event_type"])
    assert (("2317", 18) in e.index) and ("2317", 3) not in e.index and ("2317", 19) not in e.index
    assert e.loc[("2317", 18), "is_mixed"] and e.loc[("2317", 18), "is_confounded"]
    assert ("2330", 1) in e.index and ("2330", 3) not in e.index and not e.loc[("2330", 1), "is_mixed"]
    assert not e.loc[("2303", 6), "is_confounded"] and not e.loc[("2303", 9), "is_confounded"]
    assert e.loc[("2603", 6), "is_confounded"] and e.loc[("2603", 16), "is_confounded"]


def test_consolidate_clarification_excluded_and_schema():
    e = cons([raw_row("a", "2317", 3, 1, "2024-03-05 10:00"),
              raw_row("b", "2317", 3, -1, "2024-03-06 10:00", clar=True)])
    assert len(e) == 1 and len(e.attrs["clarifications"]) == 1
    for c in ["event_id", "ticker", "event_type", "sentiment", "score", "rule_id", "published_at", "event_date",
              "entry_date", "n_articles", "news_ids", "is_mixed", "is_confounded"]:
        assert c in e.columns
    assert e.event_id.is_unique
    assert consolidate(pd.DataFrame(columns=list(raw_row("a", "1", 1, 1, "2024-01-02 10:00"))).astype(
        {"is_clarification": bool})).empty


def test_pipeline_recovers_synthetic_events(syn, ev_raw):
    e = consolidate(ev_raw, cal.get_calendar())
    t = syn["events_truth"]
    t = t[~t.is_confounder]
    k = t.merge(e, left_on=["ticker", "event_type_id", "event_date"], right_on=["ticker", "event_type", "event_date"],
                how="left", suffixes=("", "_e"))
    recall = k.event_id.notna().mean()
    print("事件還原率", recall)
    assert recall >= 0.95          # 缺的主要是 3 交易日內同股同類被規格合併者
    assert (k.dropna(subset=["event_id"]).entry_date == k.dropna(subset=["event_id"]).entry_date_e).all()
    assert e.event_id.is_unique and not e.attrs["clarifications"].empty
    assert e.is_synthetic.all()
