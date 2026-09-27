/** ZiweiRuleProfile：固定規則值、不可修改、自訂 Profile 建立方式，以及 Profile 確實控制排盤。 */
import { describe, it, expect } from "vitest";
import {
  IZTRO_COMPATIBLE_V1, BUILTIN_ZIWEI_PROFILES, computeZiweiNatal, legacyProfileFromV1, profileForOverrides, resolveZiweiProfile, ProfileError,
  type CustomZiweiProfileRecord, type ZiweiRuleProfile,
} from "@/core/ziwei";
import { defaultSettings, type CalculationSettings } from "@/core/person";
import type { ChartInput } from "@/core/engine";
import { toBirth, type FixtureInput } from "./golden/snapshot";

const P = IZTRO_COMPATIBLE_V1;
const input = (x: FixtureInput, profile: ZiweiRuleProfile, settings: CalculationSettings = { ...defaultSettings(""), ziwei: { ruleProfileId: profile.id } }): ChartInput =>
  ({ personId: "t", gender: x.gender, birth: toBirth(x), settings, ziweiProfile: profile });
const X = (localDate: string, localTime: string, gender: "male" | "female" = "male"): FixtureInput =>
  ({ gender, localDate, localTime, timeZone: "Asia/Taipei", place: { name: "台北", lat: 25.04, lng: 121.51 }, useTrueSolarTime: false });

describe("iztro_compatible_v1：已確認的固定規則", () => {
  it("名稱與版本", () => {
    expect([P.id, P.name, P.version, P.kind, P.baseProfileId]).toEqual(["iztro_compatible_v1", "通行排盤（iztro 相容）", "1.0.0", "builtin", null]);
    expect(P.description).toContain("不代表紫微斗數唯一正確的算法");
  });
  it("年界、閏月、日界、歲數、大限", () => {
    const r = P.rules;
    expect([r.ziweiYearBoundary.value, r.leapMonthRule.value, r.dayBoundaryRule.value, r.ageSystem.value, r.decadeStartRule.value, r.decadeDirectionRule.value])
      .toEqual(["lunarNewYear", "splitAt15", "00:00", "nominal", "bureauNumber", "yangMaleYinFemaleForward"]);
    expect(r.dayBoundaryRule.note).toContain("dayDivide=current");
  });
  it("四化表：庚陽武陰同、戊右弼科、壬左輔科、丁太陰祿天同權天機科巨門忌", () => {
    const t = P.rules.fourTransformationsTable.value;
    expect(t.庚).toEqual(["太陽", "武曲", "太陰", "天同"]);
    expect(t.戊[2]).toBe("右弼");
    expect(t.壬[2]).toBe("左輔");
    expect(t.丁).toEqual(["太陰", "天同", "天機", "巨門"]);
  });
  it("魁鉞：甲戊庚牛羊、六辛逢馬虎；火鈴不分陰陽順逆", () => {
    const k = P.rules.kuiYueRule.value;
    for (const s of ["甲", "戊", "庚"] as const) expect(k[s]).toEqual([1, 7]);
    expect(k.辛).toEqual([6, 2]);
    expect(P.rules.fireBellRule.value).toBe("threeHarmonyStartForwardByHourNoDirection");
  });
  it("每條規則都有來源欄位；沒有古籍來源的一律為 null，不臆造", () => {
    for (const r of Object.values(P.rules)) {
      expect(r).toHaveProperty("softwareDataset");
      expect(r.classicalSource).toBeNull();
      expect(["iztroMatched", "ruleVerified", "pendingVerification"]).toContain(r.verification);
    }
    expect(P.rules.emptyPalaceRule.value.borrowedStarWeight).toBeUndefined();
    expect(P.rules.flyingTransformation.value).toBe("disabled");
  });
});

