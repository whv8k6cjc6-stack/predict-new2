"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getSettings, saveSettings, exportAll, importAll, type Settings } from "@/lib/storage/store";

export default function SettingsPage() {
  const [s, setS] = useState<Settings>({ aiEnabled: false });
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  useEffect(() => setS(getSettings()), []);

  const upd = (patch: Partial<Settings>) => { const n = { ...s, ...patch }; setS(n); saveSettings(n); };

  const doExport = () => {
    const blob = new Blob([exportAll()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `destiny-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click(); URL.revokeObjectURL(a.href);
    setMsg("已匯出備份檔。");
  };
  const doImport = async (f: File) => {
    const ok = importAll(await f.text());
    setMsg(ok ? "匯入成功，請回首頁重新整理。" : "匯入失敗，檔案格式不符。");
  };
  const clearAll = () => {
    if (!confirm("確定清除此裝置上的所有命盤、紀錄與設定？此動作無法復原。")) return;
    ["dd:profiles", "dd:history", "dd:settings"].forEach(k => localStorage.removeItem(k));
    setMsg("已清除全部資料。");
  };

  return (
    <main className="mx-auto max-w-md px-5 pb-16 pt-10">
      <Link href="/" className="text-sm text-[var(--ink-dim)]">← 返回</Link>
      <h1 className="mt-3 text-2xl font-semibold">設定</h1>

      <div className="mt-4 rounded-xl border border-white/10 bg-[var(--panel)] p-4">
        <label className="flex items-center justify-between text-sm">
          <span>AI 白話解讀（需於 Vercel 設定 ANTHROPIC_API_KEY）</span>
          <input type="checkbox" checked={s.aiEnabled} onChange={e => upd({ aiEnabled: e.target.checked })} />
        </label>
        <p className="mt-2 text-[11px] text-[var(--ink-dim)]">未設定金鑰時，查詢頁會自動使用本機模板解釋，不影響功能。</p>
      </div>

      <div className="mt-3 rounded-xl border border-white/10 bg-[var(--panel)] p-4">
        <p className="text-sm">資料備份</p>
        <div className="mt-3 flex gap-2">
          <button onClick={doExport} className="rounded-lg bg-[var(--gold)] px-4 py-2 text-sm font-medium text-black">匯出 JSON</button>
          <button onClick={() => fileRef.current?.click()} className="rounded-lg border border-white/20 px-4 py-2 text-sm">匯入 JSON</button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden"
            onChange={e => e.target.files?.[0] && doImport(e.target.files[0])} />
        </div>
        <p className="mt-2 text-[11px] text-[var(--ink-dim)]">所有資料僅存於此裝置瀏覽器，換機或清快取前請先匯出。</p>
      </div>

      <div className="mt-3 rounded-xl border border-[var(--vermilion)]/40 bg-[var(--panel)] p-4">
        <button onClick={clearAll} className="text-sm text-[var(--vermilion)]">清除全部資料</button>
      </div>

      {msg && <p className="mt-4 text-sm text-[var(--jade)]">{msg}</p>}
      <p className="mt-8 text-[11px] leading-relaxed text-[var(--ink-dim)]">
        玄機決策 v1.0・三式規則引擎（八字／紫微／奇門）・AI 僅負責白話轉譯，不直接推算。
        本系統輸出僅供個人參考，不構成投資或重大決策建議。
      </p>
    </main>
  );
}
