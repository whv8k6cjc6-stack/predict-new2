/** 紫微判讀規則的撰寫格式（DSL）與建構器。
 *
 *  每條規則＝一句已在《全書》廣益版頁面文字中找到的原文（quote）＋盤面成立條件（when）＋「古典結果詞」（outcomes）。
 *  建構器會：
 *   1. 在雙重核讀後的頁面文字中逐字找到 quote，產生 ClassicalCitation（PDF 頁、版心頁、欄組影像範圍）；
 *   2. quote 內有任何疑字 → 引用標為 pendingVerification、規則不啟用（pendingReason＝unclearGlyph）；找不到 quote → 建構錯誤（測試會失敗）；
 *   3. 由 OUTCOMES 對照表把古典結果詞轉成現代中性語義與生活因素（對照表本身寫明依據與限制，不是固定分數）。 */
import type { ClassicalCitation } from "@/core/ziwei/interp/citation";
import type { ZiweiCondition, ZiweiInterpretationRule, ZiweiRuleKind, ModifierRole } from "@/core/ziwei/interp/rules";
import type { ContextLayer } from "@/core/ziwei/interp/contexts";
import type { FactorId } from "@/core/advice/factors";
import type { TopicId } from "@/kb/advice/topics";
import { findExcerpt } from "../texts/pages";

export const GY_SOURCE_ID = "ziwei-doushu-quanshu-guangyi-scan";
export const SCHOOL = "《紫微斗數全書》廣益版";

export type PendingReason =
  | "unclearGlyph"            // 原文有疑字
  | "insufficientConditions"  // 古文沒有足夠成立條件
  | "requiresOtherEdition"    // 需要其他版本確認
  | "ocrOnly"                 // 只有 OCR 定位
  | "historicalOnly"          // 壽夭、疾病、貧賤、性別角色等，只保留在古籍原文層
  | "requiresChartExtension"  // 條件需要目前客觀排盤沒有的資料（例：小限），不能擅自新增排盤
  | "notInterpretive";        // 排盤起例、表格等非判讀內容

