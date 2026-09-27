"use client";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { bandOf } from "@/core/score";
import { domainOf, type DomainKey } from "@/core/domains";
import type { Fact } from "@/core/engine";
import type { DomainResult, Evidence } from "@/core/analysis";
import type { SystemSignal, Divergence } from "@/core/analysis/score";
import type { HourSlot, AdviceItem } from "@/core/analysis";
import { getSourceText } from "@/kb/sources";
import { TIMESCALE_LABEL, W_SYSTEM } from "@/kb/weights";
import { Icon, Sheet } from "./primitives";
import { ConfidenceDots, Stars } from "./score";
import { Term } from "./interpret";
import { useApp } from "@/app/providers";

const SYS: Record<string, string> = { bazi: "八字", ziwei: "紫微", qimen: "奇門", iching: "易經" };

export function Busy({ label = "計算中…" }: { label?: string }) {
  return <div className="card flex items-center justify-center gap-2 p-8 text-[14px] text-[var(--ink-3)]"><span className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent)]" />{label}</div>;
}

export function ScoreChip({ score, size = "md" }: { score: number; size?: "sm" | "md" }) {
  const b = bandOf(score);
  return (
    <span className={`band-${b.key} num inline-flex items-center justify-center rounded-lg font-medium ${size === "sm" ? "h-6 min-w-8 px-1 text-[12px]" : "h-8 min-w-10 px-1.5 text-[15px]"}`}
      style={{ background: "color-mix(in srgb, var(--tone) 22%, transparent)", color: "var(--tone)" }} aria-label={`${score} 分，${b.label}`}>{score}</span>
  );
}

/** 領域列（正式分數） */
export function DomainLine({ r, href }: { r: DomainResult; href: string }) {
  const d = domainOf(r.domain);
  return (
    <Link href={href} className={`band-${r.band.key} flex w-full items-center gap-3 py-2.5`}>
      <span className="font-serif flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-2)] text-[15px] text-[var(--ink-2)]">{d.glyph}</span>
      <span className="w-12 shrink-0 text-[15px]">{d.label}</span>
      <span className="flex-1"><Stars n={r.band.stars} /></span>
      <span className="hidden text-[11px] text-[var(--ink-3)] min-[400px]:inline">{r.confidenceLabel}</span>
      <span className="num w-8 text-right text-[16px]" style={{ color: "var(--tone)" }}>{r.score}</span>
      <Icon name="chevron" size={14} className="text-[var(--ink-3)]" />
    </Link>
  );
}

const verdictColor = (v: string) => v === "偏正面" ? "var(--sig-pos)" : v === "偏負面" ? "var(--sig-neg)" : "var(--ink-3)";
const arrow = (d: number, n: number) => n === 0 ? "—" : d >= 0.2 ? "↑" : d <= -0.2 ? "↓" : "→";

