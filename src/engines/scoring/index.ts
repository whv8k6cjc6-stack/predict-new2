/** 整合評分引擎：八字＋紫微＋奇門 → 0–100 八維分數 + FortuneResult */
import { computeBazi, baziFacts, type BaziChart, type TenGod } from "../bazi";
import { computeZiwei, ziweiFacts } from "../ziwei";
import { computeQimen, qimenFacts } from "../qimen";
import { runRules } from "../rule-engine/match";
import { STEMS } from "../calendar/ganzhi";
import { lunarDate } from "../calendar/lunar";
import type { Profile } from "@/types/profile";
import type { FortuneResult, Scores, Topic, TriggeredRule } from "@/types/fortune";
import baziRules from "@/data/rules/bazi-rules.json";
import scoring from "@/data/rules/scoring-rules.json";
import type { FortuneRule } from "@/types/rule";

export const STANDARD_DISCLAIMER = "本分析僅供個人參考，不構成醫療、法律、投資或重大決策建議。";
const CATS = ["overall","career","wealth","relationship","health","people","decision","risk"] as const;

const clamp = (x: number) => Math.max(0, Math.min(100, Math.round(x)));
export const scoreLabel = (s: number) => s >= 80 ? "佳" : s >= 65 ? "偏佳" : s >= 45 ? "平" : s >= 30 ? "需留意" : "宜守";

const SHI_CHEN: { name: string; hour: number; range: string }[] = [
  { name: "子", hour: 0, range: "23–01" }, { name: "丑", hour: 2, range: "01–03" },
  { name: "寅", hour: 4, range: "03–05" }, { name: "卯", hour: 6, range: "05–07" },
  { name: "辰", hour: 8, range: "07–09" }, { name: "巳", hour: 10, range: "09–11" },
  { name: "午", hour: 12, range: "11–13" }, { name: "未", hour: 14, range: "13–15" },
  { name: "申", hour: 16, range: "15–17" }, { name: "酉", hour: 18, range: "17–19" },
  { name: "戌", hour: 20, range: "19–21" }, { name: "亥", hour: 22, range: "21–23" },
];

/** 量化決策狀態：把個人運勢映射為「行為紀律」向度，刻意不輸出任何市場方向或財運預測。
 *  用途是提醒交易者今天自身的決策清明度與破紀律風險，核心結論恆為「訊號照做、勿手動干預」。 */
export interface QuantState {
  date: string;
  clarity: number;          // 判斷清明度（越高越冷靜）
  disciplineRisk: number;   // 破紀律風險（越高越易手動凌駕系統）
  stability: number;        // 情緒穩定度
  execution: number;        // 執行力
  overrideUrge: "低" | "中" | "高"; // 想凌駕系統的傾向
  flags: string[];
}

export function quantState(p: Profile, dateStr: string): QuantState {
  const fr = computeFortune(p, { type: "daily", date: dateStr, topic: "decision" });
  const chart = computeBazi(p);
  const [qy, qm, qd] = dateStr.split("-").map(Number);
  const age = qy - Number(p.birthDate.split("-")[0]);
  const bf = baziFacts(chart, "daily", qy, qm, qd, age);
  const impulsive = ["傷官", "劫財", "七殺"].includes(bf.flowTenGod);
  const clash = bf.branchRelationToDay === "沖" || bf.branchRelationToDay === "刑";

  const clarity = clamp(fr.scores.decision - (clash ? 8 : 0));
  const disciplineRisk = clamp(fr.scores.risk + (impulsive ? 12 : 0) + (clash ? 8 : 0));
  const stability = clamp(100 - disciplineRisk * 0.7 - (impulsive ? 8 : 0));
  const execution = clamp((fr.scores.career + fr.scores.decision) / 2);
  const overrideUrge = disciplineRisk >= 62 ? "高" : disciplineRisk >= 45 ? "中" : "低";

  const flags: string[] = [];
  if (impulsive) flags.push(`流日帶「${bf.flowTenGod}」，今日較易衝動、想憑感覺加減碼——正是該嚴格照訊號的一天。`);
  if (clash) flags.push("流日與本命日支相沖／刑，情緒起伏較大，避免在波動中臨時改規則。");
  if (overrideUrge === "高") flags.push("破紀律風險偏高：今天「想凌駕系統」的衝動最強，建議只執行訊號、不要臨場手動下單。");
  if (overrideUrge === "低") flags.push("決策狀態相對穩定，但仍以系統訊號為唯一依據，勿因『今天運勢好』而加大部位。");
  if (clarity < 40) flags.push("判斷清明度偏低，重大策略參數調整、上線新策略建議改日再做。");
  return { date: dateStr, clarity, disciplineRisk, stability, execution, overrideUrge, flags };
}

