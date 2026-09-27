/** LifeFactorRegistry：各命理系統共用的「生活因素」詞彙表（中間語意層）。
 *
 *  - 八字、紫微、奇門、梅花的判讀結果一律轉成這裡的因素，不可各自發明同義名稱。
 *  - 因素不等於吉凶：同一個因素在不同主題可能是機會或干擾（見 kb/advice/topics.ts 的 natureOverrides），
 *    最後由 ActionAdviceEngine 依「因素＋主題＋時間尺度＋系統一致程度」決定怎麼建議。
 *  - label／plain 為一般模式用的白話，不得出現命理術語。 */

export type FactorCategory =
  | "opportunity" | "execution" | "decision" | "interpersonal" | "resource"
  | "change" | "wellbeing" | "travel" | "timing" | "trend" | "aptitude";

/** 預設讀法：support＝通常有助、risk＝通常需留意、context＝視主題而定 */
export type FactorNature = "support" | "risk" | "context";

export interface LifeFactorDef {
  category: FactorCategory;
  nature: FactorNature;
  label: string;        // 短標籤（有利／注意因素清單）
  plain: string;        // 放進句子的白話名詞片語（「今天有〔plain〕」「〔plain〕也比較高」），不含頓號
  description: string;  // 此因素的定義，供映射與審閱
}

const F = (category: FactorCategory, nature: FactorNature, label: string, plain: string, description: string): LifeFactorDef =>
  ({ category, nature, label, plain, description });

