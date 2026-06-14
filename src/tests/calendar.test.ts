import { describe, it, expect } from "vitest";
import { dayPillar, fourPillars, yearPillar } from "@/engines/calendar/ganzhi";
import { termJDOfYear, jdFromLocal } from "@/engines/calendar/astro";

describe("日柱錨點", () => {
  it("1949-10-01 為甲子日", () => {
    expect(dayPillar(1949, 10, 1).text).toBe("甲子");
  });
  it("2000-01-01 為戊午日", () => {
    expect(dayPillar(2000, 1, 1).text).toBe("戊午");
  });
  it("2024-01-01 為甲子日", () => {
    expect(dayPillar(2024, 1, 1).text).toBe("甲子");
  });
});

describe("月柱（五虎遁）", () => {
  it("2000-03-21 春分為己卯月", () => {
    const fp = fourPillars(2000, 3, 21, "12:00");
    expect(fp.month.text).toBe("己卯");
  });
});

describe("時柱（五鼠遁）", () => {
  it("甲日子時為甲子時", () => {
    const fp = fourPillars(2024, 1, 1, "00:30");
    expect(fp.hour?.text).toBe("甲子");
  });
});

describe("節氣", () => {
  it("2000 年立春在 2 月 4 日（UTC+8）", () => {
    const jd = termJDOfYear(2000, 0);
    const ref = jdFromLocal(2000, 2, 4, 0);
    expect(jd).toBeGreaterThanOrEqual(ref);
    expect(jd).toBeLessThan(ref + 1);
  });
  it("2000 年冬至在 12 月 21 日（UTC+8）", () => {
    const jd = termJDOfYear(2000, 21);
    const ref = jdFromLocal(2000, 12, 21, 0);
    expect(jd).toBeGreaterThanOrEqual(ref);
    expect(jd).toBeLessThan(ref + 1);
  });
});

describe("年柱立春界", () => {
  it("2000-01-30（立春前）仍屬己卯年", () => {
    expect(yearPillar(2000, 1, 30, 12).text).toBe("己卯");
  });
  it("2000-02-10（立春後）屬庚辰年", () => {
    expect(yearPillar(2000, 2, 10, 12).text).toBe("庚辰");
  });
});

describe("四柱", () => {
  it("可完整排出含時柱之四柱", () => {
    const fp = fourPillars(1988, 1, 14, "01:15");
    expect(fp.year.text).toBe("丁卯"); // 1988-01-14 在立春前
    expect(fp.hour).not.toBeNull();
  });
});
