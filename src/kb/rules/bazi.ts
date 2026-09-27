/** 八字規則庫（第三層：程式判斷規則）。
 *  依據：子平通論（扶抑、十神、刑沖合害、神煞）與《滴天髓》天干論要旨。
 *  《滴天髓》原文與任鐵樵注目前無可追溯電子文本可匯入，故 text_ids 為空，僅以「命理原則」呈現，verification＝unverified。 */
import type { DomainKey } from "@/core/domains";
import type { RuleDefinition } from "@/core/sources";
import type { Scope } from "@/core/bazi/transit";

export const BAZI_RULE_VERSION = "3.0.0";
const SCHOOL = "子平（扶抑法）";
const DTS = "滴天髓（任鐵樵闡微）要旨";
type Eff = RuleDefinition["effects"];
const E = (m: Partial<Record<DomainKey, number>>): Eff =>
  Object.entries(m).map(([d, v]) => ({ domain: d as DomainKey, polarity: (v! > 0 ? 1 : v! < 0 ? -1 : 0) as -1 | 0 | 1, strength: Math.min(3, Math.abs(v!)) as 1 | 2 | 3 }));

const TS: Record<Scope, RuleDefinition["timescale"]> = { luck: "decade", year: "year", month: "month", day: "day", hour: "hour" };
const SCOPE_NAME: Record<Scope, string> = { luck: "目前大運", year: "今年流年", month: "本月流月", day: "今日流日", hour: "此時流時" };
const WHEN_NAME: Record<Scope, string> = { luck: "這十年", year: "今年", month: "本月", day: "今天", hour: "這個時辰" };
const SCOPES: Scope[] = ["luck", "year", "month", "day", "hour"];

export const BAZI_GLOBAL_SLOTS: Record<string, string> = {
  日主: "bazi.natal.dm", 日主五行: "bazi.natal.dmElement", 旺衰: "bazi.natal.strength.label", 旺衰分: "bazi.natal.strength.score",
  格局: "bazi.natal.pattern", 用神: "bazi.natal.role.用神", 喜神: "bazi.natal.role.喜神", 忌神: "bazi.natal.role.忌神",
};

const base = (id: string, p: Partial<RuleDefinition> & Pick<RuleDefinition, "condition" | "effects" | "templates" | "slots" | "timescale">): RuleDefinition => ({
  id, system: "bazi", school: SCHOOL, rule_version: BAZI_RULE_VERSION,
  based_on: { text_ids: [], commentary_ids: [], principle: "" }, applies_when: "",
  terms: [], verification: "unverified", enabled: true, ...p,
});

// ── 十神 × 喜忌 ──
type G = "比劫" | "食傷" | "財星" | "官殺" | "印星";
const GROUP_RULES: Record<G, Record<"fav" | "unfav", { short: string; plain: string; legacyAdviceText: string[]; eff: Partial<Record<DomainKey, number>> }>> = {
  比劫: {
    fav: { short: "同儕與自身底氣得力", plain: "比劫代表同類與自我力量；你日主{旺衰}，{五行}正是需要的幫手，做事較有底氣，也容易得到同事朋友配合。", legacyAdviceText: ["找同事或夥伴分工合作", "需要自己拍板的事可以安排在{時段}"], eff: { social: 2, decision: 1, health: 1 } },
    unfav: { short: "同類爭奪、分財的力量偏重", plain: "比劫代表同類與競爭；你日主{旺衰}，再逢{五行}等於力量過剩，容易與人爭、花錢大方或被分走利益。", legacyAdviceText: ["{時段}的金錢往來、合夥與借貸先緩一緩", "意見不合時就事論事，少爭口舌"], eff: { wealth: -2, investment: -2, social: -1 } },
  },
  食傷: {
    fav: { short: "表達與才華有出口", plain: "食傷代表表達、創意與輸出；對日主{旺衰}的你，{五行}能把多餘的力量轉成成果，說話、寫作、提案較順。", legacyAdviceText: ["把簡報、寫作或提案安排在{時段}", "整理想法並對外說明"], eff: { career: 1, social: 1, love: 1, health: 1 } },
    unfav: { short: "言語鋒芒過露、易與規範衝突", plain: "食傷代表表達與不受拘束；對日主{旺衰}的你，{五行}會耗損力量或剋制官星，容易說話太直、與上級或制度起衝突。", legacyAdviceText: ["重要溝通先打草稿、語氣放軟", "避免在公開場合質疑長官或制度"], eff: { career: -2, decision: -1, investment: -1 } },
  },
  財星: {
    fav: { short: "財務處理與實際收穫較順", plain: "財星代表收入、資源與務實事務；你日主{旺衰}，能承擔{五行}這股財氣，理財、帳務與實際收穫較有把握。", legacyAdviceText: ["處理收款、帳務與資產整理", "依計畫執行既定的理財安排"], eff: { wealth: 3, investment: 1 } },
    unfav: { short: "財務壓力或判斷被利益牽動", plain: "財星代表金錢與現實壓力；你日主{旺衰}，{五行}這股財氣反成負擔，容易為錢操心、判斷被利益左右。", legacyAdviceText: ["延後非必要的大額支出", "投資只照既定規則，不追臨時出現的新標的"], eff: { wealth: -2, investment: -2, decision: -1 } },
  },
  官殺: {
    fav: { short: "責任與上級互動有利", plain: "官殺代表責任、規範與上級；你日主{旺衰}，{五行}能被你駕馭，承擔任務、向上溝通、爭取職責較有利。", legacyAdviceText: ["向上報告、提出申請或爭取任務", "處理需要守規則、講程序的公務"], eff: { career: 3, social: 1, decision: 1 } },
    unfav: { short: "壓力與約束偏重", plain: "官殺代表壓力與約束；你日主{旺衰}，{五行}形成剋身之勢，容易感到被要求、被檢視，身心負擔較大。", legacyAdviceText: ["把期限與責任先書面確認", "{時段}行程留白，避免同時接下多項任務"], eff: { career: -2, health: -2, decision: -1 } },
  },
  印星: {
    fav: { short: "思慮周全、有人照應", plain: "印星代表學習、長輩與保護；對日主{旺衰}的你，{五行}是補給，思緒較沉穩，也容易得到長輩或制度支持。", legacyAdviceText: ["研讀資料、準備文件或進修", "請教長輩或前輩再做決定"], eff: { decision: 2, health: 1, career: 1 } },
    unfav: { short: "想太多、行動遲緩", plain: "印星代表思考與依賴；你日主{旺衰}，{五行}使力量更滿、流動變差，容易猶豫拖延、過度依賴他人意見。", legacyAdviceText: ["替決定設截止時間，避免反覆思考", "先做最小可行的一步"], eff: { decision: -1, career: -1, social: -1 } },
  },
};

