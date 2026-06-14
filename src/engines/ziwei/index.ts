/** 紫微斗數引擎（中州派安星基準：14 主星＋常用輔煞＋火鈴＋生年/流年四化＋大限）。
 *  安星已逐項對照標準口訣驗證（見 src/tests/ziwei.test.ts）；
 *  火鈴採《全書》通行起例、庚干四化採常見一派（太陰科天同忌），二者學派有別，已於頁面標註。 */
import { STEMS, BRANCHES, ganzhiFromIndex } from "../calendar/ganzhi";
import { lunarDate } from "../calendar/lunar";
import type { Profile } from "@/types/profile";

export const PALACE_NAMES = ["命宮","兄弟","夫妻","子女","財帛","疾厄","遷移","交友","官祿","田宅","福德","父母"];

const NAYIN_SEQ: ("金"|"木"|"水"|"火"|"土")[] = [
  "金","火","木","土","金","火","水","土","金","木",
  "水","土","火","木","水","金","火","木","土","金",
  "火","水","土","金","木","水","土","火","木","水",
]; // 甲子乙丑→海中金 … 壬戌癸亥→大海水
const JU_OF: Record<string, number> = { 水:2, 木:3, 金:4, 土:5, 火:6 };

export interface ZiweiChart {
  lunar: { month: number; day: number; isLeap: boolean };
  mingGong: number; shenGong: number;     // 地支 index（子=0）
  ju: number; juElement: string;
  stars: Record<number, string[]>;        // 宮支 index → 星名
  sihua: Record<"祿"|"權"|"科"|"忌", string>; // 生年四化
  palaceOf: (starOrName: string) => number | null;
  palaceNames: Record<number, string>;    // 宮支 index → 宮名
  daxian: { palace: number; range: [number, number] }[];
}

const SIHUA_TABLE: Record<string, [string,string,string,string]> = {
  甲:["廉貞","破軍","武曲","太陽"], 乙:["天機","天梁","紫微","太陰"],
  丙:["天同","天機","文昌","廉貞"], 丁:["太陰","天同","天機","巨門"],
  戊:["貪狼","太陰","右弼","天機"], 己:["武曲","貪狼","天梁","文曲"],
  庚:["太陽","武曲","太陰","天同"], 辛:["巨門","太陽","文曲","文昌"],
  壬:["天梁","紫微","左輔","武曲"], 癸:["破軍","巨門","太陰","貪狼"],
};

export function yearSihua(yearStem: string) {
  const t = SIHUA_TABLE[yearStem];
  return { 祿: t[0], 權: t[1], 科: t[2], 忌: t[3] };
}

/** 紫微定位（商餘法／純函式）。回傳紫微所在地支 index（子=0）。
 *  已驗證：水二局初一→丑、金四局初一→亥、木三局初一→辰、木三局初二→丑。 */
export function ziweiPosition(ju: number, day: number): number {
  const q = Math.ceil(day / ju);
  const r = q * ju - day;
  const pos = r === 0 ? q : r % 2 === 1 ? q - r : q + r;
  return (2 + ((pos - 1) % 12) + 12) % 12; // 自寅起算
}

/** 火星、鈴星（《全書》通行起例，依年支三合局定起宮，順數時支）。 */
export function fireBellPosition(yearBranch: number, hb: number): { fire: number; bell: number } {
  const grp = [2, 6, 10].includes(yearBranch) ? 0      // 寅午戌
    : [8, 0, 4].includes(yearBranch) ? 1               // 申子辰
    : [5, 9, 1].includes(yearBranch) ? 2               // 巳酉丑
    : 3;                                               // 亥卯未
  const fireStart = [1, 2, 3, 9][grp];                 // 丑寅卯酉
  const bellStart = [3, 10, 10, 10][grp];              // 卯戌戌戌
  return { fire: (fireStart + hb) % 12, bell: (bellStart + hb) % 12 };
}

