"""faster-whisper on the finished narration -> voice/words.json (every word with start/end)."""
import json, os
from faster_whisper import WhisperModel
HERE = os.path.dirname(os.path.abspath(__file__))
m = WhisperModel(os.environ.get("WHISPER", "small.en"), device="cpu", compute_type="int8")
import numpy as np, soundfile as sf
a, sr = sf.read(os.path.join(HERE, "narration.wav"), dtype="float32")
n = int(len(a) * 16000 / sr); a16 = np.interp(np.linspace(0, len(a) - 1, n), np.arange(len(a)), a).astype(np.float32)
segs, info = m.transcribe(a16, word_timestamps=True, beam_size=5, language="en")
words = []
for s in segs:
    for w in s.words:
        words.append({"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)})
json.dump(words, open(os.path.join(HERE, "words.json"), "w"))
print(len(words), "words;", " ".join(x["w"] for x in words[:40]))
