"""補轉錄差異放大：python3 zooms3.py <編號> [y偏移]；輸出到環境變數 ZOUT（預設 res3/zoom.png）"""
import sys, json, os, pymupdf
here = os.path.dirname(os.path.abspath(__file__))
d = pymupdf.open(os.path.join(here, "pkg4/紫微來源包_v4_校訂與結構化/source/紫微斗數全書-廣益版.pdf"))
key = sys.argv[1]; dy = float(sys.argv[2]) if len(sys.argv) > 2 else 0.0
rows = [l.rstrip("\n").split("\t") for f in ("res3/list_r1.txt", "res3/list_r2.txt") if os.path.exists(os.path.join(here, f)) for l in open(os.path.join(here, f))]
skey = next(r[1] for r in rows if r[0] == key)
sid, i1 = skey.split(":")[0], int(skey.split(":")[1])
S = json.load(open(os.path.join(here, "merged/sup.json")))
s = next(x for x in S if x["id"] == sid); i = next(x for x in s["issues"] if x["i1"] == i1)
page = int(s["leaf"][:-1]); pg = d[page - 1]; R = pg.rect
x0, x1 = s["x"]; x0 -= 0.012; x1 += 0.012
if s["source"] == "gutter": x0, x1 = 0.43, 0.57
y = min(max(0.058 + max(i["idx"], 0) * 0.0213 + dy, 0.1), 0.9)
cl = pymupdf.Rect(R.width * max(x0, 0), R.height * max(y - 0.08, 0.02), R.width * min(x1, 1), R.height * min(y + 0.08, 0.98))
out = os.environ.get("ZOUT", os.path.join(here, "res3/zoom.png"))
pg.get_pixmap(dpi=260, clip=cl, colorspace=pymupdf.csGRAY).save(out); print(key, i["ctx"], "saved", out)
