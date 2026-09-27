/** 紫微 Interpretation Engine：來源登錄、引用校驗、語義登錄、判讀語境、規則閘門、三層運限、覆蓋矩陣、接上 ActionAdviceEngine。
 *  閘門測試使用「測試專用」的合成原文與規則（不是古籍內容），只驗證流程；正式規則庫目前全部待原文校驗。 */
import { describe, it, expect } from "vitest";
import { computeZiweiNatal, computeZiweiTransit, PALACES, MAJOR, type PalaceName } from "@/core/ziwei";
import { defaultSettings } from "@/core/person";
import { buildNatal } from "@/core/analysis";
import { collect } from "@/core/analysis/collect";
import { interpretationResults } from "@/core/advice";
import { buildStructuredAdvice } from "@/core/advice/engine";
import type { InterpretationFinding, InterpretationResult } from "@/core/advice/interpretation";
import { citationCheck, normalizeClassical, type ClassicalCitation, type ImportedClassicalText } from "@/core/ziwei/interp/citation";
import { buildContexts, sanFangContext } from "@/core/ziwei/interp/contexts";
import {
  DEFAULT_KB, interpretZiwei, ruleUsability, ziweiCoverage, ziweiInterpretationResult, ziweiInterpretationStatus, type InterpretationKB,
} from "@/core/ziwei/interp/engine";
import type { ZiweiInterpretationRule } from "@/core/ziwei/interp/rules";
import { ZIWEI_CITATIONS, ZIWEI_SOURCES, sourceOf } from "@/kb/ziwei/sources";
import { PALACE_SEMANTICS, STAR_SEMANTICS, palaceSemantic } from "@/kb/ziwei/semantics";
import { ZIWEI_INTERPRETATION_RULES, ZIWEI_PATTERN_RULES, ZIWEI_SOURCE_CONFLICTS } from "@/kb/ziwei/interpretationRules";
import { IMPORTED_ZIWEI_TEXTS } from "@/kb/ziwei/texts/imported.generated";
import { TOPIC_IDS } from "@/kb/advice/topics";
import { FACTOR_IDS } from "@/core/advice/factors";
import { SYSTEM_SCORING } from "@/kb/weights";
import { toBirth } from "./golden/snapshot";

const B = "子丑寅卯辰巳午未申酉戌亥";
const x = { gender: "male" as const, localDate: "1988-01-14", localTime: "01:15", timeZone: "Asia/Taipei", place: { name: "台南", lat: 22.99, lng: 120.21 }, useTrueSolarTime: false };
const natal = computeZiweiNatal({ personId: "f", gender: "male", birth: toBirth(x), settings: defaultSettings("") });
const transit = computeZiweiTransit(natal, { civilDate: "2026-09-27", civilTime: "12:00", timeZone: "Asia/Taipei" });

describe("ClassicalSourceRegistry", () => {
  it("來源層級：《全書》Tier 1、《捷覽》《全集》Tier 2、iztro Tier 4 只作軟體相容、一般網路 Tier 5", () => {
    expect(ZIWEI_SOURCES.map(s => [s.sourceId, s.tier, s.role])).toEqual([
      ["ziwei.quanshu", 1, "primaryClassical"], ["ziwei.jielan", 2, "secondaryClassical"], ["ziwei.quanji", 2, "secondaryClassical"],
      ["software.iztro", 4, "softwareDataset"], ["web.general", 5, "webArticle"],
    ]);
    expect(sourceOf("software.iztro")!.notFor).toEqual(expect.arrayContaining(["古籍來源", "紫微判讀權威", "格局原文來源", "吉凶權重來源"]));
    expect([sourceOf("ziwei.jielan")!.contentStatus, sourceOf("ziwei.quanji")!.contentStatus]).toEqual(["unavailable", "unavailable"]);
  });
  it("目前沒有匯入任何古籍原文；登錄為已匯入的古籍來源必須真的有原文與雜湊", () => {
    expect(IMPORTED_ZIWEI_TEXTS).toEqual([]);
    for (const s of ZIWEI_SOURCES.filter(s => s.tier <= 3 && s.contentStatus === "imported")) expect(IMPORTED_ZIWEI_TEXTS.some(t => t.sourceId === s.sourceId && t.sha256)).toBe(true);
    expect(sourceOf("ziwei.quanshu")!.contentStatus).toBe("notInRepository");
  });
});

