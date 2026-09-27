import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import { db } from "@/data/db";
import {
  deletePerson, ensureSeed, listBundles, listTags, newId, nowISO, reencryptAll, saveBundle, saveTag, setFavorite, wipeAll,
} from "@/data/repo";
import { changePin, disableLock, enableLock, getSecurityConfig, isLocked, loadSecurity, lock, unlockWithPin } from "@/data/vault";
import { createBackup, migrateBackup, openBackup, parseBackup, restoreBackup, BackupError } from "@/data/backup";
import { migrateLegacy } from "@/data/legacy";
import { DEFAULT_SCHOOL_ID, type PersonBundle } from "@/core/person";
import { BACKUP_SCHEMA_VERSION } from "@/core/versioning";
import { scoringReady } from "@/core/registry";
import { bandOf, SCORE_BANDS } from "@/core/score";

const mem: Record<string, string> = {};
(globalThis as { localStorage?: unknown }).localStorage = {
  getItem: (k: string) => (k in mem ? mem[k] : null), setItem: (k: string, v: string) => { mem[k] = v; },
  removeItem: (k: string) => { delete mem[k]; }, clear: () => { for (const k of Object.keys(mem)) delete mem[k]; },
};

function bundle(name: string, tagIds: string[] = []): PersonBundle {
  const id = newId(); const t = nowISO();
  return {
    person: { id, displayName: name, gender: "male", relation: "family", isFavorite: false, sortOrder: 0, createdAt: t, updatedAt: t },
    birth: {
      personId: id, localDate: "1988-01-14", localTime: "01:15", timeAccuracy: "exact", inputCalendar: "solar",
      place: { name: "台南", countryCode: "TW", lat: 23.0, lng: 120.21 }, timeZone: "Asia/Taipei", dstOverride: "auto",
      useTrueSolarTime: true, schoolProfileId: DEFAULT_SCHOOL_ID, createdAt: t, updatedAt: t,
    },
    tagIds,
  };
}

beforeEach(async () => {
  lock();
  await db().open();
  await wipeAll();
  await loadSecurity();
  await ensureSeed();
  for (const k of Object.keys(mem)) delete mem[k];
});

describe("人物資料庫", () => {
  it("新增多位人物並依排序列出", async () => {
    const a = bundle("陳父"); a.person.sortOrder = 1;
    const b = bundle("陳母"); b.person.sortOrder = 0;
    await saveBundle(a); await saveBundle(b);
    const list = await listBundles();
    expect(list.map(x => x.person.displayName)).toEqual(["陳母", "陳父"]);
  });

  it("刪除人物會連帶刪除出生資料、標籤關聯、快取與紀錄", async () => {
    const tagId = newId();
    await saveTag({ id: tagId, name: "家人", createdAt: nowISO() });
    const a = bundle("甲", [tagId]);
    await saveBundle(a);
    await db().natalCharts.put({ personId: a.person.id, system: "bazi", data: {} });
    await db().history.put({ id: "h1", personId: a.person.id, savedAt: nowISO(), data: {} });
    await deletePerson(a.person.id);
    expect(await db().persons.count()).toBe(0);
    expect(await db().birthProfiles.count()).toBe(0);
    expect(await db().personTags.count()).toBe(0);
    expect(await db().natalCharts.count()).toBe(0);
    expect(await db().history.count()).toBe(0);
    expect((await listTags()).length).toBe(1);
  });

  it("加入最愛", async () => {
    const a = bundle("乙"); await saveBundle(a);
    await setFavorite(a.person.id, true);
    expect((await listBundles())[0].person.isFavorite).toBe(true);
  });
});

