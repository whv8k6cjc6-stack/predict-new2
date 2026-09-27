/** 子平八字基礎資料：藏干、十神、十二長生、干支關係、神煞。依通行子平起例。 */
import { BRANCHES, STEMS, STEM_ELEMENT, type Element } from "../calendar/ganzhi";

/** 地支藏干：[天干 index, 權重]；第一個為本氣 */
export const HIDDEN: [number, number][][] = [
  [[9, 1]],                         // 子：癸
  [[5, 1], [9, 0.5], [7, 0.3]],     // 丑：己癸辛
  [[0, 1], [2, 0.5], [4, 0.3]],     // 寅：甲丙戊
  [[1, 1]],                         // 卯：乙
  [[4, 1], [1, 0.5], [9, 0.3]],     // 辰：戊乙癸
  [[2, 1], [4, 0.5], [6, 0.3]],     // 巳：丙戊庚
  [[3, 1], [5, 0.5]],               // 午：丁己
  [[5, 1], [3, 0.5], [1, 0.3]],     // 未：己丁乙
  [[6, 1], [8, 0.5], [4, 0.3]],     // 申：庚壬戊
  [[7, 1]],                         // 酉：辛
  [[4, 1], [7, 0.5], [3, 0.3]],     // 戌：戊辛丁
  [[8, 1], [0, 0.5]],               // 亥：壬甲
];
export const HIDDEN_ROLE = ["本氣", "中氣", "餘氣"];

export const GEN: Record<Element, Element> = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };   // 我生
export const CTRL: Record<Element, Element> = { 木: "土", 火: "金", 土: "水", 金: "木", 水: "火" };  // 我剋
export const genBy = (e: Element) => (Object.keys(GEN) as Element[]).find(k => GEN[k] === e)!;    // 生我
export const ctrlBy = (e: Element) => (Object.keys(CTRL) as Element[]).find(k => CTRL[k] === e)!; // 剋我

export const TEN_GODS = ["比肩", "劫財", "食神", "傷官", "偏財", "正財", "七殺", "正官", "偏印", "正印"] as const;
export type TenGod = (typeof TEN_GODS)[number];
export type TenGodGroup = "比劫" | "食傷" | "財星" | "官殺" | "印星";
export const GROUP_OF: Record<TenGod, TenGodGroup> = {
  比肩: "比劫", 劫財: "比劫", 食神: "食傷", 傷官: "食傷", 偏財: "財星", 正財: "財星", 七殺: "官殺", 正官: "官殺", 偏印: "印星", 正印: "印星",
};

export function tenGod(dm: number, other: number): TenGod {
  const de = STEM_ELEMENT[dm], oe = STEM_ELEMENT[other];
  const same = dm % 2 === other % 2;
  if (oe === de) return same ? "比肩" : "劫財";
  if (GEN[de] === oe) return same ? "食神" : "傷官";
  if (CTRL[de] === oe) return same ? "偏財" : "正財";
  if (CTRL[oe] === de) return same ? "七殺" : "正官";
  return same ? "偏印" : "正印";
}
/** 某五行相對日主屬哪一類十神 */
export function groupOfElement(dmEl: Element, el: Element): TenGodGroup {
  if (el === dmEl) return "比劫";
  if (GEN[dmEl] === el) return "食傷";
  if (CTRL[dmEl] === el) return "財星";
  if (CTRL[el] === dmEl) return "官殺";
  return "印星";
}
export function elementOfGroup(dmEl: Element, g: TenGodGroup): Element {
  return { 比劫: dmEl, 食傷: GEN[dmEl], 財星: CTRL[dmEl], 官殺: ctrlBy(dmEl), 印星: genBy(dmEl) }[g];
}

/** 十二長生：陽干順行、陰干逆行（陰干採「陰生陽死」通行起例） */
export const LIFE_STAGES = ["長生", "沐浴", "冠帶", "臨官", "帝旺", "衰", "病", "死", "墓", "絕", "胎", "養"] as const;
export type LifeStage = (typeof LIFE_STAGES)[number];
const CHANGSHENG = [11, 6, 2, 9, 2, 9, 5, 0, 8, 3]; // 甲亥 乙午 丙寅 丁酉 戊寅 己酉 庚巳 辛子 壬申 癸卯
export function lifeStage(stem: number, branch: number): LifeStage {
  const start = CHANGSHENG[stem];
  const k = stem % 2 === 0 ? (branch - start + 12) % 12 : (start - branch + 12) % 12;
  return LIFE_STAGES[k];
}

