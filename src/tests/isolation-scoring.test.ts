/** 跨系統隔離、真太陽時、評分組成（紫微暫不計分、不放大其他系統權重）。 */
import { describe, it, expect } from "vitest";
import { buildNatal, analyze, analyzeEvent } from "@/core/analysis";
import { scoringComposition } from "@/core/analysis/score";
import { computeZiweiNatal, IZTRO_COMPATIBLE_V1, resolveZiweiProfile } from "@/core/ziwei";
import { BaziEngine } from "@/core/bazi";
import { QimenEngine } from "@/core/qimen";
import { IchingEngine } from "@/core/iching";
import { defaultSettings, newBirthDefaults, type CalculationSettings } from "@/core/person";
import { auditDifferences, computeSolarTimeAudit, solarTimeView } from "@/core/calendar/solarTime";
import { SYSTEM_SCORING, W_SYSTEM } from "@/kb/weights";
import { legacyZiweiScoring } from "@/kb/rules/ziwei";
import { toBirth, palaceLines, type FixtureInput } from "./golden/snapshot";

const X = (localDate: string, localTime: string | null, extra: Partial<FixtureInput> = {}): FixtureInput =>
  ({ gender: "male", localDate, localTime, timeZone: "Asia/Taipei", place: { name: "台北", lat: 25.04, lng: 121.51 }, useTrueSolarTime: false, ...extra });
const person = { id: "p", displayName: "p", gender: "male" as const, relation: "self" as const, isFavorite: false, sortOrder: 0, createdAt: "", updatedAt: "" };
const S = (ziHour: CalculationSettings["bazi"]["ziHour"], ziwei = IZTRO_COMPATIBLE_V1.id): CalculationSettings => ({ ...defaultSettings(""), bazi: { ...defaultSettings("").bazi, ziHour }, ziwei: { ruleProfileId: ziwei } });

describe("日界、年界各模組獨立", () => {
  const x = X("2000-03-15", "23:30");
  it("改變八字子時換日，不影響紫微命盤", () => {
    const a = computeZiweiNatal({ personId: "p", gender: "male", birth: toBirth(x), settings: S("lateZiSameDay") });
    const b = computeZiweiNatal({ personId: "p", gender: "male", birth: toBirth(x), settings: S("earlyZiNextDay") });
    expect(palaceLines(b)).toEqual(palaceLines(a));
  });
  it("改變紫微日界，不影響八字四柱、奇門年命、梅花個人數", () => {
    const customs = [{ id: "d23", name: "d", kind: "custom" as const, baseProfileId: IZTRO_COMPATIBLE_V1.id, overrides: [{ field: "dayBoundaryRule" as const, value: "23:00" as const }], createdAt: "" }];
    const one = (zp: string) => {
      const input = { personId: "p", gender: "male" as const, birth: toBirth(x), settings: S("lateZiSameDay", zp), ziweiProfile: resolveZiweiProfile(zp, customs) };
      const bz = BaziEngine.computeNatal(input), qm = QimenEngine.computeNatal(input), ic = IchingEngine.computeNatal(input);
      return [bz.ok && bz.data.pillars.day.text, bz.ok && bz.data.pillars.hour?.text, qm.ok && qm.data.nianMing, ic.ok && ic.data.personalNo, computeZiweiNatal(input).lunar.day];
    };
    const a = one(IZTRO_COMPATIBLE_V1.id), b = one("d23");
    expect(a.slice(0, 4)).toEqual(b.slice(0, 4));
    expect([a[4], b[4]]).toEqual([10, 11]);
  });
  it("2024-02-05（立春後、春節前）：八字甲辰、紫微癸卯、奇門年命取甲辰旬首", () => {
    const input = { personId: "p", gender: "male" as const, birth: toBirth(X("2024-02-05", "12:00")), settings: defaultSettings("") };
    const bz = BaziEngine.computeNatal(input), qm = QimenEngine.computeNatal(input);
    expect(bz.ok && bz.data.pillars.year.text).toBe("甲辰");
    expect(computeZiweiNatal(input).yearGz.text).toBe("癸卯");
    expect(qm.ok && qm.data.nianMing).toBe("壬");
  });
});

