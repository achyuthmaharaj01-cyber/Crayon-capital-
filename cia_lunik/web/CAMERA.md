# Camera, transitions and finishing: API for scene builders and cams.js

All fields are optional. Existing fields (`focus`, `cams`, `push`, `shakes`) behave exactly as before.

## Framing (unchanged)
- `focus: [x, y, z]`: the target framing. `cams: [[x,y,z], ...]` cycles per sub-piece of a split shot.
- The auto-framer still guarantees every registered person or prop is either fully in frame or fully out. It does this at the start **and** the end of the move, by nudging x/y, then lowering z, then shrinking the push. Unregistered drawing such as planets, backgrounds and big labels is not protected, so frame those by hand.

## `move`: one per shot, or `moves: [...]` with one per sub-piece
| move | what it does | notes |
|---|---|---|
| `'push'` (default) | slow dolly-in, `push` amount (default .065), with a drift of 22 px sideways and 8 px up | Fast off the cut, then settles (decelerating). The drift direction alternates per sub-piece. |
| `'pull'` | reverse of push: starts tight, eases out to the framing | Use it for reveals. The default amount is .09, overridden by `push`. |
| `['pan', [x0,y0,z0], [x1,y1,z1]]` | lateral track from A to B over the whole piece | Eased in and out. Each end is auto-framed on its own. |
| `['tilt', [x,y0,z], [x,y1,z]]` | same as pan, vertical | |
| `'drift'` | slow, linear float (.025 push, 30 px sideways) | For quiet, tense holds. |
| `'hold'` | locked off | Still gets the micro-roll. Pair it with `handheld`. |
| `['snap', 'word', zoom=1.28, [x,y]?]` | holds near-still, then punches in on the spoken word (0.32 s, quartic ease-out) towards [x,y] | Gets an automatic soft whoosh on the word. Punch-in is deliberate cropping: aim [x,y] at the subject. |
| `['rack', 'word', [x0,y0,z0], [x1,y1,z1]]` | holds on A, then on the word moves to B over 0.8 s | With `null` for the word, it moves at mid-shot. |

`word` is any cue the shot's line can match (same rules as `T.at`), including number variants such as `['20','twenty']`.

## `handheld: true | number`
Subtle operator breathing made of layered low-frequency sines: about 3 px and about 0.2 degrees, with no visible loop. A number scales it, so 0.6 is calmer and 1.5 is tenser. Use it on tense night shots only: the yard, the roof, the turn-off, the blackout. It adds on top of any move. `shakes` (impacts) work as before.

## `trans`: how this shot is entered
- `'cut'`: the default inside a chapter.
- `'dip'`: 0.22 s to black at the end of the previous shot, then 0.32 s up from black. Applied **automatically at every chapter boundary**, detected when the line prefix changes (C, R, T, F, ...), so builders do not need to set it.
- `'fade'`: a 0.45 s cross-dissolve from the previous shot's last moment. Use it for time passing ("hours later", clock jumps).

## Sound behaviour tied to the camera
- **No whoosh on plain cuts:** the cutting is documentary-style. Set `whoosh: true` on a shot to get one on its cut.
- **Snap moves:** each `snap` move adds a soft whoosh on its word.
- **Chapter cards:** a low hit, plus typewriter ticks in time with the typed title.
- **Black cards:** a tick per word, as before.

## Cards
`chapterCard(c, T, n, title)` is a case-file style card: a navy/teal room with a warm desk-lamp pool, the header "CASE FILE · 1959", the chapter number in amber, and thin rules that draw outward. The title is typed at 22 letters a second, starting at 0.28 s, with an amber cursor only while typing. Long titles shrink to fit. Use it through `chap(key, 'CHAPTER 2', 'The Space Race')`.

## Finishing (`post.js`)
- **When it runs:** `window.POST(ctx, T, shot)` runs after the vignette on every frame, cards included.
- **Grain:** soft-light film grain from 4 pre-generated tiles, changing at 24 fps. Its strength is .085.
- **Per-shot grain:** `grain: 0` turns it off for a shot, and `grain: .12` makes it heavier, for example on archival or flashback looks.
- **Weave:** `weave: true` adds a 1 px gate weave. It is opt-in because it wobbles lettering.

## cams.js (cameraman's pass)
It loads after all shot files. It overrides camera fields only and never touches `draw`:
```js
cam('N5.0', { move: ['snap', 'froze', 1.35, [980, 600]], handheld: 1.2 });
```
