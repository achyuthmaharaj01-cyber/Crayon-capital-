// ---------- scene builder b1: COLD OPEN (C), THE SPACE RACE (R), THE WORLD TOUR (T) ----------
// One S() per storyboard shot; every action keyed to the spoken word. Wrapped in an IIFE so local helpers never clash with other builders.
(() => {
const pop = (T, w, d = .45, nth) => (nth != null ? clamp(T.sinceN(w, nth) / d) : T.at(w, d));
const arrive = (c, p, x, y, f) => { if (p <= 0) return; c.save(); c.translate(x, y + (1 - back(p)) * 40); c.globalAlpha *= clamp(p * 2); f(); c.restore(); };
const typed = (s, p) => s.slice(0, Math.round(s.length * clamp(p)));
// absolute word time -> seconds after a shot's start (for sfx that need several hits)
const wordT = (line, w, nth = 0) => { const l = TL.lines.find(x => x.id === line); const ws = l.words.filter(x => x.w === w || x.w.startsWith(w)); return (ws[nth] || ws[0] || l.words[0]).s; };
const rel = (key, line, w, add = 0, nth = 0) => wordT(line, w, nth) - TL.shots.find(s => s.key === key).start + add;
// handwriting (Caveat)
function hand(c, text, x, y, size, col = INK, o = {}) { c.save(); c.font = `700 ${size}px Caveat`; c.textAlign = o.align || 'left'; c.textBaseline = 'middle'; c.translate(x, y); if (o.rot) c.rotate(o.rot); c.globalAlpha *= o.a ?? 1; c.fillStyle = col; c.fillText(text, 0, 0); c.restore(); }
// documentary lower-third tag (screen space): title in Kalam, optional handwritten sub
function tag(c, title, sub, p, sp = 1, o = {}) {
  if (p <= 0) return; const x = o.x ?? 110, y = (o.y ?? 910) + (1 - easeOut(p)) * 40, hgt = sub ? 150 : 104;
  c.save(); c.globalAlpha = clamp(p * 1.6); c.font = `700 ${o.size || 62}px Kalam`; const tw = Math.max(c.measureText(title.toUpperCase()).width, sub ? 300 : 120);
  box(c, x - 34, y - 60, tw + 76, hgt, 10, 'rgba(10,14,24,.86)', 3); c.fillStyle = '#ffb04a'; c.fillRect(x - 34, y - 60, 10, hgt);
  label(c, title, x, y - 6, o.size || 62, '#fff', { align: 'left', stroke: false });
  if (sub && sp > 0) { c.globalAlpha = clamp(p * 1.6) * clamp(sp * 1.6); hand(c, sub, x + 2, y + 52, 46, '#ffcf7a'); }
  c.restore();
}
// period crowd: coats + hats, seen from behind/front, muted palette. o.dark: silhouettes; o.walk: shuffle speed
function folk(c, x, y, w, rows, s, t, seed = 1, o = {}) {
  const R = rand(seed), cols = ['#5a6b7a', '#8a5a3b', '#3f5a4a', '#7a3b2e', '#4a5563', '#a8874f', '#2f4a5e', '#6b5b4b'];
  for (let r = rows - 1; r >= 0; r--) { const n = Math.max(1, Math.floor(w / (62 * s))); for (let i = 0; i < n; i++) {
    const px = x - w / 2 + (i + .5 + (r % 2) * .4) * (w / n) + (R() - .5) * 18 + (o.walk ? ((t * o.walk + R() * 40) % 80) : 0), py = y + r * 46 * s;
    const bob = o.gasp ? Math.max(0, Math.sin(clamp(o.gasp) * Math.PI)) * 14 * s * (R() * .5 + .5) : Math.sin(t * 2.2 + i * 1.7) * 1.6;
    const col = o.dark ? '#0b111c' : cols[Math.floor(R() * cols.length)], sk = o.dark ? '#0b111c' : SKIN[Math.floor(R() * SKIN.length)];
    ell(c, px, py - 34 * s - bob, 24 * s, 36 * s, col, o.dark ? 0 : 3); circ(c, px, py - 84 * s - bob, 19 * s, sk, o.dark ? 0 : 3);
    if (R() > .45) { const hc = o.dark ? '#0b111c' : ['#2b2f36', '#5a4a3a', '#3a3a40'][Math.floor(R() * 3)]; ell(c, px, py - 98 * s - bob, 28 * s, 6 * s, hc, o.dark ? 0 : 2.5); box(c, px - 15 * s, py - 120 * s - bob, 30 * s, 22 * s, 6 * s, hc, o.dark ? 0 : 2.5); }
  } }
}
function mug(c, x, y, s = 1, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); box(c, -26, -60, 52, 60, 8, '#f3efe6', 3.5); c.beginPath(); c.arc(30, -32, 14, -1.3, 1.3); c.lineWidth = 6; c.strokeStyle = INK; c.stroke(); ell(c, 0, -58, 22, 5, '#5a3a22', 0); c.restore(); }
function notes(c, x, y, t, a) { if (a <= 0) return; c.save(); c.globalAlpha = a; for (let i = 0; i < 3; i++) { const k = (t * .7 + i / 3) % 1; const nx = x + k * 140 + Math.sin(k * 8 + i) * 12, ny = y - k * 170; c.globalAlpha = a * (1 - k); ell(c, nx, ny, 11, 8, INK, 0, -.4); line(c, nx + 9, ny - 2, nx + 9, ny - 42, 4); line(c, nx + 9, ny - 42, nx + 24, ny - 30, 4); } c.restore(); }
function bubble(c, x, y, rx, ry, tailX, tailY, inner, a = 1, s = 1) { if (a <= 0 || s <= 0) return; c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(s, s); c.translate(-x, -y);
  [[.0, 14], [.45, 22]].forEach(([k, r]) => circ(c, lerp(tailX, x - rx * .5, k), lerp(tailY, y + ry * .7, k), r, '#fff', 3.5));
  c.beginPath(); for (let i = 0; i < 12; i++) { const a0 = i / 12 * TAU; c.ellipse(x + Math.cos(a0) * rx * .82, y + Math.sin(a0) * ry * .78, rx * .3, ry * .32, 0, 0, TAU); } c.fillStyle = '#fff'; c.fill();
  ell(c, x, y, rx * .98, ry * .95, '#fff', 0); c.save(); c.beginPath(); c.ellipse(x, y, rx * .9, ry * .82, 0, 0, TAU); c.clip(); inner(); c.restore(); ell(c, x, y, rx * .9, ry * .82, null, 3); c.restore(); }
function viewCorners(c, x, y, w, h, col = '#fff') { [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => { const cx = x + sx * w / 2, cy = y + sy * h / 2; line(c, cx, cy, cx - sx * 60, cy, 5, col); line(c, cx, cy, cx, cy - sy * 60, 5, col); }); }
function tractor(c, x, y, s = 1) { c.save(); c.translate(x, y); c.scale(s, s); reg(c, -260, -330, 240, 0);
  box(c, -160, -210, 300, 110, 12, '#b8322a'); box(c, 40, -330, 120, 130, 10, '#8a2620'); windowRect(c, 58, -312, 84, 70, '#cfe3ef'); box(c, -150, -250, 40, 50, 6, '#2b2f36'); line(c, -130, -250, -130, -300, 10);
  circ(c, 90, -120, 120, '#1f2226'); circ(c, 90, -120, 56, '#e0b13e', 4); for (let k = 0; k < 10; k++) { const a = k / 10 * TAU; line(c, 90 + Math.cos(a) * 100, -120 + Math.sin(a) * 100, 90 + Math.cos(a) * 126, -120 + Math.sin(a) * 126, 8); }
  circ(c, -170, -62, 62, '#1f2226'); circ(c, -170, -62, 28, '#e0b13e', 4); c.restore(); }
function teleprinter(c, x, y, s = 1, o = {}) { c.save(); c.translate(x, y); c.scale(s, s); reg(c, -180, -200, 180, 0);
  box(c, -180, -150, 360, 150, 14, '#56606a'); box(c, -150, -200, 300, 60, 10, '#6b757f'); box(c, -110, -120, 220, 50, 6, '#2b2f36', 3); for (let i = 0; i < 8; i++) circ(c, -90 + i * 26, -40, 8, '#e9e4d6', 2.5);
  box(c, -130, -206, 260, 12, 3, '#2b2f36', 0); c.restore(); }

// =============================== COLD OPEN ===============================
S('C1.0', { cams: [[900, 600, 1.06]], noWhoosh: true, sfx: [['night', 0, -24, { len: 2.6 }], ['truck2', .1, -15, { len: 6 }]], draw(c, T) {
  const L = SET.nightStreet(c, T.t, { dusk: 1, traffic: T.t });
  car59(c, 2000 - T.lt * 760, 905, .5, { flip: true, lights: 1, moving: 1, t: T.t, col: '#6a4a3a' });
  // lamps coming on: the middle lamp sputters once, the far lamp catches late
  const fl = T.lt < 1.1 ? (Math.sin(T.lt * 40) > .2 ? .5 : 0) : 0; lightPool(c, 971, 500, 300, '#ffb04a', fl);
  truck59(c, -560 + T.lt * 470, 965, .95, { crate: true, lights: 1, moving: 1, t: T.t, driver: 'driver' });
  GRADE.night(c, L, .38);
  c.save(); c.globalAlpha = clamp(1 - T.lt / 1.2) * .5; c.fillStyle = '#03050a'; c.fillRect(-400, -300, W + 800, H + 600); c.restore();
} });
S('C1.1', { cams: [[960, 560, 1.0]], push: .04, sfx: [['typewriter', .45, -14, { len: .9 }]],
  overlay: (c, T) => { const p = T.in(.4, .9); if (p <= 0) return; c.save(); box(c, 80, 70, 330, 92, 8, 'rgba(10,14,24,.85)', 3); c.font = '700 54px Kalam'; c.fillStyle = '#fff'; c.textBaseline = 'middle'; c.fillText(typed('LATE 1959', p) + (T.lt % .5 < .25 ? '|' : ''), 108, 120); c.restore(); },
  draw(c, T) {
  c.save(); c.translate(-T.lt * 110, 0); const L = SET.nightStreet(c, T.t, { scroll: 260 }); c.restore();
  // low angle: the camera sits by the front wheel, looking up at the cab
  c.save(); c.translate(960, 1080); c.transform(1, 0, -.08, 1, 0, 0); c.translate(-960, -1080);
  truck59(c, 520, 1150, 2.15, { crate: true, lights: 1, moving: 1, t: T.t, driver: 'driver', driverExpr: 'neutral' });
  lightPool(c, 520 + 182 * 2.15, 1150 - 210 * 2.15, 150, '#ffcf7a', .45 + .1 * Math.sin(T.t * 3)); // dash radio glow
  c.restore();
  GRADE.night(c, L, .4);
} });
S('C1.2', { cams: [[960, 560, 1.12]], sfx: [['ding', 'mexico', -16]],
  overlay: (c, T) => tag(c, 'Mexico City', '(most likely)', T.at('mexico', .5), T.at('city', .5)),
  draw(c, T) {
  // aerial: the city grid at night, the truck a pair of headlights on the boulevard
  c.fillStyle = '#060b16'; c.fillRect(-400, -300, W + 800, H + 600);
  c.save(); c.translate(960, 540); c.rotate(-.16); c.translate(-960, -540);
  const R = rand(4);
  for (let gx = -700; gx < 2700; gx += 250) for (let gy = -500; gy < 1700; gy += 210) { if (gy === 550 - 10) continue; box(c, gx + 30, gy + 28, 190, 150, 6, '#141f33', 0); for (let k = 0; k < 6; k++) if (R() > .45) { c.fillStyle = 'rgba(255,200,110,.55)'; c.fillRect(gx + 44 + R() * 150, gy + 40 + R() * 120, 12, 10); } }
  c.fillStyle = '#1e2a3d'; c.fillRect(-800, 500, 3600, 120); line(c, -800, 560, 2800, 560, 3, 'rgba(255,220,150,.25)');
  for (let x = -760; x < 2800; x += 120) { lightPool(c, x, 496, 46, '#ffb04a', .8); lightPool(c, x + 60, 624, 46, '#ffb04a', .8); circ(c, x, 496, 4, '#ffd27a', 0); circ(c, x + 60, 624, 4, '#ffd27a', 0); }
  for (let i = 0; i < 7; i++) { const k = (T.t * .05 + i / 7) % 1, px = 2700 - k * 3500; circ(c, px, 528, 5, '#ff5040', 0); circ(c, px, 540, 5, '#ff5040', 0); }
  // THE TRUCK from above: cab + crate, two beams ahead
  const tx = 520 + T.lt * 70;
  c.save(); c.globalCompositeOperation = 'screen'; const g = c.createLinearGradient(tx + 60, 0, tx + 360, 0); g.addColorStop(0, 'rgba(255,240,190,.6)'); g.addColorStop(1, 'rgba(255,240,190,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(tx + 60, 580); c.lineTo(tx + 360, 560); c.lineTo(tx + 360, 640); c.closePath(); c.fill(); c.restore();
  box(c, tx - 150, 576, 170, 52, 4, '#b9874d', 3); for (let i = 1; i < 6; i++) line(c, tx - 150 + i * 28, 578, tx - 150 + i * 28, 626, 2, 'rgba(60,35,10,.5)'); box(c, tx + 24, 580, 46, 44, 8, '#4f6d5a', 3);
  c.restore();
  vignette(c, .35);
} });
S('C2.0', { cams: [[760, 700, 1.3]], sfx: [['truck', 0, -18]], draw(c, T) {
  const L = SET.nightStreet(c, T.t, {});
  truck59(c, 560 + T.lt * 160, 985, 1.15, { crate: true, lights: 1, moving: 1, t: T.t, driver: 'driver' });
  GRADE.night(c, L, .38);
  const p = T.at('wooden', .5), cx = 560 + T.lt * 160 - 210 * 1.15;
  if (p > 0) { c.save(); c.globalAlpha = p; hand(c, 'wooden crate', cx - 120, 560, 64, '#ffe9a8', { rot: -.06 }); c.beginPath(); c.moveTo(cx + 40, 600); c.quadraticCurveTo(cx + 70, 640, cx + 50, 690 * 1 - 10 + 20 * (1 - p)); c.lineWidth = 5; c.strokeStyle = '#ffe9a8'; c.stroke(); c.restore(); }
} });
S('C2.1', { cams: [[880, 600, 1.0], [835, 640, 1.32]], sfx: [['ding', '20', -12], ['elec', 'inside', -14], ['hit', 'rocket', -14]], draw(c, T) {
  const L = SET.spot(c, T.t, { x: 835, col: '#ffcf8a' });
  const xr = T.at('inside', .9);
  truck59(c, 1150, 960, 1.5, { crate: { xray: xr }, lights: 0, t: T.t, col: '#3f5a4a' });
  // the tape line along the crate (crate spans ~400..1270 at this scale)
  const m = clamp((T.t - 10.0) / .8), y0 = 960 - 136 * 1.5 - 139 * 1.5 - 70;
  c.save(); c.lineWidth = 6; c.strokeStyle = '#ffcf3f'; c.beginPath(); c.moveTo(400, y0); c.lineTo(lerp(400, 1270, easeOut(m)), y0); c.stroke();
  line(c, 400, y0 - 22, 400, y0 + 22, 6, '#ffcf3f'); if (m >= 1) line(c, 1270, y0 - 22, 1270, y0 + 22, 6, '#ffcf3f');
  for (let i = 1; i < 20; i++) if (i / 20 < m) line(c, 400 + i * 43.5, y0 - (i % 5 ? 8 : 16), 400 + i * 43.5, y0, 3, '#ffcf3f'); c.restore();
  const q = pop(T, ['20', 'twenty'], .35); arrive(c, q, 835, y0 - 70, () => label(c, 'NEARLY 20 FEET', 0, 0, 60, '#ffcf3f', { glow: '#ffb04a' }));
  const r = pop(T, 'rocket', .5); arrive(c, r, 835, 1010, () => label(c, 'A SOVIET MOON ROCKET', 0, 0, 62, '#fff'));
  if (xr > 0) lightPool(c, 835, 700, 500, '#5d9ad6', .3 * xr);
} });
// the driver's cab, seen from the passenger seat: night road streaming past, his daydream of the rail yard
function cab(c, T, o) {
  bg(c, '#0b1220', '#05080f');
  // windshield (right) with the road
  c.save(); rr(c, 980, 150, 900, 520, 60); c.clip(); NIGHT_SKY(c, T.t, '#0b1730', '#1c2f4c', 30); skyline(c, 520, '#0f1d30', 'rgba(255,200,110,.5)', 6, .6);
  poly(c, [[1000, 680], [1880, 680], [1460, 470], [1420, 470]], '#2b2f35', 0); for (let i = 0; i < 4; i++) { const k = ((T.t * .9 + i / 4) % 1); c.fillStyle = 'rgba(255,220,150,.7)'; const yy = lerp(480, 690, k * k); c.fillRect(1440 - lerp(2, 14, k * k), yy, lerp(4, 28, k * k), lerp(6, 30, k * k)); }
  for (let i = 0; i < 3; i++) { const k = ((T.t * .5 + i / 3) % 1); const lx = lerp(1460, 1950, k * k), ly = lerp(470, 200, k * k); line(c, lx, ly, lx, ly + lerp(30, 360, k * k), lerp(2, 10, k * k), '#1a2230'); lightPool(c, lx, ly, lerp(10, 120, k * k), '#ffb04a', .7); }
  if (o.sweep > 0 && o.sweep < 1) lightPool(c, lerp(1900, 900, o.sweep), 420, 420, '#fff3c0', .7 * Math.sin(o.sweep * Math.PI));
  c.restore(); rr(c, 980, 150, 900, 520, 60); fs(c, null, 8);
  // side window (left) with lamps sliding past
  c.save(); rr(c, 60, 180, 760, 440, 50); c.clip(); bg(c, '#0d1a30', '#1a2c48'); for (let i = 0; i < 3; i++) { const k = (T.t * .6 + i / 3) % 1, lx = lerp(900, -100, k); line(c, lx, 260, lx, 640, 10, '#1a2230'); lightPool(c, lx, 260, 140, '#ffb04a', .8); } c.restore(); rr(c, 60, 180, 760, 440, 50); fs(c, null, 8);
  // dashboard + radio glow
  box(c, 860, 690, 1200, 420, 30, '#3a2a20'); circ(c, 1180, 790, 46, '#1b2a20', 4); circ(c, 1300, 790, 46, '#1b2a20', 4); box(c, 1430, 760, 200, 60, 8, '#2b2016', 3); lightPool(c, 1530, 790, 180, '#ffcf7a', .5); c.fillStyle = '#ffcf7a'; c.fillRect(1450, 780, 160, 6);
  P('driver', { x: 700, y: 1230, s: 1.55, t: T.t, pose: 'drive', expr: o.expr });
  if (o.sweep > 0 && o.sweep < 1) lightPool(c, lerp(1100, 300, o.sweep), 700, 500, '#fff3c0', .5 * Math.sin(o.sweep * Math.PI));
  GRADE.night(c, [[1530, 790, 300, '#ffcf7a', .4], [700, 600, 500, '#ffb04a', .15]], .32);
}
function yardDream(c, cx, cy) { bg(c, '#bcd3e6', '#e9dcc0'); line(c, cx - 260, cy + 60, cx + 260, cy + 60, 5, '#5b5048'); line(c, cx - 260, cy + 80, cx + 260, cy + 80, 5, '#5b5048'); freightTrain(c, cx + 140, cy + 60, .3, { cars: ['box', 'box'] }); sign(c, cx - 120, cy - 70, 210, 50, 'RAIL YARD', { bg: '#e9e4d6', size: 28 }); }
S('C3.0', { cams: [[1000, 560, 1.0]], sfx: [['whistle', 'thought', -20, { len: 1.4 }], ['pop', 'thought', -16]], draw(c, T) {
  cab(c, T, { expr: 'grin' }); notes(c, 860, 480, T.t, 1);
  const p = T.at('thought', .4); bubble(c, 1360, 330, 330, 190, 900, 500, () => yardDream(c, 1360, 330), 1, back(p));
} });
S('C3.1', { cams: [[1200, 420, 1.15], [760, 620, 1.35]], sfx: [['pop', 'never', -10], ['carengine', 'got', -18]], draw(c, T) {
  const n = T.since('never'); cab(c, T, { expr: n > 0 ? (n > .6 ? 'worried' : 'neutral') : 'grin', sweep: clamp((n - .2) / 1.2) }); notes(c, 860, 480, T.t, clamp(1 - n * 4));
  const burst = clamp(n / .25); bubble(c, 1360, 330, 330, 190, 900, 500, () => yardDream(c, 1360, 330), 1 - burst, 1 + burst * .25);
  if (burst > 0 && burst < 1) for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; circ(c, 1360 + Math.cos(a) * (300 + burst * 140), 330 + Math.sin(a) * (180 + burst * 90), 12 * (1 - burst), '#fff', 3); }
} });
// route map: main road to the rail yard, side road = the last turn-off
const RA = [180, 930], RB = [1560, 250], TO = .7, SR = [1560, 700];
const onMain = u => [lerp(RA[0], RB[0], u), lerp(RA[1], RB[1], u)];
S('C4.0', { cams: [[960, 560, 1.05]], sfx: [['truck', 0, -20], ['creak', 'pulled', -10]], draw(c, T) {
  bg(c, '#102036', '#0b1828'); c.lineWidth = 1.2; c.strokeStyle = 'rgba(200,225,255,.08)'; for (let x = 0; x < W; x += 60) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); } for (let y = 0; y < H; y += 60) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
  const R = rand(2); for (let i = 0; i < 16; i++) box(c, 100 + R() * 1700, 80 + R() * 900, 80 + R() * 160, 60 + R() * 110, 6, 'rgba(255,255,255,.04)', 0);
  const T0 = onMain(TO);
  line(c, RA[0], RA[1], RB[0], RB[1], 34, '#e9e4d6'); line(c, T0[0], T0[1], SR[0], SR[1], 22, '#e9e4d6');
  line(c, RA[0], RA[1], RB[0], RB[1], 3, 'rgba(60,60,60,.5)');
  // rail yard at the end of the main road
  box(c, RB[0] - 40, RB[1] - 120, 300, 160, 10, '#2b3a50', 4); for (let k = 0; k < 4; k++) line(c, RB[0] - 20, RB[1] - 90 + k * 34, RB[0] + 240, RB[1] - 90 + k * 34, 4, '#9aa1a8'); label(c, 'RAIL YARD', RB[0] + 110, RB[1] - 160, 44, '#fff');
  // the remaining dotted route to the yard (never driven)
  const pr = T.at('pulled', .6); c.save(); c.globalAlpha = 1 - pr * .7; c.setLineDash([16, 12]); line(c, T0[0], T0[1], RB[0] - 40, RB[1] + 20, 6, '#d9342b'); c.restore();
  const lt = T.at(['last', 'turnoff'], .5); arrive(c, lt, T0[0] + 220, T0[1] + 120, () => { hand(c, 'the last turn-off', -40, 0, 54, '#ffcf7a', { rot: .3 }); });
  // the truck token: along the main road to the turn-off, then into the side road, stop on 'pulled'
  const tp = T.cue('pulled'), u1 = easeOut(clamp((T.t - T.shot.start) / (T.cue('turnoff') + .7 - T.shot.start)));
  let pos, ang; if (T.t < T.cue('turnoff') + .7) { pos = onMain(lerp(.12, TO, u1)); ang = Math.atan2(RB[1] - RA[1], RB[0] - RA[0]); }
  else { const k = easeOut(clamp((T.t - (T.cue('turnoff') + .7)) / Math.max(.3, tp - T.cue('turnoff') - .5))); pos = [lerp(T0[0], lerp(T0[0], SR[0], .35), k), lerp(T0[1], lerp(T0[1], SR[1], .35), k)]; ang = Math.atan2(SR[1] - T0[1], SR[0] - T0[0]) * k + Math.atan2(RB[1] - RA[1], RB[0] - RA[0]) * (1 - k); }
  c.save(); c.translate(pos[0], pos[1]); c.rotate(ang); box(c, -70, -18, 100, 36, 4, '#b9874d', 3); box(c, 34, -16, 36, 32, 8, '#4f6d5a', 3);
  if (pr > 0) { lightPool(c, -72, -12, 50, '#ff3020', .9 * pr); lightPool(c, -72, 12, 50, '#ff3020', .9 * pr); circ(c, -72, -12, 5, '#ff5040', 0); circ(c, -72, 12, 5, '#ff5040', 0); } c.restore();
} });
S('C5.0', { cams: [[720, 700, 1.15]], sfx: [['whoosh2', 'canvas', -8], ['creak', 'crate', -14], ['crickets', 0, -24, { len: 3 }]], draw(c, T) {
  const L = SET.road(c, T.t, { dusk: 0 });
  const cv = T.at('canvas', 1.0);
  truck59(c, 980, 1000, 1.05, { crate: { canvas: cv }, tail: true, t: T.t });
  P('zambernardi', { x: 310, y: 1010, s: .95, t: T.t, pose: cv < 1 ? 'holdHigh' : 'idle', expr: 'focus' });
  P('dean', { x: 1430, y: 1010, s: .95, t: T.t, pose: 'shush', flip: true, expr: 'stern' });
  lightPool(c, 980 - 518 * 1.05, 1000 - 150 * 1.05, 120, '#ff3020', .5);
  GRADE.night(c, L, .5);
} });
S('C5.1', { cams: [[880, 640, 1.08]], sfx: [['steps', 'new', -18, { len: .9 }], ['door', 'climbed', -8]], draw(c, T) {
  const L = SET.road(c, T.t, { dusk: 0 });
  const inCab = T.since('behind') > 0;
  truck59(c, 480, 1150, 2.0, { crate: true, t: T.t, driver: inCab ? 'newdriver' : null, driverExpr: 'stern' });
  if (inCab) lightPool(c, 480 + 182 * 2, 1150 - 235 * 2, 170, '#ffcf7a', .5 * T.at('behind', .5));
  const cl = T.at('climbed', .7), wx = lerp(1500, 880, easeOut(clamp((T.t - T.shot.start) / (T.cue('climbed') - T.shot.start))));
  if (!inCab) { c.save(); c.globalAlpha = 1 - clamp((cl - .6) / .4); P('newdriver', { x: wx, y: 1080 - cl * 120, s: 1.25, t: T.t, pose: cl > 0 ? 'climb' : 'idle', walk: cl > 0 ? 0 : T.t, expr: 'stern' }); c.restore(); }
  GRADE.night(c, [...L, [850, 680, 300, '#ffcf7a', inCab ? .35 : 0]], .5);
} });
S('C6.0', { cams: [[1060, 640, 1.12]], sfx: [['steps', 0, -16, { len: 2 }]], draw(c, T) {
  const L = SET.nightStreet(c, T.t, {});
  // hotel entrance: warm doorway + neon
  box(c, 1430, 620, 170, 220, [70, 70, 0, 0], '#ffcf7a', 4); lightPool(c, 1515, 760, 260, '#ffcf7a', .6);
  sign(c, 1515, 540, 260, 80, 'HOTEL', { bg: '#2a1a1a', fg: '#ff8a5a', glow: '#ff6a4a', size: 54, hang: 40 });
  const k = (T.t - T.shot.start) / (T.shot.end - T.shot.start), dx = lerp(420, 1080, k);
  P('driver', { x: dx, y: 1000, s: .95, t: T.t, walk: T.t, expr: T.since('led') > 0 ? 'worried' : 'neutral' });
  P('dean', { x: dx - 210, y: 1004, s: .97, t: T.t, walk: T.t, pose: 'reach', expr: 'stern' });
  GRADE.night(c, [...L, [1515, 720, 300, '#ffcf7a', .5]], .42);
} });
S('C6.1', { cams: [[960, 600, 1.15]], sfx: [['door', 'night', -6]], shakes: [['night']],
  overlay: (c, T) => { const a = T.at('night', .6, 0); if (a <= 0) return; c.save(); c.globalAlpha = a; const x = 1720, y = 120; box(c, x - 170, y - 80, 330, 160, 20, 'rgba(10,14,24,.82)', 3); nightClock(c, x - 92, y, 52, 17, 30, { label: false }); label(c, 'EVENING', x + 62, y - 8, 36, '#fff', { maxW: 160 }); label(c, 'ONE NIGHT', x + 62, y + 34, 22, '#c9d6e8', { stroke: false, maxW: 160 }); c.restore(); },
  draw(c, T) {
  const L = SET.hotel(c, T.t, {});
  const shut = ease(clamp((T.t - (T.cue('night') - .9)) / .9)), ang = lerp(1.2, 0, shut);
  if (shut < 1) { box(c, 840, 400, 240, 420, 4, '#24160f'); lightPool(c, 960, 520, 260, '#ffc870', .45); P('driver', { x: 980, y: 800, s: .62, t: T.t, pose: 'slump', expr: 'worried' });
    box(c, 840, 400, 240 * Math.cos(ang), 420, 4, '#7a5040', 4); }
  else { hotelDoor(c, 960, 820, { num: '12' }); c.save(); c.globalCompositeOperation = 'screen'; ell(c, 960, 822, 120, 8, 'rgba(255,200,120,.7)', 0); c.restore(); lightPool(c, 960, 830, 160, '#ffc870', .5); }
  box(c, 820, 380, 280, 22, 4, '#4a2e22', 3);
  GRADE.night(c, L, .3);
} });
S('C7.0', { cams: [[960, 560, 1.05], [1180, 520, 1.4]], shakes: [['stolen']], sfx: [['stamp', 'stolen', -4], ['paper', 'piece', -12]], draw(c, T) {
  SET.desk(c, T.t, { lx: 960, ly: 520 });
  c.save(); c.translate(960, 560); c.rotate(-.04);
  box(c, -470, -300, 220, 60, [14, 14, 0, 0], '#d9b97a', 4); label(c, 'LUNIK', -360, -268, 34, INK, { stroke: false });
  box(c, -480, -250, 960, 560, 10, '#d9b97a', 4); box(c, -440, -220, 880, 500, 4, '#f6f1e2', 3);
  for (let i = 0; i < 9; i++) line(c, -400, -150 + i * 44, -400 + (i % 3 === 2 ? 380 : 700), -150 + i * 44, 8, 'rgba(40,40,40,.35)');
  c.restore();
  const ph = pop(T, 'piece', .6); if (ph > 0) photoPrint(c, lerp(1060, 1290, easeOut(ph)), lerp(600, 470, easeOut(ph)), 380, 260, .1, () => { c.fillStyle = '#20252c'; c.fillRect(-190, -130, 380, 260); lunikExhibit(c, 0, 110, 260, {}); });
  stamp(c, 820, 470, 'TOP SECRET', T.at('stolen', .3), RED, { w: 560, h: 130, rot: -.12 });
} });
// ---- the night in three moves: one night / take apart + photograph / put back
S('C8.0', { cams: [[960, 500, 1.1]], sfx: [['clock', 0, -14, { len: 1.8 }]], draw(c, T) {
  SET.black(c, T.t); lightPool(c, 960, 460, 700, '#24406a', .5);
  const mins = 18 * 60 + T.lt * 160; nightClock(c, 960, 430, 230, Math.floor(mins / 60), mins % 60, { label: false });
  const p = pop(T, 'one', .5); arrive(c, p, 960, 800, () => label(c, 'ONE NIGHT', 0, 0, 110, '#ffb04a', { glow: '#ffb04a' }));
} });
// the Lunik as five pieces (sliced from the blueprint). k = explode 0..1, fl(i) = flash progress per piece
const CUTS = [-.56, -.44, -.19, .05, .18, .58], PN = ['BASE CAP', 'FUEL TANK', 'OXIDIZER TANK', 'BODY', 'NOSE + SPHERE'];
function lunikParts(c, x, y, L, k, fl = () => 0, labels = true) {
  const off = [[-170, -40, -.12], [-70, 50, .06], [20, -60, -.05], [110, 40, .08], [220, -30, .05]];
  for (let i = 0; i < 5; i++) { const a = CUTS[i] * L, b = CUTS[i + 1] * L, [ox, oy, rot] = off[i];
    c.save(); c.translate(x + ox * k * L / 900, y + oy * k * L / 900); c.rotate(rot * k);
    c.save(); c.beginPath(); c.rect(a, -L * .4, b - a, L * .8); c.clip(); lunik(c, 0, 0, L, { blueprint: true }); c.restore();
    const f = fl(i); if (f > 0 && f < 1) { c.save(); c.globalAlpha = (1 - f); c.shadowColor = '#fff'; c.shadowBlur = 40; rr(c, a - 10, -L * .19, b - a + 20, L * .38, 14); c.lineWidth = 8; c.strokeStyle = '#fff'; c.stroke(); c.restore(); flashBurst(c, (a + b) / 2, -L * .22, 90, f); }
    if (labels && k > .6) { c.globalAlpha = clamp((k - .6) / .4); label(c, PN[i], (a + b) / 2, L * .23 + (i % 2) * 44, 26, '#e8f1ff', { stroke: false, maxW: 260 }); }
    c.restore(); }
}
const C81 = 'C8.1';
S('C8.1', { cams: [[960, 540, 1.0]], sfx: [['crumble', 'apart', -16], ...[0, 1, 2, 3, 4].map(i => ['camflash2', rel(C81, 'C8', 'photograph', i * .28), -10])], draw(c, T) {
  SET.grid(c, T.t, { title: 'LUNIK / UPPER STAGE', sub: 'TAKE APART' });
  const k = easeOut(T.at('apart', .8)), f0 = T.cue('photograph');
  lunikParts(c, 960, 520, 980, k, i => (T.t - f0 - i * .28) / .5);
  const pf = T.since('photograph'); if (pf > 0 && pf < 1.8) { const i = Math.min(4, Math.floor(pf / .28)); GRADE.flash(c, 960, 520, ((pf - i * .28) / .4)); }
} });
S('C8.2', { cams: [[960, 560, 1.0]], sfx: [['slide', 'back', -12], ['hammer', 'soviet', -12]], draw(c, T) {
  SET.grid(c, T.t, { title: 'LUNIK / UPPER STAGE', sub: 'PUT BACK' });
  const k = 1 - ease(T.at('back', .9)), cr = ease(T.at('soviet', .7));
  if (cr < 1) { c.save(); c.globalAlpha = 1 - cr; lunikParts(c, 960, 568, 968 * (1 - .0), Math.max(k, 0), () => 0, true); c.restore(); }
  if (cr > 0) { c.save(); c.globalAlpha = cr; crate(c, 960, 700, 1100, { xray: 1 - cr }); c.restore(); }
  const a = T.at('official', .5); arrive(c, a, 960, 900, () => label(c, 'BEFORE 7 A.M.', 0, 0, 64, '#ffcf3f', { glow: '#ffb04a' }));
} });
S('C8.3', { cams: [[1500, 640, 1.25]], sfx: [['clock', 0, -14, { len: 1 }], ['bell', '7', -12]],
  overlay: (c, T) => { const k = ease(T.at('7', .9)); const m = lerp(22 * 60, 31 * 60, k) % 1440; nightClockOverlay(c, Math.floor(m / 60), Math.round(m % 60) % 60, { sub: 'CHECK-IN' }); },
  draw(c, T) {
  const L = SET.railYard(c, T.t, { morning: T.at('7', .9) > .5 });
  lightPool(c, 1835, 770, 320, '#ffd8a0', .5 + .3 * T.at('7', .9));
  P('checker', { x: 1560, y: 900, s: 1.0, t: T.t, pose: 'clipboard', expr: 'stern' });
  GRADE.night(c, L, .45 * (1 - T.at('7', 1.2) * .6)); GRADE.dawn(c, .3 * T.at('7', 1.2));
} });
card('C9.0', 'This is the story of how they did it.');

