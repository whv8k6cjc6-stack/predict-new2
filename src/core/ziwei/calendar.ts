/** ZiWeiCalendarEngine：紫微排盤所需的曆法資料。
 *  CalendarEngine（src/core/calendar）只提供時間與曆法能力；「幾點換日、何時換年」由本模組依 ZiweiRuleProfile 決定，
 *  與八字、奇門、梅花的日界／年界設定完全獨立。 */
import { gzFrom, type GanZhi } from "../calendar/ganzhi";
import { resolveBirth, fmtParts, type ResolvedTime } from "../calendar/resolve";
import { toLunar } from "../calendar/precise";
import type { BirthProfile } from "../person";
import type { LeapMonthRule, ZiweiRuleProfile } from "./profile";
import { BR, m12, type TraceStep } from "./common";

export interface ZiweiCalendar {
  resolved: ResolvedTime;
  ziweiDate: { y: number; m: number; d: number; shiftedByDayBoundary: boolean };
  lunar: { year: number; month: number; day: number; isLeap: boolean };
  effectiveMonth: number;
  hourBranch: number;
  yearStem: number; yearBranch: number; yearGz: GanZhi;
  notes: string[];
  trace: TraceStep[];
}

const LEAP_LABEL: Record<LeapMonthRule, string> = { splitAt15: "十五日前算本月、後算下月", asCurrent: "一律算本月", asNext: "一律算下月" };

export function effectiveLunarMonth(month: number, day: number, isLeap: boolean, rule: LeapMonthRule): number {
  if (!isLeap) return month;
  return rule === "asCurrent" ? month : rule === "asNext" ? (month % 12) + 1 : (day <= 15 ? month : (month % 12) + 1);
}

export const hourBranchOf = (h: number) => Math.floor(((h + 1) % 24) / 2);

export function ziweiCalendar(birth: BirthProfile, P: ZiweiRuleProfile): ZiweiCalendar {
  const resolved = resolveBirth(birth);
  if (!resolved.timeKnown) throw new Error("紫微斗數需要出生時辰");
  if (P.rules.ziweiYearBoundary.value !== "lunarNewYear") throw new Error(`尚未實作的紫微年界規則：${P.rules.ziweiYearBoundary.value}`);
  const L = resolved.chartLocal;
  const notes: string[] = [];
  const trace: TraceStep[] = [];
  trace.push({
    id: "cal.time", module: "ZiWeiCalendarEngine", title: "出生時間換算",
    inputs: { 記錄時間: `${birth.localDate} ${birth.localTime}`, 時區: birth.timeZone, 真太陽時校正: birth.useTrueSolarTime },
    formula: resolved.steps.join(" → "), result: `排盤時間 ${fmtParts(L)}（${L.basis === "trueSolar" ? "真太陽時" : "標準時間"}）`,
  });
  let base = new Date(Date.UTC(L.y, L.m - 1, L.d));
  const boundary = P.rules.dayBoundaryRule.value;
  const shifted = L.h === 23 && boundary === "23:00";
  if (shifted) { base = new Date(Date.UTC(L.y, L.m - 1, L.d + 1)); notes.push("生於子初，依設定以次日為紫微生日。"); }
  trace.push({
    id: "cal.dayBoundary", module: "ZiWeiCalendarEngine", title: "紫微日界",
    rule: { field: "dayBoundaryRule", label: P.rules.dayBoundaryRule.label },
    inputs: { 排盤時: L.h, 日界: boundary }, result: `紫微生日取 ${base.toISOString().slice(0, 10)}${shifted ? "（23 點後換日）" : ""}`,
  });
  const lu = toLunar(base.getUTCFullYear(), base.getUTCMonth() + 1, base.getUTCDate());
  const rule = P.rules.leapMonthRule.value;
  const effectiveMonth = effectiveLunarMonth(lu.month, lu.day, lu.isLeap, rule);
  if (lu.isLeap) notes.push(`生於閏${lu.month}月${lu.day}日，依「${LEAP_LABEL[rule]}」以${effectiveMonth}月安星。`);
  trace.push({
    id: "cal.lunar", module: "ZiWeiCalendarEngine", title: "國曆轉農曆與閏月",
    rule: { field: "leapMonthRule", label: P.rules.leapMonthRule.label },
    inputs: { 國曆: base.toISOString().slice(0, 10) }, result: `農曆${lu.year}年${lu.isLeap ? "閏" : ""}${lu.month}月${lu.day}日；安星月份 ${effectiveMonth}`,
  });
  const hourBranch = hourBranchOf(L.h);
  const yearStem = (((lu.year - 4) % 10) + 10) % 10;
  const yearBranch = m12(lu.year - 4);
  const yearGz = gzFrom(yearStem, yearBranch);
  trace.push({
    id: "cal.yearHour", module: "ZiWeiCalendarEngine", title: "年干支與時辰",
    rule: { field: "ziweiYearBoundary", label: P.rules.ziweiYearBoundary.label },
    inputs: { 農曆年: lu.year, 排盤時: L.h }, formula: "年干＝(農曆年−4) mod 10；年支＝(農曆年−4) mod 12；時支＝⌊((時+1) mod 24)/2⌋",
    result: `${yearGz.text}年，${BR[hourBranch]}時`,
  });
  return {
    resolved, ziweiDate: { y: base.getUTCFullYear(), m: base.getUTCMonth() + 1, d: base.getUTCDate(), shiftedByDayBoundary: shifted },
    lunar: { year: lu.year, month: lu.month, day: lu.day, isLeap: lu.isLeap }, effectiveMonth,
    hourBranch, yearStem, yearBranch, yearGz, notes, trace,
  };
}
