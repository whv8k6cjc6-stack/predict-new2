/** Canonical Fixture Suite 的輸入定義（只在產生金樣本時執行一次；產生後輸入與預期結果一起固定保存於 JSON）。
 *  涵蓋：男女、陰陽年、子丑午時、23 點與 0 點附近、春節與立春前後、閏月十四十五十六、五種五行局、十干、十二命宮、真太陽時跨／不跨時辰。 */
import { fromLunar } from "@/core/calendar/precise";
import { computeZiweiNatal } from "@/core/ziwei";
import { toInput, type FixtureInput } from "../../src/tests/golden/snapshot";

export interface FixtureDef { fixtureId: string; covers: string[]; input: FixtureInput; settings: string; note?: string }

const TAINAN = { name: "台南", lat: 22.99, lng: 120.21 };
const TAIPEI = { name: "台北", lat: 25.04, lng: 121.51 };
const pad = (n: number) => String(n).padStart(2, "0");
const std = (localDate: string, localTime: string | null, gender: "male" | "female", extra: Partial<FixtureInput> = {}): FixtureInput =>
  ({ gender, localDate, localTime, timeZone: "Asia/Taipei", place: TAIPEI, useTrueSolarTime: false, ...extra });
const lunarDate = (y: number, m: number, d: number, leap: boolean) => { const s = fromLunar(y, m, d, leap); return `${s.y}-${pad(s.m)}-${pad(s.d)}`; };

