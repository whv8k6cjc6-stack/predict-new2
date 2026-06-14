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
export function importAll(json: string): boolean {
  try {
    const d = JSON.parse(json);
    if (d.profiles) saveProfiles(d.profiles);
    if (d.history) saveHistory(d.history);
    if (d.settings) saveSettings(d.settings);
    if (d.strategies) saveStrategies(d.strategies);
    if (d.quantlog) saveQuantLog(d.quantlog);
    return true;
  } catch { return false; }
}
export const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