export const LIFE_FACTORS = {
  // 機會
  progressOpportunity: F("opportunity", "support", "推進機會", "推進事情的機會", "既有事務較容易往前推進、有所成"),
  newOpportunity: F("opportunity", "support", "新機會", "新的機會", "出現原本沒有的新機會"),
  changeOpportunity: F("opportunity", "support", "改變做法的機會", "打破僵局的機會", "卡住的狀況有機會因改變而鬆動"),
  responsibilityOpportunity: F("opportunity", "support", "承擔任務的機會", "承擔任務的機會", "承接任務、爭取職責較有利"),
  recognitionOpportunity: F("opportunity", "support", "表現被看見", "表現被看見的機會", "成果、專業或負責態度較容易被肯定"),
  leadershipOpportunity: F("opportunity", "support", "主導的機會", "主導事情的機會", "較容易取得主導權或做出成果"),
  expressionOpportunity: F("opportunity", "support", "表達順暢", "表達與提案的好時機", "說話、寫作、提案、展示較順"),
  learningOpportunity: F("opportunity", "support", "適合學習", "學習整理的好時機", "研讀、準備文件、進修較得心應手"),
  // 執行
  executionClarity: F("execution", "support", "做事踏實", "做事踏實的狀態", "執行面穩定、能持續投入"),
  executionResistance: F("execution", "risk", "推進有阻力", "推進受阻的可能", "事情較容易卡住、使不上力或碰壁"),
  delayRisk: F("execution", "risk", "進度可能延遲", "進度延遲的可能", "進度較慢、容易拖延"),
  recurringIssues: F("execution", "risk", "舊事重來", "舊問題重來的可能", "同樣的狀況重複出現、舊事重提"),
  workloadIncrease: F("execution", "risk", "負荷增加", "工作量增加的壓力", "被要求變多、瑣事或任務量增加"),
  planDisruptionRisk: F("execution", "risk", "計畫被打亂", "計畫被打亂的可能", "原本的安排容易被打亂或出小狀況"),
  transitionRisk: F("execution", "risk", "交接處易出錯", "交接出錯的可能", "階段轉換、交接處容易出問題"),
  errorRisk: F("execution", "risk", "小差錯", "小差錯的可能", "有小失誤或小遺憾，及時修正即可"),
  setbackRisk: F("execution", "risk", "做法可能有所失", "照原做法吃虧的可能", "照現在的做法容易有所失"),
  lowReturnOnAction: F("execution", "risk", "主動出擊效益低", "主動出擊白費力的可能", "此時主動出擊沒有明顯好處"),
  approachSensitivity: F("execution", "context", "做法決定結果", "做法影響結果的情況", "同一件事，方法與時機選對與否影響很大"),
  focusSupport: F("execution", "support", "適合專注獨處", "安靜專注的好時機", "適合獨處思考、研究、規劃"),
  focusDisruption: F("execution", "risk", "容易被打斷", "分心被打斷的可能", "注意力容易被人情或外務牽走"),
  // 決策
  decisionClarity: F("decision", "support", "判斷清楚", "思路清楚的狀態", "思緒沉穩、判斷較清楚"),
  decisionUncertainty: F("decision", "risk", "判斷反覆", "猶豫難決的可能", "猶豫、反覆、難以下決定"),
  judgmentBiasRisk: F("decision", "risk", "判斷易被牽動", "判斷被牽動的可能", "判斷容易被利益、人情或小利左右"),
  impulsivityRisk: F("decision", "risk", "容易衝動", "衝動行事的可能", "脾氣較急、容易衝動或怕錯過而追"),
  disciplineRisk: F("decision", "risk", "容易破壞紀律", "打破原則的衝動", "容易想例外一下、臨時改變原本規則"),
  // 人際
  supportAvailable: F("interpersonal", "support", "有人可協助", "願意協助你的人", "較容易遇到願意協助、支持你的人"),
  hierarchySupport: F("interpersonal", "support", "向上溝通較順", "向上溝通的好時機", "向上溝通、爭取支持較有利"),
  hierarchyPressure: F("interpersonal", "risk", "上級要求偏重", "來自上級的壓力", "被要求、被檢視或被瑣事與長輩意見壓住"),
  hierarchyFriction: F("interpersonal", "risk", "與上級易有摩擦", "與上級摩擦的可能", "與上級、規範或制度容易衝突"),
  cooperationSupport: F("interpersonal", "support", "合作順暢", "順暢的合作", "容易得到配合、合作與協調順暢"),
  cooperationFriction: F("interpersonal", "risk", "合作有摩擦", "合作摩擦的可能", "合作中容易出現分歧或爭執"),
  communicationSupport: F("interpersonal", "support", "溝通順暢", "順暢的溝通", "溝通、表達、互動較順"),
  communicationMisunderstandingRisk: F("interpersonal", "risk", "容易誤會", "被誤解的可能", "容易有誤會或暗中不順"),
  communicationConflictRisk: F("interpersonal", "risk", "容易起口角", "口角摩擦的可能", "容易有摩擦、爭執、口角"),
  trustRisk: F("interpersonal", "risk", "信任風險", "承諾落差的可能", "承諾、約定容易出現落差"),
  socialActivity: F("interpersonal", "context", "人情往來多", "較多的邀約與人情往來", "邀約、聚會、人情往來變多"),
  relationshipWarmth: F("interpersonal", "support", "互動有溫度", "溫暖的互動", "感情與人際互動較溫暖、有吸引力"),
  lowSocialEnergy: F("interpersonal", "context", "社交意願低", "偏低的社交意願", "較想獨處、社交意願偏低"),
  // 資源／財務
  resourceIncrease: F("resource", "support", "有實際收穫", "實際收穫的機會", "資源、收入或成果較容易到手"),
  resourceStability: F("resource", "support", "財務處理較穩", "穩定的財務處理", "理財、帳務、收入較穩定有把握"),
  resourceLossRisk: F("resource", "risk", "容易花費或被分走", "花費變多的可能", "容易花錢大方、被分走利益或勞心勞力"),
  cashFlowPressure: F("resource", "risk", "金錢壓力", "金錢上的壓力", "金錢與現實壓力偏重"),
  financialVolatility: F("resource", "risk", "財務波動", "財務波動的可能", "資產或收支波動變大"),
  unexpectedExpenseRisk: F("resource", "risk", "意外支出", "臨時支出的可能", "出現計畫外支出"),
  // 變動
  changeRisk: F("change", "risk", "變動與衝突", "變動與衝突的可能", "容易有變動、衝突或奔波"),
  instability: F("change", "risk", "狀態不穩", "狀態起伏的可能", "自身狀態或身邊關係變化較大"),
  externalInterference: F("change", "risk", "外在阻力", "外在的阻力", "外在阻力較大，硬推容易碰壁"),
  // 身心
  energySupport: F("wellbeing", "support", "精神體力較好", "不錯的精神體力", "精神、體力、身心狀態較好"),
  fatigueRisk: F("wellbeing", "risk", "容易疲累", "體力透支的可能", "體力、精神較易透支"),
  stressLoad: F("wellbeing", "risk", "身心壓力", "身心壓力", "身心負擔、煩躁或自我消耗"),
  recoveryNeed: F("wellbeing", "context", "需要休養", "休養的需要", "宜休息、保養、調整作息"),
  // 出行
  movementIncrease: F("travel", "context", "移動變多", "較多的外出移動", "出差、旅行、外勤等移動機會變多"),
  travelSupport: F("travel", "support", "出行較順", "順利的出行", "出行、移動較順利"),
  trafficDelayRisk: F("travel", "risk", "交通延誤", "交通延誤的可能", "交通、轉乘容易延誤"),
  scheduleDisruptionRisk: F("travel", "risk", "行程變動", "行程變動的可能", "行程容易臨時變動"),
  // 時機
  favorableTiming: F("timing", "support", "有較佳時段", "明顯較好的時段", "特定時段的外在條件明顯較好"),
  timingSensitive: F("timing", "context", "時段影響大", "時段影響大的情況", "外在時機較差或時段差異大，改時間較好"),
  // 走勢
  improvingTrend: F("trend", "support", "後段轉順", "後段轉順的走勢", "起步辛苦，後段會轉順"),
  weakeningTrend: F("trend", "risk", "後段吃力", "後段吃力的走勢", "起步可能順，越到後面越吃力"),
  // 長期特質（本命）
  aptitudeResources: F("aptitude", "context", "擅長經營資源", "經營資源的長處", "長期而言較擅長經營金錢與資源"),
  aptitudeResponsibility: F("aptitude", "context", "適合承擔責任", "承擔責任的長處", "長期而言適合承擔責任、在組織中發揮"),
  aptitudeExpression: F("aptitude", "context", "擅長表達", "表達與人際的長處", "長期而言擅長表達、創意與人際互動"),
  aptitudeStudy: F("aptitude", "context", "重思考學習", "思考與學習的長處", "長期而言重思考、學習與穩健判斷"),
} as const satisfies Record<string, LifeFactorDef>;

export type FactorId = keyof typeof LIFE_FACTORS;
export const FACTOR_IDS = Object.keys(LIFE_FACTORS) as FactorId[];
export const factorDef = (id: FactorId): LifeFactorDef => LIFE_FACTORS[id];
export const isFactorId = (x: string): x is FactorId => x in LIFE_FACTORS;
