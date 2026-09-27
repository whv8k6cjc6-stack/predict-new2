/** IChing Engine：梅花易數起卦＋《周易》經文。
 *
 *  - 每日（固定演算法，可重現）：流日「農曆年支數＋月＋日」為上卦，再加「本人出生時支數」為下卦與動爻。
 *    出生時辰未知時，以出生日支數代替，並於結果中註明。
 *  - 事件（固定演算法）：以提問時刻的農曆年月日時起卦；或以使用者報的兩個數起卦。
 *  - 占卜（隨機）：以亂數起卦，另行標示，不參與正式分數。
 *  體用：動爻所在之經卦為用，另一經卦為體；看用對體的生剋，並以變卦之用看結果、互卦看過程。
 *  占辭：一爻動，以本卦動爻爻辭為主要占辭，並取其中「吉、凶、悔、吝、厲、无咎」等斷辭。 */
import type { DivinationEngine, EngineMeta, Fact } from "../engine";
import { toLunar } from "../calendar/precise";
import { resolveBirth } from "../calendar/resolve";
import { fourPillars } from "../calendar/pillars";
import { BRANCHES, hourBranch } from "../calendar/ganzhi";
import { getSourceText, ZHOUYI_EDITION, ZHOUYI_HEXAGRAMS, type ZhouyiHex } from "@/kb/sources";

export const TRIGRAMS: Record<number, { name: string; nature: string; element: string; symbol: string; bits: string }> = {
  1: { name: "乾", nature: "天", element: "金", symbol: "☰", bits: "111" },
  2: { name: "兌", nature: "澤", element: "金", symbol: "☱", bits: "110" },
  3: { name: "離", nature: "火", element: "火", symbol: "☲", bits: "101" },
  4: { name: "震", nature: "雷", element: "木", symbol: "☳", bits: "100" },
  5: { name: "巽", nature: "風", element: "木", symbol: "☴", bits: "011" },
  6: { name: "坎", nature: "水", element: "水", symbol: "☵", bits: "010" },
  7: { name: "艮", nature: "山", element: "土", symbol: "☶", bits: "001" },
  8: { name: "坤", nature: "地", element: "土", symbol: "☷", bits: "000" },
};
const TRI_OF_BITS = Object.fromEntries(Object.entries(TRIGRAMS).map(([k, v]) => [v.bits, Number(k)]));

/** 六爻（由下而上）字串 → 卦 */
export const hexOfBits = (bits: string): ZhouyiHex => ZHOUYI_HEXAGRAMS.find(h => h.bits === bits)!;
export const hexOf = (upper: number, lower: number): ZhouyiHex => hexOfBits(TRIGRAMS[lower].bits + TRIGRAMS[upper].bits);

const GEN: Record<string, string> = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };
const KE: Record<string, string> = { 木: "土", 火: "金", 土: "水", 金: "木", 水: "火" };
export type TiYong = "用生體" | "比和" | "體克用" | "體生用" | "用克體";
export function tiYong(ti: string, yong: string): TiYong {
  if (ti === yong) return "比和";
  if (GEN[yong] === ti) return "用生體";
  if (KE[ti] === yong) return "體克用";
  if (GEN[ti] === yong) return "體生用";
  return "用克體";
}

export const LINE_NAME = ["初", "二", "三", "四", "五", "上"];
export const lineLabel = (bits: string, i: number) => {
  const yy = bits[i] === "1" ? "九" : "六";
  return i === 0 ? `初${yy}` : i === 5 ? `上${yy}` : `${yy}${LINE_NAME[i]}`;
};

