/** 臨場應對（ResponseRegistry）：「如果遇到這種狀況，就這樣做」。依當天出現的風險因素挑選，只是做法提醒，不是預測會發生。
 *  文字一律通過 lint（白話、具體、不宿命，投資不給標的／漲跌／資金比例）。 */
import type { FactorId } from "@/core/advice/factors";
import type { RoleKey } from "@/core/advice/workRole";
import type { TopicId } from "./topics";

export interface ResponseDef { id: string; factors: FactorId[]; topics: TopicId[] | "all"; text: string; roles?: Partial<Record<RoleKey, string>> }

const WORK: TopicId[] = ["general", "career", "promotion", "jobSearch", "jobChange"];
const PEOPLE: TopicId[] = ["social", "cooperation", "general"];
const LOVE: TopicId[] = ["relationship", "marriage"];
const MONEY: TopicId[] = ["wealth", "property", "general"];

export const RESPONSES: ResponseDef[] = [
  { id: "group-challenge", factors: ["communicationConflictRisk", "communicationMisunderstandingRisk"], topics: [...WORK, ...PEOPLE],
    text: "如果有人在群組或公開場合質疑你，就回「我私下說明」，改用私訊或當面談，不在群組爭論。",
    roles: { public: "如果其他單位在會議上質疑你的承辦內容，就說「我會後補資料說明」，會後再以書面回覆，不當場爭論。" } },
  { id: "love-cold", factors: ["communicationConflictRisk", "communicationMisunderstandingRisk"], topics: LOVE,
    text: "如果對方語氣變冷或說話帶刺，就先問「你是不是在意剛才那件事？」，聽完再說自己的想法。" },
  { id: "urgent-assign", factors: ["hierarchyPressure", "workloadIncrease"], topics: WORK,
    text: "如果主管臨時交辦，就先問「最晚什麼時候要、要做到什麼程度」，再回覆可以完成的時間。",
    roles: { public: "如果長官臨時交辦，就先確認時限、要簽到哪一層與需要會辦的單位，再回覆可以完成的時間。",
      publicManager: "如果上級臨時交辦，就先確認時限與要呈報的層級，回科內後當場指定承辦同仁與期限。",
      selfEmployed: "如果客戶臨時追加要求，就先問期限與預算，確認後再用文字回覆能不能接。" } },
  { id: "snap-decision", factors: ["judgmentBiasRisk", "decisionUncertainty"], topics: [...WORK, "decision"],
    text: "如果在會議中被要求當場拍板，就說「我整理後今天下班前回覆」，爭取一點思考時間。",
    roles: { publicManager: "如果在會議中被要求當場拍板，就說「我請同仁整理資料，今天下班前回覆」，會後再確認法規與影響。" } },
  { id: "chase-price", factors: ["impulsivityRisk", "disciplineRisk", "judgmentBiasRisk"], topics: ["investment"],
    text: "如果盤中急漲想追，就先等 10 分鐘，再看是否符合你事先寫好的進場條件；不符合就放進觀察清單。" },
  { id: "flash-sale", factors: ["impulsivityRisk", "judgmentBiasRisk"], topics: ["wealth", "general"],
    text: "如果看到限時優惠想立刻付款，就先放進購物車或清單，明天還想要再買。" },
  { id: "tips", factors: ["trustRisk", "externalInterference"], topics: ["investment"],
    text: "如果有人傳明牌或邀你進投資群組，就先不回覆、不轉帳，查清楚對方是不是合法業者。" },
  { id: "pay-first", factors: ["trustRisk"], topics: ["cooperation", "wealth", "property"],
    text: "如果對方要求先付款，或說「合約之後再補」，就請對方先把條件寫成文字，確認後再付款。" },
  { id: "stuck", factors: ["delayRisk", "executionResistance", "planDisruptionRisk"], topics: WORK,
    text: "如果事情卡住超過半天，就直接打電話給關鍵的人問清楚缺什麼，不要只等回信。",
    roles: { public: "如果公文卡在某一關超過一天，就直接打電話給承辦人或秘書，問清楚缺什麼再補件。" } },
  { id: "sent-wrong", factors: ["errorRisk", "transitionRisk"], topics: [...WORK, "general"],
    text: "如果發現寄錯、送錯或填錯，就馬上通知對方並更正，不要等對方發現。",
    roles: { public: "如果發現公文或資料送錯，就馬上通知受文單位並辦理更正，留下紀錄。" } },
  { id: "afternoon-dip", factors: ["fatigueRisk", "stressLoad", "recoveryNeed"], topics: ["health", "general", "career"],
    text: "如果下午開始注意力渙散，就起來走動 10 分鐘、喝杯水，再處理需要專心的事。" },
  { id: "anger", factors: ["stressLoad", "impulsivityRisk"], topics: [...LOVE, "social"],
    text: "如果覺得快要發脾氣，就先說「我需要冷靜一下，等等再聊」，離開現場幾分鐘。" },
  { id: "surprise-cost", factors: ["unexpectedExpenseRisk", "cashFlowPressure"], topics: [...MONEY, "investment"],
    text: "如果出現意外支出，就先動用預備金，不要為了補洞去調整投資或借錢。" },
  { id: "traffic", factors: ["trafficDelayRisk", "scheduleDisruptionRisk", "delayRisk"], topics: ["travel"],
    text: "如果交通延誤，就先通知對方預計到達的時間，再找替代路線，不要趕路。" },
  { id: "changed-terms", factors: ["changeRisk", "instability", "planDisruptionRisk"], topics: [...WORK, "cooperation"],
    text: "如果對方臨時改變說法，就請對方把新的內容寫下來，再決定要不要配合。" },
  { id: "disagree-boss", factors: ["hierarchyFriction"], topics: ["career", "promotion"],
    text: "如果和主管意見不同，就先說「我理解您的考量」，再提出一個替代方案與理由。",
    roles: { public: "如果和長官意見不同，就先表示理解，再提出替代方案與法規依據，必要時以簽陳方式表達。" } },
  { id: "decline-invite", factors: ["lowSocialEnergy"], topics: ["social"],
    text: "如果不想參加臨時邀約，就回「今天不方便，下週我約你」，並給一個具體時間。" },
  { id: "interrupted", factors: ["focusDisruption"], topics: ["exam", "general", "career"],
    text: "如果一直被訊息打斷，就把手機轉靜音放遠一點，設定 45 分鐘的專注時間。" },
  { id: "first-fail", factors: ["setbackRisk", "lowReturnOnAction"], topics: ["general", "decision", "career"],
    text: "如果第一次嘗試不順，就先記下卡在哪裡，換一個方式再試，不要硬推同一招。" },
  { id: "borrow", factors: ["resourceLossRisk"], topics: ["social", "cooperation", "wealth"],
    text: "如果有人開口借錢，就說「我需要先看一下這個月的預算」，不當場答應。" },
];
