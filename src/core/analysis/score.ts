/** 分析管線第二段：Scoring Engine ＋ Fusion Engine。
 *  每個命中的規則，依其影響的每個領域產生一條「證據」，記錄權重與實際貢獻；
 *  分數＝ 50 + 50 × tanh(Σ貢獻 / K)，可逐條反查。交叉判讀只看各系統自己的證據方向。 */
import { DOMAINS, type DomainKey } from "../domains";
import { bandOf, type ConfidenceLevel, type ScoreBand, CONFIDENCE_LEVELS } from "../score";
import type { RuleMatch } from "../sources";
import type { FiredRule } from "../rules/engine";
import type { NatalSet, SystemFired } from "./collect";
import {
  B, BACKGROUND_CAP, BACKGROUND_SCALES, DIRECTION_DIVISOR, K, LONG_SCALES, NEUTRAL_BAND, OVERALL_MIX, OVERALL_OWN_WEIGHT, SCORED_SYSTEMS, profileOf, W_HOUR_EVENT, W_SYSTEM, W_TIMESCALE,
  type Level, type ScoredSystem, type Timescale,
} from "@/kb/weights";

export const SYSTEM_LABEL: Record<ScoredSystem, string> = { bazi: "八字", ziwei: "紫微", qimen: "奇門", iching: "易經" };

export interface Evidence {
  id: string;                 // rule_id + domain
  ruleId: string; system: ScoredSystem; timescale: Timescale; domain: DomainKey;
  polarity: -1 | 0 | 1; strength: 1 | 2 | 3;
  weight: number; contribution: number;
  match: RuleMatch;
  textIds: string[]; commentaryIds: string[];
  principle: string; school: string; ruleVersion: string; verification: string; appliesWhen: string;
  text: FiredRule["text"];
  terms: string[];
}

export function toEvidence(sf: SystemFired[], event = false): Evidence[] {
  const out: Evidence[] = [];
  for (const { system, fired } of sf) {
    const r = fired.rule;
    const ts = r.timescale as Timescale;
    for (const e of r.effects) {
      const w = (ts === "hour" && event ? W_HOUR_EVENT : W_TIMESCALE[ts]) * W_SYSTEM[e.domain][system];
      out.push({
        id: `${r.id}#${e.domain}`, ruleId: r.id, system, timescale: ts, domain: e.domain,
        polarity: e.polarity, strength: e.strength, weight: Math.round(w * 100) / 100,
        contribution: Math.round(e.polarity * e.strength * w * 100) / 100,
        match: fired.match, textIds: fired.textIds, commentaryIds: r.based_on.commentary_ids,
        principle: r.based_on.principle, school: r.school, ruleVersion: r.rule_version, verification: r.verification,
        appliesWhen: r.applies_when, text: fired.text, terms: r.terms,
      });
    }
  }
  return out;
}

export type Verdict = "偏正面" | "中性" | "偏負面" | "無訊號" | "未納入";
export interface SystemSignal {
  system: ScoredSystem; label: string;
  available: boolean; reason?: string;
  long: { direction: number; count: number };
  short: { direction: number; count: number };
  direction: number; count: number; verdict: Verdict;
}

export type DivergenceKind = "長吉短凶" | "長凶短吉" | "結構好時機差" | "全面一致" | "多空交錯";
export interface Divergence { kind: DivergenceKind; text: string; advice: string }

export interface DomainResult {
  domain: DomainKey; label: string;
  score: number; band: ScoreBand; raw: number; baseline: number; k: number;
  background: { sum: number; effective: number; cap: number };
  foreground: number;
  confidence: ConfidenceLevel; confidenceLabel: string;
  signals: SystemSignal[];
  divergence: Divergence | null;
  evidence: Evidence[];       // 依 |貢獻| 由大到小
  positives: Evidence[]; negatives: Evidence[];
}

