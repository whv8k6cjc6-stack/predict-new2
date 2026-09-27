// 紫微古籍原文匯入（例：《紫微斗數全書》公有領域電子文本）。
// 用法：node scripts/import-ziwei-classic.mjs <UTF-8 文字檔> --source ziwei.quanshu --edition "版本說明" --origin "取得來源網址或說明" --license "公有領域"
// 文字檔格式：以「# 」開頭的行為篇名（可寫「# 卷一｜諸星問答論」表示卷次與篇名），其後各行為該篇原文。
// 產出：src/kb/ziwei/texts/textImports.generated.ts（保留其他來源的既有匯入；由 imported.ts 合併）；同時印出 SHA-256。
// 匯入後以 npx vitest run src/tests/ziwei-interp.test.ts 檢查所有引用是否能逐字比對。
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "src/kb/ziwei/texts/textImports.generated.ts");
const args = process.argv.slice(2);
const file = args[0];
const opt = k => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : undefined; };
const sourceId = opt("source"), edition = opt("edition"), origin = opt("origin"), license = opt("license") ?? "公有領域";
if (!file || !sourceId || !edition || !origin) {
  console.error("用法：node scripts/import-ziwei-classic.mjs <檔案> --source <sourceId> --edition <版本> --origin <來源> [--license <授權>]");
  process.exit(1);
}
const raw = readFileSync(file, "utf8");
const sha256 = createHash("sha256").update(raw).digest("hex");
const sections = [];
let cur = null;
for (const line of raw.split(/\r?\n/)) {
  const m = line.match(/^#\s*(.+)$/);
  if (m) {
    const [a, b] = m[1].split("｜");
    cur = { sectionId: `${sourceId}#${sections.length + 1}`, volume: b ? a.trim() : null, title: (b ?? a).trim(), text: "" };
    sections.push(cur);
  } else if (cur && line.trim()) cur.text += line.trim() + "\n";
}
if (!sections.length) { console.error("找不到任何篇名（以「# 」開頭的行）"); process.exit(1); }

let existing = [];
const prev = readFileSync(out, "utf8");
const j = prev.match(/TEXT_IMPORTS: ImportedClassicalText\[\] = (\[[\s\S]*\]);\s*$/);
if (j) existing = JSON.parse(j[1]);
existing = existing.filter(t => !(t.sourceId === sourceId && t.edition === edition));
existing.push({ sourceId, edition, origin, license, sha256, importedAt: new Date().toISOString(), sections });
writeFileSync(out, `/** 由 scripts/import-ziwei-classic.mjs 產生，勿手改。 */
import type { ImportedClassicalText } from "@/core/ziwei/interp/citation";

export const TEXT_IMPORTS: ImportedClassicalText[] = ${JSON.stringify(existing, null, 2)};
`);
console.log(`匯入 ${sourceId}（${edition}）：${sections.length} 篇，SHA-256 ${sha256}`);