describe("Profile 不可修改", () => {
  it("深度凍結：任何修改都會失敗", () => {
    expect(Object.isFrozen(P)).toBe(true);
    expect(Object.isFrozen(P.rules.fourTransformationsTable.value.庚)).toBe(true);
    expect(() => { (P.rules.dayBoundaryRule as { value: string }).value = "23:00"; }).toThrow();
    expect(() => { (BUILTIN_ZIWEI_PROFILES as Record<string, unknown>).x = 1; }).toThrow();
  });
  it("修改核心規則會建立自訂 Profile，不沿用 iztro_compatible_v1 的 id", () => {
    const now = new Date("2026-09-27T10:00:00Z");
    expect(profileForOverrides(P.id, [{ field: "dayBoundaryRule", value: "00:00" }], [], now)).toEqual({ id: P.id, created: null });
    const r = profileForOverrides(P.id, [{ field: "dayBoundaryRule", value: "23:00" }], [], now);
    expect(r.id).toBe("custom_20260927_001");
    expect(r.created).toMatchObject({ kind: "custom", baseProfileId: P.id, overrides: [{ field: "dayBoundaryRule", value: "23:00" }] });
    const again = profileForOverrides(P.id, [{ field: "dayBoundaryRule", value: "23:00" }], [r.created!], now);
    expect(again).toEqual({ id: r.id, created: null });
    const next = profileForOverrides(P.id, [{ field: "leapMonthRule", value: "asNext" }], [r.created!], now);
    expect(next.id).toBe("custom_20260927_002");
    const resolved = resolveZiweiProfile(r.id, [r.created!]);
    expect([resolved.name, resolved.rules.dayBoundaryRule.value, resolved.rules.dayBoundaryRule.verification]).toEqual(["自訂（基於通行排盤（iztro 相容））", "23:00", "pendingVerification"]);
    expect(P.rules.dayBoundaryRule.value).toBe("00:00");
  });
  it("找不到 Profile 時丟出錯誤，不默默改用其他規則", () => {
    expect(() => resolveZiweiProfile("nope")).toThrow(ProfileError);
  });
  it("舊版設定轉換：只差日界者為 legacy_imported_v1_earlyZi；與標準相同者即標準 Profile", () => {
    expect(legacyProfileFromV1({ baziZiHour: "lateZiSameDay", leapMonth: "splitAt15", gengSihua: "陽武陰同" }, "t").id).toBe(P.id);
    const e = legacyProfileFromV1({ baziZiHour: "earlyZiNextDay" }, "t");
    expect([e.id, e.record?.kind, e.record?.overrides]).toEqual(["legacy_imported_v1_earlyZi", "legacy", [{ field: "dayBoundaryRule", value: "23:00" }]]);
  });
});

describe("Profile 確實控制排盤（不改核心程式即可換規則）", () => {
  const customs: CustomZiweiProfileRecord[] = [
    { id: "t_day", name: "t", kind: "custom", baseProfileId: P.id, overrides: [{ field: "dayBoundaryRule", value: "23:00" }], createdAt: "" },
    { id: "t_geng", name: "t", kind: "custom", baseProfileId: P.id, overrides: [{ field: "gengTransformation", value: "陽武同陰" }], createdAt: "" },
    { id: "t_leap", name: "t", kind: "custom", baseProfileId: P.id, overrides: [{ field: "leapMonthRule", value: "asNext" }], createdAt: "" },
  ];
  const R = (id: string) => resolveZiweiProfile(id, customs);
  it("日界 00:00 與 23:00：23:30 出生的紫微生日不同", () => {
    const a = computeZiweiNatal(input(X("2000-03-15", "23:30"), P)), b = computeZiweiNatal(input(X("2000-03-15", "23:30"), R("t_day")));
    expect([a.lunar.day, b.lunar.day]).toEqual([10, 11]);
    expect(b.notes).toContain("生於子初，依設定以次日為紫微生日。");
  });
  it("庚干四化依 Profile", () => {
    const x = X("1990-06-15", "10:00");
    expect(computeZiweiNatal(input(x, P)).birthTransformations.map(t => t.star)).toEqual(["太陽", "武曲", "太陰", "天同"]);
    expect(computeZiweiNatal(input(x, R("t_geng"))).birthTransformations.map(t => t.star)).toEqual(["太陽", "武曲", "天同", "太陰"]);
  });
  it("閏月規則依 Profile（2023 閏二月十四：十五日為界算本月、一律下月算三月）", () => {
    const x = X("2023-04-04", "10:00");
    expect([computeZiweiNatal(input(x, P)).lunar.effectiveMonth, computeZiweiNatal(input(x, R("t_leap"))).lunar.effectiveMonth]).toEqual([2, 3]);
  });
  it("計算設定與傳入 Profile 不一致時拒絕排盤", () => {
    expect(() => computeZiweiNatal(input(X("1990-06-15", "10:00"), R("t_geng"), defaultSettings("")))).toThrow("不一致");
  });
  it("命盤記錄所用 Profile 與各模組版本", () => {
    const n = computeZiweiNatal(input(X("1990-06-15", "10:00"), P));
    expect(n.meta).toMatchObject({ ruleProfileId: P.id, ruleProfileVersion: "1.0.0", brightnessProfileId: "iztro-2.6.1", brightnessSource: "iztro", brightnessVersion: "2.6.1" });
    expect(Object.keys(n.meta.versions)).toEqual(["calendarVersion", "ziweiChartVersion", "starPlacementVersion", "brightnessVersion", "transformationVersion", "luckVersion", "interpretationVersion", "classicalDataVersion"]);
  });
});
