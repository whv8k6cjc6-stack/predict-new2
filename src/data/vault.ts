/** App 鎖與本機加密。
 *  - 啟用 App 鎖後，產生一把隨機資料金鑰（DEK）加密所有個資資料表；DEK 本身再由 PIN（PBKDF2）包裝，
 *    也可另由 Passkey（Face ID／Touch ID／Windows Hello）的 WebAuthn PRF 延伸功能包裝。
 *  - DEK 只在解鎖期間存在記憶體，鎖定即丟棄；PIN 與生物特徵從不離開裝置。
 *  - 不支援 PRF 的瀏覽器無法用生物辨識「解密」，改用 PIN（不做只擋畫面、資料仍明文的假保護）。 */
import { db } from "./db";
import {
  decryptBytes, encryptBytes, fromB64, importDataKey, keyFromPassword, keyFromSecret,
  PBKDF2_ITERATIONS, randomBytes, toB64, type EncBlob,
} from "./crypto";

export interface SecurityConfig {
  lockEnabled: boolean;
  autoLockMinutes: number;
  pin?: { salt: string; iterations: number; wrappedDek: EncBlob };
  passkey?: { credentialId: string; prfSalt: string; wrappedDek: EncBlob; createdAt: string };
}

const DEFAULT_CONFIG: SecurityConfig = { lockEnabled: false, autoLockMinutes: 5 };

let dek: CryptoKey | null = null;
let config: SecurityConfig = DEFAULT_CONFIG;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(f => f());

export const subscribeVault = (f: () => void) => { listeners.add(f); return () => { listeners.delete(f); }; };
export const getSecurityConfig = () => config;
export const isLocked = () => config.lockEnabled && !dek;
/** 目前用來加密新資料的金鑰；未啟用 App 鎖時為 null（明文儲存） */
export const activeKey = () => (config.lockEnabled ? dek : null);

export async function loadSecurity(): Promise<SecurityConfig> {
  const row = await db().meta.get("security");
  config = (row?.value as SecurityConfig) ?? DEFAULT_CONFIG;
  emit();
  return config;
}

async function saveConfig(next: SecurityConfig) {
  await db().meta.put({ key: "security", value: next });
  config = next; emit();
}

async function unwrapWithPin(pin: string): Promise<Uint8Array<ArrayBuffer>> {
  if (!config.pin) throw new Error("尚未設定 PIN");
  const k = await keyFromPassword(pin, fromB64(config.pin.salt), config.pin.iterations);
  try { return await decryptBytes(k, config.pin.wrappedDek); }
  catch { throw new Error("PIN 不正確"); }
}

export async function unlockWithPin(pin: string) {
  const raw = await unwrapWithPin(pin);
  dek = await importDataKey(raw); raw.fill(0);
  emit();
}

export function lock() { if (config.lockEnabled) { dek = null; emit(); } }

/** 啟用 App 鎖：產生 DEK、以 PIN 包裝，並把現有個資全部改為加密儲存（由 reencrypt 回呼在單一交易內完成）。 */
export async function enableLock(pin: string, reencrypt: (from: CryptoKey | null, to: CryptoKey | null) => Promise<void>) {
  validatePin(pin);
  const raw = randomBytes(32);
  const salt = randomBytes(16);
  const kek = await keyFromPassword(pin, salt);
  const wrappedDek = await encryptBytes(kek, raw);
  const key = await importDataKey(raw); raw.fill(0);
  await reencrypt(null, key);
  dek = key;
  await saveConfig({ ...config, lockEnabled: true, pin: { salt: toB64(salt), iterations: PBKDF2_ITERATIONS, wrappedDek }, passkey: undefined });
}

export async function disableLock(pin: string, reencrypt: (from: CryptoKey | null, to: CryptoKey | null) => Promise<void>) {
  const raw = await unwrapWithPin(pin);
  const key = await importDataKey(raw); raw.fill(0);
  await reencrypt(key, null);
  dek = null;
  await saveConfig({ lockEnabled: false, autoLockMinutes: config.autoLockMinutes });
}

export async function changePin(oldPin: string, newPin: string) {
  validatePin(newPin);
  const raw = await unwrapWithPin(oldPin);
  const salt = randomBytes(16);
  const wrappedDek = await encryptBytes(await keyFromPassword(newPin, salt), raw); raw.fill(0);
  await saveConfig({ ...config, pin: { salt: toB64(salt), iterations: PBKDF2_ITERATIONS, wrappedDek } });
}

