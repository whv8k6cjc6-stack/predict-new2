# 玄機決策 v3 設計文件（A–H）

> 狀態：**已確認（2026-09-27）。第 1 階段（App 骨架）已實作，見文末「第 1 階段實作紀錄」。**
> 本文件中與「確認後修訂」衝突之處，以文末修訂為準。
> 範圍：專業級東方傳統命理 App（八字・滴天髓・紫微斗數・奇門遁甲・易經），完全離線、不使用任何生成式 AI。
> 「精準」定義：**排盤與規則計算正確、結果可追溯、同樣輸入可重現**。本系統不宣稱為經科學驗證的預測模型，也不輸出任何機率數字。

---

## 0. 現況稽核（v2 → v3 要處理的缺口）

| 項目 | 現況 | v3 處理 |
|---|---|---|
| 多人 | `dd:profiles` 能存陣列，但所有頁面寫死 `getProfiles()[0]`，無切換 UI | 人物資料庫＋首頁人物切換（P0 優先） |
| 儲存 | localStorage（容量小、無交易、無加密） | IndexedDB 正規化資料表＋遷移＋可選加密 |
| 生成式 AI | 仍存在 `src/app/api/ai/route.ts`、設定頁 AI 開關、查詢頁「AI 白話解讀」按鈕 | **全部移除**；白話文 100% 由規則模板產生（v2 每日報告本來就不用 AI） |
| 評分區間 | v2 分支有六級說明，但**尚未合併到 main，線上版看不到** | 重新定義區間＋每區間意義＋行動姿態（見 E-5） |
| 八字 | 缺：害、破、三會、十二長生、格局、通根透干明細、閒神、流月流時完整作用 | Bazi Engine 補齊 |
| 八字錯誤 | `branchRelation` 自刑誤寫為卯巳申亥，正確為**辰午酉亥** | P1 修正並加回歸測試 |
| 紫微 | 缺：天魁天鉞等雜曜、三方四正、大限/流年/流月四化疊宮、宮干飛化 | Ziwei Engine 補齊 |
| 奇門 | 缺：驛馬、依事件取用神、不利時段輸出、流派選項（置閏） | Qimen Engine 補齊 |
| 易經 | 有 64 卦卦辭，**無爻辭**；卦辭與《滴天髓》十干論為開發者依記憶輸入，**未對照版本校勘** | 改由已校勘的公版電子文本匯入，逐條標註版本與校勘狀態 |
| 曆法 | 未處理歷史夏令時間（台灣 1945–1961、1974–1975、1979 年曾實施）與非 UTC+8 出生地時區 | Calendar Engine 以 IANA 時區資料換算 |
| 測試 | 66 項，排盤回歸命例不足 | 建立 ≥ 40 組已知命盤回歸測試 |

---

## A. 系統架構

### A-1 平台決策（建議）

**Next.js PWA（可安裝、可離線）為主體，保留日後以 Capacitor 包成 iOS/Android 原生 App 的路徑。**

| 需求 | PWA 做法 | 原生包裝（Capacitor，後期可選） |
|---|---|---|
| 手機＋電腦同一套 | 同一網址，可「加入主畫面」「安裝」 | App Store / Play 上架 |
| 離線運作 | Service Worker 快取全部程式、字型、知識庫 | 內建 |
| 本機資料庫 | IndexedDB（Dexie 封裝，模擬關聯式資料表） | SQLite（同一 Repository 介面替換） |
| Face ID / Touch ID | WebAuthn 平台驗證器（iPhone Face ID、Mac Touch ID、Windows Hello） | 原生生物辨識 API |
| 加密 | WebCrypto AES-GCM，金鑰由使用者 PIN 以 PBKDF2 派生 | 裝置 Keychain |

理由：你已有 Vercel 網址、手機與電腦都要用；PWA 一套程式即可，且全部計算本來就在前端。
誠實限制：瀏覽器內「加密」只有在啟用 App 鎖（有使用者提供的 PIN/生物辨識）時才有意義；未啟用時資料以瀏覽器沙盒保護、不加密。

### A-2 分層與模組

```
┌──────────────────────────── UI Layer（React，只讀 View Model）────────────────────────────┐
│ 首頁儀表板｜領域詳情｜時間尺度｜事件模式｜日期比較｜人物｜命盤｜知識庫｜設定｜占卜模式      │
└───────────────▲───────────────────────────────────────────────────────▲────────────────┘
                │ AnalysisResult（純資料）                               │ Person / Settings
┌───────────────┴──────────── Application Services ─────────────────────┴───────────────┐
│ DailyService  EventService  CompareService  TimelineService  PersonService  BackupService │
└───────▲───────────────────────────────▲──────────────────────────────▲─────────────────┘
        │                               │                              │
┌───────┴──────── 分析管線（純函式、可測、無 I/O）────────┐   ┌────────┴────────────┐
│ ⑩ Evidence Engine   ← 收集每條命中的規則與事實          │   │ Repository（資料層）│
│ ⑨ Scoring Engine    ← 領域分數、星等                    │   │ IndexedDB / SQLite  │
│ ⑧ Fusion Engine     ← 多術數交叉判讀、分歧偵測          │   │ 加密層（可選）       │
│ ⑦ Interpretation    ← 規則 → 四層文字（模板＋槽位）     │   └─────────────────────┘
│ ⑥ Rule Engine       ← 知識庫規則比對 Facts              │
│ ②–⑤ 各術數引擎       ← 產生 Facts（事實），不下結論      │
│   Bazi｜Ziwei｜Qimen｜IChing（＋擴充：六爻、建除、黃曆、九宮飛星） │
│ ① Calendar Engine   ← 時區、夏令、真太陽時、節氣、干支、農曆  │
└──────────────────────────────────────────────────────────┘
          ▲
┌─────────┴──────── Knowledge Base（本地、隨 App 版本發佈）────────┐
│ 古籍原文（附版本、校勘狀態）｜規則庫 JSON｜術語辭典｜文字模板｜六十四卦（含爻辭）│
└──────────────────────────────────────────────────────────────────┘
```

