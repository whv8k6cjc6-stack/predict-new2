/** Ziwei Engine：紫微斗數本命盤與流運（大限、流年、流月、流日）。
 *  安星依《紫微斗數全書》通行起例（中州派基準）；閏月、庚干四化依流派設定。 */
import { BRANCHES, STEMS, gzFrom, nayin, dayGz, type GanZhi } from "../calendar/ganzhi";
import { resolveBirth, resolveCivil, type ResolvedTime } from "../calendar/resolve";
import { toLunar } from "../calendar/precise";
import type { ChartInput, DivinationEngine, EngineMeta, Fact, Moment } from "../engine";
import type { SchoolProfile } from "../person";
import { BRIGHTNESS, BRIGHTNESS_SOURCE } from "@/kb/ziwei-brightness";

export const PALACES = ["命宮", "兄弟", "夫妻", "子女", "財帛", "疾厄", "遷移", "交友", "官祿", "田宅", "福德", "父母"] as const;
export type PalaceName = (typeof PALACES)[number];
export const MAJOR = ["紫微", "天機", "太陽", "武曲", "天同", "廉貞", "天府", "太陰", "貪狼", "巨門", "天相", "天梁", "七殺", "破軍"];
export const LUCKY6 = ["左輔", "右弼", "文昌", "文曲", "天魁", "天鉞"];
export const SHA6 = ["擎羊", "陀羅", "火星", "鈴星", "地空", "地劫"];
export const HUA = ["祿", "權", "科", "忌"] as const;
export type Hua = (typeof HUA)[number];

const SIHUA: Record<string, [string, string, string, string]> = {
  甲: ["廉貞", "破軍", "武曲", "太陽"], 乙: ["天機", "天梁", "紫微", "太陰"], 丙: ["天同", "天機", "文昌", "廉貞"],
  丁: ["太陰", "天同", "天機", "巨門"], 戊: ["貪狼", "太陰", "右弼", "天機"], 己: ["武曲", "貪狼", "天梁", "文曲"],
  庚: ["太陽", "武曲", "太陰", "天同"], 辛: ["巨門", "太陽", "文曲", "文昌"], 壬: ["天梁", "紫微", "左輔", "武曲"],
  癸: ["破軍", "巨門", "太陰", "貪狼"],
};
export function sihuaOf(stem: string, geng: SchoolProfile["ziwei"]["gengSihua"] = "陽武陰同"): Record<Hua, string> {
  let t = SIHUA[stem];
  if (stem === "庚" && geng === "陽武同陰") t = ["太陽", "武曲", "天同", "太陰"];
  return { 祿: t[0], 權: t[1], 科: t[2], 忌: t[3] };
}

const JU: Record<string, number> = { 水: 2, 木: 3, 金: 4, 土: 5, 火: 6 };
const JU_NAME: Record<number, string> = { 2: "水二局", 3: "木三局", 4: "金四局", 5: "土五局", 6: "火六局" };

export function ziweiPosition(ju: number, day: number): number {
  const q = Math.ceil(day / ju), r = q * ju - day;
  const pos = r === 0 ? q : r % 2 === 1 ? q - r : q + r;
  return (2 + ((pos - 1) % 12) + 12) % 12;
}
export function fireBell(yearBranch: number, hb: number) {
  const g = [2, 6, 10].includes(yearBranch) ? 0 : [8, 0, 4].includes(yearBranch) ? 1 : [5, 9, 1].includes(yearBranch) ? 2 : 3;
  return { fire: ([1, 2, 3, 9][g] + hb) % 12, bell: ([3, 10, 10, 10][g] + hb) % 12 };
}
const KUIYUE: [number, number][] = [[1, 7], [0, 8], [11, 9], [11, 9], [1, 7], [0, 8], [1, 7], [6, 2], [3, 5], [3, 5]]; // 甲戊庚丑未、乙己子申、丙丁亥酉、辛午寅、壬癸卯巳
const LUCUN = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0];
const m12 = (x: number) => ((x % 12) + 12) % 12;

