"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getProfiles, getStrategies, saveStrategies, getQuantLog, saveQuantLog, uid, type QuantLogEntry } from "@/lib/storage/store";
import { quantState, type QuantState } from "@/engines/scoring";

const pad = (n: number) => String(n).padStart(2, "0");
const URGE_COLOR: Record<string, string> = { 低: "var(--jade)", 中: "var(--gold)", 高: "var(--vermilion)" };

type Scenario = { key: string; title: string; intro: string; checklist: string[]; verdict: string };

const SCENARIOS: Scenario[] = [
  {
    key: "mdd",
    title: "創新高後回撤（MDD 焦慮）",
    intro: "回撤是策略報酬分布的一部分。新高後回落不代表策略失效——只要當前回撤仍在你回測的最大 MDD 容忍範圍內，規則就是「繼續執行」。痛苦時最常犯的錯，是加碼攤平或乾脆關掉策略。",
    checklist: ["目前回撤幅度 < 回測最大 MDD", "沒有為了『賺回來』而加碼攤平", "沒有想手動關閉／暫停策略", "部位仍在事前計畫的上限內", "沒有把單日波動當成策略失效的證據"],
    verdict: "策略的數學期望值不會因為你今天的情緒或運勢而改變。回撤期最該做的事是『什麼都不改』，讓策略跑完它的分布。",
  },
  {
    key: "fomo",
    title: "錯過 / FOMO 想追",
    intro: "錯過個別訊號，是分散與紀律的必然成本，不是錯誤。事後看到大漲就追，是用情緒取代系統——這種『報復性追單』長期會吃掉你的期望值。",
    checklist: ["這是系統發出的進場訊號，不是我看盤手癢", "若要進，完全符合既定進場規則", "不是在報復『剛剛錯過』的懊悔", "追進後的停損與部位一樣照規則"],
    verdict: "沒有訊號就沒有部位。錯過的那一筆，本來就不屬於你的系統；追它等於開一個沒有規則的新策略。",
  },
  {
    key: "follow",
    title: "要不要跟這個訊號？",
    intro: "量化的統計優勢，建立在『每一個訊號都執行』。選擇性執行＝親手破壞期望值。所以這題的答案幾乎永遠是「跟」。",
    checklist: ["訊號符合策略定義（非雜訊、非我主觀加的條件）", "唯一可不跟的情況：系統本身的風控規則（如總回撤熔斷）已觸發", "我想不跟的理由，是規則還是情緒？", "若不跟，我有事先寫好的書面例外規則嗎"],
    verdict: "跟。除非是你『系統內』的風控條件叫你停，否則任何『這次我覺得不一樣』都是凌駕系統。",
  },
];

