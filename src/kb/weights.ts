/** 計分權重（集中管理、有版本號；專業模式可查看）。
 *  c_rule = polarity × strength × W_timescale × W_system(domain)
 *  score  = round(50 + 50 × tanh((raw − B) / K))
 *  B（基準校正）與 K（尺度）由 scripts/calibrate.test.ts 以固定樣本命例全年逐日分布校準：
 *  B 為中位數，使一般日子落在 50 附近；K 使約一成日子 ≥ 80。 */
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

/** 整體指數：各領域加權，另加「整體」專屬規則（權重 OVERALL_OWN_WEIGHT） */
export const OVERALL_MIX: Partial<Record<DomainKey, number>> = {
  career: 0.2, wealth: 0.12, investment: 0.1, social: 0.12, love: 0.1, health: 0.14, travel: 0.07, decision: 0.15,
};
export const OVERALL_OWN_WEIGHT = 0.4;

/** 交叉判讀：direction = tanh(Σ / DIRECTION_DIVISOR)，|direction| < NEUTRAL_BAND 視為中性 */
export const DIRECTION_DIVISOR = 4;
export const NEUTRAL_BAND = 0.2;

/** 校準組別：有出生時辰（四套系統）與無出生時辰（紫微不排盤）分開校準，避免少一套系統造成系統性偏差 */
export type Profile = "full" | "noZiwei";
export const profileOf = (unavailable: { system: string }[]): Profile => unavailable.some(u => u.system === "ziwei") ? "noZiwei" : "full";

/** 校準常數（由 scripts/calibrate.test.ts 產生，勿手改） */
export { K, B, CALIBRATION_INFO } from "./calibration.generated";
