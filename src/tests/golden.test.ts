/** 紫微斗數金樣本回歸測試（deterministic）。
 *  金樣本由 scripts/golden/generate.test.ts 以「修改前」程式產生並固定保存；此測試每次重算並逐欄比對。
 *  任何一格不同都代表既有命盤結果改變，必須先產生差異報告、經確認後才能更新金樣本。 */
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { snapshot, compareWithIztro, IZTRO_COMPAT_CONFIG, type FixtureInput, type GoldenExpected, type VerificationStatus } from "./golden/snapshot";

interface Fixture { fixtureId: string; covers: string[]; input: FixtureInput; calculationSettings: string; expected: GoldenExpected; verificationStatus: VerificationStatus }
const load = (f: string) => JSON.parse(readFileSync(path.resolve(__dirname, "fixtures/ziwei", f), "utf8")) as { meta: Record<string, unknown>; fixtures: Fixture[] };
const canonical = load("ziwei_canonical_fixture_v1.json");
const random = load("ziwei_random_fixture_v1.json");
const all = [...canonical.fixtures, ...random.fixtures];

describe("金樣本：既有命盤結果不變（Non-regression）", () => {
  it("fixture 編號唯一、驗證狀態欄位齊全", () => {
    expect(new Set(all.map(f => f.fixtureId)).size).toBe(all.length);
    for (const f of all) expect(Object.keys(f.verificationStatus)).toEqual(expect.arrayContaining(["ruleVerified", "iztroMatched", "iztroDefaultMatched", "secondSourceVerified", "classicalSourceVerified"]));
  });
  it(`Canonical Fixture Suite（${canonical.fixtures.length} 組）逐欄一致`, () => {
    for (const f of canonical.fixtures) expect(snapshot(f.input, f.calculationSettings), f.fixtureId).toEqual(f.expected);
  });
  it(`固定種子隨機樣本（${random.fixtures.length} 組）逐欄一致`, () => {
    for (const f of random.fixtures) expect(snapshot(f.input, f.calculationSettings), f.fixtureId).toEqual(f.expected);
  });
});

describe("Level 2：iztro 相容（softwareDataset，非古籍）", () => {
  it("相容設定逐項明列，且 dayDivide 與 iztro 預設不同之處有記錄", () => {
    expect((canonical.meta.iztro as { compatConfig: unknown }).compatConfig).toEqual(IZTRO_COMPAT_CONFIG);
  });
  it("標記為 iztroMatched 的樣本，重算後仍與 iztro 相容設定完全相同", () => {
    for (const f of all) {
      const d = compareWithIztro(f.input, f.calculationSettings, f.expected);
      if (f.verificationStatus.iztroMatched === null) expect(d, f.fixtureId).toBeNull();
      else expect(d!.length === 0, `${f.fixtureId}: ${d?.join("；")}`).toBe(f.verificationStatus.iztroMatched);
    }
  }, 180_000);
});

describe("Canonical Fixture Suite 涵蓋範圍", () => {
  const cov = new Set(canonical.fixtures.flatMap(f => f.covers));
  const z = canonical.fixtures.map(f => f.expected.ziwei).filter((x): x is Extract<GoldenExpected["ziwei"], { ok: true }> => x.ok);
  it("必要情境全部存在", () => {
    for (const c of ["男", "女", "陽年", "陰年", "子時", "丑時", "午時", "23點附近", "0點附近", "春節前後", "立春前後", "閏月十四", "閏月十五", "閏月十六", "真太陽時跨時辰", "真太陽時不跨時辰"]) expect(cov.has(c), c).toBe(true);
  });
  it("五種五行局、十個年干、十二命宮、順逆行皆涵蓋", () => {
    expect(new Set(z.map(x => x.bureau))).toEqual(new Set(["水二局", "木三局", "金四局", "土五局", "火六局"]));
    expect(new Set(z.map(x => x.yearGz[0])).size).toBe(10);
    expect(new Set(z.map(x => x.life)).size).toBe(12);
    expect(new Set(z.map(x => x.forward))).toEqual(new Set([true, false]));
  });
  it("真太陽時跨時辰樣本確實跨越（丑→子），不跨樣本確實未跨", () => {
    const get = (id: string) => canonical.fixtures.find(f => f.fixtureId === id)!.expected.ziwei as Extract<GoldenExpected["ziwei"], { ok: true }>;
    expect([get("tst_cross_20240114_0105_std").hour, get("tst_cross_20240114_0105_tst").hour]).toEqual(["丑", "子"]);
    expect([get("fixture_19880114_0115_male").hour, get("fixture_19880114_0115_male_tst").hour]).toEqual(["丑", "丑"]);
  });
  it("年界各系統獨立：立春後、春節前，八字已換年、紫微尚未換年", () => {
    const f = canonical.fixtures.find(x => x.fixtureId === "lichun_after_newyear_before_20240205")!;
    expect(f.expected.crossSystem.baziPillars.slice(0, 2)).toBe("甲辰");
    expect((f.expected.ziwei as { yearGz: string }).yearGz).toBe("癸卯");
  });
});

describe("fixture_19880114_0115_male（使用者確認之命盤，人工逐步推導）", () => {
  const f = canonical.fixtures.find(x => x.fixtureId === "fixture_19880114_0115_male")!;
  const z = f.expected.ziwei as Extract<GoldenExpected["ziwei"], { ok: true }>;
  it("農曆丁卯年十一月廿五、丑時；命亥、身丑落福德；金四局", () => {
    expect([z.lunar, z.yearGz, z.hour, z.life, z.body, z.bodyPalace, z.bureau]).toEqual(["1987-11-25", "丁卯", "丑", "亥", "丑", "福德", "金四局"]);
  });
  it("丁干生年四化：太陰祿、天同權、天機科、巨門忌", () => {
    expect(z.birthHua).toBe("太陰祿@父母,天同權@父母,天機科@交友,巨門忌@田宅");
  });
  it("陰男逆行，金四局 4 歲起限", () => {
    expect(z.forward).toBe(false);
    const order = ["命宮", "兄弟", "夫妻", "子女", "財帛", "疾厄", "遷移", "交友", "官祿", "田宅", "福德", "父母"];
    const range = (name: string) => z.palaces.find(l => l.split("|")[2] === name)!.split("|")[6];
    expect(order.map(range)).toEqual(order.map((_, i) => `${4 + i * 10}-${13 + i * 10}`));
  });
  it("驗證分級：人工推導＋iztro 相容；尚無第二來源與古籍來源", () => {
    expect(f.verificationStatus).toMatchObject({ ruleVerified: true, iztroMatched: true, secondSourceVerified: false, classicalSourceVerified: false });
  });
});

describe("通用性：正式程式不得針對特定人物或生日", () => {
  it("src/core、src/kb、src/app、src/ui 內不含任何 fixture 生日字串", () => {
    const dates = [...new Set(canonical.fixtures.map(f => f.input.localDate))];
    const files: string[] = [];
    const walk = (d: string) => { for (const n of readdirSync(d)) { const p = path.join(d, n); if (statSync(p).isDirectory()) walk(p); else if (/\.(ts|tsx)$/.test(n)) files.push(p); } };
    for (const d of ["core", "kb", "app", "ui"]) walk(path.resolve(__dirname, "..", d));
    const hits = files.flatMap(p => { const s = readFileSync(p, "utf8"); return dates.filter(dt => s.includes(dt)).map(dt => `${path.relative(process.cwd(), p)}: ${dt}`); });
    expect(hits).toEqual([]);
  });
});
