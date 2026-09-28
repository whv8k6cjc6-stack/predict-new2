/** 《紫微斗數全書》廣益版逐頁文字（兩輪獨立目視轉錄＋差異回影像決議；src/data/classics/ziwei/quanshu-guangyi/pages.json）。
 *  每葉由右到左分成若干欄組（strip），每個欄組保存影像範圍（頁寬高比例）、各直行文字與驗證狀態。
 *  仍無法確定的字以〔疑字：X〕保留在文字中；任何含疑字的片段都不能作為規則依據。 */
import { normalizeClassical, type BoundingRegion, type VerificationState } from "@/core/ziwei/interp/citation";
import pages from "@/data/classics/ziwei/quanshu-guangyi/pages.json";

export interface PageStrip { strip: number; region: BoundingRegion; columns: string[]; verification: VerificationState; uncertainGlyphs: string[]; undecided: number; passAgreement: number }
export interface PageLeaf { leaf: string; pdfPage: number; printedPage: number; half: "right" | "left"; volume: string; strips: PageStrip[] }

export const GUANGYI_PAGES = pages as { sourceId: string; method: string; leaves: PageLeaf[] };
export const leafOf = (leaf: string) => GUANGYI_PAGES.leaves.find(l => l.leaf === leaf);

const MARK = /〔[^〕]*〕/g;
export interface ExcerptHit {
  leaf: string; pdfPage: number; printedPage: number; volume: string;
  strips: number[]; region: BoundingRegion;
  /** 片段在頁面文字中的原樣（含疑字標記時 clean＝false） */
  raw: string; clean: boolean; uncertainGlyphs: string[];
}

/** 補轉錄欄組（strip ≥ SUPPLEMENT_BASE）：書縫區與被切邊直行的獨立補轉錄，各自成一段連續文字，不與主文串接 */
export const SUPPLEMENT_BASE = 90;
type Ch = { c: string; strip: number };
const STREAMS = new Map<string, { chars: Ch[]; plain: string[] }[]>();
function streamsCached(L: PageLeaf) {
  let v = STREAMS.get(L.leaf);
  if (!v) { v = streamsOf(L).map(chars => ({ chars, plain: plainOf(chars) })); STREAMS.set(L.leaf, v); }
  return v;
}
function streamsOf(L: PageLeaf): Ch[][] {
  const main: Ch[] = [], sup: Ch[][] = [];
  for (const s of L.strips) {
    const out: Ch[] = s.strip >= SUPPLEMENT_BASE ? [] : main;
    for (const col of s.columns) {
      let i = 0;
      while (i < col.length) {
        if (col[i] === "〔") { const j = col.indexOf("〕", i); out.push({ c: col.slice(i, j + 1), strip: s.strip }); i = j + 1; continue; }
        if (col[i] !== "〈" && col[i] !== "〉") out.push({ c: col[i], strip: s.strip });
        i++;
      }
    }
    if (s.strip >= SUPPLEMENT_BASE) sup.push(out);
  }
  return [main, ...sup];
}
const plainOf = (chars: Ch[]) => chars.map(x => x.c.startsWith("〔") ? (x.c.startsWith("〔疑字：") ? x.c.slice(4, -1) : "□") : normalizeClassical(x.c));
function indexOfSeq(hay: string[], needle: string[], from = 0, to = hay.length): number {
  outer: for (let i = from; i + needle.length <= to; i++) {
    for (let k = 0; k < needle.length; k++) if (hay[i + k] !== needle[k]) continue outer;
    return i;
  }
  return -1;
}

/** 在某葉的決議後文字中找片段；比對前去除夾注括號與標點、統一異體字。
 *  anchor：先找到較長的上下文（例：整條「紫微……」），再在其範圍內找 quote，避免短片段在同葉其他條目誤中。
 *  主文找不到時，再到各補轉錄欄組（書縫區、切邊直行）中找。 */
export function findExcerpt(leaf: string, quote: string, anchor?: string): ExcerptHit | null {
  const L = leafOf(leaf);
  if (!L) return null;
  const needle = [...normalizeClassical(quote)];
  // 主文與各補轉錄欄組都找；同一段文字若在補轉錄中已雙重核讀無疑字，優先採用無疑字的那一處
  let firstUnclean: ExcerptHit | null = null;
  for (const { chars, plain } of streamsCached(L)) {
    let from = 0, to = plain.length;
    if (anchor) {
      const a = [...normalizeClassical(anchor)];
      const ai = indexOfSeq(plain, a);
      if (ai < 0) continue;
      from = ai; to = ai + a.length;
    }
    const i = indexOfSeq(plain, needle, from, to);
    if (i < 0) continue;
    const seg = chars.slice(i, i + needle.length);
    const stripIds = [...new Set(seg.map(x => x.strip))];
    const regs = L.strips.filter(s => stripIds.includes(s.strip)).map(s => s.region);
    const region = { x0: Math.min(...regs.map(r => r.x0)), y0: Math.min(...regs.map(r => r.y0)), x1: Math.max(...regs.map(r => r.x1)), y1: Math.max(...regs.map(r => r.y1)) };
    const unc = seg.filter(x => x.c.startsWith("〔")).map(x => x.c);
    const hit = { leaf, pdfPage: L.pdfPage, printedPage: L.printedPage, volume: L.volume, strips: stripIds, region, raw: seg.map(x => x.c).join(""), clean: unc.length === 0, uncertainGlyphs: unc };
    if (hit.clean) return hit;
    firstUnclean ??= hit;
  }
  return firstUnclean;
}

/** 全部頁面的統計（完成度用） */
export function pageStats() {
  const strips = GUANGYI_PAGES.leaves.flatMap(l => l.strips);
  return {
    leaves: GUANGYI_PAGES.leaves.length,
    pages: new Set(GUANGYI_PAGES.leaves.map(l => l.pdfPage)).size,
    strips: strips.length,
    doubleCheckedStrips: strips.filter(s => s.verification.visualDoubleChecked).length,
    uncertainGlyphs: strips.reduce((n, s) => n + s.uncertainGlyphs.length, 0),
    chars: strips.reduce((n, s) => n + s.columns.join("").replace(MARK, "□").length, 0),
  };
}
