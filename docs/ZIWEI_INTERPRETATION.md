# 紫微斗數專業判讀資料層與 Interpretation Engine

> 目標：紫微判讀有來源、可追溯、可測試，最後交給 ActionAdviceEngine 產生具體建議。原則是「沒有足夠來源 → 暫不判」，不為了畫面完整補規則。
> 逐條登錄（自動產生）：`docs/ZIWEI_RULE_REGISTRY.md`

## 一、目前狀態（第一階段）

- **框架已完成**：來源登錄、引用與校勘模型、宮位與星曜語義登錄、客觀判讀語境（三方四正、四化、空宮、本命／大限／流年）、判讀規則與格局規則格式、規則閘門、判讀追溯、主題判讀輸出、覆蓋矩陣，以及接上 ActionAdviceEngine 的轉接層。
- **古籍原文尚未匯入**：本環境的網路政策拒絕連線 `zh.wikisource.org`、`ctext.org`，也沒有其他附明確版本出處的《紫微斗數全書》文本可用。依「無法確認文字就 pending、不要猜」的原則，**不憑記憶填寫任何古籍原文**。
- 因此正式規則庫目前是 **28 條待校驗條目**（14 主星基本性質、12 宮古典語義、大限與流年判讀原則），全部 `pendingVerification`、未啟用、沒有條件與判讀內容；格局規則 0 條；來源衝突 0 筆。
- 覆蓋矩陣 17 個主題全部為 `none`，紫微在建議引擎中維持 `pending`：不參與建議、不當成中性、不影響其他系統；本階段也不做任何紫微分數。

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
| 原文匯入（產生 `src/kb/ziwei/texts/imported.generated.ts`） | `scripts/import-ziwei-classic.mjs` |
| 宮位、星曜語義型別與資料 | `src/core/ziwei/interp/semantics.ts`、`src/kb/ziwei/semantics.ts` |
| 客觀判讀語境 | `src/core/ziwei/interp/contexts.ts` |
| 判讀規則、格局規則格式 | `src/core/ziwei/interp/rules.ts` |
| 規則登錄、格局、衝突清單 | `src/kb/ziwei/interpretationRules.ts` |
| 引擎、閘門、覆蓋矩陣、追溯、轉接 | `src/core/ziwei/interp/engine.ts` |
| 畫面 | `src/ui/ZiweiInterpretation.tsx`（命盤頁紫微判讀面板）、`/sources/ziwei/` |

## 三、來源優先級

| Tier | 來源 | 用途 | 目前狀態 |
|---|---|---|---|
| 1 | 《紫微斗數全書》 | 主要古典基準：主星性質、十二宮、諸星問答、得地失陷、格局、大限太歲流年、同垣組合 | 公有領域；原文尚未匯入 |
| 2 | 《紫微斗數捷覽》 | 版本校勘、異文比較、補充 | 只有書目，無合法可用文本 |
| 2 | 《紫微斗數全集》 | 與《全書》比對異文 | 無可靠全文 |
| 3 | 可信現代研究 | 補充、比較、流派擴充 | 未指定 |
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

- 十二宮：palaceId、古典語義（待校驗）、現代用途（App 依宮名字義整理，標為 `palaceNameLiteral`）、相關主題、判讀範圍、必須一併看的三方四正宮位、注意事項（例：工作問題不能只看官祿宮）。
- 十四主星：不是「某星＝某性格」的關鍵字表。每顆星分成核心性質、有利表現、失衡表現、宮位語境、三方四正影響、四化後變化、吉煞共同作用七個欄位，加上來源、流派、信心與適用限制；核心性質不等於對使用者的人格定論。目前七個欄位都待原文校驗。

## 八、規則閘門與啟用階段

一條判讀規則要**同時**符合下列條件才會使用：

1. `enabled = true`；
2. 驗證狀態為 verified 或 partiallyVerified；
3. 有成立條件；
4. 每條引用都來自 Tier 1–3，且能在匯入原文中逐字找到（正規化後比對，只在指定篇內比對）。

紫微在建議引擎中的狀態依覆蓋矩陣決定：`pending`（沒有可用規則）→ `partial`（部分主題可用，只在 `coveredTopics` 參與建議）→ `active`（所有主題皆 dedicated）。例如工作已有可用規則、投資還沒有時，工作建議納入紫微，投資建議仍只用其他系統（有測試）。

覆蓋等級：可用規則 0 條為 none；有可用規則為 partial；可用規則至少 10 條且同時涵蓋本命與運限為 dedicated。

## 九、下一步：建立第一批已校驗規則

1. 在環境設定中允許 `zh.wikisource.org`（或 `ctext.org`），或提供合法取得的《紫微斗數全書》文字檔。
2. 執行 `node scripts/import-ziwei-classic.mjs <檔案> --source ziwei.quanshu --edition "<版本>" --origin "<來源>"`，記錄版本與 SHA-256。
3. 依優先順序逐條建立規則：十四主星基礎性質 → 十二宮基礎語義 → 主星入十二宮的明確規則 → 明確記載的星曜組合 → 得地／失陷條件 → 大限／流年原則。每條填入逐字原文、白話翻譯、古籍原則、App 整理、條件與生活因素；無法確認文字或成立條件的保持 pending。
4. 重新產生 `docs/ZIWEI_RULE_REGISTRY.md`，覆蓋矩陣會自動顯示進度；達到覆蓋的主題才會讓紫微進入跨系統建議。
5. 紫微計分另開階段，等覆蓋足夠後再做。
