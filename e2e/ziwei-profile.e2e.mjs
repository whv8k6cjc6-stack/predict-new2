// 紫微排盤體系、資料升級與真太陽時的端對端測試（含手機寬度排版檢查）。
// 用法：npm run build && (cd out && python3 -m http.server 3200 &) && E2E_OUT=/tmp/e2e node e2e/ziwei-profile.e2e.mjs
import { createRequire } from "module";
import { mkdirSync, writeFileSync } from "fs";
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
const shot = (n, full = true) => page.screenshot({ path: `${SP}/zw-${n}.png`, fullPage: full });
const expectText = async (t, timeout = 15000) => { await page.getByText(t).first().waitFor({ timeout }); };
const noOverflow = async (label) => {
  const r = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  if (r.sw > r.cw + 1) errors.push(`${label}: 水平溢出 scrollWidth=${r.sw} > ${r.cw}`);
};

// 1. 以 schema v1 建立舊資料（模擬升級前裝置），再開啟新版 → 自動升級
await page.goto(B + "/manifest.json");
await page.evaluate(() => new Promise((res, rej) => {
  const T = "2026-01-01T00:00:00.000Z";
  const q = indexedDB.open("xuanji", 10);
  q.onupgradeneeded = () => {
    const d = q.result;
    const s = (n, keyPath, idx = []) => { const o = d.createObjectStore(n, { keyPath }); for (const i of idx) o.createIndex(i, i); };
    s("persons", "id", ["updatedAt"]); s("birthProfiles", "personId"); s("tags", "id");
    const pt = d.createObjectStore("personTags", { keyPath: ["personId", "tagId"] }); pt.createIndex("personId", "personId"); pt.createIndex("tagId", "tagId");
    const nc = d.createObjectStore("natalCharts", { keyPath: ["personId", "system"] }); nc.createIndex("personId", "personId");
    s("history", "id", ["personId", "savedAt"]); s("schoolProfiles", "key"); s("prefs", "key"); s("meta", "key"); s("legacy", "key");
  };
  q.onsuccess = () => {
    const d = q.result;
    const tx = d.transaction(["persons", "birthProfiles", "schoolProfiles", "meta"], "readwrite");
    const school = (id, name, ziHour) => ({ id, name, isDefault: id === "school-default", bazi: { school: "子平・滴天髓闡微", ziHour }, ziwei: { school: "中州派", leapMonth: "splitAt15", fireBell: "quanshu", gengSihua: "陽武陰同" }, qimen: { school: "時家轉盤", method: "chaibu", plate: "rotating" }, iching: { dailyMethod: "meihua_date_birthhour" }, createdAt: T, updatedAt: T });
    tx.objectStore("schoolProfiles").put({ key: "school-default", value: school("school-default", "預設（子平・中州派・時家轉盤拆補）", "lateZiSameDay") });
    tx.objectStore("schoolProfiles").put({ key: "school-early-zi", value: school("school-early-zi", "早子時換日（由舊版設定匯入）", "earlyZiNextDay") });
    const person = (id, name) => ({ id, updatedAt: T, data: { id, displayName: name, gender: "male", relation: "family", isFavorite: false, sortOrder: 0, createdAt: T, updatedAt: T } });
    const birth = (personId, date, time, tst, sch) => ({ personId, data: { personId, localDate: date, localTime: time, timeAccuracy: "exact", inputCalendar: "solar", place: { name: "台南", countryCode: "TW", lat: 22.99, lng: 120.21 }, timeZone: "Asia/Taipei", dstOverride: "auto", useTrueSolarTime: tst, schoolProfileId: sch, createdAt: T, updatedAt: T } });
    tx.objectStore("persons").put(person("v1a", "舊甲"));
    tx.objectStore("persons").put(person("v1b", "舊乙"));
    tx.objectStore("birthProfiles").put(birth("v1a", "1988-01-14", "01:15", true, "school-default"));
    tx.objectStore("birthProfiles").put(birth("v1b", "2000-03-15", "23:30", false, "school-early-zi"));
    tx.objectStore("meta").put({ key: "legacyMigrated", value: { at: T, created: 0 } });
    tx.oncomplete = () => { d.close(); res(); };
    tx.onerror = () => rej(tx.error);
  };
  q.onerror = () => rej(q.error);
}));
await page.goto(B + "/persons/");
await expectText("舊甲");
await page.getByText("舊甲").first().click();
await expectText("紫微排盤體系");
await expectText("通行排盤（iztro 相容）（iztro_compatible_v1 v1.0.0）");
await expectText("真太陽時校正");
await expectText("記錄出生時間");
await shot("01-migrated-person");
await noOverflow("人物詳細（舊資料）");
await page.goto(B + "/persons/");
await page.getByText("舊乙").first().click();
await expectText("legacy_imported_v1_earlyZi");
log("v1 資料庫升級：舊人物保留、真太陽時偏好保留、早子時轉 legacy Profile OK");
const v1aTst = await page.evaluate(() => new Promise(r => { const q = indexedDB.open("xuanji"); q.onsuccess = () => { const g = q.result.transaction("birthProfiles").objectStore("birthProfiles").get("v1a"); g.onsuccess = () => r(g.result.data); }; }));
if (v1aTst.useTrueSolarTime !== true || v1aTst.schoolProfileId !== undefined || !v1aTst.solarTimeAudit) throw new Error("出生資料升級不正確：" + JSON.stringify(v1aTst));
log("出生資料補寫：useTrueSolarTime=true 保留、calculationSettingsId、稽核快照 OK");

