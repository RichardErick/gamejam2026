# Compartir la Mesa — Unity (más elaborado)

Versión **Unity** del juego de la Game Jam: misma temática **Outgrow Hunger** y cadena de suministro, con mecánicas más elaboradas y lista para varios niveles y builds (PC, Web, móvil).

## Contenido del proyecto

- **Vida útil de la comida:** la comida en las fuentes se echa a perder con el tiempo; si no la envías, cuenta como desperdicio.
- **Nodos fuente y comunidad:** fuentes (granjas) con stock y vida útil; comunidades con necesidad y barra de satisfacción.
- **Entregas en tránsito:** al elegir fuente → comunidad, la entrega tarda unos segundos; se dibujan rutas y posición del envío.
- **Victoria/derrota:** ganas cuando todas las comunidades están alimentadas; pierdes por tiempo o por exceso de desperdicio.
- **Sistema de niveles:** `LevelData` (ScriptableObject) para definir tiempo, desperdicio permitido y, opcionalmente, posiciones de nodos.
- **UI:** HUD (tiempo, desperdicio), panel de fin de nivel con mensajes y botones Reiniciar / Siguiente nivel.
- **Input:** clic/tap (ratón y touch) para seleccionar fuente y luego comunidad; compatible con PC y móvil.

## Cómo montar la escena en Unity

1. **Crear proyecto Unity 2D** (o 3D y usar plano XY).
2. **Copiar la carpeta `Assets`** de este repositorio dentro de tu proyecto Unity (o abrir esta carpeta como proyecto).
3. **Escena base:**
   - **Cámara:** ortográfica, posición (0, 0, -10).
   - **GameManager:** objeto vacío con `GameManager.cs`. En el Inspector asigna:
     - `Level Time Seconds` (ej. 60).
     - `Max Waste Allowed` (ej. 4).
     - Opcional: array `Levels` con tus `LevelData`.
     - Referencia al `UIManager`.
   - **DeliveryManager:** objeto vacío con `DeliveryManager.cs`. Configura `Delivery Duration` (ej. 4 s).
   - **NodeInputHandler:** objeto vacío con `NodeInputHandler.cs`. Asigna la cámara del juego si no usas Main Camera.
   - **UIManager:** objeto con `UIManager.cs` (puede ser hijo del Canvas). Asigna:
     - Textos del HUD: tiempo y desperdicio.
     - Slider del tiempo (opcional).
     - Panel de fin de nivel (GameObject), título, mensaje y botones Reiniciar y Siguiente nivel.
4. **Nodos:**
   - **Fuentes:** para cada granja, crea un GameObject (con Sprite/Círculo o sprite propio). Añade:
     - `SourceNode`: `Initial Food` (ej. 5), `Shelf Life Seconds` (ej. 30), `Node Label`.
     - Opcional: hijo con `NodeView` (SpriteRenderer) y tipo Source.
   - **Comunidades:** para cada comunidad, GameObject con:
     - `CommunityNode`: `Food Needed` (ej. 3), `Node Label`.
     - Opcional: hijo con `NodeView` tipo Community.
   - Coloca las fuentes a la izquierda y las comunidades a la derecha (o como quieras).
5. **Opcional:** `GameBootstrap` con un `LevelData` y prefabs de nodo para generar el nivel desde datos en lugar de colocar nodos a mano.
6. **Opcional:** `DeliveryRouteDrawer` para dibujar líneas de entregas (asigna prefab de `LineRenderer` si quieres líneas en pantalla).

## Niveles con LevelData

1. En el proyecto: clic derecho → **Create > Compartir la Mesa > Level Data**.
2. Configura tiempo, desperdicio máximo y, si quieres, arrays `Sources` y `Communities` (posición y parámetros).
3. En **GameManager**, asigna en **Levels** los `LevelData` en orden; al ganar se puede pasar al siguiente con el botón "Siguiente nivel".

## Build multiplataforma

- **PC:** File → Build Settings → Windows/Mac/Linux.
- **Web:** Build Settings → WebGL (mismo código; controles con ratón).
- **Móvil:** Build Settings → Android/iOS (mismo código; controles táctiles).

Con esto cumples el diversificador **Cross-platform** usando Unity.

## Estructura de scripts

```
Assets/Scripts/
├── Core/
│   └── GameManager.cs       # Tiempo, victoria/derrota, desperdicio, niveles
├── Data/
│   └── LevelData.cs         # ScriptableObject de nivel
├── Nodes/
│   ├── NodeBase.cs          # Base selección y posición
│   ├── SourceNode.cs        # Fuente con vida útil
│   └── CommunityNode.cs     # Comunidad con necesidad
├── Delivery/
│   ├── Delivery.cs          # Una entrega en tránsito
│   └── DeliveryManager.cs   # Crear y actualizar entregas
├── Input/
│   └── NodeInputHandler.cs  # Clic/tap fuente → comunidad
├── UI/
│   └── UIManager.cs         # HUD y panel fin de nivel
├── Visual/
│   ├── NodeView.cs          # Color según tipo/estado
│   └── DeliveryRouteDrawer.cs # Líneas de rutas
└── Setup/
    └── GameBootstrap.cs     # Inicializar nivel desde LevelData
```

## Diferencias con la versión web

| Aspecto        | Web (HTML/JS)     | Unity                         |
|----------------|-------------------|-------------------------------|
| Vida útil      | No (solo tiempo)  | Sí, por unidad en la fuente   |
| Niveles        | Uno               | Varios con LevelData         |
| Rutas          | Línea estática    | Línea + icono en movimiento  |
| Plataformas    | Navegador PC/móvil| PC, WebGL, Android, iOS      |
| Arte           | Canvas 2D         | Sprites, UI, partículas, etc. |

Si quieres, el siguiente paso puede ser añadir sprites, sonidos y más niveles concretos en tu escena.
