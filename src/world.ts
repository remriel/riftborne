import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {BOSSES} from './config';
import {V} from './core';
import type {AssetLibrary} from './assets';
import type {Game} from './game';
export class BiomeView {
 root=new T.Group();groundMaterial!:T.MeshStandardMaterial;ownedGeometry:T.BufferGeometry[]=[];ownedMaterials:T.Material[]=[];
 constructor(private scene:T.Scene,private assets:AssetLibrary){scene.add(this.root);}
 build(g:Game){this.root.clear();this.ownedGeometry.forEach(x=>x.dispose());this.ownedMaterials.forEach(x=>x.dispose());this.ownedGeometry=[];this.ownedMaterials=[];const data=BOSSES[g.boss.index];
  this.scene.fog=new T.Fog(data.fog,65,195);
  // Irregular cliff skirt: purpose-built terrain topology, not primitive character stand-ins.
  const positions:number[]=[],colors:number[]=[],indices:number[]=[],N=96;const color=new T.Color(data.ground);
  for(let ring=0;ring<3;ring++)for(let i=0;i<N;i++){const a=i/N*Math.PI*2;const square=45/Math.max(Math.abs(Math.sin(a)),Math.abs(Math.cos(a)));const jitter=Math.sin(i*7.4)*1.5+Math.cos(i*3.1);const r=ring===0?square:ring===1?square+2+jitter:27+jitter*2;positions.push(Math.sin(a)*r,ring===0?-.05:ring===1?-4-Math.abs(jitter)*2:-21+Math.sin(i*2.7)*5,Math.cos(a)*r);const c=color.clone().multiplyScalar(ring===0?1:ring===1?.65:.4);colors.push(c.r,c.g,c.b);}
  positions.push(0,-.05,0);colors.push(color.r,color.g,color.b);for(let i=0;i<N;i++){const j=(i+1)%N;indices.push(N*3,i,j);for(let r=0;r<2;r++){indices.push(r*N+i,(r+1)*N+i,r*N+j,r*N+j,(r+1)*N+i,(r+1)*N+j);}}
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setAttribute('color',new T.Float32BufferAttribute(colors,3));geo.setIndex(indices);geo.computeVertexNormals();this.ownedGeometry.push(geo);this.groundMaterial=new T.MeshStandardMaterial({vertexColors:true,roughness:1,flatShading:true,side:T.DoubleSide});this.ownedMaterials.push(this.groundMaterial);const ground=new T.Mesh(geo,this.groundMaterial);ground.receiveShadow=true;this.root.add(ground);
  const staticRoot=new T.Group();
  const place=(name:string,pos:T.Vector3,scale:T.Vector3,rotation=0)=>{const o=this.assets.model(name);const size=new T.Box3().setFromObject(o).getSize(V());o.scale.set(scale.x/size.x,scale.y/size.y,scale.z/size.z);o.position.copy(pos);o.rotation.y=rotation;staticRoot.add(o);return o;};
  // Hand-authored modular ruins: broken stonework and arches frame the open combat floor.
  for(let x=-2;x<=2;x++)for(let z=-2;z<=2;z++)place('floor_tile_large',V(x*8,.01,z*8),V(7.94,.18,7.94),(x+z)%2*Math.PI/2);
  for(const p of g.physics.platforms.slice(1)){
   place('floor_dirt_large_rocky',V(p.pos.x,p.pos.y-p.size.y/2,p.pos.z),V(p.size.x,p.size.y,p.size.z));
   place('floor_tile_large',V(p.pos.x,p.pos.y+p.size.y/2+.02,p.pos.z),V(p.size.x,.18,p.size.z));
  }
  for(let i=0;i<12;i++){const a=i*Math.PI/6,r=39;const x=Math.sin(a)*r,z=Math.cos(a)*r;const y=g.physics.floor(x,z);place(i%3===1?'wall_broken':'wall_arched',V(x,y,z),V(10,10+(i%3)*4,2.5),-a);place('pillar_decorated',V(x+Math.cos(a)*5,y,z-Math.sin(a)*5),V(2.6,12+(i%3)*4,2.6));}
  for(let i=0;i<4;i++){const a=i*Math.PI/2;place('stairs_wide',V(Math.sin(a)*31,.1,Math.cos(a)*31),V(6,5,10),a);}
  for(let i=0;i<12;i++){const a=i*2.399,r=74+(i%3)*25;const y=-9+(i%4)*10;place('floor_dirt_large_rocky',V(Math.sin(a)*r,y-12,Math.cos(a)*r),V(15+i%4*3,12,17));place('wall_broken',V(Math.sin(a)*r,y,Math.cos(a)*r),V(12,15,2),a);}
  staticRoot.updateMatrixWorld(true);
  // Merge static architecture by shared material to keep the arena inexpensive to draw.
  const groups=new Map<T.Material,T.BufferGeometry[]>();staticRoot.traverse(o=>{if(o instanceof T.Mesh&&!Array.isArray(o.material)){const geom=o.geometry.clone();geom.applyMatrix4(o.matrixWorld);const arr=groups.get(o.material)||[];arr.push(geom);groups.set(o.material,arr);}});
  for(const [material,geometries] of groups){const merged=mergeGeometries(geometries,false);geometries.forEach(x=>x.dispose());if(merged){const mesh=new T.Mesh(merged,material);mesh.castShadow=true;mesh.receiveShadow=true;this.root.add(mesh);this.ownedGeometry.push(merged);}}
 }
}
