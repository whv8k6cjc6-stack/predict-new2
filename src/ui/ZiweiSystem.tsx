"use client";
/** 紫微排盤體系與評分組成的顯示元件（設定頁、命盤頁、分析頁共用）。 */
import { RULE_FIELD_LABEL, VERIFICATION_LABEL, describeOverride, type ZiweiRuleProfile, type ZiweiRules } from "@/core/ziwei/profile";
import { ZIWEI_VERSIONS } from "@/core/ziwei/common";
import type { ScoringComposition } from "@/core/analysis/score";

export function ProfileBadge({ p }: { p: ZiweiRuleProfile }) {
  const kind = p.kind === "builtin" ? "標準" : p.kind === "legacy" ? "舊版轉換" : "自訂";
  return (
    <span className="inline-flex flex-wrap items-center gap-1 text-[12px]">
      <span className="rounded bg-[var(--surface-3)] px-1.5 py-0.5">{p.name}</span>
      <span className="text-[var(--ink-3)]">{p.id}・v{p.version}・{kind}</span>
    </span>
  );
}

/** 規則逐項列出：採用值、軟體來源、古籍來源、驗證狀態 */
export function ZiweiProfileTable({ p }: { p: ZiweiRuleProfile }) {
  const keys = Object.keys(p.rules) as (keyof ZiweiRules)[];
  return (
    <div className="space-y-2">
      <p className="text-[12px] leading-relaxed text-[var(--ink-2)]">{p.description}</p>
      {p.overrides.length > 0 && <p className="text-[12px] text-[var(--accent)]">覆寫（相對 {p.baseProfileId}）：{p.overrides.map(describeOverride).join("；")}</p>}
      <ul className="divide-y divide-[var(--line)] text-[12px]">
        {keys.map(k => {
          const r = p.rules[k];
          return (
            <li key={k} className="py-1.5">
              <p><span className="font-medium">{RULE_FIELD_LABEL[k]}</span>　{r.label}</p>
              <p className="text-[11px] text-[var(--ink-3)]">
                {r.basis ? `依據：${r.basis}・` : ""}軟體來源：{r.softwareDataset ?? "無"}・古籍來源：{r.classicalSource ?? "未確認（不引用）"}・{VERIFICATION_LABEL[r.verification]}{r.note ? `・${r.note}` : ""}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ZiweiVersionList() {
  const L: Record<keyof typeof ZIWEI_VERSIONS, string> = {
    calendarVersion: "曆法", ziweiChartEngineVersion: "紫微排盤引擎", starPlacementVersion: "安星", brightnessVersion: "亮度表",
    transformationVersion: "四化", luckVersion: "運限", interpretationVersion: "判讀", classicalDataVersion: "古籍資料",
  };
  return (
    <dl className="grid grid-cols-[6rem_1fr] gap-y-0.5 text-[12px]">
      {(Object.keys(ZIWEI_VERSIONS) as (keyof typeof ZIWEI_VERSIONS)[]).map(k => (
        <div key={k} className="contents"><dt className="text-[var(--ink-3)]">{L[k]}</dt><dd className="num">{k}: {ZIWEI_VERSIONS[k]}</dd></div>
      ))}
    </dl>
  );
}

/** 綜合評分組成：參與系統數與暫不計分原因（不可假裝是完整四術評分） */
export function ScoringNote({ s }: { s: ScoringComposition }) {
  if (s.activeSystemCount === s.totalSystemCount && !s.legacyIncluded) return null;
  return (
    <p className="rounded-xl border border-[var(--line-strong)] bg-[var(--surface-2)] px-3 py-2 text-[12px] leading-relaxed text-[var(--ink-2)]" role="note">
      {s.note}
    </p>
  );
}
