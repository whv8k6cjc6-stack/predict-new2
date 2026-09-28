/** 紫微 Interpretation Engine：
 *  ZiweiChart → 判讀語境（contexts）→ 已校驗的 InterpretationRule → 判讀（本命／大限修正／流年修正）→ LifeFactor
 *  → 共用 InterpretationResult（交給 CrossSystemAdviceEngine／ActionAdviceEngine）。
 *  規則只有在「啟用＋已校驗＋每條引用都能在匯入原文中逐字找到」時才會使用；其餘一律不觸發。 */
import { ADVICE_TOPICS, TOPIC_IDS, type TopicId } from "@/kb/advice/topics";
import { BR } from "../common";
import { factorDef } from "@/core/advice/factors";
import type { FactorPolarity, InterpretationFinding, InterpretationResult, LifeFactorInstance, TimeLayer } from "@/core/advice/interpretation";
import { ZIWEI_INTERPRETATION_RULES } from "@/kb/ziwei/interpretationRules";
import { ZIWEI_CITATIONS, ZIWEI_SOURCES } from "@/kb/ziwei/sources";
import { IMPORTED_ZIWEI_TEXTS } from "@/kb/ziwei/texts/imported";
import { gyClassicalLevel } from "@/kb/ziwei/v2";
import type { ZiweiNatal } from "../chart";
import type { ZiweiTransit } from "../luck";
import { citationCheck, citationUsableForRules, type ClassicalCitation, type ClassicalSource, type ImportedClassicalText } from "./citation";
import { buildContexts, sanFangContext, type ContextLayer, type ZiweiInterpretationContexts } from "./contexts";
import type { ModifierRole, ZiweiCondition, ZiweiInterpretationRule } from "./rules";

export const PENDING_REASON_LABEL: Record<string, string> = {
  unclearGlyph: "原文有疑字（兩輪核讀與決議仍無法確定）", insufficientConditions: "古文沒有足夠成立條件", requiresOtherEdition: "需要其他版本確認",
  ocrOnly: "只有 OCR 定位", historicalOnly: "宿命或不宜直接顯示的古代斷語，只保留原文", requiresChartExtension: "需要客觀排盤沒有的資料（例：小限、斗君、空亡）",
  notInterpretive: "排盤起例等非判讀內容", secondaryLowResolution: "第二來源解析度不足", locatorOnly: "只有定位",
};
export const ZIWEI_ADVICE_PENDING_REASON = "目前紫微判讀引擎建置中，未納入本次建議。";

export interface InterpretationKB {
  rules: readonly ZiweiInterpretationRule[];
  citations: readonly ClassicalCitation[];
  sources: readonly ClassicalSource[];
  texts: readonly ImportedClassicalText[];
  /** 古典廟旺（ClassicalBrightnessRule，已雙重核讀）；判讀條件中的亮度優先用古典值，古籍沒寫的才用軟體亮度（iztro）。不改客觀排盤。 */
  classicalBrightness?: (star: string, branch: string) => string | null;
}
export const DEFAULT_KB: InterpretationKB = { rules: ZIWEI_INTERPRETATION_RULES, citations: ZIWEI_CITATIONS, sources: ZIWEI_SOURCES, texts: IMPORTED_ZIWEI_TEXTS, classicalBrightness: gyClassicalLevel };

