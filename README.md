# 玄機決策 Xuanji（v3）

專業級東方傳統命理 App：八字（滴天髓）、紫微斗數、奇門遁甲、易經多術數獨立計算、交叉判讀，並以白話與專業兩種模式呈現可追溯的判斷依據與實際建議。

**核心原則**
1. 不使用任何生成式 AI、LLM 或外部 AI API；所有結果由傳統命理公式、明確規則、本地知識庫與文字模板產生。
2. 完全離線可用；人物與出生資料預設只存在本機，不需帳號、不自動上傳。
3. 「精準」＝排盤與規則計算正確、結果可追溯、同樣輸入可重現；不包裝成科學預測。
4. 每個分數都能反查：分數 → 加權項目 → 命理規則 → 命盤因素 → 古籍原文；分數代表命理因素的淨方向與強度，不是成功機率。

完整設計：`docs/V3_DESIGN.md`（系統架構、資料庫 Schema、規則引擎、交叉判讀、評分公式、頁面架構、Design System、開發階段）。

## 目前進度
| 階段 | 內容 | 狀態 |
|---|---|---|
| 1 | App 骨架：PWA、本機多人資料庫、離線、人物切換、App 鎖（PIN／Face ID）、加密備份、Design System | ✅ |
| 2 | 曆法核心（精確節氣、農曆、時區夏令、真太陽時） | ✅ |
| 3 | 八字＋《滴天髓》要旨規則 | ✅（原文待匯入） |
| 4 | 紫微斗數（通行排盤・iztro 相容；判讀引擎重建中，暫不計分） | ✅ |
| 5 | 奇門遁甲（時家轉盤拆補法） | ✅ |
| 6 | 易經（《周易》原文＋勘誤、梅花易數） | ✅ |
| 7–8 | 交叉判讀、正式運勢分數 | ✅ |

各階段驗證方式與已知限制見 `docs/V3_DESIGN.md` 文末紀錄。

## 開發
```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # 靜態輸出至 out/
npx vitest run       # 單元測試
npm run import:zhouyi   # 重新匯入《周易》（含勘誤檢查）
npx vitest run --config scripts/vitest.calibrate.config.ts   # 重新校準分數常數
npx vitest run --config scripts/fuzz/vitest.config.ts        # 紫微 Fuzz 測試（不作為回歸依據）
# E2E：npm run build 後以 out/ 起靜態伺服器（port 3200），再執行 node e2e/*.e2e.mjs
```

紫微斗數排盤規則與重構紀錄見 `docs/ZIWEI_REFACTOR_PLAN.md`。

## 部署與安裝
- 靜態輸出，可直接部署到 Vercel（沿用現有專案，合併到 main 即自動更新）。
- iPhone／iPad：Safari 開啟網址 →「分享」→「加入主畫面」。
- Android：Chrome →「安裝應用程式」。Mac／Windows：Chrome／Edge 網址列的「安裝」圖示。
- 日後可用 Capacitor 將 `out/` 包裝為 App Store／Google Play 原生 App。

## 資料安全
- IndexedDB 本機資料庫，含 schema version 與 migration；App 更新不影響資料。
- 啟用 App 鎖後以 AES-256-GCM 加密；PIN 以 PBKDF2（60 萬次）派生金鑰；支援 WebAuthn PRF 的裝置可用 Face ID／Touch ID 解鎖。
- 備份檔含 `schema_version`，可加密；請定期匯出，換機或瀏覽器資料被清除時才能還原。
