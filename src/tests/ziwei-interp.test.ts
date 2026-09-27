/** 紫微 Interpretation Engine：來源登錄、引用校驗、語義登錄、判讀語境、規則閘門、三層運限、覆蓋矩陣、接上 ActionAdviceEngine。
 *  正式資料：《紫微斗數全書》廣益版掃描 PDF 的逐段目視核對轉錄。閘門測試另用「測試專用」的合成原文與規則，只驗證流程。 */
import { describe, it, expect } from "vitest";
import { computeZiweiNatal, computeZiweiTransit, PALACES, MAJOR, type PalaceName } from "@/core/ziwei";
import { defaultSettings } from "@/core/person";
import { buildNatal } from "@/core/analysis";
import { adviseDay } from "@/core/advice";
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
import { IMPORTED_ZIWEI_TEXTS, GUANGYI_SOURCE, GUANGYI_TRANSCRIPTION } from "@/kb/ziwei/texts/imported";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { TOPIC_IDS } from "@/kb/advice/topics";
import { FACTOR_IDS } from "@/core/advice/factors";
import { SYSTEM_SCORING } from "@/kb/weights";
import { toBirth } from "./golden/snapshot";

const B = "子丑寅卯辰巳午未申酉戌亥";
const x = { gender: "male" as const, localDate: "1988-01-14", localTime: "01:15", timeZone: "Asia/Taipei", place: { name: "台南", lat: 22.99, lng: 120.21 }, useTrueSolarTime: false };
const natal = computeZiweiNatal({ personId: "f", gender: "male", birth: toBirth(x), settings: defaultSettings("") });
const transit = computeZiweiTransit(natal, { civilDate: "2026-09-27", civilTime: "12:00", timeZone: "Asia/Taipei" });

describe("ClassicalSourceRegistry", () => {
  it("來源層級：《全書》廣益版掃描 Tier 1（已匯入）、維基文庫本 Tier 1（未匯入）、《捷覽》《全集》集文版 Tier 2、iztro Tier 4、一般網路 Tier 5", () => {
    expect(ZIWEI_SOURCES.map(s => [s.sourceId, s.tier, s.role, s.contentStatus])).toEqual([
      ["ziwei-doushu-quanshu-guangyi-scan", 1, "primaryClassical", "imported"], ["ziwei.quanshu", 1, "primaryClassical", "notInRepository"],
      ["ziwei.jielan", 2, "secondaryClassical", "unavailable"], ["ziwei-doushu-quanji-jiwen-scan", 2, "secondaryClassical", "unavailable"],
      ["software.iztro", 4, "softwareDataset", "imported"], ["web.general", 5, "webArticle", "unavailable"],
    ]);
    expect(sourceOf("software.iztro")!.notFor).toEqual(expect.arrayContaining(["古籍來源", "紫微判讀權威", "格局原文來源", "吉凶權重來源"]));
    expect(sourceOf("ziwei-doushu-quanji-jiwen-scan")!.notes).toContain("尚未比對");
  });
  it("登錄為已匯入的古籍來源必須真的有原文與雜湊；只收已校驗段落", () => {
    for (const s of ZIWEI_SOURCES.filter(s => s.tier <= 3 && s.contentStatus === "imported")) expect(IMPORTED_ZIWEI_TEXTS.some(t => t.sourceId === s.sourceId && t.sha256)).toBe(true);
    const gy = IMPORTED_ZIWEI_TEXTS.find(t => t.sourceId === "ziwei-doushu-quanshu-guangyi-scan")!;
    expect(gy.sha256).toBe("cec2c444290ac70020a5ae4e20a50c07a0064783e53ff3162f90a299d7831186");
    expect(gy.sections).toHaveLength(GUANGYI_TRANSCRIPTION.spans.length);
    expect(gy.sections.every(x => x.transcriptionStatus === "verified" && x.pdfPage)).toBe(true);
  });
});

