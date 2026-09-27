/** 舊版「預設」流派設定本身與標準不同（子初換日）時的升級：
 *  舊人物維持升級前命盤（改指向 school-default-v1 + legacy Profile）；預設設定恢復標準 Profile，新人物不會自動套用 legacy Profile。 */
import "fake-indexeddb/auto";
import { beforeAll, describe, expect, it } from "vitest";
import Dexie from "dexie";
import { readFileSync } from "node:fs";
import path from "node:path";
import { db } from "@/data/db";
import { ensureSeed, listBundles, listSettings, listZiweiProfiles, migrateBirthProfilesV2, saveBundle, wipeAll } from "@/data/repo";
import { loadSecurity, lock } from "@/data/vault";
import { openBackup, parseBackup, restoreBackup } from "@/data/backup";
import { LEGACY_DEFAULT_SETTINGS_ID, migrateSettingsListV1, normalizeBirth } from "@/data/migrations";
import { buildNatal } from "@/core/analysis";
import { resolveCalculation } from "@/core/calculation";
import { DEFAULT_SETTINGS_ID, newBirthDefaults, type PersonBundle } from "@/core/person";
import { palaceLines, type GoldenExpected } from "./golden/snapshot";

const mem: Record<string, string> = {};
(globalThis as { localStorage?: unknown }).localStorage = {
  getItem: (k: string) => (k in mem ? mem[k] : null), setItem: (k: string, v: string) => { mem[k] = v; },
  removeItem: (k: string) => { delete mem[k]; }, clear: () => { for (const k of Object.keys(mem)) delete mem[k]; },
};
type Z = Extract<GoldenExpected["ziwei"], { ok: true }>;
const golden = JSON.parse(readFileSync(path.resolve(__dirname, "fixtures/ziwei/ziwei_canonical_fixture_v1.json"), "utf8")).fixtures as { fixtureId: string; expected: GoldenExpected }[];
const G = (id: string) => golden.find(f => f.fixtureId === id)!.expected.ziwei as Z;
async function calcOf(b: PersonBundle) {
  const calc = resolveCalculation(b.birth, await listSettings(), await listZiweiProfiles());
  return { calc, z: buildNatal({ person: b.person, birth: b.birth, ...calc }).ziwei! };
}

const T = "2026-01-01T00:00:00.000Z";
const v1Default = { id: "school-default", name: "預設", isDefault: true, bazi: { school: "子平・滴天髓闡微", ziHour: "earlyZiNextDay" }, ziwei: { school: "中州派", leapMonth: "splitAt15", fireBell: "quanshu", gengSihua: "陽武陰同" }, qimen: { school: "時家轉盤", method: "chaibu", plate: "rotating" }, iching: { dailyMethod: "meihua_date_birthhour" }, createdAt: T, updatedAt: T };
const v1Person = { id: "old", displayName: "舊", gender: "male", relation: "family", isFavorite: false, sortOrder: 0, createdAt: T, updatedAt: T };
const v1Birth = { personId: "old", localDate: "2000-03-15", localTime: "23:30", timeAccuracy: "exact", inputCalendar: "solar", place: { name: "x", countryCode: "TW", lat: 25.04, lng: 121.51 }, timeZone: "Asia/Taipei", dstOverride: "auto", useTrueSolarTime: false, schoolProfileId: "school-default", createdAt: T, updatedAt: T };

beforeAll(async () => {
  const old = new Dexie("xuanji");
  old.version(1).stores({ persons: "id, updatedAt", birthProfiles: "personId", tags: "id", personTags: "[personId+tagId], personId, tagId", natalCharts: "[personId+system], personId", history: "id, personId, savedAt", schoolProfiles: "key", prefs: "key", meta: "key", legacy: "key" });
  await old.open();
  await old.table("schoolProfiles").put({ key: "school-default", value: v1Default });
  await old.table("persons").put({ id: "old", updatedAt: T, data: v1Person });
  await old.table("birthProfiles").put({ personId: "old", data: v1Birth });
  await old.table("meta").put({ key: "legacyMigrated", value: { at: T, created: 0 } });
  old.close();
  lock();
  await db().open();
  await loadSecurity();
  await ensureSeed();
});

