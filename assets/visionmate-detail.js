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

/* Scroll the inner page container back to the top when the route (path) changes. */
(() => {
  let last = location.pathname;
  const toTop = () => {
    if (location.pathname === last) return;
    last = location.pathname;
    document.querySelectorAll('div').forEach((d) => {
      if (d.scrollTop > 0 && /auto|scroll/.test(getComputedStyle(d).overflowY)) d.scrollTop = 0;
    });
    scrollTo(0, 0);
  };
  const wrap = (k) => {
    const orig = history[k];
    history[k] = function (...a) { const r = orig.apply(this, a); setTimeout(toTop, 0); return r; };
  };
  wrap('pushState');
  wrap('replaceState');
  addEventListener('popstate', () => setTimeout(toTop, 0));
})();

/* QRPLACE detail: why-section, example mockup gallery with use notes, extra hero buttons (only on /products/qrplace). */
(() => {
  const shots = [
    ['qrplace-sample-center.webp', 640, '주민센터',
     '게시판을 지나쳐도 운영시간·주민 프로그램·생활 공지를 휴대폰으로 다시 확인합니다.',
     '행정복지센터 모바일 안내 시안. 홈, 센터안내, 민원안내, 주민자치 프로그램 화면이 휴대폰 4대에 나란히 보입니다.'],
    ['qrplace-sample-arboretum.webp', 682, '관광지',
     '임시 휴무나 우회로 같은 변경을 현장에서 바로 반영해 헛걸음을 줄입니다.',
     '수목원 모바일 안내 시안. 메인, 관람안내, 볼거리, 자주 묻는 질문 화면이 휴대폰 4대에 나란히 보입니다.'],
    ['qrplace-sample-market.webp', 640, '지역 행사',
     '리플릿을 인쇄한 뒤 바뀐 일정도 모바일 페이지만 고쳐 안내합니다.',
     '동네 플리마켓 모바일 안내 시안. 홈, 기본정보, 프로그램, 사진 화면이 휴대폰 4대에 나란히 보입니다.'],
  ];
  const why = [
    ['역할을 나눕니다', '종이 안내판은 변하지 않는 핵심만, QR 모바일 안내는 오늘의 운영시간·휴무·동선 변경을, 공식 홈페이지는 상세 공고와 신청을 맡습니다.'],
    ['고칠 사람을 정합니다', '본부가 공통 메뉴와 안내 기준을 만들고, 바뀐 내용을 가장 먼저 아는 현장 담당자가 바로 고칩니다. 방문객은 늘 최신 정보를 봅니다.'],
    ['작게 시작합니다', '모든 곳을 한 번에 바꾸지 않습니다. 안내가 많이 필요하고 담당자가 분명한 2~3곳부터 시범으로 운영해 보고 넓힙니다.'],
  ];
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  let t = 0;
  function run() {
    t = 0;
    if (location.pathname.replace(/\/+$/, '') !== '/products/qrplace') return;
    const main = document.querySelector('main.product-detail-page');
    const lead = main && main.querySelector('.detail-lead');
    if (!lead || main.querySelector('.vp-gallery')) return;

    // Why QRPLACE
    const whySec = el('section', 'section vp-why');
    whySec.setAttribute('aria-label', '왜 QRPLACE인가');
    whySec.append(el('p', 'section-label', 'WHY QRPLACE'), el('h2', '', 'QR을 만드는 것보다, 계속 맞게 유지하는 것이 중요합니다.'));
    const wg = el('div', 'vp-feature-grid');
    why.forEach(([h, p], i) => { const a = el('article'); a.append(el('span', '', String(i + 1).padStart(2, '0')), el('h4', '', h), el('p', '', p)); wg.append(a); });
    whySec.append(wg);

    // Gallery with use notes + store card
    const gal = el('section', 'section vp-gallery');
    gal.setAttribute('aria-label', 'QRPLACE 활용 시안');
    gal.append(el('p', 'section-label', 'USE MOCKUPS'), el('h2', '', '이런 곳에 씁니다'));
    shots.forEach(([src, h, tag, note, alt]) => {
      const f = el('figure');
      const img = document.createElement('img');
      Object.assign(img, { src: `/assets/${src}`, alt, loading: 'lazy', width: 1600, height: h });
      f.append(el('span', '', tag), img);
      const cap = el('figcaption'); cap.append(el('b', '', tag), document.createTextNode(' · ' + note)); f.append(cap);
      gal.append(f);
    });
    const store = el('article', 'vp-store');
    store.append(el('b', '', '매장·박람회'), el('p', '', '테이블 QR 스탠드와 입간판으로 메뉴·상품·소개를 보여 주고, 필요하면 영어·중국어·일본어로 안내합니다. QR 간판과 홍보물 제작까지 함께 진행합니다.'));
    gal.append(store, el('p', 'vp-gallery-note', '위 화면은 활용 시안입니다. 실제 고객 사례나 운영 중인 기관의 화면이 아닙니다.'));

    lead.after(whySec, gal);

    // Extra hero buttons: inquiry to VisionMate + live demo
    const cta = main.querySelector('a.primary-button');
    if (cta && !main.querySelector('.vp-hero-extra')) {
      const box = el('span', 'vp-hero-extra');
      const ask = el('a', 'text-button', '도입 문의 →'); ask.href = '/contact';
      const demo = el('a', 'text-button', '체험하기 ↗'); Object.assign(demo, { href: 'https://app.qrplace.co.kr/jbom', target: '_blank', rel: 'noopener noreferrer' });
      box.append(ask, demo);
      cta.after(box);
    }
  }
  new MutationObserver(() => { if (!t) t = setTimeout(run, 40); }).observe(document.body, { childList: true, subtree: true });
  addEventListener('popstate', () => setTimeout(run, 80));
  run();
})();

