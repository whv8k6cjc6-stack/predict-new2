/** Qimen Engine：時家奇門・轉盤・拆補法。
 *  以精確節氣定局，夜子時（23 時後）日柱算次日；天禽寄坤二宮；八神命名可選現代（白虎、玄武）或古法（陽遁勾陳、朱雀）。 */
import { BRANCHES, STEMS, type GanZhi } from "../calendar/ganzhi";
import { fourPillars } from "../calendar/pillars";
import { resolveBirth, resolveCivil } from "../calendar/resolve";
import { preciseTermNear } from "../calendar/precise";
import { SOLAR_TERMS, sunLongitude, termDeg } from "../calendar/astro";
import type { DivinationEngine, EngineMeta, Fact } from "../engine";
import { KE_YING, keyingTextId, qimenTextId as T, type QimenSourceKey } from "@/kb/qimen/classics";

export const PALACE_DIR: Record<number, string> = { 1: "北", 8: "東北", 3: "東", 4: "東南", 9: "南", 2: "西南", 7: "西", 6: "西北", 5: "中" };
export const PALACE_GUA: Record<number, string> = { 1: "坎", 8: "艮", 3: "震", 4: "巽", 9: "離", 2: "坤", 7: "兌", 6: "乾", 5: "中" };
export const PALACE_ELEMENT: Record<number, string> = { 1: "水", 8: "土", 3: "木", 4: "木", 9: "火", 2: "土", 7: "金", 6: "金", 5: "土" };
export const PALACE_BRANCHES: Record<number, number[]> = { 1: [0], 8: [1, 2], 3: [3], 4: [4, 5], 9: [6], 2: [7, 8], 7: [9], 6: [10, 11], 5: [] };
const RING = [1, 8, 3, 4, 9, 2, 7, 6];
const STAR_OF: Record<number, string> = { 1: "天蓬", 8: "天任", 3: "天沖", 4: "天輔", 9: "天英", 2: "天芮", 7: "天柱", 6: "天心", 5: "天禽" };
const DOOR_OF: Record<number, string> = { 1: "休門", 8: "生門", 3: "傷門", 4: "杜門", 9: "景門", 2: "死門", 7: "驚門", 6: "開門" };
const GODS_MODERN = ["值符", "螣蛇", "太陰", "六合", "白虎", "玄武", "九地", "九天"];
const GODS_CLASSIC_YANG = ["值符", "螣蛇", "太陰", "六合", "勾陳", "朱雀", "九地", "九天"];
export const GOOD_DOORS = ["開門", "休門", "生門"]; export const BAD_DOORS = ["死門", "驚門", "傷門"];
export const GOOD_STARS = ["天輔", "天禽", "天心", "天任"]; export const BAD_STARS = ["天蓬", "天芮", "天柱"];
export const GOOD_GODS = ["值符", "九天", "九地", "太陰", "六合"]; export const BAD_GODS = ["白虎", "玄武", "螣蛇", "勾陳", "朱雀"];
const DOOR_EL: Record<string, string> = { 休門: "水", 生門: "土", 傷門: "木", 杜門: "木", 景門: "火", 死門: "土", 驚門: "金", 開門: "金" };
const KE: Record<string, string> = { 木: "土", 土: "水", 水: "火", 火: "金", 金: "木" };

const JU_TABLE: Record<string, [number, number, number]> = {
  冬至: [1, 7, 4], 小寒: [2, 8, 5], 大寒: [3, 9, 6], 立春: [8, 5, 2], 雨水: [9, 6, 3], 驚蟄: [1, 7, 4],
  春分: [3, 9, 6], 清明: [4, 1, 7], 穀雨: [5, 2, 8], 立夏: [4, 1, 7], 小滿: [5, 2, 8], 芒種: [6, 3, 9],
  夏至: [-9, -3, -6], 小暑: [-8, -2, -5], 大暑: [-7, -1, -4], 立秋: [-2, -5, -8], 處暑: [-1, -4, -7], 白露: [-9, -3, -6],
  秋分: [-7, -1, -4], 寒露: [-6, -9, -3], 霜降: [-5, -8, -2], 立冬: [-6, -9, -3], 小雪: [-5, -8, -2], 大雪: [-4, -7, -1],
};

export type QimenGodNaming = "modern" | "classic";

export interface QimenChart {
  term: string; yang: boolean; ju: number; yuan: "上元" | "中元" | "下元";
  pillars: { year: string; month: string; day: string; hour: string };
  hourGz: GanZhi; xunHead: string; fuShou: string;
  ground: Record<number, string>; sky: Record<number, string>;
  doors: Record<number, string>; stars: Record<number, string>; gods: Record<number, string>;
  zhiFu: string; zhiShi: string; zhiFuPalace: number; zhiShiPalace: number;
  kong: number[]; yima: number; yimaPalace: number;
  /** 日空亡（日柱所在旬的空亡地支） */
  dayKong: number[];
  /** 伏吟：值符（星）或值使（門）仍在本位；反吟：落到對宮 */
  fuyin: { star: boolean; door: boolean }; fanyin: { star: boolean; door: boolean };
  /** 五不遇時（干支定式：《遁甲演義》《寶鑑》十組）；wuBuYuLoose＝陽克陽陰克陰（《法竅》，含定式） */
  wuBuYu: boolean; wuBuYuLoose: boolean;
  /** 截路空亡（《元靈經》：該日特定時辰忌出行） */
  jieLu: boolean;
  method: "chaibu"; godNaming: QimenGodNaming;
  /** 排盤時間基準：standard＝標準時間；trueSolar＝真太陽時 */
  timeBasis: "standard" | "trueSolar";
}

