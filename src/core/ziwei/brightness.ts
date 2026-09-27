/** BrightnessEngine：廟旺利陷亮度表以 BrightnessProfile 管理，不同來源彼此獨立、不得混用。
 *  亮度只是判讀因素之一，本模組不做任何吉凶判斷。 */
import { BRIGHTNESS as IZTRO_261 } from "@/kb/ziwei-brightness";
import { m12 } from "./common";

export interface BrightnessProfile {
  id: string;
  name: string;
  softwareDataSource: string | null;
  classicalSource: string | null;
  brightnessSource: string;
  brightnessVersion: string;
  table: Readonly<Record<string, readonly string[]>>; // 由寅宮起至丑宮
  note: string;
}

export const BRIGHTNESS_PROFILES: Readonly<Record<string, BrightnessProfile>> = Object.freeze({
  "iztro-2.6.1": Object.freeze({
    id: "iztro-2.6.1",
    name: "iztro 2.6.1 亮度表",
    softwareDataSource: "iztro 2.6.1（MIT，https://github.com/SylarLong/iztro）STARS_INFO",
    classicalSource: null,
    brightnessSource: "iztro",
    brightnessVersion: "2.6.1",
    table: IZTRO_261,
    note: "程式資料來源，與 iztro 原始資料逐格一致（未修改）；非古籍原文，各派亮度表略有出入。",
  }),
});

export function brightnessProfile(id: string): BrightnessProfile {
  const p = BRIGHTNESS_PROFILES[id];
  if (!p) throw new Error(`找不到亮度表「${id}」`);
  return p;
}
export const brightnessOf = (p: BrightnessProfile, star: string, branch: number) => p.table[star]?.[m12(branch - 2)] ?? "";
