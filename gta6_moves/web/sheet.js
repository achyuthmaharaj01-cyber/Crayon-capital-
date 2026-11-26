window.castSheet = () => {
  const c = ctx; c.setTransform(1, 0, 0, 1, 0, 0); SET.grid(c, 0, { bare: 1 });
  label(c, 'CAST', 960, 56, 56, '#fff');
  star(c, 200, 330, 120, 'grin', 1.2, { name: 'THE STUDIO' });
  [['solo', 'grin', 'hold', 'ONE PERSON'], ['exec', 'smug', 'hips', 'TAKE-TWO'], ['ceo', 'neutral', 'point', 'THE CEO'], ['analyst', 'worried', 'clipboard', 'ANALYST'], ['fan', 'shock', 'armsUp', 'FAN'], ['clerk', 'grin', 'idle', 'RETAILER']].forEach(([n, e, p, lab], i) => {
    const X = 480 + i * 240; person(c, { ...CAST[n], x: X, y: 560, s: .9, expr: e, pose: p, t: 1.4,
      item: n === 'solo' ? (cc, h) => laptop(cc, 0, -120, .32, () => { cc.fillStyle = '#e8f3ff'; }) : p === 'clipboard' ? (cc, h) => clipboard(cc, (h[0][0] + h[1][0]) / 2, (h[0][1] + h[1][1]) / 2 - 10, 110, 140, ['$1.84B']) : null });
    label(c, lab, X, 605, 28, '#fff'); });
  ['neutral', 'grin', 'smug', 'worried', 'shock'].forEach((e, i) => { circ(c, 160 + i * 130, 790, 50, '#f2c49b'); face(c, 160 + i * 130, 790, 50, e, 1, { sweat: e === 'worried' }); label(c, e, 160 + i * 130, 865, 22, '#fff'); });
  consoleBox(c, 860, 960, .6, 'SONY', 'grin', 1, '#1b1f2a', 2); consoleBox(c, 1010, 960, .6, 'MICROSOFT', 'smug', 1, '#1f3a1f', 3);
  gameBox(c, 1180, 960, 130, 190, {}); gameBox(c, 1340, 960, 130, 190, { title: 'GTA V' }); filmReel(c, 1560, 820, 80, 'shock', 1);
  book(c, 1770, 820, 220, 290, ['AI SOLO-', 'PRENEUR'], 'IN 90 DAYS');
  vignette(c, .3);
};
