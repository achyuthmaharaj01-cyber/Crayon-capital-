// ---------- sets for the Lunik heist: night-heavy, one accent per set, light from inside, always dressed ----------
// Every SET.<name>(c, t, o) draws the full background (and floor) and RETURNS its light list for GRADE.night:
//   const L = SET.salvageYard(c, T.t, { lamps: 1 }); ...draw people/props...; GRADE.night(c, L, .45);
const SET = {};
const FLOOR = (c, y, col, line_) => { c.fillStyle = col; c.fillRect(-400, y, W + 800, H + 400 - y); line(c, -400, y, W + 400, y, LW); if (line_) for (let x = -400; x < W + 400; x += 160) line(c, x, y + 6, x - 200, H + 300, 2.5, line_); };
const NIGHT_SKY = (c, t, top = '#081226', bot = '#17304a', stars = 50) => { bg(c, top, bot); const R = rand(9); for (let i = 0; i < stars; i++) { const x = R() * (W + 800) - 400, y = R() * 420 - 200; circ(c, x, y, R() * 1.8 + .8, `rgba(255,255,255,${.3 + .35 * Math.sin(t * 1.5 + i)})`, 0); } };
const skyline = (c, y, col, lit, seed = 2, tall = 1) => { const R = rand(seed); let x = -400; while (x < W + 400) { const w = 120 + R() * 180, h = (120 + R() * 260) * tall; box(c, x, y - h, w, h + 4, 3, col, 0); if (lit) for (let yy = y - h + 26; yy < y - 30; yy += 46) for (let xx = x + 18; xx < x + w - 24; xx += 38) if (R() > .55) { c.fillStyle = lit; c.fillRect(xx, yy, 16, 20); } if (R() > .7) { line(c, x + w * .5, y - h, x + w * .5, y - h - 50, 3, col); } x += w + 6; } };

