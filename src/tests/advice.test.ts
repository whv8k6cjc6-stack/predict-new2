/** ActionAdviceEngine：對照表、詞彙表、文字品質、規則結構、跨系統整合、時間尺度、安全規則、追溯與驗收標準 A–J。 */
import { ZIWEI_INTERPRETATION_RULES } from "@/kb/ziwei/interpretationRules";
import { ziweiInterpretationStatus } from "@/core/ziwei/interp/engine";
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { BAZI_RULES } from "@/kb/rules/bazi";
import { QIMEN_RULES, QIMEN_EVENT_RULES } from "@/kb/rules/qimen";
import { ICHING_RULES } from "@/kb/rules/iching";
import { LIFE_FACTOR_MAPPING, lifeFactorMappingFor } from "@/kb/advice/lifeFactorMapping";
import { ADVICE_RULES } from "@/kb/advice/rules";
import { ADVICE_TEMPLATES, TEMPLATE_IDS } from "@/kb/advice/templates";
import { ADVICE_TOPICS, SAFETY_NOTES, TOPIC_IDS, type TopicId } from "@/kb/advice/topics";
import { FACTOR_IDS, LIFE_FACTORS, factorDef, type FactorId } from "@/core/advice/factors";
import { JARGON, lintAdviceText } from "@/core/advice/lint";
import { buildStructuredAdvice } from "@/core/advice/engine";
import { adviseDay, HORIZON_LAYERS, interpretationResults, ZIWEI_ADVICE_PENDING, type InterpretationResult, type StructuredAdvice } from "@/core/advice";
import type { InterpretationFinding, SourceReliability, TimeLayer } from "@/core/advice/interpretation";
import { buildNatal, analyzeEvent } from "@/core/analysis";
import { collect } from "@/core/analysis/collect";
import { EVENT_TYPES } from "@/core/events";
import type { DomainKey } from "@/core/domains";
import type { ScoredSystem } from "@/kb/weights";
import { SAMPLES } from "../../scripts/calibrate-samples";

const ALL_RULES = [...BAZI_RULES, ...QIMEN_RULES, ...QIMEN_EVENT_RULES, ...ICHING_RULES];
const TZ = "Asia/Taipei";

describe("既有規則 → 生活因素對照表", () => {
  it("每一條八字、奇門、梅花規則都有對照，且因素都在共用詞彙表內", () => {
    for (const r of ALL_RULES) {
      const m = lifeFactorMappingFor(r);
      expect(m, r.id).not.toBeNull();
      for (const f of m!.factors) expect(FACTOR_IDS).toContain(Array.isArray(f) ? f[0] : f);
    }
  });
  it("映射只依既有語意：每筆依據都逐字出現在該規則的結論、白話、專業說明或原則中", () => {
    for (const r of ALL_RULES) {
      const m = lifeFactorMappingFor(r)!;
      const text = [r.templates.conclusion, r.templates.plain, r.templates.pro, r.based_on.principle, r.applies_when].join("\n");
      for (const b of m.basis) expect(text.includes(b), `${r.id}：「${b}」`).toBe(true);
    }
  });
  it("對照表沒有多餘或用不到的規則族", () => {
    const used = new Set(ALL_RULES.map(r => lifeFactorMappingFor(r)!.familyKey));
    expect(Object.keys(LIFE_FACTOR_MAPPING).filter(k => !used.has(k))).toEqual([]);
  });
  it("武斷或屬傷病預測的規則標為待驗證，並寫明不映射的內容", () => {
    const pending = Object.entries(LIFE_FACTOR_MAPPING).filter(([, m]) => m.reliability === "pendingVerification").map(([k, m]) => { expect(m.excluded).toBeTruthy(); return k; });
    expect(pending.sort()).toEqual(["bazi.dts.wu.summerfire", "bazi.fanyin", "bazi.shensha.羊刃"]);
  });
  it("引用已匯入原文的規則（爻辭、爻位）可靠度為 classicalText，其餘為 principleOnly", () => {
    expect(lifeFactorMappingFor(ICHING_RULES.find(r => r.id === "iching.verdict.凶")!)!.reliability).toBe("classicalText");
    expect(lifeFactorMappingFor(BAZI_RULES.find(r => r.id === "bazi.day.shensha.文昌")!)!.reliability).toBe("principleOnly");
  });
});

