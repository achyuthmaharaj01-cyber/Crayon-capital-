# "The Night the CIA Stole a Moon Rocket": production brief (read this first)

A 12:43 documentary (1920x1080, 60 fps, motion blur) in the **Crayon Capital** style. Every frame is drawn in code on an HTML canvas.
The voiceover is fixed: `voice/narration.wav` (the client's file). Do not change the words or timing.

## Sources of truth
- `../crayon_style/DESIGN_BIBLE.md`: the style (line, colour, egg-people characters, sets, type, camera, transitions). **§4 is the character bible. §7 lists the only allowed transitions.**
- `../.claude/skills/crayon-style-video/SKILL.md`: rules the client has asked for. Do not regress them.
- `voice/words_by_line.txt`: every sentence (S001–S166) with each spoken word and its start time. `voice/lines.txt`: one line per sentence.
- `script.pdf` / `script_raw.txt`: the script.
- `STORYBOARD.md` (Director) → `CAST.md` + `web/cast.js` + `web/sets_cia.js` (Visual Director) → `web/acts/actN.js` (scene build, then Cameraman) → `critique/actN.md` (Critic).

## Client rules (non-negotiable)
1. **No hard cuts.** Every shot change is `push` (through a window/door/frame), `match` (shape to shape), `whip` (same direction), or `dissolve` (time skips). The final shot uses `irisEnd`. No split screens, no inset panels, no collages.
2. **When the narration names something already on screen, the camera pushes in on it, on that word, in the same shot.** Frame the subject alone. Nobody is cut by the frame edge, and nothing pokes in from outside (no stray arm, no half head). When the camera pulls back, it settles where the subject that left is fully out.
3. Characters fill **45–60% of the frame height** in character shots. Subtitles never sit on a face.
4. Teeth (any grin): clipped to the mouth, exactly 4 gap-centred tooth lines, lip re-inked on top (already in `rig.js`; just use `expr: 'grin'`).
5. Camera is never fully static: keyed framings eased together, plus a slow push and drift (`camNat`).
6. Every beat and every transition fires on a spoken word: `cue('S0xx', 'word', nth, offset)`. Words are normalised (lowercase alphanumerics), so use the whisper spelling from `words_by_line.txt`, e.g. `maich` for Maysh, `silvetti`, `zambranardi`, `kolomiyakov`, `lunatic` (S156 "Lunik"), `20` for "twenty", `37`, `1959`.
7. Documentary honesty: the script hedges ("most likely in Mexico City", "according to Maysh", "Silveti later claimed", "disputed"). Visuals must not assert more than the words. Mark hedged claims visually (e.g. a hand-lettered "according to Maysh" tag, a "?" or a dotted outline for unconfirmed things). Never show a confirmed map pin where the script says it's unconfirmed.

## Engine API (read `web/film.js`, `web/rig.js`, `web/props.js`, `web/core.js`)
- `shot({ key, at, set(c, T), cams, push, drift, out, subY, overlay })`. `at` is the absolute start time (use `cue`). Shots from all act files are sorted by `at` and `resolve()` is called once in `index.html`.
- `T.t` is absolute seconds. `T.at(t0, dur)` is a 0→1 ramp starting at t0. `easeOut`, `ease`, `smooth`, `lerp` and `clamp` are in core.js.
- `cams: [[t, x, y, zoom, easeDur?], ...]` in world coords (the 1920x1080 world; sets bleed 320 px beyond, so stay inside it). `push` is the per-second zoom creep (default .012), `drift` is px/s (default 6).
- `out`: `{type:'push', d, win:{x,y,w,h}}` | `{type:'match', d, a:[x,y,size], b:[x,y,size], size}` (a in this shot's world, b in the next) | `{type:'whip', d:.45, dir:±1}` | `{type:'dissolve', d}`. The last shot uses `irisEnd: {t0, d, world:[x,y]}`.
- `subY`: subtitle baseline (default 968; 112 for top). Pick whichever keeps it off faces.
- `overlay(c, T, cam)`: screen-space cards (date/place card top-left: `hand(c, 'Mexico City, 1959', 80, 92, 84, '#fbf8ef', {align:'left', stroke:6, strokeCol:'rgba(22,16,22,.8)'})`).
- People: `person(c, {x, y, s, t, ...preset, expr, look, lookY, talk, arms:{l:[ang,bend], r:[...]}, legs:'stand'|'walk'|'sit', walk:phase, hold(c, handL, handR), flip})`. Height is ~310 px at s=1 (head radius 60). Expressions: neutral serious angry worried sad shock smug sly happy grin think. `talk: VOENV(t)` lip-syncs to the voice.
- `SFX.push({ n, t, g, len })`: sound effects. Available names: whoosh1 whoosh2 whoosh3 pop crowdtalk sparkle hit coins coin stamp cheer pencil ding clock whistle deflate sadhorn flash (camera flash) tick bell paper page slide horn rain rocks bag ret. Ask in your report if you need another.
- Preview tools (run from `cia/`): `node contact.js DIR [t1 t2 ...]` renders stills (default: 2 per shot) and prints the shot table plus MISSING cues. `node strips.js DIR` renders 9-frame strips across every transition. `node snap.js page.html out.png 'expr'` does a custom render. Use the scratchpad `/tmp/claude-0/-home-user-Crayon-capital-/42d67d88-ea38-54f9-9553-41a305908696/scratchpad/` for output. Tile stills with ffmpeg and look at them with the Read tool.

## Acts (each act file owns its time range; shots must start inside it)
| Act | Sentences | Time | Content |
|---|---|---|---|
| 1 | S001–S025 | 0:00–2:00 | Cold open: the truck, the switch, "one night"; then the space race (Sputnik, Luna 1/2/3, Pioneer 4), "Lunik", the world tour |
| 2 | S026–S058 | 2:00–4:59 | The Soviet exhibition; the 24-hour first look; paperwork and the manifest; Mexico City station; Winston Scott; Silveti; Tampico; the opening; the KGB guard |
| 3 | S059–S098 | 4:59–7:52 | The weak spot (rail yard checker); the plan; the four specialists and Finer; gear; the stalled truck; the convoy; the switch; the checker waits and goes to supper |
| 4 | S099–S128 | 7:52–10:00 | The salvage yard; the 30-minute wait; the roof planks; street lamps scare; inside the nose; photographs; test roll; base cap; the seal problem; couplings |
| 5 | S129–S166 | 10:00–12:43 | Reassembly by feel; the 4 a.m. blackout; the return; the checker "showed no surprise"; Washington analysis; secrecy until 1995; Silveti's fate; the submarine teaser; iris out |

## File ownership (avoid edit collisions)
- `web/rig.js`: Visual Director only, **additive** changes (new hats, outfits, props on people). Never change existing behaviour.
- `web/cast.js`, `web/sets_cia.js`, `CAST.md`: Visual Director.
- `web/acts/actN.js`: that act's scene builder and cameraman. Act-specific helpers go inside the act file, prefixed `aN_`.
- `web/film.js`, `web/core.js`, `web/props.js`, `index.html`, `render.js`, mix: the producer only. Put requests in your report.

## The bar
Peak quality, rewatchable: the dense, deadpan, prop-and-label humour of the references, recurring visual motifs (the crate stencil, the clock through the night, the deadpan Soviet checker, the canvas tarp), clear geography, and every beat landing on its word.