const groupRules: RuleDefinition[] = SCOPES.flatMap(s => (Object.keys(GROUP_RULES) as G[]).flatMap(g => (["fav", "unfav"] as const).map(k => {
  const t = GROUP_RULES[g][k];
  const roles = k === "fav" ? ["用神", "喜神"] : ["忌神", "仇神"];
  const fill = (x: string) => x.replaceAll("{五行}", "{五行}").replaceAll("{時段}", WHEN_NAME[s]);
  return base(`bazi.${s}.stem.${g}.${k}`, {
    timescale: TS[s],
    based_on: { text_ids: [], commentary_ids: [], principle: `${g}${k === "fav" ? "為喜用則吉" : "為忌仇則凶"}（子平扶抑：身強喜剋洩耗、身弱喜生扶）` },
    applies_when: `${SCOPE_NAME[s]}天干為${g}，且該五行在命局為${roles.join("或")}`,
    condition: { all: [{ fact: `bazi.${s}.stemGroup`, op: "eq", value: g }, { fact: `bazi.${s}.stemRole`, op: "in", value: roles }] },
    effects: E(t.eff),
    templates: {
      conclusion: `${SCOPE_NAME[s]}{干支}，天干對你是「{十神}」（屬{角色}）：${t.short}。`,
      plain: fill(t.plain),
      pro: `${SCOPE_NAME[s]}{干支}，天干{天干}（{五行}）對日主{日主}為{十神}；日主{旺衰}（{旺衰分}分），依扶抑取用神{用神}、喜神{喜神}、忌神{忌神}，{五行}為{角色}。`,
      legacyAdviceText: t.legacyAdviceText.map(fill),
    },
    slots: { 干支: `bazi.${s}.gz`, 天干: `bazi.${s}.stem`, 十神: `bazi.${s}.stemTenGod`, 角色: `bazi.${s}.stemRole`, 五行: `bazi.${s}.stemElement` },
    terms: [g === "比劫" ? "比肩" : g === "食傷" ? "食神" : g === "財星" ? "正財" : g === "官殺" ? "正官" : "正印", "用神", "忌神"],
    priority: s === "day" ? 70 : 60,
  });
})));

// ── 地支本氣喜忌 ──
const branchRoleRules: RuleDefinition[] = SCOPES.flatMap(s => (["fav", "unfav"] as const).map(k => base(`bazi.${s}.branch.${k}`, {
  timescale: TS[s],
  based_on: { text_ids: [], commentary_ids: [], principle: "地支為天干之根，地支本氣為喜用則根基穩，為忌仇則根基受損" },
  applies_when: `${SCOPE_NAME[s]}地支本氣為${k === "fav" ? "用神或喜神" : "忌神或仇神"}`,
  condition: { fact: `bazi.${s}.branchRole`, op: "in", value: k === "fav" ? ["用神", "喜神"] : ["忌神", "仇神"] },
  effects: E(k === "fav" ? { overall: 1, health: 1 } : { overall: -1, health: -1 }),
  templates: {
    conclusion: `${SCOPE_NAME[s]}地支{地支}屬你的{角色}，${k === "fav" ? "根基較穩" : "根基較虛"}。`,
    plain: `地支像是這段時間的「地氣」。{地支}的本氣是{本氣十神}，在你的命局屬{角色}，${k === "fav" ? "做事比較踏實、有後勁" : "做事容易使不上力，需要多一點耐心"}。`,
    pro: `${SCOPE_NAME[s]}{干支}，地支{地支}本氣對日主{日主}為{本氣十神}，屬{角色}。`,
    legacyAdviceText: [k === "fav" ? `${WHEN_NAME[s]}適合處理需要持續投入的事` : `${WHEN_NAME[s]}把事情拆小步驟完成`],
  },
  slots: { 干支: `bazi.${s}.gz`, 地支: `bazi.${s}.branch`, 角色: `bazi.${s}.branchRole`, 本氣十神: `bazi.${s}.branchTenGod` },
  terms: ["藏干", "用神"], priority: 40,
})));

