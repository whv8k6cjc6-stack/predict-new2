/** 紫微斗數來源登錄（ClassicalSourceRegistry）與引用（ClassicalCitation）。
 *
 *  來源優先級：Tier 1《紫微斗數全書》＞ Tier 2 其他可靠古籍（《紫微斗數捷覽》《紫微斗數全集》）＞ Tier 3 可信現代研究（未指定）
 *  ＞ Tier 4 軟體資料（iztro，只作排盤相容性）＞ Tier 5 一般網路文章（不可單獨成為正式判讀規則的依據）。
 *
 *  目前使用的原文：使用者提供的《紫微斗數全書》廣益版掃描 PDF（無文字層，SHA-256 鎖定版本）。
 *  PDF 影像為 Source of Truth：每條引用的 originalText 都是依 PDF 頁面影像逐字核對的連續字串
 *  （src/data/classics/ziwei/quanshu-guangyi/transcription.json），並保存 PDF 頁碼、版心頁碼、卷、篇、條目、核對者與日期。
 *  modernTranslation 是白話翻譯（只在專業模式的原文層顯示），不是 App 判讀，也不是建議。 */
import type { ClassicalCitation, ClassicalSource } from "@/core/ziwei/interp/citation";
import { MAJOR, PALACES } from "@/core/ziwei/common";
import { GUANGYI_SOURCE, GUANGYI_TRANSCRIPTION, scanSpan } from "./texts/imported";

export const ZIWEI_SOURCES_VERSION = "2.0.0";

export const ZIWEI_SOURCES: ClassicalSource[] = [
  {
    sourceId: GUANGYI_SOURCE.sourceId, title: "紫微斗數全書", edition: "廣益版（上海廣益書局印行，掃描影像）", tier: 1, role: "primaryClassical",
    usage: ["十四主星基本性質", "十二宮判讀", "大限、小限、太歲（流年）判讀原則", "星曜得地／失陷（待逐段核對）", "古典格局（待逐段核對）"],
    notFor: ["直接轉成現代吉凶分數", "未經影像逐字核對的段落（OCR 或初稿）"],
    availability: "使用者提供之本地掃描 PDF（86 頁，無文字層）；PDF 不放入 git，以 SHA-256 鎖定版本。",
    copyrightStatus: "publicDomain", contentStatus: "imported",
    notes: `PDF SHA-256 ${GUANGYI_SOURCE.sha256}。目前已逐字核對 ${GUANGYI_TRANSCRIPTION.spans.length} 段（卷二「一命宮」十四主星條目起首、卷三十二宮各篇起首、卷三大限與二限太歲原則）；其餘篇章尚未核對，不作判讀依據。`,
  },
  {
    sourceId: "ziwei.quanshu", title: "紫微斗數全書", edition: "維基文庫電子文本", tier: 1, role: "primaryClassical",
    usage: ["與廣益版掃描比對文字"],
    notFor: ["在未匯入前作為判讀依據"],
    availability: "公有領域電子文本；本環境的網路政策拒絕連線 zh.wikisource.org、ctext.org，未匯入。",
    copyrightStatus: "publicDomain", contentStatus: "notInRepository",
    notes: "保留 scripts/fetch-ziwei-wikisource.mjs；網路政策允許時可匯入作為另一版本比對（不繞過網路政策）。",
  },
  {
    sourceId: "ziwei.jielan", title: "紫微斗數捷覽", edition: null, tier: 2, role: "secondaryClassical",
    usage: ["版本校勘", "異文比較", "補充古典規則"],
    notFor: ["在沒有合法文本時作為判讀依據"],
    availability: "目前只有書目資料，尚無合法可用的完整文本。",
    copyrightStatus: "unknown", contentStatus: "unavailable",
    notes: "不是第一階段的必要條件；不抓取或重製受版權保護的現代點校本。日後取得合法版本或摘錄再加入校勘。",
  },
  {
    sourceId: GUANGYI_SOURCE.secondarySource.sourceId, title: "紫微斗數全集", edition: "集文版（掃描影像）", tier: 2, role: "secondaryClassical",
    usage: ["與《紫微斗數全書》廣益版比對異文", "星曜文字", "格局條件", "宮位判斷", "運限描述"],
    notFor: ["在沒有取得檔案時作為判讀依據", "靜默覆寫廣益版文字"],
    availability: `來源包 manifest 已登錄（177 頁，SHA-256 ${GUANGYI_SOURCE.secondarySource.sha256}），但本次上傳沒有這個 PDF。`,
    copyrightStatus: "unknown", contentStatus: "unavailable",
    notes: "取得檔案後逐段比對，異文記入 textualVariants 並標示採用版本；目前 0 筆異文紀錄不代表兩版相同，只代表尚未比對。",
  },
  {
    sourceId: "software.iztro", title: "iztro", edition: "2.6.1", tier: 4, role: "softwareDataset",
    usage: ["排盤位置驗證", "星曜位置驗證", "亮度表來源", "四化與安星的軟體相容性比對"],
    notFor: ["古籍來源", "紫微判讀權威", "格局原文來源", "吉凶權重來源"],
    availability: "npm 套件，MIT 授權。",
    copyrightStatus: "openSourceLicense", contentStatus: "imported",
    notes: "「與 iztro 排得一樣」只證明軟體相容，不證明任何判讀是古法唯一答案。",
  },
  {
    sourceId: "web.general", title: "一般網路文章", edition: null, tier: 5, role: "webArticle",
    usage: ["線索參考"],
    notFor: ["單獨作為正式判讀規則的依據"],
    availability: "—", copyrightStatus: "unknown", contentStatus: "unavailable",
    notes: "只有網路說法的內容一律標為 pendingVerification。",
  },
];

