import { describe, it, expect } from "vitest";
import { BAZI_RULES, BAZI_GLOBAL_SLOTS } from "@/kb/rules/bazi";
import { lintRule, runRules } from "@/core/rules/engine";
import { BaziEngine } from "@/core/bazi";
import { defaultSettings, DEFAULT_SETTINGS_ID } from "@/core/person";
import type { ChartInput } from "@/core/engine";

const input = (date: string, time: string | null, gender: "male" | "female" = "male"): ChartInput => ({
  personId: "t", gender, settings: defaultSettings(""),
  birth: { personId: "t", localDate: date, localTime: time, timeAccuracy: time ? "exact" : "unknown", inputCalendar: "solar", place: { name: "台南", countryCode: "TW", lat: 22.99, lng: 120.21 }, timeZone: "Asia/Taipei", dstOverride: "auto", useTrueSolarTime: true, timeBasis: "civilStandard", calculationSettingsId: DEFAULT_SETTINGS_ID, createdAt: "", updatedAt: "" },
});

describe("八字規則庫品質", () => {
  it("每條規則通過反空泛 lint（含命盤槽位、無禁用語、有原則與影響領域）", () => {
    const bad = BAZI_RULES.map(r => ({ id: r.id, errs: lintRule(r) })).filter(x => x.errs.length);
    expect(bad).toEqual([]);
  });
  it("規則編號唯一", () => expect(new Set(BAZI_RULES.map(r => r.id)).size).toBe(BAZI_RULES.length));
});

describe("八字引擎", () => {
  const n = BaziEngine.computeNatal(input("1988-01-14", "01:15"));
  it("本命可排盤且五神互斥涵蓋五行", () => {
    expect(n.ok).toBe(true);
    if (!n.ok) return;
    expect(new Set(Object.values(n.data.roles)).size).toBe(5);
    expect(n.data.pillars.year.text).toBe("丁卯");
    expect(n.data.luck.cycles).toHaveLength(10);
  });
  it("大量日期跑規則：所有觸發規則的模板都能完整渲染（無缺槽）", () => {
    if (!n.ok) return;
    let fired = 0;
    for (let i = 0; i < 400; i++) {
      const d = new Date(Date.UTC(2026, 0, 1 + i));
      const date = d.toISOString().slice(0, 10);
      for (const time of ["09:30", "14:10"]) {
        const t = BaziEngine.computeTransit(n.data, input("1988-01-14", "01:15"), { civilDate: date, civilTime: time, timeZone: "Asia/Taipei" });
        if (!t.ok) throw new Error("transit");
        const r = runRules(BAZI_RULES, t.facts, BAZI_GLOBAL_SLOTS);
        expect(r.warnings).toEqual([]);
        fired += r.fired.length;
      }
    }
    expect(fired).toBeGreaterThan(4000);
  });
  it("出生時間不詳時不產生時柱，且有提醒", () => {
    const u = BaziEngine.computeNatal(input("1988-01-14", null));
    expect(u.ok && u.data.pillars.hour).toBeNull();
    expect(u.ok && u.data.warnings.join("")).toContain("時柱");
  });
  it("同樣輸入結果可重現", () => {
    const a = JSON.stringify(BaziEngine.computeNatal(input("1975-07-18", "07:40")));
    const b = JSON.stringify(BaziEngine.computeNatal(input("1975-07-18", "07:40")));
    expect(a).toBe(b);
  });
  it("自刑為辰午酉亥（修正舊版錯誤）", async () => {
    const { branchPairRelations } = await import("@/core/bazi/data");
    for (const b of [4, 6, 9, 11]) expect(branchPairRelations(b, b)).toContain("自刑");
    for (const b of [3, 5, 8]) expect(branchPairRelations(b, b)).not.toContain("自刑");
    expect(branchPairRelations(2, 5)).toEqual(expect.arrayContaining(["刑", "害"]));   // 寅巳刑且害
  });
});
