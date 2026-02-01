# Compartir la Mesa — GDD (Global Game Jam)

## Tema + Diversificador

- **Tema:** Outgrow Hunger — inseguridad alimentaria, cadena de suministro, impacto de decisiones.
- **Diversificador:** Cross-platform — jugable y demostrable en **al menos dos plataformas**: **Web (PC)** y **Web (móvil)** con el mismo código.

## Concepto en una frase

Gestiona una cadena de suministro de alimentos: recoge recursos, evita el desperdicio y reparte la comida entre comunidades antes de que se eche a perder. Tus decisiones tienen consecuencias visibles.

## Experiencia de juego

- **Sensación:** Agencia; cada elección (a qué nodo enviar, qué priorizar) afecta a las comunidades.
- **Objetivo:** Llevar alimentos a los nodos de “comunidad” antes de que se pierdan por tiempo o capacidad.
- **Obstáculos:** Tiempo limitado por tipo de alimento, rutas/capacidad limitadas, trade-offs (priorizar una comunidad vs otra).

## Mecánicas (MVP 48h)

1. **Nodos:** Fuentes (granja, mercado) y Destinos (comunidades).
2. **Recursos:** Un tipo de alimento por nivel; tiene “vida útil” (cuenta atrás) para transmitir urgencia y desperdicio.
3. **Transporte:** El jugador asigna rutas (click/tap): “de A hacia B”. Efecto: la comida llega a B y reduce hambre; si no llega a tiempo, se desperdicia.
4. **Feedback:** Barra o indicador de “comunidad satisfecha” vs “comunidad con hambre”; contador de comida desperdiciada.
5. **Victoria/derrota:** Nivel completado cuando todas las comunidades alcanzan un umbral; fallo si se desperdicia demasiado o el tiempo se acaba.

## Cross-platform

- **Plataforma 1 — PC:** Navegador de escritorio (Chrome, Firefox, Edge). Controles: ratón (click para seleccionar nodos y asignar rutas).
- **Plataforma 2 — Móvil:** Navegador en smartphone/tablet. Mismo build; controles: touch (tap = click). UI y texto legibles en pantalla pequeña.
- **Implementación:** Un solo proyecto HTML5 + JS; diseño responsive; input unificado (pointer/touch) para que un solo código sirva en ambas plataformas.

## Lente temático

Impacto social tangible: ver cómo “compartir la mesa” (priorizar bien la distribución) mejora o empeora el estado de las comunidades, y cómo el desperdicio tiene coste humano.

## Alcance para 48h

- Un nivel jugable con varias fuentes y varias comunidades.
- Un tipo de recurso con tiempo de vida.
- Controles claros en PC y móvil.
- Pantalla de título, instrucciones mínimas, feedback de victoria/derrota.