describe("App 鎖與本機加密", () => {
  it("啟用後資料庫內不再出現明文姓名與生日；鎖定後無法讀取；PIN 正確才能解鎖", async () => {
    await saveBundle(bundle("王小明"));
    await enableLock("246810", reencryptAll);
    const raw = JSON.stringify([await db().persons.toArray(), await db().birthProfiles.toArray()]);
    expect(raw).not.toContain("王小明");
    expect(raw).not.toContain("1988-01-14");
    lock();
    expect(isLocked()).toBe(true);
    await expect(listBundles()).rejects.toThrow();
    await expect(unlockWithPin("000000")).rejects.toThrow("PIN 不正確");
    await unlockWithPin("246810");
    expect((await listBundles())[0].person.displayName).toBe("王小明");
  });

  it("加密狀態下新增的人物也會加密；變更 PIN 後舊 PIN 失效", async () => {
    await enableLock("135791", reencryptAll);
    await saveBundle(bundle("李大華"));
    expect(JSON.stringify(await db().persons.toArray())).not.toContain("李大華");
    await changePin("135791", "abcdefgh");
    lock();
    await expect(unlockWithPin("135791")).rejects.toThrow();
    await unlockWithPin("abcdefgh");
    expect((await listBundles()).length).toBe(1);
  });

  it("停用 App 鎖會還原為明文", async () => {
    await saveBundle(bundle("趙六"));
    await enableLock("112233", reencryptAll);
    await disableLock("112233", reencryptAll);
    expect(getSecurityConfig().lockEnabled).toBe(false);
    expect(JSON.stringify(await db().persons.toArray())).toContain("趙六");
  });

  it("PIN 太短會被拒絕", async () => {
    await expect(enableLock("123", reencryptAll)).rejects.toThrow();
  });
});

describe("備份與還原", () => {
  it("明文備份：清空後以取代模式完整還原", async () => {
    const tagId = newId();
    await saveTag({ id: tagId, name: "公司", createdAt: nowISO() });
    await saveBundle(bundle("備份甲", [tagId])); await saveBundle(bundle("備份乙"));
    const { file } = await createBackup({});
    expect(file.schema_version).toBe(BACKUP_SCHEMA_VERSION);
    expect(file.person_count).toBe(2);
    const text = JSON.stringify(file);
    await wipeAll(); await ensureSeed();
    const dump = await openBackup(parseBackup(text));
    await restoreBackup(dump, "replace");
    const list = await listBundles();
    expect(list.map(x => x.person.displayName).sort()).toEqual(["備份乙", "備份甲"]);
    expect(list.find(x => x.person.displayName === "備份甲")!.tagIds).toEqual([tagId]);
  });

  it("加密備份：內容不含明文、密碼錯誤無法開啟", async () => {
    await saveBundle(bundle("機密丙"));
    const { file } = await createBackup({ password: "correct horse" });
    const text = JSON.stringify(file);
    expect(text).not.toContain("機密丙");
    await expect(openBackup(parseBackup(text), "wrong")).rejects.toBeInstanceOf(BackupError);
    const dump = await openBackup(parseBackup(text), "correct horse");
    expect(dump.persons[0].displayName).toBe("機密丙");
  });

  it("單一人物匯出只包含該人物；合併匯入不覆蓋其他人", async () => {
    const a = bundle("丁"); const b = bundle("戊");
    await saveBundle(a); await saveBundle(b);
    const { file } = await createBackup({ personIds: [a.person.id] });
    expect(file.payload!.persons.map(p => p.displayName)).toEqual(["丁"]);
    await deletePerson(a.person.id);
    await restoreBackup(await openBackup(file), "merge");
    expect((await listBundles()).map(x => x.person.displayName).sort()).toEqual(["丁", "戊"]);
  });

  it("App 鎖啟用中還原的資料也會加密儲存", async () => {
    await saveBundle(bundle("庚"));
    const { file } = await createBackup({});
    await wipeAll(); await ensureSeed();
    await enableLock("998877", reencryptAll);
    await restoreBackup(await openBackup(file), "replace");
    expect(JSON.stringify(await db().persons.toArray())).not.toContain("庚");
    expect((await listBundles())[0].person.displayName).toBe("庚");
  });

  it("拒絕非本 App 的檔案與比 App 新的版本", () => {
    expect(() => parseBackup("{}")).toThrow(BackupError);
    expect(() => parseBackup(JSON.stringify({ format: "xuanji-backup", schema_version: BACKUP_SCHEMA_VERSION + 1 }))).toThrow("比目前 App 新");
    expect(() => migrateBackup({ persons: "x" }, BACKUP_SCHEMA_VERSION)).toThrow(BackupError);
  });
});

