"use client";
import { useState } from "react";
import type { CategoryReport, Evidence } from "@/types/daily";
import { GradeBadge, Sheet, Stars, TermChip, toneClass } from "./ui";

const SYSTEM_STYLE: Record<string, string> = {
  八字: "#e3b866", 滴天髓: "#e79a6c", 神煞: "#d2a1e0", 紫微: "#9fb5ef", 奇門: "#7fcfb2", 易經: "#e6d59a",
};

export function SystemTag({ name }: { name: string }) {
  const c = SYSTEM_STYLE[name] ?? "#aaa";
  return (
    <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium"
      style={{ color: c, background: `color-mix(in srgb, ${c} 14%, transparent)` }}>{name}</span>
  );
}

function DeltaPill({ d }: { d: number }) {
  if (!d) return <span className="text-[11px] text-[var(--ink-dim)]">參考</span>;
  const pos = d > 0;
  return (
    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums ${pos ? "tone-good" : "tone-low"}`}
      style={{ color: "var(--tone)", background: "color-mix(in srgb, var(--tone) 14%, transparent)" }}
      aria-label={pos ? `加 ${d} 分` : `減 ${Math.abs(d)} 分`}>
      {pos ? "▲" : "▼"} {Math.abs(d)}
    </span>
  );
}

export function EvidenceItem({ ev, delta }: { ev: Evidence; delta: number }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="rounded-2xl border border-white/[0.06] bg-white/[0.03]">
      <div className="flex items-start gap-2 p-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <SystemTag name={ev.system} />
            <TermChip term={ev.term} fallback={ev.pro} />
          </div>
          <p className="mt-2 text-[14px] leading-relaxed text-[var(--ink)]">{ev.plain}</p>
        </div>
        <DeltaPill d={delta} />
      </div>
      <button onClick={() => setOpen(!open)} aria-expanded={open}
        className="flex w-full items-center justify-between border-t border-white/[0.05] px-3 py-2 text-[12px] text-[var(--ink-dim)]">
        <span>{open ? "收起專業說明" : "看專業說明與原文"}</span>
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>⌄</span>
      </button>
      {open && (
        <div className="space-y-2 px-3 pb-3 text-[13px] leading-relaxed">
          <p className="text-[var(--ink-2)]"><span className="mr-1 text-[var(--ink-dim)]">專業｜</span>{ev.pro}</p>
          {ev.quote && (
            <blockquote className="font-serif-tc rounded-xl border-l-2 border-[var(--gold)] bg-[var(--gold)]/[0.06] px-3 py-2 text-[var(--gold)]">
              「{ev.quote}」
            </blockquote>
          )}
        </div>
      )}
    </li>
  );
}

export function CategoryCard({ c, onOpen }: { c: CategoryReport; onOpen: () => void }) {
  return (
    <button onClick={onOpen} className={`${toneClass(c.grade)} card flex flex-col p-3.5 text-left transition-transform active:scale-[0.98]`}>
      <div className="flex items-center gap-2.5">
        <span className="font-serif-tc flex h-9 w-9 items-center justify-center rounded-full text-[17px] font-semibold"
          style={{ color: "var(--tone)", background: "color-mix(in srgb, var(--tone) 14%, transparent)", border: "1px solid color-mix(in srgb, var(--tone) 30%, transparent)" }}>
          {c.glyph}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] text-[var(--ink-2)]">{c.label}</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[22px] font-light leading-tight tabular-nums">{c.score}</span>
            <GradeBadge g={c.grade} small />
          </div>
        </div>
      </div>
      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div className="h-full rounded-full" style={{ width: `${c.score}%`, background: "var(--tone)" }} />
      </div>
      <p className="mt-2 line-clamp-2 text-[12px] leading-snug text-[var(--ink-dim)]">{c.headline}</p>
    </button>
  );
}

export function CategorySheet({ c, open, onClose }: { c: CategoryReport | null; open: boolean; onClose: () => void }) {
  if (!c) return null;
  const shown = c.evidences.filter(x => x.delta !== 0 || x.ev.system === "易經");
  return (
    <Sheet open={open} onClose={onClose} title={c.label}>
      <div className={toneClass(c.grade)}>
        <div className="flex items-center gap-3">
          <span className="font-serif-tc flex h-12 w-12 items-center justify-center rounded-2xl text-2xl font-semibold"
            style={{ color: "var(--tone)", background: "color-mix(in srgb, var(--tone) 15%, transparent)" }}>{c.glyph}</span>
          <div className="flex-1">
            <p className="text-sm text-[var(--ink-dim)]">{c.label}</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-light tabular-nums">{c.score}</span>
              <GradeBadge g={c.grade} />
              <Stars n={c.grade.stars} />
            </div>
          </div>
        </div>
        <p className="mt-4 text-[15px] leading-relaxed">{c.headline}</p>
        <p className="mt-2 rounded-xl bg-white/[0.04] px-3 py-2 text-[13px] text-[var(--ink-2)]">
          <span style={{ color: "var(--tone)" }}>【{c.grade.name}】</span>{c.grade.meaning}心法：{c.grade.attitude}
        </p>
      </div>

      <h3 className="font-serif-tc mt-6 text-base font-semibold">具體建議</h3>
      <div className="mt-2 grid gap-2">
        <div className="rounded-2xl bg-[var(--g-great)]/[0.07] p-3">
          <p className="text-xs font-medium text-[var(--g-great)]">建議這樣做</p>
          <ul className="mt-1.5 space-y-1.5 text-[14px] leading-relaxed">
            {c.dos.map((x, i) => <li key={i} className="flex gap-2"><span className="text-[var(--g-great)]">✓</span>{x}</li>)}
          </ul>
        </div>
        <div className="rounded-2xl bg-[var(--g-low)]/[0.08] p-3">
          <p className="text-xs font-medium text-[var(--g-low)]">今天先避開</p>
          <ul className="mt-1.5 space-y-1.5 text-[14px] leading-relaxed">
            {c.donts.map((x, i) => <li key={i} className="flex gap-2"><span className="text-[var(--g-low)]">✕</span>{x}</li>)}
          </ul>
        </div>
        {c.bestHours.length > 0 && (
          <p className="rounded-2xl bg-white/[0.04] p-3 text-[13px]"><span className="text-[var(--ink-dim)]">最佳時段　</span>{c.bestHours.join("、")}</p>
        )}
      </div>

      <h3 className="font-serif-tc mt-6 text-base font-semibold">為什麼這樣判斷？</h3>
      <p className="mt-1 text-[12px] text-[var(--ink-dim)]">每一條都是一個加減分依據；點<span className="text-[var(--gold)]">金色術語</span>看名詞解釋，點下方看專業說明與古籍原文。</p>
      <ul className="mt-3 space-y-2.5">
        {shown.map(({ ev, delta }) => <EvidenceItem key={ev.id} ev={ev} delta={delta} />)}
      </ul>
    </Sheet>
  );
}
