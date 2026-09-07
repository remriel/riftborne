import * as T from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {AssetLibrary,type ActorAnimation} from './assets';
import {BiomeView} from './world';
import {VFXManager} from './vfx';
import {BOSSES,SPELLS,type Element} from './config';
import {V,clamp} from './core';
import type {Game} from './game';
interface Actor {root:T.Group;anim:ActorAnimation;materials:T.MeshStandardMaterial[];}
export class GameRenderer {
 scene=new T.Scene();camera=new T.PerspectiveCamera(75,innerWidth/innerHeight,.1,450);renderer:T.WebGLRenderer;composer:EffectComposer;bloom:UnrealBloomPass;
 assets=new AssetLibrary();world!:BiomeView;vfx:VFXManager;actors=new Map<number,Actor>();dynamic=new Map<number,T.Object3D>();props=new Map<number,T.Object3D>();lastBiome=-1;lastBoss:unknown;raycaster=new T.Raycaster();target=V();fov=75;shakeEnabled=true;quality=true;frameMs=16;core!:T.Sprite;
 constructor(public canvas:HTMLCanvasElement){
  this.renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));this.renderer.setSize(innerWidth,innerHeight);this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFSoftShadowMap;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.2;
  this.scene.add(new T.HemisphereLight(0xdbedff,0x544652,2.5));const sun=new T.DirectionalLight(0xffddbb,3.2);sun.position.set(-35,65,25);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-55,right:55,top:55,bottom:-55,near:1,far:150});sun.shadow.bias=-.0005;sun.shadow.normalBias=.07;this.scene.add(sun);
  const rim=new T.DirectionalLight(0x84c6ff,1.6);rim.position.set(20,15,-30);this.scene.add(rim);
  this.vfx=new VFXManager(this.scene);this.composer=new EffectComposer(this.renderer);this.composer.addPass(new RenderPass(this.scene,this.camera));this.bloom=new UnrealBloomPass(new T.Vector2(innerWidth,innerHeight),.38,.6,1.3);this.composer.addPass(this.bloom);this.composer.addPass(new OutputPass());
  window.addEventListener('resize',()=>this.resize());canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();document.getElementById('fatal')!.textContent='Graphics context interrupted. Reload to restore the arena.';document.getElementById('fatal')!.hidden=false;});
 }
 async init(g:Game,progress:(n:number)=>void){await this.assets.load(progress);this.scene.background=this.assets.textures.get('sky')!;this.world=new BiomeView(this.scene,this.assets);this.build(g);}
 resize(){this.camera.aspect=innerWidth/innerHeight;this.camera.updateProjectionMatrix();this.renderer.setSize(innerWidth,innerHeight);this.composer.setSize(innerWidth,innerHeight);}
 actor(id:number,name:string,height:number,tint?:number){const root=this.assets.model(name,height);const materials:T.MeshStandardMaterial[]=[];root.traverse(n=>{if(n instanceof T.Mesh){n.material=Array.isArray(n.material)?n.material.map(m=>m.clone()):n.material.clone();for(const m of Array.isArray(n.material)?n.material:[n.material])if(m instanceof T.MeshStandardMaterial){if(tint)m.color.set(tint);materials.push(m);}}});const actor={root,anim:this.assets.animation(root,name),materials};this.scene.add(root);this.actors.set(id,actor);return actor;}
 build(g:Game){this.world.build(g);for(const a of this.actors.values()){a.anim.dispose();a.materials.forEach(m=>m.dispose());this.scene.remove(a.root);}this.actors.clear();for(const o of this.dynamic.values())this.vfx.disposeObject(o);this.dynamic.clear();for(const o of this.props.values())this.scene.remove(o);this.props.clear();if(this.core)this.vfx.disposeObject(this.core);
  this.actor(0,'mage',2.2);const d=BOSSES[g.boss.index];this.actor(1,d.asset,d.height,g.boss.index===0?0xdca280:undefined);this.core=this.vfx.orb(d.element,3);this.scene.add(this.core);
  for(const p of g.props){const o=this.assets.model(p.type==='barrel'?'barrel_large':'pillar_decorated',p.type==='barrel'?1.8:5);o.position.copy(p.pos);this.props.set(p.id,o);this.scene.add(o);}
  this.lastBiome=g.boss.index;this.lastBoss=g.boss;this.camera.position.copy(g.player.pos).add(V(3,5,9));
 }
 updateCamera(g:Game,dt:number){const p=g.player; if(g.state==='menu'){this.camera.position.set(23,12,30);this.camera.lookAt(0,4,-12);this.camera.updateMatrixWorld();return;}
  if(g.lockOn&&!g.boss.dead&&g.state==='playing'){const dir=g.boss.pos.clone().add(V(0,g.bossHeight*.45,0)).sub(p.pos);const desiredYaw=Math.atan2(-dir.x,-dir.z);let delta=desiredYaw-p.yaw;delta=Math.atan2(Math.sin(delta),Math.cos(delta));p.yaw+=delta*Math.min(1,dt*5);p.pitch+=(Math.atan2(-dir.y,Math.hypot(dir.x,dir.z))-p.pitch)*Math.min(1,dt*5);}
  const dir=g.aimDirection(),right=V(Math.cos(p.yaw),0,-Math.sin(p.yaw));const anchor=p.pos.clone().add(V(0,1.25,0));const desired=anchor.clone().addScaledVector(dir,-7.7).addScaledVector(right,1.3);
  const offset=desired.clone().sub(anchor),distance=offset.length();const hit=g.physics.ray(anchor,offset.normalize(),distance);if(hit)desired.copy(anchor).addScaledVector(offset,Math.max(.9,hit.timeOfImpact-.3));
  const smoothing=1-Math.exp(-14*dt);this.camera.position.lerp(desired,smoothing);this.target.copy(anchor).addScaledVector(dir,50);this.camera.lookAt(this.target);
  if(this.shakeEnabled&&this.vfx.shake>0){this.camera.position.x+=(Math.random()-.5)*this.vfx.shake;this.camera.position.y+=(Math.random()-.5)*this.vfx.shake;}
  const f=this.fov+(p.dashTime>0?8:0);this.camera.fov+=(f-this.camera.fov)*Math.min(1,dt*8);this.camera.updateProjectionMatrix();this.camera.updateMatrixWorld();
  this.raycaster.setFromCamera(new T.Vector2(0,0),this.camera);const ray=this.raycaster.ray;let min=100;g.aimPoint.copy(ray.origin).addScaledVector(ray.direction,min);
  for(const t of g.targets()){const sphere=new T.Sphere(t.pos.clone().add(V(0,t.id===1?g.bossHeight*.43:0,0)),t.radius);const point=ray.intersectSphere(sphere,V());if(point){const distance=point.distanceTo(ray.origin);if(distance<min){min=distance;g.aimPoint.copy(point);}}}
  const worldHit=g.physics.ray(ray.origin,ray.direction,min);if(worldHit)g.aimPoint.copy(ray.origin).addScaledVector(ray.direction,worldHit.timeOfImpact);
 }
 render(g:Game,dt:number){if(this.lastBoss!==g.boss)this.build(g);this.frameMs+=(dt*1000-this.frameMs)*.03;this.updateCamera(g,dt);const p=g.player;
  for(const [id,a] of this.actors){const f=id===0?p:id===1?g.boss:g.enemies.find(e=>e.id===id);if(!f)continue;a.root.visible=!f.dead&&(id!==1||g.bossActive);a.root.position.copy(f.pos);if(id===0){a.root.position.y-=1.05;a.root.rotation.y=p.yaw+Math.PI;a.root.visible=g.state!=='menu';a.anim.play(p.dashTime>0?['Dodge_Forward']:!p.grounded?['Jump_Idle']:Math.hypot(p.vel.x,p.vel.z)>2?['Running_A']:g.input.buttons.size?['Spellcasting']:['Idle']);a.root.traverse(o=>{if(o instanceof T.Mesh){const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>{m.transparent=p.runeTime>0;m.opacity=p.runeTime>0?.4:1;});}});}
   else{const delta=p.pos.clone().sub(f.pos);a.root.rotation.y=Math.atan2(delta.x,delta.z);a.anim.play(id===1&&g.boss.state==='telegraph'?['Punch','Spellcast_Raise']:id===1&&g.boss.state==='stagger'?['HitReact']:['Flying_Idle','Run','Spellcasting','Idle']);}
   if(g.state==='playing'||g.state==='menu')a.anim.update(dt);for(const m of a.materials){m.emissive.set(f.hurt>0?0xffffff:id===1&&g.boss.phase>1?BOSSES[g.boss.index].color:0x000000);m.emissiveIntensity=f.hurt>0?.8:id===1?.12:0;}
  }
  for(const e of g.enemies)if(!this.actors.has(e.id))this.actor(e.id,e.kind===2?'titan':e.kind===1?'wyrm':e.kind===3?'mage':'oracle',e.kind===2?3.2:2.1);
  for(const prop of g.props){const o=this.props.get(prop.id);if(o)o.visible=prop.hp>0;}
  this.core.visible=g.bossActive&&!g.boss.dead&&g.boss.weak>0;this.core.position.copy(g.boss.pos).add(V(0,g.bossHeight*.55,1.6));this.core.scale.setScalar(2.6+Math.sin(g.time*10)*.4);
  const alive=new Set<number>();const get=(id:number,create:()=>T.Object3D)=>{alive.add(id);let o=this.dynamic.get(id);if(!o){o=create();this.dynamic.set(id,o);this.scene.add(o);}return o;};
  for(const projectile of g.projectiles){const o=get(projectile.id,()=>this.vfx.orb(projectile.element,projectile.heavy?3:1.3));o.position.copy(projectile.pos);if(g.state==='playing')this.vfx.emit(projectile.pos,projectile.element,2,1);}
  for(const zone of g.zones){const o=get(zone.id,()=>{const group=new T.Group();group.add(this.vfx.ring(zone.element,zone.radius,.65));for(let i=0;i<5;i++){const s=this.vfx.orb(zone.element,zone.radius*.8);s.position.set(Math.sin(i*1.256)*zone.radius*.5,.2,Math.cos(i*1.256)*zone.radius*.5);(s.material as T.SpriteMaterial).opacity=.23;group.add(s);}return group;});o.position.copy(zone.pos);o.position.y=Math.max(.1,o.position.y);o.rotation.y=g.time*.35;if(zone.element.includes('storm')||zone.element==='wind'){o.children.slice(1).forEach((s,i)=>{s.position.y=1+(g.time*4+i*3)%12;s.scale.setScalar(2+s.position.y*.3);});}if(g.state==='playing'&&Math.random()<.3)this.vfx.emit(zone.pos.clone().add(V((Math.random()-.5)*zone.radius*2,.5,(Math.random()-.5)*zone.radius*2)),zone.element,2,3);}
  for(const t of g.telegraphs){const o=get(t.id,()=>{const group=new T.Group();if(t.type==='line'&&t.target){const line=new T.Line(new T.BufferGeometry().setFromPoints([V(),t.target.clone().sub(t.pos)]),new T.LineBasicMaterial({color:0xff736b,transparent:true,opacity:.9}));group.add(line);for(let j=0;j<8;j++){const ring=this.vfx.ring(t.element,2,.6);ring.position.copy(t.target.clone().sub(t.pos).multiplyScalar(j/8));group.add(ring);}}else{group.add(this.vfx.ring(t.element,t.radius));const disc=new T.Mesh(new T.CircleGeometry(t.radius,64),new T.MeshBasicMaterial({color:0xff5544,transparent:true,opacity:.16,side:T.DoubleSide,depthWrite:false}));disc.rotation.x=-Math.PI/2;group.add(disc);}return group;});o.position.copy(t.pos);o.position.y=Math.max(.12,o.position.y);const pulse=1+.025*Math.sin(g.time*25);o.scale.setScalar(pulse);}
  for(const w of g.waves){const o=get(w.id,()=>this.vfx.ring(w.element,1));o.position.copy(w.pos).add(V(0,.55,0));o.scale.setScalar(w.radius);}
  for(const pickup of g.pickups){const o=get(pickup.id,()=>{const group=new T.Group();group.add(this.vfx.orb(pickup.type==='health'?'wind':pickup.type==='power'?'fire':'lightning',2));group.add(this.vfx.ring('wind',.8));return group;});o.position.copy(pickup.pos).add(V(0,Math.sin(g.time*2+pickup.id)*.3,0));o.rotation.y=g.time;}
  for(let i=0;i<4;i++){const id=-10-i;const o=get(id,()=>{const group=new T.Group();for(let j=0;j<6;j++)group.add(this.vfx.ring('wind',2.5-j*.15,.35));return group;});const a=i*Math.PI/2+.5;o.position.set(Math.sin(a)*29,.2,Math.cos(a)*29);o.children.forEach((c,j)=>c.position.y=(g.time*3+j*2)%13);}
  for(let hand=0;hand<2;hand++){const id=-20-hand;const o=get(id,()=>this.vfx.orb(p.hands[hand],1.5));const right=V(Math.cos(p.yaw),0,-Math.sin(p.yaw));o.position.copy(p.pos).addScaledVector(right,hand===0?-.7:.7).add(V(0,.5,0));(o as T.Sprite).material.color.set(SPELLS[p.hands[hand]].color);o.visible=g.state!=='menu';}
  for(const [id,obj] of this.dynamic)if(!alive.has(id)){this.vfx.disposeObject(obj);this.dynamic.delete(id);}
  this.vfx.update(g.state==='playing'?dt:0);if(this.quality)this.composer.render();else this.renderer.render(this.scene,this.camera);
 }
}