export default function QuantPage() {
  const [date, setDate] = useState("");
  const [strategies, setStrategies] = useState<string[]>([]);
  const [strategy, setStrategy] = useState("");
  const [newStrat, setNewStrat] = useState("");
  const [st, setSt] = useState<QuantState | null>(null);
  const [err, setErr] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [log, setLog] = useState<QuantLogEntry[]>([]);

  useEffect(() => {
    const now = new Date();
    setDate(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`);
    const s = getStrategies(); setStrategies(s); setStrategy(s[0] ?? "");
    setLog(getQuantLog());
  }, []);

  const run = () => {
    setErr("");
    if (!date) return;
    const p = getProfiles()[0];
    if (!p || !p.birthDate) { setErr("尚無命盤，請先到「命盤」建立出生資料。"); return; }
    try { setSt(quantState(p, date)); } catch { setErr("計算失敗，請檢查命盤資料。"); }
  };

  const addStrategy = () => {
    const n = newStrat.trim(); if (!n || strategies.includes(n)) return;
    const next = [...strategies, n]; setStrategies(next); saveStrategies(next); setStrategy(n); setNewStrat("");
  };

  const logAction = (action: QuantLogEntry["action"], scenario?: string) => {
    const entry: QuantLogEntry = {
      id: uid(), date: st?.date ?? date, strategy: strategy || "（未指定）", action, scenario,
      disciplineRisk: st?.disciplineRisk ?? -1, note: "", loggedAt: new Date().toISOString(),
    };
    const next = [entry, ...log]; setLog(next); saveQuantLog(next);
  };

  const rated = log.filter(l => l.action === "依規則執行" || l.action === "手動干預");
  const disciplined = rated.filter(l => l.action === "依規則執行").length;
  const chip = (v: string, cur: string, set: () => void) => (
    <button key={v} onClick={set}
      className={`rounded-full px-3 py-1.5 text-sm ${cur === v ? "bg-[var(--gold)] text-black" : "border border-white/15 text-[var(--ink-dim)]"}`}>{v}</button>
  );

  return (
    <main className="mx-auto max-w-md px-5 pb-16 pt-10">
      <Link href="/" className="text-sm text-[var(--ink-dim)]">← 返回</Link>
      <h1 className="mt-3 text-2xl font-semibold">量化策略運勢專區</h1>

      {/* 鐵律橫幅 */}
      <div className="mt-3 rounded-xl border border-[var(--gold)]/40 bg-[var(--panel)] p-4">
        <p className="text-xs leading-relaxed text-[var(--ink-dim)]">
          <span className="text-[var(--gold)]">本專區評估的是「你今天的決策狀態與破紀律風險」，不預測 00981A 或大盤漲跌。</span>
          量化的優勢來自「每個訊號都照做」；任何手動凌駕（包含依運勢）都會破壞策略期望值。所以這裡的最高建議永遠是：<span className="text-[var(--jade)]">訊號照做，勿手動干預。</span>
        </p>
      </div>

      {/* 策略選擇 */}
      <div className="mt-4 flex flex-wrap gap-2">{strategies.map(s => chip(s, strategy, () => setStrategy(s)))}</div>
      <div className="mt-2 flex gap-2">
        <input className="flex-1 rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm" placeholder="新增策略名稱"
          value={newStrat} onChange={e => setNewStrat(e.target.value)} />
        <button onClick={addStrategy} className="rounded-lg border border-white/20 px-4 text-sm">加入</button>
      </div>

      {/* 日期與評估 */}
      <div className="mt-3 flex gap-2">
        <input type="date" className="flex-1 rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm" value={date} onChange={e => e.target.value && setDate(e.target.value)} />
        <button onClick={run} className="rounded-lg bg-[var(--gold)] px-5 text-sm font-medium text-black">評估今日狀態</button>
      </div>
      {err && <p className="mt-3 text-sm text-[var(--vermilion)]">{err}</p>}

      {st && (
        <section className="mt-4 space-y-3">
          {/* 行為向度卡 */}
          <div className="rounded-2xl border border-white/10 bg-[var(--panel)] p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm">{st.date}・決策狀態</p>
              <span className="rounded-full px-3 py-1 text-xs" style={{ background: URGE_COLOR[st.overrideUrge] + "22", color: URGE_COLOR[st.overrideUrge] }}>
                凌駕系統傾向：{st.overrideUrge}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-center">
              {[["判斷清明", st.clarity], ["情緒穩定", st.stability], ["執行力", st.execution]].map(([k, v]) => (
                <div key={k as string} className="rounded-xl border border-white/10 p-3">
                  <p className="text-[11px] text-[var(--ink-dim)]">{k}</p><p className="text-2xl font-light">{v}</p>
                </div>
              ))}
              <div className="rounded-xl border border-white/10 p-3">
                <p className="text-[11px] text-[var(--ink-dim)]">破紀律風險</p>
                <p className="text-2xl font-light" style={{ color: st.disciplineRisk >= 60 ? "var(--vermilion)" : "var(--jade)" }}>{st.disciplineRisk}</p>
              </div>
            </div>
          </div>

          {st.flags.length > 0 && (
            <div className="rounded-xl border border-white/10 bg-[var(--panel)] p-4">
              <p className="text-xs text-[var(--gold)]">今日提醒</p>
              <ul className="mt-2 space-y-2 text-sm leading-relaxed">{st.flags.map((f, i) => <li key={i}>・{f}</li>)}</ul>
            </div>
          )}

          {/* 紀律日誌快速記錄 */}
          <div className="rounded-xl border border-white/10 bg-[var(--panel)] p-4">
            <p className="text-xs text-[var(--ink-dim)]">今日我的決定（記錄下來，長期看自律率）</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button onClick={() => logAction("依規則執行")} className="rounded-full bg-[var(--jade)]/20 px-3 py-1.5 text-xs text-[var(--jade)]">依規則執行</button>
              <button onClick={() => logAction("手動干預")} className="rounded-full bg-[var(--vermilion)]/20 px-3 py-1.5 text-xs text-[var(--vermilion)]">手動干預了</button>
              <button onClick={() => logAction("錯過未跟")} className="rounded-full border border-white/15 px-3 py-1.5 text-xs">錯過未跟</button>
              <button onClick={() => logAction("暫停觀望")} className="rounded-full border border-white/15 px-3 py-1.5 text-xs">暫停觀望</button>
            </div>
          </div>
        </section>
      )}

      {/* 情境決策助手 */}
      <section className="mt-5">
        <p className="text-sm text-[var(--ink-dim)]">情境決策助手</p>
        <div className="mt-2 space-y-2">
          {SCENARIOS.map(sc => (
            <div key={sc.key} className="rounded-xl border border-white/10 bg-[var(--panel)]">
              <button onClick={() => setOpen(open === sc.key ? null : sc.key)} className="flex w-full items-center justify-between p-4 text-left">
                <span className="text-sm">{sc.title}</span>
                <span className="text-[var(--ink-dim)]">{open === sc.key ? "−" : "+"}</span>
              </button>
              {open === sc.key && (
                <div className="space-y-3 px-4 pb-4">
                  <p className="text-sm leading-relaxed text-[var(--ink-dim)]">{sc.intro}</p>
                  <div>
                    <p className="text-xs text-[var(--gold)]">行為檢查清單</p>
                    <ul className="mt-1 space-y-1 text-sm text-[var(--ink-dim)]">{sc.checklist.map((c, i) => <li key={i}>☐ {c}</li>)}</ul>
                  </div>
                  <p className="rounded-lg bg-black/30 p-3 text-sm leading-relaxed text-[var(--jade)]">{sc.verdict}</p>
                  {st && (
                    <p className="text-xs text-[var(--ink-dim)]">
                      參考你今日狀態：破紀律風險 {st.disciplineRisk}、凌駕傾向 {st.overrideUrge}。
                      {st.overrideUrge === "高" ? "今天尤其要把『不動』當成正確答案。" : "維持平常的紀律即可。"}
                    </p>
                  )}
                  <button onClick={() => logAction("依規則執行", sc.title)} className="text-xs text-[var(--jade)]">✓ 我決定照規則做，記一筆</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 自律率與近期日誌 */}
      {log.length > 0 && (
        <section className="mt-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--ink-dim)]">紀律日誌</p>
            {rated.length > 0 && <p className="text-xs">自律率 <span className="text-[var(--jade)]">{Math.round((disciplined / rated.length) * 100)}%</span>（{disciplined}/{rated.length}）</p>}
          </div>
          <div className="mt-2 space-y-1.5">
            {log.slice(0, 12).map(l => (
              <div key={l.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-[var(--panel)] px-3 py-2 text-xs">
                <span className="text-[var(--ink-dim)]">{l.date}・{l.strategy}{l.scenario ? `・${l.scenario}` : ""}</span>
                <span style={{ color: l.action === "依規則執行" ? "var(--jade)" : l.action === "手動干預" ? "var(--vermilion)" : "var(--ink-dim)" }}>{l.action}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="mt-8 text-[11px] leading-relaxed text-[var(--ink-dim)]">
        本專區為個人紀律輔助工具。命理運勢與 00981A、大盤或任何金融商品的走勢無因果關係，所有內容不構成投資建議，系統不會、也永遠不應輸出買進或賣出指令。實際進出請完全依你的量化系統規則與書面風控執行。
      </p>
    </main>
  );
}
