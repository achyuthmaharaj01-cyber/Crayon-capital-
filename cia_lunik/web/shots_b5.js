// ---------- scene builder b5: 7 A.M. (D), WHAT THEY LEARNED (L), AFTERMATH (A) ----------
// Every action lands on the spoken word (T.at / T.since). Hedged claims stay hedged on screen.
(() => {
const chap5 = (k, n, title) => S(k, { card: (c, T) => chapterCard(c, T, n, title) });
const pop = (T, w, d = .45) => T.at(w, d);
const arrive = (c, p, x, y, f) => { if (p <= 0) return; c.save(); c.translate(x, y + (1 - back(p)) * 40); c.globalAlpha = clamp(p * 2); f(); c.restore(); };
const tag = (c, text, x, y, p = 1, o = {}) => { if (p <= 0) return; c.save(); c.globalAlpha = clamp(p * 2); c.font = `700 ${o.size || 30}px Kalam`; const w = c.measureText(text.toUpperCase()).width + 44, h = (o.size || 30) * 1.6;
  c.translate(x, y + (1 - easeOut(p)) * 18); c.rotate(o.rot ?? -.03); box(c, -w / 2, -h / 2, w, h, 10, o.bg || '#fff1c4', 3.5); label(c, text, 0, 0, o.size || 30, o.col || '#7a5a20', { stroke: false }); c.restore(); };
const typed = (T, text, a, b) => text.slice(0, Math.round(text.length * clamp((T.t - a) / Math.max(.1, b - a))));
const dawnSun = (c, x, y, r, k) => { lightPool(c, x, y, r * 5, '#ffcf8a', .5 * k); circ(c, x, y, r, '#ffe0a0', 0); };
// small helpers drawn here (scene-specific props)
function factoryIcon(c, x, y, s = 1, col = '#e8f1ff', fill = '#2a4f7a') { c.save(); c.translate(x, y); c.scale(s, s); reg(c, -90, -150, 90, 0);
  c.beginPath(); c.moveTo(-80, 0); c.lineTo(-80, -70); for (let i = 0; i < 3; i++) { c.lineTo(-80 + i * 50, -110); c.lineTo(-30 + i * 50, -70); } c.lineTo(80, -70); c.lineTo(80, 0); c.closePath(); c.fillStyle = fill; c.fill(); c.lineWidth = 4; c.strokeStyle = col; c.stroke();
  box(c, 46, -150, 22, 80, 3, fill); c.lineWidth = 4; c.strokeStyle = col; c.strokeRect(46, -150, 22, 80); for (let i = 0; i < 3; i++) { c.strokeRect(-62 + i * 46, -46, 26, 26); } c.restore(); }
function gauge(c, x, y, r, p, name, col) { reg(c, x - r - 20, y - r - 20, x + r + 20, y + 90);
  c.beginPath(); c.arc(x, y, r, Math.PI, TAU); c.closePath(); fs(c, '#f6f1e2', 5);
  c.save(); c.beginPath(); c.moveTo(x, y); c.arc(x, y, r - 14, Math.PI, Math.PI + Math.PI * easeOut(p)); c.closePath(); c.fillStyle = col; c.globalAlpha = .85; c.fill(); c.restore();
  for (let i = 0; i <= 10; i++) { const a = Math.PI + i * Math.PI / 10; line(c, x + Math.cos(a) * (r - 4), y + Math.sin(a) * (r - 4), x + Math.cos(a) * (r - 22), y + Math.sin(a) * (r - 22), 3); }
  const a = Math.PI + Math.PI * easeOut(p); line(c, x, y, x + Math.cos(a) * (r - 30), y + Math.sin(a) * (r - 30), 9); circ(c, x, y, 14, INK, 0);
  label(c, name, x, y + 56, 46, '#fff'); }
function sub(c, x, y, L, o = {}) { c.save(); c.translate(x, y); reg(c, -L / 2, -L * .22, L / 2, L * .1);
  const col = o.col || '#1a2230'; c.beginPath(); c.ellipse(0, 0, L / 2, L * .075, 0, 0, TAU); c.fillStyle = col; c.fill(); c.lineWidth = 5; c.strokeStyle = o.rim || 'rgba(120,170,210,.55)'; c.stroke();
  rr(c, -L * .1, -L * .17, L * .16, L * .11, 18); c.fillStyle = col; c.fill(); c.stroke();
  poly(c, [[-L / 2 + 6, 0], [-L / 2 - 40, -L * .06], [-L / 2 - 40, L * .06]], col, 0); c.lineWidth = 5; c.strokeStyle = o.rim || 'rgba(120,170,210,.55)'; c.stroke();
  c.save(); c.globalAlpha = .35; line(c, -L * .42, -L * .03, L * .4, -L * .03, 4, '#cfe3ff'); c.restore(); for (let i = 0; i < 6; i++) circ(c, -L * .3 + i * L * .12, L * .01, 5, 'rgba(150,190,220,.4)', 0);
  if (o.star) { c.save(); c.globalAlpha = o.star; poly(c, starPts(-L * .02, -L * .12, L * .022), '#b8322a', 0); c.restore(); }
  c.restore(); }
function bubbles(c, t, x0, x1, n, seed = 5, a = .5) { const R = rand(seed); for (let i = 0; i < n; i++) { const bx = lerp(x0, x1, R()), sp = 80 + R() * 140, ph = R() * 20; const by = 1200 - ((t * sp + ph * 60) % 1500); circ(c, bx + Math.sin(t * 2 + i) * 10, by, 4 + R() * 10, null, 0); c.save(); c.globalAlpha = a; c.lineWidth = 3; c.strokeStyle = '#bfe3ff'; c.beginPath(); c.arc(bx + Math.sin(t * 2 + i) * 10, by, 4 + R() * 10, 0, TAU); c.stroke(); c.restore(); } }
function water(c, depth) { // depth 0 (surface) .. 1 (abyss)
  bg(c, mixHex('#1f5a86', '#050a14', clamp(depth * 1.2)), mixHex('#0b2a46', '#010204', clamp(depth * 1.1)));
  for (let i = 0; i < 7; i++) { c.save(); c.globalAlpha = .07 * (1 - depth); c.fillStyle = '#bfe3ff'; c.beginPath(); c.moveTo(300 + i * 220, -300); c.lineTo(380 + i * 220, -300); c.lineTo(160 + i * 260, 1300); c.lineTo(60 + i * 260, 1300); c.closePath(); c.fill(); c.restore(); } }
function mixHex(a, b, k) { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], k)).toString(16).padStart(2, '0')).join(''); }
function cityRoute(c, T, p, truckP) { // paper street map: X spot -> RAIL YARD
  box(c, 260, 140, 1400, 800, 14, '#efe6cc', 5); c.save(); rr(c, 260, 140, 1400, 800, 14); c.clip();
  for (let x = 300; x < 1660; x += 150) box(c, x, 140, 26, 800, 0, '#ddd0ac', 0); for (let y = 190; y < 940; y += 130) box(c, 260, y, 1400, 24, 0, '#ddd0ac', 0);
  box(c, 260, 520, 1400, 46, 0, '#d2c39a', 0); line(c, 260, 543, 1660, 543, 3, 'rgba(255,255,255,.6)');
  for (let i = 0; i < 9; i++) { const x = 1250 + i * 40; line(c, x, 230, x + 300, 230, 5, '#8a7d6c'); } // rail lines
  [230, 260, 290].forEach(y => line(c, 1200, y, 1660, y, 5, '#6d6152')); for (let x = 1200; x < 1660; x += 26) line(c, x, 222, x, 298, 3, '#8a7d6c');
  c.restore();
  const pts = [[520, 780], [520, 543], [1080, 543], [1080, 330], [1400, 330], [1400, 300]];
  const segL = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1])), tot = segL.reduce((a, b) => a + b, 0);
  const at = u => { let d = u * tot; for (let i = 0; i < segL.length; i++) { if (d <= segL[i]) { const k = d / segL[i]; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k), i]; } d -= segL[i]; } return [...pts[pts.length - 1], segL.length - 1]; };
  c.save(); c.setLineDash([18, 14]); c.lineWidth = 9; c.strokeStyle = '#d9342b'; c.lineCap = 'round'; c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
  const [ex, ey, ei] = at(clamp(p)); for (let i = 1; i <= ei; i++) c.lineTo(pts[i][0], pts[i][1]); c.lineTo(ex, ey); c.stroke(); c.restore();
  line(c, 490, 750, 550, 810, 10, '#d9342b'); line(c, 550, 750, 490, 810, 10, '#d9342b'); label(c, 'THE SPOT', 520, 860, 40, INK, { stroke: false });
  label(c, 'RAIL YARD', 1430, 190, 48, INK, { stroke: false }); label(c, 'MEXICO CITY (MOST LIKELY)', 760, 900, 30, '#6a6050', { stroke: false });
  const [tx, ty] = at(clamp(truckP)); c.save(); c.translate(tx, ty); box(c, -34, -20, 68, 40, 8, '#4f6d5a', 4); box(c, 6, -20, 28, 40, 6, '#3d5848', 3); c.restore();
  if (p >= 1) { circ(c, 1400, 300, 18, GOLD, 4); }
}
function ledger(c, x, y, w, h, rows, tickN, tickP, o = {}) { c.save(); c.translate(x, y); c.rotate(o.rot ?? -.02); reg(c, -w / 2, -h / 2 - 20, w / 2, h / 2);
  box(c, -w / 2, -h / 2, w, h, 14, '#b07a45'); box(c, -w / 2 + 18, -h / 2 + 34, w - 36, h - 52, 4, '#fbf8ee', 3); box(c, -w * .16, -h / 2 - 14, w * .32, 40, 8, '#9aa0a6', 3.5);
  label(c, o.title || 'RAIL YARD LOG', 0, -h / 2 + 80, 40, INK, { stroke: false }); line(c, -w / 2 + 40, -h / 2 + 112, w / 2 - 40, -h / 2 + 112, 3);
  rows.forEach((r, i) => { const ry = -h / 2 + 160 + i * 64; label(c, r, -w / 2 + 60, ry, 30, '#3d342a', { stroke: false, align: 'left', maxW: w - 190 });
    box(c, w / 2 - 92, ry - 22, 44, 44, 6, null, 3);
    const tp = i < tickN ? 1 : i === tickN ? tickP : 0; if (tp > 0) { c.save(); c.lineWidth = 9; c.strokeStyle = '#1d4f8a'; c.lineCap = 'round'; c.beginPath(); const a = [w / 2 - 84, ry], b = [w / 2 - 70, ry + 14], d = [w / 2 - 42, ry - 26];
      const k = clamp(tp * 2); c.moveTo(...a); c.lineTo(lerp(a[0], b[0], clamp(k * 2)), lerp(a[1], b[1], clamp(k * 2))); if (k > .5) c.lineTo(lerp(b[0], d[0], (k - .5) * 2), lerp(b[1], d[1], (k - .5) * 2)); c.stroke(); c.restore(); } });
  if (o.sign != null) { const sy = h / 2 - 70; label(c, 'RECEIVED:', -w / 2 + 60, sy, 30, '#6a6050', { stroke: false, align: 'left' }); line(c, -w / 2 + 210, sy + 20, w / 2 - 50, sy + 20, 3, '#9a917c');
    if (o.sign > 0) { c.save(); c.lineWidth = 6; c.strokeStyle = '#1d4f8a'; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); const N = 80, n = Math.floor(N * clamp(o.sign));
      for (let i = 0; i <= n; i++) { const u = i / N, px = -w / 2 + 230 + u * (w - 320), py = sy + 4 - Math.sin(u * 30) * 18 * (1 - u * .5) - Math.sin(u * 7) * 8 + (u > .9 ? (u - .9) * 300 : 0); i ? c.lineTo(px, py) : c.moveTo(px, py); } c.stroke(); c.restore(); } }
  c.restore(); }
