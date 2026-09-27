/** 資料結構轉換（純函式，資料庫升級、解鎖後補寫與備份還原共用）。
 *  原則：只新增或改名欄位，不丟棄使用者資料；舊設定原樣保存在 migratedFrom 供稽核；轉換後命盤結果不變。 */
import {
  DEFAULT_SETTINGS_ID, defaultSettings,
  type BirthProfile, type CalculationSettings,
} from "@/core/person";
import { legacyProfileFromV1, type CustomZiweiProfileRecord } from "@/core/ziwei/profile";

/** schema v1 的流派設定（SchoolProfile） */
export interface SettingsV1 {
  id: string; name: string; isDefault: boolean;
  bazi: { school: string; ziHour: "lateZiSameDay" | "earlyZiNextDay" };
  ziwei: { school?: string; leapMonth?: string; fireBell?: string; gengSihua?: string; ruleProfileId?: string };
  qimen: { school: string; method: string; plate: "rotating" };
  iching: { dailyMethod: "meihua_date_birthhour" };
  createdAt: string; updatedAt: string;
}

const isV2Settings = (s: unknown): s is CalculationSettings => !!s && typeof (s as CalculationSettings).ziwei?.ruleProfileId === "string" && "origin" in (s as object);

/** v1 流派設定 → CalculationSettings（紫微規則改由 Profile 表達；與標準不同者建立 legacy Profile，不改動標準 Profile） */
export function migrateSettingsV1(raw: unknown, now: string): { settings: CalculationSettings; profile: CustomZiweiProfileRecord | null } {
  if (isV2Settings(raw)) return { settings: raw, profile: null };
  const v1 = raw as SettingsV1;
  const { id: profileId, record } = legacyProfileFromV1({ baziZiHour: v1.bazi?.ziHour, leapMonth: v1.ziwei?.leapMonth, gengSihua: v1.ziwei?.gengSihua }, now);
  const base = defaultSettings(v1.createdAt || now);
  const settings: CalculationSettings = {
    id: v1.id, name: v1.id === DEFAULT_SETTINGS_ID ? base.name : v1.name, isDefault: !!v1.isDefault,
    origin: v1.id === DEFAULT_SETTINGS_ID ? "builtin" : "migrated-v1",
    bazi: { school: v1.bazi?.school ?? base.bazi.school, ziHour: v1.bazi?.ziHour ?? "lateZiSameDay" },
    ziwei: { ruleProfileId: profileId },
    qimen: { school: v1.qimen?.school ?? base.qimen.school, method: "chaibu", plate: "rotating" },
    iching: { dailyMethod: "meihua_date_birthhour" },
    migratedFrom: { schemaVersion: 1, raw: v1 },
    createdAt: v1.createdAt || now, updatedAt: v1.updatedAt || now,
  };
  return { settings, profile: record };
}

/** 出生資料正規化：schoolProfileId → calculationSettingsId；補上 timeBasis。既有 useTrueSolarTime 一律保留原值。 */
export function normalizeBirth(raw: unknown): BirthProfile {
  const b = raw as BirthProfile & { schoolProfileId?: string };
  const { schoolProfileId, ...rest } = b;
  return {
    ...rest,
    useTrueSolarTime: b.useTrueSolarTime ?? true, // v1 以前的資料一律明確保存此欄；缺值時沿用舊版預設（開啟）
    timeBasis: "civilStandard",
    calculationSettingsId: b.calculationSettingsId ?? schoolProfileId ?? DEFAULT_SETTINGS_ID,
  };
}

export const needsBirthMigration = (raw: unknown) => {
  const b = raw as Record<string, unknown>;
  return !b || "schoolProfileId" in b || !b.calculationSettingsId || !b.timeBasis;
};

/** 同一批 v1 設定轉換時，legacy Profile 可能重複產生（同 id 同內容），合併去重 */
export function uniqueProfiles(list: (CustomZiweiProfileRecord | null)[]): CustomZiweiProfileRecord[] {
  const m = new Map<string, CustomZiweiProfileRecord>();
  for (const p of list) if (p && !m.has(p.id)) m.set(p.id, p);
  return [...m.values()];
}