**關鍵原則**
1. **引擎只產生 Facts，不下吉凶結論。** 例：Bazi Engine 輸出「流日天干甲對日主戊為七殺、七殺屬喜用、流日辰與日支子半合」，不輸出「今天工作好」。
2. **規則庫是唯一的判讀來源。** 每條結論都必須來自一條有 id、有來源的規則；沒有規則命中就不產生該句（杜絕空泛句）。
3. **各術數獨立計算、獨立出結論，最後才進 Fusion。** 不把文字拼接當交叉判讀。
4. **純函式＋決定性。** 同樣的（人物、日期、時間、問題、流派設定、引擎版本）永遠得到相同結果；結果附 `inputHash` 與 `engineVersion`。
5. **UI 與計算完全分離。** 引擎放在 `src/core/**`，不得 import React；UI 只吃 View Model。

### A-3 目錄結構

```
src/core/
  calendar/      時區、夏令、真太陽時、節氣、干支、農曆
  bazi/          四柱、藏干、十神、十二長生、刑沖合害破會、旺衰、格局、喜用忌閒、大運流年流月流日流時
  ziwei/         安星（主輔煞雜）、四化、三方四正、大限、流年流月流日、宮干飛化
  qimen/         時家轉盤（拆補／置閏可選）、九宮八門九星八神、值符值使、空亡、驛馬、格局、用神
  iching/        六十四卦（卦爻辭）、起卦（命盤法／時間法／占卜法）、本互變、體用
  extensions/    十二建除、黃曆、九宮飛星、六爻（介面先定義）
  rules/         規則 DSL、比對器、規則驗證器（lint）
  interpret/     模板渲染、四層輸出、術語綁定
  fusion/        系統訊號、一致度、分歧型態
  scoring/       分數、星等、確定度
  evidence/      證據鏈組裝
  services/      Daily / Event / Compare / Timeline
src/kb/          知識庫（JSON；古籍、規則、模板、辭典、卦爻）
src/data/        Repository、Dexie schema、遷移、加密、備份
src/ui/          元件與頁面（Design System）
tests/fixtures/  已知命盤回歸資料
```

---

## B. 資料庫 Schema

IndexedDB（Dexie）以「資料表」方式設計，欄位與 SQLite 版一一對應，方便日後替換。
所有表都有 `createdAt`、`updatedAt`；刪除人物時以交易（transaction）**連帶刪除**所有關聯資料。

### B-1 資料表

```ts
// ── 人物 ─────────────────────────────
interface Person {
  id: string;                 // uuid
  displayName: string;        // 姓名／暱稱
  fullName?: string;
  gender: "male" | "female";
  relation: "self" | "family" | "friend" | "colleague" | "boss" | "client" | "other";
  relationNote?: string;      // 例：父親、母親
  isFavorite: boolean;
  sortOrder: number;          // 自訂排序
  lastViewedAt?: string;      // 最近使用
  note?: string;
  avatarColor?: string;
}
// index: displayName, relation, isFavorite, lastViewedAt, sortOrder

interface BirthProfile {
  personId: string;           // 1:1
  localDate: string;          // 出生地當地民用日期 YYYY-MM-DD（西元）
  localTime: string | null;   // HH:mm（精確到分）；不知道時為 null
  timeAccuracy: "exact" | "approx15" | "approx60" | "unknown";
  inputCalendar: "solar" | "lunar";     // 使用者輸入時用的曆法（僅作紀錄，一律換算為國曆存）
  lunarInput?: { year: number; month: number; day: number; isLeap: boolean };
  place: { name: string; countryCode: string; lat: number; lng: number };
  timeZone: string;           // IANA，例 "Asia/Taipei"；夏令由 tzdb 自動判斷
  dstOverride?: "auto" | "on" | "off";  // 出生證明與 tzdb 不符時手動覆寫
  useTrueSolarTime: boolean;
  schoolProfileId: string;    // 使用哪組流派設定
}

interface SchoolProfile {       // 流派／排盤規則組合（可多組、可指定給人物）
  id: string; name: string;
  ziHour: "earlyZiNextDay" | "lateZiSameDay";   // 子初換日
  yearBoundary: "lichun";                        // 八字固定立春換年
  monthBoundary: "jieqi";                        // 八字固定節氣換月
  ziweiLeapMonth: "splitAt15" | "asNext" | "asCurrent";
  ziweiFireBell: "quanshu" | "other";
  ziweiSihuaGeng: "陽武陰同" | "陽武同陰" ;      // 庚干四化分歧
  qimenMethod: "chaibu" | "zhirun";              // 拆補／置閏
  qimenPlate: "rotating";                        // 轉盤（飛盤預留）
}

// ── 本命快取（不隨日期改變） ─────────────
interface BaziNatalChart {
  personId: string;
  engineVersion: string;      // 引擎版本變更 → 快取失效重算
  inputHash: string;          // BirthProfile + SchoolProfile 的雜湊
  data: BaziNatal;            // 四柱、藏干、十神、十二長生、五行分數、旺衰明細、格局、喜用忌閒、大運表、關係表
  computedAt: string;
}
interface ZiweiNatalChart {
  personId: string; engineVersion: string; inputHash: string;
  data: ZiweiNatal;           // 十二宮（宮干支、主輔煞雜曜與亮度）、生年四化、命身宮、五行局、大限表、三方四正索引
  computedAt: string;
}

// ── 標籤 ─────────────────────────────
interface Tag { id: string; name: string; color?: string }        // 家人、公司、旅伴、常分析、客戶
interface PersonTag { personId: string; tagId: string }           // 多對多

// ── 偏好與歷史 ───────────────────────
interface UserPreference {
  key: "singleton";
  displayMode: "plain" | "pro";
  activePersonId?: string;
  defaultSchoolProfileId: string;
  appLock: { enabled: boolean; method: "pin" | "webauthn"; autoLockMinutes: number };
  encryption: { enabled: boolean; kdf: "PBKDF2-SHA256"; iterations: number; salt: string };
  backupReminderDays?: number;
}
interface AnalysisHistory {
  id: string; personId: string;
  kind: "daily" | "event" | "compare" | "timeline";
  target: { date: string; time?: string; eventType?: string; dates?: string[] };
  snapshot: AnalysisResult;   // 完整結果（含 engineVersion、inputHash），可重播
  feedback?: { rating: "hit" | "neutral" | "miss"; note?: string; at: string };
  savedAt: string;
}
interface SchemaMeta { key: "meta"; schemaVersion: number; migratedAt: string }
```

