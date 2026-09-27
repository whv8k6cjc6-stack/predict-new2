import { describe, it, expect } from "vitest";
import { computeBazi } from "@/legacy/engines/bazi";
import { computeZiwei } from "@/legacy/engines/ziwei";
import { computeQimen } from "@/legacy/engines/qimen";
import { lunarDate } from "@/legacy/engines/calendar/lunar";
import type { Profile } from "@/legacy/profile";

const p: Profile = {
  id: "t", name: "測試", gender: "male",
  birthDate: "1988-01-14", birthTime: "01:15", birthTimeAccuracy: "exact",
  birthPlace: { country: "TW", city: "Tainan", timezone: "Asia/Taipei", longitude: 120.2, latitude: 23 },
  calendarType: "solar", useTrueSolarTime: false, ziRule: "lateZi", notes: "",
  createdAt: "", updatedAt: "",
};

describe("農曆", () => {
  it("2000-02-05 為農曆正月初一", () => {
    const l = lunarDate(2000, 2, 5);
    expect(l.month).toBe(1); expect(l.day).toBe(1); expect(l.isLeap).toBe(false);
  });
  it("2023-03-22 起為閏二月", () => {
    const l = lunarDate(2023, 3, 25);
    expect(l.month).toBe(2); expect(l.isLeap).toBe(true);
  });
});

describe("引擎煙霧測試", () => {
  it("八字可排盤且喜忌互斥", () => {
    const c = computeBazi(p);
    expect(c.favorable.length + c.unfavorable.length).toBe(5);
    expect(c.luckCycles).toHaveLength(8);
  });
  it("紫微可排盤且 14 主星齊全", () => {
    const z = computeZiwei(p)!;
    const all = Object.values(z.stars).flat();
    for (const s of ["紫微","天府","太陽","太陰","武曲","貪狼","巨門","廉貞","天相","天梁","七殺","破軍","天機","天同"])
      expect(all).toContain(s);
  });
  it("奇門可起局且九宮齊全", () => {
    const q = computeQimen(2026, 6, 13, "10:00");
    for (const pal of [1,2,3,4,6,7,8,9]) {
      expect(q.doors[pal]).toBeTruthy();
      expect(q.ground[pal]).toBeTruthy();
    }
  });
});
