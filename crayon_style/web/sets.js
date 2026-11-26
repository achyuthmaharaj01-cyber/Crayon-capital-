// ---------- sets + props (bible §5): dense, muted rooms; practical lights; labels tell the joke ----------
// All sets draw in a 1920x1080 world and bleed past it so the camera can drift.
const BLEED = 320;
function fillWorld(c, col) { c.fillStyle = col; c.fillRect(-BLEED, -BLEED, W + 2 * BLEED, H + 2 * BLEED); }

// ---- props
function bulb(c, x, y, s = 1, o = {}) { // tulip bulb: teardrop, papery brown-violet skin, sprout tip, roots
  c.save(); c.translate(x, y); c.scale(s, s); c.rotate(o.rot || 0);
  const col = o.col || '#8a5a4a';
  for (let i = -3; i <= 3; i++) curve(c, i * 7, 46, i * 10, 62, i * 13 + (i % 2) * 4, 72, 2.4, '#d8c7a6');
  const path = () => { c.beginPath(); c.moveTo(0, -70); c.bezierCurveTo(10, -50, 56, -22, 56, 14); c.bezierCurveTo(56, 44, 30, 52, 0, 52); c.bezierCurveTo(-30, 52, -56, 44, -56, 14); c.bezierCurveTo(-56, -22, -10, -50, 0, -70); c.closePath(); };
  path(); ink(c, col, 0);
  c.save(); path(); c.clip(); ell(c, 26, 0, 40, 70, 'rgba(0,0,0,.18)', 0); ell(c, -22, 10, 16, 34, rgba('#f3d9b6', .35), 0); c.restore();
  for (const k of [-.55, -.2, .2, .55]) curve(c, k * 50, 44, k * 66, -4, k * 10, -56, 2, shade(col, -.35));
  path(); ink(c, null, LW);
  if (o.sprout !== false) { c.beginPath(); c.moveTo(-4, -66); c.quadraticCurveTo(0, -92, 8, -98); c.quadraticCurveTo(6, -80, 5, -66); ink(c, '#7fa04a', 3); }
  c.restore();
}
function onion(c, x, y, s = 1, o = {}) {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (let i = -3; i <= 3; i++) curve(c, i * 6, 50, i * 9, 62, i * 11, 70, 2.4, '#d8c7a6');
  const path = () => { c.beginPath(); c.moveTo(0, -62); c.bezierCurveTo(14, -44, 60, -26, 60, 10); c.bezierCurveTo(60, 44, 30, 54, 0, 54); c.bezierCurveTo(-30, 54, -60, 44, -60, 10); c.bezierCurveTo(-60, -26, -14, -44, 0, -62); c.closePath(); };
  path(); ink(c, '#c89a52', 0); c.save(); path(); c.clip(); ell(c, 28, 4, 44, 70, 'rgba(0,0,0,.15)', 0); ell(c, -24, 6, 16, 32, 'rgba(255,240,200,.35)', 0); c.restore();
  for (const k of [-.6, -.25, .25, .6]) curve(c, k * 52, 46, k * 70, 0, k * 8, -54, 2, '#9b7136');
  path(); ink(c, null, LW); c.beginPath(); c.moveTo(-5, -60); c.quadraticCurveTo(-2, -80, 6, -88); c.quadraticCurveTo(4, -72, 5, -60); ink(c, '#b8935a', 3);
  c.restore();
}
function tulip(c, x, y, s = 1, col = P.tulip, o = {}) {
  c.save(); c.translate(x, y); c.scale(s, s); c.rotate(o.rot || 0);
  curve(c, 0, 0, -6, -60, 0, -120, 5, '#4f7a35'); curve(c, 0, 0, -6, -60, 0, -120, 2, '#7fa04a');
  c.beginPath(); c.moveTo(2, -20); c.quadraticCurveTo(40, -50, 30, -96); c.quadraticCurveTo(10, -60, 2, -20); ink(c, '#6f9a45', 3);
  c.beginPath(); c.moveTo(-34, -150); c.quadraticCurveTo(-36, -112, 0, -108); c.quadraticCurveTo(36, -112, 34, -150); c.lineTo(18, -134); c.lineTo(0, -160); c.lineTo(-18, -134); c.closePath(); ink(c, col, 3.6);
  if (o.flame) { c.save(); c.globalAlpha = .9; curve(c, -20, -140, -8, -125, -14, -112, 3, '#f4e6d0'); curve(c, 16, -142, 8, -126, 14, -114, 3, '#f4e6d0'); c.restore(); }
  c.beginPath(); c.moveTo(-18, -134); c.quadraticCurveTo(0, -120, 18, -134); c.lineWidth = 2; c.strokeStyle = shade(col, -.35); c.stroke();
  c.restore();
}
function pot(c, x, y, s = 1, o = {}) { // clay pot, optional bulb peeking or tulip
  c.save(); c.translate(x, y); c.scale(s, s);
  if (o.flower) tulip(c, 0, -60, .7, o.flower, { flame: 1 });
  if (o.bulb) bulb(c, 0, -66, .45, { sprout: true });
  poly(c, [[-48, -70], [48, -70], [36, 0], [-36, 0]], '#b8673f', LW); rect(c, -56, -84, 112, 20, '#c97a4e', LW, 4);
  c.save(); c.beginPath(); c.moveTo(-48, -64); c.lineTo(48, -64); c.lineTo(36, 0); c.lineTo(-36, 0); c.clip(); c.fillStyle = 'rgba(0,0,0,.16)'; c.fillRect(8, -70, 50, 80); c.restore();
  if (o.label) { rect(c, -30, -50, 60, 28, '#efe6cf', 2.4, 3); sign(c, o.label, 0, -36, 18, INK, { maxW: 52 }); }
  c.restore();
}
function candle(c, x, y, t, s = 1) {
  c.save(); c.translate(x, y); c.scale(s, s);
  ell(c, 0, 0, 26, 8, '#b98a3a', 3); rect(c, -9, -60, 18, 60, '#efe6cf', 3, 3);
  const f = 1 + Math.sin(t * 17) * .08 + Math.sin(t * 7.3) * .06; c.save(); c.translate(0, -62); c.scale(1, f);
  c.beginPath(); c.moveTo(0, -26); c.quadraticCurveTo(10, -8, 0, 2); c.quadraticCurveTo(-10, -8, 0, -26); ink(c, '#ffcf6a', 2); c.restore();
  glow(c, 0, -72, 160, P.glow, .5); c.restore();
}
function lantern(c, x, y, t, s = 1, lit = true) { // wall/street lantern
  c.save(); c.translate(x, y); c.scale(s, s);
  ln(c, 0, -40, 0, -20, 4); poly(c, [[-22, -20], [22, -20], [16, -30], [-16, -30]], '#2a2626', 3);
  rect(c, -18, -20, 36, 46, lit ? '#f7cd70' : '#5b5550', 3.4, 3); ln(c, 0, -20, 0, 26, 2.4); poly(c, [[-22, 26], [22, 26], [14, 34], [-14, 34]], '#2a2626', 3);
  c.restore(); if (lit) glow(c, x, y + 2 * s, 190 * s, P.glow, .45 + Math.sin(t * 3 + x) * .03);
}
function coinStack(c, x, y, n, s = 1) {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (let i = 0; i < n; i++) { const dx = Math.sin(i * 2.3) * 3; ell(c, dx, -i * 11, 36, 10, i % 2 ? '#d9a93a' : '#e6b94a', 2.6); }
  ell(c, Math.sin((n - 1) * 2.3) * 3, -(n - 1) * 11, 24, 6, '#f2d27a', 0); c.restore();
}
function windowFrame(c, x, y, w, h, o = {}) { // mullioned window; o.view(c,x,y,w,h) draws what's outside
  c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); if (o.view) o.view(c, x, y, w, h); else vgrad(c, x, y, w, h, P.night2, P.dusk2); c.restore();
  rect(c, x, y, w, h, null, LW); const mc = o.frame || '#4a3424';
  rect(c, x - 14, y - 14, w + 28, 14, mc, LW); rect(c, x - 18, y + h, w + 36, 18, mc, LW);
  for (let i = 1; i < (o.cols || 2); i++) ln(c, x + w * i / (o.cols || 2), y, x + w * i / (o.cols || 2), y + h, 5, mc);
  for (let i = 1; i < (o.rows || 3); i++) ln(c, x, y + h * i / (o.rows || 3), x + w, y + h * i / (o.rows || 3), 5, mc);
  rect(c, x, y, w, h, null, LW);
}
function stepGable(c, x, base, w, h, col, o = {}) { // Dutch step-gabled house facade
  const steps = 4, gh = h * .42, bodyH = h - gh, sw = w / (2 * steps + 1);
  const pts = [[x, base], [x, base - bodyH]];
  for (let i = 0; i < steps; i++) { pts.push([x + sw * i, base - bodyH - gh * i / steps - gh / steps]); pts.push([x + sw * (i + 1), base - bodyH - gh * i / steps - gh / steps]); }
  pts.push([x + w - sw * steps, base - h]);
  for (let i = steps - 1; i >= 0; i--) { pts.push([x + w - sw * i - sw, base - bodyH - gh * i / steps - gh / steps]); pts.push([x + w - sw * i, base - bodyH - gh * i / steps - gh / steps]); }
  pts.push([x + w, base - bodyH]); pts.push([x + w, base]);
  poly(c, pts, col, LW);
  c.save(); c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(...p) : c.moveTo(...p)); c.closePath(); c.clip();
  // brick courses
  c.globalAlpha = .22; for (let yy = base - 10; yy > base - h; yy -= 18) ln(c, x, yy, x + w, yy, 1.6, shade(col, -.5)); c.globalAlpha = 1;
  c.fillStyle = 'rgba(0,0,0,.16)'; c.fillRect(x + w * .72, base - h, w * .3, h); c.restore();
  // windows
  const lit = o.lit || []; const R = rng(o.seed || 3); let k = 0;
  const rows = o.rows || 3, cols = o.cols || 2; const ww = w * .22, wh = bodyH / (rows + 1.3);
  for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) {
    const wx = x + w * (cols === 2 ? [.18, .6][q] : (q + .5) / cols - .11), wy = base - bodyH + bodyH * .12 + r * (wh * 1.25);
    const isLit = lit.includes(k) || (o.litChance && R() < o.litChance);
    if (r === rows - 1 && q === (o.doorCol ?? 1) && o.door !== false) { k++; continue; }
    rect(c, wx, wy, ww, wh, isLit ? '#f2c96e' : shade(o.glass || '#2c3550', 0), 3.6); ln(c, wx + ww / 2, wy, wx + ww / 2, wy + wh, 2.6, shade(col, -.45)); ln(c, wx, wy + wh / 2, wx + ww, wy + wh / 2, 2.6, shade(col, -.45));
    rect(c, wx - 6, wy + wh, ww + 12, 8, shade(col, .25), 2.6);
    if (isLit && o.glow !== false) glow(c, wx + ww / 2, wy + wh / 2, ww * 1.6, P.glow, .32);
    k++;
  }
  // gable window + hoist beam
  rect(c, x + w * .42, base - bodyH - gh * .55, w * .16, gh * .28, o.atticLit ? '#f2c96e' : '#2c3550', 3.2);
  ln(c, x + w / 2, base - h + 10, x + w / 2, base - h - 16, 4.2);
  if (o.door !== false) { const dx = x + w * (o.doorCol === 0 ? .14 : .56), dw = o.doorW || w * .3, dh = o.doorH || bodyH * .32; c.beginPath(); c.moveTo(dx, base); c.lineTo(dx, base - dh + dw / 2); c.arc(dx + dw / 2, base - dh + dw / 2, dw / 2, Math.PI, 0); c.lineTo(dx + dw, base); ink(c, o.doorCol2 || '#3b4a36', LW); circ(c, dx + dw * .78, base - dh * .42, 4, P.gold, 2); }
}
function cobbles(c, y0, y1, col = '#5d5650') {
  fillRectB(c, y0, y1, col); const R = rng(11);
  c.save(); c.globalAlpha = .35; for (let yy = y0 + 14; yy < y1 + 40; yy += 22) for (let xx = -BLEED + (yy % 44 ? 0 : 20); xx < W + BLEED; xx += 44) { ell(c, xx + R() * 6, yy, 17, 7, null, 2, 0); } c.restore();
}
function fillRectB(c, y0, y1, col) { c.fillStyle = col; c.fillRect(-BLEED, y0, W + 2 * BLEED, y1 - y0 + BLEED); }
function sky(c, top, mid, bot, y1 = 760) { const g = c.createLinearGradient(0, -BLEED, 0, y1); g.addColorStop(0, top); g.addColorStop(.55, mid); g.addColorStop(1, bot); c.fillStyle = g; c.fillRect(-BLEED, -BLEED, W + 2 * BLEED, y1 + BLEED); }
function stars(c, n, seed, ymax, t) { const R = rng(seed); for (let i = 0; i < n; i++) { const x = R() * (W + 2 * BLEED) - BLEED, y = R() * ymax - BLEED * .6, a = .5 + .5 * Math.sin(t * 1.5 + i); c.fillStyle = `rgba(255,246,220,${.35 + .45 * a})`; c.fillRect(x, y, 3, 3); } }
function cloud(c, x, y, s, col = '#c9a7b8') { c.save(); c.translate(x, y); c.scale(s, s); c.beginPath(); c.moveTo(-90, 20); c.quadraticCurveTo(-96, -8, -60, -10); c.quadraticCurveTo(-46, -44, -8, -30); c.quadraticCurveTo(20, -56, 52, -26); c.quadraticCurveTo(92, -26, 90, 20); c.closePath(); ink(c, col, 3.4); c.restore(); }
function snow(c, t, n = 160, seed = 5, a = .85) { const R = rng(seed); c.save(); for (let i = 0; i < n; i++) { const sp = 40 + R() * 70, x0 = R() * (W + 2 * BLEED) - BLEED, y0 = R() * (H + 2 * BLEED), r = 2 + R() * 3.5; const y = ((y0 + t * sp) % (H + 2 * BLEED)) - BLEED, x = x0 + Math.sin(t * .8 + i) * 14; c.globalAlpha = a * (.5 + R() * .5); c.beginPath(); c.arc(x, y, r, 0, TAU); c.fillStyle = '#f4f6fb'; c.fill(); } c.restore(); }
function planks(c, y0, col = P.wood, seed = 2) { fillRectB(c, y0, H, col); const R = rng(seed); for (let yy = y0 + 26; yy < H + BLEED; yy += 30 + (yy - y0) * .05) { ln(c, -BLEED, yy, W + BLEED, yy, 2.2, shade(col, -.35)); for (let x = -BLEED + R() * 200; x < W + BLEED; x += 260 + R() * 160) ln(c, x, yy - 28, x, yy, 2, shade(col, -.35)); } ln(c, -BLEED, y0, W + BLEED, y0, LW); }
function wainscot(c, y0, y1, col = P.woodL) { fillRectB(c, y0, y1, col); c.fillStyle = col; c.fillRect(-BLEED, y0, W + 2 * BLEED, y1 - y0); for (let x = -BLEED + 20; x < W + BLEED; x += 150) { rect(c, x + 14, y0 + 26, 120, y1 - y0 - 50, shade(col, -.08), 2.4); } ln(c, -BLEED, y0, W + BLEED, y0, LW); rect(c, -BLEED, y0 - 14, W + 2 * BLEED, 16, shade(col, .1), 3); }
function frame(c, x, y, w, h, draw) { rect(c, x - 16, y - 16, w + 32, h + 32, '#9a6a2a', LW, 2); rect(c, x - 6, y - 6, w + 12, h + 12, '#6e4a1c', 2.4); c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); draw(c, x, y, w, h); c.restore(); rect(c, x, y, w, h, null, 3); }
function table(c, x, y, w, col = P.woodL) { rect(c, x - w / 2, y, w, 24, col, LW, 4); rect(c, x - w / 2 + 20, y + 24, 22, 150, shade(col, -.2), LW); rect(c, x + w / 2 - 42, y + 24, 22, 150, shade(col, -.2), LW); c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(x - w / 2 + 4, y + 26, w - 8, 10); }
function barrel(c, x, y, s = 1) { c.save(); c.translate(x, y); c.scale(s, s); c.beginPath(); c.moveTo(-50, 0); c.quadraticCurveTo(-64, -70, -50, -140); c.lineTo(50, -140); c.quadraticCurveTo(64, -70, 50, 0); c.closePath(); ink(c, '#7a5232', LW); for (const yy of [-22, -118]) curve(c, -54, yy, 0, yy + 8, 54, yy, 5, '#3c3a3a'); for (const xx of [-24, 0, 24]) curve(c, xx, -138, xx * 1.25, -70, xx, -2, 2, '#4f3420'); c.restore(); }
function curtain(c, x, y, w, h, col = '#7c2f33', side = 1) { c.beginPath(); c.moveTo(x, y); c.lineTo(x + w, y); c.quadraticCurveTo(x + w * .55, y + h * .5, x + w * (side > 0 ? .9 : .1), y + h); c.lineTo(x, y + h); c.closePath(); ink(c, col, LW); for (let i = 1; i < 4; i++) curve(c, x + w * i / 4, y + 10, x + w * i / 5, y + h * .5, x + w * i / 4.6, y + h - 6, 2.2, shade(col, -.4)); }