export function computeZiwei(p: Profile): ZiweiChart | null {
  if (!p.birthTime) return null;
  const [y, m, d] = p.birthDate.split("-").map(Number);
  const lu = lunarDate(y, m, d);
  // 定版：閏月上半月(≤15)歸前月，下半月歸次月
  let lm = lu.month;
  if (lu.isLeap) lm = lu.day <= 15 ? lu.month : (lu.month % 12) + 1;
  const h = Number(p.birthTime.split(":")[0]);
  const hb = Math.floor(((h + 1) % 24) / 2);
  const ming = (((2 + (lm - 1) - hb) % 12) + 12) % 12;
  const shen = (2 + (lm - 1) + hb) % 12;

  // 紫微年干支：以農曆年（正月初一）為界，非八字立春界
  const lyYear = lu.month >= 11 && m <= 2 ? y - 1 : y;
  const ys = ((lyYear - 4) % 10 + 10) % 10;
  const yb = ((lyYear - 4) % 12 + 12) % 12;
  const stemOfPalace = (b: number) => (((ys % 5) * 2 + 2) + ((b - 2 + 12) % 12)) % 10;
  const mingStem = stemOfPalace(ming);
  // 干支 → 納音組
  let gzIdx = 0;
  for (let i = 0; i < 60; i++) if (i % 10 === mingStem && i % 12 === ming) { gzIdx = i; break; }
  const juEl = NAYIN_SEQ[Math.floor(gzIdx / 2)];
  const ju = JU_OF[juEl];

  // 紫微定位（純函式，已驗證）
  const ziwei = ziweiPosition(ju, lu.day);
  const tianfu = ((4 - ziwei) % 12 + 12) % 12;

  const stars: Record<number, string[]> = {};
  const put = (b: number, s: string) => { (stars[((b%12)+12)%12] ||= []).push(s); };
  put(ziwei, "紫微"); put(ziwei-1, "天機"); put(ziwei-3, "太陽");
  put(ziwei-4, "武曲"); put(ziwei-5, "天同"); put(ziwei-8, "廉貞");
  put(tianfu, "天府"); put(tianfu+1, "太陰"); put(tianfu+2, "貪狼"); put(tianfu+3, "巨門");
  put(tianfu+4, "天相"); put(tianfu+5, "天梁"); put(tianfu+6, "七殺"); put(tianfu+10, "破軍");
  // 輔星
  put(4 + (lm - 1), "左輔"); put(10 - (lm - 1), "右弼");
  put(10 - hb, "文昌"); put(4 + hb, "文曲");
  const LU_POS = [2,3,5,6,5,6,8,9,11,0]; // 祿存：甲寅乙卯丙巳丁午戊巳己午庚申辛酉壬亥癸子
  const lucun = LU_POS[ys];
  put(lucun, "祿存"); put(lucun+1, "擎羊"); put(lucun-1, "陀羅");
  put(11 + hb, "地劫"); put(11 - hb, "地空");
  const fb = fireBellPosition(yb, hb);
  put(fb.fire, "火星"); put(fb.bell, "鈴星");

  const palaceNames: Record<number, string> = {};
  for (let i = 0; i < 12; i++) palaceNames[(((ming - i) % 12) + 12) % 12] = PALACE_NAMES[i];

  const yangYear = ys % 2 === 0;
  const fwd = (yangYear && p.gender === "male") || (!yangYear && p.gender === "female");
  const daxian = Array.from({ length: 12 }, (_, i) => ({
    palace: (((ming + (fwd ? i : -i)) % 12) + 12) % 12,
    range: [ju + i * 10, ju + i * 10 + 9] as [number, number],
  }));

  const palaceOf = (name: string) => {
    for (const [b, arr] of Object.entries(stars)) if (arr.includes(name)) return Number(b);
    return null;
  };

  return {
    lunar: { month: lu.month, day: lu.day, isLeap: lu.isLeap },
    mingGong: ming, shenGong: shen, ju, juElement: juEl,
    stars, sihua: yearSihua(STEMS[ys]), palaceOf, palaceNames, daxian,
  };
}

export interface ZiweiFacts { hua: Record<string, string | null> } // 四化所落宮名
export function ziweiFacts(chart: ZiweiChart, flowYearStem: string): ZiweiFacts {
  const sh = yearSihua(flowYearStem);
  const hua: Record<string, string | null> = {};
  (Object.keys(sh) as (keyof typeof sh)[]).forEach(k => {
    const pal = chart.palaceOf(sh[k]);
    hua[k] = pal === null ? null : chart.palaceNames[pal];
  });
  return { hua };
}
export { BRANCHES, ganzhiFromIndex };
