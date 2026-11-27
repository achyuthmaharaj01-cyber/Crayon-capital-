"""Align the client's script lines to the faster-whisper word stream (single voiceover take).
Each line gets the contiguous run of transcribed words it was spoken with -> voice/lines.json"""
import json, re, difflib, subprocess
from storyboard import CHAPTERS
W = json.load(open("voice/words.json"))
nm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower().replace("$", ""))
lines = [(lid, text, ci) for ci, (_, _, ls) in enumerate(CHAPTERS) for lid, text, _ in ls]
stok, sline = [], []
for li, (lid, text, _) in enumerate(lines):
    for t in re.split(r"[\s\-–—:]+", text):
        if nm(t): stok.append(nm(t)); sline.append(li)
wtok = [nm(w["w"]) for w in W]
sm = difflib.SequenceMatcher(None, stok, wtok, autojunk=False)
m = {}
for a, b, n in sm.get_matching_blocks():
    for k in range(n): m[a + k] = b + k
first, last = {}, {}
for si, wi in m.items():
    li = sline[si]; first[li] = min(first.get(li, 10**9), wi); last[li] = max(last.get(li, -1), wi)
# contiguous partition: each line starts right after the previous line's last matched word
starts = []
for li in range(len(lines)):
    starts.append(0 if li == 0 else (last[li - 1] + 1 if li - 1 in last else first[li]))
out = []
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", "voice/voiceover.mp3"], capture_output=True, text=True).stdout)
for li, (lid, text, ci) in enumerate(lines):
    a = starts[li]; b = (starts[li + 1] - 1) if li + 1 < len(lines) else len(W) - 1
    ws = W[a:b + 1]
    out.append({"id": lid, "chapter": ci, "text": text, "start": ws[0]["s"], "end": ws[-1]["e"],
                "words": [{"w": nm(w["w"]) or w["w"], "raw": w["w"], "s": w["s"], "e": w["e"]} for w in ws]})
# numbers the script spells in words ("a hundred dollars", "ten") are heard as digits and can slip to the next line
numw = {"dollars", "ten", "hundred", "percent"}
def ends_with_number(text):
    t = re.sub(r"[^\w$%.]", " ", text).split()[-1].lower().strip(".")
    return bool(re.search(r"\d", t)) or t in numw
for i in range(1, len(out)):
    if not ends_with_number(out[i - 1]["text"]): continue
    while out[i]["words"] and (re.fullmatch(r"\d+|percent|%", out[i]["words"][0]["w"])):
        w = out[i]["words"].pop(0); out[i - 1]["words"].append(w); out[i - 1]["end"] = w["e"]
    out[i]["start"] = out[i]["words"][0]["s"]
cov = len(m) / len(stok)
json.dump({"duration": round(dur, 3), "lines": out}, open("voice/lines.json", "w"))
print(f"matched {cov:.1%} of script words; duration {dur:.1f}s")
for l in out[:3] + out[-2:]: print(l["id"], f"{l['start']:.2f}-{l['end']:.2f}", " ".join(w["raw"] for w in l["words"])[:90])
bad = [l["id"] for l in out if abs(len(l["words"]) - len(l["text"].split())) > 4]
print("lines whose word count differs by >4:", bad)