// ───────── 規則是否可用（閘門） ─────────
// 規則與知識庫都是不可變資料：同一組 (kb, rule) 的可用性、覆蓋矩陣只算一次
const USABILITY = new WeakMap<InterpretationKB, WeakMap<ZiweiInterpretationRule, { usable: boolean; reason: string }>>();
export function ruleUsability(rule: ZiweiInterpretationRule, kb: InterpretationKB = DEFAULT_KB): { usable: boolean; reason: string } {
  let m = USABILITY.get(kb);
  if (!m) { m = new WeakMap(); USABILITY.set(kb, m); }
  let v = m.get(rule);
  if (!v) { v = ruleUsabilityUncached(rule, kb); m.set(rule, v); }
  return v;
}
function ruleUsabilityUncached(rule: ZiweiInterpretationRule, kb: InterpretationKB): { usable: boolean; reason: string } {
  if (rule.kind === "principle") return { usable: false, reason: "判讀原則：規範本命 → 大限 → 流年的分層，不單獨觸發" };
  if (!rule.enabled) return { usable: false, reason: rule.pendingReason ? `未啟用：${PENDING_REASON_LABEL[rule.pendingReason] ?? rule.pendingReason}` : rule.verificationStatus === "pendingVerification" ? "待古籍原文校驗，尚未啟用" : "未啟用" };
  if (rule.verificationStatus !== "verified" && rule.verificationStatus !== "partiallyVerified") return { usable: false, reason: `驗證狀態為 ${rule.verificationStatus}` };
  if (!rule.condition) return { usable: false, reason: "成立條件待原文確認" };
  if (!rule.citations.length) return { usable: false, reason: "沒有古籍引用" };
  for (const id of rule.citations) {
    const c = kb.citations.find(x => x.citationId === id);
    if (!c) return { usable: false, reason: `找不到引用 ${id}` };
    const src = kb.sources.find(s => s.sourceId === c.sourceId);
    if (!src || src.tier > 3) return { usable: false, reason: `引用 ${id} 的來源不可作為判讀依據（Tier ${src?.tier ?? "?"}）` };
    if (c.verificationStatus !== "verified" && c.verificationStatus !== "partiallyVerified") return { usable: false, reason: `引用 ${id} 狀態為 ${c.verificationStatus}` };
    const gate = citationUsableForRules(c);
    if (!gate.ok) return { usable: false, reason: `引用 ${id}：${gate.reason}` };
    const chk = citationCheck(c, kb.texts);
    if (!chk.ok) return { usable: false, reason: `引用 ${id}：${chk.reason}` };
  }
  return { usable: true, reason: "已校驗" };
}

