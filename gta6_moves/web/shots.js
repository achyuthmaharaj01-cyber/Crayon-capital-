// ---------- one draw function per shot; every animation keyed to a word the narrator says ----------
// Direction (unslop / impeccable / taste-skill): one bright subject per frame, quiet dressed set, one accent per set,
// plain copy on signs, one number format ($3.79B, 93,000,000), decelerating arrivals, no reflexive bounce.
const pop = (T, w, d = .45, nth) => (nth != null ? clamp(T.sinceN(w, nth) / d) : T.at(w, d));   // 0..1 arrival on a word
const arrive = (c, p, x, y, f) => { if (p <= 0) return; c.save(); c.translate(x, y + (1 - back(p)) * 40); c.globalAlpha = clamp(p * 2); f(); c.restore(); };
const tinyCrowd = (c, x, y, cols, rows, gap, lit, t) => { for (let r = 0; r < rows; r++) for (let i = 0; i < cols; i++) { const k = r * cols + i, on = k < lit; const px = x + i * gap, py = y + r * gap * 1.2; ell(c, px, py, gap * .3, gap * .36, on ? '#1faa55' : '#c9cfd6', 2.5); circ(c, px, py - gap * .46, gap * .2, on ? '#f2c49b' : '#e3e6ea', 2.5); } };

// ======================= COLD OPEN =======================
S('O1.0', { focus: [760, 560, 1.2], sfx: [['crowdtalk', 0, -18]], draw(c, T) {
  SET.night(c, T.t); storefront(c, 760, 900, T.t, 'MIDNIGHT LAUNCH'); calendar(c, 1460, 330, 240, 230, 'NOV', '19', { circle: T.at('november', .6) });
  crowd(c, 960, 990, 1800, 2, 1.1, T.t, 3, { cheer: true, faces: true });
} });
S('O1.1', { focus: [960, 520, 1.15], sfx: [['hit', 'avengers', -12]], draw(c, T) {
  SET.spot(c, T.t); const p = easeOut(T.at('one', 1.2));
  balance(c, 960, 940, lerp(.05, .32, p), (x, y) => { gameBox(c, x, y, 150, 210, {}); label(c, '1 DAY', x, y - 260, 40, GOLD, { glow: GOLD }); },
    (x, y) => { filmReel(c, x, y - 110, 90, T.since('avengers') > 0 ? 'shock' : 'neutral', T.t); label(c, 'ENTIRE RUN', x, y - 250, 40, '#fff'); });
  label(c, 'BIGGEST MOVIE EVER', 1320, 130, 34, '#c9d6ff', { stroke: false });
} });
S('O2.0', { focus: [960, 420, 1.25], shakes: [['79']], sfx: [['ding', '79'], ['coins', 'billion', -12]], draw(c, T) {
  SET.night(c, T.t); billboard(c, 960, 380, 1100, 360, () => { money(c, B2(num(T, ['3', '79'], 3.79, 1.1)), 960, 350, 170, 'gold', { maxW: 980 }); label(c, 'SPENT ON ONE GAME', 960, 480, 46, '#fff'); });
  P('fan', { x: 330, y: 1010, s: .85, t: T.t, expr: T.since('79') > 0 ? 'shock' : 'grin', pose: 'cheer' }); P('investor', { x: 1600, y: 1010, s: .85, t: T.t, expr: 'grin', pose: 'point', flip: true });
} });
S('O2.1', { focus: [960, 480, 1.25], sfx: [['clock', 0, -16, { len: 2 }]], draw(c, T) {
  SET.office(c, T.t, { night: 1, wall: '#2a2f45' }); clock(c, 960, 420, 230, T.lt * 8, (T.lt * 480) % 60); label(c, '24 HOURS', 960, 720, 70, '#fff');
  coinPile(c, 960, 1000, 900, lerp(60, 200, T.p), 7);
} });
S('O3.0', { focus: [1100, 460, 1.25], overlay: (c, T) => cornerClock(c, 8, 0, '8:00 AM'), draw(c, T) {
  SET.street(c, T.t, { noHQ: true }); box(c, 900, 520, 520, 380, 6, '#a9c4dd'); for (let y = 560; y < 860; y += 70) for (let x = 930; x < 1380; x += 80) windowRect(c, x, y, 44, 44, '#e8f6ff');
  P('analyst', { x: 1020, y: 520, s: .7, t: T.t, expr: 'neutral', pose: 'hold' }); telescope(c, 1140, 400, .9);
  sign(c, 1160, 470, 300, 60, 'SENSOR TOWER', { bg: '#1d3557', fg: '#fff', size: 34 });
} });
S('O3.1', { focus: [960, 520, 1.3], sfx: [['ding', ['1', '84']]], draw(c, T) {
  SET.office(c, T.t); P('analyst', { x: 700, y: 1000, s: 1.1, t: T.t, expr: 'grin', pose: 'clipboard', item: (cc, h) => clipboard(cc, (h[0][0] + h[1][0]) / 2 + 20, (h[0][1] + h[1][1]) / 2 - 20, 150, 180, ['GUESS']) });
  const p = pop(T, ['1', '84']); arrive(c, p, 1300, 470, () => { clipboard(c, 0, 0, 440, 400, ['SENSOR TOWER', 'DAY ONE ESTIMATE', '$1.84B'], { col: [INK, INK, '#1d6fb8'] }); });
} });
S('O4.0', { focus: [900, 520, 1.2], sfx: [['inflate', 'double', -12]], draw(c, T) {
  SET.grid(c, T.t); const g = easeOut(clamp(T.since('double') / 1.2));
  box(c, 460, 900 - 280, 260, 280, 8, '#9ec5e8'); label(c, 'ESTIMATE', 590, 940, 38, INK, { stroke: false }); label(c, '$1.84B', 590, 580, 50, INK, { stroke: false });
  const h = lerp(280, 578, g); box(c, 900, 900 - h, 260, h, 8, '#e0b13e'); label(c, 'REAL', 1030, 940, 38, INK, { stroke: false }); if (g > .9) money(c, '$3.79B', 1030, 900 - h - 50, 60, 'gain');
  c.save(); c.setLineDash([14, 10]); line(c, 420, 620, 1220, 620, 4, '#8a8f98'); c.restore(); label(c, '2X', 1360, 460, 120 * clamp(g * 1.2), INK, { stroke: false });
} });
S('O4.1', { focus: [960, 520, 1.25], shakes: [['wrong']], sfx: [['stamp', 'wrong', -4]], draw(c, T) {
  SET.office(c, T.t); P('analyst', { x: 640, y: 1000, s: 1.1, t: T.t, expr: T.since('wrong') > 0 ? 'shock' : 'worried', pose: 'armsUp', sweat: true });
  clipboard(c, 1260, 480, 420, 400, ['ESTIMATE', '$1.84B'], { col: [INK, '#1d6fb8'] }); stamp(c, 1260, 520, 'MISSED BY 2X', T.at('wrong', .35), RED, { w: 420, h: 110 });
} });
S('O5.0', { focus: [960, 600, 1.3], sfx: [['paper', 'three', -10]], draw(c, T) {
  SET.spot(c, T.t); box(c, 420, 760, 1080, 40, 12, '#6d4c41'); line(c, 500, 800, 500, 940, 12); line(c, 1420, 800, 1420, 940, 12);
  [0, 1, 2].forEach(i => arrive(c, clamp((T.lt - .15) / .4 - i * .45), 620 + i * 340, 680, () => envelope3(c, 0, 0, 240, i + 1)));
} });
card('O6.0', 'How did Rockstar actually pull this off?');
card('O7.0', 'Is $3.79 billion even real, and how much of it do they keep?');
S('O8.0', { focus: [960, 560, 1.3], draw(c, T) {
  SET.kitchen(c, T.t); box(c, 560, 700, 800, 26, 8, '#8d6e63'); line(c, 600, 726, 600, 900, 10); line(c, 1320, 726, 1320, 900, 10);
  P('solo', { x: 760, y: 1000, s: 1.05, t: T.t, expr: 'grin', pose: 'idle' }); laptop(c, 1080, 700, .9, () => { c.fillStyle = '#e8f3ff'; c.fillRect(0, 0, W, H); for (let i = 0; i < 4; i++) line(c, 990, 540 + i * 30, 1160 - i * 20, 540 + i * 30, 6, '#9ab'); });
  box(c, 1240, 640, 60, 60, 10, '#e76f51'); label(c, 'ONE PERSON', 960, 180, 54, '#fff');
} });
S('O9.0', { focus: [960, 520, 1.2], sfx: [['pop', 'five', -10]], draw(c, T) {
  SET.grid(c, T.t); [0, 1, 2, 3, 4].forEach(i => arrive(c, clamp(T.since('five') / .35 - i * .3), 400 + i * 280, 520, () => tile(c, 0, 0, 220, i + 1, false)));
  label(c, 'FIVE MOVES', 960, 220, 70, INK, { stroke: false });
} });
S('O10.0', { focus: [1520, 520, 1.3], sfx: [['ding', 'fifth', -8]], draw(c, T) {
  SET.spot(c, T.t, { x: 1520 }); [0, 1, 2, 3].forEach(i => tile(c, 360 + i * 260, 560, 200, i + 1, false)); tile(c, 1520, 520, 260, 5, T.since('fifth') > 0);
  label(c, 'THE REAL MONEY', 1520, 260, 48, GOLD, { glow: GOLD });
} });
S('O10.1', { focus: [960, 560, 1.2], draw(c, T) {
  SET.spot(c, T.t, { x: 1600 }); [0, 1, 2, 3].forEach(i => tile(c, 260 + i * 230, 360, 180, i + 1, false)); tile(c, 1620, 420, 200, 5, true);
  crowd(c, 640, 900, 1000, 2, 1.1, T.t, 5, { faces: true }); label(c, 'NOBODY LOOKING', 1620, 720, 40, '#fff');
} });

