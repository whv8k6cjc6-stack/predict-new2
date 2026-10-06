/** 奇門格局：五不遇時、伏吟反吟、六儀擊刑、三奇入墓、門制、日空亡；事件模式真太陽時。 */
import { describe, it, expect } from "vitest";
import { chartPatterns, computeQimenChart, evalPalace, isWuBuYu, JIXING, PALACE_GUA, QI_MU, scanDay, selfStemOf, type QimenChart } from "@/core/qimen";
// @ts-expect-error 對照組為 ESM 無型別
import * as Q from "qimen-dunjia";
import { getSourceText } from "@/kb/sources";
import { KE_YING } from "@/kb/qimen/classics";
import { STEMS } from "@/core/calendar/ganzhi";
import { QIMEN_EVENT_RULES } from "@/kb/rules/qimen";
import { lifeFactorMappingFor } from "@/kb/advice/lifeFactorMapping";
import { analyzeEvent } from "@/core/analysis";
import { buildNatal } from "@/core/analysis";
import { SAMPLES } from "../../scripts/calibrate-samples";

const S = (c: string) => (STEMS as readonly string[]).indexOf(c);
describe("五不遇時（時干剋日干、陰陽相同）", () => {
  it("甲日庚時、乙日辛時、丙日壬時、丁日癸時、戊日甲時、己日乙時、庚日丙時、辛日丁時、壬日戊時、癸日己時", () => {
    for (const [d, h] of [["甲", "庚"], ["乙", "辛"], ["丙", "壬"], ["丁", "癸"], ["戊", "甲"], ["己", "乙"], ["庚", "丙"], ["辛", "丁"], ["壬", "戊"], ["癸", "己"]]) expect(isWuBuYu(S(d), S(h)), `${d}${h}`).toBe(true);
    expect(isWuBuYu(S("甲"), S("辛"))).toBe(false); // 陰陽不同
    expect(isWuBuYu(S("甲"), S("甲"))).toBe(false);
  });
  it("每一天最多一個五不遇時（干支定式），且不會被列為較佳時段", () => {
    for (const d of ["2026-01-03", "2026-04-11", "2026-07-19", "2026-10-06"]) {
      const sc = scanDay(d, "Asia/Taipei", "丙", ["career", "investment"]);
      const wby = sc.charts.map((c, i) => c.wuBuYu ? i : -1).filter(i => i >= 0);
      expect(wby.length, d).toBeLessThanOrEqual(1);
      for (const k of ["career", "investment"] as const) for (const i of sc.byKind[k]!.best) expect(sc.charts[i].wuBuYu).toBe(false);
    }
  });
});

describe("伏吟、反吟、空亡", () => {
  it("甲時（旬首）值符回本位＝星伏吟；伏吟／反吟與值符、值使的位移一致", () => {
    let fu = 0, fan = 0;
    for (let k = 0; k < 400; k++) {
      const d = new Date(Date.UTC(2026, 0, 1) + k * 7 * 3600_000);
      const c = computeQimenChart(d.toISOString().slice(0, 10), `${String(d.getUTCHours()).padStart(2, "0")}:30`, "UTC");
      if (STEMS[c.hourGz.stem] === "甲") expect(c.fuyin.star).toBe(true);
      if (c.fuyin.star) fu++; if (c.fanyin.star) fan++;
      expect(c.fuyin.star && c.fanyin.star).toBe(false);
      const ps = chartPatterns(c).map(p => p.key);
      expect(ps.includes("fuyin")).toBe(c.fuyin.star);
      expect(ps.includes("doorFuyin")).toBe(!c.fuyin.star && c.fuyin.door);
      expect(ps.includes("fanyin")).toBe(c.fanyin.star);
      expect(c.dayKong).toHaveLength(2);
    }
    expect(fu).toBeGreaterThan(0); expect(fan).toBeGreaterThan(0);
  });
});

