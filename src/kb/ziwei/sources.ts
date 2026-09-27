/** 紫微斗數來源登錄（ClassicalSourceRegistry）與引用定位（ClassicalCitation）。
 *
 *  來源優先級：Tier 1《紫微斗數全書》＞ Tier 2 其他可靠古籍（《紫微斗數捷覽》《紫微斗數全集》）＞ Tier 3 可信現代研究（未指定）
 *  ＞ Tier 4 軟體資料（iztro，只作排盤相容性）＞ Tier 5 一般網路文章（不可單獨成為正式判讀規則的依據）。
 *
 *  目前狀態：所有古籍原文都尚未匯入本專案。引用只記錄「要去哪裡找」（篇名、條目），originalText 一律為 null，
 *  狀態為 pendingVerification；原文匯入並逐字比對成功前，任何依賴這些引用的判讀規則都不會啟用。 */
import type { ClassicalCitation, ClassicalSource } from "@/core/ziwei/interp/citation";
import { MAJOR, PALACES } from "@/core/ziwei/common";

export const ZIWEI_SOURCES_VERSION = "1.0.0";

export const ZIWEI_SOURCES: ClassicalSource[] = [
  {
    sourceId: "ziwei.quanshu", title: "紫微斗數全書", edition: null, tier: 1, role: "primaryClassical",
    usage: ["十四主星基本性質", "星曜在十二宮的基本語義", "諸星問答", "十二宮判讀", "星曜得地／失陷", "古典格局（富局、貴局、貧賤局、雜局）", "大限、太歲、流年、行限", "同垣星曜組合"],
    notFor: ["直接轉成現代吉凶分數"],
    availability: "古籍，公有領域；網路上有公有領域電子文本（例：維基文庫、中國哲學書電子化計劃）。",
    copyrightStatus: "publicDomain", contentStatus: "notInRepository",
    notes: "目前紫微判讀引擎的主要古典基準。本環境的網路政策拒絕連線 zh.wikisource.org、ctext.org，原文尚未匯入；匯入時須記錄版本與雜湊，並以逐字比對校驗每一條引用。",
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
    sourceId: "ziwei.quanji", title: "紫微斗數全集", edition: null, tier: 2, role: "secondaryClassical",
    usage: ["與《紫微斗數全書》比對異文", "星曜文字", "格局條件", "宮位判斷", "運限描述"],
    notFor: ["在沒有可靠全文時作為判讀依據"],
    availability: "目前沒有可靠全文。",
    copyrightStatus: "unknown", contentStatus: "unavailable",
    notes: "先建立資料結構，不阻塞開發。",
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

const LOCATOR_NOTE = "只登錄查找位置；卷次、篇名與條目待原文匯入後核對，不憑記憶填寫原文。";
const pointer = (citationId: string, section: string | null, entry: string | null, note = LOCATOR_NOTE): ClassicalCitation => ({
  citationId, sourceId: "ziwei.quanshu", edition: null, volume: null, section, entry, locationStatus: "unverified",
  originalText: null, normalizedText: null, classicalCommentary: null, modernTranslation: null,
  verificationStatus: "pendingVerification", textualVariants: [], notes: note,
});

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

/** 引用定位（皆為 pendingVerification） */
export const ZIWEI_CITATIONS: ClassicalCitation[] = [
  ...MAJOR.map(s => pointer(`CIT_QS_STAR_${STAR_ID[s]}`, "諸星問答論", s, `${LOCATOR_NOTE}（篇名依使用者指定之查找範例「諸星問答論・巨門條」比照登錄）`)),
  ...PALACES.map(p => pointer(`CIT_QS_PALACE_${PALACE_CODE[p]}`, null, p, "十二宮判讀；篇章位置待原文匯入後定位，不憑記憶填寫。")),
  pointer("CIT_QS_PERIOD_DAXIAN", null, "大限", "大限判讀原則；篇章位置待原文匯入後定位。"),
  pointer("CIT_QS_PERIOD_TAISUI", null, "太歲／流年", "太歲、流年判讀原則；篇章位置待原文匯入後定位。"),
];

export const citationOf = (id: string) => ZIWEI_CITATIONS.find(c => c.citationId === id);
