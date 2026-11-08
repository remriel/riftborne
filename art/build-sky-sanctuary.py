"""Build a floating ruined sanctuary from the project's licensed stone modules.

Run after bake-arena-stone.py. The authored .blend remains editable; the GLB
is the compact runtime asset. No original licensed mesh is overwritten.
"""
import bpy
import bmesh
import math
from pathlib import Path
from mathutils import Vector, noise

root = Path(args['root']).resolve() if 'args' in globals() and args.get('root') else Path(__file__).resolve().parent.parent
bakes = root / 'output' / 'arena-stone-bake'
for name in ('arena-stone-albedo.png', 'arena-stone-normal.png', 'arena-stone-roughness.png'):
    if not (bakes / name).is_file():
        raise RuntimeError(f'Run the stone bake first: missing {name}')

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.name = 'Riftborne Sky Sanctuary'

stone = bpy.data.materials.new('Sanctuary stone PBR')
stone.use_nodes = True
nodes, links = stone.node_tree.nodes, stone.node_tree.links
shader = next(n for n in nodes if n.type == 'BSDF_PRINCIPLED')
shader.inputs['Metallic'].default_value = 0
shader.inputs['Roughness'].default_value = .85

def image_node(name, colorspace):
    image = bpy.data.images.load(str(bakes / f'arena-stone-{name}.png'), check_existing=True)
    image.colorspace_settings.name = colorspace
    texture = nodes.new('ShaderNodeTexImage')
    texture.label = f'Stone {name}'
    texture.image = image
    texture.extension = 'REPEAT'
    return texture

albedo = image_node('albedo', 'sRGB')
normal = image_node('normal', 'Non-Color')
roughness = image_node('roughness', 'Non-Color')
normal_node = nodes.new('ShaderNodeNormalMap')
normal_node.inputs['Strength'].default_value = .6
links.new(albedo.outputs['Color'], shader.inputs['Base Color'])
links.new(normal.outputs['Color'], normal_node.inputs['Color'])
links.new(normal_node.outputs['Normal'], shader.inputs['Normal'])
links.new(roughness.outputs['Color'], shader.inputs['Roughness'])

def module(asset, name, location, dimensions, yaw=0, tilt=0):
    """Import an existing finished module and fit its bounds to authored meters."""
    before = set(scene.objects)
    bpy.ops.import_scene.gltf(filepath=str(root / 'public' / 'assets' / f'{asset}_finished.glb'))
    meshes = [o for o in scene.objects if o not in before and o.type == 'MESH']
    if len(meshes) != 1:
        raise RuntimeError(f'{asset}: expected one mesh, found {len(meshes)}')
    obj = meshes[0]
    obj.name = name
    bpy.context.view_layer.update()
    obj.scale = tuple(obj.scale[i] * dimensions[i] / obj.dimensions[i] for i in range(3))
    obj.rotation_euler.z = yaw
    obj.rotation_euler.x = tilt
    bpy.context.view_layer.update()
    bounds = [obj.matrix_world @ Vector(corner) for corner in obj.bound_box]
    obj.location.x += location[0] - (min(v.x for v in bounds) + max(v.x for v in bounds)) / 2
    obj.location.y += location[1] - (min(v.y for v in bounds) + max(v.y for v in bounds)) / 2
    obj.location.z += location[2] - min(v.z for v in bounds)
    obj.data.materials.clear()
    obj.data.materials.append(stone)
    for face in obj.data.polygons:
        face.material_index = 0
    return obj

def sculpted_cliff(name, center, radii, seed):
    """Sculpt a fractured rock silhouette; the source sphere is not shipped."""
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=3, radius=1.0)
    for vertex in bm.verts:
        p = vertex.co.copy()
        broad = noise.noise_vector(p * 3.4 + Vector((seed, seed * .73, seed * 1.31))).x
        detail = noise.noise_vector(p * 8.1 + Vector((seed * .4, seed, 0))).z
        factor = 1 + .16 * broad + .055 * detail
        vertex.co = (p.x * radii[0] * factor, p.y * radii[1] * factor,
                     min(.86, p.z * factor) * radii[2])
    bm.to_mesh(mesh)
    bm.free()
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    scene.collection.objects.link(obj)
    obj.location = center
    mesh.materials.append(stone)
    uv = mesh.uv_layers.new(name='UVMap')
    for face in mesh.polygons:
        axis = max(range(3), key=lambda i: abs(face.normal[i]))
        dims = [i for i in range(3) if i != axis]
        for loop_id in face.loop_indices:
            co = mesh.vertices[mesh.loops[loop_id].vertex_index].co
            uv.data[loop_id].uv = (co[dims[0]] / 4, co[dims[1]] / 4)
    return obj

