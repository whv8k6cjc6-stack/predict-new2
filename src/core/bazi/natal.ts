/** 八字本命盤（不隨日期改變，可快取）。 */
import { BRANCHES, BRANCH_ELEMENT, ELEMENTS, STEMS, STEM_ELEMENT, gz, nayin, isYang, xunKong, type Element, type GanZhi } from "../calendar/ganzhi";
import { fourPillars, type FourPillars } from "../calendar/pillars";
import { resolveBirth, type ResolvedTime } from "../calendar/resolve";
import { preciseTermJD } from "../calendar/precise";
import { utcMsFromJd } from "../calendar/astro";
import type { ChartInput } from "../engine";
import {
  CTRL, GEN, GROUP_OF, HIDDEN, HIDDEN_ROLE, PILLAR_NAMES, branchPairRelations, ctrlBy, elementOfGroup, fullCombos,
  genBy, groupOfElement, lifeStage, stemRelation, tenGod, type LifeStage, type TenGod, type TenGodGroup,
} from "./data";

export interface PillarDetail {
  name: (typeof PILLAR_NAMES)[number];
  gz: GanZhi;
  stemTenGod: TenGod | "日主";
  hidden: { stem: number; text: string; role: string; weight: number; tenGod: TenGod }[];
  dmStage: LifeStage;        // 日主在此支的十二長生
  selfStage: LifeStage;      // 此柱天干坐此支
  nayin: string;
}

export type Role = "用神" | "喜神" | "忌神" | "仇神" | "閒神";

export interface BaziNatal {
  resolved: ResolvedTime;
  pillars: FourPillars;
  details: PillarDetail[];           // 年月日（時）
  dm: number; dmText: string; dmElement: Element; gender: "male" | "female";
  elementScore: Record<Element, number>;
  elementPercent: Record<Element, number>;
  season: { name: "春" | "夏" | "秋" | "冬"; seasonElement: Element; dmState: "旺" | "相" | "休" | "囚" | "死" };
  strength: { score: number; label: "身強" | "偏強" | "偏弱" | "身弱"; deling: number; dedi: number; deshi: number; notes: string[] };
  roots: { stem: string; pillar: string; branch: string; role: string }[];      // 通根
  transparent: { stem: string; fromBranch: string; toPillar: string }[];      // 透干
  relations: { type: string; members: string[] }[];
  pattern: { name: string; basis: string };
  tiaohou: { need: Element | null; basis: string; conflict: boolean };
  roles: Record<Role, Element>;
  roleOf: Record<Element, Role>;
  rolesMethod: string;
  rolesReasoning: string[];
  groupScore: Record<TenGodGroup, number>;
  luck: {
    forward: boolean;
    start: { years: number; months: number; days: number; exactYears: number; date: string };
    cycles: { gz: GanZhi; tenGod: TenGod; role: Role; startAge: number; startYear: number; endYear: number }[];
    basis: string;
  };
  kong: number[];                    // 日柱旬空
  warnings: string[];
}

const SEASON_OF = (b: number): BaziNatal["season"]["name"] => [2, 3, 4].includes(b) ? "春" : [5, 6, 7].includes(b) ? "夏" : [8, 9, 10].includes(b) ? "秋" : "冬";

