"use client";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "../../providers";
import { relationLabel, TIME_ACCURACY, type PersonBundle } from "@/core/person";
import { computeBaziTransit } from "@/core/bazi";
import { deviceTimeZone, todayIn, useNatal } from "@/ui/useAnalysis";
import { localOffset, formatOffset } from "@/core/calendar/tz";
import { setFavorite } from "@/data/repo";
import { Button, EmptyState, Icon, SectionTitle } from "@/ui/primitives";
import { Avatar } from "@/ui/Nav";
import { ExportSheet } from "@/ui/ExportSheet";
import { Term } from "@/ui/interpret";

export default function ViewPage() {
  return <Suspense><PersonView /></Suspense>;
}

const FEATURES = [
  { label: "今日運勢", href: "/" }, { label: "工作", href: "/domain/?d=career" }, { label: "財運", href: "/domain/?d=wealth" },
  { label: "投資", href: "/domain/?d=investment" }, { label: "出行", href: "/domain/?d=travel" }, { label: "擇時・事件", href: "/event/" },
  { label: "日期比較", href: "/compare/" }, { label: "人生時間軸", href: "/life/" }, { label: "完整命盤", href: "/chart/" },
];

function NatalSummary({ b, onGo }: { b: PersonBundle; onGo: (href: string) => void }) {
  const { natal } = useNatal(b);
  const [tz, setTz] = useState<string | null>(null);
  useEffect(() => setTz(deviceTimeZone()), []);
  const bz = natal?.bazi, zw = natal?.ziwei;
  const flow = useMemo(() => bz && tz ? computeBaziTransit(bz, { civilDate: todayIn(tz), civilTime: "12:00", timeZone: tz }) : null, [bz, tz]);
  const lifeMajor = zw ? zw.palaces[zw.lifeBranch].major.map(m => m.name + m.brightness).join("、") || "無主星（借對宮）" : null;
  return (
    <>
      <SectionTitle right={<Link href="/chart/" className="text-[var(--accent)]">完整命盤</Link>}>本命摘要</SectionTitle>
      {!bz ? <p className="text-[13px] text-[var(--ink-3)]">{natal?.unavailable.find(u => u.system === "bazi")?.reason ?? "計算中…"}</p> : (
        <dl className="card grid grid-cols-[6.5rem_1fr] gap-y-2 p-4 text-[14px]">
          <dt className="text-[var(--ink-3)]">八字四柱</dt><dd className="font-serif text-[16px]">{[bz.pillars.year, bz.pillars.month, bz.pillars.day, bz.pillars.hour].map(g => g ? g.text : "（時柱不詳）").join("　")}</dd>
          <dt className="text-[var(--ink-3)]"><Term term="日主" /></dt><dd>{bz.dmText}{bz.dmElement}・生於{bz.season.name}季</dd>
          <dt className="text-[var(--ink-3)]"><Term term="旺衰" /></dt><dd>{bz.strength.label}（{bz.strength.score} 分）</dd>
          <dt className="text-[var(--ink-3)]"><Term term="用神" /></dt><dd>用神 {bz.roles.用神}・喜神 {bz.roles.喜神}・忌神 {bz.roles.忌神}</dd>
          <dt className="text-[var(--ink-3)]"><Term term="格局" /></dt><dd>{bz.pattern.name}</dd>
          <dt className="text-[var(--ink-3)]"><Term term="命宮" /></dt><dd>{zw ? `${zw.palaces[zw.lifeBranch].gz}・${lifeMajor}・${zw.juName}` : "出生時辰不詳，紫微不排盤"}</dd>
        </dl>
      )}
      <SectionTitle>目前運勢</SectionTitle>
      <div className="grid grid-cols-4 gap-2">
        {([["大運", flow?.luck?.gz.text], ["流年", flow?.flows.year.gz.text], ["流月", flow?.flows.month.gz.text], ["流日", flow?.flows.day.gz.text]] as const).map(([l, v]) => (
          <div key={l} className="card p-3 text-center">
            <p className="text-[12px] text-[var(--ink-3)]"><Term term={l} /></p>
            <p className="font-serif mt-1 text-[20px]">{v ?? "—"}</p>
          </div>
        ))}
      </div>
      <SectionTitle>常用功能</SectionTitle>
      <div className="grid grid-cols-3 gap-2">
        {FEATURES.map(f => (
          <button key={f.label} onClick={() => onGo(f.href)} className="card flex items-center justify-center px-2 py-3 text-center text-[14px]">{f.label}</button>
        ))}
      </div>
    </>
  );
}

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

      <NatalSummary b={b} onGo={async href => { await setActive(b.person.id); router.push(href); }} />

      <SectionTitle>資料</SectionTitle>
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={() => setExp(true)}><Icon name="download" size={16} />匯出此人物</Button>
        <Link href={`/persons/edit/?id=${b.person.id}`}><Button block><Icon name="edit" size={16} />編輯／刪除</Button></Link>
      </div>
      <ExportSheet open={exp} onClose={() => setExp(false)} personIds={[b.person.id]} title={`匯出「${b.person.displayName}」`} />
    </main>
  );
}
