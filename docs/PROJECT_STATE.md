# Riftborne project state

Updated: 2026-11-07

## Current development slice — graphics quality uplift (verified release)

- Graphics commit `dc26c744d7c0dd1ca64fe3336209508d151fdb48` is published. Vercel deployment `dpl_2pz1GDPirj72UVivDYmXJXQQQxEP` is READY; the public alias and new JavaScript bundle returned HTTP 200. Local natural-input smoke passed in performance mode; high-quality graphics were inspected in a staged 800x450 capture. Full campaign, other realms, AO toggle interaction and real GPU performance remain unverified.
- User specifically requests an AAA-aspiring graphics uplift and explicitly directs the team to use Blender. This is a production goal, not a claim that the game or this slice meets AAA quality. Working direction is to raise fidelity within the current stylized high-fantasy identity; photorealism or a replacement art direction has not been requested.
- Baseline: the README describes a playable alpha. Five realms have distinct terrain/ruin arrangements but share the central combat floor, ground texture and sky panorama. Player and boss meshes are Blender-remodeled derivatives of licensed source models. Generated art includes the sky, element icons, character material atlases and spell effects; see `ASSETS.md` and `art/PROMPTS.md` for provenance.
- `art/arena-stone-premium-source.png` is an original image-generation source; its exact prompt is in `art/PROMPTS.md`, and its resolved model identifier was not exposed. `art/bake-arena-stone.py` uses Blender 5.2.3 Cycles to edge-blend shifted source samples and derive 1024px albedo, tangent normal and luminance-estimated roughness maps. `scripts/package-arena-stone.mjs` outputs WebP maps; normal/roughness are lossless. Seams are reduced but remain (reported edge/adjacent-pixel ratios about 1.1–1.3), and the pattern repeats. Do not call this material seamless or visually accepted.
- `art/build-sky-sanctuary.py` authors `art/sky-sanctuary.blend` and `public/assets/sky-sanctuary.glb` from 12 licensed KayKit CC0 modules and four Blender-sculpted cliff forms. `src/world.ts` places two distant instances as render-only scenery; they have no collider and do not provide cover. Existing character rigs and source assets remain in use.
- The released source changes load the new stone maps into the Three.js asset library and assign them to the arena floor and finished stone modules. `ContactOcclusionPass` adds half-resolution GTAO/contact shadows and hides translucent/sprite content during that pass. The `Contact shadows` preference defaults on and is persisted; performance mode bypasses post-processing and therefore skips contact AO.
- The sky GLB is reported at 5.92 MiB with one primitive and 9,622 triangles; the Blender source is 5.89 MiB and saves the joined composition as one mesh. The GLB embeds three PNG maps in addition to the separately loaded shared WebPs; investigate removing this duplication if it is not needed by the runtime export.
- A staged 800x450 screenshot at `output/graphics-qa/arena-staged-ao-on-800x450.png` was inspected by the primary agent. The new GLB and all three maps loaded, high-quality mode rendered GTAO and bloom, and there were no page, shader or request errors. The staged sample reported 190 composed draw calls, 337,420 triangles and a smoothed 28.95 ms frame interval; these are one software-rendered host sample, not a hardware benchmark. Natural input and settings-mode QA is still in progress.
- TypeScript, production build and 28 full-suite tests passed; focused AO preference tests passed 2/2. The staged high-mode screenshot passed map/GLB load and no-error checks. Natural-input performance-mode smoke passed at 800x450: movement z=16→11.58, jump y=1.99, dual-cast damage 24.57, pause, loadout, settings and modal Tab wrap, with no page errors or bad requests. The AO toggle was not separately browser-tested, and no 1280 screenshot was reviewed.
- This is local release evidence, not full visual acceptance. Human art sign-off, other-realm visual review, representative hardware performance, GitHub push and Vercel deployment remain pending.
- Blender 5.2.3 headless is reported working. The initial injected bake invocation failed when the script assumed `__file__`; the script now reads injected arguments. The first sanctuary pass failed because no preview world existed; the builder now creates one. Do not repeat either approach.
- No dedicated `design/` directory or art bible/AAA visual acceptance standard is present. The project plan is `production/graphics-quality-plan.md`. Keep source images, Blender files, baked maps and runtime exports distinct and add provenance before release.
- Existing performance mode caps DPR at 1 and disables shadows, bloom and extra zone layers; it now also bypasses the contact-occlusion composer. Prior software-rendered frame samples are not a hardware GPU baseline. The target hardware and quality/performance budgets are still undefined.
- Current repository checkpoint before graphics publication is `master` at `e48dd3ed700203365c0f8cebf3c0ff782781a2d9`. Source, tests, provenance and generated assets are ready in the working tree for the authorized commit; no graphics deployment has been verified. The earlier release's completion status does not apply to this graphics slice.

