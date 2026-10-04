/** 每日一句（DailyQuoteRegistry）：原句一律取自已匯入的《周易》通行本（src/kb/sources/zhouyi.generated.json，公有領域），
 *  以 textId 指回原文、逐字為原文的連續片段（測試檢查）；白話是本 App 自己寫的打氣話，不是翻譯，也不是預測。 */

export type QuoteMood = "push" | "steady" | "care" | "rest" | "people";

export interface DailyQuote { id: string; textId: string; excerpt: string; plain: string; moods: QuoteMood[] }

const Q = (id: string, textId: string, excerpt: string, plain: string, moods: QuoteMood[]): DailyQuote => ({ id, textId, excerpt, plain, moods });

export const DAILY_QUOTES: DailyQuote[] = [
  Q("qian", "zhouyi.gua.01.daxiang", "天行健，君子以自強不息。", "每天往前一小步，就是最穩的進度。", ["push"]),
  Q("meng", "zhouyi.gua.04.daxiang", "君子以果行育德。", "想清楚了就去做，做的過程會讓你更踏實。", ["push"]),
  Q("sheng", "zhouyi.gua.46.daxiang", "君子以順德，積小以高大。", "大事都是小事疊起來的，今天先把一小件做好。", ["push", "steady"]),
  Q("jin", "zhouyi.gua.35.daxiang", "君子以自昭明德。", "把你做得好的地方讓人看見，不必等別人發現。", ["push"]),
  Q("song", "zhouyi.gua.06.daxiang", "君子以作事謀始。", "開頭多想一步，後面就少走很多冤枉路。", ["steady", "care"]),
  Q("kun", "zhouyi.gua.02.daxiang", "地勢坤，君子以厚德載物。", "心放寬一點，能承接的事就多一點。", ["steady", "people"]),
  Q("tong", "zhouyi.xici.xia.11", "易窮則變，變則通，通則久。", "卡住的時候換個做法，路往往就通了。", ["steady", "care"]),
  Q("cangqi", "zhouyi.xici.xia.26", "君子藏器於身，待時而動", "先把自己準備好，機會晚一點來也不怕。", ["steady", "care"]),
  Q("daxu", "zhouyi.gua.26.daxiang", "君子以多識前言往行，以畜其德。", "多聽聽前人的經驗，能省下自己摸索的時間。", ["steady", "people"]),
  Q("pi", "zhouyi.gua.12.daxiang", "君子以儉德辟難", "收斂一點、簡單一點，麻煩就少一點。", ["care"]),
  Q("jian", "zhouyi.gua.39.daxiang", "君子以反身修德。", "遇到阻礙，先看自己能調整什麼，這往往是最快的出路。", ["care"]),
  Q("sun", "zhouyi.gua.41.daxiang", "君子以懲忿窒欲。", "情緒和衝動先放一放，好決定通常出現在冷靜之後。", ["care"]),
  Q("jie", "zhouyi.gua.60.tuan", "節以制度，不傷財，不害民。", "替自己定個界線，錢和力氣都不會白白流掉。", ["care"]),
  Q("yi27", "zhouyi.gua.27.daxiang", "君子以慎言語，節飲食。", "話少說一點、吃得清淡一點，身心都會輕鬆些。", ["rest", "care"]),
  Q("sui", "zhouyi.gua.17.daxiang", "君子以向晦入宴息。", "天黑了就好好休息，睡飽也是在往前走。", ["rest"]),
  Q("xian", "zhouyi.gua.31.daxiang", "山上有澤，咸，君子以虛受人。", "先把別人的話聽完，關係就順了一半。", ["people"]),
  Q("dui", "zhouyi.gua.58.daxiang", "君子以朋友講習。", "找個朋友聊聊，很多想不通的事會說著說著就通了。", ["people", "rest"]),
  Q("yi42", "zhouyi.gua.42.daxiang", "君子以見善則遷，有過則改。", "看到好的就學，做錯了就改，每天比昨天好一點就夠了。", ["people", "push"]),
];
