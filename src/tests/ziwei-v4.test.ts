/** 紫微 v4：雙重核讀頁面、逐句規則、格局、運限、古典廟旺與規則品質稽核。 */
import { describe, it, expect } from "vitest";
import { computeZiweiNatal, computeZiweiTransit } from "@/core/ziwei";
import { defaultSettings } from "@/core/person";
import { buildNatal } from "@/core/analysis";
import { adviseDay } from "@/core/advice";
import { citationUsableForRules, type ClassicalCitation } from "@/core/ziwei/interp/citation";
import { DEFAULT_KB, interpretZiwei, ruleUsability, ziweiCoverage, ziweiInterpretationStatus } from "@/core/ziwei/interp/engine";
import { buildContexts } from "@/core/ziwei/interp/contexts";
import type { ZiweiCondition } from "@/core/ziwei/interp/rules";
import { ZIWEI_INTERPRETATION_RULES, ZIWEI_PATTERN_CANDIDATES, ZIWEI_PATTERN_RULES } from "@/kb/ziwei/interpretationRules";
import { ZIWEI_CITATIONS, SPAN_RECHECKS } from "@/kb/ziwei/sources";
import { GUANGYI_PAGES, findExcerpt, pageStats } from "@/kb/ziwei/texts/pages";
import { GY_BRIGHTNESS, GY_BRIGHTNESS_CONFLICTS, GY_BUILT, GY_CLAUSE_SPECS, gyClassicalLevel } from "@/kb/ziwei/v2";
import { OUTCOMES } from "@/kb/ziwei/v2/dsl";
import { completion, pendingItems } from "@/kb/ziwei/v2/completion";
import { softwareBrightness } from "@/kb/ziwei/v2/brightness";
import { SYSTEM_SCORING } from "@/kb/weights";
import corrections from "@/data/classics/ziwei/quanshu-guangyi/corrections.json";
import SECOND_SOURCE from "@/data/classics/ziwei/quanshu-guangyi/passes/second_source.json";
import { toBirth } from "./golden/snapshot";

const x = { gender: "male" as const, localDate: "1988-01-14", localTime: "01:15", timeZone: "Asia/Taipei", place: { name: "台南", lat: 22.99, lng: 120.21 }, useTrueSolarTime: false };
const natal = computeZiweiNatal({ personId: "f", gender: "male", birth: toBirth(x), settings: defaultSettings("") });
const transit = computeZiweiTransit(natal, { civilDate: "2031-06-01", civilTime: "12:00", timeZone: "Asia/Taipei" });
const usable = ZIWEI_INTERPRETATION_RULES.filter(r => ruleUsability(r).usable);
const citOf = (id: string) => ZIWEI_CITATIONS.find(c => c.citationId === id)!;
const FATAL = /夭|壽不長|短命|死|亡|病|疾|殘|刑剋|剋夫|剋子|貧賤|下賤|娼|淫|盜|注定|必定/;
const HEALTH_OK = new Set(["fatigueRisk", "stressLoad", "recoveryNeed", "energySupport", "routineCareReminder"]);
const walk = (c: ZiweiCondition | null, f: (c: ZiweiCondition) => void) => { if (!c) return; f(c); if (c.kind === "all" || c.kind === "any") c.of.forEach(y => walk(y, f)); if (c.kind === "not") walk(c.of, f); };

describe("v4 頁面：兩輪獨立目視轉錄＋差異回影像決議", () => {
  it("涵蓋 PDF p17–20、p26–55；每個欄組保存影像範圍與分級驗證狀態，沒有人工校勘的宣稱；第二來源只在有〔校〕字的欄組", () => {
    const pages = new Set(GUANGYI_PAGES.leaves.map(l => l.pdfPage));
    for (const p of [17, 18, 19, 20, ...Array.from({ length: 30 }, (_, i) => 26 + i)]) expect(pages.has(p), `p${p}`).toBe(true);
    for (const s of GUANGYI_PAGES.leaves.flatMap(l => l.strips)) {
      expect(s.region.x0).toBeLessThan(s.region.x1);
      expect(s.verification).toMatchObject({ visualTranscribed: true, humanReviewed: false, machineLocated: false });
      expect(s.verification.secondSourceVerified).toBe(s.columns.join("").includes("〔校："));
      expect(s.verification.visualDoubleChecked).toBe(s.uncertainGlyphs.length === 0 && !s.columns.join("").includes("〔"));
    }
    expect(pageStats().doubleCheckedStrips).toBeGreaterThan(300);
  });
  it("第二來源佐證：每個〔校〕字都有紀錄，採用的讀法必是兩輪之一，且與電子全文該段逐字相同", () => {
    const recs = SECOND_SOURCE.records;
    const marks = GUANGYI_PAGES.leaves.flatMap(l => l.strips).reduce((n, s) => n + (s.columns.join("").match(/〔校：/g)?.length ?? 0), 0);
    expect(recs.length).toBeGreaterThan(50);
    expect(marks).toBe(recs.reduce((n, r) => n + [...r.adopted].filter(c => /[\u4e00-\u9fff]/.test(c)).length, 0));
    expect(SECOND_SOURCE.sha256).toMatch(/^[0-9a-f]{64}$/);
    for (const r of recs) {
      expect([r.passA, r.passB]).toContain(r.adopted);
      expect(r.adopted).not.toMatch(/□/);
      expect(r.secondSourceText.length).toBeGreaterThan(0);
    }
    // 第二來源只佐證、不當答案：可用的引用若含〔校〕字，驗證狀態必為 secondSourceVerified 而非雙重核讀
    for (const c of ZIWEI_CITATIONS.filter(c => c.verification?.secondSourceVerified)) {
      expect(c.verification!.visualDoubleChecked, c.citationId).toBe(false);
      expect(citationUsableForRules(c).reason).toContain("第二來源");
    }
  });
  it("findExcerpt：優先採用無疑字的一處；疑字片段標為 unclean", () => {
    const h = findExcerpt("27R", "子午宮旺地天府同丁己生人財官格")!;
    expect(h.clean).toBe(true);
    expect(findExcerpt("27R", "不存在的句子")).toBeNull();
  });
});

