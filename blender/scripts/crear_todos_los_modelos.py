"""
Compartir la Mesa — Blender: Crea todos los modelos y los coloca en escena.
Ejecutar en Blender: Scripting → Open → crear_todos_los_modelos.py → Run Script.
Genera: Granja, Comunidad, Caja de comida, Camión (separados y con offset).
"""
import bpy

# Importar y ejecutar los otros scripts (si están en la misma carpeta)
import os
import sys
blender_scripts = os.path.dirname(os.path.abspath(__file__))
if blender_scripts not in sys.path:
    sys.path.insert(0, blender_scripts)

def clear_defaults():
    """Eliminar cubo/cámara/luz por defecto."""
    for obj in list(bpy.data.objects):
        if obj.name in ("Cube", "Camera", "Light"):
            bpy.data.objects.remove(obj, do_unlink=True)

def run_script(script_name):
    script_path = os.path.join(blender_scripts, script_name)
    if not os.path.isfile(script_path):
        print("No encontrado:", script_path)
        return None
    with open(script_path, "r", encoding="utf-8") as f:
        code = f.read()
    # Ejecutar en el namespace actual para que cree los objetos
    exec(compile(code, script_path, "exec"), {"__name__": "__main__", "bpy": bpy})
    return bpy.context.scene.objects[-1] if bpy.context.scene.objects else None

def create_all():
    clear_defaults()
    offsets = [
        ("crear_granja.py", (-3, 0, 0)),
        ("crear_comunidad.py", (3, 0, 0)),
        ("crear_caja_comida.py", (0, 2, 0)),
        ("crear_camion.py", (0, -2, 0)),
    ]
    for script_name, offset in offsets:
        run_script(script_name)
        last = bpy.context.scene.objects[-1] if bpy.context.scene.objects else None
        if last:
            last.location = offset
    print("Modelos creados: Granja, Comunidad, Caja de comida, Camión.")

if __name__ == "__main__":
    create_all()
