# 紫微來源包 v4 - 校訂與結構化

本包目的：提供 PR #5 / 紫微 Interpretation Engine 的「來源校對層」資料，不直接取代程式規則。

## Source of Truth

1. `source/紫微斗數全書-廣益版.pdf`：primary classical source。
2. `source/紫微斗數全集-集文版.pdf`：secondary source，只做平行段落定位；因掃描品質較低，不強行做逐字異文。
3. 本包所有 TXT / MD / JSON 均低於原始 PDF 影像。若有衝突，以 PDF 為準。

## 驗證等級

- `structureVerified`：頁面結構、章首、卷次可清楚目視確認。
- `visualTranscribed`：已依影像人工辨讀，但尚未做第二個獨立人工學術校勘。
- `visualDoubleChecked`：同一來源影像已做第二次獨立目視複核，且無疑字。
- `humanReviewed`：保留給日後真正的第二位人工校勘者；本包不宣稱。
- `secondarySourceVerified`：有第二版本逐字核對；目前多數為 false。
- `searchOnly`：OCR 或人工導航，只供定位，不得作 originalText。

## v4 最重要修正

舊 v3 導航有三個結構性錯誤，已由原始掃描重新確認：

- PDF p26（版心 24）右頁右上明確可見：`一命宮`。
- PDF p36（版心 34）左下明確可見：`卷之二終`。
- PDF p37（版心 35）中縫明確可見：`紫微斗數全書 卷之三`，並開 `二兄弟`；同頁左半可見 `三妻妾`。

因此，不再使用「廣益版未見一命宮章首」的舊說法。

## 使用原則

- OCR 只可搜尋，不得直接入庫為 verified originalText。
- `LifeFactor` 必須由 InterpretationRule 產生，不得由單一星曜直接產生。
- 古文的夭壽、疾病、貧賤、性別角色等可保留在 classical layer，但不得直接轉為現代宿命斷語。
- 紫微仍不進 0-100 Scoring，直到另行完成 scoring 階段。
