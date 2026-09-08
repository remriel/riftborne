import sharp from 'sharp';
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {dedup,prune,textureCompress} from '@gltf-transform/functions';
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS);
for(const name of ['mage','titan','wyrm','colossus','oracle','archon']){
 const source=await io.read(`public/assets/${name==='archon'?'mage':name}.glb`);
 const doc=await io.read(`art/character-sources/${name}-sculpt.glb`);
 const targets=new Map(doc.getRoot().listNodes().map(n=>[n.getName(),n]));
 const buffer=doc.getRoot().listBuffers()[0]||doc.createBuffer();
 const accessorMap=new Map();
 const copyAccessor=a=>{if(!accessorMap.has(a))accessorMap.set(a,doc.createAccessor(a.getName()).setType(a.getType()).setArray(a.getArray().slice()).setNormalized(a.getNormalized()).setBuffer(buffer));return accessorMap.get(a);};
 let channels=0;
 for(const original of source.getRoot().listAnimations()){
  const anim=doc.createAnimation(original.getName());
  for(const channel of original.listChannels()){
   const target=targets.get(channel.getTargetNode().getName());
   if(!target)continue; // Removed handheld accessories deliberately have no animation target.
   const s=channel.getSampler();
   const sampler=doc.createAnimationSampler().setInterpolation(s.getInterpolation()).setInput(copyAccessor(s.getInput())).setOutput(copyAccessor(s.getOutput()));
   anim.addSampler(sampler).addChannel(doc.createAnimationChannel().setTargetNode(target).setTargetPath(channel.getTargetPath()).setSampler(sampler));channels++;
  }
  if(!anim.listChannels().length)anim.dispose();
 }
 if(!channels)throw Error(`No animation channels restored for ${name}`);
 await doc.transform(dedup(),prune(),textureCompress({encoder:sharp,targetFormat:'webp',resize:[1024,1024]}));
 await io.write(`public/assets/${name}_reforged.glb`,doc);
 console.log(JSON.stringify({name,animations:doc.getRoot().listAnimations().length,channels,meshes:doc.getRoot().listMeshes().length}));
}
