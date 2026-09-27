"use client";
import { SCORE_BANDS, CONFIDENCE_LEVELS, bandOf, type ConfidenceLevel, type DomainScore } from "@/core/score";
import { domainOf } from "@/core/domains";
import { Icon } from "./primitives";

export const bandClass = (score: number) => `band-${bandOf(score).key}`;

export function Stars({ n, size = 13, label }: { n: number; size?: number; label?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={label ?? `${n} 顆星（滿分 5）`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < n ? "var(--tone, var(--accent))" : "var(--surface-3)" }}><Icon name="star" size={size} filled /></span>
      ))}
    </span>
  );
}

export function ConfidenceDots({ level }: { level: ConfidenceLevel }) {
  const info = CONFIDENCE_LEVELS.find(c => c.level === level)!;
  return (
    <span className="inline-flex items-center gap-1.5" aria-label={`確定度：${info.label}`}>
      <span className="inline-flex gap-[3px]">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className="h-2 w-2 rounded-full" style={{ background: i < level ? "var(--ink-1)" : "var(--surface-3)" }} />
        ))}
      </span>
      <span className="text-[12px] text-[var(--ink-2)]">{info.label}</span>
    </span>
  );
}

/** 綜合指數圓環。value 為 null 時顯示「尚未開放」，不畫任何數字。 */
export function ScoreRing({ value, size = 136, caption, demo }: { value: number | null; size?: number; caption?: string; demo?: boolean }) {
  const r = 58, c = 2 * Math.PI * r;
  const band = value === null ? null : bandOf(value);
  return (
    <div className={`relative shrink-0 ${band ? `band-${band.key}` : ""}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 140 140" width={size} height={size} role="img" aria-label={value === null ? "分數尚未開放" : `${caption ?? "指數"} ${value} 分，${band!.label}`}>
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--surface-3)" strokeWidth="8" strokeDasharray={value === null ? "3 6" : undefined} />
        {value !== null && (
          <circle cx="70" cy="70" r={r} fill="none" stroke="var(--tone)" strokeWidth="8" strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} transform="rotate(-90 70 70)" />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {value === null ? (
          <>
            <span className="font-serif text-[30px] leading-none text-[var(--ink-3)]">—</span>
            <span className="mt-1.5 text-[11px] text-[var(--ink-3)]">尚未開放</span>
          </>
        ) : (
          <>
            <span className="num text-[40px] font-light leading-none">{value}</span>
            <span className="mt-1 max-w-[80%] text-[11px] leading-tight" style={{ color: "var(--tone)" }}>{band!.label}</span>
            {demo && <span className="mt-1 rounded bg-[var(--demo)]/20 px-1.5 text-[10px] text-[var(--demo)]">DEMO</span>}
          </>
        )}
      </div>
    </div>
  );
}

/** 領域列：名稱＋星等＋分數；未開放時顯示「—」與原因 */
export function DomainRow({ s, onClick }: { s: DomainScore; onClick?: () => void }) {
  const d = domainOf(s.domain);
  const has = s.status !== "unavailable";
  const value = has ? s.value : null;
  const band = value !== null ? bandOf(value) : null;
  return (
    <button onClick={onClick} disabled={!onClick} className={`flex w-full items-center gap-3 py-2.5 text-left ${band ? `band-${band.key}` : ""}`}>
      <span className="font-serif flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-2)] text-[15px] text-[var(--ink-2)]">{d.glyph}</span>
      <span className="w-14 shrink-0 text-[15px]">{d.label}</span>
      <span className="flex-1">{band ? <Stars n={band.stars} /> : <span className="text-[12px] text-[var(--ink-3)]">尚未開放</span>}</span>
      <span className="num w-8 text-right text-[15px] text-[var(--ink-2)]">{value ?? "—"}</span>
      {s.status === "demo" && <span className="rounded bg-[var(--demo)]/20 px-1 text-[10px] text-[var(--demo)]">DEMO</span>}
    </button>
  );
}

/** 分數區間定義表 */
export function BandLegend({ compact }: { compact?: boolean }) {
  return (
    <ul className="space-y-2">
      {SCORE_BANDS.map(b => (
        <li key={b.key} className={`band-${b.key} rounded-xl bg-[var(--surface-2)] p-3`}>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm" style={{ background: "var(--tone)" }} />
            <span className="num w-16 text-[13px] text-[var(--ink-2)]">{b.min}–{b.max}</span>
            <span className="text-[14px] font-medium">{b.label}</span>
            <span className="ml-auto"><Stars n={b.stars} size={11} /></span>
          </div>
          {!compact && (
            <>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--ink-2)]">{b.meaning}</p>
              <p className="text-[13px] leading-relaxed text-[var(--ink-3)]">建議：{b.posture}</p>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
