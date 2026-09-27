/** 產生 docs/ZIWEI_RULE_REGISTRY.md（紫微來源、引用、判讀規則、覆蓋矩陣），由 src/tests/advice-docs.test.ts 比對。 */
import { ADVICE_TOPICS } from "@/kb/advice/topics";
import { ZIWEI_CITATIONS, ZIWEI_SOURCES } from "@/kb/ziwei/sources";
import { PALACE_SEMANTICS } from "@/kb/ziwei/semantics";
import { ZIWEI_INTERPRETATION_RULES, ZIWEI_INTERP_RULES_VERSION, ZIWEI_PATTERN_RULES, ZIWEI_SOURCE_CONFLICTS } from "@/kb/ziwei/interpretationRules";
import { IMPORTED_ZIWEI_TEXTS } from "@/kb/ziwei/texts/imported.generated";
import { ruleUsability, ziweiCoverage } from "./engine";

const esc = (s: string) => s.replaceAll("|", "／").replaceAll("\n", " ");

export function ziweiRegistryDoc(): string {
  const cov = ziweiCoverage();
  return [
    "# 紫微斗數判讀：來源與規則登錄",
    "",
    `> 自動產生，請勿手改（判讀規則版本 ${ZIWEI_INTERP_RULES_VERSION}）。更新：ADVICE_DOCS_WRITE=1 npx vitest run src/tests/advice-docs.test.ts`,
    "",
    "## 來源",
    "",
    "| Tier | 來源 | 角色 | 內容狀態 | 用途 | 不可作為 |",
    "|---|---|---|---|---|---|",
    ...ZIWEI_SOURCES.map(s => `| ${s.tier} | 《${s.title}》${s.edition ? `（${s.edition}）` : ""} | ${s.role} | ${s.contentStatus} | ${esc(s.usage.join("、"))} | ${esc(s.notFor.join("、"))} |`),
    "",
    `已匯入原文：${IMPORTED_ZIWEI_TEXTS.length ? IMPORTED_ZIWEI_TEXTS.map(t => `${t.sourceId}（${t.edition}，SHA-256 ${t.sha256}）`).join("、") : "無"}`,
    "",
    "## 主題覆蓋矩陣",
    "",
    "| 主題 | 覆蓋 | 規則 | 已校驗 | 待校驗 | 來源 |",
    "|---|---|---|---|---|---|",
    ...cov.map(c => `| ${ADVICE_TOPICS[c.topic].label}（${c.topic}） | ${c.level} | ${c.ruleCount} | ${c.verifiedRuleCount} | ${c.pendingRuleCount} | ${c.sourceCoverage.join("、") || "—"} |`),
    "",
    `## 判讀規則（${ZIWEI_INTERPRETATION_RULES.length} 條）`,
    "",
    "| 規則 | 類型 | 時間層 | 主題 | 狀態 | 是否可用 | 引用 | App 整理 |",
    "|---|---|---|---|---|---|---|---|",
    ...ZIWEI_INTERPRETATION_RULES.map(r => { const u = ruleUsability(r); return `| \`${r.ruleId}\` | ${r.kind} | ${r.timeLayer} | ${r.topics.join("、")} | ${r.verificationStatus} | ${u.usable ? "可用" : esc(u.reason)} | ${r.citations.join("、")} | ${esc(r.appImplementation)} |`; }),
    "",
    `## 引用定位（${ZIWEI_CITATIONS.length} 筆）`,
    "",
    "| 引用 | 來源 | 篇 | 條目 | 位置 | 原文 | 狀態 |",
    "|---|---|---|---|---|---|---|",
    ...ZIWEI_CITATIONS.map(c => `| \`${c.citationId}\` | ${c.sourceId} | ${c.section ?? "（待定位）"} | ${c.entry ?? ""} | ${c.locationStatus} | ${c.originalText ? esc(c.originalText) : "（未匯入，不憑記憶填寫）"} | ${c.verificationStatus} |`),
    "",
    "## 十二宮語義（現代用途為 App 依宮名整理）",
    "",
    "| 宮 | 現代用途 | 相關主題 | 對宮 | 三合宮 | 古典語義 |",
    "|---|---|---|---|---|---|",
    ...PALACE_SEMANTICS.map(p => `| ${p.name} | ${p.modernMeaning.text} | ${p.relatedTopics.join("、")} | ${p.combineWith.opposite} | ${p.combineWith.trines.join("、")} | ${p.classicalMeaning.text ?? "待校驗"} |`),
    "",
    `## 格局規則：${ZIWEI_PATTERN_RULES.length} 條`,
    "",
    `## 來源衝突：${ZIWEI_SOURCE_CONFLICTS.length ? ZIWEI_SOURCE_CONFLICTS.map(c => c.conflictId).join("、") : "無"}`,
    "",
  ].join("\n");
}
