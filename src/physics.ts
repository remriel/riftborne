import RAPIER from '@dimforge/rapier3d-compat';
import {V} from './core';
import type {Vector3} from 'three';
export interface Platform {pos:Vector3;size:Vector3;}
export class ArenaPhysics {
 world!:RAPIER.World; controller!:RAPIER.KinematicCharacterController;body!:RAPIER.RigidBody;collider!:RAPIER.Collider;
 platforms:Platform[]=[]; propColliders=new Map<number,RAPIER.Collider>();
 async init(){await RAPIER.init();this.reset();}
 reset(){
  this.world?.free(); this.world=new RAPIER.World({x:0,y:-26,z:0});this.world.timestep=1/60;this.platforms=[];this.propColliders.clear();
  this.box(V(0,-2,0),V(96,4,96));
  // Raised traversal islands around an unobstructed central dueling floor.
  for(let i=0;i<8;i++){const a=i*Math.PI/4;this.box(V(Math.sin(a)*34,1.5+(i%3)*1.8,Math.cos(a)*34),V(12,3+(i%3)*3.6,12));}
  for(let i=0;i<4;i++){const a=i*Math.PI/2+.5;this.box(V(Math.sin(a)*23,1,Math.cos(a)*23),V(6,2,6));}
  this.body=this.world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(0,1.1,16));
  this.collider=this.world.createCollider(RAPIER.ColliderDesc.capsule(.6,.45),this.body);
  this.controller=this.world.createCharacterController(.03);this.controller.setSlideEnabled(true);this.controller.enableAutostep(.65,.3,true);this.controller.enableSnapToGround(.35);this.controller.setMaxSlopeClimbAngle(Math.PI*.3);
 }
 box(pos:Vector3,size:Vector3){this.platforms.push({pos,size});return this.world.createCollider(RAPIER.ColliderDesc.cuboid(size.x/2,size.y/2,size.z/2).setTranslation(pos.x,pos.y,pos.z));}
 addProp(id:number,pos:Vector3,r:number,height:number){const c=this.world.createCollider(RAPIER.ColliderDesc.cuboid(r,height/2,r).setTranslation(pos.x,pos.y+height/2,pos.z));this.propColliders.set(id,c);}
 removeProp(id:number){const c=this.propColliders.get(id);if(c){this.world.removeCollider(c,true);this.propColliders.delete(id);}}
 move(pos:Vector3,delta:Vector3){this.body.setTranslation(pos,true);this.controller.computeColliderMovement(this.collider,delta);const d=this.controller.computedMovement();const next=pos.clone().add(V(d.x,d.y,d.z));this.body.setNextKinematicTranslation(next);this.world.step();return {pos:next,grounded:this.controller.computedGrounded()};}
 teleport(pos:Vector3){this.body.setTranslation(pos,true);this.body.setNextKinematicTranslation(pos);}
 ray(origin:Vector3,direction:Vector3,max:number){return this.world.castRay(new RAPIER.Ray(origin,direction),max,true,undefined,undefined,this.collider);}
 floor(x:number,z:number){let y=-20;for(const p of this.platforms){if(Math.abs(x-p.pos.x)<p.size.x/2&&Math.abs(z-p.pos.z)<p.size.z/2)y=Math.max(y,p.pos.y+p.size.y/2);}return y;}
}

