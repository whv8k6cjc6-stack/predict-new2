/** ActionAdviceEngine 對外入口：每日建議（含近 3 天、本月、今年、長期）與擇時事件建議。 */
import { collect, collectHour, type NatalSet } from "../analysis/collect";
import { SHI_RANGE, type EventKind } from "../qimen";
import { eventTypeOf } from "../events";
import { ADVICE_TOPICS, EVENT_TOPIC, TOPIC_IDS, type TopicId } from "@/kb/advice/topics";
import { buildStructuredAdvice } from "./engine";
import { interpretationResults } from "./fromRules";
import type { InterpretationResult } from "./interpretation";
import type { StructuredAdvice } from "./types";
import type { InvestorProfile } from "./investor";

export * from "./types";
export * from "./factors";
export type { InterpretationResult, InterpretationFinding, LifeFactorInstance } from "./interpretation";
export { interpretationResults, ZIWEI_ADVICE_PENDING } from "./fromRules";
export { lintAdviceText } from "./lint";
export * from "./investor";

const addDays = (date: string, k: number) => { const d = new Date(`${date}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + k); return d.toISOString().slice(0, 10); };
/** 日期的白話說法：今天、明天，其餘為「10月5日」 */
export const dayWordOf = (date: string, today: string) => date === today ? "今天" : date === addDays(today, 1) ? "明天" : `${Number(date.slice(5, 7))}月${Number(date.slice(8, 10))}日`;
/** 時辰 → 一般人看得懂的時間（例：9–11 點） */
export const plainHour = (i: number) => { const [a, b] = SHI_RANGE[i].split("–").map(Number); return `${a}–${b} 點`; };

export interface DayAdvice {
  date: string;
  interpretations: InterpretationResult[];
  byTopic: Partial<Record<TopicId, StructuredAdvice>>;
}

/** 每日建議：當日（含各時間層）＋之後兩天的流日層（近 3 天彙整用）。 */
export function adviseDay(n: NatalSet, date: string, timeZone: string, topics: TopicId[] = TOPIC_IDS, dayWord = "今天", investor?: InvestorProfile): DayAdvice {
  const dates = [date, addDays(date, 1), addDays(date, 2)];
  const days = dates.map(d => collect(n, { civilDate: d, civilTime: "12:00", timeZone }, "day"));
  const interps = days.map((c, i) => interpretationResults(n, c.fired, dates[i], c.ziwei));
  const byTopic: DayAdvice["byTopic"] = {};
  for (const topic of topics) {
    const kind = ADVICE_TOPICS[topic].timingKind as EventKind;
    const q = days[0].qimen?.byKind[kind];
    byTopic[topic] = buildStructuredAdvice({
      topic, date, mode: "day", interpretations: interps[0], nextDays: interps.slice(1), dayWord, investor,
      timing: q ? { best: q.best.map(plainHour), avoid: q.avoid.map(plainHour), basis: "依奇門白天各時段的判讀" } : null,
    });
  }
  return { date, interpretations: interps[0], byTopic };
}

/** 擇時事件：指定時刻（時辰層＋當日流日層）的建議；較佳／避開時段由呼叫端依各時辰事件分數提供。 */
export function adviseEvent(n: NatalSet, typeKey: string, date: string, time: string, timeZone: string, timing: { best: string[]; avoid: string[] } | null, investor?: InvestorProfile): StructuredAdvice {
  const type = eventTypeOf(typeKey);
  const c = collect(n, { civilDate: date, civilTime: "12:00", timeZone }, "day");
  const h = collectHour(n, date, time, timeZone, type.qimen);
  const fired = [...c.fired.filter(f => f.system !== "iching"), ...h.fired]; // 事件改用提問時刻起卦，不重複計入每日卦
  return buildStructuredAdvice({
    topic: EVENT_TOPIC[type.key] ?? "general", date, mode: "event", interpretations: interpretationResults(n, fired, date, c.ziwei), investor,
    timing: timing ? { ...timing, basis: "依此事件在當天各時辰的綜合判讀" } : null,
  });
}
