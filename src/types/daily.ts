export type CategoryKey = "overall" | "career" | "wealth" | "love" | "health" | "social" | "travel" | "study";

export type SystemName = "八字" | "滴天髓" | "神煞" | "紫微" | "奇門" | "易經";

/** 一條可追溯的判斷依據：專業術語 → 專業說明 → 白話 → 對各運勢的加減分 */
export interface Evidence {
  id: string;
  system: SystemName;
  term: string;        // 專業術語（可點查名詞）
  pro: string;         // 專業說明（術語層）
  plain: string;       // 白話
  quote?: string;      // 古籍原文
  brief: string;       // 一句話摘要（組合結論用）
  briefNeg?: string;   // 對某面向為扣分時改用的摘要
  effects: Partial<Record<CategoryKey, number>>;
  tips?: Partial<Record<CategoryKey, { do?: string; dont?: string }>>;
}

export interface Grade {
  name: string; stars: number; min: number;
  tone: "great" | "good" | "fair" | "flat" | "low" | "bad";
  meaning: string; attitude: string;
}

export interface CategoryReport {
  key: CategoryKey;
  label: string;
  glyph: string;
  score: number;
  grade: Grade;
  headline: string;
  dos: string[];
  donts: string[];
  bestHours: string[];
  evidences: { ev: Evidence; delta: number }[];
}

export interface HourFortune {
  branch: string; range: string; score: number; grade: Grade; note: string; isNoble: boolean;
}

export interface DailyReport {
  date: string;
  weekday: string;
  lunarText: string;
  ganzhi: { year: string; month: string; day: string };
  solarTerm: string;
  profileName: string;
  dayMaster: string;
  overall: CategoryReport;
  categories: CategoryReport[];
  lucky: { color: string; colorHex: string; numbers: number[]; direction: string; hours: string[]; nobleZodiac: string[]; element: string };
  keywords: { text: string; tone: "pos" | "neg" | "neutral" }[];
  hours: HourFortune[];
  hexagram: import("@/engines/iching").HexReading;
  hexagramBasis: string;
  ditiansui: { verse: string; plain: string; stem: string; season: string; tiaohou: string | null };
  evidences: Evidence[];
  confidence: "high" | "medium" | "low";
  confidenceNote: string;
  disclaimer: string;
}
