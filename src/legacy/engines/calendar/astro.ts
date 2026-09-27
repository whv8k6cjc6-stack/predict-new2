/** 天文計算：太陽視黃經、節氣、新月（Meeus 低精度演算法，誤差約數分鐘）。
 *  曆日界線一律採 UTC+8（中國曆法標準時）。ΔT 以 69 秒常數近似。 */
const D2R = Math.PI / 180;
const DELTA_T_DAYS = 69 / 86400;

export function jdFromLocal(y: number, mo: number, d: number, h = 0, mi = 0): number {
  // 先算當日 0 時 UT 的 JD，再加時間；輸入視為 UTC+8 當地時間
  let yy = y, mm = mo;
  if (mm <= 2) { yy -= 1; mm += 12; }
  const A = Math.floor(yy / 100);
  const B = 2 - A + Math.floor(A / 4);
  const jd0 = Math.floor(365.25 * (yy + 4716)) + Math.floor(30.6001 * (mm + 1)) + d + B - 1524.5;
  return jd0 + (h + mi / 60 - 8) / 24; // 轉 UT
}

export function localDayNumber(jdUT: number): number {
  // 該 UT 時刻落在哪個 UTC+8 曆日（回傳當日正午 JDN）
  return Math.floor(jdUT + 8 / 24 + 0.5);
}

const norm = (x: number) => ((x % 360) + 360) % 360;

export function sunLongitude(jdUT: number): number {
  const T = (jdUT + DELTA_T_DAYS - 2451545) / 36525;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) * D2R;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M) +
    0.000289 * Math.sin(3 * M);
  const omega = (125.04 - 1934.136 * T) * D2R;
  return norm(L0 + C - 0.00569 - 0.00478 * Math.sin(omega));
}

const wrapDiff = (a: number) => { let d = norm(a); if (d > 180) d -= 360; return d; };

/** 求太陽到達指定黃經的 UT JD（牛頓迭代） */
export function solarTermJD(targetDeg: number, jdGuess: number): number {
  let jd = jdGuess;
  for (let i = 0; i < 25; i++) {
    const diff = wrapDiff(targetDeg - sunLongitude(jd));
    if (Math.abs(diff) < 1e-6) break;
    jd += diff / 0.98565;
  }
  return jd;
}

/** 24 節氣：index 0=立春(315°) 順序至 23=大寒(300°)，附概略日期作初始猜值 */
export const SOLAR_TERMS = [
  { name: "立春", deg: 315, m: 2, d: 4 }, { name: "雨水", deg: 330, m: 2, d: 19 },
  { name: "驚蟄", deg: 345, m: 3, d: 6 }, { name: "春分", deg: 0, m: 3, d: 20 },
  { name: "清明", deg: 15, m: 4, d: 5 }, { name: "穀雨", deg: 30, m: 4, d: 20 },
  { name: "立夏", deg: 45, m: 5, d: 5 }, { name: "小滿", deg: 60, m: 5, d: 21 },
  { name: "芒種", deg: 75, m: 6, d: 6 }, { name: "夏至", deg: 90, m: 6, d: 21 },
  { name: "小暑", deg: 105, m: 7, d: 7 }, { name: "大暑", deg: 120, m: 7, d: 23 },
  { name: "立秋", deg: 135, m: 8, d: 7 }, { name: "處暑", deg: 150, m: 8, d: 23 },
  { name: "白露", deg: 165, m: 9, d: 8 }, { name: "秋分", deg: 180, m: 9, d: 23 },
  { name: "寒露", deg: 195, m: 10, d: 8 }, { name: "霜降", deg: 210, m: 10, d: 23 },
  { name: "立冬", deg: 225, m: 11, d: 7 }, { name: "小雪", deg: 240, m: 11, d: 22 },
  { name: "大雪", deg: 255, m: 12, d: 7 }, { name: "冬至", deg: 270, m: 12, d: 22 },
  { name: "小寒", deg: 285, m: 1, d: 6 }, { name: "大寒", deg: 300, m: 1, d: 20 },
] as const;

export function termJDOfYear(year: number, termIdx: number): number {
  const t = SOLAR_TERMS[termIdx];
  return solarTermJD(t.deg, jdFromLocal(year, t.m, t.d, 12, 0));
}

/** 均時差（分鐘） */
export function equationOfTime(jdUT: number): number {
  const T = (jdUT - 2451545) / 36525;
  const eps = (23.43929 - 0.01300 * T) * D2R;
  const y = Math.tan(eps / 2) ** 2;
  const L0 = (280.46646 + 36000.76983 * T) * D2R;
  const e = 0.016708634 - 0.000042037 * T;
  const M = (357.52911 + 35999.05029 * T) * D2R;
  const E =
    y * Math.sin(2 * L0) - 2 * e * Math.sin(M) +
    4 * e * y * Math.sin(M) * Math.cos(2 * L0) -
    0.5 * y * y * Math.sin(4 * L0) - 1.25 * e * e * Math.sin(2 * M);
  return E * (1440 / (2 * Math.PI));
}

/** 第 k 個新月（自 2000-01-06 起算）之 UT JD */
export function newMoonJD(k: number): number {
  const T = k / 1236.85;
  let jde = 2451550.09766 + 29.530588861 * k
    + 0.00015437 * T * T - 0.00000015 * T ** 3 + 0.00000000073 * T ** 4;
  const E = 1 - 0.002516 * T - 0.0000074 * T * T;
  const M = (2.5534 + 29.1053567 * k - 0.0000014 * T * T) * D2R;
  const Mp = (201.5643 + 385.81693528 * k + 0.0107582 * T * T + 0.00001238 * T ** 3) * D2R;
  const F = (160.7108 + 390.67050284 * k - 0.0016118 * T * T - 0.00000227 * T ** 3) * D2R;
  const Om = (124.7746 - 1.56375588 * k + 0.0020672 * T * T) * D2R;
  jde +=
    -0.4072 * Math.sin(Mp) + 0.17241 * E * Math.sin(M) + 0.01608 * Math.sin(2 * Mp) +
    0.01039 * Math.sin(2 * F) + 0.00739 * E * Math.sin(Mp - M) - 0.00514 * E * Math.sin(Mp + M) +
    0.00208 * E * E * Math.sin(2 * M) - 0.00111 * Math.sin(Mp - 2 * F) - 0.00057 * Math.sin(Mp + 2 * F) +
    0.00056 * E * Math.sin(2 * Mp + M) - 0.00042 * Math.sin(3 * Mp) + 0.00042 * E * Math.sin(M + 2 * F) +
    0.00038 * E * Math.sin(M - 2 * F) - 0.00024 * E * Math.sin(2 * Mp - M) - 0.00017 * Math.sin(Om);
  return jde - DELTA_T_DAYS;
}
