/** ZiweiChartEngine：組合各排盤模組，產生本命盤（只含客觀位置，不含任何吉凶判讀）。
 *  流程：PersonProfile → CalculationSettings → ZiweiRuleProfile → ZiWeiCalendarEngine → 各排盤模組 → 本命盤。 */
import { STEMS, type GanZhi } from "../calendar/ganzhi";
import type { ResolvedTime } from "../calendar/resolve";
import type { ChartInput } from "../engine";
import { resolveZiweiProfile, type ZiweiRuleProfile } from "./profile";
import { ziweiCalendar } from "./calendar";
import { fiveElementBureau, lifeBodyPalace, lifePalaceGz, palaceLayoutTrace, palaceNameAt, palaceStem } from "./structure";
import { MINOR_CATEGORY, placeMainStars, placeMinorStars } from "./stars";
import { brightnessOf, brightnessProfile } from "./brightness";
import { transformationsOf, type Transformation } from "./transformations";
import { decadeDirection, decadeRange, decadeTrace } from "./luck";
import { emptyPalace, type EmptyPalaceInfo } from "./relations";
import { BR, HUA, LUCKY6, MAJOR, MISC5, PALACE_IDS, SHA6, chartVersions, m12, type Hua, type PalaceName, type TraceStep, type ZiweiChartVersions } from "./common";

export interface ZiweiStar { name: string; brightness: string; hua?: Hua }
export interface ZiweiPalace {
  branch: number; name: PalaceName; stem: number; gz: string;
  major: ZiweiStar[];            // 本宮坐守十四主星（mainStars）
  minor: ZiweiStar[];            // 本宮輔曜、煞曜、祿存、天馬
  misc: string[];                // 本宮雜曜
  decade: [number, number];      // 大限歲數（虛歲）
  palaceId: string;
  earthlyBranch: string; heavenlyStem: string;
  beneficStars: string[]; maleficStars: string[];
  transformations: Transformation[]; // 本宮星曜所帶之生年四化（結構化）
  isBodyPalace: boolean;
  empty: EmptyPalaceInfo;        // 無主星時的借對宮資料（借星不列入 major）
}

export interface ZiweiNatal {
  resolved: ResolvedTime;
  lunar: { year: number; month: number; day: number; isLeap: boolean; effectiveMonth: number };
  yearGz: GanZhi; hourBranch: number;
  lifeBranch: number; bodyBranch: number; bodyPalace: PalaceName;
  ju: number; juName: string;
  palaces: ZiweiPalace[];              // 依地支 0..11
  birthHua: Record<Hua, { star: string; palace: PalaceName | null }>;
  birthTransformations: Transformation[];
  forward: boolean;
  /** 輸入的性別（只傳遞輸入資料，供判讀層「入男命／入女命」條件使用；不影響任何排盤位置） */
  gender: ChartInput["gender"];
  starBranch: Record<string, number>;
  notes: string[];
  profile: ZiweiRuleProfile;
  meta: {
    ruleProfileId: string; ruleProfileName: string; ruleProfileVersion: string; ruleProfileKind: ZiweiRuleProfile["kind"];
    versions: ZiweiChartVersions; brightnessProfileId: string; brightnessSource: string; brightnessVersion: string;
  };
  trace: TraceStep[];
}

/** 由計算設定解析紫微 Profile：自訂／legacy Profile 需由呼叫端先解析並放入 input.ziweiProfile */
export const profileOf = (input: ChartInput): ZiweiRuleProfile => input.ziweiProfile ?? resolveZiweiProfile(input.settings.ziwei.ruleProfileId);

