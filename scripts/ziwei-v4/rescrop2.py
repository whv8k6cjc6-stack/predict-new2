"""為尚未決議的 issues 產生定位影像（res2/）。清單每行附穩定鍵。"""
import sys, json, os, pymupdf
PDF = "pkg4/紫微來源包_v4_校訂與結構化/source/紫微斗數全書-廣益版.pdf"
d = pymupdf.open(PDF); os.makedirs("res2", exist_ok=True)
D = json.load(open("res/decisions.json")) if os.path.exists("res/decisions.json") else {}
N = 7; total = 0
for leaf in sys.argv[1:]:
    page = int(leaf[:-1])
    meta = json.load(open(f"cols/s/p{leaf}_strips.json")); m = json.load(open(f"merged/p{leaf}.json"))
    pg = d[page - 1]; R = pg.rect; items = []
    for s in m["strips"]:
        sm = next(x for x in meta["strips"] if x["strip"] == s["strip"])
        ncol = max(s["colsA"], 1); x0, x1 = sm["x"]; w = (x1 - x0) / ncol
        for i in s["issues"]:
            key = f"{s['strip']}:{i['i1']}:{i['i2']}:{i['kind']}:{i['a']}"
            if key in D.get(leaf, {}): continue
            j = i["col"]; cx1 = x1 - j * w + w * 0.45; cx0 = x1 - (j + 1) * w - w * 0.45
            y = 0.058 + max(i["idx"], 0) * 0.0213
            y0, y1 = max(0.03, y - 0.12), min(0.97, y + 0.14)
            pix = pg.get_pixmap(dpi=165, clip=pymupdf.Rect(R.width*max(cx0, 0), R.height*y0, R.width*min(cx1, 1), R.height*y1), colorspace=pymupdf.csRGB)
            ty = int((y - y0) / (y1 - y0) * pix.h)
            for yy in range(max(0, ty - 18), min(pix.h, ty + 18)):
                for xx in range(0, 5): pix.set_pixel(xx, yy, (255, 0, 0))
            items.append((key, s["strip"], i, pix))
    with open(f"res2/{leaf}_list.txt", "w") as f:
        for k in range(0, len(items), N):
            grp = items[k:k+N]
            W = sum(p.width + 12 for *_, p in grp); H = max(p.height for *_, p in grp)
            out = pymupdf.Pixmap(pymupdf.csRGB, pymupdf.IRect(0, 0, W, H), False); out.clear_with(255); x = 0
            for *_, p in grp: p.set_origin(x, 0); out.copy(p, p.irect); x += p.width + 12
            out.save(f"res2/{leaf}_{k//N}.png")
            for n, (key, st, i, p) in enumerate(grp):
                f.write(f"{leaf}_{k//N}#{n}\t{key}\ts{st} {i['kind']} A={i['a']} B={i['b']} ctx={i['ctx']}\n")
    total += len(items)
print(total)
