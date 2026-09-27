"use client";
import { cloneElement, isValidElement, useEffect, useId, type ReactElement, type ReactNode, type ButtonHTMLAttributes } from "react";

const PATHS: Record<string, string> = {
  sun: "M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M12 8a4 4 0 100 8 4 4 0 000-8z",
  people: "M9 11a4 4 0 100-8 4 4 0 000 8zM2 21c1-3.5 3.8-5.5 7-5.5s6 2 7 5.5M16 3.5a4 4 0 010 7.5M18 15.5c1.8.7 3.2 2.5 4 5.5",
  book: "M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2V5zM4 19a2 2 0 012-2h13",
  gear: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z",
  plus: "M12 5v14M5 12h14",
  search: "M11 18a7 7 0 100-14 7 7 0 000 14zM21 21l-4.3-4.3",
  star: "M12 2.8l2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.3l-5.7 3 1.1-6.3L2.8 9.5l6.4-.9z",
  chevron: "M9 6l6 6-6 6",
  down: "M6 9l6 6 6-6",
  close: "M6 6l12 12M18 6L6 18",
  lock: "M6 11h12v10H6zM8 11V7a4 4 0 118 0v4",
  shield: "M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z",
  face: "M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3M9 10v1M15 10v1M12 10v4h-1M9.5 16.5c1.5 1 3.5 1 5 0",
  upload: "M12 16V4M7 9l5-5 5 5M4 20h16",
  download: "M12 4v12M7 11l5 5 5-5M4 20h16",
  trash: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13",
  edit: "M4 20h4L19 9l-4-4L4 16v4z",
  tag: "M3 12V4h8l10 10-8 8L3 12zM7.5 7.5h.01",
  clock: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2",
  info: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 16v-4M12 8h.01",
  up: "M18 15l-6-6-6 6",
  wifiOff: "M2 2l20 20M8.5 16.5a5 5 0 017 0M5 12.9a10 10 0 015.2-2.7M19 12.9a10 10 0 00-2.5-1.7M2 8.8a15 15 0 014.2-2.6M22 8.8A15 15 0 0010.6 5M12 20h.01",
};

export function Icon({ name, size = 20, className = "", filled = false }: { name: keyof typeof PATHS | string; size?: number; className?: string; filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className={className}
      fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d={PATHS[name] ?? PATHS.info} />
    </svg>
  );
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger"; size?: "md" | "sm"; block?: boolean };
export function Button({ variant = "secondary", size = "md", block, className = "", ...rest }: BtnProps) {
  const base = "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100";
  const sz = size === "sm" ? "px-3 py-1.5 text-[13px]" : "px-4 py-3 text-[15px]";
  const v = {
    primary: "bg-[var(--accent)] text-[var(--accent-ink)]",
    secondary: "border border-[var(--line-strong)] bg-[var(--surface-2)] text-[var(--ink-1)]",
    ghost: "text-[var(--ink-2)]",
    danger: "border border-[var(--danger)]/50 text-[var(--danger)]",
  }[variant];
  return <button {...rest} className={`${base} ${sz} ${v} ${block ? "w-full" : ""} ${className}`} />;
}

export function Chip({ active, children, onClick, className = "" }: { active?: boolean; children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active}
      className={`shrink-0 rounded-full px-3 py-1.5 text-[13px] transition ${active ? "bg-[var(--ink-1)] text-[var(--bg)]" : "border border-[var(--line-strong)] text-[var(--ink-2)]"} ${className}`}>
      {children}
    </button>
  );
}

export function Field({ label, hint, children, error }: { label: string; hint?: ReactNode; children: ReactNode; error?: string }) {
  const id = useId();
  const hintId = `${id}-hint`;
  const child = isValidElement(children)
    ? cloneElement(children as ReactElement<{ id?: string; "aria-describedby"?: string; "aria-invalid"?: boolean }>, { id, "aria-describedby": hint || error ? hintId : undefined, "aria-invalid": error ? true : undefined })
    : children;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] text-[var(--ink-2)]">{label}</label>
      {child}
      {hint && !error && <span id={hintId} className="mt-1 block text-[12px] leading-snug text-[var(--ink-3)]">{hint}</span>}
      {error && <span id={hintId} className="mt-1 block text-[12px] text-[var(--danger)]" role="alert">{error}</span>}
    </div>
  );
}

