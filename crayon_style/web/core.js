// ---------- core: constants, palette, easing, ink primitives, light, texture, type (see DESIGN_BIBLE.md) ----------
const W = 1920, H = 1080, TAU = Math.PI * 2, FPS = 30;
const INK = '#1b1819', LW = 4.6, LW_S = 2.6;
const P = {
  paper: '#efe6cf', cream: '#f3dfb2', parch: '#e6e1c6',
  woodD: '#3f2a1c', wood: '#5a3d26', woodL: '#8a5f3b', woodH: '#b48454',
  stoneD: '#3a3a3e', stone: '#6b6b70', stoneL: '#a9a9ad', marble: '#d9d6cf',
  night1: '#141c33', night2: '#22305a', dusk1: '#3c3a62', dusk2: '#8e5f7a', dusk3: '#e7a57a',
  slate: '#546c84', tealD: '#1f3b3b', moss: '#4f6b3a', leaf: '#6f8f45',
  skin1: '#f6d7b5', skin2: '#e9bd92', skin3: '#b98058', skin4: '#7e5236',
  suitB: '#232226', suitN: '#26324d', suitBr: '#5b4334', shirt: '#f4f2ea',
  red: '#c8433a', gold: '#e2b13c', money: '#5f9e57', glow: '#ffd98a',
  brick: '#7b4b3c', brickD: '#5e382d', brickL: '#9a6450', tulip: '#d2464f', tulipD: '#a0303a',
};
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const easeOut = t => 1 - Math.pow(1 - clamp(t), 3);
const easeIn = t => Math.pow(clamp(t), 3);
const smooth = t => { t = clamp(t); return t * t * (3 - 2 * t); };
function rng(seed) { let s = (seed * 2654435761) >>> 0; return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
function hex(c) { c = c.replace('#', ''); return [0, 2, 4].map(i => parseInt(c.slice(i, i + 2), 16)); }
function shade(c, k) { // k<0 darker, k>0 lighter
  const [r, g, b] = hex(c); const f = v => Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k);
  return '#' + [f(r), f(g), f(b)].map(v => clamp(v, 0, 255).toString(16).padStart(2, '0')).join('');
}
function rgba(c, a) { const [r, g, b] = hex(c); return `rgba(${r},${g},${b},${a})`; }

// ---- ink primitives: fill first, then one uniform ink stroke
function ink(c, fill, lw = LW, col = INK) {
  if (fill) { c.fillStyle = fill; c.fill(); }
  if (lw) { c.lineWidth = lw; c.strokeStyle = col; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke(); }
}
function rect(c, x, y, w, h, fill, lw = LW, r = 0) { c.beginPath(); r ? c.roundRect(x, y, w, h, r) : c.rect(x, y, w, h); ink(c, fill, lw); }
function circ(c, x, y, r, fill, lw = LW) { c.beginPath(); c.arc(x, y, Math.max(.1, r), 0, TAU); ink(c, fill, lw); }
function ell(c, x, y, rx, ry, fill, lw = LW, rot = 0) { c.beginPath(); c.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), rot, 0, TAU); ink(c, fill, lw); }
function poly(c, pts, fill, lw = LW, open = false) { c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); if (!open) c.closePath(); ink(c, fill, lw); }
function ln(c, x1, y1, x2, y2, w = LW, col = INK) { c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.lineWidth = w; c.strokeStyle = col; c.lineCap = 'round'; c.stroke(); }
function curve(c, x1, y1, cx, cy, x2, y2, w = LW, col = INK) { c.beginPath(); c.moveTo(x1, y1); c.quadraticCurveTo(cx, cy, x2, y2); c.lineWidth = w; c.strokeStyle = col; c.lineCap = 'round'; c.stroke(); }
function groundShadow(c, x, y, rx, a = .28) { c.save(); c.globalAlpha = a; c.beginPath(); c.ellipse(x, y, rx, rx * .16, 0, 0, TAU); c.fillStyle = '#0a0608'; c.fill(); c.restore(); }
// soft crescent shade inside the current path (call after building a path): darker side away from key light
function crescent(c, pathFn, cx, cy, r, dir = 1, k = -.12, base) {
  c.save(); pathFn(); c.clip(); c.beginPath(); c.arc(cx - dir * r * .38, cy - r * .12, r * 1.08, 0, TAU); c.rect(cx - r * 4, cy - r * 4, r * 8, r * 8);
  c.fillStyle = rgba('#000000', -k * 1.6); c.fill('evenodd'); c.restore();
}
// vertical gradient fill for big wall areas
function vgrad(c, x, y, w, h, top, bot) { const g = c.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, top); g.addColorStop(1, bot); c.fillStyle = g; c.fillRect(x, y, w, h); }

