/** 八字行運：大運、流年、流月、流日、流時對本命的作用，輸出可供規則比對的事實（Fact）。 */
import { BRANCHES, BRANCH_ELEMENT, STEMS, STEM_ELEMENT, type GanZhi } from "../calendar/ganzhi";
import { fourPillars } from "../calendar/pillars";
import { resolveCivil } from "../calendar/resolve";
import type { Fact, Moment } from "../engine";
import type { BaziNatal, Role } from "./natal";
import {
  GROUP_OF, HIDDEN, HUAGAI, LU, PILLAR_NAMES, TAOHUA, TIANYI, WENCHANG, YANGREN, YIMA,
  branchPairRelations, lifeStage, stemRelation, tenGod, type LifeStage, type TenGod, type TenGodGroup,
} from "./data";

export type Scope = "luck" | "year" | "month" | "day" | "hour";
export const SCOPE_LABEL: Record<Scope, string> = { luck: "目前大運", year: "今年流年", month: "本月流月", day: "今日流日", hour: "此時流時" };
export const SCOPE_SHORT: Record<Scope, string> = { luck: "大運", year: "流年", month: "流月", day: "流日", hour: "流時" };

export interface FlowInfo {
  scope: Scope;
  gz: GanZhi;
  stemTenGod: TenGod; stemGroup: TenGodGroup; stemRole: Role;
  branchTenGod: TenGod; branchGroup: TenGodGroup; branchRole: Role;
  dmStage: LifeStage;
  rel: { pillar: string; stem: string | null; branch: string[]; clearsJi: boolean }[];
  fuyin: string[]; fanyin: string[];
  shensha: string[];
  tiaohou: "match" | "against" | null;
}

export interface BaziTransit {
  at: Moment;
  age: number;
  luck: FlowInfo | null;
  luckRange: { startYear: number; endYear: number } | null;
  flows: Record<Exclude<Scope, "luck">, FlowInfo>;
  jie: { prev: string; next: string };
}

const natalPillars = (n: BaziNatal) =>
  [n.pillars.year, n.pillars.month, n.pillars.day, n.pillars.hour].map((g, i) => g ? { g, name: PILLAR_NAMES[i] } : null).filter(Boolean) as { g: GanZhi; name: string }[];

function flowInfo(n: BaziNatal, scope: Scope, g: GanZhi): FlowInfo {
  const dm = n.dm;
  const stEl = STEM_ELEMENT[g.stem];
  const brMain = HIDDEN[g.branch][0][0];
  const stemTG = tenGod(dm, g.stem), brTG = tenGod(dm, brMain);
  const rel = natalPillars(n).map(({ g: ng, name }) => {
    const br = branchPairRelations(g.branch, ng.branch);
    const clearsJi = br.includes("六沖")
      && ["忌神", "仇神"].includes(n.roleOf[STEM_ELEMENT[HIDDEN[ng.branch][0][0]]])
      && ["用神", "喜神"].includes(n.roleOf[BRANCH_ELEMENT[g.branch]]);
    return { pillar: name, stem: stemRelation(g.stem, ng.stem), branch: br, clearsJi };
  });
  const fuyin = natalPillars(n).filter(x => x.g.index === g.index).map(x => x.name);
  const fanyin = natalPillars(n).filter(x => stemRelation(g.stem, x.g.stem) === "相沖" && (g.branch + 6) % 12 === x.g.branch).map(x => x.name);
  const yb = n.pillars.year.branch, db = n.pillars.day.branch;
  const shensha: string[] = [];
  if (TIANYI[dm].includes(g.branch)) shensha.push("天乙貴人");
  if (WENCHANG[dm] === g.branch) shensha.push("文昌");
  if (LU[dm] === g.branch) shensha.push("祿神");
  if (YANGREN[dm] === g.branch) shensha.push("羊刃");
  if (YIMA(yb) === g.branch || YIMA(db) === g.branch) shensha.push("驛馬");
  if (TAOHUA(yb) === g.branch || TAOHUA(db) === g.branch) shensha.push("桃花");
  if (HUAGAI(yb) === g.branch || HUAGAI(db) === g.branch) shensha.push("華蓋");
  const need = n.tiaohou.need;
  const opp = need === "火" ? "水" : need === "水" ? "火" : null;
  const els = [stEl, BRANCH_ELEMENT[g.branch]];
  const tiaohou = need && els.includes(need) ? "match" : opp && els.every(e => e === opp) ? "against" : null;
  return {
    scope, gz: g,
    stemTenGod: stemTG, stemGroup: GROUP_OF[stemTG], stemRole: n.roleOf[stEl],
    branchTenGod: brTG, branchGroup: GROUP_OF[brTG], branchRole: n.roleOf[STEM_ELEMENT[brMain]],
    dmStage: lifeStage(dm, g.branch), rel, fuyin, fanyin, shensha, tiaohou,
  };
}

