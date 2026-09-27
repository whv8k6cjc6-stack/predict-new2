/** Legacy 紫微計分規則（已停用，僅開發者模式比較用；userFacing=false、enabled=false）。
 *  停用原因（違反已確認之判讀原則）：
 *   - ziwei.*.hua.*：化祿權科固定加分、化忌固定扣分
 *   - ziwei.*.jichong.*：同一化忌以「沖對宮」再次扣分（同源重複計分）
 *   - ziwei.*.focus.*：流運命宮主星廟旺即加分、有煞即扣分
 *   - ziwei.natal.*：廟旺即加分、三方吉星／煞星只按數量加減
 *  新的紫微 Interpretation／Scoring Engine 完成前，紫微不參與正式分數。 */
import type { DomainKey } from "@/core/domains";
import type { RuleDefinition } from "@/core/sources";
import { PALACES, type PalaceName, type ZScope } from "@/core/ziwei";

export const ZIWEI_RULE_VERSION = "3.0.0";
const SCHOOL = "Legacy 紫微計分（已停用）";
type Eff = RuleDefinition["effects"];
const E = (m: Partial<Record<DomainKey, number>>): Eff =>
  Object.entries(m).filter(([, v]) => v).map(([d, v]) => ({ domain: d as DomainKey, polarity: (v! > 0 ? 1 : -1) as 1 | -1, strength: Math.min(3, Math.abs(v!)) as 1 | 2 | 3 }));

const PALACE_INFO: Record<PalaceName, { mean: string; dom: Partial<Record<DomainKey, number>> }> = {
  命宮: { mean: "你自己的狀態與決斷", dom: { overall: 1, decision: 1 } },
  兄弟: { mean: "手足與同輩合作", dom: { social: 1 } },
  夫妻: { mean: "伴侶與感情", dom: { love: 2 } },
  子女: { mean: "子女、晚輩與桃花", dom: { love: 1 } },
  財帛: { mean: "收入、支出與理財方式", dom: { wealth: 2, investment: 1 } },
  疾厄: { mean: "身體與健康", dom: { health: 2 } },
  遷移: { mean: "外出、旅行與外部機會", dom: { travel: 2, career: 1 } },
  交友: { mean: "朋友、同事與部屬", dom: { social: 2 } },
  官祿: { mean: "工作與事業", dom: { career: 2 } },
  田宅: { mean: "家庭、不動產與財庫", dom: { wealth: 1, love: 1 } },
  福德: { mean: "心態、享受與財的根源（投資心理）", dom: { investment: 2, health: 1 } },
  父母: { mean: "長輩、上級與文書", dom: { decision: 1, career: 1 } },
};
const HUA_INFO = {
  祿: { sign: 1, bonus: 0, plain: "順利、機會與收穫", effect: "較順利、容易有收穫", act: "主動把握與{宮義}相關的機會" },
  權: { sign: 1, bonus: 0, plain: "主導力與掌控度", effect: "你較能主導、掌握局面", act: "在{宮義}方面可以主導或拍板" },
  科: { sign: 1, bonus: -1, plain: "名聲、好評與貴人", effect: "容易得到肯定與協助", act: "{宮義}方面適合公開展示或請人協助" },
  忌: { sign: -1, bonus: 1, plain: "阻礙、執著與卡關", effect: "容易卡關、放不下或出狀況", act: "{宮義}方面多確認、少承諾，避免鑽牛角尖" },
} as const;
const SCOPE: Record<ZScope, { label: string; when: string; ts: RuleDefinition["timescale"] }> = {
  decade: { label: "目前大限", when: "這十年", ts: "decade" }, year: { label: "流年", when: "今年", ts: "year" },
  month: { label: "流月", when: "本月", ts: "month" }, day: { label: "流日", when: "今天", ts: "day" },
};