// ======================= MOVE 1: THE THIRTEEN-YEAR AD =======================
chap('M1a.0', 'MOVE ONE', 'The Thirteen-Year Ad');
S('M1a.1', { focus: [960, 540, 1.08], draw(c, T) {
  SET.street(c, T.t, { hq: 'ROCKSTAR STUDIO' }); for (let y = 260; y < 800; y += 90) for (let x = 720; x < 1200; x += 90) box(c, x, y, 56, 60, 4, '#c9b99a', 3);
  sign(c, 960, 700, 220, 70, 'QUIET', { bg: '#fff', size: 40 }); label(c, 'Z', 790, 150 - (T.lt * 20) % 40, 30, '#fff'); label(c, 'Z', 1170, 140 - (T.lt * 24) % 40, 26, '#fff');
} });
S('M1b.0', { focus: [960, 520, 1.25], sfx: [['page', 'september', -10]], draw(c, T) {
  SET.office(c, T.t); calendar(c, 640, 430, 340, 340, 'SEPT', '2013'); gameBox(c, 1240, 860, 300, 420, { title: 'GTA V' }); lightPool(c, 1240, 600, 400, '#fff2b0', .4);
} });
S('M1b.1', { focus: [960, 520, 1.25], draw(c, T) {
  SET.store(c, T.t, { sign: 'CONSOLES' }); box(c, 760, 740, 400, 60, 8, '#8d6e63'); c.save(); c.setLineDash([16, 12]); rr(c, 800, 470, 320, 260, 20); fs(c, null, 5); c.restore();
  label(c, '?', 960, 600, 140, INK, { stroke: false }); sign(c, 960, 860, 520, 80, 'NEXT CONSOLE: NOT OUT YET', { bg: '#fff8e1', size: 36 });
} });
S('M1c.0', { focus: [960, 520, 1.35], draw(c, T) { SET.spot(c, T.t); star(c, 960, 520, 220, 'smug', T.t, { finger: true, arms: [[-1.25, .1], [.1, .1]] }); label(c, 'SHHH', 1360, 300, 64, '#fff'); } });
S('M1c.1', { focus: [960, 500, 1.2], shakes: [['sequel'], ['trailer'], ['nothing']], sfx: [['stamp', 'sequel', -8], ['stamp', 'trailer', -8], ['stamp', 'nothing', -8]], draw(c, T) {
  SET.museum(c, T.t); [['SEQUEL', 'sequel'], ['TRAILER', 'trailer'], ['ANYTHING', 'nothing']].forEach(([n, w], i) => { const x = 460 + i * 500; box(c, x - 200, 220, 400, 320, 10, '#8b5a2b'); rr(c, x - 176, 244, 352, 272, 4); fs(c, '#f7f3e8', 3); label(c, n, x, 600, 40, INK, { stroke: false }); stamp(c, x, 380, 'NONE', T.at(w, .35), RED, { w: 260, h: 100 }); });
} });
S('M1d.0', { focus: [960, 520, 1.25], sfx: [['page', 0.2, -12], ['page', 0.8, -12]], draw(c, T) {
  SET.office(c, T.t, { wall: '#d9e4ef' }); box(c, 1060, 220, 520, 400, 6, '#fff'); label(c, 'GTA 6', 1320, 330, 90, INK, { stroke: false, rot: -.04 }); label(c, "ISN'T REAL", 1320, 470, 76, RED, { stroke: false, rot: -.04 });
  const yr = 2014 + Math.min(9, Math.floor(T.lt * 4)); calendar(c, 420, 330, 220, 220, 'YEAR', String(yr));
  P('fan', { x: 760, y: 1000, s: 1.05, t: T.t, expr: 'smug', pose: 'phone', item: (cc, h) => box(cc, h[1][0] - 24, h[1][1] - 44, 48, 80, 8, '#222', 3) });
} });
S('M1e.0', { focus: [960, 600, 1.2], draw(c, T) { SET.store(c, T.t, { sign: 'BESTSELLERS' }); conveyor(c, 960, 760, 1600, T.t, (x, y) => gameBox(c, x, y, 90, 130, { title: 'GTA V' })); label(c, 'NEVER STOPPED SELLING', 960, 330, 52, '#fff'); } });
S('M1e.1', { focus: [960, 460, 1.25], sfx: [['ding', '230']], draw(c, T) {
  SET.store(c, T.t, { sign: 'GTA V' }); counter(c, 960, 420, 900, 210, commas(num(T, '230', 230000000, 1.1)), 'gold', { cap: 'COPIES SOLD' });
  for (let i = 0; i < 9; i++) gameBox(c, 560 + i * 100, 900, 80, 120, { title: 'GTA V' });
} });
S('M1f.0', { focus: [960, 600, 1.2], draw(c, T) { SET.street(c, T.t, { noHQ: true }); for (let i = 0; i < 7; i++) P('investor', { x: 200 + i * 255, y: 1010 + (i % 2) * 14, s: .66, t: T.t, seed: 40 + i, body: ['#3a5f8f', '#2f9e6b', '#c0392b', '#e67e22', '#2f7f86', '#7a5c3a', '#3d4452'][i], hair: ['short', 'bun', 'curly', 'long'][i % 4], expr: 'grin', pose: 'hold', item: (cc) => gameBox(cc, 0, -120, 70, 100, { title: 'GTA V' }) }); label(c, 'THEY KNOW THE FEELING', 960, 200, 52, '#fff'); } });
S('M1f.1', { focus: [800, 600, 1.25], draw(c, T) {
  SET.street(c, T.t, { noHQ: true }); box(c, 1440, 380, 260, 520, 8, '#6d4c41'); sign(c, 1570, 330, 300, 70, 'NEXT GAME', { bg: '#1d3557', fg: '#fff', size: 38 });
  for (let i = 0; i < 6; i++) P('investor', { x: 1300 - i * 190, y: 1010, s: .66, t: T.t, seed: 50 + i, body: ['#3a5f8f', '#2f9e6b', '#c0392b', '#e67e22', '#2f7f86', '#7a5c3a'][i], hair: ['short', 'bun', 'curly', 'long'][i % 4], expr: i % 2 ? 'bored' : 'neutral', pose: i === 2 ? 'phone' : 'idle' });
} });
S('M1g.0', { focus: [960, 440, 1.25], draw(c, T) { SET.street(c, T.t, { noHQ: true }); screenTV(c, 960, 400, 900, 500, () => { c.fillStyle = '#1b2a4a'; c.fillRect(0, 0, W, H); playIcon(c, 960, 400, 80); label(c, 'TRAILER 1', 960, 540, 44, '#fff'); }); calendar(c, 1620, 760, 220, 220, 'DEC', '2023'); crowd(c, 860, 1010, 1500, 1, 1, T.t, 4, { faces: true }); } });
S('M1g.1', { focus: [960, 420, 1.25], sfx: [['ding', '93']], draw(c, T) { SET.street(c, T.t, { noHQ: true }); screenTV(c, 960, 400, 900, 500, () => { c.fillStyle = '#1b2a4a'; c.fillRect(0, 0, W, H); money(c, T.since('93') > 0 ? commas(num(T, '93', 93000000, 1)) : '...', 960, 380, 110, 'gold', { maxW: 800 }); label(c, 'VIEWS IN 24 HOURS', 960, 500, 44, '#fff'); }); crowd(c, 960, 1010, 1900, 1, 1, T.t, 4, { cheer: T.since('93') > 0, faces: true }); } });
S('M1h.0', { focus: [960, 560, 1.25], sfx: [['cheer', 'biggest', -14]], draw(c, T) {
  SET.spot(c, T.t); box(c, 760, 760, 400, 160, 8, '#e0b13e'); box(c, 360, 830, 400, 90, 8, '#c0c0c0'); box(c, 1160, 850, 400, 70, 8, '#cd7f32');
  trophy(c, 960, 680, 1, 'FIRST DAY'); screenTV(c, 560, 700, 220, 140, () => { c.fillStyle = '#334'; c.fillRect(0, 0, W, H); }); screenTV(c, 1360, 720, 200, 120, () => { c.fillStyle = '#334'; c.fillRect(0, 0, W, H); });
  label(c, 'BIGGEST FIRST DAY', 960, 220, 56, GOLD, { glow: GOLD }); label(c, 'NON-MUSIC VIDEOS', 960, 290, 32, '#fff');
} });
S('M1i.0', { focus: [960, 440, 1.2], sfx: [['ding', '475']], draw(c, T) {
  SET.street(c, T.t, { noHQ: true }); screenTV(c, 520, 420, 640, 380, () => { c.fillStyle = '#1b2a4a'; c.fillRect(0, 0, W, H); label(c, 'TRAILER 1', 520, 340, 40, '#fff'); money(c, '93M', 520, 440, 80, 'gold'); });
  screenTV(c, 1400, 420, 640, 380, () => { c.fillStyle = '#1b2a4a'; c.fillRect(0, 0, W, H); label(c, 'TRAILER 2', 1400, 340, 40, '#fff'); money(c, T.since('475') > 0 ? Math.round(num(T, '475', 475, 1)) + 'M' : '...', 1400, 440, 80, 'gold'); });
  label(c, 'VIEWS IN ONE DAY, ALL PLATFORMS', 960, 860, 40, '#fff');
} });
S('M1i.1', { focus: [900, 520, 1.2], draw(c, T) {
  SET.grid(c, T.t); const g = easeOut(T.in(.1, 1)); box(c, 500, 900 - 560 * g, 300, 560 * g, 8, '#e0b13e'); label(c, 'TRAILER 2', 650, 940, 38, INK, { stroke: false }); label(c, '475M', 650, 900 - 560 * g - 40, 50, INK, { stroke: false });
  box(c, 1000, 900 - 400, 300, 400, 8, '#9ec5e8'); label(c, 'BIG MOVIE TRAILER', 1150, 940, 34, INK, { stroke: false }); label(c, 'BEATEN', 1150, 450, 44, RED, { stroke: false });
} });
S('M1j.0', { focus: [760, 540, 1.2], sfx: [['ding', '29', -10]], draw(c, T) {
  SET.grid(c, T.t); const lit = Math.round(29 * easeOut(clamp(T.since('29') / 1.2))); tinyCrowd(c, 330, 300, 10, 10, 58, lit, T.t);
  money(c, T.since('29') > 0 ? lit + '%' : '...', 1420, 420, 170, 'gain'); label(c, 'PLAN TO BUY', 1420, 560, 46, INK, { stroke: false }); label(c, 'US CONSOLE + PC GAMERS', 1420, 640, 30, INK, { stroke: false });
} });
S('M1j.1', { focus: [960, 520, 1.3], draw(c, T) { SET.office(c, T.t); P('analyst', { x: 700, y: 1000, s: 1.1, t: T.t, expr: 'grin', pose: 'point' }); clipboard(c, 1260, 480, 460, 440, ['CIRCANA', '29%', 'PLAN TO BUY'], { col: [INK, '#1faa55', INK] }); } });
S('M1k.0', { focus: [960, 520, 1.2], sfx: [['party', 'highest', -14]], draw(c, T) {
  SET.grid(c, T.t); const hs = [220, 300, 260, 340, 280]; hs.forEach((h, i) => { box(c, 300 + i * 190, 900 - h, 140, h, 6, '#c9d3de'); }); const g = easeOut(clamp(T.since('highest') / 1)); box(c, 1300, 900 - lerp(340, 640, g), 200, lerp(340, 640, g), 8, '#e0b13e'); label(c, 'GTA 6', 1400, 940, 40, INK, { stroke: false });
  line(c, 1400, 260 - 0, 1400, 900 - lerp(340, 640, g), 0); if (g > .8) { line(c, 1500, 260, 1500, 160, 6); poly(c, [[1500, 160], [1640, 185], [1500, 210]], RED); label(c, 'RECORD', 1590, 120, 40, RED, { stroke: false }); } label(c, 'PAST GAMES', 640, 940, 34, '#8a8f98', { stroke: false });
} });
S('M1l.0', { focus: [960, 560, 1.25], shakes: [['sprint']], sfx: [['stamp', 'sprint', -6]], draw(c, T) {
  SET.street(c, T.t, { noHQ: true }); P('investor', { x: 900, y: 1000, s: 1, t: T.t * 1.5, expr: 'worried', pose: 'cheer', walk: 1, sweat: true, badge: 'ADS' }); sign(c, 960, 260, 560, 80, 'MARKETING SPRINT', { bg: '#fff', size: 44 });
  stamp(c, 960, 520, 'NOT THIS', T.at('sprint', .35), RED, { w: 420, h: 120 });
} });
S('M1l.1', { focus: [960, 520, 1.25], draw(c, T) {
  SET.spot(c, T.t); c.save(); c.translate(820, 620); c.rotate(-.25); gameBox(c, 0, 160, 300, 420, { title: 'GTA V' }); c.restore();
  for (let i = 0; i < 3; i++) { c.save(); c.globalAlpha = .9 - i * .25; c.beginPath(); c.arc(1060, 520, 120 + i * 90 + (T.lt * 60) % 90, -.6, .6); c.lineWidth = 10; c.strokeStyle = '#fff'; c.stroke(); c.restore(); }
  label(c, 'THE LAST PRODUCT', 960, 160, 56, '#fff');
} });
S('M1m.0', { focus: [960, 440, 1.2], draw(c, T) {
  SET.street(c, T.t, { noHQ: true }); billboard(c, 960, 380, 1200, 420, () => { gameBox(c, 640, 540, 220, 320, { title: 'GTA V' }); label(c, 'AN AD FOR', 1120, 300, 56, '#fff'); label(c, 'GTA 6', 1120, 400, 110, GOLD, { glow: GOLD }); label(c, '2013 - 2026', 1120, 500, 44, '#fff'); });
} });
card('M1n.0', 'The best marketing for the next thing you sell is how good the last thing was.');