/* QRPLACE detail: turn the capability chips into cards with a one-line explanation each. */
(() => {
  const info = {
    '모바일 안내 페이지': '위치, 운영시간, 전화번호, 소개, 사진, 공지를 휴대폰 화면 하나에 정리합니다.',
    '다국어 안내': '영어·중국어·일본어로 꼭 필요한 이용 방법과 문의처만 골라 안내합니다.',
    '담당자 직접 수정': '휴무, 일정, 동선이 바뀌면 현장 담당자가 관리자 화면에서 바로 고칩니다.',
    '인수인계 기록': '계정 주인, 갱신 일정, 원본 사진과 문구를 남겨 담당자가 바뀌어도 안내가 이어집니다.',
    'QR 간판과 홍보물 제작': '테이블 스탠드, 입간판, 배너, 창문 스티커 같은 QR 홍보물을 함께 만듭니다.',
  };
  let t = 0;
  function run() {
    t = 0;
    if (location.pathname.replace(/\/+$/, '') !== '/products/qrplace') return;
    const row = document.querySelector('main.product-detail-page .capability-band .tag-row:not([data-vp-cards])');
    if (!row) return;
    const names = [...row.children].map((c) => c.textContent.trim());
    if (!names.every((n) => info[n])) return;
    row.dataset.vpCards = '1';
    row.hidden = true;
    const grid = document.createElement('div');
    grid.className = 'vp-feature-grid';
    names.forEach((n, i) => {
      const card = document.createElement('article');
      card.innerHTML = `<span>${String(i + 1).padStart(2, '0')}</span><h4></h4><p></p>`;
      card.querySelector('h4').textContent = n;
      card.querySelector('p').textContent = info[n];
      grid.appendChild(card);
    });
    row.after(grid);
  }
  new MutationObserver(() => { if (!t) t = setTimeout(run, 40); }).observe(document.body, { childList: true, subtree: true });
  addEventListener('popstate', () => setTimeout(run, 80));
  run();
})();
