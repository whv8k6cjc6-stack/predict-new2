"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getProfiles } from "@/lib/storage/store";
import { computeFortune } from "@/engines/scoring";
import { templateExplain } from "@/ai/explanation-generator";
import { ScoreCards, ActionList } from "@/components/fortune/ScoreCards";
import type { FortuneResult } from "@/types/fortune";

const entries = [
  { href: "/query", label: "查日期", desc: "日／月／年・區間掃描" },
  { href: "/quant", label: "量化專區", desc: "策略紀律・決策狀態" },
  { href: "/profile", label: "命盤", desc: "生辰資料" },
  { href: "/bazi", label: "八字", desc: "四柱・喜用・大運" },
  { href: "/ziwei", label: "紫微", desc: "十二宮・四化" },
  { href: "/qimen", label: "奇門", desc: "起局・問事" },
  { href: "/history", label: "紀錄", desc: "回饋與命中率" },
  { href: "/settings", label: "設定", desc: "AI・備份" },
];

export default function Dashboard() {
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [hasProfile, setHasProfile] = useState(true);
  const [calcErr, setCalcErr] = useState(false);
  const [today, setToday] = useState("");

  useEffect(() => {
    const p = getProfiles()[0];
    const now = new Date();
    const ds = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    setToday(ds);
    if (!p || !p.birthDate) { setHasProfile(false); return; }
    try {
      setResult(computeFortune(p, { type: "daily", date: ds, topic: "overall", time: `${String(now.getHours()).padStart(2,"0")}:00` }));
    } catch { setCalcErr(true); }
  }, []);

  return (
    <main className="mx-auto max-w-md px-5 pb-16 pt-10">
      <p className="text-xs tracking-[0.3em] text-[var(--ink-dim)]">DESTINY DECISION</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-wide">玄機決策</h1>
      <p className="mt-1 text-sm text-[var(--ink-dim)]">{today}</p>

      {!hasProfile && (
        <section className="mt-6 rounded-2xl border border-white/10 bg-[var(--panel)] p-6">
          <p className="text-sm leading-relaxed text-[var(--ink-dim)]">
            尚未建立命盤。請先到「命盤」輸入出生資料，即可顯示今日運勢。
          </p>
          <Link href="/profile" className="mt-4 inline-block rounded-lg bg-[var(--gold)] px-4 py-2 text-sm font-medium text-black">建立命盤</Link>
        </section>
      )}

      {calcErr && (
        <section className="mt-6 rounded-2xl border border-[var(--vermilion)]/40 bg-[var(--panel)] p-6">
          <p className="text-sm leading-relaxed text-[var(--ink-dim)]">
            今日運勢計算失敗，可能是命盤資料格式有誤。請到「命盤」重新確認出生日期與時間後再儲存一次。
          </p>
          <Link href="/profile" className="mt-4 inline-block rounded-lg bg-[var(--gold)] px-4 py-2 text-sm font-medium text-black">檢查命盤</Link>
        </section>
      )}

      {result && (
        <section className="mt-6 space-y-3">
          <ScoreCards s={result.scores} />
          <ActionList title="今日適合" items={result.suitableActions} tone="good" />
          <ActionList title="今日避免" items={result.avoidActions} tone="bad" />
          <div className="rounded-xl border border-white/10 bg-[var(--panel)] p-4 text-sm leading-relaxed whitespace-pre-line text-[var(--ink-dim)]">
            {templateExplain(result)}
          </div>
          <div className="rounded-xl border border-white/10 bg-[var(--panel)] p-4 text-xs leading-relaxed text-[var(--ink-dim)]">
            <p>今日較佳時辰：<span className="text-[var(--jade)]">{result.bestTimeRange}</span></p>
            <p className="mt-1">吉方：{result.bestDirection}</p>
          </div>
        </section>
      )}

      <nav className="mt-6 grid grid-cols-2 gap-3">
        {entries.map((e) => (
          <Link key={e.href} href={e.href} className="rounded-xl border border-white/10 bg-[var(--panel)] p-4 active:bg-white/5">
            <p className="font-medium">{e.label}</p>
            <p className="mt-1 text-xs text-[var(--ink-dim)]">{e.desc}</p>
          </Link>
        ))}
      </nav>

      <p className="mt-10 text-center text-[11px] leading-relaxed text-[var(--ink-dim)]">
        本系統輸出僅供個人參考，不構成醫療、法律、投資或重大決策建議。
      </p>
    </main>
  );
}
