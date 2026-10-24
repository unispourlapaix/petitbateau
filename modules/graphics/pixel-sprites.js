/* Sprites originaux 16 × 16 : contours, tramage et éclairage communs. */
(() => {
 'use strict';
 const masks = {
  coin:['.....######.....','...##########...','..############..','..############..','..############..','..############..','..############..','..############..','...##########...','.....######.....'],
  cloud:['......#####.....','....#########...','..############..','.##############.','################','################','.##############.'],
  hammer:['...#########....','...#########....','...#########....','...#########....','.......###......','......###.......','.....###........','....###.........','...###..........','..###...........'],
  note:['.##############.','################','################','################','################','################','################','.##############.'],
  ufo:['......####......','.....######.....','....########....','....########....','...##########...','.##############.','################','################','..############..','....########....','.....##..##.....'],
  heart:['..####..####....','.############...','##############..','##############..','##############..','.############...','..##########....','...########.....','....######......','.....####.......','......##........'],
  star:['.......##.......','.......##.......','......####......','......####......','.##############.','..############..','....########....','....########....','...##########...','...####..####...','..###......###..'],
  lantern:['.....######.....','....##....##....','....##....##....','...##########...','..############..','..############..','..############..','..############..','..############..','..############..','...##########...','.....######.....','.......##.......','......####......'],
  bird:['..........###...','.........#####..','..##....########','.####...######..','..###########...','...##########...','....########....','....#######.....','...####..##.....','..###.....##....'],
  bat:['##............##','###....##....###','#####.####.#####','################','################','.##############.','..##.######.##..','......####......','......####......','.......##.......'],
  leaf:['..........####..','.......#######..','.....#########..','...###########..','..###########...','..##########....','..#########.....','...#######......','....#####.......','...###..........','..##............'],
  flower:['.....##..##.....','....########....','....########....','..############..','..############..','....########....','....########....','.....##..##.....','.......##.......','.......##..###..','.....####.####..','....########....','.......##.......'],
  butterfly:['.####......####.','######....######','#######..#######','################','.##############.','...##########...','..############..','.######..######.','.#####....#####.','..###......###..'],
  shield:['..############..','..############..','..############..','..############..','..############..','...##########...','...##########...','....########....','.....######.....','......####......','.......##.......'],
  book:['.######..######.','################','################','################','################','################','################','################','################','################','.######..######.'],
  bolt:['........#####...','.......#####....','......#####.....','.....#####......','....##########..','...##########...','.......#####....','......#####.....','.....#####......','....#####.......','...####.........','..###...........'],
  chain:['.#####....#####.','##...##..##...##','##...######...##','##...######...##','.#####....#####.'],
  hands:['..###......###..','.####......####.','######....######','################','################','.##############.','..############..','...##########...','....########....'],
  rainbow:['....########....','..############..','.##############.','################','######....######','#####......#####','####........####','###..........###','###..........###'],
  smile:['.....######.....','...##########...','..############..','.##############.','.##############.','.##############.','.##############.','..############..','...##########...','.....######.....'],
  whale:['...........##...','.........######.','..##....########','.####..#########','..##############','...#############','....###########.','.....#########..','.......#####....'],
  moon:['......######....','....######......','...######.......','..######........','.######.........','.######.........','.######.........','..######........','...######.......','....######......','......######....'],
  rock:['.....######.....','...##########...','..############..','.##############.','.##############.','################','################','.##############.','..############..','...##########...'],
  plane:['.......##.......','......####......','......####......','.....######.....','...##########...','.##############.','################','.....######.....','......####......','.....######.....','....########....'],
  tank:['.......##.......','......###.......','....########....','....############','..##########....','.##############.','################','################','.##############.'],
  phone:['...##########...','...##########...','...##########...','...##########...','...##########...','...##########...','...##########...','...##########...','...##########...','...##########...','...##########...','...##########...'],
  banana:['...........###..','..........####..','..........####..','.........#####..','........######..','......#######...','....########....','..#########.....','.########.......','..#####.........'],
  bin:['....########....','..############..','...##########...','...##########...','...##########...','...##########...','...##########...','...##########...','....########....'],
  boat:['.......##.......','......###.......','.....####.......','....#####.......','...######.......','..#######.......','.......##.......','.##############.','..############..','...##########...','....########....'],
  cross:['......####......','......####......','......####......','..############..','..############..','......####......','......####......','......####......','......####......'],
  globe:['.....######.....','...##########...','..############..','.##############.','.##############.','.##############.','.##############.','..############..','...##########...','.....######.....']
 };
 const defaults={coin:'#d9b36a',cloud:'#c9d4cd',hammer:'#8f9fa7',note:'#80a47a',ufo:'#899aab',heart:'#db655e',star:'#e6b453',lantern:'#d98d4b',bird:'#dde1c9',bat:'#716085',leaf:'#80a47a',flower:'#dba1a0',butterfly:'#a28aba',shield:'#699f9c',book:'#c5ac7b',bolt:'#efcb69',chain:'#91a9ae',hands:'#cda079',rainbow:'#9ab2aa',smile:'#dfba6c',whale:'#749ca8',moon:'#e0d6a8',rock:'#8d9299',plane:'#bdc9c6',tank:'#6d8d82',phone:'#64828a',banana:'#dfbf6e',bin:'#8c9a8e',boat:'#c95350',cross:'#ddc69b',globe:'#6aa095'};
 const symbols={'🪙':'coin','💵':'note','💰':'coin','☁':'cloud','⚒':'hammer','🔨':'hammer','🛸':'ufo','❤':'heart','💖':'heart','💗':'heart','💞':'heart','💝':'heart','💔':'heart','🤍':'heart','🖤':'heart','💚':'heart','💛':'heart','💙':'heart','💜':'heart','⭐':'star','🌟':'star','✨':'star','💫':'star','🏮':'lantern','🕊':'bird','🐦':'bird','🦇':'bat','🌱':'leaf','🌸':'flower','🦋':'butterfly','🛡':'shield','📖':'book','📚':'book','⚡':'bolt','🔗':'chain','🤝':'hands','🤲':'hands','🙏':'hands','🌈':'rainbow','😊':'smile','🐋':'whale','🐳':'whale','🌙':'moon','🌑':'moon','🪨':'rock','☄':'rock','✈':'plane','🛩':'plane','📱':'phone','🍌':'banana','🗑':'bin','⛵':'boat','🏥':'cross','🌍':'globe','🌎':'globe','🌏':'globe','🗽':'shield','🚧':'shield'};
 const symbolColors={'💔':'#a76a78','🤍':'#e6dfcb','🖤':'#52606b','💚':'#80a47a','💛':'#dfba6c','💙':'#739eaf','💜':'#a28aba'};
 const cache=new Map();
 const glyphs=new Map();
 const shade=(hex,amount)=>{
  if(!/^#[a-f\d]{6}$/i.test(hex))hex='#db655e';
  return '#'+[1,3,5].map(i=>Math.max(0,Math.min(255,parseInt(hex.slice(i,i+2),16)+amount)).toString(16).padStart(2,'0')).join('');
 };
 function sprite(kind,color,frame=0){
  if(!masks[kind])kind='star'; color=color||defaults[kind];
  const key=`${kind}:${color}:${frame}`;
  if(cache.has(key))return cache.get(key);
  const c=document.createElement('canvas');c.width=16;c.height=16;
  const g=c.getContext('2d'),rows=masks[kind],offset=Math.floor((16-rows.length)/2);
  const occupied=(x,y)=>rows[y-offset]?.[x]==='#';
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){
   if(!occupied(x,y))continue;
   const edge=!occupied(x-1,y)||!occupied(x+1,y)||!occupied(x,y-1)||!occupied(x,y+1);
   const n=(x*31+y*47)%17;
   g.fillStyle=edge?'#293d4b':shade(color,y<7?(n<3?49:23):(n<4?-30:-8));
   g.fillRect(x,y,1,1);
  }
  const rect=(color,x,y,w=1,h=1)=>{g.fillStyle=color;g.fillRect(x,y,w,h)};
  if(kind==='coin'){rect('#fff0b5',7,5,2,6);rect('#b18748',5,6,2,1);rect('#b18748',9,10,2,1);}
  if(kind==='note'){rect('#c5d2ac',2,5,12,1);rect('#c5d2ac',2,10,12,1);rect('#dce0b5',6,6,4,4);}
  if(kind==='ufo'){rect('#c49fa7',6,4,4,3);rect('#e0c0bd',7,4,2,2);rect('#b4c9c6',3,8,10,1);for(let x=3;x<14;x+=3)rect('#edcd8c',x,9);}
  if(kind==='chain'){rect('#c1c9bc',2,6,3,1);rect('#c1c9bc',11,6,3,1);rect('#829ca7',5,8,6,1);}
  if(kind==='heart'){rect('#ffe0b5',4,4,2,1);rect('#f6b39a',3,5,1,2);}
  if(kind==='star'){rect('#fff1c8',7,5,2,3);rect('#c0864d',6,10,1,1);}
  if(kind==='lantern'){rect('#8b5143',4,5,8,1);rect('#ffe1a0',6,6,4,5);rect('#fff2cb',7,7,2,3);rect('#9b6450',4,11,8,1);}
  if(kind==='bird'){rect('#293d4b',11,4);rect('#d5a765',14,5);rect(shade(color,-35),5,7,4,2);if(frame)rect(color,5,4,2,3);}
  if(kind==='bat'){rect('#e7b979',6,7);rect('#e7b979',9,7);if(frame)rect('#293d4b',1,4,3,2);}
  if(kind==='book'){rect('#765947',7,3,2,10);for(let y=5;y<12;y+=2){rect('#9c886a',3,y,3);rect('#9c886a',10,y,3);}}
  if(kind==='shield'||kind==='cross'){rect('#ecd6a2',7,5,2,6);rect('#ecd6a2',5,7,6,2);}
  if(kind==='rainbow'){['#b95c59','#d89f66','#d9c68a','#82a089','#6c91aa'].forEach((c,i)=>rect(c,3+i,5+i,10-i*2,1));}
  if(kind==='smile'){rect('#344953',5,6);rect('#344953',10,6);rect('#9d7154',6,10,4);}
  if(kind==='phone'){rect('#b3c9bc',5,4,6,7);rect('#d9d6b9',7,12,2);}
  if(kind==='whale'){rect('#243f52',11,6);rect('#c4d7c6',6,10,7);}
  if(kind==='rock'){rect('#5d6775',5,5,3,2);rect('#b5afa0',9,7,2,1);}
  if(kind==='tank'){rect('#283d49',3,10,10,2);for(let x=4;x<13;x+=3)rect('#c2b891',x,10);}
  if(kind==='leaf')for(let i=0;i<7;i++)rect('#d5d5a3',4+i,11-i);
  if(kind==='flower')rect('#e8c987',6,6,4,3);
  if(kind==='globe'){rect('#bdcba0',5,5,3,3);rect('#b4c190',9,8,3,3);}
  if(kind==='bin')for(let x=5;x<12;x+=3)rect('#455b62',x,6,1,5);
  if(kind==='boat'){rect('#eadbb8',4,5,3,3);rect('#b7996b',7,4,1,5);}
  if(cache.size>=192)cache.delete(cache.keys().next().value);
  cache.set(key,c);return c;
 }
 function draw(ctx,kind,x,y,size,color,frame=0){
  if(![x,y,size].every(Number.isFinite)||size<=0)return;
  const s=sprite(kind,color,frame);
  ctx.save();ctx.shadowBlur=0;ctx.imageSmoothingEnabled=false;
  ctx.drawImage(s,Math.round(x-size/2),Math.round(y-size/2),Math.max(4,Math.round(size)),Math.max(4,Math.round(size)));ctx.restore();
 }
 function text(ctx,value,x,y,maxWidth){
  const clean=String(value).replace(/[\uFE0E\uFE0F]/g,'');
  const kind=symbols[clean];
  const isGlyph=!kind && /^\p{Extended_Pictographic}[\p{Extended_Pictographic}\uFE0F\u200D\p{Emoji_Modifier}]*$/u.test(String(value));
  if(!kind && !isGlyph){ctx.fillText(value,x,y,...(maxWidth===undefined?[]:[maxWidth]));return;}
  const size=parseFloat(ctx.font.match(/[\d.]+(?=px)/)?.[0]||'20');
  const left=ctx.textAlign==='center'?x:ctx.textAlign==='right'||ctx.textAlign==='end'?x-size/2:x+size/2;
  const top=ctx.textBaseline==='middle'?y:ctx.textBaseline==='top'||ctx.textBaseline==='hanging'?y+size/2:y-size*.35;
  if(kind) draw(ctx,kind,left,top,size,symbolColors[clean]);
  else {
   if(!glyphs.has(clean)){
    const c=document.createElement('canvas');c.width=20;c.height=20;
    const g=c.getContext('2d');g.font='16px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(value,10,10);
    if(glyphs.size>=64)glyphs.clear();glyphs.set(clean,c);
   }
   ctx.save();ctx.shadowBlur=0;ctx.imageSmoothingEnabled=false;ctx.drawImage(glyphs.get(clean),Math.round(left-size/2),Math.round(top-size/2),size,size);ctx.restore();
  }
 }
 const materials=new Map();
 function brick(ctx,b,color,wall){
  const key=`${color}:${wall}`;
  if(!materials.has(key)){
   const tile=document.createElement('canvas');tile.width=16;tile.height=16;const g=tile.getContext('2d');
   for(let y=0;y<16;y++)for(let x=0;x<16;x++){
    const mortar=wall&&(y%8===0||(x+(y<8?0:8))%16===0);
    const n=(x*19+y*37)%23;
    g.fillStyle=mortar?'#344957':shade(color,n<3?-28:n>19?25:-3);g.fillRect(x,y,1,1);
   }
   if(materials.size>=64)materials.clear();materials.set(key,tile);
  }
  ctx.save();ctx.shadowBlur=0;ctx.imageSmoothingEnabled=false;
  const pattern=ctx.createPattern(materials.get(key),'repeat');ctx.fillStyle=pattern;
  ctx.fillRect(Math.round(b.x),Math.round(b.y),b.w,b.h);
  ctx.fillStyle='#293d4b';ctx.fillRect(b.x,b.y+b.h-2,b.w,2);ctx.fillRect(b.x+b.w-2,b.y,2,b.h);
  ctx.fillStyle=shade(color,40);ctx.fillRect(b.x+2,b.y+1,Math.max(0,b.w-4),2);
  if(b.vieMax&&b.vie<b.vieMax){
   ctx.fillStyle='#394652';for(let i=0;i<5;i++)ctx.fillRect(Math.floor(b.x+b.w*.45+(i%2)*3),Math.floor(b.y+i*b.h/5),2,Math.ceil(b.h/5));
  }
  ctx.restore();
 }
 function projectile(ctx,p,kind='star',size=20,color){
  const length=Math.hypot(p.dx||0,p.dy||0)||1;
  ctx.save();
  for(let i=3;i>0;i--){ctx.globalAlpha=.13+(3-i)*.1;draw(ctx,kind,p.x-(p.dx||0)/length*i*5,p.y-(p.dy||0)/length*i*5,size*(1-i*.16),color);}
  ctx.restore();draw(ctx,kind,p.x,p.y,size,color);
 }
 // Finition unique des effets existants (éclairs, feux d'artifice, mode secret).
 // La couche de texte et les menus sont dessinés ensuite à leur résolution native.
 let frameBuffer;
 function finish(ctx,canvas){
  if(!frameBuffer)frameBuffer=document.createElement('canvas');
  const step=2*(window.PERF_PIXEL_RATIO||1);
  const w=Math.max(1,Math.round(canvas.width/step)),h=Math.max(1,Math.round(canvas.height/step));
  if(frameBuffer.width!==w||frameBuffer.height!==h){frameBuffer.width=w;frameBuffer.height=h;}
  const g=frameBuffer.getContext('2d');g.imageSmoothingEnabled=false;
  g.clearRect(0,0,w,h);g.drawImage(canvas,0,0,w,h);
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.imageSmoothingEnabled=false;
  ctx.drawImage(frameBuffer,0,0,canvas.width,canvas.height);ctx.restore();
 }
 function installDOM(){
  const style=document.createElement('style');
  const mapping={crow:['bird','#526277'],dove:['bird','#e5e1c6']};
  let css='';
  for(const [id,[kind,color]] of Object.entries(mapping)){
   const url=sprite(kind,color).toDataURL();
   css+=`#${id}{background:transparent url("${url}") center/contain no-repeat!important;border:0!important;border-radius:0!important;box-shadow:none!important;image-rendering:pixelated}#${id}::before,#${id}::after{display:none!important}`;
  }
  const objects={baleine:'whale',asteroide:'rock',etoile:'star',tank:'tank',lune:'moon',banane:'banana',smartphone:'phone',poubelle:'bin',avion:'plane'};
  for(const [name,kind] of Object.entries(objects)){
   const url=sprite(kind).toDataURL();css+=`.obj-${name}{background:transparent url("${url}") center/contain no-repeat!important;border:0!important;border-radius:0!important;box-shadow:none!important;clip-path:none!important;image-rendering:pixelated}.obj-${name}::before,.obj-${name}::after,.obj-${name}>*{display:none!important}`;
  }
  style.textContent=css;document.head.appendChild(style);
 }
 window.PixelSprites={kindFor:value=>symbols[String((Array.isArray(value)?value[0]:value)||'').replace(/[\uFE0E\uFE0F]/g,'')]||'star',draw,text,brick,projectile,finish,sprite,kinds:Object.keys(masks)};
 installDOM();
})();
