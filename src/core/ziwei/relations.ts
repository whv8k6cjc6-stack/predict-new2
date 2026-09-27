/** SanFangSiZhengEngine、EmptyPalaceEngine、FlyingTransformationEngine（客觀關係，不含吉凶權重）。 */
import type { ZiweiRuleProfile } from "./profile";
import { m12, type PalaceName } from "./common";

// ───────── 三方四正 ─────────
export type SanFangRole = "self" | "opposite" | "trine1" | "trine2";
export const SANFANG_ROLE_LABEL: Record<SanFangRole, string> = { self: "本宮", opposite: "對宮", trine1: "三合宮1", trine2: "三合宮2" };
export interface SanFangMember { branch: number; role: SanFangRole }

export function sanFangSiZheng(branch: number, P: ZiweiRuleProfile): SanFangMember[] {
  if (P.rules.sanFangDefinition.value !== "selfOppositeTwoTrines") throw new Error("尚未實作的三方四正定義");
  return [
    { branch: m12(branch), role: "self" }, { branch: m12(branch + 6), role: "opposite" },
    { branch: m12(branch + 4), role: "trine1" }, { branch: m12(branch + 8), role: "trine2" },
  ];
}
/** 相容用：[本宮, 對宮, 三合, 三合] */
export const sanfang = (b: number) => [b, m12(b + 6), m12(b + 4), m12(b + 8)];

// ───────── 無主星借對宮 ─────────
export interface EmptyPalaceInfo {
  branch: number;
  hasResidentMainStars: boolean;
  /** 本宮實際坐守的星（主星、輔煞、雜曜皆在此，不含借星） */
  residentStars: string[];
  /** 借對宮主星「參考」；不是本宮坐守主星 */
  borrowedStars: { name: string; brightness: string; fromBranch: number; fromPalace: PalaceName }[];
  borrowedStarWeight: number | undefined;
  weightStatus: "pendingVerification";
  rule: string;
}

export function emptyPalace(
  palace: { branch: number; major: { name: string }[]; minor: { name: string }[]; misc: string[] },
  opposite: { branch: number; name: PalaceName; major: { name: string; brightness: string }[] },
  P: ZiweiRuleProfile,
): EmptyPalaceInfo {
  const empty = palace.major.length === 0;
  return {
    branch: palace.branch,
    hasResidentMainStars: !empty,
    residentStars: [...palace.major.map(s => s.name), ...palace.minor.map(s => s.name), ...palace.misc],
    borrowedStars: empty ? opposite.major.map(s => ({ name: s.name, brightness: s.brightness, fromBranch: opposite.branch, fromPalace: opposite.name })) : [],
    borrowedStarWeight: P.rules.emptyPalaceRule.value.borrowedStarWeight,
    weightStatus: "pendingVerification",
    rule: P.rules.emptyPalaceRule.label,
  };
}

// ───────── 宮干飛化（未啟用） ─────────
export function flyingTransformations(P: ZiweiRuleProfile): { enabled: false; reason: string } {
  return { enabled: false, reason: `${P.name}：${P.rules.flyingTransformation.label}` };
}