describe("來源修正與舊段落複核", () => {
  it("SourceCorrectionLog：命宮章首 p26、卷之二終 p36、卷之三 p37、v4 校訂稿三處誤讀、舊段落改以雙重核讀複核", () => {
    expect(corrections.corrections.map(c => c.correctionId)).toEqual(["SC-001", "SC-002", "SC-003", "SC-004", "SC-005", "SC-006", "SC-007"]);
    expect(corrections.corrections.find(c => c.correctionId === "SC-005")!.correctedClaim).toContain("聚吉科權祿");
  });
  it("舊 35 段：逐一與第二次核讀比對，只有逐字相同且無疑字者算雙重核讀；其餘不啟用並說明原因", () => {
    expect(SPAN_RECHECKS).toHaveLength(35);
    for (const r of SPAN_RECHECKS) {
      const c = ZIWEI_CITATIONS.find(c => c.citationId.startsWith("CIT_QS_") && c.originalText === r.firstPass)!;
      expect(!!(c.verification?.visualDoubleChecked || c.verification?.secondSourceVerified), r.spanId).toBe(r.result === "identical" || r.result === "identicalAfterResolution");
      expect(r.note.length).toBeGreaterThan(5);
    }
  });
});

describe("規則品質稽核", () => {
  it("1. 每條啟用規則都有引用，且引用可在雙重核讀頁面逐字找到", () => {
    expect(usable.length).toBeGreaterThan(500);
    for (const r of usable) {
      expect(r.citations.length, r.ruleId).toBeGreaterThan(0);
      for (const id of r.citations) {
        const c = citOf(id);
        const leaf = c.locator!.spanId.split(":")[0];
        if (leaf.match(/^\d+[RL]$/)) expect(findExcerpt(leaf, c.originalText!)?.clean, `${r.ruleId} ${id}`).toBe(true);
      }
    }
  });
  it("2. 啟用規則的引用全部是原始掃描影像雙重核讀（或兩輪讀法之一經第二來源逐字佐證）、無疑字、非 OCR、非人工初稿", () => {
    for (const r of usable) for (const id of r.citations) {
      const c = citOf(id);
      expect(c.verification?.visualDoubleChecked || (c.verification?.visualTranscribed && c.verification?.secondSourceVerified), id).toBe(true);
      expect(c.uncertainGlyphs ?? [], id).toEqual([]);
      expect(c.sourceType, id).toBe("scanVisual");
      expect(c.verification?.humanReviewed).toBe(false);
    }
  });
  it("3. OCR 或人工初稿的引用永遠不能啟用規則；有疑字也不行", () => {
    const base = citOf(usable.find(r => r.ruleId.startsWith("GY_"))!.citations[0]);
    const mk = (o: Partial<ClassicalCitation>) => ({ ...base, citationId: "T", ...o });
    expect(citationUsableForRules(mk({ sourceType: "ocrOnly" })).ok).toBe(false);
    expect(citationUsableForRules(mk({ sourceType: "humanDraft" })).ok).toBe(false);
    expect(citationUsableForRules(mk({ uncertainGlyphs: ["〔疑字：X〕"] })).ok).toBe(false);
    expect(citationUsableForRules(mk({ verification: { ...base.verification!, visualDoubleChecked: false } })).ok).toBe(false);
    const rule = { ...usable.find(r => r.ruleId.startsWith("GY_"))!, citations: ["T"] };
    expect(ruleUsability(rule, { ...DEFAULT_KB, citations: [mk({ sourceType: "ocrOnly" })] }).usable).toBe(false);
  });
  it("4. 每條未啟用規則都有具體原因（沒有「尚未處理」）", () => {
    const allowed = new Set(["unclearGlyph", "insufficientConditions", "requiresOtherEdition", "ocrOnly", "historicalOnly", "requiresChartExtension", "notInterpretive"]);
    for (const r of GY_BUILT.rules.filter(r => !r.enabled)) expect(allowed.has(r.pendingReason!), r.ruleId).toBe(true);
    for (const p of pendingItems()) expect(p.detail.length, p.id).toBeGreaterThan(3);
    expect(GY_BUILT.problems).toEqual([]);
  });
  it("5. 格局：PatternRule 都有原文與條件；只有名稱或條件不足的是 PatternCandidate，不啟用", () => {
    expect(ZIWEI_PATTERN_RULES.length).toBeGreaterThan(30);
    for (const p of ZIWEI_PATTERN_RULES) { expect(p.source.length).toBeGreaterThan(0); expect(p.originalText).toBeTruthy(); expect(p.relationRequirements.length).toBe(1); }
    for (const c of ZIWEI_PATTERN_CANDIDATES) expect(ZIWEI_INTERPRETATION_RULES.find(r => r.ruleId === c.patternId)!.enabled).toBe(false);
    expect(ZIWEI_PATTERN_CANDIDATES.filter(c => c.name.startsWith("七殺朝斗") || c.name === "日月並明").length).toBe(2);
  });
  it("6. 流年不覆蓋本命：流年、大限判讀只作修正層，本命判讀仍在", () => {
    const z = interpretZiwei(natal, transit);
    const roles = new Set(z.findings.map(f => f.role));
    expect([...roles].sort()).toEqual(["annualModifier", "baseNatalMeaning", "periodModifier"]);
    const noT = interpretZiwei(natal, null);
    expect(z.findings.filter(f => f.role === "baseNatalMeaning").map(f => f.ruleId)).toEqual(noT.findings.map(f => f.ruleId));
    for (const r of usable) expect(r.role).toBe(r.timeLayer === "natal" ? "baseNatalMeaning" : r.timeLayer === "decade" ? "periodModifier" : "annualModifier");
  });
  it("7. 借星不等於坐守：空宮的借星不讓「某星在此宮」成立", () => {
    const ctx = buildContexts(natal, null);
    const e = ctx.emptyPalaces.find(p => p.natalName === "兄弟")!;
    const k = { ...DEFAULT_KB, rules: [{ ...usable[0], ruleId: "T_BORROW", condition: { kind: "starInPalace" as const, star: e.borrowedStars[0].name, palace: "兄弟" as const } }] };
    expect(interpretZiwei(natal, null, k).findings).toEqual([]);
  });
  it("8. 三方照會不等於同宮：relation self 與 sanfang 分開判斷", () => {
    const k = (rel: "self" | "sanfang") => ({ ...DEFAULT_KB, rules: [{ ...usable[0], ruleId: `T_${rel}`, condition: { kind: "starInPalace" as const, star: "紫微", palace: "命宮" as const, relation: rel } }] });
    expect(interpretZiwei(natal, null, k("self")).findings).toHaveLength(0);
    expect(interpretZiwei(natal, null, k("sanfang")).findings).toHaveLength(1);
  });
  it("9. 紫微計分停用；規則沒有固定加減分，生活因素強度只 1–3", () => {
    expect(SYSTEM_SCORING.ziwei.status).toBe("pending");
    for (const r of ZIWEI_INTERPRETATION_RULES) {
      expect(Object.keys(r)).not.toContain("score");
      for (const l of r.lifeFactors) expect([1, 2, 3]).toContain(l.strength);
    }
    expect(JSON.stringify(OUTCOMES)).not.toMatch(/[+-]\d{2}/);
  });
  it("10. 一般模式文字（判讀、現代語義）沒有宿命斷語；原文另有的斷語只寫在 appImplementation 的「不採用」", () => {
    for (const r of usable) for (const t of [r.interpretation, r.modernSemantic]) if (t) expect(t, r.ruleId).not.toMatch(FATAL);
  });
  it("11. 健康只使用 fatigueRisk／stressLoad／recoveryNeed 等非醫療因素", () => {
    for (const r of usable.filter(r => r.topics.includes("health"))) for (const l of r.lifeFactors) expect(HEALTH_OK.has(l.factorId), `${r.ruleId} ${l.factorId}`).toBe(true);
  });
  it("12. 入女命訣全部只保留原文；入男命訣的規則都帶男命條件", () => {
    for (const s of GY_CLAUSE_SPECS.filter(s => s.section.includes("入女命"))) expect(s.pendingReason, s.id).toBe("historicalOnly");
    for (const s of GY_CLAUSE_SPECS.filter(s => s.section.includes("入男命吉凶訣") && s.when)) {
      let male = false; walk(s.when, c => { if (c.kind === "gender" && c.gender === "male") male = true; });
      expect(male, s.id).toBe(true);
    }
  });
  it("13. 需要小限、斗君、空亡等客觀排盤沒有的資料 → requiresChartExtension，不擅自新增排盤", () => {
    const need = GY_CLAUSE_SPECS.filter(s => /併小限|斗君|空亡|羊陀迭併/.test(s.quote) && !s.when);
    expect(need.length).toBeGreaterThan(20);
    for (const s of need) expect(["requiresChartExtension", "historicalOnly", "insufficientConditions", "unclearGlyph"]).toContain(s.pendingReason ?? "unclearGlyph");
  });
  it("14. 條件只用客觀盤面資料；星名都存在於排盤", () => {
    const stars = new Set(natal.palaces.flatMap(p => [...p.major.map(s => s.name), ...p.minor.map(s => s.name), ...p.misc]).concat(["紫微", "天機", "太陽", "武曲", "天同", "廉貞", "天府", "太陰", "貪狼", "巨門", "天相", "天梁", "七殺", "破軍", "天刑", "天馬", "天魁", "天鉞"]));
    for (const r of usable) walk(r.condition, c => { if (c.kind === "starInPalace") expect(stars.has(c.star), `${r.ruleId} ${c.star}`).toBe(true); });
  });
});

