"use client";
import { useEffect, useState } from "react";
import { getProfiles, getHistory, saveHistory, uid } from "@/lib/storage/store";
import { computeFortune } from "@/engines/scoring";
import { templateExplain } from "@/ai/explanation-generator";
import { INVESTMENT_DISCLAIMER } from "@/ai/prompt-builder";
import { ScoreCards, ActionList } from "@/components/fortune/ScoreCards";
import type { FortuneResult, Scores, Topic } from "@/types/fortune";
import { computeDailyReport } from "@/engines/daily";
import { CATEGORY_META } from "@/engines/daily/advice";
import { gradeOf } from "@/engines/daily/grade";
import { DailyReportView, fmtDate, shiftDate } from "@/components/daily/DailyReportView";
import { GradeBadge, toneClass } from "@/components/daily/ui";
import type { CategoryKey } from "@/types/daily";
import type { Profile } from "@/types/profile";

type Mode = "daily" | "monthly" | "yearly";
const TOPICS: { v: Topic; t: string }[] = [
  { v: "overall", t: "總運" }, { v: "career", t: "工作" }, { v: "wealth", t: "投資" },
  { v: "travel", t: "旅遊" }, { v: "decision", t: "重大決策" },
];
const INTENTS = ["加碼", "減碼", "觀望", "停利", "停損", "長期布局"];
const SPANS: Record<Mode, number[]> = { daily: [7, 14, 30], monthly: [3, 6, 12], yearly: [3, 5, 10] };
const pad = (n: number) => String(n).padStart(2, "0");

function topicKey(t: Topic): keyof Scores {
  return t === "wealth" ? "wealth" : t === "career" ? "career" : t === "decision" ? "decision" : "overall";
}

// 依模式與起始日，產生連續區間的查詢字串
function periodList(mode: Mode, start: string, span: number) {
  const [y, m, d] = start.split("-").map(Number);
  const out: { date: string; label: string }[] = [];
  for (let i = 0; i < span; i++) {
    if (mode === "daily") {
      const dt = new Date(y, m - 1, d + i);
      out.push({ date: `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`, label: `${dt.getMonth() + 1}/${dt.getDate()}` });
    } else if (mode === "monthly") {
      const dt = new Date(y, m - 1 + i, 1);
      out.push({ date: `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}`, label: `${dt.getFullYear()}/${pad(dt.getMonth() + 1)}` });
    } else {
      out.push({ date: `${y + i}`, label: `${y + i}` });
    }
  }
  return out;
}

type ScanRow = { date: string; label: string; overall: number; topical: number };

