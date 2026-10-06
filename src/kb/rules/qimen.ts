/** 奇門遁甲規則庫（第三層）：依主題取用神，看白天各時辰用神落宮之門星神、格局、空亡與對年命之生剋。 */
import type { DomainKey } from "@/core/domains";
import type { RuleDefinition } from "@/core/sources";
import { YONGSHEN, type EventKind } from "@/core/qimen";
import { EVENT_TYPES } from "@/core/events";

export const QIMEN_RULE_VERSION = "3.0.0";
const DOMAIN_KINDS: DomainKey[] = ["overall", "career", "wealth", "investment", "social", "love", "travel", "health", "decision"];

const base = (id: string, p: Partial<RuleDefinition> & Pick<RuleDefinition, "condition" | "effects" | "templates" | "slots">): RuleDefinition => ({
  id, system: "qimen", school: "時家轉盤・拆補法", rule_version: QIMEN_RULE_VERSION, timescale: "day",
  based_on: { text_ids: [], commentary_ids: [], principle: "" }, applies_when: "", terms: [], verification: "unverified", enabled: true, ...p,
});

export const QIMEN_RULES: RuleDefinition[] = DOMAIN_KINDS.flatMap(k => {
  const Y = YONGSHEN[k as EventKind];
  const slots = { 用神: `qimen.${k}.yongshen`, 最佳: `qimen.${k}.best`, 避開: `qimen.${k}.avoid`, 盤面: `qimen.${k}.bestDetail`, 定局: "qimen.term", 平均: `qimen.${k}.avg`, 年命: "qimen.nianMing" };
  return [
    base(`qimen.${k}.good`, {
      based_on: { text_ids: [], commentary_ids: [], principle: `${Y.plain}；用神落吉門吉神、生扶年命則所謀易成` },
      applies_when: `白天多數時辰${Y.label}用神落吉位並生扶年命`,
      condition: { fact: `qimen.${k}.level`, op: "eq", value: "good" },
      effects: [{ domain: k, polarity: 1, strength: 2 }],
      templates: {
        conclusion: `奇門盤上，今天白天「${Y.label}」的用神{用神}多落在有利位置，最佳在{最佳}。`,
        plain: `奇門看的是「此刻做這件事的態勢」。代表${Y.label}的{用神}今天多半遇到吉門吉神，又能生扶代表你的年命{年命}，外在環境對你有利。`,
        pro: `{定局}。${Y.label}用神{用神}，白天六時辰平均 {平均}；{盤面}。`,
        legacyAdviceText: [`把${Y.label}相關的重要事項排在{最佳}`],
      },
      slots, terms: ["用神", "年命", "值符"], priority: 60,
    }),
    base(`qimen.${k}.bad`, {
      based_on: { text_ids: [], commentary_ids: [], principle: `${Y.plain}；用神落凶門凶神、逢空亡或剋年命則事多阻滯` },
      applies_when: `白天多數時辰${Y.label}用神落凶位或剋年命`,
      condition: { fact: `qimen.${k}.level`, op: "eq", value: "bad" },
      effects: [{ domain: k, polarity: -1, strength: 2 }],
      templates: {
        conclusion: `奇門盤上，今天白天「${Y.label}」的用神{用神}多落在不利位置，宜避開{避開}。`,
        plain: `代表${Y.label}的{用神}今天多半遇到凶門凶神、空亡，或與代表你的年命{年命}相剋，外在時機較差；事情可以做，但建議改時間。`,
        pro: `{定局}。${Y.label}用神{用神}，白天六時辰平均 {平均}；相對最佳：{盤面}。`,
        legacyAdviceText: [`${Y.label}相關的重要事項避開{避開}`, `非做不可時，選相對最好的{最佳}`],
      },
      slots, terms: ["用神", "年命", "空亡"], priority: 60,
    }),
  ];
});