function sawFactory(c, x, y, s, col) { c.save(); c.translate(x, y); c.scale(s, s); for (let i = 0; i < 8; i++) { poly(c, [[i * 240 - 960, 0], [i * 240 - 960, -140], [i * 240 - 760, -60], [i * 240 - 720, -60], [i * 240 - 720, 0]], col, 3); windowRect(c, i * 240 - 940, -110, 160, 46, '#ffe7a8'); } c.restore(); }

// ======================= 7 A.M. =======================
chap5('D1.0', 11, '7 A.M.');
S('D1.1', { cams: [[960, 640, 1.08]], sfx: [['truck2', 0, -14, { len: 2.6 }], ['stamp', 'prearranged', -16]], draw(c, T) {
  const L = SET.road(c, T.t, { dusk: .62, sign: 'ESTACIÓN' }); const stop = T.cue('prearranged') + .3; const k = easeOut(clamp((T.t - T.shot.start) / (stop - T.shot.start)));
  const mx = 1420; c.save(); c.globalAlpha = .9; line(c, mx - 60, 990, mx + 60, 1040, 14, '#e8e2d0'); line(c, mx + 60, 990, mx - 60, 1040, 14, '#e8e2d0'); c.restore();
  truck59(c, lerp(-300, mx - 470, k), 1010, .95, { crate: true, driver: 'newdriver', lights: 1, moving: k < .98, t: T.t });
  P('dean', { x: 1760, y: 1000, s: .9, t: T.t, expr: 'focus', pose: 'idle', flip: true, look: -1 });
  GRADE.night(c, L, .22); GRADE.dawn(c, .2);
  tag(c, 'PREARRANGED SPOT', mx, 800, pop(T, 'prearranged', .5), { bg: '#1d2a3d', col: '#ffd27a' });
}, overlay: (c, T) => nightClockOverlay(c, 5, 0, { sub: 'PRE-DAWN' }) });
S('D2.0', { cams: [[700, 640, 1.18]], sfx: [['door', 'there', -14], ['steps', 'original', -20, { len: 2 }]], draw(c, T) {
  const L = SET.road(c, T.t, { dusk: .75, sign: 'ESTACIÓN' }); truck59(c, 1500, 1010, .95, { crate: true, t: T.t });
  const w = clamp(T.since('original') / 2.2); P('driver', { x: lerp(260, 820, easeOut(w)), y: 1010, s: 1.05, t: T.t, walk: w > 0 && w < 1, expr: T.since('night') > 0 && T.since('night') < 1.3 ? 'bored' : 'sad', pose: 'idle', leanBody: .05 });
  roomKey(c, lerp(260, 820, easeOut(w)) - 70, 790, .7, '12');
  GRADE.night(c, L, .16); GRADE.dawn(c, .28);
  tag(c, 'AFTER A NIGHT IN A HOTEL ROOM', 640, 380, pop(T, 'night', .5));
} });
S('D2.1', { cams: [[1180, 760, 1.35]], sfx: [['door', 'wheel', -12], ['carengine', 'drove', -12]], draw(c, T) {
  const L = SET.road(c, T.t, { dusk: .85, sign: 'ESTACIÓN' }); const inCab = T.since('wheel') > 0, go = clamp(T.since('drove') / 1.2);
  truck59(c, 1040 + go * 120, 1010, 1.05, { crate: true, driver: inCab ? 'driver' : null, driverExpr: 'neutral', lights: inCab, moving: go > 0, t: T.t });
  if (!inCab) P('driver', { x: 1240, y: 1010, s: 1.0, t: T.t, pose: 'reach', expr: 'sad' });
  const off = clamp(T.since('back') / 2.4); P('newdriver', { x: lerp(1500, 1900, off), y: 1010, s: 1.0, t: T.t, walk: off > 0 && off < 1, expr: 'neutral', pose: 'handsBack', flip: false });
  GRADE.night(c, L, .12); GRADE.dawn(c, .3);
} });
S('D2.2', { cams: [[960, 520, 1.08]], sfx: [['pencil', 'drove', -14], ['ding', 'yard', -16]], draw(c, T) {
  SET.desk(c, T.t, { lx: 960, ly: 520 }); const p = clamp(T.since('drove') / (T.cue('yard') - T.cue('drove') + .3));
  cityRoute(c, T, p, p);
} });
S('D3.0', { cams: [[960, 560, 1.0], [760, 520, 1.25]], sfx: [['paper', 'cover', -12]], draw(c, T) {
  // inside the cab, dawn through the windscreen; he rehearses into the mirror
  bg(c, '#c99a78', '#5f7fa6'); dawnSun(c, 1500, 640, 70, 1); FLOOR(c, 700, '#3d3a36'); for (let i = 0; i < 5; i++) box(c, 140 + i * 360, 560, 220, 80, 6, '#6d7a86', 0);
  c.save(); c.globalAlpha = .9; box(c, -200, -100, 2320, 260, 0, '#2f3b33', 0); box(c, -200, 820, 2320, 400, 0, '#2f3b33', 0); box(c, -200, -100, 240, 1300, 0, '#2f3b33', 0); box(c, 1880, -100, 300, 1300, 0, '#2f3b33', 0); c.restore();
  rr(c, 40, 160, 1840, 660, 40); fs(c, null, 10);
  const h = P('driver', { x: 760, y: 1330, s: 2.1, t: T.t, pose: 'drive', expr: T.since('ready') > 0 ? 'smug' : 'worried', talk: T.since('he') > 0 });
  // rear-view mirror
  line(c, 1220, 160, 1220, 210, 10); box(c, 1020, 200, 400, 170, 26, '#1d2430', 6); c.save(); rr(c, 1034, 214, 372, 142, 18); c.clip(); c.fillStyle = '#c9d6e0'; c.fillRect(1030, 210, 380, 150);
  crayon(c, { ...CAST.driver, x: 1220, y: 470, s: .7, flip: true, expr: T.since('ready') > 0 ? 'smug' : 'worried', noShadow: true, t: T.t }); c.restore();
  arrive(c, pop(T, 'cover', .5), 1420, 600, () => { c.rotate(.05); box(c, -190, -110, 380, 220, 8, '#fbf8ee', 4); label(c, 'COVER STORY', 0, -50, 46, INK, { stroke: false }); for (let i = 0; i < 3; i++) line(c, -150, 10 + i * 34, 150 - i * 40, 10 + i * 34, 5, '#9a917c'); });
  tag(c, "PER MAYSH'S SOURCES", 400, 110, pop(T, 'sources', .5));
} });
S('D3.1', { cams: [[960, 540, 1.0], [1360, 560, 1.18]], sfx: [['creak', 'closed', -12], ['crickets', 'waited', -22, { len: 2.4 }]], draw(c, T) {
  SET.paper(c, T.t); label(c, 'HIS STORY', 960, 120, 64, INK, { stroke: false }); tag(c, 'THE COVER STORY, NOT WHAT HAPPENED', 960, 200, 1, { size: 24 });
  const panel = (x, p, f) => { if (p <= 0) return; c.save(); c.translate(0, (1 - easeOut(p)) * 40); c.globalAlpha = clamp(p * 2); box(c, x - 400, 270, 800, 680, 10, '#0f1d30', 7); c.save(); rr(c, x - 400, 270, 800, 680, 10); c.clip(); f(); c.restore(); rr(c, x - 400, 270, 800, 680, 10); fs(c, null, 7); c.restore(); };
  panel(520, clamp(T.since('arrived') / .4 + .2), () => { NIGHT_SKY(c, T.t, '#070f20', '#132a44', 40);
    box(c, 120, 780, 800, 200, 0, '#2c2a2a', 0); for (let i = 0; i < 14; i++) line(c, 190 + i * 46, 520, 190 + i * 46, 800, 8, '#6a6f78'); line(c, 170, 540, 850, 540, 8, '#6a6f78'); line(c, 170, 700, 850, 700, 8, '#6a6f78');
    const k = pop(T, 'closed', .4); if (k > 0) { arrive(c, k, 520, 610, () => { box(c, -150, -45, 300, 90, 8, '#e9e4d6', 4); label(c, 'CERRADO', 0, -8, 40, '#b8322a', { stroke: false }); label(c, 'CLOSED', 0, 26, 22, INK, { stroke: false }); }); }
    P('driver', { x: 300, y: 930, s: .7, t: T.t, expr: 'worried', pose: 'shrug' }); label(c, 'AFTER THE YARD CLOSED', 520, 330, 34, '#ffd27a'); });
  panel(1400, clamp(T.since('waited') / .4 + .1), () => { NIGHT_SKY(c, T.t, '#070f20', '#132a44', 50); moon(c, 1600, 380, 50); box(c, 1000, 780, 800, 200, 0, '#2c2a2a', 0);
    crate(c, 1430, 860, 520, {}); P('driver', { x: 1200, y: 935, s: .62, t: T.t, expr: 'sad', pose: 'slump', legs: 'sit', leanBody: .25 });
    const z = T.since('waited'); for (let i = 0; i < 3; i++) { const q = clamp((z - i * .35) / .5); if (q > 0) label(c, 'z', 1260 + i * 40, 650 - i * 46 - q * 10, 40 + i * 10, '#fff', { stroke: false }); }
    label(c, 'WAITED ALL NIGHT', 1400, 330, 34, '#ffd27a'); });
} });
S('D4.0', { cams: [[1100, 620, 1.12]], sfx: [['clock', '7', -12, { len: 1.5 }], ['steps', 'checker', -18, { len: 1.6 }]], draw(c, T) {
  const L = SET.railYard(c, T.t, { morning: 1 }); dawnSun(c, 320, lerp(700, 560, easeOut(clamp(T.since('7') / 2.5))), 60, 1);
  truck59(c, 760, 960, .8, { crate: true, t: T.t }); P('driver', { x: 330, y: 960, s: .75, t: T.t, expr: 'neutral', pose: 'lean' });
  const w = clamp((T.since('checker') + .5) / 1.0); P('checker', { x: lerp(1800, 1420, easeOut(w)), y: 975, s: .95, t: T.t, walk: w > 0 && w < 1, flip: true, expr: 'neutral', pose: 'clipboard', item: (cc, hh) => clipboard(cc, (hh[0][0] + hh[1][0]) / 2 + 20, (hh[0][1] + hh[1][1]) / 2 - 20, 120, 150, ['LOG']) });
  GRADE.dawn(c, .3);
}, overlay: (c, T) => nightClockOverlay(c, T.since('7') > 0 ? 7 : 6, T.since('7') > 0 ? 0 : 59, { sub: 'RAIL YARD' }) });
S('D4.1', { cams: [[880, 760, 1.28]], sfx: [['hit', 'crate', -18]], draw(c, T) {
  const L = SET.railYard(c, T.t, { morning: 1, noTrain: true }); dawnSun(c, 320, 560, 60, 1);
  truck59(c, 1060, 1010, 1.05, { crate: true, t: T.t });
  const k = pop(T, 'crate', .8); c.save(); c.globalCompositeOperation = 'screen'; c.globalAlpha = .35 * k; c.fillStyle = '#ffd9a0'; c.beginPath(); c.moveTo(320, 560); c.lineTo(1300, 660); c.lineTo(1300, 900); c.lineTo(320, 600); c.closePath(); c.fill(); c.restore();
  P('checker', { x: 1560, y: 1010, s: .95, t: T.t, flip: true, expr: 'neutral', pose: 'clipboard', item: (cc, hh) => clipboard(cc, (hh[0][0] + hh[1][0]) / 2 + 20, (hh[0][1] + hh[1][1]) / 2 - 20, 120, 150, ['LOG']) });
  GRADE.dawn(c, .3); tag(c, 'WAITING FOR HIM', 800, 520, pop(T, 'waiting', .5));
}, overlay: (c, T) => nightClockOverlay(c, 7, 2, { sub: 'RAIL YARD' }) });
S('D5.0', { cams: [[760, 560, 1.0], [700, 470, 1.32]], sfx: [['typewriter', 'showed', -14, { len: 1.1 }], ['tick', 'surprise', -16]], draw(c, T) {
  const L = SET.railYard(c, T.t, { morning: 1, noTrain: true }); c.save(); c.globalAlpha = .55; c.fillStyle = '#e9d4b8'; c.fillRect(-400, -300, W + 800, H + 600); c.restore();
  const blink = ((T.t * 1.0) % 3.1) < .12; P('checker', { x: 640, y: 1400, s: 2.3, t: T.t, expr: 'neutral', pose: 'clipboard', blink, item: (cc, hh) => clipboard(cc, (hh[0][0] + hh[1][0]) / 2 + 20, (hh[0][1] + hh[1][1]) / 2 - 20, 120, 150, ['LOG']) });
  // a thought bubble that never fills: no surprise
  const b = pop(T, 'showed', .4); if (b > 0) { c.save(); c.globalAlpha = .9 * b; circ(c, 940, 330, 16, '#fff', 4); circ(c, 990, 270, 24, '#fff', 4); ell(c, 1080, 170, 90, 70, '#fff', 4); label(c, T.since('surprise') > 0 ? '.' : '?', 1080, 160, 90, '#9aa1a8', { stroke: false }); c.restore(); }
  // typed quote
  box(c, 1140, 380, 680, 300, 6, '#fbf8ee', 4); label(c, "FINER'S REPORT", 1480, 430, 26, '#8a6a30', { stroke: false });
  const q = typed(T, '"SHOWED NO SURPRISE."', T.cue('showed') - .05, T.cue('surprise') + .55); c.font = '700 54px Caveat'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillStyle = INK; c.fillText(q, 1180, 540);
  GRADE.dawn(c, .2);
} });
S('D6.0', { cams: [[960, 560, 1.1]], sfx: [['pencil', 'checked', -10]], draw(c, T) {
  SET.desk(c, T.t, { lx: 960, ly: 520 }); GRADE.dawn(c, .2);
  ledger(c, 960, 560, 1000, 780, ['CRATE 41  MACHINE TOOLS', 'CRATE 42  GENERATOR PANELS', 'CRATE 43  DISPLAY CASES', 'MODELS OF ASTRONOMIC APPARATUS'], 3, clamp(T.since('checked') / .5));
  if (T.since('checked') > .2) { c.save(); c.globalAlpha = .35 * clamp(T.since('checked')); c.fillStyle = '#ffe16a'; c.fillRect(490, 496, 760, 50); c.restore(); }
} });
S('D6.1', { cams: [[960, 560, 1.12]], sfx: [['wrench', 'watched', -18, { len: 1.6 }], ['hit', 'loaded', -14]], draw(c, T) {
  const L = SET.railYard(c, T.t, { morning: 1, noTrain: true }); dawnSun(c, 320, 520, 60, 1);
  freightTrain(c, 1700, 880, .75, { cars: ['box', 'flat', 'box'], t: T.t, smoke: true });
  const fx = 1700 - 860 * .75, fy = 880 - 70 * .75, d = easeOut(clamp(T.since('watched') / (T.cue('loaded') - T.cue('watched') + .25)));
  // derrick
  line(c, 560, 900, 560, 220, 16, '#c9852f'); line(c, 560, 240, fx + 40, 230, 12, '#c9852f'); line(c, 560, 420, fx - 120, 240, 6, '#c9852f');
  const cy = lerp(520, fy, d); line(c, fx, 236, fx, cy - 110, 4); line(c, fx, cy - 110, fx - 120, cy - 90, 3); line(c, fx, cy - 110, fx + 120, cy - 90, 3);
  crate(c, fx, cy, 300, {});
  P('checker', { x: 300, y: 1010, s: .95, t: T.t, expr: 'neutral', pose: 'clipboard', item: (cc, hh) => clipboard(cc, (hh[0][0] + hh[1][0]) / 2 + 20, (hh[0][1] + hh[1][1]) / 2 - 20, 120, 150, ['LOG']) });
  GRADE.dawn(c, .3);
} });
S('D7.0', { cams: [[960, 540, 1.0], [960, 560, 1.06]], noWhoosh: false, sfx: [['camflash2', 'hands', -10]], draw(c, T) {
  // left: the night in the yard. right: 7 A.M. at the rail yard. The crate is the same crate.
  c.save(); c.beginPath(); c.rect(-400, -300, 1360, H + 600); c.clip();
  const L1 = SET.salvageYard(c, T.t, { lamps: 1, drop: 1 }); crate(c, 480, 860, 560, { planks: .7, tarp: .8 });
  const fl = (T.t * 1.3) % 1; P('finer', { x: 760, y: 870, s: .6, t: T.t, pose: 'photograph', expr: 'focus', flash: fl < .25 ? fl * 4 : 0 }); GRADE.night(c, L1, .3);
  const hk = pop(T, 'hands', .6); if (hk > 0 && hk < 1) GRADE.flash(c, 780, 600, hk); c.restore();
  c.save(); c.beginPath(); c.rect(960, -300, 1360, H + 600); c.clip(); c.translate(0, 0);
  SET.railYard(c, T.t, { morning: 1 }); crate(c, 1440, 860, 560, {}); GRADE.dawn(c, .25); c.restore();
  line(c, 960, -300, 960, H + 300, 10, '#050608');
  label(c, '7:30 P.M.', 480, 150, 56, '#ffd27a'); label(c, '7:00 A.M.', 1440, 150, 56, '#fff');
  box(c, 790, 950, 340, 80, 14, 'rgba(10,14,24,.85)', 3); label(c, 'SAME CRATE', 960, 990, 46, '#fff'); arrow(c, 780, 990, 640, 940, '#fff', 16); arrow(c, 1140, 990, 1280, 940, '#fff', 16);
  tag(c, 'ONE NIGHT IN AMERICAN HANDS', 960, 260, pop(T, 'american', .5), { bg: '#1d2a3d', col: '#ffd27a' });
} });
S('D8.0', { cams: [[760, 600, 1.3], [960, 560, 1.0]], sfx: [['pencil', 'signed', -10], ['train', 'back', -18, { len: 3 }]], draw(c, T) {
  const L = SET.railYard(c, T.t, { morning: 1, noTrain: true }); dawnSun(c, 320, 480, 60, 1);
  const go = clamp(T.since('back') / 3); freightTrain(c, 1500 + easeOut(go) * go * 1600, 880, .7, { cars: ['box', 'crate', 'box'], t: T.t, smoke: true });
  const turn = T.since('without') > 0, wk = clamp(T.since('without') / 1.4);
  const h = P('checker', { x: lerp(760, 420, wk), y: 1060, s: 1.35, t: T.t, expr: 'neutral', pose: turn ? 'idle' : 'clipboard', flip: turn, walk: turn && wk < 1 });
  if (!turn) { ledger(c, 1180, 640, 560, 520, ['MODELS OF ASTRONOMIC APPARATUS'], 1, 1, { sign: clamp(T.since('signed') / .7), title: 'RECEIVED' }); }
  GRADE.dawn(c, .3);
} });

