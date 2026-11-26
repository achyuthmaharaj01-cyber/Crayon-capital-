// writes sound/events.json from the SFX list declared next to each shot
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await b.newPage(); await p.goto('file://' + path.join(__dirname, 'web/index.html')); await p.evaluate(() => window.READY);
  fs.mkdirSync(path.join(__dirname, 'sound'), { recursive: true }); fs.writeFileSync(path.join(__dirname, 'sound/events.json'), JSON.stringify(await p.evaluate(() => SFX))); await b.close(); console.log('events ok'); })();
