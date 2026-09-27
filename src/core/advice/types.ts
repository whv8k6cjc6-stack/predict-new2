/** ActionAdviceEngine 的輸入輸出型別。 */
import type { ScoredSystem } from "@/kb/weights";
import type { TopicCoverage, TopicId } from "@/kb/advice/topics";
import type { TemplateId } from "@/kb/advice/templates";
import type { FactorId } from "./factors";
import type { FactorPolarity, InterpretationFinding, InterpretationResult, SourceReliability, TimeLayer } from "./interpretation";

/** 建議的時間尺度；atTime＝擇時模式指定的時刻 */
export type Horizon = "today" | "next3Days" | "thisMonth" | "thisYear" | "longTerm" | "atTime";
export const HORIZON_LABEL: Record<Horizon, string> = { today: "今天", next3Days: "近 3 天", thisMonth: "本月", thisYear: "今年", longTerm: "長期", atTime: "此時段" };
/** 放進建議句子的時間說法 */
export const HORIZON_PHRASE: Record<Horizon, string> = { today: "今天", next3Days: "這幾天", thisMonth: "這個月", thisYear: "今年", longTerm: "接下來幾年", atTime: "這個時段" };
/** 每個時間尺度取自哪一層命理判讀（跨時間尺度的建議必須能追溯到這一層） */
export const HORIZON_LAYERS: Record<Horizon, TimeLayer[]> = {
  today: ["day"], next3Days: ["day"], thisMonth: ["month"], thisYear: ["year"], longTerm: ["decade", "natal"], atTime: ["hour", "day"],
};

export type SystemAgreementStatus = "agreement" | "partialAgreement" | "conflict" | "insufficientData";
export type Stance = "support" | "risk" | "mixed" | "none";

export interface AdviceRule {
  adviceRuleId: string;
  topics: TopicId[];
  horizons: Horizon[];
  /** 條件只能引用生活因素（不可直接引用命理術語、規則編號或命盤事實） */
  when: { all?: FactorId[]; any?: FactorId[]; none?: FactorId[] };
  priority: number;
  action?: TemplateId;
  avoid?: TemplateId;
  reason: string;                  // 白話理由（一般模式「為什麼」）
  semanticKey: string;             // 語意去重鍵：同一核心建議只出現一次
  conflictPolicy: "normal" | "suppressOnConflict" | "conflictOnly";
  baseConfidence: "high" | "medium" | "low";
}

export interface FactorEvidence {
  factorId: FactorId;
  polarity: FactorPolarity;
  score: number;                   // Σ 強度 × 可靠度權重
  systems: ScoredSystem[];
  instances: { system: ScoredSystem; ruleId: string; findingId: string; date: string; timeLayer: TimeLayer; strength: number; reliability: SourceReliability }[];
}

export type ConfidenceLevel = "high" | "medium" | "low";
export interface AdviceConfidence {
  level: ConfidenceLevel;
  sourceReliability: SourceReliability | "mixed";
  topicCoverage: TopicCoverage;
  systemAgreement: SystemAgreementStatus;
  dataCompleteness: { activeSystems: ScoredSystem[]; systemsWithSignals: ScoredSystem[]; pendingSystems: ScoredSystem[]; unavailableSystems: ScoredSystem[] };
  reasons: string[];
}

export interface AdviceItem {
  id: string;
  adviceRuleId: string;
  templateId: TemplateId;
  kind: "do" | "avoid";
  text: string;
  short: string;
  horizon: Horizon;
  score: number;
  semanticKey: string;
  reason: string;
  factors: FactorId[];
  confidence: ConfidenceLevel;
}

export interface AdviceTrace {
  adviceItemId: string;
  adviceRuleId: string;
  templateId: TemplateId;
  horizon: Horizon;
  layers: TimeLayer[];
  factors: FactorEvidence[];
  findings: InterpretationFinding[];
}

export interface SystemView { system: ScoredSystem; status: InterpretationResult["status"]; reason?: string; stance: Stance; support: string[]; risk: string[] }

export interface HorizonAdvice {
  horizon: Horizon;
  headline: string;
  doNow: AdviceItem[];
  avoidNow: AdviceItem[];
  agreement: SystemAgreementStatus;
}

export interface StructuredAdvice {
  topic: TopicId;
  topicLabel: string;
  date: string;
  timeHorizon: Horizon;            // 主要時間尺度
  dayWord: string;                 // 主要時間尺度的說法（今天／明天／10月5日／這個時段）
  headline: string;                // 一句話結論（為什麼的白話摘要）
  primaryAdvice: AdviceItem | null;
  summary: string;
  doNow: AdviceItem[];             // 最多 3 項，不硬湊
  avoidNow: AdviceItem[];          // 最多 2 項，不硬湊
  otherHorizons: HorizonAdvice[];  // 近 3 天／本月／今年／長期（只有真有資料時才出現）
  timing: { best: string[]; avoid: string[]; note: string } | null;
  positiveFactors: { factorId: FactorId; label: string; systems: ScoredSystem[] }[];
  riskFactors: { factorId: FactorId; label: string; systems: ScoredSystem[] }[];
  confidence: AdviceConfidence;
  systemAgreement: { status: SystemAgreementStatus; note: string; systems: SystemView[] };
  coverage: { level: TopicCoverage; basisLabel: string; note: string | null };
  notes: string[];                 // 安全說明、紫微建置中等
  noSignal: boolean;
  sourceRuleIds: string[];
  trace: AdviceTrace[];
}
