// Props shared with the first video + new ones for this script. Drawn in code only.
const S = (k, d) => (SHOTS[k] = d);
const card = (k, text, o = {}) => S(k, { card: (c, T) => blackCard(c, T, text, o), typing: true });
const chap = (k, n, title) => S(k, { card: (c, T) => chapterCard(c, T, n, title) });
const num = (T, cueW, to, dur = .9, from = 0, nth) => { const s = nth != null ? T.sinceN(cueW, nth) : T.since(cueW); return s < 0 ? from : lerp(from, to, easeOut(s / dur)); };
const B2 = v => '$' + v.toFixed(2) + 'B';
const commas = v => Math.round(v).toLocaleString('en-US');
function billboard(c, x, y, w, h, draw) { line(c, x - w * .3, y + h / 2, x - w * .3, y + h / 2 + 260, 14); line(c, x + w * .3, y + h / 2, x + w * .3, y + h / 2 + 260, 14); box(c, x - w / 2, y - h / 2, w, h, 14, '#18202c'); lightPool(c, x, y, w * .7, '#ffd36e', .25); for (let i = 0; i < 5; i++) { circ(c, x - w / 2 + 40 + i * (w - 80) / 4, y - h / 2 - 10, 9, '#fff3b0', 3); } draw(); }
function storefront(c, x, y, t, txt) { box(c, x - 420, y - 520, 840, 520, 10, '#3a2f5a'); sign(c, x, y - 470, 600, 80, txt, { bg: '#ff4f8b', fg: '#fff', size: 48, glow: '#ff4f8b' }); rr(c, x - 360, y - 400, 720, 330, 8); fs(c, '#ffe7a8'); lightPool(c, x, y - 240, 500, '#ffd36e', .6); for (let i = 0; i < 6; i++) gameBox(c, x - 290 + i * 116, y - 110, 70, 120, {}); box(c, x - 60, y - 70, 120, 70, 4, '#2a2340'); }
function skylineBars(c, x0, base, vals, labels, o = {}) { const bw = o.bw || 120, gap = o.gap || 40; vals.forEach((v, i) => { const x = x0 + i * (bw + gap); const h = v; if (o.crumble && i === o.crumble.i && o.crumble.p > 0) { const p = o.crumble.p, keep = h * (1 - p * (1 - o.crumble.to)); box(c, x, base - keep, bw, keep, 6, o.col?.[i] || '#7aa7d9'); const R = rand(i + 3); for (let k = 0; k < 9; k++) { const fx = x + R() * bw, fy = base - keep - 40 + Math.min(1, p * 1.4) * (keep + 40 - 10 - R() * 30) - (1 - p) * R() * 200; box(c, fx - 14, fy - 14, 28, 22, 4, o.col?.[i] || '#7aa7d9', 3); } } else { box(c, x, base - h, bw, h, 6, o.col?.[i] || '#7aa7d9'); for (let yy = base - h + 24; yy < base - 30; yy += 46) { windowRect(c, x + 22, yy, 28, 26, '#e8f6ff'); windowRect(c, x + bw - 50, yy, 28, 26, '#e8f6ff'); } } if (labels && labels[i]) label(c, labels[i], x + bw / 2, base + 38, 30, INK, { stroke: false, maxW: bw + 30 }); }); line(c, x0 - 40, base, x0 + vals.length * (bw + gap), base, 6); }
function pizza(c, x, y, r, taken, txt) { ell(c, x, y + 14, r, r * .42, '#c98a3c'); ell(c, x, y, r, r * .42, '#f2b35b'); ell(c, x, y, r * .86, r * .34, '#e94b3c', 3.5); const R = rand(5); for (let i = 0; i < 9; i++) { const a = R() * TAU, d = R() * .7; circ(c, x + Math.cos(a) * r * .8 * d, y + Math.sin(a) * r * .3 * d, 14, '#9b1d1d', 3); } if (taken) { c.save(); c.beginPath(); c.ellipse(x, y + 7, r + 6, r * .42 + 14, 0, 0, TAU); c.clip(); for (let k = 0; k < taken; k++) { const a = -Math.PI / 2 + k * TAU / 8; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 30); c.ellipse(x, y + 7, r + 30, r * .42 + 40, 0, a, a + TAU / 8); c.closePath(); c.fillStyle = '#c99a66'; c.fill(); } c.restore(); c.save(); c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(-Math.PI / 2) * r, y + Math.sin(-Math.PI / 2) * r * .42); c.moveTo(x, y); const a2 = -Math.PI / 2 + taken * TAU / 8; c.lineTo(x + Math.cos(a2) * r, y + Math.sin(a2) * r * .42); c.lineWidth = 4; c.strokeStyle = INK; c.stroke(); c.restore(); } if (txt) label(c, txt, x, y - 6, r * .3, '#fff', { maxW: r * 1.4 }); }
function slice(c, x, y, s = 1, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); poly(c, [[0, 0], [-40, -110], [40, -110]], '#f2b35b'); poly(c, [[0, -10], [-30, -96], [30, -96]], '#e94b3c', 3); circ(c, -6, -60, 9, '#9b1d1d', 3); circ(c, 10, -84, 8, '#9b1d1d', 3); box(c, -44, -122, 88, 18, 8, '#c98a3c', 3.5); c.restore(); }
function ticketBooth(c, x, y, txt) { box(c, x - 160, y - 330, 320, 330, 10, '#e63946'); poly(c, [[x - 190, y - 330], [x + 190, y - 330], [x + 150, y - 400], [x - 150, y - 400]], '#ffd166'); rr(c, x - 110, y - 270, 220, 140, 8); fs(c, '#fff3d6'); sign(c, x, y - 365, 280, 50, txt, { bg: '#ffd166', size: 34 }); }
function crystalBall(c, x, y, r, t, inner) { box(c, x - r * .8, y + r * .7, r * 1.6, r * .5, 12, '#7b4a2a'); circ(c, x, y, r, 'rgba(170,200,255,.55)'); lightPool(c, x, y, r * 1.3, '#a8c8ff', .5); c.save(); c.beginPath(); c.arc(x, y, r - 4, 0, TAU); c.clip(); inner && inner(); c.restore(); circ(c, x, y, r, null); c.save(); c.globalAlpha = .4; ell(c, x - r * .4, y - r * .45, r * .2, r * .32, '#fff', 0, -.5); c.restore(); }
function jar(c, x, y, w, h, txt) { c.save(); c.globalAlpha = .35; box(c, x - w / 2, y - h, w, h, 40, '#bfe6ff', 0); c.restore(); rr(c, x - w / 2, y - h, w, h, 40); fs(c, null, 5); box(c, x - w * .4, y - h - 40, w * .8, 50, 10, '#c0392b'); sign(c, x, y - h * .25, w * .6, 70, txt, { bg: '#fff8e1', size: 34 }); }
function seesaw(c, x, y, a, L = 900) { poly(c, [[x - 60, y + 120], [x + 60, y + 120], [x, y]], '#8d6e63'); c.save(); c.translate(x, y); c.rotate(a); box(c, -L / 2, -18, L, 26, 10, '#c49a6c'); c.restore(); return { l: [x - Math.cos(a) * L * .45, y - Math.sin(a) * L * .45], r: [x + Math.cos(a) * L * .45, y + Math.sin(a) * L * .45] }; }
function moneyBag(c, x, y, s = 1, txt = '$') { c.save(); c.translate(x, y); c.scale(s, s); c.beginPath(); c.moveTo(-30, -110); c.quadraticCurveTo(-90, -40, -70, 0); c.lineTo(70, 0); c.quadraticCurveTo(90, -40, 30, -110); c.closePath(); fs(c, '#c8a46a'); box(c, -36, -124, 72, 20, 8, '#a07a45', 3.5); label(c, txt, 0, -50, 54, '#5d4216', { stroke: false }); c.restore(); }
function confetti(c, t, seed = 1, n = 60, area = [0, 0, W, H]) { const R = rand(seed); for (let i = 0; i < n; i++) { const x = area[0] + R() * area[2], sp = 80 + R() * 120, y = area[1] + ((R() * area[3] + t * sp) % area[3]); c.save(); c.translate(x + Math.sin(t * 3 + i) * 12, y); c.rotate(t * 4 + i); c.fillStyle = ['#ff6f91', '#ffc75f', '#58d68d', '#5dade2', '#fff'][i % 5]; c.fillRect(-7, -4, 14, 8); c.restore(); } }
function ladder(c, x, y, h) { line(c, x - 40, y, x - 40, y - h, 9); line(c, x + 40, y, x + 40, y - h, 9); for (let k = 30; k < h; k += 60) line(c, x - 40, y - k, x + 40, y - k, 7); }
function priceTag(c, x, y, txt, rot = 0, col = '#fff59d') { c.save(); c.translate(x, y); c.rotate(rot); poly(c, [[-80, -40], [60, -40], [96, 0], [60, 40], [-80, 40]], col); circ(c, 70, 0, 8, '#fff', 3); label(c, txt, -14, 2, 40, INK, { stroke: false, maxW: 118 }); c.restore(); }
function newspaper(c, x, y, w, h, head) { box(c, x - w / 2, y - h / 2, w, h, 4, '#f7f4ea'); label(c, head, x, y - h * .3, h * .16, INK, { stroke: false, maxW: w - 30 }); for (let i = 0; i < 5; i++) line(c, x - w * .4, y + i * h * .1, x + w * .4, y + i * h * .1, 3, '#aaa'); }
function truck(c, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); box(c, -120, -150, 170, 120, 8, '#f4f4f0'); box(c, 50, -110, 80, 80, 8, '#e63946'); windowRect(c, 70, -100, 40, 34, '#bfe3ff'); circ(c, -70, -20, 26, '#333'); circ(c, 80, -20, 26, '#333'); gameBox(c, -35, -60, 50, 70, {}); c.restore(); }
function envelope(c, x, y, w, txt, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); box(c, -w / 2, -w * .33, w, w * .66, 6, '#fff8e1'); c.beginPath(); c.moveTo(-w / 2, -w * .33); c.lineTo(0, w * .05); c.lineTo(w / 2, -w * .33); fs(c, null, 3.5); if (txt) label(c, txt, 0, w * .16, w * .13, RED, { maxW: w * .8 }); c.restore(); }
function stopwatch(c, x, y, r, t) { box(c, x - 14, y - r - 26, 28, 24, 5, '#999', 3.5); circ(c, x, y, r, '#f4f4f0'); const a = t * 2 - Math.PI / 2; line(c, x, y, x + Math.cos(a) * r * .75, y + Math.sin(a) * r * .75, 5, RED); circ(c, x, y, 5, INK, 0); }
function bigTV(c, x, y, w, h, draw) { box(c, x - w / 2, y - h / 2, w, h, 16, '#151a22'); rr(c, x - w / 2 + 16, y - h / 2 + 16, w - 32, h - 32, 8); fs(c, '#0b2140', 3); c.save(); rr(c, x - w / 2 + 16, y - h / 2 + 16, w - 32, h - 32, 8); c.clip(); draw(); c.restore(); lightPool(c, x, y, w * .7, '#7fc8ff', .3); }
function filmReel(c, x, y, r, expr, t) { circ(c, x, y, r, '#3b3f4a'); for (let a = 0; a < 6; a++) circ(c, x + Math.cos(a * TAU / 6) * r * .62, y + Math.sin(a * TAU / 6) * r * .62, r * .18, '#1b1e25', 3); face(c, x, y, r * .45, expr, t, { noNose: true, seed: 4, skin: '#3b3f4a' }); line(c, x - r * .5, y + r, x - r * .6, y + r * 1.6, 8); line(c, x + r * .5, y + r, x + r * .6, y + r * 1.6, 8); }
function cashRegister(c, x, y, s, open) { c.save(); c.translate(x, y); c.scale(s, s); box(c, -150, -120, 300, 120, 12, '#c0392b'); poly(c, [[-120, -120], [120, -120], [90, -220], [-90, -220]], '#e74c3c'); box(c, -80, -210, 160, 50, 6, '#111', 3); for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) box(c, -100 + j * 52, -150 + i * 0 - 0, 40, 22, 5, '#f5f5f5', 2.5); box(c, -140, -20 + (open ? 40 : 0), 280, 40, 6, '#a93226'); c.restore(); }
function controller(c, x, y, s, glow) { c.save(); c.translate(x, y); c.scale(s, s); c.beginPath(); c.moveTo(-140, -30); c.bezierCurveTo(-160, 80, -90, 110, -60, 40); c.lineTo(60, 40); c.bezierCurveTo(90, 110, 160, 80, 140, -30); c.bezierCurveTo(120, -70, -120, -70, -140, -30); fs(c, '#2b2f3a'); circ(c, -80, -10, 22, '#444a58', 3.5); [[80, -30, '#5dade2'], [110, -5, '#e74c3c'], [80, 20, '#58d68d'], [50, -5, '#f4d03f']].forEach(([a, b, col]) => circ(c, a, b, 12, col, 3)); box(c, -24, -22, 48, 20, 8, glow ? '#ffe66d' : '#666', 3); if (glow) lightPool(c, 0, -12, 120, '#ffe66d', .6); label(c, 'START', 0, -52, 22, '#fff'); c.restore(); }
function piggy(c, x, y, s, cracked, t) { c.save(); c.translate(x, y); c.scale(s, s); ell(c, 0, 0, 130, 95, '#f7a8c4'); circ(c, 128, -10, 40, '#f7a8c4'); ell(c, 160, -10, 16, 20, '#f08bb0', 3.5); poly(c, [[-40, -88], [-10, -130], [10, -86]], '#f7a8c4'); line(c, -70, 80, -70, 120, 12); line(c, 60, 80, 60, 120, 12); box(c, -30, -96, 60, 10, 4, '#333', 0); face(c, 90, -20, 34, cracked ? 'shock' : 'neutral', t, { noNose: true, seed: 3, skin: '#f7a8c4' }); if (cracked) { c.beginPath(); c.moveTo(-60, -80); c.lineTo(-40, -20); c.lineTo(-70, 20); c.lineTo(-40, 70); c.lineWidth = 5; c.strokeStyle = INK; c.stroke(); } c.restore(); }