/** 交叉判讀：各系統看法 */
export function SystemVerdicts({ signals }: { signals: SystemSignal[] }) {
  return (
    <table className="w-full text-[13px]">
      <thead><tr className="text-left text-[11px] text-[var(--ink-3)]"><th className="py-1 font-normal">系統</th><th className="font-normal">看法</th><th className="font-normal text-center">長期</th><th className="font-normal text-center">短期</th><th className="font-normal text-right">依據</th></tr></thead>
      <tbody className="divide-y divide-[var(--line)]">
        {signals.map(s => (
          <tr key={s.system}>
            <td className="py-2">{s.label}</td>
            <td style={{ color: verdictColor(s.verdict) }}>{s.verdict}</td>
            <td className="text-center text-[var(--ink-2)]" aria-label="長期命勢方向">{s.available ? arrow(s.long.direction, s.long.count) : ""}</td>
            <td className="text-center text-[var(--ink-2)]" aria-label="短期時機方向">{s.available ? arrow(s.short.direction, s.short.count) : ""}</td>
            <td className="num text-right text-[var(--ink-3)]">{s.available ? `${s.count} 條` : "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function DivergenceNote({ d }: { d: Divergence | null }) {
  if (!d) return null;
  return (
    <div className="inset mt-3 p-3 text-[13px] leading-relaxed">
      <p><span className="mr-1 rounded bg-[var(--surface-3)] px-1.5 py-0.5 text-[11px]">{d.kind}</span>{d.text}</p>
      <p className="mt-1 text-[var(--accent)]">{d.advice}</p>
    </div>
  );
}

/** 吉時時間軸（12 時辰） */
export function HourTimeline({ hours, domain = "overall" }: { hours: HourSlot[]; domain?: DomainKey }) {
  const [pick, setPick] = useState<HourSlot | null>(null);
  const val = (h: HourSlot) => domain === "overall" ? h.value : h.byDomain[domain];
  const lvl = (h: HourSlot) => { const v = val(h); return v >= 1.2 ? "good" : v <= -1.2 ? "bad" : "neutral"; };
  return (
    <>
      <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-12" role="list" aria-label="十二時辰吉凶">
        {hours.map(h => {
          const l = lvl(h);
          return (
            <button key={h.index} role="listitem" onClick={() => setPick(h)}
              className="flex flex-col items-center rounded-lg py-1.5 text-center"
              style={{ background: l === "good" ? "color-mix(in srgb, var(--sig-pos) 22%, transparent)" : l === "bad" ? "color-mix(in srgb, var(--sig-neg) 22%, transparent)" : "var(--surface-2)" }}
              aria-label={`${h.label}：${l === "good" ? "吉" : l === "bad" ? "宜避開" : "平"}`}>
              <span className="font-serif text-[16px]">{h.branch}</span>
              <span className="num text-[9px] text-[var(--ink-3)]">{h.range}</span>
              <span className="text-[10px]" style={{ color: l === "good" ? "var(--sig-pos)" : l === "bad" ? "var(--sig-neg)" : "var(--ink-3)" }}>{l === "good" ? "吉" : l === "bad" ? "避" : "平"}</span>
            </button>
          );
        })}
      </div>
      <Sheet open={!!pick} onClose={() => setPick(null)} title={pick?.label ?? ""}>
        {pick && (
          <div className="space-y-2 text-[14px] leading-relaxed">
            <p>時辰合計 <span className="num">{val(pick)}</span>（≥ 1.2 標示為吉、≤ −1.2 標示為宜避開）</p>
            <ul className="space-y-1.5">{pick.reasons.map((r, i) => <li key={i} className="inset p-2.5 text-[13px]">{r}</li>)}</ul>
            <p className="text-[12px] text-[var(--ink-3)]">計算：奇門各領域用神分數 × 時辰權重 0.7 × 系統權重，加上八字流時規則貢獻。</p>
          </div>
        )}
      </Sheet>
    </>
  );
}

const DIRS = ["北", "東北", "東", "東南", "南", "西南", "西", "西北"];
/** 方位羅盤（上北下南） */
export function Compass({ good, bad }: { good: string[]; bad: string[] }) {
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 120 120" width={120} height={120} role="img" aria-label={`吉方：${good.join("、") || "無"}；不利方：${bad.join("、") || "無"}`}>
        <circle cx="60" cy="60" r="54" fill="none" stroke="var(--line-strong)" />
        <circle cx="60" cy="60" r="3" fill="var(--ink-3)" />
        {DIRS.map((d, i) => {
          const a = (i * 45 - 90) * Math.PI / 180;
          const x = 60 + Math.cos(a) * 42, y = 60 + Math.sin(a) * 42;
          const c = good.includes(d) ? "var(--sig-pos)" : bad.includes(d) ? "var(--sig-neg)" : "var(--ink-3)";
          return <g key={d}>
            {(good.includes(d) || bad.includes(d)) && <circle cx={x} cy={y} r="11" fill={`color-mix(in srgb, ${c} 25%, transparent)`} />}
            <text x={x} y={y + 4} textAnchor="middle" fontSize={d.length > 1 ? 9 : 12} fill={c} fontFamily="var(--font-serif)">{d}</text>
          </g>;
        })}
      </svg>
      <div className="text-[14px] leading-relaxed">
        <p><span className="text-[var(--sig-pos)]">吉方</span>　{good.join("、") || "無特別突出"}</p>
        <p><span className="text-[var(--sig-neg)]">不利方</span>　{bad.join("、") || "無特別需避開"}</p>
      </div>
    </div>
  );
}

/** 宜／忌清單，每條可看依據 */
export function AdviceList({ items, tone }: { items: AdviceItem[]; tone: "yi" | "ji" }) {
  const [pick, setPick] = useState<AdviceItem | null>(null);
  if (!items.length) return <p className="text-[13px] text-[var(--ink-3)]">{tone === "yi" ? "今天沒有特別突出的有利事項。" : "今天沒有特別需要避開的事項。"}</p>;
  return (
    <>
      <ul className="space-y-1.5">
        {items.map(it => (
          <li key={it.evidenceId}>
            <button onClick={() => setPick(it)} className="flex w-full items-start gap-2 text-left text-[14px] leading-relaxed">
              <span style={{ color: tone === "yi" ? "var(--sig-pos)" : "var(--sig-neg)" }}>{tone === "yi" ? "宜" : "忌"}</span>
              <span className="flex-1">{it.text}</span>
              <Icon name="info" size={14} className="mt-1 shrink-0 text-[var(--ink-3)]" />
            </button>
          </li>
        ))}
      </ul>
      <Sheet open={!!pick} onClose={() => setPick(null)} title="這一條的依據">
        {pick && (
          <div className="space-y-2 text-[14px] leading-relaxed">
            <p className="font-serif text-[16px]">{pick.why}</p>
            <p className="text-[13px] text-[var(--ink-3)]">來源：{SYS[pick.system]}・影響領域：{domainOf(pick.domain).label}</p>
            <p className="text-[12px] text-[var(--ink-3)]">規則編號 <code>{pick.evidenceId.split("#")[0]}</code>，完整證據鏈見該領域詳情頁。</p>
          </div>
        )}
      </Sheet>
    </>
  );
}

/** 單條證據（分數 → 加權 → 規則 → 命盤因素 → 原文） */
function EvidenceItem({ e, facts }: { e: Evidence; facts: Fact[] }) {
  const [open, setOpen] = useState(false);
  const { prefs } = useApp();
  const factLabel = (k: string) => facts.find(f => f.key === k)?.label ?? k;
  const fmt = (v: unknown) => Array.isArray(v) ? v.join("、") : String(v);
  return (
    <li className="inset p-3 text-[13px] leading-relaxed">
      <button onClick={() => setOpen(o => !o)} className="flex w-full items-start gap-2 text-left" aria-expanded={open}>
        <span className="mt-0.5 shrink-0 rounded bg-[var(--surface-3)] px-1.5 py-0.5 text-[11px] text-[var(--ink-2)]">{SYS[e.system]}・{TIMESCALE_LABEL[e.timescale]}</span>
        <span className="flex-1">{e.text.conclusion}</span>
        <span className="num shrink-0 text-[12px]" style={{ color: e.contribution > 0 ? "var(--sig-pos)" : e.contribution < 0 ? "var(--sig-neg)" : "var(--ink-3)" }}>
          {e.contribution > 0 ? "+" : ""}{e.contribution}
        </span>
      </button>
      {open && (
        <div className="mt-2 space-y-2 border-t border-[var(--line)] pt-2">
          <p>{prefs.displayMode === "pro" ? e.text.pro : e.text.plain}</p>
          <dl className="grid grid-cols-[4.5rem_1fr] gap-x-2 gap-y-1 text-[12px]">
            <dt className="text-[var(--ink-3)]">加權</dt>
            <dd className="num">方向 {e.polarity > 0 ? "+1" : e.polarity < 0 ? "−1" : "0"} × 強度 {e.strength} × 權重 {e.weight} = {e.contribution}
              <span className="block text-[var(--ink-3)]">權重＝時間尺度（{TIMESCALE_LABEL[e.timescale]}）× {SYS[e.system]}在此領域 {W_SYSTEM[e.domain][e.system]}</span></dd>
            <dt className="text-[var(--ink-3)]">規則</dt><dd><code className="break-all">{e.ruleId}</code><span className="block text-[var(--ink-3)]">{e.school}・規則版本 {e.ruleVersion}・{e.verification === "human_verified" ? "已人工校驗" : "未經人工校驗"}</span></dd>
            <dt className="text-[var(--ink-3)]">適用條件</dt><dd>{e.appliesWhen}</dd>
            <dt className="text-[var(--ink-3)]">命理原則</dt><dd>{e.principle}</dd>
            <dt className="text-[var(--ink-3)]">命盤因素</dt>
            <dd><ul className="space-y-0.5">{e.match.matched.map(m => <li key={m.fact}>{factLabel(m.fact)}：<b className="font-medium">{fmt(m.value)}</b><span className="block text-[var(--ink-3)]">{m.derivation}</span></li>)}</ul></dd>
            {e.textIds.length > 0 && <>
              <dt className="text-[var(--ink-3)]">古籍原文</dt>
              <dd className="space-y-1">{e.textIds.map(id => { const t = getSourceText(id); return t ? (
                <p key={id} className="font-serif text-[var(--accent)]">「{t.text}」
                  <span className="block font-sans text-[11px] text-[var(--ink-3)]">《{t.edition.title}》{t.chapter}・{t.edition.edition}・機器匯入未經人工校勘{t.review.length ? `；${t.review.join("；")}` : ""}</span></p>
              ) : null; })}</dd>
            </>}
            {e.textIds.length === 0 && <><dt className="text-[var(--ink-3)]">古籍原文</dt><dd className="text-[var(--ink-3)]">此規則依通行論法，未引用古籍原文（不臆造出處）。</dd></>}
          </dl>
          {e.terms.length > 0 && <p className="text-[12px] text-[var(--ink-3)]">術語：{e.terms.map(t => <Term key={t} term={t} whyToday={e.text.conclusion} inMyChart={e.match.matched.map(m => `${factLabel(m.fact)}：${fmt(m.value)}`).join("；")} />)}</p>}
        </div>
      )}
    </li>
  );
}

export function EvidenceList({ evidence, facts, limit = 12 }: { evidence: Evidence[]; facts: Fact[]; limit?: number }) {
  const [all, setAll] = useState(false);
  const xs = all ? evidence : evidence.slice(0, limit);
  if (!evidence.length) return <p className="text-[13px] text-[var(--ink-3)]">沒有任何規則命中。</p>;
  return (
    <>
      <ol className="space-y-2">{xs.map(e => <EvidenceItem key={e.id} e={e} facts={facts} />)}</ol>
      {evidence.length > limit && !all && <button onClick={() => setAll(true)} className="mt-2 text-[13px] text-[var(--accent)]">顯示全部 {evidence.length} 條</button>}
    </>
  );
}

export function ScoreHeader({ score, confidence, children }: { score: number; confidence: 1 | 2 | 3 | 4 | 5; children?: ReactNode }) {
  const b = bandOf(score);
  return (
    <div className={`band-${b.key}`}>
      <div className="flex items-baseline gap-2">
        <span className="num text-[44px] font-light leading-none" style={{ color: "var(--tone)" }}>{score}</span>
        <span className="text-[15px]" style={{ color: "var(--tone)" }}>{b.label}</span>
        <span className="ml-auto"><Stars n={b.stars} /></span>
      </div>
      <div className="mt-2"><ConfidenceDots level={confidence} /></div>
      {children}
    </div>
  );
}

/** 熱度格 */
export function HeatCell({ score, label }: { score: number; label?: string }) {
  const b = bandOf(score);
  return (
    <span className={`band-${b.key} num flex h-7 items-center justify-center rounded text-[11px]`}
      style={{ background: "color-mix(in srgb, var(--tone) 30%, transparent)", color: "var(--ink-1)" }} title={`${label ?? ""}${score}（${b.label}）`}>{score}</span>
  );
}
