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
  useTrueSolarTime: boolean;
  schoolProfileId: string;
  createdAt: string;
  updatedAt: string;
}

/** 流派與排盤規則設定（可多組，每位人物指定一組）。不同流派的算法不得混用。 */
export interface SchoolProfile {
  id: string;
  name: string;
  isDefault: boolean;
  bazi: { school: string; ziHour: "lateZiSameDay" | "earlyZiNextDay" };
  ziwei: { school: string; leapMonth: "splitAt15" | "asCurrent" | "asNext"; fireBell: "quanshu"; gengSihua: "陽武陰同" | "陽武同陰" };
  qimen: { school: string; method: "chaibu" | "zhirun"; plate: "rotating" };
  iching: { dailyMethod: "meihua_date_birthhour" };
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
}

export const DEFAULT_PREFS: Preferences = { displayMode: "plain", backupReminderDays: 14 };

export const DEFAULT_SCHOOL_ID = "school-default";

export function defaultSchool(now: string): SchoolProfile {
  return {
    id: DEFAULT_SCHOOL_ID, name: "預設（子平・中州派・時家轉盤拆補）", isDefault: true,
    bazi: { school: "子平・滴天髓闡微", ziHour: "lateZiSameDay" },
    ziwei: { school: "中州派", leapMonth: "splitAt15", fireBell: "quanshu", gengSihua: "陽武陰同" },
    qimen: { school: "時家轉盤", method: "chaibu", plate: "rotating" },
    iching: { dailyMethod: "meihua_date_birthhour" },
    createdAt: now, updatedAt: now,
  };
}

/** 一位人物的完整可編輯資料 */
export interface PersonBundle { person: Person; birth: BirthProfile; tagIds: string[] }