export interface ZiweiPalace {
  branch: number; name: PalaceName; stem: number; gz: string;
  major: { name: string; brightness: string; hua?: Hua }[];
  minor: { name: string; brightness: string; hua?: Hua }[];
  misc: string[];
  decade: [number, number];
}

export interface ZiweiNatal {
  resolved: ResolvedTime;
  lunar: { year: number; month: number; day: number; isLeap: boolean; effectiveMonth: number };
  yearGz: GanZhi; hourBranch: number;
  lifeBranch: number; bodyBranch: number; bodyPalace: PalaceName;
  ju: number; juName: string;
  palaces: ZiweiPalace[];              // 依地支 0..11
  birthHua: Record<Hua, { star: string; palace: PalaceName | null }>;
  forward: boolean;
  starBranch: Record<string, number>;
  notes: string[];
}

export function computeZiweiNatal(input: ChartInput): ZiweiNatal {
  const r = resolveBirth(input.birth);
  if (!r.timeKnown) throw new Error("紫微斗數需要出生時辰");
  const L = r.chartLocal;
  const notes: string[] = [];
  // 子初換日依流派；紫微生日取排盤用當地時間之日期
  let base = new Date(Date.UTC(L.y, L.m - 1, L.d));
  if (L.h === 23 && input.school.bazi.ziHour === "earlyZiNextDay") { base = new Date(Date.UTC(L.y, L.m - 1, L.d + 1)); notes.push("生於子初，依設定以次日為紫微生日。"); }
  const lu = toLunar(base.getUTCFullYear(), base.getUTCMonth() + 1, base.getUTCDate());
  let effMonth = lu.month;
  if (lu.isLeap) {
    const rule = input.school.ziwei.leapMonth;
    effMonth = rule === "asCurrent" ? lu.month : rule === "asNext" ? (lu.month % 12) + 1 : (lu.day <= 15 ? lu.month : (lu.month % 12) + 1);
    notes.push(`生於閏${lu.month}月${lu.day}日，依「${rule === "splitAt15" ? "十五日前算本月、後算下月" : rule === "asCurrent" ? "一律算本月" : "一律算下月"}」以${effMonth}月安星。`);
  }
  const hb = Math.floor(((L.h + 1) % 24) / 2);
  // 年干支以農曆年（正月初一分年）
  const ys = (((lu.year - 4) % 10) + 10) % 10;
  const yb = m12(lu.year - 4);
  const yearGz = gzFrom(ys, yb);
  const life = m12(2 + (effMonth - 1) - hb);
  const body = m12(2 + (effMonth - 1) + hb);
  const stemOf = (b: number) => (((ys % 5) * 2 + 2) + m12(b - 2)) % 10;
  const lifeGz = gzFrom(stemOf(life), life);
  const juEl = nayin(lifeGz).slice(-1);
  const ju = JU[juEl];

  const stars: Record<string, number> = {};
  const zw = ziweiPosition(ju, lu.day);
  const tf = m12(4 - zw);
  Object.assign(stars, {
    紫微: zw, 天機: m12(zw - 1), 太陽: m12(zw - 3), 武曲: m12(zw - 4), 天同: m12(zw - 5), 廉貞: m12(zw - 8),
    天府: tf, 太陰: m12(tf + 1), 貪狼: m12(tf + 2), 巨門: m12(tf + 3), 天相: m12(tf + 4), 天梁: m12(tf + 5), 七殺: m12(tf + 6), 破軍: m12(tf + 10),
    左輔: m12(4 + effMonth - 1), 右弼: m12(10 - (effMonth - 1)), 文昌: m12(10 - hb), 文曲: m12(4 + hb),
    天魁: KUIYUE[ys][0], 天鉞: KUIYUE[ys][1],
    祿存: LUCUN[ys], 擎羊: m12(LUCUN[ys] + 1), 陀羅: m12(LUCUN[ys] - 1),
    地空: m12(11 - hb), 地劫: m12(11 + hb),
  });
  const fb = fireBell(yb, hb); stars.火星 = fb.fire; stars.鈴星 = fb.bell;
  const g3 = [8, 0, 4].includes(yb) ? 0 : [2, 6, 10].includes(yb) ? 1 : [5, 9, 1].includes(yb) ? 2 : 3;
  stars.天馬 = [2, 8, 11, 5][g3];
  stars.咸池 = [9, 3, 6, 0][g3];
  stars.紅鸞 = m12(3 - yb); stars.天喜 = m12(9 - yb);
  stars.天刑 = m12(9 + effMonth - 1); stars.天姚 = m12(1 + effMonth - 1);

  const hua = sihuaOf(STEMS[ys], input.school.ziwei.gengSihua);
  const huaOfStar = Object.fromEntries(HUA.map(h => [hua[h], h])) as Record<string, Hua>;
  const yang = ys % 2 === 0;
  const forward = (yang && input.gender === "male") || (!yang && input.gender === "female");
  const bright = (name: string, b: number) => BRIGHTNESS[name]?.[m12(b - 2)] ?? "";

  const palaces: ZiweiPalace[] = Array.from({ length: 12 }, (_, b) => {
    const idx = m12(life - b);                                       // 命宮起逆時針排十二宮
    const k = forward ? m12(b - life) : m12(life - b);
    const inHere = Object.entries(stars).filter(([, v]) => v === b).map(([n]) => n);
    const mk = (n: string) => ({ name: n, brightness: bright(n, b), hua: huaOfStar[n] });
    return {
      branch: b, name: PALACES[idx], stem: stemOf(b), gz: STEMS[stemOf(b)] + BRANCHES[b],
      major: inHere.filter(n => MAJOR.includes(n)).map(mk),
      minor: inHere.filter(n => LUCKY6.includes(n) || SHA6.includes(n) || n === "祿存" || n === "天馬").map(mk),
      misc: inHere.filter(n => ["咸池", "紅鸞", "天喜", "天刑", "天姚"].includes(n)),
      decade: [ju + k * 10, ju + k * 10 + 9] as [number, number],
    };
  });
  const palaceAt = (b: number) => palaces[b].name;
  const birthHua = Object.fromEntries(HUA.map(h => [h, { star: hua[h], palace: stars[hua[h]] !== undefined ? palaceAt(stars[hua[h]]) : null }])) as ZiweiNatal["birthHua"];

  return {
    resolved: r, lunar: { year: lu.year, month: lu.month, day: lu.day, isLeap: lu.isLeap, effectiveMonth: effMonth },
    yearGz, hourBranch: hb, lifeBranch: life, bodyBranch: body, bodyPalace: palaceAt(body),
    ju, juName: JU_NAME[ju], palaces, birthHua, forward, starBranch: stars, notes,
  };
}

