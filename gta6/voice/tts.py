"""Kokoro (local CPU) narration: one line per call, edge-silence trim only, joined with short gaps.
Writes voice/lines/<id>.wav, voice/narration.wav, voice/lines.json (exact start/end per line)."""
import json, os, re, sys
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from script_data import CHAPTERS
VOICE, SPEED = os.environ.get("VOICE", "am_michael"), float(os.environ.get("SPEED", "1.0"))
SR = 24000
FIX = [(r"\bGTA\b", "G T A"), (r"Grand Theft Auto 6", "Grand Theft Auto six"), (r"Grand Theft Auto 5", "Grand Theft Auto five"),
       (r"G T A 6", "G T A six"), (r"G T A 5", "G T A five"), (r"\b2013\b", "twenty thirteen"), (r"\b2017\b", "twenty seventeen"),
       (r"\b2023\b", "twenty twenty-three"), (r"\b2024\b", "twenty twenty-four"), (r"\b2025\b", "twenty twenty-five"),
       (r"\b2026\b", "twenty twenty-six"), (r"19th", "nineteenth"), (r"Take-Two", "Take Two"), (r"\bAI\b", "A I"),
       (r"Nvidia", "En-vidia"), (r"straight-A", "straight A"), (r"another A,", "another A,")]
def tts_text(s):
    for a, b in FIX: s = re.sub(a, b, s)
    return s
def trim_edges(a, thr=0.004, pad=0.04):
    # only trims leading/trailing silence; never cuts inside the line
    idx = np.where(np.abs(a) > thr)[0]
    if len(idx) == 0: return a
    s = max(0, idx[0] - int(pad*SR)); e = min(len(a), idx[-1] + int(pad*SR*2))
    return a[s:e]
def main():
    k = Kokoro(os.path.expanduser("~/models/kokoro-v1.0.onnx"), os.path.expanduser("~/models/voices-v1.0.bin"))
    os.makedirs(os.path.join(HERE, "lines"), exist_ok=True)
    out, meta, t = [], [], 0.0
    for ci, (title, mood, lines) in enumerate(CHAPTERS):
        for li, (lid, text, shots) in enumerate(lines):
            p = os.path.join(HERE, "lines", f"{lid}.wav")
            if not os.path.exists(p):
                a, sr = k.create(tts_text(text), voice=VOICE, speed=SPEED, lang="en-us")
                sf.write(p, trim_edges(a.astype(np.float32)), sr)
            a, _ = sf.read(p, dtype="float32")
            # gap before the line: chapter openers get room for the chapter card
            if li == 0 and ci > 0: gap = 1.9
            elif lid in ("C3", "C4", "C5", "C6"): gap = 0.28
            elif lid in ("C7", "C8", "6.9", "5.1"): gap = 0.7
            elif li == 0: gap = 0.4
            else: gap = 0.32
            out.append(np.zeros(int(gap*SR), np.float32)); t += gap
            meta.append({"id": lid, "chapter": ci, "title": title, "text": text, "start": round(t, 3), "end": round(t + len(a)/SR, 3)})
            out.append(a); t += len(a)/SR
            print(f"{lid:4s} {len(a)/SR:5.1f}s  {text[:60]}")
    out.append(np.zeros(int(2.2*SR), np.float32)); t += 2.2
    full = np.concatenate(out)
    sf.write(os.path.join(HERE, "narration.wav"), full, SR)
    json.dump({"duration": round(t, 3), "lines": meta}, open(os.path.join(HERE, "lines.json"), "w"), indent=1)
    print("TOTAL", round(t, 1), "s")
main()
