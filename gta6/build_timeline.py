"""Shot table: every shot start/end is anchored to a faster-whisper word time (never typed seconds).
Reads voice/lines.json + voice/words.json + script_data.CHAPTERS -> web/timeline.js and shots.md."""
import json, re, os
from script_data import CHAPTERS
H = os.path.dirname(os.path.abspath(__file__))
L = json.load(open(f"{H}/voice/lines.json")); W = json.load(open(f"{H}/voice/words.json"))
DUR = L["duration"]; lines = L["lines"]
norm = lambda s: re.sub(r"[^a-z0-9$.%]", "", s.lower()).strip(".")
for l in lines: l["words"] = []
for w in W:  # assign each word to the line it overlaps most (whisper stretches first words into silence)
    cand = [i for i, l in enumerate(lines) if w["e"] > l["start"] + 0.1 and w["s"] < l["end"]]
    ov = [(min(w["e"], l["end"]) - max(w["s"], l["start"]), i) for i, l in enumerate(lines)]
    best, i = max(ov)
    if cand: i, best = cand[-1], 1
    if best > -0.05:
        l = lines[i]
        l["words"].append(dict(w=norm(w["w"]), raw=w["w"], s=round(max(w["s"], l["start"] - 0.02), 3), e=w["e"]))
for l in lines: assert l["words"], l["id"]
desc = {lid: shots for _, _, ls in CHAPTERS for lid, _, shots in ls}
MAXH, MINP = 3.3, 1.3
shots = []
for li, l in enumerate(lines):
    ds = desc[l["id"]]; ws = l["words"]; n = len(ws)
    card = ds[0].startswith("Chapter card")
    body = ds[1:] if card else ds
    if card:
        shots.append(dict(key=f"{l['id']}.0", line=l["id"], idx=0, start=lines[li-1]["end"] + 0.12, desc=ds[0]))
    k = len(body)
    for i, d in enumerate(body):
        wi = round(i * n / k)
        st = 0.0 if (li == 0 and i == 0) else ws[wi]["s"] - 0.04
        shots.append(dict(key=f"{l['id']}.{i + (1 if card else 0)}", line=l["id"], idx=i + (1 if card else 0),
                          start=round(st, 3), desc=d, anchor=ws[wi]["raw"]))
for i, s in enumerate(shots):
    s["end"] = shots[i+1]["start"] if i + 1 < len(shots) else DUR
# split long holds into cut-ins at word starts (sub = framing variant)
allw = [w for l in lines for w in l["words"]]
out = []
for s in shots:
    if s["desc"].startswith(("Chapter card", "BLACK CARD")) or s["end"] - s["start"] <= MAXH:
        out.append({**s, "sub": 0}); continue
    parts = max(2, round((s["end"] - s["start"]) / 2.7))
    cuts = [s["start"]]
    for p in range(1, parts):
        target = s["start"] + p * (s["end"] - s["start"]) / parts
        cand = [w["s"] - 0.04 for w in allw if cuts[-1] + MINP <= w["s"] - 0.04 <= s["end"] - MINP]
        if cand: cuts.append(min(cand, key=lambda x: abs(x - target)))
    cuts = sorted(set(cuts)) + [s["end"]]
    for j in range(len(cuts) - 1):
        out.append({**s, "start": round(cuts[j], 3), "end": round(cuts[j+1], 3), "sub": j})
js = {"duration": DUR, "fps": 30, "lines": [{k: l[k] for k in ("id", "start", "end", "text", "words")} for l in lines], "shots": out}
open(f"{H}/web/timeline.js", "w").write("window.TL=" + json.dumps(js) + ";")
with open(f"{H}/shots.md", "w") as f:
    f.write("| # | Key | Sub | Start | End | Anchor word | Picture |\n|---|---|---|---|---|---|---|\n")
    for i, s in enumerate(out):
        f.write(f"| {i+1} | {s['key']} | {s['sub']} | {s['start']:.2f} | {s['end']:.2f} | {s.get('anchor','(gap)')} | {s['desc']} |\n")
lens = [s["end"] - s["start"] for s in out]
print(len(out), "shots; avg %.2f s; max %.2f; min %.2f" % (sum(lens)/len(lens), max(lens), min(lens)))
