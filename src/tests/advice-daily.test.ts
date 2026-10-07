/** 每日建議具體化：工作角色用語、今日時間表、臨場應對、長期提醒頻率。 */
import { describe, it, expect } from "vitest";
import { adviseDay, summarizeDay, WORK_ROLES } from "@/core/advice";
import { lintAdviceText } from "@/core/advice/lint";
import { buildNatal } from "@/core/analysis";
import { ROLE_VARIANTS, SCHEDULE_ACTIVITY } from "@/kb/advice/roleVariants";
import { RESPONSES } from "@/kb/advice/responses";
import { ADVICE_RULES } from "@/kb/advice/rules";
import { TEMPLATE_IDS } from "@/kb/advice/templates";
import { FACTOR_IDS } from "@/core/advice/factors";
import { SAMPLES } from "../../scripts/calibrate-samples";

const kindOf = (id: string) => ADVICE_RULES.some(r => r.avoid === id) ? "avoid" as const : "do" as const;

describe("文字品質", () => {
  it("角色版本、時間表活動、臨場應對全部通過白話／具體／安全檢查", () => {
    for (const [id, vs] of Object.entries(ROLE_VARIANTS)) {
      expect(TEMPLATE_IDS, id).toContain(id);
      for (const [r, v] of Object.entries(vs!)) {
        expect(lintAdviceText(v!.text, { kind: kindOf(id) }), `${id}.${r}.text`).toEqual([]);
        expect(lintAdviceText(v!.short, { kind: kindOf(id) }), `${id}.${r}.short`).toEqual([]);
        for (const s of v!.steps ?? []) expect(lintAdviceText(s, { kind: "do" }), `${id}.${r}：${s}`).toEqual([]);
      }
    }
    for (const d of RESPONSES) {
      for (const f of d.factors) expect(FACTOR_IDS, d.id).toContain(f);
      for (const t of [d.text, ...Object.values(d.roles ?? {})]) {
        expect(lintAdviceText(t!, { kind: "do" }), `${d.id}：${t}`).toEqual([]);
        expect(t, d.id).toMatch(/^如果.+就/);
      }
    }
    for (const v of Object.values(SCHEDULE_ACTIVITY)) for (const t of Object.values(v)) expect(lintAdviceText(`適合${t}`, { kind: "do" }), t).toEqual([]);
  });
});

