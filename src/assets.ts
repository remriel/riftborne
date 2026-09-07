import * as T from 'three';
import {GLTFLoader,type GLTF} from 'three/addons/loaders/GLTFLoader.js';
import {clone} from 'three/addons/utils/SkeletonUtils.js';
export class AssetLibrary {
 models=new Map<string,GLTF>();textures=new Map<string,T.Texture>();
 async load(progress:(value:number)=>void){const loader=new GLTFLoader();const names=['mage','titan','wyrm','colossus','oracle','pillar_decorated','wall_arched','wall_broken','floor_tile_large','floor_dirt_large_rocky','stairs_wide','barrel_large','column'];let complete=0;
  await Promise.all(names.map(async name=>{const gltf=await loader.loadAsync(`./assets/${name}.glb`);this.models.set(name,gltf);progress(++complete/(names.length+2));}));
  for(const name of ['sky','elements']){const t=await new T.TextureLoader().loadAsync(`./assets/${name}.webp`);t.colorSpace=T.SRGBColorSpace;this.textures.set(name,t);progress(++complete/(names.length+2));}
 }
 model(name:string,height?:number){const source=this.models.get(name);if(!source)throw Error(`Missing asset: ${name}`);const object=clone(source.scene);const box=new T.Box3().setFromObject(object),size=box.getSize(new T.Vector3());const scale=height?height/size.y:1;object.scale.multiplyScalar(scale);const center=box.getCenter(new T.Vector3());object.position.set(-center.x*scale,-box.min.y*scale,-center.z*scale);const root=new T.Group();root.add(object);root.userData.assetObject=object;root.traverse(n=>{if(n instanceof T.Mesh){n.castShadow=true;n.receiveShadow=true;n.frustumCulled=false;}});return root;}
 animation(root:T.Group,name:string){return new ActorAnimation(root,this.models.get(name)!.animations);}
}
export class ActorAnimation {
 mixer:T.AnimationMixer;actions=new Map<string,T.AnimationAction>();current='';
 constructor(root:T.Object3D,clips:T.AnimationClip[]){this.mixer=new T.AnimationMixer(root);for(const c of clips)this.actions.set(c.name,this.mixer.clipAction(c));}
 play(names:string[],fade=.18){const name=names.find(n=>this.actions.has(n));if(!name||name===this.current)return;const previous=this.actions.get(this.current),next=this.actions.get(name)!;next.reset().play();if(previous)previous.crossFadeTo(next,fade,false);this.current=name;}
 update(dt:number){this.mixer.update(dt);}
 dispose(){this.mixer.stopAllAction();this.mixer.uncacheRoot(this.mixer.getRoot());}
}
