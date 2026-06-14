# AI 解釋層設計 AI_PROMPTS

## 1. 職責邊界

AI **只做**：白話轉譯、措辭潤飾、跨系統結果整合敘述、依主題組織建議。
AI **不做**：排盤、計算分數、新增引擎沒有的吉凶判斷、預言具體事件、給出買賣指令。

流程：使用者輸入 → 排盤引擎 → 規則引擎 → 評分引擎 → 結構化 JSON → `/api/ai`（伺服器）→ AI 白話 → Zod 驗證 → 畫面。

## 2. /api/ai 介面

Request（前端 → 自家 API）：

```json
{
  "provider": "anthropic",
  "queryType": "daily",
  "topic": "wealth",
  "fortuneResult": { "...": "完整 FortuneResult JSON，含 scores 與 triggeredRules" },
  "userQuestion": "（重大決策模式才有）",
  "confidenceLevel": "medium",
  "locale": "zh-TW"
}
```

Response（AI 輸出 Schema，Zod 強制驗證，驗證失敗 fallback 本機模板）：

```json
{
  "summary": "",
  "careerAdvice": "",
  "wealthAdvice": "",
  "relationshipAdvice": "",
  "healthAdvice": "",
  "peopleAdvice": "",
  "suitableActions": [],
  "avoidActions": [],
  "bestDirection": "",
  "bestTimeRange": "",
  "riskWarning": "",
  "practicalStrategy": "",
  "confidenceLevel": "low",
  "disclaimer": "本分析僅供個人參考，不構成醫療、法律、投資或重大決策建議。"
}
```

## 3. System Prompt 模板（核心段落）

```
你是命理結果的白話轉譯助手。你會收到一份已由程式排盤、比對規則並計分完成的 JSON。
你的工作只是把它整理成清楚、溫和、可行動的繁體中文建議。

硬性規則：
1. 只能依據 JSON 中的 triggeredRules 與 scores 說話，不得自行新增吉凶判斷。
2. 禁用詞：一定、必定、保證、絕對、買進、賣出、災、死、破產。
3. 措辭一律使用：傾向、建議、需留意、較適合、可考慮。
4. 不恐嚇，負面訊息以「提醒＋對策」呈現。
5. confidenceLevel 為 low 時，開頭需說明本次推算因出生時辰不確定而參考性降低。
6. 投資主題：只描述環境傾向與情緒風險，最後必須提醒依自身停損停利紀律執行，並附免責聲明。
7. 醫療、法律相關內容一律建議諮詢專業人士。
8. 輸出只能是符合指定 Schema 的 JSON，不得有任何其他文字。
```

User prompt 由 `ai/prompt-builder.ts` 組裝：查詢類型說明 + FortuneResult JSON + 輸出 Schema 範例。

## 4. 投資模式額外防線（程式層，非 prompt 層）

`/api/ai` 在回傳前執行輸出過濾器：
- 偵測禁用詞 → 以模板句替換或整體 fallback 本機模板。
- 強制覆寫 `disclaimer` 欄位為標準文字（不信任 AI 自填）。
- `wealthAdvice` 結尾不含「紀律」「停損」字樣時自動附加標準風控提醒句。

## 5. 本機模板 fallback

`ai/explanation-generator.ts` 提供無 AI 版本：直接串接觸發規則的 `explanationTemplate` 與 `strategyTemplate`，按 weight 排序取前 5 條，套固定句式。離線、API 失敗、Zod 驗證失敗、使用者關閉 AI 時皆走此路徑，確保系統核心功能不依賴外部服務。

## 6. Token 與成本控制

- triggeredRules 只送 id、level、explanationTemplate（已插值），不送 condition 細節。
- max_tokens 1000；日查詢單次成本目標 < NT$0.5。
- 同一查詢結果快取於 IndexedDB（key = profileId+date+topic+rulesHash），重看不重打。
