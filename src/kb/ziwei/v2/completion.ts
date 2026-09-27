/** 紫微判讀完成度（Completion Dashboard）與待處理登錄（依原因分類）。所有數字由資料即時計算，不手填。 */
import { ziweiCoverage, ziweiInterpretationStatus, ruleUsability } from "@/core/ziwei/interp/engine";
import { citationUsableForRules } from "@/core/ziwei/interp/citation";
import { ZIWEI_INTERPRETATION_RULES, ZIWEI_PATTERN_CANDIDATES, ZIWEI_PATTERN_RULES } from "../interpretationRules";
import { ZIWEI_CITATIONS, SPAN_RECHECKS } from "../sources";
import { ZIWEI_PENDING } from "../pending";
import { GUANGYI_PAGES, SUPPLEMENT_BASE, pageStats } from "../texts/pages";
import { GY_BRIGHTNESS, GY_BRIGHTNESS_CONFLICTS, GY_BUILT } from ".";
import { SYSTEM_SCORING } from "@/kb/weights";

/** 使用者指定的待處理分類（另加本專案需要的三類，皆為具體原因，沒有「尚未處理」） */
export type PendingCategory = "unclearGlyph" | "insufficientConditions" | "ocrOnly" | "secondaryLowResolution" | "requiresOtherEdition" | "notYetRelevant" | "locatorOnly"
  | "historicalOnly" | "requiresChartExtension" | "notInterpretive";
export const PENDING_CATEGORY_LABEL: Record<PendingCategory, string> = {
  unclearGlyph: "疑字（兩輪核讀＋回影像決議仍無法確定）", insufficientConditions: "古文沒有足夠成立條件", ocrOnly: "只有 OCR（只能搜尋）",
  secondaryLowResolution: "第二來源解析度不足", requiresOtherEdition: "需要其他版本確認", notYetRelevant: "目前功能用不到", locatorOnly: "只有定位",
  historicalOnly: "宿命或不宜直接顯示的古代斷語（只保留原文）", requiresChartExtension: "需要客觀排盤沒有的資料（小限、斗君、空亡等；不擅自新增排盤）",
  notInterpretive: "排盤起例等非判讀內容",
};
export interface PendingItem { id: string; category: PendingCategory; section: string; pdfPage: number | null; leaf: string | null; detail: string; origin: "v4Rule" | "v3Registry" | "spanRecheck" | "secondary" }

const citOf = (id: string) => ZIWEI_CITATIONS.find(c => c.citationId === id);

export function pendingItems(): PendingItem[] {
  const out: PendingItem[] = [];
  for (const r of GY_BUILT.rules) if (r.pendingReason) {
    const c = citOf(r.citations[0]);
    out.push({ id: r.ruleId, category: r.pendingReason as PendingCategory, section: c?.section ? `${c.section}${c.entry ? `・${c.entry}` : ""}` : r.title, pdfPage: c?.locator?.pdfPage ?? null, leaf: r.leaf,
      detail: r.pendingReason === "unclearGlyph" && c?.uncertainGlyphs?.length ? `疑字：${c.uncertainGlyphs.join("")}` : (c?.modernTranslation ?? r.title), origin: "v4Rule" });
  }
  for (const s of SPAN_RECHECKS.filter(s => s.result === "differs" || s.result === "notFound"))
    out.push({ id: s.spanId, category: s.result === "differs" ? "unclearGlyph" : "locatorOnly", section: "舊版單次轉錄段落複核", pdfPage: s.pdfPage, leaf: s.leaf, detail: s.note, origin: "spanRecheck" });
  // v3 登錄中仍有效的項目（其餘已由 v4 雙重核讀與逐句規則取代）
  for (const e of ZIWEI_PENDING) {
    if (e.kind === "ocrSearchOnly") out.push({ id: e.pendingId, category: "ocrOnly", section: e.section, pdfPage: e.pdfPage, leaf: null, detail: e.reason, origin: "v3Registry" });
    if (e.sourceId.includes("jiwen")) out.push({ id: e.pendingId, category: "secondaryLowResolution", section: e.section, pdfPage: e.pdfPage, leaf: null, detail: e.reason, origin: "v3Registry" });
  }
  return out;
}

export function completion() {
  const ps = pageStats();
  const supp = GUANGYI_PAGES.leaves.flatMap(l => l.strips).filter(s => s.strip >= SUPPLEMENT_BASE);
  const gyCits = ZIWEI_CITATIONS.filter(c => c.sourceId.includes("guangyi"));
  const rules = ZIWEI_INTERPRETATION_RULES;
  const usable = rules.filter(r => ruleUsability(r).usable);
  const pend = pendingItems();
  const byCat = pend.reduce<Record<string, number>>((m, p) => ({ ...m, [p.category]: (m[p.category] ?? 0) + 1 }), {});
  const byKind = (k: string) => rules.filter(r => r.kind === k);
  const layer = (l: string) => usable.filter(r => r.timeLayer === l).length;
  const recheck = SPAN_RECHECKS.reduce<Record<string, number>>((m, s) => ({ ...m, [s.result]: (m[s.result] ?? 0) + 1 }), {});
  return {
    source: {
      pdfPages: ps.pages, leaves: ps.leaves, strips: ps.strips, supplementStrips: supp.length, doubleCheckedStrips: ps.doubleCheckedStrips,
      chars: ps.chars, uncertainGlyphs: ps.uncertainGlyphs,
    },
    citations: {
      total: gyCits.length, doubleChecked: gyCits.filter(c => c.verification?.visualDoubleChecked).length, usable: gyCits.filter(c => citationUsableForRules(c).ok).length,
      withUncertain: gyCits.filter(c => c.uncertainGlyphs?.length).length, humanReviewed: 0, secondSourceVerified: 0,
    },
    rules: {
      total: rules.length, usable: usable.length, withFactors: usable.filter(r => r.lifeFactors.length).length,
      natal: layer("natal"), decade: layer("decade"), annual: layer("annual"), principles: byKind("principle").length,
      star: usable.filter(r => r.kind === "star" || r.kind === "starInPalace").length, palace: usable.filter(r => r.kind === "palace").length, period: usable.filter(r => r.kind === "period").length,
      combination: usable.filter(r => r.kind === "combination").length,
    },
    patterns: { rules: ZIWEI_PATTERN_RULES.length, enabled: ZIWEI_PATTERN_RULES.filter(p => p.enabled).length, candidates: ZIWEI_PATTERN_CANDIDATES.length },
    brightness: { entries: GY_BRIGHTNESS.rules.length, doubleChecked: GY_BRIGHTNESS.rules.filter(r => r.clean).length, conflicts: GY_BRIGHTNESS_CONFLICTS.length },
    spanRecheck: { total: SPAN_RECHECKS.length, identical: recheck.identical ?? 0, identicalAfterResolution: recheck.identicalAfterResolution ?? 0, differs: recheck.differs ?? 0, notFound: recheck.notFound ?? 0 },
    pending: { total: pend.length, byCategory: byCat },
    coverage: ziweiCoverage(), status: ziweiInterpretationStatus(),
    scoring: SYSTEM_SCORING.ziwei.status,
  };
}
