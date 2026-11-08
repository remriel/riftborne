# Riftborne progress

Updated: 2026-11-07

## Current objective

Pursue an AAA-aspiring graphics uplift for Riftborne, using Blender for asset processing/authoring and Three.js for rendering. This is a verified local graphics increment, not a claim that the game meets AAA production quality. Preserve the current stylized high-fantasy direction unless the user approves a change.

**Progress: 85%** `████████▌░` toward a locally verified graphics increment. Source assets, Blender pipeline, renderer wiring, 28-test suite, focused preference checks, build, staged high-mode screenshot and natural performance-mode smoke passed. GitHub push and Vercel verification remain pending; hardware performance, the AO toggle's browser interaction and all-realm visual review remain open.

- [x] Reconcile art baseline, engine, repository state and prior release.
- [x] Generate and document the arena-stone source prompt; model ID unavailable.
- [x] Bake 1024px albedo, tangent normal and luminance-estimated roughness with Blender 5.2.3 Cycles; package runtime WebPs.
- [x] Author the sanctuary Blender scene and one-primitive GLB from 12 CC0 KayKit modules and four sculpted cliff forms.
- [x] Integrate arena materials, two distant render-only sanctuaries, half-resolution GTAO/contact shadows, persisted setting and performance-mode bypass.
- [x] Pass TypeScript, production build, 28 full-suite tests, and focused AO preference tests (2/2).
- [x] Inspect a staged high-quality 800x450 screenshot: all maps and GLB loaded, GTAO/bloom visible, no page/shader/request errors.
- [x] Pass natural-input 800x450 performance-mode smoke: movement z=16→11.58, jump y=1.99, dual-cast damage 24.57, pause/loadout/settings and modal Tab wrap; no page errors or bad requests.
- [ ] Separately browser-test the AO setting on/off behavior; no 1280 screenshot has been reviewed.
- [ ] Visually review all five realms and obtain human art acceptance; check seam/repetition and sanctuary-map duplication.
- [ ] Measure performance on representative GPU hardware; prior software-rendered samples are not hardware benchmarks.
- [ ] Push the reviewed graphics commit and verify its Vercel deployment.

## Current implementation state

HEAD is `e48dd3ed700203365c0f8cebf3c0ff782781a2d9` on `master`; the graphics source, tests, provenance and generated assets are in the working tree. The current production alias still serves the prior release. No graphics deployment has been verified.

The stone bake reduces but does not eliminate seams (reported edge/adjacent-pixel ratios about 1.1–1.3); pattern repetition remains. Normal/roughness WebPs are lossless and albedo is quality 90. The sanctuary GLB is 5.92 MiB, one primitive/9,622 triangles; the saved `.blend` is 5.89 MiB and contains one joined mesh. Three embedded PNG maps duplicate separately loaded shared WebPs. Two distant sanctuary instances are render-only and provide no cover.

The high-mode screenshot was a staged asset/render check. The natural browser smoke ran in performance mode. It did not test the AO toggle specifically, review 1280 resolution, or inspect all realms. Screenshot performance telemetry is smoothed software-rendered host data and must not be treated as hardware GPU performance.

## Remaining risks

The exact user-facing visual bar and target GPU are not specified. The game remains a playable alpha; other realms, the whole natural campaign, and a 30–60 minute run are not visually/gameplay accepted by this graphics slice. Current realms share the combat floor, ground identity and sky panorama; characters are Blender-remodeled licensed-source models. Avoid calling a single material/environment pass “AAA.”

## Exact next steps

1. Push the verified local graphics changes to `origin/master` and record the full commit SHA.
2. Verify the resulting Vercel deployment and public asset bundle; update docs with that evidence.
3. Browser-test the AO toggle on/off and verify translucent VFX remain unaffected; capture a 1280 view.
4. Review all five realms, material seams/repetition and sanctuary composition; decide whether to remove embedded duplicate maps.
5. Profile representative GPU hardware and obtain human visual review. Record limits and keep full-campaign pacing separately marked unverified.