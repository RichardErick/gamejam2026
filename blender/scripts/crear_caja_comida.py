"""
Compartir la Mesa — Blender: Crear modelo Caja de comida (recurso).
Ejecutar en Blender: Scripting → Open → crear_caja_comida.py → Run Script.
"""
import bpy

def make_material_caja(name="Mat_Caja"):
    if name in bpy.data.materials:
        return bpy.data.materials[name]
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.inputs["Base Color"].default_value = (0.85, 0.75, 0.45, 1.0)  # beige/caja
    out = nodes.new("ShaderNodeOutputMaterial")
    mat.node_tree.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return mat

def create_caja_comida():
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0))
    caja = bpy.context.active_object
    caja.name = "CompartirLaMesa_CajaComida"
    caja.scale = (0.4, 0.3, 0.25)  # Caja pequeña
    bpy.ops.object.transform_apply(scale=True)

    mat = make_material_caja()
    if caja.data.materials:
        caja.data.materials[0] = mat
    else:
        caja.data.materials.append(mat)

    return caja

if __name__ == "__main__":
    create_caja_comida()
    print("Caja de comida creada: CompartirLaMesa_CajaComida")