// ======================= MOVE 2: SELL IT BEFORE YOU SHIP IT =======================
S('M2a.0', { focus: [960, 560, 1.25], draw(c, T) {
  SET.office(c, T.t); desk(c, 960, 800, 900); box(c, 780, 680, 360, 120, 8, '#f5deb3'); label(c, 'PAYROLL', 960, 740, 40, INK, { stroke: false });
  const sq = Math.sin(T.t * 6) * 8; balloon(c, 700, 420 + sq, 130, '#ff8fb7', 'HYPE', { strY: 690 }); label(c, "DOESN'T FIT", 1300, 400, 52, RED, { stroke: false });
} });
S('M2a.1', { focus: [960, 600, 1.3], sfx: [['bag', 'cash', -8]], draw(c, T) {
  SET.office(c, T.t); desk(c, 960, 800, 900); box(c, 780, 680, 360, 120, 8, '#f5deb3'); label(c, 'PAYROLL', 960, 740, 40, INK, { stroke: false });
  const p = easeOut(T.at('cash', .5)); for (let i = 0; i < 5; i++) bill(c, lerp(1500, 960, p) + i * 8, lerp(400, 660, p) - i * 10, .9, -.1); if (p >= 1) label(c, 'CASH DOES', 960, 300, 64, GREEN, { glow: GREEN });
} });
chap('M2b.0', 'MOVE TWO', 'Sell It Before You Ship It');
S('M2b.1', { focus: [960, 520, 1.2], draw(c, T) {
  SET.office(c, T.t, { wall: '#e3dccb' }); box(c, 700, 360, 520, 440, 20, '#5d6d7e'); circ(c, 960, 520, 70, '#8fa3b5'); for (let a = 0; a < 6; a++) line(c, 960, 520, 960 + Math.cos(a + T.t) * 60, 520 + Math.sin(a + T.t) * 60, 6);
  for (let i = 0; i < 3; i++) balloon(c, 420 - ((T.lt * 120 + i * 140) % 300), 380 + i * 60, 50, '#ff8fb7', null, { strY: 520 + i * 60 });
  for (let i = 0; i < 4; i++) bill(c, 1300 + ((T.lt * 160 + i * 110) % 440), 640, .7, .1); label(c, 'HYPE', 330, 260, 44, '#ff4f8b'); label(c, 'CASH', 1520, 520, 44, '#1faa55');
  calendar(c, 1600, 260, 220, 200, 'WHEN', 'BEFORE');
} });
card('M2c.0', 'Would you pay eighty dollars for something you\'d never actually seen working?');
S('M2d.0', { focus: [960, 560, 1.2], draw(c, T) {
  SET.store(c, T.t, { sign: 'PRE-ORDERS' }); P('clerk', { x: 960, y: 700, s: .7, t: T.t, expr: 'grin', pose: 'hold' }); box(c, 560, 600, 800, 160, 10, '#8d6e63'); label(c, 'PRE-ORDER HERE', 960, 680, 40, '#fff');
  for (let i = 0; i < 6; i++) P('investor', { x: 300 + i * 270, y: 1030, s: .62, t: T.t, seed: 60 + i, body: ['#3a5f8f', '#2f9e6b', '#c0392b', '#e67e22', '#2f7f86', '#7a5c3a'][i], hair: ['short', 'bun', 'curly', 'long'][i % 4], expr: 'grin', pose: 'holdUp', item: (cc, h) => bill(cc, h[1][0], h[1][1] - 30, .5) });
} });
S('M2d.1', { focus: [960, 500, 1.25], sfx: [['ding', '79']], draw(c, T) {
  SET.store(c, T.t, { sign: 'PRE-ORDERS' }); calendar(c, 560, 420, 320, 320, 'JUNE 2026', '25', { circle: T.at('june', .5) }); gameBox(c, 1260, 860, 300, 420, {});
  const p = back(T.at('79', .45)); if (p > 0) { c.save(); c.translate(1420, 470); c.scale(p, p); priceTag(c, 0, 0, '$79.99', .08); c.restore(); }
} });
S('M2e.0', { focus: [960, 440, 1.2], draw(c, T) {
  SET.living(c, T.t); [0, 1].forEach(i => screenTV(c, 420 + i * 520, 400, 440, 280, () => { c.fillStyle = '#1b2a4a'; c.fillRect(0, 0, W, H); playIcon(c, 420 + i * 520, 400, 50); label(c, 'TRAILER ' + (i + 1), 420 + i * 520, 490, 30, '#fff'); }));
  screenTV(c, 1480, 400, 440, 280, () => { c.fillStyle = '#0d1420'; c.fillRect(0, 0, W, H); label(c, '?', 1480, 380, 120, '#fff'); label(c, 'GAMEPLAY', 1480, 490, 30, '#9aa3b5'); });
} });
S('M2f.0', { focus: [960, 520, 1.25], sfx: [['page', 'two', -10], ['page', 'months', -10]], draw(c, T) {
  SET.office(c, T.t); const p = clamp(T.since('months') / .5); calendar(c, 960, 440, 380, 380, '2026', p > .5 ? 'AUG' : 'JUNE'); label(c, '+2 MONTHS', 960, 760, 60, INK, { stroke: false });
} });
S('M2f.1', { focus: [960, 500, 1.25], sfx: [['ding', 'august', -12]], draw(c, T) {
  SET.living(c, T.t); screenTV(c, 960, 400, 720, 420, () => { const g = c.createLinearGradient(0, 200, 0, 600); g.addColorStop(0, '#ff6fb1'); g.addColorStop(1, '#ffb347'); c.fillStyle = g; c.fillRect(0, 0, W, H); circ(c, 960, 420, 70, '#ffe66d', 0); c.fillStyle = '#3b1f5c'; c.fillRect(0, 470, W, 200); label(c, 'STREAMING SPECIAL', 960, 290, 40, '#fff'); });
  stopwatch(c, 1520, 560, 80, T.t); label(c, '27 MIN', 1520, 680, 44, '#fff'); calendar(c, 380, 560, 220, 220, 'AUG', '27', { circle: T.at('august', .6) });
  box(c, 640, 760, 640, 140, 40, '#6b4f8a'); P('gamer', { x: 960, y: 960, s: .8, t: T.t, expr: 'grin', pose: 'idle' });
} });
S('M2g.0', { focus: [960, 560, 1.25], sfx: [['pop', 'bonus', -8]], draw(c, T) {
  SET.store(c, T.t); gameBox(c, 780, 880, 320, 440, {}); const p = back(T.in(.25, .5)); arrive(c, p, 1240, 880, () => giftBox(c, 0, 0, 280, 'BONUS PACK')); if (p > .5) { c.beginPath(); c.moveTo(940, 700); c.quadraticCurveTo(1040, 600, 1110, 720); c.lineWidth = 8; c.strokeStyle = GOLD; c.stroke(); }
} });
S('M2g.1', { focus: [960, 500, 1.3], draw(c, T) { SET.office(c, T.t); calendar(c, 960, 440, 380, 380, 'BUY BEFORE', 'NOV 20', { circle: T.in(.2, .8) }); label(c, 'BONUS INCLUDED', 960, 760, 56, '#1faa55', { stroke: false }); } });
S('M2h.0', { focus: [960, 560, 1.25], sfx: [['crumble', 'window', -14, { len: 1.5 }]], draw(c, T) {
  SET.street(c, T.t, { noHQ: true }); box(c, 640, 360, 640, 540, 10, '#e9e2d0'); rr(c, 680, 420, 560, 380, 6); fs(c, '#ffe7a8'); giftBox(c, 960, 760, 220, 'BONUS'); shutter(c, 960, 800, 560, 380, easeOut(T.at('window', .8)));
  P('fan', { x: 1500, y: 1010, s: .9, t: T.t, expr: T.since('miss') > 0 ? 'sad' : 'worried', pose: 'idle', flip: true });
} });
S('M2i.0', { focus: [960, 520, 1.25], sfx: [['ding', '39', -10]], draw(c, T) { SET.tech(c, T.t); phonePost(c, 960, 520, 520, 860, ['VIRAL: JUNE', '39M PRE-ORDERS', '$3B DAY ONE'], {}); lightPool(c, 960, 520, 500, '#2dff9a', .2); } });
S('M2i.1', { focus: [960, 520, 1.25], shakes: [['dismissed']], sfx: [['stamp', 'dismissed', -4]], draw(c, T) { SET.tech(c, T.t); phonePost(c, 960, 520, 520, 860, ['VIRAL: JUNE', '39M PRE-ORDERS', '$3B DAY ONE'], {}); stamp(c, 960, 560, 'MADE UP?', T.at('dismissed', .35), RED, { w: 420, h: 130 }); } });
S('M2j.0', { focus: [900, 520, 1.2], draw(c, T) {
  SET.grid(c, T.t); box(c, 480, 900 - 600, 280, 600, 8, '#c9d3de'); c.save(); c.setLineDash([14, 10]); rr(c, 480, 300, 280, 600, 8); fs(c, null, 4); c.restore(); label(c, 'RUMOR 39M', 620, 940, 38, INK, { stroke: false });
  const g = easeOut(clamp(T.lt / 1.5)); const h = 500 * g; box(c, 960, 900 - h, 280, h, 8, '#e0b13e'); label(c, 'REAL', 1100, 940, 38, INK, { stroke: false }); label(c, 'CLOSE', 1460, 420, 70, '#1faa55', { stroke: false });
} });
S('M2j.1', { focus: [960, 460, 1.25], sfx: [['ding', '32']], draw(c, T) { SET.store(c, T.t, { sign: 'PRE-ORDERS' }); counter(c, 960, 420, 900, 210, commas(num(T, '32', 32500000, 1.1)), 'gold', { cap: 'COPIES BEFORE RELEASE DAY' }); stamp(c, 960, 740, 'RECORD', T.at('record', .35), '#1faa55', { w: 300, h: 100 }); } });
S('M2k.0', { focus: [760, 520, 1.25], sfx: [['inflate', 'peak', -12]], draw(c, T) { SET.office(c, T.t); thermometer(c, 560, 820, 560, lerp(.4, .98, easeOut(T.at('peak', 1))), 'EXCITEMENT'); label(c, 'PEAK', 760, 300, 56, RED, { stroke: false }); label(c, 'COOLS OFF LATER', 1260, 760, 44, '#5dade2', { stroke: false }); } });
S('M2k.1', { focus: [960, 520, 1.25], shakes: [['locked']], sfx: [['hit', 'locked', -6]], draw(c, T) { SET.vault(c, T.t); coinPile(c, 700, 900, 520, 240, 3); safe(c, 1200, 920, 460, 540, T.since('locked') > 0); label(c, 'LOCKED IN', 1200, 280, 60, GOLD, { glow: GOLD }); } });
S('M2l.0', { focus: [960, 520, 1.3], draw(c, T) { SET.office(c, T.t); star(c, 700, 560, 180, 'grin', T.t, { arms: [[-1.2, .2], [1.3, .3]] }); clipboard(c, 1260, 480, 440, 440, ['LAUNCH DAY', 'FORECAST', 'HUGE'], { col: [INK, INK, '#1faa55'] }); calendar(c, 1680, 260, 200, 190, 'KNOWN', 'EARLY'); } });
card('M2m.0', 'Sell it before you ship it, and give people a reason not to wait.');
S('M2n.0', { focus: [960, 560, 1.2], draw(c, T) {
  SET.street(c, T.t, { noHQ: true, noTrees: true }); box(c, 200, 300, 700, 600, 10, '#e9e2d0'); for (let y = 340; y < 840; y += 80) for (let x = 230; x < 880; x += 80) windowRect(c, x, y, 46, 50, '#cfe9ff'); sign(c, 550, 270, 420, 70, 'STUDIO OF THOUSANDS', { bg: '#1d3557', fg: '#fff', size: 32 }); crowd(c, 550, 1010, 700, 1, .9, T.t, 6, {});
  label(c, 'VS', 1080, 600, 80, INK, { stroke: false }); P('solo', { x: 1440, y: 1010, s: .95, t: T.t, expr: 'smug', pose: 'hold', item: (cc) => laptop(cc, 0, -110, .3) });
} });
S('M2o.0', { focus: [960, 540, 1.25], draw(c, T) { SET.kitchen(c, T.t); label(c, '1  A SMALL AUDIENCE', 960, 180, 48, INK, { stroke: false }); crowd(c, 960, 900, 700, 2, 1, T.t, 8, { faces: true }); P('solo', { x: 960, y: 760, s: .7, t: T.t, expr: 'grin', pose: 'wave' }); } });
S('M2o.1', { focus: [960, 540, 1.25], sfx: [['pop', 'pre', -10]], draw(c, T) { SET.kitchen(c, T.t); label(c, '2  PRE-SELL IT', 960, 180, 48, INK, { stroke: false }); box(c, 760, 560, 400, 300, 14, '#fff'); label(c, 'SIMPLE THING', 960, 700, 40, INK, { stroke: false }); priceTag(c, 1160, 560, 'PRE-ORDER', .1); } });
S('M2o.2', { focus: [960, 540, 1.25], sfx: [['ding', 'team', -12]], draw(c, T) {
  SET.kitchen(c, T.t); label(c, '3  AI DOES THE TEAM WORK', 960, 180, 48, INK, { stroke: false }); laptop(c, 700, 840, 1.2, () => { c.fillStyle = '#e8f3ff'; c.fillRect(0, 0, W, H); });
  ['DESIGN', 'WRITING', 'SUPPORT', 'ADMIN'].forEach((s, i) => { const on = T.lt > .3 + i * .35; box(c, 1060, 380 + i * 110, 60, 60, 10, on ? '#1faa55' : '#fff'); if (on) label(c, 'V', 1090, 410 + i * 110, 40, '#fff', { stroke: false }); label(c, s, 1300, 410 + i * 110, 40, INK, { stroke: false, align: 'center' }); });
} });
S('M2p.0', { focus: [960, 520, 1.3], sfx: [['sparkle', 'guide', -12]], draw(c, T) { SET.spot(c, T.t); lightPool(c, 860, 520, 500, '#fff2b0', .5); book(c, 860, 520, 420, 560, ['GUIDE TO BECOME', 'AN AI', 'SOLOPRENEUR'], 'IN 90 DAYS'); calendar(c, 1420, 520, 260, 260, 'PLAN', '90 DAYS'); label(c, 'FREE', 1420, 780, 60, '#1faa55', { glow: '#1faa55' }); } });
S('M2q.0', { focus: [960, 560, 1.2], draw(c, T) {
  SET.grid(c, T.t); stairs(c, 400, 920, 6, 170, 90); label(c, '0', 470, 960, 50, INK, { stroke: false }); box(c, 1360, 220, 260, 160, 8, '#e76f51'); poly(c, [[1340, 230], [1490, 150], [1640, 230]], '#b0563f'); label(c, 'YOUR SHOP', 1490, 300, 30, '#fff');
  const st = Math.min(5, Math.floor(T.lt * 1.6)); P('solo', { x: 480 + st * 170, y: 830 - st * 90, s: .5, t: T.t, expr: 'grin', pose: 'idle', walk: 1, item: (cc) => laptop(cc, 0, -110, .28) });
} });
S('M2r.0', { focus: [960, 560, 1.2], sfx: [['pop', 'description', -10], ['pop', 'pinned', -10]], draw(c, T) {
  SET.spot(c, T.t); arrive(c, T.at('description', .4), 640, 620, () => { box(c, -300, -150, 600, 300, 20, '#f7f7f2'); label(c, 'DESCRIPTION', 0, -90, 44, INK, { stroke: false }); for (let i = 0; i < 3; i++) line(c, -240, -20 + i * 50, 200 - i * 60, -20 + i * 50, 8, '#c9cfd6'); });
  arrive(c, T.at('pinned', .4), 1300, 620, () => { box(c, -300, -150, 600, 300, 20, '#f7f7f2'); label(c, 'PINNED COMMENT', 0, -90, 40, INK, { stroke: false }); circ(c, -230, 10, 30, '#9aa3b5', 3); line(c, -170, 10, 220, 10, 8, '#c9cfd6'); });
  arrow(c, 960, 140, 960, 360, '#fff', 26); stamp(c, 960, 900, 'FREE', T.at('free', .35), '#1faa55', { w: 220, h: 90 });
} });
S('M2s.0', { focus: [960, 540, 1.25], draw(c, T) { SET.spot(c, T.t); P('solo', { x: 860, y: 920, s: 1.1, t: T.t, expr: 'grin', pose: 'holdUp', item: (cc, h) => book(cc, h[1][0] + 70, h[1][1] - 60, 160, 210, ['AI SOLO-', 'PRENEUR'], '90 DAYS') }); priceTag(c, 1460, 420, 'MOVE 3', .1); label(c, 'PRICING NEXT', 1460, 540, 40, '#fff'); } });