export function xunYi(index: number) {
  const head = (((index % 60) + 60) % 60) - ((((index % 60) + 60) % 60) % 10);
  return { head, yi: ({ 0: "戊", 10: "己", 20: "庚", 30: "辛", 40: "壬", 50: "癸" } as Record<number, string>)[head], headText: "甲" + BRANCHES[head % 12] };
}

/** 精確判定所在節氣（24 氣） */
function preciseTerm(jdUT: number) {
  const lon = sunLongitude(jdUT);
  let i = Math.floor((((lon - 315) % 360) + 360) % 360 / 15);
  const at = (k: number) => { const idx = ((k % 24) + 24) % 24; return preciseTermNear(jdUT + ((((termDeg(idx) - lon) + 540) % 360) - 180) / 0.98565); };
  if (jdUT < at(i)) i -= 1; else if (jdUT >= at(i + 1)) i += 1;
  return SOLAR_TERMS[((i % 24) + 24) % 24];
}

/** 五不遇時干支定式（《遁甲演義》葛洪注列十組；《寶鑑》以「庚加午逆行，越過戌亥」推得同一組） */
export const WU_BU_YU_PILLARS: Record<string, string> = { 甲: "庚午", 乙: "辛巳", 丙: "壬辰", 丁: "癸卯", 戊: "甲寅", 己: "乙丑", 庚: "丙子", 辛: "丁酉", 壬: "戊申", 癸: "己未" };
/** 截路空亡（《元靈經》：甲己申酉、乙庚午未、丙辛辰巳、丁壬寅卯、戊癸子丑） */
export const JIE_LU: Record<string, string[]> = { 甲: ["申", "酉"], 己: ["申", "酉"], 乙: ["午", "未"], 庚: ["午", "未"], 丙: ["辰", "巳"], 辛: ["辰", "巳"], 丁: ["寅", "卯"], 壬: ["寅", "卯"], 戊: ["子", "丑"], 癸: ["子", "丑"] };

/** 時干剋日干、陰陽相同（陽剋陽、陰剋陰）＝《法竅》讀法（即七殺）；干支定式為其子集 */
export function isWuBuYu(dayStem: number, hourStem: number) {
  const el = (i: number) => Math.floor(i / 2); // 木火土金水
  return hourStem % 2 === dayStem % 2 && (el(hourStem) + 2) % 5 === el(dayStem);
}

export function computeQimenChart(date: string, time: string, timeZone: string, godNaming: QimenGodNaming = "modern", opts: { trueSolar?: { longitude: number } | null } = {}): QimenChart {
  const r = resolveCivil({ date, time, timeZone, trueSolar: opts.trueSolar ?? null });
  const p = fourPillars(r, "earlyZiNextDay");
  const dp = p.day, hp = p.hour!;
  const term = preciseTerm(r.jdUT);
  const back = dp.index % 5;
  const headBranch = (((dp.index - back) % 12) + 12) % 12;
  const yuanIdx = [0, 6, 3, 9].includes(headBranch) ? 0 : [2, 8, 5, 11].includes(headBranch) ? 1 : 2;
  const raw = JU_TABLE[term][yuanIdx];
  const yang = raw > 0, ju = Math.abs(raw);
  const SEQ = ["戊", "己", "庚", "辛", "壬", "癸", "丁", "丙", "乙"];
  const ground: Record<number, string> = {};
  for (let i = 0; i < 9; i++) ground[(((ju - 1 + (yang ? i : -i)) % 9) + 9) % 9 + 1] = SEQ[i];
  const { head: xunHead, yi, headText } = xunYi(hp.index);
  const findPal = (g: string) => Number(Object.keys(ground).find(k => ground[Number(k)] === g));
  const p0 = findPal(yi);
  const zhiFu = STAR_OF[p0], zhiShi = p0 === 5 ? DOOR_OF[2] : DOOR_OF[p0];
  const hourStem = STEMS[hp.stem];
  let p1 = findPal(hourStem === "甲" ? yi : hourStem); if (p1 === 5) p1 = 2;
  const p0r = p0 === 5 ? 2 : p0;
  const ringPos = (pal: number) => RING.indexOf(pal);
  const stars: Record<number, string> = {}, sky: Record<number, string> = {};
  const shift = ringPos(p1) - ringPos(p0r);
  for (let i = 0; i < 8; i++) {
    const from = RING[i], to = RING[(i + shift + 8) % 8];
    stars[to] = STAR_OF[from];
    sky[to] = ground[from] + (from === 2 ? "/" + ground[5] : "");
  }
  stars[5] = "天禽"; sky[5] = ground[5];
  const steps = hp.index - xunHead;
  let pd = (((p0 - 1 + (yang ? steps : -steps)) % 9) + 9) % 9 + 1;
  if (pd === 5) pd = 2;
  const doors: Record<number, string> = {};
  const dShift = ringPos(pd) - ringPos(p0 === 5 ? 2 : p0);
  for (let i = 0; i < 8; i++) doors[RING[(i + dShift + 8) % 8]] = DOOR_OF[RING[i]];
  doors[5] = "";
  const gods: Record<number, string> = {};
  const names = godNaming === "classic" && yang ? GODS_CLASSIC_YANG : GODS_MODERN;
  for (let i = 0; i < 8; i++) gods[RING[((ringPos(p1) + (yang ? i : -i)) % 8 + 8) % 8]] = names[i];
  gods[5] = "";
  const hb0 = xunHead % 12;
  const kong = [(hb0 + 10) % 12, (hb0 + 11) % 12];
  const yimaB = [2, 8, 11, 5][[8, 0, 4].includes(hp.branch) ? 0 : [2, 6, 10].includes(hp.branch) ? 1 : [5, 9, 1].includes(hp.branch) ? 2 : 3];
  const yimaPalace = Number(Object.entries(PALACE_BRANCHES).find(([, bs]) => bs.includes(yimaB))![0]);
  const dh = (dp.index - (dp.index % 10)) % 12;
  const dayKong = [(dh + 10) % 12, (dh + 11) % 12];
  const sh = ((shift % 8) + 8) % 8, dsh = ((dShift % 8) + 8) % 8;
  return {
    term, yang, ju, yuan: (["上元", "中元", "下元"] as const)[yuanIdx],
    pillars: { year: p.year.text, month: p.month.text, day: dp.text, hour: hp.text },
    hourGz: hp, xunHead: headText, fuShou: yi, ground, sky, doors, stars, gods,
    zhiFu, zhiShi, zhiFuPalace: p1, zhiShiPalace: pd, kong, yima: yimaB, yimaPalace, method: "chaibu", godNaming,
    dayKong, fuyin: { star: sh === 0, door: dsh === 0 }, fanyin: { star: sh === 4, door: dsh === 4 },
    wuBuYu: WU_BU_YU_PILLARS[STEMS[dp.stem]] === hp.text, wuBuYuLoose: isWuBuYu(dp.stem, hp.stem),
    jieLu: JIE_LU[STEMS[dp.stem]].includes(BRANCHES[hp.branch]),
    timeBasis: r.chartLocal.basis,
  };
}

