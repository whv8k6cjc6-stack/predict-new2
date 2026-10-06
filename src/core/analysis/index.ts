/** 分析管線：本命 → 行運 → 規則 → 證據 → 分數／交叉判讀 → 四層解讀、宜忌、吉時、方位、提醒。
 *  全部在本機以固定公式計算；同樣的輸入必定得到同樣的結果（占卜模式除外，且不在此管線內）。 */
import { DOMAINS, type DomainKey } from "../domains";
import { bandOf, CONFIDENCE_LEVELS, type ConfidenceLevel, type ScoreBand } from "../score";
import type { Fact, Moment } from "../engine";
import { resolveCivil } from "../calendar/resolve";
import { hourTimeOf, SHI_CHEN, SHI_RANGE, evalYongshen, type EventKind } from "../qimen";
import type { IchingReading } from "../iching";
import { eventTypeOf, type EventType } from "../events";
import { buildNatal, collect, collectHour, hourLabel, type Collected, type NatalSet, type Subject } from "./collect";
import { scoreDomain, scoreOverall, signalsFor, confidenceOf, divergenceOf, toEvidence, activeUnavailable, scoringComposition, type ScoringComposition, toScore, SYSTEM_LABEL, type DomainResult, type Evidence } from "./score";
import { adviseEvent, plainHour, type StructuredAdvice } from "../advice";
import { K, W_SYSTEM, W_TIMESCALE, OVERALL_MIX, WEIGHTS_VERSION, type Level, type ScoredSystem } from "@/kb/weights";

export { buildNatal, SYSTEM_LABEL };
export type { Subject, NatalSet, DomainResult, Evidence };

export const DOMAIN_KEYS = DOMAINS.map(d => d.key);
const SCORED_DOMAINS = DOMAIN_KEYS.filter(d => d !== "overall");

/** 命理解讀（結論、白話、專業）。實際行動建議一律由 ActionAdviceEngine 產生，不再取自規則附帶的 legacyAdviceText。 */
export interface Interpretation { oneLine: string; plain: string[]; pro: string[] }
export type DomainView = DomainResult & { interp: Interpretation; bestHours: string[]; avoidHours: string[] };

const scaleName: Record<string, string> = { natal: "本命", decade: "大運", year: "流年", month: "流月", day: "流日", hour: "時辰" };
const uniqBy = <T,>(xs: T[], key: (x: T) => string) => { const s = new Set<string>(); return xs.filter(x => { const k = key(x); if (s.has(k)) return false; s.add(k); return true; }); };

export function interpret(r: DomainResult, net = r.raw - r.baseline): Interpretation {
  if (!r.evidence.length) {
    return { oneLine: `${r.label}沒有明顯的命理訊號，分數落在中間。`, plain: [`今天沒有任何規則對「${r.label}」產生作用，照平常節奏即可。`], pro: ["無命中規則。"] };
  }
  const main = net >= 0 ? r.positives : r.negatives;
  const other = net >= 0 ? r.negatives : r.positives;
  const top = main[0] ?? r.evidence[0];
  const ev = uniqBy(r.evidence, e => e.ruleId);
  const oneLine = `${r.band.label}｜${top.text.conclusion}`;
  const plain = uniqBy([...main.slice(0, 2), ...other.slice(0, 1)], e => e.ruleId).map(e => `【${SYSTEM_LABEL[e.system]}】${e.text.plain}`);
  const pro = ev.slice(0, 6).map(e => `【${SYSTEM_LABEL[e.system]}・${scaleName[e.timescale]}】${e.text.pro}`);
  return { oneLine, plain, pro };
}

export interface HourSlot {
  index: number; branch: string; range: string; label: string;
  value: number; level: "good" | "bad" | "neutral";
  byDomain: Record<DomainKey, number>;
  reasons: string[];
}

export interface DayAnalysis {
  kind: "day"; date: string; timeZone: string; level: Level;
  overall: { score: number; band: ScoreBand; confidence: ConfidenceLevel; confidenceLabel: string; oneLine: string; domainAvg: number; parts: { domain: DomainKey; weight: number; z: number }[] };
  domains: Record<DomainKey, DomainView>;
  hours: HourSlot[] | null;
  directions: { good: string[]; bad: string[]; basis: string } | null;
  readings: { iching: IchingReading | null; qimen: string | null; baziDay: string | null; ziweiDay: string | null };
  facts: Fact[];
  unavailable: NatalSet["unavailable"]; warnings: string[];
  versions: { weights: string; stamps: NatalSet["stamps"] };
  scoring: ScoringComposition;   // 本次綜合評分由哪些系統組成
}

