"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useApp } from "../providers";
import type { NatalSet } from "@/core/analysis";
import { BRANCHES, STEMS, STEM_ELEMENT, BRANCH_ELEMENT, type Element } from "@/core/calendar/ganzhi";
import { computeQimenChart, PALACE_DIR, PALACE_GUA, hourTimeOf, SHI_CHEN, SHI_RANGE } from "@/core/qimen";
import { castDaily, TRIGRAMS, type IchingReading } from "@/core/iching";
import type { ZhouyiHex } from "@/kb/sources";
import { getSourceText } from "@/kb/sources";
import { Banner, Chip, Field, PageHeader, SectionTitle } from "@/ui/primitives";
import { Busy } from "@/ui/analysis";
import { Term } from "@/ui/interpret";
import { PersonSwitcher } from "@/ui/Nav";
import { NoPersonBanner } from "@/ui/Scales";
import { deviceTimeZone, todayIn, useNatal } from "@/ui/useAnalysis";

type Tab = "bazi" | "ziwei" | "qimen" | "iching";
const TABS: { key: Tab; label: string }[] = [{ key: "bazi", label: "八字" }, { key: "ziwei", label: "紫微" }, { key: "qimen", label: "奇門" }, { key: "iching", label: "易經" }];
const EL_COLOR: Record<Element, string> = { 木: "var(--el-wood)", 火: "var(--el-fire)", 土: "var(--el-earth)", 金: "var(--el-metal)", 水: "var(--el-water)" };

export default function ChartPage() { return <Suspense><Chart /></Suspense>; }

function Chart() {
  const params = useSearchParams();
  const { active } = useApp();
  const [tab, setTab] = useState<Tab>((params.get("tab") as Tab) ?? "bazi");
  const [tz, setTz] = useState<string | null>(null);
  useEffect(() => setTz(deviceTimeZone()), []);
  const { natal } = useNatal(active);
  const date = params.get("date") ?? (tz ? todayIn(tz) : null);
  return (
    <main className="safe-top mx-auto max-w-lg px-4">
      <PageHeader title="命盤" subtitle="專業排盤：每一格都可對照規則與辭典" right={<PersonSwitcher />} />
      <div role="tablist" className="flex gap-2">{TABS.map(t => <Chip key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>{t.label}</Chip>)}</div>
      <div className="mt-4">
        {!active ? <NoPersonBanner /> : !natal || !tz || !date ? <Busy /> :
          tab === "bazi" ? <BaziChart n={natal} /> :
          tab === "ziwei" ? <ZiweiChart n={natal} /> :
          tab === "qimen" ? <QimenPanel n={natal} date={date} tz={tz} /> :
          <IchingPanel n={natal} date={date} />}
      </div>
    </main>
  );
}

function Unavailable({ n, sys }: { n: NatalSet; sys: string }) {
  const u = n.unavailable.find(x => x.system === sys);
  return <Banner tone="warn" title="無法排盤">{u?.reason ?? "資料不足"}</Banner>;
}

