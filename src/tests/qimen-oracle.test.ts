/** 奇門交叉驗證（對照組：qimen-dunjia 3.1.0，僅測試使用）。
 *  註：對照組之「拆補」以交節後天數平分三元，與傳統「符頭定元」之拆補法不同；
 *  故本測試將本系統定出的四柱與局數交給對照組排盤，專門驗證排盤演算法（地盤、天盤、八門、九星、八神、值符、值使），
 *  並另以精確節氣時刻驗證節氣判定。 */
import { it, expect } from "vitest";
import { computeQimenChart } from "@/core/qimen";
// @ts-expect-error 對照組為 ESM 無型別
import { generateQimenChart, generateChartByDatetime, chartToObject } from "qimen-dunjia";

const ORDER = [4, 9, 2, 3, 5, 7, 8, 1, 6];
let seed = 3;
const rand = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
const pad = (n: number) => String(n).padStart(2, "0");

it("1000 個隨機時刻：排盤各層完全一致、節氣判定一致", () => {
  const cnt: Record<string, number> = {}; const ex: Record<string, string> = {};
  const bad = (k: string, m: string) => { cnt[k] = (cnt[k] ?? 0) + 1; ex[k] ??= m; };
  for (let i = 0; i < 1000; i++) {
    const t = new Date(Date.UTC(1950, 0, 1) + Math.floor(rand() * 2.9e12 / 3600000) * 3600000);
    const [y, m, d, h] = [t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate(), t.getUTCHours()];
    const ours = computeQimenChart(`${y}-${pad(m)}-${pad(d)}`, `${pad(h)}:00`, "Etc/GMT-8", "classic");
    const tag = `${y}-${m}-${d} ${h}:00`;
    const auto = chartToObject(generateChartByDatetime(`${y}${pad(m)}${pad(d)}${pad(h)}`));
    if (auto["節氣"] !== ours.term) bad("term", `${tag} ${ours.term} vs ${auto["節氣"]}`);
    if (auto["時柱"] !== ours.pillars.hour || auto["日柱"] !== ours.pillars.day) bad("pillar", tag);
    const o = chartToObject(generateQimenChart({ 年柱: ours.pillars.year, 月柱: ours.pillars.month, 日柱: ours.pillars.day, 時柱: ours.pillars.hour, 局數: ours.ju, 陰陽: ours.yang ? "陽" : "陰" }));
    ORDER.forEach((pal, k) => {
      if (o["地盤"][k] !== ours.ground[pal]) bad("ground", `${tag} ${pal}`);
      if (pal === 5) return;
      if (o["天盤"][k] !== ours.sky[pal][0]) bad("sky", `${tag} ${pal} ${ours.sky[pal]} vs ${o["天盤"][k]}`);
      if (o["天門"][k] !== ours.doors[pal]) bad("door", `${tag} ${pal} ${ours.doors[pal]} vs ${o["天門"][k]}`);
      if (o["九星"][k] !== ours.stars[pal]) bad("star", `${tag} ${pal} ${ours.stars[pal]} vs ${o["九星"][k]}`);
      if (o["八神"][k].replace("騰", "螣") !== ours.gods[pal]) bad("god", `${tag} ${pal} ${ours.gods[pal]} vs ${o["八神"][k]}`);
    });
    if (o["值符"] !== ours.zhiFu) bad("zhifu", `${tag} ${ours.zhiFu} vs ${o["值符"]}`);
    if (o["值使"] !== ours.zhiShi) bad("zhishi", `${tag} ${ours.zhiShi} vs ${o["值使"]}`);
  }
  if (Object.keys(cnt).length) console.log(cnt, ex);
  expect(cnt).toEqual({});
});
