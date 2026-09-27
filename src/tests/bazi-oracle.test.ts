/** 八字本命交叉驗證：大運干支、起運歲數、十二長生（對照組：lunar-javascript，僅測試使用）。 */
import { describe, it, expect } from "vitest";
import { computeBaziNatal } from "@/core/bazi/natal";
import { defaultSettings } from "@/core/person";
import type { ChartInput } from "@/core/engine";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Solar } = require("lunar-javascript");
let seed = 7;
const rand = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
const pad = (n: number) => String(n).padStart(2, "0");
const SIMP: Record<string, string> = { 長生: "长生", 冠帶: "冠带", 臨官: "临官", 養: "养", 絕: "绝" };

describe("大運與十二長生（800 組隨機命盤）", () => {
  it("大運干支完全一致、起運年月一致、起運日誤差 ≤ 1 日", () => {
    const bad: string[] = [];
    for (let i = 0; i < 800; i++) {
      const t = new Date(Date.UTC(1920, 0, 1) + Math.floor(rand() * 2.8e12 / 60000) * 60000);
      const [y, m, d, h, mi] = [t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate(), t.getUTCHours(), t.getUTCMinutes()];
      const g = rand() < 0.5 ? "male" : "female";
      const input = { personId: "x", gender: g, settings: defaultSettings(""), birth: { personId: "x", localDate: `${y}-${pad(m)}-${pad(d)}`, localTime: `${pad(h)}:${pad(mi)}`, timeAccuracy: "exact", inputCalendar: "solar", place: { name: "", countryCode: "", lat: 0, lng: 120 }, timeZone: "Etc/GMT-8", dstOverride: "auto", useTrueSolarTime: false, timeBasis: "civilStandard", calculationSettingsId: "", createdAt: "", updatedAt: "" } } as ChartInput;
      const n = computeBaziNatal(input);
      const ec = Solar.fromYmdHms(y, m, d, h, mi, 0).getLunar().getEightChar();
      const yun = ec.getYun(g === "male" ? 1 : 0, 2);
      const dy = yun.getDaYun().slice(1, 9).map((x: { getGanZhi(): string }) => x.getGanZhi()).join("");
      if (dy !== n.luck.cycles.slice(0, 8).map(c => c.gz.text).join("")) bad.push(`大運 ${y}-${m}-${d}`);
      if (yun.getStartYear() !== n.luck.start.years || yun.getStartMonth() !== n.luck.start.months || Math.abs(yun.getStartDay() - n.luck.start.days) > 1) bad.push(`起運 ${y}-${m}-${d}`);
      const st = n.details[2].dmStage;
      if (ec.getDayDiShi() !== (SIMP[st] ?? st)) bad.push(`長生 ${y}-${m}-${d}`);
    }
    expect(bad).toEqual([]);
  });
});
