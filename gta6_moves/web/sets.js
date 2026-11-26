// ---------- sets: each place has one mood, light from inside, always dressed ----------
const SET = {};
const FLOOR = (c, y, col, line_) => { c.fillStyle = col; c.fillRect(-400, y, W + 800, H + 400 - y); line(c, -400, y, W + 400, y, LW); if (line_) for (let x = -400; x < W + 400; x += 160) line(c, x, y + 6, x - 200, H + 300, 2.5, line_); };

SET.trading = (c, t, o = {}) => { // red panic trading floor
  bg(c, '#3a0d12', '#6e1a1f');
  lightPool(c, 960, 300, 900, '#ff4433', .35);
  // wall ticker board
  box(c, 260, 70, 1400, 300, 18, '#120608');
  rr(c, 280, 90, 1360, 260, 10); fs(c, '#1d0a0c', 3);
  c.save(); rr(c, 280, 90, 1360, 260, 10); c.clip();
  const tick = ['TTWO', 'MKT', 'GAME', 'TECH', 'BANK', 'OIL', 'CHIP', 'FOOD'];
  for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) { const x = 280 + ((i * 220 - t * 90 * (r % 2 ? -1 : 1)) % 1980 + 1980) % 1980 - 200, y = 140 + r * 80; label(c, tick[(i + r) % 8] + (r === 1 && i % 2 ? ' ▲' : ' ▼'), x, y, 34, r === 1 && i % 2 ? GREEN : RED, { stroke: false, glow: r === 1 && i % 2 ? GREEN : RED }); }
  c.restore();
  // row of clocks
  clock(c, 140, 160, 56, o.hh ?? 9, o.mm ?? 40); label(c, 'NEW YORK', 140, 250, 24, '#fff');
  clock(c, 1780, 160, 56, ((o.hh ?? 9) + 5) % 24, o.mm ?? 40); label(c, 'LONDON', 1780, 250, 24, '#fff');
  FLOOR(c, 780, '#4a1216', 'rgba(0,0,0,.25)');
  // desks with monitors + papers
  if (!o.noDesks) [300, 960, 1620].forEach((x, i) => { monitor(c, x - 80, 760, 150, 100, '#160b0d', { graph: 1, down: true, seed: i }); monitor(c, x + 80, 760, 150, 100, '#160b0d', { graph: 1, down: i !== 1, seed: i + 3 }); desk(c, x, 790, 380, { col: '#5c2a22' }); paperSheet(c, x - 150, 870, .3, .8); });
  paperSheet(c, 640 + Math.sin(t) * 30, 420 + ((t * 60) % 400), t, .7); paperSheet(c, 1300, 300 + ((t * 45) % 500), -t * .8, .7);
};
SET.street = (c, t, o = {}) => { // clean daylight blue
  bg(c, '#7cc6f2', '#cfefff');
  lightPool(c, 1500, 120, 500, '#fff7c2', .6); circ(c, 1500, 130, 70, '#ffe36e', 4);
  cloud(c, (260 + t * 12) % 2300 - 200, 150, 1.1); cloud(c, (1100 + t * 8) % 2300 - 200, 230, .8);
  // back buildings
  [[-80, 330, 260, '#a9c4dd'], [200, 260, 200, '#93b3cf'], [420, 360, 240, '#b7cde0'], [1280, 300, 220, '#9fbbd5'], [1520, 240, 260, '#b2c9de'], [1800, 330, 240, '#a2bfd8']].forEach(([x, y, w, col]) => { box(c, x, y, w, 900 - y, 6, col); for (let yy = y + 30; yy < 820; yy += 70) for (let xx = x + 24; xx < x + w - 40; xx += 60) windowRect(c, xx, yy, 34, 42, '#e8f6ff'); });
  if (!o.noHQ) { // company HQ
    box(c, 680, 200, 560, 700, 10, '#e9e2d0');
    for (let yy = 260; yy < 800; yy += 90) for (let xx = 720; xx < 1200; xx += 90) windowRect(c, xx, yy, 56, 60, '#cfe9ff');
    sign(c, 960, 170, 420, 90, o.hq || 'TAKE-TWO HQ', { bg: '#1d3557', fg: '#fff', size: 52 });
    box(c, 900, 790, 120, 110, 6, '#6d4c41'); pigeon(c, 760, 196, .9, t); pigeon(c, 1150, 196, .9, t + 1, true);
  }
  FLOOR(c, 900, '#bfc5cc'); c.fillStyle = '#8f969e'; c.fillRect(-400, 960, W + 800, 200); line(c, -400, 960, W + 400, 960, LW);
  for (let x = -100; x < 2100; x += 220) { c.fillStyle = '#f1f1f1'; c.fillRect(x, 1020, 110, 12); }
  if (!o.noTrees) { tree(c, 120, 905, 1.1); tree(c, 1800, 905, 1.1); lamp(c, 560, 905, 330); lamp(c, 1360, 905, 330); }
  pigeon(c, 420, 905, 1, t); pigeon(c, 1500, 905, 1, t + 2, true);
};
SET.grid = (c, t, o = {}) => { // off-white grid paper for charts
  bg(c, '#f7f3e8', '#efe8d6');
  c.lineWidth = 1.5; c.strokeStyle = 'rgba(80,120,170,.25)';
  for (let x = -400; x < W + 400; x += 48) { c.beginPath(); c.moveTo(x, -300); c.lineTo(x, H + 300); c.stroke(); }
  for (let y = -300; y < H + 300; y += 48) { c.beginPath(); c.moveTo(-400, y); c.lineTo(W + 400, y); c.stroke(); }
  lightPool(c, 960, 420, 800, '#fff3c4', .5);
  if (!o.bare) { // desk dressing: mug, pencil, sticky notes, ruler
    box(c, 70, 820, 120, 150, 14, '#e76f51'); c.beginPath(); c.arc(190, 890, 34, -Math.PI / 2, Math.PI / 2); fs(c, null, 8);
    c.save(); c.translate(1760, 900); c.rotate(-.5); box(c, -14, -170, 28, 300, 4, '#f4c430'); poly(c, [[-14, 130], [14, 130], [0, 170]], '#f2d0a4'); c.restore();
    box(c, 1700, 90, 150, 140, 4, '#fff176'); label(c, o.note || 'TTWO', 1775, 160, 34, INK, { stroke: false, rot: .05, maxW: 130 });
    box(c, 60, 80, 140, 130, 4, '#a5d6a7'); label(c, o.note2 || 'NOV 19', 130, 145, 30, INK, { stroke: false, rot: -.06, maxW: 120 });
  }
};
SET.spot = (c, t, o = {}) => { // deep blue-grey spotlight for question shots
  bg(c, '#1c2433', '#2b3548');
  for (let x = -300; x < W + 300; x += 180) line(c, x, -300, x, 900, 2, 'rgba(255,255,255,.04)');
  cone(c, o.x ?? 960, -100, 160, 760, 1000, '#dfe8ff', .28);
  FLOOR(c, 900, '#222b3b');
  c.save(); c.globalAlpha = .35; ell(c, o.x ?? 960, 920, 380, 60, '#c9d6ff', 0); c.restore();
};
SET.night = (c, t, o = {}) => { // night city with billboard glow
  bg(c, '#0b1026', '#1d1846');
  const R = rand(4); for (let i = 0; i < 70; i++) { const x = R() * W * 1.3 - 200, y = R() * 400; circ(c, x, y, R() * 2 + 1, `rgba(255,255,255,${.4 + .4 * Math.sin(t * 2 + i)})`, 0); }
  circ(c, 260, 140, 50, '#fff6d6', 4);
  [[-100, 380, 240], [150, 300, 180], [1500, 320, 220], [1720, 260, 300]].forEach(([x, y, w], k) => { box(c, x, y, w, 900 - y, 6, '#252a4a'); for (let yy = y + 30; yy < 860; yy += 60) for (let xx = x + 20; xx < x + w - 30; xx += 50) if ((xx + yy + k) % 3) windowRect(c, xx, yy, 28, 36, '#ffd36e'); });
  FLOOR(c, 900, '#1a1a2e'); lamp(c, 380, 905, 330, true); lamp(c, 1540, 905, 330, true);
};
SET.store = (c, t, o = {}) => { // games store interior
  bg(c, '#f3e6d0', '#e6d2b0');
  for (let x = 160; x < 1900; x += 400) { box(c, x - 50, -10, 100, 30, 6, '#fff', 3); lightPool(c, x, 40, 360, '#fffbe0', .4); }
  sign(c, 960, 90, 520, 90, o.sign || 'GAMES', { bg: '#e63946', fg: '#fff', size: 58 });
  [[80, 'left'], [1440, 'right']].forEach(([x]) => { box(c, x, 180, 400, 620, 10, '#b5835a'); for (let r = 0; r < 4; r++) { line(c, x, 330 + r * 150, x + 400, 330 + r * 150, LW); if (!o.empty) for (let i = 0; i < 5; i++) { const R = rand(r * 7 + i + x); gameBox(c, x + 50 + i * 75, 325 + r * 150, 54, 110, { title: 'GAME', }); } } });
  FLOOR(c, 800, '#d9c4a0', 'rgba(0,0,0,.08)');
  plant(c, 560, 805, 1);
};
SET.office = (c, t, o = {}) => { // warm office wall (calendars, clocks)
  bg(c, o.wall || '#e9dcc3', '#dccaa8');
  for (let x = -400; x < W + 400; x += 120) line(c, x, -300, x, 760, 2, 'rgba(0,0,0,.05)');
  windowRect(c, 120, 140, 300, 340, o.night ? '#1d2a4a' : '#bfe3ff', { glow: 1 }); if (!o.night) cloud(c, 240, 260, .5);
  lightPool(c, 960, 360, 700, '#fff0c8', .45);
  FLOOR(c, 760, '#9b7653', 'rgba(0,0,0,.08)');
  plant(c, 1800, 765, 1.2); box(c, 1500, 560, 160, 200, 8, '#6d4c41'); for (let i = 0; i < 3; i++) box(c, 1515, 580 + i * 60, 130, 44, 4, '#8d6e63', 3);
};
SET.bakery = (c, t) => {
  bg(c, '#fbe3d0', '#f5cdb0');
  for (let i = -2; i < 14; i++) { c.fillStyle = i % 2 ? '#e85d75' : '#fff'; c.fillRect(i * 160, 0, 160, 120); } line(c, -400, 120, W + 400, 120, LW);
  for (let i = -2; i < 14; i++) { c.beginPath(); c.arc(i * 160 + 80, 120, 80, 0, Math.PI); fs(c, i % 2 ? '#e85d75' : '#fff'); }
  sign(c, 960, 260, 400, 90, 'BAKERY', { bg: '#7a3e2b', fg: '#fff', size: 56 });
  lightPool(c, 960, 500, 700, '#fff1c9', .5);
  box(c, 120, 360, 300, 260, 10, '#fff'); [0, 1, 2].forEach(i => { ell(c, 190 + i * 80, 470, 32, 22, '#d99a4e'); ell(c, 190 + i * 80, 560, 32, 22, '#e8b46a'); });
  box(c, 1500, 360, 300, 260, 10, '#fff'); [0, 1, 2].forEach(i => { circ(c, 1570 + i * 80, 470, 26, '#c56b3d'); circ(c, 1570 + i * 80, 560, 26, '#f3c9a0'); });
  FLOOR(c, 800, '#c99f7c', 'rgba(0,0,0,.08)');
  box(c, 300, 640, 1320, 170, 14, '#e9c9a6'); plant(c, 1760, 805, 1);
};
SET.kitchen = (c, t) => {
  bg(c, '#e3f1e8', '#cfe5d7'); for (let x = -400; x < W + 400; x += 60) for (let y = 300; y < 560; y += 60) { rr(c, x, y, 60, 60, 0); fs(c, null, 1.5); }
  windowRect(c, 760, 120, 400, 260, '#bfe3ff', { glow: 1 }); lightPool(c, 960, 260, 600, '#fff6d6', .5);
  box(c, 1460, 140, 300, 640, 20, '#f4f7fa'); line(c, 1460, 380, 1760, 380, LW); box(c, 1480, 200, 16, 120, 6, '#bbb', 3);
  FLOOR(c, 780, '#c9a27e', 'rgba(0,0,0,.06)'); box(c, 300, 600, 900, 30, 8, '#8d6e63'); line(c, 340, 630, 340, 790, 10); line(c, 1160, 630, 1160, 790, 10);
  plant(c, 200, 785, 1);
};
SET.pizza = (c, t) => {
  bg(c, '#3b2216', '#5a3322'); lightPool(c, 960, 380, 800, '#ffb35c', .5);
  for (let x = -400; x < W + 400; x += 80) for (let y = 560; y < 800; y += 40) { rr(c, x + (y / 40 % 2) * 40, y, 80, 40, 0); fs(c, '#7a3a22', 2); }
  box(c, 120, 100, 520, 300, 14, '#1d1d1d'); label(c, 'MENU', 380, 150, 50, '#ffe082', { stroke: false }); ['SLICE ... $3', 'WHOLE ... $18', 'SODA ... $2'].forEach((s, i) => label(c, s, 380, 220 + i * 56, 36, '#fff', { stroke: false }));
  c.beginPath(); c.arc(1560, 420, 230, Math.PI, 0); c.lineTo(1790, 560); c.lineTo(1330, 560); c.closePath(); fs(c, '#9e5b3c'); c.beginPath(); c.arc(1560, 470, 120, Math.PI, 0); c.closePath(); fs(c, '#2a1208'); lightPool(c, 1560, 440, 150, '#ff7a1a', .7);
  FLOOR(c, 800, '#6b3b26'); box(c, 220, 600, 1480, 210, 14, '#c99a66');
};
SET.lobby = (c, t) => {
  bg(c, '#dfe7ee', '#c9d5df'); lightPool(c, 960, 300, 800, '#ffffff', .5);
  for (let x = 0; x < W; x += 320) { box(c, x + 20, 60, 280, 40, 6, '#fff', 3); }
  FLOOR(c, 800, '#9aa7b3', 'rgba(255,255,255,.2)'); plant(c, 150, 805, 1.3); plant(c, 1780, 805, 1.3);
  box(c, 1500, 560, 220, 240, 10, '#3d5a80'); label(c, 'LOBBY', 1610, 600, 30, '#fff');
};
SET.party = (c, t, o = {}) => {
  bg(c, '#ffe1ec', '#ffc8da'); lightPool(c, 960, 360, 800, '#fff4fb', .5);
  for (let i = 0; i < 12; i++) { const x = i * 170 + 40; c.beginPath(); c.moveTo(x, 40); c.quadraticCurveTo(x + 85, 110, x + 170, 40); c.lineWidth = 3; c.strokeStyle = INK; c.stroke(); poly(c, [[x + 60, 70], [x + 110, 70], [x + 85, 120]], ['#ff6f91', '#ffc75f', '#58d68d', '#5dade2'][i % 4], 3); }
  if (o.banner !== false) sign(c, 960, 200, 620, 100, 'SURPRISE!', { bg: '#fff', fg: '#ff4f8b', size: 70 });
  FLOOR(c, 800, '#d99ab0', 'rgba(0,0,0,.06)'); box(c, 1380, 620, 360, 30, 8, '#fff'); line(c, 1420, 650, 1420, 800, 9); line(c, 1700, 650, 1700, 800, 9);
  // cake on table
  box(c, 1490, 540, 140, 80, 10, '#fff1f6'); box(c, 1490, 540, 140, 22, 8, '#ff8fb7', 3); line(c, 1560, 540, 1560, 500, 6); ell(c, 1560, 492, 7, 12, '#ffcc33', 2.5);
};
SET.stadium = (c, t, o = {}) => {
  bg(c, '#0f1d33', '#1c3357');
  [200, 760, 1160, 1720].forEach(x => { line(c, x, 260, x, 40, 10); box(c, x - 70, 0, 140, 50, 8, '#e8eef7'); cone(c, x, 50, 120, 700, 900, '#f5fbff', .14); });
  c.fillStyle = '#273a5c'; c.beginPath(); c.moveTo(-400, 300); c.lineTo(W + 400, 300); c.lineTo(W + 400, 700); c.lineTo(-400, 700); c.fill();
  FLOOR(c, 760, '#3c9a4c'); for (let x = -400; x < W + 400; x += 200) { c.fillStyle = 'rgba(255,255,255,.07)'; c.fillRect(x, 760, 100, 400); }
  line(c, -400, 900, W + 400, 900, 4, '#fff');
};
SET.exchange = (c, t) => { // New York exchange building, daylight
  bg(c, '#8ecdf5', '#d6efff'); cloud(c, 300 + t * 8, 140, 1); cloud(c, 1500 - t * 6, 200, .8);
  [[-120, 260, 300], [1720, 220, 320]].forEach(([x, y, w]) => { box(c, x, y, w, 700, 6, '#a7bfd6'); for (let yy = y + 30; yy < 860; yy += 70) for (let xx = x + 20; xx < x + w - 30; xx += 60) windowRect(c, xx, yy, 34, 42, '#e8f6ff'); });
  poly(c, [[360, 300], [960, 120], [1560, 300]], '#f1ead8'); label(c, 'STOCK EXCHANGE', 960, 245, 54, INK, { stroke: false, maxW: 760 });
  box(c, 380, 300, 1160, 60, 4, '#e6dcc4');
  for (let i = 0; i < 6; i++) { const x = 460 + i * 200; box(c, x - 34, 360, 68, 480, 6, '#f6f0e2'); line(c, x - 12, 380, x - 12, 820, 2.5, '#cbbf9f'); line(c, x + 12, 380, x + 12, 820, 2.5, '#cbbf9f'); }
  box(c, 360, 840, 1200, 60, 4, '#d9cfb6');
  FLOOR(c, 900, '#bfc5cc'); pigeon(c, 600, 300, .9, t); pigeon(c, 1300, 300, .9, t + 1, true);
};
SET.houses = (c, t, o = {}) => { // night street of houses
  bg(c, '#0a1430', '#1a2552'); const R = rand(8); for (let i = 0; i < 60; i++) circ(c, R() * W * 1.2 - 100, R() * 360, R() * 2 + 1, '#fff', 0);
  circ(c, 1650, 140, 56, '#fff3c4', 4);
  for (let i = 0; i < 5; i++) { const x = 40 + i * 380, lit = o.lit ? o.lit(i) : 1;
    box(c, x, 470, 300, 330, 6, ['#6b5b95', '#88b04b', '#c94c4c', '#3e7cb1', '#d08c60'][i]); poly(c, [[x - 20, 480], [x + 150, 330], [x + 320, 480]], '#5a3a2e');
    windowRect(c, x + 40, 540, 90, 80, lit > 0 ? '#ffd36e' : '#2a2f4a', { glow: lit > 0 }); windowRect(c, x + 170, 540, 90, 80, lit > 0 ? '#ffd36e' : '#2a2f4a', { glow: lit > 0 }); box(c, x + 115, 680, 70, 120, 4, '#3b2a20');
    if (o.dl) o.dl(c, x + 150, 290, i);
  }
  FLOOR(c, 800, '#1d2340'); lamp(c, 360, 805, 280, true); lamp(c, 1540, 805, 280, true);
};
SET.tech = (c, t) => { // night green glow for tech
  bg(c, '#04140d', '#0b2a1b'); lightPool(c, 960, 420, 900, '#2dff9a', .28);
  c.lineWidth = 2; c.strokeStyle = 'rgba(60,255,160,.18)'; for (let i = 0; i < 14; i++) { const y = 80 + i * 60; c.beginPath(); c.moveTo(-200, y); c.lineTo(300 + i * 20, y); c.lineTo(340 + i * 20, y + 40); c.lineTo(600, y + 40); c.stroke(); c.beginPath(); c.moveTo(W + 200, y); c.lineTo(1620 - i * 20, y); c.lineTo(1580 - i * 20, y + 40); c.lineTo(1320, y + 40); c.stroke(); }
  [[140, 200], [1680, 200]].forEach(([x, y]) => { box(c, x, y, 120, 560, 10, '#0f2a1f'); for (let k = 0; k < 9; k++) { box(c, x + 14, y + 20 + k * 60, 92, 40, 4, '#123a2a', 3); circ(c, x + 90, y + 40 + k * 60, 5, (k + Math.floor(t * 3)) % 3 ? '#38ff9c' : '#ffcc33', 0); } });
  FLOOR(c, 800, '#07190f', 'rgba(60,255,160,.08)');
};
SET.basement = (c, t) => { bg(c, '#2a2622', '#3a332c'); for (let x = -400; x < W + 400; x += 140) for (let y = 0; y < 780; y += 70) { rr(c, x + (y / 70 % 2) * 70, y, 140, 70, 0); fs(c, null, 2); } cone(c, 960, 0, 60, 500, 800, '#ffe9b0', .25); circ(c, 960, 20, 18, '#ffe9b0', 3); FLOOR(c, 780, '#4a4038'); for (let i = 0; i < 6; i++) box(c, 200 + i * 40, 680 - i * 10, 120, 100, 6, '#9c7b55'); };
SET.museum = (c, t) => { bg(c, '#f0e6d6', '#e2d3bc'); lightPool(c, 960, 260, 900, '#fff4d8', .5); for (let x = 0; x < W; x += 480) { box(c, x + 40, 0, 50, 760, 4, '#e8dcc6'); }
  FLOOR(c, 760, '#8b6b4a', 'rgba(0,0,0,.08)'); line(c, 200, 700, 1720, 700, 6, '#b8860b'); [300, 700, 1100, 1500].forEach(x => { line(c, x, 700, x, 760, 6); }); };
