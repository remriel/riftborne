import {BOSSES,UPGRADES,type Element} from './config';
import {V,emptyInput,segmentDistance,type Enemy,type GameEvent,type Input,type Pickup,type Projectile,type Prop,type Telegraph,type Zone} from './core';
import {ArenaPhysics} from './physics';
import {PlayerController,createPlayer} from './player';
import {BossController,createBoss} from './boss';
import {CombatSystem} from './combat';
export class Game {
 physics=new ArenaPhysics();controller=new PlayerController();bossAI=new BossController();combat=new CombatSystem();player=createPlayer();boss=createBoss(0);input:Input=emptyInput();
 projectiles:Projectile[]=[];zones:Zone[]=[];telegraphs:Telegraph[]=[];enemies:Enemy[]=[];props:Prop[]=[];pickups:Pickup[]=[];
 waves:{id:number;pos:ReturnType<typeof V>;radius:number;life:number;element:Element;hit:boolean}[]=[];
 events:GameEvent[]=[];nextId=10;time=0;runTime=0;state:'menu'|'playing'|'paused'|'upgrade'|'dead'|'won'='menu';mods:Record<string,number>={};aimPoint=V(0,4,-13);difficulty=1;lockOn=false;bossActive=true;choices:typeof UPGRADES=[];kills=0;best=0;runKills=0;
 get bossHeight(){return BOSSES[this.boss.index].height;}
 get damageMultiplier(){return 1+.18*(this.mods.power||0);}
 async init(){await this.physics.init();try{this.best=Number(localStorage.getItem('riftborne-best')||0);}catch{}this.setupArena();}
 setupArena(){this.props=[];this.pickups=[];for(let i=0;i<16;i++){const a=i*2.399;const r=18+(i%3)*6;const pos=V(Math.sin(a)*r,0,Math.cos(a)*r);if(Math.abs(pos.x)<3&&pos.z>5)pos.x+=5;pos.y=this.physics.floor(pos.x,pos.z);const prop:Prop={id:this.nextId++,pos,hp:i%4===0?220:60,type:i%4===0?'pillar':'barrel',radius:i%4===0?1.1:.75};this.props.push(prop);this.physics.addProp(prop.id,pos,prop.radius,i%4===0?5:1.8);}
  for(let i=0;i<6;i++){const a=i*Math.PI/3;this.addPickup(V(Math.sin(a)*29,2,Math.cos(a)*29),i%2?'power':'health');}
 }
 start(){this.mods={};this.player=createPlayer();this.combat=new CombatSystem();this.kills=0;this.runTime=0;this.loadBiome(0);this.state='playing';}
 loadBiome(index:number){this.physics.reset();this.projectiles=[];this.zones=[];this.telegraphs=[];this.enemies=[];this.waves=[];this.events=[];this.boss=createBoss(index);this.player.pos.set(0,1.1,16);this.player.vel.set(0,0,0);this.player.hp=this.player.maxHp;this.player.dead=false;this.player.status={};this.player.invulnerable=2;this.player.yaw=0;this.player.pitch=.13;this.player.primary=[0,0];this.player.secondary=[0,0];this.player.energy=100;this.physics.teleport(this.player.pos);this.setupArena();this.bossActive=index===0;this.runKills=0;if(index>0)for(let i=0;i<6;i++)this.spawnEnemy(V(Math.sin(i*1.1)*16,1,5+Math.cos(i*1.1)*14),i%4);this.events.push({type:'phase',text:BOSSES[index].biome});}
 spawnEnemy(pos:ReturnType<typeof V>,kind:number){if(this.enemies.filter(e=>!e.dead).length>=10)return;this.enemies.push({id:this.nextId++,pos:pos.clone().setY(kind===1?5:1),vel:V(),hp:kind===2?260:130,maxHp:kind===2?260:130,radius:kind===2?1.4:1,status:{},hurt:0,armor:kind===2?80:0,frozen:0,stagger:0,dead:false,kind,cooldown:2+Math.random()*2,angle:Math.random()*6.28});}
 addPickup(pos:ReturnType<typeof V>,type:Pickup['type']){this.pickups.push({id:this.nextId++,pos:pos.clone().setY(Math.max(.8,this.physics.floor(pos.x,pos.z)+1.1)),type});}
 targets(){return [...(this.bossActive&&!this.boss.dead?[this.boss]:[]),...this.enemies.filter(e=>!e.dead)];}
 aimDirection(){return V(-Math.sin(this.player.yaw)*Math.cos(this.player.pitch),-Math.sin(this.player.pitch),-Math.cos(this.player.yaw)*Math.cos(this.player.pitch));}
 update(dt:number){if(this.state!=='playing')return;this.time+=dt;this.runTime+=dt;this.controller.update(this.player,this.input,this.physics,dt,this.mods,this.events);
  if(this.input.pressed.has('KeyL'))this.lockOn=!this.lockOn;
  if(this.input.buttons.has(0))this.combat.cast(this,0);if(this.input.buttons.has(2))this.combat.cast(this,1);
  if(this.input.pressed.has('KeyQ'))this.combat.cast(this,0,true);if(this.input.pressed.has('KeyE'))this.combat.cast(this,1,true);if(this.input.pressed.has('KeyF'))this.combat.ultimate(this);
  if(this.bossActive)this.bossAI.update(this,dt);
  for(const t of this.telegraphs){t.time-=dt;if(t.time<=0&&t.time>-dt*1.5){const p=this.player;
   if(t.type==='circle'){const grounded=p.pos.y-t.pos.y<5;if(Math.hypot(p.pos.x-t.pos.x,p.pos.z-t.pos.z)<t.radius&&grounded)this.combat.damage(this,p,t.damage,t.element);this.events.push({type:'burst',pos:t.pos.clone(),element:t.element,size:5});if(['meteor','spikes','storm'].includes(this.boss.attack))this.combat.zone(this,t.pos,t.element,3,4,'enemy');}
   else if(t.type==='line'&&['beam','breath'].includes(this.boss.attack)&&t.target&&segmentDistance(t.pos,t.target,p.pos)<3)this.combat.damage(this,p,t.damage,t.element);
  }}this.telegraphs=this.telegraphs.filter(t=>t.time>-.15);
  for(const w of this.waves){w.life-=dt;w.radius+=dt*13;const dist=Math.hypot(this.player.pos.x-w.pos.x,this.player.pos.z-w.pos.z);if(!w.hit&&Math.abs(dist-w.radius)<1.4&&this.player.pos.y-w.pos.y<2.8){this.combat.damage(this,this.player,26,w.element);w.hit=true;}}this.waves=this.waves.filter(w=>w.life>0);
  for(const e of this.enemies){if(e.dead)continue;e.cooldown-=dt;const dir=this.player.pos.clone().sub(e.pos).setY(0);const dist=dir.length();dir.normalize();if(e.frozen<=0){if(dist>8)e.pos.addScaledVector(dir,dt*(e.kind===2?3:6));else e.pos.addScaledVector(V(-dir.z,0,dir.x),dt*3);e.pos.addScaledVector(e.vel,dt);e.vel.multiplyScalar(Math.exp(-5*dt));}e.pos.y=e.kind===1?5+Math.sin(this.time+e.angle)*2:Math.max(1,this.physics.floor(e.pos.x,e.pos.z)+1);if(e.cooldown<=0&&this.player.runeTime<=0){const elem=(['fire','wind','stone','toxic'] as Element[])[e.kind];this.combat.shoot(this,e.pos.clone().add(V(0,1,0)),this.player.pos.clone().addScaledVector(this.player.vel,.25).sub(e.pos),elem,'enemy',false,.4);e.cooldown=2.5+Math.random();}}
  const before=this.enemies.filter(e=>e.dead).length;this.combat.update(this,dt);const after=this.enemies.filter(e=>e.dead).length;this.kills+=after-before;this.runKills+=after-before;
  for(const p of this.pickups){if(p.pos.distanceTo(this.player.pos)<2.7){if(p.type==='health')this.player.hp=Math.min(this.player.maxHp,this.player.hp+22);if(p.type==='charge')this.player.ultimate=Math.min(100,this.player.ultimate+12);if(p.type==='power'){this.mods.power=(this.mods.power||0)+.2;this.player.ultimate=Math.min(100,this.player.ultimate+8);}p.id=-1;this.events.push({type:'pickup',text:p.type==='power'?'GAUNTLETS EMPOWERED · +3.6% DAMAGE':p.type==='health'?'+22 HEALTH':'+12 OVERDRIVE',element:'wind'});}}this.pickups=this.pickups.filter(p=>p.id!==-1);
  if(!this.bossActive&&this.enemies.every(e=>e.dead)){this.bossActive=true;this.events.push({type:'phase',text:BOSSES[this.boss.index].name});}
  if(this.player.dead){this.state='dead';this.save();}
  else if(this.boss.dead){this.kills++;if(this.boss.index===4){this.state='won';this.events.push({type:'victory',text:'THE RIFT IS YOURS'});this.save();}else{this.state='upgrade';this.choices=[...UPGRADES].sort(()=>Math.random()-.5).slice(0,3);}}
  this.input.pressed.clear();
 }
 selectUpgrade(id:string){this.mods[id]=(this.mods[id]||0)+1;if(id==='vitality')this.player.maxHp+=35;this.loadBiome(this.boss.index+1);this.state='playing';}
 save(){this.best=Math.max(this.best,this.boss.index+(this.boss.dead?1:0));try{localStorage.setItem('riftborne-best',String(this.best));}catch{}}
 snapshot(){return {state:this.state,biome:this.boss.index,phase:this.boss.phase,hp:this.player.hp,bossHp:this.boss.hp,position:this.player.pos.toArray(),grounded:this.player.grounded,projectiles:this.projectiles.length,zones:this.zones.length,combos:this.combat.comboCount,enemies:this.enemies.filter(e=>!e.dead).length,damage:this.combat.totalDamage};}
}


