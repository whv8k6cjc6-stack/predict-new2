import json,sys,re
P=json.load(open("/home/user/predict-new2/src/data/classics/ziwei/quanshu-guangyi/pages.json"))
leaf=sys.argv[1]; pat=sys.argv[2] if len(sys.argv)>2 else None
L=next(l for l in P["leaves"] if l["leaf"]==leaf)
for s in L["strips"]:
    for c in s["columns"]:
        t=c
        if pat and not re.search(pat, re.sub(r"〔疑字：(.)〕",r"\1",t)): continue
        print(f"s{s['strip']}: {t}")
