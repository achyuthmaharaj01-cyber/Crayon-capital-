// ---------- transition library (bible §7) ----------
// Every transition is f(c, X) where X = { A, B, o, u (0..1 across the window), t, t0, t1, cA0, cB1 }.
// Helpers render A or B into a buffer with any camera; the compositor draws the result on the main canvas.
const MASK = document.createElement('canvas'); MASK.width = W; MASK.height = H;
const TMP = document.createElement('canvas'); TMP.width = W; TMP.height = H;
const SMALL = document.createElement('canvas'); SMALL.width = W; SMALL.height = H;
const rA = (X, cam) => drawShot(BUF[0], X.A, X.t, cam || camNat(X.A, X.t));
const rB = (X, cam) => drawShot(BUF[1], X.B, X.t, cam || camNat(X.B, X.t));
const fillC = (c, col) => { c.fillStyle = col; c.fillRect(0, 0, W, H); };
function drawShaken(c, img, amp, t, zoom = 1) { const dx = Math.sin(t * 91) * amp, dy = Math.cos(t * 77) * amp; c.save(); c.translate(W / 2 + dx, H / 2 + dy); c.scale(zoom, zoom); c.drawImage(img, -W / 2, -H / 2); c.restore(); }
function zoomBlur(c, img, z, amt, alpha = 1) { // radial zoom blur: stacked scaled copies about the centre
  const n = Math.max(1, Math.round(amt * 14)); c.save();
  for (let k = 0; k < n; k++) { const s = z * (1 + amt * .18 * k / n); c.globalAlpha = alpha / (k + 1) * (k ? 1.6 : 1); c.setTransform(s, 0, 0, s, W / 2 * (1 - s), H / 2 * (1 - s)); c.drawImage(img, 0, 0); }
  c.restore(); c.globalAlpha = 1;
}
function paperEdge(c, pts, col = '#f3ecdc') { c.save(); c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.lineWidth = 14; c.strokeStyle = col; c.lineJoin = 'round'; c.stroke(); c.lineWidth = 2; c.strokeStyle = 'rgba(90,70,50,.35)'; c.stroke(); c.restore(); }
function jagged(seed, n, amp) { const R = rng(seed); return [...Array(n + 1)].map((_, i) => (R() - .5) * amp * (i % 2 ? 1 : .6)); }

