# 部署教學 DEPLOYMENT（GitHub + Vercel）

## 1. 前置

- Node.js 20+、Git、GitHub 帳號、Vercel 帳號（用 GitHub 登入最省事）。

## 2. 本機啟動

```bash
npm install
cp .env.example .env.local   # 填入你的 API Key（可先留空，AI 功能才需要）
npm run dev                  # http://localhost:3000
```

## 3. 推上 GitHub（建議私有 repo）

GitHub 網頁 → New repository → 名稱 `destiny-decision-app` → **Private** → 不要勾選任何初始化檔案 → Create。然後：

```bash
git init
git add .
git commit -m "Phase 1: PRD + Next.js scaffold"
git branch -M main
git remote add origin git@github.com:<你的帳號>/destiny-decision-app.git
git push -u origin main
```

> 確認 `git status` 看不到 `.env.local`。Key 一旦推上 GitHub 視同外洩，需立刻作廢重發。

## 4. 匯入 Vercel

1. vercel.com → 以 GitHub 登入。
2. Add New… → Project → Import Git Repository → 選 `destiny-decision-app`（私有 repo 需授權 Vercel GitHub App 存取）。
3. Framework Preset 會自動偵測為 **Next.js**，Build 設定不用改。
4. 按 **Deploy**，完成後得到 `https://<專案名>.vercel.app`。

## 5. 環境變數（Environment Variables）

Vercel → 專案 → Settings → Environment Variables，逐筆新增：

| Key | 環境 | 說明 |
|---|---|---|
| `ANTHROPIC_API_KEY` | Production + Preview | Claude API |
| `OPENAI_API_KEY` | 同上 | 選用 |
| `GOOGLE_AI_API_KEY` | 同上 | 選用 |
| `NEXT_PUBLIC_APP_NAME` | All | 顯示名稱 |

修改環境變數後需 **Redeploy** 才生效（Deployments → 最新一筆 → ⋯ → Redeploy）。
規則：沒有 `NEXT_PUBLIC_` 前綴的變數只存在伺服器端，前端拿不到——API Key 一律**不可**加 `NEXT_PUBLIC_`。

## 6. 自動部署流程

- push 到 `main` → 自動建置 → **Production** 部署。
- push 其他分支或開 Pull Request → 自動產生 **Preview** 網址（每個 commit 一個），適合先在手機上試新功能再合併。
- 部署失敗會收到 email，可在 Deployments → Build Logs 查原因。

## 7. iPhone 安裝為 PWA

1. iPhone Safari 開啟你的 vercel.app 網址。
2. 分享按鈕 → 加入主畫面。
3. 之後從主畫面開啟即為全螢幕 App 體驗；`public/manifest.json` 已設定名稱、icon、`display: standalone`、深色主題色。

## 8. 自訂網域（選用）

Vercel → Settings → Domains → 輸入網域 → 依指示到 DNS 商加 CNAME（`cname.vercel-dns.com`）或 A 記錄，等待驗證即完成，自動含 HTTPS。

## 9. 常見問題

| 問題 | 處理 |
|---|---|
| Build 失敗 type error | 本機先跑 `npm run build` 重現修正 |
| AI 回 500 | 檢查環境變數是否設在正確環境並已 Redeploy |
| PWA icon 沒更新 | iPhone 刪除主畫面捷徑重新加入 |
| 換手機資料不見 | 第一版資料在瀏覽器本機，先在 Settings 匯出 JSON 再到新機匯入 |
