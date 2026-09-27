#!/usr/bin/env node
/** 匯入《周易》經文（六十四卦卦辭、彖、大象、爻辭、小象）與《繫辭》。
 *
 *  來源：npm 套件 @freizl/yijing（MIT，https://github.com/freizl/yijing）zh-TW 版。
 *  該版為簡體轉繁體（OpenCC 類工具）產生，有一對多誤轉。本腳本：
 *   1. 記錄原始檔 SHA-256，來源一變動即可察覺；
 *   2. 逐條套用勘誤（每條寫明理由與預期筆數，筆數不符即中止，不做模糊替換）；
 *   3. 無法確定的異文（於／于）不擅改，只標記「待人工校勘」。
 *
 *  用法：node scripts/import-zhouyi.mjs  → 產生 src/kb/sources/zhouyi.generated.json
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkgDir = dirname(require.resolve("@freizl/yijing/package.json"));
const pkg = JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8"));
const rawGua = readFileSync(join(pkgDir, "zh-TW/64gua.json"));
const rawXici = readFileSync(join(pkgDir, "zh-TW/xi-ci.json"));
const sha = b => createHash("sha256").update(b).digest("hex");

const gua = JSON.parse(rawGua.toString("utf8"));
const xici = JSON.parse(rawXici.toString("utf8"));
if (gua.length !== 64) throw new Error("64gua.json 應有 64 卦");

/** 勘誤表。scope: "all" 表全部經文；或 {gua, field, index?} 指定位置。count 為預期替換次數。 */
const ERRATA = [
  { scope: "all", from: "鹹", to: "咸", count: 20, reason: "簡轉繁誤轉：咸（皆、感）誤作鹹（鹹味）", basis: "咸卦卦名與「萬國咸寧」「品物咸亨」「咸臨」皆作咸" },
  { scope: "all", from: "兇", to: "凶", count: 87, reason: "簡轉繁誤轉：吉凶之凶誤作兇（兇惡）", basis: "《周易》斷辭一律作凶" },
  { scope: "all", from: "誌", to: "志", count: 66, reason: "簡轉繁誤轉：心志之志誤作誌（記載）", basis: "「志」為心志義" },
  { scope: "all", from: "鬥", to: "斗", count: 3, reason: "簡轉繁誤轉：北斗之斗誤作鬥", basis: "豐卦「日中見斗」" },
  { scope: { gua: "震", field: "gua_ci" }, from: "百裏", to: "百里", count: 1, reason: "簡轉繁誤轉：里程之里誤作裏", basis: "「震驚百里」" },
  { scope: { gua: "震", field: "tuan_ci" }, from: "百裏", to: "百里", count: 1, reason: "同上", basis: "「震驚百里」" },
  { scope: { gua: "乾", field: "tuan_ci" }, from: "以禦天", to: "以御天", count: 1, reason: "簡轉繁誤轉：駕御之御誤作禦（抵禦）", basis: "「時乘六龍以御天」；蒙、漸「禦寇」則本作禦，不改" },
  { scope: { gua: "泰", field: "da_xiang" }, from: "後以財成", to: "后以財成", count: 1, reason: "簡轉繁誤轉：后（君主）誤作後", basis: "「后以財成天地之道」" },
  { scope: { gua: "復", field: "da_xiang" }, from: "後不省方", to: "后不省方", count: 1, reason: "同上", basis: "「后不省方」" },
  { scope: { gua: "姤", field: "da_xiang" }, from: "後以施命", to: "后以施命", count: 1, reason: "同上", basis: "「后以施命誥四方」" },
  { scope: { gua: "師", field: "yao_ci", index: 2 }, from: "輿屍", to: "輿尸", count: 1, reason: "簡轉繁誤轉：經文作尸", basis: "「師或輿尸」" },
  { scope: { gua: "師", field: "yao_ci", index: 4 }, from: "輿屍", to: "輿尸", count: 1, reason: "同上", basis: "「弟子輿尸」" },
  { scope: { gua: "師", field: "xiao_xiang", index: 2 }, from: "輿屍", to: "輿尸", count: 1, reason: "同上", basis: "「師或輿尸」" },
  { scope: { gua: "師", field: "xiao_xiang", index: 4 }, from: "輿屍", to: "輿尸", count: 1, reason: "同上", basis: "「弟子輿尸」" },
  { scope: { gua: "否", field: "yao_ci", index: 0 }, from: "以其匯", to: "以其彙", count: 1, reason: "簡轉繁誤轉：彙（類）誤作匯", basis: "「拔茅茹，以其彙」" },
  { scope: { gua: "噬嗑", field: "yao_ci", index: 2 }, from: "噬臘肉", to: "噬腊肉", count: 1, reason: "簡轉繁誤轉：腊（乾肉，音昔）誤作臘", basis: "「噬腊肉，遇毒」" },
  { scope: { gua: "萃", field: "yao_ci", index: 5 }, from: "賫咨", to: "齎咨", count: 1, reason: "異體字統一為通行本用字", basis: "「齎咨涕洟」" },
  { scope: { gua: "萃", field: "xiao_xiang", index: 5 }, from: "賫咨", to: "齎咨", count: 1, reason: "同上", basis: "「齎咨涕洟」" },
  { scope: { gua: "革", field: "da_xiang" }, from: "治歷", to: "治曆", count: 1, reason: "簡轉繁誤轉：曆法之曆誤作歷", basis: "「君子以治曆明時」" },
  { scope: { gua: "漸", field: "yao_ci", index: 0 }, from: "鴻漸於幹", to: "鴻漸于干", count: 1, reason: "簡轉繁誤轉：干（水涯）誤作幹", basis: "「鴻漸于干」" },
  { scope: { gua: "渙", field: "yao_ci", index: 1 }, from: "其機", to: "其机", count: 1, reason: "簡轉繁誤轉：机（几案）誤作機", basis: "「渙奔其机」" },
  { scope: { gua: "渙", field: "xiao_xiang", index: 1 }, from: "其機", to: "其机", count: 1, reason: "同上", basis: "「渙奔其机」" },
  { scope: { gua: "無妄", field: "yao_ci", index: 1 }, from: "不耕獲，不災畬", to: "不耕穫，不菑畬", count: 1, reason: "簡轉繁誤轉（穫）及來源用字錯誤（菑田之菑誤作灾）", basis: "「不耕穫，不菑畬」" },
  { scope: { gua: "無妄", field: "xiao_xiang", index: 1 }, from: "不耕獲", to: "不耕穫", count: 1, reason: "簡轉繁誤轉：收穫之穫誤作獲", basis: "「不耕穫，未富也」" },
  { scope: { gua: "復", field: "yao_ci", index: 0 }, from: "無祗悔", to: "無祇悔", count: 1, reason: "形近誤字：祇（大）誤作祗（敬）", basis: "「不遠復，无祇悔」" },
];
const XICI_ERRATA = [
  { from: "懮", to: "憂", count: 4, reason: "誤字：憂誤作懮", basis: "「悔吝者，憂虞之象也」等" },
];

