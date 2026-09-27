/** 資料存取層：UI 與服務只透過這裡讀寫，不直接碰 IndexedDB。
 *  依 App 鎖狀態自動加解密；加解密一律在交易外完成，交易內只做同步寫入（避免 IndexedDB 交易提前結束）。 */
import { db, SENSITIVE_TABLES, type Row } from "./db";
import { decryptJSON, encryptJSON } from "./crypto";
import { activeKey, isLocked } from "./vault";
import {
  DEFAULT_PREFS, DEFAULT_SETTINGS_ID, defaultSettings,
  type BirthProfile, type CalculationSettings, type Person, type PersonBundle, type Preferences, type Tag,
} from "@/core/person";
import type { CustomZiweiProfileRecord } from "@/core/ziwei/profile";
import { computeSolarTimeAudit } from "@/core/calendar/solarTime";
import { migrateSettingsV1, needsBirthMigration, normalizeBirth } from "./migrations";

export const nowISO = () => new Date().toISOString();
export const newId = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36));

async function pack<T>(data: T): Promise<Row<T>> {
  if (isLocked()) throw new Error("App 已鎖定，請先解鎖");
  const k = activeKey();
  return k ? { enc: await encryptJSON(k, data) } : { data };
}
async function unpack<T>(row: Row<T> | undefined): Promise<T | undefined> {
  if (!row) return undefined;
  if (row.enc) {
    const k = activeKey();
    if (!k) throw new Error("資料已加密，請先解鎖");
    return decryptJSON<T>(k, row.enc);
  }
  return row.data;
}

// ───────── 初始化 ─────────
export async function ensureSeed() {
  const d = db();
  if (!(await d.schoolProfiles.get(DEFAULT_SETTINGS_ID))) await d.schoolProfiles.put({ key: DEFAULT_SETTINGS_ID, value: defaultSettings(nowISO()) });
  if (!(await d.meta.get("schema"))) await d.meta.put({ key: "schema", value: { version: d.verno, createdAt: nowISO() } });
  if (navigator.storage?.persist) { try { await navigator.storage.persist(); } catch { /* 部分瀏覽器不支援 */ } }
}

export async function storageStatus() {
  const persisted = navigator.storage?.persisted ? await navigator.storage.persisted().catch(() => false) : false;
  const est = navigator.storage?.estimate ? await navigator.storage.estimate().catch(() => null) : null;
  return { persisted, usage: est?.usage ?? null, quota: est?.quota ?? null };
}

// ───────── 人物 ─────────
export async function listBundles(): Promise<PersonBundle[]> {
  const d = db();
  const [pRows, bRows, links] = await Promise.all([d.persons.toArray(), d.birthProfiles.toArray(), d.personTags.toArray()]);
  const births = new Map<string, BirthProfile>();
  for (const r of bRows) { const b = await unpack(r as Row<unknown>); if (b) births.set(r.personId, normalizeBirth(b)); }
  const out: PersonBundle[] = [];
  for (const r of pRows) {
    const person = await unpack(r as Row<Person>);
    const birth = births.get(r.id);
    if (person && birth) out.push({ person, birth, tagIds: links.filter(l => l.personId === r.id).map(l => l.tagId) });
  }
  return out.sort((a, b) => a.person.sortOrder - b.person.sortOrder);
}

export async function saveBundle(b: PersonBundle) {
  const t = nowISO();
  const person: Person = { ...b.person, updatedAt: t, createdAt: b.person.createdAt || t };
  const nb = normalizeBirth({ ...b.birth, personId: person.id, updatedAt: t, createdAt: b.birth.createdAt || t });
  const birth: BirthProfile = { ...nb, solarTimeAudit: computeSolarTimeAudit(nb, t) };
  const [pRow, bRow] = await Promise.all([pack(person), pack(birth)]);
  const d = db();
  await d.transaction("rw", d.persons, d.birthProfiles, d.personTags, d.natalCharts, async () => {
    await d.persons.put({ id: person.id, updatedAt: t, ...pRow });
    await d.birthProfiles.put({ personId: person.id, ...bRow });
    await d.personTags.where("personId").equals(person.id).delete();
    if (b.tagIds.length) await d.personTags.bulkPut(b.tagIds.map(tagId => ({ personId: person.id, tagId })));
    await d.natalCharts.where("personId").equals(person.id).delete(); // 出生資料可能改變 → 本命快取失效
  });
}

