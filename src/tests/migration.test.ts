/** 資料升級測試：schema v1 → v2 資料庫、v1 備份還原、舊版 localStorage 匯入。
 *  驗證：人物資料不遺失、真太陽時設定保留原值、legacy 設定轉為 legacy Profile（不污染標準 Profile）、升級後命盤與金樣本完全相同。 */
import "fake-indexeddb/auto";
import { beforeAll, describe, expect, it } from "vitest";
import Dexie from "dexie";
import { readFileSync } from "node:fs";
import path from "node:path";
import { db } from "@/data/db";
import { addZiweiProfile, ensureSeed, listBundles, listSettings, listZiweiProfiles, migrateBirthProfilesV2, wipeAll } from "@/data/repo";
import { loadSecurity, lock } from "@/data/vault";
import { openBackup, parseBackup, restoreBackup } from "@/data/backup";
import { migrateLegacy } from "@/data/legacy";
import { buildNatal } from "@/core/analysis";
import { IZTRO_COMPATIBLE_V1 } from "@/core/ziwei";
import type { PersonBundle } from "@/core/person";
import { resolveCalculation } from "@/core/calculation";
import { palaceLines, type GoldenExpected } from "./golden/snapshot";

const mem: Record<string, string> = {};
(globalThis as { localStorage?: unknown }).localStorage = {
  getItem: (k: string) => (k in mem ? mem[k] : null), setItem: (k: string, v: string) => { mem[k] = v; },
  removeItem: (k: string) => { delete mem[k]; }, clear: () => { for (const k of Object.keys(mem)) delete mem[k]; },
};

type Z = Extract<GoldenExpected["ziwei"], { ok: true }>;
const golden = JSON.parse(readFileSync(path.resolve(__dirname, "fixtures/ziwei/ziwei_canonical_fixture_v1.json"), "utf8")).fixtures as { fixtureId: string; expected: GoldenExpected }[];
const G = (id: string) => golden.find(f => f.fixtureId === id)!.expected.ziwei as Z;

async function chartOf(b: PersonBundle) {
  const calc = resolveCalculation(b.birth, await listSettings(), await listZiweiProfiles());
  const n = buildNatal({ person: b.person, birth: b.birth, ...calc });
  const z = n.ziwei!;
  return { profileId: z.meta.ruleProfileId, lunar: `${z.lunar.year}-${z.lunar.isLeap ? "閏" : ""}${z.lunar.month}-${z.lunar.day}`, life: "子丑寅卯辰巳午未申酉戌亥"[z.lifeBranch], bureau: z.juName, palaces: palaceLines(z), hua: z.birthTransformations.map(t => t.star + t.transformation) };
}
const expectSameAsGolden = (c: Awaited<ReturnType<typeof chartOf>>, id: string) => {
  const g = G(id);
  expect([c.lunar, c.life, c.bureau]).toEqual([g.lunar, g.life, g.bureau]);
  expect(c.palaces).toEqual(g.palaces);
};

// ───────── schema v1 資料（升級前的真實格式） ─────────
const T = "2026-01-01T00:00:00.000Z";
const v1School = (id: string, name: string, ziHour: string, extra: Record<string, string> = {}) => ({
  id, name, isDefault: id === "school-default",
  bazi: { school: "子平・滴天髓闡微", ziHour },
  ziwei: { school: "中州派", leapMonth: "splitAt15", fireBell: "quanshu", gengSihua: "陽武陰同", ...extra },
  qimen: { school: "時家轉盤", method: "chaibu", plate: "rotating" }, iching: { dailyMethod: "meihua_date_birthhour" }, createdAt: T, updatedAt: T,
});
const v1Person = (id: string, name: string, gender: "male" | "female") => ({ id, displayName: name, gender, relation: "family", isFavorite: false, sortOrder: 0, createdAt: T, updatedAt: T });
const v1Birth = (personId: string, date: string, time: string, lng: number, tst: boolean, school: string) => ({
  personId, localDate: date, localTime: time, timeAccuracy: "exact", inputCalendar: "solar",
  place: { name: "x", countryCode: "TW", lat: 23, lng }, timeZone: "Asia/Taipei", dstOverride: "auto", useTrueSolarTime: tst, schoolProfileId: school, createdAt: T, updatedAt: T,
});

