(() => {
  'use strict';

  // Número de WhatsApp de Mango Publicidad (formato internacional, sin +)
  const PHONE = '529903917701';
  const wa = (msg) => `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
  const fmt = (n) => Number(n).toLocaleString('es-MX', { maximumFractionDigits: 2 });
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  const narrow = window.matchMedia('(max-width: 599px)');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const supportsCqi = window.CSS && CSS.supports && CSS.supports('font-size', '1cqi');

  // Enlaces de WhatsApp con mensaje predefinido
  document.querySelectorAll('[data-wa]').forEach((a) => { a.href = wa(a.dataset.wa); });

  // Chips: reflejar el estado marcado en la etiqueta
  function syncChips(scope) {
    scope.querySelectorAll('.chip input').forEach((input) => {
      input.closest('.chip').classList.toggle('is-on', input.checked);
    });
  }
  document.querySelectorAll('.chips').forEach((group) => {
    group.addEventListener('change', () => syncChips(group));
  });

  /* ---------------- Lona ---------------- */
  const stage = document.getElementById('lonaStage');
  const lona = document.getElementById('lona');
  if (stage && lona) {
    const face = lona.querySelector('.lona-face');
    const title = document.getElementById('hero-title');
    const preview = document.getElementById('lonaPreview');
    const pMain = document.getElementById('lonaMain');
    const pSub = document.getElementById('lonaSub');
    const ojillos = document.getElementById('ojillos');
    const cotaW = document.getElementById('cotaW');
    const cotaH = document.getElementById('cotaH');
    const form = document.getElementById('lonaForm');
    const inText = document.getElementById('inText');
    const inSub = document.getElementById('inSub');
    const inW = document.getElementById('inW');
    const inH = document.getElementById('inH');
    const customBox = document.getElementById('customSize');
    const cta = document.getElementById('lonaCta');

    const SCHEMES = { blanca: 'fondo blanco', negra: 'fondo negro', mango: 'fondo mango' };
    const state = { w: 3, h: 1, scheme: 'blanca', text: '', sub: '' };

    // En pantallas angostas arrancamos con 2 × 1 m para que la lona se lea mejor
    if (narrow.matches) {
      const r = form.querySelector('input[name="size"][value="2x1"]');
      if (r) { r.checked = true; syncChips(r.closest('.chips')); state.w = 2; }
    }

    function readSize() {
      const sel = form.querySelector('input[name="size"]:checked');
      const v = sel ? sel.value : '3x1';
      customBox.hidden = v !== 'custom';
      if (v === 'custom') {
        const w = parseFloat(String(inW.value).replace(',', '.'));
        const h = parseFloat(String(inH.value).replace(',', '.'));
        if (Number.isFinite(w) && w > 0) state.w = clamp(w, 0.3, 12);
        if (Number.isFinite(h) && h > 0) state.h = clamp(h, 0.3, 6);
      } else {
        const [w, h] = v.split('x').map(Number);
        state.w = w; state.h = h;
      }
    }

    function sizeLabel() { return `${fmt(state.w)} × ${fmt(state.h)} m`; }

    function updateCta() {
      let msg = `Hola, Mango Publicidad. Quiero cotizar una lona de ${sizeLabel()}, ${SCHEMES[state.scheme]}.`;
      if (state.text) msg += `\nTexto: ${state.text}`;
      if (state.sub) msg += `\nSegunda línea: ${state.sub}`;
      cta.href = wa(msg);
    }

    function drawOjillos() {
      const nx = clamp(Math.round(state.w / 0.5) + 1, 2, 25);
      const ny = clamp(Math.round(state.h / 0.5) + 1, 2, 13);
      const frag = document.createDocumentFragment();
      const pos = (t) => `calc(var(--inset) + (100% - 2 * var(--inset)) * ${t})`;
      const add = (x, y) => {
        const s = document.createElement('span');
        s.className = 'ojillo';
        s.style.left = pos(x);
        s.style.top = pos(y);
        frag.appendChild(s);
      };
      for (let i = 0; i < nx; i++) { add(i / (nx - 1), 0); add(i / (nx - 1), 1); }
      for (let j = 1; j < ny - 1; j++) { add(0, j / (ny - 1)); add(1, j / (ny - 1)); }
      ojillos.replaceChildren(frag);
    }

    function updateCotas() {
      if (narrow.matches) {
        cotaW.textContent = sizeLabel();
      } else {
        cotaW.textContent = `${fmt(state.w)} m`;
        cotaH.textContent = `${fmt(state.h)} m`;
      }
    }

    // Ajusta el texto al área útil de la lona con búsqueda binaria
    function fitText() {
      const hasPreview = state.text.length > 0 || state.sub.length > 0;
      title.classList.toggle('sr-only', hasPreview);
      preview.hidden = !hasPreview;
      if (hasPreview) {
        pMain.textContent = state.text || 'Tu negocio';
        pSub.textContent = state.sub;
      }

      const cs = getComputedStyle(face);
      const availW = face.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const availH = face.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      if (availW <= 0 || availH <= 0) return;

      const target = hasPreview ? preview : title;
      const lines = hasPreview ? [pMain, pSub] : [title];
      const apply = (fs) => {
        if (hasPreview) {
          pMain.style.fontSize = `${fs}px`;
          pSub.style.fontSize = `${Math.max(9, fs * 0.34)}px`;
        } else {
          title.style.fontSize = `${fs}px`;
        }
      };
      const fits = () => target.offsetHeight <= availH + 0.5 &&
        lines.every((el) => el.scrollWidth <= Math.min(el.clientWidth, availW) + 0.5);

      let lo = 6;
      let hi = Math.min(availH * 1.15, 520);
      for (let i = 0; i < 16; i++) {
        const mid = (lo + hi) / 2;
        apply(mid);
        if (fits()) lo = mid; else hi = mid;
      }
      const fs = Math.floor(lo * 10) / 10;
      // Expresar el tamaño relativo al ancho de la lona para que escale durante la transición
      const W = lona.clientWidth;
      if (supportsCqi && W > 0) {
        const u = (px) => `${(px / W) * 100}cqi`;
        if (hasPreview) {
          pMain.style.fontSize = u(fs);
          pSub.style.fontSize = u(Math.max(9, fs * 0.34));
        } else {
          title.style.fontSize = u(fs);
        }
      } else {
        apply(fs);
      }
    }

    function layout(animate) {
      const cs = getComputedStyle(stage);
      const availW = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const maxH = Math.min(window.innerHeight * (narrow.matches ? 0.42 : 0.5), 460);
      const ratio = state.w / state.h;
      let W = Math.min(availW, maxH * ratio, 1100);
      let H = W / ratio;
      W = Math.round(W); H = Math.round(H);

      const m = Math.min(W, H);
      const oj = clamp(m * 0.055, 8, 16);
      const inset = clamp(m * 0.05, 7, 18);
      const pad = inset + oj + clamp(m * 0.07, 8, 40);

      const prevW = lona.style.width;
      const prevH = lona.style.height;

      lona.style.transition = 'none';
      lona.classList.add('is-sized');
      lona.style.setProperty('--oj', `${oj}px`);
      lona.style.setProperty('--inset', `${inset}px`);
      lona.style.setProperty('--pad', `${pad}px`);
      lona.style.width = `${W}px`;
      lona.style.height = `${H}px`;
      fitText();

      if (animate && prevW && !reduce.matches && (prevW !== lona.style.width || prevH !== lona.style.height)) {
        lona.style.width = prevW;
        lona.style.height = prevH;
        void lona.offsetWidth; // forzar el estado inicial antes de animar
        lona.style.transition = '';
        lona.style.width = `${W}px`;
        lona.style.height = `${H}px`;
      } else {
        void lona.offsetWidth;
        lona.style.transition = '';
      }

      drawOjillos();
      updateCotas();
      updateCta();
    }

    // Eventos del formulario
    let raf = 0;
    const schedule = (fn) => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fn); };

    inText.addEventListener('input', () => {
      state.text = inText.value.trim();
      schedule(() => { fitText(); updateCta(); });
    });
    inSub.addEventListener('input', () => {
      state.sub = inSub.value.trim();
      schedule(() => { fitText(); updateCta(); });
    });
    form.addEventListener('change', (e) => {
      const t = e.target;
      if (t.name === 'size' || t === inW || t === inH) {
        readSize();
        layout(true);
        if (t.value === 'custom') inW.focus();
      } else if (t.name === 'scheme') {
        state.scheme = t.value;
        lona.dataset.scheme = t.value;
        updateCta();
      }
    });
    [inW, inH].forEach((el) => el.addEventListener('input', () => {
      readSize();
      schedule(() => layout(true));
    }));

    let lastW = window.innerWidth;
    window.addEventListener('resize', () => {
      // Evitar recalcular cuando solo cambia la altura por la barra del navegador móvil
      if (Math.abs(window.innerWidth - lastW) < 2 && narrow.matches) return;
      lastW = window.innerWidth;
      schedule(() => layout(false));
    });

    // Arranque: esperar la fuente para medir con el ancho real, luego tensar la lona
    readSize();
    layout(false);
    const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    const heroImgs = [...document.querySelectorAll('.hero .fl-img')];
    const imgsReady = Promise.all(heroImgs.map((img) => (img.decode ? img.decode().catch(() => {}) : null)));
    Promise.race([Promise.all([fontsReady, imgsReady]), new Promise((r) => setTimeout(r, 1800))]).then(() => {
      layout(false);
      document.documentElement.classList.add('is-ready');
      if (!reduce.matches) lona.classList.add('is-live');
    });

    // Aleteo de la lona cuando cambian medida o colores
    const flap = () => {
      if (reduce.matches || !lona.classList.contains('is-live')) return;
      lona.classList.remove('is-flap');
      void lona.offsetWidth;
      lona.classList.add('is-flap');
    };
    lona.addEventListener('animationend', (e) => { if (e.animationName === 'aletear') lona.classList.remove('is-flap'); });
    form.addEventListener('change', (e) => { if (e.target.name === 'scheme' || e.target.name === 'size') flap(); });
  }

  /* ---------------- Cotización general ---------------- */
  const cForm = document.getElementById('cotizaForm');
  if (cForm) {
    const err = document.getElementById('cError');
    const cDetalle = document.getElementById('cDetalle');
    const cFecha = document.getElementById('cFecha');
    const cNombre = document.getElementById('cNombre');

    const today = new Date();
    const pad2 = (n) => String(n).padStart(2, '0');
    cFecha.min = `${today.getFullYear()}-${pad2(today.getMonth() + 1)}-${pad2(today.getDate())}`;

    const joinEs = (arr) => arr.length <= 1 ? arr.join('') :
      `${arr.slice(0, -1).join(', ')} y ${arr[arr.length - 1]}`;

    cForm.addEventListener('change', () => { err.hidden = true; });
    cDetalle.addEventListener('input', () => { err.hidden = true; });

    cForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const items = [...cForm.querySelectorAll('input[name="producto"]:checked')].map((i) => i.value);
      const detalle = cDetalle.value.trim();
      const nombre = cNombre.value.trim();

      if (!items.length && !detalle) {
        err.textContent = 'Elige al menos un producto o escribe en Detalles lo que necesitas.';
        err.hidden = false;
        cForm.querySelector('input[name="producto"]').focus();
        return;
      }

      let msg = 'Hola, Mango Publicidad.';
      if (nombre) msg += ` Soy ${nombre}.`;
      msg += items.length ? ` Quiero cotizar ${joinEs(items)}.` : ' Quiero una cotización.';
      if (detalle) msg += `\n\nDetalles: ${detalle}`;
      if (cFecha.value) {
        const d = new Date(`${cFecha.value}T12:00:00`);
        msg += `\nLo necesito para el ${d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}.`;
      }
      const url = wa(msg);
      const btn = cForm.querySelector('button[type="submit"]');
      if (window.mangoBurst && btn) window.mangoBurst(btn);
      const win = window.open(url, '_blank');
      if (win) win.opener = null;
      else window.location.href = url; // si el navegador bloquea la ventana nueva
    });
  }

  /* ---------------- Botón flotante ---------------- */
  // Se oculta mientras se ve el hero o el formulario, que ya tienen su propio botón de WhatsApp
  const fab = document.getElementById('fab');
  const zones = ['inicio', 'contacto'].map((id) => document.getElementById(id)).filter(Boolean);
  if (fab && zones.length && 'IntersectionObserver' in window) {
    const visible = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) visible.add(en.target); else visible.delete(en.target); });
      fab.classList.toggle('is-visible', visible.size === 0);
    }, { threshold: 0.05 });
    zones.forEach((z) => io.observe(z));
  } else if (fab) {
    fab.classList.add('is-visible');
  }

  /* =================================================================
     Efectos
     ================================================================= */
  const root = document.documentElement;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  /* ---------- Partículas: estallido y lluvia de mangos ---------- */
  const SMALL = ['rojo', 'mitad', 'cuadritos', 'amarillo', 'entero', 'moteado', 'clasico', 'cuadritos-2', 'vertical']
    .map((n) => `assets/mangos/mango-${n}-sm.webp`);
  const layer = document.createElement('div');
  layer.className = 'particulas';
  layer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(layer);
  const parts = [];

  function spawn(o) {
    if (parts.length > 90) return;
    const el = document.createElement('img');
    el.src = pick(SMALL); el.alt = ''; el.className = 'particula'; el.decoding = 'async';
    el.style.width = `${o.size}px`;
    layer.appendChild(el);
    parts.push({ el, age: 0, rot: rand(0, 360), ...o });
  }
  function burst(x, y, n = 16) {
    if (reduce.matches) return;
    for (let i = 0; i < n; i++) {
      const a = rand(-Math.PI * 0.94, -Math.PI * 0.06);
      const v = rand(7, 15);
      spawn({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, size: rand(30, 64), spin: rand(-14, 14), life: rand(1.1, 1.7), g: 0.5 });
    }
  }
  function rain(n = 36) {
    if (reduce.matches) return;
    for (let i = 0; i < n; i++) {
      spawn({ x: rand(0, innerWidth), y: rand(-innerHeight * 0.9, -60), vx: rand(-0.8, 0.8), vy: rand(2, 6),
        size: rand(50, 128), spin: rand(-5, 5), life: 4.2, g: 0.2 });
    }
  }
  function stepParticles(dt) {
    const k = dt * 60;
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.age += dt; p.vy += p.g * k; p.x += p.vx * k; p.y += p.vy * k; p.rot += p.spin * k;
      const fade = p.age > p.life - 0.35 ? Math.max(0, (p.life - p.age) / 0.35) : 1;
      p.el.style.opacity = fade.toFixed(2);
      p.el.style.transform = `translate3d(${(p.x - p.size / 2).toFixed(1)}px, ${(p.y - p.size / 2).toFixed(1)}px, 0) rotate(${p.rot.toFixed(1)}deg)`;
      if (p.age >= p.life || p.y > innerHeight + 200) { p.el.remove(); parts.splice(i, 1); }
    }
  }
  window.mangoBurst = (el, e) => {
    const r = el.getBoundingClientRect();
    const x = e && e.clientX ? e.clientX : r.left + r.width / 2;
    const y = e && e.clientY ? e.clientY : r.top + r.height / 2;
    burst(x, y);
  };
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-burst]');
    if (el) window.mangoBurst(el, e);
  });
  const brand = document.querySelector('.brand');
  if (brand) brand.addEventListener('click', () => rain());

  /* ---------- Secciones visibles: pausar lo que no se ve ---------- */
  const visibles = new Set();
  const secIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      en.target.classList.toggle('is-off', !en.isIntersecting);
      if (en.isIntersecting) { visibles.add(en.target); en.target.classList.add('is-seen'); }
      else visibles.delete(en.target);
    });
  }, { rootMargin: '160px 0px' });
  document.querySelectorAll('[data-anim]').forEach((s) => secIO.observe(s));

  /* ---------- Revelados ---------- */
  document.querySelectorAll('[data-reveal-group]').forEach((g) => {
    g.querySelectorAll(':scope > [data-reveal]').forEach((el, i) => el.style.setProperty('--i', i));
  });
  const revIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); revIO.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('[data-reveal], .titular, .pasos').forEach((el) => revIO.observe(el));

  /* ---------- Mangos flotantes: profundidad con cursor y scroll ---------- */
  const floaters = [...document.querySelectorAll('.fl')].map((el) => ({
    el, depth: parseFloat(el.dataset.depth || '0.5'), sec: el.closest('[data-anim]'),
  }));
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  if (finePointer.matches) {
    window.addEventListener('pointermove', (e) => {
      pointer.tx = e.clientX / innerWidth - 0.5;
      pointer.ty = e.clientY / innerHeight - 0.5;
    }, { passive: true });
  }

  /* ---------- Cintas: avanzan solas y aceleran con el scroll ---------- */
  const tracks = [...document.querySelectorAll('.cinta-track')].map((el) => ({
    el, dir: parseFloat(el.dataset.dir || '1'), set: el.querySelector('.cinta-set'), w: 0, sec: el.closest('[data-anim]'),
  }));
  function fillTracks() {
    tracks.forEach((t) => {
      if (!t.set) return;
      t.w = t.set.offsetWidth;
      const need = Math.ceil((innerWidth * 1.3) / Math.max(1, t.w)) + 1;
      while (t.el.children.length < need) t.el.appendChild(t.set.cloneNode(true));
    });
  }
  fillTracks();
  window.addEventListener('resize', fillTracks);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fillTracks);
  window.addEventListener('load', fillTracks);

  /* ---------- Botones con imán ---------- */
  if (finePointer.matches && !reduce.matches) {
    document.querySelectorAll('.btn').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty('--mx', `${clamp((e.clientX - (r.left + r.width / 2)) * 0.2, -10, 10)}px`);
        btn.style.setProperty('--my', `${clamp((e.clientY - (r.top + r.height / 2)) * 0.32, -8, 8)}px`);
      });
      btn.addEventListener('pointerleave', () => {
        btn.style.setProperty('--mx', '0px');
        btn.style.setProperty('--my', '0px');
      });
    });
  }

  /* ---------- Jersey en 3D siguiendo el cursor ---------- */
  const tilt = document.querySelector('.jersey-tilt');
  const sportsSec = document.getElementById('sports');
  if (tilt && sportsSec && finePointer.matches && !reduce.matches) {
    sportsSec.addEventListener('pointermove', (e) => {
      const r = tilt.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      tilt.style.transform = `perspective(900px) rotateY(${clamp(dx * 26, -20, 20).toFixed(1)}deg) rotateX(${clamp(-dy * 18, -14, 14).toFixed(1)}deg) scale(1.03)`;
    });
    sportsSec.addEventListener('pointerleave', () => { tilt.style.transform = ''; });
  }

  /* ---------- Encabezado que se esconde al bajar y vuelve al subir ---------- */
  const header = document.querySelector('.site-header');
  let lastY = scrollY;
  const bar = document.getElementById('progreso');

  /* ---------- Un solo ciclo de animación ---------- */
  let last = performance.now();
  const t0 = last;
  function tick(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const sy = scrollY;
    const vh = innerHeight;

    if (header) {
      header.classList.toggle('is-scrolled', sy > 8);
      if (Math.abs(sy - lastY) > 4) {
        header.classList.toggle('is-hidden', sy > lastY && sy > 240);
        lastY = sy;
      }
    }
    if (bar) {
      const max = root.scrollHeight - vh;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, sy / max).toFixed(4) : 0})`;
    }

    if (!reduce.matches) {
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;
      const rects = new Map();
      for (const f of floaters) {
        if (!f.sec || !visibles.has(f.sec)) continue;
        let r = rects.get(f.sec);
        if (!r) { r = f.sec.getBoundingClientRect(); rects.set(f.sec, r); }
        // Desplazamiento normalizado a la pantalla: nunca más de ~60 px aunque la sección sea alta
        const norm = clamp((r.top + r.height / 2 - vh / 2) / vh, -1.2, 1.2);
        const tx = pointer.x * f.depth * 36;
        const ty = norm * f.depth * 60 + pointer.y * f.depth * 26;
        const rot = norm * f.depth * 9;
        f.el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg)`;
      }
      const tt = (now - t0) / 1000;
      for (const t of tracks) {
        if (!t.w || (t.sec && !visibles.has(t.sec))) continue;
        const d = tt * 60 + sy * 0.5;
        const m = ((d % t.w) + t.w) % t.w;
        const x = t.dir > 0 ? -m : m - t.w;
        t.el.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`;
      }
      if (parts.length) stepParticles(dt);
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
