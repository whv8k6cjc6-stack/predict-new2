/** 白話註解：把三式盤面轉成一般人看得懂的重點與名詞速查。
 *  內容為通行命理釋義，僅供個人參考，非絕對吉凶。 */
import type { BaziChart } from "@/engines/bazi";
import type { ZiweiChart } from "@/engines/ziwei";
import type { QimenChart } from "@/engines/qimen";
import { PALACE_DIR } from "@/engines/qimen";

export interface Notes { highlights: string[]; glossary: { term: string; desc: string }[] }

// —— 十神白話 ——
export const TEN_GOD_MEANING: Record<string, string> = {
  比肩: "自我、同儕、合作與競爭；助身但也分財。",
  劫財: "積極、好勝；耗財、合夥借貸宜謹慎。",
  食神: "才華、表達、口福與餘裕；溫和生財。",
  傷官: "創意、不受拘束、聰明外顯；易與權威或規範起摩擦。",
  偏財: "機會財、業外收入、人緣財；流動大、來去快。",
  正財: "穩定收入、務實理財、踏實積累。",
  七殺: "壓力、挑戰、魄力與執行力；得用則果決，失制則衝動。",
  正官: "責任、自律、地位與上級關係；重規矩。",
  偏印: "偏門技藝、靈感、宗教玄學；想得多、較孤。",
  正印: "學習、貴人、文書、庇蔭與名聲。",
};

// —— 紫微 14 主星白話 ——
export const ZIWEI_STAR_MEANING: Record<string, string> = {
  紫微: "帝星，主領導、尊貴、好面子；需百官（輔星）相助方顯格局。",
  天機: "智慧星，主謀略、機變、思慮多；利動腦，性較不定。",
  太陽: "主熱情、付出、名聲；男命利父子，女命利夫子，付出多。",
  武曲: "財星、將星，主剛毅、果決、重財務執行力。",
  天同: "福星，主隨和、享受、人緣好；惰性與依賴是課題。",
  廉貞: "多面星、次桃花，主公關、才藝，亦主是非與情緒起伏。",
  天府: "庫星，主穩重、保守、善理財守成。",
  太陰: "財星，主細膩、內斂、不動產；夜生人力強。",
  貪狼: "慾望星、桃花，主多才多藝、交際、企圖心。",
  巨門: "暗星，主口才、研究、是非口舌；宜靠專業說話。",
  天相: "印星，主輔佐、誠信、衣食；重形象與協調。",
  天梁: "蔭星，主原則、長者風、逢凶化吉；偏固執。",
  七殺: "將星，主衝勁、開創、獨當一面；起伏大。",
  破軍: "耗星，主破舊立新、變動、開創；不安於現狀。",
};

// —— 奇門八門 / 九星 / 八神白話 ——
export const QIMEN_DOOR_MEANING: Record<string, string> = {
  開門: "開展、公門、貴人；利求職、開業、洽公。", 休門: "休養、和緩、談和；利見人、求醫、簽約。",
  生門: "生機、求財；利投資理財、置產、開店。", 傷門: "損傷、爭競；利討債、競賽，不利文書合約。",
  杜門: "阻隔、隱藏；利躲災、保密，不利公開求謀。", 景門: "文書、虛象、宣傳；利考試、面試，多虛少實。",
  死門: "停滯、終結；多不利，唯利弔喪、打獵。", 驚門: "口舌、驚擾；多是非，利訴訟口才之事。",
};
export const QIMEN_STAR_MEANING: Record<string, string> = {
  天蓬: "主動盪、是非、偏財（水）。", 天任: "主穩重、踏實、利耕作積累。",
  天沖: "主急速、衝動、利出行求快。", 天輔: "文昌吉星，利讀書、文教、求學問。",
  天英: "主虛火、表現、血光；華而不實。", 天芮: "病星，主疾病、學習、求醫問藥相關。",
  天柱: "主口舌、破壞、退守。", 天心: "醫藥、謀略吉星，利醫療、策劃。", 天禽: "中正吉星，利中介、協調。",
};
export const QIMEN_GOD_MEANING: Record<string, string> = {
  值符: "至尊吉神，主貴人、首腦，諸事可托。", 螣蛇: "主虛驚、怪異、纏繞之事。",
  太陰: "主陰私、暗中相助、隱密之事。", 六合: "主合作、婚姻、中介撮合。",
  白虎: "主凶傷、道路、軍警血光。", 玄武: "主盜竊、欺瞞、暗昧之事。",
  九地: "主防守、隱藏、柔順穩固。", 九天: "主高遠、揚名、利出行與開展。",
};

const STRONG_ADVICE = "日主偏強，宜順勢洩用（食傷生財、官殺制身），逢喜用之財官運較能發揮；忌再添同類助力。";
const WEAK_ADVICE = "日主偏弱，宜生扶（印星生身、比劫助力），逢喜用之印比運較順；忌再被剋洩交加。";

