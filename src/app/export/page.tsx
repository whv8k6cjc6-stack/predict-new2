"use client";
/** 批次計算：指定一段日期，逐日算事件指數與較佳、避開時段，匯出成 CSV。 */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../providers";
import { eventDayRow, eventRowsToCsv, csvFileName, weekdayOf, type EventDayRow } from "@/core/analysis";
import { EVENT_TYPES, eventTypeOf } from "@/core/events";
import { Banner, Button, Chip, Field, PageHeader, SectionTitle, Toggle } from "@/ui/primitives";
import { ScoreChip } from "@/ui/analysis";
import { PersonSwitcher } from "@/ui/Nav";
import { NoPersonBanner } from "@/ui/Scales";
import { deviceTimeZone, todayIn, useNatal } from "@/ui/useAnalysis";

const MAX_DAYS = 366;
const PREVIEW = 8;
const addDays = (date: string, k: number) => { const d = new Date(`${date}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + k); return d.toISOString().slice(0, 10); };
const daysBetween = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000) + 1;

export default function ExportPage() {
  const { active } = useApp();
  const { natal } = useNatal(active);
  const [tz, setTz] = useState<string | null>(null);
  const [type, setType] = useState("investment");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [weekdaysOnly, setWeekdaysOnly] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [rows, setRows] = useState<EventDayRow[] | null>(null);
  const [done, setDone] = useState<{ type: string; from: string; to: string; person: string } | null>(null);
  const [canShare, setCanShare] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const run = useRef(0);

  useEffect(() => { const z = deviceTimeZone(); setTz(z); const t = todayIn(z); setFrom(t); setTo(addDays(t, 29)); }, []);
  useEffect(() => { setCanShare(typeof navigator !== "undefined" && typeof navigator.canShare === "function" && navigator.canShare({ files: [new File([""], "a.csv", { type: "text/csv" })] })); }, []);
  // 換人、換事件或換日期後，舊結果作廢
  useEffect(() => { run.current++; setRows(null); setDone(null); setProgress(null); setMsg(null); }, [active?.person.id, type, from, to, weekdaysOnly]);

  const span = from && to ? daysBetween(from, to) : 0;
  const rangeErr = !from || !to ? "請選擇起訖日期" : span < 1 ? "結束日期要在開始日期之後" : span > MAX_DAYS ? `一次最多 ${MAX_DAYS} 天，請縮短區間` : undefined;
  const t = eventTypeOf(type);

  const start = () => {
    if (!natal || !tz || rangeErr || !active) return;
    const id = ++run.current;
    const dates = Array.from({ length: span }, (_, k) => addDays(from, k)).filter(d => !weekdaysOnly || ![0, 6].includes(new Date(`${d}T00:00:00Z`).getUTCDay()));
    const out: EventDayRow[] = [];
    setRows(null); setDone(null); setMsg(null); setProgress({ done: 0, total: dates.length });
    const tick = () => {
      if (run.current !== id) return;
      const t0 = performance.now();
      while (out.length < dates.length && performance.now() - t0 < 40) out.push(eventDayRow(natal, type, dates[out.length], tz));
      setProgress({ done: out.length, total: dates.length });
      if (out.length < dates.length) { setTimeout(tick, 0); return; }
      setRows(out); setDone({ type, from, to, person: active.person.displayName }); setProgress(null);
    };
    setTimeout(tick, 0);
  };
  const cancel = () => { run.current++; setProgress(null); };

  const build = () => {
    if (!rows || !done) return null;
    const meta = { person: done.person, eventLabel: eventTypeOf(done.type).label };
    return { text: eventRowsToCsv(rows, meta), name: csvFileName(done.type, done.from, done.to) };
  };
  const download = () => {
    const f = build(); if (!f) return;
    try {
      const url = URL.createObjectURL(new Blob([f.text], { type: "text/csv;charset=utf-8" }));
      const a = document.createElement("a"); a.href = url; a.download = f.name; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      setMsg(`已產生 ${f.name}。如果沒有看到下載，請改用「分享／存到檔案」。`);
    } catch { setMsg("這個瀏覽器無法直接下載，請改用「分享／存到檔案」或「複製內容」。"); }
  };
  const share = async () => {
    const f = build(); if (!f) return;
    try { await navigator.share({ files: [new File([f.text], f.name, { type: "text/csv" })], title: f.name }); }
    catch (e) { if ((e as Error).name !== "AbortError") setMsg("分享失敗，請改用「下載 CSV」或「複製內容」。"); }
  };
  const copy = async () => {
    const f = build(); if (!f) return;
    try { await navigator.clipboard.writeText(f.text.replace(/^﻿/, "")); setMsg("已複製，可以貼到試算表。"); }
    catch { setMsg("無法複製，請改用「下載 CSV」。"); }
  };

  const avg = rows?.length ? Math.round(rows.reduce((s, r) => s + r.score, 0) / rows.length) : 0;
  const pct = progress && progress.total ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <main className="safe-top mx-auto max-w-lg px-4">
      <PageHeader title="批次計算・匯出" subtitle="指定一段日期，逐日算事件指數與較佳、避開時段" right={<PersonSwitcher />} />
      {!active ? <NoPersonBanner /> : (
        <>
          <div className="card space-y-4 p-4">
            <div>
              <p className="mb-1.5 text-[13px] text-[var(--ink-2)]">事件類型</p>
              <div className="flex flex-wrap gap-2" data-testid="export-types">{EVENT_TYPES.map(x => <Chip key={x.key} active={type === x.key} onClick={() => setType(x.key)}>{x.label}</Chip>)}</div>
              <p className="mt-1.5 text-[12px] text-[var(--ink-3)]">{t.hint}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="開始日期"><input type="date" className="input" value={from} onChange={e => setFrom(e.target.value)} /></Field>
              <Field label="結束日期" error={rangeErr}><input type="date" className="input" value={to} min={from} onChange={e => setTo(e.target.value)} /></Field>
            </div>
            <div className="flex flex-wrap gap-2">
              {[7, 30, 90, 180, 366].map(d => <Chip key={d} active={!!from && to === addDays(from, d - 1)} onClick={() => from && setTo(addDays(from, d - 1))}>{d === 366 ? "1 年" : `${d} 天`}</Chip>)}
            </div>
            <Toggle checked={weekdaysOnly} onChange={setWeekdaysOnly} label="只算週一到週五" desc="股市只在平日開盤；國定假日仍會算入，請自行對照" />
            {progress ? (
              <div className="space-y-2" data-testid="export-progress">
                <div className="h-2 overflow-hidden rounded-full bg-[var(--line)]"><div className="h-full bg-[var(--accent)] transition-all" style={{ width: `${pct}%` }} /></div>
                <p className="text-center text-[13px] text-[var(--ink-3)]">計算中 {progress.done} / {progress.total} 天（{pct}%）</p>
                <Button onClick={cancel}>取消</Button>
              </div>
            ) : (
              <Button variant="primary" disabled={!natal || !!rangeErr} onClick={start}>開始計算（{span > 0 && span <= MAX_DAYS ? `${weekdaysOnly ? "約 " : ""}${span} 天` : "—"}）</Button>
            )}
            {!natal && <p className="text-center text-[12px] text-[var(--ink-3)]">命盤準備中…</p>}
          </div>

          {rows && done && (
            <>
              <SectionTitle right={`${rows.length} 天・平均 ${avg} 分`}>計算完成</SectionTitle>
              {rows.length === 0 ? <Banner title="區間內沒有可計算的日子">請調整日期或取消「只算週一到週五」。</Banner> : (
                <>
                  <div className="card space-y-3 p-4" data-testid="export-done">
                    <p className="text-[14px] leading-relaxed">{done.person}・{eventTypeOf(done.type).label}・{done.from} ～ {done.to}，共 {rows.length} 天。CSV 包含每天的事件指數（當日最佳時辰）、等級、較佳時段、避開時段，以及各時辰分數。</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="primary" onClick={download}>下載 CSV</Button>
                      {canShare ? <Button onClick={share}>分享／存到檔案</Button> : <Button onClick={copy}>複製內容</Button>}
                    </div>
                    {canShare && <button className="block w-full text-center text-[13px] text-[var(--accent)]" onClick={copy}>或複製內容貼到試算表</button>}
                    {msg && <p className="text-[12px] text-[var(--ink-3)]" role="status">{msg}</p>}
                  </div>
                  <SectionTitle right={`前 ${Math.min(PREVIEW, rows.length)} 天預覽`}>內容預覽</SectionTitle>
                  <ul className="card divide-y divide-[var(--line)] px-4" data-testid="export-preview">
                    {rows.slice(0, PREVIEW).map(r => (
                      <li key={r.date} className="flex items-start gap-3 py-3">
                        <ScoreChip score={r.score} />
                        <span className="min-w-0 flex-1 text-[13px] leading-relaxed">
                          <span className="num block text-[15px]">{r.date.slice(5).replace("-", "/")} {weekdayOf(r.date)}・{r.hour}</span>
                          <span className="block text-[var(--sig-pos)]">較佳　<span className="text-[var(--ink-2)]">{r.bestHours.join("、") || "當日各時辰差異不大"}</span></span>
                          <span className="block text-[var(--sig-neg)]">避開　<span className="text-[var(--ink-2)]">{r.avoidHours.join("、") || "無明顯需避開"}</span></span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}
          <p className="mt-4 text-[12px] leading-relaxed text-[var(--ink-3)]">事件指數和「擇時」頁的「分析這一天」相同（每天取最佳時辰的分數）；分數反映命理因素的方向與強度，不是行情預測，投資決定仍以你的資金規劃與紀律為準。</p>
          <p className="mt-4 text-center text-[13px]"><Link href="/event/" className="text-[var(--accent)]">回到單日擇時</Link></p>
        </>
      )}
    </main>
  );
}
