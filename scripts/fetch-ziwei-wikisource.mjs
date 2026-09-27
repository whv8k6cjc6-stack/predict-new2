// 從維基文庫取得《紫微斗數全書》（公有領域），保存可重現的來源快照，並切分章節。
// 用法：node scripts/fetch-ziwei-wikisource.mjs
// 只連線 zh.wikisource.org（MediaWiki parse API，取得與頁面相同的渲染內容）；不使用任何代理或第三方轉載。
// 產出（src/data/classics/ziwei/ziwei-doushu-quanshu/）：
//   source.html    原始回應中的頁面 HTML（快照，之後的測試只讀這份，不連外部網站）
//   source.json    來源中繼資料（URL、revid、取得時間、公有領域狀態、SHA-256、parserVersion）
//   sections.json  章節切分結果（卷、篇、原文）
//   volume-N.txt   各卷純文字
//   sha256.json    各檔 SHA-256
// 之後執行 node scripts/fetch-ziwei-wikisource.mjs --parse-only 可只從快照重新切分（驗證可重現）。
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const PARSER_VERSION = "1.0.0";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "src/data/classics/ziwei/ziwei-doushu-quanshu");
const PAGE = "紫微斗數全書/全覽";
const PAGE_URL = `https://zh.wikisource.org/zh-hant/${PAGE}`;
const API = `https://zh.wikisource.org/w/api.php?action=parse&format=json&formatversion=2&prop=text|revid|displaytitle&redirects=1&variant=zh-hant&page=${encodeURIComponent(PAGE)}`;
const sha = s => createHash("sha256").update(s).digest("hex");

const decode = s => s.replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d)).replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&amp;/g, "&");

/** MediaWiki HTML → 依標題切分的純文字章節 */
export function parseSections(html) {
  const body = html
    .replace(/<style[\s\S]*?<\/style>/g, "").replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<sup[^>]*class="[^"]*reference[^"]*"[\s\S]*?<\/sup>/g, "")
    .replace(/<span class="mw-editsection">[\s\S]*?<\/span>\s*<\/span>/g, "")
    .replace(/<div class="mw-heading[^"]*">/g, "").replace(/<(table|div)[^>]*class="[^"]*(navbox|header|toc|noprint)[^"]*"[\s\S]*?<\/\1>/g, "");
  const parts = body.split(/(<h[2-5][^>]*>[\s\S]*?<\/h[2-5]>)/);
  const sections = [];
  let volume = null, cur = null;
  const text = s => decode(s.replace(/<br\s*\/?>/g, "\n").replace(/<\/(p|div|li|dd|dt|tr)>/g, "\n").replace(/<[^>]+>/g, ""))
    .split("\n").map(l => l.trim()).filter(Boolean).join("\n");
  for (const p of parts) {
    const h = p.match(/^<h([2-5])[^>]*>([\s\S]*?)<\/h\1>$/);
    if (h) {
      const title = text(h[2]).replace(/\[編輯\]|\[编辑\]/g, "").trim();
      if (/^卷[一二三四五六七八九十]+/.test(title)) volume = title.match(/^卷[一二三四五六七八九十]+/)[0];
      cur = { sectionId: `quanshu#${sections.length + 1}`, level: +h[1], volume, title, text: "" };
      sections.push(cur);
    } else if (cur) {
      const t = text(p);
      if (t) cur.text += (cur.text ? "\n" : "") + t;
    }
  }
  return sections.filter(s => s.text);
}

function write(html, meta) {
  mkdirSync(dir, { recursive: true });
  const sections = parseSections(html);
  if (sections.length < 10) throw new Error(`章節太少（${sections.length}），頁面結構可能不同，停止寫入`);
  const files = { "source.html": html, "sections.json": JSON.stringify(sections, null, 1) };
  const vols = [...new Set(sections.map(s => s.volume).filter(Boolean))];
  vols.forEach((v, i) => { files[`volume-${i + 1}.txt`] = sections.filter(s => s.volume === v).map(s => `# ${s.title}\n${s.text}`).join("\n\n") + "\n"; });
  const hashes = Object.fromEntries(Object.entries(files).map(([k, v]) => [k, sha(v)]));
  const source = {
    sourceId: "ziwei.quanshu", title: "紫微斗數全書", sourceUrl: PAGE_URL, apiUrl: API, pageTitle: PAGE,
    revid: meta.revid, retrievedAt: meta.retrievedAt, publicDomainStatus: "publicDomain（維基文庫頁面標示）",
    sourceType: "wikisource-html", editionDescription: `維基文庫《紫微斗數全書/全覽》revision ${meta.revid}（zh-hant 顯示）`,
    sha256: hashes["source.html"], parserVersion: PARSER_VERSION, sectionCount: sections.length, volumes: vols,
  };
  for (const [k, v] of Object.entries(files)) writeFileSync(join(dir, k), v);
  writeFileSync(join(dir, "sha256.json"), JSON.stringify(hashes, null, 1) + "\n");
  writeFileSync(join(dir, "source.json"), JSON.stringify(source, null, 1) + "\n");
  console.log(`已保存：${sections.length} 章節、${vols.length} 卷；source.html SHA-256 ${hashes["source.html"]}`);
}

if (process.argv.includes("--parse-only")) {
  const meta = JSON.parse(readFileSync(join(dir, "source.json"), "utf8"));
  write(readFileSync(join(dir, "source.html"), "utf8"), meta);
} else {
  if (existsSync(join(dir, "source.json")) && !process.argv.includes("--refresh")) {
    console.error("快照已存在；要重新抓取請加 --refresh（會改變 SHA-256，需重新校驗所有引用）");
    process.exit(1);
  }
  const res = await fetch(API, { headers: { "User-Agent": "xuanji-classics-import/1.0 (offline snapshot for a local app)" } });
  if (!res.ok) throw new Error(`維基文庫回應 ${res.status}`);
  const j = await res.json();
  if (!j.parse?.text) throw new Error(`回應沒有頁面內容：${JSON.stringify(j).slice(0, 300)}`);
  write(j.parse.text, { revid: j.parse.revid, retrievedAt: new Date().toISOString() });
}