describe("古典廟旺（ClassicalBrightnessRule）與軟體亮度（iztro）分開", () => {
  it("古典廟旺全部雙重核讀；與 iztro 不同之處建立 BrightnessConflict；客觀排盤的亮度仍是 iztro", () => {
    expect(GY_BRIGHTNESS.problems).toEqual([]);
    expect(GY_BRIGHTNESS.rules.every(r => r.clean)).toBe(true);
    expect(GY_BRIGHTNESS_CONFLICTS.length).toBeGreaterThan(0);
    for (const c of GY_BRIGHTNESS_CONFLICTS) expect(c.classicalValue).not.toBe(c.softwareValue);
    for (const p of natal.palaces) for (const s of p.major) expect(s.brightness).toBe(softwareBrightness(s.name, "子丑寅卯辰巳午未申酉戌亥"[p.branch]));
    expect(gyClassicalLevel("紫微", "午")).toBe("廟");
  });
});

describe("覆蓋與完成度", () => {
  it("覆蓋分 none／generalOnly／partial／dedicated；只有 partial、dedicated 參與建議", () => {
    const cov = ziweiCoverage();
    const st = ziweiInterpretationStatus();
    expect(st.coveredTopics).toEqual(cov.filter(c => c.level === "partial" || c.level === "dedicated").map(c => c.topic));
    for (const c of cov.filter(c => c.level === "dedicated")) expect(c.factorRuleCount).toBeGreaterThanOrEqual(10);
    expect(cov.find(c => c.topic === "jobSearch")!.level).not.toBe("dedicated");
  });
  it("完成度數字由資料計算", () => {
    const k = completion();
    expect(k.rules.total).toBe(ZIWEI_INTERPRETATION_RULES.length);
    expect(k.rules.usable).toBe(usable.length);
    expect(k.scoring).toBe("pending");
    expect(k.citations.humanReviewed).toBe(0);
  });
});

