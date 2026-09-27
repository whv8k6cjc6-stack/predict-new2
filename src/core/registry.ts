/** 引擎登錄表：記錄每套系統目前的開發狀態。
 *  只有 status === "verified" 的引擎可以參與正式分數；其餘一律不產生個人分數。
 *  正式分數由 src/core/analysis 產生。 */
import type { EngineMeta } from "./engine";
import { WEIGHTS_VERSION, CALIBRATION_INFO } from "@/kb/weights";
import { ZIWEI_META } from "./ziwei";

export const ENGINES: EngineMeta[] = [
  { id: "calendar", name: "曆法引擎", phase: 2, status: "verified", stamp: { school: "壽星天文曆＋本系統干支規則", engine_version: "3.0.0", rule_version: "—", source_version: "lunar-javascript 1.7.7" }, summary: "國曆／農曆、節氣、干支、時區與夏令時間、經緯度、真太陽時、換日規則（與獨立函式庫交叉驗證 10,000 個時刻）" },
  { id: "bazi", name: "八字＋滴天髓", phase: 3, status: "verified", stamp: { school: "子平（扶抑法）・滴天髓要旨", engine_version: "3.0.0", rule_version: "3.0.0", source_version: "滴天髓原文未匯入" }, summary: "本命、大運、流年、流月、流日、流時與規則證據鏈（大運與十二長生交叉驗證 800 組）" },
  { ...ZIWEI_META, summary: "排盤：十二宮、主輔煞雜曜、四化、三方四正、大限流年流月流日（與 iztro 相容設定逐欄一致；金樣本 651 組）。判讀引擎重建中，暫不計分" },
  { id: "qimen", name: "奇門遁甲", phase: 5, status: "verified", stamp: { school: "時家轉盤・拆補法", engine_version: "3.0.0", rule_version: "3.0.0", source_version: "通行格局表" }, summary: "九宮八門九星八神、值符值使、空亡、驛馬、事件用神與吉時方位（與 qimen-dunjia 交叉驗證 1,000 盤）" },
  { id: "iching", name: "易經", phase: 6, status: "verified", stamp: { school: "周易・梅花易數體用", engine_version: "3.0.0", rule_version: "3.0.0", source_version: "周易通行本（@freizl/yijing 2.1.0＋勘誤 26 條）" }, summary: "六十四卦卦爻辭原文（附勘誤表與待校標記）、本互變、體用生剋、固定演算法起卦" },
  { id: "fusion", name: "交叉判讀", phase: 7, status: "verified", stamp: { school: "各系統獨立判讀後比對", engine_version: "3.0.0", rule_version: WEIGHTS_VERSION, source_version: "—" }, summary: "各系統長期／短期訊號、確定度五級、分歧型態（長吉短凶、結構好時機差…）" },
  { id: "scoring", name: "正式運勢分數", phase: 8, status: "verified", stamp: { school: "tanh 映射・樣本校準", engine_version: "3.0.0", rule_version: WEIGHTS_VERSION, source_version: `校準樣本 ${CALIBRATION_INFO.samples} 組` }, summary: "九大領域分數，可反查：分數 → 加權項目 → 規則 → 命盤因素 → 古籍原文" },
];

export const STATUS_LABEL: Record<EngineMeta["status"], string> = {
  not_implemented: "尚未開發", in_development: "開發中", preview: "預覽", verified: "已驗證",
};

export const scoringReady = () => ENGINES.every(e => e.status === "verified");
