# 玄機決策 Xuanji（v3・第 1 階段）

專業級東方傳統命理 App：八字（滴天髓）、紫微斗數、奇門遁甲、易經多術數獨立計算、交叉判讀，並以白話與專業兩種模式呈現可追溯的判斷依據與實際建議。

**核心原則**
1. 不使用任何生成式 AI、LLM 或外部 AI API；所有結果由傳統命理公式、明確規則、本地知識庫與文字模板產生。
2. 完全離線可用；人物與出生資料預設只存在本機，不需帳號、不自動上傳。
3. 「精準」＝排盤與規則計算正確、結果可追溯、同樣輸入可重現；不包裝成科學預測。
4. 排盤與規則引擎通過驗證前，不產生任何個人分數。

完整設計：`docs/V3_DESIGN.md`（系統架構、資料庫 Schema、規則引擎、交叉判讀、評分公式、頁面架構、Design System、開發階段）。

## 目前進度
| 階段 | 內容 | 狀態 |
|---|---|---|
| 1 | App 骨架：PWA、本機多人資料庫、離線、人物切換、App 鎖（PIN／Face ID）、加密備份、Design System | ✅ 完成 |
| 2 | 曆法核心 | 下一步 |
| 3–8 | 八字＋滴天髓、紫微、奇門、易經、交叉判讀、正式分數 | 規劃中 |

## 開發
```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # 靜態輸出至 out/
npx vitest run       # 單元測試
```

## 部署與安裝
- 靜態輸出，可直接部署到 Vercel（沿用現有專案，合併到 main 即自動更新）。
- iPhone／iPad：Safari 開啟網址 →「分享」→「加入主畫面」。
- Android：Chrome →「安裝應用程式」。Mac／Windows：Chrome／Edge 網址列的「安裝」圖示。
- 日後可用 Capacitor 將 `out/` 包裝為 App Store／Google Play 原生 App。

## 資料安全
- IndexedDB 本機資料庫，含 schema version 與 migration；App 更新不影響資料。
- 啟用 App 鎖後以 AES-256-GCM 加密；PIN 以 PBKDF2（60 萬次）派生金鑰；支援 WebAuthn PRF 的裝置可用 Face ID／Touch ID 解鎖。
- 備份檔含 `schema_version`，可加密；請定期匯出，換機或瀏覽器資料被清除時才能還原。