describe("實際命例輸出", () => {
  const n = buildNatal(SAMPLES[3]);
  const days = ["2026-10-05", "2026-10-06", "2026-11-01", "2026-12-15"];
  it("今日時間表：07–21 點每個時辰一列；五不遇時標為避開；所有文字通過檢查", () => {
    for (const d of days) {
      const adv = adviseDay(n, d, "Asia/Taipei", ["general", "career"]);
      expect(adv.schedule).toHaveLength(7);
      expect(adv.schedule[0].hour).toBe("7–9 點");
      for (const s of adv.schedule) for (const t of [s.text, ...s.notes]) expect(lintAdviceText(t), t).toEqual([]);
      expect(adv.schedule.filter(s => s.tone === "avoid").length).toBeLessThanOrEqual(1);
      // 同一類活動最多出現在兩個時段
      const cnt = new Map<string, number>();
      for (const s of adv.schedule) for (const k of s.kinds) cnt.set(k, (cnt.get(k) ?? 0) + 1);
      for (const v of cnt.values()) expect(v).toBeLessThanOrEqual(2);
      // 公務主管的公務不排到 17 點以後
      const pub = adviseDay(n, d, "Asia/Taipei", ["general"], "今天", undefined, { role: "publicManager" });
      for (const s of pub.schedule) if (s.kinds.includes("career")) expect(s.index).toBeLessThanOrEqual(8);
    }
  });
  it("工作角色：同樣的判讀，公務機關主管看到公務用語；觸發的建議規則不變", () => {
    let changed = 0;
    for (const d of days) {
      const plain = adviseDay(n, d, "Asia/Taipei", ["general", "career"]);
      const pub = adviseDay(n, d, "Asia/Taipei", ["general", "career"], "今天", undefined, { role: "publicManager" });
      const ids = (a: typeof plain) => Object.values(a.byTopic).flatMap(x => [...x!.doNow, ...x!.avoidNow].map(i => i.adviceRuleId)).sort();
      expect(ids(pub)).toEqual(ids(plain));
      const txt = (a: typeof plain) => JSON.stringify(Object.values(a.byTopic).map(x => [...x!.doNow, ...x!.avoidNow].map(i => i.text)));
      if (txt(pub) !== txt(plain)) changed++;
      expect(JSON.stringify(pub.schedule)).not.toMatch(/undefined/);
    }
    expect(changed).toBeGreaterThan(0);
    for (const r of WORK_ROLES) {
      const a = adviseDay(n, days[0], "Asia/Taipei", ["general", "career", "relationship"], "今天", undefined, { role: r });
      for (const x of Object.values(a.byTopic)) for (const it of [x!.primaryAdvice!, ...x!.doNow, ...x!.avoidNow]) for (const t of [it.text, it.short, ...(it.steps ?? [])]) expect(lintAdviceText(t, { kind: it.kind }), `${r}：${t}`).toEqual([]);
    }
  });
  it("臨場應對：最多 3 句、都是「如果…就…」，只在有對應風險因素時出現", () => {
    let seen = 0;
    for (const d of days) for (const a of Object.values(adviseDay(n, d, "Asia/Taipei").byTopic)) {
      expect(a!.responses.length).toBeLessThanOrEqual(3);
      for (const r of a!.responses) expect(r).toMatch(/^如果.+就/);
      if (a!.responses.length) { seen++; expect(a!.riskFactors.length).toBeGreaterThan(0); }
    }
    expect(seen).toBeGreaterThan(0);
  });
  it("長期提醒只在週一或每月 1 日出現在今日總結", () => {
    for (const d of ["2026-10-05", "2026-10-06", "2026-11-01", "2026-11-03"]) {
      const s = summarizeDay(d, adviseDay(n, d, "Asia/Taipei", ["general"]).byTopic);
      const has = s.lines.some(l => l.label === "本週提醒" || l.label === "本月提醒");
      const should = d === "2026-10-05" || d.endsWith("-01");
      if (!should) expect(has, d).toBe(false);
    }
  });
});

describe("事件類型：請假、辭職", () => {
  const n = buildNatal(SAMPLES[5]);
  it("請假：有分數、具體建議與「請假當天適合做什麼」（五類活動，依態勢排序），文字都通過檢查", async () => {
    const { analyzeEvent } = await import("@/core/analysis");
    for (const d of ["2026-10-09", "2026-10-16", "2026-12-24"]) {
      const e = analyzeEvent(n, "leave", d, null, "Asia/Taipei");
      expect(e.advice.topic).toBe("leave");
      expect(e.leavePlan).toHaveLength(5);
      const order = { good: 0, ok: 1, notIdeal: 2 };
      for (let i = 1; i < e.leavePlan!.length; i++) expect(order[e.leavePlan![i].level]).toBeGreaterThanOrEqual(order[e.leavePlan![i - 1].level]);
      for (const x of e.leavePlan!) for (const t of [x.activity, x.note]) expect(lintAdviceText(t), t).toEqual([]);
      for (const it of [e.advice.primaryAdvice!, ...e.advice.doNow, ...e.advice.avoidNow]) for (const t of [it.text, it.short, ...(it.steps ?? [])]) expect(lintAdviceText(t, { kind: it.kind }), t).toEqual([]);
      expect(e.facts.some(f => f.key === "qimen.event.yongshen" && String(f.value).includes("休門"))).toBe(true);
    }
  });
  it("辭職：用神為開門、值符、六合；建議談準備、書面與交接，不給宿命式結論；非請假事件沒有請假清單", async () => {
    const { analyzeEvent } = await import("@/core/analysis");
    for (const d of ["2026-10-09", "2026-11-20"]) {
      const e = analyzeEvent(n, "resign", d, null, "Asia/Taipei");
      expect(e.advice.topic).toBe("resign");
      expect(e.leavePlan).toBeNull();
      expect(String(e.facts.find(f => f.key === "qimen.event.yongshen")!.value)).toBe("開門、值符、六合");
      for (const it of [e.advice.primaryAdvice!, ...e.advice.doNow, ...e.advice.avoidNow]) for (const t of [it.text, it.short, ...(it.steps ?? [])]) expect(lintAdviceText(t, { kind: it.kind }), t).toEqual([]);
      expect(e.advice.coverage.note).toMatch(/預告期/);
    }
  });
});
