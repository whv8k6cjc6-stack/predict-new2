/** AdviceTopicEngine 的主題定義：每個主題取哪些領域的判讀、覆蓋程度（topicCoverage）、因素讀法差異與安全類別。 */
import type { DomainKey } from "@/core/domains";
import type { EventKind } from "@/core/qimen";
import type { FactorId, FactorNature } from "@/core/advice/factors";

export type TopicId =
  | "general" | "career" | "promotion" | "jobSearch" | "jobChange" | "wealth" | "investment"
  | "relationship" | "marriage" | "social" | "health" | "travel" | "cooperation" | "lawsuit" | "exam" | "property" | "decision"
  | "leave" | "resign" | "stopLoss" | "takeProfit" | "leverage" | "liquidate";

/** dedicated：有該主題的判讀規則；partial：只有相近領域或部分規則；generalOnly：只有一般生活因素延伸；insufficient：本次沒有可用訊號 */
export type TopicCoverage = "dedicated" | "partial" | "generalOnly" | "insufficient";
export type SafetyCategory = "investment" | "health" | "legal";

export interface TopicDef {
  id: TopicId;
  label: string;
  question: string;                 // 一般模式的主題說法
  domains: DomainKey[];             // 取用哪些領域的判讀
  coverage: Exclude<TopicCoverage, "insufficient">;
  basisLabel: string;               // 判斷依據（一般模式可見）
  coverageNote?: string;            // 非專屬判讀時必須顯示
  timingKind: EventKind;            // 較佳／避開時段取奇門哪一類
  natureOverrides?: Partial<Record<FactorId, FactorNature>>;
  safety?: SafetyCategory;
}

const T = (d: TopicDef) => d;