export const sourceOf = (id: string) => ZIWEI_SOURCES.find(s => s.sourceId === id);

const STAR_ID: Record<string, string> = {
  紫微: "ZIWEI", 天機: "TIANJI", 太陽: "TAIYANG", 武曲: "WUQU", 天同: "TIANTONG", 廉貞: "LIANZHEN", 天府: "TIANFU",
  太陰: "TAIYIN", 貪狼: "TANLANG", 巨門: "JUMEN", 天相: "TIANXIANG", 天梁: "TIANLIANG", 七殺: "QISHA", 破軍: "POJUN",
};
export const starCode = (star: string) => STAR_ID[star];
const PALACE_CODE: Record<string, string> = {
  命宮: "MING", 兄弟: "XIONGDI", 夫妻: "FUQI", 子女: "ZINV", 財帛: "CAIBO", 疾厄: "JIE", 遷移: "QIANYI", 交友: "JIAOYOU",
  官祿: "GUANLU", 田宅: "TIANZHAI", 福德: "FUDE", 父母: "FUMU",
};
export const palaceCode = (p: string) => PALACE_CODE[p];

/** 由已核對的轉錄段落建立引用；originalText 必須是該段文字的連續子字串（測試檢查） */
function scanCitation(citationId: string, spanId: string, o: { originalText?: string; modernTranslation: string; notes?: string }): ClassicalCitation {
  const sp = scanSpan(spanId);
  if (!sp) throw new Error(`找不到轉錄段落 ${spanId}`);
  const originalText = o.originalText ?? sp.text;
  return {
    citationId, sourceId: GUANGYI_SOURCE.sourceId, edition: GUANGYI_SOURCE.editionLabel, volume: sp.volume, section: sp.section, entry: sp.entry,
    locationStatus: "verifiedAgainstText", originalText, normalizedText: originalText, classicalCommentary: null,
    modernTranslation: o.modernTranslation, verificationStatus: sp.transcriptionStatus === "verified" ? "verified" : "pendingVerification",
    textualVariants: [],
    notes: [o.notes, sp.notes, "集文版尚未取得，異文未比對。"].filter(Boolean).join(" "),
    locator: { pdfPage: sp.pdfPage, printedPage: sp.printedPage, spanId },
    transcriptionStatus: sp.transcriptionStatus === "verified" ? "verified" : "transcriptionUnverified",
    verifiedBy: GUANGYI_TRANSCRIPTION.verification.verifiedBy, verifiedAt: GUANGYI_TRANSCRIPTION.verification.verifiedAt,
  };
}

