# 紫微斗數專業判讀資料層與 Interpretation Engine

> 目標：紫微判讀有來源、可追溯、可測試，最後交給 ActionAdviceEngine 產生具體建議。原則是「沒有足夠來源 → 暫不判」，不為了畫面完整補規則。
> 逐條登錄（自動產生）：`docs/ZIWEI_RULE_REGISTRY.md`

## 一、目前狀態（第三階段：來源包 v3）

- **主來源**：《紫微斗數全書》廣益版掃描 PDF（86 頁、無文字層，SHA-256 `cec2c444…1186`）。**PDF 影像為 Source of Truth**；PDF 不放入 git，以雜湊鎖定版本（`scripts/ziwei-scan-sha.mjs` 可重算並核對兩本 PDF）。
- **轉錄**：`src/data/classics/ziwei/quanshu-guangyi/transcription.json`，35 段，每段 `transcriptionStatus=verified`、`visualVerified=true`，並記錄 PDF 頁碼、版心頁碼、卷、篇、條目、裁切範圍、核對者與日期。只收影像上逐字確認的連續字串；疑字記在備註、不收入。與人工初稿不同處記在 `draftCorrections`（例：貪狼「火」→「水」、流年太歲「本生人」→「癸生人」、論人命入格「平常」→「平等」）。
  - 第一批 30 段：十四主星（卷二「一命宮」各星總論，p26–31）、十二宮各篇起首（p26、p37–44）、大限與二限太歲（p46）。
  - 第二批 5 段（來源包 v3）：論人命入格、論格星數高下（p45）、論大限十年禍福何如（p46）、論行限分南北斗、論流年太歲逢吉凶星殺（p47）。
- **核對方式**：PyMuPDF 將頁面裁切放大（100–180 dpi）逐字目視比對；核對者標為「Claude Code（AI 目視比對，非人工校對）」，建議再以 `scripts/ziwei-scan-crops.py` 產生的影像人工複核。
- **一命宮章首**：來源包 v3 導航稱「未見獨立一命宮章首」「p36 末為卷之一終」；高倍率影像顯示 p26（版心 24）右頁首欄即印「一命宮」、p36 末為「卷之二終」、p37 為「卷之三」卷首接「二兄弟」。依影像記錄，差異寫在 `source.json` 的 `navigationDiscrepancy`。
- **第二來源（集文版）**：177 頁、SHA-256 `6b4c5e00…c4f6`。目錄題名為《合併十八飛星紫微斗數》，主要是十八飛星體系；與《全書》平行的只有十四主星問答（集文版 p105–113 ↔ 《全書》卷一〈諸星問答論〉），而本 App 引用的是卷二「一命宮」，不是同一段文字。集文版掃描原生約 150 dpi、二值化，多數字無法逐字確認，因此只登錄平行段落與大意（`visualVerified=false`），**0 筆異文、0 筆來源衝突**（不代表兩版相同）。
- **已校驗引用 35 筆**；**判讀規則 21 條**：
  - 14 條主星坐命規則（7 條產生長期傾向類生活因素）；
  - 大限：`ZW_DECADE_SHA_IN_LIMIT`（大限命宮有擎羊、陀羅、火星、鈴星、地空或地劫 → 原文「成敗不一」→ 狀態起伏，只作 periodModifier；原文「忌星」未說明哪一層，暫不納入條件）；
  - 流年：`ZW_ANNUAL_TAISUI_AT_MING`（流年命宮在本命命宮 → 原文「禍福尤緊」→ 只提醒，不產生生活因素）；
  - 5 條判讀原則（論人命入格、論格星數高下、論行限分南北斗、大限／流年分層），不單獨觸發。
- **待校驗 29 項**（`src/kb/ziwei/pending.ts`）：各星入男命／入女命／入限吉凶訣、各宮星曜條件句、格局候選（定富局、定貴局、定貧賤局、定雜局）、論男女命異同、論陰騭延壽、論羊陀夾併、p48–55 條件表、父母宮首句、集文版問答、來源包 OCR。全部不匯入、不引用、不啟用。
- **覆蓋**：綜合、工作、財運、不動產為 partial（綜合已有本命＋大限＋流年三層）；其餘 13 個主題 none。「專屬」只計會產生生活因素的規則。紫微只在這 4 個主題參與建議，**仍不參與任何計分**。
- **來源包 v3 保存**：說明、索引、人工初稿與 manifest 放在 `src/data/classics/ziwei/package-v3/`（測試核對雜湊）；兩本 PDF 與 OCR 稿不放入 git。