const TRANS = {
  // ---------- basic & narrative
  cut(c, X) { if (X.u < .5) { rA(X); c.drawImage(BUF[0], 0, 0); } else { rB(X); c.drawImage(BUF[1], 0, 0); } },
  jump(c, X) { // same scene, framing jumps closer; B settles in 0.2 s so it reads as a beat, not a glitch
    if (X.u < .5) { rA(X); c.drawImage(BUF[0], 0, 0); return; }
    const k = easeOut((X.t - (X.t0 + X.t1) / 2) / .22), cb = camNat(X.B, X.t); rB(X, { ...cb, z: cb.z * (1.04 - .04 * k) }); c.drawImage(BUF[1], 0, 0);
  },
  smash(c, X) { // hard, loud cut: white flash, camera kick, decaying shake
    if (X.u < .15) { rA(X); c.drawImage(BUF[0], 0, 0); return; }
    const k = clamp((X.u - .15) / .85), cb = camNat(X.B, X.t); rB(X, { ...cb, z: cb.z * (1.12 - .12 * easeOut(k)) });
    drawShaken(c, BUF[1], 18 * Math.pow(1 - k, 2), X.t);
    c.save(); c.globalAlpha = Math.pow(1 - k, 3) * .9; fillC(c, '#fffaf0'); c.restore();
  },
  match(c, X) { // ease into anchor a, hold both shapes in register through the blend, ease out of anchor b
    const { o, u } = X, S = o.size || 420; const ta = frameOn(o.a[0], o.a[1], o.a[2], S), tb = frameOn(o.b[0], o.b[1], o.b[2], S);
    const h0 = .4, h1 = .6, hold = k => 1 + .06 * k, hk = clamp((u - h0) / (h1 - h0));
    const camA = u < h0 ? lerpCam(X.cA0, ta, ease(u / h0)) : { ...ta, z: ta.z * hold(hk) };
    const camB = u > h1 ? lerpCam({ ...tb, z: tb.z * hold(1) }, X.cB1, ease((u - h1) / (1 - h1))) : { ...tb, z: tb.z * hold(hk) };
    if (u < h1) rA(X, camA); if (u > h0) rB(X, camB);
    if (u <= h0) c.drawImage(BUF[0], 0, 0); else if (u >= h1) c.drawImage(BUF[1], 0, 0);
    else { c.drawImage(BUF[0], 0, 0); c.globalAlpha = smooth(hk); c.drawImage(BUF[1], 0, 0); c.globalAlpha = 1; }
  },
  morph(c, X) { // hides a cut between two near-identical framings: short blend while each eases toward the other's scale
    const k = smooth(X.u), ca = camNat(X.A, X.t), cb = camNat(X.B, X.t);
    rA(X, lerpCam(ca, cb, k * .5)); rB(X, lerpCam(ca, cb, .5 + k * .5));
    c.drawImage(BUF[0], 0, 0); c.globalAlpha = k; c.drawImage(BUF[1], 0, 0); c.globalAlpha = 1;
  },
  // ---------- fades & dissolves
  dip(c, X) { const col = X.o.col || '#000'; if (X.u < .5) { rA(X); c.drawImage(BUF[0], 0, 0); c.globalAlpha = smooth(X.u * 2); } else { rB(X); c.drawImage(BUF[1], 0, 0); c.globalAlpha = 1 - smooth((X.u - .5) * 2); } fillC(c, col); c.globalAlpha = 1; },
  dissolve(c, X) { rA(X); rB(X); c.drawImage(BUF[0], 0, 0); c.globalAlpha = smooth(X.u); c.drawImage(BUF[1], 0, 0); c.globalAlpha = 1; },
  additive(c, X) { // film dissolve: the two images ADD, so the middle blooms brighter
    rA(X); rB(X); const k = smooth(X.u); fillC(c, '#000');
    c.globalAlpha = 1 - k * k; c.drawImage(BUF[0], 0, 0); c.globalCompositeOperation = 'lighter'; c.globalAlpha = 1 - (1 - k) * (1 - k); c.drawImage(BUF[1], 0, 0);
    c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
  },
  // ---------- motion, wipes & slides
  whip(c, X) { // A and B side by side on one strip; blur scales with speed, capped
    const dir = X.o.dir || 1, u = X.u, k = ease(u), dk = ease(Math.min(1, u + .04)) - ease(Math.max(0, u - .04)), v = Math.min(170, dk / .08 * W * .05);
    rA(X, camNat(X.A, Math.min(X.t, X.A.end))); rB(X); fillC(c, '#000');
    smear(c, BUF[0], -dir * k * W, -dir * v); smear(c, BUF[1], dir * (1 - k) * W, -dir * v);
  },
  crossZoom(c, X) { // A rushes in with radial blur, B arrives from the same rush and settles
    const u = X.u; if (u < .5) { rA(X); const k = easeIn(u * 2); fillC(c, '#000'); zoomBlur(c, BUF[0], 1 + k * 2.2, k); }
    else { rB(X); const k = 1 - easeOut((u - .5) * 2); fillC(c, '#000'); zoomBlur(c, BUF[1], 1 + k * 1.6, k); }
    const f = 1 - Math.abs(u - .5) * 2; c.save(); c.globalAlpha = .35 * f * f; c.globalCompositeOperation = 'screen'; fillC(c, '#fff4dc'); c.restore();
  },
  slide(c, X) { // B slides OVER a still A, casting a soft shadow
    const dir = X.o.dir || 1, k = ease(X.u); rA(X, camNat(X.A, Math.min(X.t, X.A.end))); rB(X); c.drawImage(BUF[0], 0, 0);
    const x = dir * (1 - k) * W; c.save(); c.shadowColor = 'rgba(0,0,0,.55)'; c.shadowBlur = 50; c.shadowOffsetX = -dir * 10; c.drawImage(BUF[1], x, 0); c.restore();
  },
  push(c, X) { // B pushes A out of frame, edge to edge
    const dir = X.o.dir || 1, k = ease(X.u); rA(X, camNat(X.A, Math.min(X.t, X.A.end))); rB(X);
    c.drawImage(BUF[0], -dir * k * W, 0); c.drawImage(BUF[1], dir * (1 - k) * W, 0); ln(c, dir * (1 - k) * W + (dir > 0 ? 0 : W), 0, dir * (1 - k) * W + (dir > 0 ? 0 : W), H, 6, INK);
  },
  windowPush(c, X) { // fly into a window in A; B is mapped to the window's width so it lands exactly full-frame
    const { o, u } = X, win = o.win, tgt = { x: win.x + win.w / 2, y: win.y + win.h / 2, z: W / win.w }, k = ease(u);
    const cA = rA(X, lerpCam(X.cA0, tgt, k)); c.drawImage(BUF[0], 0, 0);
    const [x0, y0] = toScreen(cA, win.x, win.y), [x1, y1] = toScreen(cA, win.x + win.w, win.y + win.h); const bw = x1 - x0, bh = bw * H / W;
    rB(X, lerpCam({ ...X.cB1, z: X.cB1.z * .9 }, X.cB1, k));
    c.save(); c.beginPath(); c.rect(x0, y0, x1 - x0, y1 - y0); c.clip(); c.globalAlpha = smooth(clamp(u * 3 - .3)); c.drawImage(BUF[1], x0, (y0 + y1) / 2 - bh / 2, bw, bh); c.restore();
    const bl = Math.sin(clamp((u - .55) / .45) * Math.PI) * .35; if (bl > 0) { c.save(); c.globalAlpha = bl; c.globalCompositeOperation = 'screen'; fillC(c, '#ffd98a'); c.restore(); }
  },
  wipe(c, X) { // shapes: 'line' (angled, with an ink edge), 'barn' (doors open from centre), 'clock' (sweep around o.at)
    const { o } = X, k = ease(X.u), sh = o.shape || 'line'; rA(X); rB(X); c.drawImage(BUF[0], 0, 0);
    c.save(); c.beginPath();
    if (sh === 'line') { const ang = o.angle ?? .25, L = W + H * Math.abs(Math.tan(ang)) + 200, x = -200 + k * L; c.moveTo(-400, -100); c.lineTo(x, -100); c.lineTo(x - Math.tan(ang) * (H + 200), H + 100); c.lineTo(-400, H + 100); c.closePath(); }
    if (sh === 'barn') { const hw = k * W / 2; c.rect(W / 2 - hw, 0, 2 * hw, H); }
    if (sh === 'clock') { const [cx, cy] = o.at || [W / 2, H / 2], R = Math.hypot(W, H); c.moveTo(cx, cy); c.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + k * TAU); c.closePath(); }
    c.save(); c.clip(); c.drawImage(BUF[1], 0, 0); c.restore();
    if (k > 0 && k < 1) { c.lineWidth = 6; c.strokeStyle = INK; if (sh === 'clock') { const [cx, cy] = o.at || [W / 2, H / 2], a = -Math.PI / 2 + k * TAU; ln(c, cx, cy, cx + Math.cos(a) * 3000, cy + Math.sin(a) * 3000, 8, '#f3ecdc'); ln(c, cx, cy, cx + Math.cos(a) * 3000, cy + Math.sin(a) * 3000, 3, INK); circ(c, cx, cy, 16, '#f3ecdc', 4); } else c.stroke(); }
    c.restore();
  },
  iris(c, X) { // shapes: circle | diamond | box; opens on B (o.open) or closes A to black (default)
    const { o } = X, k = ease(X.u), [cx, cy] = o.at || [W / 2, H / 2], R = Math.hypot(W, H) * .62, sh = o.shape || 'circle';
    const path = r => { c.beginPath(); if (sh === 'circle') c.arc(cx, cy, Math.max(0, r), 0, TAU); else if (sh === 'diamond') { c.moveTo(cx, cy - r * 1.3); c.lineTo(cx + r * 1.3, cy); c.lineTo(cx, cy + r * 1.3); c.lineTo(cx - r * 1.3, cy); c.closePath(); } else c.rect(cx - r * 1.2, cy - r * .7, r * 2.4, r * 1.4); };
    if (X.u < .5) { rA(X); fillC(c, '#000'); c.save(); path(R * (1 - easeIn(X.u * 2))); c.clip(); c.drawImage(BUF[0], 0, 0); c.restore(); }
    else { rB(X); fillC(c, '#000'); c.save(); path(R * easeOut((X.u - .5) * 2)); c.clip(); c.drawImage(BUF[1], 0, 0); c.restore(); }
  },
  pageTurn(c, X) { // the frame peels from the bottom-right corner like a page; B is the next page
    const k = ease(X.u); rA(X, camNat(X.A, Math.min(X.t, X.A.end))); rB(X); c.drawImage(BUF[1], 0, 0);
    const nx = -.86, ny = -.5, D = W * Math.abs(nx) + H * Math.abs(ny), s = k * D * 1.08;   // fold line: points p with (corner - p)·n' < s are turned
    const side = (x, y) => (W - x) * -nx + (H - y) * -ny - s;
    const quad = [[0, 0], [W, 0], [W, H], [0, H]]; const keep = [], turned = [];
    for (let i = 0; i < 4; i++) { const a = quad[i], b = quad[(i + 1) % 4], sa = side(...a), sb = side(...b);
      (sa >= 0 ? keep : turned).push(a); if ((sa >= 0) !== (sb >= 0)) { const f = sa / (sa - sb); const p = [lerp(a[0], b[0], f), lerp(a[1], b[1], f)]; keep.push(p); turned.push(p); } }
    if (keep.length > 2) { c.save(); c.beginPath(); keep.forEach((p, i) => i ? c.lineTo(...p) : c.moveTo(...p)); c.closePath(); c.clip(); c.drawImage(BUF[0], 0, 0);
      // shadow of the curl onto page A
      c.restore(); }
    if (turned.length > 2) { // the turned flap = turned region reflected across the fold line, showing the paper's back
      const L = Math.hypot(nx, ny), ux = -nx / L, uy = -ny / L; const refl = ([x, y]) => { const d = (W - x) * ux + (H - y) * uy - s / L; return [x + 2 * d * ux, y + 2 * d * uy]; };
      const flap = turned.map(refl); c.save(); c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 40; c.beginPath(); flap.forEach((p, i) => i ? c.lineTo(...p) : c.moveTo(...p)); c.closePath();
      const g = c.createLinearGradient(flap[0][0], flap[0][1], W - s * ux, H - s * uy); g.addColorStop(0, '#d9cfb9'); g.addColorStop(1, '#f6efdf'); c.fillStyle = g; c.fill(); c.shadowColor = 'transparent'; c.lineWidth = 3; c.strokeStyle = 'rgba(60,45,35,.5)'; c.stroke(); c.restore(); }
  },
  passing(c, X) { // a big foreground passer-by crosses the lens; B is revealed behind their trailing edge
    const dir = X.o.dir || 1, k = lerp(-.25, 1.25, X.u); rA(X); rB(X);
    const px = dir > 0 ? k * W : W - k * W, edge = px - dir * 230;
    c.drawImage(BUF[0], 0, 0); c.save(); c.beginPath(); if (dir > 0) c.rect(0, 0, Math.max(0, edge), H); else c.rect(Math.min(W, edge), 0, W, H); c.clip(); c.drawImage(BUF[1], 0, 0); c.restore();
    c.save(); c.filter = 'blur(3px)'; person(c, { x: px, y: H + 330, s: 4.6, t: X.t, blank: 1, blankCol: '#2b2730', coat: '#1f1c24', collar: 'dutch', hat: 'capotain', hatCol: '#151318', legs: 'walk', walk: X.t * 6, flip: dir < 0, seed: 3, shadow: false }); c.restore();
  },
  // ---------- stylistic & effect
  glitch(c, X) { // digital break: pixelate + RGB split + slipping slices, A gives way to B at the midpoint
    const u = X.u, img = u < .5 ? (rA(X), BUF[0]) : (rB(X), BUF[1]); const e = 1 - Math.abs(u - .5) * 2; const R = rng(Math.floor(X.t * 24) + 1);
    const px = Math.max(1, Math.round(2 + e * 38)), sx = SMALL.getContext('2d'); sx.imageSmoothingEnabled = true; sx.clearRect(0, 0, W, H); sx.drawImage(img, 0, 0, W / px, H / px);
    c.imageSmoothingEnabled = false; c.drawImage(SMALL, 0, 0, W / px, H / px, 0, 0, W, H); c.imageSmoothingEnabled = true;
    const tc = TMP.getContext('2d'); tc.globalCompositeOperation = 'source-over'; tc.drawImage(c.canvas, 0, 0);
    c.save(); c.globalCompositeOperation = 'screen'; c.globalAlpha = .45 * e; c.filter = 'sepia(1) saturate(6) hue-rotate(-50deg)'; c.drawImage(TMP, 14 * e, 0); c.filter = 'sepia(1) saturate(6) hue-rotate(150deg)'; c.drawImage(TMP, -14 * e, 0); c.restore(); c.filter = 'none';
    for (let i = 0; i < Math.round(e * 9); i++) { const y = R() * H, h = 8 + R() * 70, dx = (R() - .5) * 160 * e; c.drawImage(TMP, 0, y, W, h, dx, y, W, h); }
    c.save(); c.globalAlpha = .12 * e; for (let y = 0; y < H; y += 4) { c.fillStyle = '#000'; c.fillRect(0, y, W, 2); } c.restore();
  },
  lightLeak(c, X) { // warm film flare sweeps across; A dissolves to B under the brightest moment, burn at the edges
    rA(X); rB(X); const u = X.u, k = smooth(clamp((u - .3) / .4)); c.drawImage(BUF[0], 0, 0); c.globalAlpha = k; c.drawImage(BUF[1], 0, 0); c.globalAlpha = 1;
    const e = Math.sin(u * Math.PI), x = lerp(-300, W + 300, u);
    c.save(); c.globalCompositeOperation = 'screen';
    for (const [dx, dy, r, col, a] of [[0, 300, 900, '#ff9a3c', .85], [260, 700, 700, '#ffd27a', .7], [-380, 120, 600, '#ff5a3c', .5]]) { const g = c.createRadialGradient(x + dx, dy, 0, x + dx, dy, r); g.addColorStop(0, rgba(col, a * e)); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g; c.fillRect(0, 0, W, H); }
    const g2 = c.createLinearGradient(0, 0, W, 0); g2.addColorStop(0, rgba('#ff6a2a', .55 * e)); g2.addColorStop(.18, rgba('#ff6a2a', 0)); g2.addColorStop(.82, rgba('#ff6a2a', 0)); g2.addColorStop(1, rgba('#ff6a2a', .55 * e)); c.fillStyle = g2; c.fillRect(0, 0, W, H);
    c.restore();
  },
  paperTear(c, X) { // A tears down a jagged line; both halves fall away (rotating) revealing B
    rA(X, camNat(X.A, Math.min(X.t, X.A.end))); rB(X); c.drawImage(BUF[1], 0, 0);
    const k = easeIn(X.u), J = jagged(7, 18, 70), cx = W * .52; const pts = J.map((d, i) => [cx + d + (i - 9) * 6, -40 + i * (H + 80) / 18]);
    for (const sd of [-1, 1]) { c.save(); c.translate(sd * k * W * .8, k * k * 220); c.rotate(sd * k * .22);
      c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 30 * (k > 0); c.beginPath(); c.moveTo(sd < 0 ? -50 : W + 50, -60); pts.forEach(p => c.lineTo(...p)); c.lineTo(sd < 0 ? -50 : W + 50, H + 60); c.closePath(); c.save(); c.clip(); c.drawImage(BUF[0], 0, 0); c.restore(); c.shadowColor = 'transparent';
      paperEdge(c, pts); c.restore(); }
  },
  handDrawn(c, X) { // B is painted in by thick ink-brush zigzag strokes; a nib line leads each stroke
    rA(X); rB(X); c.drawImage(BUF[0], 0, 0); const m = MASK.getContext('2d'); m.setTransform(1, 0, 0, 1, 0, 0); m.globalCompositeOperation = 'source-over'; m.clearRect(0, 0, W, H);
    const rows = 5, pts = []; for (let i = 0; i < rows; i++) { const y = H * (i + .5) / rows + (i % 2 ? 20 : -20); pts.push(i % 2 ? [W + 200, y] : [-200, y]); pts.push(i % 2 ? [-200, y + 40] : [W + 200, y + 40]); }
    const tot = pts.length - 1, p = ease(X.u) * tot; m.lineCap = 'round'; m.lineJoin = 'round'; m.lineWidth = H / rows * 1.55; m.strokeStyle = '#fff'; m.beginPath(); m.moveTo(...pts[0]);
    let tip = pts[0]; for (let i = 1; i <= tot; i++) { if (p >= i) { m.lineTo(...pts[i]); tip = pts[i]; } else { const f = p - (i - 1); if (f > 0) { tip = [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)]; m.lineTo(...tip); } break; } } m.stroke();
    m.globalCompositeOperation = 'source-in'; m.drawImage(BUF[1], 0, 0); c.drawImage(MASK, 0, 0);
    if (X.u < .99) { c.save(); c.globalAlpha = .9; circ(c, tip[0], tip[1], 10, INK, 0); c.restore(); }
  },
  split(c, X) { // split screen: B slides in to take the right half while A compresses to the left, then B takes over
    const k = ease(X.u); rA(X); rB(X); const sx = W * (1 - k * .5);
    c.drawImage(BUF[0], (W - sx) / 2, 0, sx, H, 0, 0, sx, H);
    c.save(); c.beginPath(); c.rect(sx, 0, W - sx, H); c.clip(); c.drawImage(BUF[1], 0, 0); c.restore(); ln(c, sx, 0, sx, H, 8, '#f3ecdc');
  },
};
