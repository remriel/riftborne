# Active session — graphics quality uplift

Updated: 2026-11-07

## Objective

Pursue an AAA-aspiring graphics uplift for Riftborne, with Blender as the requested asset-authoring and bake tool and Three.js as the runtime renderer. This is not a claim of AAA completion. Preserve the existing stylized high-fantasy direction unless the user approves another look.

## Implementation and provenance

- Generated `art/arena-stone-premium-source.png` with the built-in OpenAI image-generation tool. The exact prompt is in `art/PROMPTS.md`; the resolved model ID was not exposed.
- `art/bake-arena-stone.py` uses Blender 5.2.3 Cycles to edge-blend shifted samples and derive 1024px albedo, tangent normal and luminance-estimated roughness. `scripts/package-arena-stone.mjs` writes `public/assets/arena-stone-{albedo,normal,roughness}.webp`; albedo is WebP quality 90, normal/roughness are lossless. Seams are reduced but remain (reported edge/adjacent-pixel ratios about 1.1–1.3), and pattern repetition remains.
- `art/build-sky-sanctuary.py` builds editable `art/sky-sanctuary.blend` and runtime `public/assets/sky-sanctuary.glb` using 12 licensed KayKit CC0 modules and four sculpted cliff forms. Saved source is a single joined mesh; the GLB is one primitive with 9,622 triangles and about 5.92 MiB. Its three embedded PNG maps duplicate shared WebPs loaded separately. Two distant runtime placements are render-only scenery, not collision or cover.
- Three.js asset/world code applies the stone maps to the arena and finished stone modules and places the sanctuary instances. `ContactOcclusionPass` adds half-resolution GTAO/contact shadows, excluding transparent sprites/materials during the pass. A persisted `Contact shadows` option defaults on; performance mode bypasses post-processing/AO.
- The primary agent reports TypeScript, all 28 tests and production build pass. A staged 800x450 screenshot was inspected: the new GLB/maps loaded, high-quality GTAO/bloom rendered, and no page/shader/request errors appeared. That sample reported 190 composed draw calls, 337,420 triangles and smoothed 28.95 ms; this software-rendered sample is not a hardware benchmark. Natural input and settings-mode QA is in progress.

## Documentation Impact

- Decision: updated
- Documents: `ASSETS.md`, `art/PROMPTS.md`, `docs/PROJECT_STATE.md`, `docs/PROGRESS.md`, `production/graphics-quality-plan.md`, `production/session-state/active.md`, `WISDOM.MD`
- Reason: The new generated source, Blender bake pipeline, sanctuary asset, renderer behavior and player-facing setting require provenance, implementation records, QA evidence and explicit limitations.

## Verification and remaining work

- Code/build gate: TypeScript, 28 regression tests and Vite production build pass per the primary agent.
- Browser: staged screenshot check passed for loading/rendering and absence of page, shader and request errors. Natural-input performance-mode smoke passed movement, jump, casting, pause, settings and loadout. A separate AO-off browser check remains open.
- Not verified: residual seam/repetition acceptability, comprehensive cross-realm visual quality, human art review, GPU performance, optimization of embedded duplicate maps, or all-realm review.

## Failed approaches to avoid

- An injected Blender session did not provide `__file__`; the bake script was corrected to read injected `args`. The documented command-line form also works.
- The first sanctuary preview had no scene World; the builder now creates one.
- Do not describe the current stone map as seamless or the distant sanctuary as physical cover.

## Release boundary

Repository `remriel/riftborne`, branch `master`; graphics commit `dc26c744` is live as Vercel deployment `dpl_2pz1GDPirj72UVivDYmXJXQQQxEP`. The public alias and new bundle returned HTTP 200.

## Previous completed release

The prior clarity/control slice passed 28 tests, TypeScript, production build and local/live 800x450 browser smoke, then deployed to Vercel. Its acceptance does not substitute for QA of the current graphics changes; see `docs/PROJECT_STATE.md`.