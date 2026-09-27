/** 卷一格局（PDF p17–p20）：「論某某格」、定人富貴貧賤諸論、十二宮諸星得地合格訣、定富局／定貴局／定貧賤局／定雜局。
 *  - 原文有明確成立條件（星、宮、夾、三方、亮度、生年）→ PatternRule（kind＝combination），可啟用；
 *  - 只有格名或「見前註解」、條件需要客觀排盤沒有的資料（空亡、三台八座、出生時辰年月日組合）→ PatternCandidate（不啟用）。
 *  - 富局 → 富、貴局 → 貴、貧賤局 → 困（古籍「貧賤」不直接顯示）、雜局 → 大限修正。 */
import type { ZiweiCondition } from "@/core/ziwei/interp/rules";
import type { ClauseSpec, OutcomeKey, PendingReason } from "../dsl";
import { ALL, ANY, ANYIN, FLANK, GOODHUA, HUA, IN, LUCKY, NOT, SHA, SOLE, STEM } from "../dsl";

export interface PatternMeta { name: string; group: "定富局" | "定貴局" | "定貧賤局" | "定雜局" | "論格" | "合格訣"; requiredStars: string[]; supportingStars?: string[]; breaking?: ZiweiCondition[]; rescue?: ZiweiCondition[] }
export type PatternSpec = ClauseSpec & { pattern: PatternMeta };

function pat(id: string, leaf: string, group: PatternMeta["group"], name: string, quote: string, translation: string, when: ZiweiCondition | null, outs: OutcomeKey[],
  meta: Omit<PatternMeta, "name" | "group">, o: Partial<ClauseSpec> = {}): PatternSpec {
  return { id: `GY_PAT_${id}`, leaf, section: `卷一・${group === "論格" || group === "合格訣" ? name : `${group}・${name}`}`, quote, translation, title: o.title ?? `格局：${name}`,
    kind: "combination", layer: o.layer ?? "natal", when, outcomes: outs, confidence: "low", ...o, pattern: { name, group, ...meta } };
}
/** 只有格名或條件不足：PatternCandidate */
function cand(id: string, leaf: string, group: PatternMeta["group"], name: string, quote: string, reason: PendingReason, why: string): PatternSpec {
  return pat(id, leaf, group, name, quote, `${name}：${why}`, null, [], { requiredStars: [] }, { pendingReason: reason });
}
const SF = (stars: string[]) => ANYIN(stars, "命宮", { relation: "sanfang" });