// Mexico City 1959 street at night: colonial low buildings, sodium lamps, shop signs. o.turnoff: side-road sign; o.traffic (t) distant headlights; o.dusk 0..1 warmer sky
SET.nightStreet = (c, t, o = {}) => {
  NIGHT_SKY(c, t, o.dusk ? '#1d2a4a' : '#081226', o.dusk ? '#c9764a' : '#17304a', o.dusk ? 10 : 50);
  skyline(c, 700, '#0f1d30', 'rgba(255,200,110,.55)', 3, 1.2);
  // colonial street facades
  const fac = [[-200, 420, '#4a3a5a'], [200, 380, '#3f5a5a'], [560, 440, '#5a4a3a'], [960, 400, '#3a4a5e'], [1340, 420, '#5a3e3a'], [1720, 380, '#3f5a4a']];
  fac.forEach(([x, h, col], i) => { const c2 = i % 2 ? '#43575e' : '#5a4a3e'; box(c, x, 840 - h, 380, h, 4, c2); line(c, x, 840 - h + 26, x + 380, 840 - h + 26, 4, 'rgba(0,0,0,.25)');
    for (let k = 0; k < 3; k++) { const wx = x + 50 + k * 110; box(c, wx, 840 - h + 70, 60, 110, [30, 30, 4, 4], (k + i) % 2 ? '#ffcf7a' : '#1d2738', 3.5); line(c, wx - 8, 840 - h + 182, wx + 68, 840 - h + 182, 5); }
    if (i % 2 === 0) { box(c, x + 120, 840 - 150, 140, 150, [60, 60, 0, 0], '#2a1e16', 3.5); } });
  sign(c, 580 + 190, 600, 220, 54, 'FARMACIA', { bg: '#1f5f4a', fg: '#ffe9a8', size: 30 }); sign(c, 1340 + 190, 590, 220, 54, 'CAFÉ', { bg: '#8a2a22', fg: '#ffe9a8', size: 32 });
  FLOOR(c, 840, '#3a3f46'); c.fillStyle = '#2b2f35'; c.fillRect(-400, 880, W + 800, 400); line(c, -400, 880, W + 400, 880, LW);
  for (let x = -100; x < 2100; x += 240) { c.fillStyle = 'rgba(255,220,150,.55)'; c.fillRect(x - ((t * (o.scroll || 0)) % 240), 980, 120, 10); }
  const L = [];
  [140, 900, 1660].forEach(x => { sodiumLamp(c, x, 884, 380, 1); L.push([x + 71, 500, 420, '#ffb04a', .45]); });
  if (o.turnoff) { sign(c, 1500, 760, 260, 70, o.turnoff === true ? 'ESTACIÓN →' : o.turnoff, { bg: '#e9e4d6', size: 32, post: 120 }); }
  if (o.traffic) for (let i = 0; i < 4; i++) { const k = ((t * .15 + i / 4) % 1); const px = -200 + k * 2400; circ(c, px, 930, 6, '#fff3c0', 0); circ(c, px + 22, 930, 6, '#fff3c0', 0); lightPool(c, px + 11, 930, 60, '#fff3c0', .5); }
  return L;
};
// exhibition hall interior (daytime, busy): high windows, banner, pedestal centre. o.crowd (t), o.banner
SET.exhibitHall = (c, t, o = {}) => {
  bg(c, '#e8dcc4', '#d6c6a6');
  for (let i = 0; i < 6; i++) { const x = 120 + i * 320; box(c, x, 150, 200, 300, [100, 100, 4, 4], '#cfe3ef', 4); line(c, x + 100, 150, x + 100, 450, 3); cone(c, x + 100, 200, 200, 520, 700, '#fff6d6', .14); }
  if (o.banner !== false) { line(c, 300, -100, 300, 40, 4); line(c, 1620, -100, 1620, 40, 4); box(c, 260, 30, 1400, 96, 8, '#b8322a'); label(c, o.banner || 'SOVIET EXHIBITION', 960, 80, 44, '#fff', { maxW: 1320 }); }
  FLOOR(c, 800, '#a8987a', 'rgba(0,0,0,.08)'); for (let x = -400; x < W + 400; x += 140) line(c, x, 800, x, 1500, 2, 'rgba(0,0,0,.08)');
  // side displays: turbine + panel
  box(c, 60, 560, 280, 240, 10, '#5d6b78'); circ(c, 200, 670, 80, '#8d969e'); for (let a = 0; a < 8; a++) line(c, 200, 670, 200 + Math.cos(a * .8 + t * .2) * 70, 670 + Math.sin(a * .8 + t * .2) * 70, 6);
  box(c, 1580, 540, 280, 260, 10, '#3f5a6a'); for (let r = 0; r < 4; r++) for (let i = 0; i < 5; i++) circ(c, 1620 + i * 50, 590 + r * 50, 12, (r + i) % 3 ? '#9fd1ff' : '#ffcf3f', 3);
  lightPool(c, 960, 420, 900, '#fff2cc', .3);
  return [[960, 600, 700, '#fff2cc', .2]];
};
// the same hall at night: closed, dark, guarded. Spotlit pedestal, moonlight through high windows
SET.hallNight = (c, t, o = {}) => {
  bg(c, '#0d1626', '#18263a');
  for (let i = 0; i < 6; i++) { const x = 120 + i * 320; box(c, x, 150, 200, 300, [100, 100, 4, 4], '#24406a', 4); line(c, x + 100, 150, x + 100, 450, 3); cone(c, x + 100, 200, 200, 420, 700, '#8fb6e8', .08); }
  box(c, 260, 30, 1400, 96, 8, '#5a1e1c'); label(c, 'SOVIET EXHIBITION', 960, 80, 44, '#c9b9a8', { maxW: 1320 });
  FLOOR(c, 800, '#1f2a36', 'rgba(255,255,255,.04)');
  cone(c, 960, -60, 120, 760, 900, '#fff2cc', .2);
  return [[960, 700, 520, '#fff2cc', .3]];
};
// warm embassy office: venetian blinds, desk lamp, map on the wall. o.night (dark blinds)
SET.embassyOffice = (c, t, o = {}) => {
  bg(c, '#6b4e36', '#4a3424');
  for (let x = -400; x < W + 400; x += 90) line(c, x, -300, x, 780, 3, 'rgba(0,0,0,.12)');
  // window with blinds
  box(c, 1220, 110, 520, 440, 8, o.night ? '#16243a' : '#f3d9a0'); for (let i = 0; i < 16; i++) line(c, 1220, 130 + i * 26, 1740, 130 + i * 26, 6, o.night ? '#2c3a52' : '#c99a5a'); box(c, 1220, 110, 520, 440, 8, null);
  if (!o.night) { c.save(); c.globalAlpha = .18; c.globalCompositeOperation = 'screen'; for (let i = 0; i < 9; i++) poly(c, [[1220, 140 + i * 48], [1740, 140 + i * 48], [1500, 900 + i * 40], [700, 900 + i * 40]], '#ffd890', 0); c.restore(); }
  // framed map + file cabinet
  box(c, 240, 150, 460, 320, 8, '#3a2a1e'); box(c, 260, 170, 420, 280, 4, '#e9dcb3', 3); poly(c, MX.map(([a, b]) => [270 + a * 400, 180 + b * 260]), '#d1c08e', 3); circ(c, 270 + .55 * 400, 180 + .72 * 260, 9, '#d9342b', 3);
  box(c, 60, 520, 170, 280, 8, '#5b636b'); for (let i = 0; i < 3; i++) { box(c, 74, 540 + i * 86, 142, 70, 4, '#727b84', 3); box(c, 125, 566 + i * 86, 40, 12, 4, '#c9ced4', 2.5); }
  FLOOR(c, 800, '#3a2a1e', 'rgba(0,0,0,.15)');
  // desk with lamp + phone
  if (!o.noDesk) { box(c, 520, 700, 880, 34, 8, '#6d4428'); box(c, 540, 734, 840, 80, 6, '#5a3820'); line(c, 1240, 700, 1240, 560, 7); poly(c, [[1190, 560], [1290, 560], [1270, 520], [1210, 520]], '#2f5a3a'); lightPool(c, 1240, 620, 420, '#ffd27a', .55);
    rotaryPhone(c, 700, 700, .7); paperSheet(c, 950, 690, .1, .9); }
  return [[1240, 620, 520, '#ffc870', .55], [960, 400, 900, '#ffb35c', .2]];
};
// Tampico port at dusk/night: quay, water, Soviet freighter, crane. o.crane (0..1), o.night
SET.port = (c, t, o = {}) => {
  NIGHT_SKY(c, t, o.night ? '#081226' : '#2a3a5e', o.night ? '#17304a' : '#d98a5a', o.night ? 50 : 6);
  if (!o.night) { circ(c, 1500, 560, 90, '#ffcf8a', 0); lightPool(c, 1500, 560, 400, '#ffb070', .5); }
  c.fillStyle = o.night ? '#10243a' : '#3a5a78'; c.fillRect(-400, 640, W + 800, 600); for (let i = 0; i < 12; i++) line(c, -400 + ((i * 230 + t * 20) % 2600), 680 + (i % 4) * 40, -300 + ((i * 230 + t * 20) % 2600), 680 + (i % 4) * 40, 3, 'rgba(255,255,255,.25)');
  cargoShip(c, 760, 720, .95, { crane: o.crane ?? .5, night: o.night, stencil: o.stencil });
  FLOOR(c, 820, '#5a5048'); box(c, -400, 812, W + 800, 20, 0, '#3a332e', 4); [200, 1650].forEach(x => { box(c, x - 26, 780, 52, 40, 8, '#2b2f36'); });
  const L = []; [120, 1780].forEach(x => { sodiumLamp(c, x, 824, 340, o.night ? 1 : .4); L.push([x + 71, 500, 380]); });
  return L;
};
// rail yard: tracks, freight cars, the checker's hut. o.morning (7 A.M. version), o.empty (no trucks)
SET.railYard = (c, t, o = {}) => {
  if (o.morning) { bg(c, '#9bb8d6', '#f2c9a0'); lightPool(c, 300, 600, 600, '#ffd9a0', .45); } else NIGHT_SKY(c, t, '#070f20', '#132a44', 60);
  skyline(c, 640, o.morning ? '#8d9fb5' : '#0f1d30', o.morning ? null : 'rgba(255,200,110,.45)', 6, .8);
  FLOOR(c, 640, o.morning ? '#8a7d6c' : '#2c2a2a');
  [700, 820].forEach(ry => { line(c, -400, ry, W + 400, ry, 7, '#4a4038'); line(c, -400, ry + 26, W + 400, ry + 26, 7, '#4a4038'); for (let x = -400; x < W + 400; x += 60) line(c, x, ry - 6, x - 8, ry + 32, 9, '#5d4a38'); });
  if (!o.noTrain) freightTrain(c, 1400, 726, .55, { cars: ['box', 'box', 'box'], night: !o.morning, t, smoke: false });
  // checker's hut with lit window + loading dock
  box(c, 1280, 760, 520, 120, 6, o.morning ? '#9a8a74' : '#3d3832'); box(c, 1580, 560, 200, 200, 6, o.morning ? '#c9b89a' : '#4a4038'); poly(c, [[1560, 560], [1800, 560], [1680, 500]], '#6d4c41'); windowRect(c, 1620, 600, 80, 70, o.morning ? '#a9cde0' : '#ffd36e', { glow: !o.morning });
  sign(c, 1680, 530, 160, 40, 'CARGA', { bg: '#e9e4d6', size: 24 });
  const L = [[1660, 640, 260, '#ffd36e', .5]];
  if (!o.morning) [300, 1100].forEach(x => { sodiumLamp(c, x, 900, 400, 1); L.push([x + 71, 500, 420]); }); else [300, 1100].forEach(x => sodiumLamp(c, x, 900, 400, 0));
  return L;
};
// salvage yard behind a 10-ft solid wooden fence. o.lamps 0..1 (street lamps beyond the fence), o.blackout 0..1, o.drop (drop lights on 0..1)
SET.salvageYard = (c, t, o = {}) => {
  NIGHT_SKY(c, t, '#060c1a', '#0f2036', 70);
  skyline(c, 470, '#0c1828', (o.blackout || 0) > .5 ? null : 'rgba(255,200,110,.35)', 12, .7);
  const lampOn = clamp(o.lamps ?? 0) * (1 - clamp(o.blackout || 0)); const L = [];
  [260, 980, 1700].forEach(x => { sodiumLamp(c, x, 520, 300, lampOn); if (lampOn > 0) L.push([x + 71, 230, 520, '#ffb04a', .5 * lampOn]); });
  woodFence(c, -400, W + 400, 520 + 30, 330, { seed: 4 });
  FLOOR(c, 540, '#2e2a26'); const R = rand(21);
  for (let i = 0; i < 9; i++) { const x = R() * (W + 600) - 300, y = 590 + R() * 30, w = 140 + R() * 120; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + w / 2, y - 60 - R() * 40, x + w, y); c.closePath(); fs(c, R() > .5 ? '#3d362f' : '#34383e', 3); line(c, x + w * .3, y - 20, x + w * .6, y - 34, 4, '#5a4a3a'); }
  if (o.drop > 0) { c.beginPath(); c.moveTo(-400, 0); c.quadraticCurveTo(980, 60, W + 400, 0); c.lineWidth = 3; c.strokeStyle = '#1b1b1b'; c.stroke(); }
  // scrap: old car hulk + tyres + drums
  box(c, 60, 600, 300, 120, [40, 60, 6, 6], '#5a3a30'); circ(c, 120, 720, 34, '#1f2226'); tire(c, 1760, 760); tire(c, 1820, 720); box(c, 1620, 640, 70, 110, 8, '#8a3a2a'); box(c, 1540, 660, 70, 90, 8, '#3a5a6a');
  if (o.drop > 0) { dropLight(c, 760, 300, o.drop, 270); dropLight(c, 1200, 300, o.drop, 270); L.push([760, 380, 600, '#ffe2a0', .5 * o.drop], [1200, 380, 600, '#ffe2a0', .5 * o.drop]); }
  if (o.blackout > 0) GRADE.dark(c, o.blackout * .7);
  return L;
};
function tire(c, x, y) { circ(c, x, y, 44, '#1f2226'); circ(c, x, y, 18, '#3a3f46', 3); }
// space: deep navy with stars; o.earth / o.moon positions optional
SET.space = (c, t, o = {}) => { bg(c, '#040815', '#0b1630'); starfield(c, t, 3, 220); lightPool(c, 300, 200, 700, '#2a4a8a', .25); if (o.earth) earth(c, o.earth[0], o.earth[1], o.earth[2], t); if (o.moon) moon(c, o.moon[0], o.moon[1], o.moon[2], { far: o.far }); return []; };
// Washington analysts' room, 1959: pinned photos, light table, cork board, desk lamps
SET.washington = (c, t, o = {}) => {
  bg(c, '#3e4a46', '#2c3633');
  for (let x = -400; x < W + 400; x += 120) line(c, x, -300, x, 760, 2, 'rgba(0,0,0,.12)');
  box(c, 220, 110, 760, 420, 10, '#b98a5a'); for (let i = 0; i < 9; i++) { const R = rand(i + 3); const px = 270 + (i % 5) * 140 + R() * 20, py = 150 + Math.floor(i / 5) * 190 + R() * 20; box(c, px, py, 110, 140, 3, '#e9e4d6', 3); box(c, px + 10, py + 10, 90, 90, 2, '#6a6a6a', 2); circ(c, px + 55, py + 6, 6, RED, 2); }
  rope(c, 330, 160, 760, 360, 40, '#d9342b'); rope(c, 470, 360, 900, 170, 30, '#d9342b');
  box(c, 1180, 140, 560, 360, 8, '#2c3a36'); label(c, o.board || 'LUNIK', 1460, 200, 54, '#f3efe6', { stroke: false }); for (let i = 0; i < 5; i++) line(c, 1230, 260 + i * 46, 1690 - i * 40, 260 + i * 46, 4, 'rgba(243,239,230,.6)');
  FLOOR(c, 780, '#4a3a2e', 'rgba(0,0,0,.12)');
  if (!o.noDesk) { box(c, 420, 690, 1080, 34, 8, '#6d4c41'); line(c, 460, 724, 460, 800, 10); line(c, 1460, 724, 1460, 800, 10); [620, 1300].forEach(x => { line(c, x, 690, x, 560, 6); poly(c, [[x - 46, 560], [x + 46, 560], [x + 30, 526], [x - 30, 526]], '#2f5a3a'); lightPool(c, x, 640, 360, '#ffe2a0', .45); }); }
  return [[620, 640, 420, '#ffe2a0', .4], [1300, 640, 420, '#ffe2a0', .4]];
};
// blueprint paper (navy) for anatomy + diagrams. o.title stamps a title block bottom-right
SET.grid = (c, t, o = {}) => {
  bg(c, '#123a63', '#0d2c4d');
  c.lineWidth = 1.2; c.strokeStyle = 'rgba(200,225,255,.14)'; for (let x = -400; x < W + 400; x += 40) { c.beginPath(); c.moveTo(x, -300); c.lineTo(x, H + 300); c.stroke(); } for (let y = -300; y < H + 300; y += 40) { c.beginPath(); c.moveTo(-400, y); c.lineTo(W + 400, y); c.stroke(); }
  c.lineWidth = 2; c.strokeStyle = 'rgba(200,225,255,.25)'; for (let x = -400; x < W + 400; x += 200) { c.beginPath(); c.moveTo(x, -300); c.lineTo(x, H + 300); c.stroke(); } for (let y = -300; y < H + 300; y += 200) { c.beginPath(); c.moveTo(-400, y); c.lineTo(W + 400, y); c.stroke(); }
  lightPool(c, 960, 480, 900, '#5d9ad6', .25);
  if (o.title) { c.strokeStyle = '#e8f1ff'; c.lineWidth = 3; c.strokeRect(1460, 900, 400, 120); line(c, 1460, 950, 1860, 950, 3, '#e8f1ff'); label(c, o.title, 1660, 925, 30, '#e8f1ff', { stroke: false, maxW: 380 }); label(c, o.sub || 'SHEET 1 OF 1', 1660, 985, 22, '#a9c4e8', { stroke: false, maxW: 380 }); }
  return [];
};
// cream graph paper (the bible's grid) for light diagrams / timelines
SET.paper = (c, t, o = {}) => { bg(c, '#f2ecdc', '#e6dcc4'); c.lineWidth = 1.5; c.strokeStyle = 'rgba(80,120,170,.22)'; for (let x = -400; x < W + 400; x += 48) { c.beginPath(); c.moveTo(x, -300); c.lineTo(x, H + 300); c.stroke(); } for (let y = -300; y < H + 300; y += 48) { c.beginPath(); c.moveTo(-400, y); c.lineTo(W + 400, y); c.stroke(); } lightPool(c, 960, 420, 800, '#fff3c4', .5); return []; };
// top-down desk: green leather blotter, lamp pool, coffee ring, pencil, paper clips. Place dossiers/photos on it
SET.desk = (c, t, o = {}) => {
  bg(c, '#3a2618', '#2a1a10'); for (let i = -10; i < 30; i++) line(c, -400, i * 60 + Math.sin(i) * 10, W + 400, i * 60 + 20, 3, 'rgba(0,0,0,.15)');
  box(c, 160, 90, 1600, 900, 12, '#2f4a3a'); box(c, 180, 110, 1560, 860, 6, null, 2);
  lightPool(c, o.lx ?? 900, o.ly ?? 480, 900, '#ffd890', .4);
  c.save(); c.globalAlpha = .3; c.beginPath(); c.arc(1600, 820, 60, 0, TAU); c.lineWidth = 8; c.strokeStyle = '#2a1a10'; c.stroke(); c.restore();
  c.save(); c.translate(1640, 260); c.rotate(.9); box(c, -10, -150, 20, 280, 3, '#d9a441'); poly(c, [[-10, 130], [10, 130], [0, 160]], '#f2d0a4'); c.restore();
  [[280, 900], [320, 930]].forEach(([x, y]) => { c.save(); c.translate(x, y); c.rotate(.4); rr(c, -20, -8, 40, 16, 8); fs(c, null, 3); c.restore(); });
  return [[o.lx ?? 900, o.ly ?? 480, 900, '#ffd890', .3]];
};
// darkroom: red safelight, trays, prints on a line
SET.darkroom = (c, t, o = {}) => { bg(c, '#2a0a0a', '#140404'); lightPool(c, 960, 160, 900, '#ff3a2a', .45); box(c, 920, 80, 80, 50, 8, '#ff5040'); lightPool(c, 960, 110, 200, '#ff6a5a', .9);
  line(c, -400, 300, W + 400, 300, 3, '#8a7060'); for (let i = 0; i < 6; i++) { const x = 160 + i * 300; box(c, x - 8, 290, 16, 24, 3, '#c9ced4', 2.5); box(c, x - 70, 310, 140, 170, 3, '#d8cfc2', 3); box(c, x - 58, 322, 116, 120, 2, '#4a4040', 0); }
  FLOOR(c, 760, '#1e0a08'); box(c, 300, 640, 1320, 40, 8, '#3a2622'); return [[960, 160, 900, '#ff3a2a', .3]]; };
