"use client";
/** 紫微判讀面板（命盤頁）與來源／規則詳情元件。一般模式只顯示白話狀態；專業模式展開判讀語境、規則閘門與引用。 */
import Link from "next/link";
import { useState } from "react";
import type { ZiweiNatal, ZiweiTransit } from "@/core/ziwei";
import { interpretZiwei, ruleUsability, ziweiCoverage, type ZiweiCoverageLevel } from "@/core/ziwei/interp/engine";
import { sanFangContext, LAYER_LABEL } from "@/core/ziwei/interp/contexts";
import type { CitationStatus, ClassicalCitation } from "@/core/ziwei/interp/citation";
import type { ZiweiCondition, ZiweiInterpretationRule } from "@/core/ziwei/interp/rules";
import { MAJOR, PALACES } from "@/core/ziwei/common";
import { ADVICE_TOPICS } from "@/kb/advice/topics";
import { ZIWEI_CITATIONS, ZIWEI_SOURCES, citationOf } from "@/kb/ziwei/sources";
import { PALACE_SEMANTICS, STAR_SEMANTICS } from "@/kb/ziwei/semantics";
import { ZIWEI_INTERPRETATION_RULES, ZIWEI_PATTERN_RULES, ZIWEI_SOURCE_CONFLICTS } from "@/kb/ziwei/interpretationRules";
import { IMPORTED_ZIWEI_TEXTS, GUANGYI_SOURCE, scanSpan } from "@/kb/ziwei/texts/imported";
import { JIWEN_SOURCE } from "@/kb/ziwei/sources";
import { ZIWEI_PENDING } from "@/kb/ziwei/pending";
import { factorDef } from "@/core/advice/factors";
import { useApp } from "@/app/providers";

const ROLE: Record<string, string> = { self: "本宮坐守", opposite: "對宮照會", trine1: "三合宮 A", trine2: "三合宮 B" };
const T_TYPE: Record<string, string> = { birthYear: "生年", decade: "大限", annual: "流年" };
export const STATUS_LABEL: Record<CitationStatus, string> = { verified: "已校驗", partiallyVerified: "部分校驗", pendingVerification: "待校驗", conflictingSources: "來源衝突" };
const LEVEL_LABEL: Record<ZiweiCoverageLevel, string> = { none: "尚無", partial: "部分", dedicated: "專屬" };

