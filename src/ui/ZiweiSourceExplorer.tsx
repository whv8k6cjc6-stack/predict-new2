"use client";
/** 紫微來源瀏覽器（Source Explorer）、判讀完成度（Completion Dashboard）、規則瀏覽、待處理分類、古典／軟體亮度差異、來源修正紀錄。
 *  驗證狀態一律寫「原始掃描影像雙重核讀」（兩輪獨立 AI 目視轉錄＋差異回影像決議），不稱「學術人工校勘完成」。
 *  不打包 PDF：影像範圍以頁面示意圖＋座標呈現；本地有 PDF 時可用 scripts/ziwei-scan-crops.py 依座標重新裁切。 */
import { useMemo, useState } from "react";
import { ruleUsability, PENDING_REASON_LABEL } from "@/core/ziwei/interp/engine";
import { LAYER_LABEL } from "@/core/ziwei/interp/contexts";
import type { BoundingRegion, ClassicalCitation } from "@/core/ziwei/interp/citation";
import { ADVICE_TOPICS } from "@/kb/advice/topics";
import { ZIWEI_CITATIONS } from "@/kb/ziwei/sources";
import { ZIWEI_INTERPRETATION_RULES, ZIWEI_PATTERN_CANDIDATES, ZIWEI_PATTERN_RULES } from "@/kb/ziwei/interpretationRules";
import { GUANGYI_PAGES, SUPPLEMENT_BASE } from "@/kb/ziwei/texts/pages";
import { GY_BRIGHTNESS_CONFLICTS } from "@/kb/ziwei/v2";
import { completion, pendingItems, PENDING_CATEGORY_LABEL, type PendingCategory } from "@/kb/ziwei/v2/completion";
import { SPAN_RECHECKS } from "@/kb/ziwei/sources";
import corrections from "@/data/classics/ziwei/quanshu-guangyi/corrections.json";
import { factorDef } from "@/core/advice/factors";

export const VERIFY_LABEL = "原始掃描影像雙重核讀";
const verifyText = (c: ClassicalCitation) =>
  c.verification?.visualDoubleChecked ? `${VERIFY_LABEL}（兩輪獨立目視轉錄＋差異回影像決議；非學術人工校勘）`
    : c.verification?.secondSourceVerified && !c.uncertainGlyphs?.length ? "原始掃描影像目視轉錄＋第二來源逐字佐證（兩輪讀法不一處，採與電子全文相同的一輪；非學術人工校勘）"
    : c.uncertainGlyphs?.length ? `含疑字 ${c.uncertainGlyphs.join("")}：不啟用` : "尚未完成雙重核讀：不啟用";

/** 頁面示意圖：半頁（葉）上標出引用所在的欄組範圍 */
export function RegionSketch({ region, half, label }: { region?: BoundingRegion; half: "right" | "left"; label?: string }) {
  if (!region) return null;
  const x0 = half === "right" ? 0.5 : 0, x = (v: number) => ((v - x0) / 0.5) * 100;
  return (
    <svg viewBox="0 0 100 140" className="h-28 w-20 shrink-0 rounded border border-[var(--line)] bg-[var(--surface-2)]" role="img" aria-label={`PDF 頁面上的位置：${label ?? ""}`}>
      <rect x="4" y="5" width="92" height="130" fill="none" stroke="currentColor" strokeOpacity=".25" />
      <rect x={Math.max(0, x(region.x0))} y={region.y0 * 140} width={Math.max(2, x(region.x1) - x(region.x0))} height={(region.y1 - region.y0) * 140} fill="var(--accent)" fillOpacity=".35" />
    </svg>
  );
}