const count = (s, sub) => s.split(sub).length - 1;
const applied = [];
function fieldRef(g, field, index) {
  return index === undefined ? { get: () => g[field], set: v => { g[field] = v; } }
    : { get: () => g[field][index], set: v => { g[field][index] = v; } };
}
function allRefs(g) {
  const refs = ["name", "gua_ci", "tuan_ci", "da_xiang"].map(f => fieldRef(g, f));
  for (const f of ["yao_ci", "xiao_xiang"]) g[f].forEach((_, i) => refs.push(fieldRef(g, f, i)));
  return refs;
}
for (const e of ERRATA) {
  const refs = e.scope === "all" ? gua.flatMap(allRefs) : (() => {
    const g = gua.find(x => x.name === e.scope.gua);
    if (!g) throw new Error(`找不到卦：${e.scope.gua}`);
    return [fieldRef(g, e.scope.field, e.scope.index)];
  })();
  let n = 0;
  for (const r of refs) { const v = r.get(); const c = count(v, e.from); if (c) { n += c; r.set(v.split(e.from).join(e.to)); } }
  if (n !== e.count) throw new Error(`勘誤「${e.from}→${e.to}」預期 ${e.count} 筆，實際 ${n} 筆（來源可能已變動）`);
  applied.push({ ...e, scope: e.scope === "all" ? "全部卦爻辭" : `${e.scope.gua}・${e.scope.field}${e.scope.index !== undefined ? `[${e.scope.index}]` : ""}`, applied: n });
}
const xiciParas = xici.content.flatMap(sec => sec.content.map((p, i) => ({ part: sec.subtitle, i, text: p })));
for (const e of XICI_ERRATA) {
  let n = 0;
  for (const p of xiciParas) { const c = count(p.text, e.from); if (c) { n += c; p.text = p.text.split(e.from).join(e.to); } }
  if (n !== e.count) throw new Error(`繫辭勘誤「${e.from}→${e.to}」預期 ${e.count}，實際 ${n}`);
  applied.push({ ...e, scope: "繫辭", applied: n });
}

