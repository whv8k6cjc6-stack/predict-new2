# 紫微斗數判讀：來源與規則登錄

> 自動產生，請勿手改（判讀規則版本 0.1.0）。更新：ADVICE_DOCS_WRITE=1 npx vitest run src/tests/advice-docs.test.ts

## 來源

| Tier | 來源 | 角色 | 內容狀態 | 用途 | 不可作為 |
|---|---|---|---|---|---|
| 1 | 《紫微斗數全書》 | primaryClassical | notInRepository | 十四主星基本性質、星曜在十二宮的基本語義、諸星問答、十二宮判讀、星曜得地／失陷、古典格局（富局、貴局、貧賤局、雜局）、大限、太歲、流年、行限、同垣星曜組合 | 直接轉成現代吉凶分數 |
| 2 | 《紫微斗數捷覽》 | secondaryClassical | unavailable | 版本校勘、異文比較、補充古典規則 | 在沒有合法文本時作為判讀依據 |
| 2 | 《紫微斗數全集》 | secondaryClassical | unavailable | 與《紫微斗數全書》比對異文、星曜文字、格局條件、宮位判斷、運限描述 | 在沒有可靠全文時作為判讀依據 |
| 4 | 《iztro》（2.6.1） | softwareDataset | imported | 排盤位置驗證、星曜位置驗證、亮度表來源、四化與安星的軟體相容性比對 | 古籍來源、紫微判讀權威、格局原文來源、吉凶權重來源 |
| 5 | 《一般網路文章》 | webArticle | unavailable | 線索參考 | 單獨作為正式判讀規則的依據 |

已匯入原文：無

## 主題覆蓋矩陣

| 主題 | 覆蓋 | 規則 | 已校驗 | 待校驗 | 來源 |
|---|---|---|---|---|---|
| 綜合（general） | none | 20 | 0 | 20 | — |
| 工作（career） | none | 1 | 0 | 1 | — |
| 升遷（promotion） | none | 2 | 0 | 2 | — |
| 求職（jobSearch） | none | 1 | 0 | 1 | — |
| 轉職（jobChange） | none | 2 | 0 | 2 | — |
| 財運（wealth） | none | 1 | 0 | 1 | — |
| 投資（investment） | none | 1 | 0 | 1 | — |
| 感情（relationship） | none | 1 | 0 | 1 | — |
| 婚姻（marriage） | none | 1 | 0 | 1 | — |
| 人際（social） | none | 2 | 0 | 2 | — |
| 健康（health） | none | 2 | 0 | 2 | — |
| 出行（travel） | none | 1 | 0 | 1 | — |
| 合作（cooperation） | none | 2 | 0 | 2 | — |
| 訴訟（lawsuit） | none | 0 | 0 | 0 | — |
| 考試（exam） | none | 0 | 0 | 0 | — |
| 不動產（property） | none | 1 | 0 | 1 | — |
| 決策（decision） | none | 1 | 0 | 1 | — |

## 判讀規則（28 條）

