"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "../providers";
import { adviseDay, dayWordOf } from "@/core/advice";
import { ADVICE_TOPICS, TOPIC_IDS, type TopicId } from "@/kb/advice/topics";
import { Banner } from "@/ui/primitives";
import { Busy } from "@/ui/analysis";
import { BackButton } from "@/ui/PageBack";
import { ModeToggle } from "@/ui/interpret";
import { NoPersonBanner } from "@/ui/Scales";
import { AdviceDetail, TopicChips } from "@/ui/Advice";
import { dateTitle, deviceTimeZone, todayIn, useComputed, useNatal } from "@/ui/useAnalysis";

export default function AdvicePage() { return <Suspense><AdviceView /></Suspense>; }

/** 具體行動建議（ActionAdviceEngine）：依主題顯示一句話結論、怎麼做、不建議、時機、各時間尺度、判斷依據與完整追溯。 */
function AdviceView() {
  const params = useSearchParams();
  const { active } = useApp();
  const [tz, setTz] = useState<string | null>(null);
  useEffect(() => setTz(deviceTimeZone()), []);
  const { natal, key } = useNatal(active);
  const q = params.get("topic") as TopicId | null;
  const topic: TopicId = q && q in ADVICE_TOPICS ? q : "general";
  const date = params.get("date") ?? (tz ? todayIn(tz) : null);
  const dayWord = date && tz ? dayWordOf(date, todayIn(tz)) : "今天";
  const adv = useComputed(natal && key && tz && date ? `advice|${key}|${date}|${tz}|${topic}|${dayWord}` : null, () => adviseDay(natal!, date!, tz!, [topic], dayWord).byTopic[topic]!);
  const T = ADVICE_TOPICS[topic];

  return (
    <main className="safe-top mx-auto max-w-lg px-4">
      <div className="flex items-center justify-between"><BackButton /><ModeToggle /></div>
      <h1 className="font-serif mt-4 text-[24px] font-semibold">{T.label}<span className="ml-2 text-[14px] font-normal text-[var(--ink-3)]">{date ? dateTitle(date) : ""}</span></h1>
      <p className="mt-1 text-[12px] text-[var(--ink-3)]">{T.question}</p>
      <div className="mt-3"><TopicChips value={topic} topics={TOPIC_IDS} hrefFor={t => `/advice/?topic=${t}&date=${date ?? ""}`} /></div>
      <div className="mt-4">
        {!active ? <NoPersonBanner /> : adv.error ? <Banner tone="danger" title="建議產生失敗">{adv.error}</Banner> : adv.busy || !adv.data ? <Busy label="整理建議中…" /> : <AdviceDetail a={adv.data} />}
      </div>
      <p className="mt-6 text-center text-[11px] leading-relaxed text-[var(--ink-3)]">所有建議都在本機依固定規則與文字模板產生，不使用任何 AI。<br />建議是依目前命理判讀提供的決策提醒，不代表事情必然發生。</p>
    </main>
  );
}
