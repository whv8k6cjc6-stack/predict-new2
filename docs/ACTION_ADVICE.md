# 具體行動建議引擎（ActionAdviceEngine）

> 產品核心：算完之後，使用者要知道**具體可以怎麼做**。建議全部在本機以固定規則與文字模板產生，不使用任何 AI／LLM。

## 一、處理流程

```
命盤（各術排盤）
 → 客觀關係
 → 各術判讀（InterpretationResult）
 → 生活因素（LifeFactor，跨系統共用詞彙）
 → 主題判讀（AdviceTopic：取相關領域、topicCoverage）
 → 跨系統整合（agreement／partialAgreement／conflict／insufficientData）
 → 行動建議規則（AdviceRule，條件只能引用生活因素）
 → 白話模板（AdviceTemplateRegistry）
 → StructuredAdvice（一般模式／專業模式共用同一份結果）
```

| 模組 | 檔案 |
|---|---|
| 生活因素詞彙表 LifeFactorRegistry | `src/core/advice/factors.ts` |
| 判讀輸出介面 InterpretationResult | `src/core/advice/interpretation.ts` |
| 既有規則 → 生活因素（語意標準化） | `src/kb/advice/lifeFactorMapping.ts`、`src/core/advice/fromRules.ts` |
| 主題定義 AdviceTopic | `src/kb/advice/topics.ts` |
| 行動建議規則 AdviceRule | `src/kb/advice/rules.ts` |
| 建議文字 AdviceTemplateRegistry | `src/kb/advice/templates.ts` |
| 引擎（主題判讀、跨系統整合、時間尺度、去重、信心、追溯） | `src/core/advice/engine.ts` |
| 文字品質檢查 | `src/core/advice/lint.ts` |
| 對外入口 `adviseDay`、`adviseEvent` | `src/core/advice/index.ts` |
| 人工審閱文件（自動產生） | `docs/LIFE_FACTOR_MAPPING.md`、`docs/ADVICE_TEMPLATES.md` |

## 二、生活因素（LifeFactor）

- 八字、紫微、奇門、梅花**共用同一份**詞彙表（機會、執行、決策、人際、資源、變動、身心、出行、時機、走勢、長期特質共 11 類）。
- 因素**不等於吉凶**：同一因素在不同主題可能是機會或干擾，由主題的 `natureOverrides` 調整（例：轉職時「變動」是中性脈絡）。
- 一般模式的標籤與白話片語不得含命理術語（測試檢查）。

## 三、既有規則的映射（語意標準化，不是新增命理規則）

- 只依既有規則**已經明確寫出**的語意分類；每筆對照的「依據」必須逐字出現在該規則的結論、白話、專業說明或原則中（測試逐條檢查 357 條規則）。
- 規則只是在「定義」某個概念時不映射（例：「印星代表學習」）。
- 文字武斷或屬傷病預測的規則標為 `pendingVerification`（目前 3 族：反吟、羊刃、夏生戊土再逢火），只作低信心參考，單一條弱訊號不足以觸發建議；被刻意排除的內容寫在 `excluded`。
- 可靠度：`classicalText`（引用已匯入原文，例：《周易》爻辭、《繫辭》爻位）、`principleOnly`（有原則、原文待匯入）、`pendingVerification`。
- 完整逐條對照：`docs/LIFE_FACTOR_MAPPING.md`。

## 四、主題與覆蓋程度（topicCoverage）

17 個主題：綜合、工作、升遷、求職、轉職、財運、投資、感情、婚姻、人際、健康、出行、合作、訴訟、考試、不動產、決策。

| 覆蓋程度 | 意義 | 主題 |
|---|---|---|
| dedicated | 有該主題的判讀規則 | 綜合、工作、財運、投資、感情、人際、健康、出行、決策 |
| partial | 只有相近領域或部分規則 | 升遷、求職、轉職、婚姻、合作、不動產 |
| generalOnly | 只有一般生活因素延伸 | 訴訟、考試 |
| insufficient | 本次沒有相關訊號（執行時判定） | — |

非專屬判讀的主題一律顯示「目前此主題尚未建立完整專屬命理判讀規則，本建議依一般…因素整理」，一般模式也看得到「判斷依據：一般因素」。

## 五、跨系統整合