| 規則 | 類型 | 時間層 | 主題 | 狀態 | 是否可用 | 引用 | App 整理 |
|---|---|---|---|---|---|---|---|
| `ZW_STAR_ZIWEI_NATURE` | star | natal | general | pendingVerification | 待古籍原文校驗，尚未啟用 | CIT_QS_STAR_ZIWEI | 待原文匯入後，依《紫微斗數全書》「諸星問答論」紫微條整理：核心性質、有利與失衡表現、宮位語境、三方四正與四化後的變化；只收錄原文明確寫出的內容。 |
| `ZW_STAR_TIANJI_NATURE` | star | natal | general | pendingVerification | 待古籍原文校驗，尚未啟用 | CIT_QS_STAR_TIANJI | 待原文匯入後，依《紫微斗數全書》「諸星問答論」天機條整理：核心性質、有利與失衡表現、宮位語境、三方四正與四化後的變化；只收錄原文明確寫出的內容。 |
| `ZW_STAR_TAIYANG_NATURE` | star | natal | general | pendingVerification | 待古籍原文校驗，尚未啟用 | CIT_QS_STAR_TAIYANG | 待原文匯入後，依《紫微斗數全書》「諸星問答論」太陽條整理：核心性質、有利與失衡表現、宮位語境、三方四正與四化後的變化；只收錄原文明確寫出的內容。 |
| `ZW_STAR_WUQU_NATURE` | star | natal | general | pendingVerification | 待古籍原文校驗，尚未啟用 | CIT_QS_STAR_WUQU | 待原文匯入後，依《紫微斗數全書》「諸星問答論」武曲條整理：核心性質、有利與失衡表現、宮位語境、三方四正與四化後的變化；只收錄原文明確寫出的內容。 |
| `ZW_STAR_TIANTONG_NATURE` | star | natal | general | pendingVerification | 待古籍原文校驗，尚未啟用 | CIT_QS_STAR_TIANTONG | 待原文匯入後，依《紫微斗數全書》「諸星問答論」天同條整理：核心性質、有利與失衡表現、宮位語境、三方四正與四化後的變化；只收錄原文明確寫出的內容。 |
| `ZW_STAR_LIANZHEN_NATURE` | star | natal | general | pendingVerification | 待古籍原文校驗，尚未啟用 | CIT_QS_STAR_LIANZHEN | 待原文匯入後，依《紫微斗數全書》「諸星問答論」廉貞條整理：核心性質、有利與失衡表現、宮位語境、三方四正與四化後的變化；只收錄原文明確寫出的內容。 |
| `ZW_STAR_TIANFU_NATURE` | star | natal | general | pendingVerification | 待古籍原文校驗，尚未啟用 | CIT_QS_STAR_TIANFU | 待原文匯入後，依《紫微斗數全書》「諸星問答論」天府條整理：核心性質、有利與失衡表現、宮位語境、三方四正與四化後的變化；只收錄原文明確寫出的內容。 |
| `ZW_STAR_TAIYIN_NATURE` | star | natal | general | pendingVerification | 待古籍原文校驗，尚未啟用 | CIT_QS_STAR_TAIYIN | 待原文匯入後，依《紫微斗數全書》「諸星問答論」太陰條整理：核心性質、有利與失衡表現、宮位語境、三方四正與四化後的變化；只收錄原文明確寫出的內容。 |
| `ZW_STAR_TANLANG_NATURE` | star | natal | general | pendingVerification | 待古籍原文校驗，尚未啟用 | CIT_QS_STAR_TANLANG | 待原文匯入後，依《紫微斗數全書》「諸星問答論」貪狼條整理：核心性質、有利與失衡表現、宮位語境、三方四正與四化後的變化；只收錄原文明確寫出的內容。 |
| `ZW_STAR_JUMEN_NATURE` | star | natal | general | pendingVerification | 待古籍原文校驗，尚未啟用 | CIT_QS_STAR_JUMEN | 待原文匯入後，依《紫微斗數全書》「諸星問答論」巨門條整理：核心性質、有利與失衡表現、宮位語境、三方四正與四化後的變化；只收錄原文明確寫出的內容。 |
| `ZW_STAR_TIANXIANG_NATURE` | star | natal | general | pendingVerification | 待古籍原文校驗，尚未啟用 | CIT_QS_STAR_TIANXIANG | 待原文匯入後，依《紫微斗數全書》「諸星問答論」天相條整理：核心性質、有利與失衡表現、宮位語境、三方四正與四化後的變化；只收錄原文明確寫出的內容。 |
| `ZW_STAR_TIANLIANG_NATURE` | star | natal | general | pendingVerification | 待古籍原文校驗，尚未啟用 | CIT_QS_STAR_TIANLIANG | 待原文匯入後，依《紫微斗數全書》「諸星問答論」天梁條整理：核心性質、有利與失衡表現、宮位語境、三方四正與四化後的變化；只收錄原文明確寫出的內容。 |
| `ZW_STAR_QISHA_NATURE` | star | natal | general | pendingVerification | 待古籍原文校驗，尚未啟用 | CIT_QS_STAR_QISHA | 待原文匯入後，依《紫微斗數全書》「諸星問答論」七殺條整理：核心性質、有利與失衡表現、宮位語境、三方四正與四化後的變化；只收錄原文明確寫出的內容。 |
| `ZW_STAR_POJUN_NATURE` | star | natal | general | pendingVerification | 待古籍原文校驗，尚未啟用 | CIT_QS_STAR_POJUN | 待原文匯入後，依《紫微斗數全書》「諸星問答論」破軍條整理：核心性質、有利與失衡表現、宮位語境、三方四正與四化後的變化；只收錄原文明確寫出的內容。 |
| `ZW_PALACE_MING_MEANING` | palace | natal | general、decision | pendingVerification | 待古籍原文校驗，尚未啟用 | CIT_QS_PALACE_MING | 待原文匯入後，依《紫微斗數全書》十二宮相關論述整理「命宮」的古典語義與判讀範圍。 |
| `ZW_PALACE_XIONGDI_MEANING` | palace | natal | social、cooperation | pendingVerification | 待古籍原文校驗，尚未啟用 | CIT_QS_PALACE_XIONGDI | 待原文匯入後，依《紫微斗數全書》十二宮相關論述整理「兄弟」的古典語義與判讀範圍。 |
| `ZW_PALACE_FUQI_MEANING` | palace | natal | relationship、marriage | pendingVerification | 待古籍原文校驗，尚未啟用 | CIT_QS_PALACE_FUQI | 待原文匯入後，依《紫微斗數全書》十二宮相關論述整理「夫妻」的古典語義與判讀範圍。 |
| `ZW_PALACE_ZINV_MEANING` | palace | natal | general | pendingVerification | 待古籍原文校驗，尚未啟用 | CIT_QS_PALACE_ZINV | 待原文匯入後，依《紫微斗數全書》十二宮相關論述整理「子女」的古典語義與判讀範圍。 |
| `ZW_PALACE_CAIBO_MEANING` | palace | natal | wealth、investment | pendingVerification | 待古籍原文校驗，尚未啟用 | CIT_QS_PALACE_CAIBO | 待原文匯入後，依《紫微斗數全書》十二宮相關論述整理「財帛」的古典語義與判讀範圍。 |
| `ZW_PALACE_JIE_MEANING` | palace | natal | health | pendingVerification | 待古籍原文校驗，尚未啟用 | CIT_QS_PALACE_JIE | 待原文匯入後，依《紫微斗數全書》十二宮相關論述整理「疾厄」的古典語義與判讀範圍。 |
| `ZW_PALACE_QIANYI_MEANING` | palace | natal | travel、jobChange | pendingVerification | 待古籍原文校驗，尚未啟用 | CIT_QS_PALACE_QIANYI | 待原文匯入後，依《紫微斗數全書》十二宮相關論述整理「遷移」的古典語義與判讀範圍。 |
| `ZW_PALACE_JIAOYOU_MEANING` | palace | natal | social、cooperation | pendingVerification | 待古籍原文校驗，尚未啟用 | CIT_QS_PALACE_JIAOYOU | 待原文匯入後，依《紫微斗數全書》十二宮相關論述整理「交友」的古典語義與判讀範圍。 |
| `ZW_PALACE_GUANLU_MEANING` | palace | natal | career、promotion、jobSearch、jobChange | pendingVerification | 待古籍原文校驗，尚未啟用 | CIT_QS_PALACE_GUANLU | 待原文匯入後，依《紫微斗數全書》十二宮相關論述整理「官祿」的古典語義與判讀範圍。 |
| `ZW_PALACE_TIANZHAI_MEANING` | palace | natal | property | pendingVerification | 待古籍原文校驗，尚未啟用 | CIT_QS_PALACE_TIANZHAI | 待原文匯入後，依《紫微斗數全書》十二宮相關論述整理「田宅」的古典語義與判讀範圍。 |
| `ZW_PALACE_FUDE_MEANING` | palace | natal | health、general | pendingVerification | 待古籍原文校驗，尚未啟用 | CIT_QS_PALACE_FUDE | 待原文匯入後，依《紫微斗數全書》十二宮相關論述整理「福德」的古典語義與判讀範圍。 |
| `ZW_PALACE_FUMU_MEANING` | palace | natal | general、promotion | pendingVerification | 待古籍原文校驗，尚未啟用 | CIT_QS_PALACE_FUMU | 待原文匯入後，依《紫微斗數全書》十二宮相關論述整理「父母」的古典語義與判讀範圍。 |
| `ZW_PERIOD_DAXIAN_PRINCIPLE` | period | decade | general | pendingVerification | 待古籍原文校驗，尚未啟用 | CIT_QS_PERIOD_DAXIAN | 待原文匯入後，整理大限判讀原則；大限只作本命的修正（periodModifier），不推翻本命。 |
| `ZW_PERIOD_ANNUAL_PRINCIPLE` | period | annual | general | pendingVerification | 待古籍原文校驗，尚未啟用 | CIT_QS_PERIOD_TAISUI | 待原文匯入後，整理太歲、流年判讀原則；流年只作修正（annualModifier），單一流年四化不推翻整張本命盤。 |

