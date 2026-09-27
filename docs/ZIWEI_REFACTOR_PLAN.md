# 紫微斗數引擎整理計畫（正式版）

> 狀態：Step 1 完成（金樣本已建立，未修改任何排盤演算法）。後續步驟須經確認後逐步進行。

## 一、不可違反的原則
1. 不重做 UI；不破壞既有十二宮命盤；不串接任何 AI／LLM。
2. 所有排盤與判讀在本機完成；客觀排盤與命理解讀完全分開。
3. 不混用流派；具流派差異的規則一律由 **RuleProfile** 控制並標明來源。
4. 既有人物的命盤結果不得因架構整理而改變（以金樣本強制）。
5. 通用 App：正式程式不得出現針對特定人物或生日的判斷。

## 二、資料關係（修正 1）
```
PersonProfile（客觀出生資料）
  └─ 姓名、性別、出生日期、出生時間（民用標準時間，Source of Truth）、出生地、時區、經緯度、
     真太陽時偏好、出生時間精確度
CalculationSettings（這次排盤用哪些規則；可同一人多份以便比較）
  └─ ziweiRuleProfileId、baziRuleProfileId …
ZiweiRuleProfile（固定、不可修改、版本化）
ZiweiChartEngine
```
- 流派規則**不是人物屬性**。舊資料為保持命盤不變，migration 成「legacy-compatible CalculationSettings」，不把流派寫進 PersonProfile。

## 三、RuleProfile 不可覆寫（修正 2）
- `iztro_compatible_v1`＝固定規則集合；任何核心規則不同即為**另一個 Profile**。
- 使用者自訂 → 建立 `custom_YYYYMMDD_NNN`，記錄 `baseProfileId` 與 `overrides[]`，UI 顯示「自訂（基於 iztro 相容）」。
- 舊資料需保留舊行為時自動建立 legacy Profile，例如 `legacy_imported_v1_earlyZi`，不污染標準 Profile。

### iztro_compatible_v1 規則值（Step 2 建立）
| 欄位 | 值 | 備註 |
|---|---|---|
| leapMonthRule | `splitAt15`（十五日含以前算本月） | 等同 iztro fixLeap=true |
| fourTransformationsTable | 通行十干表；庚＝陽武陰同、戊＝右弼科、壬＝左輔科 | |
| kuiYueRule | 甲戊庚牛羊、乙己鼠猴、丙丁豬雞、六辛逢馬虎、壬癸兔蛇 | |
| fireBellRule | 年支三合定起點、順數至生時，不分陰陽順逆 | |
| ziweiYearBoundary | `lunarNewYear`（正月初一） | 等同 iztro yearDivide=normal |
| **dayBoundaryRule** | **`"00:00"`**（23:00–24:00 仍屬當日；時辰取子） | 見下方「日界確認」 |
| ageSystem | `nominal`（虛歲，正月初一增歲） | |
| starPlacementAlgorithm | 通行版本 | 等同 iztro algorithm=`default`（**非** `zhongzhou`） |
| brightnessProfile | `iztro-2.6.1` | softwareDataset，非古籍 |

### 日界確認（Step 1 實測）
- 本 App 既有行為：23 點後出生，紫微生日仍取當日、時辰取子（lunar day 不加一）。
- iztro 2.6.1 **預設** `dayDivide: "forward"`：晚子時（23–24 點）**只在安紫微星時**把農曆日加一，其他星曜不變。
- iztro 另有 `dayDivide: "current"`（晚子時算當日），與本 App 既有行為**完全一致**（28 組 23 點樣本全部相同）。
- 依「先依 App 原本預設行為、確保新舊相容」：`iztro_compatible_v1.dayBoundaryRule = "00:00"`，並在 Profile 中註明「對應 iztro dayDivide=current；iztro 預設 forward 不同」。是否改採 forward 需另建 Profile，由使用者決定。
- 舊版匯入之「早子時換日」設定（23 點即換日）將 migration 為 `legacy_imported_v1_earlyZi`（dayBoundaryRule＝`"23:00"`）。

### 其他發現
- 目前引擎標示「中州派基準・全書起例」**不精確**：實測與 iztro 的 `algorithm: "default"`（通行版本）一致，而 iztro 另有 `zhongzhou`（中州派）選項。Step 2 將名稱改為「通行排盤（iztro 相容）」。
- 設定中的 `ziwei.fireBell` 欄位從未被程式讀取（死設定），Step 2 由 Profile 正式控制。

## 四、真太陽時（修正 3）
- **Source of Truth＝原始出生資料**（民用標準時間＋時區＋經緯度）。每次排盤以「原始資料＋目前 CalendarEngine＋目前 CalculationSettings」重算。
- `solarTimeCorrection`、`calculatedBirthDateTime` 只是 **audit snapshot**：僅供顯示、比較、migration 驗證與偵測版本差異，**不得作為排盤輸入**。
- 重算與舊快照不同時：不沿用舊值，顯示「曆法／真太陽時算法版本變更，舊計算值與目前版本不同」及差異內容。
- 既有人物保留原 `useTrueSolarTime`；新人物預設 `false`，開關名稱「真太陽時校正」，附說明；跨時辰時警告並可切換「標準時間命盤／真太陽時命盤」比較。