// ───────── 條件判斷 ─────────
const LAYER_NAME = { natal: "本命", decade: "大限", annual: "流年" } as const;
function evalCond(c: ZiweiCondition, ctx: ZiweiInterpretationContexts, n: ZiweiNatal, kb: InterpretationKB = DEFAULT_KB): { ok: boolean; evidence: string[] } {
  const rel = (want: string | undefined, role: string) =>
    !want || want === role || (want === "trine" && (role === "trine1" || role === "trine2")) || want === "sanfang";
  switch (c.kind) {
    case "starInPalace": {
      const sf = sanFangContext(ctx, n, c.palace, c.layer ?? "natal");
      if (!sf) return { ok: false, evidence: [] };
      const want = c.relation ?? "self";
      for (const m of sf.members) {
        if (!rel(want, m.relationType)) continue;
        if (c.branches && !c.branches.includes(BR[m.branch])) continue;
        // 雜曜（天刑、天姚等）沒有亮度，只在沒有亮度條件時比對
        const miscHit = !c.brightness && ctx.palaces[m.branch].misc.includes(c.star) ? { name: c.star, brightness: "" } : undefined;
        const s = [...m.residentMajor, ...m.residentMinor].find(x => x.name === c.star) ?? miscHit;
        if (!s) continue;
        const classical = kb.classicalBrightness?.(c.star, BR[m.branch]) ?? null;
        const level = classical ?? s.brightness;
        if (c.brightness && !c.brightness.includes(level)) continue;
        const bl = classical ? `古典${classical}${s.brightness && s.brightness !== classical ? `／軟體${s.brightness}` : ""}` : s.brightness || "—";
        { return { ok: true, evidence: [`${c.star}（${bl}）在${c.layer && c.layer !== "natal" ? `${LAYER_NAME[c.layer]}${m.palaceName}（本命${m.natalName}）` : m.palaceName}（${m.relationType === "self" ? "本宮坐守" : "三方照會"}）`] }; }
      }
      return { ok: false, evidence: [] };
    }
    case "transformation": {
      const sf = sanFangContext(ctx, n, c.palace, c.layer ?? "natal");
      if (!sf) return { ok: false, evidence: [] };
      const want = c.relation ?? "self";
      for (const m of sf.members) {
        if (!rel(want, m.relationType)) continue;
        const t = m.transformations.find(x => x.type === c.source && x.transformation === c.transformation && (!c.star || x.star === c.star));
        if (t) return { ok: true, evidence: [`${t.star}化${t.transformation}（${c.source}）在${m.palaceName}`] };
      }
      return { ok: false, evidence: [] };
    }
    case "starsTogether": {
      const layer = c.layer ?? "natal";
      const pool = c.palace ? ctx.palaces.filter(p => (layer === "natal" ? p.natalName : layer === "decade" ? p.decadeName : p.annualName) === c.palace) : ctx.palaces;
      const p = pool.find(x => c.stars.every(s => [...x.residentMajor, ...x.residentMinor].some(r => r.name === s)));
      return p ? { ok: true, evidence: [`${c.stars.join("、")}同在${p.natalName}`] } : { ok: false, evidence: [] };
    }
    case "emptyPalace": {
      const layer = c.layer ?? "natal";
      const p = ctx.palaces.find(x => (layer === "natal" ? x.natalName : layer === "decade" ? x.decadeName : x.annualName) === c.palace);
      return p?.isEmpty ? { ok: true, evidence: [`${c.palace}無主星`] } : { ok: false, evidence: [] };
    }
    case "flank": {
      const layer = c.layer ?? "natal";
      const p = ctx.palaces.find(x => (layer === "natal" ? x.natalName : layer === "decade" ? x.decadeName : x.annualName) === c.palace);
      if (!p) return { ok: false, evidence: [] };
      const has = (b: number, star: string) => { const q = ctx.palaces[(b + 12) % 12]; return [...q.residentMajor, ...q.residentMinor].some(x => x.name === star) || q.misc.includes(star); };
      const [a, b] = c.stars;
      const ok = (has(p.branch - 1, a) && has(p.branch + 1, b)) || (has(p.branch - 1, b) && has(p.branch + 1, a));
      return ok ? { ok: true, evidence: [`${a}、${b}夾${c.palace}（${p.natalName}）`] } : { ok: false, evidence: [] };
    }
    case "soleMajor": {
      const layer = c.layer ?? "natal";
      const p = ctx.palaces.find(x => (layer === "natal" ? x.natalName : layer === "decade" ? x.decadeName : x.annualName) === c.palace);
      return p && p.residentMajor.length === 1 && p.residentMajor[0].name === c.star ? { ok: true, evidence: [`${c.star}獨守${c.palace}`] } : { ok: false, evidence: [] };
    }
    case "gender":
      return n.gender === c.gender ? { ok: true, evidence: [c.gender === "male" ? "男命" : "女命"] } : { ok: false, evidence: [] };
    case "birthBranch": {
      const br = n.yearGz.text[1];
      return c.branches.includes(br) ? { ok: true, evidence: [`${br}年生`] } : { ok: false, evidence: [] };
    }
    case "birthStem": {
      const stem = n.yearGz.text[0];
      return c.stems.includes(stem) ? { ok: true, evidence: [`${stem}年生`] } : { ok: false, evidence: [] };
    }
    case "layerBranch": {
      const l = ctx[c.layer];
      return l && c.branches.includes(BR[l.lifeBranch]) ? { ok: true, evidence: [`${c.layer === "natal" ? "命宮" : `${LAYER_NAME[c.layer]}命宮`}在${BR[l.lifeBranch]}`] } : { ok: false, evidence: [] };
    }
    case "hourBranch":
      return c.branches.includes(BR[n.hourBranch]) ? { ok: true, evidence: [`${BR[n.hourBranch]}時生`] } : { ok: false, evidence: [] };
    case "periodLifeAt": {
      const l = ctx[c.layer];
      return l && l.lifeOnNatal === c.natalPalace ? { ok: true, evidence: [`${LAYER_NAME[c.layer]}命宮在本命${c.natalPalace}`] } : { ok: false, evidence: [] };
    }
    case "all": { const r = c.of.map(x => evalCond(x, ctx, n, kb)); return { ok: r.every(x => x.ok), evidence: r.flatMap(x => x.evidence) }; }
    case "any": { const r = c.of.map(x => evalCond(x, ctx, n, kb)).filter(x => x.ok); return { ok: r.length > 0, evidence: r.flatMap(x => x.evidence) }; }
    case "not": { const r = evalCond(c.of, ctx, n, kb); return { ok: !r.ok, evidence: r.ok ? [] : ["（否定條件成立）"] }; }
  }
}

