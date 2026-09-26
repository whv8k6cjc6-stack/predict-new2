"use client";
import { useMemo, useState } from "react";
import { GLOSSARY } from "@/data/glossary";
import { GRADES } from "@/engines/daily/grade";
import { GradeBadge, Stars, toneClass } from "@/components/daily/ui";

export default function GlossaryPage() {
  const [q, setQ] = useState("");
  const [sec, setSec] = useState("全部");
  const sections = useMemo(() => ["全部", ...new Set(GLOSSARY.map(g => g.section))], []);
  const list = GLOSSARY.filter(g => (sec === "全部" || g.section === sec) && (!q || g.term.includes(q) || g.plain.includes(q)));

  return (
    <main className="mx-auto max-w-md px-4 pt-[calc(env(safe-area-inset-top)+20px)]">
      <h1 className="font-serif-tc text-2xl font-semibold">名詞辭典</h1>
      <p className="mt-1 text-[13px] text-[var(--ink-dim)]">運勢報告裡每個專業術語的白話解釋。</p>
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="搜尋：七殺、化忌、驛馬…"
        className="mt-4 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[15px] outline-none focus:border-[var(--gold)]/60" />
      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
        {sections.map(s => (
          <button key={s} onClick={() => setSec(s)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[13px] ${sec === s ? "bg-[var(--gold)] text-black" : "border border-white/10 text-[var(--ink-2)]"}`}>{s}</button>
        ))}
      </div>

      {(sec === "全部" || sec === "評分") && !q && (
        <section className="card mt-4 p-4">
          <p className="font-serif-tc text-base font-semibold">運勢評分等級</p>
          <ul className="mt-2 space-y-2">
            {GRADES.map((g, i) => (
              <li key={g.name} className={`${toneClass(g)} flex items-start gap-2 text-[13px]`}>
                <GradeBadge g={g} small />
                <div className="flex-1"><p>{g.meaning}<span className="text-[var(--ink-dim)]">（{g.min}–{i === 0 ? 100 : GRADES[i - 1].min - 1}）</span></p><p className="text-[12px] text-[var(--ink-2)]">{g.attitude}</p></div>
                <Stars n={g.stars} size={10} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <ul className="mt-4 space-y-2">
        {list.map(g => (
          <li key={g.section + g.term} className="card p-4">
            <div className="flex items-center justify-between">
              <p className="font-serif-tc text-lg font-semibold text-[var(--gold)]">{g.term}</p>
              <span className="text-[11px] text-[var(--ink-dim)]">{g.section}</span>
            </div>
            <p className="mt-1 text-[14px] leading-relaxed">{g.plain}</p>
            {g.detail && <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--ink-2)]">{g.detail}</p>}
          </li>
        ))}
        {!list.length && <li className="py-10 text-center text-sm text-[var(--ink-dim)]">找不到「{q}」，換個關鍵字試試。</li>}
      </ul>
    </main>
  );
}
