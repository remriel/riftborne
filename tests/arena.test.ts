import {test} from 'node:test';
import assert from 'node:assert/strict';
import {ARENAS} from '../src/arena.ts';
import {ArenaPhysics} from '../src/physics.ts';
import {Game} from '../src/game.ts';

test('every realm builds its own traversable topology without blocking the duel corridor', async () => {
  const physics = new ArenaPhysics();
  await physics.init();
  const footprints = new Set<string>();
  try {
    for (const [index, arena] of ARENAS.entries()) {
      physics.reset(index);
      assert.equal(physics.platforms.length, arena.platforms.length + 1);
      assert.equal(physics.floor(0, 16), 0, `player spawn in realm ${index}`);
      assert.equal(physics.floor(0, -13), 0, `boss spawn in realm ${index}`);
      for (const [x, z, width, depth, top] of arena.platforms) {
        assert.ok(Math.abs(x) + width / 2 <= 48 && Math.abs(z) + depth / 2 <= 48,
          `platform outside ground in realm ${index}`);
        assert.equal(physics.floor(x, z), top, `platform top in realm ${index}`);
      }
      footprints.add(physics.platforms.slice(1).map(p =>
        `${p.pos.x},${p.pos.z},${p.size.x},${p.size.z},${p.pos.y + p.size.y / 2}`).join('|'));
    }
    assert.equal(footprints.size, ARENAS.length, 'realms must have distinct collision layouts');
  } finally {
    physics.world.free();
  }
});

test('later-realm waves leave room to enter and clear the previous hit flash', async () => {
  const game = new Game();
  await game.init();
  try {
    for (let index = 1; index < ARENAS.length; index++) {
      game.player.hurt = 1;
      game.loadBiome(index);
      assert.equal(game.player.hurt, 0);
      assert.equal(game.enemies.length, 6);
      for (const enemy of game.enemies)
        assert.ok(enemy.pos.distanceTo(game.player.pos) > 8,
          `enemy ${enemy.id} crowds the entrance in realm ${index}`);
    }
  } finally {
    game.physics.world.free();
  }
});
