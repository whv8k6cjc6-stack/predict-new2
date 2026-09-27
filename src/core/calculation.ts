/** 人物 → 計算設定 → 紫微 Profile 的解析（UI 與測試共用）。 */
import { defaultSettings, type BirthProfile, type CalculationSettings } from "./person";
import { resolveZiweiProfile, type CustomZiweiProfileRecord, type ZiweiRuleProfile } from "./ziwei/profile";

/** 找不到設定時使用預設設定；找不到 Profile 時不默默改用別的規則，而是讓紫微引擎回報「找不到排盤規則」並標示為未納入。 */
export function resolveCalculation(birth: BirthProfile, list: CalculationSettings[], customs: CustomZiweiProfileRecord[]): { settings: CalculationSettings; ziweiProfile?: ZiweiRuleProfile } {
  const settings = list.find(s => s.id === birth.calculationSettingsId) ?? list.find(s => s.isDefault) ?? defaultSettings("");
  try { return { settings, ziweiProfile: resolveZiweiProfile(settings.ziwei.ruleProfileId, customs) }; }
  catch { return { settings }; }
}