## 五、年界由各命理模組自行決定
CalendarEngine 只提供曆法與節氣資料。八字（立春）、奇門年命（取八字年柱，立春）、紫微（Profile：正月初一）、梅花（農曆年支）各自決定。金樣本已鎖定：2024-02-05（立春後、春節前）八字為甲辰、紫微為癸卯。

## 六、計分（修正 4）
- 以下規則族停止參與正式分數，移為 `legacyZiweiScoring`（`userFacing=false`、`enabled=false`），僅開發者模式可比較：`ziwei.*.hua.*`（化祿權科固定加分、化忌固定扣分）、`ziwei.*.jichong.*`（同一化忌重複扣分）、`ziwei.*.focus.*`（廟旺加分、有煞扣分）、`ziwei.natal.*`（廟旺加分、吉煞數量加減）。星曜、亮度、四化等**資料顯示不變**。
- **ScoreAggregator** 記錄各系統狀態：八字 `active`、紫微 `interpretationPending`、奇門 `active`、梅花 `active`，並輸出 `activeScoringSystems`。
- **不放大其他三術權重來補滿**。若綜合分需重新正規化，畫面顯示「目前綜合評分由 3/4 個系統參與；紫微斗數暫不計分。」
- 紫微新 Interpretation Engine 完成後，才正式重新校準四術權重。

## 七、回歸測試（修正 5）
- 所有「隨機」樣本以固定種子產生並**保存為 JSON**，CI 每次跑同一批；真正的隨機測試另設 Fuzz Test，不作為回歸依據。
- 測試分級：Level 1（規則／數學）、Level 2（iztro 相容，softwareDataset）、Level 3（第二套軟體、人工古法、可靠書籍）。
- 每筆 fixture 帶 `verificationStatus`：`ruleVerified`、`iztroMatched`、`iztroDefaultMatched`、`secondSourceVerified`、`classicalSourceVerified`。「iztro 相同」不等於「已證明為唯一正確古法」。
- 第三方命盤（例如文墨天機）加入時建立獨立 `comparisonFixture`；不同時**先出差異報告**，不直接改程式。

## 八、步驟
1. ✅ 修改前金樣本、固定 fixtures、測試基礎架構（本次）
2. RuleProfile／CalculationSettings 結構與版本號（calendarVersion、ziweiChartVersion、starPlacementVersion、brightnessVersion、transformationVersion、luckVersion、interpretationVersion、classicalDataVersion）
3. 資料 migration（DB v2、備份 v2）與新人物預設
4. 停用 legacy 紫微計分、ScoreAggregator 狀態、開發者模式
5. 拆出 ZiWeiCalendarEngine、LifeBodyPalaceEngine、PalaceEngine、FiveElementBureauEngine、MainStarEngine、MinorStarEngine、BrightnessEngine、TransformationEngine（每拆一個都對照金樣本）
6. Level 1 規則測試與 Level 3 比對格式
7. 真太陽時畫面（原始／校正時間、跨時辰警告、兩盤比較）
8. 設定頁「紫微斗數排盤體系」
9. 之後依序：三方四正 → 空宮借對宮 → 大限流年 → 星曜組合／格局 → Interpretation Engine → Interpretation Trace → Scoring

## 附錄 A：Step 1 紀錄
- 金樣本產生自 commit `5a19010`（main），產生過程未修改任何 `src/core`、`src/kb`、`src/app`、`src/ui` 檔案。
- 檔案：`src/tests/fixtures/ziwei/ziwei_canonical_fixture_v1.json`（51 組）、`ziwei_random_fixture_v1.json`（600 組，種子 20260927）。
- 產生器：`scripts/golden/generate.test.ts`（需 `GOLDEN_WRITE=1`；已存在時拒絕覆寫，除非 `GOLDEN_OVERWRITE=1`）。
- 比對測試：`src/tests/golden.test.ts`；快照格式：`src/tests/golden/snapshot.ts`（`golden-v1`）。

## 附錄 B：fixture_19880114_0115_male 人工推導
1. 國曆 1988-01-14 01:15（UTC+8，標準時間）→ 農曆丁卯年十一月廿五，丑時（時支序 1）。
2. 命宮：寅起正月順數至十一月得子，子起子時逆數至丑時得亥 → `2 + (11−1) − 1 = 11` → 亥。
3. 身宮：同法順數至丑時 → `2 + (11−1) + 1 = 13 ≡ 1` → 丑；十二宮自命宮亥逆排，丑為福德 → 身宮在福德。
4. 五行局：丁年五虎遁寅宮為壬寅，至亥為辛亥；辛亥納音釵釧金 → 金四局。
5. 紫微：局數 4、生日 25：q＝⌈25/4⌉＝7，r＝7×4−25＝3（奇數）→ 位置 q−r＝4 → 寅起第 4 宮為巳。
6. 天府：與紫微對寅申線對稱 → 亥。紫微系逆行：天機辰、太陽寅、武曲丑、天同子、廉貞酉；天府系順行：太陰子、貪狼丑、巨門寅、天相卯、天梁辰、七殺巳、破軍酉。
7. 丁干四化：太陰祿、天同權、天機科、巨門忌。
8. 丁為陰干、男命 → 陰男逆行；金四局 → 命宮 4–13，兄弟 14–23 … 父母 114–123（虛歲）。
