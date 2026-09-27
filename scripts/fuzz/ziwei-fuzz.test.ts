/** 紫微 Fuzz：隨機產生出生資料，與 iztro 相容設定逐欄比對。發現差異時輸出重現用的輸入，
 *  由人工判斷是否為流派差異，再決定是否加入固定 fixture；不自動修改程式。
 *  用法：FUZZ_N=2000 npx vitest run --config scripts/fuzz/vitest.config.ts */
import { it, expect } from "vitest";
import { snapshot, compareWithIztro, type FixtureInput } from "../../src/tests/golden/snapshot";

it("ziwei fuzz vs iztro（相容設定）", () => {
  const n = Number(process.env.FUZZ_N ?? 500);
  const seed = Number(process.env.FUZZ_SEED ?? Date.now());
  let s = seed;
  const rand = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
  const pad = (v: number) => String(v).padStart(2, "0");
  const fails: string[] = [];
  for (let i = 0; i < n; i++) {
    const t = new Date(Date.UTC(1901, 0, 1) + Math.floor(rand() * 6.3e12 / 60000) * 60000);
    const x: FixtureInput = {
      gender: rand() < 0.5 ? "male" : "female", localDate: t.toISOString().slice(0, 10), localTime: `${pad(t.getUTCHours())}:${pad(t.getUTCMinutes())}`,
      timeZone: "Asia/Taipei", place: { name: "fuzz", lat: 23.5, lng: 119 + rand() * 3.5 }, useTrueSolarTime: rand() < 0.3,
    };
    const exp = snapshot(x, "pre-refactor-default");
    const d = compareWithIztro(x, "pre-refactor-default", exp);
    if (d && d.length) fails.push(`${JSON.stringify(x)} → ${d.slice(0, 3).join("；")}`);
  }
  console.log(`fuzz seed=${seed} n=${n} 差異 ${fails.length}`);
  for (const f of fails.slice(0, 20)) console.log("  ", f);
  expect(fails).toEqual([]);
});
