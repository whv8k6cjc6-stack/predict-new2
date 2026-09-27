"use client";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "../../providers";
import { relationLabel, TIME_ACCURACY } from "@/core/person";
import { ENGINES } from "@/core/registry";
import { localOffset, formatOffset } from "@/core/calendar/tz";
import { setFavorite } from "@/data/repo";
import { Button, EmptyState, Icon, SectionTitle } from "@/ui/primitives";
import { Avatar } from "@/ui/Nav";
import { ExportSheet } from "@/ui/ExportSheet";
import { Term } from "@/ui/interpret";

export default function ViewPage() {
  return <Suspense><PersonView /></Suspense>;
}

const phaseOf = (id: string) => ENGINES.find(e => e.id === id)!.phase;

const NATAL: { label: string; term?: string; engine: string }[] = [
  { label: "八字四柱", engine: "bazi" }, { label: "日主", term: "日主", engine: "bazi" },
  { label: "五行強弱", term: "旺衰", engine: "bazi" }, { label: "喜用神", term: "用神", engine: "bazi" },
  { label: "紫微命宮", term: "命宮", engine: "ziwei" }, { label: "主要星曜", term: "三方四正", engine: "ziwei" },
];
const CURRENT = [
  { label: "大運", term: "大運" }, { label: "流年", term: "流年" }, { label: "流月", term: "流月" }, { label: "今日", term: "流日" },
];
const FEATURES = [
  { label: "今日運勢", phase: 8 }, { label: "年度運勢", phase: 8 }, { label: "工作", phase: 8 }, { label: "財運", phase: 8 },
  { label: "投資", phase: 8 }, { label: "旅行", phase: 8 }, { label: "事件分析", phase: 8 }, { label: "日期比較", phase: 8 }, { label: "完整命盤", phase: 3 },
];

