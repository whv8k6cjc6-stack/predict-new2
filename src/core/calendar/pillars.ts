/** 四柱推算（本系統規則）：
 *  - 年柱：以「立春」精確時刻分年（絕對時刻比對，與出生地時區無關）
 *  - 月柱：以「節」精確時刻分月，月干以五虎遁
 *  - 日柱：以排盤用當地時間（標準時或真太陽時）的日期；子時換日依流派設定
 *  - 時柱：五鼠遁；23 時（子初）起的時干一律依「次日」日干推（夜子時論法），
 *          日柱是否換日則依設定：晚子時不換日（lateZiSameDay）或子初換日（earlyZiNextDay） */
import { dayGz, gz, hourBranch, hourGz, monthGz, yearGz, type GanZhi } from "./ganzhi";
import { jieBoundaries, preciseTermJD } from "./precise";
import { utcMsFromJd } from "./astro";
import type { ResolvedTime } from "./resolve";

export type ZiRule = "lateZiSameDay" | "earlyZiNextDay";

export interface FourPillars {
  year: GanZhi; month: GanZhi; day: GanZhi; hour: GanZhi | null;
  monthIndex: number;                // 0＝寅月
  jie: { prev: { name: string; instantMs: number }; next: { name: string; instantMs: number } };
  minutesFromJie: number;            // 距最近一個節的分鐘數（交節附近月柱需留意）
  lichunInstantMs: number;
  dayDate: { y: number; m: number; d: number };   // 日柱所依的日期
  notes: string[];
}

const addDays = (p: { y: number; m: number; d: number }, n: number) => {
  const t = new Date(Date.UTC(p.y, p.m - 1, p.d + n));
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() };
};

export function fourPillars(r: ResolvedTime, ziRule: ZiRule): FourPillars {
  const notes: string[] = [];
  // 年柱：與當年（依 UT 年份）立春比較
  const utcYear = new Date(r.instantMs).getUTCFullYear();
  const lichun = preciseTermJD(utcYear, 0);
  const lichunMs = utcMsFromJd(lichun);
  const yearNo = r.jdUT >= lichun ? utcYear : utcYear - 1;
  const year = yearGz(yearNo);

  // 月柱：以精確節氣定月
  const jb = jieBoundaries(r.jdUT);
  const month = monthGz(year.stem, jb.monthIndex);
  const prevMs = utcMsFromJd(jb.prev.jd), nextMs = utcMsFromJd(jb.next.jd);
  const minutesFromJie = Math.round(Math.min(Math.abs(r.instantMs - prevMs), Math.abs(nextMs - r.instantMs)) / 60_000);
  if (minutesFromJie < 120) notes.push(`出生時刻距「${Math.abs(r.instantMs - prevMs) < Math.abs(nextMs - r.instantMs) ? jb.prev.name : jb.next.name}」僅 ${minutesFromJie} 分鐘，月柱${jb.monthIndex === 0 || jb.monthIndex === 11 ? "與年柱" : ""}對出生時間的準確度很敏感。`);

  // 日柱、時柱：依排盤用當地時間
  const L = r.chartLocal;
  let dayDate = { y: L.y, m: L.m, d: L.d };
  const isZiInit = L.h === 23;
  if (isZiInit && ziRule === "earlyZiNextDay") { dayDate = addDays(dayDate, 1); notes.push("生於子初（23 時後），依「子初換日」日柱算次日。"); }
  if (isZiInit && ziRule === "lateZiSameDay") notes.push("生於晚子時（23 時後），依「晚子時不換日」日柱仍算當日，時干依次日推。");
  const day = dayGz(dayDate.y, dayDate.m, dayDate.d);
  let hour: GanZhi | null = null;
  if (r.timeKnown) {
    const hb = hourBranch(L.h);
    const stemBase = isZiInit ? dayGz(...Object.values(addDays({ y: L.y, m: L.m, d: L.d }, 1)) as [number, number, number]).stem : day.stem;
    hour = hourGz(stemBase, hb);
    const minuteInHour = (L.h % 2 === 1 ? 0 : 60) + L.mi;       // 距時辰起點分鐘
    if (minuteInHour < 10 || minuteInHour > 110) notes.push("出生時間接近時辰交界，時柱對出生時間的準確度很敏感。");
  }
  return {
    year, month, day, hour, monthIndex: jb.monthIndex,
    jie: { prev: { name: jb.prev.name, instantMs: prevMs }, next: { name: jb.next.name, instantMs: nextMs } },
    minutesFromJie, lichunInstantMs: lichunMs, dayDate, notes,
  };
}

/** 流年、流月、流日、流時干支（分析時點，以標準時間） */
export function flowPillars(r: ResolvedTime) {
  const p = fourPillars({ ...r, timeKnown: true }, "earlyZiNextDay");
  return { year: p.year, month: p.month, day: p.day, hour: p.hour!, monthIndex: p.monthIndex, jie: p.jie };
}

export { gz };
