/** 紫微判讀規則登錄。
 *
 *  每條規則的鏈：古籍原文（已依廣益版 PDF 影像逐字核對的引用）→ classicalPrinciple（古籍原則白話）
 *  → modernSemantic（現代中性語義）→ condition（盤面成立條件）→ interpretation（App 判讀）→ lifeFactors（共用生活因素）。
 *
 *  第一批只啟用「原文明寫、條件清楚」的內容：十四主星坐命宮的基本性質（卷二「一命宮」各星條目起首）。
 *  - 只有原文明寫「為官祿主／為財帛主／化富為田宅主」或明確特質者，才產生長期傾向類生活因素（aptitude＊）；
 *  - 描述可能只限某種亮度（入廟／不入廟）、或屬每日狀態的特質，只列為候選，不啟用（見 semantics.ts 的 lifeFactorCandidates）；
 *  - 大限／流年：目前只有已校驗的判讀原則（principle），規範「本命 → 大限 → 流年」分層與「歲限俱凶則凶」，
 *    各星「入限吉凶訣」尚未核對，故沒有可執行的運限規則；
 *  - 格局：尚未核對任何格局篇章，0 條。
 *  本階段仍不產生任何紫微分數。 */
import type { SourceConflict } from "@/core/ziwei/interp/citation";
import type { ZiweiInterpretationRule, ZiweiPatternRule } from "@/core/ziwei/interp/rules";
import type { TopicId } from "@/kb/advice/topics";
import type { FactorId } from "@/core/advice/factors";
import { MAJOR } from "@/core/ziwei/common";
import { starCode } from "./sources";

export const ZIWEI_INTERP_RULES_VERSION = "1.0.0";

const SCHOOL = "《紫微斗數全書》廣益版";
const NOT_VERDICT = "這是古籍對長期傾向的描述，不是定論；實際表現要看亮度、三方四正、四化與運限。";

type StarRule = {
  topics: TopicId[]; principle: string; modern: string; interpretation: string;
  factors?: { factorId: FactorId; strength: 1 | 2 | 3 }[];
  brightness?: string[]; confidence?: "low" | "medium";
};

