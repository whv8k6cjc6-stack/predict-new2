import { describe, it, expect } from "vitest";
import { buildStructuredAdvice } from "@/core/advice/engine";
import { adviseDay, ZIWEI_ADVICE_PENDING, type InterpretationResult, type InvestorProfile } from "@/core/advice";
import { factorDef, type FactorId } from "@/core/advice/factors";
import type { InterpretationFinding, TimeLayer } from "@/core/advice/interpretation";
import { lintAdviceText } from "@/core/advice/lint";
import { buildNatal } from "@/core/analysis";
import type { DomainKey } from "@/core/domains";
import { ADVICE_RULES } from "@/kb/advice/rules";
import { INVEST_VARIANTS, TEMPLATE_STEPS } from "@/kb/advice/steps";
import { ADVICE_TEMPLATES, TEMPLATE_IDS } from "@/kb/advice/templates";
import { TOPIC_IDS } from "@/kb/advice/topics";
import type { ScoredSystem } from "@/kb/weights";
import { SAMPLES } from "../../scripts/calibrate-samples";

let seq = 0;
const F = (system: ScoredSystem, factorId: FactorId, domains: DomainKey[] = ["investment"], strength: 1 | 2 | 3 = 2, layer: TimeLayer = "day"): InterpretationFinding => {
  const id = `t.${system}.${factorId}.${seq++}`;
  return {
    findingId: `${id}@2026-10-01`, system, ruleId: id, date: "2026-10-01", timeLayer: layer, reliability: "principleOnly",
    effects: domains.map(d => ({ domain: d, polarity: factorDef(factorId).nature === "risk" ? -1 : 1, strength })),
    factors: [{ factorId, polarity: factorDef(factorId).nature, strength, domains, sourceSystem: system, sourceRuleIds: [id], timeLayer: layer, mappingType: "derivedFromExistingInterpretation", reliability: "principleOnly", confidence: "medium" }],
    mapping: { basis: "測試", reason: "測試" },
    source: { conclusion: "測試判讀", plain: "", pro: "", principle: "", school: "", textIds: [], matched: [], legacyAdviceText: [] },
  };
};
const results = (fs: InterpretationFinding[]): InterpretationResult[] => (["bazi", "ziwei", "qimen", "iching"] as ScoredSystem[]).map(s =>
  s === "ziwei" ? { system: s, status: "pending", reason: ZIWEI_ADVICE_PENDING, findings: [] } : { system: s, status: "active", findings: fs.filter(f => f.system === s) });
const run = (fs: InterpretationFinding[], investor?: InvestorProfile, timing: { best: string[]; avoid: string[]; basis: string } | null = null) =>
  buildStructuredAdvice({ topic: "investment", date: "2026-10-01", mode: "day", interpretations: results(fs), nextDays: [[], []].map(results), timing, investor });

const kindOf = (id: string) => ADVICE_RULES.some(r => r.avoid === id) ? "avoid" as const : "do" as const;

describe("具體步驟與投資方式版本：文字品質", () => {
  it("每個步驟、每個投資方式版本都通過白話／具體／安全檢查", () => {
    for (const [id, steps] of Object.entries(TEMPLATE_STEPS)) {
      expect(TEMPLATE_IDS, id).toContain(id);
      expect(steps!.length, id).toBeGreaterThanOrEqual(2);
      expect(steps!.length, id).toBeLessThanOrEqual(4);
      for (const s of steps!) expect(lintAdviceText(s, { kind: "do" }), `${id}：${s}`).toEqual([]);
    }
    for (const [id, vs] of Object.entries(INVEST_VARIANTS)) for (const [style, v] of Object.entries(vs!)) {
      expect(lintAdviceText(v!.text, { kind: kindOf(id) }), `${id}.${style}.text`).toEqual([]);
      expect(lintAdviceText(v!.short, { kind: kindOf(id) }), `${id}.${style}.short`).toEqual([]);
      for (const s of v!.steps ?? []) expect(lintAdviceText(s, { kind: "do" }), `${id}.${style}：${s}`).toEqual([]);
    }
  });
  it("每個主題的訊號不一致都有該主題的做法（不只共用版本）", () => {
    for (const t of TOPIC_IDS) expect(ADVICE_RULES.filter(r => r.conflictPolicy === "conflictOnly" && r.topics.includes(t)), t).toHaveLength(1);
    expect(ADVICE_RULES.some(r => r.conflictPolicy === "conflictOnly" && !r.topics.length)).toBe(false);
  });
  it("投資建議規則至少 15 條，模板全部有具體步驟", () => {
    const inv = ADVICE_RULES.filter(r => r.topics.includes("investment"));
    expect(inv.length).toBeGreaterThanOrEqual(15);
    for (const r of inv) for (const t of [r.action, r.avoid]) if (t && t.startsWith("INV_") && kindOf(t) === "do") expect(TEMPLATE_STEPS[t], t).toBeTruthy();
  });
});

