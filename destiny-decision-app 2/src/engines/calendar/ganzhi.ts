/** 干支模組。日柱錨點已以兩個獨立已知日期驗證（見 src/tests/calendar.test.ts）。 */
import { jdFromLocal, localDayNumber, sunLongitude, termJDOfYear, equationOfTime } from "./astro";

export const STEMS = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"] as const;
export const BRANCHES = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"] as const;
export type Stem = (typeof STEMS)[number];
export type Branch = (typeof BRANCHES)[number];

export interface GanZhi { stem: Stem; branch: Branch; index: number; text: string }

export function ganzhiFromIndex(index: number): GanZhi {
  const i = ((index % 60) + 60) % 60;
  return { stem: STEMS[i % 10], branch: BRANCHES[i % 12], index: i, text: STEMS[i % 10] + BRANCHES[i % 12] };
}

export function julianDayNumber(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12), yy = y + 4800 - a, mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4)
    - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}

/** 日柱：(JDN + 49) mod 60。錨點驗證：1949-10-01 甲子、2000-01-01 戊午。 */
export function dayPillar(y: number, m: number, d: number): GanZhi {
  return ganzhiFromIndex(julianDayNumber(y, m, d) + 49);
}

export function hourBranchIndex(h: number): number { return Math.floor(((h + 1) % 24) / 2); }

/** 時柱（五鼠遁） */
export function hourPillar(dayStemIdx: number, hbIdx: number): GanZhi {
  return hourPillarRaw(dayStemIdx, hbIdx);
}
function hourPillarRaw(dayStemIdx: number, hbIdx: number): GanZhi {
  const stem = ((dayStemIdx % 5) * 2 + hbIdx) % 10;
  // 求同時滿足 stem 與 branch 的 60 甲子 index
  for (let i = 0; i < 60; i++) if (i % 10 === stem && i % 12 === hbIdx) return ganzhiFromIndex(i);
  return ganzhiFromIndex(0);
}

function gzOf(stemIdx: number, branchIdx: number): GanZhi {
  for (let i = 0; i < 60; i++) if (i % 10 === stemIdx && i % 12 === branchIdx) return ganzhiFromIndex(i);
  return ganzhiFromIndex(0);
}

/** 年柱：以立春為界 */
export function yearPillar(y: number, m: number, d: number, h: number): GanZhi {
  const jd = jdFromLocal(y, m, d, h);
  const lichun = termJDOfYear(y, 0);
  const eff = jd >= lichun ? y : y - 1;
  return gzOf(((eff - 4) % 10 + 10) % 10, ((eff - 4) % 12 + 12) % 12);
}

/** 月柱：以節為界（太陽黃經），月干由五虎遁 */
export function monthPillar(y: number, m: number, d: number, h: number, yearStemIdx: number): GanZhi {
  const lon = sunLongitude(jdFromLocal(y, m, d, h));
  const mi = Math.floor((((lon - 315) % 360) + 360) % 360 / 30); // 0=寅月
  const stem = (((yearStemIdx % 5) * 2 + 2) + mi) % 10;
  return gzOf(stem, (2 + mi) % 12);
}

export interface FourPillars { year: GanZhi; month: GanZhi; day: GanZhi; hour: GanZhi | null }

/** 排四柱。trueSolarLng：提供經度則做真太陽時校正。ziRule：晚子時(預設)/早子時。 */
export function fourPillars(
  y: number, m: number, d: number, hm: string | null,
  opts: { longitude?: number; ziRule?: "lateZi" | "earlyZi" } = {},
): FourPillars {
  let h = 12, mi = 0;
  let hasTime = false;
  if (hm) { const [a, b] = hm.split(":").map(Number); h = a; mi = b || 0; hasTime = true; }
  if (hasTime && opts.longitude !== undefined) {
    const jd = jdFromLocal(y, m, d, h, mi);
    const offMin = (opts.longitude - 120) * 4 + equationOfTime(jd);
    const t = new Date(Date.UTC(y, m - 1, d, h, mi));
    t.setUTCMinutes(t.getUTCMinutes() + Math.round(offMin));
    y = t.getUTCFullYear(); m = t.getUTCMonth() + 1; d = t.getUTCDate(); h = t.getUTCHours(); mi = t.getUTCMinutes();
  }
  // 早子時：23 時起換日柱
  let dy = y, dm = m, dd = d;
  if (hasTime && h === 23 && (opts.ziRule ?? "lateZi") === "earlyZi") {
    const t = new Date(Date.UTC(y, m - 1, d)); t.setUTCDate(t.getUTCDate() + 1);
    dy = t.getUTCFullYear(); dm = t.getUTCMonth() + 1; dd = t.getUTCDate();
  }
  const hf = h + mi / 60; // 分鐘精度，供交節判斷
  const yp = yearPillar(y, m, d, hf);
  const mp = monthPillar(y, m, d, hf, yp.index % 10);
  const dp = dayPillar(dy, dm, dd);
  const hp = hasTime ? hourPillarRaw(dp.index % 10, hourBranchIndex(h)) : null;
  return { year: yp, month: mp, day: dp, hour: hp };
}

export { jdFromLocal, localDayNumber, termJDOfYear };
