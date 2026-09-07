import {BOSSES,type Element} from './config';
import {V,type Boss} from './core';
import type {Game} from './game';
export function createBoss(index:number):Boss{const d=BOSSES[index];return {id:1,index,pos:V(0,index===1?9:0,-13),vel:V(),hp:d.hp,maxHp:d.hp,radius:d.radius,status:{},hurt:0,armor:index===2?1100:500,frozen:0,stagger:0,dead:false,phase:1,state:'approach',timer:2.5,attack:'salvo',target:V(),weak:0,action:0};}
export class BossController {
 element(g:Game):Element{const b=g.boss;return b.index===4?b.phase===1?(b.action%2?'wind':'fire'):b.phase===2?(b.action%2?'lightning':'frost'):b.phase===3?(b.action%2?'toxic':'stone'):(['fire','frost','lightning','stone','wind','toxic'] as Element[])[b.action%6]:BOSSES[b.index].element;}
 update(g:Game,dt:number){const b=g.boss,p=g.player,d=BOSSES[b.index];if(b.dead)return;
  const phase=Math.min(d.phases,1+Math.floor((1-b.hp/b.maxHp)*d.phases));
  if(phase>b.phase){b.phase=phase;b.state='stagger';b.timer=2.2;b.weak=6;b.armor=b.index===2?600:0;g.events.push({type:'phase',text:`PHASE ${phase} · ${b.index===0?(phase===2?'CORE EXPOSED':'THE ARENA FRACTURES'):'POWER UNBOUND'}`,pos:b.pos.clone(),element:this.element(g),size:9});if(b.index===0&&phase===3)for(let i=0;i<8;i++){const a=i*Math.PI/4;g.combat.zone(g,V(Math.sin(a)*39,1,Math.cos(a)*39),'lava',8,900,'enemy');}}
  b.timer-=dt;b.weak=Math.max(0,b.weak-dt);b.vel.multiplyScalar(Math.exp(-4*dt));b.pos.addScaledVector(b.vel,dt);
  const dist=p.pos.distanceTo(b.pos),direction=p.pos.clone().sub(b.pos).setY(0).normalize();
  const flying=b.index===1||b.index===3||b.index===4;
  const desiredY=b.index===1?9+Math.sin(g.time*.6)*5:b.index===3?3+Math.sin(g.time)*1.5:b.index===4?3+Math.sin(g.time*1.8)*2:0;
  b.pos.y+=(desiredY-b.pos.y)*Math.min(1,dt*2);
  if(b.state==='stagger'||b.stagger>0){b.weak=Math.max(b.weak,1);if(b.timer<=0&&b.stagger<=0){b.state='approach';b.timer=1.5;}return;}
  if(b.state==='approach'){
   const preferred=b.index===4?13:b.index===3?20:17;
   if(dist>preferred)b.pos.addScaledVector(direction,dt*(b.index===4?10:5)*(b.frozen>0?.3:1));
   else if(dist<preferred-5)b.pos.addScaledVector(direction,-dt*4);
   else b.pos.addScaledVector(V(-direction.z,0,direction.x),Math.sin(g.time*.4)>0?dt*3:-dt*3);
   if(b.timer<=0&&p.runeTime<=0){b.action++;b.attack=d.attacks[(b.action+b.phase-1)%d.attacks.length];if(dist<9&&b.index!==3)b.attack='charge';b.target.copy(p.pos).addScaledVector(p.vel,.4);b.target.y=Math.max(.2,b.target.y);b.state='telegraph';b.timer=Math.max(.65,1.6-b.phase*.17);g.events.push({type:'warning',text:this.label(b.attack),element:this.element(g)});this.telegraph(g,b.timer);}
  }else if(b.state==='telegraph'){if(b.timer<=0){b.state='attack';b.timer=b.attack==='charge'||b.attack==='dive'?.65:.35;this.execute(g);}}
  else if(b.state==='attack'){
   if(b.attack==='charge'||b.attack==='dive'){const to=b.target.clone().sub(b.pos);if(!flying)to.y=0;if(to.length()>1)b.pos.addScaledVector(to.normalize(),dt*45);if(p.pos.distanceTo(b.pos.clone().add(V(0,2,0)))<b.radius+1.5)g.combat.damage(g,p,28,this.element(g));}
   if(b.timer<=0){b.state='recover';b.timer=Math.max(.6,2.1-b.phase*.2);b.weak=b.timer+.7;}
  }else if(b.state==='recover'&&b.timer<=0){b.state='approach';b.timer=Math.max(.5,2.2-b.phase*.35);}
  b.pos.x=Math.max(-36,Math.min(36,b.pos.x));b.pos.z=Math.max(-36,Math.min(36,b.pos.z));
 }
 label(attack:string){return ({salvo:'INCOMING · ARCING FIRE',ring:'MAGMA WAVE · JUMP',meteor:'SKYFALL · KEEP MOVING',charge:'CHARGE · DODGE SIDEWAYS',pool:'CORRUPTED GROUND · REPOSITION',breath:'STORM BREATH · BREAK THE LINE',cyclone:'CYCLONE · CLEAR THE PATH',dive:'DIVE ATTACK · DODGE',storm:'LIGHTNING STORM · LEAVE THE MARKS',wall:'RISING WALL · GO AIRBORNE',beam:'FREEZE BEAM · STRAFE',spikes:'ICE ERUPTION · MOVE',blizzard:'BLIZZARD · TAKE FLIGHT',summon:'SUMMONING · GUARDIANS ARRIVE',illusion:'ILLUSIONS · FIND THE ORACLE',teleport:'RIFT STEP · WATCH YOUR BACK',duel:'DUALCAST · STAY MOBILE'} as Record<string,string>)[attack]||'INCOMING ATTACK';}
 telegraph(g:Game,time:number){const b=g.boss,e=this.element(g);const base={time,maxTime:time,element:e,damage:22+4*b.phase};
  if(['charge','dive','beam','breath'].includes(b.attack))g.telegraphs.push({...base,id:g.nextId++,pos:b.pos.clone(),radius:3,type:'line',target:b.target.clone()});
  else if(b.attack==='ring')g.telegraphs.push({...base,id:g.nextId++,pos:b.pos.clone(),radius:5,type:'ring',damage:24});
  else {const count=['meteor','storm','spikes'].includes(b.attack)?3+b.phase:1;for(let i=0;i<count;i++){const point=b.target.clone().add(V((i?Math.sin(i*2.4)*7:0),0,(i?Math.cos(i*2.4)*7:0)));point.y=g.physics.floor(point.x,point.z)+.12;g.telegraphs.push({...base,id:g.nextId++,pos:point,radius:5,type:'circle'});}}
 }
 execute(g:Game){const b=g.boss,e=this.element(g),c=g.combat,origin=b.pos.clone().add(V(0,g.bossHeight*.6,0)),aim=b.target.clone().sub(origin).normalize();
  switch(b.attack){
   case 'salvo':case 'duel':case 'breath':case 'beam':for(let i=-2-b.phase;i<=2+b.phase;i++){const dir=aim.clone().add(V(i*.08,Math.abs(i)*.013,0)).normalize();c.shoot(g,origin,dir,e,'enemy',b.attack==='salvo',.3);}break;
   case 'ring':g.waves.push({id:g.nextId++,pos:b.pos.clone(),radius:3,life:5,element:e,hit:false});break;
   case 'pool':case 'blizzard':c.zone(g,b.target,e,8+b.phase,10,'enemy');break;
   case 'cyclone':{const z=c.zone(g,b.target,'wind',5,9,'enemy');z.vel.copy(g.player.pos).sub(b.pos).setY(0).normalize().multiplyScalar(5);if(b.index===4)c.zone(g,b.target,'firestorm',6,9,'enemy');break;}
   case 'wall':for(let i=-2;i<=2;i++)c.zone(g,b.target.clone().add(V(i*4,0,0)),e,3,9,'enemy');break;
   case 'summon':case 'illusion':for(let i=0;i<3+b.phase;i++)g.spawnEnemy(b.pos.clone().add(V(Math.sin(i*2)*9,0,Math.cos(i*2)*9)),b.attack==='illusion'?3:i%3);break;
   case 'teleport':{b.pos.copy(g.player.pos).add(V(Math.sin(g.time)*16,4,Math.cos(g.time)*16));c.zone(g,b.target,'toxic',7,7,'enemy');break;}
  }
 }
}
