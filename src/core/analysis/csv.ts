/** 批次事件指數 → CSV。UTF-8 含 BOM（Excel 直接開啟中文不亂碼）、CRLF 換行；
 *  文字欄位以 = + - @ 開頭時前面補單引號，避免被試算表當成公式執行。 */
import type { EventDayRow } from "./index";

const WEEK = ["日", "一", "二", "三", "四", "五", "六"];
export const weekdayOf = (date: string) => `週${WEEK[new Date(`${date}T00:00:00Z`).getUTCDay()]}`;

const cell = (v: string | number): string => {
  let s = String(v);
  if (typeof v === "string" && /^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const line = (xs: (string | number)[]) => xs.map(cell).join(",");

export interface CsvMeta { person: string; eventLabel: string }

export function eventRowsToCsv(rows: EventDayRow[], meta: CsvMeta): string {
  const hourCols = rows[0]?.slots.map(s => s.hour) ?? [];
  const head = ["人物", "事件", "日期", "星期", "事件指數", "等級", "解讀確定度", "最佳時辰", "最佳時間", "較佳時段", "避開時段", ...hourCols.map(h => `${h}分數`)];
  const body = rows.map(r => line([
    meta.person, meta.eventLabel, r.date, weekdayOf(r.date), r.score, r.band.label, r.confidenceLabel, r.hour, r.time,
    r.bestHours.join("、") || "當日各時辰差異不大", r.avoidHours.join("、") || "無明顯需避開",
    ...hourCols.map((_, i) => r.slots[i]?.score ?? ""),
  ]));
  return "﻿" + [line(head), ...body].join("\r\n") + "\r\n";
}

/** 檔名只用英數字：部分瀏覽器遇到中文檔名會丟掉檔名與副檔名，造成打不開 */
export const csvFileName = (eventKey: string, from: string, to: string) =>
  `event_index_${eventKey.replace(/[^A-Za-z0-9]+/g, "")}_${from}_${to}.csv`;
