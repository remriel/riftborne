# Riftborne v0.2.0 — Fivefold Arenas

Five realms now have their own traversal platforms and ruin arrangements. The Gardens use a broken crescent, Cinderwatch has opposed battlements, the Glass Peaks form a rising diagonal, the Hollow Marsh has low scattered islets, and the Aether Citadel has mirrored plazas.

## Changes

- Rapier platform colliders and visible terraces now share one realm-layout definition, so raised floors match their collision surfaces.
- Enemy waves in later realms start farther from the player entry point.
- A leftover damage flash is cleared when entering a new realm.
- The GitHub Pages build now uses relative asset URLs for the `/riftborne/` project path, and its workflow runs the game tests before deployment.
- The dependency lockfile includes fixes for the reported `sharp` and `source-map-js` advisories.

## Play

- Browser: https://remriel.github.io/riftborne/
- Windows: download `Riftborne-v0.2.0-Windows.zip`, extract it, and double-click `Launch Riftborne.cmd`. Node.js 22 or newer is required; the ZIP needs no npm install.

## Verification and limits

Four automated tests pass, including arena physics and later-realm entry checks. The production build passes. All five realms were reviewed in Chromium screenshots; live keyboard movement and mouse casting damaged the first boss. `npm audit` reports zero vulnerabilities. The prior Rapier initialization warning and Vite large-bundle warning remain nonblocking.

This remains a playable alpha. A natural five-boss campaign win and 30–60 minute pacing are unverified. The realms share a central floor and sky; decorative ruin walls are not physical collision geometry. See `README.md` for the remaining design-scope limits.