/** 刪除人物：同一交易內連帶刪除出生資料、標籤關聯、本命快取、分析紀錄；並從舊版資料快照中移除此人 */
export async function deletePerson(id: string) {
  const d = db();
  const person = await unpack((await d.persons.get(id)) as Row<Person> | undefined);
  const birth = await unpack((await d.birthProfiles.get(id)) as Row<BirthProfile> | undefined);
  await d.transaction("rw", [d.persons, d.birthProfiles, d.personTags, d.natalCharts, d.history, d.prefs], async () => {
    await d.persons.delete(id);
    await d.birthProfiles.delete(id);
    await d.personTags.where("personId").equals(id).delete();
    await d.natalCharts.where("personId").equals(id).delete();
    await d.history.where("personId").equals(id).delete();
    const pr = await d.prefs.get("prefs");
    if ((pr?.value as Preferences | undefined)?.activePersonId === id)
      await d.prefs.put({ key: "prefs", value: { ...(pr!.value as Preferences), activePersonId: undefined } });
  });
  if (person && birth) await scrubLegacyPerson(person.displayName, birth.localDate);
}

type LegacyProfileLite = { name?: string; birthDate?: string };
const sameLegacy = (p: LegacyProfileLite, name: string, date: string) => p?.name === name && p?.birthDate === date;

/** 舊版（localStorage 與 legacy 快照）中與此人相符的出生資料一併移除，確保刪除即真正刪除 */
async function scrubLegacyPerson(name: string, date: string) {
  try {
    const raw = localStorage.getItem("dd:profiles");
    if (raw) {
      const arr = JSON.parse(raw) as LegacyProfileLite[];
      const next = arr.filter(p => !sameLegacy(p, name, date));
      if (next.length !== arr.length) localStorage.setItem("dd:profiles", JSON.stringify(next));
    }
  } catch { /* 舊資料格式異常時略過 */ }
  const d = db();
  const row = await d.legacy.get("localStorage-v2");
  const snap = await unpack(row as Row<Record<string, unknown>> | undefined);
  const profiles = snap?.["dd:profiles"];
  if (snap && Array.isArray(profiles)) {
    const next = (profiles as LegacyProfileLite[]).filter(p => !sameLegacy(p, name, date));
    if (next.length !== profiles.length) await d.legacy.put({ key: "localStorage-v2", ...(await pack({ ...snap, "dd:profiles": next })) });
  }
}

export const LEGACY_LOCALSTORAGE_KEYS = ["dd:profiles", "dd:history", "dd:settings", "dd:strategies", "dd:quantlog"];

async function patchPerson(id: string, patch: Partial<Person>) {
  const d = db();
  const row = await d.persons.get(id);
  const person = await unpack(row as Row<Person>);
  if (!person) return;
  const next = { ...person, ...patch, updatedAt: patch.updatedAt ?? person.updatedAt };
  await d.persons.put({ id, updatedAt: next.updatedAt, ...(await pack(next)) });
}
export const setFavorite = (id: string, v: boolean) => patchPerson(id, { isFavorite: v, updatedAt: nowISO() });
export const touchPerson = (id: string) => patchPerson(id, { lastViewedAt: nowISO() });
export async function reorderPersons(ids: string[]) { for (let i = 0; i < ids.length; i++) await patchPerson(ids[i], { sortOrder: i }); }

export async function nextSortOrder() {
  const all = await listBundles();
  return all.length ? Math.max(...all.map(b => b.person.sortOrder)) + 1 : 0;
}

// ───────── 標籤 ─────────
export async function listTags(): Promise<Tag[]> {
  const rows = await db().tags.toArray();
  const out: Tag[] = [];
  for (const r of rows) { const t = await unpack(r as Row<Tag>); if (t) out.push(t); }
  return out.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}
