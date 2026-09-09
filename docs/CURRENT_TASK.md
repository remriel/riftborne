# Current task — Riftborne
Objective: Single-player third-person elemental arena game from the attached brief. User requested finish-up during implementation.
State: Playable alpha complete for this delivery; full design-brief production scope is NOT complete. See README scope limitations.
Completed: Vite/TypeScript/Three.js/Rapier; six elements and 15 pairwise reactions; five boss states and campaign transitions; dual-cast, levitation/dodge/runes; pickups/upgrades; generated sky/icons, licensed animated GLBs; UI/settings/death/restart/victory; Windows launcher.
Architecture: simulation state separate from render objects; fixed 60 Hz update; Rapier kinematic controller; segment-swept projectiles; data-driven reaction registry and bosses. GLTF animation mixers and static geometry batching.
Verification: TypeScript/build passed initially; browser simulation checks passed movement, Fire/Frost impact/reaction, six secondaries, phase 2/3 hazards, upgrades, later boss activation, campaign victory, death/restart. Screenshot reviewed. First-arena interval about 16.7 ms. Final TypeScript/production build passed; two core unit tests passed. Final title reload has zero browser errors. Private GitHub repository created at https://github.com/remriel/riftborne.
Discoveries/fixes: Initial camera clipped raised platform and central prop; spawn moved to z16 and prop offset. Flying golem asset unsuitable for Titan, replaced with horned Demon CC0 model. Favicon 404 fixed.
Do not repeat: Do not claim five naturally playtested wins from accelerated simulation checks. Do not describe five palette variants as unique authored biomes.
Unresolved: 30–60 minute pacing and full natural boss difficulty; bespoke Titan/other art; physical stone cover; independent armor meshes; detailed water/surface physics; refined Archon counterplay; full audio/art polish. README documents limitations.
Next: If requested to continue, inspect git/tests; play first duel with real controls for a complete natural win, tune aiming/camera and damage. Then make each biome layout unique and finish detailed boss/environment mechanics.


## Graphics update — 2026-09-08
Objective: Connect Blender to Codex and improve game graphics.
Verified: Existing Blender MCP config works after launching Blender 5.2 with blender_mcp_bridge; scene query succeeds. Clean checkout fast-forwarded to origin/master 4606729.
In progress: Generated stone texture saved in art/ruin-stone-source.png. Plan Blender-finished ruins, textured terrain, lighting polish, runtime verification, GitHub sync.


Scope correction: User explicitly prioritizes actual boss and playable character models. Environment pass is implemented but not committed. No Atlas/Fal/Meshy API keys found. Asked about 3D service vs remodeling existing rigs. Inspecting rigged characters through Blender; do not present environment-only update as completion.


Build-once-publish requested: finish character exports, restore animations, run the production build once, then push and publish GitHub release. Skip further browser/tests/reviews. No Pages destination configured; release ZIP will include compiled game and local Node launcher. Manual acceptance is the user's next step.


Character implementation complete: mage/titan/wyrm/colossus/oracle/archon_reforged.glb integrated, separate Archon config, remodeled geometry and generated material atlas. Blender export succeeded for all six; animation packaging retained 76/14/8/14/8/76 clips respectively. Existing rigs retained; not new AI-generated meshes. Required final build and GitHub release next. No further playtests per user's build-once-publish instruction.


Final production build passed 2026-09-08. Nonblocking Vite bundle-size warning remains. Publishing as GitHub tag graphics-2026-09-08 with compiled ZIP and Node launcher. Manual acceptance testing intentionally deferred to user; earlier environment-only browser checks do not validate final remodeled characters.

## GPT Image 2.5 graphics refresh — 2026-09-09

Objective: Use the new OpenAI image generator to refresh production graphics. Official docs verified GPT Image 2.5 Sunburst is the most capable generation/editing model. Generated and packaged replacement sky panorama, six-element ability atlas, and six-character material atlas. Source files live in `art/`; runtime sky and element WebPs replaced. Next: rerun Blender character reforge with the new atlas, package animation clips, build, inspect the running result, then sync GitHub.

Completed: Blender rebaked the new character atlas into all six remodeled GLBs; `package-characters.mjs` restored 76/14/8/14/8/76 animation clips for mage/Titan/Wyrm/Colossus/Oracle/Archon. Production build passed. Browser screenshots verified the title panorama, Fire/Frost HUD icons, player surface, and Titan surface at `?qa`; zero browser errors, with the pre-existing Rapier initialization deprecation warning. Exact Image API selection was unavailable because `OPENAI_API_KEY` is absent and the built-in generator does not expose its resolved model snapshot; prompts and provenance record this accurately. Next: user acceptance playthrough; address only reported visual issues.

