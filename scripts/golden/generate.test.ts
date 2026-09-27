/** 產生「修改前金樣本」。只應在重構開始前執行一次；之後由 src/tests/golden.test.ts 比對。
 *  用法：GOLDEN_WRITE=1 npx vitest run --config scripts/golden/vitest.config.ts
 *  已存在時預設拒絕覆寫（需另設 GOLDEN_OVERWRITE=1，且覆寫必須在提交訊息中說明原因）。 */
import { it, expect } from "vitest";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { canonicalFixtures, randomFixtures, RANDOM_SEED, type FixtureDef } from "./canonical";
import { snapshot, compareWithIztro, SNAPSHOT_FORMAT, TRANSIT_DATES, PRE_REFACTOR_SETTINGS, IZTRO_COMPAT_CONFIG, IZTRO_DEFAULT_CONFIG, IZTRO_BYSOLAR_OPTIONS, type VerificationStatus } from "../../src/tests/golden/snapshot";
import { ZIWEI_META } from "@/core/ziwei";

const DIR = path.resolve(__dirname, "../../src/tests/fixtures/ziwei");
const MANUAL_VERIFIED = new Set(["fixture_19880114_0115_male"]); // 已逐步人工推導（見 docs/ZIWEI_REFACTOR_PLAN.md 附錄）

function build(defs: FixtureDef[]) {
  return defs.map(d => {
    const expected = snapshot(d.input, d.settings);
    const diffs = compareWithIztro(d.input, d.settings, expected, IZTRO_COMPAT_CONFIG);
    const dflt = compareWithIztro(d.input, d.settings, expected, IZTRO_DEFAULT_CONFIG);
    const notes = [
      ...(diffs && diffs.length ? [`與 iztro 相容設定差異：${diffs.join("；")}`] : []),
      ...(dflt && dflt.length ? [`與 iztro 預設設定（dayDivide=forward，晚子時以次日安紫微）差異：${dflt.length} 欄（主星位置）`] : []),
    ];
    const verificationStatus: VerificationStatus = {
      ruleVerified: MANUAL_VERIFIED.has(d.fixtureId),
      iztroMatched: diffs === null ? null : diffs.length === 0,
      iztroDefaultMatched: dflt === null ? null : dflt.length === 0,
      secondSourceVerified: false,
      classicalSourceVerified: false,
      ...(notes.length ? { notes: notes.join(" ") } : {}),
    };
    return { fixtureId: d.fixtureId, covers: d.covers, note: d.note, input: d.input, calculationSettings: d.settings, expected, verificationStatus };
  });
}

it("generate golden fixtures", () => {
  if (process.env.GOLDEN_WRITE !== "1") { console.log("未設定 GOLDEN_WRITE=1，略過寫檔"); return; }
  mkdirSync(DIR, { recursive: true });
  const files = { canonical: path.join(DIR, "ziwei_canonical_fixture_v1.json"), random: path.join(DIR, "ziwei_random_fixture_v1.json") };
  if (process.env.GOLDEN_OVERWRITE !== "1") for (const f of Object.values(files)) expect(existsSync(f), `${f} 已存在，拒絕覆寫`).toBe(false);
  const commit = execSync("git rev-parse HEAD").toString().trim();
  const meta = (kind: string, extra: object) => ({
    format: SNAPSHOT_FORMAT, kind, generatedAt: new Date().toISOString(), generatedFromCommit: commit,
    engineStamp: ZIWEI_META.stamp, transitDates: TRANSIT_DATES, calculationSettings: PRE_REFACTOR_SETTINGS,
    iztro: { version: "2.6.1", role: "softwareDataset / compatibilityReference（非古籍來源）", compatConfig: IZTRO_COMPAT_CONFIG, defaultConfig: IZTRO_DEFAULT_CONFIG, bySolarOptions: IZTRO_BYSOLAR_OPTIONS },
    note: "修改前金樣本：由當時的程式直接輸出，代表「既有命盤結果」，不是古法正確性的證明。verificationStatus 另行分級。",
    ...extra,
  });
  const canonical = build(canonicalFixtures());
  const random = build(randomFixtures(600));
  writeFileSync(files.canonical, JSON.stringify({ meta: meta("canonical", {}), fixtures: canonical }, null, 1) + "\n");
  writeFileSync(files.random, JSON.stringify({ meta: meta("random", { randomSeed: RANDOM_SEED, count: random.length, generator: "LCG a=1103515245 c=12345 m=2^31" }), fixtures: random }, null, 1) + "\n");
  const cnt = (xs: ReturnType<typeof build>, k: "iztroMatched" | "iztroDefaultMatched") => xs.filter(x => x.verificationStatus[k] === false).length;
  console.log(`canonical ${canonical.length}（相容設定不符 ${cnt(canonical, "iztroMatched")}、預設設定不符 ${cnt(canonical, "iztroDefaultMatched")}）；random ${random.length}（相容設定不符 ${cnt(random, "iztroMatched")}、預設設定不符 ${cnt(random, "iztroDefaultMatched")}）`);
});
