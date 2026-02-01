"""
Compartir la Mesa — Blender: Crear modelo Comunidad (nodo Destino).
Ejecutar en Blender: Scripting → Open → crear_comunidad.py → Run Script.
"""
import bpy

def make_material_comunidad(name="Mat_Comunidad"):
    if name in bpy.data.materials:
        return bpy.data.materials[name]
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.inputs["Base Color"].default_value = (0.79, 0.46, 0.18, 1.0)  # #c9762e
    out = nodes.new("ShaderNodeOutputMaterial")
    mat.node_tree.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return mat

def create_comunidad():
    # Base casa (cubo)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.45))
    base = bpy.context.active_object
    base.name = "Comunidad_Base"
    base.scale = (1.0, 0.9, 0.5)
    bpy.ops.object.transform_apply(scale=True)

    # Techo a dos aguas (cubo inclinado)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.95))
    techo = bpy.context.active_object
    techo.name = "Comunidad_Techo"
    techo.scale = (1.1, 1.0, 0.35)
    bpy.ops.object.transform_apply(scale=True)
    techo.rotation_euler = (0.35, 0, 0)
    bpy.ops.object.transform_apply(rotation=True)

    bpy.ops.object.select_all(action='DESELECT')
    base.select_set(True)
    techo.select_set(True)
    bpy.context.view_layer.objects.active = base
    bpy.ops.object.join()
    base.name = "CompartirLaMesa_Comunidad"

    mat = make_material_comunidad()
    if base.data.materials:
        base.data.materials[0] = mat
    else:
        base.data.materials.append(mat)

    return base

if __name__ == "__main__":
    create_comunidad()
    print("Comunidad creada: CompartirLaMesa_Comunidad")
