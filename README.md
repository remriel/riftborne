# Riftborne

A playable desktop-browser alpha of an original single-player elemental arena game based on Spellbreak.

## Play

Play on [Vercel](https://riftborne-gamma.vercel.app/) or [GitHub Pages](https://remriel.github.io/riftborne/). For offline Windows play, download the latest GitHub release ZIP and double-click **Launch Riftborne.cmd** with Node.js 22+ installed. From a checkout, run `npm ci` and `npm run dev`. Choose **Enter the Rift** to immediately challenge the Pyre Titan.

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
- Five floating ruin arenas with distinct traversal platforms and ruin arrangements, enemy encounters between bosses, pickups, random upgrade choices, five movement runes.
- Physical projectile collision/interception, wind deflection, breakable props, airborne traversal, falling recovery, health/energy/cooldown HUD.
- Death/restart, campaign victory, settings and best-progress persistence.
- Original generated backdrop and spell icon atlas; licensed animated models. See ASSETS.md.

## Scope and limitations

This is a **playable alpha**, not a production-complete implementation of every item in the supplied design brief. The five biomes have distinct platform and ruin layouts but share the central combat floor, ground texture, and sky panorama. Boss and playable character meshes are Blender-remodeled derivatives of licensed fantasy models, with original rigs and animation clips retained. They are not wholly new commissioned models. Decorative ruins do not have physical wall collisions. Stone spell zones do not yet create physical walls. Ice has status/zone effects but no dedicated water-freezing simulation. The Archon has phase-dependent dual elements and mobility but no sophisticated learned counterplay. Armor is a damage pool, not individually destructible mesh pieces. Full 30–60 minute pacing and every boss's natural difficulty remain unvalidated. Audio is simple original synthesis. Desktop keyboard and mouse only.

## Architecture and verification

`src/game.ts` owns run state; `player.ts` movement; `arena.ts` shared realm layouts; `physics.ts` Rapier collision; `combat.ts` spells/damage/zones; `interactions.ts` reaction registry; `boss.ts` boss state machine; `world.ts` terrain; `render.ts` render adapter; `assets.ts` GLTF animation; `ui.ts` DOM HUD; `audio.ts` sound.

Tests: `npm test`. Build: `npm run build`. Serve production build: `npm run preview`.

See `docs/PLAYTEST.md` for verified behavior and `docs/CURRENT_TASK.md` for continuation notes. Production exposes a read-only `window.riftborne.snapshot()` diagnostic. The `?qa` URL exposes simulation controls for local testing.

## Reforged graphics update
The player and all five bosses now load separate remodeled GLBs: hood/cowl and enlarged gauntlets, basalt Titan armor, wider Wyrm wings, crystal Colossus armor, elongated Oracle, and a distinct gold-armored Archon. Blender source files and reproducible asset scripts are in art/ and scripts/. Download the GitHub release ZIP, extract it, and run Launch Riftborne.cmd with Node.js 22+ installed. No npm install is needed for the release build.

## Realm layouts update · v0.2.0

The Gardens keep a broken crescent of terraces. Cinderwatch has opposed battlements and gates, the Glass Peaks rise in a staggered diagonal, the Hollow Marsh has low scattered islets, and the Aether Citadel has mirrored plazas and balconies. Later-realm enemy waves now begin farther from the entry point, and the player hit flash clears on transition. The Pages build also uses relative asset URLs so it works at the repository's project path.

