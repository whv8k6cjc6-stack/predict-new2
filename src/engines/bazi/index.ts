/** 八字引擎：四柱、藏干、十神、五行、強弱、喜忌、大運、流年月日。 */
import {
  fourPillars, dayPillar, ganzhiFromIndex, jdFromLocal, termJDOfYear,
  STEMS, BRANCHES, type GanZhi, type FourPillars,
} from "../calendar/ganzhi";
import { SOLAR_TERMS, solarTermJD, sunLongitude } from "../calendar/astro";
import type { Profile } from "@/types/profile";

export type Element = "木" | "火" | "土" | "金" | "水";
export const STEM_ELEMENT: Element[] = ["木","木","火","火","土","土","金","金","水","水"];
export const BRANCH_ELEMENT: Element[] = ["水","土","木","木","土","火","火","土","金","金","土","水"];
export const HIDDEN_STEMS: number[][] = [
  [9],[5,9,7],[0,2,4],[1],[4,1,9],[2,4,6],[3,5],[5,3,1],[6,8,4],[7],[4,7,3],[8,0],
]; // 子丑寅卯辰巳午未申酉戌亥（主氣在前）

const GEN: Record<Element, Element> = { 木:"火", 火:"土", 土:"金", 金:"水", 水:"木" }; // 我生
const CTRL: Record<Element, Element> = { 木:"土", 火:"金", 土:"水", 金:"木", 水:"火" }; // 我克
const genSource = (e: Element) => (Object.keys(GEN) as Element[]).find(k => GEN[k] === e)!;
const ctrlSource = (e: Element) => (Object.keys(CTRL) as Element[]).find(k => CTRL[k] === e)!;

export const TEN_GODS = ["比肩","劫財","食神","傷官","偏財","正財","七殺","正官","偏印","正印"] as const;
export type TenGod = (typeof TEN_GODS)[number];

export function tenGod(dayStemIdx: number, otherStemIdx: number): TenGod {
  const de = STEM_ELEMENT[dayStemIdx], oe = STEM_ELEMENT[otherStemIdx];
  const samePol = dayStemIdx % 2 === otherStemIdx % 2;
  if (oe === de) return samePol ? "比肩" : "劫財";
  if (GEN[de] === oe) return samePol ? "食神" : "傷官";
  if (CTRL[de] === oe) return samePol ? "偏財" : "正財";
  if (CTRL[oe] === de) return samePol ? "七殺" : "正官";
  return samePol ? "偏印" : "正印";
}

/** 地支關係（vs 命局日支） */
export function branchRelation(a: number, b: number): "沖" | "六合" | "三合" | "刑" | "" {
  if ((a + 6) % 12 === b) return "沖";
  const liuhe = [[0,1],[2,11],[3,10],[4,9],[5,8],[6,7]];
  if (liuhe.some(([x,y]) => (a===x&&b===y)||(a===y&&b===x))) return "六合";
  const sanhe = [[8,0,4],[2,6,10],[5,9,1],[11,3,7]];
  if (sanhe.some(g => g.includes(a) && g.includes(b) && a!==b)) return "三合";
  const xing = [[2,5,8],[1,10,7],[0,3]];
  if (xing.some(g => g.includes(a) && g.includes(b) && a!==b)) return "刑";
  if ([4,6,9,11].includes(a) && a===b) return "刑"; // 自刑：辰午酉亥
  return "";
}

export interface BaziChart {
  pillars: FourPillars;
  dayMaster: string; dayMasterElement: Element;
  tenGods: { year: TenGod; month: TenGod; hour: TenGod | null };
  hiddenStems: { year: string[]; month: string[]; day: string[]; hour: string[] | null };
  elementCount: Record<Element, number>;
  strength: number; strengthLabel: "強" | "偏強" | "偏弱" | "弱";
  favorable: Element[]; unfavorable: Element[];
  luckCycles: { gz: string; startAge: number }[];
  luckForward: boolean;
}