export function CitationBlock({ c }: { c: ClassicalCitation }) {
  const leafId = c.locator?.spanId.split(":")[0] ?? "";
  const half = leafId.endsWith("L") ? "left" : "right";
  const r = c.locator?.boundingRegion;
  return (
    <div className="inset flex gap-3 p-2 text-[12px]">
      <RegionSketch region={r} half={half} label={c.locator?.spanId} />
      <div className="min-w-0">
        <p>《紫微斗數全書》{c.edition}・{c.volume ?? ""}・{c.section ?? ""}{c.entry ? `・${c.entry}` : ""}</p>
        <p className="text-[11px] text-[var(--ink-3)]">PDF 第 {c.locator?.pdfPage} 頁{c.locator?.printedPage != null ? `（版心 ${c.locator.printedPage}）` : ""}・{half === "right" ? "右" : "左"}半頁・欄組 {c.locator?.spanId}
          {r ? `・影像範圍 x ${r.x0.toFixed(3)}–${r.x1.toFixed(3)}、y ${r.y0.toFixed(2)}–${r.y1.toFixed(2)}` : ""}</p>
        <p className="mt-1 font-serif text-[14px] leading-relaxed">{c.originalText}</p>
        {c.modernTranslation && <p className="mt-1">白話：{c.modernTranslation}</p>}
        <p className="mt-1 text-[11px] text-[var(--ink-3)]">驗證：{verifyText(c)}・人工校勘：否・第二來源逐字核對：否{c.notes ? `・${c.notes}` : ""}</p>
      </div>
    </div>
  );
}

/** 紫微判讀完成度 */
export function CompletionDashboard() {
  const s = useMemo(() => completion(), []);
  const Cell = ({ k, v, note }: { k: string; v: string | number; note?: string }) => (
    <div className="inset p-2"><p className="text-[11px] text-[var(--ink-3)]">{k}</p><p className="num text-[18px]">{v}</p>{note && <p className="text-[11px] text-[var(--ink-3)]">{note}</p>}</div>
  );
  return (
    <section className="card p-4 text-[13px]" aria-label="紫微判讀完成度" data-testid="ziwei-completion">
      <p className="mb-2 font-medium">紫微判讀完成度</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Cell k="已轉錄 PDF 頁" v={s.source.pdfPages} note={`${s.source.leaves} 個半頁、${s.source.strips} 欄組（含補轉錄 ${s.source.supplementStrips}）`} />
        <Cell k={`欄組${VERIFY_LABEL}`} v={`${s.source.doubleCheckedStrips}/${s.source.strips}`} note={`仍存疑 ${s.source.uncertainGlyphs} 處・第二來源佐證 ${s.source.secondSourceGlyphs} 字`} />
        <Cell k="引用（可作規則依據）" v={`${s.citations.usable}/${s.citations.total}`} note={`含疑字 ${s.citations.withUncertain}・人工校勘 0・第二來源佐證 ${s.citations.secondSourceVerified}`} />
        <Cell k="判讀規則（可用）" v={`${s.rules.usable}/${s.rules.total}`} note={`產生生活因素 ${s.rules.withFactors}`} />
        <Cell k="本命／大限／流年" v={`${s.rules.natal}／${s.rules.decade}／${s.rules.annual}`} note={`判讀原則 ${s.rules.principles}（不單獨觸發）`} />
        <Cell k="格局" v={`${s.patterns.enabled}/${s.patterns.rules}`} note={`候選（不啟用）${s.patterns.candidates}`} />
        <Cell k="古典廟旺" v={s.brightness.doubleChecked} note={`與軟體亮度不同 ${s.brightness.conflicts}（不改排盤）`} />
        <Cell k="舊 35 段複核" v={`${(s.spanRecheck.identical ?? 0) + (s.spanRecheck.identicalAfterResolution ?? 0)}/${s.spanRecheck.total}`} note={`不一致 ${s.spanRecheck.differs ?? 0}・找不到 ${s.spanRecheck.notFound ?? 0}`} />
      </div>
      <p className="mt-2 text-[12px]">紫微狀態：{s.status.status === "pending" ? "未啟用" : s.status.status === "partial" ? `部分啟用（${s.status.coveredTopics.map(t => ADVICE_TOPICS[t].label).join("、")}）` : "全面啟用"}・紫微計分：{s.scoring === "pending" ? "停用（pending）" : s.scoring}</p>
      <p className="mt-1 text-[12px]">待處理 {s.pending.total} 項：{Object.entries(s.pending.byCategory).map(([k, v]) => `${PENDING_CATEGORY_LABEL[k as PendingCategory] ?? k} ${v}`).join("；")}</p>
    </section>
  );
}

