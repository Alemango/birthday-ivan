/**
 * app.js — LÓGICA DEL SITIO
 * ============================================================================
 * No hace falta tocar este archivo para actualizar contenido: eso vive en
 * data.js (recuerdos) y config.js (redes, frases genéricas, envoltorio).
 * ============================================================================
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
   * Claves de localStorage.
   * IMPORTANTE: localStorage es por NAVEGADOR/DISPOSITIVO, no global.
   * Cada teléfono que abra el tag NFC tiene su propio estado de
   * "primera visita", último recuerdo mostrado y contador.
   * ------------------------------------------------------------------ */
  var STORAGE_KEYS = {
    visited: 'biv_visited_v1',
    lastIndex: 'biv_lastIndex_v1',
    count: 'biv_count_v1',
  };

  var ICONS = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg>',
    spotify: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M7 10.5c3.2-.9 6.8-.6 9.8 1.1M7.6 14c2.6-.7 5.4-.5 7.8.9M8.2 17c2-.5 4.2-.4 6 .6"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.1a8.1 8.1 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.1 8.1 0 1 1 12 20.1Zm4.5-6c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8 1-.2.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.2.2-.4.1-.2 0-.3 0-.4-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9 0 1.1.8 2.2.9 2.3.1.2 1.6 2.5 4 3.4.6.2 1 .4 1.3.5.6.2 1.1.2 1.5.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.4-.3Z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 3c.4 2 1.8 3.5 4 3.8v2.6c-1.5 0-2.8-.5-4-1.3v6.4A5.5 5.5 0 1 1 9.2 9.1v2.7a2.9 2.9 0 1 0 2.3 2.8V3H14Z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2.5" y="5.5" width="19" height="13" rx="3.5"/><path d="M10.5 9.2v5.6L15.3 12z" fill="currentColor" stroke="none"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 4l16 16M20 4L4 20" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l2.6-2.6a4 4 0 0 0-5.7-5.7L11 7.2M14 10a4 4 0 0 0-5.7 0L5.7 12.6a4 4 0 0 0 5.7 5.7L13 17"/></svg>',
    rotate: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="7" y="2" width="10" height="16" rx="2"/><path d="M9 19v1a1 1 0 0 0 1 1h1M20 8a8 8 0 0 1-2 5.3"/><path d="M20 4v4h-4"/></svg>',
    soundOn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="4,9 8,9 12,5 12,19 8,15 4,15" fill="currentColor" stroke="none"/><path d="M16 8a5 5 0 0 1 0 8"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
    soundOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="4,9 8,9 12,5 12,19 8,15 4,15" fill="currentColor" stroke="none"/><line x1="16" y1="9" x2="21" y2="14"/><line x1="21" y1="9" x2="16" y2="14"/></svg>',
  };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var viewerEl = document.getElementById('viewer');
  var plateNumberEl = document.getElementById('plate-number');
  var reshuffleBtn = document.getElementById('reshuffle-btn');
  var socialBarEl = document.getElementById('social-bar');
  var audioEl = document.getElementById('memory-audio');
  var currentAudioBtn = null;

  /* ------------------------------------------------------------------
   * Redes sociales flotantes
   * ------------------------------------------------------------------ */
  function renderSocialBar() {
    var links = window.SOCIAL_LINKS || [];
    links.forEach(function (item) {
      var a = document.createElement('a');
      a.className = 'social-btn';
      a.href = item.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.setAttribute('aria-label', item.label || item.icon);
      a.innerHTML = ICONS[item.icon] || ICONS.link;
      socialBarEl.appendChild(a);
    });
  }

  /* ------------------------------------------------------------------
   * Botón de audio sobre una foto (nunca autoplay: requiere gesto)
   * ------------------------------------------------------------------ */
  function buildAudioButton(src) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'audio-btn';
    btn.setAttribute('aria-label', 'Reproducir audio');
    btn.innerHTML = ICONS.play;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var wasThisPlaying = currentAudioBtn === btn && !audioEl.paused;

      if (currentAudioBtn && currentAudioBtn !== btn) {
        resetAudioButton(currentAudioBtn);
      }

      if (wasThisPlaying) {
        audioEl.pause();
        resetAudioButton(btn);
        currentAudioBtn = null;
      } else {
        if (audioEl.getAttribute('data-src') !== src) {
          audioEl.src = src;
          audioEl.setAttribute('data-src', src);
        }
        audioEl.play().catch(function () { /* requiere gesto directo; ya lo tenemos */ });
        btn.classList.add('is-playing');
        btn.innerHTML = ICONS.pause;
        btn.setAttribute('aria-label', 'Pausar audio');
        currentAudioBtn = btn;
      }
    });

    return btn;
  }

  function resetAudioButton(btn) {
    btn.classList.remove('is-playing');
    btn.innerHTML = ICONS.play;
    btn.setAttribute('aria-label', 'Reproducir audio');
  }

  audioEl.addEventListener('ended', function () {
    if (currentAudioBtn) {
      resetAudioButton(currentAudioBtn);
      currentAudioBtn = null;
    }
  });

  /* ------------------------------------------------------------------
   * Fotos/videos horizontales se recortan en modo vertical (object-fit:
   * cover en styles.css). En vez de perder parte de la imagen, mostramos
   * un ícono invitando a girar el teléfono; ya en horizontal, CSS cambia
   * a object-fit: contain con un fondo borroso (.media-bg) de relleno.
   * Las cuadradas se benefician igual de "contain + fondo borroso" pero
   * SIN el aviso de rotar: girar el teléfono no ayuda a ver mejor un
   * cuadrado, así que se adaptan sin recorte sin importar la orientación.
   * ------------------------------------------------------------------ */
  function applyAspectTreatment(container, mediaEl, src, w, h) {
    if (!w || !h) return;
    var ratio = w / h;

    var bg = document.createElement('div');
    bg.className = 'media-bg';
    bg.style.backgroundImage = 'url(' + src + ')';

    if (ratio > 1.15) {
      container.classList.add('is-landscape');
      container.insertBefore(bg, mediaEl);

      var rotateHint = document.createElement('div');
      rotateHint.className = 'rotate-hint';
      rotateHint.innerHTML = ICONS.rotate
        + '<span>Gira tu teléfono para verla completa</span>';
      container.appendChild(rotateHint);
    } else if (ratio >= 0.9) {
      container.classList.add('is-square');
      container.insertBefore(bg, mediaEl);
    }
  }

  /* ------------------------------------------------------------------
   * Llena un contenedor ya posicionado (.slide o .carousel-item) con
   * la foto o el video correspondiente, más frase/audio si aplica.
   * ------------------------------------------------------------------ */
  function fillContainer(container, item) {
    if (item.type === 'video') {
      var video = document.createElement('video');
      video.src = item.src;
      if (item.poster) video.poster = item.poster;
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('aria-label', 'Video recuerdo, toca para activar el sonido');

      // Autoplay muted está permitido por los navegadores; el sonido
      // requiere el gesto directo del tap. El ícono de bocina es el
      // affordance visible de que el video tiene sonido para activar
      // (tocar el video en sí también funciona, es el mismo toggle).
      var muteBtn = document.createElement('button');
      muteBtn.type = 'button';
      muteBtn.className = 'mute-btn';
      muteBtn.innerHTML = ICONS.soundOff;
      muteBtn.setAttribute('aria-label', 'Activar sonido');

      function syncMuteBtn() {
        muteBtn.innerHTML = video.muted ? ICONS.soundOff : ICONS.soundOn;
        muteBtn.setAttribute('aria-label', video.muted ? 'Activar sonido' : 'Silenciar');
      }

      function toggleMute() {
        video.muted = !video.muted;
        syncMuteBtn();
      }

      video.addEventListener('click', toggleMute);
      muteBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleMute();
      });
      video.addEventListener('loadedmetadata', function () {
        applyAspectTreatment(container, video, item.src, video.videoWidth, video.videoHeight);
      });
      container.appendChild(video);
      container.appendChild(muteBtn);
      // video NUNCA lleva frase encima (regla del prompt)
      return;
    }

    if (item.type === 'photo') {
      var img = document.createElement('img');
      img.alt = item.alt || '';
      img.draggable = false; // si no, el navegador inicia un drag nativo
      // de la imagen y se comen los pointermove/pointerup del swipe

      img.addEventListener('load', function () {
        applyAspectTreatment(container, img, item.src, img.naturalWidth, img.naturalHeight);
      });

      img.src = item.src;
      container.appendChild(img);

      var pool = (item.fixedCaptions && item.fixedCaptions.length)
        ? item.fixedCaptions
        : (window.GENERIC_CAPTIONS || []);
      if (pool.length) {
        var caption = document.createElement('p');
        caption.className = 'meme-caption';
        caption.textContent = pool[Math.floor(Math.random() * pool.length)];
        container.appendChild(caption);
      }

      if (item.audio) {
        container.appendChild(buildAudioButton(item.audio));
      }
    }
  }

  /* ------------------------------------------------------------------
   * Carrusel: 2+ ítems que aparecen juntos, con swipe horizontal,
   * puntos indicadores y contador "1/N".
   * ------------------------------------------------------------------ */
  function buildCarousel(unit) {
    var root = document.createElement('div');
    root.className = 'carousel';

    var track = document.createElement('div');
    track.className = 'carousel-track';

    var dotsWrap = document.createElement('div');
    dotsWrap.className = 'carousel-indicator';

    var countEl = document.createElement('div');
    countEl.className = 'carousel-count';

    unit.items.forEach(function (item, i) {
      var cell = document.createElement('div');
      cell.className = 'carousel-item';
      fillContainer(cell, item);
      track.appendChild(cell);

      var dot = document.createElement('span');
      dot.className = 'carousel-dot' + (i === 0 ? ' is-active' : '');
      dotsWrap.appendChild(dot);
    });

    root.appendChild(track);
    root.appendChild(dotsWrap);
    root.appendChild(countEl);

    var total = unit.items.length;
    var current = 0;
    var dragging = false;
    var startX = 0;
    var deltaX = 0;
    var widthPx = 0;

    function paint(animate) {
      track.classList.toggle('is-dragging', !animate);
      track.style.transform = 'translateX(' + (-current * 100) + '%)';
      var dots = dotsWrap.children;
      for (var i = 0; i < dots.length; i++) {
        dots[i].classList.toggle('is-active', i === current);
      }
      countEl.textContent = (current + 1) + '/' + total;
    }

    function onDown(e) {
      dragging = true;
      startX = e.clientX;
      deltaX = 0;
      widthPx = root.clientWidth || 1;
      track.classList.add('is-dragging');
    }

    function onMove(e) {
      if (!dragging) return;
      deltaX = e.clientX - startX;
      track.style.transform = 'translateX(calc(' + (-current * 100) + '% + ' + deltaX + 'px))';
    }

    function onUp() {
      if (!dragging) return;
      dragging = false;
      var threshold = widthPx * 0.18;
      if (deltaX < -threshold && current < total - 1) current++;
      else if (deltaX > threshold && current > 0) current--;
      deltaX = 0;
      paint(true);
    }

    root.addEventListener('pointerdown', onDown);
    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerup', onUp);
    root.addEventListener('pointercancel', onUp);
    root.addEventListener('pointerleave', function (e) {
      // sólo cortar el drag si el puntero realmente se soltó fuera (mouse)
      if (dragging && e.pointerType !== 'touch') onUp();
    });

    paint(false);
    return root;
  }

  /* ------------------------------------------------------------------
   * Render de una unidad (foto / video / carrusel) en el viewer full-bleed
   * ------------------------------------------------------------------ */
  function renderUnit(unit) {
    viewerEl.innerHTML = '';
    currentAudioBtn = null;
    audioEl.pause();

    if (unit.type === 'carousel') {
      viewerEl.appendChild(buildCarousel(unit));
    } else {
      var slide = document.createElement('div');
      slide.className = 'slide is-active';
      fillContainer(slide, unit);
      viewerEl.appendChild(slide);
    }
  }

  /* ------------------------------------------------------------------
   * Contador persistente "RECUERDO N.º 00X"
   * ------------------------------------------------------------------ */
  function bumpCounter() {
    var n = parseInt(localStorage.getItem(STORAGE_KEYS.count) || '0', 10) + 1;
    localStorage.setItem(STORAGE_KEYS.count, String(n));
    var pad = (window.SITE_TEXT && window.SITE_TEXT.plateNumberPad) || 3;
    plateNumberEl.textContent = String(n).padStart(pad, '0');
  }

  /* ------------------------------------------------------------------
   * Selección aleatoria sin repetir el último elemento mostrado
   * ------------------------------------------------------------------ */
  function pickRandomIndex() {
    var list = window.MEMORIES || [];
    if (!list.length) return -1;
    if (list.length === 1) return 0;

    var storedLast = localStorage.getItem(STORAGE_KEYS.lastIndex);
    var last = storedLast === null ? null : parseInt(storedLast, 10);
    var idx;
    do {
      idx = Math.floor(Math.random() * list.length);
    } while (idx === last);

    localStorage.setItem(STORAGE_KEYS.lastIndex, String(idx));
    return idx;
  }

  function showRandomMemory() {
    var idx = pickRandomIndex();
    if (idx < 0) return;
    renderUnit(window.MEMORIES[idx]);
    bumpCounter();
  }

  reshuffleBtn.addEventListener('click', showRandomMemory);

  /* ------------------------------------------------------------------
   * Envoltorio de primera visita: scratch card con canvas.
   * Se borra con destination-out siguiendo el dedo; al superar el
   * umbral configurado, el resto se desvanece solo (o se revela con
   * un tap si el usuario prefiere movimiento reducido).
   * ------------------------------------------------------------------ */
  function initWrapper() {
    var overlay = document.getElementById('wrapper-overlay');
    var canvas = document.getElementById('wrapper-canvas');
    var image = document.getElementById('wrapper-image');
    var tapBtn = document.getElementById('wrapper-tap-btn');
    var cfg = window.WRAPPER || {};
    var ctx = canvas.getContext('2d');
    var revealed = false;
    var drawing = false;
    var lastX = 0, lastY = 0;
    var lastCheck = 0;

    function sizeCanvas() {
      var cssW = window.innerWidth;
      var cssH = window.innerHeight;
      var maxDim = 1100; // resolución interna acotada por performance
      var scale = Math.min(1, maxDim / Math.max(cssW, cssH));
      canvas.width = Math.max(1, Math.round(cssW * scale));
      canvas.height = Math.max(1, Math.round(cssH * scale));
    }

    function paintBase() {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = cfg.bgColor || '#2a1a10';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (image.complete && image.naturalWidth) {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      }
    }

    function toCanvasPoint(e) {
      var rect = canvas.getBoundingClientRect();
      var fx = canvas.width / rect.width;
      var fy = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * fx,
        y: (e.clientY - rect.top) * fy,
        f: (fx + fy) / 2,
      };
    }

    function eraseAt(x, y, radius) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    function eraseLine(x0, y0, x1, y1, radius) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = radius * 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    }

    function computeErasedFraction() {
      var w = canvas.width, h = canvas.height;
      var data = ctx.getImageData(0, 0, w, h).data;
      var total = 0, erased = 0;
      var pixelCount = w * h;
      var step = 6; // muestreo disperso: no hace falta leer cada pixel
      for (var p = 0; p < pixelCount; p += step) {
        total++;
        if (data[p * 4 + 3] === 0) erased++;
      }
      return total ? erased / total : 0;
    }

    function finishReveal() {
      if (revealed) return;
      revealed = true;
      overlay.classList.add('is-hidden');
    }

    function startAutoFade() {
      if (revealed) return;
      if (reduceMotion) {
        finishReveal();
        return;
      }
      canvas.classList.add('is-fading');
      var done = false;
      var onEnd = function () {
        if (done) return;
        done = true;
        finishReveal();
      };
      canvas.addEventListener('transitionend', onEnd, { once: true });
      // resguardo por si el navegador no dispara transitionend
      setTimeout(onEnd, 1200);
    }

    function maybeCheckReveal(force) {
      var now = performance.now();
      if (!force && now - lastCheck < 180) return;
      lastCheck = now;
      var fraction = computeErasedFraction();
      var threshold = cfg.revealThreshold != null ? cfg.revealThreshold : 0.68;
      if (fraction >= threshold) startAutoFade();
    }

    function onPointerDown(e) {
      if (revealed) return;
      drawing = true;
      var p = toCanvasPoint(e);
      var radius = (cfg.brushRadius || 34) * p.f;
      eraseAt(p.x, p.y, radius);
      lastX = p.x;
      lastY = p.y;
    }

    function onPointerMove(e) {
      if (!drawing || revealed) return;
      var p = toCanvasPoint(e);
      var radius = (cfg.brushRadius || 34) * p.f;
      eraseLine(lastX, lastY, p.x, p.y, radius);
      lastX = p.x;
      lastY = p.y;
      maybeCheckReveal(false);
    }

    function onPointerUp() {
      if (!drawing) return;
      drawing = false;
      maybeCheckReveal(true);
    }

    function setup() {
      sizeCanvas();
      paintBase();
    }

    if (image.complete) {
      setup();
    } else {
      image.addEventListener('load', setup);
      image.addEventListener('error', setup);
    }

    overlay.addEventListener('pointerdown', onPointerDown);
    overlay.addEventListener('pointermove', onPointerMove);
    overlay.addEventListener('pointerup', onPointerUp);
    overlay.addEventListener('pointercancel', onPointerUp);

    // Alternativa explícita para prefers-reduced-motion (o cualquiera
    // que prefiera no arrastrar el dedo): revela todo con un tap.
    tapBtn.addEventListener('click', function () {
      finishReveal();
    });
  }

  /* ------------------------------------------------------------------
   * Arranque
   * ------------------------------------------------------------------ */
  function init() {
    if (reduceMotion) {
      document.getElementById('app').classList.add('reduced-motion');
    }

    renderSocialBar();

    var visited = localStorage.getItem(STORAGE_KEYS.visited) === '1';

    if (!visited) {
      // Se marca aquí (no al terminar de destapar) para que, si el
      // usuario recarga a mitad de destape, no vuelva a empezar de cero.
      localStorage.setItem(STORAGE_KEYS.visited, '1');

      var firstList = (window.FIRST_VISIT && window.FIRST_VISIT.length)
        ? window.FIRST_VISIT
        : window.MEMORIES;
      var firstUnit = firstList.length > 1
        ? { type: 'carousel', items: firstList }
        : firstList[0];

      renderUnit(firstUnit);
      bumpCounter();
      initWrapper();
    } else {
      document.getElementById('wrapper-overlay').classList.add('is-hidden');
      showRandomMemory();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