export async function saveTag(tag: Tag) { await db().tags.put({ id: tag.id, ...(await pack(tag)) }); }
export async function deleteTag(id: string) {
  const d = db();
  await d.transaction("rw", d.tags, d.personTags, async () => {
    await d.tags.delete(id);
    await d.personTags.where("tagId").equals(id).delete();
  });
}

// ───────── 偏好、流派 ─────────
export async function getPrefs(): Promise<Preferences> {
  const r = await db().prefs.get("prefs");
  return { ...DEFAULT_PREFS, ...((r?.value as Preferences) ?? {}) };
}
export async function setPrefs(patch: Partial<Preferences>) {
  const cur = await getPrefs();
  await db().prefs.put({ key: "prefs", value: { ...cur, ...patch } });
}
/** 計算設定（明文，不含個資）；讀取時一併容錯轉換 v1 格式 */
export async function listSettings(): Promise<CalculationSettings[]> {
  return (await db().schoolProfiles.toArray()).map(r => migrateSettingsV1(r.value, nowISO()).settings);
}
export async function saveSettings(s: CalculationSettings) { await db().schoolProfiles.put({ key: s.id, value: { ...s, updatedAt: nowISO() } }); }

/** 自訂／legacy 紫微 Profile：只能新增，不可修改（同 id 內容不同即拒絕） */
export async function listZiweiProfiles(): Promise<CustomZiweiProfileRecord[]> {
  return (await db().ziweiRuleProfiles.toArray()).map(r => r.value as CustomZiweiProfileRecord);
}
export async function addZiweiProfile(p: CustomZiweiProfileRecord) {
  const d = db();
  const cur = await d.ziweiRuleProfiles.get(p.id);
  if (cur) {
    const c = cur.value as CustomZiweiProfileRecord;
    if (JSON.stringify([c.baseProfileId, c.overrides]) !== JSON.stringify([p.baseProfileId, p.overrides])) throw new Error(`Profile「${p.id}」已存在且內容不同，Profile 不可修改`);
    return;
  }
  await d.ziweiRuleProfiles.put({ key: p.id, value: p });
}

/** 解鎖後補寫：出生資料欄位正規化並寫入真太陽時稽核快照（出生資料可能已加密，無法在資料庫升級當下處理）。
 *  只新增欄位；原始出生日期、時間、地點、時區與真太陽時偏好不變。 */
export async function migrateBirthProfilesV2(): Promise<number> {
  const d = db();
  if (isLocked()) throw new Error("App 已鎖定，請先解鎖");
  const rows = await d.birthProfiles.toArray();
  const now = nowISO();
  const updates: { personId: string; row: Row<BirthProfile> }[] = [];
  for (const r of rows) {
    const raw = await unpack(r as Row<unknown>);
    if (!raw) continue;
    const b = normalizeBirth(raw);
    if (!needsBirthMigration(raw) && (b.solarTimeAudit || !b.localTime)) continue;
    updates.push({ personId: r.personId, row: await pack({ ...b, solarTimeAudit: b.solarTimeAudit ?? computeSolarTimeAudit(b, now) }) });
  }
  if (updates.length) await d.transaction("rw", d.birthProfiles, async () => { for (const u of updates) await d.birthProfiles.put({ personId: u.personId, ...u.row }); });
  return updates.length;
}

// ───────── 加密轉換（App 鎖啟用／停用時） ─────────
type AnyRow = Row<unknown> & Record<string, unknown>;