// ───────── 覆蓋矩陣 ─────────
/** none：沒有可用規則；generalOnly：此主題沒有專屬規則，只有「綜合」層的紫微判讀（不參與此主題建議）；
 *  partial：有會產生生活因素的專屬可用規則；dedicated：專屬因素規則達 DEDICATED_MIN 條且同時涵蓋本命與運限 */
export type ZiweiCoverageLevel = "none" | "generalOnly" | "partial" | "dedicated";
export interface ZiweiTopicCoverageRow {
  topic: TopicId; level: ZiweiCoverageLevel;
  ruleCount: number; verifiedRuleCount: number; factorRuleCount: number; pendingRuleCount: number;
  layers: ContextLayer[];                    // 已可用規則涵蓋的時間層
  sourceCoverage: string[];                  // 已可用規則引用的來源
}
export const DEDICATED_MIN = 10;

const COVERAGE = new WeakMap<InterpretationKB, ZiweiTopicCoverageRow[]>();
export function ziweiCoverage(kb: InterpretationKB = DEFAULT_KB): ZiweiTopicCoverageRow[] {
  let v = COVERAGE.get(kb);
  if (!v) { v = ziweiCoverageUncached(kb); COVERAGE.set(kb, v); }
  return v;
}
function ziweiCoverageUncached(kb: InterpretationKB): ZiweiTopicCoverageRow[] {
  const usableOf = (topic: TopicId) => kb.rules.filter(r => r.topics.includes(topic) && ruleUsability(r, kb).usable);
  const generalFactor = usableOf("general").some(r => r.lifeFactors.length);
  return TOPIC_IDS.map(topic => {
    const rules = kb.rules.filter(r => r.topics.includes(topic));
    const usable = usableOf(topic);
    const layers = [...new Set(usable.map(r => r.timeLayer))];
    // 只計會產生生活因素的規則（只列出判讀、不產生因素的規則不能支撐建議）
    const withFactors = usable.filter(r => r.lifeFactors.length);
    const fLayers = new Set(withFactors.map(r => r.timeLayer));
    const level: ZiweiCoverageLevel = withFactors.length >= DEDICATED_MIN && fLayers.has("natal") && (fLayers.has("decade") || fLayers.has("annual")) ? "dedicated"
      : withFactors.length ? "partial"
      : topic !== "general" && generalFactor ? "generalOnly" : "none";
    const sourceCoverage = [...new Set(usable.flatMap(r => r.citations.map(id => kb.citations.find(c => c.citationId === id)?.sourceId ?? "")).filter(Boolean))];
    return { topic, level, ruleCount: rules.length, verifiedRuleCount: usable.length, factorRuleCount: withFactors.length, pendingRuleCount: rules.filter(r => r.verificationStatus === "pendingVerification" || !r.enabled && r.kind !== "principle").length, layers, sourceCoverage };
  });
}

/** 紫微判讀在建議引擎中的狀態：pending（沒有可用規則）→ partial（部分主題）→ active（所有主題皆 dedicated） */
export function ziweiInterpretationStatus(kb: InterpretationKB = DEFAULT_KB): { status: "pending" | "partial" | "active"; coveredTopics: TopicId[] } {
  const cov = ziweiCoverage(kb);
  const coveredTopics = cov.filter(c => c.level === "partial" || c.level === "dedicated").map(c => c.topic);
  return { status: !coveredTopics.length ? "pending" : cov.every(c => c.level === "dedicated") ? "active" : "partial", coveredTopics };
}