/** 十四主星：卷二「一命宮」各星條目起首（該星坐命的總論） */
const STAR_CIT: Record<string, [string, string]> = {
  紫微: ["GY-P26-ZIWEI", "紫微五行屬土，兼屬南北斗，化氣為「帝座」，是官祿（職位）之主。紫微坐命的人面色紫或白而清，腰背厚實，為人忠厚老成、謙恭耿直。紫微能制七殺、壓火星鈴星；若與天府、左輔右弼、文昌文曲、太陽太陰、祿存天馬在三合宮會照，最為吉利。"],
  天機: ["GY-P26-TIANJI", "天機屬木，屬南斗，化氣為「善星」，是兄弟之主。入廟時身形高大豐滿，性子急而心地慈善，善於謀劃、多變通；與天梁會合時，善於談論兵法謀略。"],
  太陽: ["GY-P27-TAIYANG", "（太陽）兼屬南北斗，化氣為「貴」，是官祿之主。太陽入廟，相貌堂堂、體格雄壯、臉型方圓飽滿；夜間出生為陷、白天出生為廟旺；心地慈善，面色紫，樂於施捨救濟。"],
  武曲: ["GY-P27-WUQU", "武曲屬金，屬北斗，化氣為「財」，是財帛之主。武曲性格剛強果決，心直而無惡意，身形小、聲音大而度量大。"],
  天同: ["GY-P27-TIANTONG", "天同屬水，屬南斗，化氣為「福」，是福德之主。天同入廟，體態豐滿、清朗明白，仁慈耿直。"],
  廉貞: ["GY-P28-LIANZHEN", "廉貞屬火，屬北斗，化氣為「次桃花」，又稱殺星、囚星，是官祿之主。其人身材高大，眼神外露有光。"],
  天府: ["GY-P28-TIANFU", "天府屬土，屬南斗，化氣為「令星」，是財帛之主。其人臉型方圓。"],
  太陰: ["GY-P29-TAIYIN", "太陰屬水，兼屬南北斗，化氣為「富」，為母親之星、又為妻星，是田宅之主。太陰坐命，臉型方圓，心性溫和，清秀耿直而聰明。"],
  貪狼: ["GY-P29-TANLANG", "貪狼屬水，屬北斗，化氣為「桃花」殺星。貪狼入廟，身形高大豐滿；落陷時身形小、聲音大而度量大；性格變化不定，心中多所盤算，做事急快、不耐安靜。"],
  巨門: ["GY-P30-JUMEN", "巨門屬水，屬北斗，化氣為「暗」，主是非。入廟時身形高大豐滿、敦厚清秀；不入廟時身材矮小瘦削。做事進退猶疑，學得多而不精，與人不易相合，口舌是非較多。"],
  天相: ["GY-P30-TIANXIANG", "天相屬水，屬南斗，化氣為「印」，是官祿之主。其人相貌敦厚、持重清白，喜好飲食，衣食豐足。"],
  天梁: ["GY-P31-TIANLIANG", "天梁屬土，屬南斗，化氣為「蔭」，是主壽之星。其人厚重清秀，聰明耿直，心無私曲，樂於施捨救濟。"],
  七殺: ["GY-P31-QISHA", "七殺屬火金，屬南斗，是將星；遇紫微（帝星）化為權，在其他情況都以殺星論。其人眼大，性急而變化不定。"],
  破軍: ["GY-P31-POJUN", "破軍屬水，屬北斗，化氣為「耗星」，主妻子與奴僕（部屬）。身形矮短、背厚眉寬、腰身不正；性格剛強、不易與人相合、好爭強。"],
};

