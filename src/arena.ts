// Arena topology is shared by Rapier and the Three.js world adapter.
// Platform tuples are x, z, width, depth, and walkable top height.
export type PlatformSpec = readonly [number, number, number, number, number];
export interface RuinSpec {
  asset: 'wall_arched' | 'wall_broken' | 'pillar_decorated' | 'stairs_wide';
  x: number;
  z: number;
  yaw: number;
  width: number;
  height: number;
  depth: number;
}
export interface ArenaLayout {
  platforms: readonly PlatformSpec[];
  ruins: readonly RuinSpec[];
  fragments: {count: number; radius: number; step: number};
}

const wall = (x: number, z: number, yaw: number, arch = false, height = 11): RuinSpec =>
  ({asset: arch ? 'wall_arched' : 'wall_broken', x, z, yaw, width: 10, height, depth: 2.5});
const pillar = (x: number, z: number, height = 13): RuinSpec =>
  ({asset: 'pillar_decorated', x, z, yaw: 0, width: 2.6, height, depth: 2.6});
const stairs = (x: number, z: number, yaw: number): RuinSpec =>
  ({asset: 'stairs_wide', x, z, yaw, width: 6, height: 5, depth: 10});
const ring = (count: number, radius: number, offset: number, archEvery: number, height: number): RuinSpec[] =>
  Array.from({length: count}, (_, i) => {
    const angle = offset + i * Math.PI * 2 / count;
    return wall(Math.sin(angle) * radius, Math.cos(angle) * radius, -angle, i % archEvery === 0, height);
  });

export const ARENAS: readonly ArenaLayout[] = [
  // Sundered Gardens: a broken crescent with a clear first-duel corridor.
  {
    platforms: [
      [0, -34, 12, 12, 3], [24, -24, 12, 12, 4.8], [34, 0, 12, 12, 6.6],
      [24, 24, 12, 12, 3], [0, 34, 12, 12, 4.8], [-24, 24, 12, 12, 6.6],
      [-34, 0, 12, 12, 3], [-24, -24, 12, 12, 4.8], [-18, 15, 6, 6, 2], [18, 15, 6, 6, 2],
    ],
    ruins: [
      ...ring(10, 40, .12, 3, 11),
      pillar(-38, -19), pillar(38, -19), pillar(-38, 19), pillar(38, 19),
      stairs(-31, 0, -Math.PI / 2), stairs(31, 0, Math.PI / 2), stairs(0, 31, 0),
    ],
    fragments: {count: 12, radius: 74, step: 23},
  },
  // Cinderwatch Fortress: long side battlements and two opposed gates.
  {
    platforms: [
      [-33, -27, 10, 13, 5], [-33, 0, 10, 18, 4], [-33, 27, 10, 13, 5],
      [33, -27, 10, 13, 5], [33, 0, 10, 18, 4], [33, 27, 10, 13, 5],
      [0, -36, 18, 8, 4], [0, 36, 18, 8, 4],
    ],
    ruins: [
      ...[-26, -13, 13, 26].flatMap(x => [wall(x, -40, 0, false, 15), wall(x, 40, Math.PI, false, 15)]),
      wall(-40, 0, Math.PI / 2, true, 16), wall(40, 0, -Math.PI / 2, true, 16),
      pillar(-40, -38, 18), pillar(40, -38, 18), pillar(-40, 38, 18), pillar(40, 38, 18),
      stairs(-31, -13, -Math.PI / 2), stairs(31, 13, Math.PI / 2),
    ],
    fragments: {count: 8, radius: 82, step: 29},
  },
  // Glass Peaks: staggered, rising ledges create a diagonal aerial route.
  {
    platforms: [
      [-34, -29, 11, 10, 3], [-25, -17, 9, 9, 5], [-35, 3, 12, 11, 7],
      [-23, 28, 11, 10, 4], [-8, 36, 9, 9, 6], [13, 34, 10, 10, 8],
      [32, 25, 11, 10, 5], [35, -5, 12, 11, 7], [22, -29, 10, 10, 4],
    ],
    ruins: [
      ...ring(7, 41, .28, 7, 14),
      pillar(-36, -8, 19), pillar(-27, 36, 17), pillar(16, 40, 20), pillar(39, 14, 18),
      stairs(-28, 23, -.8), stairs(28, -22, 2.3),
    ],
    fragments: {count: 15, radius: 69, step: 19},
  },
  // Hollow Marsh: low, scattered islets leave broad hazardous waterlike lanes.
  {
    platforms: [
      [-31, -30, 11, 9, 1.6], [-34, -9, 9, 12, 2.2], [-29, 18, 13, 10, 1.4],
      [-13, 35, 11, 9, 2.5], [11, 35, 11, 9, 1.5], [31, 23, 10, 11, 2.7],
      [35, 0, 10, 12, 1.7], [30, -28, 12, 9, 2.2], [10, -36, 9, 10, 1.3],
      [-12, -35, 11, 9, 2.4],
    ],
    ruins: [
      ...ring(6, 42, .31, 99, 7),
      pillar(-39, -13, 9), pillar(38, 21, 10), pillar(7, 40, 8),
      stairs(-31, 19, -.9), stairs(32, -20, 2.2),
    ],
    fragments: {count: 9, radius: 87, step: 17},
  },
  // Aether Citadel: mirrored corner plazas and inner dueling balconies.
  {
    platforms: [
      [-29, -29, 13, 13, 5.5], [29, -29, 13, 13, 5.5],
      [-29, 29, 13, 13, 5.5], [29, 29, 13, 13, 5.5],
      [0, -35, 12, 9, 3.5], [0, 35, 12, 9, 3.5],
      [-35, 0, 9, 12, 3.5], [35, 0, 9, 12, 3.5],
      [-22, 0, 7, 9, 2], [22, 0, 7, 9, 2],
    ],
    ruins: [
      ...ring(12, 41, 0, 1, 17),
      pillar(-39, -39, 21), pillar(39, -39, 21), pillar(-39, 39, 21), pillar(39, 39, 21),
      stairs(-31, 0, -Math.PI / 2), stairs(31, 0, Math.PI / 2),
      stairs(0, -31, Math.PI), stairs(0, 31, 0),
    ],
    fragments: {count: 12, radius: 78, step: 22},
  },
];

export function arenaFor(index: number): ArenaLayout {
  const arena = ARENAS[index];
  if (!arena) throw new RangeError(`Unknown arena: ${index}`);
  return arena;
}
