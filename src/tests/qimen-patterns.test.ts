/** 奇門格局：五不遇時、伏吟反吟、六儀擊刑、三奇入墓、門制、日空亡；事件模式真太陽時。 */
import { describe, it, expect } from "vitest";
import { chartPatterns, computeQimenChart, evalPalace, isWuBuYu, JIXING, QI_MU, scanDay } from "@/core/qimen";
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
  it("每一天都有五不遇時，且不會被列為較佳時段", () => {
    for (const d of ["2026-01-03", "2026-04-11", "2026-07-19", "2026-10-06"]) {
      const sc = scanDay(d, "Asia/Taipei", "丙", ["career", "investment"]);
      const wby = sc.charts.map((c, i) => c.wuBuYu ? i : -1).filter(i => i >= 0);
      expect(wby.length, d).toBeGreaterThanOrEqual(1);
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
      expect(ps.includes("fuyin")).toBe(c.fuyin.star || c.fuyin.door);
      expect(ps.includes("fanyin")).toBe(c.fanyin.star || c.fanyin.door);
      expect(c.dayKong).toHaveLength(2);
    }
    expect(fu).toBeGreaterThan(0); expect(fan).toBeGreaterThan(0);
  });
});

describe("宮位格局：六儀擊刑、三奇入墓、門制", () => {
  it("天盤六儀落相刑之宮、三奇落墓宮就標出；門迫與門制不同時出現", () => {
    let jx = 0, mu = 0, zhi = 0;
    for (let k = 0; k < 300; k++) {
      const d = new Date(Date.UTC(2025, 5, 1) + k * 5 * 3600_000);
      const c = computeQimenChart(d.toISOString().slice(0, 10), `${String(d.getUTCHours()).padStart(2, "0")}:30`, "UTC");
      for (const pal of [1, 2, 3, 4, 6, 7, 8, 9]) {
        const ev = evalPalace(c, pal), terms = ev.notes.map(n => n.term);
        const stems = c.sky[pal].split("/");
        expect(terms.includes("六儀擊刑"), `${pal}`).toBe(stems.some(s => JIXING[s] === pal));
        expect(terms.includes("三奇入墓")).toBe(stems.some(s => QI_MU[s] === pal));
        expect(terms.includes("門迫") && terms.includes("門制")).toBe(false);
        jx += +terms.includes("六儀擊刑"); mu += +terms.includes("三奇入墓"); zhi += +terms.includes("門制");
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
