/** 待校驗登錄：來源包 v3 的人工轉錄初稿（humanDraft）、機器 OCR（searchOnly）、格局候選與尚未逐字核對的篇章。
 *  這些條目只記錄「在哪裡、目前狀態、為什麼還不能用」，一律 pendingVerification／visualVerified=false，
 *  不會被匯入原文、不能被 verified 規則引用、不產生生活因素、不參與計分。 */
import type { PalaceName } from "@/core/ziwei/common";

export type PendingKind = "humanDraft" | "ocrSearchOnly" | "patternCandidate" | "locatorOnly" | "classicalContextOnly";
export interface PendingEntry {
  pendingId: string;
  kind: PendingKind;
  sourceId: string;
  pdfPage: number | null;
  printedPage: number | null;
  section: string;
  status: "pendingVerification";
  visualVerified: false;
  /** 為什麼還不能啟用 */
  reason: string;
  /** 若之後啟用，只能用在哪一層（例：古籍原文層、判讀原則） */
  allowedAfterVerification?: string;
  relatedPalace?: PalaceName;
}

const GY = "ziwei-doushu-quanshu-guangyi-scan";
const JW = "ziwei-doushu-quanji-jiwen-scan";
const P = (e: Omit<PendingEntry, "status" | "visualVerified">): PendingEntry => ({ ...e, status: "pendingVerification", visualVerified: false });

const STAR_PAGES: [string, number][] = [["紫微", 26], ["天機", 26], ["太陽", 27], ["武曲", 27], ["天同", 27], ["廉貞", 28], ["天府", 28], ["太陰", 29], ["貪狼", 29], ["巨門", 30], ["天相", 30], ["天梁", 31], ["七殺", 31], ["破軍", 31]];