export const ADVICE_TOPICS: Record<TopicId, TopicDef> = {
  general: T({ id: "general", label: "綜合", question: "今天整體怎麼安排", domains: ["overall", "career", "wealth", "investment", "social", "love", "travel", "health", "decision"], coverage: "dedicated", basisLabel: "綜合判讀", timingKind: "overall" }),
  career: T({ id: "career", label: "工作", question: "工作上怎麼做", domains: ["career"], coverage: "dedicated", basisLabel: "專屬工作判讀", timingKind: "career" }),
  promotion: T({
    id: "promotion", label: "升遷", question: "升遷與考核", domains: ["career"], coverage: "partial", basisLabel: "工作判讀延伸", timingKind: "career",
    coverageNote: "目前此主題尚未建立完整專屬命理判讀規則，本建議依工作領域判讀（含向上溝通、承擔任務）整理。",
  }),
  jobSearch: T({
    id: "jobSearch", label: "求職", question: "找工作、面試", domains: ["career", "decision"], coverage: "partial", basisLabel: "工作判讀延伸", timingKind: "career",
    coverageNote: "目前此主題尚未建立完整專屬命理判讀規則，本建議依工作與決策判讀整理；面試時段可在擇時功能另外查。",
  }),
  jobChange: T({
    id: "jobChange", label: "轉職", question: "要不要換工作", domains: ["career", "decision"], coverage: "partial", basisLabel: "工作判讀延伸", timingKind: "career",
    coverageNote: "目前此主題尚未建立完整專屬命理判讀規則，本建議依工作與決策判讀整理。",
    natureOverrides: { changeRisk: "context", instability: "context", movementIncrease: "context" },
  }),
  wealth: T({ id: "wealth", label: "財運", question: "收入、支出與金錢往來", domains: ["wealth"], coverage: "dedicated", basisLabel: "專屬財運判讀", timingKind: "wealth" }),
  investment: T({ id: "investment", label: "投資", question: "投資的節奏與風險", domains: ["investment"], coverage: "dedicated", basisLabel: "專屬投資判讀", timingKind: "investment", safety: "investment" }),
  relationship: T({ id: "relationship", label: "感情", question: "感情與伴侶互動", domains: ["love"], coverage: "dedicated", basisLabel: "專屬感情判讀", timingKind: "love" }),
  marriage: T({
    id: "marriage", label: "婚姻", question: "婚事與家庭安排", domains: ["love"], coverage: "partial", basisLabel: "感情判讀延伸", timingKind: "love",
    coverageNote: "目前此主題尚未建立完整專屬命理判讀規則，本建議依感情領域判讀整理。",
  }),
  social: T({ id: "social", label: "人際", question: "同事、朋友與人際往來", domains: ["social"], coverage: "dedicated", basisLabel: "專屬人際判讀", timingKind: "social" }),
  health: T({ id: "health", label: "健康", question: "作息與身心狀態", domains: ["health"], coverage: "dedicated", basisLabel: "生活作息判讀", timingKind: "health", safety: "health" }),
  travel: T({ id: "travel", label: "出行", question: "出門、出差與交通", domains: ["travel"], coverage: "dedicated", basisLabel: "專屬出行判讀", timingKind: "travel", natureOverrides: { movementIncrease: "support" } }),
  cooperation: T({
    id: "cooperation", label: "合作", question: "合作、談條件與分工", domains: ["social", "career"], coverage: "partial", basisLabel: "人際與工作判讀延伸", timingKind: "social",
    coverageNote: "目前此主題尚未建立完整專屬命理判讀規則，本建議依人際與工作判讀整理。",
  }),
  lawsuit: T({
    id: "lawsuit", label: "訴訟", question: "官司、爭議與法律程序", domains: ["decision", "social"], coverage: "generalOnly", basisLabel: "一般因素", timingKind: "decision", safety: "legal",
    coverageNote: "目前此主題尚未建立完整專屬命理判讀規則，本建議依一般決策／人際因素整理，不代表對訴訟結果的任何判斷。",
  }),
  exam: T({
    id: "exam", label: "考試", question: "讀書與考試", domains: ["decision", "career"], coverage: "generalOnly", basisLabel: "一般因素", timingKind: "decision",
    coverageNote: "目前此主題尚未建立完整專屬命理判讀規則，本建議依一般判斷與學習相關因素整理。",
  }),
  property: T({
    id: "property", label: "不動產", question: "看屋、買房、租屋", domains: ["wealth", "decision"], coverage: "partial", basisLabel: "財運與決策判讀延伸", timingKind: "wealth",
    coverageNote: "目前此主題尚未建立完整專屬命理判讀規則，本建議依財運與決策判讀整理；簽約時段可在擇時功能另外查。",
  }),
  leave: T({
    id: "leave", label: "請假", question: "要不要請假、請假當天怎麼安排", domains: ["career", "health", "travel", "love"], coverage: "partial", basisLabel: "工作、作息、出行與感情判讀延伸", timingKind: "leave",
    coverageNote: "目前此主題尚未建立完整專屬命理判讀規則，本建議依工作、作息、出行與感情判讀整理；准假與否以單位規定與主管決定為準。",
    natureOverrides: { movementIncrease: "support" },
  }),
  resign: T({
    id: "resign", label: "辭職", question: "提出辭職與離職安排", domains: ["career", "decision"], coverage: "partial", basisLabel: "工作與決策判讀延伸", timingKind: "resign",
    coverageNote: "目前此主題尚未建立完整專屬命理判讀規則，本建議依工作與決策判讀整理；預告期、特休與年資結算、離職手續請依勞動法令、公務人員相關規定或你的聘約辦理，必要時先問人事單位。",
    natureOverrides: { changeRisk: "context", instability: "context", movementIncrease: "context" },
  }),
  stopLoss: T({
    id: "stopLoss", label: "主觀停損", question: "依自己的判斷處理虧損部位", domains: ["investment", "decision"], coverage: "partial", basisLabel: "投資與決策判讀延伸", timingKind: "stopLoss", safety: "investment",
    coverageNote: "目前此主題尚未建立完整專屬命理判讀規則，本建議依投資與決策判讀整理。要不要停損以你事先設定的投資紀律為準，這裡只談處理的時段、心態與做法，不判斷任何標的的漲跌。",
    natureOverrides: { changeRisk: "context", instability: "context" },
  }),
  takeProfit: T({
    id: "takeProfit", label: "主觀停利", question: "依自己的判斷處理獲利部位", domains: ["investment", "decision"], coverage: "partial", basisLabel: "投資與決策判讀延伸", timingKind: "takeProfit", safety: "investment",
    coverageNote: "目前此主題尚未建立完整專屬命理判讀規則，本建議依投資與決策判讀整理。要不要停利以你事先設定的投資紀律為準，這裡只談處理的時段、心態與做法，不判斷任何標的的漲跌。",
  }),
  leverage: T({
    id: "leverage", label: "投資加大槓桿", question: "要不要、什麼時候加大槓桿", domains: ["investment", "decision"], coverage: "partial", basisLabel: "投資與決策判讀延伸", timingKind: "leverage", safety: "investment",
    coverageNote: "目前此主題尚未建立完整專屬命理判讀規則，本建議依投資與決策判讀整理。要不要加大槓桿、加到幾倍以你的資金規劃與風險承受度為準，這裡只談處理的時段、心態與風險控管，不判斷任何標的的漲跌。",
  }),
  liquidate: T({
    id: "liquidate", label: "清空持股", question: "要不要、什麼時候把持股全部處理掉", domains: ["investment", "decision"], coverage: "partial", basisLabel: "投資與決策判讀延伸", timingKind: "liquidate", safety: "investment",
    coverageNote: "目前此主題尚未建立完整專屬命理判讀規則，本建議依投資與決策判讀整理。要不要清空以你的資金規劃為準，這裡只談處理的時段、心態與做法，不判斷任何標的的漲跌。",
    natureOverrides: { changeRisk: "context", instability: "context" },
  }),
  decision: T({ id: "decision", label: "決策", question: "重要決定怎麼做", domains: ["decision"], coverage: "dedicated", basisLabel: "專屬決策判讀", timingKind: "decision" }),
};