// ───────── 宮位評估（每則附典籍出處與讀法） ─────────
/** 十干克應中《統宗》〈奇門四十格〉亦列為格者，權重較大；其餘依斷語吉凶小幅加減，中性（依門而定）不加減 */
const KEYING_MAJOR: Record<string, number> = { 戊丙: 3, 丙戊: 3, 乙辛: -3, 辛乙: -3, 丙庚: -2, 庚丙: -2, 庚癸: -2, 庚己: -2, 丁癸: -2, 庚壬: -1.5, 庚戊: -1.5 };

/** 六儀擊刑：天盤六儀落入與其旬首地支相刑之宮 */
export const JIXING: Record<string, number> = { 戊: 3, 己: 2, 庚: 8, 辛: 9, 壬: 4, 癸: 4 };
/** 三奇入墓：乙坤、丙乾各書一致；丁奇有「丁墓艮八」（統宗、旨歸）與「丁墓乾六」（寶鑑）兩說 */
export const QI_MU: { qi: string; palace: number; reading: string | null; delta: number; src: QimenSourceKey[] }[] = [
  { qi: "乙", palace: 2, reading: null, delta: -1, src: ["統宗_四十格", "旨歸_入墓", "寶鑑_奇墓"] },
  { qi: "丙", palace: 6, reading: null, delta: -1, src: ["統宗_四十格", "旨歸_入墓", "寶鑑_奇墓"] },
  { qi: "丁", palace: 8, reading: "丁墓艮八（統宗、旨歸）", delta: -1, src: ["統宗_四十格", "旨歸_入墓"] },
  { qi: "丁", palace: 6, reading: "丁墓乾六（寶鑑，丙丁同屬火）", delta: -0.5, src: ["寶鑑_奇墓"] },
];
/** 三奇得使：乙加辛己、丙加戊庚、丁加癸壬（《統宗》〈奇門四十格〉） */
const DE_SHI: Record<string, string[]> = { 乙: ["辛", "己"], 丙: ["戊", "庚"], 丁: ["癸", "壬"] };
const GEN: Record<string, string> = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };

/** kind：keying＝十干克應；dun＝三遁；deshi＝三奇得使（十干克應有同名格，例：丁加乙亦名「人遁」，以 kind 區分） */
export interface PalaceNote { term: string; plain: string; delta: number; textIds?: string[]; reading?: string; kind?: "keying" | "dun" | "deshi" }
export interface PalaceEval { palace: number; dir: string; door: string; star: string; god: string; sky: string; ground: string; score: number; kong: boolean; yima: boolean; notes: PalaceNote[] }

