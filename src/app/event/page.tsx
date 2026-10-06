"use client";
import { useEffect, useState } from "react";
import { useApp } from "../providers";
import { analyzeEvent, findEventTimes } from "@/core/analysis";
import { EVENT_TYPES, eventTypeOf } from "@/core/events";
import { Banner, Button, Chip, Field, PageHeader, SectionTitle, Toggle } from "@/ui/primitives";
import { Busy, DivergenceNote, EvidenceList, ScoreChip, ScoreHeader, SystemVerdicts } from "@/ui/analysis";
import { PersonSwitcher } from "@/ui/Nav";
import { ScoringNote } from "@/ui/ZiweiSystem";
import { AdviceDetail, TodayFocus } from "@/ui/Advice";
import { NoPersonBanner } from "@/ui/Scales";
import { dateTitle, deviceTimeZone, todayIn, useComputed, useNatal, weekday } from "@/ui/useAnalysis";
import { PLACES } from "@/kb/places";

export default function EventPage() {
  const { active, prefs } = useApp();
  const [tz, setTz] = useState<string | null>(null);
  const [type, setType] = useState("work");
  const [date, setDate] = useState("");
  const [auto, setAuto] = useState(true);
  const [time, setTime] = useState("10:00");
  const [req, setReq] = useState<{ type: string; date: string; time: string | null } | null>(null);
  const [findDays, setFindDays] = useState<number | null>(null);
  const [tst, setTst] = useState(true);
  const birthPlace = active?.birth.place;
  const [placeName, setPlaceName] = useState<string | null>(null);
  const place = PLACES.find(p => p.name === (placeName ?? birthPlace?.name)) ?? (birthPlace ? { name: birthPlace.name, lng: birthPlace.lng } : PLACES[0]);
  useEffect(() => { const z = deviceTimeZone(); setTz(z); setDate(todayIn(z)); }, []);
  const { natal, key } = useNatal(active);
  const tsOpt = tst ? { trueSolar: { longitude: place.lng, placeName: place.name } } : {};
  const ev = useComputed(req && natal && key && tz ? `event|${key}|${req.type}|${req.date}|${req.time}|${tz}|${tst ? place.lng : "std"}` : null, () => analyzeEvent(natal!, req!.type, req!.date, req!.time, tz!, tsOpt));
  const find = useComputed(findDays && natal && key && tz ? `find|${key}|${type}|${date}|${findDays}|${tz}` : null, () => findEventTimes(natal!, type, date, findDays!, tz!, 6));
  const t = eventTypeOf(type);
  const e = ev.data;

  return (
    <main className="safe-top mx-auto max-w-lg px-4">
      <PageHeader title="擇時・事件分析" subtitle="我要做一件事：這天適不適合？什麼時段較好？" right={<PersonSwitcher />} />
      {!active ? <NoPersonBanner /> : (
        <>
          <div className="card space-y-4 p-4">
            <div>
              <p className="mb-1.5 text-[13px] text-[var(--ink-2)]">事件類型</p>
              <div className="flex flex-wrap gap-2">{EVENT_TYPES.map(x => <Chip key={x.key} active={type === x.key} onClick={() => { setType(x.key); setFindDays(null); }}>{x.label}</Chip>)}</div>
              <p className="mt-1.5 text-[12px] text-[var(--ink-3)]">{t.hint}</p>
            </div>
            <Field label="日期"><input type="date" className="input" value={date} onChange={x => { setDate(x.target.value); setFindDays(null); }} /></Field>
            <Toggle checked={auto} onChange={setAuto} label="幫我挑當天最佳時辰" desc="關閉後可指定確切時間" />
            {!auto && <Field label="時間"><input type="time" className="input" value={time} onChange={x => setTime(x.target.value)} /></Field>}
            {!auto && (
              <div className="space-y-2" data-testid="event-tst">
                <Toggle checked={tst} onChange={setTst} label="用真太陽時判斷時辰" desc="時鐘時間和太陽實際位置最多差十幾分鐘；接近時辰交界時，會影響排到哪一個時辰" />
                {tst && <Field label="所在地"><select className="input" value={place.name} onChange={x => setPlaceName(x.target.value)}>
                  {!PLACES.some(p => p.name === place.name) && <option value={place.name}>{place.name}</option>}
                  {PLACES.map(p => <option key={p.name} value={p.name}>{p.region}・{p.name}</option>)}
                </select></Field>}
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="primary" disabled={!date} onClick={() => { setReq({ type, date, time: auto ? null : time }); setFindDays(null); }}>分析這一天</Button>
              <Button disabled={!date} onClick={() => { setFindDays(14); setReq(null); }}>幫我找時間</Button>
            </div>
          </div>

          {findDays && (
            <>
              <SectionTitle right={`${date.slice(5).replace("-", "/")} 起 ${findDays} 天`}>較適合「{t.label}」的時段</SectionTitle>
              {find.busy || !find.data ? <Busy label="逐日逐時辰計算中…" /> : (
                <ul className="card divide-y divide-[var(--line)] px-4">
                  {find.data.map(s => (
                    <li key={s.date + s.time}>
                      <button className="flex w-full items-center gap-3 py-3 text-left" onClick={() => { setDate(s.date); setAuto(false); setTime(s.time); setReq({ type, date: s.date, time: s.time }); setFindDays(null); }}>
                        <ScoreChip score={s.score} />
                        <span className="min-w-0 flex-1">
                          <span className="num block text-[15px]">{s.date.slice(5).replace("-", "/")} {weekday(s.date)}・{s.hour}</span>
                          <span className="block truncate text-[12px] text-[var(--ink-3)]">{s.top}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {req && (ev.busy || !e ? <div className="mt-4"><Busy /></div> : (
            <>
              <SectionTitle>{dateTitle(e.date)} {e.type.label}</SectionTitle>
              <TodayFocus a={e.advice} detailHref="#event-advice" />
              <SectionTitle right="分數代表命理因素的方向與強度">事件指數</SectionTitle>
              <section className="card p-5">
                <ScoreHeader score={e.result.score} confidence={e.result.confidence}>
                  <p className="mt-2 text-[13px] text-[var(--ink-3)]">時間：{e.time}{e.chosenBy === "best" ? "（系統挑選的當日最佳時辰）" : ""}</p>
                  {e.timeNote && <p className="mt-0.5 text-[12px] text-[var(--ink-3)]" data-testid="event-time-note">{e.timeNote}</p>}
                </ScoreHeader>
                <p className="font-serif mt-3 text-[17px] leading-snug">{e.interp.oneLine}</p>
                <DivergenceNote d={e.result.divergence} />
                <div className="mt-3"><ScoringNote s={e.scoring} /></div>
              </section>
              <details className="mt-3" open={prefs.displayMode === "pro"}>
              <summary className="cursor-pointer text-[13px] text-[var(--accent)]">命理判讀摘要（主要優勢與風險）</summary>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <div className="card p-4"><p className="mb-1 text-[13px] text-[var(--sig-pos)]">主要優勢</p><ul className="space-y-1 text-[14px] leading-relaxed">{e.strengths.length ? e.strengths.map((s, i) => <li key={i}>・{s}</li>) : <li className="text-[var(--ink-3)]">沒有明顯的有利因素</li>}</ul></div>
                <div className="card p-4"><p className="mb-1 text-[13px] text-[var(--sig-neg)]">主要風險</p><ul className="space-y-1 text-[14px] leading-relaxed">{e.risks.length ? e.risks.map((s, i) => <li key={i}>・{s}</li>) : <li className="text-[var(--ink-3)]">沒有明顯的不利因素</li>}</ul></div>
              </div>
              </details>
              <SectionTitle>時段</SectionTitle>
              <div className="card p-4 text-[14px] leading-relaxed">
                <p><span className="text-[var(--sig-pos)]">較佳時段</span>　{e.bestHours.join("、") || "當日各時辰差異不大"}</p>
                <p><span className="text-[var(--sig-neg)]">避開時段</span>　{e.avoidHours.join("、") || "無特別需避開"}</p>
                <div className="mt-3 grid grid-cols-4 gap-1.5">
                  {e.slots.map(s => (
                    <button key={s.time} onClick={() => { setAuto(false); setTime(s.time); setReq({ type, date: e.date, time: s.time }); }} className={`flex flex-col items-center rounded-lg p-1.5 ${s.time === e.time ? "ring-1 ring-[var(--accent)]" : ""}`}>
                      <span className="text-[11px] text-[var(--ink-3)]">{s.hour.slice(0, 2)}</span><ScoreChip score={s.score} size="sm" />
                    </button>
                  ))}
                </div>
              </div>
              <SectionTitle>具體建議與判斷依據</SectionTitle>
              <div id="event-advice"><AdviceDetail a={e.advice} /></div>
              {e.reading && (
                <>
                  <SectionTitle right="梅花易數・以事件時刻起卦">事件卦</SectionTitle>
                  <div className="card p-4">
                    <p className="font-serif text-[17px]">{e.reading.main.symbol} {e.reading.main.full} 之 {e.reading.changed.full}</p>
                    <p className="text-[13px] text-[var(--ink-2)]">{e.reading.movingLabel}・{e.reading.relation}（結果：{e.reading.outcome}）</p>
                    <p className="font-serif mt-1 text-[15px] text-[var(--accent)]">「{e.reading.yao.text}」</p>
                  </div>
                </>
              )}
              <SectionTitle>交叉判讀</SectionTitle>
              <div className="card p-4"><SystemVerdicts signals={e.result.signals} /></div>
              <SectionTitle right={`${e.result.evidence.length} 條`}>證據鏈</SectionTitle>
              <div className="card p-4"><EvidenceList evidence={e.result.evidence} facts={e.facts} /></div>
              {t.key === "medical" && <div className="mt-4"><Banner tone="warn" title="醫療提醒">命理分析只供安排時間參考；是否就醫、治療方式請以醫師專業判斷為準。</Banner></div>}
              {t.key === "investment" && <div className="mt-4"><Banner title="投資提醒">分數反映命理因素，不是市場預測；投資決定仍應依你的資金規劃與停損紀律。</Banner></div>}
            </>
          ))}
        </>
      )}
    </main>
  );
}
