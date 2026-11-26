// ---------- core drawing helpers (flat 2D vector cartoon) ----------
const W = 1920, H = 1080, INK = '#2b211e', LW = 4.6;
const TAU = Math.PI * 2;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const easeOut = t => 1 - Math.pow(1 - clamp(t), 3);
// one easing curve for arrivals: cubic-bezier(0.16, 1, 0.3, 1) approximated (decelerate, no overshoot)
const back = t => 1 - Math.pow(1 - clamp(t), 4);
function rand(seed) { let s = seed * 9301 + 49297; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); }

const REG = { on: false, list: [] };
function reg(c, x0, y0, x1, y1) { if (!REG.on) return; const m = c.getTransform(); const P = [[x0, y0], [x1, y0], [x0, y1], [x1, y1]].map(([x, y]) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]);
  REG.list.push([Math.min(...P.map(p => p[0])), Math.min(...P.map(p => p[1])), Math.max(...P.map(p => p[0])), Math.max(...P.map(p => p[1]))]); }
function fs(c, fill, lw = LW) { if (fill) { c.fillStyle = fill; c.fill(); } if (lw) { c.lineWidth = lw; c.strokeStyle = INK; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke(); } }
function rr(c, x, y, w, h, r = 12) { c.beginPath(); c.roundRect(x, y, w, h, r); }
function box(c, x, y, w, h, r, fill, lw) { rr(c, x, y, w, h, r); fs(c, fill, lw); }
function circ(c, x, y, r, fill, lw) { c.beginPath(); c.arc(x, y, r, 0, TAU); fs(c, fill, lw); }
function ell(c, x, y, rx, ry, fill, lw, rot = 0) { c.beginPath(); c.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), rot, 0, TAU); fs(c, fill, lw); }
function line(c, x1, y1, x2, y2, w = LW, col = INK) { c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.lineWidth = w; c.strokeStyle = col; c.lineCap = 'round'; c.stroke(); }
function poly(c, pts, fill, lw) { c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); fs(c, fill, lw); }
function shadow(c, x, y, rx, a = .22) { c.save(); c.globalAlpha = a; ell(c, x, y, rx, rx * .22, '#000', 0); c.restore(); }

