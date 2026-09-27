/** 金樣本快照格式（只讀取引擎輸出，不含任何排盤邏輯）。
 *  重構後的新模組必須能輸出「完全相同」的快照；若快照格式本身需要擴充，只能新增欄位，不能改變既有欄位的值。 */
import { computeZiweiNatal, computeZiweiTransit, type ZiweiNatal } from "@/core/ziwei";
import { resolveBirth } from "@/core/calendar/resolve";
import { BaziEngine } from "@/core/bazi";
import { QimenEngine } from "@/core/qimen";
import { IchingEngine } from "@/core/iching";
import { defaultSchool, DEFAULT_SCHOOL_ID, type BirthProfile, type Gender, type SchoolProfile } from "@/core/person";
import type { ChartInput } from "@/core/engine";

export const SNAPSHOT_FORMAT = "golden-v1";
const B = "子丑寅卯辰巳午未申酉戌亥";

/** 金樣本產生時已存在的兩組流派設定（重構前狀態）。之後會對應到 iztro_compatible_v1 與 legacy 自訂 Profile。 */
export const PRE_REFACTOR_SETTINGS: Record<string, SchoolProfile> = {
  "pre-refactor-default": defaultSchool(""),
  "pre-refactor-earlyZi": { ...defaultSchool(""), id: "school-legacy-earlyzi", name: "早子時換日（由舊版設定匯入）", isDefault: false, bazi: { school: "子平・滴天髓闡微", ziHour: "earlyZiNextDay" } },
};

export interface FixtureInput {
  gender: Gender;
  localDate: string; localTime: string | null;
  timeZone: string;
  place: { name: string; lat: number; lng: number };
  useTrueSolarTime: boolean;
  dstOverride?: "auto" | "on" | "off";
}

export interface VerificationStatus {
  ruleVerified: boolean;           // Level 1：依已選定規則人工／單元測試推導
  iztroMatched: boolean | null;    // Level 2：與 iztro 2.6.1（IZTRO_COMPAT_CONFIG）相容（null＝不適用，例如時辰不詳）
  iztroDefaultMatched: boolean | null; // 參考：與 iztro 預設設定（dayDivide=forward）是否相同
  secondSourceVerified: boolean;   // Level 3：第二套獨立排盤軟體
  classicalSourceVerified: boolean;// Level 3：古籍／可靠書籍表格
  notes?: string;
}

export const toBirth = (x: FixtureInput): BirthProfile => ({
  personId: "fixture", localDate: x.localDate, localTime: x.localTime, timeAccuracy: x.localTime ? "exact" : "unknown",
  inputCalendar: "solar", place: { name: x.place.name, countryCode: "", lat: x.place.lat, lng: x.place.lng },
  timeZone: x.timeZone, dstOverride: x.dstOverride ?? "auto", useTrueSolarTime: x.useTrueSolarTime,
  schoolProfileId: DEFAULT_SCHOOL_ID, createdAt: "", updatedAt: "",
});
export const toInput = (x: FixtureInput, settings: string): ChartInput => ({ personId: "fixture", gender: x.gender, birth: toBirth(x), school: PRE_REFACTOR_SETTINGS[settings] });

/** 紫微本命盤快照：一宮一行，欄位以「|」分隔，便於人工閱讀與 diff */
export function palaceLines(n: ZiweiNatal): string[] {
  return n.palaces.map(p => [
    B[p.branch], p.gz, p.name,
    p.major.map(s => s.name + (s.brightness || "_") + (s.hua ?? "")).join(",") || "-",
    p.minor.map(s => s.name + (s.hua ?? "")).join(",") || "-",
    p.misc.join(",") || "-",
    p.decade.join("-"),
  ].join("|"));
}