// ======================= MOVE 3: THE HUNDRED-DOLLAR RUMOR =======================
chap('M3a.0', 'MOVE THREE', 'The Hundred-Dollar Rumor');
S('M3a.1', { focus: [960, 500, 1.25], sfx: [['ding', '100', -10]], draw(c, T) {
  SET.tech(c, T.t); const p = back(T.in(.2, .5)); if (p > 0) { c.save(); c.translate(960, 360); c.scale(1.6 * p, 1.6 * p); priceTag(c, 0, 0, '$100?', -.06, '#ffcc80'); c.restore(); }
  for (let i = 0; i < 6; i++) { const x = 300 + i * 264; box(c, x - 50, 700, 100, 170, 16, '#14161c'); rr(c, x - 40, 716, 80, 130, 8); fs(c, '#e8f3ff', 2.5); label(c, '$100', x, 780, 26, RED, { stroke: false }); }
} });
S('M3b.0', { focus: [960, 500, 1.2], draw(c, T) {
  SET.tech(c, T.t); [['ARTICLE', 0], ['THREAD', 1], ['VIDEO', 2]].forEach(([n, i]) => { const x = 440 + i * 520; screenTV(c, x, 460, 440, 320, () => { c.fillStyle = '#f7f7f2'; c.fillRect(0, 0, W, H); label(c, n, x, 360, 36, INK, { stroke: false }); money(c, '$100', x, 460, 90, 'loss'); if (n === 'VIDEO') { circ(c, x + 120, 540, 30, '#f2c49b', 3); face(c, x + 120, 540, 30, 'angry', T.t, {}); } }); });
  label(c, 'FOR A BASE GAME', 960, 820, 52, '#fff');
} });
S('M3c.0', { focus: [960, 540, 1.2], draw(c, T) {
  SET.street(c, T.t, { noHQ: true }); c.save(); c.setLineDash([16, 12]); c.translate(960, 360); poly(c, [[-160, -70], [120, -70], [170, 0], [120, 70], [-160, 70]], null); c.restore(); label(c, '$100', 930, 360, 70, '#8a8f98', { stroke: false }); label(c, "DOESN'T EXIST", 960, 480, 40, INK, { stroke: false });
  for (let i = 0; i < 5; i++) P('investor', { x: 360 + i * 300, y: 1010, s: .78, t: T.t, seed: 70 + i, body: ['#c0392b', '#e67e22', '#3a5f8f', '#2f9e6b', '#7a5c3a'][i], hair: ['short', 'bun', 'curly', 'long', 'short'][i], expr: 'angry', pose: i % 2 ? 'cheer' : 'point', flip: i > 2 });
} });
S('M3d.0', { focus: [960, 520, 1.35], draw(c, T) { SET.spot(c, T.t); star(c, 960, 520, 220, 'neutral', T.t, { arms: [[-1.4, -.5], [1.4, -.5]] }); label(c, 'WE NEVER SAID $100', 960, 160, 48, '#fff'); } });
S('M3d.1', { focus: [960, 500, 1.2], draw(c, T) { SET.spot(c, T.t); const n = Math.min(12, 1 + Math.floor(T.lt * 5)); const R = rand(4); for (let i = 0; i < n; i++) { const x = 300 + R() * 1320, y = 200 + R() * 560; box(c, x - 90, y - 45, 180, 90, 30, '#fff'); poly(c, [[x - 30, y + 40], [x, y + 40], [x - 50, y + 80]], '#fff', 4); label(c, '$100', x, y, 40, RED, { stroke: false }); } label(c, 'RUMORS', 960, 960, 54, '#fff'); } });
S('M3e.0', { focus: [960, 500, 1.3], draw(c, T) { SET.office(c, T.t); calendar(c, 960, 440, 380, 380, 'JUNE 2026', '24', { circle: T.at('24', .6) }); label(c, 'PRICE DAY', 960, 760, 56, INK, { stroke: false }); } });
S('M3e.1', { focus: [960, 500, 1.25], sfx: [['ding', '79']], draw(c, T) {
  SET.party(c, T.t, { banner: false }); const o = easeOut(T.at('79', .8)); box(c, 360, 120, 1200, 760, 10, '#3b1f2a'); priceTag(c, 960, 480, '$79.99', 0); c.save(); c.translate(960, 480); c.scale(1.8, 1.8); priceTag(c, 0, 0, '$79.99', 0); c.restore();
  box(c, 360, 120, 600 * (1 - o), 760, 0, '#b71c1c'); box(c, 1560 - 600 * (1 - o), 120, 600 * (1 - o), 760, 0, '#b71c1c'); for (let k = 0; k < 6; k++) { line(c, 360 + k * 100 * (1 - o), 130, 360 + k * 100 * (1 - o), 870, 3); line(c, 1560 - k * 100 * (1 - o), 130, 1560 - k * 100 * (1 - o), 870, 3); }
} });
S('M3f.0', { focus: [960, 520, 1.25], draw(c, T) { SET.office(c, T.t); newspaper(c, 960, 500, 900, 620, 'TECH NEWS'); label(c, 'EXPENSIVE, BUT', 960, 470, 70, INK, { stroke: false }); label(c, 'NOT AS BAD AS EXPECTED', 960, 560, 50, INK, { stroke: false }); P('investor', { x: 1640, y: 1010, s: .8, t: T.t, expr: 'smug', pose: 'idle', flip: true }); } });
S('M3g.0', { focus: [960, 520, 1.2], sfx: [['ding', '69', -10]], draw(c, T) { SET.grid(c, T.t); ladder(c, 760, 980, 820); priceTag(c, 1060, 300, '$79.99', 0); label(c, 'GTA 6', 1300, 300, 40, INK, { stroke: false }); arrive(c, T.at('69', .4), 1060, 520, () => { priceTag(c, 0, 0, '$69.99', 0); label(c, 'THE USUAL', 260, 0, 40, INK, { stroke: false }); }); label(c, '+$10', 1500, 380, 60, RED, { stroke: false }); } });
S('M3g.1', { focus: [960, 520, 1.2], sfx: [['ding', '59', -10]], draw(c, T) { SET.grid(c, T.t); ladder(c, 760, 980, 820); priceTag(c, 1060, 300, '$79.99', 0); label(c, 'GTA 6', 1300, 300, 40, INK, { stroke: false }); priceTag(c, 1060, 520, '$69.99', 0); label(c, 'USUAL', 1300, 520, 40, INK, { stroke: false }); arrive(c, T.at('59', .4), 1060, 740, () => { priceTag(c, 0, 0, '$59.99', 0); label(c, 'GTA V (2013)', 290, 0, 40, INK, { stroke: false }); }); } });
S('M3h.0', { focus: [960, 520, 1.25], draw(c, T) { SET.grid(c, T.t); arrow(c, 760, 760, 760, 300, RED, 40); label(c, 'PRICE INCREASE', 1200, 500, 70, RED, { stroke: false }); } });
S('M3h.1', { focus: [960, 540, 1.25], sfx: [['whoosh2', 'relief', -10]], draw(c, T) {
  SET.spot(c, T.t); const r = T.since('80') > 0; P('fan', { x: 960, y: 960, s: 1.05, t: T.t, expr: r ? 'happy' : 'worried', pose: r ? 'idle' : 'armsUp', sweat: !r });
  if (!r) weight(c, 960, 260, .8, '$100'); else feather(c, 1060 + Math.sin(T.t * 3) * 30, 560 + T.since('80') * 60, 1, Math.sin(T.t * 2) * .4, '$80'); if (r) label(c, 'RELIEF', 1460, 300, 60, '#1faa55', { stroke: false });
} });
S('M3i.0', { focus: [960, 520, 1.25], sfx: [['ding', '99', -10]], draw(c, T) {
  SET.store(c, T.t, { sign: 'ULTIMATE EDITION' }); gameBox(c, 760, 900, 340, 480, { title: 'GTA VI+', pal: ['#1d3557', '#e0b13e'] }); priceTag(c, 980, 440, '$99.99', .08, '#ffcc80');
  box(c, 1160, 700, 200, 90, 30, '#e74c3c'); circ(c, 1200, 800, 26, '#333'); circ(c, 1320, 800, 26, '#333'); label(c, 'VEHICLES', 1260, 870, 30, '#fff'); line(c, 1500, 560, 1500, 620, 6); poly(c, [[1440, 620], [1560, 620], [1600, 760], [1400, 760]], '#5dade2'); label(c, 'OUTFITS', 1500, 800, 30, '#fff');
  box(c, 1340, 360, 160, 110, 8, '#8d6e63'); label(c, 'EXTRAS', 1420, 415, 28, '#fff');
} });
S('M3j.0', { focus: [960, 560, 1.2], draw(c, T) { SET.office(c, T.t, { wall: '#e9dcc3' }); doorway(c, 640, 760, 300, 460, 'ENTRY', '$79.99', '#5d8aa8'); stairs(c, 1060, 760, 2, 160, 50, '#c49a6c'); doorway(c, 1300, 660, 300, 460, 'UPGRADE', '$99.99', '#b0563f'); P('fan', { x: 900, y: 1000, s: .8, t: T.t, expr: 'grin', pose: 'point', flip: false }); } });
S('M3k.0', { focus: [960, 520, 1.2], draw(c, T) {
  SET.spot(c, T.t); balance(c, 960, 940, .14, (x, y) => { box(c, x - 120, y - 150, 240, 150, 30, '#fff'); label(c, 'EXPECTED', x, y - 100, 34, INK, { stroke: false }); label(c, '$100', x, y - 50, 50, RED, { stroke: false }); }, (x, y) => { receipt(c, x, y - 110, 220, 200, ['COST TO', 'MAKE'], {}); });
  label(c, 'HOW BUYERS JUDGE A PRICE', 960, 140, 44, '#fff');
} });
card('M3l.0', "Know the number already in your buyer's head, come in under it, and give your biggest fans a premium tier to climb into.");

