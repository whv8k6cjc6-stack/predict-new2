/** ActionAdviceEngine：生活因素 → 主題判讀 → 跨系統整合 → 行動建議規則 → 白話模板 → StructuredAdvice。
 *  全部在本機以固定規則與模板產生，不使用任何 AI／LLM。 */
import { ADVICE_TOPICS, SAFETY_NOTES, type TopicCoverage, type TopicId } from "@/kb/advice/topics";
import { ADVICE_TEMPLATES, type TemplateId } from "@/kb/advice/templates";
import { rulesForTopic } from "@/kb/advice/rules";
import { INVEST_VARIANTS, TEMPLATE_STEPS } from "@/kb/advice/steps";
import type { InvestorProfile } from "./investor";
import { roleKeys, type WorkProfile, type WorkRole } from "./workRole";
import { ROLE_VARIANTS } from "@/kb/advice/roleVariants";
import { RESPONSES } from "@/kb/advice/responses";
import { investRhythmOf } from "./investRhythm";
import { SCORED_SYSTEMS, type ScoredSystem } from "@/kb/weights";
import type { DomainKey } from "../domains";
import { factorDef, type FactorId, type FactorNature } from "./factors";
import type { InterpretationFinding, InterpretationResult, SourceReliability } from "./interpretation";
import {
  HORIZON_LAYERS, HORIZON_PHRASE, type AdviceConfidence, type AdviceItem, type AdviceRule, type AdviceTrace, type ConfidenceLevel,
  type FactorEvidence, type Horizon, type HorizonAdvice, type Stance, type StructuredAdvice, type SystemAgreementStatus, type SystemView,
} from "./types";

const SYSTEM_NAME: Record<ScoredSystem, string> = { bazi: "八字", ziwei: "紫微", qimen: "奇門", iching: "易經（梅花）" };
const REL_WEIGHT: Record<SourceReliability, number> = { classicalText: 1, principleOnly: 1, pendingVerification: 0.5 };
/** 因素要達到此強度才算「存在」（單一條待驗證的弱規則不足以觸發建議） */
const PRESENT = 1;
const MAX_DO = 3, MAX_AVOID = 2;

export interface AdviceContext {
  topic: TopicId;
  date: string;
  mode: "day" | "event";
  interpretations: InterpretationResult[];     // 當日（含本命、大運、流年、流月、流日各層）或事件時刻
  nextDays?: InterpretationResult[][];         // 之後兩天（只取流日層，用於「近 3 天」）
  timing: { best: string[]; avoid: string[]; basis: string } | null;
  /** 「今天」的說法：看明天或其他日期時改成「明天」「10月5日」 */
  dayWord?: string;
  /** 使用者的投資設定：只調整投資建議的用語、步驟與檢查清單，不影響判讀與觸發條件 */
  investor?: InvestorProfile;
  /** 使用者的工作角色：只調整用語 */
  work?: WorkProfile;
}

// ───────── 主題判讀：取出與主題相關的判讀，換算因素強度 ─────────
const strengthIn = (f: InterpretationFinding, domains: DomainKey[]) =>
  Math.max(0, ...f.effects.filter(e => domains.includes(e.domain)).map(e => e.strength));

/** 只取參與此主題的系統：active 全部主題；partial 只在 coveredTopics（例：紫微只有工作有可靠規則時，投資建議不納入紫微） */
const participates = (r: InterpretationResult, topic: TopicId) => r.status === "active" || (r.status === "partial" && !!r.coveredTopics?.includes(topic));
/** 資料不足而未納入的系統，只有在它本來會涵蓋此主題時才算缺漏（例：紫微命盤無法建立，但紫微本來就不涵蓋投資 → 投資不扣分） */
const missingFor = (r: InterpretationResult, topic: TopicId) => r.status === "unavailable" && (!r.coveredTopics || r.coveredTopics.includes(topic));

function relevant(results: InterpretationResult[], layers: string[], domains: DomainKey[], topic: TopicId): InterpretationFinding[] {
  return results.filter(r => participates(r, topic)).flatMap(r => r.findings)
    .filter(f => layers.includes(f.timeLayer) && strengthIn(f, domains) > 0);
}

