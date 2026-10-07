import { describe, it, expect } from "vitest";
import { leverageRisk } from "@/core/advice/leverage";
import { lintAdviceText } from "@/core/advice/lint";

describe("槓桿風險試算", () => {
  it("依倍數換算價格反向變動時的本金變化", () => {
    const r = leverageRisk(3)!;
    expect(r.multiple).toBe(3);
    expect(r.wipeoutPct).toBe(33.3);
    expect(r.lossAt10).toBe(30);
    expect(r.level).toBe("mid");
    expect(r.lines.join("")).toContain("約 33.3%");
    expect(leverageRisk(2)!.wipeoutPct).toBe(50);
    expect(leverageRisk(10)!.lossAt10).toBe(100);
    expect(leverageRisk(10)!.lines[1]).toContain("已經虧光");
  });
  it("等級隨倍數提高", () => {
    expect([1, 1.5, 2, 4, 8].map(x => leverageRisk(x)!.level)).toEqual(["none", "low", "mid", "high", "extreme"]);
    expect(leverageRisk(1)!.wipeoutPct).toBeNull();
  });
  it("無效輸入回傳 null，過大的倍數截在上限", () => {
    expect(leverageRisk(0.5)).toBeNull();
    expect(leverageRisk(NaN)).toBeNull();
    expect(leverageRisk(500)!.multiple).toBe(100);
  });
  it("檢查清單是具體做法，不建議倍數", () => {
    for (const x of leverageRisk(3)!.checklist) expect(lintAdviceText(x, { kind: "do" }), x).toEqual([]);
  });
  it("「保證金」不算誇大說法，「保證」仍會被擋", () => {
    expect(lintAdviceText("先查清楚追繳保證金的門檻", { kind: "do" })).toEqual([]);
    expect(lintAdviceText("先照計畫做，保證會賺", { kind: "do" }).join("")).toContain("保證");
  });
});
