"""把 A／B 兩輪轉錄與決議合成為 repo 內的頁面資料。
輸出：
  REPO/src/data/classics/ziwei/quanshu-guangyi/pages.json    （App 使用：各葉各欄組的決議後文字、影像範圍、驗證狀態）
  REPO/src/data/classics/ziwei/quanshu-guangyi/passes/{A,B}/p*.json（兩輪原始轉錄，稽核用，不打包）
  REPO/.../passes/decisions.json（差異決議紀錄）"""
import json, glob, os, re, shutil
REPO = os.environ.get("ZIWEI_PAGES_OUT", "/home/user/predict-new2/src/data/classics/ziwei/quanshu-guangyi")
# 第二來源佐證（選用）：ZIWEI_ETEXT＝電子全文 TXT 路徑。見 second_source.py
from second_source import SecondSource, mark as ss_mark
SS = SecondSource(os.environ["ZIWEI_ETEXT"], os.environ.get("ZIWEI_ETEXT_LABEL", "電子全文")) if os.environ.get("ZIWEI_ETEXT") else None
D = json.load(open("res/decisions_all.json"))
# 補轉錄欄組（書縫、切邊直行）與其決議
SUP = json.load(open("merged/sup.json")) if os.path.exists("merged/sup.json") else []
DS = {}
if os.path.exists("res3/list_r1.txt"):
    rows = {l.split("\t")[0]: l.split("\t")[1] for f in ("res3/list_r1.txt", "res3/list_r2.txt") if os.path.exists(f) for l in open(f)}
    for f in glob.glob("res3/arb_*.json"):
        for k, v in json.load(open(f)).items():
            if k not in rows: continue
            val = v["value"] if isinstance(v, dict) else v
            DS[rows[k]] = None if val == "?" else ("" if val == "_" else val.replace("／", ""))
def resolve(text, issues, dec, keyf, stats, where=None):
    unc = []; undecided = 0; second = 0
    for iss in issues: iss["_key"] = keyf(iss)
    picks = SS.resolve(where[0], where[1], text, issues, [i for i in issues if not (i["_key"] in dec and dec[i["_key"]] is not None)]) if SS and where else {}
    for iss in sorted(issues, key=lambda i: -i["i1"]):
        key = keyf(iss); stats["issues"] += 1
        if key in dec and dec[key] is not None:
            text = text[:iss["i1"]] + dec[key] + text[iss["i2"]:]; stats["resolved"] += 1
        elif key in picks:
            text = text[:iss["i1"]] + ss_mark(picks[key]) + text[iss["i2"]:]; stats["secondSource"] = stats.get("secondSource", 0) + 1; second += 1
        else:
            guess = iss["a"] or iss["b"] or "□"
            mark = "".join(f"〔疑字：{c}〕" for c in guess.replace("|", "")) + ("|" if "|" in guess else "")
            text = text[:iss["i1"]] + mark + text[iss["i2"]:]
            unc.append(guess); stats["uncertain" if key in dec else "undecided"] += 1
            if key not in dec: undecided += 1
    return text, unc, undecided, second
CROSS = [("31R", "南斗化", "陰"), ("32L", "斗數之中第", "二"), ("27R", "身逢吉", "聚"), ("27R", "財官", "昭"), ("27R", "財官昭", "著"),
         ("31R", "下賤孤", "寒"), ("28L", "一切厄", "喜"), ("28L", "膿血刑災", "逃")]
import re as _re
def fixmarks(t):
    t = _re.sub(r"(?<!〔)疑字：([^〔〕])〕", r"〔疑字：\1〕", t)
    t = _re.sub(r"(?<!〔)缺字〕", "〔缺字〕", t)
    out = []; i = 0
    while i < len(t):
        m = _re.match(r"〔((?:疑字|校)：[^〔〕]|缺字)〕", t[i:])
        if m: out.append(m.group(0)); i += m.end(); continue
        if t[i] in "〔〕": i += 1; continue
        out.append(t[i]); i += 1
    return "".join(out)
