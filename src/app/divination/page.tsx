"use client";
import { useState } from "react";
import { castByNumbers, castRandom, verdictOf, type IchingReading } from "@/core/iching";
import { getSourceText } from "@/kb/sources";
import { Banner, Button, Field, PageHeader, SectionTitle } from "@/ui/primitives";
import { Term } from "@/ui/interpret";

const TY_PLAIN: Record<string, string> = {
  用生體: "外在條件主動來幫你，順勢而為。", 比和: "你和所問之事步調一致。", 體克用: "你能掌控，但要自己出力。",
  體生用: "付出多、回收慢，量力而為。", 用克體: "外在形勢壓著你，宜緩不宜急。",
};

export default function DivinationPage() {
  const [q, setQ] = useState("");
  const [a, setA] = useState(""); const [b, setB] = useState("");
  const [r, setR] = useState<IchingReading | null>(null);
  const T = (id: string) => getSourceText(id)?.text ?? "";
  const now = () => { const d = new Date(); return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; };
  return (
    <main className="safe-top mx-auto max-w-lg px-4">
      <PageHeader title="占卜模式" subtitle="針對一件事起卦；與命盤演算法分開" />
      <Banner tone="demo" title="占卜模式・非命盤演算法">
        這裡的起卦不依你的出生資料計算：「隨機起卦」每次結果不同，「報數起卦」依你報的數字與當下時辰。結果只顯示卦象與古籍原文，不產生分數、不存檔。
      </Banner>
      <div className="card mt-4 space-y-3 p-4">
        <Field label="想問的事（只在畫面上，不會儲存）"><input className="input" value={q} onChange={e => setQ(e.target.value)} placeholder="例：下週的簡報要不要換主題" /></Field>
        <Button variant="primary" block onClick={() => setR(castRandom())}>隨機起卦</Button>
        <div className="grid grid-cols-[1fr_1fr_auto] items-end gap-2">
          <Field label="第一個數"><input className="input" inputMode="numeric" value={a} onChange={e => setA(e.target.value.replace(/\D/g, ""))} /></Field>
          <Field label="第二個數"><input className="input" inputMode="numeric" value={b} onChange={e => setB(e.target.value.replace(/\D/g, ""))} /></Field>
          <Button disabled={!a || !b} onClick={() => setR(castByNumbers(Number(a), Number(b), now()))}>報數起卦</Button>
        </div>
      </div>
      {r && (
        <>
          <SectionTitle right={r.deterministic ? "固定演算法" : "隨機"}>{q ? `「${q}」` : "卦象"}</SectionTitle>
          <div className="card space-y-2 p-4 text-[14px] leading-relaxed">
            <p className="font-serif text-[20px]">{r.main.symbol} {r.main.full} <span className="text-[14px] text-[var(--ink-3)]">之 {r.changed.full}（互 {r.mutual.full}）</span></p>
            <p className="text-[12px] text-[var(--ink-3)]">{r.derivation.join("；")}</p>
            <p><Term term="動爻" />{r.movingLabel}：<span className="font-serif text-[var(--accent)]">「{r.yao.text}」</span></p>
            <p><Term term="斷辭" />：{verdictOf(r.yao.text).verdict}</p>
            <p><Term term="體用" />：體{r.ti.name}（{r.ti.element}）、用{r.yong.name}（{r.yong.element}）→ {r.relation}。{TY_PLAIN[r.relation]}</p>
            <p>結果（變卦之用對體）：{r.outcome}。{TY_PLAIN[r.outcome]}</p>
            <p className="text-[13px] text-[var(--ink-2)]"><span className="text-[var(--ink-3)]">本卦卦辭｜</span>{T(r.main.textIds.gua)}</p>
            <p className="text-[13px] text-[var(--ink-2)]"><span className="text-[var(--ink-3)]">變卦卦辭｜</span>{T(r.changed.textIds.gua)}</p>
          </div>
        </>
      )}
    </main>
  );
}
