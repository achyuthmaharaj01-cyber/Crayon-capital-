// ---------- scene builder b3: THE WEAK SPOT (W), THE TEAM (M), THE GRAB (G) ----------
// Every action lands on the spoken word (T.at / T.since / pop). Night shots end with GRADE.night; labels drawn after it stay legible.
// Truth: hedged claims carry tags (PER MAYSH, PER FINER'S REPORT, SILVETI'S ACCOUNT, DISPUTED). Real people are labelled crayon figures.
const chap3 = (k, n, title) => S(k, { card: (c, T) => chapterCard(c, T, n, title) });
const CHALK = '#eef2e6', CHALK_R = '#ff8a7a', CHALK_Y = '#ffe58a';

// ----- local helpers -----
function hedge(c, text, x, y, p = 1, o = {}) { // hedge tag: a pinned yellow slip, the same look as the dossier source tag
  if (p <= 0) return; const s = o.size || 26; c.save(); c.globalAlpha = clamp(p * 2); c.translate(x, y + (1 - easeOut(p)) * 18); c.rotate(o.rot ?? -.03);
  c.font = `700 ${s}px Kalam`; const w = c.measureText(text.toUpperCase()).width + 34; box(c, -w / 2, -s * .9, w, s * 1.8, 8, '#fff1c4', 3.5); circ(c, 0, -s * .9, 7, RED, 2.5);
  label(c, text, 0, 2, s, '#7a5a20', { stroke: false }); c.restore(); }
function chalkboard(c, x, y, w, h) { box(c, x - 14, y - 14, w + 28, h + 28, 10, '#7a5232'); box(c, x, y, w, h, 4, '#23332c', 3.5);
  c.save(); rr(c, x, y, w, h, 4); c.clip(); const R = rand(5); c.globalAlpha = .08; for (let i = 0; i < 40; i++) { const a = R() * w, b = R() * h; line(c, x + a, y + b, x + a + 60 + R() * 120, y + b + (R() - .5) * 20, 10, '#fff'); } c.restore();
  box(c, x + 40, y + h + 10, w - 80, 14, 4, '#6a4428', 3); box(c, x + w - 180, y + h + 2, 40, 10, 4, CHALK, 2); }
function chalkText(c, text, x, y, size, p = 1, col = CHALK, align = 'center') { // writes on left to right
  if (p <= 0) return; c.save(); c.font = `700 ${size}px Caveat`; c.textBaseline = 'middle'; c.textAlign = 'left'; const w = c.measureText(text).width; const x0 = align === 'center' ? x - w / 2 : x;
  c.beginPath(); c.rect(x0 - 10, y - size, (w + 20) * clamp(p), size * 2); c.clip(); c.fillStyle = col; c.globalAlpha = .93; c.fillText(text, x0, y); c.restore(); }
function chalkRing(c, x, y, rx, ry, p, col = CHALK_R, lw = 7, turns = 1) { if (p <= 0) return; c.save(); c.beginPath(); const N = 60 * turns; for (let i = 0; i <= N * clamp(p); i++) { const a = -2.2 + i / 60 * TAU, k = 1 + .05 * Math.sin(i * .37) + (i / 60) * .06; const px = x + Math.cos(a) * rx * k, py = y + Math.sin(a) * ry * k; i ? c.lineTo(px, py) : c.moveTo(px, py); } c.lineWidth = lw; c.lineCap = 'round'; c.strokeStyle = col; c.stroke(); c.restore(); }
function chalkX(c, x, y, s, p, col = CHALK_R, lw = 12) { const a = clamp(p * 2), b = clamp(p * 2 - 1); if (a > 0) line(c, x - s, y - s, x - s + 2 * s * a, y - s + 2 * s * a, lw, col); if (b > 0) line(c, x + s, y - s, x + s - 2 * s * b, y - s + 2 * s * b, lw, col); }
function redRing(c, x, y, rx, ry, p) { chalkRing(c, x, y, rx, ry, p, '#d9342b', 9); }
function truckTop(c, x, y, s = 1, rot = 0, o = {}) { // top-down truck token: cab right
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); reg(c, -90, -36, 70, 36); box(c, -92, -34, 160, 68, 10, 'rgba(0,0,0,.25)', 0);
  box(c, -88, -30, 112, 60, 6, o.crate === false ? '#7a5a3a' : '#c9975a'); if (o.crate !== false) { for (let i = 1; i < 5; i++) line(c, -88 + i * 22, -30, -88 + i * 22, 30, 2.5, 'rgba(60,35,10,.5)'); if (o.canvas) box(c, -92, -34, 120, 68, 8, '#6f7458'); }
  box(c, 28, -26, 40, 52, [6, 14, 14, 6], o.col || '#4f6d5a'); box(c, 40, -20, 16, 40, 4, '#a9cde0', 2.5);
  if (o.brake > 0) { c.save(); c.globalCompositeOperation = 'screen'; lightPool(c, -92, -24, 40 * (1 + o.brake), '#ff4030', .9 * o.brake); lightPool(c, -92, 24, 40 * (1 + o.brake), '#ff4030', .9 * o.brake); c.restore(); }
  c.restore(); }
function corkBoard(c, t) { bg(c, '#9c7548', '#87613a'); const R = rand(31); c.save(); c.globalAlpha = .22; for (let i = 0; i < 900; i++) { circ(c, R() * (W + 800) - 400, R() * (H + 600) - 300, 1.5 + R() * 2.5, R() > .5 ? '#5a3a1a' : '#d8b07a', 0); } c.restore();
  box(c, -400, -300, W + 800, 30 + 300, 0, '#5a3a20', 0); box(c, -400, H - 30, W + 800, 330, 0, '#5a3a20', 0); lightPool(c, 900, 420, 1000, '#ffd890', .35); }
function pin(c, x, y, col = RED) { circ(c, x, y, 10, col, 3); circ(c, x - 3, y - 3, 3, 'rgba(255,255,255,.7)', 0); }
function indexCard(c, x, y, w, h, rot = 0, col = '#f8f4e6') { c.save(); c.translate(x, y); c.rotate(rot); box(c, -w / 2 + 6, -h / 2 + 8, w, h, 4, 'rgba(0,0,0,.25)', 0); box(c, -w / 2, -h / 2, w, h, 4, col, 3.5); line(c, -w / 2 + 16, -h / 2 + 40, w / 2 - 16, -h / 2 + 40, 2, '#d9342b'); c.restore(); }
const PLAN = ['LAST TRUCK OUT', 'TAKE IT EN ROUTE', 'HIDE IT OVERNIGHT', 'APART, SHOOT, REBUILD', 'DELIVER BY MORNING'];
function planBoard(c, T, step, work) { // the heist planning board: steps down the right, big working card centre, deadline clock top-left
  corkBoard(c, T.t);
  indexCard(c, 250, 130, 360, 120, -.03, '#fff8d0'); label(c, 'THE PLAN', 250, 140, 54, INK, { stroke: false }); pin(c, 250, 78);
  nightClock(c, 250, 380, 84, 7, 0, { label: false }); label(c, 'CHECKER BACK', 250, 500, 26, '#fff'); label(c, '7 A.M.', 250, 540, 40, CHALK_Y);
  // steps
  PLAN.forEach((s, i) => { const y = 150 + i * 176, on = i + 1 === step, done = i + 1 < step, fut = i + 1 > step && !T.allSteps; const x = 1690 + (on ? -16 : 0);
    if (fut) { indexCard(c, x, y, 330, 140, (i % 2 ? .02 : -.02), '#cdbf9d'); label(c, String(i + 1), x, y + 10, 60, 'rgba(60,40,20,.35)', { stroke: false }); pin(c, x, y - 64, '#3a7bd5'); return; }
    indexCard(c, x, y, 330, 140, (i % 2 ? .02 : -.02), on ? '#fff3a8' : '#f8f4e6'); circ(c, x - 128, y - 42, 24, on ? RED : '#8a8f98', 3); label(c, String(i + 1), x - 128, y - 40, 30, '#fff', { stroke: false });
    label(c, s, x + 14, y + 16, 34, INK, { stroke: false, maxW: 290 }); pin(c, x, y - 64, on ? RED : '#3a7bd5');
    if (on) { c.save(); c.globalCompositeOperation = 'screen'; lightPool(c, x, y, 260, '#fff1a0', .35); c.restore(); } });
  // red string from the current step to the work card
  if (step) { c.save(); c.lineWidth = 3.5; c.strokeStyle = '#d9342b'; c.beginPath(); c.moveTo(1690, 150 + (step - 1) * 176 - 64); c.quadraticCurveTo(1450, 300 + step * 40, 1380, 210); c.stroke(); c.restore(); }
  // work card
  box(c, 446, 196, 1080, 720, 6, 'rgba(0,0,0,.28)', 0); box(c, 430, 180, 1080, 720, 6, '#f6f1e2', 4); pin(c, 970, 196); pin(c, 1380, 210);
  c.save(); rr(c, 430, 180, 1080, 720, 6); c.clip(); c.lineWidth = 1.3; c.strokeStyle = 'rgba(80,120,170,.2)'; for (let x = 430; x < 1510; x += 40) { c.beginPath(); c.moveTo(x, 180); c.lineTo(x, 900); c.stroke(); } for (let y = 180; y < 900; y += 40) { c.beginPath(); c.moveTo(430, y); c.lineTo(1510, y); c.stroke(); }
  work && work(); c.restore();
  if (step) label(c, 'STEP ' + step, 560, 236, 40, RED, { stroke: false });
}
function fenceIcon(c, x, y, w, h, p = 1) { if (p <= 0) return; c.save(); c.globalAlpha = clamp(p * 2); for (let i = 0; i < w / 30; i++) { const hh = h * easeOut(clamp(p * 1.6 - i * .02)); box(c, x + i * 30, y - hh, 30, hh, 2, i % 2 ? '#7a5a3a' : '#6d5034', 2.5); } line(c, x, y - h * .3, x + w, y - h * .3, 6, '#5a412a'); line(c, x, y - h * .75, x + w, y - h * .75, 6, '#5a412a'); c.restore(); }
function sunIcon(c, x, y, r, p = 1) { if (p <= 0) return; c.save(); c.globalAlpha = clamp(p * 2); for (let i = 0; i < 10; i++) { const a = i * TAU / 10; line(c, x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3, x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75, 6, '#e0a020'); } circ(c, x, y, r, '#ffcf3f', 4); c.restore(); }
function moonIcon(c, x, y, r) { circ(c, x, y, r, '#f3ecc8', 4); c.save(); c.beginPath(); c.arc(x, y, r - 2, 0, TAU); c.clip(); circ(c, x + r * .55, y - r * .25, r * .9, '#f6f1e2', 0); c.restore(); }
function airliner(c, x, y, s = 1, t = 0) { // 1950s four-prop airliner, side view, nose left
  c.save(); c.translate(x, y); c.scale(s, s); reg(c, -520, -260, 520, 40);
  poly(c, [[380, -40], [500, -210], [540, -210], [500, -40]], '#d6dbe0'); line(c, 470, -150, 520, -150, 4, '#b8322a');
  c.beginPath(); c.moveTo(-480, -60); c.quadraticCurveTo(-510, -110, -430, -126); c.lineTo(400, -130); c.quadraticCurveTo(470, -120, 520, -84); c.lineTo(520, -70); c.quadraticCurveTo(470, -40, 380, -40); c.lineTo(-400, -30); c.quadraticCurveTo(-470, -30, -480, -60); c.closePath(); fs(c, '#e8ecef');
  box(c, -470, -88, 980, 14, 4, '#1f4f8a', 0); for (let i = 0; i < 14; i++) box(c, -360 + i * 52, -116, 24, 22, 8, '#3a5470', 2.5);
  c.beginPath(); c.moveTo(-470, -96); c.quadraticCurveTo(-480, -118, -440, -120); c.lineTo(-430, -100); c.closePath(); fs(c, '#3a5470', 3);
  poly(c, [[-160, -60], [180, -60], [260, -20], [-200, -14]], '#c9ced4'); [-120, -10, 100, 200].forEach(ex => { box(c, ex - 40, -74, 80, 30, 12, '#aab2ba'); const a = t * 40; line(c, ex - 44, -59 + Math.sin(a) * 40, ex - 44, -59 - Math.sin(a) * 40, 5, 'rgba(30,30,30,.6)'); });
  [-320, 220].forEach(wx => { line(c, wx, -34, wx, 10, 8); circ(c, wx, 16, 20, '#1f2226'); }); c.restore(); }