// ---- chalkboard price chart (L5): line draws on 'p', points on doubles
function chalkboard(c, x, y, w, h, T, o = {}) {
  rect(c, x - 18, y - 18, w + 36, h + 36, '#6e4a1c', LW, 4); rect(c, x, y, w, h, '#283a33', 3);
  c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); c.globalAlpha = .035; for (let i = 0; i < 5; i++) curve(c, x + i * w / 4 + 30, y + 30, x + i * w / 4 + 90, y + h / 2, x + i * w / 4 + 10, y + h - 30, 60, '#fff'); c.restore();
  const cx = s => x + 70 + s * (w - 130), cy = v => y + h - 50 - v * (h - 110);
  ln(c, x + 60, y + 34, x + 60, y + h - 40, 3.2, '#e9efe9'); ln(c, x + 60, y + h - 40, x + w - 30, y + h - 40, 3.2, '#e9efe9');
  sign(c, 'PRICE OF ONE BULB', x + 90, y + 42, 32, '#e9efe9', { align: 'left' });
  const pts = o.pts || [[0, .06], [.25, .1], [.45, .2], [.62, .24], [.78, .5], [.92, .96]]; const p = o.p ?? 1;
  c.save(); c.lineWidth = 6; c.strokeStyle = '#f2e7c4'; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath();
  const tot = pts.length - 1; const k = p * tot;
  for (let i = 0; i <= Math.min(tot, Math.floor(k)); i++) { const [a, b] = pts[i]; i ? c.lineTo(cx(a), cy(b)) : c.moveTo(cx(a), cy(b)); }
  if (k < tot) { const i = Math.floor(k), f = k - i; c.lineTo(lerp(cx(pts[i][0]), cx(pts[i + 1][0]), f), lerp(cy(pts[i][1]), cy(pts[i + 1][1]), f)); }
  c.stroke(); c.restore();
  (o.labels || []).forEach(([i, txt, a]) => { if (a <= 0) return; const [px, py] = pts[i]; c.save(); c.globalAlpha = clamp(a * 2); circ(c, cx(px), cy(py), 9 * easeOut(a), '#f2e7c4', 0); hand(c, txt, cx(px) - 24, cy(py) + (i === pts.length - 1 ? 30 : -40), 46, '#f2e7c4', { shadow: false, align: 'right' }); c.restore(); });
  return { x: cx, y: cy };
}
function balance(c, x, y, tilt, left, right) { // balance scale; left/right are draw fns at pan centre
  rect(c, x - 70, y, 140, 24, P.woodL, LW, 4); rect(c, x - 12, y - 330, 24, 330, '#b8923a', LW); circ(c, x, y - 336, 16, '#d9ad4a', LW);
  c.save(); c.translate(x, y - 330); c.rotate(tilt); rect(c, -290, -10, 580, 20, '#d9ad4a', LW, 8); c.restore();
  for (const sd of [-1, 1]) { const px = x + sd * 280 * Math.cos(tilt), py = y - 330 + sd * 280 * Math.sin(tilt);
    ln(c, px, py, px - 80, py + 170, 2.6); ln(c, px, py, px + 80, py + 170, 2.6); c.beginPath(); c.ellipse(px, py + 176, 100, 22, 0, 0, Math.PI); ink(c, '#d9ad4a', LW); ln(c, px - 100, py + 176, px + 100, py + 176, LW);
    (sd < 0 ? left : right)(c, px, py + 172); }
}

