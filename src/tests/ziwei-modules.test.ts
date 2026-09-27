/** Level 1：紫微各排盤模組的規則／數學測試（依 iztro_compatible_v1）。 */
import { describe, it, expect } from "vitest";
import {
  BUREAU_TABLE, IZTRO_COMPATIBLE_V1 as P, MAIN_STARS, MINOR_STAR_RULES, computeZiweiNatal, lifeBodyPalace, placeMainStars, ziweiPosition,
  sanFangSiZheng, transformationsOf, BRIGHTNESS_PROFILES, computeZiweiTransit, flyingTransformations, m12,
} from "@/core/ziwei";
import { defaultSettings } from "@/core/person";
import { readFileSync } from "node:fs";
import path from "node:path";
import { ziweiFacts } from "@/core/ziwei/facts";
import { toBirth, type FixtureInput } from "./golden/snapshot";

const B = "子丑寅卯辰巳午未申酉戌亥";
const fixture = computeZiweiNatal({
  personId: "f", gender: "male", settings: defaultSettings(""),
  birth: toBirth({ gender: "male", localDate: "1988-01-14", localTime: "01:15", timeZone: "Asia/Taipei", place: { name: "台南", lat: 22.99, lng: 120.21 }, useTrueSolarTime: false }),
});

describe("LifeBodyPalaceEngine", () => {
  it("十二月 × 十二時辰皆符合公式；案例：十一月丑時 → 命亥、身丑", () => {
    for (let m = 1; m <= 12; m++) for (let h = 0; h < 12; h++) {
      const r = lifeBodyPalace(m, h, P);
      expect([r.life, r.body]).toEqual([m12(2 + m - 1 - h), m12(2 + m - 1 + h)]);
    }
    const r = lifeBodyPalace(11, 1, P);
    expect([B[r.life], B[r.body]]).toEqual(["亥", "丑"]);
    expect(r.trace.map(t => t.result)).toEqual(["命宮＝亥", "身宮＝丑"]);
  });
});

describe("FiveElementBureauEngine", () => {
  it("六十甲子納音對照完整，五局各 12 組", () => {
    expect(BUREAU_TABLE).toHaveLength(60);
    const count: Record<string, number> = {};
    for (const r of BUREAU_TABLE) count[r.bureau] = (count[r.bureau] ?? 0) + 1;
    expect(count).toEqual({ 水二局: 12, 木三局: 12, 金四局: 12, 土五局: 12, 火六局: 12 });
    expect(BUREAU_TABLE.find(r => r.gz === "辛亥")).toMatchObject({ nayin: "釵釧金", bureau: "金四局" });
  });
});

describe("MainStarEngine", () => {
  it("紫微位置：五局 × 三十日皆落在十二宮內；金四局二十五日 → 巳", () => {
    for (const ju of [2, 3, 4, 5, 6]) for (let d = 1; d <= 30; d++) { const p = ziweiPosition(ju, d); expect(p >= 0 && p < 12).toBe(true); }
    expect(B[ziweiPosition(4, 25)]).toBe("巳");
    expect(B[ziweiPosition(2, 1)]).toBe("丑");
  });
  it("天府與紫微以寅申線對稱；十四主星由兩星系演算法產生", () => {
    for (let d = 1; d <= 30; d++) {
      const { stars } = placeMainStars(4, d, P);
      expect(m12(stars.紫微 + stars.天府)).toBe(4);
      expect(Object.keys(stars)).toHaveLength(14);
    }
    expect(MAIN_STARS.filter(s => s.system === "ziwei").map(s => s.name)).toEqual(["紫微", "天機", "太陽", "武曲", "天同", "廉貞"]);
    expect(MAIN_STARS.filter(s => s.system === "tianfu")).toHaveLength(8);
  });
  it("主星五行／陰陽只收錄 iztro 有提供者，缺值維持 null", () => {
    const sun = MAIN_STARS.find(s => s.name === "太陽")!;
    expect([sun.element, sun.yinYang]).toEqual([null, null]);
    expect(sun.attributeSource).toContain("pendingVerification");
  });
});

