/** 干支基礎：天干地支、六十甲子、五行陰陽、五虎遁、五鼠遁。 */
export const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;
export const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;
export type Stem = (typeof STEMS)[number];
export type Branch = (typeof BRANCHES)[number];
export type Element = "木" | "火" | "土" | "金" | "水";
export const ELEMENTS: Element[] = ["木", "火", "土", "金", "水"];

export const STEM_ELEMENT: Element[] = ["木", "木", "火", "火", "土", "土", "金", "金", "水", "水"];
export const BRANCH_ELEMENT: Element[] = ["水", "土", "木", "木", "土", "火", "火", "土", "金", "金", "土", "水"];
export const isYang = (stemIdx: number) => stemIdx % 2 === 0;

export interface GanZhi { stem: number; branch: number; index: number; text: string }

export function gz(index: number): GanZhi {
  const i = ((index % 60) + 60) % 60;
  return { stem: i % 10, branch: i % 12, index: i, text: STEMS[i % 10] + BRANCHES[i % 12] };
}
export function gzFrom(stem: number, branch: number): GanZhi {
  for (let i = 0; i < 60; i++) if (i % 10 === stem && i % 12 === branch) return gz(i);
  throw new Error("干支陰陽不配");
}
export const gzOfText = (t: string) => gzFrom(STEMS.indexOf(t[0] as Stem), BRANCHES.indexOf(t[1] as Branch));

/** 公曆日期的儒略日數（整數，正午） */
export function jdn(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12), yy = y + 4800 - a, mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}

/** 日柱：(JDN + 49) mod 60（錨點：1949-10-01 甲子、2000-01-01 戊午） */
export const dayGz = (y: number, m: number, d: number) => gz(jdn(y, m, d) + 49);

/** 年柱干支（以立春分年後的「命理年」） */
export const yearGz = (year: number) => gz(year - 4);

/** 月柱：五虎遁。monthIndex 0＝寅月 */
export function monthGz(yearStem: number, monthIndex: number): GanZhi {
  const stem = ((yearStem % 5) * 2 + 2 + monthIndex) % 10;
  return gzFrom(stem, (2 + monthIndex) % 12);
}

/** 時辰地支 index（23–01 子、01–03 丑…） */
export const hourBranch = (h: number) => Math.floor(((h + 1) % 24) / 2);

/** 時柱：五鼠遁（依「所屬日」的日干起時干） */
export function hourGz(dayStem: number, branch: number): GanZhi {
  return gzFrom(((dayStem % 5) * 2 + branch) % 10, branch);
}

/** 旬空（該干支所在旬的空亡二支） */
export function xunKong(g: GanZhi): [number, number] {
  const head = g.index - (g.index % 10);
  const hb = head % 12;
  return [(hb + 10) % 12, (hb + 11) % 12];
}

/** 納音五行（六十甲子兩兩一組） */
const NAYIN = ["海中金", "爐中火", "大林木", "路旁土", "劍鋒金", "山頭火", "澗下水", "城頭土", "白蠟金", "楊柳木",
  "泉中水", "屋上土", "霹靂火", "松柏木", "長流水", "沙中金", "山下火", "平地木", "壁上土", "金箔金",
  "覆燈火", "天河水", "大驛土", "釵釧金", "桑柘木", "大溪水", "沙中土", "天上火", "石榴木", "大海水"];
export const nayin = (g: GanZhi) => NAYIN[Math.floor(g.index / 2)];
