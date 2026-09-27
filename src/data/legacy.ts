/** 舊版（v1／v2，localStorage）資料自動遷移。非破壞性：原始 localStorage 不刪除，另存完整快照於 legacy 表。 */
import { db } from "./db";
import { newId, nowISO, saveBundle, getPrefs, setPrefs, saveSettings, addZiweiProfile } from "./repo";
import { encryptJSON } from "./crypto";
import { activeKey, isLocked } from "./vault";
import { DEFAULT_SETTINGS_ID, defaultSettings, type BirthProfile, type Person } from "@/core/person";
import { legacyProfileFromV1 } from "@/core/ziwei/profile";

const EARLY_ZI_SETTINGS_ID = "school-early-zi";

import { LEGACY_LOCALSTORAGE_KEYS as LEGACY_KEYS } from "./repo";

interface LegacyProfile {
  id?: string; name?: string; gender?: "male" | "female";
  birthDate?: string; birthTime?: string | null; birthTimeAccuracy?: "exact" | "approximate" | "unknown";
  birthPlace?: { city?: string; timezone?: string; longitude?: number; latitude?: number; country?: string };
  useTrueSolarTime?: boolean; ziRule?: "lateZi" | "earlyZi"; notes?: string;
}

export async function migrateLegacy(): Promise<number> {
  const d = db();
  if (isLocked()) throw new Error("App 已鎖定，請先解鎖");
  if (await d.meta.get("legacyMigrated")) return 0;
  const snapshot: Record<string, unknown> = {};
  for (const k of LEGACY_KEYS) {
    const v = localStorage.getItem(k);
    if (v !== null) { try { snapshot[k] = JSON.parse(v); } catch { snapshot[k] = v; } }
  }
  let created = 0;
  if (Object.keys(snapshot).length) {
    const k = activeKey();
    await d.legacy.put(k ? { key: "localStorage-v2", enc: await encryptJSON(k, snapshot) } : { key: "localStorage-v2", data: snapshot });
    const profiles = (Array.isArray(snapshot["dd:profiles"]) ? snapshot["dd:profiles"] : []) as LegacyProfile[];
    let order = 0;
    if (profiles.some(p => p.ziRule === "earlyZi")) {
      // 舊版「早子時」同時作用於八字與紫微：八字設子初換日，紫微以 legacy Profile（日界 23:00）保留相同結果
      const t = nowISO();
      const base = defaultSettings(t);
      const { id: profileId, record } = legacyProfileFromV1({ baziZiHour: "earlyZiNextDay" }, t);
      if (record) await addZiweiProfile(record);
      await saveSettings({ ...base, id: EARLY_ZI_SETTINGS_ID, name: "早子時換日（由舊版設定匯入）", isDefault: false, origin: "migrated-v1", bazi: { ...base.bazi, ziHour: "earlyZiNextDay" }, ziwei: { ruleProfileId: profileId } });
    }
    for (const lp of profiles) {
      if (!lp.birthDate || !/^\d{4}-\d{2}-\d{2}$/.test(lp.birthDate)) continue;
      const t = nowISO(); const id = newId();
      const person: Person = {
        id, displayName: lp.name || "未命名", gender: lp.gender ?? "male", relation: order === 0 ? "self" : "other",
        isFavorite: order === 0, sortOrder: order, note: [lp.notes, "（由舊版資料自動匯入）"].filter(Boolean).join(" "),
        createdAt: t, updatedAt: t,
      };
      const time = lp.birthTime && /^\d{2}:\d{2}/.test(lp.birthTime) ? lp.birthTime.slice(0, 5) : null;
      const birth: BirthProfile = {
        personId: id, localDate: lp.birthDate, localTime: time,
        timeAccuracy: !time ? "unknown" : lp.birthTimeAccuracy === "exact" ? "exact" : lp.birthTimeAccuracy === "approximate" ? "approx60" : "unknown",
        inputCalendar: "solar",
        place: { name: lp.birthPlace?.city ?? "", countryCode: "TW", lat: lp.birthPlace?.latitude ?? 23.0, lng: lp.birthPlace?.longitude ?? 120.2 },
        timeZone: lp.birthPlace?.timezone || "Asia/Taipei", dstOverride: "auto",
        useTrueSolarTime: lp.useTrueSolarTime ?? true, // 舊版人物：保留舊版行為（舊版預設採真太陽時）
        timeBasis: "civilStandard", calculationSettingsId: lp.ziRule === "earlyZi" ? EARLY_ZI_SETTINGS_ID : DEFAULT_SETTINGS_ID,
        createdAt: t, updatedAt: t,
      };
      await saveBundle({ person, birth, tagIds: [] });
      if (order === 0 && !(await getPrefs()).activePersonId) await setPrefs({ activePersonId: id });
      order++; created++;
    }
  }
  await d.meta.put({ key: "legacyMigrated", value: { at: nowISO(), created } });
  return created;
}
