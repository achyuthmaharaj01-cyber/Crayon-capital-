# Crayon Capital — Design Bible (v4)

Reverse-engineered from two reference videos:
- **REF-A** "J.P. Morgan: The Most Powerful Man in America" (16:40, 1280x720, 30 fps)
- **REF-B** "NVIDIA Scandal Explained Like You're 5" (14:30, 1280x720, 30 fps)

Method: contact sheets every 6 s (~310 stills), full-res stills, 6 fps motion strips, 8-frame strips around 12 cuts, ffmpeg scene detection (524 cuts), and pixel palette clustering over 1 frame / 10 s. Everything here is measured or read off those frames. Where we **deliberately depart** from the references, it is marked **⟶ OURS**.

---

## 1. The look in one sentence
Flat 2D "egg-people" cartoons drawn with one uniform near-black ink line on top of dense, muted, fully-furnished rooms lit by warm practical lights. The style is quiet and deadpan, and the jokes land through props, labels and tiny facial changes.

## 2. Line
| Property | Measured | Our spec (1920x1080) |
|---|---|---|
| Ink colour | #0c0c0c to #1e1c1c, never pure black on fills | `INK = #1b1819` |
| Character outline | ~3 px at 720p | **4.6 px** |
| Background outline | same weight as characters (one weight for the whole frame) | **4.6 px**; small detail lines 2.6 px |
| Interior detail (wrinkles, book spines, wood grain) | ~1.5 px, often a darker tint of the fill, not ink | 2.2 px, `shade(fill, -0.35)` |
| Joins / caps | round | round |
| Wobble / boil | none: clean vector lines, no line boil | none |

## 3. Colour
Measured from pixel clusters (share of all pixels):
- **REF-A** (period piece): ink/black 19%, warm browns #543c24 / #3c2424 / #6c543c (wood, furniture) ~15%, greys #3c3c3c–#b4b4b4 (stone, suits) ~14%, cream walls #fce4b4 / #fce4cc, desaturated sky #9ccce4. Mean saturation 57/255.
- **REF-B** (modern): deep navy/indigo night #243c6c / #24243c / #243c54 / #0c243c, slate #546c84, warm wood #543c24 / #b48454, parchment #e4e4cc / #ccccb4. Mean saturation 75/255.
- Both: mean value ~122/255, so the frames are **mid-dark**. Bright colour is held back for accents (brand greens, flag red, money green, lamp gold).

### Palette tokens (ours)
```
ink      #1b1819   paper    #efe6cf   cream wall #f3dfb2   parchment #e6e1c6
wood-d   #3f2a1c   wood     #5a3d26   wood-l     #8a5f3b   wood-hi    #b48454
stone-d  #3a3a3e   stone    #6b6b70   stone-l    #a9a9ad   marble     #d9d6cf
night-1  #141c33   night-2  #22305a   dusk-1     #3c3a62   dusk-2     #8e5f7a  dusk-3 #e7a57a
slate    #546c84   teal-d   #1f3b3b   moss       #4f6b3a   leaf       #6f8f45
skin-1   #f6d7b5   skin-2   #e9bd92   skin-3     #b98058   skin-4     #7e5236
suit-blk #232226   suit-nvy #26324d   suit-brn   #5b4334   shirt      #f4f2ea
accent-red #c8433a accent-gold #e2b13c money #5f9e57  glow #ffd98a
```
Rules: no pure white except eye highlights and subtitle text. No saturated fills over 35% of the frame. One accent per shot.

### Light
- Practical lights (lamps, candles, windows, street lanterns) get a **soft additive glow** (radial, screen blend, 25–45%), and the area under them gets a warm pool.
- Night/dusk exteriors: vertical sky gradient (indigo → mauve → peach), lit windows as flat warm rectangles, a few stars.
- Spotlight cone on black for "a person alone" beats (REF-A 0:18).
- A light **vignette** on every frame (REF-B especially).