export function computeBaziTransit(n: BaziNatal, at: Moment): BaziTransit {
  const r = resolveCivil({ date: at.civilDate, time: at.civilTime, timeZone: at.timeZone });
  const p = fourPillars(r, "lateZiSameDay");
  const age = (r.instantMs - n.resolved.instantMs) / (365.2422 * 86_400_000);
  const cyc = [...n.luck.cycles].reverse().find(c => age >= c.startAge) ?? null;
  return {
    at, age,
    luck: cyc ? flowInfo(n, "luck", cyc.gz) : null,
    luckRange: cyc ? { startYear: cyc.startYear, endYear: cyc.endYear } : null,
    flows: { year: flowInfo(n, "year", p.year), month: flowInfo(n, "month", p.month), day: flowInfo(n, "day", p.day), hour: flowInfo(n, "hour", p.hour!) },
    jie: { prev: p.jie.prev.name, next: p.jie.next.name },
  };
}

// ───────── Facts ─────────

export function baziFacts(n: BaziNatal, t?: BaziTransit): Fact[] {
  const f: Fact[] = [];
  const add = (key: string, value: unknown, label: string, derivation: string) => f.push({ key, value, label, derivation, system: "bazi" });
  add("bazi.natal.dm", n.dmText, "日主", `日柱天干 ${n.dmText}（${n.pillars.day.text}日）`);
  add("bazi.natal.dmElement", n.dmElement, "日主五行", `${n.dmText}屬${n.dmElement}`);
  add("bazi.natal.strength.label", n.strength.label, "日主旺衰", n.strength.notes.join("；"));
  add("bazi.natal.strength.score", n.strength.score, "旺衰分數", `得令 ${n.strength.deling}＋得地 ${n.strength.dedi}＋得勢 ${n.strength.deshi}`);
  add("bazi.natal.pattern", n.pattern.name, "格局", n.pattern.basis);
  add("bazi.natal.patternGroup", n.pattern.name.replace("格", "") in GROUP_OF ? GROUP_OF[n.pattern.name.replace("格", "") as TenGod] : null, "格局類別", n.pattern.basis);
  for (const [role, el] of Object.entries(n.roles)) add(`bazi.natal.role.${role}`, el, role, n.rolesReasoning.join(" "));
  add("bazi.natal.season", n.season.name, "出生季節", `月令${BRANCHES[n.pillars.month.branch]}`);
  add("bazi.natal.tiaohou", n.tiaohou.need, "調候需求", n.tiaohou.basis);
  add("bazi.natal.gender", n.gender, "性別", "出生資料");
  add("bazi.natal.tiaohouBasis", n.tiaohou.basis, "調候依據", n.tiaohou.basis);
  add("bazi.natal.patternBasis", n.pattern.basis, "格局依據", n.pattern.basis);
  natalPillars(n).forEach(({ g, name }) => {
    const pn = name.replace("柱", "");
    add(`bazi.natal.pillar.${pn}.gz`, g.text, `本命${name}`, `${name}為${g.text}`);
    add(`bazi.natal.pillar.${pn}.branch`, BRANCHES[g.branch], `本命${name}地支`, `${name}地支${BRANCHES[g.branch]}`);
  });
  add("bazi.natal.timeKnown", n.resolved.timeKnown, "時辰已知", "出生資料");
  if (!t) return f;
  const scopes: [Scope, FlowInfo | null][] = [["luck", t.luck], ["year", t.flows.year], ["month", t.flows.month], ["day", t.flows.day], ["hour", t.flows.hour]];
  for (const [s, x] of scopes) {
    if (!x) continue;
    const L = SCOPE_SHORT[s];
    const k = (name: string) => `bazi.${s}.${name}`;
    add(k("gz"), x.gz.text, `${L}干支`, `${SCOPE_LABEL[s]}為 ${x.gz.text}`);
    add(k("stem"), STEMS[x.gz.stem], `${L}天干`, `${x.gz.text} 之天干`);
    add(k("branch"), BRANCHES[x.gz.branch], `${L}地支`, `${x.gz.text} 之地支`);
    add(k("stemTenGod"), x.stemTenGod, `${L}天干十神`, `${STEMS[x.gz.stem]}對日主${n.dmText}為${x.stemTenGod}`);
    add(k("stemGroup"), x.stemGroup, `${L}天干十神類別`, `${x.stemTenGod}屬${x.stemGroup}`);
    add(k("stemElement"), STEM_ELEMENT[x.gz.stem], `${L}天干五行`, `${STEMS[x.gz.stem]}屬${STEM_ELEMENT[x.gz.stem]}`);
    add(k("stemRole"), x.stemRole, `${L}天干喜忌`, `${STEM_ELEMENT[x.gz.stem]}在你的命局為${x.stemRole}（${n.rolesMethod}）`);
    add(k("branchTenGod"), x.branchTenGod, `${L}地支本氣十神`, `${BRANCHES[x.gz.branch]}本氣${STEMS[HIDDEN[x.gz.branch][0][0]]}對日主為${x.branchTenGod}`);
    add(k("branchGroup"), x.branchGroup, `${L}地支十神類別`, `${x.branchTenGod}屬${x.branchGroup}`);
    add(k("branchRole"), x.branchRole, `${L}地支喜忌`, `${BRANCHES[x.gz.branch]}本氣五行為${x.branchRole}`);
    add(k("dmStage"), x.dmStage, `日主於${L}地支之十二長生`, `日主${n.dmText}在${BRANCHES[x.gz.branch]}為${x.dmStage}`);
    add(k("shensha"), x.shensha, `${L}神煞`, x.shensha.length ? `${BRANCHES[x.gz.branch]}為你的${x.shensha.join("、")}` : "無");
    add(k("fuyin"), x.fuyin, `${L}伏吟`, x.fuyin.length ? `${x.gz.text}與本命${x.fuyin.join("、")}相同` : "無");
    add(k("fanyin"), x.fanyin, `${L}反吟`, x.fanyin.length ? `${x.gz.text}與本命${x.fanyin.join("、")}天剋地沖` : "無");
    add(k("tiaohou"), x.tiaohou, `${L}調候`, x.tiaohou === "match" ? `${L}帶${n.tiaohou.need}，合調候所需` : x.tiaohou === "against" ? `${L}干支皆與調候所需相反` : "無");
    for (const r of x.rel) {
      const pn = r.pillar.replace("柱", "");
      add(k(`rel.${pn}`), r.branch, `${L}與本命${r.pillar}地支關係`, r.branch.length ? `${BRANCHES[x.gz.branch]}與${r.pillar}地支${r.branch.join("、")}` : "無");
      add(k(`stemRel.${pn}`), r.stem, `${L}與本命${r.pillar}天干關係`, r.stem ? `${STEMS[x.gz.stem]}與${r.pillar}天干${r.stem}` : "無");
      add(k(`clearsJi.${pn}`), r.clearsJi, `${L}沖去忌神（${r.pillar}）`, r.clearsJi ? `被沖之${r.pillar}地支本氣為忌仇，${L}地支為用喜` : "否");
    }
  }
  return f;
}
