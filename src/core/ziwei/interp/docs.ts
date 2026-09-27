/** 產生 docs/ZIWEI_RULE_REGISTRY.md（紫微來源、引用、判讀規則、覆蓋矩陣），由 src/tests/advice-docs.test.ts 比對。 */
import { ADVICE_TOPICS } from "@/kb/advice/topics";
import { ZIWEI_CITATIONS, ZIWEI_SOURCES } from "@/kb/ziwei/sources";
import { PALACE_SEMANTICS, STAR_SEMANTICS } from "@/kb/ziwei/semantics";
import { factorDef } from "@/core/advice/factors";
import { JIWEN_SOURCE } from "@/kb/ziwei/sources";
import { ZIWEI_INTERPRETATION_RULES, ZIWEI_INTERP_RULES_VERSION, ZIWEI_PATTERN_CANDIDATES, ZIWEI_PATTERN_RULES, ZIWEI_SOURCE_CONFLICTS } from "@/kb/ziwei/interpretationRules";
import { completion, pendingItems, PENDING_CATEGORY_LABEL } from "@/kb/ziwei/v2/completion";
import { GY_BRIGHTNESS_CONFLICTS } from "@/kb/ziwei/v2";
import { SPAN_RECHECKS } from "@/kb/ziwei/sources";
import corrections from "@/data/classics/ziwei/quanshu-guangyi/corrections.json";
import { IMPORTED_ZIWEI_TEXTS } from "@/kb/ziwei/texts/imported";
import { ruleUsability, ziweiCoverage } from "./engine";

const esc = (s: string) => s.replaceAll("|", "／").replaceAll("\n", " ");

