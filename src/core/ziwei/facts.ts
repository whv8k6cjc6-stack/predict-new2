/** 紫微客觀資料 → 規則比對用 Facts（僅供 legacy 計分與開發者模式比較；正式分數目前不使用紫微）。 */
import { BRANCHES } from "../calendar/ganzhi";
import type { Fact } from "../engine";
import { BRIGHTNESS_PROFILES } from "./brightness";
import { sanfang } from "./relations";
import type { ZiweiNatal } from "./chart";
import type { ZScope, ZiweiTransit } from "./luck";
import { Z_SCOPE_LABEL } from "./luck";
import { HUA, LUCKY6, SHA6, m12, type PalaceName } from "./common";

export function ziweiFacts(n: ZiweiNatal, t?: ZiweiTransit): Fact[] {
  const f: Fact[] = [];
  const add = (key: string, value: unknown, label: string, derivation: string) => f.push({ key, value, label, derivation, system: "ziwei" });
  const byName = (p: PalaceName) => n.palaces.find(x => x.name === p)!;
  add("ziwei.natal.life", byName("命宮").major.map(s => s.name), "命宮主星", `命宮在${BRANCHES[n.lifeBranch]}（${byName("命宮").gz}）`);
  add("ziwei.natal.ju", n.juName, "五行局", `命宮干支${byName("命宮").gz}納音`);
  add("ziwei.natal.body", n.bodyPalace, "身宮", `身宮在${BRANCHES[n.bodyBranch]}`);
  for (const p of n.palaces) {
    const sf = sanfang(p.branch).map(b => n.palaces[b]);
    const lucky = sf.flatMap(x => x.minor.filter(s => LUCKY6.includes(s.name) || s.name === "祿存").map(s => s.name));
    const sha = sf.flatMap(x => x.minor.filter(s => SHA6.includes(s.name)).map(s => s.name));
    const strong = p.major.filter(s => ["廟", "旺"].includes(s.brightness)).map(s => s.name);
    const weak = p.major.filter(s => ["陷", "不"].includes(s.brightness)).map(s => s.name);
    const k = `ziwei.natal.${p.name}`;
    add(`${k}.major`, p.major.length ? p.major.map(s => `${s.name}${s.brightness}`) : ["無主星（借對宮論）"], `${p.name}主星`, `${p.name}（${p.gz}）：${p.major.map(s => s.name + (s.brightness ? `（${s.brightness}）` : "")).join("、") || "無主星（借對宮）"}；亮度依 ${BRIGHTNESS_PROFILES[n.meta.brightnessProfileId].name}`);
    add(`${k}.strong`, strong, `${p.name}廟旺主星`, strong.join("、") || "無");
    add(`${k}.weak`, weak, `${p.name}落陷主星`, weak.join("、") || "無");
    add(`${k}.sfLucky`, lucky, `${p.name}三方四正吉星`, `三方四正（${sf.map(x => x.name).join("、")}）見：${lucky.join("、") || "無"}`);
    add(`${k}.sfSha`, sha, `${p.name}三方四正煞星`, `三方四正（${sf.map(x => x.name).join("、")}）見：${sha.join("、") || "無"}`);
    add(`${k}.sfLuckyN`, lucky.length, `${p.name}三方四正吉星數`, lucky.join("、") || "無");
    add(`${k}.sfShaN`, sha.length, `${p.name}三方四正煞星數`, sha.join("、") || "無");
  }
  for (const h of HUA) add(`ziwei.natal.hua.${h}`, n.birthHua[h].palace, `生年化${h}落宮`, `生年${n.yearGz.text}，${n.birthHua[h].star}化${h}${n.birthHua[h].palace ? `入${n.birthHua[h].palace}` : ""}`);
  if (!t) return f;
  add("ziwei.nominalAge", t.nominalAge, "虛歲", `流年農曆${t.lunar.year}年，虛歲${t.nominalAge}`);
  for (const s of ["decade", "year", "month", "day"] as ZScope[]) {
    const x = t.scopes[s];
    if (!x) continue;
    const L = Z_SCOPE_LABEL[s];
    add(`ziwei.${s}.stem`, x.stem, `${L}天干`, `${L}命宮干為${x.stem}`);
    add(`ziwei.${s}.life`, x.lifeOnNatal, `${L}命宮落本命宮位`, `${L}命宮在${BRANCHES[x.lifeBranch]}，即本命${x.lifeOnNatal}${s === "month" || s === "day" ? "（斗君法）" : ""}`);
    for (const h of HUA) {
      add(`ziwei.${s}.hua.${h}`, x.hua[h].palace, `${L}化${h}落宮`, `${L}天干${x.stem}，${x.hua[h].star}化${h}${x.hua[h].palace ? `入本命${x.hua[h].palace}` : ""}`);
      add(`ziwei.${s}.huaStar.${h}`, x.hua[h].star, `${L}化${h}之星`, `${x.stem}干${x.hua[h].star}化${h}`);
    }
    const ji = x.hua.忌.palace;
    if (ji) {
      const jb = n.palaces.find(p => p.name === ji)!.branch;
      add(`ziwei.${s}.jiChong`, n.palaces[m12(jb + 6)].name, `${L}化忌沖宮`, `化忌在${ji}，沖對宮${n.palaces[m12(jb + 6)].name}`);
    }
    const lp = n.palaces[x.lifeBranch];
    add(`ziwei.${s}.lifeStrong`, lp.major.some(m => ["廟", "旺"].includes(m.brightness)), `${L}命宮主星廟旺`, lp.major.map(m => m.name + m.brightness).join("、") || "無主星");
    add(`ziwei.${s}.lifeSha`, lp.minor.filter(m => SHA6.includes(m.name)).map(m => m.name), `${L}命宮煞星`, lp.minor.map(m => m.name).join("、") || "無");
  }
  return f;
}

