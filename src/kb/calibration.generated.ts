/** 由 scripts/calibrate.test.ts 產生，勿手改。樣本：12 組合成命例；day 以 2026 全年逐日、month 以 2025–2027 逐月、year 以 2000–2039 逐年、decade 以 1990–2060 每十年。 */
import type { DomainKey } from "@/core/domains";
import type { CalibrationGroup, Level } from "./weights";
type KTable = Record<DomainKey, number>;
/** 尺度常數 K：score = round(50 + 50 × tanh((raw − B) / K))；依校準組別（timeKnown／timeUnknown）分開 */
export const K: Record<CalibrationGroup, Record<Level, KTable>> = {
  "timeKnown": {
    "day": {
      "overall": 6.6,
      "career": 6.5,
      "wealth": 4.8,
      "investment": 4.7,
      "social": 6.9,
      "love": 5.1,
      "travel": 3.4,
      "health": 6.6,
      "decision": 7.6
    },
    "month": {
      "overall": 5.5,
      "career": 4.7,
      "wealth": 3.9,
      "investment": 2.6,
      "social": 5.2,
      "love": 3.6,
      "travel": 2.1,
      "health": 4.5,
      "decision": 4.2
    },
    "year": {
      "overall": 2.6,
      "career": 3.7,
      "wealth": 2.6,
      "investment": 1.1,
      "social": 3.6,
      "love": 3.1,
      "travel": 2.1,
      "health": 2.6,
      "decision": 3
    },
    "decade": {
      "overall": 1.2,
      "career": 2.3,
      "wealth": 1,
      "investment": 1,
      "social": 2.3,
      "love": 2.1,
      "travel": 1,
      "health": 1.2,
      "decision": 2.1
    }
  },
  "timeUnknown": {
    "day": {
      "overall": 6.1,
      "career": 5.7,
      "wealth": 4.7,
      "investment": 4.7,
      "social": 7,
      "love": 4.9,
      "travel": 3.4,
      "health": 6.4,
      "decision": 7.6
    },
    "month": {
      "overall": 4.6,
      "career": 4.5,
      "wealth": 3.9,
      "investment": 2.7,
      "social": 5.2,
      "love": 3.2,
      "travel": 2.3,
      "health": 4.9,
      "decision": 4
    },
    "year": {
      "overall": 2.6,
      "career": 3,
      "wealth": 2.6,
      "investment": 1,
      "social": 3.5,
      "love": 1.8,
      "travel": 2.1,
      "health": 2.6,
      "decision": 3.3
    },
    "decade": {
      "overall": 1.2,
      "career": 1.2,
      "wealth": 1,
      "investment": 1,
      "social": 2.3,
      "love": 2.1,
      "travel": 1,
      "health": 2.3,
      "decision": 2.1
    }
  }
};
/** 基準校正 B：樣本逐日 raw 的中位數（規則庫正負條數不對稱的校正，使一般日子落在 50 附近） */
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
export const CALIBRATION_INFO = { samples: 12, target: "中位數 50、約一成日子 ≥ 80（B = P50，K = (P90 − P50) / atanh(0.6)）", generatedAt: "2026-09-27" };
