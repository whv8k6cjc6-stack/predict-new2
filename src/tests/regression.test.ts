import { describe, it, expect } from "vitest";
import { lunarDate } from "@/engines/calendar/lunar";
import { branchRelation } from "@/engines/bazi";
import { matchCondition } from "@/engines/rule-engine/match";

// v1.3 深度複查修正的回歸鎖定

describe("農曆閏月：2000 年前（朔望月序號為負）", () => {
  it("1995-10-01 為閏八月初七", () => {
    expect(lunarDate(1995, 10, 1)).toMatchObject({ month: 8, day: 7, isLeap: true });
  });
  it("1998-07-01 為閏五月初八", () => {
    expect(lunarDate(1998, 7, 1)).toMatchObject({ month: 5, day: 8, isLeap: true });
  });
  it("1990-06-23 為閏五月初一", () => {
    expect(lunarDate(1990, 6, 23)).toMatchObject({ month: 5, day: 1, isLeap: true });
  });
});

describe("農曆：2033 閏十一月（冬至月修正一致性）", () => {
  it("2033-08-25 為八月初一（非閏七月）", () => {
    expect(lunarDate(2033, 8, 25)).toMatchObject({ month: 8, day: 1, isLeap: false });
  });
  it("2033-10-25 為十月初三", () => {
    expect(lunarDate(2033, 10, 25)).toMatchObject({ month: 10, day: 3, isLeap: false });
  });
  it("2033-12-31 為閏十一月初十", () => {
    expect(lunarDate(2033, 12, 31)).toMatchObject({ month: 11, day: 10, isLeap: true });
  });
  it("2034-01-01 為閏十一月十一（跨國曆年界仍為閏月）", () => {
    expect(lunarDate(2034, 1, 1)).toMatchObject({ month: 11, day: 11, isLeap: true });
  });
});

describe("地支自刑：辰午酉亥", () => {
  it("辰辰、午午、酉酉、亥亥 為刑", () => {
    for (const b of [4, 6, 9, 11]) expect(branchRelation(b, b)).toBe("刑");
  });
  it("卯卯、巳巳、申申 非自刑", () => {
    for (const b of [3, 5, 8]) expect(branchRelation(b, b)).toBe("");
  });
});

describe("規則引擎：{{欄位}} 引用與 not_contains", () => {
  const facts = { favorableElements: ["木", "水"], dayFortuneElement: "木" };
  it("not_contains + 欄位引用：喜用含流日五行時不成立", () => {
    expect(matchCondition({ field: "favorableElements", op: "not_contains", value: "{{dayFortuneElement}}" }, facts)).toBe(false);
  });
  it("not_contains + 欄位引用：喜用不含流日五行時成立", () => {
    expect(matchCondition({ field: "favorableElements", op: "not_contains", value: "{{dayFortuneElement}}" }, { ...facts, dayFortuneElement: "火" })).toBe(true);
  });
});