export function ZiweiInterpretationPanel({ z, t }: { z: ZiweiNatal; t: ZiweiTransit | null }) {
  const { prefs } = useApp();
  const zi = interpretZiwei(z, t);
  const usable = zi.trace.evaluations.filter(e => e.usable).length;
  const life = sanFangContext(zi.contexts, z, "命宮");
  return (
    <section className="card mt-4 p-4 text-[14px] leading-relaxed" aria-label="紫微判讀">
      <p className="text-[13px] text-[var(--ink-3)]">紫微判讀</p>
      <p className="mt-1">
        {zi.status === "pending"
          ? `紫微判讀引擎建置中：已登錄 ${ZIWEI_INTERPRETATION_RULES.length} 條判讀條目，可用 ${usable} 條，目前不產生紫微判讀，也不影響今日建議。`
          : `紫微判讀部分啟用（依《紫微斗數全書》廣益版已校驗原文）：涵蓋${zi.coveredTopics.map(x => ADVICE_TOPICS[x].label).join("、")}；本盤成立 ${zi.findings.length} 條。其他主題的建議不納入紫微，紫微也不參與計分。`}
      </p>
      {zi.findings.length > 0 && (
        <ul className="mt-2 space-y-2">
          {zi.findings.map(f => (
            <li key={f.ruleId} className="inset p-2 text-[13px]">
              <p>{f.interpretation}</p>
              <p className="text-[11px] text-[var(--ink-3)]">{LAYER_LABEL[f.timeLayer]}・{f.evidence.join("；")}{f.lifeFactors.length ? `・生活因素：${f.lifeFactors.map(l => factorDef(l.factorId).label).join("、")}` : "・只列出，不轉成建議"}</p>
              {prefs.displayMode === "pro" && f.citations.map(c => (
                <p key={c.citationId} className="mt-1 text-[11px] text-[var(--ink-3)]">原文：「{c.originalText}」——《紫微斗數全書》{c.edition}・{c.volume}・{c.section}・PDF 第 {c.locator?.pdfPage} 頁</p>
              ))}
            </li>
          ))}
        </ul>
      )}
      <Link href="/sources/ziwei/" className="mt-2 inline-block text-[13px] text-[var(--accent)]">查看紫微來源與規則狀態 →</Link>

      <details className="mt-3 text-[13px]" open={prefs.displayMode === "pro"}>
        <summary className="cursor-pointer text-[var(--accent)]">判讀語境（客觀資料）</summary>
        <div className="mt-2 space-y-3">
          {life && (
            <div>
              <p className="text-[12px] text-[var(--ink-3)]">命宮三方四正（照會星不等於坐守星）</p>
              <ul className="mt-1 space-y-0.5">{life.members.map(m => (
                <li key={m.branch}><span className="inline-block w-20 text-[var(--ink-2)]">{ROLE[m.relationType]}</span>{m.palaceName}：{m.residentMajor.map(s => `${s.name}${s.brightness}`).join("、") || "無主星"}</li>
              ))}</ul>
            </div>
          )}
          <div>
            <p className="text-[12px] text-[var(--ink-3)]">四化（依來源分開）</p>
            <ul className="mt-1 space-y-0.5">{(["birthYear", "decade", "annual"] as const).map(k => (
              <li key={k}><span className="inline-block w-20 text-[var(--ink-2)]">{T_TYPE[k]}</span>{zi.contexts.transformations[k].map(x => `${x.star}化${x.transformation}${x.natalPalace ? `（${x.natalPalace}）` : ""}`).join("、") || "—"}</li>
            ))}</ul>
          </div>
          <div>
            <p className="text-[12px] text-[var(--ink-3)]">空宮（借對宮只作參考，不設權重）</p>
            <ul className="mt-1 space-y-0.5">{zi.contexts.emptyPalaces.map(e => (
              <li key={e.branch}>{e.natalName}：借{e.borrowedStars[0]?.fromPalace ?? "對宮"}的{e.borrowedStars.map(s => s.name).join("、") || "—"}參考</li>
            ))}</ul>
          </div>
          <div>
            <p className="text-[12px] text-[var(--ink-3)]">運限三層（大限、流年只作修正，不推翻本命）</p>
            <p>本命命宮在{zi.contexts.natal.lifeOnNatal}{zi.contexts.decade ? `；大限命宮在本命${zi.contexts.decade.lifeOnNatal}（${zi.contexts.decade.stem}干）` : ""}{zi.contexts.annual ? `；流年命宮在本命${zi.contexts.annual.lifeOnNatal}（${zi.contexts.annual.stem}干）` : ""}</p>
          </div>
          <div>
            <p className="text-[12px] text-[var(--ink-3)]">判讀過程</p>
            <ul className="mt-1 space-y-0.5">{zi.trace.steps.map(s => <li key={s.step}>・{s.step}：{s.detail}</li>)}</ul>
          </div>
        </div>
      </details>
    </section>
  );
}

