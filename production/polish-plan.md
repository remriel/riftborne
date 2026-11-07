# Riftborne — clarity and control release

Date: 2026-11-07. Request: raise Riftborne toward AAA quality using Codex Game Studio, then publish to GitHub and Vercel.

## Studio workflow and ownership

Applied Codex Game Studio v0.5.0 `team-polish`, `game-feel-tuning`, and `implement` workflow guidance from `D:/Codex/2026-11-06/insta/outputs/codex-game-studio`. Producer → implementation → QA → release responsibilities were handled sequentially. Documentation and routine repository maintenance were delegated to Luna Max under the user's explicit instruction; complex reasoning and final release review stayed with the primary agent. Riftborne remains in its own repository and retains Three.js/Rapier. The studio CLI's Godot/Unity/Unreal initializer is not compatible with this engine and must not rewrite it as Postmarked or claim an engine migration.

## Polish targets and gates

| Owner responsibility | Target / player impact | Verification |
| --- | --- | --- |
| Game feel / gameplay | Ordinary hit confirmation, core strikes, readable boss attack countdown | Combat event regression tests; browser casting |
| UI / accessibility | Contextual first-run guide, readable HUD, modal keyboard focus, sensitivity/invert/reduced-motion preferences | Keyboard browser tests, settings reload, screenshots |
| Rendering | Explicit performance preset lowers resolution and disables shadows/bloom; motion preference suppresses camera kick | Runtime renderer inspection and browser screenshots |
| QA / release | Preserve all combat rules and campaign; verify boot, movement, casting, pause, loadout and settings | Full tests, production build, local and live browser smoke |

## Scope fit and risks

This is a concrete polish release, not certification of AAA production quality. Reuse the existing licensed/reforged models and generated textures. No placeholder production art. Defer new realms, replacement animation, commissioned score, gamepad/mobile control, and full campaign balancing to separately verified milestones. Natural full-campaign playtesting and hardware GPU profiling remain necessary. Performance mode trades visual detail for frame cost; software-rendered automation cannot establish real GPU performance.

## Release boundary

Start: clean `master` at `5e69efd`. Publish only reviewed Riftborne changes to `remriel/riftborne`, then verify the existing production Vercel project `riftborne` in REMRIEL. Rollback is a revert of this release commit or restoring the previous Vercel production deployment.