describe("宮位格局：六儀擊刑、三奇入墓、門制", () => {
  it("天盤六儀落相刑之宮、三奇落墓宮就標出；門迫、宮迫、和義三者互斥", () => {
    let jx = 0, mu = 0, zhi = 0;
    for (let k = 0; k < 300; k++) {
      const d = new Date(Date.UTC(2025, 5, 1) + k * 5 * 3600_000);
      const c = computeQimenChart(d.toISOString().slice(0, 10), `${String(d.getUTCHours()).padStart(2, "0")}:30`, "UTC");
      for (const pal of [1, 2, 3, 4, 6, 7, 8, 9]) {
        const ev = evalPalace(c, pal), terms = ev.notes.map(n => n.term);
        const stems = c.sky[pal].split("/");
        expect(terms.includes("六儀擊刑"), `${pal}`).toBe(JIXING[stems[0]] === pal);
        expect(terms.includes("三奇入墓")).toBe(QI_MU.some(m => m.qi === stems[0] && m.palace === pal));
        expect(terms.filter(t => ["門迫", "宮迫", "和義"].includes(t)).length).toBeLessThanOrEqual(1);
        jx += +terms.includes("六儀擊刑"); mu += +terms.includes("三奇入墓"); zhi += +terms.includes("宮迫");
      }
    }
    expect(jx && mu && zhi).toBeTruthy();
  });
});

describe("事件規則與生活因素", () => {
  it("每條格局規則都有生活因素對照，且依據字句出現在規則文字中", () => {
    const pat = QIMEN_EVENT_RULES.filter(r => /\.(wubuyu|fuyin|fanyin|jixing|rumu)$/.test(r.id));
    expect(pat.length).toBeGreaterThanOrEqual(5 * 10);
    for (const r of pat) {
      const m = lifeFactorMappingFor(r)!;
      expect(m, r.id).toBeTruthy();
      const text = [r.templates.conclusion, r.templates.plain, r.templates.pro, r.based_on.principle, r.applies_when].join("\n");
      for (const b of m.basis) expect(text.includes(b), `${r.id}：${b}`).toBe(true);
    }
  });
  it("指定時刻用真太陽時：接近時辰交界時可能換時辰，並附換算說明；自動挑時不受影響", () => {
    const n = buildNatal(SAMPLES[0]);
    // 2026-11-03 均時差約 +16 分：09:50 標準時間 → 真太陽時約 10:00 以後（巳時）
    const std = analyzeEvent(n, "work", "2026-11-03", "08:55", "Asia/Taipei");
    const tst = analyzeEvent(n, "work", "2026-11-03", "08:55", "Asia/Taipei", { trueSolar: { longitude: 120.21, placeName: "台南" } });
    expect(std.timeNote).toBeNull();
    expect(tst.timeNote).toMatch(/台南的真太陽時判斷時辰：08:55 → 09:\d\d（巳時）/);
    const q = (a: typeof std) => a.facts.find(f => f.key === "qimen.event.hour")!.value;
    expect(q(std)).not.toBe(q(tst));
    const auto = analyzeEvent(n, "work", "2026-11-03", null, "Asia/Taipei", { trueSolar: { longitude: 120.21 } });
    expect(auto.timeNote).toBeNull();
  });
});

