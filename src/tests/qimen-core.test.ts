import { describe, it, expect } from "vitest";
import { computeQimenChart, scanDay, qimenFacts, nianMingOf, evalPalace } from "@/core/qimen";
import { QIMEN_RULES } from "@/kb/rules/qimen";
import { lintRule, runRules } from "@/core/rules/engine";
import { gz, dayGz } from "@/core/calendar/ganzhi";

describe("拆補法定元（符頭：甲己日地支，子午卯酉上元、寅申巳亥中元、辰戌丑未下元）", () => {
  it("2024-01-15 戊寅日，符頭甲戌 → 小寒下元陽遁五局", () => {
    const c = computeQimenChart("2024-01-15", "10:00", "Asia/Taipei");
    expect([c.term, c.yuan, c.yang, c.ju]).toEqual(["小寒", "下元", true, 5]);
  });
  it("甲子／甲午／己卯／己酉日為上元，寅申巳亥符頭中元、辰戌丑未符頭下元（逐日驗證一年）", () => {
    const want: Record<string, string> = { 子: "上元", 午: "上元", 卯: "上元", 酉: "上元", 寅: "中元", 申: "中元", 巳: "中元", 亥: "中元", 辰: "下元", 戌: "下元", 丑: "下元", 未: "下元" };
    for (let i = 0; i < 366; i++) {
      const d = new Date(Date.UTC(2025, 0, 1 + i));
      const g = dayGz(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
      const fu = gz(g.index - (g.index % 5)); // 符頭：最近的甲或己日
      const c = computeQimenChart(d.toISOString().slice(0, 10), "10:00", "Asia/Taipei");
      expect(c.pillars.day).toBe(g.text);
      expect(c.yuan).toBe(want[fu.text[1]]);
    }
  });
});

describe("奇門事實與規則", () => {
  it("年命：甲年取旬首遁儀", () => {
    expect(nianMingOf(gz(0))).toBe("戊");     // 甲子年
    expect(nianMingOf(gz(10))).toBe("己");    // 甲戌年
    expect(nianMingOf(gz(3))).toBe("丁");     // 丁卯年
  });
  it("空亡、驛馬欄位", () => {
    const c = computeQimenChart("2026-09-27", "10:00", "Asia/Taipei");
    expect(c.kong).toHaveLength(2);
    expect(evalPalace(c, c.yimaPalace).yima).toBe(true);
  });
  it("規則通過 lint，一整年逐日掃描模板無缺槽", () => {
    expect(QIMEN_RULES.map(r => ({ id: r.id, e: lintRule(r) })).filter(x => x.e.length)).toEqual([]);
    const kinds = ["overall", "career", "wealth", "investment", "social", "love", "travel", "health", "decision"] as const;
    for (let i = 0; i < 60; i++) {
      const date = new Date(Date.UTC(2026, 0, 1 + i * 6)).toISOString().slice(0, 10);
      const scan = scanDay(date, "Asia/Taipei", "丁", [...kinds]);
      const r = runRules(QIMEN_RULES, qimenFacts(scan, [...kinds], "丁"));
      expect(r.warnings).toEqual([]);
    }
  });
});