export function computeBaziNatal(input: ChartInput): BaziNatal {
  const resolved = resolveBirth(input.birth);
  const zi = input.school.bazi.ziHour;
  const pillars = fourPillars(resolved, zi);
  const warnings = [...pillars.notes];
  if (!resolved.timeKnown) warnings.push("出生時間不詳：時柱與時柱相關判斷全部停用。");
  const dm = pillars.day.stem, dmEl = STEM_ELEMENT[dm];
  const list = [pillars.year, pillars.month, pillars.day, pillars.hour].map((g, i) => g ? { g, i } : null).filter(Boolean) as { g: GanZhi; i: number }[];

  const details: PillarDetail[] = list.map(({ g, i }) => ({
    name: PILLAR_NAMES[i], gz: g,
    stemTenGod: i === 2 ? "日主" : tenGod(dm, g.stem),
    hidden: HIDDEN[g.branch].map(([s, w], k) => ({ stem: s, text: STEMS[s], role: HIDDEN_ROLE[k], weight: w, tenGod: tenGod(dm, s) })),
    dmStage: lifeStage(dm, g.branch), selfStage: lifeStage(g.stem, g.branch), nayin: nayin(g),
  }));

  // 五行分數：天干 1、藏干依權重；月令（月支）× 1.5
  const score: Record<Element, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  for (const { g, i } of list) {
    score[STEM_ELEMENT[g.stem]] += 1;
    for (const [s, w] of HIDDEN[g.branch]) score[STEM_ELEMENT[s]] += w * (i === 1 ? 1.5 : 1);
  }
  const total = ELEMENTS.reduce((a, e) => a + score[e], 0);
  const percent = Object.fromEntries(ELEMENTS.map(e => [e, Math.round((score[e] / total) * 100)])) as Record<Element, number>;

  // 旺相休囚死（以月令五行論日主）
  const mb = pillars.month.branch;
  const seasonEl = BRANCH_ELEMENT[mb];
  const dmState: BaziNatal["season"]["dmState"] = seasonEl === dmEl ? "旺" : GEN[seasonEl] === dmEl ? "相" : GEN[dmEl] === seasonEl ? "休" : CTRL[dmEl] === seasonEl ? "囚" : "死";
  const deling = { 旺: 40, 相: 28, 休: 10, 囚: 6, 死: 0 }[dmState];
  const helps = (s: number) => STEM_ELEMENT[s] === dmEl || GEN[STEM_ELEMENT[s]] === dmEl;

  // 得地：年、日、時支藏干中之比劫印（通根）
  const roots: BaziNatal["roots"] = [];
  let dedi = 0;
  list.forEach(({ g, i }) => {
    HIDDEN[g.branch].forEach(([s, w], k) => {
      if (STEM_ELEMENT[s] === dmEl) { if (i !== 1) dedi += 10 * w; }
      else if (GEN[STEM_ELEMENT[s]] === dmEl) { if (i !== 1) dedi += 6 * w; }
    });
  });
  dedi = Math.min(30, Math.round(dedi));
  // 得勢：年、月、時干之比劫印
  let deshi = 0;
  list.forEach(({ g, i }) => { if (i !== 2 && helps(g.stem)) deshi += STEM_ELEMENT[g.stem] === dmEl ? 10 : 8; });
  deshi = Math.min(30, deshi);
  const sScore = Math.min(100, deling + dedi + deshi);
  const label: BaziNatal["strength"]["label"] = sScore >= 60 ? "身強" : sScore >= 50 ? "偏強" : sScore >= 40 ? "偏弱" : "身弱";
  const strengthNotes = [
    `得令：生於${BRANCHES[mb]}月（${seasonEl}當令），日主${dmEl}處「${dmState}」，${deling} 分`,
    `得地：年日時支藏干中的比劫、印星根氣，${dedi} 分（上限 30）`,
    `得勢：年月時干中的比劫、印星，${deshi} 分（上限 30）`,
  ];
  if (sScore >= 85 || sScore <= 15) warnings.push("日主極強或極弱，可能屬從格或專旺格；本系統以扶抑法論用神，建議由專業命理師複核。");

  // 通根與透干
  list.forEach(({ g: sg, i: si }) => {
    list.forEach(({ g: bg, i: bi }) => {
      HIDDEN[bg.branch].forEach(([s], k) => {
        if (STEM_ELEMENT[s] === STEM_ELEMENT[sg.stem]) roots.push({ stem: STEMS[sg.stem], pillar: PILLAR_NAMES[si], branch: `${PILLAR_NAMES[bi]}${BRANCHES[bg.branch]}`, role: HIDDEN_ROLE[k] });
      });
    });
  });
  const transparent: BaziNatal["transparent"] = [];
  list.forEach(({ g: bg, i: bi }) => HIDDEN[bg.branch].forEach(([s]) => {
    list.forEach(({ g: sg, i: si }) => { if (sg.stem === s) transparent.push({ stem: STEMS[s], fromBranch: `${PILLAR_NAMES[bi]}${BRANCHES[bg.branch]}`, toPillar: PILLAR_NAMES[si] }); });
  }));

  // 命局內部干支關係
  const relations: BaziNatal["relations"] = [];
  for (let a = 0; a < list.length; a++) for (let b = a + 1; b < list.length; b++) {
    const A = list[a], B = list[b];
    const sr = stemRelation(A.g.stem, B.g.stem);
    if (sr) relations.push({ type: `天干${sr}`, members: [`${PILLAR_NAMES[A.i]}${STEMS[A.g.stem]}`, `${PILLAR_NAMES[B.i]}${STEMS[B.g.stem]}`] });
    for (const r of branchPairRelations(A.g.branch, B.g.branch)) relations.push({ type: r, members: [`${PILLAR_NAMES[A.i]}${BRANCHES[A.g.branch]}`, `${PILLAR_NAMES[B.i]}${BRANCHES[B.g.branch]}`] });
  }
  const combos = fullCombos(list.map(x => x.g.branch));
  combos.sanhe.forEach(c => relations.push({ type: "三合", members: [c.name] }));
  combos.sanhui.forEach(c => relations.push({ type: "三會", members: [c.name] }));

  // 格局（子平月令取格）
  const pattern = decidePattern(dm, pillars, list);

  // 各類十神分數
  const groupScore = Object.fromEntries((["比劫", "食傷", "財星", "官殺", "印星"] as TenGodGroup[]).map(g => [g, score[elementOfGroup(dmEl, g)]])) as Record<TenGodGroup, number>;

  // 用神（扶抑法）與五神
  const reasoning: string[] = [];
  let useGroup: TenGodGroup;
  if (sScore >= 50) {
    if (groupScore.印星 > groupScore.比劫) { useGroup = "財星"; reasoning.push(`日主${label}，助身力量以印星（${groupScore.印星.toFixed(1)}）為主，取財星制印、洩身之有餘。`); }
    else if (groupScore.官殺 >= 1) { useGroup = "官殺"; reasoning.push(`日主${label}，比劫（${groupScore.比劫.toFixed(1)}）偏重且官殺有氣，取官殺制比劫。`); }
    else { useGroup = "食傷"; reasoning.push(`日主${label}，比劫偏重而官殺無力，取食傷洩秀。`); }
  } else {
    const drains: TenGodGroup[] = ["官殺", "財星", "食傷"];
    const top = drains.reduce((a, b) => (groupScore[b] > groupScore[a] ? b : a));
    if (top === "財星") { useGroup = "比劫"; reasoning.push(`日主${label}，財星（${groupScore.財星.toFixed(1)}）最重，取比劫幫身敵財。`); }
    else { useGroup = "印星"; reasoning.push(`日主${label}，${top}（${groupScore[top].toFixed(1)}）最重，取印星${top === "官殺" ? "化殺生身" : "制食傷、生身"}。`); }
  }
  const pairMap: Record<TenGodGroup, [TenGodGroup, TenGodGroup]> = {
    印星: ["比劫", "財星"], 比劫: ["印星", "官殺"], 財星: ["食傷", "比劫"], 官殺: ["財星", "食傷"], 食傷: ["財星", "印星"],
  };
  const U = elementOfGroup(dmEl, useGroup);
  const X = elementOfGroup(dmEl, pairMap[useGroup][0]);
  const J = elementOfGroup(dmEl, pairMap[useGroup][1]);
  const C = genBy(J);
  const idle = ELEMENTS.find(e => ![U, X, J, C].includes(e))!;
  const roles: Record<Role, Element> = { 用神: U, 喜神: X, 忌神: J, 仇神: C, 閒神: idle };
  const roleOf = Object.fromEntries((Object.entries(roles) as [Role, Element][]).map(([r, e]) => [e, r])) as Record<Element, Role>;
  reasoning.push(`用神 ${U}（${useGroup}）、喜神 ${X}（${pairMap[useGroup][0]}）、忌神 ${J}（${pairMap[useGroup][1]}）、仇神 ${C}（生忌神者）、閒神 ${idle}。`);

  // 調候
  const season = SEASON_OF(mb);
  const need: Element | null = season === "冬" ? "火" : season === "夏" ? "水" : null;
  const tiaohou = {
    need,
    basis: need ? `生於${season}季，命局${season === "冬" ? "寒" : "燥熱"}，調候需${need}。` : "生於春秋，寒暖較平，調候非首要。",
    conflict: !!need && (roleOf[need] === "忌神" || roleOf[need] === "仇神"),
  };
  if (tiaohou.conflict) reasoning.push(`調候需${need}，但依扶抑${need}為${roleOf[need!]}，兩法取捨有分歧；本系統以扶抑為主、調候為輔。`);

  // 大運
  const luck = computeLuck(resolved, pillars, dm, input.gender, roleOf);

  return {
    resolved, pillars, details, dm, dmText: STEMS[dm], dmElement: dmEl, gender: input.gender,
    elementScore: score, elementPercent: percent,
    season: { name: season, seasonElement: seasonEl, dmState },
    strength: { score: sScore, label, deling, dedi, deshi, notes: strengthNotes },
    roots, transparent, relations, pattern, tiaohou, roles, roleOf, rolesMethod: "扶抑法（身強洩剋、身弱生扶）＋調候參考",
    rolesReasoning: reasoning, groupScore, luck, kong: xunKong(pillars.day), warnings,
  };
}

