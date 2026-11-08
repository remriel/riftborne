# Generated materials

Built-in OpenAI image generation was used for both source images.

- `ruin-stone-source.png`: Seamless orthographic weathered blue-grey sandstone flagstones, broad irregular slabs, carved geometric channels, chipped edges, mineral grain, cracks and restrained moss. Neutral illumination; no text or objects.
- `character-materials.png`: Six equal material swatches in a 3-by-2 atlas: midnight teal embroidered mage cloth; molten basalt; electric indigo reptilian scales; glacial blue crystal; ancient bone with toxic green cracks; aged gold celestial armor. Orthographic surface-only textures, neutral illumination, no text or figures.

Character models are Blender remodels of the existing licensed KayKit and Quaternius meshes. They are not newly generated 3D meshes. Source skeletons and animation clips are reused. `reforge-characters.py` edits the geometry, removes unused accessories, creates armor from source topology, and exports the models; `scripts/package-characters.mjs` restores animation channels and packages GLBs.

## GPT Image 2.5 graphics refresh — 2026-09-09

The built-in OpenAI image generator produced a coherent replacement set using prompts structured for the new GPT Image 2.5 family. Official OpenAI documentation identifies Sunburst as the most capable GPT Image 2.5 model for generation and precise editing. The built-in tool does not expose its resolved model identifier in the result, so these source files are recorded as GPT Image 2.5-targeted built-in generations rather than claiming a hidden snapshot ID.

- `sky-image-2.5-source.png`: Extra-wide fractured-world panorama with floating citadels, opposing elemental storms, a warm horizon rift, and cloud-sea depth. Packaged to `public/assets/sky.webp` at 2048x1024.
- `elements-image-2.5-source.png`: Strict 3-by-2 atlas for fire, frost, lightning, stone, wind, and toxic ability emblems. Packaged to `public/assets/elements.webp` at 1536x1024.
- `character-materials-image-2.5.png`: Strict 3-by-2 atlas for mage cloth, Titan basalt, Wyrm scales, Colossus ice, Oracle bone/root, and Archon gold armor. Copied to `character-materials.png` for the Blender reforge pipeline.

## Arena stone material source — 2026-11-07

Source: built-in OpenAI image-generation tool. The resolved model identifier was not exposed; no model snapshot is claimed. Output: `art/arena-stone-premium-source.png`.

Prompt, recorded verbatim:

```text
Use case: stylized-concept. Asset type: production game material, a square tileable PBR base-color texture for an ancient high-fantasy arena floor. Primary request: overhead, orthographic close-up of massive irregular, hand-carved dark limestone and slate flagstones, with subtle weathered bevels, hairline fractures, small chips, thin mineral seams and restrained patches of desaturated moss and soot in the joints. Fine photorealistic surface detail, premium grounded dark-fantasy art direction, cool blue-grey neutral stone with warm mineral variation. The stones are tightly fitted and form a walkable, broadly level surface. This is a flat diffuse albedo map: even neutral lighting, no dramatic shadows, no highlights, no perspective, no 3D scene, no characters, no text or symbols. Tile continuously on all four edges; vary individual stones naturally but avoid obvious repeated motifs. High resolution texture intended to cover a large game arena.
```

The generated PNG is a source map, not the runtime material. Blender 5.2.3 Cycles processing in `art/bake-arena-stone.py` derives the albedo, tangent normal and luminance-estimated roughness maps; packaging is handled by `scripts/package-arena-stone.mjs`. The current blend reduces but does not eliminate seam differences, and pattern repetition remains. See `ASSETS.md` for generated map paths and current verification limits.