export function evalPalace(c: QimenChart, palIn: number): PalaceEval {
  const pal = palIn === 5 ? 2 : palIn;
  const door = c.doors[pal], star = c.stars[pal], god = c.gods[pal], sky = c.sky[pal], ground = c.ground[pal];
  const top = sky.split("/")[0];
  const notes: PalaceNote[] = [];
  if (GOOD_DOORS.includes(door)) notes.push({ term: door, plain: "吉門臨宮", delta: 2 });
  else if (BAD_DOORS.includes(door)) notes.push({ term: door, plain: "凶門臨宮", delta: -2 });
  if (GOOD_STARS.includes(star)) notes.push({ term: star, plain: "吉星臨宮", delta: 1 });
  else if (BAD_STARS.includes(star)) notes.push({ term: star, plain: "凶星臨宮", delta: -1 });
  if (GOOD_GODS.includes(god)) notes.push({ term: god, plain: "吉神臨宮", delta: 1 });
  else if (BAD_GODS.includes(god)) notes.push({ term: god, plain: "凶神臨宮", delta: -1 });
  // 門宮生剋（《法竅》）：門剋宮＝門迫；宮剋門＝宮迫（賦「宮制其門不為迫」與註「宮迫」書內異說，減半計）；宮生門＝和義
  const de = DOOR_EL[door], pe = PALACE_ELEMENT[pal];
  if (de && KE[de] === pe) notes.push({ term: "門迫", plain: `${door}剋宮，吉門減吉、凶門更凶`, delta: -1, textIds: [T("法竅_迫制註"), T("法竅_論八門迫制")] });
  else if (de && KE[pe] === de) notes.push({ term: "宮迫", plain: `宮剋${door}（主剋客）`, delta: -0.5, textIds: [T("法竅_迫制註"), T("法竅_迫制賦")], reading: "《法竅》賦云「宮制其門不為迫」，其註則名「宮迫」，書內異說" });
  else if (de && GEN[pe] === de) notes.push({ term: "和義", plain: `宮生${door}，吉門益吉、凶門不凶`, delta: 0.5, textIds: [T("法竅_迫制賦"), T("法竅_論八門迫制")] });
  // 十干克應（天盤干加地盤干，《奇門旨歸》卷五）
  const ky = KE_YING[top + ground];
  if (ky) {
    const d = KEYING_MAJOR[top + ground] ?? (ky.jixiong === "吉" ? 0.5 : ky.jixiong === "凶" ? -0.5 : 0);
    notes.push({ term: ky.name, plain: `十干克應：天盤${top}加地盤${ground}，${ky.jixiong === "中性" ? "吉凶依門而定" : `屬${ky.jixiong}格`}`, delta: d, textIds: [keyingTextId(top + ground)], kind: "keying" });
  }
  // 六儀擊刑：嚴式（值符之儀）計分；寬式（任一六儀）只小幅計
  if (JIXING[top] === pal) {
    const strict = top === c.fuShou;
    notes.push({ term: "六儀擊刑", plain: `天盤${top}落${PALACE_GUA[pal]}宮相刑，主衝突、受挫`, delta: strict ? -2 : -0.5,
      textIds: strict ? [T("法竅_擊刑"), T("寶鑑_擊刑")] : [T("寶鑑_擊刑")], reading: strict ? "嚴式（值符之儀）" : "寬式（任一六儀）" });
  }
  for (const m of QI_MU) if (top === m.qi && pal === m.palace)
    notes.push({ term: "三奇入墓", plain: `${m.qi}奇落${PALACE_GUA[pal]}宮入墓，奇氣受困、施展不開`, delta: m.delta, textIds: m.src.map(T), ...(m.reading ? { reading: m.reading } : {}) });
  if (DE_SHI[top]?.includes(ground)) notes.push({ term: "三奇得使", plain: `天盤${top}奇加地盤${ground}，三奇得使`, delta: 1, textIds: [T("統宗_得使")], kind: "deshi" });
  const dun = door === "生門" && top === "丙" && ground === "丁" ? "天遁" : door === "開門" && top === "乙" && ground === "己" ? "地遁" : door === "休門" && top === "丁" && god === "太陰" ? "人遁" : null;
  if (dun) notes.push({ term: dun, plain: `${dun}：吉門、三奇與地盤／八神相合`, delta: 2, textIds: [T("法竅_三遁")], kind: "dun" });
  if (["乙", "丙", "丁"].includes(top) && GOOD_DOORS.includes(door)) notes.push({ term: "三奇得門", plain: "三奇與吉門同宮，事情有轉機與貴氣", delta: 1 });
  const hk = PALACE_BRANCHES[pal].some(b => c.kong.includes(b)), dk = PALACE_BRANCHES[pal].some(b => c.dayKong.includes(b));
  const kong = hk || dk;
  const yima = c.yimaPalace === pal;
  let score = notes.reduce((s, n) => s + n.delta, 0);
  if (kong) { notes.push({ term: "空亡", plain: `所臨宮位逢${[hk ? "時" : "", dk ? "日" : ""].filter(Boolean).join("、")}旬空，吉凶皆減半、事多落空待時`, delta: 0 }); score *= 0.5; }
  if (yima) notes.push({ term: "驛馬", plain: "時辰驛馬臨宮，主動、主速、主遠行", delta: 0 });
  return { palace: pal, dir: PALACE_DIR[pal], door, star, god, sky, ground, score, kong, yima, notes };
}

export function findPalace(c: QimenChart, kind: "door" | "god" | "star" | "sky", name: string): number | null {
  const map = kind === "door" ? c.doors : kind === "god" ? c.gods : kind === "star" ? c.stars : c.sky;
  for (const pal of RING) { const v = map[pal] ?? ""; if (kind === "sky" ? v.split("/").includes(name) : v === name) return pal; }
  return null;
}

const REL = (self: string, other: string) => {
  const GEN: Record<string, string> = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };
  if (self === other) return { name: "比和", delta: 1 };
  if (GEN[other] === self) return { name: "生我", delta: 1.5 };
  if (KE[other] === self) return { name: "剋我", delta: -1.5 };
  if (KE[self] === other) return { name: "我剋", delta: 0.5 };
  return { name: "我生", delta: -0.5 };
};

// ───────── 事件用神 ─────────
export type EventKind = "overall" | "career" | "wealth" | "investment" | "social" | "love" | "travel" | "health" | "decision"
  | "interview" | "jobchange" | "trip" | "contract" | "house" | "car" | "negotiation" | "confession" | "move" | "medical" | "meeting" | "visitBoss" | "apply"
  | "leave" | "resign";
