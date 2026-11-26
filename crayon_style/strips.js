// node strips.js out_dir : 9-frame strip across every transition (bible §9)
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs'); const { execSync } = require('child_process');
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true });
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + path.join(__dirname, 'web/index.html')); await p.evaluate(() => window.READY);
  const TR = await p.evaluate(() => SHOTS.slice(0, -1).map(s => { const o = s.out || { type: 'dissolve' }; const d = o.d || .7; const t0 = s.end - d * (o.bias ?? .5); return { k: s.key + '>' + o.type, t0, d }; }));
  for (const [j, tr] of TR.entries()) { const fr = [];
    for (let k = 0; k < 9; k++) { const t = tr.t0 - .1 + (tr.d + .2) * k / 8; await p.evaluate(t => frameAt(t), t); const f = `${OUT}/_${k}.jpg`; await p.locator('canvas').screenshot({ path: f, type: 'jpeg', quality: 70 }); fr.push(f); }
    execSync(`ffmpeg -v error -y ${fr.map(f => '-i ' + f).join(' ')} -filter_complex "${fr.map((_, i) => `[${i}]scale=480:-1[v${i}]`).join(';')};${fr.map((_, i) => `[v${i}]`).join('')}hstack=9" ${OUT}/tr${j}_${tr.k.replace('>', '-')}.jpg`); }
  fr = null; await b.close(); })().catch(e => { console.log(e.message); process.exit(0); });
