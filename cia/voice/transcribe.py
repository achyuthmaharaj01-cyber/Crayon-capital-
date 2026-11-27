"""faster-whisper word times for the supplied voiceover -> voice/words.json, plus a 30 fps mouth envelope -> voice/env.json"""
import json, os, subprocess, numpy as np
from faster_whisper import WhisperModel
H = os.path.dirname(os.path.abspath(__file__))
a = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", f"{H}/narration.wav", "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True, check=True).stdout, np.float32).copy()
m = WhisperModel("small.en", device="cpu", compute_type="int8")
segs, _ = m.transcribe(a, word_timestamps=True, beam_size=5, language="en", initial_prompt="Lunik, Sputnik, Luna, Pioneer, Winston Scott, Eduardo Díaz Silveti, Warren Dean, Robert Zambernardi, Tampico, Auditorio Nacional, Boris Kolomyakov, Jeff Maysh, Sydney Wesley Finer.")
words = [{"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)} for s in segs for w in s.words]
json.dump(words, open(f"{H}/words.json", "w"))
hop = 16000 // 30; n = len(a) // hop
rms = np.array([np.sqrt(np.mean(a[i * hop:(i + 1) * hop] ** 2)) for i in range(n)])
env = np.clip(rms / (np.percentile(rms[rms > .01], 90) + 1e-9), 0, 1)
json.dump([round(float(x), 2) for x in env], open(f"{H}/env.json", "w"))
print(len(words), "words", round(len(a) / 16000, 2), "s")
