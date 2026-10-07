/** AdviceRule 規則庫：生活因素 ＋ 主題 ＋ 時間尺度 → 行動建議（文字見 templates.ts）。
 *  條件只能引用 LifeFactor，不可寫「化忌就不要講話」「死門就不要做事」這類直接由命理名詞推出的建議；
 *  一律經過 命盤 → 關係 → 各術判讀 → 生活因素 → 主題判讀 之後才到這裡。 */
import type { FactorId } from "@/core/advice/factors";
import type { AdviceRule, Horizon } from "@/core/advice/types";
import type { TopicId } from "./topics";
import type { TemplateId } from "./templates";

export const ADVICE_RULES_VERSION = "1.0.0";

// 因素群組（只是條件的簡寫，仍是 LifeFactor）
const OPP: FactorId[] = ["progressOpportunity", "changeOpportunity", "responsibilityOpportunity", "leadershipOpportunity", "newOpportunity"];
const SUPPORT: FactorId[] = ["supportAvailable", "hierarchySupport", "cooperationSupport"];
const COMM_RISK: FactorId[] = ["communicationMisunderstandingRisk", "communicationConflictRisk"];
const EXEC_RISK: FactorId[] = ["executionResistance", "delayRisk", "planDisruptionRisk", "externalInterference"];
const LOAD: FactorId[] = ["workloadIncrease", "hierarchyPressure"];
const DECISION_RISK: FactorId[] = ["decisionUncertainty", "judgmentBiasRisk"];
const IMPULSE: FactorId[] = ["impulsivityRisk", "disciplineRisk", "judgmentBiasRisk"];
const RES_UP: FactorId[] = ["resourceIncrease", "resourceStability"];
const RES_DOWN: FactorId[] = ["resourceLossRisk", "cashFlowPressure", "financialVolatility", "unexpectedExpenseRisk"];
const CHANGE: FactorId[] = ["changeRisk", "instability"];
const FATIGUE: FactorId[] = ["fatigueRisk", "stressLoad", "recoveryNeed"];
const SETBACK: FactorId[] = ["setbackRisk", "lowReturnOnAction"];
const ERRORS: FactorId[] = ["errorRisk", "transitionRisk"];

const SHORT: Horizon[] = ["today", "next3Days", "atTime"];
const NOW: Horizon[] = ["today", "atTime"];
const MID: Horizon[] = ["thisMonth", "thisYear", "longTerm"];
const LONG: Horizon[] = ["longTerm"];

const WORK: TopicId[] = ["career", "promotion", "jobSearch", "jobChange"];

let seq = 0;
const R = (
  id: string, topics: TopicId[], horizons: Horizon[], when: AdviceRule["when"], priority: number,
  t: { action?: TemplateId; avoid?: TemplateId }, reason: string, semanticKey: string,
  opts: Partial<Pick<AdviceRule, "conflictPolicy" | "baseConfidence">> = {},
): AdviceRule => {
  seq++;
  return { adviceRuleId: id, topics, horizons, when, priority, ...t, reason, semanticKey, conflictPolicy: opts.conflictPolicy ?? "normal", baseConfidence: opts.baseConfidence ?? "medium" };
};