describe("LifeFactorRegistry", () => {
  it("跨系統共用同一份詞彙；白話說法不含術語與頓號", () => {
    for (const id of FACTOR_IDS) {
      const f = LIFE_FACTORS[id];
      expect(f.plain.includes("、"), id).toBe(false);
      for (const j of JARGON) { expect(f.label.includes(j), `${id}.label`).toBe(false); expect(f.plain.includes(j), `${id}.plain`).toBe(false); }
    }
    expect(new Set(FACTOR_IDS.map(id => factorDef(id).label)).size).toBe(FACTOR_IDS.length);
  });
});

describe("AdviceTemplateRegistry 文字品質", () => {
  const kindOf = (id: string) => ADVICE_RULES.some(r => r.avoid === id) ? "avoid" : "do";
  it("每段文字都具體、可執行、白話、不宿命、不製造恐懼，並符合投資／健康／訴訟安全規則", () => {
    for (const id of TEMPLATE_IDS) {
      const t = ADVICE_TEMPLATES[id];
      expect(lintAdviceText(t.text, { kind: kindOf(id) }), `${id}.text`).toEqual([]);
      expect(lintAdviceText(t.short, { kind: kindOf(id) }), `${id}.short`).toEqual([]);
      const slots = [...(t.text + t.short).matchAll(/\{([^}]+)\}/g)].map(m => m[1]);
      for (const s of slots) expect(["時段", "較佳時段", "避開時段"]).toContain(s);
    }
  });
  it("空泛說法單獨出現會被擋下；後面接具體行為才可以", () => {
    for (const bad of ["今天注意口舌。", "宜守不宜攻", "把握機會", "凡事小心", "多溝通", "注意財務"]) expect(lintAdviceText(bad, { kind: "do" }).length, bad).toBeGreaterThan(0);
    expect(lintAdviceText("今天如果要回覆主管或客戶的重要訊息，先寫完後隔幾分鐘再看一次再送出。", { kind: "do" })).toEqual([]);
    expect(lintAdviceText("今天一定會遇到小人。").length).toBeGreaterThan(0);
    expect(lintAdviceText("今天買進，明天必漲。").length).toBeGreaterThan(0);
    expect(lintAdviceText("今年會得腎臟病，可以停藥。").length).toBeGreaterThan(0);
    expect(lintAdviceText("這場官司會勝訴。").length).toBeGreaterThan(0);
    expect(lintAdviceText("今天化忌，不宜講話。").length).toBeGreaterThan(0);
  });
  it("所有文字都有被建議規則使用（除了沒有訊號時的固定句）", () => {
    const used = new Set(ADVICE_RULES.flatMap(r => [r.action, r.avoid]).filter(Boolean));
    expect(TEMPLATE_IDS.filter(id => !used.has(id))).toEqual(["NO_SIGNAL", "NO_ACTION_NEEDED"]);
  });
});

describe("AdviceRule 結構", () => {
  it("條件只引用生活因素，不引用命理術語、規則編號或命盤事實（不讓建議變成另一種硬編命理）", () => {
    const text = JSON.stringify(ADVICE_RULES.map(r => [r.when, r.reason]));
    for (const p of ["bazi.", "qimen.", "iching.", "ziwei.", "化忌", "死門", "傷官"]) expect(text.includes(p), p).toBe(false);
    for (const r of ADVICE_RULES) {
      for (const f of [...(r.when.all ?? []), ...(r.when.any ?? []), ...(r.when.none ?? [])]) expect(FACTOR_IDS, r.adviceRuleId).toContain(f);
      for (const j of JARGON) expect(r.reason.includes(j), `${r.adviceRuleId}.reason`).toBe(false);
      expect(r.action || r.avoid).toBeTruthy();
    }
    expect(new Set(ADVICE_RULES.map(r => r.adviceRuleId)).size).toBe(ADVICE_RULES.length);
  });
  it("17 個主題都有自己的建議規則（至少 3 條）", () => {
    for (const t of TOPIC_IDS) expect(ADVICE_RULES.filter(r => r.topics.includes(t)).length, t).toBeGreaterThanOrEqual(3);
  });
  it("沒有專屬命理規則的主題必須標示覆蓋程度與說明", () => {
    for (const t of ["promotion", "jobSearch", "lawsuit", "exam", "marriage", "cooperation", "property"] as TopicId[]) {
      expect(ADVICE_TOPICS[t].coverage, t).not.toBe("dedicated");
      expect(ADVICE_TOPICS[t].coverageNote).toContain("尚未建立完整專屬命理判讀規則");
    }
    expect([ADVICE_TOPICS.lawsuit.coverage, ADVICE_TOPICS.exam.coverage]).toEqual(["generalOnly", "generalOnly"]);
  });
});

