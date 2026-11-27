// ---------- shared props + set building blocks (from the Tulip Mania build) (bible §5): dense, muted rooms; practical lights; labels tell the joke ----------
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

