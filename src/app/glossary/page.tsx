"use client";
import { useMemo, useState } from "react";
import { GLOSSARY } from "@/kb/glossary";
import Link from "next/link";
import { SOURCE_EDITIONS } from "@/kb/sources";
import { Chip, Icon, PageHeader, SectionTitle } from "@/ui/primitives";
import { BandLegend } from "@/ui/score";

export default function GlossaryPage() {
  const [q, setQ] = useState("");
  const [sec, setSec] = useState("全部");
  const sections = useMemo(() => ["全部", ...new Set(GLOSSARY.map(g => g.section))], []);
  const list = GLOSSARY.filter(g => (sec === "全部" || g.section === sec) && (!q || g.term.includes(q) || g.plain.includes(q) || g.pro.includes(q)));

  return (
    <main className="safe-top mx-auto max-w-lg px-4">
      <PageHeader title="名詞辭典" subtitle="每個術語的專業定義與白話解釋" />
      <div className="relative">
        <Icon name="search" size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-3)]" />
        <input className="input pl-10" placeholder="搜尋：七殺、化忌、生門、伏吟…" value={q} onChange={e => setQ(e.target.value)} aria-label="搜尋術語" />
      </div>
      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
        {sections.map(s => <Chip key={s} active={sec === s} onClick={() => setSec(s)}>{s}</Chip>)}
      </div>

      <ul className="mt-4 space-y-2">
        {list.map(g => (
          <li key={g.section + g.term} className="card p-4">
            <div className="flex items-baseline justify-between gap-2">
              <p className="font-serif text-[18px] font-semibold text-[var(--accent)]">{g.term}</p>
              <span className="text-[11px] text-[var(--ink-3)]">{g.section}</span>
            </div>
            <p className="mt-1 text-[14px] leading-relaxed">{g.plain}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-[var(--ink-3)]">專業定義：{g.pro}</p>
          </li>
        ))}
        {!list.length && <li className="py-10 text-center text-[14px] text-[var(--ink-3)]">找不到「{q}」</li>}
      </ul>

      {(sec === "全部" || sec === "評分") && !q && (
        <>
          <SectionTitle>分數區間定義</SectionTitle>
          <BandLegend />
        </>
      )}

      {sec === "全部" && !q && (
        <>
          <SectionTitle>古籍來源（版本管理）</SectionTitle>
          <ul className="space-y-2">
            {SOURCE_EDITIONS.map(s => (
              <li key={s.source_id} className="card p-4 text-[13px]">
                <p className="font-serif text-[16px]">《{s.title}》{s.annotator && <span className="text-[var(--ink-2)]">　{s.annotator} 注</span>}</p>
                <p className="mt-1 text-[var(--ink-3)]">{s.edition}・來源：{s.origin}・{s.license}</p>
                <p className="mt-1 text-[var(--accent)]">狀態：{s.status === "planned" ? "已登記，尚未匯入原文；相關規則只列原則" : s.status === "imported" ? "已匯入（附勘誤表），待人工逐字校勘" : "已校驗"}</p>
              </li>
            ))}
          </ul>
          <p className="mt-2 px-1 text-[12px] leading-relaxed text-[var(--ink-3)]">古籍原文、注解、程式規則分三層保存；機器匯入的原文一律標示「未經人工校勘」。</p>
          <Link href="/sources/" className="mt-2 inline-block px-1 text-[14px] text-[var(--accent)]">勘誤表、規則庫與計分權重 →</Link>
        </>
      )}
    </main>
  );
}
