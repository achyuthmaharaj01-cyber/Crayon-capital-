// ---------- shots: "Tulip Mania" demo. Every beat and every transition is keyed to a spoken word. ----------
const PIETER = { skin: P.skin2, coat: '#2c2a33', collar: 'dutch', hat: 'capotain', hair: 'side', seed: 2 };
const BUYER = { skin: P.skin1, coat: '#4b3a52', collar: 'dutch', hat: 'capotain', hatCol: '#3a3340', hair: 'tufts', wrinkles: 1, mustache: '#e9e6df', seed: 4 };
const TRADER = { skin: P.skin3, coat: '#3f4f3a', collar: 'dutch', hat: 'beret', hatCol: '#7a2e2e', noseCol: '#b9646c', seed: 7 };
const pop = (T, tt, d = .35) => easeOut(T.at(tt, d));
function callout(c, text, tx, ty, lx, ly, a, bow = 30) { if (a <= 0) return; c.save(); c.globalAlpha = clamp(a * 1.6); hand(c, text, lx, ly, 62, '#fbf8ef', { stroke: 6, strokeCol: 'rgba(22,16,22,.8)' }); arrow(c, lx + (tx > lx ? 30 : -30) * 0, ly + 36, tx, ty, bow, clamp(a * 1.3)); c.restore(); }
function thought(c, x, y, w, h, p, inner, from) {
  if (p <= 0) return; c.save(); c.globalAlpha = clamp(p * 2.5);
  if (from) [[.25, 10], [.5, 16]].forEach(([k, r], i) => { if (p > .15 + i * .15) circ(c, lerp(from[0], x - w * .3, k), lerp(from[1], y + h * .4, k), r, '#fbfaf4', 3.4); });
  const s = .6 + .4 * easeOut(p); c.translate(x, y); c.scale(s, s);
  c.beginPath(); const N = 11; for (let i = 0; i <= N; i++) { const a = i / N * TAU, a2 = (i + .5) / N * TAU; const px = Math.cos(a) * w / 2, py = Math.sin(a) * h / 2, qx = Math.cos(a2) * w * .62, qy = Math.sin(a2) * h * .62; if (!i) c.moveTo(px, py); else c.quadraticCurveTo(Math.cos(a - Math.PI / N) * w * .62, Math.sin(a - Math.PI / N) * h * .62, px, py); }
  ink(c, '#fbfaf4', 3.6); inner(c); c.restore();
}
function priceTag(c, x, y, txt, rot = 0, a = 1, strike = 0) { if (a <= 0) return; c.save(); c.globalAlpha = clamp(a); c.translate(x, y); c.rotate(rot); ln(c, 0, -70, 0, -22, 2.4, '#cfc6b0');
  poly(c, [[-70, -20], [50, -20], [80, 20], [50, 60], [-70, 60]], '#e9c76a', LW); circ(c, 52, 20, 7, '#14121c', 2.6);
  sign(c, txt, -8, 22, 40, INK, { maxW: 110 }); if (strike > 0) ln(c, -60, 22, -60 + 110 * easeOut(strike), 22, 6, P.red); c.restore(); }

// ===== S1 street, dusk. date card; push through Pieter's lit window
shot({ key: 'street', at: 0, set: (c, T) => setStreet(c, T, {
    walker: (c, T) => person(c, { ...TRADER, x: -120 + T.t * 95, y: 700, s: .42, legs: 'walk', walk: T.t * 6.2, t: T.t, shadow: false }) }),
  cams: [[0, 960, 470, 1.0], [2.6, 820, 540, 1.7, 2.4]], push: .01,
  overlay: (c, T) => { const a = pop(T, cue('L1', 'harlem', 0, -.2), .5) * (1 - smooth((T.t - 2.6) / .4)); if (a > 0) { c.save(); c.globalAlpha = a; hand(c, 'Haarlem, 1636', 80, 92, 84, '#fbf8ef', { align: 'left', stroke: 6, strokeCol: 'rgba(22,16,22,.8)' }); c.restore(); } },
  out: { type: 'push', d: 1.25, bias: .62, win: STREET_WIN }, subY: 960 });
SFX.push({ n: 'whoosh2', t: 2.55, g: -12 }); SUBSKIP.push([0, 2.5]);

