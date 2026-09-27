/** DaXianEngine、AnnualLuckEngine（含流月、流日）與 AgeSystem。
 *  運限資料疊加在本命盤之上，不改變本命星曜位置。 */
import { STEMS, dayGz } from "../calendar/ganzhi";
import { resolveCivil } from "../calendar/resolve";
import { toLunar } from "../calendar/precise";
import type { Moment } from "../engine";
import type { Gender } from "../person";
import type { ZiweiRuleProfile } from "./profile";
import { effectiveLunarMonth } from "./calendar";
import { transformationsOf, type Transformation, type TransformationType } from "./transformations";
import { m12, type Hua, type PalaceName, type TraceStep } from "./common";

// ───────── 歲數 ─────────
export const AGE_SYSTEM_LABEL = { nominal: "虛歲（出生即 1 歲，農曆正月初一增歲）" } as const;
export function nominalAge(birthLunarYear: number, flowLunarYear: number, P: ZiweiRuleProfile): number {
  if (P.rules.ageSystem.value !== "nominal") throw new Error("尚未實作的歲數制度");
  return flowLunarYear - birthLunarYear + 1;
}

// ───────── 大限 ─────────
export function decadeDirection(yearStem: number, gender: Gender, P: ZiweiRuleProfile): { forward: boolean; trace: TraceStep } {
  if (P.rules.decadeDirectionRule.value !== "yangMaleYinFemaleForward") throw new Error("尚未實作的大限順逆規則");
  const yang = yearStem % 2 === 0;
  const forward = (yang && gender === "male") || (!yang && gender === "female");
  return {
    forward,
    trace: {
      id: "luck.direction", module: "DaXianEngine", title: "大限順逆", rule: { field: "decadeDirectionRule", label: P.rules.decadeDirectionRule.label },
      inputs: { 年干: STEMS[yearStem], 年干陰陽: yang ? "陽" : "陰", 性別: gender === "male" ? "男" : "女" },
      result: `${yang ? "陽" : "陰"}${gender === "male" ? "男" : "女"}${forward ? "順行" : "逆行"}`,
    },
  };
}
export function decadeRange(branch: number, life: number, ju: number, forward: boolean, P: ZiweiRuleProfile): [number, number] {
  if (P.rules.decadeStartRule.value !== "bureauNumber") throw new Error("尚未實作的起限規則");
  const k = forward ? m12(branch - life) : m12(life - branch);
  return [ju + k * 10, ju + k * 10 + 9];
}
export const decadeTrace = (ju: number, juName: string, P: ZiweiRuleProfile): TraceStep => ({
  id: "luck.start", module: "DaXianEngine", title: "大限起歲", rule: { field: "decadeStartRule", label: P.rules.decadeStartRule.label },
  inputs: { 五行局: juName, 歲數制度: AGE_SYSTEM_LABEL[P.rules.ageSystem.value] }, result: `命宮大限 ${ju}–${ju + 9} 歲，之後每十年一宮`,
});

// ───────── 流運 ─────────
export type ZScope = "decade" | "year" | "month" | "day";
export const Z_SCOPE_LABEL: Record<ZScope, string> = { decade: "目前大限", year: "流年", month: "流月", day: "流日" };
const SCOPE_TYPE: Record<ZScope, TransformationType> = { decade: "decade", year: "annual", month: "monthly", day: "daily" };

export interface TransitScope {
  lifeBranch: number; lifeOnNatal: PalaceName; stem: string;
  hua: Record<Hua, { star: string; palace: PalaceName | null }>;
  transformations: Transformation[];
}
export interface ZiweiTransit {
  nominalAge: number;
  ageSystem: string;
  scopes: Record<ZScope, TransitScope | null>;
  lunar: { year: number; month: number; day: number; isLeap: boolean };
}

interface NatalForTransit {
  lunar: { year: number; effectiveMonth: number };
  hourBranch: number;
  palaces: { branch: number; name: PalaceName; stem: number; decade: [number, number] }[];
  starBranch: Record<string, number>;
  profile: ZiweiRuleProfile;
}

export function computeZiweiTransit(n: NatalForTransit, at: Moment): ZiweiTransit {
  const P = n.profile;
  const r = resolveCivil({ date: at.civilDate, time: at.civilTime, timeZone: at.timeZone });
  const L = r.chartLocal;
  const lu = toLunar(L.y, L.m, L.d);
  const age = nominalAge(n.lunar.year, lu.year, P);
  const scope = (s: ZScope, lifeBranch: number, stem: string): TransitScope => {
    const tr = transformationsOf(stem, SCOPE_TYPE[s], P);
    const hua = Object.fromEntries(tr.map(t => [t.transformation, { star: t.star, palace: n.starBranch[t.star] !== undefined ? n.palaces[n.starBranch[t.star]].name : null }])) as TransitScope["hua"];
    return { lifeBranch, lifeOnNatal: n.palaces[lifeBranch].name, stem, hua, transformations: tr };
  };
  const dp = n.palaces.find(p => age >= p.decade[0] && age <= p.decade[1]) ?? null;
  const yb = m12(lu.year - 4), ys = ((lu.year - 4) % 10 + 10) % 10;
  if (P.rules.monthlyRule.value !== "douJun" || P.rules.dailyRule.value !== "douJunDay" || P.rules.annualRule.value !== "taiSuiPalace") throw new Error("尚未實作的流運規則");
  const flowMonth = effectiveLunarMonth(lu.month, lu.day, lu.isLeap, P.rules.leapMonthRule.value);
  const doujun = m12(yb - (n.lunar.effectiveMonth - 1) + n.hourBranch);
  const monthB = m12(doujun + flowMonth - 1);
  const dayB = m12(monthB + lu.day - 1);
  const dayStem = STEMS[dayGz(L.y, L.m, L.d).stem];
  const monthStem = STEMS[((ys % 5) * 2 + 2 + flowMonth - 1) % 10];
  return {
    nominalAge: age, ageSystem: AGE_SYSTEM_LABEL.nominal,
    lunar: { year: lu.year, month: lu.month, day: lu.day, isLeap: lu.isLeap },
    scopes: {
      decade: dp ? scope("decade", dp.branch, STEMS[dp.stem]) : null,
      year: scope("year", yb, STEMS[ys]),
      month: scope("month", monthB, monthStem),
      day: scope("day", dayB, dayStem),
    },
  };
}
