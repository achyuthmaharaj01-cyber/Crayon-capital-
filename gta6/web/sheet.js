window.castSheet = () => {
  const c = ctx; c.setTransform(1,0,0,1,0,0); SET.grid(c, 0, { bare: 1 });
  label(c, 'CAST SHEET', 960, 50, 54, '#fff');
  const row1 = [['exec','worried','hips',{sweat:1}],['clerk','grin','idle'],['critic','smug','clipboard'],['trader','smug','point'],['fan','shock','armsUp'],['investor','neutral','hold'],['oldtrader','neutral','point']];
  row1.forEach(([n,e,p,x],i)=>{ const X=150+i*270; person(c,{...CAST[n],x:X,y:500,s:.95,expr:e,pose:p,t:1.2,...(x||{}),
     item: p==='clipboard'?(cc,h)=>clipboard(cc,(h[0][0]+h[1][0])/2,(h[0][1]+h[1][1])/2-10,110,140,['99']):null}); label(c,n,X,545,28,'#fff'); });
  const row2 = [['analyst','neutral','idle'],['ref','neutral','idle'],['mail','grin','give'],['gamer','grin','hold'],['baker','smug','shrug']];
  row2.forEach(([n,e,p],i)=>{ const X=150+i*270; person(c,{...CAST[n],x:X,y:960,s:.95,expr:e,pose:p,t:2}); label(c,n,X,1005,28,'#fff'); });
  ['neutral','grin','smug','worried','shock','sad','bored'].forEach((e,i)=>{ circ(c,1490+(i%4)*120,640+Math.floor(i/4)*150,48,'#f2c49b'); face(c,1490+(i%4)*120,640+Math.floor(i/4)*150,48,e,1,{sweat:e==='worried'}); label(c,e,1490+(i%4)*120,705+Math.floor(i/4)*150,20,'#fff');});
  consoleBox(c,1500,1000,.55,'SONY','grin',1,'#1b1f2a',2); consoleBox(c,1640,1000,.55,'MICROSOFT','smug',1,'#1f3a1f',3);
  gameBox(c,1820,1000,120,170,{});
  vignette(c,.3);
};
window.thumb = () => {
  const c = ctx; c.setTransform(1, 0, 0, 1, 0, 0);
  bg(c, '#3a0d12', '#7a1c22'); lightPool(c, 900, 380, 900, '#ff4433', .45);
  for (let i = 0; i < 5; i++) { monitor(c, 200 + i * 380, 300, 260, 170, '#160b0d', { graph: 1, down: true, seed: i }); }
  c.fillStyle = '#4a1216'; c.fillRect(0, 820, W, 300); line(c, 0, 820, W, 820, LW);
  paperSheet(c, 1700, 200, .4, 1); paperSheet(c, 1500, 640, -.3, .9); paperSheet(c, 160, 700, .2, .9);
  const ex = 760, ey = 1010, s = 1.3;
  shadow(c, 1050, 1015, 420, .35);
  // giant box falling onto him: its lower-left corner rests on his raised hands
  c.save(); c.translate(ex + 40, ey - 335 * s - 10); c.rotate(.42); gameBox(c, 330, 0, 660, 900, { title: ' ', face: 'smug', t: .4 }); c.restore();
  person(c, { ...CAST.exec, badge: ' ', x: ex, y: ey, s, t: .4, expr: 'shock', pose: 'armsUp', sweat: true, slumpLegs: true });
  for (let i = 0; i < 5; i++) line(c, 420 + i * 18, 560 - i * 40, 470 + i * 20, 540 - i * 44, 7, '#fff');
  money(c, '-3.7%', 1420, 900, 260, 'loss');
  vignette(c, .6);
};