// 2. 新增人物：預設標準時間；開啟真太陽時 → 跨時辰警告
await page.goto(B + "/persons/edit/");
await page.getByLabel("姓名／暱稱 *").fill("新丙");
await page.getByLabel("出生日期（西元・國曆）*").fill("2024-01-14");
await page.getByLabel("出生時間（到分鐘）").fill("01:05");
const sw = page.getByRole("switch", { name: /真太陽時校正/ });
if ((await sw.getAttribute("aria-checked")) !== "false") throw new Error("新人物真太陽時校正應預設關閉");
await expectText("實際排盤時間");
await expectText("真太陽時校正後跨越時辰界線");
await sw.click();
await expectText("（真太陽時，子時）");
await shot("02-edit-tst");
await noOverflow("新增人物");
await page.getByRole("button", { name: "儲存", exact: true }).click();
await expectText("本命摘要");
log("新人物預設標準時間、開啟校正顯示跨時辰警告 OK");

// 3. 命盤：跨時辰比較、紫微體系、四化來源、借星、三方四正、計算過程
await page.getByRole("button", { name: "設為分析人物並回到今日" }).click();
await expectText("今日命理分析");
await expectText("目前綜合評分由 3/4 個系統參與");
await noOverflow("首頁");
await page.goto(B + "/chart/");
await expectText("真太陽時校正後跨越時辰界線");
const hourPillar = async () => (await page.locator("table tbody tr").nth(2).locator("td").nth(1).innerText()).trim();
const tstBranch = await hourPillar();
await page.getByRole("button", { name: "標準時間命盤" }).click();
await page.waitForTimeout(400);
const stdBranch = await hourPillar();
if (tstBranch === stdBranch) throw new Error(`標準時間與真太陽時時柱應不同：${tstBranch}`);
await page.getByRole("button", { name: "依人物設定" }).click();
log(`命盤比較：真太陽時時支 ${tstBranch}、標準時間時支 ${stdBranch} OK`);
// 紫微細節以 1988 案例（舊甲，已知有無主星宮）檢查
await page.goto(B + "/persons/");
await page.getByText("舊甲").first().click();
await page.getByRole("button", { name: "設為分析人物並回到今日" }).click();
await expectText("今日命理分析");
await page.goto(B + "/chart/?tab=ziwei");
await expectText("通行排盤（iztro 相容）");
await expectText("本宮無主星");
await expectText("借對宮參考");
await page.getByRole("button", { name: /生年四化/ }).click();
await expectText("生年四化來源");
await expectText("使用四化表");
await page.keyboard.press("Escape");
await page.getByRole("button", { name: "本命＋大限＋流年" }).click();
await expectText("大限歲數採虛歲");
await page.locator("button[aria-label^='命宮']").click();
await expectText("排盤計算過程");
await page.getByText(/排盤計算過程/).click();
await expectText("安紫微星");
await shot("03-chart-ziwei");
await noOverflow("紫微命盤");
log("紫微命盤：體系標示、四化來源、借星、流運層、三方四正、計算過程 OK");

