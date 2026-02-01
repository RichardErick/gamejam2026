"""
Compartir la Mesa — Blender: Crear modelo Granja (nodo Fuente).
Ejecutar en Blender: Scripting → Open → crear_granja.py → Run Script.
"""
import bpy

# Limpiar objetos por defecto (opcional)
def clean_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)

# Crear material verde fuente
def make_material_fuente(name="Mat_Granja"):
    if name in bpy.data.materials:
        return bpy.data.materials[name]
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.inputs["Base Color"].default_value = (0.18, 0.54, 0.37, 1.0)  # #2d8a5e
    out = nodes.new("ShaderNodeOutputMaterial")
    mat.node_tree.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return mat

def create_granja():
    # Base (cubo achatado)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.4))
    base = bpy.context.active_object
    base.name = "Granja_Base"
    base.scale = (1.2, 0.8, 0.4)
    bpy.ops.object.transform_apply(scale=True)

    # Techo (prisma tipo granero)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 1.0))
    techo = bpy.context.active_object
    techo.name = "Granja_Techo"
    techo.scale = (1.3, 0.9, 0.5)
    bpy.ops.object.transform_apply(scale=True)
    techo.rotation_euler = (0.3, 0, 0)  # Inclinación
    bpy.ops.object.transform_apply(rotation=True)

    # Unir en un solo objeto
    bpy.ops.object.select_all(action='DESELECT')
    base.select_set(True)
    techo.select_set(True)
    bpy.context.view_layer.objects.active = base
    bpy.ops.object.join()
    base.name = "CompartirLaMesa_Granja"

    mat = make_material_fuente()
    if base.data.materials:
        base.data.materials[0] = mat
    else:
        base.data.materials.append(mat)

    return base

if __name__ == "__main__":
    # clean_scene()  # Descomenta si quieres borrar la escena antes
    create_granja()
    print("Granja (Fuente) creada: CompartirLaMesa_Granja")
