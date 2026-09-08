import {NodeIO} from '@gltf-transform/core';
import {mkdir} from 'node:fs/promises';
const io=new NodeIO();await mkdir('art/character-sources',{recursive:true});
for(const name of ['mage','titan','wyrm','colossus','oracle']){
 const doc=await io.read(`public/assets/${name}.glb`);
 for(const animation of doc.getRoot().listAnimations())animation.dispose();
 await io.write(`art/character-sources/${name}.glb`,doc);
}
