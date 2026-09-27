"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "../providers";
import { DayView } from "@/ui/DayView";
import { Busy } from "@/ui/analysis";
import { BackButton } from "@/ui/PageBack";
import { ModeToggle } from "@/ui/interpret";
import { PersonSwitcher } from "@/ui/Nav";
import { NoPersonBanner } from "@/ui/Scales";
import { dateTitle, deviceTimeZone, todayIn, useNatal, weekday } from "@/ui/useAnalysis";

export default function DayPage() { return <Suspense><Day /></Suspense>; }

function Day() {
  const params = useSearchParams();
  const { active } = useApp();
  const [tz, setTz] = useState<string | null>(null);
  useEffect(() => setTz(deviceTimeZone()), []);
  const { natal, key } = useNatal(active);
  const date = params.get("date") ?? (tz ? todayIn(tz) : null);
  return (
    <main className="safe-top mx-auto max-w-lg px-4">
      <div className="flex items-center justify-between"><BackButton /><ModeToggle /></div>
      <div className="mt-3"><PersonSwitcher /></div>
      <h1 className="font-serif mb-4 mt-4 text-[21px] font-semibold">{date ? `${dateTitle(date)}（${weekday(date)}）命理分析` : ""}</h1>
      {!active ? <NoPersonBanner /> : !natal || !key || !tz || !date ? <Busy /> : <DayView natal={natal} natalKey={key} date={date} tz={tz} />}
    </main>
  );
}