// ===== S2 Pieter's front room
shot({ key: 'home', at: cue('L1', 'peter', 0, -.25), set: (c, T) => setHome(c, T, { cast: (c, T) => {
    const t = T.t, idea = cue('L1', 'bad'), dogT = cue('L1', 'loyal');
    dog(c, { x: 1260, y: 950, t, s: 1.05, wag: .35 + .65 * T.at(dogT, .3), wagFast: t > dogT, tongue: t > dogT + .2, tilt: t > dogT ? Math.sin(t * 3) * .05 : 0 });
    const lookDog = T.at(dogT - .1, .3) * (1 - T.at(idea - .3, .3));
    person(c, { ...PIETER, x: 760, y: 935, s: 1.15, t, expr: t > idea ? 'sly' : 'neutral', look: lookDog * 1 + (t > idea ? -.3 : 0), lookY: t > idea ? -.8 : 0,
      arms: { l: [.12, .15], r: [.14, .2] } });
    thought(c, 520, 300, 300, 210, pop(T, idea, .45), c => { bulb(c, 0, 10, .85); }, [700, 560]);
    callout(c, 'Pieter', 760, 520, 600, 380, pop(T, cue('L1', 'peter'), .4) * (1 - T.at(cue('L1', 'small'), .3)), -40);
  } }),
  cams: [[3.2, 790, 640, 1.9], [cue('L1', 'small'), 900, 600, 1.25, 1.0], [cue('L1', 'loyal', 0, -.05), 1265, 870, 2.6, .8], [cue('L1', 'bad', 0, .1), 580, 520, 1.6, 1.0]],
  out: { type: 'whip', d: .45, dir: 1 }, subY: 1000 });
SFX.push({ n: 'pop', t: cue('L1', 'bad'), g: -14 }, { n: 'whoosh1', t: cue('L2', 'because', 0, -.25), g: -10 });

// ===== S3 tavern gossip: bubbles pop word by word; one carries a bulb (match anchor)
shot({ key: 'gossip', at: cue('L2', 'because', 0, -.12), set: (c, T) => setTavern(c, T, { cast: (c, T) => {
    const t = T.t; table(c, 560, 830, 380, '#6b4a2e'); table(c, 1260, 830, 380, '#6b4a2e');
    const folk = [[300, '#6d3b3b', 'cap', 'worried', 5, P.skin1], [560, '#4a5368', 'capotain', 'shock', 6, P.skin2], [960, '#5b4334', null, 'happy', 8, P.skin3], [1260, '#3f4f3a', 'beret', 'grin', 9, P.skin1]];
    const keys = [cue('L2', 'everyone'), cue('L2', 'town'), cue('L2', 'talking'), cue('L2', 'tulips')];
    folk.forEach(([x, coat, hat, expr, seed, skin], i) => person(c, { x, y: 1010, s: 1.0, t, coat, hat, hatCol: hat === 'beret' ? '#7a2e2e' : undefined, collar: hat === 'cap' ? null : 'dutch', apron: hat === 'cap' ? '#e8e2d0' : null, hair: hat === 'cap' ? 'bun' : 'side', hairCol: '#5a3a22', expr: t > keys[i] ? expr : 'neutral', skin, seed, talk: t > keys[i] && t < keys[i] + .9 ? (VOENV(t) * .9) : 0, look: i < 2 ? .6 : -.6, arms: { l: [t > keys[i] ? 2.2 : .12, .2], r: [.12, .15] } }));
    person(c, { ...PIETER, x: 1640, y: 1010, s: 1.0, t, expr: 'think', look: -1 + Math.sin(t * 2.1) * .3, arms: { l: [.6, .3], r: [.12, .15] } });
    const B = ['Did you hear?', 'Tulips!', 'TULIPS!', '']; const bx = [330, 620, 960, 1290], by = [560, 470, 360, 500];
    B.forEach((txt, i) => { if (i === 3) return; bubble(c, txt, bx[i], by[i], [300, 560, 960, 1260][i], 700, pop(T, keys[i], .3), 50); });
    const pb = pop(T, keys[3], .3); if (pb > 0) { c.save(); c.globalAlpha = clamp(pb * 3); const s = .6 + .4 * pb; c.translate(1290, 470); c.scale(s, s); c.beginPath(); c.roundRect(-90, -80, 180, 160, 18); ink(c, '#fbfaf4', 3.6); poly(c, [[-14, 78], [-30, 220 / s - 10], [14, 78]], '#fbfaf4', 3.6); c.fillStyle = '#fbfaf4'; c.fillRect(-12, 70, 24, 10); bulb(c, 0, 4, .62); c.restore(); }
  } }),
  cams: [[cue('L2', 'because'), 560, 640, 1.6], [cue('L2', 'town', 0, .1), 900, 600, 1.35, 1.0], [cue('L2', 'tulips', 0, .05), 1260, 600, 1.55, .9]], push: .015,
  out: { type: 'match', d: 1.1, a: [1290, 474, 100], b: [960, 575, 160], size: 360 }, subY: 1010 });