const HOUR_GOOD = 1.2, HOUR_BAD = -1.2;
const ACTIVE_HOURS = [3, 4, 5, 6, 7, 8, 9, 10];
/** 需要在上班時間進行的事件（向主管請假、提辭職、面試、會議等）只在 07–17 點挑時段 */
const OFFICE_EVENTS = ["work", "interview", "jobchange", "resign", "leave", "meeting"];
const OFFICE_HOURS = [4, 5, 6, 7, 8];
const hoursFor = (key: string) => OFFICE_EVENTS.includes(key) ? OFFICE_HOURS : ACTIVE_HOURS;

function computeHours(n: NatalSet, c: Collected): HourSlot[] {
  return SHI_CHEN.map((br, i) => {
    const time = hourTimeOf(i);
    const h = collectHour(n, c.at.civilDate, time, c.at.timeZone, null);
    const ev = toEvidence(h.fired);
    const byDomain = Object.fromEntries(DOMAIN_KEYS.map(d => {
      const bz = ev.filter(e => e.domain === d).reduce((s, e) => s + e.contribution, 0);
      const qm = c.qimen?.byKind[d as EventKind]?.hourScores[i] ?? 0;
      return [d, Math.round((bz + qm * W_TIMESCALE.hour * W_SYSTEM[d].qimen) * 100) / 100];
    })) as Record<DomainKey, number>;
    const value = Math.round((byDomain.overall + SCORED_DOMAINS.reduce((s, d) => s + (OVERALL_MIX[d] ?? 0) * byDomain[d], 0)) * 100) / 100;
    const reasons: string[] = [];
    if (c.qimen && n.qimen) {
      const y = evalYongshen(c.qimen.charts[i], n.qimen.nianMing, "overall", n.qimen.selfStem).self;
      reasons.push(`奇門：${n.qimen.selfStem === "day" ? "日干" : "年命"}落${y.dir}宮（${y.door}、${y.star}、${y.god}${y.kong ? "、空亡" : ""}）`);
    }
    for (const e of uniqBy([...ev].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution)), e => e.ruleId).slice(0, 2)) reasons.push(`八字：${e.text.conclusion}`);
    return { index: i, branch: br, range: SHI_RANGE[i], label: hourLabel(i), value, level: value >= HOUR_GOOD ? "good" : value <= HOUR_BAD ? "bad" : "neutral", byDomain, reasons };
  });
}

function bestAvoid(hours: HourSlot[] | null, c: Collected, d: DomainKey): { best: string[]; avoid: string[] } {
  if (!hours) {
    const q = c.qimen?.byKind[d as EventKind];
    return { best: q?.best.map(hourLabel) ?? [], avoid: q?.avoid.map(hourLabel) ?? [] };
  }
  const act = ACTIVE_HOURS.map(i => hours[i]);
  const best = [...act].sort((a, b) => b.byDomain[d] - a.byDomain[d]).filter(h => h.byDomain[d] >= 1).slice(0, 2).map(h => h.label);
  const avoid = [...act].sort((a, b) => a.byDomain[d] - b.byDomain[d]).filter(h => h.byDomain[d] <= -1).slice(0, 2).map(h => h.label);
  return { best, avoid };
}

/** legacyZiwei：開發者模式比較用，加入已停用的舊紫微計分（結果不得作為正式分數顯示） */
export interface AnalyzeOptions { hours?: boolean; legacyZiwei?: boolean }

