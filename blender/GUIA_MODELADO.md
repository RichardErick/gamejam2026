# Guía de modelado en Blender — Compartir la Mesa

Modelos sugeridos para el juego **Compartir la Mesa** (Outgrow Hunger). Estilo **low-poly** y colores alineados con el GDD para uso en web o Unity.

---

## Paleta de colores (del juego)

| Uso            | Hex       | RGB (0–1) para Blender     |
|----------------|-----------|-----------------------------|
| Fuente/Granja  | `#2d8a5e` | (0.18, 0.54, 0.37)         |
| Comunidad      | `#c9762e` | (0.79, 0.46, 0.18)         |
| Comunidad OK   | `#5a9e6e` | (0.35, 0.62, 0.43)         |
| Camino/ruta    | Blanco 15% | (0.15, 0.15, 0.15)        |

---

## Modelos a elaborar

### 1. Nodo Fuente (Granja)

- **Forma:** Silueta de granero o silo: base rectangular, techo a dos aguas o cónico.
- **Detalle:** Una ventana o puerta; opcional: un pequeño cultivo (cubo con textura verde).
- **Escala sugerida:** 1–2 m de ancho, 1.5–2.5 m de alto (relativo).
- **Material:** Color verde fuente `#2d8a5e`.

**Pasos rápidos en Blender:**
1. Cubo → escalar en X/Z para base.
2. Añadir otro cubo para el techo, inclinado (rotación en X), o usar un cono para silo.
3. Aplicar material verde; asignar al objeto "Granja" o "Fuente".

---

### 2. Nodo Comunidad (Casa / Pueblo)

- **Forma:** Casa simple: cubo + prisma para techo (low-poly).
- **Detalle:** Una puerta (extruir cara o cubo pequeño).
- **Escala:** Similar a la granja para coherencia visual.
- **Material:** Color naranja comunidad `#c9762e`. Variante “alimentada”: verde `#5a9e6e`.

**Pasos rápidos:**
1. Cubo para la base de la casa.
2. Añadir cubo para techo; rotar ~30° en X para tejado.
3. Material naranja; duplicar y cambiar a verde para estado “comunidad satisfecha”.

---

### 3. Caja de comida (recurso)

- **Forma:** Cubo o paralelepípedo pequeño (caja/caja de fruta).
- **Detalle:** Opcional: líneas (bordes) para simular caja.
- **Escala:** Pequeña respecto a granja/comunidad (0.3–0.5 m).
- **Material:** Verde claro o beige; puede llevar un pequeño icono de hoja/vegetal (textura o decal).

**Pasos rápidos:**
1. Cubo; escalar en Y para forma de caja.
2. Bevel ligero en las aristas si quieres suavizar.
3. Material único; opcional: segunda UV o decal para icono.

---

### 4. Camión / furgón (transporte)

- **Forma:** Dos cubos: cabina + carga; ruedas como cilindros aplanados.
- **Detalle:** Ventana en cabina (cara extruida hacia dentro o cubo).
- **Escala:** Más largo que alto; proporción ~2:1 (carga : cabina).
- **Material:** Cabina en un color; zona de carga en otro (p. ej. blanco o verde claro).

**Pasos rápidos:**
1. Cubo para cabina; cubo para caja de carga, alineados.
2. Cuatro cilindros (Scale Z < 1) como ruedas.
3. Dos materiales; opcional: línea que una granja–comunidad como “ruta”.

---

## Flujo de trabajo recomendado

1. **Modelar** cada tipo en Blender (low-poly, pocos polígonos).
2. **UV unwrap** simple (Smart UV o cajas) si vas a usar texturas.
3. **Materiales:** colores sólidos según la tabla; nombres claros (Granja, Comunidad, Caja, Camion).
4. **Exportar:**
   - **Web:** glTF 2.0 (`.glb`) — File → Export → glTF 2.0.
   - **Unity:** FBX o glTF; colocar en `Unity/Assets/`.
5. **Nomenclatura:**  
   `CompartirLaMesa_Granja.glb`, `CompartirLaMesa_Comunidad.glb`, `CompartirLaMesa_Caja.glb`, `CompartirLaMesa_Camion.glb`.

---

## Uso en el proyecto actual

- El juego actual es **2D (canvas)**. Los modelos en Blender sirven para:
  - **Assets para Unity** (ya tienes carpeta `Unity/`).
  - **Ilustraciones / renders** para pantalla de título, tutorial o iconos.
  - **Futura versión 3D** (p. ej. Three.js o Unity) usando los mismos .glb.

En la carpeta `blender/scripts/` hay scripts de Python para Blender que generan geometría base de estos modelos; puedes abrirlos en Blender (Scripting workspace) y ejecutarlos para tener un punto de partida.