export const PATTERN_CLAUSES: PatternSpec[] = [
  // ───────── 論某某格（17R、17L） ─────────
  pat("TAIYANG_WENCHANG_GUANLU", "17R", "論格", "太陽會文昌於官祿", "太陽會文昌於官祿皇殿首班之貴", "太陽與文昌同在官祿宮（逢吉曜）：貴顯。", ALL(IN("太陽", "官祿"), IN("文昌", "官祿")), ["官貴"], { requiredStars: ["太陽", "文昌"] }),
  pat("LUCUN_TIANCAI", "17R", "論格", "祿存守於田財", "祿存守於田財則堆金積玉", "祿存守田宅或財帛：大富。", ANY(IN("祿存", "田宅"), IN("祿存", "財帛")), ["財旺"], { requiredStars: ["祿存"] }),
  pat("CAIYIN_QIANYI", "17R", "論格", "財蔭坐于遷移", "坐于遷移必巨商高賈", "武曲或天梁（其一化權）坐遷移：宜經商。", ALL(ANY(IN("武曲", "遷移"), IN("天梁", "遷移")), ANY(HUA("權", "遷移", "natal", "self", "武曲"), HUA("權", "遷移", "natal", "self", "天梁"))), ["遷財"],
    { requiredStars: ["武曲", "天梁"] }, { anchor: "坐于遷移必巨商高賈財即武曲" }),
  pat("DUIMIAN_CHAODOU", "17R", "論格", "對面朝斗格", "論對面朝斗格子午宮逢祿存是也", "命在子午，遷移（對面）有祿存：利祿、受人敬重。", ALL(IN("祿存", "命宮", { relation: "opposite", branches: "子午" })), ["富"], { requiredStars: ["祿存"] }),
  pat("KEQUANLU", "17R", "論格", "科權祿主格", "詩曰祿權周勃逢命中入相王朝贊聖功", "化祿、化權在命：貴顯。", ALL(HUA("祿", "命宮"), HUA("權", "命宮")), ["貴"], { requiredStars: [] }),
  pat("ZUOYOU_CHAOYUAN", "17R", "論格", "左右朝垣格", "天星左右最高明若在三方祿位興", "左輔、右弼在命宮三方，又有祿：興旺。", ALL(IN("左輔", "命宮", { relation: "sanfang" }), IN("右弼", "命宮", { relation: "sanfang" }), ANY(HUA("祿", "命宮", "natal", "sanfang"), SF(["祿存"]))), ["貴"], { requiredStars: ["左輔", "右弼"] }),
  pat("JIANWENWU", "17R", "論格", "兼文武格", "論兼文武格文曲武曲在身命是也", "文曲、武曲在命宮（命宮無煞破）：文武兼備、百事通達。", ALL(IN("文曲"), IN("武曲"), NOT(SHA("命宮", "natal", "self"))), ["貴", "聰明"], { requiredStars: ["文曲", "武曲"] }),
  pat("WENXING_CHAOMING", "17R", "論格", "文星朝命格", "詩曰文昌文曲最榮華值此須", "文昌、文曲朝命（三方祥曜拱）：富貴。", ALL(SF(["文昌"]), SF(["文曲"])), ["富", "貴"], { requiredStars: ["文昌", "文曲"] }),
  pat("SHIZHONG_YINYU", "17L", "論格", "石中隱玉格", "論石中隱玉格命在子午逢巨門是也", "巨門在子午坐命，三方有化科、化祿：貴。", ALL(IN("巨門", "命宮", { branches: "子午" }), ANY(HUA("科", "命宮", "natal", "sanfang"), HUA("祿", "命宮", "natal", "sanfang"))), ["貴"], { requiredStars: ["巨門"] }),
  pat("HUOTAN", "17L", "論格", "火貪格", "論貪狼遇火名為火格三合照身命是也", "貪狼遇火星於命宮三合（三方無凶煞）：富貴。", ALL(IN("貪狼", "命宮", { relation: "sanfang" }), IN("火星", "命宮", { relation: "sanfang" }), NOT(ANYIN(["擎羊", "陀羅", "地空", "地劫"], "命宮", { relation: "sanfang" }))), ["貴"], { requiredStars: ["貪狼", "火星"] }),
  pat("SHANGGU_AN", "17L", "論格", "商賈之命（安分）", "如人命有巨日紫府守照為人安分", "命有巨門、太陽、紫微、天府守照：為人安分耿直（非商賈之命）。", ANY(ALL(IN("巨門"), SF(["太陽"])), ALL(IN("紫微"), SF(["天府"]))), [], { requiredStars: [] }, { custom: { modern: "做事務實、按部就班", factors: [["executionClarity", 1]], topics: ["general", "career"] } }),
  pat("SHANGGU", "17L", "論格", "商賈之命", "如值月貪同殺忌心多機關貪財無厭", "太陰、貪狼同殺忌會命：擅於謀利（原文另有「貪財無厭」的品格斷語，不採用）。", ALL(SF(["太陰"]), SF(["貪狼"]), ANY(SHA(), HUA("忌", "命宮", "natal", "sanfang"))), [], { requiredStars: ["太陰", "貪狼"] },
    { custom: { modern: "較有經商謀利的傾向", factors: [["aptitudeResources", 1]], topics: ["wealth", "career"] }, omitted: "貪財無厭" }),
  pat("SHUYI", "17L", "論格", "術藝之命", "寅申巳亥安命或辰戌丑未遇有貪狼武曲在命化忌加殺必作細巧藝術之人也", "命在四馬或四墓，貪狼、武曲在命又化忌加煞：宜細巧技藝。", ALL(ANY(IN("貪狼", "命宮", { branches: "寅申巳亥辰戌丑未" }), IN("武曲", "命宮", { branches: "寅申巳亥辰戌丑未" })), HUA("忌", "命宮"), SHA()), ["巧藝"], { requiredStars: ["貪狼", "武曲"] }),
  cand("SENGDAO", "17L", "論格", "僧道之命", "論出家僧道之命紫微居卯酉遇劫空者", "historicalOnly", "出家斷語，只保留原文。"),
  cand("GUKE", "17L", "論格", "孤剋之命", "論人命內犯孤剋者如剋妻剋子剋父母", "historicalOnly", "孤剋斷語，只保留原文。"),
  cand("SHAJUEDI", "17R", "論格", "殺居絕地", "殺居絕地天年夭似顏回", "historicalOnly", "夭壽斷語，只保留原文。"),
  cand("HAOJULUWEI", "17R", "論格", "耗居祿位", "耗居祿位沿途乞食", "historicalOnly", "貧賤斷語，只保留原文。"),
  cand("HUITAN", "17R", "論格", "會貪旺宮", "會貪旺宮終身鼠竊", "historicalOnly", "品格斷語，只保留原文。"),
  cand("JIAN_JIE", "17R", "論格", "忌暗同居", "忌暗同居命宮疾厄困弱尪羸", "historicalOnly", "疾病斷語，只保留原文。"),
  cand("XINGSHA_LIANZHEN", "17R", "論格", "刑殺會廉貞於官祿", "刑殺會廉貞於官祿枷杻同流", "historicalOnly", "刑獄斷語，只保留原文。"),
  cand("GUANFU_JIA", "17R", "論格", "官府夾刑殺", "官府夾刑殺于遷移離鄉遭配", "historicalOnly", "刑獄斷語，只保留原文。"),

  // ───────── 定人諸論（18R、18L） ─────────
  pat("DING_CONGMING", "18R", "論格", "定人聰明", "詩曰文曲天相破軍星計策偏多性更靈更若三方昌曲會一生巧藝有聲名", "文曲、天相、破軍在命：計策多；三方再會昌曲：巧藝有名。", ALL(ANY(IN("文曲"), IN("天相"), IN("破軍")), SF(["文昌", "文曲"])), ["聰明", "巧藝"], { requiredStars: [] }),
  pat("DING_FUZU", "18R", "論格", "定人富足", "詩曰太陰入廟有光輝財入財鄉分外奇破耗凶星皆不犯堆金積玉富豪兒", "太陰入廟、財星入財帛，又不犯破耗凶星：富足。", ALL(IN("太陰", "命宮", { brightness: ["廟"] }), NOT(SHA())), ["財旺"], { requiredStars: ["太陰"] }),
  pat("DING_PINJIAN", "18R", "論格", "定人貧賤", "詩曰命中吉曜不來臨火忌羊陀四正侵武曲廉貞巨破會", "命中無吉星，火忌羊陀侵四正，又會武曲廉貞巨門破軍：多困（原文「暴怒身貧」不直接顯示）。",
    ALL(NOT(LUCKY()), ANY(SF(["火星", "擎羊", "陀羅"]), HUA("忌", "命宮", "natal", "sanfang")), SF(["武曲", "廉貞", "巨門", "破軍"])), ["困"], { requiredStars: [] }, { omitted: "一生暴怒又身貧", title: "格局：吉曜不臨而煞忌侵四正" }),
  cand("DING_DAOZEI", "18R", "論格", "定人作盜賊", "詩曰命逢破耗與貪貞七殺三方照及身", "historicalOnly", "品格斷語，只保留原文。"),
  cand("DING_SHOUYAO", "18R", "論格", "壽夭淫蕩", "論壽夭淫蕩", "historicalOnly", "壽夭與品格斷語，只保留原文。"),
  cand("DING_CANJI", "18R", "論格", "定人殘疾", "論定人殘疾先看命宮星落陷", "historicalOnly", "疾病斷語，只保留原文。"),
  cand("DING_POXIANG", "18R", "論格", "定人破相", "詩曰相貌之中逢殺曜更加三合又逢刑", "historicalOnly", "身體斷語，只保留原文。"),
  pat("WUZHI", "18L", "論格", "武職論", "武職論如武曲七殺坐命廟旺宮", "武曲、七殺坐命廟旺，加化權祿及魁鉞拱照：武職。",
    ALL(ANY(IN("武曲", "命宮", { brightness: ["廟", "旺"] }), IN("七殺", "命宮", { brightness: ["廟", "旺"] })), ANY(HUA("權", "命宮", "natal", "sanfang"), HUA("祿", "命宮", "natal", "sanfang")), SF(["天魁", "天鉞"])), ["官貴"], { requiredStars: ["武曲", "七殺"] }),
  pat("FUGUI_LUN", "18L", "論格", "富貴論", "富貴論如紫微天府天相祿權科太陰太陽文昌文曲左輔右弼天魁天鉞守照拱沖主大富貴", "紫府相、祿權科、日月、昌曲、左右、魁鉞守照：大富貴（本 App 取紫府日月其一在命且三方有左右昌曲魁鉞）。",
    ALL(ANY(IN("紫微"), IN("天府"), IN("天相"), IN("太陽"), IN("太陰")), LUCKY(), GOODHUA()), ["富", "貴"], { requiredStars: [] }),
  pat("PINJIAN_LUN", "18L", "論格", "貧賤論", "貧賤論如擎羊陀羅廉貞七殺武曲破軍天空地劫忌星三方四正守照拱沖諸凶併犯陷地主貧賤", "羊陀、廉殺武破、空劫、化忌併犯三方四正且陷地：多困（「貧賤」不直接顯示）。",
    ALL(SF(["擎羊", "陀羅"]), SF(["地空", "地劫"]), HUA("忌", "命宮", "natal", "sanfang"), NOT(LUCKY())), ["困"], { requiredStars: [] }, { title: "格局：諸凶併犯三方四正" }),
  cand("XINGMING_LUN", "18L", "論格", "刑名論", "刑名論如擎羊陀羅火鈴星武曲破軍", "insufficientConditions", "主星、煞星與「上吉湊合」的組合條件不明確，另有兩輪轉錄與補轉錄讀法不一。"),
  cand("JIYAO_LUN", "18L", "論格", "疾夭論", "疾妖論如貪狼廉貞擎羊陀羅天空地劫火鈴忌星三方守照主疾殀", "historicalOnly", "疾病夭壽斷語，只保留原文。"),
  cand("SENGDAO_LUN", "18L", "論格", "僧道論", "僧道論如天機天梁七殺破軍天空地劫併犯帝座紫微", "historicalOnly", "出家斷語，只保留原文。"),
  cand("CONGMING_LUN", "18L", "論格", "聰明論", "聰明論如文昌文曲天相天府武曲破軍三台八座左輔右弼三合拱照主人聰明", "requiresChartExtension", "條件含三台、八座，本 App 客觀排盤沒有這兩顆星。"),

  // ───────── 十二宮諸星得地合格訣（18L、19R）：依命宮地支 ─────────
  cand("HEGE_ZI", "18L", "合格訣", "子宮得地合格", "子安命子宮貪狼殺陰星機梁相拱福興隆庚辛乙癸生人美", "insufficientConditions", "「貪狼殺陰星機梁相拱」所列星曜不可能同時在子宮三方成立，條件需另行考證。"),
  pat("HEGE_CHOU", "18L", "合格訣", "丑宮得地合格", "丑安命丑宮立命日月朝丙戊生人福祿饒", "命在丑宮，日月來朝（命無主星、對宮日月），丙戊年生：福祿饒。",
    ALL(ANY(IN("太陽", "命宮", { relation: "sanfang" }), IN("太陰", "命宮", { relation: "sanfang" })), IN("太陽", "命宮", { relation: "opposite", branches: "未" }), STEM("丙戊")), ["富"], { requiredStars: ["太陽", "太陰"] }),
  pat("HEGE_YIN", "18L", "合格訣", "寅宮得地合格", "寅安命寅宮巨日足豐隆", "命在寅宮，巨門、太陽坐命：豐隆。", ALL(IN("巨門", "命宮", { branches: "寅" }), IN("太陽", "命宮", { branches: "寅" })), ["富"], { requiredStars: ["巨門", "太陽"] }),
  pat("HEGE_MAO", "18L", "合格訣", "卯宮得地合格", "卯安命卯宮機巨武曲逢辛乙生人福氣隆", "命在卯宮，天機巨門（或武曲）坐命，辛乙年生：福氣隆。",
    ALL(ANY(ALL(IN("天機", "命宮", { branches: "卯" }), IN("巨門", "命宮", { branches: "卯" })), IN("武曲", "命宮", { branches: "卯" })), STEM("辛乙")), ["財官格"], { requiredStars: [] }),
  pat("HEGE_SI", "18L", "合格訣", "巳宮得地合格", "巳安命巳位天機天相臨紫府朝垣福更深戊辛壬丙皆為貴", "命在巳宮，天機或天相坐命、紫府朝垣，戊辛壬丙年生：貴。",
    ALL(ANY(IN("天機", "命宮", { branches: "巳" }), IN("天相", "命宮", { branches: "巳" })), SF(["紫微", "天府"]), STEM("戊辛壬丙")), ["貴"], { requiredStars: [] }),
  pat("HEGE_WEI", "18L", "合格訣", "未宮得地合格", "未安命未宮紫武廉貞同日月巨門喜相逢", "命在未宮，紫微、武曲、廉貞其一坐命，會日月巨門：貴。",
    ALL(ANY(IN("紫微", "命宮", { branches: "未" }), IN("武曲", "命宮", { branches: "未" }), IN("廉貞", "命宮", { branches: "未" })), SF(["太陽", "太陰", "巨門"])), ["貴"], { requiredStars: [] }),
  pat("HEGE_SHEN", "18L", "合格訣", "申宮得地合格", "申安命申宮紫帝貞梁同武曲巨門喜相逢甲庚癸人如得喜一生富貴逞英雄", "命在申宮，紫微或廉貞、天梁坐命，會武曲巨門，甲庚癸年生：富貴。",
    ALL(ANY(IN("紫微", "命宮", { branches: "申" }), IN("廉貞", "命宮", { branches: "申" }), IN("天梁", "命宮", { branches: "申" })), SF(["武曲", "巨門"]), STEM("甲庚癸")), ["富", "貴"], { requiredStars: [] }),
  pat("HEGE_YOU", "18L", "合格訣", "酉宮得地合格", "酉安命酉宮最喜太陰逢巨日又逢當面沖辛乙生人為貴格", "命在酉宮，太陰坐命、巨日對沖，辛乙年生：貴格。",
    ALL(IN("太陰", "命宮", { branches: "酉" }), STEM("辛乙")), ["貴"], { requiredStars: ["太陰"] }),
  pat("HEGE_XU", "19R", "合格訣", "戌宮得地合格", "戌安命戌宮紫微對沖辰富而不貴有虛名", "命在戌宮，對宮辰有紫微沖照：富而不貴、有虛名。", ALL(IN("紫微", "命宮", { relation: "opposite", branches: "辰" })), ["虛名"], { requiredStars: ["紫微"] }),
  pat("HEGE_HAI", "19R", "合格訣", "亥宮得地合格", "亥安命亥宮最喜太陰逢若人值此福祿隆", "命在亥宮，太陰坐命：福祿隆。", IN("太陰", "命宮", { branches: "亥" }), ["富"], { requiredStars: ["太陰"] }),
  cand("HEGE_WU", "18L", "合格訣", "午宮得地合格", "午安命午宮紫府太陽同機梁破殺喜相逢", "unclearGlyph", "後半句（生年與結果）有疑字。"),
  cand("HEGE_CHEN", "18L", "合格訣", "辰宮得地合格", "辰安命辰位機梁坐命宮天府", "unclearGlyph", "「天府□地」有疑字。"),
  pat("POGE_WU", "19R", "合格訣", "午宮失陷破格", "午安命午宮貪巨月昌侵羊刃三合最嫌沖雖然化吉居仕路橫破橫成到老窮", "命在午宮，貪狼、巨門、太陰或文昌坐命又有擎羊三合沖：起伏大（「到老窮」不直接顯示）。",
    ALL(ANY(IN("貪狼", "命宮", { branches: "午" }), IN("巨門", "命宮", { branches: "午" }), IN("太陰", "命宮", { branches: "午" }), IN("文昌", "命宮", { branches: "午" })), SF(["擎羊"])), ["橫發橫破"], { requiredStars: [] }, { omitted: "到老窮" }),
  pat("POGE_CHOUZI", "19R", "合格訣", "子丑失陷破格", "安命子午天機丑巨鈴此星落陷果為真縱然化吉更為美任他富貴不清盈", "命在子午有天機，或在丑有巨門、鈴星而落陷：縱然化吉，富貴也不清盈。",
    ANY(IN("天機", "命宮", { branches: "子午", brightness: ["陷"] }), IN("巨門", "命宮", { branches: "丑", brightness: ["陷", "不"] })), ["困"], { requiredStars: [] }),
  cand("POGE_OTHER", "19R", "合格訣", "其他失陷破格", "十二宮諸星失陷破格訣", "historicalOnly", "寅、卯辰、巳、未、申酉、戌、亥各訣主要為貧賤、夭折、奴僕娼婢等斷語，只保留原文。"),
  cand("DEDI_LUN", "19R", "合格訣", "十二宮諸星得地富貴論", "十二宮諸星得地富貴論", "insufficientConditions", "歌訣逐宮列舉星名，未分條給出完整條件（與各星「X宮Y地」條目重複者已在卷二處理）。"),

  // ───────── 定富局／定貴局／定貧賤局／定雜局（19L、20R） ─────────
  pat("FU_CAIYINJIAYIN", "19L", "定富局", "財蔭夾印", "財蔭夾印相守命武梁來夾是也", "天相守命，武曲、天梁左右來夾。", ALL(IN("天相"), FLANK("武曲", "天梁")), ["財旺"], { requiredStars: ["天相", "武曲", "天梁"] }),
  pat("FU_RIYUEJIACAI", "19L", "定富局", "日月夾財", "日月夾財武守命日月來夾是也", "武曲守命，太陽、太陰左右來夾。", ALL(IN("武曲"), FLANK("太陽", "太陰")), ["財旺"], { requiredStars: ["武曲", "太陽", "太陰"] }),
  pat("FU_CAILUJIAMA", "19L", "定富局", "財祿夾馬", "財祿夾馬馬守命武祿來夾是也", "天馬守命，武曲、祿存左右來夾。", ALL(IN("天馬"), FLANK("武曲", "祿存")), ["財旺"], { requiredStars: ["天馬", "武曲", "祿存"] }),
  pat("FU_RIYUEZHAOBI", "19L", "定富局", "日月照壁", "日月照壁日月臨田宅宮是也", "太陽、太陰同在田宅宮。", ALL(IN("太陽", "田宅"), IN("太陰", "田宅")), ["宅旺", "財足"], { requiredStars: ["太陽", "太陰"] }),
  pat("FU_JINCAN", "19L", "定富局", "金燦光輝", "金燦光輝太陽單守命在午宮是也", "太陽單守命宮在午。", ALL(SOLE("太陽"), IN("太陽", "命宮", { branches: "午" })), ["富", "貴"], { requiredStars: ["太陽"] }),
  cand("FU_YINYIN", "19L", "定富局", "陰印拱身", "印拱身身臨田宅梁相拱沖是也", "unclearGlyph", "格名首字有疑字，且條件涉及身宮落田宅，暫列候選。"),
  pat("GUI_RIYUEJIAMING", "19L", "定貴局", "日月夾命", "日月夾命不坐空亡遇逢本宮有吉星是也", "太陽、太陰夾命，本宮有吉星（空亡本 App 未排，未納入條件）。", ALL(FLANK("太陽", "太陰"), LUCKY("命宮", "natal", "self")), ["貴"], { requiredStars: ["太陽", "太陰"] }),
  pat("GUI_RICHU", "19L", "定貴局", "日出扶桑", "日出扶桑日在卯守命是也守官祿宮亦然", "太陽在卯宮守命或守官祿。", ANY(IN("太陽", "命宮", { branches: "卯" }), IN("太陽", "官祿", { branches: "卯" })), ["貴"], { requiredStars: ["太陽"] }),
  pat("GUI_YUELUO", "19L", "定貴局", "月落亥宮", "月落亥宮月在亥守命是也又名月朗天門", "太陰在亥宮守命。", IN("太陰", "命宮", { branches: "亥" }), ["貴"], { requiredStars: ["太陰"] }),
  pat("GUI_YUESHENG", "19L", "定貴局", "月生滄海", "月生滄海月在子宮守田宅是也", "太陰在子宮守田宅。", IN("太陰", "田宅", { branches: "子" }), ["貴", "宅旺"], { requiredStars: ["太陰"] }),
  pat("GUI_FUBIGONGZHU", "19L", "定貴局", "輔弼拱主", "輔弼拱主紫微守命二星來拱是也夾之亦然", "紫微守命，左輔、右弼來拱或來夾。", ALL(IN("紫微"), ANY(ALL(IN("左輔", "命宮", { relation: "sanfang" }), IN("右弼", "命宮", { relation: "sanfang" })), FLANK("左輔", "右弼"))), ["貴"], { requiredStars: ["紫微", "左輔", "右弼"] }),
  pat("GUI_JUNCHEN", "19L", "定貴局", "君臣慶會", "君臣慶會紫微左右同守命是也", "紫微與左輔、右弼同守命宮。", ALL(IN("紫微"), IN("左輔"), IN("右弼")), ["貴"], { requiredStars: ["紫微", "左輔", "右弼"] }),
  pat("GUI_CAIYINJIALU", "19L", "定貴局", "財印夾祿", "財印夾祿祿守命梁相來夾是也", "祿存守命，天梁、天相左右來夾。", ALL(IN("祿存"), FLANK("天梁", "天相")), ["貴", "富"], { requiredStars: ["祿存", "天梁", "天相"] }),
  cand("GUI_LUMAPEIYIN", "19L", "定貴局", "祿馬佩印", "祿馬佩印馬前有祿印星同宮是也", "insufficientConditions", "「馬前」「印星」所指位置不明確。"),
  cand("GUI_ZUOGUI", "19L", "定貴局", "坐貴向貴", "坐貴向貴謂魁鉞在命", "unclearGlyph", "註文有疑字。"),
  pat("GUI_MATOU", "19L", "定貴局", "馬頭帶劍", "馬頭帶劍謂馬有刃是也", "天馬與擎羊同守命宮。", ALL(IN("天馬"), IN("擎羊")), ["貴"], { requiredStars: ["天馬", "擎羊"] }),
  pat("GUI_XINGQIU", "19L", "定貴局", "刑囚夾印", "刑囚夾印天刑廉貞同臨身命主武勇之人", "天刑、廉貞同臨命宮：武勇。", ALL(IN("天刑"), IN("廉貞")), ["貴"], { requiredStars: ["天刑", "廉貞"] }),
  pat("GUI_TANHUO", "19L", "定貴局", "貪火相逢", "貪火相逢謂二星守命同居廟旺是也", "貪狼、火星同守命宮且廟旺。", ALL(IN("貪狼", "命宮", { brightness: ["廟", "旺"] }), IN("火星")), ["貴"], { requiredStars: ["貪狼", "火星"] }),
  pat("GUI_WUQUSHOUYUAN", "19L", "定貴局", "武曲守垣", "武曲守垣武守命卯宮是也餘不是", "武曲在卯宮守命。", IN("武曲", "命宮", { branches: "卯" }), ["貴"], { requiredStars: ["武曲"] }),
  pat("GUI_QUANLU", "19L", "定貴局", "權祿生逢", "權祿生逢二星守命廟旺是也陷不是", "化權、化祿同守命宮（星曜廟旺）。", ALL(HUA("權", "命宮"), HUA("祿", "命宮")), ["貴"], { requiredStars: [] }),
  pat("GUI_QINGYANG", "19L", "定貴局", "擎羊入廟", "擎羊入廟辰戌丑未守命遇吉是也", "擎羊在辰戌丑未守命，又遇吉星。", ALL(IN("擎羊", "命宮", { branches: "辰戌丑未" }), LUCKY()), ["貴"], { requiredStars: ["擎羊"] }),
  pat("GUI_JINYU", "19L", "定貴局", "金輿扶駕", "金輿扶駕紫微守命前後有日月來夾是也", "紫微守命，太陽、太陰前後來夾。", ALL(IN("紫微"), FLANK("太陽", "太陰")), ["貴"], { requiredStars: ["紫微", "太陽", "太陰"] }),
  ...(["七殺朝斗", "日月並明", "明珠出海", "日月同臨", "科權祿拱", "府相朝垣", "紫府朝垣", "文星暗拱", "巨機居卯", "明祿暗祿", "科明祿暗"] as const).map((n, i) =>
    cand(`GUI_SEEPRIOR_${i + 1}`, "19L", "定貴局", n, `${n}見前註解`, "insufficientConditions", "原文只寫「見前註解」，此處沒有成立條件；待與前文各格條目逐一對應後再建立規則。")),
  cand("PIN_SHENGBUFENGSHI", "19L", "定貧賤局", "生不逢時", "生不逢時命坐空亡逢", "unclearGlyph", "註文有疑字，且條件含空亡（本 App 未排）。"),
  cand("PIN_LUFENGLIANGSHA", "19L", "定貧賤局", "祿逢兩殺", "祿逢兩殺祿坐空亡又逢空劫殺星是也", "requiresChartExtension", "條件含空亡（旬空／截空），本 App 客觀排盤沒有。"),
  cand("PIN_MALUO", "19L", "定貧賤局", "馬落空亡", "馬落空亡馬既落亡雖祿沖會", "requiresChartExtension", "條件含空亡，本 App 客觀排盤沒有。"),
  pat("PIN_RIYUECANGHUI", "19L", "定貧賤局", "日月藏輝", "日月藏輝日月反背又逢巨暗是也", "太陽或太陰落陷（反背）在命，又逢巨門：多困（「貧賤」不直接顯示）。",
    ALL(ANY(IN("太陽", "命宮", { brightness: ["陷"] }), IN("太陰", "命宮", { brightness: ["陷"] })), SF(["巨門"])), ["困"], { requiredStars: ["太陽", "太陰", "巨門"] }),
  cand("PIN_CAIYUQIUCHOU", "19L", "定貧賤局", "財與囚仇", "財與囚仇武", "unclearGlyph", "註文有疑字。"),
  pat("PIN_YISHENGGUPIN", "19L", "定貧賤局", "一生孤貧", "一生孤貧謂破守命星陷地是也", "破軍守命落陷：多困（「孤貧」不直接顯示）。", IN("破軍", "命宮", { brightness: ["陷"] }), ["困"], { requiredStars: ["破軍"] }),
  cand("PIN_JUNZI", "20R", "定貧賤局", "君子在野", "君子在野謂", "unclearGlyph", "註文有疑字與缺字。"),
  pat("PIN_LIANGZHONGHUAGAI", "20R", "定貧賤局", "兩重華蓋", "兩重華蓋謂祿存化祿坐命遇空劫是也", "祿存、化祿同坐命宮又遇地空地劫：成敗起伏。", ALL(IN("祿存"), HUA("祿", "命宮"), SF(["地空", "地劫"])), ["成敗"], { requiredStars: ["祿存", "地空", "地劫"] }),
  pat("ZA_FENGYUN", "20R", "定雜局", "風雲際會", "風雲際會身命雖弱二限逢祿馬是也", "大限命宮逢祿（祿存或化祿）與天馬：好運際會。", ALL(IN("天馬", "命宮", { layer: "decade", relation: "sanfang" }), ANY(IN("祿存", "命宮", { layer: "decade", relation: "sanfang" }), HUA("祿", "命宮", "decade", "sanfang"))), ["限吉財", "限吉事"],
    { requiredStars: ["天馬", "祿存"] }, { layer: "decade" }),
  cand("ZA_JINSHANG", "20R", "定雜局", "錦上添花", "錦上添花謂限破惡星而行吉地是也", "insufficientConditions", "「限破惡星而行吉地」未指明星曜與宮位。"),
  cand("ZA_LUSHUAI", "20R", "定雜局", "祿衰馬困", "祿衰馬困限逢七殺祿馬空亡是也", "requiresChartExtension", "條件含空亡。"),
  cand("ZA_YIJIN", "20R", "定雜局", "衣錦還鄉", "衣錦還鄉少年不遂四十後行墓運是也", "insufficientConditions", "「墓運」所指不明確。"),
  cand("ZA_SHAOSUI", "20R", "定雜局", "少歲無衣", "無衣前限接後限逢錦不分是也", "unclearGlyph", "格名有疑字。"),
  cand("ZA_SHUISHANG", "20R", "定雜局", "水上駕星", "水上駕星一年好一年不好是也", "insufficientConditions", "只描述結果，沒有盤面條件。"),
  cand("ZA_JIXIONG", "20R", "定雜局", "吉凶相伴", "吉凶相伴命有主星限前則發限衰不發是也", "insufficientConditions", "「限前」「限衰」未指明條件。"),
  cand("ZA_KUMU", "20R", "定雜局", "枯木逢春", "枯木逢春謂命衰限好是也", "insufficientConditions", "「命衰限好」沒有具體星曜條件。"),
];
