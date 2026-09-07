import sharp from 'sharp';
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {dedup,prune} from '@gltf-transform/functions';
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS);
for(const name of ['titan','wyrm','colossus','oracle']){const doc=await io.read('public/assets/'+name+'.gltf');await doc.transform(dedup(),prune());await io.write('public/assets/'+name+'.glb',doc);}
for(const name of ['sky','elements'])await sharp('public/assets/'+name+'.png').webp({quality:88}).toFile('public/assets/'+name+'.webp');
console.log('Production assets ready');
