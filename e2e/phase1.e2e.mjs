// 第 1 階段端對端回歸測試。
// 用法：npm run build && npx http-server out -p 3200 -s &  然後  E2E_OUT=/tmp/e2e node e2e/phase1.e2e.mjs
// 需要 Playwright（可用全域安裝的 playwright，或以 PLAYWRIGHT_MODULE 指定路徑）。
import { createRequire } from "module";
import { mkdirSync } from "fs";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const SP = process.env.E2E_OUT || "/tmp/xuanji-e2e", B = process.env.E2E_BASE || "http://localhost:3200";
mkdirSync(SP, { recursive: true });
const log = (...a) => console.log("•", ...a);
const errors = [];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2, hasTouch: true, locale: "zh-TW", timezoneId: "Asia/Taipei", acceptDownloads: true });
const page = await ctx.newPage();
page.on("pageerror", e => errors.push("pageerror: " + e.message));
page.on("console", m => { if (m.type() === "error") errors.push("console: " + m.text()); });
const shot = n => page.screenshot({ path: `${SP}/p1-${n}.png` });
const unlockIfNeeded = async () => {
  await page.waitForTimeout(600);
  if (await page.getByText("玄機決策已鎖定").count()) {
    await page.getByLabel("PIN 或密碼").fill("246810");
    await page.getByRole("button", { name: "解鎖", exact: true }).click();
    await page.getByText("玄機決策已鎖定").waitFor({ state: "detached" });
  }
};
const expectText = async (t) => { await page.getByText(t).first().waitFor({ timeout: 8000 }); };

// 1. 舊版資料遷移
await page.goto(B + "/manifest.json");
await page.evaluate(() => localStorage.setItem("dd:profiles", JSON.stringify([
  { id: "a", name: "阿山", gender: "male", birthDate: "1975-07-18", birthTime: "07:40", birthTimeAccuracy: "exact", birthPlace: { city: "新營", timezone: "Asia/Taipei", longitude: 120.32, latitude: 23.31 }, useTrueSolarTime: true },
  { id: "b", name: "媽媽", gender: "female", birthDate: "1950-05-02", birthTime: null, birthTimeAccuracy: "unknown", ziRule: "earlyZi" },
])));
await page.goto(B + "/");
await expectText("今日命理分析");
await expectText("阿山");
await page.goto(B + "/persons/");
await page.getByText("阿山").first().click();
await expectText("夏令時間");
log("舊資料遷移 OK（1975-07 顯示夏令時間）");
await page.goto(B + "/");
await expectText("今日命理分析");
await shot("01-home");

// 2. 新增人物
await page.goto(B + "/persons/edit/");
await page.getByLabel("姓名／暱稱 *").fill("陳測試");
await page.getByLabel("出生日期（西元・國曆）*").fill("1988-01-14");
await page.getByLabel("出生時間（到分鐘）").fill("01:15");
await page.getByLabel("關係", { exact: true }).selectOption("boss");
await page.getByLabel("關係說明（選填）").fill("部門主管");
await page.getByLabel("出生地", { exact: true }).selectOption("台南");
await page.getByPlaceholder("新增標籤，例：家人、公司、旅伴").fill("公司");
await page.getByRole("button", { name: "加入" }).click();
await shot("02-edit");
await page.getByRole("button", { name: "儲存", exact: true }).click();
await expectText("設為分析人物並回到今日");
await shot("03-view");
log("新增人物 OK");

// 3. 清單搜尋、最愛、篩選
await page.goto(B + "/persons/");
await expectText("共 3 位");
await page.getByLabel("搜尋人物").fill("主管");
await expectText("陳測試");
if (await page.getByText("媽媽").count()) throw new Error("搜尋未過濾");
await page.getByLabel("搜尋人物").fill("");
await page.getByRole("button", { name: "加入最愛" }).last().click();
await page.getByRole("button", { name: "# 公司" }).click();
await shot("04-list");
log("搜尋／標籤篩選 OK");

// 4. 首頁切換人物
await page.goto(B + "/");
await page.getByRole("button", { name: /目前分析人物/ }).click();
await page.getByRole("dialog").getByText("陳測試").click();
await page.getByRole("button", { name: /目前分析人物：陳測試/ }).waitFor();
await shot("05-home-switched");
log("人物切換 OK");

