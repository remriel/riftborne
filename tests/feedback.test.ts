import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../src/game.ts';
import {V,emptyInput} from '../src/core.ts';
import {createPlayer,PlayerController} from '../src/player.ts';
import type {ArenaPhysics} from '../src/physics.ts';

test('normal hits and core strikes each emit one accurate confirmation',()=>{
 const g=new Game();g.boss.armor=0;
 g.combat.damage(g,g.boss,10,'fire');
 let hits=g.events.filter(e=>e.type==='hit');assert.equal(hits.length,1);assert.equal(hits[0].value,10);assert.ok(hits[0].pos);assert.equal(hits[0].text,undefined);
 g.events=[];g.boss.weak=2;g.boss.status={};
 g.combat.damage(g,g.boss,10,'fire',g.boss.pos.clone().add(V(0,g.bossHeight*.5,0)));
 hits=g.events.filter(e=>e.type==='hit');assert.equal(hits.length,1);assert.equal(hits[0].value,17);assert.equal(hits[0].text,'CORE STRIKE');
});
test('invulnerability produces no damage flash or hit confirmation',()=>{
 const g=new Game();g.player.invulnerable=1;g.combat.damage(g,g.player,25,'fire');
 assert.equal(g.player.hp,160);assert.equal(g.events.length,0);
});
test('mouse sensitivity and inversion apply once and consume accumulated input',()=>{
 const controller=new PlayerController();controller.sensitivity=2;controller.invertY=true;
 const p=createPlayer(),input=emptyInput(),pitch=p.pitch;input.mouseX=10;input.mouseY=10;
 const physics={move:()=>({pos:p.pos.clone(),grounded:true})} as unknown as ArenaPhysics;
 controller.update(p,input,physics,1/60,{},[]);
 assert.ok(Math.abs(p.yaw+.044)<1e-8);assert.ok(Math.abs(p.pitch-(pitch-.036))<1e-8);
 assert.equal(input.mouseX,0);assert.equal(input.mouseY,0);
 controller.update(p,input,physics,1/60,{},[]);assert.ok(Math.abs(p.yaw+.044)<1e-8);
});
