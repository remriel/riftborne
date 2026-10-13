# Riftborne progress

Updated: 2026-10-13

## Current objective

Ship v0.3.0 Radiant Magic: beautiful luminous spell effects for all six elements, including the verified combat contact and lock-on fixes, on Vercel and as a GitHub release.

**Progress: 100%** — v0.3.0 Radiant Magic is published and verified on GitHub and Vercel.

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
- [x] Push and confirm Vercel/Pages production builds and public browser boot.
- [x] Publish v0.3.0, verify its ZIP digest, and synchronize final handoff files.

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

- Release commit: dd7187a7391b26eef2e1ad86fb1300a7df58e595. Vercel production deployment dpl_CWDQzfjykhuVonsqqLrqf7JwzsT3 is READY with aliases assigned. GitHub Pages workflow 38431277415 succeeded. The public Vercel browser loaded all 15 generated assets and cast in the first duel with zero errors.
- Published release: https://github.com/remriel/riftborne/releases/tag/v0.3.0. The uploaded ZIP digest matches the local package.

## Blockers and limits

None. Full-campaign pacing, human difficulty, splash damage occlusion, physical stone cover, and decorative wall collisions remain unresolved. The first duel can be very short with automated dual casting and reactions; balance needs a separate measured pass.

## Exact ordered next steps

The current release objective is complete. For the next development pass:

1. Measure later-boss encounters with normal input and record deaths, time, and aiming friction.
2. Investigate the short first-duel time and overlapping reaction-zone damage before setting a campaign pacing target.
3. Implement physical stone cover and splash occlusion with synchronized render/collision placement.
4. Recheck normal campaign progression before claiming full 30–60 minute pacing.