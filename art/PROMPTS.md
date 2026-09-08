# Generated materials

Built-in OpenAI image generation was used for both source images.

- `ruin-stone-source.png`: Seamless orthographic weathered blue-grey sandstone flagstones, broad irregular slabs, carved geometric channels, chipped edges, mineral grain, cracks and restrained moss. Neutral illumination; no text or objects.
- `character-materials.png`: Six equal material swatches in a 3-by-2 atlas: midnight teal embroidered mage cloth; molten basalt; electric indigo reptilian scales; glacial blue crystal; ancient bone with toxic green cracks; aged gold celestial armor. Orthographic surface-only textures, neutral illumination, no text or figures.

Character models are Blender remodels of the existing licensed KayKit and Quaternius meshes. They are not newly generated 3D meshes. Source skeletons and animation clips are reused. `reforge-characters.py` edits the geometry, removes unused accessories, creates armor from source topology, and exports the models; `scripts/package-characters.mjs` restores animation channels and packages GLBs.