export const YONGSHEN: Record<EventKind, { label: string; use: { kind: "door" | "god" | "star"; name: string }[]; plain: string }> = {
  overall: { label: "整體", use: [], plain: "以年命代表自身" },
  career: { label: "工作", use: [{ kind: "door", name: "開門" }], plain: "開門主事業、公務與開展" },
  wealth: { label: "財運", use: [{ kind: "door", name: "生門" }], plain: "生門主利潤與生財" },
  investment: { label: "投資", use: [{ kind: "door", name: "生門" }, { kind: "god", name: "值符" }], plain: "生門主利潤、值符主大勢" },
  social: { label: "人際", use: [{ kind: "god", name: "六合" }, { kind: "god", name: "值符" }], plain: "六合主合作、值符主貴人上司" },
  love: { label: "感情", use: [{ kind: "god", name: "六合" }], plain: "六合主婚姻與感情" },
  travel: { label: "出行", use: [{ kind: "door", name: "開門" }, { kind: "god", name: "九天" }], plain: "開門主出行開展、九天主遠行" },
  health: { label: "健康", use: [{ kind: "star", name: "天心" }], plain: "天心主醫藥調養（兼看天芮病星是否臨年命）" },
  decision: { label: "決策", use: [{ kind: "god", name: "值符" }], plain: "值符主大局與主導" },
  interview: { label: "面試", use: [{ kind: "door", name: "開門" }, { kind: "door", name: "景門" }], plain: "開門主職位、景門主表現與文書" },
  jobchange: { label: "換工作", use: [{ kind: "door", name: "開門" }], plain: "開門主新職、開展" },
  trip: { label: "旅行", use: [{ kind: "door", name: "開門" }, { kind: "god", name: "九天" }], plain: "開門主出行、九天主遠行" },
  contract: { label: "簽約", use: [{ kind: "god", name: "六合" }, { kind: "door", name: "景門" }], plain: "六合主契約合作、景門主文書" },
  house: { label: "買房", use: [{ kind: "door", name: "生門" }, { kind: "god", name: "九地" }], plain: "生門主房產利益、九地主土地穩固" },
  car: { label: "買車", use: [{ kind: "door", name: "生門" }, { kind: "god", name: "九天" }], plain: "生門主財物、九天主動" },
  negotiation: { label: "談判", use: [{ kind: "god", name: "六合" }, { kind: "door", name: "開門" }], plain: "六合主協議、開門主局面開展" },
  confession: { label: "告白", use: [{ kind: "god", name: "六合" }], plain: "六合主感情撮合" },
  move: { label: "搬家", use: [{ kind: "door", name: "開門" }, { kind: "god", name: "九地" }], plain: "開門主遷動、九地主安居" },
  medical: { label: "醫療安排", use: [{ kind: "star", name: "天心" }], plain: "天心主醫生與療法（天芮為病）" },
  meeting: { label: "重要會議", use: [{ kind: "door", name: "開門" }, { kind: "god", name: "值符" }], plain: "開門主公務、值符主主持者" },
  visitBoss: { label: "拜訪主管", use: [{ kind: "god", name: "值符" }], plain: "值符主上司與貴人" },
  leave: { label: "請假", use: [{ kind: "door", name: "休門" }, { kind: "god", name: "值符" }], plain: "休門主休息與休假、值符主上司（准假）" },
  resign: { label: "辭職", use: [{ kind: "door", name: "開門" }, { kind: "god", name: "值符" }, { kind: "god", name: "六合" }], plain: "開門主職位、值符主上司、六合主交接與協議" },
  apply: { label: "提出申請", use: [{ kind: "door", name: "開門" }, { kind: "door", name: "景門" }], plain: "開門主公門、景門主文書" },
};

export interface YongshenEval { label: string; palace: number | null; eval: PalaceEval | null; relation: string; score: number; detail: string }

/** 某時辰盤中，某事件用神對年命（自身）的吉凶 */
/** score：含整盤時辰格局（排時段先後、事件時刻用）；base：不含（白天整體態勢用，避免每天固定出現的時辰格局讓整體系統性偏低） */
/** 代表自己的天干：year＝年命（出生年干，預設）；day＝該盤日干（擇時常用）。甲干皆取旬首遁儀 */
export type QimenSelfStem = "year" | "day";
export function selfStemOf(c: QimenChart, nianMing: string, mode: QimenSelfStem = "year") {
  if (mode === "year") return nianMing;
  const d = c.pillars.day[0];
  return d === "甲" ? xunYi(dayIndexOf(c)).yi : d;
}
/** 干支序（0＝甲子）：i ≡ 干 (mod 10)、i ≡ 支 (mod 12) */
const dayIndexOf = (c: QimenChart) => { const s = STEMS.indexOf(c.pillars.day[0] as typeof STEMS[number]), b = BRANCHES.indexOf(c.pillars.day[1] as typeof BRANCHES[number]); return (6 * s - 5 * b + 60) % 60; };

export function evalYongshen(c: QimenChart, nianMing: string, kind: EventKind, mode: QimenSelfStem = "year"): { self: PalaceEval; items: YongshenEval[]; score: number; base: number; patterns: ChartPattern[] } {
  const sp = findPalace(c, "sky", selfStemOf(c, nianMing, mode)) ?? 2;
  const self = evalPalace(c, sp);
  const items: YongshenEval[] = YONGSHEN[kind].use.map(u => {
    const pal = findPalace(c, u.kind, u.name);
    if (pal === null) return { label: u.name, palace: null, eval: null, relation: "—", score: 0, detail: `${u.name}不在外八宮` };
    const ev = evalPalace(c, pal);
    const rel = REL(PALACE_ELEMENT[self.palace], PALACE_ELEMENT[ev.palace]);
    return { label: u.name, palace: pal, eval: ev, relation: rel.name, score: ev.score + rel.delta, detail: `${u.name}落${ev.dir}宮（${ev.god}、${ev.star}、${ev.door}${ev.kong ? "、空亡" : ""}），與年命宮${rel.name}` };
  });
  let score = items.length ? items.reduce((s, x) => s + x.score, 0) / items.length : self.score;
  if (kind === "health" || kind === "medical") { const rui = findPalace(c, "star", "天芮"); if (rui === self.palace) score -= 2; }
  if (kind === "overall") score = self.score;
  const patterns = chartPatterns(c);
  const base = score;
  for (const p of patterns) score += p.delta;
  if (c.jieLu && ["travel", "trip", "move"].includes(kind)) score -= 2;
  return { self, items, score, base, patterns };
}

