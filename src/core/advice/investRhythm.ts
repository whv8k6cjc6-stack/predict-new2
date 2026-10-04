/** 今日投資節奏：把投資主題的生活因素整理成「今天怎麼操作」的一張卡——節奏、下單時段、檢查清單、本月重點。
 *  只談節奏、紀律與風險控制；不提供任何標的、漲跌或資金比例的判斷。 */
import { factorDef, type FactorId, type FactorNature } from "./factors";
import type { InvestorProfile } from "./investor";
import type { FactorEvidence, HorizonAdvice, InvestRhythm, InvestRhythmLevel, SystemAgreementStatus } from "./types";

const PRESENT = 1;

const LABEL: Record<InvestRhythmLevel, string> = {
  steady: "照計畫執行",
  small: "只做計畫內的小步",
  pause: "不開新部位，只檢查與整理",
  quiet: "照原本的紀律",
};

const SUMMARY: Record<InvestRhythmLevel, (d: string) => string> = {
  steady: d => `${d}判斷條件相對清楚，可以照原本的計畫執行，但仍分批、守住你自己設定的上限，不因條件較好就額外加大。`,
  small: d => `${d}有利與不利的訊號都有，適合只做計畫裡原本就有、金額小、隨時可以停的動作；新的想法先放進觀察清單。`,
  pause: d => `${d}不利的訊號較多，比較適合只做檢查與整理：核對持有部位、成本與出場條件，新的投入延後到條件更清楚之後。`,
  quiet: d => `${d}在投資方面沒有突出的訊號，照你原本的紀律與檢視節奏進行即可。`,
};

/** 台股盤中約 9:00–13:30：時段字串（例「9–11 點」）起點在 9～12 點者算盤中 */
const inMarket = (h: string) => { const a = Number(h.match(/^(\d+)/)?.[1] ?? -1); return a >= 9 && a <= 12; };
function splitMarket(t: { best: string[]; avoid: string[] }) {
  const market = { best: t.best.filter(inMarket), avoid: t.avoid.filter(inMarket) };
  const other = { best: t.best.filter(h => !inMarket(h)), avoid: t.avoid.filter(h => !inMarket(h)) };
  const note = !market.best.length ? "台股盤中沒有特別較佳的時段，需要交易時照計畫執行、送單前多核對一次即可。" : null;
  return { market, other, note };
}

const has = (ev: Map<FactorId, FactorEvidence>, ...ids: FactorId[]) => ids.some(id => (ev.get(id)?.score ?? 0) >= PRESENT);

export function investRhythmOf(x: {
  ev: Map<FactorId, FactorEvidence>; agreement: SystemAgreementStatus; findings: number;
  timing: { best: string[]; avoid: string[] } | null; investor?: InvestorProfile; dayWord: string;
  month?: HorizonAdvice; nature: (id: FactorId) => FactorNature;
}): InvestRhythm {
  const { ev, investor } = x;
  let S = 0, R = 0;
  for (const e of ev.values()) {
    if (e.score < PRESENT || factorDef(e.factorId).category === "aptitude") continue;
    const n = x.nature(e.factorId);
    if (n === "support") S += e.score; else if (n === "risk") R += e.score;
  }
  const impulse = has(ev, "impulsivityRisk", "disciplineRisk", "judgmentBiasRisk");
  let level: InvestRhythmLevel =
    !x.findings || S + R === 0 ? "quiet"
      : x.agreement === "conflict" ? "small"
        : R >= 1.5 * S ? "pause"
          : S >= 1.5 * R && !impulse ? "steady" : "small";
  // 只有一個系統有訊號時，不給「照計畫執行」這種較積極的節奏
  if (level === "steady" && x.agreement === "insufficientData") level = "small";

  const style = investor?.style;
  const list: string[] = [];
  // 1. 依投資方式的基本動作
  if (style === "dca") list.push(level === "pause" ? "定期扣款照常，不臨時加碼或停扣" : "確認本期扣款照常進行");
  else if (style === "longHold") list.push("持股只依固定檢視日調整，不因單日波動改變");
  else if (style === "swing") list.push("開盤前確認每個部位的停損價與目標價");
  else if (style === "shortTerm") list.push(level === "pause" ? "先把單日虧損上限調低，今天只做最有把握的計畫內交易" : "開盤前寫下今天的單日虧損上限");
  else if (style === "none") list.push("先寫下投入的錢從哪裡來，確認不是生活預備金");
  // 2. 依今日因素
  if (level === "pause") list.push("新的想法先放進觀察清單，不開新部位");
  if (impulse) list.push("想臨時改變做法時，先寫下理由，隔天再決定");
  if (has(ev, "errorRisk", "transitionRisk")) list.push("送單前逐項核對代號、數量、價格與委託種類");
  if (has(ev, "trustRisk", "communicationMisunderstandingRisk", "communicationConflictRisk", "externalInterference")) list.push("消息先回公司公告或財報查證，不跟明牌");
  if (has(ev, "fatigueRisk", "stressLoad", "recoveryNeed")) list.push("累或心情起伏大時先不看盤，交易等狀態穩定再做");
  if (has(ev, "cashFlowPressure", "unexpectedExpenseRisk", "resourceLossRisk")) list.push("投資只用閒錢，不借錢、不動用預備金");
  // 3. 依投資設定的紀律缺口
  if (investor && investor.hasExitRule !== true) list.push("先替每個部位寫好出場條件與最多能接受的虧損金額");
  if (investor && investor.hasEmergencyFund !== true) list.push("先建立和投資分開的生活預備金，再增加投入");
  if (investor && investor.hasPositionLimit !== true) list.push("先設定單一標的最多占總資產多少，寫在紀錄第一頁");
  if (level === "steady") list.push("計畫內的投入分批執行，記下每批的理由");
  if (!list.length) list.push("照原本的計畫與檢視日進行，不需要額外動作");

  const orderWindow = x.timing && (x.timing.best.length || x.timing.avoid.length) ? splitMarket(x.timing) : null;
  const monthItem = x.month?.doNow[0] ?? x.month?.avoidNow[0];
  return {
    level, label: LABEL[level], summary: SUMMARY[level](x.dayWord), orderWindow,
    checklist: [...new Set(list)].slice(0, 6),
    monthFocus: monthItem ? (monthItem.kind === "avoid" ? `避免${monthItem.short}` : monthItem.short) : null,
    basis: "依投資相關的生活因素與各系統是否一致整理；只談節奏與風險控制，不判斷標的或漲跌。",
  };
}