function cannon(c, x, y) { c.save(); c.translate(x, y); box(c, -110, -40, 220, 60, 12, '#8d6e63'); circ(c, -70, 30, 34, '#5d4037'); circ(c, 70, 30, 34, '#5d4037'); c.rotate(-.55); box(c, -50, -260, 100, 250, 14, '#e74c3c'); for (let i = 0; i < 4; i++) box(c, -50, -240 + i * 60, 100, 20, 0, '#fff', 3); ell(c, 0, -262, 50, 18, '#7b241c'); c.restore(); }
function btc(c, x, y, r, expr, t) { circ(c, x, y + r * .1, r, '#c9971a'); circ(c, x, y, r, '#f7a823'); circ(c, x, y, r * .78, null, 3.5); face(c, x, y + r * .1, r * .5, expr, t, { noNose: true, seed: 7, skin: '#f7a823' }); label(c, 'BTC', x, y - r * .55, r * .3, '#fff'); line(c, x - r * .4, y + r * .95, x - r * .5, y + r * 1.5, 9); line(c, x + r * .4, y + r * .95, x + r * .5, y + r * 1.5, 9); ell(c, x - r * .58, y + r * 1.52, 18, 8, INK, 0); ell(c, x + r * .58, y + r * 1.52, 18, 8, INK, 0); }
function chip(c, x, y, r, expr, t, held) { for (let i = -2; i <= 2; i++) { line(c, x + i * r * .35, y - r, x + i * r * .35, y - r * 1.25, 7); line(c, x - r, y + i * r * .35, x - r * 1.25, y + i * r * .35, 7); line(c, x + r, y + i * r * .35, x + r * 1.25, y + i * r * .35, 7); } box(c, x - r, y - r, r * 2, r * 2, 16, '#2b3a33'); box(c, x - r * .7, y - r * .7, r * 1.4, r * 1.4, 10, '#3f5a4c', 3); box(c, x - r * .62, y - r * .55, r * 1.24, r * 1.1, 10, '#d6f5e3', 3); face(c, x, y, r * .5, expr, t, { noNose: true, seed: 5, skin: '#d6f5e3', sweat: expr === 'worried' }); line(c, x - r * .3, y + r, x - r * .35, y + r * 1.7, 9); line(c, x + r * .3, y + r, x + r * .35, y + r * 1.7, 9); ell(c, x - r * .42, y + r * 1.72, 18, 8, INK, 0); ell(c, x + r * .42, y + r * 1.72, 18, 8, INK, 0); }

// ---------- new props for "five moves" ----------
// the studio, as a talking gold star (generic five-point star, no logo)
function star(c, x, y, r, expr, t, o = {}) {
  c.save(); c.translate(x, y + Math.sin(t * 2.2) * 2); reg(c, -r * 1.05, -r * 1.05, r * 1.05, r * 1.6);
  shadow(c, 0, r * 1.55, r * .8);
  line(c, -r * .3, r * .7, -r * .36, r * 1.5, 9); line(c, r * .3, r * .7, r * .36, r * 1.5, 9); ell(c, -r * .45, r * 1.52, 18, 8, INK, 0); ell(c, r * .45, r * 1.52, 18, 8, INK, 0);
  const arm = o.arms || [[-1.25, .1], [1.25, .1]]; arm.forEach(([ax, ay]) => { line(c, ax * r * .62, r * .05, ax * r, ay * r, 8); circ(c, ax * r, ay * r, 11, '#f2c49b', 3); });
  c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr_ = i % 2 ? r * .48 : r; i ? c.lineTo(Math.cos(a) * rr_, Math.sin(a) * rr_) : c.moveTo(Math.cos(a) * rr_, Math.sin(a) * rr_); } c.closePath(); fs(c, '#f6c443');
  c.save(); c.clip(); c.globalAlpha = .1; circ(c, r * .5, r * .25, r * .75, '#7a4b00', 0); c.restore();
  face(c, 0, r * .08, r * .42, expr, t, { noNose: true, seed: 21, skin: '#f6c443', sweat: o.sweat, talk: o.talk });
  if (o.finger) line(c, 0, r * .2, 0, r * .42, 7);
  if (o.name) label(c, o.name, 0, r * 1.85, Math.max(24, r * .26), '#fff');
  c.restore();
}
function balance(c, x, y, tilt, L, R, o = {}) { // tilt > 0: left side down
  box(c, x - 80, y - 20, 160, 30, 8, '#8d6e63'); line(c, x, y - 20, x, y - 420, 12); circ(c, x, y - 430, 18, GOLD, 4);
  c.save(); c.translate(x, y - 420); c.rotate(-tilt); box(c, -380, -10, 760, 22, 10, '#c49a6c'); c.restore();
  const lx = x - Math.cos(tilt) * 360, ly = y - 420 + Math.sin(tilt) * 360, rx = x + Math.cos(tilt) * 360, ry = y - 420 - Math.sin(tilt) * 360;
  [[lx, ly, L], [rx, ry, R]].forEach(([px, py, f]) => { line(c, px, py, px - 110, py + 170, 3); line(c, px, py, px + 110, py + 170, 3); ell(c, px, py + 176, 150, 22, '#b9c2cc'); f && f(px, py + 166); });
}
function telescope(c, x, y, s = 1) { c.save(); c.translate(x, y); c.scale(s, s); line(c, 0, 0, -40, 120, 7); line(c, 0, 0, 40, 120, 7); line(c, 0, 0, 0, 120, 7); c.rotate(-.5); box(c, -20, -30, 170, 50, 14, '#3d5a80'); box(c, 140, -40, 40, 70, 10, '#2b405c'); c.restore(); }
function safe(c, x, y, w, h, shut) { box(c, x - w / 2, y - h, w, h, 18, '#7a8392'); rr(c, x - w / 2 + 24, y - h + 24, w - 48, h - 48, 12); fs(c, shut ? '#8f99a8' : '#2a2f38', 4); if (shut) { circ(c, x, y - h / 2, w * .14, '#c9ced6'); for (let a = 0; a < 6; a++) line(c, x, y - h / 2, x + Math.cos(a) * w * .1, y - h / 2 + Math.sin(a) * w * .1, 4); } }
function book(c, x, y, w, h, title, sub) { c.save(); c.translate(x, y); reg(c, -w / 2, -h / 2, w / 2 + 20, h / 2 + 10); box(c, -w / 2 + 14, -h / 2 + 10, w, h, 10, '#f3efe6'); box(c, -w / 2, -h / 2, w, h, 10, '#1f5f4a'); box(c, -w / 2, -h / 2, 22, h, 6, '#174636', 3);
  title.forEach((s, i) => label(c, s, 10, -h * .28 + i * h * .13, h * .095, '#fff', { maxW: w - 60 })); if (sub) label(c, sub, 10, h * .32, h * .07, GOLD, { maxW: w - 60 }); c.restore(); }
function stairs(c, x, y, n, sw, sh, col = '#c49a6c') { for (let i = 0; i < n; i++) box(c, x + i * sw, y - (i + 1) * sh, sw * (n - i), sh, 4, col); }
function phonePost(c, x, y, w, h, lines_, o = {}) { reg(c, x - w / 2, y - h / 2, x + w / 2, y + h / 2); box(c, x - w / 2, y - h / 2, w, h, 40, '#14161c'); rr(c, x - w / 2 + 18, y - h / 2 + 50, w - 36, h - 100, 14); fs(c, '#f7f7f2', 3); box(c, x - 50, y - h / 2 + 20, 100, 14, 7, '#333', 0);
  circ(c, x - w / 2 + 70, y - h / 2 + 100, 26, '#9aa3b5', 3); label(c, o.user || '@LEAKS', x - w / 2 + 170, y - h / 2 + 100, 30, INK, { stroke: false });
  lines_.forEach((s, i) => label(c, s, x, y - h * .12 + i * h * .14, h * .075, i === 0 ? RED : INK, { stroke: false, maxW: w - 80 })); }
function shutter(c, x, y, w, h, p) { box(c, x - w / 2 - 20, y - h - 30, w + 40, 40, 6, '#5d4037'); const sh = h * clamp(p); c.save(); rr(c, x - w / 2, y - h, w, sh, 4); c.fillStyle = '#9aa3ad'; c.fill(); c.restore(); for (let k = 30; k < sh; k += 30) line(c, x - w / 2, y - h + k, x + w / 2, y - h + k, 3); if (sh > 4) { rr(c, x - w / 2, y - h, w, sh, 4); fs(c, null, 4); } }
function doorway(c, x, y, w, h, top, price, col) { box(c, x - w / 2 - 16, y - h - 16, w + 32, h + 16, 12, '#8d6e63'); box(c, x - w / 2, y - h, w, h, 8, col); circ(c, x + w * .32, y - h * .45, 10, GOLD, 3); sign(c, x, y - h - 60, w + 40, 70, top, { bg: '#fff8e1', size: 34 }); priceTag(c, x, y - h * .6, price, 0); }
function magnifier(c, x, y, r, inner) { c.save(); c.beginPath(); c.arc(x, y, r, 0, TAU); c.clip(); c.fillStyle = '#fffdf5'; c.fillRect(x - r, y - r, r * 2, r * 2); inner && inner(); c.restore(); circ(c, x, y, r, null, 12); c.save(); c.translate(x, y); c.rotate(.8); box(c, r - 4, -18, 170, 36, 14, '#5d4037'); c.restore(); }
function globe(c, x, y, r, t) { circ(c, x, y, r, '#5dade2'); c.save(); c.beginPath(); c.arc(x, y, r - 3, 0, TAU); c.clip(); const o = (t * 40) % (r * 2); [[-.4, -.3, .5, .35], [.3, .1, .45, .5], [-.2, .5, .3, .2]].forEach(([a, b, w, h]) => ell(c, x + a * r * 2 - o + r, y + b * r, w * r, h * r, '#58d68d', 3)); c.restore(); circ(c, x, y, r, null); line(c, x, y + r, x, y + r + 60, 10); box(c, x - 80, y + r + 56, 160, 26, 8, '#8d6e63'); }
function receipt(c, x, y, w, h, lines_, o = {}) { reg(c, x - w / 2, y - h / 2, x + w / 2, y + h / 2); c.beginPath(); c.moveTo(x - w / 2, y - h / 2); c.lineTo(x + w / 2, y - h / 2); for (let i = 0; i <= 10; i++) c.lineTo(x + w / 2 - i * w / 10, y + h / 2 + (i % 2 ? 14 : 0)); c.closePath(); fs(c, '#fffdf3');
  lines_.forEach((s, i) => label(c, s, x, y - h / 2 + 50 + i * (h - 80) / Math.max(1, lines_.length - 1), o.size || 34, o.cols?.[i] || INK, { stroke: false, maxW: w - 40 })); }
