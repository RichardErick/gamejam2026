# Compartir la Mesa — Outgrow Hunger (GGJ)

Repositorio: [github.com/RichardErick/gamejam2026](https://github.com/RichardErick/gamejam2026)

Juego creado para la Global Game Jam con **tema Outgrow Hunger** y **diversificador Cross-platform**.

## Tema y diversificador

- **Tema:** Outgrow Hunger — cadena de suministro alimentaria, reducir desperdicio, impacto social.
- **Diversificador:** El juego es **multiplataforma**: funciona y es demostrable en **dos plataformas** con el mismo código:
  - **Web (PC):** navegador de escritorio (Chrome, Firefox, Edge) — controles con ratón.
  - **Web (móvil):** navegador en smartphone o tablet — controles táctiles (tap).

## Cómo jugar

1. **Objetivo:** Llevar alimentos de las **fuentes** (círculos verdes, izquierda) a las **comunidades** (círculos naranjas, derecha) antes de que se acabe el tiempo.
2. **Controles:** Toca o haz clic en una **fuente** y luego en una **comunidad** para enviar un envío. Cada envío tarda unos segundos en llegar.
3. **Victoria:** Alimenta a todas las comunidades (3 unidades cada una) antes de que el tiempo llegue a 0.
4. **Derrota:** Se acaba el tiempo o se desperdicia demasiada comida.

## Cómo ejecutar (demostrar en 2 plataformas)

### Opción A — Archivo local (PC)

1. Abre `index.html` en tu navegador (doble clic o arrastrar al Chrome/Firefox).
2. Juega con ratón (clic en fuente → clic en comunidad).

### Opción B — Servidor local (PC y móvil en la misma red)

1. En la carpeta del proyecto, ejecuta un servidor HTTP, por ejemplo:
   - **Node:** `npx serve .` o `npx http-server -p 8080`
   - **Python 3:** `python -m http.server 8080`
2. **En PC:** Abre en el navegador `http://localhost:8080` (o la IP que indique el servidor).
3. **En móvil:** Conecta el móvil a la misma Wi‑Fi y abre `http://<IP-de-tu-PC>:8080` en el navegador del móvil.

Así demuestras que el **mismo build** funciona en **Web (PC)** y **Web (móvil)**.

## Estructura del proyecto

```
GAME JAM/
├── index.html      # Entrada; viewport y meta para móvil
├── css/style.css   # Estilos responsive
├── js/game.js      # Lógica y dibujo (Canvas); pointer/touch unificado
├── GDD.md          # Documento de diseño
└── README.md       # Este archivo
```

## Tecnologías

- HTML5, CSS3, JavaScript (sin frameworks).
- Canvas 2D para el juego.
- Eventos **pointer** (compatibles con ratón y touch) para una sola implementación de controles en PC y móvil.
- CSS responsive y `viewport` para que se vea bien en pantallas pequeñas.
