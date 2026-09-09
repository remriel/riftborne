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
