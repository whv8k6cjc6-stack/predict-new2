/** 運勢領域定義。財運與投資為兩個獨立領域，各自計分，不共用分數。 */

export type DomainKey =
  | "overall" | "career" | "wealth" | "investment" | "social"
  | "love" | "travel" | "health" | "decision";

export interface DomainDef {
  key: DomainKey;
  label: string;
  glyph: string;
  scope: string[];      // 此領域涵蓋的內容
  notScope?: string[];  // 明確不屬於此領域的內容（避免混用）
}

export const DOMAINS: DomainDef[] = [
  { key: "overall", label: "整體", glyph: "運", scope: ["當日整體狀態", "各領域加權綜合"] },
  { key: "career", label: "工作", glyph: "業", scope: ["職場事務", "向上溝通", "專案推進", "升遷與考核"] },
  {
    key: "wealth", label: "財運", glyph: "財",
    scope: ["整體金錢狀態", "正財", "偏財", "收入", "支出", "現金流", "財務機會", "資產變化", "金錢相關決策"],
    notScope: ["股票／ETF／基金的進出時機（屬投資）"],
  },
  {
    key: "investment", label: "投資", glyph: "投",
    scope: ["股票／ETF／基金等投資行為", "市場操作", "進場／加碼／減碼的時機", "投資判斷力", "情緒交易風險", "追高殺低風險", "短期風險承受", "是否適合做重大投資決策"],
    notScope: ["收入、收款、一般現金流（屬財運）"],
  },
  { key: "social", label: "人際", glyph: "人", scope: ["同事", "朋友", "合作對象", "長官與部屬互動"] },
  { key: "love", label: "感情", glyph: "情", scope: ["伴侶", "家庭", "桃花"] },
  { key: "travel", label: "出行", glyph: "行", scope: ["旅遊", "出差", "交通", "搬遷"] },
  { key: "health", label: "健康", glyph: "康", scope: ["體力", "情緒", "作息", "生活節奏"] },
  { key: "decision", label: "決策", glyph: "決", scope: ["判斷清晰度", "重大決定的時機"] },
];

export const domainOf = (k: DomainKey) => DOMAINS.find(d => d.key === k)!;