// ── 與本命四柱之刑沖合害破 ──
const PILLARS: { key: "年" | "月" | "日" | "時"; name: string; mean: string; doms: DomainKey[] }[] = [
  { key: "日", name: "日柱", mean: "你自己、伴侶與身體", doms: ["love", "health", "decision"] },
  { key: "月", name: "月柱", mean: "工作環境、同事與父母", doms: ["career", "social"] },
  { key: "年", name: "年柱", mean: "長輩、家族與大環境", doms: ["social"] },
  { key: "時", name: "時柱", mean: "子女、部屬與計畫成果", doms: ["career", "love"] },
];
const REL_DEF: { rel: string; sign: number; label: string; plain: string; act: string }[] = [
  { rel: "六沖", sign: -2, label: "相沖", plain: "容易有變動、衝突或奔波", act: "{時段}避免在情緒上做決定，涉及{柱義}的安排多留彈性" },
  { rel: "六合", sign: 2, label: "六合", plain: "互動較和諧，容易有人情往來與合作", act: "{時段}適合聯繫、協調與{柱義}相關的人" },
  { rel: "半合", sign: 1, label: "半合", plain: "力量相互牽引，容易聚合、形成共同目標", act: "{時段}可以推動需要多方配合的事" },
  { rel: "刑", sign: -1, label: "相刑", plain: "容易有摩擦、是非或自我消耗", act: "{時段}說話多留三分，與{柱義}相關的事先確認再做" },
  { rel: "自刑", sign: -1, label: "自刑", plain: "容易自我糾結、鑽牛角尖", act: "{時段}覺得卡住時先暫停，不要硬推" },
  { rel: "害", sign: -1, label: "相害", plain: "容易有暗中不順或誤會", act: "{時段}重要約定用書面留紀錄" },
  { rel: "破", sign: -1, label: "相破", plain: "計畫容易被打亂或小有破損", act: "{時段}預留備案與緩衝時間" },
];
const relRules: RuleDefinition[] = SCOPES.flatMap(s => PILLARS.flatMap(P => REL_DEF.map(R => {
  const eff: Partial<Record<DomainKey, number>> = {};
  P.doms.forEach((d, i) => { eff[d] = i === 0 ? R.sign : Math.sign(R.sign) * Math.max(1, Math.abs(R.sign) - 1); });
  if (R.rel === "六沖" && P.key === "日") eff.travel = -1;
  const cond: RuleDefinition["condition"] = R.rel === "六沖"
    ? { all: [{ fact: `bazi.${s}.rel.${P.key}`, op: "contains", value: "六沖" }, { fact: `bazi.${s}.clearsJi.${P.key}`, op: "eq", value: false }] }
    : { fact: `bazi.${s}.rel.${P.key}`, op: "contains", value: R.rel };
  const fill = (x: string) => x.replaceAll("{時段}", WHEN_NAME[s]).replaceAll("{柱義}", P.mean);
  return base(`bazi.${s}.rel.${P.key}.${R.rel}`, {
    timescale: TS[s],
    based_on: { text_ids: [], commentary_ids: [], principle: `地支${R.label}：${R.plain}；${P.name}主${P.mean}` },
    applies_when: `${SCOPE_NAME[s]}地支與本命${P.name}地支${R.label}`,
    condition: cond, effects: E(eff),
    templates: {
      conclusion: `${SCOPE_NAME[s]}地支{地支}與你${P.name}的{本命支}${R.label}，${P.mean}方面${R.plain}。`,
      plain: `${P.name}代表${P.mean}。${WHEN_NAME[s]}的地支{地支}與它${R.label}，所以這方面${R.plain}。`,
      pro: `${SCOPE_NAME[s]}{干支}，地支{地支}與本命${P.name}地支{本命支}${R.label}（{關係}）。`,
      legacyAdviceText: [fill(R.act)],
    },
    slots: { 干支: `bazi.${s}.gz`, 地支: `bazi.${s}.branch`, 本命支: `bazi.natal.pillar.${P.key}.branch`, 關係: `bazi.${s}.rel.${P.key}` },
    terms: [R.rel === "六沖" ? "六沖" : R.rel === "六合" ? "六合" : R.rel === "半合" ? "三合" : R.rel === "自刑" ? "刑" : R.rel, P.name.replace("柱", "支")],
    priority: 55,
  });
})));

// 沖去忌神（滴天髓「旺者沖衰衰者拔」之理，原文待匯入）
const clearsJiRules: RuleDefinition[] = SCOPES.flatMap(s => PILLARS.map(P => base(`bazi.${s}.clearsJi.${P.key}`, {
  timescale: TS[s], school: DTS,
  based_on: { text_ids: [], commentary_ids: [], principle: "沖剋論旺衰：衰神沖旺則旺者發，旺神沖衰則衰者拔；被沖者為忌神時，沖反成去病（《滴天髓》要旨，原文待匯入校驗）" },
  applies_when: `${SCOPE_NAME[s]}地支沖本命${P.name}，被沖者本氣為忌仇，而沖者為用喜`,
  condition: { fact: `bazi.${s}.clearsJi.${P.key}`, op: "eq", value: true },
  effects: E({ overall: 2, [P.doms[0]]: 1 } as Partial<Record<DomainKey, number>>),
  templates: {
    conclusion: `${SCOPE_NAME[s]}地支{地支}沖開你${P.name}的{本命支}，被沖的是對你不利的力量，變動反而是好事。`,
    plain: `${P.name}代表${P.mean}。{本命支}在你命局屬不利的五行，{地支}屬有利的五行，這一沖等於把卡住你的東西沖開。`,
    pro: `${SCOPE_NAME[s]}{干支}沖本命${P.name}{本命支}；被沖之支本氣為忌仇、沖者為用喜，屬「沖去忌神」。`,
    legacyAdviceText: [`${WHEN_NAME[s]}可以處理卡關已久、需要改變做法的事`],
  },
  slots: { 干支: `bazi.${s}.gz`, 地支: `bazi.${s}.branch`, 本命支: `bazi.natal.pillar.${P.key}.branch` },
  terms: ["六沖", "忌神"], priority: 75, excludes: [`bazi.${s}.rel.${P.key}.六沖`],
})));

