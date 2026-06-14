export type ConditionOp =
  | "eq" | "neq" | "in" | "not_in" | "gte" | "lte"
  | "contains" | "conflictsWith" | "combinesWith";

export interface ConditionLeaf {
  field: string;        // 引擎輸出欄位名，見 docs/RULE_ENGINE.md
  op: ConditionOp;
  value: unknown;
}

export interface RuleCondition {
  all?: Array<RuleCondition | ConditionLeaf>;
  any?: Array<RuleCondition | ConditionLeaf>;
  not?: RuleCondition | ConditionLeaf;
}

export interface FortuneRule {
  id: string;
  system: "bazi" | "ziwei" | "qimen";
  category: "career" | "wealth" | "relationship" | "health" | "people" | "decision" | "travel" | "overall";
  scope: "daily" | "monthly" | "yearly" | "any";
  sourceReference: string;
  condition: RuleCondition | ConditionLeaf;
  weight: number;        // 1–10
  scoreEffect: number;   // -30 ~ +30
  level: "positive" | "neutral" | "caution" | "negative";
  explanationTemplate: string;
  strategyTemplate: string;
  riskWarning?: string;
  needsVerification: boolean;
  enabled: boolean;
}