export function canonicalFixtures(): FixtureDef[] {
  const F: FixtureDef[] = [];
  const add = (fixtureId: string, covers: string[], input: FixtureInput, settings = "pre-refactor-default", note?: string) => F.push({ fixtureId, covers, input, settings, note });

  // 使用者提供並人工確認的案例（只作為 fixture，不得在正式程式中特別處理）
  add("fixture_19880114_0115_male", ["丑時", "陰年", "男", "陰男逆行", "金四局"], std("1988-01-14", "01:15", "male", { place: TAINAN }), undefined, "使用者確認之命盤：命亥、身丑（福德）、金四局、丁干四化、大限 4–13 逆行");
  add("fixture_19880114_0115_male_tst", ["真太陽時不跨時辰", "丑時"], std("1988-01-14", "01:15", "male", { place: TAINAN, useTrueSolarTime: true }), undefined, "真太陽時約 01:07，仍為丑時");

  // 真太陽時跨時辰（同一出生資料，標準時間與真太陽時各一）
  add("tst_cross_20240114_0105_std", ["真太陽時跨時辰（標準時間對照）", "丑時"], std("2024-01-14", "01:05", "female", { place: TAINAN }));
  add("tst_cross_20240114_0105_tst", ["真太陽時跨時辰", "子時"], std("2024-01-14", "01:05", "female", { place: TAINAN, useTrueSolarTime: true }), undefined, "均時差約 −9 分，校正後落入子時");

  // 時辰
  add("hour_zi_19950610_0030", ["子時"], std("1995-06-10", "00:30", "male"));
  add("hour_wu_19950610_1200", ["午時"], std("1995-06-10", "12:00", "female"));

  // 23 點與 0 點附近
  for (const [t, c] of [["22:59", "亥時"], ["23:00", "23點附近"], ["23:30", "23點附近"], ["23:59", "0點附近"]] as const)
    add(`day_boundary_20000315_${t.replace(":", "")}`, [c, "23點附近"], std("2000-03-15", t, "male"));
  add("day_boundary_20000316_0000", ["0點附近", "子時"], std("2000-03-16", "00:00", "male"));
  add("day_boundary_20000316_0001", ["0點附近", "子時"], std("2000-03-16", "00:01", "male"));
  add("day_boundary_20000315_2330_earlyZi", ["23點附近", "舊版早子時設定"], std("2000-03-15", "23:30", "male"), "pre-refactor-earlyZi", "舊版匯入之「早子時換日」設定");

  // 春節（2024-02-10）與立春（2024-02-04 16:27 台北）前後
  add("spring_festival_before_20240209", ["春節前後"], std("2024-02-09", "12:00", "female"));
  add("spring_festival_after_20240210", ["春節前後"], std("2024-02-10", "12:00", "female"));
  add("lichun_before_20240204_1600", ["立春前後"], std("2024-02-04", "16:00", "male"));
  add("lichun_after_20240204_1700", ["立春前後"], std("2024-02-04", "17:00", "male"));
  add("lichun_after_newyear_before_20240205", ["立春前後", "春節前後"], std("2024-02-05", "12:00", "male"), undefined, "立春後、春節前：八字已換年、紫微尚未換年");

  // 閏月（2023 年閏二月）十四、十五、十六
  for (const d of [14, 15, 16]) add(`leap_2023_leap2_d${d}`, [`閏月十${d - 10 === 4 ? "四" : d - 10 === 5 ? "五" : "六"}`], std(lunarDate(2023, 2, d, true), "10:00", d % 2 ? "male" : "female"));

  // 十個天干（陽男、陰男、陽女、陰女輪替）
  const G: ("male" | "female")[] = ["male", "male", "female", "female", "male", "male", "female", "female", "male", "male"];
  for (let i = 0; i < 10; i++) add(`stem_${1984 + i}_${G[i]}`, [`年干${"甲乙丙丁戊己庚辛壬癸"[i]}`, i % 2 ? "陰年" : "陽年", G[i] === "male" ? "男" : "女"], std(`${1984 + i}-06-15`, "10:00", G[i]));

  // 十二命宮：農曆 2001 年正月初十，依十二時辰
  const d0 = lunarDate(2001, 1, 10, false);
  for (let hb = 0; hb < 12; hb++) add(`life_branch_hb${pad(hb)}`, ["十二命宮"], std(d0, hb === 0 ? "00:30" : `${pad(hb * 2)}:00`, hb % 2 ? "female" : "male"));

  // 五種五行局：自 1990-03-01 10:00 起逐日尋找，取第一個出現者
  const need = new Set(["水二局", "木三局", "金四局", "土五局", "火六局"]);
  for (let k = 0; need.size && k < 400; k++) {
    const t = new Date(Date.UTC(1990, 2, 1 + k));
    const date = t.toISOString().slice(0, 10);
    const inp = std(date, "10:00", "female");
    const ju = computeZiweiNatal(toInput(inp, "pre-refactor-default")).juName;
    if (need.has(ju)) { need.delete(ju); add(`bureau_${ju}_${date.replaceAll("-", "")}`, [ju], inp); }
  }

  // 其他：夏令時間、海外時區、時辰不詳
  add("dst_19750718_0740_tainan", ["夏令時間"], std("1975-07-18", "07:40", "female", { place: TAINAN, useTrueSolarTime: true }));
  add("overseas_london_20000601_0900", ["海外時區"], { gender: "male", localDate: "2000-06-01", localTime: "09:00", timeZone: "Europe/London", place: { name: "London", lat: 51.51, lng: -0.13 }, useTrueSolarTime: false });
  add("unknown_time_19500502", ["時辰不詳"], std("1950-05-02", null, "female"));
  return F;
}

/** 可重現的隨機樣本（固定種子 LCG；產生一次後保存為 JSON，CI 不再重新隨機） */
export const RANDOM_SEED = 20260927;
export function randomFixtures(count: number): FixtureDef[] {
  let seed = RANDOM_SEED;
  const rand = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const out: FixtureDef[] = [];
  for (let i = 0; i < count; i++) {
    const t = new Date(Date.UTC(1930, 0, 1) + Math.floor(rand() * 3.15e12 / 60000) * 60000); // 1930–2029
    const gender = rand() < 0.5 ? "male" : "female";
    const tst = rand() < 0.2;
    const lng = Math.round((119.5 + rand() * 2.5) * 100) / 100;
    const localDate = t.toISOString().slice(0, 10), localTime = `${pad(t.getUTCHours())}:${pad(t.getUTCMinutes())}`;
    out.push({
      fixtureId: `random_v1_${String(i).padStart(4, "0")}`, covers: ["random"], settings: "pre-refactor-default",
      input: { gender, localDate, localTime, timeZone: "Asia/Taipei", place: { name: "隨機", lat: 23.5, lng }, useTrueSolarTime: tst },
    });
  }
  return out;
}
