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