/** 十二宮：卷二「一命宮」、卷三「二兄弟」至「十二父母」各篇起首 */
const PALACE_CIT: Record<string, [string, string, string?]> = {
  命宮: ["GY-P26-MING-HEAD", "「一命宮」：卷二論十二宮的首篇，其下逐星列出入命（男命、女命）與入限的吉凶訣。"],
  兄弟: ["GY-P37-XIONGDI", "二、兄弟宮：紫微在此，有年長的兄長可以倚靠；與天府同宮約有三人，與天相同宮約三四人。"],
  夫妻: ["GY-P37-QIQIE", "三、妻妾宮（即夫妻宮）：紫微在此，宜晚婚、能白頭偕老，對方性情剛強；與天府同宮亦能偕老；與天相同宮，宜娶年紀較輕者。", "原書宮名作「妻妾」。"],
  子女: ["GY-P38-ZINV", "四、子女宮：看子女，先看子女宮本宮的星宿，主有幾子。"],
  財帛: ["GY-P39-CAIBO", "五、財帛宮：紫微在此，錢財豐足、倉箱充實；若加擎羊、陀羅、火星、鈴星、地空、地劫，則不旺。"],
  疾厄: ["GY-P40-JIE", "六、疾厄宮：先看命宮星曜是否落陷，是否有擎羊、陀羅、火星、鈴星、地空、地劫、化忌守照，再看疾厄宮。"],
  遷移: ["GY-P40-QIANYI", "七、遷移宮：紫微與左輔右弼同在，出外有貴人扶持而發福；與天府同宮，出入通達。"],
  交友: ["GY-P41-NUPU", "八、奴僕宮（即交友宮）：紫微在此，部屬成群而得力，旺者主生財。", "原書宮名作「奴僕」。"],
  官祿: ["GY-P42-GUANLU", "九、官祿宮：紫微廟旺，遇左輔右弼、文昌文曲、天魁天鉞……（其後論所至職位，未收入）。"],
  田宅: ["GY-P43-TIANZHAI", "十、田宅宮：紫微在此，田產茂盛，能自行置產、旺相。"],
  福德: ["GY-P43-FUDE", "十一、福德宮：紫微在此，福厚、享福安樂；與天府、天相同宮，終身獲吉。"],
  父母: ["GY-P44-FUMU-HEAD", "十二、父母宮（篇名；首句位於裝訂處、墨點多，尚未收入）。"],
};

export const ZIWEI_CITATIONS: ClassicalCitation[] = [
  ...MAJOR.map(s => scanCitation(`CIT_QS_STAR_${STAR_ID[s]}`, STAR_CIT[s][0], { modernTranslation: STAR_CIT[s][1] })),
  ...PALACES.map(p => scanCitation(`CIT_QS_PALACE_${PALACE_CODE[p]}`, PALACE_CIT[p][0], { modernTranslation: PALACE_CIT[p][1], notes: PALACE_CIT[p][2] })),
  scanCitation("CIT_QS_PERIOD_DAXIAN", "GY-P46-DAXIAN-HEAD", { modernTranslation: "「論大限十年禍福何如」：討論大限（每十年一限）的禍福如何判斷。" }),
  scanCitation("CIT_QS_PERIOD_TAISUI", "GY-P46-ERXIAN-A", {
    originalText: "須詳大限獨守吉凶何如小限獨守吉凶何如太歲獨守吉凶何如歲限俱凶則凶又看大限與小限相逢吉凶何如大限逢太歲吉凶何如小限逢太歲吉凶何如",
    modernTranslation: "必須分別詳看大限、小限、太歲各自所守的吉凶；太歲與限都凶，才論凶；再看大限與小限相逢、大限逢太歲、小限逢太歲時的吉凶如何。",
  }),
  scanCitation("CIT_QS_PERIOD_TAISUI_CLASH", "GY-P46-ERXIAN-B", { modernTranslation: "又要看太歲是否沖大限、小限，以及太歲是否沖擎羊、陀羅、七殺，然後才可以判斷吉凶。" }),
];

export const citationOf = (id: string) => ZIWEI_CITATIONS.find(c => c.citationId === id);
