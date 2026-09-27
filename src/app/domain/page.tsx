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
              <p className="font-serif mt-3 text-[18px] leading-snug">{r.interp.oneLine}</p>
              <DivergenceNote d={r.divergence} />
            </section>

            <SectionTitle>白話說明</SectionTitle>
            <div className="card space-y-2 p-4 text-[15px] leading-relaxed">{r.interp.plain.map((t, i) => <p key={i}>{t}</p>)}</div>

            <SectionTitle right={prefs.displayMode === "plain" ? "切到「專業」可預設展開" : undefined}>專業分析</SectionTitle>
            <details className="card p-4 text-[14px] leading-relaxed" open={prefs.displayMode === "pro"}>
              <summary className="cursor-pointer text-[13px] text-[var(--accent)]">展開命盤依據</summary>
              <div className="mt-2 space-y-1.5 text-[var(--ink-2)]">{r.interp.pro.map((t, i) => <p key={i}>{t}</p>)}</div>
            </details>

            <SectionTitle>實際建議</SectionTitle>
            <ul className="card space-y-1.5 p-4 text-[15px] leading-relaxed">
              {r.interp.actions.map((t, i) => <li key={i} className="flex gap-2"><span className="text-[var(--accent)]">・</span>{t}</li>)}
            </ul>

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
            <div className="card p-4"><SystemVerdicts signals={r.signals} /></div>

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
