/** 判讀語境（客觀資料，不含吉凶）：
 *  - SanFangSiZhengContext：本宮坐守／對宮／三合宮 A／三合宮 B 分開保存（照會星不等於坐守星）
 *  - TransformationContext：生年、大限、流年四化分開保存（宮干飛化尚未實作）
 *  - EmptyPalaceContext：借對宮只作參考，borrowedStarWeight 維持 undefined
 *  - Natal／DaXian／Annual Context：本命 → 大限 → 流年三層，後兩層只作修正，不推翻本命 */
import type { ZiweiNatal } from "../chart";
import type { ZiweiTransit } from "../luck";
import { BR, type Hua, type PalaceName } from "../common";
import { MINOR_CATEGORY } from "../stars";
import { palaceNameAt } from "../structure";
import { sanFangSiZheng, type SanFangRole } from "../relations";

export type ContextLayer = "natal" | "decade" | "annual";
export const LAYER_LABEL: Record<ContextLayer, string> = { natal: "本命", decade: "大限", annual: "流年" };
export type StarCategory = "major" | "benefic" | "malefic" | "lucun" | "tianma" | "misc";

export interface StarRef { name: string; brightness: string; category: StarCategory }
export interface TransformationRef {
  star: string; transformation: Hua; type: "birthYear" | "decade" | "annual"; sourceStem: string;
  branch: number | null; natalPalace: PalaceName | null; ruleId: string;
}
export interface PalaceView {
  branch: number; earthlyBranch: string;
  natalName: PalaceName; decadeName: PalaceName | null; annualName: PalaceName | null;
  residentMajor: StarRef[]; residentMinor: StarRef[]; misc: string[];
  isEmpty: boolean; isBodyPalace: boolean;
  transformations: TransformationRef[];   // 坐守此宮的星曜所帶各層四化
}
export interface SanFangMemberContext {
  relationType: SanFangRole; branch: number;
  palaceName: PalaceName;                 // 在該層（本命／大限／流年）的宮名
  natalName: PalaceName;
  residentMajor: StarRef[]; residentMinor: StarRef[]; transformations: TransformationRef[];
}
export interface SanFangSiZhengContext { layer: ContextLayer; focusPalace: PalaceName; focusBranch: number; members: SanFangMemberContext[] }
export interface EmptyPalaceContext {
  natalName: PalaceName; branch: number; isEmpty: boolean;
  residentStars: string[];
  borrowedStars: { name: string; brightness: string; fromPalace: PalaceName; fromBranch: number }[];
  borrowedStarWeight: undefined;
  note: string;
}
export interface LayerContext {
  layer: ContextLayer; label: string; lifeBranch: number; lifeOnNatal: PalaceName; stem: string | null;
  transformations: TransformationRef[];
}
export interface ZiweiInterpretationContexts {
  natal: LayerContext; decade: LayerContext | null; annual: LayerContext | null;
  palaces: PalaceView[];
  transformations: { birthYear: TransformationRef[]; decade: TransformationRef[]; annual: TransformationRef[] };
  emptyPalaces: EmptyPalaceContext[];
}

const TYPE_MAP = { birthYear: "birthYear", decade: "decade", annual: "annual" } as const;

