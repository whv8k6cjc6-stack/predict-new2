/** 十二宮與十四主星的語義登錄資料。
 *  - classical／星曜語義欄位：只寫已依《紫微斗數全書》廣益版 PDF 影像逐字核對的段落所支持的內容（引用見 sources.ts）；
 *    原文沒有寫到、或尚未核對的欄位維持 null／pendingVerification，不依記憶或網路說法補寫。
 *  - 宮位 modernMeaning：App 依宮名字義整理的現代用途範圍（標為 palaceNameLiteral），用來決定主題取哪些宮，不是吉凶判讀。
 *  - 三方四正（combineWith）由十二宮固定排列推得，屬客觀結構。 */
import type { TopicId } from "@/kb/advice/topics";
import { MAJOR, PALACES, type PalaceName } from "@/core/ziwei/common";
import { MAIN_STARS } from "@/core/ziwei/stars";
import type { LifeFactorCandidate, PalaceSemantic, SourcedField, StarSemantic } from "@/core/ziwei/interp/semantics";
import { palaceCode, starCode } from "./sources";

const pending = (citationIds: string[]): SourcedField => ({ text: null, citationIds, status: "pendingVerification" });
const verified = (text: string | null, citationIds: string[]): SourcedField => text ? { text, citationIds, status: "verified" } : pending(citationIds);
const at = (i: number) => PALACES[((i % 12) + 12) % 12];

const MODERN: Record<PalaceName, { text: string; topics: TopicId[]; scope: string }> = {
  命宮: { text: "本人的整體狀態與基本傾向", topics: ["general", "decision"], scope: "看整體基調時的出發點，所有主題都要參照" },
  兄弟: { text: "兄弟姊妹、同輩與平輩往來", topics: ["social", "cooperation"], scope: "同輩互動與平輩合作" },
  夫妻: { text: "伴侶與婚姻關係", topics: ["relationship", "marriage"], scope: "感情、伴侶互動與婚姻安排" },
  子女: { text: "子女與晚輩", topics: ["general"], scope: "子女、晚輩相關事務" },
  財帛: { text: "金錢的收入與支出", topics: ["wealth", "investment"], scope: "收入、支出與金錢往來的狀態" },
  疾厄: { text: "身體狀況（只作生活作息提醒）", topics: ["health"], scope: "作息與身心狀態的提醒；不作任何疾病判斷" },
  遷移: { text: "外出、移動與在外的環境", topics: ["travel", "jobChange"], scope: "出行、外派、環境變動" },
  交友: { text: "朋友、同事與往來對象", topics: ["social", "cooperation"], scope: "人際往來與合作對象" },
  官祿: { text: "工作、職務與事業", topics: ["career", "promotion", "jobSearch", "jobChange"], scope: "工作、職務與事業發展" },
  田宅: { text: "住所、不動產與家庭環境", topics: ["property"], scope: "居住、不動產與家庭環境" },
  福德: { text: "精神生活、興趣與內在感受", topics: ["health", "general"], scope: "心情、休閒與內在狀態" },
  父母: { text: "父母、長輩與上級", topics: ["general", "promotion"], scope: "與父母、長輩、上級的關係" },
};

/** 古典語義：依各篇起首（已校驗）整理的篇旨；原文見引用 CIT_QS_PALACE_＊ */
const CLASSICAL: Record<PalaceName, { name: string; meaning: string }> = {
  命宮: { name: "命宮", meaning: "卷二十二宮首篇；各星坐命的總論與入命吉凶訣都列在此篇之下" },
  兄弟: { name: "兄弟", meaning: "逐星論兄弟的有無、人數與可否倚靠" },
  夫妻: { name: "妻妾", meaning: "逐星論婚配的早晚、能否偕老與對方性情" },
  子女: { name: "子女", meaning: "論子女時先看子女宮本宮的星宿" },
  財帛: { name: "財帛", meaning: "逐星論錢財是否豐足，並說明會照煞星時轉為不旺" },
  疾厄: { name: "疾厄", meaning: "先看命宮星曜的廟陷與煞忌守照，再看疾厄宮本身" },
  遷移: { name: "遷移", meaning: "逐星論出外是否有人扶持、出入是否通達" },
  交友: { name: "奴僕", meaning: "逐星論部屬與往來對象是否得力" },
  官祿: { name: "官祿", meaning: "逐星論職位與功名，並看會照的輔星" },
  田宅: { name: "田宅", meaning: "逐星論田產能否自置與守成" },
  福德: { name: "福德", meaning: "逐星論享福安樂與否" },
  父母: { name: "父母", meaning: "（篇名已校驗；篇旨待首句核對）" },
};