function evidenceOf(findings: InterpretationFinding[], domains: DomainKey[]): Map<FactorId, FactorEvidence> {
  const out = new Map<FactorId, FactorEvidence>();
  for (const f of findings) {
    const s = strengthIn(f, domains);
    for (const inst of f.factors) {
      const nature = factorDef(inst.factorId).nature;
      if (nature !== "context" && inst.polarity !== nature) continue; // 被標為中性脈絡的實例不觸發建議
      const ev = out.get(inst.factorId) ?? { factorId: inst.factorId, polarity: inst.polarity, score: 0, systems: [], instances: [] };
      ev.score = Math.round((ev.score + s * REL_WEIGHT[inst.reliability]) * 100) / 100;
      if (!ev.systems.includes(f.system)) ev.systems.push(f.system);
      ev.instances.push({ system: f.system, ruleId: f.ruleId, findingId: f.findingId, date: f.date, timeLayer: f.timeLayer, strength: s, reliability: inst.reliability });
      out.set(inst.factorId, ev);
    }
  }
  return out;
}

/** 近 3 天：同一因素在三天中至少兩天出現才算（避免把單日訊號說成一段期間） */
function persistentEvidence(days: InterpretationFinding[][], domains: DomainKey[]): Map<FactorId, FactorEvidence> {
  const perDay = days.map(d => evidenceOf(d, domains));
  const out = new Map<FactorId, FactorEvidence>();
  const ids = new Set(perDay.flatMap(m => [...m.keys()]));
  for (const id of ids) {
    const hits = perDay.map(m => m.get(id)).filter((x): x is FactorEvidence => !!x && x.score >= PRESENT);
    if (hits.length < 2) continue;
    out.set(id, {
      factorId: id, polarity: hits[0].polarity,
      score: Math.round(hits.reduce((s, h) => s + h.score, 0) / hits.length * 100) / 100,
      systems: [...new Set(hits.flatMap(h => h.systems))], instances: hits.flatMap(h => h.instances),
    });
  }
  return out;
}

// ───────── 跨系統整合：比較各系統的生活因素，而不只是分數正負 ─────────
const topicNature = (topic: TopicId, id: FactorId): FactorNature => ADVICE_TOPICS[topic].natureOverrides?.[id] ?? factorDef(id).nature;

function stanceOf(ev: Map<FactorId, FactorEvidence>, system: ScoredSystem, topic: TopicId): { stance: Stance; S: number; R: number } {
  let S = 0, R = 0;
  for (const e of ev.values()) {
    const w = e.instances.filter(i => i.system === system).reduce((s, i) => s + i.strength * REL_WEIGHT[i.reliability], 0);
    const n = topicNature(topic, e.factorId);
    if (n === "support") S += w; else if (n === "risk") R += w;
  }
  const stance: Stance = S + R === 0 ? "none" : S >= 1.5 * R ? "support" : R >= 1.5 * S ? "risk" : "mixed";
  return { stance, S, R };
}

function agreementOf(ev: Map<FactorId, FactorEvidence>, topic: TopicId): { status: SystemAgreementStatus; stances: Map<ScoredSystem, Stance> } {
  const systems = [...new Set([...ev.values()].flatMap(e => e.systems))];
  const stances = new Map(systems.map(s => [s, stanceOf(ev, s, topic).stance] as const));
  const vals = [...stances.values()].filter(s => s !== "none");
  if (vals.length < 2) return { status: "insufficientData", stances };
  const sup = vals.filter(v => v === "support").length, risk = vals.filter(v => v === "risk").length, mixed = vals.filter(v => v === "mixed").length;
  if (sup && risk) return { status: sup >= 2 * risk || risk >= 2 * sup ? "partialAgreement" : "conflict", stances };
  if (!sup && !risk) return { status: "conflict", stances };                       // 各系統都自相矛盾，同樣不宜激進
  return { status: mixed ? "partialAgreement" : "agreement", stances };
}

const AGREEMENT_NOTE: Record<SystemAgreementStatus, string> = {
  agreement: "參與的系統看法大致一致。",
  partialAgreement: "各系統方向大致相同，但也有不同的提醒，所以不要一次做得太滿。",
  conflict: "目前不同系統訊號不一致，因此不適合做非常激進的判斷。",
  insufficientData: "目前只有一個系統有相關訊號，參考性較低。",
};

