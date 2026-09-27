"use client";
/** 具體行動建議（ActionAdviceEngine）的畫面元件。一般模式只顯示白話；命理術語、規則編號與原文放在「為什麼」與專業模式。 */
import Link from "next/link";
import { useState } from "react";
import type { AdviceItem, ConfidenceLevel, StructuredAdvice, SystemAgreementStatus } from "@/core/advice";
import { HORIZON_LABEL, factorDef } from "@/core/advice";
import { ADVICE_TOPICS, type TopicId } from "@/kb/advice/topics";
import { getSourceText } from "@/kb/sources";
import { TIMESCALE_LABEL } from "@/kb/weights";
import { Chip, Icon } from "./primitives";
import { useApp } from "@/app/providers";

const SYS: Record<string, string> = { bazi: "八字", ziwei: "紫微", qimen: "奇門", iching: "易經（梅花）" };
const CONF_LABEL: Record<ConfidenceLevel, string> = { high: "參考程度較高", medium: "參考程度中等", low: "參考程度較低" };
const AGREE_LABEL: Record<SystemAgreementStatus, string> = { agreement: "各系統一致", partialAgreement: "大致一致", conflict: "訊號不一致", insufficientData: "資料不足" };
const REL_LABEL = { classicalText: "引用已匯入原文", principleOnly: "命理原則（原文待匯入）", pendingVerification: "待驗證" } as const;

export function TopicChips({ value, topics, onChange, hrefFor }: { value: TopicId; topics: TopicId[]; onChange?: (t: TopicId) => void; hrefFor?: (t: TopicId) => string }) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4" role="tablist" aria-label="想問的主題">
      {topics.map(t => hrefFor
        ? <a key={t} className="shrink-0" href={hrefFor(t)}><Chip active={t === value}>{ADVICE_TOPICS[t].label}</Chip></a>
        : <Chip key={t} active={t === value} onClick={() => onChange?.(t)}>{ADVICE_TOPICS[t].label}</Chip>)}
    </div>
  );
}

function Basis({ a }: { a: StructuredAdvice }) {
  return (
    <p className="flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-[var(--ink-3)]">
      <span>判斷依據：{a.coverage.level === "insufficient" ? "資料不足" : a.coverage.basisLabel}</span>
      <span>{CONF_LABEL[a.confidence.level]}</span>
      <span>{AGREE_LABEL[a.systemAgreement.status]}</span>
    </p>
  );
}

const Line = ({ it }: { it: AdviceItem }) => (
  <li className="flex gap-2 text-[15px] leading-relaxed">
    <span aria-hidden className="shrink-0 font-medium" style={{ color: it.kind === "do" ? "var(--sig-pos)" : "var(--sig-neg)" }}>{it.kind === "do" ? "✓" : "✕"}</span>
    <span>{it.short}</span>
  </li>
);

/** 首頁：今天最重要的一件事／適合做／最好避免／為什麼 */
export function TodayFocus({ a, detailHref }: { a: StructuredAdvice; detailHref: string }) {
  const p = a.primaryAdvice;
  // 最重要的一件事已放在最上面，下方清單不再重複
  const doNow = a.doNow.filter(it => it.id !== p?.id), avoidNow = a.avoidNow.filter(it => it.id !== p?.id);
  return (
    <section className="card p-5" aria-label="今天的重點">
      <p className="text-[12px] tracking-wide text-[var(--ink-3)]">{a.dayWord}最重要的一件事</p>
      <p className="font-serif mt-1 text-[19px] leading-snug">{p ? (p.kind === "avoid" ? `避免${p.short}` : p.short) : "照原本計畫進行"}</p>
      {p && p.text !== p.short && <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--ink-2)]">{p.kind === "avoid" ? `避免：${p.text}` : p.text}</p>}

      {doNow.length > 0 && (
        <div className="mt-4">
          <p className="mb-1 text-[12px] text-[var(--ink-3)]">{a.dayWord}適合做</p>
          <ul className="space-y-1">{doNow.map(it => <Line key={it.id} it={it} />)}</ul>
        </div>
      )}
      {avoidNow.length > 0 && (
        <div className="mt-3">
          <p className="mb-1 text-[12px] text-[var(--ink-3)]">{a.dayWord}最好避免</p>
          <ul className="space-y-1">{avoidNow.map(it => <Line key={it.id} it={it} />)}</ul>
        </div>
      )}

      <div className="mt-4 border-t border-[var(--line)] pt-3">
        <p className="mb-1 text-[12px] text-[var(--ink-3)]">為什麼</p>
        <p className="text-[14px] leading-relaxed">{a.headline}</p>
        {a.coverage.note && <p className="mt-1 text-[12px] leading-relaxed text-[var(--ink-3)]">{a.coverage.note}</p>}
        <div className="mt-2"><Basis a={a} /></div>
      </div>
      <Link href={detailHref} className="mt-3 inline-flex items-center gap-1 text-[14px] text-[var(--accent)]">查看詳細判斷<Icon name="chevron" size={14} /></Link>
    </section>
  );
}

