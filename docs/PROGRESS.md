# Riftborne progress

Updated: 2026-10-12

## Current objective

Update the existing Riftborne project in the REMRIEL Vercel team to the current v0.2.0 release and verify its production domain.

**Progress: 100%** — the v0.2.0 Vercel production update is verified. The GitHub release remains complete.

## Vercel checklist

- [x] Reconcile the repository, handoff files, Git status, and current Vercel project.
- [x] Confirm the existing `riftborne` project is in the intended REMRIEL team and linked to `remriel/riftborne`.
- [x] Confirm the production deployment uses current `master` and enter the first duel at the Vercel domain with zero browser errors.
- [x] Push the README and project handoff update to trigger a fresh production deployment.
- [x] Verify the new deployment is ready, assigned to the production alias, and still boots into play.
- [x] Copy final `PROGRESS.md` and `PROJECT_STATE.md` into the task outputs.

## Completed v0.2.0 release checklist

- [x] Read the repository handoff, inspect Git status/diff, source, and existing tests.
- [x] Define five realm layouts shared by Rapier and scene construction.
- [x] Add integration coverage for distinct collision footprints, platform heights, and clear spawn points.
- [x] Run the existing and new unit tests; all four pass.
- [x] Build the production game; TypeScript and Vite pass with a nonblocking chunk warning.
- [x] Apply fixable dependency security updates; `npm audit fix` reports zero vulnerabilities.
- [x] Inspect browser renders of the first arena and all later realms; fix entry crowding and the carried hit flash.
- [x] Finalize package version, README, and release notes.
- [x] Run final tests, build, audit, and release ZIP smoke check.
- [x] Verify the build loads from a `/riftborne/` static mount, matching the GitHub Pages project path.
- [x] Push the changes and verify the Pages deployment.
- [x] Publish and verify the new GitHub release and downloadable ZIP.

## Current implementation state

- `src/arena.ts` supplies distinct platform, ruin, and floating-fragment plans for the Sundered Gardens, Cinderwatch Fortress, Glass Peaks, Hollow Marsh, and Aether Citadel.
- `src/physics.ts` selects the current plan when rebuilding the Rapier world. `src/world.ts` places finished ruins and visible terraces from that plan. `src/game.ts` passes the realm index on transitions.
- `tests/arena.test.ts` passed along with both existing combat tests.
- The production build completed locally. Chromium screenshots of all five realms showed distinct placements without clipping or browser errors. Live keyboard movement and mouse casting damaged the first boss.
- The extracted Windows ZIP served its index, JavaScript bundle, and mage GLB over HTTP. The `/riftborne/` static mount loaded and entered the first duel with zero browser errors.
- Local publication artifact: `Riftborne-v0.2.0-Windows.zip` (SHA-256 `1B085DCCF90BF4767EF868455EB6A3B90E16520F5941CDA442913D95C778DC40`).
- `df9feb53a7a7f1cf235ccb758b682a5772af1654` was pushed to `master`. GitHub Pages workflow [38290557279](https://github.com/remriel/riftborne/actions/runs/38290557279) succeeded. The [live site](https://remriel.github.io/riftborne/) loaded its relative bundle and entered the first duel with zero browser errors.
- [GitHub release v0.2.0](https://github.com/remriel/riftborne/releases/tag/v0.2.0) is published from that commit. Its `Riftborne-v0.2.0-Windows.zip` asset is 20,120,728 bytes, and the GitHub SHA-256 digest matches the local ZIP.
- The existing Vercel production deployment `dpl_7LJAJQX8q2kcG5Qctu9CJ4P7jwhN` was `READY` on `fc0548703632989cbbb1b58465f3d10e2a7588f3`. [riftborne-gamma.vercel.app](https://riftborne-gamma.vercel.app/) loaded the title screen and entered the first duel in Chromium with zero errors.
- The documentation update on `master` triggered production deployment [`dpl_CWxNm7wybXK19HcPg1T51sxkPa7S`](https://vercel.com/remriel/riftborne/CWxNm7wybXK19HcPg1T51sxkPa7S) at `93a36a4f6021f243a34c2df2fa5acc0b4939c695`. It reached `READY`, reported no alias error, and owned the `riftborne-gamma.vercel.app`, `riftborne-remriel.vercel.app`, and `riftborne-git-master-remriel.vercel.app` aliases.

## Blockers

None. Natural full-campaign play balance remains an existing limitation, not a blocker for this layout release.

## Verification so far

- `npm test`: 4 passed, 0 failed.
- `npm run build`: passed; Vite emitted its existing large-chunk warning.
- `npm ci` from the updated lockfile and `npm audit --audit-level=high`: passed with 0 vulnerabilities.
- Chromium review: all five realm screenshots, keyboard movement, and primary casting; zero browser errors.
- ZIP HTTP smoke: index, script, and mage GLB returned 200. Static `/riftborne/` mount: bundle, styles, character GLBs, textures, and favicon returned 200; browser booted into play.
- Live Pages: workflow succeeded; HTML references `./assets/...`, the JavaScript bundle returned 200 as JavaScript, and Chromium entered the first duel with zero errors.
- Live Vercel production alias: Chromium reloaded after deployment `dpl_CWxNm7wybXK19HcPg1T51sxkPa7S`, showed the title screen, entered the first duel, and reported zero browser errors. The lone Rapier initialization deprecation warning remains pre-existing and nonblocking.

## Exact ordered next steps

The Vercel update has no remaining steps. For the next development milestone:

1. Play the first boss through a natural win with real controls; record time, deaths, and aiming/camera friction.
2. Tune first-duel damage, enemy pressure, and camera behavior using that playthrough.
3. Add physical cover and biome-specific combat mechanics while keeping visual and collision placement synchronized.
4. Repeat natural boss progression checks before claiming full-campaign pacing.