const tanh = Math.tanh;
const dirOf = (xs: Evidence[]) => tanh(xs.reduce((s, e) => s + e.polarity * e.strength * W_TIMESCALE[e.timescale], 0) / DIRECTION_DIVISOR);
const verdictOf = (d: number, count: number): Verdict => count === 0 ? "無訊號" : d >= NEUTRAL_BAND ? "偏正面" : d <= -NEUTRAL_BAND ? "偏負面" : "中性";
export const toScore = (raw: number, k: number) => Math.round(50 + 50 * tanh(raw / k));

export function signalsFor(ev: Evidence[], natal: NatalSet, systems: ScoredSystem[] = SCORED_SYSTEMS): SystemSignal[] {
  return systems.map(system => {
    const un = natal.unavailable.find(u => u.system === system);
    const mine = ev.filter(e => e.system === system);
    const long = mine.filter(e => LONG_SCALES.includes(e.timescale)), short = mine.filter(e => !LONG_SCALES.includes(e.timescale));
    const direction = dirOf(mine);
    return {
      system, label: SYSTEM_LABEL[system], available: !un, reason: un?.reason,
      long: { direction: dirOf(long), count: long.length }, short: { direction: dirOf(short), count: short.length },
      direction, count: mine.length, verdict: un ? "未納入" : verdictOf(direction, mine.length),
    };
  });
}

export function confidenceOf(signals: SystemSignal[], anyUnavailable: boolean): ConfidenceLevel {
  const valid = signals.filter(s => s.available && s.count > 0);
  if (valid.length < 2) return 1;
  const pos = valid.filter(s => s.verdict === "偏正面").length, neg = valid.filter(s => s.verdict === "偏負面").length;
  let c: ConfidenceLevel;
  if (pos > 0 && neg > 0) c = 2;
  else if ((pos === valid.length || neg === valid.length) && valid.length >= 3) c = 5;
  else if (Math.max(pos, neg) / valid.length >= 0.75) c = 4;
  else c = 3;
  if (anyUnavailable && c >= 4) c = (c - 1) as ConfidenceLevel; // 少一套系統時，「一致」降一級
  return c;
}

export function divergenceOf(ev: Evidence[], signals: SystemSignal[], betterTime: string | null): Divergence | null {
  const long = dirOf(ev.filter(e => LONG_SCALES.includes(e.timescale)));
  const short = dirOf(ev.filter(e => !LONG_SCALES.includes(e.timescale)));
  const when = betterTime ? `（較佳時段：${betterTime}）` : "";
  const zw = signals.find(s => s.system === "ziwei"), qm = signals.find(s => s.system === "qimen");
  if (long >= NEUTRAL_BAND && short <= -NEUTRAL_BAND)
    return { kind: "長吉短凶", text: "長期方向沒問題，但眼前這個時間點不順。", advice: `事情可以做，但建議改時間${when}。` };
  if (long <= -NEUTRAL_BAND && short >= NEUTRAL_BAND)
    return { kind: "長凶短吉", text: "眼前的窗口不錯，但整體階段需要保守。", advice: "可以做小事、把握短期機會，不做長期承諾。" };
  if (zw && qm && zw.long.direction >= NEUTRAL_BAND && qm.short.count > 0 && qm.short.direction <= -NEUTRAL_BAND)
    return { kind: "結構好時機差", text: "紫微看你有做這件事的條件，但奇門看今天的時機不佳。", advice: `選較佳時段或改日再做${when}。` };
  const valid = signals.filter(s => s.available && s.count > 0);
  const nonNeutral = valid.filter(s => s.verdict === "偏正面" || s.verdict === "偏負面");
  if (valid.length >= 2 && nonNeutral.length === valid.length && new Set(nonNeutral.map(s => s.verdict)).size === 1)
    return { kind: "全面一致", text: `${valid.map(s => s.label).join("、")}看法一致（${nonNeutral[0].verdict}）。`, advice: nonNeutral[0].verdict === "偏正面" ? "可以直接照計畫推進。" : "以守為主，重大決定延後。" };
  const shortPos = valid.filter(s => s.short.count > 0 && s.short.direction >= NEUTRAL_BAND), shortNeg = valid.filter(s => s.short.count > 0 && s.short.direction <= -NEUTRAL_BAND);
  if (shortPos.length && shortNeg.length)
    return { kind: "多空交錯", text: `${shortPos.map(s => s.label).join("、")}偏正面，${shortNeg.map(s => s.label).join("、")}偏負面。`, advice: "把事情拆開：有利的部分先做，不利的部分暫緩。" };
  return null;
}