export type Verdict = "大吉" | "吉" | "吉凶並見" | "無咎" | "厲吝" | "無攸利" | "凶" | "無明確斷辭";
/** 取爻辭中的斷辭（去掉「初九：」前綴後判讀） */
export function verdictOf(text: string): { verdict: Verdict; markers: string[] } {
  const body = text.includes("：") ? text.slice(text.indexOf("：") + 1) : text;
  const markers = [...body.matchAll(/元吉|大吉|終吉|吉|無咎|悔亡|無攸利|無不利|凶|厲|吝|悔/g)].map(m => m[0]);
  const has = (re: RegExp) => markers.some(m => re.test(m));
  const ji = has(/吉|無不利/), xiong = has(/凶/);
  const verdict: Verdict = ji && xiong ? "吉凶並見"
    : xiong ? "凶"
    : ji ? (has(/元吉|大吉/) ? "大吉" : "吉")
    : has(/無攸利/) ? "無攸利"
    : has(/厲|吝/) ? "厲吝"
    : has(/無咎|悔亡/) ? "無咎"
    : "無明確斷辭";
  return { verdict, markers };
}

export type CastMethod = "daily" | "time" | "numbers" | "random";
export const METHOD_LABEL: Record<CastMethod, string> = {
  daily: "每日卦（梅花易數・流日農曆年月日＋本人時辰）",
  time: "時間起卦（梅花易數・農曆年月日時）",
  numbers: "報數起卦（梅花易數・前數上卦、後數下卦、總數加時取爻）",
  random: "隨機占卜（亂數起卦，每次不同，不參與正式分數）",
};

export interface IchingReading {
  method: CastMethod; methodLabel: string; deterministic: boolean;
  derivation: string[];
  numbers: { upper: number; lower: number; moving: number };
  main: ZhouyiHex; mutual: ZhouyiHex; changed: ZhouyiHex;
  moving: number; movingLabel: string;
  ti: { trigram: number; name: string; element: string; where: "上卦" | "下卦" };
  yong: { trigram: number; name: string; element: string; where: "上卦" | "下卦" };
  relation: TiYong; outcome: TiYong;
  mutualRel: { gen: number; ke: number; text: string };
  yao: { id: string; text: string; verdict: Verdict; markers: string[] };
  gua: { id: string; text: string };
  changedGua: { id: string; text: string };
}

const mod = (n: number, m: number) => { const r = ((n % m) + m) % m; return r === 0 ? m : r; };

/** 核心：上卦數、下卦數、動爻數 → 本互變、體用與占辭 */
export function castFromNumbers(upperN: number, lowerN: number, movingN: number, method: CastMethod, derivation: string[]): IchingReading {
  const upper = mod(upperN, 8), lower = mod(lowerN, 8), moving = mod(movingN, 6);
  const main = hexOf(upper, lower);
  const b = main.bits;
  const mutual = hexOfBits(b.slice(1, 4) + b.slice(2, 5));
  const cb = b.split("").map((v, i) => (i === moving - 1 ? (v === "1" ? "0" : "1") : v)).join("");
  const changed = hexOfBits(cb);
  const yongLower = moving <= 3;
  const tiT = yongLower ? upper : lower, yongT = yongLower ? lower : upper;
  const tiEl = TRIGRAMS[tiT].element, yongEl = TRIGRAMS[yongT].element;
  const changedYongT = TRI_OF_BITS[yongLower ? cb.slice(0, 3) : cb.slice(3, 6)];
  const mt = [TRI_OF_BITS[mutual.bits.slice(0, 3)], TRI_OF_BITS[mutual.bits.slice(3, 6)]];
  const rels = mt.map(t => tiYong(tiEl, TRIGRAMS[t].element));
  const gen = rels.filter(r => r === "用生體" || r === "比和").length, ke = rels.filter(r => r === "用克體").length;
  const yaoId = main.textIds.yao[moving - 1];
  const yaoText = getSourceText(yaoId)!.text;
  const v = verdictOf(yaoText);
  return {
    method, methodLabel: METHOD_LABEL[method], deterministic: method !== "random",
    derivation: [...derivation, `上卦 ${upperN} → ${TRIGRAMS[upper].name}，下卦 ${lowerN} → ${TRIGRAMS[lower].name}，動爻 ${movingN} → 第 ${moving} 爻`],
    numbers: { upper, lower, moving },
    main, mutual, changed, moving, movingLabel: `${main.name}卦${lineLabel(b, moving - 1)}`,
    ti: { trigram: tiT, name: TRIGRAMS[tiT].name, element: tiEl, where: yongLower ? "上卦" : "下卦" },
    yong: { trigram: yongT, name: TRIGRAMS[yongT].name, element: yongEl, where: yongLower ? "下卦" : "上卦" },
    relation: tiYong(tiEl, yongEl),
    outcome: tiYong(tiEl, TRIGRAMS[changedYongT].element),
    mutualRel: { gen, ke, text: `互卦${TRIGRAMS[mt[0]].name}${TRIGRAMS[mt[1]].name}對體卦：${rels.join("、")}` },
    yao: { id: yaoId, text: yaoText, ...v },
    gua: { id: main.textIds.gua, text: getSourceText(main.textIds.gua)!.text },
    changedGua: { id: changed.textIds.gua, text: getSourceText(changed.textIds.gua)!.text },
  };
}

