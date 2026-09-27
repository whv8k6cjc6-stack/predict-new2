/** 紫微古籍來源、引用與校勘的資料模型（ClassicalSourceRegistry／ClassicalCitation／TextualVariant／SourceConflict）。
 *  原則：原文、注解、白話翻譯、App 判讀、生活因素、行動建議嚴格分開；每條重要判讀規則都要知道出自哪一段。 */

/** 來源層級：1＝指定古典主要來源；2＝其他可靠古籍；3＝可信現代研究；4＝軟體資料；5＝一般網路文章 */
export type SourceTier = 1 | 2 | 3 | 4 | 5;
export type SourceRole = "primaryClassical" | "secondaryClassical" | "modernStudy" | "softwareDataset" | "webArticle";
/** imported：原文已依版本匯入並記錄雜湊；notInRepository：公有領域可取得但尚未匯入；unavailable：目前沒有合法可用的完整文本 */
export type ContentStatus = "imported" | "notInRepository" | "unavailable";

export interface ClassicalSource {
  sourceId: string;
  title: string;
  edition: string | null;
  tier: SourceTier;
  role: SourceRole;
  /** 可作為什麼用途（例：古典判讀基準、版本校勘、排盤相容性比對） */
  usage: string[];
  /** 不可作為什麼用途 */
  notFor: string[];
  availability: string;
  copyrightStatus: "publicDomain" | "copyrighted" | "openSourceLicense" | "unknown";
  contentStatus: ContentStatus;
  notes: string;
}

export type CitationStatus = "verified" | "partiallyVerified" | "pendingVerification" | "conflictingSources";

export interface TextualVariant {
  sourceId: string;
  edition: string | null;
  text: string;
  note: string;
  adopted: boolean;          // 目前判讀規則採用此版本
}

export interface ClassicalCitation {
  citationId: string;
  sourceId: string;
  edition: string | null;
  volume: string | null;
  section: string | null;    // 篇名（例：諸星問答論）
  entry: string | null;      // 條目（例：巨門）
  /** 篇卷位置是否已對照匯入原文確認 */
  locationStatus: "verifiedAgainstText" | "unverified";
  originalText: string | null;          // 原文（逐字，未匯入前一律為 null，不憑記憶填寫）
  normalizedText: string | null;        // 正規化文字（去標點、統一異體字，供比對）
  classicalCommentary: string | null;   // 古注
  modernTranslation: string | null;     // 白話翻譯
  verificationStatus: CitationStatus;
  textualVariants: TextualVariant[];
  notes: string;
  /** 掃描來源的頁面定位（PDF 頁碼、版心頁碼、轉錄段落）；以 PDF 影像為 Source of Truth */
  locator?: { pdfPage: number; printedPage: number | null; spanId: string };
  /** 轉錄狀態：verified＝已依 PDF 影像逐字核對；transcriptionUnverified＝只有初稿 */
  transcriptionStatus?: "verified" | "transcriptionUnverified";
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface SourceConflict {
  conflictId: string;
  ruleId: string;
  sourceA: { sourceId: string; citationId: string };
  sourceB: { sourceId: string; citationId: string };
  difference: string;
  affectsChart: boolean;
  affectsInterpretation: boolean;
  adoptedSourceId: string;
  status: "textualOnly" | "interpretationDetail" | "substantive";
  note: string;
}

/** 依版本匯入的原文（由 scripts/import-ziwei-classic.mjs 產生） */
export interface ImportedClassicalText {
  sourceId: string;
  edition: string;
  origin: string;
  license: string;
  sha256: string;
  importedAt: string;
  sections: ImportedSection[];
}
export interface ImportedSection {
  sectionId: string; volume: string | null; title: string; text: string;
  /** 掃描來源：此段所在 PDF 頁碼、版心頁碼、條目與轉錄狀態 */
  pdfPage?: number; printedPage?: number | null; entry?: string; transcriptionStatus?: "verified" | "transcriptionUnverified"; notes?: string;
}

/** 比對用正規化：去標點與空白、統一常見異體字（不改變字義） */
const VARIANT_MAP: Record<string, string> = { "爲": "為", "裏": "裡", "眞": "真", "迴": "回", "敎": "教", "産": "產" };
export function normalizeClassical(s: string): string {
  return [...s.replace(/[\s　，。、；：！？「」『』（）()《》〈〉·．.,;:!?"'【】\-—…]/g, "")].map(c => VARIANT_MAP[c] ?? c).join("");
}

/** 引用是否能在匯入原文中逐字找到（正規化後比對；有指定篇名時只在該篇比對） */
export function citationCheck(c: ClassicalCitation, texts: readonly ImportedClassicalText[]): { ok: boolean; reason: string; sectionId?: string } {
  if (!c.originalText) return { ok: false, reason: "原文尚未填入（未匯入原文前不憑記憶填寫）" };
  const t = texts.find(x => x.sourceId === c.sourceId && (!c.edition || x.edition === c.edition));
  if (!t) return { ok: false, reason: `來源 ${c.sourceId} 的原文尚未匯入` };
  const needle = normalizeClassical(c.originalText);
  const pool = c.section ? t.sections.filter(s => s.title.includes(c.section!)) : t.sections;
  if (!pool.length) return { ok: false, reason: `匯入原文中找不到篇名「${c.section}」` };
  // 掃描來源：只比對已依影像逐字核對的段落；有頁面定位時只在該頁比對
  const verified = pool.filter(s => s.transcriptionStatus !== "transcriptionUnverified" && (!c.locator || s.pdfPage === undefined || s.pdfPage === c.locator.pdfPage));
  if (!verified.length) return { ok: false, reason: c.locator ? `PDF 第 ${c.locator.pdfPage} 頁沒有已校驗的轉錄` : "只有未校驗的轉錄初稿" };
  const hit = verified.find(s => normalizeClassical(s.text).includes(needle));
  return hit ? { ok: true, reason: "原文逐字相符", sectionId: hit.sectionId } : { ok: false, reason: "原文與匯入版本不相符" };
}
