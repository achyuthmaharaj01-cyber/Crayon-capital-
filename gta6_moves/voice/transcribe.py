"""faster-whisper (small.en, word timestamps) on the supplied voiceover -> voice/words.json + voice/transcript.txt"""
import json, os, subprocess, numpy as np
from faster_whisper import WhisperModel
H = os.path.dirname(os.path.abspath(__file__))
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f"{H}/voiceover.mp3", "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True, check=True).stdout
a = np.frombuffer(raw, np.float32).copy()
m = WhisperModel("small.en", device="cpu", compute_type="int8")
segs, _ = m.transcribe(a, word_timestamps=True, beam_size=5, language="en", vad_filter=False)
words, text = [], []
for s in segs:
    text.append(s.text.strip())
    for w in s.words: words.append({"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)})
json.dump(words, open(f"{H}/words.json", "w")); open(f"{H}/transcript.txt", "w").write("\n".join(text))
print(len(words), "words")
