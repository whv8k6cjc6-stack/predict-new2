/** MainStarEngine、MinorStarEngine：安十四主星（紫微星系、天府星系）與輔曜、煞曜、雜曜。
 *  所有位置皆由演算法產生；查表型資料（魁鉞、祿存）來自 ZiweiRuleProfile。 */
import { STEMS } from "../calendar/ganzhi";
import type { Stem, ZiweiRuleProfile, ZiweiRules } from "./profile";
import { BR, m12, type TraceStep } from "./common";

// ───────── 主星 ─────────
export interface MainStarInfo {
  starId: string; name: string; system: "ziwei" | "tianfu";
  element: string | null; yinYang: "陰" | "陽" | null;
  attributeSource: string; placementRule: string;
}
const IZTRO_ATTR = "iztro 2.6.1 STARS_INFO（程式資料，非古籍）";
const PENDING = "pendingVerification（iztro 無資料，未自行補值）";
/** 五行與陰陽只收錄 iztro 已提供者；缺值保持 null，不自行補上 */
export const MAIN_STARS: MainStarInfo[] = [
  ["ziwei", "紫微", "ziwei", "土", "陰"], ["tianji", "天機", "ziwei", "木", "陰"], ["taiyang", "太陽", "ziwei", null, null],
  ["wuqu", "武曲", "ziwei", "金", "陰"], ["tiantong", "天同", "ziwei", "水", "陽"], ["lianzhen", "廉貞", "ziwei", "火", "陰"],
  ["tianfu", "天府", "tianfu", "土", "陽"], ["taiyin", "太陰", "tianfu", "水", "陰"], ["tanlang", "貪狼", "tianfu", "水", null],
  ["jumen", "巨門", "tianfu", "土", "陰"], ["tianxiang", "天相", "tianfu", "水", null], ["tianliang", "天梁", "tianfu", "土", null],
  ["qisha", "七殺", "tianfu", null, null], ["pojun", "破軍", "tianfu", "水", null],
].map(([starId, name, system, element, yinYang]) => ({
  starId: starId!, name: name!, system: system as "ziwei" | "tianfu", element, yinYang: yinYang as "陰" | "陽" | null,
  attributeSource: element === null || yinYang === null ? `${IZTRO_ATTR}；缺值：${PENDING}` : IZTRO_ATTR,
  placementRule: system === "ziwei" ? `紫微星系：自紫微依 mainStarOffsets.ziwei 逆行` : `天府星系：自天府依 mainStarOffsets.tianfu 順行`,
}));

/** 起紫微：局數 ju、農曆生日 day */
export function ziweiPosition(ju: number, day: number): number {
  const q = Math.ceil(day / ju), r = q * ju - day;
  const pos = r === 0 ? q : r % 2 === 1 ? q - r : q + r;
  return (2 + ((pos - 1) % 12) + 12) % 12;
}

export function placeMainStars(ju: number, lunarDay: number, P: ZiweiRuleProfile): { stars: Record<string, number>; trace: TraceStep[] } {
  if (P.rules.starPlacementAlgorithm.value !== "common") throw new Error("尚未實作的安星法");
  const q = Math.ceil(lunarDay / ju), r = q * ju - lunarDay;
  const pos = r === 0 ? q : r % 2 === 1 ? q - r : q + r;
  const zw = ziweiPosition(ju, lunarDay);
  const tf = m12(4 - zw);
  const off = P.rules.mainStarOffsets.value;
  const stars: Record<string, number> = {};
  for (const [n, d] of Object.entries(off.ziwei)) stars[n] = m12(zw + d);
  for (const [n, d] of Object.entries(off.tianfu)) stars[n] = m12(tf + d);
  const rule = { field: "mainStarOffsets" as const, label: P.rules.mainStarOffsets.label };
  return {
    stars,
    trace: [
      { id: "star.ziwei", module: "MainStarEngine", title: "安紫微星", rule: { field: "starPlacementAlgorithm", label: P.rules.starPlacementAlgorithm.label },
        inputs: { 局數: ju, 農曆日: lunarDay }, formula: `q＝⌈${lunarDay}/${ju}⌉＝${q}，r＝q×${ju}−${lunarDay}＝${r}；${r === 0 ? "r＝0 → 位置＝q" : r % 2 ? "r 為奇數 → 位置＝q−r" : "r 為偶數 → 位置＝q＋r"}＝${pos}；自寅起第 ${pos} 宮`,
        result: `紫微在${BR[zw]}` },
      { id: "star.tianfu", module: "MainStarEngine", title: "安天府星", rule, inputs: { 紫微: BR[zw] }, formula: "天府與紫微以寅申線對稱：(寅×2−紫微) mod 12", result: `天府在${BR[tf]}` },
      { id: "star.majors", module: "MainStarEngine", title: "排紫微星系與天府星系", rule, inputs: { 紫微: BR[zw], 天府: BR[tf] },
        result: Object.entries(stars).map(([n, b]) => `${n}${BR[b]}`).join("、") },
    ],
  };
}

