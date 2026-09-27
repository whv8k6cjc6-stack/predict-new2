/** 本機資料庫（IndexedDB，以 Dexie 封裝）。
 *  每張表的資料列格式：{ 索引欄位…, data?: T（明文） | enc?: EncBlob（加密） }。
 *  結構變更規則：新增 this.version(n+1).stores({...}).upgrade(tx => …)，並同步提高 SCHEMA_VERSION；
 *  舊版本定義永遠保留，確保任何舊資料都能逐版升級，不因更新 App 而遺失。 */
import Dexie, { type Table } from "dexie";
import type { EncBlob } from "./crypto";

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
  }
}

let instance: XuanjiDB | null = null;
export const db = () => (instance ??= new XuanjiDB());

/** 會存放個資、需隨 App 鎖加密的資料表 */
export const SENSITIVE_TABLES = ["persons", "birthProfiles", "tags", "natalCharts", "history", "legacy"] as const;
export type SensitiveTable = (typeof SENSITIVE_TABLES)[number];
