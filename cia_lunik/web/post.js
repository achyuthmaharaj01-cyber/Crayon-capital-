// post: finishing passes, run once per frame after the vignette (engine calls window.POST(ctx, T, shot)).
// Film grain: 4 pre-generated 256px luminance-noise tiles, one picked per 24 fps film frame, tiled with a random offset
// and soft-light blended at low strength. Cheap (one pattern fill) and it never softens line work or lettering.
// Gate weave is off by default (it would wobble lettering); a shot can opt in with weave:true.
(function () {
  const N = 4, S = 256, tiles = [];
  for (let k = 0; k < N; k++) {
    const cv = document.createElement('canvas'); cv.width = cv.height = S; const x = cv.getContext('2d');
    const im = x.createImageData(S, S); let seed = 9301 + k * 7919;
    const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < S * S; i++) { const v = (R() + R() + R()) / 3; const g = Math.round(128 + (v - .5) * 255 * 1.6); im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = clamp(g, 0, 255); im.data[i * 4 + 3] = 255; }
    x.putImageData(im, 0, 0); tiles.push(x.createPattern(cv, 'repeat'));
  }
  const GRAIN = .085;
  window.POST = (c, T, shot) => {
    const def = SHOTS[shot.key] || {}; if (def.grain === 0) return;
    const f = Math.floor(T.t * 24); const pat = tiles[f % N];
    const ox = (f * 97) % S, oy = (f * 61) % S;
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'soft-light'; c.globalAlpha = def.grain ?? GRAIN;
    c.translate(-ox, -oy); c.fillStyle = pat; c.fillRect(0, 0, W + S, H + S); c.restore();
    if (def.weave) { // optional: 1px gate weave by re-drawing the frame shifted (only for shots that ask)
      const dx = Math.round(Math.sin(f * 1.7) * .8), dy = Math.round(Math.sin(f * 2.3 + 1) * .8);
      if (dx || dy) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(c.canvas, dx, dy); c.restore(); }
    }
  };
})();