### B-2 快取策略
- 本命盤：以 `(personId, engineVersion, inputHash)` 為鍵；三者任一不同即重算並覆寫。
- 流年／流月／流日／流時、奇門盤：**不入庫**，每次依當下日期時間計算（計算成本 < 5 ms），僅在使用者主動「儲存分析」時連同結果寫入 AnalysisHistory。

### B-3 備份與匯入格式

```json
{
  "format": "xuanji-backup",
  "schema_version": 1,
  "app_version": "3.0.0",
  "engine_version": "2026.10.0",
  "exported_at": "2026-09-27T08:00:00+08:00",
  "encrypted": false,
  "persons": [ { "person": {}, "birthProfile": {}, "tags": [] } ],
  "tags": [], "schoolProfiles": [], "preferences": {}, "history": []
}
```
- 加密備份：`encrypted: true`，`payload` 為 AES-GCM 密文，`kdf`/`salt`/`iv` 明列；密碼由使用者輸入，不儲存。
- 匯入：依 `schema_version` 逐版執行遷移函式；本命快取**不匯出**（匯入後依本機引擎重算，確保一致）。
- 舊版 `dd:profiles`（localStorage）於首次啟動自動遷移為 Person＋BirthProfile。

### B-4 隱私
- 預設全部只在本機；程式不含任何分析追蹤、廣告 SDK、外部 API 呼叫（CI 以測試檢查 bundle 內無外部網域 fetch）。
- 刪除人物：同一交易刪除 Person、BirthProfile、兩種命盤快取、PersonTag、AnalysisHistory。
- 雲端同步：不在 v3 範圍；未來若做，預設關閉並逐項列出上傳內容。

---

## C. 命理規則引擎設計

### C-1 Facts（事實）
各術數引擎輸出扁平、具型別的事實，以命名空間區分，例如：

```
bazi.dayMaster = "戊"            bazi.strength.label = "偏強"      bazi.useful = ["木","金","水"]
bazi.flow.day.stemTenGod = "七殺" bazi.flow.day.stemIsUseful = true
bazi.rel[流日支,日支] = "半合"     bazi.rel[流日支,月支] = "害"
bazi.luck.current = "己酉"         bazi.luck.stemIsUseful = false
ziwei.flowDay.lifePalace = "子女"  ziwei.flowDay.sihua.忌 = { star:"太陽", palace:"田宅" }
ziwei.sanfang[官祿] = ["官祿","命宮","財帛","夫妻"]
qimen.hour[巳].yongshen.開門 = { palace:4, door:"開門", star:"天輔", god:"值符", kong:false, patterns:["三奇得門"] }
iching.daily = { main:19, moving:4, mutual:24, changed:54, tiyong:"用生體" }
```

每個 Fact 附 `derivation`（怎麼算出來的），供專業模式與證據鏈顯示。

### C-2 規則 DSL（JSON，存於 `src/kb/rules/*.json`）

```jsonc
{
  "id": "bazi.flowday.qisha.useful.career",
  "system": "bazi",
  "school": "子平通論",
  "timescale": "day",                         // natal | decade | year | month | day | hour
  "when": { "all": [
    { "fact": "bazi.flow.day.stemTenGod", "eq": "七殺" },
    { "fact": "bazi.flow.day.stemIsUseful", "eq": true },
    { "fact": "bazi.strength.score", "gte": 50 }
  ]},
  "effects": [
    { "domain": "career",   "polarity": 1,  "strength": 3 },
    { "domain": "health",   "polarity": -1, "strength": 1 },
    { "domain": "decision", "polarity": 1,  "strength": 2 }
  ],
  "source": {
    "book": "子平真詮", "chapter": "論七殺",
    "quote": null,                            // 未校勘前一律為 null，不得臨時填寫
    "edition": null, "verified": false,
    "principle": "身強殺為我用，主魄力與擔當"
  },
  "text": {
    "conclusion": "今天{流日干}為你的七殺且屬喜用，適合處理有壓力、需要拍板的工作。",
    "plain": "七殺代表壓力與挑戰；因為你的日主{日主}夠強（{旺衰分}分），今天的壓力會轉成推動力。",
    "pro": "流日{流日干支}，天干{流日干}對日主{日主}為七殺，{流日干五行}屬喜用；日主旺衰{旺衰分}（{旺衰}），身強能任殺。",
    "action": ["把需要決斷或需面對長官的事排在今天", "體力消耗較大，晚上不排應酬"]
  },
  "terms": ["七殺", "喜用神", "日主", "旺衰"],
  "priority": 60,
  "excludes": ["bazi.flowday.qisha.unuseful.career"],
  "enabled": true, "version": 1
}
```

