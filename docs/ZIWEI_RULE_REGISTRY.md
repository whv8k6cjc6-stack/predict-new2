# 紫微斗數判讀：來源與規則登錄

> 自動產生，請勿手改（判讀規則版本 1.0.0）。更新：ADVICE_DOCS_WRITE=1 npx vitest run src/tests/advice-docs.test.ts

## 來源

| Tier | 來源 | 角色 | 內容狀態 | 用途 | 不可作為 |
|---|---|---|---|---|---|
| 1 | 《紫微斗數全書》（廣益版（上海廣益書局印行，掃描影像）） | primaryClassical | imported | 十四主星基本性質、十二宮判讀、大限、小限、太歲（流年）判讀原則、星曜得地／失陷（待逐段核對）、古典格局（待逐段核對） | 直接轉成現代吉凶分數、未經影像逐字核對的段落（OCR 或初稿） |
| 1 | 《紫微斗數全書》（維基文庫電子文本） | primaryClassical | notInRepository | 與廣益版掃描比對文字 | 在未匯入前作為判讀依據 |
| 2 | 《紫微斗數捷覽》 | secondaryClassical | unavailable | 版本校勘、異文比較、補充古典規則 | 在沒有合法文本時作為判讀依據 |
| 2 | 《紫微斗數全集》（集文版（掃描影像）） | secondaryClassical | unavailable | 與《紫微斗數全書》廣益版比對異文、星曜文字、格局條件、宮位判斷、運限描述 | 在沒有取得檔案時作為判讀依據、靜默覆寫廣益版文字 |
| 4 | 《iztro》（2.6.1） | softwareDataset | imported | 排盤位置驗證、星曜位置驗證、亮度表來源、四化與安星的軟體相容性比對 | 古籍來源、紫微判讀權威、格局原文來源、吉凶權重來源 |
| 5 | 《一般網路文章》 | webArticle | unavailable | 線索參考 | 單獨作為正式判讀規則的依據 |

已匯入原文：ziwei-doushu-quanshu-guangyi-scan（廣益版，30 段已依 PDF 影像逐字核對，PDF SHA-256 cec2c444290ac70020a5ae4e20a50c07a0064783e53ff3162f90a299d7831186）

## 主題覆蓋矩陣

| 主題 | 覆蓋 | 規則 | 已校驗 | 待校驗 | 來源 |
|---|---|---|---|---|---|
| 綜合（general） | partial | 16 | 14 | 0 | ziwei-doushu-quanshu-guangyi-scan |
| 工作（career） | partial | 4 | 4 | 0 | ziwei-doushu-quanshu-guangyi-scan |
| 升遷（promotion） | none | 0 | 0 | 0 | — |
| 求職（jobSearch） | none | 0 | 0 | 0 | — |
| 轉職（jobChange） | none | 0 | 0 | 0 | — |
| 財運（wealth） | partial | 3 | 3 | 0 | ziwei-doushu-quanshu-guangyi-scan |
| 投資（investment） | none | 0 | 0 | 0 | — |
| 感情（relationship） | none | 0 | 0 | 0 | — |
| 婚姻（marriage） | none | 0 | 0 | 0 | — |
| 人際（social） | none | 0 | 0 | 0 | — |
| 健康（health） | none | 0 | 0 | 0 | — |
| 出行（travel） | none | 0 | 0 | 0 | — |
| 合作（cooperation） | none | 0 | 0 | 0 | — |
| 訴訟（lawsuit） | none | 0 | 0 | 0 | — |
| 考試（exam） | none | 0 | 0 | 0 | — |
| 不動產（property） | partial | 1 | 1 | 0 | ziwei-doushu-quanshu-guangyi-scan |
| 決策（decision） | none | 0 | 0 | 0 | — |

## 判讀規則（16 條）

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
| `ZW_PERIOD_DAXIAN_PRINCIPLE` | principle | decade | general | verified | 判讀原則：規範本命 → 大限 → 流年的分層，不單獨觸發 | CIT_QS_PERIOD_DAXIAN、CIT_QS_PERIOD_TAISUI | 大限以十年論禍福；須分別看大限、小限、太歲各自所守，再看彼此相逢。 | 十年的大環境只修正本命的基調，不取代本命。 | — |
| `ZW_PERIOD_ANNUAL_PRINCIPLE` | principle | annual | general | verified | 判讀原則：規範本命 → 大限 → 流年的分層，不單獨觸發 | CIT_QS_PERIOD_TAISUI、CIT_QS_PERIOD_TAISUI_CLASH | 太歲與限都凶才論凶；又要看太歲是否沖大限、小限與羊陀七殺，然後才可斷吉凶。 | 單一年份的訊號要和十年大環境一起看，不能單獨推翻本命或大限。 | — |

