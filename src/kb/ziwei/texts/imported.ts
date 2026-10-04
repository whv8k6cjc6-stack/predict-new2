/** 已匯入的紫微古籍原文。
 *  目前唯一來源：《紫微斗數全書》廣益版掃描 PDF（無文字層）的逐段目視核對轉錄
 *  （src/data/classics/ziwei/quanshu-guangyi/transcription.json）。PDF 影像為 Source of Truth，
 *  這裡只收 visualVerified＝true 且 transcriptionStatus＝verified 的段落；初稿、OCR 或疑字一律不收。
 *  sha256 為 PDF 原檔的 SHA-256（鎖定版本）；轉錄檔本身的雜湊記在同目錄 sha256.json，由測試比對。 */
import type { ImportedClassicalText } from "@/core/ziwei/interp/citation";
import source from "@/data/classics/ziwei/quanshu-guangyi/source.json";
import transcription from "@/data/classics/ziwei/quanshu-guangyi/transcription.json";
import { TEXT_IMPORTS } from "./textImports.generated";
import { GUANGYI_PAGES } from "./pages";

export const GUANGYI_SOURCE = source;
export const GUANGYI_TRANSCRIPTION = transcription;

export const IMPORTED_ZIWEI_TEXTS: ImportedClassicalText[] = [
  {
    sourceId: source.sourceId,
    edition: source.editionLabel,
    origin: `${source.editionDescription}；${source.providedBy}`,
    license: "公有領域古籍之掃描影像（本專案只保存逐段轉錄與雜湊，不保存 PDF）",
    sha256: source.sha256,
    importedAt: transcription.verification.verifiedAt,
    sections: transcription.spans
      // 只收逐字目視核對通過的段落（visualVerified＝true 且 verified）；初稿、OCR、疑字段落一律不收
      .filter(s => s.visualVerified === true && s.transcriptionStatus === "verified")
      .map(s => ({
        sectionId: s.spanId, volume: s.volume, title: s.section, text: s.text,
        pdfPage: s.pdfPage, printedPage: s.printedPage, entry: s.entry, transcriptionStatus: "verified" as const, notes: s.notes,
      })),
  },
  {
    // v4：兩輪獨立目視轉錄＋差異回影像決議後的逐葉文字（主文與補轉錄欄組以「｜」分隔，不互相串接）；
    // 疑字以其讀法保留在文字中，但任何含疑字的引用都會被 citationUsableForRules 擋下。
    sourceId: source.sourceId, edition: source.editionLabel,
    origin: `${source.editionDescription}；v4 雙重核讀頁面文字`,
    license: "公有領域古籍之掃描影像（本專案只保存轉錄與雜湊，不保存 PDF）",
    sha256: source.sha256, importedAt: "2026-09-27",
    sections: GUANGYI_PAGES.leaves.map(l => ({
      sectionId: `PAGE-${l.leaf}`, volume: l.volume, title: `${l.volume} PDF p${l.pdfPage}${l.half === "right" ? "右" : "左"}頁`,
      text: [l.strips.filter(s => s.strip < 90).flatMap(s => s.columns).join(""), ...l.strips.filter(s => s.strip >= 90).map(s => s.columns.join(""))]
        .map(t => t.replace(/〔(?:疑字|校)：(.)〕/g, "$1").replace(/〔缺字〕/g, "□")).join("｜"),
      pdfPage: l.pdfPage, printedPage: l.printedPage, entry: l.leaf, transcriptionStatus: "verified" as const,
      notes: "v4 兩輪獨立目視轉錄＋差異回影像決議",
    })),
  },
  ...TEXT_IMPORTS,
];

export const scanSpan = (spanId: string) => transcription.spans.find(s => s.spanId === spanId);
