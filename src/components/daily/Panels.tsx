"use client";
import { useState } from "react";
import type { DailyReport, HourFortune } from "@/types/daily";
import { GRADES, gradeOf } from "@/engines/daily/grade";
import { TRIGRAMS, TIYONG_INFO, LINE_POSITION } from "@/engines/iching";
import { GradeBadge, Stars, TermChip, toneClass } from "./ui";

/** 十二時辰：單一數列長條，顏色表等級、每格附地支文字 */
export function HourStrip({ hours, currentIdx }: { hours: HourFortune[]; currentIdx: number | null }) {
  const [sel, setSel] = useState<number>(currentIdx ?? 6);
  const h = hours[sel];
  return (
    <div className="card p-4">
      <div className="flex h-28 items-end gap-[3px]" role="list" aria-label="十二時辰運勢">
        {hours.map((x, i) => (
          <button key={x.branch} role="listitem" onClick={() => setSel(i)}
            aria-label={`${x.branch}時 ${x.range} ${x.score} 分 ${x.grade.name}`}
            className={`${toneClass(x.grade)} group relative flex h-full flex-1 flex-col items-center justify-end`}>
            {x.isNoble && <span className="absolute top-0 text-[9px] text-[var(--g-great)]">貴</span>}
            <span className="w-full rounded-t-[4px] transition-opacity"
              style={{ height: `${Math.max(8, x.score * 0.78)}%`, background: "var(--tone)", opacity: sel === i ? 1 : 0.55 }} />
            <span className={`mt-1 text-[11px] ${sel === i ? "font-semibold text-[var(--ink)]" : "text-[var(--ink-dim)]"}`}>{x.branch}</span>
            {currentIdx === i && <span className="absolute -bottom-2 h-1 w-1 rounded-full bg-[var(--ink)]" aria-label="現在" />}
          </button>
        ))}
      </div>
      <div className={`${toneClass(h.grade)} mt-4 flex items-center justify-between rounded-xl bg-white/[0.04] px-3 py-2.5`}>
        <div>
          <p className="text-sm"><span className="font-serif-tc font-semibold">{h.branch}時</span>　<span className="text-[var(--ink-dim)]">{h.range}</span>{currentIdx === sel && <span className="ml-1 text-[11px] text-[var(--gold)]">・現在</span>}</p>
          <p className="mt-0.5 text-[12px] text-[var(--ink-2)]">{h.note}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-light tabular-nums">{h.score}</span>
          <GradeBadge g={h.grade} small />
        </div>
      </div>
    </div>
  );
}

