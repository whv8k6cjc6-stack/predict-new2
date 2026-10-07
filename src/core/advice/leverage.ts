/** 加大槓桿的風險試算：只把使用者自己填的槓桿倍數換算成「價格反向變動時本金的變化」，
 *  是單純的算術，不預測行情，也不建議該用幾倍。實際追繳與強制平倉門檻依券商與商品規定，會比試算的「虧光」更早發生。 */
export type LeverageLevel = "none" | "low" | "mid" | "high" | "extreme";
export interface LeverageRisk {
  multiple: number;
  /** 價格反向變動多少（%）本金就虧光 */
  wipeoutPct: number | null;
  /** 價格反向變動 10% 時，本金損失（%） */
  lossAt10: number;
  level: LeverageLevel;
  headline: string;
  lines: string[];
  checklist: string[];
}

export const LEVERAGE_MIN = 1, LEVERAGE_MAX = 100;
const r1 = (x: number) => Math.round(x * 10) / 10;

export function leverageRisk(input: number): LeverageRisk | null {
  if (!Number.isFinite(input) || input < LEVERAGE_MIN) return null;
  const L = Math.min(r1(input), LEVERAGE_MAX);
  const level: LeverageLevel = L <= 1 ? "none" : L <= 1.5 ? "low" : L <= 3 ? "mid" : L <= 5 ? "high" : "extreme";
  const wipeoutPct = L > 1 ? r1(100 / L) : null;
  const lossAt10 = Math.min(100, r1(10 * L));
  const headline = {
    none: "1 倍等於沒有用槓桿：價格變動多少，本金就跟著變動多少。",
    low: `${L} 倍屬於輕度放大，但虧損一樣會被放大，加之前仍要先設好停損。`,
    mid: `${L} 倍已經明顯放大盈虧，加之前先確認自己補得起保證金。`,
    high: `${L} 倍下，價格小幅反向就可能被追繳保證金；先寫好退出條件，並分批加上去。`,
    extreme: `${L} 倍下，價格只要小幅反向就可能虧光本金；命理分數再高也抵銷不了這個風險。`,
  }[level];
  const lines = [
    `價格每反向變動 1%，本金大約變動 ${r1(L)}%。`,
    `價格反向變動 10%，本金大約損失 ${lossAt10}%${lossAt10 >= 100 ? "（已經虧光）" : ""}。`,
    ...(wipeoutPct !== null ? [`價格反向變動約 ${wipeoutPct}%，本金就會虧光；實際上在這之前，券商就會要求補繳保證金或強制平倉。`] : []),
    "以上不含利息、手續費與追繳門檻，實際門檻請以你的券商與商品規定為準。",
  ];
  const checklist = [
    "查清楚追繳保證金的門檻與強制平倉的條件",
    "確認加槓桿的錢不是生活費、房貸、緊急預備金，也不是借來的",
    "先設好停損，再送單",
    "分批加上去，不一次加到計畫的上限",
    "寫下什麼情況要降回原本的槓桿",
  ];
  return { multiple: L, wipeoutPct, lossAt10, level, headline, lines, checklist };
}
