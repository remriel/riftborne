import {test} from 'node:test';
import assert from 'node:assert/strict';
import {ElementInteractionSystem} from '../src/interactions.ts';
import {ELEMENTS} from '../src/config.ts';
import {V,segmentDistance} from '../src/core.ts';
test('every distinct pair has a symmetric elemental reaction',()=>{const system=new ElementInteractionSystem();for(const a of ELEMENTS)for(const b of ELEMENTS){if(a===b)continue;assert.ok(system.resolve(a,b));assert.deepEqual(system.resolve(a,b),system.resolve(b,a));}});
test('swept projectile distance includes high-speed crossing and clamps endpoints',()=>{assert.equal(segmentDistance(V(-20,0,0),V(20,0,0),V(0,1,0)),1);assert.equal(segmentDistance(V(),V(2,0,0),V(5,0,0)),3);});
