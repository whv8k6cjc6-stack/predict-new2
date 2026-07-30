/** 農曆轉換：以天文新月與中氣判閏（無資料表，1900–2100 適用）。
 *  限制：新月或節氣極接近午夜（UTC+8）時可能誤差一日，重要日期請對照萬年曆。 */
import { jdFromLocal, localDayNumber, newMoonJD, solarTermJD } from "./astro";

function winterSolsticeJD(year: number): number {
  return solarTermJD(270, jdFromLocal(year, 12, 21, 12));
}
/** 回傳 jd（UT）之前最近一次新月的 k 與其 UTC+8 曆日序號 */
function newMoonBefore(jdUT: number): { k: number; day: number } {
  let k = Math.floor((jdUT - 2451550.09766) / 29.530588861);
  while (newMoonJD(k + 1) <= jdUT) k++;
  while (newMoonJD(k) > jdUT) k--;
  return { k, day: localDayNumber(newMoonJD(k)) };
}

export interface LunarDate { year: number; month: number; day: number; isLeap: boolean }

/** 含冬至之月（朔日 ≤ 冬至日）；朔落在冬至時刻後 12 小時內但已跨 UTC+8 曆日時需回退一月 */
function moonContainingSolstice(ws: number): { k: number; day: number } {
  const wsDay = localDayNumber(ws);
  let moon = newMoonBefore(ws + 0.5);
  if (wsDay < dnOfMoonStart(moon.k)) moon = { k: moon.k - 1, day: dnOfMoonStart(moon.k - 1) };
  return moon;
}

export function lunarDate(y: number, m: number, d: number): LunarDate {
  const jd = jdFromLocal(y, m, d, 12);
  const dn = localDayNumber(jd);
  // 找含本日之朔
  const cur = newMoonBefore(jd + 0.5);
  // 取本日所屬「歲」：前一個冬至所在月為 11 月
  let wsYear = y;
  let wsMoon = moonContainingSolstice(winterSolsticeJD(wsYear));
  if (cur.day < wsMoon.day) { // 本日在去年冬至月之前 → 用前一年冬至
    wsYear = y - 1;
    wsMoon = moonContainingSolstice(winterSolsticeJD(wsYear));
  }
  // 下一個冬至，界定本歲共幾個朔望月
  const ws2Moon = moonContainingSolstice(winterSolsticeJD(wsYear + 1));
  const monthsInSui = ws2Moon.k - wsMoon.k; // 12 或 13
  // 閏月：歲內第一個無中氣之月（k 為朔望月序號，2000 年前為負值，不可用 -1 當哨兵）
  let leapK: number | null = null;
  if (monthsInSui === 13) {
    for (let k = wsMoon.k + 1; k <= ws2Moon.k; k++) {
      const start = dnOfMoonStart(k), end = dnOfMoonStart(k + 1);
      if (!hasZhongQi(start, end)) { leapK = k; break; }
    }
  }
  // 月序：冬至月 = 11
  const offset = cur.k - wsMoon.k; // 0 = 冬至月
  let isLeap = false;
  let monthNum: number;
  let effOffset = offset;
  if (leapK !== null && cur.k === leapK) { isLeap = true; effOffset = offset - 1; }
  else if (leapK !== null && cur.k > leapK) effOffset = offset - 1;
  monthNum = ((11 - 1 + effOffset) % 12) + 1;
  const day = dn - cur.day + 1;
  // 農曆年：正月初一所屬年份近似（顯示用）
  const lunarYear = monthNum >= 11 && m <= 6 ? y - 1 : monthNum >= 11 && m >= 11 ? y : (m <= 2 && monthNum >= 11) ? y - 1 : y;
  return { year: lunarYear, month: monthNum, day, isLeap };
}

const moonStartCache = new Map<number, number>();
function dnOfMoonStart(k: number): number {
  if (!moonStartCache.has(k)) moonStartCache.set(k, localDayNumber(newMoonJD(k)));
  return moonStartCache.get(k)!;
}

/** 該朔望月（曆日 start ≤ d < end）內是否含中氣（黃經 30° 倍數且為中氣者） */
function hasZhongQi(startDn: number, endDn: number): boolean {
  // 中氣黃經：300 大寒,330 雨水,0 春分,30 穀雨,60 小滿,90 夏至,120 大暑,150 處暑,180 秋分,210 霜降,240 小雪,270 冬至
  const degs = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
  // 以月中為猜值逐一檢查
  const midJd = startDn + (endDn - startDn) / 2 - 8 / 24 - 0.5;
  for (const deg of degs) {
    const t = solarTermJD(deg, midJd);
    const dn = localDayNumber(t);
    if (dn >= startDn && dn < endDn) return true;
  }
  return false;
}