/** 來源瀏覽：選卷、選半頁，看每個欄組的文字、驗證狀態、影像範圍，以及這一頁被哪些引用使用 */
export function SourceExplorer() {
  const leaves = GUANGYI_PAGES.leaves;
  const [leaf, setLeaf] = useState(leaves.find(l => l.leaf === "26R")?.leaf ?? leaves[0].leaf);
  const [q, setQ] = useState("");
  const L = leaves.find(l => l.leaf === leaf)!;
  const cits = ZIWEI_CITATIONS.filter(c => c.locator?.spanId.startsWith(`${leaf}:`));
  const hits = q.trim().length >= 2 ? ZIWEI_CITATIONS.filter(c => (c.originalText ?? "").includes(q.trim()) || (c.section ?? "").includes(q.trim())).slice(0, 30) : [];
  const vols = [...new Set(leaves.map(l => l.volume))];
  return (
    <section className="card min-w-0 p-4 text-[13px] [overflow-wrap:anywhere]" aria-label="來源瀏覽" data-testid="ziwei-source-explorer">
      <p className="mb-1 font-medium">來源瀏覽（《紫微斗數全書》廣益版 PDF）</p>
      <p className="mb-2 text-[12px] text-[var(--ink-3)]">每個半頁由右到左分成欄組；綠色＝{VERIFY_LABEL}，黃色＝仍有疑字。書縫區與切邊直行另有補轉錄欄組（編號 90 以上）。PDF 原檔不放入 App。</p>
      {vols.map(v => (
        <div key={v} className="mb-1 flex flex-wrap items-center gap-1">
          <span className="w-10 text-[11px] text-[var(--ink-3)]">{v}</span>
          {leaves.filter(l => l.volume === v).map(l => (
            <button key={l.leaf} type="button" onClick={() => setLeaf(l.leaf)} aria-pressed={leaf === l.leaf}
              className={`rounded px-1.5 text-[11px] ${leaf === l.leaf ? "bg-[var(--accent)] text-white" : "bg-[var(--surface-3)]"}`}>p{l.pdfPage}{l.half === "right" ? "右" : "左"}</button>
          ))}
        </div>
      ))}
      <div className="mt-2 inset p-2">
        <p className="font-medium">{L.volume}・PDF 第 {L.pdfPage} 頁{L.half === "right" ? "右" : "左"}半（版心 {L.printedPage}）</p>
        <ol className="mt-1 space-y-1">{L.strips.filter(s => s.columns.join("")).map(s => (
          <li key={s.strip} className="flex gap-2">
            <span className={`mt-0.5 inline-block h-3 w-3 shrink-0 rounded-sm ${s.verification.visualDoubleChecked ? "bg-emerald-500" : "bg-amber-400"}`} aria-label={s.verification.visualDoubleChecked ? VERIFY_LABEL : "有疑字"} />
            <span className="w-14 shrink-0 text-[11px] text-[var(--ink-3)]">{s.strip >= SUPPLEMENT_BASE ? `補${s.strip}` : `欄組${s.strip}`}</span>
            <span className="font-serif text-[13px]">{s.columns.join("｜")}</span>
          </li>
        ))}</ol>
      </div>
      <details className="mt-3 text-[12px]">
        <summary className="cursor-pointer font-medium">這一頁被引用的片段（{cits.length}）</summary>
        <div className="mt-1 space-y-1">{cits.slice(0, 60).map(c => <CitationBlock key={c.citationId} c={c} />)}</div>
      </details>
      <label className="mt-3 block text-[12px]">搜尋引用原文或篇名
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="例：化權、財帛、太陰入廟" className="mt-1 w-full rounded border border-[var(--line)] bg-[var(--surface-2)] px-2 py-1" />
      </label>
      {hits.length > 0 && <div className="mt-1 space-y-1">{hits.slice(0, 10).map(c => <CitationBlock key={c.citationId} c={c} />)}{hits.length > 10 && <p className="text-[11px] text-[var(--ink-3)]">另有 {hits.length - 10} 筆，請輸入更精確的字詞。</p>}</div>}
    </section>
  );
}

