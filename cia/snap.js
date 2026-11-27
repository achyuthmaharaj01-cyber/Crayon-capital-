// node snap.js page.html out.png [jsExpr]
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => console.log('PAGEERR', e.message)); p.on('console', m => m.type() === 'error' && console.log('ERR', m.text()));
  await p.goto('file://' + path.resolve(process.argv[2])); await p.evaluate(() => window.READY);
  await p.evaluate(process.argv[4] || 'drawCast()'); await p.locator('canvas').first().screenshot({ path: process.argv[3] }); await b.close(); })();
