import { describe, it, expect } from "vitest";
import { SAMPLES } from "../../scripts/calibrate-samples";
import { buildNatal, analyzeEvent, eventDayRow, eventRowsToCsv, csvFileName, type EventDayRow } from "@/core/analysis";
import { EVENT_TYPES } from "@/core/events";

const TZ = "Asia/Taipei";
const n = buildNatal(SAMPLES[4]);

describe("批次事件指數", () => {
  it("每天的分數與較佳、避開時段，和「分析這一天」完全一致", () => {
    for (const key of ["investment", "stoploss", "leverage", "work", "trip"]) {
      for (const date of ["2026-10-13", "2026-10-17", "2026-11-02"]) {
        const row = eventDayRow(n, key, date, TZ), e = analyzeEvent(n, key, date, null, TZ);
        expect(row.score, `${key} ${date}`).toBe(e.result.score);
        expect(row.time).toBe(e.time);
        expect(row.bestHours).toEqual(e.bestHours);
        expect(row.avoidHours).toEqual(e.avoidHours);
        expect(row.slots.map(s => s.score)).toEqual(e.slots.map(s => s.score));
        expect(row.confidenceLabel).toBe(e.result.confidenceLabel);
      }
    }
  });
  it("每種事件都能算一天", () => {
    for (const t of EVENT_TYPES) expect(eventDayRow(n, t.key, "2026-10-13", TZ).slots.length).toBeGreaterThan(0);
  });
});

describe("CSV 匯出", () => {
  const rows: EventDayRow[] = ["2026-10-13", "2026-10-14", "2026-10-17"].map(d => eventDayRow(n, "investment", d, TZ));
  const csv = eventRowsToCsv(rows, { person: "樣本", eventLabel: "投資" });
  const lines = csv.replace(/^﻿/, "").trim().split("\r\n");

  it("UTF-8 BOM、CRLF、每天一列", () => {
    expect(csv.startsWith("﻿")).toBe(true);
    expect(lines).toHaveLength(1 + rows.length);
  });
  it("欄位與數值正確，每列欄數相同", () => {
    const head = lines[0].split(",");
    expect(head.slice(0, 11)).toEqual(["人物", "事件", "日期", "星期", "事件指數", "等級", "解讀確定度", "最佳時辰", "最佳時間", "較佳時段", "避開時段"]);
    expect(head.length).toBe(11 + rows[0].slots.length);
    lines.slice(1).forEach((l, i) => {
      const c = l.split(",");
      expect(c.length).toBe(head.length);
      expect(c[2]).toBe(rows[i].date);
      expect(Number(c[4])).toBe(rows[i].score);
      expect(c[9]).toBe(rows[i].bestHours.join("、") || "當日各時辰差異不大");
      expect(c[10]).toBe(rows[i].avoidHours.join("、") || "無明顯需避開");
      expect(c.slice(11).map(Number)).toEqual(rows[i].slots.map(s => s.score));
    });
  });
  it("2026-10-17 是週六", () => { expect(lines[3].split(",")[3]).toBe("週六"); });
  it("含逗號、引號的文字會加引號；以 = 開頭的文字不會被當成公式", () => {
    const x = eventRowsToCsv(rows.slice(0, 1), { person: '=HYPERLINK("x")', eventLabel: "a,b" });
    const l = x.replace(/^﻿/, "").split("\r\n")[1];
    expect(l.startsWith(`"'=HYPERLINK(""x"")","a,b",`)).toBe(true);
  });
  it("沒有資料時只有標題列；檔名安全", () => {
    expect(eventRowsToCsv([], { person: "樣本", eventLabel: "投資" }).trim().split("\r\n")).toHaveLength(1);
    expect(csvFileName("investment", "2026-10-13", "2026-11-11")).toBe("event_index_investment_2026-10-13_2026-11-11.csv");
    expect(csvFileName("../a b", "2026-10-13", "2026-11-11")).toBe("event_index_ab_2026-10-13_2026-11-11.csv");
  });
});