## 引用（29 筆）

| 引用 | 卷・篇・條目 | PDF 頁（版心） | 原文 | 白話翻譯 | 狀態 | 核對 |
|---|---|---|---|---|---|---|
| `CIT_QS_STAR_ZIWEI` | 卷二・一命宮・紫微 | p26（24） | 紫微土南北斗化帝座為官祿主紫微面紫色或白清腰背肥滿為人忠厚老成謙恭耿直其威制七殺降火鈴若與府左右昌曲日月祿馬三合極吉 | 紫微五行屬土，兼屬南北斗，化氣為「帝座」，是官祿（職位）之主。紫微坐命的人面色紫或白而清，腰背厚實，為人忠厚老成、謙恭耿直。紫微能制七殺、壓火星鈴星；若與天府、左輔右弼、文昌文曲、太陽太陰、祿存天馬在三合宮會照，最為吉利。 | verified | Claude Code（AI 目視比對，非人工校對） 2026-09-27 |
| `CIT_QS_STAR_TIANJI` | 卷二・一命宮・天機 | p26（24） | 天機屬木南斗化善星為兄弟主入廟身長肥胖性急心慈機謀多變與天梁會合善談兵 | 天機屬木，屬南斗，化氣為「善星」，是兄弟之主。入廟時身形高大豐滿，性子急而心地慈善，善於謀劃、多變通；與天梁會合時，善於談論兵法謀略。 | verified | Claude Code（AI 目視比對，非人工校對） 2026-09-27 |
| `CIT_QS_STAR_TAIYANG` | 卷二・一命宮・太陽 | p27（25） | 南北斗化貴為官祿主太陽入廟形貌堂堂雄壯面方圓滿夜生陷日生廟旺心慈面紫色好施濟 | （太陽）兼屬南北斗，化氣為「貴」，是官祿之主。太陽入廟，相貌堂堂、體格雄壯、臉型方圓飽滿；夜間出生為陷、白天出生為廟旺；心地慈善，面色紫，樂於施捨救濟。 | verified | Claude Code（AI 目視比對，非人工校對） 2026-09-27 |
| `CIT_QS_STAR_WUQU` | 卷二・一命宮・武曲 | p27（25） | 武曲金北斗化財為財帛主武曲性剛果決心直無毒形小聲高而量大 | 武曲屬金，屬北斗，化氣為「財」，是財帛之主。武曲性格剛強果決，心直而無惡意，身形小、聲音大而度量大。 | verified | Claude Code（AI 目視比對，非人工校對） 2026-09-27 |
| `CIT_QS_STAR_TIANTONG` | 卷二・一命宮・天同 | p27（25） | 天同水南斗化福為福德主天同入廟肥滿清明仁慈耿直 | 天同屬水，屬南斗，化氣為「福」，是福德之主。天同入廟，體態豐滿、清朗明白，仁慈耿直。 | verified | Claude Code（AI 目視比對，非人工校對） 2026-09-27 |
| `CIT_QS_STAR_LIANZHEN` | 卷二・一命宮・廉貞 | p28（26） | 廉貞屬火北斗化次桃花殺囚星為官祿主為人身長體大眼露神光 | 廉貞屬火，屬北斗，化氣為「次桃花」，又稱殺星、囚星，是官祿之主。其人身材高大，眼神外露有光。 | verified | Claude Code（AI 目視比對，非人工校對） 2026-09-27 |
| `CIT_QS_STAR_TIANFU` | 卷二・一命宮・天府 | p28（26） | 天府土南斗化令星為財帛主為人面方圓 | 天府屬土，屬南斗，化氣為「令星」，是財帛之主。其人臉型方圓。 | verified | Claude Code（AI 目視比對，非人工校對） 2026-09-27 |
| `CIT_QS_STAR_TAIYIN` | 卷二・一命宮・太陰 | p29（27） | 太陰水南北斗化富為母宿又為妻星為田宅主太陰面方圓心性溫和清秀耿直聰明 | 太陰屬水，兼屬南北斗，化氣為「富」，為母親之星、又為妻星，是田宅之主。太陰坐命，臉型方圓，心性溫和，清秀耿直而聰明。 | verified | Claude Code（AI 目視比對，非人工校對） 2026-09-27 |
| `CIT_QS_STAR_TANLANG` | 卷二・一命宮・貪狼 | p29（27） | 貪狼水北斗化桃花殺貪狼入廟長聳肥胖陷宮形小聲高而量大性格不常心多計較作事急速不耐靜 | 貪狼屬水，屬北斗，化氣為「桃花」殺星。貪狼入廟，身形高大豐滿；落陷時身形小、聲音大而度量大；性格變化不定，心中多所盤算，做事急快、不耐安靜。 | verified | Claude Code（AI 目視比對，非人工校對） 2026-09-27 |
| `CIT_QS_STAR_JUMEN` | 卷二・一命宮・巨門 | p30（28） | 巨門水北斗化暗主是非入廟身長肥胖敦厚清秀不入廟五短瘦小作事進退疑惑多學少精與人寡合多是多非 | 巨門屬水，屬北斗，化氣為「暗」，主是非。入廟時身形高大豐滿、敦厚清秀；不入廟時身材矮小瘦削。做事進退猶疑，學得多而不精，與人不易相合，口舌是非較多。 | verified | Claude Code（AI 目視比對，非人工校對） 2026-09-27 |
| `CIT_QS_STAR_TIANXIANG` | 卷二・一命宮・天相 | p30（28） | 天相水南斗化印為官祿主為人相貌敦厚持重清白好酒食衣祿豐足 | 天相屬水，屬南斗，化氣為「印」，是官祿之主。其人相貌敦厚、持重清白，喜好飲食，衣食豐足。 | verified | Claude Code（AI 目視比對，非人工校對） 2026-09-27 |
| `CIT_QS_STAR_TIANLIANG` | 卷二・一命宮・天梁 | p31（29） | 天梁屬土南斗化蔭主壽星厚重清秀聰明耿直心無私曲好施濟 | 天梁屬土，屬南斗，化氣為「蔭」，是主壽之星。其人厚重清秀，聰明耿直，心無私曲，樂於施捨救濟。 | verified | Claude Code（AI 目視比對，非人工校對） 2026-09-27 |
| `CIT_QS_STAR_QISHA` | 卷二・一命宮・七殺 | p31（29） | 七殺火金南斗將星遇帝為權餘宮皆殺目大性急不常 | 七殺屬火金，屬南斗，是將星；遇紫微（帝星）化為權，在其他情況都以殺星論。其人眼大，性急而變化不定。 | verified | Claude Code（AI 目視比對，非人工校對） 2026-09-27 |
| `CIT_QS_STAR_POJUN` | 卷二・一命宮・破軍 | p31（29） | 破軍水北斗化耗星主妻子奴僕形五短背厚眉寬腰斜性剛寡合爭強 | 破軍屬水，屬北斗，化氣為「耗星」，主妻子與奴僕（部屬）。身形矮短、背厚眉寬、腰身不正；性格剛強、不易與人相合、好爭強。 | verified | Claude Code（AI 目視比對，非人工校對） 2026-09-27 |
| `CIT_QS_PALACE_MING` | 卷二・一命宮・命宮 | p26（24） | 一命宮 | 「一命宮」：卷二論十二宮的首篇，其下逐星列出入命（男命、女命）與入限的吉凶訣。 | verified | Claude Code（AI 目視比對，非人工校對） 2026-09-27 |
| `CIT_QS_PALACE_XIONGDI` | 卷三・二兄弟・兄弟 | p37（35） | 二兄弟紫微有倚靠年長之兄天府同三人天相同三四人 | 二、兄弟宮：紫微在此，有年長的兄長可以倚靠；與天府同宮約有三人，與天相同宮約三四人。 | verified | Claude Code（AI 目視比對，非人工校對） 2026-09-27 |
| `CIT_QS_PALACE_FUQI` | 卷三・三妻妾・夫妻 | p37（35） | 三妻妾紫微晚聘諧老性剛天府同諧老天相同宜年少 | 三、妻妾宮（即夫妻宮）：紫微在此，宜晚婚、能白頭偕老，對方性情剛強；與天府同宮亦能偕老；與天相同宮，宜娶年紀較輕者。 | verified | Claude Code（AI 目視比對，非人工校對） 2026-09-27 |
| `CIT_QS_PALACE_ZINV` | 卷三・四子女・子女 | p38（36） | 看子女先看本宮星宿主有幾子 | 四、子女宮：看子女，先看子女宮本宮的星宿，主有幾子。 | verified | Claude Code（AI 目視比對，非人工校對） 2026-09-27 |
| `CIT_QS_PALACE_CAIBO` | 卷三・五財帛・財帛 | p39（37） | 五財帛紫微豐足倉箱加羊陀火鈴空劫不旺 | 五、財帛宮：紫微在此，錢財豐足、倉箱充實；若加擎羊、陀羅、火星、鈴星、地空、地劫，則不旺。 | verified | Claude Code（AI 目視比對，非人工校對） 2026-09-27 |
| `CIT_QS_PALACE_JIE` | 卷三・六疾厄・疾厄 | p40（38） | 六疾厄先看命宮星曜落陷加羊陀火鈴空劫化忌守照如何又看疾厄 | 六、疾厄宮：先看命宮星曜是否落陷，是否有擎羊、陀羅、火星、鈴星、地空、地劫、化忌守照，再看疾厄宮。 | verified | Claude Code（AI 目視比對，非人工校對） 2026-09-27 |
| `CIT_QS_PALACE_QIANYI` | 卷三・七遷移・遷移 | p40（38） | 七遷移紫微同左右出外貴人扶持發福天府同出入通達 | 七、遷移宮：紫微與左輔右弼同在，出外有貴人扶持而發福；與天府同宮，出入通達。 | verified | Claude Code（AI 目視比對，非人工校對） 2026-09-27 |
| `CIT_QS_PALACE_JIAOYOU` | 卷三・八奴僕・交友 | p41（39） | 八奴僕紫微成行得力旺主生財 | 八、奴僕宮（即交友宮）：紫微在此，部屬成群而得力，旺者主生財。 | verified | Claude Code（AI 目視比對，非人工校對） 2026-09-27 |
| `CIT_QS_PALACE_GUANLU` | 卷三・九官祿・官祿 | p42（40） | 九官祿紫微廟旺遇左右昌曲魁鉞 | 九、官祿宮：紫微廟旺，遇左輔右弼、文昌文曲、天魁天鉞……（其後論所至職位，未收入）。 | verified | Claude Code（AI 目視比對，非人工校對） 2026-09-27 |
| `CIT_QS_PALACE_TIANZHAI` | 卷三・十田宅・田宅 | p43（41） | 十田宅紫微茂盛自置旺相 | 十、田宅宮：紫微在此，田產茂盛，能自行置產、旺相。 | verified | Claude Code（AI 目視比對，非人工校對） 2026-09-27 |
| `CIT_QS_PALACE_FUDE` | 卷三・十一福德・福德 | p43（41） | 十一福德紫微福厚享福安樂天府天相同終身獲吉 | 十一、福德宮：紫微在此，福厚、享福安樂；與天府、天相同宮，終身獲吉。 | verified | Claude Code（AI 目視比對，非人工校對） 2026-09-27 |
| `CIT_QS_PALACE_FUMU` | 卷三・十二父母・父母 | p44（42） | 十二父母 | 十二、父母宮（篇名；首句位於裝訂處、墨點多，尚未收入）。 | verified | Claude Code（AI 目視比對，非人工校對） 2026-09-27 |
| `CIT_QS_PERIOD_DAXIAN` | 卷三・論大限十年禍福何如・大限 | p46（44） | 論大限十年禍福何如 | 「論大限十年禍福何如」：討論大限（每十年一限）的禍福如何判斷。 | verified | Claude Code（AI 目視比對，非人工校對） 2026-09-27 |
| `CIT_QS_PERIOD_TAISUI` | 卷三・論二限太歲吉凶・大限／小限／太歲 | p46（44） | 須詳大限獨守吉凶何如小限獨守吉凶何如太歲獨守吉凶何如歲限俱凶則凶又看大限與小限相逢吉凶何如大限逢太歲吉凶何如小限逢太歲吉凶何如 | 必須分別詳看大限、小限、太歲各自所守的吉凶；太歲與限都凶，才論凶；再看大限與小限相逢、大限逢太歲、小限逢太歲時的吉凶如何。 | verified | Claude Code（AI 目視比對，非人工校對） 2026-09-27 |
| `CIT_QS_PERIOD_TAISUI_CLASH` | 卷三・論二限太歲吉凶・大限／小限／太歲 | p46（44） | 又看太歲沖大限小限太歲沖羊陀七殺然後可斷吉凶 | 又要看太歲是否沖大限、小限，以及太歲是否沖擎羊、陀羅、七殺，然後才可以判斷吉凶。 | verified | Claude Code（AI 目視比對，非人工校對） 2026-09-27 |

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

## 格局規則：0 條（格局篇章尚未逐字核對）

## 來源衝突：0 筆（第二來源集文版尚未取得，尚未比對）