const base = (id: string, p: Partial<RuleDefinition> & Pick<RuleDefinition, "condition" | "effects" | "templates" | "slots" | "timescale">): RuleDefinition => ({
  id, system: "ziwei", school: SCHOOL, rule_version: ZIWEI_RULE_VERSION,
  based_on: { text_ids: [], commentary_ids: [], principle: "" }, applies_when: "", terms: [], verification: "unverified", enabled: true, ...p,
});

const huaRules: RuleDefinition[] = (Object.keys(SCOPE) as ZScope[]).flatMap(s => (Object.keys(HUA_INFO) as (keyof typeof HUA_INFO)[]).flatMap(h => PALACES.map(P => {
  const hi = HUA_INFO[h], pi = PALACE_INFO[P];
  const eff: Partial<Record<DomainKey, number>> = {};
  for (const [d, w] of Object.entries(pi.dom)) eff[d as DomainKey] = hi.sign * Math.max(1, Math.min(3, w! + hi.bonus));
  return base(`ziwei.${s}.hua.${h}.${P}`, {
    timescale: SCOPE[s].ts,
    based_on: { text_ids: [], commentary_ids: [], principle: `化${h}主${hi.plain}；${P}主${pi.mean}` },
    applies_when: `${SCOPE[s].label}天干之化${h}落入本命${P}`,
    condition: { fact: `ziwei.${s}.hua.${h}`, op: "eq", value: P },
    effects: E(eff),
    templates: {
      conclusion: `${SCOPE[s].label}{星}化${h}入你的${P}：${pi.mean}方面${hi.effect}。`,
      plain: `化${h}代表${hi.plain}。${SCOPE[s].when}的天干{干}讓{星}化${h}，這股力量進入你命盤的「${P}」，也就是${pi.mean}。`,
      pro: `${SCOPE[s].label}天干{干}，{星}化${h}，入本命${P}。`,
      legacyAdviceText: [hi.act.replace("{宮義}", pi.mean)],
    },
    slots: { 星: `ziwei.${s}.huaStar.${h}`, 干: `ziwei.${s}.stem` },
    terms: [`化${h}`, P === "交友" ? "三方四正" : P], priority: h === "忌" ? 70 : 60,
  });
})));

const JI_CHONG: PalaceName[] = ["命宮", "官祿", "財帛", "福德", "遷移", "夫妻", "疾厄", "田宅"];
const jiChongRules: RuleDefinition[] = (["decade", "year", "month", "day"] as ZScope[]).flatMap(s => JI_CHONG.map(P => {
  const pi = PALACE_INFO[P];
  const eff: Partial<Record<DomainKey, number>> = {};
  for (const [d, w] of Object.entries(pi.dom)) eff[d as DomainKey] = -Math.max(1, w! - 1);
  return base(`ziwei.${s}.jichong.${P}`, {
    timescale: SCOPE[s].ts,
    based_on: { text_ids: [], commentary_ids: [], principle: "化忌所在宮之對宮受沖，主該宮事項受擾動" },
    applies_when: `${SCOPE[s].label}化忌落在${P}的對宮，沖${P}`,
    condition: { fact: `ziwei.${s}.jiChong`, op: "eq", value: P },
    effects: E(eff),
    templates: {
      conclusion: `${SCOPE[s].label}{忌星}化忌沖你的${P}，${pi.mean}方面容易受外力擾動。`,
      plain: `化忌落在{忌宮}，正好對著你的${P}（${pi.mean}）。命理上稱為「忌沖」，代表這方面的事容易被外部因素打亂。`,
      pro: `${SCOPE[s].label}天干{干}，{忌星}化忌入{忌宮}，沖本命${P}。`,
      legacyAdviceText: [`${SCOPE[s].when}涉及${pi.mean}的安排多預留彈性`],
    },
    slots: { 忌星: `ziwei.${s}.huaStar.忌`, 忌宮: `ziwei.${s}.hua.忌`, 干: `ziwei.${s}.stem` },
    terms: ["化忌", "三方四正"], priority: 65,
  });
}));

