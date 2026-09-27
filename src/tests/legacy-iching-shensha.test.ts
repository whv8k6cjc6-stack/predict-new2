import { describe, it, expect } from "vitest";
import { castMeihua, HEXAGRAMS, tiYong } from "@/legacy/engines/iching";
import { shenshaHits, TIANYI, yima, taohua } from "@/legacy/engines/bazi/shensha";

describe("易經 六十四卦資料", () => {
  it("64 卦編號完整且上下卦組合不重複", () => {
    expect(HEXAGRAMS).toHaveLength(64);
    expect(new Set(HEXAGRAMS.map(h => h.no)).size).toBe(64);
    expect(new Set(HEXAGRAMS.map(h => `${h.upper}-${h.lower}`)).size).toBe(64);
  });
});

describe("梅花易數 年月日時起卦", () => {
  // 《梅花易數》觀梅占：辰年十二月十七日申時 → 澤火革，初爻動，互天風姤，變澤山咸；兌金為體，離火剋之
  const r = castMeihua(5, 12, 17, 9);
  it("本卦澤火革、初爻動", () => { expect(r.main.name).toBe("澤火革"); expect(r.movingLine).toBe(1); });
  it("互卦天風姤、變卦澤山咸", () => { expect(r.mutual.name).toBe("天風姤"); expect(r.changed.name).toBe("澤山咸"); });
  it("體兌金、用離火 → 用克體", () => {
    expect(r.ti.name).toBe("兌"); expect(r.yong.name).toBe("離"); expect(r.relation).toBe("用克體");
  });
  it("體用五種關係", () => {
    expect(tiYong("金", "土")).toBe("用生體");
    expect(tiYong("金", "金")).toBe("比和");
    expect(tiYong("金", "木")).toBe("體克用");
    expect(tiYong("金", "水")).toBe("體生用");
    expect(tiYong("金", "火")).toBe("用克體");
  });
});

describe("神煞", () => {
  it("甲日天乙貴人在丑未", () => expect(TIANYI[0]).toEqual([1, 7]));
  it("申子辰驛馬在寅、桃花在酉", () => { expect(yima(0)).toBe(2); expect(taohua(0)).toBe(9); });
  it("甲日見丑日觸發天乙貴人", () => expect(shenshaHits(0, 6, 6, 1).map(h => h.name)).toContain("天乙貴人"));
});