/** 七日趨勢：單一數列，只標註選取日的數值 */
export function TrendBars({ days, selected, onPick }: { days: { date: string; label: string; score: number }[]; selected: string; onPick: (d: string) => void }) {
  return (
    <div className="card p-4">
      <div className="flex h-32 items-end gap-2">
        {days.map(d => {
          const g = gradeOf(d.score); const on = d.date === selected;
          return (
            <button key={d.date} onClick={() => onPick(d.date)} aria-label={`${d.label} ${d.score} 分 ${g.name}`}
              className={`${toneClass(g)} flex h-full flex-1 flex-col items-center justify-end`}>
              <span className={`mb-1 text-[11px] tabular-nums ${on ? "text-[var(--ink)]" : "text-transparent"}`}>{d.score}</span>
              <span className="w-full max-w-7 rounded-t-[4px]" style={{ height: `${Math.max(6, d.score * 0.8)}%`, background: "var(--tone)", opacity: on ? 1 : 0.5 }} />
              <span className={`mt-1.5 text-[11px] ${on ? "font-semibold text-[var(--ink)]" : "text-[var(--ink-dim)]"}`}>{d.label}</span>
              <span className={`text-[10px] ${on ? "" : "opacity-60"}`} style={{ color: "var(--tone)" }}>{g.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function LuckyPanel({ r }: { r: DailyReport }) {
  const L = r.lucky;
  const tile = "rounded-2xl bg-white/[0.04] p-3";
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className={tile}>
        <p className="text-[11px] text-[var(--ink-dim)]">幸運色</p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="h-6 w-6 rounded-full border border-white/20" style={{ background: L.colorHex }} />
          <span className="text-sm">{L.color}</span>
        </div>
        <p className="mt-1 text-[10px] text-[var(--ink-dim)]">取你的喜用「{L.element}」</p>
      </div>
      <div className={tile}>
        <p className="text-[11px] text-[var(--ink-dim)]">幸運數字</p>
        <p className="mt-1 text-2xl font-light tabular-nums">{L.numbers.join("・")}</p>
        <p className="text-[10px] text-[var(--ink-dim)]">河圖五行數</p>
      </div>
      <div className={tile}>
        <p className="text-[11px] text-[var(--ink-dim)]">吉方</p>
        <p className="font-serif-tc mt-1 text-2xl">{L.direction}</p>
        <p className="text-[10px] text-[var(--ink-dim)]">奇門白天吉方</p>
      </div>
      <div className={tile}>
        <p className="text-[11px] text-[var(--ink-dim)]">貴人生肖</p>
        <p className="font-serif-tc mt-1 text-2xl">{L.nobleZodiac.join("、")}</p>
        <p className="text-[10px] text-[var(--ink-dim)]">天乙貴人方</p>
      </div>
      <div className={`${tile} col-span-2 flex items-center justify-between`}>
        <p className="text-[11px] text-[var(--ink-dim)]">今日吉時</p>
        <p className="text-sm">{L.hours.join("　")}</p>
      </div>
    </div>
  );
}

function HexLines({ lines, moving, dim }: { lines: number[]; moving?: number; dim?: boolean }) {
  return (
    <div className="flex w-16 flex-col-reverse gap-[5px]" aria-hidden>
      {lines.map((v, i) => {
        const mv = moving === i + 1;
        const color = mv ? "var(--g-great)" : dim ? "rgba(255,255,255,0.35)" : "var(--ink)";
        return v ? (
          <span key={i} className="h-[7px] rounded-sm" style={{ background: color }} />
        ) : (
          <span key={i} className="flex h-[7px] justify-between">
            <span className="w-[44%] rounded-sm" style={{ background: color }} />
            <span className="w-[44%] rounded-sm" style={{ background: color }} />
          </span>
        );
      })}
    </div>
  );
}

export function HexagramCard({ r }: { r: DailyReport }) {
  const [basis, setBasis] = useState(false);
  const h = r.hexagram;
  const ty = TIYONG_INFO[h.relation];
  const oc = TIYONG_INFO[h.outcomeRelation];
  return (
    <div className="card p-4">
      <div className="flex items-center gap-4">
        <HexLines lines={h.mainLines} moving={h.movingLine} />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-[var(--ink-dim)]">第 {h.main.no} 卦・{TRIGRAMS[h.main.upper].nature}{TRIGRAMS[h.main.lower].nature}</p>
          <p className="font-serif-tc text-2xl font-semibold">{h.main.name}</p>
          <p className="mt-0.5 text-[12px] text-[var(--gold)]">關鍵字：{h.main.keyword}</p>
        </div>
      </div>
      <blockquote className="font-serif-tc mt-4 rounded-xl border-l-2 border-[var(--gold)] bg-[var(--gold)]/[0.06] px-3 py-2 text-[15px] leading-relaxed text-[var(--gold)]">
        卦辭：{h.main.judgment}
      </blockquote>
      <p className="mt-3 text-[14px] leading-relaxed">{h.main.plain}</p>
      <p className="mt-1 text-[14px] leading-relaxed text-[var(--ink-2)]">→ {h.main.advice}</p>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {[{ t: "本卦", s: "現況", x: h.main, l: h.mainLines, mv: h.movingLine }, { t: "互卦", s: "過程", x: h.mutual, l: [h.mainLines[1], h.mainLines[2], h.mainLines[3], h.mainLines[2], h.mainLines[3], h.mainLines[4]] }, { t: "變卦", s: "結果", x: h.changed, l: h.changedLines }].map(k => (
          <div key={k.t} className="flex flex-col items-center rounded-xl bg-white/[0.04] p-2.5">
            <p className="mb-2 text-[11px] text-[var(--ink-dim)]"><TermChip term={k.t} />　{k.s}</p>
            <div className="scale-75"><HexLines lines={k.l} moving={k.mv} dim={k.t !== "本卦"} /></div>
            <p className="font-serif-tc mt-1 text-[13px]">{k.x.name}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl bg-white/[0.04] p-3 text-[13px] leading-relaxed">
        <div className="flex flex-wrap items-center gap-1.5">
          <TermChip term="體用生剋" />
          <span>體卦{h.ti.name}（{h.ti.element}）・用卦{h.yong.name}（{h.yong.element}）</span>
        </div>
        <p className="mt-2"><span className="font-medium text-[var(--gold)]">{h.relation}（{ty.label}）</span>：{ty.plain}</p>
        <p className="mt-1.5 text-[var(--ink-2)]">動在<TermChip term="動爻" fallback={LINE_POSITION[h.movingLine].plain} />{LINE_POSITION[h.movingLine].name}：{LINE_POSITION[h.movingLine].plain}</p>
        <p className="mt-1.5 text-[var(--ink-2)]">結果（變卦）為「{h.outcomeRelation}」：{oc.label === "大吉" || oc.label === "吉" ? "事情最後傾向圓滿。" : oc.label === "小吉" ? "結果可成，但要自己出力。" : "結果容易打折，見好就收。"}</p>
      </div>
      <button onClick={() => setBasis(!basis)} className="mt-3 text-[12px] text-[var(--ink-dim)] underline decoration-dotted underline-offset-4">
        {basis ? "收起起卦方式" : "這個卦怎麼算出來的？"}
      </button>
      {basis && <p className="mt-2 text-[12px] leading-relaxed text-[var(--ink-2)]"><TermChip term="梅花易數" /> {r.hexagramBasis}</p>}
    </div>
  );
}

export function DitiansuiCard({ r }: { r: DailyReport }) {
  const d = r.ditiansui;
  const hits = r.evidences.filter(e => e.system === "滴天髓");
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2">
        <span className="font-serif-tc flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gold)]/10 text-xl text-[var(--gold)]">{d.stem}</span>
        <div>
          <p className="text-[11px] text-[var(--ink-dim)]">你的日主　{r.dayMaster}・{d.season}季生{d.tiaohou ? `・調候喜${d.tiaohou}` : ""}</p>
          <p className="text-sm"><TermChip term="滴天髓" />　{d.stem}干論</p>
        </div>
      </div>
      <p className="font-serif-tc mt-3 text-[15px] leading-[1.9] tracking-wide text-[var(--gold)]">{d.verse}</p>
      <p className="mt-2 text-[13px] leading-relaxed text-[var(--ink-2)]">白話：{d.plain}</p>
      <div className="mt-3 border-t border-white/[0.06] pt-3">
        <p className="text-[12px] text-[var(--ink-dim)]">今天對應到的原文</p>
        {hits.length ? (
          <ul className="mt-2 space-y-2">
            {hits.map(e => (
              <li key={e.id} className="text-[13px] leading-relaxed">
                <span className="font-serif-tc text-[var(--gold)]">「{e.quote && e.quote.length > 12 ? "天道有寒暖…" : e.quote}」</span> {e.plain}
              </li>
            ))}
          </ul>
        ) : <p className="mt-2 text-[13px] text-[var(--ink-2)]">今天的干支沒有特別觸動你日主的原文條件，屬平常之日，以八字喜忌為主要參考。</p>}
      </div>
    </div>
  );
}

export function GradeLegend() {
  const [open, setOpen] = useState(false);
  return (
    <div className="card p-4">
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between">
        <span className="font-serif-tc text-base font-semibold">運勢評分等級說明</span>
        <span className="text-[12px] text-[var(--ink-dim)]">{open ? "收起" : "展開"}</span>
      </button>
      {!open && (
        <div className="mt-3 flex gap-1">
          {GRADES.map(g => (
            <span key={g.name} className={`${toneClass(g)} flex-1 rounded-md py-1 text-center text-[11px]`} style={{ color: "var(--tone)", background: "color-mix(in srgb, var(--tone) 14%, transparent)" }}>{g.name}</span>
          ))}
        </div>
      )}
      {open && (
        <ul className="mt-3 space-y-2">
          {GRADES.map((g, i) => (
            <li key={g.name} className={`${toneClass(g)} rounded-xl bg-white/[0.03] p-3`}>
              <div className="flex items-center gap-2">
                <GradeBadge g={g} />
                <Stars n={g.stars} />
                <span className="ml-auto text-[12px] tabular-nums text-[var(--ink-dim)]">{g.min}–{i === 0 ? 100 : GRADES[i - 1].min - 1} 分</span>
              </div>
              <p className="mt-1.5 text-[13px]">{g.meaning}</p>
              <p className="text-[12px] text-[var(--ink-2)]">建議心態：{g.attitude}</p>
            </li>
          ))}
          <li className="px-1 pt-1 text-[11px] leading-relaxed text-[var(--ink-dim)]">
            分數由八字、滴天髓、神煞、紫微、奇門、易經六套系統的每一條依據加減分合成，50 分為中性。分數反映「傾向」而非必然，凶日不代表會出事，只是提醒放慢腳步。
          </li>
        </ul>
      )}
    </div>
  );
}