function bicycle(c, x, y, s = 1, t = 0) { c.save(); c.translate(x, y); c.scale(s, s); reg(c, -100, -170, 100, 0); [-64, 64].forEach(wx => { circ(c, wx, -42, 42, null, 6); for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 + t * 8; line(c, wx, -42, wx + Math.cos(a) * 40, -42 + Math.sin(a) * 40, 2, '#555'); } });
  poly(c, [[-64, -42], [-10, -42], [40, -110], [-30, -110]], null, 6); line(c, -10, -42, -40, -130, 6); line(c, 40, -110, 64, -42, 6); line(c, 40, -110, 30, -140, 6); line(c, 20, -142, 50, -142, 6); box(c, -64, -140, 48, 12, 4, '#2b2f36', 3); c.restore(); }
function engineBay(c, x, y, s = 1) { // engine cutaway: block, head, distributor, the small part (returns the part's world pos)
  c.save(); c.translate(x, y); c.scale(s, s); reg(c, -420, -300, 420, 260);
  box(c, -420, -300, 840, 560, 24, '#2c3238'); box(c, -360, -120, 620, 300, 16, '#5a6670'); for (let i = 0; i < 6; i++) circ(c, -290 + i * 100, -40, 34, '#3d474f', 3.5);
  box(c, -380, -200, 660, 90, 12, '#6d7a84'); for (let i = 0; i < 6; i++) { line(c, -320 + i * 100, -200, -320 + i * 100, -250, 8, '#1b1b1b'); circ(c, -320 + i * 100, -254, 8, '#c9a14a', 3); }
  box(c, 300, -170, 90, 160, 12, '#8a3a2a'); circ(c, 345, -190, 30, '#2b2f36', 3.5); // distributor
  box(c, -400, 200, 200, 40, 8, '#1b1f24'); line(c, 280, 60, 380, 200, 12, '#1b1b1b'); c.restore(); return [x + 345 * s, y - 120 * s]; }
function torchMan(c, x, y, s, t, on, flip) { // kolomyakov with a torch; beam aims toward +x (or -x when flipped)
  const hd = P('kolomyakov', { x, y, s, t, expr: 'stern', pose: 'hold', flip, hands: [[-40, -150], [70, -170]] }); return hd; }

