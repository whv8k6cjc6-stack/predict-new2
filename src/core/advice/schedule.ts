/** 今日時間表：把奇門白天各時辰的事件用神分數與整盤格局（五不遇時、伏吟、反吟、截路空亡）整理成「幾點做什麼」。
 *  只排先後、不判吉凶；活動說法依工作角色調整。 */
import { SHI_RANGE, type DayScan, type EventKind } from "../qimen";
import { SCHEDULE_ACTIVITY } from "@/kb/advice/roleVariants";
import { roleKeys, type WorkRole } from "./workRole";

export type SlotTone = "good" | "avoid" | "careful" | "plain";
/** notes：一般模式的白話說明；terms：專業模式才顯示的格局名稱 */
export interface ScheduleSlot { index: number; hour: string; tone: SlotTone; text: string; notes: string[]; terms: string[]; kinds: EventKind[] }

const HOURS = [4, 5, 6, 7, 8, 9, 10]; // 07–21 點
const KINDS: EventKind[] = ["career", "wealth", "investment", "social", "love", "travel", "decision"];
const hourText = (i: number) => { const [a, b] = SHI_RANGE[i].split("–").map(Number); return `${a}–${b} 點`; };

function activity(kind: EventKind, role?: WorkRole) {
  const t = SCHEDULE_ACTIVITY[kind];
  if (!t) return null;
  for (const k of roleKeys(role)) if (t[k]) return t[k]!;
  return t.default ?? null;
}

/** 各類活動合理的時段（時辰序：4＝7–9 點 … 10＝19–21 點）；上班族的公務不排到下班後 */
function windowOf(kind: EventKind, role?: WorkRole): number[] {
  const office = role && ["publicStaff", "publicManager", "employee", "manager", "student"].includes(role);
  switch (kind) {
    case "career": case "decision": return office ? [4, 5, 6, 7, 8] : [4, 5, 6, 7, 8, 9];
    case "wealth": return [4, 5, 6, 7, 8];
    case "investment": return [5, 6, 7];
    case "love": return [7, 8, 9, 10];
    case "social": return [5, 6, 7, 8, 9, 10];
    case "travel": return office ? [4, 5, 6, 7, 8] : [4, 5, 6, 7, 8, 9];
    default: return HOURS;
  }
}

export function daySchedule(scan: DayScan, role?: WorkRole): ScheduleSlot[] {
  const score = (k: EventKind, i: number) => scan.byKind[k]?.hourScores[i] ?? 0;
  const blocked = (i: number) => (scan.hourPatterns[i] ?? []).some(p => p.key === "wubuyu");
  // 每類活動只排在它最好的兩個時段，避免同一件事每個時段都出現
  const picks = new Map<number, EventKind[]>();
  for (const k of KINDS) {
    const jl = (i: number) => k === "travel" && (scan.hourPatterns[i] ?? []).some(p => p.key === "jielu");
    const best = windowOf(k, role).filter(i => score(k, i) >= 1.5 && !blocked(i) && !jl(i)).sort((a, b) => score(k, b) - score(k, a)).slice(0, 2);
    for (const i of best) picks.set(i, [...(picks.get(i) ?? []), k]);
  }
  return HOURS.map(i => {
    const pats = scan.hourPatterns[i] ?? [];
    const has = (k: string) => pats.some(p => p.key === k);
    const notes: string[] = [], terms = pats.filter(p => p.delta !== 0 || p.key === "jielu").map(p => p.term);
    if (has("fuyin")) notes.push("盤面停在原位：適合整理與準備，急著推進效果有限");
    if (has("fanyin")) notes.push("盤面落到對面：談定的事寫成文字，預留變更空間");
    if (has("jielu")) notes.push("傳統上這個時段不宜出發，出門時間可以調整就避開");
    if (has("wubuyu")) return { index: i, hour: hourText(i), tone: "avoid" as const, text: "重要決定、簽約或開始新的事先別排在這個時段", notes: ["傳統擇時避開的時辰", ...notes], terms, kinds: [] };
    const good = (picks.get(i) ?? []).sort((a, b) => score(b, i) - score(a, i)).slice(0, 2);
    const acts = [...new Set(good.map(k => activity(k, role)).filter((x): x is string => !!x))];
    if (acts.length) return { index: i, hour: hourText(i), tone: "good" as const, text: `適合${acts.join("；")}`, notes, terms, kinds: good };
    const bad = KINDS.filter(k => score(k, i) <= -1.5).length;
    if (bad >= 3 || has("fuyin")) return { index: i, hour: hourText(i), tone: "careful" as const, text: "處理例行事務、整理資料，重要的事排到其他時段", notes, terms, kinds: [] };
    return { index: i, hour: hourText(i), tone: "plain" as const, text: "照平常安排即可", notes, terms, kinds: [] };
  });
}