// ======================= MOVE 4: THE DELAY =======================
chap('M4a.0', 'MOVE FOUR', 'The Delay');
S('M4a.1', { focus: [960, 500, 1.3], shakes: [['delayed'], ['twice']], sfx: [['paper', 'delayed', -6], ['paper', 'twice', -6]], draw(c, T) {
  SET.office(c, T.t); const r1 = clamp(T.since('delayed') / .5), r2 = clamp(T.since('twice') / .5); calendar(c, 960, 440, 380, 380, 'RELEASE', 'NOV 19');
  [[r2, 'MAY 26'], [r1, 'FALL 25']].forEach(([p, s]) => { c.save(); c.translate(960 + p * 600, 440 + p * p * 600); c.rotate(p * .9); calendar(c, 0, 0, 380, 380, 'RELEASE', s); c.restore(); });
  label(c, 'DELAYED', 1520, 860, 56, RED, { stroke: false });
} });
const ripCal = (c, T, top, big, w, nth) => { const s = nth != null ? T.sinceN(w, nth) : T.since(w); const p = clamp(s / .5); c.save(); c.translate(960 + p * 600, 440 + p * p * 600); c.rotate(p * .9); calendar(c, 0, 0, 380, 380, top, big); c.restore(); };
S('M4b.0', { focus: [960, 460, 1.3], draw(c, T) { SET.office(c, T.t); calendar(c, 960, 440, 380, 380, '2026', 'MAY 26'); ripCal(c, T, 'PLAN', 'FALL 2025', 'then'); } });
S('M4b.1', { focus: [960, 460, 1.3], sfx: [['paper', ['then'], -8, { nth: 1 }]], draw(c, T) { SET.office(c, T.t); calendar(c, 960, 440, 380, 380, '2026', 'NOV 19'); ripCal(c, T, '2026', 'MAY 26', 'then', 1); } });
S('M4b.2', { focus: [960, 460, 1.3], sfx: [['stamp', 'november', -10]], draw(c, T) { SET.office(c, T.t); calendar(c, 960, 440, 380, 380, '2026', 'NOV 19', { circle: T.at('november', .6) }); circ(c, 960, 240, 16, RED, 4); } });
S('M4c.0', { focus: [960, 560, 1.2], sfx: [['crowd2', 0, -14, { len: 2 }]], draw(c, T) { SET.street(c, T.t, { noHQ: true }); for (let i = 0; i < 5; i++) P('investor', { x: 300 + i * 330, y: 1010, s: .85, t: T.t, seed: 80 + i, body: ['#c0392b', '#2f7f86', '#3a5f8f', '#e67e22', '#2f9e6b'][i], hair: ['curly', 'bun', 'short', 'long', 'short'][i], expr: 'shock', pose: 'armsUp', sweat: i % 2 === 0 }); } });
S('M4d.0', { focus: [960, 520, 1.3], draw(c, T) { SET.spot(c, T.t); c.save(); c.translate(820, 560); c.rotate(.12); star(c, 0, 0, 200, 'sad', T.t, { arms: [[-.3, .7], [.9, .6]] }); c.restore(); c.save(); c.translate(1280, 600); c.rotate(-.05); box(c, -200, -240, 400, 480, 10, '#fffdf3'); label(c, 'WE ARE SORRY', 0, -170, 42, INK, { stroke: false }); for (let i = 0; i < 5; i++) line(c, -150, -80 + i * 56, 150 - (i % 2) * 60, -80 + i * 56, 6, '#c9cfd6'); c.restore(); } });
S('M4d.1', { focus: [960, 520, 1.3], draw(c, T) { SET.spot(c, T.t); box(c, 460, 220, 1000, 600, 12, '#fffdf3'); label(c, 'WE ARE SORRY FOR ADDING', 960, 360, 54, INK, { stroke: false }); label(c, 'ADDITIONAL TIME TO WHAT', 960, 450, 54, INK, { stroke: false }); label(c, 'HAS BEEN A LONG WAIT', 960, 540, 54, INK, { stroke: false }); label(c, 'NOV 2025', 1300, 700, 34, '#8a8f98', { stroke: false }); } });
S('M4e.0', { focus: [960, 540, 1.3], draw(c, T) { SET.spot(c, T.t); box(c, 800, 700, 320, 240, 12, '#5d4037'); line(c, 960, 700, 960, 640, 6); circ(c, 960, 630, 14, '#333', 3); P('ceo', { x: 960, y: 940, s: 1, t: T.t, expr: 'neutral', pose: 'point', talk: true }); sign(c, 960, 780, 260, 60, 'TAKE-TWO CEO', { bg: '#fff8e1', size: 30 }); } });
S('M4e.1', { focus: [960, 540, 1.25], shakes: [['bad']], sfx: [['crumble', 'bad', -10, { len: 1.6 }]], draw(c, T) {
  SET.store(c, T.t, { sign: 'RUSHED' }); c.save(); c.translate(960, 900); c.rotate(.08); gameBox(c, 0, 0, 340, 460, { title: 'RIVAL', pal: ['#9aa3ad', '#c9cfd6'], face: T.since('bad') > 0 ? 'shock' : 'worried', t: T.t }); c.restore(); for (let i = 0; i < 4; i++) circ(c, 1100 + i * 30, 380 - ((T.t * 60 + i * 40) % 160), 30 + i * 6, 'rgba(120,120,130,.7)', 3);
  label(c, 'BAD THINGS HAPPEN', 960, 230, 60, RED, { stroke: false }); line(c, 820, 560, 900, 620, 6); line(c, 1040, 760, 1090, 700, 6);
} });
card('M4f.0', 'So what did those extra months buy?');
S('M4g.0', { focus: [1100, 500, 1.3], shakes: [['99']], sfx: [['stamp', '99', -4]], draw(c, T) { SET.office(c, T.t, { wall: '#d7e6f0' }); box(c, 900, 260, 560, 560, 10, '#fff'); label(c, 'REVIEW SCORE', 1180, 320, 44, INK, { stroke: false }); stamp(c, 1180, 560, '99', T.at('99', .4), '#1faa55', { w: 320, h: 240 }); P('critic', { x: 520, y: 1000, s: 1, t: T.t, expr: 'grin', pose: 'point' }); } });
S('M4g.1', { focus: [960, 540, 1.25], sfx: [['cheer', 'highest', -14]], draw(c, T) { SET.museum(c, T.t); trophy(c, 960, 640, 1.2, 'HIGHEST EVER'); gameBox(c, 600, 880, 220, 310, {}); cartridge(c, 1320, 880, 1.2, 'CLASSIC 1998'); label(c, 'TIED AT 99', 960, 180, 60, INK, { stroke: false }); } });
S('M4h.0', { focus: [960, 520, 1.2], draw(c, T) { SET.store(c, T.t, { empty: true, sign: 'THIS YEAR' }); [700, 1220].forEach(x => gameBox(c, x, 760, 160, 220, { title: 'NEW GAME', pal: ['#9ec5e8', '#c9d3de'] })); label(c, 'ONLY 2 BIG GAMES', 960, 400, 56, INK, { stroke: false }); calendar(c, 960, 930, 200, 150, 'BEFORE GTA 6', '6 WEEKS'); } });
S('M4h.1', { focus: [960, 520, 1.2], sfx: [['ding', '10', -10]], draw(c, T) { SET.store(c, T.t, { sign: 'A YEAR EARLIER' }); for (let i = 0; i < 10; i++) gameBox(c, 560 + (i % 5) * 200, 640 + Math.floor(i / 5) * 260, 130, 190, { title: 'GAME', pal: ['#9ec5e8', '#c9d3de'] }); label(c, '10 BIG GAMES', 960, 330, 56, INK, { stroke: false }); } });
S('M4i.0', { focus: [960, 540, 1.2], draw(c, T) { SET.stadium(c, T.t); gameBox(c, 960, 900, 300, 420, {}); lightPool(c, 960, 640, 400, '#fff2b0', .5); for (let i = 0; i < 4; i++) { const x = (i < 2 ? 300 - T.lt * 260 : 1620 + T.lt * 260) + (i % 2) * 140 * (i < 2 ? -1 : 1); gameBox(c, x, 900, 120, 170, { title: 'GAME', pal: ['#9ec5e8', '#c9d3de'], face: 'worried', t: T.t }); } label(c, 'OUT OF THE WAY', 960, 200, 56, '#fff'); } });
S('M4j.0', { focus: [960, 520, 1.25], shakes: [['average']], sfx: [['stamp', 'average', -6]], draw(c, T) { SET.grid(c, T.t); gameBox(c, 960, 860, 300, 420, { title: 'AVERAGE', pal: ['#9aa3ad', '#c9cfd6'], face: 'bored', t: T.t }); const p = T.at('average', .35); if (p > 0) { c.save(); c.globalAlpha = clamp(p * 3); line(c, 700, 360, 1220, 900, 22, RED); line(c, 1220, 360, 700, 900, 22, RED); c.restore(); } label(c, 'WHERE A DELAY HURTS', 960, 200, 50, INK, { stroke: false }); } });
S('M4j.1', { focus: [960, 520, 1.2], draw(c, T) { SET.spot(c, T.t); balance(c, 960, 940, -.16, (x, y) => { calendar(c, x, y - 110, 200, 180, 'TIME', '6 MONTHS'); }, (x, y) => { stamp(c, x - 60, y - 120, '99', 1, '#1faa55', { w: 130, h: 100, rot: 0 }); box(c, x + 20, y - 80, 140, 70, 8, '#8f969e'); label(c, 'EMPTY ROAD', x + 90, y - 45, 22, '#fff'); }); label(c, 'TRADED', 960, 160, 56, '#fff'); } });
card('M4k.0', "When you're clearly the best thing in the room, you end up being the only thing in it.");

