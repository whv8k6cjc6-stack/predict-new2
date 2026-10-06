/** 奇門古籍引文（ClassicalCitation 層）：由 qimen-dunjia（MIT）逐字錄自《奇門遁甲統宗》《奇門法竅》《奇門旨歸》
 *  《奇門寶鑑御定》《遁甲演義》《煙波釣叟歌》等書，含書名、篇名與原文；本專案未對照原刊影像，故標為「錄文」而非已校。
 *  古籍原文屬公有領域；表格結構與吉凶欄（該軟體據斷語所判，非典籍所標）依 MIT 授權使用，著作權聲明見 data 的 via.notice。 */
import type { SourceEdition } from "@/core/sources";
import data from "@/data/classics/qimen/citations.json";

export type QimenSourceKey = keyof typeof data.sources;
export interface QimenCitation { id: string; book: string; chapter: string; text: string }
export interface KeYing { pair: string; name: string; jixiong: "吉" | "凶" | "中性"; text: string }

export const QIMEN_CITATION_STATUS = data.status;
export const QIMEN_CITATION_VIA = data.via;

export const qimenTextId = (k: QimenSourceKey) => `qimen.${k}`;
export const keyingTextId = (pair: string) => `qimen.keying.${pair}`;

export const QIMEN_CITATIONS: QimenCitation[] = Object.entries(data.sources).map(([k, v]) => ({ id: `qimen.${k}`, ...v }));
export const KE_YING: Record<string, KeYing> = Object.fromEntries(Object.entries(data.keying).map(([k, v]) => [k, { pair: k, ...v } as KeYing]));

const editions = new Map<string, SourceEdition>();
export function qimenEdition(book: string): SourceEdition {
  let e = editions.get(book);
  if (!e) {
    e = {
      source_id: `qimen.${book}`, title: book, author: "—", edition: "引文（依軟體錄文，未對照原刊）",
      source_version: data.via.package, origin: `${data.via.package}（MIT）所錄原文`, origin_url: data.via.homepage ?? null,
      retrieved_at: null, content_hash: null, license: "原文屬公有領域；錄文與表格依 MIT 授權", status: "imported",
    };
    editions.set(book, e);
  }
  return e;
}

/** 依 text id 取奇門引文（qimen.<鍵>、qimen.keying.<天盤干地盤干>） */
export function qimenText(id: string): { book: string; chapter: string; text: string } | null {
  if (id.startsWith("qimen.keying.")) {
    const k = KE_YING[id.slice("qimen.keying.".length)];
    return k ? { book: "奇門旨歸", chapter: `卷五 十干克應・${k.name}`, text: k.text } : null;
  }
  const s = (data.sources as Record<string, { book: string; chapter: string; text: string }>)[id.slice("qimen.".length)];
  return s ?? null;
}
