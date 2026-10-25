/* Bandeau pixel stable : géométrie partagée avec les zones tactiles. */
(() => {
 'use strict';
 let buffer=null,lastKey='';
 const colors={blue:'#1e3a8a',ink:'#293d55',edge:'#9db5dd',paper:'#ffffff'};
 const digits={0:['111','101','101','101','111'],1:['010','110','010','010','111'],2:['111','001','111','100','111'],3:['111','001','111','001','111'],4:['101','101','111','001','001'],5:['111','100','111','001','111'],6:['111','100','111','101','111'],7:['111','001','010','010','010'],8:['111','101','111','101','111'],9:['111','101','111','001','111'],'/':['001','001','010','100','100'],'.':['000','000','000','000','010'],' ':['000','000','000','000','000']};
 function number(g,value,x,y,maxWidth,color=colors.ink){
  const text=String(value),step=Math.max(1,Math.min(2,Math.floor(maxWidth/Math.max(1,text.length*4))));
  g.fillStyle=color;
  for(let i=0;i<text.length;i++)for(let row=0;row<5;row++)for(let col=0;col<3;col++){
   if(digits[text[i]]?.[row][col]==='1')g.fillRect(Math.round(x+i*4*step+col*step),Math.round(y-2.5*step+row*step),step,step);
  }
 }
 function layout(C){
  const header=Math.round(Math.max(C.H*.045,32)),height=Math.round(Math.max(C.H*.025,26)),top=header;
  return {header,top,height,y:top+height/2,total:header+height,
   language:{x:4,y:top+2,width:46,height:height-4},
   minus:{x:6,y:2,w:32,h:header-4},plus:{x:C.W-38,y:2,w:32,h:header-4}};
 }
 function frame(g,x,y,w,h,active=false){
  g.fillStyle=active?'#b9cde2':'#eaf0f6';g.fillRect(x,y,w,h);
  g.fillStyle=active?'#5c7b9c':'#aebdca';g.fillRect(x,y+h-2,w,2);g.fillRect(x+w-2,y,2,h);
  g.fillStyle='#ffffff';g.fillRect(x+2,y+1,w-4,1);
 }
 const letters={
  A:'01110/10001/10001/11111/10001/10001/10001',B:'11110/10001/10001/11110/10001/10001/11110',C:'01111/10000/10000/10000/10000/10000/01111',D:'11110/10001/10001/10001/10001/10001/11110',E:'11111/10000/10000/11110/10000/10000/11111',F:'11111/10000/10000/11110/10000/10000/10000',G:'01111/10000/10000/10111/10001/10001/01111',H:'10001/10001/10001/11111/10001/10001/10001',I:'11111/00100/00100/00100/00100/00100/11111',J:'00111/00010/00010/00010/10010/10010/01100',K:'10001/10010/10100/11000/10100/10010/10001',L:'10000/10000/10000/10000/10000/10000/11111',M:'10001/11011/10101/10101/10001/10001/10001',N:'10001/11001/10101/10011/10001/10001/10001',O:'01110/10001/10001/10001/10001/10001/01110',P:'11110/10001/10001/11110/10000/10000/10000',Q:'01110/10001/10001/10001/10101/10010/01101',R:'11110/10001/10001/11110/10100/10010/10001',S:'01111/10000/10000/01110/00001/00001/11110',T:'11111/00100/00100/00100/00100/00100/00100',U:'10001/10001/10001/10001/10001/10001/01110',V:'10001/10001/10001/10001/10001/01010/00100',W:'10001/10001/10001/10101/10101/10101/01010',X:'10001/10001/01010/00100/01010/10001/10001',Y:'10001/10001/01010/00100/00100/00100/00100',Z:'11111/00001/00010/00100/01000/10000/11111',' ':'00000/00000/00000/00000/00000/00000/00000'
 };
 function fit(g,text,x,y,width,size,color,font){
  const glyphs=[];
  for(const char of String(text).toUpperCase().normalize('NFD')) {
   if (/^[\u0300-\u036f]$/.test(char) && glyphs.length) glyphs[glyphs.length-1].marks.push(char);
   else glyphs.push({letter:char,marks:[]});
  }
  if (glyphs.every(item=>letters[item.letter])) {
   const unit=Math.max(1,Math.min(2,Math.floor(size/7),Math.floor(width/(glyphs.length*6))));
   if(glyphs.length*6*unit<=width){
    g.fillStyle=color;const left=Math.round(x-(glyphs.length*6-1)*unit/2),top=Math.round(y-7*unit/2);
    glyphs.forEach((item,i)=>{
     const start=left+i*6*unit;
     letters[item.letter].split('/').forEach((row,yy)=>[...row].forEach((pixel,xx)=>{
      if(pixel==='1')g.fillRect(start+xx*unit,top+yy*unit,unit,unit);
     }));
     for(const mark of item.marks){
      if(mark==='\u0301') {g.fillRect(start+3*unit,top-3*unit,unit,unit);g.fillRect(start+2*unit,top-2*unit,unit,unit);}
      else if(mark==='\u0300') {g.fillRect(start+unit,top-3*unit,unit,unit);g.fillRect(start+2*unit,top-2*unit,unit,unit);}
      else if(mark==='\u0308') {g.fillRect(start+unit,top-2*unit,unit,unit);g.fillRect(start+3*unit,top-2*unit,unit,unit);}
      else if(mark==='\u0327') {g.fillRect(start+2*unit,top+7*unit,unit,unit);g.fillRect(start+unit,top+8*unit,unit,unit);}
      else {g.fillRect(start+2*unit,top-3*unit,unit,unit);g.fillRect(start+unit,top-2*unit,unit,unit);g.fillRect(start+3*unit,top-2*unit,unit,unit);}
     }
    });return;
   }
  }
  g.font=`bold ${size}px ${font}`;g.textAlign='center';g.textBaseline='middle';g.fillStyle=color;
  const measured=g.measureText(text).width;
  if(measured>width)g.font=`bold ${Math.max(8,size*width/measured)}px ${font}`;
  g.fillText(text,x,y,width);
 }
 function render(ctx,C,state){
  const box=layout(C),lang=state.lang||'fr';
  const key=JSON.stringify([C.W,box.header,box.height,state.title,lang,state.score,state.phase,state.bricks,state.brickTotal,state.lives,!!state.hover]);
  if(!buffer)buffer=document.createElement('canvas');
  if(key!==lastKey){
   buffer.width=Math.round(C.W);buffer.height=box.total;const g=buffer.getContext('2d');g.imageSmoothingEnabled=false;
   g.fillStyle=colors.blue;g.fillRect(0,0,C.W,box.header);
   g.fillStyle='#3556a2';for(let x=2;x<C.W;x+=8)g.fillRect(x,2,2,1);
   g.fillStyle='#152c70';g.fillRect(0,box.header-3,C.W,3);
   const center=C.W/2,boat=Math.min(32,box.header-4),gap=5,titleWidth=Math.max(30,C.W-2*(44+boat+gap+7));
   const font=window.ScoreShare?.fontFamily()||'Georgia, serif';
   fit(g,state.title,center,box.header/2,titleWidth,18,'#fff2ce',font);
   g.font=`bold 18px ${font}`;
   const textWidth=Math.min(titleWidth,g.measureText(state.title).width);
   PixelSprites.draw(g,'boat',center-textWidth/2-gap-boat/2,box.header/2,boat,'#d86757');
   PixelSprites.draw(g,'boat',center+textWidth/2+gap+boat/2,box.header/2,boat,'#86bdcf');
   for(const [name,b] of [['minus',box.minus],['plus',box.plus]]){
    g.fillStyle='#ffffff';
    g.fillRect(b.x+9,Math.round(b.y+(b.h-3)/2),14,3);
    if(name==='plus')g.fillRect(b.x+15,Math.round(b.y+(b.h-15)/2),3,15);
   }
   g.fillStyle=colors.paper;g.fillRect(0,box.top,C.W,box.height);
   g.fillStyle='#e2e9f1';g.fillRect(0,box.total-1,C.W,1);
   frame(g,box.language.x,box.language.y,box.language.width,box.language.height,!!state.hover);
   PixelSprites.draw(g,'globe',box.language.x+13,box.y,18);
   fit(g,lang.toUpperCase(),box.language.x+33,box.y,20,9,colors.ink,'monospace');
   const scoreStart=58,scoreEnd=Math.floor(C.W*.48),phaseStart=scoreEnd+5;
   PixelSprites.draw(g,'star',scoreStart+7,box.y,16);
   number(g,state.score,scoreStart+19,box.y,Math.max(24,scoreEnd-scoreStart-21));
   g.fillStyle='#e2e9f1';g.fillRect(scoreEnd,box.top+8,1,box.height-16);
   PixelSprites.draw(g,'book',phaseStart+8,box.y,17);
   const progress=state.phase?`${state.phase}/23`:`${state.bricks}/${state.brickTotal}`;
   number(g,progress,phaseStart+21,box.y,Math.max(24,C.W*.74-phaseStart-22));
   const lives=Math.max(0,Math.floor(state.lives));
   const hearts=lives>3?1:Math.max(1,lives);
   for(let i=0;i<hearts;i++)PixelSprites.draw(g,'heart',C.W-16-i*19,box.y,18,lives?'#d46360':'#8c8191');
   if(lives>3)number(g,lives,C.W-57,box.y,30);
   lastKey=key;
  }
  ctx.save();ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.shadowBlur=0;ctx.shadowOffsetX=ctx.shadowOffsetY=0;ctx.imageSmoothingEnabled=false;
  ctx.drawImage(buffer,0,0,C.W,box.total);ctx.restore();
  return box;
 }
 function tabs(ctx,menu,labels){
  const kinds={enigmes:'book',classement:'star',langues:'globe',info:'leaf'};
  ctx.save();ctx.shadowBlur=0;ctx.shadowOffsetX=ctx.shadowOffsetY=0;
  for(const [key,b] of Object.entries(menu.onglets)){
   if(!kinds[key])continue;
   const active=menu.ongletActif===key;
   ctx.fillStyle=active?colors.blue:'#e1d1af';ctx.fillRect(b.x,b.y,b.width,b.height);
   ctx.fillStyle=active?'#142a6b':'#b19a72';ctx.fillRect(b.x,b.y+b.height-2,b.width,2);
   ctx.fillStyle=active?'#7191d0':'#f9edd3';ctx.fillRect(b.x+2,b.y+1,Math.max(0,b.width-4),1);
   PixelSprites.draw(ctx,kinds[key],b.x+b.width/2,b.y+12,16);
   fit(ctx,labels[key],b.x+b.width/2,b.y+33,Math.max(8,b.width-6),12,active?'#fff0cd':colors.ink,window.ScoreShare?.fontFamily()||'Georgia, serif');
  }
  ctx.restore();
 }
 window.PixelHUD={layout,render,tabs};
})();