// ---- light
function glow(c, x, y, r, col = P.glow, a = .4) {
  const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(col, 1)); g.addColorStop(.35, rgba(col, .35)); g.addColorStop(1, rgba(col, 0));
  c.save(); c.globalAlpha = a; c.globalCompositeOperation = 'screen'; c.fillStyle = g; c.fillRect(x - r, y - r, 2 * r, 2 * r); c.restore();
}
function pool(c, x, y, rx, ry, col = P.glow, a = .25) {
  c.save(); c.translate(x, y); c.scale(1, ry / rx); glow(c, 0, 0, rx, col, a); c.restore();
}
function cone(c, x, y, w1, w2, h, col = '#fff3d0', a = .18) {
  const g = c.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, rgba(col, 1)); g.addColorStop(1, rgba(col, .15));
  c.save(); c.globalAlpha = a; c.globalCompositeOperation = 'screen'; c.fillStyle = g;
  c.beginPath(); c.moveTo(x - w1 / 2, y); c.lineTo(x + w1 / 2, y); c.lineTo(x + w2 / 2, y + h); c.lineTo(x - w2 / 2, y + h); c.closePath(); c.fill(); c.restore();
}
function shadeRect(c, x, y, w, h, a) { c.save(); c.globalAlpha = a; c.fillStyle = '#0b0710'; c.fillRect(x, y, w, h); c.restore(); }

// ---- full-frame finishing: grain (static per shot) and vignette
const GRAIN = (() => { const g = document.createElement('canvas'); g.width = 960; g.height = 540; const x = g.getContext('2d'); const d = x.createImageData(960, 540); const R = rng(7);
  for (let i = 0; i < d.data.length; i += 4) { const v = 128 + (R() - .5) * 90; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } x.putImageData(d, 0, 0); return g; })();
function finish(c, seed = 0) {
  c.save(); c.globalAlpha = .07; c.globalCompositeOperation = 'overlay'; const ox = (seed * 137) % 400, oy = (seed * 71) % 200;
  c.translate(-ox, -oy); c.drawImage(GRAIN, 0, 0, 960, 540, 0, 0, W + 400, H + 200); c.restore();
  const g = c.createRadialGradient(W / 2, H / 2, H * .42, W / 2, H / 2, H * 1.0); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(8,4,12,.42)');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
}

// ---- type
function hand(c, text, x, y, size, col = '#fff', o = {}) {
  c.save(); c.font = `700 ${size}px Caveat`; c.textAlign = o.align || 'center'; c.textBaseline = 'middle';
  if (o.rot) { c.translate(x, y); c.rotate(o.rot); x = 0; y = 0; }
  if (o.shadow !== false) { c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = size * .22; c.shadowOffsetY = size * .05; }
  if (o.stroke) { c.lineWidth = o.stroke; c.strokeStyle = o.strokeCol || INK; c.lineJoin = 'round'; c.strokeText(text, x, y); c.shadowColor = 'transparent'; }
  c.fillStyle = col; c.fillText(text, x, y); const w = c.measureText(text).width; c.restore(); return w;
}
function sign(c, text, x, y, size, col = INK, o = {}) {
  c.save(); c.font = `700 ${size}px Kalam`; c.textAlign = o.align || 'center'; c.textBaseline = 'middle';
  if (o.rot) { c.translate(x, y); c.rotate(o.rot); x = 0; y = 0; }
  if (o.maxW) { let s = size; while (c.measureText(text).width > o.maxW && s > 8) { s -= 1; c.font = `700 ${s}px Kalam`; } }
  c.fillStyle = col; c.fillText(text, x, y + size * .06); c.restore();
}
// hand-drawn curved arrow from (x1,y1) to (x2,y2), bowing by b
function arrow(c, x1, y1, x2, y2, b = 40, p = 1, col = '#fff') {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
  const cx = mx - dy / L * b, cy = my + dx / L * b;
  c.save(); c.shadowColor = 'rgba(0,0,0,.55)'; c.shadowBlur = 8; c.lineWidth = 4.2; c.strokeStyle = col; c.lineCap = 'round'; c.lineJoin = 'round';
  c.beginPath(); const N = 24; for (let i = 0; i <= N * p; i++) { const t = i / N, q = 1 - t; const X = q * q * x1 + 2 * q * t * cx + t * t * x2, Y = q * q * y1 + 2 * q * t * cy + t * t * y2; i ? c.lineTo(X, Y) : c.moveTo(X, Y); } c.stroke();
  if (p >= .98) { const a = Math.atan2(y2 - cy, x2 - cx); c.beginPath(); c.moveTo(x2 - 18 * Math.cos(a - .5), y2 - 18 * Math.sin(a - .5)); c.lineTo(x2, y2); c.lineTo(x2 - 18 * Math.cos(a + .5), y2 - 18 * Math.sin(a + .5)); c.stroke(); }
  c.restore();
}
// speech bubble: white rounded box, ink border, tail toward (tx,ty); pops in with p
function bubble(c, text, x, y, tx, ty, p = 1, size = 46) {
  if (p <= 0) return; c.save(); c.font = `700 ${size}px Caveat`; const tw = c.measureText(text).width, w = tw + 56, h = size * 1.5;
  const s = .6 + .4 * easeOut(p); c.globalAlpha = clamp(p * 3); c.translate(x, y); c.scale(s, s);
  c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, 16); ink(c, '#fbfaf4', 3.6);
  const ax = clamp((tx - x) / s, -w / 2 + 26, w / 2 - 26); c.beginPath(); c.moveTo(ax - 12, h / 2 - 2); c.lineTo((tx - x) / s, (ty - y) / s); c.lineTo(ax + 12, h / 2 - 2); ink(c, '#fbfaf4', 3.6);
  c.fillStyle = '#fbfaf4'; c.fillRect(ax - 10, h / 2 - 6, 20, 5);
  c.fillStyle = INK; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, 0, 2); c.restore();
}
