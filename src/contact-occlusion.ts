import * as T from 'three';
import {GTAOPass} from 'three/addons/postprocessing/GTAOPass.js';

// Ground-truth ambient occlusion adds local contact depth without letting
// transparent spell cards write opaque rectangles into the depth buffer.
export class ContactOcclusionPass extends GTAOPass {
 constructor(scene:T.Scene,camera:T.Camera){
  super(scene,camera);
  this.blendIntensity=.5;
  this.updateGtaoMaterial({radius:.7,thickness:.6,samples:8});
  this.updatePdMaterial({radius:4,rings:2,samples:8});
 }
 override setSize(width:number,height:number){
  super.setSize(Math.max(1,Math.ceil(width/2)),Math.max(1,Math.ceil(height/2)));
 }
 override render(renderer:T.WebGLRenderer,write:T.WebGLRenderTarget,read:T.WebGLRenderTarget,delta:number,mask:boolean){
  const hidden:T.Object3D[]=[];
  this.scene.traverse(object=>{
   if(!object.visible)return;
   const mesh=object as T.Mesh;
   const materials=mesh.isMesh?(Array.isArray(mesh.material)?mesh.material:[mesh.material]):[];
   if((object as T.Sprite).isSprite||materials.some(material=>material.transparent||material.opacity<1||material.blending!==T.NormalBlending)){
    hidden.push(object);object.visible=false;
   }
  });
  try{super.render(renderer,write,read,delta,mask);}finally{for(const object of hidden)object.visible=true;}
 }
}
