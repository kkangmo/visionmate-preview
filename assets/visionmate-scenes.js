/* VisionMate scenes: section reveal + card spotlight. Never touches the hero (.pin-journey). */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const groups = [
    '.vm-positioning-head', '.vm-model-row',
    '.products-section > .section-heading', '.product-story',
    '.lab-detail .section-heading', '.lab-detail-body', '.lab-features article', '.lab-compare-col', '.lab-detail-foot',
    '.ss-kicker', '.ss-headline', '.ss-intro',
    '.vm-process-heading', '.vm-process-list > li',
    '.final-cta-inner > *'
  ];
  const selector = groups.map((s) => `.home-route main ${s}`).join(',');
  const seen = new WeakSet();
  let scanFrame = 0;

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.dataset.vmRevealed = 'true';
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  function scan() {
    scanFrame = 0;
    if (reduced.matches) return;
    document.querySelectorAll(selector).forEach((el) => {
      if (seen.has(el) || el.closest('.pin-journey')) return;
      seen.add(el);
      const siblings = Array.from(el.parentElement.children).filter((c) => c.matches(selector));
      const index = Math.max(0, siblings.indexOf(el));
      el.style.setProperty('--vm-reveal-delay', `${Math.min(index, 5) * 80}ms`);
      el.dataset.vmReveal = 'true';
      observer.observe(el);
    });
  }

  if (!reduced.matches) document.documentElement.classList.add('vm-reveal-ready');
  reduced.addEventListener('change', () => {
    document.documentElement.classList.toggle('vm-reveal-ready', !reduced.matches);
    document.querySelectorAll('[data-vm-reveal]').forEach((el) => { el.dataset.vmRevealed = 'true'; });
  });

  new MutationObserver(() => { if (!scanFrame) scanFrame = requestAnimationFrame(scan); })
    .observe(document.body, { childList: true, subtree: true });
  scan();

  // Safety net: never leave content hidden if the observer misses something.
  setTimeout(() => {
    document.querySelectorAll('[data-vm-reveal]:not([data-vm-revealed])').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) el.dataset.vmRevealed = 'true';
    });
  }, 2500);

  // Cursor spotlight
  const spot = '.home-route :is(.product-story, .lab-features article, .lab-compare-col)';
  document.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const card = e.target.closest && e.target.closest(spot);
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--vm-mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--vm-my', `${e.clientY - r.top}px`);
  }, { passive: true });
})();

/* Magnetic buttons (mouse only, hero excluded) */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const sel = '.home-route main > section:not(.pin-journey) .primary-button';
  let active = null;
  document.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const btn = e.target.closest && e.target.closest(sel);
    if (active && active !== btn) { active.style.setProperty('--vm-bx', '0px'); active.style.setProperty('--vm-by', '0px'); active = null; }
    if (!btn) return;
    active = btn;
    const r = btn.getBoundingClientRect();
    btn.style.setProperty('--vm-bx', `${((e.clientX - r.left) / r.width - .5) * 8}px`);
    btn.style.setProperty('--vm-by', `${((e.clientY - r.top) / r.height - .5) * 6}px`);
  }, { passive: true });
})();

/* Paper Shaders mesh gradient behind the products section (hero excluded).
   Loads when the section nears the viewport; re-attaches if the section re-renders; pauses offscreen. */
(() => {
  const SRC = 'https://cdn.jsdelivr.net/npm/@paper-design/shaders@0.0.81/+esm';
  const sel = '.home-route main > section.products-section:not(.pin-journey)';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SPEED = reduced ? 0 : 0.25;
  let lib = null, current = null, mount = null, frame = 0;
  const visible = new IntersectionObserver(([e]) => { if (mount) mount.setSpeed(e.isIntersecting ? SPEED : 0); });

  function build(section) {
    if (mount) { try { mount.dispose(); } catch (_) {} mount = null; }
    visible.disconnect();
    const layer = document.createElement('div');
    layer.className = 'vm-shader-layer';
    layer.setAttribute('aria-hidden', 'true');
    section.prepend(layer);
    const { ShaderMount, meshGradientFragmentShader, getShaderColorFromString } = lib;
    const colors = ['#070B14', '#0B2A3A', '#0E7C86', '#123056'].map(getShaderColorFromString);
    try {
      mount = new ShaderMount(layer, meshGradientFragmentShader, {
        u_colors: colors, u_colorsCount: colors.length,
        u_distortion: 0.8, u_swirl: 0.15, u_grainMixer: 0, u_grainOverlay: 0.04,
        u_fit: 2, u_scale: 1, u_rotation: 0, u_offsetX: 0, u_offsetY: 0,
        u_originX: 0.5, u_originY: 0.5, u_worldWidth: 0, u_worldHeight: 0
      }, undefined, SPEED, 0, 1, 1920 * 1080);
      layer.dataset.ready = 'true';
      visible.observe(section);
    } catch (_) { layer.remove(); }
  }

  function check() {
    frame = 0;
    const section = document.querySelector(sel);
    if (section && !section.offsetParent) return; // hidden (A2 layer active)
    if (!section || (section === current && section.querySelector(':scope > .vm-shader-layer'))) return;
    const r = section.getBoundingClientRect();
    if (r.top > innerHeight + 400 || r.bottom < -400) return;
    current = section;
    if (lib) { build(section); return; }
    import(SRC).then((m) => { lib = m; current = null; check(); }).catch(() => {});
  }
  const queue = () => { if (!frame) frame = requestAnimationFrame(check); };
  if (!window.WebGLRenderingContext) return;
  new MutationObserver(queue).observe(document.body, { childList: true, subtree: true });
  addEventListener('scroll', queue, { passive: true, capture: true });
  addEventListener('resize', queue, { passive: true });
  queue();
})();