// ── 地支關係 ──
const pairIn = (list: number[][], a: number, b: number) => list.some(([x, y]) => (a === x && b === y) || (a === y && b === x));
export const LIUHE: number[][] = [[0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7]];
export const LIUHE_ELEMENT = ["土", "木", "火", "金", "水", "火"];  // 子丑土、寅亥木、卯戌火、辰酉金、巳申水、午未火(土)
export const SANHE: { members: number[]; element: Element; name: string }[] = [
  { members: [8, 0, 4], element: "水", name: "申子辰水局" }, { members: [2, 6, 10], element: "火", name: "寅午戌火局" },
  { members: [5, 9, 1], element: "金", name: "巳酉丑金局" }, { members: [11, 3, 7], element: "木", name: "亥卯未木局" },
];
export const SANHUI: { members: number[]; element: Element; name: string }[] = [
  { members: [2, 3, 4], element: "木", name: "寅卯辰東方木" }, { members: [5, 6, 7], element: "火", name: "巳午未南方火" },
  { members: [8, 9, 10], element: "金", name: "申酉戌西方金" }, { members: [11, 0, 1], element: "水", name: "亥子丑北方水" },
];
export const HAI: number[][] = [[0, 7], [1, 6], [2, 5], [3, 4], [8, 11], [9, 10]];
export const PO: number[][] = [[0, 9], [3, 6], [5, 8], [2, 11], [4, 1], [10, 7]];
const XING_GROUPS = [[2, 5, 8], [1, 10, 7]];
const SELF_XING = [4, 6, 9, 11];   // 辰午酉亥自刑

export type BranchRel = "六沖" | "六合" | "半合" | "三合" | "三會" | "刑" | "自刑" | "害" | "破";

/** 兩支之間的所有關係（一對地支可同時有多種，例如寅巳既刑且害） */
export function branchPairRelations(a: number, b: number): BranchRel[] {
  const out: BranchRel[] = [];
  if ((a + 6) % 12 === b) out.push("六沖");
  if (pairIn(LIUHE, a, b)) out.push("六合");
  if (a !== b && SANHE.some(g => g.members.includes(a) && g.members.includes(b)) && (a === SANHE.find(g => g.members.includes(a))!.members[1] || b === SANHE.find(g => g.members.includes(b))!.members[1])) out.push("半合");
  if (a !== b && XING_GROUPS.some(g => g.includes(a) && g.includes(b))) out.push("刑");
  if ((a === 0 && b === 3) || (a === 3 && b === 0)) out.push("刑");
  if (a === b && SELF_XING.includes(a)) out.push("自刑");
  if (pairIn(HAI, a, b)) out.push("害");
  if (pairIn(PO, a, b)) out.push("破");
  return out;
}

/** 多支是否成三合局／三會方（需三支俱全） */
export function fullCombos(branches: number[]) {
  const set = new Set(branches);
  return {
    sanhe: SANHE.filter(g => g.members.every(m => set.has(m))),
    sanhui: SANHUI.filter(g => g.members.every(m => set.has(m))),
  };
}

// ── 天干關係 ──
export const STEM_HE: [number, number, Element][] = [[0, 5, "土"], [1, 6, "金"], [2, 7, "水"], [3, 8, "木"], [4, 9, "火"]];
export function stemRelation(a: number, b: number): "五合" | "相沖" | null {
  if (STEM_HE.some(([x, y]) => (a === x && b === y) || (a === y && b === x))) return "五合";
  if (Math.abs(a - b) === 6 && ![4, 5].includes(a) && ![4, 5].includes(b)) return "相沖";   // 甲庚、乙辛、丙壬、丁癸
  return null;
}

// ── 神煞（子平通行起例） ──
export const TIANYI: number[][] = [[1, 7], [0, 8], [11, 9], [11, 9], [1, 7], [0, 8], [1, 7], [6, 2], [3, 5], [3, 5]];
export const WENCHANG = [5, 6, 8, 9, 8, 9, 11, 0, 2, 3];
export const LU = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0];
export const YANGREN: Record<number, number> = { 0: 3, 2: 6, 4: 6, 6: 9, 8: 0 };
const group3 = (b: number) => [8, 0, 4].includes(b) ? 0 : [2, 6, 10].includes(b) ? 1 : [5, 9, 1].includes(b) ? 2 : 3;
export const YIMA = (b: number) => [2, 8, 11, 5][group3(b)];
export const TAOHUA = (b: number) => [9, 3, 6, 0][group3(b)];
export const HUAGAI = (b: number) => [4, 10, 1, 7][group3(b)];

export const PILLAR_NAMES = ["年柱", "月柱", "日柱", "時柱"] as const;
export const PILLAR_ROLE = ["祖上、長輩與大環境", "父母、工作環境與同事", "自己與配偶", "子女、部屬與晚年成果"];
export { STEMS, BRANCHES };
