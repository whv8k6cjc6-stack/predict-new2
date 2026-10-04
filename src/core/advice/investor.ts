/** 投資設定（使用者自己填的投資方式與紀律狀態）。只用來調整建議的用語與檢查清單，
 *  不影響任何命理判讀、分數或建議規則的觸發條件。 */

export type InvestStyle = "dca" | "longHold" | "swing" | "shortTerm" | "none";

export interface InvestorProfile {
  style?: InvestStyle;
  /** 已經有寫好的停損或出場規則 */
  hasExitRule?: boolean;
  /** 已經有和投資分開的生活預備金 */
  hasEmergencyFund?: boolean;
  /** 已經設定單一標的的比重上限 */
  hasPositionLimit?: boolean;
}

export const INVEST_STYLE_LABEL: Record<InvestStyle, string> = {
  dca: "定期定額（基金、ETF）",
  longHold: "長期持有（個股、ETF）",
  swing: "波段操作（持有數天到數月）",
  shortTerm: "短線交易（當沖、隔日沖）",
  none: "還沒開始投資",
};

export const INVEST_STYLES = Object.keys(INVEST_STYLE_LABEL) as InvestStyle[];