function BaziChart({ n }: { n: NatalSet }) {
  const b = n.bazi;
  if (!b) return <Unavailable n={n} sys="bazi" />;
  const order = [...b.details].reverse(); // 時日月年（由右而左的傳統排法改為左起時柱）
  return (
    <>
      <div className="card overflow-x-auto p-3">
        <table className="w-full text-center text-[13px]">
          <thead><tr className="text-[11px] text-[var(--ink-3)]"><th className="w-12" />{order.map(d => <th key={d.name} className="font-normal">{d.name}</th>)}</tr></thead>
          <tbody>
            <tr><td className="text-[11px] text-[var(--ink-3)]">十神</td>{order.map(d => <td key={d.name} className="text-[12px] text-[var(--ink-2)]">{d.stemTenGod}</td>)}</tr>
            <tr><td className="text-[11px] text-[var(--ink-3)]">天干</td>{order.map(d => <td key={d.name} className="font-serif text-[26px]" style={{ color: EL_COLOR[STEM_ELEMENT[d.gz.stem]] }}>{STEMS[d.gz.stem]}</td>)}</tr>
            <tr><td className="text-[11px] text-[var(--ink-3)]">地支</td>{order.map(d => <td key={d.name} className="font-serif text-[26px]" style={{ color: EL_COLOR[BRANCH_ELEMENT[d.gz.branch]] }}>{BRANCHES[d.gz.branch]}</td>)}</tr>
            <tr><td className="text-[11px] text-[var(--ink-3)]"><Term term="藏干" /></td>{order.map(d => <td key={d.name} className="text-[11px] leading-snug">{d.hidden.map(h => <span key={h.stem} className="block">{h.text}<span className="text-[var(--ink-3)]">{h.tenGod}</span></span>)}</td>)}</tr>
            <tr><td className="text-[11px] text-[var(--ink-3)]"><Term term="十二長生" /></td>{order.map(d => <td key={d.name} className="text-[12px]">{d.dmStage}</td>)}</tr>
            <tr><td className="text-[11px] text-[var(--ink-3)]">納音</td>{order.map(d => <td key={d.name} className="text-[11px] text-[var(--ink-3)]">{d.nayin}</td>)}</tr>
          </tbody>
        </table>
      </div>
      {b.warnings.length > 0 && <p className="mt-2 text-[12px] text-[var(--ink-3)]">{b.warnings.join(" ")}</p>}

      <SectionTitle>日主與旺衰</SectionTitle>
      <div className="card space-y-2 p-4 text-[14px] leading-relaxed">
        <p><Term term="日主" />{b.dmText}（{b.dmElement}），生於{b.season.name}季、日主於月令「{b.season.dmState}」。</p>
        <p><Term term="旺衰" />：<b>{b.strength.label}</b>（{b.strength.score} 分＝<Term term="得令" />{b.strength.deling}＋<Term term="得地" />{b.strength.dedi}＋<Term term="得勢" />{b.strength.deshi}）</p>
        <div className="space-y-1">
          {(Object.keys(b.elementPercent) as Element[]).map(e => (
            <div key={e} className="flex items-center gap-2 text-[12px]">
              <span className="w-4" style={{ color: EL_COLOR[e] }}>{e}</span>
              <span className="h-2 flex-1 rounded-full bg-[var(--surface-2)]"><span className="block h-2 rounded-full" style={{ width: `${b.elementPercent[e]}%`, background: EL_COLOR[e] }} /></span>
              <span className="num w-8 text-right text-[var(--ink-3)]">{b.elementPercent[e]}</span>
            </div>
          ))}
        </div>
      </div>

      <SectionTitle right={b.rolesMethod}>喜忌</SectionTitle>
      <div className="card p-4 text-[14px] leading-relaxed">
        <div className="grid grid-cols-5 gap-1 text-center">
          {(["用神", "喜神", "閒神", "仇神", "忌神"] as const).map(r => (
            <div key={r} className="inset py-2"><p className="text-[11px] text-[var(--ink-3)]"><Term term={r === "仇神" ? "忌神" : r} /></p><p className="font-serif text-[20px]" style={{ color: EL_COLOR[b.roles[r]] }}>{b.roles[r]}</p><p className="text-[10px] text-[var(--ink-3)]">{r}</p></div>
          ))}
        </div>
        <ul className="mt-3 space-y-1 text-[13px] text-[var(--ink-2)]">{b.rolesReasoning.map((t, i) => <li key={i}>・{t}</li>)}</ul>
        <p className="mt-2 text-[13px]"><Term term="格局" />：{b.pattern.name}<span className="block text-[12px] text-[var(--ink-3)]">{b.pattern.basis}</span></p>
        <p className="mt-1 text-[13px]"><Term term="調候" />：{b.tiaohou.basis}</p>
      </div>

      {b.relations.length > 0 && (
        <>
          <SectionTitle>刑沖合害</SectionTitle>
          <ul className="card flex flex-wrap gap-2 p-4 text-[13px]">{b.relations.map((r, i) => <li key={i} className="rounded-full bg-[var(--surface-2)] px-3 py-1">{r.type}：{r.members.join("、")}</li>)}</ul>
        </>
      )}

      <SectionTitle right={`${b.luck.forward ? "順" : "逆"}排`}><Term term="大運" /></SectionTitle>
      <div className="card p-4">
        <p className="text-[12px] leading-relaxed text-[var(--ink-3)]">{b.luck.basis}</p>
        <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto">
          {b.luck.cycles.map(c => {
            const y = new Date().getFullYear(), now = y >= c.startYear && y <= c.endYear;
            return (
              <div key={c.startYear} className={`inset min-w-[60px] p-2 text-center ${now ? "ring-1 ring-[var(--accent)]" : ""}`}>
                <p className="num text-[10px] text-[var(--ink-3)]">{Math.floor(c.startAge)}歲</p>
                <p className="font-serif text-[18px]">{c.gz.text}</p>
                <p className="text-[10px] text-[var(--ink-2)]">{c.tenGod}</p>
                <p className="text-[10px]" style={{ color: c.role === "用神" || c.role === "喜神" ? "var(--sig-pos)" : c.role === "忌神" || c.role === "仇神" ? "var(--sig-neg)" : "var(--ink-3)" }}>{c.role}</p>
                <p className="num text-[10px] text-[var(--ink-3)]">{c.startYear}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

const GRID: (number | null)[] = [5, 6, 7, 8, 4, null, null, 9, 3, null, null, 10, 2, 1, 0, 11];
const HUA_COLOR: Record<string, string> = { 祿: "var(--sig-pos)", 權: "var(--accent)", 科: "var(--el-water)", 忌: "var(--sig-neg)" };

function ZiweiChart({ n }: { n: NatalSet }) {
  const z = n.ziwei;
  const [sel, setSel] = useState<number | null>(null);
  if (!z) return <Unavailable n={n} sys="ziwei" />;
  const sf = sel === null ? [] : [sel, (sel + 6) % 12, (sel + 4) % 12, (sel + 8) % 12];
  return (
    <>
      <p className="mb-2 text-[12px] text-[var(--ink-3)]">點任一宮可高亮<Term term="三方四正" />。</p>
      <div className="grid grid-cols-4 gap-1">
        {GRID.map((br, i) => {
          if (br === null) {
            if (i !== 5) return null;
            return (
              <div key="c" className="card col-span-2 row-span-2 flex flex-col justify-center p-2 text-center text-[11px] leading-relaxed">
                <p className="font-serif text-[15px]">{z.juName}</p>
                <p className="text-[var(--ink-3)]">農曆 {z.lunar.year} 年{z.lunar.isLeap ? "閏" : ""}{z.lunar.month} 月 {z.lunar.day} 日・{BRANCHES[z.hourBranch]}時</p>
                <p>命宮在{BRANCHES[z.lifeBranch]}・身宮在{z.bodyPalace}</p>
                <p className="text-[var(--ink-3)]">生年四化：{(["祿", "權", "科", "忌"] as const).map(h => `${z.birthHua[h].star}化${h}`).join("、")}</p>
              </div>
            );
          }
          const p = z.palaces[br];
          const on = sf.includes(br);
          return (
            <button key={br} onClick={() => setSel(sel === br ? null : br)} className={`card min-h-[118px] p-1.5 text-left text-[10px] leading-tight ${on ? "ring-1 ring-[var(--accent)]" : ""} ${br === z.lifeBranch ? "bg-[var(--surface-2)]" : ""}`}>
              <div className="flex justify-between"><span className="font-serif text-[12px] text-[var(--accent)]">{p.name}</span><span className="text-[var(--ink-3)]">{p.gz}</span></div>
              <div className="mt-1 space-y-0.5">
                {p.major.map(s => <p key={s.name} className="text-[12px]">{s.name}<span className="text-[9px] text-[var(--ink-3)]">{s.brightness}</span>{s.hua && <span className="ml-0.5 rounded px-0.5 text-[9px]" style={{ color: HUA_COLOR[s.hua], border: `1px solid ${HUA_COLOR[s.hua]}` }}>{s.hua}</span>}</p>)}
                {p.major.length === 0 && <p className="text-[var(--ink-3)]">無主星</p>}
                <p className="text-[var(--ink-2)]">{p.minor.map(s => s.name + (s.hua ? `(${s.hua})` : "")).join(" ")}</p>
                {p.misc.length > 0 && <p className="text-[var(--ink-3)]">{p.misc.join(" ")}</p>}
              </div>
              <p className="num mt-1 text-[9px] text-[var(--ink-3)]">{p.decade[0]}–{p.decade[1]}</p>
            </button>
          );
        })}
      </div>
      {z.notes.length > 0 && <p className="mt-2 text-[12px] text-[var(--ink-3)]">{z.notes.join(" ")}</p>}
      <p className="mt-2 text-[11px] text-[var(--ink-3)]">亮度表來源：iztro 2.6.1（MIT）；四化以{n.input.school.ziwei.gengSihua}。</p>
    </>
  );
}

const QGRID = [4, 9, 2, 3, 5, 7, 8, 1, 6];

function QimenPanel({ n, date, tz }: { n: NatalSet; date: string; tz: string }) {
  const [d, setD] = useState(date);
  const nowHour = useMemo(() => { const h = Number(new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", hourCycle: "h23" }).format(new Date())); return Math.floor(((h + 1) % 24) / 2); }, [tz]);
  const [hi, setHi] = useState(nowHour);
  const c = useMemo(() => computeQimenChart(d, hourTimeOf(hi), tz), [d, hi, tz]);
  const nm = n.qimen?.nianMing;
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <Field label="日期"><input type="date" className="input" value={d} onChange={e => setD(e.target.value)} /></Field>
        <Field label="時辰"><select className="input" value={hi} onChange={e => setHi(Number(e.target.value))}>{SHI_CHEN.map((s, i) => <option key={s} value={i}>{s}時（{SHI_RANGE[i]}）</option>)}</select></Field>
      </div>
      <p className="mt-3 text-[13px] leading-relaxed">{c.term}{c.yuan}・{c.yang ? "陽" : "陰"}遁 {c.ju} 局・{c.pillars.year}年 {c.pillars.month}月 {c.pillars.day}日 {c.pillars.hour}時</p>
      <p className="text-[12px] text-[var(--ink-3)]">旬首 {c.xunHead}（{c.fuShou}）・<Term term="值符" />{c.zhiFu}落{PALACE_DIR[c.zhiFuPalace]}・<Term term="值使" />{c.zhiShi}落{PALACE_DIR[c.zhiShiPalace]}{nm ? `・年命 ${nm}` : ""}</p>
      <div className="mt-3 grid grid-cols-3 gap-1">
        {QGRID.map(p => {
          const kong = c.kong.some(k => ({ 1: [0], 8: [1, 2], 3: [3], 4: [4, 5], 9: [6], 2: [7, 8], 7: [9], 6: [10, 11], 5: [] } as Record<number, number[]>)[p].includes(k));
          const mine = nm && (c.sky[p] ?? "").split("/").includes(nm);
          return (
            <div key={p} className={`card min-h-[104px] p-1.5 text-[11px] leading-snug ${mine ? "ring-1 ring-[var(--accent)]" : ""}`}>
              <div className="flex justify-between text-[10px] text-[var(--ink-3)]"><span>{PALACE_GUA[p]}{p}・{PALACE_DIR[p]}</span><span>{kong ? "空" : ""}{c.yimaPalace === p ? "馬" : ""}</span></div>
              {p === 5 ? <p className="mt-2 text-center text-[var(--ink-3)]">中五寄坤<br />地盤 {c.ground[5]}</p> : (
                <div className="mt-1 space-y-0.5">
                  <p className="text-[var(--ink-2)]">{c.gods[p]}</p>
                  <p>{c.stars[p]}</p>
                  <p className="text-[13px]" style={{ color: ["開門", "休門", "生門"].includes(c.doors[p]) ? "var(--sig-pos)" : ["死門", "驚門", "傷門"].includes(c.doors[p]) ? "var(--sig-neg)" : "var(--ink-1)" }}>{c.doors[p]}</p>
                  <p className="font-serif">{c.sky[p]}<span className="text-[var(--ink-3)]">／{c.ground[p]}</span></p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-[var(--ink-3)]">時家轉盤・拆補法（精確節氣定局、符頭定元）；外框為你的年命所在宮。天盤／地盤干以「／」分隔；空＝<Term term="空亡" />、馬＝<Term term="驛馬" />。</p>
    </>
  );
}

function HexLines({ h, moving }: { h: ZhouyiHex; moving?: number }) {
  return (
    <div className="flex flex-col-reverse gap-1" aria-label={h.full}>
      {h.bits.split("").map((b, i) => (
        <div key={i} className="flex h-2 w-16 gap-2">
          {b === "1" ? <span className="flex-1 rounded-sm" style={{ background: moving === i + 1 ? "var(--accent)" : "var(--ink-1)" }} />
            : <><span className="flex-1 rounded-sm" style={{ background: moving === i + 1 ? "var(--accent)" : "var(--ink-1)" }} /><span className="flex-1 rounded-sm" style={{ background: moving === i + 1 ? "var(--accent)" : "var(--ink-1)" }} /></>}
        </div>
      ))}
    </div>
  );
}

function IchingPanel({ n, date }: { n: NatalSet; date: string }) {
  const [d, setD] = useState(date);
  const r: IchingReading | null = useMemo(() => n.iching ? castDaily(d, n.iching.personalNo, n.iching.basis) : null, [n, d]);
  if (!r) return <Unavailable n={n} sys="iching" />;
  const T = (id: string) => getSourceText(id)?.text ?? "";
  return (
    <>
      <Field label="日期"><input type="date" className="input" value={d} onChange={e => setD(e.target.value)} /></Field>
      <div className="card mt-3 grid grid-cols-3 gap-2 p-4 text-center">
        {([["本卦", r.main, r.moving], ["互卦", r.mutual, undefined], ["變卦", r.changed, undefined]] as const).map(([l, h, m]) => (
          <div key={l} className="flex flex-col items-center gap-1.5">
            <span className="text-[11px] text-[var(--ink-3)]"><Term term={l} /></span>
            <HexLines h={h} moving={m} />
            <span className="font-serif text-[14px]">{h.full}</span>
          </div>
        ))}
      </div>
      <div className="card mt-3 space-y-1 p-4 text-[13px] leading-relaxed">
        {r.derivation.map((t, i) => <p key={i} className="text-[var(--ink-3)]">{t}</p>)}
        <p><Term term="體卦" />{r.ti.name}（{r.ti.element}，{r.ti.where}）・<Term term="用卦" />{r.yong.name}（{r.yong.element}）→ <b>{r.relation}</b>；變卦之用對體：{r.outcome}；{r.mutualRel.text}</p>
      </div>
      <SectionTitle right="《周易》">卦辭與爻辭</SectionTitle>
      <div className="card space-y-2 p-4 text-[14px] leading-relaxed">
        <p className="font-serif text-[var(--accent)]">{T(r.main.textIds.gua)}</p>
        <p className="text-[13px] text-[var(--ink-2)]"><span className="text-[var(--ink-3)]">彖曰｜</span>{T(r.main.textIds.tuan)}</p>
        <p className="text-[13px] text-[var(--ink-2)]"><span className="text-[var(--ink-3)]">象曰｜</span>{T(r.main.textIds.daxiang)}</p>
        <ol className="mt-2 flex flex-col-reverse gap-1">
          {r.main.textIds.yao.slice(0, 6).map((id, i) => (
            <li key={id} className={`rounded-lg px-2 py-1 font-serif ${i + 1 === r.moving ? "bg-[var(--accent)]/15 text-[var(--accent)]" : ""}`}>{T(id)}<span className="block font-sans text-[11px] text-[var(--ink-3)]">{T(r.main.textIds.xiaoxiang[i])}</span></li>
          ))}
        </ol>
        <p className="text-[13px] text-[var(--ink-2)]"><span className="text-[var(--ink-3)]">變卦卦辭｜</span>{T(r.changed.textIds.gua)}</p>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-[var(--ink-3)]">原文為機器匯入（附勘誤表），尚未人工逐字校勘。<Link href="/sources/" className="text-[var(--accent)]">來源與勘誤 →</Link>　八卦：{Object.values(TRIGRAMS).map(t => t.symbol + t.name).join(" ")}</p>
      <p className="mt-1 text-[11px] text-[var(--ink-3)]">想問一件特定的事？用 <Link href="/divination/" className="text-[var(--accent)]">占卜模式</Link>（隨機起卦，另行標示、不入分數）。</p>
    </>
  );
}
