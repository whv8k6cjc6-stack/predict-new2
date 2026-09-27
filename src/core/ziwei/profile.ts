/** ZiweiRuleProfile：紫微斗數排盤規則集合（固定、不可修改、版本化）。
 *
 *  - 標準 Profile 寫在程式中並深度凍結；任何核心規則不同，即為另一個 Profile（custom／legacy），
 *    以 baseProfileId＋overrides 記錄差異，不得沿用標準 Profile 的 id。
 *  - 每條規則標明：採用值、軟體資料來源（softwareDataset）、古籍來源（classicalSource；無則為 null，不臆造）、驗證狀態。
 *  - 本檔只定義「規則是什麼」；計算在各排盤模組中依規則值執行。 */

export type VerificationLevel = "iztroMatched" | "ruleVerified" | "pendingVerification";

export interface RuleEntry<T> {
  value: T;
  label: string;                 // 人類可讀的規則說明
  basis?: string;                // 使用出生年／月／日／時的哪一項
  softwareDataset: string | null;// 例：iztro 2.6.1（相容參考，非古籍）
  classicalSource: string | null;// 古籍出處；未確認則為 null
  verification: VerificationLevel;
  note?: string;
}

export type Stem = "甲" | "乙" | "丙" | "丁" | "戊" | "己" | "庚" | "辛" | "壬" | "癸";
export type SihuaTable = Record<Stem, readonly [string, string, string, string]>; // 祿、權、科、忌
export type LeapMonthRule = "splitAt15" | "asCurrent" | "asNext";
export type DayBoundaryRule = "00:00" | "23:00";

export interface ZiweiRules {
  ziweiYearBoundary: RuleEntry<"lunarNewYear">;
  leapMonthRule: RuleEntry<LeapMonthRule>;
  dayBoundaryRule: RuleEntry<DayBoundaryRule>;
  lifeBodyPalaceRule: RuleEntry<"yinStartMonthThenHour">;
  palaceStemRule: RuleEntry<"fiveTigers">;
  bureauRule: RuleEntry<"lifePalaceNayin">;
  starPlacementAlgorithm: RuleEntry<"common">;
  mainStarOffsets: RuleEntry<{ ziwei: Record<string, number>; tianfu: Record<string, number> }>;
  zuoYouRule: RuleEntry<"chenForwardXuBackwardByMonth">;
  changQuRule: RuleEntry<"xuBackwardChenForwardByHour">;
  kuiYueRule: RuleEntry<Record<Stem, readonly [number, number]>>;
  luCunTable: RuleEntry<Record<Stem, number>>;
  yangTuoRule: RuleEntry<"luCunPlusMinusOne">;
  fireBellRule: RuleEntry<"threeHarmonyStartForwardByHourNoDirection">;
  kongJieRule: RuleEntry<"haiByHour">;
  tianMaRule: RuleEntry<"yearBranchThreeHarmony">;
  taohuaRules: RuleEntry<"xianchiByThreeHarmony_hongluanFromMao_tianxiOpposite">;
  xingYaoRule: RuleEntry<"tianxingFromYou_tianyaoFromChou_byMonth">;
  fourTransformationsTable: RuleEntry<SihuaTable>;
  brightnessProfileId: RuleEntry<string>;
  ageSystem: RuleEntry<"nominal">;
  decadeStartRule: RuleEntry<"bureauNumber">;
  decadeDirectionRule: RuleEntry<"yangMaleYinFemaleForward">;
  decadeStemRule: RuleEntry<"palaceStem">;
  annualRule: RuleEntry<"taiSuiPalace">;
  monthlyRule: RuleEntry<"douJun">;
  dailyRule: RuleEntry<"douJunDay">;
  sanFangDefinition: RuleEntry<"selfOppositeTwoTrines">;
  emptyPalaceRule: RuleEntry<{ borrowFrom: "opposite"; borrowedStarWeight: number | undefined }>;
  flyingTransformation: RuleEntry<"disabled">;
  palaceNaming: RuleEntry<readonly string[]>;
}

export interface ZiweiRuleProfile {
  id: string;
  name: string;
  version: string;
  kind: "builtin" | "custom" | "legacy";
  baseProfileId: string | null;
  overrides: ProfileOverride[];
  description: string;
  rules: ZiweiRules;
}

