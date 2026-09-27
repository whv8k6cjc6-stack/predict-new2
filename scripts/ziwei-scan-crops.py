"""依 transcription.json 的頁碼與裁切範圍，從本地 PDF 產生每段轉錄的影像，供逐字複核。
用法：python3 scripts/ziwei-scan-crops.py <紫微斗數全書-廣益版.pdf> <輸出資料夾> [dpi=120]
需要 PyMuPDF（pip install pymupdf）。會先確認 PDF 的 SHA-256 與 source.json 一致。"""
import hashlib, json, os, sys
import pymupdf

root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src/data/classics/ziwei/quanshu-guangyi")
pdf, out = sys.argv[1], sys.argv[2]
dpi = int(sys.argv[3]) if len(sys.argv) > 3 else 120
source = json.load(open(os.path.join(root, "source.json"), encoding="utf-8"))
tr = json.load(open(os.path.join(root, "transcription.json"), encoding="utf-8"))
h = hashlib.sha256(open(pdf, "rb").read()).hexdigest()
if h != source["sha256"]:
    sys.exit(f"PDF SHA-256 不符：{h}（登錄為 {source['sha256']}）")
os.makedirs(out, exist_ok=True)
doc = pymupdf.open(pdf)
with open(os.path.join(out, "index.txt"), "w", encoding="utf-8") as idx:
    for s in tr["spans"]:
        page = doc[s["pdfPage"] - 1]
        r = page.rect
        x0, y0, x1, y1 = s["clip"]
        pix = page.get_pixmap(dpi=dpi, clip=pymupdf.Rect(r.width * x0, r.height * y0, r.width * x1, r.height * y1))
        name = f"{s['spanId']}.png"
        pix.save(os.path.join(out, name))
        idx.write(f"{name}\tPDF p{s['pdfPage']}（版心 {s['printedPage']}）\t{s['volume']}｜{s['section']}｜{s['entry']}\t{s['text']}\n")
print(f"已輸出 {len(tr['spans'])} 段影像到 {out}")
