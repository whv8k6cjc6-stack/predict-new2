/** 本機資料庫（IndexedDB，以 Dexie 封裝）。
 *  每張表的資料列格式：{ 索引欄位…, data?: T（明文） | enc?: EncBlob（加密） }。
 *  結構變更規則：新增 this.version(n+1).stores({...}).upgrade(tx => …)，並同步提高 SCHEMA_VERSION；
 *  舊版本定義永遠保留，確保任何舊資料都能逐版升級，不因更新 App 而遺失。 */
import Dexie, { type Table } from "dexie";
import type { EncBlob } from "./crypto";
import { migrateSettingsListV1 } from "./migrations";

export interface Row<T> { data?: T; enc?: EncBlob }
export interface PersonRow<T> extends Row<T> { id: string; updatedAt: string }
export interface BirthRow<T> extends Row<T> { personId: string }
export interface TagRow<T> extends Row<T> { id: string }
export interface PersonTagRow { personId: string; tagId: string }
export interface NatalRow<T> extends Row<T> { personId: string; system: string }
export interface HistoryRow<T> extends Row<T> { id: string; personId: string; savedAt: string }
export interface KVRow<T> { key: string; value: T }
export interface LegacyRow<T> extends Row<T> { key: string }

export class XuanjiDB extends Dexie {
  persons!: Table<PersonRow<unknown>, string>;
  birthProfiles!: Table<BirthRow<unknown>, string>;
  tags!: Table<TagRow<unknown>, string>;
  personTags!: Table<PersonTagRow, [string, string]>;
  natalCharts!: Table<NatalRow<unknown>, [string, string]>;
  history!: Table<HistoryRow<unknown>, string>;
  schoolProfiles!: Table<KVRow<unknown>, string>;
  prefs!: Table<KVRow<unknown>, string>;
  meta!: Table<KVRow<unknown>, string>;
  legacy!: Table<LegacyRow<unknown>, string>;
  ziweiRuleProfiles!: Table<KVRow<unknown>, string>;

  constructor(name = "xuanji") {
    super(name);
    // v1（SCHEMA_VERSION 1）
    this.version(1).stores({
      persons: "id, updatedAt",
      birthProfiles: "personId",
      tags: "id",
      personTags: "[personId+tagId], personId, tagId",
      natalCharts: "[personId+system], personId",
      history: "id, personId, savedAt",
      schoolProfiles: "key",
      prefs: "key",
      meta: "key",
      legacy: "key",
    });
    // v2（SCHEMA_VERSION 2）：流派設定改為 CalculationSettings，紫微規則改由 ZiweiRuleProfile 表達。
    // schoolProfiles 為明文表（不含個資），可在開啟資料庫時直接轉換；出生資料可能已加密，改於解鎖後補寫（見 repo.migrateBirthProfilesV2）。
    this.version(2).stores({ ziweiRuleProfiles: "key" }).upgrade(async tx => {
      const now = new Date().toISOString();
      const rows = (await tx.table("schoolProfiles").toArray()) as KVRow<unknown>[];
      const out = migrateSettingsListV1(rows.map(r => r.value), now);
      for (const s of out.settings) await tx.table("schoolProfiles").put({ key: s.id, value: s });
      for (const p of out.profiles) await tx.table("ziweiRuleProfiles").put({ key: p.id, value: p });
      // birthSettingsRemap：解鎖後補寫出生資料時使用（舊人物指向保留舊規則的設定）
      await tx.table("meta").put({ key: "migration-v2", value: { at: now, settings: out.settings.length, profiles: out.profiles.map(p => p.id), birthSettingsRemap: out.remap } });
    });
  }
}

let instance: XuanjiDB | null = null;
export const db = () => (instance ??= new XuanjiDB());

/** 會存放個資、需隨 App 鎖加密的資料表 */
export const SENSITIVE_TABLES = ["persons", "birthProfiles", "tags", "natalCharts", "history", "legacy"] as const;
export type SensitiveTable = (typeof SENSITIVE_TABLES)[number];
