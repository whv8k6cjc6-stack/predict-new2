// 具體行動建議（ActionAdviceEngine）端對端測試：首頁重點、主題切換、一般模式無術語、詳細判斷、追溯、安全說明、擇時建議、手機排版。
// 用法：npm run build && (cd out && python3 -m http.server 3200 &) && E2E_OUT=/tmp/e2e node e2e/advice.e2e.mjs
import { createRequire } from "module";
import { mkdirSync } from "fs";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const SP = process.env.E2E_OUT || "/tmp/xuanji-e2e", B = process.env.E2E_BASE || "http://localhost:3200";
mkdirSync(SP, { recursive: true });
const log = (...a) => console.log("•", ...a);
const errors = [];
const JARGON = ["傷官", "正官", "七殺", "化忌", "化祿", "門迫", "死門", "用生體", "體克用", "伏吟", "反吟", "用神", "忌神", "日主", "年命", "空亡", "羊刃", "動爻", "爻辭", "十神", "劫財", "偏財", "驛馬", "天乙"];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, locale: "zh-TW", timezoneId: "Asia/Taipei" });
const page = await ctx.newPage();
page.on("pageerror", e => errors.push("pageerror: " + e.message));
page.on("console", m => { if (m.type() === "error") errors.push("console: " + m.text()); });
const shot = (n, full = true) => page.screenshot({ path: `${SP}/adv-${n}.png`, fullPage: full });
const expectText = async (t, timeout = 20000) => { await page.getByText(t).first().waitFor({ timeout }); };
const noOverflow = async label => {
  const r = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  if (r.sw > r.cw + 1) errors.push(`${label}: 水平溢出 scrollWidth=${r.sw} > ${r.cw}`);
};
const focusText = () => page.locator("section[aria-label='今天的重點']").first().innerText();
const noJargon = (label, text) => { const hit = JARGON.filter(j => text.includes(j)); if (hit.length) errors.push(`${label}: 一般模式出現命理術語 ${hit.join("、")}`); };

// 建立人物
await page.goto(B + "/persons/edit/");
await page.getByLabel("姓名／暱稱 *").fill("測試甲");
await page.getByLabel("出生日期（西元・國曆）*").fill("1975-07-18");
await page.getByLabel("出生時間（到分鐘）").fill("07:40");
await page.getByLabel("關係", { exact: true }).selectOption("self");
await page.getByLabel("出生地", { exact: true }).selectOption("台南");
await page.getByRole("button", { name: "儲存", exact: true }).click();
await expectText("本命摘要");

// 1. 首頁第一眼：今天最重要的一件事／適合做／最好避免／為什麼
await page.goto(B + "/");
await expectText("今天最重要的一件事", 30000);
await expectText("為什麼");
await expectText("查看詳細判斷");
await expectText("判斷依據：");
const box = await page.locator("section[aria-label='今天的重點']").first().boundingBox();
if (!box || box.y > 700) errors.push(`首頁重點卡片不在第一屏（y=${box?.y}）`);
const general = await focusText();
noJargon("首頁綜合", general);
await shot("01-home");
await noOverflow("首頁");
log("首頁第一眼是具體建議、無命理術語 OK");

// 2. 主題切換：工作、投資、感情、出行建議不同
const texts = {};
for (const t of ["工作", "投資", "感情", "出行"]) {
  await page.getByRole("button", { name: t, exact: true }).first().click();
  await page.waitForTimeout(300);
  texts[t] = await focusText();
  noJargon(`首頁${t}`, texts[t]);
}
const uniq = new Set(Object.values(texts));
if (uniq.size < 4) errors.push(`不同主題的建議內容重複：${uniq.size}/4`);
await shot("02-home-travel");
log("工作／投資／感情／出行建議各不相同 OK");

// 3. 詳細判斷頁：各區塊、完整追溯
await page.getByRole("button", { name: "工作", exact: true }).first().click();
await page.getByText("查看詳細判斷").first().click();
await expectText("如果只能記得一件事", 30000);
await expectText("判斷依據與信心");
await expectText("目前紫微判讀引擎建置中，未納入本次建議。");
await page.getByText("為什麼這樣建議？（完整追溯）").click();
const traceButtons = page.locator("details li button[aria-expanded]");
let traced = false;
for (let i = 0; i < await traceButtons.count() && !traced; i++) {
  await traceButtons.nth(i).click();
  await page.waitForTimeout(200);
  traced = await page.getByText("映射依據").first().isVisible().catch(() => false);
}
if (!traced) errors.push("追溯：找不到任何一條可展開到來源判讀的建議");
await expectText("生活因素");
await expectText("來源判讀");
await shot("03-advice-career");
await noOverflow("詳細判斷");
log("詳細判斷與完整追溯（建議規則 → 生活因素 → 判讀規則 → 命盤資料）OK");

// 4. 缺少專屬規則的主題與安全說明
await page.goto(B + "/advice/?topic=lawsuit");
await expectText("目前此主題尚未建立完整專屬命理判讀規則", 30000);
await expectText("不代表對訴訟結果的任何判斷");
await expectText("判斷依據：一般因素");
await shot("04-advice-lawsuit");
await page.goto(B + "/advice/?topic=investment");
await expectText("命理建議不能取代原本的投資策略、停損與部位管理", 30000);
await page.goto(B + "/advice/?topic=health");
await expectText("不做任何疾病判斷", 30000);
await noOverflow("健康建議");
log("訴訟一般因素標示、投資與健康安全說明 OK");

// 5. 領域頁與擇時事件都使用具體建議
await page.goto(B + "/domain/?d=career");
await expectText("具體建議", 30000);
await expectText("今天最重要的一件事");
await noOverflow("領域詳情");
await page.goto(B + "/event/");
await page.getByRole("button", { name: "簽約", exact: true }).click();
await page.getByRole("button", { name: "分析這一天" }).click();
await expectText("這個時段最重要的一件事", 40000);
noJargon("擇時事件", await focusText());
await shot("05-event-contract");
await noOverflow("擇時事件");
log("領域詳情與擇時事件的具體建議 OK");

// 6. 專業模式：同一份結果，追溯預設展開
await page.goto(B + "/advice/?topic=career");
await expectText("如果只能記得一件事", 30000);
await page.getByRole("radio", { name: "專業" }).first().click();
await page.waitForTimeout(300);
await expectText("建議規則");
await shot("06-advice-pro");
log("專業模式保留完整證據鏈 OK");

await browser.close();
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log("• 全部通過，無主控台錯誤、無水平溢出");
