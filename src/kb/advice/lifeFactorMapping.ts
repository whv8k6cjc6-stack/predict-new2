/** 既有判讀規則 → 生活因素（LifeFactor）對照表。
 *
 *  原則（語意標準化，不是新增命理規則）：
 *  1. 只依既有規則「已經明確寫出」的語意分類。每筆的 basis 必須逐字出現在該規則的結論／白話／專業說明／原則中（有測試檢查）。
 *  2. 不從一句結論延伸出新的命理意義（例：「容易有口舌」只標溝通衝突，不推成主管打壓或合約糾紛）。
 *  3. 規則對某一概念只是「定義」（例：「印星代表學習」）而非對此刻的判斷時，不映射。
 *  4. 文字過度武斷或屬傷病預測者標 pendingVerification：保留在專業模式，不作為高信心建議來源。
 *  完整逐條對照表由 scripts/advice/mapping-doc.test.ts 產生至 docs/LIFE_FACTOR_MAPPING.md。 */
import type { RuleDefinition } from "@/core/sources";
import type { FactorId } from "@/core/advice/factors";
import type { FactorPolarity, SourceReliability } from "@/core/advice/interpretation";

export const MAPPING_VERSION = "1.0.0";

export interface FactorMappingEntry {
  /** 因素；需要與預設讀法不同時以 [因素, 極性] 指定（例：「要求與壓力磨出專業」的負荷屬中性脈絡） */
  factors: (FactorId | [FactorId, FactorPolarity])[];
  /** 既有規則中逐字出現的語意依據 */
  basis: string[];
  reason: string;
  reliability?: SourceReliability;   // 未指定時：有已匯入原文 → classicalText，否則 principleOnly
  excluded?: string;                 // 刻意不映射的內容與理由
}

const M = (factors: FactorMappingEntry["factors"], basis: string | string[], reason: string, extra: Partial<FactorMappingEntry> = {}): FactorMappingEntry =>
  ({ factors, basis: Array.isArray(basis) ? basis : [basis], reason, ...extra });

