import { describe, it, expect } from "vitest";
import { SAMPLES } from "../../scripts/calibrate-samples";
import { buildNatal, analyze, analyzeEvent, findEventTimes, compareDates, heatmap, yearMonths, lifeTimeline, toScore, DOMAIN_KEYS } from "@/core/analysis";
import { domainRaw } from "@/core/analysis/score";
import { BAZI_RULES } from "@/kb/rules/bazi";
import { legacyZiweiScoring } from "@/kb/rules/ziwei";
const ZIWEI_RULES = [...legacyZiweiScoring.rules];
import { QIMEN_RULES, QIMEN_EVENT_RULES } from "@/kb/rules/qimen";
import { ICHING_RULES } from "@/kb/rules/iching";
import { lintRule } from "@/core/rules/engine";
import { getSourceText } from "@/kb/sources";
import { BANNED_PHRASES } from "@/core/rules/engine";
import { EVENT_TYPES } from "@/core/events";

const TZ = "Asia/Taipei";
const RULE_IDS = new Set([...BAZI_RULES, ...ZIWEI_RULES, ...QIMEN_RULES, ...QIMEN_EVENT_RULES, ...ICHING_RULES].map(r => r.id));
const subject = SAMPLES[4];
const noTime = { ...SAMPLES[7], birth: { ...SAMPLES[7].birth, localTime: null, timeAccuracy: "unknown" as const } };

describe("正式分數：可重現與可追溯", () => {
  const n = buildNatal(subject);
  const a = analyze(n, "2026-09-27", TZ);

  it("同樣輸入得到完全相同的結果", () => {
    expect(JSON.stringify(analyze(buildNatal(subject), "2026-09-27", TZ))).toBe(JSON.stringify(a));
  });

  it("分數 → 加權項目 → 規則 → 命盤因素 → 原文，逐層可反查", () => {
    for (const d of DOMAIN_KEYS) {
      const r = a.domains[d];
      expect(r.score).toBeGreaterThanOrEqual(0); expect(r.score).toBeLessThanOrEqual(100);
      expect(domainRaw(r.evidence, "day").raw).toBeCloseTo(r.raw, 5);
      if (d !== "overall") expect(r.score).toBe(toScore(r.raw - r.baseline, r.k));
      for (const e of r.evidence) {
        expect(RULE_IDS.has(e.ruleId)).toBe(true);
        expect(e.contribution).toBeCloseTo(e.polarity * e.strength * e.weight, 1);
        expect(e.match.matched.length).toBeGreaterThan(0);
        for (const m of e.match.matched) expect(a.facts.some(f => f.key === m.fact)).toBe(true);
        for (const t of e.textIds) expect(getSourceText(t)).not.toBeNull();
        expect(e.principle).toBeTruthy();
      }
    }
  });

  it("輸出文字不含百分比與禁用語，命理解讀齊全", () => {
    const text = JSON.stringify([a.overall.oneLine, ...DOMAIN_KEYS.map(d => a.domains[d].interp)]);
    for (const b of BANNED_PHRASES.filter(b => b !== "一定")) expect(text).not.toContain(b);
    for (const d of DOMAIN_KEYS) {
      const i = a.domains[d].interp;
      expect(i.oneLine).toBeTruthy(); expect(i.plain.length).toBeGreaterThan(0); expect(i.pro.length).toBeGreaterThan(0);
      expect(i).not.toHaveProperty("actions"); // 行動建議改由 ActionAdviceEngine 產生
    }
  });

  it("吉時 12 時辰、方位、四套系統訊號", () => {
    expect(a.hours).toHaveLength(12);
    expect(a.directions).not.toBeNull();
    expect(a.domains.career.signals.map(s => s.system)).toEqual(["bazi", "ziwei", "qimen", "iching"]);
    expect(a.readings.iching?.main.full).toBeTruthy();
  });
});

