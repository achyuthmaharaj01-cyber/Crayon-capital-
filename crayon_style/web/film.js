// ---------- film: word cues, shot timeline, camera, compositor (transitions live in transitions.js) ----------
const LINES = {}; VO.lines.forEach(l => LINES[l.id] = l);
const normW = s => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
const MISSING = new Set();
// time of the n-th occurrence of `word` in line `id` (+ offset). Every cut and beat is keyed to a spoken word.
function cue(id, word, n = 0, off = 0) {
  const ws = LINES[id].words, k = normW(word); let m = 0;
  for (const w of ws) if (normW(w.w) === k || (k.length > 3 && normW(w.w).startsWith(k))) { if (m++ === n) return w.s + off; }
  MISSING.add(id + ':' + word); return LINES[id].s + off;
}
const SHOTS = []; // {key, at, set(c,T), cams:[[t,x,y,z]], out:{type,d,...}, sub, seed}
function shot(def) { SHOTS.push(def); }
function resolve() {
  SHOTS.forEach((s, i) => { s.start = s.at; s.end = i < SHOTS.length - 1 ? SHOTS[i + 1].at : VO.duration; s.i = i; s.seed = i + 1; });
}
// ---- camera: keyed framings eased together + a constant slow push and drift (no frame is ever static)
function camNat(s, t) {
  const K = s.cams || [[s.start, 960, 540, 1]];
  let x, y, z;
  if (t <= K[0][0]) [, x, y, z] = K[0];
  else if (t >= K[K.length - 1][0]) [, x, y, z] = K[K.length - 1];
  else for (let i = 0; i < K.length - 1; i++) if (t >= K[i][0] && t < K[i + 1][0]) {
    const a = K[i], b = K[i + 1], dur = b[4] ?? Math.min(1.1, b[0] - a[0]), u = ease((t - (b[0] - dur)) / dur);
    x = lerp(a[1], b[1], u); y = lerp(a[2], b[2], u); z = lerp(a[3], b[3], u); break;
  }
  const lt = t - s.start; const push = s.push ?? .012; // per second
  return { x: x + (s.drift ?? 6) * lt, y, z: z * (1 + push * lt) };
}
function clampCam(cam) { const hw = W / 2 / cam.z, hh = H / 2 / cam.z; return { x: clamp(cam.x, hw - BLEED * .9, W - hw + BLEED * .9), y: clamp(cam.y, hh - BLEED * .9, H - hh + BLEED * .9), z: Math.max(cam.z, .82) }; }
function frameOn(x, y, size, target = 380) { return { x, y, z: target / size }; }
function lerpCam(a, b, u) { // zoom interpolated in log space so zoom-throughs feel uniform
  return { x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), z: Math.exp(lerp(Math.log(a.z), Math.log(b.z), u)) };
}
// ---- offscreen buffers
const BUF = [0, 1, 2, 3, 4].map(() => { const b = document.createElement('canvas'); b.width = W; b.height = H; return b; });
function mkT(s, t) { const lt = t - s.start; return { t, lt, s, at: (tt, d = .5) => clamp((t - tt) / d), since: tt => t - tt }; }
function drawShot(buf, s, t, cam) {
  const c = buf.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
  c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
  cam = clampCam(cam); c.translate(W / 2, H / 2); c.scale(cam.z, cam.z); c.translate(-cam.x, -cam.y);
  if (s.custom) { c.setTransform(1, 0, 0, 1, 0, 0); s.custom(c, mkT(s, t), cam); } else s.set(c, mkT(s, t));
  c.setTransform(1, 0, 0, 1, 0, 0);
  if (s.overlay && !drawShot.bare) s.overlay(c, mkT(s, t), cam);
  finish(c, s.seed); return cam;
}
// render shot s with camera cam into a panel rect of canvas c (used by split screens and collages)
function panel(c, s, t, cam, x, y, w, h, o = {}) {
  const buf = BUF[o.buf ?? 3]; drawShot.bare = true; drawShot(buf, s, t, cam); drawShot.bare = false;
  c.save(); c.translate(x + w / 2, y + h / 2); c.rotate(o.rot || 0);
  if (o.photo) { c.shadowColor = 'rgba(0,0,0,.55)'; c.shadowBlur = 30; c.shadowOffsetY = 10; c.fillStyle = '#f3ecdc'; c.fillRect(-w / 2 - 14, -h / 2 - 14, w + 28, h + 28 + (o.caption ? 60 : 0)); c.shadowColor = 'transparent'; }
  const sw = W * h / H > w ? w * H / h : W, sh = sw * h / w; c.drawImage(buf, (W - sw) / 2, (H - sh) / 2, sw, sh, -w / 2, -h / 2, w, h);
  c.lineWidth = o.photo ? 3 : 8; c.strokeStyle = o.photo ? 'rgba(60,45,35,.6)' : '#f3ecdc'; c.strokeRect(-w / 2, -h / 2, w, h);
  if (o.caption) hand(c, o.caption, 0, h / 2 + 44, 50, INK, { shadow: false });
  c.restore();
}
function toScreen(cam, x, y) { cam = clampCam(cam); return [(x - cam.x) * cam.z + W / 2, (y - cam.y) * cam.z + H / 2]; }
function smear(c, img, dx, vx, alpha = 1) { // proper averaged smear: draw n copies at decreasing alpha 1/(k+1)
  const n = Math.max(1, Math.min(16, Math.ceil(Math.abs(vx) / 24)));
  c.globalAlpha = alpha; c.drawImage(img, dx - vx / 2, 0);
  for (let k = 1; k < n; k++) { c.globalAlpha = alpha / (k + 1); c.drawImage(img, dx - vx / 2 + vx * k / (n - 1), 0); }
  c.globalAlpha = 1;
}
const SFX = [];
// ---- the compositor
function render(t) {
  const c = document.getElementById('c').getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1;
  let i = SHOTS.findIndex(s => t >= s.start && t < s.end); if (i < 0) i = SHOTS.length - 1;
  // are we inside a transition window? (centred on a boundary)
  let tr = null;
  for (const [ai, bi] of [[i - 1, i], [i, i + 1]]) {
    const A = SHOTS[ai], B = SHOTS[bi]; if (!A || !B) continue; const o = A.out || { type: 'dissolve' }; const d = o.d || .7, b = A.end, t0 = b - d * (o.bias ?? .5);
    if (t >= t0 && t < t0 + d) tr = { A, B, o, u: (t - t0) / d, t0, t1: t0 + d };
  }
  if (!tr) { drawShot(BUF[0], SHOTS[i], t, camNat(SHOTS[i], t)); c.drawImage(BUF[0], 0, 0); }
  else composite(c, tr, t);
  // subtitles + cards live in screen space, above transitions
  subtitles(c, t);
  const end = SHOTS[SHOTS.length - 1]; if (end.irisEnd) { const [sx, sy] = toScreen(camNat(end, t), ...end.irisEnd.world); irisOut(c, t, { ...end.irisEnd, x: sx, y: sy }); }
  // fade in from black at the very top
  if (t < .5) { c.fillStyle = `rgba(0,0,0,${1 - smooth(t / .5)})`; c.fillRect(0, 0, W, H); }
}
function composite(c, tr, t) {
  const X = { ...tr, t, cA0: camNat(tr.A, tr.t0), cB1: camNat(tr.B, tr.t1) };
  (TRANS[tr.o.type] || TRANS.dissolve)(c, X); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.filter = 'none';
}
function irisOut(c, t, o) {
  if (t < o.t0) return; const u = clamp((t - o.t0) / o.d); const R = lerp(Math.hypot(W, H) / 2 + 40, 0, ease(u));
  c.save(); c.fillStyle = '#000'; c.beginPath(); c.rect(0, 0, W, H); c.arc(o.x, o.y, Math.max(0, R), 0, TAU, true); c.fill('evenodd'); c.restore();
  if (u >= 1) { c.fillStyle = '#000'; c.fillRect(0, 0, W, H); }
}
// ---- subtitles (bible §6): handwritten white, soft shadow; chunked at punctuation; per-shot height
const FIXW = { harlem: 'Haarlem,', peter: 'Pieter', '10': 'ten' };
const CHUNKS = (() => { const out = [];
  VO.lines.forEach(L => { let cur = [];
    const push = () => { if (cur.length) out.push({ s: cur[0].s, words: cur.map(w => w.w), line: L.id }); cur = []; };
    L.words.forEach((w, k) => { const n = normW(w.w); let txt = w.w; if (FIXW[n]) txt = FIXW[n] + (FIXW[n].endsWith(',') ? '' : w.w.replace(/^[A-Za-z0-9]+/, ''));
      cur.push({ ...w, w: txt }); if (/[.,?!]$/.test(w.w) && (cur.length >= 3 || /[.?!]$/.test(w.w)) || cur.length >= 8) push(); });
    push(); });
  out.forEach((ch, i) => { const L = LINES[ch.line]; const nx = out[i + 1]; ch.e = nx && nx.line === ch.line ? nx.s - .02 : Math.min(L.e + .35, nx ? nx.s - .05 : 1e9); });
  return out; })();
const SUBSKIP = []; // [t0,t1): chunks starting here are already on screen as a card
function subtitles(c, t) {
  const ch = CHUNKS.find(k => t >= k.s - .05 && t < k.e); if (!ch) return; if (SUBSKIP.some(([a, b]) => ch.s >= a && ch.s < b)) return;
  const s = SHOTS.find(x => t >= x.start && t < x.end) || SHOTS[0]; const y = s.subY ?? 968;
  const a = smooth((t - ch.s + .05) / .14) * (1 - smooth((t - ch.e + .12) / .12));
  c.save(); c.globalAlpha = a; hand(c, ch.words.join(' '), W / 2, y + (1 - a) * 6, 60, '#fbf8ef', { stroke: 7, strokeCol: 'rgba(22,16,22,.82)' }); c.restore();
}
window.frameJPG = (i, q = .92) => { render(i / FPS); return document.getElementById('c').toDataURL('image/jpeg', q); };
window.frameAt = t => render(t);