/** 規則族 → 對照（鍵見 familyKeyOf） */
export const LIFE_FACTOR_MAPPING: Record<string, FactorMappingEntry> = {
  // ── 八字：十神 × 喜忌 ──
  "bazi.stem.比劫.fav": M(["cooperationSupport", "executionClarity"], "做事較有底氣，也容易得到同事朋友配合", "「得到同事朋友配合」＝合作順暢；「做事較有底氣」＝做事踏實"),
  "bazi.stem.比劫.unfav": M(["communicationConflictRisk", "resourceLossRisk"], "容易與人爭、花錢大方或被分走利益", "「與人爭」＝容易起口角；「花錢大方或被分走利益」＝容易花費或被分走"),
  "bazi.stem.食傷.fav": M(["expressionOpportunity", "communicationSupport"], "說話、寫作、提案較順", "明寫說話、寫作、提案較順"),
  "bazi.stem.食傷.unfav": M(["communicationConflictRisk", "hierarchyFriction"], "容易說話太直、與上級或制度起衝突", "「說話太直」＝溝通衝突；「與上級或制度起衝突」＝與上級易有摩擦"),
  "bazi.stem.財星.fav": M(["resourceStability", "resourceIncrease"], "理財、帳務與實際收穫較有把握", "「理財、帳務較有把握」＝財務處理較穩；「實際收穫」＝有實際收穫"),
  "bazi.stem.財星.unfav": M(["cashFlowPressure", "judgmentBiasRisk"], "容易為錢操心、判斷被利益左右", "「為錢操心」＝金錢壓力；「判斷被利益左右」＝判斷易被牽動"),
  "bazi.stem.官殺.fav": M(["responsibilityOpportunity", "hierarchySupport"], "承擔任務、向上溝通、爭取職責較有利", "「承擔任務、爭取職責」＝承擔任務的機會；「向上溝通較有利」＝向上溝通較順"),
  "bazi.stem.官殺.unfav": M(["hierarchyPressure", "workloadIncrease", "stressLoad"], "容易感到被要求、被檢視，身心負擔較大", "「被要求、被檢視」＝上級要求偏重與負荷增加；「身心負擔較大」＝身心壓力"),
  "bazi.stem.印星.fav": M(["decisionClarity", "supportAvailable"], "思緒較沉穩，也容易得到長輩或制度支持", "「思緒較沉穩」＝判斷清楚；「得到長輩或制度支持」＝有人可協助", { excluded: "「印星代表學習」只是定義，不是對此刻的判斷，不映射為適合學習" }),
  "bazi.stem.印星.unfav": M(["decisionUncertainty", "delayRisk"], "容易猶豫拖延、過度依賴他人意見", "「猶豫」＝判斷反覆；「拖延」＝進度可能延遲"),
  // ── 八字：地支本氣 ──
  "bazi.branch.fav": M(["executionClarity"], "做事比較踏實、有後勁", "明寫做事踏實、有後勁"),
  "bazi.branch.unfav": M(["executionResistance"], "做事容易使不上力", "「使不上力」＝推進有阻力"),
  // ── 八字：與本命四柱刑沖合害破 ──
  "bazi.rel.六沖": M(["changeRisk", ["movementIncrease", "context"]], "容易有變動、衝突或奔波", "「變動、衝突」＝變動與衝突；「奔波」＝移動變多"),
  "bazi.rel.六合": M(["cooperationSupport", "socialActivity", "communicationSupport"], "互動較和諧，容易有人情往來與合作", "「互動較和諧」＝溝通順暢；「人情往來」＝人情往來多；「合作」＝合作順暢"),
  "bazi.rel.半合": M(["cooperationSupport"], "容易聚合、形成共同目標", "「聚合、形成共同目標」＝合作順暢"),
  "bazi.rel.刑": M(["communicationConflictRisk", "stressLoad"], "容易有摩擦、是非或自我消耗", "「摩擦、是非」＝容易起口角；「自我消耗」＝身心壓力"),
  "bazi.rel.自刑": M(["decisionUncertainty", "stressLoad"], "容易自我糾結、鑽牛角尖", "「自我糾結、鑽牛角尖」＝判斷反覆與身心壓力"),
  "bazi.rel.害": M(["communicationMisunderstandingRisk"], "容易有暗中不順或誤會", "明寫誤會"),
  "bazi.rel.破": M(["planDisruptionRisk"], "計畫容易被打亂或小有破損", "明寫計畫被打亂"),
  "bazi.clearsJi": M(["changeOpportunity", "progressOpportunity"], "這一沖等於把卡住你的東西沖開", "「把卡住你的東西沖開」＝改變做法的機會、推進機會"),
  // ── 八字：伏吟、反吟、天干合沖日主 ──
  "bazi.fuyin": M(["recurringIssues", "delayRisk"], "同樣的狀況容易重複出現，進度較慢", "「重複出現」＝舊事重來；「進度較慢」＝進度可能延遲"),
  "bazi.fanyin": M(["instability", "changeRisk"], "你自己的狀態與身邊關係容易劇烈變化", "「狀態與關係劇烈變化」＝狀態不穩、變動",
    { reliability: "pendingVerification", excluded: "「變動最大的組合」語氣武斷、易製造恐懼，標為待驗證，不作為高信心建議來源" }),
  "bazi.stemhe": M(["socialActivity", "relationshipWarmth", "focusDisruption"], ["容易有邀約與人情往來，但也可能因此分心", "人情與感情互動變多"], "「邀約與人情往來」＝人情往來多；「感情互動變多」＝互動有溫度；「因此分心」＝容易被打斷"),
  "bazi.stemchong": M(["decisionUncertainty", "focusDisruption"], ["想法容易反覆", "容易猶豫或被打斷"], "「想法反覆、猶豫」＝判斷反覆；「被打斷」＝容易被打斷"),
  // ── 八字：神煞 ──
  "bazi.shensha.天乙貴人": M(["supportAvailable"], "較容易遇到願意協助你的人", "明寫遇到願意協助的人"),
  "bazi.shensha.文昌": M(["learningOpportunity", "expressionOpportunity"], "讀書、寫作、處理文書較得心應手", "「讀書」＝適合學習；「寫作、處理文書」＝表達順暢"),
  "bazi.shensha.驛馬": M([["movementIncrease", "context"]], "出差、旅行或外勤機會變多", "明寫移動機會變多", { excluded: "「代表移動與變動」為定義，不另映射為變動風險或機會" }),
  "bazi.shensha.桃花": M(["relationshipWarmth", "socialActivity"], "人緣與魅力提升，社交互動較熱絡", "「人緣與魅力」＝互動有溫度；「社交互動較熱絡」＝人情往來多"),
  "bazi.shensha.華蓋": M(["focusSupport", "lowSocialEnergy"], "較適合獨處思考、研究，社交意願偏低", "「獨處思考、研究」＝適合專注獨處；「社交意願偏低」＝社交意願低"),
  "bazi.shensha.羊刃": M(["impulsivityRisk"], "脾氣較急、容易衝動", "明寫容易衝動",
    { reliability: "pendingVerification", excluded: "「刀具、運動與交通的小傷」與原則中的「血光」屬傷害預測，不映射為生活因素；整條標為待驗證" }),
  "bazi.shensha.祿神": M(["resourceStability"], "工作的實質回報與收入較穩定", "明寫收入較穩定"),
  // ── 八字：十二長生、調候 ──
  "bazi.stage.strong": M(["energySupport"], "精神與體力較好", "明寫精神與體力較好"),
  "bazi.stage.weak": M(["fatigueRisk", ["recoveryNeed", "context"]], ["體力與精神較易透支", "宜保養"], "「較易透支」＝容易疲累；「宜保養」＝需要休養"),
  "bazi.tiaohou": M(["energySupport"], "身心較舒暢", "明寫身心較舒暢"),
  // ── 八字：投資細項 ──
  "bazi.invest.jiecai": M(["impulsivityRisk", "disciplineRisk"], "容易因為怕錯過而追高，或臨時改變原本的規則", "「怕錯過而追高」＝容易衝動；「臨時改變原本的規則」＝容易破壞紀律"),
  "bazi.invest.piancai": M(["decisionClarity"], "看盤與判斷機會較清楚，但仍以規則為準", "「判斷機會較清楚」＝判斷清楚"),
  "bazi.invest.shangguan": M(["disciplineRisk"], "容易想打破自己的規則", "明寫想打破自己的規則"),
  // ── 八字：本命格局（長期特質） ──
  "bazi.natal.pattern.財星": M(["aptitudeResources"], "對金錢與資源的經營較有天賦", "長期特質：擅長經營資源"),
  "bazi.natal.pattern.官殺": M(["aptitudeResponsibility"], "適合承擔責任、在組織中發揮", "長期特質：適合承擔責任"),
  "bazi.natal.pattern.食傷": M(["aptitudeExpression"], "擅長表達、創意與人際互動", "長期特質：擅長表達"),
  "bazi.natal.pattern.印星": M(["aptitudeStudy"], "重思考、學習與穩健判斷", "長期特質：重思考學習"),
  // ── 八字：《滴天髓》天干論要旨 ──
  "bazi.dts.jia.fire": M(["expressionOpportunity", "progressOpportunity"], "是發揮能力、交出成果的日子", "「發揮能力」＝表達順暢；「交出成果」＝推進機會"),
  "bazi.dts.yi.fire": M(["energySupport", "expressionOpportunity"], "精神開朗、表現力佳", "「精神開朗」＝精神體力較好；「表現力佳」＝表達順暢"),
  "bazi.dts.yi.jia": M(["supportAvailable"], "容易得到有力者的支持", "明寫得到支持"),
  "bazi.dts.bing.geng": M(["resourceIncrease", "progressOpportunity"], "你有能力把資源與機會化為成果", "「資源化為成果」＝有實際收穫、推進機會"),
  "bazi.dts.bing.xin": M(["judgmentBiasRisk", "decisionUncertainty"], "容易被小利或人情牽動、失去原本的果斷", "「被小利或人情牽動」＝判斷易被牽動；「失去果斷」＝判斷反覆"),
  "bazi.dts.ding.ren": M(["recognitionOpportunity"], "負責的態度容易被肯定", "明寫容易被肯定"),
  "bazi.dts.ding.jia": M(["energySupport"], "精神與底氣較足", "明寫精神較足"),
  "bazi.dts.wu.water": M(["resourceStability"], "利於資源整合與財務處理", "明寫利於財務處理"),
  "bazi.dts.wu.summerfire": M(["stressLoad"], "情緒煩躁", "「情緒煩躁」＝身心壓力",
    { reliability: "pendingVerification", excluded: "「口乾舌燥」屬身體症狀描述，不映射；整條標為待驗證" }),
  "bazi.dts.ji.metal": M(["expressionOpportunity", "recognitionOpportunity"], "表達與專業容易被看見", "「表達」＝表達順暢；「容易被看見」＝表現被看見"),
  "bazi.dts.geng.ding": M(["responsibilityOpportunity", ["workloadIncrease", "context"]], "要求與壓力正好磨出你的專業", "「要求與壓力磨出專業」＝承擔任務的機會；負荷在此為中性脈絡"),
  "bazi.dts.geng.water": M(["decisionClarity", "expressionOpportunity"], "思路與表達較清楚", "「思路清楚」＝判斷清楚；「表達較清楚」＝表達順暢"),
  "bazi.dts.geng.yi": M(["judgmentBiasRisk", "resourceLossRisk"], "容易因感情或人情而讓步，財務上也較大方", "「因人情讓步」＝判斷易被牽動；「財務上較大方」＝容易花費"),
  "bazi.dts.xin.water": M(["expressionOpportunity", "communicationSupport"], "才華外顯，適合表現與溝通", "「表現」＝表達順暢；「溝通」＝溝通順暢"),
  "bazi.dts.xin.earth": M(["workloadIncrease", "hierarchyPressure"], "容易被瑣事或長輩意見壓住", "「被瑣事壓住」＝負荷增加；「被長輩意見壓住」＝上級要求偏重"),
  "bazi.dts.ren.ding": M(["relationshipWarmth"], "感情與人際互動較溫暖", "明寫互動較溫暖"),
  "bazi.dts.gui.chen": M(["progressOpportunity"], "想法有機會落實", "明寫想法有機會落實"),
  // ── 奇門：各領域白天用神 ──
  "qimen.domain.good": M(["progressOpportunity", "favorableTiming"], ["所謀易成", "最佳在"], "原則「所謀易成」＝推進機會；結論列出最佳時段＝有較佳時段"),
  "qimen.domain.bad": M(["executionResistance", "timingSensitive"], ["則事多阻滯", "事情可以做，但建議改時間"], "原則「事多阻滯」＝推進有阻力；「建議改時間」＝時段影響大"),
  // ── 奇門：事件時辰 ──
  "qimen.event.good": M(["favorableTiming"], "時機站在你這邊", "明寫時機有利"),
  "qimen.event.bad": M(["timingSensitive"], "事情可以做，但建議改時間", "明寫建議改時間", { excluded: "規則只說此時辰不宜，未說明事情本身的成敗，不映射為推進阻力" }),
  "qimen.event.wubuyu": M(["timingSensitive"], "重要的開始建議改時間", "明寫重要的開始改時間＝時段影響大", { excluded: "傳統只說此時辰避開，未說明事情成敗，不映射為推進阻力" }),
  "qimen.event.fuyin": M(["delayRisk"], "事情進展慢、容易拖延", "明寫進展慢、容易拖延"),
  "qimen.event.fanyin": M(["planDisruptionRisk", "changeRisk"], ["容易反覆、變卦", "預留變更的空間"], "「反覆、變卦」＝計畫易被打亂、變動"),
  "qimen.event.jixing": M(["communicationConflictRisk", "setbackRisk"], ["容易起衝突或受挫"], "「起衝突」＝衝突；「受挫」＝挫折"),
  "qimen.event.rumu": M(["executionResistance"], "事情容易卡住、施展不開", "明寫卡住、施展不開＝推進有阻力"),
  // ── 梅花：體用 ──
  "iching.tiyong.用生體": M(["supportAvailable"], "事情容易得到助力", "明寫得到助力"),
  "iching.tiyong.比和": M(["cooperationSupport", "communicationSupport"], "合作與溝通順暢", "明寫合作與溝通順暢"),
  "iching.tiyong.體克用": M(["progressOpportunity", ["workloadIncrease", "context"]], "事情可以辦成，只是要親自投入", "「可以辦成」＝推進機會；「要親自投入」＝負荷（中性脈絡）"),
  "iching.tiyong.體生用": M(["resourceLossRisk", "stressLoad"], "容易勞心或花錢", "「花錢」＝容易花費；「勞心」＝身心壓力"),
  "iching.tiyong.用克體": M(["externalInterference", "executionResistance"], "外在阻力較大，硬推容易碰壁", "「外在阻力」＝外在阻力；「硬推容易碰壁」＝推進有阻力"),
  "iching.outcome.good": M(["improvingTrend"], "前面辛苦一點，後段會順", "明寫後段轉順"),
  "iching.outcome.bad": M(["weakeningTrend"], "越到後面越吃力", "明寫後段吃力"),
  // ── 梅花：動爻爻辭斷辭（《周易》原文） ──
  "iching.verdict.大吉": M(["progressOpportunity"], "是明確的大吉斷語", "爻辭大吉＝推進機會"),
  "iching.verdict.吉": M(["progressOpportunity", "approachSensitivity"], "斷語偏吉，但要看爻辭中的條件", "「偏吉」＝推進機會；「要看條件」＝做法決定結果"),
  "iching.verdict.吉凶並見": M(["approachSensitivity", "timingSensitive"], "方法與時機要選對", "明寫結果取決於方法與時機"),
  "iching.verdict.無咎": M(["errorRisk"], "會有小差錯，但及時修正就沒事", "明寫小差錯"),
  "iching.verdict.厲吝": M(["errorRisk"], "屬小問題但別輕忽", "《繫辭》「悔吝者，言乎其小疵也」＝小差錯"),
  "iching.verdict.無攸利": M(["lowReturnOnAction"], "今天主動出擊的效益低", "明寫主動出擊效益低"),
  "iching.verdict.凶": M(["setbackRisk"], "照現在的做法會有所失", "明寫照現在做法會有所失"),
  // ── 梅花：爻位（《繫辭下》） ──
  "iching.linepos.2": M(["recognitionOpportunity"], "做事容易得到肯定", "明寫容易得到肯定"),
  "iching.linepos.3": M(["transitionRisk"], "屬轉換處，容易出狀況", "明寫轉換處容易出狀況"),
  "iching.linepos.4": M(["hierarchyFriction"], "與上位者互動要格外謹慎", "與上位者互動需謹慎＝與上級互動易生摩擦"),
  "iching.linepos.5": M(["leadershipOpportunity", "progressOpportunity"], "容易有成果、主導權", "「主導權」＝主導的機會；「有成果」＝推進機會"),
};