// ───────── 判讀 ─────────
export interface ZiweiFinding {
  ruleId: string; title: string; role: ModifierRole; timeLayer: ContextLayer; topics: TopicId[];
  interpretation: string | null; classicalPrinciple: string | null; modernSemantic: string | null; appImplementation: string;
  lifeFactors: ZiweiInterpretationRule["lifeFactors"];
  citations: ClassicalCitation[]; evidence: string[];
}
export interface RuleEvaluation { ruleId: string; usable: boolean; matched: boolean; reason: string; evidence: string[] }
export interface TopicInterpretationOutput {
  topic: TopicId; coverage: ZiweiTopicCoverageRow;
  baseNatalMeaning: ZiweiFinding[]; periodModifier: ZiweiFinding[]; annualModifier: ZiweiFinding[];
  lifeFactors: { factorId: string; polarity: FactorPolarity; strength: number; ruleIds: string[]; role: ModifierRole }[];
}
export interface ZiweiInterpretationTrace { steps: { step: string; detail: string }[]; evaluations: RuleEvaluation[] }
export interface ZiweiInterpretation {
  status: "pending" | "partial" | "active"; coveredTopics: TopicId[];
  contexts: ZiweiInterpretationContexts;
  findings: ZiweiFinding[];
  topics: TopicInterpretationOutput[];
  coverage: ZiweiTopicCoverageRow[];
  trace: ZiweiInterpretationTrace;
}

export function interpretZiwei(n: ZiweiNatal, t: ZiweiTransit | null, kb: InterpretationKB = DEFAULT_KB): ZiweiInterpretation {
  const contexts = buildContexts(n, t);
  const coverage = ziweiCoverage(kb);
  const { status, coveredTopics } = ziweiInterpretationStatus(kb);
  const evaluations: RuleEvaluation[] = [];
  const findings: ZiweiFinding[] = [];
  for (const rule of kb.rules) {
    const u = ruleUsability(rule, kb);
    if (!u.usable) { evaluations.push({ ruleId: rule.ruleId, usable: false, matched: false, reason: u.reason, evidence: [] }); continue; }
    if ((rule.timeLayer === "decade" && !contexts.decade) || (rule.timeLayer === "annual" && !contexts.annual)) {
      evaluations.push({ ruleId: rule.ruleId, usable: true, matched: false, reason: "此時點沒有對應的運限資料", evidence: [] }); continue;
    }
    const r = evalCond(rule.condition!, contexts, n, kb);
    evaluations.push({ ruleId: rule.ruleId, usable: true, matched: r.ok, reason: r.ok ? "條件成立" : "條件不成立", evidence: r.evidence });
    if (!r.ok) continue;
    findings.push({
      ruleId: rule.ruleId, title: rule.title, role: rule.role, timeLayer: rule.timeLayer, topics: rule.topics,
      interpretation: rule.interpretation, classicalPrinciple: rule.classicalPrinciple, modernSemantic: rule.modernSemantic ?? null, appImplementation: rule.appImplementation,
      lifeFactors: rule.lifeFactors, citations: rule.citations.map(id => kb.citations.find(c => c.citationId === id)!), evidence: r.evidence,
    });
  }
  const topics: TopicInterpretationOutput[] = TOPIC_IDS.map(topic => {
    const mine = findings.filter(f => f.topics.includes(topic));
    return {
      topic, coverage: coverage.find(c => c.topic === topic)!,
      baseNatalMeaning: mine.filter(f => f.role === "baseNatalMeaning"),
      periodModifier: mine.filter(f => f.role === "periodModifier"),
      annualModifier: mine.filter(f => f.role === "annualModifier"),
      lifeFactors: mine.flatMap(f => f.lifeFactors.map(l => ({ factorId: l.factorId, polarity: l.polarity ?? factorDef(l.factorId).nature, strength: l.strength, ruleIds: [f.ruleId], role: f.role }))),
    };
  });
  const usableCount = evaluations.filter(e => e.usable).length;
  return {
    status, coveredTopics, contexts, findings, topics, coverage,
    trace: {
      steps: [
        { step: "判讀語境", detail: `本命${contexts.decade ? "、大限" : ""}${contexts.annual ? "、流年" : ""}；三方四正依本宮坐守／對宮／三合宮分開；空宮 ${contexts.emptyPalaces.length} 宮（借星不設權重）` },
        { step: "規則閘門", detail: `登錄 ${kb.rules.length} 條判讀規則，可用 ${usableCount} 條（啟用＋已校驗＋引用原文逐字相符）` },
        { step: "判讀", detail: `成立 ${findings.length} 條` },
        { step: "生活因素", detail: `產生 ${findings.reduce((s, f) => s + f.lifeFactors.length, 0)} 個生活因素實例；本階段不計分` },
      ],
      evaluations,
    },
  };
}

