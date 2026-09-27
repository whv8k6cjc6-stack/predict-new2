/** 分析管線第一段：本命 → 行運事實 → 各系統規則命中。 */
import type { ChartInput, Fact, Moment } from "../engine";
import type { BirthProfile, CalculationSettings, Person } from "../person";
import type { ZiweiRuleProfile } from "../ziwei/profile";
import type { VersionStamp } from "../versioning";
import { BaziEngine, computeBaziTransit, baziFacts, type BaziNatal, type BaziTransit } from "../bazi";
import { ZiweiEngine, computeZiweiTransit, ziweiFacts, type ZiweiNatal, type ZiweiTransit } from "../ziwei";
import { QimenEngine, QIMEN_KINDS, scanDay, qimenFacts, qimenEventFacts, computeQimenChart, SHI_CHEN, SHI_RANGE, type QimenNatal, type DayScan, type EventKind } from "../qimen";
import { IchingEngine, castDaily, castAtTime, ichingFacts, type IchingNatal, type IchingReading } from "../iching";
import { hourBranch } from "../calendar/ganzhi";
import { runRules, type FiredRule } from "../rules/engine";
import { BAZI_RULES, BAZI_GLOBAL_SLOTS } from "@/kb/rules/bazi";
import { legacyZiweiScoring } from "@/kb/rules/ziwei";
import { QIMEN_RULES, QIMEN_EVENT_RULES } from "@/kb/rules/qimen";
import { ICHING_RULES } from "@/kb/rules/iching";
import { LEVEL_SCALES, type Level, type ScoredSystem } from "@/kb/weights";

/** 排盤對象：人物客觀資料＋這次採用的計算設定（規則不屬於人物本身） */
export interface Subject { person: Person; birth: BirthProfile; settings: CalculationSettings; ziweiProfile?: ZiweiRuleProfile }

export interface NatalSet {
  input: ChartInput;
  bazi: BaziNatal | null;
  ziwei: ZiweiNatal | null;
  qimen: QimenNatal | null;
  iching: IchingNatal | null;
  unavailable: { system: ScoredSystem; reason: string }[];
  warnings: string[];
  stamps: Record<ScoredSystem, VersionStamp>;
  timeKnown: boolean;
}

export function buildNatal(sub: Subject): NatalSet {
  const input: ChartInput = { personId: sub.person.id, gender: sub.person.gender, birth: sub.birth, settings: sub.settings, ziweiProfile: sub.ziweiProfile };
  const unavailable: NatalSet["unavailable"] = [];
  const warnings: string[] = [];
  const pick = <T,>(system: ScoredSystem, r: { ok: true; data: T; warnings: string[] } | { ok: false; message: string }): T | null => {
    if (r.ok) { warnings.push(...r.warnings); return r.data; }
    unavailable.push({ system, reason: r.message });
    return null;
  };
  const bazi = pick("bazi", BaziEngine.computeNatal(input));
  const ziwei = pick("ziwei", ZiweiEngine.computeNatal(input));
  const qimen = pick("qimen", QimenEngine.computeNatal(input));
  const iching = pick("iching", IchingEngine.computeNatal(input));
  if (!ziwei && !sub.birth.localTime) unavailable[unavailable.findIndex(u => u.system === "ziwei")].reason = "出生時辰不詳，紫微斗數無法安命宮，本次不納入。";
  return {
    input, bazi, ziwei, qimen, iching, unavailable, warnings: [...new Set(warnings)],
    stamps: { bazi: BaziEngine.meta.stamp, ziwei: ZiweiEngine.meta.stamp, qimen: QimenEngine.meta.stamp, iching: IchingEngine.meta.stamp },
    timeKnown: !!sub.birth.localTime,
  };
}

/** legacy＝已停用的舊計分規則（只在開發者模式比較時執行） */
export interface SystemFired { system: ScoredSystem; fired: FiredRule; legacy?: boolean }

export interface Collected {
  at: Moment; level: Level;
  facts: Fact[];
  fired: SystemFired[];
  warnings: string[];
  bazi: BaziTransit | null;
  ziwei: ZiweiTransit | null;
  qimen: DayScan | null;
  iching: IchingReading | null;
}

const inScales = (level: Level) => { const s = new Set<string>(LEVEL_SCALES[level]); return (f: FiredRule) => s.has(f.rule.timescale); };

