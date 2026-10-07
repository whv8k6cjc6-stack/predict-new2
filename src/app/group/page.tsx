"use client";
/** 多人擇時：替幾個人一起找適合出遊、請假或辦某件事的日子與時段。 */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useApp } from "../providers";
import { findGroupDays, GROUP_GOOD, type GroupDay } from "@/core/analysis";
import { EVENT_TYPES, eventTypeOf } from "@/core/events";
import { Banner, Button, Chip, Field, PageHeader, SectionTitle, Toggle } from "@/ui/primitives";
import { Busy, ScoreChip } from "@/ui/analysis";
import { NoPersonBanner } from "@/ui/Scales";
import { dateTitle, deviceTimeZone, todayIn, useComputed, useNatals, weekday } from "@/ui/useAnalysis";

const MAX_PEOPLE = 6;
const VERDICT: Record<GroupDay["verdict"], { t: string; c: string }> = {
  allGood: { t: "大家都適合", c: "var(--sig-pos)" },
  mostlyGood: { t: "多數人適合", c: "var(--accent)" },
  mixed: { t: "有人時機普通", c: "var(--ink-3)" },
};

export default function GroupPage() {
  const { persons, active } = useApp();
  const [tz, setTz] = useState<string | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [type, setType] = useState("trip");
  const [from, setFrom] = useState("");
  const [days, setDays] = useState(14);
  const [weekendsOnly, setWeekendsOnly] = useState(false);
  const [req, setReq] = useState<string | null>(null);
  useEffect(() => { const z = deviceTimeZone(); setTz(z); setFrom(todayIn(z)); }, []);
  useEffect(() => { if (active && !picked.length) setPicked([active.person.id]); }, [active, picked.length]);
  const bundles = useMemo(() => persons.filter(b => picked.includes(b.person.id)), [persons, picked]);
  const { members, key } = useNatals(bundles);
  const toggle = (id: string) => setPicked(p => p.includes(id) ? p.filter(x => x !== id) : p.length >= MAX_PEOPLE ? p : [...p, id]);
  const q = req && tz ? `group|${req}` : null;
  const res = useComputed(q, () => findGroupDays(members, type, from, days, tz!, { weekendsOnly, top: 6 }));
  const t = eventTypeOf(type);
  const run = () => setReq(`${key}|${type}|${from}|${days}|${weekendsOnly}|${tz}`);

  return (
    <main className="safe-top mx-auto max-w-lg px-4">
      <PageHeader title="多人擇時・選日子" subtitle="替幾個人一起找適合的日子與時段" />
      {!persons.length ? <NoPersonBanner /> : (
        <>
          <div className="card space-y-4 p-4">
            <div>
              <p className="mb-1.5 text-[13px] text-[var(--ink-2)]">一起參加的人（最多 {MAX_PEOPLE} 位）</p>
              <div className="flex flex-wrap gap-2" data-testid="group-people">
                {persons.map(b => <Chip key={b.person.id} active={picked.includes(b.person.id)} onClick={() => toggle(b.person.id)}>{b.person.displayName}</Chip>)}
              </div>
              <p className="mt-1.5 text-[12px] text-[var(--ink-3)]">還沒建立的人，先到「人物」新增出生資料。</p>
            </div>
            <div>
              <p className="mb-1.5 text-[13px] text-[var(--ink-2)]">要做的事</p>
              <div className="flex flex-wrap gap-2">{EVENT_TYPES.map(x => <Chip key={x.key} active={type === x.key} onClick={() => setType(x.key)}>{x.label}</Chip>)}</div>
              <p className="mt-1.5 text-[12px] text-[var(--ink-3)]">{t.hint}</p>
            </div>
            <Field label="從哪一天開始找"><input type="date" className="input" value={from} onChange={e => setFrom(e.target.value)} /></Field>
            <div>
              <p className="mb-1.5 text-[13px] text-[var(--ink-2)]">找多久</p>
              <div className="flex gap-2">{[7, 14, 30].map(d => <Chip key={d} active={days === d} onClick={() => setDays(d)}>{d} 天</Chip>)}</div>
            </div>
            <Toggle checked={weekendsOnly} onChange={setWeekendsOnly} label="只看週六、週日" desc="出遊或聚會常用；請假類事件通常不用勾" />
            <Button variant="primary" disabled={!from || !members.length} onClick={run}>幫大家找日子</Button>
          </div>

          {q && (res.busy || !res.data ? <div className="mt-4"><Busy label={`替 ${members.length} 位人物逐日逐時辰計算中…`} /></div> : (
            <>
              <SectionTitle right={`${members.length} 人・${days} 天`}>較適合「{t.label}」的日子</SectionTitle>
              {!res.data.length ? <Banner title="這段期間沒有符合條件的日子">可以拉長天數，或取消「只看週六、週日」。</Banner> : (
                <ul className="space-y-3" data-testid="group-results">
                  {res.data.map(d => (
                    <li key={d.date} className="card p-4">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="font-serif text-[17px]">{dateTitle(d.date).slice(5)} {weekday(d.date)}・{d.hour}</p>
                        <span className="shrink-0 text-[12px] font-medium" style={{ color: VERDICT[d.verdict].c }}>{VERDICT[d.verdict].t}</span>
                      </div>
                      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
                        {d.members.map(m => <li key={m.id} className="flex items-center gap-1.5 text-[14px]"><span>{m.name}</span><ScoreChip score={m.score} size="sm" /></li>)}
                      </ul>
                      {d.otherHours.length > 0 && <p className="mt-2 text-[12px] text-[var(--ink-3)]">這天也可以：{d.otherHours.join("、")}</p>}
                      {d.weakest && d.weakest.score < GROUP_GOOD && <p className="mt-1 text-[12px] text-[var(--ink-3)]">對 {d.weakest.name} 來說這天時機普通，行程可以排鬆一點、多留緩衝。</p>}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-3 text-[12px] leading-relaxed text-[var(--ink-3)]">排序以「分數最低的那位」為主，讓每個人都過得去，再看平均。各人的詳細分析可在「擇時」頁切換人物查看。{t.key === "leave" && "准假與否以各自單位規定為準。"}</p>
            </>
          ))}
          <p className="mt-6 text-center text-[13px]"><Link href="/event/" className="text-[var(--accent)]">只看一個人？回到單人擇時</Link></p>
        </>
      )}
    </main>
  );
}
