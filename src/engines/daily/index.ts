/** 每日運勢整合引擎：八字＋滴天髓＋神煞＋紫微＋奇門＋易經 → 八大運勢分數、等級、依據與具體建議。
 *  每一條分數變動都對應一條 Evidence，可在介面上點開看專業說明與白話。 */
import { computeBazi, tenGod, branchRelation, STEM_ELEMENT, BRANCH_ELEMENT, HIDDEN_STEMS, type TenGod } from "../bazi";
import { shenshaHits, TIANYI, ZODIAC } from "../bazi/shensha";
import { fourPillars, STEMS, BRANCHES, hourBranchIndex } from "../calendar/ganzhi";
import { sunLongitude, jdFromLocal, SOLAR_TERMS } from "../calendar/astro";
import { lunarDate } from "../calendar/lunar";
import { ditiansuiHits, seasonOf, STEM_VERSES, tiaohouElement, CLASH_QUOTE } from "../ditiansui";
import { computeZiwei, flowDayPalace, stemSihuaPalaces } from "../ziwei";
import { computeQimen, evalPalace, findPalace, xunYi, PALACE_ELEMENT, PALACE_DIR, type QimenChart } from "../qimen";
import { castMeihua, TIYONG_INFO, LINE_POSITION, TRIGRAMS } from "../iching";
import { gradeOf } from "./grade";
import { BAND_ADVICE, BAND_OPENING, CATEGORY_META, bandOf } from "./advice";
import type { Profile } from "@/types/profile";
import type { CategoryKey, CategoryReport, DailyReport, Evidence, HourFortune, SystemName } from "@/types/daily";

export const CATEGORY_KEYS: CategoryKey[] = ["overall", "career", "wealth", "love", "health", "social", "travel", "study"];
const SUB_KEYS = CATEGORY_KEYS.filter(k => k !== "overall");

const SYSTEM_WEIGHT: Record<SystemName, number> = { 八字: 1, 滴天髓: 0.9, 神煞: 0.8, 紫微: 0.8, 奇門: 1, 易經: 0.8 };
const SPREAD = 2.6;
const OVERALL_SHARE = 0.4;
const OVERALL_STRETCH = 1.3; // 綜合運為多項平均，離散度較小，拉回與分項相近的分布
const CONF: Record<Profile["birthTimeAccuracy"], number> = { exact: 1, approximate: 0.85, unknown: 0.65 };

const SHI_CHEN = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const SHI_RANGE = ["23–01", "01–03", "03–05", "05–07", "07–09", "09–11", "11–13", "13–15", "15–17", "17–19", "19–21", "21–23"];
const DAYTIME = [4, 5, 6, 7, 8, 9];
const ACTIVE = [3, 4, 5, 6, 7, 8, 9, 10];

const ELEMENT_COLOR: Record<string, { name: string; hex: string }> = {
  木: { name: "綠色、青色", hex: "#3f9f6b" }, 火: { name: "紅色、紫色", hex: "#d0533f" },
  土: { name: "黃色、咖啡色", hex: "#c9a04a" }, 金: { name: "白色、金色", hex: "#e6dcc3" }, 水: { name: "黑色、深藍色", hex: "#3a6fb0" },
};
const ELEMENT_NUMBERS: Record<string, number[]> = { 水: [1, 6], 火: [2, 7], 木: [3, 8], 金: [4, 9], 土: [5, 0] };
const ELEMENT_DIR: Record<string, string> = { 木: "東", 火: "南", 土: "東北", 金: "西", 水: "北" };
const GEN: Record<string, string> = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };
const CTRL: Record<string, string> = { 木: "土", 火: "金", 土: "水", 金: "木", 水: "火" };

const TG_DAILY: Record<TenGod, { good: string; bad: string; bGood: string; bBad: string; side?: string; fx: Partial<Record<CategoryKey, number>> }> = {
  比肩: { good: "能得到同事朋友支持，適合團隊合作。", bad: "容易遇到競爭或意見相左，也要防分財。", bGood: "同儕助力", bBad: "同儕競爭", side: "但也要防人分走利益。", fx: { social: 4, career: 1, wealth: -1 } },
  劫財: { good: "行動力與拼勁強，適合衝刺。", bad: "容易衝動花錢、被人分走利益。", bGood: "拼勁十足", bBad: "劫財耗損", side: "但花錢也容易大方過頭。", fx: { social: 1, wealth: -4, career: 1 } },
  食神: { good: "心情放鬆、表達順暢，有口福。", bad: "容易懶散、拖延。", bGood: "心情舒暢", bBad: "易懶散", fx: { health: 3, love: 2, social: 2, wealth: 1 } },
  傷官: { good: "創意與口才佳，適合提出新點子。", bad: "說話易太直，容易頂撞上級。", bGood: "創意靈光", bBad: "言多易失", side: "只是說話容易太直。", fx: { study: 3, career: -1, social: -2 } },
  偏財: { good: "有額外收入或機會，人緣也好。", bad: "錢來得快去得也快，易受誘惑。", bGood: "偏財機會", bBad: "偏財誘惑", fx: { wealth: 5, social: 2, travel: 1 } },
  正財: { good: "穩定收入、務實理財的好日子。", bad: "容易為錢操心、收支有壓力。", bGood: "正財入日", bBad: "財務壓力", fx: { wealth: 6, career: 2 } },
  七殺: { good: "魄力十足，能扛壓力、解難題。", bad: "壓力大，易與人衝突或被刁難。", bGood: "魄力解難", bBad: "壓力偏大", side: "但壓力也較耗體力。", fx: { career: 4, health: -2 } },
  正官: { good: "受上級肯定，按流程做事最順。", bad: "受規範束縛、被要求多。", bGood: "上級肯定", bBad: "規範束縛", fx: { career: 6, social: 2, study: 1 } },
  偏印: { good: "靈感與專注力高，適合研究思考。", bad: "容易多疑、想太多、不想社交。", bGood: "靈感專注", bBad: "思慮過多", side: "社交意願會低一些。", fx: { study: 4, social: -1 } },
  正印: { good: "有長輩貴人照應，適合學習與文書。", bad: "依賴心重、行動力下降。", bGood: "貴人照應", bBad: "行動遲緩", fx: { study: 5, health: 2, career: 2 } },
};