- **運算子**：`eq / neq / in / notIn / gte / lte / exists / contains / relation(a,b,type)`，以 `all / any / not` 組合。
- **effects** 只寫方向（-1/0/+1）與強度（1–3），不寫分數；分數由 Scoring Engine 統一換算，避免規則各自亂給分。
- **excludes**：互斥規則（例「殺為喜」與「殺為忌」不能同時成立），比對器保證只取一條。

### C-3 知識庫：古籍與來源

```ts
interface ClassicText {
  id: string;                 // "ditiansui.tiangan.jia"
  book: "滴天髓" | "淵海子平" | "三命通會" | "子平真詮" | "周易" | "紫微斗數全書" | "奇門遁甲統宗" | string;
  chapter: string;
  original: string;           // 原文
  edition: string;            // 例：任鐵樵增注本、通行本（註明來源檔）
  sourceFile: string;         // 匯入的公版電子文本檔名與雜湊
  verified: boolean;          // 是否已逐字校勘
  plain: string;              // 白話
  school?: string;            // 所屬流派
  usage?: string;             // 使用條件（套用到何種盤面）
}
```

**古文規則（硬性）**
1. 古文一律從**公有領域電子文本**（如維基文庫等可追溯版本）匯入並存雜湊，**不得由程式或開發者憑記憶輸入**。
2. `verified=false` 的條目：UI 只顯示「命理原則（白話）」，不以「原文」名義呈現。
3. 找不到出處的原則：標示「通行論法（未見古籍原文）」，不得冠上書名。
4. 現有 v2 的《滴天髓》十干論與 64 卦卦辭，將在 P2 重新校勘；校勘前降為 `verified=false`。

### C-4 Interpretation Engine（規則 → 文字）
- 模板以 `{槽位}` 帶入 Facts（`{日主}`、`{流日干支}`、`{旺衰分}`、`{宮位}`、`{門}`…），渲染時缺值即報錯，不輸出殘句。
- **反空泛機制（lint，CI 強制）**
  1. 每個 `conclusion` 與 `plain` 模板至少含 1 個槽位；純套話模板無法通過測試。
  2. 禁用詞表：「小人」「貴人」僅允許出現在綁定神煞或八神事實的規則中；「保持正向」「努力就會成功」「近期」等整句列為禁止。
  3. 禁止數字機率（`%`、「機率」）出現在任何模板。
- 同一領域多條規則命中時，依 `priority` 與強度排序，只取前 N 條組句，其餘放入證據鏈。

### C-5 Evidence Engine（證據鏈）

```ts
interface Evidence {
  ruleId: string; system: SystemId; timescale: Timescale;
  facts: { key: string; value: unknown; derivation: string }[];   // 可追溯到盤面
  source?: ClassicTextRef;                                         // 有才顯示
  polarity: -1 | 0 | 1; strength: 1 | 2 | 3;
  contribution: number;                                            // 對該領域分數的實際貢獻（Scoring 回填）
  text: { conclusion: string; plain: string; pro: string; action: string[] };
  terms: string[];
}
```
證據鏈顯示順序：系統 → 時間尺度 → 規則 → 事實 → 來源。

---

## D. 交叉判讀（Fusion Engine）

### D-1 各系統的職責（時間尺度分工）

| 系統 | 長期命勢（natal / decade / year） | 短期時機（month / day / hour） | 擅長領域 |
|---|---|---|---|
| 八字＋滴天髓 | 本命格局、喜用、大運、流年 | 流月、流日、流時 | 全部，為主軸 |
| 紫微斗數 | 本命宮位結構、大限、流年四化 | 流月、流日（斗君法）四化疊宮 | 事業、財帛、感情、人際的「領域結構」 |
| 奇門遁甲 | —（不論長期） | 時辰、方位、做這件事的當下態勢 | 事件、擇時、方位 |
| 易經 | —（每日卦只論當日） | 當日卦象、體用 | 當日基調、事件結果 |

### D-2 系統訊號
每個系統對每個領域獨立輸出：

```ts
interface SystemSignal {
  system: SystemId; domain: DomainKey;
  longTerm?: { direction: number; evidenceCount: number };   // -1 ~ +1
  shortTerm: { direction: number; evidenceCount: number };   // -1 ~ +1
  verdict: "偏正面" | "中性" | "偏負面";                       // |direction| < 0.2 視為中性
  coverage: number;                                           // 0~1：此系統對此領域有多少規則可用
}
```
`direction = tanh( Σ(polarity × strength × 時間尺度權重) / 4 )`，只用該系統自己的證據。

### D-3 一致度與分歧型態

1. **訊號一致度（確定度）**：以各系統 verdict 分佈判定，與分數分開顯示。

| 確定度 | 條件 |
|---|---|
| ●●●●● 訊號一致 | 所有有效系統同向，且至少 3 套 |
| ●●●●○ 大部分一致 | 同向 ≥ 75%，無反向 |
| ●●●○○ 訊號混合 | 有中性也有同向，無明顯反向 |
| ●●○○○ 判讀分歧 | 同時存在偏正面與偏負面 |
| ●○○○○ 資料不足 | 有效系統 < 2（例如出生時辰不明，紫微與奇門年命外的時柱推論停用） |

2. **分歧型態**（決定給什麼建議，而不是硬平均）

| 型態 | 判斷條件 | 呈現 |
|---|---|---|
| 長吉短凶 | 長期正、短期（奇門/流日）負 | 「長期方向沒問題，今天這個時間點不適合 → **事情可以做，建議改時間**」，並給替代時段 |
| 長凶短吉 | 長期負、短期正 | 「今天窗口不錯，但整體階段需保守 → **可做小事、不做長期承諾**」 |
| 結構好時機差 | 紫微宮位強、奇門用神弱 | 「這件事你有條件做，但今天的時機不佳 → 選吉時或改日」 |
| 全面一致 | 同向 | 直接給結論 |
| 多空交錯 | 同尺度內正負並存 | 列出正面來源與負面來源，建議「分拆：做 A、暫緩 B」 |