describe("ClassicalCitation：原文、白話、判讀分開；未匯入前不憑記憶填寫原文", () => {
  it("所有引用指向已登錄來源；原文未匯入 → originalText 為 null、狀態 pendingVerification、位置未核對", () => {
    for (const c of ZIWEI_CITATIONS) {
      expect(sourceOf(c.sourceId), c.citationId).toBeTruthy();
      expect([c.originalText, c.normalizedText, c.modernTranslation, c.verificationStatus, c.locationStatus]).toEqual([null, null, null, "pendingVerification", "unverified"]);
    }
    expect(new Set(ZIWEI_CITATIONS.map(c => c.citationId)).size).toBe(ZIWEI_CITATIONS.length);
  });
  it("逐字校驗：正規化後比對、只在指定篇內比對、未匯入或不相符都會被拒", () => {
    const text: ImportedClassicalText = { sourceId: "ziwei.quanshu", edition: "測試版", origin: "測試", license: "測試", sha256: "x", importedAt: "", sections: [{ sectionId: "s1", volume: null, title: "測試篇", text: "甲乙丙丁，測試原文一句。\n" }] };
    const c = (o: Partial<ClassicalCitation>): ClassicalCitation => ({ ...ZIWEI_CITATIONS[0], section: "測試篇", edition: "測試版", ...o });
    expect(citationCheck(c({ originalText: "測試原文 一句" }), [text]).ok).toBe(true);
    expect(citationCheck(c({ originalText: "不存在的句子" }), [text]).reason).toContain("不相符");
    expect(citationCheck(c({ originalText: "測試原文一句", section: "別篇" }), [text]).reason).toContain("找不到篇名");
    expect(citationCheck(c({ originalText: "測試原文一句" }), []).reason).toContain("尚未匯入");
    expect(citationCheck(c({ originalText: null }), [text]).ok).toBe(false);
    expect(normalizeClassical("紫微，爲帝座。")).toBe("紫微為帝座");
  });
});

describe("PalaceSemanticRegistry／StarSemanticRegistry", () => {
  it("十二宮：古典語義待校驗、現代用途標為 App 依宮名整理、判讀須搭配三方四正", () => {
    expect(PALACE_SEMANTICS.map(p => p.name)).toEqual([...PALACES]);
    for (const p of PALACE_SEMANTICS) {
      expect([p.classicalMeaning.text, p.classicalMeaning.status, p.modernMeaning.basis]).toEqual([null, "pendingVerification", "palaceNameLiteral"]);
      for (const t of p.relatedTopics) expect(TOPIC_IDS).toContain(t);
      expect(p.caveats.join()).toContain("不能只看本宮");
    }
    expect(palaceSemantic("官祿").combineWith).toEqual({ opposite: "夫妻", trines: ["命宮", "財帛"] });
    expect(palaceSemantic("官祿").relatedTopics).toEqual(["career", "promotion", "jobSearch", "jobChange"]);
    expect(palaceSemantic("疾厄").caveats.join()).toContain("不診斷");
  });
  it("十四主星：不是性格關鍵字表；七個語義欄位皆待原文校驗，並註明核心性質不等於人格定論", () => {
    expect(STAR_SEMANTICS.map(s => s.star)).toEqual(MAJOR);
    for (const s of STAR_SEMANTICS) {
      for (const f of [s.coreNature, s.favorableExpression, s.imbalancedExpression, s.palaceContext, s.sanfangInfluence, s.transformationChanges, s.withAuspiciousMalefic]) {
        expect([f.text, f.status]).toEqual([null, "pendingVerification"]);
        expect(f.citationIds.length).toBeGreaterThan(0);
      }
      expect(s.limitations.join()).toContain("不等於對使用者的人格定論");
      expect(s.confidence).toBe("none");
    }
    expect([STAR_SEMANTICS.filter(s => s.placementGroup === "ziwei").length, STAR_SEMANTICS.filter(s => s.placementGroup === "tianfu").length]).toEqual([6, 8]);
  });
});

