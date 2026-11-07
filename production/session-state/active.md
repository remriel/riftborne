# Active session — clarity and control

Updated: 2026-11-07

## Objective

Apply Codex Game Studio polish workflows to Riftborne and publish a verified increment to GitHub and Vercel. See `production/polish-plan.md` for discipline responsibilities, acceptance gates and deferred AAA production needs.

## Implementation

- Hit confirmation and core-strike labels use combat events; a throttled synthesized confirmation tone distinguishes impacts from casts.
- Contextual movement/jump/dualcast/dodge/lock-on hints stay off the center of play and expire after 60 seconds. Settings can disable them.
- Boss wind-up countdown shows attack name and remaining time. Existing damage rules and timing remain unchanged.
- Larger HUD typography, keyboard modal focus containment, cleared mouse deltas on pause/resume.
- Validated persisted sensitivity, invert-Y, reduced-motion, hints and performance preferences retain compatibility with old settings.
- Performance mode caps DPR at 1, disables shadows/bloom and reduces zone layers. Defeated sentinel animation/material instances are released instead of retained until realm transition.

## Documentation Impact

- Decision: updated
- Documents: docs/PROJECT_STATE.md, docs/PROGRESS.md, production/polish-plan.md
- Reason: Player-visible input, settings, HUD feedback, onboarding and rendering choices changed; document these behaviors, test evidence and production limitations.

## Verification

28 regression tests pass. TypeScript and Vite production build pass; large-chunk warning and Rapier initialization deprecation remain. The immutable production-preview browser gate passed at 800x450 with zero page errors or failed requests; settings persistence, modal focus wrap, movement, jump, lock-on, dual-cast damage, pause and loadout selection passed. Desktop and small-viewport screenshots were inspected. GitHub push and live Vercel verification remain pending. An initial development-server browser run was interrupted by hot reload during edits; use immutable builds for release QA.

## Release boundary

Repository: remriel/riftborne. Base: 5e69efd. Vercel: REMRIEL / riftborne / production. No engine migration or new art claim. Natural full-campaign balance, human audio review and hardware GPU performance remain unverified.
