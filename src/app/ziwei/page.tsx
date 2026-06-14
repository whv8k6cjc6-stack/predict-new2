"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getProfiles } from "@/lib/storage/store";
import { computeZiwei, type ZiweiChart, BRANCHES } from "@/engines/ziwei";
import { ziweiNotes } from "@/ai/chart-notes";
import { NotesPanel } from "@/components/fortune/NotesPanel";

// 直式 4×3 排列（巳午未申 / 辰_酉 / 卯_戌 / 寅丑子亥）
const GRID = [5,6,7,8, 4,-1,-2,9, 3,-3,-4,10, 2,1,0,11];

export default function ZiweiPage() {
  const [c, setC] = useState<ZiweiChart | null>(null);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    const p = getProfiles()[0];
    if (!p) { setMsg("尚無命盤，請先至「命盤」建立。"); return; }
    if (!p.birthTime) { setMsg("紫微斗數需要出生時辰。"); return; }
    try { const z = computeZiwei(p); if (z) setC(z); } catch { setMsg("排盤失敗"); }
  }, []);

  return (
    <main className="mx-auto max-w-md px-5 pb-16 pt-10">
      <Link href="/" className="text-sm text-[var(--ink-dim)]">← 返回</Link>
      <h1 className="mt-3 text-2xl font-semibold">紫微斗數</h1>
      {msg && <p className="mt-6 text-sm text-[var(--ink-dim)]">{msg}</p>}
      {c && (
        <>
          <p className="mt-2 text-xs text-[var(--ink-dim)]">
            農曆 {c.lunar.isLeap ? "閏" : ""}{c.lunar.month}月{c.lunar.day}日・{c.juElement}{["","","二","三","四","五","六"][c.ju]}局
          </p>
          <div className="mt-4 grid grid-cols-4 gap-1.5">
            {GRID.map((b, i) => b < 0 ? (
              i === 5 ? (
                <div key={i} className="col-span-2 row-span-2 flex flex-col items-center justify-center rounded-lg border border-white/10 bg-black/20 p-2 text-center" style={{ gridColumn: "2 / span 2", gridRow: "2 / span 2" }}>
                  <p className="text-sm text-[var(--gold)]">命宮在{BRANCHES[c.mingGong]}</p>
                  <p className="mt-1 text-xs text-[var(--ink-dim)]">身宮在{BRANCHES[c.shenGong]}</p>
                  <p className="mt-2 text-[10px] text-[var(--ink-dim)]">生年四化<br/>祿{c.sihua["祿"]} 權{c.sihua["權"]}<br/>科{c.sihua["科"]} 忌{c.sihua["忌"]}</p>
                </div>
              ) : null
            ) : (
              <div key={i} className={`min-h-[88px] rounded-lg border p-1.5 ${b === c.mingGong ? "border-[var(--gold)]" : "border-white/10"} bg-[var(--panel)]`}>
                <p className="text-[10px] text-[var(--ink-dim)]">{BRANCHES[b]}・{c.palaceNames[b]}</p>
                <p className="mt-1 text-[11px] leading-tight">{(c.stars[b] ?? []).map(s => {
                  const huaKey = (Object.keys(c.sihua) as ("祿"|"權"|"科"|"忌")[]).find(k => c.sihua[k] === s);
                  return s + (huaKey ? `(${huaKey})` : "");
                }).join(" ")}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-[var(--ink-dim)]">
            命宮、五行局、紫微定位與 14 主星、左輔右弼昌曲、祿存羊陀、空劫、生年四化均已對照標準口訣驗證。
            火星鈴星採《全書》通行起例、庚干四化採常見一派（太陰科天同忌）；此二者本有學派之別，與你慣用排盤若不同屬正常，重要判讀建議三式合參。
          </p>
          <NotesPanel notes={ziweiNotes(c)} />
        </>
      )}
    </main>
  );
}