// ======================= THE WEAK SPOT =======================
chap3('W1.0', 5, 'The Weak Spot');
S('W1.1', { focus: [960, 560, 1.15], shakes: [['impossible']], sfx: [['door', 0, -12], ['stamp', 'impossible', -6]], draw(c, T) {
  NIGHT_SKY(c, T.t, '#060d1e', '#132842', 60); skyline(c, 760, '#0c1828', 'rgba(255,200,110,.35)', 7, .9);
  FLOOR(c, 860, '#24282e');
  hallFacade(c, 960, 860, 1300, { night: true, banner: 'SOVIET EXHIBITION' });
  const sw = Math.sin(T.lt * 1.4) * .35; cone(c, 1700, 900, 30, 520, 900, '#e8f1ff', .16); c.save(); c.translate(1700, 900); c.rotate(-2.1 + sw); cone(c, 0, 0, 30, 380, 1100, '#e8f1ff', .16); c.restore();
  const L = [[960, 700, 500, '#ffd27a', .25]];
  P('guard', { x: 520, y: 900, s: .62, t: T.t, expr: 'stern', pose: 'handsBack' }); P('guard', { x: 1400, y: 900, s: .62, t: T.t, expr: 'stern', pose: 'handsBack', flip: true });
  // padlock on the doors
  const lk = clamp(T.lt / .35); box(c, 920, 700, 80, 70, 10, '#c9a14a', 4); c.save(); c.beginPath(); c.arc(960, 700 - 14 * (1 - lk), 28, Math.PI, 0); c.lineWidth = 12; c.strokeStyle = INK; c.stroke(); c.lineWidth = 6; c.strokeStyle = '#9aa1a8'; c.stroke(); c.restore(); circ(c, 960, 732, 8, INK, 0);
  GRADE.night(c, L, .35);
  chalkX(c, 960, 560, 300, T.at('impossible', .35), '#d9342b', 26);
} });
S('W2.0', { cams: [[700, 520, 1.25], [1160, 520, 1.25]], sfx: [['creak', 'stopped', -14], ['pencil', 'after', -14, { len: 1.2 }]], draw(c, T) {
  SET.embassyOffice(c, T.t, { night: true, noDesk: true });
  // the exhibition photo pinned left, the blank chalkboard right
  photoPrint(c, 420, 400, 300, 200, -.04, () => { bg(c, '#ddd', '#bbb'); hallFacade(c, 0, 100, 300, { banner: 'SOVIET EXHIBITION' }); }, { caption: 'THE HALL', clip: true });
  chalkboard(c, 1180, 250, 560, 380);
  const turn = T.since('stopped'), face = T.since('after');
  // chair + scott
  box(c, 790, 760, 160, 20, 6, '#3a2a1e'); line(c, 870, 780, 870, 860, 10); line(c, 820, 860, 920, 860, 8);
  P('scott', { x: 870, y: 860, s: .95, t: T.t, legs: 'sit', expr: face > 0 ? 'focus' : (turn > 0 ? 'neutral' : 'worried'), flip: face <= 0, pose: face > 0 ? 'point' : 'idle', look: face > 0 ? 1 : (turn > 0 ? 0 : -1) });
  chalkText(c, 'AFTER IT CLOSES?', 1460, 360, 66, T.at('after', 1.0));
  chalkText(c, 'HALL  →  ?', 1460, 470, 56, T.at('closed', .8), CHALK_Y);
  GRADE.warm(c, .15);
} });
S('W3.0', { focus: [1240, 540, 1.15], sfx: [['pencil', 'weak', -10, { len: 1 }], ['ding', 'line', -14]], draw(c, T) {
  SET.paper(c, T.t);
  label(c, 'THE LINE', 960, 140, 56, INK, { stroke: false });
  // HALL -> dotted road -> RAIL YARD
  hallFacade(c, 330, 640, 380, { banner: 'EXHIBITION' }); label(c, 'HALL', 330, 700, 40, INK, { stroke: false });
  c.save(); c.setLineDash([22, 16]); line(c, 540, 600, 1440, 600, 8, '#5a6a80'); c.restore();
  for (let i = 0; i < 3; i++) truckTop(c, 640 + ((T.lt * 120 + i * 300) % 760), 600, .9);
  freightTrain(c, 1700, 660, .38, { cars: ['box', 'crate'], t: T.t, smoke: false }); label(c, 'RAIL YARD', 1600, 720, 40, INK, { stroke: false });
  const m = easeOut(T.at('found', 1.0)); magnifier(c, lerp(760, 1560, m), 560, 130, () => { SET.paper(c, T.t); freightTrain(c, 1700, 660, .38, { cars: ['box', 'crate'], t: T.t, smoke: false }); P('checker', { x: 1480, y: 650, s: .32, t: T.t, expr: 'neutral', pose: 'clipboard' }); });
  redRing(c, 1560, 600, 250, 190, T.at('weak', .8));
  if (T.since('spot') > 0) label(c, 'WEAK SPOT', 1560, 340, 60, '#d9342b', { stroke: false });
  if (T.since('line') > -.1) label(c, 'END OF THE LINE', 1560, 860, 40, INK, { stroke: false });
} });
S('W4.0', { cams: [[700, 520, 1.3], [1250, 520, 1.3]], sfx: [['paper', 'crated', -12], ['truck', 'trucks', -16, { len: 1.6 }], ['train2', 'rail', -18, { len: 1.6 }]], draw(c, T) {
  SET.paper(c, T.t);
  const st = [['EXHIBIT', 'ended', 300], ['CRATED', 'crated', 740], ['TRUCKED', 'trucks', 1180], ['RAIL YARD', 'rail', 1620]];
  st.forEach(([lab, w, x], i) => { const on = T.since(w) > 0, p = T.at(w, .5);
    box(c, x - 180, 330, 360, 400, 18, on ? '#fff8e1' : '#ece4cc', 4);
    if (i < 3) arrow(c, x + 196, 530, x + 260, 530, on ? '#d9342b' : '#b9ae94', 30);
    c.save(); c.globalAlpha = on ? 1 : .35;
    if (i === 0) lunikExhibit(c, x, 640, 300, {});
    if (i === 1) crate(c, x, 620, 300, {});
    if (i === 2) truck59(c, x + 40, 640, .38, { crate: true });
    if (i === 3) freightTrain(c, x + 140, 620, .3, { cars: ['crate'], t: T.t, smoke: false });
    c.restore(); label(c, lab, x, 780, 40, on ? '#d9342b' : '#9a917c', { stroke: false });
    if (p > 0 && p < 1) { c.save(); c.globalAlpha = 1 - p; lightPool(c, x, 530, 260, '#ffe16a', .6); c.restore(); } });
  label(c, 'WHEN THE SHOW ENDS', 960, 200, 52, INK, { stroke: false });
} });
S('W5.0', { cams: [[1000, 600, 1.2], [1120, 640, 1.6]], sfx: [['pencil', 'log', -8, { len: .8 }], ['truck', 'arrived', -20, { len: 1.5 }]], draw(c, T) {
  const L = SET.railYard(c, T.t, {});
  // arrived crates stacked behind him
  [[640, 760, 260], [930, 760, 220], [780, 690, 220]].forEach(([x, y, w]) => crate(c, x, y, w, { stencil: 'CCCP' }));
  box(c, 1000, 780, 260, 22, 6, '#6d4c41'); line(c, 1020, 802, 1020, 880, 8); line(c, 1240, 802, 1240, 880, 8);
  // ledger
  box(c, 1060, 750, 150, 30, 4, '#f3eedb', 3); line(c, 1135, 750, 1135, 780, 2, '#9a917c');
  P('checker', { x: 1300, y: 890, s: .95, t: T.t, expr: T.since('log') > 0 ? 'focus' : 'neutral', pose: 'point', flip: true, hands: [[-60, -120], [-180, -150]] });
  const tk = T.at('log', .4); if (tk > 0) { c.save(); c.lineWidth = 6; c.strokeStyle = '#1d6fb8'; c.lineCap = 'round'; c.beginPath(); c.moveTo(1090, 764); c.lineTo(1090 + 10 * clamp(tk * 2), 774); c.lineTo(1090 + 10 + 22 * clamp(tk * 2 - 1), 754); c.stroke(); c.restore(); }
  GRADE.night(c, [...L, [1130, 700, 360, '#ffd27a', .5]], .3);
  label(c, 'ONE CHECKER', 1140, 300, 50, '#fff');
  hedge(c, 'LOGS EACH CRATE', 1140, 380, T.at('log', .5));
} });
S('W6.0', { cams: [[1100, 560, 1.2], [760, 520, 1.1]], sfx: [['static', 'no', -16, { len: 1.4 }], ['hit', 'colleagues', -18]], draw(c, T) {
  const L = SET.railYard(c, T.t, { noTrain: true });
  // far away: the hall on the horizon with its guards
  c.save(); c.globalAlpha = .9; hallFacade(c, 380, 640, 360, { night: true, banner: 'EXHIBITION' }); c.restore();
  // telephone pole with the cut wire
  line(c, 1240, 900, 1240, 330, 16, '#5a412a'); line(c, 1180, 360, 1300, 360, 12, '#5a412a'); circ(c, 1196, 350, 8, '#9aa1a8', 3); circ(c, 1284, 350, 8, '#9aa1a8', 3);
  c.save(); c.lineWidth = 4; c.strokeStyle = '#1b1b1b'; c.beginPath(); c.moveTo(1196, 352); c.quadraticCurveTo(1160, 420 + Math.sin(T.t * 2) * 6, 1150, 520 + Math.sin(T.t * 2) * 8); c.stroke(); c.restore();
  c.save(); c.setLineDash([18, 16]); c.lineWidth = 5; c.strokeStyle = 'rgba(255,255,255,.55)'; c.beginPath(); c.moveTo(560, 520); c.quadraticCurveTo(860, 360, 1150, 470); c.stroke(); c.restore();
  P('checker', { x: 1420, y: 900, s: .9, t: T.t, expr: T.since('no') > 0 ? 'worried' : 'neutral', pose: 'idle', flip: true });
  GRADE.night(c, L, .3);
  chalkX(c, 860, 410, 60, T.at('no', .4), '#ff5a4a', 14);
  if (T.since('no') > 0) label(c, 'NO PHONE TO THE HALL', 900, 220, 54, '#fff');
  hedge(c, 'COLLEAGUES BACK AT THE HALL', 380, 360, T.at('colleagues', .5));
} });
S('W7.0', { cams: [[900, 520, 1.25], [1300, 560, 1.3]], sfx: [['paper', 'schedule', -12]], draw(c, T) {
  SET.desk(c, T.t, { lx: 800, ly: 520 });
  // the ledger, open
  box(c, 300, 200, 1100, 680, 10, '#7a2a24'); box(c, 330, 220, 520, 640, 4, '#f6f1e2', 3); box(c, 850, 220, 520, 640, 4, '#f3eedb', 3); line(c, 850, 220, 850, 860, 4);
  [['CRATE', 400], ['ARRIVED', 640], ['EXPECTED', 1080]].forEach(([h, x]) => label(c, h, x, 270, 34, '#7a2a24', { stroke: false }));
  for (let i = 0; i < 9; i++) { const y = 330 + i * 58; line(c, 340, y + 24, 1360, y + 24, 2, 'rgba(80,120,170,.35)'); if (i < 5) { label(c, '#' + (i + 1), 400, y, 30, INK, { stroke: false, raw: true }); c.save(); c.strokeStyle = '#1d6fb8'; c.lineWidth = 5; c.beginPath(); c.moveTo(620, y); c.lineTo(632, y + 10); c.lineTo(660, y - 12); c.stroke(); c.restore(); } }
  const e = T.at('schedule', .6); if (e > 0) { c.save(); c.globalAlpha = .45 * e; c.fillStyle = '#ffe16a'; c.fillRect(870, 300, 480, 560); c.restore(); }
  for (let i = 0; i < 5; i++) if (T.since('when') > i * .15) label(c, '?', 1080, 330 + i * 58, 40, '#d9342b', { stroke: false });
  if (T.sub === 1 || T.since('when') > 0) { P('checker', { x: 1600, y: 1020, s: .8, t: T.t, expr: 'neutral', pose: 'shrug', flip: true }); }
  if (e > 0) label(c, 'NO SCHEDULE', 1100, 160, 50, '#fff');
} });
S('W8.0', { focus: [960, 500, 1.15], sfx: [['pencil', 'train', -12, { len: 1 }], ['stamp', 'ruled', -8]], shakes: [['ruled']], draw(c, T) {
  SET.embassyOffice(c, T.t, { night: true, noDesk: true }); chalkboard(c, 360, 160, 1200, 620);
  chalkText(c, 'OPTION 1: THE TRAIN', 960, 240, 74, T.at('intercepting', .9));
  c.save(); c.globalAlpha = .9; c.strokeStyle = CHALK; c.lineWidth = 6; const p = T.at('train', .9);
  c.beginPath(); c.rect(560, 420, 300 * clamp(p * 3), 180); c.rect(900, 420, 300 * clamp(p * 3 - 1), 180); c.rect(1240, 400, 160 * clamp(p * 3 - 2), 200); c.stroke();
  [620, 800, 960, 1140, 1300, 1360].forEach((x, i) => { if (p > i / 6) { c.beginPath(); c.arc(x, 625, 24, 0, TAU); c.stroke(); } }); line(c, 520, 652, 1440, 652, 6, CHALK); c.restore();
  chalkX(c, 980, 510, 300, T.at('ruled', .45), CHALK_R, 18);
  if (T.since('ruled') > .2) chalkText(c, 'RULED OUT', 980, 730, 60, T.at('ruled', .5, ) , CHALK_R);
  GRADE.warm(c, .12);
} });
S('W8.1', { focus: [960, 520, 1.25], sfx: [['train2', 'freight', -18, { len: 1.2 }]], draw(c, T) {
  SET.embassyOffice(c, T.t, { night: true, noDesk: true }); chalkboard(c, 360, 160, 1200, 620);
  // rails with a switch and a stuck freight car
  c.save(); c.strokeStyle = CHALK; c.lineWidth = 6; c.globalAlpha = .9; line(c, 420, 600, 1500, 600, 6, CHALK); line(c, 420, 640, 1500, 640, 6, CHALK);
  c.beginPath(); c.moveTo(1000, 600); c.quadraticCurveTo(1200, 560, 1500, 420); c.stroke(); c.beginPath(); c.moveTo(1000, 640); c.quadraticCurveTo(1220, 600, 1500, 460); c.stroke();
  const shake = T.since('divert') > 0 ? Math.sin(T.t * 30) * 3 * clamp(1 - T.since('divert')) : 0;
  c.beginPath(); c.rect(640 + shake, 470, 280, 120); c.stroke(); [690, 870].forEach(x => { c.beginPath(); c.arc(x + shake, 610, 22, 0, TAU); c.stroke(); }); c.restore();
  label(c, 'FREIGHT CAR', 780, 430, 40, CHALK, { stroke: false });
  const q = T.at('quietly', .5); if (q > 0) { c.save(); c.globalAlpha = q; c.font = '700 160px Caveat'; c.fillStyle = CHALK_Y; c.textAlign = 'center'; c.fillText('?', 1080, 520); c.restore(); }
  chalkText(c, 'DIVERT IT QUIETLY?', 960, 260, 70, T.at('divert', .8));
  chalkText(c, 'NO GOOD WAY', 960, 740, 56, T.at('freight', .6), CHALK_R);
  GRADE.warm(c, .12);
} });
S('W9.0', { focus: [960, 470, 1.25], shakes: [['truck']], sfx: [['hit', 'truck', -4], ['pencil', 'truck', -12, { len: .9 }]], draw(c, T) {
  SET.embassyOffice(c, T.t, { night: true, noDesk: true }); chalkboard(c, 360, 160, 1200, 620);
  c.save(); c.globalAlpha = .5; chalkText(c, 'OPTION 1: TRAIN', 620, 250, 50); chalkX(c, 620, 250, 160, 1, CHALK_R, 8); c.restore();
  chalkText(c, 'OPTION 2:', 1000, 330, 60, 1, CHALK);
  chalkText(c, 'THE TRUCK', 1000, 480, 130, T.at('left', .6), '#fff');
  chalkRing(c, 1000, 480, 360, 110, T.at('truck', .7), '#ff6a5a', 9, 2);
  c.save(); c.translate(1000, 650); c.scale(.36, .36); c.globalAlpha = clamp(T.since('truck') * 2); truck59(c, 100, 60, 1, { crate: true }); c.restore();
  GRADE.warm(c, .12);
} });
S('W10.0', { cams: [[880, 520, 1.25], [1000, 460, 1.45]], shakes: [['impossible']], sfx: [['pencil', 'simple', -12, { len: 1 }], ['hammer', 'impossible', -8]], draw(c, T) {
  SET.embassyOffice(c, T.t, { night: true, noDesk: true }); chalkboard(c, 360, 160, 1200, 620);
  chalkText(c, 'THE PLAN', 960, 240, 70, 1);
  chalkText(c, 'SIMPLE', 1200, 420, 90, T.at('simple', .6), '#fff');
  const snap = T.since('impossible');
  chalkText(c, 'TO PULL OFF?', 1200, 560, 70, T.at('nearly', .9), CHALK_R);
  const hand = snap > 0 ? [[-70, -120], [140, -250]] : [[-70, -120], [150, -330]];
  const h = P('scott', { x: 760, y: 900, s: 1.05, t: T.t, expr: snap > 0 ? 'shock' : (T.since('simple') > 0 ? 'smug' : 'neutral'), pose: 'point', hands: hand });
  // the chalk stick (snaps in two on 'impossible')
  const hx = 760 + 150 * 1.05, hy = 900 - (snap > 0 ? 250 : 330) * 1.05;
  if (snap <= 0) { c.save(); c.translate(hx, hy); c.rotate(-.6); box(c, 0, -8, 46, 16, 4, CHALK, 2.5); c.restore(); }
  else { const k = Math.min(snap, .9); [[-1, -.8], [1, 1.4]].forEach(([d, r]) => { c.save(); c.translate(hx + d * 60 * k, hy - 120 * k + 900 * k * k); c.rotate(r * k * 6); box(c, -12, -7, 24, 14, 4, CHALK, 2.5); c.restore(); }); }
  if (snap > 0) label(c, 'NEARLY IMPOSSIBLE', 1200, 690, 54, '#ffd36e', { stroke: false });
  GRADE.warm(c, .12);
} });
S('W11.0', { focus: [960, 540, 1.15], sfx: [['truck', 'last', -16, { len: 1.4 }], ['ding', 'last', -14]], draw(c, T) {
  planBoard(c, T, 1, () => {
    label(c, 'EXHIBITION GROUNDS', 640, 330, 34, INK, { stroke: false }); box(c, 470, 380, 240, 360, 10, null, 4); label(c, 'GATE', 590, 560, 30, '#9a917c', { stroke: false });
    // the queue of trucks leaving; the crate truck slides to the back on 'last'
    const p = easeOut(T.at('last', .9)), go = T.lt * 140;
    for (let i = 0; i < 5; i++) { const x = 820 + i * 140 + go - (i < 4 ? 0 : 0); if (x < 1520) truckTop(c, x, 560, .9, 0, { crate: false, col: '#6a7a8a' }); }
    const lx = lerp(1080, 760, p), ly = 560 + Math.sin(p * Math.PI) * 120; truckTop(c, lx, ly, 1.05, 0, { col: '#4f6d5a' });
    if (p > .5) { label(c, 'LAST OUT', lx, ly - 80, 40, RED, { stroke: false }); }
    hedge(c, 'THE LUNIK', lx, ly + 90, clamp(T.lt * 2), { size: 22 });
  });
} });
S('W11.1', { focus: [960, 540, 1.15], sfx: [['whoosh2', 'take', -12]], draw(c, T) {
  planBoard(c, T, 2, () => {
    label(c, 'HALL', 560, 600, 40, INK, { stroke: false }); label(c, 'RAIL YARD', 1380, 600, 40, INK, { stroke: false });
    c.save(); c.setLineDash([18, 14]); line(c, 620, 560, 1300, 560, 7, '#5a6a80'); c.restore();
    const g = easeOut(T.at('take', .8)), tx = lerp(720, 960, clamp(T.lt / .8));
    const px = lerp(tx, 980, g), py = lerp(560, 780, g); truckTop(c, px, py, 1, lerp(0, .7, g), { col: '#4f6d5a' });
    if (g > 0) { c.save(); c.lineWidth = 9; c.strokeStyle = RED; c.lineCap = 'round'; c.beginPath(); c.moveTo(980, 400); c.quadraticCurveTo(1100, 560, 980, 560 + 220 * g); c.stroke(); poly(c, [[960, 560 + 220 * g], [1000, 560 + 220 * g], [980, 600 + 220 * g]], RED, 0); c.restore(); }
    if (g > .6) label(c, 'OFF THE ROUTE', 980, 860, 40, RED, { stroke: false });
    label(c, 'ON THE WAY', 960, 480, 32, '#9a917c', { stroke: false });
  });
} });
S('W12.0', { cams: [[960, 540, 1.15], [960, 540, 1.15]], sfx: [['creak', 'hide', -14], ['whoosh1', 'apart', -14]], draw(c, T) {
  if (T.sub === 0) planBoard(c, T, 3, () => {
    const m = easeOut(T.at('overnight', 1.2)); c.save(); c.globalAlpha = .9; bg(c, lerp(0, 1, m) > .5 ? '#1b2a4a' : '#f6f1e2', '#f6f1e2'); c.restore();
    c.save(); c.globalAlpha = m * .85; c.fillStyle = '#1b2a4a'; c.fillRect(430, 180, 1080, 720); c.restore();
    moonIcon(c, 1300, lerp(760, 340, m), 56);
    truckTop(c, 900, 640, 1.3, 0, { col: '#4f6d5a' }); fenceIcon(c, 620, 780, 600, 260, T.at('hide', .8));
    label(c, 'HIDE IT', 920, 420, 50, m > .5 ? '#fff' : INK, { stroke: false }); if (m > .3) label(c, 'OVERNIGHT', 920, 840, 40, '#ffe58a', { stroke: false });
  });
  else planBoard(c, T, 4, () => {
    const a = easeOut(T.at('apart', .9)); lunik(c, 960, 560, 820, { blueprint: true, capOff: a, sphereOut: a * .8, labels: false });
    label(c, 'TAKE IT APART', 960, 820, 44, INK, { stroke: false });
  });
} });
S('W12.1', { focus: [960, 540, 1.15], sfx: [['camflash2', 'photograph', -8], ['camshutter', 'everything', -10], ['wrench', 'together', -14, { len: 1 }]], draw(c, T) {
  planBoard(c, T, 4, () => {
    const back = easeOut(T.at('together', .9)); const a = 1 - back; lunik(c, 960, 560, 820, { blueprint: true, capOff: a, sphereOut: a * .8, labels: false });
    const f = T.since('photograph'); if (f > 0 && f < .6) flashBurst(c, 960, 520, 300, f / .6); const f2 = T.since('everything') - .3; if (f2 > 0 && f2 < .6) flashBurst(c, 1220, 500, 260, f2 / .6);
    label(c, back > .5 ? 'PUT IT BACK' : 'PHOTOGRAPH EVERYTHING', 960, 820, 44, INK, { stroke: false });
  });
  const f = T.since('photograph'); if (f > 0 && f < .5) GRADE.flash(c, 960, 540, f / .5);
} });
S('W12.2', { focus: [960, 540, 1.0], sfx: [['ding', 'morning', -12]], draw(c, T) {
  T.allSteps = true;
  planBoard(c, T, 5, () => {
    label(c, 'RAIL YARD', 1250, 330, 40, INK, { stroke: false }); freightTrain(c, 1420, 640, .32, { cars: ['box', 'crate'], t: T.t, smoke: false });
    const d = easeOut(T.at('deliver', 1.0, -1)); truckTop(c, lerp(560, 1060, clamp(T.lt / .9)), 720, 1.1, 0, { col: '#4f6d5a' });
    sunIcon(c, 640, 360, 56, T.at('morning', .6)); if (T.since('morning') > 0) label(c, 'BY 7 A.M.', 640, 480, 44, RED, { stroke: false });
    P('checker', { x: 1240, y: 860, s: .42, t: T.t, expr: 'neutral', pose: 'clipboard', flip: true });
  });
} });

