"""Shot table: every shot's start/end is a faster-whisper word time (never a typed time).
voice/lines.json + storyboard.CHAPTERS -> web/timeline.js, shots.md"""
import json
from storyboard import CHAPTERS
L = json.load(open("voice/lines.json")); DUR = round(L["duration"] + 3.0, 3); lines = L["lines"]  # 3 s tail after the last word for the end card
desc = {lid: shots for _, _, ls in CHAPTERS for lid, _, shots in ls}
MAXH, MINP, CARD = 3.3, 1.3, 1.7
shots = []
for li, l in enumerate(lines):
    ds = desc[l["id"]]; ws = l["words"]
    card = ds[0].startswith("Chapter card"); body = ds[1:] if card else ds
    t0 = ws[0]["s"] - 0.04
    if card:  # the chapter card holds over the opening words, then the first picture cuts in on a word
        shots.append(dict(key=f"{l['id']}.0", line=l["id"], idx=0, start=round(max(t0 - 0.4, lines[li-1]["end"] + 0.05), 3), desc=ds[0]))
        ws_b = [w for w in ws if w["s"] >= t0 + CARD] or ws[-1:]
    else: ws_b = ws
    k = len(body); n = len(ws_b)
    for i, d in enumerate(body):
        wi = round(i * n / k)
        st = 0.0 if (li == 0 and i == 0) else ws_b[wi]["s"] - 0.04
        shots.append(dict(key=f"{l['id']}.{i + (1 if card else 0)}", line=l["id"], idx=i + (1 if card else 0), start=round(st, 3), desc=d, anchor=ws_b[wi]["raw"]))
for i, s in enumerate(shots): s["end"] = shots[i + 1]["start"] if i + 1 < len(shots) else DUR
allw = [w for l in lines for w in l["words"]]
out = []
for s in shots:
    if s["desc"].startswith(("Chapter card", "BLACK CARD")) or s["end"] - s["start"] <= MAXH:
        out.append({**s, "sub": 0}); continue
    parts = max(2, round((s["end"] - s["start"]) / 2.7)); cuts = [s["start"]]
    for p in range(1, parts):
        target = s["start"] + p * (s["end"] - s["start"]) / parts
        cand = [w["s"] - 0.04 for w in allw if cuts[-1] + MINP <= w["s"] - 0.04 <= s["end"] - MINP]
        if cand: cuts.append(min(cand, key=lambda x: abs(x - target)))
    cuts = sorted(set(cuts)) + [s["end"]]
    for j in range(len(cuts) - 1): out.append({**s, "start": round(cuts[j], 3), "end": round(cuts[j + 1], 3), "sub": j})
js = {"duration": DUR, "fps": 30, "lines": [{k: l[k] for k in ("id", "start", "end", "text", "words")} for l in lines], "shots": out}
open("web/timeline.js", "w").write("window.TL=" + json.dumps(js) + ";")
with open("shots.md", "w") as f:
    f.write("| # | Key | Sub | Start | End | Anchor word | Picture |\n|---|---|---|---|---|---|---|\n")
    for i, s in enumerate(out): f.write(f"| {i+1} | {s['key']} | {s['sub']} | {s['start']:.2f} | {s['end']:.2f} | {s.get('anchor','(card)')} | {s['desc']} |\n")
with open("script.md", "w") as f:
    f.write("# Script as voiced (line timings from the voiceover)\n\n| Line | Text | Words | Seconds | Starts |\n|---|---|---|---|---|\n")
    tw = 0
    for l in lines:
        n = len(l["text"].split()); tw += n; d = l["end"] - l["start"]
        f.write(f"| {l['id']} | {l['text']} | {n} | {d:.1f} | {int(l['start']//60)}:{l['start']%60:04.1f} |\n")
    f.write(f"\n**{tw} words, {DUR/60:.2f} min, {tw/(DUR/60):.0f} words per minute.**\n")
lens = [s["end"] - s["start"] for s in out]
print(len(out), "shots; avg %.2f s; max %.2f; min %.2f" % (sum(lens)/len(lens), max(lens), min(lens)))
