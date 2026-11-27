// ---------- scene builder b4: THE NIGHT (N) + PUTTING IT BACK (B) ----------
// The salvage yard, one night. Every action is keyed to the word the narrator says. Night clock tracks the hours.
(() => {
const chap4 = (k, n, title) => S(k, { card: (c, T) => chapterCard(c, T, n, title) });
// ---- the one night: global time -> clock minutes (past midnight keeps counting: 25:00 = 1 A.M.) ----
const NK = [[0, 19 * 60 + 15], [491.0, 19 * 60 + 20], [493.3, 19 * 60 + 30], [502.6, 19 * 60 + 31], [504.0, 20 * 60], [512, 20 * 60 + 15], [536, 21 * 60 + 5],
  [552, 22 * 60], [565, 23 * 60], [582, 24 * 60 + 30], [592, 25 * 60 + 40], [600, 26 * 60 + 20], [607.6, 26 * 60 + 40], [609.6, 27 * 60 + 35], [623, 27 * 60 + 52],
  [627.4, 28 * 60], [640, 28 * 60 + 6]];
const nightAt = t => { let k = 0; while (k < NK.length - 2 && t > NK[k + 1][0]) k++; const [t0, m0] = NK[k], [t1, m1] = NK[k + 1];
  const m = Math.round(lerp(m0, m1, ease(clamp((t - t0) / (t1 - t0))))); return [Math.floor(m / 60) % 24, m % 60]; };
const NC = (sub = 'SALVAGE YARD') => (c, T) => { const [h, m] = nightAt(T.t); nightClockOverlay(c, h, m, { sub }); };
// ---- little helpers ----
const SKIN = '#f2c49b', SKIN2 = '#c98d5a', YEL = '#ffcf3f', SOD = '#ffb04a';
function tag(c, x, y, txt, p, o = {}) { // hand-lettered manila source tag, pinned
  if (p <= 0) return; c.save(); c.translate(x, y); c.rotate(o.rot ?? -.04); const s = lerp(1.35, 1, easeOut(clamp(p * 1.6))); c.scale(s, s); c.globalAlpha = clamp(p * 3);
  const sz = o.size || 30; c.font = `700 ${sz}px Kalam`; const w = c.measureText(String(txt).toUpperCase()).width + 48; reg(c, -w / 2, -sz, w / 2, sz);
  box(c, -w / 2, -sz, w, sz * 2, 8, o.bg || '#f1dfae', 4); circ(c, -w / 2 + 16, -sz + 14, 5, o.pin || RED, 2.5);
  label(c, txt, 0, 2, sz, o.fg || '#6b2a18', { stroke: false }); c.restore(); }
function arm(c, x0, y0, x1, y1, skin = SKIN, sleeve = '#3a4a5e') { // forearm from a sleeve to a hand
  line(c, x0, y0, x1, y1, 30, INK); line(c, x0, y0, x1, y1, 22, sleeve); line(c, lerp(x0, x1, .55), lerp(y0, y1, .55), x1, y1, 20, INK); line(c, lerp(x0, x1, .55), lerp(y0, y1, .55), x1, y1, 13, skin); circ(c, x1, y1, 22, skin, 4); }
function torch(c, x, y, ang, len, a = .32) { c.save(); c.translate(x, y); c.rotate(ang); c.globalCompositeOperation = 'screen'; const g = c.createLinearGradient(0, 0, len, 0); g.addColorStop(0, `rgba(255,236,180,${a + .2})`); g.addColorStop(1, 'rgba(255,236,180,0)');
  c.fillStyle = g; c.beginPath(); c.moveTo(0, -14); c.lineTo(len, -len * .28); c.lineTo(len, len * .28); c.lineTo(0, 14); c.closePath(); c.fill(); c.restore(); }
function bpMan(c, x, y, s = 1, col = '#e8f1ff') { c.save(); c.translate(x, y); c.scale(s, s); c.lineWidth = 3; c.strokeStyle = col; c.beginPath(); c.ellipse(0, -70, 34, 46, 0, 0, TAU); c.stroke(); c.beginPath(); c.arc(0, -140, 26, 0, TAU); c.stroke();
  line(c, -12, -26, -14, 0, 3, col); line(c, 12, -26, 14, 0, 3, col); c.restore(); }
function fieldRadio(c, x, y, waves) { box(c, x - 70, y - 90, 140, 90, 8, '#4f5a44'); box(c, x - 56, y - 76, 60, 36, 4, '#cfd8b0', 3); circ(c, x + 34, y - 58, 13, '#2b2f36', 3); circ(c, x + 34, y - 24, 9, '#2b2f36', 3);
  line(c, x + 50, y - 90, x + 90, y - 330, 4); circ(c, x + 90, y - 332, 6, '#c9ced4', 2.5);
  if (waves > 0) for (let i = 0; i < 3; i++) { const r = 30 + ((waves * 60 + i * 40) % 120); c.save(); c.globalAlpha = (1 - r / 150) * clamp(waves * 3); c.beginPath(); c.arc(x + 90, y - 332, r, -1.2, -.2); c.lineWidth = 5; c.strokeStyle = YEL; c.stroke(); c.beginPath(); c.arc(x + 90, y - 332, r, -2.95, -1.95); c.stroke(); c.restore(); } }
function gate(c, x, y, w, h, open = 0) { // a gap in the yard fence + one swinging board door
  c.fillStyle = '#0b1322'; c.fillRect(x, y - h, w, h); const k = easeOut(open); c.save(); c.translate(x, y - h); c.scale(lerp(1, .18, k), 1);
  for (let i = 0; i < w; i += 46) box(c, i, 0, 46, h, 2, i % 92 ? '#6d5034' : '#7a5a3a', 3); line(c, 0, h * .25, w, h * .25, 10, '#5a412a'); line(c, 0, h * .75, w, h * .75, 10, '#5a412a'); c.restore(); }
function cat(c, x, y, t, s = 1) { c.save(); c.translate(x, y); c.scale(s, s); const k = Math.sin(t * 8) * 4; c.fillStyle = '#05070c';
  c.beginPath(); c.ellipse(0, -22, 40, 18, 0, 0, TAU); c.fill(); c.beginPath(); c.arc(42, -36, 15, 0, TAU); c.fill(); poly(c, [[34, -46], [38, -64], [46, -48]], '#05070c', 0); poly(c, [[44, -48], [52, -64], [56, -44]], '#05070c', 0);
  [-24 + k, -10 - k, 14 + k, 26 - k].forEach(lx => line(c, lx, -10, lx, 2, 6, '#05070c')); c.beginPath(); c.moveTo(-38, -26); c.quadraticCurveTo(-70, -40, -64, -76); c.lineWidth = 6; c.strokeStyle = '#05070c'; c.stroke();
  circ(c, 47, -38, 3, '#e8ff9a', 0); c.restore(); }
function shoe(c, x, y, s = 1, col = '#3b2a22', flip) { c.save(); c.translate(x, y); c.scale(s * (flip ? -1 : 1), s); c.beginPath(); c.moveTo(-40, 0); c.lineTo(-40, -26); c.quadraticCurveTo(-34, -40, -10, -38); c.lineTo(10, -30); c.quadraticCurveTo(46, -26, 48, -8); c.lineTo(48, 0); c.closePath(); fs(c, col);
  line(c, -6, -34, 6, -28, 3, '#c9b58a'); line(c, -2, -36, 10, -30, 3, '#c9b58a'); box(c, -42, -4, 92, 8, 3, '#1b1410', 2.5); c.restore(); }
function sockFoot(c, x, y, s = 1, lift = 0) { c.save(); c.translate(x, y - lift); c.scale(s, s); c.beginPath(); c.moveTo(-30, -150); c.lineTo(30, -150); c.lineTo(34, -40); c.quadraticCurveTo(90, -40, 100, -12); c.quadraticCurveTo(100, 4, 80, 4); c.lineTo(-30, 4); c.quadraticCurveTo(-44, -10, -34, -40); c.closePath(); fs(c, '#ece6d6');
  line(c, -30, -120, 30, -120, 7, '#b8322a'); line(c, -31, -104, 31, -104, 7, '#1d3557'); c.restore(); }
function cutters(c, x, y, s, open, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); const a = open * .35;
  [-1, 1].forEach(sd => { c.save(); c.rotate(sd * a); c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(-60, sd * 10, -110, sd * 6); c.lineTo(-110, sd * 18); c.quadraticCurveTo(-50, sd * 26, 0, sd * 6); c.closePath(); fs(c, '#9aa3ab');
    box(c, 0, sd > 0 ? 0 : -22, 230, 22, 10, '#b8322a'); c.restore(); }); circ(c, 0, 0, 10, '#5b636b', 3); c.restore(); }
function coupling(c, x, y, s = 1, glint = 0) { c.save(); c.translate(x, y); c.scale(s, s); box(c, -30, -40, 60, 80, 12, '#c9852f'); for (let i = 0; i < 4; i++) line(c, -30, -24 + i * 16, 30, -24 + i * 16, 3, 'rgba(60,35,10,.6)');
  box(c, -18, -60, 36, 22, 4, '#9aa1a8', 3.5); circ(c, 0, -49, 6, '#2b2f36', 0); if (glint > 0) { c.save(); c.globalAlpha = glint; line(c, -16, -30, -16, 10, 6, '#fff7d0'); c.restore(); lightPool(c, 0, 0, 110, '#ffe2a0', .45 * glint); } c.restore(); }
function bolts(c, x, y, w, n) { const R = rand(5); box(c, x - w / 2, y - w * .45, w, w * .45, 10, '#7d868e'); c.save(); rr(c, x - w / 2 + 8, y - w * .45 - 200, w - 16, 200 + w * .45 - 8, 8); c.clip();
  for (let i = 0; i < n; i++) { const bx = x - w / 2 + 20 + R() * (w - 40), by = y - 14 - Math.floor(i / 9) * 10 - R() * 8; c.save(); c.translate(bx, by); c.rotate(R() * 3); poly(c, [[-9, -5], [0, -10], [9, -5], [9, 5], [0, 10], [-9, 5]], '#b7bec5', 2.5); c.restore(); } c.restore(); }
function heads(c, hs, k) { // eye-whites in the dark
  hs.forEach(([x, y, s, lk = 0]) => [-1, 1].forEach(d => { const ex = x + d * 20 * s, ey = y - 4 * s; c.save(); c.globalAlpha = k; ell(c, ex, ey, 11 * s, 13 * s, '#f4f1e6', 0); circ(c, ex + lk * 5 * s, ey + 2 * s, 5 * s, '#05070c', 0); c.restore(); })); }
// yard truck: parked with the crate; returns roof geometry
const YT = { x: 1060, y: 1000, s: 1.25 };
const roofOf = (o = YT) => ({ cx: o.x - 210 * o.s, w: 580 * o.s, top: o.y - 136 * o.s - 580 * .24 * o.s, bot: o.y - 136 * o.s, left: o.x - 210 * o.s - 290 * o.s, right: o.x - 210 * o.s + 290 * o.s });
const yTruck = (c, T, crateO = {}, o = YT) => truck59(c, o.x, o.y, o.s, { crate: { ...crateO }, t: T.t });
const lampFlick = (T, w) => { const s = T.since(w); if (s < 0) return 0; if (s > .5) return 1; return [1, 0, 1, .2, 1, 0, 1][Math.floor(s * 14)] ?? 1; };

// =========================== THE NIGHT ===========================
chap4('N1.0', 9, 'The Night');
S('N1.1', { focus: [940, 600, 1.05], sfx: [['truck2', 0, -16, { len: 3.2 }], ['crickets2', 0, -28, { len: 30 }]], overlay: NC(), draw(c, T) {
  const L = SET.salvageYard(c, T.t, { lamps: 0 }); gate(c, 110, 552, 230, 330, 1);
  P('radioman', { x: 1420, y: 556, s: .5, t: T.t, expr: 'neutral', pose: 'idle', hat: 'flatcap' });
  const k = easeOut(clamp(T.lt / 2.4)); const tx = lerp(-520, 900, k);
  truck59(c, tx, 1000, 1.05, { crate: { state: 'canvas' }, moving: k < .98, t: T.t, lights: 1, driver: 'newdriver' });
  GRADE.night(c, [...L, [tx + 600, 860, 520, '#fff0c0', .3]], .34);
  const g = easeOut(T.at('10', .7)); if (g > 0) { const x = 1560; line(c, x, 548, x, lerp(548, 218, g), 6, YEL); line(c, x - 22, 548, x + 22, 548, 6, YEL); if (g > .97) line(c, x - 22, 218, x + 22, 218, 6, YEL);
    c.save(); c.globalAlpha = clamp(g * 2); label(c, '10 FT', x + 100, 383, 56, YEL); c.restore(); }
  const f = T.at('fence', .5); tag(c, 700, 160, 'SOLID WOODEN FENCE', f, { size: 34 });
} });
S('N2.0', { focus: [960, 520, 1.1], sfx: [['paper', 'salvage', -14], ['stamp', 'rented', -12]], overlay: NC(), draw(c, T) {
  const L = SET.salvageYard(c, T.t, { lamps: 0 });
  c.save(); c.translate(960, 330); c.rotate(-.04); box(c, -230, -56, 460, 112, 6, '#8a4a2a'); for (let i = 0; i < 9; i++) circ(c, -200 + i * 50, 40, 6 + (i % 3) * 3, 'rgba(60,20,10,.5)', 0); label(c, 'SALVAGE', 0, 4, 78, '#f3d9a8', { stroke: false }); c.restore();
  yTruck(c, T, { state: 'canvas' }, { x: 1250, y: 1010, s: 1.05 });
  GRADE.night(c, L, .3);
  tag(c, 520, 560, "PER FINER'S REPORT", T.at('salvage', .5), { rot: -.06 });
  tag(c, 1380, 520, 'RENTED FOR ONE NIGHT', T.at('rented', .5), { rot: .05, bg: '#fff3c4' });
} });
S('N2.1', { cams: [[900, 560, 1.1], [1180, 520, 1.3]], sfx: [['page', 'silvet', -14], ['ding', 'brother', -16]], overlay: NC(), draw(c, T) {
  SET.spot(c, T.t, { x: 700, col: '#ffd27a' });
  P('silveti', { x: 640, y: 1000, s: 1.15, t: T.t, expr: T.since('brother') > 0 ? 'smug' : 'neutral', pose: 'point', talk: T.since('silvet') > 0 && T.since('law') < .3 });
  const ph = clamp(T.at('silvet', .6)); c.save(); c.globalAlpha = ph;
  photoPrint(c, 1220, 500, 520, 360, .04, () => { c.fillStyle = '#20262e'; c.fillRect(-260, -180, 520, 360); for (let i = -260; i < 260; i += 30) box(c, i, -60, 30, 220, 1, i % 60 ? '#555' : '#666', 2);
      crayon(c, { ...CAST.visitor2, x: 40, y: 160, s: .55, t: T.t, expr: 'grin', pose: 'wave', noShadow: true }); }, { caption: T.since('brother') > 0 ? "HIS BROTHER-IN-LAW'S YARD" : ' ' });
  c.restore();
  tag(c, 1220, 230, "SILVETI'S ACCOUNT", T.at('silvet', .5), { bg: '#ffe0d0' });
} });
S('N3.0', { cams: [[960, 520, 1.15], [960, 640, 1.05]], sfx: [['clock', '7', -12, { len: 1.6 }], ['steps', 'four', -18, { len: 2 }]], overlay: NC(), draw(c, T) {
  if (T.sub === 0) { SET.black(c, T.t); lightPool(c, 960, 470, 700, '#ffd27a', .18);
    const k = ease(clamp(T.since('7') / Math.max(.4, T.cue('30') - T.cue('7') + .25))); nightClock(c, 960, 460, 250, 19, Math.round(lerp(0, 30, k)), { label: false });
    c.save(); c.globalAlpha = clamp(T.since('30') * 3); label(c, 'ABOUT 7:30 P.M.', 960, 850, 74, '#fff'); c.restore(); return; }
  const L = SET.salvageYard(c, T.t, { lamps: 0 }); gate(c, 110, 552, 230, 330, 1); yTruck(c, T, { state: 'canvas' }, { x: 1500, y: 1000, s: 1 });
  const who = ['finer', 'spec1', 'spec2', 'spec3'];
  who.forEach((n, i) => { const s0 = T.since('four') - i * .28, k = easeOut(clamp(s0 / 1.1)); if (s0 < 0) return;
    P(n, { x: lerp(230, 520 + i * 190, k), y: 960 - i * 6, s: .88, t: T.t, expr: i === 0 ? 'focus' : 'neutral', pose: k < 1 ? 'sneak' : 'idle', walk: k < 1 }); });
  GRADE.night(c, L, .32);
  who.forEach((n, i) => { const p = T.at('four', .4) * (T.since('four') > .9 + i * .25 ? 1 : 0); if (p > 0) { circ(c, 520 + i * 190, 600, 30, YEL, 4); label(c, String(i + 1), 520 + i * 190, 602, 38, INK, { stroke: false }); } });
} });
S('N4.0', { cams: [[960, 560, 1.1], [1150, 560, 1.2]], sfx: [['radio', 'radios', -14], ['static', 'security', -24, { len: 2.5 }]], overlay: NC(), draw(c, T) {
  const L = SET.salvageYard(c, T.t, { lamps: 0 }); gate(c, 110, 552, 230, 330, 0);
  yTruck(c, T, { state: 'canvas' }, { x: 1760, y: 1000, s: .9 });
  P('radioman', { x: 560, y: 980, s: .95, t: T.t, expr: 'stern', pose: 'lean', hat: 'fedora', hatCol: '#3a3530', trench: '#5a5f4a', jacket: false, look: -1 });
  fieldRadio(c, 1220, 980, T.since('radios') > 0 ? T.since('radios') : 0);
  P('radioman', { x: 1080, y: 990, s: .95, t: T.t, expr: 'focus', pose: 'radio', legs: 'crouch' });
  GRADE.night(c, [...L, [1220, 900, 260, '#9fe0a0', .25]], .32);
  tag(c, 560, 560, 'SECURITY', T.at('security', .45)); tag(c, 1260, 560, 'RADIOS', T.at('radios', .45), { rot: .04 });
  if (T.sub === 0) { const p = T.at('two', .5); tag(c, 860, 200, 'ALREADY IN PLACE', p, { size: 34, bg: '#fff3c4' }); }
} });
S('N5.0', { cams: [[900, 640, 1.2], [960, 600, 1.02]], sfx: [['creak', 'touched', -14]], overlay: NC(), draw(c, T) {
  const L = SET.salvageYard(c, T.t, { lamps: 0 }); gate(c, 110, 552, 230, 330, 0); yTruck(c, T, { state: 'canvas' });
  const back = T.since('touched') > .05; const R = roofOf();
  P('spec1', { x: 560, y: 1000, s: 1, t: T.t, expr: back ? 'worried' : 'neutral', pose: back ? 'handsBack' : 'reach' });
  P('finer', { x: 300, y: 1000, s: 1, t: T.t, expr: 'stern', pose: back ? 'idle' : 'shush' });
  if (T.sub === 1) { P('spec2', { x: 1560, y: 1000, s: .95, t: T.t, expr: 'neutral', pose: 'idle', flip: true }); P('spec3', { x: 1760, y: 1000, s: .95, t: T.t, expr: 'neutral', pose: 'handsBack', flip: true });
    P('radioman', { x: 1340, y: 1004, s: .9, t: T.t, expr: 'stern', pose: 'idle', hat: 'fedora', hatCol: '#3a3530', trench: '#5a5f4a', jacket: false }); P('radioman', { x: 120, y: 1004, s: .9, t: T.t, expr: 'focus', pose: 'radio' }); }
  GRADE.night(c, L, .32);
  if (T.sub === 1) tag(c, 960, 190, 'WAIT', T.at('waited', .4), { size: 44, bg: '#fff3c4' });
} });
S('N5.1', { focus: [900, 560, 1.06], sfx: [['clock', 0, -10, { len: 2.4 }]], overlay: NC(), draw(c, T) {
  const L = SET.salvageYard(c, T.t, { lamps: 0 }); gate(c, 110, 552, 230, 330, 0); yTruck(c, T, { state: 'canvas' }, { x: 1700, y: 1000, s: .9 });
  const lk = T.since('followed') > 0 ? -1 : 0; const sly = T.since('followed') > 0;
  [['finer', 640], ['spec1', 830], ['spec2', 1020], ['spec3', 1200]].forEach(([n, x], i) => P(n, { x, y: 990, s: .82, t: T.t, expr: sly ? 'worried' : 'neutral', pose: 'idle', look: lk }));
  GRADE.night(c, L, .32);
  // the half-hour wedge
  const k = ease(clamp(T.lt / 1.5)); c.save(); c.translate(1500, 300); circ(c, 0, 0, 160, '#f6f0dc'); c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, 150, -Math.PI / 2, -Math.PI / 2 + Math.PI * k); c.closePath(); c.fillStyle = 'rgba(255,176,74,.55)'; c.fill();
  for (let i = 0; i < 12; i++) { const a = i * TAU / 12; line(c, Math.cos(a) * 132, Math.sin(a) * 132, Math.cos(a) * 148, Math.sin(a) * 148, 5); }
  line(c, 0, 0, Math.cos(-Math.PI / 2 + Math.PI * k) * 120, Math.sin(-Math.PI / 2 + Math.PI * k) * 120, 8); line(c, 0, 0, Math.cos(-Math.PI / 2 + (7.5 + k * .5) * TAU / 12) * 80, Math.sin(-Math.PI / 2 + (7.5 + k * .5) * TAU / 12) * 80, 10); circ(c, 0, 0, 10, INK, 0); c.restore();
  label(c, '30 MINUTES', 1500, 510, 46, '#fff');
} });
S('N6.0', { focus: [760, 560, 1.12], sfx: [['creak', 'climbed', -12], ['steps', 'roof', -20, { len: 1 }]], overlay: NC(), draw(c, T) {
  const L = SET.salvageYard(c, T.t, { lamps: 0, drop: 1 }); yTruck(c, T, {}); const R = roofOf();
  ladder(c, R.left - 30, YT.y - 4, YT.y - R.top + 30);
  const k = ease(clamp(T.since('climbed') / 1.1)); P('spec1', { x: R.left - 30, y: lerp(YT.y, R.top + 4, k), s: .82, t: T.t, expr: 'focus', pose: k < 1 ? 'climb' : 'crouch' });
  P('finer', { x: R.cx - 60, y: R.top + 4, s: .82, t: T.t, expr: 'focus', pose: 'crouch', legs: 'crouch' });
  P('spec2', { x: R.cx + 170, y: R.top + 4, s: .82, t: T.t, expr: 'neutral', pose: 'crouch', legs: 'crouch', flip: true });
  ropeCoil(c, 1500, 1000, 60); toolCloth(c, 1700, 1040, 380, { n: 6 });
  GRADE.night(c, L, .32);
} });
S('N6.1', { focus: [740, 580, 1.35], shakes: [['pulling']], sfx: [['creak', 'pulling', -8], ['plank', 'planks', -10]], overlay: NC(), draw(c, T) {
  const L = SET.salvageYard(c, T.t, { lamps: 0, drop: 1 }); const R = roofOf(); const g = easeOut(T.at('planks', .7));
  yTruck(c, T, { planks: g > .5 ? 1 / 9 + .001 : 0 });
  const px = R.left + R.w / 18 + 10; const lift = easeOut(T.at('pulling', .6));
  if (g > .5) plank(c, px - 60, R.top - 120 - g * 60, R.w / 9 * 2.2, -.6 * g);
  else { c.save(); c.translate(px, R.top - 6); c.rotate(-.25 * lift); plank(c, 0, 0, 120, 0); c.restore(); }
  nailPuller(c, px + 40, R.top - 10, .9, -.6 - lift * .5);
  P('spec1', { x: px + 200, y: R.top + 4, s: .9, t: T.t, expr: 'focus', pose: 'wrench', legs: 'crouch', flip: true, sweat: true });
  P('finer', { x: R.cx + 120, y: R.top + 4, s: .9, t: T.t, expr: 'neutral', pose: 'crouch', legs: 'crouch', flip: true });
  GRADE.night(c, L, .32);
  tag(c, px, R.top - 330, '2-INCH BOARDS', T.at('two', .45), { size: 34 });
} });
S('N6.2', { focus: [960, 540, 1.05], sfx: [['hammer', 'five', -10]], draw(c, T) {
  bg(c, '#3a2a1c', '#24180f'); for (let y = -300; y < 1400; y += 70) line(c, -400, y, W + 400, y + 20, 3, 'rgba(0,0,0,.25)'); lightPool(c, 960, 420, 900, '#ffe2a0', .3);
  c.save(); c.translate(640, 560); c.rotate(-.08); box(c, -380, -60, 760, 120, 6, '#c9975a'); for (let i = 0; i < 6; i++) line(c, -370, -40 + i * 18, 370, -36 + i * 18, 2, 'rgba(60,35,10,.3)');
  box(c, 382, -60, 40, 120, 4, '#e0b07a'); for (let i = 0; i < 5; i++) c.beginPath(), c.arc(402, 0, 8 + i * 10, -1.2, 1.2); c.restore();
  const a = easeOut(clamp(T.lt / .5)); c.save(); c.globalAlpha = a; line(c, 1110, 497, 1110, 620, 5, YEL); line(c, 1090, 497, 1130, 497, 5, YEL); line(c, 1090, 620, 1130, 620, 5, YEL); label(c, '2 IN', 1220, 560, 54, YEL); c.restore();
  const s5 = easeOut(T.at('five', .55)); if (s5 > 0) { c.save(); c.globalAlpha = clamp(s5 * 2); spike(c, 1500, 300 - (1 - s5) * 120, 4.2, 0); c.restore();
    const g2 = easeOut(T.at('inch', .5)); if (g2 > 0) { line(c, 1640, 270, 1640, lerp(270, 790, g2), 5, YEL); line(c, 1620, 270, 1660, 270, 5, YEL); if (g2 > .97) line(c, 1620, 790, 1660, 790, 5, YEL); label(c, '5 IN', 1760, 530, 60, YEL); } }
  label(c, 'BOARD', 640, 720, 40, '#f3d9a8', { stroke: false }); if (s5 > .5) label(c, 'SPIKE', 1500, 880, 40, '#f3d9a8', { stroke: false });
} });
S('N7.0', { cams: [[960, 520, 1.02], [900, 600, 1.12]], shakes: [['suddenly']], sfx: [['elec', 'suddenly', -6], ['switch', 'suddenly', -8], ['hit', 'suddenly', -14]], overlay: NC(), draw(c, T) {
  const on = lampFlick(T, 'suddenly'); const L = SET.salvageYard(c, T.t, { lamps: on, drop: 1 }); yTruck(c, T, { planks: .45 }); const R = roofOf();
  const sh = T.since('suddenly') > .05;
  P('spec1', { x: R.left + 120, y: R.top + 4, s: .82, t: T.t, expr: sh ? 'shock' : 'focus', pose: sh ? 'armsUp' : 'wrench', legs: 'crouch' });
  P('finer', { x: R.cx + 40, y: R.top + 4, s: .82, t: T.t, expr: sh ? 'shock' : 'focus', pose: sh ? 'armsUp' : 'crouch', legs: 'crouch' });
  P('spec2', { x: R.right - 70, y: R.top + 4, s: .82, t: T.t, expr: sh ? 'shock' : 'neutral', pose: sh ? 'armsUp' : 'carry', flip: true });
  GRADE.night(c, L, lerp(.42, .2, on));
  if (T.sub === 0) { [260, 980, 1700].forEach((x, i) => { const p = T.at('lamps', .4); if (p > 0 && p < 1) { c.save(); c.globalAlpha = .8 * (1 - p); circ(c, x + 71, 214, 50 + p * 30, null, 5); c.strokeStyle = YEL; c.stroke(); c.restore(); } }); }
  if (on > 0 && T.since('suddenly') < .35) { c.save(); c.globalCompositeOperation = 'screen'; c.globalAlpha = .45 * on * (1 - T.since('suddenly') / .35); c.fillStyle = SOD; c.fillRect(-600, -400, W + 1200, H + 800); c.restore(); }
} });
S('N8.0', { focus: [760, 560, 1.32], shakes: [['froze']], sfx: [['hit', 'froze', -8], ['hit', 'seconds', -14]], overlay: NC(), draw(c, T) {
  const tf = Math.min(T.t, T.cue('froze') + .1); const L = SET.salvageYard(c, tf, { lamps: 1, drop: 1 }); yTruck(c, { t: tf }, { planks: .45 }); const R = roofOf();
  P('spec1', { x: R.left + 120, y: R.top + 4, s: .82, t: tf, expr: 'shock', pose: 'armsUp', legs: 'crouch', sweat: true });
  P('finer', { x: R.cx + 40, y: R.top + 4, s: .82, t: tf, expr: 'worried', pose: 'crouch', legs: 'crouch', sweat: true });
  P('spec2', { x: R.right - 70, y: R.top + 4, s: .82, t: tf, expr: 'shock', pose: 'carry', flip: true });
  plank(c, R.right - 70, R.top - 210, 200, .15);
  GRADE.night(c, L, .22);
  const fz = T.since('froze'); if (fz > 0) { c.save(); c.globalCompositeOperation = 'saturation'; c.globalAlpha = clamp(fz * 3) * .7; c.fillStyle = '#888'; c.fillRect(-600, -400, W + 1200, H + 800); c.restore();
    const beat = Math.exp(-((fz % .9) * 8)); c.save(); c.globalAlpha = .25 * beat; c.fillStyle = '#b8322a'; c.fillRect(-600, -400, W + 1200, H + 800); c.restore(); }
} });
S('N8.1', { focus: [960, 470, 1.08], shakes: [['ambush']], sfx: [['hit', 'ambush', -6], ['static', 'looked', -22, { len: 1.6 }]], draw(c, T) {
  NIGHT_SKY(c, T.t, '#12060a', '#2a0c10', 20); woodFence(c, -400, W + 400, 760, 520, { seed: 4 }); FLOOR(c, 760, '#1a0c0c');
  const k = easeOut(T.at('looked', .9)), k2 = easeOut(T.at('ambush', .45));
  [[260, 0], [620, .15], [980, .05], [1340, .2], [1680, .1]].forEach(([x, d], i) => { const up = i % 2 ? k2 : k; const y = 760 - 520 + 150 - up * 190; c.save(); c.beginPath(); c.rect(-400, -400, W + 800, 240 + 400); c.clip();
    P('guard', { x, y: y + 330, s: 1.05, t: T.t, expr: 'stern', pose: 'idle' }); c.restore(); });
  [[300, 1.6], [1500, 1.4]].forEach(([x, f]) => cone(c, x, -60, 40, 360, 900, '#ff4a3a', .14 * k2 * (.6 + .4 * Math.sin(T.t * f * 4))));
  c.save(); c.globalCompositeOperation = 'multiply'; c.globalAlpha = .55; c.fillStyle = '#c0182a'; c.fillRect(-600, -400, W + 1200, H + 800); c.restore();
  GRADE.dark(c, .25); vignette(c, .8);
} });
S('N9.0', { focus: [960, 520, 1.05], sfx: [['crickets', 'no', -20, { len: 4 }]], overlay: NC(), draw(c, T) {
  const L = SET.salvageYard(c, T.t, { lamps: 1, drop: 1 }); gate(c, 110, 552, 230, 330, 0);
  const k = clamp(T.since('no') / 2.4); cat(c, lerp(300, 1500, k), 218, T.t, 1.2);
  const R = roofOf(); yTruck(c, T, { planks: .45 });
  P('spec1', { x: R.left + 120, y: R.top + 4, s: .82, t: T.t, expr: 'worried', pose: 'crouch', legs: 'crouch', look: -1 });
  P('finer', { x: R.cx + 40, y: R.top + 4, s: .82, t: T.t, expr: T.since('came') > .4 ? 'neutral' : 'worried', pose: 'crouch', legs: 'crouch', look: -1 });
  GRADE.night(c, L, .22);
  tag(c, 225, 640, 'NO ONE', T.at('came', .45), { size: 34, bg: '#fff3c4' });
} });
S('N9.1', { focus: [960, 470, 1.04], sfx: [['switch', 'lights', -14], ['switch', 'coming', -16]], overlay: NC(), draw(c, T) {
  NIGHT_SKY(c, T.t, '#081226', '#1d3550', 70); const R = rand(9); const k = clamp(T.since('lights') / 1.6);
  skyline(c, 640, '#0f1d30', 'rgba(255,200,110,.45)', 3, 1.1);
  for (let row = 0; row < 4; row++) { const y = 650 + row * 46, n = 12 + row * 6; for (let i = 0; i < n; i++) { const x = -200 + (i + (row % 2) * .5) * (W + 400) / n; const on = k > (i / n) * .8 + row * .05;
    circ(c, x, y, 4 + row * 1.6, on ? '#ffc070' : '#2a3550', 0); if (on) lightPool(c, x, y, 40 + row * 18, SOD, .5); } }
  c.fillStyle = '#0a0f18'; c.fillRect(-400, 860, W + 800, 400); woodFence(c, -400, W + 400, 1080, 200, { seed: 4 });
  const ok = T.since('night') > 0;
  P('spec1', { x: 760, y: 1120, s: 1.05, t: T.t, expr: ok ? 'grin' : 'worried', pose: 'idle' }); P('finer', { x: 1120, y: 1120, s: 1.05, t: T.t, expr: ok ? 'happy' : 'worried', pose: ok ? 'shrug' : 'idle', flip: true });
  GRADE.night(c, [[960, 700, 1200, SOD, .25]], .2);
} });
S('N10.0', { focus: [1100, 520, 1.08], sfx: [['creak', 'lowered', -14]], draw(c, T) {
  SET.grid(c, T.t, { title: 'CRATE + LUNIK', sub: 'SECTION, LOOKING IN' });
  c.save(); c.lineWidth = 4; c.strokeStyle = '#e8f1ff'; c.setLineDash([16, 10]); c.strokeRect(220, 380, 1480, 440); c.restore();
  lunik(c, 960, 600, 1380, { blueprint: true });
  const nx = 960 + 1380 * .3; const k = ease(T.at('lowered', 1.4));
  [nx - 70, nx + 50].forEach((x, i) => { const y = lerp(300, 700, clamp(k - i * .12)); line(c, x, 100, x, y - 180, 3, '#ffcf3f'); bpMan(c, x, y, .75, '#ffcf3f'); });
  const p = T.at('nose', .45); if (p > 0) { c.save(); c.globalAlpha = p; c.beginPath(); c.arc(nx, 600, 230, 0, TAU); c.lineWidth = 5; c.strokeStyle = YEL; c.setLineDash([12, 10]); c.stroke(); c.restore(); label(c, 'THE NOSE', nx, 880, 46, YEL); }
} });
S('N11.0', { focus: [960, 620, 1.18], sfx: [['steps', 'shoes', -14, { len: .8 }]], overlay: NC(), draw(c, T) {
  bg(c, '#0b1322', '#16202e'); lightPool(c, 980, 380, 700, '#ffe2a0', .45); dropLight(c, 980, 260, 1, 300);
  box(c, -400, 760, W + 800, 80, 4, '#c9975a'); for (let i = -400; i < W + 400; i += 220) line(c, i, 760, i, 840, 3, 'rgba(60,35,10,.5)'); c.fillStyle = '#7a5a3a'; c.fillRect(-400, 840, W + 800, 400);
  P('spec1', { x: 560, y: 790, s: 1, t: T.t, expr: 'focus', pose: 'crouch', legs: 'sit', shoes: '#ece6d6' });
  const p1 = easeOut(T.at('shoes', .5)), p2 = easeOut(clamp((T.since('shoes') - .3) / .5));
  if (p1 > 0) { shoe(c, 980, 760 - (1 - p1) * 160, 1.3); shoe(c, 1110, 760 - (1 - p1) * 160, 1.3); }
  if (p2 > 0) { shoe(c, 1300, 760 - (1 - p2) * 160, 1.3, '#2b2f36'); shoe(c, 1430, 760 - (1 - p2) * 160, 1.3, '#2b2f36'); }
  if (T.since('took') < 1.2 && T.since('took') > 0) shoe(c, 700, 600, 1.2, '#3b2a22');
  GRADE.night(c, [[980, 420, 700, '#ffe2a0', .35]], .22);
} });
S('N11.1', { focus: [960, 560, 1.1], sfx: [['steps', 0, -16, { len: 1.2 }]], overlay: NC(), draw(c, T) {
  const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#5a6470'); g.addColorStop(.5, '#c9d1d8'); g.addColorStop(1, '#7d868e'); c.fillStyle = g; c.fillRect(-600, -400, W + 1200, H + 800);
  for (let i = 0; i < 6; i++) line(c, -400, 180 + i * 170, W + 400, 160 + i * 170, 3, 'rgba(40,50,60,.25)'); for (let x = 100; x < W; x += 200) for (let y = 260; y < H; y += 340) circ(c, x, y, 6, '#8a939b', 2.5);
  c.save(); c.globalAlpha = .55; c.fillStyle = '#fff'; c.beginPath(); c.moveTo(-200, 380); c.lineTo(W + 200, 300); c.lineTo(W + 200, 340); c.lineTo(-200, 420); c.fill(); c.restore();
  // the scuff that never happened
  const s = T.at('scuff', .4); c.save(); c.globalAlpha = .5; shoe(c, 1450, 520, 1.6, '#2b211e'); c.restore(); c.save(); c.globalAlpha = .55; line(c, 1350, 560, 1610, 540, 14, '#3b3330'); c.restore();
  if (s > 0) { line(c, 1320, 380, 1320 + 340 * s, 380 + 240 * s, 16, RED); if (s > .5) line(c, 1660, 380, 1660 - 340 * (s - .5) * 2, 380 + 240 * (s - .5) * 2, 16, RED); }
  const st = T.lt * 3; sockFoot(c, 600, 900, 1.6, Math.max(0, Math.sin(st)) * 40); sockFoot(c, 880, 930, 1.6, Math.max(0, Math.sin(st + Math.PI)) * 40);
  const m = T.at('metal', .4); tag(c, 760, 220, 'SOCKS ONLY', m, { size: 34 });
} });
S('N11.2', { focus: [960, 560, 1.12], shakes: [['photographing']], sfx: [['camflash2', 'photographing', -6], ['camshutter', 'sphere', -8]], overlay: NC(), draw(c, T) {
  bg(c, '#12171f', '#1b2028'); for (let i = 0; i < 7; i++) { c.beginPath(); c.arc(1240, 540, 260 + i * 90, Math.PI * .6, Math.PI * 1.4); c.lineWidth = 3; c.strokeStyle = 'rgba(160,170,180,.18)'; c.stroke(); }
  line(c, 1240, 560, 1900, 560, 18, '#7c858d'); line(c, 1240, 560, 1900, 560, 8, '#9aa3ab');
  circ(c, 1240, 540, 210, '#c9ced4'); c.save(); c.beginPath(); c.arc(1240, 540, 210, 0, TAU); c.clip(); circ(c, 1340, 640, 210, 'rgba(0,0,0,.25)', 0); c.restore(); circ(c, 1170, 470, 40, 'rgba(255,255,255,.8)', 0);
  for (let a = 0; a < 4; a++) { const an = a * TAU / 4 + .5; line(c, 1240 + Math.cos(an) * 210, 540 + Math.sin(an) * 210, 1240 + Math.cos(an) * 300, 540 + Math.sin(an) * 300, 7); }
  const f1 = T.at('photographing', .6), f2 = T.at('sphere', .6);
  P('finer', { x: 520, y: 1000, s: 1.15, t: T.t, expr: 'focus', pose: 'photograph', legs: 'crouch', flash: f1 > 0 && f1 < 1 ? f1 : f2, shoes: '#ece6d6' });
  GRADE.night(c, [[1240, 540, 420, '#cfe0ff', .2]], .3);
  GRADE.flash(c, 700, 420, f1); GRADE.flash(c, 700, 420, f2);
  tag(c, 1240, 860, 'PAYLOAD SPHERE', T.at('payload', .45));
} });
S('N11.3', { focus: [960, 540, 1.05], sfx: [['camflash2', 'every', -8], ['camshutter', 'marking', -8], ['camflash2', 'could', -10], ['camshutter', 'find', -8]], overlay: NC(), draw(c, T) {
  bg(c, '#646d76', '#3e464e'); for (let x = -400; x < W + 400; x += 320) line(c, x, -300, x, H + 300, 4, 'rgba(30,35,40,.35)'); for (let x = -240; x < W + 400; x += 320) for (let y = 40; y < H; y += 120) circ(c, x, y, 5, '#8a939b', 2);
  const M = [[330, 330, 'CCCP'], [860, 250, '-- --'], [1420, 360, 'CCCP'], [560, 720, '--- -'], [1180, 700, '-- ---']];
  const s0 = T.since('every');
  M.forEach(([x, y, tx], i) => { const ti = s0 - i * .5;
    box(c, x - 150, y - 60, 300, 120, 6, '#4d555d', 3); label(c, tx, x, y, 44, '#c9ced4', { stroke: false, raw: true }); for (let k = 0; k < 3; k++) line(c, x - 120 + k * 90, y + 44, x - 60 + k * 90, y + 44, 4, '#2b2f36');
    if (ti > 0) { c.save(); c.globalAlpha = clamp(ti * 3); rr(c, x - 166, y - 76, 332, 152, 10); c.lineWidth = 6; c.strokeStyle = '#fff'; c.stroke(); c.restore(); circ(c, x + 150, y - 70, 30, '#2f9e5a', 4); line(c, x + 136, y - 70, x + 147, y - 58, 6, '#fff'); line(c, x + 147, y - 58, x + 166, y - 84, 6, '#fff'); }
    if (ti > 0 && ti < .5) lightPool(c, x, y, 400, '#ffffff', (1 - ti / .5) * .9); });
  vignette(c, .7);
} });
S('N12.0', { focus: [860, 560, 1.12], sfx: [['creak', 'stretched', -12], ['paper', 'tarp', -14]], overlay: NC(), draw(c, T) {
  const L = SET.salvageYard(c, T.t, { lamps: 1, drop: 1 }); const R = roofOf(); const k = easeOut(T.at('stretched', 1));
  yTruck(c, T, { planks: .6, tarp: k });
  P('spec2', { x: R.left - 80, y: YT.y, s: .95, t: T.t, expr: 'focus', pose: 'holdHigh', sweat: true });
  P('spec3', { x: R.right + 40, y: R.top + 4, s: .8, t: T.t, expr: 'focus', pose: 'holdHigh', flip: true });
  if (k > 0 && k < 1) rope(c, R.left - 80, YT.y - 290, R.left - 20, R.top - 70, 30);
  GRADE.night(c, L, .25);
  tag(c, 520, 230, 'PER MAYSH', T.at('maich', .45), { size: 34 }); tag(c, R.cx + 80, R.top - 220, 'TARP', T.at('tarp', .45), { bg: '#fff3c4' });
} });
S('N12.1', { cams: [[960, 560, 1.06], [960, 300, 1.2]], sfx: [['camflash2', 'flashes', -20], ['camflash2', 'light', -22], ['crickets', 0, -24, { len: 3 }]], overlay: NC(), draw(c, T) {
  NIGHT_SKY(c, T.t, '#050a16', '#0c1a2e', 140); skyline(c, 720, '#0c1828', 'rgba(255,200,110,.3)', 12, .8);
  const fl = [.2, .9, 1.5, 2.2, 2.8].reduce((a, s) => { const d = T.lt - s; return Math.max(a, d > 0 && d < .4 ? 1 - d / .4 : 0); }, 0);
  const cx = 960, cy = 780; lightPool(c, cx, cy - 40, 260 + fl * 80, '#dfe8ff', .15 + fl * .4);
  crate(c, cx, cy + 60, 760, { planks: .6, tarp: 1 }); woodFence(c, -400, W + 400, 900, 300, { seed: 9 });
  [260, 1660].forEach(x => sodiumLamp(c, x, 920, 330, 1));
  GRADE.night(c, [[331, 600, 400, SOD, .4], [1731, 600, 400, SOD, .4]], .3);
  const sky = T.since('sky'); if (sky > 0) { tag(c, 960, 200, 'SKY STAYS DARK', clamp(sky * 2), { size: 36, bg: '#fff3c4' }); }
} });
S('N13.0', { focus: [960, 560, 1.15], sfx: [['camshutter', 'working', -10], ['pop', 'test', -10]], overlay: NC(), draw(c, T) {
  bg(c, '#0b1322', '#16202e'); lightPool(c, 960, 420, 700, '#ffe2a0', .4); box(c, -400, 760, W + 800, 500, 4, '#c9975a');
  pressCamera(c, 800, 700, 2.4, { flash: T.at('working', .4) });
  const k = easeOut(T.at('test', .5)); if (k > 0) filmCanister(c, lerp(900, 1360, k), lerp(640, 520, k) - Math.sin(k * Math.PI) * 120, 2.2, { label: 'TEST' });
  arm(c, 1900, 900, lerp(1700, 1420, k), lerp(820, 560, k), SKIN, '#e9d9b2');
  GRADE.night(c, [[960, 460, 600, '#ffe2a0', .3]], .2);
  tag(c, 1360, 260, 'TEST ROLL', T.at('test', .45), { size: 38 });
} });
S('N13.1', { focus: [960, 600, 1.05], sfx: [['carengine', 'rushed', -8], ['whoosh2', 'out', -12]], overlay: NC(), draw(c, T) {
  const L = SET.nightStreet(c, T.t, { scroll: 1600 }); const k = clamp(T.since('rushed') / 2.2);
  const x = lerp(-300, 2300, ease(k));
  for (let i = 0; i < 6; i++) line(c, x - 280 - i * 60, 880 + i * 14, x - 520 - i * 90, 880 + i * 14, 5, 'rgba(255,255,255,.35)');
  car59(c, x, 1000, 1.25, { col: '#2f3e52', lights: 1, moving: true, t: T.t * 3, driver: 'newdriver' });
  GRADE.night(c, [...(L || []), [x + 500, 900, 400, '#fff0c0', .3]], .3);
  tag(c, 1460, 250, 'TO BE DEVELOPED', T.at('developed', .45), { size: 34 });
  if (T.lt < .9) { c.save(); c.globalAlpha = 1 - T.lt / .9; filmCanister(c, 500, 600, 1.6, { label: 'TEST' }); c.restore(); }
} });
S('N14.0', { focus: [960, 560, 1.12], sfx: [['paper', 'dark', -14]], overlay: NC('U.S. EMBASSY'), draw(c, T) {
  SET.darkroom(c, T.t); const p = clamp(T.since('dark') / 1.2);
  devTray(c, 960, 760, 760, p, () => { circ(c, 0, 0, 90, '#cfd4da', 4); line(c, 90, 0, 260, 0, 8); });
  P('spec3', { x: 420, y: 1000, s: 1.0, t: T.t, expr: 'focus', pose: 'reach', hair: 'short' });
  tag(c, 960, 200, 'PER MAYSH', T.at('maich', .45), { size: 34 });
  tag(c, 1460, 420, 'EMBASSY DARKROOM', T.at('dark', .45), { rot: .05, bg: '#ffd6c8' });
} });
S('N14.1', { focus: [960, 540, 1.12], sfx: [['ding', 'good', -10], ['stamp', 'good', -8]], overlay: NC(), draw(c, T) {
  const L = SET.salvageYard(c, T.t, { lamps: 1, drop: 1 });
  const h = P('finer', { x: 640, y: 1000, s: 1.15, t: T.t, expr: T.since('good') > 0 ? 'grin' : 'focus', pose: 'holdUp' });
  P('spec1', { x: 360, y: 1000, s: 1.0, t: T.t, expr: T.since('good') > 0 ? 'happy' : 'neutral', pose: T.since('good') > 0 ? 'cheer' : 'idle' });
  GRADE.night(c, L, .25);
  photoPrint(c, 1220, 470, 560, 380, -.03, () => { circ(c, -40, 0, 120, '#d8dde2', 4); line(c, 80, 0, 290, 0, 10); for (let a = 0; a < 4; a++) { const an = a * TAU / 4 + .5; line(c, -40 + Math.cos(an) * 120, Math.sin(an) * 120, -40 + Math.cos(an) * 170, Math.sin(an) * 170, 6); } }, { caption: 'TEST ROLL' });
  tag(c, 1220, 180, 'U.S. EMBASSY DARKROOM', T.at('embassy', .45), { size: 30 });
  stamp(c, 1260, 520, 'GOOD', T.at('good', .35), '#2f9e5a', { w: 300, h: 110 });
} });
S('N15.0', { focus: [960, 540, 1.05], sfx: [['whoosh1', 'other', -14]], draw(c, T) {
  SET.grid(c, T.t, { title: 'LUNIK', sub: 'THE OTHER END' }); const pan = lerp(380, -260, ease(clamp(T.since('other') / 1.4)));
  c.save(); c.translate(pan, 0); lunik(c, 960, 560, 1500, { blueprint: true });
  const nx = 960 + 1500 * .3; bpMan(c, nx - 60, 640, .6, '#ffcf3f'); bpMan(c, nx + 40, 640, .6, '#ffcf3f');
  const tx = 960 - 750; const p = easeOut(T.at('two', .5)); if (p > 0) { c.save(); c.globalAlpha = p; bpMan(c, tx - 150, 820, .8, '#7fe0ff'); bpMan(c, tx - 40, 830, .8, '#7fe0ff'); c.restore(); }
  const q = T.at('off', .4); if (q > 0) { c.save(); c.globalAlpha = q; ell(c, tx + 8, 560, 90, 260, null, 0); c.lineWidth = 6; c.strokeStyle = YEL; c.setLineDash([12, 10]); c.stroke(); c.restore(); }
  c.restore();
  if (T.since('two') > 0) label(c, '+ TWO MORE MEN', 1500, 220, 44, '#7fe0ff');
} });
S('N15.1', { cams: [[760, 560, 1.15], [960, 560, 1.1]], sfx: [['wrench', 'base', -12, { len: 2 }], ['ding', '130', -12], ['wrench', '130', -14, { len: 2 }]], overlay: NC(), draw(c, T) {
  bg(c, '#0b1322', '#16202e'); lightPool(c, 700, 500, 800, '#ffe2a0', .35); dropLight(c, 700, 140, 1, 200);
  if (T.sub === 0) { lunik(c, 1500, 560, 1700, { capOff: 0, paint: 'raw' });
    const tx = 1500 - 850 + 8; const p = T.at('base', .4); if (p > 0) { c.save(); c.globalAlpha = p * (.7 + .3 * Math.sin(T.t * 8)); ell(c, tx, 560, 100, 280, null, 0); c.lineWidth = 8; c.strokeStyle = YEL; c.stroke(); c.restore(); }
    P('spec2', { x: 380, y: 1000, s: 1.05, t: T.t, expr: 'focus', pose: 'wrench', sweat: true }); P('spec3', { x: 380, y: 610, s: .8, t: T.t, expr: 'focus', pose: 'wrench', legs: 'crouch' });
    GRADE.night(c, [[700, 500, 700, '#ffe2a0', .35]], .22); tag(c, tx, 170, 'BASE CAP', T.at('cap', .45), { size: 36 }); return; }
  const n = num(T, '130', 130, 1.1); bolts(c, 640, 960, 520, Math.round(n));
  wrench(c, 1300, 760, 1.6, -.3 + Math.sin(T.t * 10) * .12);
  GRADE.night(c, [[700, 500, 700, '#ffe2a0', .35]], .2);
  box(c, 1080, 220, 560, 230, 20, 'rgba(10,14,24,.85)', 4); label(c, 'BOLTS', 1360, 270, 40, '#c9d6e8', { stroke: false }); label(c, '~' + Math.round(n), 1360, 370, 120, YEL);
} });
S('N16.0', { focus: [760, 560, 1.12], sfx: [['hit', 'gone', -14], ['switch', 'brackets', -16]], overlay: NC(), draw(c, T) {
  bg(c, '#0b1322', '#121a26');
  const tx = 1500 - 850; lunik(c, 1500, 560, 1700, { capOff: 1, cutaway: 1, paint: 'raw' });
  const g = T.at('gone', .5); if (g > 0) { c.save(); c.globalAlpha = g; c.setLineDash([18, 12]); c.lineWidth = 6; c.strokeStyle = '#ff8a7a'; c.beginPath(); c.moveTo(tx, 420); c.lineTo(tx - 360, 360); c.lineTo(tx - 360, 760); c.lineTo(tx, 700); c.stroke(); c.restore(); label(c, 'ENGINE: GONE', tx - 190, 300, 46, '#ff8a7a'); }
  const b = T.at('brackets', .6); torch(c, 160, 960, lerp(-.5, -.15, b), 1100, .3 + b * .2);
  GRADE.night(c, [[tx + 120, 560, 340 * b, '#ffe2a0', .5 * b]], .3);
  if (b > 0) { c.save(); c.globalAlpha = b; [[tx + 160, 440], [tx + 160, 680]].forEach(([x, y]) => { c.beginPath(); c.arc(x, y, 64, 0, TAU); c.lineWidth = 6; c.strokeStyle = YEL; c.stroke(); }); c.restore(); tag(c, tx + 330, 880, 'MOUNTING BRACKETS', b, { size: 32 }); }
} });
S('N16.1', { cams: [[960, 560, 1.15], [1140, 560, 1.2]], sfx: [['ding', 'fuel', -16], ['ding', 'oxidizer', -16]], overlay: NC(), draw(c, T) {
  bg(c, '#0b1322', '#121a26'); const LX = 1100, LL = 1900; lunik(c, LX, 560, LL, { capOff: 1, cutaway: 1, paint: 'raw' });
  const x0 = LX - LL / 2, xN = LX + LL * .18; const fx = lerp(x0, xN, .28), ox = lerp(x0, xN, .62);
  const f = T.at('fuel', .5), o = T.at('oxidizer', .5);
  torch(c, 120, 1000, lerp(-.42, -.22, f) - o * .08, 1500, .3);
  GRADE.night(c, [[fx, 560, 260 * f, '#ffd27a', .55 * f], [ox, 560, 280 * o, '#bfe0ff', .55 * o]], .32);
  tag(c, fx, 270, 'FUEL TANK', f, { size: 34 }); tag(c, ox, 270, 'OXIDIZER TANK', o, { size: 34, bg: '#d8ecff', fg: '#1d3557' });
} });
S('N17.0', { focus: [960, 540, 1.18], shakes: [['problem']], sfx: [['clock', 0, -6, { len: 2.2 }], ['hit', 'problem', -10]], overlay: NC(), draw(c, T) {
  bg(c, '#070a10', '#0d121a'); lightPool(c, 1100, 520, 500, '#ffe2a0', .25);
  line(c, 400, 560, 2000, 560, 20, '#7c858d'); seal(c, 1200, 566, 1.6, {}); circ(c, 360, 540, 170, '#aeb6bd');
  const p = T.since('problem'); const reach = easeOut(clamp(T.lt / 1.2)); const jitter = p > 0 ? Math.sin(p * 60) * Math.exp(-p * 6) * 8 : 0;
  arm(c, 1500, 1200, lerp(1450, 1250, reach) + jitter, lerp(1050, 720, reach), SKIN, '#e9e4d6');
  P('finer', { x: 1700, y: 1240, s: 1.2, t: T.t, expr: p > 0 ? 'worried' : 'focus', pose: 'idle', sweat: p > 0, flip: true });
  GRADE.night(c, [[1200, 560, 380, '#ffe2a0', .3]], .3); vignette(c, .8);
} });
S('N18.0', { cams: [[760, 520, 1.2], [1180, 560, 1.25]], sfx: [['ding', 'rod', -16], ['ding', 'wire', -16], ['stamp', 'seal', -12]], draw(c, T) {
  SET.grid(c, T.t, { title: 'PAYLOAD MOUNT', sub: 'DETAIL' });
  const sp = T.at('sphere', .5), rd = T.at('rod', .5), wr = T.at('wire', .5), sl = T.at('seal', .5);
  c.lineWidth = 4; c.strokeStyle = '#e8f1ff'; c.beginPath(); c.arc(620, 520, 200, 0, TAU); c.stroke(); for (let a = 0; a < 4; a++) { const an = a * TAU / 4 + .5; line(c, 620 + Math.cos(an) * 200, 520 + Math.sin(an) * 200, 620 + Math.cos(an) * 290, 520 + Math.sin(an) * 290, 4, '#e8f1ff'); }
  line(c, 820, 520, 1700, 520, rd > 0 ? 10 : 4, rd > 0 ? YEL : '#e8f1ff');
  if (wr > 0) seal(c, 1250, 524, 1.9, { bp: false }); if (wr > 0 && sl <= 0) { c.save(); c.fillStyle = '#123a63'; c.fillRect(1250 - 70, 460, 140, 120); c.restore(); line(c, 1030, 524, 1470, 524, 6, '#c9ced4'); }
  if (sp > 0) { c.save(); c.globalAlpha = sp; c.beginPath(); c.arc(620, 520, 210, 0, TAU); c.lineWidth = 8; c.strokeStyle = YEL; c.stroke(); c.restore(); tag(c, 620, 220, 'PAYLOAD SPHERE', sp, { size: 34 }); }
  tag(c, 1560, 420, 'ROD', rd, { size: 34 }); tag(c, 1050, 700, 'WIRE', wr, { size: 34 });
  if (sl > 0) { tag(c, 1400, 760, 'SOVIET-STAMPED SEAL', sl, { size: 34, bg: '#ffd6c8' }); c.save(); c.globalAlpha = sl; c.beginPath(); c.arc(1250, 524, 110, 0, TAU); c.lineWidth = 6; c.strokeStyle = '#ff6a5a'; c.setLineDash([10, 8]); c.stroke(); c.restore(); }
} });
S('N19.0', { cams: [[1100, 560, 1.15], [1200, 560, 1.3]], sfx: [['creak', 'cut', -16]], overlay: NC(), draw(c, T) {
  bg(c, '#0b1322', '#16202e'); lightPool(c, 1200, 520, 600, '#ffe2a0', .35);
  line(c, -100, 560, 2000, 560, 22, '#7c858d'); circ(c, 200, 540, 240, '#c9ced4'); seal(c, 1200, 566, 2.2, {});
  const app = easeOut(T.at('wire', .8)); const cutS = T.since('cut'); const open = cutS > 0 ? .9 - .35 * Math.abs(Math.sin(cutS * 5)) * Math.exp(-cutS * 1.5) : 1;
  cutters(c, lerp(1900, 1420, app), lerp(260, 470, app), 1.5, open, 2.3);
  GRADE.night(c, [[1200, 560, 420, '#ffe2a0', .35]], .25);
  tag(c, 760, 200, 'TO FREE THE SPHERE', T.at('free', .45), { size: 34 });
  if (T.sub === 1) tag(c, 1200, 860, 'THE WIRE MUST BE CUT', T.at('cut', .4), { size: 36, bg: '#ffd6c8' });
} });
S('N19.1', { cams: [[960, 560, 1.12], [760, 480, 1.2]], sfx: [['whoosh3', 0, -14]], draw(c, T) {
  const L = SET.railYard(c, T.t, { morning: 1 }); GRADE.dawn(c, .3);
  P('checker', { x: 620, y: 1060, s: 1.6, t: T.t, expr: T.since('notice') > 0 ? 'shock' : 'focus', pose: 'idle' });
  magnifier(c, 1260, 520, 230, () => { c.fillStyle = '#d8dde2'; c.fillRect(1030, 290, 460, 460); line(c, 1030, 520, 1490, 520, 22, '#7c858d'); seal(c, 1260, 524, 2.4, { cut: T.since('broken') > -1 }); });
  c.save(); c.globalCompositeOperation = 'saturation'; c.globalAlpha = .55; c.fillStyle = '#888'; c.fillRect(-600, -400, W + 1200, H + 800); c.restore();
  c.save(); c.globalCompositeOperation = 'multiply'; c.globalAlpha = .25; c.fillStyle = '#c9a070'; c.fillRect(-600, -400, W + 1200, H + 800); c.restore(); vignette(c, .75);
  tag(c, 1260, 860, 'BROKEN SEAL', T.at('broken', .45), { size: 36, bg: '#ffd6c8' }); if (T.since('notice') > 0) tag(c, 520, 200, 'THE CHECKER WOULD NOTICE', clamp(T.since('notice') * 2), { size: 34 });
} });
card('N20.0', 'They cut it.');
S('N21.0', { focus: [960, 560, 1.12], sfx: [['radio', 'reproduce', -16]], overlay: NC('U.S. EMBASSY'), draw(c, T) {
  SET.embassyOffice(c, T.t, { night: 1 });
  P('analyst', { x: 620, y: 1000, s: 1.1, t: T.t, expr: T.since('reproduce') > 0 ? 'smug' : 'neutral', pose: 'point', talk: T.since('said') > 0 && T.lt < 2.8 });
  P('analyst2', { x: 1260, y: 1000, s: 1.1, t: T.t, expr: 'focus', pose: 'phone', flip: true });
  tag(c, 960, 200, 'STATION OFFICERS', T.at('officers', .45), { size: 34 });
  const p = T.at('reproduce', .4); if (p > 0) { c.save(); c.globalAlpha = p; box(c, 700, 300, 520, 140, 30, '#fff', 5); poly(c, [[760, 436], [720, 500], [820, 436]], '#fff', 0); line(c, 720, 500, 760, 436, 5); line(c, 720, 500, 820, 436, 5); label(c, 'WE CAN COPY IT', 960, 372, 52, INK, { stroke: false }); c.restore(); }
} });
S('N21.1', { cams: [[960, 560, 1.08], [1100, 560, 1.2]], sfx: [['pop', 'plastic', -12], ['pop', 'stamp', -12], ['pop', 'wire', -12], ['stamp', 'night', -8]], overlay: NC('U.S. EMBASSY'), draw(c, T) {
  bg(c, '#4a3424', '#2e2016'); box(c, -400, 700, W + 800, 600, 4, '#6d4c41'); lightPool(c, 960, 520, 900, '#ffd27a', .45);
  const a1 = easeOut(T.at('plastic', .45)), a2 = easeOut(T.at('stamp', .45)), a3 = easeOut(T.at('wire', .45));
  if (a1 > 0) { c.save(); c.translate(520, 640 - (1 - a1) * 80); c.globalAlpha = clamp(a1 * 2); box(c, -80, -60, 160, 120, 20, '#e0453a'); c.restore(); label(c, 'PLASTIC', 520, 760, 40, '#f3e3c8', { stroke: false }); }
  if (a3 > 0) { c.save(); c.globalAlpha = clamp(a3 * 2); for (let i = 0; i < 5; i++) ell(c, 1400, 650 - i * 10 - (1 - a3) * 80, 90 - i * 4, 30, null, 5); c.strokeStyle = '#9aa1a8'; c.restore(); label(c, 'WIRE', 1400, 760, 40, '#f3e3c8', { stroke: false }); }
  if (a2 > 0) { const press = T.sub === 1 ? easeOut(T.at('night', .3)) : 0; c.save(); c.globalAlpha = clamp(a2 * 2); sealStamp(c, 960, 640 - (1 - a2) * 100 + press * 60, 1.3); c.restore();
    label(c, 'STAMP', 960, 760, 40, '#f3e3c8', { stroke: false });
    if (press > .9) { c.save(); c.translate(520, 640); box(c, -80, -60, 160, 120, 20, '#e0453a'); label(c, 'CCCP', 0, 0, 34, '#7a1a12', { stroke: false, raw: true }); c.restore(); } }
  GRADE.warm(c, .15);
  if (T.sub === 1) tag(c, 960, 200, 'A DUPLICATE', T.at('before', .45), { size: 34 });
} });
S('N21.2', { cams: [[700, 560, 1.15], [760, 600, 1.25]], sfx: [['steps', 'duplicate', -18, { len: 1.2 }], ['paper', 'delivered', -10]], overlay: NC(), draw(c, T) {
  const L = SET.salvageYard(c, T.t, { lamps: 1, drop: 1 }); gate(c, 380, 552, 230, 330, .35);
  const g = easeOut(T.at('delivered', .7));
  P('newdriver', { x: 440, y: 980, s: 1.0, t: T.t, expr: 'neutral', pose: 'give', hat: 'fedora', hatCol: '#3a3530', trench: '#5a5f4a', jacket: false });
  P('spec1', { x: 980, y: 980, s: 1.0, t: T.t, expr: g > .5 ? 'grin' : 'neutral', pose: g > .5 ? 'holdUp' : 'reach', flip: true, shoes: '#ece6d6' });
  GRADE.night(c, L, .25);
  envelope(c, lerp(640, 900, g), lerp(740, 560, g), 200, '', -.1);
  tag(c, lerp(640, 900, g), lerp(600, 410, g), 'DUPLICATE SEAL', T.at('duplicate', .45), { size: 30 });
} });
S('N22.0', { cams: [[960, 560, 1.1], [1200, 560, 1.25]], sfx: [['crickets', 0, -26, { len: 3 }], ['ding', 'two', -12], ['sparkle', 'couplings', -14]], overlay: NC(), draw(c, T) {
  bg(c, '#0a0e15', '#12171f'); for (let i = 0; i < 5; i++) line(c, -400, 300 + i * 160, W + 400, 280 + i * 160, 3, 'rgba(120,130,140,.18)');
  const sweep = T.since('found') > 0 ? lerp(-.05, .12, easeOut(T.since('found') / .6)) : Math.sin(T.t * 1.6) * .3 - .1;
  coupling(c, 1150, 620, 1.7, T.since('found') > 0 ? clamp(T.since('found') * 2) : 0); coupling(c, 1330, 650, 1.7, T.since('two') > 0 ? 1 : 0);
  P('spec2', { x: 420, y: 1040, s: 1.15, t: T.t, expr: T.since('couplings') > .3 ? 'grin' : T.since('found') > 0 ? 'shock' : 'focus', pose: 'point', shoes: '#ece6d6' });
  torch(c, 520, 700, sweep, 1100, .32); GRADE.night(c, [[1240, 620, 320, '#ffe2a0', .3]], .25);
  tag(c, 1240, 330, 'TWO COUPLINGS', T.at('couplings', .45), { size: 36 }); if (T.sub === 1) tag(c, 1240, 880, 'FORGOTTEN BY THE SOVIETS', T.at('soviets', .45), { size: 30, bg: '#ffd6c8' });
} });
S('N22.1', { cams: [[960, 560, 1.12], [1000, 600, 1.18]], sfx: [['bag', 'bag', -10], ['stamp', 'washington', -12]], overlay: NC(), draw(c, T) {
  bg(c, '#0b1322', '#16202e'); lightPool(c, 960, 480, 700, '#ffe2a0', .4); box(c, -400, 860, W + 800, 400, 4, '#c9975a');
  const d = easeOut(T.at('bag', .55)); couplingBag(c, 960, 960, 1.6, { open: d > .9, tag: T.since('washington') > 0 ? 'WASHINGTON' : '' });
  if (d < .95) { const y = lerp(300, 720, d); coupling(c, 900, y, 1.4, .5); coupling(c, 1040, y - 30, 1.4, .5); arm(c, 1500, 0, 1080, lerp(220, 260, d), SKIN, '#e9d9b2'); }
  GRADE.night(c, [[960, 520, 600, '#ffe2a0', .3]], .2);
  if (T.sub === 0) tag(c, 960, 170, 'FORGOTTEN TO REMOVE', T.at('remove', .45), { size: 34, bg: '#ffd6c8' });
  else tag(c, 960, 170, 'BOUND FOR WASHINGTON', T.at('bound', .45), { size: 36 });
} });

