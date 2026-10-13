# Riftborne v0.3.0 — Radiant Magic

Six elements now have beautiful, distinct generated magic textures, with luminous cores, flowing filament trails, rotating sigils, layered impacts, fading sparks, and spell light. Fire curls, frost crystals, lightning arcs, mineral shards, wind ribbons, and toxic plasma have their own motion and silhouettes. Hostile ground markers retain a red boundary. All 15 runtime textures preserve transparency; editable generation sources and full prompts are included in the repository.

The effect pool is bounded at 2,200 particles and 32 transient bursts. A cleanup check returned the scene to its original node count, and the existing bloom setting provides a lighter rendering mode.

The combat fixes in this release are:

- Projectiles now resolve terrain, prop, enemy, and spell-zone contacts in travel order, with effects placed at the impact point.
- Ordinary bolts stop at the nearest target. Winter Needle can pierce multiple enemies but stops at terrain.
- Destroying a prop stops the shot that broke it; later shots can pass through the cleared space.
- Wind deflection redirects from the contact point. Consumed or expired projectiles and zones no longer produce ghost hits.
- Enemy lightning no longer chains damage into the enemy team.
- Boss lock-on clears between realms and cannot engage while the guardian is sealed during a sentinel wave.

Play at https://riftborne-gamma.vercel.app/ or https://remriel.github.io/riftborne/.

Windows: extract `Riftborne-v0.3.0-Windows.zip` and run `Launch Riftborne.cmd`. Requires Node.js 22+; no npm install is needed.

Verification: 16 automated tests cover collision ordering, destructible cover, piercing, wind deflection, expired spells, team ownership, and lock-on transitions. The initial seven regression tests were demonstrated failing before the fix. All six elements were reviewed in staged visual screenshots. A separate normal keyboard/mouse run with the new effects defeated the Titan and entered the sentinel encounter, where lock-on stayed off. It used no QA health or combat mutations or simulation acceleration. Observed frame intervals in that duel were approximately 31–34 ms on this host. This does not establish human difficulty, a general GPU benchmark, or full-campaign pacing. Splash damage still has no wall occlusion, and decorative ruin walls remain scenery.