3. **畫面表達（例）**
> 工作｜三套偏正面（八字、紫微、易經）、一套偏負面（奇門：巳時開門落空亡）
> → 訊號大部分一致 ●●●●○；建議把重要會議移到未時（13–15）。

---

## E. 每日運勢評分公式

### E-1 領域
整體、工作／職場、財運、投資、人際、感情、健康與生活、出行、決策（共 9 項），另輸出：行動時機、宜忌、吉時、方位、重要提醒。

### E-2 規則貢獻值
```
c_rule = polarity × strength × W_timescale × W_system(domain)
```
- `W_timescale`（今日視角）：natal 0.6｜decade 0.8｜year 0.9｜month 1.0｜day 1.3｜hour 0.7（時辰只影響「行動時機」與事件模式時提高至 1.3）
- `W_system(domain)`：依 D-1 分工表設定，例如投資：八字 1.0、紫微 1.0、奇門 0.8、易經 0.5；出行：八字 0.8、紫微 0.7、奇門 1.2、易經 0.6。**所有權重集中在 `src/kb/weights.json`，專業模式可查看，並有版本號。**

### E-3 分數
```
raw_d   = Σ c_rule（前景：分析層級本身與更短尺度） + C × tanh( Σ c_rule（背景：更長尺度） / C )
score_d = round( 50 + 50 × tanh( (raw_d − B_d) / K_d ) )   // tanh 永不等於 ±1，實際不會出現 0 或 100
B_d     = 樣本逐日 raw 中位數（規則庫正負條數不對稱的基準校正）
K_d     = (P90 − P50) / atanh(0.6)，使約一成日子 ≥ 80
```
> 實作修訂（第 8 階段）：長期背景上限 C＝當日 1.5／流月 2／流年 1.5／大運 1；B、K 以 12 組固定合成命例校準，**有出生時辰（四套系統）與無出生時辰（紫微不排）分開校準**，避免少一套系統造成系統性偏低。
- 出生時辰不明：時柱相關規則停用（不是打折），確定度自動降級。
- **綜合指數** = 0.75 × 各領域分數加權平均（工作 .2、財運 .12、投資 .1、人際 .12、感情 .1、健康 .14、出行 .07、決策 .15）＋ 0.25 ×「整體」專屬規則分數。（實作修訂：原設計先平均 z 值再以 tanh 放大，會讓一致的小幅負面訊號變成比每個領域都極端的綜合分數，故改為直接在 0–100 尺度上平均。）
- 星等：依 E-5 五段區間換算（1–5 顆）。

### E-4 一個計算範例（工作）
| 規則 | 系統 | 尺度 | 方向×強度 | 權重 | 貢獻 |
|---|---|---|---|---|---|
| 流日七殺為喜用 | 八字 | day | +1×3 | 1.3×1.0 | +3.9 |
| 大運己土為忌 | 八字 | decade | −1×2 | 0.8×1.0 | −1.6 |
| 流日化科入官祿 | 紫微 | day | +1×2 | 1.3×1.0 | +2.6 |
| 巳時開門落空亡 | 奇門 | hour | −1×2 | 0.7×1.0 | −1.4 |
| 體用：用生體 | 易經 | day | +1×1 | 1.3×0.5 | +0.65 |

raw = 4.15，K = 6 → score = 50 + 50×tanh(0.69) ≈ 50 + 50×0.60 = **80（偏有利 ★★★★）**；確定度：八字正、紫微正、易經正、奇門負 → ●●●●○，型態「結構好、時機差」→ 建議改時段。

### E-5 分數區間的意義（已確認，程式定義於 `src/core/score.ts`）

| 分數 | 名稱 | 星等 | 代表什麼 | 行動姿態 |
|---|---|---|---|---|
| 85–100 | 高度一致的有利訊號 | ★★★★★ | 多套系統、多個時間尺度同時指向有利，阻力很少 | 適合推進重要事項；仍依既定計畫與紀律執行 |
| 70–84 | 偏有利 | ★★★★ | 有利因素明顯多於不利因素 | 可以積極進行，把關鍵事項排在較佳時段 |
| 55–69 | 普通／訊號混合 | ★★★ | 有利與不利並存，或各系統看法不一致 | 可以做，先處理已知風險點 |
| 40–54 | 偏弱 | ★★ | 不利因素略多，或支持力道不足 | 以例行事務為主，重大決定多確認或改時間 |
| 0–39 | 明顯不利 | ★ | 多個命理因素同時指向不利 | 不做不可逆的決定；必須做時縮小規模、選較佳時段 |

> 分數代表「命理因素的淨方向與強度」，不是成功機率。任何畫面都不顯示「％」。
> 排盤與規則引擎通過驗證前，一律不產生個人分數；測試介面只能使用明確標示的 DEMO 資料。

## F. App 完整頁面架構