const PILLAR_ROLE = [
  { name: "年支", role: "長輩、家族與大環境", cat: "social" as CategoryKey },
  { name: "月支", role: "工作環境、同事與父母", cat: "career" as CategoryKey },
  { name: "日支", role: "你自己、伴侶與身體", cat: "love" as CategoryKey },
  { name: "時支", role: "子女、部屬與計畫成果", cat: "career" as CategoryKey },
];

const PALACE_CAT: Record<string, Partial<Record<CategoryKey, number>>> = {
  命宮: { overall: 1 }, 兄弟: { social: 1 }, 夫妻: { love: 1 }, 子女: { love: 0.6, social: 0.4 },
  財帛: { wealth: 1 }, 疾厄: { health: 1 }, 遷移: { travel: 1 }, 交友: { social: 1 },
  官祿: { career: 1 }, 田宅: { wealth: 0.5, love: 0.5 }, 福德: { health: 0.5, overall: 0.5 }, 父母: { study: 0.7, career: 0.3 },
};
const PALACE_PLAIN: Record<string, string> = {
  命宮: "你自己的狀態與表現", 兄弟: "手足與同輩合作", 夫妻: "伴侶與感情", 子女: "子女、晚輩與桃花",
  財帛: "金錢收支與理財", 疾厄: "身體健康", 遷移: "外出、旅行與外部環境", 交友: "朋友、同事與部屬",
  官祿: "工作與事業", 田宅: "家庭與不動產", 福德: "心情、享受與精神狀態", 父母: "長輩、上級與文書",
};
const HUA_INFO: Record<"祿" | "權" | "科" | "忌", { w: number; plain: string }> = {
  祿: { w: 4, plain: "帶來機會、順利與收穫" }, 權: { w: 3, plain: "帶來主導力與掌控度" },
  科: { w: 3, plain: "帶來名聲、貴人與好評" }, 忌: { w: -5, plain: "帶來阻礙、執著與卡關" },
};
const LUCKY_STARS = ["左輔", "右弼", "文昌", "文曲", "祿存", "紫微", "天府", "太陽", "太陰", "天同", "天梁", "天相"];
const SHA_STARS = ["擎羊", "陀羅", "火星", "鈴星", "地空", "地劫"];

const SHENSHA_FX: Record<string, { fx: Partial<Record<CategoryKey, number>>; plain: string; brief: string; tips?: Evidence["tips"] }> = {
  天乙貴人: { fx: { social: 5, career: 3, overall: 3 }, plain: "命中最尊貴的吉神到位，今天容易遇到願意幫你的人，遇難也較能化解。", brief: "貴人到位", tips: { social: { do: "有事請託、拜訪長官或前輩，成功率較高" } } },
  文昌: { fx: { study: 5, career: 2 }, plain: "主聰明與文采，今天讀書、寫報告、考試、簽文件都較順利。", brief: "文昌加持", tips: { study: { do: "把最需要動腦的寫作或報告排在今天" } } },
  祿神: { fx: { wealth: 3, career: 2, health: 2 }, plain: "祿是「食祿、俸祿」，今天衣食收入穩定，工作有實質回報。", brief: "祿神臨日" },
  羊刃: { fx: { health: -3, wealth: -2, social: -2 }, plain: "羊刃是剛烈之氣，今天脾氣較急、衝動，也要留意刀具、運動與交通的小傷。", brief: "羊刃剛烈", tips: { health: { dont: "激烈運動、使用刀具時分心" }, social: { dont: "逞一時口快" } } },
  驛馬: { fx: { travel: 5, career: 1 }, plain: "驛馬主奔波移動，今天適合出差、旅遊、搬動，也可能臨時要跑外務。", brief: "驛馬星動", tips: { travel: { do: "安排出行或外勤，移動中易有收穫" } } },
  桃花: { fx: { love: 5, social: 2 }, plain: "桃花主人緣與異性緣，今天魅力提升、社交活躍。", brief: "桃花人緣", tips: { love: { do: "打扮一下、參加聚會，人緣特別好" } } },
  華蓋: { fx: { study: 3, social: -2 }, plain: "華蓋主孤高與才藝，今天適合獨處思考、研究、靜心，社交意願較低。", brief: "華蓋獨思" },
};

