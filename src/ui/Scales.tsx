"use client";
import Link from "next/link";
import { analyze, heatmap, yearMonths, DOMAIN_KEYS, type NatalSet } from "@/core/analysis";
import { domainOf } from "@/core/domains";
import { Banner, SectionTitle } from "./primitives";
import { ScoreRing, ConfidenceDots, Stars } from "./score";
import { Busy, DivergenceNote, DomainLine, HeatCell, ScoreChip } from "./analysis";
import { addDays, useComputed, weekday } from "./useAnalysis";

const SHORT = DOMAIN_KEYS.filter(d => d !== "overall");

/** 本週：7 天 × 各領域熱度表 */
export function WeekView({ natal, natalKey, from, tz }: { natal: NatalSet; natalKey: string; from: string; tz: string }) {
  const { data, busy } = useComputed(`week|${natalKey}|${from}|${tz}`, () => heatmap(natal, from, 7, tz));
  if (busy || !data) return <Busy />;
  return (
    <>
      <p className="mb-2 text-[13px] text-[var(--ink-3)]">點一天看當日完整分析。顏色越亮分數越高。</p>
      <div className="card overflow-x-auto p-3">
        <table className="w-full min-w-[520px] border-separate border-spacing-1 text-center text-[12px]">
          <thead><tr><th className="text-left font-normal text-[var(--ink-3)]">日期</th><th className="font-normal text-[var(--ink-3)]">綜合</th>{SHORT.map(d => <th key={d} className="font-normal text-[var(--ink-3)]">{domainOf(d).label}</th>)}</tr></thead>
          <tbody>
            {data.map(r => (
              <tr key={r.date}>
                <td className="text-left"><Link href={`/day/?date=${r.date}`} className="num text-[var(--ink-1)] underline decoration-dotted underline-offset-4">{r.label}<span className="ml-1 text-[var(--ink-3)]">{weekday(r.date)}</span></Link></td>
                <td><HeatCell score={r.overall} /></td>
                {SHORT.map(d => <td key={d}><HeatCell score={r.scores[d]} label={domainOf(d).label} /></td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <BestDays rows={data.map(r => ({ date: r.date, scores: r.scores }))} />
    </>
  );
}

function BestDays({ rows }: { rows: { date: string; scores: Record<string, number> }[] }) {
  return (
    <>
      <SectionTitle>各領域本週最佳日</SectionTitle>
      <ul className="card divide-y divide-[var(--line)] px-4 text-[14px]">
        {SHORT.map(d => {
          const best = [...rows].sort((a, b) => b.scores[d] - a.scores[d])[0];
          return (
            <li key={d} className="flex items-center gap-3 py-2">
              <span className="w-12">{domainOf(d).label}</span>
              <Link href={`/domain/?d=${d}&date=${best.date}`} className="num flex-1 text-[var(--ink-2)]">{best.date.slice(5).replace("-", "/")} {weekday(best.date)}</Link>
              <ScoreChip score={best.scores[d]} size="sm" />
            </li>
          );
        })}
      </ul>
    </>
  );
}

/** 本月：流月層級分數＋逐日綜合熱度 */
export function MonthView({ natal, natalKey, date, tz }: { natal: NatalSet; natalKey: string; date: string; tz: string }) {
  const [y, m] = date.split("-").map(Number);
  const first = `${y}-${String(m).padStart(2, "0")}-01`;
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const mid = `${y}-${String(m).padStart(2, "0")}-15`;
  const month = useComputed(`month|${natalKey}|${mid}|${tz}`, () => analyze(natal, mid, tz, "month"));
  const heat = useComputed(`mheat|${natalKey}|${first}|${tz}`, () => heatmap(natal, first, days, tz));
  const lead = new Date(`${first}T00:00:00Z`).getUTCDay();
  return (
    <>
      {month.busy || !month.data ? <Busy /> : (
        <section className="card p-5">
          <div className="flex items-center gap-5">
            <ScoreRing value={month.data.overall.score} caption="本月指數" size={112} />
            <div className="min-w-0 space-y-2">
              <p className="text-[13px] text-[var(--ink-3)]">流月 {month.data.readings.baziDay}（以節氣換月，取本月 15 日所在節氣月）</p>
              <ConfidenceDots level={month.data.overall.confidence} />
              <p className="font-serif text-[15px] leading-snug">{month.data.overall.oneLine}</p>
            </div>
          </div>
          <DivergenceNote d={month.data.domains.overall.divergence} />
          <div className="mt-3 divide-y divide-[var(--line)]">
            {SHORT.map(d => <DomainLine key={d} r={month.data!.domains[d]} href={`/domain/?d=${d}&date=${mid}&level=month`} />)}
          </div>
        </section>
      )}
      <SectionTitle right="每日綜合指數">{m} 月日曆</SectionTitle>
      {heat.busy || !heat.data ? <Busy label="逐日計算中…" /> : (
        <div className="card p-3">
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-[var(--ink-3)]">{["日", "一", "二", "三", "四", "五", "六"].map(w => <span key={w}>{w}</span>)}</div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {Array.from({ length: lead }, (_, i) => <span key={`b${i}`} />)}
            {heat.data.map(r => (
              <Link key={r.date} href={`/day/?date=${r.date}`} className="flex flex-col items-center rounded-lg p-1" aria-label={`${r.date} 綜合 ${r.overall}`}>
                <span className="num text-[11px] text-[var(--ink-3)]">{Number(r.date.slice(8))}</span>
                <span className="w-full"><HeatCell score={r.overall} /></span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/** 今年：12 個流月 */
export function YearView({ natal, natalKey, year, tz }: { natal: NatalSet; natalKey: string; year: number; tz: string }) {
  const { data, busy } = useComputed(`year|${natalKey}|${year}|${tz}`, () => yearMonths(natal, year, tz));
  const yr = useComputed(`yearlvl|${natalKey}|${year}|${tz}`, () => analyze(natal, `${year}-07-01`, tz, "year"));
  if (busy || !data) return <Busy />;
  return (
    <>
      {yr.data && (
        <section className="card mb-3 p-4">
          <p className="text-[13px] text-[var(--ink-3)]">{year} 流年 {yr.data.readings.baziDay}・長期命勢</p>
          <div className="mt-1 flex items-center gap-3">
            <ScoreChip score={yr.data.overall.score} />
            <p className="font-serif text-[15px] leading-snug">{yr.data.overall.oneLine}</p>
          </div>
          <div className="mt-2 divide-y divide-[var(--line)]">
            {SHORT.map(d => <DomainLine key={d} r={yr.data!.domains[d]} href={`/domain/?d=${d}&date=${year}-07-01&level=year`} />)}
          </div>
        </section>
      )}
      <SectionTitle right="流月以節氣換月">{year} 年 12 個流月</SectionTitle>
      <ul className="card divide-y divide-[var(--line)] px-4">
        {data.map(r => (
          <li key={r.month}>
            <Link href={`/domain/?d=overall&date=${r.date}&level=month`} className={`band-${r.band.key} flex items-center gap-3 py-2.5`}>
              <span className="num w-10 text-[14px]">{r.month} 月</span>
              <span className="font-serif w-10 text-[14px] text-[var(--ink-2)]">{r.gz}</span>
              <span className="flex-1"><Stars n={r.band.stars} size={11} /></span>
              <span className="flex gap-0.5">{SHORT.slice(0, 4).map(d => <span key={d} className="w-7"><HeatCell score={r.scores[d]} label={domainOf(d).label} /></span>)}</span>
              <span className="num w-8 text-right" style={{ color: "var(--tone)" }}>{r.overall}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[12px] text-[var(--ink-3)]">小格依序為工作、財運、投資、人際。</p>
      <div className="mt-3"><Link href="/life/" className="text-[14px] text-[var(--accent)]">看人生時間軸（大運與流年）→</Link></div>
    </>
  );
}

export function TomorrowNote({ date }: { date: string }) {
  return <p className="mb-3 text-[13px] text-[var(--ink-3)]">{addDays(date, 0).slice(5).replace("-", "/")} {weekday(date)}</p>;
}

export function NoPersonBanner() {
  return <Banner title="尚未選擇人物">請先在「人物」建立或選擇一位人物。</Banner>;
}