beforeAll(async () => {
  // 以 v1 結構建立資料庫並寫入舊資料（模擬升級前的使用者裝置）
  const old = new Dexie("xuanji");
  old.version(1).stores({ persons: "id, updatedAt", birthProfiles: "personId", tags: "id", personTags: "[personId+tagId], personId, tagId", natalCharts: "[personId+system], personId", history: "id, personId, savedAt", schoolProfiles: "key", prefs: "key", meta: "key", legacy: "key" });
  await old.open();
  await old.table("schoolProfiles").bulkPut([
    { key: "school-default", value: v1School("school-default", "預設（子平・中州派・時家轉盤拆補）", "lateZiSameDay") },
    { key: "school-early-zi", value: v1School("school-early-zi", "早子時換日（由舊版設定匯入）", "earlyZiNextDay") },
    { key: "school-geng", value: v1School("school-geng", "自訂庚干", "lateZiSameDay", { gengSihua: "陽武同陰" }) },
  ]);
  await old.table("persons").bulkPut([
    { id: "p1", updatedAt: T, data: v1Person("p1", "甲", "male") },
    { id: "p2", updatedAt: T, data: v1Person("p2", "乙", "male") },
    { id: "p3", updatedAt: T, data: v1Person("p3", "丙", "female") },
  ]);
  await old.table("birthProfiles").bulkPut([
    { personId: "p1", data: v1Birth("p1", "1988-01-14", "01:15", 120.21, false, "school-default") },
    { personId: "p2", data: v1Birth("p2", "2000-03-15", "23:30", 121.51, false, "school-early-zi") },
    { personId: "p3", data: v1Birth("p3", "1990-06-15", "10:00", 120.21, true, "school-geng") },
  ]);
  await old.table("meta").put({ key: "legacyMigrated", value: { at: T, created: 0 } });
  old.close();
  lock();
  await db().open();          // 觸發 v1 → v2 升級
  await loadSecurity();
  await ensureSeed();
});

describe("資料庫 schema v1 → v2", () => {
  it("流派設定轉為 CalculationSettings；舊設定原樣保存於 migratedFrom", async () => {
    const s = await listSettings();
    expect(s.map(x => [x.id, x.ziwei.ruleProfileId]).sort()).toEqual([
      ["school-default", "iztro_compatible_v1"],
      ["school-early-zi", "legacy_imported_v1_earlyZi"],
      ["school-geng", "legacy_v1_gengTransformation-陽武同陰"],
    ]);
    expect(s.every(x => x.migratedFrom?.schemaVersion === 1)).toBe(true);
    expect((await db().meta.get("migration-v2"))?.value).toBeTruthy();
  });
  it("與標準不同的舊設定建立 legacy Profile，標準 Profile 不被修改", async () => {
    const ps = await listZiweiProfiles();
    expect(ps.map(p => p.id).sort()).toEqual(["legacy_imported_v1_earlyZi", "legacy_v1_gengTransformation-陽武同陰"]);
    expect(ps.every(p => p.baseProfileId === "iztro_compatible_v1" && p.kind === "legacy")).toBe(true);
    expect(IZTRO_COMPATIBLE_V1.rules.dayBoundaryRule.value).toBe("00:00");
    expect(IZTRO_COMPATIBLE_V1.rules.fourTransformationsTable.value.庚).toEqual(["太陽", "武曲", "太陰", "天同"]);
  });
  it("出生資料不遺失，真太陽時偏好維持原值，改名為 calculationSettingsId", async () => {
    const list = await listBundles();
    expect(list.map(b => [b.person.id, b.birth.localDate, b.birth.localTime, b.birth.useTrueSolarTime, b.birth.calculationSettingsId, b.birth.timeBasis]).sort()).toEqual([
      ["p1", "1988-01-14", "01:15", false, "school-default", "civilStandard"],
      ["p2", "2000-03-15", "23:30", false, "school-early-zi", "civilStandard"],
      ["p3", "1990-06-15", "10:00", true, "school-geng", "civilStandard"],
    ]);
    expect(list.every(b => !("schoolProfileId" in b.birth))).toBe(true);
  });
  it("解鎖後補寫：出生資料正規化並寫入真太陽時稽核快照，只新增欄位", async () => {
    expect(await migrateBirthProfilesV2()).toBe(3);
    const list = await listBundles();
    for (const b of list) {
      expect(b.birth.solarTimeAudit?.originalLocal).toBe(`${b.birth.localDate} ${b.birth.localTime}`);
      expect(b.birth.solarTimeAudit?.useTrueSolarTime).toBe(b.birth.useTrueSolarTime);
    }
    expect(await migrateBirthProfilesV2()).toBe(0); // 冪等
  });
  it("升級後命盤與金樣本完全相同（含舊版早子時設定）", async () => {
    const list = await listBundles();
    const by = (id: string) => list.find(b => b.person.id === id)!;
    const c1 = await chartOf(by("p1"));
    expect(c1.profileId).toBe("iztro_compatible_v1");
    expectSameAsGolden(c1, "fixture_19880114_0115_male");
    const c2 = await chartOf(by("p2"));
    expect(c2.profileId).toBe("legacy_imported_v1_earlyZi");
    expectSameAsGolden(c2, "day_boundary_20000315_2330_earlyZi");
  });
  it("舊版自訂庚干設定維持舊行為（庚年天同科、太陰忌）", async () => {
    const list = await listBundles();
    const c3 = await chartOf(list.find(b => b.person.id === "p3")!);
    expect(c3.hua).toEqual(["太陽祿", "武曲權", "天同科", "太陰忌"]);
  });
});

