紫微來源包 v3 - 完整交接版

這包是為 predict-new2 / PR #5 的「紫微判讀引擎」準備。
目標不是假裝把古籍 OCR 成 100% 正確，而是讓開發代理人在完全離線下也能：
- 取得原始掃描 Source of Truth；
- 搜尋全文候選；
- 快速跳到十四主星、十二宮、格局、運限頁；
- 逐條人工核對後建立 verified citations；
- 不會因 OCR 錯字或版本差異誤啟用命理規則。

資料可信度由高到低：
1. source/*.pdf 原始頁面影像
2. 人工逐字核對後的 verified citation（本包未冒充已完成）
3. transcripts/* 人工轉錄初稿
4. ocr/* 機器 OCR 搜尋稿

廣益版 SHA-256:
cec2c444290ac70020a5ae4e20a50c07a0064783e53ff3162f90a299d7831186

集文版 SHA-256:
6b4c5e00b2b7aa840767a8df19ebc51321acd0bcc38b6f142addca884631c4f6

先讀：instructions/給開發代理人_直接執行.txt
