import type {UI} from './ui';
import type {Preferences} from './preferences';
const $=(id:string)=>document.getElementById(id)!;

export class UIPolish {
 hitTime=0;damageTime=0;hints=true;guideStep=0;guideRun=-1;
 constructor(private ui:UI){}
 apply(p:Preferences){const {view,audio,g}=this.ui;view.fov=p.fov;audio.setVolume(p.volume);view.shakeEnabled=p.shake;view.quality=p.bloom;view.ambientOcclusion=p.ambientOcclusion;view.reducedMotion=p.reducedMotion;view.setPerformance(p.performance);g.difficulty=p.difficulty;g.controller.sensitivity=p.sensitivity;g.controller.invertY=p.invertY;this.hints=p.hints;document.documentElement.classList.toggle('reduced-motion',p.reducedMotion);}
 preferences():Preferences{const {view,audio,g}=this.ui;return {fov:view.fov,volume:audio.volume,shake:view.shakeEnabled,bloom:view.quality,ambientOcclusion:view.ambientOcclusion,difficulty:g.difficulty,sensitivity:g.controller.sensitivity,invertY:g.controller.invertY,reducedMotion:view.reducedMotion,performance:view.performanceMode,hints:this.hints};}
 settings(){const ui=this.ui;if(ui.g.state==='playing'){ui.g.state='paused';ui.release();}const p=this.preferences();
  const toggle=(id:string,label:string,checked:boolean)=>`<label class="settings-row">${label}<input id="${id}" type="checkbox" ${checked?'checked':''}/></label>`;
  ui.show(`<span class="eyebrow">MAKE IT YOURS</span><h2>Settings</h2><div class="settings-grid"><section><h3>Controls & comfort</h3><label class="settings-row">Field of view<input id="fov" type="range" min="60" max="100" value="${p.fov}"/></label><label class="settings-row">Look sensitivity<input id="sensitivity" type="range" min="0.25" max="2.5" step="0.05" value="${p.sensitivity}"/></label>${toggle('invert','Invert vertical look',p.invertY)}${toggle('motion','Reduced motion',p.reducedMotion)}${toggle('shake','Camera shake',p.shake)}${toggle('hints','Contextual field guide',p.hints)}</section><section><h3>Sound & rendering</h3><label class="settings-row">Sound volume<input id="volume" type="range" min="0" max="100" value="${p.volume*100}"/></label>${toggle('bloom','Bloom effects',p.bloom)}${toggle('occlusion','Contact shadows',p.ambientOcclusion)}${toggle('performance','Performance mode',p.performance)}<p class="setting-help">Performance mode reduces render resolution and disables shadows, contact shadows and bloom. Reduced motion removes camera shake, dash zoom and UI animation.</p><label class="settings-row">Challenge<select id="difficulty"><option value="0.6" ${p.difficulty===.6?'selected':''}>Wayfarer · gentler</option><option value="1" ${p.difficulty===1?'selected':''}>Battlemage · standard</option><option value="1.4" ${p.difficulty===1.4?'selected':''}>Archmage · unforgiving</option></select></label></section></div><button class="primary" id="back">SAVE & RETURN <span>→</span></button>`);
  const number=(id:string)=>Number(($(id) as HTMLInputElement).value),checked=(id:string)=>($(id) as HTMLInputElement).checked;
  $('back').onclick=()=>{this.apply({fov:number('fov'),volume:number('volume')/100,sensitivity:number('sensitivity'),invertY:checked('invert'),reducedMotion:checked('motion'),shake:checked('shake'),bloom:checked('bloom'),ambientOcclusion:checked('occlusion'),performance:checked('performance'),hints:checked('hints'),difficulty:number('difficulty')});try{localStorage.setItem('riftborne-settings',JSON.stringify(this.preferences()));}catch{}ui.back();};
 }
 update(dt:number){const {g,view}=this.ui,p=g.player,b=g.boss;
  this.hitTime=Math.max(0,this.hitTime-dt);this.damageTime=Math.max(0,this.damageTime-dt);
  $('hit-confirm').style.opacity=this.hitTime>0?'1':'0';$('damage-flash').style.opacity=view.reducedMotion?'0':String(this.damageTime*1.6);
  $('menu').inert=!$('modal').hidden;$('hud').inert=!$('modal').hidden;
  if(g.runTime<this.guideRun)this.guideStep=0;this.guideRun=g.runTime;
  const complete=[Math.hypot(p.pos.x,p.pos.z-16)>3,p.jumps>0,g.input.buttons.has(0)&&g.input.buttons.has(2),p.dodge>0,g.lockOn];
  if(complete[this.guideStep])this.guideStep++;
  const lessons=[['Keep moving. Stay alive.','W A S D · MOVE / SHIFT · SPRINT'],['Own the air.','SPACE · DOUBLE JUMP / HOLD · GLIDE'],['Combine fire and frost.','HOLD BOTH MOUSE BUTTONS · THERMAL SHOCK'],['Slip through an attack.','C · DIRECTIONAL DODGE'],['Keep the guardian in sight.','L · LOCK ON / TAB · CHANGE LOADOUT']];
  const lesson=lessons[this.guideStep],visible=this.hints&&g.state==='playing'&&b.index===0&&g.runTime<60&&!!lesson;
  $('field-guide').hidden=!visible;if(visible){$('field-guide').querySelector('p')!.textContent=lesson[0];$('field-guide').querySelector('small')!.textContent=lesson[1];}
  const attacking=g.bossActive&&b.state==='telegraph'&&g.state==='playing';$('attack-cue').hidden=!attacking;
  if(attacking){$('attack-cue').querySelector('span')!.textContent=`${g.bossAI.label(b.attack)} · ${Math.max(0,b.timer).toFixed(1)}s`;$('attack-cue').querySelector('i')!.style.width=`${Math.max(0,Math.min(1,b.timer/Math.max(.65,1.6-b.phase*.17)))*100}%`;}
 }
}
