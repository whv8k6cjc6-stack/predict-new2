"use client";
/** 設定頁：投資設定。只用來調整投資建議的用語與檢查清單，不影響任何命理判讀或分數。 */
import { INVEST_STYLES, INVEST_STYLE_LABEL, type InvestorProfile, type InvestStyle } from "@/core/advice/investor";
import { WORK_ROLES, WORK_ROLE_LABEL, type WorkRole } from "@/core/advice/workRole";
import { useApp } from "@/app/providers";
import { Chip, Toggle } from "./primitives";

export function InvestorSettings() {
  const { prefs, updatePrefs } = useApp();
  const inv: InvestorProfile = prefs.investor ?? {};
  const set = (p: Partial<InvestorProfile>) => updatePrefs({ investor: { ...inv, ...p } });
  return (
    <div className="card space-y-3 p-4" data-testid="investor-settings">
      <div>
        <p className="text-[15px]">你的投資方式</p>
        <p className="text-[12px] text-[var(--ink-3)]">投資建議會換成符合你做法的說法與步驟；不填就用通用版本。</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {INVEST_STYLES.map((s: InvestStyle) => <Chip key={s} active={inv.style === s} onClick={() => set({ style: inv.style === s ? undefined : s })}>{INVEST_STYLE_LABEL[s]}</Chip>)}
        </div>
      </div>
      <div className="divide-y divide-[var(--line)] border-t border-[var(--line)]">
        <div className="py-2"><Toggle checked={inv.hasExitRule === true} onChange={v => set({ hasExitRule: v })} label="已經寫好停損或出場規則" desc="沒有的話，檢查清單會先提醒你補上" /></div>
        <div className="py-2"><Toggle checked={inv.hasEmergencyFund === true} onChange={v => set({ hasEmergencyFund: v })} label="已有和投資分開的生活預備金" /></div>
        <div className="py-2"><Toggle checked={inv.hasPositionLimit === true} onChange={v => set({ hasPositionLimit: v })} label="已設定單一標的的比重上限" /></div>
      </div>
      <p className="text-[12px] leading-relaxed text-[var(--ink-3)]">這些只存在這台裝置。命理建議不能取代你的投資策略、停損與部位管理，也不提供標的或漲跌判斷。</p>
    </div>
  );
}

/** 設定頁：工作角色。只調整建議與時間表的用語，不影響判讀。 */
export function WorkSettings() {
  const { prefs, updatePrefs } = useApp();
  const role = prefs.work?.role;
  return (
    <div className="card space-y-2 p-4" data-testid="work-settings">
      <p className="text-[15px]">你的工作角色</p>
      <p className="text-[12px] text-[var(--ink-3)]">建議與今日時間表會換成貼近你日常的說法，例如公務機關會看到「公文陳核」「跨科室協調」；不填就用通用版本。</p>
      <div className="flex flex-wrap gap-2">
        {WORK_ROLES.map((r: WorkRole) => <Chip key={r} active={role === r} onClick={() => updatePrefs({ work: { role: role === r ? undefined : r } })}>{WORK_ROLE_LABEL[r]}</Chip>)}
      </div>
    </div>
  );
}