function decidePattern(dm: number, p: FourPillars, list: { g: GanZhi; i: number }[]) {
  const mb = p.month.branch;
  const main = HIDDEN[mb][0][0];
  const tg = tenGod(dm, main);
  if (GROUP_OF[tg] === "比劫") {
    const stage = lifeStage(dm, mb);
    if (stage === "臨官") return { name: "建祿格", basis: `月令${BRANCHES[mb]}為日主之祿（臨官），不以比劫為格。` };
    if (stage === "帝旺" && isYang(dm)) return { name: "陽刃格", basis: `月令${BRANCHES[mb]}為陽干日主之刃（帝旺）。` };
  }
  const stems = list.filter(x => x.i !== 2).map(x => x.g.stem);
  for (const [s] of HIDDEN[mb]) {
    const t = tenGod(dm, s);
    if (stems.includes(s) && GROUP_OF[t] !== "比劫") return { name: `${t}格`, basis: `月令${BRANCHES[mb]}藏${STEMS[s]}透出天干，為${t}。` };
  }
  if (GROUP_OF[tg] !== "比劫") return { name: `${tg}格`, basis: `月令${BRANCHES[mb]}本氣${STEMS[main]}為${tg}（未透干，以本氣論）。` };
  return { name: "月劫格", basis: `月令${BRANCHES[mb]}本氣為比劫且非祿刃，格局以他神為用。` };
}