```
啟動 → （若啟用 App 鎖）解鎖 → 首頁
│
├─ 首頁：今日命理儀表板
│   頂部：人物切換（頭像＋姓名 ▾）｜「2026年9月27日｜今日命理分析」｜今天／明天／本週／本月／今年
│   ① 今日綜合指數環 ＋ 確定度 ●●●●○ ＋ 一句話結論
│   ② 九大領域星等列（工作 ★★★★☆ …）→ 點入領域詳情
│   ③ 今日宜／忌（每條可點看依據）
│   ④ 吉時時間軸（12 時辰，標示吉時與應避開時段）
│   ⑤ 方位羅盤（吉方／不利方）
│   ⑥ 重要提醒（僅在有強規則命中時出現，否則不顯示）
│   ⑦ 白話／專業模式切換
│
├─ 領域詳情（工作、財運、投資…）
│   四層：一句話 → 白話 → 專業分析 → 實際建議
│   交叉判讀：各系統 verdict 表（例：3 偏正面 / 1 偏負面）＋ 分歧型態說明
│   查看判斷依據（證據鏈，逐條展開到盤面與原文）
│   本領域的好時段／應避開時段
│
├─ 時間尺度
│   今日｜明日｜本週（7 天×9 領域熱度表）｜本月｜今年（12 流月）
│   人生時間軸：大運（10 年一格）＋ 流年（逐年），切換：工作／財運／變動／出行／人際
│   明確分區標示「長期命勢」與「短期時機」
│
├─ 事件模式「我要做一件事」
│   選類型（工作、投資、面試、換工作、旅行、簽約、買房、買車、談判、告白、搬家、醫療安排、重要會議、其他）
│   → 填日期、時間、地點（可「幫我找時間」）
│   → 結果：適合程度｜主要優勢｜主要風險｜較佳時段｜應避開時段｜具體建議｜證據鏈
│
├─ 日期比較「哪一天比較適合？」
│   選 2–14 天 ＋ 目的 → 天×系統訊號矩陣 → 每天一句「特色」（A 日適合出發、B 日適合談事情…）
│
├─ 人物
│   清單：搜尋（姓名／暱稱）、篩選（關係、標籤）、最愛、最近使用、拖曳排序
│   新增／編輯：出生地搜尋（內建城市經緯度表，離線）、時區自動帶入、夏令提示、流派選擇
│   人物詳細頁：基本資料｜本命摘要（八字、日主、五行強弱、喜用、紫微命宮主星）｜
│              目前運勢（大運、流年、流月、今日）｜常用功能捷徑
│   兩人比較（預留）：依關係類型選不同規則集（上下屬、合作、感情、旅伴）
│
├─ 命盤（專業）
│   八字盤（四柱、藏干、十神、十二長生、神煞、刑沖合害破）｜大運流年表
│   紫微十二宮盤（主輔煞雜、亮度、四化、三方四正高亮）
│   奇門九宮盤（天地盤、門星神、值符值使、空亡、驛馬、格局）
│   易經卦象（本互變、卦爻辭、體用）
│
├─ 知識庫：術語辭典（每詞四部分：專業定義／白話／在我命盤代表什麼／今天為什麼出現）、古籍來源清單
├─ 占卜模式（隨機起卦，全頁明確標示「占卜模式，非命盤演算法」）
└─ 設定：顯示模式｜流派與換日規則｜App 鎖｜加密｜備份／匯出／匯入｜資料精度說明｜引擎版本
```

---

## G. UI Design System

### G-1 風格
高級、專業、東方現代。深色為主、米白文字、墨色層次、金色只作點綴（< 5% 面積）。不用滿版紅金、不用廟宇紋樣。資訊分層：先結論、後細節，專業資料一律點擊展開。

### G-2 色彩 Token

| Token | 深色 | 淺色 | 用途 |
|---|---|---|---|
| `--bg` | `#111012` 墨 | `#F6F2EA` 宣紙 | 背景 |
| `--surface-1` | `#18171A` | `#FFFFFF` | 卡片 |
| `--surface-2` | `#211F23` | `#EFE9DE` | 內嵌區塊 |
| `--line` | `rgba(237,230,214,.08)` | `rgba(17,16,18,.08)` | 分隔線 |
| `--ink-1` | `#EDE6D6` 米白 | `#1A1917` | 主文字 |
| `--ink-2` | `#B7B0A2` | `#4A463F` | 次文字 |
| `--ink-3` | `#7E786D` | `#7E786D` | 輔助 |
| `--accent` | `#C6A15B` 金 | `#9C7A36` | 重點、選取、術語 |
| `--sig-pos` | `#8DB6A4` 青瓷 | `#3F7A63` | 偏正面 |
| `--sig-neu` | `#A39D90` 灰 | `#6B665C` | 中性 |
| `--sig-neg` | `#C98D6E` 赭 | `#9A5B3B` | 偏負面 |
| 五行 | 木 `#7FA88B` 火 `#C9806A` 土 `#C2A36B` 金 `#D9D2C0` 水 `#6F8FB0` | 同色相較深 | 五行圖、盤面 |

- 訊號色**永遠搭配文字**（偏正面／中性／偏負面），不以顏色單獨表意；也不使用 ▲▼（避免與台股漲跌混淆）。
- 所有配色以 dataviz 驗證腳本檢查色盲可辨度與對比，深淺兩模式各自驗證。

### G-3 字體與排版
- 標題：思源宋體（Noto Serif TC）；內文：思源黑體（Noto Sans TC）／系統 PingFang TC；數字 `tabular-nums`。
- **字型子集化後隨 App 打包**，離線可用、不連 Google Fonts。
- 字級：12／14／16／20／28／40；行高 1.6；間距 4 的倍數；卡片圓角 16、內距 16–20。

### G-4 核心元件

