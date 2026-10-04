/** 今日總結：把各主題的建議收成幾行白話，再配一句《周易》原句與打氣話。
 *  只重組既有建議（不新增判斷）；一句話依當天整體狀態挑選、同一天固定不變。 */
import type { TopicId } from "@/kb/advice/topics";
import { ADVICE_TOPICS } from "@/kb/advice/topics";
import { DAILY_QUOTES, type DailyQuote, type QuoteMood } from "@/kb/advice/quotes";
import { getSourceText } from "@/kb/sources";
import type { FactorId } from "./factors";
import type { StructuredAdvice } from "./types";

export interface DaySummary {
  overview: string;
  mood: QuoteMood;
  lines: { label: string; text: string; kind: "do" | "avoid" | "info"; topic?: TopicId }[];
  quote: { excerpt: string; source: string; plain: string; textId: string };
}

const SUMMARY_TOPICS: TopicId[] = ["career", "wealth", "investment", "relationship", "health"];
const FATIGUE: FactorId[] = ["fatigueRisk", "stressLoad", "recoveryNeed"];
const PEOPLE: FactorId[] = ["communicationMisunderstandingRisk", "communicationConflictRisk", "trustRisk", "hierarchyFriction", "cooperationFriction"];

function moodOf(g: StructuredAdvice | undefined): QuoteMood {
  if (!g || g.noSignal) return "steady";
  const S = g.positiveFactors.length, R = g.riskFactors.length;
  if (g.systemAgreement.status === "conflict") return "steady";
  if (R > S) {
    const ids = g.riskFactors.map(f => f.factorId);
    if (ids.some(id => FATIGUE.includes(id))) return "rest";
    if (ids.some(id => PEOPLE.includes(id))) return "people";
    return "care";
  }
  return S > R ? "push" : "steady";
}

/** 同一天、同一種狀態固定挑同一句；不同日期會輪替 */
function pickQuote(date: string, mood: QuoteMood): DailyQuote {
  const pool = DAILY_QUOTES.filter(q => q.moods.includes(mood));
  let h = 0;
  for (const c of date) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return pool[h % pool.length];
}

const line = (a: StructuredAdvice | undefined) => {
  const p = a?.primaryAdvice;
  if (!a || !p || a.noSignal) return null;
  return { text: p.kind === "avoid" ? `避免${p.short}` : p.short, kind: p.kind };
};

export function summarizeDay(date: string, byTopic: Partial<Record<TopicId, StructuredAdvice>>): DaySummary {
  const g = byTopic.general;
  const mood = moodOf(g);
  const lines: DaySummary["lines"] = [];
  const top = line(g);
  if (top) lines.push({ label: "最重要", ...top, topic: "general" });
  const avoid = g?.avoidNow.find(i => i.id !== g.primaryAdvice?.id);
  if (avoid) lines.push({ label: "最好避免", text: avoid.short, kind: "avoid", topic: "general" });
  const seen = new Set(lines.map(l => l.text));
  for (const t of SUMMARY_TOPICS) {
    const a = byTopic[t];
    if (t === "investment" && a?.investRhythm) {
      lines.push({ label: ADVICE_TOPICS[t].label, text: `節奏：${a.investRhythm.label}`, kind: "info", topic: t });
      continue;
    }
    const l = line(a);
    if (!l || seen.has(l.text)) continue;
    seen.add(l.text);
    lines.push({ label: ADVICE_TOPICS[t].label, ...l, topic: t });
  }
  const q = pickQuote(date, mood);
  const src = getSourceText(q.textId);
  return {
    overview: g?.headline ?? "今天沒有特別突出的訊號，照原本計畫進行即可。",
    mood, lines: lines.slice(0, 7),
    quote: { excerpt: q.excerpt, source: `《周易》${src?.chapter ?? ""}`, plain: q.plain, textId: q.textId },
  };
}