VOL = lambda p: "卷一" if p <= 20 else ("卷二" if p <= 36 else "卷三")
out = []; stats = {"leaves": 0, "strips": 0, "chars": 0, "issues": 0, "resolved": 0, "uncertain": 0, "undecided": 0}
for f in sorted(glob.glob("merged/p*.json"), key=lambda x: (int(re.findall(r"\d+", x)[0]), x.endswith("L.json"))):
    m = json.load(open(f)); leaf = m["leaf"]; page = int(leaf[:-1])
    meta = json.load(open(f"cols/s/p{leaf}_strips.json"))
    dec = D.get(leaf, {})
    strips = []
    for s in m["strips"]:
        sm = next(x for x in meta["strips"] if x["strip"] == s["strip"])
        text, unc, undecided, second = resolve(s["A"], s["issues"], dec, lambda iss: f"{s['strip']}:{iss['i1']}:{iss['i2']}:{iss['kind']}:{iss['a']}", stats, (leaf, s["strip"]))
        text = fixmarks(text)
        cols = text.split("|")
        state = "visualDoubleChecked" if not unc and not second else "visualTranscribed"
        strips.append({"strip": s["strip"], "region": {"x0": sm["x"][0], "x1": sm["x"][1], "y0": 0.035, "y1": 0.965}, "columns": cols,
                       "verification": {"machineLocated": False, "visualTranscribed": True, "visualDoubleChecked": state == "visualDoubleChecked", "humanReviewed": False, "secondSourceVerified": second > 0},
                       "uncertainGlyphs": unc, "undecided": undecided, "passAgreement": 1 - len(s["issues"]) / max(len(s["A"]), 1)})
        stats["strips"] += 1; stats["chars"] += len(text)
    for sp in [x for x in SUP if x["leaf"] == leaf]:
        text, unc, undecided, second = resolve(sp["A"], sp["issues"], DS, lambda iss: f"{sp['id']}:{iss['i1']}:{iss['i2']}:{iss['kind']}:{iss['a']}", stats, (leaf, sp["strip"]))
        text = fixmarks(text)
        state = "visualDoubleChecked" if not unc and not second else "visualTranscribed"
        strips.append({"strip": sp["strip"], "supplement": sp["source"], "supplementId": sp["id"], "region": {"x0": sp["x"][0], "x1": sp["x"][1], "y0": 0.035, "y1": 0.965}, "columns": text.split("|"),
                       "verification": {"machineLocated": False, "visualTranscribed": True, "visualDoubleChecked": state == "visualDoubleChecked", "humanReviewed": False, "secondSourceVerified": second > 0},
                       "uncertainGlyphs": unc, "undecided": undecided, "passAgreement": 1 - len(sp["issues"]) / max(len(sp["A"]), 1)})
        stats["strips"] += 1; stats["chars"] += len(text)
    # 複核補轉錄與主文讀法不同之處：主文該字也改為疑字（不以任一輪為準）
    for (lf, before, ch) in CROSS:
        if lf != leaf: continue
        for st in strips:
            if st["strip"] >= 90: continue
            for ci, col in enumerate(st["columns"]):
                if before + ch in col:
                    st["columns"][ci] = col.replace(before + ch, before + f"〔疑字：{ch}〕", 1)
                    st["uncertainGlyphs"].append(ch); st["verification"]["visualDoubleChecked"] = False
    out.append({"leaf": leaf, "pdfPage": page, "printedPage": page - 2, "half": "right" if leaf.endswith("R") else "left", "volume": VOL(page), "strips": strips})
    stats["leaves"] += 1
json.dump({"sourceId": "ziwei-doushu-quanshu-guangyi-scan", "method": "兩輪獨立目視轉錄（A、B，彼此不可見）→ 自動比對差異 → 回 PDF 影像決議；決議不了的字保留〔疑字〕，該欄組不算雙重核讀通過。", "leaves": out},
          open(f"{REPO}/pages.json", "w"), ensure_ascii=False, separators=(",", ":"))
for P in "AB":
    os.makedirs(f"{REPO}/passes/{P}", exist_ok=True)
    for g in glob.glob(f"trans/{P}/p*.json"): shutil.copy(g, f"{REPO}/passes/{P}/")
json.dump({"main": D, "supplement": DS}, open(f"{REPO}/passes/decisions.json", "w"), ensure_ascii=False, indent=0)
if SS:
    json.dump({"source": SS.label, "sha256": SS.sha256, "rule": "兩輪目視讀法之一與電子本（左右各 2 字錨點之間）逐字相同才採用；電子本只作佐證，不提供答案。",
               "records": SS.records}, open(f"{REPO}/passes/second_source.json", "w"), ensure_ascii=False, indent=0)
for P in "AB":
    for g in glob.glob(f"trans/{P}/g*.json") + glob.glob(f"trans/{P}/cutlines.json"): shutil.copy(g, f"{REPO}/passes/{P}/")
print(stats)
