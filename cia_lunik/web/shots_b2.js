// ---------- scene builder b2: THE FIRST LOOK (F) + FOLLOW THE PAPERWORK (P) ----------
// Every animation is keyed to the word the narrator says (T.at / T.since / T.cue). Hedged claims stay hedged on screen.
// Wrapped in a block scope so helper names never collide with the other builders' files.
(() => {
const pop = (T, w, d = .45) => T.at(w, d);
const arrive = (c, p, x, y, f) => { if (p <= 0) return; c.save(); c.translate(x, y + (1 - easeOut(p)) * 40); c.globalAlpha = clamp(p * 2); f(); c.restore(); };
const tri = (p, a, b) => clamp((p - a) / (b - a));
// hedge tag: a small sticky note (PER MAYSH / REPORTEDLY / SILVETI'S ACCOUNT)
function tag(c, txt, x, y, p = 1, o = {}) {
  if (p <= 0) return; const s = o.size || 30; c.save(); c.translate(x, y + (1 - easeOut(p)) * 18); c.rotate(o.rot ?? -.035); c.globalAlpha = clamp(p * 2.5);
  c.font = `700 ${s}px Kalam`; const w = c.measureText(txt.toUpperCase()).width + 40;
  c.save(); c.globalAlpha *= .35; box(c, -w / 2 + 6, -s * .82 + 8, w, s * 1.64, 6, '#000', 0); c.restore();
  box(c, -w / 2, -s * .82, w, s * 1.64, 6, o.bg || '#fff1c4', 3); label(c, txt, 0, 0, s, o.fg || '#7a5a20', { stroke: false }); c.restore();
}
// lower-third caption bar
function caption(c, txt, p, o = {}) { if (p <= 0) return; const y = o.y ?? 960, s = o.size || 40; c.save(); c.globalAlpha = clamp(p * 2); c.font = `700 ${s}px Kalam`;
  const w = c.measureText(txt.toUpperCase()).width + 70, x = o.x ?? 960; const k = easeOut(p);
  box(c, x - w / 2, y - s * .85, w * k, s * 1.7, 10, 'rgba(10,14,24,.85)', 3); if (k > .6) label(c, txt, x, y, s, o.col || '#fff', { stroke: false }); c.restore(); }
// generic U.S. officers for the first look (no names: the script gives none)
const OFF = [['spec1', { hat: 'fedora', hatCol: '#3a3530', trench: '#6b5a44' }], ['spec2', { hat: 'fedora', hatCol: '#2a2d33', trench: '#4f5a52' }],
  ['spec3', { hat: 'fedora', hatCol: '#4a3b2c', trench: '#7a6a52' }], ['analyst2', { hat: 'fedora', hatCol: '#222', trench: '#5a5048' }]];
const officer = (i, o) => P(OFF[i][0], { ...OFF[i][1], ...o });
// flashlight beam from (x,y) pointing at angle a (0 = down, + = towards the left)
function torch(c, x, y, a, len = 700, al = .22) { c.save(); c.translate(x, y); c.rotate(a); cone(c, 0, 0, 16, 300, len, '#fff3c8', al); c.restore(); lightPool(c, x - Math.sin(a) * len, y + Math.cos(a) * len, 170, '#fff3c8', al * 1.6); }
const notebookItem = (c, h) => { const x = (h[0][0] + h[1][0]) / 2, y = (h[0][1] + h[1][1]) / 2; box(c, x - 46, y - 60, 92, 110, 5, '#f7f2e2', 3.5); for (let i = 0; i < 5; i++) line(c, x - 32, y - 38 + i * 18, x + 30 - (i % 2) * 18, y - 38 + i * 18, 2.5, '#9a917c'); };
const binocItem = (c, h) => { const x = (h[0][0] + h[1][0]) / 2, y = (h[0][1] + h[1][1]) / 2; box(c, x - 44, y - 24, 38, 46, 9, '#2b2f36', 3.5); box(c, x + 6, y - 24, 38, 46, 9, '#2b2f36', 3.5); box(c, x - 8, y - 12, 16, 18, 3, '#3a3f46', 3); circ(c, x - 25, y - 22, 10, '#7fa8c8', 2.5); circ(c, x + 25, y - 22, 10, '#7fa8c8', 2.5); };
// office desk drawn in front of whoever sits behind it (embassyOffice with noDesk:true)
function officeDesk(c, o = {}) { box(c, 520, 700, 880, 34, 8, '#6d4428'); box(c, 540, 734, 840, 80, 6, '#5a3820'); line(c, 1240, 700, 1240, 560, 7); poly(c, [[1190, 560], [1290, 560], [1270, 520], [1210, 520]], '#2f5a3a');
  lightPool(c, 1240, 620, 420, '#ffd27a', .55 * (o.lamp ?? 1)); rotaryPhone(c, 700, 700, .7, { lifted: o.lifted }); paperSheet(c, 950, 690, .1, .9); }
// rope between two brass posts; tension 0 = sagging, 1 = taut; drop 0..1 = left end unhooked and hanging
function ropeLine(c, x0, x1, y, tension = 0, drop = 0) {
  [x0, x1].forEach(px => { line(c, px, y, px, y - 150, 8, '#c9a14a'); circ(c, px, y - 156, 12, '#c9a14a', 3.5); box(c, px - 26, y - 8, 52, 10, 4, '#c9a14a', 3); });
  c.beginPath(); const sag = lerp(86, 4, tension); if (drop > 0) { const ex = lerp(x0, x1 - 70, 0), dx = lerp(x0, x1 - 40, drop * .02); c.moveTo(x1, y - 146); c.quadraticCurveTo(lerp(x1, x0, .5), y - 146 + lerp(sag, 160, drop), lerp(x0, x1 - 30, drop * .85), lerp(y - 146, y - 10, drop)); }
  else { c.moveTo(x0, y - 146); c.quadraticCurveTo((x0 + x1) / 2, y - 146 + sag * 2, x1, y - 146); }
  c.lineWidth = 12; c.strokeStyle = INK; c.stroke(); c.lineWidth = 7; c.strokeStyle = '#b8322a'; c.stroke();
}
function palm(c, x, y, s, t) { c.save(); c.translate(x, y); c.scale(s, s); for (let i = 0; i < 9; i++) { const k = i / 9; box(c, -22 + Math.sin(k * 2) * 30 - 2, -k * 520 - 60, 44 - k * 10, 62, 10, '#7a5a3a', 3.5); }
  const tx = Math.sin(2) * 30, ty = -560; for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * .42 + Math.sin(t * .8 + i) * .03; c.save(); c.translate(tx, ty); c.rotate(a + Math.PI / 2); c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(-60, -150, 10, -260); c.quadraticCurveTo(50, -140, 0, 0); fs(c, i % 2 ? '#3f7a4a' : '#4f8f55', 3.5); c.restore(); }
  c.restore(); }
// calendar with a page that tears off and falls (p 0..1)
function fallingPage(c, x, y, w, h, top, big, p) { if (p <= 0 || p >= 1) return; c.save(); c.translate(x + p * 220, y + p * p * 700); c.rotate(p * .9); c.globalAlpha = 1 - p; calendar(c, 0, 0, w, h, top, big); c.restore(); }
function cipherWheel(c, x, y, r, a, p = 1) { if (p <= 0) return; c.save(); c.translate(x, y + (1 - easeOut(p)) * 30); c.globalAlpha = clamp(p * 2);
  circ(c, 0, 0, r, '#d9c79a'); circ(c, 0, 0, r * .72, '#efe3c2', 3.5); circ(c, 0, 0, r * .16, '#8a6a30', 3);
  const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; for (let i = 0; i < 26; i++) { const an = i / 26 * TAU - Math.PI / 2; label(c, A[i], Math.cos(an) * r * .86, Math.sin(an) * r * .86, r * .12, '#3d342a', { stroke: false });
    const bn = an + a; label(c, A[(i + 7) % 26], Math.cos(bn) * r * .55, Math.sin(bn) * r * .55, r * .1, '#7a3b2e', { stroke: false }); }
  c.restore(); }
// a typed form with a field that gets redacted
function caseForm(c, x, y, rows, o = {}) { const w = 1040, h = 640; c.save(); c.translate(x, y); c.rotate(o.rot ?? -.015); reg(c, -w / 2, -h / 2, w / 2, h / 2);
  c.save(); c.globalAlpha = .35; box(c, -w / 2 + 14, -h / 2 + 18, w, h, 4, '#000', 0); c.restore(); box(c, -w / 2, -h / 2, w, h, 4, '#f6f1e2');
  label(c, o.title || 'OPERATION FILE', 0, -h / 2 + 70, 54, INK, { stroke: false }); line(c, -w / 2 + 50, -h / 2 + 112, w / 2 - 50, -h / 2 + 112, 3);
  rows.forEach(([k, v, red], i) => { const ry = -h / 2 + 190 + i * 100; label(c, k + ':', -w / 2 + 70, ry, 40, '#6a6050', { stroke: false, align: 'left' }); line(c, -w / 2 + 340, ry + 26, w / 2 - 70, ry + 26, 2.5, '#b9a98a');
    if (v) label(c, v, -w / 2 + 360, ry, 46, '#1f2a44', { stroke: false, align: 'left' }); if (red != null) redact(c, -w / 2 + 344, ry - 30, w / 2 - 70 - (-w / 2 + 344), 62, red); });
  c.restore(); }
// small typed paper coming out of a typewriter
function typedPaper(c, x, y, lines, n) { box(c, x - 210, y - 330, 420, 340, 3, '#f6f1e2'); let k = n; lines.forEach((l, i) => { const m = Math.max(0, Math.min(l.length, k)); k -= l.length; if (m > 0) label(c, l.slice(0, m), x - 180, y - 280 + i * 64, i === lines.length - 1 ? 52 : 30, i === lines.length - 1 ? '#b8322a' : INK, { stroke: false, align: 'left', raw: false }); }); }
function factorySil(c, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); poly(c, [[-160, 0], [-160, -120], [-110, -170], [-110, -120], [-60, -170], [-60, -120], [-10, -170], [-10, -120], [40, -120], [40, -260], [80, -260], [80, -120], [160, -120], [160, 0]], '#3a3f46', 4); label(c, '?', 0, -60, 90, '#ffcf3f', { stroke: false }); c.restore(); }
// copied stencil markings: generic strokes and boxes, nothing readable presented as real
function marking(c, x, y, i, p) { if (p <= 0) return; c.save(); c.translate(x, y); c.globalAlpha = clamp(p * 2); const R = rand(i + 11); const k = easeOut(p);
  box(c, -70, -36, 140 * k, 72, 6, null, 3);
  for (let j = 0; j < 4; j++) { const gx = -54 + j * 30; if (gx + 70 > 140 * k) break; const ty = R(); if (ty < .33) { line(c, gx, -18, gx, 18, 4); line(c, gx, -18, gx + 16, -18, 4); } else if (ty < .66) { c.beginPath(); c.arc(gx + 8, 0, 12, .6, TAU - .6); c.lineWidth = 4; c.strokeStyle = INK; c.stroke(); } else { line(c, gx, 18, gx + 8, -18, 4); line(c, gx + 8, -18, gx + 16, 18, 4); } }
  c.restore(); }