const focusRules: RuleDefinition[] = (["year", "month", "day"] as ZScope[]).flatMap(s => PALACES.flatMap(P => {
  const pi = PALACE_INFO[P];
  const dom = Object.entries(pi.dom).sort((a, b) => b[1]! - a[1]!)[0][0] as DomainKey;
  return [
    base(`ziwei.${s}.focus.${P}.good`, {
      timescale: SCOPE[s].ts,
      based_on: { text_ids: [], commentary_ids: [], principle: "流運命宮所落之本命宮位為當期焦點；主星廟旺且無煞則該事順" },
      applies_when: `${SCOPE[s].label}命宮落本命${P}，主星廟旺且無煞星`,
      condition: { all: [{ fact: `ziwei.${s}.life`, op: "eq", value: P }, { fact: `ziwei.${s}.lifeStrong`, op: "eq", value: true }, { not: { fact: `ziwei.${s}.lifeSha`, op: "exists" } }] },
      effects: E({ [dom]: 1 }),
      templates: {
        conclusion: `${SCOPE[s].label}命宮落在你的${P}，焦點在${pi.mean}，宮內{主星}有力。`,
        plain: `紫微看流運時，會看「${SCOPE[s].when}的命宮」落在本命哪一宮。${SCOPE[s].when}落在${P}（${pi.mean}），宮內{主星}處於有力狀態，這方面較順。`,
        pro: `${SCOPE[s].label}命宮在本命${P}，主星{主星}，無煞星同宮。`,
        legacyAdviceText: [`${SCOPE[s].when}把心力放在${pi.mean}`],
      },
      slots: { 主星: `ziwei.natal.${P}.major` }, terms: ["命宮", "三方四正"], priority: 40,
    }),
    base(`ziwei.${s}.focus.${P}.sha`, {
      timescale: SCOPE[s].ts,
      based_on: { text_ids: [], commentary_ids: [], principle: "流運命宮所落之宮見煞星（擎羊陀羅火鈴空劫），該事多波折" },
      applies_when: `${SCOPE[s].label}命宮落本命${P}，宮內有煞星`,
      condition: { all: [{ fact: `ziwei.${s}.life`, op: "eq", value: P }, { fact: `ziwei.${s}.lifeSha`, op: "exists" }] },
      effects: E({ [dom]: -1 }),
      templates: {
        conclusion: `${SCOPE[s].label}命宮落在你的${P}，宮內有{煞星}，${pi.mean}方面容易有波折。`,
        plain: `${SCOPE[s].when}的焦點落在${P}（${pi.mean}），但這一宮有{煞星}等煞星，事情較容易卡住或出意外。`,
        pro: `${SCOPE[s].label}命宮在本命${P}，同宮煞星{煞星}。`,
        legacyAdviceText: [`${SCOPE[s].when}處理${pi.mean}時放慢、多一道確認`],
      },
      slots: { 煞星: `ziwei.${s}.lifeSha` }, terms: ["命宮"], priority: 45,
    }),
  ];
}));

