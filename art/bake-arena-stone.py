"""Bake a seamless material set in Blender.

Run from the repository root with:
  blender -b --python art/bake-arena-stone.py -- <output-directory>

The production source is an image-generation original. The four shifted
samples are cross-faded at borders before deriving the tangent-space normal
and roughness maps, so the baked maps share the exact same UVs.
"""
import bpy
import os
import sys
from pathlib import Path

if 'args' in globals() and args.get('root'):
    root = Path(args['root']).resolve()
    output = Path(args['output']).resolve() if args.get('output') else root / 'output' / 'arena-stone-bake'
else:
    root = Path(__file__).resolve().parent.parent
    arguments = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    output = Path(arguments[0]).resolve() if arguments else root / 'output' / 'arena-stone-bake'
output.mkdir(parents=True, exist_ok=True)
source = root / 'art' / 'arena-stone-premium-source.png'
if not source.is_file():
    raise RuntimeError(f'Missing generated material source: {source}')

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.samples = 1
scene.cycles.use_denoising = False
scene.render.bake.margin = 0

bpy.ops.mesh.primitive_plane_add(size=2)
plane = bpy.context.object
plane.name = 'Material bake surface'
material = bpy.data.materials.new('Riftborne arena stone bake')
material.use_nodes = True
plane.data.materials.append(material)
nodes, links = material.node_tree.nodes, material.node_tree.links
nodes.clear()

def node(kind, label):
    item = nodes.new(kind)
    item.label = label
    return item

uv = node('ShaderNodeUVMap', 'UV')
uv.uv_map = plane.data.uv_layers.active.name
split = node('ShaderNodeSeparateXYZ', 'UV components')
links.new(uv.outputs['UV'], split.inputs[0])

def center_weight(coordinate):
    reverse = node('ShaderNodeMath', 'Distance from opposite edge')
    reverse.operation = 'SUBTRACT'
    reverse.inputs[0].default_value = 1
    links.new(coordinate, reverse.inputs[1])
    minimum = node('ShaderNodeMath', 'Distance from nearest edge')
    minimum.operation = 'MINIMUM'
    links.new(coordinate, minimum.inputs[0])
    links.new(reverse.outputs[0], minimum.inputs[1])
    fade = node('ShaderNodeMapRange', 'Smooth border blend')
    fade.interpolation_type = 'SMOOTHSTEP'
    fade.clamp = True
    fade.inputs['From Min'].default_value = 0
    fade.inputs['From Max'].default_value = .14
    links.new(minimum.outputs[0], fade.inputs['Value'])
    return fade.outputs['Result']

wx, wy = center_weight(split.outputs['X']), center_weight(split.outputs['Y'])
source_image = bpy.data.images.load(str(source), check_existing=True)

def sample(dx, dy):
    offset = node('ShaderNodeVectorMath', f'Shift {dx}, {dy}')
    offset.operation = 'ADD'
    links.new(uv.outputs['UV'], offset.inputs[0])
    offset.inputs[1].default_value = (dx, dy, 0)
    tex = node('ShaderNodeTexImage', 'Generated stone source')
    tex.image = source_image
    tex.extension = 'REPEAT'
    links.new(offset.outputs['Vector'], tex.inputs['Vector'])
    return tex.outputs['Color']

def mix(weight, shifted, original):
    blend = node('ShaderNodeMixRGB', 'Seam blend')
    links.new(weight, blend.inputs[0])
    links.new(shifted, blend.inputs[1])
    links.new(original, blend.inputs[2])
    return blend.outputs[0]

row_a = mix(wx, sample(.5, 0), sample(0, 0))
row_b = mix(wx, sample(.5, .5), sample(0, .5))
albedo = mix(wy, row_b, row_a)

output_node = node('ShaderNodeOutputMaterial', 'Bake output')
emission = node('ShaderNodeEmission', 'Color bake')
links.new(albedo, emission.inputs['Color'])
links.new(emission.outputs['Emission'], output_node.inputs['Surface'])

def target(name, colorspace):
    image = bpy.data.images.new(name, 1024, 1024, alpha=False)
    image.colorspace_settings.name = colorspace
    tex = node('ShaderNodeTexImage', f'Bake target: {name}')
    tex.image = image
    nodes.active = tex
    for n in nodes:
        n.select = n == tex
    return image, tex

def save_image(image, name):
    image.filepath_raw = str(output / name)
    image.file_format = 'PNG'
    image.save()

image, active = target('arena-stone-albedo', 'sRGB')
bpy.ops.object.bake(type='EMIT')
save_image(image, 'arena-stone-albedo.png')
nodes.remove(active)

grey = node('ShaderNodeRGBToBW', 'Surface height from stone luminance')
links.new(albedo, grey.inputs[0])
bump = node('ShaderNodeBump', 'Fine sculpted stone relief')
bump.inputs['Strength'].default_value = .65
bump.inputs['Distance'].default_value = .025
links.new(grey.outputs[0], bump.inputs['Height'])
shader = node('ShaderNodeBsdfPrincipled', 'Tangent-normal bake')
links.new(bump.outputs['Normal'], shader.inputs['Normal'])
links.new(shader.outputs['BSDF'], output_node.inputs['Surface'])
image, active = target('arena-stone-normal', 'Non-Color')
bpy.ops.object.bake(type='NORMAL', normal_space='TANGENT')
save_image(image, 'arena-stone-normal.png')
nodes.remove(active)

ramp = node('ShaderNodeValToRGB', 'Rough natural stone')
ramp.color_ramp.elements[0].position = .05
ramp.color_ramp.elements[0].color = (.94, .94, .94, 1)
ramp.color_ramp.elements[1].position = .65
ramp.color_ramp.elements[1].color = (.68, .68, .68, 1)
links.new(grey.outputs[0], ramp.inputs['Fac'])
links.new(ramp.outputs['Color'], emission.inputs['Color'])
links.new(emission.outputs['Emission'], output_node.inputs['Surface'])
image, active = target('arena-stone-roughness', 'Non-Color')
bpy.ops.object.bake(type='EMIT')
save_image(image, 'arena-stone-roughness.png')
print('Material bake complete:', output)