function rocket(c, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); poly(c, [[-60, 0], [-110, 60], [-60, 40]], '#e74c3c'); poly(c, [[60, 0], [110, 60], [60, 40]], '#e74c3c'); c.beginPath(); c.moveTo(-60, 40); c.lineTo(-60, -200); c.quadraticCurveTo(0, -330, 60, -200); c.lineTo(60, 40); c.closePath(); fs(c, '#eef1f5'); circ(c, 0, -150, 30, '#5dade2'); poly(c, [[-40, 40], [40, 40], [0, 120]], '#ffb347'); c.restore(); }
function factory(c, x, y, w, t) { box(c, x - w / 2, y - 300, w, 300, 8, '#b0563f'); for (let i = 0; i < 4; i++) { const sx = x - w / 2 + 60 + i * (w - 120) / 3; box(c, sx - 26, y - 460, 52, 160, 4, '#8c3f2e'); for (let k = 0; k < 3; k++) circ(c, sx + Math.sin(t + k + i) * 10, y - 500 - k * 50 - ((t * 40) % 50), 24 + k * 6, 'rgba(230,230,235,.9)', 3); } for (let i = 0; i < 6; i++) windowRect(c, x - w / 2 + 40 + i * (w - 80) / 6, y - 230, (w - 120) / 7, 70, '#ffe08a'); box(c, x - 70, y - 120, 140, 120, 6, '#5d4037'); }
function cabinet(c, x, y, s, open) { c.save(); c.translate(x, y); c.scale(s, s); box(c, -110, -420, 220, 420, 10, '#7f8c8d'); for (let i = 0; i < 4; i++) { box(c, -96 + (open && i === 1 ? 60 : 0), -404 + i * 100, 192, 84, 6, '#95a5a6', 3); box(c, -30 + (open && i === 1 ? 60 : 0), -370 + i * 100, 60, 14, 6, '#555', 2.5); } if (open) { for (let k = 0; k < 4; k++) paperSheet(c, 40 + k * 18, -330 - k * 6, .1 * k, .7); } c.restore(); }
function laptop(c, x, y, s, screen) { c.save(); c.translate(x, y); c.scale(s, s); reg(c, -170, -230, 170, 20); box(c, -150, -220, 300, 200, 14, '#2b2f3a'); rr(c, -136, -206, 272, 172, 8); fs(c, '#e8f3ff', 3); c.save(); rr(c, -136, -206, 272, 172, 8); c.clip(); screen && screen(); c.restore(); poly(c, [[-170, 0], [170, 0], [150, -20], [-150, -20]], '#9aa3ad'); c.restore(); }
function thermometer(c, x, y, h, p, lab) { reg(c, x - 60, y - h - 20, x + 60, y + 60); box(c, x - 34, y - h, 68, h, 34, '#fff'); circ(c, x, y + 20, 56, RED); const f = (h - 50) * clamp(p); box(c, x - 18, y - f, 36, f + 10, 18, RED, 0); for (let i = 1; i < 6; i++) line(c, x + 34, y - i * h / 6, x + 54, y - i * h / 6, 4); if (lab) label(c, lab, x, y - h - 50, 40, '#fff'); }
function conveyor(c, x, y, w, t, item) { box(c, x - w / 2, y, w, 34, 17, '#3d4452'); for (let i = 0; i < 8; i++) circ(c, x - w / 2 + 30 + i * (w - 60) / 7, y + 17, 12, '#9aa3ad', 3); const sp = 140, off = (t * 120) % sp; for (let k = -1; k < w / sp + 1; k++) { const ix = x - w / 2 + k * sp + off; if (ix > x - w / 2 + 10 && ix < x + w / 2 - 60) item(ix, y); } }
function weight(c, x, y, s, txt) { c.save(); c.translate(x, y); c.scale(s, s); poly(c, [[-110, 0], [110, 0], [80, -160], [-80, -160]], '#3d4452'); c.beginPath(); c.arc(0, -170, 40, Math.PI, 0); fs(c, null, 14); label(c, txt, 0, -70, 70, '#fff'); c.restore(); }
function feather(c, x, y, s, rot, txt) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.beginPath(); c.moveTo(0, -120); c.quadraticCurveTo(70, -40, 0, 120); c.quadraticCurveTo(-70, -40, 0, -120); fs(c, '#fffdf3'); line(c, 0, -110, 0, 150, 4); if (txt) label(c, txt, 0, -10, 40, '#1faa55', { stroke: false }); c.restore(); }
function tile(c, x, y, s, n, lit) { box(c, x - s / 2, y - s / 2, s, s, 18, lit ? GOLD : '#fff8e1'); label(c, String(n), x, y, s * .55, lit ? '#fff' : INK, { stroke: lit }); if (lit) lightPool(c, x, y, s * 1.4, '#ffd36e', .5); }
function giftBox(c, x, y, w, txt) { box(c, x - w / 2, y - w * .7, w, w * .7, 8, '#e74c3c'); box(c, x - w / 2 - 10, y - w * .85, w + 20, w * .2, 8, '#ef6b5f'); box(c, x - 12, y - w * .85, 24, w * .85, 0, GOLD, 3); c.beginPath(); c.ellipse(x - 30, y - w * .9, 30, 18, -.4, 0, TAU); fs(c, GOLD, 3); c.beginPath(); c.ellipse(x + 30, y - w * .9, 30, 18, .4, 0, TAU); fs(c, GOLD, 3); if (txt) label(c, txt, x, y - w * .35, w * .16, '#fff', { maxW: w - 30 }); }
function envelope3(c, x, y, w, n, open) { envelope(c, x, y, w, null); circ(c, x, y + w * .1, w * .15, RED); label(c, String(n), x, y + w * .1, w * .17, '#fff', { stroke: false }); }
function trophy(c, x, y, s, txt) { c.save(); c.translate(x, y); c.scale(s, s); reg(c, -140, -260, 140, 80); box(c, -30, -40, 60, 80, 6, '#c9971a'); c.beginPath(); c.moveTo(-120, -250); c.lineTo(120, -250); c.quadraticCurveTo(120, -40, 0, -40); c.quadraticCurveTo(-120, -40, -120, -250); fs(c, GOLD); box(c, -100, 40, 200, 40, 8, '#8b5a2b'); if (txt) label(c, txt, 0, -160, 30, '#7a5200', { stroke: false, maxW: 200 }); c.restore(); }
function cartridge(c, x, y, s, txt) { c.save(); c.translate(x, y); c.scale(s, s); box(c, -90, -220, 180, 220, 12, '#9aa3ad'); box(c, -70, -200, 140, 110, 6, '#e8d9a8', 3); label(c, txt, 0, -145, 26, INK, { stroke: false, maxW: 120 }); for (let i = 0; i < 6; i++) line(c, -60 + i * 24, -40, -60 + i * 24, -10, 4); c.restore(); }
function screenTV(c, x, y, w, h, inner) { reg(c, x - w / 2, y - h / 2, x + w / 2, y + h / 2 + 40); box(c, x - w / 2, y - h / 2, w, h, 16, '#151a22'); rr(c, x - w / 2 + 14, y - h / 2 + 14, w - 28, h - 28, 8); fs(c, '#0b2140', 3); c.save(); rr(c, x - w / 2 + 14, y - h / 2 + 14, w - 28, h - 28, 8); c.clip(); inner && inner(); c.restore(); line(c, x, y + h / 2, x, y + h / 2 + 30, 10); line(c, x - 60, y + h / 2 + 34, x + 60, y + h / 2 + 34, 10); }
function playIcon(c, x, y, s) { circ(c, x, y, s, 'rgba(255,255,255,.15)', 4); poly(c, [[x - s * .35, y - s * .5], [x - s * .35, y + s * .5], [x + s * .55, y]], '#fff', 4); }
// new cast members

// =====================================================================================
// CIA LUNIK kit: cast + period props. Everything code-drawn, generic, no logos, no likenesses.
// =====================================================================================
// ---------- CAST (crayon bible build, 1959 costume) ----------
Object.assign(CAST, {
  driver: { body: '#8a5a34', jacket: true, hat: 'workcap', hatCol: '#3f6f8f', tache: '#22160f', skin: '#a8714a', seed: 41, trousers: '#3d4a5c' },
  newdriver: { body: '#46505e', jacket: true, hat: 'flatcap', hatCol: '#6b6458', skin: '#f2c49b', seed: 42, trousers: '#2f3540' },
  scott: { body: '#8c929b', suit: true, shirt: '#f3efe6', bowtie: '#a3312b', glasses: true, hair: 'grey', skin: '#f6d2b4', seed: 43 },
  silveti: { body: '#262a33', suit: true, tie: '#7a1f22', shirt: '#eef0f4', hair: 'slick', tache: '#151515', skin: '#c98d5e', seed: 44 },
  finer: { body: '#ece6d6', rolled: true, tie: '#2c4a6b', glasses: true, hair: 'part', hairCol: '#5a3a22', skin: '#f2c49b', seed: 45, trousers: '#4a4f5a' },
  spec1: { body: '#bcd0e0', rolled: true, hair: 'curly', hairCol: '#2a1a12', skin: '#f6d2b4', seed: 46, trousers: '#3d4452' },
  spec2: { body: '#d9c9a0', rolled: true, hair: 'crew', hairCol: '#b5562a', skin: '#f2c49b', seed: 47, trousers: '#5b4a3a' },
  spec3: { body: '#9fb5a0', rolled: true, glasses: 'thick', hair: 'sides', hairCol: '#3a2a22', skin: '#d9a072', seed: 48, trousers: '#3a4038' },
  dean: { body: '#b8995e', trench: '#b8995e', tie: '#2b3a55', hat: 'fedora', hatCol: '#5b4a3a', skin: '#f2c49b', seed: 49 },
  zambernardi: { body: '#6e715c', trench: '#6e715c', tie: '#7a1f22', hat: 'fedora', hatCol: '#2f3238', skin: '#d9a072', seed: 50, tache: '#22160f' },
  kolomyakov: { body: '#3a3e3b', longcoat: '#3a3e3b', fur: '#6b5640', hat: 'homburg', hatCol: '#1d1f24', skin: '#f6d2b4', seed: 51, expr: 'stern', trousers: '#2a2c2e' },
  checker: { body: '#56624d', jacket: true, hat: 'peaked', hatCol: '#56624d', hatBand: '#3d4a37', skin: '#f2c49b', seed: 52, trousers: '#3a4134' },
  guard: { body: '#5d6b45', longcoat: '#5d6b45', hat: 'ushanka', hatCol: '#5d6b45', hatFur: '#4a3b2c', skin: '#f6d2b4', seed: 53, expr: 'stern', trousers: '#3a4430' },
  analyst: { body: '#f3efe6', tie: '#1d4ed8', hair: 'short', hairCol: '#111', seed: 12, skin: '#7a4b2e' },
  analyst2: { body: '#e9eef3', tie: '#8a3a22', glasses: true, hair: 'part', hairCol: '#c9a35a', seed: 54, skin: '#f6d2b4' },
  radioman: { body: '#4b5a4b', jacket: true, hat: 'headphones', hair: 'crew', hairCol: '#2a1a12', skin: '#d9a072', seed: 55, trousers: '#2f3540' },
  visitor1: { body: '#c0504d', hair: 'bun', hairCol: '#2a1a12', skin: '#a8714a', seed: 56 },
  visitor2: { body: '#3f7a8c', suit: true, tie: '#d9a441', hat: 'fedora', hatCol: '#7a6a55', skin: '#f2c49b', seed: 57 },
  visitor3: { body: '#d9a441', hair: 'curly', hairCol: '#3a2a22', skin: '#7a4b2e', seed: 58 },
  visitor4: { body: '#5b8f5a', hair: 'short', hairCol: '#5a3a1a', skin: '#c98d5e', seed: 59, tache: true },
  clerkMx: { body: '#e9e4d6', bowtie: '#2b3a55', hair: 'slick', skin: '#c98d5e', seed: 60, tache: '#151515' }, // hotel desk / generic Mexican clerk
});
// P(): same call as the bible, now drawn by crayon() (same proportions, adds 1959 costume + new poses)
P = function (name, o) { return crayon(window.__c, { ...CAST[name], ...o }); };
const NAMES = { driver: 'THE DRIVER', newdriver: 'NEW DRIVER', scott: 'WINSTON SCOTT', silveti: 'EDUARDO DÍAZ SILVETI', finer: 'SYDNEY WESLEY FINER', dean: 'WARREN DEAN', zambernardi: 'ROBERT ZAMBERNARDI', kolomyakov: 'BORIS KOLOMYAKOV', checker: 'SOVIET CHECKER', guard: 'SOVIET GUARD' };