// ───────── 流運 ─────────
export type ZScope = "decade" | "year" | "month" | "day";
export const Z_SCOPE_LABEL: Record<ZScope, string> = { decade: "目前大限", year: "流年", month: "流月", day: "流日" };

export interface ZiweiTransit {
  nominalAge: number;
  scopes: Record<ZScope, { lifeBranch: number; lifeOnNatal: PalaceName; stem: string; hua: Record<Hua, { star: string; palace: PalaceName | null }> } | null>;
  lunar: { year: number; month: number; day: number; isLeap: boolean };
}

export function computeZiweiTransit(n: ZiweiNatal, school: SchoolProfile, at: Moment): ZiweiTransit {
  const r = resolveCivil({ date: at.civilDate, time: at.civilTime, timeZone: at.timeZone });
  const L = r.chartLocal;
  const lu = toLunar(L.y, L.m, L.d);
  const nominalAge = lu.year - n.lunar.year + 1;                        // 虛歲
  const huaIn = (stem: string) => {
    const h = sihuaOf(stem, school.ziwei.gengSihua);
    return Object.fromEntries(HUA.map(k => [k, { star: h[k], palace: n.starBranch[h[k]] !== undefined ? n.palaces[n.starBranch[h[k]]].name : null }])) as Record<Hua, { star: string; palace: PalaceName | null }>;
  };
  const dp = n.palaces.find(p => nominalAge >= p.decade[0] && nominalAge <= p.decade[1]) ?? null;
  const yb = m12(lu.year - 4), ys = ((lu.year - 4) % 10 + 10) % 10;
  // 流月：閏月依同一流派規則歸月；斗君法定流月命宮、流月天干以流年干五虎遁
  const rule = school.ziwei.leapMonth;
  const flowMonth = !lu.isLeap ? lu.month : rule === "asCurrent" ? lu.month : rule === "asNext" ? (lu.month % 12) + 1 : (lu.day <= 15 ? lu.month : (lu.month % 12) + 1);
  const doujun = m12(yb - (n.lunar.effectiveMonth - 1) + n.hourBranch);
  const monthB = m12(doujun + flowMonth - 1);
  const dayB = m12(monthB + lu.day - 1);
  const dayStem = STEMS[dayGz(L.y, L.m, L.d).stem];
  const monthStem = STEMS[((ys % 5) * 2 + 2 + flowMonth - 1) % 10];
  return {
    nominalAge,
    lunar: { year: lu.year, month: lu.month, day: lu.day, isLeap: lu.isLeap },
    scopes: {
      decade: dp ? { lifeBranch: dp.branch, lifeOnNatal: dp.name, stem: STEMS[dp.stem], hua: huaIn(STEMS[dp.stem]) } : null,
      year: { lifeBranch: yb, lifeOnNatal: n.palaces[yb].name, stem: STEMS[ys], hua: huaIn(STEMS[ys]) },
      month: { lifeBranch: monthB, lifeOnNatal: n.palaces[monthB].name, stem: monthStem, hua: huaIn(monthStem) },
      day: { lifeBranch: dayB, lifeOnNatal: n.palaces[dayB].name, stem: dayStem, hua: huaIn(dayStem) },
    },
  };
}

