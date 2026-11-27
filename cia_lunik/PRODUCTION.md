# "The Night the CIA Stole a Moon Rocket": production bible

The Lunik heist, 1959. Voiceover: `voice/voiceover.mp3` (12:42). Script: `script.pdf`.
Output: 1920x1080, 30 fps, crayon-style 2D documentary drawn in code on an HTML canvas, cut to the voiceover.
The pipeline is a copy of `../gta6_moves` (read its README, storyboard.py, web/*.js before changing anything).

## The look: "Crayon Capital, Cold War noir"
- **Character bible = the house cast** in `../gta6_moves/cast_sheet.png` and `../gta6_moves/web/lib.js` + `props.js`:
  bean bodies, round heads with a soft-shade crescent, dot eyes, thick dark ink outline (INK), stick legs, oval shoes,
  ground shadow, the five faces (neutral, grin, smug, worried, shock), Kalam/Caveat hand-lettered labels. Keep the build;
  change only costume, hair, hats, props and palette. Every character must read as the same family as that sheet.
- **Documentary, not explainer.** Night-heavy story: deep navy/teal nights, sodium-orange street lamps, warm tungsten
  interiors, one accent colour per set. Period 1959: fedoras, trench coats, rounded trucks, rotary phones, typewriters,
  flashbulb cameras, film canisters, manila dossiers with CLASSIFIED stamps, maps with dotted routes.
- Recurring devices: a **clock** that tracks the one night (7:30 PM -> 4 AM -> 7 AM), a **dossier/case-file** card for each
  new person (name plate, role, "according to Maysh" style source tag), a **map** for geography, **blueprint cutaways** of
  the Lunik for anatomy, black title cards for chapter turns.
- One bright subject per shot, quiet dressed set, decelerating arrivals, no reflexive bounce, no looping decoration,
  never violet, plain copy on signs, no hype.

## Truth rules (the script hedges; the pictures must too)
- No invented facts, numbers, dates, names or places beyond the script. Hedged claims stay hedged on screen
  ("MOST LIKELY MEXICO CITY", "SILVETI'S ACCOUNT", "PER MAYSH", "DISPUTED").
- Real people appear only as generic crayon characters identified by a text label. No likenesses, no logos, no real photos.
- Soviet markings may be generic Cyrillic-looking strokes or "CCCP"; no fake readable serial numbers presented as real.

## Team and file ownership (never edit a file you do not own; ask the orchestrator)
| Role | Owns |
|---|---|
| Director | `storyboard.py`, `storyboard.md` (chapters, lines, one picture description per shot, tone notes) |
| Visual director | `web/lib.js` (extend only), `web/sets.js`, `web/props.js`, `web/sheet.js`, `cast_sheet.png` |
| Scene builders | `web/shots_<chapter>.js` (one file per chapter group) |
| Cameraman | `web/engine.js` camera code, `web/cams.js` (per-shot camera overrides: cams/focus/push/shakes/moves) |
| Critic | read-only; writes `review/<chapter>.md` verdicts (PASS / FIX list) |
| Orchestrator | `align.py`, `build_timeline.py`, `index.html`, `mix.py`, `make_video.sh`, git |

## Quality gate (the critic's checklist)
1. Does the picture say what the narrator is saying *at that word*? Key actions land on the spoken word.
2. Composition: one clear subject, nothing cropped by the camera, no overlapping labels, text legible at phone size.
3. Character on-model with the bible; expressions match the beat; continuity of costumes, crate, truck, clock times.
4. Period and truth rules above. No invented facts.
5. Variety: no two neighbouring shots with the same layout; at least one camera move per shot; holds under 3.3 s.
6. Craft: no jaggy/unfilled shapes, no debug text, no "MISSING", no console errors.
