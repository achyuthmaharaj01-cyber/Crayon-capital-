const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.join(__dirname, 'web/index.html')); await p.evaluate(() => window.READY);
  const r = await p.evaluate(() => { const n = Math.ceil(TL.duration * TL.fps); const bad = []; for (let i = 0; i < n; i += 7) { try { renderFrame(i); } catch (e) { bad.push(i + ':' + e.message); if (bad.length > 8) break; } } return { missingShots: missingShots(), missingCues: missingCues(), bad, ev: sfxEvents().length }; });
  console.log(JSON.stringify(r, null, 1), errs); await b.close(); })();