SFX.push({ n: 'crowdtalk', t: cue('L2', 'everyone', 0, -.3), g: -22, len: 3 }, ...['everyone', 'town', 'talking', 'tulips'].map(w => ({ n: 'pop', t: cue('L2', w), g: -16 })), { n: 'whoosh3', t: cue('L3', 'a', 0, -.45), g: -14 });

// ===== S4 stage: a single bulb; an onion arrives for scale
shot({ key: 'bulb', at: cue('L3', 'a', 0, -.15), set: (c, T) => setStage(c, T, { dome: false, item: (c, T) => {
    const t = T.t, on = cue('L3', 'onion'), sm = cue('L3', 'smaller');
    const g = pop(T, cue('L3', 'single'), .6); glow(c, 960, 560, 260, '#fff1c8', .25 * g);
    bulb(c, 960, 575 + Math.sin(t * 2) * 2, 1.3);
    const k = easeOut(T.at(on - .25, .45)); if (k > 0) { groundShadow(c, 1420, 920, 120, .3 * k); onion(c, lerp(2300, 1420, k), 820 - Math.sin(k * Math.PI) * 60, 1.75); }
    if (T.t > sm) { c.save(); c.globalAlpha = pop(T, sm, .3); hand(c, 'tulip bulb', 760, 470, 54, '#fbf8ef', { stroke: 6, strokeCol: 'rgba(22,16,22,.8)' }); arrow(c, 800, 500, 890, 560, -30, pop(T, sm, .5)); c.restore(); }
    if (k > .9) { c.save(); c.globalAlpha = pop(T, on + .2, .3); hand(c, 'onion', 1560, 640, 54, '#fbf8ef', { stroke: 6, strokeCol: 'rgba(22,16,22,.8)' }); arrow(c, 1540, 670, 1480, 740, 24, pop(T, on + .2, .5)); c.restore(); }
  } }),
  cams: [[13.1, 960, 560, 1.8], [cue('L3', 'smaller', 0, .2), 1110, 640, 1.35, 1.0]], push: .014,
  out: { type: 'whip', d: .45, dir: 1 }, subY: 120 });
SFX.push({ n: 'sparkle', t: cue('L3', 'single'), g: -18 }, { n: 'hit', t: cue('L3', 'onion', 0, .15), g: -16 }, { n: 'whoosh1', t: cue('L3', 'now', 0, -.3), g: -10 });

// ===== S5 balance: bulb vs ten years of a carpenter's pay
shot({ key: 'scale', at: cue('L3', 'now', 0, -.08), set: (c, T) => setStage(c, T, { scale: (c, T) => {
    const t = T.t, m0 = cue('L3', 'more'), y10 = cue('L3', 'years');
    const n = Math.round(clamp((t - m0) / (y10 - m0)) * 10); const wob = Math.sin(t * 9) * .02 * Math.exp(-((t - m0) % .19) * 6) * (t > m0 && t < y10 + .3);
    balance(c, 900, 930, -.16 + wob, (c, x, y) => bulb(c, x, y - 70, .9), (c, x, y) => { for (let i = 0; i < n; i++) coinStack(c, x - 70 + (i % 5) * 35, y - 6 - Math.floor(i / 5) * 8, 4 + (i % 3), .7); });
    if (t > m0) { c.save(); c.globalAlpha = pop(T, m0, .3); hand(c, (n || 1) + (n > 1 ? ' years of pay' : ' year of pay'), 1180, 520, 54, '#fbf8ef', { stroke: 6, strokeCol: 'rgba(22,16,22,.8)' }); c.restore(); }
    const cp = cue('L3', 'carpenter');
    person(c, { x: lerp(2200, 1580, easeOut(T.at(cp - .6, .7))), y: 960, s: 1.05, t, legs: t < cp + .1 ? 'walk' : 'stand', walk: t * 7, skin: P.skin2, coat: '#7a5a3a', apron: '#cdb68a', hat: 'cap', hatCol: '#b9a27a', expr: t > y10 ? 'shock' : 'neutral', seed: 11, look: -1,
      arms: { l: [.15, .2], r: [.5, .1] }, hold: (c, hl, hr) => { c.save(); c.translate(hr[0], hr[1]); c.rotate(.9); poly(c, [[0, -6], [70, -14], [70, 14], [0, 6]], '#c9ccd2', 3); rect(c, -26, -10, 28, 20, '#8a5f3b', 3, 4); c.restore(); } });
  } }),
  cams: [[16.3, 840, 700, 1.55], [cue('L3', 'more', 0, .1), 1000, 690, 1.4, 1.0], [cue('L3', 'carpenter', 0, .2), 1250, 700, 1.4, 1.0]], push: .012,
  out: { type: 'whip', d: .45, dir: 1 }, subY: 112 });
