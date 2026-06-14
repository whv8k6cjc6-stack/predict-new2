"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getHistory, saveHistory } from "@/lib/storage/store";
import type { HistoryRecord } from "@/types/fortune";

const FB: { v: "hit" | "neutral" | "miss"; t: string }[] = [
  { v: "hit", t: "準" }, { v: "neutral", t: "普通" }, { v: "miss", t: "不準" },
];

export default function HistoryPage() {
  const [list, setList] = useState<HistoryRecord[]>([]);
  useEffect(() => setList(getHistory()), []);

  const fb = (id: string, v: "hit" | "neutral" | "miss") => {
    const next = list.map(h => h.id === id
      ? { ...h, feedback: { ...h.feedback, accuracy: v, feedbackAt: new Date().toISOString() } } : h);
    setList(next); saveHistory(next);
  };

  const rated = list.filter(h => h.feedback.accuracy);
  const hit = rated.filter(h => h.feedback.accuracy === "hit").length;

  return (
    <main className="mx-auto max-w-md px-5 pb-16 pt-10">
      <Link href="/" className="text-sm text-[var(--ink-dim)]">← 返回</Link>
      <h1 className="mt-3 text-2xl font-semibold">紀錄</h1>
      {rated.length > 0 && (
        <p className="mt-2 text-sm text-[var(--ink-dim)]">
          已回饋 {rated.length} 筆，回報「準」比例 {Math.round((hit / rated.length) * 100)}%
        </p>
      )}
      {list.length === 0 && <p className="mt-6 text-sm text-[var(--ink-dim)]">尚無查詢紀錄。</p>}
      <div className="mt-4 space-y-3">
        {list.map(h => (
          <div key={h.id} className="rounded-xl border border-white/10 bg-[var(--panel)] p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm">{h.targetDate}・{h.topic}</p>
              <p className="text-xs text-[var(--ink-dim)]">{h.queryType === "daily" ? "日" : h.queryType === "monthly" ? "月" : "年"}</p>
            </div>
            <p className="mt-1 text-xs text-[var(--ink-dim)]">總運 {h.scores.overall}・財 {h.scores.wealth}・風險 {h.scores.risk}</p>
            <p className="mt-2 text-xs leading-relaxed text-[var(--ink-dim)]">{h.aiSummary}</p>
            <div className="mt-3 flex gap-2">
              {FB.map(f => (
                <button key={f.v} onClick={() => fb(h.id, f.v)}
                  className={`rounded-full px-3 py-1 text-xs ${h.feedback.accuracy === f.v ? "bg-[var(--gold)] text-black" : "border border-white/15 text-[var(--ink-dim)]"}`}>
                  {f.t}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
