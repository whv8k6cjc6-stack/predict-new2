/** 人物與出生資料模型。人物基本資料、出生資料、流派設定、本命快取分開保存。 */
import type { VersionStamp } from "./versioning";
import type { SystemId } from "./engine";

export type Gender = "male" | "female";
export type Relation = "self" | "family" | "friend" | "colleague" | "boss" | "client" | "other";

export const RELATIONS: { key: Relation; label: string }[] = [
  { key: "self", label: "自己" }, { key: "family", label: "家人" }, { key: "friend", label: "朋友" },
  { key: "colleague", label: "同事" }, { key: "boss", label: "主管" }, { key: "client", label: "客戶" }, { key: "other", label: "其他" },
];
export const relationLabel = (r: Relation) => RELATIONS.find(x => x.key === r)?.label ?? "其他";

export interface Person {
  id: string;
  displayName: string;       // 姓名／暱稱（清單顯示用）
  fullName?: string;
  gender: Gender;
  relation: Relation;
  relationNote?: string;     // 例：父親、母親、部門主管
  isFavorite: boolean;
  sortOrder: number;
  lastViewedAt?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export type TimeAccuracy = "exact" | "approx15" | "approx60" | "unknown";
export const TIME_ACCURACY: { key: TimeAccuracy; label: string }[] = [
  { key: "exact", label: "確定（到分鐘）" }, { key: "approx15", label: "大約（±15 分）" },
  { key: "approx60", label: "大約（±1 小時）" }, { key: "unknown", label: "不知道" },
];

export interface BirthProfile {
  personId: string;
  localDate: string;          // 出生地當地民用日期（西元）YYYY-MM-DD
  localTime: string | null;   // HH:mm；不知道為 null
  timeAccuracy: TimeAccuracy;
  inputCalendar: "solar" | "lunar";
  lunarInput?: { year: number; month: number; day: number; isLeap: boolean };
  place: { name: string; countryCode: string; lat: number; lng: number };
  timeZone: string;           // IANA 時區；夏令時間由時區資料自動判斷
  dstOverride: "auto" | "on" | "off";
  useTrueSolarTime: boolean;  // 真太陽時校正偏好（出生時間本身仍為民用標準時間）
  timeBasis: "civilStandard"; // 記錄的出生時間＝出生證明／戶籍的民用時間（Source of Truth）
  calculationSettingsId: string; // 預設使用哪一組計算設定（規則不屬於人物本身）
  solarTimeAudit?: SolarTimeAudit; // 稽核快照：只供顯示、比較與偵測版本差異，不作為排盤輸入
  createdAt: string;
  updatedAt: string;
}

/** 真太陽時稽核快照。排盤一律由原始出生資料重算；此快照若與重算結果不同，只顯示差異警告。 */
export interface SolarTimeAudit {
  calendarVersion: string;
  computedAt: string;
  originalLocal: string;        // 記錄的出生日期時間（民用標準時間）
  utcOffset: string;            // 例 UTC+8
  useTrueSolarTime: boolean;
  correctionMinutes: number;    // 排盤時間相對記錄時間的總校正（含夏令、經度、均時差）
  calculatedLocal: string;      // 實際排盤時間
  standardHourBranch: string;   // 以標準時間計的時辰
  calculatedHourBranch: string; // 以實際排盤時間計的時辰
  crossesHourBoundary: boolean;
  crossesDate: boolean;
}

/** 計算設定：這次排盤採用哪些規則（可多組；同一人物可用不同設定排盤比較）。
 *  各命理模組的規則各自獨立：八字的日界設定不影響紫微，紫微規則一律由 ZiweiRuleProfile 決定。 */
export interface CalculationSettings {
  id: string;
  name: string;
  isDefault: boolean;
  origin: "builtin" | "user" | "migrated-v1";
  bazi: { school: string; ziHour: "lateZiSameDay" | "earlyZiNextDay" };
  ziwei: { ruleProfileId: string };
  /** selfStem：代表自己的天干；year＝年命（出生年干，預設）、day＝當日日干（擇時常用） */
  qimen: { school: string; method: "chaibu"; plate: "rotating"; selfStem?: "year" | "day" };
  iching: { dailyMethod: "meihua_date_birthhour" };
  /** 由 schema v1 轉換時保留的原始設定（稽核用） */
  migratedFrom?: { schemaVersion: 1; raw: unknown };
  createdAt: string;
  updatedAt: string;
}

export interface Tag { id: string; name: string; createdAt: string }
export interface PersonTag { personId: string; tagId: string }

export interface NatalChartCache {
  personId: string;
  system: SystemId;
  stamp: VersionStamp;
  inputHash: string;
  data: unknown;
  computedAt: string;
}

export interface AnalysisHistory {
  id: string;
  personId: string;
  kind: "daily" | "event" | "compare" | "timeline";
  target: { date: string; time?: string; eventType?: string; dates?: string[] };
  snapshot: unknown;
  feedback?: { rating: "hit" | "neutral" | "miss"; note?: string; at: string };
  savedAt: string;
}

export interface Preferences {
  displayMode: "plain" | "pro";
  activePersonId?: string;
  lastBackupAt?: string;
  backupReminderDays: number;
  developerMode?: boolean;   // 開發者模式：可檢視規則、版本與 legacy 計分比較（不影響正式結果）
  /** 投資設定：只調整投資建議的用語與檢查清單，不影響判讀 */
  investor?: import("./advice/investor").InvestorProfile;
  /** 工作角色：只調整建議與時間表的用語 */
  work?: import("./advice/workRole").WorkProfile;
}

export const DEFAULT_PREFS: Preferences = { displayMode: "plain", backupReminderDays: 14 };

export const DEFAULT_SETTINGS_ID = "school-default"; // 沿用 v1 的 id，確保既有人物的關聯不變

export function defaultSettings(now: string): CalculationSettings {
  return {
    id: DEFAULT_SETTINGS_ID, name: "預設（子平・通行排盤 iztro 相容・時家轉盤拆補）", isDefault: true, origin: "builtin",
    bazi: { school: "子平・滴天髓闡微", ziHour: "lateZiSameDay" },
    ziwei: { ruleProfileId: "iztro_compatible_v1" },
    qimen: { school: "時家轉盤", method: "chaibu", plate: "rotating" },
    iching: { dailyMethod: "meihua_date_birthhour" },
    createdAt: now, updatedAt: now,
  };
}

/** 新增人物的出生資料預設值：出生時間為民用標準時間，真太陽時校正預設關閉 */
export function newBirthDefaults(personId: string, now: string): BirthProfile {
  return {
    personId, localDate: "", localTime: "", timeAccuracy: "exact", inputCalendar: "solar",
    place: { name: "台南", countryCode: "TW", lat: 22.99, lng: 120.21 }, timeZone: "Asia/Taipei", dstOverride: "auto",
    useTrueSolarTime: false, timeBasis: "civilStandard", calculationSettingsId: DEFAULT_SETTINGS_ID, createdAt: "", updatedAt: now,
  };
}

/** 一位人物的完整可編輯資料 */
export interface PersonBundle { person: Person; birth: BirthProfile; tagIds: string[] }