/** 來源／規則詳情頁內容 */
export function ZiweiSourcesDetail() {
  const cov = ziweiCoverage();
  return (
    <div className="min-w-0 space-y-4 text-[13px] leading-relaxed [overflow-wrap:anywhere]">
      <section className="card p-4">
        <p className="mb-2 font-medium">來源登錄（依優先級）</p>
        <ul className="space-y-3">{ZIWEI_SOURCES.map(s => (
          <li key={s.sourceId}>
            <p><span className="mr-1 rounded bg-[var(--surface-3)] px-1.5 text-[11px]">Tier {s.tier}</span>《{s.title}》{s.edition ? `（${s.edition}）` : ""}<span className="ml-1 text-[11px] text-[var(--ink-3)]">{s.contentStatus === "imported" ? "已匯入" : s.contentStatus === "notInRepository" ? "原文尚未匯入" : "目前無可用文本"}</span></p>
            <p className="text-[12px] text-[var(--ink-3)]">用途：{s.usage.join("、")}{s.notFor.length ? `；不可作為：${s.notFor.join("、")}` : ""}</p>
            <p className="text-[12px] text-[var(--ink-3)]">{s.notes}</p>
          </li>
        ))}</ul>
        <p className="mt-2 text-[12px] text-[var(--ink-3)]">已匯入原文：{IMPORTED_ZIWEI_TEXTS.length ? IMPORTED_ZIWEI_TEXTS.map(t => `${t.sourceId}（${t.edition}，${t.sections.length} 段已校驗，PDF SHA-256 ${t.sha256.slice(0, 12)}…）`).join("、") : "無"}。</p>
      </section>

      <CitationExplorer />
      <SecondaryAndPending />

      <section className="card p-4">
        <p className="mb-2 font-medium">主題覆蓋矩陣</p>
        <table className="w-full text-center text-[12px]">
          <thead><tr className="text-[var(--ink-3)]"><th className="text-left font-normal">主題</th><th className="font-normal">覆蓋</th><th className="font-normal">規則</th><th className="font-normal">已校驗</th><th className="font-normal">待校驗</th></tr></thead>
          <tbody>{cov.map(c => <tr key={c.topic} className="num"><td className="text-left">{ADVICE_TOPICS[c.topic].label}</td><td>{LEVEL_LABEL[c.level]}</td><td>{c.ruleCount}</td><td>{c.verifiedRuleCount}</td><td>{c.pendingRuleCount}</td></tr>)}</tbody>
        </table>
        <p className="mt-2 text-[12px] text-[var(--ink-3)]">紫微只在覆蓋為「部分」或「專屬」的主題參與建議；「尚無」的主題不納入紫微。覆蓋由可用規則自動計算，紫微不參與計分。</p>
      </section>

      <section className="card p-4">
        <p className="mb-2 font-medium">判讀規則（{ZIWEI_INTERPRETATION_RULES.length} 條）</p>
        <ul className="space-y-2">{ZIWEI_INTERPRETATION_RULES.map(r => {
          const u = ruleUsability(r);
          return (
            <li key={r.ruleId} className="inset p-2">
              <p>{r.title}<span className="ml-1 text-[11px] text-[var(--ink-3)]">{STATUS_LABEL[r.verificationStatus]}</span></p>
              <p className="text-[11px] text-[var(--ink-3)]"><code>{r.ruleId}</code>・{LAYER_LABEL[r.timeLayer]}・{u.usable ? "可用" : u.reason}</p>
              <p className="text-[11px] text-[var(--ink-3)]">古籍原則：{r.classicalPrinciple ?? "待原文校驗"}｜App 整理：{r.appImplementation}</p>
              <p className="text-[11px] text-[var(--ink-3)]">引用：{r.citations.map(id => { const c = citationOf(id); return c ? `《${ZIWEI_SOURCES.find(s => s.sourceId === c.sourceId)?.title}》${c.section ?? ""}${c.entry ? `・${c.entry}` : ""}（${STATUS_LABEL[c.verificationStatus]}）` : id; }).join("；")}</p>
              {r.lifeFactors.length > 0 && <p className="text-[11px] text-[var(--ink-3)]">生活因素：{r.lifeFactors.map(l => factorDef(l.factorId).label).join("、")}</p>}
            </li>
          );
        })}</ul>
      </section>

      <section className="card p-4">
        <p className="mb-1 font-medium">十二宮語義</p>
        <ul className="space-y-1">{PALACE_SEMANTICS.map(p => (
          <li key={p.palaceId}>{p.name}{p.classicalName !== p.name ? `（原書「${p.classicalName}」）` : ""}：{p.modernMeaning.text}<span className="text-[11px] text-[var(--ink-3)]">（現代用途為 App 依宮名整理；古典篇旨：{p.classicalMeaning.text ?? "待校驗"}；須搭配對宮{p.combineWith.opposite}、三合{p.combineWith.trines.join("、")}）</span></li>
        ))}</ul>
      </section>

      <section className="card p-4 text-[12px]">
        <p className="mb-1 text-[13px] font-medium">格局規則、引用與來源衝突</p>
        <p>格局規則：{ZIWEI_PATTERN_RULES.length} 條（只有找到明確古籍來源並逐字校驗後才加入，不依網路常見名稱實作）。</p>
        <p>引用：{ZIWEI_CITATIONS.length} 筆，{ZIWEI_CITATIONS.filter(c => c.verificationStatus === "verified").length} 筆已依 PDF 影像逐字核對（{ZIWEI_CITATIONS[0]?.verifiedBy}，{ZIWEI_CITATIONS[0]?.verifiedAt}）。</p>
        <p>來源衝突：{ZIWEI_SOURCE_CONFLICTS.length ? ZIWEI_SOURCE_CONFLICTS.map(c => c.difference).join("；") : "目前 0 筆（集文版與《全書》多屬不同體系，平行段落掃描不足以逐字比對；不代表兩版相同）"}。</p>
        <p className="mt-1 text-[var(--ink-3)]">重新核對：本地有 PDF 原檔時執行 <code>python3 scripts/ziwei-scan-crops.py &lt;PDF&gt; &lt;輸出資料夾&gt;</code>，會先確認 SHA-256，再依頁碼與裁切範圍輸出每段影像。</p>
      </section>
    </div>
  );
}