// 伏吟、反吟、天干合沖日主
const pillarEventRules: RuleDefinition[] = (["luck", "year", "day"] as Scope[]).flatMap(s => [
  base(`bazi.${s}.fuyin.day`, {
    timescale: TS[s], based_on: { text_ids: [], commentary_ids: [], principle: "伏吟：流運干支與本命相同，主事情重複、反覆、舊事重提" },
    applies_when: `${SCOPE_NAME[s]}干支與本命日柱相同`,
    condition: { fact: `bazi.${s}.fuyin`, op: "contains", value: "日柱" },
    effects: E({ decision: -2, overall: -1 }),
    templates: {
      conclusion: `${SCOPE_NAME[s]}{干支}與你的日柱相同（伏吟），事情容易反覆、舊事重提。`,
      plain: `${WHEN_NAME[s]}的干支和你出生那天完全一樣（{干支}），命理上稱為伏吟，代表同樣的狀況容易重複出現，進度較慢。`,
      pro: `${SCOPE_NAME[s]}{干支}＝本命日柱{干支}，日柱伏吟。`,
      legacyAdviceText: [`${WHEN_NAME[s]}先處理積壓的舊事，新計畫延後啟動`],
    },
    slots: { 干支: `bazi.${s}.gz` }, terms: ["伏吟"], priority: 65,
  }),
  base(`bazi.${s}.fanyin.day`, {
    timescale: TS[s], based_on: { text_ids: [], commentary_ids: [], principle: "反吟：流運與本命天剋地沖，主劇烈變動" },
    applies_when: `${SCOPE_NAME[s]}與本命日柱天干相剋、地支相沖`,
    condition: { fact: `bazi.${s}.fanyin`, op: "contains", value: "日柱" },
    effects: E({ overall: -2, travel: -2, decision: -2, health: -1 }),
    templates: {
      conclusion: `${SCOPE_NAME[s]}{干支}與你的日柱天剋地沖（反吟），是變動最大的組合。`,
      plain: `${WHEN_NAME[s]}的干支{干支}從天干到地支都和你的日柱相衝，代表你自己的狀態與身邊關係容易劇烈變化。`,
      pro: `${SCOPE_NAME[s]}{干支}與本命日柱天干相沖、地支六沖，日柱反吟。`,
      legacyAdviceText: [`${WHEN_NAME[s]}不做不可逆的重大決定`, "出行與開車放慢速度"],
    },
    slots: { 干支: `bazi.${s}.gz` }, terms: ["反吟"], priority: 80,
  }),
  base(`bazi.${s}.stemhe.dm`, {
    timescale: TS[s], based_on: { text_ids: [], commentary_ids: [], principle: "天干五合：日主逢合，主有情牽絆、人情往來" },
    applies_when: `${SCOPE_NAME[s]}天干與日主五合`,
    condition: { fact: `bazi.${s}.stemRel.日`, op: "eq", value: "五合" },
    effects: E({ love: 2, social: 1, decision: -1 }),
    templates: {
      conclusion: `${SCOPE_NAME[s]}天干{天干}與日主{日主}相合，人情與感情互動變多。`,
      plain: `天干五合代表「被吸引、被牽絆」。{天干}與你的日主{日主}相合，${WHEN_NAME[s]}容易有邀約與人情往來，但也可能因此分心。`,
      pro: `${SCOPE_NAME[s]}天干{天干}與日主{日主}五合。`,
      legacyAdviceText: ["可以安排約會、聚會或與家人相處", "重要決定避免在人情壓力下當場答應"],
    },
    slots: { 天干: `bazi.${s}.stem` }, terms: ["天干五合"], priority: 55,
  }),
  base(`bazi.${s}.stemchong.dm`, {
    timescale: TS[s], based_on: { text_ids: [], commentary_ids: [], principle: "天干相沖：甲庚、乙辛、丙壬、丁癸相沖，主意念衝突、心神不寧" },
    applies_when: `${SCOPE_NAME[s]}天干與日主相沖`,
    condition: { fact: `bazi.${s}.stemRel.日`, op: "eq", value: "相沖" },
    effects: E({ decision: -1, health: -1 }),
    templates: {
      conclusion: `${SCOPE_NAME[s]}天干{天干}沖你的日主{日主}，想法容易反覆、心神較不寧。`,
      plain: `天干相沖代表想法與外力互相拉扯。{天干}與{日主}相沖，${WHEN_NAME[s]}容易猶豫或被打斷。`,
      pro: `${SCOPE_NAME[s]}天干{天干}與日主{日主}相沖。`,
      legacyAdviceText: ["一次只處理一件事，減少切換"],
    },
    slots: { 天干: `bazi.${s}.stem` }, terms: ["六沖"], priority: 50,
  }),
]);

