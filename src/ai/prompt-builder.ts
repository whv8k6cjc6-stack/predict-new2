import type { FortuneResult } from "@/types/fortune";

export const STANDARD_DISCLAIMER =
  "本分析僅供個人參考，不構成醫療、法律、投資或重大決策建議。";

export const INVESTMENT_DISCLAIMER =
  "此為命理角度之個人參考，不構成投資建議。實際交易請依自身停損停利與部位紀律執行。";

/** AI 輸出禁用詞（API route 層強制過濾，不信任 prompt 約束） */
export const FORBIDDEN_WORDS = ["一定", "必定", "保證", "絕對", "買進", "賣出"];

export function buildSystemPrompt(): string {
  return [
    "你是命理結果的白話轉譯助手。你會收到一份已由程式排盤、比對規則並計分完成的 JSON。",
    "你的工作只是把它整理成清楚、溫和、可行動的繁體中文建議。",
    "硬性規則：",
    "1. 只能依據 JSON 中的 triggeredRules 與 scores 說話，不得自行新增吉凶判斷。",
    `2. 禁用詞：${FORBIDDEN_WORDS.join("、")}、災、死、破產。`,
    "3. 措辭一律使用：傾向、建議、需留意、較適合、可考慮。",
    "4. 不恐嚇，負面訊息以「提醒＋對策」呈現。",
    "5. confidenceLevel 為 low 時，開頭需說明本次推算因出生時辰不確定而參考性降低。",
    "6. 投資主題：只描述環境傾向與情緒風險，結尾必須提醒依自身風控紀律執行。",
    "7. 醫療、法律相關內容一律建議諮詢專業人士。",
    "8. 輸出只能是符合指定 Schema 的 JSON，不得有任何其他文字。",
  ].join("\n");
}

export function buildUserPrompt(result: FortuneResult): string {
  return JSON.stringify(
    {
      instruction: "請依 system 規則，將以下命理計算結果轉譯為白話建議 JSON。",
      fortuneResult: result,
    },
    null,
    2,
  );
}
