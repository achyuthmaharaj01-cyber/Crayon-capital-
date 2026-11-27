# Visual kit: the Lunik heist (API for scene builders)

Load order: lib.js, timeline.js, engine.js, sets.js, props.js, shots*.js, sheet.js. Canvas is 1920x1080, ink `INK`, line width `LW`.
Sheets: `cast_sheet.png`, `props_sheet.png`, `sets_sheet.png`, `sets_sheet_2.png` (render with `node snap.js out.png "castSheet()"` / `propsSheet()` / `setsSheet(0|1)`).
Shot helpers carried over from gta6_moves: `S(key, def)`, `card(key, text)`, `chap(key, n, title)`, `num(T, cue, to, dur)`, `pop(T, word)`, `arrive(c, p, x, y, f)`.

## Recipe for a night shot
```js
S('K.0', { draw(c, T) {
  const L = SET.salvageYard(c, T.t, { lamps: 1 });       // sets return their lights
  truck59(c, 900, 960, .9, { crate: { planks: .3 } });
  P('finer', { x: 1400, y: 960, s: .9, pose: 'photograph', expr: 'focus', t: T.t, flash: T.at('flash', .5) });
  GRADE.night(c, L);                                      // ALWAYS last, so people sit in the night
}, overlay: (c, T) => nightClockOverlay(c, 19, 30, { sub: 'SALVAGE YARD' }) });
```
Day/interior sets (exhibitHall, embassyOffice, washington, grid, paper, desk, darkroom, space) do not need GRADE.night.

## Characters: `P(name, opts)` (crayon build: same bean body, round head, five faces as the bible)
Returns `{lh, rh, head}` world positions. `y` is the feet line. Scale `s` ~ .8-1.2 for a full figure; heads are ~300*s above feet.
Names: `driver` (Mexican truck driver, blue work cap, moustache), `newdriver` (CIA man, flat cap), `scott` (station chief: grey suit, bow tie, glasses, grey hair),
`silveti` (dark suit, slick hair, moustache), `finer` (shirt sleeves rolled, glasses, loose tie), `spec1` `spec2` `spec3` (the other specialists),
`dean` (tan trench + fedora), `zambernardi` (olive trench + dark fedora, moustache), `kolomyakov` (charcoal coat, fur collar, homburg, stern; `hat:'ushanka'` for winter),
`checker` (Soviet rail checker, peaked cap), `guard` (Soviet guard, ushanka, stern), `radioman` (security/radios, headphones), `analyst`, `analyst2` (Washington),
`visitor1`-`visitor4` (exhibition crowd), `clerkMx` (hotel clerk). `NAMES[key]` gives the on-screen name.
Opts: `x y s t expr pose flip walk item(c,hands,t) sweat talk look hands:[[x,y],[x,y]] legs:'stand'|'crouch'|'sit'|'step' leanBody` and costume overrides
(`hat:'fedora'|'homburg'|'flatcap'|'ushanka'|'peaked'|'workcap'|'headphones'`, `hatCol`, `tache`, `bowtie`, `trench`, `longcoat`, `fur`, `jacket`, `rolled`, `glasses`, `hair:'short'|'slick'|'part'|'curly'|'crew'|'bun'|'grey'|'sides'`).
Expressions: `neutral grin smug worried shock` (bible) + `sad happy bored angry` + new `stern` (flat mouth, hard brows) and `focus` (narrowed eyes).
Poses: bible `idle hips armsUp point hold clipboard shrug wave slump cheer give holdUp phone holdHigh ladder`; new `crouch climb carry sneak photograph (draws press camera; opts.flash 0..1) wrench shush drive (seated + wheel) radio reach handsBack lean`.
Hold things with `item: (c, h) => clipboard(c, (h[0][0]+h[1][0])/2+20, (h[0][1]+h[1][1])/2-20, 120, 150, ['LOG'])` (local coords of the figure).

## Sets: `SET.name(c, t, o)` -> lights[]
- `nightStreet` Mexico City 1959 at night: colonial facades, FARMACIA/CAFÉ signs, 3 sodium lamps. o: `turnoff` (true or text sign), `traffic` (distant headlights), `dusk`, `scroll` (road dash speed for moving shots)
- `road` the last turn-off: perspective road + side road + sign. o: `dusk` 0..1, `sign`
- `exhibitHall` day interior, banner SOVIET EXHIBITION (o.banner), side displays; put `lunikExhibit` centre-floor (y~820)
- `hallNight` same hall closed + spotlight; add `guard`
- `embassyOffice` warm office, blinds, framed Mexico map, desk + lamp + phone. o: `night`, `noDesk`
- `port` Tampico quay at dusk, Soviet freighter, derrick lowering a crate. o: `crane` 0..1, `night`, `stencil`
- `railYard` tracks, boxcars, checker's hut (lit). o: `morning` (7 A.M. version), `noTrain`
- `salvageYard` 10-ft board fence, scrap, street lamps beyond. o: `lamps` 0..1 (the moment the lamps come on), `blackout` 0..1 (4 A.M.), `drop` 0..1 (drop lights on a wire)
- `hotel` corridor with sconces (use `hotelDoor`, `roomKey`)
- `space` stars. o: `earth:[x,y,r]`, `moon:[x,y,r]`, `far`
- `washington` analysts' room: cork board of photos + string, chalkboard (o.board), desk lamps
- `grid` navy blueprint paper. o: `title`, `sub` (title block). `paper` = cream graph paper
- `desk` top-down green blotter (place `dossier`, `photoPrint`, `manifest`, `reportPage`). o: `lx, ly` lamp pool
- `darkroom` red safelight, prints on a line (use `devTray`)
- `black`, `spot` (o.x, o.col)

