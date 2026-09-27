/** 宮位與星曜的語義登錄型別（PalaceSemanticRegistry／StarSemanticRegistry）。
 *  古籍語義（classical）與 App 的現代整理（appImplementation）分開存放；
 *  星曜的核心性質不等於對使用者的人格定論，必須搭配宮位、三方四正、四化與吉煞一起判讀。 */
import type { TopicId } from "@/kb/advice/topics";
import type { PalaceName } from "../common";
import type { CitationStatus } from "./citation";
import type { FactorId } from "@/core/advice/factors";

/** 有古籍依據的欄位：沒有已校驗的原文前 text 一律為 null */
export interface SourcedField { text: string | null; citationIds: string[]; status: CitationStatus }

export interface PalaceSemantic {
  palaceId: string;
  name: PalaceName;
  /** 原書宮名（例：夫妻＝原書「妻妾」、交友＝原書「奴僕」） */
  classicalName: string;
  /** 古典語義：依已校驗引用整理（不含原文，原文在引用裡） */
  classicalMeaning: SourcedField;
  /** App 依宮名字義整理的現代用途範圍（不是古籍判讀） */
  modernMeaning: { text: string; basis: "palaceNameLiteral" };
  relatedTopics: TopicId[];
  interpretationScope: string;
  /** 判讀此宮時必須一併看的宮位（三方四正，依十二宮固定排列推得） */
  combineWith: { opposite: PalaceName; trines: [PalaceName, PalaceName] };
  classicalSources: string[];
  caveats: string[];
}

/** 可能的生活因素：enabled＝true 才會由判讀規則產生；其餘只是候選，說明為什麼還不啟用 */
export interface LifeFactorCandidate { factorId: FactorId; basis: string; enabled: boolean; reason: string }

export interface StarSemantic {
  star: string;
  starCode: string;
  /** 安星所屬系統（紫微系／天府系，客觀排盤資料） */
  placementGroup: "ziwei" | "tianfu";
  /** 核心主題（原書「化〇〇、為〇〇主」一類的定性） */
  coreThemes: SourcedField;
  /** 有利表現（原書明寫、且不需其他條件者） */
  favorableExpressions: SourcedField;
  /** 需要留意的表現（原書明寫者；只作傾向描述，不作定論） */
  challengingExpressions: SourcedField;
  /** 成立條件（入廟／落陷、日生／夜生、會照哪些星） */
  conditionalFactors: SourcedField;
  /** 判讀時必須一併看的宮位與關係（App 依結構整理） */
  palaceDependencies: string[];
  /** 與其他星曜組合的變化（原書明寫者） */
  combinationDependencies: SourcedField;
  classicalCitations: string[];
  /** App 的現代中性說明（不是原文、不是定論） */
  modernExplanation: string;
  lifeFactorCandidates: LifeFactorCandidate[];
  verificationStatus: CitationStatus;
  sources: string[];
  school: string;
  confidence: "none" | "low" | "medium" | "high";
  limitations: string[];
}
