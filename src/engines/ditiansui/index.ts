/** 滴天髓（京圖撰、劉基注、任鐵樵增注）：十干論＋調候＋旺衰沖剋。
 *  以本命日主之「天干性情」與出生季節，逐條檢驗流日干支，產生可追溯原文的判斷。 */
import type { CategoryKey } from "@/types/daily";

export type Season = "春" | "夏" | "秋" | "冬";
export const seasonOf = (monthBranch: number): Season =>
  [2, 3, 4].includes(monthBranch) ? "春" : [5, 6, 7].includes(monthBranch) ? "夏" : [8, 9, 10].includes(monthBranch) ? "秋" : "冬";

export const STEM_VERSES: { stem: string; verse: string; plain: string }[] = [
  { stem: "甲", verse: "甲木參天，脫胎要火。春不容金，秋不容土。火熾乘龍，水宕騎虎。地潤天和，植立千古。", plain: "甲木像參天大樹，要有火（才華出口）才能成材；春天怕金砍、秋天怕土重；夏天火旺要濕土，冬天水多要有根。" },
  { stem: "乙", verse: "乙木雖柔，刲羊解牛。懷丁抱丙，跨鳳乘猴。虛濕之地，騎馬亦憂。藤蘿繫甲，可春可秋。", plain: "乙木像花草藤蔓，看似柔弱卻能扎根於土；最喜丙丁火溫暖，有甲木大樹可攀附就四季皆宜。" },
  { stem: "丙", verse: "丙火猛烈，欺霜侮雪。能煆庚金，逢辛反怯。土眾成慈，水猖顯節。虎馬犬鄉，甲來成滅。", plain: "丙火像太陽，熱情猛烈不怕寒；能鍛鍊庚金，遇辛金相合反而失去光芒；火局再加甲木會過旺自焚。" },
  { stem: "丁", verse: "丁火柔中，內性昭融。抱乙而孝，合壬而忠。旺而不烈，衰而不窮。如有嫡母，可秋可冬。", plain: "丁火像燭光，外柔內明；得乙木生扶、與壬水相合皆有情；有甲木（嫡母）扶持，秋冬也不怕。" },
  { stem: "戊", verse: "戊土固重，既中且正。靜翕動辟，萬物司命。水潤物生，火燥物病。若在艮坤，怕沖宜靜。", plain: "戊土像高山厚土，穩重中正；有水滋潤萬物生長，火太燥則生病；日坐寅申最怕被沖，宜靜不宜動。" },
  { stem: "己", verse: "己土卑濕，中正蓄藏。不愁木盛，不畏水狂。火少火晦，金多金光。若要物旺，宜助宜幫。", plain: "己土像田園濕土，能包容蓄藏；喜火來溫暖、金來發揮光彩；想要興旺需要同類幫助。" },
  { stem: "庚", verse: "庚金帶煞，剛健為最。得水而清，得火而銳。土潤則生，土乾則脆。能贏甲兄，輸於乙妹。", plain: "庚金像刀劍原礦，剛健果決；遇水變清秀、遇丁火鍛鍊成器；濕土能生、燥土反脆；乙木相合易被柔情牽動。" },
  { stem: "辛", verse: "辛金軟弱，溫潤而清。畏土之疊，樂水之盈。能扶社稷，能救生靈。熱則喜母，寒則喜丁。", plain: "辛金像珠玉首飾，溫潤清秀；怕厚土埋沒，喜水洗淘生輝；夏天喜濕土、冬天喜丁火。" },
  { stem: "壬", verse: "壬水通河，能洩金氣。剛中之德，周流不滯。通根透癸，沖天奔地。化則有情，從則相濟。", plain: "壬水像江河，流動不息、剛中有德；水勢太旺則氾濫成災；與丁火相合化木則有情。" },
  { stem: "癸", verse: "癸水至弱，達於天津。得龍而運，功化斯神。不愁火土，不論庚辛。合戊見火，化象斯真。", plain: "癸水像雨露，最柔弱卻能潤澤萬物；得辰（龍）則能興雲布雨，與戊相合見火可化。" },
];