export function computeZiweiNatal(input: ChartInput): ZiweiNatal {
  const P = profileOf(input);
  if (input.ziweiProfile && input.ziweiProfile.id !== input.settings.ziwei.ruleProfileId) throw new Error("紫微 Profile 與計算設定不一致");
  const cal = ziweiCalendar(input.birth, P);
  const { life, body, trace: lbTrace } = lifeBodyPalace(cal.effectiveMonth, cal.hourBranch, P);
  const lifeGz = lifePalaceGz(life, cal.yearStem, P);
  const bureau = fiveElementBureau(lifeGz, P);
  const main = placeMainStars(bureau.ju, cal.lunar.day, P);
  const minor = placeMinorStars({ yearStem: cal.yearStem, yearBranch: cal.yearBranch, month: cal.effectiveMonth, hourBranch: cal.hourBranch }, P);
  const stars = { ...main.stars, ...minor.stars };
  const bp = brightnessProfile(P.rules.brightnessProfileId.value);
  const birthTransformations = transformationsOf(STEMS[cal.yearStem], "birthYear", P);
  const huaOfStar = Object.fromEntries(birthTransformations.map(t => [t.star, t.transformation])) as Record<string, Hua>;
  const dir = decadeDirection(cal.yearStem, input.gender, P);

  const base = Array.from({ length: 12 }, (_, b) => {
    const inHere = Object.entries(stars).filter(([, v]) => v === b).map(([n]) => n);
    const mk = (n: string): ZiweiStar => ({ name: n, brightness: brightnessOf(bp, n, b), hua: huaOfStar[n] });
    const stem = palaceStem(cal.yearStem, b, P);
    const name = palaceNameAt(life, b, P);
    const major = inHere.filter(n => MAJOR.includes(n)).map(mk);
    const minorStars = inHere.filter(n => LUCKY6.includes(n) || SHA6.includes(n) || n === "祿存" || n === "天馬").map(mk);
    return {
      branch: b, name, stem, gz: STEMS[stem] + BR[b],
      major, minor: minorStars, misc: inHere.filter(n => MISC5.includes(n)),
      decade: decadeRange(b, life, bureau.ju, dir.forward, P),
      palaceId: PALACE_IDS[name], earthlyBranch: BR[b], heavenlyStem: STEMS[stem],
      beneficStars: minorStars.filter(s => MINOR_CATEGORY[s.name] === "benefic").map(s => s.name),
      maleficStars: minorStars.filter(s => MINOR_CATEGORY[s.name] === "malefic").map(s => s.name),
      transformations: birthTransformations.filter(t => stars[t.star] === b),
      isBodyPalace: b === body,
    };
  });
  const palaces: ZiweiPalace[] = base.map(p => ({ ...p, empty: emptyPalace(p, base[m12(p.branch + 6)], P) }));
  const palaceAt = (b: number) => palaces[b].name;
  const birthHua = Object.fromEntries(HUA.map(h => {
    const t = birthTransformations.find(x => x.transformation === h)!;
    return [h, { star: t.star, palace: stars[t.star] !== undefined ? palaceAt(stars[t.star]) : null }];
  })) as ZiweiNatal["birthHua"];

  const trace: TraceStep[] = [
    ...cal.trace, ...lbTrace,
    { id: "palace.bodyLanding", module: "LifeBodyPalaceEngine", title: "身宮落宮", inputs: { 身宮: BR[body] }, result: `${BR[body]}宮在本命盤為${palaceAt(body)}，身宮在${palaceAt(body)}` },
    palaceLayoutTrace(life, cal.yearStem, P), bureau.trace, ...main.trace, minor.trace,
    { id: "transform.birth", module: "TransformationEngine", title: "生年四化", rule: { field: "fourTransformationsTable", label: P.rules.fourTransformationsTable.label },
      inputs: { 生年干: STEMS[cal.yearStem], 四化表: P.id }, result: birthTransformations.map(t => `${t.star}化${t.transformation}`).join("、") },
    { id: "brightness", module: "BrightnessEngine", title: "星曜亮度", rule: { field: "brightnessProfileId", label: P.rules.brightnessProfileId.label },
      inputs: { 亮度表: bp.id }, result: `${bp.name}（${bp.softwareDataSource}；古籍來源：${bp.classicalSource ?? "無"}）` },
    dir.trace, decadeTrace(bureau.ju, bureau.juName, P),
  ];

  return {
    resolved: cal.resolved,
    lunar: { ...cal.lunar, effectiveMonth: cal.effectiveMonth },
    yearGz: cal.yearGz, hourBranch: cal.hourBranch, lifeBranch: life, bodyBranch: body, bodyPalace: palaceAt(body),
    ju: bureau.ju, juName: bureau.juName, palaces, birthHua, birthTransformations, forward: dir.forward, gender: input.gender, starBranch: stars, notes: cal.notes,
    profile: P,
    meta: {
      ruleProfileId: P.id, ruleProfileName: P.name, ruleProfileVersion: P.version, ruleProfileKind: P.kind, versions: chartVersions(P.version),
      brightnessProfileId: bp.id, brightnessSource: bp.brightnessSource, brightnessVersion: bp.brightnessVersion,
    },
    trace,
  };
}