### Texture
REF-B fills carry a faint paper/grain texture and the walls show soft gradients. **Spec:** a full-frame monochrome grain at 4% (static per shot, so it does not crawl), plus a gentle top-to-bottom gradient on large wall fills.

## 4. Characters ("egg-people")
Proportions in head-radius units (r):

| Part | Spec |
|---|---|
| Head | Perfect circle, radius **r**. It floats: no neck, and its bottom edge sits on or just over the top of the body. |
| Body | Egg/bullet shape, width ≈ **1.75 r**, height ≈ **2.4 r**, narrow rounded top, wide rounded bottom. Clothing is *painted on*: jacket fill, white shirt V, tie, lapel lines, button dots. |
| Arms | **One ink line** (same 4.6 px weight), from the body side at ~30% down. Gentle curve, length ≈ 1.4 r, no hands, a rounded line end. Holding something: the line ends on the object. Usually hangs at the sides, half hidden. |
| Legs | **Two ink lines**, length ≈ 1.1 r, spaced ~0.45 r, no feet (tiny forward tick allowed). |
| Shading | Head: soft darker crescent on the side away from the key light (fill × 0.88). Body: same crescent. No highlights except a white glint on glasses. |
| Face | Small **vertical-oval dot eyes** (0.07 r × 0.10 r) at y ≈ −0.02 r, spacing ±0.30 r. **Short dash brows**, angle carries emotion. Mouth: small arc or line. Nose: usually none; a "named" character may have a small pink/brown nose blob. Age: 2–3 curved forehead wrinkles, cheek lines, white side hair. |
| Hair | Shapes clipped to the head circle: side-part cap, grey swept hair with inner strokes, white side tufts (old men), bun, long hair falling behind the body. |
| Hats | Top hat, bowler: drawn last, sitting on the head and slightly tilted. |
| Extras / crowd | Same rig with a **blank face** (no features), light grey #cfcfd2 or white head; this keeps the eye on named characters. |
| Glasses | Thin rectangular frames, ink 3 px, with a white glint. |
| Teeth (grin) | Mouth is a closed lip shape (upper lip curve + lower lip curve). Fill it off-white, **clip to the mouth shape**, then draw the tooth lines (1.5 px, warm grey `#9c948a`, never ink-black): one horizontal gum line and 4–5 verticals. Re-ink the lip outline **on top** (3.2 px). Tooth lines must never cross or poke past the lip line. |

### Personality through minimal means
- **Protagonist**: neutral-serious resting face, slightly lowered brows; the expression changes on the key word only.
- **Elder / authority**: angled brows, wrinkles, downturned mouth, slow blinks.
- **Villain / schemer**: grin showing teeth (white band with ink tooth lines), narrowed eyes, brows angled in.
- **Comic beat**: a tiny reaction (sweat drop, "?" marks, wide oval eyes) instead of big body acting.

### Acting and motion (from the 6 fps strips)
- Mostly **limited animation**: bodies are held still, faces change, arms swing on emphasis, props pop in.
- Mouth flaps while a character "speaks" (subtitle or bubble present), 2–3 shapes.
- Blinks every 3–5 s, 2 frames closed.
- Walks are scissor steps of the two leg lines with a 2–3 px body bob.
- Props: thrown objects arc in, bags drop and squash, papers slide.
- **⟶ OURS (improvements)**: add **idle breathing** (body scale-Y 1.0 → 1.012, 3.2 s), **secondary motion** (tie and hair lag 2 frames), **anticipation** before arm raises (5% dip), ease-out arrivals with no overshoot on props, and **lip sync from the voice envelope** instead of a sine flap.

## 5. Sets and props
- **Dense, believable rooms**: wainscoting panels, bookshelves with varied coloured spines, framed pictures, curtains with folds, lamps, rugs, flags, windows with a city at night.
- Perspective: simple one-point; floor planes slightly tilted. The camera sits at eye level or a little above.
- Labels on props tell the joke: "U.S. ECONOMY" on a temple, "CLASSIFIED" folder, name plates, "No. 2" desk sign.
- Exteriors: building facades straight-on, sky gradient, small trees as clustered blobs, parked cars as simple side views.

