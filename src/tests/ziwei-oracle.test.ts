/** 紫微斗數交叉驗證（對照組：iztro 2.x，僅測試使用）：本命十二宮、星曜、亮度、四化、大限，以及流年流月流日命宮與四化。 */
import { it, expect } from "vitest";
import { computeZiweiNatal, computeZiweiTransit } from "@/core/ziwei";
import { defaultSchool } from "@/core/person";
import type { ChartInput } from "@/core/engine";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { astro } = require("iztro");
let seed = 11;
const rand = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
const pad = (n: number) => String(n).padStart(2, "0");
const B = "子丑寅卯辰巳午未申酉戌亥";
it("400 組隨機命盤與流運全部一致", () => {
  const cnt: Record<string, number> = {}; const ex: Record<string, string> = {};
  const bad = (k: string, msg: string) => { cnt[k] = (cnt[k] ?? 0) + 1; ex[k] ??= msg; };
  for (let i = 0; i < 400; i++) {
    const t = new Date(Date.UTC(1930, 0, 1) + Math.floor(rand() * 2.5e12 / 60000) * 60000);
    let [y, m, d, h, mi] = [t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate(), t.getUTCHours(), t.getUTCMinutes()];
    if (h === 23) h = 22;
    const g = rand() < 0.5 ? "male" : "female";
    const input = { personId: "x", gender: g, school: defaultSchool(""), birth: { personId: "x", localDate: `${y}-${pad(m)}-${pad(d)}`, localTime: `${pad(h)}:${pad(mi)}`, timeAccuracy: "exact", inputCalendar: "solar", place: { name: "", countryCode: "", lat: 0, lng: 120 }, timeZone: "Etc/GMT-8", dstOverride: "auto", useTrueSolarTime: false, schoolProfileId: "", createdAt: "", updatedAt: "" } } as ChartInput;
    const n = computeZiweiNatal(input);
    const ti = Math.floor(((h + 1) % 24) / 2);
    const a = astro.bySolar(`${y}-${m}-${d}`, ti, g === "male" ? "男" : "女", true, "zh-TW");
    const tag = `${y}-${m}-${d} ${h}:${mi} ${g}`;
    if (a.fiveElementsClass !== n.juName) bad("ju", `${tag} ${n.juName} vs ${a.fiveElementsClass}`);
    for (const p of a.palaces) {
      const b = B.indexOf(p.earthlyBranch);
      const ours = n.palaces[b];
      const theirName = p.name.replace("僕役", "交友").replace("官祿", "官祿");
      if (theirName !== ours.name && !(theirName === "命宮" && ours.name === "命宮")) bad("palaceName", `${tag} ${B[b]} ${ours.name} vs ${p.name}`);
      if (p.heavenlyStem !== "甲乙丙丁戊己庚辛壬癸"[ours.stem]) bad("stem", `${tag}`);
      const tm = p.majorStars.map((s: { name: string }) => s.name).sort().join(","), om = ours.major.map(s => s.name).sort().join(",");
      if (tm !== om) bad("major", `${tag} ${B[b]} ${om} vs ${tm}`);
      const tb = p.majorStars.map((s: { name: string; brightness: string }) => s.name + (s.brightness || "")).sort().join(","), ob = ours.major.map(s => s.name + s.brightness).sort().join(",");
      if (tb !== ob) bad("bright", `${tag} ${B[b]} ${ob} vs ${tb}`);
      const want = ["左輔", "右弼", "文昌", "文曲", "天魁", "天鉞", "擎羊", "陀羅", "火星", "鈴星", "地空", "地劫", "祿存", "天馬"];
      const tmin = p.minorStars.map((s: { name: string }) => s.name).filter((x: string) => want.includes(x)).sort().join(","), omin = ours.minor.map(s => s.name).sort().join(",");
      if (tmin !== omin) bad("minor", `${tag} ${B[b]} ${omin} vs ${tmin}`);
      const tadj = p.adjectiveStars.map((s: { name: string }) => s.name).filter((x: string) => ["咸池", "紅鸞", "天喜", "天刑", "天姚"].includes(x)).sort().join(","), oadj = [...ours.misc].sort().join(",");
      if (tadj !== oadj) bad("adj", `${tag} ${B[b]} ${oadj} vs ${tadj}`);
      const tmu = [...p.majorStars, ...p.minorStars].filter((s: { mutagen?: string }) => s.mutagen).map((s: { name: string; mutagen: string }) => s.name + s.mutagen).sort().join(",");
      const omu = [...ours.major, ...ours.minor].filter(s => s.hua).map(s => s.name + s.hua).sort().join(",");
      if (tmu !== omu) bad("hua", `${tag} ${B[b]} ${omu} vs ${tmu}`);
      if (p.decadal.range.join("-") !== ours.decade.join("-")) bad("decade", `${tag} ${B[b]} ${ours.decade} vs ${p.decadal.range}`);
    }
    if (B[n.bodyBranch] !== a.earthlyBranchOfBodyPalace) bad("body", tag);
    // 流運
    const q = new Date(Date.UTC(2024, 0, 1) + Math.floor(rand() * 7e10));
    const [qy, qm, qd] = [q.getUTCFullYear(), q.getUTCMonth() + 1, q.getUTCDate()];
    const tr = computeZiweiTransit(n, input.school, { civilDate: `${qy}-${pad(qm)}-${pad(qd)}`, civilTime: "12:00", timeZone: "Etc/GMT-8" });
    const hz = a.horoscope(`${qy}-${qm}-${qd}`, 6);
    const idx2b = (i: number) => B.indexOf(a.palaces[i].earthlyBranch);
    if (tr.scopes.year!.lifeBranch !== idx2b(hz.yearly.index)) bad("yearLife", tag);
    if (tr.scopes.month!.lifeBranch !== idx2b(hz.monthly.index)) bad("monthLife", `${tag} q=${qy}-${qm}-${qd} ours ${B[tr.scopes.month!.lifeBranch]} vs ${B[idx2b(hz.monthly.index)]}`);
    if (tr.scopes.day!.lifeBranch !== idx2b(hz.daily.index)) bad("dayLife", `${tag} q=${qy}-${qm}-${qd} ours ${B[tr.scopes.day!.lifeBranch]} vs ${B[idx2b(hz.daily.index)]}`);
    if (tr.scopes.decade && tr.scopes.decade.lifeBranch !== idx2b(hz.decadal.index)) bad("decadeLife", `${tag} age ${tr.nominalAge}`);
    const hm = (k: "yearly" | "daily" | "monthly") => hz[k].mutagen.join(",");
    const om = (s: "year" | "day" | "month") => (["祿", "權", "科", "忌"] as const).map(h => tr.scopes[s]!.hua[h].star).join(",");
    if (hm("yearly") !== om("year")) bad("yearHua", `${tag} ${om("year")} vs ${hm("yearly")}`);
    if (hm("daily") !== om("day")) bad("dayHua", `${tag} ${om("day")} vs ${hm("daily")}`);
    if (hm("monthly") !== om("month")) bad("monthHua", `${tag} ${om("month")} vs ${hm("monthly")}`);
  }
  if (Object.keys(cnt).length) console.log(cnt, ex);
  expect(cnt).toEqual({});
});
