import { describe, it, expect } from "vitest";
import { legacyZiweiScoring } from "@/kb/rules/ziwei";
const ZIWEI_RULES = [...legacyZiweiScoring.rules];
import { lintRule, runRules } from "@/core/rules/engine";
import { ZiweiEngine } from "@/core/ziwei";
import { defaultSettings, DEFAULT_SETTINGS_ID } from "@/core/person";
import type { ChartInput } from "@/core/engine";

const input: ChartInput = {
  personId: "t", gender: "female", settings: defaultSettings(""),
  birth: { personId: "t", localDate: "1975-07-18", localTime: "07:40", timeAccuracy: "exact", inputCalendar: "solar", place: { name: "新營", countryCode: "TW", lat: 23.31, lng: 120.32 }, timeZone: "Asia/Taipei", dstOverride: "auto", useTrueSolarTime: true, timeBasis: "civilStandard", calculationSettingsId: DEFAULT_SETTINGS_ID, createdAt: "", updatedAt: "" },
};

describe("紫微規則庫", () => {
  it("全部通過反空泛 lint、編號唯一", () => {
    expect(ZIWEI_RULES.map(r => ({ id: r.id, e: lintRule(r) })).filter(x => x.e.length)).toEqual([]);
    expect(new Set(ZIWEI_RULES.map(r => r.id)).size).toBe(ZIWEI_RULES.length);
  });
  it("一整年逐日執行：模板無缺槽、每天都有四化規則命中", () => {
    const n = ZiweiEngine.computeNatal(input);
    if (!n.ok) throw new Error(n.message);
    for (let i = 0; i < 365; i++) {
      const date = new Date(Date.UTC(2026, 0, 1 + i)).toISOString().slice(0, 10);
      const t = ZiweiEngine.computeTransit(n.data, input, { civilDate: date, civilTime: "10:00", timeZone: "Asia/Taipei" });
      if (!t.ok) throw new Error("transit");
      const r = runRules(ZIWEI_RULES, t.facts);
      expect(r.warnings).toEqual([]);
      expect(r.fired.filter(f => f.rule.id.startsWith("ziwei.day.hua")).length).toBeGreaterThan(0);
    }
  });
  it("出生時辰不詳時紫微不排盤（資料不足）", () => {
    const r = ZiweiEngine.computeNatal({ ...input, birth: { ...input.birth, localTime: null } });
    expect(r.ok).toBe(false);
    expect(!r.ok && r.reason).toBe("insufficient_data");
  });
});