// ---------- the Lunik (upper stage). Horizontal, nose to the right, centred at (x,y), length L ----------
// o: cutaway (0..1 reveals internals), blueprint (white line drawing), capOff (0..1 base cap slides off left), open (0..1 nose hatch),
//    sphereOut (0..1 payload sphere lifts out), seal ('ok'|'cut'|'new'), rot, glint (t), labels (true for callouts), paint ('show'|'raw')
function lunik(c, x, y, L, o = {}) {
  const h = L * .3, bp = o.blueprint, inkc = bp ? '#e8f1ff' : INK, lw = bp ? 3 : LW;
  const F = (fill) => bp ? null : fill;
  const S_ = (f) => { if (bp) { c.lineWidth = lw; c.strokeStyle = inkc; c.lineJoin = 'round'; c.stroke(); } else fs(c, f); };
  c.save(); c.translate(x, y); if (o.rot) c.rotate(o.rot); reg(c, -L / 2 - (o.capOff ? L * .25 * o.capOff : 0), -h * .6, L / 2 + 10, h * .6);
  const x0 = -L / 2, xN = L * .18; // body from x0 to xN, nose from xN to L/2
  const metal = o.paint === 'raw' ? '#aeb6bd' : '#d6dde2', band = '#b8322a';
  // body: slightly tapered cylinder
  c.beginPath(); c.moveTo(x0 + 10, -h / 2); c.lineTo(xN, -h * .46); c.lineTo(xN, h * .46); c.lineTo(x0 + 10, h / 2); c.quadraticCurveTo(x0, 0, x0 + 10, -h / 2); S_(metal);
  if (!bp) { c.save(); c.clip(); c.globalAlpha = .18; c.fillStyle = '#000'; c.fillRect(x0, h * .12, L, h); c.globalAlpha = .5; c.fillStyle = '#fff'; c.fillRect(x0, -h * .36, L, h * .08); c.restore(); }
  // panel seams + rivet rows
  for (let i = 1; i < 5; i++) { const px = lerp(x0 + 10, xN, i / 5); line(c, px, -h * .47, px, h * .47, bp ? 2 : 2.5, bp ? 'rgba(232,241,255,.5)' : 'rgba(43,33,30,.45)'); }
  if (!bp && o.paint !== 'raw') { c.save(); c.beginPath(); c.rect(lerp(x0, xN, .62), -h, L * .05, h * 2); c.clip(); c.beginPath(); c.moveTo(x0 + 10, -h / 2); c.lineTo(xN, -h * .46); c.lineTo(xN, h * .46); c.lineTo(x0 + 10, h / 2); c.closePath(); c.fillStyle = band; c.fill(); c.restore();
    label(c, 'CCCP', lerp(x0, xN, .3), 0, h * .26, band, { stroke: false, raw: true }); }
  // nose: ogive with 3 windows
  c.beginPath(); c.moveTo(xN, -h * .46); c.bezierCurveTo(L * .38, -h * .46, L * .5, -h * .18, L / 2, 0); c.bezierCurveTo(L * .5, h * .18, L * .38, h * .46, xN, h * .46); c.closePath(); S_(o.paint === 'raw' ? '#c3cad0' : '#e7ecef');
  if (!bp) { c.save(); c.clip(); c.globalAlpha = .16; c.fillStyle = '#000'; c.fillRect(xN, h * .1, L, h); c.restore(); }
  [[.27, -.18], [.33, .02], [.27, .22]].forEach(([wx, wy], i) => { const cx = L * wx, cy = h * wy, r = h * .1;
    circ(c, cx, cy, r, bp ? null : '#1b2a44', lw); if (!bp) { lightPool(c, cx, cy, r * 2.2, '#9fd1ff', o.glow ? .5 : .15); circ(c, cx - r * .3, cy - r * .3, r * .25, 'rgba(255,255,255,.7)', 0); } });
  // base cap with bolt ring (left end)
  const cx0 = x0 - (o.capOff ? L * .25 * easeOut(o.capOff) : 0);
  c.beginPath(); c.ellipse(cx0 + 8, 0, h * .14, h * .5, 0, 0, TAU); S_('#9aa3ab');
  const nb = 18; for (let i = 0; i < nb; i++) { const a = i / nb * TAU; circ(c, cx0 + 8 + Math.cos(a) * h * .1, Math.sin(a) * h * .42, Math.max(2, h * .016), bp ? null : '#5b636b', bp ? 1.5 : 2); }
  // internals (cutaway)
  const cut = bp ? 1 : clamp(o.cutaway || 0);
  if (cut > 0) {
    c.save(); c.globalAlpha = bp ? 1 : cut;
    if (!bp) { c.beginPath(); c.moveTo(x0 + 18, -h * .4); c.lineTo(L * .44, -h * .1); c.lineTo(L * .44, h * .1); c.lineTo(x0 + 18, h * .4); c.closePath(); c.fillStyle = '#2a2f36'; c.fill(); }
    // tanks: oxidizer (front, bigger) + fuel (rear)
    const tk = (cx, r, col, lab) => { ell(c, cx, 0, r * 1.25, h * .34, bp ? null : col, bp ? 2.5 : 3.5); if (bp) { c.lineWidth = 2.5; c.strokeStyle = inkc; c.stroke(); } if (o.labels) label(c, lab, cx, 0, Math.max(14, h * .085), bp ? '#e8f1ff' : '#fff', { maxW: r * 2.2 }); };
    tk(lerp(x0, xN, .62), L * .085, '#5d8fb5', 'OXIDIZER'); tk(lerp(x0, xN, .28), L * .07, '#c9852f', 'FUEL');
    // engine mounting brackets (engine gone)
    [[-1], [1]].forEach(([s]) => { line(c, x0 + 14, s * h * .32, x0 + L * .09, s * h * .12, bp ? 2.5 : 6, bp ? inkc : '#8d969e'); line(c, x0 + L * .09, s * h * .12, x0 + 14, 0, bp ? 2.5 : 6, bp ? inkc : '#8d969e'); });
    if (o.labels) label(c, 'ENGINE MOUNTS (NO ENGINE)', x0 + L * .06, h * .62, Math.max(16, h * .08), bp ? '#e8f1ff' : '#fff');
    // payload rod + sphere in the nose
    const sOut = easeOut(clamp(o.sphereOut || 0)), sx = L * .3, sy = -sOut * h * .75, sr = h * .2;
    line(c, xN - L * .04, 0, sx + sr * .2, 0, bp ? 2.5 : 7, bp ? inkc : '#7c858d');
    circ(c, sx, sy, sr, bp ? null : '#c9ced4', lw); if (bp) { c.lineWidth = 2.5; c.strokeStyle = inkc; c.stroke(); }
    if (!bp) { c.save(); c.beginPath(); c.arc(sx, sy, sr, 0, TAU); c.clip(); c.globalAlpha = .25; circ(c, sx + sr * .5, sy + sr * .4, sr, '#000', 0); c.restore(); circ(c, sx - sr * .35, sy - sr * .35, sr * .2, 'rgba(255,255,255,.8)', 0); }
    for (let a = 0; a < 4; a++) { const an = a * TAU / 4 + .5; line(c, sx + Math.cos(an) * sr, sy + Math.sin(an) * sr, sx + Math.cos(an) * sr * 1.35, sy + Math.sin(an) * sr * 1.35, bp ? 2 : 3.5, inkc); }
    // wire + seal on the rod
    const wx = xN - L * .015; if (o.seal !== 'none') seal(c, wx, h * .02, Math.max(.35, h / 260), { cut: o.seal === 'cut', fresh: o.seal === 'new', bp });
    if (o.labels) { label(c, 'PAYLOAD SPHERE', sx, sy - sr - h * .12, Math.max(16, h * .085), bp ? '#e8f1ff' : '#fff'); label(c, 'WIRE + SEAL', wx, h * .3, Math.max(14, h * .07), bp ? '#e8f1ff' : '#ffcf3f'); }
    c.restore();
  }
  if (o.glint != null && !bp) { const gx = lerp(x0, L / 2, (o.glint * .4) % 1.6 - .3); c.save(); c.beginPath(); c.moveTo(x0 + 10, -h / 2); c.lineTo(xN, -h * .46); c.bezierCurveTo(L * .38, -h * .46, L * .5, -h * .18, L / 2, 0); c.bezierCurveTo(L * .5, h * .18, L * .38, h * .46, xN, h * .46); c.lineTo(x0 + 10, h / 2); c.closePath(); c.clip(); c.globalAlpha = .35; c.fillStyle = '#fff'; c.beginPath(); c.moveTo(gx, -h); c.lineTo(gx + L * .05, -h); c.lineTo(gx - L * .05, h); c.lineTo(gx - L * .1, h); c.closePath(); c.fill(); c.restore(); }
  c.restore();
}
// standing exhibit version: Lunik on a pedestal, tilted up, under spotlights
function lunikExhibit(c, x, y, L, o = {}) { pedestal(c, x, y, L * 1.05, { rope: o.rope !== false }); lunik(c, x, y - L * .32, L, { rot: -.12, glow: o.glow, glint: o.t, ...o }); }
// plastic seal on a twisted wire. o.cut: wire snipped, ends apart. o.fresh: new forged seal (slightly brighter). o.stamp: show CCCP stamp text
function seal(c, x, y, s = 1, o = {}) {
  c.save(); c.translate(x, y); c.scale(s, s); const ink = o.bp ? '#e8f1ff' : INK;
  const tw = (x1, x2, yy) => { c.beginPath(); for (let i = 0; i <= 16; i++) { const px = lerp(x1, x2, i / 16); c.lineTo(px, yy + Math.sin(i * 1.6) * 5); } c.lineWidth = 3.5; c.strokeStyle = o.bp ? ink : '#8a8f96'; c.stroke(); };
  if (o.cut) { tw(-120, -40, -6); tw(40, 120, 8); line(c, -40, -6, -30, -18, 3.5, '#8a8f96'); line(c, 40, 8, 30, 20, 3.5, '#8a8f96'); }
  else tw(-120, 120, 0);
  if (!o.cut || o.keepSeal) { box(c, -34, -26, 68, 52, 14, o.bp ? null : (o.fresh ? '#f0d36a' : '#d9b84a'), o.bp ? 2.5 : 4); if (o.bp) { c.lineWidth = 2.5; c.strokeStyle = ink; c.stroke(); }
    label(c, 'CCCP', 0, 2, 22, o.bp ? ink : '#7a5a10', { stroke: false, raw: true }); }
  c.restore();
}
function sealStamp(c, x, y, s = 1) { c.save(); c.translate(x, y); c.scale(s, s); box(c, -16, -120, 32, 80, 10, '#6d4c41'); circ(c, 0, -130, 24, '#5d4037'); box(c, -40, -44, 80, 44, 6, '#2b2f36'); label(c, 'CCCP', 0, -22, 22, '#d9b84a', { stroke: false, raw: true }); c.restore(); }

// ---------- 20-ft wooden crate (bottom-centre at x,y). w ~ the crate length on screen ----------
// o: state 'closed'|'open'|'canvas'; planks: 0..1 share of roof planks removed (lifting progressively); xray (0..1, shows the Lunik inside);
//    stencil (text), tarp (0..1 a tarp over the open roof), t
function crate(c, x, y, w, o = {}) {
  const h = w * .24, d = w * .06; reg(c, x - w / 2, y - h - d, x + w / 2 + d, y);
  c.save(); c.translate(x, y);
  // top face (depth) and side
  poly(c, [[w / 2, -h], [w / 2 + d, -h - d * .8], [w / 2 + d, -d * .8], [w / 2, 0]], '#8f6a3e');
  const roofGone = clamp(o.planks || 0), n = 9;
  for (let i = 0; i < n; i++) { const gone = i < Math.floor(roofGone * n + .001); const x1 = -w / 2 + i * w / n, x2 = x1 + w / n;
    if (gone) { poly(c, [[x1, -h], [x1 + d, -h - d * .8], [x2 + d, -h - d * .8], [x2, -h]], '#1a140e', 3); }
    else poly(c, [[x1, -h], [x1 + d, -h - d * .8], [x2 + d, -h - d * .8], [x2, -h]], '#c9975a', 3.5); }
  box(c, -w / 2, -h, w, h, 4, '#b9874d');
  for (let i = 1; i < 4; i++) line(c, -w / 2, -h + i * h / 4, w / 2, -h + i * h / 4, 2.5, 'rgba(60,35,10,.45)');
  // battens + X braces
  [-w / 2, -w / 6, w / 6, w / 2].forEach(bx => box(c, bx - 9, -h, 18, h, 3, '#a87842', 3));
  for (let i = 0; i < 3; i++) { const a = -w / 2 + 9 + i * w / 3, b = a + w / 3 - 18; line(c, a, -6, b, -h + 6, 6, '#a87842'); line(c, a, -6, b, -h + 6, 2, 'rgba(60,35,10,.5)'); }
  // nail heads
  for (let i = 0; i < 4; i++) [-w / 2, -w / 6, w / 6, w / 2].forEach(bx => circ(c, bx, -h + 10 + i * (h - 20) / 3, 2.5, INK, 0));
  if (o.stencil !== false) { label(c, o.stencil || 'CCCP', -w * .33, -h * .52, h * .28, '#2b211e', { stroke: false, raw: true });
    // this-side-up arrows
    [w * .36].forEach(ax => { line(c, ax, -h * .3, ax, -h * .75, 5, INK); poly(c, [[ax - 12, -h * .68], [ax + 12, -h * .68], [ax, -h * .84]], INK, 0); }); }
  if (o.xray > 0) { c.save(); c.globalAlpha = clamp(o.xray) * .92; rr(c, -w / 2 + 10, -h + 8, w - 20, h - 16, 4); c.fillStyle = '#0e1a2e'; c.fill(); lunik(c, 0, -h / 2, w * .88, { blueprint: true }); c.restore(); }
  if (o.state === 'canvas' || o.canvas > 0) { const k = o.state === 'canvas' ? 1 : clamp(o.canvas); c.save(); c.globalAlpha = 1; const top = -h - d - 14, drop = lerp(0, h + d + 14, easeOut(k));
    c.beginPath(); c.moveTo(-w / 2 - 14, top); c.lineTo(w / 2 + d + 10, top); c.lineTo(w / 2 + d + 10, top + drop); for (let i = 0; i <= 12; i++) c.lineTo(w / 2 + d + 10 - i * (w + d + 24) / 12, top + drop + (i % 2 ? 10 : 0)); c.closePath(); fs(c, '#6f7458');
    for (let i = 1; i < 8; i++) line(c, -w / 2 + i * w / 8, top + 6, -w / 2 + i * w / 8 + 10, top + drop - 6, 3, 'rgba(0,0,0,.18)');
    [-w * .35, 0, w * .35].forEach(rx => line(c, rx, top, rx + 6, top + drop, 4, '#c9b58a')); c.restore(); }
  if (o.tarp > 0) { c.save(); c.globalAlpha = clamp(o.tarp); c.beginPath(); c.moveTo(-w / 2 - 30, -h - d - 70); c.quadraticCurveTo(0, -h - d - 20, w / 2 + d + 30, -h - d - 70); c.lineTo(w / 2 + d + 30, -h - d - 60); c.quadraticCurveTo(0, -h - d - 6, -w / 2 - 30, -h - d - 60); c.closePath(); fs(c, '#3b4a3c'); c.restore(); }
  c.restore();
}
// loose plank and 5-inch spike
function plank(c, x, y, w = 260, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); box(c, -w / 2, -14, w, 28, 3, '#c9975a', 3.5); line(c, -w / 2 + 10, 0, w / 2 - 10, 0, 2, 'rgba(60,35,10,.35)'); circ(c, -w / 2 + 16, 0, 3, INK, 0); circ(c, w / 2 - 16, 0, 3, INK, 0); c.restore(); }
function spike(c, x, y, s = 1, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); box(c, -14, -6, 28, 12, 3, '#6b7178', 3); poly(c, [[-5, 6], [5, 6], [2, 104], [0, 116], [-2, 104]], '#9aa1a8', 3); c.restore(); }

