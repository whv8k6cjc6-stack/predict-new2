/** 分數顯示制度與可追溯明細。
 *  正式分數必須能反查：分數 → 加權項目 → 命理規則 → 命盤因素 → 古籍／規則來源。
 *  排盤與規則引擎通過驗證前，一律回傳 unavailable，不產生任何個人分數。 */
import type { DomainKey } from "./domains";
import type { SystemId } from "./engine";
import type { RuleMatch } from "./sources";
import type { VersionStamp } from "./versioning";

export interface ScoreBand {
  key: "unfavorable" | "weak" | "mixed" | "favorable" | "strong";
  min: number; max: number;
  label: string; stars: 1 | 2 | 3 | 4 | 5;
  meaning: string;      // 代表什麼
  posture: string;      // 建議的行動姿態
}

export const SCORE_BANDS: ScoreBand[] = [
  { key: "strong", min: 85, max: 100, label: "高度一致的有利訊號", stars: 5, meaning: "多套系統、多個時間尺度同時指向有利，阻力很少。", posture: "適合推進重要事項；仍依既定計畫與紀律執行。" },
  { key: "favorable", min: 70, max: 84, label: "偏有利", stars: 4, meaning: "有利因素明顯多於不利因素。", posture: "可以積極進行，把關鍵事項排在較佳時段。" },
  { key: "mixed", min: 55, max: 69, label: "普通／訊號混合", stars: 3, meaning: "有利與不利因素並存，或各系統看法不一致。", posture: "可以做，但先處理已知風險點；查看判斷依據了解分歧在哪。" },
  { key: "weak", min: 40, max: 54, label: "偏弱", stars: 2, meaning: "不利因素略多，或支持力道不足。", posture: "以例行事務為主，重大決定多確認或改時間。" },
  { key: "unfavorable", min: 0, max: 39, label: "明顯不利", stars: 1, meaning: "多個命理因素同時指向不利。", posture: "不做不可逆的決定；必須做時縮小規模、選較佳時段。" },
];

export const bandOf = (score: number): ScoreBand =>
  SCORE_BANDS.find(b => score >= b.min && score <= b.max) ?? SCORE_BANDS[SCORE_BANDS.length - 1];

/** 解讀確定度（各系統訊號一致程度），與分數分開顯示 */
export const CONFIDENCE_LEVELS = [
  { level: 5, label: "訊號一致", meaning: "所有有效系統同向，且至少三套。" },
  { level: 4, label: "大部分一致", meaning: "多數系統同向，沒有反向訊號。" },
  { level: 3, label: "訊號混合", meaning: "有同向也有中性，沒有明顯反向。" },
  { level: 2, label: "判讀分歧", meaning: "同時存在偏正面與偏負面的系統。" },
  { level: 1, label: "資料不足", meaning: "有效系統少於兩套（例如出生時辰不明）。" },
] as const;
export type ConfidenceLevel = 1 | 2 | 3 | 4 | 5;

/** 分數明細中的一個加權項目 */
export interface WeightedItem {
  system: SystemId;
  timescale: "natal" | "decade" | "year" | "month" | "day" | "hour";
  weight: number;
  contribution: number;       // 對分數的實際貢獻
  rule_id: string;
  match: RuleMatch;           // 命盤因素
  text_ids: string[];         // 古籍原文
  commentary_ids: string[];   // 注解
}

export type DomainScore =
  | { status: "ready"; domain: DomainKey; value: number; confidence: ConfidenceLevel; breakdown: WeightedItem[]; stamps: VersionStamp[] }
  | { status: "unavailable"; domain: DomainKey; reason: string; requiredPhase: number }
  | { status: "demo"; domain: DomainKey; value: number; confidence: ConfidenceLevel; note: "DEMO 測試資料" };