// ======================= WHAT THEY LEARNED =======================
chap5('L1.0', 12, 'What They Learned');
S('L1.1', { cams: [[960, 560, 1.12]], sfx: [['paper', 'photographs', -12], ['page', 'markings', -14]], draw(c, T) {
  const L = SET.washington(c, T.t); const fan = pop(T, 'photographs', .9);
  for (let i = 0; i < 7; i++) { const a = -.5 + i * .17; photoPrint(c, 960 + Math.sin(a) * 620 * fan, 600 - Math.cos(a) * 80 * fan + 40, 200, 150, a * .5 * fan, () => { lunik(c, 0, 0, 240, { paint: 'raw', cutaway: i % 2 }); }); }
  P('analyst', { x: 520, y: 1000, s: .95, t: T.t, expr: 'focus', pose: 'hold' });
  const m = pop(T, 'markings', .5); P('analyst2', { x: 1420, y: 1000, s: .95, t: T.t, expr: m > 0 ? 'shock' : 'focus', pose: 'point', flip: true });
  if (m > 0) magnifier(c, lerp(1500, 1180, easeOut(m)), 560, 90, () => { label(c, 'CCCP', lerp(1500, 1180, easeOut(m)), 560, 40, '#b8322a', { stroke: false }); });
  GRADE.warm(c, .15);
}, overlay: (c, T) => tag(c, 'WASHINGTON', 200, 70, 1, { bg: 'rgba(10,14,24,.82)', col: '#fff' }) });
S('L2.0', { cams: [[960, 540, 1.0], [1200, 480, 1.3]], sfx: [['pop', 'factory', -10], ['sparkle', 'built', -18]], draw(c, T) {
  SET.paper(c, T.t);
  poly(c, [[300, 380], [520, 260], [820, 230], [1160, 200], [1520, 160], [1760, 240], [1800, 420], [1600, 560], [1380, 600], [1100, 650], [820, 700], [560, 720], [380, 640], [260, 520]], '#e9dcb3', 5);
  label(c, 'USSR', 1000, 330, 80, '#b8322a', { stroke: false });
  const k = pop(T, 'factory', .45), px = 1240, py = 480; if (k > 0) { arrive(c, k, px, py, () => { factoryIcon(c, 0, 0, 1.1, INK, '#d6dde2'); }); circ(c, px, py + 30, 14, '#d9342b', 4); }
  tag(c, 'PROBABLE FACTORY', px, py + 110, pop(T, 'probable', .5) * (k > 0 ? 1 : 0), { size: 34 });
  const b = pop(T, 'built', .8); lunik(c, 560, 880, 520, { blueprint: false }); if (b > 0) { c.save(); c.setLineDash([16, 12]); c.lineWidth = 6; c.strokeStyle = '#d9342b'; c.beginPath(); c.moveTo(800, 860); c.quadraticCurveTo(1100, 860, lerp(800, px, b), lerp(860, py + 40, b)); c.stroke(); c.restore(); }
  label(c, '?', px + 110, py - 120, 70, '#b8322a', { stroke: false });
} });
S('L3.0', { cams: [[960, 540, 1.0], [960, 600, 1.15]], sfx: [['pop', 'three', -12], ['elec', 'electrical', -12]], draw(c, T) {
  SET.grid(c, T.t, { title: 'LUNIK / ELECTRICAL', sub: 'SUPPLIERS NAMED: 3' }); lunik(c, 960, 800, 1100, { blueprint: true });
  const e = pop(T, 'electrical', .9);
  [0, 1, 2].forEach(i => { const p = clamp(T.since('three') / .35 - i * .9), x = 480 + i * 480, y = 300;
    if (p <= 0) return; arrive(c, p, x, y, () => { box(c, -170, -90, 340, 180, 12, '#e8f1ff', 5); label(c, 'SUPPLIER ' + (i + 1), 0, -36, 44, '#123a63', { stroke: false }); redact(c, -120, 14, 240, 34, 1); });
    if (e > 0) { const tx = 760 + i * 180, ty = 760; c.save(); c.lineWidth = 6; c.strokeStyle = GOLD; c.beginPath(); c.moveTo(x, y + 90); const N = 20; for (let j = 1; j <= N * e; j++) { const u = j / N; c.lineTo(lerp(x, tx, u) + (j % 2 ? 10 : -10), lerp(y + 90, ty, u)); } c.stroke(); c.restore(); if (e > .95) lightPool(c, tx, ty, 80, GOLD, .7); } });
} });
S('L4.0', { cams: [[960, 560, 1.12]], sfx: [['sparkle', 'system', -10]], draw(c, T) {
  SET.grid(c, T.t, { title: 'LUNIK / SYSTEM', sub: 'IN THIS VEHICLE' }); lunik(c, 960, 560, 1300, { blueprint: true });
  const k = pop(T, 'system', 1.2); const path = [[500, 560], [640, 500], [820, 620], [1000, 520], [1180, 600], [1330, 560]];
  if (k > 0) { c.save(); c.shadowColor = GOLD; c.shadowBlur = 24; c.lineWidth = 9; c.strokeStyle = GOLD; c.lineJoin = 'round'; c.beginPath(); const n = (path.length - 1) * k; path.forEach((p, i) => { if (i <= n) i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }); const i0 = Math.floor(n), f = n - i0; if (i0 < path.length - 1) c.lineTo(lerp(path[i0][0], path[i0 + 1][0], f), lerp(path[i0][1], path[i0 + 1][1], f)); c.stroke(); c.restore();
    path.forEach((p, i) => { if (i <= n) circ(c, p[0], p[1], 12, GOLD, 4); }); }
  tag(c, 'A SYSTEM', 960, 300, pop(T, 'system', .5), { size: 40, bg: '#e8f1ff', col: '#123a63' });
} });
S('L4.1', { cams: [[960, 540, 1.0]], sfx: [['sparkle', 'possibly', -16]], draw(c, T) {
  SET.grid(c, T.t);
  const sys = (x, y, s, a) => { c.save(); c.globalAlpha = a; c.translate(x, y); c.scale(s, s); c.shadowColor = GOLD; c.shadowBlur = 18; c.lineWidth = 7; c.strokeStyle = GOLD; c.beginPath(); [[-200, 0], [-120, -40], [-20, 40], [80, -30], [190, 10]].forEach((p, i) => i ? c.lineTo(...p) : c.moveTo(...p)); c.stroke(); c.restore(); };
  lunik(c, 960, 330, 900, { blueprint: true }); sys(960, 330, 1.6, 1); label(c, 'THIS VEHICLE', 960, 120, 40, '#e8f1ff', { stroke: false });
  const p = pop(T, 'possibly', .9);
  // two other generic Soviet craft, outline only
  c.save(); c.globalAlpha = .4 + .6 * clamp(T.since('other') / .6); c.lineWidth = 4; c.strokeStyle = '#e8f1ff';
  c.beginPath(); c.arc(560, 760, 110, 0, TAU); c.stroke(); [-.4, .4, 2.6, 3.4].forEach(a => { c.beginPath(); c.moveTo(560 + Math.cos(a) * 110, 760 + Math.sin(a) * 110); c.lineTo(560 + Math.cos(a) * 280, 760 + Math.sin(a) * 260); c.stroke(); });
  c.beginPath(); c.moveTo(1240, 860); c.lineTo(1240, 660); c.quadraticCurveTo(1360, 540, 1480, 660); c.lineTo(1480, 860); c.closePath(); c.stroke(); c.strokeRect(1210, 860, 300, 40); c.restore();
  sys(560, 760, .7, .55 * p); sys(1360, 760, .7, .55 * p);
  label(c, '?', 760, 640, 80, GOLD, { stroke: false, maxW: 200 }); label(c, '?', 1600, 640, 80, GOLD, { stroke: false });
  c.save(); c.globalAlpha = p; label(c, '?', 760, 640, 80, GOLD, { stroke: false }); c.restore();
  tag(c, 'POSSIBLY', 960, 960, p, { size: 44, bg: '#e8f1ff', col: '#123a63' });
} });
S('L5.0', { cams: [[960, 540, 1.0], [1040, 520, 1.25]], sfx: [['stamp', 'fifth', -10], ['ding', 'produced', -18]], draw(c, T) {
  SET.desk(c, T.t, { lx: 1000, ly: 520 });
  photoPrint(c, 1000, 520, 900, 560, -.02, () => { c.fillStyle = '#9aa0a6'; c.fillRect(-450, -280, 900, 560); for (let i = 0; i < 18; i++) circ(c, -400 + i * 48, -240, 8, '#6a6f75', 2); for (let i = 0; i < 18; i++) circ(c, -400 + i * 48, 240, 8, '#6a6f75', 2);
    box(c, -280, -150, 560, 300, 10, '#b9bec4', 4); label(c, 'CCCP', -120, -70, 70, '#3a3d40', { stroke: false }); for (let i = 0; i < 3; i++) box(c, -220 + i * 70, 20, 50, 70, 4, '#7a7f85', 3); label(c, '5', 160, 40, 150, '#2a2d30', { stroke: false }); });
  const lens = easeOut(clamp(T.since('learned') / 1.8)), mx = lerp(1500, 1160, lens), my = lerp(800, 560, lens);
  const f = pop(T, 'fifth', .5); if (f > 0) { c.save(); c.lineWidth = 12; c.strokeStyle = '#d9342b'; c.beginPath(); c.ellipse(1160, 560, 120, 130, -.1, 0, TAU * f); c.stroke(); c.restore(); }
  magnifier(c, mx, my, 150, () => { c.save(); c.translate(mx, my); c.scale(1.6, 1.6); c.translate(-mx, -my); label(c, '5', 1160, 560, 150, '#2a2d30', { stroke: false }); c.restore(); });
  if (f > 0) { c.save(); c.lineWidth = 14; c.strokeStyle = '#d9342b'; c.beginPath(); c.arc(mx, my, 172, -1.2, -1.2 + TAU * f); c.stroke(); c.restore(); }
  arrive(c, pop(T, 'kind', .5), 1040, 870, () => { box(c, -330, -60, 660, 120, 14, '#fff1c4', 4); label(c, 'THE 5TH EVER MADE', 0, 0, 56, '#b8322a', { stroke: false }); });
} });
S('L6.0', { cams: [[960, 520, 1.15]], sfx: [['stamp', 'off', -8]], shakes: [['off']], draw(c, T) {
  SET.spot(c, T.t, { x: 960 }); lunikExhibit(c, 960, 860, 760, { t: T.t, glow: 1 });
  sign(c, 960, 180, 520, 110, 'ONE-OFF SHOWPIECE?', { bg: '#e9e4d6', size: 48 });
  const k = pop(T, 'off', .35); if (k > 0) { line(c, 700, 140, lerp(700, 1220, k), lerp(140, 240, k), 16, '#d9342b'); }
  stamp(c, 960, 560, 'NO', pop(T, 'showpiece', .3), RED, { w: 300, h: 140, rot: -.12 });
} });
S('L6.1', { cams: [[960, 560, 1.06]], sfx: [['wrench', 0, -18, { len: 1.2 }], ['ding', 'production', -12]], draw(c, T) {
  bg(c, '#4a5560', '#2c333a'); sawFactory(c, 960, 380, 1, '#5d6a76'); FLOOR(c, 700, '#3a3f46');
  box(c, -400, 760, W + 800, 60, 8, '#2c2f33'); for (let x = -400; x < W + 400; x += 60) circ(c, x + ((T.t * 120) % 60), 790, 18, '#6a6f75', 3);
  for (let i = -1; i < 5; i++) { const x = 160 + i * 480 + (T.lt * 120) % 480 * 0; const n = i + 3; const hi = n === 5; const xx = 160 + i * 480 + ((T.lt * 140) % 480);
    lunik(c, xx, 680, 420, { paint: 'raw' }); label(c, '#' + n, xx, 540, 48, hi ? GOLD : '#fff', hi ? { glow: GOLD } : {}); if (hi) lightPool(c, xx, 680, 320, GOLD, .35 * pop(T, 'production', .4)); }
  label(c, 'PRODUCTION LINE', 960, 140, 64, '#fff');
} });
S('L7.0', { cams: [[960, 540, 1.0], [800, 560, 1.22]], sfx: [['paper', 'later', -14]], draw(c, T) {
  const L = SET.washington(c, T.t, { board: ' ' }); box(c, 1180, 140, 560, 360, 8, '#123a63', 5); c.save(); rr(c, 1180, 140, 560, 360, 8); c.clip(); lunik(c, 1460, 330, 480, { blueprint: true }); c.restore();
  const h = P('analyst', { x: 800, y: 1000, s: 1.1, t: T.t, expr: 'focus', pose: 'hold', item: (cc, hh) => { cc.save(); cc.translate((hh[0][0] + hh[1][0]) / 2, (hh[0][1] + hh[1][1]) / 2); cc.rotate(-.08); box(cc, -150, -18, 300, 36, 4, '#f3efe6', 3); box(cc, -40, -18, 80, 36, 2, 'rgba(120,170,220,.5)', 2); for (let i = 0; i < 12; i++) line(cc, -140 + i * 24, -18, -140 + i * 24, -6, 2); cc.restore(); } });
  tag(c, 'THE CIA, LATER', 500, 220, pop(T, 'later', .5)); arrive(c, pop(T, 'built', .5), 1460, 560, () => label(c, 'HOW IT WAS BUILT', 0, 0, 40, '#fff'));
  GRADE.warm(c, .12);
} });
S('L7.1', { cams: [[960, 540, 1.0], [960, 560, 1.08]], sfx: [['tick', 'weight', -10], ['tick', 'power', -10], ['tick', 'payload', -10], ['ding', 'limits', -16]], draw(c, T) {
  SET.grid(c, T.t); label(c, "WHAT THEY COULD NOW JUDGE", 960, 170, 54, '#e8f1ff', { stroke: false });
  [['WEIGHT', 'weight'], ['POWER', 'power'], ['PAYLOAD LIMITS', 'payload']].forEach(([n, w], i) => { const p = clamp(T.since(w) / .7) * .78; gauge(c, 420 + i * 540, 640, 200, p, n, ['#5d9ad6', '#e0b13e', '#e76f51'][i]); });
  label(c, 'NO FIGURES GIVEN', 960, 940, 30, '#a9c4e8', { stroke: false });
} });

