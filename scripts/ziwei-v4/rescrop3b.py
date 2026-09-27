"""補轉錄差異的定位影像（res3/）：每處裁整個補轉錄視窗寬度、目標列上下各約 0.13 頁高。"""
import json, os, pymupdf
d = pymupdf.open("pkg4/紫微來源包_v4_校訂與結構化/source/紫微斗數全書-廣益版.pdf"); os.makedirs("res3", exist_ok=True)
S = json.load(open("merged/sup.json")); N = 6; items = []
OLD = {l.split("\t")[1] for l in open("res3/list_r1.txt")}
for s in S:
    page = int(s["leaf"][:-1]); pg = d[page - 1]; R = pg.rect
    x0, x1 = s["x"]; x0 -= 0.012; x1 += 0.012
    if s["source"] == "gutter": x0, x1 = 0.43, 0.57
    for i in s["issues"]:
        if f"{s['id']}:{i['i1']}:{i['i2']}:{i['kind']}:{i['a']}" in OLD: continue
        y = min(max(0.058 + max(i["idx"], 0) * 0.0213, 0.1), 0.9)
        y0, y1 = max(0.02, y - 0.13), min(0.98, y + 0.13)
        pix = pg.get_pixmap(dpi=150, clip=pymupdf.Rect(R.width*max(x0,0), R.height*y0, R.width*min(x1,1), R.height*y1), colorspace=pymupdf.csRGB)
        ty = int((y - y0) / (y1 - y0) * pix.h)
        for yy in range(max(0, ty - 18), min(pix.h, ty + 18)):
            for xx in range(0, 5): pix.set_pixel(xx, yy, (255, 0, 0))
        items.append((f"{s['id']}:{i['i1']}:{i['i2']}:{i['kind']}:{i['a']}", s, i, pix))
with open("res3/list_r2.txt", "w") as f:
    for k in range(0, len(items), N):
        grp = items[k:k+N]; W = sum(p.width + 12 for *_, p in grp); H = max(p.height for *_, p in grp)
        out = pymupdf.Pixmap(pymupdf.csRGB, pymupdf.IRect(0, 0, W, H), False); out.clear_with(255); x = 0
        for *_, p in grp: p.set_origin(x, 0); out.copy(p, p.irect); x += p.width + 12
        out.save(f"res3/n{k//N:03d}.png")
        for n, (key, s, i, p) in enumerate(grp):
            f.write(f"n{k//N:03d}#{n}\t{key}\t{s['leaf']} {s['source']} {i['kind']} A={i['a']} B={i['b']} ctx={i['ctx']}\n")
print(len(items), (len(items)+N-1)//N)