/** 掃描當日 12 時辰，以奇門日干落宮吉凶挑出較有利的時辰。 */
export function bestHours(qy: number, qm: number, qd: number, top = 2): string {
  const scored = SHI_CHEN.map(s => {
    const c = computeQimen(qy, qm, qd, `${String(s.hour).padStart(2, "0")}:30`);
    const f = qimenFacts(c);
    let sc = 0;
    if (f.dayPalaceGood) sc += 2;
    if (f.dayPalaceBad) sc -= 2;
    if (["開門", "生門", "休門"].includes(f.dayPalaceDoor)) sc += 1;
    if (["死門", "驚門", "傷門"].includes(f.dayPalaceDoor)) sc -= 1;
    return { ...s, sc };
  });
  const best = scored.filter(x => x.sc > 0).sort((a, b) => b.sc - a.sc).slice(0, top);
  if (!best.length) return "今日各時辰相對平穩，無特別突出之吉時";
  return best.map(s => `${s.name}時（${s.range}時）`).join("、");
}

/** 十神 → 各維加減分（日主有力時財官得分提高） */
function tenGodDeltas(tg: TenGod, fav: boolean, strong: boolean): Partial<Scores> {
  const f = fav ? 1 : -0.4;
  switch (tg) {
    case "正財": return { wealth: (strong ? 12 : 4) * f, career: 3 * f };
    case "偏財": return { wealth: (strong ? 10 : 2) * f, risk: strong ? 2 : 8 };
    case "正官": return { career: 10 * f, people: 4 * f };
    case "七殺": return { career: 5 * f, risk: 8, decision: strong ? 5 : -5 };
    case "正印": return { career: 7 * f, health: 4, decision: 5 * f };
    case "偏印": return { decision: 4 * f, relationship: -3 };
    case "食神": return { relationship: 7 * f, wealth: 4 * f, health: 3 };
    case "傷官": return { people: -6, career: -4, wealth: 3 * f, risk: 5 };
    case "比肩": return { people: 5 * f, decision: 3 * f };
    case "劫財": return { wealth: -8, risk: 10, people: 2 };
  }
}

export interface ComputeQuery {
  type: "daily" | "monthly" | "yearly";
  date: string;        // YYYY-MM-DD / YYYY-MM / YYYY
  topic: Topic;
  time?: string;       // 奇門起局時間（預設 12:00）
}

