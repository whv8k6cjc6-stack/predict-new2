"use client";
import { useState } from "react";
import { exportAndDeliver } from "@/data/backup";
import { Button, Field, Sheet, Toggle } from "./primitives";

/** 匯出（整批或指定人物）。預設加密，密碼由使用者輸入、不儲存。 */
export function ExportSheet({ open, onClose, personIds, title, onDone }: { open: boolean; onClose: () => void; personIds?: string[]; title: string; onDone?: () => void }) {
  const [encrypt, setEncrypt] = useState(true);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const run = async () => {
    setMsg("");
    if (encrypt && pw.length < 8) { setMsg("備份密碼至少 8 個字元"); return; }
    if (encrypt && pw !== pw2) { setMsg("兩次輸入的密碼不一致"); return; }
    setBusy(true);
    try {
      const f = await exportAndDeliver({ personIds, password: encrypt ? pw : undefined });
      setMsg(`已匯出 ${f.person_count} 位人物。`);
      setPw(""); setPw2(""); onDone?.();
    } catch (e) {
      if ((e as Error).name !== "AbortError") setMsg(`匯出失敗：${(e as Error).message}`);
    } finally { setBusy(false); }
  };

  return (
    <Sheet open={open} onClose={onClose} title={title}>
      <div className="space-y-4">
        <Toggle checked={encrypt} onChange={setEncrypt} label="加密備份檔（建議）" desc="沒有密碼的人無法讀取檔案內容。密碼遺失將無法還原。" />
        {encrypt && (
          <>
            <Field label="備份密碼（至少 8 字元）"><input type="password" className="input" autoComplete="new-password" value={pw} onChange={e => setPw(e.target.value)} /></Field>
            <Field label="再輸入一次"><input type="password" className="input" autoComplete="new-password" value={pw2} onChange={e => setPw2(e.target.value)} /></Field>
          </>
        )}
        {!encrypt && <p className="text-[13px] leading-relaxed text-[var(--danger)]">未加密的備份檔包含姓名與出生年月日時，請妥善保管，勿傳到公開地方。</p>}
        <p className="text-[12px] leading-relaxed text-[var(--ink-3)]">iPhone／iPad 會開啟分享選單，請選「儲存到檔案」；電腦會直接下載 JSON 檔。檔案內含 schema_version，未來版本仍可匯入。</p>
        {msg && <p className="text-[13px] text-[var(--accent)]" role="status">{msg}</p>}
        <Button variant="primary" block onClick={run} disabled={busy}>{busy ? "處理中…" : "匯出備份檔"}</Button>
      </div>
    </Sheet>
  );
}