// ======================= THE FIRST LOOK =======================
chap('F1.0', 3, 'The First Look');
S('F1.1', { cams: [[900, 520, 1.12]], draw(c, T) {
  SET.washington(c, T.t, { board: 'MOCK-UP' });
  P('analyst', { x: 1380, y: 880, s: .8, t: T.t, expr: 'grin', pose: 'point', flip: true, seed: 3 }); P('analyst2', { x: 1600, y: 880, s: .8, t: T.t, expr: 'smug', pose: 'hips' });
  P('analyst', { x: 640, y: 960, s: 1.15, t: T.t, expr: 'worried', pose: 'idle', look: -1, hat: 'none' });
  arrive(c, pop(T, 'convinced', .4), 640, 520, () => label(c, '?', 0, 0, 140, GOLD, { glow: GOLD }));
} });
S('F2.0', { cams: [[960, 520, 1.06]], sfx: [['pop', 'stop', -12]], draw(c, T) {
  SET.grid(c, T.t);
  worldMap(c, 960, 520, 1500, 800, { stops: [[.12, .36, ''], [.46, .3, ''], [.5, .22, ''], [.62, .28, ''], [.19, .44, '']], p: 1 });
  const p = pop(T, 'stop', .5); if (p > 0) { const px = 960 - 750 + .19 * 1500, py = 520 - 400 + .44 * 800; circ(c, px, py - (1 - easeOut(p)) * 80, 20, GOLD, 4); label(c, 'ONE STOP ON THE TOUR', px + 40, py - 70, 44, '#fff', { align: 'left' }); }
  label(c, 'THE SOVIET EXHIBITION TOUR, 1959', 960, 980, 40, '#e8f1ff', { stroke: false });
} });
S('F2.1', { cams: [[960, 540, 1.0], [820, 600, 1.12]], sfx: [['switch', 'closed', -8], ['steps', 0, -18, { len: 2.2 }]], draw(c, T) {
  if (T.sub === 0) {
    SET.exhibitHall(c, T.t); lunikExhibit(c, 960, 860, 720, { t: T.t });
    const lv = clamp(T.lt / 1.6); P('visitor1', { x: lerp(1200, 2000, lv), y: 960, s: .8, t: T.t, walk: lv < 1, pose: 'idle' }); P('visitor3', { x: lerp(1380, 2200, lv), y: 980, s: .85, t: T.t + 1, walk: lv < 1 });
    // door with a swinging CLOSED sign
    box(c, 1640, 520, 220, 300, 6, '#4a3424'); const sp = T.since('closed'); const sw = sp > 0 ? Math.sin(sp * 9) * .5 * Math.exp(-sp * 2.2) : 0;
    c.save(); c.translate(1750, 560); c.rotate(sw); line(c, -40, 0, -50, 40, 3); line(c, 40, 0, 50, 40, 3); box(c, -90, 40, 180, 70, 6, sp > 0 ? '#b8322a' : '#2f7a4a', 3.5); label(c, sp > 0 ? 'CLOSED' : 'OPEN', 0, 76, 40, '#fff', { stroke: false }); c.restore();
    // banks of light go off one by one on 'closed'
    for (let i = 0; i < 4; i++) { const off = T.since('closed') - i * .2; if (off <= 0) continue; const fl = off < .12 ? (Math.sin(off * 120) > 0 ? .3 : .75) : .78; c.save(); c.globalAlpha = fl; c.fillStyle = '#0a1222'; c.fillRect(-400 + i * 680, -300, 680, H + 600); c.restore(); }
    if (T.since('closed') > .6) lightPool(c, 1750, 600, 220, '#7fd18a', .25);
  } else {
    const L = SET.hallNight(c, T.t); lunikExhibit(c, 1180, 860, 720, { t: T.t });
    const k = easeOut(clamp(T.lt / 1.9));
    [[0, 560], [1, 400], [2, 250], [3, 110]].forEach(([i, tx], j) => { const x = lerp(-260 - j * 120, tx, k); officer(i, { x, y: 960 - (j % 2) * 30, s: .82, t: T.t + j, pose: i === 0 && T.since('quietly') > 0 ? 'shush' : 'sneak', walk: k < 1, expr: 'focus' }); });
    torch(c, lerp(-200, 610, k), 760, -1.15, 640, .2); torch(c, lerp(-340, 300, k), 740, -1.25, 840, .16);
    GRADE.night(c, L, .25);
  }
} });
S('F2.2', { cams: [[960, 560, 1.04], [960, 470, 1.15]], sfx: [['creak', 'access', -12], ['clock', '24', -16, { len: 1.4 }], ['ding', '24', -12]], draw(c, T) {
  if (T.sub === 0) {
    const L = SET.hallNight(c, T.t); lunikExhibit(c, 960, 860, 720, { rope: false, t: T.t });
    ropeLine(c, 960 - 378 - 70, 960 + 378 + 70, 860, 0, easeOut(T.at('access', .7)));
    officer(0, { x: 420, y: 960, s: .85, t: T.t, pose: 'reach', expr: 'focus' }); officer(1, { x: 1540, y: 970, s: .85, t: T.t + 1, pose: 'hold', expr: 'grin', flip: true }); officer(2, { x: 1740, y: 990, s: .8, t: T.t + 2, pose: 'idle', expr: 'neutral', flip: true });
    torch(c, 1500, 740, 1.0, 600, .22); torch(c, 1720, 760, 1.1, 820, .16);
    GRADE.night(c, L, .3);
  } else {
    SET.black(c, T.t); lightPool(c, 960, 470, 700, '#334', .5);
    const p = easeOut(T.at('24', 1.3)), r = 290;
    circ(c, 960, 470, r * 1.06, '#2b2f36'); circ(c, 960, 470, r, '#f6f0dc');
    if (p > 0) { c.save(); c.beginPath(); c.moveTo(960, 470); c.arc(960, 470, r - 8, -Math.PI / 2, -Math.PI / 2 + TAU * p); c.closePath(); c.globalAlpha = .55; c.fillStyle = '#d9342b'; c.fill(); c.restore(); }
    for (let i = 0; i < 24; i++) { const a = i / 24 * TAU - Math.PI / 2; line(c, 960 + Math.cos(a) * r * .84, 470 + Math.sin(a) * r * .84, 960 + Math.cos(a) * r * .94, 470 + Math.sin(a) * r * .94, i % 6 ? 3 : 6); }
    const ha = -Math.PI / 2 + TAU * p; line(c, 960, 470, 960 + Math.cos(ha) * r * .78, 470 + Math.sin(ha) * r * .78, 9, INK); circ(c, 960, 470, 12, INK, 0);
    label(c, 'ABOUT 24 HOURS', 960, 870, 80, '#fff', { glow: p >= 1 ? '#d9342b' : null });
  }
} });
S('F3.0', { cams: [[900, 540, 1.05]], sfx: [['slide', 'measured', -10]], draw(c, T) {
  const L = SET.hallNight(c, T.t); lunik(c, 900, 520, 1400, { glint: T.t });
  const p = easeOut(T.at('measured', .55)), x0 = 205, x1 = lerp(x0, 1590, p);
  if (p > 0) { box(c, x0, 700, x1 - x0, 34, 3, '#ffd23f', 3); for (let x = x0 + 30; x < x1; x += 30) line(c, x, 700, x, x % 150 < 30 ? 724 : 714, 2.5); }
  box(c, x0 - 80, 670, 90, 90, 14, '#c0392b'); circ(c, x0 - 35, 715, 24, '#8a2a20', 3.5);
  officer(1, { x: x0 - 120, y: 1000, s: .9, t: T.t, pose: 'crouch', expr: 'focus' });
  label(c, 'MEASURED', 1500, 900, 64, '#ffd23f', { stroke: true });
  GRADE.night(c, [...L, [900, 520, 900, '#fff3c8', .25]], .25);
} });
const WIRES = [[[290, 470], [480, 430], [760, 430], [1040, 470], [1150, 510]], [[300, 580], [560, 620], [860, 610], [1120, 560], [1190, 520]], [[330, 520], [520, 520], [600, 560], [900, 540], [1000, 500], [1240, 500]]];
S('F3.1', { cams: [[880, 520, 1.08]], sfx: [['elec', 'traced', -14]], draw(c, T) {
  SET.grid(c, T.t, { title: 'LUNIK / WIRING', sub: 'TRACED BY HAND' }); lunik(c, 880, 520, 1300, { blueprint: true });
  WIRES.forEach((pts, i) => { const p = clamp((T.since('traced') - i * .32) / .55); c.save(); c.setLineDash([10, 10]); c.lineWidth = 3; c.strokeStyle = 'rgba(232,241,255,.35)'; c.beginPath(); pts.forEach(([x, y], j) => j ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); c.restore();
    if (p <= 0) return; let tot = 0; const seg = pts.slice(1).map((q, j) => { const d = Math.hypot(q[0] - pts[j][0], q[1] - pts[j][1]); tot += d; return d; }); let rem = tot * p;
    c.save(); c.shadowColor = '#ffcf3f'; c.shadowBlur = 18; c.lineWidth = 7; c.strokeStyle = '#ffcf3f'; c.lineCap = 'round'; c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
    for (let j = 0; j < seg.length; j++) { const u = Math.min(1, rem / seg[j]); c.lineTo(lerp(pts[j][0], pts[j + 1][0], u), lerp(pts[j][1], pts[j + 1][1], u)); rem -= seg[j]; if (rem <= 0) break; } c.stroke(); c.restore(); });
  label(c, 'TRACED THE WIRING', 880, 160, 58, '#ffcf3f', { stroke: false });
} });
S('F3.2', { cams: [[960, 560, 1.06]], sfx: [['pencil', 'studied', -10]], draw(c, T) {
  const L = SET.hallNight(c, T.t); lunik(c, 1180, 520, 1150, { glint: T.t });
  const p = clamp(T.since('studied') / 1.1);
  c.save(); c.lineWidth = 3; c.strokeStyle = 'rgba(255,255,255,.75)'; c.setLineDash([12, 8]);
  for (let i = 0; i < 7; i++) { const k = clamp(p * 7 - i); if (k <= 0) break; const x = 640 + i * 150; c.beginPath(); c.moveTo(x, 520 - 200); c.lineTo(x, 520 - 200 + 400 * k); c.stroke(); }
  for (let j = 0; j < 3; j++) { const k = clamp(p * 3 - j); if (k <= 0) break; const y = 400 + j * 120; c.beginPath(); c.moveTo(600, y); c.lineTo(600 + 1150 * k, y); c.stroke(); } c.restore();
  officer(2, { x: 330, y: 980, s: 1.05, t: T.t, pose: 'hold', expr: 'focus', item: notebookItem, look: 1 });
  label(c, 'STUDIED THE STRUCTURE', 1180, 900, 56, '#fff');
  GRADE.night(c, [...L, [330, 700, 380, '#fff3c8', .35]], .25);
} });
S('F4.0', { cams: [[930, 520, 1.0], [1000, 520, 1.12]], shakes: [['removed']], sfx: [['whoosh2', 'engine', -14], ['stamp', 'removed', -4]], draw(c, T) {
  SET.grid(c, T.t, { title: 'LUNIK / UPPER STAGE', sub: 'AS FOUND' }); const L = 1150, cx = 1000, cy = 500; lunik(c, cx, cy, L, { blueprint: true });
  // engine (gone): a dashed bell that slides out of the base
  const pe = easeOut(T.at('engine', .9)), ex = cx - L / 2 - 40 - pe * 160;
  c.save(); c.globalAlpha = lerp(1, .55, pe); c.setLineDash(pe > .05 ? [14, 10] : []); c.lineWidth = 4; c.strokeStyle = pe > .05 ? '#ff8a7a' : '#e8f1ff';
  c.beginPath(); c.moveTo(ex + 30, cy - 70); c.lineTo(ex - 120, cy - 150); c.lineTo(ex - 120, cy + 150); c.lineTo(ex + 30, cy + 70); c.closePath(); c.stroke(); c.restore();
  label(c, 'ENGINE', ex - 50, cy - 200, 40, pe > .05 ? '#ff8a7a' : '#e8f1ff', { stroke: false });
  // electronics racks: solid until 'electronics', then dashed outlines
  const pr = T.at('electronics', .5);
  [[cx + 130, cy - 95], [cx + 130, cy + 45], [cx - 270, cy - 125]].forEach(([x, y], i) => { c.save(); c.setLineDash(pr > 0 ? [10, 8] : []); c.lineWidth = 3.5; c.strokeStyle = pr > 0 ? '#ff8a7a' : '#e8f1ff'; c.strokeRect(x, y, 90, 70); if (pr < 1) { c.globalAlpha = 1 - pr; for (let k = 0; k < 3; k++) line(c, x + 12, y + 16 + k * 18, x + 78, y + 16 + k * 18, 3, '#e8f1ff'); } c.restore(); });
  label(c, 'ELECTRONICS', cx + 175, cy - 150, 34, pr > 0 ? '#ff8a7a' : '#e8f1ff', { stroke: false });
  stamp(c, ex - 50, cy + 230, 'REMOVED', T.at('removed', .3), '#ff5a4a', { w: 300, h: 80, rot: -.12 });
  stamp(c, cx + 200, cy + 230, 'REMOVED', T.at('removed', .3, .2), '#ff5a4a', { w: 300, h: 80, rot: .08 });
} });
S('F5.0', { cams: [[960, 500, 1.05]], shakes: [['prop']], sfx: [['stamp', 'prop', -3], ['paper', 'remained', -14]], draw(c, T) {
  const L = SET.hallNight(c, T.t); lunikExhibit(c, 960, 900, 980, { t: T.t, glow: 1 });
  // the analysts' assumption hangs off the nose, then falls when the stamp lands
  const tp = T.at('remained', .5), fall = clamp(T.since('prop') / .9);
  if (tp > 0 && fall < 1) { c.save(); c.translate(1380, 470 + fall * fall * 500); c.rotate(.15 + fall * 1.6); c.globalAlpha = clamp(tp * 2) * (1 - fall); line(c, 0, -80, 0, 0, 3, '#ddd'); box(c, -110, 0, 220, 90, 8, '#f6f1e2', 3.5); label(c, 'MOCK-UP?', 0, 45, 40, INK, { stroke: false }); c.restore(); }
  stamp(c, 900, 600, 'NOT A PROP', T.at('prop', .3), '#ff4a3d', { w: 560, h: 130, rot: -.1 });
  torch(c, 200, 300, -1.0, 900, .14); torch(c, 1720, 300, 1.0, 900, .14);
  GRADE.night(c, [...L, [960, 620, 600, '#fff3c8', .25]], .22);
} });
S('F5.1', { cams: [[880, 560, 1.12], [960, 520, 1.0]], sfx: [['hammer', 'real', -14], ['ding', 'production', -16]], draw(c, T) {
  const L = SET.hallNight(c, T.t); lunik(c, 1060, 470, 1300, { glint: T.t, glow: 1 });
  const h = officer(0, { x: 470, y: 1000, s: 1.15, t: T.t, pose: 'reach', expr: T.since('soviet') > 0 ? 'shock' : 'focus' });
  officer(3, { x: 230, y: 1010, s: 1.0, t: T.t + 2, pose: 'idle', expr: T.since('real') > 0 ? 'grin' : 'neutral' });
  const kx = 470 + 150 * 1.15, ky = 1000 - 300 * 1.15;
  [0, .45, .9].forEach(d => { const s = T.since('real') - d; if (s < 0 || s > .7) return; for (let k = 0; k < 3; k++) { c.save(); c.globalAlpha = (1 - s / .7) * .9; c.lineWidth = 5; c.strokeStyle = '#fff'; c.beginPath(); c.arc(kx + 20, ky, 30 + k * 26 + s * 90, -1.1, 1.1); c.stroke(); c.restore(); } });
  arrive(c, pop(T, 'real', .4), 1220, 770, () => label(c, 'REAL', 0, 0, 96, GOLD, { glow: GOLD }));
  arrive(c, pop(T, 'production', .4), 1220, 860, () => label(c, 'PRODUCTION-BUILT', 0, 0, 58, '#fff'));
  arrive(c, pop(T, 'soviet', .4), 1220, 940, () => label(c, 'SOVIET SPACE VEHICLE', 0, 0, 50, '#ffb04a'));
  GRADE.night(c, [...L, [1060, 470, 800, '#fff3c8', .22]], .22);
} });
S('F6.0', { cams: [[960, 520, 1.04]], shakes: [['enough']], sfx: [['clock', 0, -14, { len: 2.2 }], ['bell', 'enough', -10]], draw(c, T) {
  const L = SET.hallNight(c, T.t);
  const e = T.cue('enough'), rem = 1 - clamp((T.t - T.shot.start) / Math.max(.3, e - T.shot.start)); const wob = T.since('enough') > 0 ? Math.sin(T.since('enough') * 40) * .08 * Math.exp(-T.since('enough') * 3) : 0;
  c.save(); c.translate(960, 380); c.rotate(wob); const r = 230; circ(c, 0, 0, r * 1.07, '#2b2f36'); circ(c, 0, 0, r, '#f6f0dc');
  if (rem > 0) { c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, r - 10, -Math.PI / 2, -Math.PI / 2 + TAU * rem); c.closePath(); c.globalAlpha = .6; c.fillStyle = rem < .2 ? '#d9342b' : '#e0b13e'; c.fill(); c.globalAlpha = 1; }
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; line(c, Math.cos(a) * r * .82, Math.sin(a) * r * .82, Math.cos(a) * r * .93, Math.sin(a) * r * .93, 4); }
  label(c, 'ONE DAY', 0, r * .42, 46, INK, { stroke: false }); box(c, -20, -r - 46, 40, 40, 6, '#9aa3ab'); c.restore();
  officer(0, { x: 520, y: 1040, s: 1.0, t: T.t, expr: 'worried', pose: 'idle', sweat: T.since('enough') > 0, look: 1 });
  officer(1, { x: 1400, y: 1040, s: 1.0, t: T.t + 1, expr: 'worried', pose: 'hips', flip: true, look: -1 });
  officer(2, { x: 1680, y: 1060, s: .92, t: T.t + 2, expr: T.since('enough') > 0 ? 'shock' : 'worried', flip: true });
  label(c, "ONE DAY WASN'T ENOUGH", 960, 740, 56, '#fff', { glow: null });
  GRADE.night(c, [...L, [960, 380, 500, '#fff3c8', .3]], .25); GRADE.dawn(c, .25 * clamp(T.lt / 3));
} });
S('F7.0', { cams: [[960, 540, 1.0], [1290, 520, 1.25]], sfx: [['pencil', 'copied', -10, { len: 1.6 }], ['deflate', 'who', -14]], draw(c, T) {
  SET.desk(c, T.t, { lx: 960, ly: 520 });
  // open notebook
  c.save(); c.translate(960, 540); c.rotate(-.02); reg(c, -720, -400, 720, 400);
  c.save(); c.globalAlpha = .35; box(c, -700, -370, 1420, 790, 10, '#000', 0); c.restore(); box(c, -710, -390, 1420, 780, 10, '#5a3a24'); box(c, -690, -372, 680, 744, 4, '#f7f2e2', 3); box(c, 10, -372, 680, 744, 4, '#f7f2e2', 3);
  for (let i = 0; i < 14; i++) { line(c, -670, -330 + i * 50, -30, -330 + i * 50, 2, 'rgba(90,130,180,.35)'); line(c, 30, -330 + i * 50, 670, -330 + i * 50, 2, 'rgba(90,130,180,.35)'); }
  label(c, 'MARKINGS (COPIED)', -350, -310, 40, '#3d342a', { stroke: false });
  const n = 5; for (let i = 0; i < n; i++) marking(c, -540 + (i % 2) * 300, -180 + Math.floor(i / 2) * 170, i, clamp((T.since('copied') - i * .22) / .3));
  // pencil follows the newest marking
  const k = clamp(T.since('copied') / (n * .22 + .3)); if (k > 0 && k < 1) { const i = Math.min(n - 1, Math.floor(k * n)); c.save(); c.translate(-470 + (i % 2) * 300, -170 + Math.floor(i / 2) * 170); c.rotate(.7); box(c, -10, -150, 20, 160, 3, '#d9a441', 3); poly(c, [[-10, 10], [10, 10], [0, 40]], '#f2d0a4', 3); c.restore(); }
  // right page: empty, then the question
  const q = pop(T, 'who', .5); if (q > 0) { c.globalAlpha = clamp(q * 2); label(c, 'WHO BUILT IT?', 350, -260, 64, '#b8322a', { stroke: false }); factorySil(c, 380, 230, .9);
    c.save(); c.setLineDash([16, 12]); c.lineWidth = 7; c.strokeStyle = '#b8322a'; c.beginPath(); c.moveTo(-60, 0); c.lineTo(80, 20); c.stroke(); c.beginPath(); c.moveTo(130, 30); c.lineTo(220, 60); c.stroke(); c.restore(); c.globalAlpha = 1; }
  if (T.since('not') > 0 && q <= 0) label(c, 'NOT ENOUGH', 350, 0, 54, '#9a917c', { stroke: false });
  c.restore();
} });
S('F8.0', { cams: [[960, 540, 1.0], [1000, 600, 1.1]], sfx: [['inflate', 'longer', -14]], draw(c, T) {
  SET.paper(c, T.t);
  label(c, 'TIME WITH THE LUNIK', 960, 170, 60, INK, { stroke: false });
  label(c, 'FIRST LOOK', 330, 430, 44, INK, { stroke: false, align: 'left' }); box(c, 700, 395, 200, 70, 10, '#9ec5e8'); label(c, '~24 HRS', 800, 430, 34, INK, { stroke: false });
  const s2 = pop(T, 'second', .45); arrive(c, s2, 0, 0, () => { label(c, 'SECOND LOOK', 330, 650, 44, INK, { stroke: false, align: 'left' });
    const g = easeOut(T.at('longer', 1.1)), w = lerp(200, 1080, g); box(c, 700, 615, w, 70, 10, '#e0b13e'); if (g > .9) label(c, 'MUCH LONGER', 700 + w / 2, 650, 40, INK, { stroke: false }); });
  P('analyst', { x: 1660, y: 1010, s: .82, t: T.t, pose: 'point', flip: true, expr: T.since('longer') > 0 ? 'focus' : 'neutral' });
} });
S('F8.1', { cams: [[900, 560, 1.06]], sfx: [['hit', 'watching', -12]], draw(c, T) {
  const L = SET.hallNight(c, T.t); lunikExhibit(c, 1120, 880, 760, { t: T.t, glow: 1 });
  const g = P('guard', { x: 380, y: 980, s: 1.15, t: T.t, expr: 'stern' });
  GRADE.night(c, L, .3); GRADE.dark(c, .55);
  cone(c, 1120, -60, 140, 700, 1000, '#fff2cc', .22); lightPool(c, 1120, 640, 520, '#fff2cc', .35);
  const e = easeOut(T.at('watching', .35)); if (e > 0) { const hy = 980 - 300 * 1.15, hx = 380; [-26, 26].forEach(d => { c.save(); c.shadowColor = '#ff4a3d'; c.shadowBlur = 24; ell(c, hx + d, hy, 13, 11 * e, '#ff6a5a', 0); c.restore(); }); }
  label(c, 'NEXT TIME, THE SOVIETS WOULD BE WATCHING', 1120, 1000, 40, '#c9b9a8', { stroke: false });
} });

