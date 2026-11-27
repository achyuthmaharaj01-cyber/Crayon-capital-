// Contact sheet: a still from the middle of every shot, labelled with time + spoken line. Writes contact/sheet_NN.jpg
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + path.join(__dirname, 'web/index.html')); await p.evaluate(() => window.READY);
  const out = path.join(__dirname, 'contact'); fs.mkdirSync(out, { recursive: true });
  const FILT = process.argv[2] || ''; const TAG = process.argv[3] || 'sheet';
  const pages = await p.evaluate((FILT) => {
    const cols = 3, rows = 3, tw = 640, th = 360, pad = 10, lh = 64;
    const sheets = []; const re = FILT ? new RegExp('^(' + FILT + ')\\d') : null; const shots = TL.shots.filter(s => !re || re.test(s.line)); const per = cols * rows;
    for (let pg = 0; pg * per < shots.length; pg++) {
      const sc = document.createElement('canvas'); sc.width = cols * (tw + pad) + pad; sc.height = rows * (th + lh + pad) + pad; const x = sc.getContext('2d');
      x.fillStyle = '#111'; x.fillRect(0, 0, sc.width, sc.height);
      shots.slice(pg * per, pg * per + per).forEach((s, i) => {
        const mid = (s.start + s.end) / 2; renderFrame(Math.round(mid * TL.fps));
        const cx = pad + (i % cols) * (tw + pad), cy = pad + Math.floor(i / cols) * (th + lh + pad);
        x.drawImage(cv, cx, cy, tw, th);
        x.fillStyle = '#ffd36e'; x.font = 'bold 17px sans-serif'; x.fillText(`#${pg * per + i + 1} ${s.key}/${s.sub}  ${mid.toFixed(1)}s`, cx, cy + th + 18);
        const ws = TL.lines.find(l => l.id === s.line).words.filter(w => w.s >= s.start - .05 && w.s < s.end).map(w => w.raw).join(' ');
        x.fillStyle = '#ddd'; x.font = '14px sans-serif'; const t1 = ws.slice(0, 62), t2 = ws.slice(62, 124); x.fillText(t1, cx, cy + th + 38); x.fillText(t2, cx, cy + th + 56);
      });
      sheets.push(sc.toDataURL('image/jpeg', .85));
    } return sheets; }, FILT);
  pages.forEach((d, i) => fs.writeFileSync(path.join(out, `${TAG}_${String(i + 1).padStart(2, '0')}.jpg`), Buffer.from(d.split(',')[1], 'base64')));
  console.log(pages.length, 'sheets'); await b.close(); })();