// ───────── 合成判讀（驗證跨系統整合邏輯） ─────────
let seqId = 0;
const F = (system: ScoredSystem, factorId: FactorId, domains: DomainKey[], strength: 1 | 2 | 3 = 2, layer: TimeLayer = "day", reliability: SourceReliability = "principleOnly", date = "2026-10-01"): InterpretationFinding => {
  const id = `test.${system}.${factorId}.${seqId++}`;
  return {
    findingId: `${id}@${date}`, system, ruleId: id, date, timeLayer: layer, reliability,
    effects: domains.map(d => ({ domain: d, polarity: factorDef(factorId).nature === "risk" ? -1 : 1, strength })),
    factors: [{ factorId, polarity: factorDef(factorId).nature, strength, domains, sourceSystem: system, sourceRuleIds: [id], timeLayer: layer, mappingType: "derivedFromExistingInterpretation", reliability, confidence: "medium" }],
    mapping: { basis: "測試", reason: "測試" },
    source: { conclusion: "測試判讀", plain: "", pro: "", principle: "", school: "", textIds: [], matched: [], legacyAdviceText: [] },
  };
};
const results = (fs: InterpretationFinding[]): InterpretationResult[] => (["bazi", "ziwei", "qimen", "iching"] as ScoredSystem[]).map(s =>
  s === "ziwei" ? { system: s, status: "pending", reason: ZIWEI_ADVICE_PENDING, findings: [] } : { system: s, status: "active", findings: fs.filter(f => f.system === s) });
const run = (topic: TopicId, fs: InterpretationFinding[], next: InterpretationFinding[][] = [[], []]) =>
  buildStructuredAdvice({ topic, date: "2026-10-01", mode: "day", interpretations: results(fs), nextDays: next.map(results), timing: null });

describe("CrossSystemAdviceEngine：比較生活因素，不只看分數正負", () => {
  it("兩系統支持推進、一系統提示阻力 → partialAgreement，仍給推進建議但不做太滿", () => {
    const a = run("career", [F("bazi", "progressOpportunity", ["career"]), F("qimen", "progressOpportunity", ["career"]), F("qimen", "communicationMisunderstandingRisk", ["career"], 1), F("iching", "executionResistance", ["career"])]);
    expect(a.systemAgreement.status).toBe("partialAgreement");
    expect(a.doNow.map(i => i.adviceRuleId)).toContain("CAREER_PUSH_001");
    expect(a.summary).toContain("不要一次做得太滿");
  });
  it("八字有利、奇門不利、梅花中性、紫微 pending → conflict：給可逆／不可逆的決策方法，不硬判吉凶", () => {
    const a = run("career", [F("bazi", "progressOpportunity", ["career"]), F("qimen", "executionResistance", ["career"]), F("iching", "approachSensitivity", ["career"], 1)]);
    expect(a.systemAgreement.status).toBe("conflict");
    expect(a.primaryAdvice!.adviceRuleId).toBe("CONFLICT_DECISION_001");
    expect(a.doNow.map(i => i.templateId)).toContain("CONFLICT_REVERSIBLE");
    expect(a.avoidNow.map(i => i.templateId)).toContain("CONFLICT_IRREVERSIBLE");
    expect(a.doNow.map(i => i.adviceRuleId)).not.toContain("CAREER_PUSH_001"); // suppressOnConflict
    expect(a.headline).toContain("不一致");
    expect(JSON.stringify(a)).not.toMatch(/大吉|吉凶參半/);
  });
  it("系統一致 → agreement，信心較高", () => {
    const a = run("career", [F("bazi", "progressOpportunity", ["career"]), F("qimen", "progressOpportunity", ["career"]), F("iching", "supportAvailable", ["career"])]);
    expect([a.systemAgreement.status, a.confidence.level]).toEqual(["agreement", "high"]);
  });
  it("紫微 pending 不當成中性、不降低其他系統：顯示建置中說明", () => {
    const a = run("career", [F("bazi", "progressOpportunity", ["career"]), F("qimen", "progressOpportunity", ["career"])]);
    expect(a.systemAgreement.status).toBe("agreement");
    expect(a.systemAgreement.systems.find(s => s.system === "ziwei")).toMatchObject({ status: "pending", stance: "none" });
    expect(a.notes).toContain("目前紫微判讀引擎建置中，未納入本次建議。");
    expect(a.confidence.dataCompleteness.pendingSystems).toEqual(["ziwei"]);
    expect(a.confidence.reasons.join()).not.toContain("紫微");
  });
});

