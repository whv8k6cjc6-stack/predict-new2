"""廣益版某葉切成「欄組」影像（每組約 3 欄，切線落在欄間最淡處）。
用法：python3 colsplit2.py <page> <R|L> <outdir> [dpi]
輸出 {outdir}/p{page}{leaf}_s{NN}_{a|b}.png 與 p{page}{leaf}_strips.json（x、切點 y；頁寬高比例）。"""
import sys, json, os, pymupdf, numpy as np
PDF = os.environ.get("GY_PDF", "/tmp/claude-0/-home-user-predict-new2/01f10233-de6f-5109-a4de-ba868ea9ebc3/scratchpad/pkg4/紫微來源包_v4_校訂與結構化/source/紫微斗數全書-廣益版.pdf")
page, leaf, out = int(sys.argv[1]), sys.argv[2], sys.argv[3]
dpi = int(sys.argv[4]) if len(sys.argv) > 4 else 140
os.makedirs(out, exist_ok=True)
d = pymupdf.open(PDF); pg = d[page - 1]; R = pg.rect
pix = pg.get_pixmap(dpi=90, colorspace=pymupdf.csGRAY)
a = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.h, pix.w)
W, H = pix.w, pix.h
lx0, lx1 = (0.5, 1.0) if leaf == "R" else (0.0, 0.5)
X0, X1 = int(W * lx0), int(W * lx1)
body = (a[int(H*0.06):int(H*0.94), X0:X1] < 128)
ink = body.mean(axis=0)
# 版框：高墨量直線 → 界線
frame = ink > 0.45
# 平滑
k = 3; sm = np.convolve(ink, np.ones(k)/k, mode="same")
# 內容範圍：去除外框外
idxs = np.where(frame)[0]
left = idxs[idxs < len(ink)*0.2].max()+2 if (idxs < len(ink)*0.2).any() else 0
right = idxs[idxs > len(ink)*0.8].min()-2 if (idxs > len(ink)*0.8).any() else len(ink)-1
# 欄寬約 0.0185 頁寬 → 以 90dpi 頁寬 W 換算
colw = 0.0185 * W
# 在內容範圍內，找局部最小值作為欄界
cands = []
i = left
while i < right:
    j0 = int(i + colw*0.6); j1 = int(min(i + colw*1.45, right))
    if j0 >= right: break
    seg = sm[j0:j1+1]
    m = j0 + int(np.argmin(seg))
    cands.append(m); i = m
bounds = [left] + cands + [right]
bounds = sorted(set(bounds))
cols = [(bounds[t], bounds[t+1]) for t in range(len(bounds)-1) if bounds[t+1]-bounds[t] > colw*0.3]
cols = cols[::-1]  # 右到左
# 去除幾乎無墨的欄
cols = [c for c in cols if sm[c[0]:c[1]].mean() > 0.003]
# 每 3 欄一組
groups = [cols[t:t+3] for t in range(0, len(cols), 3)]
meta = []
Y0, Y1 = 0.035, 0.965
for gi, g in enumerate(groups, 1):
    gx0 = (X0 + min(c[0] for c in g)) / W; gx1 = (X0 + max(c[1] for c in g)) / W
    full = pymupdf.Rect(R.width*gx0, R.height*Y0, R.width*gx1, R.height*Y1)
    hp = pg.get_pixmap(dpi=dpi, clip=full, colorspace=pymupdf.csGRAY)
    col = np.frombuffer(hp.samples, dtype=np.uint8).reshape(hp.h, hp.w)
    rows = (col[:, 3:-3] < 110).sum(axis=1)
    lo, hi = int(hp.h*0.40), int(hp.h*0.60)
    r = lo + int(np.argmin(rows[lo:hi]))
    fy = Y0 + (Y1-Y0)*r/hp.h
    ov = 0.0 if rows[r] == 0 else 0.013
    for half, (y0, y1) in (("a", (Y0, fy + ov)), ("b", (fy - ov, Y1))):
        pg.get_pixmap(dpi=dpi, clip=pymupdf.Rect(R.width*gx0, R.height*y0, R.width*gx1, R.height*y1), colorspace=pymupdf.csGRAY).save(f"{out}/p{page}{leaf}_s{gi:02d}_{half}.png")
    meta.append({"strip": gi, "x": [round(gx0,4), round(gx1,4)], "cutY": round(fy,4), "overlap": ov > 0, "cols": len(g)})
json.dump({"page": page, "leaf": leaf, "strips": meta, "colCount": len(cols)}, open(f"{out}/p{page}{leaf}_strips.json","w"))
print(page, leaf, len(cols), len(groups), sum(1 for m in meta if m["overlap"]))