export const ADVICE_RULES: AdviceRule[] = [
  // ───────── 綜合 ─────────
  R("GENERAL_PUSH_001", ["general"], SHORT, { any: ["progressOpportunity", "changeOpportunity", "leadershipOpportunity"], none: SETBACK }, 70, { action: "GEN_PUSH_ONE" }, "有推進事情的機會", "push-one", { conflictPolicy: "suppressOnConflict" }),
  R("GENERAL_HELP_001", ["general"], SHORT, { any: SUPPORT }, 62, { action: "GEN_ASK_HELP" }, "有人可以協助", "ask-help"),
  R("GENERAL_WRITTEN_001", ["general"], SHORT, { any: COMM_RISK }, 72, { action: "GEN_WRITE_CONFIRM", avoid: "GEN_AVOID_ANGRY_REPLY" }, "溝通較容易出現誤會或摩擦", "written-confirm"),
  R("GENERAL_BUFFER_001", ["general"], SHORT, { any: EXEC_RISK }, 60, { avoid: "GEN_AVOID_OVERPACK" }, "推進時較容易遇到阻力或打亂", "buffer"),
  R("GENERAL_LOAD_001", ["general"], SHORT, { any: LOAD }, 68, { action: "GEN_FINISH_FIRST", avoid: "GEN_AVOID_YES_TO_ALL" }, "要求與負荷偏重", "finish-first"),
  R("GENERAL_DECIDE_001", ["general"], SHORT, { any: [...DECISION_RISK, "impulsivityRisk"] }, 64, { action: "GEN_WRITE_OPTIONS", avoid: "GEN_AVOID_SNAP_DECISION" }, "判斷較容易反覆或被牽動", "write-options"),
  R("GENERAL_CHECK_001", ["general"], SHORT, { any: ERRORS }, 58, { action: "GEN_DOUBLE_CHECK" }, "較容易出現小差錯", "double-check"),
  R("GENERAL_PREPARE_001", ["general"], SHORT, { any: SETBACK }, 74, { action: "GEN_PREPARE_MODE", avoid: "GEN_AVOID_IRREVERSIBLE" }, "照原做法主動出擊的效益偏低", "irreversible"),
  R("GENERAL_REST_001", ["general"], SHORT, { any: FATIGUE }, 56, { action: "GEN_REST" }, "體力與身心負擔偏重", "rest"),
  R("GENERAL_ENERGY_001", ["general"], SHORT, { any: ["energySupport"], none: ["fatigueRisk"] }, 40, { action: "GEN_USE_ENERGY" }, "精神體力相對好", "use-energy"),
  R("GENERAL_TIMING_001", ["general"], NOW, { any: ["favorableTiming"] }, 55, { action: "GEN_USE_BEST_HOURS" }, "有明顯較佳的時段", "best-hours"),
  R("GENERAL_TIMING_002", ["general"], SHORT, { any: ["timingSensitive"] }, 52, { action: "GEN_RESCHEDULE" }, "時段的影響較大", "reschedule"),
  R("GENERAL_DISTRACT_001", ["general"], SHORT, { all: ["focusDisruption"] }, 50, { avoid: "GEN_AVOID_DISTRACTION" }, "容易被邀約或外務打斷", "distraction"),
  R("GENERAL_TREND_001", ["general"], SHORT, { any: ["improvingTrend"] }, 45, { action: "GEN_KEEP_GOING" }, "前面辛苦、後段轉順", "keep-going"),
  R("GENERAL_TREND_002", ["general"], SHORT, { any: ["weakeningTrend"] }, 54, { action: "GEN_FRONTLOAD" }, "起步順、後段吃力", "frontload"),
  R("GENERAL_FOCUS_001", ["general"], SHORT, { any: ["focusSupport"] }, 44, { action: "GEN_DEEP_WORK" }, "適合安靜專注", "deep-work"),
  R("GENERAL_OLD_001", ["general"], SHORT, { any: ["recurringIssues"] }, 57, { action: "GEN_CLOSE_OLD" }, "舊問題較容易重複出現", "close-old"),
  R("GENERAL_MID_PUSH", ["general"], MID, { any: OPP }, 60, { action: "GEN_MID_PUSH" }, "這段時間有推進與爭取的機會", "mid-push", { conflictPolicy: "suppressOnConflict" }),
  R("GENERAL_MID_LOAD", ["general", ...WORK], MID, { any: [...LOAD, "stressLoad"] }, 62, { action: "GEN_MID_LOAD" }, "這段時間要求與負荷偏重", "mid-load"),
  R("GENERAL_MID_COMM", ["general", "social", "cooperation"], MID, { any: [...COMM_RISK, "hierarchyFriction"] }, 61, { action: "GEN_MID_COMM" }, "這段時間人際上較容易有誤會或摩擦", "mid-comm"),
  R("GENERAL_MID_CHANGE", ["general", "decision", "property"], MID, { any: CHANGE }, 63, { action: "GEN_MID_CHANGE" }, "這段時間變動可能較多", "mid-change"),
  R("GENERAL_MID_MONEY", ["general", "wealth"], MID, { any: RES_DOWN }, 60, { action: "GEN_MID_MONEY" }, "這段時間財務壓力或花費偏多", "mid-money"),
  R("GENERAL_MID_HEALTH", ["general"], MID, { any: ["fatigueRisk", "recoveryNeed"] }, 55, { action: "GEN_MID_HEALTH" }, "這段時間體力消耗較大", "mid-health"),
  R("GENERAL_MID_NETWORK", ["general", "social", ...WORK], MID, { any: SUPPORT }, 50, { action: "GEN_MID_NETWORK" }, "這段時間較容易得到協助", "mid-network"),
  R("LONG_APT_RESOURCES", ["general", "wealth", "career", "jobChange", "jobSearch"], LONG, { any: ["aptitudeResources"] }, 35, { action: "LONG_APT_RESOURCES" }, "長期而言擅長經營資源", "apt-resources", { baseConfidence: "low" }),
  R("LONG_APT_RESPONSIBILITY", ["general", "career", "promotion", "jobChange", "jobSearch"], LONG, { any: ["aptitudeResponsibility"] }, 35, { action: "LONG_APT_RESPONSIBILITY" }, "長期而言適合承擔責任", "apt-responsibility", { baseConfidence: "low" }),
  R("LONG_APT_EXPRESSION", ["general", "career", "social", "jobChange", "jobSearch"], LONG, { any: ["aptitudeExpression"] }, 35, { action: "LONG_APT_EXPRESSION" }, "長期而言擅長表達", "apt-expression", { baseConfidence: "low" }),
  R("LONG_APT_STUDY", ["general", "career", "exam", "jobChange", "jobSearch"], LONG, { any: ["aptitudeStudy"] }, 35, { action: "LONG_APT_STUDY" }, "長期而言重思考學習", "apt-study", { baseConfidence: "low" }),

  // ───────── 工作 ─────────
  R("CAREER_PUSH_001", ["career"], SHORT, { any: ["progressOpportunity", "responsibilityOpportunity", "leadershipOpportunity"], none: SETBACK }, 72, { action: "CAREER_PUSH_PENDING" }, "工作上有推進的機會", "push-pending", { conflictPolicy: "suppressOnConflict" }),
  R("CAREER_BOSS_001", ["career"], SHORT, { any: ["hierarchySupport", "recognitionOpportunity"] }, 66, { action: "CAREER_ASK_BOSS_OPTIONS" }, "向上溝通或表現被看見的機會較好", "ask-boss"),
  R("CAREER_COMM_001", ["career"], SHORT, { any: [...COMM_RISK, "hierarchyFriction"] }, 74, { action: "CAREER_WRITE_CONFIRM", avoid: "CAREER_AVOID_EMOTIONAL_REPLY" }, "工作溝通較容易出現誤會或摩擦", "written-confirm"),
  R("CAREER_LOAD_001", ["career"], SHORT, { any: [...LOAD, "stressLoad"] }, 70, { action: "CAREER_FINISH_THEN_ACCEPT", avoid: "CAREER_AVOID_UNCLEAR_SCOPE" }, "工作要求與負荷偏重", "finish-first"),
  R("CAREER_EXEC_001", ["career"], SHORT, { any: EXEC_RISK }, 67, { action: "CAREER_SPLIT_STEPS", avoid: "CAREER_AVOID_NEW_FRONTS" }, "推進時較容易卡在流程或溝通", "split-steps"),
  R("CAREER_PRESENT_001", ["career"], SHORT, { any: ["expressionOpportunity", "communicationSupport"] }, 58, { action: "CAREER_PRESENT" }, "表達與提案較順", "present"),
  R("CAREER_HIERARCHY_001", ["career", "promotion"], SHORT, { any: ["hierarchyFriction"] }, 65, { avoid: "CAREER_AVOID_PUBLIC_CHALLENGE" }, "與上級或制度較容易有摩擦", "public-challenge"),
  R("CAREER_ROOT_001", ["career"], SHORT, { any: ["recurringIssues"] }, 55, { action: "CAREER_FIX_ROOT" }, "舊問題較容易重複出現", "close-old"),
  R("CAREER_CHECK_001", ["career"], SHORT, { any: ERRORS }, 57, { action: "CAREER_HANDOFF_CHECK" }, "交接與細節較容易出錯", "double-check"),
  R("CAREER_STUDY_001", ["career"], SHORT, { any: ["learningOpportunity", "focusSupport", "decisionClarity"] }, 46, { action: "CAREER_STUDY" }, "適合整理資料與學習", "study"),
  R("CAREER_DECIDE_001", ["career"], SHORT, { any: [...DECISION_RISK, "impulsivityRisk"] }, 60, { avoid: "CAREER_AVOID_SNAP_COMMIT" }, "判斷較容易反覆或被牽動", "snap-decision"),
  R("CAREER_TIMING_001", ["career", "promotion", "jobSearch"], NOW, { any: ["favorableTiming"] }, 54, { action: "CAREER_BEST_HOURS" }, "有明顯較佳的時段", "best-hours"),
  R("CAREER_TIMING_002", ["career"], NOW, { any: ["timingSensitive"] }, 53, { avoid: "CAREER_AVOID_HOURS" }, "部分時段條件較差", "avoid-hours"),
  R("CAREER_MID_GOAL", ["career"], MID, { any: [...OPP, "recognitionOpportunity"] }, 64, { action: "CAREER_MID_GOAL" }, "這段時間適合爭取表現", "mid-push", { conflictPolicy: "suppressOnConflict" }),
  R("CAREER_MID_SCOPE", ["career"], MID, { any: [...LOAD, "stressLoad"] }, 66, { action: "CAREER_MID_SCOPE" }, "這段時間工作要求偏重", "mid-load"),
  R("CAREER_MID_CHANGE", ["career"], MID, { any: [...CHANGE, "executionResistance"] }, 65, { action: "CAREER_MID_CHANGE" }, "這段時間工作上的變動與阻力較多", "mid-change"),
  R("CAREER_MID_RECORD", ["career"], MID, { any: [...COMM_RISK, "hierarchyFriction"] }, 63, { action: "CAREER_MID_RECORD" }, "這段時間工作溝通較容易有落差", "mid-comm"),

  // ───────── 升遷 ─────────
  R("PROMO_INTEREST_001", ["promotion"], SHORT, { any: ["responsibilityOpportunity", "recognitionOpportunity", "hierarchySupport", "progressOpportunity", "leadershipOpportunity"], none: SETBACK }, 72, { action: "PROMO_SIGNAL_INTEREST" }, "承擔任務、表現被看見或向上溝通的機會較好", "signal-interest", { conflictPolicy: "suppressOnConflict" }),
  R("PROMO_RESULTS_001", ["promotion"], SHORT, { any: ["recognitionOpportunity", "expressionOpportunity"] }, 64, { action: "PROMO_SHOW_RESULTS" }, "表現較容易被看見", "show-results"),
  R("PROMO_COMPLAIN_001", ["promotion"], SHORT, { any: [...COMM_RISK, "hierarchyPressure"] }, 66, { avoid: "PROMO_AVOID_COMPLAIN" }, "與上級的溝通較敏感", "public-challenge"),
  R("PROMO_INFO_001", ["promotion"], SHORT, { any: [...DECISION_RISK, ...SETBACK, "executionResistance"] }, 68, { action: "PROMO_GATHER_INFO", avoid: "PROMO_AVOID_ULTIMATUM" }, "判斷條件還不夠清楚", "gather-info"),
  R("PROMO_LOAD_001", ["promotion"], SHORT, { any: LOAD }, 60, { avoid: "PROMO_AVOID_OVERCOMMIT" }, "要求與負荷偏重", "finish-first"),
  R("PROMO_MID_001", ["promotion"], MID, { any: [...OPP, "recognitionOpportunity", "hierarchySupport"] }, 64, { action: "PROMO_MID_PLAN" }, "這段時間適合談發展方向", "mid-push", { conflictPolicy: "suppressOnConflict" }),

  // ───────── 求職 ─────────
  R("JOBS_APPLY_001", ["jobSearch"], SHORT, { any: ["progressOpportunity", "newOpportunity", "expressionOpportunity", "leadershipOpportunity"], none: SETBACK }, 70, { action: "JOBS_SEND_APPS" }, "有推進與表現的機會", "send-apps", { conflictPolicy: "suppressOnConflict" }),
  R("JOBS_REFERRAL_001", ["jobSearch"], SHORT, { any: SUPPORT }, 64, { action: "JOBS_ASK_REFERRAL" }, "有人可以協助", "ask-help"),
  R("JOBS_INTERVIEW_001", ["jobSearch"], SHORT, { any: ["expressionOpportunity", "communicationSupport", "recognitionOpportunity"] }, 62, { action: "JOBS_PREP_INTERVIEW" }, "表達與表現較順", "prep-interview"),
  R("JOBS_COMPARE_001", ["jobSearch"], SHORT, { any: [...DECISION_RISK, ...SETBACK, "executionResistance", "impulsivityRisk"] }, 66, { action: "JOBS_COMPARE", avoid: "JOBS_AVOID_RUSH_ACCEPT" }, "判斷條件還不夠清楚", "compare-options"),
  R("JOBS_OFFER_001", ["jobSearch"], SHORT, { any: COMM_RISK }, 63, { action: "JOBS_CONFIRM_OFFER" }, "條件溝通較容易出現落差", "written-confirm"),
  R("JOBS_PACE_001", ["jobSearch"], SHORT, { any: FATIGUE }, 55, { action: "JOBS_PACE" }, "身心壓力偏重", "rest"),
  R("JOBS_MID_001", ["jobSearch"], MID, { any: [...OPP, "learningOpportunity", ...EXEC_RISK] }, 60, { action: "JOBS_MID_PLAN" }, "這段時間適合補強求職條件", "mid-plan"),

  // ───────── 轉職 ─────────
  R("JOBC_EXPLORE_001", ["jobChange"], SHORT, { any: ["changeOpportunity", "progressOpportunity", "newOpportunity"], none: SETBACK }, 68, { action: "JOBC_EXPLORE" }, "有改變做法、往前推進的機會", "explore", { conflictPolicy: "suppressOnConflict" }),
  R("JOBC_OPTIONS_001", ["jobChange"], SHORT, { any: [...DECISION_RISK, ...SETBACK, "executionResistance", "changeRisk", "instability"] }, 72, { action: "JOBC_BUILD_OPTIONS", avoid: "JOBC_AVOID_QUIT_IMPULSE" }, "判斷條件還不夠清楚，或變動較大", "build-options"),
  R("JOBC_BRIDGE_001", ["jobChange"], SHORT, { any: [...COMM_RISK, "hierarchyFriction"] }, 64, { avoid: "JOBC_AVOID_BURN_BRIDGE" }, "與主管或同事較容易有摩擦", "public-challenge"),
  R("JOBC_CASH_001", ["jobChange"], SHORT, { any: RES_DOWN }, 66, { action: "JOBC_CASH_BUFFER" }, "財務壓力或花費偏多", "cash-buffer"),
  R("JOBC_INSIDER_001", ["jobChange"], SHORT, { any: SUPPORT }, 58, { action: "JOBC_ASK_INSIDER" }, "有人可以協助", "ask-help"),
  R("JOBC_MID_001", ["jobChange"], MID, { any: [...CHANGE, "changeOpportunity", ...DECISION_RISK, ...OPP] }, 62, { action: "JOBC_MID" }, "這段時間工作方向可能有變化", "mid-plan"),

  // ───────── 請假 ─────────
  R("LEAVE_APPLY_001", ["leave"], [...SHORT, ...MID], { any: [...LOAD, "hierarchyPressure", "responsibilityOpportunity", "delayRisk"] }, 70, { action: "LEAVE_APPLY", avoid: "LEAVE_AVOID_KEY_DAY" }, "工作上有待處理或需要你在場的事", "leave-apply"),
  R("LEAVE_REST_001", ["leave"], SHORT, { any: FATIGUE }, 74, { action: "LEAVE_REST", avoid: "LEAVE_AVOID_WORK_CHECK" }, "體力與精神較需要恢復", "leave-rest"),
  R("LEAVE_GO_001", ["leave"], SHORT, { any: ["movementIncrease", "travelSupport", "energySupport"], none: ["trafficDelayRisk", "scheduleDisruptionRisk", ...FATIGUE] }, 66, { action: "LEAVE_GO_OUT" }, "出行與精神條件不錯", "leave-go", { conflictPolicy: "suppressOnConflict" }),
  R("LEAVE_FAMILY_001", ["leave"], SHORT, { any: ["relationshipWarmth", "cooperationSupport", "communicationSupport"], none: COMM_RISK }, 62, { action: "LEAVE_FAMILY" }, "與家人伴侶互動較順", "leave-family"),
  R("LEAVE_ERRANDS_001", ["leave"], SHORT, { any: ["executionClarity", "resourceStability", "decisionClarity"] }, 56, { action: "LEAVE_ERRANDS", avoid: "LEAVE_AVOID_OVERPLAN" }, "處理事情較有條理", "leave-errands"),
  R("LEAVE_HOURS_001", ["leave"], NOW, { any: ["favorableTiming", "hierarchySupport"] }, 52, { action: "LEAVE_BEST_HOURS" }, "有較佳的時段開口", "best-hours"),
  R("CONFLICT_LEAVE_001", ["leave"], [...SHORT, ...MID], {}, 74, { action: "CONFLICT_LEAVE", avoid: "LEAVE_AVOID_OVERPLAN" }, "不同系統的訊號不一致", "conflict-method", { conflictPolicy: "conflictOnly", baseConfidence: "medium" }),

  // ───────── 辭職 ─────────
  R("RESIGN_PREP_001", ["resign"], [...SHORT, ...MID], { any: [...DECISION_RISK, ...RES_DOWN, ...SETBACK, "changeRisk", "instability"] }, 74, { action: "RESIGN_PREPARE", avoid: "RESIGN_AVOID_IMPULSE" }, "判斷條件或財務狀況還不夠穩", "resign-prepare"),
  R("RESIGN_TALK_001", ["resign"], SHORT, { any: ["hierarchySupport", "communicationSupport", "decisionClarity", "changeOpportunity"], none: [...COMM_RISK, "hierarchyFriction"] }, 64, { action: "RESIGN_TALK" }, "溝通與判斷條件較好", "resign-talk", { conflictPolicy: "suppressOnConflict" }),
  R("RESIGN_HANDOVER_001", ["resign"], [...SHORT, ...MID], { any: [...ERRORS, "delayRisk", "workloadIncrease"] }, 62, { action: "RESIGN_HANDOVER" }, "交接與細節較容易出狀況", "resign-handover"),
  R("RESIGN_BRIDGE_001", ["resign"], SHORT, { any: [...COMM_RISK, "hierarchyFriction", "impulsivityRisk"] }, 70, { avoid: "JOBC_AVOID_BURN_BRIDGE" }, "與主管或同事較容易有摩擦", "public-challenge"),
  R("RESIGN_WRITTEN_001", ["resign"], SHORT, { any: [...COMM_RISK, "trustRisk", "changeRisk"] }, 60, { avoid: "RESIGN_AVOID_VERBAL" }, "說法較容易出現落差", "written-confirm"),
  R("RESIGN_HOURS_001", ["resign"], NOW, { any: ["favorableTiming"] }, 52, { action: "RESIGN_BEST_HOURS" }, "有較佳的時段開口", "best-hours"),
  R("RESIGN_MID_001", ["resign"], MID, { any: [...CHANGE, "changeOpportunity", ...DECISION_RISK] }, 60, { action: "JOBC_MID" }, "這段時間適合先累積選項", "mid-jobchange"),
  R("CONFLICT_RESIGN_001", ["resign"], [...SHORT, ...MID], {}, 74, { action: "CONFLICT_RESIGN", avoid: "RESIGN_AVOID_IMPULSE" }, "不同系統的訊號不一致", "conflict-method", { conflictPolicy: "conflictOnly", baseConfidence: "medium" }),
  // 主觀停損、主觀停利：只談處理的時段、心態與做法，不判斷漲跌，也不決定要不要停損停利
  R("SL_THESIS_001", ["stopLoss"], SHORT, { any: [...DECISION_RISK, ...SETBACK, "weakeningTrend", ...RES_DOWN] }, 72, { action: "SL_CHECK_THESIS", avoid: "SL_AVOID_AVERAGE_DOWN" }, "判斷容易猶豫，或損失擴大的壓力偏高", "sl-thesis"),
  R("SL_EXECUTE_001", ["stopLoss"], SHORT, { any: ["decisionClarity", "favorableTiming", "resourceStability"], none: IMPULSE }, 64, { action: "SL_EXECUTE" }, "判斷相對清楚", "sl-execute"),
  R("SL_PANIC_001", ["stopLoss"], SHORT, { any: [...IMPULSE, ...FATIGUE, "financialVolatility"] }, 74, { action: "INV_FOLLOW_RULES", avoid: "SL_AVOID_PANIC" }, "容易衝動，或身心狀態不穩", "sl-panic"),
  R("SL_LIVING_001", ["stopLoss"], [...SHORT, ...MID], { any: ["cashFlowPressure", "unexpectedExpenseRisk", "resourceLossRisk"] }, 68, { action: "SL_CHECK_LIVING" }, "資金壓力或意外支出的可能偏高", "sl-living"),
  R("SL_ORDER_001", ["stopLoss"], SHORT, { any: ERRORS }, 60, { action: "INV_ORDER_CHECK" }, "較容易出現操作上的小差錯", "order-check"),
  R("SL_HOURS_001", ["stopLoss"], NOW, { any: ["favorableTiming", "timingSensitive"] }, 56, { action: "SL_BEST_HOURS" }, "時段的影響比較明顯", "best-hours"),
  R("SL_MID_001", ["stopLoss"], MID, { any: [...IMPULSE, ...RES_DOWN, ...CHANGE, "decisionUncertainty"] }, 60, { action: "SL_MID_RULES" }, "這段時間適合把停損條件寫清楚", "sl-mid"),
  R("CONFLICT_STOPLOSS_001", ["stopLoss"], [...SHORT, ...MID], {}, 74, { action: "CONFLICT_STOPLOSS", avoid: "SL_AVOID_AVERAGE_DOWN" }, "不同系統的訊號不一致", "conflict-method", { conflictPolicy: "conflictOnly", baseConfidence: "medium" }),
  R("TP_STAGED_001", ["takeProfit"], SHORT, { any: ["decisionClarity", "favorableTiming", ...RES_UP, ...OPP], none: IMPULSE }, 66, { action: "TP_STAGED" }, "判斷相對清楚", "tp-staged"),
  R("TP_GREED_001", ["takeProfit"], SHORT, { any: IMPULSE }, 74, { action: "INV_FOLLOW_RULES", avoid: "TP_AVOID_RAISE_TARGET" }, "容易衝動或想打破自己的規則", "tp-greed"),
  R("TP_PROTECT_001", ["takeProfit"], SHORT, { any: [...CHANGE, "financialVolatility", "weakeningTrend", ...SETBACK] }, 70, { action: "TP_PROTECT" }, "變動或波動可能偏大", "tp-protect"),
  R("TP_EARLY_001", ["takeProfit"], SHORT, { any: [...FATIGUE, "decisionUncertainty", "trustRisk", "externalInterference"] }, 64, { avoid: "TP_AVOID_EARLY" }, "判斷較容易受情緒或外界消息影響", "tp-early"),
  R("TP_MONEY_001", ["takeProfit"], [...SHORT, ...MID], { any: ["cashFlowPressure", "unexpectedExpenseRisk", ...RES_UP] }, 60, { action: "TP_PLAN_MONEY" }, "資金的用途需要先安排", "tp-money"),
  R("TP_ORDER_001", ["takeProfit"], SHORT, { any: ERRORS }, 60, { action: "INV_ORDER_CHECK" }, "較容易出現操作上的小差錯", "order-check"),
  R("TP_HOURS_001", ["takeProfit"], NOW, { any: ["favorableTiming", "timingSensitive"] }, 56, { action: "TP_BEST_HOURS" }, "時段的影響比較明顯", "best-hours"),
  R("TP_MID_001", ["takeProfit"], MID, { any: [...IMPULSE, ...CHANGE, "financialVolatility", "decisionUncertainty"] }, 58, { action: "TP_MID_RULES" }, "這段時間適合把出場條件寫清楚", "tp-mid"),
  R("CONFLICT_TAKEPROFIT_001", ["takeProfit"], [...SHORT, ...MID], {}, 74, { action: "CONFLICT_TAKEPROFIT", avoid: "TP_AVOID_RAISE_TARGET" }, "不同系統的訊號不一致", "conflict-method", { conflictPolicy: "conflictOnly", baseConfidence: "medium" }),

  // ───────── 財運 ─────────
  R("WEALTH_COLLECT_001", ["wealth"], SHORT, { any: RES_UP }, 66, { action: "WEALTH_COLLECT" }, "財務處理較穩、有實際收穫的機會", "collect"),
  R("WEALTH_NEGOTIATE_001", ["wealth"], SHORT, { all: ["resourceIncrease"], none: SETBACK }, 60, { action: "WEALTH_NEGOTIATE" }, "有實際收穫的機會", "negotiate", { conflictPolicy: "suppressOnConflict" }),
  R("WEALTH_EXPENSE_001", ["wealth"], SHORT, { any: RES_DOWN }, 72, { action: "WEALTH_LIST_EXPENSES", avoid: "WEALTH_AVOID_BIG_SPEND" }, "花費或金錢壓力偏重", "list-expenses"),
  R("WEALTH_IMPULSE_001", ["wealth"], SHORT, { any: IMPULSE }, 68, { avoid: "WEALTH_AVOID_IMPULSE_BUY" }, "判斷較容易被利益或衝動牽動", "impulse-spend"),
  R("WEALTH_WRITTEN_001", ["wealth"], SHORT, { any: [...COMM_RISK, "trustRisk"] }, 62, { action: "WEALTH_WRITE_MONEY" }, "金錢往來較容易有誤會", "written-confirm"),
  R("WEALTH_VENTURE_001", ["wealth"], SHORT, { any: [...SETBACK, "externalInterference"] }, 64, { avoid: "WEALTH_AVOID_NEW_VENTURE" }, "照原做法主動出擊的效益偏低", "irreversible"),
  R("WEALTH_MID_PLAN", ["wealth"], MID, { any: RES_UP }, 58, { action: "WEALTH_MID_PLAN" }, "這段時間收入面相對穩", "mid-money-plan"),
  R("WEALTH_MID_FLEX", ["wealth"], MID, { any: CHANGE }, 61, { action: "WEALTH_MID_FLEX" }, "這段時間財務狀況較容易變動", "mid-change"),
  R("WEALTH_MID_BUFFER", ["wealth", "property"], MID, { any: RES_DOWN }, 62, { action: "WEALTH_MID_BUFFER" }, "這段時間財務壓力偏重", "mid-money"),

  // ───────── 投資 ─────────
  R("INV_DISCIPLINE_001", ["investment"], SHORT, { any: IMPULSE }, 78, { action: "INV_FOLLOW_RULES", avoid: "INV_AVOID_CHASE" }, "容易衝動或想打破自己的規則", "follow-rules"),
  R("INV_EXECUTE_001", ["investment"], SHORT, { any: ["decisionClarity", "progressOpportunity", "resourceStability", "resourceIncrease"], none: [...IMPULSE, ...SETBACK] }, 62, { action: "INV_EXECUTE_PLAN" }, "判斷相對清楚", "execute-plan", { conflictPolicy: "suppressOnConflict" }),
  R("INV_WATCH_001", ["investment"], SHORT, { any: [...EXEC_RISK, "timingSensitive", ...SETBACK, ...RES_DOWN, "decisionUncertainty"] }, 70, { action: "INV_WATCHLIST", avoid: "INV_AVOID_NEWS_ENTRY" }, "時機或判斷條件較差", "watchlist"),
  R("INV_EXPOSURE_001", ["investment"], SHORT, { any: ["cashFlowPressure", "resourceLossRisk", "financialVolatility"] }, 66, { action: "INV_CHECK_EXPOSURE" }, "財務壓力或波動偏大", "check-exposure"),
  R("INV_TIRED_001", ["investment"], SHORT, { any: ["stressLoad", "fatigueRisk", "decisionUncertainty"] }, 60, { avoid: "INV_AVOID_TIRED_TRADES" }, "身心狀態或判斷不穩", "tired-trades"),
  R("INV_MID_001", ["investment"], MID, { any: [...IMPULSE, ...RES_DOWN, ...CHANGE, "decisionUncertainty"] }, 62, { action: "INV_MID_REVIEW" }, "這段時間適合檢視風險", "mid-review"),
  R("INV_SOURCE_001", ["investment"], SHORT, { any: ["trustRisk", ...COMM_RISK, "externalInterference"] }, 72, { action: "INV_VERIFY_SOURCE", avoid: "INV_AVOID_TIPS" }, "資訊較容易失真或受外界干擾", "verify-source"),
  R("INV_ORDER_001", ["investment"], SHORT, { any: ERRORS }, 68, { action: "INV_ORDER_CHECK" }, "較容易出現操作上的小差錯", "order-check"),
  R("INV_HOURS_001", ["investment"], NOW, { any: ["favorableTiming", "timingSensitive"] }, 58, { action: "INV_BEST_HOURS" }, "時段的影響比較明顯", "best-hours"),
  R("INV_HOURS_002", ["investment"], NOW, { any: ["timingSensitive"] }, 56, { avoid: "INV_AVOID_HOURS" }, "時段的影響比較明顯", "avoid-hours"),
  R("INV_RESEARCH_001", ["investment"], SHORT, { any: ["learningOpportunity", "focusSupport", "decisionClarity"], none: IMPULSE }, 60, { action: "INV_RESEARCH" }, "適合專注研究、判斷相對清楚", "research"),
  R("INV_LEVERAGE_001", ["investment"], [...SHORT, ...MID], { any: ["cashFlowPressure", "unexpectedExpenseRisk", "resourceLossRisk"] }, 70, { avoid: "INV_AVOID_LEVERAGE" }, "資金壓力或意外支出的可能偏高", "no-leverage"),
  R("INV_REVIEWER_001", ["investment"], SHORT, { any: ["supportAvailable", "hierarchySupport", "cooperationSupport"], none: IMPULSE }, 54, { action: "INV_ASK_REVIEW" }, "有人可以幫你檢查", "ask-review"),
  R("INV_PAUSE_001", ["investment"], SHORT, { all: [], any: [...SETBACK, "weakeningTrend"], none: ["decisionClarity", "resourceIncrease"] }, 66, { action: "INV_PAUSE_NEW" }, "照原做法主動出擊的效益偏低", "pause-new"),
  R("INV_MID_REBAL_001", ["investment"], MID, { any: [...CHANGE, "changeOpportunity", "financialVolatility"] }, 60, { action: "INV_MID_REBALANCE" }, "這段時間變動較多，適合固定節奏檢視", "mid-rebalance"),
  R("INV_MID_CONTRIB_001", ["investment"], MID, { any: RES_UP, none: ["cashFlowPressure"] }, 58, { action: "INV_MID_CONTRIB" }, "這段時間收入面相對穩", "mid-contrib"),
  R("INV_MID_JOURNAL_001", ["investment"], MID, { any: [...IMPULSE, "decisionUncertainty", "recurringIssues"] }, 59, { action: "INV_MID_JOURNAL" }, "這段時間判斷較容易反覆", "mid-journal"),
  R("INV_MID_CASH_001", ["investment"], MID, { any: ["cashFlowPressure", "unexpectedExpenseRisk"] }, 63, { action: "INV_MID_CASH" }, "這段時間財務壓力偏重", "mid-cash"),

  // ───────── 感情 ─────────
  R("LOVE_TALK_001", ["relationship"], SHORT, { any: ["relationshipWarmth", "communicationSupport"], none: [...COMM_RISK, ...SETBACK] }, 66, { action: "LOVE_TALK_OPEN" }, "互動較溫暖、溝通較順", "talk-open", { conflictPolicy: "suppressOnConflict" }),
  R("LOVE_TIME_001", ["relationship"], SHORT, { any: ["relationshipWarmth", "socialActivity"] }, 58, { action: "LOVE_QUALITY_TIME" }, "互動較有溫度", "quality-time"),
  R("LOVE_COMM_001", ["relationship"], SHORT, { any: COMM_RISK }, 74, { action: "LOVE_ASK_FIRST", avoid: "LOVE_AVOID_HEAT" }, "溝通較容易起誤會或摩擦", "ask-first"),
  R("LOVE_TIRED_001", ["relationship"], SHORT, { any: [...FATIGUE, "lowSocialEnergy"] }, 56, { action: "LOVE_SAY_TIRED" }, "體力或心情較疲", "say-tired"),
  R("LOVE_PROMISE_001", ["relationship", "marriage"], SHORT, { any: ["judgmentBiasRisk", "focusDisruption", "impulsivityRisk"] }, 62, { avoid: "LOVE_AVOID_PRESSURE_PROMISE" }, "判斷較容易被氣氛或人情牽動", "pressure-promise"),
  R("LOVE_STEADY_001", ["relationship"], SHORT, { any: CHANGE }, 64, { action: "LOVE_STEADY" }, "關係中的安排較容易變動", "steady"),
  R("LOVE_MID_TALK", ["relationship"], MID, { any: ["relationshipWarmth", "communicationSupport", "cooperationSupport"] }, 56, { action: "LOVE_MID_TALK" }, "這段時間互動較順", "mid-talk"),
  R("LOVE_MID_HABIT", ["relationship"], MID, { any: [...COMM_RISK, ...CHANGE] }, 60, { action: "LOVE_MID_HABIT" }, "這段時間較容易累積誤會", "mid-comm"),

  // ───────── 婚姻 ─────────
  R("MARRY_PLAN_001", ["marriage"], [...SHORT, ...MID], { any: ["relationshipWarmth", "communicationSupport", "cooperationSupport"], none: COMM_RISK }, 66, { action: "MARRY_DISCUSS_PLAN" }, "互動較順，適合談具體安排", "discuss-plan", { conflictPolicy: "suppressOnConflict" }),
  R("MARRY_COMM_001", ["marriage"], [...SHORT, ...MID], { any: [...COMM_RISK, "hierarchyPressure"] }, 72, { action: "MARRY_ONE_TOPIC", avoid: "MARRY_AVOID_FAMILY_CROSSFIRE" }, "溝通較容易起誤會或摩擦", "ask-first"),
  R("MARRY_RUSH_001", ["marriage"], [...SHORT, ...MID], { any: [...DECISION_RISK, ...SETBACK, ...CHANGE] }, 64, { avoid: "MARRY_AVOID_DEADLINE" }, "判斷條件或安排較容易變動", "rush-decision"),
  R("MARRY_BUDGET_001", ["marriage"], [...SHORT, ...MID], { any: RES_DOWN }, 60, { action: "MARRY_BUDGET" }, "金錢壓力或花費偏多", "budget"),

  // ───────── 人際 ─────────
  R("SOCIAL_RECONNECT_001", ["social"], SHORT, { any: ["cooperationSupport", "socialActivity", "communicationSupport", "relationshipWarmth"], none: COMM_RISK }, 60, { action: "SOCIAL_RECONNECT" }, "人際互動較順", "reconnect"),
  R("SOCIAL_ASK_001", ["social", "cooperation"], SHORT, { any: ["supportAvailable", "hierarchySupport"] }, 62, { action: "SOCIAL_ASK" }, "有人可以協助", "ask-help"),
  R("SOCIAL_CLARIFY_001", ["social"], SHORT, { any: [...COMM_RISK, "hierarchyFriction"] }, 72, { action: "SOCIAL_CLARIFY", avoid: "SOCIAL_AVOID_GROUP_ARGUE" }, "較容易有誤會或摩擦", "clarify"),
  R("SOCIAL_DECLINE_001", ["social"], SHORT, { any: ["lowSocialEnergy", "fatigueRisk", "stressLoad"] }, 54, { action: "SOCIAL_DECLINE_POLITELY" }, "社交意願或體力偏低", "decline"),
  R("SOCIAL_MONEY_001", ["social", "cooperation"], SHORT, { any: ["resourceLossRisk", "judgmentBiasRisk"] }, 64, { avoid: "SOCIAL_AVOID_MONEY_FAVOR" }, "容易因人情讓步或花費", "money-favor"),
  R("SOCIAL_SENIOR_001", ["social"], SHORT, { any: ["hierarchySupport"] }, 52, { action: "SOCIAL_SENIOR" }, "與前輩、長輩互動較順", "senior"),

  // ───────── 健康（只談作息） ─────────
  R("HEALTH_SLEEP_001", ["health"], [...SHORT, ...MID], { any: ["fatigueRisk", "recoveryNeed"] }, 72, { action: "HEALTH_SLEEP", avoid: "HEALTH_AVOID_OVERWORK" }, "體力與精神較易透支", "rest"),
  R("HEALTH_STRESS_001", ["health"], SHORT, { any: ["stressLoad"] }, 64, { action: "HEALTH_DECOMPRESS" }, "身心壓力偏重", "decompress"),
  R("HEALTH_ENERGY_001", ["health"], SHORT, { any: ["energySupport"], none: ["fatigueRisk"] }, 54, { action: "HEALTH_EXERCISE" }, "精神體力相對好", "exercise"),
  R("HEALTH_RUSH_001", ["health"], SHORT, { any: ["impulsivityRisk"] }, 60, { avoid: "HEALTH_AVOID_RUSH" }, "較容易急躁", "rush"),
  R("HEALTH_ROUTINE_001", ["health"], SHORT, { any: [...CHANGE, "planDisruptionRisk"] }, 58, { action: "HEALTH_ROUTINE" }, "作息較容易被打亂", "routine"),
  R("HEALTH_MID_001", ["health"], MID, { any: ["fatigueRisk", "stressLoad", "recoveryNeed", "energySupport"] }, 56, { action: "HEALTH_MID" }, "長期作息的提醒", "mid-health"),

  // ───────── 出行 ─────────
  R("TRAVEL_BUFFER_001", ["travel"], SHORT, { any: [...EXEC_RISK, "timingSensitive", ...CHANGE, ...SETBACK] }, 74, { action: "TRAVEL_BUFFER", avoid: "TRAVEL_AVOID_TIGHT" }, "行程較容易受阻或變動", "buffer"),
  R("TRAVEL_GO_001", ["travel"], SHORT, { any: ["movementIncrease", "progressOpportunity", "travelSupport"], none: [...EXEC_RISK, "timingSensitive", ...SETBACK] }, 60, { action: "TRAVEL_GO" }, "出行與移動較順", "go", { conflictPolicy: "suppressOnConflict" }),
  R("TRAVEL_TIMING_001", ["travel"], NOW, { any: ["favorableTiming"] }, 56, { action: "TRAVEL_BEST_HOURS" }, "有明顯較佳的時段", "best-hours"),
  R("TRAVEL_REST_001", ["travel"], SHORT, { any: FATIGUE }, 58, { action: "TRAVEL_REST" }, "體力較容易透支", "rest"),
  R("TRAVEL_SPEED_001", ["travel"], SHORT, { any: ["impulsivityRisk", "instability"] }, 62, { avoid: "TRAVEL_AVOID_SPEED" }, "較容易急躁或狀態不穩", "rush"),
  R("TRAVEL_BUDGET_001", ["travel"], SHORT, { any: ["resourceLossRisk", "unexpectedExpenseRisk"] }, 52, { action: "TRAVEL_BUDGET" }, "花費較容易增加", "budget"),

  // ───────── 合作 ─────────
  R("COOP_PUSH_001", ["cooperation"], [...SHORT, ...MID], { any: ["cooperationSupport", "supportAvailable", "communicationSupport"], none: COMM_RISK }, 64, { action: "COOP_PUSH" }, "合作與溝通較順", "coop-push", { conflictPolicy: "suppressOnConflict" }),
  R("COOP_WRITTEN_001", ["cooperation"], [...SHORT, ...MID], { any: [...COMM_RISK, "trustRisk", "cooperationFriction"] }, 76, { action: "COOP_WRITE_TERMS", avoid: "COOP_AVOID_VERBAL_ONLY" }, "合作條件較容易出現理解差異", "written-confirm"),
  R("COOP_FAVOR_001", ["cooperation"], SHORT, { any: ["resourceLossRisk", "judgmentBiasRisk"] }, 66, { avoid: "COOP_AVOID_FAVOR_TERMS" }, "較容易因人情讓步", "money-favor"),
  R("COOP_PILOT_001", ["cooperation"], [...SHORT, ...MID], { any: [...DECISION_RISK, ...SETBACK, "executionResistance"] }, 68, { action: "COOP_PILOT" }, "判斷條件還不夠清楚", "pilot"),
  R("COOP_CONTACT_001", ["cooperation"], SHORT, { any: ["hierarchyFriction", "communicationConflictRisk", "cooperationFriction"] }, 60, { action: "COOP_ONE_CONTACT" }, "合作中較容易有爭執", "one-contact"),

  // ───────── 訴訟（只談做事方法，不預測結果） ─────────
  R("LAW_ORGANIZE_001", ["lawsuit"], [...SHORT, ...MID], { any: ["decisionClarity", "learningOpportunity", "focusSupport", "executionClarity", "supportAvailable"] }, 62, { action: "LAW_ORGANIZE" }, "適合整理與專注處理資料", "organize"),
  R("LAW_DEADLINE_001", ["lawsuit"], [...SHORT, ...MID], { any: ["delayRisk", "planDisruptionRisk", "errorRisk", "transitionRisk", "executionResistance"] }, 70, { action: "LAW_DEADLINE" }, "進度與細節較容易出狀況", "deadline"),
  R("LAW_CONFRONT_001", ["lawsuit"], [...SHORT, ...MID], { any: [...COMM_RISK, "impulsivityRisk"] }, 72, { avoid: "LAW_AVOID_DIRECT_CONFRONT" }, "溝通較容易起衝突", "confront"),
  R("LAW_LAWYER_001", ["lawsuit"], [...SHORT, ...MID], { any: [...DECISION_RISK, ...SETBACK, "supportAvailable"] }, 68, { action: "LAW_ASK_LAWYER" }, "重要判斷需要專業協助", "ask-lawyer"),
  R("LAW_SIGN_001", ["lawsuit"], [...SHORT, ...MID], { any: ["judgmentBiasRisk", "impulsivityRisk", "errorRisk"] }, 66, { avoid: "LAW_AVOID_SIGN_UNREAD" }, "判斷較容易被牽動或出錯", "sign-unread"),

  // ───────── 考試 ─────────
  R("EXAM_NEW_001", ["exam"], SHORT, { any: ["learningOpportunity", "focusSupport", "decisionClarity"], none: ["focusDisruption", "fatigueRisk"] }, 62, { action: "EXAM_NEW_MATERIAL" }, "適合專注學習", "study"),
  R("EXAM_REVIEW_001", ["exam"], SHORT, { any: ["focusDisruption", "decisionUncertainty", ...FATIGUE] }, 70, { action: "EXAM_REVIEW", avoid: "EXAM_AVOID_CRAM" }, "專注力或體力較容易被分散", "review"),
  R("EXAM_CHECK_001", ["exam"], SHORT, { any: ERRORS }, 64, { action: "EXAM_CHECK" }, "較容易出現小差錯", "double-check"),
  R("EXAM_DISTRACT_001", ["exam"], SHORT, { any: ["socialActivity", "focusDisruption"] }, 58, { avoid: "EXAM_AVOID_DISTRACTION" }, "容易被邀約或外務打斷", "distraction"),
  R("EXAM_TIMING_001", ["exam"], NOW, { any: ["favorableTiming"] }, 52, { action: "EXAM_BEST_HOURS" }, "有明顯較佳的時段", "best-hours"),

  // ───────── 不動產 ─────────
  R("PROP_VIEW_001", ["property"], [...SHORT, ...MID], { any: [...RES_UP, "decisionClarity"], none: [...IMPULSE, ...SETBACK] }, 62, { action: "PROP_VIEW" }, "財務處理與判斷相對穩", "view", { conflictPolicy: "suppressOnConflict" }),
  R("PROP_LOAN_001", ["property"], [...SHORT, ...MID], { any: RES_DOWN }, 70, { action: "PROP_CALC_LOAN", avoid: "PROP_AVOID_STRETCH" }, "金錢壓力或花費偏多", "calc-loan"),
  R("PROP_DEPOSIT_001", ["property"], [...SHORT, ...MID], { any: [...IMPULSE, ...SETBACK, "decisionUncertainty"] }, 72, { action: "PROP_SECOND_VIEW", avoid: "PROP_AVOID_SPOT_DEPOSIT" }, "判斷較容易被氣氛或衝動牽動", "spot-deposit"),
  R("PROP_WRITTEN_001", ["property"], [...SHORT, ...MID], { any: [...COMM_RISK, "trustRisk"] }, 64, { action: "PROP_WRITE" }, "條件溝通較容易出現落差", "written-confirm"),

  // ───────── 決策 ─────────
  R("DEC_DECIDE_001", ["decision"], SHORT, { any: ["decisionClarity", "leadershipOpportunity"], none: [...DECISION_RISK, ...SETBACK] }, 64, { action: "DEC_DECIDE" }, "思路相對清楚", "decide", { conflictPolicy: "suppressOnConflict" }),
  R("DEC_CRITERIA_001", ["decision"], [...SHORT, ...MID], { any: [...DECISION_RISK, "impulsivityRisk"] }, 72, { action: "DEC_CRITERIA", avoid: "DEC_AVOID_PRESSURE" }, "判斷較容易反覆或被牽動", "write-options"),
  R("DEC_IRREVERSIBLE_001", ["decision"], [...SHORT, ...MID], { any: [...SETBACK, "weakeningTrend", ...CHANGE] }, 70, { action: "GEN_PREPARE_MODE", avoid: "GEN_AVOID_IRREVERSIBLE" }, "照原做法主動出擊的效益偏低", "irreversible"),
  R("DEC_METHOD_001", ["decision"], SHORT, { any: ["approachSensitivity", "timingSensitive"] }, 60, { action: "DEC_METHOD" }, "做法與時機影響較大", "method"),

  // ───────── 系統訊號矛盾時（各主題共用） ─────────
  // 依主題給具體做法；沒有專屬版本的主題用共用版本
  R("CONFLICT_INVEST_001", ["investment"], [...SHORT, ...MID], {}, 74, { action: "CONFLICT_INVEST", avoid: "CONFLICT_INVEST_AVOID" }, "不同系統的訊號不一致", "conflict-method", { conflictPolicy: "conflictOnly", baseConfidence: "medium" }),
  R("CONFLICT_WORK_001", WORK, [...SHORT, ...MID], {}, 74, { action: "CONFLICT_WORK", avoid: "CONFLICT_IRREVERSIBLE" }, "不同系統的訊號不一致", "conflict-method", { conflictPolicy: "conflictOnly", baseConfidence: "medium" }),
  R("CONFLICT_MONEY_001", ["wealth", "property"], [...SHORT, ...MID], {}, 74, { action: "CONFLICT_MONEY", avoid: "CONFLICT_IRREVERSIBLE" }, "不同系統的訊號不一致", "conflict-method", { conflictPolicy: "conflictOnly", baseConfidence: "medium" }),
  R("CONFLICT_PEOPLE_001", ["relationship", "marriage", "social"], [...SHORT, ...MID], {}, 74, { action: "CONFLICT_PEOPLE", avoid: "CONFLICT_IRREVERSIBLE" }, "不同系統的訊號不一致", "conflict-method", { conflictPolicy: "conflictOnly", baseConfidence: "medium" }),
  R("CONFLICT_TRAVEL_001", ["travel"], [...SHORT, ...MID], {}, 74, { action: "CONFLICT_TRAVEL", avoid: "CONFLICT_IRREVERSIBLE" }, "不同系統的訊號不一致", "conflict-method", { conflictPolicy: "conflictOnly", baseConfidence: "medium" }),
  R("CONFLICT_COOP_001", ["cooperation"], [...SHORT, ...MID], {}, 74, { action: "CONFLICT_COOP", avoid: "CONFLICT_IRREVERSIBLE" }, "不同系統的訊號不一致", "conflict-method", { conflictPolicy: "conflictOnly", baseConfidence: "medium" }),
  R("CONFLICT_HEALTH_001", ["health"], [...SHORT, ...MID], {}, 74, { action: "CONFLICT_HEALTH", avoid: "CONFLICT_IRREVERSIBLE" }, "不同系統的訊號不一致", "conflict-method", { conflictPolicy: "conflictOnly", baseConfidence: "medium" }),
  R("CONFLICT_DECISION_001", ["general", "lawsuit", "exam", "decision"], [...SHORT, ...MID], {}, 74, { action: "CONFLICT_REVERSIBLE", avoid: "CONFLICT_IRREVERSIBLE" }, "不同系統的訊號不一致", "conflict-method", { conflictPolicy: "conflictOnly", baseConfidence: "medium" }),
];

/** 共用規則（topics 為空）適用所有主題 */
export const rulesForTopic = (topic: TopicId) => ADVICE_RULES.filter(r => r.topics.length === 0 || r.topics.includes(topic));
export const ADVICE_RULE_COUNT = seq;
