import sharp from 'sharp';
import {mkdir} from 'node:fs/promises';

// Run Blender's art/bake-arena-stone.py first; preserve non-color data losslessly.
await mkdir('public/assets',{recursive:true});
for(const kind of ['albedo','normal','roughness']){
 const input=`output/arena-stone-bake/arena-stone-${kind}.png`;
 const output=`public/assets/arena-stone-${kind}.webp`;
 const options=kind==='albedo'?{quality:90}:{lossless:true};
 const result=await sharp(input).webp(options).toFile(output);
 console.log(`${output}: ${result.width}x${result.height}, ${result.size} bytes`);
}
