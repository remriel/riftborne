import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalizePreferences} from '../src/preferences.ts';
test('legacy saves retain settings and gain safe input/accessibility defaults',()=>{
 const p=normalizePreferences({volume:0,bloom:false,fov:90},true);
 assert.equal(p.volume,0);assert.equal(p.bloom,false);assert.equal(p.fov,90);
 assert.equal(p.sensitivity,1);assert.equal(p.reducedMotion,true);
});
test('corrupt persisted preferences cannot break the camera or audio',()=>{
 const p=normalizePreferences({fov:Infinity,volume:-4,sensitivity:999,difficulty:200,invertY:'false'});
 assert.equal(p.fov,75);assert.equal(p.volume,0);assert.equal(p.sensitivity,2.5);assert.equal(p.difficulty,1);assert.equal(p.invertY,false);
 assert.equal(normalizePreferences(null).fov,75);
});
