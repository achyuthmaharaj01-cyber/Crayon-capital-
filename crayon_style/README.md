# Crayon Capital style engine

Every frame is drawn in code (HTML canvas), in the style reverse-engineered in `DESIGN_BIBLE.md`.

- `script.json`: the narration lines. `voice/tts.py`: Kokoro voice, faster-whisper word times, and a 30 fps mouth envelope. `build_data.py` writes `web/data.js`.
- `web/core.js`: palette tokens, ink primitives, glow, grain, vignette, type. `web/rig.js`: egg-people and the dog. `web/sets.js`: props and sets.
- `web/film.js`: word cues, cameras (always moving), and the transition compositor (`push`, `match`, `whip`, `dissolve`, plus an iris ending). There are no hard cuts. Renders at 60 fps with 180° shutter motion blur.
- `web/shots.js`: one shot per beat, with every beat and transition keyed to a spoken word, plus its sound effects.
- Quality gate: `node contact.js DIR` writes stills of every shot. `node strips.js DIR` writes 9-frame strips across every transition.
- `make_video.sh`: renders (resumable), mixes (Mixkit bed and effects, ducking, -14 LUFS), refuses to encode if any frame is missing, adds a glow pass, and encodes H.264. It never overwrites an older video.

Setup: `pip install kokoro-onnx faster-whisper soundfile pyloudnorm`, the Kokoro model files in `~/models`, then `sound/fetch.sh`.
New video: edit `script.json`, run `python3 voice/tts.py && python3 build_data.py`, write `web/shots.js`, run the quality gate, then `./make_video.sh`.
