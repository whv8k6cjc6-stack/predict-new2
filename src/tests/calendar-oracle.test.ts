/** 曆法引擎交叉驗證：以獨立開源函式庫 lunar-javascript 的八字結果為對照組（僅測試使用）。 */
import { describe, it, expect } from "vitest";
import { resolveCivil } from "@/core/calendar/resolve";
import { fourPillars } from "@/core/calendar/pillars";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Solar } = require("lunar-javascript");

let seed = 20260927;
const rand = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
const pad = (n: number) => String(n).padStart(2, "0");

function sample(n: number) {
  const out: { y: number; m: number; d: number; h: number; mi: number }[] = [];
  const start = Date.UTC(1901, 1, 20), end = Date.UTC(2099, 11, 31);
  for (let i = 0; i < n; i++) {
    const t = new Date(start + Math.floor(rand() * (end - start) / 60000) * 60000);
    out.push({ y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate(), h: t.getUTCHours(), mi: t.getUTCMinutes() });
  }
  return out;
}

describe("四柱與 lunar-javascript 交叉驗證（UTC+8、標準時間）", () => {
  for (const [rule, sect] of [["lateZiSameDay", 2], ["earlyZiNextDay", 1]] as const) {
    it(`${rule}：5000 個隨機時刻四柱全部一致`, () => {
      const bad: string[] = [];
      for (const s of sample(5000)) {
        const r = resolveCivil({ date: `${s.y}-${pad(s.m)}-${pad(s.d)}`, time: `${pad(s.h)}:${pad(s.mi)}`, timeZone: "Etc/GMT-8" });
        const p = fourPillars(r, rule);
        const ec = Solar.fromYmdHms(s.y, s.m, s.d, s.h, s.mi, 0).getLunar().getEightChar();
        ec.setSect(sect);
        const ours = [p.year.text, p.month.text, p.day.text, p.hour!.text].join(" ");
        const theirs = [ec.getYear(), ec.getMonth(), ec.getDay(), ec.getTime()].join(" ");
        if (ours !== theirs) bad.push(`${JSON.stringify(s)} ours=${ours} lunar=${theirs}`);
      }
      if (bad.length) console.log(bad.slice(0, 10).join("\n"));
      expect(bad.length).toBe(0);
    });
  }

  it("交節前後 1 分鐘：月柱正確切換（2024 立春 16:27 附近）", () => {
    const a = fourPillars(resolveCivil({ date: "2024-02-04", time: "16:26", timeZone: "Asia/Taipei" }), "lateZiSameDay");
    const b = fourPillars(resolveCivil({ date: "2024-02-04", time: "16:28", timeZone: "Asia/Taipei" }), "lateZiSameDay");
    expect(a.year.text + a.month.text).toBe("癸卯乙丑");
    expect(b.year.text + b.month.text).toBe("甲辰丙寅");
  });
});