/** 每日（或流月／流年／大運層級）分析 */
export function analyze(n: NatalSet, date: string, timeZone: string, level: Level = "day", opts: AnalyzeOptions = {}): DayAnalysis {
  const at: Moment = { civilDate: date, civilTime: "12:00", timeZone };
  const c = collect(n, at, level, { legacyZiwei: opts.legacyZiwei });
  const ev = toEvidence(c.fired);
  const hours = level === "day" && opts.hours !== false ? computeHours(n, c) : null;
  const domains = {} as Record<DomainKey, DomainView>;
  for (const d of DOMAIN_KEYS) {
    const { best, avoid } = level === "day" ? bestAvoid(hours, c, d) : { best: [], avoid: [] };
    const r = scoreDomain(d, ev, n, level, best.join("或") || null);
    domains[d] = { ...r, interp: interpret(r), bestHours: best, avoidHours: avoid };
  }
  const ov = scoreOverall(domains);
  const allSignals = signalsFor(ev, n);
  const conf = confidenceOf(allSignals, activeUnavailable(n));
  const band = bandOf(ov.score);
  const o = domains.overall;
  const oDiv = divergenceOf(ev, allSignals, o.bestHours.join("或") || null);
  domains.overall = { ...o, score: ov.score, band, signals: allSignals, divergence: oDiv, confidence: conf, confidenceLabel: CONFIDENCE_LEVELS.find(x => x.level === conf)!.label };
  domains.overall.interp = interpret(domains.overall, ov.score - 50);
  const best = [...SCORED_DOMAINS].sort((a, b) => domains[b].score - domains[a].score);
  const lead = domains[best[0]], weak = domains[best[best.length - 1]];
  const oneLine = `${band.label}｜${lead.score >= 55 ? `${lead.label}相對最有利` : "各領域支持力道都不強"}${weak.score < 55 ? `，${weak.label}需要多留意` : ""}。`;
  const qf = (k: string) => c.facts.find(f => f.key === k)?.value;
  return {
    kind: "day", date, timeZone, level,
    overall: { score: ov.score, band, confidence: conf, confidenceLabel: domains.overall.confidenceLabel, oneLine, domainAvg: ov.domainAvg, parts: ov.parts },
    domains,
    hours,
    directions: c.qimen ? { good: c.qimen.goodDirs, bad: c.qimen.badDirs, basis: `奇門${String(qf("qimen.term") ?? "")}：白天各時辰九宮門、星、神與格局積分` } : null,
    readings: {
      iching: c.iching, qimen: (qf("qimen.term") as string) ?? null,
      baziDay: (qf(level === "day" ? "bazi.day.gz" : level === "month" ? "bazi.month.gz" : "bazi.year.gz") as string) ?? null,
      ziweiDay: c.ziwei?.scopes[level === "decade" ? "decade" : level]?.lifeOnNatal ?? null,
    },
    facts: c.facts, unavailable: n.unavailable, warnings: [...new Set([...n.warnings, ...c.warnings])],
    versions: { weights: WEIGHTS_VERSION, stamps: n.stamps },
    scoring: scoringComposition(n, !!opts.legacyZiwei),
  };
}

// ───────── 事件模式 ─────────
export interface EventSlot { date: string; time: string; hour: string; score: number; band: ScoreBand; top: string }
export interface EventAnalysis {
  type: EventType; date: string; time: string; chosenBy: "user" | "best";
  result: DomainResult; interp: Interpretation;
  strengths: string[]; risks: string[];
  bestHours: string[]; avoidHours: string[];
  slots: EventSlot[];               // 當日各時辰
  reading: IchingReading | null;
  facts: Fact[];
  scoring: ScoringComposition;
  advice: StructuredAdvice;         // 具體行動建議（ActionAdviceEngine）
  /** 以真太陽時判斷時辰時的說明（例：10:00 → 真太陽時 09:47，辰時） */
  timeNote: string | null;
  /** 請假才有：請假當天適合做什麼（依當天奇門各類用神白天態勢排序） */
  leavePlan: LeavePlanItem[] | null;
}

export interface LeavePlanItem { activity: string; level: "good" | "ok" | "notIdeal"; hours: string[]; note: string }
const LEAVE_OPTIONS: { kind: EventKind; activity: string }[] = [
  { kind: "travel", activity: "出門走走、看風景" },
  { kind: "love", activity: "陪家人或伴侶" },
  { kind: "social", activity: "和朋友見面聊聊" },
  { kind: "health", activity: "在家休息、運動或預約健康檢查" },
  { kind: "wealth", activity: "處理私事（銀行、戶政、繳費）" },
];
function leavePlanOf(scan: Collected["qimen"]): LeavePlanItem[] | null {
  if (!scan) return null;
  return LEAVE_OPTIONS.map(o => {
    const x = scan.byKind[o.kind];
    const avg = x?.daytimeAvg ?? 0;
    const level: LeavePlanItem["level"] = avg >= 1.5 ? "good" : avg > -1 ? "ok" : "notIdeal";
    const hours = (x?.best ?? []).map(plainHour);
    const note = level === "good" ? "當天這類安排的時機較好" : level === "ok" ? "條件普通，照自己的步調安排即可" : "當天這類安排條件較差，可以改天或縮短";
    return { activity: o.activity, level, hours: level === "notIdeal" ? [] : hours, note, avg };
  }).sort((a, b) => b.avg - a.avg).map(({ avg: _a, ...r }) => r);
}