export const PALACE_SEMANTICS: PalaceSemantic[] = PALACES.map((name, i) => {
  const m = MODERN[name];
  const cit = [`CIT_QS_PALACE_${palaceCode(name)}`];
  return {
    palaceId: palaceCode(name), name, classicalName: CLASSICAL[name].name,
    classicalMeaning: name === "父母" ? pending(cit) : verified(CLASSICAL[name].meaning, cit),
    modernMeaning: { text: m.text, basis: "palaceNameLiteral" },
    relatedTopics: m.topics,
    interpretationScope: m.scope,
    combineWith: { opposite: at(i + 6), trines: [at(i + 4), at(i + 8)] },
    classicalSources: ["ziwei.quanshu"],
    caveats: [
      `判讀「${name}」相關問題不能只看本宮，須搭配對宮${at(i + 6)}、三合宮${at(i + 4)}與${at(i + 8)}，以及命宮、四化與運限。`,
      "三方照會的星曜不等於本宮坐守的星曜。",
      "現代用途範圍是 App 依宮名字義整理；古典語義只寫已校驗篇章的篇旨，逐星細節尚未轉成規則。",
      ...(CLASSICAL[name].name !== name ? [`原書宮名作「${CLASSICAL[name].name}」，本 App 稱「${name}」。`] : []),
      ...(name === "疾厄" ? ["原書疾厄篇先看命宮再看疾厄宮；本 App 對此宮只作生活作息提醒，不診斷、不預測疾病，健康問題以醫師判斷為準。"] : []),
    ],
  };
});

type StarData = {
  core: string; favorable?: string; challenging?: string; conditional?: string; combination?: string;
  modern: string; candidates: LifeFactorCandidate[];
};
const C = (factorId: LifeFactorCandidate["factorId"], basis: string, enabled: boolean, reason: string): LifeFactorCandidate => ({ factorId, basis, enabled, reason });
const ON = "原文明寫、無附加條件，已由判讀規則啟用（只作長期傾向）";