// ---------- 1950s flatbed truck: bottom of wheels at y, cab faces right. o: crate (crate opts | true), lights, t (wheel spin), driver (cast name), speed ----------
function truck59(c, x, y, s = 1, o = {}) {
  c.save(); c.translate(x, y); c.scale(s * (o.flip ? -1 : 1), s); reg(c, -520, -360, 330, 10);
  const col = o.col || '#4f6d5a', t = o.t || 0, bounce = o.moving ? Math.sin(t * 14) * 2 : 0;
  shadow(c, -80, 4, 430, .25);
  // chassis + bed
  box(c, -520, -112 + bounce, 640, 26, 6, '#2c2f33'); box(c, -520, -136 + bounce, 620, 30, 4, '#7a5a3a'); for (let i = 1; i < 8; i++) line(c, -520 + i * 78, -134 + bounce, -520 + i * 78, -108 + bounce, 2, 'rgba(0,0,0,.35)');
  if (o.crate) crate(c, -210, -136 + bounce, 580, o.crate === true ? {} : o.crate);
  // cab: rounded 1950s
  c.save(); c.translate(0, bounce);
  c.beginPath(); c.moveTo(96, -112); c.lineTo(96, -262); c.quadraticCurveTo(100, -300, 150, -302); c.lineTo(212, -302); c.quadraticCurveTo(246, -300, 258, -240); c.lineTo(268, -186); c.quadraticCurveTo(320, -182, 324, -150); c.lineTo(326, -112); c.closePath(); fs(c, col);
  c.save(); c.clip(); c.globalAlpha = .15; c.fillStyle = '#000'; c.fillRect(90, -150, 260, 50); c.restore();
  // window + driver
  c.beginPath(); c.moveTo(120, -186); c.lineTo(120, -262); c.quadraticCurveTo(124, -284, 150, -284); c.lineTo(206, -284); c.quadraticCurveTo(230, -282, 240, -240); c.lineTo(248, -186); c.closePath(); fs(c, o.lights ? '#24344d' : '#a9cde0', 4);
  if (o.driver) { c.save(); c.clip(); crayon(c, { ...CAST[o.driver], x: 182, y: -122, s: .42, pose: 'drive', t, expr: o.driverExpr || 'neutral', noShadow: true }); c.restore(); c.beginPath(); c.moveTo(120, -186); c.lineTo(120, -262); c.quadraticCurveTo(124, -284, 150, -284); c.lineTo(206, -284); c.quadraticCurveTo(230, -282, 240, -240); c.lineTo(248, -186); c.closePath(); fs(c, null, 4); }
  box(c, 100, -180, 160, 8, 3, shade(col, -.25), 0); line(c, 150, -168, 172, -168, 4); // door handle
  // grille, bumper, headlight
  box(c, 306, -176, 20, 60, 6, '#c9ced4', 3.5); for (let i = 0; i < 4; i++) line(c, 309, -166 + i * 13, 323, -166 + i * 13, 2);
  box(c, 290, -118, 50, 16, 6, '#c9ced4', 3.5); circ(c, 300, -196, 13, o.lights ? '#fff3c0' : '#e7e2c8', 3.5);
  if (o.lights) { cone(c, 0, 0, 0, 0, 0); c.save(); c.globalCompositeOperation = 'screen'; const g = c.createLinearGradient(300, 0, 900, 0); g.addColorStop(0, 'rgba(255,240,190,.55)'); g.addColorStop(1, 'rgba(255,240,190,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(304, -204); c.lineTo(900, -260); c.lineTo(900, 20); c.lineTo(304, -186); c.closePath(); c.fill(); c.restore(); lightPool(c, 300, -196, 60, '#fff3c0', .8); }
  // fenders
  c.beginPath(); c.moveTo(186, -112); c.quadraticCurveTo(200, -176, 262, -176); c.quadraticCurveTo(316, -176, 322, -112); c.closePath(); fs(c, shade(col, -.1));
  c.restore();
  // wheels
  [[-430, 0], [-330, 0], [250, 0]].forEach(([wx]) => { circ(c, wx, -42, 42, '#1f2226'); circ(c, wx, -42, 18, '#9aa1a8', 3.5); const a = t * (o.moving ? 9 : 0); for (let k = 0; k < 4; k++) line(c, wx, -42, wx + Math.cos(a + k * Math.PI / 2) * 16, -42 + Math.sin(a + k * Math.PI / 2) * 16, 2.5); });
  if (o.tail) circ(c, -518, -150, 8, '#ff5040', 3);
  c.restore();
}
// 1950s sedan (CIA tail car etc). bottom at y, faces right. o: col, lights, driver, t, moving
function car59(c, x, y, s = 1, o = {}) {
  c.save(); c.translate(x, y); c.scale(s * (o.flip ? -1 : 1), s); reg(c, -230, -170, 240, 6);
  const col = o.col || '#2f3e52', t = o.t || 0, b = o.moving ? Math.sin(t * 15) * 1.5 : 0;
  shadow(c, 0, 4, 230, .25); c.save(); c.translate(0, b);
  c.beginPath(); c.moveTo(-226, -40); c.quadraticCurveTo(-232, -96, -190, -100); c.lineTo(-110, -104); c.quadraticCurveTo(-86, -164, -20, -166); c.lineTo(50, -166); c.quadraticCurveTo(104, -162, 126, -104); c.lineTo(200, -98); c.quadraticCurveTo(236, -92, 234, -40); c.closePath(); fs(c, col);
  c.save(); c.clip(); c.globalAlpha = .18; c.fillStyle = '#fff'; c.fillRect(-240, -100, 480, 10); c.globalAlpha = .2; c.fillStyle = '#000'; c.fillRect(-240, -60, 480, 30); c.restore();
  const win = () => { c.beginPath(); c.moveTo(-92, -106); c.quadraticCurveTo(-74, -150, -20, -152); c.lineTo(48, -152); c.quadraticCurveTo(92, -148, 108, -106); c.closePath(); };
  win(); fs(c, o.lights ? '#23324a' : '#a9cde0', 3.5);
  if (o.driver) { c.save(); win(); c.clip(); crayon(c, { ...CAST[o.driver], x: 40, y: -30, s: .36, pose: 'drive', t, noShadow: true, expr: o.driverExpr || 'neutral' }); c.restore(); win(); fs(c, null, 3.5); }
  line(c, 8, -152, 8, -106, 5); line(c, -226, -52, 234, -52, 3, 'rgba(255,255,255,.4)');
  box(c, 218, -70, 22, 14, 5, '#c9ced4', 3); box(c, -240, -62, 24, 14, 5, '#c9ced4', 3); circ(c, 218, -86, 10, o.lights ? '#fff3c0' : '#e7e2c8', 3); circ(c, -222, -80, 7, '#ff5040', 2.5);
  if (o.lights) { c.save(); c.globalCompositeOperation = 'screen'; const g = c.createLinearGradient(220, 0, 760, 0); g.addColorStop(0, 'rgba(255,240,190,.5)'); g.addColorStop(1, 'rgba(255,240,190,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(222, -92); c.lineTo(760, -150); c.lineTo(760, 30); c.lineTo(222, -80); c.closePath(); c.fill(); c.restore(); lightPool(c, -222, -80, 40, '#ff4030', .6); }
  c.restore();
  [-140, 140].forEach(wx => { circ(c, wx, -34, 34, '#1f2226'); circ(c, wx, -34, 16, '#d6dbe0', 3.5); circ(c, wx, -34, 5, INK, 0); });
  c.restore();
}
// freight train: locomotive + n cars, bottom (rails) at y, faces right. o: cars ['flat','box','crate'], t, moving, smoke
function freightTrain(c, x, y, s = 1, o = {}) {
  c.save(); c.translate(x, y); c.scale(s, s); const t = o.t || 0; const cars = o.cars || ['box', 'crate', 'box'];
  line(c, -2000, 0, 2000, 0, 6, '#5b5048');
  cars.forEach((k, i) => { const cx = -420 - i * 440; reg(c, cx - 200, -240, cx + 200, 0);
    box(c, cx - 200, -70, 400, 22, 4, '#2c2f33'); [cx - 140, cx + 140].forEach(wx => { circ(c, wx - 30, -24, 24, '#1f2226'); circ(c, wx + 30, -24, 24, '#1f2226'); });
    if (k === 'box') { box(c, cx - 196, -250, 392, 182, 6, i % 2 ? '#7a3b2e' : '#5d4a3a'); for (let j = 1; j < 8; j++) line(c, cx - 196 + j * 49, -248, cx - 196 + j * 49, -70, 2, 'rgba(0,0,0,.3)'); box(c, cx - 50, -230, 100, 150, 4, null, 3.5); }
    if (k === 'crate') crate(c, cx, -70, 380, { stencil: o.stencil, state: o.crateState }); if (k === 'flat') { } });
  // locomotive (steam-diesel generic, faces right)
  reg(c, -200, -330, 260, 0); box(c, -200, -80, 450, 30, 6, '#2c2f33'); box(c, -180, -250, 300, 172, 10, '#2f3338'); box(c, 100, -300, 150, 222, 10, '#2f3338'); windowRect(c, 130, -270, 80, 60, o.night ? '#ffd36e' : '#a9cde0'); box(c, -150, -300, 40, 60, 6, '#2b2f36'); poly(c, [[250, -80], [290, -80], [250, -160]], '#c9ced4');
  box(c, -180, -190, 300, 18, 0, '#b8322a', 3); circ(c, 236, -220, 14, o.night ? '#fff3c0' : '#e7e2c8', 3.5);
  [-130, -40, 50, 160].forEach(wx => { circ(c, wx, -28, 30, '#1f2226'); circ(c, wx, -28, 10, '#9aa1a8', 3); });
  if (o.smoke !== false) for (let i = 0; i < 5; i++) { const k = ((t * .6 + i / 5) % 1); circ(c, -130 - k * 180, -320 - k * 160, 24 + k * 50, `rgba(200,205,210,${.55 * (1 - k)})`, 0); }
  c.restore();
}
// cargo ship at the quay, waterline at y, bow to the right. o: crane (0..1 lowering a crate), night
function cargoShip(c, x, y, s = 1, o = {}) {
  c.save(); c.translate(x, y); c.scale(s, s); reg(c, -620, -460, 620, 40);
  c.beginPath(); c.moveTo(-600, -150); c.lineTo(560, -150); c.quadraticCurveTo(640, -150, 600, -40); c.lineTo(560, 30); c.lineTo(-560, 30); c.quadraticCurveTo(-610, -40, -600, -150); fs(c, '#3b4352');
  c.beginPath(); c.rect(-620, -20, 1300, 60); c.save(); c.clip(); c.restore(); line(c, -590, -8, 600, -8, 10, '#b8322a');
  box(c, -520, -330, 260, 180, 8, '#e9e4d6'); for (let i = 0; i < 4; i++) windowRect(c, -500 + i * 60, -300, 36, 34, o.night ? '#ffd36e' : '#a9cde0'); box(c, -440, -440, 80, 110, 6, '#2f3338'); box(c, -440, -420, 80, 24, 0, '#b8322a', 3); poly(c, starPts(-400, -408, 10), GOLD, 2);
  box(c, -100, -240, 520, 90, 6, '#5d4a3a'); for (let i = 0; i < 4; i++) box(c, -80 + i * 125, -230, 110, 70, 4, '#7a5a3a', 3);
  // derrick crane lowering a crate onto the quay
  line(c, 120, -150, 300, -460, 12, '#c9852f'); line(c, 300, -460, 300 + 220 * (o.crane ?? .5), -380, 4); const cy_ = lerp(-360, 40, clamp(o.crane ?? .5));
  line(c, 300 + 220 * (o.crane ?? .5), -380, 520, cy_ - 80, 3); crate(c, 520, cy_, 300, { stencil: o.stencil });
  c.restore();
}
// ---------- photography ----------
// 1950s press camera with round flash reflector. o.flash 0..1 (burst)
function pressCamera(c, x, y, s = 1, o = {}) {
  c.save(); c.translate(x, y); c.scale(s, s);
  box(c, -70, -56, 140, 100, 10, '#2b2f36'); box(c, -60, -46, 120, 18, 4, '#3d434c', 2.5); circ(c, 0, 4, 34, '#1b1e22'); circ(c, 0, 4, 22, '#5a6a80', 3.5); circ(c, -8, -4, 6, 'rgba(255,255,255,.7)', 0);
  line(c, 70, -30, 100, -40, 7); c.beginPath(); c.moveTo(96, -110); c.quadraticCurveTo(170, -70, 96, -10); c.closePath(); fs(c, '#d6dbe0', 4); circ(c, 108, -60, 12, o.flash > 0 ? '#fff' : '#e8f1ff', 3);
  if (o.flash > 0) flashBurst(c, 112, -60, 140, o.flash);
  c.restore();
}
function flashBurst(c, x, y, r, p) { if (p <= 0 || p >= 1) return; const a = 1 - p; lightPool(c, x, y, r * (1 + p * 2), '#ffffff', a); c.save(); c.globalAlpha = a; for (let i = 0; i < 8; i++) { const an = i * TAU / 8; line(c, x + Math.cos(an) * r * .3, y + Math.sin(an) * r * .3, x + Math.cos(an) * r * (.6 + p * .6), y + Math.sin(an) * r * (.6 + p * .6), 6, '#fff'); } c.restore(); }
function flashbulb(c, x, y, s = 1, used) { c.save(); c.translate(x, y); c.scale(s, s); ell(c, 0, -30, 20, 26, used ? '#9fb0c4' : '#e9f4ff', 3.5); box(c, -10, -6, 20, 20, 3, '#b0b6bc', 3); c.restore(); }
function filmCanister(c, x, y, s = 1, o = {}) { c.save(); c.translate(x, y); c.scale(s, s); reg(c, -40, -100, 70, 0); box(c, -36, -90, 72, 90, 8, '#2b2f36'); box(c, -40, -100, 80, 18, 6, '#4a5058', 3); box(c, 30, -70, 34, 40, 4, '#c9852f', 3); for (let i = 0; i < 3; i++) box(c, 40, -64 + i * 12, 14, 6, 1, '#2b2f36', 0); if (o.label) label(c, o.label, 0, -45, 18, GOLD, { maxW: 64 }); c.restore(); }
// film strip with frames; draw(i, fx, fy, fw, fh) fills each frame; o.p reveal 0..1
function filmStrip(c, x, y, w, n, draw, o = {}) {
  const fh = o.h || 150, fw = (w - 20) / n; reg(c, x - w / 2, y - fh / 2 - 26, x + w / 2, y + fh / 2 + 26);
  box(c, x - w / 2, y - fh / 2 - 26, w, fh + 52, 6, '#141619');
  for (let i = 0; i < w / 34; i++) { box(c, x - w / 2 + 10 + i * 34, y - fh / 2 - 18, 18, 12, 3, '#e8e2d0', 0); box(c, x - w / 2 + 10 + i * 34, y + fh / 2 + 6, 18, 12, 3, '#e8e2d0', 0); }
  for (let i = 0; i < n; i++) { const fx = x - w / 2 + 10 + i * fw; if (i >= Math.ceil((o.p ?? 1) * n)) continue; c.save(); rr(c, fx + 4, y - fh / 2, fw - 8, fh, 3); c.fillStyle = o.neg ? '#2a2016' : '#e9e4d6'; c.fill(); c.clip(); draw && draw(i, fx + 4, y - fh / 2, fw - 8, fh); c.restore(); }
}
// photo print (black and white). inner() draws in local coords centred at 0,0 of a w x h print
function photoPrint(c, x, y, w, h, rot = 0, inner, o = {}) { c.save(); c.translate(x, y); c.rotate(rot); reg(c, -w / 2 - 14, -h / 2 - 14, w / 2 + 14, h / 2 + 30); box(c, -w / 2 - 14, -h / 2 - 14, w + 28, h + (o.caption ? 54 : 28), 4, '#f7f4ea', 3.5);
  c.save(); rr(c, -w / 2, -h / 2, w, h, 2); c.clip(); c.fillStyle = '#3c3c3c'; c.fillRect(-w / 2, -h / 2, w, h); inner && inner(); c.fillStyle = 'rgba(120,120,120,.25)'; c.globalCompositeOperation = 'saturation'; c.fillStyle = '#888'; c.fillRect(-w / 2, -h / 2, w, h); c.restore();
  if (o.caption) label(c, o.caption, 0, h / 2 + 16, 22, INK, { stroke: false, maxW: w }); if (o.clip) { box(c, -14, -h / 2 - 30, 28, 40, 6, '#c9ced4', 3); } c.restore(); }

// ---------- paper: dossier, manifest, redaction, stamps ----------
// dossier card for a new person. o: name, role, source, who (cast key), expr, stamp ('CLASSIFIED'), sp (stamp progress), p (slide in 0..1), rot
function dossier(c, x, y, w0, o = {}) {
  const w = 640, h = w * .7, p = o.p ?? 1; c.save(); c.translate(x, y + (1 - easeOut(p)) * 60); c.rotate(o.rot ?? -.02); c.scale(w0 / w, w0 / w); c.globalAlpha = clamp(p * 2); reg(c, -w / 2, -h / 2 - 34, w / 2, h / 2);
  // folder with tab
  box(c, -w / 2 + 30, -h / 2 - 34, w * .3, 50, 10, '#d9b26e'); box(c, -w / 2, -h / 2, w, h, 10, '#e2bd78'); box(c, -w / 2 + 14, -h / 2 + 14, w - 28, h - 28, 4, '#f7f2e2', 3);
  label(c, 'FILE', -w / 2 + 30 + w * .15, -h / 2 - 12, 22, '#7a5a20', { stroke: false });
  // photo with clip
  const pw = w * .32, ph = pw * 1.15, px = -w / 2 + 40 + pw / 2, py = -h / 2 + 40 + ph / 2;
  c.save(); rr(c, px - pw / 2, py - ph / 2, pw, ph, 4); c.fillStyle = '#cfd6dd'; c.fill(); c.clip();
  if (o.who) crayon(c, { ...CAST[o.who], x: px, y: py + ph * 1.2, s: pw / 240, expr: o.expr || CAST[o.who].expr || 'neutral', t: o.t || 0, noShadow: true }); else { label(c, '?', px, py, pw * .6, '#8a929b', { stroke: false }); }
  c.restore(); rr(c, px - pw / 2, py - ph / 2, pw, ph, 4); fs(c, null, 3.5); box(c, px - 10, py - ph / 2 - 18, 20, 36, 5, '#b0b6bc', 3);
  const tx = px + pw / 2 + 24, tw = w / 2 - 30 - tx;
  c.textAlign = 'left'; label(c, 'NAME', tx, -h / 2 + 60, 20, '#8a6a30', { stroke: false, align: 'left' });
  label(c, o.name || '', tx, -h / 2 + 100, Math.min(44, w * .06), INK, { stroke: false, align: 'left', maxW: tw });
  line(c, tx, -h / 2 + 128, w / 2 - 34, -h / 2 + 128, 2.5, '#b9a98a');
  label(c, 'ROLE', tx, -h / 2 + 160, 20, '#8a6a30', { stroke: false, align: 'left' });
  (Array.isArray(o.role) ? o.role : [o.role || '']).forEach((r, i) => label(c, r, tx, -h / 2 + 196 + i * 36, Math.min(32, w * .045), '#3d342a', { stroke: false, align: 'left', maxW: tw }));
  if (o.source) { box(c, px - pw / 2, py + ph / 2 + 18, pw, 44, 8, '#fff1c4', 3); label(c, o.source, px, py + ph / 2 + 40, 22, '#7a5a20', { stroke: false, maxW: pw - 16 }); }
  if (o.stamp) stamp(c, w * .2, h * .32, o.stamp, o.sp ?? 1, RED, { w: w * .42, h: w * .09, rot: -.12 });
  c.restore();
}
function manifest(c, x, y, w0, h0, o = {}) { // intercepted shipping manifest (drawn at 760 wide, scaled to w0); o.hl 0..1 highlights the crate line, o.dims shows dims
  const w = 760, h = h0 * 760 / w0; c.save(); c.translate(x, y); c.rotate(o.rot ?? .02); c.scale(w0 / w, w0 / w); reg(c, -w / 2, -h / 2, w / 2, h / 2); box(c, -w / 2, -h / 2, w, h, 4, '#f3eedb'); 
  label(c, o.title || 'SHIPPING MANIFEST', 0, -h / 2 + 54, 52, INK, { stroke: false, maxW: w - 60 }); line(c, -w / 2 + 30, -h / 2 + 84, w / 2 - 30, -h / 2 + 84, 3);
  const rows = o.rows || ['MACHINE TOOLS', 'GENERATOR PANELS', 'MODELS OF ASTRONOMIC APPARATUS', 'DISPLAY CASES', 'PRINTED MATTER'], hi = o.hiRow ?? 2;
  rows.forEach((r, i) => { const ry = -h / 2 + 130 + i * (h - 170) / rows.length; if (i === hi && o.hl > 0) { c.save(); c.globalAlpha = .7; c.fillStyle = '#ffe16a'; c.fillRect(-w / 2 + 26, ry - 22, (w - 52) * easeOut(o.hl), 44); c.restore(); }
    label(c, String(i + 1).padStart(2, '0'), -w / 2 + 56, ry, 26, '#6a6050', { stroke: false }); label(c, r, -w / 2 + 96, ry, 34, INK, { stroke: false, align: 'left', maxW: w * .62 });
    for (let k = 0; k < 3; k++) line(c, w / 2 - 170 + k * 50, ry + 2, w / 2 - 140 + k * 50, ry + 2, 3, '#a59a82'); });
  if (o.dims) { const ry = -h / 2 + 130 + hi * (h - 170) / rows.length; label(c, o.dims, w / 2 - 110, ry, 24, '#b8322a', { stroke: false, maxW: 180 }); }
  c.restore();
}
function redact(c, x, y, w, h, p = 1) { if (p <= 0) return; c.fillStyle = '#0d0d0f'; c.fillRect(x, y, w * easeOut(p), h); }
// typed report page with some redaction bars. o: title, lines (n), bars [[row, from, to]], p (bars progress)
function reportPage(c, x, y, w, h, o = {}) { c.save(); c.translate(x, y); c.rotate(o.rot ?? 0); reg(c, -w / 2, -h / 2, w / 2, h / 2); box(c, -w / 2, -h / 2, w, h, 3, '#f6f1e2');
  label(c, o.title || 'REPORT', 0, -h / 2 + 56, 34, INK, { stroke: false, maxW: w - 60 }); const n = o.lines || 12, R = rand(o.seed || 3);
  for (let i = 0; i < n; i++) { const ly = -h / 2 + 110 + i * (h - 150) / n; line(c, -w / 2 + 40, ly, -w / 2 + 40 + (w - 80) * (.7 + R() * .3), ly, 4, '#9a917c'); }
  (o.bars || []).forEach(([row, a, b], k) => { const ly = -h / 2 + 110 + row * (h - 150) / n; redact(c, -w / 2 + 40 + (w - 80) * a, ly - 13, (w - 80) * (b - a), 26, clamp((o.p ?? 1) * 1.5 - k * .1)); });
  if (o.stamp) stamp(c, w * .15, -h * .32, o.stamp, o.sp ?? 1, RED, { w: w * .55, h: 70, rot: -.1 }); c.restore(); }
function typewriter(c, x, y, s = 1, o = {}) { c.save(); c.translate(x, y); c.scale(s, s); reg(c, -200, -260, 200, 0);
  if (o.paper) { box(c, -110, -260 - (o.paper || 0) * 40, 220, 160, 3, '#f7f4ea', 3); for (let i = 0; i < 4; i++) line(c, -90, -230 + i * 26 - (o.paper || 0) * 40, 60 - i * 10, -230 + i * 26 - (o.paper || 0) * 40, 3, '#888'); }
  box(c, -180, -160, 360, 40, 18, '#2f3338'); circ(c, -190, -140, 18, '#2f3338'); circ(c, 190, -140, 18, '#2f3338');
  poly(c, [[-200, 0], [200, 0], [170, -120], [-170, -120]], '#3a4a40'); for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) circ(c, -128 + i * 32 + r * 10, -86 + r * 26, 10, '#e9e4d6', 2.5); c.restore(); }
function rotaryPhone(c, x, y, s = 1, o = {}) { c.save(); c.translate(x, y); c.scale(s, s); reg(c, -120, -150, 120, 0);
  poly(c, [[-110, 0], [110, 0], [80, -90], [-80, -90]], o.col || '#1d1f24'); circ(c, 0, -46, 40, '#e9e4d6', 3.5); for (let i = 0; i < 10; i++) { const a = -.6 + i * .5; circ(c, Math.cos(a) * 28, -46 + Math.sin(a) * 28, 6, '#1d1f24', 0); }
  if (!o.lifted) { box(c, -120, -140, 240, 44, 22, o.col || '#1d1f24'); ell(c, -100, -118, 26, 30, o.col || '#1d1f24'); ell(c, 100, -118, 26, 30, o.col || '#1d1f24'); }
  c.restore(); }
function paper1959(c, x, y, w, h, head, o = {}) { c.save(); c.translate(x, y); c.rotate(o.rot ?? 0); reg(c, -w / 2, -h / 2, w / 2, h / 2); box(c, -w / 2, -h / 2, w, h, 3, '#efe9d6');
  label(c, o.mast || 'THE EVENING STAR', 0, -h / 2 + 40, h * .07, INK, { stroke: false, maxW: w - 40 }); line(c, -w / 2 + 20, -h / 2 + 70, w / 2 - 20, -h / 2 + 70, 3); line(c, -w / 2 + 20, -h / 2 + 76, w / 2 - 20, -h / 2 + 76, 1.5);
  label(c, head, 0, -h / 2 + 70 + h * .11, h * .13, INK, { stroke: false, maxW: w - 40 });
  const ih = h * .38; c.save(); rr(c, -w / 2 + 24, -h / 2 + 100 + h * .2, w * .55, ih, 2); c.fillStyle = '#cfcbbd'; c.fill(); c.clip(); o.pic && o.pic(-w / 2 + 24 + w * .275, -h / 2 + 100 + h * .2 + ih / 2, w * .55, ih); c.restore();
  for (let i = 0; i < 9; i++) line(c, w * .1, -h / 2 + 110 + h * .2 + i * ih / 9, w / 2 - 24, -h / 2 + 110 + h * .2 + i * ih / 9, 3, '#a39d8a');
  for (let i = 0; i < 4; i++) line(c, -w / 2 + 24, h / 2 - 90 + i * 20, w / 2 - 24, h / 2 - 90 + i * 20, 3, '#a39d8a'); c.restore(); }

// ---------- maps ----------
// stylised Mexico (normalised outline), Tampico on the Gulf coast, Mexico City inland. o.p route draw 0..1, o.pins, o.night
// Mexico outline from real lon/lat (simplified), projected to 0..1: u=(lon+118.5)/33, v=(33.5-lat)/20. Baja is part of the one outline.
const MXLL = [[-117.1, 32.5], [-114.7, 32.7], [-111, 31.3], [-108.2, 31.3], [-106.5, 31.8], [-104.5, 29.6], [-103, 29], [-101.4, 29.8], [-99.5, 27.5], [-97.2, 25.9], [-97.7, 24], [-97.85, 22.25],
  [-97.2, 20.5], [-96.1, 19.2], [-94.5, 18.15], [-92.6, 18.6], [-91.5, 18.6], [-90.5, 19.8], [-90.3, 21], [-88.5, 21.5], [-87, 21.5], [-87.5, 19.5], [-88.3, 18.5], [-89.15, 17.8], [-90.9, 17.8], [-91.4, 16.1], [-92.2, 14.5],
  [-93.9, 15.9], [-95.2, 16.1], [-96.5, 15.7], [-98.5, 16.3], [-99.9, 16.85], [-101.5, 17.6], [-103.5, 18.3], [-105.2, 19.6], [-105.3, 21.5], [-106.4, 23.2], [-108.5, 25.4], [-109.4, 26.7], [-110.9, 27.9], [-112.2, 29.3], [-113.1, 31.2], [-114.6, 31.7],
  [-114.5, 30.3], [-113.3, 28.6], [-112.2, 27], [-111, 25.5], [-110.3, 24.2], [-109.9, 22.9], [-110.6, 23.6], [-112.1, 24.8], [-114.8, 27.8], [-115.8, 30.4], [-116.6, 31.8]];
const MXUV = ([lon, lat]) => [(lon + 118.5) / 33, (33.5 - lat) / 20];
const MX = MXLL.map(MXUV), MXBAJA = []; // MXBAJA kept for compatibility (Baja now lives in MX)
// US side of the border: border points (west -> east) closed over the top edge
const USUV = [[-118.5, 32.55], [-117.1, 32.5], [-114.7, 32.7], [-111, 31.3], [-108.2, 31.3], [-106.5, 31.8], [-104.5, 29.6], [-103, 29], [-101.4, 29.8], [-99.5, 27.5], [-97.2, 25.9], [-96.8, 26.5], [-96.5, 28.2], [-94.5, 29.5], [-93.5, 29.8], [-85, 30.2], [-85, 33.6], [-118.5, 33.6]].map(MXUV);
// o: p (route 0..1), night, tampico, city, cityLabel, showTexas (labels the US side TEXAS / UNITED STATES and inks the border; returns .texas)
function mapMexico(c, x, y, w, h, o = {}) {
  c.save(); c.translate(x - w / 2, y - h / 2); reg(c, 0, 0, w, h);
  const P_ = ([u, v]) => [u * w, v * h];
  box(c, 0, 0, w, h, 14, o.night ? '#163049' : '#9fc6d9'); c.save(); rr(c, 0, 0, w, h, 14); c.clip();
  for (let i = 0; i < w; i += 60) line(c, i, 0, i, h, 1.5, 'rgba(255,255,255,.12)'); for (let i = 0; i < h; i += 60) line(c, 0, i, w, i, 1.5, 'rgba(255,255,255,.12)');
  poly(c, USUV.map(P_), o.night ? '#2b3a44' : '#d8cfb0', 3);
  poly(c, MX.map(P_), o.night ? '#3d5145' : '#e9dcb3', 4);
  const fs_ = Math.max(18, w * .026), sea = o.night ? '#7fa8c8' : '#4a7a95';
  if (w >= 420 && o.seas !== false) { label(c, 'GULF OF MEXICO', .8 * w, .4 * h, fs_, sea, { stroke: false }); label(c, 'PACIFIC OCEAN', .2 * w, .74 * h, fs_, sea, { stroke: false }); }
  if (o.showTexas) { c.save(); c.setLineDash([12, 9]); c.beginPath(); USUV.slice(1, 11).map(P_).forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.lineWidth = 5; c.strokeStyle = '#ffcf3f'; c.stroke(); c.restore();
    label(c, 'TEXAS', MXUV([-99.3, 31])[0] * w, MXUV([-99.3, 31])[1] * h, Math.max(20, w * .036), '#fff'); if (w >= 420) label(c, 'UNITED STATES', MXUV([-109, 32.2])[0] * w, MXUV([-109, 32.2])[1] * h, fs_, o.night ? '#c9d6e8' : '#6a6050', { stroke: false }); }
  c.restore();
  const T_ = P_(MXUV([-97.85, 22.25])), M_ = P_(MXUV([-99.13, 19.43]));
  if (o.p > 0) { c.save(); c.setLineDash([16, 12]); c.lineWidth = 7; c.strokeStyle = o.routeCol || '#d9342b'; c.lineCap = 'round'; c.beginPath(); const N = 30; for (let i = 0; i <= N * clamp(o.p); i++) { const u = i / N; const px = lerp(T_[0], M_[0], u) - Math.sin(u * Math.PI) * w * .015, py = lerp(T_[1], M_[1], u); i ? c.lineTo(px, py) : c.moveTo(px, py); } c.stroke(); c.restore(); }
  const ls = Math.max(20, w * .036), pr = Math.max(8, w * .014);
  if (o.tampico !== false) { circ(c, T_[0], T_[1], pr, '#ffcf3f', 4); label(c, 'TAMPICO', T_[0] + pr + 10, T_[1] - 2, ls, '#fff', { align: 'left' }); }
  if (o.city !== false) { circ(c, M_[0], M_[1], pr, '#d9342b', 4); label(c, o.cityLabel || 'MEXICO CITY', M_[0], M_[1] + pr + ls * .8, ls, '#fff'); }
  rr(c, 0, 0, w, h, 14); fs(c, null, 5); c.restore();
  const tx = MXUV([-99.3, 31]);
  return { tampico: [x - w / 2 + T_[0], y - h / 2 + T_[1]], city: [x - w / 2 + M_[0], y - h / 2 + M_[1]], texas: [x - w / 2 + tx[0] * w, y - h / 2 + tx[1] * h] };
}
// stylised world map (blobs), route through named stops [[u,v,'LABEL'],...] in 0..1 coords; o.p draws the dotted route
const CONT = [ [[.06, .2], [.2, .14], [.3, .2], [.28, .34], [.22, .42], [.2, .5], [.16, .46], [.1, .34]], [[.22, .52], [.3, .56], [.32, .7], [.27, .86], [.24, .74], [.21, .6]],
  [[.44, .16], [.56, .12], [.8, .14], [.92, .22], [.88, .36], [.76, .44], [.66, .4], [.58, .36], [.5, .34], [.46, .26]], [[.46, .4], [.56, .42], [.6, .56], [.54, .76], [.5, .7], [.46, .54]], [[.8, .66], [.9, .64], [.92, .74], [.84, .78]] ];
function worldMap(c, x, y, w, h, o = {}) { c.save(); c.translate(x - w / 2, y - h / 2); reg(c, 0, 0, w, h); box(c, 0, 0, w, h, 14, o.bg || '#1d3a56');
  c.save(); rr(c, 0, 0, w, h, 14); c.clip(); for (let i = 0; i < 12; i++) line(c, i * w / 12, 0, i * w / 12, h, 1.5, 'rgba(255,255,255,.08)'); for (let i = 0; i < 7; i++) line(c, 0, i * h / 7, w, i * h / 7, 1.5, 'rgba(255,255,255,.08)');
  CONT.forEach(p => poly(c, p.map(([a, b]) => [a * w, b * h]), o.land || '#e2d4a8', 4)); c.restore();
  const st = o.stops || []; if (st.length > 1 && o.p > 0) { c.save(); c.setLineDash([14, 10]); c.lineWidth = 6; c.strokeStyle = o.routeCol || '#d9342b'; c.beginPath(); const N = 40 * (st.length - 1), lim = N * clamp(o.p);
    for (let i = 0; i <= lim; i++) { const seg = Math.min(st.length - 2, Math.floor(i / 40)), u = (i - seg * 40) / 40, A = st[seg], B = st[seg + 1]; const px = lerp(A[0], B[0], u) * w, py = lerp(A[1], B[1], u) * h - Math.sin(u * Math.PI) * h * .08; i ? c.lineTo(px, py) : c.moveTo(px, py); } c.stroke(); c.restore(); }
  st.forEach(([a, b, txt], i) => { if (o.p != null && i / Math.max(1, st.length - 1) > (o.p ?? 1) + .001) return; circ(c, a * w, b * h, 11, i === (o.hi ?? -1) ? GOLD : '#d9342b', 4); if (txt) label(c, txt, a * w, b * h - 34, Math.max(20, w * .022), '#fff'); });
  rr(c, 0, 0, w, h, 14); fs(c, null, 5); c.restore(); }

// ---------- clocks: the one-night clock ----------
function nightClock(c, x, y, r, hh, mm, o = {}) { // wall clock with AM/PM tag and moon/sun
  circ(c, x, y, r * 1.08, '#2b2f36'); clock(c, x, y, r, hh, mm, { face: o.face || '#f6f0dc' });
  const night = hh >= 19 || hh < 6; const ix = x, iy = y - r * .42; if (night) { circ(c, ix, iy, r * .11, '#ffe9a8', 2.5); circ(c, ix + r * .05, iy - r * .03, r * .1, o.face || '#f6f0dc', 0); } else circ(c, ix, iy, r * .1, '#ffcf3f', 2.5);
  if (o.label !== false) label(c, fmtTime(hh, mm), x, y + r + Math.max(26, r * .3), Math.max(26, r * .34), '#fff');
}
function fmtTime(hh, mm) { const h12 = ((hh + 11) % 12) + 1; return `${h12}:${String(mm).padStart(2, '0')} ${hh < 12 ? 'A.M.' : 'P.M.'}`; }
// screen-space overlay version (use in def.overlay). hh 0-23
function nightClockOverlay(c, hh, mm, o = {}) { const x = o.x ?? 1720, y = o.y ?? 120; box(c, x - 170, y - 80, 330, 160, 20, 'rgba(10,14,24,.82)', 3); nightClock(c, x - 92, y, 52, hh, mm, { label: false }); label(c, fmtTime(hh, mm), x + 62, y - 8, 40, '#fff', { maxW: 160 }); if (o.sub) label(c, o.sub, x + 62, y + 36, 22, '#c9d6e8', { stroke: false, maxW: 160 }); }

// ---------- street + yard furniture ----------
function sodiumLamp(c, x, y, h = 360, on = 1, o = {}) { // 1950s street lamp; on 0..1 (warm-up flicker handled by caller)
  reg(c, x - 20, y - h - 30, x + 110, y); line(c, x, y, x, y - h, 10); box(c, x - 18, y - 30, 36, 30, 4, '#2b2f36');
  c.beginPath(); c.moveTo(x, y - h); c.quadraticCurveTo(x + 10, y - h - 40, x + 70, y - h - 30); fs(c, null, 8);
  poly(c, [[x + 46, y - h - 34], [x + 96, y - h - 34], [x + 88, y - h - 10], [x + 54, y - h - 10]], '#3a3f46'); ell(c, x + 71, y - h - 8, 18, 8, on > 0 ? '#ffc070' : '#8a8f96', 3);
  if (on > 0) { cone(c, x + 71, y - h - 6, 40, 460, h + 6, '#ffb04a', .3 * on); lightPool(c, x + 71, y - h - 6, 120, '#ffb04a', .8 * on); c.save(); c.globalAlpha = .35 * on; ell(c, x + 71, y + 4, 230, 34, '#ffb04a', 0); c.restore(); }
}
function woodFence(c, x0, x1, y, h = 420, o = {}) { // 10-ft solid board fence; o.gate [gx, gw, open 0..1]
  const R = rand(o.seed || 7); for (let x = x0; x < x1; x += 46) { const hh = h + (R() - .5) * 18; if (o.gate && x >= o.gate[0] && x < o.gate[0] + o.gate[1] && (o.gate[2] || 0) > .5) continue; box(c, x, y - hh, 46, hh, 2, R() > .5 ? '#7a5a3a' : '#6d5034', 3); line(c, x + 23, y - hh + 10, x + 23, y - 10, 1.5, 'rgba(0,0,0,.25)'); }
  [y - h * .25, y - h * .75].forEach(ry => line(c, x0, ry, x1, ry, 10, '#5a412a')); }
function dropLight(c, x, y, on = 1, cord = 160) { line(c, x, y - cord, x, y - 30, 3); box(c, x - 14, y - 34, 28, 16, 3, '#2b2f36', 3); ell(c, x, y, 22, 26, on ? '#fff2c0' : '#c9ced4', 3.5); for (let i = -1; i <= 1; i++) line(c, x + i * 14, y - 22, x + i * 18, y + 22, 2.5); if (on) { lightPool(c, x, y, 360, '#ffe2a0', .5 * on); } }
function rope(c, x1, y1, x2, y2, sag = 60, col = '#c9a46a') { c.beginPath(); c.moveTo(x1, y1); c.quadraticCurveTo((x1 + x2) / 2, Math.max(y1, y2) + sag, x2, y2); c.lineWidth = 9; c.strokeStyle = INK; c.lineCap = 'round'; c.stroke(); c.lineWidth = 5; c.strokeStyle = col; c.stroke(); }
function ropeCoil(c, x, y, r = 50) { for (let i = 0; i < 4; i++) ell(c, x, y - i * 8, r - i * 4, r * .4 - i * 2, i === 3 ? '#c9a46a' : null, 5); }
function pinchBar(c, x, y, s = 1, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.beginPath(); c.moveTo(-160, 0); c.lineTo(130, 0); c.quadraticCurveTo(170, 0, 170, -40); c.lineWidth = 16; c.strokeStyle = INK; c.lineCap = 'round'; c.stroke(); c.lineWidth = 9; c.strokeStyle = '#b8322a'; c.stroke(); line(c, -160, 0, -180, 10, 9); c.restore(); }
function wrench(c, x, y, s = 1, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); box(c, -110, -12, 200, 24, 10, '#aab1b8'); c.beginPath(); c.arc(110, 0, 32, .9, TAU - .9); c.closePath(); fs(c, '#aab1b8'); circ(c, -100, 0, 18, '#aab1b8'); label(c, '17', -20, 0, 18, '#5b636b', { stroke: false }); c.restore(); }
function nailPuller(c, x, y, s = 1, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); box(c, -14, -150, 28, 150, 8, '#5d4037'); c.beginPath(); c.moveTo(0, -150); c.quadraticCurveTo(0, -200, 50, -200); c.lineWidth = 16; c.strokeStyle = INK; c.stroke(); c.lineWidth = 9; c.strokeStyle = '#8d969e'; c.stroke(); poly(c, [[44, -214], [74, -206], [74, -194], [44, -186]], '#8d969e', 3.5); c.restore(); }
function toolCloth(c, x, y, w = 760, o = {}) { // the shopping list laid out on canvas (ladders + ropes + drop light + pinch bar + wrenches + nail puller)
  reg(c, x - w / 2, y - w * .3, x + w / 2, y + w * .3); c.save(); c.translate(x, y); c.rotate(-.03); box(c, -w / 2, -w * .3, w, w * .6, 10, '#c9b58a'); c.restore();
  const n = o.n ?? 6, s = w / 760; const items = [() => pinchBar(c, x - 120 * s, y - 110 * s, s * .9, .05), () => { wrench(c, x + 200 * s, y - 120 * s, s * .7, -.1); wrench(c, x + 220 * s, y - 60 * s, s * .55, .05); }, () => nailPuller(c, x - 260 * s, y + 140 * s, s * .9, -1.4), () => ropeCoil(c, x + 40 * s, y + 90 * s, 70 * s), () => dropLight(c, x + 250 * s, y + 90 * s, 0, 40 * s), () => flashbulb(c, x - 40 * s, y - 20 * s, s * 1.2)];
  items.slice(0, n).forEach(f => f()); }
function tarp(c, x, y, w, h, o = {}) { c.beginPath(); c.moveTo(x - w / 2, y - h / 2); c.quadraticCurveTo(x, y - h / 2 + (o.sag ?? 30), x + w / 2, y - h / 2); c.lineTo(x + w / 2, y + h / 2); c.quadraticCurveTo(x, y + h / 2 + 20, x - w / 2, y + h / 2); c.closePath(); fs(c, o.col || '#3b4a3c'); for (let i = 1; i < 6; i++) line(c, x - w / 2 + i * w / 6, y - h / 2 + 10, x - w / 2 + i * w / 6 + 10, y + h / 2 - 10, 3, 'rgba(0,0,0,.2)'); }
// bag with two couplings. o.open shows them, o.tag text
function couplingBag(c, x, y, s = 1, o = {}) { c.save(); c.translate(x, y); c.scale(s, s); reg(c, -110, -230, 110, 0);
  if (o.open) [[-40, -200], [40, -214]].forEach(([cx, cy]) => { box(c, cx - 26, cy - 34, 52, 68, 10, '#c9852f'); for (let i = 0; i < 3; i++) line(c, cx - 26, cy - 20 + i * 18, cx + 26, cy - 20 + i * 18, 3); circ(c, cx, cy - 44, 14, '#9aa1a8', 3.5); });
  c.beginPath(); c.moveTo(-90, -150); c.quadraticCurveTo(-110, -20, -80, 0); c.lineTo(80, 0); c.quadraticCurveTo(110, -20, 90, -150); c.quadraticCurveTo(0, -130, -90, -150); fs(c, '#6f7458');
  line(c, -70, -140, -40, -170, 5); line(c, 70, -140, 40, -170, 5);
  if (o.tag) { line(c, 60, -120, 120, -90, 3); c.save(); c.translate(150, -80); c.rotate(.2); box(c, -50, -26, 100, 52, 6, '#f7f4ea', 3); label(c, o.tag, 0, 0, 20, INK, { stroke: false, maxW: 86 }); c.restore(); } c.restore(); }
// ---------- exhibition ----------
function pedestal(c, x, y, w, o = {}) { reg(c, x - w / 2 - 40, y - 140, x + w / 2 + 40, y); box(c, x - w / 2, y - 120, w, 120, 8, '#7a2a2a'); box(c, x - w / 2 - 20, y - 136, w + 40, 24, 6, '#9a3a34'); box(c, x - w / 2 + 20, y - 100, w - 40, 6, 0, '#c9a14a', 0);
  if (o.rope) { [x - w / 2 - 70, x + w / 2 + 70].forEach(px => { line(c, px, y, px, y - 150, 8, '#c9a14a'); circ(c, px, y - 156, 12, '#c9a14a', 3.5); box(c, px - 26, y - 8, 52, 10, 4, '#c9a14a', 3); });
    c.beginPath(); c.moveTo(x - w / 2 - 70, y - 146); c.quadraticCurveTo(x, y - 60, x + w / 2 + 70, y - 146); c.lineWidth = 12; c.strokeStyle = INK; c.stroke(); c.lineWidth = 7; c.strokeStyle = '#b8322a'; c.stroke(); }
  if (o.plaque) { box(c, x - 120, y - 86, 240, 50, 4, '#e9d9a8', 3); label(c, o.plaque, x, y - 61, 24, INK, { stroke: false, maxW: 220 }); } }
function hallFacade(c, x, y, w, o = {}) { // generic modern auditorium, banner over the doors
  const h = w * .42; reg(c, x - w / 2, y - h - 60, x + w / 2, y);
  poly(c, [[x - w / 2, y], [x - w / 2 + 40, y - h], [x + w / 2 - 40, y - h], [x + w / 2, y]], '#d9d2bf'); box(c, x - w / 2 - 20, y - h - 40, w + 40, 50, 6, '#bfb59c');
  for (let i = 0; i < 9; i++) { const px = x - w / 2 + 80 + i * (w - 160) / 8; box(c, px - 14, y - h + 10, 28, h - 10, 4, '#ece6d4', 3); }
  for (let i = 0; i < 5; i++) { const px = x - w * .3 + i * w * .15; box(c, px - 40, y - 150, 80, 150, 4, o.night ? '#ffd36e' : '#2f3e52', 3.5); }
  if (o.banner) { box(c, x - w * .34, y - h * .82, w * .68, h * .26, 6, '#b8322a'); label(c, o.banner, x, y - h * .69, h * .13, '#fff', { maxW: w * .62 }); }
  if (o.name) label(c, o.name, x, y - h - 15, Math.min(40, w * .04), INK, { stroke: false, maxW: w - 40 }); }
function embassyFacade(c, x, y, w, o = {}) { const h = w * .55; reg(c, x - w / 2, y - h - 200, x + w / 2, y);
  box(c, x - w / 2, y - h, w, h, 6, '#e6e1d3'); for (let r = 0; r < 3; r++) for (let i = 0; i < 7; i++) windowRect(c, x - w / 2 + 40 + i * (w - 80) / 7, y - h + 30 + r * h * .28, (w - 80) / 7 - 30, h * .18, o.night && (i + r) % 3 ? '#ffd36e' : '#2f3e52');
  box(c, x - 70, y - 140, 140, 140, 6, '#5d4037'); line(c, x + w / 2 - 60, y - h, x + w / 2 - 60, y - h - 180, 6); usFlag(c, x + w / 2 - 57, y - h - 180, 130, o.t || 0);
  if (o.name !== false) label(c, o.name || 'U.S. EMBASSY', x, y - h - 30, Math.min(44, w * .05), INK, { stroke: false }); }
function usFlag(c, x, y, w, t = 0) { const h = w * .55; c.save(); c.translate(x, y); for (let i = 0; i < 7; i++) { c.fillStyle = i % 2 ? '#f4f4f0' : '#b8322a'; c.beginPath(); for (let k = 0; k <= 10; k++) { const u = k / 10 * w; c.lineTo(u, i * h / 7 + Math.sin(t * 3 + k * .6) * 4 * k / 10); } for (let k = 10; k >= 0; k--) { const u = k / 10 * w; c.lineTo(u, (i + 1) * h / 7 + Math.sin(t * 3 + k * .6) * 4 * k / 10); } c.fill(); }
  c.fillStyle = '#2b3a6b'; c.fillRect(0, 0, w * .42, h * 4 / 7); c.strokeStyle = INK; c.lineWidth = 3; c.strokeRect(0, 0, w, h); c.restore(); }
function hotelDoor(c, x, y, o = {}) { reg(c, x - 120, y - 420, x + 120, y); box(c, x - 120, y - 420, 240, 420, 6, '#6d4c41'); box(c, x - 100, y - 400, 200, 400, 4, '#8a5a3b', 3); box(c, x - 80, y - 380, 160, 150, 4, null, 2.5); box(c, x - 80, y - 210, 160, 180, 4, null, 2.5);
  circ(c, x + 70, y - 200, 10, GOLD, 3); box(c, x - 40, y - 330, 80, 40, 4, '#e9d9a8', 3); label(c, o.num || '214', x, y - 310, 28, INK, { stroke: false });
  if (o.sign) { c.save(); c.translate(x + 70, y - 170); c.rotate(.08); line(c, 0, -30, 0, 0, 2); box(c, -40, 0, 80, 54, 6, '#fff8e1', 3); label(c, o.sign, 0, 27, 16, RED, { stroke: false, maxW: 70 }); c.restore(); } }
function roomKey(c, x, y, s = 1, num = '214') { c.save(); c.translate(x, y); c.scale(s, s); line(c, 0, 0, 0, 90, 8, '#c9a14a'); line(c, 0, 70, 16, 70, 6, '#c9a14a'); line(c, 0, 86, 12, 86, 6, '#c9a14a'); poly(c, [[-30, -10], [30, -10], [40, -70], [-40, -70]], '#b8322a'); label(c, num, 0, -40, 26, '#fff', { stroke: false }); c.restore(); }

// ---------- space ----------
function moon(c, x, y, r, o = {}) { // o.far: far-side face (few maria, many craters); o.phase 0..1 shadow; o.face expr gives it a crayon face
  circ(c, x, y, r, '#d9d6cc'); c.save(); c.beginPath(); c.arc(x, y, r - 2, 0, TAU); c.clip(); const R = rand(o.far ? 11 : 5);
  if (!o.far) [[-.3, -.25, .32], [.15, -.1, .26], [.25, .3, .2], [-.1, .35, .16]].forEach(([a, b, s]) => ell(c, x + a * r, y + b * r, s * r, s * r * .8, '#aeaaa0', 0));
  for (let i = 0; i < (o.far ? 26 : 12); i++) { const a = R() * TAU, d = Math.sqrt(R()) * r * .9, cr = r * (.03 + R() * .08); circ(c, x + Math.cos(a) * d, y + Math.sin(a) * d, cr, '#bdb8aa', 0); c.beginPath(); c.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, cr, Math.PI * .1, Math.PI * .9); c.lineWidth = 2.5; c.strokeStyle = 'rgba(90,80,70,.55)'; c.stroke(); }
  if (o.phase) { c.globalAlpha = .75; ell(c, x + r * (1 - 2 * o.phase) * 1.2, y, r * 1.1, r * 1.1, '#0b1020', 0); } c.globalAlpha = .18; circ(c, x + r * .4, y + r * .35, r * .9, '#000', 0); c.restore(); circ(c, x, y, r, null);
  if (o.face) face(c, x, y, r * .4, o.face, o.t || 0, { noNose: true, seed: 9, skin: '#d9d6cc' }); }