## Props (all `(c, x, y, size, o)`; bottom-centre unless noted)
- `lunik(c, x, y, L, o)` centred, horizontal, nose right. o: `cutaway` 0..1, `blueprint`, `labels`, `capOff` 0..1 (base cap with ~bolt ring slides left), `sphereOut` 0..1, `seal: 'ok'|'cut'|'new'|'none'`, `glint` (pass T.t), `glow` (window light), `paint:'raw'`, `rot`
- `lunikExhibit(c, x, y, L, o)` on a red pedestal with velvet rope, tilted
- `crate(c, x, y, w, o)` 20-ft crate. o: `planks` 0..1 roof removed, `state:'canvas'` or `canvas` 0..1 (canvas thrown over), `tarp` 0..1 (tarp over open roof), `xray` 0..1 (blueprint Lunik inside), `stencil` text|false
- `plank(c, x, y, w, rot)`, `spike(c, x, y, s, rot)` (5-inch spike)
- `truck59(c, x, y, s, o)` 1950s flatbed, cab right. o: `crate` (true or crate opts), `driver` (cast key), `driverExpr`, `lights`, `moving`, `t`, `tail`, `col`, `flip`
- `car59(c, x, y, s, o)` sedan. o: `col`, `driver`, `lights`, `moving`, `t`, `flip`
- `freightTrain(c, x, y, s, o)` loco right + cars. o: `cars:['box','crate','flat']`, `night`, `t`, `smoke`. `cargoShip(c, x, y, s, o)` o: `crane`, `night`
- Photography: `pressCamera(c,x,y,s,{flash})`, `flashBurst(c,x,y,r,p)`, `flashbulb`, `filmCanister(c,x,y,s,{label})`, `filmStrip(c,x,y,w,n,draw(i,fx,fy,fw,fh),{p,neg,h})`, `photoPrint(c,x,y,w,h,rot,inner,{caption,clip})` (auto B&W), `devTray(c,x,y,w,p,inner)`
- Paper: `dossier(c, x, y, w, {who, expr, name, role (string|array), source, stamp, sp, p, rot})`, `manifest(c,x,y,w,h,{hl, dims, rows, hiRow, title})` (crate line = 'MODELS OF ASTRONOMIC APPARATUS'), `reportPage(c,x,y,w,h,{title, lines, bars:[[row,a,b]], p, stamp})`, `redact(c,x,y,w,h,p)`, `stamp(c,x,y,txt,p,col,{w,h,rot})` (bible), `paper1959(c,x,y,w,h,head,{mast,pic(x,y,w,h)})`, `typewriter`, `rotaryPhone(c,x,y,s,{lifted})`
- Maps: `mapMexico(c, x, y, w, h, {p, night, tampico, city, cityLabel})` returns pin positions; `worldMap(c, x, y, w, h, {stops:[[u,v,'LABEL']], p, hi})` (only label stops the script names)
- Clock: `nightClock(c,x,y,r,hh,mm)` (24h; moon icon at night), `nightClockOverlay(c,hh,mm,{sub,x,y})` (screen space, use in `overlay`), `fmtTime`
- Yard: `sodiumLamp(c,x,y,h,on)`, `woodFence(c,x0,x1,y,h)`, `dropLight(c,x,y,on,cord)`, `ladder(c,x,y,h)`, `rope(c,x1,y1,x2,y2,sag)`, `ropeCoil`, `pinchBar`, `wrench`, `nailPuller`, `toolCloth(c,x,y,w,{n})` (the shopping list, n items), `tarp(c,x,y,w,h)`
- Seal: `seal(c, x, y, s, {cut, fresh, keepSeal})`, `sealStamp(c,x,y,s)`; `couplingBag(c,x,y,s,{open, tag})`
- Exhibition: `pedestal(c,x,y,w,{rope,plaque})`, `hallFacade(c,x,y,w,{banner,name,night})`, `embassyFacade(c,x,y,w,{night,t,name})`, `usFlag`, `hotelDoor(c,x,y,{num,sign})`, `roomKey`
- Space: `moon(c,x,y,r,{far,phase,face})`, `earth(c,x,y,r,t)`, `sputnik(c,x,y,r,t,{beep,rot})`, `lunaProbe(c,x,y,r,n,t)` (n 1/2 sphere, 3 cylinder), `pioneer4(c,x,y,s)`, `launchRocket(c,x,y,s,{fire,t})`, `starfield(c,t)`
- Bible props still available: `clipboard sign calendar clock cornerClock newspaper envelope stopwatch magnifier globe ladder laptop arrow crowd label money lightPool cone vignette`

## Light + finish
- `GRADE.night(c, lights, k=.3)` navy multiply + warm pools; `GRADE.warm(c,k)`, `GRADE.dawn(c,k)` (7 A.M.), `GRADE.flash(c,x,y,p)` (camera flash fills the frame), `GRADE.dark(c,k)` (blackout).
- `grain(c, t, a)` film grain (screen space).
- Colours: Soviet red `#b8322a`, sodium `#ffb04a`, tungsten `#ffd27a`, gold `GOLD`. Never violet. Cyrillic is not in the fonts: write `CCCP` in Latin letters.
