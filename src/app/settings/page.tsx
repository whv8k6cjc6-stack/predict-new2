"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../providers";
import { APP_VERSION, BACKUP_SCHEMA_VERSION, SCHEMA_VERSION } from "@/core/versioning";
import { ENGINES, STATUS_LABEL } from "@/core/registry";
import type { CalculationSettings } from "@/core/person";
import { BUILTIN_ZIWEI_PROFILES, profileForOverrides, resolveZiweiProfile, type ProfileOverride } from "@/core/ziwei/profile";
import { legacyZiweiScoring } from "@/kb/rules/ziwei";
import { SCORED_SYSTEMS, SYSTEM_SCORING } from "@/kb/weights";
import { SYSTEM_LABEL } from "@/core/analysis/score";
import { ProfileBadge, ZiweiProfileTable, ZiweiVersionList } from "@/ui/ZiweiSystem";
import { addZiweiProfile, reencryptAll, saveSettings, storageStatus, wipeAll } from "@/data/repo";
import {
  changePin, disableLock, enableLock, lock, passkeyAvailable, registerPasskey, removePasskey, setAutoLockMinutes,
} from "@/data/vault";
import { BackupError, openBackup, parseBackup, restoreBackup, type BackupFile } from "@/data/backup";
import type { PlainDump } from "@/data/repo";
import { Banner, Button, Confirm, Field, Icon, PageHeader, SectionTitle, Sheet, Toggle } from "@/ui/primitives";
import { ModeToggle } from "@/ui/interpret";
import { ExportSheet } from "@/ui/ExportSheet";
import { BandLegend } from "@/ui/score";
import { InvestorSettings, WorkSettings } from "@/ui/InvestorSettings";