describe("資料不足與不硬湊", () => {
  it("沒有任何訊號 → 承認資料不足，只給「照原本計畫」", () => {
    const a = run("career", []);
    expect([a.noSignal, a.coverage.level, a.confidence.level, a.doNow.length, a.avoidNow.length]).toEqual([true, "insufficient", "low", 0, 0]);
    expect(a.primaryAdvice!.text).toBe("今天沒有特別突出的命理訊號，照原本計畫進行即可。");
  });
  it("只有一個系統有訊號 → insufficientData，信心不會是高", () => {
    const a = run("career", [F("bazi", "communicationConflictRisk", ["career"])]);
    expect(a.systemAgreement.status).toBe("insufficientData");
    expect(a.confidence.level).not.toBe("high");
  });
  it("只有一個弱訊號時只顯示一條，不為了填滿畫面硬湊三條", () => {
    const a = run("career", [F("bazi", "errorRisk", ["career"], 1), F("qimen", "errorRisk", ["career"], 1)]);
    expect(a.doNow.length + a.avoidNow.length).toBe(1);
  });
  it("單一條待驗證規則的弱訊號不足以觸發建議；較強時可觸發但信心低並註明", () => {
    expect(run("health", [F("bazi", "impulsivityRisk", ["health"], 1, "day", "pendingVerification")]).avoidNow).toEqual([]);
    const a = run("health", [F("bazi", "impulsivityRisk", ["health"], 2, "day", "pendingVerification"), F("qimen", "energySupport", ["health"], 1)]);
    const it = a.avoidNow.find(i => i.adviceRuleId === "HEALTH_RUSH_001")!;
    expect(it.confidence).toBe("low");
    expect(a.notes.join()).toContain("待驗證");
  });
});

describe("時間尺度與語意去重", () => {
  it("只有流日資料就只產生今天的建議，不會推成本月、今年或長期", () => {
    const a = run("career", [F("bazi", "communicationConflictRisk", ["career"]), F("qimen", "communicationConflictRisk", ["career"])]);
    expect(a.otherHorizons).toEqual([]);
  });
  it("流月、流年、大運各自對應本月、今年、長期，且追溯到該層", () => {
    const a = run("career", [F("bazi", "workloadIncrease", ["career"], 2, "month"), F("bazi", "communicationConflictRisk", ["career"], 2, "year"), F("bazi", "aptitudeResponsibility", ["career"], 1, "natal")]);
    expect(a.otherHorizons.map(h => h.horizon)).toEqual(["thisMonth", "thisYear", "longTerm"]);
    for (const t of a.trace) for (const f of t.findings) expect(HORIZON_LAYERS[t.horizon]).toContain(f.timeLayer);
  });
  it("近 3 天：同一因素至少兩天出現才產生；只出現一天不產生", () => {
    const d = (date: string) => [F("bazi", "workloadIncrease", ["career"], 2, "day", "principleOnly", date), F("qimen", "workloadIncrease", ["career"], 2, "day", "principleOnly", date)];
    const two = run("career", [], [d("2026-10-02"), d("2026-10-03")]);
    expect(two.otherHorizons.map(h => h.horizon)).toEqual(["next3Days"]);
    const t = two.trace.find(x => x.horizon === "next3Days")!;
    expect(new Set(t.findings.map(f => f.date)).size).toBeGreaterThanOrEqual(2);
    expect(run("career", [], [d("2026-10-02"), []]).otherHorizons).toEqual([]);
  });
  it("同一核心建議不跨時間重複：今天已出現，就不在近 3 天、本月再出現", () => {
    const risk = (layer: TimeLayer, date = "2026-10-01") => [F("bazi", "communicationConflictRisk", ["career"], 2, layer, "principleOnly", date), F("qimen", "communicationConflictRisk", ["career"], 2, layer, "principleOnly", date)];
    const a = run("career", [...risk("day"), ...risk("month")], [risk("day", "2026-10-02"), risk("day", "2026-10-03")]);
    const keys = [...a.doNow, ...a.avoidNow, ...a.otherHorizons.flatMap(h => [...h.doNow, ...h.avoidNow])].map(i => `${i.kind}|${i.semanticKey}`);
    expect(new Set(keys).size).toBe(keys.length);
    expect(a.doNow.map(i => i.adviceRuleId)).toContain("CAREER_COMM_001");
  });
});