/** 三方四正：本宮、對宮、兩個三合宮 */
export const sanfang = (b: number) => [b, m12(b + 6), m12(b + 4), m12(b + 8)];

// ───────── Facts ─────────
export function ziweiFacts(n: ZiweiNatal, t?: ZiweiTransit): Fact[] {
  const f: Fact[] = [];
  const add = (key: string, value: unknown, label: string, derivation: string) => f.push({ key, value, label, derivation, system: "ziwei" });
  const byName = (p: PalaceName) => n.palaces.find(x => x.name === p)!;
  add("ziwei.natal.life", byName("命宮").major.map(s => s.name), "命宮主星", `命宮在${BRANCHES[n.lifeBranch]}（${byName("命宮").gz}）`);
  add("ziwei.natal.ju", n.juName, "五行局", `命宮干支${byName("命宮").gz}納音`);
  add("ziwei.natal.body", n.bodyPalace, "身宮", `身宮在${BRANCHES[n.bodyBranch]}`);
  for (const p of n.palaces) {
    const sf = sanfang(p.branch).map(b => n.palaces[b]);
    const lucky = sf.flatMap(x => x.minor.filter(s => LUCKY6.includes(s.name) || s.name === "祿存").map(s => s.name));
    const sha = sf.flatMap(x => x.minor.filter(s => SHA6.includes(s.name)).map(s => s.name));
    const strong = p.major.filter(s => ["廟", "旺"].includes(s.brightness)).map(s => s.name);
    const weak = p.major.filter(s => ["陷", "不"].includes(s.brightness)).map(s => s.name);
    const k = `ziwei.natal.${p.name}`;
    add(`${k}.major`, p.major.length ? p.major.map(s => `${s.name}${s.brightness}`) : ["無主星（借對宮論）"], `${p.name}主星`, `${p.name}（${p.gz}）：${p.major.map(s => s.name + (s.brightness ? `（${s.brightness}）` : "")).join("、") || "無主星（借對宮）"}；亮度依 ${BRIGHTNESS_SOURCE}`);
    add(`${k}.strong`, strong, `${p.name}廟旺主星`, strong.join("、") || "無");
    add(`${k}.weak`, weak, `${p.name}落陷主星`, weak.join("、") || "無");
    add(`${k}.sfLucky`, lucky, `${p.name}三方四正吉星`, `三方四正（${sf.map(x => x.name).join("、")}）見：${lucky.join("、") || "無"}`);
    add(`${k}.sfSha`, sha, `${p.name}三方四正煞星`, `三方四正（${sf.map(x => x.name).join("、")}）見：${sha.join("、") || "無"}`);
    add(`${k}.sfLuckyN`, lucky.length, `${p.name}三方四正吉星數`, lucky.join("、") || "無");
    add(`${k}.sfShaN`, sha.length, `${p.name}三方四正煞星數`, sha.join("、") || "無");
  }
  for (const h of HUA) add(`ziwei.natal.hua.${h}`, n.birthHua[h].palace, `生年化${h}落宮`, `生年${n.yearGz.text}，${n.birthHua[h].star}化${h}${n.birthHua[h].palace ? `入${n.birthHua[h].palace}` : ""}`);
  if (!t) return f;
  add("ziwei.nominalAge", t.nominalAge, "虛歲", `流年農曆${t.lunar.year}年，虛歲${t.nominalAge}`);
  for (const s of ["decade", "year", "month", "day"] as ZScope[]) {
    const x = t.scopes[s];
    if (!x) continue;
    const L = Z_SCOPE_LABEL[s];
    add(`ziwei.${s}.stem`, x.stem, `${L}天干`, `${L}命宮干為${x.stem}`);
    add(`ziwei.${s}.life`, x.lifeOnNatal, `${L}命宮落本命宮位`, `${L}命宮在${BRANCHES[x.lifeBranch]}，即本命${x.lifeOnNatal}${s === "month" || s === "day" ? "（斗君法）" : ""}`);
    for (const h of HUA) {
      add(`ziwei.${s}.hua.${h}`, x.hua[h].palace, `${L}化${h}落宮`, `${L}天干${x.stem}，${x.hua[h].star}化${h}${x.hua[h].palace ? `入本命${x.hua[h].palace}` : ""}`);
      add(`ziwei.${s}.huaStar.${h}`, x.hua[h].star, `${L}化${h}之星`, `${x.stem}干${x.hua[h].star}化${h}`);
    }
    const ji = x.hua.忌.palace;
    if (ji) {
      const jb = n.palaces.find(p => p.name === ji)!.branch;
      add(`ziwei.${s}.jiChong`, n.palaces[m12(jb + 6)].name, `${L}化忌沖宮`, `化忌在${ji}，沖對宮${n.palaces[m12(jb + 6)].name}`);
    }
    const lp = n.palaces[x.lifeBranch];
    add(`ziwei.${s}.lifeStrong`, lp.major.some(m => ["廟", "旺"].includes(m.brightness)), `${L}命宮主星廟旺`, lp.major.map(m => m.name + m.brightness).join("、") || "無主星");
    add(`ziwei.${s}.lifeSha`, lp.minor.filter(m => SHA6.includes(m.name)).map(m => m.name), `${L}命宮煞星`, lp.minor.map(m => m.name).join("、") || "無");
  }
  return f;
}

export const ZIWEI_META: EngineMeta = {
  id: "ziwei", name: "紫微斗數", phase: 4, status: "verified",
  stamp: { school: "中州派基準・全書起例", engine_version: "3.0.0", rule_version: "3.0.0", source_version: BRIGHTNESS_SOURCE },
  summary: "十二宮、主輔煞雜曜、四化、三方四正、大限流年流月流日",
};

export const ZiweiEngine: DivinationEngine<ZiweiNatal, ZiweiTransit> = {
  meta: ZIWEI_META,
  computeNatal(input) {
    try { const d = computeZiweiNatal(input); return { ok: true, data: d, facts: ziweiFacts(d), stamp: ZIWEI_META.stamp, warnings: d.notes }; }
    catch (e) { return { ok: false, reason: input.birth.localTime ? "invalid_input" : "insufficient_data", message: (e as Error).message, stamp: ZIWEI_META.stamp }; }
  },
  computeTransit(natal, input, at) {
    const d = computeZiweiTransit(natal, input.school, at);
    return { ok: true, data: d, facts: ziweiFacts(natal, d), stamp: ZIWEI_META.stamp, warnings: [] };
  },
};