export default function QueryPage() {
  const [today, setToday] = useState("");
  const [mode, setMode] = useState<Mode>("daily");
  const [dailyMode, setDailyMode] = useState<"report" | "scan">("report");
  const [date, setDate] = useState("");
  useEffect(() => { const t = fmtDate(new Date()); setToday(t); setDate(t); }, []);
  const [topic, setTopic] = useState<Topic>("overall");
  const [intent, setIntent] = useState("觀望");
  const [scan, setScan] = useState(false);
  const [span, setSpan] = useState(6);
  const [rows, setRows] = useState<ScanRow[]>([]);
  const [r, setR] = useState<FortuneResult | null>(null);
  const [text, setText] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const [err, setErr] = useState("");

  const periodDate = mode === "monthly" ? date.slice(0, 7) : mode === "yearly" ? date.slice(0, 4) : date;

  const runOne = (qDate: string) => {
    setErr("");
    const p = getProfiles()[0];
    if (!p) { setErr("尚無命盤，請先至「命盤」建立。"); return; }
    try {
      const res = computeFortune(p, { type: mode, date: qDate, topic });
      setR(res);
      setText(templateExplain(res, topic === "wealth"));
      const h = getHistory();
      h.unshift({
        id: uid(), queriedAt: new Date().toISOString(), queryType: mode,
        topic: topic === "wealth" ? `投資(${intent})` : TOPICS.find(t => t.v === topic)?.t ?? topic,
        targetDate: qDate, scores: res.scores, aiSummary: res.summary,
        feedback: { accuracy: null, actualResult: "", feedbackAt: null },
      });
      saveHistory(h);
    } catch { setErr("計算失敗，請檢查命盤資料。"); }
  };

  const runScan = () => {
    setErr(""); setR(null); setText("");
    const p = getProfiles()[0];
    if (!p) { setErr("尚無命盤，請先至「命盤」建立。"); return; }
    const key = topicKey(topic);
    try {
      const list = periodList(mode, date, span);
      setRows(list.map(({ date: dd, label }) => {
        const res = computeFortune(p, { type: mode, date: dd, topic });
        return { date: dd, label, overall: res.scores.overall, topical: res.scores[key] };
      }));
    } catch { setErr("掃描失敗，請檢查命盤資料。"); }
  };

  const run = () => { if (scan) runScan(); else runOne(periodDate); };

  const askAI = async () => {
    if (!r) return;
    setAiBusy(true);
    try {
      const res = await fetch("/api/ai", { method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ fortuneResult: r, topic }) });
      const d = await res.json();
      if (!res.ok) { setErr(d.error ?? "AI 暫不可用，已顯示本機模板。"); return; }
      setText([d.summary, topic === "wealth" ? d.wealthAdvice : topic === "career" ? d.careerAdvice : d.practicalStrategy, d.riskWarning, d.disclaimer].filter(Boolean).join("\n\n"));
    } catch { setErr("AI 連線失敗，已顯示本機模板。"); }
    finally { setAiBusy(false); }
  };

  const tab = (v: string, cur: string, set: () => void, label: string) => (
    <button key={v} onClick={set}
      className={`rounded-full px-3 py-1.5 text-sm ${cur === v ? "bg-[var(--gold)] text-black" : "border border-white/15 text-[var(--ink-dim)]"}`}>
      {label}
    </button>
  );

  const topicLabel = TOPICS.find(t => t.v === topic)?.t ?? "";
  const best = rows.length ? rows.reduce((a, b) => (b.topical > a.topical ? b : a)) : null;
  const worst = rows.length ? rows.reduce((a, b) => (b.topical < a.topical ? b : a)) : null;
  const onPickMode = (m: Mode) => { setMode(m); setSpan(SPANS[m][1]); setRows([]); setR(null); };

  return (
    <main className="mx-auto max-w-md px-4 pb-6 pt-[calc(env(safe-area-inset-top)+20px)]">
      <h1 className="font-serif-tc text-2xl font-semibold">查詢</h1>
      <p className="mt-1 text-[13px] text-[var(--ink-dim)]">看任一天的完整運勢，或在一段期間裡找出最適合的日子。</p>

      {/* 模式 */}
      <div className="mt-4 flex gap-2">{(["daily","monthly","yearly"] as Mode[]).map(m =>
        tab(m, mode, () => onPickMode(m), m === "daily" ? "日" : m === "monthly" ? "月" : "年"))}</div>

      {mode === "daily" ? (
        <div className="mt-3">
          <div className="flex gap-2">
            {tab("report", dailyMode, () => setDailyMode("report"), "單日完整報告")}
            {tab("scan", dailyMode, () => setDailyMode("scan"), "找好日子")}
          </div>
          {today && <DailyQuery view={dailyMode} today={today} onOpenDay={() => setDailyMode("report")} />}
        </div>
      ) : (<>
      {/* 主題 */}
      <div className="mt-3 flex flex-wrap gap-2">{TOPICS.map(t => tab(t.v, topic, () => setTopic(t.v), t.t))}</div>

      {/* 單點 / 區間切換 */}
      <div className="mt-3 flex gap-2">
        {tab("one", scan ? "" : "one", () => setScan(false), "單點")}
        {tab("scan", scan ? "scan" : "", () => setScan(true), "區間掃描")}
      </div>

      {/* 起始時間（隨模式切換控件） */}
      <div className="mt-3 flex gap-2">
        {mode === "monthly" && (
          <input type="month" className="flex-1 rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm"
            value={date.slice(0, 7)} onChange={e => e.target.value && setDate(e.target.value + "-15")} />
        )}
        {mode === "yearly" && (
          <input type="number" min={1900} max={2100} className="flex-1 rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm"
            value={date.slice(0, 4)} onChange={e => e.target.value && setDate(`${e.target.value}-06-15`)} />
        )}
        <button onClick={run} className="rounded-lg bg-[var(--gold)] px-5 text-sm font-medium text-black">
          {scan ? "掃描" : "查詢"}
        </button>
      </div>

      {/* 區間長度 */}
      {scan && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-[var(--ink-dim)]">區間長度</span>
          {SPANS[mode].map(n => tab(String(n), String(span), () => setSpan(n),
            mode === "monthly" ? `${n} 個月` : `${n} 年`))}
        </div>
      )}

      {/* 投資模式 */}
      {topic === "wealth" && (
        <div className="mt-3 rounded-xl border border-[var(--gold)]/40 bg-[var(--panel)] p-4">
          <p className="text-xs text-[var(--gold)]">投資模式・動作意圖</p>
          <div className="mt-2 flex flex-wrap gap-2">{INTENTS.map(i => tab(i, intent, () => setIntent(i), i))}</div>
          <p className="mt-3 text-xs text-[var(--ink-dim)]">下單前風控檢查：</p>
          <ul className="mt-1 space-y-1 text-xs text-[var(--ink-dim)]">
            <li>☐ 已設定停損價位</li><li>☐ 部位未超過上限</li><li>☐ 未使用超出計畫的槓桿</li><li>☐ 目前不在情緒高點</li>
          </ul>
        </div>
      )}

      {err && <p className="mt-3 text-sm text-[var(--vermilion)]">{err}</p>}

      {/* 區間掃描結果 */}
      {scan && rows.length > 0 && (
        <section className="mt-4">
          <div className="rounded-xl border border-white/10 bg-[var(--panel)] p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm">{topicLabel}趨勢（點任一列看細節）</p>
              <p className="text-[11px] text-[var(--ink-dim)]">分數越高越順</p>
            </div>
            <div className="mt-3 space-y-1.5">
              {rows.map(row => (
                <button key={row.date} onClick={() => { setScan(false); setMode(mode); runOne(row.date); }}
                  className="flex w-full items-center gap-2 text-left">
                  <span className={`w-16 shrink-0 text-xs ${row === best ? "text-[var(--jade)]" : row === worst ? "text-[var(--vermilion)]" : "text-[var(--ink-dim)]"}`}>{row.label}</span>
                  <span className="h-3 flex-1 rounded bg-black/40">
                    <span className="block h-3 rounded" style={{ width: `${row.topical}%`, background: row === best ? "var(--jade)" : row === worst ? "var(--vermilion)" : "var(--gold)" }} />
                  </span>
                  <span className="w-8 shrink-0 text-right text-xs">{row.topical}</span>
                </button>
              ))}
            </div>
          </div>
          {best && worst && (
            <p className="mt-3 text-sm leading-relaxed">
              此區間{topicLabel}較佳：<span className="text-[var(--jade)]">{best.label}（{best.topical}）</span>；
              較需保守：<span className="text-[var(--vermilion)]">{worst.label}（{worst.topical}）</span>。
            </p>
          )}
          <p className="mt-2 text-[11px] leading-relaxed text-[var(--ink-dim)]">
            {topic === "wealth"
              ? "趨勢僅為個人運勢相對高低，與市場行情無因果關係，不構成買賣建議。"
              : "趨勢僅供個人時點安排參考，不構成醫療、法律或重大決策建議。"}
          </p>
        </section>
      )}

      {/* 單點詳細結果 */}
      {!scan && r && (
        <section className="mt-4 space-y-3">
          <ScoreCards s={r.scores} />
          <ActionList title="適合" items={r.suitableActions} tone="good" />
          <ActionList title="避免" items={r.avoidActions} tone="bad" />
          <div className="rounded-xl border border-white/10 bg-[var(--panel)] p-4 text-sm leading-relaxed whitespace-pre-line">{text}</div>
          <div className="flex items-center justify-between">
            <p className="text-xs leading-relaxed text-[var(--ink-dim)]">查詢：{r.targetDate}<br />吉方 {r.bestDirection}<br />吉時 {r.bestTimeRange}</p>
            <button onClick={askAI} disabled={aiBusy} className="rounded-lg border border-white/20 px-3 py-1.5 text-xs disabled:opacity-50">
              {aiBusy ? "AI 解讀中…" : "AI 白話解讀"}
            </button>
          </div>
          <p className="text-[11px] leading-relaxed text-[var(--ink-dim)]">
            {topic === "wealth" ? INVESTMENT_DISCLAIMER : r.disclaimer}
          </p>
        </section>
      )}
      </>)}
    </main>
  );
}