## 引用定位（28 筆）

| 引用 | 來源 | 篇 | 條目 | 位置 | 原文 | 狀態 |
|---|---|---|---|---|---|---|
| `CIT_QS_STAR_ZIWEI` | ziwei.quanshu | 諸星問答論 | 紫微 | unverified | （未匯入，不憑記憶填寫） | pendingVerification |
| `CIT_QS_STAR_TIANJI` | ziwei.quanshu | 諸星問答論 | 天機 | unverified | （未匯入，不憑記憶填寫） | pendingVerification |
| `CIT_QS_STAR_TAIYANG` | ziwei.quanshu | 諸星問答論 | 太陽 | unverified | （未匯入，不憑記憶填寫） | pendingVerification |
| `CIT_QS_STAR_WUQU` | ziwei.quanshu | 諸星問答論 | 武曲 | unverified | （未匯入，不憑記憶填寫） | pendingVerification |
| `CIT_QS_STAR_TIANTONG` | ziwei.quanshu | 諸星問答論 | 天同 | unverified | （未匯入，不憑記憶填寫） | pendingVerification |
| `CIT_QS_STAR_LIANZHEN` | ziwei.quanshu | 諸星問答論 | 廉貞 | unverified | （未匯入，不憑記憶填寫） | pendingVerification |
| `CIT_QS_STAR_TIANFU` | ziwei.quanshu | 諸星問答論 | 天府 | unverified | （未匯入，不憑記憶填寫） | pendingVerification |
| `CIT_QS_STAR_TAIYIN` | ziwei.quanshu | 諸星問答論 | 太陰 | unverified | （未匯入，不憑記憶填寫） | pendingVerification |
| `CIT_QS_STAR_TANLANG` | ziwei.quanshu | 諸星問答論 | 貪狼 | unverified | （未匯入，不憑記憶填寫） | pendingVerification |
| `CIT_QS_STAR_JUMEN` | ziwei.quanshu | 諸星問答論 | 巨門 | unverified | （未匯入，不憑記憶填寫） | pendingVerification |
| `CIT_QS_STAR_TIANXIANG` | ziwei.quanshu | 諸星問答論 | 天相 | unverified | （未匯入，不憑記憶填寫） | pendingVerification |
| `CIT_QS_STAR_TIANLIANG` | ziwei.quanshu | 諸星問答論 | 天梁 | unverified | （未匯入，不憑記憶填寫） | pendingVerification |
| `CIT_QS_STAR_QISHA` | ziwei.quanshu | 諸星問答論 | 七殺 | unverified | （未匯入，不憑記憶填寫） | pendingVerification |
| `CIT_QS_STAR_POJUN` | ziwei.quanshu | 諸星問答論 | 破軍 | unverified | （未匯入，不憑記憶填寫） | pendingVerification |
| `CIT_QS_PALACE_MING` | ziwei.quanshu | （待定位） | 命宮 | unverified | （未匯入，不憑記憶填寫） | pendingVerification |
| `CIT_QS_PALACE_XIONGDI` | ziwei.quanshu | （待定位） | 兄弟 | unverified | （未匯入，不憑記憶填寫） | pendingVerification |
| `CIT_QS_PALACE_FUQI` | ziwei.quanshu | （待定位） | 夫妻 | unverified | （未匯入，不憑記憶填寫） | pendingVerification |
| `CIT_QS_PALACE_ZINV` | ziwei.quanshu | （待定位） | 子女 | unverified | （未匯入，不憑記憶填寫） | pendingVerification |
| `CIT_QS_PALACE_CAIBO` | ziwei.quanshu | （待定位） | 財帛 | unverified | （未匯入，不憑記憶填寫） | pendingVerification |
| `CIT_QS_PALACE_JIE` | ziwei.quanshu | （待定位） | 疾厄 | unverified | （未匯入，不憑記憶填寫） | pendingVerification |
| `CIT_QS_PALACE_QIANYI` | ziwei.quanshu | （待定位） | 遷移 | unverified | （未匯入，不憑記憶填寫） | pendingVerification |
| `CIT_QS_PALACE_JIAOYOU` | ziwei.quanshu | （待定位） | 交友 | unverified | （未匯入，不憑記憶填寫） | pendingVerification |
| `CIT_QS_PALACE_GUANLU` | ziwei.quanshu | （待定位） | 官祿 | unverified | （未匯入，不憑記憶填寫） | pendingVerification |
| `CIT_QS_PALACE_TIANZHAI` | ziwei.quanshu | （待定位） | 田宅 | unverified | （未匯入，不憑記憶填寫） | pendingVerification |
| `CIT_QS_PALACE_FUDE` | ziwei.quanshu | （待定位） | 福德 | unverified | （未匯入，不憑記憶填寫） | pendingVerification |
| `CIT_QS_PALACE_FUMU` | ziwei.quanshu | （待定位） | 父母 | unverified | （未匯入，不憑記憶填寫） | pendingVerification |
| `CIT_QS_PERIOD_DAXIAN` | ziwei.quanshu | （待定位） | 大限 | unverified | （未匯入，不憑記憶填寫） | pendingVerification |
| `CIT_QS_PERIOD_TAISUI` | ziwei.quanshu | （待定位） | 太歲／流年 | unverified | （未匯入，不憑記憶填寫） | pendingVerification |

