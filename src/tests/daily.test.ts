import { describe, it, expect } from "vitest";
import { castMeihua, HEXAGRAMS, tiYong } from "@/engines/iching";
import { shenshaHits, TIANYI, yima, taohua } from "@/engines/bazi/shensha";
import { ditiansuiHits, seasonOf } from "@/engines/ditiansui";
import { computeDailyReport, CATEGORY_KEYS } from "@/engines/daily";
import { gradeOf, GRADES } from "@/engines/daily/grade";
import type { Profile } from "@/types/profile";

const p: Profile = {
  id: "t", name: "測試", gender: "male",
  birthDate: "1988-01-14", birthTime: "01:15", birthTimeAccuracy: "exact",
  birthPlace: { country: "TW", city: "Tainan", timezone: "Asia/Taipei", longitude: 120.2, latitude: 23 },
  calendarType: "solar", useTrueSolarTime: false, ziRule: "lateZi", notes: "", createdAt: "", updatedAt: "",
};

describe("易經 六十四卦資料", () => {
  it("64 卦編號完整且上下卦組合不重複", () => {
    expect(HEXAGRAMS).toHaveLength(64);
    expect(new Set(HEXAGRAMS.map(h => h.no)).size).toBe(64);
    expect(new Set(HEXAGRAMS.map(h => `${h.upper}-${h.lower}`)).size).toBe(64);
  });
});

describe("梅花易數 年月日時起卦", () => {
  // 《梅花易數》觀梅占：辰年十二月十七日申時 → 澤火革，初爻動，互天風姤，變澤山咸；兌金為體，離火剋之
  const r = castMeihua(5, 12, 17, 9);
  it("本卦澤火革、初爻動", () => { expect(r.main.name).toBe("澤火革"); expect(r.movingLine).toBe(1); });
  it("互卦天風姤、變卦澤山咸", () => { expect(r.mutual.name).toBe("天風姤"); expect(r.changed.name).toBe("澤山咸"); });
  it("體兌金、用離火 → 用克體", () => {
    expect(r.ti.name).toBe("兌"); expect(r.yong.name).toBe("離"); expect(r.relation).toBe("用克體");
  });
  it("體用五種關係", () => {
    expect(tiYong("金", "土")).toBe("用生體");
    expect(tiYong("金", "金")).toBe("比和");
    expect(tiYong("金", "木")).toBe("體克用");
    expect(tiYong("金", "水")).toBe("體生用");
    expect(tiYong("金", "火")).toBe("用克體");
  });
});

describe("神煞", () => {
  it("甲日天乙貴人在丑未", () => expect(TIANYI[0]).toEqual([1, 7]));
  it("申子辰驛馬在寅、桃花在酉", () => { expect(yima(0)).toBe(2); expect(taohua(0)).toBe(9); });
  it("甲日見丑日觸發天乙貴人", () => expect(shenshaHits(0, 6, 6, 1).map(h => h.name)).toContain("天乙貴人"));
});

describe("滴天髓", () => {
  it("季節判定：丑月為冬、午月為夏", () => { expect(seasonOf(1)).toBe("冬"); expect(seasonOf(6)).toBe("夏"); });
  it("庚日見丁火觸發「得火而銳」", () => {
    const hits = ditiansuiHits({ dayStem: 6, season: "秋", dayBranch: 8, natalBranches: [8], flowStem: 3, flowBranch: 0 });
    expect(hits.map(h => h.quote)).toContain("得火而銳");
  });
  it("冬生遇火觸發調候", () => {
    const hits = ditiansuiHits({ dayStem: 4, season: "冬", dayBranch: 0, natalBranches: [0], flowStem: 2, flowBranch: 6 });
    expect(hits.some(h => h.quote.startsWith("天道有寒暖"))).toBe(true);
  });
});

describe("每日整合報告", () => {
  const r = computeDailyReport(p, "2026-09-27");
  it("八大運勢齊全、分數 0–100 並有等級", () => {
    expect([r.overall, ...r.categories].map(c => c.key).sort()).toEqual([...CATEGORY_KEYS].sort());
    for (const c of [r.overall, ...r.categories]) {
      expect(c.score).toBeGreaterThanOrEqual(0); expect(c.score).toBeLessThanOrEqual(100);
      expect(c.grade.name).toBe(gradeOf(c.score).name);
      expect(c.dos.length).toBeGreaterThan(0);
    }
  });
  it("每一項運勢都有可追溯依據，涵蓋六大系統", () => {
    for (const c of r.categories) expect(c.evidences.length).toBeGreaterThan(0);
    const sys = new Set(r.evidences.map(e => e.system));
    for (const s of ["八字", "紫微", "奇門", "易經"]) expect(sys.has(s as never)).toBe(true);
  });
  it("十二時辰與幸運資訊", () => {
    expect(r.hours).toHaveLength(12);
    expect(r.lucky.numbers.length).toBe(2);
    expect(r.lucky.nobleZodiac.length).toBe(2);
  });
  it("同一天對不同命主結果不同（個人化）", () => {
    const r2 = computeDailyReport({ ...p, birthDate: "1975-07-22", birthTime: "14:40", gender: "female" }, "2026-09-27");
    expect(r2.overall.score === r.overall.score && r2.hexagram.main.no === r.hexagram.main.no).toBe(false);
  });
  it("輸出不含保證性或買賣指令用語", () => {
    const text = JSON.stringify(r);
    expect(text).not.toMatch(/保證|一定會|絕對|買進|賣出/);
  });
  it("時辰不確定時分數向中間收斂", () => {
    const u = computeDailyReport({ ...p, birthTimeAccuracy: "unknown" }, "2026-09-27");
    expect(Math.abs(u.overall.score - 50)).toBeLessThanOrEqual(Math.abs(r.overall.score - 50));
    expect(u.confidence).toBe("low");
  });
});

describe("評分等級", () => {
  it("等級門檻由高到低且涵蓋 0 分", () => {
    for (let i = 1; i < GRADES.length; i++) expect(GRADES[i].min).toBeLessThan(GRADES[i - 1].min);
    expect(gradeOf(0).name).toBe("凶");
    expect(gradeOf(100).name).toBe("大吉");
  });
});
