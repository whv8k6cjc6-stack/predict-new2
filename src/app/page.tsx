"use client";
import Link from "next/link";
import { Component, useEffect, useState, type ReactNode } from "react";
import { getProfiles } from "@/lib/storage/store";
import { DailyReportView, fmtDate } from "@/components/daily/DailyReportView";
import type { Profile } from "@/types/profile";

const greeting = (h: number) => h < 5 ? "夜深了" : h < 11 ? "早安" : h < 14 ? "午安" : h < 18 ? "下午好" : "晚安";

const SYSTEMS = [
  { n: "八字", d: "四柱、十神、喜用、大運流年" }, { n: "滴天髓", d: "十干性情、寒暖調候" },
  { n: "紫微斗數", d: "流日命宮、日干四化" }, { n: "奇門遁甲", d: "年命落宮、主題用神" },
  { n: "易經", d: "梅花易數每日一卦" }, { n: "神煞", d: "貴人、文昌、驛馬、桃花" },
];

export default function Home() {
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);
  const [today, setToday] = useState("");
  const [date, setDate] = useState("");
  const [hello, setHello] = useState("");
  const [err, setErr] = useState(false);

  useEffect(() => {
    const now = new Date();
    const t = fmtDate(now);
    setToday(t); setDate(t); setHello(greeting(now.getHours()));
    const p = getProfiles()[0];
    setProfile(p && p.birthDate ? p : null);
  }, []);

  return (
    <main className="mx-auto max-w-md px-4 pt-[calc(env(safe-area-inset-top)+20px)]">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[11px] tracking-[0.3em] text-[var(--ink-dim)]">DESTINY · DAILY</p>
          <h1 className="font-serif-tc text-xl font-semibold">{hello}{profile?.name ? `，${profile.name}` : ""}</h1>
        </div>
        {profile && (
          <Link href="/profile" className="rounded-full border border-white/10 px-3 py-1.5 text-[12px] text-[var(--ink-2)]">
            {profile.gender === "male" ? "乾造" : "坤造"}・{profile.birthDate.slice(0, 4)}
          </Link>
        )}
      </header>

      {profile === null && (
        <section className="card mt-2 p-6">
          <p className="font-serif-tc text-2xl font-semibold">建立你的命盤</p>
          <p className="mt-2 text-[14px] leading-relaxed text-[var(--ink-2)]">
            只要輸入出生日期、時間與地點，就能每天看到為你量身計算的運勢：分數、等級、白話說明、專業依據與具體建議。
          </p>
          <ol className="mt-4 space-y-2 text-[13px] text-[var(--ink-2)]">
            <li>① 輸入生辰（時辰越準，結果越準）</li>
            <li>② 系統自動排出八字、紫微命盤</li>
            <li>③ 每天打開就能看今日運勢</li>
          </ol>
          <Link href="/profile" className="mt-5 block rounded-xl bg-[var(--gold)] py-3 text-center text-[15px] font-medium text-black">開始建立</Link>
          <div className="mt-6 grid grid-cols-2 gap-2">
            {SYSTEMS.map(s => (
              <div key={s.n} className="rounded-xl bg-white/[0.04] p-2.5">
                <p className="font-serif-tc text-sm">{s.n}</p>
                <p className="text-[11px] text-[var(--ink-dim)]">{s.d}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {profile && date && !err && (
        <ErrorBoundaryLite onError={() => setErr(true)}>
          <DailyReportView profile={profile} date={date} onDateChange={setDate} today={today} />
        </ErrorBoundaryLite>
      )}

      {err && (
        <section className="card mt-4 p-6">
          <p className="text-sm leading-relaxed text-[var(--ink-2)]">運勢計算失敗，可能是命盤資料格式有誤。請到「命盤」重新確認出生日期與時間後再儲存一次。</p>
          <Link href="/profile" className="mt-4 inline-block rounded-lg bg-[var(--gold)] px-4 py-2 text-sm font-medium text-black">檢查命盤</Link>
        </section>
      )}

      {profile && (
        <nav className="mt-8 grid grid-cols-3 gap-2">
          {[{ href: "/bazi", l: "八字命盤" }, { href: "/ziwei", l: "紫微命盤" }, { href: "/qimen", l: "奇門起局" }, { href: "/history", l: "查詢紀錄" }, { href: "/settings", l: "設定備份" }, { href: "/glossary", l: "名詞辭典" }].map(e => (
            <Link key={e.href} href={e.href} className="rounded-xl border border-white/[0.07] bg-white/[0.03] py-3 text-center text-[13px] text-[var(--ink-2)] active:bg-white/5">{e.l}</Link>
          ))}
        </nav>
      )}
    </main>
  );
}

class ErrorBoundaryLite extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}