// ───────── 輔曜、煞曜、雜曜 ─────────
export interface MinorContext { yearStem: number; yearBranch: number; month: number; hourBranch: number }
export interface MinorStarRule {
  starId: string; name: string;
  category: "benefic" | "malefic" | "lucun" | "tianma" | "misc";
  basis: string;
  profileField: keyof ZiweiRules;
  place: (c: MinorContext, P: ZiweiRuleProfile) => number;
}
const stemOf = (c: MinorContext) => STEMS[c.yearStem] as Stem;
const tri = (yb: number) => [8, 0, 4].includes(yb) ? 0 : [2, 6, 10].includes(yb) ? 1 : [5, 9, 1].includes(yb) ? 2 : 3; // 申子辰、寅午戌、巳酉丑、亥卯未
const fireBellStart = (yb: number) => { const g = [2, 6, 10].includes(yb) ? 0 : [8, 0, 4].includes(yb) ? 1 : [5, 9, 1].includes(yb) ? 2 : 3; return { fire: [1, 2, 3, 9][g], bell: [3, 10, 10, 10][g] }; };
const need = <T,>(P: ZiweiRuleProfile, field: keyof ZiweiRules, value: T) => { if (P.rules[field].value !== value) throw new Error(`尚未實作的規則 ${String(field)}=${String(P.rules[field].value)}`); };

