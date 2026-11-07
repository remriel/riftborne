# Riftborne progress

Updated: 2026-11-07

## Current objective

Publish a bounded clarity and control polish increment through the existing GitHub and Vercel pipeline. This is not a claim of full AAA production readiness.

**Progress: 100%** `██████████` for this verified, published increment; overall AAA quality is not certified.

- [x] Reconcile repository, studio workflow and production target.
- [x] Implement feedback, field guide, settings, HUD readability and performance mode.
- [x] Pass TypeScript, Vite production build and all 28 regression tests.
- [x] Pass immutable production-preview browser gate and inspect desktop/small-viewport screenshots.
- [x] Push source, tests and documentation to `master` as `74b3f404ab7c626810a9598c22e1482022f7ec05`.
- [x] Verify Vercel production deployment and live browser gameplay.

## Verification

The local production-preview browser gate and live public site smoke both passed at 800x450. Settings persisted after reload; modal Tab focus wrapped; movement, jump, lock-on, dual-cast damage (24.57), pause and loadout selection passed. The local run moved from z=16 to z=10.78 and jump reached y=3.36. Both browser checks had zero page errors; the live check also had zero bad HTTP responses. Desktop and small-viewport screenshots were inspected, and settings scroll within the small panel.

Vercel deployment `dpl_BaLi9RLzBT1Zk8vpsvF3he1iAyHV` reached READY for the release commit, with alias `https://riftborne-gamma.vercel.app/` and no alias error. The public HTTPS page returned 200 and served the expected built bundle. Runtime error/fatal logs were empty for the prior 30 minutes; this is server-side evidence only.

The build retains the existing large-chunk and Rapier initialization deprecation warnings. Software-rendered frame timings do not establish hardware GPU performance. Human audio review and natural full-campaign balance remain unverified.

## Exact next step

Run a natural full-campaign playtest and record completion time, deaths, boss readability and ability use before adjusting balance. Then profile representative GPU hardware and conduct human audio review.