describe("MinorStarEngine", () => {
  it("每顆星標明依據、所屬規則欄位與分類", () => {
    for (const r of MINOR_STAR_RULES) {
      expect(r.basis).toMatch(/出生/);
      expect(P.rules[r.profileField]).toBeTruthy();
      expect(["benefic", "malefic", "lucun", "tianma", "misc"]).toContain(r.category);
    }
    expect(MINOR_STAR_RULES.map(r => r.name)).toHaveLength(19);
  });
  it("案例：吉星、煞星分欄保存", () => {
    const hai = fixture.palaces[11];
    expect([hai.beneficStars, hai.maleficStars]).toEqual([["天魁"], ["鈴星"]]);
  });
});

describe("TransformationEngine", () => {
  it("四化結構化保存：星、化、類型、來源天干、規則編號", () => {
    expect(fixture.birthTransformations).toEqual([
      { star: "太陰", transformation: "祿", type: "birthYear", sourceStem: "丁", ruleId: "ZW_TRANSFORM_丁_祿", tableSource: "iztro_compatible_v1" },
      { star: "天同", transformation: "權", type: "birthYear", sourceStem: "丁", ruleId: "ZW_TRANSFORM_丁_權", tableSource: "iztro_compatible_v1" },
      { star: "天機", transformation: "科", type: "birthYear", sourceStem: "丁", ruleId: "ZW_TRANSFORM_丁_科", tableSource: "iztro_compatible_v1" },
      { star: "巨門", transformation: "忌", type: "birthYear", sourceStem: "丁", ruleId: "ZW_TRANSFORM_丁_忌", tableSource: "iztro_compatible_v1" },
    ]);
    expect(fixture.palaces[0].transformations.map(t => t.star + t.transformation)).toEqual(["太陰祿", "天同權"]);
  });
  it("生年、大限、流年四化各自標明類型，不混用", () => {
    const t = computeZiweiTransit(fixture, { civilDate: "2026-09-27", civilTime: "12:00", timeZone: "Asia/Taipei" });
    expect(t.scopes.decade!.transformations.every(x => x.type === "decade")).toBe(true);
    expect(t.scopes.year!.transformations.every(x => x.type === "annual")).toBe(true);
    expect(transformationsOf("甲", "monthly", P).every(x => x.type === "monthly")).toBe(true);
    expect(flyingTransformations(P).enabled).toBe(false);
  });
});

describe("SanFangSiZhengEngine 與 EmptyPalaceEngine", () => {
  it("命宮亥：本宮亥、對宮巳、三合卯與未（命、遷、官、財）", () => {
    const r = sanFangSiZheng(fixture.lifeBranch, P);
    expect(r.map(x => [B[x.branch], x.role, fixture.palaces[x.branch].name])).toEqual([
      ["亥", "self", "命宮"], ["巳", "opposite", "遷移"], ["卯", "trine1", "官祿"], ["未", "trine2", "財帛"],
    ]);
  });
  it("無主星宮：借對宮主星只列在 borrowedStars，不進入本宮坐守主星；借星權重未定義", () => {
    const xu = fixture.palaces[10]; // 戌宮兄弟，無主星，對宮辰（天機、天梁）
    expect(xu.major).toEqual([]);
    expect(xu.empty.hasResidentMainStars).toBe(false);
    expect(xu.empty.borrowedStars.map(s => s.name)).toEqual(["天機", "天梁"]);
    expect(xu.empty.residentStars).toEqual(["地空", "火星"]);
    expect(xu.empty.borrowedStarWeight).toBeUndefined();
    expect(fixture.palaces[11].empty.borrowedStars).toEqual([]);
  });
});

