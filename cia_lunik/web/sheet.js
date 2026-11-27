// Sheets for the visual director's review: castSheet(), propsSheet(), setsSheet(i)
window.castSheet = () => {
  const c = ctx; c.setTransform(1, 0, 0, 1, 0, 0); SET.paper(c, 0);
  label(c, 'CAST: THE LUNIK HEIST', 960, 52, 56, '#fff');
  const row1 = [['driver', 'neutral', 'idle', 'THE DRIVER'], ['newdriver', 'smug', 'idle', 'NEW DRIVER'], ['scott', 'neutral', 'point', 'SCOTT'], ['silveti', 'smug', 'hips', 'SILVETI'], ['finer', 'focus', 'idle', 'FINER'], ['dean', 'neutral', 'idle', 'DEAN'], ['zambernardi', 'worried', 'shush', 'ZAMBERNARDI']];
  row1.forEach(([n, e, p, lab], i) => { const X = 150 + i * 270; P(n, { x: X, y: 500, s: .85, expr: e, pose: p, t: 1.4 }); label(c, lab, X, 540, 30, '#fff', { maxW: 250 }); });
  const row2 = [['kolomyakov', 'stern', 'handsBack', 'KOLOMYAKOV'], ['checker', 'neutral', 'clipboard', 'CHECKER'], ['guard', 'stern', 'idle', 'GUARD'], ['spec1', 'grin', 'wrench', 'SPECIALIST'], ['spec2', 'worried', 'crouch', 'SPECIALIST'], ['spec3', 'neutral', 'carry', 'SPECIALIST'], ['radioman', 'focus', 'radio', 'RADIO'], ['analyst2', 'shock', 'armsUp', 'ANALYST']];
  row2.forEach(([n, e, p, lab], i) => { const X = 130 + i * 237; P(n, { x: X, y: 960, s: .78, expr: e, pose: p, t: 2.1,
    item: p === 'clipboard' ? (cc, h) => clipboard(cc, (h[0][0] + h[1][0]) / 2 + 20, (h[0][1] + h[1][1]) / 2 - 20, 120, 150, ['LOG']) : p === 'carry' ? (cc, h) => plank(cc, 0, h[0][1] + 6, 220) : p === 'wrench' ? (cc, h) => wrench(cc, h[1][0] + 40, h[1][1], .55, -.4) : p === 'radio' ? (cc, h) => box(cc, h[1][0] - 22, h[1][1] - 30, 44, 70, 8, '#2b2f36') : null });
    label(c, lab, X, 1000, 28, '#fff', { maxW: 220 }); });
  vignette(c, .25);
};
window.propsSheet = () => {
  const c = ctx; c.setTransform(1, 0, 0, 1, 0, 0); SET.grid(c, 0);
  label(c, 'PROPS', 960, 48, 52, '#fff');
  lunik(c, 470, 210, 640, { glint: 1 }); label(c, 'LUNIK (EXHIBIT PAINT)', 470, 320, 24, '#fff');
  lunik(c, 1300, 210, 640, { blueprint: true, labels: true }); label(c, 'BLUEPRINT CUTAWAY', 1300, 340, 24, '#fff');
  truck59(c, 600, 600, .62, { crate: { state: 'closed' }, driver: 'driver', lights: true }); car59(c, 1080, 600, .55, { col: '#2f3e52', driver: 'dean', lights: true }); crate(c, 1540, 600, 420, { planks: .45, tarp: 0 });
  pressCamera(c, 120, 760, .7, { flash: .3 }); filmCanister(c, 240, 800, .9, { label: 'TEST' }); seal(c, 360, 760, .8); seal(c, 360, 830, .8, { cut: true, keepSeal: true }); couplingBag(c, 520, 860, .6, { open: true, tag: 'WASHINGTON' });
  dossier(c, 790, 820, 330, { who: 'silveti', name: 'E. DÍAZ SILVETI', role: ['MEXICAN SECRET POLICE', 'AGE 30'], source: 'PER MAYSH', stamp: 'CLASSIFIED' });
  mapMexico(c, 1105, 800, 300, 194, { p: 1, night: true, showTexas: true }); manifest(c, 1370, 840, 200, 240, { hl: 1, title: 'MANIFEST' });
  sputnik(c, 1540, 760, 26, 1, { beep: 1 }); lunaProbe(c, 1650, 760, 26, 1, 1); lunaProbe(c, 1740, 760, 24, 3, 1); pioneer4(c, 1840, 780, .5); moon(c, 1580, 920, 60, { far: true }); earth(c, 1720, 920, 56, 1); launchRocket(c, 1860, 1040, .3, { fire: 1, t: 1 });
  nightClock(c, 1250, 120, 0, 0, 0, { label: false }); sodiumLamp(c, 40, 640, 220, 1); toolCloth(c, 230, 1000, 340); usFlag(c, 1000, 960, 80, 1); typewriter(c, 960, 1060, .3); rotaryPhone(c, 1060, 1060, .35); roomKey(c, 1120, 990, .5);
};
window.setsSheet = (i = 0) => {
  const c = ctx; c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = '#111'; c.fillRect(0, 0, W, H);
  const names = i === 0 ? ['nightStreet', 'exhibitHall', 'hallNight', 'embassyOffice', 'port', 'railYard'] : ['salvageYard', 'space', 'washington', 'grid', 'desk', 'darkroom'];
  const opts = { nightStreet: { turnoff: true, traffic: 1 }, railYard: {}, salvageYard: { lamps: 1, drop: 1 }, port: { crane: .6 }, space: { earth: [400, 700, 220], moon: [1500, 300, 140] }, grid: { title: 'LUNIK / UPPER STAGE' } };
  names.forEach((n, k) => { const cx = (k % 3) * 640 + 2, cy = 120 + Math.floor(k / 3) * 440; c.save(); c.beginPath(); c.rect(cx, cy, 636, 358); c.clip(); c.translate(cx, cy); c.scale(1 / 3.01, 1 / 3.01); 
    const L = SET[n](c, 1.3, opts[n] || {});
    if (n === 'salvageYard') { truck59(c, 900, 900, .9, { crate: { planks: .3 } }); P('finer', { x: 1400, y: 960, s: .9, pose: 'photograph', expr: 'focus', t: 1 }); }
    if (n === 'nightStreet') truck59(c, 900, 960, .9, { crate: true, lights: true, driver: 'driver' });
    if (n === 'hallNight') { lunikExhibit(c, 960, 820, 700, { t: 1 }); P('guard', { x: 400, y: 900, s: .8, t: 1, expr: 'stern' }); }
    if (n === 'exhibitHall') lunikExhibit(c, 960, 820, 700, { t: 1 });
    if (n === 'embassyOffice') { P('scott', { x: 900, y: 900, s: .9, pose: 'point', t: 1 }); P('silveti', { x: 1450, y: 900, s: .9, flip: true, expr: 'worried', t: 1 }); }
    if (n === 'railYard') P('checker', { x: 700, y: 980, s: .9, pose: 'clipboard', t: 1, item: (cc, h) => clipboard(cc, (h[0][0] + h[1][0]) / 2 + 20, (h[0][1] + h[1][1]) / 2 - 20, 120, 150, ['LOG']) });
    if (n === 'washington') P('analyst2', { x: 960, y: 1000, s: .9, pose: 'hold', t: 1, expr: 'grin' });
    if (n === 'grid') lunik(c, 960, 520, 1300, { blueprint: true, labels: true });
    if (n === 'desk') { dossier(c, 800, 520, 640, { who: 'finer', name: 'SYDNEY WESLEY FINER', role: ['FACTORY MARKINGS', 'AGE 29, RUSSIAN SPEAKER'], source: "FINER'S REPORT", stamp: 'CLASSIFIED' }); }
    if (!['exhibitHall', 'embassyOffice', 'washington', 'grid', 'desk', 'darkroom', 'space'].includes(n)) GRADE.night(c, L);
    c.restore(); label(c, n, cx + 318, cy + 390, 30, '#fff'); });
};