export default function SettingsPage() {
  const { security, prefs, persons, settingsList, refresh, updatePrefs } = useApp();
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

      <SectionTitle>個人化建議</SectionTitle>
      <WorkSettings />
      <div className="mt-2"><InvestorSettings /></div>

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

      <SectionTitle>計算設定與排盤體系</SectionTitle>
      <p className="mb-2 px-0.5 text-[12px] leading-relaxed text-[var(--ink-3)]">排盤規則屬於「計算設定」，不屬於人物本身；同一人物可改用不同設定比較。各命理模組的規則彼此獨立。</p>
      <div className="space-y-2">{settingsList.map(s => <SettingsEditor key={s.id + s.updatedAt} s={s} onSaved={refresh} />)}</div>

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
        <Link href="/sources/" className="mt-3 block text-[var(--accent)]">來源、規則與計分權重 →</Link>
        <div className="mt-3 border-t border-[var(--line)] pt-3">
          <Toggle checked={!!prefs.developerMode} onChange={v => updatePrefs({ developerMode: v })} label="開發者模式"
            desc="檢視規則、版本與已停用的舊紫微計分比較。不影響正式結果。" />
        </div>
        <Link href="/demo/" className="mt-2 inline-block text-[var(--demo)]">DEMO 版面（測試資料）→</Link>
      </div>

      {prefs.developerMode && <DeveloperPanel />}

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

type ZiweiChoice = { leap: "splitAt15" | "asCurrent" | "asNext"; day: "00:00" | "23:00"; geng: "陽武陰同" | "陽武同陰" };

function SettingsEditor({ s, onSaved }: { s: CalculationSettings; onSaved: () => void }) {
  const { ziweiProfiles } = useApp();
  const [x, setX] = useState(s);
  const profile = (() => { try { return resolveZiweiProfile(x.ziwei.ruleProfileId, ziweiProfiles); } catch { return null; } })();
  const baseId = profile?.kind === "builtin" ? profile.id : profile?.baseProfileId ?? "iztro_compatible_v1";
  const current: ZiweiChoice | null = profile ? {
    leap: profile.rules.leapMonthRule.value, day: profile.rules.dayBoundaryRule.value,
    geng: profile.rules.fourTransformationsTable.value.庚[2] === "太陰" ? "陽武陰同" : "陽武同陰",
  } : null;
  const [choice, setChoice] = useState<ZiweiChoice | null>(current);
  const [err, setErr] = useState("");
  const choiceDirty = !!choice && !!current && JSON.stringify(choice) !== JSON.stringify(current);
  const dirty = JSON.stringify(x) !== JSON.stringify(s) || choiceDirty;
  // legacy Profile 只服務舊資料升級：僅在此設定原本就使用時列出，不提供給其他設定選用
  const options = [
    ...Object.values(BUILTIN_ZIWEI_PROFILES).map(p => ({ id: p.id, name: p.name })),
    ...ziweiProfiles.filter(p => p.kind === "custom" || p.id === s.ziwei.ruleProfileId).map(p => ({ id: p.id, name: `${p.name}（${p.id}）` })),
  ];

  const save = async () => {
    setErr("");
    try {
      let next = x;
      if (choiceDirty && choice) {
        const overrides: ProfileOverride[] = [
          { field: "leapMonthRule", value: choice.leap }, { field: "dayBoundaryRule", value: choice.day }, { field: "gengTransformation", value: choice.geng },
        ];
        const r = profileForOverrides(baseId, overrides, ziweiProfiles, new Date());
        if (r.created) await addZiweiProfile(r.created);
        next = { ...x, ziwei: { ruleProfileId: r.id } };
      }
      await saveSettings({ ...next, origin: next.origin === "builtin" ? "builtin" : "user" });
      onSaved();
    } catch (e) { setErr((e as Error).message); }
  };

  return (
    <details className="card p-4">
      <summary className="cursor-pointer text-[15px]">{s.name}{s.isDefault && <span className="ml-2 text-[11px] text-[var(--ink-3)]">預設</span>}</summary>
      <div className="mt-3 space-y-4">
        <Field label="八字：子時換日（只影響八字）" hint="紫微的安星日界改由下方紫微排盤體系決定，兩者互不影響">
          <select className="input" value={x.bazi.ziHour} onChange={e => setX({ ...x, bazi: { ...x.bazi, ziHour: e.target.value as CalculationSettings["bazi"]["ziHour"] } })}>
            <option value="lateZiSameDay">晚子時不換日（23 點仍算當日）</option><option value="earlyZiNextDay">子初換日（23 點起算次日）</option>
          </select>
        </Field>

        <Field label="奇門：代表自己的天干" hint="年命是傳統命理的看法；擇時常以當天的日干代表求測的人。只影響奇門的時段與事件判斷，不改排盤">
          <select className="input" value={x.qimen.selfStem ?? "year"} onChange={e => setX({ ...x, qimen: { ...x.qimen, selfStem: e.target.value as "year" | "day" } })}>
            <option value="year">出生年干（年命，預設）</option><option value="day">當天日干（擇時常用）</option>
          </select>
        </Field>

        <div className="space-y-2">
          <Field label="紫微斗數排盤體系">
            <select className="input" value={x.ziwei.ruleProfileId} onChange={e => { setX({ ...x, ziwei: { ruleProfileId: e.target.value } }); setChoice(null); }}>
              {options.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              {!options.some(o => o.id === x.ziwei.ruleProfileId) && <option value={x.ziwei.ruleProfileId}>找不到：{x.ziwei.ruleProfileId}</option>}
            </select>
          </Field>
          {profile && <ProfileBadge p={profile} />}
          {profile && (
            <details className="rounded-xl bg-[var(--surface-2)] px-3 py-2">
              <summary className="cursor-pointer text-[13px] text-[var(--ink-2)]">查看全部規則與來源</summary>
              <div className="mt-2"><ZiweiProfileTable p={profile} /></div>
            </details>
          )}
          {choice && (
            <details className="rounded-xl bg-[var(--surface-2)] px-3 py-2">
              <summary className="cursor-pointer text-[13px] text-[var(--ink-2)]">建立自訂體系（不修改標準體系）</summary>
              <div className="mt-2 space-y-2">
                <p className="text-[12px] leading-relaxed text-[var(--ink-3)]">標準體系固定不可修改。變更以下任一項時，會建立「自訂（基於 {baseId}）」並記錄差異；只提供程式已實作的選項。</p>
                <Field label="閏月">
                  <select className="input" value={choice.leap} onChange={e => setChoice({ ...choice, leap: e.target.value as ZiweiChoice["leap"] })}>
                    <option value="splitAt15">十五日（含）以前算本月、以後算下月</option><option value="asCurrent">一律算本月</option><option value="asNext">一律算下月</option>
                  </select>
                </Field>
                <Field label="紫微安星日界" hint="只決定晚子時（23–24 點）出生以哪一天的農曆日安紫微；不是民用日期換日，也不影響八字">
                  <select className="input" value={choice.day} onChange={e => setChoice({ ...choice, day: e.target.value as ZiweiChoice["day"] })}>
                    <option value="00:00">00:00（晚子時仍以當日安星）</option><option value="23:00">23:00（晚子時以次日安星）</option>
                  </select>
                </Field>
                <Field label="庚干四化">
                  <select className="input" value={choice.geng} onChange={e => setChoice({ ...choice, geng: e.target.value as ZiweiChoice["geng"] })}>
                    <option value="陽武陰同">太陽祿・武曲權・太陰科・天同忌</option><option value="陽武同陰">太陽祿・武曲權・天同科・太陰忌</option>
                  </select>
                </Field>
              </div>
            </details>
          )}
        </div>

        <div className="text-[13px]">
          <p className="text-[var(--ink-2)]">奇門：時家轉盤・拆補法</p>
          <p className="text-[12px] text-[var(--ink-3)]">目前唯一實作的定局法（置閏法尚未實作，不提供選項）。</p>
        </div>
        <p className="text-[12px] text-[var(--ink-3)]">儲存後，使用此設定的人物會依新規則重新排盤；每張命盤都會標示所用體系與版本。</p>
        {err && <p className="text-[13px] text-[var(--danger)]" role="alert">{err}</p>}
        <Button size="sm" variant="primary" disabled={!dirty} onClick={save}>儲存</Button>
      </div>
    </details>
  );
}

function DeveloperPanel() {
  const { settingsList, ziweiProfiles } = useApp();
  return (
    <>
      <SectionTitle>開發者模式</SectionTitle>
      <div className="card space-y-4 p-4 text-[13px]">
        <div>
          <p className="mb-1 font-medium">評分組成（ScoreAggregator）</p>
          <ul className="space-y-0.5 text-[12px]">
            {SCORED_SYSTEMS.map(k => <li key={k}>{SYSTEM_LABEL[k]}：<code>{SYSTEM_SCORING[k].status}</code>（{SYSTEM_SCORING[k].detail}）{SYSTEM_SCORING[k].reason && <span className="block text-[var(--ink-3)]">{SYSTEM_SCORING[k].reason}</span>}</li>)}
          </ul>
        </div>
        <div>
          <p className="mb-1 font-medium">Legacy 紫微計分</p>
          <p className="text-[12px] text-[var(--ink-3)]">id <code>{legacyZiweiScoring.id}</code>・enabled={String(legacyZiweiScoring.enabled)}・userFacing={String(legacyZiweiScoring.userFacing)}・{legacyZiweiScoring.rules.length} 條（{legacyZiweiScoring.families.join("、")}）</p>
          <p className="text-[12px] text-[var(--ink-3)]">{legacyZiweiScoring.reason}在領域詳情頁可比較新舊分數。</p>
        </div>
        <div><p className="mb-1 font-medium">紫微模組版本</p><ZiweiVersionList /></div>
        <div>
          <p className="mb-1 font-medium">計算設定 → 紫微 Profile</p>
          <ul className="space-y-0.5 text-[12px]">{settingsList.map(s => <li key={s.id}><code>{s.id}</code> → <code>{s.ziwei.ruleProfileId}</code>（{s.origin}）</li>)}</ul>
          <p className="mt-1 text-[12px] text-[var(--ink-3)]">本機自訂／legacy Profile：{ziweiProfiles.length ? ziweiProfiles.map(p => p.id).join("、") : "無"}</p>
        </div>
      </div>
    </>
  );
}
