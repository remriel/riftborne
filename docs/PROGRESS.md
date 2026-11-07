# Riftborne progress

Updated: 2026-11-07

## Current objective

Continue Riftborne with a verified combat improvement: explosions should respect physical cover, and the work should be synchronized to GitHub and tested through the existing Vercel integration.

**Progress: 100%** for this development slice — implementation, local checks, GitHub synchronization, and Vercel production publication are complete.

## Checklist

- [x] Locate the correct repository and reconcile its source, Git state, and previous handoff.
- [x] Reproduce player and enemy explosions passing through terrain and destructible cover.
- [x] Implement cover checks and preserve destructible shielding throughout an impact.
- [x] Add seven focused regression tests and retain all earlier tests.
- [x] Update Vite 7.3.6 to 7.3.7 and confirm the dependency audit is clean.
- [x] Run the full test suite and production build.
- [x] Inspect browser screenshots and verify movement, casting, and boot locally.
- [x] Synchronize the development branch with GitHub and verify its Vercel preview.
- [x] Record deployment state, limitations, and ordered next steps.

## Implementation and verification

Explosions now test line of sight to each fighter or prop center against physical Rapier colliders. A target on the exposed side of an impact can still take damage; a prop destroyed during an impact stays protective until that impact is resolved. See `docs/PROJECT_STATE.md` for the geometry and deferred-removal details.

The test suite passes **23/23** tests. The production build passes with the existing large-bundle warning. The full npm audit reports zero vulnerabilities. A Chromium software-rendered browser run loaded the title and arena, moved from z=16 to z=14.89 with keyboard input, and spawned a spell with a mouse press; title and duel screenshots were inspected. No page exceptions occurred. Standalone Vite preview returned 404 for Vercel Analytics' `/_vercel/insights/script.js` endpoint, which is not supplied by the local preview server. The Rapier initialization deprecation warning remains.

The previously published [v0.3.0 Radiant Magic](https://github.com/remriel/riftborne/releases/tag/v0.3.0) remains the latest downloadable release; this production update has not been packaged as a new release.

GitHub PR https://github.com/remriel/riftborne/pull/2 was merged as `efacd31e01c8201b06e7afb90a1ef95b4c7877c6`. Vercel production deployment `dpl_BFohh9CL2q7BqRis6MfqjhmmFmtV` reached READY. The public https://riftborne-gamma.vercel.app/ returned HTTP 200 and served the expected cover-aware JavaScript bundle. A remote browser playthrough was not performed. GitHub Pages run 42393813012 was still in progress at this checkpoint.

## Blockers and limitations

None known for the local implementation. Center-point visibility may judge a partially exposed target as covered. Lingering zones, the frost area freeze, lightning chains, other area attacks, and non-colliding decorative ruins are not covered by the new explosion rule. Physical stone cover and a natural full-campaign balance playtest remain outstanding.

## Exact ordered next steps

1. Confirm the GitHub Pages workflow result and test the production game in a browser.
2. Evaluate lingering area effects and partially exposed targets in play before expanding the cover rules; measure later bosses before changing balance.
