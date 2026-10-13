# Riftborne project state

Updated: 2026-10-13

Release status: [v0.2.0](https://github.com/remriel/riftborne/releases/tag/v0.2.0) is published from commit `df9feb53a7a7f1cf235ccb758b682a5772af1654`. The [Pages build](https://remriel.github.io/riftborne/) booted into the first duel after the Pages workflow succeeded. The Windows ZIP is 20,120,728 bytes with SHA-256 `1b085dccf90bf4767ef868455eb6a3b90e16520f5941cda442913d95c778dc40`.

Vercel status: the existing `riftborne` project in the `REMRIEL` team (`team_sS8RTjB1ldRc5jnptpOKb2XP`, project `prj_V6d3R1RJKuZxkT1eKXDVLcrGlHgc`) is connected to `remriel/riftborne` and deploys the `master` branch to production. [Deployment `dpl_CWxNm7wybXK19HcPg1T51sxkPa7S`](https://vercel.com/remriel/riftborne/CWxNm7wybXK19HcPg1T51sxkPa7S) built commit `93a36a4f6021f243a34c2df2fa5acc0b4939c695` and reached `READY` with no alias error. Its [production domain](https://riftborne-gamma.vercel.app/) loaded the v0.2.0 game and entered the first duel with zero browser errors.

## Architecture and decisions

- Riftborne is a desktop browser game built with Vite, TypeScript, Three.js, and Rapier. `src/game.ts` owns the fixed-step simulation and campaign state. `src/render.ts` and `src/world.ts` adapt that state into the scene; the DOM in `src/ui.ts` owns menus and the HUD.
- `src/arena.ts` defines five realm layouts. `src/physics.ts` creates Rapier platform colliders from those layouts. `src/world.ts` uses the same platform state for visible ruin terraces and uses each layout's ruin and floating-fragment plan for scenery. This keeps walkable heights synchronized with visible platforms.
- The central player-to-boss lane stays open in every realm. Raised platforms sit around it, preserving the existing boss and player spawn coordinates, projectile paths, and first-duel camera view.
- Existing finished ruin GLBs are rearranged for the new realms. No new placeholder meshes or asset dependencies were introduced.
- GitHub Pages builds `dist` from `master` using `.github/workflows/pages.yml`. `vite.config.ts` emits relative asset URLs for the `/riftborne/` project path. `scripts/package-release.ps1` creates the Windows ZIP from `dist` and `release/`; the ZIP's launcher runs a Node-only HTTP server without npm dependencies.
- Vercel auto-detects this repository as Vite and serves its production build at the project root. The same relative asset URLs work there. The project is already linked to GitHub, so a push to `master` creates a new production deployment.

## Relevant code and dependencies

- `src/magic-vfx.ts` is the current VFX runtime; `src/vfx.ts` re-exports it. Generated textured cores, camera-facing curved trail ribbons, layered sigils, billboard wisps, and expanding impact blooms replace the prior analytic glow sprites and primitive rings. Shared maps are loaded by `AssetLibrary` and preserved during effect disposal.
- `art/MAGIC_PROMPTS.md` records the three built-in generation prompts and provenance. `scripts/process-magic-assets.mjs` packages 15 alpha-preserving WebP textures in `public/assets/magic/` from the source PNGs in `art/`.
- VFX resources are capped at 2,200 particles and 32 bursts. The quality setting hides some zone layers and disables bloom. `renderer.info.autoReset=false` plus an explicit reset before each composed frame makes diagnostic draw calls include all render passes.

- `CombatSystem.resolveProjectile` in `src/combat.ts` collects and sorts first contacts against targets, zones, and Rapier terrain. Terrain wins ties. Non-piercing bolts terminate at the first contact; frost with Winter Needle retains its per-target hit set until terrain terminates it.
- `segmentSphereTime` in `src/core.ts` supplies the segment entry fraction used for ordered target/zone hits. `tests/projectiles.test.ts` covers direct cover blocking, piercing, prop destruction, zone consumption, wind deflection, expiry, and enemy lightning ownership.

- `src/arena.ts`: realm platform and ruin placement data.
- `src/physics.ts`: Rapier world, character controller, platform colliders, and floor lookup.
- `src/world.ts`: ground mesh, finished ruin models, visible platform tops, and static geometry merging.
- `src/game.ts`: realm transitions, props, pickups, enemy waves, and boss progression.
- `src/render.ts`: camera, lighting, characters, world rebuilds, and postprocessing.
- `release/` and `scripts/package-release.ps1`: standalone Windows launcher and packaging workflow.
- `tests/arena.test.ts`: platform/topology integration check. `tests/combat.test.ts`: reaction and swept-hit checks.
- `public/assets`: shipping GLBs and WebP textures. `ASSETS.md` records provenance.

## Discoveries and constraints

- Magic visual QA uses staged `?qa` scenes for repeatable element inspection. Gameplay verification uses separate real keyboard/mouse events without health, boss, or simulation mutations. Keep that distinction in reports.
- A 100-burst stress check hit the configured 32-burst/2,200-particle caps and returned to 0 bursts, 0 particles, and the original 44 scene children after expiration.
- The first magic-effects duel sample reached 664 composed draw calls and about 31–34 ms frame intervals on this host. This is an observed browser sample, not a portable GPU benchmark or worst-case performance guarantee.
- Generated sigils have transparent centers. Ground zones and warning decals are raised above the visible tile surface; Rapier's floor is approximately .19 m below that surface on the central floor.

- Before this change all five realms had the same 8 outer and 4 inner raised platforms, the same ring of walls and pillars, and the same floating fragments; only palette and lighting varied.
- The first boss is at `(0, 0, -13)` and the player begins at `(0, 1.1, 16)`. Neither point should be covered by a raised platform.
- `ArenaPhysics.floor` uses axis-aligned platform extents. The visible terrace meshes are placed from that same platform list. Decorative wall and stair meshes remain scenery, as in prior releases.
- Runtime assets are large. Vite currently reports a nonblocking large-chunk warning. The release ZIP contains the built assets.
- The previous `docs/CURRENT_TASK.md` records accelerated campaign checks and graphics validation. It does **not** establish a complete natural five-boss playthrough.
- The prior Pages HTML emitted absolute `/assets/...` URLs. A project site at `/riftborne/` needs relative `./assets/...` URLs; the new build was verified under a real `/riftborne/` static directory mount. Vite's own preview server does not simulate this mount.
- `npm ci` on Windows can fail with `EPERM` while a Vite preview process holds Rollup's native module open. Stop the preview server before a clean reinstall.

## Known gaps and assumptions

- Full 30–60 minute pacing and natural boss difficulty remain unverified.
- Stone spell zones do not create physical cover. Decorative ruin walls are not collision geometry. Ice has no dedicated water-freezing simulation. Archon counterplay and sound still need polish.
- The five realms now have distinct traversal topology and scenery arrangement, while all retain the same central combat floor and broad square boundary.

## Failed approaches to avoid

- Do not describe accelerated boss defeat simulations as natural wins.
- Do not change render placement without updating collider placement for walkable terrain.
- Do not present remodeled licensed characters as wholly original commissioned meshes; see `ASSETS.md`.
- Do not treat an HTTP 200 from Vite preview at `/riftborne/assets/...` as asset success without checking content type: its HTML fallback can answer that path. The mounted static-server browser check validated the actual project path.

## RESUME HERE

The current v0.3.0 Radiant Magic pass combines the user's magic-visual request with the verified combat contact and lock-on fixes. All six generated element families are integrated and visually reviewed; a real-input duel reached the upgrade screen and entered the next realm with lock-on off. The 16 combat tests pass, and the VFX stress check demonstrates bounded cleanup. Finish the final package/build, push to GitHub, verify Vercel/Pages and publish v0.3.0. Then prioritize pacing and later-boss playthroughs. Splash damage occlusion, physical stone cover, and decorative wall colliders remain unresolved. See `docs/PROGRESS.md`.
