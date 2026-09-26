/** 常用神煞（子平通行起例）。branch/stem 皆以 index 表示（子=0、甲=0）。 */

/** 天乙貴人：甲戊庚牛羊，乙己鼠猴鄉，丙丁豬雞位，壬癸兔蛇藏，六辛逢馬虎。 */
export const TIANYI: number[][] = [
  [1, 7], [0, 8], [11, 9], [11, 9], [1, 7], [0, 8], [1, 7], [6, 2], [3, 5], [3, 5],
];
/** 文昌：甲巳乙午丙戊申，丁己酉，庚亥辛子，壬寅癸卯。 */
export const WENCHANG = [5, 6, 8, 9, 8, 9, 11, 0, 2, 3];
/** 祿神：甲寅乙卯丙戊巳丁己午庚申辛酉壬亥癸子。 */
export const LUSHEN = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0];
/** 羊刃（陽干）：甲卯丙戊午庚酉壬子。 */
export const YANGREN: Record<number, number> = { 0: 3, 2: 6, 4: 6, 6: 9, 8: 0 };

const sanheGroup = (b: number) => [8, 0, 4].includes(b) ? 0 : [2, 6, 10].includes(b) ? 1 : [5, 9, 1].includes(b) ? 2 : 3;
/** 驛馬：申子辰馬在寅，寅午戌馬在申，巳酉丑馬在亥，亥卯未馬在巳。 */
export const yima = (b: number) => [2, 8, 11, 5][sanheGroup(b)];
/** 桃花（咸池）：申子辰在酉，寅午戌在卯，巳酉丑在午，亥卯未在子。 */
export const taohua = (b: number) => [9, 3, 6, 0][sanheGroup(b)];
/** 華蓋：申子辰見辰，寅午戌見戌，巳酉丑見丑，亥卯未見未。 */
export const huagai = (b: number) => [4, 10, 1, 7][sanheGroup(b)];

export const ZODIAC = ["鼠", "牛", "虎", "兔", "龍", "蛇", "馬", "羊", "猴", "雞", "狗", "豬"];

export interface ShenshaHit { name: string; basis: string }

/** 流日地支觸發之神煞（以日干查貴人／文昌／祿／刃，以年支與日支查驛馬／桃花／華蓋）。 */
export function shenshaHits(dayStem: number, yearBranch: number, dayBranch: number, flowBranch: number): ShenshaHit[] {
  const hits: ShenshaHit[] = [];
  if (TIANYI[dayStem].includes(flowBranch)) hits.push({ name: "天乙貴人", basis: "日干查流日地支" });
  if (WENCHANG[dayStem] === flowBranch) hits.push({ name: "文昌", basis: "日干查流日地支" });
  if (LUSHEN[dayStem] === flowBranch) hits.push({ name: "祿神", basis: "日干查流日地支" });
  if (YANGREN[dayStem] === flowBranch) hits.push({ name: "羊刃", basis: "日干查流日地支" });
  const seen = new Set<string>();
  for (const [b, src] of [[yearBranch, "年支"], [dayBranch, "日支"]] as const) {
    if (yima(b) === flowBranch && !seen.has("驛馬")) { hits.push({ name: "驛馬", basis: `${src}查流日地支` }); seen.add("驛馬"); }
    if (taohua(b) === flowBranch && !seen.has("桃花")) { hits.push({ name: "桃花", basis: `${src}查流日地支` }); seen.add("桃花"); }
    if (huagai(b) === flowBranch && !seen.has("華蓋")) { hits.push({ name: "華蓋", basis: `${src}查流日地支` }); seen.add("華蓋"); }
  }
  return hits;
}