export const TIAOHOU_QUOTE = "天道有寒暖，發育萬物，人道得之，不可過也。";
export const CLASH_QUOTE = "旺者沖衰衰者拔，衰神沖旺旺神發。";

export interface DtsContext {
  dayStem: number; season: Season; dayBranch: number;
  natalBranches: number[]; flowStem: number; flowBranch: number;
}

export interface DtsHit { quote: string; plain: string; effects: Partial<Record<CategoryKey, number>> }

type Rule = { quote: string; plain: string; when: (c: DtsContext) => boolean; effects: Partial<Record<CategoryKey, number>> };

const S = (...xs: number[]) => (c: DtsContext) => xs.includes(c.flowStem);
const B = (...xs: number[]) => (c: DtsContext) => xs.includes(c.flowBranch);

const RULES: Record<number, Rule[]> = {
  0: [
    { quote: "脫胎要火", plain: "甲木需要火才能展現才華；今天見丙丁火，是發揮能力、交出成果的時機。", when: S(2, 3), effects: { career: 4, study: 3, overall: 2 } },
    { quote: "春不容金", plain: "春生甲木嫩而未堅，不耐金剋；今天庚辛金出現，易感受到上級或規範的壓力。", when: c => c.season === "春" && S(6, 7)(c), effects: { career: -3, health: -2, overall: -2 } },
    { quote: "秋不容土", plain: "秋季木氣衰弱，無力承擔厚土（財）；今天見戊己土，財多身弱，理財宜保守。", when: c => c.season === "秋" && S(4, 5)(c), effects: { wealth: -4, overall: -2 } },
    { quote: "火熾乘龍", plain: "夏天火旺，甲木得辰土或壬癸水潤澤才不枯焦；今天正好有這股調和力量。", when: c => c.season === "夏" && (B(4)(c) || S(8, 9)(c)), effects: { health: 3, overall: 3 } },
    { quote: "水宕騎虎", plain: "冬天水多木漂，得寅（虎）可生根立足；今天腳步踏實，適合穩住基本盤。", when: c => c.season === "冬" && B(2)(c), effects: { overall: 3, career: 2 } },
  ],
  1: [
    { quote: "懷丁抱丙", plain: "乙木最喜丙丁火的溫暖照耀；今天心情開朗、表現力佳。", when: S(2, 3), effects: { overall: 3, career: 2, love: 2 } },
    { quote: "藤蘿繫甲", plain: "乙木像藤蔓攀附大樹；今天見甲木，易得強者或貴人扶持。", when: S(0), effects: { social: 4, career: 2 } },
    { quote: "刲羊解牛", plain: "乙木能在丑未土中扎根取財；今天務實理財、處理帳務較得心應手。", when: B(1, 7), effects: { wealth: 3 } },
    { quote: "虛濕之地，騎馬亦憂", plain: "冬生乙木身處寒濕，今天再逢亥子水地，精神易低落，宜保暖養身。", when: c => c.season === "冬" && B(0, 11)(c), effects: { health: -3, overall: -2 } },
  ],
  2: [
    { quote: "能煆庚金", plain: "丙火能鍛鍊庚金；今天遇到的機會與財務事項，你有能力駕馭。", when: S(6), effects: { wealth: 4, career: 2 } },
    { quote: "逢辛反怯", plain: "丙火遇辛金相合而失去光芒；今天容易被小利或情感牽絆，判斷力打折。", when: S(7), effects: { career: -2, wealth: -2, love: 2 } },
    { quote: "土眾成慈", plain: "丙火生土，付出如慈母；今天樂於照顧他人，但也容易為人操勞。", when: S(4, 5), effects: { social: 2, wealth: -1 } },
    { quote: "水猖顯節", plain: "水勢猖狂時丙火反顯氣節；今天壓力大，但正是展現擔當的時候。", when: S(8, 9), effects: { career: 2, health: -1 } },
    { quote: "虎馬犬鄉，甲來成滅", plain: "命中寅午戌火局遇甲木再添柴，火勢過旺；今天容易急躁上火，宜降速。", when: c => S(0)(c) && [...c.natalBranches, c.flowBranch].filter(b => [2, 6, 10].includes(b)).length >= 2, effects: { health: -3, overall: -3 } },
  ],
  3: [
    { quote: "抱乙而孝", plain: "丁火得乙木生扶；今天思路清晰、適合學習與規劃。", when: S(1), effects: { study: 3, overall: 2 } },
    { quote: "合壬而忠", plain: "丁壬相合、忠於職守；今天對上級負責的態度會被看見。", when: S(8), effects: { career: 4, social: 2 } },
    { quote: "如有嫡母，可秋可冬", plain: "秋冬生的丁火最需甲木（嫡母）扶持；今天見甲木，底氣十足。", when: c => (c.season === "秋" || c.season === "冬") && S(0)(c), effects: { overall: 4, health: 2 } },
  ],
  4: [
    { quote: "水潤物生", plain: "戊土得水滋潤，萬物才能生長；今天見壬癸水（財），利於財務與資源整合。", when: S(8, 9), effects: { wealth: 4, overall: 2 } },
    { quote: "火燥物病", plain: "夏生戊土再遇火，燥土不生物；今天容易口乾舌燥、情緒煩躁。", when: c => c.season === "夏" && S(2, 3)(c), effects: { health: -3, overall: -2 } },
    { quote: "若在艮坤，怕沖宜靜", plain: "你的日支坐寅或申，今天正逢沖動，宜靜不宜動，重大變動與遠行延後。", when: c => [2, 8].includes(c.dayBranch) && c.flowBranch === (c.dayBranch + 6) % 12, effects: { travel: -4, overall: -3 } },
  ],
  5: [
    { quote: "火少火晦", plain: "己土需要丙火溫暖，今天得陽光照耀，精神與氣色轉好。", when: S(2), effects: { overall: 3, health: 2 } },
    { quote: "金多金光", plain: "己土生金，金多則光彩外顯；今天口才與專業容易被看見。", when: S(6, 7), effects: { study: 3, career: 2 } },
    { quote: "宜助宜幫", plain: "己土要興旺需要同類幫助；今天找夥伴合作事半功倍。", when: S(4, 5), effects: { social: 3 } },
    { quote: "不愁木盛，不畏水狂", plain: "己土能包容木水，今天即使壓力或花費較多，也能沉著消化。", when: S(0, 1, 8, 9), effects: { overall: 1 } },
  ],
  6: [
    { quote: "得水而清", plain: "庚金得水洗淘而清秀；今天思路靈活、表達清楚。", when: S(8, 9), effects: { study: 3, career: 2 } },
    { quote: "得火而銳", plain: "庚金經丁火鍛鍊方成利器；今天的壓力與要求，正是讓你更專業的磨練。", when: S(3), effects: { career: 4 } },
    { quote: "土潤則生", plain: "濕土能生庚金；今天得長輩或資源支持，身心安穩。", when: c => S(5)(c) || B(1, 4)(c), effects: { health: 2, overall: 2 } },
    { quote: "土乾則脆", plain: "夏天燥土不但不生金反使金脆；今天看似有靠山，實則不牢靠。", when: c => c.season === "夏" && (S(4)(c) || B(7, 10)(c)), effects: { health: -2, overall: -2 } },
    { quote: "能贏甲兄", plain: "庚金能劈甲木為用；今天處理財務、爭取資源較有魄力。", when: S(0), effects: { wealth: 3 } },
    { quote: "輸於乙妹", plain: "乙庚相合，剛金被柔木牽制；今天容易因感情或人情而心軟讓步。", when: S(1), effects: { love: 3, wealth: -2 } },
  ],
  7: [
    { quote: "畏土之疊", plain: "辛金怕厚土埋沒；今天容易被瑣事、長輩意見壓住，光芒難顯。", when: S(4, 5), effects: { overall: -3, study: -2 } },
    { quote: "樂水之盈", plain: "辛金喜水洗淘生輝；今天才華外顯，適合表現與溝通。", when: S(8, 9), effects: { overall: 3, career: 3, study: 2 } },
    { quote: "熱則喜母", plain: "夏生辛金喜己土（母）護身降溫；今天得人照應。", when: c => c.season === "夏" && S(5)(c), effects: { health: 3, social: 2 } },
    { quote: "寒則喜丁", plain: "冬生辛金喜丁火溫暖；今天心情與體力都回暖。", when: c => c.season === "冬" && S(3)(c), effects: { health: 3, overall: 2 } },
  ],
  8: [
    { quote: "能洩金氣", plain: "壬水能引通金氣；今天適合把累積的資料與想法整理輸出。", when: S(6, 7), effects: { study: 2, overall: 1 } },
    { quote: "周流不滯", plain: "壬水周流不滯；今天見木，行動力與流動性強，利出行與推進。", when: S(0, 1), effects: { career: 2, travel: 3 } },
    { quote: "通根透癸，沖天奔地", plain: "水勢通根又透癸，氾濫奔騰；今天容易衝動過頭，花錢與決策都要踩煞車。", when: c => S(9)(c) && B(0, 11)(c), effects: { wealth: -3, overall: -3 } },
    { quote: "化則有情", plain: "丁壬相合而有情；今天感情與人緣都有溫度。", when: S(3), effects: { love: 4, social: 2 } },
  ],
  9: [
    { quote: "得龍而運", plain: "癸水得辰（龍）則興雲布雨；今天時機到位，想法有機會落實。", when: B(4), effects: { overall: 4, career: 3 } },
    { quote: "合戊見火，化象斯真", plain: "戊癸相合，正官與你有情；今天與上級、制度或伴侶的關係和諧。", when: S(4), effects: { love: 3, career: 2 } },
    { quote: "不愁火土", plain: "癸水雖弱卻不怕火土；今天面對開銷或壓力仍能從容。", when: S(2, 3, 5), effects: { wealth: 1 } },
  ],
};

