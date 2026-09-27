/** 各命理系統共用的判讀輸出介面（InterpretationResult ＋ LifeFactors）。
 *  八字、奇門、梅花目前由既有規則經對照表產生（mappingType = derivedFromExistingInterpretation）；
 *  紫微判讀引擎完成後，只要輸出同一格式（mappingType = nativeInterpretation）即可直接加入建議引擎。 */
import type { DomainKey } from "../domains";
import type { ScoredSystem } from "@/kb/weights";
import type { FactorId } from "./factors";

/** 判讀所屬的命理時間層 */
export type TimeLayer = "natal" | "decade" | "year" | "month" | "day" | "hour";

/** 來源可靠度：
 *  - classicalText：規則引用已匯入的原文（例：《周易》爻辭、《繫辭》）
 *  - principleOnly：有明確命理原則，但原文尚未匯入校驗（通行論法、要旨）
 *  - pendingVerification：規則文字過度武斷或來源不明；只保留在專業模式，不作為高信心建議來源 */
export type SourceReliability = "classicalText" | "principleOnly" | "pendingVerification";

export type FactorPolarity = "support" | "risk" | "context";
export type MappingType = "derivedFromExistingInterpretation" | "nativeInterpretation";

export interface LifeFactorInstance {
  factorId: FactorId;
  polarity: FactorPolarity;
  strength: 1 | 2 | 3;
  domains: DomainKey[];             // 此因素作用的領域（來自原判讀規則）
  sourceSystem: ScoredSystem;
  sourceRuleIds: string[];
  timeLayer: TimeLayer;
  mappingType: MappingType;
  reliability: SourceReliability;
  confidence: "medium" | "low";     // 映射本身的信心（沒有任何規則經人工校驗前不給 high）
}

export interface InterpretationFinding {
  findingId: string;                // `${ruleId}@${date}`
  system: ScoredSystem;
  ruleId: string;
  date: string;                     // 判讀所屬日期（近 3 天彙整時用來追溯）
  timeLayer: TimeLayer;
  effects: { domain: DomainKey; polarity: -1 | 0 | 1; strength: 1 | 2 | 3 }[];
  factors: LifeFactorInstance[];
  reliability: SourceReliability;
  mapping: { basis: string; reason: string; excluded?: string };
  /** 原始命理判讀（專業模式「為什麼」與追溯用；一般模式不直接顯示） */
  source: {
    conclusion: string; plain: string; pro: string; principle: string; school: string;
    textIds: string[]; matched: { fact: string; value: unknown; derivation: string }[];
    legacyAdviceText: string[];
  };
}

export interface InterpretationResult {
  system: ScoredSystem;
  /** active：已產生判讀；pending：判讀引擎建置中（不參與建議，也不當成中性）；unavailable：此人資料不足 */
  status: "active" | "pending" | "unavailable";
  reason?: string;
  findings: InterpretationFinding[];
}
