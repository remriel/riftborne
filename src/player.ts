import {V,clamp,type Player,type Input,type GameEvent} from './core';
import {ELEMENTS} from './config';
import type {ArenaPhysics} from './physics';
export function createPlayer():Player{return {id:0,pos:V(0,1.1,16),vel:V(),hp:160,maxHp:160,radius:.8,status:{},hurt:0,armor:0,frozen:0,stagger:0,dead:false,yaw:0,pitch:.12,grounded:true,jumps:0,energy:100,dodge:0,invulnerable:0,runeCD:0,runeTime:0,rune:'Blink',hands:['fire','frost'],primary:[0,0],secondary:[0,0],ultimate:35,dashTime:0,flight:0};}
export class PlayerController {
 update(p:Player,input:Input,physics:ArenaPhysics,dt:number,mods:Record<string,number>,events:GameEvent[]){
  const k=input.keys,press=input.pressed;
  p.yaw-=input.mouseX*.0022;p.pitch=clamp(p.pitch+input.mouseY*.0018,-1.1,1.15);input.mouseX=0;input.mouseY=0;
  const forward=V(-Math.sin(p.yaw),0,-Math.cos(p.yaw)),right=V(Math.cos(p.yaw),0,-Math.sin(p.yaw));
  const move=V();if(k.has('KeyW'))move.add(forward);if(k.has('KeyS'))move.sub(forward);if(k.has('KeyD'))move.add(right);if(k.has('KeyA'))move.sub(right);move.normalize();
  p.dodge=Math.max(0,p.dodge-dt);p.runeCD=Math.max(0,p.runeCD-dt);p.runeTime=Math.max(0,p.runeTime-dt);p.invulnerable=Math.max(0,p.invulnerable-dt);p.flight=Math.max(0,p.flight-dt);p.dashTime=Math.max(0,p.dashTime-dt);
  const wind=p.hands.includes('wind')?1.22:1,air=1+(mods.flight||0)*.25;
  let speed=(k.has('ShiftLeft')?17:12)*(p.grounded?1:air)*wind;
  if(k.has('ControlLeft')&&p.grounded)speed=21;
  if(p.status.frost)speed*=.7;
  if(p.dashTime<=0){const accel=1-Math.exp(-(p.grounded?15:7*air)*dt);p.vel.x+=(move.x*speed-p.vel.x)*accel;p.vel.z+=(move.z*speed-p.vel.z)*accel;}
  if(press.has('Space')&&p.jumps<2){p.vel.y=p.jumps===0?13:11;p.jumps++;p.grounded=false;events.push({type:'dodge',pos:p.pos.clone(),element:'wind',size:1});}
  const gliding=k.has('Space')&&!p.grounded&&p.energy>0&&p.vel.y<3;
  if(p.flight>0){p.vel.y=k.has('Space')?12:3;p.energy=Math.min(100,p.energy+10*dt);}
  else if(gliding){p.vel.y=Math.max(p.vel.y-5*dt,-2.4);p.energy-=12*dt;}
  else {p.vel.y-=28*dt;p.energy=Math.min(100,p.energy+(p.grounded?40:6)*dt);}
  if((press.has('AltLeft')||press.has('KeyC'))&&p.dodge<=0){const d=move.lengthSq()?move:forward;p.vel.copy(d).multiplyScalar(40);p.vel.y=p.grounded?3:5;p.dashTime=.2;p.invulnerable=.32;p.dodge=1.8*Math.pow(.75,mods.dash||0);events.push({type:'dodge',pos:p.pos.clone(),element:'wind',size:2});}
  if(press.has('KeyR')&&p.runeCD<=0){p.runeCD=12;switch(p.rune){
   case 'Blink':{const d=move.lengthSq()?move:forward;const hit=physics.ray(p.pos,d,13);p.pos.addScaledVector(d,hit?Math.max(0,hit.timeOfImpact-1.2):13);physics.teleport(p.pos);p.invulnerable=.5;break;}
   case 'Flight':p.flight=5;break;case 'Dash':p.vel.copy(move.lengthSq()?move:forward).multiplyScalar(60);p.dashTime=.5;p.invulnerable=.6;break;case 'Leap':p.vel.y=28;p.jumps=1;break;case 'Shadow':p.runeTime=4;p.invulnerable=1;break;
  }events.push({type:'dodge',pos:p.pos.clone(),element:'wind',size:3});}
  for(let i=0;i<4;i++){const a=i*Math.PI/2+.5,x=Math.sin(a)*29,z=Math.cos(a)*29;if(Math.hypot(p.pos.x-x,p.pos.z-z)<3.2&&p.pos.y<22){p.vel.y=Math.max(p.vel.y,17);p.energy=100;p.jumps=1;}}
  const result=physics.move(p.pos,p.vel.clone().multiplyScalar(dt));p.pos.copy(result.pos);p.grounded=result.grounded;
  if(p.grounded){if(p.vel.y<0)p.vel.y=0;p.jumps=0;}else if(p.jumps===0)p.jumps=1;
  if(p.pos.y<-12){p.pos.set(0,10,22);p.vel.set(0,0,0);p.hp=Math.max(1,p.hp-15);p.invulnerable=2;physics.teleport(p.pos);events.push({type:'warning',text:'RIFT RECOVERY · −15 HEALTH'});}
  if(p.pos.y>40)p.vel.y=Math.min(p.vel.y,0);
  if(press.has('Digit1'))p.hands[0]=ELEMENTS[(ELEMENTS.indexOf(p.hands[0])+1)%6];
  if(press.has('Digit2'))p.hands[1]=ELEMENTS[(ELEMENTS.indexOf(p.hands[1])+1)%6];
 }
}

