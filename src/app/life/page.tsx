"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useApp } from "../providers";
import { lifeTimeline } from "@/core/analysis";
import { DOMAINS, type DomainKey } from "@/core/domains";
import { Chip, PageHeader, SectionTitle } from "@/ui/primitives";
import { Busy, HeatCell, ScoreChip } from "@/ui/analysis";
import { PersonSwitcher } from "@/ui/Nav";
import { NoPersonBanner } from "@/ui/Scales";
import { ScoringNote } from "@/ui/ZiweiSystem";
import { scoringComposition } from "@/core/analysis/score";
import { deviceTimeZone, todayIn, useComputed, useNatal } from "@/ui/useAnalysis";

const PICK: DomainKey[] = ["overall", "career", "wealth", "travel", "social", "love", "health"];

export default function LifePage() {
  const { active } = useApp();
  const [tz, setTz] = useState<string | null>(null);
  const [dom, setDom] = useState<DomainKey>("overall");
  useEffect(() => setTz(deviceTimeZone()), []);
  const { natal, key } = useNatal(active);
  const thisYear = tz ? Number(todayIn(tz).slice(0, 4)) : 0;
  const { data, busy } = useComputed(natal && key && tz ? `life|${key}|${thisYear}|${tz}` : null, () => lifeTimeline(natal!, tz!, thisYear - 5, thisYear + 15));
  const sc = (s: { overall: number; scores: Record<DomainKey, number> }) => dom === "overall" ? s.overall : s.scores[dom];

  return (
    <main className="safe-top mx-auto max-w-lg px-4">
      <PageHeader title="人生時間軸" subtitle="長期命勢：大運十年一格、流年逐年" right={<PersonSwitcher />} />
      {!active ? <NoPersonBanner /> : (
        <>
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">{PICK.map(d => <Chip key={d} active={dom === d} onClick={() => setDom(d)}>{DOMAINS.find(x => x.key === d)!.label}</Chip>)}</div>
          {natal && <div className="mt-2"><ScoringNote s={scoringComposition(natal)} /></div>}
          <p className="mt-2 text-[12px] leading-relaxed text-[var(--ink-3)]">這裡只看長期命勢（本命＋大運／大限＋流年），不含每天的短期時機；與每日分數是不同層級，請勿直接相減比較。</p>
          {busy || !data ? <div className="mt-4"><Busy label="排大運與流年中…" /></div> : (
            <>
              <SectionTitle right="八字大運（紫微大限暫不計分）">大運</SectionTitle>
              {data.decades.length === 0 ? <p className="text-[13px] text-[var(--ink-3)]">無大運資料。</p> : (
                <ol className="card divide-y divide-[var(--line)] px-4">
                  {data.decades.map(d => {
                    const now = thisYear >= d.startYear && thisYear <= d.endYear;
                    return (
                      <li key={d.startYear} className={`flex items-center gap-3 py-2.5 ${now ? "text-[var(--accent)]" : ""}`}>
                        <span className="font-serif w-10 text-[16px]">{d.gz}</span>
                        <span className="num w-24 text-[13px] text-[var(--ink-2)]">{d.startYear}–{d.endYear}</span>
                        <span className="num w-14 text-[12px] text-[var(--ink-3)]">{Math.floor(d.startAge)} 歲起</span>
                        <span className="flex-1 truncate text-[12px] text-[var(--ink-3)]">{now ? "目前大運" : ""}</span>
                        <ScoreChip score={sc(d)} size="sm" />
                      </li>
                    );
                  })}
                </ol>
              )}
              <SectionTitle right="點年份看當年流年分析">流年</SectionTitle>
              <div className="card grid grid-cols-4 gap-1.5 p-3 sm:grid-cols-7">
                {data.years.map(y => (
                  <Link key={y.year} href={`/domain/?d=${dom}&date=${y.year}-07-01&level=year`} className={`flex flex-col items-center rounded-lg p-1 ${y.year === thisYear ? "ring-1 ring-[var(--accent)]" : ""}`}>
                    <span className="num text-[11px] text-[var(--ink-3)]">{y.year}</span>
                    <span className="font-serif text-[12px] text-[var(--ink-2)]">{y.gz}</span>
                    <span className="w-full"><HeatCell score={sc(y)} /></span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </main>
  );
}
