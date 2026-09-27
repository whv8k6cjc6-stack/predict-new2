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
import { ZIWEI_CITATIONS, ZIWEI_SOURCES, JIWEN_SOURCE, sourceOf } from "@/kb/ziwei/sources";
import { ZIWEI_PENDING, PENDING_COUNTS } from "@/kb/ziwei/pending";
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
      ["ziwei.jielan", 2, "secondaryClassical", "unavailable"], ["ziwei-doushu-quanji-jiwen-scan", 2, "secondaryClassical", "notInRepository"],
      ["software.iztro", 4, "softwareDataset", "imported"], ["web.general", 5, "webArticle", "unavailable"],
    ]);
    expect(sourceOf("software.iztro")!.notFor).toEqual(expect.arrayContaining(["古籍來源", "紫微判讀權威", "格局原文來源", "吉凶權重來源"]));
    expect(sourceOf("ziwei-doushu-quanji-jiwen-scan")!.notFor.join()).toContain("逐字引用");
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
    expect(rec["../quanji-jiwen/source.json"]).toBe(sha(readFileSync(join(dir, "../quanji-jiwen/source.json"))));
    expect([rec.jiwenPdf, JIWEN_SOURCE.sha256]).toEqual(["6b4c5e00b2b7aa840767a8df19ebc51321acd0bcc38b6f142addca884631c4f6", "6b4c5e00b2b7aa840767a8df19ebc51321acd0bcc38b6f142addca884631c4f6"]);
    expect([GUANGYI_SOURCE.pageCount, GUANGYI_SOURCE.textLayer, GUANGYI_SOURCE.verificationPolicy.ocrMayActivateRules]).toEqual([86, false, false]);
  });
  it.skipIf(!process.env.ZIWEI_SCAN_PDF)("本地有 PDF 原檔時（ZIWEI_SCAN_PDF），原檔 SHA-256 相符", () => {
    expect(sha(readFileSync(process.env.ZIWEI_SCAN_PDF!))).toBe(GUANGYI_SOURCE.sha256);
  });
  it.skipIf(!process.env.ZIWEI_JIWEN_PDF)("本地有集文版原檔時（ZIWEI_JIWEN_PDF），原檔 SHA-256 相符", () => {
    expect(sha(readFileSync(process.env.ZIWEI_JIWEN_PDF!))).toBe(JIWEN_SOURCE.sha256);
  });
  it("來源包 v3：保存於 repo 的說明、索引與人工初稿，雜湊與 manifest_v3.json 相符；兩本 PDF 雜湊與登錄相符", () => {
    const pkg = join(dir, "../package-v3");
    const man = JSON.parse(readFileSync(join(pkg, "manifest_v3.json"), "utf8")) as { files: { path: string; sha256: string }[]; primarySource: { sha256: string }; secondarySource: { sha256: string } };
    expect([man.primarySource.sha256, man.secondarySource.sha256]).toEqual([GUANGYI_SOURCE.sha256, JIWEN_SOURCE.sha256]);
    const kept = man.files.filter(f => !f.path.startsWith("source/") && !f.path.startsWith("ocr/"));
    expect(kept.length).toBe(10);
    for (const f of kept) expect(sha(readFileSync(join(pkg, f.path))), f.path).toBe(f.sha256);
  });
  it("集文版：只登錄平行段落與大意（visualVerified=false），不建立異文；掃描解析度不足以逐字核對", () => {
    expect(JIWEN_SOURCE.scanQuality.characterLevelVerification).toBe("notPossibleForMostPassages");
    for (const p of JIWEN_SOURCE.parallelSections) expect(p.visualVerified).toBe(false);
    expect(JIWEN_SOURCE.parallelSections[0].gistReadings!.map(g => g.star)).toEqual(MAJOR);
    expect(ZIWEI_CITATIONS.every(c => c.textualVariants.length === 0 && c.sourceId === "ziwei-doushu-quanshu-guangyi-scan")).toBe(true);
    expect(ZIWEI_SOURCE_CONFLICTS).toEqual([]);
    expect(GUANGYI_SOURCE.navigationDiscrepancy.decision).toContain("GY-P26-MING-HEAD");
  });
  it("待校驗登錄：人工初稿、OCR、格局候選一律 pending，不會被匯入或引用", () => {
    expect(ZIWEI_PENDING.every(e => e.status === "pendingVerification" && e.visualVerified === false)).toBe(true);
    expect(ZIWEI_PENDING).toHaveLength(29);
    expect(PENDING_COUNTS).toMatchObject({ patternCandidate: 4, ocrSearchOnly: 2 });
    expect(ZIWEI_PENDING.filter(e => e.pendingId.endsWith("_JUE"))).toHaveLength(14);
    const imported = new Set(IMPORTED_ZIWEI_TEXTS.flatMap(t => t.sections.map(x => x.sectionId)));
    for (const e of ZIWEI_PENDING) expect(imported.has(e.pendingId)).toBe(false);
    // v4：格局已由卷一原文逐條建立（見 ziwei-v4.test.ts），候選不啟用
    expect(ZIWEI_PATTERN_RULES.every(p => p.source.length > 0)).toBe(true);
  });
  it("每段轉錄：有 PDF 頁碼、版心頁碼、卷、篇、條目、裁切範圍；只含原書文字（無標點、無省略號、無疑字標記）", () => {
    const ids = new Set<string>();
    for (const sp of GUANGYI_TRANSCRIPTION.spans) {
      expect(ids.has(sp.spanId)).toBe(false); ids.add(sp.spanId);
      expect(sp.pdfPage).toBeGreaterThanOrEqual(1); expect(sp.pdfPage).toBeLessThanOrEqual(86);
      expect(sp.printedPage).toBe(sp.pdfPage - 2);
      expect(sp.volume && sp.section && sp.entry).toBeTruthy();
      expect(sp.clip.every(v => v >= 0 && v <= 1) && sp.clip[0] < sp.clip[2] && sp.clip[1] < sp.clip[3]).toBe(true);
      expect([sp.transcriptionStatus, sp.visualVerified]).toEqual(["verified", true]);
      expect(sp.text, sp.spanId).toMatch(/^[\u4e00-\u9fff]+$/);
    }
    expect(GUANGYI_TRANSCRIPTION.verification.verifiedBy).toContain("非人工");
  });
});

