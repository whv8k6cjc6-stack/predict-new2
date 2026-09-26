/** 奇門遁甲引擎：時家轉盤、拆補法。格局判讀為簡化版，頁面附校正提示。 */
import { fourPillars, dayPillar, hourPillar, hourBranchIndex, ganzhiFromIndex, STEMS, jdFromLocal } from "../calendar/ganzhi";
import { sunLongitude } from "../calendar/astro";

// 洛書宮序與方位
export const PALACE_DIR: Record<number, string> = { 1:"北", 8:"東北", 3:"東", 4:"東南", 9:"南", 2:"西南", 7:"西", 6:"西北", 5:"中" };
const RING = [1,8,3,4,9,2,7,6]; // 順時針
const STAR_OF: Record<number, string> = { 1:"天蓬",8:"天任",3:"天沖",4:"天輔",9:"天英",2:"天芮",7:"天柱",6:"天心",5:"天禽" };
const DOOR_OF: Record<number, string> = { 1:"休門",8:"生門",3:"傷門",4:"杜門",9:"景門",2:"死門",7:"驚門",6:"開門" };
const GODS = ["值符","螣蛇","太陰","六合","白虎","玄武","九地","九天"];
const GOOD_DOORS = ["開門","休門","生門"]; const BAD_DOORS = ["死門","驚門","傷門"];
const GOOD_STARS = ["天輔","天禽","天心","天任"]; const BAD_STARS = ["天蓬","天芮","天柱"];
const GOOD_GODS = ["值符","九天","九地","太陰","六合"];
const DOOR_EL: Record<string,string> = { 休門:"水",生門:"土",傷門:"木",杜門:"木",景門:"火",死門:"土",驚門:"金",開門:"金" };
const PAL_EL: Record<number,string> = { 1:"水",8:"土",3:"木",4:"木",9:"火",2:"土",7:"金",6:"金",5:"土" };
const KE: Record<string,string> = { 木:"土", 土:"水", 水:"火", 火:"金", 金:"木" };

// 節氣 → 三元局數（陽遁正、陰遁負）。順序同 astro SOLAR_TERMS（立春起）。
const JU_TABLE: Record<string, [number, number, number]> = {
  冬至:[1,7,4], 小寒:[2,8,5], 大寒:[3,9,6], 立春:[8,5,2], 雨水:[9,6,3], 驚蟄:[1,7,4],
  春分:[3,9,6], 清明:[4,1,7], 穀雨:[5,2,8], 立夏:[4,1,7], 小滿:[5,2,8], 芒種:[6,3,9],
  夏至:[-9,-3,-6], 小暑:[-8,-2,-5], 大暑:[-7,-1,-4], 立秋:[-2,-5,-8], 處暑:[-1,-4,-7], 白露:[-9,-3,-6],
  秋分:[-7,-1,-4], 寒露:[-6,-9,-3], 霜降:[-5,-8,-2], 立冬:[-6,-9,-3], 小雪:[-5,-8,-2], 大雪:[-4,-7,-1],
};
const TERM_ORDER = ["冬至","小寒","大寒","立春","雨水","驚蟄","春分","清明","穀雨","立夏","小滿","芒種",
  "夏至","小暑","大暑","立秋","處暑","白露","秋分","寒露","霜降","立冬","小雪","大雪"];

export interface QimenChart {
  yang: boolean; ju: number; yuan: "上元"|"中元"|"下元"; term: string;
  hourGz: string; dayGz: string;
  ground: Record<number, string>;   // 地盤天干
  sky: Record<number, string>;      // 天盤天干（隨星轉）
  doors: Record<number, string>; starsP: Record<number, string>; godsP: Record<number, string>;
  zhiFuStar: string; zhiShiDoor: string;
  kong: string[];                   // 時旬空亡支
  dayStemPalace: number;
  goodDirs: string[]; badDirs: string[];
  patterns: { name: string; level: "吉"|"凶"; palace: number }[];
}

/** 旬首遁儀：依時柱 60 甲子 index 求所屬旬的遁儀。
 *  甲子戊、甲戌己、甲申庚、甲午辛、甲辰壬、甲寅癸。 */
