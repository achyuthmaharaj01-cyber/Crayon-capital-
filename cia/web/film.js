// ---------- film: word cues, shot timeline, camera, transition compositor (bible §7: no hard cuts) ----------
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
  SHOTS.sort((a, b) => a.at - b.at);
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
const BUF = [0, 1, 2].map(() => { const b = document.createElement('canvas'); b.width = W; b.height = H; return b; });
function mkT(s, t) { const lt = t - s.start; return { t, lt, s, at: (tt, d = .5) => clamp((t - tt) / d), since: tt => t - tt }; }
function drawShot(buf, s, t, cam) {
  const c = buf.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
  c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
  cam = clampCam(cam); c.translate(W / 2, H / 2); c.scale(cam.z, cam.z); c.translate(-cam.x, -cam.y);
  s.set(c, mkT(s, t)); c.setTransform(1, 0, 0, 1, 0, 0);
  if (s.overlay) s.overlay(c, mkT(s, t), cam);
  finish(c, s.seed); return cam;
}
function toScreen(cam, x, y) { cam = clampCam(cam); return [(x - cam.x) * cam.z + W / 2, (y - cam.y) * cam.z + H / 2]; }
function smear(c, img, dx, vx, alpha = 1) { vx *= SMEAR_K; // shutter blur already adds half the streak
  // proper averaged smear: draw n copies at decreasing alpha 1/(k+1)
  const n = Math.max(1, Math.min(16, Math.ceil(Math.abs(vx) / 24)));
  c.globalAlpha = alpha; c.drawImage(img, dx - vx / 2, 0);
  for (let k = 1; k < n; k++) { c.globalAlpha = alpha / (k + 1); c.drawImage(img, dx - vx / 2 + vx * k / (n - 1), 0); }
  c.globalAlpha = 1;
}
const SFX = []; const SMEAR_K = .5;
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
  const { A, B, o, u, t0, t1 } = tr;
  const cA0 = camNat(A, t0), cB1 = camNat(B, t1);
  if (o.type === 'push') { // fly into a window in A; B is mapped to the window's width so it lands exactly full-frame (no fade, no ghost)
    const win = o.win, fz = W / win.w, tgt = { x: win.x + win.w / 2, y: win.y + win.h / 2, z: fz };
    const k = ease(u); const cam = lerpCam(cA0, tgt, k);
    const cA = drawShot(BUF[0], A, t, cam); c.drawImage(BUF[0], 0, 0);
    const [x0, y0] = toScreen(cA, win.x, win.y), [x1, y1] = toScreen(cA, win.x + win.w, win.y + win.h);
    const bw = x1 - x0, bh = bw * H / W, bx = x0, by = (y0 + y1) / 2 - bh / 2;
    drawShot(BUF[1], B, t, lerpCam({ ...cB1, z: cB1.z * .9 }, cB1, k));
    c.save(); c.beginPath(); c.rect(x0, y0, x1 - x0, y1 - y0); c.clip(); c.globalAlpha = smooth(clamp(u * 3 - .3)); c.drawImage(BUF[1], bx, by, bw, bh); c.restore();
    // warm window light blooms as we pass through it
    const bl = Math.sin(clamp((u - .55) / .45) * Math.PI) * .35; if (bl > 0) { c.save(); c.globalAlpha = bl; c.globalCompositeOperation = 'screen'; c.fillStyle = '#ffd98a'; c.fillRect(0, 0, W, H); c.restore(); }
    return;
  }
  if (o.type === 'match') { // ease into anchor a, hold both shapes in register through the blend, ease out of anchor b
    const S = o.size || 420; const ta = frameOn(o.a[0], o.a[1], o.a[2], S), tb = frameOn(o.b[0], o.b[1], o.b[2], S);
    const h0 = .4, h1 = .6, hold = k => 1 + .06 * k;      // shared slow push while held in register
    const hk = clamp((u - h0) / (h1 - h0));
    let camA, camB;
    if (u < h0) camA = lerpCam(cA0, ta, ease(u / h0)); else camA = { ...ta, z: ta.z * hold(hk) };
    if (u > h1) camB = lerpCam({ ...tb, z: tb.z * hold(1) }, cB1, ease((u - h1) / (1 - h1))); else camB = { ...tb, z: tb.z * hold(hk) };
    if (u < h1) drawShot(BUF[0], A, t, camA); if (u > h0) drawShot(BUF[1], B, t, camB);
    if (u <= h0) c.drawImage(BUF[0], 0, 0); else if (u >= h1) c.drawImage(BUF[1], 0, 0);
    else { c.drawImage(BUF[0], 0, 0); c.globalAlpha = smooth(hk); c.drawImage(BUF[1], 0, 0); c.globalAlpha = 1; }
    return;
  }
  if (o.type === 'whip') { // real whip pan: A and B sit side by side on one strip; blur scales with speed but is capped
    const dir = o.dir || 1, k = ease(u), dk = ease(Math.min(1, u + .04)) - ease(Math.max(0, u - .04));
    const v = Math.min(170, dk / .08 * W * .05);
    drawShot(BUF[0], A, t, camNat(A, Math.min(t, A.end))); drawShot(BUF[1], B, t, camNat(B, t));
    c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
    smear(c, BUF[0], -dir * k * W, -dir * v); smear(c, BUF[1], dir * (1 - k) * W, -dir * v);
    return;
  }
  // dissolve: both keep moving the same way; long and soft
  drawShot(BUF[0], A, t, camNat(A, t)); drawShot(BUF[1], B, t, camNat(B, t));
  c.drawImage(BUF[0], 0, 0); c.globalAlpha = smooth(u); c.drawImage(BUF[1], 0, 0); c.globalAlpha = 1;
}
function irisOut(c, t, o) {
  if (t < o.t0) return; const u = clamp((t - o.t0) / o.d); const R = lerp(Math.hypot(W, H) / 2 + 40, 0, ease(u));
  c.save(); c.fillStyle = '#000'; c.beginPath(); c.rect(0, 0, W, H); c.arc(o.x, o.y, Math.max(0, R), 0, TAU, true); c.fill('evenodd'); c.restore();
  if (u >= 1) { c.fillStyle = '#000'; c.fillRect(0, 0, W, H); }
}
// ---- subtitles (bible §6): handwritten white, soft shadow; chunked at punctuation; per-shot height
const FIXW = window.SUBFIX || {}; // per-project subtitle spelling fixes (normalised word -> display text)
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
  c.save(); c.globalAlpha = a; hand(c, ch.words.reduce((acc, w) => acc + (acc && !/^[.,:;!?%]|^'s/.test(w) ? ' ' : '') + w, '').replace(/(\d) ?\.(\d\d) p ?\.m\./, '$1:$2 p.m.'), W / 2, y + (1 - a) * 6, 60, '#fbf8ef', { stroke: 7, strokeCol: 'rgba(22,16,22,.82)' }); c.restore();
}
// 180-degree shutter motion blur (bible §7): each output frame averages SAMPLES sub-frames spread over half the
// frame interval, like a film camera. Camera moves, whips and walks get real blur; still areas are unchanged.
const SHUTTER = .5, SAMPLES = 4, ACC = document.createElement('canvas'); ACC.width = W; ACC.height = H;
window.frameJPG = (i, q = .92) => {
  const main = document.getElementById('c'), a = ACC.getContext('2d');
  for (let k = 0; k < SAMPLES; k++) {
    render((i + (SAMPLES > 1 ? (k / (SAMPLES - 1) - .5) * SHUTTER : 0)) / FPS);
    a.globalAlpha = 1 / (k + 1); a.drawImage(main, 0, 0);   // running average
  }
  a.globalAlpha = 1; const m = main.getContext('2d'); m.setTransform(1, 0, 0, 1, 0, 0); m.globalAlpha = 1; m.drawImage(ACC, 0, 0);
  return main.toDataURL('image/jpeg', q);
};
window.frameAt = t => render(t);