export interface CollectOptions { legacyZiwei?: boolean }

/** 收集某時點的行運事實與規則命中（不含時辰層級規則）。
 *  紫微只提供客觀事實；舊紫微計分規則已停用，只有開發者模式明確要求（legacyZiwei）時才執行並標記為 legacy。 */
export function collect(n: NatalSet, at: Moment, level: Level, opts: CollectOptions = {}): Collected {
  const facts: Fact[] = [], fired: SystemFired[] = [], warnings: string[] = [];
  const keep = inScales(level);
  const push = (system: ScoredSystem, f: Fact[], out: { fired: FiredRule[]; warnings: string[] }, legacy = false) => {
    facts.push(...f);
    warnings.push(...out.warnings);
    for (const x of out.fired) if (keep(x)) fired.push({ system, fired: x, ...(legacy ? { legacy: true } : {}) });
  };
  let bt: BaziTransit | null = null, zt: ZiweiTransit | null = null, scan: DayScan | null = null, reading: IchingReading | null = null;
  if (n.bazi) {
    bt = computeBaziTransit(n.bazi, at);
    const f = baziFacts(n.bazi, bt);
    push("bazi", f, runRules(BAZI_RULES.filter(r => r.timescale !== "hour"), f, BAZI_GLOBAL_SLOTS));
  }
  if (n.ziwei) {
    zt = computeZiweiTransit(n.ziwei, at);
    const f = ziweiFacts(n.ziwei, zt);
    if (opts.legacyZiwei) push("ziwei", f, runRules([...legacyZiweiScoring.rules], f), true);
    else facts.push(...f);
  }
  if (level === "day" && n.qimen) {
    scan = scanDay(at.civilDate, at.timeZone, n.qimen.nianMing, QIMEN_KINDS);
    const f = qimenFacts(scan, QIMEN_KINDS, n.qimen.nianMing);
    push("qimen", f, runRules(QIMEN_RULES, f));
  }
  if (level === "day" && n.iching) {
    reading = castDaily(at.civilDate, n.iching.personalNo, n.iching.basis);
    const f = ichingFacts(reading);
    push("iching", f, runRules(ICHING_RULES, f));
  }
  return { at, level, facts, fired, warnings, bazi: bt, ziwei: zt, qimen: scan, iching: reading };
}

const BAZI_HOUR_RULES = BAZI_RULES.filter(r => r.timescale === "hour");

export const hourLabel = (i: number) => `${SHI_CHEN[i]}時（${SHI_RANGE[i]}）`;

/** 某一時刻的時辰層級規則：八字流時、奇門事件用神（事件模式）、易經時間起卦（事件模式） */
export function collectHour(n: NatalSet, date: string, time: string, timeZone: string, eventKind: EventKind | null): { fired: SystemFired[]; facts: Fact[]; reading: IchingReading | null } {
  const fired: SystemFired[] = [], facts: Fact[] = [];
  if (n.bazi) {
    const t = computeBaziTransit(n.bazi, { civilDate: date, civilTime: time, timeZone });
    const f = baziFacts(n.bazi, t).filter(x => x.key.startsWith("bazi.hour.") || x.key.startsWith("bazi.natal."));
    facts.push(...f.filter(x => x.key.startsWith("bazi.hour.")));
    for (const x of runRules(BAZI_HOUR_RULES, f, BAZI_GLOBAL_SLOTS).fired) fired.push({ system: "bazi", fired: x });
  }
  let reading: IchingReading | null = null;
  if (eventKind && n.qimen) {
    const c = computeQimenChart(date, time, timeZone);
    const f = qimenEventFacts(c, n.qimen.nianMing, eventKind, hourLabel(hourBranch(Number(time.split(":")[0]))));
    facts.push(...f);
    for (const x of runRules(QIMEN_EVENT_RULES, f).fired) fired.push({ system: "qimen", fired: x });
  }
  if (eventKind) {
    reading = castAtTime(date, time);
    const f = ichingFacts(reading, "day");
    facts.push(...f);
    for (const x of runRules(ICHING_RULES, f).fired) fired.push({ system: "iching", fired: { ...x, rule: { ...x.rule, timescale: "hour" } } });
  }
  return { fired, facts, reading };
}
