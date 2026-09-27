/** 規格撰寫輔助：把《全書》各星條目常見的句型（「X宮Y地 某某生人 某格」、入命／入限歌訣）轉成 ClauseSpec。
 *  只做格式轉換：條件與結果詞都由撰寫者依原文逐句指定，不自動推論。 */
import type { ZiweiCondition } from "@/core/ziwei/interp/rules";
import type { ContextLayer } from "@/core/ziwei/interp/contexts";
import type { ClauseSpec, OutcomeKey, PendingReason } from "../dsl";
import { ALL, IN, STEM } from "../dsl";
import type { BrightnessSpec } from "../brightness";

export const CODE: Record<string, string> = {
  紫微: "ZIWEI", 天機: "TIANJI", 太陽: "TAIYANG", 武曲: "WUQU", 天同: "TIANTONG", 廉貞: "LIANZHEN", 天府: "TIANFU",
  太陰: "TAIYIN", 貪狼: "TANLANG", 巨門: "JUMEN", 天相: "TIANXIANG", 天梁: "TIANLIANG", 七殺: "QISHA", 破軍: "POJUN",
  文昌: "WENCHANG", 文曲: "WENQU", 左輔: "ZUOFU", 右弼: "YOUBI", 祿存: "LUCUN", 魁鉞: "KUIYUE", 擎羊: "QINGYANG", 陀羅: "TUOLUO",
  火星: "HUOXING", 鈴星: "LINGXING", 火鈴: "HUOLING", 地劫: "DIJIE", 地空: "DIKONG", 劫空: "JIEKONG", 天傷天使: "SHANGSHI", 天馬: "TIANMA",
  化祿: "HUALU", 化權: "HUAQUAN", 化科: "HUAKE", 化忌: "HUAJI", 歲君: "SUIJUN", 斗君: "DOUJUN",
};

/** 「X宮（亮度）某某生人 結果」一行拆成多條：每段 [片段原文, 地支, 天干或 null, 結果詞, 額外條件?] */
export type Part = [quote: string, branches: string, stems: string | null, outs: OutcomeKey[], extra?: ZiweiCondition | null, pending?: PendingReason];
export function branchLine(star: string, leaf: string, tag: string, anchor: string, parts: Part[], section = "一命宮"): ClauseSpec[] {
  return parts.map(([quote, branches, stems, outs, extra, pending], i) => {
    const conds: ZiweiCondition[] = [IN(star, "命宮", { branches })];
    if (stems) conds.push(STEM(stems));
    if (extra) conds.push(extra);
    return {
      id: `GY_${CODE[star]}_${tag}${parts.length > 1 ? `_${i + 1}` : ""}`, leaf, section: `${section}・${star}`, quote, anchor,
      translation: `${star}坐命在${[...branches].join("、")}宮${stems ? `，${[...stems].join("、")}年生人` : ""}${extra ? "（另有附帶條件）" : ""}：古籍評為「${quote.replace(/^.*?(生人|人)/, "")}」。`,
      title: `${star}坐命${[...branches].join("")}${stems ? `・${stems}年生` : ""}`,
      kind: "starInPalace", when: conds.length > 1 ? ALL(...conds) : conds[0], outcomes: outs, confidence: "low", ...(pending ? { pendingReason: pending } : {}),
    } satisfies ClauseSpec;
  });
}

/** 一般條文（歌訣、總論） */
export function clause(id: string, leaf: string, star: string, sub: string, quote: string, translation: string, title: string,
  layer: ContextLayer, when: ZiweiCondition | null, outs: OutcomeKey[], o: Partial<ClauseSpec> = {}): ClauseSpec {
  return {
    id: `GY_${CODE[star] ?? star}_${id}`, leaf, section: `${o.section ?? "一命宮"}・${star}${sub ? `・${sub}` : ""}`, quote, translation, title,
    kind: layer === "natal" ? (o.kind ?? "starInPalace") : "period", layer, when, outcomes: outs, confidence: "low", ...o,
  };
}
/** 只保留在原文層的條文（壽夭、疾病、刑剋、貧賤、性別道德等），不產生判讀 */
export function historical(id: string, leaf: string, star: string, sub: string, quote: string, translation: string, o: Partial<ClauseSpec> = {}): ClauseSpec {
  return { id: `GY_${CODE[star] ?? star}_${id}`, leaf, section: `${o.section ?? "一命宮"}・${star}${sub ? `・${sub}` : ""}`, quote, translation, title: `${star}：${sub || "古代斷語"}（只保留原文）`, kind: "star", when: null, pendingReason: "historicalOnly", ...o };
}
export const bright = (star: string, leaf: string, quote: string, entries: [string, string][], anchor?: string): BrightnessSpec => ({ star, leaf, quote, entries: entries.map(([branches, word]) => ({ branches, word })), ...(anchor ? { anchor } : {}) });
