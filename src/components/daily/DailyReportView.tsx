"use client";
import { useEffect, useMemo, useState } from "react";
import { getHistory, saveHistory, uid } from "@/lib/storage/store";
import type { Profile } from "@/types/profile";
import type { CategoryKey, DailyReport } from "@/types/daily";
import { computeDailyReport } from "@/engines/daily";
import { CategoryCard, CategorySheet } from "./Category";
import { DitiansuiCard, GradeLegend, HexagramCard, HourStrip, LuckyPanel, TrendBars } from "./Panels";
import { GradeBadge, ScoreRing, SectionTitle, toneClass } from "./ui";

const pad = (n: number) => String(n).padStart(2, "0");
export const fmtDate = (dt: Date) => `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
export const shiftDate = (ds: string, n: number) => { const [y, m, d] = ds.split("-").map(Number); return fmtDate(new Date(y, m - 1, d + n)); };

export function DailyReportView({ profile, date, onDateChange, today }: { profile: Profile; date: string; onDateChange: (d: string) => void; today: string }) {
  const [openKey, setOpenKey] = useState<CategoryKey | null>(null);
  const r = useMemo(() => computeDailyReport(profile, date), [profile, date]);
  const trend = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const ds = shiftDate(date, i - 3);
    const [, m, d] = ds.split("-").map(Number);
    return { date: ds, label: ds === today ? "今天" : `${m}/${d}`, score: computeDailyReport(profile, ds).overall.score };
  }), [profile, date, today]);

  const isToday = date === today;
  const now = new Date();
  const currentIdx = isToday ? Math.floor(((now.getHours() + 1) % 24) / 2) : null;
  const all = [r.overall, ...r.categories];
  const openCat = all.find(c => c.key === openKey) ?? null;
  const [, mm, dd] = date.split("-").map(Number);
  const ranked = r.categories.slice().sort((a, b) => b.score - a.score);

  return (
    <div>
      {/* 日期列 */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-serif-tc text-[26px] font-semibold leading-tight">{mm}月{dd}日<span className="ml-2 text-base font-normal text-[var(--ink-2)]">週{r.weekday}</span></p>
          <p className="mt-0.5 text-[12px] text-[var(--ink-dim)]">{r.lunarText}・{r.solarTerm}・{r.ganzhi.year}年 {r.ganzhi.month}月 <span className="text-[var(--gold)]">{r.ganzhi.day}日</span></p>
        </div>
        <label className="relative rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[12px] text-[var(--ink-2)]">
          選日期
          <input type="date" value={date} onChange={e => e.target.value && onDateChange(e.target.value)} className="absolute inset-0 opacity-0" aria-label="選擇日期" />
        </label>
      </div>
      <div className="mt-3 flex gap-2">
        {[{ l: "昨天", n: -1 }, { l: "今天", n: 0 }, { l: "明天", n: 1 }].map(b => {
          const target = b.n === 0 ? today : shiftDate(today, b.n);
          const on = date === target;
          return (
            <button key={b.l} onClick={() => onDateChange(target)}
              className={`flex-1 rounded-full py-2 text-[13px] ${on ? "bg-[var(--gold)] font-medium text-black" : "border border-white/10 text-[var(--ink-2)]"}`}>{b.l}</button>
          );
        })}
      </div>

      {/* 主卡：綜合運 */}
      <section className={`${toneClass(r.overall.grade)} card relative mt-4 overflow-hidden p-5`}>
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-20 blur-3xl" style={{ background: "var(--tone)" }} />
        <div className="flex items-center gap-4">
          <ScoreRing score={r.overall.score} grade={r.overall.grade} size={132} />
          <div className="min-w-0 flex-1">
            <p className="text-[12px] text-[var(--ink-dim)]">{r.profileName}的綜合運</p>
            <p className="mt-1 text-[15px] leading-snug">{r.overall.grade.meaning}</p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {r.keywords.map(k => (
                <span key={k.text} className={`rounded-full px-2 py-0.5 text-[11px] ${k.tone === "pos" ? "tone-great" : k.tone === "neg" ? "tone-low" : "tone-fair"}`}
                  style={{ color: "var(--tone)", background: "color-mix(in srgb, var(--tone) 14%, transparent)" }}>
                  {k.tone === "neg" ? "留意・" : k.tone === "pos" ? "助力・" : "卦意・"}{k.text}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-2xl bg-black/20 p-3.5">
          <p className="text-[13px] leading-relaxed">{r.overall.headline}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-[var(--ink-2)]"><span style={{ color: "var(--tone)" }}>今日心法｜</span>{r.overall.grade.attitude}</p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
          <p className="rounded-xl bg-white/[0.04] px-3 py-2"><span className="text-[var(--ink-dim)]">最旺　</span>{ranked[0].label} <GradeBadge g={ranked[0].grade} small /></p>
          <p className="rounded-xl bg-white/[0.04] px-3 py-2"><span className="text-[var(--ink-dim)]">留意　</span>{ranked[ranked.length - 1].label} <GradeBadge g={ranked[ranked.length - 1].grade} small /></p>
        </div>
        <button onClick={() => setOpenKey("overall")} className="mt-3 w-full rounded-xl border border-white/10 py-2.5 text-[13px] text-[var(--ink-2)] active:bg-white/5">
          看綜合運的完整依據與建議 →
        </button>
      </section>

      <SectionTitle hint="點卡片看建議與依據">八大運勢</SectionTitle>
      <div className="grid grid-cols-2 gap-2.5">
        {r.categories.map(c => <CategoryCard key={c.key} c={c} onOpen={() => setOpenKey(c.key)} />)}
      </div>

      <SectionTitle>今日幸運</SectionTitle>
      <LuckyPanel r={r} />

      <SectionTitle hint="點長條看各時辰">十二時辰運勢</SectionTitle>
      <HourStrip key={date} hours={r.hours} currentIdx={currentIdx} />

      <SectionTitle hint="點長條切換日期">前後七日綜合運</SectionTitle>
      <TrendBars days={trend} selected={date} onPick={onDateChange} />

      <SectionTitle hint="梅花易數">今日卦象</SectionTitle>
      <HexagramCard r={r} />

      <SectionTitle hint="京圖《滴天髓》">你的日主性情</SectionTitle>
      <DitiansuiCard r={r} />

      {date <= today && <FeedbackCard r={r} />}

      <SectionTitle>評分等級</SectionTitle>
      <GradeLegend />

      <div className="mt-6 space-y-2 px-1 text-[11px] leading-relaxed text-[var(--ink-dim)]">
        <p>可信度：{r.confidence === "high" ? "高" : r.confidence === "medium" ? "中" : "低"}。{r.confidenceNote}</p>
        <p>{r.disclaimer}</p>
      </div>

      <CategorySheet c={openCat} open={!!openCat} onClose={() => setOpenKey(null)} />
    </div>
  );
}

const TOPIC = "每日運勢";
const FB = [{ v: "hit", t: "準" }, { v: "neutral", t: "普通" }, { v: "miss", t: "不準" }] as const;

function FeedbackCard({ r }: { r: DailyReport }) {
  const [acc, setAcc] = useState<string | null>(null);
  const [stat, setStat] = useState<{ n: number; hit: number }>({ n: 0, hit: 0 });
  useEffect(() => {
    const h = getHistory();
    setAcc(h.find(x => x.topic === TOPIC && x.targetDate === r.date)?.feedback.accuracy ?? null);
    const rated = h.filter(x => x.topic === TOPIC && x.feedback.accuracy);
    setStat({ n: rated.length, hit: rated.filter(x => x.feedback.accuracy === "hit").length });
  }, [r.date]);

  const save = (v: "hit" | "neutral" | "miss") => {
    const h = getHistory();
    const sc = Object.fromEntries([r.overall, ...r.categories].map(c => [c.key, c.score])) as Record<string, number>;
    const rec = {
      id: uid(), queriedAt: new Date().toISOString(), queryType: "daily" as const, topic: TOPIC, targetDate: r.date,
      scores: { overall: sc.overall, career: sc.career, wealth: sc.wealth, relationship: sc.love, health: sc.health, people: sc.social, decision: sc.study, risk: 100 - sc.overall },
      aiSummary: `${r.overall.grade.name}｜${r.overall.headline}`,
      feedback: { accuracy: v, actualResult: "", feedbackAt: new Date().toISOString() },
    };
    const i = h.findIndex(x => x.topic === TOPIC && x.targetDate === r.date);
    if (i >= 0) h[i] = { ...h[i], feedback: rec.feedback }; else h.unshift(rec);
    saveHistory(h);
    setAcc(v);
    const rated = h.filter(x => x.topic === TOPIC && x.feedback.accuracy);
    setStat({ n: rated.length, hit: rated.filter(x => x.feedback.accuracy === "hit").length });
  };

  return (
    <div className="card mt-6 p-4">
      <p className="font-serif-tc text-base font-semibold">回顧：這天的運勢準嗎？</p>
      <p className="mt-1 text-[12px] text-[var(--ink-dim)]">每天花一秒回饋，累積下來就能知道這套系統對你有多準。</p>
      <div className="mt-3 flex gap-2">
        {FB.map(f => (
          <button key={f.v} onClick={() => save(f.v)}
            className={`flex-1 rounded-xl py-2.5 text-[14px] ${acc === f.v ? "bg-[var(--gold)] font-medium text-black" : "border border-white/10 text-[var(--ink-2)]"}`}>{f.t}</button>
        ))}
      </div>
      {stat.n > 0 && <p className="mt-2 text-[12px] text-[var(--ink-2)]">已回饋 {stat.n} 天，覺得「準」的比例 {Math.round((stat.hit / stat.n) * 100)}%</p>}
    </div>
  );
}