describe("真太陽時", () => {
  it("新人物預設標準時間（真太陽時校正關閉）", () => {
    const b = newBirthDefaults("x", "t");
    expect([b.useTrueSolarTime, b.timeBasis]).toEqual([false, "civilStandard"]);
  });
  it("跨時辰：台南 2024-01-14 01:05，校正後丑→子；稽核快照記錄原始與校正時間", () => {
    const b = { ...toBirth(X("2024-01-14", "01:05", { place: { name: "台南", lat: 22.99, lng: 120.21 } })), useTrueSolarTime: true };
    const v = solarTimeView(b)!;
    expect([v.crossesHourBoundary, v.crossesDate]).toEqual([true, false]);
    const a = computeSolarTimeAudit(b, "now")!;
    expect(a).toMatchObject({ originalLocal: "2024-01-14 01:05", utcOffset: "UTC+8", standardHourBranch: "丑", calculatedHourBranch: "子", crossesHourBoundary: true, useTrueSolarTime: true });
    expect(a.correctionMinutes).toBeLessThan(0);
  });
  it("不跨時辰：1988-01-14 01:15 台南真太陽時仍為丑時", () => {
    const b = { ...toBirth(X("1988-01-14", "01:15", { place: { name: "台南", lat: 22.99, lng: 120.21 } })), useTrueSolarTime: true };
    expect(solarTimeView(b)!.crossesHourBoundary).toBe(false);
  });
  it("稽核快照與目前重算不同時列出差異，不沿用舊值；時辰不詳無快照", () => {
    const b = { ...toBirth(X("2024-01-14", "01:05")), useTrueSolarTime: true };
    const cur = computeSolarTimeAudit(b, "now")!;
    expect(auditDifferences({ ...cur, calculatedLocal: "2024-01-14 00:59", calendarVersion: "2.0.0" }, cur)[0]).toContain("calculatedLocal：舊 2024-01-14 00:59");
    expect(auditDifferences(cur, cur)).toEqual([]);
    expect(computeSolarTimeAudit(toBirth(X("2024-01-14", null)), "now")).toBeUndefined();
  });
});

describe("評分組成：紫微暫不計分", () => {
  const n = buildNatal({ person, birth: toBirth(X("1988-01-14", "01:15")), settings: defaultSettings("") });
  it("ScoreAggregator 狀態：紫微 interpretationPending；legacy 計分停用且不對使用者顯示", () => {
    expect(SYSTEM_SCORING.ziwei).toMatchObject({ status: "pending", detail: "interpretationPending" });
    expect([SYSTEM_SCORING.bazi.status, SYSTEM_SCORING.qimen.status, SYSTEM_SCORING.iching.status]).toEqual(["active", "active", "active"]);
    expect([legacyZiweiScoring.enabled, legacyZiweiScoring.userFacing]).toEqual([false, false]);
    expect(legacyZiweiScoring.families).toEqual(["ziwei.*.hua.*", "ziwei.*.jichong.*", "ziwei.*.focus.*", "ziwei.natal.*"]);
  });
  it("正式分數不含任何紫微證據；組成資訊明示 3/4", () => {
    const a = analyze(n, "2026-09-27", "Asia/Taipei", "day", { hours: false });
    for (const d of Object.values(a.domains)) {
      expect(d.evidence.some(e => e.system === "ziwei")).toBe(false);
      expect(d.signals.find(s => s.system === "ziwei")!.verdict).toBe("暫不計分");
    }
    expect(a.scoring).toMatchObject({ activeSystems: ["bazi", "qimen", "iching"], pendingSystems: ["ziwei"], activeSystemCount: 3, totalSystemCount: 4, missingSystems: ["ziwei"], legacyIncluded: false });
    expect(a.scoring.note).toBe("目前綜合評分由 3/4 個系統參與；紫微斗數判讀引擎重建中，暫不計分。");
    const e = analyzeEvent(n, "work", "2026-09-28", "10:00", "Asia/Taipei");
    expect(e.result.evidence.some(x => x.system === "ziwei")).toBe(false);
    expect(e.scoring.activeSystemCount).toBe(3);
  });
  it("開發者模式才會加入 legacy 紫微計分，且標記為 legacy", () => {
    const a = analyze(n, "2026-09-27", "Asia/Taipei", "day", { hours: false, legacyZiwei: true });
    const zw = Object.values(a.domains).flatMap(d => d.evidence.filter(e => e.system === "ziwei"));
    expect(zw.length).toBeGreaterThan(0);
    expect(zw.every(e => e.legacy)).toBe(true);
    expect(a.scoring.legacyIncluded).toBe(true);
  });
  it("未放大八字、奇門、梅花權重來補紫微（權重與重構前相同）", () => {
    expect(W_SYSTEM).toEqual({
      overall: { bazi: 1.0, ziwei: 0.9, qimen: 0.7, iching: 0.6 }, career: { bazi: 1.0, ziwei: 1.0, qimen: 0.8, iching: 0.5 },
      wealth: { bazi: 1.0, ziwei: 1.0, qimen: 0.7, iching: 0.5 }, investment: { bazi: 1.0, ziwei: 1.0, qimen: 0.8, iching: 0.5 },
      social: { bazi: 1.0, ziwei: 0.9, qimen: 0.8, iching: 0.5 }, love: { bazi: 0.9, ziwei: 1.0, qimen: 0.7, iching: 0.5 },
      travel: { bazi: 0.8, ziwei: 0.7, qimen: 1.2, iching: 0.6 }, health: { bazi: 1.0, ziwei: 0.9, qimen: 0.6, iching: 0.4 },
      decision: { bazi: 0.9, ziwei: 0.8, qimen: 1.0, iching: 0.8 },
    });
  });
  it("時辰不詳：紫微未納入（資料不足），仍為 3/4，確定度不因紫微而降級", () => {
    const m = buildNatal({ person, birth: toBirth(X("1988-01-14", null)), settings: defaultSettings("") });
    const c = scoringComposition(m);
    expect([c.activeSystemCount, c.pendingSystems, c.unavailableSystems]).toEqual([3, ["ziwei"], []]);
  });
});