/** 古典結果詞 → 現代中性語義＋生活因素。只收錄有把握的對照；「福」「下局」這類籠統詞只列出、不產生因素。 */
export interface OutcomeDef { term: string; modern: string; factors: [FactorId, 1 | 2 | 3][]; topics: TopicId[] }
const O = (term: string, modern: string, factors: [FactorId, 1 | 2 | 3][], topics: TopicId[]): OutcomeDef => ({ term, modern, factors, topics });
export const OUTCOMES = {
  // 本命（長期傾向）
  財官格: O("財官格", "長期而言在經營資源與承擔職務上較有發揮空間", [["aptitudeResources", 1], ["aptitudeResponsibility", 1]], ["general", "career", "wealth"]),
  貴: O("貴／貴格", "長期而言較有機會承擔職位、被看見", [["aptitudeResponsibility", 2]], ["general", "career", "promotion"]),
  富: O("富／財", "長期而言在累積與管理資源上較有發揮", [["aptitudeResources", 2]], ["general", "wealth"]),
  不耐久: O("不耐久", "成果不容易持久，需要定期檢視、及早鞏固", [["weakeningTrend", 1]], ["general", "career", "wealth", "decision"]),
  成敗: O("成敗不一", "起伏較大，有進有退", [["instability", 1]], ["general", "career", "wealth", "decision"]),
  困: O("困／主困", "推進時較容易卡住、需要更多準備", [["executionResistance", 1]], ["general", "career"]),
  福: O("福厚／為福", "古籍評為有福；本 App 不把它轉成生活因素", [], ["general"]),
  巧藝: O("巧藝／技術", "長期而言適合以專業技能、手藝發揮", [["aptitudeStudy", 1]], ["general", "career", "jobChange"]),
  悔吝: O("悔吝", "較容易有反覆、事後需要修正的情況", [["instability", 1]], ["general", "decision"]),
  利: O("利／宜之／利達", "古籍評為相宜；本 App 只列出，不轉成生活因素", [], ["general"]),
  下局: O("下局", "古籍評為格局較低；本 App 不把等第轉成生活因素", [], ["general"]),
  虛名: O("虛名／富而不貴", "名義與實質可能落差較大，宜重實質內容", [["aptitudeResources", 1]], ["general", "career"]),
  橫發橫破: O("橫發橫破", "資源進出起伏較大", [["financialVolatility", 1]], ["general", "wealth", "investment"]),
  聰明: O("聰明／多學多能", "長期而言學習與思考較有發揮", [["aptitudeStudy", 1]], ["general", "exam"]),
  表達: O("口才／文藝", "長期而言表達與文字較有發揮", [["aptitudeExpression", 1]], ["general", "career"]),
  // 宮位（本命長期傾向）
  財足: O("富足／財帛蓄積", "長期而言資源與收入較能累積", [["aptitudeResources", 1]], ["wealth"]),
  財旺: O("巨富／財氣旺", "長期而言在累積資源上較有發揮", [["aptitudeResources", 2]], ["wealth"]),
  財成敗: O("財帛成敗", "財務起伏較大、不容易穩定累積", [["financialVolatility", 1]], ["wealth", "investment"]),
  財辛勤: O("辛勤求財", "收入較需要靠持續投入心力", [["workloadIncrease", 1]], ["wealth"]),
  財白手: O("白手生財", "較適合靠自己開創收入來源", [["aptitudeResources", 1]], ["wealth", "career"]),
  官貴: O("官祿權貴", "長期而言在承擔職務、被看見上較有發揮", [["aptitudeResponsibility", 2]], ["career", "promotion"]),
  官宜: O("文武皆宜", "職涯選擇面較廣、適合承擔職務", [["aptitudeResponsibility", 1]], ["career"]),
  官起伏: O("官祿進退", "職涯起伏、進退較多", [["instability", 1]], ["career", "jobChange"]),
  宅旺: O("田宅旺相", "長期而言在置產、經營居所上較有發揮", [["aptitudeResources", 1]], ["property"]),
  宅退: O("田宅進退", "居所與不動產的變動較多", [["instability", 1]], ["property"]),
  遷貴: O("出外遇貴", "外出、異地發展時較容易得到協助", [["supportAvailable", 1]], ["travel", "career"]),
  遷是非: O("在外是非", "在外或外出時較容易有口舌摩擦", [["communicationConflictRisk", 1]], ["travel", "social"]),
  遷勞: O("在外奔波", "外出與移動較多、較勞碌", [["movementIncrease", 1], ["stressLoad", 1]], ["travel"]),
  遷財: O("在外得財", "外出或異地發展較有收穫", [["aptitudeResources", 1]], ["travel", "wealth"]),
  友得力: O("得力（奴僕宮）", "朋友、同事或團隊的支援較多", [["supportAvailable", 1], ["cooperationSupport", 1]], ["social", "cooperation"]),
  友欠力: O("欠力（奴僕宮）", "朋友、同事或團隊的支援較弱，合作較容易有摩擦", [["cooperationFriction", 1]], ["social", "cooperation"]),
  友背: O("背主／怨主（奴僕宮）", "人際往來中較需要留意信任與分際", [["trustRisk", 1]], ["social", "cooperation"]),
  福安: O("福德安樂", "心境較容易安穩、能享受生活", [["energySupport", 1]], ["general", "health"]),
  福勞: O("勞心費力", "較容易操心、身心負荷偏重", [["stressLoad", 1]], ["general", "health"]),
  妻和: O("夫妻和美", "伴侶互動較溫和", [["relationshipWarmth", 1]], ["relationship", "marriage"]),
  妻欠和: O("夫妻欠和", "伴侶互動較容易有摩擦，需要多溝通", [["communicationConflictRisk", 1]], ["relationship", "marriage"]),
  // 運限（大限修正）
  限吉財: O("限內財祿增添", "這段時間資源與收入較容易增加", [["resourceIncrease", 1]], ["general", "wealth"]),
  限吉事: O("限內百事亨通", "這段時間事情較容易推進", [["progressOpportunity", 1]], ["general", "career"]),
  限吉官: O("限內仕途升遷", "這段時間較有機會承擔更多職責、被看見", [["responsibilityOpportunity", 1], ["recognitionOpportunity", 1]], ["general", "career", "promotion"]),
  限吉婚: O("限內婚姻和合", "這段時間人際與感情互動較溫和", [["relationshipWarmth", 1]], ["general", "relationship", "marriage"]),
  限凶是非: O("限內口舌官非", "這段時間溝通較容易起摩擦", [["communicationConflictRisk", 1]], ["general", "career", "social", "lawsuit"]),
  限凶破財: O("限內破財", "這段時間花費或損失的可能較高", [["resourceLossRisk", 1]], ["general", "wealth"]),
  限凶阻: O("限內多阻滯", "這段時間推進較容易卡住", [["executionResistance", 1]], ["general", "career"]),
  限凶變: O("限內成敗不一", "這段時間變動與起伏較多", [["instability", 1]], ["general", "career", "wealth", "decision"]),
  限凶勞: O("限內勞碌", "這段時間負荷與壓力偏重", [["stressLoad", 1]], ["general", "career", "health"]),
  限吉貴: O("限內遇貴", "這段時間較容易得到他人協助", [["supportAvailable", 1]], ["general", "career", "social"]),
  限吉科: O("限內科名", "這段時間較利於考試、進修與被肯定", [["learningOpportunity", 1], ["recognitionOpportunity", 1]], ["general", "exam", "career"]),
  限吉安: O("限內安靜", "這段時間整體較安穩", [["resourceStability", 1]], ["general", "wealth"]),
  限凶疾: O("限內疾厄", "這段時間身心負荷偏重，宜留意作息與休息（不作健康預測）", [["fatigueRisk", 1], ["recoveryNeed", 1]], ["health"]),
  限凶耗: O("限內耗散", "這段時間支出與耗損的可能較高", [["resourceLossRisk", 1], ["unexpectedExpenseRisk", 1]], ["general", "wealth"]),
  // 流年（太歲）
  年吉: O("其年人財兩美", "這一年事情較容易推進、資源較順", [["progressOpportunity", 1], ["resourceIncrease", 1]], ["general", "career", "wealth"]),
  年凶: O("其年人財耗散、官災口舌", "這一年支出與口舌摩擦的可能較高", [["resourceLossRisk", 1], ["communicationConflictRisk", 1]], ["general", "wealth", "social", "lawsuit"]),
  年悔: O("其年災悔", "這一年較容易遇到波折，重要事項宜多預留緩衝", [["setbackRisk", 1]], ["general", "decision"]),
  年婚: O("婚姻喜事", "這一年人際與感情互動較熱絡", [["relationshipWarmth", 1]], ["relationship", "marriage"]),
} as const satisfies Record<string, OutcomeDef>;
export type OutcomeKey = keyof typeof OUTCOMES;

