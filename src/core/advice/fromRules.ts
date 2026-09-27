/** 既有規則命中 → InterpretationResult（依 kb/advice/lifeFactorMapping.ts 對照表，語意標準化，不新增命理推論）。 */
import type { SystemFired } from "../analysis/collect";
import type { NatalSet } from "../analysis/collect";
import { lifeFactorMappingFor } from "@/kb/advice/lifeFactorMapping";
import { SCORED_SYSTEMS, SYSTEM_SCORING, type ScoredSystem } from "@/kb/weights";
import { factorDef, type FactorId } from "./factors";
import type { FactorPolarity, InterpretationFinding, InterpretationResult, LifeFactorInstance, TimeLayer } from "./interpretation";

export const ZIWEI_ADVICE_PENDING = "目前紫微判讀引擎建置中，未納入本次建議。";

export function findingFromFired(sf: SystemFired, date: string): InterpretationFinding | null {
  if (sf.legacy) return null;                       // 已停用的 legacy 計分規則不進入建議
  const { rule, match, text, textIds } = sf.fired;
  const m = lifeFactorMappingFor(rule);
  if (!m) return null;
  const moving = rule.effects.filter(e => e.polarity !== 0);
  const domains = [...new Set((moving.length ? moving : rule.effects).map(e => e.domain))];
  const strength = Math.max(...rule.effects.map(e => e.strength)) as 1 | 2 | 3;
  const timeLayer = rule.timescale as TimeLayer;
  const factors: LifeFactorInstance[] = m.factors.map(f => {
    const [factorId, override] = (Array.isArray(f) ? f : [f, undefined]) as [FactorId, FactorPolarity | undefined];
    return {
      factorId, polarity: override ?? factorDef(factorId).nature, strength, domains,
      sourceSystem: sf.system, sourceRuleIds: [rule.id], timeLayer,
      mappingType: "derivedFromExistingInterpretation", reliability: m.reliability,
      confidence: m.reliability === "pendingVerification" ? "low" : "medium",
    };
  });
  return {
    findingId: `${rule.id}@${date}`, system: sf.system, ruleId: rule.id, date, timeLayer,
    effects: rule.effects, factors, reliability: m.reliability,
    mapping: { basis: m.basis.join("／"), reason: m.reason, excluded: m.excluded },
    source: {
      conclusion: text.conclusion, plain: text.plain, pro: text.pro, principle: rule.based_on.principle, school: rule.school,
      textIds, matched: match.matched, legacyAdviceText: text.legacyAdviceText,
    },
  };
}

/** 四個系統各自的判讀結果。紫微判讀引擎尚未完成：status＝pending，不當成中性、也不影響其他系統。 */
export function interpretationResults(n: NatalSet, fired: SystemFired[], date: string): InterpretationResult[] {
  return SCORED_SYSTEMS.map((system: ScoredSystem): InterpretationResult => {
    if (SYSTEM_SCORING[system].status === "pending") return { system, status: "pending", reason: ZIWEI_ADVICE_PENDING, findings: [] };
    const un = n.unavailable.find(u => u.system === system);
    if (un) return { system, status: "unavailable", reason: un.reason, findings: [] };
    const findings = fired.filter(f => f.system === system).map(f => findingFromFired(f, date)).filter((x): x is InterpretationFinding => !!x);
    return { system, status: "active", findings };
  });
}