describe("廣益版掃描：PDF 影像為 Source of Truth，雜湊可重現", () => {
  const dir = join(__dirname, "../data/classics/ziwei/quanshu-guangyi");
  const sha = (b: Buffer) => createHash("sha256").update(b).digest("hex");
  it("sha256.json 與來源檔一致；PDF 雜湊與 source.json 登錄一致", () => {
    const rec = JSON.parse(readFileSync(join(dir, "sha256.json"), "utf8"));
    expect(rec["source.json"]).toBe(sha(readFileSync(join(dir, "source.json"))));
    expect(rec["transcription.json"]).toBe(sha(readFileSync(join(dir, "transcription.json"))));
    expect([rec.pdf, GUANGYI_TRANSCRIPTION.pdfSha256]).toEqual([GUANGYI_SOURCE.sha256, GUANGYI_SOURCE.sha256]);
    expect([GUANGYI_SOURCE.pageCount, GUANGYI_SOURCE.textLayer, GUANGYI_SOURCE.verificationPolicy.ocrMayActivateRules]).toEqual([86, false, false]);
  });
  it.skipIf(!process.env.ZIWEI_SCAN_PDF)("本地有 PDF 原檔時（ZIWEI_SCAN_PDF），原檔 SHA-256 相符", () => {
    expect(sha(readFileSync(process.env.ZIWEI_SCAN_PDF!))).toBe(GUANGYI_SOURCE.sha256);
  });
  it("每段轉錄：有 PDF 頁碼、版心頁碼、卷、篇、條目、裁切範圍；只含原書文字（無標點、無省略號、無疑字標記）", () => {
    const ids = new Set<string>();
    for (const sp of GUANGYI_TRANSCRIPTION.spans) {
      expect(ids.has(sp.spanId)).toBe(false); ids.add(sp.spanId);
      expect(sp.pdfPage).toBeGreaterThanOrEqual(1); expect(sp.pdfPage).toBeLessThanOrEqual(86);
      expect(sp.printedPage).toBe(sp.pdfPage - 2);
      expect(sp.volume && sp.section && sp.entry).toBeTruthy();
      expect(sp.clip.every(v => v >= 0 && v <= 1) && sp.clip[0] < sp.clip[2] && sp.clip[1] < sp.clip[3]).toBe(true);
      expect(sp.transcriptionStatus).toBe("verified");
      expect(sp.text, sp.spanId).toMatch(/^[\u4e00-\u9fff]+$/);
    }
    expect(GUANGYI_TRANSCRIPTION.verification.verifiedBy).toContain("非人工");
  });
});