describe("備份 v1 → v2 還原", () => {
  it("舊格式備份（schoolProfiles、schoolProfileId）可還原，命盤與金樣本相同", async () => {
    lock(); await wipeAll(); await ensureSeed();
    const file = {
      format: "xuanji-backup", schema_version: 1, app_version: "3.0.0", exported_at: T, scope: "all", person_count: 2, engines: [], encrypted: false,
      payload: {
        persons: [v1Person("b1", "備甲", "male"), v1Person("b2", "備乙", "male")],
        birthProfiles: [v1Birth("b1", "1988-01-14", "01:15", 120.21, false, "school-default"), v1Birth("b2", "2000-03-15", "23:30", 121.51, false, "school-early-zi")],
        tags: [], personTags: [], history: [], legacy: [],
        schoolProfiles: [v1School("school-default", "預設", "lateZiSameDay"), v1School("school-early-zi", "早子時", "earlyZiNextDay")],
        prefs: { displayMode: "plain", backupReminderDays: 14 },
      },
    };
    const dump = await openBackup(parseBackup(JSON.stringify(file)));
    expect(dump.calculationSettings.map(s => s.ziwei.ruleProfileId).sort()).toEqual(["iztro_compatible_v1", "legacy_imported_v1_earlyZi"]);
    await restoreBackup(dump, "replace");
    const list = await listBundles();
    expect(list).toHaveLength(2);
    expectSameAsGolden(await chartOf(list.find(b => b.person.id === "b1")!), "fixture_19880114_0115_male");
    expectSameAsGolden(await chartOf(list.find(b => b.person.id === "b2")!), "day_boundary_20000315_2330_earlyZi");
  });
});

describe("舊版 localStorage 匯入", () => {
  it("早子時人物轉為 legacy Profile，命盤與金樣本相同；真太陽時偏好保留", async () => {
    lock(); await wipeAll(); await ensureSeed();
    mem["dd:profiles"] = JSON.stringify([{ id: "x", name: "舊人", gender: "male", birthDate: "2000-03-15", birthTime: "23:30", birthTimeAccuracy: "exact", birthPlace: { city: "台北", timezone: "Asia/Taipei", longitude: 121.51, latitude: 25.04 }, useTrueSolarTime: false, ziRule: "earlyZi" }]);
    expect(await migrateLegacy()).toBe(1);
    const [b] = await listBundles();
    expect([b.birth.useTrueSolarTime, b.birth.calculationSettingsId]).toEqual([false, "school-early-zi"]);
    expectSameAsGolden(await chartOf(b), "day_boundary_20000315_2330_earlyZi");
  });
});

describe("Profile 不可被資料庫寫入或備份還原覆寫", () => {
  it("addZiweiProfile 拒絕標準 id；含冒用記錄的備份整批拒絕、不寫入任何資料", async () => {
    lock(); await wipeAll(); await ensureSeed();
    const fake = { id: "iztro_compatible_v1", name: "假", kind: "custom", baseProfileId: "iztro_compatible_v1", overrides: [{ field: "dayBoundaryRule", value: "23:00" }], createdAt: T };
    await expect(addZiweiProfile(fake as never)).rejects.toThrow("標準 Profile");
    const file = {
      format: "xuanji-backup", schema_version: 2, app_version: "3.1.0", exported_at: T, scope: "all", person_count: 1, engines: [], encrypted: false,
      payload: { persons: [v1Person("z1", "壞備份", "male")], birthProfiles: [{ ...v1Birth("z1", "1988-01-14", "01:15", 120.21, false, "school-default"), schoolProfileId: undefined, calculationSettingsId: "school-default", timeBasis: "civilStandard" }],
        tags: [], personTags: [], history: [], legacy: [], calculationSettings: [], ziweiRuleProfiles: [{ id: "ok_custom", name: "ok", kind: "custom", baseProfileId: "iztro_compatible_v1", overrides: [{ field: "leapMonthRule", value: "asNext" }], createdAt: T }, fake], prefs: { displayMode: "plain", backupReminderDays: 14 } },
    };
    await expect(restoreBackup(await openBackup(parseBackup(JSON.stringify(file))), "replace")).rejects.toThrow("標準 Profile");
    expect(await listBundles()).toEqual([]);
    expect(await listZiweiProfiles()).toEqual([]);
    expect(IZTRO_COMPATIBLE_V1.rules.dayBoundaryRule.value).toBe("00:00");
  });
});
