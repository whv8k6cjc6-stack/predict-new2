/** 備份／還原。格式含 schema_version；匯入時逐版 migration，確保舊備份永遠可還原。
 *  本命快取不匯出（匯入後由本機引擎依目前版本重算）。 */
import { APP_VERSION, BACKUP_SCHEMA_VERSION } from "@/core/versioning";
import { ENGINES } from "@/core/registry";
import { decryptJSON, encryptJSON, fromB64, keyFromPassword, PBKDF2_ITERATIONS, randomBytes, toB64, type EncBlob } from "./crypto";
import { dumpPlain, restorePlain, setPrefs, nowISO, type PlainDump } from "./repo";

export interface BackupFile {
  format: "xuanji-backup";
  schema_version: number;
  app_version: string;
  exported_at: string;
  scope: "all" | "selected";
  person_count: number;
  engines: { id: string; status: string; engine_version: string; rule_version: string; source_version: string; school: string }[];
  encrypted: boolean;
  payload?: PlainDump;
  enc?: { kdf: "PBKDF2-SHA256"; iterations: number; salt: string } & EncBlob;
}

export async function createBackup(opts: { personIds?: string[]; password?: string }): Promise<{ file: BackupFile; filename: string }> {
  let dump = await dumpPlain();
  if (opts.personIds) {
    const ids = new Set(opts.personIds);
    const usedTags = new Set(dump.personTags.filter(l => ids.has(l.personId)).map(l => l.tagId));
    dump = {
      ...dump,
      persons: dump.persons.filter(p => ids.has(p.id)),
      birthProfiles: dump.birthProfiles.filter(b => ids.has(b.personId)),
      personTags: dump.personTags.filter(l => ids.has(l.personId)),
      tags: dump.tags.filter(t => usedTags.has(t.id)),
      history: (dump.history as { personId: string }[]).filter(h => ids.has(h.personId)),
      legacy: [],
    };
  }
  const file: BackupFile = {
    format: "xuanji-backup", schema_version: BACKUP_SCHEMA_VERSION, app_version: APP_VERSION, exported_at: nowISO(),
    scope: opts.personIds ? "selected" : "all", person_count: dump.persons.length,
    engines: ENGINES.map(e => ({ id: e.id, status: e.status, ...e.stamp })),
    encrypted: !!opts.password,
  };
  if (opts.password) {
    const salt = randomBytes(16);
    const key = await keyFromPassword(opts.password, salt);
    file.enc = { kdf: "PBKDF2-SHA256", iterations: PBKDF2_ITERATIONS, salt: toB64(salt), ...(await encryptJSON(key, dump)) };
  } else file.payload = dump;
  const stamp = file.exported_at.slice(0, 16).replace(/[-:T]/g, "");
  const filename = `xuanji-${opts.personIds ? "persons" : "backup"}-${stamp}${opts.password ? "-encrypted" : ""}.json`;
  return { file, filename };
}

/** 把備份交給使用者：支援分享表單（iPhone 可存到「檔案」）則用分享，否則下載。 */
export async function deliverBackup(file: BackupFile, filename: string) {
  const blob = new Blob([JSON.stringify(file, null, 2)], { type: "application/json" });
  const f = new File([blob], filename, { type: "application/json" });
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.canShare?.({ files: [f] }) && /iPhone|iPad|Android/i.test(navigator.userAgent)) {
    try { await navigator.share({ files: [f], title: filename }); return; } catch (e) { if ((e as Error).name === "AbortError") throw e; }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export async function exportAndDeliver(opts: { personIds?: string[]; password?: string }) {
  const { file, filename } = await createBackup(opts);
  await deliverBackup(file, filename);
  if (!opts.personIds) await setPrefs({ lastBackupAt: nowISO() });
  return file;
}

export class BackupError extends Error {}

export function parseBackup(text: string): BackupFile {
  let obj: unknown;
  try { obj = JSON.parse(text); } catch { throw new BackupError("檔案不是有效的 JSON。"); }
  const f = obj as BackupFile;
  if (f?.format !== "xuanji-backup") throw new BackupError("這不是玄機決策的備份檔。");
  if (typeof f.schema_version !== "number") throw new BackupError("備份檔缺少 schema_version。");
  if (f.schema_version > BACKUP_SCHEMA_VERSION) throw new BackupError(`備份檔版本（${f.schema_version}）比目前 App 新，請先更新 App。`);
  return f;
}

export async function openBackup(f: BackupFile, password?: string): Promise<PlainDump> {
  let payload: unknown = f.payload;
  if (f.encrypted) {
    if (!password) throw new BackupError("此備份已加密，請輸入備份密碼。");
    if (!f.enc) throw new BackupError("加密備份內容缺失。");
    try { payload = await decryptJSON(await keyFromPassword(password, fromB64(f.enc.salt), f.enc.iterations), f.enc); }
    catch { throw new BackupError("備份密碼不正確。"); }
  }
  return migrateBackup(payload, f.schema_version);
}

/** 逐版遷移：未來 schema_version 2、3… 在此依序加上轉換。 */
const MIGRATIONS: Record<number, (p: unknown) => unknown> = {
  // 1: p => ({ ...p, newField: [] }),   // v1 → v2 範例
};

export function migrateBackup(payload: unknown, from: number): PlainDump {
  let p = payload;
  for (let v = from; v < BACKUP_SCHEMA_VERSION; v++) {
    const m = MIGRATIONS[v];
    if (!m) throw new BackupError(`缺少 v${v} → v${v + 1} 的轉換程式。`);
    p = m(p);
  }
  const d = p as PlainDump;
  if (!Array.isArray(d?.persons) || !Array.isArray(d?.birthProfiles)) throw new BackupError("備份內容結構不完整。");
  return { ...d, tags: d.tags ?? [], personTags: d.personTags ?? [], schoolProfiles: d.schoolProfiles ?? [], history: d.history ?? [], legacy: d.legacy ?? [] };
}

export const restoreBackup = (dump: PlainDump, mode: "merge" | "replace") => restorePlain(dump, mode);
