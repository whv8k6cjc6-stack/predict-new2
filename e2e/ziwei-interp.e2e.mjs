// 紫微判讀層端對端測試：命盤頁紫微判讀面板、判讀語境、來源與規則頁、手機排版、主控台錯誤。
// 用法：npm run build && (cd out && python3 -m http.server 3200 &) && E2E_OUT=/tmp/e2e node e2e/ziwei-interp.e2e.mjs
import { createRequire } from "module";
import { mkdirSync } from "fs";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const SP = process.env.E2E_OUT || "/tmp/xuanji-e2e", B = process.env.E2E_BASE || "http://localhost:3200";
mkdirSync(SP, { recursive: true });
const log = (...a) => console.log("•", ...a);
const errors = [];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, locale: "zh-TW", timezoneId: "Asia/Taipei" });
const page = await ctx.newPage();
page.on("pageerror", e => errors.push("pageerror: " + e.message));
page.on("console", m => { if (m.type() === "error") errors.push("console: " + m.text()); });
const shot = n => page.screenshot({ path: `${SP}/zi-${n}.png`, fullPage: true });
const expectText = async (t, timeout = 20000) => { await page.getByText(t).first().waitFor({ timeout }); };
const noOverflow = async label => {
  const r = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  if (r.sw > r.cw + 1) errors.push(`${label}: 水平溢出 scrollWidth=${r.sw} > ${r.cw}`);
};

await page.goto(B + "/persons/edit/");
await page.getByLabel("姓名／暱稱 *").fill("紫測");
await page.getByLabel("出生日期（西元・國曆）*").fill("1988-01-14");
await page.getByLabel("出生時間（到分鐘）").fill("01:15");
await page.getByLabel("關係", { exact: true }).selectOption("self");
await page.getByLabel("出生地", { exact: true }).selectOption("台南");
await page.getByRole("button", { name: "儲存", exact: true }).click();
await expectText("本命摘要");

// 1. 命盤頁紫微判讀面板：建置中狀態、客觀判讀語境
await page.goto(B + "/chart/?tab=ziwei");
await expectText("紫微判讀引擎建置中", 30000);
await expectText("不影響今日建議");
await page.getByText("判讀語境（客觀資料）").click();
await expectText("命宮三方四正（照會星不等於坐守星）");
await expectText("本宮坐守");
await expectText("對宮照會");
await expectText("空宮（借對宮只作參考，不設權重）");
await expectText("運限三層");
await shot("01-chart-panel");
await noOverflow("命盤頁紫微判讀");
log("命盤頁紫微判讀面板與判讀語境 OK");

// 2. 來源與規則頁
await page.getByText("查看紫微來源與規則狀態").click();
await expectText("紫微來源與規則", 20000);
await expectText("Tier 1");
await expectText("原文尚未匯入");
await expectText("主題覆蓋矩陣");
await expectText("ZW_STAR_JUMEN_NATURE");
await expectText("不可作為：古籍來源");
await shot("02-sources-ziwei");
await noOverflow("紫微來源頁");
log("紫微來源、覆蓋矩陣與規則狀態 OK");

// 3. 來源總頁有連結；建議頁仍顯示紫微建置中
await page.goto(B + "/sources/");
await expectText("紫微來源與判讀規則", 20000);
await page.goto(B + "/advice/?topic=career");
await expectText("目前紫微判讀引擎建置中，未納入本次建議。", 30000);
await noOverflow("建議頁");
log("來源總頁連結、建議頁紫微 pending 說明 OK");

await browser.close();
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log("• 全部通過，無主控台錯誤、無水平溢出");