describe("投資：依投資方式調整用語，節奏卡", () => {
  const impulse = [F("bazi", "impulsivityRisk"), F("qimen", "impulsivityRisk")];
  it("同樣的訊號，定期定額與短線交易看到不同的說法與步驟；建議本身（規則）不變", () => {
    const dca = run(impulse, { style: "dca" }), st = run(impulse, { style: "shortTerm" }), none = run(impulse);
    const pick = (a: ReturnType<typeof run>) => a.doNow.find(i => i.templateId === "INV_FOLLOW_RULES")!;
    expect(pick(dca).text).toContain("扣款");
    expect(pick(st).text).toContain("停損");
    expect(pick(none).text).not.toBe(pick(dca).text);
    expect(pick(dca).adviceRuleId).toBe(pick(st).adviceRuleId);
    expect(pick(st).steps!.length).toBeGreaterThanOrEqual(2);
  });
  it("節奏：不利訊號多 → 不開新部位；有利且一致 → 照計畫執行；不一致 → 小步；沒訊號 → 照原本紀律", () => {
    expect(run([F("bazi", "setbackRisk"), F("qimen", "setbackRisk"), F("iching", "resourceLossRisk")]).investRhythm!.level).toBe("pause");
    expect(run([F("bazi", "decisionClarity"), F("qimen", "resourceStability"), F("iching", "decisionClarity")]).investRhythm!.level).toBe("steady");
    expect(run([F("bazi", "decisionClarity"), F("qimen", "setbackRisk"), F("iching", "approachSensitivity", ["investment"], 1)]).investRhythm!.level).toBe("small");
    expect(run([]).investRhythm!.level).toBe("quiet");
  });
  it("檢查清單：依因素與投資設定的紀律缺口產生，最多 6 項，全部通過安全檢查；下單時段來自時段判讀", () => {
    const a = run([F("bazi", "errorRisk"), F("qimen", "trustRisk"), F("iching", "cashFlowPressure")], { style: "swing", hasExitRule: false }, { best: ["9–11 點", "19–21 點"], avoid: ["13–15 點"], basis: "測試" });
    const r = a.investRhythm!;
    expect(r.checklist.length).toBeLessThanOrEqual(6);
    expect(r.checklist.join()).toMatch(/核對/);
    expect(r.checklist.join()).toMatch(/查證/);
    expect(r.checklist.join()).toMatch(/出場條件/);
    expect(r.orderWindow).toEqual({ market: { best: ["9–11 點"], avoid: [] }, other: { best: ["19–21 點"], avoid: ["13–15 點"] }, note: null });
    expect(run([], undefined, { best: ["19–21 點"], avoid: [], basis: "測試" }).investRhythm!.orderWindow!.note).toContain("盤中沒有特別較佳");
    for (const c of [...r.checklist, r.summary]) expect(lintAdviceText(c, { kind: "do" }), c).toEqual([]);
    expect(a.doNow.map(i => i.templateId).concat(a.avoidNow.map(i => i.templateId))).toEqual(expect.arrayContaining(["INV_ORDER_CHECK"]));
  });
  it("節奏卡只在投資主題出現；實際命例的投資輸出全部通過安全檢查", () => {
    const n = buildNatal(SAMPLES[0]);
    for (const d of ["2026-02-03", "2026-06-17", "2026-11-28"]) for (const style of [undefined, "dca", "longHold", "swing", "shortTerm", "none"] as const) {
      const adv = adviseDay(n, d, "Asia/Taipei", ["investment", "career"], "今天", style ? { style } : undefined);
      expect(adv.byTopic.career!.investRhythm).toBeUndefined();
      const a = adv.byTopic.investment!;
      expect(a.investRhythm).toBeTruthy();
      const items = [a.primaryAdvice!, ...a.doNow, ...a.avoidNow, ...a.otherHorizons.flatMap(h => [...h.doNow, ...h.avoidNow])];
      for (const it of items) for (const s of [it.text, it.short, ...(it.steps ?? [])]) expect(lintAdviceText(s, { kind: it.kind }), s).toEqual([]);
      for (const c of a.investRhythm!.checklist) expect(lintAdviceText(c, { kind: "do" }), c).toEqual([]);
    }
  });
});