describe("ClassicalCitation：每條原文都能回到 PDF 頁面與轉錄段落", () => {
  it("舊版 35 段（14 主星、12 宮、大限／流年原則）：以 v4 雙重核讀頁面重新定位與驗證；只有天梁總論一字（蔭／陰）兩輪讀法不一而不啟用", () => {
    const old = ZIWEI_CITATIONS.filter(c => c.citationId.startsWith("CIT_QS_"));
    expect(old).toHaveLength(14 + 12 + 3 + 6);
    expect(old.filter(c => c.verificationStatus !== "verified").map(c => c.citationId)).toEqual(["CIT_QS_STAR_TIANLIANG"]);
    for (const c of old.filter(c => c.verificationStatus === "verified")) {
      expect([c.transcriptionStatus, c.locationStatus, c.verification?.visualDoubleChecked, c.verification?.humanReviewed]).toEqual(["verified", "verifiedAgainstText", true, false]);
      expect(c.verifiedBy && c.verifiedAt && c.modernTranslation).toBeTruthy();
      expect(sourceOf(c.sourceId)!.tier).toBe(1);
      expect(citationCheck(c, IMPORTED_ZIWEI_TEXTS).ok, c.citationId).toBe(true);
    }
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
    expect(ZIWEI_CITATIONS[0].citationId).toBe("CIT_QS_STAR_ZIWEI");
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
      if (s.star === "天梁") continue; // 總論「化蔭」一字兩輪讀法不一，待決（見 ziwei-v4 複核）
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
  const FATAL = /短命|夭|貧窮|貧賤|離婚|犯罪|刑剋|刑傷|刑杖|病|死|必定|一定會|注定|下賤|孤寒/;
  const LOOKS = /面|肥|瘦|胖|眉|腰|背|眼|身長|形/;
  it("十四主星坐命基本性質（舊段落經複核）＋ v4 逐句規則；舊版大限／流年／原則規則已由 v4 取代", () => {
    const stars = ZIWEI_INTERPRETATION_RULES.filter(r => r.ruleId.startsWith("ZW_STAR_"));
    expect(stars).toHaveLength(14);
    for (const r of stars) {
      expect(r.condition).toMatchObject({ kind: "starInPalace", palace: "命宮", relation: "self", layer: "natal" });
      expect(ruleUsability(r).usable, r.ruleId).toBe(r.ruleId !== "ZW_STAR_TIANLIANG_NATURE");
    }
    for (const id of ["ZW_DECADE_SHA_IN_LIMIT", "ZW_ANNUAL_TAISUI_AT_MING", "ZW_PRINCIPLE_RUGE"]) expect(ZIWEI_INTERPRETATION_RULES.some(r => r.ruleId === id)).toBe(false);
    const principles = ZIWEI_INTERPRETATION_RULES.filter(r => r.kind === "principle");
    expect(principles.length).toBeGreaterThanOrEqual(8);
    for (const r of principles) expect(ruleUsability(r).usable).toBe(false);
    expect(new Set(ZIWEI_INTERPRETATION_RULES.map(r => r.ruleId)).size).toBe(ZIWEI_INTERPRETATION_RULES.length);
    expect(ZIWEI_SOURCE_CONFLICTS).toEqual([]);
  });
  it("每條可用規則都追溯到雙重核讀原文；判讀層不寫外貌、不寫宿命式結論", () => {
    for (const r of ZIWEI_INTERPRETATION_RULES.filter(r => ruleUsability(r).usable)) {
      for (const id of r.citations) expect(ZIWEI_CITATIONS.find(x => x.citationId === id)!.verification?.visualDoubleChecked).toBe(true);
      for (const t of [r.interpretation, r.modernSemantic]) if (t) { expect(t, r.ruleId).not.toMatch(FATAL); if (r.ruleId.startsWith("ZW_STAR_")) expect(t, r.ruleId).not.toMatch(LOOKS); }
    }
  });
  it("主星坐命規則的生活因素只來自原文明寫「為官祿主／為財帛主／化富」（長期傾向類）", () => {
    const withF = ZIWEI_INTERPRETATION_RULES.filter(r => r.lifeFactors.length && r.kind === "star" && r.ruleId.startsWith("ZW_STAR_"));
    for (const r of withF) {
      expect(ZIWEI_CITATIONS.find(x => x.citationId === r.citations[0])!.originalText).toMatch(/為官祿主|為財帛主|化富/);
      for (const l of r.lifeFactors) expect(l.factorId.startsWith("aptitude")).toBe(true);
    }
    expect(withF).toHaveLength(7);
  });
  it("紫微仍不參與計分（沒有 0–100 的紫微分數）", () => {
    expect(SYSTEM_SCORING.ziwei.status).toBe("pending");
  });
});

describe("實際命盤：命宮天府 → 判讀 → 生活因素 → 建議", () => {
  const n = buildNatal({ person: { id: "p", displayName: "p", gender: "male", relation: "self", isFavorite: false, sortOrder: 0, createdAt: "", updatedAt: "" }, birth: toBirth(x), settings: defaultSettings("") });
  it("只有坐守命宮的天府成立（照會的紫微、七殺不算）；追溯到 PDF 頁碼", () => {
    const z = interpretZiwei(natal, transit);
    const f = z.findings.find(f => f.ruleId === "ZW_STAR_TIANFU_NATURE")!;
    expect(f.evidence[0]).toContain("天府");
    expect(f.citations[0].locator).toMatchObject({ pdfPage: 28, printedPage: 26 });
    expect(z.findings.some(f => f.ruleId === "ZW_STAR_ZIWEI_NATURE" || f.ruleId === "ZW_STAR_QISHA_NATURE")).toBe(false);
    expect(z.topics.find(t => t.topic === "wealth")!.lifeFactors.some(l => l.factorId === "aptitudeResources" && l.role === "baseNatalMeaning")).toBe(true);
  });
  it("ActionAdviceEngine：財運的長期建議納入紫微並可追溯", () => {
    const d = adviseDay(n, "2026-09-27", "Asia/Taipei", ["wealth", "career", "investment"]);
    const zr = d.interpretations.find(r => r.system === "ziwei")!;
    expect(zr.status).toBe("partial");
    expect(zr.findings.map(f => f.ruleId)).toContain("ZW_STAR_TIANFU_NATURE");
    const zTrace = (t: "wealth" | "career" | "investment") => d.byTopic[t]!.trace.flatMap(q => q.findings.filter(f => f.system === "ziwei").map(f => f.ruleId));
    expect(zTrace("wealth")).toContain("ZW_STAR_TIANFU_NATURE");
    expect(d.byTopic.wealth!.otherHorizons.find(h => h.horizon === "longTerm")!.doNow.map(i => i.adviceRuleId)).toContain("LONG_APT_RESOURCES");
  });
  it("2031 年：大限命宮（本命財帛）有擎羊 → 成敗不一（只作大限修正，本命判讀仍在）；流年命宮在本命命宮 → 太歲在命宮提醒", () => {
    const t = computeZiweiTransit(natal, { civilDate: "2031-06-01", civilTime: "12:00", timeZone: "Asia/Taipei" });
    const z = interpretZiwei(natal, t);
    const ids = z.findings.map(f => f.ruleId);
    expect(ids).toEqual(expect.arrayContaining(["ZW_STAR_TIANFU_NATURE", "GY_R_DAXIAN_SHA", "GY_R_TAISUI_MING"]));
    expect(z.findings.find(f => f.ruleId === "GY_R_DAXIAN_SHA")!.evidence.join()).toContain("大限命宮（本命財帛）");
    const g = z.topics.find(x => x.topic === "general")!;
    expect(g.baseNatalMeaning.map(f => f.ruleId)).toContain("ZW_STAR_TIANFU_NATURE");
    expect(g.periodModifier.map(f => f.ruleId)).toContain("GY_R_DAXIAN_SHA");
    expect(g.annualModifier.map(f => f.ruleId)).toContain("GY_R_TAISUI_MING");
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
