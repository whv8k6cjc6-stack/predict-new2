"use client";
/** 真太陽時資訊：記錄時間（Source of Truth）、時區、真太陽時、校正、實際排盤時間與跨時辰警告。 */
import { useMemo } from "react";
import type { BirthProfile } from "@/core/person";
import { fmtParts } from "@/core/calendar/resolve";
import { auditDifferences, computeSolarTimeAudit, solarTimeView } from "@/core/calendar/solarTime";

const BR = "子丑寅卯辰巳午未申酉戌亥";
const hb = (h: number) => BR[Math.floor(((h + 1) % 24) / 2)];
const fmtOff = (min: number) => `UTC${min >= 0 ? "+" : "−"}${Math.floor(Math.abs(min) / 60)}${Math.abs(min) % 60 ? `:${String(Math.abs(min) % 60).padStart(2, "0")}` : ""}`;
const signed = (m: number) => `${m > 0 ? "+" : m < 0 ? "−" : "±"}${Math.abs(m)} 分鐘`;

export function SolarTimePanel({ birth, previousUseTrueSolarTime, showAuditDiff }: { birth: BirthProfile; previousUseTrueSolarTime?: boolean; showAuditDiff?: boolean }) {
  const v = useMemo(() => { try { return solarTimeView(birth); } catch { return null; } }, [birth]);
  const diffs = useMemo(() => showAuditDiff ? auditDifferences(birth.solarTimeAudit, (() => { try { return computeSolarTimeAudit(birth, ""); } catch { return undefined; } })()) : [], [birth, showAuditDiff]);
  if (!v) return null;
  const s = v.standard.chartLocal, t = v.trueSolar.chartLocal, applied = v.applied.chartLocal;
  const changedByToggle = previousUseTrueSolarTime !== undefined && previousUseTrueSolarTime !== birth.useTrueSolarTime && v.crossesHourBoundary;
  return (
    <div className="space-y-2">
      <dl className="inset grid grid-cols-[6.5rem_1fr] gap-x-2 gap-y-1 px-3 py-2 text-[13px]">
        <dt className="text-[var(--ink-3)]">記錄出生時間</dt><dd className="num">{birth.localDate} {birth.localTime}（{hb(s.h)}時）</dd>
        <dt className="text-[var(--ink-3)]">時區</dt><dd className="num">{fmtOff(v.applied.civil.offsetMinutes)}{v.applied.civil.isDST ? "（夏令時間）" : ""}</dd>
        <dt className="text-[var(--ink-3)]">真太陽時</dt><dd className="num">{fmtParts(t).slice(11)}（{hb(t.h)}時）{v.crossesDate ? `，日期 ${fmtParts(t).slice(0, 10)}` : ""}</dd>
        <dt className="text-[var(--ink-3)]">校正</dt><dd className="num">{signed(v.correctionMinutes)}（經度 {v.trueSolar.corrections.longitudeMinutes.toFixed(1)}、均時差 {v.trueSolar.corrections.eotMinutes.toFixed(1)}{v.trueSolar.corrections.dstMinutes ? `、夏令 ${v.trueSolar.corrections.dstMinutes}` : ""}）</dd>
        <dt className="text-[var(--ink-3)]">實際排盤時間</dt><dd className="num font-medium">{fmtParts(applied)}（{birth.useTrueSolarTime ? "真太陽時" : "標準時間"}，{hb(applied.h)}時）</dd>
      </dl>
      {v.crossesHourBoundary && (
        <p role="alert" className="rounded-xl border border-[var(--danger)]/50 bg-[var(--danger)]/10 px-3 py-2 text-[13px] leading-relaxed text-[var(--danger)]">
          真太陽時校正後跨越時辰界線（{hb(s.h)}時 → {hb(t.h)}時），因此{birth.useTrueSolarTime ? "目前命盤" : "若開啟校正，命盤"}與標準時間排盤不同。
        </p>
      )}
      {changedByToggle && <p role="alert" className="text-[13px] font-medium text-[var(--accent)]">出生時辰已改變，命盤將重新計算。</p>}
      {diffs.length > 0 && (
        <div role="alert" className="rounded-xl border border-[var(--accent)]/50 px-3 py-2 text-[12px] leading-relaxed">
          <p className="text-[var(--accent)]">曆法／真太陽時算法版本變更，舊計算值與目前版本不同（排盤一律使用目前版本重算）：</p>
          <ul>{diffs.map(d => <li key={d}>・{d}</li>)}</ul>
        </div>
      )}
    </div>
  );
}
