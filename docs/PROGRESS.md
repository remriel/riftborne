# Riftborne progress

Updated: 2026-11-07

## Current objective

Pursue an AAA-aspiring graphics uplift for Riftborne, using Blender for asset processing/authoring and Three.js for rendering. This is a verified local graphics increment, not a claim that the game meets AAA production quality. Preserve the current stylized high-fantasy direction unless the user approves a change.

**Progress: 100%** for this verified graphics release slice. The wider AAA graphics goal remains unfinished.

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
- [x] Push the graphics commit and verify the production Vercel deployment and public bundle.

## Current implementation state

Graphics commit `dc26c744d7c0dd1ca64fe3336209508d151fdb48` is on `origin/master`. Vercel production deployment `dpl_2pz1GDPirj72UVivDYmXJXQQQxEP` is READY; https://riftborne-gamma.vercel.app/ and its new `index-C6IEHleS.js` bundle returned HTTP 200.

The stone bake reduces but does not eliminate seams (reported edge/adjacent-pixel ratios about 1.1–1.3); pattern repetition remains. Normal/roughness WebPs are lossless and albedo is quality 90. The sanctuary GLB is 5.92 MiB, one primitive/9,622 triangles; the saved `.blend` is 5.89 MiB and contains one joined mesh. Three embedded PNG maps duplicate separately loaded shared WebPs. Two distant sanctuary instances are render-only and provide no cover.

The high-mode screenshot was a staged asset/render check. The natural browser smoke ran in performance mode. It did not test the AO toggle specifically, review 1280 resolution, or inspect all realms. Screenshot performance telemetry is smoothed software-rendered host data and must not be treated as hardware GPU performance.

## Remaining risks

The exact user-facing visual bar and target GPU are not specified. The game remains a playable alpha; other realms, the whole natural campaign, and a 30–60 minute run are not visually/gameplay accepted by this graphics slice. Current realms share the combat floor, ground identity and sky panorama; characters are Blender-remodeled licensed-source models. Avoid calling a single material/environment pass “AAA.”

## Exact next steps

1. Browser-test the contact-shadow setting on/off and capture a 1280px view.
2. Review all five realms, material seams/repetition and sanctuary composition; assess removing duplicated GLB textures.
3. Profile representative GPUs and obtain human visual review. Develop bespoke character assets and animation toward the wider AAA goal.
