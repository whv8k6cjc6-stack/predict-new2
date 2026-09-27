"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useApp } from "../providers";
import { compareDates } from "@/core/analysis";
import { scoringComposition } from "@/core/analysis/score";
import { ScoringNote } from "@/ui/ZiweiSystem";
import { DOMAINS, type DomainKey } from "@/core/domains";
import { Button, Chip, Icon, PageHeader, SectionTitle } from "@/ui/primitives";
import { Busy, ScoreChip } from "@/ui/analysis";
import { PersonSwitcher } from "@/ui/Nav";
import { NoPersonBanner } from "@/ui/Scales";
import { addDays, deviceTimeZone, todayIn, useComputed, useNatal, weekday } from "@/ui/useAnalysis";

const vColor = (v: string) => v === "偏正面" ? "var(--sig-pos)" : v === "偏負面" ? "var(--sig-neg)" : "var(--ink-3)";
const vMark = (v: string) => v === "偏正面" ? "＋" : v === "偏負面" ? "－" : v === "未納入" ? "×" : v === "暫不計分" ? "／" : "・";

export default function ComparePage() {
  const { active } = useApp();
  const [tz, setTz] = useState<string | null>(null);
  const [domain, setDomain] = useState<DomainKey>("overall");
  const [dates, setDates] = useState<string[]>([]);
  const [add, setAdd] = useState("");
  useEffect(() => { const z = deviceTimeZone(); setTz(z); const t = todayIn(z); setDates([0, 1, 2].map(k => addDays(t, k))); setAdd(addDays(t, 3)); }, []);
  const { natal, key } = useNatal(active);
  const sorted = [...dates].sort();
  const { data, busy } = useComputed(natal && key && tz && sorted.length >= 2 ? `cmp|${key}|${domain}|${sorted.join(",")}|${tz}` : null, () => compareDates(natal!, sorted, domain, tz!));
  const best = data ? [...data].sort((a, b) => b.score - a.score)[0] : null;

  return (
    <main className="safe-top mx-auto max-w-lg px-4">
      <PageHeader title="日期比較" subtitle="哪一天比較適合？每一天的訊號都不同" right={<PersonSwitcher />} />
      {!active ? <NoPersonBanner /> : (
        <>
          <div className="card space-y-3 p-4">
            <p className="text-[13px] text-[var(--ink-2)]">比較目的</p>
            <div className="flex flex-wrap gap-2">{DOMAINS.map(d => <Chip key={d.key} active={domain === d.key} onClick={() => setDomain(d.key)}>{d.label}</Chip>)}</div>
            <p className="text-[13px] text-[var(--ink-2)]">日期（2–14 天）</p>
            <div className="flex flex-wrap gap-2">
              {sorted.map(d => (
                <span key={d} className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-2)] py-1 pl-3 pr-1 text-[13px]">
                  <span className="num">{d.slice(5).replace("-", "/")} {weekday(d)}</span>
                  <button aria-label={`移除 ${d}`} onClick={() => setDates(ds => ds.filter(x => x !== d))} className="rounded-full p-1 text-[var(--ink-3)]"><Icon name="close" size={12} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="date" className="input" value={add} onChange={e => setAdd(e.target.value)} aria-label="加入日期" />
              <Button disabled={!add || dates.includes(add) || dates.length >= 14} onClick={() => { setDates(ds => [...ds, add]); setAdd(addDays(add, 1)); }}>加入</Button>
            </div>
            {tz && <Button size="sm" variant="ghost" onClick={() => { const t = todayIn(tz); setDates(Array.from({ length: 7 }, (_, k) => addDays(t, k))); }}>改為未來 7 天</Button>}
          </div>

          {sorted.length < 2 ? <p className="mt-4 text-[14px] text-[var(--ink-3)]">請至少選兩天。</p> : busy || !data ? <div className="mt-4"><Busy /></div> : (
            <>
              {best && <p className="font-serif mt-5 text-[17px] leading-snug">以「{DOMAINS.find(d => d.key === domain)!.label}」來看，<span className="text-[var(--accent)]">{best.date.slice(5).replace("-", "/")}（{weekday(best.date)}）</span>相對最適合。</p>}
              {natal && <div className="mt-3"><ScoringNote s={scoringComposition(natal)} /></div>}
              <SectionTitle right="＋偏正面　－偏負面　・中性　／暫不計分">天 × 系統訊號</SectionTitle>
              <div className="card overflow-x-auto p-3">
                <table className="w-full min-w-[360px] text-[13px]">
                  <thead><tr className="text-[11px] text-[var(--ink-3)]"><th className="text-left font-normal">日期</th><th className="font-normal">分數</th>{data[0].signals.map(s => <th key={s.system} className="font-normal">{s.label}</th>)}<th className="font-normal">確定度</th></tr></thead>
                  <tbody className="divide-y divide-[var(--line)]">
                    {data.map(r => (
                      <tr key={r.date}>
                        <td className="py-2"><Link className="num underline decoration-dotted underline-offset-4" href={`/domain/?d=${domain}&date=${r.date}`}>{r.date.slice(5).replace("-", "/")} {weekday(r.date)}</Link></td>
                        <td className="text-center"><ScoreChip score={r.score} size="sm" /></td>
                        {r.signals.map(s => <td key={s.system} className="text-center text-[15px]" style={{ color: vColor(s.verdict) }} aria-label={`${s.label}${s.verdict}`}>{vMark(s.verdict)}</td>)}
                        <td className="text-center text-[11px] text-[var(--ink-3)]">{r.confidenceLabel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <SectionTitle>每一天的特色</SectionTitle>
              <ul className="space-y-2">
                {data.map(r => (
                  <li key={r.date} className="card p-3 text-[14px] leading-relaxed">
                    <p className="num font-medium">{r.date.slice(5).replace("-", "/")} {weekday(r.date)}　<span className="text-[var(--ink-2)]">{r.feature}</span></p>
                    <p className="text-[13px] text-[var(--ink-2)]">{r.top}</p>
                    {r.bestHours.length > 0 && <p className="text-[12px] text-[var(--ink-3)]">較佳時段：{r.bestHours.join("、")}</p>}
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </main>
  );
}
