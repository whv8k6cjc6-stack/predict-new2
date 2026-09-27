// 《紫微斗數全書》廣益版掃描來源的雜湊：重新計算轉錄檔的 SHA-256 並寫入 sha256.json；
// 若提供 PDF 路徑，另外確認 PDF 原檔 SHA-256 與 source.json 登錄的一致（不一致就停止，代表版本不同，所有引用都要重新核對）。
// 用法：node scripts/ziwei-scan-sha.mjs [紫微斗數全書-廣益版.pdf]
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "src/data/classics/ziwei/quanshu-guangyi");
const sha = b => createHash("sha256").update(b).digest("hex");
const source = JSON.parse(readFileSync(join(dir, "source.json"), "utf8"));
const pdf = process.argv[2];
if (pdf) {
  const h = sha(readFileSync(pdf));
  if (h !== source.sha256) { console.error(`PDF SHA-256 不符：${h}（登錄為 ${source.sha256}）`); process.exit(1); }
  console.log(`PDF SHA-256 相符：${h}`);
}
const files = ["source.json", "transcription.json"];
const out = { pdf: source.sha256, ...Object.fromEntries(files.map(f => [f, sha(readFileSync(join(dir, f)))])) };
writeFileSync(join(dir, "sha256.json"), JSON.stringify(out, null, 1) + "\n");
console.log(out);
