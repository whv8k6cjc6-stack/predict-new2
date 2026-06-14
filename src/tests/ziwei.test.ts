import { describe, it, expect } from "vitest";
import { ziweiPosition, fireBellPosition, yearSihua } from "@/engines/ziwei";

const B = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];

describe("紫微定位（商餘法）", () => {
  // 對照通行紫微定位表
  it("水二局 初一 → 丑", () => expect(B[ziweiPosition(2, 1)]).toBe("丑"));
  it("水二局 初二 → 寅", () => expect(B[ziweiPosition(2, 2)]).toBe("寅"));
  it("金四局 初一 → 亥", () => expect(B[ziweiPosition(4, 1)]).toBe("亥"));
  it("木三局 初一 → 辰", () => expect(B[ziweiPosition(3, 1)]).toBe("辰"));
  it("木三局 初二 → 丑", () => expect(B[ziweiPosition(3, 2)]).toBe("丑"));
  it("火六局 初六 → 寅（整除）", () => expect(B[ziweiPosition(6, 6)]).toBe("寅"));
  it("土五局 三十 → 未（整除商6，自寅順數5位）", () => expect(B[ziweiPosition(5, 30)]).toBe("未"));
});

describe("生年四化", () => {
  it("甲年 廉貞化祿、太陽化忌", () => {
    const s = yearSihua("甲");
    expect(s.祿).toBe("廉貞"); expect(s.忌).toBe("太陽");
  });
  it("辛年 巨門化祿、文昌化忌", () => {
    const s = yearSihua("辛");
    expect(s.祿).toBe("巨門"); expect(s.忌).toBe("文昌");
  });
  it("癸年 破軍化祿、貪狼化忌", () => {
    const s = yearSihua("癸");
    expect(s.祿).toBe("破軍"); expect(s.忌).toBe("貪狼");
  });
});

describe("火星鈴星（全書通行起例）", () => {
  it("寅午戌年 子時 → 火丑 鈴卯", () => {
    const r = fireBellPosition(2, 0); // 寅年
    expect(B[r.fire]).toBe("丑"); expect(B[r.bell]).toBe("卯");
  });
  it("申子辰年 子時 → 火寅 鈴戌", () => {
    const r = fireBellPosition(0, 0); // 子年
    expect(B[r.fire]).toBe("寅"); expect(B[r.bell]).toBe("戌");
  });
  it("巳酉丑年 卯時 → 起卯順三位", () => {
    const r = fireBellPosition(9, 3); // 酉年, 卯時
    expect(B[r.fire]).toBe("午"); // 卯起+3
  });
});