const sortEv = (ev: Evidence[]) => [...ev].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution) || (a.ruleId < b.ruleId ? -1 : 1));

const r2 = (x: number) => Math.round(x * 100) / 100;
/** 領域 raw：前景（該層級本身與更短尺度）直接加總；背景（更長尺度）加總後壓縮 */
export function domainRaw(mine: Evidence[], level: Level) {
  const bg = new Set<string>(BACKGROUND_SCALES[level]);
  const cap = BACKGROUND_CAP[level];
  const sum = mine.filter(e => bg.has(e.timescale)).reduce((s, e) => s + e.contribution, 0);
  const fg = mine.filter(e => !bg.has(e.timescale)).reduce((s, e) => s + e.contribution, 0);
  const effective = cap * Math.tanh(sum / cap);
  return { raw: r2(fg + effective), foreground: r2(fg), background: { sum: r2(sum), effective: r2(effective), cap } };
}

export function scoreDomain(domain: DomainKey, ev: Evidence[], natal: NatalSet, level: Level, betterTime: string | null): DomainResult {
  const mine = sortEv(ev.filter(e => e.domain === domain));
  const { raw, foreground, background } = domainRaw(mine, level);
  const pf = profileOf(natal.unavailable);
  const k = K[pf][level][domain], baseline = B[pf][level][domain];
  const score = toScore(raw - baseline, k);
  const signals = signalsFor(mine, natal);
  const confidence = confidenceOf(signals, natal.unavailable.length > 0);
  return {
    domain, label: DOMAINS.find(d => d.key === domain)!.label,
    score, band: bandOf(score), raw, baseline, k, background, foreground,
    confidence, confidenceLabel: CONFIDENCE_LEVELS.find(c => c.level === confidence)!.label,
    signals, divergence: divergenceOf(mine, signals, betterTime), evidence: mine,
    positives: mine.filter(e => e.contribution > 0), negatives: mine.filter(e => e.contribution < 0),
  };
}

/** 綜合指數＝ (1 − w) × 八個領域分數的加權平均 ＋ w ×「整體」專屬規則分數（w = OVERALL_OWN_WEIGHT）。
 *  直接在 0–100 尺度上平均，綜合分數必落在各領域分數範圍附近，不會因再放大而比每個領域都極端。 */
export function scoreOverall(results: Record<DomainKey, DomainResult>): { score: number; domainAvg: number; parts: { domain: DomainKey; weight: number; z: number }[] } {
  const ds = Object.keys(OVERALL_MIX) as DomainKey[];
  const wsum = ds.reduce((s, d) => s + OVERALL_MIX[d]!, 0);
  const avg = ds.reduce((s, d) => s + OVERALL_MIX[d]! * results[d].score, 0) / wsum;
  const own = results.overall.score;
  const score = Math.round((1 - OVERALL_OWN_WEIGHT) * avg + OVERALL_OWN_WEIGHT * own);
  return {
    score, domainAvg: Math.round(avg * 10) / 10,
    parts: [...ds.map(d => ({ domain: d, weight: Math.round((1 - OVERALL_OWN_WEIGHT) * OVERALL_MIX[d]! / wsum * 1000) / 1000, z: results[d].score })), { domain: "overall" as DomainKey, weight: OVERALL_OWN_WEIGHT, z: own }],
  };
}
