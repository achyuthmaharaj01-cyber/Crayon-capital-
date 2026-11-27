"""Split the script into sentences (S001...) and align each to the faster-whisper word stream of the supplied
voiceover -> voice/lines.json {duration, lines:[{id, text, s, e, words:[{w,s,e}]}]}"""
import json, re, difflib, subprocess, os
H = os.path.dirname(os.path.abspath(__file__))
raw = open(f"{H}/script_raw.txt").read()
text = re.sub(r"\s+", " ", raw).strip()
# sentence split; keep quoted "Lunik." and abbreviations (p.m., a.m., U.S.) intact
prot = text.replace("p.m.", "p<m>").replace("a.m.", "a<m>").replace("U.S.", "U<S>")
sents = [s.replace("p<m>", "p.m.").replace("a<m>", "a.m.").replace("U<S>", "U.S.").strip() for s in re.split(r'(?:(?<=[.?!])|(?<=[.?!]["”]))\s+(?=[A-Z"“])', prot) if s.strip()]
W = json.load(open(f"{H}/voice/words.json"))
nm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())
stok, sline = [], []
for li, s in enumerate(sents):
    for t in re.split(r"[\s\-–—:,/]+", s):
        if nm(t): stok.append(nm(t)); sline.append(li)
wtok = [nm(w["w"]) for w in W]
sm = difflib.SequenceMatcher(None, stok, wtok, autojunk=False); m = {}
for a, b, n in sm.get_matching_blocks():
    for k in range(n): m[a + k] = b + k
first, last = {}, {}
for si, wi in m.items():
    li = sline[si]; first[li] = min(first.get(li, 10**9), wi); last[li] = max(last.get(li, -1), wi)
starts = []
for li in range(len(sents)):
    if li == 0: starts.append(0)
    elif li - 1 in last: starts.append(last[li - 1] + 1)
    else: starts.append(first.get(li, starts[-1]))
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f"{H}/voice/narration.wav"], capture_output=True, text=True).stdout)
out = []
for li, s in enumerate(sents):
    a = starts[li]; b = (starts[li + 1] - 1) if li + 1 < len(sents) else len(W) - 1
    ws = W[a:b + 1]
    if not ws: print("EMPTY", li, s); continue
    out.append({"id": f"S{li+1:03d}", "text": s, "s": ws[0]["s"], "e": ws[-1]["e"], "words": ws})
json.dump({"duration": round(dur, 3), "lines": out}, open(f"{H}/voice/lines.json", "w"), indent=0)
print(f"{len(out)} sentences; matched {len(m)/len(stok):.1%} of script words; duration {dur:.1f}s")
bad = [(l["id"], len(l["words"]), len(l["text"].split())) for l in out if abs(len(l["words"]) - len(l["text"].split())) > 3]
print("word-count mismatches:", bad)
with open(f"{H}/voice/lines.txt", "w") as f:
    for l in out: f.write(f"{l['id']}  {l['s']:7.2f}-{l['e']:7.2f}  {l['text']}\n")