SET.living = (c, t) => { bg(c, '#2b2340', '#3d3157'); windowRect(c, 160, 160, 300, 300, '#1b2a55'); circ(c, 380, 230, 26, '#fff3c4', 3);
  lightPool(c, 1500, 380, 500, '#ffd59a', .45); line(c, 1500, 760, 1500, 360, 8); poly(c, [[1440, 300], [1560, 300], [1590, 380], [1410, 380]], '#ffd59a'); plant(c, 1760, 765, 1.1);
  FLOOR(c, 760, '#5a4636'); box(c, 200, 700, 1520, 20, 6, '#8a6a52');
  ell(c, 960, 840, 520, 60, '#7a4a6a', 4); };
SET.vault = (c, t) => { bg(c, '#2c2f36', '#454a54'); lightPool(c, 960, 400, 800, '#ffd36e', .35);
  circ(c, 1620, 420, 300, '#8a8f98'); circ(c, 1620, 420, 240, '#9ea3ab'); for (let a = 0; a < 6; a++) line(c, 1620, 420, 1620 + Math.cos(a + t * .2) * 120, 420 + Math.sin(a + t * .2) * 120, 12); circ(c, 1620, 420, 40, '#6e737c');
  for (let x = -400; x < 1300; x += 200) { line(c, x, 0, x, 780, 3, 'rgba(255,255,255,.08)'); }
  FLOOR(c, 780, '#3a3d44', 'rgba(255,255,255,.05)'); };

// sets never register framing boxes (only the subjects inside them do)
for (const k in SET) { const f = SET[k]; SET[k] = (...a) => { const was = REG.on; REG.on = false; try { f(...a); } finally { REG.on = was; } }; }
