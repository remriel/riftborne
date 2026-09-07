import * as T from 'three';
import {SPELLS,type Element} from './config';
import {V,type GameEvent} from './core';
const MAX=2200;
export class VFXManager {
 particles:T.Points;positions=new Float32Array(MAX*3);colors=new Float32Array(MAX*3);life=new Float32Array(MAX);vel=new Float32Array(MAX*3);cursor=0;
 glow:T.Texture;shake=0;
 constructor(private scene:T.Scene){
  // Analytic optical kernel, used only for spell light and particles.
  const data=new Uint8Array(32*32*4);for(let y=0;y<32;y++)for(let x=0;x<32;x++){const d=Math.hypot(x-15.5,y-15.5)/15.5,i=(y*32+x)*4;data[i]=data[i+1]=data[i+2]=255;data[i+3]=Math.max(0,Math.pow(1-d,2))*255;}
  this.glow=new T.DataTexture(data,32,32);this.glow.needsUpdate=true;
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(this.positions,3));geo.setAttribute('color',new T.BufferAttribute(this.colors,3));
  this.particles=new T.Points(geo,new T.PointsMaterial({size:.65,map:this.glow,transparent:true,blending:T.AdditiveBlending,depthWrite:false,vertexColors:true,sizeAttenuation:true}));this.particles.frustumCulled=false;scene.add(this.particles);
  for(let i=0;i<MAX;i++)this.positions[i*3+1]=-999;
 }
 color(e:string){return e==='lava'||e==='firestorm'?0xff772c:e==='poisonstorm'?0xa5ed65:e==='steam'?0xd7f6ff:SPELLS[e as Element]?.color||0xffe3a5;}
 emit(pos:T.Vector3,e:string,count=12,speed=5){const color=new T.Color(this.color(e));for(let n=0;n<count;n++){const i=this.cursor++%MAX;this.life[i]=.3+Math.random()*.7;this.positions[i*3]=pos.x;this.positions[i*3+1]=pos.y;this.positions[i*3+2]=pos.z;this.vel[i*3]=(Math.random()-.5)*speed;this.vel[i*3+1]=(Math.random()-.15)*speed;this.vel[i*3+2]=(Math.random()-.5)*speed;this.colors[i*3]=color.r*1.6;this.colors[i*3+1]=color.g*1.6;this.colors[i*3+2]=color.b*1.6;}}
 event(e:GameEvent){if(e.pos){const size=e.size||1;this.emit(e.pos,e.element||'wind',Math.min(180,Math.round(size*13)),size*3);}if(e.type==='combo'||e.type==='phase'||e.type==='hit')this.shake=Math.max(this.shake,e.type==='hit'?.12:.22);}
 sprite(e:string,size:number){return new T.Sprite(new T.SpriteMaterial({map:this.glow,color:this.color(e),transparent:true,blending:T.AdditiveBlending,depthWrite:false})).scale.set(size,size,size);}
 orb(e:string,size:number){const s=new T.Sprite(new T.SpriteMaterial({map:this.glow,color:this.color(e),transparent:true,blending:T.AdditiveBlending,depthWrite:false}));s.scale.setScalar(size);return s;}
 ring(e:string,radius:number,opacity=.8){const geo=new T.RingGeometry(.94,1,80);const mesh=new T.Mesh(geo,new T.MeshBasicMaterial({color:this.color(e),side:T.DoubleSide,transparent:true,opacity,depthWrite:false}));mesh.rotation.x=-Math.PI/2;mesh.scale.setScalar(radius);return mesh;}
 update(dt:number){this.shake*=Math.exp(-12*dt);for(let i=0;i<MAX;i++){this.life[i]-=dt;if(this.life[i]>0){this.positions[i*3]+=this.vel[i*3]*dt;this.positions[i*3+1]+=this.vel[i*3+1]*dt;this.positions[i*3+2]+=this.vel[i*3+2]*dt;}else this.positions[i*3+1]=-999;}this.particles.geometry.attributes.position.needsUpdate=true;this.particles.geometry.attributes.color.needsUpdate=true;}
 disposeObject(obj:T.Object3D){obj.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>m.dispose());}else if(o instanceof T.Sprite)o.material.dispose();});this.scene.remove(obj);}
}
