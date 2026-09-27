/** 真太陽時：比較「記錄時間（民用標準時間）」與「實際排盤時間」，產生稽核快照與跨時辰／跨日警告。
 *  原始出生資料永遠是 Source of Truth；本模組的結果只供顯示、比較與偵測版本差異，不作為排盤輸入。 */
import type { BirthProfile, SolarTimeAudit } from "../person";
import { resolveBirth, fmtParts, type ResolvedTime } from "./resolve";

export const CALENDAR_VERSION = "3.0.0";
const BR = "子丑寅卯辰巳午未申酉戌亥";
const hourBranch = (h: number) => BR[Math.floor(((h + 1) % 24) / 2)];
const fmtOffset = (min: number) => `UTC${min >= 0 ? "+" : "−"}${Math.floor(Math.abs(min) / 60)}${Math.abs(min) % 60 ? `:${String(Math.abs(min) % 60).padStart(2, "0")}` : ""}`;

export interface SolarTimeView {
  standard: ResolvedTime;     // 關閉真太陽時校正
  trueSolar: ResolvedTime;    // 開啟真太陽時校正
  applied: ResolvedTime;      // 依此人物設定實際採用者
  crossesHourBoundary: boolean;
  crossesDate: boolean;
  correctionMinutes: number;  // 真太陽時相對記錄時間的總校正
}

/** 時辰不詳時回傳 null */
export function solarTimeView(b: BirthProfile): SolarTimeView | null {
  if (!b.localTime || !b.localDate) return null;
  const standard = resolveBirth({ ...b, useTrueSolarTime: false });
  const trueSolar = resolveBirth({ ...b, useTrueSolarTime: true });
  const s = standard.chartLocal, t = trueSolar.chartLocal;
  return {
    standard, trueSolar, applied: b.useTrueSolarTime ? trueSolar : standard,
    crossesHourBoundary: hourBranch(s.h) !== hourBranch(t.h),
    crossesDate: s.y !== t.y || s.m !== t.m || s.d !== t.d,
    correctionMinutes: trueSolar.corrections.totalFromCivil,
  };
}

export function computeSolarTimeAudit(b: BirthProfile, now: string): SolarTimeAudit | undefined {
  const v = solarTimeView(b);
  if (!v) return undefined;
  return {
    calendarVersion: CALENDAR_VERSION, computedAt: now,
    originalLocal: `${b.localDate} ${b.localTime}`, utcOffset: fmtOffset(v.applied.civil.offsetMinutes),
    useTrueSolarTime: b.useTrueSolarTime,
    correctionMinutes: v.applied.corrections.totalFromCivil,
    calculatedLocal: fmtParts(v.applied.chartLocal),
    standardHourBranch: hourBranch(v.standard.chartLocal.h), calculatedHourBranch: hourBranch(v.applied.chartLocal.h),
    crossesHourBoundary: b.useTrueSolarTime && v.crossesHourBoundary,
    crossesDate: b.useTrueSolarTime && v.crossesDate,
  };
}

/** 舊快照與目前版本重算不同時，列出差異（不沿用舊值） */
export function auditDifferences(stored: SolarTimeAudit | undefined, current: SolarTimeAudit | undefined): string[] {
  if (!stored || !current) return [];
  const keys: (keyof SolarTimeAudit)[] = ["originalLocal", "utcOffset", "useTrueSolarTime", "correctionMinutes", "calculatedLocal", "standardHourBranch", "calculatedHourBranch", "crossesHourBoundary", "crossesDate"];
  return keys.filter(k => stored[k] !== current[k]).map(k => `${k}：舊 ${String(stored[k])} → 目前 ${String(current[k])}（曆法 ${stored.calendarVersion} → ${current.calendarVersion}）`);
}