export function Toggle({ checked, onChange, label, desc }: { checked: boolean; onChange: (v: boolean) => void; label: string; desc?: ReactNode }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="flex w-full items-center justify-between gap-4 py-1 text-left">
      <span>
        <span className="block text-[15px]">{label}</span>
        {desc && <span className="mt-0.5 block text-[12px] leading-snug text-[var(--ink-3)]">{desc}</span>}
      </span>
      <span className={`relative h-7 w-12 shrink-0 rounded-full transition ${checked ? "bg-[var(--accent)]" : "bg-[var(--surface-3)]"}`}>
        <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-[var(--ink-1)] transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
      </span>
    </button>
  );
}

export function Banner({ tone = "info", title, children, action }: { tone?: "info" | "warn" | "demo" | "danger"; title: ReactNode; children?: ReactNode; action?: ReactNode }) {
  const c = { info: "var(--ink-2)", warn: "var(--accent)", demo: "var(--demo)", danger: "var(--danger)" }[tone];
  return (
    <div className={`rounded-2xl border p-4 ${tone === "demo" ? "demo-stripe" : ""}`} style={{ borderColor: `color-mix(in srgb, ${c} 40%, transparent)`, background: `color-mix(in srgb, ${c} 7%, transparent)` }}>
      <p className="text-[14px] font-medium" style={{ color: c }}>{title}</p>
      {children && <div className="mt-1 text-[13px] leading-relaxed text-[var(--ink-2)]">{children}</div>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export function PageHeader({ title, subtitle, right }: { title: ReactNode; subtitle?: ReactNode; right?: ReactNode }) {
  return (
    <header className="mb-5 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="font-serif text-[26px] font-semibold leading-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-[13px] text-[var(--ink-3)]">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}

export function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-2.5 mt-7 flex items-end justify-between px-0.5">
      <h2 className="font-serif text-[17px] font-semibold tracking-wide">{children}</h2>
      {right && <div className="text-[12px] text-[var(--ink-3)]">{right}</div>}
    </div>
  );
}

export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={title}>
      <button aria-label="關閉" className="animate-fade absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="animate-sheet relative max-h-[88dvh] w-full max-w-lg overflow-y-auto rounded-t-[24px] border-t border-[var(--line)] bg-[var(--surface-1)] px-5 pb-[calc(env(safe-area-inset-bottom)+20px)] sm:rounded-[24px] sm:border">
        <div className="sticky top-0 z-10 -mx-5 flex items-center justify-between bg-[var(--surface-1)] px-5 pb-3 pt-4">
          <h2 className="font-serif text-[18px] font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="關閉" className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--ink-2)]"><Icon name="close" size={16} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="card px-6 py-10 text-center">
      <p className="font-serif text-[19px] font-semibold">{title}</p>
      {children && <div className="mx-auto mt-2 max-w-xs text-[14px] leading-relaxed text-[var(--ink-2)]">{children}</div>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Confirm({ open, title, message, confirmText = "確定", danger, onConfirm, onClose }: { open: boolean; title: string; message: ReactNode; confirmText?: string; danger?: boolean; onConfirm: () => void; onClose: () => void }) {
  return (
    <Sheet open={open} onClose={onClose} title={title}>
      <div className="text-[14px] leading-relaxed text-[var(--ink-2)]">{message}</div>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <Button onClick={onClose}>取消</Button>
        <Button variant={danger ? "danger" : "primary"} onClick={() => { onConfirm(); onClose(); }}>{confirmText}</Button>
      </div>
    </Sheet>
  );
}
