# How GTA 6 made $3.79 billion — animated explainer

7:46, 1920x1080, 30 fps, flat 2D cartoon drawn in code on an HTML canvas, cut to the supplied voiceover.

- `storyboard.py`: the script split into spoken lines with their pictures. `storyboard.md`: the readable storyboard and beat list with times.
- `voice/transcribe.py`: faster-whisper word times for `voice/voiceover.mp3` -> `voice/words.json`, `voice/transcript.txt`.
- `align.py`: aligns each script line to the transcribed words -> `voice/lines.json`. `build_timeline.py`: word-anchored shot table (`web/timeline.js`, `shots.md`) and `script.md` (words and seconds per line).
- `web/`: `lib.js` (outlines, labels, light, faces, people), `sets.js`, `props.js` (cast and props), `shots.js` (one draw function per shot), `engine.js` (camera solver, push, shake, black cards, chapter cards, sound events).
- `contact.js` contact sheets, `render.js` resumable frame export, `mix.py` sound (Mixkit music and effects, ducking, -14 LUFS).
- `make_video.sh`: one click. Refuses to encode if a frame is missing, never overwrites an older video. `SKIP_RENDER=1` skips the frame export.