export interface ClauseSpec {
  id: string;
  leaf: string;                 // 例 "26R"
  section: string;              // 篇、條目（例「一命宮・紫微」）
  quote: string;                // 原文（無標點）
  /** 較長的上下文（同葉可能有相同短句時，先定位 anchor 再在其中找 quote） */
  anchor?: string;
  translation: string;          // 白話翻譯
  title: string;
  kind: ZiweiRuleKind;
  layer?: ContextLayer;
  when: ZiweiCondition | null;
  outcomes?: OutcomeKey[];
  /** 自訂的判讀（不用 OUTCOMES 時） */
  custom?: { modern: string; factors: [FactorId, 1 | 2 | 3][]; topics: TopicId[] };
  /** 原文有但本 App 不採用的部分（例：宿命斷語），寫在 appImplementation 讓人知道被略去 */
  omitted?: string;
  pendingReason?: PendingReason;
  confidence?: "low" | "medium" | "high";
}

export interface BuildProblem { id: string; problem: string }
export interface BuiltRule extends ZiweiInterpretationRule { pendingReason?: PendingReason; leaf: string }

// ───────── 條件輔助（撰寫規則用） ─────────
import { SHA6 } from "@/core/ziwei/common";
import type { PalaceName } from "@/core/ziwei/common";
type Rel = "self" | "opposite" | "trine" | "sanfang";
export const IN = (star: string, palace: PalaceName = "命宮", o: { layer?: ContextLayer; relation?: Rel; branches?: string; brightness?: string[] } = {}): ZiweiCondition =>
  ({ kind: "starInPalace", star, palace, layer: o.layer ?? "natal", relation: o.relation ?? "self", ...(o.branches ? { branches: [...o.branches] } : {}), ...(o.brightness ? { brightness: o.brightness } : {}) });
