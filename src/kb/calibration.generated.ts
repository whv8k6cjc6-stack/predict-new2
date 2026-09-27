/** 由 scripts/calibrate.test.ts 產生，勿手改。樣本：12 組合成命例；day 以 2026 全年逐日、month 以 2025–2027 逐月、year 以 2000–2039 逐年、decade 以 1990–2060 每十年。 */
import type { DomainKey } from "@/core/domains";
import type { Level, Profile } from "./weights";
type KTable = Record<DomainKey, number>;
/** 尺度常數 K：score = round(50 + 50 × tanh((raw − B) / K))；依校準組別（full／noZiwei）分開 */
export const K: Record<Profile, Record<Level, KTable>> = {
  "full": {
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
  },
  "noZiwei": {
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
export const B: Record<Profile, Record<Level, KTable>> = {
  "full": {
    "day": {
      "overall": 0.3,
      "career": 3.53,
      "wealth": 2.29,
      "investment": 0.23,
      "social": 2.26,
      "love": 2,
      "travel": 2.54,
      "health": 0.63,
      "decision": 1.44
    },
    "month": {
      "overall": -0.05,
      "career": 1.42,
      "wealth": 0.76,
      "investment": -0.02,
      "social": 1.33,
      "love": 1.49,
      "travel": 0.65,
      "health": -0.26,
      "decision": 0.73
    },
    "year": {
      "overall": -0.17,
      "career": 1,
      "wealth": 0,
      "investment": 0,
      "social": 1.07,
      "love": 0.67,
      "travel": 0.41,
      "health": 0,
      "decision": 0
    },
    "decade": {
      "overall": 0,
      "career": 0.83,
      "wealth": 0,
      "investment": 0.54,
      "social": 0.49,
      "love": 0.54,
      "travel": 0.32,
      "health": 0.49,
      "decision": 0
    }
  },
  "noZiwei": {
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