export interface EventOptions { trueSolar?: { longitude: number; placeName?: string } | null }

function eventAt(n: NatalSet, base: Evidence[], type: EventType, date: string, time: string, tz: string, tst: { longitude: number } | null = null) {
  const h = collectHour(n, date, time, tz, type.qimen, tst);
  const ev = [...base, ...toEvidence(h.fired, true)];
  const r = scoreDomain(type.domain, ev, n, "day", null);
  return { r, h };
}

/** 事件分析：time 為 null 時自動找當日最佳時辰 */
export function analyzeEvent(n: NatalSet, typeKey: string, date: string, time: string | null, timeZone: string, opts: EventOptions = {}): EventAnalysis {
  const tst = opts.trueSolar ? { longitude: opts.trueSolar.longitude } : null;
  const type = eventTypeOf(typeKey);
  const c = collect(n, { civilDate: date, civilTime: "12:00", timeZone }, "day");
  const base = toEvidence(c.fired.filter(f => f.system !== "iching")); // 事件改用提問時刻起卦，不重複計入每日卦
  const slots = hoursFor(type.key).map(i => { const t = hourTimeOf(i); const { r } = eventAt(n, base, type, date, t, timeZone); return { i, t, r }; });
  const ranked = [...slots].sort((a, b) => b.r.score - a.r.score);
  const chosen = time ?? ranked[0].t;
  // 自動挑選的時段取時辰中點，不受真太陽時影響；使用者指定的時刻才換算真太陽時
  const { r, h } = eventAt(n, base, type, date, chosen, timeZone, time ? tst : null);
  const bestHours = ranked.filter(s => s.r.score >= 55).slice(0, 2).map(s => hourLabel(s.i));
  const avoidHours = [...ranked].reverse().filter(s => s.r.score < 50).slice(0, 2).map(s => hourLabel(s.i));
  const interp = interpret(r);
  const advice = adviseEvent(n, typeKey, date, chosen, timeZone, {
    best: ranked.filter(s => s.r.score >= 55).slice(0, 2).map(s => plainHour(s.i)),
    avoid: [...ranked].reverse().filter(s => s.r.score < 50).slice(0, 2).map(s => plainHour(s.i)),
  }, undefined, time ? tst : null);
  let timeNote: string | null = null;
  if (time && tst) {
    const rr = resolveCivil({ date, time, timeZone, trueSolar: tst });
    const L = rr.chartLocal, hh = String(L.h).padStart(2, "0"), mm = String(L.mi).padStart(2, "0");
    timeNote = `以${opts.trueSolar!.placeName ?? `東經 ${tst.longitude}°`}的真太陽時判斷時辰：${time} → ${hh}:${mm}（${SHI_CHEN[Math.floor(((L.h + 1) % 24) / 2)]}時）`;
  }
  return {
    type, date, time: chosen, chosenBy: time ? "user" : "best",
    result: r, interp, advice,
    strengths: uniqBy(r.positives, e => e.ruleId).slice(0, 3).map(e => e.text.conclusion),
    risks: uniqBy(r.negatives, e => e.ruleId).slice(0, 3).map(e => e.text.conclusion),
    bestHours, avoidHours,
    slots: slots.map(s => ({ date, time: s.t, hour: hourLabel(s.i), score: s.r.score, band: s.r.band, top: s.r.evidence[0]?.text.conclusion ?? "" })),
    reading: h.reading, facts: [...c.facts, ...h.facts],
    scoring: scoringComposition(n), timeNote, leavePlan: type.key === "leave" ? leavePlanOf(c.qimen) : null,
  };
}

