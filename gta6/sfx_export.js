const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + path.join(__dirname, 'web/index.html')); await p.evaluate(() => window.READY);
  const ev = await p.evaluate(() => sfxEvents()); fs.writeFileSync(path.join(__dirname, 'sound/events.json'), JSON.stringify(ev, null, 0));
  console.log(ev.length, 'events;', [...new Set(ev.map(e => e.n))].join(' ')); await b.close(); })();