it("模板與步驟的槽位只用 {時段}／{較佳時段}／{避開時段}", () => {
  const all = [...Object.values(ADVICE_TEMPLATES).flatMap(t => [t.text, t.short]), ...Object.values(TEMPLATE_STEPS).flat()];
  for (const s of all) for (const m of s!.match(/\{[^}]+\}/g) ?? []) expect(["{時段}", "{較佳時段}", "{避開時段}"], s!).toContain(m);
});

describe("今日總結與每日一句", () => {
  it("每一句原文都是已匯入《周易》該段的連續片段；白話通過文字品質檢查；每種狀態都至少有兩句可選", async () => {
    const { DAILY_QUOTES } = await import("@/kb/advice/quotes");
    const { getSourceText } = await import("@/kb/sources");
    for (const q of DAILY_QUOTES) {
      const t = getSourceText(q.textId);
      expect(t, q.id).toBeTruthy();
      expect(t!.text, q.id).toContain(q.excerpt);
      expect(lintAdviceText(q.plain), q.id).toEqual([]);
    }
    for (const m of ["push", "steady", "care", "rest", "people"] as const) expect(DAILY_QUOTES.filter(q => q.moods.includes(m)).length, m).toBeGreaterThanOrEqual(2);
  });
  it("總結只重組既有建議；同一天固定同一句、不同日期會輪替；所有文字通過安全檢查", async () => {
    const { summarizeDay } = await import("@/core/advice");
    const n = buildNatal(SAMPLES[2]);
    const seen = new Set<string>();
    for (const d of ["2026-01-09", "2026-04-14", "2026-07-21", "2026-10-04", "2026-12-12"]) {
      const adv = adviseDay(n, d, "Asia/Taipei", ["general", "career", "wealth", "investment", "relationship", "health"]);
      const s = summarizeDay(d, adv.byTopic), again = summarizeDay(d, adv.byTopic);
      expect(again.quote).toEqual(s.quote);
      seen.add(s.quote.textId);
      expect(s.lines.length).toBeLessThanOrEqual(8);
      const shorts = Object.values(adv.byTopic).flatMap(a => [a!.primaryAdvice, ...a!.doNow, ...a!.avoidNow, ...a!.otherHorizons.flatMap(h => [...h.doNow, ...h.avoidNow])]).filter(Boolean).map(i => i!.short);
      for (const l of s.lines) if (l.kind !== "info") expect(shorts.some(x => l.text.endsWith(x)), l.text).toBe(true);
      for (const t of [s.overview, ...s.lines.map(l => l.text), s.quote.plain]) expect(lintAdviceText(t), t).toEqual([]);
    }
    expect(seen.size).toBeGreaterThan(1);
  });
});
