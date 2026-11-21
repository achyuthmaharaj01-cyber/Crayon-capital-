const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + path.join(__dirname, 'web/index.html')); await p.evaluate(() => window.READY);
  const d = await p.evaluate(() => { thumb(); const s = document.createElement('canvas'); s.width = 1280; s.height = 720; s.getContext('2d').drawImage(cv, 0, 0, 1280, 720); return s.toDataURL('image/jpeg', .93); });
  fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true }); fs.writeFileSync(path.join(__dirname, 'out/thumbnail.jpg'), Buffer.from(d.split(',')[1], 'base64')); await b.close(); })();
