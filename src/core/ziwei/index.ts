/** Ziwei Engine：紫微斗數（排盤只負責客觀位置；判讀另由 Interpretation Engine 負責，目前重建中）。
 *  模組：profile（規則）、calendar（ZiWeiCalendarEngine）、structure（LifeBodyPalace／Palace／FiveElementBureau）、
 *  stars（MainStar／MinorStar）、brightness、transformations、luck（DaXian／AnnualLuck／AgeSystem）、
 *  relations（SanFangSiZheng／EmptyPalace／FlyingTransformation）、chart（ZiweiChartEngine）、facts。 */
import type { DivinationEngine, EngineMeta } from "../engine";
import { computeZiweiNatal, type ZiweiNatal } from "./chart";
import { computeZiweiTransit, type ZiweiTransit } from "./luck";
import { ziweiFacts } from "./facts";
import { IZTRO_COMPATIBLE_V1 } from "./profile";
import { ZIWEI_VERSIONS } from "./common";

export const ZIWEI_META: EngineMeta = {
  id: "ziwei", name: "紫微斗數", phase: 4, status: "verified",
  stamp: { school: IZTRO_COMPATIBLE_V1.name, engine_version: `chart-${ZIWEI_VERSIONS.ziweiChartEngineVersion}`, rule_version: `${IZTRO_COMPATIBLE_V1.id}@${IZTRO_COMPATIBLE_V1.version}`, source_version: `亮度表 ${ZIWEI_VERSIONS.brightnessVersion}（MIT）` },
  summary: "十二宮、主輔煞雜曜、四化、三方四正、大限流年流月流日（排盤依 RuleProfile；判讀引擎重建中）",
};

export const ZiweiEngine: DivinationEngine<ZiweiNatal, ZiweiTransit> = {
  meta: ZIWEI_META,
  computeNatal(input) {
    try {
      const d = computeZiweiNatal(input);
      const stamp = { ...ZIWEI_META.stamp, school: d.meta.ruleProfileName, rule_version: `${d.meta.ruleProfileId}@${d.meta.ruleProfileVersion}` };
      return { ok: true, data: d, facts: ziweiFacts(d), stamp, warnings: d.notes };
    } catch (e) {
      return { ok: false, reason: input.birth.localTime ? "invalid_input" : "insufficient_data", message: (e as Error).message, stamp: ZIWEI_META.stamp };
    }
  },
  computeTransit(natal, _input, at) {
    const d = computeZiweiTransit(natal, at);
    return { ok: true, data: d, facts: ziweiFacts(natal, d), stamp: ZIWEI_META.stamp, warnings: [] };
  },
};

export * from "./common";
export * from "./profile";
export * from "./calendar";
export * from "./structure";
export * from "./stars";
export * from "./brightness";
export * from "./transformations";
export * from "./luck";
export * from "./relations";
export * from "./chart";
export * from "./facts";