const yearBranchNo = (lunarYear: number) => mod(lunarYear - 3, 12); // 子=1 … 亥=12（西元 4 年為子年）

/** 梅花易數年月日時起卦（年支數＋農曆月＋農曆日 → 上卦；再加時支數 → 下卦、動爻） */
export function castMeihua(yb: number, lunarMonth: number, lunarDay: number, hourNo: number, method: CastMethod, derivation: string[] = []) {
  const base = yb + lunarMonth + lunarDay;
  return castFromNumbers(base, base + hourNo, base + hourNo, method, [
    ...derivation, `年支數 ${yb}＋月 ${lunarMonth}＋日 ${lunarDay} = ${base}；加${method === "daily" ? "本人" : ""}時支數 ${hourNo} = ${base + hourNo}`,
  ]);
}

function lunarOf(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return toLunar(y, m, d);
}

/** 每日卦 */
export function castDaily(date: string, personalNo: number, personalBasis: string): IchingReading {
  const l = lunarOf(date);
  return castMeihua(yearBranchNo(l.year), l.month, l.day, personalNo, "daily", [
    `${date} 為農曆${l.year}年${l.isLeap ? "閏" : ""}${l.month}月${l.day}日（年支${BRANCHES[yearBranchNo(l.year) - 1]}）${l.isLeap ? "；閏月以本月數計" : ""}`,
    personalBasis,
  ]);
}

/** 時間起卦（事件提問時刻）；23 時後屬次日子時 */
export function castAtTime(date: string, time: string): IchingReading {
  const [h] = time.split(":").map(Number);
  let d = date;
  if (h >= 23) { const t = new Date(`${date}T00:00:00Z`); t.setUTCDate(t.getUTCDate() + 1); d = t.toISOString().slice(0, 10); }
  const l = lunarOf(d);
  const hb = hourBranch(h) + 1;
  return castMeihua(yearBranchNo(l.year), l.month, l.day, hb, "time", [
    `${date} ${time}：農曆${l.year}年${l.isLeap ? "閏" : ""}${l.month}月${l.day}日${BRANCHES[hb - 1]}時${h >= 23 ? "（23 時後屬次日）" : ""}`,
  ]);
}

/** 報數起卦 */
export function castByNumbers(a: number, b: number, time: string): IchingReading {
  const hb = hourBranch(Number(time.split(":")[0])) + 1;
  return castFromNumbers(a, b, a + b + hb, "numbers", [`前數 ${a} 為上卦、後數 ${b} 為下卦；${a}＋${b}＋時支數 ${hb}（${BRANCHES[hb - 1]}時）= ${a + b + hb} 取動爻`]);
}

/** 隨機占卜（使用 WebCrypto 亂數；結果每次不同，另行標示） */
export function castRandom(rand: () => number = () => crypto.getRandomValues(new Uint32Array(1))[0]): IchingReading {
  const a = (rand() % 8) + 1, b = (rand() % 8) + 1, c = (rand() % 6) + 1;
  return castFromNumbers(a, b, c, "random", ["以亂數取上卦、下卦與動爻（非固定演算法）"]);
}