export function ziweiRegistryDoc(): string {
  const cov = ziweiCoverage();
  const k = completion();
  const pend = pendingItems();
  return [
    "# 紫微斗數判讀：來源與規則登錄",
    "",
    `> 自動產生，請勿手改（判讀規則版本 ${ZIWEI_INTERP_RULES_VERSION}）。更新：ADVICE_DOCS_WRITE=1 npx vitest run src/tests/advice-docs.test.ts`,
    "",
    "## 紫微判讀完成度",
    "",
    `- 原文：《紫微斗數全書》廣益版 PDF ${k.source.pdfPages} 頁（${k.source.leaves} 個半頁、${k.source.strips} 欄組，含書縫與切邊補轉錄 ${k.source.supplementStrips}），原始掃描影像雙重核讀的欄組 ${k.source.doubleCheckedStrips}；仍存疑 ${k.source.uncertainGlyphs} 處。驗證方式：兩輪獨立 AI 目視轉錄＋差異回影像決議（非學術人工校勘；humanReviewed＝否）。`,
    `- 引用：${k.citations.total} 筆，可作規則依據 ${k.citations.usable}，含疑字 ${k.citations.withUncertain}。`,
    `- 判讀規則：${k.rules.total} 條，可用 ${k.rules.usable}（本命 ${k.rules.natal}、大限 ${k.rules.decade}、流年 ${k.rules.annual}），產生生活因素 ${k.rules.withFactors}；判讀原則 ${k.rules.principles}。`,
    `- 格局：PatternRule ${k.patterns.rules}（啟用 ${k.patterns.enabled}）、PatternCandidate ${k.patterns.candidates}。`,
    `- 古典廟旺：${k.brightness.entries} 條；與 iztro 軟體亮度不同 ${k.brightness.conflicts} 處（不改客觀排盤）。`,
    `- 舊 35 段第二次核讀：逐字相同 ${k.spanRecheck.identical}、疑字已決議 ${k.spanRecheck.identicalAfterResolution}、仍有疑字 ${k.spanRecheck.differs}、找不到 ${k.spanRecheck.notFound}。`,
    `- 紫微計分：${k.scoring}（停用）。`,
    "",
    "## 來源",
    "",
    "| Tier | 來源 | 角色 | 內容狀態 | 用途 | 不可作為 |",
    "|---|---|---|---|---|---|",
    ...ZIWEI_SOURCES.map(s => `| ${s.tier} | 《${s.title}》${s.edition ? `（${s.edition}）` : ""} | ${s.role} | ${s.contentStatus} | ${esc(s.usage.join("、"))} | ${esc(s.notFor.join("、"))} |`),
    "",
    `已匯入原文：${IMPORTED_ZIWEI_TEXTS.length ? IMPORTED_ZIWEI_TEXTS.map(t => `${t.sourceId}（${t.edition}，${t.sections.length} 段已依 PDF 影像逐字核對，PDF SHA-256 ${t.sha256}）`).join("、") : "無"}`,
    "",
    "## 主題覆蓋矩陣",
    "",
    "| 主題 | 覆蓋 | 規則 | 可用 | 產生生活因素 | 待校驗 | 時間層 | 來源 |",
    "|---|---|---|---|---|---|---|---|",
    ...cov.map(c => `| ${ADVICE_TOPICS[c.topic].label}（${c.topic}） | ${c.level} | ${c.ruleCount} | ${c.verifiedRuleCount} | ${c.factorRuleCount} | ${c.pendingRuleCount} | ${c.layers.join("、") || "—"} | ${c.sourceCoverage.join("、") || "—"} |`),
    "",
    `## 判讀規則（${ZIWEI_INTERPRETATION_RULES.length} 條）`,
    "",
    "| 規則 | 類型 | 時間層 | 主題 | 狀態 | 是否可用 | 引用 | 古籍原則 | 現代中性語義 | 生活因素 |",
    "|---|---|---|---|---|---|---|---|---|---|",
    ...ZIWEI_INTERPRETATION_RULES.map(r => { const u = ruleUsability(r); return `| \`${r.ruleId}\` | ${r.kind} | ${r.timeLayer} | ${r.topics.join("、")} | ${r.verificationStatus} | ${u.usable ? "可用" : esc(u.reason)} | ${r.citations.join("、")} | ${esc(r.classicalPrinciple ?? "")} | ${esc(r.modernSemantic ?? "")} | ${r.lifeFactors.map(l => `${l.factorId}（${factorDef(l.factorId).label}）×${l.strength}`).join("、") || "—"} |`; }),
    "",
    `## 引用（${ZIWEI_CITATIONS.length} 筆）`,
    "",
    "| 引用 | 卷・篇・條目 | PDF 頁（版心） | 原文 | 白話翻譯 | 狀態 | 核對 |",
    "|---|---|---|---|---|---|---|",
    ...ZIWEI_CITATIONS.map(c => `| \`${c.citationId}\` | ${c.volume ?? ""}・${c.section ?? "（待定位）"}・${c.entry ?? ""} | ${c.locator ? `p${c.locator.pdfPage}（${c.locator.printedPage ?? "—"}）` : "—"} | ${c.originalText ? esc(c.originalText) : "（未匯入，不憑記憶填寫）"} | ${esc(c.modernTranslation ?? "")} | ${c.verificationStatus} | ${c.verifiedBy ?? ""} ${c.verifiedAt ?? ""} |`),
    "",
    "## 十四主星語義與生活因素候選",
    "",
    "| 星 | 核心主題 | 成立條件 | 組合 | 候選生活因素 |",
    "|---|---|---|---|---|",
    ...STAR_SEMANTICS.map(s => `| ${s.star} | ${s.coreThemes.text ?? "待校驗"} | ${esc(s.conditionalFactors.text ?? "—")} | ${esc(s.combinationDependencies.text ?? "—")} | ${s.lifeFactorCandidates.map(c => `${c.factorId}${c.enabled ? "（啟用）" : `（未啟用：${esc(c.reason)}）`}`).join("；") || "—"} |`),
    "",
    "## 十二宮語義（現代用途為 App 依宮名整理）",
    "",
    "| 宮（原書名） | 現代用途 | 相關主題 | 對宮 | 三合宮 | 古典篇旨 |",
    "|---|---|---|---|---|---|",
    ...PALACE_SEMANTICS.map(p => `| ${p.name}${p.classicalName !== p.name ? `（${p.classicalName}）` : ""} | ${p.modernMeaning.text} | ${p.relatedTopics.join("、")} | ${p.combineWith.opposite} | ${p.combineWith.trines.join("、")} | ${p.classicalMeaning.text ?? "待校驗"} |`),
    "",
    `## 格局規則：${ZIWEI_PATTERN_RULES.length} 條；候選 ${ZIWEI_PATTERN_CANDIDATES.length} 條`,
    "",
    "| 格局 | 類別 | 必要星曜 | 破格條件數 | 生活因素 | 啟用 |",
    "|---|---|---|---|---|---|",
    ...ZIWEI_PATTERN_RULES.map(p => `| ${p.name}（\`${p.patternId}\`） | ${p.group} | ${p.requiredStars.join("、") || "—"} | ${p.breakingConditions.length} | ${p.lifeFactors.map(l => l.factorId).join("、") || "—"} | ${p.enabled ? "是" : "否"} |`),
    "",
    "| 候選 | 類別 | 原因 | 說明 |",
    "|---|---|---|---|",
    ...ZIWEI_PATTERN_CANDIDATES.map(p => `| ${p.name} | ${p.group} | ${p.pendingReason} | ${esc(p.note)} |`),
    "",
    "## 古典廟旺與軟體亮度差異（BrightnessConflict）",
    "",
    "| 星 | 地支 | 《全書》 | iztro | 古典出處 |",
    "|---|---|---|---|---|",
    ...GY_BRIGHTNESS_CONFLICTS.map(c => `| ${c.star} | ${c.palaceBranch} | ${c.classicalValue} | ${c.softwareValue} | ${esc(c.classicalCitation)} |`),
    "",
    "## 舊版單次轉錄 35 段的第二次核讀",
    "",
    "| 段落 | 頁 | 結果 | 說明 |",
    "|---|---|---|---|",
    ...SPAN_RECHECKS.map(r => `| ${r.spanId} | p${r.pdfPage} | ${r.result} | ${esc(r.note)} |`),
    "",
    "## 來源修正紀錄",
    "",
    ...corrections.corrections.map(c => `- ${c.correctionId}：${esc(c.previousSource)}「${esc(c.previousClaim)}」→「${esc(c.correctedClaim)}」（PDF p${c.sourcePage}；${c.confirmedBy.join("、")}）`),
    "",
    "## 第二來源：《紫微斗數全集》集文版",
    "",
    `PDF SHA-256 ${JIWEN_SOURCE.sha256}。${JIWEN_SOURCE.scanQuality.note}`,
    "",
    ...JIWEN_SOURCE.parallelSections.map(p => `- ${p.topic}：${p.status}${p.jiwenPages.length ? `（集文版 PDF p${p.jiwenPages[0]}–${p.jiwenPages[p.jiwenPages.length - 1]}）` : ""}`),
    "",
    `## 待處理（${pend.length} 項，依原因分類）`,
    "",
    ...Object.entries(k.pending.byCategory).map(([c, n]) => `- ${PENDING_CATEGORY_LABEL[c as keyof typeof PENDING_CATEGORY_LABEL] ?? c}：${n}`),
    "",
    "| 項目 | 原因 | 篇 | PDF 頁 | 說明 |",
    "|---|---|---|---|---|",
    ...pend.map(e => `| \`${e.id}\` | ${e.category} | ${esc(e.section)} | ${e.pdfPage ?? "—"} | ${esc(e.detail)} |`),
    "",
    `## 來源衝突：${ZIWEI_SOURCE_CONFLICTS.length ? ZIWEI_SOURCE_CONFLICTS.map(c => c.conflictId).join("、") : "0 筆（集文版平行段落掃描不足以逐字比對，未建立異文或衝突）"}`,
    "",
  ].join("\n");
}
