# 紫微 v4 雙重核讀流程（工具存檔）

這些腳本原本在工作暫存區執行，存檔於此以便日後重跑或續做。需要本地 PDF（不放入 git）。

1. `colsplit2.py`：把每個半頁切成欄組影像。
2. 兩輪獨立轉錄（A、B）：依 `INSTRUCTIONS.md`、`GUTTER.md`（書縫）、`CUTLINES.md`（切邊直行）、`EXTRA.md`（複核）。原始轉錄在 `src/data/classics/ziwei/quanshu-guangyi/passes/`。
3. `merge.py`、`supmerge.py`：A／B 逐字比對，產生差異清單。
4. `rescrop2.py`、`rescrop3*.py`、`zooms2.py`、`zooms3.py`：差異處裁切影像，依 `ARBITER.md` 回影像決議。
5. `applyarb.py`：決議結果（`decisions/`）轉成穩定鍵。
6. `build_pages.py`：輸出 `pages.json`；決議不了的字保留〔疑字〕。
   - 選用第二來源佐證（`second_source.py`）：設定 `ZIWEI_ETEXT=<電子全文 TXT>` 再執行。兩輪讀法不一或存疑、未能回影像決議的差異，若左右各 2 字已與電子本逐字對上、且電子本該段與其中一輪讀法逐字相同（採用的讀法須有字），就採那一輪的讀法並標〔校：X〕；逐處紀錄寫入 `passes/second_source.json`（含電子本檔案 SHA-256）。電子本不放入 git。
   - 2026-10-04 使用 MutekiShura/illucius-classics `Ziwei/紫微斗数全书.txt`（維基文庫系繁體全文）：佐證 91 處差異、106 字。
7. `pg.py`：查看某半頁文字。

未完成：第二來源佐證後仍有約 380 處疑字（多為兩輪都讀不出的整串墨污或切邊）；主文與補轉錄的交叉比對只做了 8 處。後續不再做 OCR 辨識。