export function xunYi(hourIndex: number): string {
  const xunHead = (((hourIndex % 60) + 60) % 60) - ((((hourIndex % 60) + 60) % 60) % 10);
  return ({ 0: "戊", 10: "己", 20: "庚", 30: "辛", 40: "壬", 50: "癸" } as Record<number, string>)[xunHead];
}

export function computeQimen(y: number, m: number, d: number, hm: string): QimenChart {
  const [h] = hm.split(":").map(Number);
  const dp = dayPillar(y, m, d);
  const hp = hourPillar(dp.index % 10, hourBranchIndex(h));
  // 節氣：依太陽黃經求目前節氣名
  const lon = sunLongitude(jdFromLocal(y, m, d, h));
  const seg = Math.floor((((lon - 270) % 360) + 360) % 360 / 15); // 0=冬至段
  const term = TERM_ORDER[seg];
  // 拆補三元：找日柱所屬符頭（最近的甲/己日）
  const back = dp.index % 5; // 距甲或己日
  const headBranch = ((dp.index - back) % 12 + 12) % 12;
  const yuanIdx = [0,6,3,9].includes(headBranch) ? 0 : [2,8,5,11].includes(headBranch) ? 1 : 2;
  const juRaw = JU_TABLE[term][yuanIdx];
  const yang = juRaw > 0, ju = Math.abs(juRaw);
  // 地盤：戊己庚辛壬癸丁丙乙 自局數宮起，陽順陰逆（宮序 1..9）
  const SEQ = ["戊","己","庚","辛","壬","癸","丁","丙","乙"];
  const ground: Record<number, string> = {};
  for (let i = 0; i < 9; i++) {
    const pal = (((ju - 1 + (yang ? i : -i)) % 9) + 9) % 9 + 1;
    ground[pal] = SEQ[i];
  }
  // 旬首六儀（甲子戊、甲戌己、甲申庚、甲午辛、甲辰壬、甲寅癸）
  const xunHead = hp.index - (hp.index % 10);
  const yi = xunYi(hp.index);
  const findPal = (g: string) => Number(Object.keys(ground).find(k => ground[Number(k)] === g));
  let p0 = findPal(yi); // 值符原始宮
  const zhiFuStar = STAR_OF[p0], zhiShiDoor = p0 === 5 ? DOOR_OF[2] : DOOR_OF[p0];
  // 時干地盤宮（甲時用旬首儀）
  const hourStem = STEMS[hp.index % 10];
  const hourKey = hourStem === "甲" ? yi : hourStem;
  let p1 = findPal(hourKey); if (p1 === 5) p1 = 2;
  const p0r = p0 === 5 ? 2 : p0;
  // 天盤星與天盤干：星環自值符星轉至 p1
  const ringPos = (pal: number) => RING.indexOf(pal);
  const starsP: Record<number, string> = {}; const sky: Record<number, string> = {};
  const shift = ringPos(p1) - ringPos(p0r);
  for (let i = 0; i < 8; i++) {
    const from = RING[i], to = RING[(i + shift + 8) % 8];
    starsP[to] = STAR_OF[from] + (from === 2 && p0 === 5 ? "(禽)" : "");
    sky[to] = ground[from] + (from === 2 ? "/" + ground[5] : "");
  }
  starsP[5] = "—"; sky[5] = ground[5];
  // 值使門：自 p0 按時辰序數飛宮（含 5），陽順陰逆；再轉門環
  const steps = hp.index - xunHead;
  let pd = (((p0 - 1 + (yang ? steps : -steps)) % 9) + 9) % 9 + 1;
  if (pd === 5) pd = 2;
  const doors: Record<number, string> = {};
  const zhiShiHome = p0 === 5 ? 2 : p0;
  const dShift = ringPos(pd) - ringPos(zhiShiHome);
  for (let i = 0; i < 8; i++) doors[RING[(i + dShift + 8) % 8]] = DOOR_OF[RING[i]];
  doors[5] = "—";
  // 八神：值符於 p1，陽順陰逆
  const godsP: Record<number, string> = {};
  for (let i = 0; i < 8; i++) {
    const pal = RING[((ringPos(p1) + (yang ? i : -i)) % 8 + 8) % 8];
    godsP[pal] = GODS[i];
  }
  godsP[5] = "—";
  // 旬空（時旬）
  const hb0 = ((xunHead % 12) + 12) % 12;
  const kong = [(hb0 + 10) % 12, (hb0 + 11) % 12].map(i => "子丑寅卯辰巳午未申酉戌亥"[i]);
  // 日干落宮（天盤；甲日遁戊）
  const dayStem = STEMS[dp.index % 10];
  const dayKey = dayStem === "甲" ? "戊" : dayStem;
  let dayStemPalace = 5;
  for (const pal of RING) if (sky[pal].includes(dayKey)) { dayStemPalace = pal; break; }
  // 吉凶方位與簡化格局
  const goodDirs: string[] = []; const badDirs: string[] = [];
  const patterns: QimenChart["patterns"] = [];
  for (const pal of RING) {
    const door = doors[pal], star = starsP[pal].replace("(禽)",""), god = godsP[pal];
    let score = 0;
    if (GOOD_DOORS.includes(door)) score += 2; if (BAD_DOORS.includes(door)) score -= 2;
    if (GOOD_STARS.includes(star)) score += 1; if (BAD_STARS.includes(star)) score -= 1;
    if (GOOD_GODS.includes(god)) score += 1; if (["白虎","玄武","螣蛇"].includes(god)) score -= 1;
    // 門迫：門克宮
    if (KE[DOOR_EL[door]] === PAL_EL[pal]) { score -= 1; patterns.push({ name:`${door}門迫`, level:"凶", palace: pal }); }
    if (GOOD_DOORS.includes(door) && GOOD_GODS.includes(god)) patterns.push({ name:`${door}會${god}`, level:"吉", palace: pal });
    if (score >= 3) goodDirs.push(PALACE_DIR[pal]);
    if (score <= -3) badDirs.push(PALACE_DIR[pal]);
  }
  return {
    yang, ju, yuan: (["上元","中元","下元"] as const)[yuanIdx], term,
    hourGz: hp.text, dayGz: dp.text, ground, sky, doors, starsP, godsP,
    zhiFuStar, zhiShiDoor, kong, dayStemPalace, goodDirs, badDirs, patterns,
  };
}

