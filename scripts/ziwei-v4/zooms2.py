"""多個放大拼圖：python3 zooms.py key[:dy] key[:dy] ...（由左到右）"""
import sys, json, os, pymupdf
d = pymupdf.open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "pkg4/紫微來源包_v4_校訂與結構化/source/紫微斗數全書-廣益版.pdf"))
pix = []
for arg in sys.argv[1:]:
    key, _, dy = arg.partition(":"); dy = float(dy) if dy else 0.0
    leaf = key.split("_")[0]; page = int(leaf[:-1])
    here = os.path.dirname(os.path.abspath(__file__))
    rows = [l.rstrip("\n").split("\t") for l in open(os.path.join(here, f"res2/{leaf}_list.txt"))]
    skey = next(r[1] for r in rows if r[0] == key)
    m = json.load(open(os.path.join(here, f"merged/p{leaf}.json"))); meta = json.load(open(os.path.join(here, f"cols/s/p{leaf}_strips.json")))
    flat = [(s, i) for s in m["strips"] for i in s["issues"] if f"{s['strip']}:{i['i1']}:{i['i2']}:{i['kind']}:{i['a']}" == skey]
    s, i = flat[0]; sm = next(x for x in meta["strips"] if x["strip"] == s["strip"])
    ncol = max(s["colsA"], 1); x0, x1 = sm["x"]; w = (x1 - x0) / ncol; j = i["col"]
    y = min(max(0.058 + max(i["idx"], 0) * 0.0213 + dy, 0.11), 0.89)
    pg = d[page - 1]; R = pg.rect
    cl = pymupdf.Rect(R.width * max(x1 - (j + 1) * w - w * 0.5, 0), R.height * max(y - 0.09, 0.02), R.width * min(x1 - j * w + w * 0.5, 1), R.height * min(y + 0.09, 0.98))
    pix.append(pg.get_pixmap(dpi=190, clip=cl, colorspace=pymupdf.csGRAY)); print(key, i["ctx"])
W = sum(p.width + 16 for p in pix); H = max(p.height for p in pix)
o = pymupdf.Pixmap(pymupdf.csGRAY, pymupdf.IRect(0, 0, W, H), False); o.clear_with(255); x = 0
for p in pix: p.set_origin(x, 0); o.copy(p, p.irect); x += p.width + 16
out = os.environ.get("ZOUT", os.path.join(os.path.dirname(os.path.abspath(__file__)), "res2/zoom.png")); o.save(out); print("saved", out)
