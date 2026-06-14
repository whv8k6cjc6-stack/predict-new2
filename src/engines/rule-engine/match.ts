import type { ConditionLeaf, FortuneRule, RuleCondition } from "@/types/rule";
import type { TriggeredRule } from "@/types/fortune";

type Facts = Record<string, unknown>;

function leaf(c: ConditionLeaf, f: Facts): boolean {
  const v = f[c.field];
  switch (c.op) {
    case "eq": return v === c.value;
    case "neq": return v !== c.value;
    case "in": return Array.isArray(c.value) && c.value.includes(v);
    case "not_in": return Array.isArray(c.value) && !c.value.includes(v);
    case "gte": return typeof v === "number" && v >= (c.value as number);
    case "lte": return typeof v === "number" && v <= (c.value as number);
    case "contains": return Array.isArray(v) && v.includes(c.value);
    default: return false;
  }
}

export function matchCondition(c: RuleCondition | ConditionLeaf, f: Facts): boolean {
  if ("field" in c) return leaf(c, f);
  if (c.all) return c.all.every(x => matchCondition(x, f));
  if (c.any) return c.any.some(x => matchCondition(x, f));
  if (c.not) return !matchCondition(c.not, f);
  return false;
}

export function runRules(rules: FortuneRule[], facts: Facts, scope: string): { triggered: TriggeredRule[]; deltas: Record<string, number> } {
  const triggered: TriggeredRule[] = [];
  const deltas: Record<string, number> = {};
  for (const r of rules) {
    if (!r.enabled || (r.scope !== "any" && r.scope !== scope)) continue;
    try {
      if (!matchCondition(r.condition, facts)) continue;
    } catch { continue; }
    const factor = r.needsVerification ? 0.5 : 1;
    deltas[r.category] = (deltas[r.category] ?? 0) + r.scoreEffect * (r.weight / 10) * factor;
    triggered.push({
      ruleId: r.id, system: r.system, level: r.level,
      explanation: r.explanationTemplate, strategy: r.strategyTemplate, weight: r.weight,
    });
  }
  return { triggered, deltas };
}
