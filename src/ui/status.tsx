"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useApp } from "@/app/providers";
import { Banner, Button } from "./primitives";

export function useOnline() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const f = () => setOn(navigator.onLine); f();
    window.addEventListener("online", f); window.addEventListener("offline", f);
    return () => { window.removeEventListener("online", f); window.removeEventListener("offline", f); };
  }, []);
  return on;
}

export function BackupReminder() {
  const { persons, prefs } = useApp();
  if (!persons.length) return null;
  const last = prefs.lastBackupAt ? new Date(prefs.lastBackupAt) : null;
  const days = last ? Math.floor((Date.now() - last.getTime()) / 86_400_000) : null;
  if (days !== null && days < prefs.backupReminderDays) return null;
  return (
    <Banner tone="warn" title={days === null ? "你還沒有備份過人物資料" : `已經 ${days} 天沒有備份`}
      action={<Link href="/settings/#backup"><Button size="sm" variant="primary">立即備份</Button></Link>}>
      資料只存在這台裝置。清除瀏覽器資料、換手機或瀏覽器異常時，沒有備份檔就無法找回。
    </Banner>
  );
}

