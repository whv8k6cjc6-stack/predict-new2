/** 命理知識的分層保存。古籍原文、後人注解、程式規則三層分開，彼此以 id 參照，
 *  任何一層修改都不需要動到其他層。
 *
 *   ① SourceText   古籍原文（含版本）
 *   ② Commentary   注解（例：任鐵樵《滴天髓闡微》）
 *   ③ RuleDefinition 程式判斷規則（引用 ①②）
 *   ④ RuleMatch    此次命盤符合哪些條件（執行期產生）
 *   ⑤ Conclusion   白話結論（執行期產生）
 */
import type { DomainKey } from "./domains";
import type { SystemId } from "./engine";

export type VerificationStatus = "unverified" | "machine_imported" | "human_verified";

/** 版本化的文獻來源（一本書的一個版本） */
export interface SourceEdition {
  source_id: string;           // 例 "ditiansui.original"、"ditiansui.chanwei.ren"
  title: string;               // 書名
  author: string;              // 作者
  annotator?: string;          // 注者
  edition: string;             // 版本說明
  source_version: string;      // 我方匯入版本號
  origin: string;              // 資料來源（例：維基文庫）
  origin_url: string | null;   // 匯入時填寫實際網址；未匯入前為 null，不得臆測
  retrieved_at: string | null;
  content_hash: string | null; // 匯入全文雜湊，用於偵測來源變動
  license: string;             // 公有領域等
  status: "planned" | "imported" | "verified";
}

/** ① 古籍原文（一段） */
export interface SourceText {
  id: string;                  // 例 "ditiansui.original.tiangan.jia"
  source_id: string;           // → SourceEdition
  chapter: string;             // 篇章
  text: string;                // 原文（逐字）
  verification: VerificationStatus;
  verified_by?: string;
  verified_at?: string;
}

/** ② 注解（與原文分開保存） */
export interface Commentary {
  id: string;
  source_id: string;           // → SourceEdition（例：任鐵樵《滴天髓闡微》）
  on_text_id: string;          // → SourceText
  text: string;                // 注解原文
  plain: string;               // 我方白話翻譯
  verification: VerificationStatus;
}

/** 規則條件（Facts 比對 DSL） */
export type Condition =
  | { all: Condition[] } | { any: Condition[] } | { not: Condition }
  | { fact: string; op: "eq" | "neq" | "in" | "notIn" | "gte" | "lte" | "exists" | "contains"; value?: unknown };

/** ③ 程式判斷規則 */
export interface RuleDefinition {
  id: string;                  // 例 "bazi.flowday.qisha.useful.career"
  system: SystemId;
  school: string;              // 所屬流派
  rule_version: string;
  timescale: "natal" | "decade" | "year" | "month" | "day" | "hour";
  based_on: { text_ids: string[]; commentary_ids: string[]; principle: string };  // 依據 ①②；無古籍時 text_ids 為空並寫明「通行論法」
  applies_when: string;        // 適用條件（人類可讀）
  condition: Condition;        // 規則邏輯（機器可讀）
  effects: { domain: DomainKey; polarity: -1 | 0 | 1; strength: 1 | 2 | 3 }[];
  /** legacyAdviceText：舊版規則直接附帶的建議文字。只供專業模式參考、migration 與人工比對；
   *  不得進入首頁、宜忌或 ActionAdviceEngine（正式建議一律經 生活因素 → 主題判讀 → 建議規則 產生）。 */
  templates: { conclusion: string; plain: string; pro: string; legacyAdviceText: string[] };  // 必含 {槽位}
  slots: Record<string, string>;   // 槽位名稱 → 事實鍵（Fact key）
  terms: string[];
  priority?: number;
  excludes?: string[];
  /** 依本次盤面才決定引用哪段原文時（例：易經動爻爻辭），列出其值為 text_id 的事實鍵 */
  dynamic_text_slots?: string[];
  verification: VerificationStatus;
  enabled: boolean;
}

/** ④ 執行期：此次命盤符合哪些條件 */
export interface RuleMatch {
  rule_id: string;
  matched: { fact: string; value: unknown; derivation: string }[];
}

/** ⑤ 執行期：白話結論 */
export interface Conclusion {
  rule_id: string;
  conclusion: string; plain: string; pro: string; legacyAdviceText: string[];
}

/** 第一階段已登記、待匯入的文獻版本（尚未匯入任何原文，故 origin_url 等為 null）。 */
export const PLANNED_SOURCES: SourceEdition[] = [
  {
    source_id: "ditiansui.original", title: "滴天髓", author: "舊題京圖撰", edition: "原文（不含注）",
    source_version: "0", origin: "維基文庫（預定）", origin_url: null, retrieved_at: null, content_hash: null,
    license: "公有領域", status: "planned",
  },
  {
    source_id: "ditiansui.chanwei.ren", title: "滴天髓闡微", author: "舊題京圖撰", annotator: "任鐵樵", edition: "任氏增注本",
    source_version: "0", origin: "維基文庫（預定）", origin_url: null, retrieved_at: null, content_hash: null,
    license: "公有領域", status: "planned",
  },
];