describe("ClassicalCitation：每條原文都能回到 PDF 頁面與轉錄段落", () => {
  it("14 主星、12 宮、大限／流年原則：全部 verified，原文為該段連續子字串，保留頁碼、核對者與日期", () => {
    expect(ZIWEI_CITATIONS).toHaveLength(14 + 12 + 3);
    for (const c of ZIWEI_CITATIONS) {
      const sp = GUANGYI_TRANSCRIPTION.spans.find(x => x.spanId === c.locator?.spanId)!;
      expect(sp, c.citationId).toBeTruthy();
      expect(sp.text.includes(c.originalText!), c.citationId).toBe(true);
      expect([c.verificationStatus, c.transcriptionStatus, c.locationStatus]).toEqual(["verified", "verified", "verifiedAgainstText"]);
      expect([c.locator!.pdfPage, c.locator!.printedPage, c.volume, c.section]).toEqual([sp.pdfPage, sp.printedPage, sp.volume, sp.section]);
      expect(c.verifiedBy && c.verifiedAt && c.modernTranslation).toBeTruthy();
      expect(sourceOf(c.sourceId)!.tier).toBe(1);
      expect(citationCheck(c, IMPORTED_ZIWEI_TEXTS)).toMatchObject({ ok: true, sectionId: sp.spanId });
    }
    for (const s of MAJOR) expect(ZIWEI_CITATIONS.find(c => c.entry === s && c.section === "一命宮")!.verificationStatus).toBe("verified");
    expect(new Set(ZIWEI_CITATIONS.map(c => c.citationId)).size).toBe(ZIWEI_CITATIONS.length);
  });
  it("初稿與影像不同時以影像為準，差異記錄在 draftCorrections（例：貪狼「水」、巨門「敦厚清秀」）", () => {
    const sp = (id: string) => GUANGYI_TRANSCRIPTION.spans.find(x => x.spanId === id)!;
    expect(sp("GY-P29-TANLANG").text.startsWith("貪狼水北斗")).toBe(true);
    expect(sp("GY-P29-TANLANG").draftCorrections!.join()).toContain("貪狼，火");
    expect(sp("GY-P30-JUMEN").text).toContain("敦厚清秀");
    expect(sp("GY-P27-TAIYANG").notes).toContain("〔疑字：入〕");
    expect(sp("GY-P27-TAIYANG").text.startsWith("南北斗")).toBe(true);
  });
  it("逐字校驗：正規化後比對、只在指定篇內比對、有頁碼時只在該頁比對、未匯入或不相符都會被拒", () => {
    const text: ImportedClassicalText = { sourceId: "ziwei.quanshu", edition: "測試版", origin: "測試", license: "測試", sha256: "x", importedAt: "", sections: [{ sectionId: "s1", volume: null, title: "測試篇", text: "甲乙丙丁，測試原文一句。\n" }] };
    const c = (o: Partial<ClassicalCitation>): ClassicalCitation => ({ ...ZIWEI_CITATIONS[0], sourceId: "ziwei.quanshu", locator: undefined, section: "測試篇", edition: "測試版", ...o });
    expect(citationCheck(c({ originalText: "測試原文 一句" }), [text]).ok).toBe(true);
    expect(citationCheck(c({ originalText: "不存在的句子" }), [text]).reason).toContain("不相符");
    expect(citationCheck(c({ originalText: "測試原文一句", section: "別篇" }), [text]).reason).toContain("找不到篇名");
    expect(citationCheck(c({ originalText: "測試原文一句" }), []).reason).toContain("尚未匯入");
    expect(citationCheck(c({ originalText: null }), [text]).ok).toBe(false);
    const draft: ImportedClassicalText = { ...text, sections: [{ ...text.sections[0], transcriptionStatus: "transcriptionUnverified" }] };
    expect(citationCheck(c({ originalText: "測試原文一句" }), [draft]).ok).toBe(false);
    const wrongPage = { ...ZIWEI_CITATIONS[0], locator: { ...ZIWEI_CITATIONS[0].locator!, pdfPage: 5 } };
    expect(citationCheck(wrongPage, IMPORTED_ZIWEI_TEXTS).reason).toContain("第 5 頁");
    expect(normalizeClassical("紫微，爲帝座。")).toBe("紫微為帝座");
  });
});

