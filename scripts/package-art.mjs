import sharp from 'sharp';
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {dedup,prune,textureCompress} from '@gltf-transform/functions';
await sharp('art/ruin-stone-source.png').resize(1024,1024).webp({quality:85}).toFile('public/assets/ruin-stone.webp');
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS);
for(const name of ['pillar_decorated','wall_arched','wall_broken','floor_tile_large','floor_dirt_large_rocky','stairs_wide','column']){
 const path=`public/assets/${name}_finished.glb`;
 const doc=await io.read(path);
 await doc.transform(dedup(),prune(),textureCompress({encoder:sharp,targetFormat:'webp',resize:[1024,1024]}));
 await io.write(path,doc);
 console.log(`Packaged ${path}`);
}
