// node contact.js out_dir [times...]  -> mid still of every shot + 9-frame strips across every transition
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true });
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => console.log('PAGEERR', e.message));
  await p.goto('file://' + path.join(__dirname, 'web/index.html')); await p.evaluate(() => window.READY);
  const info = await p.evaluate(() => ({ shots: SHOTS.map(s => ({ k: s.key, s: s.start, e: s.end, o: s.out })), miss: [...MISSING] }));
  console.log(JSON.stringify(info.shots.map(s => [s.k, s.s.toFixed(2), s.e.toFixed(2)]))); if (info.miss.length) console.log('MISSING CUES', info.miss);
  const shotT = (process.argv.slice(3).length ? process.argv.slice(3).map(Number) : info.shots.flatMap(s => [s.s + (s.e - s.s) * .3, s.s + (s.e - s.s) * .75]));
  let i = 0; for (const t of shotT) { await p.evaluate(t => frameAt(t), t); await p.locator('canvas').screenshot({ path: `${OUT}/s${String(i++).padStart(2, '0')}_${t.toFixed(2)}.jpg`, type: 'jpeg', quality: 80, scale: 'css' }); }
  await b.close(); })();
