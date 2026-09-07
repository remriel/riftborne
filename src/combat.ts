import {SPELLS,type Element} from './config';
import {V,segmentDistance,type Fighter,type Projectile,type Zone,type GameEvent} from './core';
import {ElementInteractionSystem} from './interactions';
import type {Game} from './game';
export class CombatSystem {
 interactions=new ElementInteractionSystem(); comboCount=0; totalDamage=0;
 damage(g:Game,target:Fighter,amount:number,element:Element,point=target.pos,combo=true){
  if(target.dead)return;
  const player=target.id===0;if(player&&g.player.invulnerable>0)return;
  let damage=amount;
  if(!player){damage*=g.damageMultiplier;const previous=(Object.entries(target.status) as [Element,number][]).filter(([e,t])=>e!==element&&t>0).sort((a,b)=>b[1]-a[1])[0];
   if(previous&&combo){const rule=this.interactions.resolve(element,previous[0]);if(rule){damage*=rule.multiplier;delete target.status[previous[0]];this.comboCount++;g.events.push({type:'combo',pos:point.clone(),text:rule.name,element,value:damage,size:3});if(rule.zone)this.zone(g,point,rule.zone,4,4,'player');if(rule.force)target.vel.add(point.clone().sub(g.player.pos).normalize().multiplyScalar(rule.force));}}
   if(target.frozen>0&&(element==='fire'||element==='stone')){damage*=1.7;target.frozen=0;target.stagger=.9;}
   if(target.armor>0){const breakage=element==='stone'?damage*2:element==='fire'&&g.boss.index===2?damage*3:damage*.6;target.armor=Math.max(0,target.armor-breakage);damage*=.65;}
   if(target.id===1&&g.boss.weak>0&&point.y>target.pos.y+g.bossHeight*.35){damage*=1.7;g.events.push({type:'hit',text:'CORE STRIKE',element,pos:point.clone(),value:damage});}
   target.status[element]=element==='frost'?4:3; if(element==='frost'){target.frozen=Math.min(2,target.frozen+.24);}
   if(element==='wind'){target.vel.add(target.pos.clone().sub(g.player.pos).normalize().multiplyScalar(5));}
   this.totalDamage+=damage;g.player.ultimate=Math.min(100,g.player.ultimate+damage*.018);
  }else{damage*=g.difficulty;g.player.invulnerable=.22;g.events.push({type:'hit',value:damage,element});}
  target.hp=Math.max(0,target.hp-damage);target.hurt=.12;
  g.events.push({type:'burst',pos:point.clone(),element,size:Math.min(3,.5+damage/90)});
  if(target.hp<=0){target.dead=true;g.events.push({type:'death',pos:target.pos.clone(),element,size:target.id===1?12:3});if(target.id>1)g.addPickup(target.pos,'health');}
 }
 zone(g:Game,pos:ReturnType<typeof V>,element:Zone['element'],radius:number,life:number,owner:Zone['owner']){if(g.zones.length>=50)g.zones.shift();const z:Zone={id:g.nextId++,pos:pos.clone(),element,radius:radius*(owner==='player'?1+.3*(g.mods.zone||0):1),life,owner,tick:0,vel:V()};if(element.includes('storm')||element==='wind')z.vel.copy(g.aimDirection()).setY(0).normalize().multiplyScalar(4);g.zones.push(z);return z;}
 shoot(g:Game,pos:ReturnType<typeof V>,direction:ReturnType<typeof V>,element:Element,owner:'player'|'enemy',heavy=false,scale=1){
  const s=SPELLS[element];if(g.projectiles.length>180)return;
  const p:Projectile={id:g.nextId++,pos:pos.clone(),prev:pos.clone(),vel:direction.clone().normalize().multiplyScalar(owner==='enemy'?heavy?20:26:s.speed),element,damage:s.damage*scale*(heavy?2.6:1),radius:heavy?1.1:element==='stone'?.55:.3,life:4,owner,heavy,hit:new Set()};g.projectiles.push(p);g.events.push({type:'cast',pos:pos.clone(),element,size:heavy?2:1});return p;
 }
 cast(g:Game,hand:0|1,secondary=false){
  const p=g.player,e=p.hands[hand],s=SPELLS[e];if((secondary?p.secondary[hand]:p.primary[hand])>0)return;
  const origin=p.pos.clone().add(V(0,.55,0)).add(V(Math.cos(p.yaw),0,-Math.sin(p.yaw)).multiplyScalar(hand===0?-.6:.6));
  const dir=g.aimPoint.clone().sub(origin).normalize();
  if(secondary){p.secondary[hand]=s.cooldown*Math.pow(.8,g.mods.haste||0);const point=g.aimPoint.clone();if(point.distanceTo(p.pos)>30)point.copy(p.pos).addScaledVector(dir,30);point.y=Math.max(g.physics.floor(point.x,point.z)+.15,Math.min(point.y,g.boss.pos.y+3));
   if(e==='fire'){this.explode(g,point,8,135,e,'player');this.zone(g,point,e,6,5,'player');}
   if(e==='frost'){this.zone(g,point,e,8,7,'player');for(const t of g.targets())if(t.pos.distanceTo(point)<11){t.frozen=2;this.damage(g,t,85,e);}}
   if(e==='lightning'){this.explode(g,point,7,200,e,'player');this.zone(g,point,e,5,2,'player');}
   if(e==='stone'){this.explode(g,point,9,175,e,'player');this.zone(g,point,e,4,7,'player');}
   if(e==='wind'){this.zone(g,point,e,6,9,'player');p.vel.y=19;p.jumps=1;}
   if(e==='toxic')this.zone(g,point,e,8,10,'player');
   g.events.push({type:'cast',pos:point,element:e,size:4});
  }else{p.primary[hand]=s.rate;const scale=e==='frost'&&g.mods.pierce?1.25:1;this.shoot(g,origin,dir,e,'player',false,scale);if(e==='fire'&&g.mods.triple)for(const x of [-.06,.06])this.shoot(g,origin,dir.clone().add(V(x,0,x*.3)),e,'player',false,.5);}
 }
 ultimate(g:Game){if(g.player.ultimate<100)return;g.player.ultimate=0;for(const e of g.player.hands){this.explode(g,g.aimPoint,12,400,e,'player');this.zone(g,g.aimPoint,e,10,8,'player');}g.events.push({type:'combo',text:'ELEMENTAL OVERDRIVE',element:g.player.hands[0],size:10,pos:g.aimPoint.clone()});}
 explode(g:Game,pos:ReturnType<typeof V>,radius:number,damage:number,e:Element,owner:'player'|'enemy'){
  for(const t of owner==='player'?g.targets():[g.player]){const center=t.pos.clone().add(V(0,t.id===1?g.bossHeight*.4:0,0));if(center.distanceTo(pos)<radius+t.radius)this.damage(g,t,damage,e,pos);}
  for(const prop of g.props)if(prop.hp>0&&prop.pos.distanceTo(pos)<radius+prop.radius){prop.hp-=damage;if(prop.hp<=0){g.physics.removeProp(prop.id);g.events.push({type:'burst',pos:prop.pos.clone(),element:'stone',size:4});g.addPickup(prop.pos,'charge');}}
  g.events.push({type:'burst',pos:pos.clone(),element:e,size:radius*.7});
 }
 update(g:Game,dt:number){
  for(const t of [...g.targets(),g.player]){t.hurt=Math.max(0,t.hurt-dt);t.frozen=Math.max(0,t.frozen-dt);t.stagger=Math.max(0,t.stagger-dt);for(const e of Object.keys(t.status) as Element[]){t.status[e]=Math.max(0,t.status[e]!-dt);if(t.status[e]!<=0)delete t.status[e];}if(!t.dead){if(t.status.fire)t.hp=Math.max(1,t.hp-6*dt);if(t.status.toxic)t.hp=Math.max(1,t.hp-9*dt);}}
  for(let i=0;i<2;i++){g.player.primary[i]=Math.max(0,g.player.primary[i]-dt);g.player.secondary[i]=Math.max(0,g.player.secondary[i]-dt);}
  for(const p of g.projectiles){p.life-=dt;p.prev.copy(p.pos);p.vel.y-=SPELLS[p.element].gravity*dt;p.pos.addScaledVector(p.vel,dt);
   let hit=false;
   for(const z of g.zones){if(z.life<=0||p.pos.distanceTo(z.pos)>z.radius+1)continue;
    if(z.element==='wind'&&p.owner!==z.owner){p.vel.multiplyScalar(-1);p.owner=z.owner;p.pos.addScaledVector(p.vel,dt);g.events.push({type:'combo',text:'DEFLECTED',element:'wind'});}
    if(z.owner==='player'&&p.owner==='player'&&['fire','frost','stone','wind','toxic','lightning'].includes(z.element)&&z.element!==p.element){const rule=this.interactions.resolve(p.element,z.element as Element);if(rule){z.life=0;this.comboCount++;g.events.push({type:'combo',text:rule.name,pos:z.pos.clone(),element:p.element,size:5});this.explode(g,z.pos,z.radius+3,95*rule.multiplier,p.element,'player');if(rule.zone)this.zone(g,z.pos,rule.zone,z.radius,6,'player');hit=true;break;}}
   }
   for(const t of p.owner==='player'?g.targets():[g.player]){if(t.dead||p.hit.has(t.id))continue;const center=t.pos.clone().add(V(0,t.id===1?g.bossHeight*.43:0,0));if(segmentDistance(p.prev,p.pos,center)<t.radius+p.radius){p.hit.add(t.id);this.damage(g,t,p.damage,p.element,p.pos);if(p.element==='lightning'){let n=1+2*(g.mods.chain||0);for(const other of g.targets())if(other.id!==t.id&&other.pos.distanceTo(t.pos)<13&&n-->0)this.damage(g,other,p.damage*.65,'lightning');}if(!(p.element==='frost'&&g.mods.pierce&&p.owner==='player'))hit=true;}}
   const travel=p.pos.clone().sub(p.prev),len=travel.length();const worldHit=len>0?g.physics.ray(p.prev,travel.normalize(),len):null;
   if(worldHit){const prop=g.props.find(o=>g.physics.propColliders.get(o.id)?.handle===worldHit.collider.handle);if(prop){prop.hp-=p.damage;if(prop.hp<=0){g.physics.removeProp(prop.id);g.addPickup(prop.pos,'charge');}}hit=true;}
   if(hit){if(p.heavy||SPELLS[p.element].splash>2)this.explode(g,p.pos,SPELLS[p.element].splash,p.damage*.35,p.element,p.owner);if(p.heavy||p.element==='toxic')this.zone(g,p.pos,p.element,p.heavy?4:2.2,p.heavy?6:3,p.owner);if(p.element==='stone'&&g.mods.fragment&&p.owner==='player')this.explode(g,p.pos,5,40,'stone','player');p.life=0;}
  }
  // Opposed projectiles can intercept each other; wind redirects instead of deleting.
  for(let i=0;i<g.projectiles.length;i++){const a=g.projectiles[i];if(a.owner!=='player'||a.life<=0)continue;for(let j=0;j<g.projectiles.length;j++){const b=g.projectiles[j];if(b.owner!=='enemy'||b.life<=0)continue;if(segmentDistance(a.prev,a.pos,b.pos)<a.radius+b.radius+.3){if(a.element==='wind'){b.owner='player';b.vel.multiplyScalar(-1);}else{a.life=0;b.life=0;g.events.push({type:'burst',pos:b.pos.clone(),element:a.element,size:2});}break;}}}
  g.projectiles=g.projectiles.filter(p=>p.life>0);
  for(const z of g.zones){z.life-=dt;z.pos.addScaledVector(z.vel,dt);z.tick-=dt;if(z.tick<=0){z.tick=.5;const e:Element=z.element==='lava'||z.element==='firestorm'?'fire':z.element==='poisonstorm'?'toxic':z.element==='steam'?'frost':z.element;for(const t of z.owner==='player'?g.targets():[g.player]){const dy=Math.abs(t.pos.y-z.pos.y);if(Math.hypot(t.pos.x-z.pos.x,t.pos.z-z.pos.z)<z.radius+t.radius&&dy<(z.element.includes('storm')||z.element==='wind'?15:5)){this.damage(g,t,z.element==='steam'?3:z.element==='wind'?10:15,e);if(e==='wind')t.vel.y+=5;}}}}
  g.zones=g.zones.filter(z=>z.life>0);
 }
}
