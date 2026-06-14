"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getProfiles } from "@/lib/storage/store";
import { computeBazi, type BaziChart } from "@/engines/bazi";
import { baziNotes } from "@/ai/chart-notes";
import { NotesPanel } from "@/components/fortune/NotesPanel";

export default function BaziPage() {
  const [c, setC] = useState<BaziChart | null>(null);
  useEffect(() => { const p = getProfiles()[0]; if (p) try { setC(computeBazi(p)); } catch {} }, []);

  if (!c) return (
    <main className="mx-auto max-w-md px-5 pt-10">
      <Link href="/" className="text-sm text-[var(--ink-dim)]">← 返回</Link>
      <p className="mt-6 text-sm text-[var(--ink-dim)]">尚無命盤，請先至「命盤」建立。</p>
    </main>
  );

  const P = [
    { t: "年柱", gz: c.pillars.year, tg: c.tenGods.year, hs: c.hiddenStems.year },
    { t: "月柱", gz: c.pillars.month, tg: c.tenGods.month, hs: c.hiddenStems.month },
    { t: "日柱", gz: c.pillars.day, tg: "日主" as const, hs: c.hiddenStems.day },
    { t: "時柱", gz: c.pillars.hour, tg: c.tenGods.hour ?? "—", hs: c.hiddenStems.hour ?? [] },
  ];
  const total = Object.values(c.elementCount).reduce((a, b) => a + b, 0);

  return (
    <main className="mx-auto max-w-md px-5 pb-16 pt-10">
      <Link href="/" className="text-sm text-[var(--ink-dim)]">← 返回</Link>
      <h1 className="mt-3 text-2xl font-semibold">八字</h1>

      <div className="mt-4 grid grid-cols-4 gap-2 text-center">
        {P.map(x => (
          <div key={x.t} className="rounded-xl border border-white/10 bg-[var(--panel)] p-3">
            <p className="text-[10px] text-[var(--ink-dim)]">{x.t}</p>
            <p className="mt-1 text-2xl">{x.gz?.text ?? "—"}</p>
            <p className="mt-1 text-[10px] text-[var(--gold)]">{x.tg}</p>
            <p className="mt-1 text-[10px] text-[var(--ink-dim)]">藏 {x.hs.join("")}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-xl border border-white/10 bg-[var(--panel)] p-4 text-sm">
        <p>日主 <span className="text-[var(--gold)]">{c.dayMaster}{c.dayMasterElement}</span>，強弱 {c.strength}（{c.strengthLabel}）</p>
        <p className="mt-1">喜用：<span className="text-[var(--jade)]">{c.favorable.join("、")}</span>　忌：<span className="text-[var(--vermilion)]">{c.unfavorable.join("、")}</span></p>
        <div className="mt-3 space-y-1">
          {(Object.entries(c.elementCount) as [string, number][]).map(([e, v]) => (
            <div key={e} className="flex items-center gap-2 text-xs">
              <span className="w-4">{e}</span>
              <div className="h-2 flex-1 rounded bg-black/40"><div className="h-2 rounded bg-[var(--gold)]" style={{ width: `${(v / total) * 100}%` }} /></div>
              <span className="w-10 text-right text-[var(--ink-dim)]">{Math.round((v / total) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-white/10 bg-[var(--panel)] p-4">
        <p className="text-xs text-[var(--ink-dim)]">大運（{c.luckForward ? "順排" : "逆排"}）</p>
        <div className="mt-2 grid grid-cols-4 gap-2 text-center text-sm">
          {c.luckCycles.map(l => (
            <div key={l.gz + l.startAge} className="rounded-lg border border-white/10 p-2">
              <p>{l.gz}</p><p className="text-[10px] text-[var(--ink-dim)]">{l.startAge}歲起</p>
            </div>
          ))}
        </div>
      </div>

      <NotesPanel notes={baziNotes(c)} />
    </main>
  );
}