const ELEMENT_OF_STEM = ["木", "木", "火", "火", "土", "土", "金", "金", "水", "水"];
const ELEMENT_OF_BRANCH = ["水", "土", "木", "木", "土", "火", "火", "土", "金", "金", "土", "水"];

/** 調候用神：冬生喜火、夏生喜水（寒暖燥濕）。 */
export function tiaohouElement(season: Season): "火" | "水" | null {
  return season === "冬" ? "火" : season === "夏" ? "水" : null;
}

export function ditiansuiHits(c: DtsContext): DtsHit[] {
  const hits: DtsHit[] = RULES[c.dayStem].filter(r => r.when(c)).map(r => ({ quote: r.quote, plain: r.plain, effects: r.effects }));
  const th = tiaohouElement(c.season);
  if (th) {
    const flowEls = [ELEMENT_OF_STEM[c.flowStem], ELEMENT_OF_BRANCH[c.flowBranch]];
    const opposite = th === "火" ? "水" : "火";
    if (flowEls.includes(th)) {
      hits.push({ quote: TIAOHOU_QUOTE, plain: `你生於${c.season}季，命局${c.season === "冬" ? "偏寒，最需火來溫暖" : "偏燥熱，最需水來滋潤"}；今天流日帶${th}，正好調和寒暖，身心較舒暢。`, effects: { health: 3, overall: 3 } });
    } else if (flowEls.filter(e => e === opposite).length === 2) {
      hits.push({ quote: TIAOHOU_QUOTE, plain: `你生於${c.season}季，命局本就${c.season === "冬" ? "偏寒" : "偏熱"}；今天干支皆${opposite}，寒暖更失衡，注意作息與情緒。`, effects: { health: -3, overall: -2 } });
    }
  }
  return hits;
}
