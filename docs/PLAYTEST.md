# Playtest — 2026-09-07

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
