import { describe, it, expect } from "vitest";
import { localOffset, formatOffset } from "@/core/calendar/tz";

describe("時區與夏令時間", () => {
  it("台北一般日期為 UTC+08:00", () => {
    expect(localOffset("1988-01-14", "01:15", "Asia/Taipei")).toMatchObject({ offsetMinutes: 480, isDST: false });
  });
  it("台灣 1975 年 7 月實施夏令時間，為 UTC+09:00", () => {
    expect(localOffset("1975-07-01", "12:00", "Asia/Taipei")).toMatchObject({ offsetMinutes: 540, isDST: true });
  });
  it("台灣 1979 年 8 月夏令時間", () => {
    expect(localOffset("1979-08-15", "08:00", "Asia/Taipei").isDST).toBe(true);
  });
  it("東京、紐約（夏季）", () => {
    expect(localOffset("2020-03-01", "10:00", "Asia/Tokyo").offsetMinutes).toBe(540);
    expect(localOffset("2020-07-01", "10:00", "America/New_York")).toMatchObject({ offsetMinutes: -240, isDST: true });
  });
  it("格式化", () => { expect(formatOffset(540)).toBe("UTC+09:00"); expect(formatOffset(-300)).toBe("UTC-05:00"); });
});
