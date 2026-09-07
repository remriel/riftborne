# Riftborne

A playable desktop-browser alpha of an original single-player elemental arena game.

## Play

Double-click **Launch Riftborne.cmd** on Windows, or run `npm install` and `npm run dev` with Node.js 22+. Open the printed local address. Choose **Enter the Rift** to immediately challenge the Pyre Titan.

## Controls

| Input | Action |
|---|---|
| WASD / mouse | Move / aim |
| Shift | Sprint |
| Space / Space again | Jump / double jump |
| Hold Space airborne | Levitate/glide |
| C or Alt | Ground/air dodge |
| Ctrl | Slide |
| Left / right mouse | Left / right primary spell |
| Q / E | Left / right secondary |
| F | Overdrive at 100% charge |
| R | Equipped movement rune |
| 1 / 2 | Cycle left / right gauntlet |
| Tab | Choose gauntlets and rune |
| L | Boss lock-on |
| Escape | Pause/settings |

## Included

- Six distinct elemental primaries and secondaries, dual casting, status effects, 15 pairwise damage reactions, several transformed world zones.
- Five staged bosses with attack telegraphs, phase progression, exposed weak points, and different attack sets.
- Five palette variants of the floating ruin arena, enemy encounters between bosses, pickups, random upgrade choices, five movement runes.
- Physical projectile collision/interception, wind deflection, breakable props, airborne traversal, falling recovery, health/energy/cooldown HUD.
- Death/restart, campaign victory, settings and best-progress persistence.
- Original generated backdrop and spell icon atlas; licensed animated models. See ASSETS.md.

## Scope and limitations

This is a **playable alpha**, not a production-complete implementation of every item in the supplied design brief. The five biomes reuse arena geometry. Boss silhouettes use licensed fantasy creatures rather than bespoke commissioned models; the Pyre Titan currently uses a horned demon model. Stone zones do not yet create physical walls. Ice has status/zone effects but no dedicated water-freezing simulation. The Archon has phase-dependent dual elements and mobility but no sophisticated learned counterplay. Armor is a damage pool, not individually destructible mesh pieces. Full 30–60 minute pacing and every boss's natural difficulty remain unvalidated. Audio is simple original synthesis. Desktop keyboard and mouse only.

## Architecture and verification

`src/game.ts` owns run state; `player.ts` movement; `physics.ts` Rapier collision; `combat.ts` spells/damage/zones; `interactions.ts` reaction registry; `boss.ts` boss state machine; `world.ts` terrain; `render.ts` render adapter; `assets.ts` GLTF animation; `ui.ts` DOM HUD; `audio.ts` sound.

Build: `npm run build`. Serve production build: `npm run preview`.

See `docs/PLAYTEST.md` for verified behavior and `docs/CURRENT_TASK.md` for continuation notes. Production exposes a read-only `window.riftborne.snapshot()` diagnostic. The `?qa` URL exposes simulation controls for local testing.
