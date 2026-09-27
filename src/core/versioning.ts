/** 所有計算結果都必須帶上版本戳記，確保「同樣輸入 → 同樣輸出」可重現、可追溯。 */

export const APP_VERSION = "3.0.0-phase1";

/** 本機資料庫結構版本（每次改動資料表結構 +1，並在 src/data/db.ts 加 migration）。 */
export const SCHEMA_VERSION = 1;

/** 備份檔格式版本（每次改動備份 JSON 結構 +1，並在 src/data/backup.ts 加 migration）。 */
export const BACKUP_SCHEMA_VERSION = 1;

export interface VersionStamp {
  school: string;          // 流派，例 "子平・滴天髓闡微"、"紫微・中州派"、"奇門・時家轉盤拆補"
  engine_version: string;  // 排盤引擎版本（演算法改變即升版）
  rule_version: string;    // 規則庫版本
  source_version: string;  // 古籍／注解資料版本
}

export const NO_STAMP: VersionStamp = { school: "—", engine_version: "0", rule_version: "0", source_version: "0" };