// 神煞
const SHENSHA: { name: string; eff: Partial<Record<DomainKey, number>>; principle: string; plain: string; act: string; term: string }[] = [
  { name: "天乙貴人", eff: { social: 2, career: 1 }, principle: "天乙貴人（日干起例：甲戊庚牛羊…）主得人扶助、逢凶化吉", plain: "天乙貴人是命理中最常用的吉神；地支{地支}正是你日主{日主}的天乙貴人位，較容易遇到願意協助你的人。", act: "有事請託、拜訪長官或前輩可排在{時段}", term: "天乙貴人" },
  { name: "文昌", eff: { career: 1, decision: 1 }, principle: "文昌（日干起例）主聰明文采、考試文書", plain: "地支{地支}是你日主{日主}的文昌位，讀書、寫作、處理文書較得心應手。", act: "把需要動腦寫作或審閱文件的事排在{時段}", term: "文昌" },
  { name: "驛馬", eff: { travel: 2, career: 1 }, principle: "驛馬（年支、日支三合起例）主奔波移動、出行變動", plain: "地支{地支}是你的驛馬位，代表移動與變動，出差、旅行或外勤機會變多。", act: "{時段}適合安排出行或外勤，行前確認交通", term: "驛馬" },
  { name: "桃花", eff: { love: 2, social: 1 }, principle: "桃花（咸池，年支、日支三合起例）主人緣與異性緣", plain: "地支{地支}是你的桃花位，人緣與魅力提升，社交互動較熱絡。", act: "{時段}適合聚會、聯誼或與伴侶相處", term: "桃花" },
  { name: "華蓋", eff: { social: -1, decision: 1 }, principle: "華蓋（年支、日支三合起例）主孤高、才藝、獨處思考", plain: "地支{地支}是你的華蓋位，較適合獨處思考、研究，社交意願偏低。", act: "{時段}適合安靜做研究或規劃", term: "華蓋" },
  { name: "羊刃", eff: { health: -2, investment: -2, social: -1 }, principle: "羊刃（陽干帝旺之位）主剛烈、衝動、血光", plain: "地支{地支}是你日主{日主}的羊刃位，脾氣較急、容易衝動，也要留意刀具、運動與交通的小傷。", act: "{時段}投資與爭執都先冷靜三分鐘再決定", term: "羊刃" },
  { name: "祿神", eff: { wealth: 2, career: 1 }, principle: "祿神（日干臨官之位）主俸祿、衣食", plain: "地支{地支}是你日主{日主}的祿位，工作的實質回報與收入較穩定。", act: "{時段}適合處理與薪資、收入、報酬相關的事", term: "祿神" },
];
const shenshaRules: RuleDefinition[] = (["year", "month", "day", "hour"] as Scope[]).flatMap(s => SHENSHA.map(x => {
  const fill = (t: string) => t.replaceAll("{時段}", WHEN_NAME[s]);
  return base(`bazi.${s}.shensha.${x.name}`, {
    timescale: TS[s], based_on: { text_ids: [], commentary_ids: [], principle: x.principle },
    applies_when: `${SCOPE_NAME[s]}地支為你的${x.name}`,
    condition: { fact: `bazi.${s}.shensha`, op: "contains", value: x.name },
    effects: E(x.eff),
    templates: {
      conclusion: `${SCOPE_NAME[s]}地支{地支}是你的${x.name}。`,
      plain: fill(x.plain),
      pro: `${SCOPE_NAME[s]}{干支}，地支{地支}為日主{日主}之${x.name}（${x.principle}）。`,
      legacyAdviceText: [fill(x.act)],
    },
    slots: { 干支: `bazi.${s}.gz`, 地支: `bazi.${s}.branch` }, terms: [x.term], priority: 45,
  });
}));

// 十二長生、調候
const stageRules: RuleDefinition[] = (["day", "month"] as Scope[]).flatMap(s => [
  base(`bazi.${s}.stage.strong.weakdm`, {
    timescale: TS[s], based_on: { text_ids: [], commentary_ids: [], principle: "日主臨官、帝旺之地，身弱者得氣力" },
    applies_when: `日主偏弱，${SCOPE_NAME[s]}地支為日主臨官或帝旺`,
    condition: { all: [{ fact: `bazi.${s}.dmStage`, op: "in", value: ["臨官", "帝旺"] }, { fact: "bazi.natal.strength.label", op: "in", value: ["偏弱", "身弱"] }] },
    effects: E({ health: 1, decision: 1 }),
    templates: {
      conclusion: `日主{日主}在${SCOPE_NAME[s]}地支{地支}處「{長生}」，對{旺衰}的你是補充元氣。`,
      plain: `十二長生描述能量的盛衰。你的日主在{地支}是「{長生}」，屬最有力的階段，精神與體力較好。`,
      pro: `日主{日主}（{旺衰}）於{地支}為{長生}。`,
      legacyAdviceText: [`${WHEN_NAME[s]}可以處理需要體力或魄力的事`],
    },
    slots: { 地支: `bazi.${s}.branch`, 長生: `bazi.${s}.dmStage` }, terms: ["十二長生"], priority: 35,
  }),
  base(`bazi.${s}.stage.weak`, {
    timescale: TS[s], based_on: { text_ids: [], commentary_ids: [], principle: "日主臨病、死、絕之地，氣力衰減" },
    applies_when: `${SCOPE_NAME[s]}地支為日主病、死或絕`,
    condition: { fact: `bazi.${s}.dmStage`, op: "in", value: ["病", "死", "絕"] },
    effects: E({ health: -1 }),
    templates: {
      conclusion: `日主{日主}在${SCOPE_NAME[s]}地支{地支}處「{長生}」，體力與精神較易透支。`,
      plain: `十二長生描述能量的盛衰。你的日主在{地支}是「{長生}」，屬較弱的階段，宜保養。`,
      pro: `日主{日主}於{地支}為{長生}。`,
      legacyAdviceText: [`${WHEN_NAME[s]}早點休息，減少消耗體力的安排`],
    },
    slots: { 地支: `bazi.${s}.branch`, 長生: `bazi.${s}.dmStage` }, terms: ["十二長生"], priority: 35,
  }),
  base(`bazi.${s}.tiaohou.match`, {
    timescale: TS[s], school: DTS,
    based_on: { text_ids: [], commentary_ids: [], principle: "寒暖燥濕：命局過寒需暖、過燥需潤，得調候則生機發越（《滴天髓》寒暖、燥濕篇要旨，原文待匯入校驗）" },
    applies_when: `${SCOPE_NAME[s]}干支帶有命局調候所需之五行`,
    condition: { fact: `bazi.${s}.tiaohou`, op: "eq", value: "match" },
    effects: E({ health: 2, overall: 1 }),
    templates: {
      conclusion: `你生於{季節}季，命局需要{調候}調和；${SCOPE_NAME[s]}{干支}正好帶來{調候}。`,
      plain: `命理講究寒暖平衡。你的命局{調候說明}${WHEN_NAME[s]}的干支補上了這一塊，身心較舒暢。`,
      pro: `調候：生於{季節}季（月令{月支}），需{調候}；${SCOPE_NAME[s]}{干支}帶{調候}。`,
      legacyAdviceText: [`${WHEN_NAME[s]}適合安排戶外活動或調整作息`],
    },
    slots: { 季節: "bazi.natal.season", 調候: "bazi.natal.tiaohou", 調候說明: "bazi.natal.tiaohouBasis", 干支: `bazi.${s}.gz`, 月支: "bazi.natal.pillar.月.branch" },
    terms: ["調候"], priority: 50,
  }),
]);

