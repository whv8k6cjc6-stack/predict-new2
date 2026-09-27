/** 產生人工審閱用的對照文件：docs/LIFE_FACTOR_MAPPING.md（既有規則 → 生活因素）與 docs/ADVICE_TEMPLATES.md（建議規則 → 文字）。
 *  由 src/tests/advice-docs.test.ts 比對；要更新文件時執行 ADVICE_DOCS_WRITE=1 npx vitest run src/tests/advice-docs.test.ts */
import type { RuleDefinition } from "../sources";
import { LIFE_FACTOR_MAPPING, MAPPING_VERSION, lifeFactorMappingFor } from "@/kb/advice/lifeFactorMapping";
import { ADVICE_RULES, ADVICE_RULES_VERSION } from "@/kb/advice/rules";
import { ADVICE_TEMPLATES, type TemplateId } from "@/kb/advice/templates";
import { ADVICE_TOPICS, TOPIC_IDS } from "@/kb/advice/topics";
import { LIFE_FACTORS, factorDef, type FactorId } from "./factors";

const esc = (s: string) => s.replaceAll("|", "／").replaceAll("\n", " ");
const REL = { classicalText: "引用原文", principleOnly: "命理原則", pendingVerification: "**待驗證**" } as const;

export function lifeFactorMappingDoc(rules: RuleDefinition[]): string {
  const out: string[] = [
    "# 既有判讀規則 → 生活因素（LifeFactor）對照表",
    "",
    `> 自動產生，請勿手改（對照表版本 ${MAPPING_VERSION}；來源：src/kb/advice/lifeFactorMapping.ts）。`,
    "> 只依既有規則已明確寫出的語意分類，不新增命理推論；「依據」欄為規則中逐字出現的文字。",
    "> 可靠度：引用原文＝規則引用已匯入的原文；命理原則＝有原則但原文待匯入；待驗證＝文字武斷或來源不明，只作低信心參考。",
    "",
    "## 生活因素詞彙表",
    "",
    "| 因素 | 分類 | 預設讀法 | 白話 | 定義 |",
    "|---|---|---|---|---|",
    ...(Object.keys(LIFE_FACTORS) as FactorId[]).map(id => { const f = factorDef(id); return `| \`${id}\` | ${f.category} | ${f.nature} | ${f.label} | ${esc(f.description)} |`; }),
    "",
    "## 規則族對照",
    "",
    "| 規則族 | 生活因素 | 依據（逐字） | 映射理由 | 可靠度 | 不映射的內容 |",
    "|---|---|---|---|---|---|",
    ...Object.entries(LIFE_FACTOR_MAPPING).map(([k, m]) =>
      `| \`${k}\` | ${m.factors.map(f => Array.isArray(f) ? `${f[0]}（${f[1]}）` : f).join("、")} | ${esc(m.basis.join("／"))} | ${esc(m.reason)} | ${m.reliability ? REL[m.reliability] : "依規則"} | ${esc(m.excluded ?? "")} |`),
    "",
    `## 逐條對照（${rules.length} 條）`,
    "",
    "| 規則 | 原本結論 | 生活因素 | 可靠度 |",
    "|---|---|---|---|",
    ...rules.map(r => {
      const m = lifeFactorMappingFor(r);
      return `| \`${r.id}\` | ${esc(r.templates.conclusion)} | ${m ? m.factors.map(f => Array.isArray(f) ? f[0] : f).join("、") : "（未映射）"} | ${m ? REL[m.reliability] : ""} |`;
    }),
    "",
  ];
  return out.join("\n");
}

export function adviceTemplatesDoc(): string {
  const used = new Set<TemplateId>();
  const out: string[] = [
    "# 行動建議清單（AdviceRule → 文字）",
    "",
    `> 自動產生，請勿手改（建議規則版本 ${ADVICE_RULES_VERSION}）。文字的正本在 src/kb/advice/templates.ts，規則在 src/kb/advice/rules.ts；修改後重新產生本文件。`,
    "> {時段} 會依時間尺度換成「今天／這幾天／這個月／今年／接下來幾年／這個時段」。",
    "",
  ];
  const cond = (w: (typeof ADVICE_RULES)[number]["when"]) => [
    w.all?.length ? `全部：${w.all.map(f => factorDef(f).label).join("、")}` : "",
    w.any?.length ? `任一：${w.any.map(f => factorDef(f).label).join("、")}` : "",
    w.none?.length ? `排除：${w.none.map(f => factorDef(f).label).join("、")}` : "",
  ].filter(Boolean).join("；") || "（無條件）";
  for (const t of [...TOPIC_IDS, "共用" as const]) {
    const rules = ADVICE_RULES.filter(r => t === "共用" ? r.topics.length === 0 : r.topics.includes(t));
    if (!rules.length) continue;
    const T = t === "共用" ? null : ADVICE_TOPICS[t];
    out.push(`## ${T ? `${T.label}（${t}）` : "各主題共用（訊號矛盾時）"}`, "");
    if (T) out.push(`覆蓋程度：${T.coverage}${T.coverageNote ? `；${T.coverageNote}` : ""}`, "");
    for (const r of rules) {
      out.push(`### ${r.adviceRuleId}`, "", `- 條件：${cond(r.when)}`, `- 時間尺度：${r.horizons.join("、")}；優先度 ${r.priority}；矛盾時：${r.conflictPolicy}；基本信心：${r.baseConfidence}`, `- 理由：${r.reason}`);
      if (r.action) { used.add(r.action); out.push(`- ✓ 做（${r.action}）：${ADVICE_TEMPLATES[r.action].text}`, `  - 首頁短句：${ADVICE_TEMPLATES[r.action].short}`); }
      if (r.avoid) { used.add(r.avoid); out.push(`- ✕ 避免（${r.avoid}）：${ADVICE_TEMPLATES[r.avoid].text}`, `  - 首頁短句：${ADVICE_TEMPLATES[r.avoid].short}`); }
      out.push("");
    }
  }
  out.push("## 其他文字", "");
  for (const id of Object.keys(ADVICE_TEMPLATES) as TemplateId[]) if (!used.has(id)) out.push(`- ${id}：${ADVICE_TEMPLATES[id].text}`);
  out.push("");
  return out.join("\n");
}
