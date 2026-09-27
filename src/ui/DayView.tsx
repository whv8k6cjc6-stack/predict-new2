"use client";
import Link from "next/link";
import { useState } from "react";
import { analyze, DOMAIN_KEYS, type NatalSet } from "@/core/analysis";
import { Banner, Button, SectionTitle, Sheet } from "./primitives";
import { BandLegend, ConfidenceDots, ScoreRing } from "./score";
import { Busy, Compass, DivergenceNote, DomainLine, HourTimeline } from "./analysis";
import { Term } from "./interpret";
import { todayIn, useComputed } from "./useAnalysis";
import { ScoringNote } from "./ZiweiSystem";
import { TodayFocus, TopicChips } from "./Advice";
import { adviseDay, dayWordOf } from "@/core/advice";
import type { TopicId } from "@/kb/advice/topics";
import { useApp } from "@/app/providers";

/** 首頁可直接切換的主題（其餘主題在詳細判斷頁） */
export const HOME_TOPICS: TopicId[] = ["general", "career", "wealth", "investment", "relationship", "social", "health", "travel", "decision"];

export function DayView({ natal, natalKey, date, tz }: { natal: NatalSet; natalKey: string; date: string; tz: string }) {
  const dayWord = dayWordOf(date, todayIn(tz));
  const { data: a, busy, error } = useComputed(`day|${natalKey}|${date}|${tz}`, () => analyze(natal, date, tz, "day"));
  const [legend, setLegend] = useState(false);
  const [topic, setTopic] = useState<TopicId>("general");
  const { prefs } = useApp();
  const adv = useComputed(`advice|${natalKey}|${date}|${tz}|${dayWord}`, () => adviseDay(natal, date, tz, HOME_TOPICS, dayWord));
  if (error) return <Banner tone="danger" title="計算失敗">{error}</Banner>;
  if (busy || !a) return <Busy label="排盤與規則計算中…" />;
  const ov = a.overall;
  const od = a.domains.overall;
  return (
    <>
      {a.unavailable.length > 0 && (
        <div className="mb-3"><Banner tone="warn" title="部分系統未納入">{a.unavailable.map(u => u.reason).join(" ")} 確定度會相應降低。</Banner></div>
      )}
      <div className="mb-3"><TopicChips value={topic} topics={HOME_TOPICS} onChange={setTopic} /></div>
      {adv.error ? <Banner tone="danger" title="建議產生失敗">{adv.error}</Banner> : !adv.data?.byTopic[topic] ? <Busy label="整理今天的建議…" /> : (
        <TodayFocus a={adv.data.byTopic[topic]!} detailHref={`/advice/?topic=${topic}&date=${date}`} />
      )}

      <SectionTitle right="分數代表命理因素的方向與強度">今日指數</SectionTitle>
      <section className="card p-5">
        <div className="flex items-center gap-5">
          <ScoreRing value={ov.score} caption="綜合指數" />
          <div className="min-w-0 space-y-2">
            <ConfidenceDots level={ov.confidence} />
            <p className="font-serif text-[16px] leading-snug">{ov.oneLine}</p>
          </div>
        </div>
        <DivergenceNote d={od.divergence} />
        <div className="mt-3"><ScoringNote s={a.scoring} /></div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={`/domain/?d=overall&date=${date}`}><Button size="sm">判斷依據</Button></Link>
          <Button size="sm" variant="ghost" onClick={() => setLegend(true)}>分數區間代表什麼</Button>
        </div>
      </section>

      <SectionTitle right="點選看四層解讀與證據">各領域</SectionTitle>
      <div className="card divide-y divide-[var(--line)] px-4">
        {DOMAIN_KEYS.filter(d => d !== "overall").map(d => <DomainLine key={d} r={a.domains[d]} href={`/domain/?d=${d}&date=${date}`} />)}
      </div>

      {a.hours && (
        <>
          <SectionTitle right={<Term term="吉時" />}>吉時時間軸</SectionTitle>
          <div className="card p-3"><HourTimeline hours={a.hours} /></div>
        </>
      )}

      {(a.directions || a.readings.iching) && (
        <details className="mt-6" open={prefs.displayMode === "pro"}>
          <summary className="cursor-pointer text-[14px] text-[var(--accent)]">命理細節（方位、今日卦）</summary>
      {a.directions && (
          <>
            <SectionTitle right="奇門遁甲">方位</SectionTitle>
            <div className="card p-4">
              <Compass good={a.directions.good} bad={a.directions.bad} />
              <p className="mt-2 text-[12px] text-[var(--ink-3)]">{a.directions.basis}</p>
            </div>
          </>
        )}
  
        {a.readings.iching && (
          <>
            <SectionTitle right="梅花易數・固定演算法">今日卦</SectionTitle>
            <Link href={`/chart/?tab=iching&date=${date}`} className="card block p-4">
              <div className="flex items-center gap-3">
                <span className="font-serif text-[40px] leading-none">{a.readings.iching.main.symbol}</span>
                <div>
                  <p className="font-serif text-[18px]">{a.readings.iching.main.full} <span className="text-[13px] text-[var(--ink-3)]">之 {a.readings.iching.changed.full}</span></p>
                  <p className="text-[13px] text-[var(--ink-2)]">動爻：{a.readings.iching.movingLabel}・{a.readings.iching.relation}</p>
                </div>
              </div>
              <p className="font-serif mt-2 text-[15px] leading-relaxed text-[var(--accent)]">「{a.readings.iching.yao.text}」</p>
            </Link>
          </>
        )}
        </details>
      )}

      <p className="mt-6 text-center text-[11px] leading-relaxed text-[var(--ink-3)]">
        分數代表命理因素的淨方向與強度，不是成功機率。<br />權重版本 {a.versions.weights}・八字 {a.versions.stamps.bazi.engine_version}・紫微 {a.versions.stamps.ziwei.engine_version}・奇門 {a.versions.stamps.qimen.engine_version}・易經 {a.versions.stamps.iching.engine_version}
      </p>

      <Sheet open={legend} onClose={() => setLegend(false)} title="分數區間定義">
        <p className="mb-3 text-[13px] leading-relaxed text-[var(--ink-2)]">分數代表「命理因素的淨方向與強度」，不是成功機率，畫面上不會出現百分比。確定度（圓點）另外表示各套命理看法是否一致。</p>
        <BandLegend />
      </Sheet>
    </>
  );
}
