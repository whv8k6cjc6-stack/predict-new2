/** 校準 K：以固定樣本命例逐日（逐月、逐年、逐運）統計 raw 分布，使約一成日子 ≥ 80。
 *  用法：npx vitest run --config scripts/vitest.calibrate.config.ts */
import { it } from "vitest";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { SAMPLES } from "./calibrate-samples";
import { buildNatal } from "@/core/analysis/collect";
import { collect } from "@/core/analysis/collect";
import { toEvidence, domainRaw } from "@/core/analysis/score";
import { DOMAINS, type DomainKey } from "@/core/domains";
import { OVERALL_MIX, OVERALL_OWN_WEIGHT, type Level } from "@/kb/weights";

const DK = DOMAINS.map(d => d.key);
const q = (xs: number[], p: number) => { const s = [...xs].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };
const TARGET = Math.atanh(0.6); // 分數 80

function rawsFor(level: Level, dates: string[], withTime: boolean) {
  const out: Record<DomainKey, number[]> = Object.fromEntries(DK.map(d => [d, []])) as never;
  for (const s of SAMPLES) {
    const n = buildNatal(withTime ? s : { ...s, birth: { ...s.birth, localTime: null, timeAccuracy: "unknown" } });
    for (const date of dates) {
      const ev = toEvidence(collect(n, { civilDate: date, civilTime: "12:00", timeZone: "Asia/Taipei" }, level).fired);
      for (const d of DK) out[d].push(domainRaw(ev.filter(e => e.domain === d), level).raw);
    }
  }
  return out;
}

it("calibrate", () => {
  const days = Array.from({ length: 365 }, (_, i) => new Date(Date.UTC(2026, 0, 1 + i)).toISOString().slice(0, 10));
  const months = Array.from({ length: 36 }, (_, i) => `${2025 + Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, "0")}-15`);
  const years = Array.from({ length: 40 }, (_, i) => `${2000 + i}-07-01`);
  const decades = Array.from({ length: 8 }, (_, i) => `${1990 + i * 10}-07-01`);
  const levels: [Level, string[]][] = [["day", days], ["month", months], ["year", years], ["decade", decades]];
  const Kp: Record<string, Record<string, Record<string, number>>> = {};
  const Bp: Record<string, Record<string, Record<string, number>>> = {};
  const report: string[] = [];
  for (const profile of ["full", "noZiwei"] as const) {
  const K: Record<string, Record<string, number>> = Kp[profile] = {};
  const B: Record<string, Record<string, number>> = Bp[profile] = {};
  for (const [level, dates] of levels) {
    const raws = rawsFor(level, dates, profile === "full");
    K[level] = {}; B[level] = {};
    for (const d of DK) {
      const r = raws[d];
      const b = Math.round(q(r, 0.5) * 100) / 100;
      const k = Math.max(1, Math.round((q(r, 0.9) - b) / TARGET * 10) / 10);
      K[level][d] = k; B[level][d] = b;
      report.push(`${profile}.${level}.${d}: p10=${q(r, 0.1).toFixed(2)} p50=${b} p90=${q(r, 0.9).toFixed(2)} K=${k}`);
    }
    const z = (d: DomainKey, i: number) => (raws[d][i] - B[level][d]) / K[level][d];
    const mix = raws.career.map((_, i) => DK.filter(d => d !== "overall").reduce((s, d) => s + (OVERALL_MIX[d] ?? 0) * z(d, i), 0) + OVERALL_OWN_WEIGHT * z("overall", i));
    B[level].mix = Math.round(q(mix, 0.5) * 1000) / 1000;
    K[level].mix = Math.max(0.3, Math.round((q(mix, 0.9) - B[level].mix) / TARGET * 100) / 100);
    report.push(`${profile}.${level}.mix: p10=${q(mix, 0.1).toFixed(2)} p50=${B[level].mix} p90=${q(mix, 0.9).toFixed(2)} K=${K[level].mix}`);
  }
  }
  console.log(report.join("\n"));
  const file = `/** 由 scripts/calibrate.test.ts 產生，勿手改。樣本：${SAMPLES.length} 組合成命例；day 以 2026 全年逐日、month 以 2025–2027 逐月、year 以 2000–2039 逐年、decade 以 1990–2060 每十年。 */
import type { DomainKey } from "@/core/domains";
import type { Level, Profile } from "./weights";
type KTable = Record<DomainKey | "mix", number>;
/** 尺度常數 K：score = round(50 + 50 × tanh((raw − B) / K))；依校準組別（full／noZiwei）分開 */
export const K: Record<Profile, Record<Level, KTable>> = ${JSON.stringify(Kp, null, 2)};
/** 基準校正 B：樣本逐日 raw 的中位數（規則庫正負條數不對稱的校正，使一般日子落在 50 附近） */
export const B: Record<Profile, Record<Level, KTable>> = ${JSON.stringify(Bp, null, 2)};
export const CALIBRATION_INFO = { samples: ${SAMPLES.length}, target: "中位數 50、約一成日子 ≥ 80（B = P50，K = (P90 − P50) / atanh(0.6)）", generatedAt: "${new Date().toISOString().slice(0, 10)}" };
`;
  writeFileSync(path.resolve(__dirname, "../src/kb/calibration.generated.ts"), file);
});
