# Playtest — 2026-09-07

## Combat correctness pass — 2026-10-12

Two standard-difficulty Chromium playthroughs used actual keyboard and mouse events: boss lock-on, alternating strafing, dual casting, secondaries, overdrive, jump, and dodge. Both reached the first upgrade screen. No QA state mutation, reduced boss health, invulnerability, or simulation acceleration was used.

- Before the patch: approximately 24 wall-clock seconds, 119/160 remaining health, 58 reactions, one fall recovery.
- After projectile fixes: game timer 00:23, 74/160 remaining health, 60 reactions. The upgrade screenshot was inspected and the browser reported zero errors.
- These automated input runs establish that the first boss is beatable through regular controls. They do not measure human difficulty, reproduce identical random combat sequences, or validate the full campaign. The short duel suggests that the intended campaign pacing needs a separate balancing pass.
- Entering the next realm exposed lock-on tracking the sealed boss. The patch now clears lock-on at transitions and gates it on boss activation. A regression test covers both the sentinel wave and boss activation.
- Seven new collision/expiry/team regression cases failed before the fix. The final suite has 16 passing tests. Splash damage occlusion and decorative wall colliders remain outside this patch.

## Earlier alpha checks

## Radiant Magic visual and runtime checks — 2026-10-13

Reviewed staged screenshots for all six elemental cores, curved trails, layered sigils, and impacts. These `?qa` screenshots deliberately place effects for repeatable visual inspection; they are not gameplay-win evidence.

A separate real-input run with the integrated effects reached the upgrade screen at game timer 00:13 with 115/160 health, then selected an upgrade and entered Cinderwatch with six sentinels. Pressing L during that encounter left the lock indicator hidden. The run made no QA combat/health changes or simulation acceleration. Randomness and timing make this unsuitable for an exact before/after balance comparison.

The staged six-element scenes used about 108 draw calls each. Busy live samples ranged up to 664 draw calls and approximately 31–34 ms frame intervals on this host. The browser had zero errors, with the prior Rapier initialization warning. A 100-burst stress check reached the configured 32-burst/2,200-particle limits; after expiration it returned to 0 active effects and the original 44 scene children. Bloom-disabled rendering also completed.

## Original alpha evidence

Tested in Chromium through Playwright against the running Vite application. Canvas screenshots reviewed, not only DOM state.

Passed automated in-browser simulation assertions:

- WASD displacement, jump altitude, double jump count, directional air-dodge cooldown.
- Physical Fire and Frost projectiles damage the boss and trigger Thermal Shock.
- Titan phase 2 and phase 3 transitions; phase 3 creates lava hazards.
- All six secondaries execute and enter cooldown.
- Boss defeat presents exactly three upgrades; selection enters the next realm with six enemies.
- All subsequent bosses can activate after the encounter; campaign completion reaches victory.
- Lethal player damage reaches death; restart clears the run and restores starting health.

Observed normal live behavior: title screen, Enter the Rift, animated characters, incoming attacks, damage feedback, and eventual death while idle. Approximately 16.7 ms browser frame interval in the first arena on this host. This is not a GPU benchmark or worst-case performance guarantee.

Fixed during review: starting camera obstructed by raised terrain; moved spawn inward. Moved a prop out of the starting camera path. Replaced inappropriate flying Titan source mesh. Added favicon to remove the only observed resource 404.

Limitations: campaign transition tests accelerated boss deaths; they were not five naturally played wins. Whole-run 30–60 minute balance, all detailed interactions, physical cover generation, and worst-case performance remain unverified. See README scope notes.
