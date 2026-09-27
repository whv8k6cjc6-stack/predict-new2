/** 資料結構轉換（純函式，資料庫升級、解鎖後補寫與備份還原共用）。
 *  原則：只新增或改名欄位，不丟棄使用者資料；舊設定原樣保存在 migratedFrom 供稽核；轉換後命盤結果不變。 */
import {
  DEFAULT_SETTINGS_ID, defaultSettings,
  type BirthProfile, type CalculationSettings,
} from "@/core/person";
import { DEFAULT_ZIWEI_PROFILE_ID, legacyProfileFromV1, type CustomZiweiProfileRecord } from "@/core/ziwei/profile";

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

/** 舊版「預設」流派設定與標準 Profile 不同時，舊人物改指向此設定（保留升級前命盤）；預設設定則恢復標準 Profile 供新人物使用 */
export const LEGACY_DEFAULT_SETTINGS_ID = "school-default-v1";
/** v1 出生資料的設定 id 對應（只作用於尚未轉換的 v1 資料列，新人物不受影響） */
export type BirthSettingsRemap = Record<string, string>;

/** 一批 v1 流派設定一起轉換：
 *  - 一般設定：migrateSettingsV1。
 *  - 預設設定若轉成 legacy Profile：拆成「school-default（標準 Profile，新人物用）」與「school-default-v1（legacy Profile，舊人物用）」，
 *    並回傳 remap 讓舊出生資料指向後者。legacy Profile 因此只服務舊資料，不會被新人物自動選到。 */
export function migrateSettingsListV1(raws: unknown[], now: string): { settings: CalculationSettings[]; profiles: CustomZiweiProfileRecord[]; remap: BirthSettingsRemap } {
  const settings: CalculationSettings[] = [], remap: BirthSettingsRemap = {};
  const conv = raws.map(raw => ({ raw, ...migrateSettingsV1(raw, now) }));
  for (const c of conv) {
    const s = c.settings;
    if (!isV2Settings(c.raw) && s.id === DEFAULT_SETTINGS_ID && s.ziwei.ruleProfileId !== DEFAULT_ZIWEI_PROFILE_ID) {
      settings.push({ ...s, id: LEGACY_DEFAULT_SETTINGS_ID, name: "舊版預設設定（保留升級前命盤）", isDefault: false, origin: "migrated-v1" });
      settings.push({ ...s, ziwei: { ruleProfileId: DEFAULT_ZIWEI_PROFILE_ID } });
      remap[DEFAULT_SETTINGS_ID] = LEGACY_DEFAULT_SETTINGS_ID;
    } else settings.push(s);
  }
  return { settings, profiles: uniqueProfiles(conv.map(c => c.profile)), remap };
}

/** 出生資料正規化：schoolProfileId → calculationSettingsId；補上 timeBasis。既有 useTrueSolarTime 一律保留原值。
 *  remap 只套用在 v1 資料列（尚無 calculationSettingsId 者）。 */
export function normalizeBirth(raw: unknown, remap: BirthSettingsRemap = {}): BirthProfile {
  const b = raw as BirthProfile & { schoolProfileId?: string };
  const { schoolProfileId, ...rest } = b;
  const v1Id = schoolProfileId ?? DEFAULT_SETTINGS_ID;
  return {
    ...rest,
    useTrueSolarTime: b.useTrueSolarTime ?? true, // v1 以前的資料一律明確保存此欄；缺值時沿用舊版預設（開啟）
    timeBasis: "civilStandard",
    calculationSettingsId: b.calculationSettingsId ?? remap[v1Id] ?? v1Id,
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