// ======================= THE TEAM =======================
chap3('M1.0', 6, 'The Team');
S('M1.1', { focus: [900, 600, 1.15], sfx: [['whoosh3', 0, -16], ['steps', 'four', -18, { len: 1.6 }]], draw(c, T) {
  bg(c, '#24365e', '#e08a52'); lightPool(c, 1500, 620, 600, '#ffb070', .6); circ(c, 1500, 660, 70, '#ffcf8a', 0);
  skyline(c, 700, '#2c3048', 'rgba(255,200,110,.5)', 4, .6); FLOOR(c, 700, '#4a4a50'); line(c, -400, 860, W + 400, 860, 8, '#e8e2d0');
  airliner(c, 860, 760, 1.05, T.t * .2);
  // stairs to the door, four specialists step down on 'four'
  poly(c, [[400, 640], [470, 640], [600, 860], [500, 860]], '#c9ced4'); for (let i = 0; i < 6; i++) line(c, 420 + i * 25, 660 + i * 36, 490 + i * 25, 660 + i * 36, 4);
  const who = ['finer', 'spec1', 'spec2', 'spec3'];
  who.forEach((w, i) => { const p = easeOut(clamp((T.since('four') - i * .28) / .9)); if (p <= 0) return; const x = lerp(440, 620 + i * 150, p), y = lerp(650, 900, p);
    P(w, { x, y, s: .55, t: T.t, expr: 'neutral', pose: 'carry', walk: p < 1, item: (cc, h) => box(cc, h[1][0] - 24, h[1][1], 48, 40, 6, '#7a5a3a', 3) }); });
  if (T.since('specialists') > 0) label(c, 'FOUR SPECIALISTS', 960, 160, 64, '#fff');
  GRADE.warm(c, .2);
} });
S('M1.2', { focus: [960, 520, 1.25], sfx: [['door', 0, -18], ['ding', 'factory', -14]], draw(c, T) {
  bg(c, '#d9d2bf', '#c6bda6'); for (let x = -400; x < W + 400; x += 140) line(c, x, -300, x, 860, 2, 'rgba(0,0,0,.06)'); FLOOR(c, 860, '#8a7d6c');
  box(c, 760, 220, 400, 640, 6, '#6d4c41'); box(c, 790, 250, 340, 610, 4, '#8a5a3b', 3); box(c, 820, 280, 280, 200, 4, '#d6e6ee', 3); circ(c, 1100, 600, 14, GOLD, 3);
  const p = T.at('factory', .9);
  box(c, 560, 480, 800, 160, 12, '#c9a14a', 5); box(c, 580, 500, 760, 120, 8, null, 3);
  c.save(); rr(c, 580, 500, 760 * clamp(p * 1.4), 120, 8); c.clip(); label(c, 'FACTORY MARKINGS CENTER', 960, 560, 52, '#3a2a12', { stroke: false, maxW: 720 }); c.restore();
  hedge(c, "PER FINER'S REPORT", 960, 760, T.at('report', .6), { size: 30 });
  lightPool(c, 960, 520, 500, '#fff2cc', .3);
} });
S('M2.0', { cams: [[900, 540, 1.2], [1180, 640, 1.5]], sfx: [['ding', 'stamps', -16], ['ding', 'labels', -16], ['ding', 'serial', -14]], draw(c, T) {
  SET.grid(c, T.t);
  // a metal equipment plate: rivets, a stamp, a label, a serial strip (unreadable on purpose)
  box(c, 420, 260, 1080, 640, 18, '#9aa4ae', 5); c.save(); rr(c, 420, 260, 1080, 640, 18); c.clip(); for (let i = 0; i < 14; i++) line(c, 420, 280 + i * 46, 1500, 300 + i * 46, 3, 'rgba(255,255,255,.12)'); c.restore();
  [[450, 290], [1470, 290], [450, 870], [1470, 870]].forEach(([x, y]) => circ(c, x, y, 12, '#6b7178', 3));
  const glow = (x, y, r, w) => { const k = T.at(w, .5); if (k > 0) { c.save(); c.globalCompositeOperation = 'screen'; lightPool(c, x, y, r, '#ffd36e', .6 * k); c.restore(); } };
  glow(640, 470, 200, 'stamps'); circ(c, 640, 470, 110, null, 7); circ(c, 640, 470, 88, null, 3); poly(c, starPts(640, 470, 44), '#7a838c', 4);
  glow(1100, 440, 260, 'labels'); box(c, 900, 360, 400, 170, 8, '#efe6c8', 4); label(c, 'CCCP', 1100, 410, 54, '#7a2a24', { stroke: false, raw: true }); for (let i = 0; i < 2; i++) line(c, 940, 470 + i * 30, 1260 - i * 80, 470 + i * 30, 6, '#9a917c');
  glow(960, 740, 300, 'serial'); box(c, 620, 690, 680, 100, 10, '#2b2f36', 4); label(c, 'No.', 680, 740, 40, '#e9e4d6', { stroke: false, raw: true }); for (let i = 0; i < 9; i++) box(c, 740 + i * 58, 712, 42, 56, 6, '#5a6470', 0);
  [['STAMPS', 640, 640, 'stamps'], ['LABELS', 1100, 580, 'labels'], ['SERIAL NUMBERS', 960, 850, 'serial']].forEach(([s, x, y, w]) => { if (T.since(w) > 0) label(c, s, x, y, 40, '#fff'); });
  const m = T.lt; magnifier(c, 640 + 460 * clamp((T.since('labels')) / .5) - 140 * clamp(T.since('serial') / .5), 470 + 270 * clamp(T.since('serial') / .5), 150, null);
  if (T.since('enemy') > 0) hedge(c, 'ENEMY EQUIPMENT', 1240, 200, T.at('enemy', .5), { size: 34 });
} });
S('M3.0', { cams: [[960, 560, 1.15], [960, 520, 1.35]], sfx: [['pop', 'vacationers', -12]], draw(c, T) {
  // airport arrivals, bright and cheerful: the comic beat
  bg(c, '#bfe3f0', '#f3e9cf'); for (let i = 0; i < 4; i++) { box(c, 140 + i * 440, 150, 320, 380, 12, '#e9f4f8', 4); } sign(c, 960, 110, 520, 80, 'BIENVENIDOS', { bg: '#1f5f4a', fg: '#fff', size: 46 }); FLOOR(c, 860, '#d8cfb8', 'rgba(0,0,0,.06)');
  const shirts = ['#ff7a59', '#2fb3a5', '#ffcf3f', '#e86fa4'], who = ['finer', 'spec1', 'spec2', 'spec3'];
  who.forEach((w, i) => { const x = 450 + i * 340, y = 920; const pr = P(w, { x, y, s: .85, t: T.t, expr: i === 0 ? 'neutral' : 'grin', pose: i === 2 ? 'hold' : 'idle', body: shirts[i], trench: null, tie: null, suit: false,
    item: i === 2 ? (cc, h) => { box(cc, h[0][0] - 10, h[0][1] - 60, 110, 80, 6, '#d9342b', 3.5); label(cc, 'GUIDE', h[0][0] + 45, h[0][1] - 20, 22, '#fff', { stroke: false }); } : null });
    // hibiscus print
    const R = rand(i + 4); for (let k = 0; k < 7; k++) { const fx = x + (R() - .5) * 90 * .85, fy = y - (90 + R() * 120) * .85; for (let a = 0; a < 5; a++) circ(c, fx + Math.cos(a * 1.26) * 7, fy + Math.sin(a * 1.26) * 7, 6, '#fff7', 0); circ(c, fx, fy, 4, '#ffe16a', 0); }
    // sunglasses
    const hx = x, hy = y - 300 * .85; box(c, hx - 46, hy - 16, 40, 24, 8, '#151515', 2.5); box(c, hx + 6, hy - 16, 40, 24, 8, '#151515', 2.5); line(c, hx - 6, hy - 6, hx + 6, hy - 6, 3);
    if (i === 1) { ell(c, hx, hy - 52, 84, 14, '#e9cf8a', 3.5); ell(c, hx, hy - 70, 46, 30, '#e9cf8a', 3.5); line(c, hx - 44, hy - 58, hx + 44, hy - 58, 6, '#d9342b'); }
  });
  hedge(c, 'PER MAYSH', 960, 240, T.at(['maysh', 'maish'], .6), { size: 34 });
  if (T.since('vacationers') > 0) label(c, 'JUST VACATIONERS', 960, 980, 50, INK, { stroke: false });
} });
S('M4.0', { focus: [960, 560, 1.4], sfx: [['hit', 0, -18]], draw(c, T) {
  SET.spot(c, T.t, { col: '#ffe9c0' });
  ['spec1', 'spec2', 'spec3'].forEach((w, i) => { c.save(); c.globalAlpha = .35; P(w, { x: [380, 1540, 1260][i], y: 900, s: .8, t: T.t, expr: 'neutral' }); c.restore(); });
  const hd = P('finer', { x: 960, y: 920, s: 1.05, t: T.t, expr: T.since('29') > 0 ? 'focus' : 'neutral', pose: 'point', hands: [[-70, -120], [40, -300]], body: '#ff7a59', tie: null });
  const k = easeOut(T.at('29', .5)), hx = 960, hy = 920 - 300 * 1.05 + 30 * k;
  box(c, hx - 50, hy - 18, 44, 26, 9, '#151515', 2.5); box(c, hx + 6, hy - 18, 44, 26, 9, '#151515', 2.5); line(c, hx - 6, hy - 6, hx + 6, hy - 6, 3);
  if (T.since('russian') > 0) label(c, 'AGE 29 · RUSSIAN SPEAKER', 960, 200, 50, '#fff');
} });
S('M4.1', { cams: [[960, 540, 1.15], [1080, 500, 1.4]], sfx: [['paper', 0, -14], ['stamp', 'finer', -6]], draw(c, T) {
  SET.desk(c, T.t, { lx: 960, ly: 540 });
  dossier(c, 960, 560, 1000, { who: 'finer', expr: 'neutral', t: T.t, name: T.since('sidney') > 0 ? 'SYDNEY WESLEY FINER' : '', role: ['SPECIALIST', 'AGE 29', 'RUSSIAN SPEAKER'], p: clamp(T.lt / .5), stamp: 'CLASSIFIED', sp: T.at('finer', .4), rot: -.02 });
  filmCanister(c, 360, 900, .9, { label: 'TEAM' }); pressCamera(c, 1640, 880, .9, {});
} });
S('M5.0', { focus: [960, 560, 1.2], sfx: [['pencil', 'worked', -12, { len: .5 }], ['pencil', 'photographers', -12, { len: .5 }], ['pencil', 'need', -12, { len: .5 }]], draw(c, T) {
  const L = SET.embassyOffice(c, T.t, {});
  P('zambernardi', { x: 640, y: 900, s: 1.0, t: T.t, expr: 'focus', pose: 'point', hands: [[-60, -130], [210, -200]] });
  clipboard(c, 1200, 520, 520, 600, ['FOR THE PHOTOGRAPHERS', 'CAMERAS', 'FILM', 'FAST FLASH'], { cols: [INK, INK, INK, '#d9342b'], size: 40 });
  ['worked', 'photographers', 'need'].forEach((w, i) => { const k = T.at(w, .35); if (k <= 0) return; const y = 520 - 300 + 50 + (i + 1) * (600 - 80) / 3; c.save(); c.lineWidth = 8; c.strokeStyle = '#1d6fb8'; c.lineCap = 'round'; c.beginPath(); c.moveTo(1000, y); c.lineTo(1000 + 14 * clamp(k * 2), y + 14); c.lineTo(1014 + 30 * clamp(k * 2 - 1), y - 20); c.stroke(); c.restore(); });
  label(c, 'ZAMBERNARDI', 640, 210, 44, '#fff');
} });
S('M5.1', { cams: [[960, 540, 1.15], [1300, 560, 1.5]], sfx: [['camflash2', 'flash', -6], ['elec', 'recharge', -12], ['camflash2', 'fast', -6]], draw(c, T) {
  SET.darkroom(c, T.t);
  pressCamera(c, 760, 620, 2.4, { flash: clamp(T.since('flash') / .5) * (T.since('flash') < .5 ? 1 : 0) || clamp(T.since('fast') / .5) * (T.since('fast') > 0 && T.since('fast') < .5 ? 1 : 0) });
  // recharge meter: drains on the flash, refills instantly on 'recharge'
  const f1 = T.since('flash'), r = T.since('recharge'), f2 = T.since('fast');
  let lvl = 1; if (f1 > 0) lvl = 0; if (r > 0) lvl = easeOut(clamp(r / .35)); if (f2 > 0) lvl = clamp(f2 / .3);
  box(c, 1200, 360, 220, 420, 20, '#2b2f36', 5); box(c, 1230, 390 + 360 * (1 - lvl), 160, 360 * lvl, 10, lvl > .99 ? '#5fd36a' : '#ffcf3f', 0); box(c, 1230, 390, 160, 360, 10, null, 4); label(c, 'READY', 1310, 820, 40, lvl > .99 ? '#5fd36a' : '#888');
  if (r > 0) label(c, 'RECHARGES FAST', 1310, 300, 48, '#fff');
  const g = f1 > 0 && f1 < .45 ? f1 / .45 : (f2 > 0 && f2 < .45 ? f2 / .45 : 0); if (g > 0) GRADE.flash(c, 960, 540, g);
} });
S('M6.0', { focus: [960, 560, 1.15], sfx: [['whoosh1', 'clothes', -12], ['steps', 'stand', -20, { len: 1.2 }]], draw(c, T) {
  bg(c, '#f2c98a', '#e8b36a'); skyline(c, 640, '#c98a5a', null, 9, .6); FLOOR(c, 860, '#b9906a', 'rgba(0,0,0,.06)');
  // market stall
  poly(c, [[300, 300], [1620, 300], [1680, 420], [240, 420]], '#d9342b'); for (let i = 0; i < 12; i++) poly(c, [[300 + i * 110, 300], [355 + i * 110, 300], [360 + i * 115, 420], [300 + i * 115, 420]], '#f3efe6', 0); line(c, 270, 420, 270, 860, 12, '#6d4c41'); line(c, 1650, 420, 1650, 860, 12, '#6d4c41');
  sign(c, 960, 260, 300, 70, 'ROPA', { bg: '#1f5f4a', fg: '#fff', size: 44 });
  for (let i = 0; i < 6; i++) { const x = 380 + i * 220; line(c, x - 60, 450, x + 60, 450, 4); box(c, x - 50, 455, 100, 120, 14, ['#6a7a8a', '#8a6a4a', '#4a6a5a'][i % 3], 3.5); }
  const sw = T.since('clothes') > 0, shirts = ['#ff7a59', '#2fb3a5', '#ffcf3f', '#e86fa4'], plain = ['#6a7a8a', '#8a6a4a', '#4a6a5a', '#7a6a5a'];
  ['finer', 'spec1', 'spec2', 'spec3'].forEach((w, i) => { const x = 520 + i * 240; P(w, { x, y: 920, s: .75, t: T.t, expr: sw ? 'neutral' : 'grin', body: sw ? plain[i] : shirts[i], trench: null, tie: null, suit: false, hat: sw ? 'workcap' : undefined, hatCol: '#5a5048' });
    const k = T.at('clothes', .4); if (k > 0 && k < 1) { c.save(); c.globalAlpha = 1 - k; circ(c, x, 920 - 160 * .75, 120 * (1 + k), '#fff', 0); c.restore(); } });
  const px = lerp(-100, 2000, clamp((T.lt - .3) / 2.4)); P('visitor2', { x: px, y: 1000, s: .9, t: T.t, expr: 'bored', walk: true, look: 1 });
  if (T.since('stand') > 0) label(c, 'BLENDING IN', 960, 160, 54, INK, { stroke: false });
} });
const SHOP = ['LADDERS', 'ROPES', 'DROP LIGHTS', 'PINCH BAR', 'METRIC WRENCHES', 'NAIL PULLER'];
function hardware(c, T, upto, receipt) {
  bg(c, '#8a6a48', '#6d5034'); for (let r = 0; r < 4; r++) { box(c, -400, 140 + r * 150, W + 800, 16, 0, '#5a412a', 3); for (let i = 0; i < 22; i++) { const R = rand(r * 30 + i); box(c, -300 + i * 110, 70 + r * 150, 70, 70, 6, ['#c9a14a', '#9aa1a8', '#b8322a', '#4a6a8a'][Math.floor(R() * 4)], 3); } }
  sign(c, 960, 80, 420, 76, 'FERRETERÍA', { bg: '#e9e4d6', size: 46 });
  P('clerkMx', { x: 1640, y: 800, s: .8, t: T.t, expr: 'grin', pose: 'idle', flip: true });
  box(c, 120, 700, 1680, 60, 10, '#b98a5a', 5); box(c, 140, 760, 1640, 320, 6, '#8a5a3b', 4);
  const items = [
    (x, y) => { c.save(); c.translate(x, y); c.rotate(-1.45); ladder(c, 0, 0, 380); c.restore(); },
    (x, y) => ropeCoil(c, x, y - 40, 70),
    (x, y) => { dropLight(c, x, y - 140, 1, 60); },
    (x, y) => pinchBar(c, x, y - 30, 1.1, -.1),
    (x, y) => { wrench(c, x - 40, y - 30, .9, .2); wrench(c, x + 30, y - 40, .7, -.1); },
    (x, y) => nailPuller(c, x, y - 30, 1.1, -1.4)];
  const words = [['ladders', 0], ['ropes', 0], ['drop', 0], ['pinch', 0], ['metric', 0], ['nail', 0]];
  const X = [300, 560, 800, 1040, 1270, 1490];
  for (let i = 0; i < upto; i++) { const p = i < upto - 3 || T.since(words[i][0]) > 0 ? clamp(T.since(words[i][0]) / .25) : 0; const full = i < upto - 3 ? 1 : p; if (full <= 0) continue;
    const y = 700 - 160 * (1 - full); c.save(); c.globalAlpha = clamp(full * 3); items[i](X[i], y); c.restore();
    if (full >= 1) { c.save(); c.translate(X[i], 640 - (i % 2) * 40); c.rotate((i % 2 ? .04 : -.04)); box(c, -90, -24, 180, 48, 6, '#fff8e1', 3); label(c, SHOP[i], 0, 0, 24, INK, { stroke: false, maxW: 166 }); c.restore(); } }
  if (receipt > 0) { const h = 420 * easeOut(receipt); c.save(); c.translate(1600, 560); box(c, -70, -h, 140, h, 2, '#fbf8ee', 3); for (let i = 0; i < 6; i++) if (i * 60 < h - 30) line(c, -50, -h + 30 + i * 60, 30, -h + 30 + i * 60, 3, '#9a917c'); c.restore(); }
}
S('M7.0', { cams: [[700, 560, 1.25], [880, 560, 1.25]], sfx: [['hit', 'ladders', -14], ['hit', 'ropes', -14], ['switch', 'drop', -10]], draw(c, T) { hardware(c, T, 3, 0); } });
S('M7.1', { cams: [[1100, 560, 1.25], [1240, 560, 1.25]], sfx: [['hit', 'pinch', -14], ['wrench', 'metric', -12, { len: .6 }], ['hit', 'nail', -14], ['paper', 'puller', -12]], draw(c, T) { hardware(c, T, 6, T.at('puller', .8)); } });
S('M8.0', { cams: [[960, 540, 1.1], [960, 540, 1.15]], sfx: [['camshutter', 'photographed', -6], ['camshutter', 'crate', -8], ['camshutter', 'out', -8], ['paper', 'how', -12]], draw(c, T) {
  if (T.sub === 0) {
    const L = SET.port(c, T.t, { crane: 0, night: false });
    crate(c, 1240, 840, 520, {}); P('guard', { x: 1580, y: 880, s: .55, t: T.t, expr: 'stern', pose: 'handsBack', flip: true });
    // car interior frame: we're inside a parked sedan with a long lens
    c.save(); c.fillStyle = '#10141a'; c.beginPath(); c.rect(-400, -300, W + 800, H + 600); c.moveTo(260, 180); c.quadraticCurveTo(960, 120, 1700, 180); c.lineTo(1760, 820); c.quadraticCurveTo(960, 860, 200, 820); c.closePath(); c.fill('evenodd'); c.restore();
    line(c, 960, 140, 960, 230, 10, '#10141a'); box(c, 880, 190, 160, 50, 10, '#20262e', 3);
    // long lens in the foreground, bottom left
    c.save(); c.translate(420, 900); c.rotate(-.18); box(c, -120, -70, 240, 140, 14, '#2b2f36', 4); box(c, 110, -54, 300, 108, 10, '#1b1e22', 4); box(c, 400, -64, 40, 128, 8, '#3a3f46', 4); c.restore();
    // viewfinder brackets snap on the crate on 'photographed'
    const k = T.at('photographed', .25), b = lerp(1.4, 1, k); if (k > 0) { c.save(); c.translate(1240, 760); c.scale(b, b); c.lineWidth = 8; c.strokeStyle = '#fff'; [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy]) => { c.beginPath(); c.moveTo(sx * 320, sy * 120); c.lineTo(sx * 320, sy * 170); c.lineTo(sx * 270, sy * 170); c.stroke(); }); c.restore(); }
    ['photographed', 'crate'].forEach(w => { const s = T.since(w); if (s > 0 && s < .12) { c.fillStyle = 'rgba(0,0,0,.85)'; c.fillRect(-400, -300, W + 800, H + 600); } });
    GRADE.warm(c, .1);
  } else {
    SET.desk(c, T.t, { lx: 960, ly: 520 });
    const shots = [[620, 440, -.08], [1000, 420, .05], [1360, 480, -.03], [820, 760, .06], [1200, 780, -.05]];
    shots.forEach(([x, y, r], i) => { const p = easeOut(clamp((T.since('out') - i * .12) / .4)); if (p <= 0) return; photoPrint(c, lerp(x, 2200, 1 - p), y, 300, 200, r, () => { bg(c, '#bbb', '#888'); crate(c, (i - 2) * 40, 70, 260 - i * 10, { stencil: false }); }, { caption: ['SIDE', 'END', 'TOP', 'CORNER', 'BOLTS?'][i] }); });
    if (T.since('built') > 0) label(c, 'HOW IS IT BUILT?', 960, 160, 58, '#fff');
  }
} });
function crateBlueprint(c, T, hiInside, roofArrow) {
  SET.grid(c, T.t, { title: 'THE CRATE', sub: 'STATION SKETCH' });
  const x0 = 360, y0 = 360, w = 1200, h = 380, d = 140;
  c.save(); c.lineWidth = 5; c.strokeStyle = '#e8f1ff'; c.strokeRect(x0, y0, w, h); c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0 + d, y0 - d * .7); c.lineTo(x0 + w + d, y0 - d * .7); c.lineTo(x0 + w, y0); c.moveTo(x0 + w + d, y0 - d * .7); c.lineTo(x0 + w + d, y0 + h - d * .7); c.lineTo(x0 + w, y0 + h); c.stroke();
  c.setLineDash([12, 10]); c.lineWidth = 3; c.beginPath(); c.moveTo(x0 + d, y0 - d * .7); c.lineTo(x0 + d, y0 + h - d * .7); c.lineTo(x0, y0 + h); c.moveTo(x0 + d, y0 + h - d * .7); c.lineTo(x0 + w + d, y0 + h - d * .7); c.stroke(); c.setLineDash([]);
  for (let i = 1; i < 9; i++) { c.beginPath(); c.moveTo(x0 + i * w / 9, y0); c.lineTo(x0 + i * w / 9 + d, y0 - d * .7); c.stroke(); } c.restore();
  c.save(); c.globalAlpha = .35; lunik(c, x0 + w / 2 + 40, y0 + h / 2, w * .8, { blueprint: true }); c.restore();
  // bolts on the inside faces
  const g = hiInside; for (let i = 0; i < 10; i++) { const bx = x0 + 40 + i * (w - 80) / 9; [[bx, y0 + 30], [bx, y0 + h - 30]].forEach(([x, y]) => { if (g > 0) { c.save(); c.globalCompositeOperation = 'screen'; lightPool(c, x, y, 50, '#ffb04a', .9 * g); c.restore(); } circ(c, x, y, 11, g > 0 ? '#ffcf6a' : '#a9c4e8', 3); }); }
  label(c, 'CRATE · ~20 FT', x0 + w / 2, y0 + h + 70, 40, '#e8f1ff', { stroke: false });
  if (g > 0) { label(c, 'BOLTED FROM THE INSIDE', 960, 160, 58, '#ffcf6a', { stroke: false }); }
  if (roofArrow > 0) { const y = lerp(-80, y0 + h * .45, easeOut(roofArrow)); c.save(); c.globalCompositeOperation = 'screen'; lightPool(c, 960, y0 - 50, 260, '#ff6a5a', .5 * roofArrow); c.restore(); arrow(c, 960, y - 300, 960, y, '#ff5a4a', 50); }
}
S('M9.0', { focus: [960, 520, 1.1], sfx: [['wrench', 'bolted', -14, { len: .8 }], ['ding', 'inside', -12]], draw(c, T) { crateBlueprint(c, T, T.at('inside', .5), 0); } });
S('M9.1', { focus: [960, 460, 1.15], shakes: [['roof']], sfx: [['whoosh2', 'roof', -10], ['plank', 'roof', -10]], draw(c, T) {
  crateBlueprint(c, T, 1, T.at('through', 1.0));
  // the side walls are crossed out on 'only'
  const k = T.at('only', .5); chalkX(c, 420, 560, 50, k, '#ff5a4a', 10); chalkX(c, 1500, 560, 50, k, '#ff5a4a', 10);
  if (T.since('roof') > 0) label(c, 'ONLY WAY IN: THE ROOF', 960, 960, 58, '#fff');
} });