## 二、處理流程

```
ZiweiChart（客觀排盤）
 → 判讀語境 contexts（三方四正、四化、空宮、本命／大限／流年）
 → ZiweiInterpretationRule（只有啟用＋已校驗＋引用原文逐字相符才可用）
 → 判讀：baseNatalMeaning ／ periodModifier ／ annualModifier
 → LifeFactor（與八字、奇門、梅花共用同一份詞彙表）
 → InterpretationResult（mappingType = nativeInterpretation）
 → CrossSystemAdviceEngine → ActionAdviceEngine
```

| 模組 | 檔案 |
|---|---|
| 來源、引用、校勘、衝突的資料模型；逐字比對 | `src/core/ziwei/interp/citation.ts` |
| 來源登錄與引用定位 | `src/kb/ziwei/sources.ts` |
| 掃描來源與逐段轉錄（PDF 雜湊、頁碼、裁切範圍） | `src/data/classics/ziwei/quanshu-guangyi/`（`source.json`、`transcription.json`、`sha256.json`） |
| 已匯入原文（只收已校驗段落） | `src/kb/ziwei/texts/imported.ts` |
| 重新產生每段影像供複核／重算雜湊 | `scripts/ziwei-scan-crops.py`、`scripts/ziwei-scan-sha.mjs` |
| 純文字來源匯入（目前沒有） | `scripts/import-ziwei-classic.mjs` |
| 宮位、星曜語義型別與資料 | `src/core/ziwei/interp/semantics.ts`、`src/kb/ziwei/semantics.ts` |
| 客觀判讀語境 | `src/core/ziwei/interp/contexts.ts` |
| 判讀規則、格局規則格式 | `src/core/ziwei/interp/rules.ts` |
| 規則登錄、格局、衝突清單 | `src/kb/ziwei/interpretationRules.ts` |
| 引擎、閘門、覆蓋矩陣、追溯、轉接 | `src/core/ziwei/interp/engine.ts` |
| 畫面 | `src/ui/ZiweiInterpretation.tsx`（命盤頁紫微判讀面板）、`/sources/ziwei/` |

## 三、來源優先級

| Tier | 來源 | 用途 | 目前狀態 |
|---|---|---|---|
| 1 | 《紫微斗數全書》廣益版掃描 | 主要古典基準 | 已匯入 35 段已校驗轉錄 |
| 1 | 《紫微斗數全書》維基文庫本 | 版本比對 | 網路政策拒絕連線，未匯入 |
| 2 | 《紫微斗數捷覽》 | 版本校勘、異文比較 | 只有書目資料 |
| 2 | 《紫微斗數全集》集文版掃描 | 段落定位與大意對照 | 已取得並核對雜湊；掃描不足以逐字比對，0 筆異文 |
| 4 | iztro | 排盤、星曜位置、亮度、四化的軟體相容性比對 | 不可作為古籍來源、判讀權威、格局原文或吉凶權重來源 |
| 5 | 一般網路文章 | 線索 | 不可單獨成為正式判讀規則的依據 |

規則閘門會拒絕引用 Tier 4、5 的判讀規則（有測試）。

## 四、資料分層（不得混在一起）

`originalText`（原文）→ `classicalCommentary`（古注）→ `modernTranslation`（白話翻譯）→ `interpretation`（App 依盤面的命理解讀）→ `lifeFactors`（共用生活因素）→ `advice`（ActionAdviceEngine 的建議）。

每條判讀規則另外分開寫 `classicalPrinciple`（古籍原則，必須有已校驗的引用）與 `appImplementation`（App 做了什麼結構化整理），避免被誤認為整套邏輯都是古籍原文。

引用粒度到「來源＋版本＋卷＋篇＋條目」；位置在原文匯入前一律標 `locationStatus = unverified`。

## 五、校勘與來源衝突