export interface ChartPattern { key: "wubuyu" | "wubuyuLoose" | "fuyin" | "fanyin" | "doorFuyin" | "doorFanyin" | "jielu"; term: string; plain: string; delta: number; textIds: string[]; reading?: string }
/** 整張盤（時辰）層級的格局。只影響時段先後與事件時刻，不計入白天整體平均。 */
export function chartPatterns(c: QimenChart): ChartPattern[] {
  const out: ChartPattern[] = [];
  if (c.wuBuYu) out.push({ key: "wubuyu", term: "五不遇時", plain: "時干剋日干（干支定式），傳統擇時避開的時辰", delta: -2, textIds: [T("釣叟_五不遇"), T("演義_五不遇"), T("寶鑑_五不遇")], reading: "干支定式（演義、寶鑑）" });
  else if (c.wuBuYuLoose) out.push({ key: "wubuyuLoose", term: "五不遇時（寬）", plain: "時干剋日干、陰陽相同，只見於《法竅》讀法", delta: -1, textIds: [T("法竅_五不遇")], reading: "陽克陽陰克陰（法竅，即七殺）" });
  if (c.fuyin.star) out.push({ key: "fuyin", term: "伏吟", plain: "天盤與地盤全同，凡事閉塞、靜守為吉", delta: -1, textIds: [T("旨歸_伏吟")] });
  else if (c.fuyin.door) out.push({ key: "doorFuyin", term: "門伏吟", plain: "值使仍在本位（本專案尚未找到引文，不計分）", delta: 0, textIds: [] });
  if (c.fanyin.star) out.push({ key: "fanyin", term: "反吟", plain: "值符星落到本位的對宮，事情容易反覆、變卦", delta: -1, textIds: [T("釣叟_反吟")] });
  else if (c.fanyin.door) out.push({ key: "doorFanyin", term: "門反吟", plain: "值使落到對宮（本專案尚未找到引文，不計分）", delta: 0, textIds: [] });
  if (c.jieLu) out.push({ key: "jielu", term: "截路空亡", plain: "該日此時辰忌出行（只影響出行類事件）", delta: 0, textIds: [T("元靈經_截路")] });
  return out;
}

export const SHI_CHEN = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
export const SHI_RANGE = ["23–01", "01–03", "03–05", "05–07", "07–09", "09–11", "11–13", "13–15", "15–17", "17–19", "19–21", "21–23"];
export const hourTimeOf = (i: number) => `${String(i === 0 ? 0 : i * 2).padStart(2, "0")}:30`;

export interface DayScan {
  charts: QimenChart[];
  byKind: Partial<Record<EventKind, { hourScores: number[]; best: number[]; avoid: number[]; daytimeAvg: number; bestDetail: string }>>;
  goodDirs: string[]; badDirs: string[];
  /** 各時辰的整盤格局（五不遇時、伏吟、反吟） */
  hourPatterns: ChartPattern[][];
}

/** 掃描一日 12 時辰：各事件用神分數、最佳與應避開時辰、吉方與不利方 */
export function scanDay(date: string, timeZone: string, nianMing: string, kinds: EventKind[], godNaming: QimenGodNaming = "modern", mode: QimenSelfStem = "year"): DayScan {
  const charts = SHI_CHEN.map((_, i) => computeQimenChart(date, hourTimeOf(i), timeZone, godNaming));
  const ACTIVE = [3, 4, 5, 6, 7, 8, 9, 10];
  const DAY = [4, 5, 6, 7, 8, 9];
  const byKind: DayScan["byKind"] = {};
  for (const k of kinds) {
    const evs = charts.map(c => evalYongshen(c, nianMing, k, mode));
    const hs = evs.map(e => Math.round(e.score * 10) / 10);
    const hb = evs.map(e => Math.round(e.base * 10) / 10);
    const sorted = ACTIVE.slice().sort((a, b) => hs[b] - hs[a]);
    // 五不遇時不列為較佳時段，並優先列入應避開
    const best = sorted.filter(i => hs[i] >= 1.5 && !charts[i].wuBuYu).slice(0, 2);
    const wby = ACTIVE.filter(i => charts[i].wuBuYu);
    const avoid = [...new Set([...wby, ...ACTIVE.slice().sort((a, b) => hs[a] - hs[b]).filter(i => hs[i] <= -1.5)])].slice(0, 2);
    const bi = sorted[0];
    const e = evs[bi];
    byKind[k] = {
      hourScores: hs, best, avoid, daytimeAvg: DAY.reduce((s, i) => s + hb[i], 0) / DAY.length,
      bestDetail: `${SHI_CHEN[bi]}時：${e.items.map(x => x.detail).join("；") || `年命落${e.self.dir}宮（${e.self.god}、${e.self.star}、${e.self.door}）`}`,
    };
  }
  const tally: Record<string, number> = {};
  DAY.forEach(i => {
    for (const pal of RING) { const ev = evalPalace(charts[i], pal); tally[ev.dir] = (tally[ev.dir] ?? 0) + ev.score; }
  });
  const dirs = Object.entries(tally).sort((a, b) => b[1] - a[1]);
  return { charts, byKind, goodDirs: dirs.filter(d => d[1] > 2).slice(0, 2).map(d => d[0]), badDirs: dirs.reverse().filter(d => d[1] < -2).slice(0, 2).map(d => d[0]), hourPatterns: charts.map(chartPatterns) };
}