// Kalam Bold caps label with thick dark outline; shrinks to fit maxW
function label(c, text, x, y, size, fill = '#fff', o = {}) {
  text = o.raw ? String(text) : String(text).toUpperCase();
  let s = size; c.font = `700 ${s}px Kalam`;
  if (o.maxW) { while (c.measureText(text).width > o.maxW && s > 10) { s -= 2; c.font = `700 ${s}px Kalam`; } }
  c.textAlign = o.align || 'center'; c.textBaseline = 'middle';
  if (s >= 34 && !o.rot && (o.align || 'center') === 'center') { const tw = c.measureText(text).width; reg(c, x - tw / 2, y - s * .55, x + tw / 2, y + s * .6); }
  c.save();
  if (o.rot) { c.translate(x, y); c.rotate(o.rot); x = 0; y = 0; }
  if (o.glow) { c.shadowColor = o.glow; c.shadowBlur = s * .55; }
  if (o.stroke !== false) { c.lineWidth = Math.max(4, s * .16); c.strokeStyle = o.strokeCol || INK; c.lineJoin = 'round'; c.strokeText(text, x, y + s * .06); }
  c.fillStyle = fill; c.fillText(text, x, y + s * .06);
  if (o.glow) { c.shadowBlur = 0; c.fillText(text, x, y + s * .06); }
  c.restore(); return s;
}
const RED = '#ff4a3d', GREEN = '#3ee07a', GOLD = '#ffcf3f';
function money(c, text, x, y, size, kind = 'loss', o = {}) {
  const col = kind === 'loss' ? RED : kind === 'gain' ? GREEN : kind === 'gold' ? GOLD : '#fff';
  return label(c, text, x, y, size, col, { glow: kind === 'name' ? null : col, ...o });
}
function lightPool(c, x, y, r, col = '#fff6d0', a = .5) {
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)');
  c.save(); c.globalAlpha = a; c.globalCompositeOperation = 'screen'; c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); c.restore();
}
function vignette(c, a = .55) {
  const g = c.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * .95);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(10,6,12,${a})`);
  c.fillStyle = g; c.fillRect(0, 0, W, H);
}
function bg(c, top, bot) { const g = c.createLinearGradient(0, -200, 0, H + 200); g.addColorStop(0, top); g.addColorStop(1, bot || top); c.fillStyle = g; c.fillRect(-400, -300, W + 800, H + 600); }
function cone(c, x, y, w1, w2, h, col = '#fff8dc', a = .22) {
  const g = c.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, col); g.addColorStop(1, 'rgba(255,255,255,0)');
  c.save(); c.globalAlpha = a; c.globalCompositeOperation = 'screen'; c.fillStyle = g;
  c.beginPath(); c.moveTo(x - w1 / 2, y); c.lineTo(x + w1 / 2, y); c.lineTo(x + w2 / 2, y + h); c.lineTo(x - w2 / 2, y + h); c.closePath(); c.fill(); c.restore();
}

// ---------- faces ----------
// expr: neutral grin smug worried shock sad happy bored
function face(c, x, y, r, expr = 'neutral', t = 0, o = {}) {
  const seed = o.seed || 1, look = o.look || 0;
  const bl = ((t + seed * 1.37) % 3.9) < .13; // blink
  const ex = r * .36, ey = y - r * .05, er = r * .13;
  const eyes = (dx) => {
    const cx = x + dx + look * r * .08;
    if (expr === 'shock') { circ(c, cx, ey, er * 1.9, '#fff', 3.5); circ(c, cx, ey, er * .55, INK, 0); return; }
    if (bl) { line(c, cx - er, ey, cx + er, ey, 4); return; }
    if (expr === 'smug' || expr === 'bored') {
      ell(c, cx, ey + er * .3, er, er * .75, INK, 0); c.fillStyle = o.skin || '#f2c49b'; c.fillRect(cx - er * 1.3, ey - er * 1.2, er * 2.6, er * 1.25);
      line(c, cx - er * 1.2, ey - er * .05, cx + er * 1.2, ey - er * .05, 3.5); return;
    }
    if (expr === 'happy') { c.beginPath(); c.arc(cx, ey + er * .4, er, Math.PI * 1.1, Math.PI * 1.9); c.lineWidth = 5; c.strokeStyle = INK; c.stroke(); return; }
    ell(c, cx, ey, er * .85, er * 1.15, INK, 0); circ(c, cx + er * .3, ey - er * .4, er * .32, '#fff', 0);
  };
  eyes(-ex); eyes(ex);
  // brows
  const by = ey - r * .3; c.lineWidth = 4.5; c.strokeStyle = INK; c.lineCap = 'round';
  const brow = (dx, s) => { c.beginPath();
    if (expr === 'worried' || expr === 'sad') { c.moveTo(x + dx - s * r * .14, by + r * .02); c.lineTo(x + dx + s * r * .14, by - r * .08); }
    else if (expr === 'shock') { c.moveTo(x + dx - r * .14, by - r * .14); c.quadraticCurveTo(x + dx, by - r * .24, x + dx + r * .14, by - r * .14); }
    else if (expr === 'smug') { c.moveTo(x + dx - r * .14, by - (s > 0 ? r * .1 : 0)); c.lineTo(x + dx + r * .14, by - (s > 0 ? r * .02 : r * .06)); }
    else if (expr === 'angry') { c.moveTo(x + dx - s * r * .14, by - r * .08); c.lineTo(x + dx + s * r * .14, by + r * .03); }
    else { c.moveTo(x + dx - r * .13, by - r * .03); c.quadraticCurveTo(x + dx, by - r * .09, x + dx + r * .13, by - r * .03); }
    c.stroke(); };
  brow(-ex, 1); brow(ex, -1);
  // nose
  if (!o.noNose) { c.beginPath(); c.arc(x + r * .04, y + r * .12, r * .07, -Math.PI * .4, Math.PI * .6); c.lineWidth = 3.5; c.stroke(); }
  // mouth
  const my = y + r * .38, talk = o.talk ? Math.abs(Math.sin(t * 13)) : 0;
  c.lineWidth = 4.5;
  if (expr === 'shock') { ell(c, x, my + r * .04, r * .13, r * .17 + talk * 3, '#5a1f1f', 3.5); }
  else if (expr === 'grin' || expr === 'happy') { c.beginPath(); c.moveTo(x - r * .28, my - r * .04); c.quadraticCurveTo(x, my + r * .34, x + r * .28, my - r * .04); c.closePath(); fs(c, '#5a1f1f', 4); c.beginPath(); c.moveTo(x - r * .24, my - r * .02); c.lineTo(x + r * .24, my - r * .02); c.lineTo(x + r * .2, my + r * .05); c.lineTo(x - r * .2, my + r * .05); c.closePath(); c.fillStyle = '#fff'; c.fill(); }
  else if (expr === 'smug') { c.beginPath(); c.moveTo(x - r * .2, my + r * .02); c.quadraticCurveTo(x + r * .08, my + r * .1, x + r * .26, my - r * .08); c.stroke(); }
  else if (expr === 'worried') { c.beginPath(); c.moveTo(x - r * .2, my + r * .06); c.bezierCurveTo(x - r * .08, my - r * .06, x + r * .06, my + r * .14, x + r * .2, my + r * .02); c.stroke(); }
  else if (expr === 'sad') { c.beginPath(); c.arc(x, my + r * .18, r * .18, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); }
  else if (expr === 'bored') { line(c, x - r * .16, my + r * .04, x + r * .16, my + r * .04, 4.5); }
  else { if (talk > .3) ell(c, x, my + r * .02, r * .12, r * .05 + talk * r * .08, '#5a1f1f', 3.5); else { c.beginPath(); c.arc(x, my - r * .1, r * .17, Math.PI * .25, Math.PI * .75); c.stroke(); } }
  if (o.sweat) { const sy = y - r * .35 + ((t * 30) % 20); c.beginPath(); c.moveTo(x + r * .78, sy - r * .2); c.quadraticCurveTo(x + r * .92, sy + r * .05, x + r * .78, sy + r * .1); c.quadraticCurveTo(x + r * .64, sy + r * .05, x + r * .78, sy - r * .2); fs(c, '#8fd3ff', 3); }
}

// ---------- people (v2: poster-print cast) ----------
const SKIN = ['#f2c49b', '#d9a072', '#a8714a', '#7a4b2e', '#f6d2b4'];
function hexMix(h, to, k) { const a = parseInt(h.slice(1), 16), b = parseInt(to.slice(1), 16); const m = (s) => Math.round(((a >> s) & 255) * (1 - k) + ((b >> s) & 255) * k); return '#' + ((1 << 24) | (m(16) << 16) | (m(8) << 8) | m(0)).toString(16).slice(1); }
const dk = (h, k = .25) => hexMix(h, '#1a0f14', k), lt = (h, k = .25) => hexMix(h, '#ffffff', k);
function tube(c, pts, w, col, ow = 4.5) { // outlined limb: outline pass then colour pass, round joins
  c.save(); c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]));
  c.lineWidth = w + ow * 2; c.strokeStyle = INK; c.stroke(); c.lineWidth = w; c.strokeStyle = col; c.stroke(); c.restore(); }
function bodyPath(c, sh = 66, wa = 52, hi = 64) { // shaped torso: shoulders -> waist -> hips; local y from -88 (neck) to 86 (hem)
  c.beginPath(); c.moveTo(-20, -90); c.bezierCurveTo(-52, -90, -sh, -70, -sh + 2, -30); c.bezierCurveTo(-sh + 4, 0, -wa, 20, -hi, 80); c.quadraticCurveTo(0, 96, hi, 80);
  c.bezierCurveTo(wa, 20, sh - 4, 0, sh - 2, -30); c.bezierCurveTo(sh, -70, 52, -90, 20, -90); c.quadraticCurveTo(0, -84, -20, -90); c.closePath(); }
function hand(c, x, y, skin, ang = 0) { c.save(); c.translate(x, y); c.rotate(ang); ell(c, 8, -8, 6, 9, skin, 3.2, .5); circ(c, 0, 0, 14, skin, 3.8); c.restore(); }
function shoe(c, x, y, dir, col) { c.save(); c.translate(x, y); c.scale(dir, 1); c.beginPath(); c.moveTo(-16, -22); c.lineTo(-14, -6); c.quadraticCurveTo(-18, 6, -8, 8); c.lineTo(26, 8); c.quadraticCurveTo(40, 6, 34, -6); c.quadraticCurveTo(24, -14, 8, -14); c.lineTo(6, -22); c.closePath(); fs(c, col, 4);
  c.beginPath(); c.moveTo(-10, 4); c.lineTo(34, 4); c.lineWidth = 5; c.strokeStyle = lt(col, .7); c.stroke(); c.restore(); }
function person(c, o) {
  const s = o.s || 1, t = o.t || 0, seed = o.seed || 1;
  c.save(); c.translate(o.x, o.y); c.scale(s * (o.flip ? -1 : 1), s);
  const skin = o.skin || SKIN[seed % SKIN.length], body = o.body || '#4a6fa5', pants = o.pants || dk(body, .55);
  const br = Math.sin(t * 2.3 + seed) * 2.2, pose = o.pose || 'idle';
  const slump = pose === 'slump' ? 16 : 0;
  const shift = o.walk ? 0 : Math.sin(t * .9 + seed * 2) * 4.5;          // weight shift
  const tilt = (o.tilt || 0) + Math.sin(t * 1.1 + seed) * .035 + (o.talk ? Math.sin(t * 7) * .02 : 0) + (o.expr === 'worried' ? -.07 : o.expr === 'smug' ? .06 : 0);
  shadow(c, shift * .6, 0, 84, .26);
  // legs: tapered trousers + real shoes
  const lk = o.walk ? Math.sin(t * 9 + seed) * 16 : 0;
  const hipX = shift * .5;
  tube(c, [[-20 + hipX, -100], [-24 - lk, -24]], 24, pants); tube(c, [[20 + hipX, -100], [24 + lk, -24]], 24, pants);
  shoe(c, -26 - lk, -6, -1, o.shoes || '#2f2630'); shoe(c, 26 + lk, -6, 1, o.shoes || '#2f2630');
  // hand targets by pose
  const sw = Math.sin(t * 2.3 + seed) * 4;
  const P = {
    idle: [[-70, -112 + sw], [70, -112 - sw]], hips: [[-56, -140], [56, -140]], armsUp: [[-78, -335 + br], [78, -335 + br]],
    point: [[-68, -112 + sw], [158, -238]], hold: [[-44, -158], [44, -158]], clipboard: [[-30, -150], [62, -170]],
    shrug: [[-118, -212], [118, -212]], wave: [[-70, -112], [112 + Math.sin(t * 8) * 18, -330]], slump: [[-42, -86], [42, -86]],
    cheer: [[-112, -330], [112, -330]], give: [[-70, -112], [120, -175]], holdUp: [[-70, -112 + sw], [86, -300]], phone: [[-70, -112], [40, -280]],
    holdHigh: [[-60, -300], [60, -300]], ladder: [[-60, -300], [70, -320]],
  }[pose] || [[-70, -112], [70, -112]];
  const hp = o.hands || P;
  const sleeve = o.sleeve || (o.coat ? '#f4f4f0' : body);
  const arm = (sx, h, side) => { const sy = -196 + slump; let e;
    if (pose === 'hips') e = [side * 108, -168]; else e = [lerp(sx, h[0], .5) + side * 16, lerp(sy, h[1], .5) + 14];
    c.save(); c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo(e[0], e[1], h[0], h[1]);
    c.lineWidth = 18 + 9; c.strokeStyle = INK; c.stroke(); c.lineWidth = 18; c.strokeStyle = sleeve; c.stroke(); c.restore(); };
  const farArm = o.flip ? 1 : 0; // draw the right arm behind the torso when the item sits front
  // torso
  c.save(); c.translate(shift * .5, -160 + slump * .5); c.scale(1, 1 + br * .005);
  bodyPath(c); fs(c, body);
  c.save(); bodyPath(c); c.clip();
  c.fillStyle = dk(body, .28); c.globalAlpha = .55; c.beginPath(); c.moveTo(18, -100); c.lineTo(80, -100); c.lineTo(80, 110); c.lineTo(34, 110); c.quadraticCurveTo(48, 0, 18, -100); c.fill(); c.globalAlpha = 1; // one-side shade
  c.fillStyle = lt(body, .35); c.globalAlpha = .5; c.beginPath(); c.moveTo(-60, -74); c.quadraticCurveTo(-64, -20, -58, 30); c.lineTo(-48, 30); c.quadraticCurveTo(-54, -20, -50, -74); c.fill(); c.globalAlpha = 1; // rim light
  if (o.stripes) { for (let i = -70; i < 70; i += 28) { c.fillStyle = '#23202a'; c.fillRect(i, -100, 13, 200); } }
  if (o.suit) { c.fillStyle = o.shirt || '#f3efe6'; c.beginPath(); c.moveTo(-24, -92); c.lineTo(0, -20); c.lineTo(24, -92); c.fill(); }
  if (o.coat) { c.fillStyle = '#f4f2ec'; c.fillRect(-80, -100, 160, 220); }
  c.restore();
  bodyPath(c); fs(c, null);
  const lapel = dk(body, .35);
  if (o.suit) { // lapels, shirt, tie, buttons, pocket square
    poly(c, [[-26, -90], [-2, -22], [-36, -30], [-52, -76]], lapel, 3.5); poly(c, [[26, -90], [2, -22], [36, -30], [52, -76]], lapel, 3.5);
    if (o.tie) { poly(c, [[-8, -84], [8, -84], [6, -70], [13, -34], [0, -18], [-13, -34], [-6, -70]], o.tie, 3.2); }
    circ(c, 6, 20, 4, dk(body, .6), 2); circ(c, 6, 50, 4, dk(body, .6), 2); line(c, 0, -22, 0, 90, 3, dk(body, .5));
    poly(c, [[-48, -30], [-30, -32], [-31, -22], [-48, -20]], o.tie || '#d33', 2.5);
  }
  if (o.coat) { poly(c, [[-26, -90], [-2, -30], [-32, -42], [-48, -80]], '#e4e1d8', 3.5); poly(c, [[26, -90], [2, -30], [32, -42], [48, -80]], '#e4e1d8', 3.5); line(c, 0, -30, 0, 92, 3.5);
    box(c, -50, 20, 34, 38, 4, '#f4f2ec', 3); line(c, -40, 16, -40, 34, 4, o.tie || '#1d4ed8'); if (o.tie) poly(c, [[-6, -34], [6, -34], [8, 0], [0, 10], [-8, 0]], o.tie, 3); }
  if (o.hoodie) { // pocket, drawstrings, hood opening
    c.beginPath(); c.moveTo(-40, 22); c.lineTo(40, 22); c.lineTo(48, 66); c.lineTo(-48, 66); c.closePath(); fs(c, dk(body, .12), 3.5); line(c, -12, 22, -22, 4, 3.2);
    c.beginPath(); c.ellipse(0, -86, 30, 14, 0, 0, Math.PI); fs(c, dk(body, .3), 3.5); line(c, -10, -76, -13, -44, 3.6, '#f4f1ea'); line(c, 10, -76, 13, -44, 3.6, '#f4f1ea'); circ(c, -13, -42, 3.5, '#f4f1ea', 2.5); circ(c, 13, -42, 3.5, '#f4f1ea', 2.5); }
  if (o.tie && !o.suit && !o.coat) poly(c, [[-7, -84], [7, -84], [10, -36], [0, -24], [-10, -36]], o.tie, 3);
  if (o.cap && !o.suit && !o.hoodie) { poly(c, [[-26, -92], [0, -64], [26, -92], [14, -94], [0, -80], [-14, -94]], dk(body, .25), 3.2); } // polo collar
  if (o.badge) { let bf = 15; c.font = '700 15px Kalam'; while (c.measureText(o.badge).width > 78 && bf > 9) { bf--; c.font = `700 ${bf}px Kalam`; } const bw = c.measureText(o.badge).width + 14; box(c, 56 - bw, -54, bw, 28, 6, '#fff', 3); box(c, 56 - bw, -54, bw, 8, 3, o.tie || '#e8553c', 0); c.fillStyle = INK; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(o.badge, 56 - bw / 2, -34); }
  if (o.tag) { label(c, o.tag, 0, 10, 22, '#fff', { maxW: 110 }); }
  c.restore();
  // arms (in front of torso)
  arm(-52 + shift * .5, hp[0], -1); arm(52 + shift * .5, hp[1], 1);
  // neck
  const hy = -300 + slump + br * .4, hx = (o.lean || 0) + shift * .7;
  box(c, hx - 14 + (hx * -.2), hy + 38, 28, 44, 8, dk(skin, .12), 3.8);
  // head group (tilts about the neck)
  c.save(); c.translate(hx, hy + 52); c.rotate(tilt); c.translate(-hx, -(hy + 52));
  if (o.hoodie) ell(c, hx, hy + 60, 52, 28, dk(body, .2), 4);
  // ears
  circ(c, hx - 58, hy + 6, 12, skin, 3.8); circ(c, hx + 58, hy + 6, 12, dk(skin, .1), 3.8);
  // head: slightly egg-shaped with one-side shade
  const head = () => { c.beginPath(); c.ellipse(hx, hy + 2, 60, 63, 0, 0, TAU); };
  head(); fs(c, skin);
  c.save(); head(); c.clip(); c.globalAlpha = .2; circ(c, hx + 44, hy + 14, 54, '#5a2a10', 0); c.globalAlpha = .5; c.fillStyle = lt(skin, .5); c.beginPath(); c.ellipse(hx - 36, hy - 14, 7, 15, .4, 0, TAU); c.fill();
  c.globalAlpha = .26; ell(c, hx - 34, hy + 26, 14, 8, '#e0586a', 0); ell(c, hx + 34, hy + 26, 14, 8, '#e0586a', 0); c.restore();
  head(); fs(c, null);
  const hc = o.hairCol || '#3a2a22', hair = o.hair || 'short', hl = lt(hc, .3);
  const hairBlob = (fn) => { c.beginPath(); fn(); fs(c, hc, 4.2); };
  if (hair === 'short') { hairBlob(() => { c.moveTo(hx - 62, hy + 2); c.bezierCurveTo(hx - 70, hy - 66, hx + 20, hy - 84, hx + 62, hy - 24); c.bezierCurveTo(hx + 66, hy - 4, hx + 60, hy + 4, hx + 58, hy + 2); c.bezierCurveTo(hx + 50, hy - 36, hx + 10, hy - 40, hx - 20, hy - 28); c.bezierCurveTo(hx - 40, hy - 20, hx - 56, hy - 10, hx - 62, hy + 2); }); c.beginPath(); c.moveTo(hx - 34, hy - 56); c.quadraticCurveTo(hx - 6, hy - 70, hx + 20, hy - 62); c.lineWidth = 5; c.strokeStyle = hl; c.stroke(); }
  if (hair === 'grey') { hairBlob(() => { c.moveTo(hx - 62, hy - 2); c.bezierCurveTo(hx - 82, hy - 34, hx - 60, hy - 52, hx - 42, hy - 34); c.bezierCurveTo(hx - 54, hy - 20, hx - 54, hy - 8, hx - 54, hy + 6); c.closePath(); }); hairBlob(() => { c.moveTo(hx + 62, hy - 2); c.bezierCurveTo(hx + 82, hy - 34, hx + 60, hy - 52, hx + 42, hy - 34); c.bezierCurveTo(hx + 54, hy - 20, hx + 54, hy - 8, hx + 54, hy + 6); c.closePath(); }); }
  if (hair === 'slick') { hairBlob(() => { c.moveTo(hx - 62, hy); c.bezierCurveTo(hx - 66, hy - 70, hx + 30, hy - 92, hx + 64, hy - 14); c.quadraticCurveTo(hx + 50, hy - 40, hx + 6, hy - 38); c.quadraticCurveTo(hx - 40, hy - 36, hx - 62, hy); }); c.beginPath(); c.moveTo(hx - 30, hy - 60); c.quadraticCurveTo(hx + 6, hy - 78, hx + 40, hy - 56); c.lineWidth = 5; c.strokeStyle = '#4a4a58'; c.stroke(); }
  if (hair === 'bun') { circ(c, hx, hy - 78, 24, hc, 4.2); hairBlob(() => { c.moveTo(hx - 63, hy + 6); c.bezierCurveTo(hx - 72, hy - 70, hx + 72, hy - 70, hx + 63, hy + 6); c.bezierCurveTo(hx + 56, hy - 26, hx + 20, hy - 38, hx, hy - 34); c.bezierCurveTo(hx - 20, hy - 38, hx - 56, hy - 26, hx - 63, hy + 6); }); c.beginPath(); c.arc(hx - 4, hy - 80, 12, 3.6, 5.4); c.lineWidth = 4.5; c.strokeStyle = hl; c.stroke(); }
  if (hair === 'long') { hairBlob(() => { c.moveTo(hx - 64, hy + 54); c.bezierCurveTo(hx - 92, hy - 80, hx + 92, hy - 80, hx + 64, hy + 54); c.quadraticCurveTo(hx + 56, hy - 14, hx, hy - 30); c.quadraticCurveTo(hx - 56, hy - 14, hx - 64, hy + 54); }); }
  if (hair === 'curly') { for (let a = Math.PI * .96; a <= Math.PI * 2.04; a += .3) circ(c, hx + Math.cos(a) * 54, hy - 2 + Math.sin(a) * 58, 19, hc, 3.8); for (let a = Math.PI * 1.1; a <= Math.PI * 1.9; a += .45) circ(c, hx + Math.cos(a) * 42, hy - 10 + Math.sin(a) * 46, 14, hl, 0); }
  face(c, hx, hy, 60, o.expr || 'neutral', t, { seed, skin, sweat: o.sweat, talk: o.talk, look: o.look });
  if (o.glasses) { c.lineWidth = 4; c.strokeStyle = INK; c.beginPath(); c.roundRect(hx - 42, hy - 20, 34, 28, 9); c.moveTo(hx + 8, hy - 20); c.roundRect(hx + 8, hy - 20, 34, 28, 9); c.moveTo(hx - 8, hy - 8); c.lineTo(hx + 8, hy - 8); c.stroke(); c.save(); c.globalAlpha = .22; c.fillStyle = '#bfe3ff'; c.beginPath(); c.roundRect(hx - 42, hy - 20, 34, 28, 9); c.roundRect(hx + 8, hy - 20, 34, 28, 9); c.fill(); c.restore(); }
  if (o.cap) { c.beginPath(); c.moveTo(hx - 63, hy - 6); c.bezierCurveTo(hx - 66, hy - 80, hx + 66, hy - 80, hx + 63, hy - 6); c.quadraticCurveTo(hx, hy - 22, hx - 63, hy - 6); fs(c, o.cap, 4.2); c.beginPath(); c.moveTo(hx + 4, hy - 14); c.quadraticCurveTo(hx + 64, hy - 28, hx + 84, hy - 10); c.quadraticCurveTo(hx + 56, hy - 4, hx + 8, hy - 2); c.closePath(); fs(c, dk(o.cap, .2), 4.2); circ(c, hx, hy - 64, 5, dk(o.cap, .35), 0); }
  if (o.chef) { circ(c, hx - 30, hy - 84, 30, '#fff', 4); circ(c, hx + 30, hy - 84, 30, '#fff', 4); circ(c, hx, hy - 100, 34, '#fff', 4); box(c, hx - 46, hy - 80, 92, 40, 6, '#fff', 4); }
  if (o.hat === 'party') poly(c, [[hx - 26, hy - 52], [hx + 26, hy - 52], [hx + 4, hy - 130]], '#ff6fb1', 4);
  c.restore(); // head group
  reg(c, -78, o.chef ? -440 : (o.hat ? -435 : -380), 78, 6);
  if (o.item) o.item(c, hp, t);
  hand(c, hp[0][0], hp[0][1], skin, -.4); hand(c, hp[1][0], hp[1][1], skin, .4);
  c.restore();
  const k = s, fx = o.flip ? -1 : 1;
  return { lh: [o.x + hp[0][0] * k * fx, o.y + hp[0][1] * k], rh: [o.x + hp[1][0] * k * fx, o.y + hp[1][1] * k], head: [o.x + hx * k * fx, o.y + hy * k] };
}
// named cast
const CAST = {
  exec: { body: '#6b7280', suit: true, tie: '#b91c1c', glasses: true, hair: 'grey', badge: 'TAKE-TWO', seed: 3, skin: '#f2c49b' },
  clerk: { body: '#2f9e6b', cap: '#e8553c', badge: 'STAFF', seed: 5, skin: '#a8714a', hair: 'none' },
  critic: { body: '#7c4dbd', glasses: true, hair: 'bun', hairCol: '#5a3a2a', seed: 7, skin: '#f6d2b4' },
  trader: { body: '#141418', suit: true, tie: '#141418', shirt: '#dde', hair: 'slick', seed: 11, skin: '#d9a072' },
  fan: { body: '#e8553c', hoodie: true, hair: 'curly', hairCol: '#2a1a12', seed: 2, skin: '#d9a072' },
  investor: { body: '#3a5f8f', suit: true, tie: '#e0b93a', hair: 'short', seed: 4 },
  baker: { body: '#f4f4f0', hair: 'none', chef: true, seed: 8, skin: '#f2c49b' },
  oldtrader: { body: '#7a5c3a', suit: true, tie: '#2c5', glasses: true, hair: 'grey', seed: 9, skin: '#f6d2b4' },
  analyst: { body: '#f3efe6', tie: '#1d4ed8', suit: false, hair: 'short', hairCol: '#111', seed: 12, skin: '#7a4b2e' },
  ref: { body: '#fff', stripes: true, cap: '#111', seed: 13, hair: 'none' },
  mail: { body: '#2c4f86', cap: '#2c4f86', badge: 'MAIL', seed: 14, skin: '#a8714a', hair: 'none' },
  gamer: { body: '#2e7d5b', hoodie: true, hair: 'short', hairCol: '#5a3a1a', seed: 15, skin: '#f2c49b' },
};
function P(name, o) { return person(window.__c, { ...CAST[name], ...o }); }

// ---------- props ----------
function gameBox(c, x, y, w, h, o = {}) { // centered at x, bottom at y
  c.save(); c.translate(x, y); if (o.rot) c.rotate(o.rot);
  const d = w * .14; reg(c, -w / 2, -h - d * .6, w / 2 + d, 0);
  poly(c, [[w / 2, -h], [w / 2 + d, -h - d * .6], [w / 2 + d, -d * .6], [w / 2, 0]], '#0d1b2a');
  poly(c, [[-w / 2, -h], [-w / 2 + d, -h - d * .6], [w / 2 + d, -h - d * .6], [w / 2, -h]], '#1d3557');
  box(c, -w / 2, -h, w, h, 6, '#0f2f4f');
  // generic sunset art: gradient + palm-free abstract sun & stripes (no game art)
  c.save(); rr(c, -w / 2 + w * .07, -h + h * .06, w * .86, h * .66, 6); c.clip();
  const pal = o.pal || (String(o.title).trim() === 'GTA V' ? ['#4fb3c7', '#bfe8a8'] : ['#ff6fb1', '#ffb347']); const g = c.createLinearGradient(0, -h, 0, -h * .3); g.addColorStop(0, pal[0]); g.addColorStop(1, pal[1]); c.fillStyle = g; c.fillRect(-w, -h, w * 2, h);
  circ(c, 0, -h * .52, w * .22, '#ffe66d', 0); c.fillStyle = 'rgba(80,20,90,.55)'; for (let i = 0; i < 5; i++) c.fillRect(-w, -h * .52 + i * h * .045, w * 2, h * .018);
  c.fillStyle = '#3b1f5c'; c.fillRect(-w, -h * .42, w * 2, h * .2); c.restore();
  rr(c, -w / 2 + w * .07, -h + h * .06, w * .86, h * .66, 6); fs(c, null, 3.5);
  label(c, o.title || 'GTA VI', 0, -h * .17, w * .3, '#fff', { maxW: w * .8 });
  if (o.price) { box(c, w * .2, -h * .98, w * .42, h * .14, 8, '#fff59d', 3.5); label(c, o.price, w * .41, -h * .91, h * .08, INK, { stroke: false, maxW: w * .38 }); }
  if (o.face) face(c, 0, -h * .5, w * .32, o.face, o.t || 0, { noNose: true, seed: 6, skin: '#ffd24a' });
  c.restore();
}
function counter(c, x, y, w, h, text, kind = 'gold', o = {}) {
  reg(c, x - w / 2, y - h / 2, x + w / 2, y + h / 2 + (o.cap ? 52 : 0));
  box(c, x - w / 2, y - h / 2, w, h, 16, o.bg || '#141b26');
  rr(c, x - w / 2 + 10, y - h / 2 + 10, w - 20, h - 20, 10); fs(c, o.inner || '#0a0f16', 3);
  money(c, text, x, y, h * .56, kind, { maxW: w - 50 });
  if (o.cap) label(c, o.cap, x, y + h / 2 + 30, 34, '#fff', { maxW: w });
}
function fmtMoney(v, unit) { // unit: 'B','M'
  if (unit === 'B') return '$' + v.toFixed(2) + 'B';
  if (unit === 'M') return '$' + Math.round(v) + 'M';
  return '$' + Math.round(v).toLocaleString('en-US');
}
function calendar(c, x, y, w, h, top, big, o = {}) {
  reg(c, x - w / 2, y - h / 2 - 16, x + w / 2, y + h / 2);
  box(c, x - w / 2, y - h / 2, w, h, 12, '#fff');
  c.save(); rr(c, x - w / 2, y - h / 2, w, h * .28, [12, 12, 0, 0]); c.fillStyle = o.col || '#e53935'; c.fill(); c.restore();
  rr(c, x - w / 2, y - h / 2, w, h, 12); fs(c, null);
  line(c, x - w / 2, y - h / 2 + h * .28, x + w / 2, y - h / 2 + h * .28, 3.5);
  [-w * .25, w * .25].forEach(d => { box(c, x + d - 6, y - h / 2 - 16, 12, 30, 5, '#bbb', 3); });
  label(c, top, x, y - h / 2 + h * .14, h * .15, '#fff', { maxW: w * .85 });
  label(c, big, x, y + h * .14, h * .34, INK, { stroke: false, maxW: w * .85 });
  if (o.circle) { c.save(); c.lineWidth = 7; c.strokeStyle = RED; c.beginPath(); c.ellipse(x, y + h * .14, w * .42, h * .27, -.1, 0, TAU * clamp(o.circle)); c.stroke(); c.restore(); }
  if (o.tick) { c.save(); c.lineWidth = 14; c.strokeStyle = '#1faa55'; c.lineCap = 'round'; c.beginPath(); c.moveTo(x + w * .2, y + h * .2); c.lineTo(x + w * .32, y + h * .32); c.lineTo(x + w * .58, y - h * .05); c.stroke(); c.restore(); }
}
function clock(c, x, y, r, hh, mm, o = {}) {
  circ(c, x, y, r, o.face || '#fffdf3');
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; line(c, x + Math.cos(a) * r * .8, y + Math.sin(a) * r * .8, x + Math.cos(a) * r * .9, y + Math.sin(a) * r * .9, 3); }
  const ma = (mm / 60) * TAU - Math.PI / 2, ha = ((hh % 12) / 12 + mm / 720) * TAU - Math.PI / 2;
  line(c, x, y, x + Math.cos(ha) * r * .5, y + Math.sin(ha) * r * .5, 7); line(c, x, y, x + Math.cos(ma) * r * .75, y + Math.sin(ma) * r * .75, 5);
  circ(c, x, y, 6, INK, 0);
  if (o.label) label(c, o.label, x, y + r + 26, 28, '#fff');
}
function cornerClock(c, hh, mm, txt) { // screen-space clock in the corner (drawn after camera)
  box(c, 1600, 40, 280, 120, 18, 'rgba(20,20,30,.85)');
  clock(c, 1660, 100, 44, hh, mm);
  label(c, txt, 1790, 100, 40, '#fff', { maxW: 160 });
}
function clipboard(c, x, y, w, h, lines_, o = {}) {
  c.save(); c.translate(x, y); if (o.rot) c.rotate(o.rot);
  reg(c, -w / 2, -h / 2 - 8, w / 2, h / 2);
  box(c, -w / 2, -h / 2, w, h, 10, '#b07a45'); box(c, -w / 2 + 10, -h / 2 + 18, w - 20, h - 28, 4, '#fff', 3);
  box(c, -w * .18, -h / 2 - 8, w * .36, 26, 6, '#9aa0a6', 3.5);
  const n = lines_.length, lh = (h - 50) / Math.max(n, 2.6);
  lines_.forEach((s, i) => label(c, s, 0, -h / 2 + 40 + lh * (i + .5), Math.min(lh * .62, o.size || 60), o.col && o.col[i] || INK, { stroke: false, maxW: w - 44 }));
  c.restore();
}
function sign(c, x, y, w, h, text, o = {}) { // hanging / standing board
  if (o.post) { line(c, x, y + h / 2, x, y + h / 2 + o.post, 10); }
  if (o.hang) { line(c, x - w * .3, y - h / 2, x - w * .3, y - h / 2 - o.hang, 3); line(c, x + w * .3, y - h / 2, x + w * .3, y - h / 2 - o.hang, 3); }
  if (w >= 150) reg(c, x - w / 2, y - h / 2, x + w / 2, y + h / 2);
  box(c, x - w / 2, y - h / 2, w, h, o.r || 12, o.bg || '#fff8e1');
  label(c, text, x, y, o.size || h * .5, o.fg || INK, { stroke: o.fg && o.fg !== INK ? true : false, maxW: w - 30, glow: o.glow });
}
function coin(c, x, y, r, o = {}) { ell(c, x, y + r * .12, r, r * .98, '#c9971a'); ell(c, x, y, r, r * .95, GOLD); ell(c, x, y, r * .68, r * .64, null, 3); label(c, o.t || '$', x, y, r * .9, '#c9971a', { stroke: false }); }
function coinPile(c, x, y, w, h, seed = 1) {
  const R = rand(seed);
  c.beginPath(); c.moveTo(x - w / 2, y); c.quadraticCurveTo(x - w * .2, y - h * 1.15, x, y - h); c.quadraticCurveTo(x + w * .2, y - h * 1.15, x + w / 2, y); c.closePath(); fs(c, '#e8b62c');
  for (let i = 0; i < 26; i++) { const u = R() * 2 - 1, v = R(); const cx = x + u * w * .42 * (1 - v * .7), cy = y - v * h * .85 - 10; ell(c, cx, cy, 20, 12, GOLD, 3); }
}
function bill(c, x, y, s = 1, rot = 0, o = {}) { // dollar bill, optional legs + face
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  if (o.legs) { const k = Math.sin((o.t || 0) * 10 + (o.seed || 0)) * 10; line(c, -16, 30, -20 - k, 70, 7); line(c, 16, 30, 20 + k, 70, 7); ell(c, -24 - k, 72, 12, 6, INK, 0); ell(c, 24 + k, 72, 12, 6, INK, 0); }
  box(c, -60, -32, 120, 64, 8, '#8fd18a'); ell(c, 0, 0, 26, 22, '#b9e6b3', 3);
  if (o.face) face(c, 0, 0, 24, o.face, o.t || 0, { noNose: true, seed: o.seed || 2 }); else label(c, '$', 0, 0, 34, '#3d8b3d', { stroke: false });
  c.restore();
}
function balloon(c, x, y, r, col, txt, o = {}) { // y = balloon centre; string down
  const sq = o.squash || 1;
  c.beginPath(); c.moveTo(x, y + r * sq); c.quadraticCurveTo(x + (o.sway || 0), y + r * 1.8, x + (o.sway || 0) * .5, o.strY || y + r * 3); c.lineWidth = 3; c.strokeStyle = INK; c.stroke();
  ell(c, x, y, r * (o.wide || 1), r * sq, col); poly(c, [[x - 10, y + r * sq + 12], [x + 10, y + r * sq + 12], [x, y + r * sq - 2]], col, 3.5);
  c.save(); c.globalAlpha = .35; ell(c, x - r * .35, y - r * .4 * sq, r * .18, r * .3 * sq, '#fff', 0); c.restore();
  if (txt) label(c, txt, x, y, r * .38, '#fff', { maxW: r * 1.6 });
}
function pigeon(c, x, y, s = 1, t = 0, flip = false) {
  c.save(); c.translate(x, y); c.scale(flip ? -s : s, s); const b = Math.abs(Math.sin(t * 3 + x)) * 4;
  ell(c, 0, -18, 26, 18, '#9aa3b5'); circ(c, 20, -36 - b, 12, '#9aa3b5'); poly(c, [[30, -38 - b], [40, -34 - b], [30, -32 - b]], '#f5a623', 2.5); circ(c, 23, -39 - b, 2.5, INK, 0); line(c, -4, -2, -4, 4, 3); line(c, 6, -2, 6, 4, 3);
  c.restore();
}
function plant(c, x, y, s = 1) { c.save(); c.translate(x, y); c.scale(s, s); [[-30, -110, -.5], [0, -130, 0], [30, -110, .5], [-18, -80, -.9], [18, -80, .9]].forEach(([dx, dy, r]) => ell(c, dx * .7, dy * .7 - 20, 18, 46, '#3f9b5a', 4, r)); poly(c, [[-36, -40], [36, -40], [26, 0], [-26, 0]], '#c1683c'); c.restore(); }
function windowRect(c, x, y, w, h, lit = '#bfe3ff', o = {}) { box(c, x, y, w, h, 4, lit, 3.5); c.save(); c.globalAlpha = .35; c.fillStyle = '#fff'; c.beginPath(); c.moveTo(x + 5, y + h - 5); c.lineTo(x + w * .45, y + 5); c.lineTo(x + w * .62, y + 5); c.lineTo(x + w * .2, y + h - 5); c.fill(); c.restore(); if (w > 120) { box(c, x - 10, y + h, w + 20, 12, 3, '#efe6d2', 3.5); } line(c, x + w / 2, y, x + w / 2, y + h, 3); line(c, x, y + h / 2, x + w, y + h / 2, 3); if (o.glow) lightPool(c, x + w / 2, y + h / 2, w, lit, .25); }
function cloud(c, x, y, s = 1, col = '#fff') { c.save(); c.translate(x, y); c.scale(s, s); c.beginPath(); c.arc(-50, 0, 34, Math.PI * .5, Math.PI * 1.5); c.arc(-10, -26, 40, Math.PI, 0); c.arc(40, -6, 34, Math.PI * 1.3, Math.PI * .5); c.closePath(); fs(c, col, 4); c.restore(); }
function tree(c, x, y, s = 1) { c.save(); c.translate(x, y); c.scale(s, s); box(c, -10, -110, 20, 110, 6, '#8b5a3c'); circ(c, 0, -150, 62, '#4caf63'); circ(c, -40, -120, 40, '#43a05a'); circ(c, 42, -118, 40, '#43a05a'); c.restore(); }
function lamp(c, x, y, h = 300, on = false) { line(c, x, y, x, y - h, 9); line(c, x, y - h, x + 50, y - h, 9); poly(c, [[x + 32, y - h], [x + 70, y - h], [x + 62, y - h + 24], [x + 40, y - h + 24]], on ? '#ffe9a0' : '#cfd6dd', 3.5); if (on) lightPool(c, x + 51, y - h + 30, 220, '#ffe7a0', .35); }
function desk(c, x, y, w = 360, o = {}) { box(c, x - w / 2, y - 18, w, 22, 6, o.col || '#8a5a3b'); line(c, x - w / 2 + 24, y + 4, x - w / 2 + 24, y + 110, 9); line(c, x + w / 2 - 24, y + 4, x + w / 2 - 24, y + 110, 9); }
function monitor(c, x, y, w, h, col = '#0e2a1e', o = {}) { box(c, x - w / 2, y - h, w, h, 8, '#20242c'); rr(c, x - w / 2 + 8, y - h + 8, w - 16, h - 16, 4); fs(c, col, 2.5); line(c, x, y, x, y + 18, 8); line(c, x - 26, y + 20, x + 26, y + 20, 8); if (o.graph) { c.save(); c.beginPath(); for (let i = 0; i <= 8; i++) { const gx = x - w / 2 + 16 + i * (w - 32) / 8, gy = y - h / 2 + Math.sin(i * 1.7 + (o.seed || 0)) * h * .15 + (o.down ? i * h * .04 - h * .15 : -i * h * .03 + h * .1); i ? c.lineTo(gx, gy) : c.moveTo(gx, gy); } c.lineWidth = 4; c.strokeStyle = o.down ? RED : GREEN; c.stroke(); c.restore(); } }
function paperSheet(c, x, y, rot = 0, s = 1) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); box(c, -30, -40, 60, 80, 4, '#fbfbf5', 3); for (let i = 0; i < 4; i++) line(c, -18, -22 + i * 14, 18, -22 + i * 14, 2.5, '#9aa'); c.restore(); }
function stamp(c, x, y, txt, p, col = RED, o = {}) { // p: 0..1 slam progress
  reg(c, x - (o.w || 300) * .6, y - (o.h || 90) * .8, x + (o.w || 300) * .6, y + (o.h || 90) * .8);
  if (p <= 0) return; const s = p < .25 ? lerp(2.2, 1, p / .25) : 1; c.save(); c.translate(x, y); c.rotate(o.rot ?? -.14); c.scale(s, s); c.globalAlpha = clamp(p * 4);
  rr(c, -o.w / 2 || -150, -(o.h || 90) / 2, o.w || 300, o.h || 90, 14); c.lineWidth = 9; c.strokeStyle = col; c.stroke();
  label(c, txt, 0, 2, (o.h || 90) * .62, col, { stroke: false, maxW: (o.w || 300) - 30 }); c.restore();
}
function arrow(c, x1, y1, x2, y2, col = RED, w = 26) { const a = Math.atan2(y2 - y1, x2 - x1), L = Math.hypot(x2 - x1, y2 - y1); c.save(); c.translate(x1, y1); c.rotate(a); poly(c, [[0, -w / 2], [L - w * 1.4, -w / 2], [L - w * 1.4, -w * 1.2], [L, 0], [L - w * 1.4, w * 1.2], [L - w * 1.4, w / 2], [0, w / 2]], col); c.restore(); }
function crowd(c, x, y, w, rows, s, t, seed = 1, o = {}) { // tiny people heads/bodies
  const R = rand(seed); const cols = ['#e8553c', '#3a7bd5', '#f2b134', '#5ab65a', '#9b59b6', '#e67e22', '#16a085', '#d35400', '#2c3e50'];
  for (let r = 0; r < rows; r++) { const n = Math.floor(w / (46 * s)); for (let i = 0; i < n; i++) {
    const px = x - w / 2 + (i + .5 + (r % 2) * .5) * (w / n) + (R() - .5) * 10, py = y + r * 40 * s; const bob = o.cheer ? Math.abs(Math.sin(t * 6 + i + r)) * 10 * s : Math.sin(t * 2 + i) * 1.5;
    const col = cols[Math.floor(R() * cols.length)], sk = SKIN[Math.floor(R() * SKIN.length)];
    ell(c, px, py - 26 * s - bob, 19 * s, 26 * s, col, 3); circ(c, px, py - 64 * s - bob, 15 * s, sk, 3);
    if (o.cheer && (i + r) % 3 === 0) { line(c, px - 14 * s, py - 44 * s - bob, px - 24 * s, py - 84 * s - bob, 4); line(c, px + 14 * s, py - 44 * s - bob, px + 24 * s, py - 84 * s - bob, 4); }
    if (o.faces) { circ(c, px - 5 * s, py - 66 * s - bob, 2.2 * s, INK, 0); circ(c, px + 5 * s, py - 66 * s - bob, 2.2 * s, INK, 0); }
  } }
}
function consoleBox(c, x, y, s, name, expr, t, col = '#1b1f2a', seed = 1) { // talking console box, bottom at y
  c.save(); c.translate(x, y); c.scale(s, s); reg(c, -82, -232, 82, 4);
  shadow(c, 0, 0, 90);
  line(c, -40, -10, -40, 0, 9); line(c, 40, -10, 40, 0, 9); ell(c, -46, 0, 18, 8, INK, 0); ell(c, 46, 0, 18, 8, INK, 0);
  box(c, -80, -230, 160, 220, 22, col); box(c, -64, -60, 128, 14, 6, '#3d4659', 3);
  box(c, -62, -212, 124, 128, 14, '#e8eef7', 3.5);
  face(c, 0, -148, 50, expr, t, { noNose: true, seed, skin: '#e8eef7' });
  label(c, name, 0, -30, 26, '#fff', { maxW: 140 }); c.restore();
}
