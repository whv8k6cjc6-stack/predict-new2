import { describe, it, expect } from "vitest";
import { resolveCivil, resolveBirth } from "@/core/calendar/resolve";
import { fourPillars } from "@/core/calendar/pillars";
import { toLunar, fromLunar, leapMonthOf, preciseTermJD } from "@/core/calendar/precise";
import { utcMsFromJd } from "@/core/calendar/astro";
import { DEFAULT_SETTINGS_ID, type BirthProfile } from "@/core/person";

const P = (date: string, time: string, tz = "Etc/GMT-8", zi: "lateZiSameDay" | "earlyZiNextDay" = "lateZiSameDay") => {
  const p = fourPillars(resolveCivil({ date, time, timeZone: tz }), zi);
  return [p.year.text, p.month.text, p.day.text, p.hour?.text].join(" ");
};

describe("公開已知命例（出版常見之八字）", () => {
  it("毛澤東 1893-12-26 辰時", () => expect(P("1893-12-26", "08:00")).toBe("癸巳 甲子 丁酉 甲辰"));
  it("蔣中正 1887-10-31 午時", () => expect(P("1887-10-31", "12:00")).toBe("丁亥 庚戌 己巳 庚午"));
  it("孫中山 1866-11-12 寅時", () => expect(P("1866-11-12", "04:00")).toBe("丙寅 己亥 辛卯 庚寅"));
  it("1988-01-14 01:15（立春前仍屬丁卯年）", () => expect(P("1988-01-14", "01:15")).toBe("丁卯 癸丑 戊辰 癸丑"));
});

describe("節氣時刻（中央氣象署／香港天文台公告值，容許 ±2 分）", () => {
  const cases: [number, number, string][] = [
    [2020, 0, "2020-02-04T17:03"], [2021, 0, "2021-02-03T22:59"], [2022, 0, "2022-02-04T04:51"],
    [2023, 0, "2023-02-04T10:42"], [2024, 0, "2024-02-04T16:27"], [2025, 0, "2025-02-03T22:10"], [2026, 0, "2026-02-04T04:02"],
  ];
  for (const [y, idx, local] of cases) it(`${y} 立春 ${local.slice(11)}`, () => {
    const ms = utcMsFromJd(preciseTermJD(y, idx));
    const expected = Date.parse(local + ":00+08:00");
    expect(Math.abs(ms - expected) / 60000).toBeLessThanOrEqual(2);
  });
});

describe("時區、夏令時間與真太陽時", () => {
  it("台灣 1975-07-01 10:30 為夏令時間，扣回標準時間 09:30（巳時）", () => {
    const r = resolveCivil({ date: "1975-07-01", time: "10:30", timeZone: "Asia/Taipei" });
    expect(r.civil.isDST).toBe(true);
    expect(r.chartLocal.h).toBe(9);
    expect(fourPillars(r, "lateZiSameDay").hour!.text[1]).toBe("巳");
  });
  it("夏令時間手動關閉時不扣除", () => {
    const r = resolveCivil({ date: "1975-07-01", time: "10:30", timeZone: "Asia/Taipei", dstOverride: "off" });
    expect(r.chartLocal.h).toBe(10);
  });
  it("真太陽時：台南（120.21°E）比東經 120° 標準時多約 0.8 分，再加均時差", () => {
    const r = resolveCivil({ date: "2026-11-03", time: "12:00", timeZone: "Asia/Taipei", trueSolar: { longitude: 120.21 } });
    expect(r.corrections.longitudeMinutes).toBeCloseTo(0.84, 1);
    expect(r.corrections.eotMinutes).toBeGreaterThan(16);   // 11 月初均時差約 +16.4 分
    expect(r.chartLocal.h * 60 + r.chartLocal.mi).toBeGreaterThanOrEqual(12 * 60 + 16);
  });
  it("東京出生：年月柱依絕對時刻、日時柱依當地時間", () => {
    const r = resolveCivil({ date: "2000-01-01", time: "00:30", timeZone: "Asia/Tokyo" });
    const p = fourPillars(r, "lateZiSameDay");
    expect(p.day.text).toBe("戊午");          // 當地 2000-01-01
    expect(p.hour!.text[1]).toBe("子");
  });
  it("子時換日：23:30 依流派不同日柱", () => {
    expect(P("2000-01-01", "23:30", "Etc/GMT-8", "lateZiSameDay").split(" ")[2]).toBe("戊午");
    expect(P("2000-01-01", "23:30", "Etc/GMT-8", "earlyZiNextDay").split(" ")[2]).toBe("己未");
  });
});

describe("農曆", () => {
  const cny: [number, string][] = [[1975, "1975-02-11"], [1988, "1988-02-17"], [2000, "2000-02-05"], [2020, "2020-01-25"], [2024, "2024-02-10"], [2025, "2025-01-29"], [2026, "2026-02-17"]];
  for (const [y, d] of cny) it(`${y} 年正月初一為 ${d}`, () => {
    const s = fromLunar(y, 1, 1, false);
    expect(`${s.y}-${String(s.m).padStart(2, "0")}-${String(s.d).padStart(2, "0")}`).toBe(d);
  });
  it("閏月：2020 閏四月、2023 閏二月、2025 閏六月", () => {
    expect(leapMonthOf(2020)).toBe(4); expect(leapMonthOf(2023)).toBe(2); expect(leapMonthOf(2025)).toBe(6);
  });
  it("不存在的閏月會被拒絕", () => expect(() => fromLunar(2024, 5, 1, true)).toThrow());
  it("1988-01-14 為農曆 1987 年冬月（十一月）廿五", () => expect(toLunar(1988, 1, 14)).toMatchObject({ year: 1987, month: 11, day: 25, isLeap: false }));
  it("農曆輸入生日會換算成國曆再排盤", () => {
    const b: BirthProfile = {
      personId: "x", localDate: "", localTime: "08:00", timeAccuracy: "exact", inputCalendar: "lunar",
      lunarInput: { year: 2023, month: 2, day: 15, isLeap: true },
      place: { name: "台北", countryCode: "TW", lat: 25.04, lng: 121.56 }, timeZone: "Asia/Taipei", dstOverride: "auto",
      useTrueSolarTime: false, timeBasis: "civilStandard", calculationSettingsId: DEFAULT_SETTINGS_ID, createdAt: "", updatedAt: "",
    };
    const r = resolveBirth(b);
    expect(r.civil.date).toBe("2023-04-05");
    expect(r.steps[0]).toContain("閏2 月");
  });
});