/** 依已校驗原文整理；interpretation 只寫中性傾向，不寫外貌、不寫吉凶定論 */
const STAR_RULES: Record<string, StarRule> = {
  紫微: {
    topics: ["general", "career"], principle: "紫微化氣為帝座，是官祿之主；其人忠厚老成、謙恭耿直。",
    modern: "與職位、承擔職責和在組織中發揮有關。",
    interpretation: "命宮有紫微：長期傾向與承擔職責、在組織中發揮有關。",
    factors: [{ factorId: "aptitudeResponsibility", strength: 2 }],
  },
  天機: {
    topics: ["general"], principle: "天機化氣為善星，是兄弟之主；入廟時性急心慈、機謀多變，與天梁會合善談兵。",
    modern: "善於謀劃、思考與變通（原文以入廟為前提）。",
    interpretation: "命宮有天機：古籍描述入廟時機謀多變、善於變通；本 App 的廟旺表來自 iztro，尚未與原書「十二宮廟旺落陷圖」核對，因此不轉成生活因素。",
  },
  太陽: {
    topics: ["general", "career"], principle: "太陽化氣為貴，是官祿之主；日生為廟旺、夜生為陷。",
    modern: "與名聲、職位相關。",
    interpretation: "命宮有太陽：長期傾向與職位、被人看見的角色有關；日生夜生（廟陷）影響很大。",
    factors: [{ factorId: "aptitudeResponsibility", strength: 2 }],
  },
  武曲: {
    topics: ["general", "wealth"], principle: "武曲化氣為財，是財帛之主；性剛果決、心直無毒。",
    modern: "與金錢和資源的經營相關；做事果決直接。",
    interpretation: "命宮有武曲：長期傾向與經營金錢、資源有關，做事果決直接。",
    factors: [{ factorId: "aptitudeResources", strength: 2 }],
  },
  天同: {
    topics: ["general"], principle: "天同化氣為福，是福德之主；入廟肥滿清明、仁慈耿直。",
    modern: "與福分、安樂與內在感受相關。",
    interpretation: "命宮有天同：古籍把它定為福德之主，與安樂、內在感受有關。App 目前只列出，不轉成生活因素。",
  },
  廉貞: {
    topics: ["general", "career"], principle: "廉貞化氣為次桃花，為殺星、囚星，是官祿之主。",
    modern: "與職位相關，同時帶有殺、囚的性質。",
    interpretation: "命宮有廉貞：古籍列為官祿之主，長期傾向與職務有關；同時帶殺、囚性質，需看同宮與會照的星。",
    factors: [{ factorId: "aptitudeResponsibility", strength: 1 }],
  },
  天府: {
    topics: ["general", "wealth"], principle: "天府化氣為令星，是財帛之主。",
    modern: "與金錢和資源的經營、守成相關。",
    interpretation: "命宮有天府：長期傾向與經營、守住金錢和資源有關。",
    factors: [{ factorId: "aptitudeResources", strength: 2 }],
  },
  太陰: {
    topics: ["general", "wealth", "property"], principle: "太陰化氣為富，為母宿、妻星，是田宅之主；心性溫和、清秀耿直聰明。",
    modern: "與財富、居所和家庭相關。",
    interpretation: "命宮有太陰：長期傾向與財富累積、居所和家庭有關。",
    factors: [{ factorId: "aptitudeResources", strength: 1 }],
  },
  貪狼: {
    topics: ["general"], principle: "貪狼化氣為桃花殺；入廟長聳肥胖，陷宮形小；性格不常、心多計較、作事急速不耐靜。",
    modern: "與慾望、人際吸引力相關；做事節奏快。",
    interpretation: "命宮有貪狼：古籍描述做事節奏快、不耐安靜；此段是否只指落陷尚未確認，App 目前只列出，不轉成生活因素。",
  },
  巨門: {
    topics: ["general"], principle: "巨門化氣為暗，主是非；不入廟時作事進退疑惑、多學少精、與人寡合、多是多非。",
    modern: "與口舌、溝通和猶豫相關。",
    interpretation: "命宮有巨門：古籍把它定為「暗」、主是非；這段描述可能只指不入廟，且要看三方會照，App 目前只列出，不轉成生活因素。",
  },
  天相: {
    topics: ["general", "career"], principle: "天相化氣為印，是官祿之主；相貌敦厚、持重清白，衣祿豐足。",
    modern: "與受託負責、印信職務相關；為人持重。",
    interpretation: "命宮有天相：長期傾向與受託負責、在組織中擔任職務有關，為人持重。",
    factors: [{ factorId: "aptitudeResponsibility", strength: 2 }],
  },
  天梁: {
    topics: ["general"], principle: "天梁化氣為蔭，主壽；厚重清秀、聰明耿直、心無私曲、好施濟。",
    modern: "與庇蔭、照顧他人相關。",
    interpretation: "命宮有天梁：古籍描述厚重耿直、樂於照顧他人。App 目前只列出，不轉成生活因素。",
  },
  七殺: {
    topics: ["general"], principle: "七殺為將星，遇紫微為權，其餘皆以殺論；性急不常。",
    modern: "屬性剛烈；與紫微同見時性質轉為權。",
    interpretation: "命宮有七殺：古籍稱將星、性急；遇紫微時性質不同，組合條件尚未實作，App 目前只列出，不轉成生活因素。",
  },
  破軍: {
    topics: ["general"], principle: "破軍化氣為耗星，主妻子奴僕；性剛寡合、爭強。",
    modern: "與耗損、變動和人際摩擦相關。",
    interpretation: "命宮有破軍：古籍描述性剛、爭強、不易與人相合；需搭配會照與運限，App 目前只列出，不轉成生活因素。",
  },
};