// ======================= FOLLOW THE PAPERWORK =======================
chap('P1.0', 4, 'Follow the Paperwork');
const PAPERS = [[520, 360, -.18, 'r'], [1360, 330, .14, 'r'], [760, 720, .08, 'm'], [1180, 760, -.1, 'r'], [600, 560, .22, 'n'], [1420, 600, -.2, 'r'], [960, 420, -.05, 'r'], [940, 640, .06, 'm']];
S('P1.1', { cams: [[960, 540, 1.0], [1000, 600, 1.15]], sfx: [['paper', 0, -14], ['page', 'paperwork', -12]], draw(c, T) {
  SET.desk(c, T.t, { lx: 960, ly: 520 }); const t0 = T.line.words[0].s + .9;
  PAPERS.forEach(([x, y, r, k], i) => { const p = clamp((T.t - t0 - i * .2) / .3); if (p <= 0) return; c.save(); c.translate(0, -(1 - easeOut(p)) * 60); c.globalAlpha = clamp(p * 3);
    if (k === 'm') manifest(c, x, y, 420, 340, { rot: r }); else if (k === 'n') paper1959(c, x, y, 380, 300, 'LUNIK', { rot: r }); else reportPage(c, x, y, 380, 480, { rot: r, title: i % 2 ? 'CABLE' : 'REPORT', seed: i + 2 }); c.restore(); });
  const m = easeOut(T.at('paperwork', 1.0)); if (m > 0) { const mx = lerp(300, 940, m), my = lerp(820, 640, m);
    magnifier(c, mx, my, 170, () => { c.save(); c.translate(mx, my); c.scale(1.7, 1.7); c.translate(-mx, -my); manifest(c, 940, 640, 420, 340, { rot: .06 }); c.restore(); });
    circ(c, mx, my, 170, null, 10); line(c, mx + 120, my + 120, mx + 260, my + 260, 26, '#5a3a24'); line(c, mx + 120, my + 120, mx + 260, my + 260, 14, '#8a5a3b'); }
  label(c, 'THROUGH PAPERWORK', 960, 1010, 50, '#ffe9a8');
} });
S('P2.0', { cams: [[960, 520, 1.06]], shakes: [['intercepted']], sfx: [['stamp', 'intercepted', -4]], draw(c, T) {
  SET.desk(c, T.t, { lx: 960, ly: 500 }); manifest(c, 960, 540, 820, 680, {});
  stamp(c, 1180, 300, 'INTERCEPTED', T.at('intercepted', .3), '#d9342b', { w: 520, h: 110, rot: .12 });
} });
S('P2.1', { cams: [[960, 540, 1.1]], sfx: [['slide', 'models', -10, { len: 1 }]], draw(c, T) {
  SET.desk(c, T.t, { lx: 960, ly: 560 }); const hl = T.at('models', 1.3);
  const w0 = 1200, h0 = 900; manifest(c, 960, 560, w0, h0, { hl, rot: 0 });
  const sc = w0 / 760, h = h0 * 760 / w0, ry = (-h / 2 + 130 + 2 * (h - 170) / 5) * sc + 560, px = 960 + (-760 / 2 + 26 + (760 - 52) * easeOut(hl)) * sc;
  if (hl > 0 && hl < 1.0) { c.save(); c.translate(px, ry - 10); c.rotate(-.5); box(c, -18, -150, 36, 150, 8, '#ffe16a', 3.5); box(c, -18, -40, 36, 40, 4, '#2b2f36', 3); c.restore(); }
} });
S('P2.2', { cams: [[960, 520, 1.06]], sfx: [['switch', 'identical', -8]], draw(c, T) {
  SET.grid(c, T.t, { title: 'MANIFEST vs LUNIK', sub: 'DIMENSIONS' }); lunik(c, 960, 520, 1100, { blueprint: true });
  label(c, 'LUNIK', 960, 290, 40, '#e8f1ff', { stroke: false });
  const m = easeOut(clamp(T.since('dimensions') / Math.max(.4, T.cue('identical') - T.cue('dimensions'))));
  const tx = 960, ty = 520, tw = 1200, th = 400; const x = lerp(1380, tx, m), y = lerp(240, ty, m), w = lerp(820, tw, m), h = lerp(260, th, m);
  c.save(); c.setLineDash([18, 12]); c.lineWidth = 6; c.strokeStyle = '#ffb04a'; c.strokeRect(x - w / 2, y - h / 2, w, h); c.restore();
  label(c, 'CRATE, PER THE MANIFEST', x, y - h / 2 - 34, 38, '#ffb04a', { stroke: false });
  const ok = pop(T, 'identical', .4); arrive(c, ok, 960, 860, () => label(c, 'ALMOST IDENTICAL', 0, 0, 70, '#7fe08a', { glow: '#3ee07a' }));
} });
S('P3.0', { cams: [[960, 540, 1.0]], sfx: [['typewriter', 0, -14, { len: 2.3 }], ['bell', 'ready', -10]], draw(c, T) {
  SET.spot(c, T.t, { x: 520 });
  typewriter(c, 520, 900, 1.5); const lines = ['TO: NEAREST STATION', 'LUNIK, NEXT STOP', 'GET READY'];
  const total = lines.join('').length, n = Math.floor(total * clamp((T.t - T.shot.start) / Math.max(.5, T.cue('ready') - T.shot.start + .1)));
  typedPaper(c, 520, 560, lines, n);
  worldMap(c, 1360, 470, 940, 560, {});
  const p = pop(T, 'ready', .4); if (p > 0) { const px = 1360 - 470 + .19 * 940, py = 470 - 280 + .44 * 560; circ(c, px, py - (1 - easeOut(p)) * 90, 18, GOLD, 4); label(c, 'NEXT STOP', px, py + 56, 38, '#fff'); }
} });
S('P4.0', { cams: [[960, 520, 1.04], [1000, 600, 1.18]], shakes: [['confirmed']], sfx: [['slide', 'never', -10], ['stamp', 'confirmed', -4]], draw(c, T) {
  SET.desk(c, T.t, { lx: 960, ly: 520 });
  caseForm(c, 960, 520, [['AGENCY', 'CIA'], ['OBJECT', 'LUNIK'], ['YEAR', '1959'], ['LOCATION', '', T.at('never', .5)]], { title: 'OPERATION FILE' });
  stamp(c, 1060, 820, 'NOT OFFICIALLY CONFIRMED', T.at('confirmed', .3), '#d9342b', { w: 720, h: 100, rot: -.06 });
} });
S('P5.0', { cams: [[960, 540, 1.04], [1000, 520, 1.14]], sfx: [['paper', 0, -12]], draw(c, T) {
  SET.desk(c, T.t, { lx: 900, ly: 500 }); const a = easeOut(clamp(T.lt / .5 + (T.sub ? 1 : 0)));
  c.save(); c.translate(lerp(1500, 820, a), 540); c.rotate(lerp(.3, -.04, a)); reg(c, -330, -440, 330, 440);
  c.save(); c.globalAlpha = .35; box(c, -310, -410, 660, 860, 6, '#000', 0); c.restore(); box(c, -320, -430, 640, 860, 6, '#1d2a3a');
  label(c, 'MIT TECHNOLOGY REVIEW', 0, -350, 46, '#f3efe6', { stroke: false, maxW: 560 }); line(c, -270, -310, 270, -310, 3, '#f3efe6');
  c.save(); c.translate(0, 20); lunik(c, 0, -60, 420, { blueprint: true }); c.restore(); crate(c, 0, 230, 440, { stencil: false });
  if (T.since('jeff') > 0 || T.sub) { box(c, -230, 300, 460, 70, 8, '#f3efe6', 3); label(c, 'BY JEFF MAYSH', 0, 335, 40, INK, { stroke: false }); }
  c.restore();
  arrive(c, pop(T, 'detailed', .4), 1450, 420, () => tag(c, 'THE MOST DETAILED REPORTING', 0, 0, 1, { size: 36 }));
  arrive(c, pop(T, 'jeff', .4), 1450, 560, () => tag(c, 'JOURNALIST JEFF MAYSH', 0, 0, 1, { size: 36, bg: '#e8f1ff', fg: '#1d2a3a' }));
} });
S('P5.1', { cams: [[960, 540, 1.0], [1060, 660, 1.3]], sfx: [['pop', 'mexico', -8]], draw(c, T) {
  SET.grid(c, T.t); const pos = mapMexico(c, 960, 520, 1360, 860, { tampico: false, city: false });
  const p = pop(T, 'mexico', .45); const [mx, my] = pos.city;
  if (p <= 0) label(c, 'WHERE?', 960, 980, 54, '#e8f1ff', { stroke: false });
  if (p > 0) { const dy = (1 - easeOut(p)) * 120; c.save(); c.translate(mx, my - dy); poly(c, [[0, 0], [-26, -50], [26, -50]], '#d9342b', 4); circ(c, 0, -62, 30, '#d9342b', 4); circ(c, 0, -62, 11, '#fff', 0); c.restore();
    label(c, 'MEXICO CITY', mx, my + 50, 56, '#fff'); tag(c, 'PER MAYSH', mx + 230, my - 70, clamp(p * 1.5 - .3)); }
} });
S('P6.0', { cams: [[900, 560, 1.08]], sfx: [['crickets', 0, -22, { len: 2 }]], draw(c, T) {
  NIGHT_SKY(c, T.t, '#2a3a5e', '#d98a5a', 8); skyline(c, 760, '#24304a', null, 5, .8); FLOOR(c, 860, '#4a4540');
  embassyFacade(c, 860, 860, 900, { t: T.t }); palm(c, 1520, 870, .95, T.t); palm(c, 230, 880, .8, T.t + 2); sodiumLamp(c, 1300, 880, 380, .7);
  GRADE.warm(c, .2);
  caption(c, 'THE CIA STATION', T.at('station', .5), { y: 1000 });
} });
S('P6.1', { cams: [[900, 540, 1.04], [1150, 560, 1.12]], sfx: [['paper', 0, -12], ['typewriter', 'former', -18, { len: .8 }], ['typewriter', 'alabama', -18, { len: .5 }]], draw(c, T) {
  SET.desk(c, T.t, { lx: 900, ly: 520 });
  const roles = ['CIA STATION CHIEF']; if (T.since('former') > 0) roles.push('FORMER FBI CRYPTOGRAPHER'); if (T.since('alabama') > 0) roles.push('FROM ALABAMA');
  dossier(c, 820, 560, 1060, { who: 'scott', name: 'WINSTON SCOTT', role: roles, stamp: 'CLASSIFIED', sp: 1, p: clamp(T.lt / .4 + (T.sub ? 1 : 0)), t: T.t });
  cipherWheel(c, 1560, 760, 170, T.t * .5, pop(T, 'cryptographer', .5));
} });
S('P7.0', { cams: [[960, 520, 1.06], [960, 500, 1.0]], sfx: [['page', 'october', -12]], draw(c, T) {
  if (T.sub === 0) {
    SET.desk(c, T.t, { lx: 960, ly: 520 });
    arrive(c, pop(T, 'october', .45), 960, 520, () => calendar(c, 0, 0, 560, 520, '1959', 'LATE OCT'));
    tag(c, 'PER MAYSH', 1440, 300, clamp(T.lt / .4));
  } else {
    const L = SET.embassyOffice(c, T.t, { noDesk: true });
    calendar(c, 1000, 330, 200, 190, '1959', 'OCT');
    P('scott', { x: 1000, y: 860, s: .95, t: T.t, pose: 'clipboard', expr: 'focus', item: (cc, h) => paperSheet(cc, (h[0][0] + h[1][0]) / 2, (h[0][1] + h[1][1]) / 2 - 30, 0, 1) });
    officeDesk(c); tag(c, 'PER MAYSH', 1520, 160, 1);
  }
} });
S('P7.1', { cams: [[960, 540, 1.0]], sfx: [['bell', 'called', -14]], draw(c, T) {
  SET.embassyOffice(c, T.t, { noDesk: true }); const on = T.since('called') > -.2;
  P('scott', { x: 820, y: 860, s: .95, t: T.t, pose: on ? 'phone' : 'idle', expr: 'neutral', talk: T.since('called') > .3 });
  officeDesk(c, { lifted: on });
  // the other end of the line: an unnamed officer, still in shadow
  const ip = easeOut(T.at('called', .4)); if (ip > 0) { c.save(); c.globalAlpha = clamp(ip * 2); c.beginPath(); c.arc(1500, 400, 250 * ip, 0, TAU); c.save(); c.clip(); bg(c, '#1a2233', '#0d121c');
    P('silveti', { x: 1500, y: 760, s: 1.0, t: T.t, pose: 'phone', expr: 'focus', hat: 'fedora', hatCol: '#1d1f24' }); c.fillStyle = 'rgba(10,14,24,.55)'; c.fillRect(1200, 100, 600, 600); c.restore();
    circ(c, 1500, 400, 250 * ip, null, 8); label(c, '?', 1500, 330, 90, '#ffe9a8', { stroke: false });
    const r = T.since('called'); if (r > 0 && r < 1.2) for (let k = 0; k < 3; k++) { c.save(); c.globalAlpha = 1 - r / 1.2; c.lineWidth = 5; c.strokeStyle = '#ffe9a8'; c.beginPath(); c.arc(1500, 400, 270 + k * 22 + r * 40, -.6, .6); c.stroke(); c.restore(); }
    c.restore(); }
} });
S('P7.2', { cams: [[900, 560, 1.06]], sfx: [['steps', 0, -16, { len: 2.6 }], ['door', 'embassy', -14]], draw(c, T) {
  NIGHT_SKY(c, T.t, '#1d2a4a', '#b8704a', 10); FLOOR(c, 900, '#4a4540');
  embassyFacade(c, 1150, 900, 1300, { t: T.t, night: true }); const dp = easeOut(T.at('embassy', .6));
  box(c, 1150 - 70, 900 - 140, 140, 140, 6, '#ffd27a'); box(c, 1150 - 70, 900 - 140, 140 * (1 - dp * .8), 140, 6, '#5d4037');
  const k = clamp(T.lt / (T.d * .9)); const x = lerp(120, 960, k);
  P('silveti', { x, y: 960, s: 1.0, t: T.t, walk: k < 1, pose: 'idle', expr: 'focus', hat: 'fedora', hatCol: '#1d1f24' });
  arrive(c, pop(T, '30', .4), x, 560, () => tag(c, 'AGE 30', 0, 0, 1, { size: 34 }));
  arrive(c, pop(T, 'secret', .4), x, 640, () => tag(c, "MEXICO'S SECRET POLICE", 0, 0, 1, { size: 34, bg: '#e8f1ff', fg: '#1d2a3a' }));
  GRADE.night(c, [[1150, 820, 360, '#ffd27a', .35 + dp * .35]], .3);
} });
S('P8.0', { cams: [[900, 540, 1.06]], sfx: [['stamp', 'eduardo', -10]], draw(c, T) {
  SET.desk(c, T.t, { lx: 900, ly: 520 });
  dossier(c, 880, 560, 1080, { who: 'silveti', name: 'EDUARDO DÍAZ SILVETI', role: ['MEXICAN SECRET POLICE', 'AGE 30'], source: 'PER MAYSH', stamp: 'CLASSIFIED', sp: T.at('eduardo', .3), p: clamp(T.lt / .3), t: T.t });
} });
S('P9.0', { cams: [[960, 560, 1.0], [880, 520, 1.14]], sfx: [['paper', 'silvettis', -16]], draw(c, T) {
  SET.embassyOffice(c, T.t, { noDesk: true });
  P('scott', { x: 1080, y: 860, s: .95, t: T.t, pose: 'lean', expr: 'focus', talk: true, flip: true });
  officeDesk(c);
  P('silveti', { x: 560, y: 1000, s: 1.05, t: T.t + 3, pose: 'idle', legs: 'sit', expr: 'neutral', hat: 'none', look: 1 });
  box(c, 440, 900, 240, 30, 6, '#6d4428'); line(c, 460, 930, 460, 1010, 8); line(c, 660, 930, 660, 1010, 8);
  tag(c, "SILVETI'S ACCOUNT", 520, 170, pop(T, 'silvettis', .4), { size: 38 });
} });
S('P9.1', { cams: [[960, 540, 1.08]], shakes: [['vital']], sfx: [['stamp', 'vital', -3]], draw(c, T) {
  SET.desk(c, T.t, { lx: 960, ly: 520 });
  c.save(); c.translate(960, 540); c.rotate(-.03); reg(c, -500, -360, 500, 330); box(c, -440, -360, 300, 60, 10, '#d9b26e'); box(c, -500, -320, 1000, 650, 10, '#e2bd78');
  label(c, 'THE MISSION', -290, -332, 30, '#7a5a20', { stroke: false }); for (let i = 0; i < 4; i++) line(c, -400, -160 + i * 70, 300 - i * 60, -160 + i * 70, 5, 'rgba(122,90,32,.45)'); c.restore();
  stamp(c, 960, 600, 'VITAL', T.at('vital', .3), '#d9342b', { w: 520, h: 170, rot: -.1 });
  tag(c, "SILVETI'S ACCOUNT", 1460, 180, 1);
} });
S('P9.2', { cams: [[960, 520, 1.04]], sfx: [['hit', 'warned', -16]], draw(c, T) {
  SET.embassyOffice(c, T.t, { noDesk: true }); const w = T.since('warned');
  P('scott', { x: 1250, y: 1080, s: 1.4, t: T.t, pose: w > 0 ? 'holdUp' : 'lean', expr: w > 0 ? 'worried' : 'focus', talk: true, flip: true });
  P('silveti', { x: 640, y: 1100, s: 1.4, t: T.t + 3, pose: 'idle', expr: w > .4 ? 'shock' : 'neutral', hat: 'none', look: 1, sweat: w > .6 });
  tag(c, "SILVETI'S ACCOUNT", 960, 120, 1);
} });
S('P9.3', { cams: [[960, 500, 1.08]], shakes: [['world']], sfx: [['crumble', 'world', -8], ['elec', 'war', -12]], draw(c, T) {
  SET.embassyOffice(c, T.t, { night: true, noDesk: true });
  box(c, 300, 760, 1320, 40, 8, '#6d4428'); box(c, 320, 800, 1280, 300, 6, '#5a3820');
  line(c, 960, 760, 960, 680, 14, '#8a6a40'); ell(c, 960, 760, 110, 22, '#6a4a30', 4); c.beginPath(); c.arc(960, 470, 250, Math.PI * .6, Math.PI * 1.6); c.lineWidth = 10; c.strokeStyle = '#c9a14a'; c.stroke();
  globe(c, 960, 470, 220, T.t * .3);
  const cp = clamp(T.since('world') / .7); if (cp > 0) { const pts = [[880, 260], [930, 340], [900, 410], [980, 470], [940, 560], [1010, 640], [990, 690]]; c.save(); c.beginPath(); c.arc(960, 470, 220, 0, TAU); c.clip(); c.lineWidth = 7; c.strokeStyle = INK; c.lineJoin = 'round'; c.beginPath(); const n = 1 + (pts.length - 1) * cp; pts.forEach(([x, y], i) => { if (i < n) i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke();
    if (cp > .5) { line(c, 900, 410, 820, 450, 5); line(c, 980, 470, 1080, 430, 5); } c.restore(); }
  const flick = T.since('world') > 0 && T.since('world') < 1.1 ? (Math.sin(T.since('world') * 47) > .2 ? .45 : 0) : 0;
  lightPool(c, 960, 470, 520, '#ffd27a', .25); GRADE.dark(c, .2 + flick);
  arrive(c, pop(T, 'world', .4), 960, 930, () => label(c, 'COULD START WORLD WAR III', 0, 0, 62, '#ff6a5a', { glow: '#d9342b' }));
  tag(c, "SILVETI'S ACCOUNT", 300, 120, 1);
} });
S('P10.0', { cams: [[960, 520, 1.06], [1000, 540, 1.0]], sfx: [['page', 'november', -12], ['pencil', '19th', -10]], draw(c, T) {
  if (T.sub === 0) { SET.desk(c, T.t, { lx: 960, ly: 520 }); calendar(c, 960, 520, 560, 520, 'NOV 1959', '19', { circle: T.at('19th', .6) }); }
  else { SET.grid(c, T.t); const pos = mapMexico(c, 960, 520, 1300, 840, {}); const [ax, ay] = pos.city, [bx, by] = pos.tampico;
    const p = easeOut(clamp(T.lt / 1.3)); c.save(); c.setLineDash([16, 12]); c.lineWidth = 7; c.strokeStyle = '#ffcf3f'; c.beginPath(); c.moveTo(ax, ay); const N = 24; for (let i = 1; i <= N * p; i++) { const u = i / N; c.lineTo(lerp(ax, bx, u) - Math.sin(u * Math.PI) * 50, lerp(ay, by, u)); } c.stroke(); c.restore();
    const u = p, hx = lerp(ax, bx, u) - Math.sin(u * Math.PI) * 50, hy = lerp(ay, by, u); [-22, 22].forEach(d => { ell(c, hx + d, hy - 30, 26, 8, '#3a3530', 3); box(c, hx + d - 15, hy - 52, 30, 22, 6, '#3a3530', 3); });
    label(c, "TWO OF SCOTT'S OFFICERS", 960, 990, 46, '#e8f1ff', { stroke: false }); }
} });
S('P10.1', { cams: [[760, 540, 1.1]], sfx: [['paper', 'deputy', -10]], draw(c, T) {
  SET.desk(c, T.t, { lx: 800, ly: 520 });
  dossier(c, 760, 540, 960, { who: 'dean', name: T.since('dean') > 0 ? 'WARREN DEAN' : 'WARREN ...', role: ["SCOTT'S DEPUTY"], p: pop(T, 'deputy', .35), t: T.t });
} });
S('P10.2', { cams: [[960, 540, 1.0]], sfx: [['paper', 'robert', -10], ['whoosh1', 'reportedly', -16]], draw(c, T) {
  const cut = T.t >= T.cue('reportedly') - .06;
  if (!cut) { SET.desk(c, T.t, { lx: 960, ly: 520 });
    dossier(c, 560, 540, 760, { who: 'dean', name: 'WARREN DEAN', role: ["SCOTT'S DEPUTY"], p: 1, t: T.t, rot: -.04 });
    dossier(c, 1360, 560, 760, { who: 'zambernardi', name: T.since('zambr') > 0 ? 'ROBERT ZAMBERNARDI' : 'ROBERT ...', role: ['CASE OFFICER'], p: pop(T, 'robert', .35), t: T.t, rot: .03 }); return; }
  const L = SET.port(c, T.t, { crane: .25 });
  // barrels in the foreground; the two officers peek over them with binoculars
  const look = { hands: [[-34, -300], [34, -300]], item: binocItem };
  P('dean', { x: 760, y: 1060, s: 1.05, t: T.t, expr: 'focus', ...look }); P('zambernardi', { x: 1060, y: 1070, s: 1.05, t: T.t + 2, expr: 'focus', ...look });
  [560, 720, 880, 1040, 1200, 1360].forEach((x, i) => { box(c, x - 80, 880 - (i % 2) * 14, 160, 220, 18, i % 3 ? '#4a5a6a' : '#7a3b2e'); line(c, x - 80, 940 - (i % 2) * 14, x + 80, 940 - (i % 2) * 14, 5); line(c, x - 80, 1030 - (i % 2) * 14, x + 80, 1030 - (i % 2) * 14, 5); });
  tag(c, 'REPORTEDLY', 960, 120, 1, { size: 38 });
  GRADE.night(c, L, .2);
} });
S('P10.3', { cams: [[900, 540, 1.04]], sfx: [['horn', 'ship', -18], ['creak', 'unload', -12]], draw(c, T) {
  const cr = lerp(.15, 1, easeOut(clamp(T.since('unload') / 1.6))); const L = SET.port(c, T.t, { crane: cr });
  P('guard', { x: 1380, y: 900, s: .7, t: T.t, expr: 'stern' }); P('guard', { x: 1540, y: 905, s: .7, t: T.t + 1, expr: 'stern', flip: true });
  caption(c, 'PORT OF TAMPICO · NOV 19, 1959', T.at('tampico', .5) || (T.since('unload') > .6 ? .99 : 0), { y: 1000 });
  GRADE.night(c, L, .2);
} });
S('P11.0', { cams: [[960, 560, 1.0], [1000, 600, 1.0]], sfx: [['train', 'train', -16, { len: 3.5 }]], draw(c, T) {
  if (T.sub === 0) {
    const L = SET.railYard(c, T.t, { noTrain: true }); const dx = T.lt * 30;
    freightTrain(c, 1560 + dx, 740, .72, { cars: ['crate', 'crate', 'box'], night: true, t: T.t, smoke: true });
    P('guard', { x: 640, y: 960, s: .95, t: T.t, expr: 'stern' }); P('guard', { x: 1180, y: 970, s: .95, t: T.t + 1, expr: 'stern', flip: true });
    arrive(c, pop(T, 'guard', .4), 910, 430, () => label(c, 'UNDER GUARD', 0, 0, 64, '#ffb04a'));
    GRADE.night(c, L, .3);
  } else {
    SET.grid(c, T.t); const k = clamp(T.lt / Math.max(.5, T.cue('capital') - T.shot.start + .2)); mapMexico(c, 960, 520, 1300, 840, { p: k, cityLabel: 'THE CAPITAL' });
    const w = 1300, h = 840, T_ = [w * .63, h * .52], M_ = [w * .55, h * .72], u = k; const hx = 960 - w / 2 + lerp(T_[0], M_[0], u) + Math.sin(u * Math.PI) * w * .04, hy = 520 - h / 2 + lerp(T_[1], M_[1], u);
    box(c, hx - 30, hy - 50, 60, 36, 6, '#2c2f33', 3); circ(c, hx - 16, hy - 10, 8, '#1f2226', 2); circ(c, hx + 16, hy - 10, 8, '#1f2226', 2);
  }
} });
S('P12.0', { cams: [[960, 520, 1.08]], sfx: [['page', 'later', -10], ['pencil', '21st', -10]], draw(c, T) {
  SET.desk(c, T.t, { lx: 960, ly: 520 });
  const a = T.since('later'), b = a - .4, big = a < 0 ? '19' : b < 0 ? '20' : '21';
  calendar(c, 960, 540, 560, 520, 'NOV 1959', big, { circle: T.at('21st', .5) });
  fallingPage(c, 960, 540, 560, 520, 'NOV 1959', '19', clamp(a / .7)); fallingPage(c, 960, 540, 560, 520, 'NOV 1959', '20', clamp(b / .7));
  arrive(c, pop(T, 'two', .4), 960, 160, () => label(c, 'TWO DAYS LATER', 0, 0, 62, '#ffe9a8'));
} });
S('P12.1', { cams: [[960, 560, 1.0], [960, 640, 1.2]], sfx: [['cheer', 'opened', -16], ['crowdtalk', 0, -20, { len: 3 }]], draw(c, T) {
  bg(c, '#8fc0e8', '#dcecf6'); cloud(c, 360, 200, 1); cloud(c, 1500, 160, .8); FLOOR(c, 880, '#cdbb98');
  hallFacade(c, 960, 880, 1500, { banner: 'SOVIET EXHIBITION' });
  const op = T.since('opened'); const rp = clamp(op / .8);
  if (op < 0) line(c, 600, 800, 1320, 800, 14, '#d9342b'); else { c.save(); c.globalAlpha = 1 - rp * .6; line(c, 600, 800, 960 - 20, 800 + rp * 120, 12, '#d9342b'); line(c, 1320, 800, 980, 800 + rp * 120, 12, '#d9342b'); c.restore(); }
  [['visitor1', 520], ['visitor2', 760], ['visitor3', 1180], ['visitor4', 1420]].forEach(([n, x], i) => P(n, { x, y: 1040 + (i % 2) * 20, s: .9, t: T.t + i, pose: op > 0 ? 'cheer' : 'idle', expr: op > 0 ? 'happy' : 'neutral', flip: x > 960 }));
  caption(c, 'AUDITORIO NACIONAL · NOV 21, 1959', T.at('auditorio', .5), { y: 1010 });
} });
S('P13.0', { cams: [[960, 540, 1.0], [1300, 360, 1.25]], sfx: [['crowdtalk', 0, -18, { len: 4 }], ['ding', 'million', -10]], draw(c, T) {
  SET.exhibitHall(c, T.t); lunikExhibit(c, 1500, 820, 520, { t: T.t });
  for (let i = 0; i < 9; i++) { const x = ((T.t * 160 + i * 300) % 2700) - 400; P(['visitor1', 'visitor2', 'visitor3', 'visitor4'][i % 4], { x, y: 980 + (i % 3) * 18, s: .78, t: T.t + i, walk: true, expr: i % 2 ? 'happy' : 'grin' }); }
  box(c, 700, 860, 60, 140, 6, '#8d969e'); box(c, 940, 860, 60, 140, 6, '#8d969e');
  box(c, 1020, 160, 560, 260, 16, '#18202c'); label(c, 'VISITORS', 1300, 210, 40, '#c9d6ff', { stroke: false });
  const v = num(T, 'more', 1000000, Math.max(.4, T.cue('million') - T.cue('more'))); money(c, commas(v) + (T.since('million') > 0 ? '+' : ''), 1300, 320, 84, 'gold', { maxW: 520 });
  tag(c, 'PER MAYSH', 1300, 470, pop(T, 'maich', .4));
} });
S('P14.0', { cams: [[960, 560, 1.0], [960, 640, 1.15]], sfx: [['hit', 'time', -12], ['creak', 'chances', -8]], draw(c, T) {
  SET.exhibitHall(c, T.t); lunikExhibit(c, 960, 860, 760, { rope: false, t: T.t, glow: 1 });
  const d = easeOut(T.at('time', 1.0)); GRADE.night(c, [], .3 * d); GRADE.dark(c, .6 * d);
  cone(c, 960, -60, 140, 760, 1000, '#fff2cc', .25 * d); lightPool(c, 960, 640, 560, '#fff2cc', .4 * d);
  const tn = T.since('chances'), ten = tn < 0 ? 0 : clamp(tn / .12), vib = tn > 0 && tn < .5 ? Math.sin(tn * 90) * 10 * (1 - tn / .5) : 0;
  ropeLine(c, 960 - 400 - 70, 960 + 400 + 70, 860 + vib * 0, ten); if (vib) line(c, 490, 714 + vib, 1430, 714 - vib, 3, 'rgba(255,255,255,.25)');
} });
S('P15.0', { cams: [[960, 560, 1.0]], shakes: [['guards']], sfx: [['steps', 0, -14, { len: 1.1 }], ['stamp', 'guards', -10]], draw(c, T) {
  SET.exhibitHall(c, T.t); GRADE.dark(c, .25); lunikExhibit(c, 960, 860, 640, { t: T.t });
  const k = easeOut(clamp((T.t - T.shot.start) / Math.max(.3, T.cue('guards') - T.shot.start)));
  P('guard', { x: lerp(-150, 500, k), y: 1000, s: 1.05, t: T.t, walk: k < 1, expr: 'stern' }); P('guard', { x: lerp(2070, 1420, k), y: 1000, s: 1.05, t: T.t + 1, walk: k < 1, expr: 'stern', flip: true });
} });
S('P15.1', { cams: [[960, 560, 1.0]], sfx: [['clock', 0, -16, { len: 2.3 }]], draw(c, T) {
  SET.exhibitHall(c, T.t); lunikExhibit(c, 960, 860, 640, { t: 0 });
  const cyc = .5 + .5 * Math.sin(T.lt * TAU * 1.4 - Math.PI / 2); GRADE.dark(c, .7 * cyc);
  P('guard', { x: 500, y: 1000, s: 1.05, t: 0, expr: 'stern' }); P('guard', { x: 1420, y: 1000, s: 1.05, t: 0, expr: 'stern', flip: true });
  clock(c, 1740, 180, 100, (T.lt * 24) % 12, (T.lt * 1440) % 60);
  arrive(c, pop(T, '24', .4), 960, 230, () => label(c, '24 HOURS A DAY', 0, 0, 80, '#fff', { glow: '#b8322a' }));
} });
S('P16.0', { cams: [[1000, 560, 1.06]], sfx: [['steps', 0, -18, { len: 2.6 }]], draw(c, T) {
  const L = SET.hallNight(c, T.t); lunikExhibit(c, 960, 840, 640, { t: T.t, glow: 1 });
  P('guard', { x: 300, y: 980, s: .9, t: T.t, expr: 'stern' }); P('guard', { x: 1640, y: 980, s: .9, t: T.t + 1, expr: 'stern', flip: true });
  const k = clamp(T.lt / T.d); P('kolomyakov', { x: lerp(1420, 1000, k), y: 1020, s: 1.1, t: T.t, walk: true, pose: 'handsBack', expr: 'smug', flip: true });
  tag(c, 'REPORTEDLY', 600, 200, pop(T, 'reportedly', .4), { size: 38 });
  caption(c, 'IN CHARGE OF PROTECTING THE LUNIK', T.at('protecting', .5), { y: 1010, size: 36 });
  GRADE.night(c, [...L, [960, 640, 520, '#fff2cc', .3]], .25);
} });
S('P16.1', { cams: [[880, 540, 1.04], [880, 480, 1.16]], sfx: [['paper', 0, -12], ['typewriter', 'boris', -18, { len: .7 }]], draw(c, T) {
  SET.desk(c, T.t, { lx: 880, ly: 520 });
  const nm = T.since('kolom') > 0 ? 'BORIS KOLOMYAKOV' : T.since('boris') > 0 ? 'BORIS ...' : '';
  dossier(c, 880, 560, 1080, { who: 'kolomyakov', name: nm, role: T.since('diplomat') > 0 ? ['SOVIET DIPLOMAT'] : [''], source: 'REPORTEDLY', p: clamp(T.lt / .35 + (T.sub ? 1 : 0)), t: T.t });
} });
S('P16.2', { cams: [[960, 560, 1.12]], shakes: [['kgb']], sfx: [['stamp', 'kgb', -3], ['hit', 'kgb', -14]], draw(c, T) {
  SET.desk(c, T.t, { lx: 880, ly: 520 });
  dossier(c, 880, 560, 1080, { who: 'kolomyakov', expr: T.since('kgb') > 0 ? 'smug' : 'stern', name: 'BORIS KOLOMYAKOV', role: ['SOVIET DIPLOMAT'], source: T.since('maich') > 0 ? 'PER MAYSH' : 'REPORTEDLY', stamp: 'ALSO KGB', sp: T.at('kgb', .3), t: T.t });
  GRADE.dark(c, .18 * clamp(T.since('kgb') / .4));
  tag(c, 'PER MAYSH', 1560, 300, pop(T, 'maich', .4), { size: 38 });
} });
})();
