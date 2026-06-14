/** 本機模板解釋（離線 / AI 失敗 / 未啟用 AI 時使用） */
import type { FortuneResult } from "@/types/fortune";
import { scoreLabel } from "@/engines/scoring";
import { INVESTMENT_DISCLAIMER } from "./prompt-builder";

export function templateExplain(r: FortuneResult, invest = false): string {
  const lines: string[] = [];
  lines.push(r.summary);
  lines.push(`總運 ${r.scores.overall}（${scoreLabel(r.scores.overall)}）、財運 ${r.scores.wealth}（${scoreLabel(r.scores.wealth)}）、事業 ${r.scores.career}（${scoreLabel(r.scores.career)}）、風險指數 ${r.scores.risk}。`);
  const top = [...r.triggeredRules].sort((a, b) => b.weight - a.weight).slice(0, 4);
  for (const t of top) lines.push(`・${t.explanation}${t.strategy ? " " + t.strategy : ""}`);
  if (r.confidenceLevel === "low") lines.push("提醒：因出生時辰不確定，本次推算參考性降低。");
  if (invest) lines.push(INVESTMENT_DISCLAIMER);
  return lines.join("\n");
}
