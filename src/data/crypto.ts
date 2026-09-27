/** WebCrypto 工具：AES-GCM 256 加密、PBKDF2-SHA256 由密碼派生金鑰、HKDF 由 Passkey PRF 派生金鑰。 */

export const PBKDF2_ITERATIONS = 600_000;

export interface EncBlob { iv: string; ct: string }

const enc = new TextEncoder();
const dec = new TextDecoder();

export const toB64 = (buf: ArrayBuffer | Uint8Array): string => {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = ""; for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
};
export const fromB64 = (b64: string): Uint8Array<ArrayBuffer> => {
  const s = atob(b64); const out = new Uint8Array(new ArrayBuffer(s.length));
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
};
export const randomBytes = (n: number) => crypto.getRandomValues(new Uint8Array(new ArrayBuffer(n)));

export async function keyFromPassword(password: string, salt: Uint8Array<ArrayBuffer>, iterations = PBKDF2_ITERATIONS): Promise<CryptoKey> {
  const base = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}

export async function keyFromSecret(secret: ArrayBuffer, info: string): Promise<CryptoKey> {
  const base = await crypto.subtle.importKey("raw", secret, "HKDF", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "HKDF", hash: "SHA-256", salt: new Uint8Array(32), info: enc.encode(info) }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}

export async function importDataKey(raw: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

export async function encryptBytes(key: CryptoKey, data: Uint8Array<ArrayBuffer>): Promise<EncBlob> {
  const iv = randomBytes(12);
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data);
  return { iv: toB64(iv), ct: toB64(ct) };
}

export async function decryptBytes(key: CryptoKey, blob: EncBlob): Promise<Uint8Array<ArrayBuffer>> {
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromB64(blob.iv) }, key, fromB64(blob.ct));
  return new Uint8Array(pt);
}

export const encryptJSON = (key: CryptoKey, obj: unknown) => encryptBytes(key, enc.encode(JSON.stringify(obj)) as Uint8Array<ArrayBuffer>);
export const decryptJSON = async <T,>(key: CryptoKey, blob: EncBlob): Promise<T> => JSON.parse(dec.decode(await decryptBytes(key, blob))) as T;
