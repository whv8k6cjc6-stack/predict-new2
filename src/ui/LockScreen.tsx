"use client";
import { useEffect, useState } from "react";
import { getSecurityConfig, unlockWithPasskey, unlockWithPin } from "@/data/vault";
import { wipeAll } from "@/data/repo";
import { Button, Confirm, Icon } from "./primitives";

export function LockScreen({ onUnlocked }: { onUnlocked: () => Promise<void> }) {
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [reset, setReset] = useState(false);
  const hasPasskey = !!getSecurityConfig().passkey;

  const run = async (fn: () => Promise<void>) => {
    setBusy(true); setErr("");
    try { await fn(); await onUnlocked(); }
    catch (e) { setErr(e instanceof Error ? e.message : "解鎖失敗"); setPin(""); }
    finally { setBusy(false); }
  };

  useEffect(() => { if (hasPasskey) run(unlockWithPasskey); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col items-center justify-center px-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-2)] text-[var(--accent)]"><Icon name="lock" size={26} /></span>
      <h1 className="font-serif mt-4 text-[24px] font-semibold">玄機決策已鎖定</h1>
      <p className="mt-1 text-[13px] text-[var(--ink-3)]">人物與命盤資料已加密，解鎖後才能讀取。</p>
      <form className="mt-6 w-full" onSubmit={e => { e.preventDefault(); if (pin) run(() => unlockWithPin(pin)); }}>
        <input type="password" inputMode="numeric" autoComplete="current-password" autoFocus={!hasPasskey}
          value={pin} onChange={e => setPin(e.target.value)} placeholder="輸入 PIN 或密碼" aria-label="PIN 或密碼"
          className="input text-center text-[20px] tracking-[0.3em]" />
        {err && <p className="mt-2 text-[13px] text-[var(--danger)]" role="alert">{err}</p>}
        <Button type="submit" variant="primary" block className="mt-3" disabled={busy || !pin}>{busy ? "解鎖中…" : "解鎖"}</Button>
      </form>
      {hasPasskey && (
        <Button className="mt-3" block onClick={() => run(unlockWithPasskey)} disabled={busy}>
          <Icon name="face" /> 使用 Face ID／Touch ID
        </Button>
      )}
      <button onClick={() => setReset(true)} className="mt-8 text-[12px] text-[var(--ink-3)] underline underline-offset-4">忘記 PIN？</button>
      <Confirm open={reset} onClose={() => setReset(false)} danger title="清除本機資料" confirmText="清除全部資料"
        message={<>PIN 無法找回，加密資料也無法破解。唯一的方法是<strong>清除此裝置上的所有資料</strong>，再到「設定 → 備份與還原」匯入先前的備份檔。此動作無法復原。</>}
        onConfirm={async () => { await wipeAll(); location.reload(); }} />
    </main>
  );
}