const ORDER = [4, 9, 2, 3, 5, 7, 8, 1, 6];
const lib = (c: QimenChart) => Q.chartToObject(Q.generateQimenChart({ 年柱: c.pillars.year, 月柱: c.pillars.month, 日柱: c.pillars.day, 時柱: c.pillars.hour, 局數: c.ju, 陰陽: c.yang ? "陽" : "陰" }));
describe("格局判定與對照組（qimen-dunjia，各格附典籍出處）逐格一致", () => {
  it("600 個隨機時刻：五不遇（兩讀）、伏吟、反吟、門迫宮迫和義、擊刑（嚴寬）、入墓（含異說）、得使、三遁、截路、十干克應", () => {
    let seed = 11; const rand = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
    const bad: string[] = [];
    for (let k = 0; k < 600; k++) {
      const t = new Date(Date.UTC(1960, 0, 1) + Math.floor(rand() * 2.4e12 / 3600000) * 3600000);
      const c = computeQimenChart(t.toISOString().slice(0, 10), `${String(t.getUTCHours()).padStart(2, "0")}:10`, "Etc/GMT-8");
      const o = lib(c);
      const ws = Q.detectWuBuYu(o);
      if (ws.some((r: { 讀法: string }) => r.讀法.startsWith("干支定式")) !== c.wuBuYu) bad.push(`五不遇定式 ${c.pillars.day}${c.pillars.hour}`);
      if (ws.some((r: { 讀法: string }) => r.讀法.startsWith("陽克陽")) !== c.wuBuYuLoose) bad.push(`五不遇寬 ${c.pillars.day}${c.pillars.hour}`);
      if (Q.detectFuYin(o).length > 0 !== c.fuyin.star) bad.push("伏吟");
      if (Q.detectFanYin(o).length > 0 !== c.fanyin.star) bad.push("反吟");
      if (Q.detectJieLuKongWang(o).length > 0 !== c.jieLu) bad.push("截路");
      const ours = (term: string) => [1, 2, 3, 4, 6, 7, 8, 9].flatMap(p => evalPalace(c, p).notes.filter(n => n.term === term && n.kind !== "keying").map(n => `${PALACE_GUA[p]}${n.reading ? "|" + n.reading : ""}`)).sort();
      const theirs = (rs: { 宮: string; 讀法?: string }[]) => rs.filter(r => r.宮 !== "中").map(r => `${r.宮}${r.讀法 ? "|" + r.讀法 : ""}`).sort();
      const mp = Q.detectMenPo(o) as { 格: string; 宮: string }[];
      for (const g of ["門迫", "宮迫", "和義"]) if (JSON.stringify(ours(g).map(x => x.split("|")[0])) !== JSON.stringify(theirs(mp.filter(r => r.格 === g)).map(x => x.split("|")[0]))) bad.push(`${g} ${ours(g)} vs ${theirs(mp.filter(r => r.格 === g))}`);
      const jx = ours("六儀擊刑"), tj = theirs(Q.detectLiuYiJiXing(o));
      // 對照組嚴式時寬式也會同時列出；本專案同一宮只標一種（嚴式優先）
      const tjOne = [...new Map(tj.map((x: string) => [x.split("|")[0], x])).values()].map(x => tj.includes(`${x.split("|")[0]}|嚴式（值符之儀）`) ? `${x.split("|")[0]}|嚴式（值符之儀）` : x).sort();
      if (JSON.stringify(jx) !== JSON.stringify(tjOne)) bad.push(`擊刑 ${jx} vs ${tjOne}`);
      if (JSON.stringify(ours("三奇入墓").map(x => x.split("|")[0])) !== JSON.stringify(theirs(Q.detectSanQiRuMu(o)).map(x => x.split("|")[0]))) bad.push("入墓");
      if (JSON.stringify(ours("三奇得使")) !== JSON.stringify(theirs(Q.detectSanQiDeShi(o)))) bad.push("得使");
      const dun = ["天遁", "地遁", "人遁"].flatMap(d => ours(d).map(x => d + x)).sort();
      const tdun = (Q.detectSanDun(o) as { 格: string; 宮: string }[]).filter(r => r.宮 !== "中").map(r => r.格 + r.宮).sort();
      if (JSON.stringify(dun) !== JSON.stringify(tdun)) bad.push(`三遁 ${dun} vs ${tdun}`);
      const ky = Q.detectShiGanKeYing(o) as { 格: string; 宮: string }[];
      for (const p of [1, 2, 3, 4, 6, 7, 8, 9]) {
        const mine = evalPalace(c, p).notes.find(n => n.kind === "keying");
        const their = ky.find(r => r.宮 === PALACE_GUA[p]);
        if ((mine?.term ?? null) !== (their?.格 ?? null)) bad.push(`克應 ${PALACE_GUA[p]} ${mine?.term} vs ${their?.格}`);
      }
    }
    expect([...new Set(bad)].slice(0, 10)).toEqual([]);
  });
  it("每則格局都能查到引文（書名、篇名、原文）；81 格十干克應齊全", () => {
    expect(Object.keys(KE_YING)).toHaveLength(81);
    const c = computeQimenChart("2026-10-06", "10:30", "Asia/Taipei");
    for (const p of [1, 2, 3, 4, 6, 7, 8, 9]) for (const n of evalPalace(c, p).notes) for (const id of n.textIds ?? []) {
      const t = getSourceText(id);
      expect(t, id).toBeTruthy(); expect(t!.text.length).toBeGreaterThan(3); expect(t!.edition.title.length).toBeGreaterThan(1);
    }
    for (const p of chartPatterns(c)) for (const id of p.textIds) expect(getSourceText(id), id).toBeTruthy();
  });
  it("代表自己可選日干：甲日取旬首遁儀", () => {
    const c = computeQimenChart("2026-10-06", "10:30", "Asia/Taipei");
    expect(selfStemOf(c, "丙", "year")).toBe("丙");
    const d = c.pillars.day[0];
    expect(selfStemOf(c, "丙", "day")).toBe(d === "甲" ? expect.any(String) : d);
    for (let k = 0; k < 60; k++) {
      const t = new Date(Date.UTC(2026, 0, 1 + k));
      const cc = computeQimenChart(t.toISOString().slice(0, 10), "10:30", "Asia/Taipei");
      if (cc.pillars.day[0] === "甲") expect(["戊", "己", "庚", "辛", "壬", "癸"]).toContain(selfStemOf(cc, "丙", "day"));
    }
  });
});