/** 年命：出生年干（甲年遁於旬首六儀） */
export function nianMingOf(yearGz: GanZhi) { return STEMS[yearGz.stem] === "甲" ? xunYi(yearGz.index).yi : STEMS[yearGz.stem]; }

export function qimenFacts(scan: DayScan, kinds: EventKind[], nianMing: string, mode: QimenSelfStem = "year"): Fact[] {
  const f: Fact[] = [];
  const add = (key: string, value: unknown, label: string, derivation: string) => f.push({ key, value, label, derivation, system: "qimen" });
  if (mode === "day") add("qimen.nianMing", selfStemOf(scan.charts[6], nianMing, "day"), "代表自己的日干", "依設定以當日日干代表自己（甲日取旬首遁儀）");
  else add("qimen.nianMing", nianMing, "年命", "出生年干（甲年取旬首遁儀）");
  const c = scan.charts[6];
  add("qimen.term", `${c.term}${c.yuan}${c.yang ? "陽" : "陰"}遁${c.ju}局`, "定局", `拆補法：${c.term}${c.yuan}，${c.yang ? "陽" : "陰"}遁${c.ju}局`);
  add("qimen.goodDirs", scan.goodDirs, "吉方", "白天各時辰各宮門星神格局積分");
  add("qimen.badDirs", scan.badDirs, "不利方位", "白天各時辰各宮門星神格局積分");
  const ACT = [3, 4, 5, 6, 7, 8, 9, 10];
  const pat = ACT.flatMap(i => scan.hourPatterns[i].map(p => `${SHI_CHEN[i]}時（${SHI_RANGE[i]}）${p.term}`));
  add("qimen.hourPatterns", pat.length ? pat : ["白天沒有五不遇時、伏吟或反吟的時辰"], "白天整盤格局", "五不遇時（時干剋日干、陰陽相同）、星門伏吟（值符值使在本位）、反吟（落對宮）");
  for (const k of kinds) {
    const x = scan.byKind[k]!;
    const lvl = x.daytimeAvg >= 1.5 ? "good" : x.daytimeAvg <= -1 ? "bad" : "mixed";
    add(`qimen.${k}.level`, lvl, `${YONGSHEN[k].label}用神白天態勢`, `用神：${YONGSHEN[k].use.map(u => u.name).join("、") || "年命"}（${YONGSHEN[k].plain}）；白天平均 ${x.daytimeAvg.toFixed(1)}`);
    add(`qimen.${k}.avg`, Math.round(x.daytimeAvg * 10) / 10, `${YONGSHEN[k].label}白天平均`, "辰至酉六個時辰平均");
    const hrs = (a: number[], none: string) => a.length ? a.map(i => `${SHI_CHEN[i]}時（${SHI_RANGE[i]}）`) : [none];
    add(`qimen.${k}.best`, hrs(x.best, "無特別突出的時辰"), `${YONGSHEN[k].label}最佳時辰`, x.bestDetail);
    add(`qimen.${k}.avoid`, hrs(x.avoid, "無特別需避開的時辰"), `${YONGSHEN[k].label}應避開時辰`, "五不遇時優先；其次用神落凶門凶神、剋年命、擊刑入墓或逢凶格");
    add(`qimen.${k}.bestDetail`, x.bestDetail, `${YONGSHEN[k].label}最佳時辰盤面`, x.bestDetail);
    add(`qimen.${k}.yongshen`, YONGSHEN[k].use.map(u => u.name).join("、") || "年命", `${YONGSHEN[k].label}用神`, YONGSHEN[k].plain);
  }
  return f;
}

export const QIMEN_META: EngineMeta = {
  id: "qimen", name: "奇門遁甲", phase: 5, status: "verified",
  stamp: { school: "時家轉盤・拆補法", engine_version: "3.2.0", rule_version: "3.2.0", source_version: "qimen-dunjia 3.1.0 錄文（統宗、法竅、旨歸、寶鑑、演義、煙波釣叟歌、元靈經）" },
  summary: "九宮八門九星八神、值符值使、時日空亡、驛馬、五不遇時、伏吟反吟、十干克應、門迫宮迫和義、擊刑入墓、得使三遁、截路空亡、事件用神與吉時方位（各格附出處）",
};

export const QIMEN_KINDS: EventKind[] = ["overall", "career", "wealth", "investment", "social", "love", "travel", "health", "decision"];
/** 每日掃描另含請假、辭職（供建議的較佳時段使用；不另設領域規則） */
export const QIMEN_SCAN_KINDS: EventKind[] = [...QIMEN_KINDS, "leave", "resign"];

export interface QimenNatal { nianMing: string; birthYearGz: string; selfStem: QimenSelfStem }
export interface QimenTransit { date: string; scan: DayScan; kinds: EventKind[] }

/** 奇門以「時」為主：本命只取年命，行運為當日 12 時辰盤掃描 */
export const QimenEngine: DivinationEngine<QimenNatal, QimenTransit> = {
  meta: QIMEN_META,
  computeNatal(input) {
    try {
      const r = resolveBirth(input.birth);
      const p = fourPillars(r, input.settings.bazi.ziHour);
      const nianMing = nianMingOf(p.year);
      const facts: Fact[] = [{ key: "qimen.nianMing", value: nianMing, label: "年命", derivation: `出生年柱${p.year.text}${STEMS[p.year.stem] === "甲" ? "，甲遁旬首六儀" : ""}`, system: "qimen" }];
      return { ok: true, data: { nianMing, birthYearGz: p.year.text, selfStem: input.settings.qimen.selfStem ?? "year" }, facts, stamp: QIMEN_META.stamp, warnings: [] };
    } catch (e) {
      return { ok: false, reason: "invalid_input", message: (e as Error).message, stamp: QIMEN_META.stamp };
    }
  },
  computeTransit(natal, input, at) {
    const naming: QimenGodNaming = "modern";
    const scan = scanDay(at.civilDate, at.timeZone, natal.nianMing, QIMEN_KINDS, naming, natal.selfStem);
    return { ok: true, data: { date: at.civilDate, scan, kinds: QIMEN_KINDS }, facts: qimenFacts(scan, QIMEN_KINDS, natal.nianMing, natal.selfStem), stamp: QIMEN_META.stamp, warnings: [] };
  },
};

