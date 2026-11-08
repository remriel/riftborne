# Riftborne — graphics quality uplift

Updated: 2026-11-07

## Objective and visual direction

Improve the game's graphics toward AAA quality, with Blender explicitly used for asset authoring and texture baking and Three.js used for in-game rendering. This is an aspirational quality target for a bounded production slice, not a claim that the game is or will become AAA through this change alone.

Working assumption: keep the established stylized high-fantasy identity and raise material, environment, lighting and presentation quality within it. The user has not requested photorealism or a replacement art direction. Do not introduce a different style without a visual review and direction decision.

## Baseline and current state

- The README describes Riftborne as a playable alpha. Five realm layouts have distinct terrain and ruin arrangements but share the central combat floor, ground texture and sky panorama.
- Player and boss meshes are Blender-remodeled derivatives of licensed source models; asset origins and licenses are recorded in `ASSETS.md`. Existing generated sources include the sky panorama, element/material atlases and spell-effect artwork.
- No dedicated `design/` directory, art bible or AAA graphics acceptance bar is present. Existing references and provenance live in `art/PROMPTS.md`, `art/MAGIC_PROMPTS.md`, `ASSETS.md` and historical notes in `docs/CURRENT_TASK.md`.
- `art/arena-stone-premium-source.png` is the source generated with the prompt in `art/PROMPTS.md`; the tool did not expose its model identifier. Blender 5.2.3 Cycles bakes 1024px albedo, tangent normal and luminance-estimated roughness maps. `scripts/package-arena-stone.mjs` emits the runtime WebPs; normal/roughness are lossless and albedo is quality 90. Edge seams remain (reported edge/adjacent-pixel ratios about 1.1–1.3), and the texture pattern repeats. Treat as an in-progress material, not a seamless or accepted final texture.
- `art/build-sky-sanctuary.py` produces editable `art/sky-sanctuary.blend` and `public/assets/sky-sanctuary.glb` from 12 licensed KayKit CC0 modules and four Blender-sculpted cliff forms. Runtime placement creates two distant render-only instances without collision or cover.
- Three.js now wires the maps to arena/finished stone surfaces and integrates a half-resolution GTAO contact-shadow pass. Transparent sprites/materials are hidden during that pass. A persisted Contact shadows setting defaults on; performance mode bypasses the composer and pass.
- Primary agent reports TypeScript, all 28 tests and production build pass. A staged 800x450 screenshot was inspected: the GLB and maps loaded, high-quality GTAO/bloom were enabled, and no page/shader/request errors appeared. Natural input/mode QA is underway; this single staged sample does not establish full visual acceptance, hardware performance, human art review or deployment.
- The staged sample reported 190 composed draw calls, 337,420 triangles and 28.95 ms smoothed frame time on the software-rendered host; do not use this as a hardware benchmark. The 5.92 MiB sanctuary GLB has one primitive and 9,622 triangles; its 5.89 MiB Blender source saves the sanctuary as one joined mesh. The GLB currently embeds three PNG maps that duplicate the separately loaded WebP maps; review this packaging before release.

## Production sequence

| Step | Work | Exit evidence |
| --- | --- | --- |
| 1. Confirm the visual bar | Describe target camera, stylized fantasy palette, material detail, silhouettes, realm variation, and the desired quality/performance settings. Preserve present style until a direction change is approved. | Short reference sheet or approved screenshot set with a clear review owner. |
| 2. Author materials in Blender | Use Blender 5.2.3 for UV/material inspection and the requested texture-bake workflow. Start with `art/arena-stone-premium-source.png`; separate source from baked/runtime files and record how outputs were made. | Baked files open in Blender, map to the intended UVs, tile acceptably, and show no unexpected seams, stretching or lost detail. |
| 3. Build environment quality | Apply approved material work to representative arena surfaces; improve lighting and dressing while preserving combat sightlines, navigation and the five realm identities. | In-engine captures show a cohesive improvement at gameplay distance and close range; no terrain/collider or readability regression. |
| 4. Integrate in Three.js | Bring approved outputs into the current renderer and maintain a default high-quality view plus a viable performance preset. Keep asset loading, color treatment, shadows, bloom and VFX coherent. | Production build boots with correct materials and no broken/missing assets; settings and main combat composition remain legible. |
| 5. Visual review | Compare the same camera and lighting before/after in every realm. Inspect ground scale/repetition, environment composition, player and boss silhouettes, lighting, spell effects and HUD contrast at actual gameplay resolution. | Screenshot set reviewed at target resolutions; actionable defects fixed; no unresolved visible tiling, texture, clipping or composition defects. |
| 6. Performance and release | Check memory, load time, draw/render cost and frame pacing on representative GPU hardware. Run build, tests and live browser smoke before synchronizing the graphics release. | Results recorded for both default and performance settings; GitHub commit and Vercel deployment point to the reviewed build. |

## Asset and quality constraints

- Do not use programmer art, primitive stand-ins, emoji, generic SVG illustrations or CSS-drawn characters as finished assets. Use a coherent production-ready asset set and Blender for the requested 3D/material work.
- Preserve licenses and provenance for remodeled KayKit/Quaternius assets. Do not describe remodeled source models as wholly original commissioned models.
- Keep source images, Blender working files, baked/intermediate maps and runtime assets organized distinctly. Update `ASSETS.md` with source, license, generation/processing notes and runtime paths before publishing.
- Material resolution, channels and texture compression must fit the target quality and performance budget. The current target GPU and acceptable download/memory budgets are not established yet.
- Existing performance mode caps DPR at 1 and disables shadows, bloom and extra zone layers. A prior software-rendered browser sample does not prove representative GPU performance.
- The current CGS template track supports Godot, Unity and Unreal only. Riftborne is Three.js/Rapier; do not run its initializer or validation as if it were a supported engine migration.

## Current status and next step

Progress is approximately 65% toward an integrated and verified graphics increment, not AAA completion. Material maps, the Blender sanctuary asset, renderer wiring and code checks are in place; one staged visual check passed. Natural input/mode QA, residual seam and repetition acceptance, cross-realm review, hardware performance, human art acceptance, asset-duplication decision and release remain open. Do not expand the staged screenshot pass into a full-quality claim.

## Failed approaches and current limitations

- The first headless bake invocation failed when the injected Python session did not provide `__file__`; the script now accepts injected `args`. Use that path or the documented `blender -b --python ... -- <output-directory>` invocation.
- The first sanctuary preview failed because no World was assigned; the builder now creates a preview world.
- The edge blend reduces but does not eliminate seams and does not remove the repeated pattern. Resolve or explicitly accept this after visual review.
- No target GPU, frame-time, memory or asset-size budget has been agreed. The software-rendered prior sample is not evidence of hardware performance.
