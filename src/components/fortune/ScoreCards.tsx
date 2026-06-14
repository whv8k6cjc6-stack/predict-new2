"use client";
import type { Scores } from "@/types/fortune";
import { scoreLabel } from "@/engines/scoring";

const ITEMS: { k: keyof Scores; label: string }[] = [
  { k: "career", label: "事業" }, { k: "wealth", label: "財運" },
  { k: "relationship", label: "感情" }, { k: "health", label: "健康" },
  { k: "people", label: "人際" }, { k: "decision", label: "決策" },
];

export function ScoreCards({ s }: { s: Scores }) {
  return (
    <div>
      <div className="flex items-end justify-between rounded-2xl border border-white/10 bg-[var(--panel)] p-5">
        <div>
          <p className="text-xs text-[var(--ink-dim)]">總運</p>
          <p className="text-5xl font-light text-[var(--gold)]">{s.overall}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--ink-dim)]">風險指數</p>
          <p className={`text-3xl font-light ${s.risk >= 60 ? "text-[var(--vermilion)]" : "text-[var(--jade)]"}`}>{s.risk}</p>
          <p className="text-xs text-[var(--ink-dim)]">{s.risk >= 60 ? "需留意" : "可控"}</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {ITEMS.map(({ k, label }) => (
          <div key={k} className="rounded-xl border border-white/10 bg-[var(--panel)] p-3 text-center">
            <p className="text-[11px] text-[var(--ink-dim)]">{label}</p>
            <p className="text-2xl font-light">{s[k]}</p>
            <p className="text-[10px] text-[var(--ink-dim)]">{scoreLabel(s[k])}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ActionList({ title, items, tone }: { title: string; items: string[]; tone: "good" | "bad" }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[var(--panel)] p-4">
      <p className={`text-xs ${tone === "good" ? "text-[var(--jade)]" : "text-[var(--vermilion)]"}`}>{title}</p>
      <ul className="mt-2 space-y-1 text-sm">
        {items.map((x, i) => <li key={i}>・{x}</li>)}
      </ul>
    </div>
  );
}