// ───────── 引用瀏覽：點星曜／宮位／運限，看原文 → 翻譯 → 判讀 → 生活因素 ─────────
const REL_TEXT: Record<string, string> = { self: "坐守", opposite: "對宮照會", trine: "三合照會", trine1: "三合照會", trine2: "三合照會", sanfang: "三方四正任一" };
function describeCondition(c: ZiweiCondition | null): string {
  if (!c) return "無（判讀原則，不單獨觸發）";
  switch (c.kind) {
    case "starInPalace": return `${c.star}在${c.layer === "decade" ? "大限" : c.layer === "annual" ? "流年" : "本命"}${c.palace}${REL_TEXT[c.relation ?? "self"]}${c.brightness ? `，亮度${c.brightness.join("、")}` : ""}（照會不等於坐守）`;
    case "transformation": return `${c.star ?? ""}化${c.transformation}（${T_TYPE[c.source]}）在${c.palace}`;
    case "starsTogether": return `${c.stars.join("、")}同宮${c.palace ? `於${c.palace}` : ""}`;
    case "emptyPalace": return `${c.palace}無主星`;
    case "all": return c.of.map(describeCondition).join("，且");
    case "any": return c.of.map(describeCondition).join("，或");
    case "not": return `非（${describeCondition(c.of)}）`;
    case "periodLifeAt": return `${c.layer === "decade" ? "大限" : "流年"}命宮落在本命${c.natalPalace}`;
  }
}

type Entry = { key: string; label: string; citations: string[] };
const ENTRY_GROUPS: { title: string; entries: Entry[] }[] = [
  { title: "十四主星", entries: MAJOR.map(s => ({ key: `star-${s}`, label: s, citations: STAR_SEMANTICS.find(x => x.star === s)!.classicalCitations })) },
  { title: "十二宮", entries: PALACES.map(p => ({ key: `palace-${p}`, label: p, citations: PALACE_SEMANTICS.find(x => x.name === p)!.classicalMeaning.citationIds })) },
  { title: "大限／流年", entries: [
    { key: "period-daxian", label: "大限", citations: ["CIT_QS_PERIOD_DAXIAN", "CIT_QS_PERIOD_DAXIAN_CALM", "CIT_QS_PERIOD_DAXIAN_TEXT"] },
    { key: "period-annual", label: "太歲（流年）", citations: ["CIT_QS_ANNUAL_TAISUI", "CIT_QS_PERIOD_TAISUI", "CIT_QS_PERIOD_TAISUI_CLASH"] },
    { key: "period-nanbei", label: "行限分南北斗", citations: ["CIT_QS_NANBEI"] },
  ] },
  { title: "格局判讀方法", entries: [
    { key: "method-ruge", label: "論人命入格", citations: ["CIT_QS_RUGE"] },
    { key: "method-gexing", label: "論格星數高下", citations: ["CIT_QS_GEXING"] },
  ] },
];

