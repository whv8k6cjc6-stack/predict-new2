/** 宮位與星曜的語義登錄型別（PalaceSemanticRegistry／StarSemanticRegistry）。
 *  古籍語義（classical）與 App 的現代整理（appImplementation）分開存放；
 *  星曜的核心性質不等於對使用者的人格定論，必須搭配宮位、三方四正、四化與吉煞一起判讀。 */
import type { TopicId } from "@/kb/advice/topics";
import type { PalaceName } from "../common";
import type { CitationStatus } from "./citation";

/** 有古籍依據的欄位：沒有已校驗的原文前 text 一律為 null */
export interface SourcedField { text: string | null; citationIds: string[]; status: CitationStatus }

export interface PalaceSemantic {
  palaceId: string;
  name: PalaceName;
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

export interface StarSemantic {
  star: string;
  starCode: string;
  /** 安星所屬系統（紫微系／天府系，客觀排盤資料） */
  placementGroup: "ziwei" | "tianfu";
  coreNature: SourcedField;
  favorableExpression: SourcedField;
  imbalancedExpression: SourcedField;
  palaceContext: SourcedField;
  sanfangInfluence: SourcedField;
  transformationChanges: SourcedField;
  withAuspiciousMalefic: SourcedField;
  sources: string[];
  school: string;
  confidence: "none" | "low" | "medium" | "high";
  limitations: string[];
}