SFX.push({ n: 'coins', t: cue('L3', 'more'), g: -12, len: 1.8 }, { n: 'whoosh2', t: cue('L4', 'so', 0, -.3), g: -10 });

// ===== S6 house front: sells the house, buys one bulb
const P6 = { x: 760, y: 840, s: .95 };
shot({ key: 'sale', at: cue('L4', 'so', 0, -.05), set: (c, T) => setHouseFront(c, T, { cast: (c, T) => {
    const t = T.t, sells = cue('L4', 'sells'), house = cue('L4', 'house'), buys = cue('L4', 'buys'), one = cue('L4', 'one');
    const sold = pop(T, house, .25); if (sold > 0) { c.save(); c.translate(1112, 600); c.rotate(-.08); c.scale(1.6 - .6 * sold, 1.6 - .6 * sold); c.globalAlpha = clamp(sold * 2); rect(c, -110, -42, 220, 84, '#efe6cf', LW, 6); sign(c, 'SOLD', 0, 2, 58, P.red); c.restore(); }
    const kx = lerp(P6.x + 70, 1250, easeOut(T.at(sells, .55)));
    person(c, { ...BUYER, x: 1340, y: 850, s: .95, t, expr: t > sells + .4 ? 'smug' : 'neutral', look: -1, arms: { l: [lerp(.12, 1.25, T.at(sells + .1, .35)), .1], r: [.12, .15] } });
    person(c, { ...PIETER, ...P6, t, expr: t > one ? 'grin' : t > sells ? 'happy' : 'neutral', look: t < buys - .3 ? 1 : -1,
      arms: { l: [t > one ? 1.0 : .12, .2], r: [lerp(1.2, .3, T.at(sells + .45, .3)), .1] } });
    if (t < sells + .75) { c.save(); c.translate(kx, 700 + Math.sin(T.at(sells, .55) * Math.PI) * -40); c.rotate(T.at(sells, .55) * 4); circ(c, 0, 0, 14, P.gold, 3.6); rect(c, 10, -4, 40, 8, P.gold, 3); rect(c, 38, 4, 8, 10, P.gold, 2.6); c.restore(); }
    const tr = easeOut(T.at(buys - .7, .7)); person(c, { ...TRADER, x: lerp(-260, 470, tr), y: 850, s: .95, t, legs: tr < 1 ? 'walk' : 'stand', walk: t * 7, expr: 'sly', look: 1, arms: { l: [.12, .15], r: [t < one ? 1.1 : .2, .1] } });
    const trx = lerp(-260, 470, tr), px = t < one ? trx + 110 : lerp(580, P6.x - 70, easeOut(T.at(one, .35))); pot(c, px, 760 + (t < one ? 0 : -10), .8, { bulb: 1 });
  } }),
  cams: [[20.2, 800, 640, 1.55], [cue('L4', 'sells', 0, .2), 1060, 650, 1.5, .9], [cue('L4', 'buys', 0, .2), 660, 650, 1.55, .9]], push: .012,
  out: { type: 'match', d: 1.0, a: [P6.x, 840 - 248.4 * .95, 114], b: [1500, 960 - 248.4 * 1.1, 132], size: 420 }, subY: 112 });
SFX.push({ n: 'stamp', t: cue('L4', 'house'), g: -10 }, { n: 'coin', t: cue('L4', 'sells', 0, .4), g: -16 }, { n: 'whoosh3', t: cue('L5', 'for', 0, -.5), g: -14 });