// hotel corridor/room at night: one door, sconce lamps, patterned carpet
SET.hotel = (c, t, o = {}) => { bg(c, '#5a2e2a', '#3a1c1a'); for (let x = -400; x < W + 400; x += 80) for (let y = 0; y < 760; y += 80) circ(c, x + (y / 80 % 2) * 40, y + 40, 6, 'rgba(255,210,150,.12)', 0);
  [560, 1360].forEach(x => { box(c, x - 20, 360, 40, 60, 8, '#c9a14a', 3); lightPool(c, x, 380, 260, '#ffc870', .6); }); FLOOR(c, 820, '#6a2a24'); for (let x = -400; x < W + 400; x += 120) poly(c, [[x, 900], [x + 60, 860], [x + 120, 900], [x + 60, 940]], '#7a3a2e', 0);
  return [[560, 380, 360, '#ffc870', .45], [1360, 380, 360, '#ffc870', .45]]; };
// black + spotlight (for single-subject beats). o.x spot position, o.col light colour
SET.black = (c, t, o = {}) => { bg(c, '#050608', '#0b0d12'); return []; };
SET.spot = (c, t, o = {}) => { bg(c, '#0e141f', '#18202c'); for (let x = -300; x < W + 300; x += 180) line(c, x, -300, x, 900, 2, 'rgba(255,255,255,.035)'); cone(c, o.x ?? 960, -100, 160, 760, 1000, o.col || '#ffe9c0', .26); FLOOR(c, 900, '#161c26'); c.save(); c.globalAlpha = .32; ell(c, o.x ?? 960, 920, 380, 60, o.col || '#ffe9c0', 0); c.restore(); return []; };
// open road at the last turn-off, dusk -> night. o.dusk 0..1
SET.road = (c, t, o = {}) => { const d = clamp(o.dusk ?? .3); NIGHT_SKY(c, t, d > .5 ? '#2a3a5e' : '#081226', d > .5 ? '#d98a5a' : '#1d3550', 30 * (1 - d)); skyline(c, 640, '#0f1d30', 'rgba(255,200,110,.5)', 8, .7);
  FLOOR(c, 640, '#2e3a2e'); poly(c, [[-400, 1200], [W + 400, 1200], [1200, 700], [760, 700]], '#3a3f46', 4); for (let i = 0; i < 6; i++) { const k = i / 6; c.fillStyle = 'rgba(255,220,150,.6)'; c.fillRect(lerp(978, 960, k) - lerp(4, 18, k), lerp(710, 1150, k), lerp(8, 36, k), lerp(14, 60, k)); }
  poly(c, [[1080, 700], [1180, 700], [W + 400, 860], [W + 400, 960]], '#3a3f46', 4); sign(c, 1400, 660, 280, 66, o.sign || 'ESTACIÓN', { bg: '#e9e4d6', size: 32, post: 120 }); sodiumLamp(c, 1300, 820, 300, 1);
  return [[1371, 520, 380, '#ffb04a', .5]]; };