/** 目前允許覆寫的規則（皆為程式已實作、且曾在舊版設定中存在的選項；不新增未確認的命理規則） */
export type ProfileOverride =
  | { field: "leapMonthRule"; value: LeapMonthRule }
  | { field: "dayBoundaryRule"; value: DayBoundaryRule }
  | { field: "gengTransformation"; value: "陽武陰同" | "陽武同陰" };

const IZ = "iztro 2.6.1（MIT，algorithm=default）";

const deepFreeze = <T,>(o: T): T => {
  if (o && typeof o === "object" && !Object.isFrozen(o)) { Object.freeze(o); for (const v of Object.values(o)) deepFreeze(v); }
  return o;
};

export const SIHUA_COMMON: SihuaTable = {
  甲: ["廉貞", "破軍", "武曲", "太陽"], 乙: ["天機", "天梁", "紫微", "太陰"], 丙: ["天同", "天機", "文昌", "廉貞"],
  丁: ["太陰", "天同", "天機", "巨門"], 戊: ["貪狼", "太陰", "右弼", "天機"], 己: ["武曲", "貪狼", "天梁", "文曲"],
  庚: ["太陽", "武曲", "太陰", "天同"], 辛: ["巨門", "太陽", "文曲", "文昌"], 壬: ["天梁", "紫微", "左輔", "武曲"],
  癸: ["破軍", "巨門", "太陰", "貪狼"],
};

const e = <T,>(value: T, label: string, extra: Partial<RuleEntry<T>> = {}): RuleEntry<T> =>
  ({ value, label, softwareDataset: IZ, classicalSource: null, verification: "iztroMatched", ...extra });