const HEX_CAT: Record<number, Partial<Record<CategoryKey, number>>> = {
  31: { love: 3 }, 37: { love: 2 }, 54: { love: -3 }, 44: { love: -2 }, 56: { travel: 2 }, 59: { travel: 1 },
  4: { study: 3 }, 26: { study: 2 }, 6: { social: -3 }, 13: { social: 3 }, 8: { social: 3 }, 45: { social: 2 },
  14: { wealth: 3 }, 42: { wealth: 2 }, 41: { wealth: -2 }, 23: { wealth: -2 }, 35: { career: 3 }, 46: { career: 3 },
  12: { career: -2 }, 36: { career: -2 }, 27: { health: 2 }, 29: { health: -2 }, 28: { health: -2 }, 39: { travel: -3 }, 5: { travel: -1 },
};

type Yongshen = { key: CategoryKey; label: string; find: (c: QimenChart) => number | null; plain: string };

const pad = (n: number) => String(n).padStart(2, "0");
const clamp = (x: number, a = 0, b = 100) => Math.max(a, Math.min(b, x));
const LUNAR_MONTH = ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "臘"];
const lunarDayName = (d: number) => d === 10 ? "初十" : d === 20 ? "二十" : d === 30 ? "三十"
  : (["初", "十", "廿", "三"][Math.floor(d / 10)] + ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"][d % 10]);

function relationToSelf(selfEl: string, otherEl: string) {
  if (selfEl === otherEl) return { name: "比和", delta: 1 };
  if (GEN[otherEl] === selfEl) return { name: "生我", delta: 1.5 };
  if (CTRL[otherEl] === selfEl) return { name: "剋我", delta: -1.5 };
  if (CTRL[selfEl] === otherEl) return { name: "我剋", delta: 0.5 };
  return { name: "我生", delta: -0.5 };
}

function ageOn(birth: string, y: number, m: number, d: number) {
  const [by, bm, bd] = birth.split("-").map(Number);
  return y - by - (m < bm || (m === bm && d < bd) ? 1 : 0);
}

export function computeDailyReport(p: Profile, dateStr: string): DailyReport {
  const [y, m, d] = dateStr.split("-").map(Number);
  const chart = computeBazi(p);
  const flow = fourPillars(y, m, d, "12:00");
  const dmIdx = chart.pillars.day.index % 10;
  const fStem = flow.day.index % 10, fBranch = flow.day.index % 12;
  const natal = [chart.pillars.year, chart.pillars.month, chart.pillars.day, chart.pillars.hour];
  const natalBranches = natal.filter(Boolean).map(g => g!.index % 12);
  const season = seasonOf(chart.pillars.month.index % 12);
  const evs: Evidence[] = [];
  let seq = 0;
  const add = (e: Omit<Evidence, "id">) => evs.push({ ...e, id: `e${seq++}` });

  // ═══ 八字：流日天干十神 ═══
  const tg = tenGod(dmIdx, fStem);
  const fEl = STEM_ELEMENT[fStem];
  const fav = chart.favorable.includes(fEl);
  const info = TG_DAILY[tg];
  const fx: Partial<Record<CategoryKey, number>> = { overall: fav ? 4 : -4 };
  for (const [k, v] of Object.entries(info.fx) as [CategoryKey, number][]) fx[k] = fav ? v : v > 0 ? -v * 0.6 : v * 1.2;
  const loveTg = p.gender === "male" ? ["正財", "偏財"] : ["正官", "七殺"];
  if (loveTg.includes(tg)) fx.love = (fx.love ?? 0) + (fav ? 3 : -2);
  add({
    system: "八字", term: tg,
    pro: `流日天干「${STEMS[fStem]}」（${fEl}）對日主「${chart.dayMaster}」為${tg}；你的喜用五行為${chart.favorable.join("、")}，此${fav ? "屬喜用，力量為你所用" : "屬忌神，力量反成負擔"}。`,
    plain: `今天的主能量是「${tg}」。${fav ? info.good + (info.side ?? "") : info.bad}${loveTg.includes(tg) ? `（${p.gender === "male" ? "男命財星亦代表伴侶" : "女命官殺亦代表伴侶"}，感情面也會被牽動。）` : ""}`,
    brief: fav ? info.bGood : info.bBad, briefNeg: info.bBad, effects: fx,
  });

  // ═══ 八字：流日地支五行 ═══
  const bEl = BRANCH_ELEMENT[fBranch];
  const bFav = chart.favorable.includes(bEl);
  const bTg = tenGod(dmIdx, HIDDEN_STEMS[fBranch][0]);
  add({
    system: "八字", term: "流日地支",
    pro: `流日地支「${BRANCHES[fBranch]}」本氣${STEMS[HIDDEN_STEMS[fBranch][0]]}（${bEl}），對日主為${bTg}，${bFav ? "屬喜用" : "屬忌神"}。`,
    plain: bFav ? `今天的「地氣」對你有利，做事有根、比較踏實。` : `今天的「地氣」不太幫你，做事容易使不上力，需要多一點耐心。`,
    brief: bFav ? "地支得力" : "地支不助", effects: { overall: bFav ? 3 : -3, health: bFav ? 1 : -1 },
  });

  // ═══ 八字：地支與四柱之刑沖合 ═══
  natal.forEach((gz, i) => {
    if (!gz) return;
    const nb = gz.index % 12;
    const rel = branchRelation(fBranch, nb);
    if (!rel) return;
    const role = PILLAR_ROLE[i];
    const isDay = i === 2;
    if (rel === "沖") {
      const natalEl = BRANCH_ELEMENT[nb];
      const clearsJi = !chart.favorable.includes(natalEl) && bFav;
      if (clearsJi) {
        add({
          system: "滴天髓", term: `${role.name}逢沖`, quote: CLASH_QUOTE,
          pro: `流日${BRANCHES[fBranch]}沖本命${role.name}${BRANCHES[nb]}；被沖之${BRANCHES[nb]}（${natalEl}）為忌神，流日${bEl}為喜用，屬「沖去忌神」。`,
          plain: `今天與${role.role}相關的事會有變動，但這次的變動是把原本卡住你的東西沖開，反而是好事。`,
          brief: "沖開阻礙", effects: { overall: 2, [role.cat]: 2 },
        });
      } else {
        const e: Partial<Record<CategoryKey, number>> = isDay
          ? { overall: -3, health: -3, love: -3, travel: -2 }
          : { overall: -1.5, [role.cat]: -3 };
        add({
          system: "八字", term: `${role.name}逢沖`,
          pro: `流日${BRANCHES[fBranch]}與本命${role.name}${BRANCHES[nb]}六沖（對宮相沖），主變動與衝突。`,
          plain: `今天與「${role.role}」相關的事容易有變動、衝突或情緒起伏。${isDay ? "日支是你自己的位置，被沖代表身心較躁動，出門交通也要多留意。" : ""}`,
          brief: `${role.name}逢沖`, effects: e,
          tips: isDay ? { travel: { dont: "開快車、趕行程" }, love: { dont: "在情緒上頭時吵架" } } : undefined,
        });
      }
    } else if (rel === "六合" || rel === "三合") {
      const w = rel === "六合" ? 1 : 0.6;
      add({
        system: "八字", term: `${role.name}${rel}`,
        pro: `流日${BRANCHES[fBranch]}與本命${role.name}${BRANCHES[nb]}${rel === "六合" ? "六合" : "三合（半合）"}，主和諧、牽引與助力。`,
        plain: `今天與「${role.role}」的互動較和諧，容易有人情往來或合作機會。`,
        brief: `${role.name}逢合`, effects: isDay ? { love: 4 * w, social: 2 * w, overall: 1 } : { [role.cat]: 2.5 * w, social: 1.5 * w },
      });
    } else if (rel === "刑") {
      add({
        system: "八字", term: `${role.name}逢刑`,
        pro: `流日${BRANCHES[fBranch]}與本命${role.name}${BRANCHES[nb]}相刑，主摩擦、是非與小傷。`,
        plain: `今天與「${role.role}」之間容易有摩擦或誤會，說話多留三分。`,
        brief: `${role.name}逢刑`, effects: isDay ? { health: -2, love: -2 } : { [role.cat]: -2, social: -1 },
      });
    }
  });

  // ═══ 八字：伏吟／反吟、天干合日主 ═══
  const nDay = chart.pillars.day;
  if (flow.day.index === nDay.index) {
    add({ system: "八字", term: "伏吟", pro: `流日${flow.day.text}與本命日柱相同，謂之伏吟。`, plain: "今天與你出生那天的干支相同，容易「舊事重提」、事情反覆，宜靜不宜動。", brief: "伏吟反覆", effects: { overall: -2, travel: -2 } });
  }
  const stemClash = Math.abs(fStem - dmIdx) === 6 && ![4, 5].includes(fStem);
  if (stemClash && (fBranch + 6) % 12 === nDay.index % 12) {
    add({ system: "八字", term: "反吟", pro: `流日${flow.day.text}與本命日柱${nDay.text}天剋地沖，謂之反吟。`, plain: "天干地支同時與你的日柱對沖，是變動最大的一種日子，重要決定與遠行盡量避開。", brief: "反吟大動", effects: { overall: -4, health: -2, travel: -3 } });
  }
  if ((fStem + 5) % 10 === dmIdx || (dmIdx + 5) % 10 === fStem) {
    add({ system: "八字", term: "天干五合", pro: `流日天干${STEMS[fStem]}與日主${chart.dayMaster}相合。`, plain: "今天容易被人事牽絆，有邀約、有人情，感情上也較有互動。", brief: "日主逢合", effects: { love: 2, social: 1 } });
  }

  // ═══ 八字：大運、流年背景 ═══
  const age = ageOn(p.birthDate, y, m, d);
  const luck = chart.luckCycles.filter(c => age >= c.startAge).pop() ?? null;
  if (luck) {
    const lEl = STEM_ELEMENT[STEMS.indexOf(luck.gz[0] as (typeof STEMS)[number])];
    const lFav = chart.favorable.includes(lEl);
    add({
      system: "八字", term: "大運",
      pro: `目前行${luck.gz}大運（${luck.startAge}歲起），運干${luck.gz[0]}屬${lEl}，${lFav ? "為喜用" : "為忌神"}。`,
      plain: lFav ? "你正走在十年一次的順運階段，整體底氣較足，好日子會更好、壞日子也不至於太差。" : "目前這步十年大運對你較吃力，整體基調偏保守，好日子也要見好就收。",
      brief: lFav ? "大運順風" : "大運逆風", effects: { overall: lFav ? 3 : -3 },
    });
  }
  const yStem = flow.year.index % 10, yEl = STEM_ELEMENT[yStem];
  const yFav = chart.favorable.includes(yEl);
  const yTg = tenGod(dmIdx, yStem);
  add({
    system: "八字", term: "流年",
    pro: `${flow.year.text}流年，年干${STEMS[yStem]}對日主為${yTg}，${yFav ? "屬喜用" : "屬忌神"}。`,
    plain: yFav ? `今年的整體氛圍（${yTg}）對你有幫助。` : `今年的整體氛圍（${yTg}）對你稍有壓力。`,
    brief: yFav ? "流年有助" : "流年有壓", effects: { overall: yFav ? 2 : -2 },
  });

  // ═══ 滴天髓 ═══
  for (const h of ditiansuiHits({ dayStem: dmIdx, season, dayBranch: nDay.index % 12, natalBranches, flowStem: fStem, flowBranch: fBranch })) {
    add({
      system: "滴天髓", term: h.quote.length <= 8 ? h.quote : "調候", quote: h.quote,
      pro: `《滴天髓》${h.quote.length <= 8 ? `${chart.dayMaster}干論「${h.quote}」` : "〈寒暖〉篇"}：以你${season}季出生的${chart.dayMaster}日主，檢驗流日${flow.day.text}。`,
      plain: h.plain, brief: h.quote.length <= 8 ? h.quote : "寒暖調候", effects: h.effects,
    });
  }

  // ═══ 神煞 ═══
  for (const s of shenshaHits(dmIdx, chart.pillars.year.index % 12, nDay.index % 12, fBranch)) {
    const f = SHENSHA_FX[s.name];
    add({ system: "神煞", term: s.name, pro: `${s.basis}：流日${BRANCHES[fBranch]}為你的${s.name}。`, plain: f.plain, brief: f.brief, effects: f.fx, tips: f.tips });
  }

  // ═══ 紫微：流日命宮（斗君）＋ 流日四化 ＋ 流年四化 ═══
  const lu = lunarDate(y, m, d);
  const lunarYear = lu.month >= 11 && m <= 2 ? y - 1 : y;
  const flowYearBranch = ((lunarYear - 4) % 12 + 12) % 12;
  const zw = computeZiwei(p);
  if (zw) {
    const fp = flowDayPalace(zw, flowYearBranch, lu.month, lu.day);
    const natalName = zw.palaceNames[fp.day];
    const starsThere = zw.stars[fp.day] ?? [];
    const good = starsThere.filter(s => LUCKY_STARS.includes(s));
    const bad = starsThere.filter(s => SHA_STARS.includes(s));
    const tone = clamp(good.length - bad.length * 1.5, -4, 4);
    const pc = PALACE_CAT[natalName] ?? {};
    const eff: Partial<Record<CategoryKey, number>> = { overall: tone * 0.6 };
    for (const [k, w] of Object.entries(pc) as [CategoryKey, number][]) eff[k] = (eff[k] ?? 0) + (1.5 + tone) * w;
    add({
      system: "紫微", term: "流日命宮",
      pro: `以斗君法推得今日流日命宮在${BRANCHES[fp.day]}，落本命${natalName}，宮內星曜：${starsThere.join("、") || "無主星"}。`,
      plain: `今天的焦點落在「${PALACE_PLAIN[natalName] ?? natalName}」。${good.length ? `宮內有${good.join("、")}等吉星，這方面較有助力。` : ""}${bad.length ? `但有${bad.join("、")}等煞星，這方面容易有波折。` : ""}${!good.length && !bad.length ? "宮內吉煞不顯，屬平穩。" : ""}`,
      brief: `焦點在${natalName}`, effects: eff,
    });
    const addHua = (stem: string, scope: "流日" | "流年", w: number) => {
      const sh = stemSihuaPalaces(zw, stem);
      (Object.keys(sh) as ("祿" | "權" | "科" | "忌")[]).forEach(k => {
        const pal = sh[k].palace;
        if (!pal) return;
        const hi = HUA_INFO[k];
        const e: Partial<Record<CategoryKey, number>> = {};
        for (const [c, pw] of Object.entries(PALACE_CAT[pal] ?? {}) as [CategoryKey, number][]) e[c] = hi.w * pw * w;
        if (!Object.keys(e).length) return;
        add({
          system: "紫微", term: `化${k}`,
          pro: `${scope}天干${stem}，${sh[k].star}化${k}，落入本命${pal}宮。`,
          plain: `${scope === "流日" ? "今天" : "今年"}在「${PALACE_PLAIN[pal] ?? pal}」方面${hi.plain}。`,
          brief: `化${k}入${pal}`, effects: e,
        });
      });
    };
    addHua(STEMS[fStem], "流日", 1);
    addHua(STEMS[flow.year.index % 10], "流年", 0.4);
  }

  // ═══ 奇門：以年命為自身，依主題取用神，掃描白天時辰 ═══
  const yp = chart.pillars.year;
  const nianMing = STEMS[yp.index % 10] === "甲" ? xunYi(yp.index) : STEMS[yp.index % 10];
  const charts: QimenChart[] = SHI_CHEN.map((_, i) => computeQimen(y, m, d, `${pad(i === 0 ? 0 : i * 2)}:30`));
  const YS: Yongshen[] = [
    { key: "career", label: "開門", find: c => findPalace(c, "door", "開門"), plain: "開門主事業、公務與開展" },
    { key: "wealth", label: "生門", find: c => findPalace(c, "door", "生門"), plain: "生門主利潤、求財與投資" },
    { key: "love", label: "六合", find: c => findPalace(c, "god", "六合"), plain: "六合主婚姻、感情與合作" },
    { key: "health", label: "天心", find: c => findPalace(c, "star", "天心"), plain: "天心主醫藥與調養" },
    { key: "social", label: "值符", find: c => findPalace(c, "god", "值符"), plain: "值符主貴人與上司" },
    { key: "travel", label: "九天", find: c => findPalace(c, "god", "九天"), plain: "九天主遠行、高遠與開展" },
    { key: "study", label: "景門", find: c => findPalace(c, "door", "景門"), plain: "景門主文書、考試與表現" },
  ];
  const selfPal = (c: QimenChart) => findPalace(c, "sky", nianMing) ?? 2;
  const hourScore: Record<CategoryKey, number[]> = Object.fromEntries(CATEGORY_KEYS.map(k => [k, []])) as never;
  charts.forEach(c => {
    const sp = selfPal(c);
    const self = evalPalace(c, sp);
    hourScore.overall.push(self.score);
    for (const ysd of YS) {
      const pal = ysd.find(c);
      if (pal === null) { hourScore[ysd.key].push(0); continue; }
      const ev = evalPalace(c, pal);
      const rel = relationToSelf(PALACE_ELEMENT[self.palace], PALACE_ELEMENT[ev.palace]);
      let s = ev.score + rel.delta;
      if (ysd.key === "health" && findPalace(c, "star", "天芮") === self.palace) s -= 2;
      hourScore[ysd.key].push(s);
    }
  });
  const avgDay = (arr: number[]) => DAYTIME.reduce((s, i) => s + arr[i], 0) / DAYTIME.length;
  const bestHourIdx = (arr: number[]) => ACTIVE.slice().sort((a, b) => arr[b] - arr[a]);
  const bestHoursOf: Record<CategoryKey, string[]> = {} as never;
  for (const k of CATEGORY_KEYS) {
    const arr = hourScore[k];
    bestHoursOf[k] = bestHourIdx(arr).filter(i => arr[i] >= 1.5).slice(0, 2).map(i => `${SHI_CHEN[i]}時 ${SHI_RANGE[i]}`);
  }
  {
    const avg = avgDay(hourScore.overall);
    const bi = bestHourIdx(hourScore.overall)[0];
    const e = evalPalace(charts[bi], selfPal(charts[bi]));
    add({
      system: "奇門", term: "年命",
      pro: `以出生年干「${STEMS[yp.index % 10]}」${STEMS[yp.index % 10] === "甲" ? `（甲遁${nianMing}）` : ""}為年命代表自己；白天各時辰年命落宮平均${avg >= 0 ? "偏吉" : "偏凶"}（${avg.toFixed(1)}）。最佳在${SHI_CHEN[bi]}時落${e.dir}宮：${e.god}、${e.star}、${e.door}${e.notes.filter(n => !["吉門臨宮", "凶門臨宮", "吉星臨宮", "凶星臨宮", "吉神臨宮", "凶神臨宮"].includes(n.plain)).map(n => "、" + n.term).join("")}。`,
      plain: avg >= 1 ? "今天奇門盤上「你自己」所在的位置多半遇到吉門吉神，做事的外在環境對你有利。" : avg <= -1 ? "今天奇門盤上「你自己」所在的位置多遇凶門凶神，外在環境阻力較多，宜守。" : "今天奇門盤上你自身的處境吉凶參半，時辰選得好就順。",
      brief: avg >= 1 ? "奇門得位" : avg <= -1 ? "奇門受困" : "奇門平平", effects: { overall: clamp(avg * 1.6, -6, 6) },
    });
  }
  for (const ysd of YS) {
    const avg = avgDay(hourScore[ysd.key]);
    const bi = bestHourIdx(hourScore[ysd.key])[0];
    const pal = ysd.find(charts[bi]);
    const e = pal !== null ? evalPalace(charts[bi], pal) : null;
    add({
      system: "奇門", term: ysd.label,
      pro: `${ysd.plain}。白天（07–19時）用神「${ysd.label}」落宮與年命生剋之平均為${avg.toFixed(1)}${e ? `；最佳在${SHI_CHEN[bi]}時落${e.dir}宮（${[e.god, e.star, e.door].filter(x => x !== ysd.label).join("、")}${e.kong ? "，逢空亡" : ""}）` : ""}。`,
      plain: avg >= 1.5 ? `今天「${CATEGORY_META[ysd.key].label}」的奇門用神落在好位置，又能生扶你，事情較容易推動。` : avg <= -1 ? `今天「${CATEGORY_META[ysd.key].label}」的奇門用神受制或剋你，推動起來比較吃力。` : `今天「${CATEGORY_META[ysd.key].label}」的奇門用神吉凶參半，挑對時辰做會比較順。`,
      brief: avg >= 1.5 ? `${ysd.label}得力` : avg <= -1 ? `${ysd.label}受制` : avg > 0.3 ? `${ysd.label}小助` : `${ysd.label}平平`,
      effects: { [ysd.key]: clamp(avg * 1.8, -6, 6) },
    });
  }

  // ═══ 易經：梅花易數（流日農曆年月日＋出生時辰） ═══
  const hourNo = p.birthTime ? hourBranchIndex(Number(p.birthTime.split(":")[0])) + 1 : 7;
  const hx = castMeihua(flowYearBranch + 1, lu.month, lu.day, hourNo);
  const ti = TIYONG_INFO[hx.relation];
  const tyFx: Partial<Record<CategoryKey, number>> = { overall: ti.score * 1.8 };
  for (const k of SUB_KEYS) tyFx[k] = ti.score * 0.6;
  add({
    system: "易經", term: "體用生剋",
    pro: `本卦${hx.main.name}，動在${LINE_POSITION[hx.movingLine].name}；體卦${hx.ti.name}（${hx.ti.element}）、用卦${hx.yong.name}（${hx.yong.element}），為「${hx.relation}」（${ti.label}）。`,
    plain: `${ti.plain}${LINE_POSITION[hx.movingLine].plain}`,
    brief: `卦象${hx.relation}`, effects: tyFx,
  });
  const oc = TIYONG_INFO[hx.outcomeRelation];
  const guaTone = hx.main.tone * 0.6 + hx.changed.tone * 0.3 + oc.score * 0.5 + LINE_POSITION[hx.movingLine].score * 0.3;
  const guaFx: Partial<Record<CategoryKey, number>> = { overall: guaTone * 1.2 };
  for (const k of SUB_KEYS) guaFx[k] = guaTone * 0.4 + (HEX_CAT[hx.main.no]?.[k] ?? 0);
  add({
    system: "易經", term: "卦辭", quote: hx.main.judgment,
    pro: `第${hx.main.no}卦 ${hx.main.name}（上${TRIGRAMS[hx.main.upper].name}下${TRIGRAMS[hx.main.lower].name}），互卦${hx.mutual.name}看過程，變卦${hx.changed.name}看結果（${hx.outcomeRelation}，${oc.label}）。`,
    plain: `${hx.main.plain}${hx.main.advice}${oc.score > 0 ? "變卦顯示結果傾向有成。" : "變卦顯示結果容易打折，見好就收。"}`,
    brief: hx.main.keyword, briefNeg: `卦意${hx.main.keyword}`, effects: guaFx,
  });

  // ═══ 合成分數 ═══
  const conf = CONF[p.birthTimeAccuracy];
  const raw: Record<CategoryKey, number> = Object.fromEntries(CATEGORY_KEYS.map(k => [k, 0])) as never;
  const contrib: Record<CategoryKey, { ev: Evidence; delta: number }[]> = Object.fromEntries(CATEGORY_KEYS.map(k => [k, []])) as never;
  for (const ev of evs) {
    for (const [k, v] of Object.entries(ev.effects) as [CategoryKey, number][]) {
      if (!v) continue;
      const w = v * SYSTEM_WEIGHT[ev.system];
      raw[k] += w;
      contrib[k].push({ ev, delta: Math.round(w * SPREAD * conf * 10) / 10 });
    }
  }
  const toScore = (r: number) => Math.round(clamp(50 + r * SPREAD * conf, 3, 98));
  const subScores = Object.fromEntries(SUB_KEYS.map(k => [k, toScore(raw[k] + raw.overall * OVERALL_SHARE)])) as Record<CategoryKey, number>;
  const blended = 0.5 * toScore(raw.overall) + 0.5 * (SUB_KEYS.reduce((s, k) => s + subScores[k], 0) / SUB_KEYS.length);
  const overallScore = Math.round(clamp(50 + (blended - 50) * OVERALL_STRETCH, 3, 98));

  const buildCat = (k: CategoryKey, score: number): CategoryReport => {
    const grade = gradeOf(score);
    const band = bandOf(score);
    const list = contrib[k].slice().sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
    const pos = list.filter(x => x.delta >= 2 && !x.ev.brief.endsWith("平平"));
    const neg = list.filter(x => x.delta <= -2);
    const nb = (x: { ev: Evidence }) => x.ev.briefNeg ?? x.ev.brief;
    let headline = BAND_OPENING[k][band];
    if (pos[0] && band !== "low") headline += `，${pos[0].ev.brief}${pos[1] ? `、${pos[1].ev.brief}` : ""}是助力`;
    if (neg[0] && (band !== "high" || Math.abs(neg[0].delta) >= 3)) headline += `${band === "low" ? "，主因是" : "；留意"}${nb(neg[0])}`;
    if (band === "low" && pos[0]) headline += `，好在有${pos[0].ev.brief}可借力`;
    headline += "。";
    const adv = BAND_ADVICE[k][band];
    const dos = [...adv.dos], donts = [...adv.donts];
    for (const { ev } of list) {
      const t = ev.tips?.[k];
      if (t?.do && !dos.includes(t.do)) dos.unshift(t.do);
      if (t?.dont && !donts.includes(t.dont)) donts.unshift(t.dont);
    }
    if (bestHoursOf[k].length) dos.push(`把重點事項排在 ${bestHoursOf[k].join("、")}`);
    return {
      key: k, label: CATEGORY_META[k].label, glyph: CATEGORY_META[k].glyph, score, grade, headline,
      dos: dos.slice(0, 4), donts: donts.slice(0, 3), bestHours: bestHoursOf[k], evidences: list,
    };
  };

  const categories = SUB_KEYS.map(k => buildCat(k, subScores[k]));
  const overall = buildCat("overall", overallScore);
  const ovList = CATEGORY_KEYS.flatMap(k => contrib[k]);
  overall.evidences = [...new Map(ovList.map(x => [x.ev.id, x])).values()]
    .map(x => ({ ev: x.ev, delta: contrib.overall.find(c => c.ev.id === x.ev.id)?.delta ?? 0 }))
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  const ranked = categories.slice().sort((a, b) => b.score - a.score);
  overall.headline = `${BAND_OPENING.overall[bandOf(overallScore)]}。最旺：${ranked[0].label}（${ranked[0].grade.name}）；最需留意：${ranked[ranked.length - 1].label}（${ranked[ranked.length - 1].grade.name}）。`;

  // ═══ 時辰運勢 ═══
  const noble = TIANYI[dmIdx];
  const hours: HourFortune[] = SHI_CHEN.map((b, i) => {
    const hb = i;
    const rel = branchRelation(hb, nDay.index % 12);
    const hEl = BRANCH_ELEMENT[hb];
    let s = hourScore.overall[i] * 1.2 + (chart.favorable.includes(hEl) ? 1 : -1);
    const notes: string[] = [];
    if (noble.includes(hb)) { s += 2; notes.push("貴人時"); }
    if (rel === "沖") { s -= 2; notes.push("沖日支"); }
    if (rel === "六合") { s += 1; notes.push("合日支"); }
    const best = [...CATEGORY_KEYS].filter(k => k !== "overall").sort((a, c) => hourScore[c][i] - hourScore[a][i])[0];
    const score = Math.round(clamp(50 + s * 4.5 * conf, 5, 95));
    if (hourScore[best][i] >= 2 && score >= 50) notes.push(`利${CATEGORY_META[best].label.slice(0, 2)}`);
    return { branch: b, range: SHI_RANGE[i], score, grade: gradeOf(score), note: notes.join("・") || (score >= 58 ? "平順" : score < 45 ? "宜靜" : "一般"), isNoble: noble.includes(hb) };
  });

  // ═══ 幸運資訊 ═══
  const th = tiaohouElement(season);
  const luckyEl = th && chart.favorable.includes(th) ? th : chart.favorable[0];
  const dirCount: Record<string, number> = {};
  DAYTIME.forEach(i => charts[i].goodDirs.forEach(dd => (dirCount[dd] = (dirCount[dd] ?? 0) + 1)));
  const topDir = Object.entries(dirCount).sort((a, b) => b[1] - a[1])[0]?.[0];
  const luckyHours = ACTIVE.slice().sort((a, b) => hours[b].score - hours[a].score).slice(0, 2).map(i => `${SHI_CHEN[i]}時 ${SHI_RANGE[i]}`);

  overall.bestHours = luckyHours;
  const posAll = evs.map(e => ({ e, v: e.effects.overall ?? 0 })).sort((a, b) => b.v - a.v);
  const keywords: DailyReport["keywords"] = [{ text: hx.main.keyword, tone: "neutral" }];
  if (posAll[0]?.v > 0) keywords.push({ text: posAll[0].e.brief, tone: "pos" });
  const worst = posAll[posAll.length - 1];
  if (worst?.v < 0) keywords.push({ text: worst.e.briefNeg ?? worst.e.brief, tone: "neg" });

  const lon = sunLongitude(jdFromLocal(y, m, d, 12));
  const termIdx = Math.floor(((((lon - 315) % 360) + 360) % 360) / 15);
  const verse = STEM_VERSES[dmIdx];

  return {
    date: dateStr,
    weekday: "日一二三四五六"[new Date(y, m - 1, d).getDay()],
    lunarText: `農曆${lu.isLeap ? "閏" : ""}${LUNAR_MONTH[lu.month - 1]}月${lunarDayName(lu.day)}`,
    ganzhi: { year: flow.year.text, month: flow.month.text, day: flow.day.text },
    solarTerm: SOLAR_TERMS[termIdx].name,
    profileName: p.name,
    dayMaster: `${chart.dayMaster}${chart.dayMasterElement}`,
    overall, categories,
    lucky: {
      element: luckyEl, color: ELEMENT_COLOR[luckyEl].name, colorHex: ELEMENT_COLOR[luckyEl].hex,
      numbers: ELEMENT_NUMBERS[luckyEl], direction: topDir ?? ELEMENT_DIR[luckyEl],
      hours: luckyHours, nobleZodiac: noble.map(b => ZODIAC[b]),
    },
    keywords, hours, hexagram: hx,
    hexagramBasis: `以今日農曆${BRANCHES[flowYearBranch]}年（${flowYearBranch + 1}）${lu.month}月${lu.day}日，加上你的出生時辰${p.birthTime ? SHI_CHEN[hourNo - 1] : "（未提供，以午時代）"}（${hourNo}）起卦：上卦 (${flowYearBranch + 1}+${lu.month}+${lu.day})÷8 餘數、下卦與動爻再加時辰數。`,
    ditiansui: { stem: verse.stem, verse: verse.verse, plain: verse.plain, season, tiaohou: th },
    evidences: evs,
    confidence: p.birthTimeAccuracy === "exact" ? "high" : p.birthTimeAccuracy === "approximate" ? "medium" : "low",
    confidenceNote: p.birthTimeAccuracy === "exact" ? "出生時辰確定，八字四柱、紫微、奇門年命與易經起卦皆以完整資料計算。"
      : p.birthTimeAccuracy === "approximate" ? "出生時辰為大約值，時柱與紫微宮位可能有偏差，分數已向中間收斂 15%。"
      : "出生時辰不確定，紫微與部分判斷參考性降低，分數已向中間收斂 35%。",
    disclaimer: "命理為傳統文化參考，分數代表「傾向」而非必然；投資請依自身紀律與停損停利，健康與法律問題請諮詢專業人士。",
  };
}

export { PALACE_DIR };