describe("判讀語境（客觀）", () => {
  const ctx = buildContexts(natal, transit);
  it("三方四正：本宮坐守、對宮、三合宮分開保存；照會星不會變成坐守星", () => {
    const sf = sanFangContext(ctx, natal, "命宮")!;
    expect(sf.members.map(m => [m.relationType, B[m.branch], m.palaceName])).toEqual([["self", "亥", "命宮"], ["opposite", "巳", "遷移"], ["trine1", "卯", "官祿"], ["trine2", "未", "財帛"]]);
    expect(sf.members[0].residentMajor.map(s => s.name)).toEqual(["天府"]);
    expect(sf.members[1].residentMajor.map(s => s.name)).toEqual(["紫微", "七殺"]);
    expect(sf.members[0].residentMajor.some(s => s.name === "紫微")).toBe(false);
  });
  it("四化：生年、大限、流年分開，記錄所在宮位", () => {
    expect(ctx.transformations.birthYear.map(t => [t.star + t.transformation, t.natalPalace])).toEqual([["太陰祿", "父母"], ["天同權", "父母"], ["天機科", "交友"], ["巨門忌", "田宅"]]);
    expect(ctx.transformations.decade.every(t => t.type === "decade")).toBe(true);
    expect(ctx.transformations.annual.every(t => t.type === "annual")).toBe(true);
    expect(ctx.palaces[0].transformations.filter(t => t.type === "birthYear").map(t => t.star)).toEqual(["太陰", "天同"]);
  });
  it("空宮：借對宮只作參考，借星權重維持 undefined，不列入坐守星", () => {
    const e = ctx.emptyPalaces.find(p => p.natalName === "兄弟")!;
    expect([e.branch, e.residentStars, e.borrowedStars.map(s => s.name), e.borrowedStarWeight]).toEqual([10, ["地空", "火星"], ["天機", "天梁"], undefined]);
    expect(ctx.palaces[10].residentMajor).toEqual([]);
  });
  it("運限三層：本命 → 大限 → 流年，各層宮名分開", () => {
    expect([ctx.natal.lifeOnNatal, ctx.decade!.lifeOnNatal, ctx.annual!.label]).toEqual(["命宮", "子女", "流年"]);
    expect(ctx.palaces.find(p => p.natalName === "子女")!.decadeName).toBe("命宮");
    expect(buildContexts(natal, null).decade).toBeNull();
  });
});

describe("正式規則庫：沒有已校驗原文前，不建立任何判讀內容", () => {
  it("28 條待校驗條目；全部未啟用、無條件、無古籍原則、無判讀、無生活因素", () => {
    expect(ZIWEI_INTERPRETATION_RULES).toHaveLength(28);
    for (const r of ZIWEI_INTERPRETATION_RULES) {
      expect([r.enabled, r.verificationStatus, r.condition, r.classicalPrinciple, r.interpretation, r.lifeFactors]).toEqual([false, "pendingVerification", null, null, null, []]);
      expect(ruleUsability(r).usable).toBe(false);
      for (const id of r.citations) expect(sourceOf(ZIWEI_CITATIONS.find(c => c.citationId === id)!.sourceId)!.tier).toBe(1);
    }
    expect(new Set(ZIWEI_INTERPRETATION_RULES.map(r => r.ruleId)).size).toBe(28);
    expect([ZIWEI_PATTERN_RULES, ZIWEI_SOURCE_CONFLICTS]).toEqual([[], []]);
  });
  it("覆蓋矩陣：各主題都是 none；紫微維持 pending，不進入建議，也不計分", () => {
    const cov = ziweiCoverage();
    expect(cov.map(c => c.topic)).toEqual(TOPIC_IDS);
    expect(cov.every(c => c.level === "none" && c.verifiedRuleCount === 0)).toBe(true);
    expect(cov.find(c => c.topic === "career")!).toMatchObject({ ruleCount: 1, pendingRuleCount: 1 });
    expect(ziweiInterpretationStatus()).toEqual({ status: "pending", coveredTopics: [] });
    expect(SYSTEM_SCORING.ziwei.status).toBe("pending");
    const n = buildNatal({ person: { id: "p", displayName: "p", gender: "male", relation: "self", isFavorite: false, sortOrder: 0, createdAt: "", updatedAt: "" }, birth: toBirth(x), settings: defaultSettings("") });
    const c = collect(n, { civilDate: "2026-09-27", civilTime: "12:00", timeZone: "Asia/Taipei" }, "day");
    expect(interpretationResults(n, c.fired, "2026-09-27", c.ziwei).find(r => r.system === "ziwei")).toEqual({ system: "ziwei", status: "pending", reason: "目前紫微判讀引擎建置中，未納入本次建議。", findings: [] });
  });
});

