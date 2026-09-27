// v3 分析頁面端對端測試：建立人物 → 今日儀表板 → 領域詳情 → 事件 → 比較 → 時間軸 → 命盤 → 占卜 → 來源。
// 用法：npm run build && (cd out && python3 -m http.server 3200 &) && E2E_OUT=/tmp/e2e node e2e/v3.e2e.mjs
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
const shot = (n, full = true) => page.screenshot({ path: `${SP}/v3-${n}.png`, fullPage: full });
const expectText = async (t, timeout = 15000) => { await page.getByText(t).first().waitFor({ timeout }); };

await page.goto(B + "/persons/edit/");
await page.getByLabel("姓名／暱稱 *").fill("阿山");
await page.getByLabel("出生日期（西元・國曆）*").fill("1975-07-18");
await page.getByLabel("出生時間（到分鐘）").fill("07:40");
await page.getByLabel("關係", { exact: true }).selectOption("self");
await page.getByLabel("出生地", { exact: true }).selectOption("台南");
await page.getByRole("button", { name: "儲存", exact: true }).click();
await expectText("本命摘要");
await expectText("八字四柱");
await shot("01-person-view");
log("人物詳細頁本命摘要 OK");

await page.goto(B + "/");
await expectText("今日命理分析");
await expectText("各領域");
await expectText("今日宜忌");
await expectText("吉時時間軸");
await expectText("今日卦");
await shot("02-home");
log("今日儀表板 OK");

for (const s of ["本週", "本月", "今年"]) {
  await page.getByRole("button", { name: s, exact: true }).click();
  await expectText(s === "本週" ? "各領域本週最佳日" : s === "本月" ? "月日曆" : "個流月", 30000);
  await shot(`03-scale-${s}`);
}
log("時間尺度 OK");

await page.goto(B + "/domain/?d=investment");
await expectText("判斷依據（證據鏈）");
await page.locator("ol li button[aria-expanded]").first().click();
await expectText("命理原則");
await shot("04-domain");
log("領域詳情與證據鏈 OK");

await page.goto(B + "/event/");
await page.getByRole("button", { name: "面試", exact: true }).click();
await page.getByRole("button", { name: "分析這一天" }).click();
await expectText("主要優勢", 30000);
await shot("05-event");
await page.getByRole("button", { name: "幫我找時間" }).click();
await expectText("較適合「面試」的時段", 60000);
await page.locator("main ul li button").first().waitFor();
await shot("06-find");
log("事件與找時間 OK");

await page.goto(B + "/compare/");
await expectText("每一天的特色", 30000);
await shot("07-compare");
await page.goto(B + "/life/");
await expectText("流年", 30000);
await shot("08-life");
log("日期比較、人生時間軸 OK");

for (const t of ["八字", "紫微", "奇門", "易經"]) {
  await page.goto(B + "/chart/");
  await page.getByRole("button", { name: t, exact: true }).click();
  await page.waitForTimeout(500);
  await shot(`09-chart-${t}`);
}
log("命盤 OK");

await page.goto(B + "/divination/");
await page.getByRole("button", { name: "隨機起卦" }).click();
await expectText("斷辭");
await shot("10-divination");
await page.goto(B + "/sources/");
await expectText("《周易》勘誤表");
await shot("11-sources");
log("占卜、來源 OK");

await page.setViewportSize({ width: 1280, height: 900 });
await page.goto(B + "/");
await expectText("今日宜忌");
await shot("12-desktop", false);

await browser.close();
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
log("全部通過，無主控台錯誤");
