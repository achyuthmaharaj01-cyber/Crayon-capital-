"""Sound mix: the supplied voiceover + Mixkit music bed (~20 dB under voice) + word-keyed Mixkit effects.
Music and effects duck under speech. Final loudness normalised to -14 LUFS. Writes build/mix.wav."""
import json, os, subprocess, numpy as np, soundfile as sf, pyloudnorm as pyln
H = os.path.dirname(os.path.abspath(__file__)); SR = 48000
def load(p):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).copy()
db = lambda x: 10 ** (x / 20)
voice = load(f"{H}/voice/narration.wav"); N = len(voice)   # the client's own voiceover, untouched apart from level
# --- speech envelope (for ducking): 50 ms RMS, smoothed attack/release
hop = SR // 100; frames = np.sqrt(np.convolve(voice ** 2, np.ones(hop) / hop, "same"))
active = (frames > 0.01).astype(np.float32)
env = np.zeros(N, np.float32); a, r = 1 - np.exp(-1 / (0.03 * SR)), 1 - np.exp(-1 / (0.35 * SR)); v = 0.0
for i in range(0, N, 32):  # coarse smoothing for speed
    tgt = active[i]; k = a if tgt > v else r; v += (tgt - v) * (1 - (1 - k) ** 32); env[i:i + 32] = v
# --- music bed: "Echoes" looped with crossfades
m = load(f"{H}/sound/music/188.mp3"); xf = 3 * SR; bed = m.copy()
while len(bed) < N + SR:
    fade = np.linspace(0, 1, xf, dtype=np.float32); bed = np.concatenate([bed[:-xf], bed[-xf:] * (1 - fade) + m[:xf] * fade, m[xf:]])
bed = bed[:N]; bed[:SR] *= np.linspace(0, 1, SR); bed[-3 * SR:] *= np.linspace(1, 0, 3 * SR)
rms = lambda x: np.sqrt(np.mean(x ** 2) + 1e-12)
v_rms = rms(voice[active > 0]) ; bed_rms = rms(bed)
bed *= (v_rms / bed_rms) * db(-20)                      # 20 dB under the voice
bed *= (1 - env * (1 - db(-4))) * db(2) * 1.0            # gaps lift +2 dB, speech ducks a further ~4 dB
# --- effects
ALIAS = {"register": "ding", "crowd2": "crowdtalk"}; SKIP = {"steps", "yawn"}
cache = {}; fx = np.zeros(N, np.float32)
for e in json.load(open(f"{H}/sound/events.json")):
    n = ALIAS.get(e["n"], e["n"])
    if n in SKIP: continue
    if n not in cache: cache[n] = load(f"{H}/sound/sfx/{n}.mp3")
    s = cache[n].copy(); L = e.get("len")
    if L: s = s[: int(L * SR)]; f = min(int(.3 * SR), len(s)); s[-f:] *= np.linspace(1, 0, f)
    s = s / (np.max(np.abs(s)) + 1e-9) * v_rms * 2.2 * db(e.get("g", -10))   # effect peak relative to voice level
    st = int(max(0, e["t"]) * SR); en = min(N, st + len(s)); fx[st:en] += s[: en - st]
fx *= (1 - env * (1 - db(-6)))                             # effects duck 6 dB under speech
mix = voice + bed + fx
meter = pyln.Meter(SR); lufs = meter.integrated_loudness(mix)
def limiter(x, lim, blk=256):
    # look-ahead peak limiter: per-block gain = min needed over neighbouring blocks, smoothed; never lifts quiet parts
    need = np.minimum(1.0, lim / (np.abs(x) + 1e-9)); nb = int(np.ceil(len(x) / blk))
    b = np.pad(need, (0, nb * blk - len(x)), constant_values=1).reshape(nb, blk).min(1)
    b = np.minimum(np.minimum(b, np.r_[1, b[:-1]]), np.r_[b[1:], 1])
    g = np.repeat(b, blk)[: len(x)]; k = np.ones(blk) / blk; g = np.minimum(np.convolve(g, k, "same"), need)
    return x * g
lim = db(-1.0)
st = lambda x: np.stack([x, x], 1)   # measure the actual stereo file (dual-mono reads +3 dB vs mono)
for _ in range(4):
    mix *= db(-14 - meter.integrated_loudness(st(mix))); mix = limiter(mix, lim)
final = meter.integrated_loudness(st(mix))
os.makedirs(f"{H}/build", exist_ok=True); sf.write(f"{H}/build/mix.wav", np.stack([mix, mix], 1), SR, subtype="PCM_16")
sp = active > 0
print(f"integrated: {final:.1f} LUFS | peak {20*np.log10(np.max(np.abs(mix))):.1f} dBFS")
print(f"voice RMS (speech) {20*np.log10(rms(voice[sp])):.1f} dB | music under speech {20*np.log10(rms(bed[sp])):.1f} dB | gap {20*np.log10(rms(voice[sp])/rms(bed[sp])):.1f} dB")