function earth(c, x, y, r, t = 0) { circ(c, x, y, r, '#3f88c5'); c.save(); c.beginPath(); c.arc(x, y, r - 2, 0, TAU); c.clip(); const off = (t * 10) % (r * 2);
  [[-.4, -.3, .5, .35], [.3, .1, .45, .5], [-.2, .45, .35, .25], [.6, -.45, .3, .2]].forEach(([a, b, w, h]) => { ell(c, x + a * r - off + r * 2, y + b * r, w * r, h * r, '#5fb36a', 3); ell(c, x + a * r - off, y + b * r, w * r, h * r, '#5fb36a', 3); });
  c.globalAlpha = .2; circ(c, x + r * .4, y + r * .35, r * .9, '#000', 0); c.restore(); circ(c, x, y, r, null); lightPool(c, x, y, r * 1.3, '#8fc8ff', .25); }
function sputnik(c, x, y, r, t = 0, o = {}) { c.save(); c.translate(x, y); c.rotate(o.rot ?? -.5); reg(c, -r, -r, r * 4, r);
  [-.35, -.12, .12, .35].forEach(a => line(c, Math.cos(Math.PI + a) * r * .8, Math.sin(Math.PI + a) * r * .8, Math.cos(Math.PI + a * 1.6) * r * 3.6, Math.sin(Math.PI + a * 1.6) * r * 3.6, 4, '#c9ced4'));
  circ(c, 0, 0, r, '#d6dde2'); c.save(); c.beginPath(); c.arc(0, 0, r, 0, TAU); c.clip(); c.globalAlpha = .25; circ(c, r * .45, r * .4, r, '#000', 0); c.restore(); circ(c, -r * .35, -r * .35, r * .18, 'rgba(255,255,255,.85)', 0); circ(c, 0, 0, r, null);
  if (o.beep) { const k = (t * 1.6) % 1; c.save(); c.globalAlpha = 1 - k; c.beginPath(); c.arc(0, 0, r * (1.3 + k * 1.4), -1, 1); c.lineWidth = 4; c.strokeStyle = '#9fd1ff'; c.stroke(); c.restore(); } c.restore(); }
