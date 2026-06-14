# PRD：個人命理決策系統（Personal Destiny Decision System）

版本：1.0（Phase 1）｜日期：2026-06-12｜性質：自用，不上架、不對外營運

---

## 1. App 名稱建議（10+）

| # | 名稱 | 說明 |
|---|------|------|
| 1 | 玄機決策 | 推薦。命理＋決策定位明確 |
| 2 | 天時羅盤 DestinyCompass | 強調「擇時」核心價值 |
| 3 | 三式參謀 | 八字＋紫微＋奇門三式合參 |
| 4 | 知時 KnowWhen | 極簡，重點在「什麼時候做什麼」 |
| 5 | 運籌閣 | 運勢＋運籌帷幄雙關 |
| 6 | 吉時引擎 LuckEngine | 工程師風格 |
| 7 | 問天 AskHeaven | 奇門問事意象 |
| 8 | 命衡 FateScale | 強調 0–100 評分系統 |
| 9 | 擇日通 | 直白實用 |
| 10 | 玄策 DarkStrategy | 簡短好記 |
| 11 | 時運儀表板 | 對應 Dashboard 首頁 |

預設採用：**玄機決策（Destiny Decision System）**，repo 名 `destiny-decision-app`。

---

## 2. 產品定位

**一句話**：把八字、紫微、奇門的判斷規則程式化，對任何指定日期／月份／年份輸出量化運勢分數與白話應對策略，作為個人工作與交易決策的「第二參考意見」。

**不是什麼**：
- 不是娛樂算命網站，沒有社交、付費、廣告。
- 不是投資訊號系統。命理分數**不可**直接觸發買賣；定位為「擇時參考＋風險提醒」，所有投資相關輸出強制附帶免責聲明與保守措辭。

**核心使用者**：單一使用者（開發者本人），iPhone 15 Pro Max Safari / PWA 為主要使用情境。

**核心使用情境（依頻率排序）**：
1. 每天早上看「今日儀表板」：總運、財運、適合／避免事項。
2. 交易日前查「投資模式」：該日是否適合加碼／減碼／觀望，附風險提醒。
3. 工作上查某日是否適合報告、開會、處理爭議案件。
4. 規劃旅遊／重大決策時查日期區間或年份趨勢。
5. 事後回填「實際結果」，讓系統長期校正規則權重。

---

## 3. 人性化設計考量（補強原始需求）

原始需求未明說、但實際使用會遇到的問題，第一版即納入：

1. **出生時辰不確定**：Profile 增加 `birthTimeAccuracy: exact | approximate | unknown`。unknown 時自動降低時柱相關規則權重並在報告標註「信心降低」。
2. **早子時／晚子時**：23:00–24:00 出生提供「晚子時（日柱用當日）／早子時（日柱用次日）」切換，預設晚子時，設定頁可改。
3. **真太陽時**：依出生地經度自動換算（台南約 -8 分鐘），可關閉。
4. **國曆農曆雙向**：輸入國曆自動顯示換算後農曆供確認，避免排錯盤。
5. **時區**：出生地與查詢事件分別記時區，海外旅遊查詢用當地時間起奇門局。
6. **離線可用**：PWA + 本機規則模板，沒網路時仍可排盤評分，只有 AI 白話解釋需要連線；離線時自動 fallback 到本機模板文字。
7. **一鍵今日**：Dashboard 頂部固定「今天」，查詢頁日期預設今天，減少輸入。
8. **歷史回饋極簡化**：事後回饋只需點「準／普通／不準」三鍵＋選填備註，降低記錄門檻，否則回饋機制必然荒廢。
9. **投資模式防呆**：投資查詢結果頁固定顯示風控檢查清單（停損設了沒、部位比例、是否槓桿），把命理建議綁在紀律框架內，而非取代紀律。
10. **深色模式預設**：主要在早晨與盤前使用，深色省眼。
11. **大字體分數**：手機上一眼要看到的是「今日財運 72」這種大數字，細節折疊。
12. **資料安全**：生辰是敏感個資。本機儲存、匯出 JSON 可選 AES 加密（輸入口令）；repo 設私有。

---

## 4. 頁面規格（8 頁）

### 4.1 Dashboard `/`（首頁）
- 今日日期（國曆＋農曆＋干支）
- 大字總分 + 雷達圖（事業／財運／感情／健康／人際／風險）
- 今日適合（最多 5 項）／不適合（最多 5 項）
- 貴人方位、最佳時段
- 今日一句建議（AI 或模板）
- 快速入口：投資模式｜工作模式｜查日期
- 空狀態：尚未建立命盤 → 引導至 Profile

### 4.2 Profile `/profile`
- 命盤 CRUD（支援多筆，預設一筆「本人」）
- 欄位：姓名、性別、出生年月日、出生時間、時辰準確度、出生地（國家／城市／時區／經緯度）、國曆農曆、真太陽時開關、備註
- 匯出／匯入 JSON（可加密）
- 排盤預覽：存檔前顯示四柱讓使用者核對

### 4.3 Bazi `/bazi`
四柱、十神、藏干、五行比例（圓餅）、日主強弱、格局、喜用神／忌神、調候、神煞、大運列表、流年／流月／流日切換。

### 4.4 ZiWei `/ziwei`
十二宮盤（手機直式 4×3 格）、命宮身宮、十四主星＋輔煞星、四化標記、大限／流年切換、重點宮位（官祿、財帛、夫妻、疾厄、遷移、福德）摘要卡。