describe("分數分布（校準樣本以外的日子）", () => {
  it("中位數接近 50，高分日子約一成，不會整年同一區間", () => {
    const n = buildNatal(SAMPLES[2]);
    const all: number[] = [];
    for (let i = 0; i < 120; i++) {
      const date = new Date(Date.UTC(2027, 0, 1 + i * 3)).toISOString().slice(0, 10);
      const x = analyze(n, date, TZ, "day", { hours: false });
      for (const d of DOMAIN_KEYS) all.push(x.domains[d].score);
    }
    const s = [...all].sort((p, q) => p - q);
    const med = s[Math.floor(s.length / 2)];
    expect(med).toBeGreaterThan(35); expect(med).toBeLessThan(65);
    const hi = all.filter(x => x >= 80).length / all.length;
    expect(hi).toBeGreaterThan(0.02); expect(hi).toBeLessThan(0.3);
    expect(new Set(all).size).toBeGreaterThan(40);
  });
});

describe("出生時辰不詳", () => {
  it("紫微不納入、確定度不虛高、仍可計分", () => {
    const n = buildNatal(noTime);
    expect(n.unavailable.map(u => u.system)).toEqual(["ziwei"]);
    const a = analyze(n, "2026-09-27", TZ);
    expect(a.domains.career.signals.find(s => s.system === "ziwei")?.verdict).toBe("未納入");
    for (const d of DOMAIN_KEYS) expect(a.domains[d].confidence).toBeLessThanOrEqual(4);
  });
});

describe("事件模式、找時間、日期比較、時間尺度", () => {
  const n = buildNatal(subject);
  it("每種事件都能分析，未指定時間時選最佳時辰", () => {
    for (const t of EVENT_TYPES) {
      const e = analyzeEvent(n, t.key, "2026-10-05", null, TZ);
      expect(e.chosenBy).toBe("best");
      expect(e.slots).toHaveLength(8);
      expect(Math.max(...e.slots.map(s => s.score))).toBe(e.result.score);
      expect(e.advice.primaryAdvice).toBeTruthy();
      expect(e.advice.timeHorizon).toBe("atTime");
    }
    const fixed = analyzeEvent(n, "contract", "2026-10-05", "15:00", TZ);
    expect(fixed.time).toBe("15:00");
    expect(fixed.result.evidence.some(e => e.timescale === "hour")).toBe(true);
  });
  it("找時間回傳依分數排序的時段", () => {
    const xs = findEventTimes(n, "trip", "2026-10-01", 5, TZ);
    expect(xs).toHaveLength(5);
    for (let i = 1; i < xs.length; i++) expect(xs[i - 1].score).toBeGreaterThanOrEqual(xs[i].score);
  });
  it("日期比較每天各有特色與系統訊號", () => {
    const rows = compareDates(n, ["2026-10-01", "2026-10-02", "2026-10-03"], "travel", TZ);
    expect(rows).toHaveLength(3);
    for (const r of rows) { expect(r.feature).toMatch(/最有利/); expect(r.signals).toHaveLength(4); }
  });
  it("本週熱度、今年流月、人生時間軸", () => {
    expect(heatmap(n, "2026-09-27", 7, TZ)).toHaveLength(7);
    const ms = yearMonths(n, 2026, TZ);
    expect(ms).toHaveLength(12);
    expect(new Set(ms.map(m => m.gz)).size).toBe(12);
    const life = lifeTimeline(n, TZ, 2024, 2028);
    expect(life.decades).toHaveLength(10);
    expect(life.years).toHaveLength(5);
  });
});

describe("規則庫整體", () => {
  it("全部規則通過 lint、編號唯一", () => {
    const all = [...BAZI_RULES, ...ZIWEI_RULES, ...QIMEN_RULES, ...QIMEN_EVENT_RULES, ...ICHING_RULES];
    expect(all.map(r => ({ id: r.id, e: lintRule(r) })).filter(x => x.e.length)).toEqual([]);
    expect(RULE_IDS.size).toBe(all.length);
  });
});