// 投資專屬：十神細項
const investRules: RuleDefinition[] = (["day", "month"] as Scope[]).flatMap(s => [
  base(`bazi.${s}.invest.jiecai`, {
    timescale: TS[s], based_on: { text_ids: [], commentary_ids: [], principle: "劫財主爭奪、分財、衝動" },
    applies_when: `${SCOPE_NAME[s]}天干為劫財`,
    condition: { fact: `bazi.${s}.stemTenGod`, op: "eq", value: "劫財" },
    effects: E({ investment: -2 }),
    templates: {
      conclusion: `${SCOPE_NAME[s]}天干{天干}是你的劫財，投資上容易衝動追價或被消息影響。`,
      plain: `劫財代表「跟別人搶」的力量。{天干}對日主{日主}為劫財，${WHEN_NAME[s]}容易因為怕錯過而追高，或臨時改變原本的規則。`,
      pro: `${SCOPE_NAME[s]}{干支}，天干{天干}對日主{日主}為劫財。`,
      legacyAdviceText: ["既有策略照原本規則執行", "臨時出現的新標的不追價"],
    },
    slots: { 干支: `bazi.${s}.gz`, 天干: `bazi.${s}.stem` }, terms: ["劫財"], priority: 60,
  }),
  base(`bazi.${s}.invest.piancai.fav`, {
    timescale: TS[s], based_on: { text_ids: [], commentary_ids: [], principle: "偏財主機會財、流動之財，為喜用則利於把握機會" },
    applies_when: `${SCOPE_NAME[s]}天干為偏財且屬喜用`,
    condition: { all: [{ fact: `bazi.${s}.stemTenGod`, op: "eq", value: "偏財" }, { fact: `bazi.${s}.stemRole`, op: "in", value: ["用神", "喜神"] }] },
    effects: E({ investment: 1 }),
    templates: {
      conclusion: `${SCOPE_NAME[s]}天干{天干}是你的偏財且屬喜用，對市場機會的敏感度較好。`,
      plain: `偏財代表流動的機會財；{天干}對你是偏財又屬有利五行，看盤與判斷機會較清楚，但仍以規則為準。`,
      pro: `${SCOPE_NAME[s]}{干支}，天干{天干}為偏財，屬{角色}。`,
      legacyAdviceText: ["可以依既定規則執行進出場", "部位大小仍照原本上限"],
    },
    slots: { 干支: `bazi.${s}.gz`, 天干: `bazi.${s}.stem`, 角色: `bazi.${s}.stemRole` }, terms: ["偏財"], priority: 55,
  }),
  base(`bazi.${s}.invest.shangguan.unfav`, {
    timescale: TS[s], based_on: { text_ids: [], commentary_ids: [], principle: "傷官為忌主不守規矩、衝動行事" },
    applies_when: `${SCOPE_NAME[s]}天干為傷官且屬忌仇`,
    condition: { all: [{ fact: `bazi.${s}.stemTenGod`, op: "eq", value: "傷官" }, { fact: `bazi.${s}.stemRole`, op: "in", value: ["忌神", "仇神"] }] },
    effects: E({ investment: -1 }),
    templates: {
      conclusion: `${SCOPE_NAME[s]}天干{天干}是你的傷官且屬不利五行，容易想打破自己的規則。`,
      plain: `傷官代表不喜歡被規則綁住；{天干}對你屬不利，${WHEN_NAME[s]}容易想「這次例外一下」，這正是破紀律的訊號。`,
      pro: `${SCOPE_NAME[s]}{干支}，天干{天干}為傷官，屬{角色}。`,
      legacyAdviceText: ["任何想手動干預策略的念頭，先寫下理由、隔天再看"],
    },
    slots: { 干支: `bazi.${s}.gz`, 天干: `bazi.${s}.stem`, 角色: `bazi.${s}.stemRole` }, terms: ["傷官"], priority: 55,
  }),
]);