/** 判讀規則瀏覽（900+ 條，依篇別與狀態篩選、分頁） */
export function RuleBrowser() {
  const GROUPS: [string, (id: string) => boolean][] = [
    ["十四主星（卷二）", id => /^GY_(ZIWEI|TIANJI|TAIYANG|WUQU|TIANTONG|LIANZHEN|TIANFU|TAIYIN|TANLANG|JUMEN|TIANXIANG|TIANLIANG|QISHA|POJUN)_/.test(id) || id.startsWith("ZW_STAR_")],
    ["輔煞四化（卷二）", id => /^GY_(WEN|ZUO|YOU|LU|KUI|QING|TUO|HUO|LING|DI|JIE|SHANG|TIANMA|HUA|SUI|DOU)/.test(id)],
    ["十二宮（卷三）", id => id.startsWith("GY_P_")], ["格局（卷一）", id => id.startsWith("GY_PAT_")],
    ["總則與運限", id => id.startsWith("GY_R_")], ["諸星同位垣", id => id.startsWith("GY_A_")],
  ];
  const [g, setG] = useState(0); const [only, setOnly] = useState<"all" | "usable" | "pending">("usable"); const [page, setPage] = useState(0);
  const list = ZIWEI_INTERPRETATION_RULES.filter(r => GROUPS[g][1](r.ruleId)).filter(r => only === "all" || (only === "usable") === ruleUsability(r).usable);
  const P = 25, shown = list.slice(page * P, page * P + P);
  return (
    <section className="card min-w-0 p-4 text-[13px] [overflow-wrap:anywhere]" aria-label="判讀規則" data-testid="ziwei-rule-browser">
      <p className="mb-2 font-medium">判讀規則（共 {ZIWEI_INTERPRETATION_RULES.length} 條）</p>
      <div className="flex flex-wrap gap-1">{GROUPS.map(([n], i) => (
        <button key={n} type="button" onClick={() => { setG(i); setPage(0); }} aria-pressed={g === i} className={`rounded-full px-2 text-[12px] ${g === i ? "bg-[var(--accent)] text-white" : "bg-[var(--surface-3)]"}`}>{n}</button>
      ))}</div>
      <div className="mt-1 flex gap-1 text-[12px]">{(["usable", "pending", "all"] as const).map(k => (
        <button key={k} type="button" onClick={() => { setOnly(k); setPage(0); }} aria-pressed={only === k} className={`rounded px-2 ${only === k ? "bg-[var(--ink-2)] text-white" : "bg-[var(--surface-3)]"}`}>{k === "usable" ? "可用" : k === "pending" ? "未啟用" : "全部"}</button>
      ))}<span className="ml-2 text-[var(--ink-3)]">{list.length} 條</span></div>
      <ul className="mt-2 space-y-1">{shown.map(r => {
        const u = ruleUsability(r); const c = ZIWEI_CITATIONS.find(x => x.citationId === r.citations[0]);
        return (
          <li key={r.ruleId} className="inset p-2">
            <p>{r.title}<span className="ml-1 text-[11px] text-[var(--ink-3)]"><code>{r.ruleId}</code>・{LAYER_LABEL[r.timeLayer]}・{u.usable ? "可用" : u.reason}</span></p>
            {c && <p className="font-serif text-[13px]">「{c.originalText}」<span className="font-sans text-[11px] text-[var(--ink-3)]">PDF p{c.locator?.pdfPage}</span></p>}
            <p className="text-[11px] text-[var(--ink-3)]">古典原則：{r.classicalPrinciple ?? "—"}｜現代語義：{r.modernSemantic ?? "—"}{r.lifeFactors.length ? `｜生活因素：${r.lifeFactors.map(l => factorDef(l.factorId).label).join("、")}` : ""}</p>
          </li>
        );
      })}</ul>
      <div className="mt-2 flex gap-2 text-[12px]">
        <button type="button" disabled={page === 0} onClick={() => setPage(p => p - 1)} className="rounded bg-[var(--surface-3)] px-2 disabled:opacity-40">上一頁</button>
        <span>{page + 1}／{Math.max(1, Math.ceil(list.length / P))}</span>
        <button type="button" disabled={(page + 1) * P >= list.length} onClick={() => setPage(p => p + 1)} className="rounded bg-[var(--surface-3)] px-2 disabled:opacity-40">下一頁</button>
      </div>
    </section>
  );
}