function CitationExplorer() {
  const [sel, setSel] = useState<string>("star-紫微");
  const entry = ENTRY_GROUPS.flatMap(g => g.entries).find(e => e.key === sel)!;
  const star = sel.startsWith("star-") ? STAR_SEMANTICS.find(s => s.star === entry.label) : undefined;
  const palace = sel.startsWith("palace-") ? PALACE_SEMANTICS.find(p => p.name === entry.label) : undefined;
  const rules = ZIWEI_INTERPRETATION_RULES.filter(r => r.citations.some(id => entry.citations.includes(id)));
  return (
    <section className="card min-w-0 p-4 [overflow-wrap:anywhere]" aria-label="引用瀏覽">
      <p className="mb-2 font-medium">原文與判讀追溯</p>
      <p className="mb-2 text-[12px] text-[var(--ink-3)]">點選星曜、宮位或運限：看原文出處、白話翻譯、怎麼變成判讀、產生哪些生活因素，以及哪些規則使用它。</p>
      {ENTRY_GROUPS.map(g => (
        <div key={g.title} className="mb-2">
          <p className="text-[12px] text-[var(--ink-3)]">{g.title}</p>
          <div className="mt-1 flex flex-wrap gap-1.5">{g.entries.map(e => (
            <button key={e.key} type="button" onClick={() => setSel(e.key)} aria-pressed={sel === e.key}
              className={`rounded-full px-2.5 py-0.5 text-[12px] ${sel === e.key ? "bg-[var(--accent)] text-white" : "bg-[var(--surface-3)]"}`}>{e.label}</button>
          ))}</div>
        </div>
      ))}
      <div className="mt-3 space-y-3" data-testid="citation-detail">
        <p className="font-medium">{entry.label}</p>
        {entry.citations.map(id => { const c = citationOf(id); return c ? <CitationCard key={id} c={c} /> : null; })}
        {star && (
          <div className="inset p-2 text-[12px]">
            <p className="font-medium">星曜語義（依已校驗原文整理）</p>
            <p>核心主題：{star.coreThemes.text ?? "待校驗"}</p>
            <p>有利表現：{star.favorableExpressions.text ?? "原文此段未寫／待校驗"}</p>
            <p>需要留意：{star.challengingExpressions.text ?? "原文此段未寫／待校驗"}</p>
            <p>成立條件：{star.conditionalFactors.text ?? "原文此段未寫／待校驗"}</p>
            <p>星曜組合：{star.combinationDependencies.text ?? "原文此段未寫／待校驗"}</p>
            <p>現代說明（App）：{star.modernExplanation}</p>
            <p className="mt-1">生活因素候選：</p>
            <ul className="ml-3 list-disc">{star.lifeFactorCandidates.length ? star.lifeFactorCandidates.map(c => (
              <li key={c.factorId}>{factorDef(c.factorId).label}（依據「{c.basis}」）：{c.enabled ? "已啟用" : "未啟用"}・{c.reason}</li>
            )) : <li>無（原文沒有可直接對應的生活因素）</li>}</ul>
            <p className="mt-1 text-[11px] text-[var(--ink-3)]">{star.limitations[0]}{star.limitations[1]}</p>
          </div>
        )}
        {palace && (
          <div className="inset p-2 text-[12px]">
            <p className="font-medium">宮位語義</p>
            <p>古典篇旨：{palace.classicalMeaning.text ?? "待校驗"}{palace.classicalName !== palace.name ? `（原書宮名「${palace.classicalName}」）` : ""}</p>
            <p>現代用途（App 依宮名整理）：{palace.modernMeaning.text}</p>
            <p>須一併看：對宮{palace.combineWith.opposite}、三合{palace.combineWith.trines.join("、")}</p>
          </div>
        )}
        <div className="text-[12px]">
          <p className="font-medium">使用這段原文的規則（{rules.length}）</p>
          {rules.length ? rules.map(r => <RuleChain key={r.ruleId} r={r} />) : <p className="text-[var(--ink-3)]">目前沒有規則直接使用；宮位語義用於決定主題取哪些宮與判讀範圍。</p>}
        </div>
      </div>
    </section>
  );
}

function CitationCard({ c }: { c: ClassicalCitation }) {
  const { prefs } = useApp();
  const sp = c.locator ? scanSpan(c.locator.spanId) : undefined;
  return (
    <div className="inset p-2 text-[12px]">
      <p>《紫微斗數全書》{c.edition}・{c.volume}・{c.section}{c.entry ? `・${c.entry}` : ""}<span className="ml-1 text-[11px] text-[var(--ink-3)]">{STATUS_LABEL[c.verificationStatus]}</span></p>
      <p className="text-[11px] text-[var(--ink-3)]">PDF 第 {c.locator?.pdfPage} 頁（版心 {c.locator?.printedPage}）・段落 {c.locator?.spanId}・核對：{c.verifiedBy}，{c.verifiedAt}・PDF SHA-256 {GUANGYI_SOURCE.sha256.slice(0, 12)}…</p>
      <details className="mt-1" open={prefs.displayMode === "pro"}>
        <summary className="cursor-pointer text-[var(--accent)]">原文層（專業）</summary>
        <p className="mt-1 font-serif text-[14px] leading-relaxed">{c.originalText}</p>
        {sp?.notes ? <p className="mt-1 text-[11px] text-[var(--ink-3)]">校勘備註：{sp.notes}</p> : null}
        {sp && "draftCorrections" in sp && sp.draftCorrections?.length ? <p className="text-[11px] text-[var(--ink-3)]">與轉錄初稿不同處（以影像為準）：{sp.draftCorrections.join("；")}</p> : null}
      </details>
      <p className="mt-1">白話翻譯：{c.modernTranslation}</p>
      <p className="text-[11px] text-[var(--ink-3)]">異文：{c.textualVariants.length ? c.textualVariants.map(v => `${v.edition}「${v.text}」`).join("；") : "0 筆（集文版此段沒有可逐字核對的平行文字，未建立異文）"}</p>
    </div>
  );
}