// ───────── 信心：來源可靠度、主題覆蓋、系統一致、資料完整度 ─────────
function confidence(
  topic: TopicId, coverage: TopicCoverage, agreement: SystemAgreementStatus, instances: FactorEvidence["instances"], results: InterpretationResult[], cap?: ConfidenceLevel,
): AdviceConfidence {
  const reasons: string[] = [];
  let pts = 3;
  if (coverage === "dedicated") reasons.push("有此主題的判讀規則");
  if (coverage === "partial") { pts -= 1; reasons.push("只有相近領域的判讀規則，沒有此主題的專屬規則"); }
  if (coverage === "generalOnly") { pts -= 1.5; reasons.push("只依一般生活因素延伸，沒有此主題的專屬規則"); }
  if (coverage === "insufficient") { pts = 0; reasons.push("本次沒有足夠的相關訊號"); }
  if (agreement === "partialAgreement") { pts -= 0.5; reasons.push("各系統方向大致相同，但有不同提醒"); }
  if (agreement === "conflict") { pts -= 1; reasons.push("各系統訊號不一致"); }
  if (agreement === "insufficientData") { pts -= 1.5; reasons.push("只有一個系統有相關訊號"); }
  if (agreement === "agreement") reasons.push("參與的系統看法一致");
  const total = instances.reduce((s, i) => s + i.strength, 0) || 1;
  const pending = instances.filter(i => i.reliability === "pendingVerification").reduce((s, i) => s + i.strength, 0) / total;
  const rels = new Set(instances.map(i => i.reliability));
  if (pending > 0.5) { pts -= 1; reasons.push("主要依據屬待驗證規則"); }
  if (rels.has("classicalText")) reasons.push("部分依據引用已匯入的原文");
  const unavailable = results.filter(r => missingFor(r, topic)).map(r => r.system);
  if (unavailable.length) { pts -= 0.5 * unavailable.length; reasons.push(`${unavailable.map(s => SYSTEM_NAME[s]).join("、")}因資料不足未納入`); }
  let level: ConfidenceLevel = pts >= 2.5 ? "high" : pts >= 1.5 ? "medium" : "low";
  if (coverage === "generalOnly" && level === "high") level = "medium";
  const order: ConfidenceLevel[] = ["low", "medium", "high"];
  if (cap && order.indexOf(level) > order.indexOf(cap)) level = cap;
  return {
    level, sourceReliability: rels.size === 1 ? [...rels][0] : rels.size ? "mixed" : "principleOnly",
    topicCoverage: coverage, systemAgreement: agreement,
    dataCompleteness: {
      activeSystems: results.filter(r => participates(r, topic)).map(r => r.system),
      systemsWithSignals: [...new Set(instances.map(i => i.system))],
      pendingSystems: results.filter(r => r.status === "pending").map(r => r.system),
      unavailableSystems: unavailable,
    },
    reasons,
  };
}

// ───────── 模板 ─────────
function render(id: TemplateId, h: Horizon, timing: AdviceContext["timing"], dayWord = "今天", investor?: InvestorProfile, role?: WorkRole): { text: string; short: string; steps: string[] } | null {
  const base = ADVICE_TEMPLATES[id];
  const rv = roleKeys(role).map(k => ROLE_VARIANTS[id]?.[k]).find(Boolean);
  const v = (investor?.style ? INVEST_VARIANTS[id]?.[investor.style] : undefined) ?? rv;
  const t = { text: v?.text ?? base.text, short: v?.short ?? base.short, steps: v?.steps ?? TEMPLATE_STEPS[id] ?? [] };
  const need = (s: string) => t.text.includes(s) || t.short.includes(s);
  if (need("{較佳時段}") && !timing?.best.length) return null;
  if (need("{避開時段}") && !timing?.avoid.length) return null;
  const fill = (s: string) => s.replaceAll("{時段}", h === "today" ? dayWord : HORIZON_PHRASE[h]).replaceAll("{較佳時段}", timing?.best.join("、") ?? "").replaceAll("{避開時段}", timing?.avoid.join("、") ?? "");
  const steps = t.steps.filter(x => !(x.includes("{較佳時段}") && !timing?.best.length) && !(x.includes("{避開時段}") && !timing?.avoid.length)).map(fill);
  return { text: fill(t.text), short: fill(t.short), steps };
}

// ───────── 候選建議 ─────────
interface Candidate { item: AdviceItem; rule: AdviceRule; factors: FactorEvidence[] }