function PersonView() {
  const params = useSearchParams();
  const router = useRouter();
  const { persons, tags, schools, refresh, setActive, active } = useApp();
  const [exp, setExp] = useState(false);
  const b = persons.find(x => x.person.id === params.get("id"));

  if (!b) return (
    <main className="safe-top mx-auto max-w-lg px-4">
      <EmptyState title="找不到這位人物" action={<Link href="/persons/"><Button>回人物清單</Button></Link>}>可能已被刪除。</EmptyState>
    </main>
  );

  const off = b.birth.localTime ? localOffset(b.birth.localDate, b.birth.localTime, b.birth.timeZone) : null;
  const school = schools.find(s => s.id === b.birth.schoolProfileId);
  const isActive = active?.person.id === b.person.id;

  return (
    <main className="safe-top mx-auto max-w-lg px-4">
      <div className="flex items-center justify-between">
        <button onClick={() => router.push("/persons/")} className="flex items-center gap-1 text-[14px] text-[var(--ink-2)]"><Icon name="chevron" size={16} className="rotate-180" />人物</button>
        <div className="flex items-center gap-2">
          <button aria-label={b.person.isFavorite ? "取消最愛" : "加入最愛"} aria-pressed={b.person.isFavorite}
            onClick={async () => { await setFavorite(b.person.id, !b.person.isFavorite); await refresh(); }}
            className={`rounded-full bg-[var(--surface-2)] p-2 ${b.person.isFavorite ? "text-[var(--accent)]" : "text-[var(--ink-3)]"}`}>
            <Icon name="star" size={18} filled={b.person.isFavorite} />
          </button>
          <Link href={`/persons/edit/?id=${b.person.id}`} className="rounded-full bg-[var(--surface-2)] p-2 text-[var(--ink-2)]" aria-label="編輯"><Icon name="edit" size={18} /></Link>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <Avatar name={b.person.displayName} size={60} />
        <div className="min-w-0">
          <h1 className="font-serif truncate text-[26px] font-semibold leading-tight">{b.person.displayName}</h1>
          <p className="text-[13px] text-[var(--ink-3)]">{b.person.relationNote || relationLabel(b.person.relation)}・{b.person.gender === "male" ? "男" : "女"}
            {b.tagIds.length > 0 && `・${b.tagIds.map(id => tags.find(t => t.id === id)?.name).filter(Boolean).map(n => `#${n}`).join(" ")}`}</p>
        </div>
      </div>
      <Button className="mt-4" block variant={isActive ? "secondary" : "primary"} disabled={isActive}
        onClick={async () => { await setActive(b.person.id); router.push("/"); }}>
        {isActive ? "目前首頁正在分析此人物" : "設為分析人物並回到今日"}
      </Button>

      <SectionTitle>基本資料</SectionTitle>
      <dl className="card grid grid-cols-[6.5rem_1fr] gap-y-2 p-4 text-[14px]">
        <dt className="text-[var(--ink-3)]">出生日期</dt><dd className="num">{b.birth.localDate.replaceAll("-", "/")}（國曆）</dd>
        <dt className="text-[var(--ink-3)]">出生時間</dt><dd className="num">{b.birth.localTime ?? "不詳"}{b.birth.localTime && `・${TIME_ACCURACY.find(a => a.key === b.birth.timeAccuracy)?.label}`}</dd>
        <dt className="text-[var(--ink-3)]">出生地</dt><dd>{b.birth.place.name || "—"}<span className="num text-[var(--ink-3)]">（{b.birth.place.lat}, {b.birth.place.lng}）</span></dd>
        <dt className="text-[var(--ink-3)]">時區</dt><dd>{b.birth.timeZone}{off && <span className="num">・{formatOffset(off.offsetMinutes)}{off.isDST && "・夏令時間"}</span>}</dd>
        <dt className="text-[var(--ink-3)]">真太陽時</dt><dd>{b.birth.useTrueSolarTime ? "採用" : "不採用"}</dd>
        <dt className="text-[var(--ink-3)]">流派設定</dt><dd>{school?.name ?? "—"}</dd>
        {b.person.note && <><dt className="text-[var(--ink-3)]">備註</dt><dd className="whitespace-pre-wrap">{b.person.note}</dd></>}
      </dl>

      <SectionTitle right="排盤引擎完成後自動顯示">本命摘要</SectionTitle>
      <ul className="card divide-y divide-[var(--line)] px-4">
        {NATAL.map(n => (
          <li key={n.label} className="flex items-center justify-between py-3 text-[14px]">
            <span>{n.term === n.label ? <Term term={n.term} /> : <>{n.label}{n.term && <span className="ml-2 text-[12px]"><Term term={n.term} /></span>}</>}</span>
            <span className="text-[12px] text-[var(--ink-3)]">第 {phaseOf(n.engine)} 階段開放</span>
          </li>
        ))}
      </ul>

      <SectionTitle>目前運勢</SectionTitle>
      <div className="grid grid-cols-4 gap-2">
        {CURRENT.map(c => (
          <div key={c.label} className="card p-3 text-center">
            <p className="text-[12px] text-[var(--ink-3)]"><Term term={c.term} /></p>
            <p className="font-serif mt-1 text-[20px] text-[var(--ink-3)]">—</p>
          </div>
        ))}
      </div>

      <SectionTitle>常用功能</SectionTitle>
      <div className="grid grid-cols-3 gap-2">
        {FEATURES.map(f => (
          <div key={f.label} className="card flex flex-col items-center justify-center px-2 py-3 text-center opacity-60" aria-disabled>
            <span className="text-[14px]">{f.label}</span>
            <span className="mt-0.5 text-[11px] text-[var(--ink-3)]">第 {f.phase} 階段</span>
          </div>
        ))}
      </div>

      <SectionTitle>資料</SectionTitle>
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={() => setExp(true)}><Icon name="download" size={16} />匯出此人物</Button>
        <Link href={`/persons/edit/?id=${b.person.id}`}><Button block><Icon name="edit" size={16} />編輯／刪除</Button></Link>
      </div>
      <ExportSheet open={exp} onClose={() => setExp(false)} personIds={[b.person.id]} title={`匯出「${b.person.displayName}」`} />
    </main>
  );
}