pieces = [
    sculpted_cliff('Sculpted suspended cliff', (0, 0, -3.8), (9.5, 7.5, 4.4), 3.1),
    sculpted_cliff('Sculpted west outcrop', (-6.3, 1, -3.9), (4.6, 4.2, 3.4), 6.2),
    sculpted_cliff('Sculpted east outcrop', (6.1, -.3, -3.6), (4.5, 3.8, 3.3), 9.3),
    module('floor_tile_large', 'Fractured sanctuary terrace west', (-3.9, 0, 0), (7.8, 9, .22)),
    module('floor_tile_large', 'Fractured sanctuary terrace east', (3.9, 0, 0), (7.8, 9, .22), math.pi / 2),
    module('wall_arched', 'Great gate', (0, -2.1, .12), (9, 2.2, 9)),
    module('pillar_decorated', 'West gate pier', (-5.5, -2.1, .12), (3.2, 3.2, 12.5)),
    module('pillar_decorated', 'East gate pier', (5.5, -2.1, .12), (3.2, 3.2, 11.4)),
    module('wall_broken', 'West broken parapet', (-6.8, 3.5, .15), (5.8, 1.8, 5.8), -.19),
    module('wall_broken', 'East broken parapet', (6.6, 3.4, .15), (5.6, 1.8, 6.5), .16),
    module('wall_arched', 'Rear arch', (0, 4.3, .12), (7.8, 1.8, 7.4)),
    module('pillar_decorated', 'Rear spire', (-7.5, 4.0, .12), (2.3, 2.4, 8.6), .3),
    module('column', 'Broken crown west', (-5.6, -2.1, 12.4), (2.0, 2.0, 3.2), .2, .15),
    module('column', 'Broken crown east', (5.5, -2.1, 11.3), (1.8, 1.8, 2.5), -.4, -.18),
    module('wall_broken', 'Levitating broken cornice', (10.9, -1, 4), (4.6, 1.5, 3.3), -.38, .24),
    sculpted_cliff('Drifting island shard', (-11.4, 1.8, -2.8), (2.4, 2.1, 1.8), 12.1),
]

# Join the authored composition into a single runtime draw surface.
bpy.ops.object.select_all(action='DESELECT')
for piece in pieces:
    piece.select_set(True)
bpy.context.view_layer.objects.active = pieces[0]
bpy.ops.object.join()
sanctuary = bpy.context.object
sanctuary.name = 'Sky Sanctuary | weathered stone'
bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)

out = root / 'public' / 'assets' / 'sky-sanctuary.glb'
bpy.ops.export_scene.gltf(filepath=str(out), export_format='GLB', use_selection=True,
                          export_cameras=False, export_lights=False, export_animations=False,
                          export_yup=True, export_tangents=True)

# Studio light rig is saved only in the editable workshop, never in the game GLB.
scene.world = bpy.data.worlds.new('Sanctuary preview world')
scene.world.color = (.075, .09, .12)
scene.render.engine = 'BLENDER_EEVEE'
scene.render.resolution_x = 1100
scene.render.resolution_y = 900
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.filepath = str(root / 'output' / 'sky-sanctuary-preview.png')
bpy.ops.object.camera_add(location=(30, -38, 22))
camera = bpy.context.object
camera.name = 'Asset review camera'
camera.rotation_euler = (Vector((0, 0, 3)) - camera.location).to_track_quat('-Z', 'Y').to_euler()
camera.data.type = 'ORTHO'
camera.data.ortho_scale = 35
scene.camera = camera
for name, location, color, energy, size in [
    ('Warm key', (5, -20, 28), (1.0, .78, .58), 3500, 18),
    ('Cool rim', (-18, 8, 18), (.46, .70, 1.0), 2800, 15),
    ('Soft fill', (15, 12, 5), (.68, .82, 1.0), 1000, 12),
]:
    bpy.ops.object.light_add(type='AREA', location=location)
    light = bpy.context.object
    light.name = name
    light.data.color = color
    light.data.energy = energy
    light.data.shape = 'DISK'
    light.data.size = size
    light.rotation_euler = (Vector((0, 0, 3)) - light.location).to_track_quat('-Z', 'Y').to_euler()
for image in bpy.data.images:
    if image.source == 'FILE' and image.has_data:
        image.pack()
bpy.ops.wm.save_as_mainfile(filepath=str(root / 'art' / 'sky-sanctuary.blend'))
print(f'Authored {len(pieces)} licensed modules into {out}; polygons={len(sanctuary.data.polygons)}')
