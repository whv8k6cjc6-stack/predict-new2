import { describe, it, expect } from "vitest";
import { castMeihua, castDaily, castAtTime, castByNumbers, castRandom, castFromNumbers, verdictOf, ichingFacts, hexOf, TRIGRAMS } from "@/core/iching";
import { ZHOUYI_HEXAGRAMS, ZHOUYI_ERRATA, ZHOUYI_EDITION, getSourceText } from "@/kb/sources";
import { ICHING_RULES } from "@/kb/rules/iching";
import { lintRule, runRules } from "@/core/rules/engine";

describe("《周易》匯入", () => {
  it("六十四卦齊全、卦畫不重複、爻辭與小象數量正確", () => {
    expect(ZHOUYI_HEXAGRAMS).toHaveLength(64);
    expect(new Set(ZHOUYI_HEXAGRAMS.map(h => h.bits)).size).toBe(64);
    for (const h of ZHOUYI_HEXAGRAMS) {
      const n = h.no <= 2 ? 7 : 6;
      expect(h.textIds.yao).toHaveLength(n);
      for (const id of [h.textIds.gua, h.textIds.tuan, h.textIds.daxiang, ...h.textIds.yao]) expect(getSourceText(id)?.text).toBeTruthy();
    }
  });
  it("卦名與上下卦對應（抽樣）", () => {
    const full = (u: number, l: number) => hexOf(u, l).full;
    expect(full(6, 4)).toBe("水雷屯");
    expect(full(2, 3)).toBe("澤火革");
    expect(full(3, 6)).toBe("火水未濟");
    expect(full(1, 1)).toBe("乾為天");
    expect(hexOf(2, 7).name).toBe("咸");
  });
  it("勘誤已套用、來源有雜湊與網址", () => {
    const all = ZHOUYI_HEXAGRAMS.flatMap(h => [h.textIds.gua, h.textIds.tuan, h.textIds.daxiang, ...h.textIds.yao, ...h.textIds.xiaoxiang]).map(id => getSourceText(id)!.text).join("");
    for (const bad of ["鹹", "兇", "誌", "鬥", "輿屍", "以禦天", "後以", "百裏", "噬臘"]) expect(all).not.toContain(bad);
    expect(getSourceText("zhouyi.gua.55.yao.2")!.text).toContain("日中見斗");
    expect(getSourceText("zhouyi.gua.53.yao.1")!.text).toContain("鴻漸于干");
    expect(ZHOUYI_ERRATA.every(e => e.applied === e.count && e.reason && e.basis)).toBe(true);
    expect(ZHOUYI_EDITION.content_hash).toMatch(/^sha256:64gua=[0-9a-f]{64};xici=[0-9a-f]{64}$/);
    expect(ZHOUYI_EDITION.origin_url).toBe("https://github.com/freizl/yijing");
  });
});

describe("梅花易數起卦", () => {
  it("觀梅占：辰年十二月十七日申時 → 澤火革初爻動，互天風姤，變澤山咸，用克體", () => {
    const r = castMeihua(5, 12, 17, 9, "time");
    expect([r.main.full, r.moving, r.mutual.full, r.changed.full]).toEqual(["澤火革", 1, "天風姤", "澤山咸"]);
    expect([r.ti.name, r.yong.name, r.relation]).toEqual(["兌", "離", "用克體"]);
    expect(r.movingLabel).toBe("革卦初九");
    expect(r.yao.text).toBe("初九：鞏用黃牛之革。");
  });
  it("所有 8×8×6 組合皆可起卦，互卦、變卦與體用一致", () => {
    for (let u = 1; u <= 8; u++) for (let l = 1; l <= 8; l++) for (let m = 1; m <= 6; m++) {
      const r = castFromNumbers(u, l, m, "numbers", []);
      expect(r.main.upper).toBe(u); expect(r.main.lower).toBe(l);
      const diff = [...r.main.bits].filter((b, i) => b !== r.changed.bits[i]).length;
      expect(diff).toBe(1);
      expect(r.ti.trigram).toBe(m <= 3 ? u : l);
    }
  });
  it("斷辭判讀", () => {
    expect(verdictOf("初九：潛龍，勿用。").verdict).toBe("無明確斷辭");
    expect(verdictOf("六五：黃裳，元吉。").verdict).toBe("大吉");
    expect(verdictOf("上六：君子豹變，小人革面，征凶，居貞吉。").verdict).toBe("吉凶並見");
    expect(verdictOf("六三：師或輿尸，凶。").verdict).toBe("凶");
    expect(verdictOf("六四：括囊；無咎，無譽。").verdict).toBe("無咎");
  });
  it("固定演算法可重現；報數、時間起卦；隨機另行標示", () => {
    expect(castDaily("2026-09-27", 7, "午時").main.full).toBe(castDaily("2026-09-27", 7, "午時").main.full);
    const t = castAtTime("2026-09-27", "23:30");
    expect(t.derivation[0]).toContain("23 時後屬次日");
    expect(castByNumbers(3, 5, "10:00").deterministic).toBe(true);
    let i = 0; const seq = [0, 1, 2];
    const r = castRandom(() => seq[i++]);
    expect([r.main.upper, r.main.lower, r.moving, r.deterministic]).toEqual([1, 2, 3, false]);
    expect(TRIGRAMS[r.main.upper].name).toBe("乾");
  });
});

describe("易經規則", () => {
  it("通過 lint，逐日一年無缺槽，動爻原文可追溯", () => {
    expect(ICHING_RULES.map(r => ({ id: r.id, e: lintRule(r) })).filter(x => x.e.length)).toEqual([]);
    for (let d = 0; d < 366; d++) {
      const date = new Date(Date.UTC(2026, 0, 1 + d)).toISOString().slice(0, 10);
      const reading = castDaily(date, (d % 12) + 1, "測試");
      const out = runRules(ICHING_RULES, ichingFacts(reading));
      expect(out.warnings).toEqual([]);
      const v = out.fired.find(f => f.rule.id.startsWith("iching.verdict."));
      if (v) expect(v.textIds).toContain(reading.yao.id);
    }
  });
});
