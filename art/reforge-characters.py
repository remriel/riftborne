"""Blender mesh remodels of the licensed rigs; animation clips are restored at packaging."""
import bpy, bmesh, os, math
from mathutils import Vector, noise

root=args['root']
report=[]
for name in ['mage','titan','wyrm','colossus','oracle','archon']:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    source='mage' if name=='archon' else name
    bpy.ops.import_scene.gltf(filepath=os.path.join(root,'art/character-sources',source+'.glb'))
    for obj in list(bpy.context.scene.objects):
        if obj.type=='MESH' and obj.name in ['Icosphere','Spellbook','Spellbook_open','1H_Wand','2H_Staff','Trident']:
            bpy.data.objects.remove(obj,do_unlink=True)
    image=bpy.data.images.load(os.path.join(root,'art/character-materials.png'))
    material=bpy.data.materials.new(name+' handcrafted surface');material.use_nodes=True
    shader=material.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Roughness'].default_value=.68 if name in ['mage','oracle'] else .48
    shader.inputs['Metallic'].default_value=.65 if name=='archon' else .12
    texture=material.node_tree.nodes.new('ShaderNodeTexImage');texture.image=image
    material.node_tree.links.new(texture.outputs['Color'],shader.inputs['Base Color'])
    if name in ['titan','wyrm','colossus','oracle','archon']:
        material.node_tree.links.new(texture.outputs['Color'],shader.inputs['Emission Color'])
        shader.inputs['Emission Strength'].default_value=.16
    slot=['mage','titan','wyrm','colossus','oracle','archon'].index(name)
    col,row=slot%3,slot//3
    changed=0
    for obj in list(bpy.context.scene.objects):
        if obj.type!='MESH':continue
        bpy.context.view_layer.objects.active=obj
        for v in obj.data.vertices:
            x,y,z=v.co;old=v.co.copy()
            groups={obj.vertex_groups[g.group].name.lower():g.weight for g in v.groups}
            def weight(*parts):return min(1,sum(w for k,w in groups.items() if any(p in k for p in parts)))
            if name in ['mage','archon']:
                if obj.name=='Mage_Head':
                    v.co.x*=.74;v.co.y*=.78;v.co.z=1.2+(z-1.2)*.82
                elif obj.name.startswith('Mage_Arm'):
                    gauntlet=max(0,min(1,(abs(x)-.47)/.23))
                    v.co.y*=1+gauntlet*.9;v.co.z=1.1+(z-1.1)*(1+gauntlet*.9)
                    shoulder=weight('upperarm')
                    v.co.y*=1+shoulder*.16
                elif obj.name=='Mage_Body':
                    v.co.x*=.87 if z<.9 else 1.1
                    v.co.y*=.86
                elif obj.name=='Mage_Cape':
                    v.co.x*=1.32 if name=='archon' else 1.08
                    v.co.z*=1.35;v.co.y+=max(0,-z)*.19
                elif obj.name=='Mage_Hat':
                    # Reshape the existing brim/crown mesh into a compact hood/cowl.
                    v.co.x*=.48;v.co.y*=.50
                    v.co.z=-.08+max(0,z+.145)*.34
                    if name=='archon':
                        angle=math.atan2(y,x)
                        v.co.z+=max(0,z)*(.28+.18*math.cos(angle*6))
                if name=='archon' and obj.name.startswith('Mage_Arm'):
                    v.co.y*=1.25;v.co.z=1.1+(v.co.z-1.1)*1.22
            elif name=='titan':
                upper=weight('shoulder','upperarm','torso');fore=weight('lowerarm','pinky','middle','index','thumb')
                v.co.x*=1+upper*.25
                v.co.y*=1+upper*.55+fore*.48
                v.co.z+=upper*.12
                if fore:v.co.z=1.5+(v.co.z-1.5)*(1+fore*.3)
                if z>2.55:v.co.z=2.55+(z-2.55)*.32
                v.co+=v.normal*(.035*noise.noise_vector(old*9).x)
            elif name=='wyrm':
                wing=weight('wing');tail=weight('body2','body3','body4')
                v.co.x*=1+wing*.48
                v.co.y*=1+tail*.45
                v.co.z+=wing*.14+tail*.10*math.sin(y*3)
                if weight('head')>.5:v.co.y*=1.2
            elif name=='colossus':
                upper=weight('shoulder','upperarm','torso');fore=weight('lowerarm','hand','pinky','middle','index')
                v.co.x*=1+upper*.32
                v.co.y*=1+upper*.42+fore*.25
                v.co.z+=upper*.18
                v.co+=v.normal*(.055*noise.noise_vector(old*7).x)
                if z>2.2:v.co.z+=.12*max(0,math.sin(x*17+y*9))
            elif name=='oracle':
                head=weight('head');arm=weight('arm','hand','finger','pinky','middle','index')
                v.co.x*=1-head*.18
                v.co.z+=head*.36
                v.co.y*=1+head*.16
                v.co.x*=1+arm*.13
                if z<1.2:v.co.x*=.72;v.co.z-=.18*(1.2-z)
            if (v.co-old).length>.00001:changed+=1
        obj.data.update()
        # Preserve facial material/UV on the mage's face; cloth and armor use generated surfaces.
        if obj.name!='Mage_Head' or name=='archon':
            obj.data.materials.clear();obj.data.materials.append(material)
            uv=obj.data.uv_layers.active or obj.data.uv_layers.new(name='UVMap')
            for face in obj.data.polygons:
                face.material_index=0
                axis=max(range(3),key=lambda i:abs(face.normal[i]));dims=[i for i in range(3) if i!=axis]
                for li in face.loop_indices:
                    co=obj.data.vertices[obj.data.loops[li].vertex_index].co
                    u=(co[dims[0]]*.45)%1;v=(co[dims[1]]*.45)%1
                    uv.data[li].uv=((col+.04+u*.92)/3,1-(row+.04+v*.92)/2)
        # Actual additional armor surfaces follow the existing rig and source topology.
        if name in ['titan','colossus']:
            armor=obj.copy();armor.data=obj.data.copy();armor.name=name+'_shoulder_carapace'
            bpy.context.collection.objects.link(armor)
            keep=set()
            for v in armor.data.vertices:
                if any(any(p in armor.vertex_groups[g.group].name.lower() for p in ['torso','shoulder','upperarm']) and g.weight>.45 for g in v.groups):keep.add(v.index)
            bm=bmesh.new();bm.from_mesh(armor.data);bm.verts.ensure_lookup_table()
            bmesh.ops.delete(bm,geom=[v for v in bm.verts if v.index not in keep],context='VERTS')
            for v in bm.verts:v.co+=v.normal*.075
            bm.to_mesh(armor.data);bm.free();armor.data.update()
            solid=armor.modifiers.new('Carved armor thickness','SOLIDIFY');solid.thickness=.05
            bpy.context.view_layer.objects.active=armor
            bpy.ops.object.modifier_apply(modifier=solid.name)
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.export_scene.gltf(filepath=os.path.join(root,'art/character-sources',name+'-sculpt.glb'),export_format='GLB',use_active_scene=True,export_animations=False,export_cameras=False,export_lights=False)
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(root,'art',name+'-reforged.blend'))
    report.append({'name':name,'edited_vertices':changed,'meshes':len([o for o in bpy.context.scene.objects if o.type=='MESH'])})
__result__=report
