"use client";
import { useState, type ReactNode } from "react";
import { lookupTerm } from "@/kb/glossary";
import { Icon, Sheet } from "./primitives";
import { useApp } from "@/app/providers";

export interface FourLayer { conclusion: string; plain: string; pro: string; actions: string[] }

/** 四層解讀：一句話 → 白話 → 專業分析 → 實際建議。白話模式預設收合專業層。 */
export function FourLayerCard({ title, layer, badge }: { title: ReactNode; layer: FourLayer; badge?: ReactNode }) {
  const { prefs } = useApp();
  const [showPro, setShowPro] = useState(false);
  const pro = prefs.displayMode === "pro" || showPro;
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] text-[var(--ink-3)]">{title}</p>{badge}
      </div>
      <p className="font-serif mt-2 text-[18px] leading-snug">{layer.conclusion}</p>
      <div className="mt-3 space-y-3 text-[14px] leading-relaxed">
        <section><p className="mb-0.5 text-[12px] text-[var(--ink-3)]">白話說明</p><p>{layer.plain}</p></section>
        {pro ? (
          <section className="inset p-3"><p className="mb-0.5 text-[12px] text-[var(--ink-3)]">專業分析</p><p className="text-[var(--ink-2)]">{layer.pro}</p></section>
        ) : (
          <button onClick={() => setShowPro(true)} className="text-[13px] text-[var(--accent)]">顯示專業分析</button>
        )}
        <section>
          <p className="mb-1 text-[12px] text-[var(--ink-3)]">實際建議</p>
          <ul className="space-y-1">{layer.actions.map((a, i) => <li key={i} className="flex gap-2"><span className="text-[var(--accent)]">・</span>{a}</li>)}</ul>
        </section>
      </div>
    </div>
  );
}

export interface EvidenceLink {
  system: string;
  ruleId: string;
  factors: string[];        // 命盤因素
  weight: string;           // 加權
  contribution: number;
  commentary?: string;      // 注解（第二層）
  original?: { text: string; source: string; verified: boolean }; // 原文（第一層）
}

/** 證據鏈：分數 → 加權項目 → 規則 → 命盤因素 → 注解 → 原文 */
export function EvidenceChain({ items }: { items: EvidenceLink[] }) {
  return (
    <ol className="space-y-2">
      {items.map((e, i) => (
        <li key={i} className="inset p-3 text-[13px] leading-relaxed">
          <div className="flex items-center gap-2">
            <span className="rounded bg-[var(--surface-3)] px-1.5 py-0.5 text-[11px] text-[var(--ink-2)]">{e.system}</span>
            <code className="truncate text-[11px] text-[var(--ink-3)]">{e.ruleId}</code>
            <span className="num ml-auto text-[12px]" style={{ color: e.contribution >= 0 ? "var(--sig-pos)" : "var(--sig-neg)" }}>
              {e.contribution >= 0 ? "加分" : "減分"} {Math.abs(e.contribution)}
            </span>
          </div>
          <p className="mt-1.5"><span className="text-[var(--ink-3)]">命盤因素｜</span>{e.factors.join("；")}</p>
          <p><span className="text-[var(--ink-3)]">加權｜</span>{e.weight}</p>
          {e.commentary && <p><span className="text-[var(--ink-3)]">注解｜</span>{e.commentary}</p>}
          {e.original && (
            <p className="font-serif mt-1 text-[var(--accent)]">
              「{e.original.text}」<span className="text-[11px] text-[var(--ink-3)]">— {e.original.source}{e.original.verified ? "" : "（未校驗）"}</span>
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}

/** 可點術語：專業定義／白話／在我命盤代表什麼／今天為什麼出現 */
export function Term({ term, inMyChart, whyToday }: { term: string; inMyChart?: string; whyToday?: string }) {
  const [open, setOpen] = useState(false);
  const e = lookupTerm(term);
  const pending = "從領域詳情頁的證據鏈點開術語時，這裡會顯示依你命盤與當天盤面的說明。";
  return (
    <>
      <button type="button" onClick={ev => { ev.stopPropagation(); setOpen(true); }}
        className="mx-0.5 inline-flex items-center gap-0.5 border-b border-dashed border-[var(--accent)]/70 text-[var(--accent)]">
        {term}
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title={term}>
        {e && <p className="-mt-1 mb-3 text-[12px] text-[var(--ink-3)]">{e.section}</p>}
        <dl className="space-y-3 text-[14px] leading-relaxed">
          <div className="inset p-3"><dt className="text-[12px] text-[var(--ink-3)]">1　專業定義</dt><dd>{e?.pro ?? "辭典尚未收錄此詞。"}</dd></div>
          <div className="inset p-3"><dt className="text-[12px] text-[var(--ink-3)]">2　白話解釋</dt><dd>{e?.plain ?? "—"}</dd></div>
          <div className="inset p-3"><dt className="text-[12px] text-[var(--ink-3)]">3　在我命盤代表什麼</dt><dd className={inMyChart ? "" : "text-[var(--ink-3)]"}>{inMyChart ?? pending}</dd></div>
          <div className="inset p-3"><dt className="text-[12px] text-[var(--ink-3)]">4　今天為什麼出現</dt><dd className={whyToday ? "" : "text-[var(--ink-3)]"}>{whyToday ?? pending}</dd></div>
        </dl>
      </Sheet>
    </>
  );
}

export function ModeToggle() {
  const { prefs, updatePrefs } = useApp();
  return (
    <div role="radiogroup" aria-label="顯示模式" className="inline-flex rounded-full bg-[var(--surface-2)] p-0.5 text-[12px]">
      {(["plain", "pro"] as const).map(m => (
        <button key={m} role="radio" aria-checked={prefs.displayMode === m} onClick={() => updatePrefs({ displayMode: m })}
          className={`rounded-full px-3 py-1 ${prefs.displayMode === m ? "bg-[var(--ink-1)] text-[var(--bg)]" : "text-[var(--ink-2)]"}`}>
          {m === "plain" ? "白話" : "專業"}
        </button>
      ))}
    </div>
  );
}

export const InfoDot = () => <Icon name="info" size={14} className="inline text-[var(--ink-3)]" />;