describe("舊版資料遷移", () => {
  it("舊版 localStorage 的多筆命盤轉入人物資料庫，原資料保留", async () => {
    mem["dd:profiles"] = JSON.stringify([
      { id: "a", name: "本人", gender: "male", birthDate: "1975-03-18", birthTime: "07:40", birthTimeAccuracy: "exact", birthPlace: { city: "新營", timezone: "Asia/Taipei", longitude: 120.32, latitude: 23.31 }, useTrueSolarTime: true },
      { id: "b", name: "媽媽", gender: "female", birthDate: "1950-05-02", birthTime: null, birthTimeAccuracy: "unknown" },
    ]);
    mem["dd:quantlog"] = JSON.stringify([{ id: "q1" }]);
    expect(await migrateLegacy()).toBe(2);
    const list = await listBundles();
    expect(list.map(x => x.person.displayName)).toEqual(["本人", "媽媽"]);
    expect(list[0].person.relation).toBe("self");
    expect(list[1].birth.localTime).toBeNull();
    expect(mem["dd:profiles"]).toBeDefined();
    expect((await db().legacy.get("localStorage-v2"))?.data).toHaveProperty("dd:quantlog");
    expect(await migrateLegacy()).toBe(0);
  });
});

describe("分數制度", () => {
  it("全部引擎通過驗證後才開放正式分數", () => {
    expect(scoringReady()).toBe(true);
  });
  it("五段區間連續涵蓋 0–100", () => {
    for (let s = 0; s <= 100; s++) expect(bandOf(s)).toBeTruthy();
    expect(bandOf(85).key).toBe("strong"); expect(bandOf(84).key).toBe("favorable");
    expect(bandOf(55).key).toBe("mixed"); expect(bandOf(54).key).toBe("weak"); expect(bandOf(39).key).toBe("unfavorable");
    expect(SCORE_BANDS.map(b => b.stars)).toEqual([5, 4, 3, 2, 1]);
  });
});

describe("鎖定狀態防護", () => {
  it("鎖定時任何寫入都被拒絕，不會以明文寫入", async () => {
    await enableLock("555666", reencryptAll);
    lock();
    await expect(saveBundle(bundle("不應寫入"))).rejects.toThrow("已鎖定");
    expect(JSON.stringify(await db().persons.toArray())).not.toContain("不應寫入");
  });
});

describe("刪除即真正刪除", () => {
  it("刪除由舊版遷移來的人物，也會從舊版快照與 localStorage 移除", async () => {
    mem["dd:profiles"] = JSON.stringify([
      { name: "甲君", birthDate: "1970-01-01", birthTime: "10:00" },
      { name: "乙君", birthDate: "1980-02-02", birthTime: null },
    ]);
    await migrateLegacy();
    const target = (await listBundles()).find(b => b.person.displayName === "甲君")!;
    await deletePerson(target.person.id);
    expect(mem["dd:profiles"]).not.toContain("甲君");
    expect(mem["dd:profiles"]).toContain("乙君");
    expect(JSON.stringify(await db().legacy.toArray())).not.toContain("甲君");
  });
  it("清除全部資料後不會重新匯入舊版資料", async () => {
    mem["dd:profiles"] = JSON.stringify([{ name: "丙君", birthDate: "1990-03-03" }]);
    await migrateLegacy();
    await wipeAll();
    expect(mem["dd:profiles"]).toBeUndefined();
    expect(await migrateLegacy()).toBe(0);
    expect((await listBundles()).length).toBe(0);
  });
});