function candidatesFor(topic: TopicId, h: Horizon, ev: Map<FactorId, FactorEvidence>, agreement: SystemAgreementStatus, ctx: AdviceContext, results: InterpretationResult[]): Candidate[] {
  const present = (id: FactorId) => (ev.get(id)?.score ?? 0) >= PRESENT;
  const out: Candidate[] = [];
  for (const rule of rulesForTopic(topic)) {
    if (!rule.horizons.includes(h)) continue;
    if (rule.conflictPolicy === "conflictOnly" && agreement !== "conflict") continue;
    if (rule.conflictPolicy === "suppressOnConflict" && agreement === "conflict") continue;
    const { all = [], any = [], none = [] } = rule.when;
    if (!all.every(present) || (any.length && !any.some(present)) || none.some(present)) continue;
    const matched = [...new Set([...all, ...any])].filter(present).map(id => ev.get(id)!);
    const strength = Math.min(6, matched.reduce((s, e) => s + e.score, 0));
    const score = rule.priority + 4 * strength + (rule.conflictPolicy === "conflictOnly" ? 8 : 0);
    const instances = matched.flatMap(m => m.instances);
    const conf = confidence(topic, ADVICE_TOPICS[topic].coverage, agreement, instances, results, rule.baseConfidence).level;
    for (const [kind, tid] of [["do", rule.action], ["avoid", rule.avoid]] as const) {
      if (!tid) continue;
      const r = render(tid, h, ctx.timing, ctx.dayWord, ctx.topic === "investment" ? ctx.investor : undefined, ctx.work?.role);
      if (!r) continue;
      out.push({
        item: {
          id: `${rule.adviceRuleId}:${kind}:${h}`, adviceRuleId: rule.adviceRuleId, templateId: tid, kind, text: r.text, short: r.short, steps: r.steps,
          horizon: h, score, semanticKey: rule.semanticKey, reason: rule.reason, factors: matched.map(m => m.factorId), confidence: conf,
        },
        rule, factors: matched,
      });
    }
  }
  return out;
}

function headlineOf(topic: TopicId, h: Horizon, ev: Map<FactorId, FactorEvidence>, agreement: SystemAgreementStatus, dayWord = "今天"): string {
  const p = h === "today" ? dayWord : HORIZON_PHRASE[h];
  const skip = (e: FactorEvidence) => { const c = factorDef(e.factorId).category; return c === "timing" || (c === "aptitude" && h !== "longTerm"); };
  const ranked = [...ev.values()].filter(e => e.score >= PRESENT && !skip(e)).sort((a, b) => b.score - a.score);
  const pick = (n: FactorNature, k: number) => ranked.filter(e => topicNature(topic, e.factorId) === n).slice(0, k).map(e => factorDef(e.factorId).plain);
  const S = pick("support", 2), R = pick("risk", 2);
  if (!S.length && !R.length) return `${p}沒有特別突出的命理訊號。`;
  if (agreement === "conflict" && S.length && R.length) return `${p}各系統的訊號不一致：有${S[0]}，也有${R[0]}。`;
  if (S.length && R.length) return `${p}有${S[0]}，但${R.join("、")}也比較高。`;
  if (S.length) return `${p}有${S.join("與")}。`;
  return `${p}較需要留意${R.join("、")}。`;
}

/** 同一核心建議（semanticKey＋種類）只保留一次：放在最近、最能直接執行的時間尺度（今天 → 近 3 天 → 本月 → 今年 → 長期），
 *  同一尺度內取分數最高者。 */
function dedupe(cands: Candidate[]): Candidate[] {
  const order: Horizon[] = ["atTime", "today", "next3Days", "thisMonth", "thisYear", "longTerm"];
  const best = new Map<string, Candidate>();
  for (const c of cands) {
    const k = `${c.item.kind}|${c.item.semanticKey}`;
    const cur = best.get(k);
    const oc = order.indexOf(c.item.horizon), ou = cur ? order.indexOf(cur.item.horizon) : 99;
    if (!cur || oc < ou || (oc === ou && c.item.score > cur.item.score)) best.set(k, c);
  }
  return cands.filter(c => best.get(`${c.item.kind}|${c.item.semanticKey}`) === c);
}

const topN = (cs: Candidate[], kind: "do" | "avoid", n: number) =>
  cs.filter(c => c.item.kind === kind).sort((a, b) => b.item.score - a.item.score || (a.item.id < b.item.id ? -1 : 1)).slice(0, n);

