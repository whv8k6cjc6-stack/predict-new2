"use client";
/** 畫面用的分析 hook：本命快取＋延後計算（先畫出頁面，再在下一個事件迴圈計算），結果以 LRU 快取。 */
import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/app/providers";
import { buildNatal, type NatalSet } from "@/core/analysis";
import type { PersonBundle } from "@/core/person";
import { resolveCalculation } from "@/core/calculation";

export { resolveCalculation };

export function deviceTimeZone(): string {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Taipei"; } catch { return "Asia/Taipei"; }
}
export function todayIn(tz: string, d = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}
export const addDays = (date: string, k: number) => { const d = new Date(`${date}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + k); return d.toISOString().slice(0, 10); };
export const dateTitle = (date: string) => { const [y, m, d] = date.split("-").map(Number); return `${y}年${m}月${d}日`; };
const WEEK = ["日", "一", "二", "三", "四", "五", "六"];
export const weekday = (date: string) => `週${WEEK[new Date(`${date}T00:00:00Z`).getUTCDay()]}`;

const natalCache = new Map<string, NatalSet>();

/** timeBasisOverride：暫時以標準時間或真太陽時檢視（不修改人物設定） */
export function useNatal(bundle: PersonBundle | null | undefined, timeBasisOverride?: "standard" | "trueSolar"): { natal: NatalSet | null; key: string | null } {
  const { settingsList, ziweiProfiles } = useApp();
  const calc = useMemo(() => bundle ? resolveCalculation(bundle.birth, settingsList, ziweiProfiles) : null, [bundle, settingsList, ziweiProfiles]);
  const tst = timeBasisOverride ? timeBasisOverride === "trueSolar" : bundle?.birth.useTrueSolarTime;
  const key = bundle && calc ? `${bundle.person.id}|${bundle.person.gender}|${bundle.birth.updatedAt}|${calc.settings.id}|${calc.settings.updatedAt}|${calc.ziweiProfile?.id ?? "unresolved"}|tst:${tst}` : null;
  const natal = useMemo(() => {
    if (!bundle || !calc || !key) return null;
    const hit = natalCache.get(key);
    if (hit) return hit;
    const n = buildNatal({ person: bundle.person, birth: { ...bundle.birth, useTrueSolarTime: !!tst }, ...calc });
    natalCache.set(key, n);
    return n;
  }, [bundle, calc, key, tst]);
  return { natal, key };
}

const resultCache = new Map<string, unknown>();
const MAX = 60;

/** 延後計算：key 改變時先回傳快取（若有），否則在下一輪事件迴圈計算 */
export function useComputed<T>(key: string | null, fn: () => T): { data: T | null; busy: boolean; error: string | null } {
  const cached = key ? (resultCache.get(key) as T | undefined) : undefined;
  const [state, setState] = useState<{ key: string | null; data: T | null; error: string | null }>({ key: cached !== undefined ? key : null, data: cached ?? null, error: null });
  useEffect(() => {
    if (!key) return;
    const hit = resultCache.get(key) as T | undefined;
    if (hit !== undefined) { setState({ key, data: hit, error: null }); return; }
    let alive = true;
    const t = setTimeout(() => {
      try {
        const v = fn();
        resultCache.set(key, v);
        if (resultCache.size > MAX) resultCache.delete(resultCache.keys().next().value!);
        if (alive) setState({ key, data: v, error: null });
      } catch (e) {
        if (alive) setState({ key, data: null, error: e instanceof Error ? e.message : String(e) });
      }
    }, 0);
    return () => { alive = false; clearTimeout(t); };
    // fn 由 key 決定
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const fresh = state.key === key;
  return { data: fresh ? state.data : cached ?? null, busy: !!key && !fresh && cached === undefined, error: fresh ? state.error : null };
}
