/** 計分權重（集中管理、有版本號；專業模式可查看）。
 *  c_rule = polarity × strength × W_timescale × W_system(domain)
 *  score  = round(50 + 50 × tanh((raw − B) / K))
 *  B（基準校正）與 K（尺度）由 scripts/calibrate.test.ts 以固定樣本命例全年逐日分布校準：
 *  B 為參與計分系統的中位數（位置校正）；K 固定取四術完整參考分布（約一成日子 ≥ 80），不隨參與系統數改變。 */
import type { DomainKey } from "@/core/domains";
import type { SystemId } from "@/core/engine";

export const WEIGHTS_VERSION = "3.0.0";

export type Timescale = "natal" | "decade" | "year" | "month" | "day" | "hour";
export type Level = "day" | "month" | "year" | "decade";

export const TIMESCALE_LABEL: Record<Timescale, string> = { natal: "本命", decade: "大運／大限", year: "流年", month: "流月", day: "流日", hour: "時辰" };

/** 今日視角的時間尺度權重；事件模式時辰權重提高為 1.3 */
export const W_TIMESCALE: Record<Timescale, number> = { natal: 0.6, decade: 0.8, year: 0.9, month: 1.0, day: 1.3, hour: 0.7 };
export const W_HOUR_EVENT = 1.3;

/** 各分析層級納入哪些時間尺度（時辰另計於吉時與事件模式） */
export const LEVEL_SCALES: Record<Level, Timescale[]> = {
  day: ["natal", "decade", "year", "month", "day"],
  month: ["natal", "decade", "year", "month"],
  year: ["natal", "decade", "year"],
  decade: ["natal", "decade"],
};
/** 背景尺度：比分析層級更長的時間尺度只作「背景」，其合計以 C × tanh(Σ / C) 壓縮，
 *  讓長期命勢能拉高或壓低分數，但不會讓一整年每天都落在同一區間。 */
export const BACKGROUND_SCALES: Record<Level, Timescale[]> = {
  day: ["natal", "decade", "year"], month: ["natal", "decade"], year: ["natal", "decade"], decade: ["natal"],
};
export const BACKGROUND_CAP: Record<Level, number> = { day: 1.5, month: 2, year: 1.5, decade: 1 };

/** 長期命勢與短期時機的分界（交叉判讀用） */
export const LONG_SCALES: Timescale[] = ["natal", "decade", "year"];

export type ScoredSystem = Extract<SystemId, "bazi" | "ziwei" | "qimen" | "iching">;
export const SCORED_SYSTEMS: ScoredSystem[] = ["bazi", "ziwei", "qimen", "iching"];

/** 各系統在各領域的權重（依 D-1 分工） */
export const W_SYSTEM: Record<DomainKey, Record<ScoredSystem, number>> = {
  overall:    { bazi: 1.0, ziwei: 0.9, qimen: 0.7, iching: 0.6 },
  career:     { bazi: 1.0, ziwei: 1.0, qimen: 0.8, iching: 0.5 },
  wealth:     { bazi: 1.0, ziwei: 1.0, qimen: 0.7, iching: 0.5 },
  investment: { bazi: 1.0, ziwei: 1.0, qimen: 0.8, iching: 0.5 },
  social:     { bazi: 1.0, ziwei: 0.9, qimen: 0.8, iching: 0.5 },
  love:       { bazi: 0.9, ziwei: 1.0, qimen: 0.7, iching: 0.5 },
  travel:     { bazi: 0.8, ziwei: 0.7, qimen: 1.2, iching: 0.6 },
  health:     { bazi: 1.0, ziwei: 0.9, qimen: 0.6, iching: 0.4 },
  decision:   { bazi: 0.9, ziwei: 0.8, qimen: 1.0, iching: 0.8 },
};

/** 綜合指數＝(1 − OVERALL_OWN_WEIGHT) × 各領域分數加權平均 ＋ OVERALL_OWN_WEIGHT ×「整體」專屬規則分數 */
export const OVERALL_MIX: Partial<Record<DomainKey, number>> = {
  career: 0.2, wealth: 0.12, investment: 0.1, social: 0.12, love: 0.1, health: 0.14, travel: 0.07, decision: 0.15,
};
export const OVERALL_OWN_WEIGHT = 0.25;

/** 交叉判讀：direction = tanh(Σ / DIRECTION_DIVISOR)，|direction| < NEUTRAL_BAND 視為中性 */
export const DIRECTION_DIVISOR = 4;
export const NEUTRAL_BAND = 0.2;

/** 各系統參與正式分數的狀態（ScoreAggregator）。
 *  - active：參與計分
 *  - pending：不參與分數（紫微：判讀已啟用、計分依規格停用）（不放大其他系統權重來補）
 *  - inactive：停用 */
export type ScoringStatus = "active" | "pending" | "inactive";
export const SYSTEM_SCORING: Record<ScoredSystem, { status: ScoringStatus; detail: string; reason: string }> = {
  bazi: { status: "active", detail: "active", reason: "" },
  ziwei: {
    status: "pending", detail: "interpretationPending",
    reason: "紫微判讀已啟用（依《紫微斗數全書》廣益版雙重核讀原文），只用於建議與判讀；依規格不參與分數。舊計分規則（廟旺固定加分、吉煞只按數量加減、化祿化忌固定加減、化忌沖宮重複扣分）已停用，僅開發者模式可比較。",
  },
  qimen: { status: "active", detail: "active", reason: "" },
  iching: { status: "active", detail: "active", reason: "" },
};
export const isScoringActive = (s: ScoredSystem) => SYSTEM_SCORING[s].status === "active";

/** 校準組別：只用於基準 B（有／無出生時辰分開取中位數，時辰不詳時八字時柱相關規則停用）。
 *  尺度 K 不分組、固定為四術完整參考尺度：系統暫不計分或資料不足時，不以縮小 K 的方式放大其他系統。 */
export type CalibrationGroup = "timeKnown" | "timeUnknown";
export const calibrationGroupOf = (n: { timeKnown: boolean }): CalibrationGroup => n.timeKnown ? "timeKnown" : "timeUnknown";

/** 校準常數（由 scripts/calibrate.test.ts 產生，勿手改） */
export { K, B, CALIBRATION_INFO } from "./calibration.generated";