// ================= SETS =================
function setStreet(c, T, o = {}) { // Haarlem canal at dusk; Pieter's house in the middle (window target)
  const t = T.t;
  sky(c, '#1d2244', '#5a4a72', '#d68f74', 700); stars(c, 70, 3, 380, t); cloud(c, 380 + t * 4, 150, 1.1, '#6e5a80'); cloud(c, 1500 + t * 3, 110, .9, '#6e5a80');
  circ(c, 1620, 170, 42, '#f4ead0', 0); glow(c, 1620, 170, 220, '#fff2cc', .25);
  // far roofline silhouette + church tower
  c.fillStyle = '#2f2a48'; c.beginPath(); c.moveTo(-BLEED, 640); for (let x = -BLEED; x < W + BLEED; x += 90) { c.lineTo(x, 560 + ((x * 37) % 70)); c.lineTo(x + 45, 520 + ((x * 53) % 80)); c.lineTo(x + 90, 560 + ((x * 29) % 60)); } c.lineTo(W + BLEED, 700); c.lineTo(-BLEED, 700); c.fill();
  poly(c, [[1270, 640], [1270, 360], [1300, 320], [1330, 360], [1330, 640]], '#2f2a48', 0); poly(c, [[1285, 320], [1300, 210], [1315, 320]], '#2f2a48', 0);
  const base = 700, cols = ['#7b4b3c', '#6a5a4a', '#8a5a40', '#5e4a52', '#7d6248', '#6b4640', '#7b5a48'];
  const xs = [-260, -40, 190, 430, 700, 1040, 1300, 1530, 1780, 2010];
  xs.forEach((x, i) => { if (i === 4) return; stepGable(c, x, base, i % 2 ? 230 : 250, 470 + (i % 3) * 40, cols[i % cols.length], { seed: i + 1, litChance: .3, glass: '#2a3150' }); });
  // Pieter's house (centre), warm lit window = push-through target
  stepGable(c, 700, base, 320, 560, '#8c5340', { lit: [2], seed: 9, rows: 3, cols: 2, doorCol2: '#2f4a3a' });
  // quay + canal
  rect(c, -BLEED, base, W + 2 * BLEED, 40, '#6e6660', LW); for (let x = -BLEED; x < W + BLEED; x += 70) ln(c, x, base, x, base + 40, 2, '#4f4944');
  const wg = c.createLinearGradient(0, base + 40, 0, H + BLEED); wg.addColorStop(0, '#2b2d4d'); wg.addColorStop(1, '#141a30'); c.fillStyle = wg; c.fillRect(-BLEED, base + 40, W + 2 * BLEED, H);
  for (let i = 0; i < 26; i++) { const yy = base + 70 + i * 16, x = (i * 173 + t * 30) % (W + 600) - 300; c.globalAlpha = .55 - i * .015; ln(c, x, yy, x + 80 + (i % 3) * 40, yy, 3, '#f2c96e'); c.globalAlpha = 1; }
  for (let i = 0; i < 6; i++) { const x = 140 + i * 330 + Math.sin(t + i) * 6; c.globalAlpha = .45; ln(c, x, base + 60 + (i % 2) * 40, x + 120, base + 60 + (i % 2) * 40, 3.4, '#9aa4c8'); c.globalAlpha = 1; }
  ln(c, -BLEED, base + 40, W + BLEED, base + 40, LW);
  [[560, 610], [1210, 610], [1700, 610]].forEach(([x, y]) => { ln(c, x, y + 20, x, base, 6); lantern(c, x, y, t, 1.1); });
  if (o.walker) o.walker(c, T);
}
// world-space rect of Pieter's lit window in setStreet (row 2? index 2 => row1 col0)
const STREET_WIN = (() => { const x = 700, w = 320, h = 560, base = 700, bodyH = h - h * .42, ww = w * .22, wh = bodyH / 4.3; return { x: x + w * .18, y: base - bodyH + bodyH * .12 + 1 * wh * 1.25, w: ww, h: wh }; })();

