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
// chapter card: case-file styling. Navy/teal room, warm desk-lamp pool, thin rules drawn out, chapter number and title
// typed letter by letter (tick per letter in sfxEvents), small "CASE FILE 1959" header. Decelerating, no loops.
const CHAP_T0 = .28, CHAP_CPS = 22;  // title typing starts at 0.28 s, 22 letters a second
function chapterCard(c, T, n, title) {
  window.__lastChap = { n, title };
  const g = c.createRadialGradient(W * .5, H * .46, 60, W * .5, H * .5, W * .75);
  g.addColorStop(0, '#16303a'); g.addColorStop(.55, '#0c1a24'); g.addColorStop(1, '#04080c');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  lightPool(c, W * .5, H * .44, 760, '#ffb04a', .10);
  // faint paper fibre lines, fixed (no animation)
  c.save(); c.globalAlpha = .05; for (let y = 90; y < H; y += 46) line(c, 0, y, W, y, 1.5, '#9fd0dc'); c.restore();
  const z = 1 + .04 * easeOut(T.lt / Math.max(T.d, 1)); c.save(); c.translate(W / 2, H / 2); c.scale(z, z);
  const k0 = easeOut(T.lt / .5);
  // header
  c.globalAlpha = clamp(T.lt / .35);
  c.font = '700 30px Kalam'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#8fb7c2';
  c.fillText('CASE FILE  ·  1959', 0, -250);
  c.globalAlpha = 1;
  // chapter number
  const num = typeof n === 'string' ? n : 'CHAPTER ' + n;
  c.font = '700 44px Kalam'; c.fillStyle = '#e0a94a'; c.fillText(num.toUpperCase(), 0, -150);
  // rules
  const rw = 620 * k0; line(c, -rw, -100, rw, -100, 2.5, 'rgba(224,232,236,.55)'); line(c, -rw, 150, rw, 150, 2.5, 'rgba(224,232,236,.55)');
  // title typed
  const nch = Math.max(0, Math.floor((T.lt - CHAP_T0) * CHAP_CPS));
  const shown = title.slice(0, nch);
  let fs = 150; c.font = `700 ${fs}px Caveat`; while (c.measureText(title).width > 1500 && fs > 70) { fs -= 6; c.font = `700 ${fs}px Caveat`; }
  const full = c.measureText(title).width; c.textAlign = 'left';
  c.fillStyle = '#f4efe4'; c.fillText(shown, -full / 2, 25);
  if (nch < title.length && T.lt > CHAP_T0 - .1) { const cx = -full / 2 + c.measureText(shown).width + 8; c.fillStyle = '#e0a94a'; c.fillRect(cx, 25 - fs * .32, 6, fs * .62); }
  c.restore();
}
window.chapTicks = (title, t0) => [...title].map((ch, i) => ch === ' ' ? null : t0 + CHAP_T0 + i / CHAP_CPS).filter(v => v != null);
// camera ---------------------------------------------------------------
// solver: every registered person/prop is either fully in frame or fully out, at the start AND end of the move
const CAMC = {}, BOXC = {};
function shotBoxes(def, shot) {
  const id = shot.key + '/' + shot.sub; if (BOXC[id]) return BOXC[id];
  const boxes = []; REG.on = true; REG.list = boxes;
  for (const tt of [shot.start + .05, (shot.start + shot.end) / 2, shot.end - .05]) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); try { def.draw(ctx, mkT(shot, tt)); } catch (e) { } ctx.restore(); }
  REG.on = false;
  return (BOXC[id] = boxes.filter(b => b[2] - b[0] < 1800 && b[3] - b[1] < 1000 && b[2] > 0 && b[0] < W && b[3] > 0 && b[1] < H));
}
// fit target [x,y,z] so that both the start frame (z) and the end frame (z*(1+push), shifted by drift) crop nothing
function fitCam(B, target, push0, drift = [0, 0]) {
  const [tx, ty, tz] = target; const m = 12;
  const frame = (fx, fy, z, push, end) => { const zz = end ? z * (1 + push) : z; let cx = fx + (end ? drift[0] : 0), cy = fy + (end ? drift[1] : 0); const hw = 960 / zz, hh = 540 / zz; cx = clamp(cx, hw, W - hw); cy = clamp(cy, hh, H - hh); return [cx - hw, cy - hh, cx + hw, cy + hh]; };
  const cuts = f => B.filter(b => { const inside = b[0] >= f[0] + m && b[2] <= f[2] - m && b[1] >= f[1] + m && b[3] <= f[3] - m; const out = b[2] <= f[0] + 4 || b[0] >= f[2] - 4 || b[3] <= f[1] + 4 || b[1] >= f[3] - 4; return !inside && !out; });
  for (const push of [push0, push0 * .55, push0 * .25, 0]) {
    for (let z = tz; z >= .999; z -= .03) {
      let fx = tx, fy = ty;
      for (let it = 0; it < 6; it++) {
        const cs = [...cuts(frame(fx, fy, z, push, false)), ...cuts(frame(fx, fy, z, push, true))];
        if (!cs.length) return [fx, fy, z, push];
        const u = [Math.min(...cs.map(b => b[0])), Math.min(...cs.map(b => b[1])), Math.max(...cs.map(b => b[2])), Math.max(...cs.map(b => b[3]))];
        const hw = 960 / (z * (1 + push)) - m - 26, hh = 540 / (z * (1 + push)) - m - 12;
        if (u[2] - u[0] > 2 * hw || u[3] - u[1] > 2 * hh) break;
        const nx = clamp(fx, u[2] - hw, u[0] + hw), ny = clamp(fy, u[3] - hh, u[1] + hh);
        if (nx === fx && ny === fy) break; fx = nx; fy = ny;
      }
    }
  }
  return [960, 540, 1.0, 0];
}
// the move for this piece of the shot: def.moves[sub] > def.move > 'push'
const moveOf = (def, sub) => { const m = def.moves ? def.moves[sub % def.moves.length] : def.move; return m == null ? ['push'] : [].concat(typeof m === 'string' ? [m] : m); };
function solveCam(def, shot) {
  const id = shot.key + '/' + shot.sub; if (CAMC[id]) return CAMC[id];
  const B = shotBoxes(def, shot);
  const cams = def.cams || [[960, 540, 1.0], def.focus || [960, 520, 1.2]];
  const base = cams[shot.sub % cams.length]; const dir = shot.sub % 2 ? -1 : 1;
  const mv = moveOf(def, shot.sub), kind = mv[0];
  const P = def.push ?? .065;
  let r;
  if (kind === 'pan' || kind === 'tilt' || kind === 'rack') {
    const A = kind === 'rack' ? mv[2] : mv[1], Bt = kind === 'rack' ? mv[3] : mv[2];
    const a = fitCam(B, A || base, 0), b = fitCam(B, Bt || base, 0);
    r = { kind, a, b, word: kind === 'rack' ? mv[1] : null };
  } else if (kind === 'snap') {
    const a = fitCam(B, base, .015, [0, 0]);
    r = { kind, a, word: mv[1], zoom: mv[2] || 1.28, pt: mv[3] || null };
  } else if (kind === 'pull') {
    const f = fitCam(B, base, def.push ?? .09, [-dir * 22, 8]); r = { kind, a: f };
  } else if (kind === 'drift') {
    const f = fitCam(B, base, .025, [dir * 30, -6]); r = { kind, a: f };
  } else if (kind === 'hold') {
    r = { kind, a: fitCam(B, base, 0) };
  } else {
    const f = fitCam(B, base, P, [dir * 22, -8]); r = { kind: 'push', a: f };
  }
  return (CAMC[id] = r);
}
const decel = p => 1 - Math.pow(1 - clamp(p), 2.4);            // long moves: fast off the cut, settle into the end
const glide = p => { p = clamp(p); return p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; };  // pans between two marks
function camFor(def, T) {
  const r = solveCam(def, T.shot); const dir = (T.sub % 2 ? -1 : 1);
  let fx, fy, z;
  const [ax, ay, az, apush] = r.a;
  if (r.kind === 'push') { const e = decel(T.p); z = az * (1 + apush * e); fx = ax + dir * 22 * e; fy = ay - 8 * e; }
  else if (r.kind === 'pull') { const e = 1 - decel(T.p); z = az * (1 + apush * e); fx = ax - dir * 22 * (1 - e); fy = ay + 8 * (1 - e); }
  else if (r.kind === 'drift') { const e = T.p; z = az * (1 + apush * e); fx = ax + dir * 30 * e; fy = ay - 6 * e; }
  else if (r.kind === 'hold') { fx = ax; fy = ay; z = az; }
  else if (r.kind === 'pan' || r.kind === 'tilt') { const e = glide(T.p); fx = lerp(ax, r.b[0], e); fy = lerp(ay, r.b[1], e); z = lerp(az, r.b[2], e); }
  else if (r.kind === 'rack') { const s = r.word != null ? T.since(r.word) : T.lt - T.d * .5; const e = easeOut(s / .8); fx = lerp(ax, r.b[0], e); fy = lerp(ay, r.b[1], e); z = lerp(az, r.b[2], e); }
  else if (r.kind === 'snap') {
    const s = T.since(r.word); const e = s < 0 ? 0 : 1 - Math.pow(1 - clamp(s / .32), 4);
    const z0 = az * (1 + apush * T.p); z = z0 * (1 + (r.zoom - 1) * e);
    const [px, py] = r.pt || [ax, ay]; fx = lerp(ax, px, e); fy = lerp(ay, py, e);
  }
  const hw = 960 / z, hh = 540 / z; fx = clamp(fx, hw, W - hw); fy = clamp(fy, hh, H - hh);
  let sx = 0, sy = 0, roll = Math.sin(T.t * .4) * .004;
  if (def.handheld) {  // slow breathing operator: layered low-frequency sines, a few px, never periodic-looking
    const h = def.handheld === true ? 1 : def.handheld, t = T.t;
    sx += (Math.sin(t * .83 + 1.3) * 3.2 + Math.sin(t * 1.91 + .4) * 1.6 + Math.sin(t * 3.7) * .6) * h;
    sy += (Math.sin(t * .67 + 2.1) * 2.6 + Math.sin(t * 1.53 + 3.0) * 1.3 + Math.sin(t * 4.1 + 1) * .5) * h;
    roll += (Math.sin(t * .59 + .7) * .0022 + Math.sin(t * 1.37) * .001) * h;
  }
  (def.shakes || []).forEach(a => { const ts = typeof a === 'number' ? T.lt - a : T.since(a); if (ts >= 0 && ts < .45) { const k = Math.exp(-ts * 9) * 16; sx += Math.sin(ts * 70) * k; sy += Math.cos(ts * 57) * k; } });
  return { fx, fy, z, sx, sy, roll };
}
window.camReport = () => TL.shots.map(s => { const d = SHOTS[s.key]; if (!d || d.card) return null; const r = solveCam(d, s); return [s.key + '/' + s.sub, r.kind, ...r.a.map(v => +v.toFixed(3))]; }).filter(Boolean);
// frame render ---------------------------------------------------------
const chOf = id => String(id).replace(/\d.*$/, '');                        // line prefix = chapter (C, R, T, ...)
const shotIdx = t => { let lo = 0, hi = TL.shots.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (TL.shots[m].start <= t) lo = m; else hi = m - 1; } return lo; };
function transOf(i) {  // transition INTO shot i: def.trans, else dip at a chapter boundary, else cut
  if (i <= 0) return 'cut'; const s = TL.shots[i], d = SHOTS[s.key] || {};
  if (d.trans) return d.trans; if (s.sub) return 'cut';
  return chOf(s.line) !== chOf(TL.shots[i - 1].line) ? 'dip' : 'cut';
}
const DIP_OUT = .22, DIP_IN = .32, FADE = .45;
let OFF = null;
function drawShot(c, shot, t) {
  const def = SHOTS[shot.key]; const T = mkT(shot, t);
  c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
  if (!def) { label(c, 'MISSING ' + shot.key, W / 2, H / 2, 80, RED); return T; }
  if (def.card) { def.card(c, T); }
  else {
    const k = camFor(def, T); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
    c.save(); c.translate(W / 2 + k.sx, H / 2 + k.sy); c.scale(k.z, k.z); c.rotate(k.roll); c.translate(-k.fx, -k.fy);
    def.draw(c, T); c.restore();
    if (def.overlay) def.overlay(c, T);
    vignette(c, def.vig ?? .55);
  }
  return T;
}
function renderFrame(i) {
  const t = i / TL.fps; const si = shotIdx(t); const shot = TL.shots[si] || TL.shots[TL.shots.length - 1];
  const tr = transOf(si), lt = t - shot.start;
  if (tr === 'fade' && si > 0 && lt < FADE) {   // cross-dissolve from the previous shot (frozen at its last moment + overlap)
    if (!OFF) { OFF = document.createElement('canvas'); OFF.width = W; OFF.height = H; }
    const oc = OFF.getContext('2d'); const prev = TL.shots[si - 1];
    drawShot(oc, prev, Math.min(t, prev.end - .001)); oc.setTransform(1, 0, 0, 1, 0, 0);
    const T = drawShot(ctx, shot, t); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1 - ease(lt / FADE); ctx.drawImage(OFF, 0, 0); ctx.globalAlpha = 1;
    if (window.POST) window.POST(ctx, T, shot);
  } else {
    const T = drawShot(ctx, shot, t); ctx.setTransform(1, 0, 0, 1, 0, 0);
    let dark = 0;
    if (tr === 'dip' && lt < DIP_IN) dark = Math.max(dark, 1 - easeOut(lt / DIP_IN));
    if (si + 1 < TL.shots.length && transOf(si + 1) === 'dip' && t > shot.end - DIP_OUT) dark = Math.max(dark, clamp((t - (shot.end - DIP_OUT)) / DIP_OUT));
    if (dark > 0) { ctx.fillStyle = `rgba(0,0,0,${dark})`; ctx.fillRect(0, 0, W, H); }
    if (window.POST) window.POST(ctx, T, shot);
  }
  // fade from black at the very top, fade out at the end
  if (t < .25) { ctx.fillStyle = `rgba(0,0,0,${1 - t / .25})`; ctx.fillRect(0, 0, W, H); }
  if (t > TL.duration - 1.2) { ctx.fillStyle = `rgba(0,0,0,${clamp((t - (TL.duration - 1.2)) / 1.0)})`; ctx.fillRect(0, 0, W, H); }
  return shot;
}
// sound events: every effect is keyed to a word (or the shot cut) -------------
// Documentary cutting: clean cuts carry no whoosh. Whooshes only where the camera makes a gesture (snap punch-in,
// or a shot that asks for one with whoosh:true); a low hit under every chapter dip; typewriter ticks on chapter titles.
function sfxEvents() {
  const ev = []; const scratch = document.createElement('canvas').getContext('2d');
  TL.shots.forEach((s, i) => {
    const def = SHOTS[s.key]; if (!def) return; const T = mkT(s, s.start);
    if (def.whoosh && s.sub === 0) ev.push({ n: ['whoosh1', 'whoosh2', 'whoosh3'][i % 3], t: s.start - .12, g: -20 });
    if (!def.card) { const mv = moveOf(def, s.sub); if (mv[0] === 'snap') { const tt = T.cue(mv[1]); if (tt >= s.start && tt < s.end) ev.push({ n: 'whoosh2', t: tt - .1, g: -24 }); } }
    if (def.card && def.typing) T.line.words.forEach(w => { if (w.s >= s.start - .06 && w.s < s.end) ev.push({ n: 'tick', t: w.s, g: -9 }); });
    if (def.card && !def.typing && s.sub === 0) {
      window.__lastChap = null; try { def.card(scratch, T); } catch (e) { }
      if (window.__lastChap) { chapTicks(window.__lastChap.title, s.start).filter(x => x < s.end - .1).forEach(x => ev.push({ n: 'tick', t: x, g: -16, len: .35 })); ev.push({ n: 'hit', t: s.start, g: -18 }); }
      else ev.push({ n: 'hit', t: s.start, g: -16 });
    }
    if (s.sub !== 0) return; // events belong to the first piece of a split shot
    (def.sfx || []).forEach(([n, when, g = -10, extra = {}]) => { const tt = typeof when === 'number' ? s.start + when : (extra.nth != null ? T.cueN(when, extra.nth) : T.cue(when)); ev.push({ n, t: tt, g, ...extra }); });
  });
  return ev.sort((a, b) => a.t - b.t);
}
window.renderFrame = renderFrame; window.sfxEvents = sfxEvents;
window.frameJPG = (i, q = .9) => { renderFrame(i); return cv.toDataURL('image/jpeg', q); };
window.missingCues = () => [...MISSING];
window.missingShots = () => TL.shots.filter(s => !SHOTS[s.key]).map(s => s.key);