export function baziNotes(c: BaziChart): Notes {
  const lean = c.strengthLabel.includes("強") ? "strong" : "weak";
  const adv = lean === "strong" ? STRONG_ADVICE : WEAK_ADVICE;
  const highlights = [
    `你的「日主」是 ${c.dayMaster}${c.dayMasterElement}，代表本命核心、也就是「你自己」。`,
    `綜合強弱 ${c.strength} 分（${c.strengthLabel}）。${adv}`,
    `喜用五行：${c.favorable.join("、")}；較不利：${c.unfavorable.join("、")}。逢喜用的年、月、日通常較順，逢忌神則需保守。`,
    `年柱對你而言是「${c.tenGods.year}」、月柱是「${c.tenGods.month}」${c.tenGods.hour ? `、時柱是「${c.tenGods.hour}」` : ""}——這些「十神」就是各種人事物對你的作用力（見下方速查）。`,
    `大運每十年一換（目前${c.luckForward ? "順" : "逆"}排），走到喜用五行的大運，是相對順遂的階段。`,
  ];
  const tg = new Set([c.tenGods.year, c.tenGods.month, c.tenGods.hour].filter(Boolean) as string[]);
  const glossary = [
    { term: "日主", desc: "出生「日」的天干，代表你本人；其餘干支都圍繞它論吉凶。" },
    { term: "強弱", desc: "本命得到生扶（強）或剋洩（弱）的程度，決定喜忌方向。" },
    { term: "喜用／忌神", desc: "對你有利的五行為喜用，不利的為忌神。" },
    ...[...tg].map(t => ({ term: t, desc: TEN_GOD_MEANING[t] ?? "" })),
  ];
  return { highlights, glossary };
}

export function ziweiNotes(c: ZiweiChart): Notes {
  const mingStars = (c.stars[c.mingGong] ?? []).filter(s => ZIWEI_STAR_MEANING[s]);
  const huaLines = (["祿", "權", "科", "忌"] as const).map(k => {
    const star = c.sihua[k]; const pal = c.palaceOf(star);
    const palName = pal === null ? "（不在十二宮主星位）" : c.palaceNames[pal];
    const eff = k === "祿" ? "增財祿、機會" : k === "權" ? "增權力、主導" : k === "科" ? "增名聲、貴人" : "添阻礙、執著，宜留意";
    return `生年化${k}在「${star}」，落${palName}宮 → 該領域${eff}。`;
  });
  const highlights = [
    mingStars.length
      ? `你的「命宮」坐 ${mingStars.join("、")}，這是看本命性格與格局的主軸（各星含義見下方速查）。`
      : `你的命宮無主星，論命時「借對宮（遷移宮）」的星曜參看，個性較受環境影響。`,
    `命宮在${["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"][c.mingGong]}、身宮在${["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"][c.shenGong]}。命宮看先天、身宮看後天際遇與中晚年。`,
    `五行局為${c.juElement}${["","","二","三","四","五","六"][c.ju]}局，決定大限（每十年）起運的歲數。`,
    "「四化」是紫微的關鍵——把祿（順）、權（強）、科（名）、忌（卡）四股力量灌進不同星曜與宮位：",
    ...huaLines,
  ];
  const glossary = [
    { term: "命宮／身宮", desc: "命宮主先天性格與格局；身宮主後天作為與中晚年走向。" },
    { term: "四化", desc: "祿權科忌，分別代表機會、主導力、名聲、阻礙，是吉凶轉折的關鍵。" },
    { term: "五行局", desc: "水二、木三、金四、土五、火六局，決定大限起運年齡與紫微落點。" },
    ...mingStars.map(s => ({ term: s, desc: ZIWEI_STAR_MEANING[s] })),
  ];
  return { highlights, glossary };
}

export function qimenNotes(c: QimenChart): Notes {
  const pal = c.dayStemPalace;
  const door = c.doors[pal] ?? "—";
  const star = (c.starsP[pal] ?? "—").replace("(禽)", "");
  const god = c.godsP[pal] ?? "—";
  const dir = PALACE_DIR[pal];
  const highlights = [
    `奇門用來「問一件事此刻的態勢」。盤中代表「你自己／求測者」的是「日干」，這一時落在${dir}宮。`,
    `你所在的宮位是：${god}（神）＋ ${star}（星）＋ ${door}（門）。把這三者合起來看，就是你此刻處境的吉凶與性質（含義見下方速查）。`,
    `值符星為 ${c.zhiFuStar}、值使門為 ${c.zhiShiDoor}——值符代表貴人與大方向，值使代表事情如何發動。`,
    c.goodDirs.length ? `相對有利的方位：${c.goodDirs.join("、")}（洽事、出行可優先）。` : "本時辰無特別突出的吉方。",
    c.badDirs.length ? `相對不利、宜避的方位：${c.badDirs.join("、")}。` : "本時辰無明顯需迴避的方位。",
    `時辰空亡為 ${c.kong.join("")}——落空亡之事多半「暫時落空、再等等」，不宜強求。`,
  ];
  const glossary = [
    { term: "日干（用神）", desc: "盤中代表你自己的符號，看它落哪一宮，就是看你此刻的處境。" },
    { term: "值符／值使", desc: "值符＝貴人與整體大勢；值使＝事情發動與進行的方式。" },
    { term: "空亡", desc: "該地支力量落空，所問之事多半時機未到、宜緩。" },
  ];
  if (QIMEN_GOD_MEANING[god]) glossary.push({ term: god + "（神）", desc: QIMEN_GOD_MEANING[god] });
  if (QIMEN_STAR_MEANING[star]) glossary.push({ term: star + "（星）", desc: QIMEN_STAR_MEANING[star] });
  if (QIMEN_DOOR_MEANING[door]) glossary.push({ term: door + "（門）", desc: QIMEN_DOOR_MEANING[door] });
  return { highlights, glossary };
}