## 6. Typography
| Use | Look | Our font |
|---|---|---|
| Narration subtitles | White handwritten italic, mid-low screen, soft dark drop shadow | Caveat 700, 58 px, shadow 0 3px 10px rgba(0,0,0,.55) |
| Date/place card | Top-left, same hand, larger ("Washington, 2022") | Caveat 700, 76 px |
| Name call-out | Hand-lettered name + curved arrow pointing at the character | Caveat 700, 60 px + 4.6 px arrow |
| Speech bubble | White rounded rectangle, ink border, small tail | Caveat 700, 46 px dark |
| Signage / props | Hand-drawn caps | Kalam 700 |
| Black text card | White hand script centred on pure black, word by word | Caveat 700, 96 px |

## 7. Camera and editing
Measured shot lengths: **REF-A** median 4.1 s (p10 1.9 s, p90 7.7 s), 210 shots; **REF-B** median 2.6 s (p10 1.5 s, p90 4.2 s), 314 shots. Both use **hard cuts** almost everywhere, a slow 3–5% push on most shots, an occasional pan across a wide set, and short black text cards.

### ⟶ OURS: transitions are chosen by what the scene is doing
Instant cuts are allowed only when they are the joke or the beat: **jump** (to punch in) and **smash** (for the punchline). Everything else moves. Each transition lives in `web/transitions.js` as `TRANS.<name>`. A shot picks one with `out: { type, d, ... }`, and it fires on a spoken word.

| Type (`TRANS.*`) | What it does | Use it when | Tulip Mania |
|---|---|---|---|
| `cut` | Instant switch | Rarely, when a beat needs a dry beat | (in library) |
| `jump` | Same scene, framing jumps tighter, then settles over 0.2 s | Several people talking: punch in on the key word | gossip, on "talking" |
| `smash` | Hard cut with a white flash, a camera kick and a decaying shake | The punchline or a reveal | bulb → **onion** |
| `match` | Ease into shape A, hold A and B in register through the blend, ease out of B | Two shapes rhyme (bulb ↔ bulb, face ↔ face) | bubble bulb → stage bulb |
| `morph` | 0.35 s blend while each camera eases toward the other | Hiding a cut between two near-identical framings | chalkboard, on "then" |
| `dip` (`col`) | Dip to black or white | Mood or time shift. White = cold or clean, black = ending | chart → winter (white) |
| `dissolve` | Cross dissolve | Soft passage of time | (in library) |
| `additive` | Film dissolve: the two images add, so the middle blooms | A warm "coming back" moment | collage → final bench |
| `whip` | Side-by-side pan with blur capped at 170 px | Energy, "meanwhile", going out into the world | home → town |
| `crossZoom` | Radial zoom blur in, arrives from the same rush | Diving into a detail or a number | bulb → the scale |
| `slide` / `push` | B slides over A / B pushes A out | Lists, "next", side-by-side ideas | (in library) |
| `windowPush` | Fly into a window or frame; B lands exactly full-frame | Entering a building or a screen | street → Pieter's room |
| `wipe` (`shape: line/barn/clock`) | Line wipe with an ink edge, barn doors, or a clock sweep | `clock` = hours pass. `barn` = a reveal. `line` = a neutral move | winter: the hours of waiting (clock) |
| `iris` (`shape: circle/diamond/box`) | Shape closes A and opens B | Chapter ends, a spotlight on one subject | final iris on Pieter |
| `pageTurn` | The frame peels from a corner like a book page | "So…", a new chapter of the story | scale → the sale |
| `passing` | A big blurred foreground passer-by crosses the lens; B is revealed behind them | Changing angle within a busy street scene | the sale → the trader |
| `glitch` | Pixelate + RGB split + slipping slices | Something breaks: a crash, a hack, a lie | winter → "Overnight" (the crash) |
| `lightLeak` | Warm film flare and edge burn sweep across under a dissolve | Euphoria, nostalgia, success | the sale → "he is a genius" |
| `paperTear` | Frame tears down a jagged line; the halves fall away | Collapse, the story breaking | onion → the bench |
| `handDrawn` | B is painted in with ink-brush zigzags led by a nib | Recaps, notes, "the lesson" | bench → collage |
| `split` + `panel()` | Split screen / collage: any shot rendered into a panel or a pinned photo | Showing two things at once, or a recap | "a loyal dog" split; the recap collage |