function computeLuck(r: ResolvedTime, p: FourPillars, dm: number, gender: "male" | "female", roleOf: Record<Element, Role>) {
  const yearYang = isYang(p.year.stem);
  const forward = (yearYang && gender === "male") || (!yearYang && gender === "female");
  const targetMs = forward ? p.jie.next.instantMs : p.jie.prev.instantMs;
  // 以整分鐘計：三日（4320 分）折一年、6 小時（360 分）折一月、12 分折一日
  const minutes = Math.abs(Math.floor(targetMs / 60_000) - Math.floor(r.instantMs / 60_000));
  const exactYears = minutes / 4320;
  const years = Math.floor(minutes / 4320);
  const months = Math.floor((minutes - years * 4320) / 360);
  const days = Math.floor((minutes - years * 4320 - months * 360) / 12);
  const b = new Date(r.instantMs + r.standardOffsetMinutes * 60_000);
  const startDate = new Date(Date.UTC(b.getUTCFullYear() + years, b.getUTCMonth() + months, b.getUTCDate() + days));
  const birthYear = b.getUTCFullYear();
  const cycles = Array.from({ length: 10 }, (_, i) => {
    const g = gz(p.month.index + (forward ? i + 1 : -(i + 1)));
    const startAge = exactYears + i * 10;
    return {
      gz: g, tenGod: tenGod(dm, g.stem), role: roleOf[STEM_ELEMENT[g.stem]],
      startAge: Math.round(startAge * 10) / 10,
      startYear: startDate.getUTCFullYear() + i * 10, endYear: startDate.getUTCFullYear() + i * 10 + 9,
    };
  });
  void birthYear;
  return {
    forward,
    start: { years, months, days, exactYears, date: startDate.toISOString().slice(0, 10) },
    cycles,
    basis: `${yearYang ? "陽" : "陰"}年生${gender === "male" ? "男" : "女"}命，大運${forward ? "順" : "逆"}排；出生至${forward ? "下一個" : "上一個"}節「${forward ? p.jie.next.name : p.jie.prev.name}」相距 ${(minutes / 1440).toFixed(2)} 日，三日折一年，${years} 歲 ${months} 個月 ${days} 天起運。`,
  };
}

export { preciseTermJD, utcMsFromJd };