// ───────── 真實命例 ─────────
const natals = SAMPLES.slice(0, 6).map(s => buildNatal(s));
const dates = ["2026-01-05", "2026-03-18", "2026-05-27", "2026-08-09", "2026-10-21", "2026-12-30"];
const outputs: { n: number; date: string; a: StructuredAdvice }[] = [];
for (const [i, n] of natals.entries()) for (const d of dates) for (const a of Object.values(adviseDay(n, d, TZ).byTopic)) outputs.push({ n: i, date: d, a: a! });
const texts = (a: StructuredAdvice) => [a.primaryAdvice, ...a.doNow, ...a.avoidNow, ...a.otherHorizons.flatMap(h => [...h.doNow, ...h.avoidNow])].filter(Boolean).map(i => i!);

describe("驗收標準（6 組命例 × 6 天 × 17 主題）", () => {
  it("A/B/I：一般人看得懂、可執行：主要建議、清單、結論都沒有命理術語，也不是空泛口號", () => {
    for (const { a } of outputs) {
      for (const it of texts(a)) {
        expect(lintAdviceText(it.text, { kind: it.kind }), it.text).toEqual([]);
        expect(lintAdviceText(it.short, { kind: it.kind }), it.short).toEqual([]);
      }
      for (const j of JARGON) expect(a.headline.includes(j), `${a.topic}: ${a.headline}`).toBe(false);
      expect(a.primaryAdvice).toBeTruthy();
      expect(a.doNow.length).toBeLessThanOrEqual(3);
      expect(a.avoidNow.length).toBeLessThanOrEqual(2);
    }
  });
  it("C：同一張盤問工作、投資、感情、出行，得到不同的建議", () => {
    const groups = new Map<string, StructuredAdvice[]>();
    for (const o of outputs) { const k = `${o.n}|${o.date}`; groups.set(k, [...(groups.get(k) ?? []), o.a]); }
    let compared = 0;
    for (const g of groups.values()) {
      const pick = (t: TopicId) => g.find(x => x.topic === t)!;
      const sets = (["career", "investment", "relationship", "travel"] as TopicId[]).map(t => pick(t)).map(a => new Set(texts(a).filter(i => !i.templateId.startsWith("CONFLICT") && !i.templateId.startsWith("NO_")).map(i => i.templateId)));
      for (let i = 0; i < sets.length; i++) for (let j = i + 1; j < sets.length; j++) {
        expect([...sets[i]].filter(x => sets[j].has(x))).toEqual([]);
        if (sets[i].size && sets[j].size) compared++;
      }
    }
    expect(compared).toBeGreaterThan(20);
  });
  it("D：每一條建議都能反查 AdviceRule → LifeFactor → 判讀規則 → 命盤資料", () => {
    const ruleIds = new Set([...ALL_RULES.map(r => r.id), ...ZIWEI_INTERPRETATION_RULES.map(r => r.ruleId)]);
    for (const { a } of outputs) {
      for (const it of texts(a).filter(i => !i.adviceRuleId.startsWith("NO_") && !i.adviceRuleId.startsWith("CONFLICT"))) {
        const t = a.trace.find(x => x.adviceItemId === it.id)!;
        expect(t, it.id).toBeTruthy();
        expect(t.factors.map(f => f.factorId).sort()).toEqual([...it.factors].sort());
        expect(t.findings.length).toBeGreaterThan(0);
        for (const f of t.findings) { expect(ruleIds.has(f.ruleId), f.ruleId).toBe(true); expect(f.source.conclusion).toBeTruthy(); }
      }
      for (const id of a.sourceRuleIds) expect(ruleIds.has(id)).toBe(true);
    }
  });
  it("G：紫微只以已校驗判讀規則、只在已涵蓋主題參與；legacy 紫微規則不會進入建議", () => {
    const { coveredTopics } = ziweiInterpretationStatus();
    for (const { a } of outputs) {
      const topic = a.topic;
      expect(a.sourceRuleIds.some(id => id.startsWith("ziwei"))).toBe(false);
      const zv = a.systemAgreement.systems.find(s => s.system === "ziwei")!;
      expect(zv.status).toBe("partial");
      expect(zv.participates).toBe(coveredTopics.includes(topic));
      const zf = a.trace.flatMap(t => t.findings.filter(f => f.system === "ziwei"));
      if (!coveredTopics.includes(topic)) expect(zf).toEqual([]);
      for (const f of zf) expect(ZIWEI_INTERPRETATION_RULES.find(r => r.ruleId === f.ruleId)?.verificationStatus, f.ruleId).toBe("verified");
    }
    const n = natals[0];
    const c = collect(n, { civilDate: "2026-10-21", civilTime: "12:00", timeZone: TZ }, "day", { legacyZiwei: true });
    expect(c.fired.some(f => f.system === "ziwei")).toBe(true); // 開發者模式的 legacy 紫微規則有命中
    const r = interpretationResults(n, c.fired, "2026-10-21")!.find(x => x.system === "ziwei")!;
    expect(r.status).toBe("partial");
    expect(r.findings.every(f => f.ruleId.startsWith("ZW_") && f.factors.every(q => q.mappingType === "nativeInterpretation"))).toBe(true);
  });
  it("舊規則附帶的 legacyAdviceText 不會進入正式建議", () => {
    const legacy = new Set<string>();
    for (const n of natals) for (const d of dates) for (const f of collect(n, { civilDate: d, civilTime: "12:00", timeZone: TZ }, "day").fired) f.fired.text.legacyAdviceText.forEach(t => legacy.add(t));
    expect(legacy.size).toBeGreaterThan(50);
    for (const { a } of outputs) for (const it of texts(a)) { expect(legacy.has(it.text)).toBe(false); expect(legacy.has(it.short)).toBe(false); }
  });
  it("安全規則：投資、健康、訴訟主題附上固定說明；只有一般因素的主題信心不為高", () => {
    for (const { a } of outputs) {
      const T = ADVICE_TOPICS[a.topic];
      if (T.safety) expect(a.notes).toContain(SAFETY_NOTES[T.safety]);
      if (T.coverage === "generalOnly") expect(a.confidence.level).not.toBe("high");
      if (T.coverageNote) expect(a.coverage.note).toBe(T.coverageNote);
    }
  });
  it("信心不只是一個數字：列出來源可靠度、主題覆蓋、系統一致、資料完整度", () => {
    for (const { a } of outputs.slice(0, 40)) {
      expect(a.confidence).toMatchObject({ topicCoverage: expect.any(String), systemAgreement: expect.any(String), sourceReliability: expect.any(String) });
      expect(a.confidence.reasons.length).toBeGreaterThan(0);
    }
  });
  it("同樣輸入必定得到同樣建議（可重現）", () => {
    expect(adviseDay(natals[1], "2026-05-27", TZ)).toEqual(adviseDay(natals[1], "2026-05-27", TZ));
  });
  it("擇時事件：每種事件都有具體建議與事件時段", () => {
    for (const t of EVENT_TYPES) {
      const e = analyzeEvent(natals[2], t.key, "2026-10-05", null, TZ);
      expect(e.advice.timeHorizon).toBe("atTime");
      expect(e.advice.primaryAdvice).toBeTruthy();
      for (const it of texts(e.advice)) expect(lintAdviceText(it.text, { kind: it.kind })).toEqual([]);
    }
  });
});

describe("H：完全本機產生，不使用任何 AI／LLM API", () => {
  it("建議引擎與規則庫的原始碼沒有網路呼叫或 AI 服務", () => {
    const dirs = ["src/core/advice", "src/kb/advice"];
    for (const d of dirs) for (const f of readdirSync(path.resolve(__dirname, "../..", d))) {
      const src = readFileSync(path.resolve(__dirname, "../..", d, f), "utf8");
      expect(/fetch\(|XMLHttpRequest|openai|anthropic|generativelanguage|https?:\/\//i.test(src), `${d}/${f}`).toBe(false);
    }
  });
});
