import sharp from 'sharp';
import {mkdir} from 'node:fs/promises';
const elements=['fire','frost','lightning','stone','wind','toxic'];
const output='public/assets/magic';
await mkdir(output,{recursive:true});
for(const [source,kind] of [['art/magic-projectiles-source.png','core'],['art/magic-sigils-source.png','sigil']]){
  const metadata=await sharp(source).metadata();
  if(!metadata.hasAlpha)throw new Error(`${source} must retain transparency`);
  const width=Math.floor(metadata.width/3),height=Math.floor(metadata.height/2);
  for(const [i,element] of elements.entries()){
    const crop={left:(i%3)*width,top:Math.floor(i/3)*height,width,height};
    await sharp(source).extract(crop).resize(512,512).webp({quality:94,alphaQuality:100}).toFile(`${output}/${kind}-${element}.webp`);
    if(kind==='core'&&element==='lightning')await sharp(source).extract(crop).resize(128,128).greyscale().webp({quality:95,alphaQuality:100}).toFile(`${output}/spark.webp`);
    if(kind==='sigil'&&element==='wind')await sharp(source).extract(crop).resize(512,512).greyscale().webp({quality:94,alphaQuality:100}).toFile(`${output}/sigil-neutral.webp`);
  }
}
await sharp('art/magic-trail-source.png').resize(1536,512).webp({quality:94,alphaQuality:100}).toFile(`${output}/trail.webp`);
console.log('Packaged 15 transparent magic textures');
