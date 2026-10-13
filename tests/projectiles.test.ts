import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../src/game.ts';
import {V} from '../src/core.ts';
import type {Element} from '../src/config.ts';

async function arena(run: (g: Game) => void) {
  const g = new Game();
  await g.init();
  g.physics.reset();
  g.props = []; g.pickups = []; g.bossActive = false;
  try { run(g); } finally { g.physics.world.free(); }
}
function enemy(g: Game, x: number) {
  g.spawnEnemy(V(x, 1, 0), 0);
  return g.enemies.at(-1)!;
}
function shot(g: Game, element: Element = 'frost', owner: 'player' | 'enemy' = 'player') {
  const p = g.combat.shoot(g, V(0, 1, 0), V(1, 0, 0), element, owner)!;
  p.vel.set(600, 0, 0);
  return p;
}
function step(g: Game) { g.physics.world.step(); g.combat.update(g, 1 / 60); }

test('a non-piercing bolt hits the nearest target regardless of target array order', async () => arena(g => {
  const far = enemy(g, 8), near = enemy(g, 4), p = shot(g);
  step(g);
  assert.ok(near.hp < near.maxHp);
  assert.equal(far.hp, far.maxHp);
  assert.ok(Math.abs(p.pos.x - 2.7) < .001, 'impact is at the target surface');
}));

test('terrain blocks direct damage to a target crossed later in the same step', async () => arena(g => {
  const target = enemy(g, 8);
  g.physics.box(V(4, 2, 0), V(1, 4, 4));
  const p = shot(g); step(g);
  assert.equal(target.hp, target.maxHp);
  assert.ok(Math.abs(p.pos.x - 3.5) < .001);
}));

test('Winter Needle pierces enemies but stops at terrain', async () => arena(g => {
  g.mods.pierce = 1;
  const near = enemy(g, 3), far = enemy(g, 9);
  g.physics.box(V(6, 2, 0), V(1, 4, 4));
  const p = shot(g); step(g);
  assert.ok(near.hp < near.maxHp);
  assert.equal(far.hp, far.maxHp);
  assert.equal(p.life, 0);
  assert.ok(Math.abs(p.pos.x - 5.5) < .001);
}));

test('a destroyed prop stops the breaking shot and clears the path for the next bolt', async () => arena(g => {
  const target = enemy(g, 8);
  const prop = {id: g.nextId++, pos: V(4, 0, 0), hp: 10, type: 'barrel' as const, radius: .75};
  g.props.push(prop); g.physics.addProp(prop.id, prop.pos, prop.radius, 3);
  shot(g); step(g);
  assert.equal(target.hp, target.maxHp);
  assert.equal(g.physics.propColliders.has(prop.id), false);
  assert.equal(g.pickups.length, 1);
  shot(g); step(g);
  assert.ok(target.hp < target.maxHp);
  assert.equal(g.pickups.length, 1);
}));

test('a projectile cannot react with a spell zone beyond terrain', async () => arena(g => {
  g.physics.box(V(4, 2, 0), V(1, 4, 4));
  const zone = g.combat.zone(g, V(8, 1, 0), 'toxic', 1, 5, 'player');
  shot(g, 'fire'); step(g);
  assert.equal(g.combat.comboCount, 0);
  assert.ok(zone.life > 0);
}));

test('expired projectiles and zones do not deal a final ghost hit', async () => arena(g => {
  const target = enemy(g, 5), p = shot(g);
  p.life = 0;
  g.combat.zone(g, target.pos, 'toxic', 3, 0, 'player');
  step(g);
  assert.equal(target.hp, target.maxHp);
  assert.equal(g.projectiles.length, 0);
  assert.equal(g.zones.length, 0);
}));

test('enemy lightning does not chain damage into the enemy team', async () => arena(g => {
  const target = enemy(g, 6);
  g.player.pos.set(4, 1, 0); g.player.invulnerable = 0;
  shot(g, 'lightning', 'enemy'); step(g);
  assert.ok(g.player.hp < g.player.maxHp);
  assert.equal(target.hp, target.maxHp);
}));

test('wind deflects a crossing projectile before it can hit the player', async () => arena(g => {
  g.player.pos.set(8, 1, 0); g.player.invulnerable = 0;
  g.combat.zone(g, V(3, 1, 0), 'wind', 1, 5, 'player');
  const p = shot(g, 'frost', 'enemy'); step(g);
  assert.equal(g.player.hp, g.player.maxHp);
  assert.equal(p.owner, 'player');
  assert.equal(p.vel.x, -600);
  assert.ok(Math.abs(p.pos.x - 1) < .001);
  assert.ok(p.life > 0);
}));

test('piercing frost can hit multiple unobstructed targets once each', async () => arena(g => {
  g.mods.pierce = 1;
  const far = enemy(g, 8), near = enemy(g, 4), p = shot(g);
  step(g);
  assert.equal(near.hp, 82); assert.equal(far.hp, 82);
  assert.equal(p.pos.x, 10); assert.ok(p.life > 0);
  p.vel.x = -600; step(g);
  assert.equal(near.hp, 82); assert.equal(far.hp, 82);
}));

test('a zone reaction consumes the bolt without a second direct hit or expired-zone tick', async () => arena(g => {
  const target = enemy(g, 5); target.hp = target.maxHp = 1000;
  g.combat.zone(g, V(3, 1, 0), 'toxic', 1, 5, 'player');
  shot(g); step(g);
  assert.equal(g.combat.comboCount, 1);
  assert.equal(target.hp, 1000 - 95 * 1.55);
  assert.equal(g.projectiles.length, 0);
  assert.equal(g.zones.length, 0);
}));

test('terrain also blocks enemy bolts headed toward the player', async () => arena(g => {
  g.player.pos.set(8, 1, 0); g.player.invulnerable = 0;
  g.physics.box(V(4, 2, 0), V(1, 4, 4));
  shot(g, 'frost', 'enemy'); step(g);
  assert.equal(g.player.hp, g.player.maxHp);
}));
