"use client";
import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "../../providers";
import {
  DEFAULT_SCHOOL_ID, RELATIONS, TIME_ACCURACY,
  type BirthProfile, type Gender, type Person, type PersonBundle, type Relation, type TimeAccuracy,
} from "@/core/person";
import { PLACES, TIME_ZONES } from "@/kb/places";
import { localOffset, formatOffset, isValidTimeZone } from "@/core/calendar/tz";
import { fromLunar, leapMonthOf, toLunar } from "@/core/calendar/precise";
import { deletePerson, newId, nextSortOrder, nowISO, saveBundle, saveTag, setPrefs } from "@/data/repo";
import { Button, Chip, Confirm, Field, Icon, PageHeader, Toggle } from "@/ui/primitives";

export default function EditPage() {
  return <Suspense><EditForm /></Suspense>;
}

function blank(): PersonBundle {
  const id = newId(), t = nowISO();
  return {
    person: { id, displayName: "", gender: "male", relation: "family", isFavorite: false, sortOrder: 0, createdAt: "", updatedAt: t },
    birth: {
      personId: id, localDate: "", localTime: "", timeAccuracy: "exact", inputCalendar: "solar",
      place: { name: "台南", countryCode: "TW", lat: 22.99, lng: 120.21 }, timeZone: "Asia/Taipei", dstOverride: "auto",
      useTrueSolarTime: true, schoolProfileId: DEFAULT_SCHOOL_ID, createdAt: "", updatedAt: t,
    },
    tagIds: [],
  };
}

