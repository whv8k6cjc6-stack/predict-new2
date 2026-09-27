/** 時刻解析：把「當地民用時間＋時區」換算成
 *  ① 絕對時刻（UTC，用於與節氣比對 → 年柱、月柱、大運）
 *  ② 排盤用當地時間（標準時或真太陽時，用於 → 日柱、時柱、紫微生日生時） */
import { localOffset } from "./tz";
import { equationOfTime, jdFromUtcMs } from "./astro";
import { fromLunar } from "./precise";
import type { BirthProfile } from "../person";

export interface LocalParts { y: number; m: number; d: number; h: number; mi: number }

export interface ResolvedTime {
  instantMs: number;
  jdUT: number;
  civil: { date: string; time: string; timeZone: string; offsetMinutes: number; isDST: boolean; dstSource: "tzdb" | "override" };
  standardOffsetMinutes: number;
  chartLocal: LocalParts & { basis: "trueSolar" | "standard" };
  corrections: { dstMinutes: number; longitudeMinutes: number; eotMinutes: number; totalFromCivil: number };
  timeKnown: boolean;
  steps: string[];      // 換算步驟（供專業模式與證據鏈顯示）
}

const partsOf = (ms: number): LocalParts => {
  const t = new Date(ms);
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate(), h: t.getUTCHours(), mi: t.getUTCMinutes() };
};
const pad = (n: number) => String(n).padStart(2, "0");
export const fmtParts = (p: LocalParts) => `${p.y}-${pad(p.m)}-${pad(p.d)} ${pad(p.h)}:${pad(p.mi)}`;

export function resolveCivil(opts: {
  date: string; time: string | null; timeZone: string; dstOverride?: "auto" | "on" | "off";
  trueSolar?: { longitude: number } | null;
}): ResolvedTime {
  const timeKnown = !!opts.time;
  const time = opts.time ?? "12:00";
  const [y, m, d] = opts.date.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  const off = localOffset(opts.date, time, opts.timeZone);
  let offsetMinutes = off.offsetMinutes, isDST = off.isDST, dstSource: "tzdb" | "override" = "tzdb";
  if (opts.dstOverride === "on") { offsetMinutes = off.standardMinutes + 60; isDST = true; dstSource = "override"; }
  if (opts.dstOverride === "off") { offsetMinutes = off.standardMinutes; isDST = false; dstSource = "override"; }
  const instantMs = Date.UTC(y, m - 1, d, h, mi) - offsetMinutes * 60_000;
  const jdUT = jdFromUtcMs(instantMs);
  const steps: string[] = [`當地民用時間 ${opts.date} ${time}（${opts.timeZone}，UTC${offsetMinutes >= 0 ? "+" : ""}${offsetMinutes / 60}${isDST ? "，夏令時間" : ""}）`];
  const dstMinutes = isDST ? -(offsetMinutes - off.standardMinutes) : 0;
  if (isDST) steps.push(`扣除夏令時間 ${-dstMinutes} 分鐘，還原為標準時間`);

  let chartMs: number, basis: "trueSolar" | "standard", longitudeMinutes = 0, eotMinutes = 0;
  if (opts.trueSolar && timeKnown) {
    longitudeMinutes = opts.trueSolar.longitude * 4 - off.standardMinutes;
    eotMinutes = equationOfTime(jdUT);
    chartMs = instantMs + (off.standardMinutes + longitudeMinutes + eotMinutes) * 60_000;
    basis = "trueSolar";
    steps.push(`經度 ${opts.trueSolar.longitude}° 修正 ${longitudeMinutes >= 0 ? "+" : ""}${longitudeMinutes.toFixed(1)} 分（地方平太陽時）`);
    steps.push(`均時差 ${eotMinutes >= 0 ? "+" : ""}${eotMinutes.toFixed(1)} 分 → 真太陽時`);
  } else {
    chartMs = instantMs + off.standardMinutes * 60_000;
    basis = "standard";
  }
  const chartLocal = { ...partsOf(chartMs), basis };
  steps.push(`排盤時間 ${fmtParts(chartLocal)}（${basis === "trueSolar" ? "真太陽時" : "標準時間"}）`);
  const totalFromCivil = Math.round((chartMs - (instantMs + offsetMinutes * 60_000)) / 60_000);
  return {
    instantMs, jdUT,
    civil: { date: opts.date, time, timeZone: opts.timeZone, offsetMinutes, isDST, dstSource },
    standardOffsetMinutes: off.standardMinutes,
    chartLocal, corrections: { dstMinutes, longitudeMinutes, eotMinutes, totalFromCivil }, timeKnown, steps,
  };
}

/** 出生資料 → 時刻解析（含農曆輸入換算） */
export function resolveBirth(b: BirthProfile): ResolvedTime {
  let date = b.localDate;
  const pre: string[] = [];
  if (b.inputCalendar === "lunar" && b.lunarInput) {
    const s = fromLunar(b.lunarInput.year, b.lunarInput.month, b.lunarInput.day, b.lunarInput.isLeap);
    date = `${s.y}-${pad(s.m)}-${pad(s.d)}`;
    pre.push(`農曆 ${b.lunarInput.year} 年${b.lunarInput.isLeap ? "閏" : ""}${b.lunarInput.month} 月 ${b.lunarInput.day} 日 → 國曆 ${date}`);
  }
  const r = resolveCivil({
    date, time: b.localTime, timeZone: b.timeZone, dstOverride: b.dstOverride,
    trueSolar: b.useTrueSolarTime ? { longitude: b.place.lng } : null,
  });
  r.steps.unshift(...pre);
  return r;
}
