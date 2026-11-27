// Exporter: headless Chromium draws every frame on the 1920x1080 canvas and writes JPGs.
// Resumable: frames that already exist are skipped. Usage: node render.js [workers]
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const OUT = path.join(__dirname, 'build', 'frames'); fs.mkdirSync(OUT, { recursive: true });
const WORKERS = +(process.argv[2] || 4);
const name = i => path.join(OUT, `f${String(i).padStart(5, '0')}.jpg`);
(async () => {
  const b = await chromium.launch();
  const probe = await b.newPage(); await probe.goto('file://' + path.join(__dirname, 'web/index.html')); await probe.evaluate(() => window.READY);
  const N = await probe.evaluate(() => Math.ceil(VO.duration * FPS)); await probe.close();
  const todo = []; for (let i = 0; i < N; i++) if (!fs.existsSync(name(i))) todo.push(i);
  console.log(`frames: ${N}, to render: ${todo.length}`); const t0 = Date.now(); let done = 0;
  const per = Math.ceil(todo.length / WORKERS);
  await Promise.all([...Array(WORKERS)].map(async (_, w) => {
    const mine = todo.slice(w * per, (w + 1) * per); if (!mine.length) return;
    const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
    p.on('pageerror', e => console.log('PAGEERR', e.message));
    await p.goto('file://' + path.join(__dirname, 'web/index.html')); await p.evaluate(() => window.READY);
    for (const i of mine) {
      const d = await p.evaluate(i => frameJPG(i, .93), i);
      fs.writeFileSync(name(i) + '.tmp', Buffer.from(d.slice(d.indexOf(',') + 1), 'base64')); fs.renameSync(name(i) + '.tmp', name(i));
      if (++done % 500 === 0) console.log(`${done}/${todo.length}  ${(done / ((Date.now() - t0) / 1000)).toFixed(1)} fps`);
    }
    await p.close();
  }));
  await b.close(); console.log('render done', ((Date.now() - t0) / 1000).toFixed(0) + 's');
})();
