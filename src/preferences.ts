export interface Preferences {
 fov:number; volume:number; shake:boolean; bloom:boolean; difficulty:number;
 sensitivity:number; invertY:boolean; reducedMotion:boolean; performance:boolean; hints:boolean;
}
export function normalizePreferences(raw:unknown, reducedMotion=false):Preferences {
 const s=raw&&typeof raw==='object'?raw as Record<string,unknown>:{};
 const number=(key:string,fallback:number,min:number,max:number)=>typeof s[key]==='number'&&Number.isFinite(s[key])?Math.max(min,Math.min(max,s[key] as number)):fallback;
 const bool=(key:string,fallback:boolean)=>typeof s[key]==='boolean'?s[key] as boolean:fallback;
 return {fov:number('fov',75,60,100),volume:number('volume',.35,0,1),shake:bool('shake',true),bloom:bool('bloom',true),difficulty:[.6,1,1.4].includes(s.difficulty as number)?s.difficulty as number:1,
 sensitivity:number('sensitivity',1,.25,2.5),invertY:bool('invertY',false),reducedMotion:bool('reducedMotion',reducedMotion),performance:bool('performance',false),hints:bool('hints',true)};
}
