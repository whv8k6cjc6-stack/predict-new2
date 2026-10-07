/** 多人擇時：同一件事、同一段日期，替多位人物一起找「大家都適合」的日子與時段。
 *  每人各自依自己的命盤計分；合併時以「最低分的那位」為主（大家都要過得去），平均分為次。 */
import type { ScoreBand } from "../score";
import { eventSlotsAll, type EventSlot } from "./index";
import type { NatalSet } from "./collect";

export interface GroupMember { id: string; name: string; natal: NatalSet }
export interface GroupMemberScore { id: string; name: string; score: number; band: ScoreBand }
export type GroupVerdict = "allGood" | "mostlyGood" | "mixed";
export interface GroupDay {
  date: string; time: string; hour: string;
  min: number; avg: number; verdict: GroupVerdict;
  members: GroupMemberScore[];
  /** 分數最低的人（提醒要多照顧誰） */
  weakest: GroupMemberScore | null;
  /** 這一天其他也不錯的共同時段 */
  otherHours: string[];
}
export interface GroupOptions { weekendsOnly?: boolean; top?: number }

/** 及格線：與單人擇時「較佳時段」一致（55 分） */
export const GROUP_GOOD = 55;
const isWeekend = (date: string) => { const d = new Date(`${date}T00:00:00Z`).getUTCDay(); return d === 0 || d === 6; };

export function findGroupDays(members: GroupMember[], typeKey: string, fromDate: string, days: number, timeZone: string, opts: GroupOptions = {}): GroupDay[] {
  if (!members.length) return [];
  const per = members.map(m => ({ m, slots: new Map(eventSlotsAll(m.natal, typeKey, fromDate, days, timeZone).map(s => [`${s.date}|${s.time}`, s] as const)) }));
  const keys = [...per[0].slots.keys()];
  const byDate = new Map<string, { key: string; s0: EventSlot; scores: GroupMemberScore[]; min: number; avg: number }[]>();
  for (const k of keys) {
    const scores = per.map(({ m, slots }) => { const s = slots.get(k)!; return { id: m.id, name: m.name, score: s.score, band: s.band }; });
    const min = Math.min(...scores.map(x => x.score)), avg = Math.round(scores.reduce((t, x) => t + x.score, 0) / scores.length);
    const s0 = per[0].slots.get(k)!;
    if (opts.weekendsOnly && !isWeekend(s0.date)) continue;
    byDate.set(s0.date, [...(byDate.get(s0.date) ?? []), { key: k, s0, scores, min, avg }]);
  }
  const rank = (a: { min: number; avg: number }, b: { min: number; avg: number }) => b.min - a.min || b.avg - a.avg;
  const out: GroupDay[] = [];
  for (const [date, slots] of byDate) {
    const sorted = [...slots].sort(rank);
    const best = sorted[0];
    const goodCount = best.scores.filter(x => x.score >= GROUP_GOOD).length;
    const verdict: GroupVerdict = goodCount === best.scores.length ? "allGood" : goodCount >= Math.ceil(best.scores.length / 2) ? "mostlyGood" : "mixed";
    const weakest = members.length > 1 ? [...best.scores].sort((a, b) => a.score - b.score)[0] : null;
    out.push({
      date, time: best.s0.time, hour: best.s0.hour, min: best.min, avg: best.avg, verdict, members: best.scores, weakest,
      otherHours: sorted.slice(1).filter(x => x.min >= GROUP_GOOD).slice(0, 2).map(x => x.s0.hour),
    });
  }
  return out.sort((a, b) => rank(a, b) || (a.date < b.date ? -1 : 1)).slice(0, opts.top ?? 5);
}