// ───────── 閘門與流程（測試專用合成資料） ─────────
const TEXT: ImportedClassicalText = { sourceId: "ziwei.quanshu", edition: "測試版", origin: "測試", license: "測試", sha256: "t", importedAt: "", sections: [{ sectionId: "t1", volume: null, title: "測試篇", text: "測試原文甲。測試原文乙。\n" }] };
const cit = (id: string, text: string, sourceId = "ziwei.quanshu"): ClassicalCitation => ({ ...ZIWEI_CITATIONS[0], citationId: id, sourceId, edition: "測試版", section: "測試篇", originalText: text, verificationStatus: "verified", locationStatus: "verifiedAgainstText" });
const rule = (o: Partial<ZiweiInterpretationRule> & Pick<ZiweiInterpretationRule, "ruleId" | "condition">): ZiweiInterpretationRule => ({
  kind: "starInPalace", title: "測試規則", topics: ["career"], timeLayer: "natal", role: "baseNatalMeaning", citations: ["T_OK"],
  classicalPrinciple: "測試原則", appImplementation: "測試整理", interpretation: "測試判讀", lifeFactors: [{ factorId: "progressOpportunity", strength: 2 }],
  verificationStatus: "verified", confidence: "medium", school: "測試", enabled: true, ...o,
});
const kb = (rules: ZiweiInterpretationRule[]): InterpretationKB => ({
  rules, texts: [TEXT], sources: DEFAULT_KB.sources,
  citations: [cit("T_OK", "測試原文甲"), cit("T_BAD", "原文沒有這句"), cit("T_IZTRO", "測試原文甲", "software.iztro")],
});

describe("規則閘門：啟用＋已校驗＋引用原文逐字相符，才可使用", () => {
  it("原文不相符、引用 Tier 4 軟體資料、未啟用、pending 都不可用", () => {
    const k = kb([]);
    expect(ruleUsability(rule({ ruleId: "A", condition: { kind: "emptyPalace", palace: "兄弟" } }), k)).toEqual({ usable: true, reason: "已校驗" });
    expect(ruleUsability(rule({ ruleId: "B", condition: { kind: "emptyPalace", palace: "兄弟" }, citations: ["T_BAD"] }), k).reason).toContain("不相符");
    expect(ruleUsability(rule({ ruleId: "C", condition: { kind: "emptyPalace", palace: "兄弟" }, citations: ["T_IZTRO"] }), k).reason).toContain("Tier 4");
    expect(ruleUsability(rule({ ruleId: "D", condition: { kind: "emptyPalace", palace: "兄弟" }, enabled: false }), k).usable).toBe(false);
    expect(ruleUsability(rule({ ruleId: "E", condition: { kind: "emptyPalace", palace: "兄弟" }, verificationStatus: "pendingVerification" }), k).usable).toBe(false);
    expect(ruleUsability(rule({ ruleId: "F", condition: null }), k).reason).toContain("成立條件");
  });
  it("坐守與照會分開判斷：紫微在命宮的對宮，本宮坐守不成立、照會成立", () => {
    const k = kb([
      rule({ ruleId: "SELF", condition: { kind: "starInPalace", star: "紫微", palace: "命宮" } }),
      rule({ ruleId: "OPP", condition: { kind: "starInPalace", star: "紫微", palace: "命宮", relation: "opposite" } }),
      rule({ ruleId: "SF", condition: { kind: "starInPalace", star: "紫微", palace: "命宮", relation: "sanfang" } }),
      rule({ ruleId: "TIANFU", condition: { kind: "starInPalace", star: "天府", palace: "命宮" } }),
      rule({ ruleId: "HUA", condition: { kind: "transformation", transformation: "祿", source: "birthYear", star: "太陰", palace: "父母" } }),
      rule({ ruleId: "HUA_NO", condition: { kind: "transformation", transformation: "祿", source: "birthYear", star: "太陰", palace: "命宮" } }),
      rule({ ruleId: "EMPTY", condition: { kind: "emptyPalace", palace: "兄弟" } }),
    ]);
    const z = interpretZiwei(natal, transit, k);
    expect(z.findings.map(f => f.ruleId)).toEqual(["OPP", "SF", "TIANFU", "HUA", "EMPTY"]);
    expect(z.findings.find(f => f.ruleId === "OPP")!.evidence[0]).toContain("三方照會");
  });
  it("本命 → 大限 → 流年三層：運限只作修正，流年判讀不移除本命判讀；沒有運限資料時運限規則不觸發", () => {
    const k = kb([
      rule({ ruleId: "N", condition: { kind: "starInPalace", star: "天府", palace: "命宮" } }),
      rule({ ruleId: "D", timeLayer: "decade", role: "periodModifier", condition: { kind: "emptyPalace", palace: "兄弟" } }),
      rule({ ruleId: "Y", timeLayer: "annual", role: "annualModifier", lifeFactors: [{ factorId: "communicationConflictRisk", strength: 1 }], condition: { kind: "emptyPalace", palace: "兄弟" } }),
    ]);
    const career = interpretZiwei(natal, transit, k).topics.find(t => t.topic === "career")!;
    expect([career.baseNatalMeaning.map(f => f.ruleId), career.periodModifier.map(f => f.ruleId), career.annualModifier.map(f => f.ruleId)]).toEqual([["N"], ["D"], ["Y"]]);
    const noTransit = interpretZiwei(natal, null, k);
    expect(noTransit.findings.map(f => f.ruleId)).toEqual(["N"]);
    expect(noTransit.trace.evaluations.find(e => e.ruleId === "D")!.reason).toContain("沒有對應的運限資料");
  });
  it("覆蓋矩陣：只有工作有可用規則 → 工作 partial、其餘 none；紫微狀態 partial，只涵蓋工作", () => {
    const k = kb([rule({ ruleId: "N", condition: { kind: "starInPalace", star: "天府", palace: "命宮" } })]);
    const cov = ziweiCoverage(k);
    expect(cov.find(c => c.topic === "career")).toMatchObject({ level: "partial", verifiedRuleCount: 1, sourceCoverage: ["ziwei.quanshu"], layers: ["natal"] });
    expect(cov.filter(c => c.level !== "none").map(c => c.topic)).toEqual(["career"]);
    const r = ziweiInterpretationResult(natal, transit, "2026-09-27", undefined, k);
    expect([r.status, r.coveredTopics]).toEqual(["partial", ["career"]]);
    expect(r.findings[0].factors[0]).toMatchObject({ factorId: "progressOpportunity", mappingType: "nativeInterpretation", sourceSystem: "ziwei", reliability: "classicalText" });
  });
});