/** 幫我找時間：未來數日內各時辰排序 */
export function findEventTimes(n: NatalSet, typeKey: string, fromDate: string, days: number, timeZone: string, top = 5): EventSlot[] {
  const type = eventTypeOf(typeKey);
  const out: EventSlot[] = [];
  for (let k = 0; k < days; k++) {
    const d = new Date(`${fromDate}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + k);
    const date = d.toISOString().slice(0, 10);
    const c = collect(n, { civilDate: date, civilTime: "12:00", timeZone }, "day");
    const base = toEvidence(c.fired.filter(f => f.system !== "iching"));
    for (const i of hoursFor(type.key)) {
      const t = hourTimeOf(i);
      const { r } = eventAt(n, base, type, date, t, timeZone);
      out.push({ date, time: t, hour: hourLabel(i), score: r.score, band: r.band, top: r.positives[0]?.text.conclusion ?? r.evidence[0]?.text.conclusion ?? "" });
    }
  }
  return out.sort((a, b) => b.score - a.score || (a.date + a.time < b.date + b.time ? -1 : 1)).slice(0, top);
}

// ───────── 日期比較 ─────────
export interface DateCompareRow {
  date: string; score: number; band: ScoreBand; confidenceLabel: string;
  signals: { system: ScoredSystem; label: string; verdict: string }[];
  feature: string; bestHours: string[]; top: string;
}
export function compareDates(n: NatalSet, dates: string[], domain: DomainKey, timeZone: string): DateCompareRow[] {
  return dates.map(date => {
    const a = analyze(n, date, timeZone, "day", { hours: false });
    const r = a.domains[domain];
    const ranked = [...SCORED_DOMAINS].sort((x, y) => a.domains[y].score - a.domains[x].score);
    const hi = a.domains[ranked[0]], lo = a.domains[ranked[ranked.length - 1]];
    return {
      date, score: r.score, band: r.band, confidenceLabel: r.confidenceLabel,
      signals: r.signals.map(s => ({ system: s.system, label: s.label, verdict: s.verdict })),
      feature: `這天${hi.label}最有利（${hi.score}）${lo.score < 55 ? `，${lo.label}較弱（${lo.score}）` : ""}`,
      bestHours: r.bestHours, top: r.evidence[0]?.text.conclusion ?? "無明顯訊號",
    };
  });
}

// ───────── 時間尺度 ─────────
const addDays = (date: string, k: number) => { const d = new Date(`${date}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + k); return d.toISOString().slice(0, 10); };

export interface HeatRow { date: string; label: string; overall: number; scores: Record<DomainKey, number> }
export function heatmap(n: NatalSet, from: string, days: number, timeZone: string): HeatRow[] {
  return Array.from({ length: days }, (_, k) => {
    const date = addDays(from, k);
    const a = analyze(n, date, timeZone, "day", { hours: false });
    return { date, label: date.slice(5).replace("-", "/"), overall: a.overall.score, scores: Object.fromEntries(DOMAIN_KEYS.map(d => [d, a.domains[d].score])) as Record<DomainKey, number> };
  });
}

/** 今年 12 個流月（以每月 15 日所在節氣月為準） */
export function yearMonths(n: NatalSet, year: number, timeZone: string) {
  return Array.from({ length: 12 }, (_, m) => {
    const date = `${year}-${String(m + 1).padStart(2, "0")}-15`;
    const a = analyze(n, date, timeZone, "month");
    return { month: m + 1, date, gz: a.readings.baziDay, overall: a.overall.score, band: a.overall.band, scores: Object.fromEntries(DOMAIN_KEYS.map(d => [d, a.domains[d].score])) as Record<DomainKey, number>, oneLine: a.overall.oneLine };
  });
}

/** 人生時間軸：大運（10 年一格）與逐年流年 */
export function lifeTimeline(n: NatalSet, timeZone: string, fromYear: number, toYear: number) {
  const decades = (n.bazi?.luck.cycles ?? []).map(cy => {
    const mid = cy.startYear + 5;
    const a = analyze(n, `${mid}-07-01`, timeZone, "decade");
    return { gz: cy.gz.text, startYear: cy.startYear, endYear: cy.endYear, startAge: cy.startAge, overall: a.overall.score, band: a.overall.band, scores: Object.fromEntries(DOMAIN_KEYS.map(d => [d, a.domains[d].score])) as Record<DomainKey, number>, top: a.domains.overall.evidence[0]?.text.conclusion ?? "" };
  });
  const years = [];
  for (let y = fromYear; y <= toYear; y++) {
    const a = analyze(n, `${y}-07-01`, timeZone, "year");
    years.push({ year: y, gz: a.readings.baziDay, overall: a.overall.score, band: a.overall.band, scores: Object.fromEntries(DOMAIN_KEYS.map(d => [d, a.domains[d].score])) as Record<DomainKey, number> });
  }
  return { decades, years };
}

export { toScore, K, SCORED_DOMAINS };