function EditForm() {
  const params = useSearchParams();
  const router = useRouter();
  const { persons, tags, schools, refresh } = useApp();
  const editing = persons.find(b => b.person.id === params.get("id"));
  const [b, setB] = useState<PersonBundle>(() => editing ? structuredClone(editing) : blank());
  const [custom, setCustom] = useState(() => !!editing && !PLACES.some(p => p.name === editing.birth.place.name));
  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const P = (patch: Partial<Person>) => setB(x => ({ ...x, person: { ...x.person, ...patch } }));
  const B = (patch: Partial<BirthProfile>) => setB(x => ({ ...x, birth: { ...x.birth, ...patch } }));

  const tzOk = isValidTimeZone(b.birth.timeZone);
  const offset = useMemo(() => {
    if (!tzOk || !/^\d{4}-\d{2}-\d{2}$/.test(b.birth.localDate) || !b.birth.localTime) return null;
    try { return localOffset(b.birth.localDate, b.birth.localTime, b.birth.timeZone); } catch { return null; }
  }, [b.birth.localDate, b.birth.localTime, b.birth.timeZone, tzOk]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!b.person.displayName.trim()) e.name = "請輸入姓名或暱稱";
    const m = b.birth.localDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) e.date = b.birth.inputCalendar === "lunar" ? "此農曆日期不存在，請重新選擇" : "請選擇出生日期";
    else if (+m[1] < 1900 || +m[1] > 2100) e.date = "目前支援 1900–2100 年";
    if (b.birth.localTime && !/^\d{2}:\d{2}$/.test(b.birth.localTime)) e.time = "時間格式應為 時:分";
    if (!tzOk) e.tz = "時區名稱無效（例：Asia/Taipei）";
    if (custom && (!isFinite(b.birth.place.lat) || Math.abs(b.birth.place.lat) > 90)) e.lat = "緯度需介於 -90 到 90";
    if (custom && (!isFinite(b.birth.place.lng) || Math.abs(b.birth.place.lng) > 180)) e.lng = "經度需介於 -180 到 180";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const time = b.birth.localTime || null;
      const out: PersonBundle = {
        ...b,
        person: { ...b.person, displayName: b.person.displayName.trim(), sortOrder: editing ? b.person.sortOrder : await nextSortOrder() },
        birth: { ...b.birth, localTime: time, timeAccuracy: time ? b.birth.timeAccuracy : "unknown" },
      };
      await saveBundle(out);
      if (!persons.length) await setPrefs({ activePersonId: out.person.id });
      await refresh();
      router.replace(`/persons/view/?id=${out.person.id}`);
    } finally { setSaving(false); }
  };

  const addTag = async () => {
    const name = newTag.trim();
    if (!name) return;
    const exist = tags.find(t => t.name === name);
    const id = exist?.id ?? newId();
    if (!exist) await saveTag({ id, name, createdAt: nowISO() });
    setB(x => ({ ...x, tagIds: [...new Set([...x.tagIds, id])] }));
    setNewTag(""); await refresh();
  };

  const pickPlace = (name: string) => {
    if (name === "__custom") { setCustom(true); return; }
    const p = PLACES.find(x => x.name === name)!;
    setCustom(false);
    B({ place: { name: p.name, countryCode: p.countryCode, lat: p.lat, lng: p.lng }, timeZone: p.timeZone });
  };

  const regions = [...new Set(PLACES.map(p => p.region))];

  return (
    <main className="safe-top mx-auto max-w-lg px-4">
      <PageHeader title={editing ? "編輯人物" : "新增人物"} subtitle="建立一次，之後直接點選即可分析"
        right={<Button size="sm" variant="ghost" onClick={() => router.back()}>取消</Button>} />

      <section className="card space-y-4 p-4">
        <Field label="姓名／暱稱 *" error={errors.name}>
          <input className="input" value={b.person.displayName} onChange={e => P({ displayName: e.target.value })} placeholder="例：陳○○、爸爸" />
        </Field>
        <Field label="全名（選填）">
          <input className="input" value={b.person.fullName ?? ""} onChange={e => P({ fullName: e.target.value || undefined })} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="性別">
            <select className="input" value={b.person.gender} onChange={e => P({ gender: e.target.value as Gender })}>
              <option value="male">男</option><option value="female">女</option>
            </select>
          </Field>
          <Field label="關係">
            <select className="input" value={b.person.relation} onChange={e => P({ relation: e.target.value as Relation })}>
              {RELATIONS.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
            </select>
          </Field>
        </div>
        <Field label="關係說明（選填）" hint="例：父親、母親、部門主管">
          <input className="input" value={b.person.relationNote ?? ""} onChange={e => P({ relationNote: e.target.value || undefined })} />
        </Field>
        <Toggle checked={b.person.isFavorite} onChange={v => P({ isFavorite: v })} label="加入最愛" />
      </section>

      <h2 className="font-serif mb-2 mt-6 px-0.5 text-[17px] font-semibold">出生資料</h2>
      <section className="card space-y-4 p-4">
        <div role="radiogroup" aria-label="輸入曆法" className="inline-flex rounded-full bg-[var(--surface-2)] p-0.5 text-[13px]">
          {(["solar", "lunar"] as const).map(c => (
            <button key={c} type="button" role="radio" aria-checked={b.birth.inputCalendar === c}
              onClick={() => B(c === "lunar" ? { inputCalendar: "lunar", lunarInput: b.birth.lunarInput ?? lunarOfSolar(b.birth.localDate) } : { inputCalendar: "solar" })}
              className={`rounded-full px-4 py-1.5 ${b.birth.inputCalendar === c ? "bg-[var(--ink-1)] text-[var(--bg)]" : "text-[var(--ink-2)]"}`}>
              {c === "solar" ? "國曆" : "農曆"}
            </button>
          ))}
        </div>
        {b.birth.inputCalendar === "solar" ? (
          <Field label="出生日期（西元・國曆）*" error={errors.date}>
            <input type="date" className="input" min="1900-01-01" max="2100-12-31" value={b.birth.localDate} onChange={e => B({ localDate: e.target.value })} />
          </Field>
        ) : (
          <LunarInput value={b.birth.lunarInput!} error={errors.date} onChange={(li, solar) => B({ lunarInput: li, localDate: solar ?? "" })} />
        )}
        <div className="grid grid-cols-2 gap-3">
          <Field label="出生時間（到分鐘）" error={errors.time} hint="不知道可留空">
            <input type="time" className="input" value={b.birth.localTime ?? ""} onChange={e => B({ localTime: e.target.value })} />
          </Field>
          <Field label="時間準確度">
            <select className="input" value={b.birth.localTime ? b.birth.timeAccuracy : "unknown"} disabled={!b.birth.localTime}
              onChange={e => B({ timeAccuracy: e.target.value as TimeAccuracy })}>
              {TIME_ACCURACY.map(a => <option key={a.key} value={a.key}>{a.label}</option>)}
            </select>
          </Field>
        </div>

        <Field label="出生地">
          <select className="input" value={custom ? "__custom" : b.birth.place.name} onChange={e => pickPlace(e.target.value)}>
            {regions.map(r => (
              <optgroup key={r} label={r}>{PLACES.filter(p => p.region === r).map(p => <option key={p.name} value={p.name}>{p.name}</option>)}</optgroup>
            ))}
            <option value="__custom">其他（自行輸入經緯度）</option>
          </select>
        </Field>
        {custom && (
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><Field label="地名"><input className="input" value={b.birth.place.name} onChange={e => B({ place: { ...b.birth.place, name: e.target.value } })} /></Field></div>
            <Field label="緯度" error={errors.lat}><input className="input num" inputMode="decimal" value={b.birth.place.lat} onChange={e => B({ place: { ...b.birth.place, lat: Number(e.target.value) } })} /></Field>
            <Field label="經度" error={errors.lng}><input className="input num" inputMode="decimal" value={b.birth.place.lng} onChange={e => B({ place: { ...b.birth.place, lng: Number(e.target.value) } })} /></Field>
          </div>
        )}
        <Field label="時區" error={errors.tz} hint="夏令時間依時區歷史資料自動判斷">
          {custom
            ? <input className="input" list="tz-list" value={b.birth.timeZone} onChange={e => B({ timeZone: e.target.value })} />
            : <input className="input" value={b.birth.timeZone} readOnly />}
        </Field>
        <datalist id="tz-list">{TIME_ZONES.map(z => <option key={z} value={z} />)}</datalist>
        {offset && (
          <p className="inset px-3 py-2 text-[13px] text-[var(--ink-2)]">
            該時刻當地為 <span className="num">{formatOffset(offset.offsetMinutes)}</span>
            {offset.isDST && <span className="text-[var(--accent)]">（夏令時間，比標準時間快 {(offset.offsetMinutes - offset.standardMinutes) / 60} 小時）</span>}
          </p>
        )}
        <Toggle checked={b.birth.useTrueSolarTime} onChange={v => B({ useTrueSolarTime: v })} label="採用真太陽時"
          desc={`依出生地經度（${b.birth.place.lng}°）與均時差校正出生時間`} />

        <details className="rounded-xl bg-[var(--surface-2)] px-3 py-2">
          <summary className="cursor-pointer text-[14px] text-[var(--ink-2)]">進階：流派與夏令時間</summary>
          <div className="mt-3 space-y-3 pb-1">
            <Field label="排盤流派設定" hint="可在「設定 → 流派與排盤規則」調整">
              <select className="input" value={b.birth.schoolProfileId} onChange={e => B({ schoolProfileId: e.target.value })}>
                {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </Field>
            <Field label="夏令時間" hint="若出生證明記載與時區資料不符，可手動指定">
              <select className="input" value={b.birth.dstOverride} onChange={e => B({ dstOverride: e.target.value as BirthProfile["dstOverride"] })}>
                <option value="auto">自動（依時區資料）</option><option value="on">強制視為夏令時間</option><option value="off">強制視為標準時間</option>
              </select>
            </Field>
          </div>
        </details>
      </section>

      <h2 className="font-serif mb-2 mt-6 px-0.5 text-[17px] font-semibold">標籤與備註</h2>
      <section className="card space-y-4 p-4">
        <div className="flex flex-wrap gap-2">
          {tags.map(t => {
            const on = b.tagIds.includes(t.id);
            return <Chip key={t.id} active={on} onClick={() => setB(x => ({ ...x, tagIds: on ? x.tagIds.filter(i => i !== t.id) : [...x.tagIds, t.id] }))}># {t.name}</Chip>;
          })}
        </div>
        <div className="flex gap-2">
          <input className="input" placeholder="新增標籤，例：家人、公司、旅伴" value={newTag} onChange={e => setNewTag(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} />
          <Button onClick={addTag} disabled={!newTag.trim()}><Icon name="tag" size={16} />加入</Button>
        </div>
        <Field label="備註">
          <textarea className="input min-h-20" value={b.person.note ?? ""} onChange={e => P({ note: e.target.value || undefined })} />
        </Field>
      </section>

      <div className="mt-6 space-y-3">
        <Button variant="primary" block onClick={save} disabled={saving}>{saving ? "儲存中…" : "儲存"}</Button>
        {editing && <Button variant="danger" block onClick={() => setConfirmDel(true)}><Icon name="trash" size={16} />刪除此人物</Button>}
      </div>

      <Confirm open={confirmDel} onClose={() => setConfirmDel(false)} danger title={`刪除「${b.person.displayName}」`} confirmText="永久刪除"
        message={<>將從這台裝置永久刪除此人物的基本資料、出生資料、標籤關聯、命盤快取與分析紀錄。刪除後無法復原（除非你有備份檔）。</>}
        onConfirm={async () => { await deletePerson(b.person.id); await refresh(); router.replace("/persons/"); }} />
    </main>
  );
}

const pad2 = (n: number) => String(n).padStart(2, "0");
function lunarOfSolar(date: string) {
  const m = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return { year: 1980, month: 1, day: 1, isLeap: false };
  const l = toLunar(+m[1], +m[2], +m[3]);
  return { year: l.year, month: l.month, day: l.day, isLeap: l.isLeap };
}
const CN_MONTH = ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "臘"];
const CN_DAY = (d: number) => d === 10 ? "初十" : d === 20 ? "二十" : d === 30 ? "三十" : ["初", "十", "廿", "三"][Math.floor(d / 10)] + ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"][d % 10];

function LunarInput({ value, onChange, error }: { value: { year: number; month: number; day: number; isLeap: boolean }; error?: string; onChange: (v: { year: number; month: number; day: number; isLeap: boolean }, solar: string | null) => void }) {
  const leap = leapMonthOf(value.year);
  let solar: string | null = null;
  try { const s = fromLunar(value.year, value.month, value.day, value.isLeap); solar = `${s.y}-${pad2(s.m)}-${pad2(s.d)}`; } catch { solar = null; }
  const set = (patch: Partial<typeof value>) => {
    const v = { ...value, ...patch };
    if (v.isLeap && leapMonthOf(v.year) !== v.month) v.isLeap = false;
    let s: string | null = null;
    try { const r = fromLunar(v.year, v.month, v.day, v.isLeap); s = `${r.y}-${pad2(r.m)}-${pad2(r.d)}`; } catch { s = null; }
    onChange(v, s);
  };
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <Field label="農曆年"><input className="input num" inputMode="numeric" value={value.year} onChange={e => set({ year: Number(e.target.value) || value.year })} /></Field>
        <Field label="月">
          <select className="input" value={`${value.isLeap ? "L" : ""}${value.month}`} onChange={e => set({ month: Number(e.target.value.replace("L", "")), isLeap: e.target.value.startsWith("L") })}>
            {Array.from({ length: 12 }, (_, i) => i + 1).flatMap(m => [
              <option key={m} value={`${m}`}>{CN_MONTH[m - 1]}月</option>,
              ...(leap === m ? [<option key={`L${m}`} value={`L${m}`}>閏{CN_MONTH[m - 1]}月</option>] : []),
            ])}
          </select>
        </Field>
        <Field label="日">
          <select className="input" value={value.day} onChange={e => set({ day: Number(e.target.value) })}>
            {Array.from({ length: 30 }, (_, i) => i + 1).map(d => <option key={d} value={d}>{CN_DAY(d)}</option>)}
          </select>
        </Field>
      </div>
      <p className={`text-[13px] ${solar ? "text-[var(--ink-2)]" : "text-[var(--danger)]"}`} role={solar ? undefined : "alert"}>
        {solar ? `對應國曆 ${solar.replaceAll("-", "/")}` : error ?? "此農曆日期不存在（該月可能只有 29 天）"}
      </p>
    </div>
  );
}
