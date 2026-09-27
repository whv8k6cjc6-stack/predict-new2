declare module "lunar-javascript" {
  // 僅宣告本專案使用到的 API（lunar-javascript 1.7.7 無官方型別）
  export const ShouXingUtil: { qiAccurate2(jdFromJ2000Beijing: number): number };
  export interface SolarObj { getYear(): number; getMonth(): number; getDay(): number; getHour(): number; getMinute(): number; getSecond(): number; getLunar(): LunarObj }
  export interface LunarObj {
    getYear(): number; getMonth(): number; getDay(): number; getSolar(): SolarObj;
    getYearInGanZhiExact(): string;
  }
  export const Solar: { fromYmd(y: number, m: number, d: number): SolarObj; fromYmdHms(y: number, m: number, d: number, h: number, mi: number, s: number): SolarObj };
  export const Lunar: { fromYmd(y: number, m: number, d: number): LunarObj };
  export const LunarYear: { fromYear(y: number): { getLeapMonth(): number } };
}