export function computeBazi(p: Profile): BaziChart {
  const [y, m, d] = p.birthDate.split("-").map(Number);
  const pillars = fourPillars(y, m, d, p.birthTime, {
    longitude: p.useTrueSolarTime ? p.birthPlace.longitude : undefined,
    ziRule: p.ziRule,
  });
  const dmIdx = pillars.day.index % 10;
  const dmEl = STEM_ELEMENT[dmIdx];

  const hs = (b: number) => HIDDEN_STEMS[b].map(i => STEMS[i] as string);
  const hidden = {
    year: hs(pillars.year.index % 12), month: hs(pillars.month.index % 12),
    day: hs(pillars.day.index % 12), hour: pillars.hour ? hs(pillars.hour.index % 12) : null,
  };

  // 五行統計（天干 1、支主氣 1、餘氣 0.4）
  const count: Record<Element, number> = { 木:0, 火:0, 土:0, 金:0, 水:0 };
  const gzList = [pillars.year, pillars.month, pillars.day, pillars.hour].filter(Boolean) as GanZhi[];
  for (const gz of gzList) {
    count[STEM_ELEMENT[gz.index % 10]] += 1;
    HIDDEN_STEMS[gz.index % 12].forEach((s, i) => { count[STEM_ELEMENT[s]] += i === 0 ? 1 : 0.4; });
  }

  // 強弱：得令40 + 得地30 + 得勢30
  const helps = (e: Element) => e === dmEl || GEN[e] === dmEl;
  const mEl = BRANCH_ELEMENT[pillars.month.index % 12];
  const sLing = mEl === dmEl ? 40 : GEN[mEl] === dmEl ? 28 : 0;
  const branches = [pillars.year, pillars.day, pillars.hour].filter(Boolean) as GanZhi[];
  let diScore = 0;
  for (const gz of branches) {
    const hh = HIDDEN_STEMS[gz.index % 12];
    if (helps(STEM_ELEMENT[hh[0]])) diScore += 10;
    else if (hh.slice(1).some(s => helps(STEM_ELEMENT[s]))) diScore += 4;
  }
  const otherStems = [pillars.year, pillars.month, pillars.hour].filter(Boolean) as GanZhi[];
  const shiScore = otherStems.reduce((s, gz) => s + (helps(STEM_ELEMENT[gz.index % 10]) ? 10 : 0), 0);
  const strength = Math.min(100, sLing + Math.min(30, diScore) + shiScore);
  // 以 50 為強弱分界（與喜用取捨一致）：>=58 強、50-57 偏強、43-49 偏弱、<43 弱
  const strengthLabel = strength >= 58 ? "強" : strength >= 50 ? "偏強" : strength >= 43 ? "偏弱" : "弱";

  const favorable: Element[] = strength >= 50
    ? [ctrlSource(dmEl), GEN[dmEl], CTRL[dmEl]]
    : [genSource(dmEl), dmEl];
  const unfavorable = (["木","火","土","金","水"] as Element[]).filter(e => !favorable.includes(e));

  // 大運：陽年男/陰年女順排
  const yangYear = pillars.year.index % 10 % 2 === 0;
  const forward = (yangYear && p.gender === "male") || (!yangYear && p.gender === "female");
  const jdBirth = jdFromLocal(y, m, d, p.birthTime ? Number(p.birthTime.split(":")[0]) : 12);
  const lon = sunLongitude(jdBirth);
  const curJieIdx = Math.floor((((lon - 315) % 360) + 360) % 360 / 30) * 2; // 節 index in SOLAR_TERMS
  let gapDays: number;
  if (forward) {
    const next = SOLAR_TERMS[(curJieIdx + 2) % 24];
    let t = solarTermJD(next.deg, jdBirth + 15);
    if (t < jdBirth) t = solarTermJD(next.deg, jdBirth + 30);
    gapDays = t - jdBirth;
  } else {
    const cur = SOLAR_TERMS[curJieIdx];
    let t = solarTermJD(cur.deg, jdBirth - 15);
    if (t > jdBirth) t = solarTermJD(cur.deg, jdBirth - 30);
    gapDays = jdBirth - t;
  }
  const startAge = Math.max(0, Math.round((gapDays / 3) * 10) / 10);
  const luckCycles = Array.from({ length: 8 }, (_, i) => ({
    gz: ganzhiFromIndex(pillars.month.index + (forward ? i + 1 : -(i + 1))).text,
    startAge: Math.round(startAge + i * 10),
  }));

  return {
    pillars, dayMaster: STEMS[dmIdx], dayMasterElement: dmEl,
    tenGods: {
      year: tenGod(dmIdx, pillars.year.index % 10),
      month: tenGod(dmIdx, pillars.month.index % 10),
      hour: pillars.hour ? tenGod(dmIdx, pillars.hour.index % 10) : null,
    },
    hiddenStems: hidden, elementCount: count, strength, strengthLabel,
    favorable, unfavorable, luckCycles, luckForward: forward,
  };
}

/** 流（年/月/日）干支 */
export function flowPillars(y: number, m: number, d: number) {
  const fp = fourPillars(y, m, d, "12:00");
  return { year: fp.year, month: fp.month, day: fp.day };
}

export interface BaziFacts {
  scope: "daily" | "monthly" | "yearly";
  flowGz: string;
  flowTenGod: TenGod;
  flowElement: Element;
  isFavorable: boolean;
  branchRelationToDay: string;
  dayMasterStrength: number;
  currentLuck: string | null;
  luckFavorable: boolean | null;
}

export function baziFacts(chart: BaziChart, scope: "daily"|"monthly"|"yearly", y: number, m: number, d: number, age: number): BaziFacts {
  const flows = flowPillars(y, m, d);
  const gz = scope === "daily" ? flows.day : scope === "monthly" ? flows.month : flows.year;
  const dmIdx = chart.pillars.day.index % 10;
  const el = STEM_ELEMENT[gz.index % 10];
  const luck = chart.luckCycles.filter(c => age >= c.startAge).pop() ?? null;
  let luckFav: boolean | null = null;
  if (luck) {
    const ls = STEMS.indexOf(luck.gz[0] as typeof STEMS[number]);
    luckFav = chart.favorable.includes(STEM_ELEMENT[ls]);
  }
  return {
    scope, flowGz: gz.text,
    flowTenGod: tenGod(dmIdx, gz.index % 10),
    flowElement: el,
    isFavorable: chart.favorable.includes(el),
    branchRelationToDay: branchRelation(gz.index % 12, chart.pillars.day.index % 12),
    dayMasterStrength: chart.strength,
    currentLuck: luck?.gz ?? null,
    luckFavorable: luckFav,
  };
}
export { dayPillar };
