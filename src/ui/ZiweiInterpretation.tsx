"use client";
/** 紫微判讀面板（命盤頁）與來源／規則詳情元件。一般模式只顯示白話狀態；專業模式展開判讀語境、規則閘門與引用。 */
import Link from "next/link";
import type { ZiweiNatal, ZiweiTransit } from "@/core/ziwei";
import { interpretZiwei, ruleUsability, ziweiCoverage, type ZiweiCoverageLevel } from "@/core/ziwei/interp/engine";
import { sanFangContext, LAYER_LABEL } from "@/core/ziwei/interp/contexts";
import type { CitationStatus } from "@/core/ziwei/interp/citation";
import { ADVICE_TOPICS } from "@/kb/advice/topics";
import { ZIWEI_CITATIONS, ZIWEI_SOURCES, citationOf } from "@/kb/ziwei/sources";
import { PALACE_SEMANTICS } from "@/kb/ziwei/semantics";
import { ZIWEI_INTERPRETATION_RULES, ZIWEI_PATTERN_RULES, ZIWEI_SOURCE_CONFLICTS } from "@/kb/ziwei/interpretationRules";
import { IMPORTED_ZIWEI_TEXTS } from "@/kb/ziwei/texts/imported.generated";
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
          ? `紫微判讀引擎建置中：已登錄 ${ZIWEI_INTERPRETATION_RULES.length} 條待校驗的判讀條目，可用 ${usable} 條。判讀規則必須依《紫微斗數全書》原文逐條校驗，原文尚未匯入，因此目前不產生紫微判讀，也不影響今日建議。`
          : `紫微判讀部分啟用：${zi.coveredTopics.map(x => ADVICE_TOPICS[x].label).join("、")}；成立 ${zi.findings.length} 條。`}
      </p>
      {zi.findings.length > 0 && (
        <ul className="mt-2 space-y-2">
          {zi.findings.map(f => (
            <li key={f.ruleId} className="inset p-2 text-[13px]">
              <p>{f.interpretation}</p>
              <p className="text-[11px] text-[var(--ink-3)]">{LAYER_LABEL[f.timeLayer]}・{f.evidence.join("；")}</p>
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
    <div className="space-y-4 text-[13px] leading-relaxed">
      <section className="card p-4">
        <p className="mb-2 font-medium">來源登錄（依優先級）</p>
        <ul className="space-y-3">{ZIWEI_SOURCES.map(s => (
          <li key={s.sourceId}>
            <p><span className="mr-1 rounded bg-[var(--surface-3)] px-1.5 text-[11px]">Tier {s.tier}</span>《{s.title}》{s.edition ? `（${s.edition}）` : ""}<span className="ml-1 text-[11px] text-[var(--ink-3)]">{s.contentStatus === "imported" ? "已匯入" : s.contentStatus === "notInRepository" ? "原文尚未匯入" : "目前無可用文本"}</span></p>
            <p className="text-[12px] text-[var(--ink-3)]">用途：{s.usage.join("、")}{s.notFor.length ? `；不可作為：${s.notFor.join("、")}` : ""}</p>
            <p className="text-[12px] text-[var(--ink-3)]">{s.notes}</p>
          </li>
        ))}</ul>
        <p className="mt-2 text-[12px] text-[var(--ink-3)]">已匯入原文：{IMPORTED_ZIWEI_TEXTS.length ? IMPORTED_ZIWEI_TEXTS.map(t => `${t.sourceId}（${t.edition}，SHA-256 ${t.sha256.slice(0, 12)}…）`).join("、") : "無"}。</p>
      </section>

      <section className="card p-4">
        <p className="mb-2 font-medium">主題覆蓋矩陣</p>
        <table className="w-full text-center text-[12px]">
          <thead><tr className="text-[var(--ink-3)]"><th className="text-left font-normal">主題</th><th className="font-normal">覆蓋</th><th className="font-normal">規則</th><th className="font-normal">已校驗</th><th className="font-normal">待校驗</th></tr></thead>
          <tbody>{cov.map(c => <tr key={c.topic} className="num"><td className="text-left">{ADVICE_TOPICS[c.topic].label}</td><td>{LEVEL_LABEL[c.level]}</td><td>{c.ruleCount}</td><td>{c.verifiedRuleCount}</td><td>{c.pendingRuleCount}</td></tr>)}</tbody>
        </table>
        <p className="mt-2 text-[12px] text-[var(--ink-3)]">紫微只在覆蓋為「部分」或「專屬」的主題參與建議；目前全部為「尚無」，紫微維持 pending，不影響建議與分數。</p>
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
          <li key={p.palaceId}>{p.name}：{p.modernMeaning.text}<span className="text-[11px] text-[var(--ink-3)]">（App 依宮名整理；須搭配對宮{p.combineWith.opposite}、三合{p.combineWith.trines.join("、")}；古典語義待校驗）</span></li>
        ))}</ul>
      </section>

      <section className="card p-4 text-[12px]">
        <p className="mb-1 text-[13px] font-medium">格局規則、引用與來源衝突</p>
        <p>格局規則：{ZIWEI_PATTERN_RULES.length} 條（只有找到明確古籍來源並逐字校驗後才加入，不依網路常見名稱實作）。</p>
        <p>引用定位：{ZIWEI_CITATIONS.length} 筆，全部待原文匯入後核對（不憑記憶填寫原文）。</p>
        <p>來源衝突：{ZIWEI_SOURCE_CONFLICTS.length ? ZIWEI_SOURCE_CONFLICTS.map(c => c.difference).join("；") : "目前無"}。</p>
        <p className="mt-1 text-[var(--ink-3)]">匯入原文：取得合法版本後執行 <code>node scripts/import-ziwei-classic.mjs</code>，會記錄版本與 SHA-256；每條引用都要能逐字比對才會啟用對應規則。</p>
      </section>
    </div>
  );
}