// 本命三方四正（長期基調）
const NATAL_KEYS: { P: PalaceName; dom: DomainKey; what: string }[] = [
  { P: "命宮", dom: "career", what: "工作與整體格局（命宮三方四正即命、遷移、財帛、官祿）" },
  { P: "官祿", dom: "career", what: "事業" },
  { P: "財帛", dom: "wealth", what: "財務（財帛三方四正含福德）" },
  { P: "福德", dom: "investment", what: "投資心態與財的根源" },
  { P: "田宅", dom: "investment", what: "財庫與不動產" },
  { P: "夫妻", dom: "love", what: "感情" },
  { P: "疾厄", dom: "health", what: "健康" },
  { P: "遷移", dom: "travel", what: "外出與外部機會" },
  { P: "交友", dom: "social", what: "人際" },
];
const natalRules: RuleDefinition[] = NATAL_KEYS.flatMap(({ P, dom, what }) => [
  base(`ziwei.natal.${P}.lucky`, {
    timescale: "natal",
    based_on: { text_ids: [], commentary_ids: [], principle: "論一宮須合三方四正；會吉星（左右昌曲魁鉞祿存）多者其事易成" },
    applies_when: `本命${P}三方四正會吉星三顆以上`,
    condition: { fact: `ziwei.natal.${P}.sfLuckyN`, op: "gte", value: 3 },
    effects: E({ [dom]: 1 }),
    templates: {
      conclusion: `你的${P}三方四正會合{吉星}，${what}方面先天條件較好。`,
      plain: `紫微不只看單一宮，而是看它和相關的三個宮（三方四正）。你的${P}這一組會合了{吉星}等吉星，代表${what}方面容易得到助力。`,
      pro: `本命${P}三方四正吉星：{吉星}；主星：{主星}。`,
      legacyAdviceText: [`長期可以多發揮${what}的優勢`],
    },
    slots: { 吉星: `ziwei.natal.${P}.sfLucky`, 主星: `ziwei.natal.${P}.major` }, terms: ["三方四正"], priority: 20,
  }),
  base(`ziwei.natal.${P}.sha`, {
    timescale: "natal",
    based_on: { text_ids: [], commentary_ids: [], principle: "論一宮須合三方四正；會煞星（羊陀火鈴空劫）多者其事多波折" },
    applies_when: `本命${P}三方四正會煞星三顆以上`,
    condition: { fact: `ziwei.natal.${P}.sfShaN`, op: "gte", value: 3 },
    effects: E({ [dom]: -1 }),
    templates: {
      conclusion: `你的${P}三方四正會合{煞星}，${what}方面先天較多波折。`,
      plain: `你的${P}這一組三方四正會合了{煞星}等煞星，代表${what}方面容易遇到阻礙，需要較多耐心與規劃。`,
      pro: `本命${P}三方四正煞星：{煞星}；主星：{主星}。`,
      legacyAdviceText: [`${what}方面長期要多留風險緩衝`],
    },
    slots: { 煞星: `ziwei.natal.${P}.sfSha`, 主星: `ziwei.natal.${P}.major` }, terms: ["三方四正"], priority: 20,
  }),
  base(`ziwei.natal.${P}.bright`, {
    timescale: "natal",
    based_on: { text_ids: [], commentary_ids: [], principle: "主星廟旺則發揮力強，落陷則力弱（亮度表依通行本）" },
    applies_when: `本命${P}主星廟旺`,
    condition: { fact: `ziwei.natal.${P}.strong`, op: "exists" },
    effects: E({ [dom]: 1 }),
    templates: {
      conclusion: `你的${P}主星{廟旺星}處廟旺，${what}方面的發揮力強。`,
      plain: `星曜在不同宮位有強弱之分。你${P}的{廟旺星}處在最有力的位置，${what}是你較能發揮的地方。`,
      pro: `本命${P}：{主星}。`,
      legacyAdviceText: [`${what}方面可以設定較積極的長期目標`],
    },
    slots: { 廟旺星: `ziwei.natal.${P}.strong`, 主星: `ziwei.natal.${P}.major` }, terms: ["三方四正"], priority: 15,
  }),
]);

const LEGACY_ZIWEI_RULES: RuleDefinition[] = [...huaRules, ...jiChongRules, ...focusRules, ...natalRules];

export const legacyZiweiScoring = {
  id: "legacyZiweiScoring",
  enabled: false,
  userFacing: false,
  reason: "含廟旺固定加減、吉煞計數、化祿化忌固定加減與同源重複計分，已停用；僅供開發者模式比較新舊差異。",
  families: ["ziwei.*.hua.*", "ziwei.*.jichong.*", "ziwei.*.focus.*", "ziwei.natal.*"],
  rules: LEGACY_ZIWEI_RULES,
} as const;