describe("DaXianEngine 與 AgeSystem", () => {
  it("陰男逆行、金四局 4 歲起、虛歲", () => {
    expect(fixture.forward).toBe(false);
    const order = ["命宮", "兄弟", "夫妻", "子女", "財帛", "疾厄", "遷移", "交友", "官祿", "田宅", "福德", "父母"];
    expect(order.map(n => fixture.palaces.find(p => p.name === n)!.decade)).toEqual(order.map((_, i) => [4 + i * 10, 13 + i * 10]));
    const t = computeZiweiTransit(fixture, { civilDate: "2026-09-27", civilTime: "12:00", timeZone: "Asia/Taipei" });
    expect([t.nominalAge, t.scopes.decade!.lifeOnNatal, t.ageSystem]).toEqual([40, "子女", "虛歲（出生即 1 歲，農曆正月初一增歲）"]);
  });
});

describe("BrightnessEngine", () => {
  it("亮度表為獨立 Profile，標明軟體來源與（無）古籍來源", () => {
    expect(BRIGHTNESS_PROFILES["iztro-2.6.1"]).toMatchObject({ brightnessSource: "iztro", brightnessVersion: "2.6.1", classicalSource: null });
  });
});

describe("Calculation Trace", () => {
  it("逐步記錄：曆法 → 命身宮 → 身宮落宮 → 十二宮 → 五行局 → 紫微 → 天府 → 主星 → 輔煞 → 四化 → 亮度 → 大限", () => {
    expect(fixture.trace.map(t => t.id)).toEqual([
      "cal.time", "cal.dayBoundary", "cal.lunar", "cal.yearHour", "palace.life", "palace.body", "palace.bodyLanding", "palace.layout",
      "bureau", "star.ziwei", "star.tianfu", "star.majors", "star.minor", "transform.birth", "brightness", "luck.direction", "luck.start",
    ]);
    const r = Object.fromEntries(fixture.trace.map(t => [t.id, t.result]));
    expect(r["cal.lunar"]).toBe("農曆1987年11月25日；安星月份 11");
    expect(r["palace.bodyLanding"]).toBe("丑宮在本命盤為福德，身宮在福德");
    expect(r.bureau).toBe("金四局");
    expect(r["star.ziwei"]).toBe("紫微在巳");
    expect(r["transform.birth"]).toBe("太陰化祿、天同化權、天機化科、巨門化忌");
    expect(r["luck.direction"]).toBe("陰男逆行");
    expect(fixture.trace.find(t => t.id === "star.ziwei")!.formula).toContain("q＝⌈25/4⌉＝7，r＝q×4−25＝3");
  });
});

describe("借星只是關係，不進入坐守主星與統計", () => {
  const inputs = (JSON.parse(readFileSync(path.resolve(__dirname, "fixtures/ziwei/ziwei_random_fixture_v1.json"), "utf8")).fixtures as { input: FixtureInput }[]).slice(0, 120).map(f => f.input);
  it("固定樣本 120 盤：空宮的借星不在 major／residentStars，不進入主星、廟旺、落陷事實（legacy 計分用）", () => {
    let emptyCount = 0;
    for (const x of inputs) {
      const n = computeZiweiNatal({ personId: "f", gender: x.gender, birth: toBirth(x), settings: defaultSettings("") });
      const facts = new Map(ziweiFacts(n).map(f => [f.key, f.value]));
      for (const p of n.palaces) {
        if (p.empty.hasResidentMainStars) { expect(p.empty.borrowedStars).toEqual([]); continue; }
        emptyCount++;
        const borrowed = p.empty.borrowedStars.map(s => s.name);
        expect(p.major).toEqual([]);
        expect(borrowed).toEqual(n.palaces[m12(p.branch + 6)].major.map(s => s.name));
        expect(p.empty.residentStars.filter(s => borrowed.includes(s))).toEqual([]);
        expect(p.empty.borrowedStarWeight).toBeUndefined();
        expect(facts.get(`ziwei.natal.${p.name}.major`)).toEqual(["無主星（借對宮論）"]);
        expect([facts.get(`ziwei.natal.${p.name}.strong`), facts.get(`ziwei.natal.${p.name}.weak`)]).toEqual([[], []]);
      }
    }
    expect(emptyCount).toBeGreaterThan(100);
  });
});
