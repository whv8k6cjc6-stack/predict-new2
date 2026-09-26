"use client";
import { useEffect, useState, type ReactNode } from "react";
import type { Grade } from "@/types/daily";
import { lookupTerm } from "@/data/glossary";

export const toneClass = (g: Grade) => `tone-${g.tone}`;

export function Stars({ n, size = 12 }: { n: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${n} 顆星`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden
          style={{ fill: i < n ? "var(--tone)" : "rgba(255,255,255,0.14)" }}>
          <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z" />
        </svg>
      ))}
    </span>
  );
}

export function GradeBadge({ g, small }: { g: Grade; small?: boolean }) {
  return (
    <span className={`${toneClass(g)} inline-flex items-center rounded-full font-medium ${small ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-0.5 text-xs"}`}
      style={{ color: "var(--tone)", background: "color-mix(in srgb, var(--tone) 16%, transparent)", border: "1px solid color-mix(in srgb, var(--tone) 35%, transparent)" }}>
      {g.name}
    </span>
  );
}

export function ScoreRing({ score, grade, size = 148 }: { score: number; grade: Grade; size?: number }) {
  const r = 58, c = 2 * Math.PI * r;
  const [shown, setShown] = useState(0);
  useEffect(() => { const t = setTimeout(() => setShown(score), 60); return () => clearTimeout(t); }, [score]);
  return (
    <div className={`${toneClass(grade)} relative shrink-0`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 140 140" width={size} height={size} role="img" aria-label={`綜合運 ${score} 分，${grade.name}`}>
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--tone)" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - shown / 100)} transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dashoffset 900ms cubic-bezier(.2,.8,.2,1)" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[42px] font-light leading-none tabular-nums">{score}</span>
        <span className="font-serif-tc mt-1 text-lg font-semibold" style={{ color: "var(--tone)" }}>{grade.name}</span>
        <Stars n={grade.stars} size={10} />
      </div>
    </div>
  );
}

export function Sheet({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: ReactNode; title?: string }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true" aria-label={title}>
      <button aria-label="關閉" className="animate-fade absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onClose} />
      <div className="animate-sheet relative max-h-[88dvh] w-full max-w-md overflow-y-auto rounded-t-[28px] border-t border-white/10 bg-[var(--bg-2)] px-5 pb-[calc(env(safe-area-inset-bottom)+24px)]">
        <div className="sticky top-0 z-10 -mx-5 mb-2 flex items-center justify-center bg-[var(--bg-2)] pb-2 pt-4">
          <span className="h-1.5 w-10 rounded-full bg-white/20" />
          <button onClick={onClose} aria-label="關閉"
            className="absolute right-4 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.08] text-[var(--ink-2)]">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** 可點擊的專業術語：點開顯示名詞解釋 */
export function TermChip({ term, fallback }: { term: string; fallback?: string }) {
  const [open, setOpen] = useState(false);
  const entry = lookupTerm(term);
  return (
    <>
      <button onClick={e => { e.stopPropagation(); setOpen(true); }}
        className="inline-flex items-center gap-1 rounded-md border border-dashed border-[var(--gold)]/50 px-1.5 py-0.5 text-[13px] font-medium text-[var(--gold)] active:bg-white/5">
        {term}
        <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden className="opacity-70"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title={term}>
        <p className="text-xs text-[var(--ink-dim)]">名詞解釋{entry ? `・${entry.section}` : ""}</p>
        <h3 className="font-serif-tc mt-1 text-2xl font-semibold text-[var(--gold)]">{term}</h3>
        <p className="mt-3 text-[15px] leading-relaxed">{entry?.plain ?? fallback ?? "此為古籍原文或複合術語，請見依據中的專業說明。"}</p>
        {entry?.detail && <p className="mt-3 rounded-xl bg-white/5 p-3 text-sm leading-relaxed text-[var(--ink-2)]">{entry.detail}</p>}
        {fallback && entry && <p className="mt-3 text-sm leading-relaxed text-[var(--ink-dim)]">本次情境：{fallback}</p>}
        <button onClick={() => setOpen(false)} className="mt-5 w-full rounded-xl bg-white/10 py-3 text-sm">我知道了</button>
      </Sheet>
    </>
  );
}

export function SectionTitle({ children, hint }: { children: ReactNode; hint?: ReactNode }) {
  return (
    <div className="mb-2 mt-7 flex items-end justify-between px-1">
      <h2 className="font-serif-tc text-lg font-semibold tracking-wide">{children}</h2>
      {hint && <span className="text-[11px] text-[var(--ink-dim)]">{hint}</span>}
    </div>
  );
}
