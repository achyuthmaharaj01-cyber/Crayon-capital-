"""Kokoro narration -> voice/narration.wav, voice/lines.json, then faster-whisper word times -> voice/words.json,
and a 30 fps mouth-open envelope -> voice/env.json (used for lip sync)."""
import json, os, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
H = os.path.dirname(os.path.abspath(__file__)); SR = 24000
lines = json.load(open(os.path.join(H, "..", "script.json")))
k = Kokoro(os.path.expanduser("~/models/kokoro-v1.0.onnx"), os.path.expanduser("~/models/voices-v1.0.bin"))
def trim(a, thr=.004):
    i = np.where(np.abs(a) > thr)[0]; return a[max(0, i[0] - 960): i[-1] + 1920]
GAP = {"L2": .35, "L3": .45, "L4": .55, "L5": .6, "L6": .75, "L7": .7, "L8": .8}
out, meta, t = [np.zeros(int(.9 * SR), np.float32)], [], .9
for lid, text in lines:
    g = GAP.get(lid, 0); out.append(np.zeros(int(g * SR), np.float32)); t += g
    a, _ = k.create(text.replace("Pieter", "Peter").replace("Haarlem", "Harlem"), voice="am_michael", speed=.93, lang="en-us"); a = trim(a.astype(np.float32))
    meta.append({"id": lid, "text": text, "s": round(t, 3), "e": round(t + len(a) / SR, 3)}); out.append(a); t += len(a) / SR
out.append(np.zeros(int(2.2 * SR), np.float32)); v = np.concatenate(out)
sf.write(os.path.join(H, "narration.wav"), v, SR)
from faster_whisper import WhisperModel
m = WhisperModel("small.en", device="cpu", compute_type="int8")
import subprocess
v16 = np.frombuffer(subprocess.run(["ffmpeg","-v","error","-i",os.path.join(H,"narration.wav"),"-ac","1","-ar","16000","-f","f32le","-"],capture_output=True,check=True).stdout,np.float32).copy()
segs, _ = m.transcribe(v16, word_timestamps=True, beam_size=5, language="en")
words = [{"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)} for s in segs for w in s.words]
for L in meta: L["words"] = [w for w in words if w["s"] >= L["s"] - .15 and w["s"] < L["e"]]
hop = SR // 30; n = len(v) // hop
rms = np.array([np.sqrt(np.mean(v[i * hop:(i + 1) * hop] ** 2)) for i in range(n)])
env = np.clip(rms / (np.percentile(rms[rms > .01], 90) + 1e-9), 0, 1)
json.dump({"duration": round(len(v) / SR, 3), "lines": meta}, open(os.path.join(H, "lines.json"), "w"), indent=1)
json.dump([round(float(x), 2) for x in env], open(os.path.join(H, "env.json"), "w"))
print(round(len(v) / SR, 2), "s,", len(words), "words")
for L in meta: print(L["id"], L["s"], L["e"], " ".join(w["w"] for w in L["words"]))
