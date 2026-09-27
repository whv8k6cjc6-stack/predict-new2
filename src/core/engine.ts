/** 命理引擎統一介面。各術數引擎只產生「事實（Fact）」，不下吉凶結論；
 *  結論一律由規則庫（sources.ts 的 RuleDefinition）產生，分數由 Scoring Engine 統一計算。 */
import type { VersionStamp } from "./versioning";
import type { BirthProfile, SchoolProfile, Gender } from "./person";

export type SystemId = "calendar" | "bazi" | "ziwei" | "qimen" | "iching" | "fusion" | "scoring";

export type EngineStatus =
  | "not_implemented"   // 尚未開發
  | "in_development"    // 開發中（有程式碼但未通過回歸驗證，不得用於正式分數）
  | "preview"           // 可預覽（通過基本驗證，畫面需標示預覽）
  | "verified";         // 通過回歸測試，可用於正式分數

export interface EngineMeta {
  id: SystemId;
  name: string;
  phase: number;         // 開發階段（見 docs/V3_DESIGN.md）
  status: EngineStatus;
  stamp: VersionStamp;
  summary: string;
}

/** 分析時點（以當地民用時間＋IANA 時區表示；由 Calendar Engine 換算） */
export interface Moment {
  civilDate: string;     // YYYY-MM-DD
  civilTime: string;     // HH:mm
  timeZone: string;      // IANA
  location?: { lat: number; lng: number };
}

export interface ChartInput {
  personId: string;
  gender: Gender;
  birth: BirthProfile;
  school: SchoolProfile;
}

/** 引擎產生的事實：可被規則比對，也可在專業模式與證據鏈中顯示「怎麼算出來的」 */
export interface Fact {
  key: string;           // 命名空間，例 "bazi.flow.day.stemTenGod"
  value: unknown;
  label: string;         // 人類可讀名稱
  derivation: string;    // 推導說明
  system: SystemId;
}

export type EngineResult<T> =
  | { ok: true; data: T; facts: Fact[]; stamp: VersionStamp; warnings: string[] }
  | { ok: false; reason: "not_implemented" | "insufficient_data" | "invalid_input"; message: string; stamp: VersionStamp };

/** 本命：不隨日期改變，可快取（以 stamp + inputHash 為鍵） */
export interface NatalEngine<TNatal> {
  meta: EngineMeta;
  computeNatal(input: ChartInput): EngineResult<TNatal>;
}

/** 行運：隨時間改變，每次重算，不入庫 */
export interface TransitEngine<TNatal, TTransit> {
  meta: EngineMeta;
  computeTransit(natal: TNatal, input: ChartInput, at: Moment): EngineResult<TTransit>;
}

export type DivinationEngine<TNatal, TTransit> = NatalEngine<TNatal> & TransitEngine<TNatal, TTransit>;

export const notImplemented = <T,>(meta: EngineMeta): EngineResult<T> => ({
  ok: false, reason: "not_implemented", stamp: meta.stamp,
  message: `${meta.name}尚未完成（預定第 ${meta.phase} 階段），不產生任何結果。`,
});
