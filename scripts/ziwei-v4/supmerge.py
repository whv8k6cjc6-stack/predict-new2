"""補轉錄（切邊直行 cutlines、書縫區 gutter）A/B 合併 → merged/sup.json：每個補轉錄欄組的 A 文字、B 文字、差異 issues。"""
import json, os, re, difflib
VAR = {"爲": "為", "裏": "裡", "眞": "真", "敎": "教", "産": "產", "衆": "眾", "隲": "騭", "淸": "清", "冲": "沖", "尅": "剋", "户": "戶", "恒": "恆", "峯": "峰", "竒": "奇", "旣": "既", "卽": "即", "閒": "閑", "强": "強", "㓕": "滅", "寍": "寧", "寕": "寧", "刦": "劫"}
MARK = re.compile(r"〔[^〕]*〕")
norm = lambda s: "".join(VAR.get(c, c) for c in s)
def cols_of(a_list, b_list):
    n = max(len(a_list), len(b_list)); out = []
    for i in range(n):
        x = (a_list[i] if i < len(a_list) else "") or ""; y = (b_list[i] if i < len(b_list) else "") or ""
        x = x.replace("〔截〕", ""); y = y.replace("〔截〕", ""); k = 0
        for t in (3, 2, 1):
            if len(x) >= t and len(y) >= t and MARK.sub("", x[-t:]) == x[-t:] and x[-t:] == y[:t]: k = t; break
        out.append(norm(x + y[k:]))
    return out
def toks(cols):
    out = []
    for ci, c in enumerate(cols):
        if ci: out.append(("|", False, ci, -1))
        i = 0; k = 0
        while i < len(c):
            m = MARK.match(c, i)
            if m:
                g = m.group(0); ch = g[4:-1] if g.startswith("〔疑字：") else "□"
                for x in (ch or "□"): out.append((x, True, ci, k)); k += 1
                i = m.end()
            else:
                out.append((c[i], False, ci, k)); k += 1; i += 1
    return out
def diff(ca, cb):
    TA, TB = toks(ca), toks(cb)
    sa_ = "".join(t[0] for t in TA); sb_ = "".join(t[0] for t in TB)
    sm = difflib.SequenceMatcher(None, sa_, sb_, autojunk=False); issues = []
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if op == "equal":
            for d in range(i2 - i1):
                ta, tb = TA[i1 + d], TB[j1 + d]
                if ta[1] or tb[1]:
                    issues.append({"kind": "doubt", "i1": i1+d, "i2": i1+d+1, "a": ta[0], "b": tb[0], "col": ta[2], "idx": ta[3], "ctx": sa_[max(0, i1+d-5):i1+d] + "【" + ta[0] + "】" + sa_[i1+d+1:i1+d+6]})
        else:
            t0 = TA[i1] if i1 < len(TA) else (TA[-1] if TA else ("", False, 0, 0))
            issues.append({"kind": "diff", "i1": i1, "i2": i2, "a": sa_[i1:i2], "b": sb_[j1:j2], "col": t0[2], "idx": t0[3], "ctx": sa_[max(0, i1-5):i1] + "【" + sa_[i1:i2] + "｜" + sb_[j1:j2] + "】" + sa_[i2:i2+5]})
    return sa_, sb_, issues
out = []
jobs = json.load(open("cols/c/jobs.json")); CA = json.load(open("trans/A/cutlines.json")); CB = json.load(open("trans/B/cutlines.json"))
per_leaf = {}
for j in jobs:
    a = CA.get(j["key"]); b = CB.get(j["key"])
    if not a or not b: continue
    n = per_leaf.get(j["leaf"], 0); per_leaf[j["leaf"]] = n + 1
    A, B, iss = diff(cols_of(a["a"], a["b"]), cols_of(b["a"], b["b"]))
    out.append({"id": j["key"], "leaf": j["leaf"], "strip": 100 + n, "source": "cutline", "x": j["x"], "A": A, "B": B, "issues": iss})
for p in list(range(17, 21)) + list(range(26, 56)):
    fa, fb = f"trans/A/g{p}.json", f"trans/B/g{p}.json"
    if not (os.path.exists(fa) and os.path.exists(fb)): continue
    ga, gb = json.load(open(fa)), json.load(open(fb))
    for side, leaf in (("right", f"{p}R"), ("left", f"{p}L")):
        la = [l for l in ga["lines"] if l["side"] == side]; lb = [l for l in gb["lines"] if l["side"] == side]
        if not la and not lb: continue
        A, B, iss = diff(cols_of([l.get("a", "") for l in la], [l.get("b", "") for l in la]), cols_of([l.get("a", "") for l in lb], [l.get("b", "") for l in lb]))
        out.append({"id": f"g{p}{side[0]}", "leaf": leaf, "strip": 90, "source": "gutter", "x": [0.44, 0.5] if side == "left" else [0.5, 0.56], "A": A, "B": B, "issues": iss})
# 複核補轉錄（extra：漏轉的直行與單字複核），差異不另仲裁，一律保留為疑字
if os.path.exists("trans/A/extra.json") and os.path.exists("trans/B/extra.json"):
    XA = json.load(open("trans/A/extra.json")); XB = json.load(open("trans/B/extra.json"))
    for j in json.load(open("cols/x/jobs.json")):
        a = XA.get(j["key"]); b = XB.get(j["key"])
        if not a or not b: continue
        n = per_leaf.get(j["leaf"], 0); per_leaf[j["leaf"]] = n + 1
        A, B, iss = diff(cols_of(a["a"], a["b"]), cols_of(b["a"], b["b"]))
        out.append({"id": j["key"], "leaf": j["leaf"], "strip": 100 + n, "source": "recheck", "x": j["x"], "A": A, "B": B, "issues": iss})
json.dump(out, open("merged/sup.json", "w"), ensure_ascii=False, indent=0)
print(len(out), "supp strips;", sum(len(s["issues"]) for s in out), "issues;", sum(1 for s in out for i in s["issues"] if i["kind"] == "diff"), "diffs;", sum(len(s["A"]) for s in out), "chars")