/** 事件時辰的整盤格局與用神宮格局（只作「時段影響」與「做法」的提醒，不判定事情成敗） */
const PATTERNS: { key: string; when: string; principle: string; conclusion: string; plain: string; pro: string; terms: string[]; strength: 1 | 2; legacy: string }[] = [
  { key: "wubuyu", when: "為五不遇時", principle: "五不遇時：時干剋日干且陰陽相同，傳統擇時避開的時辰", conclusion: "逢五不遇時，是傳統擇時避開的時辰。",
    plain: "{時辰}的天干剋當天的天干，是傳統擇時避開的時辰；事情可以做，但重要的開始建議改時間。", pro: "五不遇時：{依據}。", terms: ["五不遇時"], strength: 2 , legacy: "重要的開始避開{時辰}" },
  { key: "fuyin", when: "逢伏吟", principle: "伏吟：值符或值使仍在本位，主遲滯，宜守不宜動", conclusion: "逢伏吟，事情進展慢。",
    plain: "{時辰}的盤面停在原位（伏吟），事情進展慢、容易拖延；適合守成與準備，急著推進效果有限。", pro: "伏吟：{依據}。", terms: ["伏吟"], strength: 1 , legacy: "{時辰}以守成與準備為主" },
  { key: "fanyin", when: "逢反吟", principle: "反吟：值符或值使落到對宮，主反覆、變卦", conclusion: "逢反吟，事情容易反覆、變卦。",
    plain: "{時辰}的盤面落到對面（反吟），事情容易反覆、變卦；談定的內容要寫清楚，並預留變更的空間。", pro: "反吟：{依據}。", terms: ["反吟"], strength: 1 , legacy: "{時辰}談定的內容寫成文字" },
  { key: "jixing", when: "用神或年命宮逢六儀擊刑", principle: "六儀擊刑：天盤六儀落入相刑之宮，主衝突、刑傷與受挫", conclusion: "用神或代表你的宮位逢六儀擊刑，事情容易起衝突或受挫。",
    plain: "代表{事件}或代表你的宮位逢「擊刑」，事情容易起衝突或受挫；溝通時先談事情本身，避免硬碰硬。", pro: "擊刑：{依據}。", terms: ["六儀擊刑", "用神", "年命"], strength: 2 , legacy: "{時辰}溝通先談事情本身，避免硬碰硬" },
  { key: "rumu", when: "用神或年命宮逢三奇入墓", principle: "三奇入墓：乙丙丁奇落入墓宮，奇氣受困", conclusion: "用神或代表你的宮位逢三奇入墓，事情容易卡住、施展不開。",
    plain: "代表{事件}或代表你的宮位逢「入墓」，事情容易卡住、施展不開；先把阻礙找出來，再決定要不要推進。", pro: "入墓：{依據}（三奇入墓宮位各家說法略有不同）。", terms: ["三奇入墓", "用神"], strength: 1 , legacy: "{時辰}先找出阻礙再推進" },
];

/** 事件模式（時辰層級）：指定時刻事件用神的吉凶 */
export const QIMEN_EVENT_RULES: RuleDefinition[] = EVENT_TYPES.flatMap(ev => {
  const Y = YONGSHEN[ev.qimen];
  const slots = { 事件: "qimen.event.label", 用神: "qimen.event.yongshen", 盤面: "qimen.event.detail", 時辰: "qimen.event.hour", 定局: "qimen.event.term", 分數: "qimen.event.score" };
  const cond = (lv: string) => ({ all: [{ fact: "qimen.event.kind", op: "eq" as const, value: ev.qimen }, { fact: "qimen.event.level", op: "eq" as const, value: lv }] });
  return [
    base(`qimen.event.${ev.key}.good`, {
      timescale: "hour",
      based_on: { text_ids: [], commentary_ids: [], principle: `${Y.plain}；事件時辰用神得吉門吉神、生扶年命則宜行` },
      applies_when: `${ev.label}所選時辰，用神落吉位`,
      condition: cond("good"),
      effects: [{ domain: ev.domain, polarity: 1, strength: 2 }],
      templates: {
        conclusion: `{時辰}做「{事件}」，奇門用神{用神}落在有利位置。`,
        plain: `奇門看「做這件事的當下」：{時辰}這個時段，代表{事件}的{用神}遇到吉門吉神，時機站在你這邊。`,
        pro: `{定局}；{盤面}；用神分數 {分數}。`,
        legacyAdviceText: [`維持在{時辰}進行{事件}`],
      },
      slots, terms: ["用神", "年命"], priority: 65,
    }),
    base(`qimen.event.${ev.key}.bad`, {
      timescale: "hour",
      based_on: { text_ids: [], commentary_ids: [], principle: `${Y.plain}；事件時辰用神落凶門凶神、空亡或剋年命則不宜` },
      applies_when: `${ev.label}所選時辰，用神落凶位`,
      condition: cond("bad"),
      effects: [{ domain: ev.domain, polarity: -1, strength: 2 }],
      templates: {
        conclusion: `{時辰}做「{事件}」，奇門用神{用神}落在不利位置，建議改時間。`,
        plain: `{時辰}這個時段，代表{事件}的{用神}遇到凶門凶神、空亡或剋你的年命；事情可以做，但建議改時間。`,
        pro: `{定局}；{盤面}；用神分數 {分數}。`,
        legacyAdviceText: [`把{事件}改到較佳時段，或先做準備、正式行動延後`],
      },
      slots, terms: ["用神", "年命", "空亡"], priority: 65,
    }),
    ...PATTERNS.map(pt => base(`qimen.event.${ev.key}.${pt.key}`, {
      timescale: "hour",
      based_on: { text_ids: [], commentary_ids: [], principle: pt.principle },
      applies_when: `${ev.label}所選時辰${pt.when}`,
      condition: { all: [{ fact: "qimen.event.kind", op: "eq" as const, value: ev.qimen }, { fact: `qimen.event.${pt.key}`, op: "eq" as const, value: true }] },
      effects: [{ domain: ev.domain, polarity: -1 as const, strength: pt.strength }],
      templates: {
        conclusion: `{時辰}做「{事件}」，奇門盤${pt.conclusion}`,
        plain: pt.plain,
        pro: `{定局}；${pt.pro}`,
        legacyAdviceText: [pt.legacy],
      },
      slots: { ...slots, 格局: `qimen.event.${pt.key}`, 依據: `qimen.event.${pt.key}Detail` }, terms: pt.terms, priority: 66,
    })),
  ];
});
