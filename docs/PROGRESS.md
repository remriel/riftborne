# Riftborne progress

Updated: 2026-11-07

## Current objective

Publish a bounded clarity and control polish increment through the existing GitHub and Vercel pipeline. This is not a claim of full AAA production readiness.

**Progress: 90%** `█████████░` — local implementation, regression, build and browser gates passed; GitHub push and live production verification remain.

- [x] Reconcile repository, studio workflow and production target.
- [x] Implement feedback, field guide, settings, HUD readability and performance mode.
- [x] Pass TypeScript, Vite production build and all 28 regression tests.
- [x] Pass immutable production-preview browser gate and inspect desktop/small-viewport screenshots.
- [ ] Commit and push the reviewed changes to `master`.
- [ ] Verify the resulting Vercel production deployment and record its live status.

## Verification

The 800x450 browser run had zero page errors or failed requests. Settings persisted after reload; modal Tab focus wrapped; movement, jump, lock-on, dual-cast damage (24.57), pause and loadout selection passed. Position moved from z=16 to z=10.78 and jump reached y=3.36. Settings scroll within the small panel. Desktop and small-viewport screenshots were inspected.

The build retains the existing large-chunk and Rapier initialization deprecation warnings. Software-rendered frame timings do not establish hardware GPU performance. Human audio review and natural full-campaign balance remain unverified. Vercel production verification is pending; the local browser gate does not establish live deployment success.

## Exact ordered next steps

1. Commit and push the reviewed source, tests and documentation to `master`.
2. Verify Vercel production for that commit, then update this file and `docs/PROJECT_STATE.md` with deployment evidence and remaining limits.
