import type { Grade } from "@/types/daily";

/** 運勢評分等級（0–100 分）。分級門檻以一整年逐日分布校準，大吉約一成、凶約一成。 */
export const GRADES: Grade[] = [
  { name: "大吉", stars: 5, min: 82, tone: "great", meaning: "天時地利人和，難得的好日子。", attitude: "放手推進重要事項，主動把握機會。" },
  { name: "吉", stars: 4, min: 70, tone: "good", meaning: "運勢順暢，助力多於阻力。", attitude: "積極行動，按計畫推進。" },
  { name: "小吉", stars: 3, min: 58, tone: "fair", meaning: "整體不錯，小有助力。", attitude: "穩中求進，準備好再出手。" },
  { name: "平", stars: 2, min: 45, tone: "flat", meaning: "平穩無大起落。", attitude: "按部就班，處理例行事務。" },
  { name: "小凶", stars: 1, min: 33, tone: "low", meaning: "阻力稍多、容易卡關，不代表會出事。", attitude: "放慢腳步、多確認，重大決定可緩。" },
  { name: "凶", stars: 0, min: 0, tone: "bad", meaning: "逆風的一天，事倍功半。", attitude: "以守為攻、照顧好自己，大事改期。" },
];

export const gradeOf = (score: number): Grade => GRADES.find(g => score >= g.min) ?? GRADES[GRADES.length - 1];
