# 規則引擎設計 RULE_ENGINE

來源書目（《子平真詮》《滴天髓》《三命通會》《窮通寶鑑》《千里命稿》《子平粹言》《造化元鑰評註》《紫微斗數全書》《紫微斗數全集》、王亭之系列、《御定奇門寶鑑》《奇門遁甲統宗》《煙波釣叟歌》《神奇之門》《開悟之門》、杜新會系列）僅作為**概念與判斷邏輯的整理依據**，所有規則以自行撰寫的條件式與白話模板呈現，不複製原文。

---

## 1. 通用規則 Schema

```ts
interface FortuneRule {
  id: string;                  // 例 "bazi_daily_wealth_014"
  system: "bazi" | "ziwei" | "qimen";
  category: "career" | "wealth" | "relationship" | "health" | "people" | "decision" | "travel" | "overall";
  scope: "daily" | "monthly" | "yearly" | "any";
  sourceReference: string;     // 例 "子平法：財星生旺概念"
  condition: RuleCondition;    // 結構化條件，由 rule-engine 比對
  weight: number;              // 1–10 重要度
  scoreEffect: number;         // -30 ~ +30 對該 category 的分數影響
  level: "positive" | "neutral" | "caution" | "negative";
  explanationTemplate: string; // 白話解釋（含 {{變數}} 插值）
  strategyTemplate: string;    // 行動建議模板
  riskWarning?: string;
  needsVerification: boolean;  // true = 人工尚未驗證，降權 50%
  enabled: boolean;
}
```

`RuleCondition` 為遞迴結構，支援 `all` / `any` / `not` 組合與引擎輸出欄位的比對運算子（eq / in / gte / contains / not_contains / conflictsWith / combinesWith…），由 `engines/rule-engine` 統一解譯，三系統共用。`value` 可寫成 `"{{欄位名}}"` 引用另一個引擎輸出欄位的值（例：`{ "field": "favorableElements", "op": "not_contains", "value": "{{dayFortuneElement}}" }` 表「流日五行不在喜用之列」）。

## 2. 各系統條件欄位（引擎輸出 → 規則可引用）

**八字**：dayMaster、dayMasterStrength、favorableElements、unfavorableElements、pillar 干支、十神分布、流年/流月/流日干支與日柱的刑沖合害關係、神煞命中、調候是否得用、大運階段。

**紫微**：各宮主星與亮度、四化（生年/大限/流年）落宮、煞星會照、命宮三方四正組合、大限宮位。

**奇門**：值符/值使、用神落宮、八門九星八神組合、門迫/擊刑/入墓/空亡/馬星、吉格（如三奇得使類）凶格清單、方位宮吉凶。

## 3. 評分引擎

每維分數 = 50（基準）+ Σ(scoreEffect × weight/10 × 系統權重 × 信心係數)，clamp 0–100。

預設系統權重：

```json
{
  "daily":    { "bazi": 0.35, "ziwei": 0.20, "qimen": 0.45 },
  "monthly":  { "bazi": 0.45, "ziwei": 0.35, "qimen": 0.20 },
  "yearly":   { "bazi": 0.45, "ziwei": 0.45, "qimen": 0.10 },
  "decision": { "bazi": 0.30, "ziwei": 0.25, "qimen": 0.45 }
}
```

信心係數：時辰 exact=1.0、approximate=0.8、unknown=0.5（僅作用於依賴時柱/命宮的規則）。
`needsVerification: true` 的規則再 ×0.5。
分數等級文字：80+ 佳、65–79 偏佳、45–64 平、30–44 需留意、<30 宜守。

## 4. 流派定版決議（避免實作搖擺）

| 爭點 | 定版 | 備註 |
|---|---|---|
| 子時換日 | 預設晚子時不換日 | 設定頁可切早子時 |
| 月柱換月 | 以節氣（節）為界 | 立春換年 |
| 八字強弱 | 得令40/得地30/得勢30 計分 | >50 偏強 |
| 紫微安星 | 中州派全書安星法 | 閏月依「上半月歸前月」 |
| 奇門起局 | 時家奇門、轉盤、拆補法 | 不用置閏 |
| 真太陽時 | 經度差＋均時差表 | 可關閉 |

## 5. 可程式化 vs 需人工整理 vs 交給 AI

**完全可程式化（確定性演算法）**：曆法換算、四柱排盤、藏干十神、五行統計、強弱計分、大運排列、紫微安星、四化表、奇門起局與格局偵測、刑沖合害關係表。

**需人工整理成 JSON（判斷性知識）**：喜用神取用優先序、調候用神表（《窮通寶鑑》概念表格化）、格局成敗條件、神煞吉凶表、紫微星情與宮位組合吉凶、奇門用神選取（問財用生門/問行人用…）、各格局的白話解釋與策略模板。→ 這是工作量最大的部分，建議每系統先整理 60–100 條高頻規則上線，靠 History 回饋迭代。

**適合交給 AI**：把 TriggeredRule[] 與分數轉成自然語句、跨系統結果矛盾時的折衷措辭、針對使用者自訂問題（重大決策模式）的語意解析與建議組織。AI 不得新增引擎沒有的判斷。

## 6. 範例規則

```json
{
  "id": "bazi_daily_wealth_001",
  "system": "bazi",
  "category": "wealth",
  "scope": "daily",
  "sourceReference": "子平法：財星得用而日主能任之概念",
  "condition": {
    "all": [
      { "field": "dayFortuneTenGod", "op": "in", "value": ["正財", "偏財"] },
      { "field": "dayMasterStrength", "op": "gte", "value": 50 },
      { "field": "dayBranchRelation", "op": "not_in", "value": ["沖", "刑"] }
    ]
  },
  "weight": 7,
  "scoreEffect": 12,
  "level": "positive",
  "explanationTemplate": "今日財星臨日且日主有力，對財務事項的判斷較清晰，適合檢視部位、整理帳務與既定計畫內的資金安排。",
  "strategyTemplate": "依既有紀律執行即可，不因環境偏佳而放大部位。",
  "riskWarning": "偏財旺時易高估勝率，留意過度交易。",
  "needsVerification": false,
  "enabled": true
}
```

回饋校正：History 統計每條規則觸發時的「準/不準」比率，連續 N 次（預設 10）命中率 < 40% 自動標記建議下修 weight，由使用者在 Settings 確認後生效（不自動改，保留人為把關）。