export const IZTRO_COMPATIBLE_V1: ZiweiRuleProfile = deepFreeze({
  id: "iztro_compatible_v1",
  name: "通行排盤（iztro 相容）",
  version: "1.0.0",
  kind: "builtin",
  baseProfileId: null,
  overrides: [],
  description: "通行起例排盤，與 iztro 2.6.1（algorithm=default、yearDivide=normal、dayDivide=current、fixLeap=true）逐欄相容。這是本 App 的預設排盤體系，不代表紫微斗數唯一正確的算法。",
  rules: {
    ziweiYearBoundary: e("lunarNewYear", "本命年干支與流年以農曆正月初一換年", { basis: "出生年", note: "對應 iztro yearDivide=normal；八字另以立春換年，互不影響" }),
    leapMonthRule: e("splitAt15", "閏月：十五日（含）以前算本月，十六日以後算下月", { basis: "出生月", note: "對應 iztro fixLeap=true" }),
    dayBoundaryRule: e("00:00", "日界 00:00：23:00–24:00 出生仍算當日，時辰取子", { basis: "出生日、時", note: "對應 iztro dayDivide=current；iztro 預設 forward（晚子時僅於安紫微時以次日計）不同" }),
    lifeBodyPalaceRule: e("yinStartMonthThenHour", "寅宮起正月順數至生月；自該宮起子時，命宮逆數、身宮順數至生時", { basis: "出生月、時" }),
    palaceStemRule: e("fiveTigers", "五虎遁：依年干定寅宮天干，順推十二宮", { basis: "出生年干" }),
    bureauRule: e("lifePalaceNayin", "命宮干支納音五行定局：水二、木三、金四、土五、火六", { basis: "命宮干支" }),
    starPlacementAlgorithm: e("common", "通行安星法（非 iztro zhongzhou 選項）"),
    mainStarOffsets: e({
      ziwei: { 紫微: 0, 天機: -1, 太陽: -3, 武曲: -4, 天同: -5, 廉貞: -8 },
      tianfu: { 天府: 0, 太陰: 1, 貪狼: 2, 巨門: 3, 天相: 4, 天梁: 5, 七殺: 6, 破軍: 10 },
    }, "紫微星系自紫微逆行、天府星系自天府順行之宮距", { basis: "紫微、天府落宮" }),
    zuoYouRule: e("chenForwardXuBackwardByMonth", "左輔：辰起正月順數至生月；右弼：戌起正月逆數至生月", { basis: "出生月" }),
    changQuRule: e("xuBackwardChenForwardByHour", "文昌：戌起子時逆數至生時；文曲：辰起子時順數至生時", { basis: "出生時" }),
    kuiYueRule: e({
      甲: [1, 7], 乙: [0, 8], 丙: [11, 9], 丁: [11, 9], 戊: [1, 7], 己: [0, 8], 庚: [1, 7], 辛: [6, 2], 壬: [3, 5], 癸: [3, 5],
    }, "天魁天鉞：甲戊庚牛羊、乙己鼠猴鄉、丙丁豬雞位、壬癸兔蛇藏、六辛逢馬虎", { basis: "出生年干", note: "值為地支序（子=0）：[天魁, 天鉞]" }),
    luCunTable: e({ 甲: 2, 乙: 3, 丙: 5, 丁: 6, 戊: 5, 己: 6, 庚: 8, 辛: 9, 壬: 11, 癸: 0 }, "祿存：甲寅、乙卯、丙戊巳、丁己午、庚申、辛酉、壬亥、癸子", { basis: "出生年干" }),
    yangTuoRule: e("luCunPlusMinusOne", "擎羊在祿存前一宮，陀羅在祿存後一宮", { basis: "出生年干" }),
    fireBellRule: e("threeHarmonyStartForwardByHourNoDirection", "火星鈴星：依年支三合定起宮（寅午戌：丑卯；申子辰：寅戌；巳酉丑：卯戌；亥卯未：酉戌），順數至生時；不分陰陽男女順逆", { basis: "出生年支、時" }),
    kongJieRule: e("haiByHour", "地劫：亥起子時順數至生時；地空：亥起子時逆數至生時", { basis: "出生時" }),
    tianMaRule: e("yearBranchThreeHarmony", "天馬：申子辰在寅、寅午戌在申、巳酉丑在亥、亥卯未在巳", { basis: "出生年支" }),
    taohuaRules: e("xianchiByThreeHarmony_hongluanFromMao_tianxiOpposite", "咸池：申子辰酉、寅午戌卯、巳酉丑午、亥卯未子；紅鸞：卯起子年逆數至生年支；天喜：紅鸞對宮", { basis: "出生年支" }),
    xingYaoRule: e("tianxingFromYou_tianyaoFromChou_byMonth", "天刑：酉起正月順數至生月；天姚：丑起正月順數至生月", { basis: "出生月" }),
    fourTransformationsTable: e(SIHUA_COMMON, "十干四化（祿、權、科、忌）：庚干陽武陰同、戊干右弼科、壬干左輔科", { basis: "天干" }),
    brightnessProfileId: e("iztro-2.6.1", "廟旺利陷採 iztro 2.6.1 亮度表（程式資料來源，非古籍）"),
    ageSystem: e("nominal", "大限與流運歲數採虛歲，農曆正月初一增歲"),
    decadeStartRule: e("bureauNumber", "第一大限自五行局數之歲起（金四局 4 歲）"),
    decadeDirectionRule: e("yangMaleYinFemaleForward", "陽男陰女順行、陰男陽女逆行（年干陰陽）", { basis: "出生年干、性別" }),
    decadeStemRule: e("palaceStem", "大限天干取該大限宮之宮干"),
    annualRule: e("taiSuiPalace", "流年命宮在流年太歲地支之宮"),
    monthlyRule: e("douJun", "流月以斗君定：流年支逆數生月、順數生時得斗君（正月），再順數至流月"),
    dailyRule: e("douJunDay", "流日自流月命宮順數至農曆日"),
    sanFangDefinition: e("selfOppositeTwoTrines", "三方四正：本宮、對宮（+6）、三合宮（+4、+8）"),
    emptyPalaceRule: e({ borrowFrom: "opposite", borrowedStarWeight: undefined }, "本宮無十四主星時借對宮主星參考；借星權重尚無可靠來源，暫不量化", { softwareDataset: null, verification: "pendingVerification", note: "borrowedStarWeight 保持未定義，不自行設定數值" }),
    flyingTransformation: e("disabled", "宮干飛化：本 Profile 未啟用", { softwareDataset: null, verification: "pendingVerification" }),
    palaceNaming: e(["命宮", "兄弟", "夫妻", "子女", "財帛", "疾厄", "遷移", "交友", "官祿", "田宅", "福德", "父母"], "十二宮名稱（交友＝iztro 之僕役）"),
  },
});