// 本命格局（長期基調，natal）
const PATTERN_DOM: Record<string, { dom: DomainKey; plain: string }> = {
  財星: { dom: "wealth", plain: "你的格局以財星為主，對金錢與資源的經營較有天賦" },
  官殺: { dom: "career", plain: "你的格局以官殺為主，適合承擔責任、在組織中發揮" },
  食傷: { dom: "social", plain: "你的格局以食傷為主，擅長表達、創意與人際互動" },
  印星: { dom: "decision", plain: "你的格局以印星為主，重思考、學習與穩健判斷" },
};
const natalRules: RuleDefinition[] = Object.entries(PATTERN_DOM).map(([g, v]) => base(`bazi.natal.pattern.${g}`, {
  timescale: "natal", based_on: { text_ids: [], commentary_ids: [], principle: "子平以月令取格，格局所在為命主之專長與重心" },
  applies_when: `本命格局屬${g}`,
  condition: { fact: "bazi.natal.patternGroup", op: "eq", value: g },
  effects: E({ [v.dom]: 1 } as Partial<Record<DomainKey, number>>),
  templates: {
    conclusion: `本命為{格局}，${v.plain.replace("你的格局以", "以")}。`,
    plain: `${v.plain}（{格局}）。這是長期基調，不隨日子改變。`,
    pro: `月令取格：{格局}（{格局依據}）。`,
    legacyAdviceText: ["長期規劃可以往這個方向發揮"],
  },
  slots: { 格局依據: "bazi.natal.patternBasis" }, terms: ["格局"], priority: 20,
}));

