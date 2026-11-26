---
name: crayon-style-video
description: Make a Crayon Capital explainer video (flat 2D "egg-people" cartoon, muted lamp-lit rooms, handwritten captions) from a narration script, using the code-drawn engine in crayon_style/. Use when the user wants a new video in this channel's style, wants to change the style or the characters, or wants transitions, camera or render settings changed.
---

# Crayon style video

The engine and its rules live in `crayon_style/`. **Read `crayon_style/DESIGN_BIBLE.md` first.** It is the source of truth for line, colour, characters (including the teeth rule), sets, type, camera and transitions.

## Make a new video
1. Put the narration lines in `crayon_style/script.json`. Run `python3 voice/tts.py && python3 build_data.py` to get the voice, word times and lip-sync envelope.
2. Write `web/shots.js`. Build one scene function per set and one `shot()` per beat. Several shots can share a scene with different `cams`. Key every beat and every `out` transition to a spoken word with `cue(line, word)`.
3. Pick each transition from the bible's §7 table by what the scene is doing. Do not repeat one back to back. Give each a sound in `SFX`.
4. Run the quality gate before you render:
   - `node contact.js DIR`: stills of every shot. Check that characters fill 45–60% of the frame height, that subtitles stay off faces, and that nothing is clipped.
   - `node strips.js DIR`: 9 frames across every transition. Check for no ghosting, no grey or black mush, and that anchors line up.
5. Run `./make_video.sh` to render at 60 fps with 180° shutter motion blur (4 sub-frames per frame, resumable), mix to −14 LUFS and encode. It never overwrites an older video. Do not drop to 30 fps or turn the blur off to save time; that is what makes motion look like an animated film.
6. Log what failed and what you changed in the bible's §10 generation log, and fix it in the engine (rig, sets, transitions) rather than per shot, so the next video starts better.

## Rules users have asked for (do not regress)
- No hard cuts unless the bible's §7 table calls for one. Keep the camera tracking and the transition styles as they are.
- Teeth: clip to the mouth, use exactly 4 gap-centred tooth lines, re-ink the lip on top, and drop the grin below a mustache. Check any grin at 3x zoom (`node snap.js`).
- Smoothness: 60 fps, `SHUTTER = .5`, `SAMPLES = 4`, `SMEAR_K = .5`, and interpolated `VOENV`.

## Where things are
- `web/rig.js`: `person()` and `dog()`. `web/sets.js`: props and sets. `web/core.js`: palette, ink, light, type, `FPS`.
- `web/film.js`: cues, camera (`camNat`), compositor, subtitles, `panel()` (split screens and collages), and the shutter motion blur in `frameJPG`.
- `web/transitions.js`: `TRANS.*` (cut, jump, smash, match, morph, dip, dissolve, additive, whip, crossZoom, slide, push, windowPush, wipe, iris, pageTurn, passing, glitch, lightLeak, paperTear, handDrawn, split).
- Setup: `pip install kokoro-onnx faster-whisper soundfile pyloudnorm`, the Kokoro models in `~/models`, then `sound/fetch.sh`.
