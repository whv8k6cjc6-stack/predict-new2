/** ClassicalBrightnessRule：《全書》各星在各宮地支的古典廟旺（來自卷二「一命宮」各星「X宮Y地」條目），
 *  與 SoftwareBrightnessProfile（iztro 2.6.1，客觀排盤顯示用）分開保存。兩者不同時建立 BrightnessConflict，只在專業模式顯示，
 *  **不修改客觀排盤**。古典廟旺只用在判讀層（例：入限訣「陷地」條件）。 */
import { BRIGHTNESS as IZTRO } from "@/kb/ziwei-brightness";
import { BR } from "@/core/ziwei/common";
import { findExcerpt } from "../texts/pages";

export type ClassicalLevel = "廟" | "旺" | "得" | "利" | "平" | "不" | "陷";
/** 古籍用詞 → 等級 */
export const LEVEL_WORD: Record<string, ClassicalLevel> = { 入廟: "廟", 廟: "廟", 廟地: "廟", 旺: "旺", 旺地: "旺", 旺宮: "旺", 得地: "得", 利益: "利", 利: "利", 和平: "平", 平: "平", 不得地: "不", 陷: "陷", 陷地: "陷", 陷宮: "陷" };

export interface ClassicalBrightnessRule {
  star: string; branch: string; level: ClassicalLevel; word: string;
  leaf: string; quote: string; clean: boolean; pdfPage: number | null;
}
export interface BrightnessConflict { star: string; palaceBranch: string; classicalValue: ClassicalLevel; softwareValue: string; classicalCitation: string; softwareSource: string }

/** 規格：star、原文片段、片段中「地支群→用詞」 */
export interface BrightnessSpec { star: string; leaf: string; quote: string; anchor?: string; entries: { branches: string; word: string }[] }

export function buildBrightness(specs: BrightnessSpec[]) {
  const rules: ClassicalBrightnessRule[] = [], problems: string[] = [];
  for (const s of specs) {
    const hit = findExcerpt(s.leaf, s.quote, s.anchor);
    if (!hit) { problems.push(`${s.star}：在 ${s.leaf} 找不到「${s.quote}」`); continue; }
    for (const e of s.entries) {
      const level = LEVEL_WORD[e.word];
      if (!level) { problems.push(`${s.star}：未知用詞 ${e.word}`); continue; }
      for (const b of e.branches) rules.push({ star: s.star, branch: b, level, word: e.word, leaf: s.leaf, quote: s.quote, clean: hit.clean, pdfPage: hit.pdfPage });
    }
  }
  return { rules, problems };
}

/** iztro 表以寅宮起算 */
export const softwareBrightness = (star: string, branch: string) => IZTRO[star]?.[(BR.indexOf(branch) - 2 + 12) % 12] ?? "";

export function brightnessConflicts(rules: ClassicalBrightnessRule[]): BrightnessConflict[] {
  return rules.filter(r => r.clean && softwareBrightness(r.star, r.branch) && softwareBrightness(r.star, r.branch) !== r.level).map(r => ({
    star: r.star, palaceBranch: r.branch, classicalValue: r.level, softwareValue: softwareBrightness(r.star, r.branch),
    classicalCitation: `《全書》廣益版 PDF p${r.pdfPage}「${r.quote}」`, softwareSource: "iztro 2.6.1（softwareDataset）",
  }));
}

/** 古典廟旺查詢：只用已雙重核讀的條目 */
export const classicalLevel = (rules: ClassicalBrightnessRule[], star: string, branch: string) => rules.find(r => r.clean && r.star === star && r.branch === branch)?.level ?? null;
export const branchesAt = (rules: ClassicalBrightnessRule[], star: string, levels: ClassicalLevel[]) => [...new Set(rules.filter(r => r.clean && r.star === star && levels.includes(r.level)).map(r => r.branch))];