export interface GoldenExpected {
  calendar: { chartLocal: string; basis: string; correctionMinutes: number; eotMinutes: number; longitudeMinutes: number; dstMinutes: number };
  ziwei:
    | { ok: false; error: string }
    | {
        ok: true;
        lunar: string; effectiveMonth: number; yearGz: string; hour: string;
        life: string; body: string; bodyPalace: string; bureau: string; forward: boolean;
        birthHua: string; notes: string[];
        palaces: string[];
        transits: { date: string; nominalAge: number; decade: string | null; year: string; month: string; day: string }[];
      };
  crossSystem: { baziPillars: string; qimenNianMing: string | null; ichingPersonalNo: number | null };
}

export const TRANSIT_DATES = ["2026-09-27", "2027-02-06", "2030-07-01"];

export function snapshot(x: FixtureInput, settings: string): GoldenExpected {
  const input = toInput(x, settings);
  const r = resolveBirth(input.birth);
  const L = r.chartLocal;
  const pad = (v: number) => String(v).padStart(2, "0");
  const calendar = {
    chartLocal: `${L.y}-${pad(L.m)}-${pad(L.d)} ${pad(L.h)}:${pad(L.mi)}`, basis: L.basis,
    correctionMinutes: round2(r.corrections.totalFromCivil), eotMinutes: round2(r.corrections.eotMinutes),
    longitudeMinutes: round2(r.corrections.longitudeMinutes), dstMinutes: r.corrections.dstMinutes,
  };
  let ziwei: GoldenExpected["ziwei"];
  try {
    const n = computeZiweiNatal(input);
    const transits = TRANSIT_DATES.map(date => {
      const t = computeZiweiTransit(n, input.school, { civilDate: date, civilTime: "12:00", timeZone: "Asia/Taipei" });
      const s = (k: "decade" | "year" | "month" | "day") => { const v = t.scopes[k]; return v ? `${B[v.lifeBranch]}${v.lifeOnNatal}|${v.stem}|${(["祿", "權", "科", "忌"] as const).map(h => v.hua[h].star).join(",")}` : null; };
      return { date, nominalAge: t.nominalAge, decade: s("decade"), year: s("year")!, month: s("month")!, day: s("day")! };
    });
    ziwei = {
      ok: true,
      lunar: `${n.lunar.year}-${n.lunar.isLeap ? "閏" : ""}${n.lunar.month}-${n.lunar.day}`, effectiveMonth: n.lunar.effectiveMonth,
      yearGz: n.yearGz.text, hour: B[n.hourBranch], life: B[n.lifeBranch], body: B[n.bodyBranch], bodyPalace: n.bodyPalace,
      bureau: n.juName, forward: n.forward,
      birthHua: (["祿", "權", "科", "忌"] as const).map(h => `${n.birthHua[h].star}${h}@${n.birthHua[h].palace ?? "-"}`).join(","),
      notes: n.notes, palaces: palaceLines(n), transits,
    };
  } catch (e) {
    ziwei = { ok: false, error: (e as Error).message };
  }
  const bz = BaziEngine.computeNatal(input);
  const qm = QimenEngine.computeNatal(input);
  const ic = IchingEngine.computeNatal(input);
  return {
    calendar, ziwei,
    crossSystem: {
      baziPillars: bz.ok ? [bz.data.pillars.year, bz.data.pillars.month, bz.data.pillars.day, bz.data.pillars.hour].map(g => g?.text ?? "--").join(" ") : `ERR:${bz.message}`,
      qimenNianMing: qm.ok ? qm.data.nianMing : null,
      ichingPersonalNo: ic.ok ? ic.data.personalNo : null,
    },
  };
}

const round2 = (v: number) => { const r = Math.round(v * 100) / 100; return r === 0 ? 0 : r; }; // 避免 -0 與 0 比對不等

// ───────── iztro 相容比對（Level 2） ─────────
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { astro } = require("iztro");