export const STEM = (stems: string): ZiweiCondition => ({ kind: "birthStem", stems: [...stems] });
export const YB = (branches: string): ZiweiCondition => ({ kind: "birthBranch", branches: [...branches] });
export const ALL = (...of: ZiweiCondition[]): ZiweiCondition => ({ kind: "all", of });
export const ANY = (...of: ZiweiCondition[]): ZiweiCondition => ({ kind: "any", of });
export const NOT = (of: ZiweiCondition): ZiweiCondition => ({ kind: "not", of });
export const MALE: ZiweiCondition = { kind: "gender", gender: "male" };
/** 多星任一在某宮（relation 同 IN） */
export const ANYIN = (stars: string[], palace: PalaceName = "命宮", o: Parameters<typeof IN>[2] = {}) => ANY(...stars.map(x => IN(x, palace, o)));
/** 六煞（擎羊、陀羅、火星、鈴星、地空、地劫）任一；古籍「加／見／會」解為本宮或三方四正 */
export const SHA = (palace: PalaceName = "命宮", layer: ContextLayer = "natal", relation: Rel = "sanfang") => ANYIN(SHA6, palace, { layer, relation });
export const LUCKY = (palace: PalaceName = "命宮", layer: ContextLayer = "natal", relation: Rel = "sanfang") => ANYIN(["左輔", "右弼", "文昌", "文曲", "天魁", "天鉞"], palace, { layer, relation });
const SRC = ["birthYear", "decade", "annual"] as const;
/** 某種四化（任何一層）在某宮 */
export const HUA = (h: "祿" | "權" | "科" | "忌", palace: PalaceName = "命宮", layer: ContextLayer = "natal", relation: Rel = "self", star?: string): ZiweiCondition =>
  ANY(...SRC.filter(x => layer === "annual" || x !== "annual").filter(x => layer !== "natal" || x === "birthYear").map(source => ({ kind: "transformation" as const, transformation: h, source, palace, layer, relation, ...(star ? { star } : {}) })));
export const JI = (palace: PalaceName = "命宮", layer: ContextLayer = "natal", relation: Rel = "sanfang") => HUA("忌", palace, layer, relation);
export const GOODHUA = (palace: PalaceName = "命宮", layer: ContextLayer = "natal", relation: Rel = "sanfang") => ANY(HUA("祿", palace, layer, relation), HUA("權", palace, layer, relation), HUA("科", palace, layer, relation));
export const LB = (layer: ContextLayer, branches: string): ZiweiCondition => ({ kind: "layerBranch", layer, branches: [...branches] });
export const HB = (branches: string): ZiweiCondition => ({ kind: "hourBranch", branches: [...branches] });
export const FLANK = (a: string, b: string, palace: PalaceName = "命宮", layer: ContextLayer = "natal"): ZiweiCondition => ({ kind: "flank", stars: [a, b], palace, layer });
export const SOLE = (star: string, palace: PalaceName = "命宮", layer: ContextLayer = "natal"): ZiweiCondition => ({ kind: "soleMajor", star, palace, layer });
export const EMPTY = (palace: PalaceName = "命宮", layer: ContextLayer = "natal"): ZiweiCondition => ({ kind: "emptyPalace", palace, layer });

/** 健康主題可用的生活因素（非醫療：疲勞、壓力、休息需求、精神體力） */
export const HEALTH_FACTORS = new Set<FactorId>(["fatigueRisk", "stressLoad", "recoveryNeed", "energySupport"]);
const ROLE: Record<ContextLayer, ModifierRole> = { natal: "baseNatalMeaning", decade: "periodModifier", annual: "annualModifier" };

