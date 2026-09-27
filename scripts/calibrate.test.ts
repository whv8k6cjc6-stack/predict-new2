/** 校準分數換算常數。
 *  - 尺度 K：固定以「四術完整」參考分布決定（有出生時辰的樣本命例，紫微以已停用的 legacy 規則代入，只用來定尺度、不參與任何分數）。
 *    因此紫微暫不計分時，三術的貢獻維持原本尺度，不會被拉伸成看起來像四術總分；時辰不詳時也用同一尺度。
 *  - 基準 B：只看實際參與計分的系統（active）的中位數，只做位置校正（規則庫正負條數不對稱），
 *    不把暫不計分系統的典型貢獻當成 0 分扣掉。
 *  用法：npx vitest run --config scripts/vitest.calibrate.config.ts */
import { it } from "vitest";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { SAMPLES } from "./calibrate-samples";
import { buildNatal } from "@/core/analysis/collect";
import { collect } from "@/core/analysis/collect";
import { toEvidence, domainRaw } from "@/core/analysis/score";
import { DOMAINS, type DomainKey } from "@/core/domains";
import type { Level } from "@/kb/weights";

const DK = DOMAINS.map(d => d.key);
const q = (xs: number[], p: number) => { const s = [...xs].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };
const TARGET = Math.atanh(0.6); // 分數 80

function rawsFor(level: Level, dates: string[], withTime: boolean, fourSystemReference: boolean) {
  const out: Record<DomainKey, number[]> = Object.fromEntries(DK.map(d => [d, []])) as never;
  for (const s of SAMPLES) {
    const n = buildNatal(withTime ? s : { ...s, birth: { ...s.birth, localTime: null, timeAccuracy: "unknown" } });
    for (const date of dates) {
      const ev = toEvidence(collect(n, { civilDate: date, civilTime: "12:00", timeZone: "Asia/Taipei" }, level, { legacyZiwei: fourSystemReference }).fired);
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
  const Kref: Record<string, Record<string, number>> = {};
  const Bp: Record<string, Record<string, Record<string, number>>> = {};
  const report: string[] = [];
  for (const [level, dates] of levels) {
    const ref = rawsFor(level, dates, true, true);
    Kref[level] = {};
    for (const d of DK) {
      const r = ref[d], p50 = q(r, 0.5);
      Kref[level][d] = Math.max(1, Math.round((q(r, 0.9) - p50) / TARGET * 10) / 10);
      report.push(`K.${level}.${d}: 四術參考 p50=${p50.toFixed(2)} p90=${q(r, 0.9).toFixed(2)} K=${Kref[level][d]}`);
    }
  }
  for (const group of ["timeKnown", "timeUnknown"] as const) {
    const B: Record<string, Record<string, number>> = Bp[group] = {};
    for (const [level, dates] of levels) {
      const raws = rawsFor(level, dates, group === "timeKnown", false);
      B[level] = {};
      for (const d of DK) {
        B[level][d] = Math.round(q(raws[d], 0.5) * 100) / 100;
        report.push(`B.${group}.${level}.${d}: active p10=${q(raws[d], 0.1).toFixed(2)} p50=${B[level][d]} p90=${q(raws[d], 0.9).toFixed(2)}`);
      }
    }
  }
  console.log(report.join("\n"));
  const file = `/** 由 scripts/calibrate.test.ts 產生，勿手改。樣本：${SAMPLES.length} 組合成命例；day 以 2026 全年逐日、month 以 2025–2027 逐月、year 以 2000–2039 逐年、decade 以 1990–2060 每十年。 */
import type { DomainKey } from "@/core/domains";
import type { CalibrationGroup, Level } from "./weights";
type KTable = Record<DomainKey, number>;
/** 尺度常數 K（顯示用換算：score = round(50 + 50 × tanh((raw − B) / K))）。
 *  固定取「四術完整」參考分布（P90 − P50）/ atanh(0.6)，不隨參與系統數改變：系統暫不計分時不放大其他系統的結果。 */
export const K: Record<Level, KTable> = ${JSON.stringify(Kref, null, 2)};
/** 基準校正 B：只以實際參與計分的系統（active）樣本 raw 中位數計算，只做位置校正；依有／無出生時辰分開 */
export const B: Record<CalibrationGroup, Record<Level, KTable>> = ${JSON.stringify(Bp, null, 2)};
export const CALIBRATION_INFO = {
  samples: ${SAMPLES.length},
  target: "K＝四術完整參考分布 (P90 − P50) / atanh(0.6)，固定尺度；B＝參與計分系統的中位數",
  scaleReference: "fourSystemReference",
  compensatesMissingSystems: false,
  generatedAt: "${new Date().toISOString().slice(0, 10)}",
};
`;
  writeFileSync(path.resolve(__dirname, "../src/kb/calibration.generated.ts"), file);
});