// =========================== PUTTING IT BACK ===========================
chap4('B1.0', 10, 'Putting It Back');
S('B1.1', { cams: [[960, 540, 1.05], [960, 540, 1.15]], sfx: [['whoosh1', 'back', -12], ['ding', 'exactly', -14]], draw(c, T) {
  SET.grid(c, T.t, { title: 'REASSEMBLY', sub: 'AS IT WAS' });
  c.save(); c.globalAlpha = .45; c.setLineDash([12, 10]); lunik(c, 960, 560, 1400, { blueprint: true }); c.restore();
  const k = 1 - ease(clamp(T.since('back') / 1.2)); lunik(c, 960, 560, 1400, { blueprint: true, capOff: k, sphereOut: k });
  if (k > 0) { c.save(); c.globalAlpha = k; for (let i = 0; i < 3; i++) plank(c, 520 + i * 240, 220 - i * 20, 220, -.2 + i * .15); c.restore(); }
  const e = T.at('exactly', .5); if (e > 0) { [[960 - 700 + 8, 560], [960 + 1400 * .3, 560], [960, 330]].forEach(([x, y], i) => { const p = clamp(e * 3 - i * .5); if (p > 0) { circ(c, x, y - 180, 30, '#2f9e5a', 4); line(c, x - 14, y - 180, x - 3, y - 168, 6, '#fff'); line(c, x - 3, y - 168, x + 16, y - 194, 6, '#fff'); } });
    label(c, 'EXACTLY AS IT WAS', 960, 900, 56, YEL); }
} });
S('B2.0', { focus: [960, 560, 1.1], sfx: [['crickets2', 0, -26, { len: 12 }], ['clock', 'took', -10, { len: 1.6 }]], overlay: NC(), draw(c, T) {
  bg(c, '#0b1322', '#121a26'); dropLight(c, 960, 150, 1, 200); lightPool(c, 960, 420, 700, '#ffe2a0', .35);
  line(c, 1240, 560, 2100, 560, 22, '#7c858d');
  const k = ease(clamp(T.lt / (T.d + .2))); const sx = lerp(820, 1170, k), sy = lerp(700, 560, k) + Math.sin(T.t * 3) * 6;
  circ(c, sx, sy, 150, '#c9ced4'); circ(c, sx - 50, sy - 50, 26, 'rgba(255,255,255,.8)', 0);
  P('finer', { x: sx - 260, y: 1060, s: 1.1, t: T.t, expr: 'worried', pose: 'carry', sweat: true, shoes: '#ece6d6' });
  P('spec1', { x: sx + 40, y: 1110, s: 1.05, t: T.t, expr: 'focus', pose: 'holdHigh', sweat: true, shoes: '#ece6d6', flip: true });
  GRADE.night(c, [[960, 460, 600, '#ffe2a0', .35]], .25);
  const h = T.at('hour', .5); tag(c, 960, 180, 'NEARLY AN HOUR', h, { size: 40, bg: '#fff3c4' });
} });
S('B3.0', { focus: [960, 540, 1.08], sfx: [['hammer', 'plate', -12], ['hit', 'blocked', -14]], draw(c, T) {
  SET.grid(c, T.t, { title: 'THE BLIND SPOT', sub: 'SECTION' });
  const h = P('finer', { x: 420, y: 1000, s: 1.15, t: T.t, expr: T.since('blocked') > 0 ? 'worried' : 'focus', pose: 'reach' });
  line(c, 1180, 560, 1800, 560, 14, '#c9ced4'); seal(c, 1460, 566, 1.4, {}); circ(c, 1700, 560, 120, '#c9ced4');
  const ex = h.head[0] + 30, ey = h.head[1]; const pl = easeOut(T.at('plate', .5));
  const bl = T.since('blocked') > 0; c.save(); c.setLineDash([14, 10]); line(c, ex, ey, bl ? 960 : 1460, bl ? lerp(ey, 560, (960 - ex) / (1460 - ex)) : 560, 5, YEL); c.restore();
  if (pl > 0) { box(c, 930, lerp(-200, 260, pl), 60, 560, 6, '#8a939b'); for (let i = 0; i < 5; i++) circ(c, 960, lerp(-200, 260, pl) + 40 + i * 120, 7, '#5b636b', 2); label(c, 'METAL PLATE', 960, lerp(-260, 200, pl), 40, '#e8f1ff'); }
  if (bl) { const x = 900, y = lerp(ey, 560, (900 - ex) / (1460 - ex)); line(c, x - 30, y - 30, x + 30, y + 30, 10, RED); line(c, x + 30, y - 30, x - 30, y + 30, 10, RED); }
} });
S('B3.1', { focus: [960, 560, 1.15], sfx: [['switch', 'feel', -6]], overlay: NC(), draw(c, T) {
  bg(c, '#0b1322', '#121a26'); lightPool(c, 960, 460, 700, '#ffe2a0', .3);
  line(c, 1050, 560, 2100, 560, 20, '#7c858d'); circ(c, 1700, 560, 160, '#c9ced4'); seal(c, 1300, 566, 1.8, {});
  box(c, 880, -100, 70, 1400, 6, '#8a939b'); for (let i = 0; i < 9; i++) circ(c, 915, 0 + i * 140, 8, '#5b636b', 2);
  const s = T.since('feel'); const grope = s > .2 ? 0 : Math.sin(T.t * 5) * 40; arm(c, 600, 640, 1220 + grope, 560 + Math.cos(T.t * 4) * 30 * (s > .2 ? 0 : 1), SKIN, '#e9e4d6');
  P('finer', { x: 520, y: 1080, s: 1.2, t: T.t, expr: s > .3 ? 'grin' : 'focus', pose: 'idle', sweat: true });
  GRADE.night(c, [[960, 460, 600, '#ffe2a0', .3]], .25);
  if (s > .2) { const p = clamp((s - .2) * 3); c.save(); c.globalAlpha = p; label(c, 'CLICK', 1300, 400, 60, YEL); c.restore(); }
  tag(c, 520, 220, 'BY FEEL', T.at('largely', .45), { size: 38, bg: '#fff3c4' });
} });
S('B4.0', { cams: [[1000, 560, 1.15], [960, 540, 1.04]], sfx: [['creak', 'rewrapped', -16], ['stamp', 'seal', -8], ['ding', 'fitted', -14]], overlay: NC(), draw(c, T) {
  if (T.sub === 0) { bg(c, '#0b1322', '#16202e'); lightPool(c, 1000, 520, 600, '#ffe2a0', .4);
    line(c, -100, 560, 2000, 560, 22, '#7c858d'); const w = easeOut(T.at('rewrapped', .8));
    c.beginPath(); const n = Math.floor(40 * w); for (let i = 0; i <= n; i++) { const x = 700 + i * 15, y = 560 + Math.sin(i * 1.6) * 22; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.lineWidth = 7; c.strokeStyle = '#a7adb4'; c.stroke();
    GRADE.night(c, [[1000, 560, 500, '#ffe2a0', .35]], .2); tag(c, 1000, 260, 'WIRE REWRAPPED', T.at('rewrapped', .45), { size: 36 }); return; }
  SET.paper(c, T.t); const f = T.at('forged', .5);
  [[560, 'ORIGINAL', { cut: true, keepSeal: true }], [1360, 'FORGED', { fresh: true }]].forEach(([x, lab, o], i) => {
    box(c, x - 330, 260, 660, 520, 18, '#fbf7ea', 4); line(c, x - 300, 520, x + 300, 520, 18, '#9aa1a8');
    if (i === 0 || f > 0) { c.save(); if (i === 1) { c.translate(x, 520); c.scale(lerp(1.6, 1, easeOut(f)), lerp(1.6, 1, easeOut(f))); c.translate(-x, -520); c.globalAlpha = clamp(f * 2); } seal(c, x, 524, 2.6, i === 0 ? { keepSeal: true } : { fresh: false }); c.restore(); }
    label(c, lab, x, 720, 50, i ? '#b8322a' : INK, { stroke: false }); });
  const q = T.at('fitted', .4); if (q > 0) { c.save(); c.globalAlpha = q; label(c, '=', 960, 520, 140, INK, { stroke: false }); c.restore(); tag(c, 960, 900, 'NO VISIBLE DIFFERENCE', q, { size: 36 }); }
} });
S('B5.0', { focus: [960, 560, 1.06], sfx: [['ding', 'compartment', -18], ['ding', 'checking', -18]], overlay: NC(), draw(c, T) {
  bg(c, '#0a0e15', '#12171f'); const LX = 960, LL = 1700; lunik(c, LX, 560, LL, { cutaway: 1, paint: 'raw' });
  const x0 = LX - LL / 2, xN = LX + LL * .18; const spots = [[x0 + 80, 'BASE'], [lerp(x0, xN, .28), 'FUEL'], [lerp(x0, xN, .62), 'OXIDIZER'], [LX + LL * .3, 'NOSE']];
  const s = T.since('every'); const idx = clamp(s / 1.6) * (spots.length - 1); const sx = s > 0 ? lerp(spots[Math.floor(idx)][0], spots[Math.min(3, Math.floor(idx) + 1)][0], idx % 1) : spots[0][0];
  GRADE.night(c, [[sx, 560, 260, '#ffe2a0', .6]], .4);
  torch(c, sx - 200, 1100, -1.2, 700, .35);
  spots.forEach(([x, lab], i) => { if (s > i * .45) { circ(c, x, 260, 30, '#2f9e5a', 4); line(c, x - 14, 260, x - 3, 272, 6, '#fff'); line(c, x - 3, 272, x + 16, 246, 6, '#fff'); label(c, lab, x, 860, 34, '#c9d6e8', { stroke: false }); } });
} });
S('B5.1', { focus: [960, 560, 1.06], sfx: [['tick', 'anything', -10], ['tick', 'might', -10], ['tick', 'left', -10], ['ding', 'behind', -12]], overlay: NC(), draw(c, T) {
  bg(c, '#0b1322', '#16202e'); lightPool(c, 960, 520, 800, '#ffe2a0', .35); toolCloth(c, 760, 600, 900, { n: 6 });
  const items = ['PINCH BAR', 'WRENCHES', 'NAIL PULLER', 'ROPE', 'DROP LIGHT', 'FLASHBULBS']; const s = T.since('anything');
  clipboard(c, 1520, 600, 520, 640, ['TOOLS OUT', ...items.map((t, i) => (s > i * .28 ? 'OK  ' : '-   ') + t)], { col: [INK, ...items.map((_, i) => s > i * .28 ? '#2f7a4a' : '#8a8f98')] });
  GRADE.night(c, [[960, 520, 700, '#ffe2a0', .3]], .2);
  tag(c, 760, 170, 'NOTHING LEFT BEHIND', T.at('behind', .45), { size: 38, bg: '#d8f0d8', fg: '#1f5a34' });
} });
S('B6.0', { cams: [[960, 560, 1.06], [860, 560, 1.18]], shakes: [['scare']], sfx: [['hammer', 0, -18], ['hit', 'scare', -12]], overlay: NC(), draw(c, T) {
  const L = SET.salvageYard(c, T.t, { lamps: 1, drop: 1 }); yTruck(c, T, { planks: .45 }); const R = roofOf(); const sc = T.since('scare') > 0;
  P('spec1', { x: R.left + 120, y: R.top + 4, s: .82, t: T.t, expr: sc ? 'worried' : 'bored', pose: 'wrench', legs: 'crouch', look: sc ? -1 : 0 });
  P('finer', { x: R.cx + 40, y: R.top + 4, s: .82, t: T.t, expr: sc ? 'worried' : 'focus', pose: 'crouch', legs: 'crouch', look: sc ? 1 : 0 });
  P('spec2', { x: R.right - 70, y: R.top + 4, s: .82, t: T.t, expr: sc ? 'shock' : 'bored', pose: 'idle', flip: true });
  GRADE.night(c, L, .25);
  tag(c, 960, 200, "SILVETI'S ACCOUNT", T.at('silvet', .45), { size: 36, bg: '#ffe0d0' }); if (T.sub === 1) tag(c, 1420, 400, 'ONE MORE SCARE', T.at('scare', .4), { size: 34, bg: '#ffd6c8' });
} });
S('B6.1', { focus: [800, 560, 1.12], shakes: [['dark']], sfx: [['elec', 'dark', -6], ['hit', 'dark', -10]], overlay: NC(), draw(c, T) {
  const d = T.since('dark') > 0 ? 1 : 0; const L = SET.salvageYard(c, T.t, { lamps: 1, drop: d ? 0 : 1, blackout: d }); yTruck(c, T, { planks: .2 }); const R = roofOf();
  const hs = [P('spec1', { x: R.left + 120, y: R.top + 4, s: .82, t: T.t, expr: 'bored', pose: 'wrench', legs: 'crouch' }), P('finer', { x: R.cx + 40, y: R.top + 4, s: .82, t: T.t, expr: 'focus', pose: 'crouch', legs: 'crouch' }),
    P('spec2', { x: R.right - 70, y: R.top + 4, s: .82, t: T.t, expr: 'neutral', pose: 'idle', flip: true }), P('spec3', { x: 1600, y: YT.y, s: .95, t: T.t, expr: 'neutral', pose: 'idle', flip: true })];
  GRADE.night(c, d ? [] : L, .28);
  if (d) { GRADE.dark(c, .97); const lk = Math.sin(T.since('dark') * 3) > 0 ? 1 : -1; heads(c, hs.map((h, i) => [h.head[0], h.head[1], i === 3 ? .95 : .82, T.since('dark') > .5 ? lk * (i % 2 ? 1 : -1) : 0]), clamp(T.since('dark') * 4 - .4)); }
} });
S('B7.0', { focus: [960, 520, 1.04], sfx: [['crickets', 0, -18, { len: 3.2 }]], overlay: NC(), draw(c, T) {
  NIGHT_SKY(c, T.t, '#03060d', '#0a1424', 220); moon(c, 1560, 200, 70, {}); skyline(c, 660, '#070d18', null, 3, 1.2);
  c.fillStyle = '#05080e'; c.fillRect(-400, 840, W + 800, 500); woodFence(c, -400, W + 400, 1060, 220, { seed: 4 }); GRADE.dark(c, .35);
  const hs = [[620, 900, 1.2], [960, 880, 1.2], [1300, 900, 1.2]]; const r = T.since('ordinary') > 0;
  hs.forEach(([x, y, s]) => { c.fillStyle = '#05070c'; c.beginPath(); c.arc(x, y, 70 * s, 0, TAU); c.fill(); c.beginPath(); c.ellipse(x, y + 160 * s, 80 * s, 110 * s, 0, 0, TAU); c.fill(); });
  heads(c, hs.map(([x, y, s]) => [x, y, s * 1.4, r ? 0 : -1]), 1); if (r) hs.forEach(([x, y, s]) => { c.save(); c.globalAlpha = .9; c.fillStyle = '#05070c'; c.fillRect(x - 60 * s, y - 30 * s, 120 * s, 18 * s * clamp(T.since('ordinary') * 2)); c.restore(); });
  tag(c, 960, 200, 'MEXICO CITY BLACKOUT', T.at('blackout', .45), { size: 38 }); tag(c, 960, 300, 'ORDINARY', T.at('ordinary', .45), { size: 30, bg: '#fff3c4' });
} });
S('B8.0', { focus: [760, 560, 1.25], shakes: [['on']], sfx: [['hammer', 'planks', -6], ['hammer', 'on', -4]], overlay: NC(), draw(c, T) {
  const L = SET.salvageYard(c, T.t, { lamps: 1, drop: 1 }); const k = clamp(T.since('back') / .5); yTruck(c, T, { planks: k < 1 ? 1 / 9 + .001 : 0 }); const R = roofOf();
  const px = R.left + R.w / 18; if (k < 1) plank(c, px, R.top - 10 - (1 - k) * 60, R.w / 9 + 10, 0);
  const hs = T.since('on'); spike(c, px + 10, R.top - 30 + (hs > 0 ? 26 : 0) - (hs > 0 ? 0 : 20), .7, 0);
  const sw = Math.sin(clamp(T.lt / .25) * Math.PI) * (hs > 0 && hs < .2 ? 0 : 1);
  P('spec1', { x: px + 160, y: R.top + 4, s: .95, t: T.t, expr: 'focus', pose: sw > .5 ? 'holdHigh' : 'wrench', legs: 'crouch', flip: true, item: (cc, hh) => { box(cc, hh[1][0] - 10, hh[1][1] - 70, 20, 90, 6, '#6d4c41', 3); box(cc, hh[1][0] - 40, hh[1][1] - 96, 80, 34, 6, '#5b636b', 3); } });
  GRADE.night(c, L, .25); tag(c, 1200, 240, 'ROOF BACK ON', T.at('went', .45), { size: 36 });
} });
S('B8.1', { focus: [760, 600, 1.08], sfx: [['steps', 'specialists', -14, { len: 2 }]], overlay: NC(), draw(c, T) {
  const L = SET.salvageYard(c, T.t, { lamps: 0, drop: 0 }); gate(c, 110, 552, 230, 330, 1); yTruck(c, T, {}, { x: 1600, y: 1000, s: .95 });
  ['finer', 'spec1', 'spec2', 'spec3'].forEach((n, i) => { const k = clamp((T.since('specialists') - i * .2) / 1.4); P(n, { x: lerp(760 + i * 170, 120 + i * 40, ease(k)), y: 960 - i * 4, s: .85, t: T.t, expr: 'bored', pose: 'sneak', walk: true, flip: true }); });
  GRADE.night(c, [[225, 400, 300, '#7f9ac0', .2]], .4);
  tag(c, 960, 200, 'THE SPECIALISTS LEAVE', T.at('left', .45), { size: 34 });
} });
})();
