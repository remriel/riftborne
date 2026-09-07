import './style.css';
import {Game} from './game';
import {GameRenderer} from './render';
import {AudioManager} from './audio';
import {UI} from './ui';
const canvas=document.getElementById('game') as HTMLCanvasElement;
async function boot(){
 const game=new Game(),view=new GameRenderer(canvas),audio=new AudioManager();await game.init();await view.init(game,n=>{document.getElementById('load-progress')!.style.width=`${Math.round(n*100)}%`;document.getElementById('load-label')!.textContent=`Preparing the arena · ${Math.round(n*100)}%`;});const ui=new UI(game,view,audio);
 try{const saved=JSON.parse(localStorage.getItem('riftborne-settings')||'null');if(saved){view.fov=saved.fov||75;audio.setVolume(saved.volume??.35);view.shakeEnabled=saved.shake??true;view.quality=saved.bloom??true;game.difficulty=saved.difficulty||1;}}catch{}
 window.addEventListener('keydown',e=>{if(['Space','Tab','AltLeft','ControlLeft'].includes(e.code))e.preventDefault();if(game.state!=='playing')return;if(!game.input.keys.has(e.code))game.input.pressed.add(e.code);game.input.keys.add(e.code);});window.addEventListener('keyup',e=>game.input.keys.delete(e.code));
 canvas.addEventListener('mousedown',e=>{if(game.state==='playing'){game.input.buttons.add(e.button);audio.start();if(!document.pointerLockElement)try{const p=canvas.requestPointerLock();p?.catch(()=>{});}catch{}}});window.addEventListener('mouseup',e=>game.input.buttons.delete(e.button));canvas.addEventListener('contextmenu',e=>e.preventDefault());
 window.addEventListener('mousemove',e=>{if(game.state==='playing'&&(document.pointerLockElement===canvas||e.target===canvas)){game.input.mouseX+=e.movementX;game.input.mouseY+=e.movementY;}});
 window.addEventListener('blur',()=>{if(game.state==='playing')ui.pause();});document.addEventListener('visibilitychange',()=>{if(document.hidden&&game.state==='playing')ui.pause();});
 document.addEventListener('pointerlockchange',()=>{if(!document.pointerLockElement&&game.state==='playing')ui.pause();});
 ui.ready();let previous=performance.now(),accumulator=0;
 function frame(now:number){const dt=Math.min((now-previous)/1000,.1);previous=now;accumulator+=dt;if(game.state==='playing'){while(accumulator>=1/60){game.update(1/60);accumulator-=1/60;}}else accumulator=0;
  for(const e of game.events){view.vfx.event(e);audio.play(e);ui.event(e);}game.events=[];view.render(game,dt);ui.update(dt);requestAnimationFrame(frame);
 }requestAnimationFrame(frame);
 // Read-only diagnostics are available in production; mutation hooks only on explicit QA builds.
 const diagnostics={snapshot:()=>({...game.snapshot(),frameMs:view.frameMs,drawCalls:view.renderer.info.render.calls,triangles:view.renderer.info.render.triangles}),assets:()=>[...view.assets.models.keys()]};
 Object.assign(window,{riftborne:diagnostics});
 if(new URLSearchParams(location.search).has('qa'))Object.assign(window,{riftborneQA:{game,view,ui}});
}
boot().catch(error=>{console.error(error);document.getElementById('loading')!.hidden=true;const el=document.getElementById('fatal')!;el.hidden=false;el.textContent=`The arena could not load: ${error instanceof Error?error.message:String(error)}. Reload the page to retry.`;});
