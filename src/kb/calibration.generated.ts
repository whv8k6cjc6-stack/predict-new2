/** 由 scripts/calibrate.test.ts 產生，勿手改。樣本：12 組合成命例；day 以 2026 全年逐日、month 以 2025–2027 逐月、year 以 2000–2039 逐年、decade 以 1990–2060 每十年。 */
import type { DomainKey } from "@/core/domains";
import type { CalibrationGroup, Level } from "./weights";
type KTable = Record<DomainKey, number>;
/** 尺度常數 K（顯示用換算：score = round(50 + 50 × tanh((raw − B) / K))）。
 *  固定取「四術完整」參考分布（P90 − P50）/ atanh(0.6)，不隨參與系統數改變：系統暫不計分時不放大其他系統的結果。 */
export const K: Record<Level, KTable> = {
  "day": {
    "overall": 6.8,
    "career": 7.6,
    "wealth": 6.9,
    "investment": 7.4,
    "social": 7.7,
    "love": 7,
    "travel": 5.1,
    "health": 7.9,
    "decision": 8
  },
  "month": {
    "overall": 5.8,
    "career": 6.1,
    "wealth": 5.4,
    "investment": 5.1,
    "social": 6.8,
    "love": 6,
    "travel": 2.6,
    "health": 5.5,
    "decision": 4.1
  },
  "year": {
    "overall": 2.8,
    "career": 4.3,
    "wealth": 4.1,
    "investment": 3.4,
    "social": 3.7,
    "love": 3.9,
    "travel": 2,
    "health": 3.8,
    "decision": 3.2
  },
  "decade": {
    "overall": 2.2,
    "career": 3.6,
    "wealth": 2.4,
    "investment": 2.7,
    "social": 2.3,
    "love": 2.8,
    "travel": 1.2,
    "health": 2.2,
    "decision": 2.1
  }
};
/** 基準校正 B：只以實際參與計分的系統（active）樣本 raw 中位數計算，只做位置校正；依有／無出生時辰分開 */
export const B: Record<CalibrationGroup, Record<Level, KTable>> = {
  "timeKnown": {
    "day": {
      "overall": 0.34,
      "career": 2.46,
      "wealth": 2.35,
      "investment": -0.52,
      "social": 2,
      "love": 1.64,
      "travel": 2.34,
      "health": 0.65,
      "decision": 1.03
    },
    "month": {
      "overall": -0.24,
      "career": 0.56,
      "wealth": 0,
      "investment": -0.9,
      "social": 0.76,
      "love": 0.69,
      "travel": 0,
      "health": 0,
      "decision": 0.12
    },
    "year": {
      "overall": -0.17,
      "career": 0,
      "wealth": 0,
      "investment": 0,
      "social": 0.48,
      "love": 0.14,
      "travel": 0,
      "health": -0.17,
      "decision": -0.14
    },
    "decade": {
      "overall": 0,
      "career": 0,
      "wealth": 0,
      "investment": 0,
      "social": 0,
      "love": 0,
      "travel": 0,
      "health": 0,
      "decision": 0
    }
  },
  "timeUnknown": {
    "day": {
      "overall": 0.17,
      "career": 2.48,
      "wealth": 1.87,
      "investment": -0.53,
      "social": 1.95,
      "love": 2.1,
      "travel": 2.34,
      "health": 0.73,
      "decision": 1.16
    },
    "month": {
      "overall": -0.56,
      "career": 0.1,
      "wealth": 0,
      "investment": -1,
      "social": 0.78,
      "love": 0.98,
      "travel": 0,
      "health": -0.24,
      "decision": 0.42
    },
    "year": {
      "overall": -0.17,
      "career": 0,
      "wealth": 0,
      "investment": 0,
      "social": 0.48,
      "love": 0.67,
      "travel": 0,
      "health": -0.17,
      "decision": -0.14
    },
    "decade": {
      "overall": 0,
      "career": 0,
      "wealth": 0,
      "investment": 0,
      "social": 0,
      "love": 0,
      "travel": 0,
      "health": 0,
      "decision": 0
    }
  }
};
export const CALIBRATION_INFO = {
  samples: 12,
  target: "K＝四術完整參考分布 (P90 − P50) / atanh(0.6)，固定尺度；B＝參與計分系統的中位數",
  scaleReference: "fourSystemReference",
  compensatesMissingSystems: false,
  generatedAt: "2026-09-27",
};
