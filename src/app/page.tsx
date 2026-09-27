"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useApp } from "./providers";
import { DOMAINS } from "@/core/domains";
import { ENGINES, STATUS_LABEL, getDomainScore } from "@/core/registry";
import { relationLabel } from "@/core/person";
import { localOffset, formatOffset } from "@/core/calendar/tz";
import { Button, EmptyState, Icon, SectionTitle, Sheet } from "@/ui/primitives";
import { BandLegend, DomainRow, ScoreRing } from "@/ui/score";
import { ModeToggle } from "@/ui/interpret";
import { PersonSwitcher } from "@/ui/Nav";
import { BackupReminder, useOnline } from "@/ui/status";

const todayTitle = (d: Date) => `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;

export default function Home() {
  const { active, persons } = useApp();
  const online = useOnline();
  const [now, setNow] = useState<Date | null>(null);
  const [legend, setLegend] = useState(false);
  useEffect(() => setNow(new Date()), []);

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
          {["排盤依傳統命理公式與明確規則計算，不使用任何生成式 AI。", "每個結論都能反查到命盤因素與規則來源。", "引擎通過驗證前，不顯示任何個人分數。", "完全離線可用；人物資料預設只存在本機。"].map(t => <li key={t} className="py-3">{t}</li>)}
        </ul>
      </main>
    );
  }

  const b = active!;
  const overall = getDomainScore("overall");
  const off = b.birth.localTime ? localOffset(b.birth.localDate, b.birth.localTime, b.birth.timeZone) : null;

  return (
    <main className="safe-top mx-auto max-w-lg px-4">
      <div className="flex items-center justify-between gap-2">
        <PersonSwitcher />
        <ModeToggle />
      </div>

      <div className="mt-5 flex items-end justify-between">
        <h1 className="font-serif text-[22px] font-semibold leading-tight">{now ? todayTitle(now) : ""}<span className="text-[var(--ink-3)]">｜</span>今日命理分析</h1>
      </div>
      {!online && <p className="mt-1 inline-flex items-center gap-1 text-[12px] text-[var(--ink-3)]"><Icon name="wifiOff" size={14} />離線中・所有功能照常運作</p>}

      <div className="mt-4"><BackupReminder /></div>

      <section className="card mt-4 p-5">
        <div className="flex items-center gap-5">
          <ScoreRing value={overall.status === "unavailable" ? null : overall.value} caption="今日綜合指數" />
          <div className="min-w-0">
            <p className="text-[13px] text-[var(--ink-3)]">今日綜合指數</p>
            <p className="mt-1 text-[15px] leading-relaxed">排盤與規則引擎完成驗證前，不產生任何個人分數。</p>
            <p className="mt-2 text-[12px] leading-relaxed text-[var(--ink-3)]">正式分數預定第 8 階段開放，每個分數都能反查到規則與命盤因素。</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button size="sm" onClick={() => setLegend(true)}>分數區間代表什麼</Button>
          <Link href="/demo/"><Button size="sm" variant="ghost">看 DEMO 版面</Button></Link>
        </div>
      </section>

      <SectionTitle right="星等由分數區間換算">九大領域</SectionTitle>
      <div className="card divide-y divide-[var(--line)] px-4">
        {DOMAINS.map(d => <DomainRow key={d.key} s={getDomainScore(d.key)} />)}
      </div>

      <SectionTitle>{b.person.displayName}的出生資料</SectionTitle>
      <Link href={`/persons/view/?id=${b.person.id}`} className="card block p-4">
        <dl className="grid grid-cols-[5rem_1fr] gap-y-1.5 text-[14px]">
          <dt className="text-[var(--ink-3)]">關係</dt><dd>{b.person.relationNote || relationLabel(b.person.relation)}</dd>
          <dt className="text-[var(--ink-3)]">出生</dt><dd className="num">{b.birth.localDate.replaceAll("-", "/")} {b.birth.localTime ?? "（時間不詳）"}</dd>
          <dt className="text-[var(--ink-3)]">地點</dt><dd>{b.birth.place.name || "—"}（{b.birth.timeZone}）</dd>
          {off && <><dt className="text-[var(--ink-3)]">當地時差</dt><dd className="num">{formatOffset(off.offsetMinutes)}{off.isDST ? <span className="ml-1 text-[var(--accent)]">夏令時間</span> : null}</dd></>}
          <dt className="text-[var(--ink-3)]">真太陽時</dt><dd>{b.birth.useTrueSolarTime ? "採用" : "不採用"}</dd>
        </dl>
        <p className="mt-3 flex items-center gap-1 text-[13px] text-[var(--ink-2)]">人物詳細頁 <Icon name="chevron" size={14} /></p>
      </Link>

      <SectionTitle right="docs/V3_DESIGN.md">命理引擎開發進度</SectionTitle>
      <ol className="card divide-y divide-[var(--line)] px-4">
        {ENGINES.map(e => (
          <li key={e.id} className="flex items-start gap-3 py-3">
            <span className="num mt-0.5 w-6 shrink-0 text-[12px] text-[var(--ink-3)]">P{e.phase}</span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px]">{e.name}</p>
              <p className="text-[12px] leading-snug text-[var(--ink-3)]">{e.summary}</p>
            </div>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] ${e.status === "verified" ? "bg-[var(--sig-pos)]/20 text-[var(--sig-pos)]" : e.status === "in_development" ? "bg-[var(--accent)]/15 text-[var(--accent)]" : "bg-[var(--surface-2)] text-[var(--ink-3)]"}`}>{STATUS_LABEL[e.status]}</span>
          </li>
        ))}
      </ol>

      <Sheet open={legend} onClose={() => setLegend(false)} title="分數區間定義">
        <p className="mb-3 text-[13px] leading-relaxed text-[var(--ink-2)]">分數代表「命理因素的淨方向與強度」，不是成功機率，畫面上不會出現百分比。</p>
        <BandLegend />
      </Sheet>
    </main>
  );
}
