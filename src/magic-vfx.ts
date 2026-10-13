import * as T from 'three';
import {SPELLS, type Element} from './config';
import {V, type GameEvent, type Projectile, type Zone} from './core';

const MAX = 2200, TRAIL_SEGMENTS = 12;
const profiles: Record<Element, {size:number; length:number; width:number; spin:number; lift:number}> = {
  fire: {size:1.9,length:7,width:.85,spin:2.5,lift:1.9},
  frost: {size:1.7,length:10,width:.5,spin:-1.1,lift:.7},
  lightning: {size:1.65,length:13,width:.38,spin:4.5,lift:2.8},
  stone: {size:2.15,length:4.5,width:1.1,spin:.8,lift:.55},
  wind: {size:2.05,length:9,width:1.15,spin:-2.1,lift:4},
  toxic: {size:2,length:6,width:1.1,spin:1.2,lift:1.35},
};
interface Burst {root:T.Group; age:number; life:number; size:number; power:number; element:string;}

export class VFXManager {
  particles:T.Points<T.BufferGeometry,T.ShaderMaterial>;
  positions=new Float32Array(MAX*3); colors=new Float32Array(MAX*3);
  life=new Float32Array(MAX); maxLife=new Float32Array(MAX); velocities=new Float32Array(MAX*3);
  sizes=new Float32Array(MAX); opacity=new Float32Array(MAX); angles=new Float32Array(MAX);
  gravity=new Float32Array(MAX); cursor=0; shake=0; activeParticles=0;
  bursts:Burst[]=[]; textures=new Map<string,T.Texture>();

  constructor(private scene:T.Scene) {
    const geometry=new T.BufferGeometry();
    geometry.setAttribute('position',new T.BufferAttribute(this.positions,3));
    geometry.setAttribute('color',new T.BufferAttribute(this.colors,3));
    geometry.setAttribute('aSize',new T.BufferAttribute(this.sizes,1));
    geometry.setAttribute('aOpacity',new T.BufferAttribute(this.opacity,1));
    geometry.setAttribute('aAngle',new T.BufferAttribute(this.angles,1));
    const material=new T.ShaderMaterial({
      uniforms:{uMap:{value:null},uScale:{value:360}},
      vertexShader:`attribute vec3 color; attribute float aSize; attribute float aOpacity; attribute float aAngle;
        varying vec3 vColor; varying float vOpacity; varying float vAngle; uniform float uScale;
        void main(){vec4 p=modelViewMatrix*vec4(position,1.0);vColor=color;vOpacity=aOpacity;vAngle=aAngle;
        gl_PointSize=clamp(aSize*uScale/max(1.0,-p.z),1.0,48.0);gl_Position=projectionMatrix*p;}`,
      fragmentShader:`uniform sampler2D uMap; varying vec3 vColor; varying float vOpacity; varying float vAngle;
        void main(){vec2 uv=gl_PointCoord-.5;float c=cos(vAngle),s=sin(vAngle);uv=mat2(c,-s,s,c)*uv+.5;
        vec4 tex=texture2D(uMap,uv);gl_FragColor=vec4(tex.rgb*vColor,tex.a*vOpacity);
        #include <colorspace_fragment>
        }`,
      transparent:true,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false,
    });
    this.particles=new T.Points(geometry,material);this.particles.frustumCulled=false;
    for(let i=0;i<MAX;i++)this.positions[i*3+1]=-999;
    scene.add(this.particles);
  }
  configure(textures:Map<string,T.Texture>) {this.textures=textures;this.particles.material.uniforms.uMap.value=textures.get('magic-spark');}
  resize(height:number) {this.particles.material.uniforms.uScale.value=height*.5;}
  element(e:string):Element {return e==='lava'||e==='firestorm'?'fire':e==='poisonstorm'?'toxic':e==='steam'?'frost':e in SPELLS?e as Element:'wind';}
  color(e:string) {return e==='danger'?0xff493d:SPELLS[this.element(e)].color;}
  map(e:string,kind='core') {return this.textures.get(e==='danger'?'magic-sigil-neutral':`magic-${kind}-${this.element(e)}`)!;}