const TRI = { "111": ["乾", "天"], "110": ["兌", "澤"], "101": ["離", "火"], "100": ["震", "雷"], "011": ["巽", "風"], "010": ["坎", "水"], "001": ["艮", "山"], "000": ["坤", "地"] };
const XIANTIAN = { 乾: 1, 兌: 2, 離: 3, 震: 4, 巽: 5, 坎: 6, 艮: 7, 坤: 8 };
const pad2 = n => String(n).padStart(2, "0");
const review = t => {
  const r = [];
  if (t.includes("於")) r.push("「於」在簡體底本中與「于」不分，通行本經文多作「于」，待人工校勘");
  return r;
};
const texts = {};
const addText = (id, chapter, text) => { texts[id] = { chapter, text, review: review(text) }; };

const hexagrams = gua.map((g, k) => {
  const no = k + 1, bits = g.id; // 由下而上
  const [lowerName, lowerNature] = TRI[bits.slice(0, 3)], [upperName, upperNature] = TRI[bits.slice(3, 6)];
  const full = upperName === lowerName ? `${g.name}為${upperNature}` : `${upperNature}${lowerNature}${g.name}`;
  const base = `zhouyi.gua.${pad2(no)}`;
  addText(`${base}.gua`, `${g.name}卦・卦辭`, g.gua_ci);
  addText(`${base}.tuan`, `${g.name}卦・彖傳`, g.tuan_ci);
  addText(`${base}.daxiang`, `${g.name}卦・大象`, g.da_xiang);
  g.yao_ci.forEach((t, i) => addText(`${base}.yao.${i + 1}`, `${g.name}卦・${t.split("：")[0]}`, t));
  g.xiao_xiang.forEach((t, i) => addText(`${base}.xiaoxiang.${i + 1}`, `${g.name}卦・小象・${(g.yao_ci[i] || "").split("：")[0]}`, t));
  return {
    no, name: g.name, full, symbol: g.symbol, bits,
    upper: XIANTIAN[upperName], lower: XIANTIAN[lowerName],
    textIds: {
      gua: `${base}.gua`, tuan: `${base}.tuan`, daxiang: `${base}.daxiang`,
      yao: g.yao_ci.map((_, i) => `${base}.yao.${i + 1}`),
      xiaoxiang: g.xiao_xiang.map((_, i) => `${base}.xiaoxiang.${i + 1}`),
    },
  };
});
for (const p of xiciParas) addText(`zhouyi.xici.${p.part === "上" ? "shang" : "xia"}.${pad2(p.i + 1)}`, `繫辭${p.part}傳・第 ${p.i + 1} 段`, p.text);

const out = {
  edition: {
    source_id: "zhouyi.tongxing",
    title: "周易（經文、彖傳、象傳、繫辭傳）",
    author: "傳統託伏羲、文王、周公、孔子（實為先秦至漢初累積成書）",
    edition: "通行本；數位底本為 @freizl/yijing zh-TW（簡轉繁），經本系統勘誤",
    source_version: `yijing-${pkg.version}+errata.${applied.length}`,
    origin: `npm 套件 ${pkg.name}@${pkg.version}（${pkg.license}）`,
    origin_url: "https://github.com/freizl/yijing",
    retrieved_at: new Date().toISOString().slice(0, 10),
    content_hash: `sha256:64gua=${sha(rawGua)};xici=${sha(rawXici)}`,
    license: `經文屬公有領域；數位檔 ${pkg.license}（© ${pkg.author}）`,
    status: "imported",
  },
  errata: applied,
  notes: [
    "「无」字底本轉作「無」，屬古今字，未改。",
    "標示 review 的段落含「於」，底本簡體不分於／于，未擅改，待人工校勘。",
    "所有段落 verification 為 machine_imported；人工逐字校勘後才可改為 human_verified。",
  ],
  hexagrams,
  texts,
};
const dest = join(root, "src/kb/sources/zhouyi.generated.json");
mkdirSync(dirname(dest), { recursive: true });
writeFileSync(dest, JSON.stringify(out, null, 1) + "\n");
console.log(`已寫入 ${dest}：${hexagrams.length} 卦、${Object.keys(texts).length} 段、勘誤 ${applied.length} 條（共 ${applied.reduce((s, e) => s + e.applied, 0)} 處）`);