function setHome(c, T, o = {}) { // Pieter's front room at dusk: warm cream wall, wainscot, window, fireplace, tulip still-life
  const t = T.t;
  const g = c.createLinearGradient(0, -BLEED, 0, 640); g.addColorStop(0, '#b99d72'); g.addColorStop(1, '#e8cf9e'); c.fillStyle = g; c.fillRect(-BLEED, -BLEED, W + 2 * BLEED, 640 + BLEED);
  ln(c, -BLEED, 70, W + BLEED, 70, LW); rect(c, -BLEED, 40, W + 2 * BLEED, 30, P.woodD, LW); for (let x = -BLEED; x < W + BLEED; x += 240) rect(c, x, 20, 40, 52, P.wood, 3);
  wainscot(c, 640, 820, '#7a5434'); planks(c, 820, '#5e4128');
  windowFrame(c, 150, 200, 330, 380, { cols: 2, rows: 3, view: (c, x, y, w, h) => { vgrad(c, x, y, w, h, '#2a2a52', '#c98a78'); c.fillStyle = '#3a3256'; for (let i = 0; i < 4; i++) c.fillRect(x + i * 90, y + h - 120 - (i % 2) * 40, 70, 160); c.fillStyle = '#f2c96e'; c.fillRect(x + 40, y + h - 90, 16, 20); c.fillRect(x + 200, y + h - 130, 16, 20); } });
  curtain(c, 92, 170, 120, 470, '#7c2f33', 1); curtain(c, 418, 170, 120, 470, '#7c2f33', -1); rect(c, 80, 160, 470, 16, '#4a3424', LW, 8);
  // tulip still life (foreshadow)
  frame(c, 760, 210, 260, 200, (c, x, y, w, h) => { vgrad(c, x, y, w, h, '#2b2620', '#4a3a2a'); tulip(c, x + 90, y + 190, .7, '#d2464f', { flame: 1 }); tulip(c, x + 140, y + 200, .82, '#e4b94c'); tulip(c, x + 185, y + 192, .66, '#c25a8a'); rect(c, x + 70, y + 170, 130, 40, '#6e5a4a', 2.4, 6); });
  // fireplace
  rect(c, 1380, 380, 420, 440, '#9b8f80', LW); rect(c, 1350, 360, 480, 34, '#7b6f62', LW, 4); rect(c, 1450, 500, 280, 320, '#2a1d17', LW);
  const fl = Math.sin(t * 11) * .1 + Math.sin(t * 5.3) * .1; c.save(); c.translate(1590, 790); c.scale(1, 1 + fl);
  c.beginPath(); c.moveTo(-90, 0); c.quadraticCurveTo(-100, -80, -40, -130); c.quadraticCurveTo(-30, -70, 0, -160); c.quadraticCurveTo(30, -80, 50, -120); c.quadraticCurveTo(100, -70, 90, 0); c.closePath(); ink(c, '#f0a24a', 3);
  c.beginPath(); c.moveTo(-50, 0); c.quadraticCurveTo(-50, -60, 0, -90); c.quadraticCurveTo(50, -60, 50, 0); c.closePath(); ink(c, '#ffd77a', 0); c.restore();
  rect(c, 1490, 790, 200, 22, '#4a2e1c', 3, 6); glow(c, 1590, 720, 420, '#ffb45a', .5); pool(c, 1590, 860, 600, 120, '#ffb45a', .35);
  [1420, 1540, 1660].forEach((x, i) => { rect(c, x, 316, 34, 44, ['#5d7aa0', '#b6503a', '#d9c49a'][i], 3, 4); });
  // table + candle
  table(c, 1060, 640, 300, '#7a5434'); candle(c, 1120, 640, t, .9); rect(c, 980, 618, 70, 22, '#efe6cf', 2.4, 3);
  // rug
  c.beginPath(); c.ellipse(820, 940, 520, 70, 0, 0, TAU); ink(c, '#7c3a34', LW); c.beginPath(); c.ellipse(820, 940, 470, 52, 0, 0, TAU); c.lineWidth = 3; c.strokeStyle = '#d9b06a'; c.stroke();
  shadeRect(c, -BLEED, -BLEED, W + 2 * BLEED, H + 2 * BLEED, .1);
  if (o.cast) o.cast(c, T);
}
function setTavern(c, T, o = {}) { // warm tavern: panelled walls, beams, lanterns, barrels, chalkboard
  const t = T.t;
  vgrad(c, -BLEED, -BLEED, W + 2 * BLEED, 700 + BLEED, '#4a3426', '#6e4e34');
  for (let x = -BLEED; x < W + BLEED; x += 120) { ln(c, x, -BLEED, x, 700, 2.4, '#3a281c'); }
  rect(c, -BLEED, 60, W + 2 * BLEED, 46, '#3a271a', LW); for (let x = -BLEED + 60; x < W + BLEED; x += 520) rect(c, x, -BLEED, 50, BLEED + 106, '#3a271a', LW);
  wainscot(c, 700, 830, '#5a3a24'); planks(c, 830, '#4a321f', 4);
  // shelf with jugs
  rect(c, 1320, 300, 520, 18, P.woodL, LW); rect(c, 1320, 470, 520, 18, P.woodL, LW);
  for (let i = 0; i < 6; i++) { const x = 1350 + i * 82; c.beginPath(); c.moveTo(x, 300); c.quadraticCurveTo(x - 6, 250, x + 14, 238); c.lineTo(x + 34, 238); c.quadraticCurveTo(x + 54, 250, x + 48, 300); c.closePath(); ink(c, ['#8a6a4a', '#5b6f5a', '#a8805a', '#6b5a7a'][i % 4], 3.4); }
  for (let i = 0; i < 7; i++) { const x = 1350 + i * 70; rect(c, x, 400, 40, 70, ['#3f5a3a', '#6b3a2e', '#3a4a6a'][i % 3], 3.4, 8); rect(c, x + 12, 384, 16, 18, '#c9b48a', 2.4); }
  if (o.board) chalkboard(c, 520, 170, 760, 470, T, o.board);
  [[300, 230], [1600, 160], [1000, 120]].forEach(([x, y]) => { ln(c, x, -BLEED, x, y - 40, 3); lantern(c, x, y, t, 1.2); });
  barrel(c, 120, 830, 1.05); barrel(c, 250, 830, .95); barrel(c, 185, 700, .9);
  pool(c, 960, 860, 900, 120, P.glow, .22);
  if (o.cast) o.cast(c, T);
  shadeRect(c, -BLEED, -BLEED, W + 2 * BLEED, H + 2 * BLEED, .06);
}
function setStage(c, T, o = {}) { // dark spotlit stage: pedestal + velvet cushion (+ optional glass dome)
  fillWorld(c, '#14121c'); vgrad(c, -BLEED, 640, W + 2 * BLEED, 500, '#1b1824', '#0d0b12');
  cone(c, 960, -BLEED, 160, 820, 1060 + BLEED, '#fff1c8', .16);
  pool(c, 960, 860, 520, 90, '#fff1c8', .3);
  if (o.scale) return o.scale(c, T);
  rect(c, 840, 700, 240, 230, '#3a2f3f', LW, 4); rect(c, 810, 680, 300, 34, '#4b3d50', LW, 4); rect(c, 820, 916, 280, 24, '#4b3d50', LW, 4);
  c.beginPath(); c.moveTo(800, 690); c.quadraticCurveTo(810, 610, 960, 600); c.quadraticCurveTo(1110, 610, 1120, 690); c.quadraticCurveTo(960, 720, 800, 690); ink(c, '#7a2335', LW);
  circ(c, 818, 688, 10, P.gold, 2.6); circ(c, 1102, 688, 10, P.gold, 2.6); curve(c, 850, 640, 960, 616, 1070, 640, 2.2, '#5a1a28');
  if (o.item) o.item(c, T);
  if (o.dome !== false) { c.save(); c.globalAlpha = .9; c.beginPath(); c.moveTo(780, 690); c.lineTo(780, 430); c.arc(960, 430, 180, Math.PI, 0); c.lineTo(1140, 690); c.lineWidth = 3.4; c.strokeStyle = 'rgba(220,235,255,.75)'; c.stroke();
    c.globalAlpha = .07; c.fillStyle = '#cfe4ff'; c.fill(); c.globalAlpha = .55; curve(c, 830, 640, 820, 420, 900, 300, 6, '#ffffff'); c.restore(); circ(c, 960, 245, 14, '#c9a64a', 3); }
}
function setHouseFront(c, T, o = {}) { // Pieter's house, late afternoon; sale
  const t = T.t;
  sky(c, '#6d86a8', '#c9b49a', '#f0c89a', 760); cloud(c, 300 + t * 6, 160, 1.2, '#efe2d2'); cloud(c, 1500 + t * 5, 120, 1, '#efe2d2');
  stepGable(c, 40, 820, 440, 660, '#6a5a4a', { seed: 2, glass: '#41506e' });
  stepGable(c, 1420, 820, 460, 700, '#7d6248', { seed: 5, glass: '#41506e' });
  stepGable(c, 520, 820, 860, 820, '#8c5340', { seed: 9, rows: 3, cols: 2, doorCol: 1, glass: '#41506e', doorCol2: '#2f4a3a', doorH: 300, doorW: 220 });
  cobbles(c, 820, H, '#6d655d'); ln(c, -BLEED, 820, W + BLEED, 820, LW);
  if (o.cast) o.cast(c, T);
}
function setWinter(c, T, o = {}) { // cold February morning, auction square, clock tower, snow
  const t = T.t;
  sky(c, '#9fb3c8', '#c9d3dc', '#e8e6e0', 740); circ(c, 1500, 190, 60, '#fbf3df', 0); glow(c, 1500, 190, 260, '#fff6dc', .3);
  // town hall with clock
  stepGable(c, 650, 740, 620, 680, '#8a7a6a', { seed: 4, glass: '#55657e', door: false });
  rect(c, 860, 20, 200, 260, '#8a7a6a', LW); poly(c, [[850, 20], [960, -120], [1070, 20]], '#4c5a6a', LW);
  circ(c, 960, 140, 74, '#f3efe4', LW); for (let i = 0; i < 12; i++) { const a = i * TAU / 12; ln(c, 960 + Math.cos(a) * 60, 140 + Math.sin(a) * 60, 960 + Math.cos(a) * 68, 140 + Math.sin(a) * 68, 3); }
  const mins = (o.clock ?? 0); ln(c, 960, 140, 960 + Math.sin(mins * TAU) * 52, 140 - Math.cos(mins * TAU) * 52, 4.6); ln(c, 960, 140, 960 + Math.sin(mins * TAU / 12 + 4.7) * 34, 140 - Math.cos(mins * TAU / 12 + 4.7) * 34, 6); circ(c, 960, 140, 7, INK, 0);
  // snow caps on roofs
  c.fillStyle = '#f4f6fb'; c.fillRect(856, 14, 208, 12); ln(c, 856, 20, 1064, 20, 3);
  stepGable(c, -200, 740, 420, 560, '#7b6d63', { seed: 1, glass: '#55657e' }); stepGable(c, 220, 740, 380, 520, '#6e5e5a', { seed: 2, glass: '#55657e' });
  stepGable(c, 1330, 740, 380, 540, '#7e6a5c', { seed: 3, glass: '#55657e' }); stepGable(c, 1720, 740, 420, 580, '#6e5e5a', { seed: 6, glass: '#55657e' });
  fillRectB(c, 740, H, '#dfe3ea'); ln(c, -BLEED, 740, W + BLEED, 740, LW);
  c.save(); c.globalAlpha = .4; for (let i = 0; i < 18; i++) ell(c, (i * 233) % W, 790 + (i * 61) % 260, 90, 10, '#c7ceda', 0); c.restore();
  if (o.cast) o.cast(c, T);
  snow(c, t, 170, 5, .85);
}
function setBench(c, T, o = {}) { // dusk, canal-side bench in snow; ending
  const t = T.t;
  sky(c, '#1b2140', '#4b4470', '#b5788a', 640); stars(c, 60, 9, 360, t);
  c.fillStyle = '#2a2644'; c.beginPath(); c.moveTo(-BLEED, 640); for (let x = -BLEED; x < W + BLEED; x += 80) { c.lineTo(x, 500 + ((x * 31) % 90)); c.lineTo(x + 40, 470 + ((x * 47) % 70)); c.lineTo(x + 80, 500 + ((x * 23) % 90)); } c.lineTo(W + BLEED, 640); c.fill();
  for (let i = 0; i < 14; i++) { const x = -200 + i * 170; c.fillStyle = '#f2c96e'; c.fillRect(x + 30, 540 + (i % 3) * 20, 14, 18); }
  const wg = c.createLinearGradient(0, 640, 0, 780); wg.addColorStop(0, '#2b2d4d'); wg.addColorStop(1, '#1a1f38'); c.fillStyle = wg; c.fillRect(-BLEED, 640, W + 2 * BLEED, 140);
  for (let i = 0; i < 8; i++) { const yy = 660 + i * 14, x = (i * 211 + t * 24) % (W + 400) - 200; c.globalAlpha = .4; ln(c, x, yy, x + 90, yy, 3, '#f2c96e'); c.globalAlpha = 1; }
  rect(c, -BLEED, 770, W + 2 * BLEED, 30, '#8d8f9e', LW); fillRectB(c, 800, H, '#d7dbe6'); ln(c, -BLEED, 800, W + BLEED, 800, LW);
  ln(c, 1260, 520, 1260, 800, 7); lantern(c, 1260, 500, t, 1.3);
  // bench
  rect(c, 700, 760, 520, 22, '#6b4a2e', LW, 4); rect(c, 700, 690, 520, 18, '#6b4a2e', LW, 4); rect(c, 700, 652, 520, 18, '#6b4a2e', LW, 4);
  for (const x of [730, 1170]) { ln(c, x, 652, x, 900, 7); } rect(c, 700, 756, 520, 6, '#f4f6fb', 0);
  if (o.cast) o.cast(c, T);
  snow(c, t, 120, 8, .7);
}
