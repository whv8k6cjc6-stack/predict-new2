"use client";
import type { Profile } from "@/types/profile";
import type { HistoryRecord } from "@/types/fortune";

const K = { profiles: "dd:profiles", history: "dd:history", settings: "dd:settings", strategies: "dd:strategies", quantlog: "dd:quantlog" };

export interface Settings {
  aiEnabled: boolean;
  weights?: Record<string, { bazi: number; ziwei: number; qimen: number }>;
}

export interface QuantLogEntry {
  id: string;
  date: string;          // 交易日 YYYY-MM-DD
  strategy: string;
  action: "依規則執行" | "手動干預" | "錯過未跟" | "暫停觀望";
  scenario?: string;     // 觸發情境（MDD/FOMO/跟訊號…）
  disciplineRisk: number;
  note: string;
  loggedAt: string;
}

const read = <T,>(k: string, def: T): T => {
  if (typeof window === "undefined") return def;
  try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : def; } catch { return def; }
};
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

export const getProfiles = () => read<Profile[]>(K.profiles, []);
export const saveProfiles = (p: Profile[]) => write(K.profiles, p);
export const getHistory = () => read<HistoryRecord[]>(K.history, []);
export const saveHistory = (h: HistoryRecord[]) => write(K.history, h.slice(0, 300));
export const getSettings = () => read<Settings>(K.settings, { aiEnabled: false });
export const saveSettings = (s: Settings) => write(K.settings, s);

export const getStrategies = () => read<string[]>(K.strategies, ["00981A 量化策略", "大盤策略"]);
export const saveStrategies = (s: string[]) => write(K.strategies, s);
export const getQuantLog = () => read<QuantLogEntry[]>(K.quantlog, []);
export const saveQuantLog = (l: QuantLogEntry[]) => write(K.quantlog, l.slice(0, 500));

export function exportAll(): string {
  return JSON.stringify({ exportedAt: new Date().toISOString(), profiles: getProfiles(), history: getHistory(), settings: getSettings(), strategies: getStrategies(), quantlog: getQuantLog() }, null, 2);
}
const ACCURACIES = ["exact", "approximate", "unknown"];
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const isValidProfile = (p: unknown): boolean =>
  isObj(p) && typeof p.id === "string" && typeof p.birthDate === "string" &&
  ACCURACIES.includes(p.birthTimeAccuracy as string) &&
  isObj(p.birthPlace) && typeof p.birthPlace.longitude === "number";

/** 匯入前逐鍵驗證結構；任何一鍵格式不符即整批拒絕，避免壞備份蓋掉好資料。 */
export function importAll(json: string): boolean {
  try {
    const d = JSON.parse(json);
    if (!isObj(d)) return false;
    if (d.profiles !== undefined && !(Array.isArray(d.profiles) && d.profiles.every(isValidProfile))) return false;
    if (d.history !== undefined && !(Array.isArray(d.history) && d.history.every(isObj))) return false;
    if (d.settings !== undefined && !isObj(d.settings)) return false;
    if (d.strategies !== undefined && !(Array.isArray(d.strategies) && d.strategies.every(s => typeof s === "string"))) return false;
    if (d.quantlog !== undefined && !(Array.isArray(d.quantlog) && d.quantlog.every(isObj))) return false;
    if (d.profiles) saveProfiles(d.profiles as Profile[]);
    if (d.history) saveHistory(d.history as unknown as HistoryRecord[]);
    if (d.settings) saveSettings(d.settings as unknown as Settings);
    if (d.strategies) saveStrategies(d.strategies as string[]);
    if (d.quantlog) saveQuantLog(d.quantlog as unknown as QuantLogEntry[]);
    return true;
  } catch { return false; }
}
export function clearAll() { Object.values(K).forEach(k => { try { localStorage.removeItem(k); } catch {} }); }
export const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
