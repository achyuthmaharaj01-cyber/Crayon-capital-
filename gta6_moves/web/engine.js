// ---------- engine: timeline lookup, word cues, camera, cards, frame render ----------
const cv = document.getElementById('c'); const ctx = cv.getContext('2d'); window.__c = ctx;
const SHOTS = {}; // key -> {draw, cams, focus, shakes, sfx, overlay}
const LINES = {}; TL.lines.forEach(l => LINES[l.id] = l);
const norm = s => String(s).toLowerCase().replace(/[^a-z0-9$.%]/g, '').replace(/^\.+|\.+$/g, '');
const MISSING = new Set();
function cueIn(lineId, alts, after = -1, key = '') {
  alts = [].concat(alts).map(norm); const l = LINES[lineId];
  for (const w of l.words) if (w.s > after && alts.some(a => w.w === a || (a.length > 2 && w.w.startsWith(a)))) return w.s;
  MISSING.add(key + ':' + alts.join('/')); return null;
}
function mkT(shot, t) {
  const lt = t - shot.start, d = shot.end - shot.start;
  const T = { t, lt, d, p: clamp(lt / d), sub: shot.sub, shot, line: LINES[shot.line] };
  T.cue = (alts, fb) => { const v = cueIn(shot.line, alts, -1, shot.key); return v == null ? shot.start + (fb ?? 0) : v; };
  T.cueN = (alts, n) => { let a = -1, v = null; for (let k = 0; k <= n; k++) { v = cueIn(shot.line, alts, a, shot.key); if (v == null) return shot.start; a = v; } return v; };
  T.sinceN = (alts, n) => t - T.cueN(alts, n);
  T.since = (alts, fb) => t - T.cue(alts, fb);         // seconds since that word was spoken
  T.at = (alts, dur = .6, fb) => clamp(T.since(alts, fb) / dur); // 0..1 ramp starting on the word
  T.in = (a, dur = .5) => clamp((lt - a) / dur);        // local ramp
  return T;
}
// screen cards ---------------------------------------------------------
function blackCard(c, T, text, o = {}) {
  c.fillStyle = '#050505'; c.fillRect(0, 0, W, H);
  lightPool(c, W / 2, H / 2, 900, '#334', .25);
  const words = text.split(' '), ws = T.line.words;
  let k = 0;
  if (o.all) k = words.length; else {
    const pool = ws.filter(w => w.s >= T.shot.start - .06); let j = 0;
    for (let i = 0; i < words.length; i++) { const n = norm(words[i]); let hit = -1;
      for (let q = j; q < Math.min(pool.length, j + 4); q++) if (pool[q].w && n && (n.startsWith(pool[q].w) || pool[q].w.startsWith(n))) { hit = q; break; }
      if (hit < 0) { if (k === i) k = i + 1; continue; }   // unmatched word rides along with the previous one
      if (pool[hit].s <= T.t + .02) { k = i + 1; j = hit + 1; } else { if (k === i + 1) k = i; break; } }
  }
  const s = o.size || 96; c.font = `700 ${s}px Caveat`; c.textAlign = 'left'; c.textBaseline = 'middle';
  // wrap
  const rows = []; let cur = [];
  words.forEach(w => { const test = [...cur, w].join(' '); if (c.measureText(test).width > W * .74 && cur.length) { rows.push(cur); cur = [w]; } else cur.push(w); }); rows.push(cur);
  let idx = 0; const lh = s * 1.18, y0 = H / 2 - (rows.length - 1) * lh / 2;
  const zoom = 1 + .035 * T.p; c.save(); c.translate(W / 2, H / 2); c.scale(zoom, zoom); c.translate(-W / 2, -H / 2);
  rows.forEach((r, ri) => { const full = c.measureText(r.join(' ')).width; let x = W / 2 - full / 2;
    r.forEach(w => { if (idx < k) { c.fillStyle = '#fff'; c.fillText(w, x, y0 + ri * lh); } x += c.measureText(w + ' ').width; idx++; }); });
  c.restore();
}
function chapterCard(c, T, n, title) {
  c.fillStyle = '#050505'; c.fillRect(0, 0, W, H); lightPool(c, W / 2, H / 2, 800, '#3a3550', .3);
  const z = 1 + .05 * T.p; c.save(); c.translate(W / 2, H / 2); c.scale(z, z);
  c.globalAlpha = clamp(T.lt / .3);
  label(c, typeof n === 'string' ? n : 'CHAPTER ' + n, 0, -90, 40, '#bbb', { stroke: false });
  c.font = '700 150px Caveat'; c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(title, 0, 30);
  line(c, -240 * easeOut(T.lt / .6), 120, 240 * easeOut(T.lt / .6), 120, 4, '#fff'); c.restore();
}
// camera ---------------------------------------------------------------
// camera solver: every registered person/prop is either fully in frame or fully out, at the start AND end of the push
const CAMC = {};
function solveCam(def, shot) {
  const id = shot.key + '/' + shot.sub; if (CAMC[id]) return CAMC[id];
  const boxes = []; REG.on = true; REG.list = boxes;
  for (const tt of [shot.start + .05, (shot.start + shot.end) / 2, shot.end - .05]) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); try { def.draw(ctx, mkT(shot, tt)); } catch (e) { } ctx.restore(); }
  REG.on = false;
  const B = boxes.filter(b => b[2] - b[0] < 1800 && b[3] - b[1] < 1000 && b[2] > 0 && b[0] < W && b[3] > 0 && b[1] < H);
  const cams = def.cams || [[960, 540, 1.0], def.focus || [960, 520, 1.2]];
  const [tx, ty, tz] = cams[shot.sub % cams.length]; const dir = shot.sub % 2 ? -1 : 1; const m = 12;
  const frame = (fx, fy, z, push, end) => { const zz = end ? z * (1 + push) : z; let cx = fx + (end ? dir * 22 : 0), cy = fy + (end ? -8 : 0); const hw = 960 / zz, hh = 540 / zz; cx = clamp(cx, hw, W - hw); cy = clamp(cy, hh, H - hh); return [cx - hw, cy - hh, cx + hw, cy + hh]; };
  const cuts = f => B.filter(b => { const inside = b[0] >= f[0] + m && b[2] <= f[2] - m && b[1] >= f[1] + m && b[3] <= f[3] - m; const out = b[2] <= f[0] + 4 || b[0] >= f[2] - 4 || b[3] <= f[1] + 4 || b[1] >= f[3] - 4; return !inside && !out; });
  let best = null;
  for (const push of [def.push ?? .065, .035, .015]) {
    for (let z = tz; z >= .999; z -= .03) {
      let fx = tx, fy = ty;
      for (let it = 0; it < 6; it++) {
        const cs = [...cuts(frame(fx, fy, z, push, false)), ...cuts(frame(fx, fy, z, push, true))];
        if (!cs.length) { best = [fx, fy, z, push]; break; }
        const u = [Math.min(...cs.map(b => b[0])), Math.min(...cs.map(b => b[1])), Math.max(...cs.map(b => b[2])), Math.max(...cs.map(b => b[3]))];
        const hw = 960 / (z * (1 + push)) - m - 26, hh = 540 / (z * (1 + push)) - m - 12;
        if (u[2] - u[0] > 2 * hw || u[3] - u[1] > 2 * hh) break;
        const nx = clamp(fx, u[2] - hw, u[0] + hw), ny = clamp(fy, u[3] - hh, u[1] + hh);
        if (nx === fx && ny === fy) break; fx = nx; fy = ny;
      }
      if (best) break;
    }
    if (best) break;
  }
  return (CAMC[id] = best || [960, 540, 1.0, .015]);
}
function camFor(def, T) {
  let [fx, fy, z, push] = solveCam(def, T.shot);
  const dir = (T.sub % 2 ? -1 : 1);
  z *= 1 + push * ease(T.p);
  fx += dir * 22 * T.p; fy += -8 * T.p;
  const hw = 960 / z, hh = 540 / z; fx = clamp(fx, hw, W - hw); fy = clamp(fy, hh, H - hh);
  let sx = 0, sy = 0;
  (def.shakes || []).forEach(a => { const ts = typeof a === 'number' ? T.lt - a : T.since(a); if (ts >= 0 && ts < .45) { const k = Math.exp(-ts * 9) * 16; sx += Math.sin(ts * 70) * k; sy += Math.cos(ts * 57) * k; } });
  const roll = Math.sin(T.t * .4) * .006;
  return { fx, fy, z, sx, sy, roll };
}
window.camReport = () => TL.shots.map(s => { const d = SHOTS[s.key]; return d && !d.card ? [s.key + '/' + s.sub, ...solveCam(d, s).map(v => +v.toFixed(3))] : null; }).filter(Boolean);
// printed-poster finish: warm/cool grade + fine paper grain (generated once, tiled)
let GRAIN = null;
function finishLook(c) {
  if (!GRAIN) { const g = document.createElement('canvas'); g.width = g.height = 256; const x = g.getContext('2d'); const d = x.createImageData(256, 256); const R = rand(77);
    for (let i = 0; i < d.data.length; i += 4) { const v = 128 + (R() - .5) * 90; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } x.putImageData(d, 0, 0); GRAIN = c.createPattern(g, 'repeat'); }
  c.save(); c.globalCompositeOperation = 'soft-light'; c.globalAlpha = .28; c.fillStyle = GRAIN; c.fillRect(0, 0, W, H);
  c.globalCompositeOperation = 'soft-light'; c.globalAlpha = .14; const gr = c.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#ffd9a0'); gr.addColorStop(1, '#6a86c8'); c.fillStyle = gr; c.fillRect(0, 0, W, H); c.restore(); }
function renderFrame(i) {
  const t = i / TL.fps; const shot = TL.shots.find(s => t >= s.start && t < s.end) || TL.shots[TL.shots.length - 1];
  const def = SHOTS[shot.key]; const T = mkT(shot, t);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  if (!def) { label(ctx, 'MISSING ' + shot.key, W / 2, H / 2, 80, RED); return shot; }
  if (def.card) { def.card(ctx, T); }
  else {
    const k = camFor(def, T); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.translate(W / 2 + k.sx, H / 2 + k.sy); ctx.scale(k.z, k.z); ctx.rotate(k.roll); ctx.translate(-k.fx, -k.fy);
    def.draw(ctx, T); ctx.restore();
    if (def.overlay) def.overlay(ctx, T);
    vignette(ctx, def.vig ?? .55); finishLook(ctx);
  }
  // fade from black at the very top, fade out at the end
  if (t < .25) { ctx.fillStyle = `rgba(0,0,0,${1 - t / .25})`; ctx.fillRect(0, 0, W, H); }
  if (t > TL.duration - 1.2) { ctx.fillStyle = `rgba(0,0,0,${clamp((t - (TL.duration - 1.2)) / 1.0)})`; ctx.fillRect(0, 0, W, H); }
  return shot;
}
// sound events: every effect is keyed to a word (or the shot cut) -------------
function sfxEvents() {
  const ev = [];
  TL.shots.forEach((s, i) => {
    const def = SHOTS[s.key]; if (!def) return; const T = mkT(s, s.start);
    if (s.sub === 0 && i > 0 && !def.card && !def.noWhoosh) ev.push({ n: ['whoosh1', 'whoosh2', 'whoosh3'][i % 3], t: s.start - .12, g: -20 });
    if (def.card && def.typing) T.line.words.forEach(w => { if (w.s >= s.start - .06 && w.s < s.end) ev.push({ n: 'tick', t: w.s, g: -9 }); });
    if (def.card && !def.typing && s.sub === 0) ev.push({ n: 'hit', t: s.start, g: -16 });
    if (s.sub !== 0) return; // events belong to the first piece of a split shot
    (def.sfx || []).forEach(([n, when, g = -10, extra = {}]) => { const tt = typeof when === 'number' ? s.start + when : (extra.nth != null ? T.cueN(when, extra.nth) : T.cue(when)); ev.push({ n, t: tt, g, ...extra }); });
  });
  return ev.sort((a, b) => a.t - b.t);
}
window.renderFrame = renderFrame; window.sfxEvents = sfxEvents;
window.frameJPG = (i, q = .9) => { renderFrame(i); return cv.toDataURL('image/jpeg', q); };
window.missingCues = () => [...MISSING];
window.missingShots = () => TL.shots.filter(s => !SHOTS[s.key]).map(s => s.key);