export function buildClauses(specs: ClauseSpec[]): { rules: BuiltRule[]; citations: ClassicalCitation[]; problems: BuildProblem[] } {
  const rules: BuiltRule[] = [], citations: ClassicalCitation[] = [], problems: BuildProblem[] = [];
  const seen = new Set<string>();
  for (const s of specs) {
    if (seen.has(s.id)) problems.push({ id: s.id, problem: "重複的規則編號" });
    seen.add(s.id);
    const hit = findExcerpt(s.leaf, s.quote, s.anchor);
    if (!hit) { problems.push({ id: s.id, problem: `在 ${s.leaf} 找不到原文「${s.quote}」` }); continue; }
    const cid = `CIT_${s.id}`;
    citations.push({
      citationId: cid, sourceId: GY_SOURCE_ID, edition: "廣益版", volume: hit.volume, section: s.section.split("・")[0], entry: s.section.split("・")[1] ?? null,
      locationStatus: "verifiedAgainstText", originalText: s.quote, normalizedText: s.quote, classicalCommentary: null, modernTranslation: s.translation,
      verificationStatus: hit.clean ? "verified" : "pendingVerification", textualVariants: [], notes: hit.clean ? "" : `片段內有疑字：${hit.uncertainGlyphs.join("、")}`,
      locator: { pdfPage: hit.pdfPage, printedPage: hit.printedPage, spanId: `${s.leaf}:s${hit.strips.join(",")}`, boundingRegion: hit.region },
      transcriptionStatus: hit.clean ? "verified" : "transcriptionUnverified",
      verification: { machineLocated: false, visualTranscribed: true, visualDoubleChecked: hit.clean, humanReviewed: false, secondSourceVerified: false },
      uncertainGlyphs: hit.uncertainGlyphs, sourceType: "scanVisual",
      verifiedBy: "兩輪獨立目視轉錄＋差異回影像決議（AI，非人工校勘）", verifiedAt: "2026-09-27",
    });
    const outs = (s.outcomes ?? []).map(k => OUTCOMES[k]);
    const factors = s.custom ? s.custom.factors : outs.flatMap(o => o.factors);
    const topics = [...new Set(s.custom ? s.custom.topics : outs.flatMap(o => o.topics))] as TopicId[];
    const modern = s.custom ? s.custom.modern : outs.map(o => o.modern).join("；");
    const pendingReason: PendingReason | undefined = s.pendingReason ?? (!hit.clean ? "unclearGlyph" : !s.when ? "insufficientConditions" : undefined);
    const layer = s.layer ?? "natal";
    const merged = new Map<FactorId, 1 | 2 | 3>();
    for (const [f, n] of factors) merged.set(f, Math.min(3, (merged.get(f) ?? 0) + n) as 1 | 2 | 3);
    // 健康主題只接受非醫療的身心負荷因素：混有其他因素時，健康部分另拆一條（同一引用），主規則移除健康主題
    const allF = [...merged].map(([factorId, strength]) => ({ factorId, strength }));
    const healthF = allF.filter(f => HEALTH_FACTORS.has(f.factorId));
    const mixed = topics.includes("health") && allF.some(f => !HEALTH_FACTORS.has(f.factorId));
    const mainTopics = (mixed ? topics.filter(t => t !== "health") : topics) as TopicId[];
    const base = {
      kind: s.kind, title: s.title, timeLayer: layer, role: ROLE[layer], condition: s.when, citations: [cid],
      classicalPrinciple: s.translation,
      appImplementation: `依${hit.volume}「${s.section}」原文（PDF 第 ${hit.pdfPage} 頁）整理成盤面條件；古典結果詞${outs.map(o => `「${o.term}」`).join("、") || "（自訂）"}依對照表轉成中性語義${factors.length ? "與生活因素" : "，不產生生活因素"}。${s.omitted ? `原文另有「${s.omitted}」等古代斷語，只保留在原文層，不作判讀。` : ""}`,
      verificationStatus: (hit.clean ? "verified" : "pendingVerification") as ZiweiInterpretationRule["verificationStatus"], confidence: s.confidence ?? "low", school: SCHOOL,
      enabled: !pendingReason, pendingReason, leaf: s.leaf,
    };
    rules.push({
      ...base, ruleId: s.id, topics: mainTopics.length ? mainTopics : ["general"], modernSemantic: modern || null,
      interpretation: `${s.title}：${modern || "古籍有此記載，本 App 只列出、不轉成建議"}。這是古籍對傾向的描述，不是定論。`,
      lifeFactors: mixed ? allF.filter(f => !HEALTH_FACTORS.has(f.factorId) || !healthF.length) : allF,
    });
    if (mixed && healthF.length) {
      const hm = outs.filter(o => o.topics.includes("health")).map(o => o.modern).join("；");
      rules.push({
        ...base, ruleId: `${s.id}_H`, title: `${s.title}（作息提醒）`, topics: ["health"], modernSemantic: hm || null,
        interpretation: `${s.title}：${hm}。這是古籍對傾向的描述，不是健康預測。`, lifeFactors: healthF,
        appImplementation: `${base.appImplementation}健康主題只取身心負荷類因素，另拆為此條。`,
      });
    }
  }
  return { rules, citations, problems };
}