/** 讀出所有個資資料列，以 from 解密、以 to 重新加密（to 為 null 則明文），最後單一交易寫回。 */
export async function reencryptAll(from: CryptoKey | null, to: CryptoKey | null) {
  const d = db();
  const plan: { table: (typeof SENSITIVE_TABLES)[number]; rows: AnyRow[] }[] = [];
  for (const name of SENSITIVE_TABLES) {
    const rows = (await d.table(name).toArray()) as AnyRow[];
    const next: AnyRow[] = [];
    for (const r of rows) {
      const { data, enc, ...keys } = r;
      let value: unknown = data;
      if (enc) {
        if (!from) throw new Error("遇到已加密資料但未提供金鑰");
        value = await decryptJSON(from, enc);
      }
      next.push(to ? { ...keys, enc: await encryptJSON(to, value) } : { ...keys, data: value });
    }
    plan.push({ table: name, rows: next });
  }
  await d.transaction("rw", SENSITIVE_TABLES.map(n => d.table(n)), async () => {
    for (const p of plan) { await d.table(p.table).clear(); if (p.rows.length) await d.table(p.table).bulkPut(p.rows); }
  });
}

// ───────── 原始匯出／匯入（備份用） ─────────
export async function dumpPlain() {
  const d = db();
  const unpackAll = async <T,>(rows: Row<T>[]) => { const o: T[] = []; for (const r of rows) { const v = await unpack(r); if (v !== undefined) o.push(v); } return o; };
  return {
    persons: await unpackAll((await d.persons.toArray()) as Row<Person>[]),
    birthProfiles: (await unpackAll((await d.birthProfiles.toArray()) as Row<unknown>[])).map(normalizeBirth),
    tags: await unpackAll((await d.tags.toArray()) as Row<Tag>[]),
    personTags: await d.personTags.toArray(),
    calculationSettings: await listSettings(),
    ziweiRuleProfiles: await listZiweiProfiles(),
    history: await unpackAll((await d.history.toArray()) as Row<unknown>[]),
    legacy: await Promise.all((await d.legacy.toArray()).map(async r => ({ key: r.key, value: await unpack(r) }))),
    prefs: await getPrefs(),
  };
}
export type PlainDump = Awaited<ReturnType<typeof dumpPlain>>;

export async function restorePlain(dump: PlainDump, mode: "merge" | "replace") {
  const d = db();
  const encode = async <T,>(v: T) => pack(v);
  const persons = await Promise.all(dump.persons.map(async p => ({ id: p.id, updatedAt: p.updatedAt, ...(await encode(p)) })));
  const births = await Promise.all(dump.birthProfiles.map(normalizeBirth).map(async b => ({ personId: b.personId, ...(await encode(b)) })));
  const tags = await Promise.all(dump.tags.map(async t => ({ id: t.id, ...(await encode(t)) })));
  const history = await Promise.all((dump.history as { id: string; personId: string; savedAt: string }[]).map(async h => ({ id: h.id, personId: h.personId, savedAt: h.savedAt, ...(await encode(h)) })));
  const legacy = await Promise.all(dump.legacy.map(async l => ({ key: l.key, ...(await encode(l.value)) })));
  for (const p of dump.ziweiRuleProfiles) await addZiweiProfile(p);
  await d.transaction("rw", [d.persons, d.birthProfiles, d.tags, d.personTags, d.history, d.legacy, d.schoolProfiles, d.natalCharts], async () => {
    if (mode === "replace") {
      for (const t of [d.persons, d.birthProfiles, d.tags, d.personTags, d.history, d.legacy, d.natalCharts]) await t.clear();
    }
    await d.persons.bulkPut(persons);
    await d.birthProfiles.bulkPut(births);
    await d.tags.bulkPut(tags);
    await d.personTags.bulkPut(dump.personTags);
    await d.history.bulkPut(history);
    await d.legacy.bulkPut(legacy);
    for (const s of dump.calculationSettings) await d.schoolProfiles.put({ key: s.id, value: s });
    for (const p of dump.persons) await d.natalCharts.where("personId").equals(p.id).delete();
  });
}

/** 清除此裝置上的所有資料（含舊版 localStorage 資料），並標記不再自動匯入舊資料 */
export async function wipeAll() {
  const d = db();
  await d.transaction("rw", d.tables, async () => { for (const t of d.tables) await t.clear(); });
  try { for (const k of LEGACY_LOCALSTORAGE_KEYS) localStorage.removeItem(k); } catch { /* 無 localStorage 時略過 */ }
}
