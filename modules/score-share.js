/* Cartes de score locales : scènes procédurales, export PNG et Web Share. */
(() => {
 'use strict';
 const GAME_URL='https://unispourlapaix.github.io/petitbateau/';
 const themeKeys=['dawn','lagoon','stars','sunset','dreams','peace'];
 const language=()=>window.i18n?.getCurrentLanguage?.()||document.documentElement.lang||'fr';
 const locale=()=>({jp:'ja',rc:'fr-RE'}[language()]||language());
 const fontFamily=()=>({ar:'Tahoma, Arial, sans-serif',he:'Arial, "Segoe UI", sans-serif',
  jp:'"Yu Gothic", "MS Gothic", sans-serif',zh:'"Microsoft YaHei", "Noto Sans CJK SC", sans-serif',
  ko:'"Malgun Gothic", "Noto Sans KR", sans-serif',lg:'"Segoe UI", "DejaVu Sans", sans-serif'}[language()]||'Georgia, serif');
 const rtl=()=>['ar','he'].includes(language());
 const themes=[
  {name:'Aube de nacre',sky:['#8b7a9f','#c58d9c','#edc3ad'],sea:['#668e9c','#477a8c','#315d76'],light:'#ffe1a0',night:false},
  {name:'Lagon de lumière',sky:['#5495ae','#8abcc0','#d6ddbf'],sea:['#70b9b0','#428f9d','#2b687f'],light:'#fff1b6',night:false},
  {name:'Le phare des étoiles',sky:['#17243f','#293653','#56617a'],sea:['#39536e','#29445f','#1c344e'],light:'#f5db99',night:true},
  {name:'Derniers rayons',sky:['#685975','#b37a86','#edb38f'],sea:['#6c8391','#4b677e','#304c68'],light:'#ffe4ac',night:false},
  {name:'La baie des songes',sky:['#29385c','#536181','#ac9ba1'],sea:['#516f8d','#3a5874','#294059'],light:'#e6e8bb',night:true},
  {name:'Un matin de paix',sky:['#86aaa8','#b2c8b1','#eee0b8'],sea:['#7aa99c','#527e82','#365e73'],light:'#fff0b7',night:false}
 ];
 const num=value=>Number.isFinite(Number(value))?Math.max(0,Math.round(Number(value))):0;
 const normalize=data=>({xp:num(data.xp),score:num(data.score),total:num(data.total===undefined?num(data.xp)+num(data.score):data.total),wisdom:num(data.wisdom),completed:!!data.completed});
 const seed=()=>window.crypto?.getRandomValues ? window.crypto.getRandomValues(new Uint32Array(1))[0] : Math.floor(Math.random()*0xffffffff);
 function rng(seed){let state=seed>>>0;return()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};}
 const tx=(key,fallback)=>window.getTranslatedText?.('score_share.'+key,fallback)||fallback;
 function fitText(g,text,x,y,maxWidth,font,size,color){
  font=fontFamily();
  g.fillStyle=color;g.textAlign='center';g.font=`${size}px ${font}`;
  const width=g.measureText(text).width;if(width>maxWidth)g.font=`${Math.max(12,size*maxWidth/width)}px ${font}`;
  g.fillText(text,x,y,maxWidth);
 }
 function scene(seedValue){
  const random=rng(seedValue),themeIndex=Math.floor(random()*themes.length),theme=themes[themeIndex];
  const c=document.createElement('canvas');c.width=360;c.height=230;const g=c.getContext('2d');
  const rect=(color,x,y,w,h)=>{g.fillStyle=color;g.fillRect(Math.round(x),Math.round(y),w,h);};
  const blend=(a,b,t)=>'#'+[1,3,5].map(i=>Math.round(parseInt(a.slice(i,i+2),16)*(1-t)+parseInt(b.slice(i,i+2),16)*t).toString(16).padStart(2,'0')).join('');
  for(let y=0;y<145;y++){
   const position=y/144*2,band=Math.min(1,Math.floor(position)),fraction=Math.round((position-band)*12)/12;
   const color=blend(theme.sky[band],theme.sky[band+1],fraction);
   rect(color,0,y,360,1);
   for(let x=0;x<360;x+=3)if(random()<.04)rect(blend(color,theme.light,.08),x,y,1,1);
  }
  const lighthouseRight=random()>.5,px=lighthouseRight?296:63;
  // Astre et constellations restent derrière les reliefs.
  const mx=lighthouseRight?76:278,my=39;
  if(theme.night)for(let i=0;i<48;i++)rect(i%4? '#a9b1bb':'#f5e1b0',random()*360,random()*110,1,1);
  for(let y=-12;y<=12;y++)for(let x=-12;x<=12;x++){
   if(x*x+y*y>144)continue;
   if(theme.night&&(x+5)**2+(y-3)**2<120)continue;
   rect(theme.light,mx+x,my+y,1,1);
  }
  for(let i=0;i<6;i++){
   const x=random()*360,y=30+random()*75;
   rect(theme.night?'#62718a':'#e4d5bc',x,y,28+Math.floor(random()*22),3);
   rect(theme.night?'#79839a':'#f2e3c7',x+6,y-3,16,3);
  }
  for(let x=0;x<360;x++){
   const ridge=131-Math.max(0,Math.sin(x*.03)*7+Math.sin(x*.071)*4);
   rect(theme.night?'#38445f':'#839a9a',x,ridge,1,16);
  }
  for(let y=140;y<230;y++)rect(theme.sea[Math.min(2,Math.floor((y-140)/30))],0,y,360,1);
  for(let i=0;i<220;i++){
   const x=Math.floor(random()*360),y=143+Math.floor(random()*85);
   rect(i%3?'#92b8b0':'#c3c8ad',x,y,3+Math.floor(random()*8),1);
  }
  // Faisceau en marches, fixé au phare, toujours orienté vers la mer.
  g.save();g.globalAlpha=theme.night?.2:.09;
  const direction=lighthouseRight?-1:1;
  for(let i=0;i<88;i++)rect(theme.light,px+direction*i*2,87-Math.floor(i*.23),2,4+Math.floor(i*.46));
  g.restore();
  // Îlot rocheux et phare de pierre peint, détails indépendants de la palette.
  for(let y=174;y<198;y++){
   const half=20+Math.floor((y-174)*1.25);rect('#344957',px-half,y,half*2,1);
   if(y%3===0)rect('#61747a',px-half+7,y,half,1);
  }
  rect('#d9c6a5',px-13,105,26,74);
  rect('#f1dfb8',px-11,105,16,74);rect('#a49683',px+9,105,4,74);
  for(const y of [120,148]){rect('#b35950',px-13,y,26,10);rect('#db7c64',px-11,y,16,2);}
  for(let y=108;y<178;y+=7)for(let x=px-10;x<px+11;x+=5)if(random()<.35)rect('#b7a78c',x,y,2,1);
  rect('#384b54',px-6,163,10,16);rect('#947c5a',px-4,165,6,14);
  rect('#344955',px-3,110,5,7);rect('#f4d18f',px-2,111,2,4);
  rect('#344955',px-3,137,5,7);rect('#f4d18f',px-2,138,2,4);
  rect('#2d4350',px-18,102,36,4);rect('#a28b65',px-16,100,32,2);
  rect('#354c56',px-11,80,22,21);rect('#f4cf86',px-8,83,16,15);
  rect('#fff1bb',px-5,85,5,10);rect('#6c6556',px-1,82,2,18);
  for(let y=0;y<8;y++)rect(y<2?'#e49570':'#a94c46',px-y*2,72+y,y*4+2,1);
  rect('#35434d',px-1,67,2,6);
  for(let y=0;y<4;y++)rect('#a7a78f',px-20+y*2,194+y*3,40-y*4,2);
  // Le même bateau rouge texturé que dans le jeu.
  const boatX=lighthouseRight?102+random()*26:190+random()*25;
  if(window.PixelArt)PixelArt.boat(g,{x:boatX,y:186},{PW:91,PH:14},false,seedValue);
  else if(window.PixelSprites)PixelSprites.draw(g,'boat',boatX+45,173,91);
  for(let i=0;i<3;i++){
   const x=130+i*38+Math.floor(random()*12),y=75+i*9;
   rect('#e8dcc1',x,y,3,1);rect('#e8dcc1',x+3,y+1,3,1);rect('#e8dcc1',x+6,y,3,1);
  }
  return {canvas:c,theme:tx('themes.'+themeKeys[themeIndex],theme.name)};
 }
 function render(canvas,data,seedValue){
  data=normalize(data);canvas.width=1080;canvas.height=1350;
  const g=canvas.getContext('2d');g.imageSmoothingEnabled=false;g.direction=rtl()?'rtl':'ltr';
  g.fillStyle='#203c49';g.fillRect(0,0,1080,1350);
  g.fillStyle='#f1e3c5';g.fillRect(24,24,1032,1302);
  // Trame légère sur les marges papier ; jamais sur les caractères.
  for(let y=30;y<1320;y+=5)for(let x=30;x<1050;x+=7)if((x*13+y*17)%19<3){g.fillStyle='rgba(133,106,66,.08)';g.fillRect(x,y,2,1);}
  g.strokeStyle='#b69a70';g.lineWidth=2;g.strokeRect(38,38,1004,1274);
  fitText(g,tx('brand','LE PETIT BATEAU ROUGE'),540,91,920,'Georgia, serif',35,'#294653');
  fitText(g,tx('heading','MON CARNET DE VOYAGE'),540,153,930,'Georgia, serif',49,'#294653');
  fitText(g,data.completed?tx('completed','Un voyage accompli, une lumière partagée.'):tx('journey','Chaque voyage laisse une lumière.'),540,202,930,'Georgia, serif',28,'#806849');
  const art=scene(seedValue);g.drawImage(art.canvas,30,240,1020,651);
  fitText(g,tx('total','MON SCORE'),540,955,900,'Georgia, serif',25,'#7d674d');
  fitText(g,new Intl.NumberFormat(locale()).format(data.total),540,1058,900,'Georgia, serif',91,'#294653');
  const labels=[tx('game_score','Score du jeu'),tx('xp','Connaissance · XP'),tx('wisdom','Sagesse')];
  [data.score,data.xp,data.wisdom].forEach((value,i)=>{
   const x=210+i*330;fitText(g,new Intl.NumberFormat(locale()).format(value),x,1135,280,'Georgia, serif',36,'#994e44');
   fitText(g,labels[i],x,1177,290,'Georgia, serif',22,'#5e6259');
  });
  fitText(g,tx('quote','Suivre la lumière. Partager la paix.'),540,1244,930,'Georgia, serif',28,'#294653');
  fitText(g,'unispourlapaix.github.io/petitbateau',540,1284,930,'Georgia, serif',22,'#7d674d');
  return {theme:art.theme,data};
 }
 const toBlob=canvas=>new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error(tx('export_error','Impossible de créer l’image.'))),'image/png'));
 let current=null;
 function open(raw,options={}){
  if(document.getElementById('formulaire-fin-overlay'))return;
  const data=normalize(raw),previous=document.activeElement;
  const overlay=document.createElement('div');overlay.id='formulaire-fin-overlay';overlay.className='score-share-overlay';overlay.lang=locale();overlay.dir=rtl()?'rtl':'ltr';
  overlay.innerHTML=`<section class="score-share-panel" role="dialog" aria-modal="true" aria-labelledby="score-share-title">
   <button type="button" class="score-share-close" aria-label="${tx('close','Fermer')}">×</button>
   <p class="score-share-eyebrow">${tx('souvenir','UN SOUVENIR À EMPORTER')}</p>
   <h2 id="score-share-title">${tx('title','Partage ta lumière')}</h2>
   <p class="score-share-intro">${tx('intro','Ton score, un petit bateau et un phare. Une nouvelle escale à chaque image.')}</p>
   <canvas class="score-share-image" role="img" aria-label="${tx('image_alt','Carte illustrée du score : bateau rouge et phare en pixel art')}"></canvas>
   <p class="score-share-status" role="status" aria-live="polite"></p>
   <div class="score-share-actions">
    <button type="button" data-action="share">${tx('share','Partager l’image')}</button>
    <button type="button" data-action="download">${tx('download','Télécharger le PNG')}</button>
    <button type="button" data-action="change">${tx('change','Un autre décor')}</button>
    ${options.onRestart?`<button type="button" data-action="restart">${tx('replay','Rejouer')}</button>`:''}
   </div>
  </section>`;
  document.body.appendChild(overlay);
  const image=overlay.querySelector('canvas'),status=overlay.querySelector('[role="status"]');
  const share=overlay.querySelector('[data-action="share"]'),download=overlay.querySelector('[data-action="download"]'),change=overlay.querySelector('[data-action="change"]');
  const controller={overlay,blob:null,data,close,revision:0};current=controller;
  const setStatus=value=>status.textContent=value;
  function close(){controller.revision++;overlay.remove();if(current===controller)current=null;document.removeEventListener('keydown',keyboard,true);options.onClose?.();previous?.focus?.();}
  function keyboard(event){
   event.stopImmediatePropagation();
   if(event.key==='Escape'){event.preventDefault();close();return;}
   if(event.key==='Tab'){
    const controls=[...overlay.querySelectorAll('button:not(:disabled)')];const first=controls[0],last=controls[controls.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
   }
  }
  async function regenerate(){
   const revision=++controller.revision;controller.blob=null;share.disabled=download.disabled=true;
   setStatus(tx('creating','Création de ta carte…'));
   try{
    const info=render(image,data,seed());const blob=await toBlob(image);
    if(revision!==controller.revision)return;controller.blob=blob;share.disabled=download.disabled=false;
    setStatus(info.theme+' · '+tx('ready','Ta carte est prête.'));
   }catch(error){setStatus(error.message);}
  }
  function save(){
   if(!controller.blob)return;
   const url=URL.createObjectURL(controller.blob),link=document.createElement('a');
   link.href=url;link.download=`petit-bateau-rouge-${data.total}.png`;document.body.appendChild(link);link.click();link.remove();
   setTimeout(()=>URL.revokeObjectURL(url),60000);
   setStatus(tx('saved','Image téléchargée. Tu peux la joindre à ton message.'));
  }
  share.onclick=async()=>{
   if(!controller.blob)return;
   const file=new File([controller.blob],`petit-bateau-rouge-${data.total}.png`,{type:'image/png'});
   if(!navigator.canShare?.({files:[file]})||!navigator.share){save();return;}
   share.disabled=download.disabled=change.disabled=true;
   try{
    await navigator.share({files:[file],title:tx('brand','Le Petit Bateau Rouge'),text:`${tx('share_text','Mon voyage dans Le Petit Bateau Rouge')} : ${data.total} points.\n${GAME_URL}`});
    setStatus(tx('shared','Ta carte a été partagée.'));
   }catch(error){if(error.name==='AbortError')setStatus(tx('cancelled','Partage annulé. Ta carte reste disponible.'));else setStatus(tx('share_error','Le partage est indisponible. Utilise « Télécharger le PNG ».'));}
   finally{share.disabled=download.disabled=change.disabled=false;}
  };
  download.onclick=save;change.onclick=regenerate;
  overlay.querySelector('.score-share-close').onclick=close;
  const replay=overlay.querySelector('[data-action="restart"]');if(replay)replay.onclick=()=>{close();options.onRestart();};
  document.addEventListener('keydown',keyboard,true);overlay.querySelector('.score-share-close').focus();regenerate();
 }
 window.ScoreShare={fontFamily,open,render,scene,normalize,close:()=>current?.close(),themes:themes.map(t=>t.name),gameUrl:GAME_URL};
})();