export const MINOR_STAR_RULES: MinorStarRule[] = [
  { starId: "zuofu", name: "左輔", category: "benefic", basis: "出生月", profileField: "zuoYouRule", place: (c, P) => (need(P, "zuoYouRule", "chenForwardXuBackwardByMonth"), m12(4 + c.month - 1)) },
  { starId: "youbi", name: "右弼", category: "benefic", basis: "出生月", profileField: "zuoYouRule", place: (c, P) => (need(P, "zuoYouRule", "chenForwardXuBackwardByMonth"), m12(10 - (c.month - 1))) },
  { starId: "wenchang", name: "文昌", category: "benefic", basis: "出生時", profileField: "changQuRule", place: (c, P) => (need(P, "changQuRule", "xuBackwardChenForwardByHour"), m12(10 - c.hourBranch)) },
  { starId: "wenqu", name: "文曲", category: "benefic", basis: "出生時", profileField: "changQuRule", place: (c, P) => (need(P, "changQuRule", "xuBackwardChenForwardByHour"), m12(4 + c.hourBranch)) },
  { starId: "tiankui", name: "天魁", category: "benefic", basis: "出生年干", profileField: "kuiYueRule", place: (c, P) => P.rules.kuiYueRule.value[stemOf(c)][0] },
  { starId: "tianyue", name: "天鉞", category: "benefic", basis: "出生年干", profileField: "kuiYueRule", place: (c, P) => P.rules.kuiYueRule.value[stemOf(c)][1] },
  { starId: "lucun", name: "祿存", category: "lucun", basis: "出生年干", profileField: "luCunTable", place: (c, P) => P.rules.luCunTable.value[stemOf(c)] },
  { starId: "qingyang", name: "擎羊", category: "malefic", basis: "出生年干", profileField: "yangTuoRule", place: (c, P) => (need(P, "yangTuoRule", "luCunPlusMinusOne"), m12(P.rules.luCunTable.value[stemOf(c)] + 1)) },
  { starId: "tuoluo", name: "陀羅", category: "malefic", basis: "出生年干", profileField: "yangTuoRule", place: (c, P) => (need(P, "yangTuoRule", "luCunPlusMinusOne"), m12(P.rules.luCunTable.value[stemOf(c)] - 1)) },
  { starId: "dikong", name: "地空", category: "malefic", basis: "出生時", profileField: "kongJieRule", place: (c, P) => (need(P, "kongJieRule", "haiByHour"), m12(11 - c.hourBranch)) },
  { starId: "dijie", name: "地劫", category: "malefic", basis: "出生時", profileField: "kongJieRule", place: (c, P) => (need(P, "kongJieRule", "haiByHour"), m12(11 + c.hourBranch)) },
  { starId: "huoxing", name: "火星", category: "malefic", basis: "出生年支、時", profileField: "fireBellRule", place: (c, P) => (need(P, "fireBellRule", "threeHarmonyStartForwardByHourNoDirection"), (fireBellStart(c.yearBranch).fire + c.hourBranch) % 12) },
  { starId: "lingxing", name: "鈴星", category: "malefic", basis: "出生年支、時", profileField: "fireBellRule", place: (c, P) => (need(P, "fireBellRule", "threeHarmonyStartForwardByHourNoDirection"), (fireBellStart(c.yearBranch).bell + c.hourBranch) % 12) },
  { starId: "tianma", name: "天馬", category: "tianma", basis: "出生年支", profileField: "tianMaRule", place: (c, P) => (need(P, "tianMaRule", "yearBranchThreeHarmony"), [2, 8, 11, 5][tri(c.yearBranch)]) },
  { starId: "xianchi", name: "咸池", category: "misc", basis: "出生年支", profileField: "taohuaRules", place: c => [9, 3, 6, 0][tri(c.yearBranch)] },
  { starId: "hongluan", name: "紅鸞", category: "misc", basis: "出生年支", profileField: "taohuaRules", place: c => m12(3 - c.yearBranch) },
  { starId: "tianxi", name: "天喜", category: "misc", basis: "出生年支", profileField: "taohuaRules", place: c => m12(9 - c.yearBranch) },
  { starId: "tianxing", name: "天刑", category: "misc", basis: "出生月", profileField: "xingYaoRule", place: c => m12(9 + c.month - 1) },
  { starId: "tianyao", name: "天姚", category: "misc", basis: "出生月", profileField: "xingYaoRule", place: c => m12(1 + c.month - 1) },
];

export function placeMinorStars(c: MinorContext, P: ZiweiRuleProfile): { stars: Record<string, number>; trace: TraceStep } {
  need(P, "taohuaRules", "xianchiByThreeHarmony_hongluanFromMao_tianxiOpposite");
  need(P, "xingYaoRule", "tianxingFromYou_tianyaoFromChou_byMonth");
  const stars: Record<string, number> = {};
  for (const r of MINOR_STAR_RULES) stars[r.name] = r.place(c, P);
  return {
    stars,
    trace: {
      id: "star.minor", module: "MinorStarEngine", title: "安輔曜、煞曜、雜曜",
      inputs: { 年干: STEMS[c.yearStem], 年支: BR[c.yearBranch], 生月: c.month, 時支: BR[c.hourBranch] },
      formula: MINOR_STAR_RULES.map(r => `${r.name}（${r.basis}；${P.rules[r.profileField].label}）`).join("；"),
      result: MINOR_STAR_RULES.map(r => `${r.name}${BR[stars[r.name]]}`).join("、"),
    },
  };
}

export const MINOR_CATEGORY: Record<string, MinorStarRule["category"]> = Object.fromEntries(MINOR_STAR_RULES.map(r => [r.name, r.category]));
