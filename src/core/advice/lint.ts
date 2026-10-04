/** 建議文字品質檢查（Actionability／白話／不宿命／安全規則）。所有模板與實際輸出都要通過。 */
import type { SafetyCategory } from "@/kb/advice/topics";

/** 一般模式不可出現的命理術語 */
export const JARGON = [
  "十神", "傷官", "正官", "七殺", "偏官", "食神", "比肩", "劫財", "偏財", "正財", "正印", "偏印", "梟神",
  "化忌", "化祿", "化權", "化科", "四化", "門迫", "死門", "生門", "開門", "休門", "傷門", "杜門", "景門", "驚門",
  "值符", "值使", "用神", "喜神", "忌神", "仇神", "日主", "年命", "空亡", "伏吟", "反吟",
  "體用", "用生體", "體克用", "用克體", "體生用", "比和", "動爻", "爻辭", "本卦", "變卦", "互卦",
  "羊刃", "桃花", "驛馬", "華蓋", "天乙", "貴人", "文昌", "祿神", "流年", "流月", "流日", "大運", "大限",
  "天干", "地支", "五行", "納音", "命宮", "身宮", "廟旺", "落陷", "三方四正", "格局", "調候", "滴天髓", "干支", "吉時", "大吉", "大凶",
];
/** 單獨出現時沒有實際用途的空泛說法：出現時後面必須接具體行為 */
export const VAGUE = ["宜守不宜攻", "順其自然", "謹言慎行", "把握機會", "注意小人", "注意財務", "注意健康", "多溝通", "凡事小心", "保持正能量", "注意", "小心", "把握", "謹慎", "順勢", "保守", "積極", "溝通"];
/** 具體行動的線索（動作動詞、時間、數量、條件） */
const CONCRETE = [
  "先", "再", "把", "排", "寫", "列", "確認", "問", "約", "整理", "安排", "預留", "檢查", "記", "設定", "聯繫", "準備", "延後",
  "分批", "拆", "停", "休息", "睡", "固定", "挑", "請", "直接", "私下", "留下", "改", "等", "算", "比較", "複習", "談", "說明",
  "通知", "試", "執行", "處理", "推進", "追", "看", "放", "開始", "指定", "婉拒", "回覆", "送出", "投遞", "預約", "聊",
  "寄", "檢視", "爭取", "累積", "說出", "留", "照", "養成", "保持", "更新", "表態", "分配", "調整", "問候", "設", "核對", "查證", "找", "查", "念", "讀", "建立", "填", "加上", "加總", "比對", "分成", "就醫", "收手", "做完", "只用", "對一次",
];
/** 宿命、誇大或製造恐懼的說法 */
export const FATALISTIC = ["一定會", "必然", "必定", "注定", "你會遇到", "肯定會", "保證", "絕對會", "逃不過", "在劫難逃"];
export const FEAR = ["血光", "災", "厄運", "劫難", "橫禍", "倒楣", "破財", "小人"];
const SAFETY: Record<SafetyCategory, (string | RegExp)[]> = {
  health: ["診斷", "罹患", "癌", "腫瘤", "病變", "停藥", "不用吃藥", "不必吃藥", "不必就醫", "不用看醫生", "不需就醫", "藥物", /會(生|得)[^，。；]{0,4}病/],
  investment: ["買進", "賣出", "必漲", "必跌", "會漲", "會跌", "看漲", "看跌", "全部投入", "全押", /all[ -]?in/i, "取消停損", "不用停損", "不設停損", /\d+\s*倍/, /\d+\s*%/, /\d+\s*成資金/],
  legal: ["勝訴", "敗訴", "贏官司", "輸官司", "會贏", "會輸"],
};
const ALL_SAFETY = [...SAFETY.health, ...SAFETY.investment, ...SAFETY.legal];

const has = (s: string, p: string | RegExp) => typeof p === "string" ? s.includes(p) : p.test(s);

/** kind＝do：必須能回答「做什麼／怎麼做／何時做」；kind＝avoid：必須描述一個具體要避免的行為 */
export function lintAdviceText(text: string, opts: { kind?: "do" | "avoid" | "note"; allowSystemNames?: boolean } = {}): string[] {
  const errs: string[] = [];
  const bare = text.replace(/[{}「」『』（）()，。；：、！？\s]/g, "");
  for (const j of JARGON) if (text.includes(j)) errs.push(`含命理術語「${j}」`);
  for (const f of FATALISTIC) if (text.includes(f)) errs.push(`宿命或誇大的說法「${f}」`);
  for (const f of FEAR) if (text.includes(f)) errs.push(`製造恐懼的說法「${f}」`);
  for (const p of ALL_SAFETY) if (has(text, p)) errs.push(`違反安全規則「${String(p)}」`);
  const vague = VAGUE.filter(v => text.includes(v));
  const concrete = CONCRETE.filter(c => text.includes(c));
  if (VAGUE.includes(bare) || (vague.length && bare.length <= 8)) errs.push(`空泛建議「${text}」`);
  if (opts.kind === "do" && !concrete.length) errs.push(`缺少具體行動（做什麼、怎麼做、何時做）：「${text}」`);
  if (vague.length && !concrete.length) errs.push(`「${vague[0]}」後面沒有接具體行為`);
  return errs;
}
