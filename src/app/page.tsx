"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useApp } from "./providers";
import { Button, Chip, EmptyState, Icon, SectionTitle } from "@/ui/primitives";
import { ModeToggle } from "@/ui/interpret";
import { Busy } from "@/ui/analysis";
import { DayView } from "@/ui/DayView";
import { MonthView, WeekView, YearView } from "@/ui/Scales";
import { addDays, dateTitle, deviceTimeZone, todayIn, useNatal } from "@/ui/useAnalysis";
import { PersonSwitcher } from "@/ui/Nav";
import { BackupReminder, useOnline } from "@/ui/status";

export default function Home() {
  const { persons } = useApp();

  if (!persons.length) {
    return (
      <main className="safe-top mx-auto max-w-lg px-4">
        <p className="text-[11px] tracking-[0.35em] text-[var(--ink-3)]">XUANJI · 玄機決策</p>
        <h1 className="font-serif mt-1 text-[28px] font-semibold">歡迎</h1>
        <div className="mt-6">
          <EmptyState title="先建立第一位人物" action={<Link href="/persons/edit/"><Button variant="primary"><Icon name="plus" size={18} />建立人物</Button></Link>}>
            輸入一次出生資料，之後打開 App、點選人物就能分析，不用再重新輸入。資料只存在這台裝置，不需要帳號、不會上傳。
          </EmptyState>
        </div>
        <SectionTitle>這套 App 的原則</SectionTitle>
        <ul className="card divide-y divide-[var(--line)] px-4 text-[14px] leading-relaxed">
          {["排盤依傳統命理公式與明確規則計算，不使用任何生成式 AI。", "每個結論都能反查到命盤因素與規則來源。", "分數與四層解讀全部由本機規則引擎計算，可重現、不上傳。", "完全離線可用；人物資料預設只存在本機。"].map(t => <li key={t} className="py-3">{t}</li>)}
        </ul>
      </main>
    );
  }

  return <Dashboard />;
}

type Scale = "today" | "tomorrow" | "week" | "month" | "year";
const SCALES: { key: Scale; label: string }[] = [
  { key: "today", label: "今天" }, { key: "tomorrow", label: "明天" }, { key: "week", label: "本週" }, { key: "month", label: "本月" }, { key: "year", label: "今年" },
];
const TOOLS = [
  { href: "/event/", label: "擇時・事件", glyph: "擇" },
  { href: "/compare/", label: "日期比較", glyph: "比" },
  { href: "/chart/", label: "命盤", glyph: "盤" },
  { href: "/life/", label: "人生時間軸", glyph: "運" },
];

function Dashboard() {
  const { active } = useApp();
  const online = useOnline();
  const [tz, setTz] = useState<string | null>(null);
  const [scale, setScale] = useState<Scale>("today");
  useEffect(() => setTz(deviceTimeZone()), []);
  const { natal, key } = useNatal(active);
  const today = tz ? todayIn(tz) : null;
  const date = today && scale === "tomorrow" ? addDays(today, 1) : today;
  const title = !date ? "" : scale === "week" ? "本週運勢" : scale === "month" ? `${Number(date.slice(5, 7))} 月運勢` : scale === "year" ? `${date.slice(0, 4)} 年運勢` : `${dateTitle(date)}｜${scale === "today" ? "今日" : "明日"}命理分析`;

  return (
    <main className="safe-top mx-auto max-w-lg px-4">
      <div className="flex items-center justify-between gap-2">
        <PersonSwitcher />
        <ModeToggle />
      </div>
      <h1 className="font-serif mt-5 text-[21px] font-semibold leading-tight">{title}</h1>
      {!online && <p className="mt-1 inline-flex items-center gap-1 text-[12px] text-[var(--ink-3)]"><Icon name="wifiOff" size={14} />離線中・所有功能照常運作</p>}
      <div role="tablist" aria-label="時間尺度" className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
        {SCALES.map(s => <Chip key={s.key} active={scale === s.key} onClick={() => setScale(s.key)}>{s.label}</Chip>)}
      </div>
      <nav aria-label="工具" className="mt-3 grid grid-cols-4 gap-2">
        {TOOLS.map(t => (
          <Link key={t.href} href={t.href} className="card flex flex-col items-center gap-1 py-2.5 text-[12px] text-[var(--ink-2)]">
            <span className="font-serif text-[18px] text-[var(--accent)]">{t.glyph}</span>{t.label}
          </Link>
        ))}
      </nav>
      <div className="mt-4"><BackupReminder /></div>
      <div className="mt-4">
        {!natal || !key || !tz || !date ? <Busy /> :
          scale === "week" ? <WeekView natal={natal} natalKey={key} from={today!} tz={tz} /> :
          scale === "month" ? <MonthView natal={natal} natalKey={key} date={today!} tz={tz} /> :
          scale === "year" ? <YearView natal={natal} natalKey={key} year={Number(today!.slice(0, 4))} tz={tz} /> :
          <DayView natal={natal} natalKey={key} date={date} tz={tz} />}
      </div>
    </main>
  );
}