/** 臨場應對：依當天出現的風險因素（強者優先）挑最多 3 句，套用角色說法 */
function responsesFor(topic: TopicId, ev: Map<FactorId, FactorEvidence>, role?: WorkRole): string[] {
  const risks = [...ev.values()].filter(e => e.score >= PRESENT && topicNature(topic, e.factorId) === "risk").sort((a, b) => b.score - a.score);
  const out: string[] = [];
  for (const r of risks) for (const d of RESPONSES) {
    if (out.length >= 3) return out;
    if (!d.factors.includes(r.factorId) || (d.topics !== "all" && !d.topics.includes(topic))) continue;
    const t = roleKeys(role).map(k => d.roles?.[k]).find(Boolean) ?? d.text;
    if (!out.includes(t)) out.push(t);
  }
  return out;
}

export function buildStructuredAdvice(ctx: AdviceContext): StructuredAdvice {
  const T = ADVICE_TOPICS[ctx.topic];
  const main: Horizon = ctx.mode === "event" ? "atTime" : "today";
  const horizons: Horizon[] = ctx.mode === "event" ? ["atTime"] : ["today", "next3Days", "thisMonth", "thisYear", "longTerm"];

  const perH = new Map<Horizon, { ev: Map<FactorId, FactorEvidence>; agreement: SystemAgreementStatus; stances: Map<ScoredSystem, Stance>; findings: InterpretationFinding[] }>();
  for (const h of horizons) {
    let findings: InterpretationFinding[], ev: Map<FactorId, FactorEvidence>;
    if (h === "next3Days") {
      const days = [ctx.interpretations, ...(ctx.nextDays ?? [])].map(r => relevant(r, ["day"], T.domains, ctx.topic));
      if (days.length < 3) continue;
      findings = days.flat(); ev = persistentEvidence(days, T.domains);
    } else {
      findings = relevant(ctx.interpretations, HORIZON_LAYERS[h], T.domains, ctx.topic); ev = evidenceOf(findings, T.domains);
    }
    const { status, stances } = agreementOf(ev, ctx.topic);
    perH.set(h, { ev, agreement: status, stances, findings });
  }

  const all = dedupe(horizons.flatMap(h => { const x = perH.get(h); return x ? candidatesFor(ctx.topic, h, x.ev, x.agreement, ctx, ctx.interpretations) : []; }));
  const pick = (h: Horizon) => { const cs = all.filter(c => c.item.horizon === h); return { doNow: topN(cs, "do", MAX_DO), avoidNow: topN(cs, "avoid", MAX_AVOID) }; };

  const m = perH.get(main)!;
  const today = pick(main);
  const chosen = [...today.doNow, ...today.avoidNow];
  const otherHorizons: HorizonAdvice[] = horizons.filter(h => h !== main && perH.has(h)).map(h => {
    const x = pick(h);
    chosen.push(...x.doNow, ...x.avoidNow);
    return { horizon: h, headline: headlineOf(ctx.topic, h, perH.get(h)!.ev, perH.get(h)!.agreement), doNow: x.doNow.map(c => c.item), avoidNow: x.avoidNow.map(c => c.item), agreement: perH.get(h)!.agreement };
  }).filter(x => x.doNow.length || x.avoidNow.length);

  const noSignal = !today.doNow.length && !today.avoidNow.length;
  const top = [...today.doNow, ...today.avoidNow].sort((a, b) => b.item.score - a.item.score)[0];
  const coverageLevel: TopicCoverage = m.findings.length ? T.coverage : "insufficient";
  const mainInstances = [...m.ev.values()].flatMap(e => e.instances);
  const conf = confidence(ctx.topic, coverageLevel, m.agreement, mainInstances, ctx.interpretations);

  const primaryAdvice: AdviceItem | null = top ? top.item : (() => {
    // 沒有訊號 → 照原計畫；有訊號但沒有需要調整的做法 → 也照原計畫，但不說成「沒有訊號」
    const tid: TemplateId = m.findings.length ? "NO_ACTION_NEEDED" : "NO_SIGNAL";
    const r = render(tid, main, ctx.timing, ctx.dayWord)!;
    return { id: `${tid}:${main}`, adviceRuleId: tid, templateId: tid, kind: "do", text: r.text, short: r.short, steps: r.steps, horizon: main, score: 0, semanticKey: "no-signal", reason: m.findings.length ? "目前的訊號不需要特別調整做法" : "沒有足夠突出的訊號", factors: [], confidence: "low" };
  })();

  const factorsBy = (n: FactorNature) => [...m.ev.values()]
    .filter(e => e.score >= PRESENT && topicNature(ctx.topic, e.factorId) === n && factorDef(e.factorId).category !== "aptitude")
    .sort((a, b) => b.score - a.score).slice(0, 5)
    .map(e => ({ factorId: e.factorId, label: factorDef(e.factorId).label, systems: e.systems }));

  const systems: SystemView[] = SCORED_SYSTEMS.map(s => {
    const r = ctx.interpretations.find(x => x.system === s)!;
    const mine = [...m.ev.values()].filter(e => e.systems.includes(s));
    const lab = (n: FactorNature) => mine.filter(e => topicNature(ctx.topic, e.factorId) === n).map(e => factorDef(e.factorId).label);
    const inTopic = participates(r, ctx.topic);
    const reason = r.status === "partial" && !inTopic ? `${SYSTEM_NAME[s]}判讀尚未涵蓋「${T.label}」，本主題不納入` : r.reason;
    return { system: s, status: r.status, reason, participates: inTopic, stance: m.stances.get(s) ?? "none", support: lab("support"), risk: lab("risk") };
  });

  const usesPending = chosen.some(c => c.factors.some(f => f.instances.some(i => i.reliability === "pendingVerification")));
  const notes = [
    ...(T.safety ? [SAFETY_NOTES[T.safety]] : []),
    ...ctx.interpretations.filter(r => r.status !== "active" && r.reason && (r.status !== "unavailable" || missingFor(r, ctx.topic))).map(r => r.status === "partial" && !participates(r, ctx.topic)
      ? `${SYSTEM_NAME[r.system]}判讀尚未涵蓋「${T.label}」，本主題不納入。` : r.status === "pending" || r.status === "partial" ? r.reason! : `${SYSTEM_NAME[r.system]}未納入：${r.reason}`),
    ...(usesPending ? ["部分依據屬「待驗證」規則，只作低信心參考。"] : []),
  ];

  const headline = headlineOf(ctx.topic, main, m.ev, m.agreement, ctx.dayWord);
  const trace: AdviceTrace[] = chosen.map(c => {
    const ids = new Set(c.factors.flatMap(f => f.instances.map(i => i.findingId)));
    const pool = [...ctx.interpretations, ...(ctx.nextDays ?? []).flat()].flatMap(r => r.findings);
    return {
      adviceItemId: c.item.id, adviceRuleId: c.item.adviceRuleId, templateId: c.item.templateId, horizon: c.item.horizon,
      layers: HORIZON_LAYERS[c.item.horizon], factors: c.factors, findings: [...new Map(pool.filter(f => ids.has(f.findingId)).map(f => [f.findingId, f])).values()],
    };
  });

  return {
    topic: ctx.topic, topicLabel: T.label, date: ctx.date, timeHorizon: main, dayWord: ctx.mode === "event" ? "這個時段" : ctx.dayWord ?? "今天",
    headline, primaryAdvice, summary: `${headline}${!m.findings.length ? "" : m.agreement === "conflict" && headline.includes("不一致") ? "因此不適合做非常激進的判斷。" : AGREEMENT_NOTE[m.agreement]}`,
    doNow: today.doNow.map(c => c.item), avoidNow: today.avoidNow.map(c => c.item), otherHorizons,
    timing: ctx.timing && (ctx.timing.best.length || ctx.timing.avoid.length) ? { best: ctx.timing.best, avoid: ctx.timing.avoid, note: ctx.timing.basis } : null,
    positiveFactors: factorsBy("support"), riskFactors: factorsBy("risk"),
    confidence: conf,
    systemAgreement: { status: m.agreement, note: m.findings.length ? AGREEMENT_NOTE[m.agreement] : "本次沒有相關訊號。", systems },
    coverage: { level: coverageLevel, basisLabel: T.basisLabel, note: T.coverageNote ?? (coverageLevel === "insufficient" ? "本次沒有足夠的相關訊號，不產生肯定結論。" : null) },
    notes, noSignal, responses: responsesFor(ctx.topic, m.ev, ctx.work?.role),
    ...(ctx.topic === "investment" ? { investRhythm: investRhythmOf({ ev: m.ev, agreement: m.agreement, findings: m.findings.length, timing: ctx.timing, investor: ctx.investor, dayWord: ctx.mode === "event" ? "這個時段" : ctx.dayWord ?? "今天",
      month: otherHorizons.find(x => x.horizon === "thisMonth"), nature: id => topicNature(ctx.topic, id) }) } : {}),
    sourceRuleIds: [...new Set(trace.flatMap(t => t.findings.map(f => f.ruleId)))].sort(),
    trace,
  };
}
