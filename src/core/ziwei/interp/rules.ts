/** 紫微判讀規則（ZiweiInterpretationRule）與格局規則（ZiweiPatternRule）的資料格式。
 *  古籍 → ClassicalCitation →（classicalPrinciple）→ InterpretationRule（appImplementation）→ LifeFactor → ActionAdviceEngine。
 *  不把古籍句子機械式轉成吉凶分數；本階段不產生任何紫微分數。 */
import type { TopicId } from "@/kb/advice/topics";
import type { FactorId } from "@/core/advice/factors";
import type { FactorPolarity } from "@/core/advice/interpretation";
import type { Hua, PalaceName } from "../common";
import type { SanFangRole } from "../relations";
import type { CitationStatus } from "./citation";
import type { ContextLayer } from "./contexts";

/** 條件只描述盤面客觀關係；relation：self＝本宮坐守、opposite／trine＝三方照會（不等於坐守）、sanfang＝四者任一 */
export type ZiweiCondition =
  | { kind: "starInPalace"; star: string; palace: PalaceName; layer?: ContextLayer; relation?: SanFangRole | "trine" | "sanfang"; brightness?: string[]; branches?: string[] }
  /** 某星在某宮坐守且為該宮唯一主星（古籍「獨守」「單居」） */
  | { kind: "soleMajor"; star: string; palace: PalaceName; layer?: ContextLayer }
  /** 命主性別（古籍「入男命」「入女命」訣；女命訣多含性別道德斷語，只保留在原文層） */
  | { kind: "gender"; gender: "male" | "female" }
  /** 出生年天干（古籍「甲生人」「丁己生人」） */
  | { kind: "birthStem"; stems: string[] }
  /** 出生年地支（古籍「寅午戌人」「辰戌丑未生人」） */
  | { kind: "birthBranch"; branches: string[] }
  | { kind: "transformation"; transformation: Hua; source: "birthYear" | "decade" | "annual"; star?: string; palace: PalaceName; layer?: ContextLayer; relation?: SanFangRole | "trine" | "sanfang" }
  | { kind: "starsTogether"; stars: string[]; palace?: PalaceName; layer?: ContextLayer }
  | { kind: "emptyPalace"; palace: PalaceName; layer?: ContextLayer }
  /** 夾：某宮左右相鄰兩宮分別有指定的兩顆星（古籍「日月夾命」「財蔭夾印」） */
  | { kind: "flank"; stars: [string, string]; palace: PalaceName; layer?: ContextLayer }
  /** 運限命宮落在本命某宮（例：流年命宮＝本命命宮，即「太歲在命宮」） */
  | { kind: "periodLifeAt"; layer: "decade" | "annual"; natalPalace: PalaceName }
  /** 某層命宮所在地支（本命命宮、大限命宮「行至寅申巳亥」、流年太歲宮） */
  | { kind: "layerBranch"; layer: ContextLayer; branches: string[] }
  /** 出生時辰地支（古籍「生在寅午戌申子辰六陽時」） */
  | { kind: "hourBranch"; branches: string[] }
  | { kind: "all"; of: ZiweiCondition[] }
  | { kind: "any"; of: ZiweiCondition[] }
  | { kind: "not"; of: ZiweiCondition };

/** principle＝判讀原則（例：運限分層順序），規範引擎怎麼組合各層，不單獨觸發 */
export type ZiweiRuleKind = "star" | "palace" | "starInPalace" | "combination" | "brightness" | "transformation" | "emptyPalace" | "period" | "principle";
/** 判讀在本命 → 大限 → 流年三層中的角色：大限、流年只作修正，不推翻本命 */
export type ModifierRole = "baseNatalMeaning" | "periodModifier" | "annualModifier";

export interface ZiweiInterpretationRule {
  ruleId: string;                         // 例 ZW_STAR_JUMEN_NATURE
  kind: ZiweiRuleKind;
  title: string;
  topics: TopicId[];
  timeLayer: ContextLayer;
  role: ModifierRole;
  condition: ZiweiCondition | null;       // null＝條件待原文確認，不會觸發
  citations: string[];                    // ClassicalCitation id
  /** 古籍原則的白話摘要（必須有已校驗的引用） */
  classicalPrinciple: string | null;
  /** 現代中性語義：把古籍原則轉成不帶吉凶定論的現代說法（仍不是建議） */
  modernSemantic?: string | null;
  /** App 做了什麼結構化整理（例：把某句古籍拆成條件與生活因素），避免被誤認為古籍原文 */
  appImplementation: string;
  interpretation: string | null;          // App 根據盤面的命理解讀（不是原文、不是建議）
  lifeFactors: { factorId: FactorId; polarity?: FactorPolarity; strength: 1 | 2 | 3 }[];
  verificationStatus: CitationStatus;
  confidence: "high" | "medium" | "low";
  school: string;
  enabled: boolean;
  /** 未啟用的具體原因（PendingReason） */
  pendingReason?: string;
  /** 採用的異文版本（有 textualVariants 時必填） */
  adoptedVariant?: string;
}

export interface ZiweiPatternRule {
  patternId: string;
  name: string;
  requiredStars: string[];
  requiredPalaces: PalaceName[];
  relationRequirements: ZiweiCondition[];
  brightnessRequirements: { star: string; brightness: string[] }[];
  transformationRequirements: { star: string; transformation: Hua; source: "birthYear" | "decade" | "annual" }[];
  supportingStars: string[];
  breakingConditions: ZiweiCondition[];
  rescueConditions: ZiweiCondition[];
  timeLayer: ContextLayer;
  source: string[];                       // citationIds
  originalText: string | null;
  interpretation: string | null;
  lifeFactors: ZiweiInterpretationRule["lifeFactors"];
  confidence: "high" | "medium" | "low";
  verificationStatus: CitationStatus;
}
