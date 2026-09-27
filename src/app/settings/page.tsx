"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../providers";
import { APP_VERSION, BACKUP_SCHEMA_VERSION, SCHEMA_VERSION } from "@/core/versioning";
import { ENGINES, STATUS_LABEL } from "@/core/registry";
import type { SchoolProfile } from "@/core/person";
import { reencryptAll, saveSchool, storageStatus, wipeAll } from "@/data/repo";
import {
  changePin, disableLock, enableLock, lock, passkeyAvailable, registerPasskey, removePasskey, setAutoLockMinutes,
} from "@/data/vault";
import { BackupError, openBackup, parseBackup, restoreBackup, type BackupFile } from "@/data/backup";
import type { PlainDump } from "@/data/repo";
import { Banner, Button, Confirm, Field, Icon, PageHeader, SectionTitle, Sheet } from "@/ui/primitives";
import { ModeToggle } from "@/ui/interpret";
import { ExportSheet } from "@/ui/ExportSheet";
import { BandLegend } from "@/ui/score";

export default function SettingsPage() {
  const { security, prefs, persons, schools, refresh } = useApp();
  const [exp, setExp] = useState(false);
  const [pinSheet, setPinSheet] = useState<null | "enable" | "change" | "disable" | "passkey">(null);
  const [pk, setPk] = useState(false);
  const [store, setStore] = useState<{ persisted: boolean; usage: number | null } | null>(null);
  const [wipe, setWipe] = useState(false);
  const [legend, setLegend] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => { passkeyAvailable().then(setPk); storageStatus().then(setStore); }, []);

  const standalone = typeof window !== "undefined" && (window.matchMedia?.("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone);

  return (
    <main className="safe-top mx-auto max-w-lg px-4">
      <PageHeader title="設定" subtitle="所有設定與資料只存在這台裝置" />
      {note && <Banner tone="info" title={note} />}

      <SectionTitle>顯示</SectionTitle>
      <div className="card flex items-center justify-between p-4">
        <div><p className="text-[15px]">顯示模式</p><p className="text-[12px] text-[var(--ink-3)]">白話：先看結論與建議；專業：展開完整命理分析</p></div>
        <ModeToggle />
      </div>
      <button onClick={() => setLegend(true)} className="card mt-2 flex w-full items-center justify-between p-4 text-left">
        <span className="text-[15px]">分數區間定義</span><Icon name="chevron" size={16} className="text-[var(--ink-3)]" />
      </button>

      <SectionTitle>安全與隱私</SectionTitle>
      <div className="card divide-y divide-[var(--line)]">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[15px]">App 鎖與本機加密</p>
              <p className="text-[12px] text-[var(--ink-3)]">{security.lockEnabled ? "已啟用：人物與命盤資料以 AES-256 加密儲存" : "未啟用：資料以瀏覽器沙盒保護，未加密"}</p>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-[11px] ${security.lockEnabled ? "bg-[var(--sig-pos)]/20 text-[var(--sig-pos)]" : "bg-[var(--surface-2)] text-[var(--ink-3)]"}`}>{security.lockEnabled ? "已啟用" : "未啟用"}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {!security.lockEnabled && <Button size="sm" variant="primary" onClick={() => setPinSheet("enable")}><Icon name="lock" size={15} />設定 PIN 並啟用</Button>}
            {security.lockEnabled && <>
              <Button size="sm" onClick={() => lock()}>立即鎖定</Button>
              <Button size="sm" onClick={() => setPinSheet("change")}>變更 PIN</Button>
              <Button size="sm" variant="danger" onClick={() => setPinSheet("disable")}>停用</Button>
            </>}
          </div>
        </div>
        {security.lockEnabled && (
          <>
            <div className="p-4">
              <p className="text-[15px]">Face ID／Touch ID／Windows Hello</p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-[var(--ink-3)]">
                使用 Passkey（WebAuthn）解鎖。這與原生 App 的 Face ID 技術不同：需要瀏覽器支援 PRF 功能才能用生物辨識解密資料；不支援時請繼續使用 PIN。
              </p>
              <div className="mt-3">
                {security.passkey ? (
                  <Button size="sm" variant="danger" onClick={async () => { await removePasskey(); setNote("已停用生物辨識解鎖"); }}>停用生物辨識</Button>
                ) : pk ? (
                  <Button size="sm" onClick={() => setPinSheet("passkey")}><Icon name="face" size={15} />啟用</Button>
                ) : <p className="text-[12px] text-[var(--ink-3)]">此裝置或瀏覽器沒有可用的生物辨識驗證器。</p>}
              </div>
            </div>
            <div className="flex items-center justify-between p-4">
              <p className="text-[15px]">離開 App 後自動鎖定</p>
              <select className="input w-auto" value={security.autoLockMinutes} onChange={e => setAutoLockMinutes(Number(e.target.value))}>
                {[1, 5, 15, 60].map(m => <option key={m} value={m}>{m} 分鐘</option>)}
              </select>
            </div>
          </>
        )}
        <div className="p-4 text-[12px] leading-relaxed text-[var(--ink-3)]">
          本 App 不連線任何伺服器、不使用任何生成式 AI、不含廣告或追蹤程式。人物資料不會自動上傳或同步到雲端。
        </div>
      </div>

      <SectionTitle>備份與還原</SectionTitle>
      <div id="backup" className="card divide-y divide-[var(--line)]">
        <div className="p-4">
          <p className="text-[15px]">整批備份</p>
          <p className="text-[12px] text-[var(--ink-3)]">
            {persons.length} 位人物・上次備份：{prefs.lastBackupAt ? new Date(prefs.lastBackupAt).toLocaleString("zh-TW") : "從未備份"}
          </p>
          <Button className="mt-3" size="sm" variant="primary" onClick={() => setExp(true)}><Icon name="download" size={15} />匯出全部</Button>
        </div>
        <ImportBlock onDone={async n => { await refresh(); setNote(n); }} />
        <div className="p-4 text-[12px] leading-relaxed text-[var(--ink-3)]">
          <p>儲存保護：{store ? (store.persisted ? "已取得瀏覽器「持久儲存」權限，系統不會主動清除" : "尚未取得持久儲存權限（瀏覽器空間不足時可能被清除）") : "檢查中…"}{store?.usage != null && `・已使用 ${(store.usage / 1024).toFixed(0)} KB`}</p>
          {!standalone && <p className="mt-1">iPhone／iPad 建議用 Safari「分享 → 加入主畫面」後再使用；以一般網頁開啟時，Safari 可能在長期未使用後清除網站資料。</p>}
          <p className="mt-1">定期匯出備份檔到「檔案」或電腦，是唯一能在換機、重設瀏覽器後找回資料的方式。</p>
        </div>
      </div>

      <SectionTitle>流派與排盤規則</SectionTitle>
      <div className="space-y-2">{schools.map(s => <SchoolEditor key={s.id} s={s} onSaved={refresh} />)}</div>

      <SectionTitle>關於</SectionTitle>
      <div className="card p-4 text-[13px]">
        <dl className="grid grid-cols-[8rem_1fr] gap-y-1">
          <dt className="text-[var(--ink-3)]">App 版本</dt><dd className="num">{APP_VERSION}</dd>
          <dt className="text-[var(--ink-3)]">資料庫結構版本</dt><dd className="num">{SCHEMA_VERSION}</dd>
          <dt className="text-[var(--ink-3)]">備份格式版本</dt><dd className="num">{BACKUP_SCHEMA_VERSION}</dd>
        </dl>
        <ul className="mt-3 space-y-1.5">
          {ENGINES.map(e => (
            <li key={e.id} className="flex justify-between gap-2 text-[12px]">
              <span>P{e.phase} {e.name}<span className="text-[var(--ink-3)]">・{e.stamp.school}</span></span>
              <span className="num text-[var(--ink-3)]">{STATUS_LABEL[e.status]}・engine {e.stamp.engine_version}／rule {e.stamp.rule_version}／source {e.stamp.source_version}</span>
            </li>
          ))}
        </ul>
        <Link href="/demo/" className="mt-3 inline-block text-[var(--demo)]">DEMO 版面（測試資料）→</Link>
      </div>

      <SectionTitle>危險操作</SectionTitle>
      <Button variant="danger" block onClick={() => setWipe(true)}><Icon name="trash" size={16} />清除此裝置上的所有資料</Button>

      <PinSheet mode={pinSheet} onClose={() => setPinSheet(null)} onDone={m => { setPinSheet(null); setNote(m); refresh(); }} />
      <ExportSheet open={exp} onClose={() => setExp(false)} title="匯出全部人物" onDone={refresh} />
      <Confirm open={wipe} onClose={() => setWipe(false)} danger title="清除所有資料" confirmText="全部清除"
        message="將刪除所有人物、出生資料、標籤、設定與安全設定。建議先匯出備份。此動作無法復原。"
        onConfirm={async () => { await wipeAll(); location.href = "/"; }} />
      <Sheet open={legend} onClose={() => setLegend(false)} title="分數區間定義"><BandLegend /></Sheet>
    </main>
  );
}

function PinSheet({ mode, onClose, onDone }: { mode: null | "enable" | "change" | "disable" | "passkey"; onClose: () => void; onDone: (msg: string) => void }) {
  const [a, setA] = useState(""); const [b, setB] = useState(""); const [c, setC] = useState("");
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  useEffect(() => { setA(""); setB(""); setC(""); setErr(""); }, [mode]);
  if (!mode) return null;
  const titles = { enable: "設定 PIN 並啟用 App 鎖", change: "變更 PIN", disable: "停用 App 鎖", passkey: "啟用生物辨識解鎖" };
  const submit = async () => {
    setErr(""); setBusy(true);
    try {
      if (mode === "enable") { if (a !== b) throw new Error("兩次輸入不一致"); await enableLock(a, reencryptAll); onDone("App 鎖已啟用，資料已加密。請記住 PIN，遺失將無法解密。"); }
      if (mode === "change") { if (b !== c) throw new Error("兩次輸入不一致"); await changePin(a, b); onDone("PIN 已變更"); }
      if (mode === "disable") { await disableLock(a, reencryptAll); onDone("App 鎖已停用，資料恢復為未加密儲存"); }
      if (mode === "passkey") { await registerPasskey(a); onDone("已啟用生物辨識解鎖"); }
    } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  };
  const pinInput = (v: string, set: (s: string) => void, label: string) => (
    <Field label={label}><input type="password" inputMode="numeric" autoComplete="off" className="input text-center tracking-[0.3em]" value={v} onChange={e => set(e.target.value)} /></Field>
  );
  return (
    <Sheet open onClose={onClose} title={titles[mode]}>
      <div className="space-y-3">
        {mode === "enable" && <p className="text-[13px] leading-relaxed text-[var(--ink-2)]">請設定至少 6 位數字（或 8 字元以上的密碼）。<strong>PIN 無法找回</strong>，遺失只能從備份檔還原。</p>}
        {mode === "enable" && <>{pinInput(a, setA, "新 PIN")}{pinInput(b, setB, "再輸入一次")}</>}
        {mode === "change" && <>{pinInput(a, setA, "目前 PIN")}{pinInput(b, setB, "新 PIN")}{pinInput(c, setC, "再輸入一次新 PIN")}</>}
        {(mode === "disable" || mode === "passkey") && pinInput(a, setA, "目前 PIN")}
        {err && <p className="text-[13px] text-[var(--danger)]" role="alert">{err}</p>}
        <Button variant="primary" block onClick={submit} disabled={busy || !a}>{busy ? "處理中…（加密運算需要數秒）" : "確定"}</Button>
      </div>
    </Sheet>
  );
}

function ImportBlock({ onDone }: { onDone: (msg: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<BackupFile | null>(null);
  const [dump, setDump] = useState<PlainDump | null>(null);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [mode, setMode] = useState<"merge" | "replace">("merge");
  const [busy, setBusy] = useState(false);

  const reset = () => { setFile(null); setDump(null); setPw(""); setErr(""); if (input.current) input.current.value = ""; };
  const onPick = async (f: File | undefined) => {
    if (!f) return;
    setErr("");
    try {
      const bf = parseBackup(await f.text());
      setFile(bf);
      if (!bf.encrypted) setDump(await openBackup(bf));
    } catch (e) { setErr(e instanceof BackupError ? e.message : "無法讀取檔案"); }
  };
  const unlock = async () => { try { setErr(""); setDump(await openBackup(file!, pw)); } catch (e) { setErr((e as Error).message); } };
  const doRestore = async () => {
    setBusy(true);
    try { await restoreBackup(dump!, mode); const n = dump!.persons.length; reset(); onDone(`已${mode === "replace" ? "取代還原" : "合併匯入"} ${n} 位人物`); }
    catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  };

  return (
    <div className="p-4">
      <p className="text-[15px]">從備份檔還原／匯入</p>
      <input ref={input} type="file" accept="application/json,.json" className="hidden" onChange={e => onPick(e.target.files?.[0])} />
      <Button className="mt-3" size="sm" onClick={() => input.current?.click()}><Icon name="upload" size={15} />選擇備份檔</Button>
      {err && <p className="mt-2 text-[13px] text-[var(--danger)]" role="alert">{err}</p>}
      <Sheet open={!!file} onClose={reset} title="匯入備份">
        {file && (
          <div className="space-y-3 text-[14px]">
            <dl className="inset grid grid-cols-[6rem_1fr] gap-y-1 p-3 text-[13px]">
              <dt className="text-[var(--ink-3)]">匯出時間</dt><dd>{new Date(file.exported_at).toLocaleString("zh-TW")}</dd>
              <dt className="text-[var(--ink-3)]">App 版本</dt><dd className="num">{file.app_version}（格式 v{file.schema_version}）</dd>
              <dt className="text-[var(--ink-3)]">人物數</dt><dd>{file.person_count} 位{file.scope === "selected" ? "（部分人物）" : ""}</dd>
              <dt className="text-[var(--ink-3)]">加密</dt><dd>{file.encrypted ? "是" : "否"}</dd>
            </dl>
            {file.encrypted && !dump && (
              <>
                <Field label="備份密碼"><input type="password" className="input" value={pw} onChange={e => setPw(e.target.value)} /></Field>
                <Button block onClick={unlock} disabled={!pw}>解開備份</Button>
              </>
            )}
            {dump && (
              <>
                <p className="text-[13px] text-[var(--ink-2)]">包含：{dump.persons.map(p => p.displayName).join("、") || "（無人物）"}</p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setMode("merge")} className={`rounded-xl p-3 text-left ${mode === "merge" ? "bg-[var(--ink-1)] text-[var(--bg)]" : "bg-[var(--surface-2)]"}`}>
                    <p className="text-[14px] font-medium">合併</p><p className="text-[12px] opacity-70">保留現有人物，同一人以備份覆蓋</p>
                  </button>
                  <button onClick={() => setMode("replace")} className={`rounded-xl p-3 text-left ${mode === "replace" ? "bg-[var(--danger)] text-[var(--bg)]" : "bg-[var(--surface-2)]"}`}>
                    <p className="text-[14px] font-medium">取代</p><p className="text-[12px] opacity-70">先清除現有人物，再完整還原</p>
                  </button>
                </div>
                <Button variant="primary" block onClick={doRestore} disabled={busy}>{busy ? "還原中…" : "開始匯入"}</Button>
              </>
            )}
            {err && <p className="text-[13px] text-[var(--danger)]" role="alert">{err}</p>}
          </div>
        )}
      </Sheet>
    </div>
  );
}

function SchoolEditor({ s, onSaved }: { s: SchoolProfile; onSaved: () => void }) {
  const [x, setX] = useState(s);
  const dirty = JSON.stringify(x) !== JSON.stringify(s);
  return (
    <details className="card p-4">
      <summary className="cursor-pointer text-[15px]">{s.name}{s.isDefault && <span className="ml-2 text-[11px] text-[var(--ink-3)]">預設</span>}</summary>
      <div className="mt-3 space-y-3">
        <Field label="八字：子時換日" hint="晚子時（23:00–24:00）是否算次日">
          <select className="input" value={x.bazi.ziHour} onChange={e => setX({ ...x, bazi: { ...x.bazi, ziHour: e.target.value as SchoolProfile["bazi"]["ziHour"] } })}>
            <option value="lateZiSameDay">晚子時不換日（23 點仍算當日）</option><option value="earlyZiNextDay">子初換日（23 點起算次日）</option>
          </select>
        </Field>
        <Field label="紫微：閏月處理">
          <select className="input" value={x.ziwei.leapMonth} onChange={e => setX({ ...x, ziwei: { ...x.ziwei, leapMonth: e.target.value as SchoolProfile["ziwei"]["leapMonth"] } })}>
            <option value="splitAt15">十五日以前算本月、以後算下月</option><option value="asCurrent">一律算本月</option><option value="asNext">一律算下月</option>
          </select>
        </Field>
        <Field label="紫微：庚干四化">
          <select className="input" value={x.ziwei.gengSihua} onChange={e => setX({ ...x, ziwei: { ...x.ziwei, gengSihua: e.target.value as SchoolProfile["ziwei"]["gengSihua"] } })}>
            <option value="陽武陰同">太陽祿・武曲權・太陰科・天同忌</option><option value="陽武同陰">太陽祿・武曲權・天同科・太陰忌</option>
          </select>
        </Field>
        <Field label="奇門：定局法">
          <select className="input" value={x.qimen.method} onChange={e => setX({ ...x, qimen: { ...x.qimen, method: e.target.value as SchoolProfile["qimen"]["method"] } })}>
            <option value="chaibu">拆補法</option><option value="zhirun">置閏法</option>
          </select>
        </Field>
        <p className="text-[12px] text-[var(--ink-3)]">這些設定會在對應排盤引擎完成後生效；每個結果都會標示所用流派。</p>
        <Button size="sm" variant="primary" disabled={!dirty} onClick={async () => { await saveSchool(x); onSaved(); }}>儲存</Button>
      </div>
    </details>
  );
}