// ======================= THE FINE PRINT =======================
chap('F1.0', 'BEFORE MOVE FIVE', 'The Fine Print');
S('F1.1', { focus: [960, 560, 1.25], sfx: [['pop', 'except', -8]], draw(c, T) { SET.vault(c, T.t); coinPile(c, 900, 920, 900, 420, 2); money(c, '$3.79B', 900, 640, 110, 'gold'); if (T.since('except') > 0) label(c, '*', 1260, 560, 200 * clamp(T.at('except', .3) * 1.4), '#fff', { stroke: true }); } });
card('F2.0', "Rockstar didn't really make $3.79 billion on day one.");
S('F3.0', { focus: [960, 520, 1.3], draw(c, T) { SET.office(c, T.t); box(c, 560, 260, 800, 520, 8, '#fffdf3'); for (let i = 0; i < 9; i++) line(c, 620, 320 + i * 50, 1300 - (i % 3) * 80, 320 + i * 50, 5, '#c9cfd6'); magnifier(c, 960, 560, 170, () => { label(c, 'DAY ONE', 960, 530, 54, INK, { stroke: false }); label(c, 'RETAIL SALES', 960, 600, 44, INK, { stroke: false }); }); label(c, 'THE FINE PRINT', 960, 180, 48, INK, { stroke: false }); } });
S('F3.1', { focus: [960, 520, 1.25], draw(c, T) { SET.night(c, T.t); globe(c, 820, 440, 230, T.t); for (let i = 0; i < 8; i++) coin(c, 1100 + ((T.lt * 200 + i * 80) % 480), 300 + i * 40, 22); calendar(c, 1560, 760, 240, 220, 'THROUGH', 'NOV 19'); label(c, 'WHAT PLAYERS SPENT', 960, 900, 48, '#fff'); } });
S('F4.0', { focus: [960, 520, 1.25], shakes: [['audited']], sfx: [['stamp', 'estimate', -8], ['stamp', 'audited', -6]], draw(c, T) { SET.office(c, T.t); clipboard(c, 900, 500, 520, 560, ['DAY ONE', 'RETAIL SALES', '$3.79B'], { col: [INK, INK, '#c9971a'] }); stamp(c, 900, 420, 'COMPANY ESTIMATE', T.at('estimate', .35), '#1d6fb8', { w: 460, h: 90, rot: .05 }); stamp(c, 900, 620, 'NOT AUDITED YET', T.at('audited', .35), RED, { w: 460, h: 90 }); P('analyst', { x: 1500, y: 1000, s: .95, t: T.t, expr: 'neutral', pose: 'idle', flip: true }); } });
S('F5.0', { focus: [960, 520, 1.2], draw(c, T) { SET.grid(c, T.t); box(c, 360, 420, 900, 180, 10, '#9ec5e8'); label(c, 'MONTHS OF PRE-ORDERS', 810, 510, 46, INK, { stroke: false }); c.save(); c.setLineDash([14, 10]); rr(c, 1260, 420, 300, 180, 10); fs(c, '#ffe9a0', 4); c.restore(); label(c, 'LAUNCH DAY', 1410, 480, 30, INK, { stroke: false }); label(c, '?', 1410, 540, 70, RED, { stroke: false }); label(c, '$3.79B', 960, 340, 50, INK, { stroke: false }); } });
S('F6.0', { focus: [960, 560, 1.25], draw(c, T) { SET.pizza(c, T.t); pizza(c, 960, 640, 380, 0, '$3.79B'); star(c, 1650, 760, 120, 'grin', T.t); } });
S('F6.1', { focus: [1100, 560, 1.25], sfx: [['whoosh3', 'sony', -10], ['whoosh1', 'microsoft', -10], ['ding', '30', -12]], draw(c, T) { SET.pizza(c, T.t); const a = T.since('sony') > 0 ? 1 : 0, b = T.since('microsoft') > 0 ? 1 : 0; pizza(c, 700, 660, 330, 1 + a + b, ''); consoleBox(c, 1250, 1000, 1.1, 'SONY', 'grin', T.t, '#1b1f2a', 2); consoleBox(c, 1620, 1000, 1.1, 'MICROSOFT', 'smug', T.t, '#1f3a1f', 3); if (a) slice(c, 1350, 820, .7, .3); if (b) slice(c, 1720, 820, .7, .3); stamp(c, 1440, 330, '~30% CUT', T.at('30', .4), RED, { w: 360, h: 110 }); } });
S('F7.0', { focus: [960, 560, 1.25], sfx: [['whoosh2', 'retailers', -10]], draw(c, T) { SET.store(c, T.t); P('clerk', { x: 1200, y: 1010, s: 1.05, t: T.t, expr: 'grin', pose: 'holdUp', flip: true, item: (cc, h) => slice(cc, h[1][0], h[1][1] + 60, .9, -.2) }); gameBox(c, 700, 900, 260, 360, {}); label(c, 'PHYSICAL COPIES', 700, 470, 40, '#fff'); } });
S('F8.0', { focus: [960, 560, 1.25], draw(c, T) { SET.lobby(c, T.t); coinPile(c, 560, 920, 640, 360, 5); label(c, 'WHAT PLAYERS SPENT', 560, 480, 36, INK, { stroke: false }); moneyBag(c, 1160, 900, 1); label(c, 'NET BOOKINGS', 1160, 700, 40, '#1faa55', { stroke: false }); P('exec', { x: 1560, y: 1000, s: .95, t: T.t, expr: 'smug', pose: 'point', flip: true }); } });
S('F9.0', { focus: [960, 520, 1.25], draw(c, T) { SET.office(c, T.t); const h = lerp(200, 640, easeOut(T.in(0, 1.6))); receipt(c, 960, 160 + h / 2, 420, h, ['COST TO MAKE', '...', '$1B - $3B'], { cols: [INK, '#8a8f98', RED], size: 44 }); } });
S('F9.1', { focus: [960, 520, 1.35], draw(c, T) { SET.spot(c, T.t); star(c, 820, 520, 200, 'neutral', T.t, { arms: [[-1.4, -.5], [1.4, -.5]] }); stamp(c, 1340, 480, 'NOT CONFIRMED', T.at('confirmed', .35), RED, { w: 440, h: 110 }); } });
S('F10.0', { focus: [960, 520, 1.3], shakes: [['no']], sfx: [['stamp', 'no', -4]], draw(c, T) { SET.office(c, T.t); newspaper(c, 960, 480, 760, 540, 'HEADLINE'); money(c, '$3.79B DAY ONE', 960, 460, 64, 'gold'); stamp(c, 960, 640, 'NOT FAKE', T.at('no', .35), '#1faa55', { w: 380, h: 120 }); } });
S('F10.1', { focus: [960, 540, 1.25], sfx: [['cheer', 'biggest', -14]], draw(c, T) { SET.spot(c, T.t); trophy(c, 960, 700, 1.4, 'BIGGEST LAUNCH'); label(c, 'IN ENTERTAINMENT HISTORY', 960, 180, 48, GOLD, { glow: GOLD }); } });
S('F11.0', { focus: [960, 540, 1.2], sfx: [['whoosh2', 'heres', -10]], draw(c, T) { SET.street(c, T.t, { noHQ: true, noTrees: true }); const p = easeOut(T.at('heres', .8)); c.save(); c.globalAlpha = 1 - p * .7; rocket(c, 520, 860, lerp(1, .6, p)); c.restore(); label(c, 'THE LAUNCH', 520, 960, 40, INK, { stroke: false }); if (p > 0) { c.save(); c.globalAlpha = p; factory(c, 1260, 900, 700, T.t); label(c, 'THE BUSINESS', 1260, 960, 44, '#fff'); c.restore(); } } });