// 5. App 鎖 + 虛擬生物辨識
const cdp = await ctx.newCDPSession(page);
await cdp.send("WebAuthn.enable");
const { authenticatorId } = await cdp.send("WebAuthn.addVirtualAuthenticator", { options: { protocol: "ctap2", transport: "internal", hasResidentKey: true, hasUserVerification: true, isUserVerified: true, hasPrf: true, automaticPresenceSimulation: true } });
await page.goto(B + "/settings/");
await page.getByRole("button", { name: "設定 PIN 並啟用" }).click();
await page.getByLabel("新 PIN").fill("246810");
await page.getByLabel("再輸入一次").fill("246810");
await page.getByRole("button", { name: "確定" }).click();
await expectText("App 鎖已啟用");
const rawDump = await page.evaluate(() => new Promise(r => { const q = indexedDB.open("xuanji"); q.onsuccess = () => { const tx = q.result.transaction("persons"); const g = tx.objectStore("persons").getAll(); g.onsuccess = () => r(JSON.stringify(g.result)); }; }));
if (rawDump.includes("陳測試")) throw new Error("啟用後仍有明文");
log("App 鎖啟用、IndexedDB 內無明文 OK");
await page.getByRole("button", { name: "啟用", exact: true }).click();
await page.getByLabel("目前 PIN").fill("246810");
await page.getByRole("button", { name: "確定" }).click();
await expectText("已啟用生物辨識解鎖");
log("Passkey（PRF）註冊 OK");
const signCount = async () => (await cdp.send("WebAuthn.getCredentials", { authenticatorId })).credentials[0].signCount;
const before = await signCount();
await page.getByRole("button", { name: "立即鎖定" }).click();
await page.waitForTimeout(1500);
await expectText("安全與隱私"); // 鎖定畫面自動以 Passkey 解鎖，回到原頁
if (!((await signCount()) > before)) throw new Error("未經生物辨識解鎖");
await shot("06-after-passkey-unlock");
log("鎖定 → Face ID（虛擬驗證器）自動解鎖 OK");
await page.reload();
await expectText("安全與隱私"); // 重新整理後以 Passkey 自動解鎖
await page.goto(B + "/settings/");
await page.getByRole("button", { name: "停用生物辨識" }).click();
await page.getByRole("button", { name: "立即鎖定" }).click();
await expectText("玄機決策已鎖定");
await page.getByLabel("PIN 或密碼").fill("111111");
await page.getByRole("button", { name: "解鎖", exact: true }).click();
await expectText("PIN 不正確");
await page.getByLabel("PIN 或密碼").fill("246810");
await page.getByRole("button", { name: "解鎖", exact: true }).click();
await expectText("設定");
log("PIN 錯誤擋下、正確解鎖 OK");

// 6. 加密備份 → 清除 → 還原
await page.goto(B + "/settings/");
await unlockIfNeeded();
await page.getByRole("button", { name: "匯出全部" }).click();
await page.getByLabel("備份密碼（至少 8 字元）").fill("backup-pass-1");
await page.getByLabel("再輸入一次").fill("backup-pass-1");
const [dl] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: "匯出備份檔" }).click()]);
const file = `${SP}/${dl.suggestedFilename()}`;
await dl.saveAs(file);
const fs = await import("fs");
const txt = fs.readFileSync(file, "utf8");
if (txt.includes("陳測試") || !txt.includes('"schema_version": 2')) throw new Error("備份檔內容不符");
log("加密備份匯出 OK：", dl.suggestedFilename());
await page.keyboard.press("Escape");
await page.getByRole("button", { name: "清除此裝置上的所有資料" }).click();
await page.getByRole("button", { name: "全部清除" }).click();
await expectText("先建立第一位人物");
await page.goto(B + "/settings/");
await page.locator('input[type=file]').setInputFiles(file);
await page.getByLabel("備份密碼").fill("backup-pass-1");
await page.getByRole("button", { name: "解開備份" }).click();
await expectText("陳測試");
await page.getByRole("button", { name: /取代/ }).click();
await page.getByRole("button", { name: "開始匯入" }).click();
await expectText("已取代還原 3 位人物");
log("清除後從加密備份還原 OK");

// 7. 離線
await page.goto(B + "/");
await page.evaluate(() => navigator.serviceWorker.ready);
await page.waitForTimeout(2500);
await ctx.setOffline(true);
for (const r of ["/", "/persons/", "/glossary/", "/settings/", "/demo/"]) {
  await page.goto(B + r);
  await page.locator("main").first().waitFor({ timeout: 8000 });
}
await page.goto(B + "/persons/");
await expectText("陳測試");
await page.getByText("陳測試").click();
await expectText("本命摘要");
await shot("07-offline-view");
log("離線瀏覽與人物資料 OK");
await ctx.setOffline(false);

await page.goto(B + "/demo/");
await expectText("DEMO 測試資料");
await shot("08-demo");
await page.getByRole("button", { name: "化忌" }).click();
await shot("09-term");
await page.goto(B + "/glossary/");
await shot("10-glossary");
await page.goto(B + "/settings/");
await shot("11-settings");

console.log(errors.length ? "ERRORS:\n" + errors.join("\n") : "no console errors");
await browser.close();