describe("PalaceSemanticRegistry／StarSemanticRegistry", () => {
  it("十二宮：古典語義有已校驗引用（父母宮只有篇名，篇旨待核對）、現代用途另外標為 App 依宮名整理", () => {
    expect(PALACE_SEMANTICS.map(p => p.name)).toEqual([...PALACES]);
    for (const p of PALACE_SEMANTICS) {
      expect(p.classicalMeaning.status).toBe(p.name === "父母" ? "pendingVerification" : "verified");
      expect(p.modernMeaning.basis).toBe("palaceNameLiteral");
      expect(ZIWEI_CITATIONS.find(c => c.citationId === p.classicalMeaning.citationIds[0])!.verificationStatus).toBe("verified");
      for (const t of p.relatedTopics) expect(TOPIC_IDS).toContain(t);
      expect(p.caveats.join()).toContain("不能只看本宮");
    }
    expect([palaceSemantic("夫妻").classicalName, palaceSemantic("交友").classicalName]).toEqual(["妻妾", "奴僕"]);
    expect(palaceSemantic("官祿").combineWith).toEqual({ opposite: "夫妻", trines: ["命宮", "財帛"] });
    expect(palaceSemantic("疾厄").caveats.join()).toContain("不診斷");
    expect(palaceSemantic("疾厄").classicalMeaning.text).toContain("先看命宮");
  });
  it("十四主星：核心主題已校驗；欄位分開（有利、需留意、成立條件、組合）；生活因素候選與規則一致", () => {
    expect(STAR_SEMANTICS.map(s => s.star)).toEqual(MAJOR);
    for (const s of STAR_SEMANTICS) {
      expect([s.coreThemes.status, s.verificationStatus]).toEqual(["verified", "verified"]);
      for (const f of [s.coreThemes, s.favorableExpressions, s.challengingExpressions, s.conditionalFactors, s.combinationDependencies]) {
        expect(f.status === "verified" ? !!f.text : f.text === null).toBe(true);
        expect(f.citationIds).toEqual(s.classicalCitations);
      }
      expect(s.limitations.join()).toContain("不等於對使用者的人格定論");
      const rule = ZIWEI_INTERPRETATION_RULES.find(r => r.ruleId === `ZW_STAR_${s.starCode}_NATURE`)!;
      expect(rule.lifeFactors.map(l => l.factorId).sort()).toEqual(s.lifeFactorCandidates.filter(c => c.enabled).map(c => c.factorId).sort());
      for (const c of s.lifeFactorCandidates.filter(c => !c.enabled)) expect(c.reason.length).toBeGreaterThan(5);
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

describe("正式規則庫：第一批已校驗規則", () => {
  const FATAL = /短命|夭|貧窮|貧賤|離婚|犯罪|刑|病|死|必定|一定會|注定|下賤|孤寒/;
  const LOOKS = /面|肥|瘦|胖|眉|腰|背|眼|身長|形/;
  it("14 條主星坐命規則全部可用；2 條運限原則不單獨觸發；0 條待校驗", () => {
    expect(ZIWEI_INTERPRETATION_RULES).toHaveLength(16);
    const stars = ZIWEI_INTERPRETATION_RULES.filter(r => r.kind === "star");
    expect(stars).toHaveLength(14);
    for (const r of stars) {
      expect([r.enabled, r.verificationStatus, r.timeLayer, r.role]).toEqual([true, "verified", "natal", "baseNatalMeaning"]);
      expect(r.condition).toMatchObject({ kind: "starInPalace", palace: "命宮", relation: "self", layer: "natal" });
      expect(ruleUsability(r)).toEqual({ usable: true, reason: "已校驗" });
      expect(r.classicalPrinciple && r.modernSemantic && r.interpretation).toBeTruthy();
    }
    const principles = ZIWEI_INTERPRETATION_RULES.filter(r => r.kind === "principle");
    expect(principles.map(r => [r.ruleId, r.timeLayer, r.role, ruleUsability(r).usable])).toEqual([
      ["ZW_PERIOD_DAXIAN_PRINCIPLE", "decade", "periodModifier", false], ["ZW_PERIOD_ANNUAL_PRINCIPLE", "annual", "annualModifier", false],
    ]);
    expect(ZIWEI_INTERPRETATION_RULES.filter(r => r.verificationStatus === "pendingVerification")).toEqual([]);
    expect(new Set(ZIWEI_INTERPRETATION_RULES.map(r => r.ruleId)).size).toBe(16);
    expect([ZIWEI_PATTERN_RULES, ZIWEI_SOURCE_CONFLICTS]).toEqual([[], []]);
  });
  it("每條啟用規則都追溯到原文：引用皆已校驗且原文在 PDF 轉錄中；判讀層不寫外貌、不寫宿命式結論", () => {
    for (const r of ZIWEI_INTERPRETATION_RULES) {
      for (const id of r.citations) {
        const c = ZIWEI_CITATIONS.find(x => x.citationId === id)!;
        expect(c.verificationStatus).toBe("verified");
        expect(GUANGYI_TRANSCRIPTION.spans.some(sp => sp.text.includes(c.originalText!))).toBe(true);
      }
      for (const t of [r.interpretation, r.modernSemantic]) if (t) { expect(t, r.ruleId).not.toMatch(FATAL); expect(t, r.ruleId).not.toMatch(LOOKS); }
    }
  });
  it("生活因素只來自原文明寫「為官祿主／為財帛主／化富」的主星，且都是長期傾向類（不當成每日吉凶）", () => {
    const withF = ZIWEI_INTERPRETATION_RULES.filter(r => r.lifeFactors.length);
    expect(withF.map(r => [r.ruleId, r.lifeFactors.map(l => `${l.factorId}:${l.strength}`).join()])).toEqual([
      ["ZW_STAR_ZIWEI_NATURE", "aptitudeResponsibility:2"], ["ZW_STAR_TAIYANG_NATURE", "aptitudeResponsibility:2"], ["ZW_STAR_WUQU_NATURE", "aptitudeResources:2"],
      ["ZW_STAR_LIANZHEN_NATURE", "aptitudeResponsibility:1"], ["ZW_STAR_TIANFU_NATURE", "aptitudeResources:2"], ["ZW_STAR_TAIYIN_NATURE", "aptitudeResources:1"],
      ["ZW_STAR_TIANXIANG_NATURE", "aptitudeResponsibility:2"],
    ]);
    for (const r of withF) {
      const c = ZIWEI_CITATIONS.find(x => x.citationId === r.citations[0])!;
      expect(c.originalText).toMatch(/為官祿主|為財帛主|化富/);
      for (const l of r.lifeFactors) expect(l.factorId.startsWith("aptitude")).toBe(true);
    }
  });
  it("覆蓋矩陣由可用規則計算：綜合、工作、財運、不動產為部分覆蓋，其餘主題 none；不是 17 個主題一起開", () => {
    const cov = ziweiCoverage();
    expect(cov.map(c => c.topic)).toEqual(TOPIC_IDS);
    expect(cov.filter(c => c.level !== "none").map(c => [c.topic, c.level, c.verifiedRuleCount])).toEqual([
      ["general", "partial", 14], ["career", "partial", 4], ["wealth", "partial", 3], ["property", "partial", 1],
    ]);
    expect(cov.find(c => c.topic === "career")!).toMatchObject({ layers: ["natal"], sourceCoverage: ["ziwei-doushu-quanshu-guangyi-scan"], pendingRuleCount: 0 });
    expect(ziweiInterpretationStatus()).toEqual({ status: "partial", coveredTopics: ["general", "career", "wealth", "property"] });
  });
  it("紫微仍不參與計分（沒有 0–100 的紫微分數）", () => {
    expect(SYSTEM_SCORING.ziwei.status).toBe("pending");
  });
});

describe("實際命盤：命宮天府 → 判讀 → 生活因素 → 建議", () => {
  const n = buildNatal({ person: { id: "p", displayName: "p", gender: "male", relation: "self", isFavorite: false, sortOrder: 0, createdAt: "", updatedAt: "" }, birth: toBirth(x), settings: defaultSettings("") });
  it("只有坐守命宮的天府成立（照會的紫微、七殺不算）；追溯到 PDF 頁碼", () => {
    const z = interpretZiwei(natal, transit);
    expect(z.findings.map(f => f.ruleId)).toEqual(["ZW_STAR_TIANFU_NATURE"]);
    const f = z.findings[0];
    expect(f.evidence[0]).toContain("天府");
    expect(f.citations[0].locator).toMatchObject({ pdfPage: 28, printedPage: 26, spanId: "GY-P28-TIANFU" });
    expect(z.topics.find(t => t.topic === "wealth")!.lifeFactors.map(l => [l.factorId, l.role])).toEqual([["aptitudeResources", "baseNatalMeaning"]]);
    expect(z.topics.find(t => t.topic === "wealth")!.periodModifier).toEqual([]);
  });
  it("ActionAdviceEngine：財運的長期建議納入紫微並可追溯；投資不納入；工作沒有相關判讀就不出現", () => {
    const d = adviseDay(n, "2026-09-27", "Asia/Taipei", ["wealth", "career", "investment"]);
    const zr = d.interpretations.find(r => r.system === "ziwei")!;
    expect([zr.status, zr.coveredTopics]).toEqual(["partial", ["general", "career", "wealth", "property"]]);
    expect(zr.findings.map(f => [f.ruleId, f.factors.map(q => q.factorId).join(), f.effects.map(e => e.domain).join()])).toEqual([["ZW_STAR_TIANFU_NATURE", "aptitudeResources", "wealth"]]);
    const zTrace = (t: "wealth" | "career" | "investment") => d.byTopic[t]!.trace.flatMap(q => q.findings.filter(f => f.system === "ziwei").map(f => f.ruleId));
    expect(zTrace("wealth")).toEqual(["ZW_STAR_TIANFU_NATURE"]);
    expect(d.byTopic.wealth!.otherHorizons.find(h => h.horizon === "longTerm")!.doNow.map(i => i.adviceRuleId)).toContain("LONG_APT_RESOURCES");
    expect(zTrace("investment")).toEqual([]);
    expect(zTrace("career")).toEqual([]);
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
