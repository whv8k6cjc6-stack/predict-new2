/** 引擎登錄表：記錄每套系統目前的開發狀態。
 *  只有 status === "verified" 的引擎可以參與正式分數；其餘一律不產生個人分數。 */
import type { EngineMeta } from "./engine";
import type { DomainKey } from "./domains";
import type { DomainScore } from "./score";

const stamp = (school: string) => ({ school, engine_version: "0", rule_version: "0", source_version: "0" });

export const ENGINES: EngineMeta[] = [
  { id: "calendar", name: "曆法引擎", phase: 2, status: "verified", stamp: { school: "壽星天文曆＋本系統干支規則", engine_version: "3.0.0", rule_version: "—", source_version: "lunar-javascript 1.7.7" }, summary: "國曆／農曆、節氣、干支、時區與夏令時間、經緯度、真太陽時、換日規則（與獨立函式庫交叉驗證 10,000 個時刻）" },
  { id: "bazi", name: "八字＋滴天髓", phase: 3, status: "verified", stamp: { school: "子平（扶抑法）・滴天髓要旨", engine_version: "3.0.0", rule_version: "3.0.0", source_version: "滴天髓原文未匯入" }, summary: "本命、大運、流年、流月、流日、流時與規則證據鏈（大運與十二長生交叉驗證 800 組）" },
  { id: "ziwei", name: "紫微斗數", phase: 4, status: "verified", stamp: { school: "中州派基準・全書起例", engine_version: "3.0.0", rule_version: "3.0.0", source_version: "亮度表 iztro 2.6.1（MIT）" }, summary: "十二宮、主輔煞雜曜、四化、三方四正、大限流年流月流日（與 iztro 交叉驗證 400 組）" },
  { id: "qimen", name: "奇門遁甲", phase: 5, status: "not_implemented", stamp: stamp("時家轉盤"), summary: "九宮八門九星八神、值符值使、空亡、驛馬、事件用神與吉時方位" },
  { id: "iching", name: "易經", phase: 6, status: "not_implemented", stamp: stamp("周易・梅花易數"), summary: "六十四卦卦爻辭、本互變、體用、固定演算法起卦" },
  { id: "fusion", name: "交叉判讀", phase: 7, status: "not_implemented", stamp: stamp("—"), summary: "多術數訊號、一致度、分歧型態" },
  { id: "scoring", name: "正式運勢分數", phase: 8, status: "not_implemented", stamp: stamp("—"), summary: "九大領域分數，可反查至規則與古籍" },
];

export const STATUS_LABEL: Record<EngineMeta["status"], string> = {
  not_implemented: "尚未開發", in_development: "開發中", preview: "預覽", verified: "已驗證",
};

export const scoringReady = () => ENGINES.every(e => e.status === "verified");

/** 取得正式分數。引擎未全數驗證前固定回傳 unavailable。 */
export function getDomainScore(domain: DomainKey): DomainScore {
  if (!scoringReady()) {
    const next = ENGINES.find(e => e.status !== "verified")!;
    return { status: "unavailable", domain, reason: `${next.name}尚未完成，暫不產生分數。`, requiredPhase: 8 };
  }
  return { status: "unavailable", domain, reason: "計分引擎尚未接上。", requiredPhase: 8 };
}