// 《滴天髓》天干論要旨（日主 × 今日天干）
const DTS_STEM: { id: string; dm: string; when: RuleDefinition["condition"]; principle: string; short: string; plain: string; act: string; eff: Partial<Record<DomainKey, number>> }[] = [
  { id: "jia.fire", dm: "甲", when: { fact: "bazi.day.stem", op: "in", value: ["丙", "丁"] }, principle: "甲木參天，脫胎要火：甲木得火洩秀方能成材", short: "甲木見火，才華有出口", plain: "《滴天髓》說甲木像參天大樹，需要火來展現。今天天干{流日干}屬火，是發揮能力、交出成果的日子。", act: "把需要展現成果的簡報或提案排在今天", eff: { career: 2 } },
  { id: "yi.fire", dm: "乙", when: { fact: "bazi.day.stem", op: "in", value: ["丙", "丁"] }, principle: "乙木雖柔，懷丁抱丙：乙木喜丙丁溫暖", short: "乙木得火溫暖，心情與表現都轉好", plain: "《滴天髓》說乙木喜歡丙丁火的溫暖。今天天干{流日干}屬火，精神開朗、表現力佳。", act: "適合對外互動與展現自己", eff: { overall: 1, social: 1 } },
  { id: "yi.jia", dm: "乙", when: { fact: "bazi.day.stem", op: "eq", value: "甲" }, principle: "藤蘿繫甲，可春可秋：乙木攀附甲木則四季皆宜", short: "乙木得甲木可依附，易得強者扶持", plain: "《滴天髓》把乙木比作藤蘿，有甲木可攀附就穩。今天天干{流日干}為甲，容易得到有力者的支持。", act: "有需要協助的事可以找資深同事或主管", eff: { social: 2 } },
  { id: "bing.geng", dm: "丙", when: { fact: "bazi.day.stem", op: "eq", value: "庚" }, principle: "丙火猛烈，能煆庚金：丙火能鍛鍊庚金", short: "丙火遇庚金，能駕馭眼前的資源", plain: "《滴天髓》說丙火能鍛鍊庚金。今天天干{流日干}為庚，是你的偏財，你有能力把資源與機會化為成果。", act: "處理需要魄力的財務或資源分配", eff: { wealth: 2 } },
  { id: "bing.xin", dm: "丙", when: { fact: "bazi.day.stem", op: "eq", value: "辛" }, principle: "丙火逢辛反怯：丙辛相合，丙火失其猛烈", short: "丙火遇辛金相合，判斷容易被牽絆", plain: "《滴天髓》說丙火遇到辛金反而怯弱。今天天干{流日干}與你相合，容易被小利或人情牽動、失去原本的果斷。", act: "重要決定先列出利弊再做", eff: { decision: -2 } },
  { id: "ding.ren", dm: "丁", when: { fact: "bazi.day.stem", op: "eq", value: "壬" }, principle: "丁火柔中，合壬而忠：丁壬相合有情", short: "丁火合壬水，盡責之心被看見", plain: "《滴天髓》說丁火與壬水相合而忠。今天天干{流日干}是你的正官並與你相合，負責的態度容易被肯定。", act: "向上報告進度或承接任務", eff: { career: 2 } },
  { id: "ding.jia", dm: "丁", when: { all: [{ fact: "bazi.day.stem", op: "eq", value: "甲" }, { fact: "bazi.natal.season", op: "in", value: ["秋", "冬"] }] }, principle: "丁火如有嫡母，可秋可冬：秋冬生之丁火得甲木則不衰", short: "秋冬生的丁火得甲木，底氣十足", plain: "《滴天髓》說丁火有甲木（嫡母）扶持，秋冬也不怕。你生於{季節}季，今天天干{流日干}為甲，精神與底氣較足。", act: "可以處理需要耐力的事", eff: { overall: 2, health: 1 } },
  { id: "wu.water", dm: "戊", when: { fact: "bazi.day.stem", op: "in", value: ["壬", "癸"] }, principle: "戊土固重，水潤物生：戊土得水滋潤則萬物生長", short: "戊土得水滋潤，財務與資源流動順", plain: "《滴天髓》說戊土需要水滋潤才能生長萬物。今天天干{流日干}屬水，是你的財星，利於資源整合與財務處理。", act: "處理帳務、資源分配或收款", eff: { wealth: 2 } },
  { id: "wu.summerfire", dm: "戊", when: { all: [{ fact: "bazi.day.stem", op: "in", value: ["丙", "丁"] }, { fact: "bazi.natal.season", op: "eq", value: "夏" }] }, principle: "戊土火燥物病：夏生戊土再逢火則燥", short: "夏生戊土再逢火，易燥熱煩躁", plain: "《滴天髓》說戊土太燥就生病。你生於夏季，今天天干{流日干}又屬火，容易口乾舌燥、情緒煩躁。", act: "多補充水分、避免長時間在高溫環境", eff: { health: -2 } },
  { id: "ji.metal", dm: "己", when: { fact: "bazi.day.stem", op: "in", value: ["庚", "辛"] }, principle: "己土卑濕，金多金光：己土生金，金旺則光彩外顯", short: "己土生金，口才與專業易被看見", plain: "《滴天髓》說己土遇金則金光外顯。今天天干{流日干}屬金，是你的食傷，表達與專業容易被看見。", act: "適合報告、授課或對外說明", eff: { career: 1, social: 1 } },
  { id: "geng.ding", dm: "庚", when: { fact: "bazi.day.stem", op: "eq", value: "丁" }, principle: "庚金帶煞，得火而銳：庚金經丁火鍛鍊方成利器", short: "庚金得丁火鍛鍊，壓力轉為專業", plain: "《滴天髓》說庚金遇丁火鍛鍊才會銳利。今天天干{流日干}是你的正官，要求與壓力正好磨出你的專業。", act: "接下有挑戰性的任務", eff: { career: 2 } },
  { id: "geng.water", dm: "庚", when: { fact: "bazi.day.stem", op: "in", value: ["壬", "癸"] }, principle: "庚金得水而清：庚金得水淘洗則清秀", short: "庚金得水，思路清晰", plain: "《滴天髓》說庚金遇水則清。今天天干{流日干}屬水，思路與表達較清楚。", act: "適合整理資料、寫報告", eff: { decision: 1 } },
  { id: "geng.yi", dm: "庚", when: { fact: "bazi.day.stem", op: "eq", value: "乙" }, principle: "庚金能贏甲兄，輸於乙妹：乙庚相合，剛金為柔木所牽", short: "庚金遇乙木相合，易因人情心軟", plain: "《滴天髓》說庚金能劈甲木，卻輸給乙木。今天天干{流日干}與你相合，容易因感情或人情而讓步，財務上也較大方。", act: "涉及金錢的人情請託，先想清楚再答應", eff: { love: 1, wealth: -1 } },
  { id: "xin.water", dm: "辛", when: { fact: "bazi.day.stem", op: "in", value: ["壬", "癸"] }, principle: "辛金溫潤而清，樂水之盈：辛金喜水淘洗", short: "辛金得水淘洗，光彩外顯", plain: "《滴天髓》說辛金喜歡水的滋潤。今天天干{流日干}屬水，才華外顯，適合表現與溝通。", act: "適合對外溝通或展示成果", eff: { social: 1, career: 1 } },
  { id: "xin.earth", dm: "辛", when: { fact: "bazi.day.stem", op: "in", value: ["戊", "己"] }, principle: "辛金畏土之疊：辛金怕厚土埋沒", short: "辛金遇厚土，易被瑣事壓住", plain: "《滴天髓》說辛金怕被厚土埋住。今天天干{流日干}屬土，容易被瑣事或長輩意見壓住，光芒難顯。", act: "先處理必要的瑣事，重要表現改天", eff: { decision: -1, career: -1 } },
  { id: "ren.ding", dm: "壬", when: { fact: "bazi.day.stem", op: "eq", value: "丁" }, principle: "壬水通河，化則有情：丁壬相合", short: "壬水合丁火，感情與人緣有溫度", plain: "《滴天髓》說壬水與丁火相合而有情。今天天干{流日干}與你相合，感情與人際互動較溫暖。", act: "適合與伴侶或重要的人相處", eff: { love: 2 } },
  { id: "gui.chen", dm: "癸", when: { fact: "bazi.day.branch", op: "eq", value: "辰" }, principle: "癸水至弱，得龍而運：癸水得辰則能興雲布雨", short: "癸水得辰，時機到位", plain: "《滴天髓》說癸水遇到辰（龍）就能發揮。今天地支{流日支}為辰，想法有機會落實。", act: "把醞釀已久的計畫往前推一步", eff: { overall: 2 } },
];
const dtsRules: RuleDefinition[] = DTS_STEM.map(x => base(`bazi.dts.${x.id}`, {
  timescale: "day", school: DTS,
  based_on: { text_ids: [], commentary_ids: [], principle: `${x.principle}（《滴天髓・天干論》要旨；原文與任鐵樵注尚未匯入校驗）` },
  applies_when: `日主為${x.dm}，今日干支符合條件`,
  condition: { all: [{ fact: "bazi.natal.dm", op: "eq", value: x.dm }, x.when] },
  effects: E(x.eff),
  templates: {
    conclusion: `你是{日主}日主，今日{流日干支}：${x.short}。`,
    plain: x.plain,
    pro: `《滴天髓》天干論要旨：${x.principle}。本命日主{日主}，今日流日{流日干支}合此條件。`,
    legacyAdviceText: [x.act],
  },
  slots: { 流日干: "bazi.day.stem", 流日支: "bazi.day.branch", 流日干支: "bazi.day.gz", 季節: "bazi.natal.season" },
  terms: ["滴天髓", "日主"], priority: 65,
}));

export const BAZI_RULES: RuleDefinition[] = [
  ...groupRules, ...branchRoleRules, ...relRules, ...clearsJiRules, ...pillarEventRules,
  ...shenshaRules, ...stageRules, ...investRules, ...natalRules, ...dtsRules,
];