describe("純函式：預設設定拆分", () => {
  it("預設為子初換日 → school-default 標準 Profile＋school-default-v1 legacy Profile，只有 v1 資料列被重新指向", () => {
    const r = migrateSettingsListV1([v1Default], T);
    expect(r.settings.map(s => [s.id, s.isDefault, s.ziwei.ruleProfileId, s.bazi.ziHour])).toEqual([
      [LEGACY_DEFAULT_SETTINGS_ID, false, "legacy_imported_v1_earlyZi", "earlyZiNextDay"],
      [DEFAULT_SETTINGS_ID, true, "iztro_compatible_v1", "earlyZiNextDay"],
    ]);
    expect(r.remap).toEqual({ [DEFAULT_SETTINGS_ID]: LEGACY_DEFAULT_SETTINGS_ID });
    expect(normalizeBirth(v1Birth, r.remap).calculationSettingsId).toBe(LEGACY_DEFAULT_SETTINGS_ID);
    // 已是 v2 的資料列（新人物）不受 remap 影響
    expect(normalizeBirth({ ...newBirthDefaults("n", T), localDate: "2000-03-15" }, r.remap).calculationSettingsId).toBe(DEFAULT_SETTINGS_ID);
  });
  it("預設與標準相同時不拆分", () => {
    const r = migrateSettingsListV1([{ ...v1Default, bazi: { ...v1Default.bazi, ziHour: "lateZiSameDay" } }], T);
    expect([r.settings.map(s => s.id), r.remap]).toEqual([[DEFAULT_SETTINGS_ID], {}]);
  });
});

describe("資料庫升級（預設為子初換日）", () => {
  it("舊人物改用 school-default-v1，命盤與金樣本（早子時）相同；解鎖補寫後持久化", async () => {
    let [b] = await listBundles();
    expect(b.birth.calculationSettingsId).toBe(LEGACY_DEFAULT_SETTINGS_ID);
    const g = G("day_boundary_20000315_2330_earlyZi");
    expect(palaceLines((await calcOf(b)).z)).toEqual(g.palaces);
    expect(await migrateBirthProfilesV2()).toBe(1);
    [b] = await listBundles();
    expect(b.birth.calculationSettingsId).toBe(LEGACY_DEFAULT_SETTINGS_ID);
    expect(palaceLines((await calcOf(b)).z)).toEqual(g.palaces);
  });
  it("新人物：預設設定 → iztro_compatible_v1、標準時間、真太陽時校正關閉", async () => {
    const birth = { ...newBirthDefaults("new", T), localDate: "2000-03-15", localTime: "23:30" };
    await saveBundle({ person: { ...v1Person, id: "new", displayName: "新" } as PersonBundle["person"], birth, tagIds: [] });
    const nb = (await listBundles()).find(x => x.person.id === "new")!;
    expect([nb.birth.calculationSettingsId, nb.birth.timeBasis, nb.birth.useTrueSolarTime]).toEqual([DEFAULT_SETTINGS_ID, "civilStandard", false]);
    const { calc, z } = await calcOf(nb);
    expect([calc.settings.isDefault, calc.ziweiProfile?.id, z.meta.ruleProfileId]).toEqual([true, "iztro_compatible_v1", "iztro_compatible_v1"]);
    expect(z.lunar.day).toBe(10); // 標準 Profile：23:30 仍算當日
  });
});

describe("備份 v1 還原（預設為子初換日）", () => {
  it("舊人物保留舊命盤，預設設定為標準 Profile", async () => {
    lock(); await wipeAll(); await ensureSeed();
    const file = { format: "xuanji-backup", schema_version: 1, app_version: "3.0.0", exported_at: T, scope: "all", person_count: 1, engines: [], encrypted: false,
      payload: { persons: [v1Person], birthProfiles: [v1Birth], tags: [], personTags: [], history: [], legacy: [], schoolProfiles: [v1Default], prefs: { displayMode: "plain", backupReminderDays: 14 } } };
    await restoreBackup(await openBackup(parseBackup(JSON.stringify(file))), "replace");
    const [b] = await listBundles();
    expect(b.birth.calculationSettingsId).toBe(LEGACY_DEFAULT_SETTINGS_ID);
    expect(palaceLines((await calcOf(b)).z)).toEqual(G("day_boundary_20000315_2330_earlyZi").palaces);
    expect((await listSettings()).find(s => s.isDefault)!.ziwei.ruleProfileId).toBe("iztro_compatible_v1");
  });
});