// ======================= MOVE 5: THE LONG GAME =======================
chap('M5a.0', 'MOVE FIVE', 'The Long Game');
S('M5a.1', { focus: [960, 480, 1.25], sfx: [['ding', '815'], ['party', 'record', -16]], draw(c, T) { SET.store(c, T.t, { sign: 'GTA V' }); counter(c, 960, 400, 820, 210, '$' + Math.round(num(T, '815', 815, 1)) + 'M', 'gold', { cap: 'FIRST 24 HOURS' }); calendar(c, 420, 760, 220, 210, 'YEAR', '2013'); stamp(c, 1420, 760, 'RECORD', T.at('record', .35), '#1faa55', { w: 300, h: 100 }); } });
S('M5b.0', { focus: [960, 560, 1.2], sfx: [['ding', '230', -12]], draw(c, T) { SET.store(c, T.t, { sign: 'STILL SELLING' }); conveyor(c, 960, 760, 1600, T.t, (x, y) => gameBox(c, x, y, 90, 130, { title: 'GTA V' })); money(c, '230M COPIES', 960, 420, 80, 'gold'); } });
S('M5b.1', { focus: [960, 560, 1.25], sfx: [['ding', 'online', -8], ['coin', 0.8, -12]], draw(c, T) { SET.night(c, T.t); cashRegister(c, 960, 900, 1.6, Math.sin(T.t * 8) > 0); sign(c, 960, 320, 520, 100, 'GTA ONLINE', { bg: '#1d3557', fg: '#fff', size: 54 }); for (let i = 0; i < 6; i++) coin(c, 600 + i * 145, 560 - Math.abs(Math.sin(T.t * 4 + i)) * 120, 30); label(c, 'YEARS OF IN-GAME SPENDING', 960, 1010, 40, '#fff'); } });
S('M5c.0', { focus: [960, 500, 1.25], sfx: [['ding', '9']], draw(c, T) { SET.lobby(c, T.t); cabinet(c, 460, 960, 1.1, true); counter(c, 1160, 400, 820, 220, T.since('9') > 0 ? '$' + Math.round(num(T, '9', 9, 1)) + 'B+' : '...', 'gold', { cap: 'SINCE GTA V LAUNCHED' }); label(c, "FROM TAKE-TWO'S FILINGS", 1160, 620, 34, INK, { stroke: false }); } });
S('M5d.0', { focus: [960, 520, 1.2], draw(c, T) { SET.vault(c, T.t); balance(c, 960, 940, .3, (x, y) => { coinPile(c, x, y + 10, 300, 300, 9); money(c, '$9B+', x, y - 330, 60, 'gold'); }, (x, y) => { coin(c, x, y - 30, 30); label(c, 'DAY ONE', x, y - 110, 34, '#fff'); }); label(c, 'SMALL CHANGE', 1320, 140, 54, '#fff'); } });
S('M5e.0', { focus: [960, 540, 1.25], sfx: [['hit', 'without', -10]], draw(c, T) { SET.spot(c, T.t); gameBox(c, 760, 900, 360, 500, {}); c.save(); c.setLineDash([16, 12]); rr(c, 1080, 460, 380, 440, 20); fs(c, null, 5); c.restore(); label(c, 'ONLINE MODE', 1270, 620, 44, '#fff'); label(c, 'NOT YET', 1270, 720, 56, RED, { stroke: false }); } });
S('M5f.0', { focus: [960, 600, 1.2], draw(c, T) { SET.street(c, T.t, { noHQ: true }); truck(c, 400 + T.lt * 120, 960, 1.6); box(c, 300 + T.lt * 120, 640, 120, 80, 8, '#5dade2'); label(c, 'ONLINE', 360 + T.lt * 120, 680, 26, '#fff'); box(c, 440 + T.lt * 120, 650, 100, 70, 8, '#e0b13e'); label(c, 'PC', 490 + T.lt * 120, 685, 28, '#fff'); sign(c, 1500, 500, 380, 90, 'COMING LATER', { bg: '#fff8e1', size: 42, post: 380 }); } });
S('M5g.0', { focus: [960, 560, 1.2], sfx: [['ding', '32', -10]], draw(c, T) { SET.houses(c, T.t, { lit: () => 1 }); box(c, 820, 180, 280, 160, 10, '#e74c3c'); label(c, 'SHOP', 960, 260, 44, '#fff'); for (let i = 0; i < 5; i++) { const x = 230 + i * 380; c.save(); c.setLineDash([12, 10]); c.beginPath(); c.moveTo(x + 150, 460); c.quadraticCurveTo((x + 960) / 2, 200, 960, 340); c.lineWidth = 5; c.strokeStyle = GOLD; c.stroke(); c.restore(); } money(c, '32.5M BUYERS', 960, 960, 60, 'gold'); label(c, 'SELL TO AGAIN', 960, 1030, 34, '#fff'); } });
card('M5h.0', "The launch wasn't the payday. It was customer acquisition.");
S('M5i.0', { focus: [960, 560, 1.2], draw(c, T) { SET.night(c, T.t); const p = easeOut(T.in(.2, 1.6)); for (let i = 0; i < 24; i++) { const R = rand(i + 3), sx = 400 + R() * 300, sy = 300 + R() * 200, tx = 300 + (i % 12) * 120, ty = 840 + Math.floor(i / 12) * 90; if (p < .5) coin(c, lerp(sx, tx, p * 2), lerp(sy, ty, p * 2), 22); else { const k = (p - .5) * 2; c.save(); c.globalAlpha = k; ell(c, tx, ty - 20, 22, 28, ['#e8553c', '#3a7bd5', '#f2b134', '#5ab65a'][i % 4], 3); circ(c, tx, ty - 62, 18, SKIN[i % 5], 3); c.restore(); } } money(c, '$3.79B', 560, 220, 70, 'gold'); label(c, '= TENS OF MILLIONS OF CUSTOMERS', 1220, 220, 40, '#fff'); } });
S('M5i.1', { focus: [960, 520, 1.25], sfx: [['ding', 'paying', -12], ['ding', 'decade', -12]], draw(c, T) { SET.office(c, T.t); const yr = 2026 + Math.min(10, Math.floor(T.lt * 3.5)); calendar(c, 640, 420, 340, 340, 'YEAR', String(yr)); cashRegister(c, 1300, 860, 1.3, Math.sin(T.t * 7) > 0); label(c, 'THE NEXT DECADE', 960, 900, 48, INK, { stroke: false }); } });
card('M5j.0', "Don't just build a launch. Build what comes after it.");
card('E1.0', 'How did GTA 5 take one game and turn it into a $9 billion run that refused to die for thirteen years?');
S('E2.0', { focus: [960, 520, 1.15], push: .03, draw(c, T) { SET.spot(c, T.t); box(c, 560, 220, 800, 450, 18, '#0d1420'); rr(c, 560, 220, 800, 450, 18); fs(c, null, 6); label(c, 'WATCH NEXT', 960, 380, 64, '#fff'); label(c, 'HOW GTA V MADE $9B+', 960, 470, 40, GOLD, { stroke: false }); playIcon(c, 960, 570, 50); star(c, 360, 740, 130, 'grin', T.t, { arms: [[-1.2, .2], [1.4, -.6]] }); P('exec', { x: 1580, y: 960, s: .85, t: T.t, expr: 'grin', pose: 'point', flip: true }); } });
