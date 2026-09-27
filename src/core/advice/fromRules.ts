/** 既有規則命中 → InterpretationResult（依 kb/advice/lifeFactorMapping.ts 對照表，語意標準化，不新增命理推論）。 */
import type { SystemFired } from "../analysis/collect";
import type { NatalSet } from "../analysis/collect";
import { lifeFactorMappingFor } from "@/kb/advice/lifeFactorMapping";
import { SCORED_SYSTEMS, type ScoredSystem } from "@/kb/weights";
import type { ZiweiTransit } from "../ziwei/luck";
import { ZIWEI_ADVICE_PENDING_REASON, ziweiInterpretationResult } from "../ziwei/interp/engine";
import { factorDef, type FactorId } from "./factors";
import type { FactorPolarity, InterpretationFinding, InterpretationResult, LifeFactorInstance, TimeLayer } from "./interpretation";

export const ZIWEI_ADVICE_PENDING = ZIWEI_ADVICE_PENDING_REASON;

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

/** 四個系統各自的判讀結果。
 *  紫微改由紫微 Interpretation Engine 產生（原生判讀，不使用已停用的 legacy 計分規則）：
 *  沒有已校驗的規則時為 pending（不當成中性、也不影響其他系統）；部分主題可用時為 partial，只用在有覆蓋的主題。 */
export function interpretationResults(n: NatalSet, fired: SystemFired[], date: string, ziweiTransit: ZiweiTransit | null = null): InterpretationResult[] {
  return SCORED_SYSTEMS.map((system: ScoredSystem): InterpretationResult => {
    if (system === "ziwei") return ziweiInterpretationResult(n.ziwei, ziweiTransit, date, n.unavailable.find(u => u.system === "ziwei")?.reason);
    const un = n.unavailable.find(u => u.system === system);
    if (un) return { system, status: "unavailable", reason: un.reason, findings: [] };
    const findings = fired.filter(f => f.system === system).map(f => findingFromFired(f, date)).filter((x): x is InterpretationFinding => !!x);
    return { system, status: "active", findings };
  });
}
