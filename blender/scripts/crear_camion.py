"""
Compartir la Mesa — Blender: Crear modelo Camión (transporte).
Ejecutar en Blender: Scripting → Open → crear_camion.py → Run Script.
"""
import bpy

def make_material(name, color):
    if name in bpy.data.materials:
        return bpy.data.materials[name]
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    out = nodes.new("ShaderNodeOutputMaterial")
    mat.node_tree.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return mat

def create_camion():
    # Cabina
    bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.5, 0, 0.25))
    cabina = bpy.context.active_object
    cabina.name = "Camion_Cabina"
    cabina.scale = (0.4, 0.35, 0.3)
    bpy.ops.object.transform_apply(scale=True)

    # Carga
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0.4, 0, 0.35))
    carga = bpy.context.active_object
    carga.name = "Camion_Carga"
    carga.scale = (0.6, 0.4, 0.4)
    bpy.ops.object.transform_apply(scale=True)

    # Ruedas (cilindros aplanados)
    positions = [(-0.35, 0.28, 0.05), (-0.35, -0.28, 0.05), (0.55, 0.28, 0.05), (0.55, -0.28, 0.05)]
    ruedas = []
    for i, pos in enumerate(positions):
        bpy.ops.mesh.primitive_cylinder_add(radius=0.12, depth=0.08, location=pos)
        r = bpy.context.active_object
        r.name = f"Camion_Rueda_{i+1}"
        ruedas.append(r)

    # Unir todo
    bpy.ops.object.select_all(action='DESELECT')
    cabina.select_set(True)
    carga.select_set(True)
    for r in ruedas:
        r.select_set(True)
    bpy.context.view_layer.objects.active = cabina
    bpy.ops.object.join()
    cabina.name = "CompartirLaMesa_Camion"

    mat_cabina = make_material("Mat_Camion_Cabina", (0.2, 0.25, 0.35))
    mat_carga = make_material("Mat_Camion_Carga", (0.9, 0.9, 0.85))
    # Un solo material para simplicidad (el join mezcla; asignamos uno)
    cabina.data.materials.append(mat_cabina)

    return cabina

if __name__ == "__main__":
    create_camion()
    print("Camión creada: CompartirLaMesa_Camion")