/** 事件模式：指定時刻的奇門盤，針對事件用神產生事實 */
export function qimenEventFacts(c: QimenChart, nianMing: string, kind: EventKind, hourLabel: string, mode: QimenSelfStem = "year"): Fact[] {
  const e = evalYongshen(c, nianMing, kind, mode);
  const s = Math.round(e.score * 10) / 10;
  const level = s >= 1.5 ? "good" : s <= -1.5 ? "bad" : "mixed";
  const detail = e.items.map(x => x.detail).join("；") || `年命落${e.self.dir}宮（${e.self.god}、${e.self.star}、${e.self.door}）`;
  const add = (key: string, value: unknown, label: string, derivation: string): Fact => ({ key: `qimen.event.${key}`, value, label, derivation, system: "qimen" });
  const pal = [e.self, ...e.items.map(x => x.eval).filter((x): x is PalaceEval => !!x)];
  const noteIn = (t: string, ok: (n: PalaceNote) => boolean = () => true) => pal.find(p => p.notes.some(n => n.term === t && !n.kind && ok(n)));
  const pt = (k: ChartPattern["key"]) => e.patterns.find(p => p.key === k);
  // 只採典籍明文的讀法觸發規則：擊刑取嚴式；入墓不含「丁墓乾六」一說
  const jx = noteIn("六儀擊刑", n => n.reading === "嚴式（值符之儀）"), rm = noteIn("三奇入墓", n => !n.reading?.startsWith("丁墓乾六"));
  const isDun = (n: PalaceNote) => n.kind === "dun" || n.kind === "deshi";
  const dun = pal.find(p => p.notes.some(isDun));
  return [
    add("wubuyu", !!pt("wubuyu"), "五不遇時", pt("wubuyu") ? "是" : "否"),
    add("wubuyuDetail", `${c.pillars.day}日${c.pillars.hour}時${pt("wubuyu") ? "，時干剋日干、陰陽相同" : "，不是五不遇時"}`, "五不遇時依據", "時干與日干的生剋與陰陽"),
    add("fuyin", !!pt("fuyin"), "伏吟", pt("fuyin") ? "是" : "否"),
    add("fuyinDetail", pt("fuyin") ? `${pt("fuyin")!.term}（值符${c.zhiFu}、值使${c.zhiShi}）` : "無伏吟", "伏吟依據", "值符、值使是否仍在本位"),
    add("fanyin", !!pt("fanyin"), "反吟", pt("fanyin") ? "是" : "否"),
    add("fanyinDetail", pt("fanyin") ? `${pt("fanyin")!.term}（值符${c.zhiFu}、值使${c.zhiShi}）` : "無反吟", "反吟依據", "值符、值使是否落到對宮"),
    add("jixing", !!jx, "用神或年命宮六儀擊刑", jx ? "是" : "否"),
    add("jixingDetail", jx ? `${jx.dir}宮：${jx.notes.find(n => n.term === "六儀擊刑")!.plain}` : "無擊刑", "擊刑依據", "天盤六儀落宮"),
    add("rumu", !!rm, "用神或年命宮三奇入墓", rm ? "是" : "否"),
    add("rumuDetail", rm ? `${rm.dir}宮：${rm.notes.find(n => n.term === "三奇入墓")!.plain}` : "無入墓", "入墓依據", "天盤三奇落宮"),
    add("sandun", !!dun, "用神或年命宮逢三遁或三奇得使", dun ? "是" : "否"),
    add("sandunDetail", dun ? `${dun.dir}宮：${dun.notes.filter(isDun).map(n => n.plain).join("；")}` : "無", "三遁、得使依據", "天盤三奇、地盤干、門與八神"),
    add("jielu", c.jieLu, "截路空亡", c.jieLu ? "是" : "否"),
    add("jieluDetail", `${c.pillars.day}日${c.pillars.hour}時${c.jieLu ? "，逢截路空亡" : "，不逢截路空亡"}`, "截路空亡依據", "日干與時支"),
    add("timeBasis", c.timeBasis === "trueSolar" ? "真太陽時" : "標準時間", "排盤時間基準", c.timeBasis === "trueSolar" ? "依所在地經度與均時差換算真太陽時判斷時辰" : "依標準時間判斷時辰"),
    add("kind", kind, "事件類型", YONGSHEN[kind].label),
    add("label", YONGSHEN[kind].label, "事件", YONGSHEN[kind].plain),
    add("level", level, "事件用神態勢", `分數 ${s}（≥1.5 有利、≤−1.5 不利）`),
    add("score", s, "事件用神分數", detail),
    add("detail", detail, "事件時辰盤面", `${c.term}${c.yuan}${c.yang ? "陽" : "陰"}遁${c.ju}局，${c.pillars.hour}時`),
    add("yongshen", YONGSHEN[kind].use.map(u => u.name).join("、") || "年命", "事件用神", YONGSHEN[kind].plain),
    add("hour", hourLabel, "事件時辰", hourLabel),
    add("term", `${c.term}${c.yuan}${c.yang ? "陽" : "陰"}遁${c.ju}局`, "定局", "拆補法"),
  ];
}