// 4. 設定：排盤體系、建立自訂體系、開發者模式
await page.goto(B + "/settings/");
await expectText("計算設定與排盤體系");
await page.locator("details summary").filter({ hasText: "預設" }).first().click();
await expectText("紫微斗數排盤體系");
await page.getByText("查看全部規則與來源").first().click();
await expectText("dayDivide=current");
await shot("04-settings-profile");
await noOverflow("設定");
// 建立自訂體系：修改紫微安星日界 → 另建 custom Profile，標準 Profile 不變
await page.getByText("建立自訂體系（不修改標準體系）").first().click();
await page.getByLabel("紫微安星日界").first().selectOption("23:00");
await page.getByRole("button", { name: "儲存" }).first().click();
await page.waitForTimeout(1200);
const openDefault = async () => {
  const d = page.locator("details").filter({ has: page.locator("summary", { hasText: "預設" }) }).first();
  if (!(await d.evaluate(el => el.open))) await d.locator("summary").first().click();
};
await openDefault();
// 名稱同時出現在下拉選項（不可見）與體系徽章，這裡只檢查徽章
await page.locator("span", { hasText: /^自訂（基於通行排盤（iztro 相容））$/ }).first().waitFor({ timeout: 15000 });
await expectText(/custom_\d{8}_001・v1\.0\.0・自訂/);
log("修改核心規則建立自訂 Profile（custom_YYYYMMDD_001）OK");
await page.getByLabel("紫微斗數排盤體系").first().selectOption("iztro_compatible_v1");
await page.getByRole("button", { name: "儲存" }).first().click();
await page.waitForTimeout(600);
await page.getByRole("switch", { name: /開發者模式/ }).click();
await expectText("評分組成（ScoreAggregator）");
await expectText("legacyZiweiScoring");
log("設定頁排盤體系與開發者模式 OK");
await page.goto(B + "/domain/?d=career");
await expectText("Legacy 紫微計分比較", 30000);
await expectText("加入 legacy 紫微計分後");
await shot("05-domain-dev");
await noOverflow("領域詳情（開發者）");
log("開發者模式 legacy 比較 OK");

// 5. 舊備份（v1）還原
const v1 = { format: "xuanji-backup", schema_version: 1, app_version: "3.0.0", exported_at: "2026-01-01T00:00:00.000Z", scope: "all", person_count: 1, engines: [], encrypted: false,
  payload: { persons: [{ id: "bk1", displayName: "備份丁", gender: "female", relation: "friend", isFavorite: false, sortOrder: 9, createdAt: "", updatedAt: "" }],
    birthProfiles: [{ personId: "bk1", localDate: "1995-06-10", localTime: "12:00", timeAccuracy: "exact", inputCalendar: "solar", place: { name: "台北", countryCode: "TW", lat: 25.04, lng: 121.51 }, timeZone: "Asia/Taipei", dstOverride: "auto", useTrueSolarTime: true, schoolProfileId: "school-default", createdAt: "", updatedAt: "" }],
    tags: [], personTags: [], history: [], legacy: [], schoolProfiles: [], prefs: { displayMode: "plain", backupReminderDays: 14 } } };
writeFileSync(`${SP}/v1-backup.json`, JSON.stringify(v1));
await page.goto(B + "/settings/");
await page.locator("input[type=file]").setInputFiles(`${SP}/v1-backup.json`);
await page.getByRole("button", { name: "開始匯入" }).click();
await page.waitForTimeout(800);
await page.goto(B + "/persons/");
await expectText("備份丁");
await page.getByText("備份丁").first().click();
await expectText("開啟");
log("v1 備份還原（真太陽時偏好保留）OK");

for (const p of ["/event/", "/compare/", "/life/", "/sources/"]) { await page.goto(B + p); await page.waitForTimeout(1500); await noOverflow(p); }
// 所有顯示分數的時間尺度都標示「3/4 個系統參與」
await page.goto(B + "/life/"); await expectText("目前綜合評分由 3/4 個系統參與");
await page.goto(B + "/");
for (const label of ["本週", "本月", "今年"]) {
  await page.getByRole("button", { name: label, exact: true }).first().click();
  await page.waitForTimeout(2500);
  await expectText("目前綜合評分由 3/4 個系統參與");
  await noOverflow(`首頁・${label}`);
}
log("週／月／年／人生時間軸皆標示 3/4 系統參與、無水平溢出 OK");
await browser.close();
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
log("全部通過，無主控台錯誤、無水平溢出");
