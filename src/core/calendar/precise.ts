/** 高精度天文時刻與農曆換算（採壽星天文曆演算法，由 lunar-javascript 1.7.7 提供）。
 *  本檔只取用「天文時刻」與「農曆日期」兩類基礎資料；干支、換日、時區、真太陽時等排盤規則皆由本系統實作。 */
import { ShouXingUtil, Solar, Lunar, LunarYear } from "lunar-javascript";
import { jdFromUtcMs, SOLAR_TERMS, sunLongitude, termDeg } from "./astro";

export const PRECISE_SOURCE = "壽星天文曆（lunar-javascript 1.7.7）";
const J2000 = 2451545;
const BJ = 8 / 24;

/** 取得最接近 approxJdUT 的節氣精確時刻（UT JD）；approx 需在目標節氣 ±5 日內 */
export function preciseTermNear(approxJdUT: number): number {
  return ShouXingUtil.qiAccurate2(approxJdUT - J2000 + BJ) + J2000 - BJ;
}

const norm = (x: number) => ((x % 360) + 360) % 360;

/** 某西元年第 idx 個節氣（0＝立春）的精確時刻（UT JD） */
export function preciseTermJD(year: number, idx: number): number {
  const approx = jdFromUtcMs(Date.UTC(year, 1, 4)) + idx * 15.2184;
  // 以低精度太陽黃經微調初值，再交由高精度演算法定位
  const lon = sunLongitude(approx);
  const delta = ((termDeg(idx) - lon + 540) % 360) - 180;
  return preciseTermNear(approx + delta / 0.98565);
}

/** 某時刻所在節氣月：前一個「節」與下一個「節」（精確時刻） */
export function jieBoundaries(jdUT: number) {
  const lon = sunLongitude(jdUT);
  let k = Math.floor(norm(lon - 315) / 30);              // 低精度估計：已過第 k 個節（0＝立春）
  const at = (kk: number) => {
    const idx = (((kk % 12) + 12) % 12) * 2;
    const approx = jdUT + (((termDeg(idx) - lon + 540) % 360) - 180) / 0.98565;
    return { idx, name: SOLAR_TERMS[idx], jd: preciseTermNear(approx) };
  };
  let prev = at(k), next = at(k + 1);
  // 交節時刻附近以精確值校正
  if (jdUT < prev.jd) { k -= 1; next = prev; prev = at(k); }
  else if (jdUT >= next.jd) { k += 1; prev = next; next = at(k + 1); }
  return { monthIndex: ((k % 12) + 12) % 12, prev, next };
}

export interface LunarDateInfo { year: number; month: number; day: number; isLeap: boolean; yearGanZhi: string }

/** 國曆日期 → 農曆日期（中國曆法，以 UTC+8 定日） */
export function toLunar(y: number, m: number, d: number): LunarDateInfo {
  const l = Solar.fromYmd(y, m, d).getLunar();
  const mo = l.getMonth();
  return { year: l.getYear(), month: Math.abs(mo), day: l.getDay(), isLeap: mo < 0, yearGanZhi: l.getYearInGanZhiExact() };
}

/** 農曆日期 → 國曆日期；閏月不存在時丟出錯誤 */
export function fromLunar(y: number, m: number, d: number, isLeap: boolean): { y: number; m: number; d: number } {
  if (isLeap && LunarYear.fromYear(y).getLeapMonth() !== m) throw new Error(`農曆 ${y} 年沒有閏${m}月`);
  const s = Lunar.fromYmd(y, isLeap ? -m : m, d).getSolar();
  return { y: s.getYear(), m: s.getMonth(), d: s.getDay() };
}

export const leapMonthOf = (lunarYear: number) => LunarYear.fromYear(lunarYear).getLeapMonth();
