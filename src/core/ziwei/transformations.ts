/** TransformationEngine：四化（祿權科忌）。生年、大限、流年、流月、流日四化各自標明來源，互不混用。
 *  宮干飛化另由 FlyingTransformationEngine 處理（目前 Profile 未啟用）。 */
import type { Stem, ZiweiRuleProfile } from "./profile";
import { HUA, type Hua } from "./common";

export type TransformationType = "birthYear" | "decade" | "annual" | "monthly" | "daily" | "flying";
export const TRANSFORMATION_TAG: Record<TransformationType, string> = { birthYear: "生", decade: "限", annual: "年", monthly: "月", daily: "日", flying: "飛" };
export const TRANSFORMATION_LABEL: Record<TransformationType, string> = { birthYear: "生年四化", decade: "大限四化", annual: "流年四化", monthly: "流月四化", daily: "流日四化", flying: "宮干飛化" };

export interface Transformation {
  star: string;
  transformation: Hua;
  type: TransformationType;
  sourceStem: string;
  ruleId: string;            // 例 ZW_TRANSFORM_丁_祿
  tableSource: string;       // 使用的四化表（Profile id）
}

export function transformationsOf(stem: string, type: TransformationType, P: ZiweiRuleProfile): Transformation[] {
  const t = P.rules.fourTransformationsTable.value[stem as Stem];
  if (!t) throw new Error(`無效天干：${stem}`);
  return HUA.map((h, i) => ({ star: t[i], transformation: h, type, sourceStem: stem, ruleId: `ZW_TRANSFORM_${stem}_${h}`, tableSource: P.id }));
}

/** 相容用：{祿: 星, 權: 星, …} */
export const sihuaRecord = (stem: string, P: ZiweiRuleProfile): Record<Hua, string> =>
  Object.fromEntries(transformationsOf(stem, "birthYear", P).map(x => [x.transformation, x.star])) as Record<Hua, string>;