export function computeFortune(p: Profile, q: ComputeQuery): FortuneResult {
  const chart: BaziChart = computeBazi(p);
  const parts = q.date.split("-").map(Number);
  const [qy, qm, qd] = [parts[0], parts[1] ?? 6, parts[2] ?? 15];
  const by = Number(p.birthDate.split("-")[0]);
  const age = qy - by;
  const scope = q.type;

  const conf = (scoring as any).confidenceFactor[p.birthTimeAccuracy] as number;
  const W = (scoring as any).systemWeights[scope] as { bazi: number; ziwei: number; qimen: number };
  const add: Record<string, number> = {}; CATS.forEach(c => (add[c] = 0));
  const bump = (d: Partial<Scores>, w: number) =>
    (Object.keys(d) as (keyof Scores)[]).forEach(k => (add[k] += (d[k] ?? 0) * w));

  // —— 八字 ——
  const bf = baziFacts(chart, scope, qy, qm, qd, age);
  bump(tenGodDeltas(bf.flowTenGod, bf.isFavorable, chart.strength >= 50), W.bazi * 2.2);
  if (bf.isFavorable) bump({ overall: 10, decision: 6 }, W.bazi * 2.2);
  else bump({ overall: -8, risk: 6 }, W.bazi * 2.2);
  if (bf.branchRelationToDay === "沖") bump({ overall: -8, risk: 10, health: -4 }, W.bazi * 2.2);
  if (bf.branchRelationToDay === "六合" || bf.branchRelationToDay === "三合") bump({ people: 6, relationship: 5 }, W.bazi * 2.2);
  if (bf.branchRelationToDay === "刑") bump({ people: -5, risk: 6 }, W.bazi * 2.2);
  if (bf.luckFavorable === true) bump({ overall: 5, career: 4 }, W.bazi);
  if (bf.luckFavorable === false) bump({ overall: -4 }, W.bazi);

  // —— 紫微（流年四化落宮） ——
  const triggered: TriggeredRule[] = [];
  const zw = computeZiwei(p);
  if (zw) {
    // 紫微年界採農曆正月初一（與安星一致），不用八字的立春界
    const qlu = lunarDate(qy, qm, qd);
    const zwYear = qlu.month >= 11 && qm <= 2 ? qy - 1 : qy;
    const flowYearStem = STEMS[((zwYear - 4) % 10 + 10) % 10];
    const zf = ziweiFacts(zw, flowYearStem);
    const hit = (k: string, pal: string, d: Partial<Scores>, msg: string) => {
      if (zf.hua[k] === pal) { bump(d, W.ziwei * 2.2); triggered.push({ ruleId: `zw_${k}_${pal}`, system: "ziwei", level: (d.risk ?? 0) > 0 || (d.wealth ?? 0) < 0 ? "caution" : "positive", explanation: msg, strategy: "", weight: 6 }); }
    };
    hit("祿", "財帛", { wealth: 10, overall: 4 }, `流年化祿入財帛宮，財務面有機會點，仍以紀律為先。`);
    hit("祿", "官祿", { career: 10, overall: 4 }, `流年化祿入官祿宮，事業推進較順。`);
    hit("權", "官祿", { career: 8, decision: 5 }, `流年化權入官祿宮，掌握度與主導性提升。`);
    hit("忌", "財帛", { wealth: -12, risk: 10 }, `流年化忌入財帛宮，財務決策需特別保守，留意資訊不全。`);
    hit("忌", "官祿", { career: -8, risk: 6 }, `流年化忌入官祿宮，職場事務宜多查證、少承諾。`);
    hit("忌", "疾厄", { health: -8 }, `流年化忌入疾厄宮，留意作息與既有健康問題追蹤。`);
    hit("科", "命宮", { people: 6, overall: 3 }, `流年化科入命宮，利於名聲與貴人引薦。`);
  }

  // —— 奇門（以查詢時間起局，日干用神落宮） ——
  const qmChart = computeQimen(qy, qm, qd, q.time ?? "12:00");
  const qf = qimenFacts(qmChart);
  if (qf.dayPalaceGood) bump({ overall: 8, decision: 8, wealth: 4 }, W.qimen * 2.2);
  if (qf.dayPalaceBad) bump({ overall: -8, decision: -6, risk: 8 }, W.qimen * 2.2);
  if (["生門","開門"].includes(qf.dayPalaceDoor)) bump({ wealth: 6, career: 5 }, W.qimen * 2.2);
  if (qf.dayPalaceDoor === "死門") bump({ wealth: -6, overall: -4 }, W.qimen * 2.2);
  if (["白虎","玄武"].includes(qf.dayPalaceGod)) bump({ risk: 8, people: -4 }, W.qimen * 2.2);

  // —— 規則 JSON ——
  const facts = {
    scope,
    dayFortuneTenGod: bf.flowTenGod, dayFortuneElement: bf.flowElement,
    dayMasterStrength: chart.strength, dayBranchRelation: bf.branchRelationToDay,
    favorableElements: chart.favorable, isFavorableDay: bf.isFavorable,
    qimenDoor: qf.dayPalaceDoor, qimenGod: qf.dayPalaceGod,
  };
  const rr = runRules(baziRules as unknown as FortuneRule[], facts, scope);
  // conf 於合成階段統一乘一次，這裡不可再乘（否則 JSON 規則被打 conf²）
  Object.entries(rr.deltas).forEach(([k, v]) => (add[k] = (add[k] ?? 0) + v * W.bazi));
  triggered.push(...rr.triggered);

  // —— 合成 ——
  const base = (scoring as any).baseScore as number;
  const scores = Object.fromEntries(
    CATS.map(c => [c, clamp(base + add[c] * conf * (c === "risk" ? 1 : 1))]),
  ) as unknown as Scores;
  scores.risk = clamp(30 + add.risk * conf); // 風險為正向累加（越高越需留意）
  scores.overall = clamp((scores.overall * 2 + scores.career + scores.wealth + scores.people + (100 - scores.risk)) / 5);

  // 建議事項
  const suitable: string[] = []; const avoid: string[] = [];
  if (bf.isFavorable) suitable.push("推進既定計畫", "整理與彙報");
  if (["正財","偏財"].includes(bf.flowTenGod) && chart.strength >= 50) suitable.push("檢視部位與帳務");
  if (["正官","正印"].includes(bf.flowTenGod)) suitable.push("向上溝通、簽核文書");
  if (qf.dayPalaceGood) suitable.push(`往${qmChart.goodDirs[0] ?? "吉方"}方洽事`);
  if (bf.flowTenGod === "劫財") avoid.push("臨時起意的金錢決定", "與人合資或借貸");
  if (bf.flowTenGod === "傷官") avoid.push("與長官正面交鋒", "簽訂重要承諾");
  if (bf.branchRelationToDay === "沖") avoid.push("重大變動與遠行衝刺");
  if (qf.dayPalaceBad) avoid.push("高風險操作與爭執場合");
  if (!suitable.length) suitable.push("按部就班處理例行事務");
  if (!avoid.length) avoid.push("無特別禁忌，仍依紀律行事");

  const confidence = p.birthTimeAccuracy === "exact" ? "high" : p.birthTimeAccuracy === "approximate" ? "medium" : "low";

  return {
    type: q.type, targetDate: q.date, topic: q.topic, scores,
    suitableActions: [...new Set(suitable)].slice(0, 5),
    avoidActions: [...new Set(avoid)].slice(0, 5),
    bestDirection: qmChart.goodDirs.join("、") || "無明顯吉方",
    bestTimeRange: q.type === "daily" ? bestHours(qy, qm, qd) : "可改用「日」模式查單日吉時",
    triggeredRules: triggered,
    summary: `${q.date} 流${scope === "daily" ? "日" : scope === "monthly" ? "月" : "年"}干支 ${bf.flowGz}，對日主 ${chart.dayMaster}（${chart.strengthLabel}）為${bf.flowTenGod}${bf.isFavorable ? "，五行屬喜用" : "，五行非喜用"}${bf.branchRelationToDay ? `，地支見${bf.branchRelationToDay}` : ""}。`,
    strategy: "",
    confidenceLevel: confidence,
    disclaimer: STANDARD_DISCLAIMER,
  };
}