| 元件 | 說明 |
|---|---|
| PersonSwitcher | 頂部下拉，最愛與最近使用置頂，可搜尋 |
| IndexRing | 綜合指數圓環（單一數值，不畫第二數列） |
| StarRow | 領域名稱＋★＋分數，點擊進詳情 |
| ConfidenceDots | ●●●●○ 確定度，與星等視覺區隔 |
| FourLayerCard | 一句話／白話／專業／建議，白話模式預設收合專業層 |
| SystemVerdictTable | 系統 × verdict 表，顯示交叉判讀 |
| EvidenceChain | 可展開證據鏈（系統→規則→事實→原文） |
| TermSheet | 術語底部面板：專業定義／白話／在我命盤代表什麼／今天為什麼出現 |
| HourTimeline | 12 時辰時間軸，吉時與避開時段 |
| CompassRose | 八方位羅盤（吉方、不利方） |
| ElementBars | 五行能量橫條（比雷達圖易讀） |
| PalaceGrid | 紫微 4×4 外圈十二宮盤，三方四正高亮 |
| NineGrid | 奇門九宮盤 |
| HexagramGlyph | 卦畫，動爻標示 |
| TrendChart | 人生時間軸／本月趨勢（單一數列＋tooltip） |
| ModeToggle | 白話／專業 |

### G-5 文案規範
- 句子必須含「哪個因素」→「造成什麼」→「怎麼做」。
- 語氣：溫和、具體、不恐嚇；「不利」取代「凶」出現在白話模式，專業模式保留術語。

---

## H. 開發階段與優先順序（已確認）

| 階段 | 內容 | 完成標準 |
|---|---|---|
| **Phase 1｜App 骨架** | PWA、本機多人資料庫（schema version＋migration）、新增／修改／刪除人物、最愛／搜尋／標籤、首頁人物切換、離線、Face ID／Touch ID（WebAuthn PRF）＋PIN、完全移除生成式 AI、加密備份／匯出／匯入／整批還原、命理引擎統一介面、分數 UI 與區間定義、白話／專業模式架構、Design System | ✅ 已完成（見文末紀錄） |
| **Phase 2｜曆法核心** | 國曆／農曆、節氣、干支、時區與夏令、經緯度、真太陽時、換日規則 | ≥ 40 組回歸命例（四柱、節氣時刻、農曆轉換） ✅ 10,000 時刻交叉驗證 |
| **Phase 3｜八字＋滴天髓** | 本命、大運、流年、流月、流日、流時＋規則證據鏈；《滴天髓》原文與任鐵樵《闡微》匯入並分層 | 回歸命例＋每條結論可反查規則與原文 ✅（《滴天髓》原文未匯入，規則只列原則並標示） |
| **Phase 4｜紫微斗數** | 十二宮、主輔煞雜曜、四化、三方四正、大限流年流月流日 | 回歸命例 ✅ 400 組 |
| **Phase 5｜奇門遁甲** | 九宮八門九星八神、值符值使、空亡、驛馬、事件用神、吉時與方位 | 回歸命例 ✅ 1,000 盤 |
| **Phase 6｜易經** | 六十四卦卦爻辭（校勘本）、固定演算法起卦、占卜模式分離 | 同輸入同結果 ✅ |
| **Phase 7｜Fusion Engine** | 多術數交叉分析、衝突型態、確定度 | 分歧案例測試 ✅ |
| **Phase 8｜正式運勢分數** | 工作／財運／投資／人際／感情／出行／健康／決策 | 每個分數可反查：分數→加權項目→規則→命盤因素→來源 ✅ |

## 附：v3 待你確認的決策

1. 平台：PWA 為主、日後可選原生包裝（建議）— 或一開始就做原生 App？
2. 「財運」與「投資」拆成兩個領域（依你的需求清單）— 同意？
3. 開發順序：先做 P0（多人＋離線＋移除 AI），再做 P1 排盤底層 — 同意？
4. 古籍文本：以維基文庫等公有領域電子文本為校勘來源；若你手上有指定版本（例如任鐵樵《滴天髓闡微》某出版社版），請告訴我以哪一版為準。

---

## 第 1 階段實作紀錄（2026-09-27）

### 確認後修訂
1. **財運與投資為兩個獨立領域、各自計分**（`src/core/domains.ts` 明列各自範圍與「不屬於」範圍）。
2. **引擎完成前不產生任何個人分數**：`getDomainScore()` 在引擎未全數 `verified` 前固定回傳 `unavailable`；舊版會產生分數的頁面（每日報告、查詢、量化、紀錄、舊命盤頁）已下架，舊排盤程式移至 `src/legacy/` 僅供後續階段參考。
3. **三層來源**：`SourceEdition`（版本）→ `SourceText`（原文）→ `Commentary`（注解）→ `RuleDefinition`（程式規則）→ 執行期 `RuleMatch`（命盤符合條件）→ `Conclusion`（白話），定義於 `src/core/sources.ts`。每條規則保存 source_id、書名、作者／注者、版本、篇章、原文、白話、適用條件、規則邏輯、流派、校驗狀態、來源網址。
4. **版本欄位**：所有結果帶 `school`、`rule_version`、`source_version`、`engine_version`（`src/core/versioning.ts`）。

### 實作內容
| 項目 | 位置 |
|---|---|
| 引擎統一介面（NatalEngine／TransitEngine／Fact／EngineResult） | `src/core/engine.ts` |
| 引擎登錄與狀態（未驗證不出分） | `src/core/registry.ts` |
| 人物資料模型（Person、BirthProfile、SchoolProfile、Tag、NatalChartCache、AnalysisHistory、Preferences） | `src/core/person.ts` |
| 本機資料庫（IndexedDB／Dexie，版本化 schema） | `src/data/db.ts` |
| 資料存取層（人物 CRUD、連帶刪除、標籤、最愛、排序） | `src/data/repo.ts` |
| App 鎖與加密（AES-256-GCM；PIN→PBKDF2 60 萬次；Passkey→WebAuthn PRF→HKDF） | `src/data/vault.ts`、`src/data/crypto.ts` |
| 備份／還原（schema_version、逐版 migration、加密備份、單人／整批、合併／取代） | `src/data/backup.ts` |
| 舊版 localStorage 資料自動遷移（非破壞性；刪除人物時一併自舊快照移除） | `src/data/legacy.ts` |
| 時區與歷史夏令時間（IANA） | `src/core/calendar/tz.ts` |
| 離線（Service Worker；只快取程式，不碰資料） | `public/sw.js` |
| 靜態輸出（可直接包裝為 Capacitor 原生 App） | `next.config.ts` |
| Design System 元件 | `src/ui/*` |
| 頁面：今日、人物清單、新增／編輯、人物詳細、辭典、設定、DEMO | `src/app/**` |

