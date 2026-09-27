# 系統架構 ARCHITECTURE

## 1. 總覽（資料流）

```
┌─────────────────────────────────────────────────────────────┐
│  iPhone 15 Pro Max  Safari / PWA（加入主畫面）                │
│  Next.js 前端（React + Tailwind + shadcn/ui）                 │
│                                                              │
│  使用者輸入（命盤 / 查詢日期 / 主題）                          │
│        │                                                     │
│        ▼                                                     │
│  ① 曆法引擎 engines/calendar    國農曆、干支、節氣、真太陽時    │
│        ▼                                                     │
│  ② 排盤引擎 engines/{bazi,ziwei,qimen}                       │
│        ▼                                                     │
│  ③ 規則引擎 engines/rule-engine  比對 data/rules/*.json       │
│        ▼                                                     │
│  ④ 評分引擎 engines/scoring     加權 → 0–100 八維分數          │
│        ▼                                                     │
│  ⑤ 結構化 JSON（FortuneResult）                               │
│        ├──（離線/未啟用 AI）→ 本機模板解釋 lib/templates        │
│        └──（啟用 AI）→ /api/ai 伺服器代理 ──► Anthropic/OpenAI │
│        ▼                                                     │
│  ⑥ 畫面呈現 + 寫入 History（IndexedDB）                       │
└─────────────────────────────────────────────────────────────┘
         ▲                                  ▲
   GitHub push 自動觸發              Vercel 環境變數存 API Key
   Vercel Production / Preview 部署   （Key 永不進前端、不進 repo）
```

關鍵原則：**AI 不排盤、不算命**。AI 只拿到引擎算好的結構化 JSON，職責限於白話轉譯與策略措辭。排盤與評分 100% 由確定性程式完成，結果可重現、可稽核。

## 2. 技術選型

| 層 | 選擇 | 理由 |
|---|---|---|
| Framework | Next.js 15 App Router + TypeScript | Vercel 原生支援、API Route 當 AI 代理 |
| UI | Tailwind CSS v4 + shadcn/ui | 手機優先快速開發 |
| 表單/驗證 | React Hook Form + Zod | 生辰輸入防呆；Zod 同時驗證 AI 回傳 JSON |
| 日期 | dayjs (+ timezone/utc plugin) | 體積小，時區換算 |
| 儲存 | localStorage（設定）+ IndexedDB（命盤/歷史，用 idb 包裝） | 第一版免後端 |
| PWA | manifest.json + service worker（next-pwa 或手寫） | 加入主畫面、離線排盤 |
| AI | /api/ai route 代理 Anthropic / OpenAI / Google | Key 在伺服器端 |
| 測試 | Vitest | 引擎單元測試（萬年曆對照表） |

第二版可選：Supabase（Postgres + Auth）做雲端同步與加密備份。

## 3. 資料夾職責

```
src/
├── app/            頁面與 API route（薄，只做組裝）
│   └── api/ai      AI 代理：收 FortuneResult JSON → 組 prompt → 呼叫 LLM → Zod 驗證回傳
├── components/     純 UI 元件（無業務邏輯）
├── features/       各頁面的業務邏輯 hooks + 容器元件
├── engines/        ★ 核心。純函式、零依賴 UI、可單測
│   ├── calendar/   儒略日、干支、節氣表、農曆轉換、真太陽時
│   ├── bazi/       四柱、藏干、十神、五行統計、強弱、喜忌、大運流年
│   ├── ziwei/      安星、十二宮、四化、大限
│   ├── qimen/      起局（拆補法定版）、九宮、格局判斷
│   ├── rule-engine/ 通用條件比對器：吃 rules JSON，輸出 TriggeredRule[]
│   └── scoring/    權重合成 0–100，含時辰不確定降權邏輯
├── ai/             PromptBuilder、輸出 Schema、模板 fallback
├── data/rules/     規則 JSON（人工整理，附出處）
├── lib/storage/    IndexedDB / localStorage 封裝、匯出入（含加密）
└── types/          全域型別
```

## 4. 設計決策與理由

1. **引擎全放前端**：排盤無需伺服器，離線可用、零成本、無個資外傳。只有 AI 解釋走伺服器代理。
2. **規則外置 JSON**：命理規則會持續修訂，改 JSON 不動程式；每條規則有 `id`、`sourceReference`、`weight`、`needsVerification`，History 回饋統計可指出哪些規則長期不準。
3. **流派定版**：奇門用「時家奇門＋拆補法」、紫微用「中州派安星為基準」、八字強弱用「得令得地得勢計分法」。流派分歧處寫進 `docs/RULE_ENGINE.md` 的定版決議表，避免引擎實作時來回搖擺。
4. **信心等級傳遞**：時辰 unknown → 八字時柱與紫微命宮規則降權 50%，結果標 `confidenceLevel: low`，AI prompt 同步收到此旗標以調整措辭。
5. **投資模式硬限制寫在程式而非 prompt**：禁止詞（買進/賣出/保證/必）在 API route 做輸出過濾，AI 失控時 fallback 模板。

## 5. 安全

- `.env.local` 與 Vercel Environment Variables 存 Key；`.gitignore` 排除。
- `/api/ai` 加簡單 rate limit 與來源檢查（自用即可）。
- 匯出 JSON 可選 AES-GCM 口令加密（Web Crypto API）。
- repo 設 Private。