function Items({ title, items, empty }: { title: string; items: AdviceItem[]; empty?: string }) {
  if (!items.length && !empty) return null;
  return (
    <section className="card p-4">
      <p className="mb-2 text-[13px] text-[var(--ink-3)]">{title}</p>
      {items.length ? (
        <ul className="space-y-3">
          {items.map(it => (
            <li key={it.id} className="flex gap-2 text-[15px] leading-relaxed">
              <span aria-hidden className="shrink-0 font-medium" style={{ color: it.kind === "do" ? "var(--sig-pos)" : "var(--sig-neg)" }}>{it.kind === "do" ? "✓" : "✕"}</span>
              <span>{it.kind === "avoid" ? `避免${it.text}` : it.text}<span className="mt-0.5 block text-[12px] text-[var(--ink-3)]">原因：{it.reason}・{CONF_LABEL[it.confidence]}</span></span>
            </li>
          ))}
        </ul>
      ) : <p className="text-[14px] text-[var(--ink-3)]">{empty}</p>}
    </section>
  );
}

/** 完整建議：一句話結論、為什麼、有利／注意因素、怎麼做、不建議、時機、其他時間尺度、判斷依據、信心 */
export function AdviceDetail({ a }: { a: StructuredAdvice }) {
  const { prefs } = useApp();
  const pro = prefs.displayMode === "pro";
  return (
    <div className="space-y-3">
      <section className="card p-5">
        <p className="text-[12px] text-[var(--ink-3)]">如果只能記得一件事</p>
        <p className="font-serif mt-1 text-[19px] leading-snug">{a.primaryAdvice ? (a.primaryAdvice.kind === "avoid" ? `避免${a.primaryAdvice.text}` : a.primaryAdvice.text) : "照原本計畫進行即可。"}</p>
        <p className="mt-3 text-[14px] leading-relaxed text-[var(--ink-2)]">{a.summary}</p>
        {a.coverage.note && <p className="mt-2 rounded-xl bg-[var(--surface-2)] px-3 py-2 text-[12px] leading-relaxed text-[var(--ink-2)]">{a.coverage.note}</p>}
        <div className="mt-2"><Basis a={a} /></div>
      </section>

      <Items title="具體怎麼做" items={a.doNow} empty={a.noSignal ? "沒有需要特別調整的做法。" : undefined} />
      <Items title="不建議怎麼做" items={a.avoidNow} />

      {a.timing && (
        <section className="card p-4 text-[14px] leading-relaxed">
          <p className="mb-1 text-[13px] text-[var(--ink-3)]">適合的時機</p>
          {a.timing.best.length > 0 && <p><span className="text-[var(--sig-pos)]">較適合</span>　{a.timing.best.join("、")}</p>}
          {a.timing.avoid.length > 0 && <p><span className="text-[var(--sig-neg)]">盡量避開</span>　{a.timing.avoid.join("、")}</p>}
          <p className="mt-1 text-[12px] text-[var(--ink-3)]">{a.timing.note}；時段只影響安排的先後，不代表不能做。</p>
        </section>
      )}

      {(a.positiveFactors.length > 0 || a.riskFactors.length > 0) && (
        <section className="card grid gap-3 p-4 text-[14px] sm:grid-cols-2">
          <div><p className="mb-1 text-[13px] text-[var(--ink-3)]">有利因素</p><ul className="space-y-0.5">{a.positiveFactors.map(f => <li key={f.factorId}>・{f.label}<span className="text-[12px] text-[var(--ink-3)]">（{f.systems.map(s => SYS[s]).join("、")}）</span></li>)}{!a.positiveFactors.length && <li className="text-[var(--ink-3)]">無特別突出</li>}</ul></div>
          <div><p className="mb-1 text-[13px] text-[var(--ink-3)]">要注意的因素</p><ul className="space-y-0.5">{a.riskFactors.map(f => <li key={f.factorId}>・{f.label}<span className="text-[12px] text-[var(--ink-3)]">（{f.systems.map(s => SYS[s]).join("、")}）</span></li>)}{!a.riskFactors.length && <li className="text-[var(--ink-3)]">無特別突出</li>}</ul></div>
        </section>
      )}

      {a.otherHorizons.map(h => (
        <section key={h.horizon} className="card p-4">
          <p className="text-[13px] text-[var(--ink-3)]">{HORIZON_LABEL[h.horizon]}</p>
          <p className="mt-1 text-[14px] leading-relaxed">{h.headline}</p>
          <ul className="mt-2 space-y-2">{[...h.doNow, ...h.avoidNow].map(it => (
            <li key={it.id} className="flex gap-2 text-[14px] leading-relaxed"><span aria-hidden style={{ color: it.kind === "do" ? "var(--sig-pos)" : "var(--sig-neg)" }}>{it.kind === "do" ? "✓" : "✕"}</span><span>{it.kind === "avoid" ? `避免${it.text}` : it.text}</span></li>
          ))}</ul>
        </section>
      ))}

      <section className="card p-4 text-[14px] leading-relaxed">
        <p className="mb-2 text-[13px] text-[var(--ink-3)]">判斷依據與信心</p>
        <p>{a.systemAgreement.note}</p>
        <ul className="mt-2 space-y-1 text-[13px]">
          {a.systemAgreement.systems.map(s => (
            <li key={s.system} className="flex gap-2">
              <span className="w-24 shrink-0 text-[var(--ink-2)]">{SYS[s.system]}</span>
              <span className="text-[var(--ink-3)]">{s.participates ? (s.support.length || s.risk.length ? [s.support.length ? `有利：${s.support.join("、")}` : "", s.risk.length ? `注意：${s.risk.join("、")}` : ""].filter(Boolean).join("；") : "此主題沒有訊號") : s.reason}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[12px] text-[var(--ink-3)]">{CONF_LABEL[a.confidence.level]}：{a.confidence.reasons.join("；")}。</p>
        {a.notes.length > 0 && <ul className="mt-2 space-y-1 text-[12px] leading-relaxed text-[var(--ink-3)]">{a.notes.map(n => <li key={n}>・{n}</li>)}</ul>}
      </section>

      <AdviceTraceView a={a} defaultOpen={pro} />
    </div>
  );
}

/** 追溯：建議規則 → 生活因素 → 判讀規則 → 命盤資料 → 原文 */
export function AdviceTraceView({ a, defaultOpen }: { a: StructuredAdvice; defaultOpen: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  if (!a.trace.length) return null;
  const items = [...a.doNow, ...a.avoidNow, ...a.otherHorizons.flatMap(h => [...h.doNow, ...h.avoidNow])];
  return (
    <details className="card p-4 text-[13px]" open={defaultOpen}>
      <summary className="cursor-pointer text-[13px] text-[var(--accent)]">為什麼這樣建議？（完整追溯）</summary>
      <ul className="mt-3 space-y-2">
        {a.trace.map(t => {
          const it = items.find(x => x.id === t.adviceItemId);
          const isOpen = open === t.adviceItemId;
          return (
            <li key={t.adviceItemId} className="inset p-3">
              <button className="w-full text-left" onClick={() => setOpen(isOpen ? null : t.adviceItemId)} aria-expanded={isOpen}>
                <span className="block">{it ? (it.kind === "avoid" ? `避免${it.short}` : it.short) : t.adviceRuleId}</span>
                <span className="block text-[11px] text-[var(--ink-3)]">建議規則 <code>{t.adviceRuleId}</code>・{HORIZON_LABEL[t.horizon]}（取自{t.layers.map(l => TIMESCALE_LABEL[l as keyof typeof TIMESCALE_LABEL] ?? l).join("、")}）</span>
              </button>
              {isOpen && (
                <div className="mt-2 space-y-2 border-t border-[var(--line)] pt-2">
                  {t.adviceRuleId.startsWith("CONFLICT") && <p className="text-[12px] leading-relaxed text-[var(--ink-2)]">這是各系統訊號不一致時的共用決策方法（先小規模、可回頭地做；不可逆的決定先補資訊），不來自單一命理判讀。各系統的看法見上方「判斷依據與信心」。</p>}
                  <p className="text-[12px] text-[var(--ink-3)]">生活因素</p>
                  <ul className="space-y-0.5">{t.factors.map(f => <li key={f.factorId}>・{factorDef(f.factorId).label} <code className="text-[11px] text-[var(--ink-3)]">{f.factorId}</code><span className="text-[11px] text-[var(--ink-3)]">（強度 {f.score}；{f.systems.map(s => SYS[s]).join("、")}）</span></li>)}</ul>
                  <p className="text-[12px] text-[var(--ink-3)]">來源判讀</p>
                  <ul className="space-y-2">{t.findings.map(f => (
                    <li key={f.findingId} className="rounded-lg bg-[var(--surface-2)] p-2">
                      <p><span className="text-[11px] text-[var(--ink-3)]">{SYS[f.system]}・{TIMESCALE_LABEL[f.timeLayer as keyof typeof TIMESCALE_LABEL]}・{f.date}</span><br />{f.source.conclusion}</p>
                      <p className="mt-1 text-[11px] text-[var(--ink-3)]">規則 <code className="break-all">{f.ruleId}</code>・{REL_LABEL[f.reliability]}</p>
                      <p className="text-[11px] text-[var(--ink-3)]">映射依據：「{f.mapping.basis}」→ {f.mapping.reason}</p>
                      <p className="text-[11px] text-[var(--ink-3)]">命理原則：{f.source.principle}</p>
                      {f.source.matched.length > 0 && <p className="text-[11px] text-[var(--ink-3)]">命盤資料：{f.source.matched.map(m => `${m.derivation || m.fact}`).join("；")}</p>}
                      {f.source.textIds.map(id => { const tx = getSourceText(id); return tx ? <p key={id} className="font-serif mt-1 text-[12px] text-[var(--accent)]">「{tx.text}」<span className="font-sans text-[10px] text-[var(--ink-3)]">《{tx.edition.title}》{tx.chapter}</span></p> : null; })}
                    </li>
                  ))}</ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </details>
  );
}
