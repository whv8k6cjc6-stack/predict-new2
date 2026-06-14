"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getProfiles, saveProfiles, uid } from "@/lib/storage/store";
import { computeBazi } from "@/engines/bazi";
import type { Profile } from "@/types/profile";

const TW_CITIES: { name: string; lng: number; lat: number }[] = [
  { name: "台北", lng: 121.56, lat: 25.04 }, { name: "新北", lng: 121.46, lat: 25.01 },
  { name: "桃園", lng: 121.30, lat: 24.99 }, { name: "新竹", lng: 120.97, lat: 24.80 },
  { name: "台中", lng: 120.68, lat: 24.15 }, { name: "彰化", lng: 120.54, lat: 24.08 },
  { name: "雲林", lng: 120.43, lat: 23.71 }, { name: "嘉義", lng: 120.45, lat: 23.48 },
  { name: "台南", lng: 120.21, lat: 23.00 }, { name: "新營", lng: 120.32, lat: 23.31 },
  { name: "高雄", lng: 120.30, lat: 22.63 }, { name: "屏東", lng: 120.49, lat: 22.67 },
  { name: "宜蘭", lng: 121.75, lat: 24.70 }, { name: "花蓮", lng: 121.61, lat: 23.98 },
  { name: "台東", lng: 121.15, lat: 22.76 }, { name: "澎湖", lng: 119.57, lat: 23.57 },
];

const empty = (): Profile => ({
  id: uid(), name: "本人", gender: "male",
  birthDate: "", birthTime: "", birthTimeAccuracy: "unknown",
  birthPlace: { country: "Taiwan", city: "台南", timezone: "Asia/Taipei", longitude: 120.21, latitude: 23.0 },
  calendarType: "solar", useTrueSolarTime: true, ziRule: "lateZi", notes: "",
  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
});

export default function ProfilePage() {
  const [list, setList] = useState<Profile[]>([]);
  const [p, setP] = useState<Profile>(empty());
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const l = getProfiles(); setList(l);
    if (l[0]) setP(l[0]);
  }, []);

  const upd = (patch: Partial<Profile>) => setP({ ...p, ...patch, updatedAt: new Date().toISOString() });

  const save = () => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(p.birthDate)) { setPreview("請先填寫出生日期（國曆年月日）。"); return; }
    let c;
    try {
      c = computeBazi(p);
    } catch { setPreview("排盤失敗，請檢查日期時間格式。"); return; }
    const others = list.filter(x => x.id !== p.id);
    const next = [p, ...others];
    setList(next); saveProfiles(next);
    setPreview(`已儲存 ✓　四柱：${c.pillars.year.text}年 ${c.pillars.month.text}月 ${c.pillars.day.text}日 ${c.pillars.hour?.text ?? "（缺時辰）"}時${p.birthTime ? "" : "\n未填時辰：八字僅三柱、紫微與奇門問事仍可用，但個人時柱相關判斷會略過。"}`);
  };

  const cls = "w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm";
  const lbl = "mt-3 block text-xs text-[var(--ink-dim)]";

  return (
    <main className="mx-auto max-w-md px-5 pb-16 pt-10">
      <Link href="/" className="text-sm text-[var(--ink-dim)]">← 返回</Link>
      <h1 className="mt-3 text-2xl font-semibold">命盤</h1>

      <div className="mt-4 rounded-2xl border border-white/10 bg-[var(--panel)] p-4">
        <label className={lbl}>姓名</label>
        <input className={cls} value={p.name} onChange={e => upd({ name: e.target.value })} />
        <label className={lbl}>性別</label>
        <select className={cls} value={p.gender} onChange={e => upd({ gender: e.target.value as "male"|"female" })}>
          <option value="male">男</option><option value="female">女</option>
        </select>
        <label className={lbl}>出生日期（國曆）</label>
        <input type="date" className={cls} value={p.birthDate} onChange={e => upd({ birthDate: e.target.value })} />
        <label className={lbl}>出生時間（不確定可留空）</label>
        <input type="time" className={cls} value={p.birthTime ?? ""} onChange={e => upd({ birthTime: e.target.value || null, birthTimeAccuracy: e.target.value ? p.birthTimeAccuracy : "unknown" })} />
        <label className={lbl}>時辰準確度</label>
        <select className={cls} value={p.birthTimeAccuracy} onChange={e => upd({ birthTimeAccuracy: e.target.value as Profile["birthTimeAccuracy"] })}>
          <option value="exact">確定</option><option value="approximate">大約</option><option value="unknown">不確定</option>
        </select>
        <label className={lbl}>出生地（選縣市自動帶入經度，真太陽時用）</label>
        <select className={cls} value={TW_CITIES.find(c => Math.abs(c.lng - p.birthPlace.longitude) < 0.02)?.name ?? "custom"}
          onChange={e => { const c = TW_CITIES.find(x => x.name === e.target.value); if (c) upd({ birthPlace: { ...p.birthPlace, city: c.name, longitude: c.lng, latitude: c.lat } }); }}>
          {TW_CITIES.map(c => <option key={c.name} value={c.name}>{c.name}（{c.lng}）</option>)}
          <option value="custom">其他／自訂經度</option>
        </select>
        <input type="number" step="0.01" className={cls + " mt-2"} value={p.birthPlace.longitude}
          onChange={e => upd({ birthPlace: { ...p.birthPlace, longitude: Number(e.target.value) } })} />
        <div className="mt-3 flex items-center gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={p.useTrueSolarTime} onChange={e => upd({ useTrueSolarTime: e.target.checked })} /> 真太陽時
          </label>
          <select className="rounded-lg border border-white/15 bg-black/30 px-2 py-1 text-sm" value={p.ziRule}
            onChange={e => upd({ ziRule: e.target.value as Profile["ziRule"] })}>
            <option value="lateZi">晚子時不換日</option><option value="earlyZi">早子時換日</option>
          </select>
        </div>
        <button onClick={save} className="mt-5 w-full rounded-lg bg-[var(--gold)] py-2.5 text-sm font-medium text-black">儲存並排盤核對</button>
        {preview && <p className="mt-3 whitespace-pre-line text-sm text-[var(--jade)]">{preview}</p>}
      </div>
      <p className="mt-4 text-[11px] leading-relaxed text-[var(--ink-dim)]">
        生辰屬敏感個資，資料只存在此裝置瀏覽器內；換機前請至「設定」匯出備份。
      </p>
    </main>
  );
}