// ======================= THE GRAB =======================
chap3('G1.0', 7, 'The Grab');
S('G1.1', { focus: [900, 600, 1.1], sfx: [['truck', 'exhibits', -16, { len: 2 }], ['truck2', 'held', -20, { len: 1.8 }]], draw(c, T) {
  bg(c, '#3a4a72', '#e0915a'); lightPool(c, 1600, 500, 600, '#ffb070', .5); FLOOR(c, 860, '#6a625a');
  hallFacade(c, 760, 860, 1200, { banner: 'SOVIET EXHIBITION' });
  // trucks rolling out one by one, to the right
  for (let i = 0; i < 3; i++) { const k = T.lt * .6 - i * .5; if (k < 0) continue; truck59(c, 700 + k * 1600, 960, .55, { crate: { stencil: 'CCCP' }, col: ['#6a7a8a', '#7a6a5a', '#5a6a7a'][i], moving: true, t: T.t }); }
  truck59(c, 540, 1000, .7, { crate: true, driver: 'driver', t: T.t, driverExpr: 'bored' });
  if (T.since('held') > 0) hedge(c, 'HELD BACK', 400, 560, T.at('held', .5), { size: 34 });
  GRADE.warm(c, .2);
} });
S('G1.2', { focus: [960, 520, 1.25], sfx: [['pencil', 'last', -10, { len: 1 }]], draw(c, T) {
  bg(c, '#8a7a6a', '#6a5a4a'); for (let x = -400; x < W + 400; x += 60) line(c, x, -300, x, 900, 3, 'rgba(0,0,0,.12)'); FLOOR(c, 900, '#4a4038');
  chalkboard(c, 520, 160, 880, 620); chalkText(c, 'TRUCKS OUT', 960, 230, 64, 1);
  ['TRUCK 1', 'TRUCK 2', 'TRUCK 3', 'TRUCK 4'].forEach((s, i) => { chalkText(c, s, 760, 330 + i * 80, 46, 1, 'rgba(238,242,230,.7)', 'left'); if (T.lt > .2 + i * .25) chalkText(c, '✓ GONE', 1060, 330 + i * 80, 46, 1, '#9fe0a0', 'left'); });
  line(c, 640, 640, 1280, 640, 4, 'rgba(238,242,230,.5)');
  chalkText(c, 'LAST:', 820, 700, 64, T.at('last', .4), CHALK_Y); chalkText(c, 'LUNIK', 1060, 700, 80, T.at('truckload', .6), '#ff8a7a');
  GRADE.warm(c, .2);
} });
S('G2.0', { cams: [[960, 560, 1.25], [960, 460, 1.55]], sfx: [['tick', 'claimed', -14]], draw(c, T) {
  SET.spot(c, T.t, { col: '#ffd9a0' });
  const men = T.since('men') > 0; ['silveti', 'silveti', 'silveti'].forEach((w, i) => { if (!men) return; c.save(); c.globalAlpha = .45 * clamp(T.since('men') * 2); P(w, { x: [520, 1400, 1660][i], y: 900, s: .7, t: T.t, expr: 'neutral', tache: false, hat: 'fedora', hatCol: '#2a2a30', seed: i + 3 }); c.restore(); });
  P('silveti', { x: 960, y: 940, s: 1.1, t: T.t, expr: 'smug', pose: 'shush' });
  hedge(c, "SILVETI'S CLAIM", 960, 160, T.at('claimed', .5), { size: 40 });
  if (men) label(c, 'HIS MEN HELPED', 960, 980, 44, '#fff');
} });
S('G3.0', { focus: [960, 520, 1.15], sfx: [['pencil', 'filed', -6, { len: 1.2 }]], draw(c, T) {
  SET.black(c, T.t); lightPool(c, 960, 520, 900, '#5a6a80', .35);
  const [px, py] = engineBay(c, 960, 560, 1.05);
  // the file rasps on the part from 'filed'
  const f = T.since('filed'), rasp = f > 0 ? Math.sin(f * 30) * 40 : 0;
  c.save(); c.translate(px - 60 + rasp, py - 60); c.rotate(-.5); box(c, -20, -12, 220, 24, 4, '#9aa1a8', 3.5); for (let i = 0; i < 10; i++) line(c, i * 20, -12, i * 20 + 10, 12, 2, '#6b7178'); box(c, 200, -16, 110, 32, 12, '#8a3a2a', 3.5); c.restore();
  if (f > 0) { const R = rand(Math.floor(T.t * 30)); for (let i = 0; i < 12; i++) { const a = -2.6 + R() * 1.4, d = 20 + R() * 120; line(c, px + Math.cos(a) * 10, py + Math.sin(a) * 10, px + Math.cos(a) * d, py + Math.sin(a) * d, 3, '#ffcf6a'); } c.save(); c.globalCompositeOperation = 'screen'; lightPool(c, px, py, 160, '#ffcf6a', .6); c.restore(); }
  hedge(c, "SILVETI'S ACCOUNT", 960, 150, 1, { size: 36 });
  if (T.since('part') > 0) label(c, 'A PART, FILED DOWN', 960, 960, 50, '#fff');
} });
S('G3.1', { focus: [900, 560, 1.25], sfx: [['carengine', 'engine', -10, { len: 1.4 }]], draw(c, T) {
  bg(c, '#d9a06a', '#a87a5a'); hallFacade(c, 960, 800, 1700, { banner: 'SOVIET EXHIBITION' }); FLOOR(c, 800, '#6a625a');
  const st = T.since('start'), cough = T.since('engine');
  truck59(c, 1000, 960, 1.1, { crate: true, driver: 'driver', t: T.t, driverExpr: st > 0 ? 'worried' : 'neutral' });
  if (cough > 0 && cough < 1.5) for (let i = 0; i < 3; i++) { const k = clamp((cough - i * .3) / .9); if (k > 0 && k < 1) { c.save(); c.globalAlpha = (1 - k) * .7; circ(c, 420 - k * 160, 900 - k * 60, 30 + k * 60, '#6a6a6a', 0); c.restore(); } }
  if (st > 0) label(c, "WON'T START", 1180, 300, 66, '#d9342b', { stroke: false });
  hedge(c, "SILVETI'S ACCOUNT", 400, 200, 1, { size: 30 });
  GRADE.warm(c, .15);
} });
S('G3.2', { cams: [[760, 520, 1.25], [1160, 620, 1.2]], sfx: [['clock', 'until', -14, { len: 1.4 }], ['bell', 'five', -12]], draw(c, T) {
  bg(c, '#e0a46a', '#b06a48'); hallFacade(c, 960, 820, 1700, { banner: 'SOVIET EXHIBITION' }); FLOOR(c, 820, '#6a625a');
  const k = easeOut(T.at('until', 1.4)); const hh = 15 + 2 * k, mm = 0; nightClock(c, 600, 420, 170, Math.floor(hh), Math.round((hh % 1) * 60), { label: false }); if (k > .95) label(c, 'AROUND 5 P.M.', 600, 660, 50, '#fff');
  truck59(c, 1500, 1000, .7, { crate: true, driver: 'driver', t: T.t, driverExpr: T.since('replacement') > 0 ? 'happy' : 'worried' });
  const b = easeOut(clamp(T.since('replacement') / 1.0)); const bx = lerp(-200, 980, b);
  if (b > 0) { bicycle(c, bx, 1000, .9, T.t * (1 - b)); P('visitor3', { x: bx, y: 900, s: .5, t: T.t, legs: 'sit', expr: 'grin', pose: 'hold' }); box(c, bx - 120, 870, 90, 70, 8, '#c9a14a', 3.5); label(c, 'PART', bx - 75, 905, 22, INK, { stroke: false }); }
  if (T.since('replacement') > 0) label(c, 'REPLACEMENT', bx - 60, 760, 40, '#fff');
  hedge(c, "SILVETI'S ACCOUNT", 1500, 200, 1, { size: 30 });
  GRADE.warm(c, .2);
} });
S('G4.0', { cams: [[960, 540, 1.1], [1060, 600, 1.35]], shakes: [['disputed']], sfx: [['paper', 0, -14], ['stamp', 'disputed', -4]], draw(c, T) {
  SET.desk(c, T.t, { lx: 960, ly: 540 });
  dossier(c, 960, 560, 1000, { who: 'silveti', expr: 'smug', t: T.t, name: 'E. DÍAZ SILVETI', role: ['MEXICAN SECRET POLICE', 'AGE 30'], source: "SILVETI'S ACCOUNT", p: clamp(T.lt / .5), stamp: 'DISPUTED', sp: T.at('disputed', .4) });
  if (T.since('only') > 0) hedge(c, 'ONLY SOURCE: SILVETI', 960, 140, T.at('only', .5), { size: 38 });
} });
S('G5.0', { cams: [[700, 620, 1.2], [960, 620, 1.0]], sfx: [['truck2', 'pulled', -12, { len: 3 }], ['carengine', 'ahead', -14], ['carengine', 'behind', -14]], draw(c, T) {
  const L = SET.nightStreet(c, T.t, { dusk: 1, scroll: T.since('pulled') > 0 ? 260 : 0 });
  const go = easeOut(clamp(T.since('pulled') / 2.5)); const tx = lerp(300, 900, go);
  const a = easeOut(T.at('ahead', 1.0)), b = easeOut(T.at('behind', 1.0));
  if (a > 0) car59(c, lerp(2300, tx + 900, a), 990, .8, { lights: true, moving: true, t: T.t, driver: 'dean' });
  truck59(c, tx, 1010, .95, { crate: true, driver: 'driver', lights: true, moving: go > 0 && go < 1, t: T.t });
  if (b > 0) car59(c, lerp(-700, tx - 760, b), 990, .8, { lights: true, moving: true, t: T.t, driver: 'zambernardi', col: '#3a2f2a' });
  GRADE.night(c, [...L, [tx + 330, 950, 300, '#fff3c0', .4]], .25);
  if (a > .6) hedge(c, 'CIA CAR', tx + 900, 760, a, { size: 28 }); if (b > .6) hedge(c, 'CIA CAR', tx - 760, 760, b, { size: 28 });
} });
S('G6.0', { cams: [[960, 520, 1.1], [1060, 300, 1.6]], sfx: [['carengine', 0, -22, { len: 3 }]], draw(c, T) {
  // inside the trailing CIA car: windshield, the truck's tail lights ahead, a mirror up top
  NIGHT_SKY(c, T.t, '#081226', '#17304a', 40); skyline(c, 700, '#0f1d30', 'rgba(255,200,110,.45)', 5, .9); FLOOR(c, 700, '#2b2f35');
  poly(c, [[600, 1200], [1320, 1200], [1010, 700], [910, 700]], '#3a3f46'); for (let i = 0; i < 5; i++) { const k = ((i / 5) + T.t * .8) % 1; c.fillStyle = 'rgba(255,220,150,.6)'; c.fillRect(960 - lerp(3, 16, k), lerp(710, 1150, k), lerp(6, 32, k), lerp(10, 50, k)); }
  // the truck from behind, far ahead
  box(c, 880, 600, 160, 100, 6, '#c9975a', 3); box(c, 870, 690, 180, 30, 4, '#2c2f33', 3); circ(c, 890, 705, 8, '#ff4030', 0); circ(c, 1030, 705, 8, '#ff4030', 0); lightPool(c, 960, 705, 120, '#ff4030', .4);
  // car interior frame
  c.save(); c.fillStyle = '#0c0f14'; c.beginPath(); c.rect(-400, -300, W + 800, H + 600); c.moveTo(220, 200); c.quadraticCurveTo(960, 150, 1700, 200); c.lineTo(1760, 800); c.lineTo(160, 800); c.closePath(); c.fill('evenodd'); c.restore();
  box(c, -400, 800, W + 800, 400, 0, '#1a1f26', 0); c.save(); c.beginPath(); c.arc(640, 1080, 260, Math.PI, 0); c.lineWidth = 26; c.strokeStyle = '#1b1b1b'; c.stroke(); c.restore();
  // rear-view mirror with the driver's eyes, searching
  box(c, 880, 230, 360, 120, 20, '#2b2f36', 5); c.save(); rr(c, 894, 244, 332, 92, 14); c.clip(); bg(c, '#4a3a30', '#2a2420'); const look = Math.sin(T.t * 2.2) * 30;
  [1000, 1120].forEach(ex => { ell(c, ex, 300, 34, 22, '#f2c49b', 0); circ(c, ex + look * .6, 300, 11, INK, 0); }); line(c, 960, 268, 1040, 262, 6); line(c, 1080, 262, 1160, 268, 6); c.restore();
  line(c, 1060, 200, 1060, 230, 10, '#2b2f36');
  if (T.since('escorting') > 0) label(c, 'ANY ESCORT?', 960, 470, 60, '#fff');
} });
S('G7.0', { focus: [1100, 600, 1.15], noWhoosh: true, sfx: [['crickets', 0, -22, { len: 1.6 }]], draw(c, T) {
  const L = SET.road(c, T.t, { dusk: .2, sign: ' ' });
  GRADE.night(c, L, .35);
  const k = T.at('werent', .8); if (k > 0) { c.save(); c.globalAlpha = k; label(c, 'no escort.', 760, 420, 70, '#fff', { stroke: false, raw: true }); c.restore(); }
} });
S('G8.0', { focus: [960, 540, 1.1], sfx: [['truck2', 0, -20, { len: 2.8 }]], draw(c, T) {
  // top-down street map: the turn-off before the rail yard (the cold-open map, seen again)
  bg(c, '#1a2a3a', '#14212e'); c.save(); c.globalAlpha = .9;
  for (let i = 0; i < 8; i++) for (let j = 0; j < 5; j++) box(c, 120 + i * 220, 120 + j * 200, 180, 150, 10, '#22384a', 0); c.restore();
  box(c, -400, 520, W + 800, 90, 0, '#3a4a5a', 0); box(c, 1180, -300, 90, 820, 0, '#3a4a5a', 0); c.save(); c.setLineDash([24, 18]); line(c, -400, 565, W + 400, 565, 4, '#ffe58a'); c.restore();
  label(c, 'RAIL YARD →', 1700, 470, 40, '#e9e4d6', { stroke: false }); box(c, 1560, 640, 300, 200, 12, '#2a3a2a', 3); label(c, 'RAIL YARD', 1710, 740, 34, '#a9cde0', { stroke: false });
  const p = easeOut(clamp(T.lt / 2.4)); truckTop(c, lerp(-100, 1110, p), 565, 1.2, 0, { brake: T.since('yard') > 0 ? 1 : 0 });
  redRing(c, 1225, 565, 120, 80, T.at('turn', .7)); if (T.since('turn') > 0) label(c, 'LAST TURN-OFF', 1225, 400, 44, '#fff');
} });
S('G8.1', { cams: [[1000, 620, 1.2], [1040, 560, 1.4]], shakes: [['canvas']], sfx: [['truck', 'stopped', -12, { len: 1 }], ['whoosh3', 'canvas', -6], ['plank', 'crate', -16]], draw(c, T) {
  // the swap again, from the other side: cab on the left, night, the turn-off sign behind
  NIGHT_SKY(c, T.t, '#060d1e', '#14284a', 60); skyline(c, 700, '#0c1828', 'rgba(255,200,110,.4)', 8, .8); FLOOR(c, 700, '#2a2e2a'); box(c, -400, 860, W + 800, 400, 0, '#33373d', 0); line(c, -400, 860, W + 400, 860, 4);
  sign(c, 1660, 620, 280, 66, 'ESTACIÓN', { bg: '#e9e4d6', size: 32, post: 150 }); sodiumLamp(c, 300, 870, 420, 1);
  const st = T.since('stopped'), cv = T.at('canvas', .7);
  truck59(c, 1060, 1000, 1.05, { flip: true, crate: { canvas: cv, stencil: 'CCCP' }, driver: 'driver', lights: true, t: T.t, driverExpr: st > 0 ? 'worried' : 'neutral' });
  // brake glow (tail is to the right when flipped)
  if (st > 0) { c.save(); c.globalCompositeOperation = 'screen'; lightPool(c, 1060 + 530, 900, 160, '#ff3020', .8 * clamp(st * 3)); c.restore(); }
  if (T.sub === 1) { P('dean', { x: 1720, y: 1030, s: .85, t: T.t, expr: 'focus', pose: 'holdHigh', flip: true }); P('newdriver', { x: 400, y: 1030, s: .85, t: T.t, expr: 'focus', pose: 'holdHigh' }); }
  GRADE.night(c, [[371, 450, 420, '#ffb04a', .45]], .35);
  if (cv > .9) hedge(c, 'THE SWAP', 1060, 340, clamp(T.since('crate') * 2), { size: 34 });
} });
S('G9.0', { focus: [760, 600, 1.25], sfx: [['door', 'new', -10], ['steps', 'original', -16, { len: 1.4 }]], draw(c, T) {
  NIGHT_SKY(c, T.t, '#060d1e', '#14284a', 60); skyline(c, 700, '#0c1828', 'rgba(255,200,110,.4)', 8, .8); FLOOR(c, 700, '#2a2e2a'); box(c, -400, 860, W + 800, 400, 0, '#33373d', 0);
  sodiumLamp(c, 300, 870, 420, 1);
  truck59(c, 1060, 1000, 1.05, { flip: true, crate: { state: 'canvas' }, lights: true, t: T.t, driver: T.since('wheel') > 0 ? 'newdriver' : null });
  const n = easeOut(T.at('new', .9)), o = easeOut(T.at('original', 1.6));
  if (T.since('wheel') <= 0) P('newdriver', { x: lerp(300, 700, n), y: 1030, s: .9, t: T.t, expr: 'focus', walk: n < 1, look: 1 });
  P('driver', { x: lerp(820, 1500, o), y: 1030, s: .9, t: T.t, expr: 'worried', walk: o > 0 && o < 1, flip: o <= 0, look: -1 });
  if (o > 0) P('dean', { x: lerp(980, 1660, o), y: 1030, s: .9, t: T.t, expr: 'stern', walk: o < 1, pose: 'handsBack' });
  GRADE.night(c, [[371, 450, 420, '#ffb04a', .45]], .35);
  if (T.since('driver') > 0) label(c, 'NEW DRIVER', lerp(300, 700, n), 600, 40, '#fff');
} });
S('G9.1', { cams: [[900, 560, 1.15], [1160, 560, 1.4]], sfx: [['door', 'hotel', -12], ['paper', 'kept', -14]], draw(c, T) {
  const L = SET.hotel(c, T.t);
  // the room: bed, lamp, window; room 12 from the cold open
  box(c, 1500, 160, 300, 360, 8, '#16243a', 5); for (let i = 0; i < 4; i++) line(c, 1500, 200 + i * 80, 1800, 200 + i * 80, 3, '#2c3a52');
  box(c, 300, 640, 760, 160, 18, '#e9e4d6', 5); box(c, 300, 600, 160, 80, 20, '#fff', 4); box(c, 280, 560, 40, 300, 8, '#6d4c41', 4); box(c, 300, 790, 760, 40, 8, '#6d4c41', 4);
  P('driver', { x: 700, y: 820, s: .95, t: T.t, legs: 'sit', expr: 'worried', pose: 'slump' });
  hotelDoor(c, 1380, 860, { num: '12' });
  const k = T.at('kept', .5);
  P('zambernardi', { x: 1200, y: 900, s: .95, t: T.t, expr: k > 0 ? 'focus' : 'neutral', pose: 'hold', flip: true, item: (cc, h) => { const nx = (h[0][0] + h[1][0]) / 2, ny = (h[0][1] + h[1][1]) / 2 - 40 + 30 * k; box(cc, nx - 120, ny - 80, 240, 160, 4, '#efe9d6', 3.5); for (let i = 0; i < 5; i++) line(cc, nx - 100, ny - 50 + i * 24, nx + 100, ny - 50 + i * 24, 3, '#9a917c'); } });
  GRADE.night(c, L, .25);
  label(c, 'ROOM 12', 1380, 360, 44, '#fff'); if (k > 0) hedge(c, 'KEPT FOR THE NIGHT', 700, 320, k, { size: 32 });
} });
S('G10.0', { cams: [[960, 520, 1.15], [960, 520, 1.45]], sfx: [['clock', 'borrowed', -8, { len: 2 }], ['hit', 'borrowed', -18]], draw(c, T) {
  SET.black(c, T.t); lightPool(c, 960, 520, 800, '#2a3a5a', .5);
  const s = T.since('moment'); const sec = Math.floor(Math.max(0, T.since('borrowed')) * 1) + 0;
  circ(c, 960, 520, 330, '#2b2f36'); clock(c, 960, 520, 300, 18, 10, { face: '#f6f0dc' });
  // a ticking second hand from 'borrowed'
  const bs = T.since('borrowed'); const a = -Math.PI / 2 + (bs > 0 ? Math.floor(bs * 2) / 2 * TAU / 60 * 4 : 0); line(c, 960, 520, 960 + Math.cos(a) * 270, 520 + Math.sin(a) * 270, 6, '#d9342b'); circ(c, 960, 520, 14, '#d9342b', 3);
  if (bs > 0) label(c, 'BORROWED TIME', 960, 930, 70, '#fff');
  if (T.since('operation') > 0) { c.save(); c.globalAlpha = .5 + .5 * Math.sin(T.t * 6); c.globalCompositeOperation = 'screen'; lightPool(c, 960, 520, 420, '#ff4030', .15); c.restore(); }
} });
S('G11.0', { focus: [900, 600, 1.2], sfx: [['crickets2', 0, -22, { len: 1.8 }]], draw(c, T) {
  const L = SET.road(c, T.t, { dusk: 0 });
  const walk = clamp(T.lt / 1.8); P('kolomyakov', { x: lerp(500, 780, walk), y: 980, s: 1.0, t: T.t, expr: 'stern', walk: true, pose: 'hold', hands: [[-60, -130], [90, -180]] });
  const hx = lerp(500, 780, walk) + 90, hy = 980 - 180; box(c, hx - 10, hy - 16, 60, 30, 8, '#3a3f46', 3);
  const sw = Math.sin(T.t * 1.6) * .25; c.save(); c.translate(hx + 50, hy); c.rotate(.35 + sw); c.globalCompositeOperation = 'screen'; cone(c, 0, 0, 20, 280, 900, '#fff3c0', .35); c.restore();
  GRADE.night(c, [...L, [hx + 400, hy + 200, 260, '#fff3c0', .35]], .35);
  hedge(c, 'IF ANYONE LOOKED', 1300, 240, 1, { size: 36 });
} });
S('G11.1', { focus: [960, 640, 1.25], sfx: [['crickets2', 0, -20, { len: 2.6 }], ['hit', 'nothing', -18]], draw(c, T) {
  bg(c, '#0a1220', '#0e1a2a'); FLOOR(c, 380, '#2a2f2a');
  // tyre marks pulling off the road, nothing else
  c.save(); c.globalAlpha = .7; [0, 60].forEach(dy => { c.beginPath(); c.moveTo(200, 900 + dy); c.bezierCurveTo(700, 860 + dy, 1100, 640 + dy, 1500, 560 + dy); c.lineWidth = 26; c.strokeStyle = '#1a1c1c'; c.stroke(); c.lineWidth = 3; c.setLineDash([10, 12]); c.strokeStyle = '#3a3c3c'; c.stroke(); c.setLineDash([]); }); c.restore();
  const R = rand(4); for (let i = 0; i < 30; i++) circ(c, R() * W, 420 + R() * 640, 3 + R() * 6, '#3a3f36', 0);
  const bx = lerp(500, 1300, ease(clamp(T.lt / 2.2))); c.save(); c.globalCompositeOperation = 'screen'; ell(c, bx, 700, 300, 160, 'rgba(255,243,192,.0)', 0); lightPool(c, bx, 700, 320, '#fff3c0', .55); c.restore();
  if (T.since('nothing') > 0) label(c, 'NOTHING TO FIND', 960, 240, 72, '#fff');
} });
S('G12.0', { focus: [1300, 620, 1.2], sfx: [['crickets', 0, -22, { len: 1.6 }]], draw(c, T) {
  const L = SET.railYard(c, T.t, {});
  [[640, 760, 260], [930, 760, 220], [780, 690, 220], [1120, 790, 200]].forEach(([x, y, w]) => crate(c, x, y, w, {}));
  box(c, 1240, 820, 220, 20, 6, '#6d4c41'); line(c, 1260, 840, 1260, 900, 8); line(c, 1440, 840, 1440, 900, 8);
  P('checker', { x: 1360, y: 900, s: .7, t: T.t, expr: 'neutral', pose: 'clipboard', item: (cc, h) => clipboard(cc, (h[0][0] + h[1][0]) / 2 + 20, (h[0][1] + h[1][1]) / 2 - 20, 120, 150, ['LOG']) });
  GRADE.night(c, L, .3);
} });
S('G12.1', { cams: [[1200, 560, 1.4], [960, 540, 1.0]], noWhoosh: false, sfx: [['crickets2', 'none', -16, { len: 1.4 }]], draw(c, T) {
  const L = SET.railYard(c, T.t, {});
  [[640, 760, 260], [930, 760, 220], [780, 690, 220], [1120, 790, 200]].forEach(([x, y, w]) => crate(c, x, y, w, {}));
  box(c, 1240, 820, 220, 20, 6, '#6d4c41'); line(c, 1260, 840, 1260, 900, 8); line(c, 1440, 840, 1440, 900, 8);
  const wt = T.since('waited') > 0;
  if (T.sub === 0) P('checker', { x: 1360, y: 900, s: .7, t: T.t, expr: 'neutral', pose: 'clipboard', look: wt ? -1 : 0, item: (cc, h) => clipboard(cc, (h[0][0] + h[1][0]) / 2 + 20, (h[0][1] + h[1][1]) / 2 - 20, 120, 150, ['LOG']) });
  else { P('checker', { x: 1360, y: 900, s: .7, t: T.t, expr: 'bored', legs: 'sit', pose: 'slump' });
    const k = clamp(T.since('none') / 1.6); c.save(); c.translate(lerp(-100, 900, k), 860 - Math.abs(Math.sin(k * 9)) * 40); c.rotate(k * 8); box(c, -30, -20, 60, 40, 3, '#efe9d6', 3); c.restore(); }
  GRADE.night(c, L, .3);
  if (T.sub === 1 && T.since('none') > 0) label(c, 'NONE CAME', 700, 300, 66, '#fff');
} });
S('G13.0', { focus: [960, 560, 1.4], sfx: [['paper', 'packed', -10], ['door', 'papers', -18]], draw(c, T) {
  const L = SET.railYard(c, T.t, { noTrain: true });
  box(c, 760, 780, 420, 24, 6, '#6d4c41'); line(c, 780, 804, 780, 900, 8); line(c, 1160, 804, 1160, 900, 8);
  const p = T.at('packed', .6); // ledger closes
  box(c, 860, 740, 220, 40, 4, '#7a2a24', 3); if (p < 1) { c.save(); c.translate(860, 740); c.scale(1, 1 - p); box(c, 0, -60, 220, 60, 4, '#f6f1e2', 3); c.restore(); }
  box(c, 1100, 700, 120, 90, 14, '#5a3a2a', 4); line(c, 1120, 700, 1200, 700, 6);
  P('checker', { x: 970, y: 920, s: .9, t: T.t, expr: 'bored', pose: 'hold' });
  GRADE.night(c, L, .3);
} });
S('G13.1', { focus: [960, 540, 1.3], sfx: [['crowdtalk', 0, -22, { len: 1.6 }]], draw(c, T) {
  const L = SET.nightStreet(c, T.t, {});
  // cantina window: warm interior, the checker eating soup alone
  box(c, 460, 260, 1000, 560, 10, '#5a3a2a', 6); box(c, 500, 300, 920, 480, 6, '#ffcf7a', 4); sign(c, 960, 230, 360, 70, 'CANTINA', { bg: '#8a2a22', fg: '#ffe9a8', size: 40 });
  c.save(); rr(c, 500, 300, 920, 480, 6); c.clip(); bg(c, '#f6c27a', '#d99a5a'); box(c, 700, 640, 520, 30, 6, '#6d4c41');
  P('checker', { x: 960, y: 820, s: .75, t: T.t, legs: 'sit', expr: T.since('supper') > 0 ? 'sad' : 'neutral', pose: 'hold', hands: [[-40, -150], [50, -180 + Math.abs(Math.sin(T.t * 3)) * 30]] });
  ell(c, 1000, 640, 70, 20, '#e9e4d6', 4); ell(c, 1000, 632, 54, 10, '#c9852f', 0); c.restore();
  for (let i = 1; i < 4; i++) line(c, 500 + i * 230, 300, 500 + i * 230, 780, 6, '#5a3a2a');
  GRADE.night(c, [...L, [960, 540, 600, '#ffcf7a', .45]], .3);
  if (T.since('supper') > 0) label(c, 'SUPPER, ALONE', 960, 900, 48, '#fff');
} });
S('G13.2', { focus: [960, 560, 1.3], sfx: [['steps', 0, -18, { len: 1.2 }], ['door', 'hotel', -10]], draw(c, T) {
  const L = SET.hotel(c, T.t);
  hotelDoor(c, 1100, 860, { num: '7' });
  const k = T.at('hotel', .6); P('checker', { x: lerp(500, 920, clamp(T.lt / 1.2)), y: 900, s: .95, t: T.t, expr: 'bored', walk: T.lt < 1.2, pose: 'point', hands: [[-60, -130], [150, -200]] });
  if (k > 0) { c.save(); c.globalCompositeOperation = 'screen'; lightPool(c, 1100, 700, 200, '#ffd27a', .5 * k); c.restore(); }
  GRADE.night(c, L, .25); label(c, 'HIS HOTEL', 1100, 330, 44, '#fff');
} });
S('G14.0', { cams: [[1100, 560, 1.15], [1200, 360, 1.35]], sfx: [['crickets', 0, -22, { len: 2 }], ['switch', 'night', -10]], draw(c, T) {
  const L = SET.nightStreet(c, T.t, {});
  // the hotel across the street; his window goes dark on 'night'
  box(c, 920, 140, 620, 560, 6, '#5a4a3e', 5); sign(c, 1230, 120, 300, 66, 'HOTEL', { bg: '#1f3a5a', fg: '#ffe9a8', size: 40 });
  const off = T.since('night') > 0; for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) { const lit = r === 1 && i === 2 ? !off : (r + i) % 3 === 0; box(c, 980 + i * 140, 210 + r * 150, 80, 100, 4, lit ? '#ffcf7a' : '#1d2738', 3.5); }
  if (!off) { c.save(); c.globalCompositeOperation = 'screen'; lightPool(c, 1300, 410, 120, '#ffcf7a', .6); c.restore(); }
  // the watcher in a parked car, eyes over his newspaper
  car59(c, 620, 1030, 1.5, { col: '#2a2f36', driver: 'dean', t: T.t });
  const k = easeOut(T.at('watched', .5)); c.save(); c.translate(620 + 40 * 1.5, 1030 - 112 * 1.5 + 40 - 26 * k); box(c, -90, -40, 180, 120, 4, '#efe9d6', 3.5); for (let i = 0; i < 4; i++) line(c, -70, -10 + i * 22, 70, -10 + i * 22, 3, '#9a917c'); c.restore();
  GRADE.night(c, L, .3);
  if (k > 0) hedge(c, 'CIA, WATCHING', 620, 640, k, { size: 30 });
  if (T.since('night') > 0) label(c, 'ALL NIGHT', 1230, 760, 54, '#fff');
} });
S('G15.0', { cams: [[960, 600, 1.1], [1060, 560, 1.4]], sfx: [['crickets2', 0, -22, { len: 2 }], ['hit', 'hands', -14]], draw(c, T) {
  const L = SET.nightStreet(c, T.t, {});
  truck59(c, 1100, 1010, 1.0, { crate: { state: 'canvas' }, driver: 'newdriver', t: T.t, driverExpr: T.since('hands') > 0 ? 'smug' : 'focus' });
  GRADE.night(c, [...L, [970, 560, 500, '#ffb04a', .3]], .35);
  if (T.since('hands') > 0) label(c, 'IN AMERICAN HANDS', 960, 260, 66, '#fff');
}, overlay: (c, T) => nightClockOverlay(c, 19, 0, { sub: 'EARLY EVENING' }) });
card('G15.1', 'And no one on the Soviet side knew it was missing.');