## 十二宮語義（現代用途為 App 依宮名整理）

| 宮 | 現代用途 | 相關主題 | 對宮 | 三合宮 | 古典語義 |
|---|---|---|---|---|---|
| 命宮 | 本人的整體狀態與基本傾向 | general、decision | 遷移 | 財帛、官祿 | 待校驗 |
| 兄弟 | 兄弟姊妹、同輩與平輩往來 | social、cooperation | 交友 | 疾厄、田宅 | 待校驗 |
| 夫妻 | 伴侶與婚姻關係 | relationship、marriage | 官祿 | 遷移、福德 | 待校驗 |
| 子女 | 子女與晚輩 | general | 田宅 | 交友、父母 | 待校驗 |
| 財帛 | 金錢的收入與支出 | wealth、investment | 福德 | 官祿、命宮 | 待校驗 |
| 疾厄 | 身體狀況（只作生活作息提醒） | health | 父母 | 田宅、兄弟 | 待校驗 |
| 遷移 | 外出、移動與在外的環境 | travel、jobChange | 命宮 | 福德、夫妻 | 待校驗 |
| 交友 | 朋友、同事與往來對象 | social、cooperation | 兄弟 | 父母、子女 | 待校驗 |
| 官祿 | 工作、職務與事業 | career、promotion、jobSearch、jobChange | 夫妻 | 命宮、財帛 | 待校驗 |
| 田宅 | 住所、不動產與家庭環境 | property | 子女 | 兄弟、疾厄 | 待校驗 |
| 福德 | 精神生活、興趣與內在感受 | health、general | 財帛 | 夫妻、遷移 | 待校驗 |
| 父母 | 父母、長輩與上級 | general、promotion | 疾厄 | 子女、交友 | 待校驗 |

## 格局規則：0 條

## 來源衝突：無
