/** 跨系統隔離、真太陽時、評分組成（紫微暫不計分、不放大其他系統權重）。 */
import { ziweiInterpretationStatus } from "@/core/ziwei/interp/engine";
import { describe, it, expect } from "vitest";
import { buildNatal, analyze, analyzeEvent, heatmap, findEventTimes, yearMonths } from "@/core/analysis";
import { collect, ZIWEI_TIME_UNKNOWN_MESSAGE } from "@/core/analysis/collect";
import { adviseDay } from "@/core/advice";
import { ZiweiEngine } from "@/core/ziwei";
import { scoringComposition, confidenceOf, type SystemSignal } from "@/core/analysis/score";
import { computeZiweiNatal, IZTRO_COMPATIBLE_V1, resolveZiweiProfile } from "@/core/ziwei";
import { BaziEngine } from "@/core/bazi";
import { QimenEngine } from "@/core/qimen";
import { IchingEngine } from "@/core/iching";
import { defaultSettings, newBirthDefaults, type CalculationSettings } from "@/core/person";
import { auditDifferences, computeSolarTimeAudit, solarTimeView } from "@/core/calendar/solarTime";
import { SYSTEM_SCORING, W_SYSTEM, K, B, CALIBRATION_INFO } from "@/kb/weights";
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
  it("真太陽時屬通用曆法層：同一開關同時作用於八字時柱、紫微時辰、梅花個人數（不是紫微專屬）", () => {
    const base = toBirth(X("2024-01-14", "01:05", { place: { name: "台南", lat: 22.99, lng: 120.21 } }));
    const at = (tst: boolean) => {
      const inp = { personId: "p", gender: "male" as const, birth: { ...base, useTrueSolarTime: tst }, settings: defaultSettings("") };
      const bz = BaziEngine.computeNatal(inp), ic = IchingEngine.computeNatal(inp);
      return [bz.ok && bz.data.pillars.hour?.text.slice(1), "子丑寅卯辰巳午未申酉戌亥"[computeZiweiNatal(inp).hourBranch], ic.ok && ic.data.personalNo];
    };
    expect(at(false)).toEqual(["丑", "丑", 2]);
    expect(at(true)).toEqual(["子", "子", 1]);
    const v = solarTimeView({ ...base, useTrueSolarTime: true })!; // standard／trueSolar／applied＝standard／trueSolar／effective BirthDateTime
    expect([v.standard.chartLocal.basis, v.trueSolar.chartLocal.basis, v.applied.chartLocal.basis]).toEqual(["standard", "trueSolar", "trueSolar"]);
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
    expect(a.scoring).toMatchObject({ activeScoringSystems: ["bazi", "qimen", "iching"], pendingSystems: ["ziwei"], activeSystemCount: 3, totalSystemCount: 4, missingSystems: ["ziwei"], legacyIncluded: false });
    expect(a.scoring.note).toBe("綜合評分依據：八字、奇門、易經。");
    expect(a.scoring).toMatchObject({ normalizationApplied: true, scaleReference: "fourSystemReference", compensatesMissingSystems: false });
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

describe("Final Audit：紫微完全退出正式計分、不補償、pending 不入分母", () => {
  const n = buildNatal({ person, birth: toBirth(X("1988-01-14", "01:15")), settings: defaultSettings("") });
  const other = buildNatal({ person, birth: toBirth(X("1975-07-18", "07:40", { gender: "female" })), settings: defaultSettings("") });
  const formal = (a: ReturnType<typeof analyze>) => ({
    overall: [a.overall.score, a.overall.band.label, a.overall.confidence, a.overall.domainAvg],
    domains: Object.values(a.domains).map(d => [d.domain, d.score, d.raw, d.baseline, d.k, d.band.label, d.confidence, d.divergence?.kind ?? null, d.evidence.map(e => e.id)]),
    ranking: Object.values(a.domains).filter(d => d.domain !== "overall").sort((x, y) => y.score - x.score).map(d => d.domain),
    hours: a.hours?.map(h => [h.value, h.level]),
  });
  it("移除紫微命盤、或換成另一張完全不同的紫微盤，所有正式分數結果（分數、raw、確定度、吉凶等級、排序、吉時）完全相同；紫微只影響已涵蓋主題的建議", () => {
    expect(n.ziwei && other.ziwei && n.ziwei.lifeBranch !== other.ziwei.lifeBranch).toBe(true);
    const noZw = { ...n, ziwei: null }, swapped = { ...n, ziwei: other.ziwei };
    for (const [date, level] of [["2026-09-27", "day"], ["2026-03-15", "month"], ["2030-07-01", "year"], ["2040-07-01", "decade"]] as const) {
      const a = formal(analyze(n, date, "Asia/Taipei", level));
      expect(formal(analyze(noZw, date, "Asia/Taipei", level))).toEqual(a);
      expect(formal(analyze(swapped, date, "Asia/Taipei", level))).toEqual(a);
    }
    const ev = (x: typeof n) => { const e = analyzeEvent(x, "work", "2026-09-28", null, "Asia/Taipei"); return [e.time, e.result.score, e.result.confidence, e.slots.map(s => s.score)]; };
    expect(ev(noZw)).toEqual(ev(n));
    expect(ev(swapped)).toEqual(ev(n));
    expect(findEventTimes(swapped, "work", "2026-09-28", 3, "Asia/Taipei")).toEqual(findEventTimes(n, "work", "2026-09-28", 3, "Asia/Taipei"));
    expect(heatmap(swapped, "2026-09-20", 7, "Asia/Taipei")).toEqual(heatmap(n, "2026-09-20", 7, "Asia/Taipei"));
    expect(yearMonths(swapped, 2026, "Asia/Taipei").map(m => [m.overall, m.scores])).toEqual(yearMonths(n, 2026, "Asia/Taipei").map(m => [m.overall, m.scores]));
    // 行動建議：紫微判讀只在已涵蓋的主題參與（partial）；未涵蓋的主題完全不受紫微影響，舊的 legacy 紫微規則也不會進入建議
    const covered = ziweiInterpretationStatus().coveredTopics;
    expect(covered.length).toBeGreaterThan(0);
    const all = (x: typeof n) => Object.values(adviseDay(x, "2026-09-27", "Asia/Taipei").byTopic);
    for (const x of [n, noZw, swapped]) for (const v of all(x)) {
      expect(v!.sourceRuleIds.some(id => id.startsWith("ziwei"))).toBe(false);
      if (!covered.includes(v!.topic)) expect(v!.trace.some(t => t.findings.some(f => f.system === "ziwei"))).toBe(false);
    }
    const adv = (x: typeof n) => all(x).filter(v => !covered.includes(v!.topic)).map(v => [
      v!.topic, v!.headline, v!.primaryAdvice?.id, v!.doNow.map(i => i.id), v!.avoidNow.map(i => i.id),
      v!.otherHorizons.map(h => [h.horizon, h.doNow.map(i => i.id), h.avoidNow.map(i => i.id)]), v!.confidence.level, v!.systemAgreement.status, v!.sourceRuleIds,
    ]);
    const base = adv(n);
    expect(adv(noZw)).toEqual(base);
    expect(adv(swapped)).toEqual(base);
    expect(base.length).toBe(17 - covered.length);
  });
  it("尺度 K 不分組、固定為四術參考；時辰已知／不詳與 legacy 比較模式都用同一個 K（不縮小 K 來放大三術）", () => {
    expect(Object.keys(K)).toEqual(["day", "month", "year", "decade"]);
    expect(CALIBRATION_INFO).toMatchObject({ scaleReference: "fourSystemReference", compensatesMissingSystems: false });
    // 重構前（四術完整）校準的日尺度，逐一鎖定
    expect(K.day).toEqual({ overall: 6.8, career: 7.6, wealth: 6.9, investment: 7.4, social: 7.7, love: 7, travel: 5.1, health: 7.9, decision: 8 });
    const m = buildNatal({ person, birth: toBirth(X("1988-01-14", null)), settings: defaultSettings("") });
    const a = analyze(n, "2026-09-27", "Asia/Taipei", "day", { hours: false });
    const u = analyze(m, "2026-09-27", "Asia/Taipei", "day", { hours: false });
    const l = analyze(n, "2026-09-27", "Asia/Taipei", "day", { hours: false, legacyZiwei: true });
    for (const d of Object.keys(a.domains) as (keyof typeof a.domains)[]) {
      expect([a.domains[d].k, u.domains[d].k, l.domains[d].k]).toEqual([K.day[d], K.day[d], K.day[d]]);
      expect(a.domains[d].baseline).toBe(B.timeKnown.day[d]);
    }
  });
  it("pending 不算 0 分、不算中性 50、不扣確定度：三術一致偏正面 → 確定度 5（若把紫微當中性會變 4）", () => {
    const sig = (system: SystemSignal["system"], verdict: SystemSignal["verdict"], scoring: SystemSignal["scoring"] = "active"): SystemSignal =>
      ({ system, label: system, available: true, scoring, long: { direction: 0, count: 0 }, short: { direction: 0, count: 0 }, direction: verdict === "偏正面" ? 0.5 : 0, count: verdict === "暫不計分" ? 0 : 3, verdict });
    const three = [sig("bazi", "偏正面"), sig("qimen", "偏正面"), sig("iching", "偏正面")];
    expect(confidenceOf([...three, sig("ziwei", "暫不計分", "pending")], false)).toBe(5);
    expect(confidenceOf(three, false)).toBe(5);
    expect(confidenceOf([...three, sig("ziwei", "中性")], false)).toBe(4); // 對照：若當成中性參與就會降級
  });
});

describe("出生時辰不詳：不產生假紫微命盤", () => {
  it("紫微引擎拒絕排盤；不以 12:00、子時或任何預設時間代替；畫面訊息固定", () => {
    const birth = toBirth(X("1988-01-14", null));
    const r = ZiweiEngine.computeNatal({ personId: "p", gender: "male", birth, settings: defaultSettings("") });
    expect(r.ok).toBe(false);
    expect(!r.ok && r.reason).toBe("insufficient_data");
    const n = buildNatal({ person, birth, settings: defaultSettings("") });
    expect(n.ziwei).toBeNull();
    expect(n.unavailable.find(u => u.system === "ziwei")!.reason).toBe(ZIWEI_TIME_UNKNOWN_MESSAGE);
    expect(ZIWEI_TIME_UNKNOWN_MESSAGE).toBe("出生時辰不詳，無法可靠建立紫微本命盤。");
    const c = collect(n, { civilDate: "2026-09-27", civilTime: "12:00", timeZone: "Asia/Taipei" }, "day", { legacyZiwei: true });
    expect([c.ziwei, c.facts.some(f => f.system === "ziwei"), c.fired.some(f => f.system === "ziwei")]).toEqual([null, false, false]);
  });
});
