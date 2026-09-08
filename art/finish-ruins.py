"""Run through Blender MCP with args['root']; preserve original licensed meshes."""
import bpy, os
from mathutils import Vector

root = args['root']
scene = bpy.data.scenes.new('Riftborne Ruin Workshop')
bpy.context.window.scene = scene
image = bpy.data.images.load(os.path.join(root, 'art/ruin-stone-source.png'), check_existing=True)
material = bpy.data.materials.new('Riftborne weathered sandstone')
material.use_nodes = True
nodes = material.node_tree.nodes
shader = nodes.get('Principled BSDF')
shader.inputs['Roughness'].default_value = .88
texture = nodes.new('ShaderNodeTexImage')
texture.image = image
material.node_tree.links.new(texture.outputs['Color'], shader.inputs['Base Color'])
exports = []
for name in ['pillar_decorated', 'wall_arched', 'wall_broken', 'floor_tile_large', 'floor_dirt_large_rocky', 'stairs_wide', 'column']:
    bpy.ops.object.select_all(action='DESELECT')
    before = set(scene.objects)
    bpy.ops.import_scene.gltf(filepath=os.path.join(root, 'public/assets', name + '.glb'))
    imported = [obj for obj in scene.objects if obj not in before]
    for obj in imported:
        if obj.type != 'MESH':
            continue
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        # Box projection in source units keeps a consistent material scale.
        uv = obj.data.uv_layers.active or obj.data.uv_layers.new(name='UVMap')
        for polygon in obj.data.polygons:
            axis = max(range(3), key=lambda i: abs(polygon.normal[i]))
            dims = [i for i in range(3) if i != axis]
            for loop_id in polygon.loop_indices:
                co = obj.matrix_world @ obj.data.vertices[obj.data.loops[loop_id].vertex_index].co
                uv.data[loop_id].uv = (co[dims[0]] / 3, co[dims[1]] / 3)
        obj.data.materials.clear()
        obj.data.materials.append(material)
        for polygon in obj.data.polygons:
            polygon.material_index = 0
        bevel = obj.modifiers.new('Light-catching stone edges', 'BEVEL')
        bevel.width = .018
        bevel.segments = 2
        bevel.limit_method = 'ANGLE'
        bpy.ops.object.modifier_apply(modifier=bevel.name)
        obj.select_set(False)
    for obj in imported:
        obj.select_set(True)
    path = os.path.join(root, 'public/assets', name + '_finished.glb')
    bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', use_selection=True, use_active_scene=True, export_cameras=False, export_lights=False)
    exports.append({'file': path, 'bytes': os.path.getsize(path)})
    # Keep workshop objects, but separate modules for inspection.
    for obj in imported:
        if obj.parent is None:
            obj.location.x += len(exports) * 8
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(root, 'art/ruin-workshop.blend'))
__result__ = exports