/** 規則 id → 規則族鍵 */
export function familyKeyOf(ruleId: string): string | null {
  const p = ruleId.split(".");
  if (p[0] === "bazi") {
    if (p[1] === "natal") return `bazi.natal.pattern.${p[3]}`;
    if (p[1] === "dts") return `bazi.dts.${p.slice(2).join(".")}`;
    switch (p[2]) {
      case "stem": return `bazi.stem.${p[3]}.${p[4]}`;
      case "branch": return `bazi.branch.${p[3]}`;
      case "rel": return `bazi.rel.${p[4]}`;
      case "clearsJi": return "bazi.clearsJi";
      case "fuyin": return "bazi.fuyin";
      case "fanyin": return "bazi.fanyin";
      case "stemhe": return "bazi.stemhe";
      case "stemchong": return "bazi.stemchong";
      case "shensha": return `bazi.shensha.${p[3]}`;
      case "stage": return p[3] === "strong" ? "bazi.stage.strong" : "bazi.stage.weak";
      case "tiaohou": return "bazi.tiaohou";
      case "invest": return `bazi.invest.${p[3]}`;
    }
    return null;
  }
  if (p[0] === "qimen") return p[1] === "event" ? `qimen.event.${p[3]}` : `qimen.domain.${p[2]}`;
  if (p[0] === "iching") return `iching.${p[1]}.${p.slice(2).join(".")}`;
  return null;
}

export interface ResolvedMapping extends FactorMappingEntry { familyKey: string; reliability: SourceReliability }

export function lifeFactorMappingFor(rule: RuleDefinition): ResolvedMapping | null {
  const key = familyKeyOf(rule.id);
  const m = key ? LIFE_FACTOR_MAPPING[key] : undefined;
  if (!key || !m) return null;
  return { ...m, familyKey: key, reliability: m.reliability ?? (rule.based_on.text_ids.length ? "classicalText" : "principleOnly") };
}