// ───────── 接上共用判讀介面（CrossSystemAdviceEngine／ActionAdviceEngine） ─────────
const LAYER_TO_TIME: Record<ContextLayer, TimeLayer> = { natal: "natal", decade: "decade", annual: "year" };

export function toInterpretationFindings(z: ZiweiInterpretation, date: string): InterpretationFinding[] {
  return z.findings.filter(f => f.lifeFactors.length).map(f => {
    // 有具體主題（工作、財運…）時只影響那些主題的領域；「綜合」只在沒有其他主題時才用，避免一條判讀擴散到所有領域
    const specific = f.topics.filter(t => t !== "general");
    const domains = [...new Set((specific.length ? specific : f.topics).flatMap(t => ADVICE_TOPICS[t].domains))];
    const strength = Math.max(...f.lifeFactors.map(l => l.strength)) as 1 | 2 | 3;
    const timeLayer = LAYER_TO_TIME[f.timeLayer];
    const factors: LifeFactorInstance[] = f.lifeFactors.map(l => ({
      factorId: l.factorId, polarity: l.polarity ?? factorDef(l.factorId).nature, strength: l.strength, domains,
      sourceSystem: "ziwei", sourceRuleIds: [f.ruleId], timeLayer, mappingType: "nativeInterpretation", reliability: "classicalText", confidence: "medium",
    }));
    const net = factors.reduce((s, x) => s + (x.polarity === "support" ? x.strength : x.polarity === "risk" ? -x.strength : 0), 0);
    return {
      findingId: `${f.ruleId}@${date}`, system: "ziwei", ruleId: f.ruleId, date, timeLayer,
      effects: domains.map(d => ({ domain: d, polarity: (Math.sign(net) as -1 | 0 | 1), strength })),
      factors, reliability: "classicalText",
      mapping: { basis: f.citations.map(c => c.originalText ?? "").join("／"), reason: f.appImplementation },
      source: {
        conclusion: f.interpretation ?? f.title, plain: f.interpretation ?? "", pro: f.classicalPrinciple ?? "", principle: f.classicalPrinciple ?? "",
        school: "紫微斗數", textIds: f.citations.map(c => c.citationId),
        matched: f.evidence.map(e => ({ fact: "ziwei.context", value: e, derivation: e })), legacyAdviceText: [],
      },
    };
  });
}

/** 紫微在建議引擎中的 InterpretationResult：沒有可用規則時為 pending（不當成中性、不影響其他系統） */
export function ziweiInterpretationResult(n: ZiweiNatal | null, t: ZiweiTransit | null, date: string, unavailableReason?: string, kb: InterpretationKB = DEFAULT_KB): InterpretationResult {
  const st = ziweiInterpretationStatus(kb);
  if (st.status === "pending") return { system: "ziwei", status: "pending", reason: ZIWEI_ADVICE_PENDING_REASON, findings: [] };
  if (!n) return { system: "ziwei", status: "unavailable", reason: unavailableReason ?? "紫微命盤無法建立", coveredTopics: st.coveredTopics, findings: [] };
  const z = interpretZiwei(n, t, kb);
  return {
    system: "ziwei", status: z.status, coveredTopics: z.coveredTopics, findings: toInterpretationFindings(z, date),
    reason: z.status === "partial" ? `紫微判讀部分啟用：只用於${z.coveredTopics.map(x => ADVICE_TOPICS[x].label).join("、")}` : undefined,
  };
}
