/* Katzensprung – kleines Jump & Run mit der Katze Minka */
(function () {
  'use strict';

  const TS = 32, G = 1900, MAXFALL = 820, RUN = 190, JUMP = 575, CLIMB = 135, HOP = 440;
  const STEP = 1 / 120;

  const FUR = '#f39a3d', FUR_D = '#d4712a', FUR_L = '#ffe3bf', PINK = '#ff9aa8', INK = '#2b1d14';

  // Himmel: oben, unten, ferne Hügel, nahe Hügel, Sonne
  const SKIES = [
    ['#8fd3fb', '#e8f7ff', '#b9e3c6', '#8fcf95', '#fff3b0'],
    ['#79bdf2', '#d6eeff', '#aac9e0', '#7fb48a', '#fff7c2'],
    ['#78d0c8', '#e4f7ea', '#9fd8a8', '#6fbf73', '#fff1a8'],
    ['#f7c58a', '#fff0d9', '#e3b98f', '#b9a06a', '#ffe08a'],
    ['#8ea6f0', '#f0dcf7', '#b9b3e6', '#8f8fcf', '#fff4d6'],
    ['#ff8f70', '#ffd9a3', '#e59a7d', '#b8705e', '#fff0b3'],
  ];

  /* ---------------- Level ---------------- */
  const LEVELS = [
    {
      name: 'Der Garten', sky: 0, W: 44, H: 10,
      intro: 'Minka hat Durst! Lauf durch den Garten, spring über die Steine und kletter über die Mauer zur Milch.',
      build(b) {
        b.ground(0, 43, 8);
        b.start(2, 7);
        b.sign(4, 7, 'Mit ◀ ▶ läufst du, mit dem großen Knopf rechts springst du.');
        b.wall(9, 7, 1, 1);
        b.fish(12, 5);
        b.wall(14, 6, 2, 2);
        b.sign(19, 7, 'Lauf gegen eine Mauer und halte die Richtung gedrückt: Minka klettert hoch!');
        b.fish(21, 7);
        b.wall(24, 3, 2, 5);
        b.fish(25, 2);
        b.tree(32, 8, 4);
        b.fish(32, 3);
        b.block(37, 6, 7, 2);
        b.milk(41, 5);
      },
    },
    {
      name: 'Der Hinterhof', sky: 1, W: 56, H: 12,
      intro: 'Überall Pfützen! Bleib trocken, kletter über die Mauern und nutze die Bretter über dem Wasser.',
      build(b) {
        b.ground(0, 55, 10);
        b.start(2, 9);
        b.sign(4, 9, 'Vorsicht, Wasser! Katzen mögen keine nassen Pfoten.');
        b.wall(7, 7, 2, 3);
        b.water(11, 12, 10);
        b.fish(11, 7);
        b.wall(17, 5, 3, 5);
        b.plank(22, 4, 3);
        b.fish(23, 3);
        b.water(21, 26, 10);
        b.checkpoint(29, 9);
        b.wall(33, 3, 2, 7);
        b.water(35, 40, 10);
        b.plank(37, 5, 2);
        b.fish(37, 4);
        b.wall(41, 3, 1, 7);
        b.block(46, 8, 2, 2);
        b.block(48, 6, 8, 4);
        b.milk(53, 5);
      },
    },
    {
      name: 'Im Park', sky: 2, W: 60, H: 14,
      intro: 'Im Park wachsen hohe Bäume. Kletter die Stämme hoch und spring von Baumkrone zu Baumkrone.',
      build(b) {
        b.ground(0, 59, 12);
        b.start(2, 11);
        b.sign(5, 11, 'Bäume kannst du genauso hochklettern wie Mauern. Im Laub oben kannst du stehen.');
        b.tree(10, 12, 4);
        b.tree(16, 12, 7);
        b.fish(16, 4);
        b.water(18, 21, 12);
        b.tree(23, 12, 7);
        b.fish(23, 4);
        b.water(25, 28, 12);
        b.tree(31, 12, 6);
        b.checkpoint(35, 11);
        b.tree(42, 12, 9);
        b.plank(43, 8, 2);
        b.fish(44, 7);
        b.fish(42, 2);
        b.thorns(45, 47, 11);
        b.block(48, 7, 12, 5);
        b.milk(55, 6);
      },
    },
    {
      name: 'Die Stadtmauer', sky: 3, W: 64, H: 14,
      intro: 'Hohe Mauern, Dornenbüsche und zwei Hunde. Spring über die Hunde oder kletter ihnen davon.',
      build(b) {
        b.ground(0, 63, 12);
        b.start(2, 11);
        b.sign(4, 11, 'Tipp: Hängst du an einer Mauer, springst du mit dem Sprung-Knopf von ihr ab.');
        b.wall(8, 7, 2, 5);
        b.water(10, 12, 12);
        b.fish(11, 8);
        b.sign(14, 11, 'Achtung, Hund! Warte, bis er wegläuft, und spring über ihn drüber.');
        b.wall(16, 11, 1, 1);
        b.dog(20, 11);
        b.wall(25, 4, 2, 8);
        b.plank(29, 4, 3);
        b.fish(30, 3);
        b.thorns(27, 34, 11);
        b.wall(35, 6, 2, 6);
        b.checkpoint(36, 5);
        b.wall(39, 11, 1, 1);
        b.dog(45, 11);
        b.fish(46, 9);
        b.wall(51, 2, 1, 10);
        b.fish(51, 1);
        b.water(52, 54, 12);
        b.milk(59, 11);
      },
    },
    {
      name: 'Der hohe Turm', sky: 4, W: 24, H: 40,
      intro: 'Die Milch steht ganz oben auf dem Turm. Kletter und spring immer weiter nach oben.',
      build(b) {
        b.ground(0, 23, 38);
        b.block(0, 0, 1, 38);
        b.block(23, 0, 1, 38);
        b.start(3, 37);
        b.sign(5, 37, 'Ganz oben wartet die Milch. Nicht nach unten schauen!');
        b.wall(8, 32, 2, 6);
        b.plank(12, 30, 4);
        b.fish(14, 29);
        b.thorns(12, 22, 37);
        b.wall(18, 22, 2, 10);
        b.plank(9, 21, 7);
        b.checkpoint(12, 20);
        b.wall(5, 12, 2, 10);
        b.fish(6, 11);
        b.plank(9, 11, 3);
        b.wall(15, 3, 1, 8);
        b.fish(15, 2);
        b.plank(17, 4, 6);
        b.milk(20, 3);
      },
    },
    {
      name: 'Der große Baum', sky: 5, W: 70, H: 18,
      intro: 'Das letzte Stück! Ganz oben im großen Baum steht Minkas Schale Milch.',
      build(b) {
        b.ground(0, 69, 16);
        b.start(2, 15);
        b.sign(4, 15, 'Hinter dem Zaun läuft ein Hund herum. Kletter schnell die Mauer hoch!');
        b.wall(7, 12, 1, 4);
        b.wall(9, 15, 1, 1);
        b.dog(13, 15);
        b.wall(17, 10, 2, 6);
        b.fish(17, 9);
        b.water(19, 22, 16);
        b.thorns(25, 41, 15);
        b.tree(24, 16, 9);
        b.fish(24, 6);
        b.tree(31, 16, 11);
        b.checkpoint(31, 4);
        b.plank(36, 6, 3);
        b.fish(37, 5);
        b.wall(42, 2, 2, 14);
        b.fish(43, 1);
        b.wall(46, 15, 1, 1);
        b.dog(51, 15);
        b.tree(56, 16, 13);
        b.plank(57, 10, 2);
        b.fish(58, 9);
        b.milk(56, 2);
      },
    },
  ];

  function buildLevel(def) {
    const W = def.W, H = def.H;
    const grid = [];
    for (let y = 0; y < H; y++) grid.push(new Array(W).fill('.'));
    const lv = { def, W, H, grid, fish: [], dogs: [], signs: [], checkpoints: [], start: null, milk: null };
    const set = (x, y, c) => { if (x >= 0 && x < W && y >= 0 && y < H) grid[y][x] = c; };
    const fill = (x, y, w, h, c) => { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) set(i, j, c); };
    def.build({
      ground: (x0, x1, top) => fill(x0, top, x1 - x0 + 1, H - top, '#'),
      block: (x, y, w, h) => fill(x, y, w, h, '#'),
      wall: (x, y, w, h) => fill(x, y, w, h, 'B'),
      plank: (x, y, w) => fill(x, y, w, 1, '-'),
      water: (x0, x1, row) => fill(x0, row, x1 - x0 + 1, 1, 'w'),
      thorns: (x0, x1, row) => fill(x0, row, x1 - x0 + 1, 1, '^'),
      tree: (x, base, h) => { fill(x, base - h, 1, h, 'T'); fill(x - 2, base - h, 5, 1, 'L'); },
      start: (x, y) => { lv.start = { x: x * TS + TS / 2, y: (y + 1) * TS }; },
      milk: (x, y) => { lv.milk = { x: x * TS, y: y * TS }; },
      fish: (x, y) => lv.fish.push({ x: x * TS + 16, y: y * TS + 16, got: false }),
      dog: (x, y) => lv.dogs.push({ x: x * TS, y: (y + 1) * TS - 22, w: 30, h: 22, dir: -1, t: Math.random() * 5, x0: x * TS }),
      sign: (x, y, text) => lv.signs.push({ x: x * TS + 16, y: (y + 1) * TS, text }),
      checkpoint: (x, y) => lv.checkpoints.push({ x: x * TS + 16, y: (y + 1) * TS, on: false }),
    });
    return lv;
  }

  const isSolid = ch => ch === '#' || ch === 'B' || ch === 'T';
  const isClimb = ch => ch === 'B' || ch === 'T';
  const isOneWay = ch => ch === 'L' || ch === '-';
  const approach = (v, target, d) => v < target ? Math.min(v + d, target) : Math.max(v - d, target);
  const hash = (a, b) => { let h = (a * 374761393 + b * 668265263) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return (h ^ (h >>> 16)) >>> 0; };

  /* ---------------- Speicher ---------------- */
  const STORE = 'katzensprung-fortschritt';
  function loadProgress() { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; } }
  function saveProgress(n, fish) {
    try {
      const p = loadProgress();
      p[n] = Math.max(p[n] || 0, fish);
      localStorage.setItem(STORE, JSON.stringify(p));
    } catch (e) { /* egal */ }
  }

  /* ---------------- Zeichnen: Figuren ---------------- */
  function ellipse(ctx, x, y, rx, ry, rot) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot || 0, 0, Math.PI * 2); ctx.fill(); }
  function circle(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
  function tri(ctx, a, b, c, d, e, f) { ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.lineTo(e, f); ctx.closePath(); ctx.fill(); }

  function drawCat(ctx, cx, by, face, mode, ph, blink) {
    ctx.save();
    ctx.translate(cx, by);
    ctx.scale(face, 1);
    if (mode === 'climb') { ctx.translate(0, -10); ctx.rotate(-Math.PI / 2); ctx.translate(-2, 12); }
    const run = mode === 'run', air = mode === 'air', climb = mode === 'climb', drink = mode === 'drink', dead = mode === 'dead';
    const bob = run ? -Math.abs(Math.sin(ph)) * 1.5 : (mode === 'idle' || drink ? Math.sin(ph * 0.5) * 0.4 : 0);

    // Schwanz
    const sw = Math.sin(ph * (run || climb ? 1 : 0.35)) * 3;
    const tail = () => {
      ctx.beginPath(); ctx.moveTo(-12, -11 + bob);
      if (air) ctx.quadraticCurveTo(-22, -12, -27, -18 + sw);
      else if (dead) ctx.quadraticCurveTo(-20, -6, -26, -4);
      else ctx.quadraticCurveTo(-23, -10, -21 + sw, -25);
      ctx.stroke();
    };
    ctx.lineCap = 'round';
    ctx.strokeStyle = FUR_D; ctx.lineWidth = 5.5; tail();
    ctx.strokeStyle = FUR; ctx.lineWidth = 3.6; tail();

    // Beine
    [-9, -4, 6, 11].forEach((lx, i) => {
      let dx = 0;
      if (run || climb) dx = Math.sin(ph + (i % 2 ? Math.PI : 0) + (i > 1 ? Math.PI / 2 : 0)) * 3;
      if (air) dx = i < 2 ? -3 : 3;
      ctx.fillStyle = i % 2 ? FUR : FUR_D;
      ctx.fillRect(lx + dx - 2.2, -9 + bob, 4.4, 9 - bob);
      ctx.fillStyle = FUR_L; ctx.fillRect(lx + dx - 2.2, -2, 4.4, 2);
    });

    // Körper
    ctx.fillStyle = FUR; ellipse(ctx, 0, -12 + bob, 13.5, 7.5);
    ctx.fillStyle = FUR_L; ellipse(ctx, 1.5, -7.5 + bob, 8, 3);
    ctx.strokeStyle = FUR_D; ctx.lineWidth = 2;
    [-8, -3, 2].forEach(sx => {
      ctx.beginPath(); ctx.moveTo(sx, -19 + bob); ctx.quadraticCurveTo(sx + 2.5, -16 + bob, sx + 1, -12.5 + bob); ctx.stroke();
    });

    // Kopf
    const hx = drink ? 15 : 11, hy = (drink ? -9 : -18) + bob;
    ctx.fillStyle = FUR;
    tri(ctx, hx - 6.5, hy - 3, hx - 5, hy - 12.5, hx + 0.5, hy - 6);
    tri(ctx, hx + 0.5, hy - 6, hx + 4.5, hy - 12.5, hx + 7, hy - 3);
    ctx.fillStyle = PINK;
    tri(ctx, hx - 4.8, hy - 5, hx - 4.3, hy - 10, hx - 1.4, hy - 6.4);
    tri(ctx, hx + 2, hy - 6.4, hx + 4.4, hy - 10, hx + 5.4, hy - 4.8);
    ctx.fillStyle = FUR; circle(ctx, hx, hy, 7.6);
    ctx.fillStyle = FUR_D; ctx.fillRect(hx - 2, hy - 7.4, 1.4, 3); ctx.fillRect(hx + 0.6, hy - 7.6, 1.4, 3.2);
    ctx.fillStyle = FUR_L; ellipse(ctx, hx + 4.6, hy + 3, 3.9, 2.9);
    // Augen
    if (dead) {
      ctx.strokeStyle = INK; ctx.lineWidth = 1.2;
      [[hx + 0.5, hy - 1], [hx + 5, hy - 1.3]].forEach(([ex, ey]) => {
        ctx.beginPath(); ctx.moveTo(ex - 1.5, ey - 1.5); ctx.lineTo(ex + 1.5, ey + 1.5); ctx.moveTo(ex + 1.5, ey - 1.5); ctx.lineTo(ex - 1.5, ey + 1.5); ctx.stroke();
      });
    } else if (blink || drink) {
      ctx.strokeStyle = INK; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(hx - 1.2, hy - 1); ctx.quadraticCurveTo(hx + 0.5, hy + 0.4, hx + 2.2, hy - 1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(hx + 3.4, hy - 1.3); ctx.quadraticCurveTo(hx + 5, hy, hx + 6.6, hy - 1.3); ctx.stroke();
    } else {
      ctx.fillStyle = INK; circle(ctx, hx + 0.5, hy - 1, 1.8); circle(ctx, hx + 5, hy - 1.3, 1.8);
      ctx.fillStyle = '#fff'; circle(ctx, hx + 1.1, hy - 1.7, 0.65); circle(ctx, hx + 5.6, hy - 2, 0.65);
    }
    ctx.fillStyle = PINK; circle(ctx, hx + 7.4, hy + 1.4, 1.25);
    if (drink && Math.sin(ph * 3) > 0) { ctx.fillStyle = '#ff7b8d'; ellipse(ctx, hx + 8, hy + 5, 1.4, 1.8); }
    ctx.strokeStyle = 'rgba(70,45,25,.55)'; ctx.lineWidth = 0.6;
    ctx.beginPath(); ctx.moveTo(hx + 6, hy + 3); ctx.lineTo(hx + 12.5, hy + 1.8); ctx.moveTo(hx + 6, hy + 3.6); ctx.lineTo(hx + 12.5, hy + 4.8); ctx.stroke();
    ctx.restore();
  }

  function drawBowl(ctx, x, y, t) {
    // x,y = linke obere Ecke der Kachel
    ctx.save();
    const glow = ctx.createRadialGradient(x + 16, y + 20, 2, x + 16, y + 20, 30);
    glow.addColorStop(0, 'rgba(255,255,255,.75)'); glow.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = glow; circle(ctx, x + 16, y + 20, 30);
    ctx.fillStyle = '#2f6fc8';
    ctx.beginPath(); ctx.moveTo(x + 2, y + 20); ctx.lineTo(x + 30, y + 20); ctx.quadraticCurveTo(x + 28, y + 32, x + 22, y + 32);
    ctx.lineTo(x + 10, y + 32); ctx.quadraticCurveTo(x + 4, y + 32, x + 2, y + 20); ctx.fill();
    ctx.fillStyle = '#5b95e6'; ctx.fillRect(x + 5, y + 24, 22, 2.5);
    ctx.fillStyle = '#fffdf6'; ellipse(ctx, x + 16, y + 20, 14, 3.6);
    ctx.fillStyle = '#f1ece0'; ellipse(ctx, x + 18, y + 20.5, 7, 1.5);
    // Funkeln
    for (let i = 0; i < 3; i++) {
      const a = t * 1.8 + i * 2.1, sx = x + 16 + Math.cos(a) * 18, sy = y + 6 + Math.sin(a * 1.3) * 6;
      const s = 1.6 + Math.sin(t * 5 + i) * 0.9;
      ctx.fillStyle = 'rgba(255,255,255,.95)';
      ctx.beginPath(); ctx.moveTo(sx, sy - s * 2); ctx.lineTo(sx + s * 0.6, sy); ctx.lineTo(sx, sy + s * 2); ctx.lineTo(sx - s * 0.6, sy); ctx.fill();
    }
    ctx.restore();
  }

  /* ---------------- Startseite: kleine Animation ---------------- */
  function runHero(cv) {
    const ctx = cv.getContext('2d');
    let t = 0, last = performance.now();
    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(cv.clientWidth * dpr); cv.height = Math.round(cv.clientHeight * dpr);
    }
    size(); window.addEventListener('resize', size);
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    function frame(now) {
      t += Math.min(0.05, (now - last) / 1000); last = now;
      const s = cv.height / 96, w = cv.width / s;
      ctx.setTransform(s, 0, 0, s, 0, 0);
      ctx.clearRect(0, 0, w, 96);
      // Mauer
      for (let c = 0; c * TS < w + TS; c++) {
        for (let k = 0; k < 2; k++) {
          const off = (k % 2) ? 8 : 0;
          for (let bx = -off; bx < TS; bx += 16) {
            const x0 = Math.max(bx, 0), x1 = Math.min(bx + 16, TS);
            ctx.fillStyle = ['#c0583f', '#b44f38', '#c96447'][hash(c * 7 + bx, k) % 3];
            ctx.fillRect(c * TS + x0 + 0.5, 64 + k * 16 + 0.5, x1 - x0 - 1, 15);
          }
        }
      }
      ctx.fillStyle = '#d9d0c4'; ctx.fillRect(0, 62, w, 4);
      const bowlX = w - 60;
      drawBowl(ctx, bowlX, 30, t);
      const cycle = 7, ct = reduce ? cycle * 0.75 : t % cycle;
      const runDur = 4.2;
      const startX = 30, endX = bowlX - 8;
      let x, mode, ph = t * 12;
      if (ct < runDur) { x = startX + (endX - startX) * (ct / runDur); mode = 'run'; }
      else { x = endX; mode = 'drink'; ph = t * 3; }
      drawCat(ctx, x, 62, 1, mode, ph, false);
      if (!reduce) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------------- Spiel ---------------- */
  function runGame(levelNo) {
    const def = LEVELS[levelNo - 1];
    let lv = buildLevel(def);
    const fishTotal = lv.fish.length;

    document.title = `Katzensprung · Level ${levelNo}`;
    const ICON = {
      restart: '<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.4-5.7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M4 3v5h5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      sound: '<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path class="wave" d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
      full: '<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      menu: '<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
      fish: '<svg viewBox="0 0 28 16"><path d="M2 8c4-6 13-7 18 0-5 7-14 6-18 0z" fill="#5aa9e6"/><path d="M19 8l7-5v10z" fill="#5aa9e6"/><circle cx="7" cy="6.8" r="1.4" fill="#1d3557"/></svg>',
    };
    const nextHref = levelNo < LEVELS.length ? `level${levelNo + 1}.html` : null;

    document.body.insertAdjacentHTML('beforeend', `
      <canvas id="game"></canvas>
      <div class="hud">
        <div class="hud-left">
          <span class="hud-level">Level ${levelNo}</span>
          <span class="hud-name">${def.name}</span>
          <span class="hud-fish">${ICON.fish}<b id="fishCount">0/${fishTotal}</b></span>
        </div>
        <div class="hud-right">
          <button class="icon-btn" id="btnRestart" aria-label="Level neu starten">${ICON.restart}</button>
          <button class="icon-btn" id="btnSound" aria-label="Ton an oder aus">${ICON.sound}</button>
          <button class="icon-btn" id="btnFull" aria-label="Vollbild">${ICON.full}</button>
          <a class="icon-btn" href="index.html" aria-label="Zur Levelübersicht">${ICON.menu}</a>
        </div>
      </div>
      <div class="sign-banner" id="signBanner" hidden></div>
      <div class="toast" id="toast"></div>
      <div class="controls" id="controls">
        <div class="pad pad-left">
          <button data-k="l" aria-label="Nach links"><svg viewBox="0 0 24 24"><path d="M15 4L7 12l8 8" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          <button data-k="r" aria-label="Nach rechts"><svg viewBox="0 0 24 24"><path d="M9 4l8 8-8 8" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        </div>
        <div class="pad pad-right">
          <button data-k="j" class="jump" aria-label="Springen"><svg viewBox="0 0 24 24"><path d="M5 15l7-7 7 7" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Sprung</span></button>
        </div>
      </div>
      <div class="overlay" id="startOv">
        <div class="card">
          <p class="eyebrow">Level ${levelNo} von ${LEVELS.length}</p>
          <h1>${def.name}</h1>
          <p>${def.intro}</p>
          <p class="small">Sammle unterwegs ${fishTotal} Fische. Fahnen speichern deinen Weg.<span class="kbd-hint"> Am Computer: Pfeiltasten und Leertaste.</span></p>
          <button class="big-btn" id="btnStart">Los geht's</button>
        </div>
      </div>
      <div class="overlay" id="winOv" hidden>
        <div class="card">
          <p class="eyebrow">Level ${levelNo} geschafft</p>
          <h1>${nextHref ? 'Mmmh, Milch!' : 'Alle Level geschafft!'}</h1>
          <p id="winText"></p>
          <div class="btn-row">
            ${nextHref ? `<a class="big-btn" href="${nextHref}">Nächstes Level</a>` : `<a class="big-btn" href="index.html">Zur Übersicht</a>`}
            <button class="ghost-btn" id="btnAgain">Nochmal spielen</button>
          </div>
        </div>
      </div>
      <div class="rotate" id="rotateOv">
        <div class="phone"></div>
        <p>Bitte dreh dein Handy quer</p>
      </div>
    `);

    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const $ = id => document.getElementById(id);
    const fishCountEl = $('fishCount'), signBanner = $('signBanner'), toastEl = $('toast');
    const startOv = $('startOv'), winOv = $('winOv');

    /* --- Ton --- */
    let ac = null, muted = false;
    try { muted = localStorage.getItem('katzensprung-ton') === 'aus'; } catch (e) { /* egal */ }
    document.body.classList.toggle('muted', muted);
    function audioInit() {
      if (ac) { if (ac.state === 'suspended') ac.resume(); return; }
      try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ac = null; }
    }
    function tone(type, f0, f1, dur, vol, delay) {
      if (!ac || muted) return;
      const t0 = ac.currentTime + (delay || 0);
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = type; o.frequency.setValueAtTime(f0, t0); o.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(ac.destination); o.start(t0); o.stop(t0 + dur + 0.02);
    }
    function sfx(kind) {
      if (kind === 'jump') tone('square', 320, 620, 0.12, 0.05);
      else if (kind === 'fish') { tone('sine', 880, 1320, 0.09, 0.12); tone('sine', 1320, 1760, 0.12, 0.1, 0.08); }
      else if (kind === 'splash') { tone('triangle', 600, 90, 0.35, 0.18); tone('sine', 300, 120, 0.25, 0.1, 0.05); }
      else if (kind === 'ouch') tone('sawtooth', 420, 160, 0.25, 0.08);
      else if (kind === 'flag') { tone('sine', 523, 523, 0.1, 0.1); tone('sine', 784, 784, 0.16, 0.1, 0.1); }
      else if (kind === 'win') {
        tone('sawtooth', 500, 900, 0.18, 0.06); tone('sawtooth', 900, 520, 0.35, 0.06, 0.17);
        [523, 659, 784, 1046].forEach((f, i) => tone('triangle', f, f, 0.18, 0.1, 0.55 + i * 0.12));
      }
    }

    /* --- Eingabe --- */
    const keys = { l: false, r: false, j: false }, touch = { l: false, r: false, j: false };
    let jumpBuf = 0;
    const inp = () => ({ l: keys.l || touch.l, r: keys.r || touch.r, j: keys.j || touch.j });
    const KEYMAP = { ArrowLeft: 'l', KeyA: 'l', ArrowRight: 'r', KeyD: 'r', ArrowUp: 'j', KeyW: 'j', Space: 'j' };
    addEventListener('keydown', e => {
      const k = KEYMAP[e.code];
      if (!k) { if (e.code === 'Enter' && state === 'intro') startGame(); return; }
      e.preventDefault();
      if (state === 'intro') { startGame(); }
      if (k === 'j' && !e.repeat) jumpBuf = 0.14;
      keys[k] = true;
    });
    addEventListener('keyup', e => { const k = KEYMAP[e.code]; if (k) keys[k] = false; });
    addEventListener('blur', () => { keys.l = keys.r = keys.j = false; });

    const ctrlBtns = Array.from(document.querySelectorAll('#controls [data-k]'));
    function onTouches(e) {
      const inUi = e.target.closest && e.target.closest('.hud, .overlay, .sign-banner');
      if (!inUi && e.cancelable) e.preventDefault();
      document.body.classList.add('touch');
      const st = { l: false, r: false, j: false };
      const rects = ctrlBtns.map(b => b.getBoundingClientRect());
      for (const tch of e.touches) {
        let best = -1, bestD = 30;
        rects.forEach((rc, i) => {
          const dx = Math.max(rc.left - tch.clientX, 0, tch.clientX - rc.right);
          const dy = Math.max(rc.top - tch.clientY, 0, tch.clientY - rc.bottom);
          const d = Math.hypot(dx, dy);
          if (d < bestD) { bestD = d; best = i; }
        });
        if (best >= 0) st[ctrlBtns[best].dataset.k] = true;
      }
      if (st.j && !touch.j) jumpBuf = 0.14;
      Object.assign(touch, st);
      ctrlBtns.forEach(b => b.classList.toggle('on', st[b.dataset.k]));
      audioInit();
    }
    ['touchstart', 'touchmove', 'touchend', 'touchcancel'].forEach(ev => document.addEventListener(ev, onTouches, { passive: false }));
    // Maus auf den Knöpfen (z. B. Tablet mit Stift oder Test am PC)
    ctrlBtns.forEach(b => {
      b.addEventListener('mousedown', () => { const k = b.dataset.k; touch[k] = true; if (k === 'j') jumpBuf = 0.14; b.classList.add('on'); });
      const up = () => { touch[b.dataset.k] = false; b.classList.remove('on'); };
      b.addEventListener('mouseup', up); b.addEventListener('mouseleave', up);
    });
    if (window.matchMedia && matchMedia('(pointer: coarse)').matches) document.body.classList.add('touch');

    /* --- Knöpfe --- */
    function goFullscreen() {
      const el = document.documentElement;
      const req = el.requestFullscreen || el.webkitRequestFullscreen;
      if (!req || document.fullscreenElement || document.webkitFullscreenElement) return;
      try {
        const p = req.call(el, { navigationUI: 'hide' });
        const lock = () => { try { const r = screen.orientation && screen.orientation.lock && screen.orientation.lock('landscape'); if (r && r.catch) r.catch(() => {}); } catch (e) { /* egal */ } };
        if (p && p.then) p.then(lock).catch(() => {}); else lock();
      } catch (e) { /* egal */ }
    }
    $('btnFull').addEventListener('click', () => {
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      } else goFullscreen();
    });
    $('btnSound').addEventListener('click', () => {
      muted = !muted; document.body.classList.toggle('muted', muted);
      try { localStorage.setItem('katzensprung-ton', muted ? 'aus' : 'an'); } catch (e) { /* egal */ }
      audioInit();
    });
    $('btnRestart').addEventListener('click', e => { e.currentTarget.blur(); restartLevel(); });
    $('btnStart').addEventListener('click', startGame);
    $('btnAgain').addEventListener('click', () => { winOv.hidden = true; restartLevel(); });

    function startGame() {
      if (state !== 'intro') return;
      audioInit();
      if (document.body.classList.contains('touch')) goFullscreen();
      startOv.hidden = true;
      state = 'play';
    }

    let toastTimer = 0;
    function toast(msg) {
      toastEl.textContent = msg; toastEl.classList.add('show');
      clearTimeout(toastTimer); toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1700);
    }

    /* --- Spielzustand --- */
    let state = 'intro', t = 0, deadT = 0, deathKind = '', winT = 0, fishGot = 0;
    const p = { x: 0, y: 0, w: 24, h: 20, vx: 0, vy: 0, onGround: false, climbing: false, face: 1, lock: 0, coyote: 0, hopping: false, ph: 0, inv: 0, blinkT: 2 };
    let respawn = lv.start;
    const particles = [];

    function placeAt(pt) {
      p.x = pt.x - p.w / 2; p.y = pt.y - p.h;
      p.vx = p.vy = 0; p.climbing = false; p.onGround = false; p.lock = 0; p.hopping = false; p.face = 1;
    }
    placeAt(respawn);

    function restartLevel() {
      lv = buildLevel(def);
      respawn = lv.start; fishGot = 0; fishCountEl.textContent = `0/${fishTotal}`;
      particles.length = 0; placeAt(respawn); p.inv = 0;
      state = 'play'; winOv.hidden = true; startOv.hidden = true;
      snapCamera();
    }

    const tile = (c, r) => (c < 0 || c >= lv.W) ? '#' : (r < 0 || r >= lv.H) ? '.' : lv.grid[r][c];

    function moveX(dx) {
      if (!dx) return;
      p.x += dx;
      const top = Math.floor(p.y / TS), bot = Math.floor((p.y + p.h - 1) / TS);
      if (dx > 0) {
        const c = Math.floor((p.x + p.w - 0.001) / TS);
        for (let r = top; r <= bot; r++) if (isSolid(tile(c, r))) { p.x = c * TS - p.w; p.vx = 0; return; }
      } else {
        const c = Math.floor(p.x / TS);
        for (let r = top; r <= bot; r++) if (isSolid(tile(c, r))) { p.x = (c + 1) * TS; p.vx = 0; return; }
      }
    }
    function moveY(dy) {
      const prevBottom = p.y + p.h;
      p.y += dy; p.onGround = false;
      const l = Math.floor(p.x / TS), rr = Math.floor((p.x + p.w - 0.001) / TS);
      if (dy > 0) {
        const row = Math.floor((p.y + p.h - 0.001) / TS);
        for (let c = l; c <= rr; c++) {
          const ch = tile(c, row);
          if (isSolid(ch) || (isOneWay(ch) && prevBottom <= row * TS + 0.5)) {
            p.y = row * TS - p.h; p.vy = 0; p.onGround = true; return;
          }
        }
      } else if (dy < 0) {
        const row = Math.floor(p.y / TS);
        for (let c = l; c <= rr; c++) if (isSolid(tile(c, row))) { p.y = (row + 1) * TS; p.vy = 0; return; }
      }
    }
    function climbSide(dir) {
      const px = dir > 0 ? p.x + p.w + 0.5 : p.x - 0.5;
      const c = Math.floor(px / TS);
      const r0 = Math.floor((p.y + 2) / TS), r1 = Math.floor((p.y + p.h - 1) / TS);
      for (let r = r0; r <= r1; r++) if (isClimb(tile(c, r))) return true;
      return false;
    }
    const overlap = (ax, ay, aw, ah, bx, by, bw, bh) => ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;

    function burst(x, y, n, kind, color) {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, s = 40 + Math.random() * 140;
        particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - (kind === 'drop' ? 160 : 40), life: 0, max: 0.5 + Math.random() * 0.5, kind, color });
      }
    }

    function die(kind) {
      if (state !== 'play') return;
      state = 'dead'; deadT = 0; deathKind = kind; p.climbing = false; p.vx = 0;
      const cx = p.x + p.w / 2, cy = p.y + p.h;
      if (kind === 'water') { burst(cx, cy, 16, 'drop', '#6bb8f0'); sfx('splash'); toast('Platsch! Minka hasst nasse Pfoten.'); }
      else if (kind === 'thorns') { burst(cx, cy - 8, 8, 'star', '#ffd166'); sfx('ouch'); toast('Autsch, Dornen!'); p.vy = -380; }
      else if (kind === 'dog') { burst(cx, cy - 10, 8, 'star', '#ffd166'); sfx('ouch'); toast('Wuff! Der Hund hat Minka erschreckt.'); p.vy = -420; }
      else { sfx('ouch'); toast('Huch, zu tief gefallen!'); }
    }

    function updateDogs(dt) {
      for (const d of lv.dogs) {
        d.t += dt;
        const nx = d.x + d.dir * 48 * dt;
        const front = d.dir > 0 ? nx + d.w : nx;
        const c = Math.floor(front / TS), r = Math.floor((d.y + d.h - 1) / TS);
        const below = tile(c, r + 1);
        if (isSolid(tile(c, r)) || !(isSolid(below) || isOneWay(below))) d.dir = -d.dir;
        else d.x = nx;
      }
    }

    function step(dt) {
      t += dt;
      updateDogs(dt);
      for (let i = particles.length - 1; i >= 0; i--) {
        const q = particles[i];
        q.life += dt;
        if (q.life > q.max) { particles.splice(i, 1); continue; }
        if (q.kind === 'heart') { q.y -= 30 * dt; q.x += Math.sin(q.life * 6 + q.vx) * 12 * dt; }
        else { q.vy += (q.kind === 'dust' ? 0 : 900) * dt; q.x += q.vx * dt; q.y += q.vy * dt; q.vx *= 0.96; }
      }
      p.blinkT -= dt; if (p.blinkT < -0.12) p.blinkT = 2 + Math.random() * 3;

      if (state === 'dead') {
        deadT += dt;
        if (deathKind !== 'water' && deathKind !== 'fall') { p.vy = Math.min(p.vy + G * dt, MAXFALL); p.y += p.vy * dt; }
        if (deadT > 1.0) {
          placeAt(respawn); state = 'play'; p.inv = 1.4;
          burst(p.x + p.w / 2, p.y + p.h, 8, 'dust', 'rgba(255,255,255,.9)');
        }
        return;
      }
      if (state === 'win') {
        winT += dt;
        p.vx = 0; p.climbing = false;
        p.vy = Math.min(p.vy + G * dt, MAXFALL); moveY(p.vy * dt);
        p.ph += dt * 3;
        if (winT % 0.35 < dt) particles.push({ x: lv.milk.x + 10 + Math.random() * 12, y: lv.milk.y + 6, vx: Math.random() * 6, vy: 0, life: 0, max: 1.4, kind: 'heart' });
        if (winT > 2.2 && winOv.hidden) {
          winOv.hidden = false;
          $('winText').textContent = (levelNo === LEVELS.length
            ? 'Minka ist satt und glücklich. '
            : 'Minka hat ihre Schale Milch gefunden. ') + `Du hast ${fishGot} von ${fishTotal} Fischen gesammelt.`;
        }
        return;
      }
      if (state !== 'play') return;

      const i = inp();
      const dir = (i.r ? 1 : 0) - (i.l ? 1 : 0);
      if (jumpBuf > 0) jumpBuf -= dt;
      if (p.lock > 0) p.lock -= dt;
      if (p.inv > 0) p.inv -= dt;
      if (p.onGround) p.coyote = 0.1; else p.coyote -= dt;
      const wasGround = p.onGround;

      if (p.climbing) {
        if (jumpBuf > 0) {
          p.climbing = false; p.face = -p.face; p.vx = p.face * 230; p.vy = -JUMP * 0.9; p.lock = 0.2; jumpBuf = 0; p.hopping = true; sfx('jump');
        } else if (dir === -p.face) {
          p.climbing = false; p.vx = dir * 100; p.vy = 0;
        } else {
          p.vx = 0;
          p.vy = dir === p.face ? -CLIMB : 45;
          p.ph += dt * (dir === p.face ? 11 : 3);
        }
      } else {
        if (p.lock <= 0) p.vx = approach(p.vx, dir * RUN, (p.onGround ? 2200 : 1300) * dt);
        p.vy = Math.min(p.vy + G * dt, MAXFALL);
        if (!i.j && p.vy < -150 && !p.hopping) p.vy += G * 0.9 * dt;
        if (jumpBuf > 0 && p.coyote > 0) {
          p.vy = -JUMP; jumpBuf = 0; p.coyote = 0; p.hopping = false; sfx('jump');
          burst(p.x + p.w / 2, p.y + p.h, 4, 'dust', 'rgba(255,255,255,.8)');
        }
        if (dir && p.lock <= 0) p.face = dir;
        p.ph += dt * Math.abs(p.vx) / 14;
      }

      moveX(p.vx * dt);
      moveY(p.vy * dt);
      if (p.onGround && !wasGround && !p.climbing) burst(p.x + p.w / 2, p.y + p.h, 3, 'dust', 'rgba(255,255,255,.7)');

      if (p.climbing) {
        if (!climbSide(p.face)) {
          p.climbing = false;
          if (dir === p.face) { p.vy = -HOP; p.vx = p.face * 80; p.hopping = true; }
        } else if (p.onGround && dir !== p.face) p.climbing = false;
      } else if (dir !== 0 && p.lock <= 0 && climbSide(dir)) {
        p.climbing = true; p.face = dir; p.vx = 0; p.hopping = false;
        if (p.vy > 0) p.vy = 0;
      }
      if (p.onGround) p.hopping = false;
      p.x = Math.max(0, Math.min(p.x, lv.W * TS - p.w));

      // Gefahren
      const x0 = p.x + 4, x1 = p.x + p.w - 4, yb = p.y + p.h - 1;
      for (let r = Math.floor((p.y + 4) / TS); r <= Math.floor(yb / TS); r++) {
        for (let c = Math.floor(x0 / TS); c <= Math.floor(x1 / TS); c++) {
          const ch = tile(c, r);
          if (ch === 'w' && yb > r * TS + 10) return die('water');
          if (ch === '^' && yb > r * TS + 14) return die('thorns');
        }
      }
      if (p.inv <= 0) for (const d of lv.dogs) if (overlap(p.x + 4, p.y + 4, p.w - 8, p.h - 6, d.x + 4, d.y + 5, d.w - 8, d.h - 5)) return die('dog');
      if (p.y > lv.H * TS + 40) return die('fall');

      // Fische
      for (const f of lv.fish) {
        if (!f.got && overlap(p.x, p.y, p.w, p.h, f.x - 11, f.y - 11, 22, 22)) {
          f.got = true; fishGot++; fishCountEl.textContent = `${fishGot}/${fishTotal}`;
          burst(f.x, f.y, 10, 'star', '#ffe27a'); sfx('fish');
        }
      }
      // Fahnen
      for (const cp of lv.checkpoints) {
        if (!cp.on && overlap(p.x, p.y, p.w, p.h, cp.x - 12, cp.y - 34, 24, 34)) {
          cp.on = true; respawn = { x: cp.x, y: cp.y }; sfx('flag'); toast('Fahne erreicht! Hier geht es weiter.');
          burst(cp.x + 8, cp.y - 26, 10, 'star', '#ff9f6e');
        }
      }
      // Schilder
      let near = null;
      for (const s of lv.signs) if (Math.abs(p.x + p.w / 2 - s.x) < 52 && Math.abs(p.y + p.h - s.y) < 70) near = s;
      if (near) { if (signBanner.textContent !== near.text) signBanner.textContent = near.text; signBanner.hidden = false; }
      else signBanner.hidden = true;
      // Milch
      const m = lv.milk;
      if (overlap(p.x, p.y, p.w, p.h, m.x + 3, m.y + 6, TS - 6, TS - 6)) {
        state = 'win'; winT = 0; signBanner.hidden = true;
        p.face = (m.x + 16 > p.x + p.w / 2) ? 1 : -1;
        p.x = p.face > 0 ? m.x - p.w + 6 : m.x + TS - 6;
        sfx('win'); saveProgress(levelNo, fishGot);
      }
    }

    /* --- Kamera & Zeichnen --- */
    let dpr = 1, scale = 1, camX = 0, camY = 0;
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(innerWidth * dpr); canvas.height = Math.round(innerHeight * dpr);
      scale = Math.min(canvas.height / (10.5 * TS), canvas.width / (15 * TS));
      snapCamera();
    }
    function camTarget() {
      const vw = canvas.width / scale, vh = canvas.height / scale;
      let tx = p.x + p.w / 2 - vw / 2 + p.face * 40;
      let ty = p.y + p.h / 2 - vh * 0.55;
      const lw = lv.W * TS, lh = lv.H * TS;
      tx = lw <= vw ? (lw - vw) / 2 : Math.max(0, Math.min(tx, lw - vw));
      ty = lh <= vh ? lh - vh : Math.max(0, Math.min(ty, lh - vh));
      return [tx, ty];
    }
    function snapCamera() { [camX, camY] = camTarget(); }
    addEventListener('resize', resize);

    const clouds = Array.from({ length: 7 }, (_, i) => ({ x: i * 190 + Math.random() * 80, y: 20 + Math.random() * 90, s: 0.7 + Math.random() * 0.6 }));

    function drawBackground(vw, vh) {
      const sky = SKIES[def.sky];
      const g = ctx.createLinearGradient(0, 0, 0, vh);
      g.addColorStop(0, sky[0]); g.addColorStop(1, sky[1]);
      ctx.fillStyle = g; ctx.fillRect(0, 0, vw, vh);
      const bottom = lv.H * TS - camY; // Unterkante des Levels in Bildschirmkoordinaten
      const sunY = 70 + (bottom - vh) * 0.05;
      const sg = ctx.createRadialGradient(vw * 0.78, sunY, 4, vw * 0.78, sunY, 70);
      sg.addColorStop(0, sky[4]); sg.addColorStop(0.35, sky[4]); sg.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = sg; circle(ctx, vw * 0.78, sunY, 70);
      ctx.fillStyle = 'rgba(255,255,255,.88)';
      for (const c of clouds) {
        const span = vw + 240;
        const x = ((c.x - camX * 0.08 + t * 7) % span + span) % span - 120;
        const y = c.y + (bottom - vh) * 0.08;
        circle(ctx, x, y, 16 * c.s); circle(ctx, x + 18 * c.s, y - 8 * c.s, 20 * c.s); circle(ctx, x + 38 * c.s, y, 15 * c.s);
        ctx.fillRect(x, y - 2, 38 * c.s, 15 * c.s);
      }
      [[0.15, sky[2], 60, 30, 0.006], [0.35, sky[3], 30, 22, 0.011]].forEach(([par, col, lift, amp, freq]) => {
        const base = vh + (bottom - vh) * par - lift;
        ctx.fillStyle = col;
        ctx.beginPath(); ctx.moveTo(0, vh);
        for (let x = 0; x <= vw + 8; x += 8) {
          const wx = x + camX * par;
          ctx.lineTo(x, base - amp - Math.sin(wx * freq) * amp - Math.sin(wx * freq * 2.7 + 1) * amp * 0.4);
        }
        ctx.lineTo(vw, vh); ctx.closePath(); ctx.fill();
      });
    }

    function drawTile(ch, c, r) {
      const x = c * TS, y = r * TS;
      if (ch === '#') {
        const above = tile(c, r - 1);
        const h = hash(c, r);
        ctx.fillStyle = '#9a6a43'; ctx.fillRect(x, y, TS + 0.6, TS + 0.6);
        ctx.fillStyle = '#86593a';
        ctx.fillRect(x + (h % 20) + 4, y + ((h >> 5) % 16) + 10, 5, 4);
        ctx.fillRect(x + ((h >> 9) % 22) + 2, y + ((h >> 13) % 18) + 6, 3, 3);
        if (above !== '#' && above !== 'w') {
          ctx.fillStyle = '#4aa63f'; ctx.fillRect(x, y, TS, 11);
          ctx.fillStyle = '#5bbd4f'; ctx.fillRect(x, y, TS, 8);
          ctx.fillStyle = '#74d363';
          for (let i = 0; i < 4; i++) ctx.fillRect(x + 3 + i * 8 + ((h >> i) & 3), y - 3, 2, 4);
        }
      } else if (ch === 'B') {
        ctx.fillStyle = '#e3cfb4'; ctx.fillRect(x, y, TS + 0.6, TS + 0.6);
        for (let k = 0; k < 4; k++) {
          const off = ((r * 4 + k) & 1) ? 8 : 0;
          for (let bx = -off; bx < TS; bx += 16) {
            const x0 = Math.max(bx, 0), x1 = Math.min(bx + 16, TS);
            ctx.fillStyle = ['#c0583f', '#b44f38', '#c96447'][hash(c * 7 + bx, r * 4 + k) % 3];
            ctx.fillRect(x + x0 + (bx >= 0 ? 1 : 0), y + k * 8 + 1, x1 - x0 - (bx >= 0 ? 1 : 0), 7);
          }
        }
        if (tile(c, r - 1) !== 'B') { ctx.fillStyle = '#d9d0c4'; ctx.fillRect(x - 1, y, TS + 2, 5); ctx.fillStyle = '#b9ad9d'; ctx.fillRect(x - 1, y + 5, TS + 2, 1.5); }
      } else if (ch === 'T') {
        ctx.fillStyle = '#7b4d2c'; ctx.fillRect(x + 2, y, TS - 4, TS + 0.6);
        ctx.fillStyle = '#5f3a20';
        const h = hash(c, r);
        ctx.fillRect(x + 8 + (h & 3), y, 2.5, TS); ctx.fillRect(x + 18 + ((h >> 2) & 3), y + 4, 2.5, TS - 8);
        ctx.fillStyle = '#9a6640'; ctx.fillRect(x + 24, y, 3, TS);
        if ((h >> 6) % 5 === 0) { ctx.fillStyle = '#4e2f19'; ellipse(ctx, x + 14, y + 16, 3, 4); }
        if (tile(c, r + 1) === '#') { ctx.fillStyle = '#7b4d2c'; tri(ctx, x - 3, y + TS, x + 4, y + TS - 10, x + 6, y + TS); tri(ctx, x + TS + 3, y + TS, x + TS - 4, y + TS - 10, x + TS - 6, y + TS); }
      } else if (ch === 'L') {
        const h = hash(c, r);
        ctx.fillStyle = '#357f3b';
        circle(ctx, x + 6, y + 16, 13); circle(ctx, x + 26, y + 15, 13); circle(ctx, x + 16, y + 21, 13);
        ctx.fillStyle = '#46a04a';
        circle(ctx, x + 9, y + 10, 10); circle(ctx, x + 24, y + 9, 10);
        ctx.fillStyle = '#62bf5b';
        circle(ctx, x + 10 + (h & 3), y + 5, 5); circle(ctx, x + 24 - (h & 3), y + 4, 4.5);
        if (tile(c - 1, r) !== 'L') { ctx.fillStyle = '#357f3b'; circle(ctx, x - 2, y + 17, 9); }
        if (tile(c + 1, r) !== 'L') { ctx.fillStyle = '#357f3b'; circle(ctx, x + TS + 2, y + 17, 9); }
      } else if (ch === '-') {
        ctx.fillStyle = '#7d5330'; ctx.fillRect(x, y + 8, TS, 4);
        ctx.fillStyle = '#b07a43'; ctx.fillRect(x, y, TS, 8);
        ctx.fillStyle = '#c99158'; ctx.fillRect(x, y, TS, 2.5);
        ctx.fillStyle = '#5f3a20'; circle(ctx, x + 4, y + 4.5, 1.2); circle(ctx, x + TS - 4, y + 4.5, 1.2);
      } else if (ch === 'w') {
        ctx.fillStyle = 'rgba(58,145,222,.92)';
        ctx.beginPath(); ctx.moveTo(x, y + TS);
        for (let i = 0; i <= TS; i += 4) ctx.lineTo(x + i, y + 9 + Math.sin(t * 3 + (x + i) * 0.18) * 2);
        ctx.lineTo(x + TS, y + TS); ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.55)';
        ctx.fillRect(x + 6 + Math.sin(t * 2 + c) * 3, y + 15, 8, 1.6); ctx.fillRect(x + 18 + Math.cos(t * 2 + c) * 3, y + 22, 6, 1.6);
      } else if (ch === '^') {
        ctx.fillStyle = '#5a3d2a';
        for (let i = 0; i < 5; i++) tri(ctx, x + 2 + i * 7, y + 20, x + 5 + i * 7, y + 7 + (i % 2) * 3, x + 8 + i * 7, y + 20);
        ctx.fillStyle = '#2f6b35'; ellipse(ctx, x + 16, y + 25, 17, 8);
        ctx.fillStyle = '#3d8543'; ellipse(ctx, x + 12, y + 23, 8, 4);
        ctx.fillStyle = '#c23b3b'; circle(ctx, x + 8, y + 26, 1.8); circle(ctx, x + 22, y + 24, 1.8);
      }
    }

    function drawDog(d) {
      ctx.save();
      ctx.translate(d.x + d.w / 2, d.y + d.h);
      ctx.scale(d.dir, 1);
      const ph = d.t * 10;
      ctx.fillStyle = '#7a4f2b';
      [-9, -4, 5, 10].forEach((lx, i) => { const dx = Math.sin(ph + (i % 2 ? Math.PI : 0)) * 2.5; ctx.fillRect(lx + dx - 2, -9, 4, 9); });
      ctx.strokeStyle = '#b98146'; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-12, -14); ctx.quadraticCurveTo(-17, -18, -18 + Math.sin(ph * 1.5) * 3, -24); ctx.stroke();
      ctx.fillStyle = '#b98146'; ellipse(ctx, 0, -13, 13, 7.5);
      ctx.fillStyle = '#8a5a2e'; ellipse(ctx, -4, -16, 4.5, 3);
      ctx.fillStyle = '#d9453b'; ctx.fillRect(7, -19, 3, 7);
      ctx.fillStyle = '#b98146'; circle(ctx, 13, -19, 7.2);
      ctx.fillStyle = '#d9a96f'; ellipse(ctx, 19, -16, 4.8, 3.2);
      ctx.fillStyle = INK; circle(ctx, 23.2, -17.2, 1.7); circle(ctx, 14.5, -21, 1.5);
      ctx.fillStyle = '#6b4423'; ellipse(ctx, 9, -18.5, 2.8, 5.8, 0.35);
      ctx.restore();
    }

    function drawFish(f) {
      const y = f.y + Math.sin(t * 3 + f.x * 0.05) * 3;
      ctx.save(); ctx.translate(f.x, y);
      ctx.fillStyle = 'rgba(255,255,255,.35)'; circle(ctx, 0, 0, 13);
      ctx.fillStyle = '#5aa9e6'; tri(ctx, -5, 0, -12, -6, -12, 6); ellipse(ctx, 0, 0, 8.5, 5.2);
      ctx.fillStyle = '#bfe3ff'; ellipse(ctx, 1, 2, 5, 2);
      ctx.fillStyle = '#fff'; circle(ctx, 4.2, -1.2, 1.7); ctx.fillStyle = '#1d3557'; circle(ctx, 4.6, -1.2, 0.9);
      ctx.restore();
    }

    function drawSign(s) {
      ctx.fillStyle = '#7a5232'; ctx.fillRect(s.x - 2, s.y - 22, 4, 22);
      ctx.fillStyle = '#8a5f35'; ctx.fillRect(s.x - 14, s.y - 33, 28, 16);
      ctx.fillStyle = '#d4a568'; ctx.fillRect(s.x - 13, s.y - 32, 26, 14);
      ctx.fillStyle = '#8a5f35'; ctx.fillRect(s.x - 9, s.y - 28, 18, 1.6); ctx.fillRect(s.x - 9, s.y - 24, 12, 1.6);
    }

    function drawFlag(cp) {
      ctx.fillStyle = '#8c8279'; ellipse(ctx, cp.x, cp.y - 2, 8, 3);
      ctx.fillStyle = '#6b4f3a'; ctx.fillRect(cp.x - 1.5, cp.y - 34, 3, 32);
      const wv = Math.sin(t * 6) * 2;
      ctx.fillStyle = cp.on ? '#ff7a59' : '#c9c3bb';
      ctx.beginPath(); ctx.moveTo(cp.x + 1.5, cp.y - 34); ctx.quadraticCurveTo(cp.x + 10, cp.y - 32 + wv, cp.x + 19, cp.y - 29 + wv);
      ctx.quadraticCurveTo(cp.x + 10, cp.y - 25 - wv, cp.x + 1.5, cp.y - 22); ctx.fill();
      if (cp.on) { ctx.fillStyle = '#fff'; circle(ctx, cp.x + 8, cp.y - 28, 2); circle(ctx, cp.x + 5.5, cp.y - 31, 0.9); circle(ctx, cp.x + 8, cp.y - 32, 0.9); circle(ctx, cp.x + 10.5, cp.y - 31, 0.9); }
    }

    function drawParticles() {
      for (const q of particles) {
        const a = 1 - q.life / q.max;
        ctx.globalAlpha = Math.max(0, a);
        if (q.kind === 'heart') {
          ctx.fillStyle = '#ff6b8b';
          const s = 4;
          circle(ctx, q.x - s * 0.5, q.y, s * 0.6); circle(ctx, q.x + s * 0.5, q.y, s * 0.6);
          tri(ctx, q.x - s * 1.1, q.y + 1, q.x + s * 1.1, q.y + 1, q.x, q.y + s * 1.4);
        } else if (q.kind === 'star') {
          ctx.fillStyle = q.color; ctx.fillRect(q.x - 1.5, q.y - 1.5, 3, 3);
        } else {
          ctx.fillStyle = q.color; circle(ctx, q.x, q.y, q.kind === 'dust' ? 2.5 * a + 1 : 2.4);
        }
      }
      ctx.globalAlpha = 1;
    }

    function render() {
      const vw = canvas.width / scale, vh = canvas.height / scale;
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      drawBackground(vw, vh);
      const ox = Math.round(camX * scale) / scale, oy = Math.round(camY * scale) / scale;
      ctx.setTransform(scale, 0, 0, scale, -ox * scale, -oy * scale);

      const c0 = Math.max(0, Math.floor(camX / TS) - 1), c1 = Math.min(lv.W - 1, Math.ceil((camX + vw) / TS) + 1);
      const r0 = Math.max(0, Math.floor(camY / TS) - 1), r1 = Math.min(lv.H - 1, Math.ceil((camY + vh) / TS) + 1);
      // Erst Stämme, Mauern, Boden – dann Laub und Wasser darüber
      for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) { const ch = lv.grid[r][c]; if (ch !== '.' && ch !== 'L' && ch !== 'w') drawTile(ch, c, r); }
      lv.signs.forEach(drawSign);
      lv.checkpoints.forEach(drawFlag);
      for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) if (lv.grid[r][c] === 'L') drawTile('L', c, r);
      drawBowl(ctx, lv.milk.x, lv.milk.y, t);
      lv.fish.forEach(f => { if (!f.got) drawFish(f); });
      lv.dogs.forEach(drawDog);

      if (!(state === 'dead' && deathKind === 'fall')) {
        let mode = 'idle';
        if (state === 'dead') mode = 'dead';
        else if (state === 'win') mode = p.onGround ? 'drink' : 'air';
        else if (p.climbing) mode = 'climb';
        else if (!p.onGround) mode = 'air';
        else if (Math.abs(p.vx) > 20) mode = 'run';
        const show = p.inv <= 0 || Math.floor(p.inv * 12) % 2 === 0;
        let cx = p.x + p.w / 2, by = p.y + p.h;
        if (state === 'dead') cx += Math.sin(t * 70) * 1.5;
        if (state === 'dead' && deathKind === 'water') by -= Math.min(deadT, 0.3) * 30;
        if (show) drawCat(ctx, cx, by, p.face, mode, p.ph, p.blinkT < 0);
      }
      for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) if (lv.grid[r][c] === 'w') drawTile('w', c, r);
      drawParticles();
    }

    /* --- Schleife --- */
    const portraitMq = window.matchMedia ? matchMedia('(orientation: portrait) and (pointer: coarse)') : null;
    let last = performance.now(), accum = 0;
    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const paused = (portraitMq && portraitMq.matches) || document.hidden;
      if (!paused) {
        accum += dt;
        while (accum >= STEP) { step(STEP); accum -= STEP; }
        const [tx, ty] = camTarget();
        const k = 1 - Math.pow(0.0008, dt);
        camX += (tx - camX) * k; camY += (ty - camY) * k;
      }
      render();
      requestAnimationFrame(frame);
    }
    resize();
    requestAnimationFrame(frame);
  }

  window.Katzensprung = { LEVELS, drawCat, drawBowl };

  function boot() {
    const hero = document.getElementById('kz-hero');
    if (hero) { runHero(hero); return; }
    const n = parseInt(document.body.dataset.level, 10);
    if (n >= 1 && n <= LEVELS.length) runGame(n);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