export async function setAutoLockMinutes(m: number) { await saveConfig({ ...config, autoLockMinutes: m }); }

export function validatePin(pin: string) {
  if (!/^\d{6,}$/.test(pin) && pin.length < 8) throw new Error("請使用至少 6 位數字，或至少 8 個字元的密碼");
}

// ───────── Passkey（WebAuthn PRF） ─────────

export async function passkeyAvailable(): Promise<boolean> {
  try {
    return typeof window !== "undefined" && !!window.PublicKeyCredential &&
      await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch { return false; }
}

type PrfResults = { enabled?: boolean; results?: { first?: ArrayBuffer } };
const prfOf = (cred: PublicKeyCredential): PrfResults | undefined =>
  (cred.getClientExtensionResults() as { prf?: PrfResults }).prf;

async function prfSecret(credentialId: Uint8Array<ArrayBuffer>, salt: Uint8Array<ArrayBuffer>): Promise<ArrayBuffer> {
  const cred = await navigator.credentials.get({
    publicKey: {
      challenge: randomBytes(32), rpId: location.hostname, userVerification: "required", timeout: 60_000,
      allowCredentials: [{ type: "public-key", id: credentialId }],
      extensions: { prf: { eval: { first: salt } } } as AuthenticationExtensionsClientInputs,
    },
  }) as PublicKeyCredential | null;
  const first = cred && prfOf(cred)?.results?.first;
  if (!first) throw new Error("此裝置或瀏覽器不支援以生物辨識解密（WebAuthn PRF），請改用 PIN。");
  return first;
}

/** 啟用 Face ID／Touch ID：需先輸入 PIN 取得 DEK，再用 Passkey PRF 另外包裝一份。 */
export async function registerPasskey(pin: string) {
  const raw = await unwrapWithPin(pin);
  try {
    const cred = await navigator.credentials.create({
      publicKey: {
        challenge: randomBytes(32),
        rp: { id: location.hostname, name: "玄機決策" },
        user: { id: randomBytes(16), name: "xuanji-local", displayName: "玄機決策（本機解鎖）" },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
        authenticatorSelection: { authenticatorAttachment: "platform", residentKey: "preferred", userVerification: "required" },
        timeout: 60_000,
        extensions: { prf: {} } as AuthenticationExtensionsClientInputs,
      },
    }) as PublicKeyCredential | null;
    if (!cred) throw new Error("已取消");
    if (prfOf(cred)?.enabled === false) throw new Error("此裝置或瀏覽器不支援以生物辨識解密（WebAuthn PRF），請繼續使用 PIN。");
    const credentialId = new Uint8Array(cred.rawId);
    const prfSalt = randomBytes(32);
    const secret = await prfSecret(credentialId, prfSalt);
    const wrappedDek = await encryptBytes(await keyFromSecret(secret, "xuanji-dek-wrap"), raw);
    await saveConfig({ ...config, passkey: { credentialId: toB64(credentialId), prfSalt: toB64(prfSalt), wrappedDek, createdAt: new Date().toISOString() } });
  } finally { raw.fill(0); }
}

export async function unlockWithPasskey() {
  const pk = config.passkey;
  if (!pk) throw new Error("尚未啟用生物辨識解鎖");
  const secret = await prfSecret(fromB64(pk.credentialId), fromB64(pk.prfSalt));
  let raw: Uint8Array<ArrayBuffer>;
  try { raw = await decryptBytes(await keyFromSecret(secret, "xuanji-dek-wrap"), pk.wrappedDek); }
  catch { throw new Error("生物辨識解鎖失敗，請改用 PIN"); }
  dek = await importDataKey(raw); raw.fill(0);
  emit();
}

export async function removePasskey() {
  const { passkey: _removed, ...rest } = config;
  void _removed;
  await saveConfig(rest);
}

// ───────── 自動鎖定 ─────────
let hiddenAt: number | null = null;
export function installAutoLock() {
  const onVis = () => {
    if (document.visibilityState === "hidden") hiddenAt = Date.now();
    else if (hiddenAt && config.lockEnabled && Date.now() - hiddenAt > config.autoLockMinutes * 60_000) lock();
  };
  document.addEventListener("visibilitychange", onVis);
  return () => document.removeEventListener("visibilitychange", onVis);
}
