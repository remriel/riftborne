# Riftborne project state

Updated: 2026-11-07

## Current development slice — blast cover

- Work started from `remriel/riftborne` `master` at `4b086da` on branch `codex/riftborne-splash-occlusion`. Vercel's existing project builds `master` for production; branch work must not be confused with a live release.
- `CombatSystem.explode` now checks visibility for player and enemy blast targets against Rapier terrain and props. `ArenaPhysics.blastVisible` samples the target center toward the blast and stops 0.02 world units short of its origin, so a wall impact can affect its exposed side without passing through the wall. A prop's own collider is excluded for its visibility query.
- Damage eligibility for all props is resolved before prop removal. Removal is deferred through all explosion components of one projectile impact, including stone fragments and zone reactions. Thus a prop can shield the same impact that destroys it; it is removed before the next projectile.
- Coverage is deliberately limited to `explode`: lingering zone ticks, frost's separate area freeze, lightning chains, and other attacks retain their previous rules. Decorative ruins still do not provide collision cover. Center sampling is a conservative approximation for partially exposed targets; it is not a full volume visibility test.
- Seven new `tests/splash.test.ts` cases cover both owners, direct wall impacts, floor-level blasts, destructible props, same-impact shielding, and later shots. Four of the initial six cases failed before implementation; the fragment follow-up also reproduced an intermediate defect before removal was deferred.
- Vite was updated from locked 7.3.6 to 7.3.7 to address the reported development-server advisories. The full npm audit now reports zero vulnerabilities.
- PR #2 merged as `efacd31`. Vercel production deployment `dpl_BFohh9CL2q7BqRis6MfqjhmmFmtV` reached READY, and the public site served the expected cover-aware bundle. Remote browser play remains unverified.

Release status: [v0.3.0 Radiant Magic](https://github.com/remriel/riftborne/releases/tag/v0.3.0) is published from commit `dd7187a7391b26eef2e1ad86fb1300a7df58e595`. The Windows ZIP is 22,319,009 bytes; SHA-256 `c5513fce64942a3767e210ee9646e7158bd7e60b20d4faffc2356615a1436d19` matches the GitHub release asset digest. All 60 packaged files were compared to the build, including the 15 magic textures.

Vercel status: the `riftborne` project in REMRIEL (`team_sS8RTjB1ldRc5jnptpOKb2XP`, project `prj_V6d3R1RJKuZxkT1eKXDVLcrGlHgc`) auto-deploys `master`. [Deployment `dpl_CWDQzfjykhuVonsqqLrqf7JwzsT3`](https://vercel.com/remriel/riftborne/CWDQzfjykhuVonsqqLrqf7JwzsT3) reached READY for the release commit and assigned the production aliases with no error. [The public site](https://riftborne-gamma.vercel.app/) loaded all 15 magic textures, entered the first duel, and cast fire/frost with zero browser errors. [Pages workflow 38431277415](https://github.com/remriel/riftborne/actions/runs/38431277415) also succeeded for that commit.

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

The cover-aware explosion slice is live on Vercel; read `docs/PROGRESS.md` for verification and publishing state. Next, validate partial cover and performance during actual play; examine lingering zones and other area attacks separately before describing cover as universal. Full human difficulty and campaign pacing remain unvalidated. The first duel previously took 13–23 seconds with automated dual casting, and reaction zones can overlap heavily; investigate those interactions before changing boss HP. Physical stone cover and later-boss playthroughs remain future work.