// =============================== THE SPACE RACE ===============================
chap('R1.0', 1, 'The Space Race');
S('R1.1', { cams: [[960, 520, 1.15]], sfx: [['page', 'back', -10], ['page', 'two', -12]], draw(c, T) {
  SET.paper(c, T.t);
  const fl = T.since('back');
  calendar(c, 960, 520, 560, 520, 'YEAR', fl > .35 ? '1957' : fl > .05 ? '1958' : '1959', {});
  [['1959', 0], ['1958', .3]].forEach(([y, d], i) => { const k = clamp((fl - d) / .5); if (k <= 0 || k >= 1) return; c.save(); c.translate(960 - k * 600, 520 - k * 380); c.rotate(-k * 1.4); c.globalAlpha = 1 - k; box(c, -280, -260, 560, 520, 12, '#fff'); label(c, y, 0, 70, 176, INK, { stroke: false }); c.restore(); });
  const p = T.at('years', .5); if (p > 0) { c.save(); c.globalAlpha = p; hand(c, '2 years earlier', 1280, 860, 74, '#b8322a', { rot: -.05 }); c.restore(); }
} });
S('R2.0', { cams: [[900, 560, 1.05]], sfx: [['elec', 'union', -16]], draw(c, T) {
  NIGHT_SKY(c, T.t, '#060c1c', '#1a2a44', 90); FLOOR(c, 900, '#1c2418');
  const L = [[700, 700, 500, '#ffe2a0', .4], [1220, 700, 500, '#ffe2a0', .4]];
  cone(c, 300, 300, 30, 400, 800, '#fff3d0', .14); cone(c, 1620, 300, 30, 400, 800, '#fff3d0', .14);
  line(c, 760, 900, 800, 260, 12, '#3a3f46'); for (let y = 320; y < 900; y += 60) line(c, 762, y, 840, y + 40, 4, '#3a3f46');
  const f = T.at('union', .4); launchRocket(c, 960, 905, 1.0, { fire: f, t: T.t });
  const ca = pop(T, 'october', .4); arrive(c, ca, 330, 300, () => calendar(c, 0, 0, 300, 280, 'OCT', '1957', {}));
  GRADE.night(c, L, .3);
} });
S('R2.1', { cams: [[960, 520, 1.0], [880, 520, 1.12]], sfx: [['radio', 'sputnik', -18, { len: 1.6 }], ['ding', 'first', -14]], draw(c, T) {
  if (T.sub === 0) {
    SET.space(c, T.t); earth(c, 960, 1750, 1050, T.t);
    const p = T.at('sputnik', .5); c.save(); c.setLineDash([12, 12]); c.globalAlpha = p; c.beginPath(); c.ellipse(960, 1750, 1300, 1260, 0, Math.PI * 1.12, Math.PI * 1.88); c.lineWidth = 4; c.strokeStyle = '#9fd1ff'; c.stroke(); c.restore();
    const a = Math.PI * 1.25 + T.lt * .12, sx = 960 + Math.cos(a) * 1300, sy = 1750 + Math.sin(a) * 1260;
    if (p > 0) { c.save(); c.translate(sx, sy); c.scale(back(p), back(p)); sputnik(c, 0, 0, 44, T.t, { beep: true }); c.restore(); }
    const lp = pop(T, 'sputnik', .5); arrive(c, lp, 960, 140, () => label(c, 'SPUTNIK', 0, 0, 80, '#fff', { glow: '#9fd1ff' }));
  } else {
    NIGHT_SKY(c, T.t, '#050b1a', '#18304e', 120); skyline(c, 880, '#0a1424', 'rgba(255,200,110,.4)', 5, .8);
    box(c, -400, 860, W + 800, 400, 0, '#202a36'); line(c, -400, 860, W + 400, 860, LW);
    const dx = 300 + (T.t - 59.9) * 420, dy = 360 - (T.t - 59.9) * 40; circ(c, dx, dy, 6, '#fff', 0); lightPool(c, dx, dy, 40, '#cfe6ff', .8);
    P('visitor3', { x: 760, y: 1030, s: .72, t: T.t, pose: 'point', expr: 'shock' }); P('visitor4', { x: 1000, y: 1040, s: .66, t: T.t, pose: 'point', expr: 'grin' });
    label(c, 'THE FIRST ARTIFICIAL SATELLITE', 1320, 190, 54, '#fff', { maxW: 980 });
    GRADE.night(c, [[900, 900, 400, '#ffb04a', .2]], .25);
  }
} });
S('R3.0', { cams: [[960, 540, 1.0]], sfx: [['whoosh3', 'moon', -12]], draw(c, T) {
  SET.space(c, T.t); earth(c, 380, 600, 210, T.t); moon(c, 1560, 470, 150, {});
  const p = easeOut(clamp((T.t - T.shot.start) / (T.cue('moon') + .3 - T.shot.start)));
  c.save(); c.setLineDash([16, 14]); c.lineWidth = 6; c.strokeStyle = '#ffcf3f'; c.beginPath(); for (let i = 0; i <= 60 * p; i++) { const u = i / 60; const px = lerp(600, 1400, u), py = lerp(560, 480, u) - Math.sin(u * Math.PI) * 200; i ? c.lineTo(px, py) : c.moveTo(px, py); } c.stroke(); c.restore();
  label(c, 'EARTH', 380, 870, 44, '#fff'); const m = pop(T, 'moon', .4); arrive(c, m, 1560, 680, () => label(c, 'THE MOON', 0, 0, 52, '#fff'));
} });
S('R3.1', { cams: [[960, 540, 1.0], [760, 600, 1.3]], sfx: [['bell', 'won', -8], ['ding', 'every', -14], ['ding', 'round', -14]], draw(c, T) {
  bg(c, '#1a120c', '#0e0906'); lightPool(c, 960, 300, 900, '#ffd890', .25);
  box(c, 460, 140, 1000, 820, 18, '#3a2a1e', 6); box(c, 490, 170, 940, 760, 10, '#1f2a24', 4);
  label(c, 'SCORECARD 1959', 960, 230, 56, '#f3efe6', { stroke: false }); line(c, 520, 280, 1400, 280, 4, 'rgba(243,239,230,.5)'); line(c, 960, 300, 960, 900, 4, 'rgba(243,239,230,.5)');
  label(c, 'USSR', 740, 340, 58, '#ff7a6a', { stroke: false }); label(c, 'USA', 1180, 340, 58, '#9fc6ff', { stroke: false });
  const marks = [T.cue('won'), T.cue('every'), T.cue('round'), T.cue('round') + .35];
  marks.forEach((m, i) => { const p = clamp((T.t - m) / .3); if (p <= 0) return; c.save(); c.translate(740, 440 + i * 110); c.scale(back(p), back(p)); poly(c, starPts(0, 0, 40), GOLD, 4); c.restore(); });
  for (let i = 0; i < 5; i++) { line(c, 520, 390 + i * 110 + 55, 1400, 390 + i * 110 + 55, 2, 'rgba(243,239,230,.15)'); }
} });
S('R4.0', { cams: [[960, 540, 1.0], [1080, 520, 1.3]], shakes: [['escape']], sfx: [['page', 'january', -14], ['crumble', 'escape', -10]],
  overlay: (c, T) => { const g = pop(T, 'gravity', .5); if (g > 0) tag(c, "First to escape Earth's gravity", '', g, 0, { size: 52 }); },
  draw(c, T) {
  SET.space(c, T.t); earth(c, 700, 560, 180, T.t);
  const br = T.at('escape', .5);
  c.save(); c.setLineDash([18, 14]); c.lineWidth = 5; c.strokeStyle = '#9fd1ff'; c.globalAlpha = 1 - br * .4; c.beginPath(); c.arc(700, 560, 380, -.35 + br * .25, TAU - .35 - br * .25); c.stroke(); c.restore();
  label(c, "EARTH'S GRAVITY", 700, 150, 36, '#9fd1ff', { stroke: false });
  const tE = T.cue('escape'), u = clamp((T.t - T.shot.start) / (tE - T.shot.start)), rad = T.t < tE ? lerp(200, 380, ease(u)) : 380 + (T.t - tE) * 260, ang = -.35 + (1 - u) * -1.4;
  const px = 700 + Math.cos(ang) * rad, py = 560 + Math.sin(ang) * rad;
  lunaProbe(c, px, py, 34, 1, T.t); const lp = pop(T, 'luna', .4); if (lp > 0) { c.save(); c.globalAlpha = lp; label(c, 'LUNA 1', px, py - 80, 40, '#fff'); c.restore(); }
  if (br > 0 && br < 1) for (let i = 0; i < 8; i++) { const a = -.35 + (i - 4) * .05; circ(c, 700 + Math.cos(a) * (380 + br * 80), 560 + Math.sin(a) * (380 + br * 80) + (i - 4) * 10, 5 * (1 - br), '#9fd1ff', 0); }
  const ca = pop(T, 'january', .4); arrive(c, ca, 1640, 230, () => calendar(c, 0, 0, 280, 260, 'JAN', '1959', {}));
} });
S('R5.0', { cams: [[960, 540, 1.0], [1000, 480, 1.25]], sfx: [['page', 'march', -14], ['camshutter', 'photograph', -8]], draw(c, T) {
  SET.space(c, T.t); earth(c, 220, 840, 130, T.t); moon(c, 1560, 420, 150, {});
  const ca = pop(T, 'march', .4); arrive(c, ca, 300, 220, () => calendar(c, 0, 0, 260, 240, 'MAR', '1959', {}));
  const u = clamp((T.t - 73.3) / 7.0), px = lerp(360, 1300, u), py = lerp(760, 230, u);
  pioneer4(c, px, py, .95, { rot: .9 });
  const tg = pop(T, 'pioneer', .4); if (tg > 0) { c.save(); c.globalAlpha = tg; label(c, 'PIONEER 4', px - 40, py + 120, 40, '#fff'); hand(c, 'USA', px - 40, py + 168, 40, '#9fc6ff', { align: 'center' }); c.restore(); }
  const cm = pop(T, 'photograph', .4); if (cm > 0) { c.save(); c.translate(px + 90, py - 90); c.scale(back(cm) * .5, back(cm) * .5); pressCamera(c, 0, 0, 1, {}); c.restore(); }
} });
S('R5.1', { cams: [[1260, 420, 1.1]], push: .03, sfx: [['whoosh1', 'passed', -10], ['ding', '37', -14]], draw(c, T) {
  SET.space(c, T.t); moon(c, 1360, 560, 170, {});
  const u = clamp((T.t - 73.3) / 7.0), px = lerp(360, 1300, u) + (T.t > 76.8 ? (T.t - 76.8) * 260 : 0), py = lerp(760, 230, u) - (T.t > 76.8 ? (T.t - 76.8) * 40 : 0);
  c.save(); c.setLineDash([10, 12]); c.lineWidth = 4; c.strokeStyle = 'rgba(224,194,106,.7)'; c.beginPath(); c.moveTo(lerp(360, 1300, .5), lerp(760, 230, .5)); c.lineTo(px, py); c.stroke(); c.restore();
  pioneer4(c, px, py, .9, { rot: .9 });
  const d = pop(T, '37', .5); if (d > 0) { c.save(); c.globalAlpha = d; line(c, 1360, 560 - 175, 1320, 240, 5, '#ffcf3f'); arrow(c, 1340, 340, 1322, 250, '#ffcf3f', 10); arrow(c, 1330, 300, 1352, 384, '#ffcf3f', 10); c.restore();
    label(c, '~' + commas(num(T, '37', 37000, 1.0)) + ' MILES', 1640, 300, 54, '#ffcf3f', { glow: '#ffb04a' }); }
} });
S('R5.2', { cams: [[960, 540, 1.1]], sfx: [['camshutter', 'far', -8], ['sadhorn', 'work', -18]], draw(c, T) {
  SET.black(c, T.t); lightPool(c, 960, 540, 700, '#203048', .4);
  box(c, 560, 220, 800, 560, 20, '#0a0e16', 6); viewCorners(c, 960, 500, 700, 460, '#cfe6ff'); line(c, 940, 500, 980, 500, 3, '#cfe6ff'); line(c, 960, 480, 960, 520, 3, '#cfe6ff');
  starfield(c, T.t, 7, 30, { a: .3 }); moon(c, 1240, 360, 10, {});
  const f = pop(T, 'far', .4); arrive(c, f, 960, 500, () => label(c, 'TOO FAR', 0, 0, 130, '#ff7a6a', { glow: '#ff4a3d' }));
  c.save(); c.translate(400, 880); pressCamera(c, 0, 0, 1.1, {}); c.restore(); if (T.since('too') > 0) { circ(c, 470, 760, 12, '#9fd1ff', 3); }
  hand(c, "the camera couldn't work", 1360, 880, 54, '#cfe6ff', { align: 'center', a: T.at('camera', .5) });
} });
S('R6.0', { cams: [[1000, 520, 1.0], [1130, 560, 1.35]], shakes: [['crashed']], sfx: [['page', 'september', -14], ['whoosh2', 'luna', -12], ['hit', 'crashed', -4]], draw(c, T) {
  SET.space(c, T.t); moon(c, 1230, 640, 320, {});
  const ca = pop(T, 'september', .4); arrive(c, ca, 300, 230, () => calendar(c, 0, 0, 260, 240, 'SEP', '1959', {}));
  const tC = T.cue('crashed'), u = clamp((T.t - (tC - 1.6)) / 1.6), ix = 1060, iy = 400;
  if (u < 1) { const px = lerp(200, ix, ease(u)), py = lerp(-60, iy, ease(u)); c.save(); c.globalAlpha = .5; line(c, px - 200, py - 100, px, py, 6, '#fff3c0'); c.restore(); lunaProbe(c, px, py, 26, 2, T.t); if (u > .2) label(c, 'LUNA 2', px - 60, py - 60, 36, '#fff'); }
  const k = clamp((T.t - tC) / 1.2); if (k > 0) { for (let i = 0; i < 9; i++) { const a = -Math.PI * .95 + i / 8 * Math.PI * .9; circ(c, ix + Math.cos(a) * 140 * easeOut(k), iy + Math.sin(a) * 90 * easeOut(k), 26 * (1 - k * .7), `rgba(220,214,200,${.8 * (1 - k)})`, 0); } lightPool(c, ix, iy, 260, '#fff3c0', 1 - k); circ(c, ix, iy, 16, '#5b5a55', 0); }
} });
S('R6.1', { cams: [[960, 560, 1.12]], sfx: [['sparkle', 'first', -14]], draw(c, T) {
  SET.space(c, T.t); earth(c, 1540, 220, 70, T.t);
  c.beginPath(); c.ellipse(960, 1700, 1500, 960, 0, 0, TAU); fs(c, '#bdb9ae'); const R = rand(11); for (let i = 0; i < 14; i++) ell(c, 300 + R() * 1400, 820 + R() * 220, 30 + R() * 60, 10 + R() * 16, '#a6a297', 3);
  ell(c, 960, 860, 150, 40, '#8f8b80', 4); ell(c, 960, 866, 120, 28, '#77736a', 0); for (let i = 0; i < 4; i++) { const gx = 920 + i * 26, gy = 858 + (i % 2) * 6; circ(c, gx, gy, 5, '#d6dde2', 2); lightPool(c, gx, gy, 30, '#fff', .6 + .3 * Math.sin(T.t * 3 + i)); }
  const a = pop(T, 'first', .5), b = pop(T, 'reach', .5);
  arrive(c, a, 960, 280, () => label(c, 'FIRST HUMAN-MADE OBJECT', 0, 0, 72, '#fff')); arrive(c, b, 960, 380, () => label(c, 'TO REACH THE MOON', 0, 0, 72, '#ffcf3f'));
} });
S('R7.0', { cams: [[960, 520, 1.0], [960, 500, 1.18]], sfx: [['pencil', 'exactly', -12], ['ding', 'sputnik', -16], ['ding', 'luna', -16]], draw(c, T) {
  SET.paper(c, T.t);
  calendar(c, 560, 600, 420, 400, 'OCT 4', '1957', {}); calendar(c, 1360, 600, 420, 400, 'OCT 4', '1959', {});
  const p = T.at('exactly', .9); c.save(); c.setLineDash([16, 12]); c.lineWidth = 7; c.strokeStyle = '#b8322a'; c.beginPath(); for (let i = 0; i <= 40 * p; i++) { const u = i / 40; const px = lerp(560, 1360, u), py = 360 - Math.sin(u * Math.PI) * 170; i ? c.lineTo(px, py) : c.moveTo(px, py); } c.stroke(); c.restore();
  if (p > .9) hand(c, 'exactly 2 years', 960, 150, 66, '#b8322a', { align: 'center' });
  const s = pop(T, 'sputnik', .4); arrive(c, s, 560, 900, () => { sputnik(c, -40, 0, 30, T.t, {}); label(c, 'SPUTNIK', 60, 0, 40, INK, { stroke: false }); });
  const l = pop(T, 'luna', .4); arrive(c, l, 1360, 900, () => { lunaProbe(c, -70, 0, 30, 3, T.t); label(c, 'LUNA 3', 40, 0, 40, INK, { stroke: false }); });
} });
S('R7.1', { cams: [[780, 560, 1.05], [1420, 520, 1.3]], sfx: [['typewriter', 'images', -14, { len: 1.6 }], ['ding', 'far', -14]], draw(c, T) {
  SET.space(c, T.t); const mx = 760, my = 560;
  const u = clamp((T.t - 94.0) / 3.6), a = lerp(Math.PI * .85, Math.PI * 2.6, ease(u)), px = mx + Math.cos(a) * 330, py = my + Math.sin(a) * 210;
  const drawProbe = () => { lunaProbe(c, px, py, 30, 3, T.t); };
  if (Math.sin(a) < 0) drawProbe(); moon(c, mx, my, 220, {}); if (Math.sin(a) >= 0) drawProbe();
  c.save(); c.setLineDash([8, 10]); c.lineWidth = 3; c.strokeStyle = 'rgba(159,209,255,.5)'; c.beginPath(); c.ellipse(mx, my, 330, 210, 0, Math.PI * .85, a); c.stroke(); c.restore();
  label(c, 'LUNA 3', px, py - 70, 34, '#fff');
  teleprinter(c, 1420, 980, 1.1);
  const pr = clamp(T.since('images') / 1.6); if (pr > 0) { const ph = 420 * pr; c.save(); c.beginPath(); c.rect(1100, 980 - 220 - ph, 640, ph); c.clip(); photoPrint(c, 1420, 980 - 220 - 210, 360, 360, 0, () => { c.fillStyle = '#111'; c.fillRect(-180, -180, 360, 360); moon(c, 0, 0, 150, { far: true }); }, {}); c.restore(); }
  const f = pop(T, 'far', .4); arrive(c, f, 1420, 200, () => label(c, "THE MOON'S FAR SIDE", 0, 0, 52, '#fff'));
} });
S('R8.0', { cams: [[960, 560, 1.0], [960, 520, 1.3]], sfx: [['paper', 'lunik', -8], ['paper', 'probes', -16]], draw(c, T) {
  bg(c, '#c9dbe6', '#efe4cc'); skyline(c, 760, '#9fb1bf', null, 7, .9); FLOOR(c, 900, '#b9ad94');
  box(c, 360, 300, 1200, 600, 10, '#2f5a3a', 5); for (let i = 0; i < 10; i++) poly(c, [[340 + i * 124, 300], [464 + i * 124, 300], [452 + i * 124, 220], [352 + i * 124, 220]], i % 2 ? '#f3efe6' : '#b8322a', 4);
  sign(c, 960, 360, 380, 60, 'NEWSPAPERS', { bg: '#f3efe6', size: 34 });
  const masts = ['THE DAILY', 'EVENING PAPER', 'WORLD NEWS'], heads = ['LUNIK!', 'LUNIK', 'LUNIK'];
  [0, 1, 2].forEach(i => { const k = clamp((T.since('lunik') - i * .18) / .35); const sx = Math.abs(Math.cos(k * Math.PI)), done = k > .5; const x = 620 + i * 340, y = 640;
    c.save(); c.translate(x, y); c.scale(Math.max(.02, sx), 1); paper1959(c, 0, 0, 300, 400, done ? heads[i] : 'SOVIET PROBE', { mast: masts[i], rot: (i - 1) * .04 }); c.restore(); });
  P('visitor1', { x: 250, y: 1010, s: .85, t: T.t, pose: 'idle', expr: T.since('lunik') > 0 ? 'shock' : 'neutral' });
} });
function listening(c, T, o) {
  bg(c, '#1c2622', '#0f1513');
  c.save(); rr(c, 100, 140, 660, 520, 20); c.clip(); NIGHT_SKY(c, T.t, '#050b1a', '#13243c', 60); FLOOR(c, 560, '#0f1a14');
  const sc = Math.cos(T.t * .7); c.save(); c.translate(420, 470); line(c, 0, 0, 0, 90, 14, '#2a3440'); c.scale(Math.max(.25, Math.abs(sc)), 1); c.rotate(-.5); ell(c, 0, -60, 150, 50, '#c9ced4', 5); line(c, 0, -60, 0, -150, 5); c.restore();
  c.restore(); rr(c, 100, 140, 660, 520, 20); fs(c, null, 8); line(c, 430, 140, 430, 660, 6);
  box(c, 860, 640, 1100, 60, 10, '#3a3f36'); box(c, 900, 470, 700, 170, 10, '#4a5248', 4); for (let i = 0; i < 5; i++) { circ(c, 980 + i * 120, 540, 34, '#1b2a20', 4); line(c, 980 + i * 120, 540, 980 + i * 120 + Math.cos(T.t * 2 + i) * 24, 540 - 20, 4, '#9fe0a0'); }
  P('radioman', { x: 1500, y: 1040, s: 1.15, t: T.t, pose: 'radio', expr: o.expr });
  // the signal: a wavy line from the dish to his headphones
  c.save(); c.lineWidth = 5; c.strokeStyle = '#9fe0a0'; c.shadowColor = '#9fe0a0'; c.shadowBlur = 16; c.beginPath(); for (let i = 0; i <= 80; i++) { const u = i / 80, x = lerp(500, 1440, u), y = lerp(380, 660, u) + Math.sin(u * 30 - T.t * 9) * 14 * Math.sin(u * Math.PI); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); c.restore();
  GRADE.night(c, [[1250, 560, 600, '#9fe0a0', .2]], .3);
}
S('R9.0', { cams: [[960, 540, 1.0]], sfx: [['static', 0, -20, { len: 2 }]], draw(c, T) {
  listening(c, T, { expr: 'focus' });
  const a = pop(T, 'track', .4); arrive(c, a, 440, 120, () => label(c, 'TRACK THE LAUNCHES', 0, 0, 44, '#fff'));
} });
S('R9.1', { cams: [[960, 560, 1.15]], sfx: [['typewriter', 'intercept', -12, { len: 1.8 }], ['radio', 'radio', -16]], draw(c, T) {
  bg(c, '#1c2622', '#0f1513'); lightPool(c, 960, 400, 800, '#9fe0a0', .15); FLOOR(c, 820, '#20261f');
  teleprinter(c, 960, 820, 2.2);
  const sp = T.since('intercept') > 0 ? 1 : .25, len = 160 + Math.max(0, T.since('intercept')) * 420; const y0 = 820 - 206 * 2.2;
  c.save(); c.beginPath(); for (let i = 0; i <= 40; i++) { const u = i / 40, x = 960 + Math.sin(u * 3) * 40 * u, y = y0 - u * Math.min(len, 380); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.lineWidth = 40; c.strokeStyle = '#f6f1e2'; c.stroke(); c.restore();
  for (let i = 0; i < 12; i++) { const u = ((i / 12) + T.t * sp * .2) % 1; const yy = y0 - u * Math.min(len, 380); if (yy < y0 - Math.min(len, 380)) continue; const x = 960 + Math.sin(u * 3) * 40 * u; (i % 3) ? circ(c, x, yy, 5, INK, 0) : line(c, x - 10, yy, x + 10, yy, 5); }
  const r = pop(T, 'radio', .4); arrive(c, r, 1450, 300, () => hand(c, 'radio signals', 0, 0, 70, '#9fe0a0', { align: 'center', rot: -.05 }));
  const a = pop(T, 'intercept', .4); arrive(c, a, 470, 300, () => label(c, 'INTERCEPTED', 0, 0, 56, '#fff'));
} });
S('R10.0', { cams: [[1000, 560, 1.0], [700, 540, 1.4]], shakes: [['hands']], sfx: [['hit', 'hands', -8]], draw(c, T) {
  SET.spot(c, T.t, { x: 1250, col: '#ffe9c0' });
  lunik(c, 1250, 560, 860, { glint: T.t, glow: 1 });
  const th = T.cue('hands'), u = clamp((T.t - T.shot.start) / (th - T.shot.start)), hx = T.t < th ? lerp(-180, 640, ease(u)) : 640;
  // the reaching arm: suit sleeve, white cuff, crayon hand
  box(c, -400, 590, hx - 30 + 400, 90, 40, '#2f3e52', 5); box(c, hx - 70, 584, 50, 102, 10, '#f3efe6', 4);
  const flat = T.t >= th; if (flat) { ell(c, hx + 14, 636, 22, 62, '#f2c49b', 4); for (let i = 0; i < 4; i++) box(c, hx + 6, 586 + i * 30, 46, 22, 11, '#f2c49b', 3.5); }
  else { circ(c, hx + 10, 634, 44, '#f2c49b', 4); box(c, hx + 20, 600, 60, 22, 11, '#f2c49b', 3.5); box(c, hx + 24, 630, 64, 22, 11, '#f2c49b', 3.5); }
  // the glass
  c.save(); c.globalAlpha = .16; c.fillStyle = '#bfe6ff'; c.fillRect(690, 180, 1220, 740); c.restore(); line(c, 690, 180, 690, 920, 6, 'rgba(220,240,255,.7)');
  c.save(); c.globalAlpha = .25; for (let i = 0; i < 3; i++) line(c, 760 + i * 70, 220, 900 + i * 70, 380, 8, '#fff'); c.restore();
  const k = clamp((T.t - th) / .6); if (k > 0 && k < 1) { c.save(); c.globalAlpha = 1 - k; c.beginPath(); c.ellipse(690, 636, 30 + k * 120, 60 + k * 200, 0, 0, TAU); c.lineWidth = 4; c.strokeStyle = '#dff2ff'; c.stroke(); c.restore(); }
} });
S('R11.0', { cams: [[960, 560, 1.0], [1180, 600, 1.25]], sfx: [['paper', 'factories', -10], ['paper', 'together', -10], ['paper', 'many', -10]], draw(c, T) {
  SET.grid(c, T.t); c.save(); c.globalAlpha = .28; lunik(c, 960, 220, 900, { blueprint: true }); c.restore();
  [['factories', 'WHICH FACTORY?'], ['together', 'HOW WAS IT BUILT?'], ['many', 'HOW MANY EXIST?']].forEach(([w, txt], i) => { const p = pop(T, w, .45); arrive(c, p, 440 + i * 520, 640, () => { c.rotate((i - 1) * .04); box(c, -220, -170, 440, 340, 10, '#f6f1e2', 5); box(c, -220, -170, 440, 60, [10, 10, 0, 0], '#b8322a', 0); rr(c, -220, -170, 440, 340, 10); fs(c, null, 5); label(c, '?', 0, 30, 170, '#b8322a', { stroke: false }); label(c, txt, 0, -140, 34, '#fff', { stroke: false, maxW: 400 }); }); });
} });
S('R12.0', { cams: [[960, 600, 1.15]], sfx: [['pop', 'expected', -12], ['hit', rel('R12.0', 'R12', 'expected', .55), -12]], draw(c, T) {
  const L = SET.washington(c, T.t, { board: 'SOVIET SPACE' });
  const e = T.since('expected'), sh = e > 0;
  P('analyst', { x: 960, y: 900, s: 1.05, t: T.t, pose: sh ? 'armsUp' : 'hold', expr: sh ? 'shock' : 'neutral',
    item: sh ? null : (cc, h) => { mug(cc, h[1][0], h[1][1] + 10, .9); paper1959(cc, h[0][0] - 10, h[0][1] - 40, 170, 220, 'LUNIK ON TOUR', { mast: 'WIRE', rot: -.1 }); } });
  if (sh) { const k = clamp(e / .55), mx = 1080 + k * 40, my = lerp(700, 905, k * k); if (k < 1) mug(c, mx, my, .95, k * 2.5); else { ell(c, 1140, 912, 90 * clamp((e - .55) / .2), 14, '#5a3a22', 0); mug(c, 1190, 912, .95, 1.6); }
    c.save(); c.translate(860, 620); c.rotate(-.6 - e * 2); paper1959(c, 0, Math.min(e, .6) * 300, 170, 220, 'LUNIK ON TOUR', { mast: 'WIRE' }); c.restore(); }
} });
S('R12.1', { cams: [[960, 540, 1.0]], sfx: [['whoosh1', 'world', -10]], draw(c, T) {
  bg(c, '#0d1a2a'); const p = clamp((T.t - 118.7) / 1.7);
  const st = [[.6, .2], [.5, .27], [.28, .3], [.21, .42]];
  worldMap(c, 960, 540, 1720, 980, { stops: st, p });
  const seg = Math.min(st.length - 2, Math.floor(p * (st.length - 1))), u = p * (st.length - 1) - seg, A = st[seg], B = st[seg + 1];
  const px = 100 + lerp(A[0], B[0], u) * 1720, py = 50 + lerp(A[1], B[1], u) * 980 - Math.sin(u * Math.PI) * 78 - 50;
  lunik(c, px, py, 150, {}); const wt = pop(T, 'world', .4); arrive(c, wt, 960, 980, () => label(c, 'A WORLD TOUR', 0, 0, 70, '#ffcf3f', { glow: '#ffb04a' }));
} });

// =============================== THE WORLD TOUR ===============================
chap('T1.0', 2, 'The World Tour');
S('T1.1', { cams: [[960, 520, 1.0], [960, 660, 1.3]], sfx: [['crowdtalk', 0, -18, { len: 5.5 }]],
  overlay: (c, T) => tag(c, 'Sent from Moscow', '1959', T.at('moscow', .5), T.at('exhibition', .5)),
  draw(c, T) {
  bg(c, '#a9cbe6', '#e9e0c8'); cloud(c, 300 + T.t * 6, 160, 1.2); cloud(c, 1500 + T.t * 4, 120, .9);
  FLOOR(c, 860, '#cbbf9f');
  hallFacade(c, 960, 860, 1500, { banner: 'SOVIET EXHIBITION' });
  // the crowd streams toward the doors
  for (let r = 0; r < 3; r++) folk(c, 960, 930 + r * 70, 1900, 1, .95 + r * .12, T.t, 3 + r, { walk: 20 + r * 6 });
} });
S('T2.0', { cams: [[800, 600, 1.12]], sfx: [['hammer', 'machinery', -12]], draw(c, T) {
  SET.exhibitHall(c, T.t, {});
  const p = pop(T, 'machinery', .6); pedestal(c, 900, 820, 640, { plaque: 'HEAVY MACHINERY' });
  arrive(c, p, 900, 690, () => tractor(c, 0, 0, 1.25));
  P('visitor1', { x: 1350, y: 1040, s: .9, t: T.t, expr: p > 0 ? 'shock' : 'neutral', flip: true }); P('visitor3', { x: 1520, y: 1050, s: .85, t: T.t, expr: 'grin', pose: 'point', flip: true });
} });
S('T2.1', { cams: [[960, 560, 1.2]], sfx: [['elec', 'nuclear', -12]], draw(c, T) {
  SET.exhibitHall(c, T.t, { banner: false });
  box(c, 480, 720, 960, 40, 8, '#6d4c41'); line(c, 520, 760, 520, 900, 12); line(c, 1400, 760, 1400, 900, 12);
  // power station model: cooling tower, hall, pylons
  c.beginPath(); c.moveTo(560, 720); c.quadraticCurveTo(640, 560, 590, 420); c.lineTo(770, 420); c.quadraticCurveTo(720, 560, 800, 720); c.closePath(); fs(c, '#c9ced4');
  for (let i = 0; i < 3; i++) { const k = (T.t * .3 + i / 3) % 1; circ(c, 680 + Math.sin(k * 6) * 20, 400 - k * 160, 30 + k * 30, `rgba(255,255,255,${.5 * (1 - k)})`, 0); }
  box(c, 860, 560, 300, 160, 8, '#8d969e'); ell(c, 1010, 560, 110, 70, '#aeb6bd'); box(c, 1200, 600, 30, 120, 3, '#5b636b', 3); line(c, 1160, 620, 1270, 620, 5); line(c, 1215, 600, 1330, 520, 3);
  label(c, 'POWER STATIONS', 960, 820, 40, '#fff');
  const n = T.at('nuclear', .6); if (n > 0) { const ax = 1010, ay = 360; lightPool(c, ax, ay, 220, '#9fe0ff', .6 * n); c.save(); c.globalAlpha = n; for (let i = 0; i < 3; i++) { c.beginPath(); c.ellipse(ax, ay, 110, 36, i * Math.PI / 3 + T.t * .6, 0, TAU); c.lineWidth = 6; c.strokeStyle = '#9fe0ff'; c.stroke(); } circ(c, ax, ay, 16, '#ffcf3f', 3); c.restore(); label(c, 'NUCLEAR', ax, ay - 110, 44, '#9fe0ff', { glow: '#9fe0ff' }); }
  P('visitor2', { x: 1600, y: 1050, s: .9, t: T.t, pose: 'point', expr: n > 0 ? 'shock' : 'neutral', flip: true });
} });
S('T2.2', { cams: [[960, 540, 1.05]], sfx: [['ding', 'york', -16]],
  overlay: (c, T) => tag(c, 'New York', 'summer 1959', T.at('new', .5), T.at('summer', .5)),
  draw(c, T) {
  bg(c, '#f2b98a', '#ffe2b0'); circ(c, 1500, 330, 130, '#ffcf6a', 0); lightPool(c, 1500, 330, 400, '#fff2b0', .5);
  const R = rand(21); let x = -300; while (x < W + 300) { const w = 80 + R() * 140, h = 200 + R() * 460; box(c, x, 780 - h, w, h + 4, 3, '#4a4f5e', 0); if (R() > .8) { poly(c, [[x + w * .3, 780 - h], [x + w * .7, 780 - h], [x + w * .5, 780 - h - 120]], '#4a4f5e', 0); } x += w + 4; }
  FLOOR(c, 780, '#6b5b4b');
  box(c, 320, 820, 1280, 300, 0, '#8a6a52', 5); for (let i = 0; i < 6; i++) line(c, 320, 860 + i * 40, 1600, 860 + i * 40, 2, 'rgba(0,0,0,.15)');
  const p = pop(T, 'version', .5); arrive(c, p, 960, 600, () => { c.rotate(-.03); box(c, -300, -220, 600, 440, 6, '#f3efe6', 5); box(c, -270, -190, 540, 120, 4, '#b8322a', 0); label(c, 'SOVIET EXHIBITION', 0, -130, 48, '#fff', { stroke: false, maxW: 510 }); lunik(c, 0, 40, 380, { rot: -.12 }); label(c, 'SUMMER 1959', 0, 170, 40, INK, { stroke: false }); });
} });
S('T3.0', { cams: [[960, 520, 1.0], [1100, 560, 1.15]], sfx: [['crowdtalk', 0, -20, { len: 3 }], ['hit', 'sputnik', -14], ['sparkle', 'lunik', -10], ['cheer', 'lunik', -22]], draw(c, T) {
  bg(c, '#0e141f', '#18202c'); FLOOR(c, 860, '#161c26');
  const sp = T.at('sputnik', .4), lu = T.at('lunik', 1.0);
  // sweeping spotlights before the reveal
  [0, 1].forEach(i => { const ax = 960 + Math.sin(T.t * .9 + i * 2) * 500; cone(c, ax, -100, 80, 420, 1000, '#ffe9c0', .12 * (1 - sp)); });
  cone(c, 520, -100, 120, 460, 1000, '#ffe9c0', .3 * sp); cone(c, 1300, -100, 140, 900, 1000, '#ffe9c0', .3 * clamp(lu * 2));
  pedestal(c, 520, 860, 260, { rope: false }); if (sp > 0) { c.save(); c.translate(520, 640); c.scale(back(sp), back(sp)); sputnik(c, 0, 0, 70, T.t, { rot: -.4 }); c.restore(); label(c, 'SPUTNIK', 520, 900, 40, '#fff'); }
  if (lu > 0) { lunikExhibit(c, lerp(2400, 1300, easeOut(lu)), 860, 820, { t: T.t }); if (lu > .8) label(c, 'LUNIK', 1300, 940, 46, '#ffcf3f'); }
  folk(c, 960, 1110, 2200, 2, 1.35, T.t, 8, { dark: true, gasp: clamp(T.since('lunik') / .8) });
} });
S('T4.0', { cams: [[960, 560, 1.1]], sfx: [['pencil', ['wasnt', 'wasn'], -6]], draw(c, T) {
  SET.exhibitHall(c, T.t, {});
  lunikExhibit(c, 960, 760, 880, { t: T.t });
  sign(c, 960, 900, 420, 90, 'SATELLITE', { bg: '#f3efe6', size: 54, post: 0 });
  const x = T.at(['wasnt', 'wasn'], .4); if (x > 0) { line(c, 770, 900, lerp(770, 1150, x), 900 - 10 * x, 12, '#b8322a'); }
  const s = pop(T, 'satellite', .4); if (s > 0) hand(c, 'not a satellite', 1220, 820, 58, '#b8322a', { a: s, rot: -.06 });
} });
S('T4.1', { cams: [[960, 520, 1.0]], sfx: [['slide', 'upper', -10]], draw(c, T) {
  SET.grid(c, T.t, { title: 'MOON ROCKET', sub: 'SIDE VIEW' });
  const s = easeOut(T.at('upper', .8));
  // lower stages (blueprint outline), the Lunik as the top stage
  c.save(); c.strokeStyle = '#e8f1ff'; c.lineWidth = 3; c.strokeRect(160, 460, 640, 120); c.strokeRect(160, 380, 520, 60); c.strokeRect(160, 600, 520, 60); [440, 640].forEach(y => { c.beginPath(); c.moveTo(680, y - 20); c.lineTo(760, y); c.lineTo(680, y + 20); c.stroke(); }); c.strokeRect(800, 480, 160, 80); for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(160, 470 + i * 30); c.lineTo(110, 480 + i * 30); c.stroke(); } c.restore();
  label(c, 'LOWER STAGES', 480, 740, 30, '#a9c4e8', { stroke: false });
  const ux = 960 + 230 + s * 260; if (s > 0) lightPool(c, ux, 520, 420, '#ffcf3f', .35 * s);
  lunik(c, ux, 520, 460, { blueprint: true }); if (s > .3) label(c, 'UPPER STAGE', ux, 360, 52, '#ffcf3f', { glow: '#ffb04a' });
} });
S('T4.2', { cams: [[960, 560, 1.12]], sfx: [['sparkle', 'painted', -12], ['slide', 'freshly', -14]], draw(c, T) {
  SET.exhibitHall(c, T.t, { banner: false });
  const p = ease(clamp(T.since('freshly') / 1.2)), x0 = 960 - 520, rx = lerp(x0 - 40, 960 + 540, p);
  lunik(c, 960, 560, 1040, { paint: 'raw' });
  c.save(); c.beginPath(); c.rect(-400, 0, rx + 400, H); c.clip(); lunik(c, 960, 560, 1040, { glint: T.t * 2 }); c.restore();
  if (p > 0 && p < 1) { line(c, rx + 30, 560, rx + 160, 900, 10, '#8a5a3b'); box(c, rx - 20, 380, 50, 360, 25, '#b8322a', 4); }
  if (p >= 1) { for (let i = 0; i < 4; i++) { const k = (T.t * 1.2 + i / 4) % 1; c.save(); c.globalAlpha = 1 - k; poly(c, starPts(600 + i * 260, 420 - k * 30, 18), '#fff', 0); c.restore(); } }
} });
S('T4.3', { cams: [[1180, 500, 1.15]], push: .08, sfx: [['hammer', 'pedestal', -14], ['pop', 'three', -12], ['pop', 'small', -12], ['pop', 'windows', -12]], draw(c, T) {
  SET.exhibitHall(c, T.t, {});
  const pr = easeOut(T.at('pedestal', .7)), L = 900, X = 960, Y = lerp(760, 620, pr), h = L * .3;
  pedestal(c, 960, lerp(980, 800, pr) + 0, L * 1.05, { rope: true });
  lunik(c, X, Y, L, { glint: T.t });
  const cues = [T.cue('three'), T.cue('small'), T.cue('windows')];
  [[.27, -.18], [.33, .02], [.27, .22]].forEach(([wx, wy], i) => { const o = clamp((T.t - cues[i]) / .3), r = h * .1; if (o < 1) circ(c, X + L * wx, Y + h * wy, r * (1.02 - o), '#e7ecef', 0); if (o > 0 && o < 1) lightPool(c, X + L * wx, Y + h * wy, 60, '#fff', 1 - o); if (o > 0) label(c, String(i + 1), X + L * wx + r * 2, Y + h * wy - r, 30, '#ffcf3f'); });
} });
S('T4.4', { cams: [[1000, 560, 1.15]], draw(c, T) {
  SET.exhibitHall(c, T.t, { banner: false });
  lunik(c, 280, 560, 2000, { glow: 1, glint: T.t });
  const wx = 280 + 2000 * .33, wy = 560 + 600 * .02, tip = T.at('look', .5);
  P('visitor4', { x: wx + 150, y: 1010 - tip * 36, s: .62, t: T.t, pose: 'reach', flip: true, expr: tip > 0 ? 'grin' : 'neutral' });
  lightPool(c, wx + 110, 560 + 600 * .02 + 40, 160, '#9fd1ff', .5 * tip);
  P('visitor2', { x: 1650, y: 1060, s: .95, t: T.t, expr: 'grin', flip: true });
} });
S('T5.0', { cams: [[960, 560, 1.05]], sfx: [['stamp', 'mock', -6]], draw(c, T) {
  SET.exhibitHall(c, T.t, {});
  lunikExhibit(c, 960, 800, 760, { t: T.t });
  P('analyst', { x: 360, y: 1040, s: 1.0, t: T.t, pose: 'hips', expr: 'smug' }); P('analyst2', { x: 1560, y: 1040, s: 1.0, t: T.t, pose: 'hips', expr: 'smug', flip: true });
  const b = pop(T, 'assumed', .4); bubble(c, 560, 300, 260, 140, 400, 640, () => { bg(c, '#fff'); stamp(c, 560, 300, 'MOCK-UP', T.at('mock', .3), RED, { w: 380, h: 110, rot: -.1 }); }, 1, back(b));
} });
S('T6.0', { cams: [[960, 520, 1.0], [700, 700, 1.25]], sfx: [['party', 'parade', -22, { len: 2.5 }], ['whistle', 'spies', -16]], draw(c, T) {
  bg(c, '#a9cbe6', '#e9e0c8'); skyline(c, 760, '#9fb1bf', null, 12, 1); FLOOR(c, 760, '#bdb3a0');
  const fx = lerp(-900, 1500, clamp((T.t - 156.2) / 4.1));
  c.save(); c.translate(fx, 0); box(c, -480, 640, 960, 70, 10, '#b8322a', 5); for (let i = 0; i < 12; i++) poly(c, [[-480 + i * 80, 710], [-400 + i * 80, 710], [-440 + i * 80, 760]], i % 2 ? '#ffcf3f' : '#f3efe6', 3); [-360, 360].forEach(wx => { circ(c, wx, 740, 30, '#1f2226'); }); lunik(c, 0, 560, 820, { rot: -.08, glint: T.t }); c.restore();
  const w = T.since('spies') > 0;
  [['dean', 300, 'wave'], ['zambernardi', 620, 'hold'], ['dean', 940, 'wave'], ['zambernardi', 1260, 'hold']].forEach(([n, x, ps], i) => P(n, { x, y: 1110, s: 1.05, t: T.t, pose: w && ps === 'wave' ? 'wave' : 'holdHigh', expr: w ? 'grin' : 'focus', hatCol: ['#3a3a40', '#5a4a3a'][i % 2],
    item: (cc, h) => { if (w && ps === 'wave') return; const bx = (h[0][0] + h[1][0]) / 2, by = (h[0][1] + h[1][1]) / 2; circ(cc, bx - 22, by, 20, '#2b2f36', 3.5); circ(cc, bx + 22, by, 20, '#2b2f36', 3.5); } }));
  if (w) label(c, 'FOREIGN SPIES', 1500, 1000, 56, '#fff');
} });
})();
