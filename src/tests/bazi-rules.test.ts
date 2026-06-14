import { describe, it, expect } from "vitest";
import { tenGod, branchRelation, HIDDEN_STEMS } from "@/engines/bazi";

const S = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
const B = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];

describe("十神", () => {
  it("甲日見庚為七殺、見辛為正官", () => {
    expect(tenGod(0, 6)).toBe("七殺");
    expect(tenGod(0, 7)).toBe("正官");
  });
  it("甲日見戊為偏財、見己為正財", () => {
    expect(tenGod(0, 4)).toBe("偏財");
    expect(tenGod(0, 5)).toBe("正財");
  });
  it("甲日見丙為食神、見丁為傷官", () => {
    expect(tenGod(0, 2)).toBe("食神");
    expect(tenGod(0, 3)).toBe("傷官");
  });
  it("甲日見壬為偏印、見癸為正印", () => {
    expect(tenGod(0, 8)).toBe("偏印");
    expect(tenGod(0, 9)).toBe("正印");
  });
});

describe("地支關係", () => {
  it("子午相沖", () => expect(branchRelation(0, 6)).toBe("沖"));
  it("子丑六合", () => expect(branchRelation(0, 1)).toBe("六合"));
  it("申子辰三合", () => expect(branchRelation(8, 4)).toBe("三合"));
});

describe("藏干", () => {
  it("寅藏甲丙戊", () => expect(HIDDEN_STEMS[2].map(i => S[i])).toEqual(["甲","丙","戊"]));
  it("未藏己丁乙", () => expect(HIDDEN_STEMS[7].map(i => S[i])).toEqual(["己","丁","乙"]));
  it("戌藏戊辛丁", () => expect(HIDDEN_STEMS[10].map(i => S[i])).toEqual(["戊","辛","丁"]));
  it("12 地支藏干齊全", () => { for (let i = 0; i < 12; i++) expect(HIDDEN_STEMS[i].length).toBeGreaterThan(0); void B; });
});