export const ZIWEI_PENDING: PendingEntry[] = [
  ...STAR_PAGES.map(([s, p]) => P({
    pendingId: `PEND_GY_${s}_JUE`, kind: "humanDraft", sourceId: GY, pdfPage: p, printedPage: p - 2, section: `一命宮・${s}入男命／入女命／入限吉凶訣`,
    reason: "各星總論之後的三個吉凶訣小節（含歌訣）尚未逐字核對；入限訣的「限」指大限或小限也需先確認。",
    allowedAfterVerification: "星曜入命、入限的條件式判讀規則",
  })),
  P({ pendingId: "PEND_GY_FUMU_FIRST", kind: "locatorOnly", sourceId: GY, pdfPage: 44, printedPage: 42, section: "十二父母・首句", relatedPalace: "父母",
    reason: "篇名已校驗；首句位於裝訂處、墨點多，無法逐字確認。" }),
  P({ pendingId: "PEND_GY_PALACE_STAR_CLAUSES", kind: "locatorOnly", sourceId: GY, pdfPage: 37, printedPage: 35, section: "二兄弟至十二父母・各星條件句",
    reason: "各宮正文是密集的「星曜＋宮位＋吉煞」條件句，只核對了各篇起首；其餘逐句核對後才能建立宮位規則。", allowedAfterVerification: "星曜在各宮的條件式判讀" }),
  P({ pendingId: "PEND_GY_GEXING_REST", kind: "humanDraft", sourceId: GY, pdfPage: 45, printedPage: 43, section: "論格星數高下・後段（第一至第九位）",
    reason: "「吉〔疑字：是〕惡殺為下格」一字不清；「數」在本篇的專門定義尚未釐清，不做分等計分。" }),
  P({ pendingId: "PEND_GY_NANNV", kind: "classicalContextOnly", sourceId: GY, pdfPage: 45, printedPage: 43, section: "論男女命異同",
    reason: "古代性別角色框架，只可保留在古籍原文層，不直接套用到現代使用者。", allowedAfterVerification: "古籍原文層（專業模式）" }),
  P({ pendingId: "PEND_GY_DAXIAN_REST", kind: "humanDraft", sourceId: GY, pdfPage: 46, printedPage: 44, section: "論大限十年禍福何如・後段",
    reason: "後段含「官災死亡立見」等強烈凶斷，以及逐宮的吉凶條件表，需逐欄核對；凶斷只能留在原文層，改寫為非宿命的風險提醒。" }),
  P({ pendingId: "PEND_GY_NANBEI_FIRST", kind: "humanDraft", sourceId: GY, pdfPage: 47, printedPage: 45, section: "論行限分南北斗・首句",
    reason: "「陽男陰女南〔疑字：斗〕為福」第六字為異體、不清。另：南北斗分上下五年的時間切分是否與本 App 運限邏輯同屬一套，需先確認，不改動客觀排盤。" }),
  P({ pendingId: "PEND_GY_YINZHI", kind: "classicalContextOnly", sourceId: GY, pdfPage: 47, printedPage: 45, section: "論陰騭延壽",
    reason: "壽夭與善惡報應敘述，只可作古籍原文層，不做任何壽命或健康預測。", allowedAfterVerification: "古籍原文層（專業模式）" }),
  P({ pendingId: "PEND_GY_YANGTUO_JIA", kind: "humanDraft", sourceId: GY, pdfPage: 47, printedPage: 45, section: "論羊陀夾併",
    reason: "條件密集（本命宮、遷移宮、羊陀、流年位置、三合照會），錯一字就改變成立條件，需逐欄校勘後再建格局規則。" }),
  P({ pendingId: "PEND_GY_STAR_TABLE_48_55", kind: "ocrSearchOnly", sourceId: GY, pdfPage: 48, printedPage: 46, section: "星曜／運限條件表（PDF p48–55）",
    reason: "只以機器 OCR 定位，未逐字核對。" }),
  ...["定富局", "定貴局", "定貧賤局", "定雜局"].map((n, i) => P({
    pendingId: `PEND_PATTERN_${i + 1}`, kind: "patternCandidate", sourceId: GY, pdfPage: n === "定雜局" ? 20 : n === "定富局" ? 19 : null, printedPage: null, section: n,
    reason: n === "定貧賤局"
      ? "格局名稱只作候選；古文標籤帶階級／宿命色彩，只可保留原文，現代判讀須拆成中性結構因素，不對使用者下「貧」「賤」判語。"
      : n === "定貴局" ? "多條只寫「見前批註」，須逐條回查前文條件，不可只依名稱成立。"
      : n === "定雜局" ? "多與運限、時勢變化有關，應建為本命語境＋運限修正，不是本命固定分數。"
      : "格局名稱只作候選；成立條件須逐字核對後才建立 ZiweiPatternRule，不設固定吉凶分數。",
    allowedAfterVerification: "ZiweiPatternRule（多條件；無固定分數）",
  })),
  P({ pendingId: "PEND_JW_WENDA", kind: "locatorOnly", sourceId: JW, pdfPage: 105, printedPage: null, section: "集文版・十四主星問答（PDF p105–113）",
    reason: "與《全書》卷一〈諸星問答論〉平行；集文版掃描原生解析度約 150 dpi、二值化，多數字無法逐字確認，只記大意，不建立異文。" }),
  P({ pendingId: "PEND_GY_OCR_P17_55", kind: "ocrSearchOnly", sourceId: GY, pdfPage: 17, printedPage: null, section: "來源包機器 OCR（p17–p55，SHA-256 7d90f2f3…226a）",
    reason: "低信度導航稿：禁止作 originalText、禁止 exact citation、禁止評分。" }),
];

export const PENDING_COUNTS = ZIWEI_PENDING.reduce<Record<PendingKind, number>>(
  (m, e) => ({ ...m, [e.kind]: (m[e.kind] ?? 0) + 1 }), { humanDraft: 0, ocrSearchOnly: 0, patternCandidate: 0, locatorOnly: 0, classicalContextOnly: 0 });
