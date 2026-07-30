"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { computeQimen, PALACE_DIR, type QimenChart } from "@/engines/qimen";
import { qimenNotes } from "@/ai/chart-notes";
import { NotesPanel } from "@/components/fortune/NotesPanel";

const GRID = [4,9,2, 3,5,7, 8,1,6]; // 九宮排列（上南下北亦可，這裡採文王卦序顯示）

export default function QimenPage() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("12:00");
  const [c, setC] = useState<QimenChart | null>(null);

  useEffect(() => {
    const now = new Date();
    setDate(`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`);
    setTime(`${String(now.getHours()).padStart(2,"0")}:00`);
  }, []);

  const run = () => {
    if (!date || !time) return;
    const [y, m, d] = date.split("-").map(Number);
    try { setC(computeQimen(y, m, d, time)); } catch { setC(null); }
  };

  const cls = "rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm";
  return (
    <main className="mx-auto max-w-md px-5 pb-16 pt-10">
      <Link href="/" className="text-sm text-[var(--ink-dim)]">← 返回</Link>
      <h1 className="mt-3 text-2xl font-semibold">奇門遁甲</h1>
      <div className="mt-4 flex gap-2">
        <input type="date" className={cls + " flex-1"} value={date} onChange={e => e.target.value && setDate(e.target.value)} />
        <input type="time" className={cls} value={time} onChange={e => setTime(e.target.value)} />
        <button onClick={run} className="rounded-lg bg-[var(--gold)] px-4 text-sm font-medium text-black">起局</button>
      </div>

      {c && (
        <>
          <p className="mt-4 text-sm">
            {c.term}・{c.yang ? "陽" : "陰"}遁{c.ju}局（{c.yuan}）　日 {c.dayGz}　時 {c.hourGz}
          </p>
          <p className="text-xs text-[var(--ink-dim)]">值符 {c.zhiFuStar}・值使 {c.zhiShiDoor}・時空亡 {c.kong.join("")}</p>
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {GRID.map(pal => (
              <div key={pal} className={`rounded-lg border p-2 text-center ${pal === c.dayStemPalace ? "border-[var(--gold)]" : "border-white/10"} bg-[var(--panel)]`}>
                <p className="text-[10px] text-[var(--ink-dim)]">{PALACE_DIR[pal]}宮</p>
                <p className="text-xs mt-1">{c.godsP[pal]}</p>
                <p className="text-sm">{c.starsP[pal]}</p>
                <p className="text-sm text-[var(--gold)]">{c.doors[pal]}</p>
                <p className="text-xs">{c.sky[pal]}<span className="text-[var(--ink-dim)]">/{c.ground[pal]}</span></p>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-xl border border-white/10 bg-[var(--panel)] p-4 text-sm">
            <p>吉方：<span className="text-[var(--jade)]">{c.goodDirs.join("、") || "本時辰無明顯吉方"}</span></p>
            <p className="mt-1">慎往：<span className="text-[var(--vermilion)]">{c.badDirs.join("、") || "無明顯凶方"}</span></p>
            {c.patterns.length > 0 && (
              <p className="mt-2 text-xs text-[var(--ink-dim)]">
                格局：{c.patterns.map(p => `${PALACE_DIR[p.palace]}宮${p.name}(${p.level})`).join("、")}
              </p>
            )}
          </div>
          <NotesPanel notes={qimenNotes(c)} disclaimer="奇門起局正確，轉盤與格局為簡化版；以上釋義僅供方位與大方向參考，非絕對吉凶。" />
          <p className="mt-3 text-[11px] text-[var(--ink-dim)]">時家轉盤・拆補法。格局判讀為簡化版，持續校正中。</p>
        </>
      )}
    </main>
  );
}