### 驗證
- 單元測試：資料層 18 項（加密後資料庫無明文、PIN 錯誤擋下、鎖定時拒絕寫入、連帶刪除、加密備份密碼錯誤無法開啟、舊版遷移、刪除後舊快照同步移除）、時區夏令 5 項、分數制度 2 項，以及舊引擎回歸測試。
- 端對端（Chromium，iPhone 尺寸）：舊資料遷移 → 新增人物 → 搜尋／標籤篩選 → 人物切換 → 啟用 App 鎖（確認 IndexedDB 無明文）→ Passkey（虛擬驗證器，含 PRF）解鎖 → PIN 錯誤／正確 → 加密備份匯出 → 清除全部 → 從加密備份還原 → 離線開啟各頁與讀取人物，全程主控台無錯誤。

### 已知限制
- iOS Safari 以一般分頁使用時，長期未使用可能清除網站資料；請「加入主畫面」並定期匯出備份（設定頁與首頁皆有提醒）。
- 生物辨識解密需瀏覽器支援 WebAuthn PRF；不支援時只能用 PIN（不提供只擋畫面、資料仍明文的假保護）。
- 農曆輸入待 Phase 2 曆法引擎完成後開放。


---

## 第 2–8 階段實作紀錄（2026-09-27）

| 階段 | 內容 | 位置 | 驗證 |
|---|---|---|---|
| 2 曆法 | 壽星天文曆精確節氣、農曆互轉（閏月防呆）、四柱（立春／節氣換年月、早晚子時兩派）、時區／歷史夏令、真太陽時 | `src/core/calendar/` | 與 lunar-javascript 交叉驗證 10,000 個隨機時刻四柱全數一致 |
| 3 八字 | 本命（藏干、十神、十二長生、納音、旺衰＝得令＋得地＋得勢、扶抑取用、格局、調候）、大運（整數分鐘起運）、流年月日時；約 300 條規則，含 18 條《滴天髓》天干論要旨 | `src/core/bazi/`、`src/kb/rules/bazi.ts` | 大運與十二長生交叉驗證 800 組 |
| 4 紫微 | 中州派全書起例、亮度表（iztro，MIT）、生年／大限／流年／流月（斗君）／流日四化、三方四正；約 320 條規則 | `src/core/ziwei/`、`src/kb/rules/ziwei.ts` | 與 iztro 交叉驗證 400 組命盤與流運 |
| 5 奇門 | 時家轉盤拆補法（精確節氣定局、符頭定元）、九宮八門九星八神、值符值使、空亡、驛馬、格局、22 種事件用神、逐時辰掃描 | `src/core/qimen/`、`src/kb/rules/qimen.ts` | 與 qimen-dunjia 交叉驗證 1,000 盤；符頭定元逐日驗證一整年 |
| 6 易經 | 《周易》匯入（`scripts/import-zhouyi.mjs`：來源 SHA-256、26 條計數勘誤、於／于異文標記待校）、梅花易數每日卦／時間起卦／報數起卦／隨機占卜（另行標示）、體用、互變、動爻斷辭；斷辭規則引用《繫辭》原文並動態附上當日爻辭原文 | `src/core/iching/`、`src/kb/sources/`、`src/kb/rules/iching.ts` | 觀梅占例、8×8×6 全組合、一年逐日 |
| 7 交叉判讀 | 各系統長期／短期方向、五級確定度、分歧型態（長吉短凶、長凶短吉、結構好時機差、全面一致、多空交錯） | `src/core/analysis/score.ts` | 單元測試 |
| 8 正式分數 | 見 E-3 修訂；權重集中於 `src/kb/weights.ts`，校準結果 `src/kb/calibration.generated.ts`（`npx vitest run --config scripts/vitest.calibrate.config.ts` 重新產生） | `src/core/analysis/`、`scripts/calibrate.test.ts` | 可重現、逐層可追溯、校準樣本外分布測試 |

**畫面**：今日儀表板（綜合指數、確定度、分歧說明、各領域、宜忌、重要提醒、吉時時間軸、方位羅盤、今日卦）、今天／明天／本週熱度表／本月日曆／今年流月、領域詳情（四層解讀、時段、交叉判讀表、證據鏈逐條展開到加權計算、規則、命盤因素、古籍原文）、擇時・事件（14 類、自動挑時辰、幫我找時間）、日期比較（天×系統訊號矩陣、每天特色）、人生時間軸（大運、流年）、命盤（八字盤、紫微十二宮三方四正、奇門九宮、本互變卦與卦爻辭）、占卜模式（隨機／報數，全頁標示、不入分數）、來源與權重頁（古籍版本、勘誤表、規則庫統計、引擎版本、權重與校準）。

**端對端**：`e2e/phase1.e2e.mjs`（資料層、App 鎖、備份）與 `e2e/v3.e2e.mjs`（全部分析頁面）皆通過，主控台無錯誤。

**已知限制**
- 《滴天髓》與任鐵樵《闡微》原文尚未匯入（無可追溯的公有領域數位底本），相關規則只列原則、標示未校驗；取得可追溯版本後可依 `SourceEdition` 流程匯入。
- 《周易》為機器匯入加勘誤，尚未人工逐字校勘；含「於」的段落已標示待校。
- 分數校準樣本為 12 組合成命例；規則權重屬本系統設計，並非古籍原文所定。