const SCAN_SPANS = [7, 14, 30, 60];
const PURPOSES: { k: CategoryKey; hint: string }[] = [
  { k: "overall", hint: "綜合" }, { k: "career", hint: "簡報、提案、面談" }, { k: "wealth", hint: "理財、簽約、檢視部位" },
  { k: "love", hint: "約會、家庭聚會" }, { k: "health", hint: "看診、運動、休養" }, { k: "social", hint: "拜訪、請託、聚會" },
  { k: "travel", hint: "旅遊、出差、搬家" }, { k: "study", hint: "考試、寫報告" },
];

function DailyQuery({ view, today, onOpenDay }: { view: "report" | "scan"; today: string; onOpenDay: () => void }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [date, setDate] = useState(today);
  const [cat, setCat] = useState<CategoryKey>("overall");
  const [span, setSpan] = useState(30);
  const [start, setStart] = useState(today);
  const [rows, setRows] = useState<{ date: string; label: string; score: number; note: string }[]>([]);
  useEffect(() => { const p = getProfiles()[0]; setProfile(p && p.birthDate ? p : null); }, []);

  if (!profile) return <p className="mt-6 text-sm text-[var(--ink-dim)]">尚無命盤，請先至「命盤」建立。</p>;

  const scan = () => {
    const out = Array.from({ length: span }, (_, i) => {
      const ds = shiftDate(start, i);
      const r = computeDailyReport(profile, ds);
      const c = cat === "overall" ? r.overall : r.categories.find(x => x.key === cat)!;
      const [, m, d] = ds.split("-").map(Number);
      return { date: ds, label: `${m}/${d} 週${r.weekday}`, score: c.score, note: c.headline };
    });
    setRows(out);
  };
  const top = rows.slice().sort((a, b) => b.score - a.score).slice(0, 3);

  if (view === "report") return (
    <div className="mt-4"><DailyReportView profile={profile} date={date} onDateChange={setDate} today={today} /></div>
  );

  return (
    <div className="mt-4 space-y-3">
      <div className="card p-4">
        <p className="text-[12px] text-[var(--ink-dim)]">想做什麼事？</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {PURPOSES.map(pp => (
            <button key={pp.k} onClick={() => setCat(pp.k)}
              className={`rounded-xl px-3 py-2 text-left ${cat === pp.k ? "bg-[var(--gold)] text-black" : "bg-white/[0.04]"}`}>
              <p className="text-[13px] font-medium">{CATEGORY_META[pp.k].label}</p>
              <p className={`text-[11px] ${cat === pp.k ? "text-black/70" : "text-[var(--ink-dim)]"}`}>{pp.hint}</p>
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <input type="date" value={start} onChange={e => e.target.value && setStart(e.target.value)}
            className="flex-1 rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm" aria-label="起始日" />
          <select value={span} onChange={e => setSpan(Number(e.target.value))} className="rounded-lg border border-white/15 bg-black/30 px-2 py-2 text-sm" aria-label="天數">
            {SCAN_SPANS.map(n => <option key={n} value={n}>{n} 天</option>)}
          </select>
        </div>
        <button onClick={scan} className="mt-3 w-full rounded-xl bg-[var(--gold)] py-3 text-[15px] font-medium text-black">幫我找好日子</button>
      </div>

      {rows.length > 0 && (
        <>
          <div className="card p-4">
            <p className="font-serif-tc text-base font-semibold">最推薦的三天</p>
            <ol className="mt-2 space-y-2">
              {top.map((t, i) => {
                const g = gradeOf(t.score);
                return (
                  <li key={t.date}>
                    <button onClick={() => { setDate(t.date); onOpenDay(); }} className={`${toneClass(g)} w-full rounded-xl bg-white/[0.04] p-3 text-left`}>
                      <div className="flex items-center gap-2">
                        <span className="font-serif-tc text-lg" style={{ color: "var(--tone)" }}>{"一二三"[i]}</span>
                        <span className="text-sm">{t.date}（{t.label.split(" ")[1]}）</span>
                        <span className="ml-auto text-lg font-light tabular-nums">{t.score}</span>
                        <GradeBadge g={g} small />
                      </div>
                      <p className="mt-1 line-clamp-2 text-[12px] text-[var(--ink-2)]">{t.note}</p>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
          <div className="card p-4">
            <p className="text-[12px] text-[var(--ink-dim)]">{CATEGORY_META[cat].label}・逐日分數（點任一天看完整報告）</p>
            <div className="mt-3 space-y-1.5">
              {rows.map(row => {
                const g = gradeOf(row.score);
                return (
                  <button key={row.date} onClick={() => { setDate(row.date); onOpenDay(); }}
                    className={`${toneClass(g)} flex w-full items-center gap-2 text-left`} aria-label={`${row.label} ${row.score} 分 ${g.name}`}>
                    <span className={`w-20 shrink-0 text-[12px] ${row.date === today ? "text-[var(--gold)]" : "text-[var(--ink-2)]"}`}>{row.label}</span>
                    <span className="h-3 flex-1 rounded bg-white/[0.05]">
                      <span className="block h-3 rounded" style={{ width: `${row.score}%`, background: "var(--tone)" }} />
                    </span>
                    <span className="w-7 shrink-0 text-right text-[12px] tabular-nums">{row.score}</span>
                    <span className="w-9 shrink-0 text-[11px]" style={{ color: "var(--tone)" }}>{g.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
      <p className="px-1 text-[11px] leading-relaxed text-[var(--ink-dim)]">擇日結果為命理傾向參考；投資不構成買賣建議，請依自身紀律執行。</p>
    </div>
  );
}
