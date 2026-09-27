/** LifeBodyPalaceEngine、PalaceEngine、FiveElementBureauEngine：命身宮、十二宮宮名與宮干、五行局。 */
import { STEMS, gzFrom, gz, nayin, type GanZhi } from "../calendar/ganzhi";
import type { ZiweiRuleProfile } from "./profile";
import { BR, PALACES, m12, type PalaceName, type TraceStep } from "./common";

// ───────── 命宮、身宮 ─────────
export function lifeBodyPalace(effectiveMonth: number, hourBranch: number, P: ZiweiRuleProfile): { life: number; body: number; trace: TraceStep[] } {
  if (P.rules.lifeBodyPalaceRule.value !== "yinStartMonthThenHour") throw new Error("尚未實作的命身宮規則");
  const monthPalace = m12(2 + (effectiveMonth - 1));
  const life = m12(monthPalace - hourBranch);
  const body = m12(monthPalace + hourBranch);
  const rule = { field: "lifeBodyPalaceRule" as const, label: P.rules.lifeBodyPalaceRule.label };
  return {
    life, body,
    trace: [
      { id: "palace.life", module: "LifeBodyPalaceEngine", title: "安命宮", rule, inputs: { 生月: effectiveMonth, 時支序: hourBranch },
        formula: `寅(2)＋(月−1)＝${BR[monthPalace]}；逆數時支 → 2＋(${effectiveMonth}−1)−${hourBranch}`, result: `命宮＝${BR[life]}` },
      { id: "palace.body", module: "LifeBodyPalaceEngine", title: "安身宮", rule, inputs: { 生月: effectiveMonth, 時支序: hourBranch },
        formula: `寅(2)＋(月−1)＝${BR[monthPalace]}；順數時支 → 2＋(${effectiveMonth}−1)＋${hourBranch}`, result: `身宮＝${BR[body]}` },
    ],
  };
}

// ───────── 十二宮 ─────────
/** 五虎遁：依年干定寅宮天干，順推 */
export function palaceStem(yearStem: number, branch: number, P: ZiweiRuleProfile): number {
  if (P.rules.palaceStemRule.value !== "fiveTigers") throw new Error("尚未實作的宮干規則");
  return (((yearStem % 5) * 2 + 2) + m12(branch - 2)) % 10;
}
/** 命宮起逆時針排十二宮：地支 b 的宮名 */
export function palaceNameAt(life: number, branch: number, P: ZiweiRuleProfile): PalaceName {
  return P.rules.palaceNaming.value[m12(life - branch)] as PalaceName;
}
export function palaceLayoutTrace(life: number, yearStem: number, P: ZiweiRuleProfile): TraceStep {
  return {
    id: "palace.layout", module: "PalaceEngine", title: "排十二宮與宮干",
    rule: { field: "palaceStemRule", label: P.rules.palaceStemRule.label },
    inputs: { 命宮: BR[life], 年干: STEMS[yearStem] },
    formula: "自命宮逆行依序：命宮、兄弟、夫妻、子女、財帛、疾厄、遷移、交友、官祿、田宅、福德、父母；宮干以五虎遁自寅宮順推",
    result: PALACES.map((n, i) => `${n}${BR[m12(life - i)]}`).join("、"),
  };
}

// ───────── 五行局 ─────────
const BUREAU_NUMBER: Record<string, number> = { 水: 2, 木: 3, 金: 4, 土: 5, 火: 6 };
export const BUREAU_NAME: Record<number, string> = { 2: "水二局", 3: "木三局", 4: "金四局", 5: "土五局", 6: "火六局" };

/** 六十甲子 → 納音 → 五行局 的完整對照（由納音表推導，非逐一寫死） */
export const BUREAU_TABLE: { gz: string; nayin: string; element: string; bureau: string }[] =
  Array.from({ length: 60 }, (_, i) => { const g = gz(i); const ny = nayin(g); const el = ny.slice(-1); return { gz: g.text, nayin: ny, element: el, bureau: BUREAU_NAME[BUREAU_NUMBER[el]] }; });

export function fiveElementBureau(lifeGz: GanZhi, P: ZiweiRuleProfile): { ju: number; juName: string; trace: TraceStep } {
  if (P.rules.bureauRule.value !== "lifePalaceNayin") throw new Error("尚未實作的五行局規則");
  const ny = nayin(lifeGz);
  const ju = BUREAU_NUMBER[ny.slice(-1)];
  return {
    ju, juName: BUREAU_NAME[ju],
    trace: {
      id: "bureau", module: "FiveElementBureauEngine", title: "定五行局",
      rule: { field: "bureauRule", label: P.rules.bureauRule.label },
      inputs: { 命宮干支: lifeGz.text }, formula: `${lifeGz.text} 納音「${ny}」→ 五行「${ny.slice(-1)}」→ 水2 木3 金4 土5 火6`,
      result: BUREAU_NAME[ju],
    },
  };
}

export const lifePalaceGz = (life: number, yearStem: number, P: ZiweiRuleProfile) => gzFrom(palaceStem(yearStem, life, P), life);