// ===== S7 tavern chalkboard: genius; the price doubles, doubles again
shot({ key: 'chart', at: cue('L5', 'for', 0, -.1), set: (c, T) => {
    const t = T.t, d1 = cue('L5', 'doubles'), d2 = cue('L5', 'doubles', 1), gen = cue('L5', 'genius');
    const p = t < d1 - .2 ? .32 : t < d2 - .2 ? lerp(.32, .66, easeOut(T.at(d1 - .2, .6))) : lerp(.66, 1, easeOut(T.at(d2 - .2, .6)));
    setTavern(c, T, { board: { p, labels: [[1, '1,000', pop(T, cue('L5', 'price'), .4)], [4, '2,000', pop(T, d1 + .2, .4)], [5, '4,000 guilders', pop(T, d2 + .2, .4)]] }, cast: (c, T) => {
      [[260, '#6d3b3b', 'cap', 5], [520, '#4a5368', 'capotain', 6]].forEach(([x, coat, hat, seed]) => person(c, { x, y: 1010, s: 1.0, t, coat, hat, collar: hat === 'cap' ? null : 'dutch', apron: hat === 'cap' ? '#e8e2d0' : null, hair: 'bun', hairCol: '#5a3a22', expr: t > gen ? 'happy' : 'neutral', seed, look: 1, arms: t > gen && t < gen + 1.4 ? { l: [2.5 + Math.sin(t * 14) * .2, -.1], r: [2.5 - Math.sin(t * 14) * .2, -.1] } : {} }));
      person(c, { ...PIETER, x: 1500, y: 960, s: 1.1, t, expr: 'grin', blush: t > gen, tilt: t > gen ? -.08 : 0, look: t > cue('L5', 'price') ? -1 : 0, lookY: t > cue('L5', 'price') ? -.6 : 0, arms: { l: [t > gen && t < cue('L5', 'price') ? 2.4 : .12, .15], r: [.12, .15] } });
      pot(c, 1640, 820, .7, { bulb: 1 });
      if (t > gen) for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + t, r = 150 + Math.sin(t * 3 + i) * 10; c.save(); c.globalAlpha = .9 * pop(T, gen, .3) * (1 - T.at(gen + 1.2, .4)); poly(c, [[0, -12], [3, -3], [12, 0], [3, 3], [0, 12], [-3, 3], [-12, 0], [-3, -3]].map(([x, y]) => [1500 + Math.cos(a) * r + x, 690 + Math.sin(a) * r * .6 + y]), P.gold, 2); c.restore(); }
    } });
  },
  cams: [[26.0, 1430, 720, 1.7], [cue('L5', 'the', 0, .1), 900, 420, 1.45, 1.0], [cue('L5', 'doubles', 1, .1), 1000, 440, 1.35, .9]], push: .012, drift: 4,
  out: { type: 'dissolve', d: 1.3 }, subY: 1000 });
SFX.push({ n: 'cheer', t: cue('L5', 'genius'), g: -18, len: 1.6 }, { n: 'pencil', t: cue('L5', 'doubles', 0, -.2), g: -14, len: .8 }, { n: 'pencil', t: cue('L5', 'doubles', 1, -.2), g: -14, len: .8 }, { n: 'ding', t: cue('L5', 'again'), g: -18 });

// ===== S8 cold February morning: the buyer never comes
shot({ key: 'winter', at: cue('L6', 'then', 0, -.12), set: (c, T) => {
    const t = T.t, buyer = cue('L6', 'buyer'), up = cue('L6', 'show');
    setWinter(c, T, { clock: lerp(0, 3.2, clamp((t - 31.8) / 5)), cast: (c, T) => {
      rect(c, 1080, 640, 380, 26, P.woodL, LW, 4); rect(c, 1100, 666, 22, 150, P.wood, LW); rect(c, 1418, 666, 22, 150, P.wood, LW);
      rect(c, 1060, 520, 420, 80, '#7a2335', LW, 6); sign(c, 'TULIP AUCTION', 1270, 562, 48, '#f3dfb2');
      ln(c, 1080, 600, 1080, 640, 5); ln(c, 1460, 600, 1460, 640, 5);
      const g = pop(T, buyer, .4); if (g > 0) { c.save(); c.globalAlpha = .9 * g; c.setLineDash([14, 12]); c.lineWidth = 4; c.strokeStyle = '#5a6a80'; c.beginPath(); c.arc(1640, 570, 56, 0, TAU); c.stroke(); eggPath(c.translate(1640, 760) || c, 98, 138); c.stroke(); c.setLineDash([]); c.restore(); c.save(); c.globalAlpha = g; hand(c, '?', 1640, 440 - Math.sin(t * 3) * 6, 120, '#5a6a80', { shadow: false }); c.restore(); }
      const shiver = Math.sin(t * 40) * 2.2;
      person(c, { ...PIETER, x: 760 + shiver, y: 900, s: 1.0, t, expr: t > up ? 'worried' : 'neutral', sweat: t > up + .3, look: t > buyer ? 1 : 0, blush: 1, arms: { l: [.55, .25], r: [.55, .25] } });
      pot(c, 762 + shiver, 850, .8, { bulb: 1 });
      c.save(); c.globalAlpha = .55; for (let i = 0; i < 3; i++) { const k = ((t * .7 + i / 3) % 1); circ(c, 800 + k * 30, 560 - k * 60, 10 + k * 18, '#f4f6fb', 0); } c.restore();
    } });
  },
  cams: [[31.8, 960, 520, 1.05], [cue('L6', 'cold', 0, .1), 820, 680, 1.6, 1.2], [cue('L6', 'buyer', 0, .1), 1300, 620, 1.4, 1.0], [cue('L6', 'show', 0, .1), 820, 690, 1.75, 1.0]], push: .01,
  out: { type: 'match', d: 1.0, a: [762, 792, 30], b: [960, 575, 160], size: 380 }, subY: 112 });