/** 與本 App 既有行為相容的 iztro 設定（逐項明列；iztro 預設 dayDivide 為 "forward"，不同於本 App）。 */
export const IZTRO_COMPAT_CONFIG = { algorithm: "default", yearDivide: "normal", horoscopeDivide: "normal", ageDivide: "normal", dayDivide: "current" } as const;
export const IZTRO_DEFAULT_CONFIG = { algorithm: "default", yearDivide: "normal", horoscopeDivide: "normal", ageDivide: "normal", dayDivide: "forward" } as const;
export const IZTRO_BYSOLAR_OPTIONS = { fixLeap: true, language: "zh-TW" } as const;

/** 以本 App 已決定的「排盤用當地日期與時辰」呼叫 iztro，逐欄比對；回傳差異清單（空陣列＝相容）。
 *  23 時（子初）以 iztro 的「晚子時」(timeIndex 12) 對應本 App 預設「子初不換日」；早子時設定則以次日子時 (timeIndex 0) 對應。 */
export function compareWithIztro(x: FixtureInput, settings: string, exp: GoldenExpected, config: typeof IZTRO_COMPAT_CONFIG | typeof IZTRO_DEFAULT_CONFIG = IZTRO_COMPAT_CONFIG): string[] | null {
  if (!exp.ziwei.ok) return null;
  astro.config({ ...config });
  const z = exp.ziwei;
  const [date, time] = exp.calendar.chartLocal.split(" ");
  const h = Number(time.slice(0, 2));
  const earlyZi = PRE_REFACTOR_SETTINGS[settings].bazi.ziHour === "earlyZiNextDay";
  let d = date, ti = Math.floor(((h + 1) % 24) / 2);
  if (h === 23) { if (earlyZi) { const t = new Date(`${date}T00:00:00Z`); t.setUTCDate(t.getUTCDate() + 1); d = t.toISOString().slice(0, 10); ti = 0; } else ti = 12; }
  const [y, m, dd] = d.split("-").map(Number);
  const a = astro.bySolar(`${y}-${m}-${dd}`, ti, x.gender === "male" ? "男" : "女", IZTRO_BYSOLAR_OPTIONS.fixLeap, IZTRO_BYSOLAR_OPTIONS.language);
  const diffs: string[] = [];
  if (a.fiveElementsClass !== z.bureau) diffs.push(`五行局 ${z.bureau} vs ${a.fiveElementsClass}`);
  if (a.earthlyBranchOfSoulPalace !== z.life) diffs.push(`命宮 ${z.life} vs ${a.earthlyBranchOfSoulPalace}`);
  if (a.earthlyBranchOfBodyPalace !== z.body) diffs.push(`身宮 ${z.body} vs ${a.earthlyBranchOfBodyPalace}`);
  const want = ["左輔", "右弼", "文昌", "文曲", "天魁", "天鉞", "擎羊", "陀羅", "火星", "鈴星", "地空", "地劫", "祿存", "天馬"];
  const adj = ["咸池", "紅鸞", "天喜", "天刑", "天姚"];
  for (const p of a.palaces) {
    const line = [
      p.earthlyBranch, p.heavenlyStem + p.earthlyBranch, p.name.replace("僕役", "交友"),
      [...p.majorStars].map((s: { name: string; brightness?: string; mutagen?: string }) => s.name + (s.brightness || "_") + (s.mutagen ?? "")).join(",") || "-",
      p.minorStars.filter((s: { name: string }) => want.includes(s.name)).map((s: { name: string; mutagen?: string }) => s.name + (s.mutagen ?? "")).join(",") || "-",
      p.adjectiveStars.filter((s: { name: string }) => adj.includes(s.name)).map((s: { name: string }) => s.name).join(",") || "-",
      p.decadal.range.join("-"),
    ];
    const ours = z.palaces.find(l => l.startsWith(p.earthlyBranch + "|"))!.split("|");
    const norm = (v: string) => v.split(",").sort().join(",");
    for (let i = 0; i < line.length; i++) if (norm(line[i]) !== norm(ours[i])) diffs.push(`${p.earthlyBranch}宮 欄位${i} ${ours[i]} vs ${line[i]}`);
  }
  astro.config({ ...IZTRO_DEFAULT_CONFIG });
  return diffs;
}
