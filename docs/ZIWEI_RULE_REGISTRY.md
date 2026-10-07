# 紫微斗數判讀：來源與規則登錄

> 自動產生，請勿手改（判讀規則版本 2.0.0）。更新：ADVICE_DOCS_WRITE=1 npx vitest run src/tests/advice-docs.test.ts

## 紫微判讀完成度

- 原文：《紫微斗數全書》廣益版 PDF 34 頁（67 個半頁、565 欄組，含書縫與切邊補轉錄 130），原始掃描影像雙重核讀的欄組 362；仍存疑 381 處。驗證方式：兩輪獨立 AI 目視轉錄＋差異回影像決議（非學術人工校勘；humanReviewed＝否）。
- 引用：1210 筆，可作規則依據 1184，含疑字 26。
- 判讀規則：1194 條，可用 789（本命 680、大限 76、流年 33），產生生活因素 728；判讀原則 8。
- 格局：PatternRule 53（啟用 53）、PatternCandidate 47。
- 古典廟旺：349 條；與 iztro 軟體亮度不同 44 處（不改客觀排盤）。
- 舊 35 段第二次核讀：逐字相同 35、疑字已決議 0、仍有疑字 0、找不到 0。
- 紫微計分：pending（停用）。

## 來源

| Tier | 來源 | 角色 | 內容狀態 | 用途 | 不可作為 |
|---|---|---|---|---|---|
| 1 | 《紫微斗數全書》（廣益版（上海廣益書局印行，掃描影像）） | primaryClassical | imported | 十四主星基本性質、十二宮判讀、大限、小限、太歲（流年）判讀原則、星曜得地／失陷（待逐段核對）、古典格局（待逐段核對） | 直接轉成現代吉凶分數、未經影像逐字核對的段落（OCR 或初稿） |
| 1 | 《紫微斗數全書》（維基文庫系電子全文（繁體）） | primaryClassical | notInRepository | 與廣益版掃描比對文字、第二來源佐證：兩輪目視讀法不一、未能回影像決議處，採與電子全文逐字相同的一輪讀法 | 直接提供答案（兩輪都讀不出的字不採電子本）、覆蓋廣益版已雙重核讀的文字、單獨作為判讀規則的依據 |
| 2 | 《紫微斗數捷覽》 | secondaryClassical | unavailable | 版本校勘、異文比較、補充古典規則 | 在沒有合法文本時作為判讀依據 |
| 2 | 《紫微斗數全集》（集文版（掃描影像）） | secondaryClassical | notInRepository | 段落定位與大意對照（十四主星問答與《全書》〈諸星問答論〉平行） | 逐字引用（掃描約 150 dpi、二值化，多數字無法確認）、建立異文或規則、靜默覆寫廣益版文字 |
| 4 | 《iztro》（2.6.1） | softwareDataset | imported | 排盤位置驗證、星曜位置驗證、亮度表來源、四化與安星的軟體相容性比對 | 古籍來源、紫微判讀權威、格局原文來源、吉凶權重來源 |
| 5 | 《一般網路文章》 | webArticle | unavailable | 線索參考 | 單獨作為正式判讀規則的依據 |

已匯入原文：ziwei-doushu-quanshu-guangyi-scan（廣益版，35 段已依 PDF 影像逐字核對，PDF SHA-256 cec2c444290ac70020a5ae4e20a50c07a0064783e53ff3162f90a299d7831186）、ziwei-doushu-quanshu-guangyi-scan（廣益版，67 段已依 PDF 影像逐字核對，PDF SHA-256 cec2c444290ac70020a5ae4e20a50c07a0064783e53ff3162f90a299d7831186）

## 主題覆蓋矩陣

| 主題 | 覆蓋 | 規則 | 可用 | 產生生活因素 | 待校驗 | 時間層 | 來源 |
|---|---|---|---|---|---|---|---|
| 綜合（general） | dedicated | 953 | 548 | 488 | 397 | natal、decade、annual | ziwei-doushu-quanshu-guangyi-scan |
| 工作（career） | dedicated | 455 | 446 | 446 | 9 | natal、decade、annual | ziwei-doushu-quanshu-guangyi-scan |
| 升遷（promotion） | dedicated | 193 | 190 | 190 | 3 | natal、decade | ziwei-doushu-quanshu-guangyi-scan |
| 求職（jobSearch） | generalOnly | 0 | 0 | 0 | 0 | — | — |
| 轉職（jobChange） | partial | 20 | 18 | 18 | 2 | natal | ziwei-doushu-quanshu-guangyi-scan |
| 財運（wealth） | dedicated | 334 | 330 | 330 | 4 | natal、decade、annual | ziwei-doushu-quanshu-guangyi-scan |
| 投資（investment） | partial | 28 | 28 | 28 | 0 | natal | ziwei-doushu-quanshu-guangyi-scan |
| 感情（relationship） | dedicated | 26 | 26 | 25 | 0 | decade、natal、annual | ziwei-doushu-quanshu-guangyi-scan |
| 婚姻（marriage） | dedicated | 26 | 26 | 25 | 0 | decade、natal、annual | ziwei-doushu-quanshu-guangyi-scan |
| 人際（social） | dedicated | 66 | 65 | 65 | 1 | decade、natal、annual | ziwei-doushu-quanshu-guangyi-scan |
| 健康（health） | dedicated | 39 | 39 | 39 | 0 | natal、decade | ziwei-doushu-quanshu-guangyi-scan |
| 出行（travel） | partial | 49 | 49 | 49 | 0 | natal | ziwei-doushu-quanshu-guangyi-scan |
| 合作（cooperation） | partial | 30 | 30 | 30 | 0 | natal | ziwei-doushu-quanshu-guangyi-scan |
| 訴訟（lawsuit） | partial | 22 | 21 | 21 | 1 | decade、annual | ziwei-doushu-quanshu-guangyi-scan |
| 考試（exam） | dedicated | 35 | 33 | 33 | 2 | natal、decade、annual | ziwei-doushu-quanshu-guangyi-scan |
| 不動產（property） | partial | 30 | 30 | 30 | 0 | natal | ziwei-doushu-quanshu-guangyi-scan |
| 請假（leave） | generalOnly | 0 | 0 | 0 | 0 | — | — |
| 辭職（resign） | generalOnly | 0 | 0 | 0 | 0 | — | — |
| 主觀停損（stopLoss） | generalOnly | 0 | 0 | 0 | 0 | — | — |
| 主觀停利（takeProfit） | generalOnly | 0 | 0 | 0 | 0 | — | — |
| 決策（decision） | dedicated | 49 | 49 | 49 | 0 | natal、decade、annual | ziwei-doushu-quanshu-guangyi-scan |

## 判讀規則（1194 條）

| 規則 | 類型 | 時間層 | 主題 | 狀態 | 是否可用 | 引用 | 古籍原則 | 現代中性語義 | 生活因素 |
|---|---|---|---|---|---|---|---|---|---|
| `ZW_STAR_ZIWEI_NATURE` | star | natal | general、career | verified | 可用 | CIT_QS_STAR_ZIWEI | 紫微化氣為帝座，是官祿之主；其人忠厚老成、謙恭耿直。 | 與職位、承擔職責和在組織中發揮有關。 | aptitudeResponsibility（適合承擔責任）×2 |
| `ZW_STAR_TIANJI_NATURE` | star | natal | general | verified | 可用 | CIT_QS_STAR_TIANJI | 天機化氣為善星，是兄弟之主；入廟時性急心慈、機謀多變，與天梁會合善談兵。 | 善於謀劃、思考與變通（原文以入廟為前提）。 | — |
| `ZW_STAR_TAIYANG_NATURE` | star | natal | general、career | verified | 可用 | CIT_QS_STAR_TAIYANG | 太陽化氣為貴，是官祿之主；日生為廟旺、夜生為陷。 | 與名聲、職位相關。 | aptitudeResponsibility（適合承擔責任）×2 |
| `ZW_STAR_WUQU_NATURE` | star | natal | general、wealth | verified | 可用 | CIT_QS_STAR_WUQU | 武曲化氣為財，是財帛之主；性剛果決、心直無毒。 | 與金錢和資源的經營相關；做事果決直接。 | aptitudeResources（擅長經營資源）×2 |
| `ZW_STAR_TIANTONG_NATURE` | star | natal | general | verified | 可用 | CIT_QS_STAR_TIANTONG | 天同化氣為福，是福德之主；入廟肥滿清明、仁慈耿直。 | 與福分、安樂與內在感受相關。 | — |
| `ZW_STAR_LIANZHEN_NATURE` | star | natal | general、career | verified | 可用 | CIT_QS_STAR_LIANZHEN | 廉貞化氣為次桃花，為殺星、囚星，是官祿之主。 | 與職位相關，同時帶有殺、囚的性質。 | aptitudeResponsibility（適合承擔責任）×1 |
| `ZW_STAR_TIANFU_NATURE` | star | natal | general、wealth | verified | 可用 | CIT_QS_STAR_TIANFU | 天府化氣為令星，是財帛之主。 | 與金錢和資源的經營、守成相關。 | aptitudeResources（擅長經營資源）×2 |
| `ZW_STAR_TAIYIN_NATURE` | star | natal | general、wealth、property | verified | 可用 | CIT_QS_STAR_TAIYIN | 太陰化氣為富，為母宿、妻星，是田宅之主；心性溫和、清秀耿直聰明。 | 與財富、居所和家庭相關。 | aptitudeResources（擅長經營資源）×1 |
| `ZW_STAR_TANLANG_NATURE` | star | natal | general | verified | 可用 | CIT_QS_STAR_TANLANG | 貪狼化氣為桃花殺；入廟長聳肥胖，陷宮形小；性格不常、心多計較、作事急速不耐靜。 | 與慾望、人際吸引力相關；做事節奏快。 | — |
| `ZW_STAR_JUMEN_NATURE` | star | natal | general | verified | 可用 | CIT_QS_STAR_JUMEN | 巨門化氣為暗，主是非；不入廟時作事進退疑惑、多學少精、與人寡合、多是多非。 | 與口舌、溝通和猶豫相關。 | — |
| `ZW_STAR_TIANXIANG_NATURE` | star | natal | general、career | verified | 可用 | CIT_QS_STAR_TIANXIANG | 天相化氣為印，是官祿之主；相貌敦厚、持重清白，衣祿豐足。 | 與受託負責、印信職務相關；為人持重。 | aptitudeResponsibility（適合承擔責任）×2 |
| `ZW_STAR_TIANLIANG_NATURE` | star | natal | general | verified | 可用 | CIT_QS_STAR_TIANLIANG | 天梁化氣為蔭，主壽；厚重清秀、聰明耿直、心無私曲、好施濟。 | 與庇蔭、照顧他人相關。 | — |
| `ZW_STAR_QISHA_NATURE` | star | natal | general | verified | 可用 | CIT_QS_STAR_QISHA | 七殺為將星，遇紫微為權，其餘皆以殺論；性急不常。 | 屬性剛烈；與紫微同見時性質轉為權。 | — |
| `ZW_STAR_POJUN_NATURE` | star | natal | general | verified | 可用 | CIT_QS_STAR_POJUN | 破軍化氣為耗星，主妻子奴僕；性剛寡合、爭強。 | 與耗損、變動和人際摩擦相關。 | — |
| `GY_ZIWEI_ZI_1` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_ZIWEI_ZI_1 | 紫微坐命在子宮，丁、己、庚年生人：古籍評為「貴格」。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_ZIWEI_ZI_2` | starInPalace | natal | general、career、wealth、decision | verified | 可用 | CIT_GY_ZIWEI_ZI_2 | 紫微坐命在子宮，壬、癸年生人：古籍評為「不耐久」。 | 成果不容易持久，需要定期檢視、及早鞏固 | weakeningTrend（後段吃力）×1 |
| `GY_ZIWEI_WU_1` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_ZIWEI_WU_1 | 紫微坐命在午宮，甲、丁、己年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_ZIWEI_WU_2` | starInPalace | natal | general、career、wealth、decision | verified | 可用 | CIT_GY_ZIWEI_WU_2 | 紫微坐命在午宮，丙、戊年生人：古籍評為「成敗帶疾」。 | 起伏較大，有進有退 | instability（狀態不穩）×1 |
| `GY_ZIWEI_MAOYOU_1` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_ZIWEI_MAOYOU_1 | 紫微坐命在卯、酉宮，乙、辛年生人：古籍評為「貴」。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_ZIWEI_MAOYOU_2` | starInPalace | natal | general、career、wealth、decision | verified | 可用 | CIT_GY_ZIWEI_MAOYOU_2 | 紫微坐命在卯、酉宮，甲、庚年生人：古籍評為「不耐久」。 | 成果不容易持久，需要定期檢視、及早鞏固 | weakeningTrend（後段吃力）×1 |
| `GY_ZIWEI_YINSHEN` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_ZIWEI_YINSHEN | 紫微坐命在寅、申宮，甲、庚、丁、己年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_ZIWEI_SIHAI` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_ZIWEI_SIHAI | 紫微坐命在巳、亥宮，乙、戊年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_ZIWEI_CHENXU` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_ZIWEI_CHENXU | 紫微坐命在辰、戌宮，乙、己、甲、庚、癸年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_ZIWEI_CHOUWEI` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_ZIWEI_CHOUWEI | 紫微坐命在丑、未宮，甲、庚、丁、己、乙、壬年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_ZIWEI_M1` | starInPalace | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_ZIWEI_M1 | 紫微是天中第一星，命宮遇之福財興旺；若再有輔佐之星會合，富貴雙全、名聲遠播。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_ZIWEI_M2` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_ZIWEI_M2 | 紫微守命本佳；逢煞則古籍斷為壽短、宜空門（壽夭與出家斷語，只保留原文）。 |  | — |
| `GY_ZIWEI_M3` | starInPalace | natal | general、career | verified | 可用 | CIT_GY_ZIWEI_M3 | 紫微在辰戌宮、對宮破軍：富而不貴、有虛名。 | 名義與實質可能落差較大，宜重實質內容 | aptitudeResources（擅長經營資源）×1 |
| `GY_ZIWEI_M4` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_ZIWEI_M4 | 紫微在卯酉與貪狼同宮：古籍斷為「為臣失義」（道德斷語，只保留原文）。 |  | — |
| `GY_ZIWEI_M5` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_ZIWEI_M5 | 紫微、七殺同宮再會煞：古籍斷為孤獨刑傷、宜空門（只保留原文）。 |  | — |
| `GY_ZIWEI_F1` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_ZIWEI_F1 | 女命紫微之訣（以受封贈論女命，屬性別角色斷語，只保留原文）。 |  | — |
| `GY_ZIWEI_F2` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_ZIWEI_F2 | 女命紫微之訣（只保留原文）。 |  | — |
| `GY_ZIWEI_L1` | period | decade | general、wealth、career、promotion | verified | 可用 | CIT_GY_ZIWEI_L1 | 大限命宮有紫微，又有吉星同臨：福祿興旺。 | 這段時間資源與收入較容易增加；這段時間較有機會承擔更多職責、被看見 | resourceIncrease（有實際收穫）×1、responsibilityOpportunity（承擔任務的機會）×1、recognitionOpportunity（表現被看見）×1 |
| `GY_ZIWEI_L2` | period | decade | general、career | verified | 可用 | CIT_GY_ZIWEI_L2 | 紫微入限本是吉祥；只怕三方有七殺、破軍、貪狼會照（原文後半有疑字，只取可確認部分）。 | 這段時間推進較容易卡住 | executionResistance（推進有阻力）×1 |
| `GY_TIANJI_ZIWU` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TIANJI_ZIWU | 天機坐命在子、午宮，丁、己、癸、甲、庚、壬年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TIANJI_MAOYOU` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TIANJI_MAOYOU | 天機坐命在卯、酉宮，乙、辛、戊、癸年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TIANJI_YINSHEN` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TIANJI_YINSHEN | 天機坐命在寅、申宮，丁、己、甲、庚、癸年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TIANJI_SIHAI` | starInPalace | natal | general、career、wealth、decision | verified | 可用 | CIT_GY_TIANJI_SIHAI | 天機坐命在巳、亥宮，丙、壬、戊年生人：古籍評為「合局不耐久」。 | 成果不容易持久，需要定期檢視、及早鞏固 | weakeningTrend（後段吃力）×1 |
| `GY_TIANJI_CHOUWEI_1` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TIANJI_CHOUWEI_1 | 天機坐命在丑、未宮，丙、戊、丁、壬年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TIANJI_CHOUWEI_2` | starInPalace | natal | general | verified | 可用 | CIT_GY_TIANJI_CHOUWEI_2 | 天機坐命在丑、未宮，乙、壬年生人：古籍評為「祿合格」。 | 古籍評為相宜；本 App 只列出，不轉成生活因素 | — |
| `GY_TIANJI_M1` | starInPalace | natal | general、wealth | verified | 可用 | CIT_GY_TIANJI_M1 | 天機坐命，太陰、天梁、太陽在三方四正：常人也富足置產。 | 長期而言在累積與管理資源上較有發揮 | aptitudeResources（擅長經營資源）×2 |
| `GY_TIANJI_M2` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_TIANJI_M2 | （同上格局）再得化科、化權、化祿：職位高升。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_TIANJI_F1` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_TIANJI_F1 | 女命天機之訣（以誥命論女命，只保留原文）。 |  | — |
| `GY_TIANJI_F2` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_TIANJI_F2 | 女命天機太陰之訣（性別道德斷語，只保留原文）。 |  | — |
| `GY_TIANJI_L1` | period | decade | general、career、wealth、social | verified | 可用 | CIT_GY_TIANJI_L1 | 大限命宮有天機，又逢化祿、化權、化科：大有作為、經營多遇貴人、發財發福。 | 這段時間事情較容易推進；這段時間資源與收入較容易增加；這段時間較容易得到他人協助 | progressOpportunity（推進機會）×1、resourceIncrease（有實際收穫）×1、supportAvailable（有人可協助）×1 |
| `GY_TAIYANG_N1` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_TAIYANG_N1 | 庚年生人太陽坐命卯宮，是第一等的廟地；壬年生人次之。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_TAIYANG_N2` | starInPalace | natal | general | verified | 可用 | CIT_GY_TAIYANG_N2 | 太陽坐命亥宮、甲年生人：下局。 | 古籍評為格局較低；本 App 不把等第轉成生活因素 | — |
| `GY_TAIYANG_N3` | starInPalace | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_TAIYANG_N3 | 太陽坐命廟旺：終身富貴。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_TAIYANG_N4` | starInPalace | natal | general、career、wealth、decision | verified | 可用 | CIT_GY_TAIYANG_N4 | 太陽坐命落陷：即使化權化祿也不理想，職位不顯、先勤後懶、成敗不一。 | 起伏較大，有進有退；推進時較容易卡住、需要更多準備 | instability（狀態不穩）×1、executionResistance（推進有阻力）×1 |
| `GY_TAIYANG_N5` | starInPalace | natal | general、wealth、investment、career、decision | verified | 可用 | CIT_GY_TAIYANG_N5 | 太陽落陷又有擎羊、陀羅沖破：橫發橫破、不耐久。 | 資源進出起伏較大；成果不容易持久，需要定期檢視、及早鞏固 | financialVolatility（財務波動）×1、weakeningTrend（後段吃力）×1 |
| `GY_TAIYANG_ZIWU_1` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TAIYANG_ZIWU_1 | 太陽坐命在子、午宮，丁、己年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TAIYANG_ZIWU_2` | starInPalace | natal | general、decision | verified | 可用 | CIT_GY_TAIYANG_ZIWU_2 | 太陽坐命在子、午宮，壬、丙、戊年生人：古籍評為「悔吝」。 | 較容易有反覆、事後需要修正的情況 | instability（狀態不穩）×1 |
| `GY_TAIYANG_MAOYOU_1` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TAIYANG_MAOYOU_1 | 太陽坐命在卯、酉宮，乙、辛年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TAIYANG_MAOYOU_2` | starInPalace | natal | general、career | verified | 可用 | CIT_GY_TAIYANG_MAOYOU_2 | 太陽坐命在卯、酉宮，甲、庚年生人：古籍評為「困」。 | 推進時較容易卡住、需要更多準備 | executionResistance（推進有阻力）×1 |
| `GY_TAIYANG_CHOUWEI_1` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TAIYANG_CHOUWEI_1 | 太陽坐命在丑、未宮（另有附帶條件）：古籍評為「丑宮陷未宮得地太陰同加吉星財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TAIYANG_CHOUWEI_2` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TAIYANG_CHOUWEI_2 | 太陽坐命在辰宮：古籍評為「辰宮旺財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TAIYANG_CHOUWEI_3` | starInPalace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_TAIYANG_CHOUWEI_3 | 太陽坐命在戌宮：古籍評為「戌宮陷反背孤寡」。 |  | — |
| `GY_TAIYANG_M1` | starInPalace | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_TAIYANG_M1 | 太陽坐命，又逢化權、化祿，並有魁鉞、文昌、左右會合：富貴雙全。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_TAIYANG_M2` | starInPalace | natal | general、career | verified | 可用 | CIT_GY_TAIYANG_M2 | 太陽、太陰在丑未坐命，三方沒有化祿權科：福分難以豐厚。 | 推進時較容易卡住、需要更多準備 | executionResistance（推進有阻力）×1 |
| `GY_TAIYANG_M3` | starInPalace | natal | general、career、wealth、investment | verified | 可用 | CIT_GY_TAIYANG_M3 | 太陽失陷又化忌：多阻滯、易有意外耗財；若命宮強又化祿則無妨。 | 推進時較容易卡住、需要更多準備；資源進出起伏較大 | executionResistance（推進有阻力）×1、financialVolatility（財務波動）×1 |
| `GY_TAIYANG_F1` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_TAIYANG_F1 | 女命太陽之訣（只保留原文）。 |  | — |
| `GY_TAIYANG_F2` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_TAIYANG_F2 | 女命太陽之訣（只保留原文）。 |  | — |
| `GY_TAIYANG_F3` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_TAIYANG_F3 | 女命太陽之訣（壽夭、刑剋與偏房斷語，只保留原文）。 |  | — |
| `GY_TAIYANG_L1` | period | decade | general、wealth、career、relationship、marriage、promotion | verified | 可用 | CIT_GY_TAIYANG_L1 | 大限命宮見太陽（不落陷）：添財進業、婚姻和合、仕途高升。 | 這段時間資源與收入較容易增加；這段時間事情較容易推進；這段時間人際與感情互動較溫和；這段時間較有機會承擔更多職責、被看見 | resourceIncrease（有實際收穫）×1、progressOpportunity（推進機會）×1、relationshipWarmth（互動有溫度）×1、responsibilityOpportunity（承擔任務的機會）×1、recognitionOpportunity（表現被看見）×1 |
| `GY_TAIYANG_L2` | period | decade | general、career、wealth | verified | 可用 | CIT_GY_TAIYANG_L2 | 太陽守大限而落陷，又有煞星或化忌：多阻滯、易有意外破財。 | 這段時間推進較容易卡住；這段時間花費或損失的可能較高 | executionResistance（推進有阻力）×1、resourceLossRisk（容易花費或被分走）×1 |
| `GY_WUQU_N1` | starInPalace | natal | general | verified | 可用 | CIT_GY_WUQU_N1 | 武曲坐命，最喜甲、己年生人，福厚。 | 古籍評為有福；本 App 不把它轉成生活因素 | — |
| `GY_WUQU_N2` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_WUQU_N2 | 武曲入廟又與文昌、文曲同行：文武皆可發揮，武職最旺。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_WUQU_N3` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_WUQU_N3 | 武曲會貪狼、遇火星又化吉：上格。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_WUQU_N4` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_WUQU_N4 | 武曲與天府、天相、天梁、太陰、祿存、天馬會合：主貴。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_WUQU_N5` | starInPalace | natal | general、career、jobChange | verified | 可用 | CIT_GY_WUQU_N5 | 武曲落陷：適合以巧藝技術謀生。 | 長期而言適合以專業技能、手藝發揮 | aptitudeStudy（重思考學習）×1 |
| `GY_WUQU_N6` | starInPalace | natal | general、wealth、investment | verified | 可用 | CIT_GY_WUQU_N6 | 武曲落陷又遇廉貞、破軍、擎羊、化忌、地空地劫沖破：起伏大、難守成。 | 資源進出起伏較大 | financialVolatility（財務波動）×1 |
| `GY_WUQU_ZIWU` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_WUQU_ZIWU | 武曲坐命在子、午宮，丁、己年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_WUQU_MAOYOU` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_WUQU_MAOYOU | 武曲坐命在卯、酉宮，乙、辛年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_WUQU_M1` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_WUQU_M1 | 武曲守命化權，又有吉星：志氣高、出眾。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_WUQU_M2` | starInPalace | natal | general、wealth | verified | 可用 | CIT_GY_WUQU_M2 | 武曲守命，要有吉星守照才昌榮。 | 長期而言在累積與管理資源上較有發揮 | aptitudeResources（擅長經營資源）×2 |
| `GY_WUQU_F1` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_WUQU_F1 | 女命武曲之訣（只保留原文）。 |  | — |
| `GY_WUQU_F2` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_WUQU_F2 | 女命武曲之訣（壽夭斷語，只保留原文）。 |  | — |
| `GY_WUQU_L1` | period | decade | general、wealth | verified | 可用 | CIT_GY_WUQU_L1 | 大限逢武曲入廟：財運興旺。 | 這段時間資源與收入較容易增加 | resourceIncrease（有實際收穫）×1 |
| `GY_WUQU_L2` | period | decade | general、wealth、career、promotion | verified | 可用 | CIT_GY_WUQU_L2 | （武曲入限）再有文昌、左右：福祿雙全。 | 這段時間資源與收入較容易增加；這段時間較有機會承擔更多職責、被看見 | resourceIncrease（有實際收穫）×1、responsibilityOpportunity（承擔任務的機會）×1、recognitionOpportunity（表現被看見）×1 |
| `GY_WUQU_L3` | period | decade | general、career | verified | 可用 | CIT_GY_WUQU_L3 | 大限武曲化權：最利求謀，事情容易成。 | 這段時間事情較容易推進 | progressOpportunity（推進機會）×1 |
| `GY_WUQU_L4` | period | decade | general | verified | 未啟用：古文沒有足夠成立條件 | CIT_GY_WUQU_L4 | 武曲入限對不同身分吉凶各異；原文沒有給出盤面條件。 |  | — |
| `GY_TIANTONG_ZIWU` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TIANTONG_ZIWU | 天同坐命在子、午宮，丁、己、癸、辛年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TIANTONG_MAOYOU` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TIANTONG_MAOYOU | 天同坐命在卯、酉宮，乙、丙、辛年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TIANTONG_YINSHEN` | starInPalace | natal | general | verified | 可用 | CIT_GY_TIANTONG_YINSHEN | 天同坐命在寅、申宮，乙、甲、丁年生人：古籍評為「福厚」。 | 古籍評為有福；本 App 不把它轉成生活因素 | — |
| `GY_TIANTONG_SIHAI` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TIANTONG_SIHAI | 天同坐命在巳、亥宮，壬、丙、戊年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TIANTONG_CHENXU_1` | starInPalace | natal | general | verified | 可用 | CIT_GY_TIANTONG_CHENXU_1 | 天同坐命在辰、戌宮，丙、丁年生人：古籍評為「利達」。 | 古籍評為相宜；本 App 只列出，不轉成生活因素 | — |
| `GY_TIANTONG_CHENXU_2` | starInPalace | natal | general、career、wealth、decision | verified | 可用 | CIT_GY_TIANTONG_CHENXU_2 | 天同坐命在辰、戌宮，庚、癸年生人：古籍評為「福不耐久」。 | 成果不容易持久，需要定期檢視、及早鞏固 | weakeningTrend（後段吃力）×1 |
| `GY_TIANTONG_CHOUWEI` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TIANTONG_CHOUWEI | 天同坐命在丑、未宮，乙、壬、甲、丙、辛、庚年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TIANTONG_M1` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_TIANTONG_M1 | 天同坐命廟旺：食祿、名聲遠揚。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_TIANTONG_M2` | starInPalace | natal | general、exam | verified | 可用 | CIT_GY_TIANTONG_M2 | 天同與吉星相逢：聰明、百事通達。 | 長期而言學習與思考較有發揮 | aptitudeStudy（重思考學習）×1 |
| `GY_TIANTONG_M3` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_TIANTONG_M3 | 天同落閑宮逢煞：古籍斷為宜空門（只保留原文）。 |  | — |
| `GY_TIANTONG_F1` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_TIANTONG_F1 | 女命天同之訣（只保留原文）。 |  | — |
| `GY_TIANTONG_F2` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_TIANTONG_F2 | 女命天同太陰之訣（性別道德斷語，只保留原文）。 |  | — |
| `GY_TIANTONG_L1` | period | decade | general、career、wealth | verified | 可用 | CIT_GY_TIANTONG_L1 | 大限逢天同（不落陷）：喜事多、萬事通、財祿增添、宜開創。 | 這段時間事情較容易推進；這段時間資源與收入較容易增加 | progressOpportunity（推進機會）×1、resourceIncrease（有實際收穫）×1 |
| `GY_TIANTONG_L2` | period | decade | general、career、wealth、decision | verified | 可用 | CIT_GY_TIANTONG_L2 | 大限天同落陷又逢煞星沖：做事美中不足，防口舌與破耗。 | 這段時間變動與起伏較多；這段時間花費或損失的可能較高 | instability（狀態不穩）×1、resourceLossRisk（容易花費或被分走）×1 |
| `GY_LIANZHEN_ZIWU` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_LIANZHEN_ZIWU | 廉貞坐命在子、午宮，丁、己、甲年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_LIANZHEN_MAOYOU` | starInPalace | natal | general | verified | 可用 | CIT_GY_LIANZHEN_MAOYOU | 廉貞坐命在卯、酉宮，乙、辛、癸年生人：古籍評為「癸生人破軍同吉」。 | 古籍評為相宜；本 App 只列出，不轉成生活因素 | — |
| `GY_LIANZHEN_YINSHEN_1` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_LIANZHEN_YINSHEN_1 | 廉貞坐命在寅宮，甲、庚、己年生人：古籍評為「為貴格」。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_LIANZHEN_YINSHEN_2` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_LIANZHEN_YINSHEN_2 | 廉貞坐命在申宮，甲、庚、戊年生人：古籍評為「為貴格」。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_LIANZHEN_YINSHEN_3` | starInPalace | natal | general | verified | 可用 | CIT_GY_LIANZHEN_YINSHEN_3 | 廉貞坐命在申宮，丙年生人：古籍評為「次之」。 | 古籍評為相宜；本 App 只列出，不轉成生活因素 | — |
| `GY_LIANZHEN_CHOUWEI` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_LIANZHEN_CHOUWEI | 廉貞坐命在丑、未宮（另有附帶條件）：古籍評為「丑未宮利益七殺同加吉星財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_LIANZHEN_CHENXU` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_LIANZHEN_CHENXU | 廉貞坐命在辰、戌宮，甲、庚年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_LIANZHEN_SIHAI` | starInPalace | natal | general、career、wealth、decision | verified | 可用 | CIT_GY_LIANZHEN_SIHAI | 廉貞坐命在巳、亥宮，甲、己、丙、戊年生人：古籍評為「福不耐久」。 | 成果不容易持久，需要定期檢視、及早鞏固 | weakeningTrend（後段吃力）×1 |
| `GY_LIANZHEN_M1` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_LIANZHEN_M1 | 廉貞守命（無煞）：志氣剛強、能革新，官貴。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_LIANZHEN_M2` | starInPalace | natal | general、career | verified | 可用 | CIT_GY_LIANZHEN_M2 | 廉貞坐閑宮，又逢貪狼、破軍、擎羊、火星：縱有財官也不美、難從容。 | 推進時較容易卡住、需要更多準備 | executionResistance（推進有阻力）×1 |
| `GY_LIANZHEN_M3` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_LIANZHEN_M3 | 廉貞落陷逢煞：古籍斷為災殘、命終（疾病與死亡斷語，只保留原文）。 |  | — |
| `GY_LIANZHEN_F1` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_LIANZHEN_F1 | 女命廉貞之訣（只保留原文）。 |  | — |
| `GY_LIANZHEN_F2` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_LIANZHEN_F2 | 女命廉貞之訣（貧賤、刑剋與性別道德斷語，只保留原文）。 |  | — |
| `GY_LIANZHEN_L1` | period | decade | general、wealth、career、promotion | verified | 可用 | CIT_GY_LIANZHEN_L1 | 大限廉貞在旺宮又逢吉星：財物蓄積、職位上升。 | 這段時間資源與收入較容易增加；這段時間較有機會承擔更多職責、被看見 | resourceIncrease（有實際收穫）×1、responsibilityOpportunity（承擔任務的機會）×1、recognitionOpportunity（表現被看見）×1 |
| `GY_LIANZHEN_L2` | star | natal | general | pendingVerification | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_LIANZHEN_L2 | 大限廉貞逢天刑、化忌：古籍斷為血光、死亡（只保留原文）。 |  | — |
| `GY_TIANFU_N1` | starInPalace | natal | general、career、promotion、exam | pendingVerification | 未啟用：原文有疑字（兩輪核讀與決議仍無法確定） | CIT_GY_TIANFU_N1 | 天府廟旺，喜紫微、昌曲、左右、祿存、魁鉞、化權祿：必中高第。 | 長期而言較有機會承擔職位、被看見；長期而言學習與思考較有發揮 | aptitudeResponsibility（適合承擔責任）×2、aptitudeStudy（重思考學習）×1 |
| `GY_TIANFU_N2` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_TIANFU_N2 | 天府坐命寅午戌、亥卯未宮，己年生人：權貴。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_TIANFU_N3` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TIANFU_N3 | 天府坐命巳酉丑宮，乙丙戊辛年生人：文武財官格。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TIANFU_N4` | starInPalace | natal | general、career、wealth、decision | verified | 可用 | CIT_GY_TIANFU_N4 | 天府在亥卯未辰酉安命，甲庚年生人：先大後小、有始無終。 | 成果不容易持久，需要定期檢視、及早鞏固 | weakeningTrend（後段吃力）×1 |
| `GY_TIANFU_ZIWU` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TIANFU_ZIWU | 天府坐命在子、午宮，丁、己、癸年生人：古籍評為「為福財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TIANFU_MAOYOU` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TIANFU_MAOYOU | 天府坐命在卯、酉宮，乙、丙、辛年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TIANFU_YINSHEN` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TIANFU_YINSHEN | 天府坐命在寅、申宮，丁、己年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TIANFU_CHENXU` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TIANFU_CHENXU | 天府坐命在辰、戌宮，甲、庚、壬年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TIANFU_CHOUWEI` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TIANFU_CHOUWEI | 天府坐命在丑、未宮（另有附帶條件）：古籍評為「丑未入廟加吉星財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TIANFU_SIHAI` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TIANFU_SIHAI | 天府坐命在巳、亥宮，乙、丙、戊、辛年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TIANFU_M1` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_TIANFU_M1 | 天府守命逢權祿，又有魁鉞、文昌、左右會合：得貴人提攜而上。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_TIANFU_M2` | starInPalace | natal | general、health | verified | 可用 | CIT_GY_TIANFU_M2 | 天府三方會火鈴羊陀：多勞碌（原文另有「奸詐」的品格斷語，不採用）。 | 較容易操心、身心負荷偏重 | stressLoad（身心壓力）×1 |
| `GY_TIANFU_F1` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_TIANFU_F1 | 女命天府之訣（只保留原文）。 |  | — |
| `GY_TIANFU_F2` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_TIANFU_F2 | 女命天府之訣（只保留原文）。 |  | — |
| `GY_TIANFU_L1` | period | decade | general、wealth | verified | 可用 | CIT_GY_TIANFU_L1 | 大限逢天府：多發福、添財進喜。 | 這段時間資源與收入較容易增加；這段時間整體較安穩 | resourceIncrease（有實際收穫）×1、resourceStability（財務處理較穩）×1 |
| `GY_TIANFU_L2` | period | decade | general、career、promotion | verified | 可用 | CIT_GY_TIANFU_L2 | （天府入限）若再逢化科、化權、化祿：能施展才能。 | 這段時間事情較容易推進；這段時間較有機會承擔更多職責、被看見 | progressOpportunity（推進機會）×1、responsibilityOpportunity（承擔任務的機會）×1、recognitionOpportunity（表現被看見）×1 |
| `GY_TAIYIN_N1` | starInPalace | natal | general、career | verified | 可用 | CIT_GY_TAIYIN_N1 | 太陰落陷，即使化科權祿反而不吉。 | 推進時較容易卡住、需要更多準備 | executionResistance（推進有阻力）×1 |
| `GY_TAIYIN_N2` | starInPalace | natal | general | verified | 可用 | CIT_GY_TAIYIN_N2 | 太陰在亥卯未宮坐命，壬、戊年生人：合局。 | 古籍評為相宜；本 App 只列出，不轉成生活因素 | — |
| `GY_TAIYIN_N3` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TAIYIN_N3 | 太陰在亥宮坐命，乙庚戊年生人：上格；丁年生人次之。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TAIYIN_ZICHOUYIN` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TAIYIN_ZICHOUYIN | 太陰坐命在子、丑、寅宮，丁、戊年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TAIYIN_MAOCHENSI` | starInPalace | natal | general、career、wealth、decision | verified | 可用 | CIT_GY_TAIYIN_MAOCHENSI | 太陰坐命在卯、辰、巳宮，乙、壬、戊年生人：古籍評為「孤寡不耐久」。 | 成果不容易持久，需要定期檢視、及早鞏固 | weakeningTrend（後段吃力）×1 |
| `GY_TAIYIN_WUWEISHEN` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TAIYIN_WUWEISHEN | 太陰坐命在未、申宮，丁、庚、甲年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TAIYIN_YOUXUHAI_1` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TAIYIN_YOUXUHAI_1 | 太陰坐命在酉、戌、亥宮，丙、丁年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TAIYIN_YOUXUHAI_2` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_TAIYIN_YOUXUHAI_2 | 太陰坐命在酉、戌、亥宮（另有附帶條件）：古籍評為「吉星眾大貴」。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_TAIYIN_M1` | starInPalace | natal | general、career、promotion、exam | verified | 可用 | CIT_GY_TAIYIN_M1 | 太陰入廟化權：聰明、為官清顯。 | 長期而言較有機會承擔職位、被看見；長期而言學習與思考較有發揮 | aptitudeResponsibility（適合承擔責任）×2、aptitudeStudy（重思考學習）×1 |
| `GY_TAIYIN_M2` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_TAIYIN_M2 | 寅宮機昌曲月之訣（貧賤與性別斷語，只保留原文）。 |  | — |
| `GY_TAIYIN_M3` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_TAIYIN_M3 | 日月陷地逢煞之訣（貧窮、出家斷語，只保留原文）。 |  | — |
| `GY_TAIYIN_F1` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_TAIYIN_F1 | 女命太陰之訣（只保留原文）。 |  | — |
| `GY_TAIYIN_F2` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_TAIYIN_F2 | 女命太陰之訣（刑剋、壽夭斷語，只保留原文）。 |  | — |
| `GY_TAIYIN_L1` | period | decade | general、wealth、career、relationship、marriage | verified | 可用 | CIT_GY_TAIYIN_L1 | 大限逢太陰（不落陷）：財祿豐盈、百事通達、婚嫁喜事。 | 這段時間資源與收入較容易增加；這段時間事情較容易推進；這段時間人際與感情互動較溫和 | resourceIncrease（有實際收穫）×1、progressOpportunity（推進機會）×1、relationshipWarmth（互動有溫度）×1 |
| `GY_TAIYIN_L2` | period | decade | general、career、social、lawsuit | verified | 可用 | CIT_GY_TAIYIN_L2 | （太陰入限）若火星、鈴星來會：難免口舌是非與身體負荷。 | 這段時間溝通較容易起摩擦；這段時間身心負荷偏重，宜留意作息與休息（不作健康預測） | communicationConflictRisk（容易起口角）×1 |
| `GY_TAIYIN_L2_H` | period | decade | health | verified | 可用 | CIT_GY_TAIYIN_L2 | （太陰入限）若火星、鈴星來會：難免口舌是非與身體負荷。 | 這段時間身心負荷偏重，宜留意作息與休息（不作健康預測） | fatigueRisk（容易疲累）×1、recoveryNeed（需要休養）×1 |
| `GY_TAIYIN_L3` | period | decade | general、career、social、lawsuit、wealth | verified | 可用 | CIT_GY_TAIYIN_L3 | 大限太陰落陷又逢羊陀火鈴：不是官非就是破耗。 | 這段時間溝通較容易起摩擦；這段時間花費或損失的可能較高 | communicationConflictRisk（容易起口角）×1、resourceLossRisk（容易花費或被分走）×1 |
| `GY_TANLANG_N1` | starInPalace | natal | general、career、jobChange | verified | 可用 | CIT_GY_TANLANG_N1 | 貪狼入廟：多在武藝、技能中發揮。 | 長期而言適合以專業技能、手藝發揮 | aptitudeStudy（重思考學習）×1 |
| `GY_TANLANG_N2` | starInPalace | natal | general | verified | 可用 | CIT_GY_TANLANG_N2 | 貪狼遇火星、鈴星，戊己年生人：合局。 | 古籍評為相宜；本 App 只列出，不轉成生活因素 | — |
| `GY_TANLANG_N3` | starInPalace | natal | general、career、wealth、decision | verified | 可用 | CIT_GY_TANLANG_N3 | 貪狼坐命，癸年生人：不耐久。 | 成果不容易持久，需要定期檢視、及早鞏固 | weakeningTrend（後段吃力）×1 |
| `GY_TANLANG_ZIWU_1` | starInPalace | natal | general | verified | 可用 | CIT_GY_TANLANG_ZIWU_1 | 貪狼坐命在子、午宮，丁、己年生人：古籍評為「福厚」。 | 古籍評為有福；本 App 不把它轉成生活因素 | — |
| `GY_TANLANG_ZIWU_2` | starInPalace | natal | general | verified | 未啟用：古文沒有足夠成立條件 | CIT_GY_TANLANG_ZIWU_2 | 貪狼坐命在子、午宮：古籍評為「下局」。 |  | — |
| `GY_TANLANG_MAOYOU_1` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_TANLANG_MAOYOU_1 | 貪狼坐命在卯、酉宮（另有附帶條件）：古籍評為「卯酉宮利益紫微同見火星貴」。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_TANLANG_MAOYOU_2` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TANLANG_MAOYOU_2 | 貪狼坐命在卯、酉宮，乙、辛、己年生人：古籍評為「宜之財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TANLANG_YINSHEN` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TANLANG_YINSHEN | 貪狼坐命在寅、申宮，庚年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TANLANG_CHOUWEI` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_TANLANG_CHOUWEI | 貪狼坐命在丑、未宮，戊、己、庚年生人（另有附帶條件）：古籍評為「貴格」。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_TANLANG_CHENXU` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TANLANG_CHENXU | 貪狼坐命在辰、戌宮，戊、己年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TANLANG_SIHAI` | starInPalace | natal | general、career、wealth、decision | verified | 可用 | CIT_GY_TANLANG_SIHAI | 貪狼坐命在巳、亥宮，丙、戊、壬年生人：古籍評為「為福不耐久」。 | 成果不容易持久，需要定期檢視、及早鞏固 | weakeningTrend（後段吃力）×1 |
| `GY_TANLANG_M1` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_TANLANG_M1 | 貪狼在辰戌丑未坐命福氣濃；再有火星拱會，更為貴顯。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_TANLANG_M2` | starInPalace | natal | general、career | verified | 可用 | CIT_GY_TANLANG_M2 | 貪狼與擎羊同宮，又逢陀羅等煞星交加：多困頓。 | 推進時較容易卡住、需要更多準備 | executionResistance（推進有阻力）×1 |
| `GY_TANLANG_M3` | starInPalace | natal | general、career、jobChange | verified | 可用 | CIT_GY_TANLANG_M3 | 貪狼與武曲、破軍、廉貞及煞星同見：宜以多種技藝謀生。 | 長期而言適合以專業技能、手藝發揮 | aptitudeStudy（重思考學習）×1 |
| `GY_TANLANG_M4` | starInPalace | natal | general、wealth | verified | 可用 | CIT_GY_TANLANG_M4 | 貪狼在辰戌丑未廟旺，又有左輔右弼：富。 | 長期而言在累積與管理資源上較有發揮 | aptitudeResources（擅長經營資源）×2 |
| `GY_TANLANG_M5` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_TANLANG_M5 | （上格）再化科、權、祿：文武才能顯著。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_TANLANG_F1` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_TANLANG_F1 | 女命貪狼之訣（以旺夫論女命，只保留原文）。 |  | — |
| `GY_TANLANG_F2` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_TANLANG_F2 | 女命貪狼之訣（刑剋斷語，只保留原文）。 |  | — |
| `GY_TANLANG_L1` | period | decade | general、career | verified | 可用 | CIT_GY_TANLANG_L1 | 大限貪狼入廟：事情和諧。 | 這段時間事情較容易推進 | progressOpportunity（推進機會）×1 |
| `GY_TANLANG_L2` | period | decade | general、career、promotion、wealth | verified | 可用 | CIT_GY_TANLANG_L2 | （貪狼入限入廟）再逢化科、化權：仕途多成就、財運突出。 | 這段時間較有機會承擔更多職責、被看見；這段時間資源與收入較容易增加 | responsibilityOpportunity（承擔任務的機會）×1、recognitionOpportunity（表現被看見）×1、resourceIncrease（有實際收穫）×1 |
| `GY_TANLANG_L3` | period | decade | general、wealth | verified | 可用 | CIT_GY_TANLANG_L3 | 大限貪狼在辰戌丑未，又是辰戌丑未年生人，再見火星：多橫發。 | 這段時間資源與收入較容易增加 | resourceIncrease（有實際收穫）×1 |
| `GY_TANLANG_L4` | period | decade | general、wealth | verified | 可用 | CIT_GY_TANLANG_L4 | 大限貪狼落陷：宜節制、防耗財；三方有吉星可免災。 | 這段時間花費或損失的可能較高 | resourceLossRisk（容易花費或被分走）×1 |
| `GY_TANLANG_L5` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_TANLANG_L5 | 女命貪狼入限之訣（死亡斷語，只保留原文）。 |  | — |
| `GY_JUMEN_N1` | starInPalace | natal | general、social、decision | verified | 可用 | CIT_GY_JUMEN_N1 | 巨門不入廟：做事容易猶豫進退、學得多精得少、與人不易相合、是非多。 | 做事較容易猶豫、人際上較容易有口舌 | communicationConflictRisk（容易起口角）×1、decisionUncertainty（判斷反覆）×1 |
| `GY_JUMEN_N2` | starInPalace | natal | general | verified | 可用 | CIT_GY_JUMEN_N2 | 巨門坐命子、卯宮，癸辛年生人：合局。 | 古籍評為相宜；本 App 只列出，不轉成生活因素 | — |
| `GY_JUMEN_N3` | starInPalace | natal | general | verified | 可用 | CIT_GY_JUMEN_N3 | 巨門在辰戌安命，庚丁年生人：不富貴。 | 古籍評為格局較低；本 App 不把等第轉成生活因素 | — |
| `GY_JUMEN_ZIWU_1` | starInPalace | natal | general | verified | 可用 | CIT_GY_JUMEN_ZIWU_1 | 巨門坐命在子、午宮，丁、己、癸、辛年生人：古籍評為「福厚」。 | 古籍評為有福；本 App 不把它轉成生活因素 | — |
| `GY_JUMEN_ZIWU_2` | starInPalace | natal | general、career | verified | 可用 | CIT_GY_JUMEN_ZIWU_2 | 巨門坐命在子、午宮，丙、戊年生人：古籍評為「主困」。 | 推進時較容易卡住、需要更多準備 | executionResistance（推進有阻力）×1 |
| `GY_JUMEN_MAOYOU_1` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_JUMEN_MAOYOU_1 | 巨門坐命在卯、酉宮，乙、辛年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_JUMEN_MAOYOU_2` | starInPalace | natal | general、career、wealth、decision | verified | 可用 | CIT_GY_JUMEN_MAOYOU_2 | 巨門坐命在卯、酉宮，丁、戊年生人：古籍評為「有成敗」。 | 起伏較大，有進有退 | instability（狀態不穩）×1 |
| `GY_JUMEN_YINSHEN` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_JUMEN_YINSHEN | 巨門坐命在寅、申宮，甲、庚、癸、辛年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_JUMEN_CHENXU_1` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_JUMEN_CHENXU_1 | 巨門坐命在辰、戌宮，癸、辛年生人：古籍評為「貴」。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_JUMEN_CHENXU_2` | starInPalace | natal | general、career | verified | 可用 | CIT_GY_JUMEN_CHENXU_2 | 巨門坐命在辰、戌宮，丁年生人：古籍評為「困」。 | 推進時較容易卡住、需要更多準備 | executionResistance（推進有阻力）×1 |
| `GY_JUMEN_CHOUWEI` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_JUMEN_CHOUWEI | 巨門坐命在丑、未宮，癸、辛、丙年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_JUMEN_SIHAI` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_JUMEN_SIHAI | 巨門坐命在巳、亥宮，癸、辛年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_JUMEN_M1` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_JUMEN_M1 | 巨門在子午坐命，三合有化科權祿：官高位顯。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_JUMEN_M2` | starInPalace | natal | general、career | verified | 可用 | CIT_GY_JUMEN_M2 | 巨門化氣為暗，再會凶星更凶；入廟則可和平（原文另有唇齒受傷之說，不採用）。 | 推進時較容易卡住、需要更多準備 | executionResistance（推進有阻力）×1 |
| `GY_JUMEN_M3` | starInPalace | natal | general、decision | verified | 可用 | CIT_GY_JUMEN_M3 | 巨門守命遇擎羊、鈴星、火星：性急、做事易反覆。 | 做事容易急躁、反覆 | impulsivityRisk（容易衝動）×1 |
| `GY_JUMEN_F1` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_JUMEN_F1 | 女命巨門之訣（只保留原文）。 |  | — |
| `GY_JUMEN_F2` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_JUMEN_F2 | 女命巨門之訣（性別道德、壽夭斷語，只保留原文）。 |  | — |
| `GY_JUMEN_L1` | period | decade | general、career | verified | 可用 | CIT_GY_JUMEN_L1 | 大限巨門化權：利於求謀大事；即使有口舌也能轉為安寧。 | 這段時間事情較容易推進 | progressOpportunity（推進機會）×1 |
| `GY_JUMEN_L2` | period | decade | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_JUMEN_L2 | 大限巨門遇喪門：多煩憂（喪門屬歲前諸星，本 App 客觀排盤沒有此星）。 |  | — |
| `GY_JUMEN_L3` | period | decade | general、career、social、lawsuit、wealth | verified | 可用 | CIT_GY_JUMEN_L3 | 大限巨門落陷：容易無端惹上是非（原文另有哭泣喪事之說，不採用）。 | 這段時間溝通較容易起摩擦；這段時間花費或損失的可能較高 | communicationConflictRisk（容易起口角）×1、resourceLossRisk（容易花費或被分走）×1 |
| `GY_TIANXIANG_N1` | starInPalace | natal | general、career、wealth、promotion | verified | 可用 | CIT_GY_TIANXIANG_N1 | 天相與紫微、天府、文昌、文曲、太陽、太陰相會：財官雙美。 | 長期而言在經營資源與承擔職務上較有發揮空間；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×3 |
| `GY_TIANXIANG_N2` | starInPalace | natal | general、career、jobChange | verified | 可用 | CIT_GY_TIANXIANG_N2 | 天相與武曲、破軍、擎羊、陀羅同行：適合巧藝技術。 | 長期而言適合以專業技能、手藝發揮 | aptitudeStudy（重思考學習）×1 |
| `GY_TIANXIANG_N3` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_TIANXIANG_N3 | 天相再加火鈴巨機：古籍斷為傷刑、不善終（只保留原文）。 |  | — |
| `GY_TIANXIANG_ZIWU` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TIANXIANG_ZIWU | 天相坐命在子、午宮，丁、己、癸、甲年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TIANXIANG_MAOYOU_1` | starInPalace | natal | general | verified | 可用 | CIT_GY_TIANXIANG_MAOYOU_1 | 天相坐命在卯、酉宮，乙、辛年生人：古籍評為「吉」。 | 古籍評為相宜；本 App 只列出，不轉成生活因素 | — |
| `GY_TIANXIANG_MAOYOU_2` | starInPalace | natal | general、career | verified | 可用 | CIT_GY_TIANXIANG_MAOYOU_2 | 天相坐命在卯、酉宮，甲、庚年生人：古籍評為「主困」。 | 推進時較容易卡住、需要更多準備 | executionResistance（推進有阻力）×1 |
| `GY_TIANXIANG_CHENXU` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TIANXIANG_CHENXU | 天相坐命在辰、戌宮：古籍評為「辰戌宮得地紫微同財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TIANXIANG_CHOUWEI` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TIANXIANG_CHOUWEI | 天相坐命在丑、未宮（另有附帶條件）：古籍評為「丑宮入廟未宮得地加吉星財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TIANXIANG_YINSHEN` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TIANXIANG_YINSHEN | 天相坐命在寅、申宮，丁、甲、庚年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TIANXIANG_SIHAI` | starInPalace | natal | general | verified | 可用 | CIT_GY_TIANXIANG_SIHAI | 天相坐命在巳、亥宮，丙、戊、壬年生人：古籍評為「為福」。 | 古籍評為有福；本 App 不把它轉成生活因素 | — |
| `GY_TIANXIANG_M1` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_TIANXIANG_M1 | 天相守命（無煞）：為官能居要職。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_TIANXIANG_M2` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TIANXIANG_M2 | 天相逢祿（化祿或祿存）：家資旺、有權勢。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TIANXIANG_M3` | starInPalace | natal | general、career、jobChange | verified | 可用 | CIT_GY_TIANXIANG_M3 | 天相與破軍、武曲同見，又逢羊陀火鈴：宜作技術或經商。 | 長期而言適合以專業技能、手藝發揮 | aptitudeStudy（重思考學習）×1 |
| `GY_TIANXIANG_F1` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_TIANXIANG_F1 | 女命天相之訣（只保留原文）。 |  | — |
| `GY_TIANXIANG_F2` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_TIANXIANG_F2 | 女命天相之訣（刑剋與性別斷語，只保留原文）。 |  | — |
| `GY_TIANXIANG_L1` | period | decade | general、career、wealth | verified | 可用 | CIT_GY_TIANXIANG_L1 | 大限逢天相：無災、所謀皆遂意。 | 這段時間事情較容易推進；這段時間整體較安穩 | progressOpportunity（推進機會）×1、resourceStability（財務處理較穩）×1 |
| `GY_TIANXIANG_L2` | period | decade | general、career、social、lawsuit | verified | 可用 | CIT_GY_TIANXIANG_L2 | 大限天相，三方有羊陀空劫：口舌官非。 | 這段時間溝通較容易起摩擦 | communicationConflictRisk（容易起口角）×1 |
| `GY_TIANXIANG_L3` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_TIANXIANG_L3 | 大限天相遇擎羊諸煞：古籍斷為死亡（只保留原文）。 |  | — |
| `GY_TIANLIANG_N1` | starInPalace | natal | general、exam、career | verified | 可用 | CIT_GY_TIANLIANG_N1 | 天梁與天機同行：善於謀略、議論。 | 長期而言學習與思考較有發揮；長期而言表達與文字較有發揮 | aptitudeStudy（重思考學習）×1、aptitudeExpression（擅長表達）×1 |
| `GY_TIANLIANG_N2` | starInPalace | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_TIANLIANG_N2 | 天梁與左右、昌曲會合且入廟：富貴。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_TIANLIANG_N3` | star | natal | general | pendingVerification | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_TIANLIANG_N3 | 天梁陷地遇火羊：古籍斷為下賤孤寒夭折（只保留原文）。 |  | — |
| `GY_TIANLIANG_N4` | starInPalace | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_TIANLIANG_N4 | 天梁在亥卯未坐命，壬年生人：富貴雙全。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_TIANLIANG_ZIWU` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TIANLIANG_ZIWU | 天梁坐命在子、午宮，丁、己、癸年生人：古籍評為「福厚財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TIANLIANG_MAOYOU` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TIANLIANG_MAOYOU | 天梁坐命在卯、酉宮，乙、壬、辛年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TIANLIANG_YINSHEN` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TIANLIANG_YINSHEN | 天梁坐命在寅、申宮，丁、己、甲、庚年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TIANLIANG_CHENXU` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TIANLIANG_CHENXU | 天梁坐命在辰、戌宮，丁、己、壬、庚年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TIANLIANG_CHOUWEI_1` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_TIANLIANG_CHOUWEI_1 | 天梁坐命在丑、未宮，壬、乙年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_TIANLIANG_CHOUWEI_2` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_TIANLIANG_CHOUWEI_2 | 天梁坐命在丑、未宮，戊年生人：古籍評為「大貴」。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_TIANLIANG_M1` | starInPalace | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_TIANLIANG_M1 | 天梁坐命穩重溫良，左右、昌曲會合：富貴。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_TIANLIANG_M2` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_TIANLIANG_M2 | 天梁在子午寅申入廟，與天機、太陽、文昌、左右同會：官資清顯。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_TIANLIANG_M3` | starInPalace | natal | general、career | verified | 可用 | CIT_GY_TIANLIANG_M3 | 天梁落閑宮遇火星、陀羅等煞：更凶（原文另有孤刑帶疾之說，不採用）。 | 推進時較容易卡住、需要更多準備 | executionResistance（推進有阻力）×1 |
| `GY_TIANLIANG_M4` | starInPalace | natal | general | verified | 可用 | CIT_GY_TIANLIANG_M4 | 天梁、天機在辰戌同宮：助益不小。 | 古籍評為相宜；本 App 只列出，不轉成生活因素 | — |
| `GY_TIANLIANG_M5` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_TIANLIANG_M5 | 破軍卯酉之訣（刑剋斷語，只保留原文）。 |  | — |
| `GY_TIANLIANG_L1` | period | decade | general、career、promotion | verified | 可用 | CIT_GY_TIANLIANG_L1 | 大限天梁與吉星相和：福多；再入廟：貴顯。 | 這段時間事情較容易推進；這段時間較有機會承擔更多職責、被看見 | progressOpportunity（推進機會）×1、responsibilityOpportunity（承擔任務的機會）×1、recognitionOpportunity（表現被看見）×1 |
| `GY_TIANLIANG_L2` | period | decade | general、career、promotion、wealth | verified | 可用 | CIT_GY_TIANLIANG_L2 | 大限逢天梁：加官進職、迎來新的收入。 | 這段時間較有機會承擔更多職責、被看見；這段時間資源與收入較容易增加 | responsibilityOpportunity（承擔任務的機會）×1、recognitionOpportunity（表現被看見）×1、resourceIncrease（有實際收穫）×1 |
| `GY_TIANLIANG_L3` | period | decade | general、career、wealth、decision | verified | 可用 | CIT_GY_TIANLIANG_L3 | （天梁入限）若遇火鈴羊陀會合：需防一難（原文另有「家亡」之說，不採用）。 | 這段時間變動與起伏較多 | instability（狀態不穩）×1 |
| `GY_QISHA_ZIWU` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_QISHA_ZIWU | 七殺坐命在子、午宮，丁、己、甲年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_QISHA_MAOYOU` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_QISHA_MAOYOU | 七殺坐命在卯、酉宮，乙、辛年生人：古籍評為「福厚財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_QISHA_YINSHEN` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_QISHA_YINSHEN | 七殺坐命在寅、申宮，甲、庚、丁、己年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_QISHA_SIHAI` | starInPalace | natal | general | verified | 可用 | CIT_GY_QISHA_SIHAI | 七殺坐命在巳、亥宮，丙、戊、壬年生人：古籍評為「福厚」。 | 古籍評為有福；本 App 不把它轉成生活因素 | — |
| `GY_QISHA_CHENXU` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_QISHA_CHENXU | 七殺坐命在辰、戌宮（另有附帶條件）：古籍評為「辰戌宮入廟加吉星財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_QISHA_CHOUWEI` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_QISHA_CHOUWEI | 七殺坐命在丑、未宮（另有附帶條件）：古籍評為「丑未入廟廉貞同加吉星財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_QISHA_M1` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_QISHA_M1 | 七殺在寅申子午坐命：英雄有威。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_QISHA_M2` | starInPalace | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_QISHA_M2 | （七殺寅申子午）再有魁鉞、左右、文昌會合並逢科祿：名高祿厚。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_QISHA_M3` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_QISHA_M3 | 七殺陷地之訣（死亡斷語，只保留原文）。 |  | — |
| `GY_QISHA_M4` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_QISHA_M4 | 七殺閑宮之訣（傷殘斷語，只保留原文）。 |  | — |
| `GY_QISHA_F1` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_QISHA_F1 | 女命七殺之訣（刑剋斷語，只保留原文）。 |  | — |
| `GY_QISHA_F2` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_QISHA_F2 | 女命七殺之訣（性別道德斷語，只保留原文）。 |  | — |
| `GY_QISHA_L1` | period | decade | general、career、promotion、wealth | verified | 可用 | CIT_GY_QISHA_L1 | 大限逢七殺、對宮天府來朝（無煞）：從容和緩、家道發達、名聲顯達。 | 這段時間較有機會承擔更多職責、被看見；這段時間資源與收入較容易增加 | responsibilityOpportunity（承擔任務的機會）×1、recognitionOpportunity（表現被看見）×1、resourceIncrease（有實際收穫）×1 |
| `GY_QISHA_L2` | period | decade | general、career、social、lawsuit | verified | 可用 | CIT_GY_QISHA_L2 | 大限七殺又有惡曜：做事艱難、易有口舌與身心負荷。 | 這段時間推進較容易卡住；這段時間溝通較容易起摩擦；這段時間身心負荷偏重，宜留意作息與休息（不作健康預測） | executionResistance（推進有阻力）×1、communicationConflictRisk（容易起口角）×1 |
| `GY_QISHA_L2_H` | period | decade | health | verified | 可用 | CIT_GY_QISHA_L2 | 大限七殺又有惡曜：做事艱難、易有口舌與身心負荷。 | 這段時間身心負荷偏重，宜留意作息與休息（不作健康預測） | fatigueRisk（容易疲累）×1、recoveryNeed（需要休養）×1 |
| `GY_POJUN_N1` | starInPalace | natal | general、social、cooperation | verified | 可用 | CIT_GY_POJUN_N1 | 破軍坐命：性剛、不易與人相合、好爭強。 | 個性剛直、好強，與人合作時較容易有摩擦 | cooperationFriction（合作有摩擦）×1 |
| `GY_POJUN_N2` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_POJUN_N2 | 破軍喜與紫微同宮：有威權。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_POJUN_N3` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_POJUN_N3 | 破軍在子午坐命，癸甲年生人：位高。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_POJUN_N4` | starInPalace | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_POJUN_N4 | 破軍在辰戌丑未坐命與紫微同宮，丙戊年生人：富貴不小。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_POJUN_ZIWU_1` | starInPalace | natal | general | verified | 可用 | CIT_GY_POJUN_ZIWU_1 | 破軍坐命在子、午宮，丁、己、癸年生人：古籍評為「福厚」。 | 古籍評為有福；本 App 不把它轉成生活因素 | — |
| `GY_POJUN_ZIWU_2` | starInPalace | natal | general、career | verified | 可用 | CIT_GY_POJUN_ZIWU_2 | 破軍坐命在子、午宮，丙、戊年生人：古籍評為「主困」。 | 推進時較容易卡住、需要更多準備 | executionResistance（推進有阻力）×1 |
| `GY_POJUN_MAOYOU_1` | starInPalace | natal | general | verified | 可用 | CIT_GY_POJUN_MAOYOU_1 | 破軍坐命在卯、酉宮，乙、辛、癸年生人：古籍評為「利」。 | 古籍評為相宜；本 App 只列出，不轉成生活因素 | — |
| `GY_POJUN_MAOYOU_2` | starInPalace | natal | general、career、wealth、decision | verified | 可用 | CIT_GY_POJUN_MAOYOU_2 | 破軍坐命在卯、酉宮，甲、庚、丙年生人：古籍評為「不耐久」。 | 成果不容易持久，需要定期檢視、及早鞏固 | weakeningTrend（後段吃力）×1 |
| `GY_POJUN_CHENXU` | starInPalace | natal | general | verified | 可用 | CIT_GY_POJUN_CHENXU | 破軍坐命在辰、戌宮，甲、癸、庚年生人：古籍評為「為福」。 | 古籍評為有福；本 App 不把它轉成生活因素 | — |
| `GY_POJUN_YINSHEN` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_POJUN_YINSHEN | 破軍坐命在寅、申宮，甲、庚、丁、己年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_POJUN_CHOUWEI` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_POJUN_CHOUWEI | 破軍坐命在丑、未宮，丙、戊、乙年生人：古籍評為「財官格」。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_POJUN_SIHAI` | starInPalace | natal | general | verified | 可用 | CIT_GY_POJUN_SIHAI | 破軍坐命在巳、亥宮，丙、戊年生人：古籍評為「福厚」。 | 古籍評為有福；本 App 不把它轉成生活因素 | — |
| `GY_POJUN_M1` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_POJUN_M1 | 破軍入廟（與七殺、貪狼三合）：英雄不可當。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_POJUN_M2` | starInPalace | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_POJUN_M2 | 破軍在子午，會文昌、左右：財帛豐盈、官祿昭著。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_POJUN_M3` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_POJUN_M3 | 破軍化祿、科、權：大喜。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_POJUN_M4` | starInPalace | natal | general、career、wealth、decision | verified | 可用 | CIT_GY_POJUN_M4 | 破軍落陷又加煞：離開原生環境、到外地發展。 | 起伏較大，有進有退 | instability（狀態不穩）×1 |
| `GY_POJUN_M5` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_POJUN_M5 | 破軍身宮之訣（傷殘壽夭斷語，只保留原文）。 |  | — |
| `GY_POJUN_F1` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_POJUN_F1 | 女命破軍之訣（只保留原文）。 |  | — |
| `GY_POJUN_F2` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_POJUN_F2 | 女命破軍之訣（刑剋斷語，只保留原文）。 |  | — |
| `GY_POJUN_L1` | period | decade | general、career、promotion | verified | 可用 | CIT_GY_POJUN_L1 | 大限破軍入廟：福祿昌；再遇文昌、魁鉞：極風光。 | 這段時間事情較容易推進；這段時間較有機會承擔更多職責、被看見 | progressOpportunity（推進機會）×1、responsibilityOpportunity（承擔任務的機會）×1、recognitionOpportunity（表現被看見）×1 |
| `GY_POJUN_L2` | period | decade | general、wealth | verified | 可用 | CIT_GY_POJUN_L2 | 大限破軍又有煞星：防破耗（原文另有妻子自身亡之說，不採用）。 | 這段時間花費或損失的可能較高 | resourceLossRisk（容易花費或被分走）×1 |
| `GY_POJUN_L3` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_POJUN_L3 | 破軍主限之訣（血光、產難斷語，只保留原文）。 |  | — |
| `GY_WENCHANG_N1` | starInPalace | natal | general、exam | verified | 可用 | CIT_GY_WENCHANG_N1 | 文昌坐命：機巧、多學多能。 | 長期而言學習與思考較有發揮 | aptitudeStudy（重思考學習）×1 |
| `GY_WENCHANG_N2` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_WENCHANG_N2 | 文昌會太陽、天梁、祿存：財官昭著，富貴先難後易。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_WENCHANG_N3` | starInPalace | natal | general、career、jobChange | verified | 可用 | CIT_GY_WENCHANG_N3 | 文昌落陷又加擎羊、火星：巧藝之人。 | 長期而言適合以專業技能、手藝發揮 | aptitudeStudy（重思考學習）×1 |
| `GY_WENCHANG_B1` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_WENCHANG_B1 | 文昌在巳酉丑宮入廟，乙戊辛年生人：大貴。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_WENCHANG_B2` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_WENCHANG_B2 | 文昌在亥卯未宮利益，乙戊年生人：財官格。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_WENCHANG_M1` | starInPalace | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_WENCHANG_M1 | 文昌坐命旺宮：志大財高、文藝精華、平步青雲。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見；長期而言表達與文字較有發揮 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2、aptitudeExpression（擅長表達）×1 |
| `GY_WENCHANG_M2` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_WENCHANG_M2 | 文昌守命之訣（夭折斷語，只保留原文）。 |  | — |
| `GY_WENCHANG_F1` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_WENCHANG_F1 | 女命文昌之訣（只保留原文）。 |  | — |
| `GY_WENCHANG_F2` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_WENCHANG_F2 | 女命文昌之訣（性別道德、壽夭斷語，只保留原文）。 |  | — |
| `GY_WENCHANG_L1` | period | decade | general、exam、career | verified | 可用 | CIT_GY_WENCHANG_L1 | 大限（或流年）逢文昌：利考試、功名。 | 這段時間較利於考試、進修與被肯定 | learningOpportunity（適合學習）×1、recognitionOpportunity（表現被看見）×1 |
| `GY_WENCHANG_A1` | period | annual | general、exam、career | verified | 可用 | CIT_GY_WENCHANG_A1 | 流年命宮逢文昌：利考試、功名。 | 這段時間較利於考試、進修與被肯定 | learningOpportunity（適合學習）×1、recognitionOpportunity（表現被看見）×1 |
| `GY_WENCHANG_L2` | period | decade | general、career、social、lawsuit、wealth | verified | 可用 | CIT_GY_WENCHANG_L2 | 大限文昌不得地又逢羊陀火鈴或化忌：口舌是非、破財（原文另有刑傷之說，不採用）。 | 這段時間溝通較容易起摩擦；這段時間花費或損失的可能較高 | communicationConflictRisk（容易起口角）×1、resourceLossRisk（容易花費或被分走）×1 |
| `GY_WENQU_N1` | starInPalace | natal | general、exam | verified | 可用 | CIT_GY_WENQU_N1 | 文曲與文昌相逢（有吉星）：利科第。 | 長期而言學習與思考較有發揮 | aptitudeStudy（重思考學習）×1 |
| `GY_WENQU_N2` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_WENQU_N2 | 文曲單居逢惡殺：古籍斷為便佞之人（品格斷語，只保留原文）。 |  | — |
| `GY_WENQU_N3` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_WENQU_N3 | 文曲在巳酉丑宮，甲年生人：貴。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_WENQU_N4` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_WENQU_N4 | 文曲與貪狼、火星同宮或三合：將相之命。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_WENQU_N5` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_WENQU_N5 | 文曲陷地逢武貞羊破殺狼：古籍斷為夭折（只保留原文）。 |  | — |
| `GY_WENQU_N6` | starInPalace | natal | general、exam | verified | 可用 | CIT_GY_WENQU_N6 | 文曲在旺宮與天同、天梁、武曲會合：聰明果決。 | 長期而言學習與思考較有發揮 | aptitudeStudy（重思考學習）×1 |
| `GY_WENQU_B1` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_WENQU_B1 | 文曲在寅午戌宮，甲庚年生人：財官格。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_WENQU_B2` | starInPalace | natal | general | verified | 可用 | CIT_GY_WENQU_B2 | 文曲在申子辰宮得地，丁癸辛庚年生人：福厚。 | 古籍評為有福；本 App 不把它轉成生活因素 | — |
| `GY_WENQU_B3` | starInPalace | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_WENQU_B3 | 文曲在巳酉丑宮入廟，辛年生人又遇紫微：大富貴。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_WENQU_B4` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_WENQU_B4 | 文曲在亥卯未宮旺地，辛丙壬戊年生人：財官格。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_WENQU_M1` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_WENQU_M1 | 文曲守命（無煞）：志氣昂揚、有福、得官。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_WENQU_M2` | starInPalace | natal | general、career | verified | 可用 | CIT_GY_WENQU_M2 | 文曲守命逢火星、化忌或三方惡殺：口才好（原文另有「惟在空門可還貴」，不採用）。 | 長期而言表達與文字較有發揮 | aptitudeExpression（擅長表達）×1 |
| `GY_WENQU_F1` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_WENQU_F1 | 女命文曲之訣（性別道德斷語，只保留原文）。 |  | — |
| `GY_WENQU_L1` | period | decade | general、career | verified | 可用 | CIT_GY_WENQU_L1 | 大限逢文曲：發福。 | 這段時間事情較容易推進 | progressOpportunity（推進機會）×1 |
| `GY_WENQU_L2` | period | decade | general、wealth | verified | 可用 | CIT_GY_WENQU_L2 | （文曲入限）再有左右、天同：財祿豐厚。 | 這段時間資源與收入較容易增加 | resourceIncrease（有實際收穫）×1 |
| `GY_ZUOFU_M1` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_ZUOFU_M1 | 左輔坐命，會紫微、天府、祿、權、貪狼、武曲：文武職皆清貴。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_ZUOFU_M2` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_ZUOFU_M2 | 左輔逢煞之訣（傷殘壽夭斷語，只保留原文）。 |  | — |
| `GY_ZUOFU_F1` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_ZUOFU_F1 | 女命左輔之訣（只保留原文）。 |  | — |
| `GY_ZUOFU_F2` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_ZUOFU_F2 | 女命左輔之訣（壽夭與偏房斷語，只保留原文）。 |  | — |
| `GY_ZUOFU_L1` | period | decade | general、wealth | verified | 可用 | CIT_GY_ZUOFU_L1 | 大限逢左輔：福氣深、富足。 | 這段時間資源與收入較容易增加 | resourceIncrease（有實際收穫）×1 |
| `GY_ZUOFU_L2` | period | decade | general、career、promotion | verified | 可用 | CIT_GY_ZUOFU_L2 | （左輔入限）再逢化科、化權：職位高遷。 | 這段時間較有機會承擔更多職責、被看見 | responsibilityOpportunity（承擔任務的機會）×1、recognitionOpportunity（表現被看見）×1 |
| `GY_ZUOFU_L3` | period | decade | general、wealth、career、decision | verified | 可用 | CIT_GY_ZUOFU_L3 | 大限左輔逢煞星：破財（原文另有「人亡」之說，不採用）。 | 這段時間花費或損失的可能較高；這段時間變動與起伏較多 | resourceLossRisk（容易花費或被分走）×1、instability（狀態不穩）×1 |
| `GY_YOUBI_N1` | starInPalace | natal | general | verified | 可用 | CIT_GY_YOUBI_N1 | 右弼會紫微、天府、天相、文昌、文曲：一生有福。 | 古籍評為有福；本 App 不把它轉成生活因素 | — |
| `GY_YOUBI_M1` | starInPalace | natal | general、exam、career、wealth | verified | 可用 | CIT_GY_YOUBI_M1 | 右弼坐命：厚重聰明；沒有火星、化忌、羊陀會照：財官出眾。 | 長期而言學習與思考較有發揮；長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeStudy（重思考學習）×1、aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_YOUBI_M2` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_YOUBI_M2 | 右弼逢煞之訣（帶疾斷語，只保留原文）。 |  | — |
| `GY_YOUBI_L1` | period | decade | general、wealth、career | verified | 可用 | CIT_GY_YOUBI_L1 | 大限逢右弼：人財興旺。 | 這段時間資源與收入較容易增加；這段時間事情較容易推進 | resourceIncrease（有實際收穫）×1、progressOpportunity（推進機會）×1 |
| `GY_YOUBI_L2` | period | decade | general、wealth、career | verified | 可用 | CIT_GY_YOUBI_L2 | 大限右弼遇凶星：破財、諸事難成。 | 這段時間花費或損失的可能較高；這段時間推進較容易卡住 | resourceLossRisk（容易花費或被分走）×1、executionResistance（推進有阻力）×1 |
| `GY_LUCUN_M1` | starInPalace | natal | general、wealth | verified | 可用 | CIT_GY_LUCUN_M1 | 祿存坐命，逢左右、昌曲會合：衣祿豐厚。 | 長期而言在累積與管理資源上較有發揮 | aptitudeResources（擅長經營資源）×2 |
| `GY_LUCUN_M2` | starInPalace | natal | general、career | verified | 可用 | CIT_GY_LUCUN_M2 | 祿存守命逢陀羅、火星交加：福不全（原文另有空門之說，不採用）。 | 推進時較容易卡住、需要更多準備 | executionResistance（推進有阻力）×1 |
| `GY_LUCUN_F1` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_LUCUN_F1 | 女命祿存之訣（只保留原文）。 |  | — |
| `GY_LUCUN_F2` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_LUCUN_F2 | 女命祿存之訣（只保留原文）。 |  | — |
| `GY_LUCUN_L1` | period | decade | general、career、wealth | verified | 可用 | CIT_GY_LUCUN_L1 | 大限逢祿存：作事求謀吉祥、收入充足。 | 這段時間事情較容易推進；這段時間資源與收入較容易增加 | progressOpportunity（推進機會）×1、resourceIncrease（有實際收穫）×1 |
| `GY_LUCUN_L2` | period | decade | general、wealth | verified | 可用 | CIT_GY_LUCUN_L2 | （祿存入限）再有科權、左右：此限富足。 | 這段時間資源與收入較容易增加 | resourceIncrease（有實際收穫）×1 |
| `GY_LUCUN_L3` | period | decade | general、wealth、relationship、marriage | verified | 可用 | CIT_GY_LUCUN_L3 | 大限祿存又逢化祿：富足、婚嫁喜事。 | 這段時間資源與收入較容易增加；這段時間人際與感情互動較溫和 | resourceIncrease（有實際收穫）×1、relationshipWarmth（互動有溫度）×1 |
| `GY_LUCUN_L4` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_LUCUN_L4 | 祿馬交馳逢劫空之訣（死亡斷語，只保留原文）。 |  | — |
| `GY_KUIYUE_N1` | starInPalace | natal | general、exam、career、promotion | verified | 可用 | CIT_GY_KUIYUE_N1 | 天魁天鉞在命，又有吉星加臨三合：年少即利考試功名。 | 長期而言學習與思考較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeStudy（重思考學習）×1、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_KUIYUE_N2` | starInPalace | natal | general、exam | verified | 可用 | CIT_GY_KUIYUE_N2 | 魁鉞在命：即使不富貴也聰明。 | 長期而言學習與思考較有發揮 | aptitudeStudy（重思考學習）×1 |
| `GY_KUIYUE_L1` | period | decade | general、exam、career、wealth | verified | 可用 | CIT_GY_KUIYUE_L1 | 大限逢魁鉞：名成利就。 | 這段時間較利於考試、進修與被肯定；這段時間資源與收入較容易增加 | learningOpportunity（適合學習）×1、recognitionOpportunity（表現被看見）×1、resourceIncrease（有實際收穫）×1 |
| `GY_KUIYUE_L2` | period | decade | general、wealth、career、promotion | verified | 可用 | CIT_GY_KUIYUE_L2 | 命或大限有魁鉞又遇文昌：收入充足、職位高遷。 | 這段時間資源與收入較容易增加；這段時間較有機會承擔更多職責、被看見 | resourceIncrease（有實際收穫）×1、responsibilityOpportunity（承擔任務的機會）×1、recognitionOpportunity（表現被看見）×1 |
| `GY_QINGYANG_B1` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_QINGYANG_B1 | 擎羊在辰戌丑未入廟，辰戌丑未年生人：財官格。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_QINGYANG_M1` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_QINGYANG_M1 | 擎羊坐命又得天魁天鉞守照：掌權。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_QINGYANG_M2` | starInPalace | natal | general、wealth | verified | 可用 | CIT_GY_QINGYANG_M2 | 擎羊守命，辰戌丑未年生人有福；再得紫微天府會合：財穀充足。 | 長期而言在累積與管理資源上較有發揮 | aptitudeResources（擅長經營資源）×2 |
| `GY_QINGYANG_M3` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_QINGYANG_M3 | 擎羊閑宮之訣（死亡斷語，只保留原文）。 |  | — |
| `GY_QINGYANG_F1` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_QINGYANG_F1 | 女命擎羊之訣（只保留原文）。 |  | — |
| `GY_QINGYANG_L1` | period | decade | general、career、promotion、wealth | verified | 可用 | CIT_GY_QINGYANG_L1 | 大限擎羊，辰戌丑未年生人可免禍；再遇紫微、文昌、天府：財官顯達。 | 這段時間較有機會承擔更多職責、被看見；這段時間資源與收入較容易增加 | responsibilityOpportunity（承擔任務的機會）×1、recognitionOpportunity（表現被看見）×1、resourceIncrease（有實際收穫）×1 |
| `GY_QINGYANG_L2` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_QINGYANG_L2 | 擎羊羅網之訣（死亡斷語，只保留原文）。 |  | — |
| `GY_QINGYANG_L3` | period | decade | general、wealth、career、decision | verified | 可用 | CIT_GY_QINGYANG_L3 | 大限擎羊落陷又加煞：最凶，易破財、變動（原文另有刑剋、流配之說，不採用）。 | 這段時間花費或損失的可能較高；這段時間變動與起伏較多 | resourceLossRisk（容易花費或被分走）×1、instability（狀態不穩）×1 |
| `GY_TUOLUO_N1` | starInPalace | natal | general、wealth、investment | verified | 可用 | CIT_GY_TUOLUO_N1 | 陀羅坐命：橫發橫破。 | 資源進出起伏較大 | financialVolatility（財務波動）×1 |
| `GY_TUOLUO_B1` | starInPalace | natal | general | verified | 可用 | CIT_GY_TUOLUO_B1 | 陀羅在辰戌丑未入廟，辰戌丑未年生人：利。 | 古籍評為相宜；本 App 只列出，不轉成生活因素 | — |
| `GY_TUOLUO_M1` | starInPalace | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_TUOLUO_M1 | 陀羅坐命，辰戌丑未年生人，再得紫微、文昌、天府會合：財祿豐盈。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_TUOLUO_M2` | starInPalace | natal | general、social | verified | 可用 | CIT_GY_TUOLUO_M2 | 陀羅落陷：口舌是非多（原文另有孤獨之說，不採用）。 | 人際上較容易有口舌是非、做事較不順心 | communicationConflictRisk（容易起口角）×1、executionResistance（推進有阻力）×1 |
| `GY_TUOLUO_F1` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_TUOLUO_F1 | 女命陀羅之訣（性別道德斷語，只保留原文）。 |  | — |
| `GY_TUOLUO_L1` | period | decade | general、career | verified | 可用 | CIT_GY_TUOLUO_L1 | 大限逢陀羅：事多，需謙和（原文另有死亡之說，不採用）。 | 這段時間推進較容易卡住 | executionResistance（推進有阻力）×1 |
| `GY_TUOLUO_L2` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_TUOLUO_L2 | 羊陀夾命之訣（刑剋斷語，只保留原文）。 |  | — |
| `GY_HUOXING_N1` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_HUOXING_N1 | 火星與廟旺的貪狼同見：財官格。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_HUOXING_N2` | starInPalace | natal | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_HUOXING_N2 | 火星利東南方出生的人、不利西北（客觀排盤沒有出生方位資料）。 |  | — |
| `GY_HUOXING_N3` | starInPalace | natal | general | verified | 可用 | CIT_GY_HUOXING_N3 | 火星坐命，寅卯巳午年生人：禍輕。 | 古籍評為相宜；本 App 只列出，不轉成生活因素 | — |
| `GY_HUOXING_N4` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_HUOXING_N4 | 火星與擎羊同宮之訣（災厄刑剋斷語，只保留原文）。 |  | — |
| `GY_HUOXING_B1` | starInPalace | natal | general | verified | 可用 | CIT_GY_HUOXING_B1 | 火星坐命，寅午戌年生人：宜。 | 古籍評為相宜；本 App 只列出，不轉成生活因素 | — |
| `GY_HUOXING_B2` | starInPalace | natal | general、career | verified | 可用 | CIT_GY_HUOXING_B2 | 火星坐命，申子辰年生人：多困。 | 推進時較容易卡住、需要更多準備 | executionResistance（推進有阻力）×1 |
| `GY_HUOXING_B4` | starInPalace | natal | general | verified | 可用 | CIT_GY_HUOXING_B4 | 火星坐命，寅卯未年生人：利益、多發福（原文作「寅卯未」）。 | 古籍評為相宜；本 App 只列出，不轉成生活因素 | — |
| `GY_HUOXING_B3` | starInPalace | natal | general | verified | 可用 | CIT_GY_HUOXING_B3 | 火星坐命，巳酉丑年生人：得地、吉。 | 古籍評為相宜；本 App 只列出，不轉成生活因素 | — |
| `GY_HUOXING_L1` | period | decade | general、career、wealth | verified | 可用 | CIT_GY_HUOXING_L1 | 大限逢得地的火星：百事通達、財豐。 | 這段時間事情較容易推進；這段時間資源與收入較容易增加 | progressOpportunity（推進機會）×1、resourceIncrease（有實際收穫）×1 |
| `GY_HUOXING_L2` | period | decade | general、career、social、lawsuit、wealth | verified | 可用 | CIT_GY_HUOXING_L2 | 大限火星（不得地）：易無端惹是非、破財（原文另有剋害六親之說，不採用）。 | 這段時間溝通較容易起摩擦；這段時間花費或損失的可能較高 | communicationConflictRisk（容易起口角）×1、resourceLossRisk（容易花費或被分走）×1 |
| `GY_LINGXING_N1` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_LINGXING_N1 | 鈴星坐命，寅午戌年生人：權貴。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_LINGXING_N2` | starInPalace | natal | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_LINGXING_N2 | 鈴星依出生方位論吉凶（客觀排盤沒有出生方位資料）。 |  | — |
| `GY_LINGXING_N3` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_LINGXING_N3 | 鈴星入廟遇貪狼、武曲：有威權。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_LINGXING_N4` | starInPalace | natal | general、wealth | verified | 可用 | CIT_GY_LINGXING_N4 | 鈴星再會紫微、天府、左右：不貴即富。 | 長期而言在累積與管理資源上較有發揮 | aptitudeResources（擅長經營資源）×2 |
| `GY_LINGXING_L1` | period | decade | general、career、wealth | pendingVerification | 未啟用：原文有疑字（兩輪核讀與決議仍無法確定） | CIT_GY_LINGXING_L1 | 大限鈴星遇貪狼：福多；再入廟逢吉：富貴名揚。 | 這段時間事情較容易推進；這段時間資源與收入較容易增加 | progressOpportunity（推進機會）×1、resourceIncrease（有實際收穫）×1 |
| `GY_LINGXING_L2` | period | decade | general、career、wealth、decision | verified | 可用 | CIT_GY_LINGXING_L2 | 大限鈴星而無吉星照：易招災惹禍、起伏大。 | 這段時間變動與起伏較多 | instability（狀態不穩）×1 |
| `GY_HUOLING_M1` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_HUOLING_M1 | 火星、鈴星居廟地，與貪狼、紫微、天府相會：性急而有威權、終有貴。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_HUOLING_M2` | starInPalace | natal | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_HUOLING_M2 | 火鈴落閑宮，西北生人：平庸（客觀排盤沒有出生方位資料）。 |  | — |
| `GY_HUOLING_F1` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_HUOLING_F1 | 女命火鈴之訣（只保留原文）。 |  | — |
| `GY_HUOLING_F2` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_HUOLING_F2 | 女命火鈴之訣（死亡斷語，只保留原文）。 |  | — |
| `GY_HUOLING_L1` | period | decade | general、career、promotion | verified | 可用 | CIT_GY_HUOLING_L1 | 大限火鈴與貪狼相會：福多；再加吉星：有權柄。 | 這段時間事情較容易推進；這段時間較有機會承擔更多職責、被看見 | progressOpportunity（推進機會）×1、responsibilityOpportunity（承擔任務的機會）×1、recognitionOpportunity（表現被看見）×1 |
| `GY_HUOLING_L2` | period | decade | general、wealth、career、social、lawsuit | verified | 可用 | CIT_GY_HUOLING_L2 | 大限火鈴落陷：易有遺失耗損、口舌是非（原文另有血光之說，不採用）。 | 這段時間支出與耗損的可能較高；這段時間溝通較容易起摩擦 | resourceLossRisk（容易花費或被分走）×1、unexpectedExpenseRisk（意外支出）×1、communicationConflictRisk（容易起口角）×1 |
| `GY_DIJIE_N1` | starInPalace | natal | general、decision | verified | 可用 | CIT_GY_DIJIE_N1 | 地劫坐命：做事疏狂（原文另有品格斷語，不採用）。 | 做事較容易衝動、不按常理 | impulsivityRisk（容易衝動）×1 |
| `GY_DIJIE_M1` | starInPalace | natal | wealth | verified | 可用 | CIT_GY_DIJIE_M1 | 地劫坐命又有擎羊、火星：持家辛苦。 | 收入較需要靠持續投入心力 | workloadIncrease（負荷增加）×1 |
| `GY_DIJIE_L1` | period | decade | general、career、wealth、decision | verified | 可用 | CIT_GY_DIJIE_L1 | 大限逢地劫：難免有波折。 | 這段時間變動與起伏較多 | instability（狀態不穩）×1 |
| `GY_DIKONG_N1` | starInPalace | natal | general、career、wealth、decision、investment | verified | 可用 | CIT_GY_DIKONG_N1 | 天空（地空）坐命：成敗多端、不聚財（原文另有品格斷語，不採用）。 | 起伏較大，有進有退；財務起伏較大、不容易穩定累積 | instability（狀態不穩）×1、financialVolatility（財務波動）×1 |
| `GY_DIKONG_M1` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_DIKONG_M1 | 天空坐命之訣（出家斷語，只保留原文）。 |  | — |
| `GY_DIKONG_L1` | period | decade | general、wealth | verified | 可用 | CIT_GY_DIKONG_L1 | 大限逢天空：破耗田產。 | 這段時間花費或損失的可能較高 | resourceLossRisk（容易花費或被分走）×1 |
| `GY_JIEKONG_L2` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_JIEKONG_L2 | 紫微卯酉逢劫空之訣（出家斷語，只保留原文）。 |  | — |
| `GY_JIEKONG_L3` | period | decade | general、wealth、career | verified | 可用 | CIT_GY_JIEKONG_L3 | 大限地空、地劫同臨：最為不順、易斷糧破財（原文另舉項羽、綠珠之死，不採用）。 | 這段時間花費或損失的可能較高；這段時間推進較容易卡住 | resourceLossRisk（容易花費或被分走）×1、executionResistance（推進有阻力）×1 |
| `GY_SHANGSHI_N1` | period | decade | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_SHANGSHI_N1 | 天傷、天使守限、太歲：主耗損（本 App 客觀排盤沒有天傷、天使）。 |  | — |
| `GY_TIANMA_N1` | starInPalace | natal | general、wealth | verified | 可用 | CIT_GY_TIANMA_N1 | 天馬最喜與祿存相會（祿馬交馳）。 | 長期而言在累積與管理資源上較有發揮 | aptitudeResources（擅長經營資源）×2 |
| `GY_TIANMA_N2` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_TIANMA_N2 | 天馬又逢化權、化祿照臨：主為官。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_TIANMA_L1` | period | decade | general、career、promotion、exam | verified | 可用 | CIT_GY_TIANMA_L1 | 大限逢天馬：佳；再遇紫微、天府、祿存：顯達、利考試。 | 這段時間較有機會承擔更多職責、被看見；這段時間較利於考試、進修與被肯定 | responsibilityOpportunity（承擔任務的機會）×1、recognitionOpportunity（表現被看見）×2、learningOpportunity（適合學習）×1 |
| `GY_TIANMA_L2` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_TIANMA_L2 | 天馬逢劫空之訣（死亡斷語，只保留原文）。 |  | — |
| `GY_HUALU_N1` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_HUALU_N1 | 化祿守命宮或官祿宮，又與化科、化權相遇：必任要職。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_HUALU_M1` | starInPalace | natal | general、career、wealth | verified | 可用 | CIT_GY_HUALU_M1 | 男命命宮化祿：榮顯有福。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_HUALU_L1` | period | decade | general、wealth | verified | 可用 | CIT_GY_HUALU_L1 | 大限化祿在天同、又遇太陽：常人也大富、多置產。 | 這段時間資源與收入較容易增加 | resourceIncrease（有實際收穫）×1 |
| `GY_HUAQUAN_N1` | period | decade | general、career | verified | 可用 | CIT_GY_HUAQUAN_N1 | 大限逢化權：十年順遂，逢凶也不為災。 | 這段時間事情較容易推進 | progressOpportunity（推進機會）×1 |
| `GY_HUAQUAN_N2` | period | decade | general、career、social、lawsuit | verified | 可用 | CIT_GY_HUAQUAN_N2 | （化權入限）若遇羊陀空劫等：受牽累、有官非。 | 這段時間溝通較容易起摩擦 | communicationConflictRisk（容易起口角）×1 |
| `GY_HUAQUAN_M1` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_HUAQUAN_M1 | 化權在命又有吉星扶持：事業軒昂。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_HUAQUAN_M2` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_HUAQUAN_M2 | 化權在巨門或武曲：掌兵權。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_HUAQUAN_F1` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_HUAQUAN_F1 | 女命化權之訣（性別角色斷語，只保留原文）。 |  | — |
| `GY_HUAQUAN_L1` | period | decade | general、career、promotion、wealth | verified | 可用 | CIT_GY_HUAQUAN_L1 | 大限化權：職位高升、財帛豐添、宜創業。 | 這段時間較有機會承擔更多職責、被看見；這段時間資源與收入較容易增加 | responsibilityOpportunity（承擔任務的機會）×1、recognitionOpportunity（表現被看見）×1、resourceIncrease（有實際收穫）×1 |
| `GY_HUAQUAN_L2` | period | decade | general、career | verified | 可用 | CIT_GY_HUAQUAN_L2 | 大限化權又遇武曲、貪狼：作事求謀都能成。 | 這段時間事情較容易推進 | progressOpportunity（推進機會）×1 |
| `GY_HUAKE_N1` | starInPalace | natal | general、exam | verified | 可用 | CIT_GY_HUAKE_N1 | 化科守命，又逢權祿：聰明通達；再逢魁鉞：利考試。 | 長期而言學習與思考較有發揮 | aptitudeStudy（重思考學習）×1 |
| `GY_HUAKE_N2` | starInPalace | natal | general、career、promotion、exam | verified | 可用 | CIT_GY_HUAKE_N2 | 化科守命逢天魁天鉞：利考試、居要職。 | 長期而言較有機會承擔職位、被看見；長期而言學習與思考較有發揮 | aptitudeResponsibility（適合承擔責任）×2、aptitudeStudy（重思考學習）×1 |
| `GY_HUAKE_M1` | starInPalace | natal | general、exam、career | verified | 可用 | CIT_GY_HUAKE_M1 | 男命化科：文章錦繡。 | 長期而言學習與思考較有發揮；長期而言表達與文字較有發揮 | aptitudeStudy（重思考學習）×1、aptitudeExpression（擅長表達）×1 |
| `GY_HUAKE_M2` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_HUAKE_M2 | 化科坐命再遇昌曲魁鉞：名揚。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_HUAKE_F1` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_HUAKE_F1 | 女命化科之訣（只保留原文）。 |  | — |
| `GY_HUAKE_L1` | period | decade | general、exam、career | verified | 可用 | CIT_GY_HUAKE_L1 | 大限化科又遇文昌：利考試、名聲。 | 這段時間較利於考試、進修與被肯定；這段時間事情較容易推進 | learningOpportunity（適合學習）×1、recognitionOpportunity（表現被看見）×1、progressOpportunity（推進機會）×1 |
| `GY_HUAJI_N1` | starInPalace | natal | general、career | verified | 可用 | CIT_GY_HUAJI_N1 | 太陽或太陰落陷又化忌：大凶（多阻滯）。 | 推進時較容易卡住、需要更多準備 | executionResistance（推進有阻力）×1 |
| `GY_HUAJI_M1` | starInPalace | natal | general、career | verified | 可用 | CIT_GY_HUAJI_M1 | 男命命宮化忌又會凶星：更凶；有吉星可救，但富貴不豐。 | 推進時較容易卡住、需要更多準備 | executionResistance（推進有阻力）×1 |
| `GY_HUAJI_M2` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_HUAJI_M2 | 貪破陷地化忌之訣（品格與性別斷語，只保留原文）。 |  | — |
| `GY_HUAJI_F1` | star | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_HUAJI_F1 | 女命化忌之訣（貧賤斷語，只保留原文）。 |  | — |
| `GY_HUAJI_L1` | period | decade | general | verified | 未啟用：古文沒有足夠成立條件 | CIT_GY_HUAJI_L1 | 大限化忌之星入廟：反而佳（古籍未說明如何判定「忌星入廟」與限宮的關係）。 |  | — |
| `GY_HUAJI_L2` | period | decade | general、career、wealth、decision、social、lawsuit | verified | 可用 | CIT_GY_HUAJI_L2 | 大限命宮見化忌：易有災禍、職位退守（原文另有「必家傾」「禁杖刑」等斷語，不採用）。 | 這段時間變動與起伏較多；這段時間溝通較容易起摩擦 | instability（狀態不穩）×1、communicationConflictRisk（容易起口角）×1 |
| `GY_HUAJI_L3` | period | decade | general、wealth | verified | 可用 | CIT_GY_HUAJI_L3 | 大限化忌又有惡煞加臨：破財、身心負荷重。 | 這段時間花費或損失的可能較高；這段時間身心負荷偏重，宜留意作息與休息（不作健康預測） | resourceLossRisk（容易花費或被分走）×1 |
| `GY_HUAJI_L3_H` | period | decade | health | verified | 可用 | CIT_GY_HUAJI_L3 | 大限化忌又有惡煞加臨：破財、身心負荷重。 | 這段時間身心負荷偏重，宜留意作息與休息（不作健康預測） | fatigueRisk（容易疲累）×1、recoveryNeed（需要休養）×1 |
| `GY_HUAJI_S1` | starInPalace | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_HUAJI_S1 | 化祿與祿存相會：富貴。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_HUAJI_S2` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_HUAJI_S2 | 化權在巨門或武曲：英名顯揚。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_HUAJI_S3` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_HUAJI_S3 | 化科與天魁天鉞相會：貴顯。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_HUAJI_S4` | starInPalace | natal | general、social | verified | 可用 | CIT_GY_HUAJI_S4 | 化忌在命宮：易招是非。 | 人際上較容易招惹口舌是非 | communicationConflictRisk（容易起口角）×1 |
| `GY_SUIJUN_N1` | period | annual | general | verified | 未啟用：古文沒有足夠成立條件 | CIT_GY_SUIJUN_N1 | 太歲守臨宮限時要仔細推詳；沒有吉星相助則難免官非（原文未說明「守臨宮限」指哪一宮）。 |  | — |
| `GY_DOUJUN_N1` | period | annual | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_DOUJUN_N1 | 斗君（流月起點）逐月斷吉凶；本 App 客觀排盤沒有斗君與流月。 |  | — |
| `GY_P_CAIBO_ZIWEI` | palace | natal | wealth | verified | 可用 | CIT_GY_P_CAIBO_ZIWEI | 紫微在財帛：豐足；加羊陀火鈴空劫則不旺。 | 長期而言資源與收入較能累積 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_CAIBO_ZIWEI_POJUN` | palace | natal | wealth | verified | 可用 | CIT_GY_P_CAIBO_ZIWEI_POJUN | 紫微破軍同在財帛：先難後易。 | 收入較需要靠持續投入心力 | workloadIncrease（負荷增加）×1 |
| `GY_P_CAIBO_ZIWEI_TIANFU` | palace | natal | wealth | verified | 可用 | CIT_GY_P_CAIBO_ZIWEI_TIANFU | 紫微天府同在財帛：終身富足、宜保守。 | 長期而言在累積資源上較有發揮 | aptitudeResources（擅長經營資源）×2 |
| `GY_P_CAIBO_ZIWEI_QISHA` | palace | natal | wealth、general、investment | verified | 可用 | CIT_GY_P_CAIBO_ZIWEI_QISHA | 紫微七殺同在財帛又加吉星：財帛橫發。 | 長期而言在累積資源上較有發揮；資源進出起伏較大 | aptitudeResources（擅長經營資源）×2、financialVolatility（財務波動）×1 |
| `GY_P_CAIBO_TIANJI` | palace | natal | wealth | verified | 可用 | CIT_GY_P_CAIBO_TIANJI | 天機在財帛：勞心費力而生財。 | 收入較需要靠持續投入心力 | workloadIncrease（負荷增加）×1 |
| `GY_P_CAIBO_TIANJI_TIANLIANG` | palace | natal | wealth、career | verified | 可用 | CIT_GY_P_CAIBO_TIANJI_TIANLIANG | 天機天梁同在財帛：以巧思謀外財。 | 較適合靠自己開創收入來源 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_CAIBO_TIANJI_XIAN` | palace | natal | wealth、investment | verified | 可用 | CIT_GY_P_CAIBO_TIANJI_XIAN | 天機在財帛加羊陀火鈴空劫：一生有成有敗。 | 財務起伏較大、不容易穩定累積 | financialVolatility（財務波動）×1 |
| `GY_P_CAIBO_TAIYANG` | palace | natal | wealth | verified | 可用 | CIT_GY_P_CAIBO_TAIYANG | 太陽在財帛：入廟豐足；落陷勞碌不遂。 | 長期而言資源與收入較能累積 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_CAIBO_TAIYANG_XIAN` | palace | natal | wealth | verified | 可用 | CIT_GY_P_CAIBO_TAIYANG_XIAN | 太陽在財帛落陷：勞碌不遂。 | 收入較需要靠持續投入心力 | workloadIncrease（負荷增加）×1 |
| `GY_P_CAIBO_WUQU` | palace | natal | wealth | verified | 可用 | CIT_GY_P_CAIBO_WUQU | 武曲在財帛：豐足；化吉則家資巨萬。 | 長期而言資源與收入較能累積 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_CAIBO_WUQU_HUA` | palace | natal | wealth | verified | 可用 | CIT_GY_P_CAIBO_WUQU_HUA | 武曲在財帛化吉：家資巨萬。 | 長期而言在累積資源上較有發揮 | aptitudeResources（擅長經營資源）×2 |
| `GY_P_CAIBO_WUQU_POJUN` | palace | natal | wealth、investment | verified | 可用 | CIT_GY_P_CAIBO_WUQU_POJUN | 武曲破軍同在財帛：財來財去、先無後有。 | 財務起伏較大、不容易穩定累積 | financialVolatility（財務波動）×1 |
| `GY_P_CAIBO_WUQU_TIANXIANG` | palace | natal | wealth | verified | 可用 | CIT_GY_P_CAIBO_WUQU_TIANXIANG | 武曲天相同在財帛：財帛豐盈、遇貴生財。 | 長期而言在累積資源上較有發揮 | aptitudeResources（擅長經營資源）×2 |
| `GY_P_CAIBO_TIANTONG` | palace | natal | wealth、career | verified | 可用 | CIT_GY_P_CAIBO_TIANTONG | 天同在財帛：白手生財、晚發。 | 較適合靠自己開創收入來源 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_CAIBO_TIANTONG_JUMEN` | palace | natal | wealth、investment | verified | 可用 | CIT_GY_P_CAIBO_TIANTONG_JUMEN | 天同巨門同在財帛：財氣有進有退。 | 財務起伏較大、不容易穩定累積 | financialVolatility（財務波動）×1 |
| `GY_P_CAIBO_TIANTONG_TIANLIANG` | palace | natal | wealth | verified | 可用 | CIT_GY_P_CAIBO_TIANTONG_TIANLIANG | 天同天梁同在財帛：財大旺。 | 長期而言在累積資源上較有發揮 | aptitudeResources（擅長經營資源）×2 |
| `GY_P_CAIBO_LIANZHEN` | palace | natal | wealth、career | verified | 可用 | CIT_GY_P_CAIBO_LIANZHEN | 廉貞在財帛：在寅申宮於繁忙中生財；落陷先難後易。 | 較適合靠自己開創收入來源 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_CAIBO_LIANZHEN_TANLANG` | palace | natal | wealth、investment、general | verified | 可用 | CIT_GY_P_CAIBO_LIANZHEN_TANLANG | 廉貞貪狼同在財帛：橫發橫破。 | 財務起伏較大、不容易穩定累積；資源進出起伏較大 | financialVolatility（財務波動）×2 |
| `GY_P_CAIBO_LIANZHEN_TIANXIANG` | palace | natal | wealth | verified | 可用 | CIT_GY_P_CAIBO_LIANZHEN_TIANXIANG | 廉貞天相同在財帛：富足。 | 長期而言資源與收入較能累積 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_CAIBO_TIANFU` | palace | natal | wealth | verified | 可用 | CIT_GY_P_CAIBO_TIANFU | 天府在財帛：富足；見羊陀火鈴空劫則有成敗。 | 長期而言資源與收入較能累積 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_CAIBO_TIANFU_SHA` | palace | natal | wealth、investment | verified | 可用 | CIT_GY_P_CAIBO_TIANFU_SHA | 天府在財帛見羊陀火鈴空劫：有成敗。 | 財務起伏較大、不容易穩定累積 | financialVolatility（財務波動）×1 |
| `GY_P_CAIBO_TIANFU_ZIWEI` | palace | natal | wealth | verified | 可用 | CIT_GY_P_CAIBO_TIANFU_ZIWEI | 天府紫微同在財帛：巨積。 | 長期而言在累積資源上較有發揮 | aptitudeResources（擅長經營資源）×2 |
| `GY_P_CAIBO_TAIYIN` | palace | natal | wealth | verified | 可用 | CIT_GY_P_CAIBO_TAIYIN | 太陰在財帛：入廟富足；落陷成敗不聚。 | 長期而言資源與收入較能累積 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_CAIBO_TAIYIN_XIAN` | palace | natal | wealth、investment | verified | 可用 | CIT_GY_P_CAIBO_TAIYIN_XIAN | 太陰在財帛落陷：成敗不聚。 | 財務起伏較大、不容易穩定累積 | financialVolatility（財務波動）×1 |
| `GY_P_CAIBO_TAIYIN_TIANJI` | palace | natal | wealth、career | verified | 可用 | CIT_GY_P_CAIBO_TAIYIN_TIANJI | 太陰天機同在財帛：白手生財成家。 | 較適合靠自己開創收入來源 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_CAIBO_TAIYIN_LUCUN` | palace | natal | wealth | verified | 可用 | CIT_GY_P_CAIBO_TAIYIN_LUCUN | 太陰在財帛，又有祿存與左右同宮：大富。 | 長期而言在累積資源上較有發揮 | aptitudeResources（擅長經營資源）×2 |
| `GY_P_CAIBO_TANLANG` | palace | natal | wealth | verified | 可用 | CIT_GY_P_CAIBO_TANLANG | 貪狼在財帛：廟旺（佳），落陷則貧寒。 | 收入較需要靠持續投入心力 | workloadIncrease（負荷增加）×1 |
| `GY_P_CAIBO_TANLANG_HUO` | palace | natal | general、wealth、investment | verified | 可用 | CIT_GY_P_CAIBO_TANLANG_HUO | 貪狼在財帛見火星：前半生成敗、後半生橫發。 | 資源進出起伏較大 | financialVolatility（財務波動）×1 |
| `GY_P_CAIBO_JUMEN` | palace | natal | wealth、career | verified | 可用 | CIT_GY_P_CAIBO_JUMEN | 巨門在財帛：白手成家，宜在熱鬧處求財。 | 較適合靠自己開創收入來源 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_CAIBO_JUMEN_SHA` | palace | natal | wealth、investment | verified | 可用 | CIT_GY_P_CAIBO_JUMEN_SHA | 巨門在財帛加羊陀火鈴空劫：破敗多端。 | 財務起伏較大、不容易穩定累積 | financialVolatility（財務波動）×1 |
| `GY_P_CAIBO_TIANLIANG` | palace | natal | wealth | verified | 可用 | CIT_GY_P_CAIBO_TIANLIANG | 天梁在財帛：富足，入廟上等；落陷辛勤求財。 | 長期而言在累積資源上較有發揮 | aptitudeResources（擅長經營資源）×2 |
| `GY_P_CAIBO_TIANLIANG_XIAN` | palace | natal | wealth | verified | 可用 | CIT_GY_P_CAIBO_TIANLIANG_XIAN | 天梁在財帛落陷：辛勤求財。 | 收入較需要靠持續投入心力 | workloadIncrease（負荷增加）×1 |
| `GY_P_CAIBO_TIANXIANG` | palace | natal | wealth | verified | 可用 | CIT_GY_P_CAIBO_TIANXIANG | 天相在財帛：富足；與紫微同宮財氣旺。 | 長期而言資源與收入較能累積 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_CAIBO_TIANXIANG_SHA` | palace | natal | wealth、investment | verified | 可用 | CIT_GY_P_CAIBO_TIANXIANG_SHA | 天相在財帛加羊陀火鈴空劫或化忌：成敗、無積聚。 | 財務起伏較大、不容易穩定累積 | financialVolatility（財務波動）×1 |
| `GY_P_CAIBO_POJUN` | palace | natal | wealth | verified | 可用 | CIT_GY_P_CAIBO_POJUN | 破軍在財帛：子午宮多蓄積，辰戌旺宮亦財盛；落陷不聚。 | 長期而言在累積資源上較有發揮 | aptitudeResources（擅長經營資源）×2 |
| `GY_P_CAIBO_POJUN_XIAN` | palace | natal | wealth、investment | verified | 可用 | CIT_GY_P_CAIBO_POJUN_XIAN | 破軍在財帛落陷：不聚財。 | 財務起伏較大、不容易穩定累積 | financialVolatility（財務波動）×1 |
| `GY_P_CAIBO_WENCHANG` | palace | natal | wealth | verified | 可用 | CIT_GY_P_CAIBO_WENCHANG | 文昌在財帛：富足；加吉星財氣旺。 | 長期而言資源與收入較能累積 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_CAIBO_WENQU` | palace | natal | wealth | verified | 可用 | CIT_GY_P_CAIBO_WENQU | 文曲在財帛入廟：富足；加吉星得貴人之財。 | 長期而言資源與收入較能累積 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_CAIBO_WENQU_SHA` | palace | natal | wealth、investment | verified | 可用 | CIT_GY_P_CAIBO_WENQU_SHA | 文曲在財帛加羊陀火鈴空劫：財來財去、成敗不遂。 | 財務起伏較大、不容易穩定累積 | financialVolatility（財務波動）×1 |
| `GY_P_CAIBO_FUBI` | palace | natal | wealth | verified | 可用 | CIT_GY_P_CAIBO_FUBI | 左輔、右弼在財帛：富足，會吉星得貴人之財。 | 長期而言資源與收入較能累積 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_CAIBO_FUBI_SHA` | palace | natal | wealth、investment | verified | 可用 | CIT_GY_P_CAIBO_FUBI_SHA | 左右在財帛加羊陀火鈴空劫：成敗不遂。 | 財務起伏較大、不容易穩定累積 | financialVolatility（財務波動）×1 |
| `GY_P_CAIBO_LUCUN` | palace | natal | wealth | verified | 可用 | CIT_GY_P_CAIBO_LUCUN | 祿存在財帛：富足、堆金積玉。 | 長期而言在累積資源上較有發揮 | aptitudeResources（擅長經營資源）×2 |
| `GY_P_CAIBO_QINGYANG` | palace | natal | wealth、career | verified | 可用 | CIT_GY_P_CAIBO_QINGYANG | 擎羊在財帛辰戌丑未：於繁忙競爭中生財。 | 較適合靠自己開創收入來源 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_CAIBO_QINGYANG_XIAN` | palace | natal | wealth、investment | verified | 可用 | CIT_GY_P_CAIBO_QINGYANG_XIAN | 擎羊在財帛落陷：難守成。 | 財務起伏較大、不容易穩定累積 | financialVolatility（財務波動）×1 |
| `GY_P_CAIBO_TUOLUO` | palace | natal | wealth | verified | 可用 | CIT_GY_P_CAIBO_TUOLUO | 陀羅在財帛：於繁忙中生財；落陷辛勤求財。 | 收入較需要靠持續投入心力 | workloadIncrease（負荷增加）×1 |
| `GY_P_CAIBO_HUOXING` | palace | natal | general、wealth、investment | verified | 可用 | CIT_GY_P_CAIBO_HUOXING | 火星獨守財帛：橫發橫破。 | 資源進出起伏較大 | financialVolatility（財務波動）×1 |
| `GY_P_CAIBO_LINGXING` | palace | natal | general、wealth、investment | verified | 可用 | CIT_GY_P_CAIBO_LINGXING | 鈴星在財帛：入廟橫發；落陷辛苦。 | 資源進出起伏較大 | financialVolatility（財務波動）×1 |
| `GY_P_CAIBO_KUIYUE` | palace | natal | wealth | verified | 可用 | CIT_GY_P_CAIBO_KUIYUE | 魁鉞在財帛：清高中生財、一生遂意。 | 長期而言資源與收入較能累積 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_CAIBO_DOUJUN` | palace | natal | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_P_CAIBO_DOUJUN | 斗君（流月）遇吉其月發財（本 App 沒有斗君）。 |  | — |
| `GY_P_QIANYI_ZIWEI` | palace | natal | travel、career | verified | 可用 | CIT_GY_P_QIANYI_ZIWEI | 紫微在遷移又有左右：出外得貴人扶持。 | 外出、異地發展時較容易得到協助 | supportAvailable（有人可協助）×1 |
| `GY_P_QIANYI_ZIWEI_TIANFU` | palace | natal | travel、career | verified | 可用 | CIT_GY_P_QIANYI_ZIWEI_TIANFU | 紫微天府同在遷移：出入通達。 | 外出、異地發展時較容易得到協助 | supportAvailable（有人可協助）×1 |
| `GY_P_QIANYI_ZIWEI_TIANXIANG` | palace | natal | travel、wealth | verified | 可用 | CIT_GY_P_QIANYI_ZIWEI_TIANXIANG | 紫微天相同在遷移：在外發財。 | 外出或異地發展較有收穫 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_QIANYI_ZIWEI_SHA` | palace | natal | travel | verified | 可用 | CIT_GY_P_QIANYI_ZIWEI_SHA | 紫微在遷移加羊陀火鈴空劫：在外不安靜。 | 外出與移動較多、較勞碌 | movementIncrease（移動變多）×1、stressLoad（身心壓力）×1 |
| `GY_P_QIANYI_TIANJI` | palace | natal | travel、career | verified | 可用 | CIT_GY_P_QIANYI_TIANJI | 天機在遷移：出外遇貴、居家多是非。 | 外出、異地發展時較容易得到協助 | supportAvailable（有人可協助）×1 |
| `GY_P_QIANYI_TIANJI_SHA` | palace | natal | travel、social | verified | 可用 | CIT_GY_P_QIANYI_TIANJI_SHA | 天機在遷移加羊陀火鈴：在外多是非。 | 在外或外出時較容易有口舌摩擦 | communicationConflictRisk（容易起口角）×1 |
| `GY_P_QIANYI_TAIYANG` | palace | natal | travel、career | verified | 可用 | CIT_GY_P_QIANYI_TAIYANG | 太陽在遷移：宜出外發福。 | 外出、異地發展時較容易得到協助 | supportAvailable（有人可協助）×1 |
| `GY_P_QIANYI_TAIYANG_SHA` | palace | natal | travel | verified | 可用 | CIT_GY_P_QIANYI_TAIYANG_SHA | 太陽在遷移加羊陀火鈴空劫：在外身心不得清閒。 | 外出與移動較多、較勞碌 | movementIncrease（移動變多）×1、stressLoad（身心壓力）×1 |
| `GY_P_QIANYI_WUQU` | palace | natal | travel | verified | 可用 | CIT_GY_P_QIANYI_WUQU | 武曲在遷移：忙碌、不宜靜守。 | 外出與移動較多、較勞碌 | movementIncrease（移動變多）×1、stressLoad（身心壓力）×1 |
| `GY_P_QIANYI_WUQU_TANLANG` | palace | natal | travel、wealth | verified | 可用 | CIT_GY_P_QIANYI_WUQU_TANLANG | 武曲貪狼同在遷移：宜經商。 | 外出或異地發展較有收穫 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_QIANYI_WUQU_SHA` | palace | natal | travel、social | verified | 可用 | CIT_GY_P_QIANYI_WUQU_SHA | 武曲在遷移加羊陀火鈴：在外多是非。 | 在外或外出時較容易有口舌摩擦 | communicationConflictRisk（容易起口角）×1 |
| `GY_P_QIANYI_TIANTONG` | palace | natal | travel、career | verified | 可用 | CIT_GY_P_QIANYI_TIANTONG | 天同在遷移：出外遇貴人扶持。 | 外出、異地發展時較容易得到協助 | supportAvailable（有人可協助）×1 |
| `GY_P_QIANYI_TIANTONG_SHA` | palace | natal | travel | verified | 可用 | CIT_GY_P_QIANYI_TIANTONG_SHA | 天同在遷移加羊陀火鈴空劫：在外少遂志。 | 外出與移動較多、較勞碌 | movementIncrease（移動變多）×1、stressLoad（身心壓力）×1 |
| `GY_P_QIANYI_LIANZHEN` | palace | natal | travel、career | verified | 可用 | CIT_GY_P_QIANYI_LIANZHEN | 廉貞在遷移：出外通達、在家日少。 | 外出、異地發展時較容易得到協助；外出與移動較多、較勞碌 | supportAvailable（有人可協助）×1、movementIncrease（移動變多）×1、stressLoad（身心壓力）×1 |
| `GY_P_QIANYI_LIANZHEN_QISHA` | palace | natal | travel、wealth | verified | 可用 | CIT_GY_P_QIANYI_LIANZHEN_QISHA | 廉貞七殺同在遷移：在外廣招財。 | 外出或異地發展較有收穫 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_QIANYI_TIANFU` | palace | natal | travel、career | verified | 可用 | CIT_GY_P_QIANYI_TIANFU | 天府在遷移：出外遇貴人扶持。 | 外出、異地發展時較容易得到協助 | supportAvailable（有人可協助）×1 |
| `GY_P_QIANYI_TAIYIN` | palace | natal | travel、career、wealth | verified | 可用 | CIT_GY_P_QIANYI_TAIYIN | 太陰在遷移：入廟出外遇貴發財；落陷招是非。 | 外出、異地發展時較容易得到協助；外出或異地發展較有收穫 | supportAvailable（有人可協助）×1、aptitudeResources（擅長經營資源）×1 |
| `GY_P_QIANYI_TAIYIN_XIAN` | palace | natal | travel、social | verified | 可用 | CIT_GY_P_QIANYI_TAIYIN_XIAN | 太陰在遷移落陷：招是非。 | 在外或外出時較容易有口舌摩擦 | communicationConflictRisk（容易起口角）×1 |
| `GY_P_QIANYI_JUMEN` | palace | natal | travel、social | verified | 可用 | CIT_GY_P_QIANYI_JUMEN | 巨門在遷移：出外勞心、與人多是非。 | 外出與移動較多、較勞碌；在外或外出時較容易有口舌摩擦 | movementIncrease（移動變多）×1、stressLoad（身心壓力）×1、communicationConflictRisk（容易起口角）×1 |
| `GY_P_QIANYI_TIANXIANG` | palace | natal | travel、career | verified | 可用 | CIT_GY_P_QIANYI_TIANXIANG | 天相在遷移：出外有貴人提攜。 | 外出、異地發展時較容易得到協助 | supportAvailable（有人可協助）×1 |
| `GY_P_QIANYI_TIANXIANG_WUQU` | palace | natal | travel、wealth | verified | 可用 | CIT_GY_P_QIANYI_TIANXIANG_WUQU | 天相武曲同在遷移：在外發財。 | 外出或異地發展較有收穫 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_QIANYI_TIANLIANG` | palace | natal | travel、career | verified | 可用 | CIT_GY_P_QIANYI_TIANLIANG | 天梁在遷移：出外近貴人而成就。 | 外出、異地發展時較容易得到協助 | supportAvailable（有人可協助）×1 |
| `GY_P_QIANYI_QISHA` | palace | natal | travel | verified | 可用 | CIT_GY_P_QIANYI_QISHA | 七殺在遷移：在外日多。 | 外出與移動較多、較勞碌 | movementIncrease（移動變多）×1、stressLoad（身心壓力）×1 |
| `GY_P_QIANYI_QISHA_SHA` | palace | natal | travel | verified | 可用 | CIT_GY_P_QIANYI_QISHA_SHA | 七殺在遷移加羊陀火鈴空劫：操心、不富（原文另有流蕩天涯之說）。 | 外出與移動較多、較勞碌 | movementIncrease（移動變多）×1、stressLoad（身心壓力）×1 |
| `GY_P_QIANYI_POJUN` | palace | natal | travel | verified | 可用 | CIT_GY_P_QIANYI_POJUN | 破軍在遷移：出外勞心；入廟在外崢嶸。 | 外出與移動較多、較勞碌 | movementIncrease（移動變多）×1、stressLoad（身心壓力）×1 |
| `GY_P_QIANYI_WENCHANG` | palace | natal | travel、career | verified | 可用 | CIT_GY_P_QIANYI_WENCHANG | 文昌在遷移：出外遇貴發達。 | 外出、異地發展時較容易得到協助 | supportAvailable（有人可協助）×1 |
| `GY_P_QIANYI_WENQU` | palace | natal | travel、career | verified | 可用 | CIT_GY_P_QIANYI_WENQU | 文曲在遷移：在外近貴，加吉星得財。 | 外出、異地發展時較容易得到協助 | supportAvailable（有人可協助）×1 |
| `GY_P_QIANYI_ZUOFU` | palace | natal | travel、career | verified | 可用 | CIT_GY_P_QIANYI_ZUOFU | 左輔在遷移：動中有貴人扶持。 | 外出、異地發展時較容易得到協助 | supportAvailable（有人可協助）×1 |
| `GY_P_QIANYI_ZUOFU_SHA` | palace | natal | travel、social | verified | 可用 | CIT_GY_P_QIANYI_ZUOFU_SHA | 左輔在遷移加羊陀火鈴：多招是非。 | 在外或外出時較容易有口舌摩擦 | communicationConflictRisk（容易起口角）×1 |
| `GY_P_QIANYI_YOUBI` | palace | natal | travel、career | verified | 可用 | CIT_GY_P_QIANYI_YOUBI | 右弼在遷移：出外遇貴人扶持。 | 外出、異地發展時較容易得到協助 | supportAvailable（有人可協助）×1 |
| `GY_P_QIANYI_YOUBI_SHA` | palace | natal | travel、social | verified | 可用 | CIT_GY_P_QIANYI_YOUBI_SHA | 右弼在遷移加羊陀火鈴空劫：在外與人有爭競。 | 在外或外出時較容易有口舌摩擦 | communicationConflictRisk（容易起口角）×1 |
| `GY_P_QIANYI_LUCUN` | palace | natal | travel、wealth | verified | 可用 | CIT_GY_P_QIANYI_LUCUN | 祿存在遷移：出外衣祿遂心。 | 外出或異地發展較有收穫 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_QIANYI_QINGYANG` | palace | natal | travel、wealth | verified | 可用 | CIT_GY_P_QIANYI_QINGYANG | 擎羊在遷移入廟：在外衣祿遂心。 | 外出或異地發展較有收穫 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_QIANYI_TUOLUO` | palace | natal | travel、career | verified | 可用 | CIT_GY_P_QIANYI_TUOLUO | 陀羅在遷移會吉星：在外遇貴得財。 | 外出、異地發展時較容易得到協助 | supportAvailable（有人可協助）×1 |
| `GY_P_QIANYI_TUOLUO_XIAN` | palace | natal | travel、social | verified | 可用 | CIT_GY_P_QIANYI_TUOLUO_XIAN | 陀羅在遷移落陷又加煞：多招是非。 | 在外或外出時較容易有口舌摩擦 | communicationConflictRisk（容易起口角）×1 |
| `GY_P_QIANYI_HUOXING` | palace | natal | travel | verified | 可用 | CIT_GY_P_QIANYI_HUOXING | 火星獨守遷移：出外不安。 | 外出與移動較多、較勞碌 | movementIncrease（移動變多）×1、stressLoad（身心壓力）×1 |
| `GY_P_QIANYI_LINGXING` | palace | natal | travel、social | verified | 可用 | CIT_GY_P_QIANYI_LINGXING | 鈴星在遷移：有吉星同出外吉；加羊陀空劫招是非。 | 在外或外出時較容易有口舌摩擦 | communicationConflictRisk（容易起口角）×1 |
| `GY_P_QIANYI_DOUJUN` | palace | natal | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_P_QIANYI_DOUJUN | 斗君（流月）過遷移（本 App 沒有斗君）。 |  | — |
| `GY_P_JIAOYOU_ZIWEI` | palace | natal | social、cooperation | verified | 可用 | CIT_GY_P_JIAOYOU_ZIWEI | 紫微在奴僕（交友）宮：助力多、能助己生財。 | 朋友、同事或團隊的支援較多 | supportAvailable（有人可協助）×1、cooperationSupport（合作順暢）×1 |
| `GY_P_JIAOYOU_ZIWEI_SHA` | palace | natal | social、cooperation | verified | 可用 | CIT_GY_P_JIAOYOU_ZIWEI_SHA | 紫微在交友宮加羊陀火鈴：助力不足。 | 朋友、同事或團隊的支援較弱，合作較容易有摩擦 | cooperationFriction（合作有摩擦）×1 |
| `GY_P_JIAOYOU_TAIYANG` | palace | natal | social、cooperation | verified | 可用 | CIT_GY_P_JIAOYOU_TAIYANG | 太陽在交友宮：入廟得助；落陷少助、易有怨。 | 朋友、同事或團隊的支援較多 | supportAvailable（有人可協助）×1、cooperationSupport（合作順暢）×1 |
| `GY_P_JIAOYOU_TAIYANG_XIAN` | palace | natal | social、cooperation | verified | 可用 | CIT_GY_P_JIAOYOU_TAIYANG_XIAN | 太陽在交友宮落陷：少助、易有怨。 | 人際往來中較需要留意信任與分際 | trustRisk（信任風險）×1 |
| `GY_P_JIAOYOU_WUQU` | palace | natal | social、cooperation | verified | 可用 | CIT_GY_P_JIAOYOU_WUQU | 武曲在交友宮旺宮：一呼百諾。 | 朋友、同事或團隊的支援較多 | supportAvailable（有人可協助）×1、cooperationSupport（合作順暢）×1 |
| `GY_P_JIAOYOU_WUQU_QISHA` | palace | natal | social、cooperation | verified | 可用 | CIT_GY_P_JIAOYOU_WUQU_QISHA | 武曲七殺同在交友宮：易有背離。 | 人際往來中較需要留意信任與分際 | trustRisk（信任風險）×1 |
| `GY_P_JIAOYOU_LIANZHEN` | palace | natal | social、cooperation | verified | 可用 | CIT_GY_P_JIAOYOU_LIANZHEN | 廉貞在交友宮落陷：易有背離。 | 人際往來中較需要留意信任與分際 | trustRisk（信任風險）×1 |
| `GY_P_JIAOYOU_LIANZHEN_MIAO` | palace | natal | social、cooperation | verified | 可用 | CIT_GY_P_JIAOYOU_LIANZHEN_MIAO | 廉貞在交友宮入廟：一呼百諾。 | 朋友、同事或團隊的支援較多 | supportAvailable（有人可協助）×1、cooperationSupport（合作順暢）×1 |
| `GY_P_JIAOYOU_TAIYIN` | palace | natal | social、cooperation | verified | 可用 | CIT_GY_P_JIAOYOU_TAIYIN | 太陰在交友宮入廟：得力。 | 朋友、同事或團隊的支援較多 | supportAvailable（有人可協助）×1、cooperationSupport（合作順暢）×1 |
| `GY_P_JIAOYOU_TAIYIN_TIANJI` | palace | natal | social、cooperation | verified | 可用 | CIT_GY_P_JIAOYOU_TAIYIN_TIANJI | 太陰天機同在交友宮：欠力。 | 朋友、同事或團隊的支援較弱，合作較容易有摩擦 | cooperationFriction（合作有摩擦）×1 |
| `GY_P_JIAOYOU_TIANFU` | palace | natal | social、cooperation | verified | 可用 | CIT_GY_P_JIAOYOU_TIANFU | 天府在交友宮：得力、一呼百諾。 | 朋友、同事或團隊的支援較多 | supportAvailable（有人可協助）×1、cooperationSupport（合作順暢）×1 |
| `GY_P_JIAOYOU_TIANFU_SHA` | palace | natal | social、cooperation | verified | 可用 | CIT_GY_P_JIAOYOU_TIANFU_SHA | 天府在交友宮加羊陀火鈴空劫：多背離。 | 人際往來中較需要留意信任與分際 | trustRisk（信任風險）×1 |
| `GY_P_JIAOYOU_TANLANG` | palace | natal | social、cooperation | verified | 可用 | CIT_GY_P_JIAOYOU_TANLANG | 貪狼在交友宮：起初難得助力。 | 朋友、同事或團隊的支援較弱，合作較容易有摩擦 | cooperationFriction（合作有摩擦）×1 |
| `GY_P_JIAOYOU_JUMEN` | palace | natal | social、cooperation | verified | 可用 | CIT_GY_P_JIAOYOU_JUMEN | 巨門在交友宮：早年不得力、招是非。 | 朋友、同事或團隊的支援較弱，合作較容易有摩擦 | cooperationFriction（合作有摩擦）×1 |
| `GY_P_JIAOYOU_TIANXIANG` | palace | natal | general | verified | 可用 | CIT_GY_P_JIAOYOU_TIANXIANG | 天相在交友宮：晚年才得助力。 | 古籍評為相宜；本 App 只列出，不轉成生活因素 | — |
| `GY_P_JIAOYOU_TIANXIANG_SHA` | palace | natal | social、cooperation | verified | 可用 | CIT_GY_P_JIAOYOU_TIANXIANG_SHA | 天相在交友宮加羊陀火鈴空劫：欠力。 | 朋友、同事或團隊的支援較弱，合作較容易有摩擦 | cooperationFriction（合作有摩擦）×1 |
| `GY_P_JIAOYOU_TIANLIANG` | palace | natal | social、cooperation | verified | 可用 | CIT_GY_P_JIAOYOU_TIANLIANG | 天梁在交友宮：助力多。 | 朋友、同事或團隊的支援較多 | supportAvailable（有人可協助）×1、cooperationSupport（合作順暢）×1 |
| `GY_P_JIAOYOU_QISHA` | palace | natal | social、cooperation | verified | 可用 | CIT_GY_P_JIAOYOU_QISHA | 七殺在交友宮：身邊人剛強、易有欺凌。 | 人際往來中較需要留意信任與分際 | trustRisk（信任風險）×1 |
| `GY_P_JIAOYOU_POJUN` | palace | natal | social、cooperation | verified | 可用 | CIT_GY_P_JIAOYOU_POJUN | 破軍在交友宮：入廟得力；落陷招怨。 | 朋友、同事或團隊的支援較多 | supportAvailable（有人可協助）×1、cooperationSupport（合作順暢）×1 |
| `GY_P_JIAOYOU_POJUN_XIAN` | palace | natal | social、cooperation | verified | 可用 | CIT_GY_P_JIAOYOU_POJUN_XIAN | 破軍在交友宮落陷：招怨、背離。 | 人際往來中較需要留意信任與分際 | trustRisk（信任風險）×1 |
| `GY_P_JIAOYOU_WENCHANG` | palace | natal | social、cooperation | verified | 可用 | CIT_GY_P_JIAOYOU_WENCHANG | 文昌入廟獨守交友宮：得力。 | 朋友、同事或團隊的支援較多 | supportAvailable（有人可協助）×1、cooperationSupport（合作順暢）×1 |
| `GY_P_JIAOYOU_WENQU` | palace | natal | social、cooperation | verified | 可用 | CIT_GY_P_JIAOYOU_WENQU | 文曲在交友宮入廟：得力。 | 朋友、同事或團隊的支援較多 | supportAvailable（有人可協助）×1、cooperationSupport（合作順暢）×1 |
| `GY_P_JIAOYOU_ZUOFU` | palace | natal | social、cooperation | verified | 可用 | CIT_GY_P_JIAOYOU_ZUOFU | 左輔獨守交友宮：一呼百諾。 | 朋友、同事或團隊的支援較多 | supportAvailable（有人可協助）×1、cooperationSupport（合作順暢）×1 |
| `GY_P_JIAOYOU_YOUBI` | palace | natal | social、cooperation | verified | 可用 | CIT_GY_P_JIAOYOU_YOUBI | 右弼獨守交友宮：助力成行。 | 朋友、同事或團隊的支援較多 | supportAvailable（有人可協助）×1、cooperationSupport（合作順暢）×1 |
| `GY_P_JIAOYOU_FUBI_SHA` | palace | natal | social、cooperation | verified | 可用 | CIT_GY_P_JIAOYOU_FUBI_SHA | 右弼在交友宮加羊陀火鈴空劫：易有背離、耗財。 | 人際往來中較需要留意信任與分際 | trustRisk（信任風險）×1 |
| `GY_P_JIAOYOU_LUCUN` | palace | natal | social、cooperation | verified | 可用 | CIT_GY_P_JIAOYOU_LUCUN | 祿存在交友宮：助力多，加吉星能助己起家。 | 朋友、同事或團隊的支援較多 | supportAvailable（有人可協助）×1、cooperationSupport（合作順暢）×1 |
| `GY_P_JIAOYOU_QINGYANG` | palace | natal | social、cooperation | verified | 可用 | CIT_GY_P_JIAOYOU_QINGYANG | 擎羊在交友宮：易招怨、不得力。 | 人際往來中較需要留意信任與分際 | trustRisk（信任風險）×1 |
| `GY_P_JIAOYOU_TUOLUO` | palace | natal | social、cooperation | verified | 可用 | CIT_GY_P_JIAOYOU_TUOLUO | 陀羅在交友宮：欠力。 | 朋友、同事或團隊的支援較弱，合作較容易有摩擦 | cooperationFriction（合作有摩擦）×1 |
| `GY_P_JIAOYOU_HUOXING` | palace | natal | social、cooperation | verified | 可用 | CIT_GY_P_JIAOYOU_HUOXING | 火星獨守交友宮：不得力。 | 朋友、同事或團隊的支援較弱，合作較容易有摩擦 | cooperationFriction（合作有摩擦）×1 |
| `GY_P_JIAOYOU_LINGXING` | palace | natal | social、cooperation | verified | 可用 | CIT_GY_P_JIAOYOU_LINGXING | 鈴星獨守交友宮：不得力。 | 朋友、同事或團隊的支援較弱，合作較容易有摩擦 | cooperationFriction（合作有摩擦）×1 |
| `GY_P_JIAOYOU_DOUJUN` | palace | natal | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_P_JIAOYOU_DOUJUN | 斗君（流月）過奴僕宮（本 App 沒有斗君）。 |  | — |
| `GY_P_GUANLU_ZIWEI` | palace | natal | career、promotion | verified | 可用 | CIT_GY_P_GUANLU_ZIWEI | 紫微在官祿廟旺，遇左右昌曲魁鉞：職位崇高。 | 長期而言在承擔職務、被看見上較有發揮 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_P_GUANLU_ZIWEI_SHA` | palace | natal | general | verified | 可用 | CIT_GY_P_GUANLU_ZIWEI_SHA | 紫微在官祿加羊陀火鈴：平常。 |  | — |
| `GY_P_GUANLU_ZIWEI_TIANFU` | palace | natal | career、promotion | verified | 可用 | CIT_GY_P_GUANLU_ZIWEI_TIANFU | 紫微天府同在官祿：權貴、名利兩全。 | 長期而言在承擔職務、被看見上較有發揮 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_P_GUANLU_ZIWEI_TIANXIANG` | palace | natal | career、promotion | verified | 可用 | CIT_GY_P_GUANLU_ZIWEI_TIANXIANG | 紫微天相同在官祿：內外權貴。 | 長期而言在承擔職務、被看見上較有發揮 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_P_GUANLU_TIANJI` | palace | natal | career、promotion | verified | 可用 | CIT_GY_P_GUANLU_TIANJI | 天機在官祿入廟：權貴。 | 長期而言在承擔職務、被看見上較有發揮 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_P_GUANLU_TIANJI_TIANLIANG` | palace | natal | career | verified | 可用 | CIT_GY_P_GUANLU_TIANJI_TIANLIANG | 天機天梁同在官祿：文武之材。 | 職涯選擇面較廣、適合承擔職務 | aptitudeResponsibility（適合承擔責任）×1 |
| `GY_P_GUANLU_TIANJI_XIAN` | palace | natal | career、jobChange | verified | 可用 | CIT_GY_P_GUANLU_TIANJI_XIAN | 天機在官祿落陷：職位進退。 | 職涯起伏、進退較多 | instability（狀態不穩）×1 |
| `GY_P_GUANLU_TAIYANG` | palace | natal | career | verified | 可用 | CIT_GY_P_GUANLU_TAIYANG | 太陽在官祿入廟、不見羊陀火鈴：文武皆良。 | 職涯選擇面較廣、適合承擔職務 | aptitudeResponsibility（適合承擔責任）×1 |
| `GY_P_GUANLU_TAIYANG_LUCKY` | palace | natal | career、promotion | verified | 可用 | CIT_GY_P_GUANLU_TAIYANG_LUCKY | 太陽在官祿，左右昌曲魁鉞同會又加科權祿：一品之貴。 | 長期而言在承擔職務、被看見上較有發揮 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_P_GUANLU_WUQU` | palace | natal | career、promotion | verified | 可用 | CIT_GY_P_GUANLU_WUQU | 武曲在官祿入廟又與昌曲左右同宮：武職崢嶸。 | 長期而言在承擔職務、被看見上較有發揮 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_P_GUANLU_WUQU_HUA` | palace | natal | career、general、wealth | verified | 可用 | CIT_GY_P_GUANLU_WUQU_HUA | 武曲在官祿會科權祿：財富之官。 | 職涯選擇面較廣、適合承擔職務；長期而言在累積與管理資源上較有發揮 | aptitudeResponsibility（適合承擔責任）×1、aptitudeResources（擅長經營資源）×2 |
| `GY_P_GUANLU_WUQU_XIAN` | palace | natal | general、career | verified | 可用 | CIT_GY_P_GUANLU_WUQU_XIAN | 武曲在官祿落陷又逢陀鈴劫忌：功名難成。 | 推進時較容易卡住、需要更多準備 | executionResistance（推進有阻力）×1 |
| `GY_P_GUANLU_TIANTONG` | palace | natal | career | verified | 可用 | CIT_GY_P_GUANLU_TIANTONG | 天同在官祿入廟、無羊陀火鈴：文武皆宜。 | 職涯選擇面較廣、適合承擔職務 | aptitudeResponsibility（適合承擔責任）×1 |
| `GY_P_GUANLU_TIANTONG_TIANLIANG` | palace | natal | career、promotion | verified | 可用 | CIT_GY_P_GUANLU_TIANTONG_TIANLIANG | 天同天梁同在官祿：權貴。 | 長期而言在承擔職務、被看見上較有發揮 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_P_GUANLU_LIANZHEN` | palace | natal | career、promotion、general、wealth、decision | verified | 可用 | CIT_GY_P_GUANLU_LIANZHEN | 廉貞在官祿入廟：武職權貴但不耐久。 | 長期而言在承擔職務、被看見上較有發揮；成果不容易持久，需要定期檢視、及早鞏固 | aptitudeResponsibility（適合承擔責任）×2、weakeningTrend（後段吃力）×1 |
| `GY_P_GUANLU_TIANFU` | palace | natal | career | verified | 可用 | CIT_GY_P_GUANLU_TIANFU | 天府在官祿入廟：文武皆吉；無煞全美。 | 職涯選擇面較廣、適合承擔職務 | aptitudeResponsibility（適合承擔責任）×1 |
| `GY_P_GUANLU_TIANFU_SHA` | palace | natal | general | verified | 可用 | CIT_GY_P_GUANLU_TIANFU_SHA | 天府在官祿見空劫：平常。 |  | — |
| `GY_P_GUANLU_TAIYIN` | palace | natal | career、promotion | verified | 可用 | CIT_GY_P_GUANLU_TAIYIN | 太陰在官祿入廟：多貴。 | 長期而言在承擔職務、被看見上較有發揮 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_P_GUANLU_TAIYIN_XIAN` | palace | natal | career、jobChange | verified | 可用 | CIT_GY_P_GUANLU_TAIYIN_XIAN | 太陰在官祿落陷：難顯達。 | 職涯起伏、進退較多 | instability（狀態不穩）×1 |
| `GY_P_GUANLU_TANLANG` | palace | natal | career、promotion | verified | 可用 | CIT_GY_P_GUANLU_TANLANG | 貪狼在官祿入廟遇火鈴：武職掌大權。 | 長期而言在承擔職務、被看見上較有發揮 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_P_GUANLU_TANLANG_ZIWEI` | palace | natal | career、promotion | verified | 可用 | CIT_GY_P_GUANLU_TANLANG_ZIWEI | 貪狼紫微同在官祿：權貴非小。 | 長期而言在承擔職務、被看見上較有發揮 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_P_GUANLU_JUMEN` | palace | natal | career、promotion、general、wealth、decision | verified | 可用 | CIT_GY_P_GUANLU_JUMEN | 巨門在官祿入廟：武職權貴，文職不耐久。 | 長期而言在承擔職務、被看見上較有發揮；成果不容易持久，需要定期檢視、及早鞏固 | aptitudeResponsibility（適合承擔責任）×2、weakeningTrend（後段吃力）×1 |
| `GY_P_GUANLU_JUMEN_XIAN` | palace | natal | general、decision、career、jobChange | verified | 可用 | CIT_GY_P_GUANLU_JUMEN_XIAN | 巨門在官祿落陷：多悔吝。 | 較容易有反覆、事後需要修正的情況；職涯起伏、進退較多 | instability（狀態不穩）×2 |
| `GY_P_GUANLU_TIANXIANG` | palace | natal | career | verified | 可用 | CIT_GY_P_GUANLU_TIANXIANG | 天相在官祿入廟：文武皆宜。 | 職涯選擇面較廣、適合承擔職務 | aptitudeResponsibility（適合承擔責任）×1 |
| `GY_P_GUANLU_TIANXIANG_ZIWEI` | palace | natal | career、promotion | verified | 可用 | CIT_GY_P_GUANLU_TIANXIANG_ZIWEI | 天相紫微同在官祿：權貴。 | 長期而言在承擔職務、被看見上較有發揮 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_P_GUANLU_TIANLIANG` | palace | natal | career | verified | 可用 | CIT_GY_P_GUANLU_TIANLIANG | 天梁在官祿（午宮廟）會左右魁鉞：文武之材。 | 職涯選擇面較廣、適合承擔職務 | aptitudeResponsibility（適合承擔責任）×1 |
| `GY_P_GUANLU_QISHA` | palace | natal | career | verified | 可用 | CIT_GY_P_GUANLU_QISHA | 七殺在官祿廟旺：宜武職。 | 職涯選擇面較廣、適合承擔職務 | aptitudeResponsibility（適合承擔責任）×1 |
| `GY_P_GUANLU_POJUN` | palace | natal | career、promotion | verified | 可用 | CIT_GY_P_GUANLU_POJUN | 破軍在官祿廟旺：武職顯達。 | 長期而言在承擔職務、被看見上較有發揮 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_P_GUANLU_WENQU` | palace | natal | career | verified | 可用 | CIT_GY_P_GUANLU_WENQU | 文曲在官祿廟旺：文武皆宜。 | 職涯選擇面較廣、適合承擔職務 | aptitudeResponsibility（適合承擔責任）×1 |
| `GY_P_GUANLU_ZUOFU` | palace | natal | career | verified | 可用 | CIT_GY_P_GUANLU_ZUOFU | 左輔在官祿入廟：文武之材。 | 職涯選擇面較廣、適合承擔職務 | aptitudeResponsibility（適合承擔責任）×1 |
| `GY_P_GUANLU_ZUOFU_SHA` | palace | natal | career、jobChange | verified | 可用 | CIT_GY_P_GUANLU_ZUOFU_SHA | 左輔在官祿見羊陀火鈴空劫：聲名進退。 | 職涯起伏、進退較多 | instability（狀態不穩）×1 |
| `GY_P_GUANLU_YOUBI` | palace | natal | career、promotion、general、wealth | verified | 可用 | CIT_GY_P_GUANLU_YOUBI | 右弼在官祿與紫府昌曲同：財官雙美。 | 長期而言在承擔職務、被看見上較有發揮；長期而言在累積與管理資源上較有發揮 | aptitudeResponsibility（適合承擔責任）×2、aptitudeResources（擅長經營資源）×2 |
| `GY_P_GUANLU_YOUBI_SHA` | palace | natal | career、jobChange | verified | 可用 | CIT_GY_P_GUANLU_YOUBI_SHA | 右弼在官祿見羊陀火鈴空劫：亦有黜降。 | 職涯起伏、進退較多 | instability（狀態不穩）×1 |
| `GY_P_GUANLU_LUCUN` | palace | natal | career、general、wealth | verified | 可用 | CIT_GY_P_GUANLU_LUCUN | 祿存在官祿會吉：財官雙美。 | 職涯選擇面較廣、適合承擔職務；長期而言在累積與管理資源上較有發揮 | aptitudeResponsibility（適合承擔責任）×1、aptitudeResources（擅長經營資源）×2 |
| `GY_P_GUANLU_QINGYANG` | palace | natal | career、promotion | verified | 可用 | CIT_GY_P_GUANLU_QINGYANG | 擎羊在官祿入廟：利武職，同吉星權貴；落陷虛名。 | 長期而言在承擔職務、被看見上較有發揮 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_P_GUANLU_TUOLUO` | palace | natal | general、career | verified | 可用 | CIT_GY_P_GUANLU_TUOLUO | 陀羅在官祿：平常；加吉星也只是虛名。 | 名義與實質可能落差較大，宜重實質內容 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_GUANLU_HUOXING` | palace | natal | career、jobChange | verified | 可用 | CIT_GY_P_GUANLU_HUOXING | 火星在官祿：早年成敗、晚年功名遂心。 | 職涯起伏、進退較多 | instability（狀態不穩）×1 |
| `GY_P_GUANLU_LINGXING` | palace | natal | career、promotion | verified | 可用 | CIT_GY_P_GUANLU_LINGXING | 鈴星在官祿旺宮吉，加吉星權貴。 | 長期而言在承擔職務、被看見上較有發揮 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_P_GUANLU_DOUJUN` | palace | natal | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_P_GUANLU_DOUJUN | 斗君（流月）遇吉財官旺（本 App 沒有斗君）。 |  | — |
| `GY_P_GUANLU_DING_GONGQING` | palace | natal | career、promotion | verified | 可用 | CIT_GY_P_GUANLU_DING_GONGQING | 定公卿：左右與紫微同在官祿（無空亡惡殺）：高官。 | 長期而言在承擔職務、被看見上較有發揮 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_P_GUANLU_DING_WENGUAN` | palace | natal | career、general、exam | verified | 可用 | CIT_GY_P_GUANLU_DING_WENGUAN | 定文官：文昌、文曲在官祿：利文職。 | 職涯選擇面較廣、適合承擔職務；長期而言學習與思考較有發揮 | aptitudeResponsibility（適合承擔責任）×1、aptitudeStudy（重思考學習）×1 |
| `GY_P_GUANLU_DING_WUGUAN` | palace | natal | career、promotion | verified | 可用 | CIT_GY_P_GUANLU_DING_WUGUAN | 定武官：武曲在官祿，紫微、化權與左右拱照：武職顯達。 | 長期而言在承擔職務、被看見上較有發揮 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_P_GUANLU_DING_CAOLI` | palace | natal | career | verified | 可用 | CIT_GY_P_GUANLU_DING_CAOLI | 定曹吏：太陽在官祿（陽宮光輝）又逢紫微與左右：以吏職發揮。 | 職涯選擇面較廣、適合承擔職務 | aptitudeResponsibility（適合承擔責任）×1 |
| `GY_P_TIANZHAI_ZIWEI` | palace | natal | property | verified | 可用 | CIT_GY_P_TIANZHAI_ZIWEI | 紫微在田宅：茂盛、自置旺相。 | 長期而言在置產、經營居所上較有發揮 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_TIANZHAI_ZIWEI_SHA` | palace | natal | property | verified | 可用 | CIT_GY_P_TIANZHAI_ZIWEI_SHA | 紫微在田宅加羊陀火鈴空劫：有置有去。 | 居所與不動產的變動較多 | instability（狀態不穩）×1 |
| `GY_P_TIANZHAI_TIANJI` | palace | natal | property | verified | 可用 | CIT_GY_P_TIANZHAI_TIANJI | 天機在田宅：離開舊產、另行創置。 | 居所與不動產的變動較多 | instability（狀態不穩）×1 |
| `GY_P_TIANZHAI_TIANJI_TAIYIN` | palace | natal | property | verified | 可用 | CIT_GY_P_TIANZHAI_TIANJI_TAIYIN | 天機太陰同在田宅：自置旺相。 | 長期而言在置產、經營居所上較有發揮 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_TIANZHAI_TAIYANG` | palace | natal | property | verified | 可用 | CIT_GY_P_TIANZHAI_TAIYANG | 太陽在田宅入廟：得祖業，初旺末平。 | 長期而言在置產、經營居所上較有發揮 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_TIANZHAI_WUQU` | palace | natal | property | verified | 可用 | CIT_GY_P_TIANZHAI_WUQU | 武曲單居田宅旺地：得大業；落陷先退後成。 | 長期而言在置產、經營居所上較有發揮 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_TIANZHAI_WUQU_POJUN` | palace | natal | property、general、career、wealth、decision | verified | 可用 | CIT_GY_P_TIANZHAI_WUQU_POJUN | 武曲破軍同在田宅：易破耗、不耐久。 | 居所與不動產的變動較多；成果不容易持久，需要定期檢視、及早鞏固 | instability（狀態不穩）×1、weakeningTrend（後段吃力）×1 |
| `GY_P_TIANZHAI_TIANTONG` | palace | natal | property | verified | 可用 | CIT_GY_P_TIANZHAI_TIANTONG | 天同在田宅：先少後多、自置甚旺。 | 長期而言在置產、經營居所上較有發揮 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_TIANZHAI_LIANZHEN` | palace | natal | property | verified | 可用 | CIT_GY_P_TIANZHAI_LIANZHEN | 廉貞在田宅：難守舊產。 | 居所與不動產的變動較多 | instability（狀態不穩）×1 |
| `GY_P_TIANZHAI_TIANFU` | palace | natal | property | verified | 可用 | CIT_GY_P_TIANZHAI_TIANFU | 天府在田宅：田園茂盛、守祖自置旺相。 | 長期而言在置產、經營居所上較有發揮 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_TIANZHAI_TIANFU_SHA` | palace | natal | property | verified | 可用 | CIT_GY_P_TIANZHAI_TIANFU_SHA | 天府在田宅見羊陀火鈴空劫：更少、有成敗。 | 居所與不動產的變動較多 | instability（狀態不穩）×1 |
| `GY_P_TIANZHAI_TAIYIN` | palace | natal | property | verified | 可用 | CIT_GY_P_TIANZHAI_TAIYIN | 太陰在田宅入廟：田多。 | 長期而言在置產、經營居所上較有發揮 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_TIANZHAI_TAIYIN_XIAN` | palace | natal | property | verified | 可用 | CIT_GY_P_TIANZHAI_TAIYIN_XIAN | 太陰在田宅落陷加忌或煞：難守產。 | 居所與不動產的變動較多 | instability（狀態不穩）×1 |
| `GY_P_TIANZHAI_TANLANG` | palace | natal | property | verified | 可用 | CIT_GY_P_TIANZHAI_TANLANG | 貪狼在田宅落陷：田少。 | 居所與不動產的變動較多 | instability（狀態不穩）×1 |
| `GY_P_TIANZHAI_JUMEN` | palace | natal | property | verified | 可用 | CIT_GY_P_TIANZHAI_JUMEN | 巨門在田宅廟旺：橫發置買；落陷因田產招是非。 | 長期而言在置產、經營居所上較有發揮 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_TIANZHAI_JUMEN_XIAN` | palace | natal | property | verified | 可用 | CIT_GY_P_TIANZHAI_JUMEN_XIAN | 巨門在田宅落陷：因田產招是非。 | 居所與不動產的變動較多 | instability（狀態不穩）×1 |
| `GY_P_TIANZHAI_TIANXIANG` | palace | natal | property | verified | 可用 | CIT_GY_P_TIANZHAI_TIANXIANG | 天相在田宅廟旺：有分。 | 長期而言在置產、經營居所上較有發揮 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_TIANZHAI_TIANLIANG` | palace | natal | property | verified | 可用 | CIT_GY_P_TIANZHAI_TIANLIANG | 天梁在田宅入廟：有祖業。 | 長期而言在置產、經營居所上較有發揮 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_TIANZHAI_POJUN` | palace | natal | property | verified | 可用 | CIT_GY_P_TIANZHAI_POJUN | 破軍在田宅子午宮：守祖業。 | 長期而言在置產、經營居所上較有發揮 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_TIANZHAI_POJUN_SHA` | palace | natal | property | verified | 可用 | CIT_GY_P_TIANZHAI_POJUN_SHA | 破軍在田宅加羊陀火鈴：退祖田少。 | 居所與不動產的變動較多 | instability（狀態不穩）×1 |
| `GY_P_TIANZHAI_WENQU` | palace | natal | property | verified | 可用 | CIT_GY_P_TIANZHAI_WENQU | 文曲在田宅旺地：有分；遇羊陀火鈴空劫有進有退。 | 長期而言在置產、經營居所上較有發揮 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_TIANZHAI_ZUOFU` | palace | natal | property | verified | 可用 | CIT_GY_P_TIANZHAI_ZUOFU | 左輔在田宅：有祖業；加羊陀火鈴空劫則少。 | 長期而言在置產、經營居所上較有發揮 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_TIANZHAI_LUCUN` | palace | natal | property | verified | 可用 | CIT_GY_P_TIANZHAI_LUCUN | 祿存在田宅：田園多、自置旺。 | 長期而言在置產、經營居所上較有發揮 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_TIANZHAI_QINGYANG` | palace | natal | property | verified | 可用 | CIT_GY_P_TIANZHAI_QINGYANG | 擎羊在田宅入廟：先破後成。 | 居所與不動產的變動較多 | instability（狀態不穩）×1 |
| `GY_P_TIANZHAI_TUOLUO` | palace | natal | property | verified | 可用 | CIT_GY_P_TIANZHAI_TUOLUO | 陀羅在田宅：退祖、辛勤。 | 居所與不動產的變動較多 | instability（狀態不穩）×1 |
| `GY_P_TIANZHAI_HUOXING` | palace | natal | property | verified | 可用 | CIT_GY_P_TIANZHAI_HUOXING | 火星獨守田宅：退祖業。 | 居所與不動產的變動較多 | instability（狀態不穩）×1 |
| `GY_P_TIANZHAI_LINGXING` | palace | natal | property | verified | 可用 | CIT_GY_P_TIANZHAI_LINGXING | 鈴星在田宅：退祖；入廟加吉星自有置。 | 長期而言在置產、經營居所上較有發揮 | aptitudeResources（擅長經營資源）×1 |
| `GY_P_TIANZHAI_DOUJUN` | palace | natal | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_P_TIANZHAI_DOUJUN | 斗君過度田宅（本 App 沒有斗君）。 |  | — |
| `GY_P_FUDE_ZIWEI` | palace | natal | general、health | verified | 可用 | CIT_GY_P_FUDE_ZIWEI | 紫微在福德：福厚安樂。 | 心境較容易安穩、能享受生活 | energySupport（精神體力較好）×1 |
| `GY_P_FUDE_ZIWEI_POJUN` | palace | natal | general、health | verified | 可用 | CIT_GY_P_FUDE_ZIWEI_POJUN | 紫微破軍同在福德：勞心費力。 | 較容易操心、身心負荷偏重 | stressLoad（身心壓力）×1 |
| `GY_P_FUDE_ZIWEI_SHA` | palace | natal | general、health | verified | 可用 | CIT_GY_P_FUDE_ZIWEI_SHA | 紫微在福德加羊陀火鈴空劫：福薄。 | 較容易操心、身心負荷偏重 | stressLoad（身心壓力）×1 |
| `GY_P_FUDE_TIANJI` | palace | natal | general、health | verified | 可用 | CIT_GY_P_FUDE_TIANJI | 天機在福德：先勞後逸。 | 較容易操心、身心負荷偏重 | stressLoad（身心壓力）×1 |
| `GY_P_FUDE_TIANJI_SHA` | palace | natal | general、health | verified | 可用 | CIT_GY_P_FUDE_TIANJI_SHA | 天機在福德加羊陀火鈴空劫：奔走不得寧靜。 | 較容易操心、身心負荷偏重 | stressLoad（身心壓力）×1 |
| `GY_P_FUDE_TAIYANG` | palace | natal | general、health | verified | 可用 | CIT_GY_P_FUDE_TAIYANG | 太陽在福德：忙中發福。 | 心境較容易安穩、能享受生活 | energySupport（精神體力較好）×1 |
| `GY_P_FUDE_WUQU` | palace | natal | general、health | verified | 可用 | CIT_GY_P_FUDE_WUQU | 武曲在福德：勞心費力；入廟安然享福。 | 心境較容易安穩、能享受生活 | energySupport（精神體力較好）×1 |
| `GY_P_FUDE_WUQU_NOTMIAO` | palace | natal | general、health | verified | 可用 | CIT_GY_P_FUDE_WUQU_NOTMIAO | 武曲在福德（不入廟）：勞心費力。 | 較容易操心、身心負荷偏重 | stressLoad（身心壓力）×1 |
| `GY_P_FUDE_TIANTONG` | palace | natal | general、health | verified | 可用 | CIT_GY_P_FUDE_TIANTONG | 天同在福德：快樂有福。 | 心境較容易安穩、能享受生活 | energySupport（精神體力較好）×1 |
| `GY_P_FUDE_TIANTONG_JUMEN` | palace | natal | general、health | verified | 可用 | CIT_GY_P_FUDE_TIANTONG_JUMEN | 天同巨門同在福德：多憂少喜。 | 較容易操心、身心負荷偏重 | stressLoad（身心壓力）×1 |
| `GY_P_FUDE_LIANZHEN` | palace | natal | general、health | verified | 可用 | CIT_GY_P_FUDE_LIANZHEN | 廉貞獨守福德：忙中生福。 | 心境較容易安穩、能享受生活 | energySupport（精神體力較好）×1 |
| `GY_P_FUDE_LIANZHEN_POJUN` | palace | natal | general、health | verified | 可用 | CIT_GY_P_FUDE_LIANZHEN_POJUN | 廉貞破軍同在福德：勞心費力。 | 較容易操心、身心負荷偏重 | stressLoad（身心壓力）×1 |
| `GY_P_FUDE_TIANFU` | palace | natal | general、health | verified | 可用 | CIT_GY_P_FUDE_TIANFU | 天府在福德：安靜享福。 | 心境較容易安穩、能享受生活 | energySupport（精神體力較好）×1 |
| `GY_P_FUDE_TIANFU_SHA` | palace | natal | general、health | verified | 可用 | CIT_GY_P_FUDE_TIANFU_SHA | 天府在福德加羊陀火鈴空劫：勞苦。 | 較容易操心、身心負荷偏重 | stressLoad（身心壓力）×1 |
| `GY_P_FUDE_TANLANG` | palace | natal | general、health | verified | 可用 | CIT_GY_P_FUDE_TANLANG | 貪狼在福德：勞心不安。 | 較容易操心、身心負荷偏重 | stressLoad（身心壓力）×1 |
| `GY_P_FUDE_JUMEN` | palace | natal | general、health | verified | 可用 | CIT_GY_P_FUDE_JUMEN | 巨門在福德：勞力不安。 | 較容易操心、身心負荷偏重 | stressLoad（身心壓力）×1 |
| `GY_P_FUDE_TIANXIANG` | palace | natal | general、health | verified | 可用 | CIT_GY_P_FUDE_TIANXIANG | 天相在福德：安逸享福。 | 心境較容易安穩、能享受生活 | energySupport（精神體力較好）×1 |
| `GY_P_FUDE_TIANXIANG_SHA` | palace | natal | general、health | verified | 可用 | CIT_GY_P_FUDE_TIANXIANG_SHA | 天相在福德加羊陀火鈴空劫：心不得靜。 | 較容易操心、身心負荷偏重 | stressLoad（身心壓力）×1 |
| `GY_P_FUDE_QISHA` | palace | natal | general、health | verified | 可用 | CIT_GY_P_FUDE_QISHA | 七殺在福德：入廟享福；落陷加煞勞心費力。 | 心境較容易安穩、能享受生活 | energySupport（精神體力較好）×1 |
| `GY_P_FUDE_QISHA_XIAN` | palace | natal | general、health | verified | 可用 | CIT_GY_P_FUDE_QISHA_XIAN | 七殺在福德落陷加煞：勞心費力。 | 較容易操心、身心負荷偏重 | stressLoad（身心壓力）×1 |
| `GY_P_FUDE_POJUN` | palace | natal | general、health | verified | 可用 | CIT_GY_P_FUDE_POJUN | 破軍在福德：勞心費力。 | 較容易操心、身心負荷偏重 | stressLoad（身心壓力）×1 |
| `GY_P_FUDE_WENCHANG` | palace | natal | general、health | verified | 可用 | CIT_GY_P_FUDE_WENCHANG | 文昌在福德入廟加吉星：享福快樂。 | 心境較容易安穩、能享受生活 | energySupport（精神體力較好）×1 |
| `GY_P_FUDE_WENCHANG_XIAN` | palace | natal | general、health | verified | 可用 | CIT_GY_P_FUDE_WENCHANG_XIAN | 文昌在福德落陷遇煞：身心不得安靜。 | 較容易操心、身心負荷偏重 | stressLoad（身心壓力）×1 |
| `GY_P_FUDE_ZUOFU` | palace | natal | general、health | verified | 可用 | CIT_GY_P_FUDE_ZUOFU | 左輔在福德加吉星：享福。 | 心境較容易安穩、能享受生活 | energySupport（精神體力較好）×1 |
| `GY_P_FUDE_YOUBI` | palace | natal | general、health | verified | 可用 | CIT_GY_P_FUDE_YOUBI | 右弼在福德：福祿全美。 | 心境較容易安穩、能享受生活 | energySupport（精神體力較好）×1 |
| `GY_P_FUDE_LUCUN` | palace | natal | general、health | verified | 可用 | CIT_GY_P_FUDE_LUCUN | 祿存在福德：終身福厚安靜。 | 心境較容易安穩、能享受生活 | energySupport（精神體力較好）×1 |
| `GY_P_FUDE_LUCUN_SHA` | palace | natal | general、health | verified | 可用 | CIT_GY_P_FUDE_LUCUN_SHA | 祿存在福德見羊陀火鈴空劫：身心不得寧靜。 | 較容易操心、身心負荷偏重 | stressLoad（身心壓力）×1 |
| `GY_P_FUDE_KUIYUE` | palace | natal | general、health | verified | 可用 | CIT_GY_P_FUDE_KUIYUE | 魁鉞在福德：有貴人為伴、享福快樂。 | 心境較容易安穩、能享受生活 | energySupport（精神體力較好）×1 |
| `GY_P_FUDE_QINGYANG` | palace | natal | general、health | verified | 可用 | CIT_GY_P_FUDE_QINGYANG | 擎羊在福德入廟：動中有福。 | 心境較容易安穩、能享受生活 | energySupport（精神體力較好）×1 |
| `GY_P_FUDE_QINGYANG_DU` | palace | natal | general、health | verified | 可用 | CIT_GY_P_FUDE_QINGYANG_DU | 擎羊獨守福德：身心不安。 | 較容易操心、身心負荷偏重 | stressLoad（身心壓力）×1 |
| `GY_P_FUDE_TUOLUO` | palace | natal | general、health | verified | 可用 | CIT_GY_P_FUDE_TUOLUO | 陀羅獨守福德：辛勤。 | 較容易操心、身心負荷偏重 | stressLoad（身心壓力）×1 |
| `GY_P_FUDE_HUOXING` | palace | natal | general、health | verified | 可用 | CIT_GY_P_FUDE_HUOXING | 火星在福德：欠安、勞力辛勤。 | 較容易操心、身心負荷偏重 | stressLoad（身心壓力）×1 |
| `GY_P_FUDE_LINGXING` | palace | natal | general、health | verified | 可用 | CIT_GY_P_FUDE_LINGXING | 鈴星在福德：勞苦。 | 較容易操心、身心負荷偏重 | stressLoad（身心壓力）×1 |
| `GY_P_FUDE_DOUJUN` | palace | natal | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_P_FUDE_DOUJUN | 斗君遇吉其年安靜（本 App 沒有斗君）。 |  | — |
| `GY_P_FUDE_SUIJUN` | palace | natal | general | verified | 未啟用：古文沒有足夠成立條件 | CIT_GY_P_FUDE_SUIJUN | 歲君與大小二限過福德：逢吉享福、逢凶勞力（未說明星曜條件）。 |  | — |
| `GY_P_FUQI_ZIWEI` | palace | natal | relationship、marriage | verified | 可用 | CIT_GY_P_FUQI_ZIWEI | 紫微在夫妻：晚婚、偕老（原文另有性剛等描述）。 | 伴侶互動較溫和 | relationshipWarmth（互動有溫度）×1 |
| `GY_P_FUQI_ZIWEI_TIANFU` | palace | natal | relationship、marriage | verified | 可用 | CIT_GY_P_FUQI_ZIWEI_TIANFU | 紫微天府同在夫妻：偕老。 | 伴侶互動較溫和 | relationshipWarmth（互動有溫度）×1 |
| `GY_P_FUQI_TAIYIN_TIANJI` | palace | natal | relationship、marriage | verified | 可用 | CIT_GY_P_FUQI_TAIYIN_TIANJI | 天機太陰同在夫妻：內助美好。 | 伴侶互動較溫和 | relationshipWarmth（互動有溫度）×1 |
| `GY_P_FUQI_TAIYANG_TIANLIANG` | palace | natal | relationship、marriage | verified | 可用 | CIT_GY_P_FUQI_TAIYANG_TIANLIANG | 太陽天梁同在夫妻又加左右：伴侶賢明。 | 伴侶互動較溫和 | relationshipWarmth（互動有溫度）×1 |
| `GY_P_FUQI_TIANTONG` | palace | natal | relationship、marriage | verified | 可用 | CIT_GY_P_FUQI_TIANTONG | 天同在夫妻：遲婚偕老。 | 伴侶互動較溫和 | relationshipWarmth（互動有溫度）×1 |
| `GY_P_FUQI_TIANTONG_SHA` | palace | natal | relationship、marriage | verified | 可用 | CIT_GY_P_FUQI_TIANTONG_SHA | 天同在夫妻加四煞：欠和（原文另有生離之說，不採用）。 | 伴侶互動較容易有摩擦，需要多溝通 | communicationConflictRisk（容易起口角）×1 |
| `GY_P_FUQI_TIANTONG_TIANLIANG` | palace | natal | relationship、marriage | verified | 可用 | CIT_GY_P_FUQI_TIANTONG_TIANLIANG | 天同天梁同在夫妻：夫婦極美。 | 伴侶互動較溫和 | relationshipWarmth（互動有溫度）×1 |
| `GY_P_FUQI_LIANZHEN_QISHA` | palace | natal | relationship、marriage | verified | 可用 | CIT_GY_P_FUQI_LIANZHEN_QISHA | 廉貞七殺同在夫妻：欠和（刑剋之說不採用）。 | 伴侶互動較容易有摩擦，需要多溝通 | communicationConflictRisk（容易起口角）×1 |
| `GY_P_FUQI_TIANFU` | palace | natal | relationship、marriage | verified | 可用 | CIT_GY_P_FUQI_TIANFU | 天府在夫妻：偕老。 | 伴侶互動較溫和 | relationshipWarmth（互動有溫度）×1 |
| `GY_P_FUQI_TAIYIN` | palace | natal | relationship、marriage | verified | 可用 | CIT_GY_P_FUQI_TAIYIN | 太陰在夫妻入廟：夫婦美好，加昌曲極美。 | 伴侶互動較溫和 | relationshipWarmth（互動有溫度）×1 |
| `GY_P_FUQI_TIANXIANG_ZIWEI` | palace | natal | relationship、marriage | verified | 可用 | CIT_GY_P_FUQI_TIANXIANG_ZIWEI | 天相紫微同在夫妻：偕老。 | 伴侶互動較溫和 | relationshipWarmth（互動有溫度）×1 |
| `GY_P_FUQI_TIANXIANG_WUQU` | palace | natal | relationship、marriage | verified | 可用 | CIT_GY_P_FUQI_TIANXIANG_WUQU | 天相武曲同在夫妻：少和。 | 伴侶互動較容易有摩擦，需要多溝通 | communicationConflictRisk（容易起口角）×1 |
| `GY_P_FUQI_TIANLIANG_TIANTONG` | palace | natal | relationship、marriage | verified | 可用 | CIT_GY_P_FUQI_TIANLIANG_TIANTONG | 天梁天同同在夫妻：和氣。 | 伴侶互動較溫和 | relationshipWarmth（互動有溫度）×1 |
| `GY_P_FUQI_TIANLIANG_SHA` | palace | natal | relationship、marriage | verified | 可用 | CIT_GY_P_FUQI_TIANLIANG_SHA | 天梁在夫妻加羊陀火鈴空劫：不和順。 | 伴侶互動較容易有摩擦，需要多溝通 | communicationConflictRisk（容易起口角）×1 |
| `GY_P_FUQI_POJUN_LIANZHEN` | palace | natal | relationship、marriage | verified | 可用 | CIT_GY_P_FUQI_POJUN_LIANZHEN | 破軍廉貞同在夫妻：欠和（刑剋之說不採用）。 | 伴侶互動較容易有摩擦，需要多溝通 | communicationConflictRisk（容易起口角）×1 |
| `GY_P_FUQI_WENQU` | palace | natal | relationship、marriage | verified | 可用 | CIT_GY_P_FUQI_WENQU | 文曲在夫妻會太陰與吉星：偕老。 | 伴侶互動較溫和 | relationshipWarmth（互動有溫度）×1 |
| `GY_P_FUQI_FUBI` | palace | natal | relationship、marriage | verified | 可用 | CIT_GY_P_FUQI_FUBI | 左輔、右弼在夫妻：偕老。 | 伴侶互動較溫和 | relationshipWarmth（互動有溫度）×1 |
| `GY_P_FUQI_KUIYUE` | palace | natal | relationship、marriage | verified | 可用 | CIT_GY_P_FUQI_KUIYUE | 天魁天鉞在夫妻：夫婦美好。 | 伴侶互動較溫和 | relationshipWarmth（互動有溫度）×1 |
| `GY_P_FUQI_DOUJUN` | palace | natal | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_P_FUQI_DOUJUN | 斗君過度夫妻宮（本 App 沒有斗君）。 |  | — |
| `GY_P_XIONGDI_H1` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_XIONGDI_H1 | 二兄弟宮紫微條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_XIONGDI_H2` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_XIONGDI_H2 | 二兄弟宮天機條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_XIONGDI_H3` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_XIONGDI_H3 | 二兄弟宮太陽條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_XIONGDI_H4` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_XIONGDI_H4 | 二兄弟宮武曲條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_XIONGDI_H5` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_XIONGDI_H5 | 二兄弟宮天同條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_XIONGDI_H6` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_XIONGDI_H6 | 二兄弟宮廉貞條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_XIONGDI_H7` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_XIONGDI_H7 | 二兄弟宮天府條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_XIONGDI_H8` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_XIONGDI_H8 | 二兄弟宮太陰條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_XIONGDI_H9` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_XIONGDI_H9 | 二兄弟宮貪狼條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_XIONGDI_H10` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_XIONGDI_H10 | 二兄弟宮巨門條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_XIONGDI_H11` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_XIONGDI_H11 | 二兄弟宮天相條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_XIONGDI_H12` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_XIONGDI_H12 | 二兄弟宮天梁條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_XIONGDI_H13` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_XIONGDI_H13 | 二兄弟宮七殺條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_XIONGDI_H14` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_XIONGDI_H14 | 二兄弟宮紫微條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_XIONGDI_H15` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_XIONGDI_H15 | 二兄弟宮左輔條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_XIONGDI_H16` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_XIONGDI_H16 | 二兄弟宮右弼條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_XIONGDI_H17` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_XIONGDI_H17 | 二兄弟宮祿存條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_XIONGDI_H18` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_XIONGDI_H18 | 二兄弟宮羊陀條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_XIONGDI_H19` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_XIONGDI_H19 | 二兄弟宮火星條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_XIONGDI_H20` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_XIONGDI_H20 | 二兄弟宮鈴星條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_XIONGDI_H21` | palace | natal | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_P_XIONGDI_H21 | 斗君（流月）過此宮之吉凶；本 App 客觀排盤沒有斗君。 |  | — |
| `GY_P_FUQI_H1` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUQI_H1 | 三妻妾宮紫微條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUQI_H2` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUQI_H2 | 三妻妾宮天機條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUQI_H3` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUQI_H3 | 三妻妾宮太陽條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUQI_H4` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUQI_H4 | 三妻妾宮武曲條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUQI_H5` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUQI_H5 | 三妻妾宮天同條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUQI_H6` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUQI_H6 | 三妻妾宮廉貞條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUQI_H7` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUQI_H7 | 三妻妾宮太陽條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUQI_H8` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUQI_H8 | 三妻妾宮太陰條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUQI_H9` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUQI_H9 | 三妻妾宮貪狼條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUQI_H10` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUQI_H10 | 三妻妾宮天相條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUQI_H11` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUQI_H11 | 三妻妾宮天梁條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUQI_H12` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUQI_H12 | 三妻妾宮七殺條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUQI_H13` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUQI_H13 | 三妻妾宮破軍條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUQI_H14` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUQI_H14 | 三妻妾宮文昌條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUQI_H15` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUQI_H15 | 三妻妾宮文曲條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUQI_H16` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUQI_H16 | 三妻妾宮祿存條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUQI_H17` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUQI_H17 | 三妻妾宮左輔條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUQI_H18` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUQI_H18 | 三妻妾宮火鈴星條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUQI_H19` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUQI_H19 | 三妻妾宮天魁條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUQI_H20` | palace | natal | general | pendingVerification | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_P_FUQI_H20 | 斗君（流月）過此宮之吉凶；本 App 客觀排盤沒有斗君。 |  | — |
| `GY_P_ZINV_H1` | palace | natal | general | pendingVerification | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_ZINV_H1 | 四子女宮天機條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_ZINV_H2` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_ZINV_H2 | 四子女宮太陽條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_ZINV_H3` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_ZINV_H3 | 四子女宮廉貞條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_ZINV_H4` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_ZINV_H4 | 四子女宮天府條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_ZINV_H5` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_ZINV_H5 | 四子女宮太陰條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_ZINV_H6` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_ZINV_H6 | 四子女宮貪狼條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_ZINV_H7` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_ZINV_H7 | 四子女宮巨門條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_ZINV_H8` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_ZINV_H8 | 四子女宮天相條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_ZINV_H9` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_ZINV_H9 | 四子女宮羊陀條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_ZINV_H10` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_ZINV_H10 | 四子女宮天梁條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_ZINV_H11` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_ZINV_H11 | 四子女宮七殺條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_ZINV_H12` | palace | natal | general | pendingVerification | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_ZINV_H12 | 四子女宮破軍條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_ZINV_H13` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_ZINV_H13 | 四子女宮左輔條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_ZINV_H14` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_ZINV_H14 | 四子女宮右弼條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_ZINV_H15` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_ZINV_H15 | 四子女宮文昌條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_ZINV_H16` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_ZINV_H16 | 四子女宮文曲條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_ZINV_H17` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_ZINV_H17 | 四子女宮祿存條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_ZINV_H18` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_ZINV_H18 | 四子女宮羊陀條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_ZINV_H19` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_ZINV_H19 | 四子女宮火星條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_ZINV_H20` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_ZINV_H20 | 四子女宮鈴星條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_ZINV_H21` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_ZINV_H21 | 四子女宮魁鉞條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_ZINV_H22` | palace | natal | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_P_ZINV_H22 | 斗君（流月）過此宮之吉凶；本 App 客觀排盤沒有斗君。 |  | — |
| `GY_P_JIE_H1` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_JIE_H1 | 六疾厄宮紫微條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_JIE_H2` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_JIE_H2 | 六疾厄宮天機條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_JIE_H3` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_JIE_H3 | 六疾厄宮太陽條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_JIE_H4` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_JIE_H4 | 六疾厄宮武曲條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_JIE_H5` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_JIE_H5 | 六疾厄宮天同條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_JIE_H6` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_JIE_H6 | 六疾厄宮廉貞條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_JIE_H7` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_JIE_H7 | 六疾厄宮天府條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_JIE_H8` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_JIE_H8 | 六疾厄宮太陰條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_JIE_H9` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_JIE_H9 | 六疾厄宮巨門條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_JIE_H10` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_JIE_H10 | 六疾厄宮天相條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_JIE_H11` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_JIE_H11 | 六疾厄宮七殺條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_JIE_H12` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_JIE_H12 | 六疾厄宮文昌條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_JIE_H13` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_JIE_H13 | 六疾厄宮文曲條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_JIE_H14` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_JIE_H14 | 六疾厄宮左輔條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_JIE_H15` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_JIE_H15 | 六疾厄宮右弼條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_JIE_H16` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_JIE_H16 | 六疾厄宮祿存條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_JIE_H17` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_JIE_H17 | 六疾厄宮擎羊條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_JIE_H18` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_JIE_H18 | 六疾厄宮陀羅條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_JIE_H19` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_JIE_H19 | 六疾厄宮羊鈴條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_JIE_H20` | palace | natal | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_P_JIE_H20 | 斗君（流月）過此宮之吉凶；本 App 客觀排盤沒有斗君。 |  | — |
| `GY_P_FUMU_H1` | palace | natal | general | pendingVerification | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUMU_H1 | 十二父母宮太陽條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUMU_H2` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUMU_H2 | 十二父母宮武曲條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUMU_H3` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUMU_H3 | 十二父母宮天同條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUMU_H4` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUMU_H4 | 十二父母宮廉貞條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUMU_H5` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUMU_H5 | 十二父母宮天府條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUMU_H6` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUMU_H6 | 十二父母宮太陰條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUMU_H7` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUMU_H7 | 十二父母宮貪狼條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUMU_H8` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUMU_H8 | 十二父母宮巨門條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUMU_H9` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUMU_H9 | 十二父母宮天相條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUMU_H10` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUMU_H10 | 十二父母宮天梁條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUMU_H11` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUMU_H11 | 十二父母宮七殺條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUMU_H12` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUMU_H12 | 十二父母宮破軍條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUMU_H13` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUMU_H13 | 十二父母宮文昌條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUMU_H14` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUMU_H14 | 十二父母宮文曲條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUMU_H15` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUMU_H15 | 十二父母宮左輔條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUMU_H16` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUMU_H16 | 十二父母宮右弼條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUMU_H17` | palace | natal | general | pendingVerification | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUMU_H17 | 十二父母宮祿存條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUMU_H18` | palace | natal | general | pendingVerification | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUMU_H18 | 十二父母宮擎羊條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUMU_H19` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUMU_H19 | 十二父母宮陀羅條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUMU_H20` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUMU_H20 | 十二父母宮火星條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUMU_H21` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUMU_H21 | 十二父母宮鈴星條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUMU_H22` | palace | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_P_FUMU_H22 | 十二父母宮魁鉞條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |  | — |
| `GY_P_FUMU_H23` | palace | natal | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_P_FUMU_H23 | 斗君（流月）過此宮之吉凶；本 App 客觀排盤沒有斗君。 |  | — |
| `GY_PAT_TAIYANG_WENCHANG_GUANLU` | combination | natal | career、promotion | verified | 可用 | CIT_GY_PAT_TAIYANG_WENCHANG_GUANLU | 太陽與文昌同在官祿宮（逢吉曜）：貴顯。 | 長期而言在承擔職務、被看見上較有發揮 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_PAT_LUCUN_TIANCAI` | combination | natal | wealth | verified | 可用 | CIT_GY_PAT_LUCUN_TIANCAI | 祿存守田宅或財帛：大富。 | 長期而言在累積資源上較有發揮 | aptitudeResources（擅長經營資源）×2 |
| `GY_PAT_CAIYIN_QIANYI` | combination | natal | travel、wealth | verified | 可用 | CIT_GY_PAT_CAIYIN_QIANYI | 武曲或天梁（其一化權）坐遷移：宜經商。 | 外出或異地發展較有收穫 | aptitudeResources（擅長經營資源）×1 |
| `GY_PAT_DUIMIAN_CHAODOU` | combination | natal | general、wealth | verified | 可用 | CIT_GY_PAT_DUIMIAN_CHAODOU | 命在子午，遷移（對面）有祿存：利祿、受人敬重。 | 長期而言在累積與管理資源上較有發揮 | aptitudeResources（擅長經營資源）×2 |
| `GY_PAT_KEQUANLU` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_PAT_KEQUANLU | 化祿、化權在命：貴顯。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_PAT_ZUOYOU_CHAOYUAN` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_PAT_ZUOYOU_CHAOYUAN | 左輔、右弼在命宮三方，又有祿：興旺。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_PAT_JIANWENWU` | combination | natal | general、career、promotion、exam | verified | 可用 | CIT_GY_PAT_JIANWENWU | 文曲、武曲在命宮（命宮無煞破）：文武兼備、百事通達。 | 長期而言較有機會承擔職位、被看見；長期而言學習與思考較有發揮 | aptitudeResponsibility（適合承擔責任）×2、aptitudeStudy（重思考學習）×1 |
| `GY_PAT_WENXING_CHAOMING` | combination | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_PAT_WENXING_CHAOMING | 文昌、文曲朝命（三方祥曜拱）：富貴。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_PAT_SHIZHONG_YINYU` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_PAT_SHIZHONG_YINYU | 巨門在子午坐命，三方有化科、化祿：貴。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_PAT_HUOTAN` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_PAT_HUOTAN | 貪狼遇火星於命宮三合（三方無凶煞）：富貴。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_PAT_SHANGGU_AN` | combination | natal | general、career | verified | 可用 | CIT_GY_PAT_SHANGGU_AN | 命有巨門、太陽、紫微、天府守照：為人安分耿直（非商賈之命）。 | 做事務實、按部就班 | executionClarity（做事踏實）×1 |
| `GY_PAT_SHANGGU` | combination | natal | wealth、career | verified | 可用 | CIT_GY_PAT_SHANGGU | 太陰、貪狼同殺忌會命：擅於謀利（原文另有「貪財無厭」的品格斷語，不採用）。 | 較有經商謀利的傾向 | aptitudeResources（擅長經營資源）×1 |
| `GY_PAT_SHUYI` | combination | natal | general、career、jobChange | verified | 可用 | CIT_GY_PAT_SHUYI | 命在四馬或四墓，貪狼、武曲在命又化忌加煞：宜細巧技藝。 | 長期而言適合以專業技能、手藝發揮 | aptitudeStudy（重思考學習）×1 |
| `GY_PAT_SENGDAO` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_PAT_SENGDAO | 僧道之命：出家斷語，只保留原文。 |  | — |
| `GY_PAT_GUKE` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_PAT_GUKE | 孤剋之命：孤剋斷語，只保留原文。 |  | — |
| `GY_PAT_SHAJUEDI` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_PAT_SHAJUEDI | 殺居絕地：夭壽斷語，只保留原文。 |  | — |
| `GY_PAT_HAOJULUWEI` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_PAT_HAOJULUWEI | 耗居祿位：貧賤斷語，只保留原文。 |  | — |
| `GY_PAT_HUITAN` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_PAT_HUITAN | 會貪旺宮：品格斷語，只保留原文。 |  | — |
| `GY_PAT_JIAN_JIE` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_PAT_JIAN_JIE | 忌暗同居：疾病斷語，只保留原文。 |  | — |
| `GY_PAT_XINGSHA_LIANZHEN` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_PAT_XINGSHA_LIANZHEN | 刑殺會廉貞於官祿：刑獄斷語，只保留原文。 |  | — |
| `GY_PAT_GUANFU_JIA` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_PAT_GUANFU_JIA | 官府夾刑殺：刑獄斷語，只保留原文。 |  | — |
| `GY_PAT_DING_CONGMING` | combination | natal | general、exam、career、jobChange | verified | 可用 | CIT_GY_PAT_DING_CONGMING | 文曲、天相、破軍在命：計策多；三方再會昌曲：巧藝有名。 | 長期而言學習與思考較有發揮；長期而言適合以專業技能、手藝發揮 | aptitudeStudy（重思考學習）×2 |
| `GY_PAT_DING_FUZU` | combination | natal | wealth | verified | 可用 | CIT_GY_PAT_DING_FUZU | 太陰入廟、財星入財帛，又不犯破耗凶星：富足。 | 長期而言在累積資源上較有發揮 | aptitudeResources（擅長經營資源）×2 |
| `GY_PAT_DING_PINJIAN` | combination | natal | general、career | verified | 可用 | CIT_GY_PAT_DING_PINJIAN | 命中無吉星，火忌羊陀侵四正，又會武曲廉貞巨門破軍：多困（原文「暴怒身貧」不直接顯示）。 | 推進時較容易卡住、需要更多準備 | executionResistance（推進有阻力）×1 |
| `GY_PAT_DING_DAOZEI` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_PAT_DING_DAOZEI | 定人作盜賊：品格斷語，只保留原文。 |  | — |
| `GY_PAT_DING_SHOUYAO` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_PAT_DING_SHOUYAO | 壽夭淫蕩：壽夭與品格斷語，只保留原文。 |  | — |
| `GY_PAT_DING_CANJI` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_PAT_DING_CANJI | 定人殘疾：疾病斷語，只保留原文。 |  | — |
| `GY_PAT_DING_POXIANG` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_PAT_DING_POXIANG | 定人破相：身體斷語，只保留原文。 |  | — |
| `GY_PAT_WUZHI` | combination | natal | career、promotion | verified | 可用 | CIT_GY_PAT_WUZHI | 武曲、七殺坐命廟旺，加化權祿及魁鉞拱照：武職。 | 長期而言在承擔職務、被看見上較有發揮 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_PAT_FUGUI_LUN` | combination | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_PAT_FUGUI_LUN | 紫府相、祿權科、日月、昌曲、左右、魁鉞守照：大富貴（本 App 取紫府日月其一在命且三方有左右昌曲魁鉞）。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_PAT_PINJIAN_LUN` | combination | natal | general、career | verified | 可用 | CIT_GY_PAT_PINJIAN_LUN | 羊陀、廉殺武破、空劫、化忌併犯三方四正且陷地：多困（「貧賤」不直接顯示）。 | 推進時較容易卡住、需要更多準備 | executionResistance（推進有阻力）×1 |
| `GY_PAT_XINGMING_LUN` | combination | natal | general | verified | 未啟用：古文沒有足夠成立條件 | CIT_GY_PAT_XINGMING_LUN | 刑名論：主星、煞星與「上吉湊合」的組合條件不明確，另有兩輪轉錄與補轉錄讀法不一。 |  | — |
| `GY_PAT_JIYAO_LUN` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_PAT_JIYAO_LUN | 疾夭論：疾病夭壽斷語，只保留原文。 |  | — |
| `GY_PAT_SENGDAO_LUN` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_PAT_SENGDAO_LUN | 僧道論：出家斷語，只保留原文。 |  | — |
| `GY_PAT_CONGMING_LUN` | combination | natal | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_PAT_CONGMING_LUN | 聰明論：條件含三台、八座，本 App 客觀排盤沒有這兩顆星。 |  | — |
| `GY_PAT_HEGE_ZI` | combination | natal | general | verified | 未啟用：古文沒有足夠成立條件 | CIT_GY_PAT_HEGE_ZI | 子宮得地合格：「貪狼殺陰星機梁相拱」所列星曜不可能同時在子宮三方成立，條件需另行考證。 |  | — |
| `GY_PAT_HEGE_CHOU` | combination | natal | general、wealth | verified | 可用 | CIT_GY_PAT_HEGE_CHOU | 命在丑宮，日月來朝（命無主星、對宮日月），丙戊年生：福祿饒。 | 長期而言在累積與管理資源上較有發揮 | aptitudeResources（擅長經營資源）×2 |
| `GY_PAT_HEGE_YIN` | combination | natal | general、wealth | verified | 可用 | CIT_GY_PAT_HEGE_YIN | 命在寅宮，巨門、太陽坐命：豐隆。 | 長期而言在累積與管理資源上較有發揮 | aptitudeResources（擅長經營資源）×2 |
| `GY_PAT_HEGE_MAO` | combination | natal | general、career、wealth | verified | 可用 | CIT_GY_PAT_HEGE_MAO | 命在卯宮，天機巨門（或武曲）坐命，辛乙年生：福氣隆。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_PAT_HEGE_SI` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_PAT_HEGE_SI | 命在巳宮，天機或天相坐命、紫府朝垣，戊辛壬丙年生：貴。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_PAT_HEGE_WEI` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_PAT_HEGE_WEI | 命在未宮，紫微、武曲、廉貞其一坐命，會日月巨門：貴。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_PAT_HEGE_SHEN` | combination | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_PAT_HEGE_SHEN | 命在申宮，紫微或廉貞、天梁坐命，會武曲巨門，甲庚癸年生：富貴。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_PAT_HEGE_YOU` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_PAT_HEGE_YOU | 命在酉宮，太陰坐命、巨日對沖，辛乙年生：貴格。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_PAT_HEGE_XU` | combination | natal | general、career | verified | 可用 | CIT_GY_PAT_HEGE_XU | 命在戌宮，對宮辰有紫微沖照：富而不貴、有虛名。 | 名義與實質可能落差較大，宜重實質內容 | aptitudeResources（擅長經營資源）×1 |
| `GY_PAT_HEGE_HAI` | combination | natal | general、wealth | verified | 可用 | CIT_GY_PAT_HEGE_HAI | 命在亥宮，太陰坐命：福祿隆。 | 長期而言在累積與管理資源上較有發揮 | aptitudeResources（擅長經營資源）×2 |
| `GY_PAT_HEGE_WU` | combination | natal | general | verified | 未啟用：原文有疑字（兩輪核讀與決議仍無法確定） | CIT_GY_PAT_HEGE_WU | 午宮得地合格：後半句（生年與結果）有疑字。 |  | — |
| `GY_PAT_HEGE_CHEN` | combination | natal | general | verified | 未啟用：原文有疑字（兩輪核讀與決議仍無法確定） | CIT_GY_PAT_HEGE_CHEN | 辰宮得地合格：「天府□地」有疑字。 |  | — |
| `GY_PAT_POGE_WU` | combination | natal | general、wealth、investment | verified | 可用 | CIT_GY_PAT_POGE_WU | 命在午宮，貪狼、巨門、太陰或文昌坐命又有擎羊三合沖：起伏大（「到老窮」不直接顯示）。 | 資源進出起伏較大 | financialVolatility（財務波動）×1 |
| `GY_PAT_POGE_CHOUZI` | combination | natal | general、career | verified | 可用 | CIT_GY_PAT_POGE_CHOUZI | 命在子午有天機，或在丑有巨門、鈴星而落陷：縱然化吉，富貴也不清盈。 | 推進時較容易卡住、需要更多準備 | executionResistance（推進有阻力）×1 |
| `GY_PAT_POGE_OTHER` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_PAT_POGE_OTHER | 其他失陷破格：寅、卯辰、巳、未、申酉、戌、亥各訣主要為貧賤、夭折、奴僕娼婢等斷語，只保留原文。 |  | — |
| `GY_PAT_DEDI_LUN` | combination | natal | general | verified | 未啟用：古文沒有足夠成立條件 | CIT_GY_PAT_DEDI_LUN | 十二宮諸星得地富貴論：歌訣逐宮列舉星名，未分條給出完整條件（與各星「X宮Y地」條目重複者已在卷二處理）。 |  | — |
| `GY_PAT_FU_CAIYINJIAYIN` | combination | natal | wealth | verified | 可用 | CIT_GY_PAT_FU_CAIYINJIAYIN | 天相守命，武曲、天梁左右來夾。 | 長期而言在累積資源上較有發揮 | aptitudeResources（擅長經營資源）×2 |
| `GY_PAT_FU_RIYUEJIACAI` | combination | natal | wealth | verified | 可用 | CIT_GY_PAT_FU_RIYUEJIACAI | 武曲守命，太陽、太陰左右來夾。 | 長期而言在累積資源上較有發揮 | aptitudeResources（擅長經營資源）×2 |
| `GY_PAT_FU_CAILUJIAMA` | combination | natal | wealth | verified | 可用 | CIT_GY_PAT_FU_CAILUJIAMA | 天馬守命，武曲、祿存左右來夾。 | 長期而言在累積資源上較有發揮 | aptitudeResources（擅長經營資源）×2 |
| `GY_PAT_FU_RIYUEZHAOBI` | combination | natal | property、wealth | verified | 可用 | CIT_GY_PAT_FU_RIYUEZHAOBI | 太陽、太陰同在田宅宮。 | 長期而言在置產、經營居所上較有發揮；長期而言資源與收入較能累積 | aptitudeResources（擅長經營資源）×2 |
| `GY_PAT_FU_JINCAN` | combination | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_PAT_FU_JINCAN | 太陽單守命宮在午。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_PAT_FU_YINYIN` | combination | natal | general | verified | 未啟用：原文有疑字（兩輪核讀與決議仍無法確定） | CIT_GY_PAT_FU_YINYIN | 陰印拱身：格名首字有疑字，且條件涉及身宮落田宅，暫列候選。 |  | — |
| `GY_PAT_GUI_RIYUEJIAMING` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_PAT_GUI_RIYUEJIAMING | 太陽、太陰夾命，本宮有吉星（空亡本 App 未排，未納入條件）。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_PAT_GUI_RICHU` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_PAT_GUI_RICHU | 太陽在卯宮守命或守官祿。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_PAT_GUI_YUELUO` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_PAT_GUI_YUELUO | 太陰在亥宮守命。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_PAT_GUI_YUESHENG` | combination | natal | general、career、promotion、property | verified | 可用 | CIT_GY_PAT_GUI_YUESHENG | 太陰在子宮守田宅。 | 長期而言較有機會承擔職位、被看見；長期而言在置產、經營居所上較有發揮 | aptitudeResponsibility（適合承擔責任）×2、aptitudeResources（擅長經營資源）×1 |
| `GY_PAT_GUI_FUBIGONGZHU` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_PAT_GUI_FUBIGONGZHU | 紫微守命，左輔、右弼來拱或來夾。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_PAT_GUI_JUNCHEN` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_PAT_GUI_JUNCHEN | 紫微與左輔、右弼同守命宮。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_PAT_GUI_CAIYINJIALU` | combination | natal | general、career、promotion、wealth | verified | 可用 | CIT_GY_PAT_GUI_CAIYINJIALU | 祿存守命，天梁、天相左右來夾。 | 長期而言較有機會承擔職位、被看見；長期而言在累積與管理資源上較有發揮 | aptitudeResponsibility（適合承擔責任）×2、aptitudeResources（擅長經營資源）×2 |
| `GY_PAT_GUI_LUMAPEIYIN` | combination | natal | general | verified | 未啟用：古文沒有足夠成立條件 | CIT_GY_PAT_GUI_LUMAPEIYIN | 祿馬佩印：「馬前」「印星」所指位置不明確。 |  | — |
| `GY_PAT_GUI_ZUOGUI` | combination | natal | general | verified | 未啟用：原文有疑字（兩輪核讀與決議仍無法確定） | CIT_GY_PAT_GUI_ZUOGUI | 坐貴向貴：註文有疑字。 |  | — |
| `GY_PAT_GUI_MATOU` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_PAT_GUI_MATOU | 天馬與擎羊同守命宮。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_PAT_GUI_XINGQIU` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_PAT_GUI_XINGQIU | 天刑、廉貞同臨命宮：武勇。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_PAT_GUI_TANHUO` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_PAT_GUI_TANHUO | 貪狼、火星同守命宮且廟旺。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_PAT_GUI_WUQUSHOUYUAN` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_PAT_GUI_WUQUSHOUYUAN | 武曲在卯宮守命。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_PAT_GUI_QUANLU` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_PAT_GUI_QUANLU | 化權、化祿同守命宮（星曜廟旺）。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_PAT_GUI_QINGYANG` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_PAT_GUI_QINGYANG | 擎羊在辰戌丑未守命，又遇吉星。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_PAT_GUI_JINYU` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_PAT_GUI_JINYU | 紫微守命，太陽、太陰前後來夾。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_PAT_GUI_SEEPRIOR_1` | combination | natal | general | verified | 未啟用：古文沒有足夠成立條件 | CIT_GY_PAT_GUI_SEEPRIOR_1 | 七殺朝斗：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 |  | — |
| `GY_PAT_GUI_SEEPRIOR_2` | combination | natal | general | verified | 未啟用：古文沒有足夠成立條件 | CIT_GY_PAT_GUI_SEEPRIOR_2 | 日月並明：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 |  | — |
| `GY_PAT_GUI_SEEPRIOR_3` | combination | natal | general | verified | 未啟用：古文沒有足夠成立條件 | CIT_GY_PAT_GUI_SEEPRIOR_3 | 明珠出海：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 |  | — |
| `GY_PAT_GUI_SEEPRIOR_4` | combination | natal | general | verified | 未啟用：古文沒有足夠成立條件 | CIT_GY_PAT_GUI_SEEPRIOR_4 | 日月同臨：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 |  | — |
| `GY_PAT_GUI_SEEPRIOR_5` | combination | natal | general | verified | 未啟用：古文沒有足夠成立條件 | CIT_GY_PAT_GUI_SEEPRIOR_5 | 科權祿拱：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 |  | — |
| `GY_PAT_GUI_SEEPRIOR_6` | combination | natal | general | verified | 未啟用：古文沒有足夠成立條件 | CIT_GY_PAT_GUI_SEEPRIOR_6 | 府相朝垣：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 |  | — |
| `GY_PAT_GUI_SEEPRIOR_7` | combination | natal | general | verified | 未啟用：古文沒有足夠成立條件 | CIT_GY_PAT_GUI_SEEPRIOR_7 | 紫府朝垣：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 |  | — |
| `GY_PAT_GUI_SEEPRIOR_8` | combination | natal | general | verified | 未啟用：古文沒有足夠成立條件 | CIT_GY_PAT_GUI_SEEPRIOR_8 | 文星暗拱：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 |  | — |
| `GY_PAT_GUI_SEEPRIOR_9` | combination | natal | general | verified | 未啟用：古文沒有足夠成立條件 | CIT_GY_PAT_GUI_SEEPRIOR_9 | 巨機居卯：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 |  | — |
| `GY_PAT_GUI_SEEPRIOR_10` | combination | natal | general | verified | 未啟用：古文沒有足夠成立條件 | CIT_GY_PAT_GUI_SEEPRIOR_10 | 明祿暗祿：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 |  | — |
| `GY_PAT_GUI_SEEPRIOR_11` | combination | natal | general | verified | 未啟用：古文沒有足夠成立條件 | CIT_GY_PAT_GUI_SEEPRIOR_11 | 科明祿暗：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 |  | — |
| `GY_PAT_PIN_SHENGBUFENGSHI` | combination | natal | general | verified | 未啟用：原文有疑字（兩輪核讀與決議仍無法確定） | CIT_GY_PAT_PIN_SHENGBUFENGSHI | 生不逢時：註文有疑字，且條件含空亡（本 App 未排）。 |  | — |
| `GY_PAT_PIN_LUFENGLIANGSHA` | combination | natal | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_PAT_PIN_LUFENGLIANGSHA | 祿逢兩殺：條件含空亡（旬空／截空），本 App 客觀排盤沒有。 |  | — |
| `GY_PAT_PIN_MALUO` | combination | natal | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_PAT_PIN_MALUO | 馬落空亡：條件含空亡，本 App 客觀排盤沒有。 |  | — |
| `GY_PAT_PIN_RIYUECANGHUI` | combination | natal | general、career | verified | 可用 | CIT_GY_PAT_PIN_RIYUECANGHUI | 太陽或太陰落陷（反背）在命，又逢巨門：多困（「貧賤」不直接顯示）。 | 推進時較容易卡住、需要更多準備 | executionResistance（推進有阻力）×1 |
| `GY_PAT_PIN_CAIYUQIUCHOU` | combination | natal | general | verified | 未啟用：原文有疑字（兩輪核讀與決議仍無法確定） | CIT_GY_PAT_PIN_CAIYUQIUCHOU | 財與囚仇：註文有疑字。 |  | — |
| `GY_PAT_PIN_YISHENGGUPIN` | combination | natal | general、career | verified | 可用 | CIT_GY_PAT_PIN_YISHENGGUPIN | 破軍守命落陷：多困（「孤貧」不直接顯示）。 | 推進時較容易卡住、需要更多準備 | executionResistance（推進有阻力）×1 |
| `GY_PAT_PIN_JUNZI` | combination | natal | general | verified | 未啟用：原文有疑字（兩輪核讀與決議仍無法確定） | CIT_GY_PAT_PIN_JUNZI | 君子在野：註文有疑字與缺字。 |  | — |
| `GY_PAT_PIN_LIANGZHONGHUAGAI` | combination | natal | general、career、wealth、decision | verified | 可用 | CIT_GY_PAT_PIN_LIANGZHONGHUAGAI | 祿存、化祿同坐命宮又遇地空地劫：成敗起伏。 | 起伏較大，有進有退 | instability（狀態不穩）×1 |
| `GY_PAT_ZA_FENGYUN` | combination | decade | general、wealth、career | verified | 可用 | CIT_GY_PAT_ZA_FENGYUN | 大限命宮逢祿（祿存或化祿）與天馬：好運際會。 | 這段時間資源與收入較容易增加；這段時間事情較容易推進 | resourceIncrease（有實際收穫）×1、progressOpportunity（推進機會）×1 |
| `GY_PAT_ZA_JINSHANG` | combination | natal | general | verified | 未啟用：古文沒有足夠成立條件 | CIT_GY_PAT_ZA_JINSHANG | 錦上添花：「限破惡星而行吉地」未指明星曜與宮位。 |  | — |
| `GY_PAT_ZA_LUSHUAI` | combination | natal | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_PAT_ZA_LUSHUAI | 祿衰馬困：條件含空亡。 |  | — |
| `GY_PAT_ZA_YIJIN` | combination | natal | general | verified | 未啟用：古文沒有足夠成立條件 | CIT_GY_PAT_ZA_YIJIN | 衣錦還鄉：「墓運」所指不明確。 |  | — |
| `GY_PAT_ZA_SHAOSUI` | combination | natal | general | verified | 未啟用：原文有疑字（兩輪核讀與決議仍無法確定） | CIT_GY_PAT_ZA_SHAOSUI | 少歲無衣：格名有疑字。 |  | — |
| `GY_PAT_ZA_SHUISHANG` | combination | natal | general | verified | 未啟用：古文沒有足夠成立條件 | CIT_GY_PAT_ZA_SHUISHANG | 水上駕星：只描述結果，沒有盤面條件。 |  | — |
| `GY_PAT_ZA_JIXIONG` | combination | natal | general | verified | 未啟用：古文沒有足夠成立條件 | CIT_GY_PAT_ZA_JIXIONG | 吉凶相伴：「限前」「限衰」未指明條件。 |  | — |
| `GY_PAT_ZA_KUMU` | combination | natal | general | verified | 未啟用：古文沒有足夠成立條件 | CIT_GY_PAT_ZA_KUMU | 枯木逢春：「命衰限好」沒有具體星曜條件。 |  | — |
| `GY_R_TANXING` | principle | natal | general | verified | 判讀原則：規範本命 → 大限 → 流年的分層，不單獨觸發 | CIT_GY_R_TANXING | 看命先看命主吉凶廟旺與化吉化忌，次看身主，三看遷移財帛官祿三方，四看福德。 |  | — |
| `GY_R_RUGE` | principle | natal | general | verified | 判讀原則：規範本命 → 大限 → 流年的分層，不單獨觸發 | CIT_GY_R_RUGE | 入格且廟旺、聚吉與科權祿守照為上上之命；不入廟但加吉化吉次之；入格而化凶，只以本命吉凶多寡論。入格不能單獨判吉。 |  | — |
| `GY_R_RUGE2` | principle | natal | general | verified | 判讀原則：規範本命 → 大限 → 流年的分層，不單獨觸發 | CIT_GY_R_RUGE2 | 若居陷地又加煞化忌為下格，不以入格論；入格而化凶，只以本命吉凶多寡斷之。 |  | — |
| `GY_R_GEXING` | principle | natal | general | verified | 判讀原則：規範本命 → 大限 → 流年的分層，不單獨觸發 | CIT_GY_R_GEXING | 三方四正皆吉星為上格，吉凶相半為中格；星格與數格高下相配，分九等。 |  | — |
| `GY_R_NANNV` | principle | natal | general | verified | 判讀原則：規範本命 → 大限 → 流年的分層，不單獨觸發 | CIT_GY_R_NANNV | 男命先看身命，次看財帛、官祿、遷移，都以廟旺為吉、落陷聚凶為凶（女命之論含性別角色斷語，只保留原文）。 |  | — |
| `GY_R_SHENGSHI_YANG` | combination | natal | general | verified | 可用 | CIT_GY_R_SHENGSHI_YANG | 生在六陽時（寅午戌申子辰）而命宮也在六陽宮：吉。 | 古籍評為相宜；本 App 只列出，不轉成生活因素 | — |
| `GY_R_SHENGSHI_YIN` | combination | natal | general | verified | 可用 | CIT_GY_R_SHENGSHI_YIN | 生在六陰時（巳酉丑亥卯未）而命宮也在六陰宮：吉。 | 古籍評為相宜；本 App 只列出，不轉成生活因素 | — |
| `GY_R_SHENGSHI_FAN` | combination | natal | general、career | verified | 可用 | CIT_GY_R_SHENGSHI_FAN | 時辰陰陽與命宮陰陽相反：較少順遂。 | 推進時較容易卡住、需要更多準備 | executionResistance（推進有阻力）×1 |
| `GY_R_SHENGSHI_SHEN` | combination | natal | general | verified | 未啟用：排盤起例等非判讀內容 | CIT_GY_R_SHENGSHI_SHEN | 子、亥二時最難定準，要仔細推詳；時辰錯則命不準（排盤前的提醒，不作判讀）。 |  | — |
| `GY_R_XIAOER` | combination | natal | general | verified | 未啟用：排盤起例等非判讀內容 | CIT_GY_R_XIAOER | 以嬰兒頭頂旋紋推定時辰（非判讀內容）。 |  | — |
| `GY_R_XIAOER_KEQIN` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_R_XIAOER_KEQIN | 小兒命宮星辰廟旺災少易養（屬嬰幼兒健康與刑剋斷語，只保留原文）。 |  | — |
| `GY_R_DAXIAN_ANJING` | period | decade | general、wealth | verified | 可用 | CIT_GY_R_DAXIAN_ANJING | 大限宮星曜廟旺得地、沒有羊陀火鈴空劫：十年安靜、人財兩美。 | 這段時間整體較安穩；這段時間資源與收入較容易增加 | resourceStability（財務處理較穩）×1、resourceIncrease（有實際收穫）×1 |
| `GY_R_DAXIAN_SHA` | period | decade | general、career、wealth、decision | verified | 可用 | CIT_GY_R_DAXIAN_SHA | 大限內有羊陀火鈴空劫或化忌為伴：成敗不一。 | 這段時間變動與起伏較多 | instability（狀態不穩）×1 |
| `GY_R_DAXIAN_XIAN` | period | decade | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_R_DAXIAN_XIAN | 大限落陷又逢煞忌、流年惡煞與小限凶煞：古籍斷為官災死亡（死亡斷語，且需小限，只保留原文）。 |  | — |
| `GY_R_DAXIAN_SIMA` | period | decade | general、wealth、career | verified | 可用 | CIT_GY_R_DAXIAN_SIMA | 大限行至寅申巳亥子午宮，遇紫微、天府、天同、太陽、太陰、昌曲、祿存等吉星：人財興旺。 | 這段時間資源與收入較容易增加；這段時間事情較容易推進 | resourceIncrease（有實際收穫）×1、progressOpportunity（推進機會）×1 |
| `GY_R_DAXIAN_SIMU` | period | decade | general、wealth、career | verified | 可用 | CIT_GY_R_DAXIAN_SIMU | 大限行至辰戌丑未卯酉宮，遇廉貞、羊陀火鈴空劫、化忌等：破耗、勞碌（原文另有酒色、貧乏、死生之說，不採用）。 | 這段時間花費或損失的可能較高；這段時間負荷與壓力偏重 | resourceLossRisk（容易花費或被分走）×1 |
| `GY_R_DAXIAN_SIMU_H` | period | decade | health | verified | 可用 | CIT_GY_R_DAXIAN_SIMU | 大限行至辰戌丑未卯酉宮，遇廉貞、羊陀火鈴空劫、化忌等：破耗、勞碌（原文另有酒色、貧乏、死生之說，不採用）。 | 這段時間負荷與壓力偏重 | stressLoad（身心壓力）×1 |
| `GY_R_DAXIAN_ZUOYOU` | period | decade | general、career、promotion、wealth | verified | 可用 | CIT_GY_R_DAXIAN_ZUOYOU | 大限遇左輔、右弼、文昌、文曲：升遷加職、得財、喜事。 | 這段時間較有機會承擔更多職責、被看見；這段時間資源與收入較容易增加 | responsibilityOpportunity（承擔任務的機會）×1、recognitionOpportunity（表現被看見）×1、resourceIncrease（有實際收穫）×1 |
| `GY_R_DAXIAN_JIA` | period | decade | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_R_DAXIAN_JIA | 大小二限與太歲怕行天傷天使夾地、空劫、羊陀之地（天傷、天使、小限本 App 沒有）。 |  | — |
| `GY_R_DAXIAN_SHOUXING` | period | decade | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_R_DAXIAN_SHOUXING | 逢凶限能否逃過，看壽星紫微、天同、天梁、貪狼坐命可解（壽命斷語，只保留原文）。 |  | — |
| `GY_R_DAXIAN_TAISUI12` | period | annual | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_R_DAXIAN_TAISUI12 | 太歲行至奏書、將軍、直符等（博士十二神、歲前諸星），本 App 沒有這些星。 |  | — |
| `GY_R_ERXIAN` | principle | natal | general | verified | 判讀原則：規範本命 → 大限 → 流年的分層，不單獨觸發 | CIT_GY_R_ERXIAN | 大限、小限、太歲分別看吉凶，都凶才凶；再看彼此相逢與相沖。本 App 以本命為基準，大限、流年只作修正。 |  | — |
| `GY_R_NANBEI` | principle | natal | general | verified | 判讀原則：規範本命 → 大限 → 流年的分層，不單獨觸發 | CIT_GY_R_NANBEI | 陽男陰女以南斗為福，陰男陽女以北斗為福；北斗星的吉凶應在大限前五年，南斗應在後五年（時間原則，不改大限起迄）。 |  | — |
| `GY_R_NANBEI2` | principle | natal | general | verified | 判讀原則：規範本命 → 大限 → 流年的分層，不單獨觸發 | CIT_GY_R_NANBEI2 | 北斗諸星吉凶：大限應在前五年，小限應在上半年。 |  | — |
| `GY_R_TAISUI_MING` | period | annual | general、decision | verified | 可用 | CIT_GY_R_TAISUI_MING | 流年要看太歲宮三方對照的吉凶；太歲回到命宮之年，禍福更要緊。 | 今年是太歲回到命宮的一年，古籍說這年的吉凶較明顯 | timingSensitive（時段影響大）×1 |
| `GY_R_YINZHI` | period | annual | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_R_YINZHI | 行善積德可延壽（道德與壽命論述，只保留原文）。 |  | — |
| `GY_R_YANGTUO_DIEBING` | period | annual | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_R_YANGTUO_DIEBING | 本命擎羊陀羅與流年流羊流陀重疊沖合；本 App 沒有流年擎羊、陀羅。 |  | — |
| `GY_R_QISHA_CHONGFENG` | period | annual | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_R_QISHA_CHONGFENG | 命中三合有七殺，流年又遇流羊流陀沖照；本 App 沒有流年擎羊、陀羅。 |  | — |
| `GY_R_JI_ZI` | period | annual | general、decision | verified | 可用 | CIT_GY_R_JI_ZI | 子年生人，太歲在寅、申之年災悔較重。 | 這一年較容易遇到波折，重要事項宜多預留緩衝 | setbackRisk（做法可能有所失）×1 |
| `GY_R_JI_CHOUWU` | period | annual | general、decision | verified | 可用 | CIT_GY_R_JI_CHOUWU | 丑年生人忌午年，午年生人忌丑年。 | 這一年較容易遇到波折，重要事項宜多預留緩衝 | setbackRisk（做法可能有所失）×1 |
| `GY_R_JI_YINMAO` | period | annual | general、decision | verified | 可用 | CIT_GY_R_JI_YINMAO | 寅、卯年生人防巳、亥年。 | 這一年較容易遇到波折，重要事項宜多預留緩衝 | setbackRisk（做法可能有所失）×1 |
| `GY_R_JI_SHELONG` | period | annual | general、decision | verified | 可用 | CIT_GY_R_JI_SHELONG | 巳年生人忌巳年、辰年生人忌辰年（本命年）。 | 這一年較容易遇到波折，重要事項宜多預留緩衝 | setbackRisk（做法可能有所失）×1 |
| `GY_R_JI_SHEN` | period | annual | general、decision | verified | 可用 | CIT_GY_R_JI_SHEN | 申年生人流年命宮逢火星、鈴星：災悔較重。 | 這一年較容易遇到波折，重要事項宜多預留緩衝 | setbackRisk（做法可能有所失）×1 |
| `GY_R_JI_WEI` | period | annual | general、decision | verified | 可用 | CIT_GY_R_JI_WEI | 未年生人忌亥、酉年。 | 這一年較容易遇到波折，重要事項宜多預留緩衝 | setbackRisk（做法可能有所失）×1 |
| `GY_R_JI_XUHAI` | period | annual | general、decision | verified | 可用 | CIT_GY_R_JI_XUHAI | 戌、亥年生人流年命宮逢擎羊、陀羅：災重。 | 這一年較容易遇到波折，重要事項宜多預留緩衝 | setbackRisk（做法可能有所失）×1 |
| `GY_R_JI_YOU` | period | annual | general、decision | verified | 可用 | CIT_GY_R_JI_YOU | 酉年生人流年命宮逢陀羅、擎羊：不利。 | 這一年較容易遇到波折，重要事項宜多預留緩衝 | setbackRisk（做法可能有所失）×1 |
| `GY_R_LIMING_XINGXIAN` | period | decade | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_R_LIMING_XINGXIAN | 依命局五行與行限方位論傷災（傷亡、膿血斷語，只保留原文）。 |  | — |
| `GY_R_SUIZHI_ZI_JI` | period | annual | general、career、wealth | verified | 可用 | CIT_GY_R_SUIZHI_ZI_JI | 子年，太歲宮有祿存、天機、天同、太陰、昌曲、輔弼、破軍、天相、廉貞、武曲、天府、巨門、七殺：人財兩美。 | 這一年事情較容易推進、資源較順 | progressOpportunity（推進機會）×1、resourceIncrease（有實際收穫）×1 |
| `GY_R_SUIZHI_ZI_XIONG` | period | annual | general、wealth、social、lawsuit | verified | 可用 | CIT_GY_R_SUIZHI_ZI_XIONG | 子年，太歲宮遇（貪狼、紫微、）天梁、化忌、太陽、擎羊：人財耗散、官災口舌（「孝服」不採用）。 | 這一年支出與口舌摩擦的可能較高 | resourceLossRisk（容易花費或被分走）×1、communicationConflictRisk（容易起口角）×1 |
| `GY_R_SUIZHI_CHOU_JI` | period | annual | general、career、wealth | verified | 可用 | CIT_GY_R_SUIZHI_CHOU_JI | 丑年，太歲宮有紫微、天相、天梁、太陰、天府、祿存、廉貞、破軍、昌曲、天機、輔弼：事事遂心。 | 這一年事情較容易推進、資源較順 | progressOpportunity（推進機會）×1、resourceIncrease（有實際收穫）×1 |
| `GY_R_SUIZHI_CHOU_XIONG` | period | annual | general、wealth、social、lawsuit | verified | 可用 | CIT_GY_R_SUIZHI_CHOU_XIONG | 丑年，太歲宮遇天同、巨門、武曲、貪狼、化忌、太陽、擎羊：人財耗散、官災口舌。 | 這一年支出與口舌摩擦的可能較高 | resourceLossRisk（容易花費或被分走）×1、communicationConflictRisk（容易起口角）×1 |
| `GY_R_SUIZHI_YIN_JI` | period | annual | general、career、wealth | verified | 可用 | CIT_GY_R_SUIZHI_YIN_JI | 寅年，太歲宮有紫微、天府、天機、太陰、武曲、七殺、天同、天相、太陽、巨門、天梁：人財進益。 | 這一年事情較容易推進、資源較順 | progressOpportunity（推進機會）×1、resourceIncrease（有實際收穫）×1 |
| `GY_R_SUIZHI_YIN_XIONG` | period | annual | general、wealth、social、lawsuit | verified | 可用 | CIT_GY_R_SUIZHI_YIN_XIONG | 寅年，太歲宮遇貪狼、陀羅、化忌：人財破散、官非。 | 這一年支出與口舌摩擦的可能較高 | resourceLossRisk（容易花費或被分走）×1、communicationConflictRisk（容易起口角）×1 |
| `GY_R_SUIZHI_MAO_JI` | period | annual | general、career、wealth、relationship、marriage | verified | 可用 | CIT_GY_R_SUIZHI_MAO_JI | 卯年，太歲宮有太陰、天梁、紫微、天機、天同、天府、貪狼、巨門、七殺：人財興旺、婚姻喜事。 | 這一年事情較容易推進、資源較順；這一年人際與感情互動較熱絡 | progressOpportunity（推進機會）×1、resourceIncrease（有實際收穫）×1、relationshipWarmth（互動有溫度）×1 |
| `GY_R_SUIZHI_MAO_XIONG` | period | annual | general、wealth、social、lawsuit | verified | 可用 | CIT_GY_R_SUIZHI_MAO_XIONG | 卯年，太歲宮遇廉貞、破軍、太陰、天相、擎羊、化忌：破財、官災口舌（原文太陰在吉凶兩列都出現）。 | 這一年支出與口舌摩擦的可能較高 | resourceLossRisk（容易花費或被分走）×1、communicationConflictRisk（容易起口角）×1 |
| `GY_R_SUIZHI_CHEN_JI` | period | annual | general、career、wealth、relationship、marriage | verified | 可用 | CIT_GY_R_SUIZHI_CHEN_JI | 辰年，太歲宮有太陽、天機、天梁、貪狼、七殺、文昌、左右：財祿大進、婚姻喜慶。 | 這一年事情較容易推進、資源較順；這一年人際與感情互動較熱絡 | progressOpportunity（推進機會）×1、resourceIncrease（有實際收穫）×1、relationshipWarmth（互動有溫度）×1 |
| `GY_R_SUIZHI_CHEN_XIONG` | period | annual | general、wealth、social、lawsuit | verified | 可用 | CIT_GY_R_SUIZHI_CHEN_XIONG | 辰年，太歲宮遇紫微、天同、廉貞、天府、太陰、巨門、天相、破軍、化忌：破財、官災口舌（「孝服」不採用）。 | 這一年支出與口舌摩擦的可能較高 | resourceLossRisk（容易花費或被分走）×1、communicationConflictRisk（容易起口角）×1 |
| `GY_R_SUIZHI_SI_JI` | period | annual | general、career、wealth | verified | 可用 | CIT_GY_R_SUIZHI_SI_JI | 巳年，太歲宮有紫微、太陽、天同、天府、天梁、祿存：人財稱意、喜事重重。 | 這一年事情較容易推進、資源較順 | progressOpportunity（推進機會）×1、resourceIncrease（有實際收穫）×1 |
| `GY_R_SUIZHI_SI_XIONG` | period | annual | general、wealth、social、lawsuit | verified | 可用 | CIT_GY_R_SUIZHI_SI_XIONG | 巳年，太歲宮遇武曲、廉貞、太陰、貪狼、巨門、天相、破軍、化忌：人財損失、官災口舌（原文另有病患之說）。 | 這一年支出與口舌摩擦的可能較高 | resourceLossRisk（容易花費或被分走）×1、communicationConflictRisk（容易起口角）×1 |
| `GY_R_SUIZHI_WU_JI` | period | annual | general、career、wealth、relationship、marriage | verified | 可用 | CIT_GY_R_SUIZHI_WU_JI | 午年，太歲宮有紫微、天機、天府、太陽、武曲、廉貞、天相、巨門、天梁、破軍、祿存：人財興旺、婚姻喜事。 | 這一年事情較容易推進、資源較順；這一年人際與感情互動較熱絡 | progressOpportunity（推進機會）×1、resourceIncrease（有實際收穫）×1、relationshipWarmth（互動有溫度）×1 |
| `GY_R_SUIZHI_WU_XIONG` | period | annual | general、wealth、social、lawsuit | verified | 可用 | CIT_GY_R_SUIZHI_WU_XIONG | 午年，太歲宮遇太陰、貪狼、天同、羊陀、化忌：人財破敗、官災口舌。 | 這一年支出與口舌摩擦的可能較高 | resourceLossRisk（容易花費或被分走）×1、communicationConflictRisk（容易起口角）×1 |
| `GY_R_SUIZHI_WEI_JI` | period | annual | general、career、wealth、relationship、marriage | verified | 可用 | CIT_GY_R_SUIZHI_WEI_JI | 未年，太歲宮有紫微、天府、廉貞、天機、破軍、天相：人財增益、婚姻之喜。 | 這一年事情較容易推進、資源較順；這一年人際與感情互動較熱絡 | progressOpportunity（推進機會）×1、resourceIncrease（有實際收穫）×1、relationshipWarmth（互動有溫度）×1 |
| `GY_R_SUIZHI_WEI_XIONG` | period | annual | general、wealth、social、lawsuit | verified | 可用 | CIT_GY_R_SUIZHI_WEI_XIONG | 未年，太歲宮遇太陰、太陽、武曲、天同、貪狼、巨門、羊陀、化忌：人財耗散、官災。 | 這一年支出與口舌摩擦的可能較高 | resourceLossRisk（容易花費或被分走）×1、communicationConflictRisk（容易起口角）×1 |
| `GY_R_SUIZHI_SHEN_JI` | period | annual | general、career、wealth | verified | 可用 | CIT_GY_R_SUIZHI_SHEN_JI | 申年，太歲宮有紫微、太陽、廉貞、天府、巨門、七殺、文昌、武曲、祿存：人財利益、喜事重重。 | 這一年事情較容易推進、資源較順 | progressOpportunity（推進機會）×1、resourceIncrease（有實際收穫）×1 |
| `GY_R_SUIZHI_SHEN_XIONG` | period | annual | general、wealth、social、lawsuit | pendingVerification | 未啟用：原文有疑字（兩輪核讀與決議仍無法確定） | CIT_GY_R_SUIZHI_SHEN_XIONG | 申年，太歲宮遇天機、天同、天梁、天相、太陰、破軍：人財散失、官非。 | 這一年支出與口舌摩擦的可能較高 | resourceLossRisk（容易花費或被分走）×1、communicationConflictRisk（容易起口角）×1 |
| `GY_R_SUIZHI_YOU_JI` | period | annual | general、career、wealth | verified | 可用 | CIT_GY_R_SUIZHI_YOU_JI | 酉年，太歲宮有祿存、紫微、天府、昌曲、左右：人財興旺。 | 這一年事情較容易推進、資源較順 | progressOpportunity（推進機會）×1、resourceIncrease（有實際收穫）×1 |
| `GY_R_SUIZHI_YOU_XIONG` | period | annual | general、wealth、social、lawsuit | verified | 可用 | CIT_GY_R_SUIZHI_YOU_XIONG | 酉年，太歲宮遇天機、巨門、武曲、廉貞、擎羊、陀羅、化忌：人離財散、口舌官非。 | 這一年支出與口舌摩擦的可能較高 | resourceLossRisk（容易花費或被分走）×1、communicationConflictRisk（容易起口角）×1 |
| `GY_R_SUIZHI_XU_JI` | period | annual | general、career、wealth | verified | 可用 | CIT_GY_R_SUIZHI_XU_JI | 戌年，太歲宮有天機、太陰、天梁、天府、武曲、七殺、貪狼、左右、天同：人財利益。 | 這一年事情較容易推進、資源較順 | progressOpportunity（推進機會）×1、resourceIncrease（有實際收穫）×1 |
| `GY_R_SUIZHI_XU_XIONG` | period | annual | general、wealth、social、lawsuit | verified | 可用 | CIT_GY_R_SUIZHI_XU_XIONG | 戌年，太歲宮遇巨門、太陽、破軍、紫微、天相、化忌：人財退失、官災（原文另有病之說）。 | 這一年支出與口舌摩擦的可能較高 | resourceLossRisk（容易花費或被分走）×1、communicationConflictRisk（容易起口角）×1 |
| `GY_R_SUIZHI_HAI_JI` | period | annual | general、career、wealth | verified | 可用 | CIT_GY_R_SUIZHI_HAI_JI | 亥年，太歲宮有天同、太陰、天梁、紫微、天府、昌曲、祿存：人財進益、謀事稱心。 | 這一年事情較容易推進、資源較順 | progressOpportunity（推進機會）×1、resourceIncrease（有實際收穫）×1 |
| `GY_R_SUIZHI_HAI_XIONG` | period | annual | general、wealth、social、lawsuit | verified | 可用 | CIT_GY_R_SUIZHI_HAI_XIONG | 亥年，太歲宮遇廉貞、破軍、七殺：人財耗散（原文另有死亡之說，不採用）。 | 這一年支出與口舌摩擦的可能較高 | resourceLossRisk（容易花費或被分走）×1、communicationConflictRisk（容易起口角）×1 |
| `GY_R_XIAOXIAN_0_JI` | period | annual | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_R_XIAOXIAN_0_JI | 子年太歲併小限到子宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |  | — |
| `GY_R_XIAOXIAN_0_XIONG` | period | annual | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_R_XIAOXIAN_0_XIONG | 子年太歲併小限到子宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |  | — |
| `GY_R_XIAOXIAN_1_JI` | period | annual | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_R_XIAOXIAN_1_JI | 丑年太歲併小限到丑宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |  | — |
| `GY_R_XIAOXIAN_1_XIONG` | period | annual | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_R_XIAOXIAN_1_XIONG | 丑年太歲併小限到丑宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |  | — |
| `GY_R_XIAOXIAN_2_JI` | period | annual | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_R_XIAOXIAN_2_JI | 寅年太歲併小限到寅宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |  | — |
| `GY_R_XIAOXIAN_2_XIONG` | period | annual | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_R_XIAOXIAN_2_XIONG | 寅年太歲併小限到寅宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |  | — |
| `GY_R_XIAOXIAN_3_JI` | period | annual | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_R_XIAOXIAN_3_JI | 卯年太歲併小限到卯宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |  | — |
| `GY_R_XIAOXIAN_3_XIONG` | period | annual | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_R_XIAOXIAN_3_XIONG | 卯年太歲併小限到卯宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |  | — |
| `GY_R_XIAOXIAN_4_JI` | period | annual | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_R_XIAOXIAN_4_JI | 辰年太歲併小限到辰宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |  | — |
| `GY_R_XIAOXIAN_4_XIONG` | period | annual | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_R_XIAOXIAN_4_XIONG | 辰年太歲併小限到辰宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |  | — |
| `GY_R_XIAOXIAN_5_JI` | period | annual | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_R_XIAOXIAN_5_JI | 巳年太歲併小限到巳宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |  | — |
| `GY_R_XIAOXIAN_5_XIONG` | period | annual | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_R_XIAOXIAN_5_XIONG | 巳年太歲併小限到巳宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |  | — |
| `GY_R_XIAOXIAN_6_JI` | period | annual | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_R_XIAOXIAN_6_JI | 午年太歲併小限到午宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |  | — |
| `GY_R_XIAOXIAN_6_XIONG` | period | annual | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_R_XIAOXIAN_6_XIONG | 午年太歲併小限到午宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |  | — |
| `GY_R_XIAOXIAN_7_JI` | period | annual | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_R_XIAOXIAN_7_JI | 未年太歲併小限到未宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |  | — |
| `GY_R_XIAOXIAN_7_XIONG` | period | annual | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_R_XIAOXIAN_7_XIONG | 未年太歲併小限到未宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |  | — |
| `GY_R_XIAOXIAN_8_JI` | period | annual | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_R_XIAOXIAN_8_JI | 申年太歲併小限到申宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |  | — |
| `GY_R_XIAOXIAN_8_XIONG` | period | annual | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_R_XIAOXIAN_8_XIONG | 申年太歲併小限到申宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |  | — |
| `GY_R_XIAOXIAN_9_JI` | period | annual | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_R_XIAOXIAN_9_JI | 酉年太歲併小限到酉宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |  | — |
| `GY_R_XIAOXIAN_9_XIONG` | period | annual | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_R_XIAOXIAN_9_XIONG | 酉年太歲併小限到酉宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |  | — |
| `GY_R_XIAOXIAN_10_JI` | period | annual | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_R_XIAOXIAN_10_JI | 戌年太歲併小限到戌宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |  | — |
| `GY_R_XIAOXIAN_10_XIONG` | period | annual | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_R_XIAOXIAN_10_XIONG | 戌年太歲併小限到戌宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |  | — |
| `GY_R_XIAOXIAN_11_JI` | period | annual | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_R_XIAOXIAN_11_JI | 亥年太歲併小限到亥宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |  | — |
| `GY_R_XIAOXIAN_11_XIONG` | period | annual | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_R_XIAOXIAN_11_XIONG | 亥年太歲併小限到亥宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |  | — |
| `GY_A_ZIWEI_01` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_A_ZIWEI_01 | 紫微在午宮坐命，三方無擎羊、化忌，甲、丁、己年生人：可至公卿（原文「巳」讀為天干「己」；小注：加刑忌則平常）。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_ZIWEI_02` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_A_ZIWEI_02 | 紫微在子午宮坐命，三方有化科、化權、化祿照會：最為奇特（小注：科權祿三方照）。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_ZIWEI_03` | starInPalace | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_A_ZIWEI_03 | 紫微坐命，男命在亥、女命在寅，壬、甲年生人：同樣富貴。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_ZIWEI_04` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_ZIWEI_04 | 紫微在卯酉逢劫空四煞：古籍斷為出家（出家斷語，只保留原文）。 |  | — |
| `GY_A_ZIWEI_05` | combination | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_A_ZIWEI_05 | 紫微、天府坐命，全靠左輔、右弼相助（小注：紫府得輔弼同垣或拱照，終身富貴）。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_ZIWEI_06` | combination | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_A_ZIWEI_06 | 紫微、天府同在寅申宮守命，無煞星湊合，甲年生人：終身享福、富貴。 | 古籍評為有福；本 App 不把它轉成生活因素；長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_ZIWEI_07` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_A_ZIWEI_07 | 紫微、天府在三方朝命，又逢化祿：終身福厚、地位高。 | 古籍評為有福；本 App 不把它轉成生活因素；長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_ZIWEI_08` | combination | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_A_ZIWEI_08 | 命在巳亥，紫微、天府分居巳亥（一坐一對照）：富貴雙全。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_ZIWEI_09` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_A_ZIWEI_09 | 紫微或天府坐命廟旺，太陽、太陰在三方也居廟旺：公卿之器。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_ZIWEI_10` | combination | natal | wealth | verified | 可用 | CIT_GY_A_ZIWEI_10 | 紫微或天府、武曲在財帛或田宅，又有化權、化祿：富有（小注：得左右、祿存亦可）。 | 長期而言在累積資源上較有發揮 | aptitudeResources（擅長經營資源）×2 |
| `GY_A_ZIWEI_11` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_A_ZIWEI_11 | 紫微與左輔或右弼同在命宮：一呼百諾、居上品。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_ZIWEI_12` | combination | natal | wealth、career | verified | 可用 | CIT_GY_A_ZIWEI_12 | 紫微或天府坐命、會擎羊：多為大商人（小注：得武曲居遷移者多）。 | 較有經商、做買賣的傾向 | aptitudeResources（擅長經營資源）×1 |
| `GY_A_ZIWEI_13` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_A_ZIWEI_13 | 紫微、天府在命宮左右相夾：貴格。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_ZIWEI_14` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_A_ZIWEI_14 | 紫微、祿存同在命宮，太陽、太陰在三方拱照：貴不可言。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_ZIWEI_15` | combination | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_A_ZIWEI_15 | 紫微坐命會文昌、文曲：富貴可期。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_ZIWEI_16` | combination | natal | general | verified | 可用 | CIT_GY_A_ZIWEI_16 | 紫微、七殺同坐命宮而有化權：反為吉祥。 | 古籍評為相宜；本 App 只列出，不轉成生活因素 | — |
| `GY_A_ZIWEI_17` | combination | natal | career | verified | 可用 | CIT_GY_A_ZIWEI_17 | 紫微坐命、會太陰又逢煞星：一生在吏職中發揮。 | 適合在組織中擔任行政、事務型職務 | aptitudeResponsibility（適合承擔責任）×1 |
| `GY_A_ZIWEI_18` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_ZIWEI_18 | 紫微破軍無左右吉曜：古籍斷為凶惡胥吏（品格斷語，只保留原文）。 |  | — |
| `GY_A_ZIWEI_19` | combination | natal | wealth、career | verified | 可用 | CIT_GY_A_ZIWEI_19 | 紫微坐命，會武曲、破軍與擎羊、陀羅：只宜經商。 | 較有經商、做買賣的傾向 | aptitudeResources（擅長經營資源）×1 |
| `GY_A_ZIWEI_20` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_ZIWEI_20 | 紫微權祿遇羊陀：古籍斷為心術不正（品格斷語，只保留原文）。 |  | — |
| `GY_A_ZIWEI_21` | combination | natal | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_A_ZIWEI_21 | 紫微七殺加空亡：虛名受蔭。空亡不在客觀排盤中。 |  | — |
| `GY_A_ZIWEI_22` | combination | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_A_ZIWEI_22 | 紫微（與破軍同宮或對照）坐命在辰戌丑未，又加吉星：富貴可期。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_ZIWEI_23` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_ZIWEI_23 | 紫破在辰戌：古籍斷為君臣不義（品格斷語，只保留原文）。 |  | — |
| `GY_A_ZIWEI_24` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_ZIWEI_24 | 女命紫微、太陽之訣（女命訣，只保留原文）。 |  | — |
| `GY_A_ZIWEI_25` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_ZIWEI_25 | 女命紫微在寅午申之訣（女命訣，只保留原文）。 |  | — |
| `GY_A_TIANFU_01` | starInPalace | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_A_TIANFU_01 | 天府在戌宮坐命，無煞星湊合，甲、己年生人：富且貴（原文「巳」讀為天干「己」；小注：加四煞有疵）。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_TIANFU_02` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_A_TIANFU_02 | 天府、天相、天梁同會命宮：君臣慶會。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_TIANFU_03` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_A_TIANFU_03 | 天府在午戌坐命、天相來朝，甲年生人：貴顯。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_TIANFU_04` | combination | natal | general、wealth | verified | 可用 | CIT_GY_A_TIANFU_04 | 天府、天相朝命：食祿豐厚（小注：命寅申、府相在財帛官祿朝者上格）。 | 長期而言在累積與管理資源上較有發揮 | aptitudeResources（擅長經營資源）×2 |
| `GY_A_TIANFU_05` | combination | natal | wealth | verified | 可用 | CIT_GY_A_TIANFU_05 | 天府坐命，會祿存與文昌、文曲：巨萬之資。 | 長期而言在累積資源上較有發揮 | aptitudeResources（擅長經營資源）×2 |
| `GY_A_TIANFU_06` | combination | natal | general、career、promotion、exam | verified | 可用 | CIT_GY_A_TIANFU_06 | 天府坐命，會文昌、文曲與左輔、右弼：科第恩榮。 | 長期而言較有機會承擔職位、被看見；長期而言學習與思考較有發揮 | aptitudeResponsibility（適合承擔責任）×2、aptitudeStudy（重思考學習）×1 |
| `GY_A_TIANFU_07` | combination | natal | wealth | verified | 可用 | CIT_GY_A_TIANFU_07 | 天府、武曲在財帛或田宅，又有化權、化祿：富有（小注：有左右、祿存亦美）。 | 長期而言在累積資源上較有發揮 | aptitudeResources（擅長經營資源）×2 |
| `GY_A_TIANXIANG_01` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_TIANXIANG_01 | 天相廉貞擎羊夾：古籍斷為刑杖（刑獄斷語，只保留原文）。 |  | — |
| `GY_A_TIANXIANG_02` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_TIANXIANG_02 | 女命天相之訣（女命訣，只保留原文）。 |  | — |
| `GY_A_TIANXIANG_03` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_TIANXIANG_03 | 右弼天相（此處小注全為女命之說，只保留原文；同句在 54R 另建規則）。 |  | — |
| `GY_A_TIANLIANG_01` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_TIANLIANG_01 | 天梁太陰女命之訣（性別道德斷語，只保留原文）。 |  | — |
| `GY_A_TIANLIANG_02` | combination | natal | general | verified | 可用 | CIT_GY_A_TIANLIANG_02 | 天梁守命或對照，又逢吉星：平生有福（小注：在午位極佳）。 | 古籍評為有福；本 App 不把它轉成生活因素 | — |
| `GY_A_TIANLIANG_03` | starInPalace | natal | career、promotion | verified | 可用 | CIT_GY_A_TIANLIANG_03 | 天梁在午宮坐命，丁、己、癸年生人：官資清顯（原文「巳」讀為天干「己」）。 | 長期而言在承擔職務、被看見上較有發揮 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_TIANLIANG_04` | combination | natal | career、general | verified | 可用 | CIT_GY_A_TIANLIANG_04 | 天同天梁或天機太陰同在寅申坐命：一生宜吏業、聰明。 | 適合在組織中擔任行政、事務型職務，思考靈活 | aptitudeResponsibility（適合承擔責任）×1、aptitudeStudy（重思考學習）×1 |
| `GY_A_TIANLIANG_05` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_TIANLIANG_05 | 梁同巳亥之訣（品格、性別道德斷語，只保留原文）。 |  | — |
| `GY_A_TIANLIANG_06` | combination | natal | general、career、promotion、exam | verified | 可用 | CIT_GY_A_TIANLIANG_06 | 天梁坐命，會太陽、文昌與祿（祿存或化祿）：科名第一。 | 長期而言較有機會承擔職位、被看見；長期而言學習與思考較有發揮 | aptitudeResponsibility（適合承擔責任）×2、aptitudeStudy（重思考學習）×1 |
| `GY_A_TIANLIANG_07` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_A_TIANLIANG_07 | 天梁廟旺坐命，與文昌同宮：位至高官。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_TIANLIANG_08` | combination | natal | general | verified | 未啟用：古文沒有足夠成立條件 | CIT_GY_A_TIANLIANG_08 | 梁武陰鈴：可作棟梁之客。原文未說明四星的宮位關係，無法落成盤面條件。 |  | — |
| `GY_A_TIANLIANG_09` | combination | natal | travel | verified | 可用 | CIT_GY_A_TIANLIANG_09 | 天梁在酉宮坐命、太陰在巳宮（三方）：一生較飄泊。 | 外出與移動較多、較勞碌 | movementIncrease（移動變多）×1、stressLoad（身心壓力）×1 |
| `GY_A_TIANLIANG_10` | combination | natal | travel | verified | 可用 | CIT_GY_A_TIANLIANG_10 | 天梁與天馬同坐命宮：為人飄蕩。 | 外出與移動較多、較勞碌 | movementIncrease（移動變多）×1、stressLoad（身心壓力）×1 |
| `GY_A_TIANLIANG_11` | combination | natal | travel、wealth | verified | 可用 | CIT_GY_A_TIANLIANG_11 | 天梁坐遷移宮又加吉星：巨商高賈（小注：加刑忌平常）。 | 外出或異地發展較有收穫 | aptitudeResources（擅長經營資源）×1 |
| `GY_A_TIANTONG_01` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_TIANTONG_01 | 天同會吉之壽元斷語（壽夭斷語，只保留原文）。 |  | — |
| `GY_A_TIANTONG_02` | combination | natal | general、career、jobChange | pendingVerification | 未啟用：原文有疑字（兩輪核讀與決議仍無法確定） | CIT_GY_A_TIANTONG_02 | 天同、太陰同在陷宮又加煞：宜以技藝謀生。 | 長期而言適合以專業技能、手藝發揮 | aptitudeStudy（重思考學習）×1 |
| `GY_A_TIANTONG_03` | combination | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_A_TIANTONG_03 | 天同或貪狼在午宮坐命、與擎羊同宮，丙、戊年生人：馬頭帶箭格，富且貴。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_TIANTONG_04` | starInPalace | natal | general | verified | 可用 | CIT_GY_A_TIANTONG_04 | 天同在戌宮坐命，丁年生人（對宮巨門化忌）：反為佳。 | 古籍評為相宜；本 App 只列出，不轉成生活因素 | — |
| `GY_A_TIANTONG_05` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_TIANTONG_05 | 女命天同之訣（女命訣，只保留原文）。 |  | — |
| `GY_A_TIANJI_01` | combination | natal | general、exam、career | verified | 可用 | CIT_GY_A_TIANJI_01 | 天機、天梁會合於命：善於謀略、談論（在戌亦美）。 | 長期而言學習與思考較有發揮；長期而言表達與文字較有發揮 | aptitudeStudy（重思考學習）×1、aptitudeExpression（擅長表達）×1 |
| `GY_A_TIANJI_02` | combination | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_A_TIANJI_02 | 天機、天梁同守命宮又加吉星：富貴慈祥。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_TIANJI_03` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_TIANJI_03 | 機梁同照逢空：古籍斷為宜僧道（出家斷語，只保留原文）。 |  | — |
| `GY_A_TIANJI_04` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_TIANJI_04 | 機梁七殺破軍沖：古籍斷為僧道（出家斷語，只保留原文）。 |  | — |
| `GY_A_TIANJI_05` | combination | natal | career | verified | 可用 | CIT_GY_A_TIANJI_05 | 命在寅申，天機、太陰、天同、天梁在三方：宜作吏職。 | 適合在組織中擔任行政、事務型職務 | aptitudeResponsibility（適合承擔責任）×1 |
| `GY_A_TIANJI_06` | combination | natal | wealth、career | verified | 可用 | CIT_GY_A_TIANJI_06 | 天機、天梁、貪狼、太陰會命：經商奔波、日夜勞碌。 | 較有經商謀生的傾向，但奔波勞碌 | aptitudeResources（擅長經營資源）×1、workloadIncrease（負荷增加）×1 |
| `GY_A_TIANJI_07` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_TIANJI_07 | 天機加惡煞：古籍斷為盜竊（品格斷語，只保留原文）。 |  | — |
| `GY_A_TIANJI_08` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_TIANJI_08 | 天機巳酉之訣（品格斷語，只保留原文）。 |  | — |
| `GY_A_TIANJI_09` | combination | natal | general | verified | 可用 | CIT_GY_A_TIANJI_09 | 巨門落陷又會天機：破格。 | 古籍評為格局較低；本 App 不把等第轉成生活因素 | — |
| `GY_A_TAIYANG_01` | starInPalace | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_A_TAIYANG_01 | 太陽在卯辰宮坐命，白天出生（本 App 取卯至申時）：富貴聲揚。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_TAIYANG_02` | starInPalace | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_A_TAIYANG_02 | 太陽在午宮坐命，庚、辛、丁、己年生人：富貴雙全（原文「巳」讀為天干「己」）。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_TAIYANG_03` | combination | natal | career、promotion | verified | 可用 | CIT_GY_A_TAIYANG_03 | 太陽與文昌（或文曲）同在官祿宮：貴顯。 | 長期而言在承擔職務、被看見上較有發揮 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_TAIYANG_04` | combination | natal | general、social | verified | 可用 | CIT_GY_A_TAIYANG_04 | 太陽坐命化忌：是非較多。 | 較容易有口舌是非，溝通宜多留意 | communicationConflictRisk（容易起口角）×1 |
| `GY_A_TAIYANG_05` | starInPalace | natal | general、career | verified | 可用 | CIT_GY_A_TAIYANG_05 | 太陽在未申宮坐命：做事先勤後懶。 | 做事容易前緊後鬆，宜留意持續力 | disciplineRisk（容易破壞紀律）×1 |
| `GY_A_TAIYANG_06` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_TAIYANG_06 | 女命太陽之訣（女命訣，只保留原文）。 |  | — |
| `GY_A_TAIYIN_01` | starInPalace | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_A_TAIYIN_01 | 太陰在子宮坐命，丙、丁年生人：富貴（小注：夜生人合局）。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_TAIYIN_02` | combination | natal | general、exam、career、promotion | verified | 可用 | CIT_GY_A_TAIYIN_02 | 太陰與文曲同在夫妻宮：科名有成。 | 長期而言學習與思考較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeStudy（重思考學習）×1、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_TAIYIN_03` | combination | natal | general、career、jobChange | verified | 可用 | CIT_GY_A_TAIYIN_03 | 太陰與文曲同在命宮：巧藝之人（小注；本 App 只取命宮）。 | 長期而言適合以專業技能、手藝發揮 | aptitudeStudy（重思考學習）×1 |
| `GY_A_TAIYIN_04` | combination | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_A_TAIYIN_04 | 太陰、武曲、祿存會命，又逢左輔、右弼：富貴。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_TAIYIN_05` | combination | natal | wealth、investment | verified | 可用 | CIT_GY_A_TAIYIN_05 | 太陰坐命會擎羊、陀羅：錢財易散。 | 財務起伏較大、不容易穩定累積 | financialVolatility（財務波動）×1 |
| `GY_A_TAIYIN_06` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_A_TAIYIN_06 | 太陰在亥宮坐命：職掌大權。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_TAIYIN_07` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_TAIYIN_07 | 太陰天梁女命之訣（性別道德斷語，只保留原文）。 |  | — |
| `GY_A_RIYUE_01` | combination | natal | general、exam、career、promotion | verified | 可用 | CIT_GY_A_RIYUE_01 | 命在丑，太陽在巳、太陰在酉（三方拱照）：科名有成。 | 長期而言學習與思考較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeStudy（重思考學習）×1、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_RIYUE_02` | combination | natal | general、exam、career、promotion | verified | 可用 | CIT_GY_A_RIYUE_02 | 命在未，太陽在卯、太陰在亥（三方拱照）：多科名。 | 長期而言學習與思考較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeStudy（重思考學習）×1、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_RIYUE_03` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_A_RIYUE_03 | 太陽、太陰同在未宮，命在丑（對照）：侯伯之材。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_RIYUE_04` | combination | natal | general、career | pendingVerification | 未啟用：原文有疑字（兩輪核讀與決議仍無法確定） | CIT_GY_A_RIYUE_04 | 日月在丑未守命，三方無吉星：反為不吉。 | 推進時較容易卡住、需要更多準備 | executionResistance（推進有阻力）×1 |
| `GY_A_RIYUE_05` | combination | natal | general | verified | 未啟用：古文沒有足夠成立條件 | CIT_GY_A_RIYUE_05 | 日月守命不如日月照合（小注：吉多主吉、凶多主凶）。這是比較原則，沒有獨立的結果詞。 |  | — |
| `GY_A_RIYUE_06` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_A_RIYUE_06 | 太陽在辰、太陰在戌（命在辰或戌）：權祿不淺。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_RIYUE_07` | combination | natal | general、career、promotion、wealth | verified | 可用 | CIT_GY_A_RIYUE_07 | 太陽、太陰夾命宮或夾財帛宮，又加吉星：不貴則富（小注：加羊陀沖守宜僧，不採用）。 | 長期而言較有機會承擔職位、被看見；長期而言在累積與管理資源上較有發揮 | aptitudeResponsibility（適合承擔責任）×2、aptitudeResources（擅長經營資源）×2 |
| `GY_A_RIYUE_08` | combination | natal | general、career | verified | 可用 | CIT_GY_A_RIYUE_08 | 日月最怕反背（太陽或太陰落陷守命）。 | 推進時較容易卡住、需要更多準備 | executionResistance（推進有阻力）×1 |
| `GY_A_RIYUE_09` | combination | natal | general | verified | 可用 | CIT_GY_A_RIYUE_09 | 太陽或太陰坐命，會左輔、右弼：為佳。 | 古籍評為相宜；本 App 只列出，不轉成生活因素 | — |
| `GY_A_RIYUE_10` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_RIYUE_10 | 日月羊陀：古籍斷為剋親（刑剋斷語，只保留原文）。 |  | — |
| `GY_A_RIYUE_11` | combination | natal | travel | verified | 可用 | CIT_GY_A_RIYUE_11 | 太陽或太陰落陷坐命，又逢煞星：勞碌奔波。 | 外出與移動較多、較勞碌 | movementIncrease（移動變多）×1、stressLoad（身心壓力）×1 |
| `GY_A_RIYUE_12` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_RIYUE_12 | 日月會貪殺：古籍斷為奸盜淫（品格、性別道德斷語，只保留原文）。 |  | — |
| `GY_A_RIYUE_13` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_RIYUE_13 | 日月疾厄之訣（疾病斷語，只保留原文）。 |  | — |
| `GY_A_WENCHANG_01` | combination | natal | general、exam | verified | 可用 | CIT_GY_A_WENCHANG_01 | 文昌、武曲會命：多學多能（小注：論三方科權祿）。 | 長期而言學習與思考較有發揮 | aptitudeStudy（重思考學習）×1 |
| `GY_A_WENCHANG_02` | combination | natal | general、exam、career、promotion | verified | 可用 | CIT_GY_A_WENCHANG_02 | 文昌、文曲與化科在三方拱照：年少登科。 | 長期而言學習與思考較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeStudy（重思考學習）×1、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_WENCHANG_03` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_A_WENCHANG_03 | 左輔、文昌會命：位至高官（此「三台」指官位，不是三台星）。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_WENCHANG_04` | combination | natal | career、general、exam | verified | 可用 | CIT_GY_A_WENCHANG_04 | 文昌、武曲同在命宮：文武兼備（本 App 只取命宮）。 | 職涯選擇面較廣、適合承擔職務；長期而言學習與思考較有發揮 | aptitudeResponsibility（適合承擔責任）×1、aptitudeStudy（重思考學習）×1 |
| `GY_A_WENQU_01` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_A_WENQU_01 | 文曲或武曲坐命入廟，又逢左輔、右弼：將相之材。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_WENQU_02` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_A_WENQU_02 | 文曲在子、卯、酉或武曲在辰、丑、未坐命：威名顯赫。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_WENQU_03` | combination | decade | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_WENQU_03 | 二曲貪狼限至午丑之訣（意外斷語，只保留原文）。 |  | — |
| `GY_A_CHANGQU_01` | combination | natal | general、career、promotion、wealth | verified | 可用 | CIT_GY_A_CHANGQU_01 | 文昌、文曲夾命：最為奇特（小注：不貴即富）。 | 長期而言較有機會承擔職位、被看見；長期而言在累積與管理資源上較有發揮 | aptitudeResponsibility（適合承擔責任）×2、aptitudeResources（擅長經營資源）×2 |
| `GY_A_CHANGQU_02` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_A_CHANGQU_02 | 文昌或文曲在丑未坐命，卯、酉時生：近天顏（貴）。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_CHANGQU_03` | combination | natal | general、career、promotion、wealth | verified | 可用 | CIT_GY_A_CHANGQU_03 | 文昌或文曲在巳亥坐命：不貴即富。 | 長期而言較有機會承擔職位、被看見；長期而言在累積與管理資源上較有發揮 | aptitudeResponsibility（適合承擔責任）×2、aptitudeResources（擅長經營資源）×2 |
| `GY_A_CHANGQU_04` | combination | natal | general | verified | 可用 | CIT_GY_A_CHANGQU_04 | 文昌、文曲與吉星在福德宮：為佳（小注：更得紫微居午宮妙）。 | 古籍評為有福；本 App 不把它轉成生活因素 | — |
| `GY_A_CHANGQU_05` | combination | natal | general、career | verified | 可用 | CIT_GY_A_CHANGQU_05 | 文昌或文曲落陷坐命，又逢擎羊、陀羅、地空、地劫：虛有名聲。 | 名義與實質可能落差較大，宜重實質內容 | aptitudeResources（擅長經營資源）×1 |
| `GY_A_CHANGQU_06` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_CHANGQU_06 | 昌曲陷於天傷：古籍斷為夭折（壽夭斷語，只保留原文）。 |  | — |
| `GY_A_CHANGQU_07` | combination | decade | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_CHANGQU_07 | 昌曲限逢辰戌之訣（意外斷語，只保留原文）。 |  | — |
| `GY_A_CHANGQU_08` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_CHANGQU_08 | 昌曲廉貞巳亥：古籍斷為遭刑、不善（刑獄、品格斷語，只保留原文）。 |  | — |
| `GY_A_CHANGQU_09` | combination | natal | general | verified | 可用 | CIT_GY_A_CHANGQU_09 | 文昌或文曲坐命，會祿存：尤為奇特。 | 古籍評為相宜；本 App 只列出，不轉成生活因素 | — |
| `GY_A_CHANGQU_10` | combination | natal | travel | verified | 可用 | CIT_GY_A_CHANGQU_10 | 文昌或文曲與破軍在寅卯坐命，又逢煞星沖：奔波。 | 外出與移動較多、較勞碌 | movementIncrease（移動變多）×1、stressLoad（身心壓力）×1 |
| `GY_A_CHANGQU_11` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_CHANGQU_11 | 昌曲左右會羊陀：身上有痣（身體斷語，只保留原文）。 |  | — |
| `GY_A_CHANGQU_12` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_CHANGQU_12 | 女命昌曲之訣（性別道德斷語，只保留原文）。 |  | — |
| `GY_A_WUQU_01` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_A_WUQU_01 | 武曲在廟垣（小注：辰戌丑未四墓）坐命：威名顯赫。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_WUQU_02` | combination | natal | general、exam、career、jobChange | verified | 可用 | CIT_GY_A_WUQU_02 | 武曲、破軍同坐命宮，又逢文昌、文曲：聰明巧藝。 | 長期而言學習與思考較有發揮；長期而言適合以專業技能、手藝發揮 | aptitudeStudy（重思考學習）×2 |
| `GY_A_WUQU_03` | combination | natal | travel、wealth | verified | 可用 | CIT_GY_A_WUQU_03 | 武曲坐命，祿（祿存或化祿）與天馬交會：在遠地發財。 | 外出或異地發展較有收穫 | aptitudeResources（擅長經營資源）×1 |
| `GY_A_WUQU_04` | combination | natal | general、career、wealth | verified | 可用 | CIT_GY_A_WUQU_04 | 武曲廟旺坐命，會天魁、天鉞：主管財賦之職。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_A_WUQU_05` | combination | natal | travel、wealth | verified | 可用 | CIT_GY_A_WUQU_05 | 武曲在遷移宮，吉星多：巨商高賈。 | 外出或異地發展較有收穫 | aptitudeResources（擅長經營資源）×1 |
| `GY_A_WUQU_06` | combination | natal | wealth、investment | verified | 可用 | CIT_GY_A_WUQU_06 | 武曲、貪狼同在財帛或田宅：資財橫發。 | 資源有機會在短時間內明顯增加，但起伏也大，宜及早鞏固 | aptitudeResources（擅長經營資源）×1、financialVolatility（財務波動）×1 |
| `GY_A_WUQU_07` | combination | natal | wealth、career | verified | 可用 | CIT_GY_A_WUQU_07 | 武曲坐命，會廉貞、貪狼、七殺：宜經商。 | 較有經商、做買賣的傾向 | aptitudeResources（擅長經營資源）×1 |
| `GY_A_WUQU_08` | combination | natal | general、career、jobChange | verified | 可用 | CIT_GY_A_WUQU_08 | 武曲、貪狼同坐命宮，加煞星或化忌：技藝之人。 | 長期而言適合以專業技能、手藝發揮 | aptitudeStudy（重思考學習）×1 |
| `GY_A_WUQU_09` | combination | natal | wealth、investment、general | verified | 可用 | CIT_GY_A_WUQU_09 | 武曲、破軍同坐命宮：家業起伏、勞碌。 | 財務起伏較大、不容易穩定累積；較容易操心、身心負荷偏重 | financialVolatility（財務波動）×1 |
| `GY_A_WUQU_09_H` | combination | natal | health | verified | 可用 | CIT_GY_A_WUQU_09 | 武曲、破軍同坐命宮：家業起伏、勞碌。 | 較容易操心、身心負荷偏重 | stressLoad（身心壓力）×1 |
| `GY_A_WUQU_10` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_WUQU_10 | 武曲破軍廉貞於卯：古籍意外斷語（只保留原文）。 |  | — |
| `GY_A_WUQU_11` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_WUQU_11 | 武曲劫煞會擎羊：古籍斷為因財持刀（只保留原文）。 |  | — |
| `GY_A_WUQU_12` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_WUQU_12 | 武曲羊陀火星：古籍斷為因財喪命（只保留原文）。 |  | — |
| `GY_A_WUQU_13` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_WUQU_13 | 武曲為寡宿（刑剋、性別角色斷語，只保留原文）。 |  | — |
| `GY_A_TANLANG_01` | combination | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_A_TANLANG_01 | 貪狼在辰戌丑未坐命，遇火星或鈴星：豪富、貴顯（小注：辰戌佳、丑未次之）。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_TANLANG_02` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_TANLANG_02 | 貪狼入廟之壽元斷語（只保留原文）。 |  | — |
| `GY_A_TANLANG_03` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_TANLANG_03 | 貪狼會煞無吉：古籍斷為屠宰（職業貴賤斷語，只保留原文）。 |  | — |
| `GY_A_TANLANG_04` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_TANLANG_04 | 貪狼子午卯酉：古籍盜竊斷語（品格斷語，只保留原文）。 |  | — |
| `GY_A_TANLANG_05` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_TANLANG_05 | 貪狼加吉坐長生之壽考斷語（只保留原文）。 |  | — |
| `GY_A_TANLANG_06` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_TANLANG_06 | 貪狼巳亥加煞：屠戶、遭刑斷語（只保留原文）。 |  | — |
| `GY_A_TANLANG_07` | combination | natal | wealth、general | pendingVerification | 未啟用：原文有疑字（兩輪核讀與決議仍無法確定） | CIT_GY_A_TANLANG_07 | 貪狼、武曲同坐命宮：晚年較好，三十歲後才發財。 | 成果較晚才顯現，宜長期累積 | aptitudeResources（擅長經營資源）×1 |
| `GY_A_TANLANG_08` | combination | natal | wealth | verified | 可用 | CIT_GY_A_TANLANG_08 | 貪狼、武曲同坐命宮：先難後富。 | 資源累積偏晚，前期較辛苦、後期較有收穫 | aptitudeResources（擅長經營資源）×1 |
| `GY_A_TANLANG_09` | combination | natal | general | verified | 可用 | CIT_GY_A_TANLANG_09 | 貪狼或武曲在申宮坐命又化忌：下格。 | 古籍評為格局較低；本 App 不把等第轉成生活因素 | — |
| `GY_A_TANLANG_10` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_TANLANG_10 | 貪狼加煞：古籍盜竊、淫佚斷語（只保留原文）。 |  | — |
| `GY_A_TANLANG_11` | combination | natal | general、career、jobChange | verified | 可用 | CIT_GY_A_TANLANG_11 | 貪狼或武曲在四生、四墓宮坐命，會破軍又逢化忌或煞星：百工皆通。 | 長期而言適合以專業技能、手藝發揮 | aptitudeStudy（重思考學習）×1 |
| `GY_A_TANLANG_12` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_TANLANG_12 | 貪武守身無吉：古籍壽夭斷語（只保留原文）。 |  | — |
| `GY_A_TANLANG_13` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_TANLANG_13 | 貪武破軍無吉：古籍迷酒斷語（品格斷語，只保留原文）。 |  | — |
| `GY_A_TANLANG_14` | combination | natal | wealth、career | verified | 可用 | CIT_GY_A_TANLANG_14 | 貪狼、太陰會命又逢煞星，並會天機、天梁：宜經商。 | 較有經商、做買賣的傾向 | aptitudeResources（擅長經營資源）×1 |
| `GY_A_TANLANG_15` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_TANLANG_15 | 貪狼廉貞同度（品格、性別道德斷語，只保留原文）。 |  | — |
| `GY_A_TANLANG_16` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_TANLANG_16 | 泛水桃花（品格斷語，只保留原文）。 |  | — |
| `GY_A_TANLANG_17` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_TANLANG_17 | 風流彩杖（品格斷語，只保留原文）。 |  | — |
| `GY_A_TANLANG_18` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_TANLANG_18 | 女命貪狼之訣（女命訣，只保留原文）。 |  | — |
| `GY_A_LIANZHEN_01` | combination | natal | general、career、jobChange | pendingVerification | 未啟用：原文有疑字（兩輪核讀與決議仍無法確定） | CIT_GY_A_LIANZHEN_01 | 廉貞在卯酉宮坐命加煞：公門或技藝之人（本段多疑字）。 | 長期而言適合以專業技能、手藝發揮 | aptitudeStudy（重思考學習）×1 |
| `GY_A_LIANZHEN_02` | combination | natal | general | pendingVerification | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_LIANZHEN_02 | 廉貞暗巨：古籍斷為吏而貪婪（品格斷語，只保留原文）。 |  | — |
| `GY_A_LIANZHEN_03` | combination | natal | general | verified | 可用 | CIT_GY_A_LIANZHEN_03 | 廉貞坐命，會貪狼、七殺、破軍，武曲在遷移（結果詞「作具戎」語意待確認）。 |  | — |
| `GY_A_LIANZHEN_04` | combination | natal | wealth | verified | 可用 | CIT_GY_A_LIANZHEN_04 | 廉貞、七殺同坐命宮而居廟旺：反為積富之人。 | 長期而言資源與收入較能累積 | aptitudeResources（擅長經營資源）×1 |
| `GY_A_LIANZHEN_05` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_LIANZHEN_05 | 廉貞破軍火星居陷：古籍死亡斷語（只保留原文）。 |  | — |
| `GY_A_LIANZHEN_06` | combination | natal | travel | verified | 可用 | CIT_GY_A_LIANZHEN_06 | 廉貞或七殺在巳亥坐命、兩星會照：流蕩在外。 | 外出與移動較多、較勞碌 | movementIncrease（移動變多）×1、stressLoad（身心壓力）×1 |
| `GY_A_LIANZHEN_07` | combination | natal | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_A_LIANZHEN_07 | 廉貞入廟會將軍：威猛。「將軍」屬博士十二神，客觀排盤沒有。 |  | — |
| `GY_A_LIANZHEN_08` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_LIANZHEN_08 | 廉貞四煞：刑戮斷語（只保留原文）。 |  | — |
| `GY_A_LIANZHEN_09` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_LIANZHEN_09 | 廉貞白虎：刑杖斷語（只保留原文）。 |  | — |
| `GY_A_LIANZHEN_10` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_LIANZHEN_10 | 廉貞破殺會遷移：死亡斷語（只保留原文）。 |  | — |
| `GY_A_LIANZHEN_11` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_LIANZHEN_11 | 廉貞羊殺居官祿：刑獄斷語（只保留原文）。 |  | — |
| `GY_A_LIANZHEN_12` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_LIANZHEN_12 | 廉貞清白（小注為女命之說，品格斷語，只保留原文）。 |  | — |
| `GY_A_JUMEN_01` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_A_JUMEN_01 | 巨門、太陽同在寅宮，命在申（對照）：先得名而後食祿。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_JUMEN_02` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_A_JUMEN_02 | 巨門、太陽同在寅宮坐命：食祿馳名。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_JUMEN_03` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_A_JUMEN_03 | 巨門、太陽同在申宮，命在寅（對照）：馳名食祿。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_JUMEN_04` | combination | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_A_JUMEN_04 | 巨門在子午坐命，三方有化科、化權、化祿：石中隱玉，福祿興隆。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_JUMEN_05` | combination | natal | general | verified | 可用 | CIT_GY_A_JUMEN_05 | 巨門、太陽同在申宮坐命：亦佳。 | 古籍評為相宜；本 App 只列出，不轉成生活因素 | — |
| `GY_A_JUMEN_06` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_A_JUMEN_06 | 太陽在巳宮坐命、巨門在亥宮對照：食祿馳名。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_JUMEN_07` | combination | natal | general | pendingVerification | 未啟用：原文有疑字（兩輪核讀與決議仍無法確定） | CIT_GY_A_JUMEN_07 | 太陽在亥宮坐命、巨門在巳宮對照：反為不佳。 | 古籍評為格局較低；本 App 不把等第轉成生活因素 | — |
| `GY_A_JUMEN_08` | combination | natal | general | verified | 可用 | CIT_GY_A_JUMEN_08 | 巨門、太陽在三方拱照（不在命宮），吉星多、太陽不陷：亦為奇（小注）。 | 古籍評為相宜；本 App 只列出，不轉成生活因素 | — |
| `GY_A_JUMEN_09` | combination | natal | general、career、promotion | pendingVerification | 未啟用：原文有疑字（兩輪核讀與決議仍無法確定） | CIT_GY_A_JUMEN_09 | 巨門、天機同在卯宮坐命，乙、辛、己、丙年生人：可至公卿（「巳」為疑字，依天干讀為「己」）。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_JUMEN_10` | combination | natal | general、career、wealth、decision | verified | 可用 | CIT_GY_A_JUMEN_10 | 巨門、天機同在酉宮坐命而化吉：縱有財官也不能持久。 | 成果不容易持久，需要定期檢視、及早鞏固 | weakeningTrend（後段吃力）×1 |
| `GY_A_JUMEN_11` | starInPalace | natal | general | verified | 可用 | CIT_GY_A_JUMEN_11 | 巨門在辰宮坐命，辛年生人：反為奇。 | 古籍評為相宜；本 App 只列出，不轉成生活因素 | — |
| `GY_A_JUMEN_12` | combination | natal | general | verified | 可用 | CIT_GY_A_JUMEN_12 | 巨門或天機在丑未坐命：下格。 | 古籍評為格局較低；本 App 不把等第轉成生活因素 | — |
| `GY_A_JUMEN_13` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_JUMEN_13 | 巨門陀羅：身上有痣（身體斷語，只保留原文）。 |  | — |
| `GY_A_JUMEN_14` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_JUMEN_14 | 巨門羊陀：疾病、品格斷語（只保留原文）。 |  | — |
| `GY_A_JUMEN_15` | combination | natal | general、career | verified | 可用 | CIT_GY_A_JUMEN_15 | 巨門落陷坐命，會四煞：不吉。 | 推進時較容易卡住、需要更多準備 | executionResistance（推進有阻力）×1 |
| `GY_A_JUMEN_16` | combination | decade | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_JUMEN_16 | 巨火羊陀逢惡限：死亡斷語（只保留原文）。 |  | — |
| `GY_A_JUMEN_17` | combination | decade | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_JUMEN_17 | 巨火鈴逢惡限：死亡斷語（只保留原文）。 |  | — |
| `GY_A_JUMEN_18` | combination | natal | general | verified | 未啟用：古文沒有足夠成立條件 | CIT_GY_A_JUMEN_18 | 巨門天機為破蕩。與 52L「巨機居卯……至公卿」相衝突，原文未說明何種廟陷或生年為破蕩，無法落成盤面條件（小注為女命之說）。 |  | — |
| `GY_A_QISHA_01` | starInPalace | natal | general、career、promotion | verified | 可用 | CIT_GY_A_QISHA_01 | 七殺在寅申子午坐命：一生爵祿榮昌（七殺朝斗格）。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_QISHA_02` | combination | natal | general | verified | 未啟用：古文沒有足夠成立條件 | CIT_GY_A_QISHA_02 | 七殺破軍專依羊鈴。句意不明（「虛」字義難定），無法落成盤面條件。 |  | — |
| `GY_A_QISHA_03` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_QISHA_03 | 七殺廉貞同位：死亡斷語（只保留原文）。 |  | — |
| `GY_A_QISHA_04` | combination | natal | travel、career | verified | 可用 | CIT_GY_A_QISHA_04 | 七殺或破軍坐命：宜往外發展；技藝方面不易精。 | 較適合往外發展；學技藝時宜專注一項 | movementIncrease（移動變多）×1、focusDisruption（容易被打斷）×1 |
| `GY_A_QISHA_05` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_QISHA_05 | 七殺臨身命逢流年刑忌：災傷斷語（只保留原文）。 |  | — |
| `GY_A_QISHA_06` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_QISHA_06 | 七殺臨絕地：夭折斷語（只保留原文）。 |  | — |
| `GY_A_QISHA_07` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_QISHA_07 | 七殺重逢四煞：傷殘、死亡斷語（只保留原文）。 |  | — |
| `GY_A_QISHA_08` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_QISHA_08 | 七殺火羊：貧賤、屠宰斷語（只保留原文）。 |  | — |
| `GY_A_QISHA_09` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_QISHA_09 | 七殺羊鈴流年白虎：刑戮斷語（只保留原文）。 |  | — |
| `GY_A_QISHA_10` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_QISHA_10 | 七殺流羊官符：刑配斷語（只保留原文）。 |  | — |
| `GY_A_QISHA_11` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_QISHA_11 | 七殺歲限擎羊：凶亡斷語（只保留原文）。 |  | — |
| `GY_A_QISHA_12` | combination | natal | general | verified | 未啟用：古文沒有足夠成立條件 | CIT_GY_A_QISHA_12 | 七殺沉吟，福不榮。「沉吟」沒有盤面定義（小注另有男女之說），無法落成盤面條件。 |  | — |
| `GY_A_QISHA_13` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_QISHA_13 | 七殺臨身：夭壽斷語（只保留原文）。 |  | — |
| `GY_A_QISHA_14` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_QISHA_14 | 七殺單居福德之女命訣（只保留原文）。 |  | — |
| `GY_A_POJUN_01` | starInPalace | natal | career、promotion | verified | 可用 | CIT_GY_A_POJUN_01 | 破軍在子午坐命，無煞星：官資清顯（小注：甲癸生人次之）。 | 長期而言在承擔職務、被看見上較有發揮 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_POJUN_02` | combination | natal | general | pendingVerification | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_POJUN_02 | 破軍貪狼逢祿馬（品格、性別道德斷語，只保留原文）。 |  | — |
| `GY_A_POJUN_03` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_POJUN_03 | 破軍巨門：死亡斷語（只保留原文）。 |  | — |
| `GY_A_POJUN_04` | combination | natal | travel | verified | 可用 | CIT_GY_A_POJUN_04 | 破軍坐命會火星、鈴星：奔波勞碌。 | 外出與移動較多、較勞碌 | movementIncrease（移動變多）×1、stressLoad（身心壓力）×1 |
| `GY_A_POJUN_05` | combination | natal | general | verified | 未啟用：古文沒有足夠成立條件 | CIT_GY_A_POJUN_05 | 破軍一曜性難明（小注：男女命論）。沒有盤面條件。 |  | — |
| `GY_A_POJUN_06` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_POJUN_06 | 破軍羊鈴在官祿：貧賤斷語（只保留原文）。 |  | — |
| `GY_A_QINGYANG_01` | combination | natal | general、wealth、career、promotion | pendingVerification | 未啟用：原文有疑字（兩輪核讀與決議仍無法確定） | CIT_GY_A_QINGYANG_01 | 擎羊入廟坐命，又加吉星：富貴聲揚。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_QINGYANG_02` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_A_QINGYANG_02 | 擎羊、火星同坐命宮：威權壓眾（小注：辰戌佳、丑未次之）。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_QINGYANG_03` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_QINGYANG_03 | （火星）守身命：傷殘斷語（只保留原文）。 |  | — |
| `GY_A_QINGYANG_04` | combination | natal | general | pendingVerification | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_QINGYANG_04 | 擎羊子午卯酉：夭折刑傷斷語（只保留原文）。 |  | — |
| `GY_A_QINGYANG_05` | combination | natal | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_A_QINGYANG_05 | 擎羊逢力士：難得封賞。「力士」屬博士十二神，客觀排盤沒有。 |  | — |
| `GY_A_QINGYANG_06` | combination | natal | wealth | verified | 可用 | CIT_GY_A_QINGYANG_06 | 擎羊、陀羅、火星或鈴星坐命，逢吉星：發財（逢凶則忌）。 | 長期而言資源與收入較能累積 | aptitudeResources（擅長經營資源）×1 |
| `GY_A_QINGYANG_07` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_QINGYANG_07 | 羊鈴坐命逢流年白虎：災傷斷語（只保留原文）。 |  | — |
| `GY_A_QINGYANG_08` | combination | natal | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_A_QINGYANG_08 | 擎羊對守酉宮，歲限羊陀迭併：凶。需要流年羊陀，客觀排盤沒有。 |  | — |
| `GY_A_QINGYANG_09` | combination | natal | general、career、wealth、decision | verified | 可用 | CIT_GY_A_QINGYANG_09 | 擎羊、陀羅夾命，命宮又有化忌：敗局（小注另有孤貧刑剋斷語，不採用）。 | 推進時較容易卡住、需要更多準備；起伏較大，有進有退 | executionResistance（推進有阻力）×1、instability（狀態不穩）×1 |
| `GY_A_QINGYANG_10` | combination | natal | general | pendingVerification | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_QINGYANG_10 | 羊陀流年鈴：破相斷語（身體斷語，只保留原文）。 |  | — |
| `GY_A_QINGYANG_11` | combination | natal | general | pendingVerification | 未啟用：原文有疑字（兩輪核讀與決議仍無法確定） | CIT_GY_A_QINGYANG_11 | 擎羊、火星同坐命宮：下格（本段為疑字）。 | 古籍評為格局較低；本 App 不把等第轉成生活因素 | — |
| `GY_A_QINGYANG_12` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_QINGYANG_12 | 擎羊重逢流羊：喪身斷語（只保留原文）。 |  | — |
| `GY_A_TUOLUO_01` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_TUOLUO_01 | 陀羅巳亥寅申：夭折刑傷斷語（只保留原文）。 |  | — |
| `GY_A_HUOLING_01` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_A_HUOLING_01 | 火星、鈴星會命：名振四方。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_HUOLING_02` | combination | natal | general、career、wealth、decision | verified | 可用 | CIT_GY_A_HUOLING_02 | 火星、鈴星夾命：敗局。 | 推進時較容易卡住、需要更多準備；起伏較大，有進有退 | executionResistance（推進有阻力）×1、instability（狀態不穩）×1 |
| `GY_A_HUOLING_03` | combination | natal | general | verified | 可用 | CIT_GY_A_HUOLING_03 | 火星或鈴星在廟旺之宮坐命：亦為福。 | 古籍評為有福；本 App 不把它轉成生活因素 | — |
| `GY_A_HUOLING_04` | combination | natal | general | verified | 可用 | CIT_GY_A_HUOLING_04 | 擎羊與火星或鈴星同坐命宮：下格（小注有疑字，並有夭折斷語）。 | 古籍評為格局較低；本 App 不把等第轉成生活因素 | — |
| `GY_A_KUIYUE_01` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_A_KUIYUE_01 | 天魁、天鉞夾命：奇格。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_KUIYUE_02` | combination | natal | general、exam、career、promotion | verified | 可用 | CIT_GY_A_KUIYUE_02 | 天魁或天鉞坐命：多科名（小注：在命身最妙、三方次之；本 App 只取命宮）。 | 長期而言學習與思考較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeStudy（重思考學習）×1、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_KUIYUE_03` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_A_KUIYUE_03 | 天魁天鉞、文昌文曲、祿存會命，無天刑與煞星沖：台輔之貴。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_KUIYUE_04` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_KUIYUE_04 | 魁鉞逢煞：痼疾斷語（疾病斷語，只保留原文）。 |  | — |
| `GY_A_KUIYUE_05` | combination | natal | general | verified | 可用 | CIT_GY_A_KUIYUE_05 | 天魁或天鉞與左輔、右弼同在命宮：有福。 | 古籍評為有福；本 App 不把它轉成生活因素 | — |
| `GY_A_ZUOYOU_01` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_A_ZUOYOU_01 | 左輔、右弼與文昌會命：位至台輔。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_ZUOYOU_02` | combination | natal | general、career、promotion、wealth | verified | 可用 | CIT_GY_A_ZUOYOU_02 | 左輔、右弼夾命：貴格（小注：不貴則大富）。 | 長期而言較有機會承擔職位、被看見；長期而言在累積與管理資源上較有發揮 | aptitudeResponsibility（適合承擔責任）×2、aptitudeResources（擅長經營資源）×2 |
| `GY_A_ZUOYOU_03` | combination | natal | general | verified | 可用 | CIT_GY_A_ZUOYOU_03 | 左輔或右弼在命宮或遷移宮：終身福厚（三方次之）。 | 古籍評為有福；本 App 不把它轉成生活因素 | — |
| `GY_A_ZUOYOU_04` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_A_ZUOYOU_04 | 左輔、右弼同坐命宮：貴顯。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_ZUOYOU_05` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_ZUOYOU_05 | 左右單守命宮：出身斷語（只保留原文）。 |  | — |
| `GY_A_ZUOYOU_06` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_ZUOYOU_06 | 左右廉貞擎羊：刑盜斷語（只保留原文）。 |  | — |
| `GY_A_ZUOYOU_07` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_ZUOYOU_07 | 左右昌曲逢羊陀：身上有痣（身體斷語，只保留原文）。 |  | — |
| `GY_A_ZUOYOU_08` | combination | natal | wealth | verified | 可用 | CIT_GY_A_ZUOYOU_08 | 左輔、右弼夾財帛或官祿宮，或分在財帛、官祿拱命：衣祿豐盈。 | 長期而言資源與收入較能累積 | aptitudeResources（擅長經營資源）×1 |
| `GY_A_ZUOYOU_09` | combination | natal | general | verified | 可用 | CIT_GY_A_ZUOYOU_09 | 左輔或右弼與天魁或天鉞同在命宮：有福（小注另有女命之說，不採用）。 | 古籍評為有福；本 App 不把它轉成生活因素 | — |
| `GY_A_ZUOYOU_10` | combination | natal | general | verified | 可用 | CIT_GY_A_ZUOYOU_10 | 右弼與天相同坐命宮：福來臨（小注：諸宮遇福）。 | 古籍評為有福；本 App 不把它轉成生活因素 | — |
| `GY_A_LUCUN_01` | combination | natal | general | verified | 未啟用：排盤起例等非判讀內容 | CIT_GY_A_LUCUN_01 | 祿存在各宮皆入廟（文字疑有脫訛，屬廟旺說明，不作判讀，也不寫入廟旺表）。 |  | — |
| `GY_A_LUCUN_02` | starInPalace | natal | wealth | verified | 可用 | CIT_GY_A_LUCUN_02 | 祿存守財帛或田宅：積玉堆金（小注：在命亦可，喜化祿同、科權更妙）。 | 長期而言在累積資源上較有發揮 | aptitudeResources（擅長經營資源）×2 |
| `GY_A_LUCUN_03` | combination | natal | general、wealth | verified | 可用 | CIT_GY_A_LUCUN_03 | 祿存在子午，位於遷移或命宮：利祿相宜。 | 長期而言在累積與管理資源上較有發揮 | aptitudeResources（擅長經營資源）×2 |
| `GY_A_LUCUN_04` | combination | natal | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_A_LUCUN_04 | 明祿暗祿：位至公卿。「暗祿」指六合宮之祿，目前的條件格式沒有六合關係。 |  | — |
| `GY_A_LUCUN_05` | combination | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_A_LUCUN_05 | 祿存與化祿在命宮三方重逢：終身富貴。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_LUCUN_06` | combination | natal | general、career、wealth、decision | verified | 可用 | CIT_GY_A_LUCUN_06 | 祿存或化祿在命宮，對宮有煞星或化忌沖破：吉也成凶。 | 起伏較大，有進有退 | instability（狀態不穩）×1 |
| `GY_A_LUCUN_07` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_A_LUCUN_07 | 祿存與化祿同守命宮：掌權。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_LUCUN_08` | starInPalace | natal | wealth | verified | 可用 | CIT_GY_A_LUCUN_08 | 祿存坐命：衣祿豐厚（小注另有女命之說，不採用）。 | 長期而言資源與收入較能累積 | aptitudeResources（擅長經營資源）×1 |
| `GY_A_TIANMA_01` | combination | natal | travel、wealth | verified | 可用 | CIT_GY_A_TIANMA_01 | 祿（祿存或化祿）與天馬在命宮三方交會：最佳（小注：忌見煞、截路空亡）。 | 外出或異地發展較有收穫 | aptitudeResources（擅長經營資源）×1 |
| `GY_A_TIANMA_02` | starInPalace | natal | relationship、marriage | verified | 可用 | CIT_GY_A_TIANMA_02 | 天馬在夫妻宮（四生之地）：伴侶富貴、得封贈。 | 古籍認為伴侶較有發展、可得名位；本 App 只列出，不轉成生活因素 | — |
| `GY_A_TIANMA_03` | combination | natal | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_A_TIANMA_03 | 天馬遇空亡：終身奔走。空亡不在客觀排盤中。 |  | — |
| `GY_A_KEQUANLU_01` | combination | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_A_KEQUANLU_01 | 化科、化權、化祿在命宮三方會合：富貴雙全。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_KEQUANLU_02` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_A_KEQUANLU_02 | 化祿、化權在命宮又會吉星：威權壓眾。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_KEQUANLU_03` | combination | natal | general、career、wealth | verified | 可用 | CIT_GY_A_KEQUANLU_03 | 化權、化祿在命宮三方重逢（無煞）：財官雙美（小注：凶聚也不美）。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_A_KEQUANLU_04` | combination | natal | general、exam、career、promotion | verified | 可用 | CIT_GY_A_KEQUANLU_04 | 化科在命、化權在三方朝命：登科。 | 長期而言學習與思考較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeStudy（重思考學習）×1、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_KEQUANLU_05` | combination | natal | general、career、exam | pendingVerification | 未啟用：原文有疑字（兩輪核讀與決議仍無法確定） | CIT_GY_A_KEQUANLU_05 | 命在子午，化祿在遷移（對宮）：文章冠世。 | 長期而言表達與文字較有發揮；長期而言學習與思考較有發揮 | aptitudeExpression（擅長表達）×1、aptitudeStudy（重思考學習）×1 |
| `GY_A_KEQUANLU_06` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_A_KEQUANLU_06 | 化科、化權、化祿其中兩種分在兄弟、父母宮夾命：貴格。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_KEQUANLU_07` | combination | natal | general、career | verified | 可用 | CIT_GY_A_KEQUANLU_07 | 化權、化祿在命宮三方重逢，但煞星湊合：虛有名聲。 | 名義與實質可能落差較大，宜重實質內容 | aptitudeResources（擅長經營資源）×1 |
| `GY_A_KEQUANLU_08` | combination | natal | general、exam、career | verified | 可用 | CIT_GY_A_KEQUANLU_08 | 化科在命宮，會擎羊、陀羅、地空、地劫：有潛力而不易兌現。 | 早期有潛力，但成果不易兌現，宜穩扎穩打 | lowReturnOnAction（主動出擊效益低）×1 |
| `GY_A_KEQUANLU_09` | combination | natal | general | verified | 未啟用：古文沒有足夠成立條件 | CIT_GY_A_KEQUANLU_09 | 祿主纏於弱地：命不主財。祿存沒有廟陷表、化祿星的「弱地」原文未定義，無法落成盤面條件。 |  | — |
| `GY_A_KEQUANLU_10` | combination | natal | general、wealth | verified | 可用 | CIT_GY_A_KEQUANLU_10 | 化權或化祿守財帛或福德宮：處世榮華。 | 長期而言在累積與管理資源上較有發揮；古籍評為有福；本 App 不把它轉成生活因素 | aptitudeResources（擅長經營資源）×2 |
| `GY_A_KEQUANLU_11` | combination | natal | career、social | verified | 可用 | CIT_GY_A_KEQUANLU_11 | 化權或化祿與吉星在交友（奴僕）宮：縱有官貴也奔波。 | 即使有職位，也較勞碌、常需照顧他人 | workloadIncrease（負荷增加）×1 |
| `GY_A_JIEKONG_01` | combination | natal | general、career、wealth、decision | verified | 可用 | CIT_GY_A_JIEKONG_01 | 地劫、地空夾命：敗局（小注另有貧、刑傷斷語，不採用）。 | 推進時較容易卡住、需要更多準備；起伏較大，有進有退 | executionResistance（推進有阻力）×1、instability（狀態不穩）×1 |
| `GY_A_JIEKONG_02` | combination | decade | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_JIEKONG_02 | 劫空臨限：喪亡斷語（只保留原文）。 |  | — |
| `GY_A_JIEKONG_03` | combination | natal | general、career、wealth、decision | verified | 可用 | CIT_GY_A_JIEKONG_03 | 地劫或地空坐命：如半天折翅，成果不易持久。 | 成果不容易持久，需要定期檢視、及早鞏固 | weakeningTrend（後段吃力）×1 |
| `GY_A_JIEKONG_04` | combination | natal | wealth、investment | verified | 可用 | CIT_GY_A_JIEKONG_04 | 地劫或地空在財帛或福德宮：財務起伏較大。 | 財務起伏較大、不容易穩定累積 | financialVolatility（財務波動）×1 |
| `GY_A_SHANGSHI_01` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_SHANGSHI_01 | 天傷加惡曜：困厄、喪亡斷語（只保留原文；天傷亦不在客觀排盤中）。 |  | — |
| `GY_A_MINGGONG_01` | combination | natal | general、career | verified | 可用 | CIT_GY_A_MINGGONG_01 | 三夾（地劫地空、火星鈴星、擎羊陀羅）夾命：凶。 | 推進時較容易卡住、需要更多準備 | executionResistance（推進有阻力）×1 |
| `GY_A_MINGGONG_02` | combination | natal | general、career、promotion | verified | 可用 | CIT_GY_A_MINGGONG_02 | 六夾（紫府、左右、昌曲、魁鉞、科權祿、日月）夾命：吉。 | 長期而言較有機會承擔職位、被看見 | aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_MINGGONG_03` | combination | natal | general | verified | 未啟用：宿命或不宜直接顯示的古代斷語，只保留原文 | CIT_GY_A_MINGGONG_03 | 命無正曜：過繼、出身斷語（只保留原文）。 |  | — |
| `GY_A_MINGGONG_04` | combination | natal | general | verified | 可用 | CIT_GY_A_MINGGONG_04 | 命宮有吉星：如松柏常青、不易凋零。 | 古籍評為相宜；本 App 只列出，不轉成生活因素 | — |
| `GY_A_MINGGONG_05` | period | decade | general、career、wealth、decision | verified | 可用 | CIT_GY_A_MINGGONG_05 | 大限命宮逢煞星：如桃柳易謝，好景不易持久。 | 這段時間變動與起伏較多 | instability（狀態不穩）×1 |
| `GY_A_MINGGONG_06` | period | decade | general、career | pendingVerification | 未啟用：原文有疑字（兩輪核讀與決議仍無法確定） | CIT_GY_A_MINGGONG_06 | 本命平常而大限三方有吉星：如旱苗得雨（小注：命限平常，限行美地為福）。 | 這段時間事情較容易推進 | progressOpportunity（推進機會）×1 |
| `GY_A_MINGGONG_07` | combination | natal | general | verified | 未啟用：古文沒有足夠成立條件 | CIT_GY_A_MINGGONG_07 | 命衰運弱：如嫩草遭霜。「命衰」「運弱」沒有盤面定義（小注另有刑傷死斷語）。 |  | — |
| `GY_A_MINGGONG_08` | combination | natal | wealth | verified | 可用 | CIT_GY_A_MINGGONG_08 | 命宮有吉星，但官祿宮煞星重：縱有財官也辛苦。 | 收入較需要靠持續投入心力 | workloadIncrease（負荷增加）×1 |
| `GY_A_SHENGONG_01` | combination | natal | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_A_SHENGONG_01 | 三夾身凶、六夾身吉。需要身宮位置，客觀排盤沒有。 |  | — |
| `GY_A_SHENGONG_02` | combination | natal | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_A_SHENGONG_02 | 身命俱吉：富貴雙全。需要身宮位置。 |  | — |
| `GY_A_SHENGONG_03` | combination | natal | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_A_SHENGONG_03 | 身吉命凶亦為美。需要身宮位置。 |  | — |
| `GY_A_SHENGONG_04` | combination | natal | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_A_SHENGONG_04 | 命弱身強：財源不聚。需要身宮位置。 |  | — |
| `GY_A_SHENGONG_05` | combination | natal | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_A_SHENGONG_05 | 貪武守身無吉：反不為良。需要身宮位置。 |  | — |
| `GY_A_NAYIN_01` | combination | natal | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_A_NAYIN_01 | 看納音墓庫在何宮。需要納音五行，客觀排盤沒有。 |  | — |
| `GY_A_NAYIN_02` | combination | natal | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_A_NAYIN_02 | 生逢敗地：發也虛花。需要納音五行長生十二位。 |  | — |
| `GY_A_NAYIN_03` | combination | natal | general | verified | 未啟用：需要客觀排盤沒有的資料（例：小限、斗君、空亡） | CIT_GY_A_NAYIN_03 | 絕處逢生：花而不敗。需要納音五行長生十二位。 |  | — |
| `GY_A_CAIBO_01` | combination | natal | general、wealth、career、promotion | verified | 可用 | CIT_GY_A_CAIBO_01 | 太陽、太陰夾財帛宮，財帛宮又有吉星：不貴則富。 | 長期而言在累積與管理資源上較有發揮；長期而言較有機會承擔職位、被看見 | aptitudeResources（擅長經營資源）×2、aptitudeResponsibility（適合承擔責任）×2 |
| `GY_A_CAIBO_02` | combination | natal | wealth | verified | 可用 | CIT_GY_A_CAIBO_02 | 左輔、右弼夾財帛或官祿，或分在財帛、官祿：衣祿豐隆。 | 長期而言資源與收入較能累積 | aptitudeResources（擅長經營資源）×1 |
| `GY_A_CAIZHAI_01` | combination | natal | general | pendingVerification | 未啟用：原文有疑字（兩輪核讀與決議仍無法確定） | CIT_GY_A_CAIZHAI_01 | 紫微與左輔或右弼在財帛宮（結果詞有疑字，待確認）。 |  | — |
| `GY_A_CAIZHAI_02` | combination | natal | general、career、wealth | verified | 可用 | CIT_GY_A_CAIZHAI_02 | 武曲或太陰在財帛宮：多任財賦之職（小注：財帛宮遇武曲）。 | 長期而言在經營資源與承擔職務上較有發揮空間 | aptitudeResources（擅長經營資源）×1、aptitudeResponsibility（適合承擔責任）×1 |
| `GY_A_CAIZHAI_03` | combination | natal | wealth | verified | 可用 | CIT_GY_A_CAIZHAI_03 | 天府（或紫微）與武曲在財帛宮，又有化權、化祿：富有。 | 長期而言在累積資源上較有發揮 | aptitudeResources（擅長經營資源）×2 |
| `GY_A_CAIZHAI_04` | combination | natal | wealth、investment | verified | 可用 | CIT_GY_A_CAIZHAI_04 | 武曲、貪狼同在財帛或田宅：資財橫發（小注：忌空亡）。 | 資源有機會在短時間內明顯增加，但起伏也大，宜及早鞏固 | aptitudeResources（擅長經營資源）×1、financialVolatility（財務波動）×1 |
| `GY_A_CAIZHAI_05` | starInPalace | natal | wealth | verified | 可用 | CIT_GY_A_CAIZHAI_05 | 祿存守財帛或田宅：堆金積玉。 | 長期而言在累積資源上較有發揮 | aptitudeResources（擅長經營資源）×2 |
| `GY_A_CAIFU_01` | combination | natal | general、wealth | verified | 可用 | CIT_GY_A_CAIFU_01 | 化權或化祿守財帛或福德宮：出世榮華。 | 長期而言在累積與管理資源上較有發揮；古籍評為有福；本 App 不把它轉成生活因素 | aptitudeResources（擅長經營資源）×2 |
| `GY_A_CAIFU_02` | combination | natal | wealth、investment | verified | 可用 | CIT_GY_A_CAIFU_02 | 地劫或地空在財帛或福德宮：財務起伏較大。 | 財務起伏較大、不容易穩定累積 | financialVolatility（財務波動）×1 |

## 引用（1210 筆）

| 引用 | 卷・篇・條目 | PDF 頁（版心） | 原文 | 白話翻譯 | 狀態 | 核對 |
|---|---|---|---|---|---|---|
| `CIT_QS_STAR_ZIWEI` | 卷二・一命宮・紫微 | p26（24） | 紫微土南北斗化帝座為官祿主紫微面紫色或白清腰背肥滿為人忠厚老成謙恭耿直其威制七殺降火鈴若與府左右昌曲日月祿馬三合極吉 | 紫微五行屬土，兼屬南北斗，化氣為「帝座」，是官祿（職位）之主。紫微坐命的人面色紫或白而清，腰背厚實，為人忠厚老成、謙恭耿直。紫微能制七殺、壓火星鈴星；若與天府、左輔右弼、文昌文曲、太陽太陰、祿存天馬在三合宮會照，最為吉利。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_QS_STAR_TIANJI` | 卷二・一命宮・天機 | p26（24） | 天機屬木南斗化善星為兄弟主入廟身長肥胖性急心慈機謀多變與天梁會合善談兵 | 天機屬木，屬南斗，化氣為「善星」，是兄弟之主。入廟時身形高大豐滿，性子急而心地慈善，善於謀劃、多變通；與天梁會合時，善於談論兵法謀略。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_QS_STAR_TAIYANG` | 卷二・一命宮・太陽 | p27（25） | 南北斗化貴為官祿主太陽入廟形貌堂堂雄壯面方圓滿夜生陷日生廟旺心慈面紫色好施濟 | （太陽）兼屬南北斗，化氣為「貴」，是官祿之主。太陽入廟，相貌堂堂、體格雄壯、臉型方圓飽滿；夜間出生為陷、白天出生為廟旺；心地慈善，面色紫，樂於施捨救濟。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_QS_STAR_WUQU` | 卷二・一命宮・武曲 | p27（25） | 武曲金北斗化財為財帛主武曲性剛果決心直無毒形小聲高而量大 | 武曲屬金，屬北斗，化氣為「財」，是財帛之主。武曲性格剛強果決，心直而無惡意，身形小、聲音大而度量大。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_QS_STAR_TIANTONG` | 卷二・一命宮・天同 | p27（25） | 天同水南斗化福為福德主天同入廟肥滿清明仁慈耿直 | 天同屬水，屬南斗，化氣為「福」，是福德之主。天同入廟，體態豐滿、清朗明白，仁慈耿直。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_QS_STAR_LIANZHEN` | 卷二・一命宮・廉貞 | p28（26） | 廉貞屬火北斗化次桃花殺囚星為官祿主為人身長體大眼露神光 | 廉貞屬火，屬北斗，化氣為「次桃花」，又稱殺星、囚星，是官祿之主。其人身材高大，眼神外露有光。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_QS_STAR_TIANFU` | 卷二・一命宮・天府 | p28（26） | 天府土南斗化令星為財帛主為人面方圓 | 天府屬土，屬南斗，化氣為「令星」，是財帛之主。其人臉型方圓。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_QS_STAR_TAIYIN` | 卷二・一命宮・太陰 | p29（27） | 太陰水南北斗化富為母宿又為妻星為田宅主太陰面方圓心性溫和清秀耿直聰明 | 太陰屬水，兼屬南北斗，化氣為「富」，為母親之星、又為妻星，是田宅之主。太陰坐命，臉型方圓，心性溫和，清秀耿直而聰明。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_QS_STAR_TANLANG` | 卷二・一命宮・貪狼 | p29（27） | 貪狼水北斗化桃花殺貪狼入廟長聳肥胖陷宮形小聲高而量大性格不常心多計較作事急速不耐靜 | 貪狼屬水，屬北斗，化氣為「桃花」殺星。貪狼入廟，身形高大豐滿；落陷時身形小、聲音大而度量大；性格變化不定，心中多所盤算，做事急快、不耐安靜。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_QS_STAR_JUMEN` | 卷二・一命宮・巨門 | p30（28） | 巨門水北斗化暗主是非入廟身長肥胖敦厚清秀不入廟五短瘦小作事進退疑惑多學少精與人寡合多是多非 | 巨門屬水，屬北斗，化氣為「暗」，主是非。入廟時身形高大豐滿、敦厚清秀；不入廟時身材矮小瘦削。做事進退猶疑，學得多而不精，與人不易相合，口舌是非較多。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_QS_STAR_TIANXIANG` | 卷二・一命宮・天相 | p30（28） | 天相水南斗化印為官祿主為人相貌敦厚持重清白好酒食衣祿豐足 | 天相屬水，屬南斗，化氣為「印」，是官祿之主。其人相貌敦厚、持重清白，喜好飲食，衣食豐足。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_QS_STAR_TIANLIANG` | 卷二・一命宮・天梁 | p31（29） | 天梁屬土南斗化蔭主壽星厚重清秀聰明耿直心無私曲好施濟 | 天梁屬土，屬南斗，化氣為「蔭」，是主壽之星。其人厚重清秀，聰明耿直，心無私曲，樂於施捨救濟。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_QS_STAR_QISHA` | 卷二・一命宮・七殺 | p31（29） | 七殺火金南斗將星遇帝為權餘宮皆殺目大性急不常 | 七殺屬火金，屬南斗，是將星；遇紫微（帝星）化為權，在其他情況都以殺星論。其人眼大，性急而變化不定。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_QS_STAR_POJUN` | 卷二・一命宮・破軍 | p31（29） | 破軍水北斗化耗星主妻子奴僕形五短背厚眉寬腰斜性剛寡合爭強 | 破軍屬水，屬北斗，化氣為「耗星」，主妻子與奴僕（部屬）。身形矮短、背厚眉寬、腰身不正；性格剛強、不易與人相合、好爭強。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_QS_PALACE_MING` | 卷二・一命宮・命宮 | p26（24） | 一命宮 | 「一命宮」：卷二論十二宮的首篇，其下逐星列出入命（男命、女命）與入限的吉凶訣。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_QS_PALACE_XIONGDI` | 卷三・二兄弟・兄弟 | p37（35） | 二兄弟紫微有倚靠年長之兄天府同三人天相同三四人 | 二、兄弟宮：紫微在此，有年長的兄長可以倚靠；與天府同宮約有三人，與天相同宮約三四人。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_QS_PALACE_FUQI` | 卷三・三妻妾・夫妻 | p37（35） | 三妻妾紫微晚聘諧老性剛天府同諧老天相同宜年少 | 三、妻妾宮（即夫妻宮）：紫微在此，宜晚婚、能白頭偕老，對方性情剛強；與天府同宮亦能偕老；與天相同宮，宜娶年紀較輕者。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_QS_PALACE_ZINV` | 卷三・四子女・子女 | p38（36） | 看子女先看本宮星宿主有幾子 | 四、子女宮：看子女，先看子女宮本宮的星宿，主有幾子。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_QS_PALACE_CAIBO` | 卷三・五財帛・財帛 | p39（37） | 五財帛紫微豐足倉箱加羊陀火鈴空劫不旺 | 五、財帛宮：紫微在此，錢財豐足、倉箱充實；若加擎羊、陀羅、火星、鈴星、地空、地劫，則不旺。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_QS_PALACE_JIE` | 卷三・六疾厄・疾厄 | p40（38） | 六疾厄先看命宮星曜落陷加羊陀火鈴空劫化忌守照如何又看疾厄 | 六、疾厄宮：先看命宮星曜是否落陷，是否有擎羊、陀羅、火星、鈴星、地空、地劫、化忌守照，再看疾厄宮。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_QS_PALACE_QIANYI` | 卷三・七遷移・遷移 | p40（38） | 七遷移紫微同左右出外貴人扶持發福天府同出入通達 | 七、遷移宮：紫微與左輔右弼同在，出外有貴人扶持而發福；與天府同宮，出入通達。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_QS_PALACE_JIAOYOU` | 卷三・八奴僕・交友 | p41（39） | 八奴僕紫微成行得力旺主生財 | 八、奴僕宮（即交友宮）：紫微在此，部屬成群而得力，旺者主生財。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_QS_PALACE_GUANLU` | 卷三・九官祿・官祿 | p42（40） | 九官祿紫微廟旺遇左右昌曲魁鉞 | 九、官祿宮：紫微廟旺，遇左輔右弼、文昌文曲、天魁天鉞……（其後論所至職位，未收入）。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_QS_PALACE_TIANZHAI` | 卷三・十田宅・田宅 | p43（41） | 十田宅紫微茂盛自置旺相 | 十、田宅宮：紫微在此，田產茂盛，能自行置產、旺相。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_QS_PALACE_FUDE` | 卷三・十一福德・福德 | p43（41） | 十一福德紫微福厚享福安樂天府天相同終身獲吉 | 十一、福德宮：紫微在此，福厚、享福安樂；與天府、天相同宮，終身獲吉。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_QS_PALACE_FUMU` | 卷三・十二父母・父母 | p44（42） | 十二父母 | 十二、父母宮（篇名；首句位於裝訂處、墨點多，尚未收入）。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_QS_PERIOD_DAXIAN` | 卷三・論大限十年禍福何如・大限 | p46（44） | 論大限十年禍福何如 | 「論大限十年禍福何如」：討論大限（每十年一限）的禍福如何判斷。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_QS_PERIOD_TAISUI` | 卷三・論二限太歲吉凶・大限／小限／太歲 | p46（44） | 須詳大限獨守吉凶何如小限獨守吉凶何如太歲獨守吉凶何如歲限俱凶則凶又看大限與小限相逢吉凶何如大限逢太歲吉凶何如小限逢太歲吉凶何如 | 必須分別詳看大限、小限、太歲各自所守的吉凶；太歲與限都凶，才論凶；再看大限與小限相逢、大限逢太歲、小限逢太歲時的吉凶如何。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_QS_PERIOD_TAISUI_CLASH` | 卷三・論二限太歲吉凶・大限／小限／太歲 | p46（44） | 又看太歲沖大限小限太歲沖羊陀七殺然後可斷吉凶 | 又要看太歲是否沖大限、小限，以及太歲是否沖擎羊、陀羅、七殺，然後才可以判斷吉凶。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_QS_RUGE` | 卷三・論人命入格・入格 | p45（43） | 如命入格廟旺聚吉科權祿守上上之命不入廟加吉化吉科權祿上次之命不入廟不加吉平常命入廟不加吉平等若居陷地又加殺化忌為下格之命不以入格而論也又入格不化吉而化凶只以本命吉凶多寡而斷之 | 命宮入格又廟旺，並有吉星、化科化權化祿守照，是上上之命；不入廟但加吉星與吉化，是其次；不入廟也不加吉，平常；入廟而不加吉，也只平平。若落陷又加煞星、化忌，是下格，不能以入格論。又入格而不化吉反化凶，只以本命吉凶的多寡來判斷。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_QS_GEXING` | 卷三・論格星數高下・格星 | p45（43） | 紫府與數相合何如紫微南北斗中天帝主天府乃南斗主又有陰陽相半者看陰陽不相半又數不相生為下格陰陽純駁為中格又三方四正皆吉星為上格吉凶相半守照為中格 | 紫微、天府與「數」相合如何？紫微是南北斗中天帝主，天府是南斗主，又有陰陽各半的情形。陰陽不各半、數又不相生，是下格；陰陽純駁，是中格。三方四正都是吉星為上格；吉凶各半守照為中格。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_QS_PERIOD_DAXIAN_TEXT` | 卷三・論大限十年禍福何如・大限 | p46（44） | 若限內有擎羊陀羅火鈴空劫忌星為伴成敗不一 | 若大限之內有擎羊、陀羅、火星、鈴星、地空、地劫或忌星相伴，這十年成敗不一。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_QS_PERIOD_DAXIAN_CALM` | 卷三・論大限十年禍福何如・大限 | p46（44） | 分星纏全吉廟旺得地無擎羊陀羅火鈴空劫者主十年安靜人財全美 | （大限）宮中星曜都吉、廟旺得地，又沒有擎羊、陀羅、火星、鈴星、地空、地劫的，主這十年安靜，人與財都順遂。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_QS_NANBEI` | 卷三・論行限分南北斗・行限 | p47（45） | 陰男陽女北斗為福北斗諸星吉凶大限斷上五年應小限斷上半年應南斗諸星吉凶大限斷下五年應小限斷下半年應 | 陰男陽女以北斗為福。北斗諸星的吉凶，大限應在前五年，小限應在前半年；南斗諸星的吉凶，大限應在後五年，小限應在後半年。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_QS_ANNUAL_TAISUI` | 卷三・論流年太歲逢吉凶星殺・流年太歲 | p47（45） | 凡太歲看三方對照星辰吉凶何如以定禍福太歲在命宮行者禍福尤緊如命在子宮太歲到子又癸生人逢吉則吉逢凶則凶 | 凡看太歲（流年），要看三方與對宮星辰的吉凶，以定禍福。太歲到命宮的那一年，禍福尤其明顯；例如命宮在子，太歲到子，又逢癸年生人，遇吉則吉、遇凶則凶。 | verified | 第一次單次目視轉錄＋v4 兩輪獨立目視轉錄與差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_ZIWEI_ZI_1` | 卷二・一命宮・紫微 | p26（24） | 子宮喜丁己庚生人貴格 | 紫微坐命在子宮，丁、己、庚年生人：古籍評為「貴格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_ZIWEI_ZI_2` | 卷二・一命宮・紫微 | p26（24） | 壬癸人不耐久 | 紫微坐命在子宮，壬、癸年生人：古籍評為「不耐久」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_ZIWEI_WU_1` | 卷二・一命宮・紫微 | p26（24） | 午宮入廟喜甲丁己生人財官格 | 紫微坐命在午宮，甲、丁、己年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_ZIWEI_WU_2` | 卷二・一命宮・紫微 | p26（24） | 丙戊人成敗帶疾 | 紫微坐命在午宮，丙、戊年生人：古籍評為「成敗帶疾」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_ZIWEI_MAOYOU_1` | 卷二・一命宮・紫微 | p26（24） | 卯酉宮旺貪狼同乙辛生人貴 | 紫微坐命在卯、酉宮，乙、辛年生人：古籍評為「貴」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_ZIWEI_MAOYOU_2` | 卷二・一命宮・紫微 | p26（24） | 甲庚生人不耐久 | 紫微坐命在卯、酉宮，甲、庚年生人：古籍評為「不耐久」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_ZIWEI_YINSHEN` | 卷二・一命宮・紫微 | p26（24） | 寅申宮旺地與天府同甲庚丁己生人財官格 | 紫微坐命在寅、申宮，甲、庚、丁、己年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_ZIWEI_SIHAI` | 卷二・一命宮・紫微 | p26（24） | 巳亥宮旺地與七殺同乙戊生人財官格 | 紫微坐命在巳、亥宮，乙、戊年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_ZIWEI_CHENXU` | 卷二・一命宮・紫微 | p26（24） | 辰戌宮得地與天相同乙己甲庚癸人財官格 | 紫微坐命在辰、戌宮，乙、己、甲、庚、癸年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_ZIWEI_CHOUWEI` | 卷二・一命宮・紫微 | p26（24） | 丑未入廟與破軍同甲庚丁己乙壬人財官格 | 紫微坐命在丑、未宮，甲、庚、丁、己、乙、壬年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_ZIWEI_M1` | 卷二・一命宮・紫微 | p26（24） | 紫微天中第一星命相身遇福財興若還相佐宮中會富貴雙全播令名 | 紫微是天中第一星，命宮遇之福財興旺；若再有輔佐之星會合，富貴雙全、名聲遠播。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_ZIWEI_M2` | 卷二・一命宮・紫微 | p26（24） | 紫微守命最為良二殺逢之壽不長羊陀火鈴來相會只好空門禮梵王 | 紫微守命本佳；逢煞則古籍斷為壽短、宜空門（壽夭與出家斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_ZIWEI_M3` | 卷二・一命宮・紫微 | p26（24） | 紫微辰戌遇破軍富而不貴有虛名 | 紫微在辰戌宮、對宮破軍：富而不貴、有虛名。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_ZIWEI_M4` | 卷二・一命宮・紫微 | p26（24） | 若逢貪狼在卯酉為臣失義不相應 | 紫微在卯酉與貪狼同宮：古籍斷為「為臣失義」（道德斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_ZIWEI_M5` | 卷二・一命宮・紫微 | p26（24） | 火鈴羊陀來相會七殺同宮多不貴斯人孤獨更刑傷若是空門為吉利 | 紫微、七殺同宮再會煞：古籍斷為孤獨刑傷、宜空門（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_ZIWEI_F1` | 卷二・一命宮・紫微 | p26（24） | 紫微女命守身宮天府尊星同到宮更得吉星同主照金冠封贈福滔滔 | 女命紫微之訣（以受封贈論女命，屬性別角色斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_ZIWEI_F2` | 卷二・一命宮・紫微 | p26（24） | 紫微女命守夫宮三方吉拱便為榮 | 女命紫微之訣（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_ZIWEI_L1` | 卷二・一命宮・紫微 | p26（24） | 紫微垣內吉星臨二限相逢福祿興 | 大限命宮有紫微，又有吉星同臨：福祿興旺。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_ZIWEI_L2` | 卷二・一命宮・紫微 | p26（24） | 紫微入限本為祥只恐三方殺破狼 | 紫微入限本是吉祥；只怕三方有七殺、破軍、貪狼會照（原文後半有疑字，只取可確認部分）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANJI_ZIWU` | 卷二・一命宮・天機 | p26（24） | 子午宮入廟丁己癸甲庚壬生人財官格 | 天機坐命在子、午宮，丁、己、癸、甲、庚、壬年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANJI_MAOYOU` | 卷二・一命宮・天機 | p26（24） | 卯酉宮旺地巨門同乙辛戊癸生人財官格 | 天機坐命在卯、酉宮，乙、辛、戊、癸年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANJI_YINSHEN` | 卷二・一命宮・天機 | p26（24） | 寅申宮得地太陰同丁己甲庚癸生人財官格 | 天機坐命在寅、申宮，丁、己、甲、庚、癸年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANJI_SIHAI` | 卷二・一命宮・天機 | p26（24） | 巳亥宮和平丙壬戊生人合局不耐久 | 天機坐命在巳、亥宮，丙、壬、戊年生人：古籍評為「合局不耐久」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANJI_CHOUWEI_1` | 卷二・一命宮・天機 | p26（24） | 丑未宮陷地丙戊丁壬生人財官格 | 天機坐命在丑、未宮，丙、戊、丁、壬年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANJI_CHOUWEI_2` | 卷二・一命宮・天機 | p26（24） | 乙壬生人祿合格 | 天機坐命在丑、未宮，乙、壬年生人：古籍評為「祿合格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANJI_M1` | 卷二・一命宮・天機 | p26（24） | 機月天梁合太陽常人富足置田庄 | 天機坐命，太陰、天梁、太陽在三方四正：常人也富足置產。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANJI_M2` | 卷二・一命宮・天機 | p26（24） | 官員得遇科權祿職位高遷面帝王 | （同上格局）再得化科、化權、化祿：職位高升。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANJI_F1` | 卷二・一命宮・天機 | p26（24） | 天機女命吉星扶作事操持過丈夫權祿宮中逢守照榮膺誥命貴如何 | 女命天機之訣（以誥命論女命，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANJI_F2` | 卷二・一命宮・天機 | p26（24） | 天機星與太陰同女命逢之必巧容衣祿豐饒終不美為娼為妾主淫風 | 女命天機太陰之訣（性別道德斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANJI_L1` | 卷二・一命宮・天機 | p26（24） | 男女二限值天機祿主科權大有為出入經營多遇貴發財發福少人知 | 大限命宮有天機，又逢化祿、化權、化科：大有作為、經營多遇貴人、發財發福。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYANG_N1` | 卷二・一命宮・太陽 | p27（25） | 六庚生人命坐卯宮第一廟所六壬次之 | 庚年生人太陽坐命卯宮，是第一等的廟地；壬年生人次之。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYANG_N2` | 卷二・一命宮・太陽 | p27（25） | 命在亥甲生人下局 | 太陽坐命亥宮、甲年生人：下局。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYANG_N3` | 卷二・一命宮・太陽 | p27（25） | 廟旺終身富貴 | 太陽坐命廟旺：終身富貴。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYANG_N4` | 卷二・一命宮・太陽 | p27（25） | 陷地雖化權祿也凶官祿亦不顯先勤終懶成敗不一 | 太陽坐命落陷：即使化權化祿也不理想，職位不顯、先勤後懶、成敗不一。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYANG_N5` | 卷二・一命宮・太陽 | p27（25） | 與羊陀沖破又陷下局橫發橫破不耐久 | 太陽落陷又有擎羊、陀羅沖破：橫發橫破、不耐久。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYANG_ZIWU_1` | 卷二・一命宮・太陽 | p27（25） | 子宮陷午宮旺丁己生人財官格 | 太陽坐命在子、午宮，丁、己年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYANG_ZIWU_2` | 卷二・一命宮・太陽 | p27（25） | 壬丙戊生人悔吝 | 太陽坐命在子、午宮，壬、丙、戊年生人：古籍評為「悔吝」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYANG_MAOYOU_1` | 卷二・一命宮・太陽 | p27（25） | 卯官廟酉和平乙辛生人財官格 | 太陽坐命在卯、酉宮，乙、辛年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYANG_MAOYOU_2` | 卷二・一命宮・太陽 | p27（25） | 甲庚人困 | 太陽坐命在卯、酉宮，甲、庚年生人：古籍評為「困」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYANG_CHOUWEI_1` | 卷二・一命宮・太陽 | p27（25） | 丑宮陷未宮得地太陰同加吉星財官格 | 太陽坐命在丑、未宮（另有附帶條件）：古籍評為「丑宮陷未宮得地太陰同加吉星財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYANG_CHOUWEI_2` | 卷二・一命宮・太陽 | p27（25） | 辰宮旺財官格 | 太陽坐命在辰宮：古籍評為「辰宮旺財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYANG_CHOUWEI_3` | 卷二・一命宮・太陽 | p27（25） | 戌宮陷反背孤寡 | 太陽坐命在戌宮：古籍評為「戌宮陷反背孤寡」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYANG_M1` | 卷二・一命宮・太陽 | p27（25） | 命裡陽逢福壽濃更兼權祿兩相逢魁昌左右來相湊富貴雙全比石崇 | 太陽坐命，又逢化權、化祿，並有魁鉞、文昌、左右會合：富貴雙全。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYANG_M2` | 卷二・一命宮・太陽 | p27（25） | 日月丑未命中逢三方無化福難豐 | 太陽、太陰在丑未坐命，三方沒有化祿權科：福分難以豐厚。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYANG_M3` | 卷二・一命宮・太陽 | p27（25） | 失陷太陽居反背化忌逢之多蹇昧又招橫事破家財命強化祿也無害 | 太陽失陷又化忌：多阻滯、易有意外耗財；若命宮強又化祿則無妨。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYANG_F1` | 卷二・一命宮・太陽 | p27（25） | 太陽正照婦人身姿貌殊常性格貞更得吉星同主照金冠封贈作夫人 | 女命太陽之訣（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYANG_F2` | 卷二・一命宮・太陽 | p27（25） | 太陽安命有奇能陷地須防要殺凌作事沈吟多進退辛勤度日免家傾 | 女命太陽之訣（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYANG_F3` | 卷二・一命宮・太陽 | p27（25） | 太陽反照主心忙衣祿平常壽不長剋過良人還剋子只宜陰下作偏房 | 女命太陽之訣（壽夭、刑剋與偏房斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYANG_L1` | 卷二・一命宮・太陽 | p27（25） | 二限偏宜見太陽添財進業福非常婚姻和合添嗣續仕者高遷坐廟堂 | 大限命宮見太陽（不落陷）：添財進業、婚姻和合、仕途高升。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYANG_L2` | 卷二・一命宮・太陽 | p27（25） | 太陽守限有多般陷地須防惡殺侵加忌逢凶多阻滯橫事破財家伶仃 | 太陽守大限而落陷，又有煞星或化忌：多阻滯、易有意外破財。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WUQU_N1` | 卷二・一命宮・武曲 | p27（25） | 最喜甲己生人福厚 | 武曲坐命，最喜甲、己年生人，福厚。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WUQU_N2` | 卷二・一命宮・武曲 | p27（25） | 入廟與昌曲同行則出將入相武職最旺 | 武曲入廟又與文昌、文曲同行：文武皆可發揮，武職最旺。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WUQU_N3` | 卷二・一命宮・武曲 | p27（25） | 會貪遇火化吉為上格 | 武曲會貪狼、遇火星又化吉：上格。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WUQU_N4` | 卷二・一命宮・武曲 | p27（25） | 與府相梁月祿馬會主貴 | 武曲與天府、天相、天梁、太陰、祿存、天馬會合：主貴。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WUQU_N5` | 卷二・一命宮・武曲 | p27（25） | 陷地巧藝之人 | 武曲落陷：適合以巧藝技術謀生。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WUQU_N6` | 卷二・一命宮・武曲 | p27（25） | 更遇廉貞破軍羊忌空劫沖破下局破祖敗家 | 武曲落陷又遇廉貞、破軍、擎羊、化忌、地空地劫沖破：起伏大、難守成。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WUQU_ZIWU` | 卷二・一命宮・武曲 | p27（25） | 子午宮旺地天府同丁己生人財官格 | 武曲坐命在子、午宮，丁、己年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WUQU_MAOYOU` | 卷二・一命宮・武曲 | p27（25） | 卯酉宮利益與七殺同乙辛生人財官格 | 武曲坐命在卯、酉宮，乙、辛年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WUQU_M1` | 卷二・一命宮・武曲 | p27（25） | 武曲守命化為權吉曜來臨福壽全志氣崢嶸多出眾 | 武曲守命化權，又有吉星：志氣高、出眾。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WUQU_M2` | 卷二・一命宮・武曲 | p27（25） | 武曲之星守命宮吉星守照始昌榮 | 武曲守命，要有吉星守照才昌榮。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WUQU_F1` | 卷二・一命宮・武曲 | p27（25） | 女人武曲命中逢天府加之志氣雄左右祿來相逢聚雙全富貴美無窮 | 女命武曲之訣（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WUQU_F2` | 卷二・一命宮・武曲 | p27（25） | 將星一宿最剛強女命逢之性異常衣祿滔滔終有破不然壽夭主凶亡 | 女命武曲之訣（壽夭斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WUQU_L1` | 卷二・一命宮・武曲 | p27（25） | 大小限逢武曲星若還入廟主財興 | 大限逢武曲入廟：財運興旺。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WUQU_L2` | 卷二・一命宮・武曲 | p27（25） | 更加文昌臨左右福祿雙全得稱心 | （武曲入限）再有文昌、左右：福祿雙全。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WUQU_L3` | 卷二・一命宮・武曲 | p27（25） | 武曲臨限化權星最利求謀事有成 | 大限武曲化權：最利求謀，事情容易成。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WUQU_L4` | 卷二・一命宮・武曲 | p27（25） | 武曲之星主官人公吏逢之刑杖來常庶逢之還負債 | 武曲入限對不同身分吉凶各異；原文沒有給出盤面條件。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANTONG_ZIWU` | 卷二・一命宮・天同 | p28（26） | 子旺午陷宮丁己癸辛生人財官格 | 天同坐命在子、午宮，丁、己、癸、辛年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANTONG_MAOYOU` | 卷二・一命宮・天同 | p28（26） | 卯酉宮和平乙丙辛生人財官格 | 天同坐命在卯、酉宮，乙、丙、辛年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANTONG_YINSHEN` | 卷二・一命宮・天同 | p28（26） | 寅宮利申宮旺天梁同乙甲丁生人福厚 | 天同坐命在寅、申宮，乙、甲、丁年生人：古籍評為「福厚」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANTONG_SIHAI` | 卷二・一命宮・天同 | p28（26） | 巳亥宮入廟壬丙戊生人財官格 | 天同坐命在巳、亥宮，壬、丙、戊年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANTONG_CHENXU_1` | 卷二・一命宮・天同 | p28（26） | 辰戌和平丙丁生人利達 | 天同坐命在辰、戌宮，丙、丁年生人：古籍評為「利達」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANTONG_CHENXU_2` | 卷二・一命宮・天同 | p28（26） | 庚癸生人福不耐久 | 天同坐命在辰、戌宮，庚、癸年生人：古籍評為「福不耐久」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANTONG_CHOUWEI` | 卷二・一命宮・天同 | p28（26） | 丑未宮不得地巨門同乙壬甲丙辛庚生人財官格 | 天同坐命在丑、未宮，乙、壬、甲、丙、辛、庚年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANTONG_M1` | 卷二・一命宮・天同 | p28（26） | 若是福人居廟旺定教食祿譽傳揚 | 天同坐命廟旺：食祿、名聲遠揚。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANTONG_M2` | 卷二・一命宮・天同 | p28（26） | 天同若與吉星逢性格聰明百事通 | 天同與吉星相逢：聰明、百事通達。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANTONG_M3` | 卷二・一命宮・天同 | p28（26） | 天同守命落閑宮火陀殺合更為凶天機梁月來相會只好空門度歲中 | 天同落閑宮逢煞：古籍斷為宜空門（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANTONG_F1` | 卷二・一命宮・天同 | p28（26） | 天同守命婦人身性格聰明伶俐人昌曲更來相會處悠悠財祿自天申 | 女命天同之訣（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANTONG_F2` | 卷二・一命宮・天同 | p28（26） | 天同若與太陰同女命逢之淫巧容衣祿雖豐終不美偏房侍妾與人通 | 女命天同太陰之訣（性別道德斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANTONG_L1` | 卷二・一命宮・天同 | p28（26） | 人生二限值天同喜氣盈門萬事通財祿增添宜創造從今家道自豐隆 | 大限逢天同（不落陷）：喜事多、萬事通、財祿增添、宜開創。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANTONG_L2` | 卷二・一命宮・天同 | p28（26） | 流年二限值天同陷地須防惡殺沖作事美中終不美惟防官破及家傾 | 大限天同落陷又逢煞星沖：做事美中不足，防口舌與破耗。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_LIANZHEN_ZIWU` | 卷二・一命宮・廉貞 | p28（26） | 子午宮和平天相同丁己甲生人財官格 | 廉貞坐命在子、午宮，丁、己、甲年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_LIANZHEN_MAOYOU` | 卷二・一命宮・廉貞 | p28（26） | 卯酉宮和平乙辛生人癸生人破軍同吉 | 廉貞坐命在卯、酉宮，乙、辛、癸年生人：古籍評為「癸生人破軍同吉」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_LIANZHEN_YINSHEN_1` | 卷二・一命宮・廉貞 | p28（26） | 寅宮和平甲庚己生人為貴格 | 廉貞坐命在寅宮，甲、庚、己年生人：古籍評為「為貴格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_LIANZHEN_YINSHEN_2` | 卷二・一命宮・廉貞 | p28（26） | 申宮入廟甲庚戊生人為貴格 | 廉貞坐命在申宮，甲、庚、戊年生人：古籍評為「為貴格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_LIANZHEN_YINSHEN_3` | 卷二・一命宮・廉貞 | p28（26） | 丙生人次之 | 廉貞坐命在申宮，丙年生人：古籍評為「次之」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_LIANZHEN_CHOUWEI` | 卷二・一命宮・廉貞 | p28（26） | 丑未宮利益七殺同加吉星財官格 | 廉貞坐命在丑、未宮（另有附帶條件）：古籍評為「丑未宮利益七殺同加吉星財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_LIANZHEN_CHENXU` | 卷二・一命宮・廉貞 | p28（26） | 辰戌宮利益天府同甲庚生人財官格 | 廉貞坐命在辰、戌宮，甲、庚年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_LIANZHEN_SIHAI` | 卷二・一命宮・廉貞 | p28（26） | 巳亥宮陷地甲己丙戊人福不耐久 | 廉貞坐命在巳、亥宮，甲、己、丙、戊年生人：古籍評為「福不耐久」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_LIANZHEN_M1` | 卷二・一命宮・廉貞 | p28（26） | 廉貞守命亦非常賦性巍巍志氣剛革故鼎新官大貴 | 廉貞守命（無煞）：志氣剛強、能革新，官貴。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_LIANZHEN_M2` | 卷二・一命宮・廉貞 | p28（26） | 廉貞坐命號閑宮貪破擎羊火更中縱有財官為不美平生何以得從容 | 廉貞坐閑宮，又逢貪狼、破軍、擎羊、火星：縱有財官也不美、難從容。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_LIANZHEN_M3` | 卷二・一命宮・廉貞 | p28（26） | 廉貞落陷入閑宮吉曜相逢也有凶腰足災殘難脫厄更加惡殺命該終 | 廉貞落陷逢煞：古籍斷為災殘、命終（疾病與死亡斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_LIANZHEN_F1` | 卷二・一命宮・廉貞 | p28（26） | 女人身命值廉貞內政清廉格局新諸吉拱照無殺破定教封贈在青春 | 女命廉貞之訣（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_LIANZHEN_F2` | 卷二・一命宮・廉貞 | p28（26） | 廉貞貪破曲相逢陀火交加極賤編定主刑夫并剋子只好通房娼婢容 | 女命廉貞之訣（貧賤、刑剋與性別道德斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_LIANZHEN_L1` | 卷二・一命宮・廉貞 | p28（26） | 廉貞入限旺宮臨喜逢吉曜福駢臻財物自然多蓄積任人得意位高陞 | 大限廉貞在旺宮又逢吉星：財物蓄積、職位上升。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_LIANZHEN_L2` | 卷二・一命宮・廉貞 | p28（26） | 大小二限遇廉貞更有天刑忌雙侵膿血刑災逃不得破軍貪殺赴幽冥 | 大限廉貞逢天刑、化忌：古籍斷為血光、死亡（只保留原文）。 | pendingVerification | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANFU_N1` | 卷二・一命宮・天府 | p28（26） | 喜紫微昌曲左右祿存魁鉞權祿居廟旺必中高第 | 天府廟旺，喜紫微、昌曲、左右、祿存、魁鉞、化權祿：必中高第。 | pendingVerification | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANFU_N2` | 卷二・一命宮・天府 | p28（26） | 命坐寅午戌亥卯未六己生人權貴 | 天府坐命寅午戌、亥卯未宮，己年生人：權貴。 | verified | 兩輪獨立目視轉錄＋差異回影像決議＋第二來源佐證（AI，非人工校勘） 2026-10-04 |
| `CIT_GY_TIANFU_N3` | 卷二・一命宮・天府 | p28（26） | 若巳酉丑乙丙戊辛人文武財官格 | 天府坐命巳酉丑宮，乙丙戊辛年生人：文武財官格。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANFU_N4` | 卷二・一命宮・天府 | p28（26） | 加亥卯未辰酉上安命者甲庚人不貴先大後小有始無終 | 天府在亥卯未辰酉安命，甲庚年生人：先大後小、有始無終。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANFU_ZIWU` | 卷二・一命宮・天府 | p29（27） | 子午宮旺與武曲同丁己癸生人為福財官格 | 天府坐命在子、午宮，丁、己、癸年生人：古籍評為「為福財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANFU_MAOYOU` | 卷二・一命宮・天府 | p29（27） | 卯酉入廟酉宮旺地乙丙辛生人財官格 | 天府坐命在卯、酉宮，乙、丙、辛年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANFU_YINSHEN` | 卷二・一命宮・天府 | p29（27） | 寅入廟申宮得地紫微同丁己生人財官格 | 天府坐命在寅、申宮，丁、己年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANFU_CHENXU` | 卷二・一命宮・天府 | p29（27） | 辰戌宮入廟廉貞同甲庚壬生人財官格 | 天府坐命在辰、戌宮，甲、庚、壬年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANFU_CHOUWEI` | 卷二・一命宮・天府 | p29（27） | 丑未入廟加吉星財官格 | 天府坐命在丑、未宮（另有附帶條件）：古籍評為「丑未入廟加吉星財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANFU_SIHAI` | 卷二・一命宮・天府 | p29（27） | 巳亥宮得地乙丙戊辛生人財官格 | 天府坐命在巳、亥宮，乙、丙、戊、辛年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANFU_M1` | 卷二・一命宮・天府 | p29（27） | 天府之星守命宮加之權祿喜相逢魁昌左右來相會附鳳扳龍上九重 | 天府守命逢權祿，又有魁鉞、文昌、左右會合：得貴人提攜而上。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANFU_M2` | 卷二・一命宮・天府 | p29（27） | 火鈴羊陀三方會為人奸詐多勞碌 | 天府三方會火鈴羊陀：多勞碌（原文另有「奸詐」的品格斷語，不採用）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANFU_F1` | 卷二・一命宮・天府 | p29（27） | 女人天府命身宮性格聰明花樣容更得紫微三合照金冠霞帔受皇封 | 女命天府之訣（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANFU_F2` | 卷二・一命宮・天府 | p29（27） | 火鈴擎陀來沖會性格庸常多晦滯六親相背子難招只好空門為尼計 | 女命天府之訣（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANFU_L1` | 卷二・一命宮・天府 | p29（27） | 限臨天府能司祿士庶逢之多發福添財進喜永無災 | 大限逢天府：多發福、添財進喜。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANFU_L2` | 卷二・一命宮・天府 | p29（27） | 若還文化科權祿指日欣然展大材 | （天府入限）若再逢化科、化權、化祿：能施展才能。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYIN_N1` | 卷二・一命宮・太陰 | p29（27） | 陷地化吉科權祿返凶 | 太陰落陷，即使化科權祿反而不吉。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYIN_N2` | 卷二・一命宮・太陰 | p29（27） | 最喜六壬戊生人在亥卯未宮立命合局 | 太陰在亥卯未宮坐命，壬、戊年生人：合局。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYIN_N3` | 卷二・一命宮・太陰 | p29（27） | 乙庚戊入亥宮立命上格六丁人次之 | 太陰在亥宮坐命，乙庚戊年生人：上格；丁年生人次之。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYIN_ZICHOUYIN` | 卷二・一命宮・太陰 | p29（27） | 子丑寅宮入廟丁戊生人財官格 | 太陰坐命在子、丑、寅宮，丁、戊年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYIN_MAOCHENSI` | 卷二・一命宮・太陰 | p29（27） | 卯辰巳宮陷地乙壬戊生人孤寡不耐久 | 太陰坐命在卯、辰、巳宮，乙、壬、戊年生人：古籍評為「孤寡不耐久」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYIN_WUWEISHEN` | 卷二・一命宮・太陰 | p29（27） | 午宮陷未申宮利益丁庚甲生人財官格 | 太陰坐命在未、申宮，丁、庚、甲年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYIN_YOUXUHAI_1` | 卷二・一命宮・太陰 | p29（27） | 酉戌亥宮入廟丙丁人財官格 | 太陰坐命在酉、戌、亥宮，丙、丁年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYIN_YOUXUHAI_2` | 卷二・一命宮・太陰 | p29（27） | 吉星眾大貴 | 太陰坐命在酉、戌、亥宮（另有附帶條件）：古籍評為「吉星眾大貴」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYIN_M1` | 卷二・一命宮・太陰 | p29（27） | 太陰入廟化權星清秀聰明邁等倫稟性溫良恭儉讓為官清顯列朝紳 | 太陰入廟化權：聰明、為官清顯。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYIN_M2` | 卷二・一命宮・太陰 | p29（27） | 寅上機昌曲月逢縱然吉拱不豐隆男為僕從女為妓 | 寅宮機昌曲月之訣（貧賤與性別斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYIN_M3` | 卷二・一命宮・太陰 | p29（27） | 太陽陷地惡星中陀火相逢定困窮此命只宜僧與道 | 日月陷地逢煞之訣（貧窮、出家斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYIN_F1` | 卷二・一命宮・太陰 | p29（27） | 月會同陽在命宮三方吉拱必盈豐不見凶殺來沖會富貴雙全保到終 | 女命太陰之訣（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYIN_F2` | 卷二・一命宮・太陰 | p29（27） | 太陰陷在命和身不喜三方惡殺侵剋害夫君壽又夭更虛血氣少精神 | 女命太陰之訣（刑剋、壽夭斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYIN_L1` | 卷二・一命宮・太陰 | p29（27） | 太陰星曜限中逢財祿豐盈百事通嫁娶親迎添嗣續常人得此旺門風 | 大限逢太陰（不落陷）：財祿豐盈、百事通達、婚嫁喜事。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYIN_L2` | 卷二・一命宮・太陰 | p29（27） | 火鈴若也來相湊未免官災病患臨 | （太陰入限）若火星、鈴星來會：難免口舌是非與身體負荷。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TAIYIN_L3` | 卷二・一命宮・太陰 | p29（27） | 限至太陰居反背不喜羊陀三殺會火鈴二限最為凶若不官災多破悔 | 大限太陰落陷又逢羊陀火鈴：不是官非就是破耗。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TANLANG_N1` | 卷二・一命宮・貪狼 | p29（27） | 入廟多居武藝之中 | 貪狼入廟：多在武藝、技能中發揮。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TANLANG_N2` | 卷二・一命宮・貪狼 | p29（27） | 遇火鈴喜戊己生人合局 | 貪狼遇火星、鈴星，戊己年生人：合局。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TANLANG_N3` | 卷二・一命宮・貪狼 | p29（27） | 不喜六癸生人不耐久長 | 貪狼坐命，癸年生人：不耐久。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TANLANG_ZIWU_1` | 卷二・一命宮・貪狼 | p29（27） | 子午宮旺地丁己生人福厚 | 貪狼坐命在子、午宮，丁、己年生人：古籍評為「福厚」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TANLANG_ZIWU_2` | 卷二・一命宮・貪狼 | p29（27） | 丙午庚生寅申人下局 | 貪狼坐命在子、午宮：古籍評為「下局」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TANLANG_MAOYOU_1` | 卷二・一命宮・貪狼 | p29（27） | 卯酉宮利益紫微同見火星貴 | 貪狼坐命在卯、酉宮（另有附帶條件）：古籍評為「卯酉宮利益紫微同見火星貴」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TANLANG_MAOYOU_2` | 卷二・一命宮・貪狼 | p29（27） | 乙辛己人宜之財官格 | 貪狼坐命在卯、酉宮，乙、辛、己年生人：古籍評為「宜之財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TANLANG_YINSHEN` | 卷二・一命宮・貪狼 | p29（27） | 寅申宮和平庚生人財官格 | 貪狼坐命在寅、申宮，庚年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TANLANG_CHOUWEI` | 卷二・一命宮・貪狼 | p29（27） | 丑未宮入廟武曲同見火星戊己庚生人貴格 | 貪狼坐命在丑、未宮，戊、己、庚年生人（另有附帶條件）：古籍評為「貴格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TANLANG_CHENXU` | 卷二・一命宮・貪狼 | p29（27） | 辰戌入廟戊己生人財官格 | 貪狼坐命在辰、戌宮，戊、己年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TANLANG_SIHAI` | 卷二・一命宮・貪狼 | p29（27） | 巳亥宮陷地廉貞同丙戊壬生人為福不耐久 | 貪狼坐命在巳、亥宮，丙、戊、壬年生人：古籍評為「為福不耐久」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TANLANG_M1` | 卷二・一命宮・貪狼 | p29（27） | 四墓宮中福氣濃提兵指日立邊功火星拱會誠為貴 | 貪狼在辰戌丑未坐命福氣濃；再有火星拱會，更為貴顯。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TANLANG_M2` | 卷二・一命宮・貪狼 | p29（27） | 貪狼守命同羊宮陀殺交加必困窮 | 貪狼與擎羊同宮，又逢陀羅等煞星交加：多困頓。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TANLANG_M3` | 卷二・一命宮・貪狼 | p29（27） | 武破廉貞同殺劫百藝防身度歲終 | 貪狼與武曲、破軍、廉貞及煞星同見：宜以多種技藝謀生。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TANLANG_M4` | 卷二・一命宮・貪狼 | p29（27） | 四墓貪狼廟旺宮加臨左右富財翁 | 貪狼在辰戌丑未廟旺，又有左輔右弼：富。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TANLANG_M5` | 卷二・一命宮・貪狼 | p29（27） | 若然再化科權祿文武材能顯大功 | （上格）再化科、權、祿：文武才能顯著。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TANLANG_F1` | 卷二・一命宮・貪狼 | p30（28） | 四墓宮中多吉利更逢左右方為貴祿財豐富旺夫君性格剛強多志氣 | 女命貪狼之訣（以旺夫論女命，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TANLANG_F2` | 卷二・一命宮・貪狼 | p30（28） | 貪狼陷地女非祥衣食雖豐也不良剋害良人并子女又教衾枕守孤孀 | 女命貪狼之訣（刑剋斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TANLANG_L1` | 卷二・一命宮・貪狼 | p30（28） | 北斗貪狼入限來若還入廟事和諧 | 大限貪狼入廟：事情和諧。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TANLANG_L2` | 卷二・一命宮・貪狼 | p30（28） | 科權仕路多成就必主當年發橫財 | （貪狼入限入廟）再逢化科、化權：仕途多成就、財運突出。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TANLANG_L3` | 卷二・一命宮・貪狼 | p30（28） | 貪狼主限四墓臨更喜人生四墓生若見火星多橫發 | 大限貪狼在辰戌丑未，又是辰戌丑未年生人，再見火星：多橫發。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TANLANG_L4` | 卷二・一命宮・貪狼 | p30（28） | 限至貪狼陷不良只宜節慾息災傷賭蕩風流去財寶吉曜三方可免災 | 大限貪狼落陷：宜節制、防耗財；三方有吉星可免災。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TANLANG_L5` | 卷二・一命宮・貪狼 | p30（28） | 女限貪狼事不良宜懷六甲免災殃若無吉曜來相會須知一命入泉鄉 | 女命貪狼入限之訣（死亡斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_JUMEN_N1` | 卷二・一命宮・巨門 | p30（28） | 不入廟五短瘦小作事進退疑惑多學少精與人寡合多是多非 | 巨門不入廟：做事容易猶豫進退、學得多精得少、與人不易相合、是非多。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_JUMEN_N2` | 卷二・一命宮・巨門 | p30（28） | 六癸六辛生人坐子卯合局 | 巨門坐命子、卯宮，癸辛年生人：合局。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_JUMEN_N3` | 卷二・一命宮・巨門 | p30（28） | 六庚六丁生人辰戌安命却不富貴 | 巨門在辰戌安命，庚丁年生人：不富貴。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_JUMEN_ZIWU_1` | 卷二・一命宮・巨門 | p30（28） | 子午宮旺地丁己癸辛生人福厚 | 巨門坐命在子、午宮，丁、己、癸、辛年生人：古籍評為「福厚」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_JUMEN_ZIWU_2` | 卷二・一命宮・巨門 | p30（28） | 丙戊生人主困 | 巨門坐命在子、午宮，丙、戊年生人：古籍評為「主困」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_JUMEN_MAOYOU_1` | 卷二・一命宮・巨門 | p30（28） | 卯酉宮入廟乙辛生人財官格 | 巨門坐命在卯、酉宮，乙、辛年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_JUMEN_MAOYOU_2` | 卷二・一命宮・巨門 | p30（28） | 丁戊生人有成敗 | 巨門坐命在卯、酉宮，丁、戊年生人：古籍評為「有成敗」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_JUMEN_YINSHEN` | 卷二・一命宮・巨門 | p30（28） | 寅申宮入廟太陽同甲庚癸辛生人財官格 | 巨門坐命在寅、申宮，甲、庚、癸、辛年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_JUMEN_CHENXU_1` | 卷二・一命宮・巨門 | p30（28） | 辰戌宮和平癸辛生人貴 | 巨門坐命在辰、戌宮，癸、辛年生人：古籍評為「貴」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_JUMEN_CHENXU_2` | 卷二・一命宮・巨門 | p30（28） | 丁生人困 | 巨門坐命在辰、戌宮，丁年生人：古籍評為「困」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_JUMEN_CHOUWEI` | 卷二・一命宮・巨門 | p30（28） | 丑未不得地癸辛丙生人財官格 | 巨門坐命在丑、未宮，癸、辛、丙年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_JUMEN_SIHAI` | 卷二・一命宮・巨門 | p30（28） | 巳亥旺宮癸辛生人財官格 | 巨門坐命在巳、亥宮，癸、辛年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_JUMEN_M1` | 卷二・一命宮・巨門 | p30（28） | 巨門子午二宮逢局中得遇以為榮三合化吉科權祿官高極品衣紫袍 | 巨門在子午坐命，三合有化科權祿：官高位顯。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_JUMEN_M2` | 卷二・一命宮・巨門 | p30（28） | 此星化暗不宜逢更會凶星愈肆凶 | 巨門化氣為暗，再會凶星更凶；入廟則可和平（原文另有唇齒受傷之說，不採用）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_JUMEN_M3` | 卷二・一命宮・巨門 | p30（28） | 巨門守命遇擎羊鈴火逢之事不祥為人性急多顛倒 | 巨門守命遇擎羊、鈴星、火星：性急、做事易反覆。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_JUMEN_F1` | 卷二・一命宮・巨門 | p30（28） | 巨門旺地多生吉左右加臨壽更長女人得此誠為貴簾捲珍珠坐繡房 | 女命巨門之訣（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_JUMEN_F2` | 卷二・一命宮・巨門 | p30（28） | 巨門命陷主淫娼侍女偏房始免殃相貌清奇多近寵不然壽夭主凶亡 | 女命巨門之訣（性別道德、壽夭斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_JUMEN_L1` | 卷二・一命宮・巨門 | p30（28） | 巨門主限化權星最喜求謀大事成雖有官災并口舌凶為吉兆得安寧 | 大限巨門化權：利於求謀大事；即使有口舌也能轉為安寧。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_JUMEN_L2` | 卷二・一命宮・巨門 | p30（28） | 巨門入限動人愁若遇喪門事不周 | 大限巨門遇喪門：多煩憂（喪門屬歲前諸星，本 App 客觀排盤沒有此星）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_JUMEN_L3` | 卷二・一命宮・巨門 | p30（28） | 巨門限陷最乖張無事官非鬧一場 | 大限巨門落陷：容易無端惹上是非（原文另有哭泣喪事之說，不採用）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANXIANG_N1` | 卷二・一命宮・天相 | p30（28） | 紫府昌曲日月嘉會財官雙美位至三公 | 天相與紫微、天府、文昌、文曲、太陽、太陰相會：財官雙美。 | verified | 兩輪獨立目視轉錄＋差異回影像決議＋第二來源佐證（AI，非人工校勘） 2026-10-04 |
| `CIT_GY_TIANXIANG_N2` | 卷二・一命宮・天相 | p30（28） | 與武破羊陀同行則為巧藝 | 天相與武曲、破軍、擎羊、陀羅同行：適合巧藝技術。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANXIANG_N3` | 卷二・一命宮・天相 | p30（28） | 更加火鈴巨機則傷刑不善終 | 天相再加火鈴巨機：古籍斷為傷刑、不善終（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANXIANG_ZIWU` | 卷二・一命宮・天相 | p30（28） | 子午宮廟地廉貞同丁己癸甲人財官格 | 天相坐命在子、午宮，丁、己、癸、甲年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANXIANG_MAOYOU_1` | 卷二・一命宮・天相 | p30（28） | 卯酉陷宮乙辛生人吉 | 天相坐命在卯、酉宮，乙、辛年生人：古籍評為「吉」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANXIANG_MAOYOU_2` | 卷二・一命宮・天相 | p30（28） | 甲庚人主困 | 天相坐命在卯、酉宮，甲、庚年生人：古籍評為「主困」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANXIANG_CHENXU` | 卷二・一命宮・天相 | p30（28） | 辰戌宮得地紫微同財官格 | 天相坐命在辰、戌宮：古籍評為「辰戌宮得地紫微同財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANXIANG_CHOUWEI` | 卷二・一命宮・天相 | p30（28） | 丑宮入廟未宮得地加吉星財官格 | 天相坐命在丑、未宮（另有附帶條件）：古籍評為「丑宮入廟未宮得地加吉星財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANXIANG_YINSHEN` | 卷二・一命宮・天相 | p30（28） | 寅申宮入廟武曲同丁甲庚生人財官格 | 天相坐命在寅、申宮，丁、甲、庚年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANXIANG_SIHAI` | 卷二・一命宮・天相 | p30（28） | 巳亥宮得地丙戊壬生人為福 | 天相坐命在巳、亥宮，丙、戊、壬年生人：古籍評為「為福」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANXIANG_M1` | 卷二・一命宮・天相 | p30（28） | 天相星辰邁等倫照守身命善無垠為官必主居元宰 | 天相守命（無煞）：為官能居要職。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANXIANG_M2` | 卷二・一命宮・天相 | p30（28） | 財官祿主旺家資權壓當時誰不美 | 天相逢祿（化祿或祿存）：家資旺、有權勢。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANXIANG_M3` | 卷二・一命宮・天相 | p30（28） | 天相之星破武同羊陀火鈴更為凶或作技術經商輩 | 天相與破軍、武曲同見，又逢羊陀火鈴：宜作技術或經商。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANXIANG_F1` | 卷二・一命宮・天相 | p30（28） | 女人之命天相星性格聰明百事盈衣祿豐盈財帛足旺夫貴子顯門庭 | 女命天相之訣（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANXIANG_F2` | 卷二・一命宮・天相 | p30（28） | 破軍七殺來相會羊陀火鈴最所忌孤刑剋害六親無只可偏房與侍婢 | 女命天相之訣（刑剋與性別斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANXIANG_L1` | 卷二・一命宮・天相 | p31（29） | 天相之星敢主財照臨二限悉無災動作謀為皆遂意 | 大限逢天相：無災、所謀皆遂意。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANXIANG_L2` | 卷二・一命宮・天相 | p31（29） | 天相之星有幾般三方不喜惡星纏羊陀空劫重相會口舌官災禍亦連 | 大限天相，三方有羊陀空劫：口舌官非。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANXIANG_L3` | 卷二・一命宮・天相 | p31（29） | 限臨天相遇擎羊作禍興殃不可當更有火鈴諸殺湊須教一命入泉鄉 | 大限天相遇擎羊諸煞：古籍斷為死亡（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANLIANG_N1` | 卷二・一命宮・天梁 | p31（29） | 與天機同行居翰院善談兵 | 天梁與天機同行：善於謀略、議論。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANLIANG_N2` | 卷二・一命宮・天梁 | p31（29） | 左右昌曲嘉會則出將入相要入廟方富貴 | 天梁與左右、昌曲會合且入廟：富貴。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANLIANG_N3` | 卷二・一命宮・天梁 | p31（29） | 陷地遇火羊破局則下賤孤寒夭折 | 天梁陷地遇火羊：古籍斷為下賤孤寒夭折（只保留原文）。 | pendingVerification | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANLIANG_N4` | 卷二・一命宮・天梁 | p31（29） | 六壬生人亥卯未上安命者富貴雙全 | 天梁在亥卯未坐命，壬年生人：富貴雙全。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANLIANG_ZIWU` | 卷二・一命宮・天梁 | p31（29） | 子午宮入廟丁己癸生人福厚財官格 | 天梁坐命在子、午宮，丁、己、癸年生人：古籍評為「福厚財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANLIANG_MAOYOU` | 卷二・一命宮・天梁 | p31（29） | 卯宮入廟酉宮得地太陽同乙壬辛生人財官格 | 天梁坐命在卯、酉宮，乙、壬、辛年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANLIANG_YINSHEN` | 卷二・一命宮・天梁 | p31（29） | 寅宮入廟申宮陷地天同同丁己甲庚生人財官格 | 天梁坐命在寅、申宮，丁、己、甲、庚年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANLIANG_CHENXU` | 卷二・一命宮・天梁 | p31（29） | 辰戌宮入廟天機同丁己壬庚生人財官格 | 天梁坐命在辰、戌宮，丁、己、壬、庚年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANLIANG_CHOUWEI_1` | 卷二・一命宮・天梁 | p31（29） | 丑未宮入廟壬乙生人財官格 | 天梁坐命在丑、未宮，壬、乙年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANLIANG_CHOUWEI_2` | 卷二・一命宮・天梁 | p31（29） | 六戊生人大貴 | 天梁坐命在丑、未宮，戊年生人：古籍評為「大貴」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANLIANG_M1` | 卷二・一命宮・天梁 | p31（29） | 天梁之曜數中強形神穩重性溫良左右曲昌來會合管教富貴列朝綱 | 天梁坐命穩重溫良，左右、昌曲會合：富貴。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANLIANG_M2` | 卷二・一命宮・天梁 | p31（29） | 天梁星宿壽星逢機日文昌左右同子午寅申為入廟官資清顯至三公 | 天梁在子午寅申入廟，與天機、太陽、文昌、左右同會：官資清顯。 | verified | 兩輪獨立目視轉錄＋差異回影像決議＋第二來源佐證（AI，非人工校勘） 2026-10-04 |
| `CIT_GY_TIANLIANG_M3` | 卷二・一命宮・天梁 | p31（29） | 天梁遇火落閑宮陀殺重逢更是凶 | 天梁落閑宮遇火星、陀羅等煞：更凶（原文另有孤刑帶疾之說，不採用）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANLIANG_M4` | 卷二・一命宮・天梁 | p31（29） | 辰戌機梁非小補 | 天梁、天機在辰戌同宮：助益不小。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANLIANG_M5` | 卷二・一命宮・天梁 | p31（29） | 破軍卯酉不為良女人得此為孤獨剋子刑夫守冷房 | 破軍卯酉之訣（刑剋斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANLIANG_L1` | 卷二・一命宮・天梁 | p31（29） | 天梁化蔭吉星和二限逢之福必多若逢吉曜加廟地貴極一品輔山河 | 大限天梁與吉星相和：福多；再入廟：貴顯。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANLIANG_L2` | 卷二・一命宮・天梁 | p31（29） | 限至天梁最是良猶如秋菊吐馨香加官進職迎新祿 | 大限逢天梁：加官進職、迎來新的收入。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANLIANG_L3` | 卷二・一命宮・天梁 | p31（29） | 若遇火鈴羊陀合須防一厄 | （天梁入限）若遇火鈴羊陀會合：需防一難（原文另有「家亡」之說，不採用）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_QISHA_ZIWU` | 卷二・一命宮・七殺 | p31（29） | 子午宮旺地丁己甲生人財官格 | 七殺坐命在子、午宮，丁、己、甲年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_QISHA_MAOYOU` | 卷二・一命宮・七殺 | p31（29） | 卯酉宮旺地武曲同乙辛生人福厚財官格 | 七殺坐命在卯、酉宮，乙、辛年生人：古籍評為「福厚財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_QISHA_YINSHEN` | 卷二・一命宮・七殺 | p31（29） | 寅申宮入廟甲庚丁己人財官格 | 七殺坐命在寅、申宮，甲、庚、丁、己年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_QISHA_SIHAI` | 卷二・一命宮・七殺 | p31（29） | 巳亥宮和平紫微同丙戊壬生人福厚 | 七殺坐命在巳、亥宮，丙、戊、壬年生人：古籍評為「福厚」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_QISHA_CHENXU` | 卷二・一命宮・七殺 | p31（29） | 辰戌宮入廟加吉星財官格 | 七殺坐命在辰、戌宮（另有附帶條件）：古籍評為「辰戌宮入廟加吉星財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_QISHA_CHOUWEI` | 卷二・一命宮・七殺 | p31（29） | 丑未入廟廉貞同加吉星財官格 | 七殺坐命在丑、未宮（另有附帶條件）：古籍評為「丑未入廟廉貞同加吉星財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_QISHA_M1` | 卷二・一命宮・七殺 | p31（29） | 七殺寅申子午宮西夷拱手服英雄 | 七殺在寅申子午坐命：英雄有威。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_QISHA_M2` | 卷二・一命宮・七殺 | p31（29） | 魁鉞左右文昌會科祿名高食萬鍾 | （七殺寅申子午）再有魁鉞、左右、文昌會合並逢科祿：名高祿厚。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_QISHA_M3` | 卷二・一命宮・七殺 | p31（29） | 殺居陷地不堪言凶禍猶如伴虎眠若是殺強無制伏少年惡死在黃泉 | 七殺陷地之訣（死亡斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_QISHA_M4` | 卷二・一命宮・七殺 | p31（29） | 七殺坐命落閑宮巨宿羊陀更照沖若不傷肢必損骨空門僧道可興隆 | 七殺閑宮之訣（傷殘斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_QISHA_F1` | 卷二・一命宮・七殺 | p31（29） | 女命愁逢七殺星平生作事果聰明氣高志大無男女不免刑夫歷苦辛 | 女命七殺之訣（刑剋斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_QISHA_F2` | 卷二・一命宮・七殺 | p31（29） | 七殺孤星貪宿逢火陀湊合非為貴女人得此性不良只好偏房為使婢 | 女命七殺之訣（性別道德斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_QISHA_L1` | 卷二・一命宮・七殺 | p31（29） | 二限雖然逢七殺從容和緩家道發對宮天府正來朝仕宦逢之名顯達 | 大限逢七殺、對宮天府來朝（無煞）：從容和緩、家道發達、名聲顯達。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_QISHA_L2` | 卷二・一命宮・七殺 | p31（29） | 七殺之星主啾唧作事艱難俱有失更加惡曜在限中主有官災多病疾 | 大限七殺又有惡曜：做事艱難、易有口舌與身心負荷。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_POJUN_N1` | 卷二・一命宮・破軍 | p31（29） | 性剛寡合爭強 | 破軍坐命：性剛、不易與人相合、好爭強。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_POJUN_N2` | 卷二・一命宮・破軍 | p31（29） | 喜紫微有威權 | 破軍喜與紫微同宮：有威權。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_POJUN_N3` | 卷二・一命宮・破軍 | p31（29） | 六癸甲生人坐子午宮者位至三公 | 破軍在子午坐命，癸甲年生人：位高。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_POJUN_N4` | 卷二・一命宮・破軍 | p31（29） | 丙戊生人坐辰戌丑未紫微同垣富貴不小 | 破軍在辰戌丑未坐命與紫微同宮，丙戊年生人：富貴不小。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_POJUN_ZIWU_1` | 卷二・一命宮・破軍 | p31（29） | 子午宮入廟丁己癸生人福厚 | 破軍坐命在子、午宮，丁、己、癸年生人：古籍評為「福厚」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_POJUN_ZIWU_2` | 卷二・一命宮・破軍 | p31（29） | 丙戊人主困 | 破軍坐命在子、午宮，丙、戊年生人：古籍評為「主困」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_POJUN_MAOYOU_1` | 卷二・一命宮・破軍 | p31（29） | 卯酉宮陷地廉貞同乙辛癸生人利 | 破軍坐命在卯、酉宮，乙、辛、癸年生人：古籍評為「利」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_POJUN_MAOYOU_2` | 卷二・一命宮・破軍 | p31（29） | 甲庚丙人不耐久 | 破軍坐命在卯、酉宮，甲、庚、丙年生人：古籍評為「不耐久」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_POJUN_CHENXU` | 卷二・一命宮・破軍 | p32（30） | 辰戌旺宮甲癸庚生人為福 | 破軍坐命在辰、戌宮，甲、癸、庚年生人：古籍評為「為福」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_POJUN_YINSHEN` | 卷二・一命宮・破軍 | p32（30） | 寅申宮得地甲庚丁己生人財官格 | 破軍坐命在寅、申宮，甲、庚、丁、己年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_POJUN_CHOUWEI` | 卷二・一命宮・破軍 | p32（30） | 丑未宮旺地紫微同丙戊乙生人財官格 | 破軍坐命在丑、未宮，丙、戊、乙年生人：古籍評為「財官格」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_POJUN_SIHAI` | 卷二・一命宮・破軍 | p32（30） | 巳亥和平武曲同丙戊生人福厚 | 破軍坐命在巳、亥宮，丙、戊年生人：古籍評為「福厚」。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_POJUN_M1` | 卷二・一命宮・破軍 | p32（30） | 破軍七殺與貪狼入廟英雄不可當 | 破軍入廟（與七殺、貪狼三合）：英雄不可當。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_POJUN_M2` | 卷二・一命宮・破軍 | p32（30） | 破軍子午會文昌左右雙雙入廟廊財帛豐盈多慷慨祿官昭著佐君王 | 破軍在子午，會文昌、左右：財帛豐盈、官祿昭著。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_POJUN_M3` | 卷二・一命宮・破軍 | p32（30） | 破軍一曜最難當化祿科權喜異常 | 破軍化祿、科、權：大喜。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_POJUN_M4` | 卷二・一命宮・破軍 | p32（30） | 若還陷地仍加殺破祖離宗出遠鄉 | 破軍落陷又加煞：離開原生環境、到外地發展。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_POJUN_M5` | 卷二・一命宮・破軍 | p32（30） | 破軍不喜在身宮廉貞火羊陀會凶不見傷殘的夭壽只宜僧道度平生 | 破軍身宮之訣（傷殘壽夭斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_POJUN_F1` | 卷二・一命宮・破軍 | p32（30） | 破軍子午為入廟女命逢之福壽昌性格有能偏出眾旺夫益子姓名香 | 女命破軍之訣（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_POJUN_F2` | 卷二・一命宮・破軍 | p32（30） | 破軍女命不宜逢擎羊加陷便為凶剋害良人非一次須教悲哭度朝昏 | 女命破軍之訣（刑剋斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_POJUN_L1` | 卷二・一命宮・破軍 | p32（30） | 破軍入限要推詳廟地方知福祿昌更遇文昌同魁鉞限臨此地極風光 | 大限破軍入廟：福祿昌；再遇文昌、魁鉞：極風光。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_POJUN_L2` | 卷二・一命宮・破軍 | p32（30） | 殺湊破軍防破耗 | 大限破軍又有煞星：防破耗（原文另有妻子自身亡之說，不採用）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_POJUN_L3` | 卷二・一命宮・破軍 | p32（30） | 破軍主限多膿血失脫乖張不可說更值女人主孝服血光產難災殃節 | 破軍主限之訣（血光、產難斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WENCHANG_N1` | 卷二・一命宮・文昌 | p32（30） | 眉目清秀分明機巧多學多能 | 文昌坐命：機巧、多學多能。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WENCHANG_N2` | 卷二・一命宮・文昌 | p32（30） | 會陽梁祿存財官昭著富貴先難後易 | 文昌會太陽、天梁、祿存：財官昭著，富貴先難後易。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WENCHANG_N3` | 卷二・一命宮・文昌 | p32（30） | 陷地加羊火巧藝之人 | 文昌落陷又加擎羊、火星：巧藝之人。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WENCHANG_B1` | 卷二・一命宮・文昌 | p32（30） | 巳酉丑宮入廟乙戊辛生人大貴 | 文昌在巳酉丑宮入廟，乙戊辛年生人：大貴。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WENCHANG_B2` | 卷二・一命宮・文昌 | p32（30） | 亥卯未宮利益乙戊生人財官格 | 文昌在亥卯未宮利益，乙戊年生人：財官格。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WENCHANG_M1` | 卷二・一命宮・文昌 | p32（30） | 文昌坐命旺宮臨志大財高抵萬金文藝精華心壯大須教平步上青雲 | 文昌坐命旺宮：志大財高、文藝精華、平步青雲。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WENCHANG_M2` | 卷二・一命宮・文昌 | p32（30） | 文昌守命亦非常限不夭傷福壽長只怕限沖逢火忌須教夭折帶刑傷 | 文昌守命之訣（夭折斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WENCHANG_F1` | 卷二・一命宮・文昌 | p32（30） | 女人身命值文昌秀麗清奇福更長紫府對沖三合照管教富貴著霞裳 | 女命文昌之訣（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WENCHANG_F2` | 卷二・一命宮・文昌 | p32（30） | 文昌女命遇廉軍陷地擎羊火忌星若不為娼終壽夭偏房猶得主人輕 | 女命文昌之訣（性別道德、壽夭斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WENCHANG_L1` | 卷二・一命宮・文昌 | p32（30） | 文昌之宿最為清斗數之中第二星若遇太歲與二限士人值此占科名 | 大限（或流年）逢文昌：利考試、功名。 | verified | 兩輪獨立目視轉錄＋差異回影像決議＋第二來源佐證（AI，非人工校勘） 2026-10-04 |
| `CIT_GY_WENCHANG_A1` | 卷二・一命宮・文昌 | p32（30） | 若遇太歲與二限士人值此占科名 | 流年命宮逢文昌：利考試、功名。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WENCHANG_L2` | 卷二・一命宮・文昌 | p32（30） | 限遇文昌不得地更有羊陀火鈴忌官非口舌破家財 | 大限文昌不得地又逢羊陀火鈴或化忌：口舌是非、破財（原文另有刑傷之說，不採用）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WENQU_N1` | 卷二・一命宮・文曲 | p32（30） | 與文昌逢吉主科第 | 文曲與文昌相逢（有吉星）：利科第。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WENQU_N2` | 卷二・一命宮・文曲 | p32（30） | 單居身命更逢惡殺湊合無名便佞之人 | 文曲單居逢惡殺：古籍斷為便佞之人（品格斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WENQU_N3` | 卷二・一命宮・文曲 | p32（30） | 喜六甲生人巳酉丑宮侯伯貴 | 文曲在巳酉丑宮，甲年生人：貴。 | verified | 兩輪獨立目視轉錄＋差異回影像決議＋第二來源佐證（AI，非人工校勘） 2026-10-04 |
| `CIT_GY_WENQU_N4` | 卷二・一命宮・文曲 | p32（30） | 與貪狼火星同垣三合者將相之命 | 文曲與貪狼、火星同宮或三合：將相之命。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WENQU_N5` | 卷二・一命宮・文曲 | p32（30） | 武貞羊破殺狼居陷地則喪命夭折 | 文曲陷地逢武貞羊破殺狼：古籍斷為夭折（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WENQU_N6` | 卷二・一命宮・文曲 | p32（30） | 若與同梁武曲會旺宮聰明果決 | 文曲在旺宮與天同、天梁、武曲會合：聰明果決。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WENQU_B1` | 卷二・一命宮・文曲 | p32（30） | 寅宮和平午戌宮陷地甲庚生人財官格 | 文曲在寅午戌宮，甲庚年生人：財官格。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WENQU_B2` | 卷二・一命宮・文曲 | p32（30） | 申子辰宮得地丁癸辛庚生人福厚 | 文曲在申子辰宮得地，丁癸辛庚年生人：福厚。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WENQU_B3` | 卷二・一命宮・文曲 | p32（30） | 巳酉丑宮入廟辛生人遇紫同大富貴 | 文曲在巳酉丑宮入廟，辛年生人又遇紫微：大富貴。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WENQU_B4` | 卷二・一命宮・文曲 | p32（30） | 卯亥未宮旺地辛丙壬戊生人財官格 | 文曲在亥卯未宮旺地，辛丙壬戊年生人：財官格。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WENQU_M1` | 卷二・一命宮・文曲 | p32（30） | 文曲守命最為良相貌堂堂志氣昂士庶逢之有厚福丈夫得此受金章 | 文曲守命（無煞）：志氣昂揚、有福、得官。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WENQU_M2` | 卷二・一命宮・文曲 | p32（30） | 文曲守垣逢火忌不喜三方惡殺聚此人雖巧口能言 | 文曲守命逢火星、化忌或三方惡殺：口才好（原文另有「惟在空門可還貴」，不採用）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WENQU_F1` | 卷二・一命宮・文曲 | p32（30） | 女人命裡逢文曲相貌清奇多有福聰明伶俐不尋常有殺偏房也淫慾 | 女命文曲之訣（性別道德斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WENQU_L1` | 卷二・一命宮・文曲 | p32（30） | 二限若逢文曲星士庶斯年須發福 | 大限逢文曲：發福。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_WENQU_L2` | 卷二・一命宮・文曲 | p32（30） | 更添左右會天同財祿滔滔為上局 | （文曲入限）再有左右、天同：財祿豐厚。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_ZUOFU_M1` | 卷二・一命宮・左輔 | p33（31） | 左輔之星能降福風流敦厚通今古紫府祿權貪武會文官武職多清貴 | 左輔坐命，會紫微、天府、祿、權、貪狼、武曲：文武職皆清貴。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_ZUOFU_M2` | 卷二・一命宮・左輔 | p33（31） | 羊陀火鈴三方照縱有財官非吉兆廉貞破巨更來沖若不傷殘終是夭 | 左輔逢煞之訣（傷殘壽夭斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_ZUOFU_F1` | 卷二・一命宮・左輔 | p33（31） | 女逢左輔主賢豪能幹能為志氣高更與紫微天府合金冠封贈福滔滔 | 女命左輔之訣（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_ZUOFU_F2` | 卷二・一命宮・左輔 | p33（31） | 火陀相會不為良七殺破軍壽不長只可偏房方富足聰明得寵過時光 | 女命左輔之訣（壽夭與偏房斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_ZUOFU_L1` | 卷二・一命宮・左輔 | p33（31） | 左輔限行福氣深常人富足累千金 | 大限逢左輔：福氣深、富足。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_ZUOFU_L2` | 卷二・一命宮・左輔 | p33（31） | 官員更得科權照職位高遷佐聖君 | （左輔入限）再逢化科、化權：職位高遷。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_ZUOFU_L3` | 卷二・一命宮・左輔 | p33（31） | 左輔之星入限來不宜殺湊主悲哀火鈴空劫來相湊財破 | 大限左輔逢煞星：破財（原文另有「人亡」之說，不採用）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_YOUBI_N1` | 卷二・一命宮・右弼 | p33（31） | 若會紫微府相昌曲終身福壽 | 右弼會紫微、天府、天相、文昌、文曲：一生有福。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_YOUBI_M1` | 卷二・一命宮・右弼 | p33（31） | 右弼天樞上宰星命逢重厚最聰明若無火忌羊陀會加志財官冠世英 | 右弼坐命：厚重聰明；沒有火星、化忌、羊陀會照：財官出眾。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_YOUBI_M2` | 卷二・一命宮・右弼 | p33（31） | 右弼星入命宮若還殺湊主常庸羊陀空劫三方湊須知帶疾免災凶 | 右弼逢煞之訣（帶疾斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_YOUBI_L1` | 卷二・一命宮・右弼 | p33（31） | 右弼入限最為榮人財興旺必多能 | 大限逢右弼：人財興旺。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_YOUBI_L2` | 卷二・一命宮・右弼 | p33（31） | 右弼主限遇凶星掃盡家資百不成 | 大限右弼遇凶星：破財、諸事難成。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_LUCUN_M1` | 卷二・一命宮・祿存 | p33（31） | 人生若遇祿存星性格剛強百事成左右逢兮昌曲會滔滔衣祿顯門庭 | 祿存坐命，逢左右、昌曲會合：衣祿豐厚。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_LUCUN_M2` | 卷二・一命宮・祿存 | p33（31） | 祿存守命莫逢沖陀火交加福不全 | 祿存守命逢陀羅、火星交加：福不全（原文另有空門之說，不採用）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_LUCUN_F1` | 卷二・一命宮・祿存 | p33（31） | 女命若逢祿存星紫府加臨百事盈更遇同貞相湊合必然註定是夫人 | 女命祿存之訣（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_LUCUN_F2` | 卷二・一命宮・祿存 | p33（31） | 祿存人命陷宮來空劫鈴火必為災若無吉曜來相湊夫婦分離永不諧 | 女命祿存之訣（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_LUCUN_L1` | 卷二・一命宮・祿存 | p33（31） | 祿存主限最為良作事求謀盡吉祥仕祿逢之多轉職庶人遇此足錢糧 | 大限逢祿存：作事求謀吉祥、收入充足。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_LUCUN_L2` | 卷二・一命宮・祿存 | p33（31） | 更有科權兼左右定知此限富倉箱 | （祿存入限）再有科權、左右：此限富足。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_LUCUN_L3` | 卷二・一命宮・祿存 | p33（31） | 祿存祿主多富足婚姻嫁娶添嗣續 | 大限祿存又逢化祿：富足、婚嫁喜事。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_LUCUN_L4` | 卷二・一命宮・祿存 | p33（31） | 祿馬交馳限步逢最怕劫空相遇同更兼太歲惡星沖限到其年入墓中 | 祿馬交馳逢劫空之訣（死亡斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_KUIYUE_N1` | 卷二・一命宮・魁鉞 | p33（31） | 若人身命逢之更得諸吉加臨三合吉星守照必少年登科及第 | 天魁天鉞在命，又有吉星加臨三合：年少即利考試功名。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_KUIYUE_N2` | 卷二・一命宮・魁鉞 | p33（31） | 大抵此星若身命逢之雖不富貴亦主聰明 | 魁鉞在命：即使不富貴也聰明。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_KUIYUE_L1` | 卷二・一命宮・魁鉞 | p33（31） | 限步逢之必主清高名成利就 | 大限逢魁鉞：名成利就。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_KUIYUE_L2` | 卷二・一命宮・魁鉞 | p33（31） | 魁鉞命身限遇昌常人得此足錢糧官員遇此高遷擢 | 命或大限有魁鉞又遇文昌：收入充足、職位高遷。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_QINGYANG_B1` | 卷二・一命宮・擎羊 | p34（32） | 辰戌丑未入廟亦宜辰戌丑未生人財官格 | 擎羊在辰戌丑未入廟，辰戌丑未年生人：財官格。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_QINGYANG_M1` | 卷二・一命宮・擎羊 | p34（32） | 祿前一位安擎羊上將逢之福祿加更得貴人相守照兵權萬里壯皇家 | 擎羊坐命又得天魁天鉞守照：掌權。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_QINGYANG_M2` | 卷二・一命宮・擎羊 | p34（32） | 擎羊守命性剛強四墓生人福壽長若得紫府來會合須知財穀足倉箱 | 擎羊守命，辰戌丑未年生人有福；再得紫微天府會合：財穀充足。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_QINGYANG_M3` | 卷二・一命宮・擎羊 | p34（32） | 擎羊一曜落閑宮陀火沖兮便是凶更若身命同劫殺定然天絕在途中 | 擎羊閑宮之訣（死亡斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_QINGYANG_F1` | 卷二・一命宮・擎羊 | p34（32） | 北斗浮星女命逢火機巨忌必常庸三方凶殺兼來湊不夭終須浪滾濤 | 女命擎羊之訣（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_QINGYANG_L1` | 卷二・一命宮・擎羊 | p34（32） | 擎羊守限細推詳四墓生人免禍殃若遇紫微昌府會財官顯達福悠長 | 大限擎羊，辰戌丑未年生人可免禍；再遇紫微、文昌、天府：財官顯達。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_QINGYANG_L2` | 卷二・一命宮・擎羊 | p34（32） | 天羅地網遇擎羊二限沖兮禍患戕若是命中主星弱定教一疾夢黃粱 | 擎羊羅網之訣（死亡斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_QINGYANG_L3` | 卷二・一命宮・擎羊 | p34（32） | 擎羊加殺最為凶二限休教落陷逢 | 大限擎羊落陷又加煞：最凶，易破財、變動（原文另有刑剋、流配之說，不採用）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TUOLUO_N1` | 卷二・一命宮・陀羅 | p34（32） | 橫發橫破不守祖業 | 陀羅坐命：橫發橫破。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TUOLUO_B1` | 卷二・一命宮・陀羅 | p34（32） | 辰戌丑未入廟辰戌丑未生人利 | 陀羅在辰戌丑未入廟，辰戌丑未年生人：利。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TUOLUO_M1` | 卷二・一命宮・陀羅 | p34（32） | 陀羅命內坐中存更喜人生四墓中再得紫微昌府合財祿豐盈遠播名 | 陀羅坐命，辰戌丑未年生人，再得紫微、文昌、天府會合：財祿豐盈。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TUOLUO_M2` | 卷二・一命宮・陀羅 | p34（32） | 陀羅在陷不堪聞口舌官非一世侵 | 陀羅落陷：口舌是非多（原文另有孤獨之說，不採用）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TUOLUO_F1` | 卷二・一命宮・陀羅 | p34（32） | 陀羅一曜女人逢遇吉加臨淫蕩容凶殺三方相照破須防相別主人翁 | 女命陀羅之訣（性別道德斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TUOLUO_L1` | 卷二・一命宮・陀羅 | p34（32） | 限遇陀羅事亦多必然恐奈要謙和 | 大限逢陀羅：事多，需謙和（原文另有死亡之說，不採用）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TUOLUO_L2` | 卷二・一命宮・陀羅 | p34（32） | 夾身夾命有陀羊火鈴空劫又來傷天祿不逢生旺地刑妻剋子不為良 | 羊陀夾命之訣（刑剋斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUOXING_N1` | 卷二・一命宮・火星 | p34（32） | 惟貪狼廟旺指日立遷功為財官格 | 火星與廟旺的貪狼同見：財官格。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUOXING_N2` | 卷二・一命宮・火星 | p34（32） | 利東南生人不利西北 | 火星利東南方出生的人、不利西北（客觀排盤沒有出生方位資料）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUOXING_N3` | 卷二・一命宮・火星 | p34（32） | 喜寅卯巳午生人禍輕 | 火星坐命，寅卯巳午年生人：禍輕。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUOXING_N4` | 卷二・一命宮・火星 | p34（32） | 更與擎羊同則極祿災厄孤剋下局 | 火星與擎羊同宮之訣（災厄刑剋斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUOXING_B1` | 卷二・一命宮・火星 | p34（32） | 寅午戌人宜 | 火星坐命，寅午戌年生人：宜。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUOXING_B2` | 卷二・一命宮・火星 | p34（32） | 申子辰人陷災吝困 | 火星坐命，申子辰年生人：多困。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUOXING_B4` | 卷二・一命宮・火星 | p34（32） | 寅卯未人利益吉多發福 | 火星坐命，寅卯未年生人：利益、多發福（原文作「寅卯未」）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUOXING_B3` | 卷二・一命宮・火星 | p34（32） | 巳酉丑人得地吉 | 火星坐命，巳酉丑年生人：得地、吉。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUOXING_L1` | 卷二・一命宮・火星 | p34（32） | 火星得地限宮逢喜氣盈門百事通仕宦逢之皆發福常人得此財豐隆 | 大限逢得地的火星：百事通達、財豐。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUOXING_L2` | 卷二・一命宮・火星 | p34（32） | 火星一宿最乖張無事官災鬧一場 | 大限火星（不得地）：易無端惹是非、破財（原文另有剋害六親之說，不採用）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_LINGXING_N1` | 卷二・一命宮・鈴星 | p34（32） | 宜寅午戌生人權貴 | 鈴星坐命，寅午戌年生人：權貴。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_LINGXING_N2` | 卷二・一命宮・鈴星 | p34（32） | 亦利東南生人及限行福厚西北人限行成敗 | 鈴星依出生方位論吉凶（客觀排盤沒有出生方位資料）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_LINGXING_N3` | 卷二・一命宮・鈴星 | p34（32） | 入廟遇貪狼武曲鎮邊夷 | 鈴星入廟遇貪狼、武曲：有威權。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_LINGXING_N4` | 卷二・一命宮・鈴星 | p34（32） | 更會紫府左右不貴即富 | 鈴星再會紫微、天府、左右：不貴即富。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_LINGXING_L1` | 卷二・一命宮・鈴星 | p34（32） | 限至鈴星事若何貪狼相遇福還多更加入廟逢諸吉富貴名揚處處歌 | 大限鈴星遇貪狼：福多；再入廟逢吉：富貴名揚。 | pendingVerification | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_LINGXING_L2` | 卷二・一命宮・鈴星 | p35（33） | 鈴星一宿不可當守臨二限必顛狂若無吉曜來相照未免招災惹禍殃 | 大限鈴星而無吉星照：易招災惹禍、起伏大。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUOLING_M1` | 卷二・一命宮・火鈴 | p35（33） | 火鈴二曜居廟地貪狼紫府宜相會為人性急有威權鎮壓鄉邦終有貴 | 火星、鈴星居廟地，與貪狼、紫微、天府相會：性急而有威權、終有貴。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUOLING_M2` | 卷二・一命宮・火鈴 | p35（33） | 火鈴在命落閑宮西北生人作事庸 | 火鈴落閑宮，西北生人：平庸（客觀排盤沒有出生方位資料）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUOLING_F1` | 卷二・一命宮・火鈴 | p35（33） | 火鈴之星入命來貪狼相會得和諧三方無殺諸般美坐守香閨得遂懷 | 女命火鈴之訣（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUOLING_F2` | 卷二・一命宮・火鈴 | p35（33） | 火鈴二曜最難當女命單逢必主傷若遇三方加殺湊須防目下入泉鄉 | 女命火鈴之訣（死亡斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUOLING_L1` | 卷二・一命宮・火鈴 | p35（33） | 火曜二星事若何貪狼相會福還多更加吉曜多權柄富貴聲揚處處歌 | 大限火鈴與貪狼相會：福多；再加吉星：有權柄。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUOLING_L2` | 卷二・一命宮・火鈴 | p35（33） | 火鈴限陷血膿侵失脫尋常不可尋口舌官災應不免 | 大限火鈴落陷：易有遺失耗損、口舌是非（原文另有血光之說，不採用）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_DIJIE_N1` | 卷二・一命宮・地劫 | p35（33） | 性重作事疎狂 | 地劫坐命：做事疏狂（原文另有品格斷語，不採用）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_DIJIE_M1` | 卷二・一命宮・地劫 | p35（33） | 若還羊火在其中辛苦持家 | 地劫坐命又有擎羊、火星：持家辛苦。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_DIJIE_L1` | 卷二・一命宮・地劫 | p35（33） | 劫星二限若逢之未免當年無禍危 | 大限逢地劫：難免有波折。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_DIKONG_N1` | 卷二・一命宮・地空 | p35（33） | 天空乃空亡之神性重作事虛空不行正道成敗多端不聚財 | 天空（地空）坐命：成敗多端、不聚財（原文另有品格斷語，不採用）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_DIKONG_M1` | 卷二・一命宮・地空 | p35（33） | 命坐天空定出家文昌天相貴堪誇 | 天空坐命之訣（出家斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_DIKONG_L1` | 卷二・一命宮・地空 | p35（33） | 空亡入限破田庄 | 大限逢天空：破耗田產。 | verified | 兩輪獨立目視轉錄＋差異回影像決議＋第二來源佐證（AI，非人工校勘） 2026-10-04 |
| `CIT_GY_JIEKONG_L2` | 卷二・一命宮・劫空 | p35（33） | 極居卯酉劫空臨為僧為道福興隆 | 紫微卯酉逢劫空之訣（出家斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_JIEKONG_L3` | 卷二・一命宮・劫空 | p35（33） | 劫空二限最乖張夫子在陳也絕糧 | 大限地空、地劫同臨：最為不順、易斷糧破財（原文另舉項羽、綠珠之死，不採用）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_SHANGSHI_N1` | 卷二・一命宮・天傷天使 | p35（33） | 天傷水乃虛耗之神守臨二限太歲 | 天傷、天使守限、太歲：主耗損（本 App 客觀排盤沒有天傷、天使）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANMA_N1` | 卷二・一命宮・天馬 | p35（33） | 天馬火最喜會祿存 | 天馬最喜與祿存相會（祿馬交馳）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANMA_N2` | 卷二・一命宮・天馬 | p35（33） | 加權祿照臨必主男為官女封贈 | 天馬又逢化權、化祿照臨：主為官。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANMA_L1` | 卷二・一命宮・天馬 | p35（33） | 天馬臨限最為良紫府祿存遇非常官宦逢之應顯達士人遇此赴科場 | 大限逢天馬：佳；再遇紫微、天府、祿存：顯達、利考試。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_TIANMA_L2` | 卷二・一命宮・天馬 | p35（33） | 天馬守限不得住又怕劫空來相遇更兼太歲坐宮中限到其人尋死路 | 天馬逢劫空之訣（死亡斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUALU_N1` | 卷二・一命宮・化祿 | p35（33） | 守身命官祿之位科權相遇必作大臣之職 | 化祿守命宮或官祿宮，又與化科、化權相遇：必任要職。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUALU_M1` | 卷二・一命宮・化祿 | p35（33） | 十干化祿最為榮男命逢之福自申 | 男命命宮化祿：榮顯有福。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUALU_L1` | 卷二・一命宮・化祿 | p35（33） | 祿主天同遇太陽常人大富足田庄 | 大限化祿在天同、又遇太陽：常人也大富、多置產。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUAQUAN_N1` | 卷二・一命宮・化權 | p36（34） | 限相逢無有不吉大限十年必遂逢凶亦不為災 | 大限逢化權：十年順遂，逢凶也不為災。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUAQUAN_N2` | 卷二・一命宮・化權 | p36（34） | 如遇羊陀耗使空劫聽說貽累官災貶謫 | （化權入限）若遇羊陀空劫等：受牽累、有官非。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUAQUAN_M1` | 卷二・一命宮・化權 | p36（34） | 權星最喜吉星扶事業軒昂膽氣粗 | 化權在命又有吉星扶持：事業軒昂。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUAQUAN_M2` | 卷二・一命宮・化權 | p36（34） | 更值巨門兼武曜三邊鎮守掌兵符 | 化權在巨門或武曲：掌兵權。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUAQUAN_F1` | 卷二・一命宮・化權 | p36（34） | 化權吉曜人相逢更吉加臨衣祿豐富貴雙全人性硬奪夫權柄福興隆 | 女命化權之訣（性別角色斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUAQUAN_L1` | 卷二・一命宮・化權 | p36（34） | 此星主限喜非常官祿高陞佐帝王財帛豐添宜創業 | 大限化權：職位高升、財帛豐添、宜創業。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUAQUAN_L2` | 卷二・一命宮・化權 | p36（34） | 權星此遇武貪臨作事求謀盡得成 | 大限化權又遇武曲、貪狼：作事求謀都能成。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUAKE_N1` | 卷二・一命宮・化科 | p36（34） | 守身命權祿相逢主人聰明通達最喜逢魁鉞必中科第 | 化科守命，又逢權祿：聰明通達；再逢魁鉞：利考試。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUAKE_N2` | 卷二・一命宮・化科 | p36（34） | 最喜逢魁鉞必中科第作宰臣之職 | 化科守命逢天魁天鉞：利考試、居要職。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUAKE_M1` | 卷二・一命宮・化科 | p36（34） | 科星文宿最為奇包藏錦繡美文章 | 男命化科：文章錦繡。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUAKE_M2` | 卷二・一命宮・化科 | p36（34） | 更遇曲昌魁鉞宿龍門一躍姓名揚 | 化科坐命再遇昌曲魁鉞：名揚。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUAKE_F1` | 卷二・一命宮・化科 | p36（34） | 化科女命是良星四德兼全性格清更遇吉星權祿湊夫榮子貴作夫人 | 女命化科之訣（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUAKE_L1` | 卷二・一命宮・化科 | p36（34） | 科星二限遇文昌士子逢之名姓香 | 大限化科又遇文昌：利考試、名聲。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUAJI_N1` | 卷二・一命宮・化忌 | p36（34） | 若日月陷地化忌主大凶 | 太陽或太陰落陷又化忌：大凶（多阻滯）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUAJI_M1` | 卷二・一命宮・化忌 | p36（34） | 諸星化忌不宜逢更會凶星愈肆凶若得吉星來助救縱然富貴不豐隆 | 男命命宮化忌又會凶星：更凶；有吉星可救，但富貴不豐。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUAJI_M2` | 卷二・一命宮・化忌 | p36（34） | 貪狼破軍居陷地遇吉化忌終不利男為奸盜女淫娼 | 貪破陷地化忌之訣（品格與性別斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUAJI_F1` | 卷二・一命宮・化忌 | p36（34） | 女人化忌本非奇更遇凶星是禍基衣食艱辛貧賤甚吉星湊合減災危 | 女命化忌之訣（貧賤斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUAJI_L1` | 卷二・一命宮・化忌 | p36（34） | 忌星入廟反為佳縱有官災亦不傷 | 大限化忌之星入廟：反而佳（古籍未說明如何判定「忌星入廟」與限宮的關係）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUAJI_L2` | 卷二・一命宮・化忌 | p36（34） | 二限宮中見忌星致災為禍必家傾為官退職 | 大限命宮見化忌：易有災禍、職位退守（原文另有「必家傾」「禁杖刑」等斷語，不採用）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUAJI_L3` | 卷二・一命宮・化忌 | p36（34） | 忌星落陷在閑宮惡殺加臨作禍凶財散人離多疾苦 | 大限化忌又有惡煞加臨：破財、身心負荷重。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUAJI_S1` | 卷二・一命宮・化忌 | p36（34） | 祿會祿存富貴 | 化祿與祿存相會：富貴。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUAJI_S2` | 卷二・一命宮・化忌 | p36（34） | 權巨武英揚 | 化權在巨門或武曲：英名顯揚。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUAJI_S3` | 卷二・一命宮・化忌 | p36（34） | 科會魁鉞貴顯 | 化科與天魁天鉞相會：貴顯。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_HUAJI_S4` | 卷二・一命宮・化忌 | p36（34） | 忌會身命招是非 | 化忌在命宮：易招是非。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_SUIJUN_N1` | 卷二・一命宮・歲君 | p36（34） | 太歲之星不可當守臨官限要推詳若無吉曜來相助不免官災鬧一場 | 太歲守臨宮限時要仔細推詳；沒有吉星相助則難免官非（原文未說明「守臨宮限」指哪一宮）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_DOUJUN_N1` | 卷二・一命宮・斗君 | p36（34） | 斗君正月初一日管事遇吉斷吉遇凶斷凶 | 斗君（流月起點）逐月斷吉凶；本 App 客觀排盤沒有斗君與流月。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_ZIWEI` | 卷三・五財帛・紫微在財帛 | p39（37） | 紫微豐足倉箱加羊陀火鈴空劫不旺 | 紫微在財帛：豐足；加羊陀火鈴空劫則不旺。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_ZIWEI_POJUN` | 卷三・五財帛・紫微破軍同在財帛 | p39（37） | 破軍同先難後易 | 紫微破軍同在財帛：先難後易。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_ZIWEI_TIANFU` | 卷三・五財帛・紫微天府同在財帛 | p39（37） | 天府同富足終身保守 | 紫微天府同在財帛：終身富足、宜保守。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_ZIWEI_QISHA` | 卷三・五財帛・紫微七殺同在財帛又加吉星 | p39（37） | 七殺同加吉財帛橫發 | 紫微七殺同在財帛又加吉星：財帛橫發。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_TIANJI` | 卷三・五財帛・天機在財帛 | p39（37） | 天機勞心費力生財 | 天機在財帛：勞心費力而生財。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_TIANJI_TIANLIANG` | 卷三・五財帛・天機天梁同在財帛 | p39（37） | 天梁同機關巧計生外財 | 天機天梁同在財帛：以巧思謀外財。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_TIANJI_XIAN` | 卷三・五財帛・天機在財帛加羊陀火鈴空劫 | p39（37） | 加羊陀火鈴空劫一生有成有敗 | 天機在財帛加羊陀火鈴空劫：一生有成有敗。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_TAIYANG` | 卷三・五財帛・太陽在財帛 | p39（37） | 太陽入廟豐足陷宮勞碌不遂 | 太陽在財帛：入廟豐足；落陷勞碌不遂。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_TAIYANG_XIAN` | 卷三・五財帛・太陽在財帛落陷 | p39（37） | 陷宮勞碌不遂 | 太陽在財帛落陷：勞碌不遂。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_WUQU` | 卷三・五財帛・武曲在財帛 | p39（37） | 武曲豐足化吉有巨萬家資 | 武曲在財帛：豐足；化吉則家資巨萬。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_WUQU_HUA` | 卷三・五財帛・武曲在財帛化吉 | p39（37） | 化吉有巨萬家資 | 武曲在財帛化吉：家資巨萬。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_WUQU_POJUN` | 卷三・五財帛・武曲破軍同在財帛 | p39（37） | 破軍同東來西去先無後有 | 武曲破軍同在財帛：財來財去、先無後有。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_WUQU_TIANXIANG` | 卷三・五財帛・武曲天相同在財帛 | p39（37） | 天相同財帛豐盈遇貴生財 | 武曲天相同在財帛：財帛豐盈、遇貴生財。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_TIANTONG` | 卷三・五財帛・天同在財帛 | p39（37） | 天同白手生財晚發 | 天同在財帛：白手生財、晚發。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_TIANTONG_JUMEN` | 卷三・五財帛・天同巨門同在財帛 | p39（37） | 巨門同財氣進退 | 天同巨門同在財帛：財氣有進有退。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_TIANTONG_TIANLIANG` | 卷三・五財帛・天同天梁同在財帛 | p39（37） | 天梁同財大旺 | 天同天梁同在財帛：財大旺。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_LIANZHEN` | 卷三・五財帛・廉貞在財帛 | p39（37） | 廉貞在申寅宮鬧中生財陷宮先難後易 | 廉貞在財帛：在寅申宮於繁忙中生財；落陷先難後易。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_LIANZHEN_TANLANG` | 卷三・五財帛・廉貞貪狼同在財帛 | p39（37） | 貪狼生橫發橫破 | 廉貞貪狼同在財帛：橫發橫破。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_LIANZHEN_TIANXIANG` | 卷三・五財帛・廉貞天相同在財帛 | p39（37） | 天相同富足倉箱 | 廉貞天相同在財帛：富足。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_TIANFU` | 卷三・五財帛・天府在財帛 | p39（37） | 天府富足見羊陀火鈴空劫有成敗 | 天府在財帛：富足；見羊陀火鈴空劫則有成敗。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_TIANFU_SHA` | 卷三・五財帛・天府在財帛見羊陀火鈴空劫 | p39（37） | 見羊陀火鈴空劫有成敗 | 天府在財帛見羊陀火鈴空劫：有成敗。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_TIANFU_ZIWEI` | 卷三・五財帛・天府紫微同在財帛 | p39（37） | 紫微同巨積 | 天府紫微同在財帛：巨積。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_TAIYIN` | 卷三・五財帛・太陰在財帛 | p39（37） | 太陰入廟富足倉箱陷宮成敗不聚 | 太陰在財帛：入廟富足；落陷成敗不聚。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_TAIYIN_XIAN` | 卷三・五財帛・太陰在財帛落陷 | p39（37） | 陷宮成敗不聚 | 太陰在財帛落陷：成敗不聚。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_TAIYIN_TIANJI` | 卷三・五財帛・太陰天機同在財帛 | p39（37） | 天機同白手生財成家 | 太陰天機同在財帛：白手生財成家。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_TAIYIN_LUCUN` | 卷三・五財帛・太陰在財帛，又有祿存與左右同宮 | p39（37） | 祿存兼左右同主大富 | 太陰在財帛，又有祿存與左右同宮：大富。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_TANLANG` | 卷三・五財帛・貪狼在財帛 | p39（37） | 貪狼廟旺陷地貧寒 | 貪狼在財帛：廟旺（佳），落陷則貧寒。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_TANLANG_HUO` | 卷三・五財帛・貪狼在財帛見火星 | p39（37） | 見火星三十年前成敗三十年後橫發 | 貪狼在財帛見火星：前半生成敗、後半生橫發。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_JUMEN` | 卷三・五財帛・巨門在財帛 | p39（37） | 巨門白手生財成家宜鬧中取 | 巨門在財帛：白手成家，宜在熱鬧處求財。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_JUMEN_SHA` | 卷三・五財帛・巨門在財帛加羊陀火鈴空劫 | p39（37） | 加羊陀火鈴空劫破敗多端 | 巨門在財帛加羊陀火鈴空劫：破敗多端。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_TIANLIANG` | 卷三・五財帛・天梁在財帛 | p39（37） | 天梁富足入廟上等富貴陷宮辛勤求財度日 | 天梁在財帛：富足，入廟上等；落陷辛勤求財。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_TIANLIANG_XIAN` | 卷三・五財帛・天梁在財帛落陷 | p39（37） | 陷宮辛勤求財度日 | 天梁在財帛落陷：辛勤求財。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_TIANXIANG` | 卷三・五財帛・天相在財帛 | p39（37） | 天相富足紫微同財氣旺 | 天相在財帛：富足；與紫微同宮財氣旺。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_TIANXIANG_SHA` | 卷三・五財帛・天相在財帛加羊陀火鈴空劫或化忌 | p39（37） | 加羊陀火鈴空劫耗忌成敗無積聚 | 天相在財帛加羊陀火鈴空劫或化忌：成敗、無積聚。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_POJUN` | 卷三・五財帛・破軍在財帛 | p39（37） | 破軍在子午宮多有金銀寶貝蓄積辰戌旺宮亦財盛陷宮破祖不聚 | 破軍在財帛：子午宮多蓄積，辰戌旺宮亦財盛；落陷不聚。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_POJUN_XIAN` | 卷三・五財帛・破軍在財帛落陷 | p39（37） | 陷宮破祖不聚 | 破軍在財帛落陷：不聚財。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_WENCHANG` | 卷三・五財帛・文昌在財帛 | p39（37） | 文昌富足倉箱加吉星財氣旺 | 文昌在財帛：富足；加吉星財氣旺。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_WENQU` | 卷三・五財帛・文曲在財帛入廟 | p39（37） | 文曲入廟富足加吉星得貴人財 | 文曲在財帛入廟：富足；加吉星得貴人之財。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_WENQU_SHA` | 卷三・五財帛・文曲在財帛加羊陀火鈴空劫 | p39（37） | 加羊陀火鈴空劫家忌東來西去成敗不遂 | 文曲在財帛加羊陀火鈴空劫：財來財去、成敗不遂。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_FUBI` | 卷三・五財帛・左輔、右弼在財帛 | p39（37） | 左輔右弼諸宮富足會諸吉星得貴人財 | 左輔、右弼在財帛：富足，會吉星得貴人之財。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_FUBI_SHA` | 卷三・五財帛・左右在財帛加羊陀火鈴空劫 | p39（37） | 加羊陀火鈴空劫耗忌主成敗而不遂 | 左右在財帛加羊陀火鈴空劫：成敗不遂。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_LUCUN` | 卷三・五財帛・祿存在財帛 | p39（37） | 祿存富足倉箱堆金積玉 | 祿存在財帛：富足、堆金積玉。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_QINGYANG` | 卷三・五財帛・擎羊在財帛辰戌丑未 | p39（37） | 擎羊辰戌丑未宮鬧中生財 | 擎羊在財帛辰戌丑未：於繁忙競爭中生財。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_QINGYANG_XIAN` | 卷三・五財帛・擎羊在財帛落陷 | p39（37） | 陷地破祖不遂 | 擎羊在財帛落陷：難守成。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_TUOLUO` | 卷三・五財帛・陀羅在財帛 | p39（37） | 陀羅鬧中生財陷宮辛勤求財度日 | 陀羅在財帛：於繁忙中生財；落陷辛勤求財。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_HUOXING` | 卷三・五財帛・火星獨守財帛 | p40（38） | 火星獨守橫發橫破 | 火星獨守財帛：橫發橫破。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_LINGXING` | 卷三・五財帛・鈴星在財帛 | p40（38） | 鈴星入廟獨守橫發陷地孤寒辛苦度日 | 鈴星在財帛：入廟橫發；落陷辛苦。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_KUIYUE` | 卷三・五財帛・魁鉞在財帛 | p40（38） | 魁鉞主清高中生財一生遂意 | 魁鉞在財帛：清高中生財、一生遂意。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_CAIBO_DOUJUN` | 卷三・五財帛・斗君（流月）遇吉其月發財（本 App 沒有斗君）。 | p40（38） | 斗君遇吉其月發財 | 斗君（流月）遇吉其月發財（本 App 沒有斗君）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_ZIWEI` | 卷三・七遷移・紫微在遷移又有左右 | p40（38） | 紫微同左右出外貴人扶持發福 | 紫微在遷移又有左右：出外得貴人扶持。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_ZIWEI_TIANFU` | 卷三・七遷移・紫微天府同在遷移 | p40（38） | 天府同出入通達 | 紫微天府同在遷移：出入通達。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_ZIWEI_TIANXIANG` | 卷三・七遷移・紫微天相同在遷移 | p40（38） | 天相同在外發財 | 紫微天相同在遷移：在外發財。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_ZIWEI_SHA` | 卷三・七遷移・紫微在遷移加羊陀火鈴空劫 | p40（38） | 加羊陀火鈴空劫在外不安靜 | 紫微在遷移加羊陀火鈴空劫：在外不安靜。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_TIANJI` | 卷三・七遷移・天機在遷移 | p40（38） | 天機出外遇貴居家有是非 | 天機在遷移：出外遇貴、居家多是非。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_TIANJI_SHA` | 卷三・七遷移・天機在遷移加羊陀火鈴 | p40（38） | 加羊陀火鈴在外多是非身不安靜 | 天機在遷移加羊陀火鈴：在外多是非。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_TAIYANG` | 卷三・七遷移・太陽在遷移 | p40（38） | 太陽宜出外發福不耐靜守 | 太陽在遷移：宜出外發福。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_TAIYANG_SHA` | 卷三・七遷移・太陽在遷移加羊陀火鈴空劫 | p40（38） | 加羊陀火鈴空劫在外心身不清閑 | 太陽在遷移加羊陀火鈴空劫：在外身心不得清閒。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_WUQU` | 卷三・七遷移・武曲在遷移 | p40（38） | 不宜靜守 | 武曲在遷移：忙碌、不宜靜守。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_WUQU_TANLANG` | 卷三・七遷移・武曲貪狼同在遷移 | p40（38） | 貪狼同作巨商 | 武曲貪狼同在遷移：宜經商。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_WUQU_SHA` | 卷三・七遷移・武曲在遷移加羊陀火鈴 | p40（38） | 加羊陀火鈴在外多招是非 | 武曲在遷移加羊陀火鈴：在外多是非。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_TIANTONG` | 卷三・七遷移・天同在遷移 | p40（38） | 天同出外遇貴人扶持 | 天同在遷移：出外遇貴人扶持。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_TIANTONG_SHA` | 卷三・七遷移・天同在遷移加羊陀火鈴空劫 | p40（38） | 加羊陀火鈴空劫在外少遂志 | 天同在遷移加羊陀火鈴空劫：在外少遂志。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_LIANZHEN` | 卷三・七遷移・廉貞在遷移 | p40（38） | 廉貞出外通達近貴在家日少 | 廉貞在遷移：出外通達、在家日少。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_LIANZHEN_QISHA` | 卷三・七遷移・廉貞七殺同在遷移 | p40（38） | 七殺同在外廣招財 | 廉貞七殺同在遷移：在外廣招財。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_TIANFU` | 卷三・七遷移・天府在遷移 | p40（38） | 天府出外遇貴人扶持 | 天府在遷移：出外遇貴人扶持。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_TAIYIN` | 卷三・七遷移・太陰在遷移 | p40（38） | 太陰入廟出外遇貴發財陷宮招是非 | 太陰在遷移：入廟出外遇貴發財；落陷招是非。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_TAIYIN_XIAN` | 卷三・七遷移・太陰在遷移落陷 | p40（38） | 陷宮招是非 | 太陰在遷移落陷：招是非。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_JUMEN` | 卷三・七遷移・巨門在遷移 | p41（39） | 巨門出外勞心不安與人不足多是非 | 巨門在遷移：出外勞心、與人多是非。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_TIANXIANG` | 卷三・七遷移・天相在遷移 | p41（39） | 天相出外貴人提攜 | 天相在遷移：出外有貴人提攜。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_TIANXIANG_WUQU` | 卷三・七遷移・天相武曲同在遷移 | p41（39） | 武曲同在外發財 | 天相武曲同在遷移：在外發財。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_TIANLIANG` | 卷三・七遷移・天梁在遷移 | p41（39） | 天梁出外近貴人成就 | 天梁在遷移：出外近貴人而成就。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_QISHA` | 卷三・七遷移・七殺在遷移 | p41（39） | 七殺在外日多在家日少 | 七殺在遷移：在外日多。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_QISHA_SHA` | 卷三・七遷移・七殺在遷移加羊陀火鈴空劫 | p41（39） | 加羊陀火鈴空劫又操心不富 | 七殺在遷移加羊陀火鈴空劫：操心、不富（原文另有流蕩天涯之說）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_POJUN` | 卷三・七遷移・破軍在遷移 | p41（39） | 破軍出外勞心不富入廟在外崢嶸 | 破軍在遷移：出外勞心；入廟在外崢嶸。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_WENCHANG` | 卷三・七遷移・文昌在遷移 | p41（39） | 文昌出外遇貴發達 | 文昌在遷移：出外遇貴發達。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_WENQU` | 卷三・七遷移・文曲在遷移 | p41（39） | 文曲在外近貴加吉星得財 | 文曲在遷移：在外近貴，加吉星得財。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_ZUOFU` | 卷三・七遷移・左輔在遷移 | p41（39） | 左輔動中貴人扶持發福 | 左輔在遷移：動中有貴人扶持。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_ZUOFU_SHA` | 卷三・七遷移・左輔在遷移加羊陀火鈴 | p41（39） | 加羊陀火鈴下人不足多招是非 | 左輔在遷移加羊陀火鈴：多招是非。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_YOUBI` | 卷三・七遷移・右弼在遷移 | p41（39） | 右弼出外遇貴人扶持發達不宜靜守 | 右弼在遷移：出外遇貴人扶持。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_YOUBI_SHA` | 卷三・七遷移・右弼在遷移加羊陀火鈴空劫 | p41（39） | 加羊陀火鈴空劫在外與人有爭競 | 右弼在遷移加羊陀火鈴空劫：在外與人有爭競。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_LUCUN` | 卷三・七遷移・祿存在遷移 | p41（39） | 祿存出外衣祿遂心 | 祿存在遷移：出外衣祿遂心。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_QINGYANG` | 卷三・七遷移・擎羊在遷移入廟 | p41（39） | 擎羊入廟在外衣祿遂心 | 擎羊在遷移入廟：在外衣祿遂心。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_TUOLUO` | 卷三・七遷移・陀羅在遷移會吉星 | p41（39） | 陀羅會吉星在外遇貴得財 | 陀羅在遷移會吉星：在外遇貴得財。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_TUOLUO_XIAN` | 卷三・七遷移・陀羅在遷移落陷又加煞 | p41（39） | 陷地加羊火鈴星空劫多招是非 | 陀羅在遷移落陷又加煞：多招是非。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_HUOXING` | 卷三・七遷移・火星獨守遷移 | p41（39） | 火星獨守出外不安 | 火星獨守遷移：出外不安。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_LINGXING` | 卷三・七遷移・鈴星在遷移 | p41（39） | 鈴星有吉星同出外吉加羊陀空劫不足招是非 | 鈴星在遷移：有吉星同出外吉；加羊陀空劫招是非。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_QIANYI_DOUJUN` | 卷三・七遷移・斗君（流月）過遷移（本 App 沒有斗君）。 | p41（39） | 斗君過度遇吉動中吉遇凶殺動中有口舌 | 斗君（流月）過遷移（本 App 沒有斗君）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIAOYOU_ZIWEI` | 卷三・八奴僕・紫微在奴僕（交友）宮 | p41（39） | 紫微成行得力旺主生財 | 紫微在奴僕（交友）宮：助力多、能助己生財。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIAOYOU_ZIWEI_SHA` | 卷三・八奴僕・紫微在交友宮加羊陀火鈴 | p41（39） | 加擎羊火鈴陀羅欠力 | 紫微在交友宮加羊陀火鈴：助力不足。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIAOYOU_TAIYANG` | 卷三・八奴僕・太陽在交友宮 | p41（39） | 太陽入廟旺主發財陷宮無分有也怨主 | 太陽在交友宮：入廟得助；落陷少助、易有怨。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIAOYOU_TAIYANG_XIAN` | 卷三・八奴僕・太陽在交友宮落陷 | p41（39） | 陷宮無分有也怨主 | 太陽在交友宮落陷：少助、易有怨。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIAOYOU_WUQU` | 卷三・八奴僕・武曲在交友宮旺宮 | p41（39） | 武曲旺宮不少一呼百諾 | 武曲在交友宮旺宮：一呼百諾。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIAOYOU_WUQU_QISHA` | 卷三・八奴僕・武曲七殺同在交友宮 | p41（39） | 七殺同背主 | 武曲七殺同在交友宮：易有背離。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIAOYOU_LIANZHEN` | 卷三・八奴僕・廉貞在交友宮落陷 | p41（39） | 廉貞陷地奴背主 | 廉貞在交友宮落陷：易有背離。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIAOYOU_LIANZHEN_MIAO` | 卷三・八奴僕・廉貞在交友宮入廟 | p41（39） | 入廟一呼百諾 | 廉貞在交友宮入廟：一呼百諾。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIAOYOU_TAIYIN` | 卷三・八奴僕・太陰在交友宮入廟 | p41（39） | 太陰廟地得力成行 | 太陰在交友宮入廟：得力。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIAOYOU_TAIYIN_TIANJI` | 卷三・八奴僕・太陰天機同在交友宮 | p41（39） | 天機同欠力 | 太陰天機同在交友宮：欠力。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIAOYOU_TIANFU` | 卷三・八奴僕・天府在交友宮 | p41（39） | 天府得力一呼百諾 | 天府在交友宮：得力、一呼百諾。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIAOYOU_TIANFU_SHA` | 卷三・八奴僕・天府在交友宮加羊陀火鈴空劫 | p41（39） | 加羊陀火鈴空劫多背主逃走 | 天府在交友宮加羊陀火鈴空劫：多背離。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIAOYOU_TANLANG` | 卷三・八奴僕・貪狼在交友宮 | p41（39） | 貪狼初難招敗主之奴陷地全無 | 貪狼在交友宮：起初難得助力。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIAOYOU_JUMEN` | 卷三・八奴僕・巨門在交友宮 | p41（39） | 巨門入廟早年不得力招是非 | 巨門在交友宮：早年不得力、招是非。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIAOYOU_TIANXIANG` | 卷三・八奴僕・天相在交友宮 | p41（39） | 天相末年招得 | 天相在交友宮：晚年才得助力。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIAOYOU_TIANXIANG_SHA` | 卷三・八奴僕・天相在交友宮加羊陀火鈴空劫 | p41（39） | 加羊陀火鈴空劫欠力逃走 | 天相在交友宮加羊陀火鈴空劫：欠力。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIAOYOU_TIANLIANG` | 卷三・八奴僕・天梁在交友宮 | p41（39） | 天梁奴多旺主 | 天梁在交友宮：助力多。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIAOYOU_QISHA` | 卷三・八奴僕・七殺在交友宮 | p41（39） | 七殺欺主有剛強之僕 | 七殺在交友宮：身邊人剛強、易有欺凌。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIAOYOU_POJUN` | 卷三・八奴僕・破軍在交友宮 | p41（39） | 破軍入廟得力陷宮招怨背主 | 破軍在交友宮：入廟得力；落陷招怨。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIAOYOU_POJUN_XIAN` | 卷三・八奴僕・破軍在交友宮落陷 | p41（39） | 陷宮招怨背主 | 破軍在交友宮落陷：招怨、背離。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIAOYOU_WENCHANG` | 卷三・八奴僕・文昌入廟獨守交友宮 | p41（39） | 文昌入廟獨守得力助主 | 文昌入廟獨守交友宮：得力。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIAOYOU_WENQU` | 卷三・八奴僕・文曲在交友宮入廟 | p41（39） | 文曲入廟得力陷宮無分 | 文曲在交友宮入廟：得力。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIAOYOU_ZUOFU` | 卷三・八奴僕・左輔獨守交友宮 | p41（39） | 左輔獨守旺相一呼百諾 | 左輔獨守交友宮：一呼百諾。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIAOYOU_YOUBI` | 卷三・八奴僕・右弼獨守交友宮 | p41（39） | 右弼獨守成行 | 右弼獨守交友宮：助力成行。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIAOYOU_FUBI_SHA` | 卷三・八奴僕・右弼在交友宮加羊陀火鈴空劫 | p41（39） | 加羊陀火鈴空劫耗忌背主盜財而走 | 右弼在交友宮加羊陀火鈴空劫：易有背離、耗財。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIAOYOU_LUCUN` | 卷三・八奴僕・祿存在交友宮 | p41（39） | 祿存奴僕多加吉星衛主起家 | 祿存在交友宮：助力多，加吉星能助己起家。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIAOYOU_QINGYANG` | 卷三・八奴僕・擎羊在交友宮 | p41（39） | 擎羊背主招怨不得力 | 擎羊在交友宮：易招怨、不得力。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIAOYOU_TUOLUO` | 卷三・八奴僕・陀羅在交友宮 | p41（39） | 陀羅奴僕欠力怨主 | 陀羅在交友宮：欠力。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIAOYOU_HUOXING` | 卷三・八奴僕・火星獨守交友宮 | p41（39） | 火星獨守怨主不得力 | 火星獨守交友宮：不得力。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIAOYOU_LINGXING` | 卷三・八奴僕・鈴星獨守交友宮 | p42（40） | 鈴星獨守不得力恨主 | 鈴星獨守交友宮：不得力。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIAOYOU_DOUJUN` | 卷三・八奴僕・斗君（流月）過奴僕宮（本 App 沒有斗君）。 | p42（40） | 斗君過度逢吉星則奴僕歸順 | 斗君（流月）過奴僕宮（本 App 沒有斗君）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_ZIWEI` | 卷三・九官祿・紫微在官祿廟旺，遇左右昌曲魁鉞 | p42（40） | 紫微廟旺遇左右昌曲魁鉞軒勝位至封侯伯 | 紫微在官祿廟旺，遇左右昌曲魁鉞：職位崇高。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_ZIWEI_SHA` | 卷三・九官祿・紫微在官祿加羊陀火鈴 | p42（40） | 加羊陀火鈴平常 | 紫微在官祿加羊陀火鈴：平常。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_ZIWEI_TIANFU` | 卷三・九官祿・紫微天府同在官祿 | p42（40） | 天府同權貴名利兩全 | 紫微天府同在官祿：權貴、名利兩全。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_ZIWEI_TIANXIANG` | 卷三・九官祿・紫微天相同在官祿 | p42（40） | 天相同內外權貴清正 | 紫微天相同在官祿：內外權貴。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_TIANJI` | 卷三・九官祿・天機在官祿入廟 | p42（40） | 天機入廟權貴會文曲為良 | 天機在官祿入廟：權貴。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_TIANJI_TIANLIANG` | 卷三・九官祿・天機天梁同在官祿 | p42（40） | 天梁同文武之材 | 天機天梁同在官祿：文武之材。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_TIANJI_XIAN` | 卷三・九官祿・天機在官祿落陷 | p42（40） | 陷宮退官失職 | 天機在官祿落陷：職位進退。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_TAIYANG` | 卷三・九官祿・太陽在官祿入廟、不見羊陀火鈴 | p42（40） | 太陽入廟文武為良不見羊陀火鈴吉 | 太陽在官祿入廟、不見羊陀火鈴：文武皆良。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_TAIYANG_LUCKY` | 卷三・九官祿・太陽在官祿，左右昌曲魁鉞同會又加科權祿 | p42（40） | 左右昌曲魁鉞同更加科祿權定居一品之貴 | 太陽在官祿，左右昌曲魁鉞同會又加科權祿：一品之貴。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_WUQU` | 卷三・九官祿・武曲在官祿入廟又與昌曲左右同宮 | p42（40） | 武曲入廟與昌曲左右同宮武職崢嶸 | 武曲在官祿入廟又與昌曲左右同宮：武職崢嶸。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_WUQU_HUA` | 卷三・九官祿・武曲在官祿會科權祿 | p42（40） | 會科權祿為財富之官 | 武曲在官祿會科權祿：財富之官。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_WUQU_XIAN` | 卷三・九官祿・武曲在官祿落陷又逢陀鈴劫忌 | p42（40） | 陷宮及陀鈴劫忌功名無分 | 武曲在官祿落陷又逢陀鈴劫忌：功名難成。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_TIANTONG` | 卷三・九官祿・天同在官祿入廟、無羊陀火鈴 | p42（40） | 天同入廟文武皆宜無羊陀火鈴吉 | 天同在官祿入廟、無羊陀火鈴：文武皆宜。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_TIANTONG_TIANLIANG` | 卷三・九官祿・天同天梁同在官祿 | p42（40） | 天梁同權貴 | 天同天梁同在官祿：權貴。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_LIANZHEN` | 卷三・九官祿・廉貞在官祿入廟 | p42（40） | 入廟武職權貴不耐久 | 廉貞在官祿入廟：武職權貴但不耐久。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_TIANFU` | 卷三・九官祿・天府在官祿入廟 | p42（40） | 天府入廟文武皆吉無羊陀火鈴空耗全美 | 天府在官祿入廟：文武皆吉；無煞全美。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_TIANFU_SHA` | 卷三・九官祿・天府在官祿見空劫 | p42（40） | 見空劫平常 | 天府在官祿見空劫：平常。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_TAIYIN` | 卷三・九官祿・太陰在官祿入廟 | p42（40） | 太陰入廟多貴 | 太陰在官祿入廟：多貴。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_TAIYIN_XIAN` | 卷三・九官祿・太陰在官祿落陷 | p42（40） | 陷地氣高橫破難顯達 | 太陰在官祿落陷：難顯達。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_TANLANG` | 卷三・九官祿・貪狼在官祿入廟遇火鈴 | p42（40） | 貪狼入廟遇火鈴武職掌大權 | 貪狼在官祿入廟遇火鈴：武職掌大權。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_TANLANG_ZIWEI` | 卷三・九官祿・貪狼紫微同在官祿 | p42（40） | 紫微同文武之職權貴非小 | 貪狼紫微同在官祿：權貴非小。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_JUMEN` | 卷三・九官祿・巨門在官祿入廟 | p42（40） | 巨門入廟武職權貴文人不耐久 | 巨門在官祿入廟：武職權貴，文職不耐久。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_JUMEN_XIAN` | 卷三・九官祿・巨門在官祿落陷 | p42（40） | 陷宮遭悔吝 | 巨門在官祿落陷：多悔吝。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_TIANXIANG` | 卷三・九官祿・天相在官祿入廟 | p42（40） | 天相入廟文武皆宜 | 天相在官祿入廟：文武皆宜。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_TIANXIANG_ZIWEI` | 卷三・九官祿・天相紫微同在官祿 | p42（40） | 紫微同權貴 | 天相紫微同在官祿：權貴。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_TIANLIANG` | 卷三・九官祿・天梁在官祿（午宮廟）會左右魁鉞 | p42（40） | 天梁廟午會左右魁鉞文武之材 | 天梁在官祿（午宮廟）會左右魁鉞：文武之材。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_QISHA` | 卷三・九官祿・七殺在官祿廟旺 | p42（40） | 七殺廟旺武職 | 七殺在官祿廟旺：宜武職。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_POJUN` | 卷三・九官祿・破軍在官祿廟旺 | p42（40） | 破軍廟旺武職軒勝 | 破軍在官祿廟旺：武職顯達。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_WENQU` | 卷三・九官祿・文曲在官祿廟旺 | p42（40） | 文曲廟旺文武皆宜 | 文曲在官祿廟旺：文武皆宜。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_ZUOFU` | 卷三・九官祿・左輔在官祿入廟 | p42（40） | 左輔入廟文武之材武職最旺不利文人 | 左輔在官祿入廟：文武之材。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_ZUOFU_SHA` | 卷三・九官祿・左輔在官祿見羊陀火鈴空劫 | p42（40） | 見羊陀火鈴空劫進退聲名 | 左輔在官祿見羊陀火鈴空劫：聲名進退。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_YOUBI` | 卷三・九官祿・右弼在官祿與紫府昌曲同 | p42（40） | 與紫府昌曲同財官雙美 | 右弼在官祿與紫府昌曲同：財官雙美。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_YOUBI_SHA` | 卷三・九官祿・右弼在官祿見羊陀火鈴空劫 | p42（40） | 見羊陀火鈴空劫亦有黜降 | 右弼在官祿見羊陀火鈴空劫：亦有黜降。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_LUCUN` | 卷三・九官祿・祿存在官祿會吉 | p42（40） | 祿存會吉文武皆良財官雙美 | 祿存在官祿會吉：財官雙美。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_QINGYANG` | 卷三・九官祿・擎羊在官祿入廟 | p42（40） | 擎羊入廟最利武職同吉星權貴陷地平常虛名而已 | 擎羊在官祿入廟：利武職，同吉星權貴；落陷虛名。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_TUOLUO` | 卷三・九官祿・陀羅在官祿 | p42（40） | 陀羅獨守平常加吉星亦虛名而已 | 陀羅在官祿：平常；加吉星也只是虛名。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_HUOXING` | 卷三・九官祿・火星在官祿 | p42（40） | 火星晚年功名遂心早年成敗 | 火星在官祿：早年成敗、晚年功名遂心。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_LINGXING` | 卷三・九官祿・鈴星在官祿旺宮吉，加吉星權貴。 | p42（40） | 鈴星獨守旺宮吉陷地不美加諸吉星權貴 | 鈴星在官祿旺宮吉，加吉星權貴。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_DOUJUN` | 卷三・九官祿・斗君（流月）遇吉財官旺（本 App 沒有斗君）。 | p42（40） | 斗君遇吉其年月財官旺 | 斗君（流月）遇吉財官旺（本 App 沒有斗君）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_DING_GONGQING` | 卷三・九官祿・定公卿 | p42（40） | 輔弼星纏帝座中高官三品入朝中空亡惡殺三方見只是虛名受蔭封 | 定公卿：左右與紫微同在官祿（無空亡惡殺）：高官。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_DING_WENGUAN` | 卷三・九官祿・定文官 | p42（40） | 文官昌曲掛朝衣官祿之中喜有之 | 定文官：文昌、文曲在官祿：利文職。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_DING_WUGUAN` | 卷三・九官祿・定武官 | p42（40） | 將軍武曜最為良帝座權衡在祿鄉輔弼二星兼拱照金章玉帶佐皇王 | 定武官：武曲在官祿，紫微、化權與左右拱照：武職顯達。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_GUANLU_DING_CAOLI` | 卷三・九官祿・定曹吏 | p43（41） | 太陽化官在陽宮更有光輝始不凶若逢紫微兼左右一生曹吏逞英雄 | 定曹吏：太陽在官祿（陽宮光輝）又逢紫微與左右：以吏職發揮。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_TIANZHAI_ZIWEI` | 卷三・十田宅・紫微在田宅 | p43（41） | 紫微茂盛自置旺相 | 紫微在田宅：茂盛、自置旺相。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_TIANZHAI_ZIWEI_SHA` | 卷三・十田宅・紫微在田宅加羊陀火鈴空劫 | p43（41） | 加羊陀火鈴空劫有置有去 | 紫微在田宅加羊陀火鈴空劫：有置有去。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_TIANZHAI_TIANJI` | 卷三・十田宅・天機在田宅 | p43（41） | 天機退祖新創置 | 天機在田宅：離開舊產、另行創置。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_TIANZHAI_TIANJI_TAIYIN` | 卷三・十田宅・天機太陰同在田宅 | p43（41） | 太陰同自置旺相 | 天機太陰同在田宅：自置旺相。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_TIANZHAI_TAIYANG` | 卷三・十田宅・太陽在田宅入廟 | p43（41） | 太陽入廟得祖業初旺末平 | 太陽在田宅入廟：得祖業，初旺末平。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_TIANZHAI_WUQU` | 卷三・十田宅・武曲單居田宅旺地 | p43（41） | 武曲單居旺地得祖父大業陷地退後方成 | 武曲單居田宅旺地：得大業；落陷先退後成。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_TIANZHAI_WUQU_POJUN` | 卷三・十田宅・武曲破軍同在田宅 | p43（41） | 破軍大耗同破蕩家產有也不耐久 | 武曲破軍同在田宅：易破耗、不耐久。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_TIANZHAI_TIANTONG` | 卷三・十田宅・天同在田宅 | p43（41） | 天同先少後多自置甚旺 | 天同在田宅：先少後多、自置甚旺。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_TIANZHAI_LIANZHEN` | 卷三・十田宅・廉貞在田宅 | p43（41） | 廉貞破祖 | 廉貞在田宅：難守舊產。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_TIANZHAI_TIANFU` | 卷三・十田宅・天府在田宅 | p43（41） | 天府田園茂盛守祖自置旺相 | 天府在田宅：田園茂盛、守祖自置旺相。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_TIANZHAI_TIANFU_SHA` | 卷三・十田宅・天府在田宅見羊陀火鈴空劫 | p43（41） | 見羊陀火鈴空劫更少有成敗 | 天府在田宅見羊陀火鈴空劫：更少、有成敗。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_TIANZHAI_TAIYIN` | 卷三・十田宅・太陰在田宅入廟 | p43（41） | 太陰入廟田多 | 太陰在田宅入廟：田多。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_TIANZHAI_TAIYIN_XIAN` | 卷三・十田宅・太陰在田宅落陷加忌或煞 | p43（41） | 陷地加忌及羊陀火鈴空劫田全無 | 太陰在田宅落陷加忌或煞：難守產。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_TIANZHAI_TANLANG` | 卷三・十田宅・貪狼在田宅落陷 | p43（41） | 貪狼陷宮退祖一世田少 | 貪狼在田宅落陷：田少。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_TIANZHAI_JUMEN` | 卷三・十田宅・巨門在田宅廟旺 | p43（41） | 巨門廟旺橫發置買陷地無分因田產招非 | 巨門在田宅廟旺：橫發置買；落陷因田產招是非。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_TIANZHAI_JUMEN_XIAN` | 卷三・十田宅・巨門在田宅落陷 | p43（41） | 陷地無分因田產招非 | 巨門在田宅落陷：因田產招是非。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_TIANZHAI_TIANXIANG` | 卷三・十田宅・天相在田宅廟旺 | p43（41） | 天相廟旺有分 | 天相在田宅廟旺：有分。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_TIANZHAI_TIANLIANG` | 卷三・十田宅・天梁在田宅入廟 | p43（41） | 天梁入廟旺有祖業 | 天梁在田宅入廟：有祖業。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_TIANZHAI_POJUN` | 卷三・十田宅・破軍在田宅子午宮 | p43（41） | 破軍在子午宮守祖業 | 破軍在田宅子午宮：守祖業。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_TIANZHAI_POJUN_SHA` | 卷三・十田宅・破軍在田宅加羊陀火鈴 | p43（41） | 加羊陀火鈴退祖田少 | 破軍在田宅加羊陀火鈴：退祖田少。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_TIANZHAI_WENQU` | 卷三・十田宅・文曲在田宅旺地 | p43（41） | 旺地有分守祖業加吉星有置同羊陀火鈴空劫湊有進有退 | 文曲在田宅旺地：有分；遇羊陀火鈴空劫有進有退。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_TIANZHAI_ZUOFU` | 卷三・十田宅・左輔在田宅 | p43（41） | 左輔有祖業加羊陀火鈴空劫退祖田地少會吉星多 | 左輔在田宅：有祖業；加羊陀火鈴空劫則少。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_TIANZHAI_LUCUN` | 卷三・十田宅・祿存在田宅 | p43（41） | 祿存田園多旺自置 | 祿存在田宅：田園多、自置旺。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_TIANZHAI_QINGYANG` | 卷三・十田宅・擎羊在田宅入廟 | p43（41） | 擎羊入廟先破後成陷地加空劫退祖業 | 擎羊在田宅入廟：先破後成。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_TIANZHAI_TUOLUO` | 卷三・十田宅・陀羅在田宅 | p43（41） | 陀羅退祖辛勤度日 | 陀羅在田宅：退祖、辛勤。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_TIANZHAI_HUOXING` | 卷三・十田宅・火星獨守田宅 | p43（41） | 火星獨守退祖業 | 火星獨守田宅：退祖業。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_TIANZHAI_LINGXING` | 卷三・十田宅・鈴星在田宅 | p43（41） | 鈴星退祖入廟加吉星自有置 | 鈴星在田宅：退祖；入廟加吉星自有置。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_TIANZHAI_DOUJUN` | 卷三・十田宅・斗君過度田宅（本 App 沒有斗君）。 | p43（41） | 斗君過度遇吉星其年田產倍進 | 斗君過度田宅（本 App 沒有斗君）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_ZIWEI` | 卷三・十一福德・紫微在福德 | p43（41） | 紫微福厚享福安樂 | 紫微在福德：福厚安樂。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_ZIWEI_POJUN` | 卷三・十一福德・紫微破軍同在福德 | p43（41） | 破軍同勞心費力不安 | 紫微破軍同在福德：勞心費力。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_ZIWEI_SHA` | 卷三・十一福德・紫微在福德加羊陀火鈴空劫 | p43（41） | 加羊陀火鈴空劫福薄 | 紫微在福德加羊陀火鈴空劫：福薄。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_TIANJI` | 卷三・十一福德・天機在福德 | p43（41） | 天機先勞後逸 | 天機在福德：先勞後逸。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_TIANJI_SHA` | 卷三・十一福德・天機在福德加羊陀火鈴空劫 | p43（41） | 加羊陀火鈴空劫奔走不得寧靜 | 天機在福德加羊陀火鈴空劫：奔走不得寧靜。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_TAIYANG` | 卷三・十一福德・太陽在福德 | p43（41） | 太陽忙中發福 | 太陽在福德：忙中發福。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_WUQU` | 卷三・十一福德・武曲在福德 | p43（41） | 武曲勞心費力入廟安然享福 | 武曲在福德：勞心費力；入廟安然享福。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_WUQU_NOTMIAO` | 卷三・十一福德・武曲在福德（不入廟） | p43（41） | 武曲勞心費力 | 武曲在福德（不入廟）：勞心費力。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_TIANTONG` | 卷三・十一福德・天同在福德 | p43（41） | 天同快樂有福有壽 | 天同在福德：快樂有福。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_TIANTONG_JUMEN` | 卷三・十一福德・天同巨門同在福德 | p43（41） | 巨門同多憂少喜 | 天同巨門同在福德：多憂少喜。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_LIANZHEN` | 卷三・十一福德・廉貞獨守福德 | p43（41） | 廉貞獨守忙中生福 | 廉貞獨守福德：忙中生福。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_LIANZHEN_POJUN` | 卷三・十一福德・廉貞破軍同在福德 | p43（41） | 破軍同不守靜勞心費力 | 廉貞破軍同在福德：勞心費力。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_TIANFU` | 卷三・十一福德・天府在福德 | p43（41） | 天府安靜享福 | 天府在福德：安靜享福。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_TIANFU_SHA` | 卷三・十一福德・天府在福德加羊陀火鈴空劫 | p43（41） | 加羊陀火鈴空劫耗忌勞苦過日 | 天府在福德加羊陀火鈴空劫：勞苦。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_TANLANG` | 卷三・十一福德・貪狼在福德 | p44（42） | 貪狼勞心不安 | 貪狼在福德：勞心不安。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_JUMEN` | 卷三・十一福德・巨門在福德 | p44（42） | 巨門勞力不安 | 巨門在福德：勞力不安。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_TIANXIANG` | 卷三・十一福德・天相在福德 | p44（42） | 天相安逸享福有壽 | 天相在福德：安逸享福。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_TIANXIANG_SHA` | 卷三・十一福德・天相在福德加羊陀火鈴空劫 | p44（42） | 加羊陀火鈴空劫不得心靜 | 天相在福德加羊陀火鈴空劫：心不得靜。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_QISHA` | 卷三・十一福德・七殺在福德 | p44（42） | 七殺入廟享福陷地加羊陀火鈴勞心費力 | 七殺在福德：入廟享福；落陷加煞勞心費力。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_QISHA_XIAN` | 卷三・十一福德・七殺在福德落陷加煞 | p44（42） | 陷地加羊陀火鈴勞心費力 | 七殺在福德落陷加煞：勞心費力。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_POJUN` | 卷三・十一福德・破軍在福德 | p44（42） | 破軍勞心費力 | 破軍在福德：勞心費力。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_WENCHANG` | 卷三・十一福德・文昌在福德入廟加吉星 | p44（42） | 文昌加吉星入廟享福快樂 | 文昌在福德入廟加吉星：享福快樂。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_WENCHANG_XIAN` | 卷三・十一福德・文昌在福德落陷遇煞 | p44（42） | 陷地遇羊陀火鈴空劫心身俱不得安靜 | 文昌在福德落陷遇煞：身心不得安靜。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_ZUOFU` | 卷三・十一福德・左輔在福德加吉星 | p44（42） | 左輔加吉星享福獨守晚年安寧 | 左輔在福德加吉星：享福。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_YOUBI` | 卷三・十一福德・右弼在福德 | p44（42） | 右弼生平福祿全美加吉星一生少憂 | 右弼在福德：福祿全美。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_LUCUN` | 卷三・十一福德・祿存在福德 | p44（42） | 祿存終身福厚安靜處世 | 祿存在福德：終身福厚安靜。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_LUCUN_SHA` | 卷三・十一福德・祿存在福德見羊陀火鈴空劫 | p44（42） | 見羊陀火鈴空劫心身不得寧靜 | 祿存在福德見羊陀火鈴空劫：身心不得寧靜。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_KUIYUE` | 卷三・十一福德・魁鉞在福德 | p44（42） | 魁鉞有貴人為伴享福快樂 | 魁鉞在福德：有貴人為伴、享福快樂。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_QINGYANG` | 卷三・十一福德・擎羊在福德入廟 | p44（42） | 擎羊入廟動中有福 | 擎羊在福德入廟：動中有福。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_QINGYANG_DU` | 卷三・十一福德・擎羊獨守福德 | p44（42） | 獨守身心不安 | 擎羊獨守福德：身心不安。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_TUOLUO` | 卷三・十一福德・陀羅獨守福德 | p44（42） | 陀羅獨守辛勤 | 陀羅獨守福德：辛勤。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_HUOXING` | 卷三・十一福德・火星在福德 | p44（42） | 火星欠安勞力辛勤 | 火星在福德：欠安、勞力辛勤。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_LINGXING` | 卷三・十一福德・鈴星在福德 | p44（42） | 鈴星勞苦加吉星平和獨守辛勤 | 鈴星在福德：勞苦。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_DOUJUN` | 卷三・十一福德・斗君遇吉其年安靜（本 App 沒有斗君）。 | p44（42） | 斗君遇吉其年安靜逢凶殺欠寧 | 斗君遇吉其年安靜（本 App 沒有斗君）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUDE_SUIJUN` | 卷三・十一福德・歲君與大小二限過福德 | p44（42） | 歲君大小二限不過逢吉則享福逢凶則勞力辛苦 | 歲君與大小二限過福德：逢吉享福、逢凶勞力（未說明星曜條件）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_ZIWEI` | 卷三・三妻妾・紫微在夫妻 | p37（35） | 紫微晚聘諧老 | 紫微在夫妻：晚婚、偕老（原文另有性剛等描述）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_ZIWEI_TIANFU` | 卷三・三妻妾・紫微天府同在夫妻 | p37（35） | 天府同諧老 | 紫微天府同在夫妻：偕老。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_TAIYIN_TIANJI` | 卷三・三妻妾・天機太陰同在夫妻 | p37（35） | 太陰同內助美容 | 天機太陰同在夫妻：內助美好。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_TAIYANG_TIANLIANG` | 卷三・三妻妾・太陽天梁同在夫妻又加左右 | p37（35） | 與天梁同加左右招賢明之妻 | 太陽天梁同在夫妻又加左右：伴侶賢明。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_TIANTONG` | 卷三・三妻妾・天同在夫妻 | p37（35） | 天同遲娶諧老 | 天同在夫妻：遲婚偕老。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_TIANTONG_SHA` | 卷三・三妻妾・天同在夫妻加四煞 | p37（35） | 加四殺欠和 | 天同在夫妻加四煞：欠和（原文另有生離之說，不採用）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_TIANTONG_TIANLIANG` | 卷三・三妻妾・天同天梁同在夫妻 | p37（35） | 天梁同極美夫婦 | 天同天梁同在夫妻：夫婦極美。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_LIANZHEN_QISHA` | 卷三・三妻妾・廉貞七殺同在夫妻 | p37（35） | 七殺同亦刑且欠和 | 廉貞七殺同在夫妻：欠和（刑剋之說不採用）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_TIANFU` | 卷三・三妻妾・天府在夫妻 | p37（35） | 天府諧老 | 天府在夫妻：偕老。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_TAIYIN` | 卷三・三妻妾・太陰在夫妻入廟 | p37（35） | 太陰入廟男女皆貴美夫婦加昌曲極美 | 太陰在夫妻入廟：夫婦美好，加昌曲極美。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_TIANXIANG_ZIWEI` | 卷三・三妻妾・天相紫微同在夫妻 | p38（36） | 紫微同諧老 | 天相紫微同在夫妻：偕老。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_TIANXIANG_WUQU` | 卷三・三妻妾・天相武曲同在夫妻 | p38（36） | 武曲少和 | 天相武曲同在夫妻：少和。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_TIANLIANG_TIANTONG` | 卷三・三妻妾・天梁天同同在夫妻 | p38（36） | 天同同和氣 | 天梁天同同在夫妻：和氣。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_TIANLIANG_SHA` | 卷三・三妻妾・天梁在夫妻加羊陀火鈴空劫 | p38（36） | 加羊陀火鈴空劫朵不和順 | 天梁在夫妻加羊陀火鈴空劫：不和順。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_POJUN_LIANZHEN` | 卷三・三妻妾・破軍廉貞同在夫妻 | p38（36） | 廉貞亦剋且欠和 | 破軍廉貞同在夫妻：欠和（刑剋之說不採用）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_WENQU` | 卷三・三妻妾・文曲在夫妻會太陰與吉星 | p38（36） | 文曲相生會太陰諸吉星諧老 | 文曲在夫妻會太陰與吉星：偕老。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_FUBI` | 卷三・三妻妾・左輔、右弼在夫妻 | p38（36） | 左輔右弼諧老 | 左輔、右弼在夫妻：偕老。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_KUIYUE` | 卷三・三妻妾・天魁天鉞在夫妻 | p38（36） | 天魁天鉞多主夫婦美麗 | 天魁天鉞在夫妻：夫婦美好。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_DOUJUN` | 卷三・三妻妾・斗君過度夫妻宮（本 App 沒有斗君）。 | p38（36） | 斗君過度在妻宮逢吉星妻妾美無災剋 | 斗君過度夫妻宮（本 App 沒有斗君）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_XIONGDI_H1` | 卷三・二兄弟・紫微 | p37（35） | 紫微有倚靠年長之兄天府同三人天相同三四人破軍同亦有三人或各胞生加羊陀火鈴空劫剋害有則欠和 | 二兄弟宮紫微條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議＋第二來源佐證（AI，非人工校勘） 2026-10-04 |
| `CIT_GY_P_XIONGDI_H2` | 卷三・二兄弟・天機 | p37（35） | 天機廟旺有二人與巨門同二人陷地相背不一心天梁同二人太陰同二三人見羊陀火鈴雖有而剋害 | 二兄弟宮天機條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_XIONGDI_H3` | 卷三・二兄弟・太陽 | p37（35） | 太陽廟旺三人與巨門同無殺加有三人太陰同五人陷地不和欠力加羊陀火鈴空劫更剋減半 | 二兄弟宮太陽條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_XIONGDI_H4` | 卷三・二兄弟・武曲 | p37（35） | 武曲廟旺有二人不合陷宮加殺只一人天相同二人破軍七殺同有一人不和睦加昌曲左右有三人見羊陀火鈴空劫孤軍 | 二兄弟宮武曲條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_XIONGDI_H5` | 卷三・二兄弟・天同 | p37（35） | 天同入廟四五人天梁同二三人巨門同無殺三人太陰同四五人陷地只二人見羊陀火鈴空劫忌少宜分居不和 | 二兄弟宮天同條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議＋第二來源佐證（AI，非人工校勘） 2026-10-04 |
| `CIT_GY_P_XIONGDI_H6` | 卷三・二兄弟・廉貞 | p37（35） | 廉貞入廟二人貪狼同招怨天相同二人七殺同一人天府同加左右昌曲有三人見羊陀火鈴空劫有剋且不和 | 二兄弟宮廉貞條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_XIONGDI_H7` | 卷三・二兄弟・天府 | p37（35） | 天府有五人紫微同加左右昌曲有六七人廉貞同三人見羊陀火鈴空劫只二人 | 二兄弟宮天府條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_XIONGDI_H8` | 卷三・二兄弟・太陰 | p37（35） | 太陰入廟兄弟五人太陽同亦五六人天機同二人科權同四五人見羊陀火鈴空劫減半且剋宜分居相背 | 二兄弟宮太陰條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_XIONGDI_H9` | 卷三・二兄弟・貪狼 | p37（35） | 貪狼廟旺二人陷地宜各胞廉貞同不和紫微同有三人加羊陀火鈴空劫孤單 | 二兄弟宮貪狼條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_XIONGDI_H10` | 卷三・二兄弟・巨門 | p37（35） | 巨門廟旺二人陷地各胞有宜分居太陽同加左右昌曲有三人天機同有二人更乖違不一心天同二三人加羊陀火鈴空劫孤剋 | 二兄弟宮巨門條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_XIONGDI_H11` | 卷三・二兄弟・天相 | p37（35） | 天相和平有二三人見殺全無紫微同有三四人武曲同二人廉貞同二人見羊陀火鈴空劫孤單 | 二兄弟宮天相條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_XIONGDI_H12` | 卷三・二兄弟・天梁 | p37（35） | 天梁廟旺二人和順或多不同胞且不和陷宮全無天同同三人天機同二人見羊陀火鈴空劫少 | 二兄弟宮天梁條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_XIONGDI_H13` | 卷三・二兄弟・七殺 | p37（35） | 七殺主孤剋在子午寅申宮方有三人也不和宜各人加昌曲左右更好 | 二兄弟宮七殺條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議＋第二來源佐證（AI，非人工校勘） 2026-10-04 |
| `CIT_GY_P_XIONGDI_H14` | 卷三・二兄弟・紫微 | p37（35） | 紫微斗數卷三一 | 二兄弟宮紫微條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_XIONGDI_H15` | 卷三・二兄弟・左輔 | p37（35） | 左輔有三人同天同昌曲有四五人加羊陀火鈴二人有空劫欠力不和 | 二兄弟宮左輔條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_XIONGDI_H16` | 卷三・二兄弟・右弼 | p37（35） | 右弼三人同府相紫微昌曲有四五人加羊陀火鈴欠力不和睦 | 二兄弟宮右弼條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_XIONGDI_H17` | 卷三・二兄弟・祿存 | p37（35） | 祿存相生有兄弟見殺剋害招怨 | 二兄弟宮祿存條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_XIONGDI_H18` | 卷三・二兄弟・羊陀 | p37（35） | 羊陀剋害入廟一人眾吉星加有二三人陷地全無 | 二兄弟宮羊陀條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_XIONGDI_H19` | 卷三・二兄弟・火星 | p37（35） | 火星入廟逢有吉星有一二人加廉殺破鈴孤剋 | 二兄弟宮火星條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_XIONGDI_H20` | 卷三・二兄弟・鈴星 | p37（35） | 鈴星入廟相生有兄弟加羊陀火空劫全無 | 二兄弟宮鈴星條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_XIONGDI_H21` | 卷三・二兄弟・君逢 | p37（35） | 君逢在兄弟宮過度逢吉星兄弟一年和睦逢凶殺有刑者不見刑主有兄弟爭鬥 | 斗君（流月）過此宮之吉凶；本 App 客觀排盤沒有斗君。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_H1` | 卷三・三妻妾・紫微 | p37（35） | 紫微晚聘諧老性剛天府同諧老天相同宜年少破軍同剋刑加羊陀火鈴亦刑貪狼同有吉星免刑 | 三妻妾宮紫微條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_H2` | 卷三・三妻妾・天機 | p37（35） | 天機宜年少剛強之妻可配夫宜長加羊陀火鈴主生離晚娶吉天梁同宜年長太陰同內助美容 | 三妻妾宮天機條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_H3` | 卷三・三妻妾・太陽 | p37（35） | 太陽廟旺遲娶吉早娶剋因妻得貴與天梁同加左右招賢明之妻太陰同內助巨門同無羊陀火鈴空劫不剋有此四殺反空劫定剋遲耗非禮成婚 | 三妻妾宮太陽條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_H4` | 卷三・三妻妾・武曲 | p37（35） | 武曲背剋宜遲娶同年夫婦也相當加吉星因妻得財凶娶因妻去產貪狼同招遲無刑七殺同剋二三妻加羊陀火鈴空劫更剋 | 三妻妾宮武曲條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_H5` | 卷三・三妻妾・天同 | p37（35） | 天同遲娶諧老夫宜長妻宜少加四殺欠和生離巨門同加四殺亦剋太陰同助美容天梁同極美夫婦 | 三妻妾宮天同條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_H6` | 卷三・三妻妾・廉貞 | p37（35） | 廉貞三度作新郎即貪狼同愈剋七殺同亦刑且欠和加羊陀火鈴主生離天府諧老性剛者無剋 | 三妻妾宮廉貞條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_H7` | 卷三・三妻妾・太陽 | p37（35） | 太陽相生寵愛夫主貴見羊陀火鈴空劫遲娶免刑晚娶得諧老 | 三妻妾宮太陽條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_H8` | 卷三・三妻妾・太陰 | p37（35） | 太陰入廟男女皆貴美夫婦加昌曲極美加羊陀火鈴空劫耗忌不剋主生離太陽同諧老太同同內助天機同美好宜少年 | 三妻妾宮太陰條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_H9` | 卷三・三妻妾・貪狼 | p37（35） | 貪狼男女不得美三次作新郎入廟宜遲娶廉貞同主剋加羊陀火鈴主生離紫微同年長方可對 | 三妻妾宮貪狼條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_H10` | 卷三・三妻妾・天相 | p38（36） | 天相貌美賢淑夫宜年長親上成親紫微同諧老武曲少和廉貞同入廟免刑加羊陀火鈴空劫刑剋 | 三妻妾宮天相條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_H11` | 卷三・三妻妾・天梁 | p38（36） | 天梁妻宜大美容天同同和氣天機招美淑加羊陀火鈴空劫朵不和順 | 三妻妾宮天梁條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_H12` | 卷三・三妻妾・七殺 | p38（36） | 七殺早剋武曲同亦剋或遲娶免刑廉貞主生離加羊陀火鈴空劫剋三妻 | 三妻妾宮七殺條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_H13` | 卷三・三妻妾・破軍 | p38（36） | 破軍男女俱剋別娶主生離武曲同剋三廉貞亦剋且欠和紫微同宜年長之妻 | 三妻妾宮破軍條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_H14` | 卷三・三妻妾・文昌 | p38（36） | 文昌妻少內助聰明天機太陰同主美容不宜陷地加羊陀火鈴空劫深忌 | 三妻妾宮文昌條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_H15` | 卷三・三妻妾・文曲 | p38（36） | 文曲相生會太陰諸吉星諧老同昌曲妻妾多加羊陀火鈴空劫忌星有剋 | 三妻妾宮文曲條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_H16` | 卷三・三妻妾・祿存 | p38（36） | 祿存相生無剋妻宜年少並頭遲娶者加羊陀火鈴空劫見截路空亡孤單 | 三妻妾宮祿存條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_H17` | 卷三・三妻妾・左輔 | p38（36） | 左輔右弼諧老加羊陀火鈴空劫貪廉同宜年長剛強之妻羊陀入廟加吉星遲娶免刑或欠和陷地早剋加日月巨機火鈴武殺主生離 | 三妻妾宮左輔條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_H18` | 卷三・三妻妾・火鈴星 | p38（36） | 火鈴星入廟加吉無刑陷地刑剋 | 三妻妾宮火鈴星條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_H19` | 卷三・三妻妾・天魁 | p38（36） | 天魁天鉞多主夫婦美麗坐妻宮必主得妻財加吉星同主貴美夫婦 | 三妻妾宮天魁條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUQI_H20` | 卷三・三妻妾・斗君 | p38（36） | 斗君過度在妻宮逢吉星妻妾美無災剋逢惡星妻妾有災厄又看人本命妻宮若剋妻者的主其年刑傷妻妾若除剋者斷其年有災 | 斗君（流月）過此宮之吉凶；本 App 客觀排盤沒有斗君。 | pendingVerification | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_ZINV_H1` | 卷三・四子女・天機 | p38（36） | 天機廟旺二人或庶生多巨門同一人天梁同在寅宮有三人在申宮女多男少只可一子太陰同二三人加羊火鈴空劫全無子 | 四子女宮天機條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 | pendingVerification | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_ZINV_H2` | 卷三・四子女・太陽 | p38（36） | 太陽入廟男三女二晚子貴巨門同三人太陰同五人陷地有三子不成蓋再加羊陀火鈴空劫止留一子送終 | 四子女宮太陽條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議＋第二來源佐證（AI，非人工校勘） 2026-10-04 |
| `CIT_GY_P_ZINV_H3` | 卷三・四子女・廉貞 | p38（36） | 廉貞一人天府同主貴子三人若貪狼破軍七殺同主孤再加羊陀火鈴空劫全無天相同有二子 | 四子女宮廉貞條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_ZINV_H4` | 卷三・四子女・天府 | p38（36） | 天府五人武曲同二人紫微同四五人廉貞同三人加羊陀火鈴空劫止三人 | 四子女宮天府條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_ZINV_H5` | 卷三・四子女・太陰 | p38（36） | 太陰女三男二先女後男廟旺有貴子陷地減半招軟弱之子或虛花不成器太陽同五人天機同二人天同同五人廟地無剋陷地有剋加羊陀火鈴空劫子少 | 四子女宮太陰條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_ZINV_H6` | 卷三・四子女・貪狼 | p38（36） | 貪狼廟旺二人早有刑剋紫微同二人廉貞同子少如吉星二人武曲同三人先難後易 | 四子女宮貪狼條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_ZINV_H7` | 卷三・四子女・巨門 | p38（36） | 巨門入廟二人先難後易太陽同居頭一二子易養加羊陀火鈴子少天機同一人有吉星同二人加空劫全無 | 四子女宮巨門條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_ZINV_H8` | 卷三・四子女・天相 | p38（36） | 天相無羊陀火鈴同有二子成器有殺先招祀子居長親生一二子紫微同如昌曲左右有三四人武曲同有三人見 | 四子女宮天相條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_ZINV_H9` | 卷三・四子女・羊陀 | p38（36） | 羊陀火鈴空劫必剋宜偏室生 | 四子女宮羊陀條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_ZINV_H10` | 卷三・四子女・天梁 | p38（36） | 天梁廟旺二人加羊陀火鈴空劫早剋天同同加昌曲左右吉星有三人天機同有二人加羊陀火鈴空劫全無 | 四子女宮天梁條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_ZINV_H11` | 卷三・四子女・七殺 | p39（37） | 七殺主孤一人之分紫微同再吉星有三人見羊陀火鈴空劫全無縱有不成器必強橫敗家之子 | 四子女宮七殺條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_ZINV_H12` | 卷三・四子女・破軍 | p39（37） | 破軍入廟三人剛強之子見紫微同三人武曲同加昌曲左右有三人廉貞同一人見羊陀相生有制無刑難空劫火陀子少 | 四子女宮破軍條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 | pendingVerification | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_ZINV_H13` | 卷三・四子女・左輔 | p39（37） | 左輔單居男三女一見紫微天府諸吉星主貴子見破殺羊陀火鈴空劫止二人有也不成器 | 四子女宮左輔條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_ZINV_H14` | 卷三・四子女・右弼 | p39（37） | 右弼三人加吉星有貴子見羊陀火鈴空劫減半 | 四子女宮右弼條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_ZINV_H15` | 卷三・四子女・文昌 | p39（37） | 文昌三人加吉星更多有擎陀火鈴空劫只可一子之分 | 四子女宮文昌條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_ZINV_H16` | 卷三・四子女・文曲 | p39（37） | 文曲廟旺有四人陷地有二三人加羅陀擎羊火鈴子少 | 四子女宮文曲條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_ZINV_H17` | 卷三・四子女・祿存 | p39（37） | 祿存主孤宜庶出一螟蛉之子加吉星有一人加火星諸殺孤刑 | 四子女宮祿存條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_ZINV_H18` | 卷三・四子女・羊陀 | p39（37） | 羊陀陷宮孤單加吉星廟旺有一人如對宮有吉星多無殺沖亦有三四人見耗殺忌在本宮絕嗣 | 四子女宮羊陀條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_ZINV_H19` | 卷三・四子女・火星 | p39（37） | 火星逢吉同不孤陷宮加殺刑傷 | 四子女宮火星條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_ZINV_H20` | 卷三・四子女・鈴星 | p39（37） | 鈴星獨守孤單加吉星入廟可許庶出看對宮吉多二三人 | 四子女宮鈴星條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_ZINV_H21` | 卷三・四子女・魁鉞 | p39（37） | 魁鉞單守主有貴子 | 四子女宮魁鉞條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議＋第二來源佐證（AI，非人工校勘） 2026-10-04 |
| `CIT_GY_P_ZINV_H22` | 卷三・四子女・斗君 | p39（37） | 斗君在子女宮過度逢吉子女昌盛逢凶刑剋或子破家 | 斗君（流月）過此宮之吉凶；本 App 客觀排盤沒有斗君。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIE_H1` | 卷三・六疾厄・紫微 | p40（38） | 紫微災少天府同亦少天相同皮胎勞如加破軍血氣不和同羊鈴主有暗疾加空劫主孤疾心氣疾 | 六疾厄宮紫微條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIE_H2` | 卷三・六疾厄・天機 | p40（38） | 天機襁褓多災陷地頭面破相巨門同血氣疾天梁同下部疾太陰同瘡災加羊火陷宮有目疾四肢無力 | 六疾厄宮天機條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIE_H3` | 卷三・六疾厄・太陽 | p40（38） | 太陽頭風太陰同加化忌羊陀主眼目有傷陷宮亦主目疾欠光明 | 六疾厄宮太陽條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIE_H4` | 卷三・六疾厄・武曲 | p40（38） | 武曲襁褓災迍手足頭面有傷羊陀同一生常有災天相同招暗疾七殺同血疾貪狼同廟旺無疾陷地加四殺眼手足疾痔疾瘋瘡 | 六疾厄宮武曲條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIE_H5` | 卷三・六疾厄・天同 | p40（38） | 天同入廟災少巨門同心氣疾太陰同加羊火血氣疾天梁同加四殺心氣疾 | 六疾厄宮天同條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIE_H6` | 卷三・六疾厄・廉貞 | p40（38） | 廉貞襁褓災瘡腰足之疾入廟加吉和平遇貪狼同陷地眼疾災多七殺破軍天府同災少 | 六疾厄宮廉貞條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIE_H7` | 卷三・六疾厄・天府 | p40（38） | 天府災少臨災有救紫微同災少加羊陀火鈴空劫有瘋疾廉貞同加劫殺空亡半途傷殘 | 六疾厄宮天府條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIE_H8` | 卷三・六疾厄・太陰 | p40（38） | 太陰廟旺無災陷地災多主勞傷之症女人主有傷殘若太陽同加吉美一生災少同羊陀火鈴眼目疾加空劫有瘋疾天同同加羊陀陷宮主加症同火鈴多災 | 六疾厄宮太陰條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIE_H9` | 卷三・六疾厄・巨門 | p40（38） | 巨門少年濃血之厄太陽同有頭瘋疽天同同下部主有瘋症加羊火酒色之疾加忌有耳目之憂 | 六疾厄宮巨門條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIE_H10` | 卷三・六疾厄・天相 | p40（38） | 天相災少面皮黃腫血氣之疾紫微同災少武曲同加四殺破相廉貞同加空劫手足傷 | 六疾厄宮天相條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIE_H11` | 卷三・六疾厄・七殺 | p40（38） | 七殺幼年多災長主痔疾武曲同加四殺手足傷殘廉貞同主目疾加擎羊四肢有傷殘 | 六疾厄宮七殺條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIE_H12` | 卷三・六疾厄・文昌 | p40（38） | 文昌獨守災少加羊陀火鈴空劫災多同諸吉星一生無災 | 六疾厄宮文昌條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議＋第二來源佐證（AI，非人工校勘） 2026-10-04 |
| `CIT_GY_P_JIE_H13` | 卷三・六疾厄・文曲 | p40（38） | 文曲災少加吉星一世無災加羊陀火鈴空劫坐陷宮災有 | 六疾厄宮文曲條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIE_H14` | 卷三・六疾厄・左輔 | p40（38） | 左輔獨守平和加吉星災少見羊陀火鈴空劫常有災 | 六疾厄宮左輔條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIE_H15` | 卷三・六疾厄・右弼 | p40（38） | 右弼獨守逢災有救見羊陀火鈴空劫災多 | 六疾厄宮右弼條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIE_H16` | 卷三・六疾厄・祿存 | p40（38） | 祿存少年多災加吉星災少見羊陀火鈴四肢必傷殘加空劫致暗疾延生 | 六疾厄宮祿存條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIE_H17` | 卷三・六疾厄・擎羊 | p40（38） | 擎羊有頭瘋之症或四肢欠力頭面破相延壽加吉星災少 | 六疾厄宮擎羊條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIE_H18` | 卷三・六疾厄・陀羅 | p40（38） | 陀羅幼年災磨唇齒頭面有傷破方可延壽 | 六疾厄宮陀羅條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIE_H19` | 卷三・六疾厄・羊鈴 | p40（38） | 羊鈴主一生災少身體健旺伶利 | 六疾厄宮羊鈴條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_JIE_H20` | 卷三・六疾厄・斗君 | p40（38） | 斗君遇吉身心安寧其年無災遇凶殺本生人有畏忌其年多災 | 斗君（流月）過此宮之吉凶；本 App 客觀排盤沒有斗君。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUMU_H1` | 卷三・十二父母・太陽 | p44（42） | 太陽入廟無剋陷地剋父加羊陀火鈴空劫剋父母早太陰同看無羊陀湊父母全遲刑巨門同加四殺空劫剋早喪梁同無刑 | 十二父母宮太陽條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 | pendingVerification | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUMU_H2` | 卷三・十二父母・武曲 | p44（42） | 武曲剋早退祖業不刑貪狼同刑剋七殺同有刑天相同加羊陀火鈴空劫刑傷 | 十二父母宮武曲條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUMU_H3` | 卷三・十二父母・天同 | p44（42） | 天同獨守廟旺無刑加四殺重拜父母巨門同欠和太陰同父母雙全天梁同無刑或退祖業加羊陀火鈴空劫父母不全 | 十二父母宮天同條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUMU_H4` | 卷三・十二父母・廉貞 | p44（42） | 廉貞難為父母棄祖重拜貪狼同早刑七殺孤剋天府同免刑破軍同早刑加羊陀火鈴空父母不周全 | 十二父母宮廉貞條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議＋第二來源佐證（AI，非人工校勘） 2026-10-04 |
| `CIT_GY_P_FUMU_H5` | 卷三・十二父母・天府 | p44（42） | 天府父母雙全紫微同亦無刑廉貞武曲同在廟旺無刑加羊陀火鈴空劫主傷 | 十二父母宮天府條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUMU_H6` | 卷三・十二父母・太陰 | p44（42） | 太陰入廟無剋加羊陀火鈴剋母不然過房棄祖太陽同無四殺父母雙全天機同無刑天同同極美 | 十二父母宮太陰條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUMU_H7` | 卷三・十二父母・貪狼 | p44（42） | 貪狼陷地早棄祖重拜過房入贅廉貞同早刑主孤單紫微同無殺加雙全 | 十二父母宮貪狼條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUMU_H8` | 卷三・十二父母・巨門 | p44（42） | 巨門陷地傷剋棄祖過房太陽同少和天機同重拜天同同或退祖無刑加羊陀火鈴空劫父母不周全 | 十二父母宮巨門條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUMU_H9` | 卷三・十二父母・天相 | p44（42） | 天相廟旺無刑紫微同無刑武曲同刑剋廉貞同亦刑加羊陀火鈴空劫早刑 | 十二父母宮天相條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUMU_H10` | 卷三・十二父母・天梁 | p44（42） | 天梁陷地加羊陀火鈴孤剋棄祖入贅更名寄人保養免刑天同同加四殺有刑無殺無刑天機同無刑太陽同剋遲加四殺空劫亦剋早 | 十二父母宮天梁條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUMU_H11` | 卷三・十二父母・七殺 | p44（42） | 七殺剋早離祖六親骨肉孤獨武曲同亦刑廉貞同刑早紫微同加吉星無刑加羊陀火鈴空劫父母不周全 | 十二父母宮七殺條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUMU_H12` | 卷三・十二父母・破軍 | p44（42） | 破軍剋早離祖更名寄養免刑武曲同剋早廉貞同亦早剋紫微同無刑 | 十二父母宮破軍條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUMU_H13` | 卷三・十二父母・文昌 | p45（43） | 文昌加吉星入廟無刑加羊陀火鈴有刑或退祖二姓延生 | 十二父母宮文昌條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUMU_H14` | 卷三・十二父母・文曲 | p45（43） | 文曲獨守入廟無刑加羊陀火鈴空劫父母俱不周全 | 十二父母宮文曲條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUMU_H15` | 卷三・十二父母・左輔 | p45（43） | 左輔獨守無刑廉貞同早刑加文昌相生無刑加羊陀火鈴刑傷退祖二姓延生 | 十二父母宮左輔條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUMU_H16` | 卷三・十二父母・右弼 | p45（43） | 右弼獨守無刑加吉星得父母庇蔭見羊陀火鈴湊離祖二姓安居 | 十二父母宮右弼條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUMU_H17` | 卷三・十二父母・祿存 | p45（43） | 祿存無剋加空劫羊陀火鈴早年有所依附且刑傷中不自成家計 | 十二父母宮祿存條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 | pendingVerification | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUMU_H18` | 卷三・十二父母・擎羊 | p45（43） | 擎羊刑剋早會日月重重退祖加吉星減免刑 | 十二父母宮擎羊條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 | pendingVerification | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUMU_H19` | 卷三・十二父母・陀羅 | p45（43） | 陀羅幼年刑傷會日月重重退祖二姓安居加吉星入贅過房或重拜二姓延生 | 十二父母宮陀羅條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議＋第二來源佐證（AI，非人工校勘） 2026-10-04 |
| `CIT_GY_P_FUMU_H20` | 卷三・十二父母・火星 | p45（43） | 火星獨守孤剋二姓延生加吉星平和 | 十二父母宮火星條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUMU_H21` | 卷三・十二父母・鈴星 | p45（43） | 鈴星刑剋孤單二姓安居重拜父母入贅過房 | 十二父母宮鈴星條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUMU_H22` | 卷三・十二父母・魁鉞 | p45（43） | 魁鉞主父母榮貴同吉星雙全 | 十二父母宮魁鉞條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_P_FUMU_H23` | 卷三・十二父母・斗君 | p45（43） | 斗君過度逢吉父母吉利無災傷得安逸內外有喜遇凶則父母不利 | 斗君（流月）過此宮之吉凶；本 App 客觀排盤沒有斗君。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_TAIYANG_WENCHANG_GUANLU` | 卷一・卷一・太陽會文昌於官祿 | p17（15） | 太陽會文昌於官祿皇殿首班之貴 | 太陽與文昌同在官祿宮（逢吉曜）：貴顯。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_LUCUN_TIANCAI` | 卷一・卷一・祿存守於田財 | p17（15） | 祿存守於田財則堆金積玉 | 祿存守田宅或財帛：大富。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_CAIYIN_QIANYI` | 卷一・卷一・財蔭坐于遷移 | p17（15） | 坐于遷移必巨商高賈 | 武曲或天梁（其一化權）坐遷移：宜經商。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_DUIMIAN_CHAODOU` | 卷一・卷一・對面朝斗格 | p17（15） | 論對面朝斗格子午宮逢祿存是也 | 命在子午，遷移（對面）有祿存：利祿、受人敬重。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_KEQUANLU` | 卷一・卷一・科權祿主格 | p17（15） | 詩曰祿權周勃逢命中入相王朝贊聖功 | 化祿、化權在命：貴顯。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_ZUOYOU_CHAOYUAN` | 卷一・卷一・左右朝垣格 | p17（15） | 天星左右最高明若在三方祿位興 | 左輔、右弼在命宮三方，又有祿：興旺。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_JIANWENWU` | 卷一・卷一・兼文武格 | p17（15） | 論兼文武格文曲武曲在身命是也 | 文曲、武曲在命宮（命宮無煞破）：文武兼備、百事通達。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_WENXING_CHAOMING` | 卷一・卷一・文星朝命格 | p17（15） | 詩曰文昌文曲最榮華值此須 | 文昌、文曲朝命（三方祥曜拱）：富貴。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_SHIZHONG_YINYU` | 卷一・卷一・石中隱玉格 | p17（15） | 論石中隱玉格命在子午逢巨門是也 | 巨門在子午坐命，三方有化科、化祿：貴。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_HUOTAN` | 卷一・卷一・火貪格 | p17（15） | 論貪狼遇火名為火格三合照身命是也 | 貪狼遇火星於命宮三合（三方無凶煞）：富貴。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_SHANGGU_AN` | 卷一・卷一・商賈之命（安分） | p17（15） | 如人命有巨日紫府守照為人安分 | 命有巨門、太陽、紫微、天府守照：為人安分耿直（非商賈之命）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_SHANGGU` | 卷一・卷一・商賈之命 | p17（15） | 如值月貪同殺忌心多機關貪財無厭 | 太陰、貪狼同殺忌會命：擅於謀利（原文另有「貪財無厭」的品格斷語，不採用）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_SHUYI` | 卷一・卷一・術藝之命 | p17（15） | 寅申巳亥安命或辰戌丑未遇有貪狼武曲在命化忌加殺必作細巧藝術之人也 | 命在四馬或四墓，貪狼、武曲在命又化忌加煞：宜細巧技藝。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_SENGDAO` | 卷一・卷一・僧道之命 | p17（15） | 論出家僧道之命紫微居卯酉遇劫空者 | 僧道之命：出家斷語，只保留原文。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_GUKE` | 卷一・卷一・孤剋之命 | p17（15） | 論人命內犯孤剋者如剋妻剋子剋父母 | 孤剋之命：孤剋斷語，只保留原文。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_SHAJUEDI` | 卷一・卷一・殺居絕地 | p17（15） | 殺居絕地天年夭似顏回 | 殺居絕地：夭壽斷語，只保留原文。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_HAOJULUWEI` | 卷一・卷一・耗居祿位 | p17（15） | 耗居祿位沿途乞食 | 耗居祿位：貧賤斷語，只保留原文。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_HUITAN` | 卷一・卷一・會貪旺宮 | p17（15） | 會貪旺宮終身鼠竊 | 會貪旺宮：品格斷語，只保留原文。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_JIAN_JIE` | 卷一・卷一・忌暗同居 | p17（15） | 忌暗同居命宮疾厄困弱尪羸 | 忌暗同居：疾病斷語，只保留原文。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_XINGSHA_LIANZHEN` | 卷一・卷一・刑殺會廉貞於官祿 | p17（15） | 刑殺會廉貞於官祿枷杻同流 | 刑殺會廉貞於官祿：刑獄斷語，只保留原文。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_GUANFU_JIA` | 卷一・卷一・官府夾刑殺 | p17（15） | 官府夾刑殺于遷移離鄉遭配 | 官府夾刑殺：刑獄斷語，只保留原文。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_DING_CONGMING` | 卷一・卷一・定人聰明 | p18（16） | 詩曰文曲天相破軍星計策偏多性更靈更若三方昌曲會一生巧藝有聲名 | 文曲、天相、破軍在命：計策多；三方再會昌曲：巧藝有名。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_DING_FUZU` | 卷一・卷一・定人富足 | p18（16） | 詩曰太陰入廟有光輝財入財鄉分外奇破耗凶星皆不犯堆金積玉富豪兒 | 太陰入廟、財星入財帛，又不犯破耗凶星：富足。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_DING_PINJIAN` | 卷一・卷一・定人貧賤 | p18（16） | 詩曰命中吉曜不來臨火忌羊陀四正侵武曲廉貞巨破會 | 命中無吉星，火忌羊陀侵四正，又會武曲廉貞巨門破軍：多困（原文「暴怒身貧」不直接顯示）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_DING_DAOZEI` | 卷一・卷一・定人作盜賊 | p18（16） | 詩曰命逢破耗與貪貞七殺三方照及身 | 定人作盜賊：品格斷語，只保留原文。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_DING_SHOUYAO` | 卷一・卷一・壽夭淫蕩 | p18（16） | 論壽夭淫蕩 | 壽夭淫蕩：壽夭與品格斷語，只保留原文。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_DING_CANJI` | 卷一・卷一・定人殘疾 | p18（16） | 論定人殘疾先看命宮星落陷 | 定人殘疾：疾病斷語，只保留原文。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_DING_POXIANG` | 卷一・卷一・定人破相 | p18（16） | 詩曰相貌之中逢殺曜更加三合又逢刑 | 定人破相：身體斷語，只保留原文。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_WUZHI` | 卷一・卷一・武職論 | p18（16） | 武職論如武曲七殺坐命廟旺宮 | 武曲、七殺坐命廟旺，加化權祿及魁鉞拱照：武職。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_FUGUI_LUN` | 卷一・卷一・富貴論 | p18（16） | 富貴論如紫微天府天相祿權科太陰太陽文昌文曲左輔右弼天魁天鉞守照拱沖主大富貴 | 紫府相、祿權科、日月、昌曲、左右、魁鉞守照：大富貴（本 App 取紫府日月其一在命且三方有左右昌曲魁鉞）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_PINJIAN_LUN` | 卷一・卷一・貧賤論 | p18（16） | 貧賤論如擎羊陀羅廉貞七殺武曲破軍天空地劫忌星三方四正守照拱沖諸凶併犯陷地主貧賤 | 羊陀、廉殺武破、空劫、化忌併犯三方四正且陷地：多困（「貧賤」不直接顯示）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_XINGMING_LUN` | 卷一・卷一・刑名論 | p18（16） | 刑名論如擎羊陀羅火鈴星武曲破軍 | 刑名論：主星、煞星與「上吉湊合」的組合條件不明確，另有兩輪轉錄與補轉錄讀法不一。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_JIYAO_LUN` | 卷一・卷一・疾夭論 | p18（16） | 疾妖論如貪狼廉貞擎羊陀羅天空地劫火鈴忌星三方守照主疾殀 | 疾夭論：疾病夭壽斷語，只保留原文。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_SENGDAO_LUN` | 卷一・卷一・僧道論 | p18（16） | 僧道論如天機天梁七殺破軍天空地劫併犯帝座紫微 | 僧道論：出家斷語，只保留原文。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_CONGMING_LUN` | 卷一・卷一・聰明論 | p18（16） | 聰明論如文昌文曲天相天府武曲破軍三台八座左輔右弼三合拱照主人聰明 | 聰明論：條件含三台、八座，本 App 客觀排盤沒有這兩顆星。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_HEGE_ZI` | 卷一・卷一・子宮得地合格 | p18（16） | 子安命子宮貪狼殺陰星機梁相拱福興隆庚辛乙癸生人美 | 子宮得地合格：「貪狼殺陰星機梁相拱」所列星曜不可能同時在子宮三方成立，條件需另行考證。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_HEGE_CHOU` | 卷一・卷一・丑宮得地合格 | p18（16） | 丑安命丑宮立命日月朝丙戊生人福祿饒 | 命在丑宮，日月來朝（命無主星、對宮日月），丙戊年生：福祿饒。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_HEGE_YIN` | 卷一・卷一・寅宮得地合格 | p18（16） | 寅安命寅宮巨日足豐隆 | 命在寅宮，巨門、太陽坐命：豐隆。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_HEGE_MAO` | 卷一・卷一・卯宮得地合格 | p18（16） | 卯安命卯宮機巨武曲逢辛乙生人福氣隆 | 命在卯宮，天機巨門（或武曲）坐命，辛乙年生：福氣隆。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_HEGE_SI` | 卷一・卷一・巳宮得地合格 | p18（16） | 巳安命巳位天機天相臨紫府朝垣福更深戊辛壬丙皆為貴 | 命在巳宮，天機或天相坐命、紫府朝垣，戊辛壬丙年生：貴。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_HEGE_WEI` | 卷一・卷一・未宮得地合格 | p18（16） | 未安命未宮紫武廉貞同日月巨門喜相逢 | 命在未宮，紫微、武曲、廉貞其一坐命，會日月巨門：貴。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_HEGE_SHEN` | 卷一・卷一・申宮得地合格 | p18（16） | 申安命申宮紫帝貞梁同武曲巨門喜相逢甲庚癸人如得喜一生富貴逞英雄 | 命在申宮，紫微或廉貞、天梁坐命，會武曲巨門，甲庚癸年生：富貴。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_HEGE_YOU` | 卷一・卷一・酉宮得地合格 | p18（16） | 酉安命酉宮最喜太陰逢巨日又逢當面沖辛乙生人為貴格 | 命在酉宮，太陰坐命、巨日對沖，辛乙年生：貴格。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_HEGE_XU` | 卷一・卷一・戌宮得地合格 | p19（17） | 戌安命戌宮紫微對沖辰富而不貴有虛名 | 命在戌宮，對宮辰有紫微沖照：富而不貴、有虛名。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_HEGE_HAI` | 卷一・卷一・亥宮得地合格 | p19（17） | 亥安命亥宮最喜太陰逢若人值此福祿隆 | 命在亥宮，太陰坐命：福祿隆。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_HEGE_WU` | 卷一・卷一・午宮得地合格 | p18（16） | 午安命午宮紫府太陽同機梁破殺喜相逢 | 午宮得地合格：後半句（生年與結果）有疑字。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_HEGE_CHEN` | 卷一・卷一・辰宮得地合格 | p18（16） | 辰安命辰位機梁坐命宮天府 | 辰宮得地合格：「天府□地」有疑字。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_POGE_WU` | 卷一・卷一・午宮失陷破格 | p19（17） | 午安命午宮貪巨月昌侵羊刃三合最嫌沖雖然化吉居仕路橫破橫成到老窮 | 命在午宮，貪狼、巨門、太陰或文昌坐命又有擎羊三合沖：起伏大（「到老窮」不直接顯示）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_POGE_CHOUZI` | 卷一・卷一・子丑失陷破格 | p19（17） | 安命子午天機丑巨鈴此星落陷果為真縱然化吉更為美任他富貴不清盈 | 命在子午有天機，或在丑有巨門、鈴星而落陷：縱然化吉，富貴也不清盈。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_POGE_OTHER` | 卷一・卷一・其他失陷破格 | p19（17） | 十二宮諸星失陷破格訣 | 其他失陷破格：寅、卯辰、巳、未、申酉、戌、亥各訣主要為貧賤、夭折、奴僕娼婢等斷語，只保留原文。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_DEDI_LUN` | 卷一・卷一・十二宮諸星得地富貴論 | p19（17） | 十二宮諸星得地富貴論 | 十二宮諸星得地富貴論：歌訣逐宮列舉星名，未分條給出完整條件（與各星「X宮Y地」條目重複者已在卷二處理）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_FU_CAIYINJIAYIN` | 卷一・卷一・定富局 | p19（17） | 財蔭夾印相守命武梁來夾是也 | 天相守命，武曲、天梁左右來夾。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_FU_RIYUEJIACAI` | 卷一・卷一・定富局 | p19（17） | 日月夾財武守命日月來夾是也 | 武曲守命，太陽、太陰左右來夾。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_FU_CAILUJIAMA` | 卷一・卷一・定富局 | p19（17） | 財祿夾馬馬守命武祿來夾是也 | 天馬守命，武曲、祿存左右來夾。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_FU_RIYUEZHAOBI` | 卷一・卷一・定富局 | p19（17） | 日月照壁日月臨田宅宮是也 | 太陽、太陰同在田宅宮。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_FU_JINCAN` | 卷一・卷一・定富局 | p19（17） | 金燦光輝太陽單守命在午宮是也 | 太陽單守命宮在午。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_FU_YINYIN` | 卷一・卷一・定富局 | p19（17） | 印拱身身臨田宅梁相拱沖是也 | 陰印拱身：格名首字有疑字，且條件涉及身宮落田宅，暫列候選。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_GUI_RIYUEJIAMING` | 卷一・卷一・定貴局 | p19（17） | 日月夾命不坐空亡遇逢本宮有吉星是也 | 太陽、太陰夾命，本宮有吉星（空亡本 App 未排，未納入條件）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_GUI_RICHU` | 卷一・卷一・定貴局 | p19（17） | 日出扶桑日在卯守命是也守官祿宮亦然 | 太陽在卯宮守命或守官祿。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_GUI_YUELUO` | 卷一・卷一・定貴局 | p19（17） | 月落亥宮月在亥守命是也又名月朗天門 | 太陰在亥宮守命。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_GUI_YUESHENG` | 卷一・卷一・定貴局 | p19（17） | 月生滄海月在子宮守田宅是也 | 太陰在子宮守田宅。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_GUI_FUBIGONGZHU` | 卷一・卷一・定貴局 | p19（17） | 輔弼拱主紫微守命二星來拱是也夾之亦然 | 紫微守命，左輔、右弼來拱或來夾。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_GUI_JUNCHEN` | 卷一・卷一・定貴局 | p19（17） | 君臣慶會紫微左右同守命是也 | 紫微與左輔、右弼同守命宮。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_GUI_CAIYINJIALU` | 卷一・卷一・定貴局 | p19（17） | 財印夾祿祿守命梁相來夾是也 | 祿存守命，天梁、天相左右來夾。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_GUI_LUMAPEIYIN` | 卷一・卷一・定貴局 | p19（17） | 祿馬佩印馬前有祿印星同宮是也 | 祿馬佩印：「馬前」「印星」所指位置不明確。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_GUI_ZUOGUI` | 卷一・卷一・定貴局 | p19（17） | 坐貴向貴謂魁鉞在命 | 坐貴向貴：註文有疑字。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_GUI_MATOU` | 卷一・卷一・定貴局 | p19（17） | 馬頭帶劍謂馬有刃是也 | 天馬與擎羊同守命宮。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_GUI_XINGQIU` | 卷一・卷一・定貴局 | p19（17） | 刑囚夾印天刑廉貞同臨身命主武勇之人 | 天刑、廉貞同臨命宮：武勇。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_GUI_TANHUO` | 卷一・卷一・定貴局 | p19（17） | 貪火相逢謂二星守命同居廟旺是也 | 貪狼、火星同守命宮且廟旺。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_GUI_WUQUSHOUYUAN` | 卷一・卷一・定貴局 | p19（17） | 武曲守垣武守命卯宮是也餘不是 | 武曲在卯宮守命。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_GUI_QUANLU` | 卷一・卷一・定貴局 | p19（17） | 權祿生逢二星守命廟旺是也陷不是 | 化權、化祿同守命宮（星曜廟旺）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_GUI_QINGYANG` | 卷一・卷一・定貴局 | p19（17） | 擎羊入廟辰戌丑未守命遇吉是也 | 擎羊在辰戌丑未守命，又遇吉星。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_GUI_JINYU` | 卷一・卷一・定貴局 | p19（17） | 金輿扶駕紫微守命前後有日月來夾是也 | 紫微守命，太陽、太陰前後來夾。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_GUI_SEEPRIOR_1` | 卷一・卷一・定貴局 | p19（17） | 七殺朝斗見前註解 | 七殺朝斗：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_GUI_SEEPRIOR_2` | 卷一・卷一・定貴局 | p19（17） | 日月並明見前註解 | 日月並明：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_GUI_SEEPRIOR_3` | 卷一・卷一・定貴局 | p19（17） | 明珠出海見前註解 | 明珠出海：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_GUI_SEEPRIOR_4` | 卷一・卷一・定貴局 | p19（17） | 日月同臨見前註解 | 日月同臨：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_GUI_SEEPRIOR_5` | 卷一・卷一・定貴局 | p19（17） | 科權祿拱見前註解 | 科權祿拱：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_GUI_SEEPRIOR_6` | 卷一・卷一・定貴局 | p19（17） | 府相朝垣見前註解 | 府相朝垣：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_GUI_SEEPRIOR_7` | 卷一・卷一・定貴局 | p19（17） | 紫府朝垣見前註解 | 紫府朝垣：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_GUI_SEEPRIOR_8` | 卷一・卷一・定貴局 | p19（17） | 文星暗拱見前註解 | 文星暗拱：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_GUI_SEEPRIOR_9` | 卷一・卷一・定貴局 | p19（17） | 巨機居卯見前註解 | 巨機居卯：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_GUI_SEEPRIOR_10` | 卷一・卷一・定貴局 | p19（17） | 明祿暗祿見前註解 | 明祿暗祿：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_GUI_SEEPRIOR_11` | 卷一・卷一・定貴局 | p19（17） | 科明祿暗見前註解 | 科明祿暗：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_PIN_SHENGBUFENGSHI` | 卷一・卷一・定貧賤局 | p19（17） | 生不逢時命坐空亡逢 | 生不逢時：註文有疑字，且條件含空亡（本 App 未排）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_PIN_LUFENGLIANGSHA` | 卷一・卷一・定貧賤局 | p19（17） | 祿逢兩殺祿坐空亡又逢空劫殺星是也 | 祿逢兩殺：條件含空亡（旬空／截空），本 App 客觀排盤沒有。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_PIN_MALUO` | 卷一・卷一・定貧賤局 | p19（17） | 馬落空亡馬既落亡雖祿沖會 | 馬落空亡：條件含空亡，本 App 客觀排盤沒有。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_PIN_RIYUECANGHUI` | 卷一・卷一・定貧賤局 | p19（17） | 日月藏輝日月反背又逢巨暗是也 | 太陽或太陰落陷（反背）在命，又逢巨門：多困（「貧賤」不直接顯示）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_PIN_CAIYUQIUCHOU` | 卷一・卷一・定貧賤局 | p19（17） | 財與囚仇武 | 財與囚仇：註文有疑字。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_PIN_YISHENGGUPIN` | 卷一・卷一・定貧賤局 | p19（17） | 一生孤貧謂破守命星陷地是也 | 破軍守命落陷：多困（「孤貧」不直接顯示）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_PIN_JUNZI` | 卷一・卷一・定貧賤局 | p20（18） | 君子在野謂 | 君子在野：註文有疑字與缺字。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_PIN_LIANGZHONGHUAGAI` | 卷一・卷一・定貧賤局 | p20（18） | 兩重華蓋謂祿存化祿坐命遇空劫是也 | 祿存、化祿同坐命宮又遇地空地劫：成敗起伏。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_ZA_FENGYUN` | 卷一・卷一・定雜局 | p20（18） | 風雲際會身命雖弱二限逢祿馬是也 | 大限命宮逢祿（祿存或化祿）與天馬：好運際會。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_ZA_JINSHANG` | 卷一・卷一・定雜局 | p20（18） | 錦上添花謂限破惡星而行吉地是也 | 錦上添花：「限破惡星而行吉地」未指明星曜與宮位。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_ZA_LUSHUAI` | 卷一・卷一・定雜局 | p20（18） | 祿衰馬困限逢七殺祿馬空亡是也 | 祿衰馬困：條件含空亡。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_ZA_YIJIN` | 卷一・卷一・定雜局 | p20（18） | 衣錦還鄉少年不遂四十後行墓運是也 | 衣錦還鄉：「墓運」所指不明確。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_ZA_SHAOSUI` | 卷一・卷一・定雜局 | p20（18） | 無衣前限接後限逢錦不分是也 | 少歲無衣：格名有疑字。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_ZA_SHUISHANG` | 卷一・卷一・定雜局 | p20（18） | 水上駕星一年好一年不好是也 | 水上駕星：只描述結果，沒有盤面條件。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_ZA_JIXIONG` | 卷一・卷一・定雜局 | p20（18） | 吉凶相伴命有主星限前則發限衰不發是也 | 吉凶相伴：「限前」「限衰」未指明條件。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_PAT_ZA_KUMU` | 卷一・卷一・定雜局 | p20（18） | 枯木逢春謂命衰限好是也 | 枯木逢春：「命衰限好」沒有具體星曜條件。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_TANXING` | 卷三・譚星要論・ | p45（43） | 第一看命主吉凶廟旺化吉化忌生剋次看身主吉凶生剋三看遷 | 看命先看命主吉凶廟旺與化吉化忌，次看身主，三看遷移財帛官祿三方，四看福德。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_RUGE` | 卷三・論人命入格・ | p45（43） | 如命入格廟旺聚吉科權祿守上上之命不入廟加吉化吉科權祿上次之命 | 入格且廟旺、聚吉與科權祿守照為上上之命；不入廟但加吉化吉次之；入格而化凶，只以本命吉凶多寡論。入格不能單獨判吉。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_RUGE2` | 卷三・論人命入格・ | p45（43） | 若居陷地又加殺化忌為下格之命不以入格而論也又入格不化吉而化凶只以本命吉凶多寡而斷之 | 若居陷地又加煞化忌為下格，不以入格論；入格而化凶，只以本命吉凶多寡斷之。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_GEXING` | 卷三・論格星數高下・ | p45（43） | 三方四正皆吉星為上格吉凶相半守照為中格 | 三方四正皆吉星為上格，吉凶相半為中格；星格與數格高下相配，分九等。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_NANNV` | 卷三・論男女命異同・ | p45（43） | 男命先看身命次看財帛官祿遷移俱要廟旺為吉敗陷聚凶為凶 | 男命先看身命，次看財帛、官祿、遷移，都以廟旺為吉、落陷聚凶為凶（女命之論含性別角色斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_SHENGSHI_YANG` | 卷三・論人生時安命吉凶・ | p46（44） | 凡男女生在寅午戌申子辰六陽時安命在此六宮者吉 | 生在六陽時（寅午戌申子辰）而命宮也在六陽宮：吉。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_SHENGSHI_YIN` | 卷三・論人生時安命吉凶・ | p46（44） | 生在巳酉丑亥卯未六陰時安命在此六合者吉 | 生在六陰時（巳酉丑亥卯未）而命宮也在六陰宮：吉。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_SHENGSHI_FAN` | 卷三・論人生時安命吉凶・ | p46（44） | 反則少遂 | 時辰陰陽與命宮陰陽相反：較少順遂。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_SHENGSHI_SHEN` | 卷三・論人生時要審的確・ | p46（44） | 如人生子亥二時最難定準要仔細推詳 | 子、亥二時最難定準，要仔細推詳；時辰錯則命不準（排盤前的提醒，不作判讀）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_XIAOER` | 卷三・定小兒生時訣・ | p46（44） | 子午卯酉單頂門或偏左邊二三分 | 以嬰兒頭頂旋紋推定時辰（非判讀內容）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_XIAOER_KEQIN` | 卷三・論小兒・ | p46（44） | 小兒初生命中星辰廟旺大小二限未行斷其災少易養父母無剋 | 小兒命宮星辰廟旺災少易養（屬嬰幼兒健康與刑剋斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_DAXIAN_ANJING` | 卷三・論大限十年禍福何如・ | p46（44） | 分星纏全吉廟旺得地無擎羊陀羅火鈴空劫者主十年安靜人財全美 | 大限宮星曜廟旺得地、沒有羊陀火鈴空劫：十年安靜、人財兩美。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_DAXIAN_SHA` | 卷三・論大限十年禍福何如・ | p46（44） | 若限內有擎羊陀羅火鈴空劫忌星為伴成 | 大限內有羊陀火鈴空劫或化忌為伴：成敗不一。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_DAXIAN_XIAN` | 卷三・論大限十年禍福何如・ | p46（44） | 敗不一如宮分星纏陷地值擎羊陀羅火鈴空劫忌又加流年惡殺湊合及小限巡逢凶殺則官災死亡立見 | 大限落陷又逢煞忌、流年惡煞與小限凶煞：古籍斷為官災死亡（死亡斷語，且需小限，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_DAXIAN_SIMA` | 卷三・論大限十年禍福何如・ | p46（44） | 凡行至寅申巳亥子午宮遇紫微天府天同太陽太陰昌曲祿存 | 大限行至寅申巳亥子午宮，遇紫微、天府、天同、太陽、太陰、昌曲、祿存等吉星：人財興旺。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_DAXIAN_SIMU` | 卷三・論大限十年禍福何如・ | p46（44） | 行至辰戌丑未卯酉遇惡殺廉貞天使羊陀火鈴空劫忌星 | 大限行至辰戌丑未卯酉宮，遇廉貞、羊陀火鈴空劫、化忌等：破耗、勞碌（原文另有酒色、貧乏、死生之說，不採用）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_DAXIAN_ZUOYOU` | 卷三・論大限十年禍福何如・ | p46（44） | 遇左右昌曲仕宦遷官加職士民生子發財婦人喜事 | 大限遇左輔、右弼、文昌、文曲：升遷加職、得財、喜事。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_DAXIAN_JIA` | 卷三・論大限十年禍福何如・ | p46（44） | 凡大小二限及太歲怕行天 | 大小二限與太歲怕行天傷天使夾地、空劫、羊陀之地（天傷、天使、小限本 App 沒有）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_DAXIAN_SHOUXING` | 卷三・論大限十年禍福何如・ | p46（44） | 若逃得過須看壽星紫微天同天 | 逢凶限能否逃過，看壽星紫微、天同、天梁、貪狼坐命可解（壽命斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_DAXIAN_TAISUI12` | 卷三・論大限十年禍福何如・ | p46（44） | 太歲行至奏書將軍直符 | 太歲行至奏書、將軍、直符等（博士十二神、歲前諸星），本 App 沒有這些星。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_ERXIAN` | 卷三・論二限太歲吉星凶・ | p46（44） | 須詳大限獨守吉凶何如小限獨守吉凶何如太歲獨守吉凶何如歲限俱凶則凶 | 大限、小限、太歲分別看吉凶，都凶才凶；再看彼此相逢與相沖。本 App 以本命為基準，大限、流年只作修正。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_NANBEI` | 卷三・論行限分南北斗・ | p47（45） | 陽男陰女南斗為福陰男陽女北斗為福 | 陽男陰女以南斗為福，陰男陽女以北斗為福；北斗星的吉凶應在大限前五年，南斗應在後五年（時間原則，不改大限起迄）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_NANBEI2` | 卷三・論行限分南北斗・ | p47（45） | 北斗諸星吉凶大限斷上五年應小限斷上半年應 | 北斗諸星吉凶：大限應在前五年，小限應在上半年。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_TAISUI_MING` | 卷三・論流年太歲逢吉凶星殺・ | p47（45） | 凡太歲看三方對照星辰吉凶何如以定禍福太歲在命宮行者禍福尤緊 | 流年要看太歲宮三方對照的吉凶；太歲回到命宮之年，禍福更要緊。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_YINZHI` | 卷三・論陰騭延壽・ | p47（45） | 陰騭延壽生百福雖然倒限不遭傷 | 行善積德可延壽（道德與壽命論述，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_YANGTUO_DIEBING` | 卷三・論羊陀迭併・ | p47（45） | 謂之羊陀迭併 | 本命擎羊陀羅與流年流羊流陀重疊沖合；本 App 沒有流年擎羊、陀羅。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_QISHA_CHONGFENG` | 卷三・論七殺重逢・ | p47（45） | 如命中三合原有七殺守照而流年又遇流羊流陀沖照 | 命中三合有七殺，流年又遇流羊流陀沖照；本 App 沒有流年擎羊、陀羅。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_JI_ZI` | 卷三・論大小二限星辰遍十二宮人所忌訣・ | p47（45） | 人生子命忌寅申 | 子年生人，太歲在寅、申之年災悔較重。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_JI_CHOUWU` | 卷三・論大小二限星辰遍十二宮人所忌訣・ | p47（45） | 丑午生人丑午嗔 | 丑年生人忌午年，午年生人忌丑年。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_JI_YINMAO` | 卷三・論大小二限星辰遍十二宮人所忌訣・ | p47（45） | 寅卯之人防巳亥 | 寅、卯年生人防巳、亥年。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_JI_SHELONG` | 卷三・論大小二限星辰遍十二宮人所忌訣・ | p47（45） | 蛇龍切忌本身臨 | 巳年生人忌巳年、辰年生人忌辰年（本命年）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_JI_SHEN` | 卷三・論大小二限星辰遍十二宮人所忌訣・ | p47（45） | 申人鈴火災殃重 | 申年生人流年命宮逢火星、鈴星：災悔較重。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_JI_WEI` | 卷三・論大小二限星辰遍十二宮人所忌訣・ | p47（45） | 未遇猪雞墓惡 | 未年生人忌亥、酉年。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_JI_XUHAI` | 卷三・論大小二限星辰遍十二宮人所忌訣・ | p47（45） | 戌亥羊陀須避忌 | 戌、亥年生人流年命宮逢擎羊、陀羅：災重。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_JI_YOU` | 卷三・論大小二限星辰遍十二宮人所忌訣・ | p47（45） | 酉人陀刃亦非親 | 酉年生人流年命宮逢陀羅、擎羊：不利。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_LIMING_XINGXIAN` | 卷三・論立命行限宮歌・ | p47（45） | 金人遇坎命須傷 | 依命局五行與行限方位論傷災（傷亡、膿血斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_SUIZHI_ZI_JI` | 卷三・子年太歲所值吉凶星・ | p47（45） | 祿存天機天同太陰昌曲輔弼破軍天相廉貞武曲天府巨門七殺可斷其年人財兩美事事遂心 | 子年，太歲宮有祿存、天機、天同、太陰、昌曲、輔弼、破軍、天相、廉貞、武曲、天府、巨門、七殺：人財兩美。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_SUIZHI_ZI_XIONG` | 卷三・子年太歲所值吉凶星・ | p48（46） | 天梁忌星太陽擎羊便斷人財耗散官災孝服 | 子年，太歲宮遇（貪狼、紫微、）天梁、化忌、太陽、擎羊：人財耗散、官災口舌（「孝服」不採用）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_SUIZHI_CHOU_JI` | 卷三・丑年太歲所值吉凶星・ | p48（46） | 紫微天相天梁太陰天府祿存廉貞破軍昌曲天機輔弼可斷其年事事遂心 | 丑年，太歲宮有紫微、天相、天梁、太陰、天府、祿存、廉貞、破軍、昌曲、天機、輔弼：事事遂心。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_SUIZHI_CHOU_XIONG` | 卷三・丑年太歲所值吉凶星・ | p48（46） | 若遇天同巨門武曲貪狼忌宿太陽 | 丑年，太歲宮遇天同、巨門、武曲、貪狼、化忌、太陽、擎羊：人財耗散、官災口舌。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_SUIZHI_YIN_JI` | 卷三・寅年太歲所值吉凶星・ | p48（46） | 紫微天府天機太陰武曲七殺天同天相太陽巨門天梁便斷其年人財進益作事遂心 | 寅年，太歲宮有紫微、天府、天機、太陰、武曲、七殺、天同、天相、太陽、巨門、天梁：人財進益。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_SUIZHI_YIN_XIONG` | 卷三・寅年太歲所值吉凶星・ | p48（46） | 若遇貪狼陀忌便斷其年 | 寅年，太歲宮遇貪狼、陀羅、化忌：人財破散、官非。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_SUIZHI_MAO_JI` | 卷三・卯年太歲所值吉凶星・ | p48（46） | 太陰天梁紫微天機天同天府貪狼巨門七殺即斷其年人財興旺婚姻喜事重重諸事稱心 | 卯年，太歲宮有太陰、天梁、紫微、天機、天同、天府、貪狼、巨門、七殺：人財興旺、婚姻喜事。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_SUIZHI_MAO_XIONG` | 卷三・卯年太歲所值吉凶星・ | p48（46） | 若遇廉貞破軍太陰天相擎羊忌宿其年破財官災口舌 | 卯年，太歲宮遇廉貞、破軍、太陰、天相、擎羊、化忌：破財、官災口舌（原文太陰在吉凶兩列都出現）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_SUIZHI_CHEN_JI` | 卷三・辰年太歲所值吉凶星・ | p48（46） | 太陽天機天梁貪狼七殺文昌左輔右弼便斷其年財祿大進益家道更興隆添丁進口婚姻喜慶重重 | 辰年，太歲宮有太陽、天機、天梁、貪狼、七殺、文昌、左右：財祿大進、婚姻喜慶。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_SUIZHI_CHEN_XIONG` | 卷三・辰年太歲所值吉凶星・ | p48（46） | 若遇紫微天同廉貞天府太陰巨門天相破軍忌宿便斷其年破財孝服官災口舌 | 辰年，太歲宮遇紫微、天同、廉貞、天府、太陰、巨門、天相、破軍、化忌：破財、官災口舌（「孝服」不採用）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_SUIZHI_SI_JI` | 卷三・巳年太歲所值吉凶星・ | p48（46） | 紫微太陽天同天府天梁祿存便斷其年人財稱意喜事重重 | 巳年，太歲宮有紫微、太陽、天同、天府、天梁、祿存：人財稱意、喜事重重。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_SUIZHI_SI_XIONG` | 卷三・巳年太歲所值吉凶星・ | p48（46） | 若遇武曲廉貞太陰貪狼巨門天相破軍忌星便斷 | 巳年，太歲宮遇武曲、廉貞、太陰、貪狼、巨門、天相、破軍、化忌：人財損失、官災口舌（原文另有病患之說）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_SUIZHI_WU_JI` | 卷三・午年太歲所值吉凶星・ | p49（47） | 紫微天機天府太陽武曲廉貞天相巨門天梁破軍祿存便斷其年人財興旺婚姻喜事重重 | 午年，太歲宮有紫微、天機、天府、太陽、武曲、廉貞、天相、巨門、天梁、破軍、祿存：人財興旺、婚姻喜事。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_SUIZHI_WU_XIONG` | 卷三・午年太歲所值吉凶星・ | p49（47） | 若值太陰貪狼天同羊陀忌星便斷其年人財破敗官災口舌 | 午年，太歲宮遇太陰、貪狼、天同、羊陀、化忌：人財破敗、官災口舌。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_SUIZHI_WEI_JI` | 卷三・未年太歲所值吉凶星・ | p49（47） | 紫微天府廉貞天機破軍天相便斷其年人財增益作事如意婚姻產育之喜 | 未年，太歲宮有紫微、天府、廉貞、天機、破軍、天相：人財增益、婚姻之喜。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_SUIZHI_WEI_XIONG` | 卷三・未年太歲所值吉凶星・ | p49（47） | 若遇太陰太陽武曲天同貪狼巨門 | 未年，太歲宮遇太陰、太陽、武曲、天同、貪狼、巨門、羊陀、化忌：人財耗散、官災。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_SUIZHI_SHEN_JI` | 卷三・申年太歲所值吉凶星・ | p49（47） | 紫微太陽廉貞天府巨門七殺文昌武曲祿存便斷其年人財利益喜事重重 | 申年，太歲宮有紫微、太陽、廉貞、天府、巨門、七殺、文昌、武曲、祿存：人財利益、喜事重重。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_SUIZHI_SHEN_XIONG` | 卷三・申年太歲所值吉凶星・ | p49（47） | 若遇天機天同天梁天相太陰破軍 | 申年，太歲宮遇天機、天同、天梁、天相、太陰、破軍：人財散失、官非。 | pendingVerification | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_SUIZHI_YOU_JI` | 卷三・酉年太歲所值吉凶星・ | p49（47） | 紫微天府昌曲左右便斷其年人財興旺作事遂心 | 酉年，太歲宮有祿存、紫微、天府、昌曲、左右：人財興旺。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_SUIZHI_YOU_XIONG` | 卷三・酉年太歲所值吉凶星・ | p49（47） | 若值天機巨門武曲廉貞擎羊陀忌便斷其年人離 | 酉年，太歲宮遇天機、巨門、武曲、廉貞、擎羊、陀羅、化忌：人離財散、口舌官非。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_SUIZHI_XU_JI` | 卷三・戌年太歲所值吉凶星・ | p49（47） | 天機太陰天梁天府武曲七殺貪狼左右天同便斷其年人財利益作事遂心家道興隆 | 戌年，太歲宮有天機、太陰、天梁、天府、武曲、七殺、貪狼、左右、天同：人財利益。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_SUIZHI_XU_XIONG` | 卷三・戌年太歲所值吉凶星・ | p49（47） | 如遇巨門太陽破軍紫微 | 戌年，太歲宮遇巨門、太陽、破軍、紫微、天相、化忌：人財退失、官災（原文另有病之說）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_SUIZHI_HAI_JI` | 卷三・亥年太歲所值吉凶星・ | p50（48） | 天同太陰天梁紫微天府昌曲祿存便斷其年人財進益喜氣重重謀事俱稱心懷 | 亥年，太歲宮有天同、太陰、天梁、紫微、天府、昌曲、祿存：人財進益、謀事稱心。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_SUIZHI_HAI_XIONG` | 卷三・亥年太歲所值吉凶星・ | p50（48） | 若遇廉貞破軍七殺便斷其年 | 亥年，太歲宮遇廉貞、破軍、七殺：人財耗散（原文另有死亡之說，不採用）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_XIAOXIAN_0_JI` | 卷三・論太歲小限星辰廟限遇十二宮中吉凶・ | p47（45） | 子年太歲併小限到子宮入廟化吉 | 子年太歲併小限到子宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_XIAOXIAN_0_XIONG` | 卷三・論太歲小限星辰廟限遇十二宮中吉凶・ | p47（45） | 子年太歲併小限到子宮不入廟化凶 | 子年太歲併小限到子宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_XIAOXIAN_1_JI` | 卷三・論太歲小限星辰廟限遇十二宮中吉凶・ | p48（46） | 丑年太歲併小限到丑宮入廟化吉 | 丑年太歲併小限到丑宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_XIAOXIAN_1_XIONG` | 卷三・論太歲小限星辰廟限遇十二宮中吉凶・ | p48（46） | 丑年太歲併小限到丑宮不入廟化凶 | 丑年太歲併小限到丑宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_XIAOXIAN_2_JI` | 卷三・論太歲小限星辰廟限遇十二宮中吉凶・ | p48（46） | 寅年太歲併小限到寅宮入廟化吉 | 寅年太歲併小限到寅宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_XIAOXIAN_2_XIONG` | 卷三・論太歲小限星辰廟限遇十二宮中吉凶・ | p48（46） | 寅年太歲併小限到寅宮不入廟化凶 | 寅年太歲併小限到寅宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_XIAOXIAN_3_JI` | 卷三・論太歲小限星辰廟限遇十二宮中吉凶・ | p48（46） | 卯年太歲併小限到卯宮入廟化吉 | 卯年太歲併小限到卯宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_XIAOXIAN_3_XIONG` | 卷三・論太歲小限星辰廟限遇十二宮中吉凶・ | p48（46） | 卯年太歲併小限到卯宮不入廟化凶 | 卯年太歲併小限到卯宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_XIAOXIAN_4_JI` | 卷三・論太歲小限星辰廟限遇十二宮中吉凶・ | p48（46） | 辰年太歲併小限到辰宮入廟化吉 | 辰年太歲併小限到辰宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_XIAOXIAN_4_XIONG` | 卷三・論太歲小限星辰廟限遇十二宮中吉凶・ | p48（46） | 辰年太歲併小限到辰宮不入廟化凶 | 辰年太歲併小限到辰宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_XIAOXIAN_5_JI` | 卷三・論太歲小限星辰廟限遇十二宮中吉凶・ | p48（46） | 巳年太歲併小限到巳宮入廟化吉 | 巳年太歲併小限到巳宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_XIAOXIAN_5_XIONG` | 卷三・論太歲小限星辰廟限遇十二宮中吉凶・ | p48（46） | 巳年太歲併小限到巳宮不入廟化凶 | 巳年太歲併小限到巳宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_XIAOXIAN_6_JI` | 卷三・論太歲小限星辰廟限遇十二宮中吉凶・ | p48（46） | 午年太歲併小限到午宮入廟化吉 | 午年太歲併小限到午宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_XIAOXIAN_6_XIONG` | 卷三・論太歲小限星辰廟限遇十二宮中吉凶・ | p49（47） | 午年太歲併小限到午宮不入廟凶 | 午年太歲併小限到午宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_XIAOXIAN_7_JI` | 卷三・論太歲小限星辰廟限遇十二宮中吉凶・ | p49（47） | 未年太歲併小限到未宮入廟化吉 | 未年太歲併小限到未宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_XIAOXIAN_7_XIONG` | 卷三・論太歲小限星辰廟限遇十二宮中吉凶・ | p49（47） | 未年太歲併小限到未宮不入廟化凶 | 未年太歲併小限到未宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_XIAOXIAN_8_JI` | 卷三・論太歲小限星辰廟限遇十二宮中吉凶・ | p49（47） | 申年太歲併小限到申宮入廟化吉 | 申年太歲併小限到申宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_XIAOXIAN_8_XIONG` | 卷三・論太歲小限星辰廟限遇十二宮中吉凶・ | p49（47） | 申年太歲併小限到申宮不入廟化凶 | 申年太歲併小限到申宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_XIAOXIAN_9_JI` | 卷三・論太歲小限星辰廟限遇十二宮中吉凶・ | p49（47） | 酉年太歲併小限到酉宮入廟化吉 | 酉年太歲併小限到酉宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_XIAOXIAN_9_XIONG` | 卷三・論太歲小限星辰廟限遇十二宮中吉凶・ | p49（47） | 壬生人不宜 | 酉年太歲併小限到酉宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_XIAOXIAN_10_JI` | 卷三・論太歲小限星辰廟限遇十二宮中吉凶・ | p49（47） | 戌年太歲併小限到戌宮入廟化吉 | 戌年太歲併小限到戌宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_XIAOXIAN_10_XIONG` | 卷三・論太歲小限星辰廟限遇十二宮中吉凶・ | p49（47） | 戌年太歲併小限到戌宮不入廟化凶 | 戌年太歲併小限到戌宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_XIAOXIAN_11_JI` | 卷三・論太歲小限星辰廟限遇十二宮中吉凶・ | p49（47） | 亥年太歲併小限到亥宮入廟化吉 | 亥年太歲併小限到亥宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_R_XIAOXIAN_11_XIONG` | 卷三・論太歲小限星辰廟限遇十二宮中吉凶・ | p50（48） | 亥年太歲併小限到亥宮不入廟化凶 | 亥年太歲併小限到亥宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_ZIWEI_01` | 卷三・論諸星同位垣・紫微 | p50（48） | 紫微居午無刑忌甲丁巳命至公卿 | 紫微在午宮坐命，三方無擎羊、化忌，甲、丁、己年生人：可至公卿（原文「巳」讀為天干「己」；小注：加刑忌則平常）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_ZIWEI_02` | 卷三・論諸星同位垣・紫微 | p50（48） | 紫微居子午科權祿照最為奇 | 紫微在子午宮坐命，三方有化科、化權、化祿照會：最為奇特（小注：科權祿三方照）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_ZIWEI_03` | 卷三・論諸星同位垣・紫微 | p50（48） | 紫微男亥女寅宮壬甲生人富貴同 | 紫微坐命，男命在亥、女命在寅，壬、甲年生人：同樣富貴。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_ZIWEI_04` | 卷三・論諸星同位垣・紫微 | p50（48） | 紫微卯酉劫空四殺多為脫俗之僧 | 紫微在卯酉逢劫空四煞：古籍斷為出家（出家斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_ZIWEI_05` | 卷三・論諸星同位垣・紫微 | p50（48） | 紫微天府全依輔弼之功 | 紫微、天府坐命，全靠左輔、右弼相助（小注：紫府得輔弼同垣或拱照，終身富貴）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_ZIWEI_06` | 卷三・論諸星同位垣・紫微 | p50（48） | 紫微同宮無殺湊甲人享福終身紫府同在寅申宮守命六甲人富貴 | 紫微、天府同在寅申宮守命，無煞星湊合，甲年生人：終身享福、富貴。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_ZIWEI_07` | 卷三・論諸星同位垣・紫微 | p50（48） | 紫府朝垣活祿逢終身福厚至三公 | 紫微、天府在三方朝命，又逢化祿：終身福厚、地位高。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_ZIWEI_08` | 卷三・論諸星同位垣・紫微 | p50（48） | 紫府同臨巳亥一朝富貴雙全 | 命在巳亥，紫微、天府分居巳亥（一坐一對照）：富貴雙全。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_ZIWEI_09` | 卷三・論諸星同位垣・紫微 | p50（48） | 紫府日月居旺地必定出佳公卿器 | 紫微或天府坐命廟旺，太陽、太陰在三方也居廟旺：公卿之器。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_ZIWEI_10` | 卷三・論諸星同位垣・紫微 | p50（48） | 紫府武曲臨財宅更兼權祿富奢翁 | 紫微或天府、武曲在財帛或田宅，又有化權、化祿：富有（小注：得左右、祿存亦可）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_ZIWEI_11` | 卷三・論諸星同位垣・紫微 | p50（48） | 紫微輔弼同宮一呼百諾居上品 | 紫微與左輔或右弼同在命宮：一呼百諾、居上品。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_ZIWEI_12` | 卷三・論諸星同位垣・紫微 | p50（48） | 紫府擎羊在巨商得武曲居遷移者多 | 紫微或天府坐命、會擎羊：多為大商人（小注：得武曲居遷移者多）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_ZIWEI_13` | 卷三・論諸星同位垣・紫微 | p50（48） | 紫府夾命為貴格 | 紫微、天府在命宮左右相夾：貴格。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_ZIWEI_14` | 卷三・論諸星同位垣・紫微 | p50（48） | 紫祿同宮日月照貴不可言 | 紫微、祿存同在命宮，太陽、太陰在三方拱照：貴不可言。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_ZIWEI_15` | 卷三・論諸星同位垣・紫微 | p50（48） | 紫微昌曲富貴可期 | 紫微坐命會文昌、文曲：富貴可期。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_ZIWEI_16` | 卷三・論諸星同位垣・紫微 | p50（48） | 紫微七殺化權反作禎祥 | 紫微、七殺同坐命宮而有化權：反為吉祥。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_ZIWEI_17` | 卷三・論諸星同位垣・紫微 | p50（48） | 紫微太陰殺曜逢一生曹吏逞英雄 | 紫微坐命、會太陰又逢煞星：一生在吏職中發揮。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_ZIWEI_18` | 卷三・論諸星同位垣・紫微 | p50（48） | 紫微破軍無左右無吉曜凶惡胥吏之徒 | 紫微破軍無左右吉曜：古籍斷為凶惡胥吏（品格斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_ZIWEI_19` | 卷三・論諸星同位垣・紫微 | p50（48） | 紫微武曲破軍會羊陀欺公禍亂只宜經商 | 紫微坐命，會武曲、破軍與擎羊、陀羅：只宜經商。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_ZIWEI_20` | 卷三・論諸星同位垣・紫微 | p50（48） | 紫微權祿遇羊陀雖獲吉而無道 | 紫微權祿遇羊陀：古籍斷為心術不正（品格斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_ZIWEI_21` | 卷三・論諸星同位垣・紫微 | p50（48） | 紫微七殺加空亡虛名受蔭 | 紫微七殺加空亡：虛名受蔭。空亡不在客觀排盤中。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_ZIWEI_22` | 卷三・論諸星同位垣・紫微 | p50（48） | 紫破命臨于辰戌丑未再加吉曜富貴堪期 | 紫微（與破軍同宮或對照）坐命在辰戌丑未，又加吉星：富貴可期。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_ZIWEI_23` | 卷三・論諸星同位垣・紫微 | p50（48） | 紫破辰戌君臣不義 | 紫破在辰戌：古籍斷為君臣不義（品格斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_ZIWEI_24` | 卷三・論諸星同位垣・紫微 | p50（48） | 女命紫微太陽星早遇賢夫信可憑 | 女命紫微、太陽之訣（女命訣，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議＋第二來源佐證（AI，非人工校勘） 2026-10-04 |
| `CIT_GY_A_ZIWEI_25` | 卷三・論諸星同位垣・紫微 | p50（48） | 女命紫微在寅午申宮吉貴美旺夫益子 | 女命紫微在寅午申之訣（女命訣，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議＋第二來源佐證（AI，非人工校勘） 2026-10-04 |
| `CIT_GY_A_TIANFU_01` | 卷三・論諸星同位垣・天府 | p50（48） | 天府戌宮無殺湊甲巳人腰金又且富 | 天府在戌宮坐命，無煞星湊合，甲、己年生人：富且貴（原文「巳」讀為天干「己」；小注：加四煞有疵）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANFU_02` | 卷三・論諸星同位垣・天府 | p50（48） | 天府天相天梁同君臣慶會 | 天府、天相、天梁同會命宮：君臣慶會。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANFU_03` | 卷三・論諸星同位垣・天府 | p50（48） | 天府居午戌天相來朝甲人一品之貴 | 天府在午戌坐命、天相來朝，甲年生人：貴顯。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANFU_04` | 卷三・論諸星同位垣・天府 | p50（48） | 府相朝垣千鍾食祿 | 天府、天相朝命：食祿豐厚（小注：命寅申、府相在財帛官祿朝者上格）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANFU_05` | 卷三・論諸星同位垣・天府 | p50（48） | 天府祿存昌曲巨萬之資 | 天府坐命，會祿存與文昌、文曲：巨萬之資。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANFU_06` | 卷三・論諸星同位垣・天府 | p50（48） | 天府昌曲左右高第恩榮 | 天府坐命，會文昌、文曲與左輔、右弼：科第恩榮。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANFU_07` | 卷三・論諸星同位垣・天府 | p50（48） | 天府武曲居財宅更兼權祿富奢翁 | 天府、武曲在財帛或田宅，又有化權、化祿：富有（小注：有左右、祿存亦美）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANXIANG_01` | 卷三・論諸星同位垣・天相 | p50（48） | 天相廉貞擎羊夾多招刑杖難逃 | 天相廉貞擎羊夾：古籍斷為刑杖（刑獄斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANXIANG_02` | 卷三・論諸星同位垣・天相 | p50（48） | 天相之星女命纏必當子貴及夫賢 | 女命天相之訣（女命訣，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANXIANG_03` | 卷三・論諸星同位垣・天相 | p50（48） | 右弼天相福來臨女命天相右弼諸宮吉 | 右弼天相（此處小注全為女命之說，只保留原文；同句在 54R 另建規則）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANLIANG_01` | 卷三・論諸星同位垣・天梁 | p50（48） | 天梁月曜女淫貧 | 天梁太陰女命之訣（性別道德斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANLIANG_02` | 卷三・論諸星同位垣・天梁 | p50（48） | 天梁守照吉相逢平生福壽 | 天梁守命或對照，又逢吉星：平生有福（小注：在午位極佳）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANLIANG_03` | 卷三・論諸星同位垣・天梁 | p50（48） | 天梁居午位官資清顯朝堂丁巳癸人合格 | 天梁在午宮坐命，丁、己、癸年生人：官資清顯（原文「巳」讀為天干「己」）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANLIANG_04` | 卷三・論諸星同位垣・天梁 | p50（48） | 梁同機月寅申位一生吏業聰明 | 天同天梁或天機太陰同在寅申坐命：一生宜吏業、聰明。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANLIANG_05` | 卷三・論諸星同位垣・天梁 | p50（48） | 梁同巳亥男多浪湯女多淫 | 梁同巳亥之訣（品格、性別道德斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANLIANG_06` | 卷三・論諸星同位垣・天梁 | p50（48） | 天梁太陽昌祿會臚傳第一名 | 天梁坐命，會太陽、文昌與祿（祿存或化祿）：科名第一。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANLIANG_07` | 卷三・論諸星同位垣・天梁 | p50（48） | 天梁文昌居廟旺位至臺綱 | 天梁廟旺坐命，與文昌同宮：位至高官。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANLIANG_08` | 卷三・論諸星同位垣・天梁 | p50（48） | 梁武陰鈴擬作棟梁之客 | 梁武陰鈴：可作棟梁之客。原文未說明四星的宮位關係，無法落成盤面條件。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANLIANG_09` | 卷三・論諸星同位垣・天梁 | p50（48） | 梁宿太陰却作飄蓬之客梁居酉月居巳是也 | 天梁在酉宮坐命、太陰在巳宮（三方）：一生較飄泊。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANLIANG_10` | 卷三・論諸星同位垣・天梁 | p50（48） | 天梁天馬為人飄湯風流 | 天梁與天馬同坐命宮：為人飄蕩。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANLIANG_11` | 卷三・論諸星同位垣・天梁 | p50（48） | 天梁加吉坐遷移巨商高賈 | 天梁坐遷移宮又加吉星：巨商高賈（小注：加刑忌平常）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANTONG_01` | 卷三・論諸星同位垣・天同 | p50（48） | 天同會吉壽元辰 | 天同會吉之壽元斷語（壽夭斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANTONG_02` | 卷三・論諸星同位垣・天同 | p50（48） | 同月陷宮加殺重技藝羸黃 | 天同、太陰同在陷宮又加煞：宜以技藝謀生。 | pendingVerification | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANTONG_03` | 卷三・論諸星同位垣・天同 | p50（48） | 同貪羊陀居午位丙戊鎮禦邊疆為馬頭帶箭富且貴 | 天同或貪狼在午宮坐命、與擎羊同宮，丙、戊年生人：馬頭帶箭格，富且貴。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANTONG_04` | 卷三・論諸星同位垣・天同 | p50（48） | 天同戌宮化忌丁人命遇反為佳 | 天同在戌宮坐命，丁年生人（對宮巨門化忌）：反為佳。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANTONG_05` | 卷三・論諸星同位垣・天同 | p51（49） | 女命天同必是賢 | 女命天同之訣（女命訣，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANJI_01` | 卷三・論諸星同位垣・天機 | p51（49） | 機梁會合善談兵居戌亦為美論 | 天機、天梁會合於命：善於謀略、談論（在戌亦美）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANJI_02` | 卷三・論諸星同位垣・天機 | p51（49） | 機梁守命加吉曜富貴慈祥 | 天機、天梁同守命宮又加吉星：富貴慈祥。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANJI_03` | 卷三・論諸星同位垣・天機 | p51（49） | 機梁同照命身空偏宜僧道 | 機梁同照逢空：古籍斷為宜僧道（出家斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANJI_04` | 卷三・論諸星同位垣・天機 | p51（49） | 機梁七殺破軍沖羽客僧流命所逢 | 機梁七殺破軍沖：古籍斷為僧道（出家斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANJI_05` | 卷三・論諸星同位垣・天機 | p51（49） | 機月同梁作吏人命在寅申方論 | 命在寅申，天機、太陰、天同、天梁在三方：宜作吏職。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANJI_06` | 卷三・論諸星同位垣・天機 | p51（49） | 機梁貪月同機會暮夜經商無眠睡 | 天機、天梁、貪狼、太陰會命：經商奔波、日夜勞碌。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANJI_07` | 卷三・論諸星同位垣・天機 | p51（49） | 天機加惡殺同宮狗偷鼠竊 | 天機加惡煞：古籍斷為盜竊（品格斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANJI_08` | 卷三・論諸星同位垣・天機 | p51（49） | 天機巳宮酉逢好飲離宗奸狡重 | 天機巳酉之訣（品格斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議＋第二來源佐證（AI，非人工校勘） 2026-10-04 |
| `CIT_GY_A_TIANJI_09` | 卷三・論諸星同位垣・天機 | p51（49） | 巨陷天機為破格 | 巨門落陷又會天機：破格。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TAIYANG_01` | 卷三・論諸星同位垣・太陽 | p51（49） | 日照雷門丞辰卯地晝生富貴聲揚 | 太陽在卯辰宮坐命，白天出生（本 App 取卯至申時）：富貴聲揚。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TAIYANG_02` | 卷三・論諸星同位垣・太陽 | p51（49） | 太陽居午庚辛丁巳人富貴雙全 | 太陽在午宮坐命，庚、辛、丁、己年生人：富貴雙全（原文「巳」讀為天干「己」）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TAIYANG_03` | 卷三・論諸星同位垣・太陽 | p51（49） | 太陽文昌在官祿皇殿朝班文曲同亦然 | 太陽與文昌（或文曲）同在官祿宮：貴顯。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TAIYANG_04` | 卷三・論諸星同位垣・太陽 | p51（49） | 太陽化忌是非日有目還傷 | 太陽坐命化忌：是非較多。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TAIYANG_05` | 卷三・論諸星同位垣・太陽 | p51（49） | 日落未申在命位為人先勤後懶 | 太陽在未申宮坐命：做事先勤後懶。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TAIYANG_06` | 卷三・論諸星同位垣・太陽 | p51（49） | 女命端正太陽星早配賢夫信可憑 | 女命太陽之訣（女命訣，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TAIYIN_01` | 卷三・論諸星同位垣・太陰 | p51（49） | 太陰居子丙丁富貴忠良 | 太陰在子宮坐命，丙、丁年生人：富貴（小注：夜生人合局）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TAIYIN_02` | 卷三・論諸星同位垣・太陰 | p51（49） | 太陰同文曲于妻宮蟾宮折桂 | 太陰與文曲同在夫妻宮：科名有成。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TAIYIN_03` | 卷三・論諸星同位垣・太陰 | p51（49） | 文曲同在身命巧藝之人 | 太陰與文曲同在命宮：巧藝之人（小注；本 App 只取命宮）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TAIYIN_04` | 卷三・論諸星同位垣・太陰 | p51（49） | 太陰武曲祿存同左右相逢富貴翁 | 太陰、武曲、祿存會命，又逢左輔、右弼：富貴。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TAIYIN_05` | 卷三・論諸星同位垣・太陰 | p51（49） | 太陰羊陀必主人離財散 | 太陰坐命會擎羊、陀羅：錢財易散。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TAIYIN_06` | 卷三・論諸星同位垣・太陰 | p51（49） | 月朗天門于亥地登雲職掌大權 | 太陰在亥宮坐命：職掌大權。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TAIYIN_07` | 卷三・論諸星同位垣・太陰 | p51（49） | 月曜天梁女淫貧 | 太陰天梁女命之訣（性別道德斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_RIYUE_01` | 卷三・論諸星同位垣・日月 | p51（49） | 日巳月酉丑宮安命步蟾宮 | 命在丑，太陽在巳、太陰在酉（三方拱照）：科名有成。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_RIYUE_02` | 卷三・論諸星同位垣・日月 | p51（49） | 日卯月亥安命未宮多折桂 | 命在未，太陽在卯、太陰在亥（三方拱照）：多科名。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_RIYUE_03` | 卷三・論諸星同位垣・日月 | p51（49） | 日月同未命安丑侯伯之材 | 太陽、太陰同在未宮，命在丑（對照）：侯伯之材。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_RIYUE_04` | 卷三・論諸星同位垣・日月 | p51（49） | 日月命身居遇未三方無吉反為凶 | 日月在丑未守命，三方無吉星：反為不吉。 | pendingVerification | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_RIYUE_05` | 卷三・論諸星同位垣・日月 | p51（49） | 日月守命不如照合並明 | 日月守命不如日月照合（小注：吉多主吉、凶多主凶）。這是比較原則，沒有獨立的結果詞。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_RIYUE_06` | 卷三・論諸星同位垣・日月 | p51（49） | 日辰月戌並爭耀權祿非淺 | 太陽在辰、太陰在戌（命在辰或戌）：權祿不淺。 | verified | 兩輪獨立目視轉錄＋差異回影像決議＋第二來源佐證（AI，非人工校勘） 2026-10-04 |
| `CIT_GY_A_RIYUE_07` | 卷三・論諸星同位垣・日月 | p51（49） | 日月夾命夾財加吉曜不權則富 | 太陽、太陰夾命宮或夾財帛宮，又加吉星：不貴則富（小注：加羊陀沖守宜僧，不採用）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_RIYUE_08` | 卷三・論諸星同位垣・日月 | p51（49） | 日月最嫌反背 | 日月最怕反背（太陽或太陰落陷守命）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_RIYUE_09` | 卷三・論諸星同位垣・日月 | p51（49） | 陰陽左右合為佳 | 太陽或太陰坐命，會左輔、右弼：為佳。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_RIYUE_10` | 卷三・論諸星同位垣・日月 | p51（49） | 日月羊陀多剋親 | 日月羊陀：古籍斷為剋親（刑剋斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_RIYUE_11` | 卷三・論諸星同位垣・日月 | p51（49） | 日月陷宮逢惡殺勞碌奔波 | 太陽或太陰落陷坐命，又逢煞星：勞碌奔波。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_RIYUE_12` | 卷三・論諸星同位垣・日月 | p51（49） | 日月更須貪殺會男多奸盜女多淫 | 日月會貪殺：古籍斷為奸盜淫（品格、性別道德斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_RIYUE_13` | 卷三・論諸星同位垣・日月 | p51（49） | 日月疾厄命宮空腰陀目瞽 | 日月疾厄之訣（疾病斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_WENCHANG_01` | 卷三・論諸星同位垣・文昌 | p51（49） | 文昌武曲為人多學多能 | 文昌、武曲會命：多學多能（小注：論三方科權祿）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_WENCHANG_02` | 卷三・論諸星同位垣・文昌 | p51（49） | 文科拱照賈誼年少登科論三方 | 文昌、文曲與化科在三方拱照：年少登科。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_WENCHANG_03` | 卷三・論諸星同位垣・文昌 | p51（49） | 左輔文昌位至三台 | 左輔、文昌會命：位至高官（此「三台」指官位，不是三台星）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_WENCHANG_04` | 卷三・論諸星同位垣・文昌 | p51（49） | 文昌武曲于身命文武兼備 | 文昌、武曲同在命宮：文武兼備（本 App 只取命宮）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_WENQU_01` | 卷三・論諸星同位垣・文曲 | p51（49） | 二曲廟垣逢左右將相之材 | 文曲或武曲坐命入廟，又逢左輔、右弼：將相之材。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_WENQU_02` | 卷三・論諸星同位垣・文曲 | p51（49） | 二曲旺宮威名赫奕文曲子宮第一卯酉宮次之武曲辰宮第一丑未宮次之 | 文曲在子、卯、酉或武曲在辰、丑、未坐命：威名顯赫。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_WENQU_03` | 卷三・論諸星同位垣・文曲 | p51（49） | 二曲貪狼午丑限防溺水之憂 | 二曲貪狼限至午丑之訣（意外斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_CHANGQU_01` | 卷三・論諸星同位垣・昌曲 | p51（49） | 昌曲夾命最為奇 | 文昌、文曲夾命：最為奇特（小注：不貴即富）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_CHANGQU_02` | 卷三・論諸星同位垣・昌曲 | p51（49） | 昌曲臨于丑未時逢卯酉近天顏 | 文昌或文曲在丑未坐命，卯、酉時生：近天顏（貴）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_CHANGQU_03` | 卷三・論諸星同位垣・昌曲 | p51（49） | 昌曲巳亥臨不貴即當大富 | 文昌或文曲在巳亥坐命：不貴即富。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_CHANGQU_04` | 卷三・論諸星同位垣・昌曲 | p51（49） | 昌曲吉星居福德謂之玉軸天 | 文昌、文曲與吉星在福德宮：為佳（小注：更得紫微居午宮妙）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_CHANGQU_05` | 卷三・論諸星同位垣・昌曲 | p51（49） | 昌曲陷宮凶殺破虛譽之隆 | 文昌或文曲落陷坐命，又逢擎羊、陀羅、地空、地劫：虛有名聲。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_CHANGQU_06` | 卷三・論諸星同位垣・昌曲 | p51（49） | 昌曲陷于天傷顏回夭折 | 昌曲陷於天傷：古籍斷為夭折（壽夭斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_CHANGQU_07` | 卷三・論諸星同位垣・昌曲 | p51（49） | 昌曲巳辛壬生人限逢辰戌慮投河 | 昌曲限逢辰戌之訣（意外斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_CHANGQU_08` | 卷三・論諸星同位垣・昌曲 | p51（49） | 昌曲廉貞于巳亥遭刑不善且虛誇 | 昌曲廉貞巳亥：古籍斷為遭刑、不善（刑獄、品格斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_CHANGQU_09` | 卷三・論諸星同位垣・昌曲 | p51（49） | 昌曲祿存猶為奇特 | 文昌或文曲坐命，會祿存：尤為奇特。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_CHANGQU_10` | 卷三・論諸星同位垣・昌曲 | p51（49） | 昌曲破軍臨虎兔殺羊沖破奔波 | 文昌或文曲與破軍在寅卯坐命，又逢煞星沖：奔波。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_CHANGQU_11` | 卷三・論諸星同位垣・昌曲 | p52（50） | 昌曲左右會羊陀當生異痣 | 昌曲左右會羊陀：身上有痣（身體斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_CHANGQU_12` | 卷三・論諸星同位垣・昌曲 | p52（50） | 女人昌曲聰明富貴只多淫 | 女命昌曲之訣（性別道德斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_WUQU_01` | 卷三・論諸星同位垣・武曲 | p52（50） | 武曲廟垣威名赫奕 | 武曲在廟垣（小注：辰戌丑未四墓）坐命：威名顯赫。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_WUQU_02` | 卷三・論諸星同位垣・武曲 | p52（50） | 武破相遇昌曲逢聰明巧藝定無窮 | 武曲、破軍同坐命宮，又逢文昌、文曲：聰明巧藝。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_WUQU_03` | 卷三・論諸星同位垣・武曲 | p52（50） | 武曲祿馬交馳發財遠郡 | 武曲坐命，祿（祿存或化祿）與天馬交會：在遠地發財。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_WUQU_04` | 卷三・論諸星同位垣・武曲 | p52（50） | 武曲魁鉞居廟旺財賦之官 | 武曲廟旺坐命，會天魁、天鉞：主管財賦之職。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_WUQU_05` | 卷三・論諸星同位垣・武曲 | p52（50） | 武曲遷移巨商高賈吉多方論 | 武曲在遷移宮，吉星多：巨商高賈。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_WUQU_06` | 卷三・論諸星同位垣・武曲 | p52（50） | 武曲貪狼財宅位橫發資財 | 武曲、貪狼同在財帛或田宅：資財橫發。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_WUQU_07` | 卷三・論諸星同位垣・武曲 | p52（50） | 武曲廉貞貪殺便作經商 | 武曲坐命，會廉貞、貪狼、七殺：宜經商。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_WUQU_08` | 卷三・論諸星同位垣・武曲 | p52（50） | 武曲貪狼加殺忌技藝之人 | 武曲、貪狼同坐命宮，加煞星或化忌：技藝之人。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_WUQU_09` | 卷三・論諸星同位垣・武曲 | p52（50） | 武曲破軍破祖破家勞碌 | 武曲、破軍同坐命宮：家業起伏、勞碌。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_WUQU_10` | 卷三・論諸星同位垣・武曲 | p52（50） | 武曲破貞于卯地木壓雷驚 | 武曲破軍廉貞於卯：古籍意外斷語（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_WUQU_11` | 卷三・論諸星同位垣・武曲 | p52（50） | 武曲劫殺會擎羊因財持刀 | 武曲劫煞會擎羊：古籍斷為因財持刀（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_WUQU_12` | 卷三・論諸星同位垣・武曲 | p52（50） | 武曲羊陀兼火宿喪命因財 | 武曲羊陀火星：古籍斷為因財喪命（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_WUQU_13` | 卷三・論諸星同位垣・武曲 | p52（50） | 武曲之星為寡宿 | 武曲為寡宿（刑剋、性別角色斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TANLANG_01` | 卷三・論諸星同位垣・貪狼 | p52（50） | 貪狼遇鈴火四墓宮豪富家資侯伯貴 | 貪狼在辰戌丑未坐命，遇火星或鈴星：豪富、貴顯（小注：辰戌佳、丑未次之）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TANLANG_02` | 卷三・論諸星同位垣・貪狼 | p52（50） | 貪狼入廟壽元長 | 貪狼入廟之壽元斷語（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TANLANG_03` | 卷三・論諸星同位垣・貪狼 | p52（50） | 貪狼會殺無吉曜屠宰之人 | 貪狼會煞無吉：古籍斷為屠宰（職業貴賤斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TANLANG_04` | 卷三・論諸星同位垣・貪狼 | p52（50） | 貪狼子午卯酉鼠竊狗偷之輩終身不能有為 | 貪狼子午卯酉：古籍盜竊斷語（品格斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TANLANG_05` | 卷三・論諸星同位垣・貪狼 | p52（50） | 貪狼加吉坐長生壽考永如彭祖 | 貪狼加吉坐長生之壽考斷語（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TANLANG_06` | 卷三・論諸星同位垣・貪狼 | p52（50） | 貪狼巳亥加殺不為屠戶亦遭刑 | 貪狼巳亥加煞：屠戶、遭刑斷語（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TANLANG_07` | 卷三・論諸星同位垣・貪狼 | p52（50） | 貪武同行晚景還更神服三十年後發財 | 貪狼、武曲同坐命宮：晚年較好，三十歲後才發財。 | pendingVerification | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TANLANG_08` | 卷三・論諸星同位垣・貪狼 | p52（50） | 貪武先貧而後富 | 貪狼、武曲同坐命宮：先難後富。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TANLANG_09` | 卷三・論諸星同位垣・貪狼 | p52（50） | 貪武申宮為下格化忌方論 | 貪狼或武曲在申宮坐命又化忌：下格。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TANLANG_10` | 卷三・論諸星同位垣・貪狼 | p52（50） | 貪狼加殺同鄉女偷香而男鼠竊 | 貪狼加煞：古籍盜竊、淫佚斷語（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TANLANG_11` | 卷三・論諸星同位垣・貪狼 | p52（50） | 貪武四生四墓宮破軍忌殺百工通 | 貪狼或武曲在四生、四墓宮坐命，會破軍又逢化忌或煞星：百工皆通。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TANLANG_12` | 卷三・論諸星同位垣・貪狼 | p52（50） | 貪狼武曲同守身無吉命反不長 | 貪武守身無吉：古籍壽夭斷語（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TANLANG_13` | 卷三・論諸星同位垣・貪狼 | p52（50） | 貪武破軍無吉曜迷戀酒以忘身 | 貪武破軍無吉：古籍迷酒斷語（品格斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TANLANG_14` | 卷三・論諸星同位垣・貪狼 | p52（50） | 貪月同殺會機梁貪財無厭作經商 | 貪狼、太陰會命又逢煞星，並會天機、天梁：宜經商。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TANLANG_15` | 卷三・論諸星同位垣・貪狼 | p52（50） | 貪狼廉貞同度男多浪蕩女多淫 | 貪狼廉貞同度（品格、性別道德斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TANLANG_16` | 卷三・論諸星同位垣・貪狼 | p52（50） | 貪遇羊陀居亥子名為泛水桃花 | 泛水桃花（品格斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TANLANG_17` | 卷三・論諸星同位垣・貪狼 | p52（50） | 貪狼陀羅在寅宮號曰風流彩杖 | 風流彩杖（品格斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TANLANG_18` | 卷三・論諸星同位垣・貪狼 | p52（50） | 女命貪狼多嫉妒 | 女命貪狼之訣（女命訣，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_LIANZHEN_01` | 卷三・論諸星同位垣・廉貞 | p52（50） | 貞卯酉宮加殺公人藝人 | 廉貞在卯酉宮坐命加煞：公門或技藝之人（本段多疑字）。 | pendingVerification | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_LIANZHEN_02` | 卷三・論諸星同位垣・廉貞 | p52（50） | 廉貞暗巨曹吏貪婪 | 廉貞暗巨：古籍斷為吏而貪婪（品格斷語，只保留原文）。 | pendingVerification | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_LIANZHEN_03` | 卷三・論諸星同位垣・廉貞 | p52（50） | 廉貞貪殺破軍逢武曲遷移作具戎 | 廉貞坐命，會貪狼、七殺、破軍，武曲在遷移（結果詞「作具戎」語意待確認）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議＋第二來源佐證（AI，非人工校勘） 2026-10-04 |
| `CIT_GY_A_LIANZHEN_04` | 卷三・論諸星同位垣・廉貞 | p52（50） | 廉貞七殺居廟旺反為積富之人 | 廉貞、七殺同坐命宮而居廟旺：反為積富之人。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_LIANZHEN_05` | 卷三・論諸星同位垣・廉貞 | p52（50） | 廉貞破火居陷地自縊投河 | 廉貞破軍火星居陷：古籍死亡斷語（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議＋第二來源佐證（AI，非人工校勘） 2026-10-04 |
| `CIT_GY_A_LIANZHEN_06` | 卷三・論諸星同位垣・廉貞 | p52（50） | 廉貞七殺居巳亥流蕩天涯 | 廉貞或七殺在巳亥坐命、兩星會照：流蕩在外。 | verified | 兩輪獨立目視轉錄＋差異回影像決議＋第二來源佐證（AI，非人工校勘） 2026-10-04 |
| `CIT_GY_A_LIANZHEN_07` | 卷三・論諸星同位垣・廉貞 | p52（50） | 仲由威猛廉貞入廟會將軍 | 廉貞入廟會將軍：威猛。「將軍」屬博士十二神，客觀排盤沒有。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_LIANZHEN_08` | 卷三・論諸星同位垣・廉貞 | p52（50） | 廉貞四殺遭刑戮 | 廉貞四煞：刑戮斷語（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_LIANZHEN_09` | 卷三・論諸星同位垣・廉貞 | p52（50） | 廉貞白虎刑杖難逃 | 廉貞白虎：刑杖斷語（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_LIANZHEN_10` | 卷三・論諸星同位垣・廉貞 | p52（50） | 廉貞破殺會遷移死于外道 | 廉貞破殺會遷移：死亡斷語（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_LIANZHEN_11` | 卷三・論諸星同位垣・廉貞 | p52（50） | 廉貞羊殺居官祿枷杻難逃 | 廉貞羊殺居官祿：刑獄斷語（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_LIANZHEN_12` | 卷三・論諸星同位垣・廉貞 | p52（50） | 廉貞清白能相守 | 廉貞清白（小注為女命之說，品格斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_JUMEN_01` | 卷三・論諸星同位垣・巨門 | p52（50） | 巨日寅宮立命申先驅名而食祿 | 巨門、太陽同在寅宮，命在申（對照）：先得名而後食祿。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_JUMEN_02` | 卷三・論諸星同位垣・巨門 | p52（50） | 巨日命宮寅位食祿馳名 | 巨門、太陽同在寅宮坐命：食祿馳名。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_JUMEN_03` | 卷三・論諸星同位垣・巨門 | p52（50） | 巨日申宮立命寅馳名食祿 | 巨門、太陽同在申宮，命在寅（對照）：馳名食祿。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_JUMEN_04` | 卷三・論諸星同位垣・巨門 | p52（50） | 巨門子午科權祿石中隱玉福興隆 | 巨門在子午坐命，三方有化科、化權、化祿：石中隱玉，福祿興隆。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_JUMEN_05` | 卷三・論諸星同位垣・巨門 | p52（50） | 巨日命立申宮亦妙 | 巨門、太陽同在申宮坐命：亦佳。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_JUMEN_06` | 卷三・論諸星同位垣・巨門 | p52（50） | 巨在亥宮日命巳食祿馳名 | 太陽在巳宮坐命、巨門在亥宮對照：食祿馳名。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_JUMEN_07` | 卷三・論諸星同位垣・巨門 | p52（50） | 巨在巳宮日命亥反為不佳 | 太陽在亥宮坐命、巨門在巳宮對照：反為不佳。 | pendingVerification | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_JUMEN_08` | 卷三・論諸星同位垣・巨門 | p52（50） | 巨日拱照亦為奇 | 巨門、太陽在三方拱照（不在命宮），吉星多、太陽不陷：亦為奇（小注）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_JUMEN_09` | 卷三・論諸星同位垣・巨門 | p52（50） | 巨機居卯乙辛巳丙至公卿 | 巨門、天機同在卯宮坐命，乙、辛、己、丙年生人：可至公卿（「巳」為疑字，依天干讀為「己」）。 | pendingVerification | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_JUMEN_10` | 卷三・論諸星同位垣・巨門 | p52（50） | 巨機酉上化吉者縱有財官也不終 | 巨門、天機同在酉宮坐命而化吉：縱有財官也不能持久。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_JUMEN_11` | 卷三・論諸星同位垣・巨門 | p52（50） | 巨門辰宮化忌辛人命遇反為奇 | 巨門在辰宮坐命，辛年生人：反為奇。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_JUMEN_12` | 卷三・論諸星同位垣・巨門 | p52（50） | 巨機丑未為下格 | 巨門或天機在丑未坐命：下格。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_JUMEN_13` | 卷三・論諸星同位垣・巨門 | p53（51） | 巨門陀羅必生異痣 | 巨門陀羅：身上有痣（身體斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_JUMEN_14` | 卷三・論諸星同位垣・巨門 | p53（51） | 巨門羊陀于身命疾厄羸黃困弱盜而娼 | 巨門羊陀：疾病、品格斷語（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_JUMEN_15` | 卷三・論諸星同位垣・巨門 | p53（51） | 巨門四殺陷而凶 | 巨門落陷坐命，會四煞：不吉。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_JUMEN_16` | 卷三・論諸星同位垣・巨門 | p53（51） | 巨火擎羊陀逢惡限防縊死投河 | 巨火羊陀逢惡限：死亡斷語（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_JUMEN_17` | 卷三・論諸星同位垣・巨門 | p53（51） | 巨火鈴星逢惡限死于外道 | 巨火鈴逢惡限：死亡斷語（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_JUMEN_18` | 卷三・論諸星同位垣・巨門 | p53（51） | 巨宿天機為破湯 | 巨門天機為破蕩。與 52L「巨機居卯……至公卿」相衝突，原文未說明何種廟陷或生年為破蕩，無法落成盤面條件（小注為女命之說）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_QISHA_01` | 卷三・論諸星同位垣・七殺 | p53（51） | 七殺寅申子午一生爵祿榮昌 | 七殺在寅申子午坐命：一生爵祿榮昌（七殺朝斗格）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_QISHA_02` | 卷三・論諸星同位垣・七殺 | p53（51） | 七殺破軍專依羊鈴之虛 | 七殺破軍專依羊鈴。句意不明（「虛」字義難定），無法落成盤面條件。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_QISHA_03` | 卷三・論諸星同位垣・七殺 | p53（51） | 七殺廉貞同位路上埋屍 | 七殺廉貞同位：死亡斷語（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_QISHA_04` | 卷三・論諸星同位垣・七殺 | p53（51） | 七殺破軍宜出外諸般手藝不能精 | 七殺或破軍坐命：宜往外發展；技藝方面不易精。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_QISHA_05` | 卷三・論諸星同位垣・七殺 | p53（51） | 殺臨身命流年刑忌災傷 | 七殺臨身命逢流年刑忌：災傷斷語（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_QISHA_06` | 卷三・論諸星同位垣・七殺 | p53（51） | 殺臨絕地會羊陀顏回夭折 | 七殺臨絕地：夭折斷語（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_QISHA_07` | 卷三・論諸星同位垣・七殺 | p53（51） | 七殺重逢四殺腰陀背曲陣中亡 | 七殺重逢四煞：傷殘、死亡斷語（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_QISHA_08` | 卷三・論諸星同位垣・七殺 | p53（51） | 七殺火羊貧且賤屠宰之人 | 七殺火羊：貧賤、屠宰斷語（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_QISHA_09` | 卷三・論諸星同位垣・七殺 | p53（51） | 七殺羊鈴流年白虎刑戮災迍 | 七殺羊鈴流年白虎：刑戮斷語（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_QISHA_10` | 卷三・論諸星同位垣・七殺 | p53（51） | 七殺流羊二官符離鄉遭配 | 七殺流羊官符：刑配斷語（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_QISHA_11` | 卷三・論諸星同位垣・七殺 | p53（51） | 七殺守照歲限擎羊午生人命安卯酉宮主凶亡 | 七殺歲限擎羊：凶亡斷語（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_QISHA_12` | 卷三・論諸星同位垣・七殺 | p53（51） | 七殺沉吟福不榮 | 七殺沉吟，福不榮。「沉吟」沒有盤面定義（小注另有男女之說），無法落成盤面條件。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_QISHA_13` | 卷三・論諸星同位垣・七殺 | p53（51） | 七殺臨身終是夭 | 七殺臨身：夭壽斷語（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_QISHA_14` | 卷三・論諸星同位垣・七殺 | p53（51） | 七殺單居福德女人切忌賤無疑 | 七殺單居福德之女命訣（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_POJUN_01` | 卷三・論諸星同位垣・破軍 | p53（51） | 破軍子午宮無殺官資清顯至三公 | 破軍在子午坐命，無煞星：官資清顯（小注：甲癸生人次之）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_POJUN_02` | 卷三・論諸星同位垣・破軍 | p53（51） | 破軍貪狼逢祿馬男多浪湯女多淫 | 破軍貪狼逢祿馬（品格、性別道德斷語，只保留原文）。 | pendingVerification | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_POJUN_03` | 卷三・論諸星同位垣・破軍 | p53（51） | 破軍暗巨同鄉水中作塚 | 破軍巨門：死亡斷語（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_POJUN_04` | 卷三・論諸星同位垣・破軍 | p53（51） | 破軍火鈴奔波勞碌 | 破軍坐命會火星、鈴星：奔波勞碌。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_POJUN_05` | 卷三・論諸星同位垣・破軍 | p53（51） | 破軍一曜性難明 | 破軍一曜性難明（小注：男女命論）。沒有盤面條件。 | verified | 兩輪獨立目視轉錄＋差異回影像決議＋第二來源佐證（AI，非人工校勘） 2026-10-04 |
| `CIT_GY_A_POJUN_06` | 卷三・論諸星同位垣・破軍 | p53（51） | 破耗羊鈴官祿位到處乞求 | 破軍羊鈴在官祿：貧賤斷語（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_QINGYANG_01` | 卷三・論諸星同位垣・擎羊 | p53（51） | 擎羊入廟富貴聲揚加吉方論 | 擎羊入廟坐命，又加吉星：富貴聲揚。 | pendingVerification | 兩輪獨立目視轉錄＋差異回影像決議＋第二來源佐證（AI，非人工校勘） 2026-10-04 |
| `CIT_GY_A_QINGYANG_02` | 卷三・論諸星同位垣・擎羊 | p53（51） | 羊火同宮威權壓眾 | 擎羊、火星同坐命宮：威權壓眾（小注：辰戌佳、丑未次之）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_QINGYANG_03` | 卷三・論諸星同位垣・擎羊 | p53（51） | 守身命腰駝背曲之人 | （火星）守身命：傷殘斷語（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議＋第二來源佐證（AI，非人工校勘） 2026-10-04 |
| `CIT_GY_A_QINGYANG_04` | 卷三・論諸星同位垣・擎羊 | p53（51） | 擎羊子午卯酉非夭折而刑傷 | 擎羊子午卯酉：夭折刑傷斷語（只保留原文）。 | pendingVerification | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_QINGYANG_05` | 卷三・論諸星同位垣・擎羊 | p53（51） | 擎羊逢力士李廣難封 | 擎羊逢力士：難得封賞。「力士」屬博士十二神，客觀排盤沒有。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_QINGYANG_06` | 卷三・論諸星同位垣・擎羊 | p53（51） | 羊陀火鈴逢吉發財 | 擎羊、陀羅、火星或鈴星坐命，逢吉星：發財（逢凶則忌）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_QINGYANG_07` | 卷三・論諸星同位垣・擎羊 | p53（51） | 羊鈴坐命流年白虎災傷 | 羊鈴坐命逢流年白虎：災傷斷語（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_QINGYANG_08` | 卷三・論諸星同位垣・擎羊 | p53（51） | 擎羊對守在酉宮歲迭羊陀庚命凶 | 擎羊對守酉宮，歲限羊陀迭併：凶。需要流年羊陀，客觀排盤沒有。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_QINGYANG_09` | 卷三・論諸星同位垣・擎羊 | p53（51） | 羊陀夾忌為敗局 | 擎羊、陀羅夾命，命宮又有化忌：敗局（小注另有孤貧刑剋斷語，不採用）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_QINGYANG_10` | 卷三・論諸星同位垣・擎羊 | p53（51） | 羊陀流年鈴破面孛班痕 | 羊陀流年鈴：破相斷語（身體斷語，只保留原文）。 | pendingVerification | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_QINGYANG_11` | 卷三・論諸星同位垣・擎羊 | p53（51） | 擎羊火星為下格 | 擎羊、火星同坐命宮：下格（本段為疑字）。 | pendingVerification | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_QINGYANG_12` | 卷三・論諸星同位垣・擎羊 | p53（51） | 擎羊重逢流羊西施傾隕身 | 擎羊重逢流羊：喪身斷語（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TUOLUO_01` | 卷三・論諸星同位垣・陀羅 | p53（51） | 陀羅巳亥寅申非夭折而刑傷 | 陀羅巳亥寅申：夭折刑傷斷語（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_HUOLING_01` | 卷三・論諸星同位垣・火鈴 | p53（51） | 火鈴相遇名振諸邦 | 火星、鈴星會命：名振四方。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_HUOLING_02` | 卷三・論諸星同位垣・火鈴 | p53（51） | 火鈴夾命為敗局 | 火星、鈴星夾命：敗局。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_HUOLING_03` | 卷三・論諸星同位垣・火鈴 | p53（51） | 火鈴旺宮亦為福論 | 火星或鈴星在廟旺之宮坐命：亦為福。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_HUOLING_04` | 卷三・論諸星同位垣・火鈴 | p53（51） | 擎羊火鈴為下格 | 擎羊與火星或鈴星同坐命宮：下格（小注有疑字，並有夭折斷語）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_KUIYUE_01` | 卷三・論諸星同位垣・魁鉞 | p53（51） | 魁鉞夾命為奇格 | 天魁、天鉞夾命：奇格。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_KUIYUE_02` | 卷三・論諸星同位垣・魁鉞 | p53（51） | 魁鉞命身多折桂 | 天魁或天鉞坐命：多科名（小注：在命身最妙、三方次之；本 App 只取命宮）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_KUIYUE_03` | 卷三・論諸星同位垣・魁鉞 | p53（51） | 魁鉞昌曲祿存扶刑殺無沖台輔貴 | 天魁天鉞、文昌文曲、祿存會命，無天刑與煞星沖：台輔之貴。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_KUIYUE_04` | 卷三・論諸星同位垣・魁鉞 | p53（51） | 魁鉞重逢殺湊痼疾 | 魁鉞逢煞：痼疾斷語（疾病斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_KUIYUE_05` | 卷三・論諸星同位垣・魁鉞 | p53（51） | 魁鉞輔星為福壽 | 天魁或天鉞與左輔、右弼同在命宮：有福。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_ZUOYOU_01` | 卷三・論諸星同位垣・左右 | p53（51） | 左右文昌位至台輔 | 左輔、右弼與文昌會命：位至台輔。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_ZUOYOU_02` | 卷三・論諸星同位垣・左右 | p53（51） | 左右夾命為貴格 | 左輔、右弼夾命：貴格（小注：不貴則大富）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_ZUOYOU_03` | 卷三・論諸星同位垣・左右 | p54（52） | 右弼左輔終身福厚在命宮遷移是也 | 左輔或右弼在命宮或遷移宮：終身福厚（三方次之）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_ZUOYOU_04` | 卷三・論諸星同位垣・左右 | p54（52） | 左右同宮披羅衣紫 | 左輔、右弼同坐命宮：貴顯。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_ZUOYOU_05` | 卷三・論諸星同位垣・左右 | p54（52） | 左右單守照命宮離宗庶出 | 左右單守命宮：出身斷語（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_ZUOYOU_06` | 卷三・論諸星同位垣・左右 | p54（52） | 左右貞羊遭刑盜 | 左右廉貞擎羊：刑盜斷語（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_ZUOYOU_07` | 卷三・論諸星同位垣・左右 | p54（52） | 左右昌曲逢羊陀當生暗痣 | 左右昌曲逢羊陀：身上有痣（身體斷語，只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_ZUOYOU_08` | 卷三・論諸星同位垣・左右 | p54（52） | 左右財官兼夾拱衣祿豐盈 | 左輔、右弼夾財帛或官祿宮，或分在財帛、官祿拱命：衣祿豐盈。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_ZUOYOU_09` | 卷三・論諸星同位垣・左右 | p54（52） | 左右魁鉞為福壽 | 左輔或右弼與天魁或天鉞同在命宮：有福（小注另有女命之說，不採用）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_ZUOYOU_10` | 卷三・論諸星同位垣・左右 | p54（52） | 右弼天相福來臨諸宮遇福 | 右弼與天相同坐命宮：福來臨（小注：諸宮遇福）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_LUCUN_01` | 卷三・論諸星同位垣・祿存 | p54（52） | 祿存一二官中皆入廟 | 祿存在各宮皆入廟（文字疑有脫訛，屬廟旺說明，不作判讀，也不寫入廟旺表）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_LUCUN_02` | 卷三・論諸星同位垣・祿存 | p54（52） | 祿存守于財宅積玉堆金 | 祿存守財帛或田宅：積玉堆金（小注：在命亦可，喜化祿同、科權更妙）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_LUCUN_03` | 卷三・論諸星同位垣・祿存 | p54（52） | 祿存子午位遷移身命逢之利祿宜 | 祿存在子午，位於遷移或命宮：利祿相宜。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_LUCUN_04` | 卷三・論諸星同位垣・祿存 | p54（52） | 明祿暗祿位至公卿 | 明祿暗祿：位至公卿。「暗祿」指六合宮之祿，目前的條件格式沒有六合關係。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_LUCUN_05` | 卷三・論諸星同位垣・祿存 | p54（52） | 雙祿重逢終身富貴 | 祿存與化祿在命宮三方重逢：終身富貴。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_LUCUN_06` | 卷三・論諸星同位垣・祿存 | p54（52） | 祿逢沖破吉也成凶 | 祿存或化祿在命宮，對宮有煞星或化忌沖破：吉也成凶。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_LUCUN_07` | 卷三・論諸星同位垣・祿存 | p54（52） | 雙祿守命呂后耑權 | 祿存與化祿同守命宮：掌權。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_LUCUN_08` | 卷三・論諸星同位垣・祿存 | p54（52） | 祿存厚重多衣祿 | 祿存坐命：衣祿豐厚（小注另有女命之說，不採用）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANMA_01` | 卷三・論諸星同位垣・天馬 | p54（52） | 祿馬最喜交馳 | 祿（祿存或化祿）與天馬在命宮三方交會：最佳（小注：忌見煞、截路空亡）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANMA_02` | 卷三・論諸星同位垣・天馬 | p54（52） | 天馬四生妻宮富貴還當封贈 | 天馬在夫妻宮（四生之地）：伴侶富貴、得封贈。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_TIANMA_03` | 卷三・論諸星同位垣・天馬 | p54（52） | 馬遇空亡終身奔走 | 天馬遇空亡：終身奔走。空亡不在客觀排盤中。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_KEQUANLU_01` | 卷三・論諸星同位垣・科權祿 | p54（52） | 科權祿合富貴雙全 | 化科、化權、化祿在命宮三方會合：富貴雙全。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_KEQUANLU_02` | 卷三・論諸星同位垣・科權祿 | p54（52） | 祿權命逢兼合吉威權壓眾相王朝 | 化祿、化權在命宮又會吉星：威權壓眾。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_KEQUANLU_03` | 卷三・論諸星同位垣・科權祿 | p54（52） | 權祿重逢財官雙美 | 化權、化祿在命宮三方重逢（無煞）：財官雙美（小注：凶聚也不美）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_KEQUANLU_04` | 卷三・論諸星同位垣・科權祿 | p54（52） | 科命權朝登庸甲第 | 化科在命、化權在三方朝命：登科。 | verified | 兩輪獨立目視轉錄＋差異回影像決議＋第二來源佐證（AI，非人工校勘） 2026-10-04 |
| `CIT_GY_A_KEQUANLU_05` | 卷三・論諸星同位垣・科權祿 | p54（52） | 活祿子午位遷移夫子文章冠世 | 命在子午，化祿在遷移（對宮）：文章冠世。 | pendingVerification | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_KEQUANLU_06` | 卷三・論諸星同位垣・科權祿 | p54（52） | 科權祿夾為貴格 | 化科、化權、化祿其中兩種分在兄弟、父母宮夾命：貴格。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_KEQUANLU_07` | 卷三・論諸星同位垣・科權祿 | p54（52） | 權祿重逢殺湊虛譽之隆 | 化權、化祿在命宮三方重逢，但煞星湊合：虛有名聲。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_KEQUANLU_08` | 卷三・論諸星同位垣・科權祿 | p54（52） | 科名陷于凶神苗而不秀 | 化科在命宮，會擎羊、陀羅、地空、地劫：有潛力而不易兌現。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_KEQUANLU_09` | 卷三・論諸星同位垣・科權祿 | p54（52） | 祿主纏于弱地命不主財 | 祿主纏於弱地：命不主財。祿存沒有廟陷表、化祿星的「弱地」原文未定義，無法落成盤面條件。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_KEQUANLU_10` | 卷三・論諸星同位垣・科權祿 | p54（52） | 權祿守財福之地處世榮華 | 化權或化祿守財帛或福德宮：處世榮華。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_KEQUANLU_11` | 卷三・論諸星同位垣・科權祿 | p54（52） | 權祿吉星奴僕位縱然官貴也奔波 | 化權或化祿與吉星在交友（奴僕）宮：縱有官貴也奔波。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_JIEKONG_01` | 卷三・論諸星同位垣・劫空 | p54（52） | 劫空夾命為敗局 | 地劫、地空夾命：敗局（小注另有貧、刑傷斷語，不採用）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_JIEKONG_02` | 卷三・論諸星同位垣・劫空 | p54（52） | 劫空臨限楚王喪國綠珠亡 | 劫空臨限：喪亡斷語（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_JIEKONG_03` | 卷三・論諸星同位垣・劫空 | p54（52） | 生處劫空猶如半天折翅 | 地劫或地空坐命：如半天折翅，成果不易持久。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_JIEKONG_04` | 卷三・論諸星同位垣・劫空 | p54（52） | 劫空臨財福之鄉生來貧賤 | 地劫或地空在財帛或福德宮：財務起伏較大。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_SHANGSHI_01` | 卷三・論諸星同位垣・傷使 | p54（52） | 天傷加惡曜仲尼絕糧鄧通亡 | 天傷加惡曜：困厄、喪亡斷語（只保留原文；天傷亦不在客觀排盤中）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_MINGGONG_01` | 卷三・論諸星同位垣・命宮 | p54（52） | 三夾命凶六夾吉三夾是劫空火鈴羊陀 | 三夾（地劫地空、火星鈴星、擎羊陀羅）夾命：凶。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_MINGGONG_02` | 卷三・論諸星同位垣・命宮 | p54（52） | 六夾是紫府左右昌曲魁鉞科權祿日月 | 六夾（紫府、左右、昌曲、魁鉞、科權祿、日月）夾命：吉。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_MINGGONG_03` | 卷三・論諸星同位垣・命宮 | p54（52） | 命無正曜二姓延生 | 命無正曜：過繼、出身斷語（只保留原文）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_MINGGONG_04` | 卷三・論諸星同位垣・命宮 | p54（52） | 命逢吉曜松柏青秀以難凋 | 命宮有吉星：如松柏常青、不易凋零。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_MINGGONG_05` | 卷三・論諸星同位垣・命宮 | p54（52） | 限逢凶曜柳綠桃紅而易謝 | 大限命宮逢煞星：如桃柳易謝，好景不易持久。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_MINGGONG_06` | 卷三・論諸星同位垣・命宮 | p54（52） | 命莫運生如旱苗而得雨 | 本命平常而大限三方有吉星：如旱苗得雨（小注：命限平常，限行美地為福）。 | pendingVerification | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_MINGGONG_07` | 卷三・論諸星同位垣・命宮 | p54（52） | 命衰運弱如嫩草而遭霜 | 命衰運弱：如嫩草遭霜。「命衰」「運弱」沒有盤面定義（小注另有刑傷死斷語）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_MINGGONG_08` | 卷三・論諸星同位垣・命宮 | p54（52） | 命有吉星官殺重縱有財官也辛苦 | 命宮有吉星，但官祿宮煞星重：縱有財官也辛苦。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_SHENGONG_01` | 卷三・論諸星同位垣・身宮 | p54（52） | 三夾身凶六夾吉 | 三夾身凶、六夾身吉。需要身宮位置，客觀排盤沒有。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_SHENGONG_02` | 卷三・論諸星同位垣・身宮 | p54（52） | 身命俱吉富貴雙全 | 身命俱吉：富貴雙全。需要身宮位置。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_SHENGONG_03` | 卷三・論諸星同位垣・身宮 | p54（52） | 身吉命凶亦為美論 | 身吉命凶亦為美。需要身宮位置。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_SHENGONG_04` | 卷三・論諸星同位垣・身宮 | p54（52） | 命弱身強財源不聚 | 命弱身強：財源不聚。需要身宮位置。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_SHENGONG_05` | 卷三・論諸星同位垣・身宮 | p54（52） | 貪武守身無吉命反不為良 | 貪武守身無吉：反不為良。需要身宮位置。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_NAYIN_01` | 卷三・論諸星同位垣・納音 | p54（52） | 納音墓庫看何宮 | 看納音墓庫在何宮。需要納音五行，客觀排盤沒有。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_NAYIN_02` | 卷三・論諸星同位垣・納音 | p54（52） | 生逢敗地發也虛花 | 生逢敗地：發也虛花。需要納音五行長生十二位。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_NAYIN_03` | 卷三・論諸星同位垣・納音 | p55（53） | 絕處逢生花而不敗 | 絕處逢生：花而不敗。需要納音五行長生十二位。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_CAIBO_01` | 卷三・論諸星同位垣・財帛 | p55（53） | 日月夾財加吉曜不貴則富 | 太陽、太陰夾財帛宮，財帛宮又有吉星：不貴則富。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_CAIBO_02` | 卷三・論諸星同位垣・財帛 | p55（53） | 左右財官兼夾拱衣祿豐隆 | 左輔、右弼夾財帛或官祿，或分在財帛、官祿：衣祿豐隆。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_CAIZHAI_01` | 卷三・論諸星同位垣・財宅 | p55（53） | 紫微輔弼多為賊財之宮 | 紫微與左輔或右弼在財帛宮（結果詞有疑字，待確認）。 | pendingVerification | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_CAIZHAI_02` | 卷三・論諸星同位垣・財宅 | p55（53） | 武曲太陰多居財賦之任 | 武曲或太陰在財帛宮：多任財賦之職（小注：財帛宮遇武曲）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_CAIZHAI_03` | 卷三・論諸星同位垣・財宅 | p55（53） | 紫府武曲居財帛更兼權祿富奢翁 | 天府（或紫微）與武曲在財帛宮，又有化權、化祿：富有。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_CAIZHAI_04` | 卷三・論諸星同位垣・財宅 | p55（53） | 武曲貪狼財宅橫發資財 | 武曲、貪狼同在財帛或田宅：資財橫發（小注：忌空亡）。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_CAIZHAI_05` | 卷三・論諸星同位垣・財宅 | p55（53） | 祿存守于財宅堆金積玉 | 祿存守財帛或田宅：堆金積玉。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_CAIFU_01` | 卷三・論諸星同位垣・財福 | p55（53） | 權祿守財福之位出世榮華 | 化權或化祿守財帛或福德宮：出世榮華。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |
| `CIT_GY_A_CAIFU_02` | 卷三・論諸星同位垣・財福 | p55（53） | 劫空臨財福之鄉生來貧賤 | 地劫或地空在財帛或福德宮：財務起伏較大。 | verified | 兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘） 2026-09-27 |

## 十四主星語義與生活因素候選

| 星 | 核心主題 | 成立條件 | 組合 | 候選生活因素 |
|---|---|---|---|---|
| 紫微 | 化帝座，為官祿主 | 與天府、左右、昌曲、日月、祿馬三合會照為極吉 | 能制七殺、降火星鈴星 | aptitudeResponsibility（啟用） |
| 天機 | 化善星，為兄弟主 | 入廟時身長肥胖（原文以入廟為前提） | 與天梁會合善談兵 | aptitudeStudy（未啟用：原文以入廟為前提；本 App 的廟旺表來自 iztro（軟體資料），尚未與原書「十二宮廟旺落陷圖」核對，暫不啟用） |
| 太陽 | 化貴，為官祿主 | 夜生為陷、日生為廟旺；入廟時形貌堂堂 | — | aptitudeResponsibility（啟用） |
| 武曲 | 化財，為財帛主 | — | — | aptitudeResources（啟用）；decisionClarity（未啟用：屬每日狀態因素，不適合由本命長期特質直接產生） |
| 天同 | 化福，為福德主 | 以上描述以入廟為前提 | — | — |
| 廉貞 | 化次桃花，為殺星、囚星，為官祿主 | — | — | aptitudeResponsibility（啟用） |
| 天府 | 化令星，為財帛主 | — | — | aptitudeResources（啟用） |
| 太陰 | 化富，為母宿、妻星，為田宅主 | — | — | aptitudeResources（啟用） |
| 貪狼 | 化桃花殺 | 入廟長聳肥胖；陷宮形小、聲高而量大（後段描述可能只指陷宮） | — | impulsivityRisk（未啟用：原文此段接在「陷宮」之後，是否只指落陷尚未確認；也不宜把本命特質直接當成每日風險） |
| 巨門 | 化暗，主是非 | 入廟身長肥胖、敦厚清秀；不入廟五短瘦小（後段描述可能只指不入廟） | — | communicationMisunderstandingRisk（未啟用：原文後段接在「不入廟」之後，範圍待確認；且需看三方會照，暫不啟用）；decisionUncertainty（未啟用：原文後段接在「不入廟」之後，範圍待確認；也不宜把本命特質直接當成每日判斷風險） |
| 天相 | 化印，為官祿主 | — | — | aptitudeResponsibility（啟用） |
| 天梁 | 化蔭，主壽星 | — | — | — |
| 七殺 | 將星 | 遇帝（紫微）為權，其餘宮位皆以殺論 | 遇紫微化為權 | impulsivityRisk（未啟用：本命特質不宜直接當成每日風險；是否遇紫微會改變性質，需先實作組合條件） |
| 破軍 | 化耗星，主妻子奴僕 | — | — | cooperationFriction（未啟用：本命特質不宜直接當成每日合作風險，需搭配運限與會照星） |

## 十二宮語義（現代用途為 App 依宮名整理）

| 宮（原書名） | 現代用途 | 相關主題 | 對宮 | 三合宮 | 古典篇旨 |
|---|---|---|---|---|---|
| 命宮 | 本人的整體狀態與基本傾向 | general、decision | 遷移 | 財帛、官祿 | 卷二十二宮首篇；各星坐命的總論與入命吉凶訣都列在此篇之下 |
| 兄弟 | 兄弟姊妹、同輩與平輩往來 | social、cooperation | 交友 | 疾厄、田宅 | 逐星論兄弟的有無、人數與可否倚靠 |
| 夫妻（妻妾） | 伴侶與婚姻關係 | relationship、marriage | 官祿 | 遷移、福德 | 逐星論婚配的早晚、能否偕老與對方性情 |
| 子女 | 子女與晚輩 | general | 田宅 | 交友、父母 | 論子女時先看子女宮本宮的星宿 |
| 財帛 | 金錢的收入與支出 | wealth、investment | 福德 | 官祿、命宮 | 逐星論錢財是否豐足，並說明會照煞星時轉為不旺 |
| 疾厄 | 身體狀況（只作生活作息提醒） | health | 父母 | 田宅、兄弟 | 先看命宮星曜的廟陷與煞忌守照，再看疾厄宮本身 |
| 遷移 | 外出、移動與在外的環境 | travel、jobChange | 命宮 | 福德、夫妻 | 逐星論出外是否有人扶持、出入是否通達 |
| 交友（奴僕） | 朋友、同事與往來對象 | social、cooperation | 兄弟 | 父母、子女 | 逐星論部屬與往來對象是否得力 |
| 官祿 | 工作、職務與事業 | career、promotion、jobSearch、jobChange | 夫妻 | 命宮、財帛 | 逐星論職位與功名，並看會照的輔星 |
| 田宅 | 住所、不動產與家庭環境 | property | 子女 | 兄弟、疾厄 | 逐星論田產能否自置與守成 |
| 福德 | 精神生活、興趣與內在感受 | health、general | 財帛 | 夫妻、遷移 | 逐星論享福安樂與否 |
| 父母 | 父母、長輩與上級 | general、promotion | 疾厄 | 子女、交友 | 待校驗 |

## 格局規則：53 條；候選 47 條

| 格局 | 類別 | 必要星曜 | 破格條件數 | 生活因素 | 啟用 |
|---|---|---|---|---|---|
| 太陽會文昌於官祿（`GY_PAT_TAIYANG_WENCHANG_GUANLU`） | 論格 | 太陽、文昌 | 0 | aptitudeResponsibility | 是 |
| 祿存守於田財（`GY_PAT_LUCUN_TIANCAI`） | 論格 | 祿存 | 0 | aptitudeResources | 是 |
| 財蔭坐于遷移（`GY_PAT_CAIYIN_QIANYI`） | 論格 | 武曲、天梁 | 0 | aptitudeResources | 是 |
| 對面朝斗格（`GY_PAT_DUIMIAN_CHAODOU`） | 論格 | 祿存 | 0 | aptitudeResources | 是 |
| 科權祿主格（`GY_PAT_KEQUANLU`） | 論格 | — | 0 | aptitudeResponsibility | 是 |
| 左右朝垣格（`GY_PAT_ZUOYOU_CHAOYUAN`） | 論格 | 左輔、右弼、祿存 | 0 | aptitudeResponsibility | 是 |
| 兼文武格（`GY_PAT_JIANWENWU`） | 論格 | 文曲、武曲 | 1 | aptitudeResponsibility、aptitudeStudy | 是 |
| 文星朝命格（`GY_PAT_WENXING_CHAOMING`） | 論格 | 文昌、文曲 | 0 | aptitudeResources、aptitudeResponsibility | 是 |
| 石中隱玉格（`GY_PAT_SHIZHONG_YINYU`） | 論格 | 巨門 | 0 | aptitudeResponsibility | 是 |
| 火貪格（`GY_PAT_HUOTAN`） | 論格 | 貪狼、火星 | 1 | aptitudeResponsibility | 是 |
| 商賈之命（安分）（`GY_PAT_SHANGGU_AN`） | 論格 | 巨門、太陽、紫微、天府 | 0 | executionClarity | 是 |
| 商賈之命（`GY_PAT_SHANGGU`） | 論格 | 太陰、貪狼、擎羊、陀羅、火星、鈴星、地空、地劫 | 0 | aptitudeResources | 是 |
| 術藝之命（`GY_PAT_SHUYI`） | 論格 | 貪狼、武曲、擎羊、陀羅、火星、鈴星、地空、地劫 | 0 | aptitudeStudy | 是 |
| 定人聰明（`GY_PAT_DING_CONGMING`） | 論格 | 文曲、天相、破軍、文昌 | 0 | aptitudeStudy | 是 |
| 定人富足（`GY_PAT_DING_FUZU`） | 論格 | 太陰 | 1 | aptitudeResources | 是 |
| 定人貧賤（`GY_PAT_DING_PINJIAN`） | 論格 | 火星、擎羊、陀羅、武曲、廉貞、巨門、破軍 | 1 | executionResistance | 是 |
| 武職論（`GY_PAT_WUZHI`） | 論格 | 武曲、七殺、天魁、天鉞 | 0 | aptitudeResponsibility | 是 |
| 富貴論（`GY_PAT_FUGUI_LUN`） | 論格 | 紫微、天府、天相、太陽、太陰、左輔、右弼、文昌、文曲、天魁、天鉞 | 0 | aptitudeResources、aptitudeResponsibility | 是 |
| 貧賤論（`GY_PAT_PINJIAN_LUN`） | 論格 | 擎羊、陀羅、地空、地劫 | 1 | executionResistance | 是 |
| 丑宮得地合格（`GY_PAT_HEGE_CHOU`） | 合格訣 | 太陽、太陰 | 0 | aptitudeResources | 是 |
| 寅宮得地合格（`GY_PAT_HEGE_YIN`） | 合格訣 | 巨門、太陽 | 0 | aptitudeResources | 是 |
| 卯宮得地合格（`GY_PAT_HEGE_MAO`） | 合格訣 | 天機、巨門、武曲 | 0 | aptitudeResources、aptitudeResponsibility | 是 |
| 巳宮得地合格（`GY_PAT_HEGE_SI`） | 合格訣 | 天機、天相、紫微、天府 | 0 | aptitudeResponsibility | 是 |
| 未宮得地合格（`GY_PAT_HEGE_WEI`） | 合格訣 | 紫微、武曲、廉貞、太陽、太陰、巨門 | 0 | aptitudeResponsibility | 是 |
| 申宮得地合格（`GY_PAT_HEGE_SHEN`） | 合格訣 | 紫微、廉貞、天梁、武曲、巨門 | 0 | aptitudeResources、aptitudeResponsibility | 是 |
| 酉宮得地合格（`GY_PAT_HEGE_YOU`） | 合格訣 | 太陰 | 0 | aptitudeResponsibility | 是 |
| 戌宮得地合格（`GY_PAT_HEGE_XU`） | 合格訣 | 紫微 | 0 | aptitudeResources | 是 |
| 亥宮得地合格（`GY_PAT_HEGE_HAI`） | 合格訣 | 太陰 | 0 | aptitudeResources | 是 |
| 午宮失陷破格（`GY_PAT_POGE_WU`） | 合格訣 | 貪狼、巨門、太陰、文昌、擎羊 | 0 | financialVolatility | 是 |
| 子丑失陷破格（`GY_PAT_POGE_CHOUZI`） | 合格訣 | 天機、巨門 | 0 | executionResistance | 是 |
| 財蔭夾印（`GY_PAT_FU_CAIYINJIAYIN`） | 定富局 | 天相、武曲、天梁 | 0 | aptitudeResources | 是 |
| 日月夾財（`GY_PAT_FU_RIYUEJIACAI`） | 定富局 | 武曲、太陽、太陰 | 0 | aptitudeResources | 是 |
| 財祿夾馬（`GY_PAT_FU_CAILUJIAMA`） | 定富局 | 天馬、武曲、祿存 | 0 | aptitudeResources | 是 |
| 日月照壁（`GY_PAT_FU_RIYUEZHAOBI`） | 定富局 | 太陽、太陰 | 0 | aptitudeResources | 是 |
| 金燦光輝（`GY_PAT_FU_JINCAN`） | 定富局 | 太陽 | 0 | aptitudeResources、aptitudeResponsibility | 是 |
| 日月夾命（`GY_PAT_GUI_RIYUEJIAMING`） | 定貴局 | 太陽、太陰、左輔、右弼、文昌、文曲、天魁、天鉞 | 0 | aptitudeResponsibility | 是 |
| 日出扶桑（`GY_PAT_GUI_RICHU`） | 定貴局 | 太陽 | 0 | aptitudeResponsibility | 是 |
| 月落亥宮（`GY_PAT_GUI_YUELUO`） | 定貴局 | 太陰 | 0 | aptitudeResponsibility | 是 |
| 月生滄海（`GY_PAT_GUI_YUESHENG`） | 定貴局 | 太陰 | 0 | aptitudeResponsibility、aptitudeResources | 是 |
| 輔弼拱主（`GY_PAT_GUI_FUBIGONGZHU`） | 定貴局 | 紫微、左輔、右弼 | 0 | aptitudeResponsibility | 是 |
| 君臣慶會（`GY_PAT_GUI_JUNCHEN`） | 定貴局 | 紫微、左輔、右弼 | 0 | aptitudeResponsibility | 是 |
| 財印夾祿（`GY_PAT_GUI_CAIYINJIALU`） | 定貴局 | 祿存、天梁、天相 | 0 | aptitudeResponsibility、aptitudeResources | 是 |
| 馬頭帶劍（`GY_PAT_GUI_MATOU`） | 定貴局 | 天馬、擎羊 | 0 | aptitudeResponsibility | 是 |
| 刑囚夾印（`GY_PAT_GUI_XINGQIU`） | 定貴局 | 天刑、廉貞 | 0 | aptitudeResponsibility | 是 |
| 貪火相逢（`GY_PAT_GUI_TANHUO`） | 定貴局 | 貪狼、火星 | 0 | aptitudeResponsibility | 是 |
| 武曲守垣（`GY_PAT_GUI_WUQUSHOUYUAN`） | 定貴局 | 武曲 | 0 | aptitudeResponsibility | 是 |
| 權祿生逢（`GY_PAT_GUI_QUANLU`） | 定貴局 | — | 0 | aptitudeResponsibility | 是 |
| 擎羊入廟（`GY_PAT_GUI_QINGYANG`） | 定貴局 | 擎羊、左輔、右弼、文昌、文曲、天魁、天鉞 | 0 | aptitudeResponsibility | 是 |
| 金輿扶駕（`GY_PAT_GUI_JINYU`） | 定貴局 | 紫微、太陽、太陰 | 0 | aptitudeResponsibility | 是 |
| 日月藏輝（`GY_PAT_PIN_RIYUECANGHUI`） | 定貧賤局 | 太陽、太陰、巨門 | 0 | executionResistance | 是 |
| 一生孤貧（`GY_PAT_PIN_YISHENGGUPIN`） | 定貧賤局 | 破軍 | 0 | executionResistance | 是 |
| 兩重華蓋（`GY_PAT_PIN_LIANGZHONGHUAGAI`） | 定貧賤局 | 祿存、地空、地劫 | 0 | instability | 是 |
| 風雲際會（`GY_PAT_ZA_FENGYUN`） | 定雜局 | 天馬、祿存 | 0 | resourceIncrease、progressOpportunity | 是 |

| 候選 | 類別 | 原因 | 說明 |
|---|---|---|---|
| 僧道之命 | 論格 | historicalOnly | 僧道之命：出家斷語，只保留原文。 |
| 孤剋之命 | 論格 | historicalOnly | 孤剋之命：孤剋斷語，只保留原文。 |
| 殺居絕地 | 論格 | historicalOnly | 殺居絕地：夭壽斷語，只保留原文。 |
| 耗居祿位 | 論格 | historicalOnly | 耗居祿位：貧賤斷語，只保留原文。 |
| 會貪旺宮 | 論格 | historicalOnly | 會貪旺宮：品格斷語，只保留原文。 |
| 忌暗同居 | 論格 | historicalOnly | 忌暗同居：疾病斷語，只保留原文。 |
| 刑殺會廉貞於官祿 | 論格 | historicalOnly | 刑殺會廉貞於官祿：刑獄斷語，只保留原文。 |
| 官府夾刑殺 | 論格 | historicalOnly | 官府夾刑殺：刑獄斷語，只保留原文。 |
| 定人作盜賊 | 論格 | historicalOnly | 定人作盜賊：品格斷語，只保留原文。 |
| 壽夭淫蕩 | 論格 | historicalOnly | 壽夭淫蕩：壽夭與品格斷語，只保留原文。 |
| 定人殘疾 | 論格 | historicalOnly | 定人殘疾：疾病斷語，只保留原文。 |
| 定人破相 | 論格 | historicalOnly | 定人破相：身體斷語，只保留原文。 |
| 刑名論 | 論格 | insufficientConditions | 刑名論：主星、煞星與「上吉湊合」的組合條件不明確，另有兩輪轉錄與補轉錄讀法不一。 |
| 疾夭論 | 論格 | historicalOnly | 疾夭論：疾病夭壽斷語，只保留原文。 |
| 僧道論 | 論格 | historicalOnly | 僧道論：出家斷語，只保留原文。 |
| 聰明論 | 論格 | requiresChartExtension | 聰明論：條件含三台、八座，本 App 客觀排盤沒有這兩顆星。 |
| 子宮得地合格 | 合格訣 | insufficientConditions | 子宮得地合格：「貪狼殺陰星機梁相拱」所列星曜不可能同時在子宮三方成立，條件需另行考證。 |
| 午宮得地合格 | 合格訣 | unclearGlyph | 午宮得地合格：後半句（生年與結果）有疑字。 |
| 辰宮得地合格 | 合格訣 | unclearGlyph | 辰宮得地合格：「天府□地」有疑字。 |
| 其他失陷破格 | 合格訣 | historicalOnly | 其他失陷破格：寅、卯辰、巳、未、申酉、戌、亥各訣主要為貧賤、夭折、奴僕娼婢等斷語，只保留原文。 |
| 十二宮諸星得地富貴論 | 合格訣 | insufficientConditions | 十二宮諸星得地富貴論：歌訣逐宮列舉星名，未分條給出完整條件（與各星「X宮Y地」條目重複者已在卷二處理）。 |
| 陰印拱身 | 定富局 | unclearGlyph | 陰印拱身：格名首字有疑字，且條件涉及身宮落田宅，暫列候選。 |
| 祿馬佩印 | 定貴局 | insufficientConditions | 祿馬佩印：「馬前」「印星」所指位置不明確。 |
| 坐貴向貴 | 定貴局 | unclearGlyph | 坐貴向貴：註文有疑字。 |
| 七殺朝斗 | 定貴局 | insufficientConditions | 七殺朝斗：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 |
| 日月並明 | 定貴局 | insufficientConditions | 日月並明：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 |
| 明珠出海 | 定貴局 | insufficientConditions | 明珠出海：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 |
| 日月同臨 | 定貴局 | insufficientConditions | 日月同臨：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 |
| 科權祿拱 | 定貴局 | insufficientConditions | 科權祿拱：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 |
| 府相朝垣 | 定貴局 | insufficientConditions | 府相朝垣：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 |
| 紫府朝垣 | 定貴局 | insufficientConditions | 紫府朝垣：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 |
| 文星暗拱 | 定貴局 | insufficientConditions | 文星暗拱：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 |
| 巨機居卯 | 定貴局 | insufficientConditions | 巨機居卯：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 |
| 明祿暗祿 | 定貴局 | insufficientConditions | 明祿暗祿：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 |
| 科明祿暗 | 定貴局 | insufficientConditions | 科明祿暗：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 |
| 生不逢時 | 定貧賤局 | unclearGlyph | 生不逢時：註文有疑字，且條件含空亡（本 App 未排）。 |
| 祿逢兩殺 | 定貧賤局 | requiresChartExtension | 祿逢兩殺：條件含空亡（旬空／截空），本 App 客觀排盤沒有。 |
| 馬落空亡 | 定貧賤局 | requiresChartExtension | 馬落空亡：條件含空亡，本 App 客觀排盤沒有。 |
| 財與囚仇 | 定貧賤局 | unclearGlyph | 財與囚仇：註文有疑字。 |
| 君子在野 | 定貧賤局 | unclearGlyph | 君子在野：註文有疑字與缺字。 |
| 錦上添花 | 定雜局 | insufficientConditions | 錦上添花：「限破惡星而行吉地」未指明星曜與宮位。 |
| 祿衰馬困 | 定雜局 | requiresChartExtension | 祿衰馬困：條件含空亡。 |
| 衣錦還鄉 | 定雜局 | insufficientConditions | 衣錦還鄉：「墓運」所指不明確。 |
| 少歲無衣 | 定雜局 | unclearGlyph | 少歲無衣：格名有疑字。 |
| 水上駕星 | 定雜局 | insufficientConditions | 水上駕星：只描述結果，沒有盤面條件。 |
| 吉凶相伴 | 定雜局 | insufficientConditions | 吉凶相伴：「限前」「限衰」未指明條件。 |
| 枯木逢春 | 定雜局 | insufficientConditions | 枯木逢春：「命衰限好」沒有具體星曜條件。 |

## 古典廟旺與軟體亮度差異（BrightnessConflict）

| 星 | 地支 | 《全書》 | iztro | 古典出處 |
|---|---|---|---|---|
| 太陽 | 丑 | 陷 | 不 | 《全書》廣益版 PDF p27「丑宮陷未宮得地」 |
| 太陽 | 戌 | 陷 | 不 | 《全書》廣益版 PDF p27「辰宮旺財官格戌宮陷」 |
| 廉貞 | 寅 | 平 | 廟 | 《全書》廣益版 PDF p28「寅宮和平」 |
| 天府 | 子 | 旺 | 廟 | 《全書》廣益版 PDF p29「子午宮旺」 |
| 天府 | 卯 | 廟 | 得 | 《全書》廣益版 PDF p29「卯酉入廟酉宮旺地」 |
| 太陰 | 寅 | 廟 | 旺 | 《全書》廣益版 PDF p29「子丑寅宮入廟」 |
| 太陰 | 午 | 陷 | 不 | 《全書》廣益版 PDF p29「午宮陷未申宮利益」 |
| 太陰 | 未 | 利 | 不 | 《全書》廣益版 PDF p29「午宮陷未申宮利益」 |
| 太陰 | 酉 | 廟 | 旺 | 《全書》廣益版 PDF p29「酉戌亥宮入廟」 |
| 太陰 | 戌 | 廟 | 旺 | 《全書》廣益版 PDF p29「酉戌亥宮入廟」 |
| 巨門 | 辰 | 平 | 陷 | 《全書》廣益版 PDF p30「辰戌宮和平」 |
| 巨門 | 戌 | 平 | 陷 | 《全書》廣益版 PDF p30「辰戌宮和平」 |
| 天梁 | 丑 | 廟 | 旺 | 《全書》廣益版 PDF p31「丑未宮入廟」 |
| 天梁 | 未 | 廟 | 旺 | 《全書》廣益版 PDF p31「丑未宮入廟」 |
| 紫微 | 寅 | 廟 | 旺 | 《全書》廣益版 PDF p50「紫微廟寅午丑未旺申亥卯巳平子」 |
| 天府 | 辰 | 旺 | 廟 | 《全書》廣益版 PDF p50「天府廟子丑寅未旺午酉辰戌地卯巳申亥」 |
| 天府 | 戌 | 旺 | 廟 | 《全書》廣益版 PDF p50「天府廟子丑寅未旺午酉辰戌地卯巳申亥」 |
| 天梁 | 戌 | 得 | 廟 | 《全書》廣益版 PDF p50「天梁廟子寅辰午旺丑未地戌卯陷申巳亥」 |
| 天梁 | 卯 | 得 | 廟 | 《全書》廣益版 PDF p50「天梁廟子寅辰午旺丑未地戌卯陷申巳亥」 |
| 天同 | 卯 | 廟 | 平 | 《全書》廣益版 PDF p50「天同廟卯巳亥旺子申陷丑未酉午」 |
| 天同 | 丑 | 陷 | 不 | 《全書》廣益版 PDF p50「天同廟卯巳亥旺子申陷丑未酉午」 |
| 天同 | 未 | 陷 | 不 | 《全書》廣益版 PDF p50「天同廟卯巳亥旺子申陷丑未酉午」 |
| 天同 | 酉 | 陷 | 平 | 《全書》廣益版 PDF p50「天同廟卯巳亥旺子申陷丑未酉午」 |
| 天機 | 辰 | 廟 | 利 | 《全書》廣益版 PDF p51「天機廟子午辰戌旺卯酉陷丑未」 |
| 天機 | 戌 | 廟 | 利 | 《全書》廣益版 PDF p51「天機廟子午辰戌旺卯酉陷丑未」 |
| 太陽 | 午 | 廟 | 旺 | 《全書》廣益版 PDF p51「太陽廟卯午旺寅辰巳陷戌亥子丑」 |
| 太陽 | 戌 | 陷 | 不 | 《全書》廣益版 PDF p51「太陽廟卯午旺寅辰巳陷戌亥子丑」 |
| 太陽 | 丑 | 陷 | 不 | 《全書》廣益版 PDF p51「太陽廟卯午旺寅辰巳陷戌亥子丑」 |
| 太陰 | 午 | 陷 | 不 | 《全書》廣益版 PDF p51「太陰廟亥子丑旺酉戌陷午寅辰巳卯」 |
| 太陰 | 寅 | 陷 | 旺 | 《全書》廣益版 PDF p51「太陰廟亥子丑旺酉戌陷午寅辰巳卯」 |
| 文曲 | 子 | 廟 | 得 | 《全書》廣益版 PDF p51「文曲廟子辰巳酉丑旺亥卯未陷午戌」 |
| 文曲 | 辰 | 廟 | 得 | 《全書》廣益版 PDF p51「文曲廟子辰巳酉丑旺亥卯未陷午戌」 |
| 巨門 | 丑 | 旺 | 不 | 《全書》廣益版 PDF p52「巨門廟卯寅申酉旺子丑午亥平辰巳未戌」 |
| 巨門 | 辰 | 平 | 陷 | 《全書》廣益版 PDF p52「巨門廟卯寅申酉旺子丑午亥平辰巳未戌」 |
| 巨門 | 巳 | 平 | 旺 | 《全書》廣益版 PDF p52「巨門廟卯寅申酉旺子丑午亥平辰巳未戌」 |
| 巨門 | 未 | 平 | 不 | 《全書》廣益版 PDF p52「巨門廟卯寅申酉旺子丑午亥平辰巳未戌」 |
| 巨門 | 戌 | 平 | 陷 | 《全書》廣益版 PDF p52「巨門廟卯寅申酉旺子丑午亥平辰巳未戌」 |
| 破軍 | 寅 | 陷 | 得 | 《全書》廣益版 PDF p53「破軍廟子午旺辰戌丑未陷寅申」 |
| 破軍 | 申 | 陷 | 得 | 《全書》廣益版 PDF p53「破軍廟子午旺辰戌丑未陷寅申」 |
| 陀羅 | 亥 | 得 | 陷 | 《全書》廣益版 PDF p53「陀羅廟辰戌丑未陷卯酉地子亥」 |
| 鈴星 | 卯 | 廟 | 利 | 《全書》廣益版 PDF p53「鈴星廟寅卯午戌地辰巳未申」 |
| 鈴星 | 辰 | 得 | 陷 | 《全書》廣益版 PDF p53「鈴星廟寅卯午戌地辰巳未申」 |
| 鈴星 | 未 | 得 | 利 | 《全書》廣益版 PDF p53「鈴星廟寅卯午戌地辰巳未申」 |
| 鈴星 | 申 | 得 | 陷 | 《全書》廣益版 PDF p53「鈴星廟寅卯午戌地辰巳未申」 |

## 舊版單次轉錄 35 段的第二次核讀

| 段落 | 頁 | 結果 | 說明 |
|---|---|---|---|
| GY-P26-ZIWEI | p26 | identical | 兩次轉錄逐字相同。 |
| GY-P26-TIANJI | p26 | identical | 兩次轉錄逐字相同。 |
| GY-P27-TAIYANG | p27 | identical | 兩次轉錄逐字相同。 |
| GY-P27-WUQU | p27 | identical | 兩次轉錄逐字相同。 |
| GY-P27-TIANTONG | p27 | identical | 兩次轉錄逐字相同。 |
| GY-P28-LIANZHEN | p28 | identical | 兩次轉錄逐字相同。 |
| GY-P28-TIANFU | p28 | identical | 兩次轉錄逐字相同。 |
| GY-P29-TAIYIN | p29 | identical | 兩次轉錄逐字相同。 |
| GY-P29-TANLANG | p29 | identical | 兩次轉錄逐字相同。 |
| GY-P30-JUMEN | p30 | identical | 兩次轉錄逐字相同。 |
| GY-P30-TIANXIANG | p30 | identical | 兩次轉錄逐字相同。 |
| GY-P31-TIANLIANG | p31 | identical | 兩次轉錄逐字相同。 |
| GY-P31-QISHA | p31 | identical | 兩次轉錄逐字相同。 |
| GY-P31-POJUN | p31 | identical | 兩次轉錄逐字相同。 |
| GY-P26-MING-HEAD | p26 | identical | 頁面欄組未收此章首；與來源包 v4 structureMarker GY-P26-STRUCT-LIFE-PALACE（另一次獨立目視複核）逐字相同。 |
| GY-P37-XIONGDI | p37 | identical | 兩次轉錄逐字相同。 |
| GY-P37-QIQIE | p37 | identical | 兩次轉錄逐字相同。 |
| GY-P38-ZINV | p38 | identical | 兩次轉錄逐字相同。 |
| GY-P39-CAIBO | p39 | identical | 兩次轉錄逐字相同。 |
| GY-P40-JIE | p40 | identical | 兩次轉錄逐字相同。 |
| GY-P40-QIANYI | p40 | identical | 兩次轉錄逐字相同。 |
| GY-P41-NUPU | p41 | identical | 兩次轉錄逐字相同。 |
| GY-P42-GUANLU | p42 | identical | 兩次轉錄逐字相同。 |
| GY-P43-TIANZHAI | p43 | identical | 兩次轉錄逐字相同。 |
| GY-P43-FUDE | p43 | identical | 兩次轉錄逐字相同。 |
| GY-P44-FUMU-HEAD | p44 | identical | 兩次轉錄逐字相同。 |
| GY-P46-DAXIAN-HEAD | p46 | identical | 兩次轉錄逐字相同。 |
| GY-P46-ERXIAN-A | p46 | identical | 兩次轉錄逐字相同。 |
| GY-P46-ERXIAN-B | p46 | identical | 兩次轉錄逐字相同。 |
| GY-P45-RUGE | p45 | identical | 兩次轉錄逐字相同。 |
| GY-P45-GEXING | p45 | identical | 兩次轉錄逐字相同。 |
| GY-P46-DAXIAN | p46 | identical | 兩次轉錄逐字相同。 |
| GY-P46-DAXIAN | p46 | identical | 兩次轉錄逐字相同。 |
| GY-P47-NANBEI | p47 | identical | 兩次轉錄逐字相同。 |
| GY-P47-TAISUI | p47 | identical | 兩次轉錄逐字相同。 |

## 來源修正紀錄

- SC-001：來源包 v3 導航（廣益版_完整交接導航.md）「廣益版未見獨立「一命宮」章首，命宮應標 locatorPending。」→「PDF p26（版心24）右頁右上印有「一命宮」，命宮章首存在。」（PDF p26；PDF 影像（本專案高倍率複核，2026-09-27）、來源包 v4 index/來源差異與修正.md）
- SC-002：來源包 v3 導航「PDF p36（版心34）末為「卷之一終」。」→「PDF p36 末為「卷之二終」；p26–p36 為卷二「一命宮」主章。」（PDF p36；PDF 影像、來源包 v4）
- SC-003：來源包 v3 導航「十二宮（兄弟以下）在卷二。」→「PDF p37（版心35）為「紫微斗數全書卷之三」卷首，接「二兄弟」；同葉左半為「三妻妾」。」（PDF p37；PDF 影像、來源包 v4）
- SC-004：來源包 v3／v4 十四主星人工初稿「十四主星的起首段落位於〈諸星問答論〉。」→「本 App 引用的十四主星起首是卷二「一命宮」之下各星總論（PDF p26–p31）；〈諸星問答論〉在卷一（PDF p5–p9），是另一篇。」（PDF p26；PDF 影像）
- SC-005：來源包 v4 data/confirmed_citations_v4.json（GY-P45-PRINCIPLE-ENTRY-PATTERN）「如命入格廟旺與吉科權祿守上上之命不入廟加吉化吉科權祿次之命……命入廟不加吉平常若居陷地……」→「如命入格廟旺聚吉科權祿守上上之命不入廟加吉化吉科權祿上次之命不入廟不加吉平常命入廟不加吉平等若居陷地……（「聚」非「與」、「上次之」非「次之」、第二處作「平等」）」（PDF p45；v4 兩輪獨立目視轉錄（切邊直行補轉錄 A、B 一致）、本專案回影像複核（PDF p45 左頁首二行））
- SC-006：來源包 v4 data/confirmed_citations_v4.json（GY-P47-PRINCIPLE-ANNUAL-TAISUI）「太歲在命宮行有禍福尤緊」→「太歲在命宮行者禍福尤緊」（PDF p47；v4 兩輪獨立目視轉錄（A、B 一致））
- SC-007：本專案 v3 單次目視轉錄（transcription.json）「35 段單次目視轉錄即視為 verified」→「舊 35 段一律以 v4 兩輪獨立轉錄＋差異決議的頁面文字重新比對；逐字相同且無疑字才算雙重核讀，其餘不啟用並列入複核清單（SPAN_RECHECKS）。」（PDF p26；v4 雙重核讀頁面）

## 第二來源：《紫微斗數全集》集文版

PDF SHA-256 6b4c5e00b2b7aa840767a8df19ebc51321acd0bcc38b6f142addca884631c4f6。單字約 12–16 像素，許多筆畫已糊；放大只會放大像素，不會增加資訊。依「看不清的字不可猜」原則，本版目前只作段落定位與大意對照，不作逐字引用、不建立 textualVariants、不作規則依據。

- 十四主星問答：locatorOnly（集文版 PDF p105–113）
- 十二宮：noDirectParallel（集文版 PDF p19–25）
- 論人命入格／論格星數高下／論大限十年禍福何如／論行限分南北斗／論流年太歲逢吉凶星殺：notFound

## 待處理（408 項，依原因分類）

- 宿命或不宜直接顯示的古代斷語（只保留原文）：275
- 古文沒有足夠成立條件：41
- 疑字（兩輪核讀＋回影像決議仍無法確定）：22
- 需要客觀排盤沒有的資料（小限、斗君、空亡等；不擅自新增排盤）：64
- 排盤起例等非判讀內容：3
- 只有 OCR（只能搜尋）：2
- 第二來源解析度不足：1

| 項目 | 原因 | 篇 | PDF 頁 | 說明 |
|---|---|---|---|---|
| `GY_ZIWEI_M2` | historicalOnly | 一命宮・紫微 | 26 | 紫微守命本佳；逢煞則古籍斷為壽短、宜空門（壽夭與出家斷語，只保留原文）。 |
| `GY_ZIWEI_M4` | historicalOnly | 一命宮・紫微 | 26 | 紫微在卯酉與貪狼同宮：古籍斷為「為臣失義」（道德斷語，只保留原文）。 |
| `GY_ZIWEI_M5` | historicalOnly | 一命宮・紫微 | 26 | 紫微、七殺同宮再會煞：古籍斷為孤獨刑傷、宜空門（只保留原文）。 |
| `GY_ZIWEI_F1` | historicalOnly | 一命宮・紫微 | 26 | 女命紫微之訣（以受封贈論女命，屬性別角色斷語，只保留原文）。 |
| `GY_ZIWEI_F2` | historicalOnly | 一命宮・紫微 | 26 | 女命紫微之訣（只保留原文）。 |
| `GY_TIANJI_F1` | historicalOnly | 一命宮・天機 | 26 | 女命天機之訣（以誥命論女命，只保留原文）。 |
| `GY_TIANJI_F2` | historicalOnly | 一命宮・天機 | 26 | 女命天機太陰之訣（性別道德斷語，只保留原文）。 |
| `GY_TAIYANG_CHOUWEI_3` | historicalOnly | 一命宮・太陽 | 27 | 太陽坐命在戌宮：古籍評為「戌宮陷反背孤寡」。 |
| `GY_TAIYANG_F1` | historicalOnly | 一命宮・太陽 | 27 | 女命太陽之訣（只保留原文）。 |
| `GY_TAIYANG_F2` | historicalOnly | 一命宮・太陽 | 27 | 女命太陽之訣（只保留原文）。 |
| `GY_TAIYANG_F3` | historicalOnly | 一命宮・太陽 | 27 | 女命太陽之訣（壽夭、刑剋與偏房斷語，只保留原文）。 |
| `GY_WUQU_F1` | historicalOnly | 一命宮・武曲 | 27 | 女命武曲之訣（只保留原文）。 |
| `GY_WUQU_F2` | historicalOnly | 一命宮・武曲 | 27 | 女命武曲之訣（壽夭斷語，只保留原文）。 |
| `GY_WUQU_L4` | insufficientConditions | 一命宮・武曲 | 27 | 武曲入限對不同身分吉凶各異；原文沒有給出盤面條件。 |
| `GY_TIANTONG_M3` | historicalOnly | 一命宮・天同 | 28 | 天同落閑宮逢煞：古籍斷為宜空門（只保留原文）。 |
| `GY_TIANTONG_F1` | historicalOnly | 一命宮・天同 | 28 | 女命天同之訣（只保留原文）。 |
| `GY_TIANTONG_F2` | historicalOnly | 一命宮・天同 | 28 | 女命天同太陰之訣（性別道德斷語，只保留原文）。 |
| `GY_LIANZHEN_M3` | historicalOnly | 一命宮・廉貞 | 28 | 廉貞落陷逢煞：古籍斷為災殘、命終（疾病與死亡斷語，只保留原文）。 |
| `GY_LIANZHEN_F1` | historicalOnly | 一命宮・廉貞 | 28 | 女命廉貞之訣（只保留原文）。 |
| `GY_LIANZHEN_F2` | historicalOnly | 一命宮・廉貞 | 28 | 女命廉貞之訣（貧賤、刑剋與性別道德斷語，只保留原文）。 |
| `GY_LIANZHEN_L2` | historicalOnly | 一命宮・廉貞 | 28 | 大限廉貞逢天刑、化忌：古籍斷為血光、死亡（只保留原文）。 |
| `GY_TIANFU_N1` | unclearGlyph | 一命宮・天府 | 28 | 疑字：〔疑字：喜〕 |
| `GY_TIANFU_F1` | historicalOnly | 一命宮・天府 | 29 | 女命天府之訣（只保留原文）。 |
| `GY_TIANFU_F2` | historicalOnly | 一命宮・天府 | 29 | 女命天府之訣（只保留原文）。 |
| `GY_TAIYIN_M2` | historicalOnly | 一命宮・太陰 | 29 | 寅宮機昌曲月之訣（貧賤與性別斷語，只保留原文）。 |
| `GY_TAIYIN_M3` | historicalOnly | 一命宮・太陰 | 29 | 日月陷地逢煞之訣（貧窮、出家斷語，只保留原文）。 |
| `GY_TAIYIN_F1` | historicalOnly | 一命宮・太陰 | 29 | 女命太陰之訣（只保留原文）。 |
| `GY_TAIYIN_F2` | historicalOnly | 一命宮・太陰 | 29 | 女命太陰之訣（刑剋、壽夭斷語，只保留原文）。 |
| `GY_TANLANG_ZIWU_2` | insufficientConditions | 一命宮・貪狼 | 29 | 貪狼坐命在子、午宮：古籍評為「下局」。 |
| `GY_TANLANG_F1` | historicalOnly | 一命宮・貪狼 | 30 | 女命貪狼之訣（以旺夫論女命，只保留原文）。 |
| `GY_TANLANG_F2` | historicalOnly | 一命宮・貪狼 | 30 | 女命貪狼之訣（刑剋斷語，只保留原文）。 |
| `GY_TANLANG_L5` | historicalOnly | 一命宮・貪狼 | 30 | 女命貪狼入限之訣（死亡斷語，只保留原文）。 |
| `GY_JUMEN_F1` | historicalOnly | 一命宮・巨門 | 30 | 女命巨門之訣（只保留原文）。 |
| `GY_JUMEN_F2` | historicalOnly | 一命宮・巨門 | 30 | 女命巨門之訣（性別道德、壽夭斷語，只保留原文）。 |
| `GY_JUMEN_L2` | requiresChartExtension | 一命宮・巨門 | 30 | 大限巨門遇喪門：多煩憂（喪門屬歲前諸星，本 App 客觀排盤沒有此星）。 |
| `GY_TIANXIANG_N3` | historicalOnly | 一命宮・天相 | 30 | 天相再加火鈴巨機：古籍斷為傷刑、不善終（只保留原文）。 |
| `GY_TIANXIANG_F1` | historicalOnly | 一命宮・天相 | 30 | 女命天相之訣（只保留原文）。 |
| `GY_TIANXIANG_F2` | historicalOnly | 一命宮・天相 | 30 | 女命天相之訣（刑剋與性別斷語，只保留原文）。 |
| `GY_TIANXIANG_L3` | historicalOnly | 一命宮・天相 | 31 | 大限天相遇擎羊諸煞：古籍斷為死亡（只保留原文）。 |
| `GY_TIANLIANG_N3` | historicalOnly | 一命宮・天梁 | 31 | 天梁陷地遇火羊：古籍斷為下賤孤寒夭折（只保留原文）。 |
| `GY_TIANLIANG_M5` | historicalOnly | 一命宮・天梁 | 31 | 破軍卯酉之訣（刑剋斷語，只保留原文）。 |
| `GY_QISHA_M3` | historicalOnly | 一命宮・七殺 | 31 | 七殺陷地之訣（死亡斷語，只保留原文）。 |
| `GY_QISHA_M4` | historicalOnly | 一命宮・七殺 | 31 | 七殺閑宮之訣（傷殘斷語，只保留原文）。 |
| `GY_QISHA_F1` | historicalOnly | 一命宮・七殺 | 31 | 女命七殺之訣（刑剋斷語，只保留原文）。 |
| `GY_QISHA_F2` | historicalOnly | 一命宮・七殺 | 31 | 女命七殺之訣（性別道德斷語，只保留原文）。 |
| `GY_POJUN_M5` | historicalOnly | 一命宮・破軍 | 32 | 破軍身宮之訣（傷殘壽夭斷語，只保留原文）。 |
| `GY_POJUN_F1` | historicalOnly | 一命宮・破軍 | 32 | 女命破軍之訣（只保留原文）。 |
| `GY_POJUN_F2` | historicalOnly | 一命宮・破軍 | 32 | 女命破軍之訣（刑剋斷語，只保留原文）。 |
| `GY_POJUN_L3` | historicalOnly | 一命宮・破軍 | 32 | 破軍主限之訣（血光、產難斷語，只保留原文）。 |
| `GY_WENCHANG_M2` | historicalOnly | 一命宮・文昌 | 32 | 文昌守命之訣（夭折斷語，只保留原文）。 |
| `GY_WENCHANG_F1` | historicalOnly | 一命宮・文昌 | 32 | 女命文昌之訣（只保留原文）。 |
| `GY_WENCHANG_F2` | historicalOnly | 一命宮・文昌 | 32 | 女命文昌之訣（性別道德、壽夭斷語，只保留原文）。 |
| `GY_WENQU_N2` | historicalOnly | 一命宮・文曲 | 32 | 文曲單居逢惡殺：古籍斷為便佞之人（品格斷語，只保留原文）。 |
| `GY_WENQU_N5` | historicalOnly | 一命宮・文曲 | 32 | 文曲陷地逢武貞羊破殺狼：古籍斷為夭折（只保留原文）。 |
| `GY_WENQU_F1` | historicalOnly | 一命宮・文曲 | 32 | 女命文曲之訣（性別道德斷語，只保留原文）。 |
| `GY_ZUOFU_M2` | historicalOnly | 一命宮・左輔 | 33 | 左輔逢煞之訣（傷殘壽夭斷語，只保留原文）。 |
| `GY_ZUOFU_F1` | historicalOnly | 一命宮・左輔 | 33 | 女命左輔之訣（只保留原文）。 |
| `GY_ZUOFU_F2` | historicalOnly | 一命宮・左輔 | 33 | 女命左輔之訣（壽夭與偏房斷語，只保留原文）。 |
| `GY_YOUBI_M2` | historicalOnly | 一命宮・右弼 | 33 | 右弼逢煞之訣（帶疾斷語，只保留原文）。 |
| `GY_LUCUN_F1` | historicalOnly | 一命宮・祿存 | 33 | 女命祿存之訣（只保留原文）。 |
| `GY_LUCUN_F2` | historicalOnly | 一命宮・祿存 | 33 | 女命祿存之訣（只保留原文）。 |
| `GY_LUCUN_L4` | historicalOnly | 一命宮・祿存 | 33 | 祿馬交馳逢劫空之訣（死亡斷語，只保留原文）。 |
| `GY_QINGYANG_M3` | historicalOnly | 一命宮・擎羊 | 34 | 擎羊閑宮之訣（死亡斷語，只保留原文）。 |
| `GY_QINGYANG_F1` | historicalOnly | 一命宮・擎羊 | 34 | 女命擎羊之訣（只保留原文）。 |
| `GY_QINGYANG_L2` | historicalOnly | 一命宮・擎羊 | 34 | 擎羊羅網之訣（死亡斷語，只保留原文）。 |
| `GY_TUOLUO_F1` | historicalOnly | 一命宮・陀羅 | 34 | 女命陀羅之訣（性別道德斷語，只保留原文）。 |
| `GY_TUOLUO_L2` | historicalOnly | 一命宮・陀羅 | 34 | 羊陀夾命之訣（刑剋斷語，只保留原文）。 |
| `GY_HUOXING_N2` | requiresChartExtension | 一命宮・火星 | 34 | 火星利東南方出生的人、不利西北（客觀排盤沒有出生方位資料）。 |
| `GY_HUOXING_N4` | historicalOnly | 一命宮・火星 | 34 | 火星與擎羊同宮之訣（災厄刑剋斷語，只保留原文）。 |
| `GY_LINGXING_N2` | requiresChartExtension | 一命宮・鈴星 | 34 | 鈴星依出生方位論吉凶（客觀排盤沒有出生方位資料）。 |
| `GY_LINGXING_L1` | unclearGlyph | 一命宮・鈴星 | 34 | 疑字：〔疑字：至〕 |
| `GY_HUOLING_M2` | requiresChartExtension | 一命宮・火鈴 | 35 | 火鈴落閑宮，西北生人：平庸（客觀排盤沒有出生方位資料）。 |
| `GY_HUOLING_F1` | historicalOnly | 一命宮・火鈴 | 35 | 女命火鈴之訣（只保留原文）。 |
| `GY_HUOLING_F2` | historicalOnly | 一命宮・火鈴 | 35 | 女命火鈴之訣（死亡斷語，只保留原文）。 |
| `GY_DIKONG_M1` | historicalOnly | 一命宮・地空 | 35 | 天空坐命之訣（出家斷語，只保留原文）。 |
| `GY_JIEKONG_L2` | historicalOnly | 一命宮・劫空 | 35 | 紫微卯酉逢劫空之訣（出家斷語，只保留原文）。 |
| `GY_SHANGSHI_N1` | requiresChartExtension | 一命宮・天傷天使 | 35 | 天傷、天使守限、太歲：主耗損（本 App 客觀排盤沒有天傷、天使）。 |
| `GY_TIANMA_L2` | historicalOnly | 一命宮・天馬 | 35 | 天馬逢劫空之訣（死亡斷語，只保留原文）。 |
| `GY_HUAQUAN_F1` | historicalOnly | 一命宮・化權 | 36 | 女命化權之訣（性別角色斷語，只保留原文）。 |
| `GY_HUAKE_F1` | historicalOnly | 一命宮・化科 | 36 | 女命化科之訣（只保留原文）。 |
| `GY_HUAJI_M2` | historicalOnly | 一命宮・化忌 | 36 | 貪破陷地化忌之訣（品格與性別斷語，只保留原文）。 |
| `GY_HUAJI_F1` | historicalOnly | 一命宮・化忌 | 36 | 女命化忌之訣（貧賤斷語，只保留原文）。 |
| `GY_HUAJI_L1` | insufficientConditions | 一命宮・化忌 | 36 | 大限化忌之星入廟：反而佳（古籍未說明如何判定「忌星入廟」與限宮的關係）。 |
| `GY_SUIJUN_N1` | insufficientConditions | 一命宮・歲君 | 36 | 太歲守臨宮限時要仔細推詳；沒有吉星相助則難免官非（原文未說明「守臨宮限」指哪一宮）。 |
| `GY_DOUJUN_N1` | requiresChartExtension | 一命宮・斗君 | 36 | 斗君（流月起點）逐月斷吉凶；本 App 客觀排盤沒有斗君與流月。 |
| `GY_P_CAIBO_DOUJUN` | requiresChartExtension | 五財帛・斗君（流月）遇吉其月發財（本 App 沒有斗君）。 | 40 | 斗君（流月）遇吉其月發財（本 App 沒有斗君）。 |
| `GY_P_QIANYI_DOUJUN` | requiresChartExtension | 七遷移・斗君（流月）過遷移（本 App 沒有斗君）。 | 41 | 斗君（流月）過遷移（本 App 沒有斗君）。 |
| `GY_P_JIAOYOU_DOUJUN` | requiresChartExtension | 八奴僕・斗君（流月）過奴僕宮（本 App 沒有斗君）。 | 42 | 斗君（流月）過奴僕宮（本 App 沒有斗君）。 |
| `GY_P_GUANLU_DOUJUN` | requiresChartExtension | 九官祿・斗君（流月）遇吉財官旺（本 App 沒有斗君）。 | 42 | 斗君（流月）遇吉財官旺（本 App 沒有斗君）。 |
| `GY_P_TIANZHAI_DOUJUN` | requiresChartExtension | 十田宅・斗君過度田宅（本 App 沒有斗君）。 | 43 | 斗君過度田宅（本 App 沒有斗君）。 |
| `GY_P_FUDE_DOUJUN` | requiresChartExtension | 十一福德・斗君遇吉其年安靜（本 App 沒有斗君）。 | 44 | 斗君遇吉其年安靜（本 App 沒有斗君）。 |
| `GY_P_FUDE_SUIJUN` | insufficientConditions | 十一福德・歲君與大小二限過福德 | 44 | 歲君與大小二限過福德：逢吉享福、逢凶勞力（未說明星曜條件）。 |
| `GY_P_FUQI_DOUJUN` | requiresChartExtension | 三妻妾・斗君過度夫妻宮（本 App 沒有斗君）。 | 38 | 斗君過度夫妻宮（本 App 沒有斗君）。 |
| `GY_P_XIONGDI_H1` | historicalOnly | 二兄弟・紫微 | 37 | 二兄弟宮紫微條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_XIONGDI_H2` | historicalOnly | 二兄弟・天機 | 37 | 二兄弟宮天機條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_XIONGDI_H3` | historicalOnly | 二兄弟・太陽 | 37 | 二兄弟宮太陽條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_XIONGDI_H4` | historicalOnly | 二兄弟・武曲 | 37 | 二兄弟宮武曲條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_XIONGDI_H5` | historicalOnly | 二兄弟・天同 | 37 | 二兄弟宮天同條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_XIONGDI_H6` | historicalOnly | 二兄弟・廉貞 | 37 | 二兄弟宮廉貞條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_XIONGDI_H7` | historicalOnly | 二兄弟・天府 | 37 | 二兄弟宮天府條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_XIONGDI_H8` | historicalOnly | 二兄弟・太陰 | 37 | 二兄弟宮太陰條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_XIONGDI_H9` | historicalOnly | 二兄弟・貪狼 | 37 | 二兄弟宮貪狼條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_XIONGDI_H10` | historicalOnly | 二兄弟・巨門 | 37 | 二兄弟宮巨門條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_XIONGDI_H11` | historicalOnly | 二兄弟・天相 | 37 | 二兄弟宮天相條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_XIONGDI_H12` | historicalOnly | 二兄弟・天梁 | 37 | 二兄弟宮天梁條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_XIONGDI_H13` | historicalOnly | 二兄弟・七殺 | 37 | 二兄弟宮七殺條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_XIONGDI_H14` | historicalOnly | 二兄弟・紫微 | 37 | 二兄弟宮紫微條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_XIONGDI_H15` | historicalOnly | 二兄弟・左輔 | 37 | 二兄弟宮左輔條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_XIONGDI_H16` | historicalOnly | 二兄弟・右弼 | 37 | 二兄弟宮右弼條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_XIONGDI_H17` | historicalOnly | 二兄弟・祿存 | 37 | 二兄弟宮祿存條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_XIONGDI_H18` | historicalOnly | 二兄弟・羊陀 | 37 | 二兄弟宮羊陀條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_XIONGDI_H19` | historicalOnly | 二兄弟・火星 | 37 | 二兄弟宮火星條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_XIONGDI_H20` | historicalOnly | 二兄弟・鈴星 | 37 | 二兄弟宮鈴星條：兄弟人數與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_XIONGDI_H21` | requiresChartExtension | 二兄弟・君逢 | 37 | 斗君（流月）過此宮之吉凶；本 App 客觀排盤沒有斗君。 |
| `GY_P_FUQI_H1` | historicalOnly | 三妻妾・紫微 | 37 | 三妻妾宮紫微條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUQI_H2` | historicalOnly | 三妻妾・天機 | 37 | 三妻妾宮天機條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUQI_H3` | historicalOnly | 三妻妾・太陽 | 37 | 三妻妾宮太陽條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUQI_H4` | historicalOnly | 三妻妾・武曲 | 37 | 三妻妾宮武曲條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUQI_H5` | historicalOnly | 三妻妾・天同 | 37 | 三妻妾宮天同條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUQI_H6` | historicalOnly | 三妻妾・廉貞 | 37 | 三妻妾宮廉貞條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUQI_H7` | historicalOnly | 三妻妾・太陽 | 37 | 三妻妾宮太陽條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUQI_H8` | historicalOnly | 三妻妾・太陰 | 37 | 三妻妾宮太陰條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUQI_H9` | historicalOnly | 三妻妾・貪狼 | 37 | 三妻妾宮貪狼條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUQI_H10` | historicalOnly | 三妻妾・天相 | 38 | 三妻妾宮天相條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUQI_H11` | historicalOnly | 三妻妾・天梁 | 38 | 三妻妾宮天梁條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUQI_H12` | historicalOnly | 三妻妾・七殺 | 38 | 三妻妾宮七殺條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUQI_H13` | historicalOnly | 三妻妾・破軍 | 38 | 三妻妾宮破軍條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUQI_H14` | historicalOnly | 三妻妾・文昌 | 38 | 三妻妾宮文昌條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUQI_H15` | historicalOnly | 三妻妾・文曲 | 38 | 三妻妾宮文曲條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUQI_H16` | historicalOnly | 三妻妾・祿存 | 38 | 三妻妾宮祿存條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUQI_H17` | historicalOnly | 三妻妾・左輔 | 38 | 三妻妾宮左輔條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUQI_H18` | historicalOnly | 三妻妾・火鈴星 | 38 | 三妻妾宮火鈴星條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUQI_H19` | historicalOnly | 三妻妾・天魁 | 38 | 三妻妾宮天魁條：婚配年齡、刑剋、生離與幾度婚姻之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUQI_H20` | requiresChartExtension | 三妻妾・斗君 | 38 | 斗君（流月）過此宮之吉凶；本 App 客觀排盤沒有斗君。 |
| `GY_P_ZINV_H1` | historicalOnly | 四子女・天機 | 38 | 四子女宮天機條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_ZINV_H2` | historicalOnly | 四子女・太陽 | 38 | 四子女宮太陽條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_ZINV_H3` | historicalOnly | 四子女・廉貞 | 38 | 四子女宮廉貞條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_ZINV_H4` | historicalOnly | 四子女・天府 | 38 | 四子女宮天府條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_ZINV_H5` | historicalOnly | 四子女・太陰 | 38 | 四子女宮太陰條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_ZINV_H6` | historicalOnly | 四子女・貪狼 | 38 | 四子女宮貪狼條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_ZINV_H7` | historicalOnly | 四子女・巨門 | 38 | 四子女宮巨門條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_ZINV_H8` | historicalOnly | 四子女・天相 | 38 | 四子女宮天相條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_ZINV_H9` | historicalOnly | 四子女・羊陀 | 38 | 四子女宮羊陀條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_ZINV_H10` | historicalOnly | 四子女・天梁 | 38 | 四子女宮天梁條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_ZINV_H11` | historicalOnly | 四子女・七殺 | 39 | 四子女宮七殺條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_ZINV_H12` | historicalOnly | 四子女・破軍 | 39 | 四子女宮破軍條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_ZINV_H13` | historicalOnly | 四子女・左輔 | 39 | 四子女宮左輔條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_ZINV_H14` | historicalOnly | 四子女・右弼 | 39 | 四子女宮右弼條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_ZINV_H15` | historicalOnly | 四子女・文昌 | 39 | 四子女宮文昌條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_ZINV_H16` | historicalOnly | 四子女・文曲 | 39 | 四子女宮文曲條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_ZINV_H17` | historicalOnly | 四子女・祿存 | 39 | 四子女宮祿存條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_ZINV_H18` | historicalOnly | 四子女・羊陀 | 39 | 四子女宮羊陀條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_ZINV_H19` | historicalOnly | 四子女・火星 | 39 | 四子女宮火星條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_ZINV_H20` | historicalOnly | 四子女・鈴星 | 39 | 四子女宮鈴星條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_ZINV_H21` | historicalOnly | 四子女・魁鉞 | 39 | 四子女宮魁鉞條：子女人數、貴賤與刑剋之古代斷語，只保留原文，不作判讀。 |
| `GY_P_ZINV_H22` | requiresChartExtension | 四子女・斗君 | 39 | 斗君（流月）過此宮之吉凶；本 App 客觀排盤沒有斗君。 |
| `GY_P_JIE_H1` | historicalOnly | 六疾厄・紫微 | 40 | 六疾厄宮紫微條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |
| `GY_P_JIE_H2` | historicalOnly | 六疾厄・天機 | 40 | 六疾厄宮天機條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |
| `GY_P_JIE_H3` | historicalOnly | 六疾厄・太陽 | 40 | 六疾厄宮太陽條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |
| `GY_P_JIE_H4` | historicalOnly | 六疾厄・武曲 | 40 | 六疾厄宮武曲條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |
| `GY_P_JIE_H5` | historicalOnly | 六疾厄・天同 | 40 | 六疾厄宮天同條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |
| `GY_P_JIE_H6` | historicalOnly | 六疾厄・廉貞 | 40 | 六疾厄宮廉貞條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |
| `GY_P_JIE_H7` | historicalOnly | 六疾厄・天府 | 40 | 六疾厄宮天府條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |
| `GY_P_JIE_H8` | historicalOnly | 六疾厄・太陰 | 40 | 六疾厄宮太陰條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |
| `GY_P_JIE_H9` | historicalOnly | 六疾厄・巨門 | 40 | 六疾厄宮巨門條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |
| `GY_P_JIE_H10` | historicalOnly | 六疾厄・天相 | 40 | 六疾厄宮天相條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |
| `GY_P_JIE_H11` | historicalOnly | 六疾厄・七殺 | 40 | 六疾厄宮七殺條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |
| `GY_P_JIE_H12` | historicalOnly | 六疾厄・文昌 | 40 | 六疾厄宮文昌條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |
| `GY_P_JIE_H13` | historicalOnly | 六疾厄・文曲 | 40 | 六疾厄宮文曲條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |
| `GY_P_JIE_H14` | historicalOnly | 六疾厄・左輔 | 40 | 六疾厄宮左輔條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |
| `GY_P_JIE_H15` | historicalOnly | 六疾厄・右弼 | 40 | 六疾厄宮右弼條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |
| `GY_P_JIE_H16` | historicalOnly | 六疾厄・祿存 | 40 | 六疾厄宮祿存條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |
| `GY_P_JIE_H17` | historicalOnly | 六疾厄・擎羊 | 40 | 六疾厄宮擎羊條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |
| `GY_P_JIE_H18` | historicalOnly | 六疾厄・陀羅 | 40 | 六疾厄宮陀羅條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |
| `GY_P_JIE_H19` | historicalOnly | 六疾厄・羊鈴 | 40 | 六疾厄宮羊鈴條：疾病與傷殘（不作醫療判斷）之古代斷語，只保留原文，不作判讀。 |
| `GY_P_JIE_H20` | requiresChartExtension | 六疾厄・斗君 | 40 | 斗君（流月）過此宮之吉凶；本 App 客觀排盤沒有斗君。 |
| `GY_P_FUMU_H1` | historicalOnly | 十二父母・太陽 | 44 | 十二父母宮太陽條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUMU_H2` | historicalOnly | 十二父母・武曲 | 44 | 十二父母宮武曲條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUMU_H3` | historicalOnly | 十二父母・天同 | 44 | 十二父母宮天同條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUMU_H4` | historicalOnly | 十二父母・廉貞 | 44 | 十二父母宮廉貞條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUMU_H5` | historicalOnly | 十二父母・天府 | 44 | 十二父母宮天府條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUMU_H6` | historicalOnly | 十二父母・太陰 | 44 | 十二父母宮太陰條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUMU_H7` | historicalOnly | 十二父母・貪狼 | 44 | 十二父母宮貪狼條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUMU_H8` | historicalOnly | 十二父母・巨門 | 44 | 十二父母宮巨門條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUMU_H9` | historicalOnly | 十二父母・天相 | 44 | 十二父母宮天相條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUMU_H10` | historicalOnly | 十二父母・天梁 | 44 | 十二父母宮天梁條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUMU_H11` | historicalOnly | 十二父母・七殺 | 44 | 十二父母宮七殺條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUMU_H12` | historicalOnly | 十二父母・破軍 | 44 | 十二父母宮破軍條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUMU_H13` | historicalOnly | 十二父母・文昌 | 45 | 十二父母宮文昌條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUMU_H14` | historicalOnly | 十二父母・文曲 | 45 | 十二父母宮文曲條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUMU_H15` | historicalOnly | 十二父母・左輔 | 45 | 十二父母宮左輔條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUMU_H16` | historicalOnly | 十二父母・右弼 | 45 | 十二父母宮右弼條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUMU_H17` | historicalOnly | 十二父母・祿存 | 45 | 十二父母宮祿存條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUMU_H18` | historicalOnly | 十二父母・擎羊 | 45 | 十二父母宮擎羊條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUMU_H19` | historicalOnly | 十二父母・陀羅 | 45 | 十二父母宮陀羅條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUMU_H20` | historicalOnly | 十二父母・火星 | 45 | 十二父母宮火星條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUMU_H21` | historicalOnly | 十二父母・鈴星 | 45 | 十二父母宮鈴星條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUMU_H22` | historicalOnly | 十二父母・魁鉞 | 45 | 十二父母宮魁鉞條：父母刑剋、過房、入贅之古代斷語，只保留原文，不作判讀。 |
| `GY_P_FUMU_H23` | requiresChartExtension | 十二父母・斗君 | 45 | 斗君（流月）過此宮之吉凶；本 App 客觀排盤沒有斗君。 |
| `GY_PAT_SENGDAO` | historicalOnly | 卷一・僧道之命 | 17 | 僧道之命：出家斷語，只保留原文。 |
| `GY_PAT_GUKE` | historicalOnly | 卷一・孤剋之命 | 17 | 孤剋之命：孤剋斷語，只保留原文。 |
| `GY_PAT_SHAJUEDI` | historicalOnly | 卷一・殺居絕地 | 17 | 殺居絕地：夭壽斷語，只保留原文。 |
| `GY_PAT_HAOJULUWEI` | historicalOnly | 卷一・耗居祿位 | 17 | 耗居祿位：貧賤斷語，只保留原文。 |
| `GY_PAT_HUITAN` | historicalOnly | 卷一・會貪旺宮 | 17 | 會貪旺宮：品格斷語，只保留原文。 |
| `GY_PAT_JIAN_JIE` | historicalOnly | 卷一・忌暗同居 | 17 | 忌暗同居：疾病斷語，只保留原文。 |
| `GY_PAT_XINGSHA_LIANZHEN` | historicalOnly | 卷一・刑殺會廉貞於官祿 | 17 | 刑殺會廉貞於官祿：刑獄斷語，只保留原文。 |
| `GY_PAT_GUANFU_JIA` | historicalOnly | 卷一・官府夾刑殺 | 17 | 官府夾刑殺：刑獄斷語，只保留原文。 |
| `GY_PAT_DING_DAOZEI` | historicalOnly | 卷一・定人作盜賊 | 18 | 定人作盜賊：品格斷語，只保留原文。 |
| `GY_PAT_DING_SHOUYAO` | historicalOnly | 卷一・壽夭淫蕩 | 18 | 壽夭淫蕩：壽夭與品格斷語，只保留原文。 |
| `GY_PAT_DING_CANJI` | historicalOnly | 卷一・定人殘疾 | 18 | 定人殘疾：疾病斷語，只保留原文。 |
| `GY_PAT_DING_POXIANG` | historicalOnly | 卷一・定人破相 | 18 | 定人破相：身體斷語，只保留原文。 |
| `GY_PAT_XINGMING_LUN` | insufficientConditions | 卷一・刑名論 | 18 | 刑名論：主星、煞星與「上吉湊合」的組合條件不明確，另有兩輪轉錄與補轉錄讀法不一。 |
| `GY_PAT_JIYAO_LUN` | historicalOnly | 卷一・疾夭論 | 18 | 疾夭論：疾病夭壽斷語，只保留原文。 |
| `GY_PAT_SENGDAO_LUN` | historicalOnly | 卷一・僧道論 | 18 | 僧道論：出家斷語，只保留原文。 |
| `GY_PAT_CONGMING_LUN` | requiresChartExtension | 卷一・聰明論 | 18 | 聰明論：條件含三台、八座，本 App 客觀排盤沒有這兩顆星。 |
| `GY_PAT_HEGE_ZI` | insufficientConditions | 卷一・子宮得地合格 | 18 | 子宮得地合格：「貪狼殺陰星機梁相拱」所列星曜不可能同時在子宮三方成立，條件需另行考證。 |
| `GY_PAT_HEGE_WU` | unclearGlyph | 卷一・午宮得地合格 | 18 | 午宮得地合格：後半句（生年與結果）有疑字。 |
| `GY_PAT_HEGE_CHEN` | unclearGlyph | 卷一・辰宮得地合格 | 18 | 辰宮得地合格：「天府□地」有疑字。 |
| `GY_PAT_POGE_OTHER` | historicalOnly | 卷一・其他失陷破格 | 19 | 其他失陷破格：寅、卯辰、巳、未、申酉、戌、亥各訣主要為貧賤、夭折、奴僕娼婢等斷語，只保留原文。 |
| `GY_PAT_DEDI_LUN` | insufficientConditions | 卷一・十二宮諸星得地富貴論 | 19 | 十二宮諸星得地富貴論：歌訣逐宮列舉星名，未分條給出完整條件（與各星「X宮Y地」條目重複者已在卷二處理）。 |
| `GY_PAT_FU_YINYIN` | unclearGlyph | 卷一・定富局 | 19 | 陰印拱身：格名首字有疑字，且條件涉及身宮落田宅，暫列候選。 |
| `GY_PAT_GUI_LUMAPEIYIN` | insufficientConditions | 卷一・定貴局 | 19 | 祿馬佩印：「馬前」「印星」所指位置不明確。 |
| `GY_PAT_GUI_ZUOGUI` | unclearGlyph | 卷一・定貴局 | 19 | 坐貴向貴：註文有疑字。 |
| `GY_PAT_GUI_SEEPRIOR_1` | insufficientConditions | 卷一・定貴局 | 19 | 七殺朝斗：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 |
| `GY_PAT_GUI_SEEPRIOR_2` | insufficientConditions | 卷一・定貴局 | 19 | 日月並明：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 |
| `GY_PAT_GUI_SEEPRIOR_3` | insufficientConditions | 卷一・定貴局 | 19 | 明珠出海：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 |
| `GY_PAT_GUI_SEEPRIOR_4` | insufficientConditions | 卷一・定貴局 | 19 | 日月同臨：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 |
| `GY_PAT_GUI_SEEPRIOR_5` | insufficientConditions | 卷一・定貴局 | 19 | 科權祿拱：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 |
| `GY_PAT_GUI_SEEPRIOR_6` | insufficientConditions | 卷一・定貴局 | 19 | 府相朝垣：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 |
| `GY_PAT_GUI_SEEPRIOR_7` | insufficientConditions | 卷一・定貴局 | 19 | 紫府朝垣：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 |
| `GY_PAT_GUI_SEEPRIOR_8` | insufficientConditions | 卷一・定貴局 | 19 | 文星暗拱：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 |
| `GY_PAT_GUI_SEEPRIOR_9` | insufficientConditions | 卷一・定貴局 | 19 | 巨機居卯：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 |
| `GY_PAT_GUI_SEEPRIOR_10` | insufficientConditions | 卷一・定貴局 | 19 | 明祿暗祿：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 |
| `GY_PAT_GUI_SEEPRIOR_11` | insufficientConditions | 卷一・定貴局 | 19 | 科明祿暗：原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。 |
| `GY_PAT_PIN_SHENGBUFENGSHI` | unclearGlyph | 卷一・定貧賤局 | 19 | 生不逢時：註文有疑字，且條件含空亡（本 App 未排）。 |
| `GY_PAT_PIN_LUFENGLIANGSHA` | requiresChartExtension | 卷一・定貧賤局 | 19 | 祿逢兩殺：條件含空亡（旬空／截空），本 App 客觀排盤沒有。 |
| `GY_PAT_PIN_MALUO` | requiresChartExtension | 卷一・定貧賤局 | 19 | 馬落空亡：條件含空亡，本 App 客觀排盤沒有。 |
| `GY_PAT_PIN_CAIYUQIUCHOU` | unclearGlyph | 卷一・定貧賤局 | 19 | 財與囚仇：註文有疑字。 |
| `GY_PAT_PIN_JUNZI` | unclearGlyph | 卷一・定貧賤局 | 20 | 君子在野：註文有疑字與缺字。 |
| `GY_PAT_ZA_JINSHANG` | insufficientConditions | 卷一・定雜局 | 20 | 錦上添花：「限破惡星而行吉地」未指明星曜與宮位。 |
| `GY_PAT_ZA_LUSHUAI` | requiresChartExtension | 卷一・定雜局 | 20 | 祿衰馬困：條件含空亡。 |
| `GY_PAT_ZA_YIJIN` | insufficientConditions | 卷一・定雜局 | 20 | 衣錦還鄉：「墓運」所指不明確。 |
| `GY_PAT_ZA_SHAOSUI` | unclearGlyph | 卷一・定雜局 | 20 | 少歲無衣：格名有疑字。 |
| `GY_PAT_ZA_SHUISHANG` | insufficientConditions | 卷一・定雜局 | 20 | 水上駕星：只描述結果，沒有盤面條件。 |
| `GY_PAT_ZA_JIXIONG` | insufficientConditions | 卷一・定雜局 | 20 | 吉凶相伴：「限前」「限衰」未指明條件。 |
| `GY_PAT_ZA_KUMU` | insufficientConditions | 卷一・定雜局 | 20 | 枯木逢春：「命衰限好」沒有具體星曜條件。 |
| `GY_R_TANXING` | insufficientConditions | 譚星要論 | 45 | 看命先看命主吉凶廟旺與化吉化忌，次看身主，三看遷移財帛官祿三方，四看福德。 |
| `GY_R_RUGE` | insufficientConditions | 論人命入格 | 45 | 入格且廟旺、聚吉與科權祿守照為上上之命；不入廟但加吉化吉次之；入格而化凶，只以本命吉凶多寡論。入格不能單獨判吉。 |
| `GY_R_RUGE2` | insufficientConditions | 論人命入格 | 45 | 若居陷地又加煞化忌為下格，不以入格論；入格而化凶，只以本命吉凶多寡斷之。 |
| `GY_R_GEXING` | insufficientConditions | 論格星數高下 | 45 | 三方四正皆吉星為上格，吉凶相半為中格；星格與數格高下相配，分九等。 |
| `GY_R_NANNV` | insufficientConditions | 論男女命異同 | 45 | 男命先看身命，次看財帛、官祿、遷移，都以廟旺為吉、落陷聚凶為凶（女命之論含性別角色斷語，只保留原文）。 |
| `GY_R_SHENGSHI_SHEN` | notInterpretive | 論人生時要審的確 | 46 | 子、亥二時最難定準，要仔細推詳；時辰錯則命不準（排盤前的提醒，不作判讀）。 |
| `GY_R_XIAOER` | notInterpretive | 定小兒生時訣 | 46 | 以嬰兒頭頂旋紋推定時辰（非判讀內容）。 |
| `GY_R_XIAOER_KEQIN` | historicalOnly | 論小兒 | 46 | 小兒命宮星辰廟旺災少易養（屬嬰幼兒健康與刑剋斷語，只保留原文）。 |
| `GY_R_DAXIAN_XIAN` | historicalOnly | 論大限十年禍福何如 | 46 | 大限落陷又逢煞忌、流年惡煞與小限凶煞：古籍斷為官災死亡（死亡斷語，且需小限，只保留原文）。 |
| `GY_R_DAXIAN_JIA` | requiresChartExtension | 論大限十年禍福何如 | 46 | 大小二限與太歲怕行天傷天使夾地、空劫、羊陀之地（天傷、天使、小限本 App 沒有）。 |
| `GY_R_DAXIAN_SHOUXING` | historicalOnly | 論大限十年禍福何如 | 46 | 逢凶限能否逃過，看壽星紫微、天同、天梁、貪狼坐命可解（壽命斷語，只保留原文）。 |
| `GY_R_DAXIAN_TAISUI12` | requiresChartExtension | 論大限十年禍福何如 | 46 | 太歲行至奏書、將軍、直符等（博士十二神、歲前諸星），本 App 沒有這些星。 |
| `GY_R_ERXIAN` | insufficientConditions | 論二限太歲吉星凶 | 46 | 大限、小限、太歲分別看吉凶，都凶才凶；再看彼此相逢與相沖。本 App 以本命為基準，大限、流年只作修正。 |
| `GY_R_NANBEI` | insufficientConditions | 論行限分南北斗 | 47 | 陽男陰女以南斗為福，陰男陽女以北斗為福；北斗星的吉凶應在大限前五年，南斗應在後五年（時間原則，不改大限起迄）。 |
| `GY_R_NANBEI2` | insufficientConditions | 論行限分南北斗 | 47 | 北斗諸星吉凶：大限應在前五年，小限應在上半年。 |
| `GY_R_YINZHI` | historicalOnly | 論陰騭延壽 | 47 | 行善積德可延壽（道德與壽命論述，只保留原文）。 |
| `GY_R_YANGTUO_DIEBING` | requiresChartExtension | 論羊陀迭併 | 47 | 本命擎羊陀羅與流年流羊流陀重疊沖合；本 App 沒有流年擎羊、陀羅。 |
| `GY_R_QISHA_CHONGFENG` | requiresChartExtension | 論七殺重逢 | 47 | 命中三合有七殺，流年又遇流羊流陀沖照；本 App 沒有流年擎羊、陀羅。 |
| `GY_R_LIMING_XINGXIAN` | historicalOnly | 論立命行限宮歌 | 47 | 依命局五行與行限方位論傷災（傷亡、膿血斷語，只保留原文）。 |
| `GY_R_SUIZHI_SHEN_XIONG` | unclearGlyph | 申年太歲所值吉凶星 | 49 | 疑字：〔疑字：軍〕 |
| `GY_R_XIAOXIAN_0_JI` | requiresChartExtension | 論太歲小限星辰廟限遇十二宮中吉凶 | 47 | 子年太歲併小限到子宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |
| `GY_R_XIAOXIAN_0_XIONG` | requiresChartExtension | 論太歲小限星辰廟限遇十二宮中吉凶 | 47 | 子年太歲併小限到子宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |
| `GY_R_XIAOXIAN_1_JI` | requiresChartExtension | 論太歲小限星辰廟限遇十二宮中吉凶 | 48 | 丑年太歲併小限到丑宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |
| `GY_R_XIAOXIAN_1_XIONG` | requiresChartExtension | 論太歲小限星辰廟限遇十二宮中吉凶 | 48 | 丑年太歲併小限到丑宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |
| `GY_R_XIAOXIAN_2_JI` | requiresChartExtension | 論太歲小限星辰廟限遇十二宮中吉凶 | 48 | 寅年太歲併小限到寅宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |
| `GY_R_XIAOXIAN_2_XIONG` | requiresChartExtension | 論太歲小限星辰廟限遇十二宮中吉凶 | 48 | 寅年太歲併小限到寅宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |
| `GY_R_XIAOXIAN_3_JI` | requiresChartExtension | 論太歲小限星辰廟限遇十二宮中吉凶 | 48 | 卯年太歲併小限到卯宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |
| `GY_R_XIAOXIAN_3_XIONG` | requiresChartExtension | 論太歲小限星辰廟限遇十二宮中吉凶 | 48 | 卯年太歲併小限到卯宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |
| `GY_R_XIAOXIAN_4_JI` | requiresChartExtension | 論太歲小限星辰廟限遇十二宮中吉凶 | 48 | 辰年太歲併小限到辰宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |
| `GY_R_XIAOXIAN_4_XIONG` | requiresChartExtension | 論太歲小限星辰廟限遇十二宮中吉凶 | 48 | 辰年太歲併小限到辰宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |
| `GY_R_XIAOXIAN_5_JI` | requiresChartExtension | 論太歲小限星辰廟限遇十二宮中吉凶 | 48 | 巳年太歲併小限到巳宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |
| `GY_R_XIAOXIAN_5_XIONG` | requiresChartExtension | 論太歲小限星辰廟限遇十二宮中吉凶 | 48 | 巳年太歲併小限到巳宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |
| `GY_R_XIAOXIAN_6_JI` | requiresChartExtension | 論太歲小限星辰廟限遇十二宮中吉凶 | 48 | 午年太歲併小限到午宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |
| `GY_R_XIAOXIAN_6_XIONG` | requiresChartExtension | 論太歲小限星辰廟限遇十二宮中吉凶 | 49 | 午年太歲併小限到午宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |
| `GY_R_XIAOXIAN_7_JI` | requiresChartExtension | 論太歲小限星辰廟限遇十二宮中吉凶 | 49 | 未年太歲併小限到未宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |
| `GY_R_XIAOXIAN_7_XIONG` | requiresChartExtension | 論太歲小限星辰廟限遇十二宮中吉凶 | 49 | 未年太歲併小限到未宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |
| `GY_R_XIAOXIAN_8_JI` | requiresChartExtension | 論太歲小限星辰廟限遇十二宮中吉凶 | 49 | 申年太歲併小限到申宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |
| `GY_R_XIAOXIAN_8_XIONG` | requiresChartExtension | 論太歲小限星辰廟限遇十二宮中吉凶 | 49 | 申年太歲併小限到申宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |
| `GY_R_XIAOXIAN_9_JI` | requiresChartExtension | 論太歲小限星辰廟限遇十二宮中吉凶 | 49 | 酉年太歲併小限到酉宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |
| `GY_R_XIAOXIAN_9_XIONG` | requiresChartExtension | 論太歲小限星辰廟限遇十二宮中吉凶 | 49 | 酉年太歲併小限到酉宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |
| `GY_R_XIAOXIAN_10_JI` | requiresChartExtension | 論太歲小限星辰廟限遇十二宮中吉凶 | 49 | 戌年太歲併小限到戌宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |
| `GY_R_XIAOXIAN_10_XIONG` | requiresChartExtension | 論太歲小限星辰廟限遇十二宮中吉凶 | 49 | 戌年太歲併小限到戌宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |
| `GY_R_XIAOXIAN_11_JI` | requiresChartExtension | 論太歲小限星辰廟限遇十二宮中吉凶 | 49 | 亥年太歲併小限到亥宮入廟化吉：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |
| `GY_R_XIAOXIAN_11_XIONG` | requiresChartExtension | 論太歲小限星辰廟限遇十二宮中吉凶 | 50 | 亥年太歲併小限到亥宮不入廟化凶：依生年天干分論吉凶；條件需要小限，本 App 客觀排盤沒有小限。 |
| `GY_A_ZIWEI_04` | historicalOnly | 論諸星同位垣・紫微 | 50 | 紫微在卯酉逢劫空四煞：古籍斷為出家（出家斷語，只保留原文）。 |
| `GY_A_ZIWEI_18` | historicalOnly | 論諸星同位垣・紫微 | 50 | 紫微破軍無左右吉曜：古籍斷為凶惡胥吏（品格斷語，只保留原文）。 |
| `GY_A_ZIWEI_20` | historicalOnly | 論諸星同位垣・紫微 | 50 | 紫微權祿遇羊陀：古籍斷為心術不正（品格斷語，只保留原文）。 |
| `GY_A_ZIWEI_21` | requiresChartExtension | 論諸星同位垣・紫微 | 50 | 紫微七殺加空亡：虛名受蔭。空亡不在客觀排盤中。 |
| `GY_A_ZIWEI_23` | historicalOnly | 論諸星同位垣・紫微 | 50 | 紫破在辰戌：古籍斷為君臣不義（品格斷語，只保留原文）。 |
| `GY_A_ZIWEI_24` | historicalOnly | 論諸星同位垣・紫微 | 50 | 女命紫微、太陽之訣（女命訣，只保留原文）。 |
| `GY_A_ZIWEI_25` | historicalOnly | 論諸星同位垣・紫微 | 50 | 女命紫微在寅午申之訣（女命訣，只保留原文）。 |
| `GY_A_TIANXIANG_01` | historicalOnly | 論諸星同位垣・天相 | 50 | 天相廉貞擎羊夾：古籍斷為刑杖（刑獄斷語，只保留原文）。 |
| `GY_A_TIANXIANG_02` | historicalOnly | 論諸星同位垣・天相 | 50 | 女命天相之訣（女命訣，只保留原文）。 |
| `GY_A_TIANXIANG_03` | historicalOnly | 論諸星同位垣・天相 | 50 | 右弼天相（此處小注全為女命之說，只保留原文；同句在 54R 另建規則）。 |
| `GY_A_TIANLIANG_01` | historicalOnly | 論諸星同位垣・天梁 | 50 | 天梁太陰女命之訣（性別道德斷語，只保留原文）。 |
| `GY_A_TIANLIANG_05` | historicalOnly | 論諸星同位垣・天梁 | 50 | 梁同巳亥之訣（品格、性別道德斷語，只保留原文）。 |
| `GY_A_TIANLIANG_08` | insufficientConditions | 論諸星同位垣・天梁 | 50 | 梁武陰鈴：可作棟梁之客。原文未說明四星的宮位關係，無法落成盤面條件。 |
| `GY_A_TIANTONG_01` | historicalOnly | 論諸星同位垣・天同 | 50 | 天同會吉之壽元斷語（壽夭斷語，只保留原文）。 |
| `GY_A_TIANTONG_02` | unclearGlyph | 論諸星同位垣・天同 | 50 | 疑字：〔疑字：藝〕〔疑字：羸〕 |
| `GY_A_TIANTONG_05` | historicalOnly | 論諸星同位垣・天同 | 51 | 女命天同之訣（女命訣，只保留原文）。 |
| `GY_A_TIANJI_03` | historicalOnly | 論諸星同位垣・天機 | 51 | 機梁同照逢空：古籍斷為宜僧道（出家斷語，只保留原文）。 |
| `GY_A_TIANJI_04` | historicalOnly | 論諸星同位垣・天機 | 51 | 機梁七殺破軍沖：古籍斷為僧道（出家斷語，只保留原文）。 |
| `GY_A_TIANJI_07` | historicalOnly | 論諸星同位垣・天機 | 51 | 天機加惡煞：古籍斷為盜竊（品格斷語，只保留原文）。 |
| `GY_A_TIANJI_08` | historicalOnly | 論諸星同位垣・天機 | 51 | 天機巳酉之訣（品格斷語，只保留原文）。 |
| `GY_A_TAIYANG_06` | historicalOnly | 論諸星同位垣・太陽 | 51 | 女命太陽之訣（女命訣，只保留原文）。 |
| `GY_A_TAIYIN_07` | historicalOnly | 論諸星同位垣・太陰 | 51 | 太陰天梁女命之訣（性別道德斷語，只保留原文）。 |
| `GY_A_RIYUE_04` | unclearGlyph | 論諸星同位垣・日月 | 51 | 疑字：〔疑字：命〕〔疑字：身〕〔疑字：居〕〔疑字：遇〕 |
| `GY_A_RIYUE_05` | insufficientConditions | 論諸星同位垣・日月 | 51 | 日月守命不如日月照合（小注：吉多主吉、凶多主凶）。這是比較原則，沒有獨立的結果詞。 |
| `GY_A_RIYUE_10` | historicalOnly | 論諸星同位垣・日月 | 51 | 日月羊陀：古籍斷為剋親（刑剋斷語，只保留原文）。 |
| `GY_A_RIYUE_12` | historicalOnly | 論諸星同位垣・日月 | 51 | 日月會貪殺：古籍斷為奸盜淫（品格、性別道德斷語，只保留原文）。 |
| `GY_A_RIYUE_13` | historicalOnly | 論諸星同位垣・日月 | 51 | 日月疾厄之訣（疾病斷語，只保留原文）。 |
| `GY_A_WENQU_03` | historicalOnly | 論諸星同位垣・文曲 | 51 | 二曲貪狼限至午丑之訣（意外斷語，只保留原文）。 |
| `GY_A_CHANGQU_06` | historicalOnly | 論諸星同位垣・昌曲 | 51 | 昌曲陷於天傷：古籍斷為夭折（壽夭斷語，只保留原文）。 |
| `GY_A_CHANGQU_07` | historicalOnly | 論諸星同位垣・昌曲 | 51 | 昌曲限逢辰戌之訣（意外斷語，只保留原文）。 |
| `GY_A_CHANGQU_08` | historicalOnly | 論諸星同位垣・昌曲 | 51 | 昌曲廉貞巳亥：古籍斷為遭刑、不善（刑獄、品格斷語，只保留原文）。 |
| `GY_A_CHANGQU_11` | historicalOnly | 論諸星同位垣・昌曲 | 52 | 昌曲左右會羊陀：身上有痣（身體斷語，只保留原文）。 |
| `GY_A_CHANGQU_12` | historicalOnly | 論諸星同位垣・昌曲 | 52 | 女命昌曲之訣（性別道德斷語，只保留原文）。 |
| `GY_A_WUQU_10` | historicalOnly | 論諸星同位垣・武曲 | 52 | 武曲破軍廉貞於卯：古籍意外斷語（只保留原文）。 |
| `GY_A_WUQU_11` | historicalOnly | 論諸星同位垣・武曲 | 52 | 武曲劫煞會擎羊：古籍斷為因財持刀（只保留原文）。 |
| `GY_A_WUQU_12` | historicalOnly | 論諸星同位垣・武曲 | 52 | 武曲羊陀火星：古籍斷為因財喪命（只保留原文）。 |
| `GY_A_WUQU_13` | historicalOnly | 論諸星同位垣・武曲 | 52 | 武曲為寡宿（刑剋、性別角色斷語，只保留原文）。 |
| `GY_A_TANLANG_02` | historicalOnly | 論諸星同位垣・貪狼 | 52 | 貪狼入廟之壽元斷語（只保留原文）。 |
| `GY_A_TANLANG_03` | historicalOnly | 論諸星同位垣・貪狼 | 52 | 貪狼會煞無吉：古籍斷為屠宰（職業貴賤斷語，只保留原文）。 |
| `GY_A_TANLANG_04` | historicalOnly | 論諸星同位垣・貪狼 | 52 | 貪狼子午卯酉：古籍盜竊斷語（品格斷語，只保留原文）。 |
| `GY_A_TANLANG_05` | historicalOnly | 論諸星同位垣・貪狼 | 52 | 貪狼加吉坐長生之壽考斷語（只保留原文）。 |
| `GY_A_TANLANG_06` | historicalOnly | 論諸星同位垣・貪狼 | 52 | 貪狼巳亥加煞：屠戶、遭刑斷語（只保留原文）。 |
| `GY_A_TANLANG_07` | unclearGlyph | 論諸星同位垣・貪狼 | 52 | 疑字：〔疑字：還〕 |
| `GY_A_TANLANG_10` | historicalOnly | 論諸星同位垣・貪狼 | 52 | 貪狼加煞：古籍盜竊、淫佚斷語（只保留原文）。 |
| `GY_A_TANLANG_12` | historicalOnly | 論諸星同位垣・貪狼 | 52 | 貪武守身無吉：古籍壽夭斷語（只保留原文）。 |
| `GY_A_TANLANG_13` | historicalOnly | 論諸星同位垣・貪狼 | 52 | 貪武破軍無吉：古籍迷酒斷語（品格斷語，只保留原文）。 |
| `GY_A_TANLANG_15` | historicalOnly | 論諸星同位垣・貪狼 | 52 | 貪狼廉貞同度（品格、性別道德斷語，只保留原文）。 |
| `GY_A_TANLANG_16` | historicalOnly | 論諸星同位垣・貪狼 | 52 | 泛水桃花（品格斷語，只保留原文）。 |
| `GY_A_TANLANG_17` | historicalOnly | 論諸星同位垣・貪狼 | 52 | 風流彩杖（品格斷語，只保留原文）。 |
| `GY_A_TANLANG_18` | historicalOnly | 論諸星同位垣・貪狼 | 52 | 女命貪狼之訣（女命訣，只保留原文）。 |
| `GY_A_LIANZHEN_01` | unclearGlyph | 論諸星同位垣・廉貞 | 52 | 疑字：〔疑字：貞〕〔疑字：卯〕〔疑字：酉〕〔疑字：宮〕〔疑字：加〕〔疑字：殺〕〔疑字：公〕〔疑字：人〕〔疑字：藝〕〔疑字：人〕 |
| `GY_A_LIANZHEN_02` | historicalOnly | 論諸星同位垣・廉貞 | 52 | 廉貞暗巨：古籍斷為吏而貪婪（品格斷語，只保留原文）。 |
| `GY_A_LIANZHEN_05` | historicalOnly | 論諸星同位垣・廉貞 | 52 | 廉貞破軍火星居陷：古籍死亡斷語（只保留原文）。 |
| `GY_A_LIANZHEN_07` | requiresChartExtension | 論諸星同位垣・廉貞 | 52 | 廉貞入廟會將軍：威猛。「將軍」屬博士十二神，客觀排盤沒有。 |
| `GY_A_LIANZHEN_08` | historicalOnly | 論諸星同位垣・廉貞 | 52 | 廉貞四煞：刑戮斷語（只保留原文）。 |
| `GY_A_LIANZHEN_09` | historicalOnly | 論諸星同位垣・廉貞 | 52 | 廉貞白虎：刑杖斷語（只保留原文）。 |
| `GY_A_LIANZHEN_10` | historicalOnly | 論諸星同位垣・廉貞 | 52 | 廉貞破殺會遷移：死亡斷語（只保留原文）。 |
| `GY_A_LIANZHEN_11` | historicalOnly | 論諸星同位垣・廉貞 | 52 | 廉貞羊殺居官祿：刑獄斷語（只保留原文）。 |
| `GY_A_LIANZHEN_12` | historicalOnly | 論諸星同位垣・廉貞 | 52 | 廉貞清白（小注為女命之說，品格斷語，只保留原文）。 |
| `GY_A_JUMEN_07` | unclearGlyph | 論諸星同位垣・巨門 | 52 | 疑字：〔疑字：日〕 |
| `GY_A_JUMEN_09` | unclearGlyph | 論諸星同位垣・巨門 | 52 | 疑字：〔疑字：巳〕 |
| `GY_A_JUMEN_13` | historicalOnly | 論諸星同位垣・巨門 | 53 | 巨門陀羅：身上有痣（身體斷語，只保留原文）。 |
| `GY_A_JUMEN_14` | historicalOnly | 論諸星同位垣・巨門 | 53 | 巨門羊陀：疾病、品格斷語（只保留原文）。 |
| `GY_A_JUMEN_16` | historicalOnly | 論諸星同位垣・巨門 | 53 | 巨火羊陀逢惡限：死亡斷語（只保留原文）。 |
| `GY_A_JUMEN_17` | historicalOnly | 論諸星同位垣・巨門 | 53 | 巨火鈴逢惡限：死亡斷語（只保留原文）。 |
| `GY_A_JUMEN_18` | insufficientConditions | 論諸星同位垣・巨門 | 53 | 巨門天機為破蕩。與 52L「巨機居卯……至公卿」相衝突，原文未說明何種廟陷或生年為破蕩，無法落成盤面條件（小注為女命之說）。 |
| `GY_A_QISHA_02` | insufficientConditions | 論諸星同位垣・七殺 | 53 | 七殺破軍專依羊鈴。句意不明（「虛」字義難定），無法落成盤面條件。 |
| `GY_A_QISHA_03` | historicalOnly | 論諸星同位垣・七殺 | 53 | 七殺廉貞同位：死亡斷語（只保留原文）。 |
| `GY_A_QISHA_05` | historicalOnly | 論諸星同位垣・七殺 | 53 | 七殺臨身命逢流年刑忌：災傷斷語（只保留原文）。 |
| `GY_A_QISHA_06` | historicalOnly | 論諸星同位垣・七殺 | 53 | 七殺臨絕地：夭折斷語（只保留原文）。 |
| `GY_A_QISHA_07` | historicalOnly | 論諸星同位垣・七殺 | 53 | 七殺重逢四煞：傷殘、死亡斷語（只保留原文）。 |
| `GY_A_QISHA_08` | historicalOnly | 論諸星同位垣・七殺 | 53 | 七殺火羊：貧賤、屠宰斷語（只保留原文）。 |
| `GY_A_QISHA_09` | historicalOnly | 論諸星同位垣・七殺 | 53 | 七殺羊鈴流年白虎：刑戮斷語（只保留原文）。 |
| `GY_A_QISHA_10` | historicalOnly | 論諸星同位垣・七殺 | 53 | 七殺流羊官符：刑配斷語（只保留原文）。 |
| `GY_A_QISHA_11` | historicalOnly | 論諸星同位垣・七殺 | 53 | 七殺歲限擎羊：凶亡斷語（只保留原文）。 |
| `GY_A_QISHA_12` | insufficientConditions | 論諸星同位垣・七殺 | 53 | 七殺沉吟，福不榮。「沉吟」沒有盤面定義（小注另有男女之說），無法落成盤面條件。 |
| `GY_A_QISHA_13` | historicalOnly | 論諸星同位垣・七殺 | 53 | 七殺臨身：夭壽斷語（只保留原文）。 |
| `GY_A_QISHA_14` | historicalOnly | 論諸星同位垣・七殺 | 53 | 七殺單居福德之女命訣（只保留原文）。 |
| `GY_A_POJUN_02` | historicalOnly | 論諸星同位垣・破軍 | 53 | 破軍貪狼逢祿馬（品格、性別道德斷語，只保留原文）。 |
| `GY_A_POJUN_03` | historicalOnly | 論諸星同位垣・破軍 | 53 | 破軍巨門：死亡斷語（只保留原文）。 |
| `GY_A_POJUN_05` | insufficientConditions | 論諸星同位垣・破軍 | 53 | 破軍一曜性難明（小注：男女命論）。沒有盤面條件。 |
| `GY_A_POJUN_06` | historicalOnly | 論諸星同位垣・破軍 | 53 | 破軍羊鈴在官祿：貧賤斷語（只保留原文）。 |
| `GY_A_QINGYANG_01` | unclearGlyph | 論諸星同位垣・擎羊 | 53 | 疑字：〔疑字：擎〕 |
| `GY_A_QINGYANG_03` | historicalOnly | 論諸星同位垣・擎羊 | 53 | （火星）守身命：傷殘斷語（只保留原文）。 |
| `GY_A_QINGYANG_04` | historicalOnly | 論諸星同位垣・擎羊 | 53 | 擎羊子午卯酉：夭折刑傷斷語（只保留原文）。 |
| `GY_A_QINGYANG_05` | requiresChartExtension | 論諸星同位垣・擎羊 | 53 | 擎羊逢力士：難得封賞。「力士」屬博士十二神，客觀排盤沒有。 |
| `GY_A_QINGYANG_07` | historicalOnly | 論諸星同位垣・擎羊 | 53 | 羊鈴坐命逢流年白虎：災傷斷語（只保留原文）。 |
| `GY_A_QINGYANG_08` | requiresChartExtension | 論諸星同位垣・擎羊 | 53 | 擎羊對守酉宮，歲限羊陀迭併：凶。需要流年羊陀，客觀排盤沒有。 |
| `GY_A_QINGYANG_10` | historicalOnly | 論諸星同位垣・擎羊 | 53 | 羊陀流年鈴：破相斷語（身體斷語，只保留原文）。 |
| `GY_A_QINGYANG_11` | unclearGlyph | 論諸星同位垣・擎羊 | 53 | 疑字：〔疑字：擎〕〔疑字：羊〕〔疑字：火〕〔疑字：星〕〔疑字：為〕〔疑字：下〕〔疑字：格〕 |
| `GY_A_QINGYANG_12` | historicalOnly | 論諸星同位垣・擎羊 | 53 | 擎羊重逢流羊：喪身斷語（只保留原文）。 |
| `GY_A_TUOLUO_01` | historicalOnly | 論諸星同位垣・陀羅 | 53 | 陀羅巳亥寅申：夭折刑傷斷語（只保留原文）。 |
| `GY_A_KUIYUE_04` | historicalOnly | 論諸星同位垣・魁鉞 | 53 | 魁鉞逢煞：痼疾斷語（疾病斷語，只保留原文）。 |
| `GY_A_ZUOYOU_05` | historicalOnly | 論諸星同位垣・左右 | 54 | 左右單守命宮：出身斷語（只保留原文）。 |
| `GY_A_ZUOYOU_06` | historicalOnly | 論諸星同位垣・左右 | 54 | 左右廉貞擎羊：刑盜斷語（只保留原文）。 |
| `GY_A_ZUOYOU_07` | historicalOnly | 論諸星同位垣・左右 | 54 | 左右昌曲逢羊陀：身上有痣（身體斷語，只保留原文）。 |
| `GY_A_LUCUN_01` | notInterpretive | 論諸星同位垣・祿存 | 54 | 祿存在各宮皆入廟（文字疑有脫訛，屬廟旺說明，不作判讀，也不寫入廟旺表）。 |
| `GY_A_LUCUN_04` | requiresChartExtension | 論諸星同位垣・祿存 | 54 | 明祿暗祿：位至公卿。「暗祿」指六合宮之祿，目前的條件格式沒有六合關係。 |
| `GY_A_TIANMA_03` | requiresChartExtension | 論諸星同位垣・天馬 | 54 | 天馬遇空亡：終身奔走。空亡不在客觀排盤中。 |
| `GY_A_KEQUANLU_05` | unclearGlyph | 論諸星同位垣・科權祿 | 54 | 疑字：〔疑字：子〕 |
| `GY_A_KEQUANLU_09` | insufficientConditions | 論諸星同位垣・科權祿 | 54 | 祿主纏於弱地：命不主財。祿存沒有廟陷表、化祿星的「弱地」原文未定義，無法落成盤面條件。 |
| `GY_A_JIEKONG_02` | historicalOnly | 論諸星同位垣・劫空 | 54 | 劫空臨限：喪亡斷語（只保留原文）。 |
| `GY_A_SHANGSHI_01` | historicalOnly | 論諸星同位垣・傷使 | 54 | 天傷加惡曜：困厄、喪亡斷語（只保留原文；天傷亦不在客觀排盤中）。 |
| `GY_A_MINGGONG_03` | historicalOnly | 論諸星同位垣・命宮 | 54 | 命無正曜：過繼、出身斷語（只保留原文）。 |
| `GY_A_MINGGONG_06` | unclearGlyph | 論諸星同位垣・命宮 | 54 | 疑字：〔疑字：莫〕 |
| `GY_A_MINGGONG_07` | insufficientConditions | 論諸星同位垣・命宮 | 54 | 命衰運弱：如嫩草遭霜。「命衰」「運弱」沒有盤面定義（小注另有刑傷死斷語）。 |
| `GY_A_SHENGONG_01` | requiresChartExtension | 論諸星同位垣・身宮 | 54 | 三夾身凶、六夾身吉。需要身宮位置，客觀排盤沒有。 |
| `GY_A_SHENGONG_02` | requiresChartExtension | 論諸星同位垣・身宮 | 54 | 身命俱吉：富貴雙全。需要身宮位置。 |
| `GY_A_SHENGONG_03` | requiresChartExtension | 論諸星同位垣・身宮 | 54 | 身吉命凶亦為美。需要身宮位置。 |
| `GY_A_SHENGONG_04` | requiresChartExtension | 論諸星同位垣・身宮 | 54 | 命弱身強：財源不聚。需要身宮位置。 |
| `GY_A_SHENGONG_05` | requiresChartExtension | 論諸星同位垣・身宮 | 54 | 貪武守身無吉：反不為良。需要身宮位置。 |
| `GY_A_NAYIN_01` | requiresChartExtension | 論諸星同位垣・納音 | 54 | 看納音墓庫在何宮。需要納音五行，客觀排盤沒有。 |
| `GY_A_NAYIN_02` | requiresChartExtension | 論諸星同位垣・納音 | 54 | 生逢敗地：發也虛花。需要納音五行長生十二位。 |
| `GY_A_NAYIN_03` | requiresChartExtension | 論諸星同位垣・納音 | 55 | 絕處逢生：花而不敗。需要納音五行長生十二位。 |
| `GY_A_CAIZHAI_01` | unclearGlyph | 論諸星同位垣・財宅 | 55 | 疑字：〔疑字：賊〕 |
| `PEND_GY_STAR_TABLE_48_55` | ocrOnly | 星曜／運限條件表（PDF p48–55） | 48 | 只以機器 OCR 定位，未逐字核對。 |
| `PEND_JW_WENDA` | secondaryLowResolution | 集文版・十四主星問答（PDF p105–113） | 105 | 與《全書》卷一〈諸星問答論〉平行；集文版掃描原生解析度約 150 dpi、二值化，多數字無法逐字確認，只記大意，不建立異文。 |
| `PEND_GY_OCR_P17_55` | ocrOnly | 來源包機器 OCR（p17–p55，SHA-256 7d90f2f3…226a） | 17 | 低信度導航稿：禁止作 originalText、禁止 exact citation、禁止評分。 |

## 來源衝突：0 筆（集文版平行段落掃描不足以逐字比對，未建立異文或衝突）
