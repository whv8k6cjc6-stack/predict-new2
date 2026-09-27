"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { db } from "@/data/db";
import { ensureSeed, getPrefs, listBundles, listSettings, listTags, listZiweiProfiles, migrateBirthProfilesV2, setPrefs, touchPerson } from "@/data/repo";
import { migrateLegacy } from "@/data/legacy";
import { getSecurityConfig, installAutoLock, isLocked, loadSecurity, subscribeVault, type SecurityConfig } from "@/data/vault";
import { DEFAULT_PREFS, type CalculationSettings, type PersonBundle, type Preferences, type Tag } from "@/core/person";
import type { CustomZiweiProfileRecord } from "@/core/ziwei/profile";
import { LockScreen } from "@/ui/LockScreen";

type Status = "loading" | "locked" | "ready" | "error";

interface AppCtx {
  status: Status;
  error: string | null;
  persons: PersonBundle[];
  tags: Tag[];
  settingsList: CalculationSettings[];
  ziweiProfiles: CustomZiweiProfileRecord[];
  prefs: Preferences;
  security: SecurityConfig;
  active: PersonBundle | null;
  refresh: () => Promise<void>;
  setActive: (id: string) => Promise<void>;
  updatePrefs: (p: Partial<Preferences>) => Promise<void>;
}

const Ctx = createContext<AppCtx | null>(null);
export const useApp = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp 必須在 AppProvider 內使用");
  return c;
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [persons, setPersons] = useState<PersonBundle[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [settingsList, setSettingsList] = useState<CalculationSettings[]>([]);
  const [ziweiProfiles, setZiweiProfiles] = useState<CustomZiweiProfileRecord[]>([]);
  const [prefs, setPrefsState] = useState<Preferences>(DEFAULT_PREFS);
  const [security, setSecurity] = useState<SecurityConfig>(getSecurityConfig());

  const refresh = useCallback(async () => {
    const [p, t, s, z, pr] = await Promise.all([listBundles(), listTags(), listSettings(), listZiweiProfiles(), getPrefs()]);
    setPersons(p); setTags(t); setSettingsList(s); setZiweiProfiles(z); setPrefsState(pr);
  }, []);

  const afterUnlock = useCallback(async () => {
    await migrateLegacy();
    await migrateBirthProfilesV2();
    await refresh();
    setStatus("ready");
  }, [refresh]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        await db().open();
        await loadSecurity();
        await ensureSeed();
        if (!alive) return;
        if (isLocked()) setStatus("locked");
        else await afterUnlock();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
        setStatus("error");
      }
    })();
    const unsub = subscribeVault(() => {
      setSecurity(getSecurityConfig());
      if (isLocked()) { setPersons([]); setTags([]); setStatus("locked"); }
    });
    const unAuto = installAutoLock();
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register(`/sw.js?v=${process.env.NEXT_PUBLIC_BUILD_ID}`).catch(() => { /* 離線快取失敗不影響使用 */ });
    }
    return () => { alive = false; unsub(); unAuto(); };
  }, [afterUnlock]);

  const setActive = useCallback(async (id: string) => {
    await setPrefs({ activePersonId: id });
    await touchPerson(id);
    await refresh();
  }, [refresh]);

  const updatePrefs = useCallback(async (p: Partial<Preferences>) => {
    await setPrefs(p);
    setPrefsState(prev => ({ ...prev, ...p }));
  }, []);

  const active = useMemo(() => {
    if (!persons.length) return null;
    return persons.find(b => b.person.id === prefs.activePersonId)
      ?? persons.find(b => b.person.relation === "self")
      ?? persons[0];
  }, [persons, prefs.activePersonId]);

  const value: AppCtx = { status, error, persons, tags, settingsList, ziweiProfiles, prefs, security, active, refresh, setActive, updatePrefs };

  return (
    <Ctx.Provider value={value}>
      {status === "loading" && <Splash />}
      {status === "error" && <StorageError message={error} />}
      {status === "locked" && <LockScreen onUnlocked={afterUnlock} />}
      {status === "ready" && children}
    </Ctx.Provider>
  );
}

function Splash() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <p className="font-serif text-[20px] tracking-[0.3em] text-[var(--ink-3)]">玄機決策</p>
    </div>
  );
}

function StorageError({ message }: { message: string | null }) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6">
      <p className="font-serif text-[22px] font-semibold">無法開啟本機資料庫</p>
      <p className="mt-2 text-[14px] leading-relaxed text-[var(--ink-2)]">
        可能是瀏覽器處於「私密瀏覽」模式，或已封鎖網站資料儲存。請改用一般模式開啟，或在瀏覽器設定中允許此網站儲存資料。
      </p>
      {message && <p className="mt-3 text-[12px] text-[var(--ink-3)]">技術訊息：{message}</p>}
    </div>
  );
}