function lunaProbe(c, x, y, r, n = 1, t = 0) { // n=1,2: sphere with whip antennas + magnetometer boom; n=3: cylinder with solar cells and camera window
  c.save(); c.translate(x, y); reg(c, -r * 2.2, -r * 2.2, r * 2.2, r * 2.2); const sp = t * .3;
  if (n < 3) { [0, 1, 2, 3].forEach(i => { const a = sp + i * TAU / 4 + .4; line(c, Math.cos(a) * r, Math.sin(a) * r, Math.cos(a) * r * 2.1, Math.sin(a) * r * 2.1, 3.5, '#c9ced4'); }); line(c, 0, -r, 0, -r * 1.7, 6, '#9aa1a8'); circ(c, 0, -r * 1.75, r * .14, '#c9852f', 3);
    circ(c, 0, 0, r, '#cfd5da'); c.save(); c.beginPath(); c.arc(0, 0, r, 0, TAU); c.clip(); c.globalAlpha = .25; circ(c, r * .45, r * .4, r, '#000', 0); c.restore(); circ(c, 0, 0, r, null); line(c, -r, 0, r, 0, 2.5); }
  else { box(c, -r * .55, -r * 1.1, r * 1.1, r * 2.2, r * .5, '#cfd5da'); for (let i = 0; i < 4; i++) box(c, -r * .45, -r * .8 + i * r * .42, r * .9, r * .3, 3, '#2f4a7a', 2.5); circ(c, 0, -r * 1.15, r * .25, '#1b2a44', 3); [-1, 1].forEach(s => line(c, s * r * .55, r * .5, s * r * 1.5, r * 1.6, 3.5, '#c9ced4')); }
  c.restore(); }
