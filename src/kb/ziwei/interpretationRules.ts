/** 紫微判讀規則登錄。
 *
 *  目前狀態：《紫微斗數全書》原文尚未匯入，所有規則都是 pendingVerification 的「待校驗條目」：
 *  只記錄要依哪一段古籍建立什麼規則；條件（condition）、古籍原則、判讀與生活因素都保持空白，
 *  enabled＝false，不會觸發，也不進入建議或計分。原文匯入並逐字校驗後，才逐條補上內容並啟用。
 *  不依一般網路口訣或記憶建立規則。 */
import type { SourceConflict } from "@/core/ziwei/interp/citation";
import type { ZiweiInterpretationRule, ZiweiPatternRule } from "@/core/ziwei/interp/rules";
import { MAJOR, PALACES } from "@/core/ziwei/common";
import { PALACE_SEMANTICS } from "./semantics";
import { palaceCode, starCode } from "./sources";

export const ZIWEI_INTERP_RULES_VERSION = "0.1.0";

const SCHOOL = "《紫微斗數全書》";
const todo = (r: Pick<ZiweiInterpretationRule, "ruleId" | "kind" | "title" | "topics" | "timeLayer" | "role" | "citations" | "appImplementation">): ZiweiInterpretationRule => ({
  ...r, condition: null, classicalPrinciple: null, interpretation: null, lifeFactors: [],
  verificationStatus: "pendingVerification", confidence: "low", school: SCHOOL, enabled: false,
});

export const ZIWEI_INTERPRETATION_RULES: ZiweiInterpretationRule[] = [
  ...MAJOR.map(star => todo({
    ruleId: `ZW_STAR_${starCode(star)}_NATURE`, kind: "star", title: `${star}：基本性質與成立條件`,
    topics: ["general"], timeLayer: "natal", role: "baseNatalMeaning", citations: [`CIT_QS_STAR_${starCode(star)}`],
    appImplementation: `待原文匯入後，依《紫微斗數全書》「諸星問答論」${star}條整理：核心性質、有利與失衡表現、宮位語境、三方四正與四化後的變化；只收錄原文明確寫出的內容。`,
  })),
  ...PALACES.map(p => todo({
    ruleId: `ZW_PALACE_${palaceCode(p)}_MEANING`, kind: "palace", title: `${p}：古典語義`,
    topics: PALACE_SEMANTICS.find(x => x.name === p)!.relatedTopics, timeLayer: "natal", role: "baseNatalMeaning",
    citations: [`CIT_QS_PALACE_${palaceCode(p)}`],
    appImplementation: `待原文匯入後，依《紫微斗數全書》十二宮相關論述整理「${p}」的古典語義與判讀範圍。`,
  })),
  todo({
    ruleId: "ZW_PERIOD_DAXIAN_PRINCIPLE", kind: "period", title: "大限：判讀原則", topics: ["general"], timeLayer: "decade", role: "periodModifier",
    citations: ["CIT_QS_PERIOD_DAXIAN"], appImplementation: "待原文匯入後，整理大限判讀原則；大限只作本命的修正（periodModifier），不推翻本命。",
  }),
  todo({
    ruleId: "ZW_PERIOD_ANNUAL_PRINCIPLE", kind: "period", title: "太歲／流年：判讀原則", topics: ["general"], timeLayer: "annual", role: "annualModifier",
    citations: ["CIT_QS_PERIOD_TAISUI"], appImplementation: "待原文匯入後，整理太歲、流年判讀原則；流年只作修正（annualModifier），單一流年四化不推翻整張本命盤。",
  }),
];

/** 格局規則：只有找到明確古籍來源並逐字校驗後才加入；目前原文未匯入，尚無任何格局規則（不依網路常見名稱實作）。 */
export const ZIWEI_PATTERN_RULES: ZiweiPatternRule[] = [];

/** 來源衝突清單：目前只有一個 Tier 1 來源的定位資料、沒有任何已匯入原文，尚無衝突。 */
export const ZIWEI_SOURCE_CONFLICTS: SourceConflict[] = [];
