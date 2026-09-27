/** 天文計算（Meeus《Astronomical Algorithms》）：太陽視黃經、節氣時刻、新月、均時差、ΔT。
 *  所有時刻以儒略日（UT）表示，與任何時區無關。 */
const D2R = Math.PI / 180;
const norm = (x: number) => ((x % 360) + 360) % 360;

export const jdFromUtcMs = (ms: number) => ms / 86_400_000 + 2440587.5;
export const utcMsFromJd = (jd: number) => (jd - 2440587.5) * 86_400_000;

/** ΔT（TT − UT，秒）：Espenak & Meeus 多項式，1900–2150 */
export function deltaT(year: number): number {
  const y = year;
  if (y < 1920) { const t = y - 1900; return -2.79 + 1.494119 * t - 0.0598939 * t ** 2 + 0.0061966 * t ** 3 - 0.000197 * t ** 4; }
  if (y < 1941) { const t = y - 1920; return 21.20 + 0.84493 * t - 0.076100 * t ** 2 + 0.0020936 * t ** 3; }
  if (y < 1961) { const t = y - 1950; return 29.07 + 0.407 * t - t ** 2 / 233 + t ** 3 / 2547; }
  if (y < 1986) { const t = y - 1975; return 45.45 + 1.067 * t - t ** 2 / 260 - t ** 3 / 718; }
  if (y < 2005) { const t = y - 2000; return 63.86 + 0.3345 * t - 0.060374 * t ** 2 + 0.0017275 * t ** 3 + 0.000651814 * t ** 4 + 0.00002373599 * t ** 5; }
  if (y < 2050) { const t = y - 2000; return 62.92 + 0.32217 * t + 0.005589 * t ** 2; }
  return -20 + 32 * ((y - 1820) / 100) ** 2 - 0.5628 * (2150 - y);
}
const dtDays = (jdUT: number) => deltaT(2000 + (jdUT - 2451545) / 365.25) / 86400;

/** 太陽視黃經（度），含章動與光行差 */
export function sunLongitude(jdUT: number): number {
  const T = (jdUT + dtDays(jdUT) - 2451545) / 36525;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) * D2R;
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M)
    + (0.019993 - 0.000101 * T) * Math.sin(2 * M) + 0.000289 * Math.sin(3 * M);
  const omega = (125.04 - 1934.136 * T) * D2R;
  return norm(L0 + C - 0.00569 - 0.00478 * Math.sin(omega));
}

const wrapDiff = (a: number) => { let d = norm(a); if (d > 180) d -= 360; return d; };

/** 太陽到達指定黃經的時刻（UT JD），以牛頓法自 guess 起算 */
export function solarLongitudeJD(targetDeg: number, jdGuess: number): number {
  let jd = jdGuess;
  for (let i = 0; i < 30; i++) {
    const diff = wrapDiff(targetDeg - sunLongitude(jd));
    if (Math.abs(diff) < 1e-7) break;
    jd += diff / 0.98565;
  }
  return jd;
}

/** 24 節氣，index 0＝立春（315°），依序每 15°；偶數 index 為「節」、奇數為「中氣」 */
export const SOLAR_TERMS = [
  "立春", "雨水", "驚蟄", "春分", "清明", "穀雨", "立夏", "小滿", "芒種", "夏至", "小暑", "大暑",
  "立秋", "處暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至", "小寒", "大寒",
] as const;
export const termDeg = (i: number) => norm(315 + i * 15);

/** 某時刻前後最近的「節」（月柱分界）：回傳前一個節與下一個節的 index 與時刻 */
export function surroundingJie(jdUT: number) {
  const lon = sunLongitude(jdUT);
  const k = Math.floor(norm(lon - 315) / 30);         // 已過第 k 個節（0＝立春）
  const prevIdx = k * 2, nextIdx = ((k + 1) % 12) * 2;
  const prev = solarLongitudeJD(termDeg(prevIdx), jdUT - norm(lon - termDeg(prevIdx)) / 0.98565);
  const next = solarLongitudeJD(termDeg(nextIdx), jdUT + norm(termDeg(nextIdx) - lon) / 0.98565);
  return { monthIndex: k, prev: { idx: prevIdx, name: SOLAR_TERMS[prevIdx], jd: prev }, next: { idx: nextIdx, name: SOLAR_TERMS[nextIdx], jd: next } };
}

