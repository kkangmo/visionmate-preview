/* VisionMate AEO·GEO page: fills the empty <main id="vm-aisearch-root"> rendered for /ai-search. */
(() => {
  const HTML = `
<section class="as-hero">
  <div class="as-wrap">
    <p class="as-kicker">AEO · GEO · SEO</p>
    <h1>구글과 AI가<br><em>먼저 찾는 회사</em>로.</h1>
    <p class="as-lead">요즘 고객은 구글에 검색하고, ChatGPT나 제미나이 같은 AI에게 물어봅니다. 그때 우리 회사가 나오도록 홈페이지, 글, 기사를 차근차근 쌓아 드립니다.</p>
    <div class="as-actions"><a class="as-btn" data-go="/contact" href="/contact">진단 문의하기 →</a><a class="as-btn ghost" data-go="/cases" href="/cases">구축 사례 보기</a></div>
  </div>
</section>

<section class="as-sec">
  <div class="as-wrap as-split">
    <div><p class="as-label">왜 몇 달이 걸릴까요?</p><h2>검색은<br>하루아침에 바뀌지 않습니다.</h2></div>
    <div class="as-copy">
      <p>구글과 AI는 오랫동안 꾸준히 쌓인 정보를 믿습니다. 광고처럼 돈을 내면 바로 나오는 방식이 아니라서, <b>몇 달 동안 매달 조금씩 쌓아야</b> 효과가 나타납니다.</p>
      <p>비전메이트는 그 과정을 매달 함께 관리합니다.</p>
    </div>
  </div>
</section>

<section class="as-sec">
  <div class="as-wrap">
    <p class="as-label">이렇게 도와드립니다</p>
    <h2>AEO·GEO·SEO, 쉽게 말하면 이렇습니다.</h2>
    <div class="as-grid">
      <article><span>SEO</span><h3>검색에 잘 나오게</h3><p>구글·네이버가 우리 홈페이지를 잘 읽고 보여 주도록 고칩니다.</p></article>
      <article><span>AEO</span><h3>질문에 답하는 글</h3><p>고객이 자주 묻는 질문에 딱 맞는 답을 글로 만들어, 검색 답변에 쓰이기 좋게 정리합니다.</p></article>
      <article><span>GEO</span><h3>AI가 우리를 소개하게</h3><p>ChatGPT·제미나이 같은 AI가 우리 회사를 정확히 알고 말해 줄 수 있도록 정보를 정리합니다.</p></article>
      <article><span>PR</span><h3>기사로 알리기</h3><p>보도자료를 만들어 언론에 소개될 기회를 만듭니다.</p></article>
      <article><span>CONTENT</span><h3>믿을 수 있는 글 쌓기</h3><p>누가 썼는지, 근거가 무엇인지 분명한 전문 글을 꾸준히 올립니다.</p></article>
      <article><span>REPORT</span><h3>매달 확인하고 알려 드리기</h3><p>검색과 AI 답변에 우리 회사가 어떻게 나오는지 매달 살펴보고 보고합니다.</p></article>
    </div>
  </div>
</section>

<section class="as-sec">
  <div class="as-wrap">
    <p class="as-label">몇 달 동안 이렇게 진행합니다</p>
    <h2>한 달씩, 차근차근 쌓습니다.</h2>
    <ol class="as-time">
      <li><small>1개월</small><h4>살펴보기</h4><p>지금 검색과 AI 답변에서 우리 회사가 어떻게 보이는지, 경쟁사와 비교해 확인합니다.</p></li>
      <li><small>2~3개월</small><h4>기초 다지기</h4><p>홈페이지 정보를 바로잡고, 자주 묻는 질문과 사례를 정리하고, 첫 전문 글을 올립니다.</p></li>
      <li><small>4~6개월</small><h4>넓히기</h4><p>전문 글을 꾸준히 올리고 기사와 외부 소개를 늘리며, AI 답변에 우리 회사가 나오는지 확인합니다.</p></li>
      <li><small>그 이후</small><h4>매달 다듬기</h4><p>무엇이 효과가 있었는지 보고 다음 달 계획을 세웁니다.</p></li>
    </ol>
    <p class="as-note">일정은 회사마다 다릅니다. 검색 순위, 기사 게재, AI 답변 노출을 약속하지는 않습니다.</p>
  </div>
</section>

<section class="as-sec">
  <div class="as-wrap as-split">
    <div><p class="as-label">비전메이트가 다른 점</p><h2>기사 한 번으로<br>끝내지 않습니다.</h2></div>
    <ul class="as-points">
      <li><b>직접 해 보고 있습니다.</b><span>비전메이트 홈페이지와 웹매거진 TrendMate에 같은 방법을 적용하고 있습니다.</span></li>
      <li><b>하나로 묶어 관리합니다.</b><span>홈페이지, 글, 기사, 확인을 따로 하지 않고 한 계획 안에서 매달 관리합니다.</span></li>
      <li><b>사실만 씁니다.</b><span>실제 정보와 근거만 사용하고, 가짜 후기나 돈으로 산 링크는 쓰지 않습니다.</span></li>
    </ul>
  </div>
</section>

<section class="as-cta">
  <div class="as-wrap">
    <h2>우리 회사는 지금<br><em>어떻게 검색되고 있을까요?</em></h2>
    <p>먼저 살펴보고, 무엇부터 하면 좋을지 알려 드립니다.</p>
    <a class="as-btn" data-go="/contact" href="/contact">진단 문의하기 →</a>
  </div>
</section>`;

  function base() {
    const ref = [...document.querySelectorAll('a[href$="/contact"]')].find((x) => !x.closest('#vm-aisearch-root'));
    return ref ? ref.getAttribute('href').slice(0, -'/contact'.length) : '';
  }
  function go(path) {
    const a = [...document.querySelectorAll('a[href]')].find((x) => !x.closest('#vm-aisearch-root') && (x.getAttribute('href') || '').replace(/\/$/, '').endsWith(path));
    if (a) { a.click(); return; }
    history.pushState({}, '', base() + path);
    dispatchEvent(new PopStateEvent('popstate'));
    scrollTo(0, 0);
  }
  let t = 0;
  function fill() {
    t = 0;
    const root = document.getElementById('vm-aisearch-root');
    if (!root || root.dataset.filled) return;
    root.dataset.filled = '1';
    root.innerHTML = HTML;
    const b = base();
    root.querySelectorAll('[data-go]').forEach((a) => {
      a.setAttribute('href', b + a.dataset.go);
      a.addEventListener('click', (e) => { if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); go(a.dataset.go); });
    });
  }
  new MutationObserver(() => { if (!t) t = setTimeout(fill, 30); }).observe(document.body, { childList: true, subtree: true });
  fill();
})();