function pioneer4(c, x, y, s = 1, o = {}) { c.save(); c.translate(x, y); c.scale(s, s); c.rotate(o.rot ?? .3); reg(c, -60, -120, 60, 60); poly(c, [[0, -110], [44, 30], [-44, 30]], '#e0c26a'); c.save(); poly(c, [[0, -110], [44, 30], [-44, 30]], null, 0); c.clip(); c.globalAlpha = .3; c.fillStyle = '#000'; c.fillRect(0, -120, 60, 160); c.restore();
  line(c, -44, 30, 44, 30, 4); box(c, -30, 30, 60, 20, 4, '#9aa1a8', 3); line(c, 0, -110, 0, -150, 4); c.restore(); }
function launchRocket(c, x, y, s = 1, o = {}) { // R-7 style: core + 4 strap-on boosters, CCCP; o.fire 0..1, o.t
  c.save(); c.translate(x, y); c.scale(s, s); reg(c, -120, -700, 120, 0); const t = o.t || 0;
  if (o.fire > 0) { for (let i = 0; i < 5; i++) { const fx = (i - 2) * 40, fl = (160 + Math.sin(t * 30 + i) * 30) * o.fire; poly(c, [[fx - 22, 0], [fx + 22, 0], [fx, fl]], '#ffb347', 0); poly(c, [[fx - 12, 0], [fx + 12, 0], [fx, fl * .6]], '#fff3c0', 0); } lightPool(c, 0, 60, 400, '#ffb04a', .6 * o.fire);
    for (let i = 0; i < 8; i++) { const k = (t * .5 + i / 8) % 1; circ(c, (i % 2 ? -1 : 1) * (60 + k * 260), 80 + k * 30, 50 + k * 80, `rgba(220,215,205,${.6 * (1 - k)})`, 0); } }
  [-1, 1].forEach(sd => { c.beginPath(); c.moveTo(sd * 30, -320); c.quadraticCurveTo(sd * 70, -260, sd * 90, -20); c.lineTo(sd * 40, -20); c.closePath(); fs(c, '#cfd5da'); poly(c, [[sd * 90, -20], [sd * 110, 0], [sd * 40, 0], [sd * 40, -20]], '#9aa1a8'); });
  box(c, -40, -620, 80, 620, 10, '#e7ecef'); poly(c, [[-40, -620], [40, -620], [0, -700]], '#cfd5da'); box(c, -40, -470, 80, 30, 0, '#b8322a', 3);
  label(c, 'CCCP', 0, -300, 40, '#b8322a', { stroke: false, raw: true, rot: -Math.PI / 2 }); c.restore(); }
function starfield(c, t, seed = 3, n = 160, o = {}) { const R = rand(seed); for (let i = 0; i < n; i++) { const x = R() * (W + 800) - 400, y = R() * (H + 600) - 300, r = R() * 2.2 + .6, tw = .5 + .5 * Math.sin(t * (1 + R() * 2) + i); circ(c, x, y, r, `rgba(255,255,255,${(.35 + .55 * tw) * (o.a ?? 1)})`, 0); } }
// darkroom tray with a print developing (p 0..1)
function devTray(c, x, y, w, p, inner) { box(c, x - w / 2, y - w * .3, w, w * .6, 10, '#3a3f46'); box(c, x - w / 2 + 14, y - w * .3 + 14, w - 28, w * .6 - 28, 6, '#5a2420', 3); c.save(); c.globalAlpha = clamp(p); photoPrint(c, x, y, w * .7, w * .4, .02, inner); c.restore(); }