export interface QimenFacts {
  dayPalaceDoor: string; dayPalaceStar: string; dayPalaceGod: string;
  dayPalaceGood: boolean; dayPalaceBad: boolean;
  goodDirs: string[]; badDirs: string[]; kongHit: boolean;
}
export function qimenFacts(c: QimenChart): QimenFacts {
  const pal = c.dayStemPalace;
  const door = c.doors[pal] ?? "—", star = (c.starsP[pal] ?? "—").replace("(禽)",""), god = c.godsP[pal] ?? "—";
  return {
    dayPalaceDoor: door, dayPalaceStar: star, dayPalaceGod: god,
    dayPalaceGood: GOOD_DOORS.includes(door) || GOOD_STARS.includes(star),
    dayPalaceBad: BAD_DOORS.includes(door) || BAD_STARS.includes(star),
    goodDirs: c.goodDirs, badDirs: c.badDirs,
    kongHit: false,
  };
}

// —— 宮位評估（用神落宮） ——
export const PALACE_BRANCHES: Record<number, number[]> = { 1: [0], 8: [1, 2], 3: [3], 4: [4, 5], 9: [6], 2: [7, 8], 7: [9], 6: [10, 11], 5: [] };
export const PALACE_ELEMENT = PAL_EL;
const BR = "子丑寅卯辰巳午未申酉戌亥";