// ======================= AFTERMATH =======================
chap5('A1.0', 13, 'Aftermath');
S('A1.1', { cams: [[960, 540, 1.0], [1100, 460, 1.2]], sfx: [['typewriter', 'no', -12, { len: 2.4 }]], draw(c, T) {
  const L = SET.washington(c, T.t, { noDesk: false });
  P('finer', { x: 560, y: 1000, s: 1.05, t: T.t, expr: 'focus', pose: 'reach' }); typewriter(c, 860, 760, .8, { paper: .3 });
  box(c, 1080, 160, 620, 460, 4, '#fbf8ee', 4); label(c, "FINER'S REPORT", 1390, 210, 30, '#8a6a30', { stroke: false });
  for (let i = 0; i < 4; i++) line(c, 1130, 270 + i * 34, 1650 - i * 30, 270 + i * 34, 4, '#b0a890');
  const q = typed(T, 'NO SIGN OF', T.cue('no') - .05, T.cue('sign') + .2), q2 = typed(T, 'DISCOVERY.', T.cue('soviets'), T.cue('discovered') + .4);
  c.font = '700 56px Caveat'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillStyle = INK; c.fillText(q, 1130, 450); c.fillText(q2, 1130, 530);
  GRADE.warm(c, .15);
} });
S('A2.0', { cams: [[960, 540, 1.12]], sfx: [['static', 'may', -24, { len: 1.6 }]], draw(c, T) {
  const L = SET.spot(c, T.t, { x: 900 });
  P('kolomyakov', { x: 900, y: 1000, s: 1.1, t: T.t, expr: 'stern', pose: 'hold', item: (cc, hh) => photoPrint(cc, (hh[0][0] + hh[1][0]) / 2, (hh[0][1] + hh[1][1]) / 2 - 30, 120, 90, .1, () => { crate(cc, 0, 30, 110, { stencil: false }); }) });
  GRADE.night(c, [[900, 560, 520, '#cfe0f5', .45]], .3);
  const q = pop(T, 'may', .6); if (q > 0) { c.save(); c.globalAlpha = q * (.75 + .25 * Math.sin(T.t * 6)); label(c, '?', 1120, 470 - q * 20, 200, GOLD, { glow: GOLD }); c.restore(); }
  tag(c, 'PER MAYSH: MAY HAVE FOUND OUT LATER', 960, 120, pop(T, 'mayshs', .5), { size: 30 });
} });
S('A2.1', { cams: [[960, 540, 1.08]], sfx: [['pop', 'how', -14], ['pop', 'when', -14]], draw(c, T) {
  SET.paper(c, T.t); label(c, 'NO ONE HAS ESTABLISHED', 960, 220, 60, INK, { stroke: false });
  [['HOW', 'how'], ['WHEN', 'when']].forEach(([n, w], i) => { const p = clamp((T.lt - .1) / .5 - i * .5), q = pop(T, w, .35); arrive(c, p, 600 + i * 720, 600, () => { box(c, -260, -200, 520, 400, 14, '#fbf8ee', 5); label(c, n, 0, -110, 72, INK, { stroke: false }); for (let k = 0; k < 3; k++) line(c, -190, -10 + k * 60, 190, -10 + k * 60, 4, '#c9bfa6'); if (q > 0) { c.save(); c.globalAlpha = clamp(q * 2); label(c, '?', 0, 60, 200 * lerp(1.6, 1, back(q)), '#b8322a', { stroke: false }); c.restore(); } }); });
} });
S('A3.0', { cams: [[960, 540, 1.0], [960, 470, 1.3]], sfx: [['page', 'stayed', -16], ['ding', '1995', -12]], draw(c, T) {
  bg(c, '#2a2f36', '#15181d'); lightPool(c, 960, 160, 900, '#ffe2a0', .3); line(c, 960, -300, 960, 120, 4, '#555'); circ(c, 960, 130, 20, '#ffe9a8', 3);
  for (let r = 0; r < 3; r++) { box(c, 120, 360 + r * 230, 1680, 20, 3, '#4a4038', 3); for (let i = 0; i < 9; i++) { const R = rand(r * 9 + i); box(c, 150 + i * 184, 220 + r * 230, 160, 140, 4, R() > .5 ? '#9a8a6a' : '#8a7a5a', 3); } }
  box(c, 790, 250 + 230, 340, 200, 6, '#c9a46a', 5); label(c, 'OPERATION FILE', 960, 540, 40, INK, { stroke: false }); stamp(c, 960, 610, 'SECRET', 1, '#b8322a', { w: 230, h: 56, rot: -.06 });
  c.save(); c.globalAlpha = .5; const R = rand(4); for (let i = 0; i < 60; i++) circ(c, R() * W, (R() * H + T.t * 20 * (R() + .2)) % H, 2 + R() * 2, '#e8dcc0', 0); c.restore();
  const y = Math.round(lerp(1959, 1995, easeOut(clamp((T.t - T.shot.start - .3) / (T.cue('1995') - T.shot.start - .2)))));
  calendar(c, 1560, 240, 260, 240, 'YEAR', String(y), { col: '#b8322a', circle: T.since('1995') > 0 ? clamp(T.since('1995') / .6) : 0 });
} });
S('A3.1', { cams: [[960, 540, 1.1]], sfx: [['stamp', 'declassified', -4]], shakes: [['declassified']], draw(c, T) {
  SET.desk(c, T.t, { lx: 960, ly: 520 });
  reportPage(c, 960, 560, 760, 860, { title: "FINER'S REPORT", lines: 14, bars: [], stamp: 'CLASSIFIED', sp: 1 });
  const k = pop(T, 'declassified', .35); if (k > 0) { c.save(); c.globalAlpha = .75 * clamp(k * 3); line(c, 820, 330, 1260, 220, 14, '#1d4f8a'); c.restore(); stamp(c, 980, 640, 'DECLASSIFIED 1995', k, '#1d6f3a', { w: 640, h: 120, rot: -.08 }); }
} });
S('A4.0', { cams: [[960, 540, 1.0], [1000, 520, 1.18]], sfx: [['stamp', 'blacked', -12], ['clock', 'another', -16, { len: 1.6 }], ['ding', 'years', -14]], draw(c, T) {
  SET.desk(c, T.t, { lx: 900, ly: 520 });
  const bp = clamp(T.since('blacked') / .6), lift = clamp((T.since('years') - .4) / .6);
  [[620, 560, -.05, 1], [1080, 540, .03, 2]].forEach(([x, y, r, s]) => reportPage(c, x, y, 560, 760, { title: 'PAGE ' + s, lines: 14, rot: r, seed: s + 4, bars: [[2, 0, .8], [3, 0, .6], [6, .1, 1], [9, 0, .9], [10, 0, .5], [12, .2, .9]], p: bp * (1 - lift) }));
  const yr = Math.round(lerp(1995, 2020, easeOut(clamp(T.since('another') / (T.cue('years') - T.cue('another') + .2)))));
  arrive(c, pop(T, 'another', .4), 1580, 260, () => { box(c, -190, -110, 380, 220, 16, 'rgba(10,14,24,.9)', 4); label(c, '+' + (yr - 1995) + ' YEARS', 0, -30, 56, GOLD); label(c, String(yr), 0, 50, 44, '#fff'); });
} });
S('A5.0', { cams: [[900, 540, 1.0], [960, 540, 1.12]], sfx: [['deflate', 'harder', -16], ['page', '1964', -12]], draw(c, T) {
  SET.desk(c, T.t, { lx: 900, ly: 520 }); const g = pop(T, 'harder', .8);
  dossier(c, 820, 560, 900, { who: 'silveti', expr: g > .5 ? 'sad' : 'neutral', name: 'E. DÍAZ SILVETI', role: ['MEXICAN SECRET POLICE'], source: 'PER MAYSH', t: T.t });
  if (g > 0) { c.save(); c.globalCompositeOperation = 'saturation'; c.globalAlpha = g; c.fillStyle = '#888'; c.fillRect(340, 200, 980, 740); c.restore(); }
  const k = pop(T, '1964', .5); arrive(c, k, 1540, 420, () => calendar(c, 0, 0, 300, 280, 'YEAR', '1964', { col: '#b8322a' }));
} });
S('A5.1', { cams: [[880, 560, 1.15]], sfx: [['stamp', 'branded', -4]], shakes: [['branded']], draw(c, T) {
  SET.desk(c, T.t, { lx: 900, ly: 520 });
  dossier(c, 880, 560, 900, { who: 'silveti', expr: T.since('branded') > 0 ? 'worried' : 'sad', name: 'E. DÍAZ SILVETI', role: ['MEXICAN SECRET POLICE'], source: 'PER MAYSH', t: T.t });
  c.save(); c.globalCompositeOperation = 'saturation'; c.fillStyle = '#888'; c.fillRect(400, 200, 980, 740); c.restore();
  tag(c, "MEXICO'S NEW PRESIDENT", 880, 160, pop(T, 'mexicos', .5));
  stamp(c, 900, 620, 'TRAITOR', pop(T, 'branded', .35), '#b8322a', { w: 560, h: 150, rot: -.14 });
} });
S('A5.2', { cams: [[960, 480, 1.08]], sfx: [['carengine', 'fled', -14]], draw(c, T) {
  SET.desk(c, T.t, { lx: 960, ly: 520 });
  const pins = mapMexico(c, 960, 560, 1400, 860, { tampico: false, p: 0 });
  const a = pins.city, b = [960 - 700 + 1400 * .47, 560 - 430 + 860 * .1]; const p = clamp(T.since('fled') / (T.cue('texas') - T.cue('fled') + .25));
  c.save(); c.setLineDash([18, 12]); c.lineWidth = 8; c.strokeStyle = '#d9342b'; c.lineCap = 'round'; c.beginPath(); const N = 30; for (let i = 0; i <= N * p; i++) { const u = i / N; const x = lerp(a[0], b[0], u) + Math.sin(u * Math.PI) * 80, y = lerp(a[1], b[1], u); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); c.restore();
  const u = p, cx = lerp(a[0], b[0], u) + Math.sin(u * Math.PI) * 80, cy = lerp(a[1], b[1], u); c.save(); c.translate(cx, cy); box(c, -30, -16, 60, 32, 10, '#2f3e52', 4); c.restore();
  label(c, 'USA', b[0] + 300, 175, 44, '#6a6050', { stroke: false }); if (T.since('texas') > 0) arrive(c, clamp(T.since('texas') / .4), b[0] - 170, b[1] - 20, () => label(c, 'TEXAS', 0, 0, 60, '#fff'));
  tag(c, '1964', 400, 200, 1, { size: 40 });
} });
S('A6.0', { cams: [[960, 540, 1.0], [1180, 520, 1.2]], sfx: [['stamp', 'never', -12], ['hit', 'country', -18]], draw(c, T) {
  SET.desk(c, T.t, { lx: 900, ly: 520 });
  reportPage(c, 560, 540, 600, 780, { title: 'OPERATION REPORT', lines: 12, rot: -.04, bars: [[5, .1, .9], [8, 0, .7]], p: 1 });
  c.save(); c.translate(560, 540); c.rotate(-.04); label(c, 'LOCATION:', -170, -232, 34, INK, { stroke: false }); redact(c, -60, -252, 260, 40, 1); c.restore();
  const pins = mapMexico(c, 1300, 540, 760, 560, { tampico: false, cityLabel: ' ', p: 0 }); const fl = T.since('never') > 0 ? (.5 + .5 * Math.sin(T.t * 14)) : 1;
  c.save(); c.globalAlpha = fl; circ(c, pins.city[0], pins.city[1], 16, '#d9342b', 4); c.restore();
  const q = pop(T, 'never', .5); if (q > 0) label(c, '?', pins.city[0] + 10, pins.city[1] - 110 - q * 10, 160, GOLD, { glow: GOLD });
  tag(c, 'MOST LIKELY MEXICO CITY. NEVER CONFIRMED.', 1300, 900, pop(T, 'country', .5), { size: 30 });
} });
card('A7.0', 'Borrowing a Soviet rocket for a single night was bold.');
S('A8.0', { cams: [[960, 540, 1.0], [960, 600, 1.12]], sfx: [['whoosh2', 'something', -12]], draw(c, T) {
  const d = easeOut(clamp(T.since('something') / 1.6)); c.save(); c.translate(0, -d * 700);
  bg(c, '#0b1426', '#1c3456'); NIGHT_SKY(c, T.t, '#050b18', '#1d3550', 40); moon(c, 1500, 260, 70);
  // sea
  c.fillStyle = '#123a5e'; c.fillRect(-400, 640, W + 800, 1800); for (let i = 0; i < 8; i++) { c.save(); c.globalAlpha = .25; line(c, -400, 660 + i * 30, W + 400, 660 + i * 30 + Math.sin(T.t + i) * 6, 3, '#9fc6e0'); c.restore(); }
  lightPool(c, 1500, 700, 400, '#cfe3ff', .25); c.fillStyle = '#0b2440'; c.fillRect(-400, 960, W + 800, 1600); c.restore();
  arrive(c, pop(T, 'later', .5), 960, 300 - d * 700, () => label(c, 'A FEW YEARS LATER', 0, 0, 72, '#fff'));
} });
S('A8.1', { cams: [[960, 540, 1.0], [960, 640, 1.15]], sfx: [['deflate', 'sunken', -16], ['hit', 'submarine', -16]], draw(c, T) {
  const dep = clamp((T.t - T.shot.start) / (T.shot.end - T.shot.start)); water(c, .15 + dep * .45); bubbles(c, T.t, 200, 1720, 26, 7, .5 * (1 - dep * .6));
  const k = pop(T, 'sunken', 1.4); if (k > 0) { c.save(); c.globalAlpha = k; lightPool(c, 960, 820, 620, '#5a8aba', .45); sub(c, 960, 820, 1100, { star: clamp(T.since('soviet') / .6) }); c.restore(); }
  FLOOR(c, 900, '#0a0e14'); c.save(); c.globalAlpha = .7; for (let i = 0; i < 9; i++) ell(c, 100 + i * 220, 910, 140, 30, '#121820', 0); c.restore();
  tag(c, 'SUNKEN SOVIET SUBMARINE', 960, 300, pop(T, 'submarine', .5), { bg: '#0d1520', col: '#cfe3ff', size: 40 });
} });
S('A8.2', { cams: [[960, 540, 1.0], [960, 540, 1.04]], sfx: [['clock', 'three', -16, { len: 1.2 }], ['hit', 'next', -10]], draw(c, T) {
  water(c, .8); lightPool(c, 960, 760, 700, '#4a7aaa', .45); sub(c, 960, 780, 1000, { star: 1 }); FLOOR(c, 860, '#06090e');
  // depth gauge
  const g = easeOut(clamp(T.since('nearly') / (T.cue('miles') - T.cue('nearly') + .2))); box(c, 1660, 120, 120, 760, 14, 'rgba(10,14,24,.85)', 4); for (let i = 0; i <= 6; i++) line(c, 1680, 160 + i * 110, 1720, 160 + i * 110, 4, '#9fc6e0');
  circ(c, 1720, 160 + g * 660, 22, GOLD, 4); label(c, '0', 1620, 160, 32, '#fff'); label(c, '~3 MI', 1560, 820, 40, g > .9 ? GOLD : '#fff');
  tag(c, 'BENEATH THE PACIFIC', 760, 300, pop(T, 'pacific', .5), { bg: '#0d1520', col: '#cfe3ff', size: 40 });
  const e = pop(T, 'that', .6); if (e > 0) { c.save(); c.globalAlpha = .7 * e; c.fillStyle = '#000'; c.fillRect(-400, -300, W + 800, H + 600); c.restore();
    arrive(c, e, 960, 520, () => { label(c, 'NEXT', 0, -70, 60, '#bbb', { stroke: false }); label(c, 'THE SUBMARINE', 0, 40, 130, '#fff', { glow: '#3a6a9a' }); }); }
} });
})();
