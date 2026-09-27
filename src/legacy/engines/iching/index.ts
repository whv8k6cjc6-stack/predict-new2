/** 易經（梅花易數・年月日時起卦）：本卦、互卦、變卦與體用生剋。
 *  起卦數：年支序（子1…亥12）＋農曆月＋農曆日 → 上卦；再加時支序 → 下卦與動爻。
 *  每日運勢以「流日」農曆年月日＋「本人出生時辰」起卦，使卦象因人而異。 */
import { HEXAGRAMS, type HexData } from "./hexagrams";

export const TRIGRAMS: Record<number, { name: string; symbol: string; nature: string; element: string; bits: [number, number, number] }> = {
  1: { name: "乾", symbol: "☰", nature: "天", element: "金", bits: [1, 1, 1] },
  2: { name: "兌", symbol: "☱", nature: "澤", element: "金", bits: [1, 1, 0] },
  3: { name: "離", symbol: "☲", nature: "火", element: "火", bits: [1, 0, 1] },
  4: { name: "震", symbol: "☳", nature: "雷", element: "木", bits: [1, 0, 0] },
  5: { name: "巽", symbol: "☴", nature: "風", element: "木", bits: [0, 1, 1] },
  6: { name: "坎", symbol: "☵", nature: "水", element: "水", bits: [0, 1, 0] },
  7: { name: "艮", symbol: "☶", nature: "山", element: "土", bits: [0, 0, 1] },
  8: { name: "坤", symbol: "☷", nature: "地", element: "土", bits: [0, 0, 0] },
};

const trigramOfBits = (b: number[]): number =>
  Number(Object.keys(TRIGRAMS).find(k => TRIGRAMS[Number(k)].bits.every((v, i) => v === b[i])));

export function hexagramOf(upper: number, lower: number): HexData {
  return HEXAGRAMS.find(h => h.upper === upper && h.lower === lower)!;
}

/** 六爻（由下而上，1 陽 0 陰） */
export function linesOf(upper: number, lower: number): number[] {
  return [...TRIGRAMS[lower].bits, ...TRIGRAMS[upper].bits];
}

function fromLines(lines: number[]): HexData {
  return hexagramOf(trigramOfBits(lines.slice(3, 6)), trigramOfBits(lines.slice(0, 3)));
}

const GEN: Record<string, string> = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };
const CTRL: Record<string, string> = { 木: "土", 火: "金", 土: "水", 金: "木", 水: "火" };

export type TiYongRelation = "用生體" | "比和" | "體克用" | "體生用" | "用克體";

export function tiYong(tiEl: string, yongEl: string): TiYongRelation {
  if (tiEl === yongEl) return "比和";
  if (GEN[yongEl] === tiEl) return "用生體";
  if (CTRL[tiEl] === yongEl) return "體克用";
  if (GEN[tiEl] === yongEl) return "體生用";
  return "用克體";
}

export const TIYONG_INFO: Record<TiYongRelation, { score: number; label: string; plain: string }> = {
  用生體: { score: 2, label: "大吉", plain: "外在環境主動幫你（用卦生體卦），事情容易得到助力、不費力就有收穫。" },
  比和: { score: 1.5, label: "吉", plain: "你與環境同氣相求（體用比和），合作順暢、同心協力。" },
  體克用: { score: 0.8, label: "小吉", plain: "你能掌控局面（體克用），事情可成，但需要自己出力。" },
  體生用: { score: -1, label: "小耗", plain: "你要付出去滋養外在（體生用），容易勞心耗財，宜量力而為。" },
  用克體: { score: -2, label: "不利", plain: "外在形勢壓制你（用克體），阻力較大，宜守不宜攻。" },
};

/** 繫辭：「二多譽，四多懼，三多凶，五多功」；初爻為始、上爻為終。 */
export const LINE_POSITION: Record<number, { name: string; plain: string; score: number }> = {
  1: { name: "初爻", plain: "事情剛起步，宜潛藏準備、不宜張揚。", score: 0 },
  2: { name: "二爻", plain: "居中得位，「二多譽」，易得好評與內部支持。", score: 1 },
  3: { name: "三爻", plain: "處上下交界，「三多凶」，轉折處多波折，行事宜慎。", score: -1 },
  4: { name: "四爻", plain: "近君之位，「四多懼」，與上級互動要戰戰兢兢。", score: -0.5 },
  5: { name: "五爻", plain: "尊位主導，「五多功」，易有成果與主導權。", score: 1 },
  6: { name: "上爻", plain: "事物走到盡頭，物極必反，宜收斂見好就收。", score: -0.5 },
};

export interface HexReading {
  method: string;
  numbers: { year: number; month: number; day: number; hour: number };
  main: HexData; mutual: HexData; changed: HexData;
  mainLines: number[]; changedLines: number[];
  movingLine: number;
  ti: { trigram: number; name: string; element: string };
  yong: { trigram: number; name: string; element: string };
  relation: TiYongRelation;
  outcomeRelation: TiYongRelation; // 變卦之用 vs 體：看結果
  score: number;                   // -4 ~ +4 綜合傾向
}

const mod = (n: number, m: number) => { const r = n % m; return r === 0 ? m : r; };

/** 梅花易數年月日時起卦（先天數）。yearBranchNo：年支序 1–12；hourBranchNo：時支序 1–12。 */
export function castMeihua(yearBranchNo: number, lunarMonth: number, lunarDay: number, hourBranchNo: number): HexReading {
  const base = yearBranchNo + lunarMonth + lunarDay;
  const upper = mod(base, 8);
  const lower = mod(base + hourBranchNo, 8);
  const moving = mod(base + hourBranchNo, 6);

  const mainLines = linesOf(upper, lower);
  const main = hexagramOf(upper, lower);
  const mutual = fromLines([mainLines[1], mainLines[2], mainLines[3], mainLines[2], mainLines[3], mainLines[4]]);
  const changedLines = mainLines.map((v, i) => (i === moving - 1 ? 1 - v : v));
  const changed = fromLines(changedLines);

  const yongIsLower = moving <= 3;
  const tiT = yongIsLower ? upper : lower;
  const yongT = yongIsLower ? lower : upper;
  const tiEl = TRIGRAMS[tiT].element, yongEl = TRIGRAMS[yongT].element;
  const relation = tiYong(tiEl, yongEl);
  const changedYongT = trigramOfBits(yongIsLower ? changedLines.slice(0, 3) : changedLines.slice(3, 6));
  const outcomeRelation = tiYong(tiEl, TRIGRAMS[changedYongT].element);

  const score = TIYONG_INFO[relation].score * 1.2 + TIYONG_INFO[outcomeRelation].score * 0.6
    + main.tone * 0.5 + changed.tone * 0.3 + LINE_POSITION[moving].score * 0.3;

  return {
    method: "梅花易數・年月日時起卦",
    numbers: { year: yearBranchNo, month: lunarMonth, day: lunarDay, hour: hourBranchNo },
    main, mutual, changed, mainLines, changedLines, movingLine: moving,
    ti: { trigram: tiT, name: TRIGRAMS[tiT].name, element: tiEl },
    yong: { trigram: yongT, name: TRIGRAMS[yongT].name, element: yongEl },
    relation, outcomeRelation,
    score: Math.max(-4, Math.min(4, Math.round(score * 10) / 10)),
  };
}

export { HEXAGRAMS, type HexData };
