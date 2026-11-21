# Why GTA 6's Record Launch Just Sank Its Own Stock

A long-form (8:08, 1920x1080, 30 fps) flat 2D cartoon money explainer. Every frame is drawn in code on an HTML canvas.

## Pipeline
1. `script_data.py`: script + beat list (source of truth). `python3 script_data.py` writes `script.md` and `beats.md`.
2. `voice/tts.py`: Kokoro (CPU, voice `am_michael`, speed 0.92), one line per call, edge-silence trim only, joined with gaps. Then `voice/words.py` runs faster-whisper (small.en) for word times.
3. `build_timeline.py`: shot table `web/timeline.js` + `shots.md`. Every cut is anchored to a whisper word time.
4. `web/`: `lib.js` (outlines, labels, light pools, vignette, faces, people, props), `sets.js`, `shots.js` (one draw function per shot, every animation keyed to a spoken word), `engine.js` (camera with push/drift/roll/shake and a framing solver that keeps every person/prop fully in or fully out of frame, black cards, chapter cards, sound events).
5. `contact.js`: contact sheets (a mid still of every shot, with time and line).
6. `render.js`: headless Chromium exporter, 4 workers, resumable JPG frames.
7. `mix.py`: Mixkit music bed ~20 dB under the voice, word-keyed Mixkit effects, ducking, -14 LUFS, -1 dBFS peak limiter.
8. `make_video.sh`: one click. Render -> mix -> frame-count check (refuses to encode if any frame is missing) -> FFmpeg soft glow (blurred highlights, screen blend 0.4) -> H.264/AAC. Writes `out/..._vN.mp4` and never overwrites.

Setup: `pip install kokoro-onnx faster-whisper soundfile pyloudnorm`, Kokoro model files in `~/models`, `sound/fetch.sh` for audio, Node with Playwright.