SFX.push({ n: 'clock', t: cue('L6', 'morning'), g: -16, len: 2.5 }, { n: 'whistle', t: cue('L6', 'doesn', 0, .1), g: -22, len: 1.2 });

// ===== S9 stage again: overnight, the bulb becomes an onion
shot({ key: 'onion', at: cue('L7', 'overnight', 0, -.2), set: (c, T) => setStage(c, T, { item: (c, T) => {
    const t = T.t, on = cue('L7', 'onion'), worth = cue('L7', 'worth');
    const m = smooth(T.at(on - .1, .3)); const sq = 1 + Math.sin(T.at(on - .1, .4) * Math.PI) * .08;
    c.save(); c.translate(960, 575); c.scale(sq, 2 - sq); c.translate(-960, -575);
    if (m < 1) { c.save(); c.globalAlpha = 1 - m; bulb(c, 960, 575, 1.3); c.restore(); } if (m > 0) { c.save(); c.globalAlpha = m; onion(c, 960, 575, 1.3); c.restore(); }
    c.restore();
    if (m > 0 && m < 1) { for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; ln(c, 960 + Math.cos(a) * 120, 560 + Math.sin(a) * 120, 960 + Math.cos(a) * (130 + 40 * m), 560 + Math.sin(a) * (130 + 40 * m), 4, '#fff1c8'); } }
    const sw = Math.sin(t * 1.6) * .06; priceTag(c, 1230, 470, t < on ? '4,000' : '1', sw + T.at(worth, .6) * .5 * (t < on), 1, T.at(worth + .1, .4) * (t < on));
  } }),
  cams: [[37.0, 980, 560, 1.4], [cue('L7', 'as', 0, .2), 1030, 560, 1.48, 1.2]], push: .01,
  out: { type: 'match', d: 1.0, a: [960, 575, 160], b: [985, 650, 66], size: 380 }, subY: 1000 });
SFX.push({ n: 'deflate', t: cue('L7', 'worth'), g: -18, len: 1.2 }, { n: 'pop', t: cue('L7', 'onion'), g: -12 }, { n: 'sadhorn', t: cue('L7', 'onion', 0, .25), g: -20 });

// ===== S10 canal bench at dusk: the rule. Iris out.
shot({ key: 'bench', at: cue('L8', 'and', 0, -.2), set: (c, T) => setBench(c, T, { cast: (c, T) => {
    const t = T.t;
    dog(c, { x: 1120, y: 905, t, s: .95, sit: 1, mood: 'sad', wag: .15, tilt: .18 });
    person(c, { ...PIETER, x: 900, y: 768, s: 1.0, t, legs: 'sit', sitLeg: 126, expr: t > cue('L8', 'price') ? 'serious' : 'sad', look: .4, lookY: .6, arms: { l: [.3, .2], r: [.9, .2] } });
    onion(c, 985, 650, .5);
  } }),
  cams: [[41.5, 960, 640, 1.9], [cue('L8', 'rule', 0, .3), 980, 640, 1.3, 2.6]], push: .006, drift: 3,
  irisEnd: { t0: cue('L8', 'it', 0, .25), d: 1.6, world: [900, 520] }, subY: 112 });
SFX.push({ n: 'whoosh1', t: cue('L8', 'it', 0, .3), g: -24 });
resolve();
