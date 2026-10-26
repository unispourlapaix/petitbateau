/* Diagnostic local opt-in : aucune collecte réseau, aucun coût de mesure sans ?perf=1. */
(() => {
 'use strict';
 if(new URLSearchParams(location.search).get('perf')!=='1')return;
 const label=document.createElement('div');
 label.style.cssText='position:fixed;bottom:4px;left:4px;z-index:2147483647;background:#10283bea;color:#fff;font:11px monospace;padding:6px;white-space:pre;pointer-events:none';
 document.body.appendChild(label);
 let started=performance.now(),frames=0,ball=0,render=0,max=0;
 window.GamePerf={
  measure(kind,fn){const t=performance.now();try{return fn()}finally{const elapsed=performance.now()-t;if(kind==='ball')ball+=elapsed;else render+=elapsed;max=Math.max(max,elapsed)}},
  frame(canvas){frames++;const now=performance.now(),elapsed=now-started;if(elapsed<1000)return;
   label.textContent=`v2.8.15 | ${Math.round(frames*1000/elapsed)} FPS\n${canvas.width} x ${canvas.height} px | DPR rendu ${window.PERF_PIXEL_RATIO?.toFixed(2)}\nBalle ${(ball/frames).toFixed(2)} ms | Rendu ${(render/frames).toFixed(2)} ms\nPic ${max.toFixed(1)} ms`;
   started=now;frames=ball=render=max=0;
  }
 };
})();