## Current development slice — clarity and control

- User requested AAA quality via Codex Game Studio plus GitHub/Vercel deployment. This release is a bounded quality increment, not a claim that the game now meets full AAA production scope.
- `production/polish-plan.md` records sequential studio discipline responsibilities and acceptance gates. The source CGS checkout is the Postmarked/template workspace; Riftborne remains at `D:/Codex/2026-11-06/riftborne`. Do not initialize it as Godot/Unity/Unreal: its actual engine is Three.js/Rapier.
- `src/preferences.ts` validates legacy/persisted settings and honors OS reduced-motion preference by default. `src/ui-polish.ts` owns settings, action-based hints, hit flash timing and the boss attack countdown; `src/ui.ts` retains campaign/menu state.
- `src/combat.ts` now emits one positional hit event per successful enemy damage application, including core-strike labeling. Damage values and rules are unchanged. `src/audio.ts` throttles the new impact confirmation tone to avoid stacked voices.
- `src/render.ts` performance mode caps DPR at 1 and disables shadows, bloom and extra zone layers. Reduced motion suppresses camera shake/dash zoom. Dead sentinel actors dispose private material and animation resources without disposing shared asset geometry/textures.
- `src/polish.css` improves HUD readability and short-window layout while keeping the existing game's gold/teal style. Existing finished assets are reused; no new art was generated in this slice.
- Menu Tab now cycles focus instead of resuming gameplay; accumulated mouse deltas clear on release/resume. Title-screen keyboard navigation remains available.
- Regression tests: 28 passing, including input, preferences and normal/core/invulnerable hit cases. TypeScript and the Vite production build pass; existing large-chunk and Rapier initialization deprecation warnings remain.
- Immutable production-preview browser gate passed at 800x450: zero page errors or failed requests; settings survived reload; modal Tab focus wrapped; movement, jump, lock-on, dual-cast damage (24.57), pause, and loadout selection passed. Player position changed from z=16 to z=10.78 and jump reached y=3.36. Desktop and small-viewport screenshots were inspected; settings scroll within the panel. These software-rendered host frame timings are not representative hardware-GPU benchmarks, and audio quality was not human-reviewed.
- Commit `74b3f404ab7c626810a9598c22e1482022f7ec05` is pushed to `remriel/riftborne` `master`. Vercel deployment `dpl_BaLi9RLzBT1Zk8vpsvF3he1iAyHV` reached READY for that commit, assigned `https://riftborne-gamma.vercel.app/`, and reported no alias error. The public page returned HTTPS 200 and referenced the expected built bundle `index-tlMGQVL5.js`.
- Live browser smoke passed at the public alias (800x450): settings persistence, modal Tab wrapping, movement, jumping, lock-on, dual casting (24.57 damage), pause and loadout selection; zero page errors or bad HTTP responses. Vercel's runtime error/fatal log view was empty for the prior 30 minutes; that server-side check does not replace browser coverage.
- Failed verification approach: editing Vite-served source during browser automation triggers hot reload and destroys the active modal. Run release QA on an immutable preview build.

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
- When running the Blender bake through an injected Python session, do not assume `__file__` is available; the script now accepts injected `args`. The first sanctuary preview also failed without a scene world; the builder now creates one.

## RESUME HERE

Graphics release `dc26c744` is live on Vercel. Next test contact-shadow toggle behavior, review all five realms at 1280px and profile real GPUs; investigate duplicated GLB textures. The larger AAA-quality goal still needs bespoke characters, animation, art direction and human acceptance. See `docs/PROGRESS.md`.
