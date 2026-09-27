/** 易經規則庫（第三層）：
 *   ① 體用生剋（梅花易數；《梅花易數》原文未匯入，僅列原則）
 *   ② 動爻爻辭斷辭（原文由《周易》匯入；以《繫辭》「吉凶者，言乎其失得也」為判讀依據）
 *   ③ 爻位（《繫辭下》「二多譽，四多懼……三多凶，五多功」） */
import type { DomainKey } from "@/core/domains";
import type { RuleDefinition } from "@/core/sources";
import { XICI } from "@/kb/sources";

export const ICHING_RULE_VERSION = "3.0.0";
const ALL: DomainKey[] = ["overall", "career", "wealth", "investment", "social", "love", "travel", "health", "decision"];

const base = (id: string, p: Partial<RuleDefinition> & Pick<RuleDefinition, "condition" | "effects" | "templates" | "based_on" | "applies_when">): RuleDefinition => ({
  id, system: "iching", school: "周易・梅花易數體用", rule_version: ICHING_RULE_VERSION, timescale: "day",
  terms: ["體用", "動爻"], verification: "unverified", enabled: true,
  slots: {
    本卦: "iching.day.main",變卦: "iching.day.changed", 互卦: "iching.day.mutual", 動爻: "iching.day.moving",
    爻辭: "iching.day.yaoText", 卦辭: "iching.day.guaText", 體: "iching.day.ti", 用: "iching.day.yong",
    體用: "iching.day.relation", 結果: "iching.day.outcome", 過程: "iching.day.mutualRel", 斷辭: "iching.day.verdict",
  },
  ...p,
});
const spread = (main: DomainKey[], pol: -1 | 0 | 1, s: 1 | 2 | 3) =>
  ALL.map(d => ({ domain: d, polarity: pol, strength: (main.includes(d) ? s : 1) as 1 | 2 | 3 }));

const TIYONG_PRINCIPLE = "梅花易數體用：動爻所在經卦為用、另一經卦為體；用生體、體用比和為吉，體克用可成，體生用多耗，用克體不利（《梅花易數》原文未匯入，此為通行論法）";

const TY: { rel: string; pol: -1 | 0 | 1; s: 1 | 2 | 3; head: string; plain: string; action: string }[] = [
  { rel: "用生體", pol: 1, s: 2, head: "外在條件主動來幫你", plain: "代表外在環境的用卦{用}生扶代表你的體卦{體}，事情容易得到助力，順勢而為就好。", action: "今天適合開口請求協助或推進需要別人配合的事（{本卦}，{體用}）" },
  { rel: "比和", pol: 1, s: 1, head: "你和環境同步", plain: "體卦{體}與用卦{用}五行相同，雙方步調一致，合作與溝通順暢。", action: "適合團隊協作、對齊方向（{本卦}，體用比和）" },
  { rel: "體克用", pol: 1, s: 1, head: "你能掌控局面，但要自己出力", plain: "體卦{體}剋用卦{用}，你是主導的一方，事情可以辦成，只是要親自投入。", action: "主動安排、親自執行，不要等別人（{本卦}，{體用}）" },
  { rel: "體生用", pol: -1, s: 1, head: "付出多、回收慢", plain: "體卦{體}去生用卦{用}，像是你在餵養外在的事，容易勞心或花錢。", action: "今天的投入先設上限，時間與金錢都量力（{本卦}，{體用}）" },
  { rel: "用克體", pol: -1, s: 2, head: "外在形勢壓著你", plain: "用卦{用}剋體卦{體}，外在阻力較大，硬推容易碰壁。", action: "重要決定延後或先備妥退路（{本卦}，{體用}）" },
];

