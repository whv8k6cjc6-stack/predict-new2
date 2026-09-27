"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "../providers";
import { analyze, SYSTEM_LABEL } from "@/core/analysis";
import { DOMAINS, domainOf, type DomainKey } from "@/core/domains";
import { TIMESCALE_LABEL, type Level } from "@/kb/weights";
import { Banner, Chip, SectionTitle } from "@/ui/primitives";
import { Busy, DivergenceNote, EvidenceList, HourTimeline, ScoreHeader, SystemVerdicts } from "@/ui/analysis";
import { BackButton } from "@/ui/PageBack";
import { ModeToggle, Term } from "@/ui/interpret";
import { NoPersonBanner } from "@/ui/Scales";
import { dateTitle, deviceTimeZone, todayIn, useComputed, useNatal } from "@/ui/useAnalysis";
import { ScoringNote } from "@/ui/ZiweiSystem";
import { legacyZiweiScoring } from "@/kb/rules/ziwei";
import { adviseDay, dayWordOf, HORIZON_LABEL, type Horizon } from "@/core/advice";
import { DOMAIN_TOPIC } from "@/kb/advice/topics";
import { TodayFocus } from "@/ui/Advice";

export default function DomainPage() { return <Suspense><DomainDetail /></Suspense>; }

const LEVEL_LABEL: Record<Level, string> = { day: "當日", month: "流月", year: "流年", decade: "大運" };