function RuleChain({ r }: { r: ZiweiInterpretationRule }) {
  const u = ruleUsability(r);
  return (
    <div className="inset mt-1 p-2">
      <p>{r.title}<span className="ml-1 text-[11px] text-[var(--ink-3)]"><code>{r.ruleId}</code>・{u.usable ? "可用" : u.reason}</span></p>
      <ol className="ml-4 mt-1 list-decimal space-y-0.5 text-[12px]">
        <li>古籍原則：{r.classicalPrinciple ?? "待校驗"}</li>
        <li>現代中性語義：{r.modernSemantic ?? "—"}</li>
        <li>盤面成立條件：{describeCondition(r.condition)}</li>
        <li>判讀：{r.interpretation ?? "—（原則性條目）"}</li>
        <li>生活因素：{r.lifeFactors.length ? r.lifeFactors.map(l => `${factorDef(l.factorId).label}（強度 ${l.strength}）`).join("、") : "無"}</li>
      </ol>
      <p className="mt-1 text-[11px] text-[var(--ink-3)]">主題：{r.topics.map(t => ADVICE_TOPICS[t].label).join("、")}・{LAYER_LABEL[r.timeLayer]}・App 整理：{r.appImplementation}</p>
    </div>
  );
}

/** 第二來源（集文版）比對狀態與待校驗清單 */
function SecondaryAndPending() {
  const KIND: Record<string, string> = { humanDraft: "人工初稿", ocrSearchOnly: "OCR 只供搜尋", patternCandidate: "格局候選", locatorOnly: "只有定位", classicalContextOnly: "只作古籍原文層" };
  const wenda = JIWEN_SOURCE.parallelSections[0];
  return (
    <section className="card min-w-0 p-4 text-[12px] [overflow-wrap:anywhere]" aria-label="集文版與待校驗">
      <p className="mb-1 text-[13px] font-medium">第二來源：《紫微斗數全集》集文版</p>
      <p className="text-[var(--ink-3)]">{JIWEN_SOURCE.scanQuality.note}</p>
      <p className="mt-1 text-[var(--ink-3)]">{JIWEN_SOURCE.bookStructure.note}</p>
      <ul className="mt-2 space-y-1">{JIWEN_SOURCE.parallelSections.map(p => (
        <li key={p.topic}>・{p.topic}：{p.status === "locatorOnly" ? `平行段落在集文版 PDF p${p.jiwenPages[0]}–${p.jiwenPages[p.jiwenPages.length - 1]}（只記大意，待核）` : p.status === "noDirectParallel" ? "沒有直接平行的段落" : "未找到對應篇章"}</li>
      ))}</ul>
      <details className="mt-2">
        <summary className="cursor-pointer text-[var(--accent)]">集文版十四主星問答大意（待核，不作引用）</summary>
        <ul className="mt-1 space-y-0.5">{wenda.gistReadings!.map(g => <li key={g.star}>{g.star}（p{g.jiwenPage}）：{g.gist}</li>)}</ul>
        <p className="mt-1 text-[var(--ink-3)]">{wenda.gistPolicy}</p>
      </details>
      <p className="mb-1 mt-3 text-[13px] font-medium">待校驗（{ZIWEI_PENDING.length} 項，不會被引用或啟用）</p>
      <ul className="space-y-1">{ZIWEI_PENDING.map(e => (
        <li key={e.pendingId}>・{e.section}<span className="ml-1 text-[11px] text-[var(--ink-3)]">{KIND[e.kind]}{e.pdfPage ? `・PDF p${e.pdfPage}` : ""}：{e.reason}</span></li>
      ))}</ul>
    </section>
  );
}