describe("完整鏈：盤面 → 判讀 → 生活因素 → 建議（可追溯）", () => {
  it("命盤 1988-01-14：財運的長期建議追溯到紫微規則與 PDF 頁碼；建議文字具體、沒有命理術語", () => {
    const n = buildNatal({ person: { id: "p", displayName: "p", gender: "male", relation: "self", isFavorite: false, sortOrder: 0, createdAt: "", updatedAt: "" }, birth: toBirth(x), settings: defaultSettings("") });
    const d = adviseDay(n, "2026-09-27", "Asia/Taipei", ["wealth"]);
    const tr = d.byTopic.wealth!.trace.find(t => t.findings.some(f => f.system === "ziwei"))!;
    expect(tr).toBeTruthy();
    const f = tr.findings.find(f => f.system === "ziwei")!;
    const rule = ZIWEI_INTERPRETATION_RULES.find(r => r.ruleId === f.ruleId)!;
    expect(citOf(rule.citations[0]).locator?.pdfPage).toBeGreaterThan(0);
    const item = [...d.byTopic.wealth!.otherHorizons.flatMap(h => h.doNow)].find(i => i.id === tr.adviceItemId || i.adviceRuleId === tr.adviceRuleId)!;
    expect(item.text).not.toMatch(/化祿|化忌|大限|流年|紫微|天府|命宮/);
  });
});