export function ichingFacts(r: IchingReading, scope = "day"): Fact[] {
  const f: Fact[] = [];
  const add = (key: string, value: unknown, label: string, derivation: string) => f.push({ key: `iching.${scope}.${key}`, value, label, derivation, system: "iching" });
  const how = r.derivation.join("；");
  add("main", r.main.full, "本卦", how);
  add("mutual", r.mutual.full, "互卦", "本卦二至四爻為下、三至五爻為上");
  add("changed", r.changed.full, "變卦", `第 ${r.moving} 爻陰陽互變`);
  add("moving", r.movingLabel, "動爻", how);
  add("linePos", r.moving, "動爻位置", `第 ${r.moving} 爻`);
  add("yaoText", r.yao.text, "動爻爻辭", `《周易》${r.movingLabel}`);
  add("yaoTextId", r.yao.id, "動爻爻辭出處", r.yao.id);
  add("verdict", r.yao.verdict, "爻辭斷辭", r.yao.markers.length ? `爻辭含「${r.yao.markers.join("、")}」` : "爻辭無吉凶斷語");
  add("guaText", r.gua.text, "本卦卦辭", `《周易》${r.main.name}卦卦辭`);
  add("changedGuaText", r.changedGua.text, "變卦卦辭", `《周易》${r.changed.name}卦卦辭`);
  add("ti", `${r.ti.name}${TRIGRAMS[r.ti.trigram].nature}（${r.ti.element}）`, "體卦", `動爻在${r.yong.where}，${r.ti.where}為體`);
  add("yong", `${r.yong.name}${TRIGRAMS[r.yong.trigram].nature}（${r.yong.element}）`, "用卦", `動爻所在的${r.yong.where}為用`);
  add("relation", r.relation, "體用生剋", `體${r.ti.element}、用${r.yong.element}`);
  add("outcome", r.outcome, "變卦之用對體", "變卦中原用卦變化後，對體卦的生剋，看結果");
  add("mutualRel", r.mutualRel.text, "互卦對體（過程）", r.mutualRel.text);
  add("method", r.methodLabel, "起卦法", how);
  return f;
}

export const ICHING_META: EngineMeta = {
  id: "iching", name: "易經", phase: 6, status: "verified",
  stamp: { school: "周易・梅花易數體用", engine_version: "3.0.0", rule_version: "3.0.0", source_version: ZHOUYI_EDITION.source_version },
  summary: "六十四卦卦爻辭（附勘誤表）、本互變、體用生剋、固定演算法起卦",
};

export interface IchingNatal { personalNo: number; basis: string; timeKnown: boolean }
export interface IchingTransit { reading: IchingReading }

export const IchingEngine: DivinationEngine<IchingNatal, IchingTransit> = {
  meta: ICHING_META,
  computeNatal(input) {
    try {
      const r = resolveBirth(input.birth);
      const p = fourPillars(r, input.school.bazi.ziHour);
      const natal: IchingNatal = p.hour
        ? { personalNo: p.hour.branch + 1, basis: `本人出生時辰為${BRANCHES[p.hour.branch]}時（時支數 ${p.hour.branch + 1}）`, timeKnown: true }
        : { personalNo: p.day.branch + 1, basis: `出生時辰未知，改以出生日支${BRANCHES[p.day.branch]}（數 ${p.day.branch + 1}）代替時辰`, timeKnown: false };
      return {
        ok: true, data: natal, stamp: ICHING_META.stamp, warnings: natal.timeKnown ? [] : [natal.basis],
        facts: [{ key: "iching.natal.personalNo", value: natal.personalNo, label: "起卦個人數", derivation: natal.basis, system: "iching" }],
      };
    } catch (e) {
      return { ok: false, reason: "invalid_input", message: (e as Error).message, stamp: ICHING_META.stamp };
    }
  },
  computeTransit(natal, _input, at) {
    const reading = castDaily(at.civilDate, natal.personalNo, natal.basis);
    return { ok: true, data: { reading }, facts: ichingFacts(reading), stamp: ICHING_META.stamp, warnings: natal.timeKnown ? [] : [natal.basis] };
  },
};