export const ICHING_RULES: RuleDefinition[] = [
  ...TY.map(t => base(`iching.tiyong.${t.rel}`, {
    based_on: { text_ids: [], commentary_ids: [], principle: TIYONG_PRINCIPLE },
    applies_when: `今日卦體用關係為「${t.rel}」`,
    condition: { fact: "iching.day.relation", op: "eq", value: t.rel },
    effects: spread(["overall", "decision"], t.pol, t.s),
    templates: {
      conclusion: `今日卦{本卦}：${t.head}（{體用}）。`,
      plain: t.plain,
      pro: `本卦{本卦}，{動爻}動；體{體}、用{用}，{體用}；互卦{互卦}（{過程}）；變卦{變卦}。`,
      legacyAdviceText: [t.action],
    },
    priority: 55,
  })),
  base("iching.outcome.good", {
    based_on: { text_ids: [], commentary_ids: [], principle: "梅花易數：本卦看開始、互卦看過程、變卦看結果；變卦之用生體或比和，結果轉好" },
    applies_when: "變卦中的用卦生體或與體比和",
    condition: { fact: "iching.day.outcome", op: "in", value: ["用生體", "比和"] },
    effects: [{ domain: "overall", polarity: 1, strength: 1 }, { domain: "decision", polarity: 1, strength: 1 }],
    templates: {
      conclusion: "結尾比開頭好：變卦{變卦}對你是{結果}。",
      plain: "看一件事的走向，易經會看「變卦」代表的結果。今天變卦{變卦}對代表你的{體}是{結果}，前面辛苦一點，後段會順。",
      pro: "變卦{變卦}，變後之用對體{結果}。",
      legacyAdviceText: ["事情做到一半遇阻，別急著放棄，後段會轉順（變卦{變卦}）"],
    },
    priority: 40,
  }),
  base("iching.outcome.bad", {
    based_on: { text_ids: [], commentary_ids: [], principle: "梅花易數：變卦看結果；變卦之用克體，後段轉弱" },
    applies_when: "變卦中的用卦剋體",
    condition: { fact: "iching.day.outcome", op: "eq", value: "用克體" },
    effects: [{ domain: "overall", polarity: -1, strength: 1 }, { domain: "decision", polarity: -1, strength: 1 }],
    templates: {
      conclusion: "開頭容易、收尾要小心：變卦{變卦}對你是{結果}。",
      plain: "變卦{變卦}代表事情的後段，它剋代表你的{體}，意思是起步可能順，但越到後面越吃力。",
      pro: "變卦{變卦}，變後之用對體{結果}。",
      legacyAdviceText: ["把關鍵確認放在前段完成，別把收尾拖到晚上（變卦{變卦}）"],
    },
    priority: 40,
  }),
  // ② 動爻爻辭斷辭
  ...([
    { v: "大吉", pol: 1, s: 3, head: "爻辭給出大吉", plain: "今天的動爻是{動爻}，爻辭寫「{爻辭}」，是明確的大吉斷語。", act: "照原計畫推進今天最重要的一件事（{動爻}）" },
    { v: "吉", pol: 1, s: 2, head: "爻辭給出吉的斷語", plain: "今天的動爻是{動爻}，爻辭寫「{爻辭}」，斷語偏吉，但要看爻辭中的條件（例如「貞」是守正、「往」是前進）。", act: "依爻辭條件行事：{爻辭}" },
    { v: "吉凶並見", pol: 0, s: 1, head: "同一句爻辭裡吉凶都有，看做法", plain: "今天的動爻{動爻}爻辭是「{爻辭}」，同時出現吉與凶，代表結果取決於你怎麼做；事情可以做，但方法與時機要選對。", act: "照爻辭中「吉」的那個做法走，避開「凶」的那個：{爻辭}" },
    { v: "無咎", pol: 0, s: 1, head: "無咎：有小失誤但補得回來", plain: "今天的動爻{動爻}爻辭是「{爻辭}」。《繫辭》說「无咎者，善補過也」，意思是會有小差錯，但及時修正就沒事。", act: "今天做完的事當天自己再檢查一次（{動爻}）" },
    { v: "厲吝", pol: -1, s: 1, head: "爻辭帶「厲」或「吝」，需要謹慎", plain: "今天的動爻{動爻}爻辭是「{爻辭}」。「厲」是危險、「吝」是難堪小遺憾，《繫辭》說「悔吝者，言乎其小疵也」，屬小問題但別輕忽。", act: "放慢速度，避免在不熟悉的領域冒進（{動爻}）" },
    { v: "無攸利", pol: -1, s: 2, head: "爻辭說「無攸利」：做了也沒好處", plain: "今天的動爻{動爻}爻辭是「{爻辭}」，「無攸利」是沒有什麼有利之處，今天主動出擊的效益低。", act: "今天以整理、準備為主，新行動延後（{動爻}）" },
    { v: "凶", pol: -1, s: 3, head: "爻辭出現「凶」", plain: "今天的動爻{動爻}爻辭是「{爻辭}」，是明確的凶的斷語，指向「照現在的做法會有所失」。", act: "今天不做不可逆的決定（簽約、大額支出、辭職等），先觀察（{動爻}）" },
  ] as const).map(x => base(`iching.verdict.${x.v}`, {
    based_on: { text_ids: [XICI.jixiongShide, XICI.jixiongDong], commentary_ids: [], principle: "一爻動，以本卦動爻爻辭為占辭（朱熹《易學啟蒙・考變占》之通行占法，原文未匯入）；斷辭依《繫辭》「吉凶者，言乎其失得也。悔吝者，言乎其小疵也。无咎者，善補過也」" },
    applies_when: `今日動爻爻辭斷辭為「${x.v}」`,
    condition: { fact: "iching.day.verdict", op: "eq", value: x.v },
    effects: spread(["overall", "decision"], x.pol, x.s),
    templates: {
      conclusion: `${x.head}：{動爻}「{爻辭}」。`,
      plain: x.plain,
      pro: `本卦{本卦}，動爻{動爻}，爻辭「{爻辭}」，斷辭：{斷辭}；卦辭「{卦辭}」。`,
      legacyAdviceText: [x.act],
    },
    dynamic_text_slots: ["iching.day.yaoTextId"],
    terms: ["動爻", "爻辭"],
    priority: 60,
  })),
  // ③ 爻位
  ...([
    { pos: 2, pol: 1, head: "二多譽", plain: "今天的動爻是{動爻}，在第二爻。《繫辭》說「二多譽」，第二爻居下卦之中，做事容易得到肯定。", doms: ["career", "social"] as DomainKey[], act: "今天適合交出成果、請主管或客戶看你的東西（{動爻}）" },
    { pos: 3, pol: -1, head: "三多凶", plain: "今天的動爻是{動爻}，在第三爻。《繫辭》說「三多凶」，第三爻在下卦頂端、將進入上卦，屬轉換處，容易出狀況。", doms: ["overall", "decision"] as DomainKey[], act: "流程銜接處多檢查一次，交接要留紀錄（{動爻}）" },
    { pos: 4, pol: -1, head: "四多懼", plain: "今天的動爻是{動爻}，在第四爻。《繫辭》說「四多懼」，第四爻靠近第五爻（君位），與上位者互動要格外謹慎。", doms: ["career"] as DomainKey[], act: "和主管、長輩說話先想清楚再開口（{動爻}）" },
    { pos: 5, pol: 1, head: "五多功", plain: "今天的動爻是{動爻}，在第五爻。《繫辭》說「五多功」，第五爻為尊位，容易有成果、主導權。", doms: ["career", "decision"] as DomainKey[], act: "今天適合由你拍板或主導（{動爻}）" },
  ]).map(x => base(`iching.linepos.${x.pos}`, {
    based_on: { text_ids: [XICI.yaoWei], commentary_ids: [], principle: "《繫辭下》：二與四同功而異位，二多譽，四多懼；三與五同功而異位，三多凶，五多功" },
    applies_when: `今日動爻在第 ${x.pos} 爻`,
    condition: { fact: "iching.day.linePos", op: "eq", value: x.pos },
    effects: x.doms.map(d => ({ domain: d, polarity: x.pol as -1 | 1, strength: 1 as const })),
    templates: {
      conclusion: `動爻位置「${x.head}」：{動爻}。`,
      plain: x.plain,
      pro: `{動爻}；《繫辭下》「二多譽，四多懼……三多凶，五多功」。`,
      legacyAdviceText: [x.act],
    },
    terms: ["動爻", "爻位"],
    priority: 30,
  })),
];