Rules:
1. Never use the same transition twice in a row, and never more than three times in a video, except `match` and `jump`.
2. Camera motion carries through (the outgoing direction = the incoming direction) for `whip`, `push`, `slide`, `crossZoom`, `windowPush` and `match`.
3. Big effect transitions (`glitch`, `smash`, `lightLeak`, `paperTear`) carry meaning; at most one per minute of video.
4. Every transition gets its own sound (whoosh, page, paper, tick, glitch burst, hit).
5. **Render at 60 fps.** Camera tracking stays exactly as designed (keyed framings eased together plus a slow push and drift); 60 fps doubles the motion samples so pans, pushes and whips read smooth.

## 8. Sound
Voice first. Music bed ~20 dB under the voice and ducked during speech. Soft whooshes on whips and pushes, pops on prop arrivals, room tone in interiors. Final mix at −14 LUFS with a −1 dBFS ceiling.

## 9. Quality gate (run on every render)
1. Contact sheet of every shot, plus 9-frame strips across **every transition**.
2. Check: nothing important is clipped by the frame edge, subtitles never sit on a face, every character has a readable silhouette, at most one accent colour, and no frame is static for over 0.5 s.
3. Log what failed in §10 and fix it in the engine (not per shot), so the next video starts better.

## 10. Generation log (improve every generation)
| Gen | What changed | Why |
|---|---|---|
| v1 | Bible, egg-people rig, sets, transition compositor, word-keyed shots | first build |
| v2 | Cameras ~1.5x tighter (characters now 45–60% of frame height); date card hides its duplicate subtitle; pot arrives *with* the trader; scale counts to 10; chart label moved off the title; chalk smudge cut to 3.5% | gen-1 stills: characters at ~30% of frame read as tiny next to the refs |
| v3 | **Match cut** now eases into anchor A, holds both shapes in register for the blend, then eases out of anchor B (was crossfading mid-move = ghosting). **Push-through** maps the next shot to the window's width so it lands exactly full-frame (no fade). **Whip** is a true side-by-side pan with blur capped at 170 px (was a grey smear for ~6 frames). Chart→winter time-skip uses a dissolve. Subtitles get a soft dark stroke so they read on snow | gen-2 transition strips |
| v3 result | `out/tulip_mania_v1.mp4` 50.7 s 1080p30. ffmpeg scene detection: **0 hard cuts** (max frame-to-frame score 0.145; threshold 0.25; refs had 210 and 314). −14.0 LUFS | |
| v4 | Teeth clipped inside the lip line (rule in §4). Transition library: 21 types in `web/transitions.js`, chosen by scene (table in §7); split screen and photo collage via `panel()`. Render at **60 fps**. Fixed a v1 cue bug (`cue('L4','one',1)` never existed, so the pot handoff fired at line start). Mixer: fade length clamps to short effects | user notes on v3 |
| v4 result | `out/tulip_mania_v2.mp4` 50.7 s, 1080p, **60 fps**, 17 shots, 16 transitions of 15 kinds, −14.0 LUFS | |
| next | Chart labels should pop when the line reaches the point, not on the word; make the "missing buyer" ghost outline stronger; add a foreground-wipe transition type; add room tone | v3 review |