const starRule = (star: string): ZiweiInterpretationRule => {
  const d = STAR_RULES[star];
  return {
    ruleId: `ZW_STAR_${starCode(star)}_NATURE`, kind: "star", title: `${star}坐命：基本性質`,
    topics: d.topics, timeLayer: "natal", role: "baseNatalMeaning",
    condition: { kind: "starInPalace", star, palace: "命宮", layer: "natal", relation: "self", ...(d.brightness ? { brightness: d.brightness } : {}) },
    citations: [`CIT_QS_STAR_${starCode(star)}`],
    classicalPrinciple: d.principle,
    modernSemantic: d.modern,
    appImplementation: `依卷二「一命宮」${star}條起首：條件取「${star}在本命命宮坐守${d.brightness ? `且亮度為${d.brightness.join("、")}` : ""}」（照會不算）；`
      + (d.factors?.length ? `只把原文明寫的「${d.principle.split("；")[0]}」轉成長期傾向類生活因素，不寫外貌、不作吉凶定論。` : "原文描述有前提待確認或不宜轉成生活因素，只列出判讀。")
      + (d.brightness ? "亮度取自本 App 排盤的廟旺表（客觀盤面資料）。" : ""),
    interpretation: `${d.interpretation}${d.factors?.length ? NOT_VERDICT : ""}`,
    lifeFactors: d.factors ?? [],
    verificationStatus: "verified", confidence: d.confidence ?? "low", school: SCHOOL, enabled: true,
  };
};

export const ZIWEI_INTERPRETATION_RULES: ZiweiInterpretationRule[] = [
  ...MAJOR.map(starRule),
  {
    ruleId: "ZW_PERIOD_DAXIAN_PRINCIPLE", kind: "principle", title: "大限：十年一限，作為本命的修正層", topics: ["general"],
    timeLayer: "decade", role: "periodModifier", condition: null, citations: ["CIT_QS_PERIOD_DAXIAN", "CIT_QS_PERIOD_TAISUI"],
    classicalPrinciple: "大限以十年論禍福；須分別看大限、小限、太歲各自所守，再看彼此相逢。",
    modernSemantic: "十年的大環境只修正本命的基調，不取代本命。",
    appImplementation: "引擎把大限判讀放在 periodModifier，與本命（baseNatalMeaning）分開輸出；各星「入限吉凶訣」尚未核對，因此沒有可執行的大限規則。",
    interpretation: null, lifeFactors: [], verificationStatus: "verified", confidence: "medium", school: SCHOOL, enabled: false,
  },
  {
    ruleId: "ZW_PERIOD_ANNUAL_PRINCIPLE", kind: "principle", title: "太歲（流年）：與大限、小限合看，不單獨定吉凶", topics: ["general"],
    timeLayer: "annual", role: "annualModifier", condition: null, citations: ["CIT_QS_PERIOD_TAISUI", "CIT_QS_PERIOD_TAISUI_CLASH"],
    classicalPrinciple: "太歲與限都凶才論凶；又要看太歲是否沖大限、小限與羊陀七殺，然後才可斷吉凶。",
    modernSemantic: "單一年份的訊號要和十年大環境一起看，不能單獨推翻本命或大限。",
    appImplementation: "引擎把流年判讀放在 annualModifier，只作修正；單一流年四化不推翻整張本命盤。各星入限訣與太歲沖限的條件尚未核對，沒有可執行的流年規則。",
    interpretation: null, lifeFactors: [], verificationStatus: "verified", confidence: "medium", school: SCHOOL, enabled: false,
  },
];

/** 格局規則：格局篇章（定富局、定貴局等）尚未逐字核對，0 條（不依網路常見名稱實作）。 */
export const ZIWEI_PATTERN_RULES: ZiweiPatternRule[] = [];

/** 來源衝突：第二來源（集文版）尚未取得，尚未比對；目前 0 筆（不代表沒有異文）。 */
export const ZIWEI_SOURCE_CONFLICTS: SourceConflict[] = [];
