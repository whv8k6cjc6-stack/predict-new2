/** 時區工具（Calendar Engine 的一部分）：以瀏覽器內建 IANA 時區資料計算某地某時的 UTC 偏移，
 *  可正確反映歷史夏令時間（例：台灣 1974–1975、1979 年）。第二階段將以此為基礎完成完整曆法換算。 */

function offsetMinutesAtUTC(utcMs: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "longOffset" }).formatToParts(new Date(utcMs));
  const tz = parts.find(p => p.type === "timeZoneName")?.value ?? "GMT";
  const m = tz.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/);
  if (!m) return 0;
  const sign = m[1] === "-" ? -1 : 1;
  return sign * (Number(m[2]) * 60 + Number(m[3] ?? 0));
}

/** 當地民用時間 → UTC 偏移（分鐘）與是否為夏令時間 */
export function localOffset(date: string, time: string, timeZone: string): { offsetMinutes: number; isDST: boolean; standardMinutes: number } {
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  const wall = Date.UTC(y, mo - 1, d, h, mi);
  let off = offsetMinutesAtUTC(wall, timeZone);
  off = offsetMinutesAtUTC(wall - off * 60_000, timeZone);
  const standardMinutes = Math.min(offsetMinutesAtUTC(Date.UTC(y, 0, 15), timeZone), offsetMinutesAtUTC(Date.UTC(y, 6, 15), timeZone));
  return { offsetMinutes: off, isDST: off > standardMinutes, standardMinutes };
}

export const formatOffset = (min: number) => {
  const s = min < 0 ? "-" : "+"; const a = Math.abs(min);
  return `UTC${s}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(a % 60).padStart(2, "0")}`;
};

export function isValidTimeZone(tz: string): boolean {
  try { new Intl.DateTimeFormat("en-US", { timeZone: tz }); return true; } catch { return false; }
}
