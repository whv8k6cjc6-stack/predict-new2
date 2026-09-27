/** 紫微模組共用：宮名、星曜分組、計算追蹤型別、版本號。 */
import type { ZiweiRules } from "./profile";
import { CALENDAR_VERSION } from "../calendar/solarTime";

export const PALACES = ["命宮", "兄弟", "夫妻", "子女", "財帛", "疾厄", "遷移", "交友", "官祿", "田宅", "福德", "父母"] as const;
export type PalaceName = (typeof PALACES)[number];
export const PALACE_IDS: Record<PalaceName, string> = {
  命宮: "ming", 兄弟: "xiongdi", 夫妻: "fuqi", 子女: "zinv", 財帛: "caibo", 疾厄: "jie",
  遷移: "qianyi", 交友: "jiaoyou", 官祿: "guanlu", 田宅: "tianzhai", 福德: "fude", 父母: "fumu",
};
export const MAJOR = ["紫微", "天機", "太陽", "武曲", "天同", "廉貞", "天府", "太陰", "貪狼", "巨門", "天相", "天梁", "七殺", "破軍"];
export const LUCKY6 = ["左輔", "右弼", "文昌", "文曲", "天魁", "天鉞"];
export const SHA6 = ["擎羊", "陀羅", "火星", "鈴星", "地空", "地劫"];
export const MISC5 = ["咸池", "紅鸞", "天喜", "天刑", "天姚"];
export const HUA = ["祿", "權", "科", "忌"] as const;
export type Hua = (typeof HUA)[number];
export const BR = "子丑寅卯辰巳午未申酉戌亥";
export const m12 = (x: number) => ((x % 12) + 12) % 12;

/** 計算追蹤：每一步都可檢查使用了哪條規則、輸入與結果 */
export interface TraceStep {
  id: string;
  module: string;
  title: string;
  rule?: { field: keyof ZiweiRules; label: string };
  inputs: Record<string, string | number | boolean>;
  formula?: string;
  result: string;
}

/** 各模組版本號（改算法時必須提高對應版本，舊盤才能追溯）。
 *  判讀引擎與古籍資料尚未建立：以 0.0.0-pending／0.0.0-none 標示，避免被誤認為正式可用版本。 */
export const ZIWEI_VERSIONS = {
  calendarVersion: CALENDAR_VERSION,
  ziweiChartEngineVersion: "1.0.0",
  starPlacementVersion: "1.0.0",
  brightnessVersion: "iztro-2.6.1",
  transformationVersion: "1.0.0",
  luckVersion: "1.0.0",
  interpretationVersion: "0.0.0-pending",
  classicalDataVersion: "0.0.0-none",
} as const;
export type ZiweiVersions = typeof ZIWEI_VERSIONS;
/** 每張命盤保存的版本（模組版本＋該盤所用 Profile 的版本） */
export type ZiweiChartVersions = { calendarVersion: string; ziweiProfileVersion: string } & Omit<ZiweiVersions, "calendarVersion">;
export const chartVersions = (profileVersion: string): ZiweiChartVersions => {
  const { calendarVersion, ...rest } = ZIWEI_VERSIONS;
  return { calendarVersion, ziweiProfileVersion: profileVersion, ...rest };
};