/** 某時刻所在的節氣（含中氣） */
export function currentTerm(jdUT: number) {
  const lon = sunLongitude(jdUT);
  const i = Math.floor(norm(lon - 315) / 15);
  return { idx: i, name: SOLAR_TERMS[i] };
}

/** 某年（西元）某節氣的時刻（UT JD） */
export function termJD(year: number, idx: number): number {
  // 立春約在 2/4；以 idx 推估日期作為初值
  const guess = jdFromUtcMs(Date.UTC(year, 1, 4)) + idx * 15.2184;
  return solarLongitudeJD(termDeg(idx), guess);
}

/** 均時差（分鐘）：真太陽時 − 平太陽時 */
export function equationOfTime(jdUT: number): number {
  const T = (jdUT - 2451545) / 36525;
  const eps = (23.43929 - 0.01300 * T) * D2R;
  const y = Math.tan(eps / 2) ** 2;
  const L0 = (280.46646 + 36000.76983 * T) * D2R;
  const e = 0.016708634 - 0.000042037 * T;
  const M = (357.52911 + 35999.05029 * T) * D2R;
  const E = y * Math.sin(2 * L0) - 2 * e * Math.sin(M) + 4 * e * y * Math.sin(M) * Math.cos(2 * L0)
    - 0.5 * y * y * Math.sin(4 * L0) - 1.25 * e * e * Math.sin(2 * M);
  return E * (1440 / (2 * Math.PI));
}

/** 第 k 個新月（k=0 約 2000-01-06）的時刻（UT JD），Meeus 第 49 章 */
export function newMoonJD(k: number): number {
  const T = k / 1236.85;
  let jde = 2451550.09766 + 29.530588861 * k + 0.00015437 * T * T - 0.00000015 * T ** 3 + 0.00000000073 * T ** 4;
  const E = 1 - 0.002516 * T - 0.0000074 * T * T;
  const M = (2.5534 + 29.1053567 * k - 0.0000014 * T * T) * D2R;
  const Mp = (201.5643 + 385.81693528 * k + 0.0107582 * T * T + 0.00001238 * T ** 3) * D2R;
  const F = (160.7108 + 390.67050284 * k - 0.0016118 * T * T - 0.00000227 * T ** 3) * D2R;
  const Om = (124.7746 - 1.56375588 * k + 0.0020672 * T * T) * D2R;
  jde += -0.4072 * Math.sin(Mp) + 0.17241 * E * Math.sin(M) + 0.01608 * Math.sin(2 * Mp)
    + 0.01039 * Math.sin(2 * F) + 0.00739 * E * Math.sin(Mp - M) - 0.00514 * E * Math.sin(Mp + M)
    + 0.00208 * E * E * Math.sin(2 * M) - 0.00111 * Math.sin(Mp - 2 * F) - 0.00057 * Math.sin(Mp + 2 * F)
    + 0.00056 * E * Math.sin(2 * Mp + M) - 0.00042 * Math.sin(3 * Mp) + 0.00042 * E * Math.sin(M + 2 * F)
    + 0.00038 * E * Math.sin(M - 2 * F) - 0.00024 * E * Math.sin(2 * Mp - M) - 0.00017 * Math.sin(Om);
  // 行星攝動修正項
  const A = [
    299.77 + 0.107408 * k - 0.009173 * T * T, 251.88 + 0.016321 * k, 251.83 + 26.651886 * k, 349.42 + 36.412478 * k,
    84.66 + 18.206239 * k, 141.74 + 53.303771 * k, 207.14 + 2.453732 * k, 154.84 + 7.306860 * k, 34.52 + 27.261239 * k,
    207.19 + 0.121824 * k, 291.34 + 1.844379 * k, 161.72 + 24.198154 * k, 239.56 + 25.513099 * k, 331.55 + 3.592518 * k,
  ];
  const coef = [0.000325, 0.000165, 0.000164, 0.000126, 0.000110, 0.000062, 0.000060, 0.000056, 0.000047, 0.000042, 0.000040, 0.000037, 0.000035, 0.000023];
  for (let i = 0; i < 14; i++) jde += coef[i] * Math.sin(A[i] * D2R);
  return jde - deltaT(2000 + k / 12.3685) / 86400;
}