- 每筆引用保存 sourceId、版本、卷、篇、原文、正規化文字、白話翻譯、驗證狀態（verified／partiallyVerified／pendingVerification／conflictingSources）、異文（textualVariants）與備註。
- 版本不同時不偷偷選一個：記錄異文，並標示規則採用哪個版本（`adoptedVariant`）。
- 不同古籍判法不同時先建立 `SourceConflict`（規則、來源 A／B、差異、是否改變排盤、是否改變判讀、目前採用來源）。只是文字異文或解釋細節時標記後繼續；只有兩個 Tier 1／Tier 2 來源實質衝突且無法依優先級處理時才詢問使用者。

## 六、判讀語境

- **三方四正**：本宮坐守、對宮、三合宮 A、三合宮 B 分開保存，每個因素帶 relationType；照會星不會被當成坐守星。
- **四化**：生年、大限、流年分開保存（星、化、所在宮、來源天干、規則編號）；宮干飛化尚未實作。不設「祿＝加分、忌＝扣分」。
- **空宮**：坐守星與借對宮星分開；`borrowedStarWeight` 維持 `undefined`，古籍未給數值前不替借星設任何權重。
- **運限**：本命 → 大限 → 流年三層，判讀分成 `baseNatalMeaning`、`periodModifier`、`annualModifier`；單一流年四化不推翻整張本命盤。

## 七、宮位與星曜語義

- 十二宮：palaceId、原書宮名（夫妻＝「妻妾」、交友＝「奴僕」）、古典篇旨（11 宮已校驗；父母宮只有篇名，首句待核對）、現代用途（App 依宮名字義整理，標為 `palaceNameLiteral`）、相關主題、判讀範圍、必須一併看的三方四正宮位、注意事項（例：工作問題不能只看官祿宮；疾厄篇原文先看命宮再看疾厄宮）。
- 十四主星：不是「某星＝某性格」的關鍵字表。欄位為核心主題（coreThemes）、有利表現、需要留意、成立條件、宮位依賴、星曜組合、引用、現代說明、生活因素候選（含未啟用原因）與驗證狀態；原文沒寫到的欄位維持待校驗。核心性質不等於對使用者的人格定論；原書外貌描述只留在原文層。

## 八、規則閘門與啟用階段

一條判讀規則要**同時**符合下列條件才會使用：

1. `enabled = true`；
2. 驗證狀態為 verified 或 partiallyVerified；
3. 有成立條件；
4. 每條引用都來自 Tier 1–3，且能在匯入原文中逐字找到（正規化後比對，只在指定篇內比對）。

紫微在建議引擎中的狀態依覆蓋矩陣決定：`pending`（沒有可用規則）→ `partial`（部分主題可用，只在 `coveredTopics` 參與建議）→ `active`（所有主題皆 dedicated）。例如工作已有可用規則、投資還沒有時，工作建議納入紫微，投資建議仍只用其他系統（有測試）。

覆蓋等級：可用規則 0 條為 none；有可用規則為 partial；可用規則至少 10 條且同時涵蓋本命與運限為 dedicated。

## 九、每條規則的追溯鏈

古籍原文（引用，含 PDF 頁碼）→ 古籍原則（classicalPrinciple）→ 現代中性語義（modernSemantic）→ 盤面成立條件（condition）→ 判讀（interpretation）→ 生活因素（lifeFactors）→ ActionAdviceEngine。
`/sources/ziwei/` 可點選任一主星、宮位或運限，看到出處（卷、篇、條目、PDF 頁）、原文（原文層，專業模式預設展開）、白話翻譯、校勘備註、使用它的規則與整條鏈。

判讀層的限制（有測試）：不寫外貌、不寫宿命式結論（短命、貧窮、離婚、犯罪、疾病等）；生活因素只用長期傾向類（aptitude＊），不把本命特質當成每日吉凶。

## 十、下一步

1. 人工以 `python3 scripts/ziwei-scan-crops.py <PDF> <資料夾>` 複核 35 段影像。
2. 核對卷二「十二宮廟旺落陷圖」，確認廟旺表後才啟用以亮度為前提的規則（例：天機入廟、巨門不入廟）。
3. 逐段核對各星「入男命／入女命／入限吉凶訣」，並確認「限」的指涉。
4. 核對格局篇章（p19–20 起），條件完整才建立 ZiweiPatternRule，並依〈論人命入格〉同時檢查亮度、吉化與煞忌。
5. 若能取得較高解析度的集文版或其他版本，再對〈諸星問答論〉做逐字異文比對。
6. 紫微計分另開階段，等覆蓋足夠後再做。
