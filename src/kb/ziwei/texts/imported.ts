/** 已匯入的紫微古籍原文。
 *  目前唯一來源：《紫微斗數全書》廣益版掃描 PDF（無文字層）的逐段目視核對轉錄
 *  （src/data/classics/ziwei/quanshu-guangyi/transcription.json）。PDF 影像為 Source of Truth，
 *  這裡只收 transcriptionStatus＝verified 的段落；初稿、OCR 或疑字一律不收。
 *  sha256 為 PDF 原檔的 SHA-256（鎖定版本）；轉錄檔本身的雜湊記在同目錄 sha256.json，由測試比對。 */
import type { ImportedClassicalText } from "@/core/ziwei/interp/citation";
import source from "@/data/classics/ziwei/quanshu-guangyi/source.json";
import transcription from "@/data/classics/ziwei/quanshu-guangyi/transcription.json";
import { TEXT_IMPORTS } from "./textImports.generated";

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
      .filter(s => s.transcriptionStatus === "verified")
      .map(s => ({
        sectionId: s.spanId, volume: s.volume, title: s.section, text: s.text,
        pdfPage: s.pdfPage, printedPage: s.printedPage, entry: s.entry, transcriptionStatus: "verified" as const, notes: s.notes,
      })),
  },
  ...TEXT_IMPORTS,
];

export const scanSpan = (spanId: string) => transcription.spans.find(s => s.spanId === spanId);
