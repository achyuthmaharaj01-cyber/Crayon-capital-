// ---------- rig: egg-people + dog (bible §4) ----------
// person(c, o): o.x,o.y = ground point between the legs. o.s scale (1 => ~310 px tall). Head radius r = 60.
// o: t, seed, skin, coat, collar ('dutch'|'suit'|'apron'|null), hat ('capotain'|'cap'|'bonnet'|'top'|null), hatCol,
//    hair ('side'|'grey'|'bald'|'bun'|'none'), hairCol, expr, look (-1..1), talk (0..1), blank, mustache, beard,
//    arms: {l:[ang,bend,len?], r:[...]} (ang from straight down, + = outward), hold: fn(c, handL, handR),
//    legs: 'stand'|'walk'|'sit', walk: phase, flip, wrinkles, noseCol, sweat, lean
const R0 = 60;
function eggPath(c, w, h) { // bottom at y=0, top at -h; widest near the bottom
  c.beginPath(); c.moveTo(0, -h);
  c.bezierCurveTo(w * .4, -h, w * .5, -h * .5, w * .5, -h * .2); c.bezierCurveTo(w * .5, -h * .02, w * .3, 0, 0, 0);
  c.bezierCurveTo(-w * .3, 0, -w * .5, -h * .02, -w * .5, -h * .2); c.bezierCurveTo(-w * .5, -h * .5, -w * .4, -h, 0, -h); c.closePath();
}
function person(c, o) {
  const t = o.t || 0, seed = o.seed || 1, r = R0, s = o.s || 1;
  const skin = o.skin || P.skin1, coat = o.coat || P.suitB;
  c.save(); c.translate(o.x, o.y); c.scale(s * (o.flip ? -1 : 1), s);
  if (o.shadow !== false) groundShadow(c, 0, 2, 70);
  const sit = o.legs === 'sit', LL = sit ? 0 : 66, bw = 1.75 * r, bh = 2.4 * r;
  // breathing + walk bob
  const br = Math.sin(t * 1.95 + seed * 1.7), wph = o.walk || 0, walking = o.legs === 'walk';
  const bob = walking ? -Math.abs(Math.sin(wph)) * 4 : 0;
  const by = -LL + 6 + bob; // body bottom
  // legs
  if (!sit) {
    const sx = r * .22;
    if (walking) { const a = Math.sin(wph) * .42; for (const [k, sg] of [[-1, 1], [1, -1]]) { const ang = a * sg; ln(c, k * sx * .6, by - 4, k * sx * .6 + Math.sin(ang) * LL, by - 4 + Math.cos(ang) * (LL + 2) , LW); } }
    else { ln(c, -sx, by - 4, -sx - 2, 0, LW); ln(c, sx, by - 4, sx + 2, 0, LW); }
  } else { const sl = o.sitLeg || 110; ln(c, -r * .25, by - 8, -r * .34, by + sl, LW); ln(c, r * .25, by - 8, r * .36, by + sl, LW); }
  c.save(); c.translate(0, by); c.scale(1 + br * .004, 1 + br * .012);
  const lean = o.lean || 0; c.rotate(lean);
  // arms behind? (drawn after body, so they read as a line over the side)
  const body = () => eggPath(c, bw, bh);
  body(); ink(c, coat, 0);
  // painted-on clothes
  c.save(); body(); c.clip();
  if (o.collar === 'suit') { poly(c, [[-r * .36, -bh], [r * .36, -bh], [0, -bh * .52]], P.shirt, 0); poly(c, [[-r * .1, -bh * .96], [r * .1, -bh * .96], [r * .07, -bh * .6], [0, -bh * .54], [-r * .07, -bh * .6]], o.tie || INK, 0);
    ln(c, -r * .36, -bh, -r * .02, -bh * .5, 2.4, shade(coat, -.5)); ln(c, r * .36, -bh, r * .02, -bh * .5, 2.4, shade(coat, -.5)); }
  if (o.apron) { c.beginPath(); c.roundRect(-bw * .3, -bh * .55, bw * .6, bh * .62, 18); ink(c, o.apron, 2.6, shade(o.apron, -.4)); }
  if (o.buttons !== false && !o.apron) for (let i = 0; i < 3; i++) circ(c, 0, -bh * (.42 - i * .12), 3.2, shade(coat, -.55), 0);
  // soft crescent shade
  c.beginPath(); c.arc(-bw * .2, -bh * .6, bw * .82, 0, TAU); c.rect(-bw * 2, -bh * 2, bw * 4, bh * 4); c.fillStyle = 'rgba(0,0,0,.16)'; c.fill('evenodd');
  c.restore();
  body(); ink(c, null, LW);
  if (o.collar === 'dutch') { // white falling collar (period)
    c.beginPath(); c.moveTo(-r * .78, -bh * .93); c.quadraticCurveTo(-r * .7, -bh * .72, 0, -bh * .7); c.quadraticCurveTo(r * .7, -bh * .72, r * .78, -bh * .93); c.quadraticCurveTo(0, -bh * 1.04, -r * .78, -bh * .93); ink(c, P.shirt, 3.4);
    ln(c, 0, -bh * .96, 0, -bh * .72, 2.2, '#b9b4a6');
  }
  // arms: one ink line each, bend = curvature
  const arm = (side, a) => {
    const [ang, bend = .15, len = 1.4 * r] = a || [.12, .15]; const sx = side * bw * .43, sy = -bh * .68;
    const ex = sx + side * Math.sin(ang) * len, ey = sy + Math.cos(ang) * len;
    const mx = (sx + ex) / 2 + side * bend * len * Math.cos(ang), my = (sy + ey) / 2 - bend * len * Math.sin(ang) * .3;
    curve(c, sx, sy, mx, my, ex, ey, LW); return [ex, ey];
  };
  const A = o.arms || {}; const hl = arm(-1, A.l), hr = arm(1, A.r);
  if (o.hold) o.hold(c, hl, hr, bh);
  c.restore();
  // ---- head (floats on the body top)
  const hy = by - bh - r * .74 + br * .6 + (o.headDy || 0), tilt = (o.tilt || 0) + Math.sin(t * .7 + seed) * .012;
  c.save(); c.translate(o.hx || 0, hy); c.rotate(tilt);
  const hairCol = o.hairCol || '#3b2a20';
  if (o.hair === 'long') { c.beginPath(); c.roundRect(-r * 1.02, -r * .5, r * 2.04, r * 2.2, r * .9); ink(c, hairCol, LW); }
  const head = () => { c.beginPath(); c.arc(0, 0, r, 0, TAU); };
  head(); ink(c, o.blank ? (o.blankCol || '#d6d5d8') : skin, 0);
  c.save(); head(); c.clip();
  // hair shapes clipped to the head circle
  if (o.hair === 'side' || o.hair === 'long') { c.beginPath(); c.moveTo(-r, -r * .05); c.quadraticCurveTo(-r * .9, -r * 1.1, 0, -r * 1.05); c.quadraticCurveTo(r * .95, -r * 1.05, r, -r * .1); c.quadraticCurveTo(r * .55, -r * .5, -r * .05, -r * .52); c.quadraticCurveTo(-r * .6, -r * .45, -r * .78, -r * .05); c.closePath(); ink(c, hairCol, 0);
    ln(c, -r * .2, -r * .9, r * .2, -r * .6, 2, shade(hairCol, .25)); ln(c, r * .3, -r * .95, r * .55, -r * .55, 2, shade(hairCol, .25)); }
  if (o.hair === 'grey') { c.beginPath(); c.moveTo(-r, r * .05); c.quadraticCurveTo(-r * 1.05, -r * 1.1, r * .2, -r * 1.05); c.quadraticCurveTo(r * 1.05, -r * .9, r, -r * .05); c.quadraticCurveTo(r * .5, -r * .62, -r * .1, -r * .55); c.quadraticCurveTo(-r * .65, -r * .5, -r * .82, r * .05); c.closePath(); ink(c, '#b9b9bd', 0);
    for (let i = 0; i < 5; i++) ln(c, -r * .7 + i * r * .32, -r * .95, -r * .45 + i * r * .32, -r * .58, 2, '#8d8d93'); }
  if (o.hair === 'bun' || o.hair === 'bonnetHair') { c.beginPath(); c.moveTo(-r, 0); c.quadraticCurveTo(-r, -r * 1.05, 0, -r * 1.02); c.quadraticCurveTo(r, -r * 1.05, r, 0); c.quadraticCurveTo(r * .2, -r * .65, -r, 0); ink(c, hairCol, 0); }
  if (o.hair === 'tufts') { ell(c, -r * .95, -r * .05, r * .2, r * .34, '#e9e6df', 0); ell(c, r * .95, -r * .05, r * .2, r * .34, '#e9e6df', 0); }
  // head crescent shade
  c.beginPath(); c.arc(-r * .3, -r * .18, r * 1.08, 0, TAU); c.rect(-r * 3, -r * 3, r * 6, r * 6); c.fillStyle = 'rgba(60,20,10,.14)'; c.fill('evenodd');
  c.restore();
  head(); ink(c, null, LW);
  if (o.hair === 'bun' && !o.hat) circ(c, 0, -r * 1.08, r * .3, hairCol, LW);
  if (!o.blank) face(c, o, r, t, seed);
  if (o.glasses) { const gy = -r * .02; c.lineWidth = 3; c.strokeStyle = INK; c.strokeRect(-r * .52, gy - r * .14, r * .4, r * .27); c.strokeRect(r * .12, gy - r * .14, r * .4, r * .27); ln(c, -r * .12, gy - r * .02, r * .12, gy - r * .02, 3); ln(c, -r * .52, gy - r * .06, -r * .96, gy - r * .12, 3); ln(c, r * .52, gy - r * .06, r * .96, gy - r * .12, 3); }
  // hats
  const hc = o.hatCol || '#26232a';
  if (o.hat === 'capotain') { c.save(); c.rotate(-.06); ell(c, 0, -r * .72, r * 1.28, r * .2, hc, LW); c.beginPath(); c.moveTo(-r * .62, -r * .74); c.lineTo(-r * .5, -r * 1.55); c.quadraticCurveTo(0, -r * 1.68, r * .5, -r * 1.55); c.lineTo(r * .62, -r * .74); c.closePath(); ink(c, hc, LW);
    c.beginPath(); c.moveTo(-r * .6, -r * .86); c.lineTo(r * .6, -r * .86); c.lineTo(r * .58, -r * 1.0); c.lineTo(-r * .58, -r * 1.0); c.closePath(); ink(c, o.bandCol || '#6b4a2e', 2.4); c.restore(); }
  if (o.hat === 'top') { c.save(); c.rotate(.04); ell(c, 0, -r * .74, r * 1.12, r * .18, hc, LW); rect(c, -r * .62, -r * 1.75, r * 1.24, r * 1.0, hc, LW, 6); rect(c, -r * .62, -r * 1.0, r * 1.24, r * .17, shade(hc, -.4), 2.4); c.restore(); }
  if (o.hat === 'cap') { c.beginPath(); c.moveTo(-r * 1.04, -r * .12); c.quadraticCurveTo(-r * 1.12, -r * 1.22, 0, -r * 1.14); c.quadraticCurveTo(r * 1.12, -r * 1.22, r * 1.04, -r * .12); c.quadraticCurveTo(r * .7, -r * .26, r * .6, -r * .5); c.quadraticCurveTo(0, -r * .7, -r * .6, -r * .5); c.quadraticCurveTo(-r * .7, -r * .26, -r * 1.04, -r * .12); ink(c, o.hatCol || '#f1eee4', LW); curve(c, -r * .55, -r * .72, 0, -r * .86, r * .55, -r * .72, 2, '#c9c3b2'); }
  if (o.hat === 'beret') { c.save(); c.rotate(-.18); ell(c, r * .05, -r * .82, r * 1.0, r * .36, hc, LW); circ(c, r * .1, -r * 1.2, 6, hc, 3); c.restore(); }
  c.restore();
  c.restore();
}
function face(c, o, r, t, seed) {
  const expr = o.expr || 'neutral', look = (o.look || 0) * r * .1, lookY = (o.lookY || 0) * r * .06;
  const blink = ((t + seed * 1.37) % 4.1) < .075 && expr !== 'shock';
  const ex = r * .3, ey = -r * .02;
  for (const s of [-1, 1]) {
    const cx = s * ex + look, cy = ey + lookY;
    if (blink || expr === 'happy') { if (expr === 'happy') curve(c, cx - r * .1, cy + 3, cx, cy - r * .1, cx + r * .1, cy + 3, 3.6); else ln(c, cx - r * .07, cy, cx + r * .07, cy, 3.6); continue; }
    if (expr === 'shock') { ell(c, cx, cy, r * .13, r * .16, '#fbfaf4', 3.2); ell(c, cx, cy + 2, r * .055, r * .075, INK, 0); continue; }
    ell(c, cx, cy, r * .068, r * .1, INK, 0); circ(c, cx + r * .025, cy - r * .035, r * .022, '#fbfaf4', 0);
    if (expr === 'smug' || expr === 'sly') { c.fillStyle = o.skin || P.skin1; c.fillRect(cx - r * .1, cy - r * .14, r * .2, r * .085); ln(c, cx - r * .09, cy - r * .055, cx + r * .09, cy - r * .055, 3.2); }
  }
  // brows: short dashes, angle carries the emotion
  const bA = { neutral: .04, serious: .2, angry: .38, worried: -.32, sad: -.28, shock: -.12, smug: .12, sly: .22, happy: -.05, grin: -.05, think: .1 }[expr] ?? .05;
  const byy = ey - r * .22 + (expr === 'shock' ? -r * .1 : 0) + lookY;
  // positive angle = inner ends lower (angry/serious); negative = inner ends raised (worried/sad)
  for (const s of [-1, 1]) { const cx = s * ex + look; const a = expr === 'think' && s > 0 ? -.3 : bA; const k = Math.sin(a) * r * .09;
    ln(c, cx - r * .1, byy + s * k, cx + r * .1, byy - s * k, 3.6); }
  if (o.wrinkles) { for (let i = 0; i < 3; i++) curve(c, -r * .3, -r * .48 - i * 9, 0, -r * .54 - i * 9, r * .3, -r * .48 - i * 9, 2, shade(o.skin || P.skin1, -.3)); curve(c, -r * .52, r * .22, -r * .46, r * .32, -r * .5, r * .42, 2, shade(o.skin || P.skin1, -.3)); curve(c, r * .52, r * .22, r * .46, r * .32, r * .5, r * .42, 2, shade(o.skin || P.skin1, -.3)); }
  if (o.blush) { c.save(); c.globalAlpha = .28; ell(c, -r * .52, r * .2, r * .14, r * .08, '#e06a6a', 0); ell(c, r * .52, r * .2, r * .14, r * .08, '#e06a6a', 0); c.restore(); }
  if (o.noseCol) ell(c, look * .5, r * .16, r * .1, r * .08, o.noseCol, 2.6);
  if (o.mustache) { c.beginPath(); c.moveTo(0, r * .26); c.quadraticCurveTo(-r * .22, r * .18, -r * .36, r * .34); c.quadraticCurveTo(-r * .18, r * .4, 0, r * .3); c.quadraticCurveTo(r * .18, r * .4, r * .36, r * .34); c.quadraticCurveTo(r * .22, r * .18, 0, r * .26); ink(c, o.mustache, 2.4); }
  if (o.beard) { c.beginPath(); c.moveTo(-r * .16, r * .5); c.quadraticCurveTo(0, r * .9, r * .16, r * .5); c.quadraticCurveTo(0, r * .58, -r * .16, r * .5); ink(c, o.beard, 2.4); }
  // mouth
  const my = r * .4 + (o.mustache ? r * .06 : 0), tk = clamp(o.talk || 0);
  if (tk > .12 && expr !== 'shock') { ell(c, 0, my, r * .1 + tk * r * .03, r * .03 + tk * r * .1, '#5a1e22', 3); }
  else if (expr === 'shock') ell(c, 0, my + r * .04, r * .1, r * .13 + tk * r * .05, '#5a1e22', 3);
  else if (expr === 'grin') { // teeth: fill, CLIP to the mouth, draw tooth lines inside only, then re-ink the lip on top (bible §4)
    const mouth = () => { c.beginPath(); c.moveTo(-r * .28, my - r * .06); c.quadraticCurveTo(0, my + r * .3, r * .28, my - r * .06); c.quadraticCurveTo(0, my - r * .01, -r * .28, my - r * .06); c.closePath(); };
    mouth(); ink(c, '#fbfaf4', 0);
    c.save(); mouth(); c.clip();
    ln(c, -r * .3, my + r * .045, r * .3, my + r * .045, 1.5, '#9c948a');
    for (let i = -2; i <= 2; i++) ln(c, i * r * .085, my - r * .08, i * r * .085, my + r * .2, 1.5, '#9c948a');
    c.restore(); mouth(); ink(c, null, 3.2); }
  else if (expr === 'happy') curve(c, -r * .2, my - r * .04, 0, my + r * .2, r * .2, my - r * .04, 3.6);
  else if (expr === 'smug' || expr === 'sly') curve(c, -r * .16, my + r * .02, r * .06, my + r * .1, r * .2, my - r * .07, 3.6);
  else if (expr === 'worried') { c.beginPath(); c.moveTo(-r * .16, my + r * .05); c.bezierCurveTo(-r * .06, my - r * .05, r * .06, my + r * .12, r * .16, my + r * .02); c.lineWidth = 3.6; c.strokeStyle = INK; c.stroke(); }
  else if (expr === 'sad') curve(c, -r * .15, my + r * .08, 0, my - r * .08, r * .15, my + r * .08, 3.6);
  else if (expr === 'serious' || expr === 'angry') ln(c, -r * .12, my + r * .03, r * .12, my + r * .03, 3.6);
  else curve(c, -r * .12, my, 0, my + r * .07, r * .12, my, 3.6);
  if (o.sweat) { const k = (t * .8) % 1; c.save(); c.globalAlpha = 1 - k * .6; const sx = r * .72, sy = -r * .35 + k * r * .3; c.beginPath(); c.moveTo(sx, sy - 14); c.quadraticCurveTo(sx + 10, sy + 4, sx, sy + 8); c.quadraticCurveTo(sx - 10, sy + 4, sx, sy - 14); ink(c, '#9fd3ef', 2.4); c.restore(); }
}
// ---- dog: horizontal egg body, round head, floppy ear, stick legs, wagging tail
function dog(c, o) {
  const t = o.t || 0, s = o.s || 1, col = o.col || '#c9955e';
  c.save(); c.translate(o.x, o.y); c.scale(s * (o.flip ? -1 : 1), s);
  groundShadow(c, 0, 2, 58, .24);
  const wag = Math.sin(t * (o.wagFast ? 16 : 6)) * (o.wag ?? .5), br = Math.sin(t * 2.6) * 1.2, sit = o.sit;
  // tail
  const tx = sit ? -28 : -52, ty = sit ? -12 : -50; curve(c, tx, ty, tx - 22, ty - 18 - wag * 10, tx - 18 + wag * 22, ty - 46, LW);
  // legs
  if (!sit) { for (const x of [-34, -18, 22, 38]) ln(c, x, -30, x + (x > 0 ? 2 : -2), 0, LW); } else { ln(c, 24, -30, 26, 0, LW); ln(c, 38, -30, 42, 0, LW); }
  const [bx, byy, brx, bry] = sit ? [10, -48, 40, 46] : [0, -46, 58, 30];
  ell(c, bx, byy + br, brx, bry, col, 0); c.save(); c.beginPath(); c.ellipse(bx, byy + br, brx, bry, 0, 0, TAU); c.clip(); ell(c, bx - 6, byy + bry * .7 + br, brx * .7, bry * .45, shade(col, .35), 0); ell(c, bx + 20, byy - bry * .8, brx * 1.05, bry, 'rgba(0,0,0,.14)', 0); c.restore(); ell(c, bx, byy + br, brx, bry, null, LW);
  if (sit) { ell(c, -14, -8, 22, 10, col, LW); }
  // head
  const hx = sit ? 34 : 56, hy = sit ? -112 + br : -82 + br, tilt = o.tilt || 0; c.save(); c.translate(hx, hy); c.rotate(tilt);
  ell(c, -18, -10, 13, 26, shade(col, -.35), LW, .35); // back ear
  circ(c, 0, 0, 34, col, 0); c.save(); c.beginPath(); c.arc(0, 0, 34, 0, TAU); c.clip(); ell(c, 22, 14, 26, 18, shade(col, .4), 0); c.beginPath(); c.arc(-8, -6, 38, 0, TAU); c.rect(-90, -90, 180, 180); c.fillStyle = 'rgba(60,20,10,.14)'; c.fill('evenodd'); c.restore(); circ(c, 0, 0, 34, null, LW);
  ell(c, 32, 8, 8, 6, INK, 0); // nose
  const blink = ((t + 1.1) % 3.3) < .08; if (blink) ln(c, 6, -8, 16, -8, 3.4); else { ell(c, 11, -8, 4.5, 6.5, INK, 0); circ(c, 12.5, -10.5, 1.6, '#fff', 0); }
  if (o.mood === 'sad') ln(c, 4, -20, 18, -15, 3); else ln(c, 4, -18, 18, -21, 3);
  curve(c, 14, 20, 22, 26, 30, 20, 3);
  ell(c, -14, 6, 12, 26, shade(col, -.25), LW, .25); // front floppy ear
  if (o.tongue) ell(c, 24, 30, 6, 9, '#d8676d', 2.6);
  c.restore(); c.restore();
}
