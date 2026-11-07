# Riftborne — working reflections

## 2026-11-06 · blast cover development

1. **Least confident:** A single center-point visibility ray is a fair approximation for all partially exposed fighters and large bosses. I would watch real fights around cover and consider sampling several points if players see exposed targets incorrectly protected.
2. **Biggest missing context:** Only explosions use the new cover rule. Lingering zones, frost's area freeze, lightning chains, and boss attacks still have their previous behavior, while decorative ruin pieces without colliders never block damage. I would test those cases explicitly before describing cover as a universal mechanic.
3. **Most consequential assumption:** Physical cover should fully block explosion damage instead of merely reducing it. If playtests show that this makes the fast elemental combat frustrating, I would test partial damage or another rule before changing the balance broadly.

PR #2 was merged and Vercel production served the updated bundle. A remote browser playthrough remains unverified.

## 2026-11-07 · clarity and control polish

1. **Least confident:** The performance preset's real benefit across hardware is unknown because the automated browser used software rendering; the synthesized impact tone also has not had human audio review. I would capture frame-time data on representative GPUs and review the mix before making broader quality claims.
2. **Biggest missing point:** This is a bounded UX and rendering polish release, not evidence of full AAA production quality. Natural campaign balance, broad accessibility review, and device coverage remain open. I would define staged acceptance gates for those areas instead of treating one polish pass as an AAA milestone.
3. **Most consequential assumption:** Riftborne's existing Three.js/Rapier browser architecture and asset base are the intended foundation. If a platform or architecture change is expected, I would decide that roadmap before investing in more browser-specific polish.

The verified release commit is `74b3f404ab7c626810a9598c22e1482022f7ec05`. Vercel deployment `dpl_BaLi9RLzBT1Zk8vpsvF3he1iAyHV` reached READY with no alias error. The public gameplay smoke passed at 800x450: settings persistence, focus wrap, movement, jumping, lock-on, dual casting, pause and loadout selection; there were zero page errors or bad HTTP responses. Vercel runtime error/fatal logs were empty for the prior 30 minutes, which is server-side evidence only.
