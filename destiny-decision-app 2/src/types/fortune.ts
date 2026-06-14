export interface Scores {
  overall: number; career: number; wealth: number; relationship: number;
  health: number; people: number; decision: number; risk: number;
}

export interface TriggeredRule {
  ruleId: string;
  system: "bazi" | "ziwei" | "qimen";
  level: "positive" | "neutral" | "caution" | "negative";
  explanation: string;
  strategy: string;
  weight: number;
}

export type QueryType = "daily" | "monthly" | "yearly" | "range" | "decision";
export type Topic = "overall" | "career" | "wealth" | "relationship" | "travel" | "decision" | "custom";

export interface FortuneResult {
  type: QueryType;
  targetDate: string;           // 日: YYYY-MM-DD / 月: YYYY-MM / 年: YYYY
  topic: Topic;
  scores: Scores;
  suitableActions: string[];
  avoidActions: string[];
  bestDirection: string;
  bestTimeRange: string;
  triggeredRules: TriggeredRule[];
  summary: string;
  strategy: string;
  confidenceLevel: "low" | "medium" | "high";
  disclaimer: string;
}

export interface HistoryRecord {
  id: string;
  queriedAt: string;
  queryType: QueryType;
  topic: string;
  targetDate: string;
  scores: Scores;
  aiSummary: string;
  feedback: {
    accuracy: "hit" | "neutral" | "miss" | null;
    actualResult: string;
    feedbackAt: string | null;
  };
}
