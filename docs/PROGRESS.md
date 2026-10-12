# Riftborne progress

Updated: 2026-10-12

## Current objective

Ship a new release with five distinct arena layouts, an updated dependency lockfile, and verified browser and Windows-build delivery.

**Progress: 90%** toward a verified, publishable result.

## Checklist

- [x] Read the repository handoff, inspect Git status/diff, source, and existing tests.
- [x] Define five realm layouts shared by Rapier and scene construction.
- [x] Add integration coverage for distinct collision footprints, platform heights, and clear spawn points.
- [x] Run the existing and new unit tests; all three pass.
- [x] Build the production game; TypeScript and Vite pass with a nonblocking chunk warning.
- [x] Apply fixable dependency security updates; `npm audit fix` reports zero vulnerabilities.
- [x] Inspect browser renders of the first arena and all later realms; fix entry crowding and the carried hit flash.
- [x] Finalize package version, README, and release notes.
- [x] Run final tests, build, audit, and release ZIP smoke check.
- [x] Verify the build loads from a `/riftborne/` static mount, matching the GitHub Pages project path.
- [ ] Push the changes and verify the Pages deployment.
- [ ] Publish and verify the new GitHub release and downloadable ZIP.

## Current implementation state

- `src/arena.ts` supplies distinct platform, ruin, and floating-fragment plans for the Sundered Gardens, Cinderwatch Fortress, Glass Peaks, Hollow Marsh, and Aether Citadel.
- `src/physics.ts` selects the current plan when rebuilding the Rapier world. `src/world.ts` places finished ruins and visible terraces from that plan. `src/game.ts` passes the realm index on transitions.
- `tests/arena.test.ts` passed along with both existing combat tests.
- The production build completed locally. Chromium screenshots of all five realms showed distinct placements without clipping or browser errors. Live keyboard movement and mouse casting damaged the first boss.
- The extracted Windows ZIP served its index, JavaScript bundle, and mage GLB over HTTP. The `/riftborne/` static mount loaded and entered the first duel with zero browser errors.
- Local publication artifact: `Riftborne-v0.2.0-Windows.zip` (SHA-256 `1B085DCCF90BF4767EF868455EB6A3B90E16520F5941CDA442913D95C778DC40`).

## Blockers

None. Natural full-campaign play balance remains an existing limitation, not a blocker for this layout release.

## Verification so far

- `npm test`: 4 passed, 0 failed.
- `npm run build`: passed; Vite emitted its existing large-chunk warning.
- `npm ci` from the updated lockfile and `npm audit --audit-level=high`: passed with 0 vulnerabilities.
- Chromium review: all five realm screenshots, keyboard movement, and primary casting; zero browser errors.
- ZIP HTTP smoke: index, script, and mage GLB returned 200. Static `/riftborne/` mount: bundle, styles, character GLBs, textures, and favicon returned 200; browser booted into play.

## Exact ordered next steps

1. Review the final Git diff, commit, and push to `master`.
2. Confirm the GitHub Pages workflow succeeds and the live project URL boots with the new relative asset paths.
3. Create the `v0.2.0` GitHub release using `docs/RELEASE_NOTES_v0.2.0.md` and attach the verified ZIP.
4. Verify the release tag, asset size/hash, and final live link; record the outcome here.