/** 依卷二「一命宮」各星條目起首（已校驗）整理；未寫到的欄位維持待校驗 */
const STAR_DATA: Record<string, StarData> = {
  紫微: {
    core: "化帝座，為官祿主", favorable: "為人忠厚老成、謙恭耿直", conditional: "與天府、左右、昌曲、日月、祿馬三合會照為極吉",
    combination: "能制七殺、降火星鈴星", modern: "與職位、承擔職責相關；吉的程度要看三方會照哪些星。",
    candidates: [C("aptitudeResponsibility", "為官祿主", true, ON)],
  },
  天機: {
    core: "化善星，為兄弟主", favorable: "入廟時性急心慈、機謀多變", conditional: "入廟時身長肥胖（原文以入廟為前提）",
    combination: "與天梁會合善談兵", modern: "善於謀劃與變通；原文把這些描述放在入廟之後。",
    candidates: [C("aptitudeStudy", "入廟……機謀多變", false, "原文以入廟為前提；本 App 的廟旺表來自 iztro（軟體資料），尚未與原書「十二宮廟旺落陷圖」核對，暫不啟用")],
  },
  太陽: {
    core: "化貴，為官祿主", favorable: "入廟形貌堂堂；心慈好施濟", conditional: "夜生為陷、日生為廟旺；入廟時形貌堂堂",
    modern: "與名聲、職位相關；日生夜生（廟陷）影響很大。",
    candidates: [C("aptitudeResponsibility", "化貴為官祿主", true, ON)],
  },
  武曲: {
    core: "化財，為財帛主", favorable: "性剛果決、心直無毒", modern: "與金錢、資源的經營相關；做事果決直接。",
    candidates: [C("aptitudeResources", "化財為財帛主", true, ON), C("decisionClarity", "性剛果決", false, "屬每日狀態因素，不適合由本命長期特質直接產生")],
  },
  天同: {
    core: "化福，為福德主", favorable: "入廟肥滿清明、仁慈耿直", conditional: "以上描述以入廟為前提",
    modern: "與福分、安樂與內在感受相關。", candidates: [],
  },
  廉貞: {
    core: "化次桃花，為殺星、囚星，為官祿主", modern: "與職位相關，同時帶有「殺、囚」的性質，需看同宮與會照的星。",
    candidates: [C("aptitudeResponsibility", "為官祿主", true, "原文明寫為官祿主，已啟用（強度較低，因同時為殺星、囚星）")],
  },
  天府: {
    core: "化令星，為財帛主", modern: "與金錢、資源的經營與守成相關。",
    candidates: [C("aptitudeResources", "化令星為財帛主", true, ON)],
  },
  太陰: {
    core: "化富，為母宿、妻星，為田宅主", favorable: "心性溫和、清秀耿直聰明", modern: "與財富、居所、家庭相關。",
    candidates: [C("aptitudeResources", "化富……為田宅主", true, "原文明寫化富、為田宅主，已啟用（強度較低）")],
  },
  貪狼: {
    core: "化桃花殺", challenging: "性格不常、心多計較、作事急速不耐靜", conditional: "入廟長聳肥胖；陷宮形小、聲高而量大（後段描述可能只指陷宮）",
    modern: "與慾望、人際吸引力相關；做事節奏快。",
    candidates: [C("impulsivityRisk", "作事急速不耐靜", false, "原文此段接在「陷宮」之後，是否只指落陷尚未確認；也不宜把本命特質直接當成每日風險")],
  },
  巨門: {
    core: "化暗，主是非", challenging: "作事進退疑惑、多學少精、與人寡合、多是多非", conditional: "入廟身長肥胖、敦厚清秀；不入廟五短瘦小（後段描述可能只指不入廟）",
    modern: "與口舌、溝通與猶豫相關。",
    candidates: [
      C("communicationMisunderstandingRisk", "化暗主是非……多是多非", false, "原文後段接在「不入廟」之後，範圍待確認；且需看三方會照，暫不啟用"),
      C("decisionUncertainty", "作事進退疑惑", false, "原文後段接在「不入廟」之後，範圍待確認；也不宜把本命特質直接當成每日判斷風險"),
    ],
  },
  天相: {
    core: "化印，為官祿主", favorable: "相貌敦厚、持重清白，衣祿豐足", modern: "與職位、印信（受託負責）相關；為人持重。",
    candidates: [C("aptitudeResponsibility", "化印為官祿主", true, ON)],
  },
  天梁: {
    core: "化蔭，主壽星", favorable: "厚重清秀、聰明耿直、心無私曲、好施濟", modern: "與庇蔭、照顧他人相關。", candidates: [],
  },
  七殺: {
    core: "將星", challenging: "目大、性急不常", conditional: "遇帝（紫微）為權，其餘宮位皆以殺論", combination: "遇紫微化為權",
    modern: "將星，屬性剛烈；與紫微同見時性質轉為權。",
    candidates: [C("impulsivityRisk", "性急不常", false, "本命特質不宜直接當成每日風險；是否遇紫微會改變性質，需先實作組合條件")],
  },
  破軍: {
    core: "化耗星，主妻子奴僕", challenging: "性剛寡合、爭強", modern: "與耗損、變動與人際摩擦相關。",
    candidates: [C("cooperationFriction", "性剛寡合爭強", false, "本命特質不宜直接當成每日合作風險，需搭配運限與會照星")],
  },
};

export const STAR_SEMANTICS: StarSemantic[] = MAJOR.map(star => {
  const cit = [`CIT_QS_STAR_${starCode(star)}`];
  const d = STAR_DATA[star];
  return {
    star, starCode: starCode(star),
    placementGroup: MAIN_STARS.find(s => s.name === star)!.system,
    coreThemes: verified(d.core, cit),
    favorableExpressions: verified(d.favorable ?? null, cit),
    challengingExpressions: verified(d.challenging ?? null, cit),
    conditionalFactors: verified(d.conditional ?? null, cit),
    palaceDependencies: ["所在宮位（本規則只用坐命宮）", "命宮三方四正：對宮遷移、三合官祿與財帛", "亮度（廟旺落陷）", "四化（生年、大限、流年分開）"],
    combinationDependencies: verified(d.combination ?? null, cit),
    classicalCitations: cit,
    modernExplanation: d.modern,
    lifeFactorCandidates: d.candidates,
    verificationStatus: "verified",
    sources: ["ziwei-doushu-quanshu-guangyi-scan"], school: "《紫微斗數全書》廣益版", confidence: "low",
    limitations: [
      "核心性質不等於對使用者的人格定論。",
      "星曜意義必須搭配所在宮位、亮度、三方四正、四化與吉煞同宮一起判讀，不可單獨下結論。",
      "不使用「某星＝某性格關鍵字」的簡化對照。",
      "目前只核對各星坐命條目的起首；入男命、入女命、入限各訣與歌訣尚未核對，不作判讀依據。",
      "原書對外貌的描述只保留在原文層，不作任何判讀。",
    ],
  };
});

export const palaceSemantic = (p: PalaceName) => PALACE_SEMANTICS.find(x => x.name === p)!;
export const starSemantic = (s: string) => STAR_SEMANTICS.find(x => x.star === s);