  emit(pos:T.Vector3,e:string,count=12,speed=5) {
    const element=this.element(e),color=new T.Color(this.color(e)).multiplyScalar(1.7);
    for(let n=0;n<count;n++){
      const i=this.cursor++%MAX,angle=Math.random()*Math.PI*2;
      this.life[i]=this.maxLife[i]=element==='lightning'?.18+Math.random()*.35:.35+Math.random()*.75;
      this.positions[i*3]=pos.x;this.positions[i*3+1]=pos.y;this.positions[i*3+2]=pos.z;
      const radial=speed*(.25+Math.random()*.55);
      this.velocities[i*3]=Math.cos(angle)*radial;this.velocities[i*3+2]=Math.sin(angle)*radial;
      this.velocities[i*3+1]=(Math.random()-.1)*speed*(element==='toxic'?.35:1);
      this.gravity[i]=element==='stone'?9:element==='fire'?-1.4:element==='wind'?-2:1.2;
      this.sizes[i]=(.16+Math.random()*.38)*(element==='toxic'?1.4:1);
      this.angles[i]=angle;this.opacity[i]=1;
      this.colors[i*3]=color.r;this.colors[i*3+1]=color.g;this.colors[i*3+2]=color.b;
    }
  }
  orb(e:string,size:number,opacity=.9) {
    const sprite=new T.Sprite(new T.SpriteMaterial({map:this.map(e),color:new T.Color().setScalar(1.3),
      transparent:true,opacity,blending:T.NormalBlending,depthWrite:false,toneMapped:false}));
    sprite.scale.setScalar(size);return sprite;
  }
  setOrbElement(sprite:T.Sprite,e:string) {sprite.material.map=this.map(e);sprite.material.color.setScalar(1.3);}
  ring(e:string,radius:number,opacity=.65) {
    const material=new T.MeshBasicMaterial({map:this.map(e,'sigil'),color:e==='danger'?new T.Color(this.color(e)).multiplyScalar(1.65):new T.Color().setScalar(1.2),
      side:T.DoubleSide,transparent:true,opacity,depthWrite:false,blending:T.NormalBlending,toneMapped:false});
    const mesh=new T.Mesh(new T.PlaneGeometry(2,2),material);mesh.rotation.x=-Math.PI/2;mesh.scale.setScalar(radius);return mesh;
  }
  private surface(e:string,radius:number,opacity:number) {
    const mesh=new T.Mesh(new T.PlaneGeometry(2,2),new T.MeshBasicMaterial({map:this.map(e),
      color:new T.Color().setScalar(1.1),side:T.DoubleSide,transparent:true,opacity,
      depthWrite:false,blending:T.AdditiveBlending,toneMapped:false}));
    mesh.rotation.x=-Math.PI/2;mesh.scale.setScalar(radius);return mesh;
  }
  projectile(p:Projectile) {
    const root=new T.Group(),profile=profiles[p.element],size=profile.size*(p.heavy?1.8:1);
    root.add(this.orb(p.element,size));
    const corona=new T.Sprite(new T.SpriteMaterial({map:this.map(p.element,'sigil'),color:new T.Color().setScalar(1.15),
      transparent:true,opacity:.45,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}));
    corona.scale.setScalar(size*1.2);root.add(corona);
    const geometry=new T.BufferGeometry(),positions=new Float32Array((TRAIL_SEGMENTS+1)*6),uvs:number[]=[],indices:number[]=[];
    for(let i=0;i<=TRAIL_SEGMENTS;i++){uvs.push(1-i/TRAIL_SEGMENTS,0,1-i/TRAIL_SEGMENTS,1);if(i<TRAIL_SEGMENTS){const j=i*2;indices.push(j,j+1,j+2,j+1,j+3,j+2);}}
    geometry.setAttribute('position',new T.BufferAttribute(positions,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));geometry.setIndex(indices);
    const trail=new T.Mesh(geometry,new T.MeshBasicMaterial({map:this.textures.get('magic-trail'),
      color:new T.Color(this.color(p.element)).multiplyScalar(1.7),side:T.DoubleSide,transparent:true,
      opacity:.8,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false}));
    trail.frustumCulled=false;root.add(trail);root.userData.history=[];root.userData.size=size;
    return root;
  }
  animateProjectile(root:T.Object3D,p:Projectile,time:number,camera:T.Camera,dt:number) {
    const profile=profiles[p.element],size=root.userData.size;
    const core=root.children[0] as T.Sprite,corona=root.children[1] as T.Sprite;
    core.material.rotation=time*profile.spin;core.scale.setScalar(size*(1+.07*Math.sin(time*17+p.id)));
    corona.material.rotation=-time*profile.spin*.6;corona.material.opacity=.3+.12*Math.sin(time*11+p.id);
    const history=root.userData.history as T.Vector3[];
    if(!history.length||history[0].distanceToSquared(p.pos)>.0025)history.unshift(p.pos.clone());
    history.splice(24);
    const maxLength=profile.length*(p.heavy?1.35:1);let length=0;
    for(let i=1;i<history.length;i++){const distance=history[i-1].distanceTo(history[i]);
      if(length+distance>maxLength){history[i].lerpVectors(history[i-1],history[i],(maxLength-length)/distance);history.length=i+1;break;}length+=distance;}
    const trail=root.children[2] as T.Mesh<T.BufferGeometry,T.MeshBasicMaterial>;trail.visible=history.length>1;
    if(history.length>1){
      const distances=[0];for(let i=1;i<history.length;i++)distances.push(distances[i-1]+history[i-1].distanceTo(history[i]));
      const total=distances.at(-1)!,positions=trail.geometry.attributes.position as T.BufferAttribute;
      let segment=1;
      for(let i=0;i<=TRAIL_SEGMENTS;i++){
        const distance=total*i/TRAIL_SEGMENTS;while(segment<history.length-1&&distances[segment]<distance)segment++;
        const start=history[segment-1],end=history[segment],amount=(distance-distances[segment-1])/Math.max(.001,distances[segment]-distances[segment-1]);
        const center=start.clone().lerp(end,amount),tangent=start.clone().sub(end).normalize();
        const side=tangent.cross(camera.position.clone().sub(center)).normalize();
        if(side.lengthSq()<.01)side.set(1,0,0);
        side.multiplyScalar(profile.width*(p.heavy?1.5:1)*(.9-.55*i/TRAIL_SEGMENTS));
        const a=center.clone().add(side).sub(p.pos),b=center.clone().sub(side).sub(p.pos);
        positions.setXYZ(i*2,a.x,a.y,a.z);positions.setXYZ(i*2+1,b.x,b.y,b.z);
      }
      positions.needsUpdate=true;
    }
    if(dt>0)this.emit(p.pos,p.element,Math.max(1,Math.round(dt*55)),1.2);
  }
  zone(zone:Zone) {
    const root=new T.Group();root.add(this.ring(zone.owner==='enemy'?'danger':zone.element,zone.radius,.7));
    root.add(this.ring(zone.element,zone.radius*.82,.42));
    root.add(this.surface(zone.element,zone.radius*.85,.1));
    const halo=new T.Sprite(new T.SpriteMaterial({map:this.map(zone.element,'sigil'),color:new T.Color().setScalar(1.25),
      transparent:true,opacity:.22,depthWrite:false,blending:T.NormalBlending,toneMapped:false}));
    halo.scale.setScalar(Math.min(8,zone.radius*1.45));root.add(halo);
    for(let i=0;i<5;i++)root.add(this.orb(zone.element,Math.min(3,zone.radius*.4),.24));
    return root;
  }
  animateZone(root:T.Object3D,zone:Zone,time:number,dt:number,quality:boolean) {
    const element=this.element(zone.element),profile=profiles[element],fade=Math.min(1,zone.life);
    (root.children[0] as T.Mesh).rotation.z=time*profile.spin*.15;
    (root.children[1] as T.Mesh).rotation.z=-time*profile.spin*.22;
    root.children[1].position.y=.035;root.children[2].position.y=.02;
    (root.children[0] as T.Mesh<T.BufferGeometry,T.MeshBasicMaterial>).material.opacity=.7*fade;
    (root.children[1] as T.Mesh<T.BufferGeometry,T.MeshBasicMaterial>).material.opacity=.42*fade;
    const halo=root.children[3] as T.Sprite;halo.position.y=1.3+profile.lift*.45;
    halo.material.rotation=time*profile.spin*.35;halo.material.opacity=(zone.owner==='player'?.23:.13)*fade;
    halo.visible=quality&&zone.radius>=4;
    for(let i=0;i<5;i++){
      const sprite=root.children[i+4] as T.Sprite,angle=i*Math.PI*2/5+time*profile.spin*.25;
      const storm=zone.element.includes('storm')||element==='wind';
      sprite.position.set(Math.sin(angle)*zone.radius*.55,storm?1+(time*2+i*2)%9:.3+(1+Math.sin(time*2+i))*profile.lift*.45,Math.cos(angle)*zone.radius*.55);
      sprite.scale.setScalar(Math.min(3.8,zone.radius*.38)*(1+.15*Math.sin(time*3+i)));
      sprite.material.rotation=angle;sprite.material.opacity=(storm?.18:.26)*fade;
      sprite.visible=quality||i<2;
    }
    if(dt>0&&Math.random()<Math.min(1,dt*12)){
      const angle=Math.random()*Math.PI*2;this.emit(zone.pos.clone().add(V(Math.sin(angle)*zone.radius*.8,.5,Math.cos(angle)*zone.radius*.8)),element,2,2.5);
    }
  }
  event(event:GameEvent) {
    if(event.type==='hit'&&!event.pos)this.shake=Math.max(this.shake,.08);
    if(!event.pos)return;
    const size=event.size||1,element=event.element||'wind';
    const show=event.type==='burst'||event.type==='death'||event.type==='cast'||event.type==='dodge'||(event.type==='combo'&&size>=5)||event.type==='phase';
    if(!show)return;
    this.emit(event.pos,element,Math.min(100,Math.round(size*(event.type==='cast'?4:9))),Math.min(18,size*2));
    if(event.type==='cast'&&size<2)return;
    const root=new T.Group(),impactSize=Math.max(.8,Math.min(9,size*(event.type==='death'?1.1:.75)));
    root.position.copy(event.pos);root.add(this.orb(element,impactSize,.85));root.add(this.orb(element,impactSize*.65,.45));
    const ring=this.ring(element,impactSize*.65,.7);ring.position.y=.08;root.add(ring);
    this.scene.add(root);this.bursts.push({root,age:0,life:event.type==='phase'?1.5:event.type==='death'?1:.65,size:impactSize,power:size,element});
    if(this.bursts.length>32)this.disposeObject(this.bursts.shift()!.root);
    if(event.type==='combo'||event.type==='death')this.shake=Math.max(this.shake,.1);
  }
  update(dt:number) {
    this.shake*=Math.exp(-12*dt);this.activeParticles=0;
    for(let i=0;i<MAX;i++){
      this.life[i]-=dt;
      if(this.life[i]>0){this.activeParticles++;this.velocities[i*3+1]-=this.gravity[i]*dt;
        for(let axis=0;axis<3;axis++)this.positions[i*3+axis]+=this.velocities[i*3+axis]*dt;
        this.opacity[i]=Math.pow(this.life[i]/this.maxLife[i],1.5);
      }else{this.positions[i*3+1]=-999;this.opacity[i]=0;}
    }
    for(const attr of Object.values(this.particles.geometry.attributes))attr.needsUpdate=true;
    for(const burst of this.bursts){
      burst.age+=dt;const t=burst.age/burst.life,fade=Math.pow(Math.max(0,1-t),1.6);
      const core=burst.root.children[0] as T.Sprite,echo=burst.root.children[1] as T.Sprite,ring=burst.root.children[2] as T.Mesh<T.BufferGeometry,T.MeshBasicMaterial>;
      core.scale.setScalar(burst.size*(.75+t*.6));core.material.opacity=.85*fade;core.material.rotation+=dt*.8;
      echo.scale.setScalar(burst.size*(.5+t*1.7));echo.material.opacity=.35*fade;echo.material.rotation-=dt*1.4;
      ring.scale.setScalar(burst.size*(.65+t*1.6));ring.material.opacity=.65*fade;ring.rotation.z+=dt;
      if(t>=1)this.disposeObject(burst.root);
    }
    this.bursts=this.bursts.filter(b=>b.age<b.life);
  }
  clear() {for(const burst of this.bursts)this.disposeObject(burst.root);this.bursts=[];this.life.fill(0);this.opacity.fill(0);for(let i=0;i<MAX;i++)this.positions[i*3+1]=-999;this.shake=0;}
  disposeObject(object:T.Object3D) {
    object.traverse(node=>{if(node instanceof T.Mesh){node.geometry.dispose();for(const material of Array.isArray(node.material)?node.material:[node.material])material.dispose();}else if(node instanceof T.Sprite)node.material.dispose();});
    this.scene.remove(object);
  }
}
