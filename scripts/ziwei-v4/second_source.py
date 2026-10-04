"""第二來源佐證（secondSourceVerified）：以《紫微斗數全書》電子全文（維基文庫系繁體 TXT）佐證兩輪目視轉錄的分歧。

規則（電子本不是答案，只是佐證）：
  1. 只處理兩輪轉錄未能回影像決議的差異（〔疑字〕）。
  2. 把該欄組的 A 輪文字對齊到電子本；差異處左右各需連續 2 字以上已逐字對上（錨點），取兩錨點之間的電子本文字。
  3. 這段電子本文字與 A 輪或 B 輪「其中一輪的目視讀法」逐字相同，才採用那一輪的讀法，並以〔校：X〕標記。
  4. 採用的讀法必須有字（不以電子本確認「某處沒有字」）；兩輪都讀不出（□）、或電子本與兩輪都不同、或錨點不足 → 維持〔疑字〕，不採電子本的字。
電子本不放入 git（授權未標明）；只保存每處佐證的位置、兩輪讀法、電子本該段文字與電子本檔案的 SHA-256。"""
import collections, difflib, hashlib, re

try:
    import opencc
    _CC = opencc.OpenCC("s2t")
    _s2t = _CC.convert
except ImportError:  # 電子本已是繁體；沒有 opencc 時只做異體歸一
    _s2t = lambda s: s

_V = str.maketrans({"剋": "克", "尅": "克", "冲": "沖", "庙": "廟", "刼": "劫", "鈐": "鈴", "玲": "鈴", "宫": "宮", "陥": "陷", "絶": "絕",
                    "爲": "為", "於": "于", "裏": "裡", "鬥": "斗", "姦": "奸", "飬": "養", "敎": "教", "戍": "戌"})
HAN = lambda c: "一" <= c <= "鿿"
norm = lambda c: _s2t(c).translate(_V)


class SecondSource:
    def __init__(self, path, label):
        raw = open(path, encoding="utf8").read()
        self.sha256 = hashlib.sha256(raw.encode("utf8")).hexdigest()
        self.label = label
        self.E = "".join(norm(c) for c in raw if HAN(c))
        self.idx = {K: collections.defaultdict(list) for K in (4, 5, 6)}
        for K in (4, 5, 6):
            for i in range(len(self.E) - K + 1):
                self.idx[K][self.E[i:i + K]].append(i)
        self.records = []

    def _align(self, text, issues):
        """回傳 A 輪文字每個漢字位置 → 電子本位置（只含逐字相同的字）；疑處不參與定位。"""
        pos = [i for i, c in enumerate(text) if HAN(c)]
        C = "".join(norm(text[i]) for i in pos)
        bad = set()
        for iss in issues:
            for k, p in enumerate(pos):
                if iss["i1"] <= p < iss["i2"]: bad.add(k)
        votes = collections.Counter()
        for K, maxp in ((6, 3), (5, 2), (4, 1)):
            votes.clear()
            for i in range(len(C) - K + 1):
                if any(j in bad for j in range(i, i + K)): continue
                ps = self.idx[K].get(C[i:i + K], [])
                if 0 < len(ps) <= maxp:
                    for q in ps: votes[q - i] += 1
            if votes and votes.most_common(1)[0][1] >= 2: break
        maps = []
        for off, vc in votes.most_common(4):
            if vc < 2: break
            lo = max(0, off - 15)
            W = self.E[lo:off + len(C) + 15]
            m = {}
            for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, C, W, autojunk=False).get_opcodes():
                if tag == "equal":
                    for i in range(i1, i2):
                        if i not in bad: m[pos[i]] = lo + j1 + i - i1
            maps.append(m)
        return pos, maps

    def resolve(self, leaf, strip, text, issues, unresolved):
        """unresolved：無法回影像決議的差異。回傳 {issue key: 採用的讀法}。"""
        if not unresolved: return {}
        pos, maps = self._align(text, unresolved)
        out = {}
        for iss in unresolved:
            a, b = iss["a"], iss["b"]
            ha, hb = "".join(norm(c) for c in a if HAN(c)), "".join(norm(c) for c in b if HAN(c))
            if "□" in a + b and not (ha or hb): continue
            left = [p for p in pos if p < iss["i1"]][-2:]
            right = [p for p in pos if p >= iss["i2"]][:2]
            if len(left) < 2 or len(right) < 2: continue
            for m in maps:
                if not all(p in m for p in left + right): continue
                if not (m[left[1]] == m[left[0]] + 1 and m[right[1]] == m[right[0]] + 1 and m[right[0]] > m[left[1]]): continue
                seg = self.E[m[left[1]] + 1:m[right[0]]]
                pick = None
                # 只採有字的讀法：「某一輪沒看到字」不能靠電子本確認
                if seg and seg == ha and "□" not in a: pick = a
                elif seg and seg == hb and "□" not in b: pick = b
                if pick is not None:
                    out[iss["_key"]] = pick
                    self.records.append({"leaf": leaf, "strip": strip, "i1": iss["i1"], "i2": iss["i2"], "kind": iss["kind"], "passA": a, "passB": b,
                                         "adopted": pick, "adoptedPass": "A" if pick == a else "B", "secondSourceText": seg,
                                         "context": text[max(0, iss["i1"] - 6):iss["i2"] + 6]})
                break
        return out


def mark(s):
    """採用的讀法逐字以〔校：X〕標記（欄界｜照原樣）。"""
    return "".join(f"〔校：{c}〕" if HAN(c) else c for c in s)