/** 天盤干加地盤干之常用格局 */
const STEM_PATTERNS: { sky: string; ground: string; name: string; delta: number; plain: string }[] = [
  { sky: "戊", ground: "丙", name: "青龍返首", delta: 3, plain: "大吉格，資本遇貴，所謀易成、有意外助力。" },
  { sky: "丙", ground: "戊", name: "飛鳥跌穴", delta: 3, plain: "大吉格，機會自己送上門，利求財與求職。" },
  { sky: "乙", ground: "辛", name: "青龍逃走", delta: -3, plain: "凶格，易有財物損失、人事離散，宜守。" },
  { sky: "辛", ground: "乙", name: "白虎猖狂", delta: -3, plain: "凶格，外力強勢壓迫，易有衝突耗損。" },
  { sky: "丙", ground: "庚", name: "熒入太白", delta: -2, plain: "凶格，主紛擾、口舌、財物流失。" },
  { sky: "庚", ground: "丙", name: "太白入熒", delta: -2, plain: "凶格，主外來干擾、防小人暗算。" },
  { sky: "庚", ground: "癸", name: "大格", delta: -2, plain: "凶格，行事受阻、出行不利。" },
  { sky: "庚", ground: "己", name: "刑格", delta: -2, plain: "凶格，易有官非口角、事多刑剋。" },
];

export interface PalaceNote { term: string; plain: string; delta: number }
export interface PalaceEval {
  palace: number; dir: string; door: string; star: string; god: string; sky: string; ground: string;
  score: number; kong: boolean; notes: PalaceNote[];
}

export function evalPalace(c: QimenChart, palIn: number): PalaceEval {
  const pal = palIn === 5 ? 2 : palIn;
  const door = c.doors[pal] ?? "—", star = (c.starsP[pal] ?? "—").replace("(禽)", ""), god = c.godsP[pal] ?? "—";
  const sky = c.sky[pal] ?? "", ground = c.ground[pal] ?? "";
  const notes: PalaceNote[] = [];
  if (GOOD_DOORS.includes(door)) notes.push({ term: door, plain: "吉門臨宮", delta: 2 });
  else if (BAD_DOORS.includes(door)) notes.push({ term: door, plain: "凶門臨宮", delta: -2 });
  if (GOOD_STARS.includes(star)) notes.push({ term: star, plain: "吉星臨宮", delta: 1 });
  else if (BAD_STARS.includes(star)) notes.push({ term: star, plain: "凶星臨宮", delta: -1 });
  if (GOOD_GODS.includes(god)) notes.push({ term: god, plain: "吉神臨宮", delta: 1 });
  else if (["白虎", "玄武", "螣蛇"].includes(god)) notes.push({ term: god, plain: "凶神臨宮", delta: -1 });
  if (KE[DOOR_EL[door]] === PAL_EL[pal]) notes.push({ term: "門迫", plain: `${door}剋宮，吉門減吉、凶門更凶`, delta: -1 });
  for (const s of sky.split("/")) {
    const pt = STEM_PATTERNS.find(p => p.sky === s && p.ground === ground);
    if (pt) notes.push({ term: pt.name, plain: pt.plain, delta: pt.delta });
  }
  if (["乙", "丙", "丁"].some(q => sky.startsWith(q)) && GOOD_DOORS.includes(door))
    notes.push({ term: "三奇得門", plain: "三奇（乙丙丁）與吉門同宮，事情有轉機與貴氣", delta: 1 });
  const kong = PALACE_BRANCHES[pal].some(b => c.kong.includes(BR[b]));
  let score = notes.reduce((s, n) => s + n.delta, 0);
  if (kong) { notes.push({ term: "空亡", plain: "所臨宮位逢旬空，吉凶皆減半、事多落空待時", delta: 0 }); score *= 0.5; }
  return { palace: pal, dir: PALACE_DIR[pal], door, star, god, sky, ground, score, kong, notes };
}

export function findPalace(c: QimenChart, kind: "door" | "god" | "star" | "sky", name: string): number | null {
  const map = kind === "door" ? c.doors : kind === "god" ? c.godsP : kind === "star" ? c.starsP : c.sky;
  for (const pal of RING) {
    const v = map[pal] ?? "";
    if (kind === "sky" ? v.split("/").includes(name) : v.replace("(禽)", "") === name) return pal;
  }
  return null;
}
