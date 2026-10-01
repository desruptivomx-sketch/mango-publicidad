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
    Promise.race([fontsReady, new Promise((r) => setTimeout(r, 1500))]).then(() => {
      layout(false);
      document.documentElement.classList.add('is-ready');
      if (!reduce.matches) {
        lona.classList.add('is-tensando');
        lona.addEventListener('animationend', (e) => {
          if (e.target === lona) lona.classList.remove('is-tensando');
        });
      }
    });
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
})();