### 4.5 QiMen `/qimen`
任意時間起局：陰陽遁、局數、九宮格（門／星／神／干）、值符值使、空亡馬星、吉凶格局清單、吉方／凶方羅盤圖、問事結果與策略。

### 4.6 Query `/query`
- Tab：日｜月｜年｜區間
- 主題：總運｜工作｜投資｜旅遊｜重大決策｜自訂問題
- 輸出：分數卡＋觸發規則明細（可展開）＋AI 白話＋免責聲明
- 每次查詢自動寫入 History

### 4.7 History `/history`
- 列表：時間、類型、主題、分數、AI 摘要
- 回饋：準／普通／不準 + 實際結果備註
- 統計：各系統（八字／紫微／奇門）命中率，供權重校正參考

### 4.8 Settings `/settings`
- AI Provider（Anthropic / OpenAI / Google）、Model、啟用開關、離線模板模式
- 三系統權重滑桿（日／月／年／決策四組）
- 子時規則、真太陽時預設
- 匯出全部資料、清除本機資料（二次確認）
- Vercel 環境變數說明連結

---

## 5. 四大特殊模式

### 5.1 工作模式
查某日適合：向長官報告／主管會報／寫公文／稽核／與醫院溝通／協調會／爭議案件／爭取升遷／重要簡報。
輸出 `workScore`、suitable/avoid、溝通語氣建議、風險提醒、最佳時段與方位、策略。

### 5.2 投資模式（主要使用情境，特別規格）
- 輸入：日期（或區間）＋動作意圖（加碼／減碼／觀望／停利／停損／長期布局）
- 輸出：
  - `wealthScore`、`riskScore`、`impulsivenessWarning`（衝動指數：忌神引動、奇門凶格時提高）
  - 傾向建議：以「較適合觀望」「需留意追高衝動」等保守措辭
  - **固定風控清單**：① 是否已設停損 ② 部位是否超過上限 ③ 是否使用槓桿 ④ 是否在情緒高點
  - 固定聲明：「此為命理角度之個人參考，不構成投資建議。實際交易請依自身風控紀律執行。」
- 硬性規則：系統**永不**輸出「買進」「賣出」「一定漲跌」等字眼；分數再高也只到「環境傾向有利，仍須依紀律操作」。

### 5.3 旅遊模式
日期區間分析：出行運、財運、人際、健康風險、遺失物風險、延誤風險、適合出發時間、每日提醒、購物日建議。

### 5.4 重大決策模式
自然語言問題（如「是否應在 2027 申請調職」）→ 解析時間範圍與主題 → 三式合參 + 歷史回饋 → `decisionScore`、支持因素、風險因素、時機建議、替代方案、最終建議、信心等級。

---

## 6. 資料模型（核心）

```ts
// Profile
interface Profile {
  id: string;                    // uuid
  name: string;
  gender: "male" | "female";
  birthDate: string;             // "1988-01-14" 國曆
  birthTime: string | null;      // "01:15"，unknown 時為 null
  birthTimeAccuracy: "exact" | "approximate" | "unknown";
  birthPlace: { country: string; city: string; timezone: string; longitude: number; latitude: number };
  calendarType: "solar" | "lunar";
  useTrueSolarTime: boolean;
  ziRule: "lateZi" | "earlyZi";  // 晚子時/早子時
  notes: string;
  createdAt: string; updatedAt: string;
}

// 查詢結果（日）
interface DailyFortune {
  type: "daily"; targetDate: string;
  scores: Scores;                          // 0-100 × 8 維
  suitableActions: string[]; avoidActions: string[];
  bestDirection: string; bestTimeRange: string;
  triggeredRules: TriggeredRule[];         // 透明可稽核
  summary: string; strategy: string;
  confidenceLevel: "low" | "medium" | "high";
  disclaimer: string;
}

interface Scores {
  overall: number; career: number; wealth: number; relationship: number;
  health: number; people: number; decision: number; risk: number;
}

// 歷史紀錄
interface HistoryRecord {
  id: string; queriedAt: string;
  queryType: "daily"|"monthly"|"yearly"|"range"|"decision";
  topic: string; targetDate: string;
  scores: Scores; aiSummary: string;
  feedback: { accuracy: "hit"|"neutral"|"miss"|null; actualResult: string; feedbackAt: string|null };
}
```

完整型別見 `src/types/`。規則 Schema 見 `docs/RULE_ENGINE.md`。

---

## 7. MVP 範圍（第一個可用版本）

**做**：
1. Profile CRUD + 本機儲存 + JSON 匯出入
2. 曆法引擎（國農曆、干支、節氣、真太陽時）
3. 八字引擎（四柱、十神、五行、強弱、喜忌、大運流年流月流日）
4. 日／月查詢 + 評分 + 本機模板解釋
5. 投資模式（含風控清單）
6. Dashboard
7. History + 三鍵回饋
8. Vercel 部署 + PWA

**MVP 不做（後續版本）**：紫微引擎、奇門引擎、AI 白話（先用模板）、年度查詢、重大決策模式、雲端同步、登入。

理由：八字＋曆法是地基且最可驗證；奇門起局規則流派分歧大（拆補／置閏），需先人工定版規則 JSON 再實作。

---

## 8. 非功能需求

- 首屏載入 < 2s（4G）、排盤計算 < 200ms（全在前端）
- 響應式：430px（iPhone 15 Pro Max）為基準，向上適配 iPad／桌機
- PWA：manifest + service worker，離線可排盤
- 無障礙：分數附文字等級（佳／平／慎），不只靠顏色
- 所有命理規則附 `sourceReference` 與 `needsVerification` 標記，可稽核可修正
