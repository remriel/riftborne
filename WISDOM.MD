# Riftborne — working reflections

## 2026-11-06 · blast cover development

1. **Least confident:** A single center-point visibility ray is a fair approximation for all partially exposed fighters and large bosses. I would watch real fights around cover and consider sampling several points if players see exposed targets incorrectly protected.
2. **Biggest missing context:** Only explosions use the new cover rule. Lingering zones, frost's area freeze, lightning chains, and boss attacks still have their previous behavior, while decorative ruin pieces without colliders never block damage. I would test those cases explicitly before describing cover as a universal mechanic.
3. **Most consequential assumption:** Physical cover should fully block explosion damage instead of merely reducing it. If playtests show that this makes the fast elemental combat frustrating, I would test partial damage or another rule before changing the balance broadly.

PR #2 was merged and Vercel production served the updated bundle. A remote browser playthrough remains unverified.
