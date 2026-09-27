"use client";
import { SOURCE_EDITIONS, ZHOUYI_ERRATA, ZHOUYI_NOTES } from "@/kb/sources";
import { ENGINES, STATUS_LABEL } from "@/core/registry";
import { BAZI_RULES } from "@/kb/rules/bazi";
import { legacyZiweiScoring } from "@/kb/rules/ziwei";
import { QIMEN_RULES, QIMEN_EVENT_RULES } from "@/kb/rules/qimen";
import { ICHING_RULES } from "@/kb/rules/iching";
import { BACKGROUND_CAP, CALIBRATION_INFO, K, B, OVERALL_MIX, OVERALL_OWN_WEIGHT, W_SYSTEM, W_TIMESCALE, WEIGHTS_VERSION, TIMESCALE_LABEL } from "@/kb/weights";
import { DOMAINS } from "@/core/domains";
import { PageHeader, SectionTitle } from "@/ui/primitives";
import { BackButton } from "@/ui/PageBack";

const RULESETS = [
  { name: "八字＋滴天髓要旨", rules: BAZI_RULES }, { name: "紫微斗數（legacy 計分，已停用）", rules: [...legacyZiweiScoring.rules] },
  { name: "奇門遁甲", rules: [...QIMEN_RULES, ...QIMEN_EVENT_RULES] }, { name: "易經", rules: ICHING_RULES },
];

export default function SourcesPage() {
  return (
    <main className="safe-top mx-auto max-w-lg px-4">
      <BackButton />
      <PageHeader title="來源、規則與權重" subtitle="每個結論都能追到這裡：古籍版本 → 規則庫 → 計分權重" />

      <SectionTitle>古籍來源</SectionTitle>
      <ul className="space-y-2">
        {SOURCE_EDITIONS.map(s => (
          <li key={s.source_id} className="card p-4 text-[13px] leading-relaxed">
            <p className="font-serif text-[16px]">《{s.title}》{s.annotator ? <span className="text-[13px] text-[var(--ink-3)]">　{s.annotator} 注</span> : null}</p>
            <p className="text-[var(--ink-2)]">{s.author}</p>
            <p className="text-[var(--ink-3)]">版本：{s.edition}</p>
            <p className="text-[var(--ink-3)]">狀態：{s.status === "planned" ? "預定匯入（尚未匯入任何原文，相關規則只列原則）" : s.status === "imported" ? "已匯入（機器匯入，未經人工逐字校勘）" : "已校驗"}</p>
            {s.origin_url && <p className="break-all text-[var(--ink-3)]">來源：{s.origin}　{s.origin_url}</p>}
            {s.content_hash && <p className="break-all text-[10px] text-[var(--ink-3)]">{s.content_hash}</p>}
            <p className="text-[var(--ink-3)]">授權：{s.license}</p>
          </li>
        ))}
      </ul>

      <SectionTitle right={`${ZHOUYI_ERRATA.length} 條`}>《周易》勘誤表</SectionTitle>
      <div className="card overflow-x-auto p-3">
        <table className="w-full min-w-[420px] text-[12px]">
          <thead><tr className="text-left text-[var(--ink-3)]"><th className="font-normal">位置</th><th className="font-normal">底本</th><th className="font-normal">改為</th><th className="font-normal">處</th><th className="font-normal">理由／依據</th></tr></thead>
          <tbody className="divide-y divide-[var(--line)]">
            {ZHOUYI_ERRATA.map((e, i) => <tr key={i}><td className="py-1.5 pr-1">{e.scope}</td><td className="font-serif">{e.from}</td><td className="font-serif text-[var(--accent)]">{e.to}</td><td className="num">{e.applied}</td><td className="text-[var(--ink-2)]">{e.reason}；{e.basis}</td></tr>)}
          </tbody>
        </table>
        <ul className="mt-2 space-y-0.5 text-[11px] text-[var(--ink-3)]">{ZHOUYI_NOTES.map((n, i) => <li key={i}>・{n}</li>)}</ul>
      </div>

      <SectionTitle>規則庫</SectionTitle>
      <ul className="card divide-y divide-[var(--line)] px-4 text-[13px]">
        {RULESETS.map(r => (
          <li key={r.name} className="flex items-center justify-between py-2.5">
            <span>{r.name}</span>
            <span className="num text-[var(--ink-3)]">{r.rules.length} 條・引用原文 {r.rules.filter(x => x.based_on.text_ids.length || x.dynamic_text_slots?.length).length} 條・人工校驗 {r.rules.filter(x => x.verification === "human_verified").length} 條</span>
          </li>
        ))}
      </ul>

      <SectionTitle>引擎版本</SectionTitle>
      <ul className="card divide-y divide-[var(--line)] px-4 text-[12px]">
        {ENGINES.map(e => (
          <li key={e.id} className="py-2.5">
            <p className="flex justify-between text-[13px]"><span>{e.name}</span><span className="text-[var(--sig-pos)]">{STATUS_LABEL[e.status]}</span></p>
            <p className="text-[var(--ink-3)]">流派：{e.stamp.school}・引擎 {e.stamp.engine_version}・規則 {e.stamp.rule_version}・來源 {e.stamp.source_version}</p>
          </li>
        ))}
      </ul>

      <SectionTitle right={`版本 ${WEIGHTS_VERSION}`}>計分權重</SectionTitle>
      <div className="card space-y-3 p-4 text-[12px] leading-relaxed">
        <p>貢獻＝方向 × 強度 × 時間尺度權重 × 系統權重；分數＝50 + 50 × tanh((raw − 基準) ÷ K)。</p>
        <p>時間尺度：{(Object.keys(W_TIMESCALE) as (keyof typeof W_TIMESCALE)[]).map(k => `${TIMESCALE_LABEL[k]} ${W_TIMESCALE[k]}`).join("、")}（事件模式時辰 1.3）。長期背景上限：當日 ±{BACKGROUND_CAP.day}、流月 ±{BACKGROUND_CAP.month}。</p>
        <table className="w-full text-center">
          <thead><tr className="text-[var(--ink-3)]"><th className="text-left font-normal">領域</th><th className="font-normal">八字</th><th className="font-normal">紫微</th><th className="font-normal">奇門</th><th className="font-normal">易經</th><th className="font-normal">K</th><th className="font-normal">基準</th></tr></thead>
          <tbody>{DOMAINS.map(d => <tr key={d.key} className="num"><td className="text-left">{d.label}</td><td>{W_SYSTEM[d.key].bazi}</td><td>{W_SYSTEM[d.key].ziwei}</td><td>{W_SYSTEM[d.key].qimen}</td><td>{W_SYSTEM[d.key].iching}</td><td>{K.day[d.key]}</td><td>{B.timeKnown.day[d.key]}</td></tr>)}</tbody>
        </table>
        <p>綜合指數＝各領域分數加權平均 ×{1 - OVERALL_OWN_WEIGHT}（{Object.entries(OVERALL_MIX).map(([k, v]) => `${DOMAINS.find(d => d.key === k)!.label} ${v}`).join("、")}）＋「整體」專屬規則分數 ×{OVERALL_OWN_WEIGHT}。</p>
        <p className="text-[var(--ink-3)]">校準：{CALIBRATION_INFO.samples} 組固定合成樣本命例；{CALIBRATION_INFO.target}。尺度 K 固定為四術參考尺度（紫微暫不計分時不放大八字、奇門、梅花）；基準只含參與計分的系統，有／無出生時辰分開。產生日期 {CALIBRATION_INFO.generatedAt}。</p>
      </div>
    </main>
  );
}