export const BUILTIN_ZIWEI_PROFILES: Readonly<Record<string, ZiweiRuleProfile>> = Object.freeze({ [IZTRO_COMPATIBLE_V1.id]: IZTRO_COMPATIBLE_V1 });
export const DEFAULT_ZIWEI_PROFILE_ID = IZTRO_COMPATIBLE_V1.id;

/** 儲存在本機資料庫的自訂／legacy Profile（只存差異，不可修改；變更時建立新紀錄） */
export interface CustomZiweiProfileRecord {
  id: string;
  name: string;
  kind: "custom" | "legacy";
  baseProfileId: string;
  overrides: ProfileOverride[];
  createdAt: string;
  note?: string;
}

const OVERRIDE_LABEL = (o: ProfileOverride) =>
  o.field === "leapMonthRule" ? `閏月：${{ splitAt15: "十五日為界", asCurrent: "一律算本月", asNext: "一律算下月" }[o.value]}`
  : o.field === "dayBoundaryRule" ? `日界：${o.value === "23:00" ? "23:00（子初換日）" : "00:00"}`
  : `庚干四化：${o.value}`;
export const describeOverride = OVERRIDE_LABEL;

function applyOverride(r: ZiweiRules, o: ProfileOverride): ZiweiRules {
  const custom = { softwareDataset: null, classicalSource: null, verification: "pendingVerification" as const };
  if (o.field === "leapMonthRule") return { ...r, leapMonthRule: { ...r.leapMonthRule, ...custom, value: o.value, label: OVERRIDE_LABEL(o), note: "自訂覆寫" } };
  if (o.field === "dayBoundaryRule") return { ...r, dayBoundaryRule: { ...r.dayBoundaryRule, ...custom, value: o.value, label: o.value === "23:00" ? "日界 23:00：23 點起算次日（子初換日）" : "日界 00:00", note: "自訂覆寫" } };
  const table: SihuaTable = { ...r.fourTransformationsTable.value, 庚: o.value === "陽武同陰" ? ["太陽", "武曲", "天同", "太陰"] : ["太陽", "武曲", "太陰", "天同"] };
  return { ...r, fourTransformationsTable: { ...r.fourTransformationsTable, ...custom, value: table, label: `十干四化，${OVERRIDE_LABEL(o)}`, note: "自訂覆寫" } };
}

export class ProfileError extends Error {}

/** 由 id 取得完整 Profile：標準 Profile 直接回傳；自訂／legacy 以其 base 加上 overrides 組成（結果同樣凍結）。 */
export function resolveZiweiProfile(id: string, customs: readonly CustomZiweiProfileRecord[] = []): ZiweiRuleProfile {
  const builtin = BUILTIN_ZIWEI_PROFILES[id];
  if (builtin) return builtin;
  const c = customs.find(x => x.id === id);
  if (!c) throw new ProfileError(`找不到紫微排盤規則「${id}」`);
  const base = resolveZiweiProfile(c.baseProfileId, customs);
  return deepFreeze({
    id: c.id, name: c.name, version: base.version, kind: c.kind, baseProfileId: c.baseProfileId, overrides: c.overrides,
    description: `基於「${base.name}」，覆寫：${c.overrides.map(OVERRIDE_LABEL).join("；")}${c.note ? `。${c.note}` : ""}`,
    rules: c.overrides.reduce(applyOverride, base.rules),
  });
}

const sameOverrides = (a: readonly ProfileOverride[], b: readonly ProfileOverride[]) =>
  JSON.stringify([...a].sort((x, y) => x.field.localeCompare(y.field))) === JSON.stringify([...b].sort((x, y) => x.field.localeCompare(y.field)));

