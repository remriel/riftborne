import {Vector3} from 'three';
import type {Element, Rune} from './config';
export const V=(x=0,y=0,z=0)=>new Vector3(x,y,z);
export const clamp=(x:number,a:number,b:number)=>Math.max(a,Math.min(b,x));
export const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
export function segmentDistance(a:Vector3,b:Vector3,p:Vector3){const ab=b.clone().sub(a);const t=clamp(p.clone().sub(a).dot(ab)/Math.max(.0001,ab.lengthSq()),0,1);return a.clone().addScaledVector(ab,t).distanceTo(p);}
export type Status=Partial<Record<Element,number>>;
export interface Fighter {id:number;pos:Vector3;vel:Vector3;hp:number;maxHp:number;radius:number;status:Status;hurt:number;armor:number;frozen:number;stagger:number;dead:boolean;}
export interface Player extends Fighter {yaw:number;pitch:number;grounded:boolean;jumps:number;energy:number;dodge:number;invulnerable:number;runeCD:number;runeTime:number;rune:Rune;hands:[Element,Element];primary:[number,number];secondary:[number,number];ultimate:number;dashTime:number;flight:number;}
export interface Enemy extends Fighter {kind:number;cooldown:number;angle:number;}
export interface Boss extends Fighter {index:number;phase:number;state:'approach'|'telegraph'|'attack'|'recover'|'stagger';timer:number;attack:string;target:Vector3;weak:number;action:number;}
export interface Projectile {id:number;pos:Vector3;prev:Vector3;vel:Vector3;element:Element;damage:number;radius:number;life:number;owner:'player'|'enemy';heavy:boolean;hit:Set<number>;}
export interface Zone {id:number;pos:Vector3;element:Element|'steam'|'lava'|'firestorm'|'poisonstorm';radius:number;life:number;owner:'player'|'enemy';tick:number;vel:Vector3;}
export interface Telegraph {id:number;pos:Vector3;radius:number;time:number;maxTime:number;element:Element;type:'circle'|'ring'|'line';target?:Vector3;damage:number;}
export interface Prop {id:number;pos:Vector3;hp:number;type:'barrel'|'pillar';radius:number;}
export interface Pickup {id:number;pos:Vector3;type:'health'|'power'|'charge';}
export type GameEvent={type:'burst'|'hit'|'combo'|'cast'|'dodge'|'warning'|'phase'|'death'|'victory'|'pickup';pos?:Vector3;element?:Element|string;text?:string;value?:number;size?:number;};
export interface Input {keys:Set<string>;pressed:Set<string>;buttons:Set<number>;mouseX:number;mouseY:number;}
export const emptyInput=():Input=>({keys:new Set(),pressed:new Set(),buttons:new Set(),mouseX:0,mouseY:0});