function DomainDetail() {
  const params = useSearchParams();
  const { active, prefs } = useApp();
  const [tz, setTz] = useState<string | null>(null);
  useEffect(() => setTz(deviceTimeZone()), []);
  const { natal, key } = useNatal(active);
  const d = (params.get("d") ?? "overall") as DomainKey;
  const level = (params.get("level") ?? "day") as Level;
  const date = params.get("date") ?? (tz ? todayIn(tz) : null);
  const { data: a, busy } = useComputed(natal && key && tz && date ? `${level === "day" ? "day" : `lvl-${level}`}|${key}|${date}|${tz}` : null, () => analyze(natal!, date!, tz!, level));
  // 開發者模式：另算一份含 legacy 紫微計分的結果，只作比較，不作為正式分數
  const legacy = useComputed(prefs.developerMode && natal && key && tz && date ? `legacy|${level}|${key}|${date}|${tz}` : null, () => analyze(natal!, date!, tz!, level, { hours: false, legacyZiwei: true }));
  const topic = DOMAIN_TOPIC[d];
  const dayWord = date && tz ? dayWordOf(date, todayIn(tz)) : "今天";
  const adv = useComputed(natal && key && tz && date ? `advice|${key}|${date}|${tz}|${topic}|${dayWord}` : null, () => adviseDay(natal!, date!, tz!, [topic], dayWord).byTopic[topic]!);
  const LEVEL_HORIZON: Record<Level, Horizon> = { day: "today", month: "thisMonth", year: "thisYear", decade: "longTerm" };
  const def = domainOf(d);
  const r = a?.domains[d];
  const [tab, setTab] = useState<"all" | "pos" | "neg">("all");

  return (
    <main className="safe-top mx-auto max-w-lg px-4">
      <div className="flex items-center justify-between"><BackButton /><ModeToggle /></div>
      <h1 className="font-serif mt-4 text-[24px] font-semibold">{def.label}<span className="ml-2 text-[14px] font-normal text-[var(--ink-3)]">{date ? `${dateTitle(date)}・${LEVEL_LABEL[level]}` : ""}</span></h1>
      <p className="mt-1 text-[12px] leading-relaxed text-[var(--ink-3)]">涵蓋：{def.scope.join("、")}{def.notScope ? `；不含：${def.notScope.join("、")}` : ""}</p>
      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
        {DOMAINS.map(x => <a key={x.key} className="shrink-0" href={`/domain/?d=${x.key}&date=${date ?? ""}&level=${level}`}><Chip active={x.key === d}>{x.label}</Chip></a>)}
      </div>
      <div className="mt-4">
        {!active ? <NoPersonBanner /> : busy || !r || !a ? <Busy /> : (
          <>
            <section className="card p-5">
              <ScoreHeader score={r.score} confidence={r.confidence} />
              <p className="font-serif mt-3 text-[18px] leading-snug">{prefs.displayMode === "pro" || !adv.data ? r.interp.oneLine : adv.data.headline}</p>
              <DivergenceNote d={r.divergence} />
            </section>

            <SectionTitle>具體建議</SectionTitle>
            {!adv.data ? <Busy label="整理建議中…" /> : level === "day" ? (
              <TodayFocus a={adv.data} detailHref={`/advice/?topic=${topic}&date=${date}`} />
            ) : (() => {
              const h = adv.data.otherHorizons.find(x => x.horizon === LEVEL_HORIZON[level]);
              return (
                <div className="card p-4 text-[15px] leading-relaxed">
                  {h ? (
                    <>
                      <p>{h.headline}</p>
                      <ul className="mt-2 space-y-2">{[...h.doNow, ...h.avoidNow].map(it => <li key={it.id} className="flex gap-2"><span aria-hidden style={{ color: it.kind === "do" ? "var(--sig-pos)" : "var(--sig-neg)" }}>{it.kind === "do" ? "✓" : "✕"}</span><span>{it.kind === "avoid" ? `避免${it.text}` : it.text}</span></li>)}</ul>
                    </>
                  ) : <p className="text-[var(--ink-3)]">{HORIZON_LABEL[LEVEL_HORIZON[level]]}沒有需要特別調整的做法。</p>}
                  <a href={`/advice/?topic=${topic}&date=${date}`} className="mt-2 inline-block text-[14px] text-[var(--accent)]">查看詳細判斷 →</a>
                </div>
              );
            })()}

            <SectionTitle>命理白話說明</SectionTitle>
            <details className="card p-4 text-[15px] leading-relaxed" open={prefs.displayMode === "pro"}>
              <summary className="cursor-pointer text-[13px] text-[var(--accent)]">展開各系統的判讀說明</summary>
              <div className="mt-2 space-y-2">{r.interp.plain.map((t, i) => <p key={i}>{t}</p>)}</div>
            </details>

            <SectionTitle right={prefs.displayMode === "plain" ? "切到「專業」可預設展開" : undefined}>專業分析</SectionTitle>
            <details className="card p-4 text-[14px] leading-relaxed" open={prefs.displayMode === "pro"}>
              <summary className="cursor-pointer text-[13px] text-[var(--accent)]">展開命盤依據</summary>
              <div className="mt-2 space-y-1.5 text-[var(--ink-2)]">{r.interp.pro.map((t, i) => <p key={i}>{t}</p>)}</div>
            </details>


            {level === "day" && (r.bestHours.length > 0 || r.avoidHours.length > 0) && (
              <>
                <SectionTitle>時段</SectionTitle>
                <div className="card p-4 text-[14px] leading-relaxed">
                  <p><span className="text-[var(--sig-pos)]">較佳時段</span>　{r.bestHours.join("、") || "無特別突出"}</p>
                  <p><span className="text-[var(--sig-neg)]">避開時段</span>　{r.avoidHours.join("、") || "無特別需避開"}</p>
                  {a.hours && <div className="mt-3"><HourTimeline hours={a.hours} domain={d} /></div>}
                </div>
              </>
            )}

            <SectionTitle right={<Term term="確定度" />}>交叉判讀</SectionTitle>
            <div className="card space-y-3 p-4"><SystemVerdicts signals={r.signals} /><ScoringNote s={a.scoring} /></div>

            {prefs.developerMode && (
              <>
                <SectionTitle right="開發者模式・非正式結果">Legacy 紫微計分比較</SectionTitle>
                <div className="card space-y-2 border-dashed p-4 text-[13px]">
                  {legacy.busy || !legacy.data ? <p className="text-[var(--ink-3)]">計算中…</p> : (() => {
                    const L = legacy.data.domains[d];
                    const zw = L.evidence.filter(e => e.legacy);
                    return (
                      <>
                        <p className="num">正式分數 <b>{r.score}</b>　｜　加入 legacy 紫微計分後 <b>{L.score}</b>（差 {L.score - r.score >= 0 ? "+" : ""}{L.score - r.score}）</p>
                        <p className="text-[12px] text-[var(--ink-3)]">legacy 紫微證據 {zw.length} 條、raw 合計 {Math.round(zw.reduce((x, e) => x + e.contribution, 0) * 100) / 100}。已停用原因：{legacyZiweiScoring.reason}</p>
                        <EvidenceList evidence={zw} facts={legacy.data.facts} limit={5} />
                      </>
                    );
                  })()}
                </div>
              </>
            )}

            <SectionTitle right={`${r.evidence.length} 條`}>判斷依據（證據鏈）</SectionTitle>
            <div className="card p-4">
              <div className="mb-3 space-y-1 text-[12px] leading-relaxed text-[var(--ink-3)]">
                {d === "overall" ? (
                  <p className="num">綜合指數 {r.score}＝各領域分數加權平均 {a.overall.domainAvg} × 0.75 ＋「整體」專屬規則分數 {a.overall.parts.find(p => p.domain === "overall")?.z} × 0.25。本頁列出的是「整體」專屬規則。</p>
                ) : (
                  <p className="num">分數 {r.score} ＝ 50 + 50 × tanh((raw {r.raw} − 基準 {r.baseline}) ÷ K {r.k})；raw＝前景 {r.foreground} ＋ 長期背景 {r.background.effective}（原始 {r.background.sum}，上限 ±{r.background.cap}）。</p>
                )}
                <p>點每一條可展開：加權計算 → 規則 → 命盤因素 → 古籍原文。</p>
              </div>
              <div className="mb-3 flex gap-2">
                <Chip active={tab === "all"} onClick={() => setTab("all")}>全部</Chip>
                <Chip active={tab === "pos"} onClick={() => setTab("pos")}>有利 {r.positives.length}</Chip>
                <Chip active={tab === "neg"} onClick={() => setTab("neg")}>不利 {r.negatives.length}</Chip>
              </div>
              <EvidenceList evidence={tab === "pos" ? r.positives : tab === "neg" ? r.negatives : r.evidence} facts={a.facts} />
            </div>

            {a.unavailable.length > 0 && <div className="mt-4"><Banner tone="warn" title="未納入的系統">{a.unavailable.map(u => `${SYSTEM_LABEL[u.system as keyof typeof SYSTEM_LABEL]}：${u.reason}`).join(" ")}</Banner></div>}
            <p className="mt-4 text-[11px] text-[var(--ink-3)]">時間尺度：{Object.values(TIMESCALE_LABEL).join("、")}；長期（本命、大運、流年）只作背景並設上限。</p>
          </>
        )}
      </div>
    </main>
  );
}
