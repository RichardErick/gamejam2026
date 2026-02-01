# Modelos Blender — Compartir la Mesa

Modelos y scripts para **Compartir la Mesa** (Outgrow Hunger). Estilo low-poly para uso en Unity o exportación a glTF para web.

## Contenido

- **`GUIA_MODELADO.md`** — Guía de qué modelar (granja, comunidad, caja, camión), colores y pasos en Blender.
- **`scripts/`** — Scripts de Python para Blender que generan la geometría base:
  - `crear_granja.py` — Nodo fuente (granja), color verde.
  - `crear_comunidad.py` — Nodo destino (casa), color naranja.
  - `crear_caja_comida.py` — Recurso (caja de comida).
  - `crear_camion.py` — Camión (cabina + carga + ruedas).
  - `crear_todos_los_modelos.py` — Crea los cuatro y los coloca en escena.

## Cómo usar los scripts en Blender

1. Abre **Blender** (3.x o 4.x).
2. Cambia a la pestaña **Scripting** (arriba).
3. **Open** → navega a `GAME JAM/blender/scripts/` y elige un `.py` (por ejemplo `crear_granja.py`).
4. Pulsa **Run Script** (▶) o `Alt+P`.
5. El modelo aparecerá en la escena. Puedes retocarlo a mano y luego exportar.

Para generar todos a la vez: abre y ejecuta `crear_todos_los_modelos.py`. Borrará el cubo/cámara/luz por defecto y creará los cuatro modelos separados en la escena.

## Exportar para el juego

- **glTF (web):** File → Export → glTF 2.0 (`.glb`). Guardar en la carpeta del proyecto.
- **Unity:** File → Export → FBX o glTF, y colocar en `Unity/Assets/`.

Nombres sugeridos: `CompartirLaMesa_Granja`, `CompartirLaMesa_Comunidad`, `CompartirLaMesa_CajaComida`, `CompartirLaMesa_Camion`.