/** 待處理（依原因分類）、格局候選、亮度差異、舊段落複核、來源修正紀錄 */
export function PendingAndAudit() {
  const items = useMemo(() => pendingItems(), []);
  const cats = [...new Set(items.map(i => i.category))];
  return (
    <section className="card min-w-0 p-4 text-[12px] [overflow-wrap:anywhere]" aria-label="待處理與稽核" data-testid="ziwei-pending">
      <p className="mb-1 text-[13px] font-medium">待處理（{items.length} 項，全部有具體原因，不會被啟用）</p>
      {cats.map(cat => {
        const xs = items.filter(i => i.category === cat);
        return (
          <details key={cat} className="mt-1">
            <summary className="cursor-pointer">{PENDING_CATEGORY_LABEL[cat] ?? PENDING_REASON_LABEL[cat] ?? cat}（{xs.length}）</summary>
            <ul className="ml-3 mt-1 space-y-0.5">{xs.slice(0, 200).map(i => <li key={`${i.origin}-${i.id}`}>・{i.section}{i.pdfPage ? `（PDF p${i.pdfPage}）` : ""}：{i.detail}<span className="text-[11px] text-[var(--ink-3)]"> <code>{i.id}</code></span></li>)}</ul>
          </details>
        );
      })}
      <p className="mb-1 mt-3 text-[13px] font-medium">格局：{ZIWEI_PATTERN_RULES.length} 條規則（{ZIWEI_PATTERN_RULES.filter(p => p.enabled).length} 條啟用）、{ZIWEI_PATTERN_CANDIDATES.length} 條候選</p>
      <details><summary className="cursor-pointer">格局候選（只有名稱、條件不足或需要排盤擴充）</summary>
        <ul className="ml-3 mt-1 space-y-0.5">{ZIWEI_PATTERN_CANDIDATES.map(p => <li key={p.patternId}>・{p.group}・{p.name}：{p.note}</li>)}</ul>
      </details>
      <p className="mb-1 mt-3 text-[13px] font-medium">古典廟旺與軟體亮度不同（{GY_BRIGHTNESS_CONFLICTS.length} 處；只影響判讀條件，不改客觀排盤）</p>
      <table className="w-full text-center"><thead><tr className="text-[var(--ink-3)]"><th className="font-normal">星</th><th className="font-normal">地支</th><th className="font-normal">《全書》</th><th className="font-normal">iztro</th></tr></thead>
        <tbody>{GY_BRIGHTNESS_CONFLICTS.map(c => <tr key={c.star + c.palaceBranch}><td>{c.star}</td><td>{c.palaceBranch}</td><td>{c.classicalValue}</td><td>{c.softwareValue}</td></tr>)}</tbody></table>
      <p className="mb-1 mt-3 text-[13px] font-medium">舊版 35 段單次轉錄的第二次核讀</p>
      <ul className="space-y-0.5">{SPAN_RECHECKS.filter(r => r.result !== "identical").map(r => <li key={r.spanId}>・{r.spanId}（PDF p{r.pdfPage}）：{r.result === "notFound" ? "第二次核讀頁面中找不到逐字相同片段" : r.result === "differs" ? "位置相同但仍有疑字" : "疑字已決議"}・{r.note}</li>)}
        <li>・其餘 {SPAN_RECHECKS.filter(r => r.result === "identical").length} 段：兩次轉錄逐字相同。</li></ul>
      <p className="mb-1 mt-3 text-[13px] font-medium">來源修正紀錄（SourceCorrectionLog）</p>
      <ul className="space-y-1">{corrections.corrections.map(c => (
        <li key={c.correctionId}>・{c.correctionId}：{c.previousSource}說「{c.previousClaim}」→ 改為「{c.correctedClaim}」（PDF p{c.sourcePage}；依據：{c.confirmedBy.join("、")}）</li>
      ))}</ul>
    </section>
  );
}
