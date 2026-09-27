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

// 1. 命盤頁紫微判讀面板：部分啟用、本盤判讀（命宮天府）、客觀判讀語境
await page.goto(B + "/chart/?tab=ziwei");
await expectText("紫微判讀部分啟用", 30000);
await expectText("命宮有天府");
await expectText("生活因素：擅長經營資源");
await page.getByText("判讀語境（客觀資料）").click();
await expectText("命宮三方四正（照會星不等於坐守星）");
await expectText("本宮坐守");
await expectText("對宮照會");
await expectText("空宮（借對宮只作參考，不設權重）");
await expectText("運限三層");
await shot("01-chart-panel");
await noOverflow("命盤頁紫微判讀");
log("命盤頁紫微判讀（天府坐命）與判讀語境 OK");

// 2. 來源與規則頁：點巨門 → 出處、原文、翻譯、判讀鏈、生活因素、規則
await page.getByText("查看紫微來源與規則狀態").click();
await expectText("紫微來源與規則", 20000);
await expectText("Tier 1");
await expectText("主題覆蓋矩陣");
await expectText("原文與判讀追溯");
await page.getByRole("button", { name: "巨門", exact: true }).click();
const detail = page.getByTestId("citation-detail");
await detail.getByText("卷二・一命宮・巨門").waitFor({ timeout: 10000 });
await detail.getByText("PDF 第 30 頁（版心 28）", { exact: false }).first().waitFor();
await detail.getByText("原文層（專業）").first().click();
await detail.getByText("巨門水北斗化暗主是非入廟身長肥胖", { exact: false }).first().waitFor();
await detail.getByText("白話翻譯：巨門屬水", { exact: false }).first().waitFor();
await detail.getByText("盤面成立條件：巨門在本命命宮坐守", { exact: false }).first().waitFor();
await detail.getByText("ZW_STAR_JUMEN_NATURE").first().waitFor();
await detail.getByText("communication", { exact: false }).count().then(c => { if (c) errors.push("生活因素顯示了內部代號"); });
await detail.getByText("容易誤會（依據「化暗主是非……多是多非」）：未啟用", { exact: false }).first().waitFor();
await shot("02-sources-jumen");
await page.getByRole("button", { name: "官祿", exact: true }).click();
await detail.getByText("卷三・九官祿・官祿").waitFor({ timeout: 10000 });
await page.getByRole("button", { name: "太歲（流年）", exact: true }).click();
await detail.getByText("論二限太歲吉凶", { exact: false }).first().waitFor({ timeout: 10000 });
await detail.getByText("判讀原則：規範本命 → 大限 → 流年的分層", { exact: false }).first().waitFor();
await expectText("不可作為：古籍來源");
await shot("03-sources-period");
await noOverflow("紫微來源頁");
log("紫微來源、引用瀏覽（巨門／官祿／太歲）、判讀鏈 OK");

// 3. 來源總頁有連結；建議頁：財運納入紫微、投資不納入
await page.goto(B + "/sources/");
await expectText("紫微來源與判讀規則", 20000);
await page.goto(B + "/advice/?topic=wealth");
await expectText("紫微判讀部分啟用：只用於綜合、工作、財運、不動產", 30000);
await page.goto(B + "/advice/?topic=investment");
await expectText("紫微判讀尚未涵蓋「投資」，本主題不納入", 30000);
await noOverflow("建議頁");
log("來源總頁連結、建議頁紫微部分參與（財運納入、投資不納入）OK");

await browser.close();
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log("• 全部通過，無主控台錯誤、無水平溢出");
