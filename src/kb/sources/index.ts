/** 已匯入的古籍文本（第一層：原文）。規則以 text_id 參照；此處提供查詢。 */
import type { SourceEdition, SourceText } from "@/core/sources";
import { PLANNED_SOURCES } from "@/core/sources";
import data from "./zhouyi.generated.json";

export interface ZhouyiHex {
  no: number; name: string; full: string; symbol: string; bits: string;
  upper: number; lower: number;
  textIds: { gua: string; tuan: string; daxiang: string; yao: string[]; xiaoxiang: string[] };
}

export interface Erratum { scope: string; from: string; to: string; count: number; applied: number; reason: string; basis: string }

export const ZHOUYI_EDITION = data.edition as SourceEdition;
export const ZHOUYI_ERRATA = data.errata as Erratum[];
export const ZHOUYI_NOTES = data.notes as string[];
export const ZHOUYI_HEXAGRAMS = data.hexagrams as ZhouyiHex[];

const TEXTS = data.texts as Record<string, { chapter: string; text: string; review: string[] }>;

export type SourceTextView = SourceText & { review: string[]; edition: SourceEdition };

export function getSourceText(id: string): SourceTextView | null {
  const t = TEXTS[id];
  if (!t) return null;
  return { id, source_id: ZHOUYI_EDITION.source_id, chapter: t.chapter, text: t.text, verification: "machine_imported", review: t.review, edition: ZHOUYI_EDITION };
}

export const SOURCE_EDITIONS: SourceEdition[] = [ZHOUYI_EDITION, ...PLANNED_SOURCES];

/** 《繫辭》中本系統規則引用的段落 */
export const XICI = {
  jixiongShide: "zhouyi.xici.shang.07",   // 吉凶者，言乎其失得也。悔吝者，言乎其小疵也。无咎者，善補過也。
  jixiongDong: "zhouyi.xici.xia.02",      // 吉凶悔吝者，生乎動者也。
  yaoWei: "zhouyi.xici.xia.43",           // 二多譽，四多懼……三多凶，五多功
} as const;
