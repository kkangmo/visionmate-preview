/* VisionMate detail layer: turns "a · b · c" capability text on case detail pages into chips. */
(() => {
  let t = 0;
  function run() {
    t = 0;
    const p = document.querySelector('.case-detail-page .case-facts article:nth-child(3) > p:not([data-vp])');
    if (!p) return;
    const parts = p.textContent.split(' · ').map((s) => s.trim()).filter(Boolean);
    if (parts.length < 2) return;
    p.dataset.vp = '1';
    p.hidden = true;
    const box = document.createElement('div');
    box.className = 'vp-chips';
    parts.forEach((s) => { const c = document.createElement('span'); c.textContent = s; box.appendChild(c); });
    p.after(box);
  }
  new MutationObserver(() => { if (!t) t = setTimeout(run, 30); }).observe(document.body, { childList: true, subtree: true });
  run();
})();

/* Page background image per route (set as data attribute on the page main). */
(() => {
  const pick = (path) => {
    const p = path.replace(/\/+$/, '');
    if (/\/(cases\/mategift-distribution-ai|products\/mategift(-lab)?)$/.test(p)) return 'gift';
    if (/\/(cases|products)\/pungsumate$/.test(p)) return 'pungsu';
    if (/\/products(\/trendmate)?$/.test(p)) return 'products';
    if (/\/cases$/.test(p)) return 'cases';
    return '';
  };
  let t = 0;
  function apply() {
    t = 0;
    const main = document.querySelector('main:is(.case-detail-page, .product-detail-page, .cases-hub-page, .products-hub-page)');
    if (!main) return;
    const bg = pick(location.pathname);
    if (bg && main.dataset.vpBg !== bg) main.dataset.vpBg = bg;
  }
  new MutationObserver(() => { if (!t) t = setTimeout(apply, 30); }).observe(document.body, { childList: true, subtree: true });
  addEventListener('popstate', () => setTimeout(apply, 60));
  apply();
})();
