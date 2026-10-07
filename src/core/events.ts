/** 事件模式的事件類型：對應評分領域與奇門用神 */
import type { DomainKey } from "./domains";
import type { EventKind } from "./qimen";

export interface EventType { key: string; label: string; domain: DomainKey; qimen: EventKind; hint: string }

export const EVENT_TYPES: EventType[] = [
  { key: "work", label: "工作", domain: "career", qimen: "career", hint: "一般工作事項、專案推進" },
  { key: "investment", label: "投資", domain: "investment", qimen: "investment", hint: "進場、加碼、減碼等投資決定" },
  { key: "stoploss", label: "主觀停損", domain: "investment", qimen: "stopLoss", hint: "依自己的判斷處理虧損部位：看這天適不適合下決定、怎麼處理（以台股交易時段 09–15 點挑時段；停損與否以你事先設定的投資紀律為準）" },
  { key: "takeprofit", label: "主觀停利", domain: "investment", qimen: "takeProfit", hint: "依自己的判斷處理獲利部位：看這天適不適合了結、怎麼分批（以台股交易時段 09–15 點挑時段；停利與否以你事先設定的投資紀律為準）" },
  { key: "leverage", label: "投資加大槓桿", domain: "investment", qimen: "leverage", hint: "提高融資、期貨或槓桿型商品的槓桿：填寫計畫的槓桿倍數，會一併列出風險試算（台股交易時段 09–15 點；要不要加以你的資金規劃為準）" },
  { key: "liquidate", label: "清空持股", domain: "investment", qimen: "liquidate", hint: "把手上的持股全部處理掉：看這天適不適合處理、怎麼分批（台股交易時段 09–15 點；要不要清空以你的資金規劃為準）" },
  { key: "interview", label: "面試", domain: "career", qimen: "interview", hint: "求職或升遷面談" },
  { key: "jobchange", label: "換工作", domain: "career", qimen: "jobchange", hint: "報到、接新職" },
  { key: "leave", label: "請假", domain: "health", qimen: "leave", hint: "請假、休假、補休：看這天適不適合請假，以及請假當天適合做什麼" },
  { key: "resign", label: "辭職", domain: "career", qimen: "resign", hint: "提出辭呈、和主管談離職、辦交接（預告期與手續依規定辦理）" },
  { key: "trip", label: "旅行", domain: "travel", qimen: "trip", hint: "出發、搭機、長途移動" },
  { key: "contract", label: "簽約", domain: "decision", qimen: "contract", hint: "合約、協議、文件簽署" },
  { key: "house", label: "買房", domain: "wealth", qimen: "house", hint: "看屋、下斡旋、簽買賣契約" },
  { key: "car", label: "買車", domain: "wealth", qimen: "car", hint: "訂車、交車" },
  { key: "negotiation", label: "談判", domain: "social", qimen: "negotiation", hint: "議價、協商、爭取條件" },
  { key: "confession", label: "告白", domain: "love", qimen: "confession", hint: "表白、求婚、重要感情對話" },
  { key: "move", label: "搬家", domain: "travel", qimen: "move", hint: "入厝、搬遷" },
  { key: "medical", label: "醫療安排", domain: "health", qimen: "medical", hint: "看診、檢查、手術排程（醫療決定仍以醫師專業為準）" },
  { key: "meeting", label: "重要會議", domain: "career", qimen: "meeting", hint: "簡報、決策會議、向上報告" },
  { key: "other", label: "其他", domain: "overall", qimen: "overall", hint: "其他需要擇時的事" },
];
export const eventTypeOf = (k: string) => EVENT_TYPES.find(e => e.key === k) ?? EVENT_TYPES[EVENT_TYPES.length - 1];
