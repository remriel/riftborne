import type {Element} from './config';
export interface Interaction {name:string;multiplier:number;zone?:'steam'|'lava'|'firestorm'|'poisonstorm';force?:number;}
// Symmetric, data-driven registry. Both projectiles and persistent world zones use it.
export class ElementInteractionSystem {
 private rules=new Map<string,Interaction>();
 constructor(){
  this.register('fire','toxic',{name:'COMBUSTION',multiplier:2.5,force:12});
  this.register('fire','frost',{name:'THERMAL SHOCK',multiplier:1.8,zone:'steam'});
  this.register('frost','lightning',{name:'SUPERCONDUCT',multiplier:2.2});
  this.register('wind','fire',{name:'FIRESTORM',multiplier:1.6,zone:'firestorm',force:8});
  this.register('wind','toxic',{name:'VENOM CYCLONE',multiplier:1.6,zone:'poisonstorm',force:6});
  this.register('stone','lightning',{name:'CONDUIT',multiplier:1.8});
  this.register('stone','fire',{name:'MOLTEN FAULT',multiplier:1.65,zone:'lava'});
  this.register('frost','stone',{name:'SHATTER',multiplier:2.4,force:10});
  this.register('frost','wind',{name:'WHITEOUT',multiplier:1.5});
  this.register('lightning','toxic',{name:'ION BURST',multiplier:1.6});
  this.register('fire','lightning',{name:'PLASMA',multiplier:1.45});
  this.register('frost','toxic',{name:'BRITTLE VENOM',multiplier:1.55});
  this.register('stone','wind',{name:'SANDSTORM',multiplier:1.5,force:12});
  this.register('stone','toxic',{name:'CORROSION',multiplier:1.8});
  this.register('lightning','wind',{name:'THUNDERHEAD',multiplier:1.5});
 }
 private key(a:Element,b:Element){return [a,b].sort().join(':');}
 register(a:Element,b:Element,rule:Interaction){this.rules.set(this.key(a,b),rule);}
 resolve(a:Element,b:Element){return this.rules.get(this.key(a,b));}
}
