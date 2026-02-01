/**
 * Compartir la Mesa — Outgrow Hunger (GGJ Cross-platform)
 * Estilo videojuego moderno: menú, niveles, countdown, estrellas, partículas
 */
(function () {
  'use strict';

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 520;
  const NODE_RADIUS = 36;
  const DELIVERY_TIME = 4;

  /** Niveles: tiempo, max desperdicio, fuentes y comunidades */
  const LEVELS = [
    {
      time: 60,
      maxWaste: 4,
      sources: [
        { x: 140, y: 180, food: 5, label: 'Granja A' },
        { x: 140, y: 340, food: 5, label: 'Granja B' }
      ],
      communities: [
        { x: 660, y: 180, need: 3, received: 0, label: 'Comunidad 1' },
        { x: 660, y: 340, need: 3, received: 0, label: 'Comunidad 2' }
      ]
    },
    {
      time: 50,
      maxWaste: 3,
      sources: [
        { x: 120, y: 140, food: 4, label: 'Granja A' },
        { x: 120, y: 260, food: 4, label: 'Granja B' },
        { x: 120, y: 380, food: 4, label: 'Granja C' }
      ],
      communities: [
        { x: 680, y: 140, need: 2, received: 0, label: 'Comunidad 1' },
        { x: 680, y: 260, need: 3, received: 0, label: 'Comunidad 2' },
        { x: 680, y: 380, need: 2, received: 0, label: 'Comunidad 3' }
      ]
    },
    {
      time: 45,
      maxWaste: 2,
      sources: [
        { x: 100, y: 180, food: 4, label: 'Granja A' },
        { x: 100, y: 340, food: 4, label: 'Granja B' }
      ],
      communities: [
        { x: 700, y: 180, need: 3, received: 0, label: 'Comunidad 1' },
        { x: 700, y: 340, need: 3, received: 0, label: 'Comunidad 2' }
      ]
    },
    {
      time: 40,
      maxWaste: 2,
      sources: [
        { x: 90, y: 130, food: 3, label: 'Granja A' },
        { x: 90, y: 260, food: 3, label: 'Granja B' },
        { x: 90, y: 390, food: 3, label: 'Granja C' }
      ],
      communities: [
        { x: 710, y: 130, need: 2, received: 0, label: 'Comunidad 1' },
        { x: 710, y: 260, need: 3, received: 0, label: 'Comunidad 2' },
        { x: 710, y: 390, need: 2, received: 0, label: 'Comunidad 3' }
      ]
    },
    {
      time: 35,
      maxWaste: 1,
      sources: [
        { x: 80, y: 160, food: 3, label: 'Granja A' },
        { x: 80, y: 360, food: 3, label: 'Granja B' }
      ],
      communities: [
        { x: 720, y: 160, need: 3, received: 0, label: 'Comunidad 1' },
        { x: 720, y: 360, need: 3, received: 0, label: 'Comunidad 2' }
      ]
    }
  ];

  var STORAGE_KEY_MUTED = 'compartir_mesa_muted';
  var STORAGE_KEY_BEST = 'compartir_mesa_best';
  var STORAGE_KEY_TUTORIAL = 'compartir_mesa_tutorial';

  function loadBestStars() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY_BEST);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }

  function saveBestStars(levelIndex, stars) {
    try {
      var best = loadBestStars();
      var current = best[levelIndex] || 0;
      if (stars > current) {
        best[levelIndex] = stars;
        localStorage.setItem(STORAGE_KEY_BEST, JSON.stringify(best));
      }
      return best[levelIndex] || 0;
    } catch (e) { return 0; }
  }

  /** Sonidos y música — compatible móvil y PC */
  const Sound = (function () {
    var ctx = null;
    var unlocked = false;
    var muted = false;
    var musicOscs = [];
    var musicGain = null;

    function getCtx() {
      if (ctx) return ctx;
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) { return null; }
      return ctx;
    }

    function unlock() {
      if (unlocked) return;
      var c = getCtx();
      if (!c) return;
      if (c.state === 'suspended') {
        c.resume().then(function () { unlocked = true; }).catch(function () {});
        unlocked = true;
      } else {
        unlocked = true;
      }
    }

    function beep(options) {
      if (muted) return;
      var c = getCtx();
      if (!c || !unlocked) return;
      var freq = options.freq || 440;
      var duration = options.duration || 0.1;
      var vol = options.vol !== undefined ? options.vol : 0.2;
      var type = options.type || 'sine';

      var osc = c.createOscillator();
      var gain = c.createGain();
      osc.connect(gain);
      gain.connect(c.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, c.currentTime);
      osc.frequency.exponentialRampToValueAtTime(0.01, c.currentTime + duration);
      gain.gain.setValueAtTime(vol, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + duration);
      osc.start(c.currentTime);
      osc.stop(c.currentTime + duration);
    }

    function stopMusicInternal() {
      if (musicOscs && musicOscs.length) {
        var c = getCtx();
        var now = c ? c.currentTime : 0;
        musicOscs.forEach(function (osc) {
          try {
            osc.stop(now);
            osc.disconnect();
          } catch (e) {}
        });
        musicOscs = [];
      }
      musicGain = null;
    }

    return {
      unlock: unlock,
      setMuted: function (v) { muted = !!v; },
      isMuted: function () { return muted; },
      playSelect: function () {
        unlock();
        beep({ freq: 520, duration: 0.08, vol: 0.15, type: 'sine' });
      },
      playSend: function () {
        unlock();
        beep({ freq: 360, duration: 0.06, vol: 0.12, type: 'sine' });
        setTimeout(function () {
          beep({ freq: 480, duration: 0.08, vol: 0.14, type: 'sine' });
        }, 60);
      },
      playArrive: function () {
        unlock();
        beep({ freq: 640, duration: 0.1, vol: 0.18, type: 'sine' });
        setTimeout(function () {
          beep({ freq: 800, duration: 0.12, vol: 0.16, type: 'sine' });
        }, 80);
      },
      playVictory: function () {
        unlock();
        [523, 659, 784, 1047].forEach(function (f, i) {
          setTimeout(function () {
            beep({ freq: f, duration: 0.2, vol: 0.2, type: 'sine' });
          }, i * 120);
        });
      },
      playDefeat: function () {
        unlock();
        beep({ freq: 220, duration: 0.15, vol: 0.2, type: 'sawtooth' });
        setTimeout(function () {
          beep({ freq: 180, duration: 0.25, vol: 0.18, type: 'sawtooth' });
        }, 150);
      },
      startMusic: function () {
        if (muted) return;
        var c = getCtx();
        if (!c || !unlocked) return;
        stopMusicInternal();
        var gain = c.createGain();
        gain.gain.setValueAtTime(0.06, c.currentTime);
        gain.connect(c.destination);
        var chord = [262, 330, 392, 523];
        var oscs = [];
        chord.forEach(function (freq) {
          var osc = c.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, c.currentTime);
          osc.connect(gain);
          osc.start(c.currentTime);
          oscs.push(osc);
        });
        musicOscs = oscs;
        musicGain = gain;
      },
      stopMusic: function () {
        stopMusicInternal();
      }
    };
  })();

  const COLORS = {
    source: '#2d8a5e',
    sourceHighlight: '#4bc98a',
    community: '#c9762e',
    communityHighlight: '#e9a055',
    communityFed: '#5a9e6e',
    road: 'rgba(255,255,255,0.15)',
    text: '#e8e6e3',
    waste: '#e08080'
  };

  let canvas, ctx;
  let gameState = 'MENU'; // MENU | COUNTDOWN | PLAYING | WIN | LOSE
  let currentLevelIndex = 0;
  let levelTime = 60;
  let maxWasteAllowed = 4;
  let sources = [];
  let communities = [];
  let deliveries = [];
  let selectedNode = null;
  let hoverNode = null;
  let timeLeft = 60;
  let wasteCount = 0;
  let gameOver = false;
  let gameWon = false;
  let lastTime = 0;
  let timerId = null;
  let particles = [];
  let cursorPos = null;
  let levelIntroShown = false;

  function getLevel() {
    return LEVELS[currentLevelIndex] || LEVELS[0];
  }

  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(function (el) {
      el.classList.remove('active');
    });
    var el = document.getElementById(id);
    if (el) el.classList.add('active');
  }

  function showMenu() {
    Sound.stopMusic();
    showScreen('main-menu');
    gameState = 'MENU';
  }

  function showGame() {
    showScreen('game-container');
    gameState = 'COUNTDOWN';
    startCountdown();
  }

  function startCountdown() {
    var overlay = document.getElementById('countdown-overlay');
    var numEl = document.getElementById('countdown-number');
    if (!overlay || !numEl) return;
    draw();
    showLevelIntro();
    overlay.style.display = 'flex';
    var steps = [3, 2, 1, '¡Ya!'];
    var i = 0;
    function next() {
      if (i >= steps.length) {
        overlay.style.display = 'none';
        gameState = 'PLAYING';
        Sound.startMusic();
        showTutorialHint();
        lastTime = performance.now();
        timerId = requestAnimationFrame(gameLoop);
        return;
      }
      numEl.textContent = steps[i];
      numEl.style.animation = 'none';
      numEl.offsetHeight;
      numEl.style.animation = 'countdownPop 0.5s ease';
      i++;
      setTimeout(next, 800);
    }
    next();
  }

  function spawnParticles(x, y, color) {
    color = color || COLORS.communityFed;
    for (var i = 0; i < 20; i++) {
      var angle = Math.PI * 2 * (i / 20) + Math.random() * 0.8;
      var speed = 2.5 + Math.random() * 5;
      particles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color: color,
        radius: 2.5 + Math.random() * 4
      });
    }
  }

  function showLevelIntro() {
    var card = document.getElementById('level-intro');
    var title = document.getElementById('level-intro-title');
    var subtitle = document.getElementById('level-intro-subtitle');
    if (!card || !title) return;
    title.textContent = 'Nivel ' + (currentLevelIndex + 1);
    if (subtitle) subtitle.textContent = getLevel().subtitle || 'Distribuye la comida';
    card.hidden = false;
    card.style.display = 'flex';
    levelIntroShown = true;
    setTimeout(function () {
      card.hidden = true;
      card.style.display = 'none';
    }, 1500);
  }

  function showTutorialHint() {
    try {
      if (localStorage.getItem(STORAGE_KEY_TUTORIAL)) return;
    } catch (e) { return; }
    var hint = document.getElementById('tutorial-hint');
    if (hint && currentLevelIndex === 0) {
      hint.hidden = false;
      setTimeout(function () {
        if (hint && !hint.hidden) {
          hint.hidden = true;
          try { localStorage.setItem(STORAGE_KEY_TUTORIAL, '1'); } catch (e) {}
        }
      }, 5000);
    }
  }

  function hideTutorialHint() {
    try { localStorage.setItem(STORAGE_KEY_TUTORIAL, '1'); } catch (e) {}
    var hint = document.getElementById('tutorial-hint');
    if (hint) hint.hidden = true;
  }

  function loadLevel() {
    var level = getLevel();
    levelTime = level.time;
    maxWasteAllowed = level.maxWaste;
    timeLeft = levelTime;
    wasteCount = 0;
    sources = level.sources.map(function (s) {
      return { x: s.x, y: s.y, food: s.food, label: s.label };
    });
    communities = level.communities.map(function (c) {
      return { x: c.x, y: c.y, need: c.need, received: 0, label: c.label };
    });
    deliveries = [];
    selectedNode = null;
    gameOver = false;
    gameWon = false;
    particles = [];
    var levelNum = document.getElementById('level-number');
    if (levelNum) levelNum.textContent = currentLevelIndex + 1;
    updateHUD();
    updateTimerBar();
    hideMessage();
    hideResultPanel();
    hideRestartButton();
  }

  function init(levelIndex) {
    if (timerId != null) cancelAnimationFrame(timerId);
    if (levelIndex !== undefined) currentLevelIndex = Math.max(0, Math.min(levelIndex, LEVELS.length - 1));
    canvas = document.getElementById('game');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resizeCanvas();
    loadLevel();
    lastTime = performance.now();
    if (gameState === 'PLAYING') {
      timerId = requestAnimationFrame(gameLoop);
    }
  }

  function resizeCanvas() {
    var container = document.getElementById('game-container');
    if (!container || !canvas) return;
    var w = container.clientWidth;
    var h = Math.min((w / CANVAS_WIDTH) * CANVAS_HEIGHT, window.innerHeight * 0.6);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
  }

  function getCanvasPoint(e) {
    var rect = canvas.getBoundingClientRect();
    var scaleX = canvas.width / rect.width;
    var scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  function hitTestNode(point) {
    for (var i = 0; i < sources.length; i++) {
      var s = sources[i];
      if (dist(point, s) <= NODE_RADIUS && s.food > 0) return { type: 'source', node: s };
    }
    for (var j = 0; j < communities.length; j++) {
      var c = communities[j];
      if (dist(point, c) <= NODE_RADIUS && c.received < c.need) return { type: 'community', node: c };
    }
    return null;
  }

  function dist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function onPointerDown(e) {
    e.preventDefault();
    Sound.unlock();
    if (gameOver || gameState !== 'PLAYING') return;
    var point = getCanvasPoint(e);
    var hit = hitTestNode(point);
    if (!hit) {
      selectedNode = null;
      return;
    }
    if (!selectedNode) {
      if (hit.type === 'source') {
        selectedNode = hit;
        Sound.playSelect();
      }
      return;
    }
    if (selectedNode.type === 'source' && hit.type === 'community') {
      var src = selectedNode.node;
      var dst = hit.node;
      if (src.food > 0 && dst.received < dst.need) {
        hideTutorialHint();
        src.food--;
        Sound.playSend();
        deliveries.push({
          from: { x: src.x, y: src.y },
          to: { x: dst.x, y: dst.y },
          timeLeft: DELIVERY_TIME,
          community: dst
        });
      }
      selectedNode = null;
    } else {
      selectedNode = hit.type === 'source' ? hit : null;
      if (selectedNode) Sound.playSelect();
    }
  }

  function onPointerMove(e) {
    var point = getCanvasPoint(e);
    cursorPos = {
      x: Math.max(0, Math.min(CANVAS_WIDTH, point.x)),
      y: Math.max(0, Math.min(CANVAS_HEIGHT, point.y))
    };
    hoverNode = hitTestNode(point);
    if (canvas) canvas.style.cursor = hoverNode ? 'pointer' : 'default';
  }

  function onPointerUp(e) {
    e.preventDefault();
  }

  function calcStars() {
    if (!gameWon) return 0;
    var stars = 1;
    if (wasteCount <= 1) stars = 2;
    if (wasteCount === 0 && timeLeft >= 15) stars = 3;
    return stars;
  }

  function showResultPanel(won, stars) {
    var panel = document.getElementById('result-panel');
    var card = panel ? panel.querySelector('.result-card') : null;
    var title = document.getElementById('result-title');
    var stats = document.getElementById('result-stats');
    var bestEl = document.getElementById('result-best');
    var starsEl = document.getElementById('result-stars');
    var btnRetry = document.getElementById('btn-retry');
    var btnNext = document.getElementById('btn-next');
    if (!panel || !card) return;
    panel.hidden = false;
    panel.style.display = 'flex';
    card.className = 'result-card ' + (won ? 'victory' : 'defeat');
    if (title) title.textContent = won ? '¡Nivel completado!' : 'Fin del nivel';
    if (stats) {
      stats.textContent = 'Tiempo restante: ' + Math.ceil(timeLeft) + ' s · Desperdicio: ' + wasteCount;
    }
    var previousBest = (loadBestStars())[currentLevelIndex] || 0;
    if (won) saveBestStars(currentLevelIndex, stars);
    var newBest = Math.max(previousBest, stars);
    if (bestEl) {
      if (won) {
        bestEl.textContent = stars >= 3 ? '¡Máximo de estrellas!' : ('Mejor: ' + newBest + ' estrellas');
        bestEl.hidden = false;
      } else {
        bestEl.hidden = true;
      }
    }
    if (starsEl) {
      var starsList = starsEl.querySelectorAll('.star');
      starsList.forEach(function (el, i) {
        el.classList.toggle('earned', i < stars);
      });
    }
    if (btnRetry) btnRetry.style.display = 'inline-flex';
    if (btnNext) {
      if (won) {
        btnNext.style.display = 'inline-flex';
        btnNext.textContent = currentLevelIndex < LEVELS.length - 1 ? 'Siguiente nivel' : 'Volver al menú';
      } else {
        btnNext.style.display = 'none';
      }
    }
  }

  function hideResultPanel() {
    var panel = document.getElementById('result-panel');
    if (panel) {
      panel.hidden = true;
      panel.style.display = 'none';
    }
  }

  function updateTimerBar() {
    var bar = document.getElementById('timer-bar');
    if (!bar) return;
    var pct = levelTime > 0 ? (timeLeft / levelTime) * 100 : 0;
    bar.style.width = pct + '%';
    bar.classList.remove('warning', 'danger');
    if (pct <= 20) bar.classList.add('danger');
    else if (pct <= 35) bar.classList.add('warning');
  }

  function gameLoop(now) {
    if (gameOver || gameState !== 'PLAYING') return;
    var dt = Math.min((now - lastTime) / 1000, 0.2);
    lastTime = now;

    timeLeft -= dt;
    if (timeLeft <= 0) {
      timeLeft = 0;
      endLevel();
      return;
    }

    for (var i = deliveries.length - 1; i >= 0; i--) {
      var d = deliveries[i];
      d.timeLeft -= dt;
      if (d.timeLeft <= 0) {
        d.community.received++;
        Sound.playArrive();
        spawnParticles(d.to.x, d.to.y, COLORS.communityFed);
        deliveries.splice(i, 1);
      }
    }

    for (var p = particles.length - 1; p >= 0; p--) {
      var pt = particles[p];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.life -= 0.02;
      if (pt.life <= 0) particles.splice(p, 1);
    }

    if (checkWin()) {
      gameWon = true;
      gameOver = true;
      gameState = 'WIN';
      Sound.playVictory();
      var stars = calcStars();
      showResultPanel(true, stars);
      updateHUD();
      updateTimerBar();
      draw();
      return;
    }

    updateHUD();
    updateTimerBar();
    draw();
    timerId = requestAnimationFrame(gameLoop);
  }

  function checkWin() {
    return communities.every(function (c) { return c.received >= c.need; });
  }

  function endLevel() {
    Sound.stopMusic();
    gameOver = true;
    var remaining = 0;
    sources.forEach(function (s) { remaining += s.food; });
    wasteCount += remaining;
    if (checkWin()) {
      gameWon = true;
      gameState = 'WIN';
      Sound.playVictory();
      showResultPanel(true, calcStars());
    } else {
      gameState = 'LOSE';
      Sound.playDefeat();
      var container = document.getElementById('game-container');
      if (container) {
        container.classList.add('shake');
        setTimeout(function () { container.classList.remove('shake'); }, 500);
      }
      showMessage('Se acabó el tiempo o demasiado desperdicio. Las decisiones importan.', 'defeat');
      showResultPanel(false, 0);
    }
    updateHUD();
    updateTimerBar();
    draw();
  }

  function showRestartButton() {
    var btn = document.getElementById('btn-restart');
    if (btn) btn.classList.add('show');
  }

  function hideRestartButton() {
    var btn = document.getElementById('btn-restart');
    if (btn) btn.classList.remove('show');
  }

  function updateHUD() {
    var timerEl = document.getElementById('timer');
    var wasteEl = document.getElementById('waste');
    var enRouteEl = document.getElementById('en-route-count');
    if (timerEl) timerEl.textContent = Math.max(0, Math.ceil(timeLeft));
    if (wasteEl) wasteEl.textContent = wasteCount;
    if (enRouteEl) enRouteEl.textContent = deliveries.length;
  }

  function showMessage(text, type) {
    var box = document.getElementById('message-box');
    if (!box) return;
    box.textContent = text;
    box.className = 'show ' + (type || '');
  }

  function hideMessage() {
    var box = document.getElementById('message-box');
    if (box) box.classList.remove('show');
  }

  function hexToRgba(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    var r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }

  function drawNodeGlow(x, y, radius, hexColor) {
    var gradient = ctx.createRadialGradient(x, y, radius * 0.5, x, y, radius + 14);
    gradient.addColorStop(0, hexToRgba(hexColor, 0.35));
    gradient.addColorStop(0.6, hexToRgba(hexColor, 0.08));
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius + 14, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawNode(x, y, radius, fillStyle, isHighlight) {
    ctx.save();
    if (isHighlight) drawNodeGlow(x, y, radius, fillStyle);
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = isHighlight ? 14 : 8;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = isHighlight ? 2.5 : 1.5;
    ctx.stroke();
    ctx.restore();
  }

  function drawProgressRing(x, y, radius, received, need) {
    if (need <= 0) return;
    var inner = radius - 6;
    ctx.save();
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(x, y, inner, 0, Math.PI * 2);
    ctx.stroke();
    var pct = Math.min(received / need, 1);
    if (pct > 0) {
      ctx.strokeStyle = COLORS.communityFed;
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(x, y, inner, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct);
      ctx.stroke();
    }
    ctx.restore();
  }

  function draw() {
    if (!ctx) return;
    var bgGradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    bgGradient.addColorStop(0, '#0f221c');
    bgGradient.addColorStop(1, '#0a1612');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    var step = 40;
    for (var x = 0; x <= CANVAS_WIDTH; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (var y = 0; y <= CANVAS_HEIGHT; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    var now = Date.now() / 1000;
    var pulse = 0.7 + 0.3 * Math.sin(now * 4);

    for (var i = 0; i < deliveries.length; i++) {
      var d = deliveries[i];
      var t = 1 - d.timeLeft / DELIVERY_TIME;
      var px = d.from.x + (d.to.x - d.from.x) * t;
      var py = d.from.y + (d.to.y - d.from.y) * t;
      ctx.save();
      ctx.setLineDash([12, 8]);
      ctx.lineDashOffset = -now * 80;
      ctx.strokeStyle = 'rgba(75, 201, 138, 0.5)';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(d.from.x, d.from.y);
      ctx.lineTo(px, py);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
      ctx.beginPath();
      ctx.arc(px, py, 12, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.sourceHighlight;
      ctx.shadowColor = 'rgba(75, 201, 138, 0.8)';
      ctx.shadowBlur = 12 * pulse;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    if (selectedNode && selectedNode.type === 'source' && cursorPos) {
      var src = selectedNode.node;
      ctx.save();
      ctx.strokeStyle = 'rgba(75, 201, 138, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(src.x, src.y);
      ctx.lineTo(cursorPos.x, cursorPos.y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    particles.forEach(function (pt) {
      ctx.globalAlpha = pt.life;
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    communities.forEach(function (c) {
      var isSelected = selectedNode && selectedNode.type === 'community' && selectedNode.node === c;
      var isHover = hoverNode && hoverNode.type === 'community' && hoverNode.node === c;
      var fill = c.received >= c.need ? COLORS.communityFed : (isSelected || isHover ? COLORS.communityHighlight : COLORS.community);
      drawNode(c.x, c.y, NODE_RADIUS, fill, isSelected || isHover);
      drawProgressRing(c.x, c.y, NODE_RADIUS, c.received, c.need);
      ctx.fillStyle = COLORS.text;
      ctx.font = '600 14px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(c.received + '/' + c.need, c.x, c.y + 2);
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.font = '500 11px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(c.label, c.x, c.y + NODE_RADIUS + 14);
    });

    sources.forEach(function (s) {
      var isSelected = selectedNode && selectedNode.type === 'source' && selectedNode.node === s;
      var isHover = hoverNode && hoverNode.type === 'source' && hoverNode.node === s;
      var fill = isSelected || isHover ? COLORS.sourceHighlight : COLORS.source;
      drawNode(s.x, s.y, NODE_RADIUS, fill, isSelected || isHover);
      ctx.fillStyle = COLORS.text;
      ctx.font = '600 14px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(s.food + '', s.x, s.y + 2);
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.font = '500 11px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(s.label, s.x, s.y + NODE_RADIUS + 14);
    });

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '500 11px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('Verde: fuente · Naranja: comunidad', 20, CANVAS_HEIGHT - 14);
  }

  function bindEvents() {
    window.addEventListener('resize', resizeCanvas);

    document.getElementById('btn-play')?.addEventListener('click', function () {
      Sound.unlock();
      Sound.playSelect();
      currentLevelIndex = 0;
      init(0);
      showGame();
    });

    document.getElementById('btn-restart')?.addEventListener('click', function () {
      Sound.unlock();
      Sound.playSelect();
      hideMessage();
      hideRestartButton();
      hideResultPanel();
      init(currentLevelIndex);
      startCountdown();
    });

    document.getElementById('btn-retry')?.addEventListener('click', function () {
      Sound.unlock();
      Sound.playSelect();
      hideResultPanel();
      init(currentLevelIndex);
      startCountdown();
    });

    document.getElementById('btn-next')?.addEventListener('click', function () {
      Sound.unlock();
      Sound.playSelect();
      hideResultPanel();
      if (currentLevelIndex < LEVELS.length - 1) {
        currentLevelIndex++;
        init(currentLevelIndex);
        startCountdown();
      } else {
        showMenu();
      }
    });

    try {
      var savedMuted = localStorage.getItem(STORAGE_KEY_MUTED);
      if (savedMuted === '1') {
        Sound.setMuted(true);
        var btnSound = document.getElementById('btn-sound-toggle');
        if (btnSound) btnSound.classList.add('muted');
      }
    } catch (e) {}
    document.getElementById('btn-sound-toggle')?.addEventListener('click', function () {
      Sound.setMuted(!Sound.isMuted());
      this.classList.toggle('muted', Sound.isMuted());
      this.setAttribute('aria-label', Sound.isMuted() ? 'Activar sonido' : 'Desactivar sonido');
      try {
        localStorage.setItem(STORAGE_KEY_MUTED, Sound.isMuted() ? '1' : '0');
      } catch (e) {}
    });

    var instructionsToggle = document.getElementById('instructions-toggle');
    var instructionsContent = document.getElementById('instructions-content');
    if (instructionsToggle && instructionsContent) {
      instructionsToggle.addEventListener('click', function () {
        var expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !expanded);
        instructionsContent.hidden = expanded;
      });
    }

    if (canvas) {
      canvas.addEventListener('pointerdown', onPointerDown);
      canvas.addEventListener('pointermove', onPointerMove);
      canvas.addEventListener('pointerup', onPointerUp);
      canvas.addEventListener('pointercancel', onPointerUp);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      showScreen('main-menu');
      bindEvents();
    });
  } else {
    showScreen('main-menu');
    bindEvents();
  }
})();