describe("接上 ActionAdviceEngine：紫微只在有覆蓋的主題參與", () => {
  const F = (system: "bazi" | "qimen" | "ziwei", domains: ("career" | "investment")[]): InterpretationFinding => ({
    findingId: `${system}-${domains.join()}`, system, ruleId: `${system}.test`, date: "2026-10-01", timeLayer: "day", reliability: system === "ziwei" ? "classicalText" : "principleOnly",
    effects: domains.map(d => ({ domain: d, polarity: 1, strength: 2 })),
    factors: [{ factorId: "progressOpportunity", polarity: "support", strength: 2, domains, sourceSystem: system, sourceRuleIds: [`${system}.test`], timeLayer: "day", mappingType: system === "ziwei" ? "nativeInterpretation" : "derivedFromExistingInterpretation", reliability: system === "ziwei" ? "classicalText" : "principleOnly", confidence: "medium" }],
    mapping: { basis: "測試", reason: "測試" }, source: { conclusion: "測試", plain: "", pro: "", principle: "", school: "", textIds: [], matched: [], legacyAdviceText: [] },
  });
  const results: InterpretationResult[] = [
    { system: "bazi", status: "active", findings: [F("bazi", ["career", "investment"])] },
    { system: "ziwei", status: "partial", coveredTopics: ["career"], reason: "紫微判讀部分啟用：只用於工作", findings: [F("ziwei", ["career", "investment"])] },
    { system: "qimen", status: "active", findings: [F("qimen", ["career", "investment"])] },
    { system: "iching", status: "active", findings: [] },
  ];
  const run = (topic: "career" | "investment") => buildStructuredAdvice({ topic, date: "2026-10-01", mode: "day", interpretations: results, nextDays: [results.map(r => ({ ...r, findings: [] })), results.map(r => ({ ...r, findings: [] }))], timing: null });
  it("工作：紫微納入跨系統整合與追溯；投資：同一份紫微判讀不納入", () => {
    const c = run("career"), i = run("investment");
    expect(c.systemAgreement.systems.find(s => s.system === "ziwei")!.support).toContain("推進機會");
    expect(c.trace.flatMap(t => t.findings.map(f => f.system))).toContain("ziwei");
    expect(i.systemAgreement.systems.find(s => s.system === "ziwei")!.support).toEqual([]);
    expect(i.trace.flatMap(t => t.findings.map(f => f.system))).not.toContain("ziwei");
    expect(c.confidence.dataCompleteness.activeSystems).toContain("ziwei");
  });
  it("紫微判讀規則的生活因素都在共用詞彙表內（跨系統同一份）", () => {
    for (const r of ZIWEI_INTERPRETATION_RULES) for (const l of r.lifeFactors) expect(FACTOR_IDS).toContain(l.factorId);
  });
});

describe("客觀排盤不受判讀層影響", () => {
  it("建立判讀語境不改變命盤資料", () => {
    const before = JSON.stringify(natal.palaces);
    buildContexts(natal, transit);
    interpretZiwei(natal, transit);
    expect(JSON.stringify(natal.palaces)).toBe(before);
    expect((natal.palaces as { name: PalaceName }[]).map(p => p.name)).toHaveLength(12);
  });
});
