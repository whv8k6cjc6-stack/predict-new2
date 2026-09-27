"""合併 A、B 兩輪獨立轉錄：逐欄組（上下半合併、去除重疊）後比對，輸出 merged/p{leaf}.json 與差異清單。"""
import json, glob, os, re, difflib, sys
VAR = {"爲": "為", "裏": "裡", "眞": "真", "敎": "教", "産": "產", "衆": "眾", "隲": "騭", "淸": "清", "冲": "沖", "尅": "剋", "户": "戶", "恒": "恆", "峯": "峰", "竒": "奇", "旣": "既", "卽": "即", "閒": "閑", "强": "強", "㓕": "滅", "寍": "寧", "寕": "寧"}
MARK = re.compile(r"〔[^〕]*〕")
def norm(s):
    return "".join(VAR.get(c, c) for c in s)
def cols_of(strip):
    a = strip.get("a", "") or ""; b = strip.get("b", "") or ""
    A = a.split("|") if a else []; B = b.split("|") if b else []
    n = max(len(A), len(B)); out = []
    for i in range(n):
        x = (A[i] if i < len(A) else "").replace("〔截〕", ""); y = (B[i] if i < len(B) else "").replace("〔截〕", "")
        # 去除重疊：a 尾與 b 頭相同的 1–3 字
        k = 0
        for t in (3, 2, 1):
            if len(x) >= t and len(y) >= t and MARK.sub("", x[-t:]) == x[-t:] and x[-t:] == y[:t]: k = t; break
        out.append(norm(x + y[k:]))
    return out
def load(p):
    return json.load(open(p)) if os.path.exists(p) else None
os.makedirs("merged", exist_ok=True)
summary = []
for fa in sorted(glob.glob("trans/A/p*.json")):
    leaf = os.path.basename(fa)[1:-5]; fb = f"trans/B/p{leaf}.json"
    A = load(fa); B = load(fb)
    if not B: continue
    strips = []
    nd = 0
    for sa in A["strips"]:
        sb = next((x for x in B["strips"] if x["strip"] == sa["strip"]), {"a": "", "b": ""})
        ca, cb = cols_of(sa), cols_of(sb)
        # 以「字元＋是否存疑」為單位：〔疑字：X〕→ (X, True)；〔缺字〕→ ("□", True)
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
        TA, TB = toks(ca), toks(cb)
        sa_ = "".join(t[0] for t in TA); sb_ = "".join(t[0] for t in TB)
        sm = difflib.SequenceMatcher(None, sa_, sb_, autojunk=False)
        issues = []
        for op, i1, i2, j1, j2 in sm.get_opcodes():
            if op == "equal":
                for d in range(i2 - i1):
                    ta, tb = TA[i1 + d], TB[j1 + d]
                    if ta[1] or tb[1]:
                        issues.append({"kind": "doubt", "i1": i1 + d, "i2": i1 + d + 1, "a": ta[0], "b": tb[0], "col": ta[2], "idx": ta[3], "ctx": sa_[max(0, i1+d-5):i1+d] + "【" + ta[0] + "】" + sa_[i1+d+1:i1+d+6]})
            else:
                t0 = TA[i1] if i1 < len(TA) else (TA[-1] if TA else ("", False, 0, 0))
                issues.append({"kind": "diff", "op": op, "i1": i1, "i2": i2, "a": sa_[i1:i2], "b": sb_[j1:j2], "col": t0[2], "idx": t0[3], "ctx": sa_[max(0, i1-5):i1] + "【" + sa_[i1:i2] + "｜" + sb_[j1:j2] + "】" + sa_[i2:i2+5]})
        nd += len(issues)
        strips.append({"strip": sa["strip"], "A": sa_, "B": sb_, "issues": issues, "colsA": len(ca), "colsB": len(cb)})
    json.dump({"leaf": leaf, "strips": strips}, open(f"merged/p{leaf}.json", "w"), ensure_ascii=False, indent=0)
    chars = sum(len(s["A"]) for s in strips)
    summary.append((leaf, chars, nd, sum(1 for s in strips for i in s["issues"] if i["kind"] == "diff")))
for s in summary: print(*s)
print("leaves", len(summary), "total chars", sum(s[1] for s in summary), "issues", sum(s[2] for s in summary), "true diffs", sum(s[3] for s in summary))