export function buildContexts(n: ZiweiNatal, t: ZiweiTransit | null): ZiweiInterpretationContexts {
  const P = n.profile;
  const ref = (list: { star: string; transformation: Hua; sourceStem: string; ruleId: string }[], type: TransformationRef["type"]): TransformationRef[] =>
    list.map(x => {
      const b = n.starBranch[x.star];
      return { star: x.star, transformation: x.transformation, type, sourceStem: x.sourceStem, branch: b ?? null, natalPalace: b !== undefined ? n.palaces[b].name : null, ruleId: x.ruleId };
    });
  const birthYear = ref(n.birthTransformations, TYPE_MAP.birthYear);
  const dScope = t?.scopes.decade ?? null, yScope = t?.scopes.year ?? null;
  const decade = dScope ? ref(dScope.transformations, "decade") : [];
  const annual = yScope ? ref(yScope.transformations, "annual") : [];
  const allT = [...birthYear, ...decade, ...annual];

  const palaces: PalaceView[] = n.palaces.map(p => ({
    branch: p.branch, earthlyBranch: BR[p.branch],
    natalName: p.name,
    decadeName: dScope ? palaceNameAt(dScope.lifeBranch, p.branch, P) : null,
    annualName: yScope ? palaceNameAt(yScope.lifeBranch, p.branch, P) : null,
    residentMajor: p.major.map(s => ({ name: s.name, brightness: s.brightness, category: "major" as const })),
    residentMinor: p.minor.map(s => ({ name: s.name, brightness: s.brightness, category: (MINOR_CATEGORY[s.name] ?? "misc") as StarCategory })),
    misc: p.misc, isEmpty: !p.major.length, isBodyPalace: p.isBodyPalace,
    transformations: allT.filter(x => x.branch === p.branch),
  }));

  const emptyPalaces: EmptyPalaceContext[] = n.palaces.filter(p => !p.major.length).map(p => ({
    natalName: p.name, branch: p.branch, isEmpty: true,
    residentStars: p.empty.residentStars,
    borrowedStars: p.empty.borrowedStars.map(s => ({ name: s.name, brightness: s.brightness, fromPalace: s.fromPalace, fromBranch: s.fromBranch })),
    borrowedStarWeight: undefined,
    note: "借對宮主星只作參考；古籍未給數值前，不替借星設定任何權重。",
  }));

  const layer = (l: ContextLayer, lifeBranch: number, stem: string | null, tr: TransformationRef[]): LayerContext =>
    ({ layer: l, label: LAYER_LABEL[l], lifeBranch, lifeOnNatal: n.palaces[lifeBranch].name, stem, transformations: tr });

  return {
    natal: layer("natal", n.lifeBranch, null, birthYear),
    decade: dScope ? layer("decade", dScope.lifeBranch, dScope.stem, decade) : null,
    annual: yScope ? layer("annual", yScope.lifeBranch, yScope.stem, annual) : null,
    palaces, transformations: { birthYear, decade, annual }, emptyPalaces,
  };
}

const nameIn = (p: PalaceView, l: ContextLayer) => l === "natal" ? p.natalName : l === "decade" ? p.decadeName : p.annualName;

/** 某一層某宮的三方四正語境（例：流年官祿的三方四正） */
export function sanFangContext(ctx: ZiweiInterpretationContexts, n: ZiweiNatal, palace: PalaceName, layerName: ContextLayer = "natal"): SanFangSiZhengContext | null {
  const focus = ctx.palaces.find(p => nameIn(p, layerName) === palace);
  if (!focus) return null;
  return {
    layer: layerName, focusPalace: palace, focusBranch: focus.branch,
    members: sanFangSiZheng(focus.branch, n.profile).map(m => {
      const p = ctx.palaces[m.branch];
      return {
        relationType: m.role, branch: m.branch, palaceName: nameIn(p, layerName)!, natalName: p.natalName,
        residentMajor: p.residentMajor, residentMinor: p.residentMinor, transformations: p.transformations,
      };
    }),
  };
}

/** TransformationInterpretationContext：以某層某宮為焦點，列出各層四化落在三方四正的哪個位置（只描述，不下吉凶）。
 *  timeLayer：birthYear（生年）／decade（大限）／annual（流年）；宮干飛化尚未實作（futureFlying 保留欄位）。 */
export interface TransformationInterpretationContext {
  star: string; transformation: Hua; sourceStem: string;
  palace: PalaceName | null;              // 四化星所在的本命宮
  relationType: SanFangRole | "outside";  // 相對於焦點宮：本宮／對宮／三合／不在三方四正
  timeLayer: TransformationRef["type"];
  ruleId: string;
}
export function transformationContext(ctx: ZiweiInterpretationContexts, n: ZiweiNatal, focus: PalaceName, layerName: ContextLayer = "natal"): TransformationInterpretationContext[] {
  const sf = sanFangContext(ctx, n, focus, layerName);
  const all = [...ctx.transformations.birthYear, ...ctx.transformations.decade, ...ctx.transformations.annual];
  return all.map(t => {
    const m = sf?.members.find(x => x.branch === t.branch);
    return { star: t.star, transformation: t.transformation, sourceStem: t.sourceStem, palace: t.natalPalace, relationType: m ? m.relationType : "outside", timeLayer: t.type, ruleId: t.ruleId };
  });
}