/** 依使用者選擇的覆寫找出（或新建）Profile。無覆寫即為標準 Profile；有覆寫時優先沿用內容相同的既有自訂 Profile。 */
export function profileForOverrides(baseId: string, overrides: ProfileOverride[], customs: readonly CustomZiweiProfileRecord[], now: Date): { id: string; created: CustomZiweiProfileRecord | null } {
  const base = resolveZiweiProfile(baseId, customs);
  const effective = overrides.filter(o => {
    if (o.field === "leapMonthRule") return o.value !== base.rules.leapMonthRule.value;
    if (o.field === "dayBoundaryRule") return o.value !== base.rules.dayBoundaryRule.value;
    return o.value !== (base.rules.fourTransformationsTable.value.庚[2] === "太陰" ? "陽武陰同" : "陽武同陰");
  });
  if (!effective.length) return { id: baseId, created: null };
  const hit = customs.find(c => c.baseProfileId === baseId && sameOverrides(c.overrides, effective));
  if (hit) return { id: hit.id, created: null };
  const day = now.toISOString().slice(0, 10).replaceAll("-", "");
  const n = customs.filter(c => c.id.startsWith(`custom_${day}_`)).length + 1;
  const id = `custom_${day}_${String(n).padStart(3, "0")}`;
  return { id, created: { id, name: `自訂（基於${base.name}）`, kind: "custom", baseProfileId: baseId, overrides: effective, createdAt: now.toISOString() } };
}

/** 從舊版（schema v1）流派設定推導 legacy Profile，確保舊人物升級後命盤不變。 */
export function legacyProfileFromV1(v1: { baziZiHour?: string; leapMonth?: string; gengSihua?: string }, createdAt: string): { id: string; record: CustomZiweiProfileRecord | null } {
  const overrides: ProfileOverride[] = [];
  if (v1.baziZiHour === "earlyZiNextDay") overrides.push({ field: "dayBoundaryRule", value: "23:00" });
  if (v1.leapMonth && v1.leapMonth !== "splitAt15") overrides.push({ field: "leapMonthRule", value: v1.leapMonth as LeapMonthRule });
  if (v1.gengSihua && v1.gengSihua !== "陽武陰同") overrides.push({ field: "gengTransformation", value: v1.gengSihua as "陽武同陰" });
  if (!overrides.length) return { id: IZTRO_COMPATIBLE_V1.id, record: null };
  const only = overrides.length === 1 && overrides[0].field === "dayBoundaryRule";
  const id = only ? "legacy_imported_v1_earlyZi" : `legacy_v1_${overrides.map(o => `${o.field}-${o.value}`).join("_")}`;
  return {
    id,
    record: { id, name: only ? "舊版設定：子初換日（基於 iztro 相容）" : "舊版設定（基於 iztro 相容）", kind: "legacy", baseProfileId: IZTRO_COMPATIBLE_V1.id, overrides, createdAt, note: "由舊版流派設定自動轉換，以維持升級前的命盤結果" },
  };
}

/** 規則欄位的中文名稱（設定頁、開發者模式顯示用） */
export const RULE_FIELD_LABEL: Record<keyof ZiweiRules, string> = {
  ziweiYearBoundary: "紫微年界", leapMonthRule: "閏月", dayBoundaryRule: "日界", lifeBodyPalaceRule: "命身宮安法",
  palaceStemRule: "宮干", bureauRule: "五行局", starPlacementAlgorithm: "安星法", mainStarOffsets: "十四主星排列",
  zuoYouRule: "左輔右弼", changQuRule: "文昌文曲", kuiYueRule: "天魁天鉞", luCunTable: "祿存", yangTuoRule: "擎羊陀羅",
  fireBellRule: "火星鈴星", kongJieRule: "地空地劫", tianMaRule: "天馬", taohuaRules: "咸池紅鸞天喜", xingYaoRule: "天刑天姚",
  fourTransformationsTable: "四化表", brightnessProfileId: "廟旺利陷表", ageSystem: "歲數制度", decadeStartRule: "大限起歲",
  decadeDirectionRule: "大限順逆", decadeStemRule: "大限天干", annualRule: "流年", monthlyRule: "流月", dailyRule: "流日",
  sanFangDefinition: "三方四正", emptyPalaceRule: "無主星借宮", flyingTransformation: "宮干飛化", palaceNaming: "十二宮名稱",
};
export const VERIFICATION_LABEL: Record<VerificationLevel, string> = { iztroMatched: "與 iztro 相容", ruleVerified: "規則已驗證", pendingVerification: "待驗證" };
