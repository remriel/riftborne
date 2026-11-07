import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../src/game.ts';
import {V} from '../src/core.ts';

async function arena(run: (g: Game) => void) {
  const g = new Game();
  await g.init();
  g.physics.reset();
  g.props = []; g.pickups = []; g.bossActive = false;
  try { run(g); } finally { g.physics.world.free(); }
}

function enemy(g: Game, x: number, z = 0) {
  g.spawnEnemy(V(x, 1, z), 0);
  return g.enemies.at(-1)!;
}

test('player explosions reach visible enemies but not enemies behind terrain', async () => arena(g => {
  const open = enemy(g, 2, 2), hidden = enemy(g, 7);
  g.physics.box(V(4, 2, 0), V(1, 4, 4));
  g.physics.world.step();
  g.combat.explode(g, V(0, 1, 0), 10, 30, 'fire', 'player');
  assert.ok(open.hp < open.maxHp);
  assert.equal(hidden.hp, hidden.maxHp);
}));

test('terrain protects the player from enemy explosions', async () => arena(g => {
  g.player.pos.set(7, 1, 0); g.player.invulnerable = 0;
  g.physics.box(V(4, 2, 0), V(1, 4, 4));
  g.physics.world.step();
  g.combat.explode(g, V(0, 1, 0), 10, 30, 'fire', 'enemy');
  assert.equal(g.player.hp, g.player.maxHp);
}));

test('an impact on a wall splashes its exposed side but not the far side', async () => arena(g => {
  const open = enemy(g, 2, 2.2), hidden = enemy(g, 5);
  g.physics.box(V(4, 2, 0), V(1, 4, 4));
  const projectile = g.combat.shoot(g, V(0, 1, 0), V(1, 0, 0), 'fire', 'player')!;
  projectile.vel.set(600, 0, 0);
  g.physics.world.step();
  g.combat.update(g, 1 / 60);
  assert.ok(Math.abs(projectile.pos.x - 3.5) < .001);
  assert.ok(open.hp < open.maxHp, 'the wall face must not block the exposed side');
  assert.equal(hidden.hp, hidden.maxHp);
}));

test('ground-level blasts can reach a visible target above the floor', async () => arena(g => {
  const target = enemy(g, 2);
  g.physics.world.step();
  g.combat.explode(g, V(0, 0, 0), 5, 30, 'fire', 'player');
  assert.ok(target.hp < target.maxHp);
}));

test('a blast can damage a visible prop without its own collider shielding it', async () => arena(g => {
  const prop = {id: g.nextId++, pos: V(3, 0, 0), hp: 100, type: 'barrel' as const, radius: .75};
  g.props.push(prop); g.physics.addProp(prop.id, prop.pos, prop.radius, 2);
  g.physics.world.step();
  g.combat.explode(g, V(0, 1, 0), 10, 30, 'fire', 'player');
  assert.equal(prop.hp, 70);
}));

test('a prop destroyed by a blast still shields targets and props for that same blast', async () => arena(g => {
  const front = {id: g.nextId++, pos: V(3, 0, 0), hp: 10, type: 'barrel' as const, radius: .75};
  const rear = {id: g.nextId++, pos: V(7, 0, 0), hp: 100, type: 'barrel' as const, radius: .75};
  const hidden = enemy(g, 9);
  // Reverse order ensures the outcome does not depend on array order.
  g.props.push(rear, front);
  for (const prop of g.props) g.physics.addProp(prop.id, prop.pos, prop.radius, 2);
  g.physics.world.step();
  g.combat.explode(g, V(0, 1, 0), 12, 30, 'fire', 'player');
  assert.ok(front.hp <= 0);
  assert.equal(rear.hp, 100);
  assert.equal(hidden.hp, hidden.maxHp);
  assert.equal(g.physics.propColliders.has(front.id), false);
  assert.equal(g.pickups.length, 1);
}));

test('a projectile that destroys cover cannot splash through it until the next shot', async () => arena(g => {
  const prop = {id: g.nextId++, pos: V(4, 0, 0), hp: 10, type: 'barrel' as const, radius: .75};
  const hidden = enemy(g, 6);
  g.props.push(prop); g.physics.addProp(prop.id, prop.pos, prop.radius, 2);
  g.mods.fragment = 1;
  const fireStone = () => {
    const projectile = g.combat.shoot(g, V(0, 1, 0), V(1, 0, 0), 'stone', 'player')!;
    projectile.vel.set(600, 0, 0);
    g.physics.world.step();
    g.combat.update(g, 1 / 60);
  };
  fireStone();
  assert.equal(hidden.hp, hidden.maxHp);
  assert.equal(g.physics.propColliders.has(prop.id), false);
  assert.equal(g.pickups.length, 1);
  fireStone();
  assert.ok(hidden.hp < hidden.maxHp);
}));
