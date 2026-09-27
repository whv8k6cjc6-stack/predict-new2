/** 奇門遁甲規則庫（第三層）：依主題取用神，看白天各時辰用神落宮之門星神、格局、空亡與對年命之生剋。 */
import type { DomainKey } from "@/core/domains";
import type { RuleDefinition } from "@/core/sources";
import { YONGSHEN, type EventKind } from "@/core/qimen";

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
        actions: [`把${Y.label}相關的重要事項排在{最佳}`],
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
        actions: [`${Y.label}相關的重要事項避開{避開}`, `非做不可時，選相對最好的{最佳}`],
      },
      slots, terms: ["用神", "年命", "空亡"], priority: 60,
    }),
  ];
});
