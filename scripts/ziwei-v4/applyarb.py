"""把 res2/arb_*.json（仲裁結果，以清單編號為鍵）轉成穩定鍵，併入 res/decisions.json → res/decisions_all.json"""
import json, glob, os
D = json.load(open("res/decisions.json"))
rows = {}
for f in glob.glob("res2/*_list.txt"):
    for l in open(f):
        p = l.rstrip("\n").split("\t"); rows[p[0]] = p[1]
n = {"certain": 0, "uncertain": 0, "missing": 0}; why = {}
for f in sorted(glob.glob("res2/arb_*.json")):
    A = json.load(open(f))
    for k, v in A.items():
        if k not in rows: n["missing"] += 1; continue
        leaf = k.split("_")[0]; val = v["value"] if isinstance(v, dict) else v
        val = None if val == "?" else ("" if val == "_" else val)
        D.setdefault(leaf, {})[rows[k]] = val
        why[f"{leaf}|{rows[k]}"] = v.get("why", "") if isinstance(v, dict) else ""
        n["certain" if val is not None else "uncertain"] += 1
json.dump(D, open("res/decisions_all.json", "w"), ensure_ascii=False, indent=0)
json.dump(why, open("res/decisions_why.json", "w"), ensure_ascii=False, indent=0)
print(n, "listed:", len(rows))
