"""Sound mix: the supplied voiceover + Mixkit music bed (~20 dB under voice) + word-keyed Mixkit effects.
Music and effects duck under speech. Final loudness normalised to -14 LUFS. Writes build/mix.wav."""
import json, os, subprocess, numpy as np, soundfile as sf, pyloudnorm as pyln
H = os.path.dirname(os.path.abspath(__file__)); SR = 48000
def load(p):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).copy()
db = lambda x: 10 ** (x / 20)
voice = load(f"{H}/voice/voiceover.mp3"); voice = np.concatenate([voice, np.zeros(3 * SR, np.float32)]); N = len(voice)  # 3 s tail, matches the timeline   # the client's own voiceover, untouched apart from level
# --- speech envelope (for ducking): 50 ms RMS, smoothed attack/release
hop = SR // 100; frames = np.sqrt(np.convolve(voice ** 2, np.ones(hop) / hop, "same"))
active = (frames > 0.01).astype(np.float32)
env = np.zeros(N, np.float32); a, r = 1 - np.exp(-1 / (0.03 * SR)), 1 - np.exp(-1 / (0.35 * SR)); v = 0.0
for i in range(0, N, 32):  # coarse smoothing for speed
    tgt = active[i]; k = a if tgt > v else r; v += (tgt - v) * (1 - (1 - k) ** 32); env[i:i + 32] = v
# --- music bed: one track per chapter (MUSIC below), each started at its chapter's first word, 2.5 s crossfades
LINES = json.load(open(f"{H}/voice/lines.json"))["lines"]
ch_start = {}
for l in LINES: ch_start.setdefault(l["chapter"], l["start"])
MUSIC = json.load(open(f"{H}/sound/music_plan.json"))   # {"0": [track_id, gain_db], ...}; missing chapters continue the previous track
bed = np.zeros(N, np.float32); xf = int(2.5 * SR); tracks = {}
def looped(tid, n):
    if tid not in tracks: tracks[tid] = load(f"{H}/sound/music/{tid}.mp3")
    m = tracks[tid]; out = m.copy(); f = int(3 * SR)
    while len(out) < n:
        fade = np.linspace(0, 1, f, dtype=np.float32); out = np.concatenate([out[:-f], out[-f:] * (1 - fade) + m[:f] * fade, m[f:]])
    return out[:n]
segs = []
for ci in sorted(ch_start):
    if str(ci) in MUSIC and ci != 'drops': segs.append((max(0, ch_start[ci] - 1.0), MUSIC[str(ci)]))
segs[0] = (0.0, segs[0][1])
for k, (t0, (tid, g)) in enumerate(segs):
    a = int(t0 * SR); b = min(N, int(segs[k + 1][0] * SR) + xf) if k + 1 < len(segs) else N
    if tid is None: continue
    piece = looped(tid, b - a) * db(g)
    if k > 0: piece[:xf] *= np.linspace(0, 1, xf)
    if k + 1 < len(segs): piece[-xf:] *= np.linspace(1, 0, xf)
    bed[a:b] += piece
bed[:SR] *= np.linspace(0, 1, SR); bed[-3 * SR:] *= np.linspace(1, 0, 3 * SR)
# music drops: the bed falls away (fast) on the first line's first word and returns (slow) after the last line ends
byid = {l["id"]: l for l in LINES}
for a_id, b_id, g in MUSIC.get("drops", []):
    a = int(byid[a_id]["start"] * SR) - int(.15 * SR); b = int(byid[b_id]["end"] * SR) + int(.6 * SR)
    gain = np.ones(N, np.float32); fi, fo = int(.4 * SR), int(2.0 * SR)
    gain[a:a + fi] = np.linspace(1, db(g), fi); gain[a + fi:b] = db(g); gain[b:b + fo] = np.linspace(db(g), 1, fo)
    bed *= gain
rms = lambda x: np.sqrt(np.mean(x ** 2) + 1e-12)
v_rms = rms(voice[active > 0]) ; bed_rms = rms(bed)
bed *= (v_rms / bed_rms) * db(-20)                      # 20 dB under the voice
bed *= (1 - env * (1 - db(-4))) * db(2) * 1.0            # gaps lift +2 dB, speech ducks a further ~4 dB
# --- effects
ALIAS = {"register": "ding", "crowd2": "crowdtalk"}; SKIP = {"yawn"}
cache = {}; fx = np.zeros(N, np.float32)
for e in json.load(open(f"{H}/sound/events.json")):
    n = ALIAS.get(e["n"], e["n"])
    if n in SKIP: continue
    if n not in cache: cache[n] = load(f"{H}/sound/sfx/{n}.mp3")
    s = cache[n].copy(); L = e.get("len")
    if L: s = s[: int(L * SR)]; f = min(len(s), int(.3 * SR)); s[-f:] *= np.linspace(1, 0, f)
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
