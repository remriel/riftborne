export const ELEMENTS = ['fire','frost','lightning','stone','wind','toxic'] as const;
export type Element = typeof ELEMENTS[number];
export const SPELLS: Record<Element, {color:number; speed:number; damage:number; rate:number; gravity:number; splash:number; cooldown:number; name:string; passive:string}> = {
 fire:{color:0xff773e,speed:45,damage:28,rate:.23,gravity:0,splash:2.7,cooldown:8,name:'Flameburst',passive:'Ignites enemies and surfaces'},
 frost:{color:0x6fe9ff,speed:72,damage:48,rate:.65,gravity:0,splash:.8,cooldown:10,name:'Flash freeze',passive:'Chill stacks freeze enemies'},
 lightning:{color:0xc3a0ff,speed:130,damage:24,rate:.22,gravity:0,splash:.6,cooldown:9,name:'Stormcall',passive:'Chains to nearby targets'},
 stone:{color:0xf2bd79,speed:32,damage:80,rate:.9,gravity:9,splash:3.8,cooldown:11,name:'Earthshatter',passive:'Breaks armor; shatters frozen targets'},
 wind:{color:0xa6ffe7,speed:55,damage:26,rate:.33,gravity:0,splash:1.5,cooldown:9,name:'Cyclone',passive:'Improves lift and air steering'},
 toxic:{color:0xb4f869,speed:37,damage:22,rate:.37,gravity:3,splash:2.8,cooldown:9,name:'Miasma',passive:'Poisons; fire detonates clouds'},
};
export const BOSSES = [
 {name:'THE PYRE TITAN',title:'Heart of the broken mountain',biome:'THE SUNDERED GARDENS',asset:'titan',element:'fire',height:10,radius:3.4,hp:7200,color:0xff8452,sky:0xc8b2bb,fog:0xc4b3b8,ground:0x697c68,attacks:['salvo','ring','meteor','charge','pool'],tip:'Chill the Titan, then strike with fire. Jump over magma waves.',phases:3},
 {name:'THE TEMPEST WYRM',title:'Sovereign of the storm',biome:'CINDERWATCH FORTRESS',asset:'wyrm',element:'lightning',height:8,radius:3.2,hp:8300,color:0xc5a1ff,sky:0x9587b1,fog:0x9b849b,ground:0x61545b,attacks:['breath','cyclone','dive','storm','wall'],tip:'Ride the marked wind currents to meet the Wyrm in the sky.',phases:3},
 {name:'THE FROST COLOSSUS',title:'The last keeper of winter',biome:'THE GLASS PEAKS',asset:'colossus',element:'frost',height:11,radius:3.4,hp:9500,color:0x7de4ff,sky:0xafcdda,fog:0xb9d5e0,ground:0xb1cacf,attacks:['beam','spikes','blizzard','charge','wall'],tip:'Fire breaks ice armor. Stone shatters frozen weak points.',phases:3},
 {name:'THE PLAGUE ORACLE',title:'A thousand voices, one poison',biome:'THE HOLLOW MARSH',asset:'oracle',element:'toxic',height:8,radius:2.8,hp:10200,color:0xb9ef74,sky:0x8dabb0,fog:0x92aa9c,ground:0x526b60,attacks:['pool','summon','salvo','illusion','teleport'],tip:'Turn poison clouds into firestorms. Wind clears a safe route.',phases:3},
 {name:'THE ELEMENTAL ARCHON',title:'Your equal. Your reckoning.',biome:'THE AETHER CITADEL',asset:'mage',element:'fire',height:4,radius:1.6,hp:12000,color:0xffd996,sky:0xaaa1cc,fog:0xb1a5cc,ground:0x767c98,attacks:['duel','dive','storm','cyclone','charge'],tip:'Read the gauntlets. Dodge the opening salvo, punish the recovery.',phases:4},
] as const;
export type Attack = typeof BOSSES[number]['attacks'][number];
export const UPGRADES = [
 {id:'power',name:'Resonant gauntlets',detail:'+18% damage to every spell.',kind:'GAUNTLET'},
 {id:'vitality',name:'Second heart',detail:'+35 maximum health. Fully restore health.',kind:'SURVIVAL'},
 {id:'haste',name:'Unbound rhythm',detail:'Secondary abilities recharge 20% faster.',kind:'COOLDOWN'},
 {id:'dash',name:'Slipstream',detail:'Dodge cooldown reduced by 25%.',kind:'MOVEMENT'},
 {id:'flight',name:'Featherlight',detail:'+25% levitation speed and aerial control.',kind:'MOVEMENT'},
 {id:'triple',name:'Splintercast',detail:'Fireballs split into three. Extra bolts deal 50% damage.',kind:'FIRE'},
 {id:'chain',name:'Storm conduit',detail:'Lightning chains to two additional targets.',kind:'LIGHTNING'},
 {id:'zone',name:'Event horizon',detail:'Spell zones are 30% larger.',kind:'ELEMENTAL'},
 {id:'pierce',name:'Winter needle',detail:'Ice lances penetrate enemies and gain 25% damage.',kind:'FROST'},
 {id:'fragment',name:'Faultline',detail:'Stone impacts scatter damaging fragments.',kind:'STONE'},
];
export const RUNES=['Blink','Flight','Dash','Leap','Shadow'] as const;
export type Rune=typeof RUNES[number];
