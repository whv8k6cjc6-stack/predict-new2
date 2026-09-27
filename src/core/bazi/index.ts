/** Bazi Engine（含《滴天髓》要旨規則）。 */
import type { ChartInput, DivinationEngine, EngineMeta, Moment } from "../engine";
import { computeBaziNatal, type BaziNatal } from "./natal";
import { computeBaziTransit, baziFacts, type BaziTransit } from "./transit";
import { BAZI_RULE_VERSION } from "@/kb/rules/bazi";

export const BAZI_META: EngineMeta = {
  id: "bazi", name: "八字＋滴天髓", phase: 3, status: "verified",
  stamp: { school: "子平（扶抑法）・滴天髓要旨", engine_version: "3.0.0", rule_version: BAZI_RULE_VERSION, source_version: "滴天髓原文未匯入" },
  summary: "本命、大運、流年、流月、流日、流時與規則證據鏈",
};

export const BaziEngine: DivinationEngine<BaziNatal, BaziTransit> = {
  meta: BAZI_META,
  computeNatal(input: ChartInput) {
    try {
      const data = computeBaziNatal(input);
      return { ok: true, data, facts: baziFacts(data), stamp: BAZI_META.stamp, warnings: data.warnings };
    } catch (e) {
      return { ok: false, reason: "invalid_input", message: (e as Error).message, stamp: BAZI_META.stamp };
    }
  },
  computeTransit(natal: BaziNatal, _input: ChartInput, at: Moment) {
    const data = computeBaziTransit(natal, at);
    return { ok: true, data, facts: baziFacts(natal, data), stamp: BAZI_META.stamp, warnings: [] };
  },
};

export * from "./data";
export * from "./natal";
export * from "./transit";