export const TOPIC_IDS = Object.keys(ADVICE_TOPICS) as TopicId[];

/** 領域 → 主題（領域詳情頁使用） */
export const DOMAIN_TOPIC: Record<DomainKey, TopicId> = {
  overall: "general", career: "career", wealth: "wealth", investment: "investment", social: "social",
  love: "relationship", travel: "travel", health: "health", decision: "decision",
};

/** 擇時事件 → 主題 */
export const EVENT_TOPIC: Record<string, TopicId> = {
  work: "career", investment: "investment", interview: "jobSearch", jobchange: "jobChange", trip: "travel", contract: "cooperation",
  leave: "leave", resign: "resign", stoploss: "stopLoss", takeprofit: "takeProfit", leverage: "leverage", liquidate: "liquidate", house: "property", car: "wealth", negotiation: "cooperation", confession: "relationship", move: "travel", medical: "health", meeting: "career", other: "general",
};

/** 安全類別的固定說明（在詳細頁統一顯示一次，不在每一條建議重複） */
export const SAFETY_NOTES: Record<SafetyCategory, string> = {
  investment: "命理建議不能取代原本的投資策略、停損與部位管理；這裡只談節奏、紀律與風險控制，不提供任何標的、漲跌或資金比例的判斷。",
  health: "命理判讀只作生活作息的提醒，不做任何疾病判斷。若身體本來就有不適，請不要因為這裡顯示平順就延後就醫；健康問題以實際症狀與醫師判斷為準，並依原本的醫療計畫追蹤。",
  legal: "以上是整理資料、管理期限與溝通方式的做事方法，不代表對訴訟結果的任何判斷；法律問題請以律師或專業人員的意見為準。",
};
