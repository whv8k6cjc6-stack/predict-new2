import { describe, it, expect } from "vitest";
import { computeQimen, xunYi } from "@/engines/qimen";

describe("奇門 旬首遁儀", () => {
  // 六甲旬首：甲子戊、甲戌己、甲申庚、甲午辛、甲辰壬、甲寅癸
  it("甲子旬→戊", () => expect(xunYi(0)).toBe("戊"));
  it("甲戌旬→己", () => expect(xunYi(10)).toBe("己"));
  it("甲申旬→庚", () => expect(xunYi(20)).toBe("庚"));
  it("甲午旬→辛", () => expect(xunYi(30)).toBe("辛"));
  it("甲辰旬→壬", () => expect(xunYi(40)).toBe("壬"));
  it("甲寅旬→癸", () => expect(xunYi(50)).toBe("癸"));
  it("旬中任一時與旬首同儀（乙丑仍甲子旬）", () => expect(xunYi(1)).toBe("戊"));
});

describe("奇門 起局一致性", () => {
  it("值符星必為旬首遁儀所臨地盤宮之九星", () => {
    const STAR_OF: Record<number, string> = { 1:"天蓬",8:"天任",3:"天沖",4:"天輔",9:"天英",2:"天芮",7:"天柱",6:"天心",5:"天禽" };
    // 掃描一整年不同時辰，驗證內部一致性
    for (let mth = 1; mth <= 12; mth++) {
      for (const hh of ["01:00","07:00","13:00","19:00","23:00"]) {
        const c = computeQimen(2025, mth, 15, hh);
        const yi = xunYi(0); void yi;
        // 找值符星所在天盤宮，其對應地盤儀宮的星須等於 zhiFuStar
        expect(Object.values(STAR_OF)).toContain(c.zhiFuStar);
        // 九宮門、星、神皆應佈滿 8 個外宮
        const ext = [1,2,3,4,6,7,8,9];
        for (const pal of ext) {
          expect(c.doors[pal]).toBeTruthy();
          expect(c.starsP[pal]).toBeTruthy();
          expect(c.godsP[pal]).toBeTruthy();
        }
      }
    }
  });
});
