# Riftborne progress

Updated: 2026-10-13

## Current objective

Ship v0.3.0 Radiant Magic: beautiful luminous spell effects for all six elements, including the verified combat contact and lock-on fixes, on Vercel and as a GitHub release.

**Progress: 95%** — implementation, visual review, normal-input duel, cleanup, final tests, build, and package verification passed. Publication is pending.

## Checklist

- [x] Reconcile repository, Git state, handoff, source, and tests.
- [x] Complete normal-input first-boss wins without QA combat mutations or accelerated simulation.
- [x] Reproduce seven combat failures before fixing ordered impacts, piercing, expired spells, and enemy lightning ownership.
- [x] Clear lock-on between realms and gate it during sentinel waves.
- [x] Generate three original transparent source images and package 15 runtime textures.
- [x] Integrate elemental cores, curved filament trails, rotating sigils, wisps, sparks, impact blooms, bloom, and bounded spell lights.
- [x] Review all six elements in staged arena screenshots and check the new effects during a live duel.
- [x] Verify a normal-input upgrade transition keeps lock-on off during the sentinel encounter.
- [x] Confirm 100 emitted bursts respect the 32-burst and 2,200-particle caps and clean up to the original scene size.
- [x] Final tests, production build, and Windows package verification.
- [ ] Push and confirm Vercel/Pages production builds and public browser boot.
- [ ] Publish v0.3.0, verify its ZIP digest, and synchronize final handoff files.

## Implementation state

`src/magic-vfx.ts` owns the generated-texture VFX runtime. `src/vfx.ts` re-exports it. `AssetLibrary` loads 15 new alpha-preserving WebPs from `public/assets/magic/`. Source PNGs and complete prompts are preserved in `art/`; the processing script is `scripts/process-magic-assets.mjs`.

Combat resolves contacts by their first intersection along each projectile step. Terrain wins ties; normal bolts stop at the first target and Winter Needle retains its per-target hit set while respecting terrain. Consumed or expired spell zones receive no final damage tick. Lock-on resets at realm loads and cannot engage on a sealed boss.

## Verification

- All 16 combat/arena tests passed after the final combat changes. The first seven new regression cases failed on the prior implementation.
- All six magic families were inspected in staged QA screenshots. A separate live keyboard/mouse run reached the upgrade screen at 00:13 with 115/160 health and entered Cinderwatch with lock-on off.
- The staged six-element scenes used roughly 108 draw calls. Busy live samples reached 664 draw calls and approximately 31–34 ms frame intervals on this host; this is not a portable GPU benchmark.
- A 100-burst cleanup check respected the caps and returned to 0 active effects and the original 44 scene children. Bloom-disabled rendering completed.
- Browser console: zero errors; existing Rapier initialization warning remains.

- Final tests: 16 passed. Production build passed. npm audit: zero vulnerabilities. All 60 packaged files match the build, including 15 magic textures. Windows ZIP: 22,319,009 bytes; SHA-256 c5513fce64942a3767e210ee9646e7158bd7e60b20d4faffc2356615a1436d19.

## Blockers and limits

None. Full-campaign pacing, human difficulty, splash damage occlusion, physical stone cover, and decorative wall collisions remain unresolved. The first duel can be very short with automated dual casting and reactions; balance needs a separate measured pass.

## Exact ordered next steps

1. Run final tests and package the production build, then verify the ZIP contains every magic texture.
2. Push the tested commit and wait for Vercel and Pages to report successful builds of that SHA.
3. Open the production Vercel URL, enter the first duel, and verify the generated assets load without errors.
4. Publish v0.3.0 with the ZIP and verify its GitHub SHA-256 digest against the local file.
5. Record completion, sync the final notes, and copy PROGRESS.md and PROJECT_STATE.md to task outputs.