- 比較各系統在此主題的**生活因素**（有利因素與注意因素的加權），不只看分數正負。
- `agreement`：參與系統方向一致；`partialAgreement`：方向大致相同但有不同提醒，或多數與少數明顯；`conflict`：一支持、一不利而勢均力敵，或各系統都自相矛盾；`insufficientData`：少於兩個系統有訊號。
- 矛盾時不產生「吉凶參半」，而是共用決策方法：可逆的事小規模試行、分階段投入；不可逆的決定先多取得一份實際資訊、確認成本與退出條件、延後最終承諾。積極推進類建議（`suppressOnConflict`）在矛盾時不出現。
- 紫微目前 `pending`：不參與任何生活因素判斷、不當成中性、不影響其他系統，畫面顯示「目前紫微判讀引擎建置中，未納入本次建議。」紫微判讀引擎完成後，只要輸出同一個 InterpretationResult 介面即可直接加入。

## 六、時間尺度與去重

- `today`（流日）、`next3Days`（三天中至少兩天出現的流日因素）、`thisMonth`（流月）、`thisYear`（流年）、`longTerm`（大運、本命）、`atTime`（擇時：時辰＋流日）。只有真有對應資料時才產生，追溯可看到取自哪一層。
- 語意去重：同一核心建議（semanticKey）只顯示一次，放在最近、最能直接執行的時間尺度。

## 七、輸出與優先順序

- `StructuredAdvice`：topic、headline、primaryAdvice（如果只能記得一件事）、summary、doNow（最多 3）、avoidNow（最多 2）、otherHorizons、timing、positiveFactors、riskFactors、confidence、systemAgreement、coverage、notes、sourceRuleIds、trace。
- 不硬湊：規則不足時只顯示實際觸發的項目；完全沒有訊號時顯示「今天沒有特別突出的命理訊號，照原本計畫進行即可。」

## 八、信心（不只是一個數字）

依四個面向：來源可靠度（原文／原則／待驗證）、主題覆蓋程度、系統一致程度、資料完整度（有幾個系統有訊號、哪些系統 pending 或資料不足）。只有一般因素的主題最高為「中等」。畫面顯示「參考程度較高／中等／較低」與理由。

## 九、文字規範（自動檢查）

- 具體可執行：做建議必須回答做什麼、怎麼做、何時做或做到什麼程度；「注意、小心、把握、謹慎、順勢、保守、積極、溝通」等後面必須接具體行為。
- 一般模式不出現命理術語；不宿命（「一定會」「注定」等）、不製造恐懼（「血光」「災」等）。
- 投資：只談節奏、紀律、資訊確認與部位控制原則，不指定標的、不預測漲跌、不給資金比例或槓桿倍數、不叫人取消停損。
- 健康：只談休息、作息、避免過勞、依原醫療計畫追蹤；不診斷、不預測疾病、不涉及用藥或就醫與否。
- 訴訟：只談資料整理、溝通紀錄、期限管理、文件確認、尋求專業意見；不預測勝敗。
- 安全說明在詳細頁統一顯示一次，不在每一條建議重複。

## 十、既有規則附帶的建議文字

原本每條規則的 `actions` 改名為 `legacyAdviceText`，只在專業模式的證據鏈中以「舊版規則附帶的建議（僅供參考）」顯示；**不進入**首頁、宜忌、領域建議、擇時建議或 ActionAdviceEngine（有測試確認）。原本的「今日宜忌」「重要提醒」改由 ActionAdviceEngine 取代。

## 十一、畫面

- 首頁第一眼：今天最重要的一件事、今天適合做（最多 3）、今天最好避免（最多 2）、為什麼（一句白話）與判斷依據；可切換主題；命理細節（方位、今日卦）在一般模式收合。
- 詳細判斷頁 `/advice/?topic=…`：一句話結論、為什麼、具體怎麼做、不建議怎麼做、適合的時機、有利／注意因素、各時間尺度、判斷依據與信心、完整追溯（建議規則 → 生活因素 → 判讀規則 → 命盤資料 → 原文）。
- 領域詳情與擇時事件頁使用同一套建議。專業模式與一般模式使用完全相同的底層結果，只是顯示深度不同。

## 十二、後續

各術判讀引擎（下一階段先做紫微）必須直接輸出 `InterpretationResult`＋`LifeFactor`（`mappingType = nativeInterpretation`），並逐步取代目前由既有規則映射而來的判讀。吉凶權重、借星權重、格局分數、四化分數要等有來源後才做。
