import type { CategoryKey } from "@/types/daily";

export type Band = "high" | "mid" | "low";
export const bandOf = (s: number): Band => (s >= 70 ? "high" : s >= 45 ? "mid" : "low");

export const CATEGORY_META: Record<CategoryKey, { label: string; glyph: string; focus: string }> = {
  overall: { label: "綜合運", glyph: "運", focus: "整體狀態" },
  career: { label: "工作事業", glyph: "業", focus: "公務、會議、簽核、向上溝通" },
  wealth: { label: "財運投資", glyph: "財", focus: "收支、理財、投資紀律" },
  love: { label: "感情家庭", glyph: "情", focus: "伴侶、家人、桃花" },
  health: { label: "健康身心", glyph: "康", focus: "體力、情緒、作息" },
  social: { label: "人際貴人", glyph: "人", focus: "同事、朋友、貴人相助" },
  travel: { label: "出行旅遊", glyph: "行", focus: "交通、出差、旅遊" },
  study: { label: "學習文書", glyph: "學", focus: "進修、考試、公文寫作" },
};

export const BAND_OPENING: Record<CategoryKey, Record<Band, string>> = {
  overall: { high: "今天整體順風，適合把重要的事往前推", mid: "今天大致平穩，照節奏做事就好", low: "今天逆風較多，先守住基本盤" },
  career: { high: "工作推進順利、容易被看見", mid: "工作按部就班，無大起落", low: "工作易卡關或溝通不順" },
  wealth: { high: "財務判斷清晰、收支順暢", mid: "財務平穩，照紀律執行即可", low: "財務易有耗損或衝動" },
  love: { high: "感情與家庭氣氛融洽", mid: "感情平淡中見安穩", low: "感情易有誤會或冷淡" },
  health: { high: "精神體力都在水準之上", mid: "身心狀態普通，注意作息", low: "體力與情緒較易透支" },
  social: { high: "人緣佳、容易遇到貴人", mid: "人際互動平順", low: "人際易起摩擦或被誤解" },
  travel: { high: "出行順暢、適合移動與旅遊", mid: "出行一般，照計畫即可", low: "出行易有延誤或波折" },
  study: { high: "思路清晰，讀書寫作效率高", mid: "學習文書表現平穩", low: "注意力易分散、文書易出錯" },
};

export const BAND_ADVICE: Record<CategoryKey, Record<Band, { dos: string[]; donts: string[] }>> = {
  overall: {
    high: { dos: ["把本週最重要的一件事排在今天處理", "主動提出想法或爭取資源"], donts: ["因順利而過度承諾"] },
    mid: { dos: ["先處理例行與待辦清單", "預留緩衝時間給突發事項"], donts: ["臨時改變既定計畫"] },
    low: { dos: ["降低行程密度，只做必要的事", "重要事項多一道確認"], donts: ["做不可逆的重大決定", "情緒化回應"] },
  },
  career: {
    high: { dos: ["向上簡報、提案或爭取支持", "推動卡關已久的案子", "主持會議、做決策"], donts: ["獨斷而忽略同仁意見"] },
    mid: { dos: ["處理公文、簽核與例行業務", "整理進度、更新待辦"], donts: ["在會議上臨時丟出未成熟的方案"] },
    low: { dos: ["公文與數字多核對一次", "先聽再說，把爭議留到書面處理"], donts: ["與長官或同仁正面衝突", "口頭承諾期限"] },
  },
  wealth: {
    high: { dos: ["檢視資產配置、整理帳務", "執行既定的定期定額或策略訊號"], donts: ["因手氣好而放大部位或槓桿"] },
    mid: { dos: ["照計畫與紀律執行", "記帳、檢查固定支出"], donts: ["聽消息臨時進出"] },
    low: { dos: ["只執行系統訊號，不手動干預", "延後非必要的大額消費"], donts: ["借貸、作保、合資", "追高殺低或報復性交易"] },
  },
  love: {
    high: { dos: ["安排約會或家庭聚餐", "把感謝說出口"], donts: ["只顧工作冷落家人"] },
    mid: { dos: ["多關心家人近況", "一起做件輕鬆的小事"], donts: ["翻舊帳"] },
    low: { dos: ["說話放軟、多傾聽", "有情緒先緩一緩再溝通"], donts: ["在氣頭上做感情決定", "冷戰"] },
  },
  health: {
    high: { dos: ["安排運動或戶外走走", "處理需要體力的事"], donts: ["仗著精神好而熬夜"] },
    mid: { dos: ["規律三餐、多喝水", "午後短暫休息"], donts: ["久坐不動"] },
    low: { dos: ["早點休息、減少應酬", "注意保暖與腸胃"], donts: ["劇烈運動或逞強", "飲酒過量"] },
  },
  social: {
    high: { dos: ["主動聯繫貴人或前輩請益", "參加聚會、拓展人脈"], donts: ["錯過別人伸出的手"] },
    mid: { dos: ["維持良好互動、準時回覆訊息"], donts: ["背後議論他人"] },
    low: { dos: ["低調行事、對事不對人", "重要溝通用書面留紀錄"], donts: ["借錢給人或替人背書", "捲入是非"] },
  },
  travel: {
    high: { dos: ["適合出差、旅遊或拜訪客戶", "嘗試新路線、新景點"], donts: ["行程排太滿"] },
    mid: { dos: ["提前確認車次與天氣", "預留轉乘時間"], donts: ["臨時更改行程"] },
    low: { dos: ["能不出遠門就不出", "開車放慢、搭乘大眾運輸較安心"], donts: ["趕時間搶快", "夜間長途移動"] },
  },
  study: {
    high: { dos: ["撰寫報告、公文或重要簡報", "安排考試、進修、讀書"], donts: ["只看不寫、不輸出"] },
    mid: { dos: ["複習整理筆記", "處理例行文書"], donts: ["一次開太多主題"] },
    low: { dos: ["文件交出前逐條校對", "重要文書請人複核"], donts: ["簽署未讀完的文件"] },
  },
};
