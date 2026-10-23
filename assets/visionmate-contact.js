/* VisionMate contact layer: adds a project inquiry form to the /contact page card. */
(() => {
  const TYPES = ['AI 서비스 개발', '업무 자동화', '홈페이지·AEO·GEO', '기타'];
  const BUDGETS = ['미정', '500만 원 미만', '500만~2,000만 원', '2,000만 원 이상'];
  const SCHEDULES = ['미정', '1개월 안', '1~3개월', '3개월 이후'];
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const chips = (name, list, first) => list.map((v, i) => `<label class="vmc-chip"><input type="radio" name="${name}" value="${esc(v)}"${first && i === 0 ? ' checked' : ''}><span>${esc(v)}</span></label>`).join('');

  function build(card) {
    const opened = Date.now();
    const form = document.createElement('form');
    form.className = 'vmc-form';
    form.noValidate = true;
    form.innerHTML = `
      <fieldset class="vmc-field"><legend>문의 종류</legend><div class="vmc-chips">${chips('type', TYPES, true)}</div></fieldset>
      <label class="vmc-field"><span>지금 하는 일과 불편한 점 <em>필수</em></span>
        <textarea name="problem" rows="4" maxlength="3000" required placeholder="예) 주문이 들어오면 엑셀로 옮기고 문자를 따로 보내는 일이 매일 2시간씩 걸립니다."></textarea></label>
      <label class="vmc-field"><span>원하는 변화</span>
        <textarea name="goal" rows="2" maxlength="2000" placeholder="예) 주문 확인부터 안내 문자까지 자동으로 처리되면 좋겠습니다."></textarea></label>
      <fieldset class="vmc-field"><legend>예산</legend><div class="vmc-chips">${chips('budget', BUDGETS, true)}</div></fieldset>
      <fieldset class="vmc-field"><legend>일정</legend><div class="vmc-chips">${chips('schedule', SCHEDULES, true)}</div></fieldset>
      <div class="vmc-row">
        <label class="vmc-field"><span>이름 <em>필수</em></span><input name="name" maxlength="60" autocomplete="name" required></label>
        <label class="vmc-field"><span>회사·기관</span><input name="company" maxlength="80" autocomplete="organization"></label>
      </div>
      <label class="vmc-field"><span>연락처 (이메일 또는 전화번호) <em>필수</em></span><input name="contact" maxlength="120" autocomplete="email" required></label>
      <label class="vmc-hp" aria-hidden="true">웹사이트<input name="website" tabindex="-1" autocomplete="off"></label>
      <label class="vmc-agree"><input type="checkbox" name="agree" required>
        <span>문의 응대를 위해 이름·회사·연락처·문의 내용을 수집하고, 문의 처리 후 3년간 보관하는 데 동의합니다. <a href="/privacy">개인정보 처리방침</a></span></label>
      <p class="vmc-msg" role="status" aria-live="polite"></p>
      <button type="submit" class="vmc-submit">문의 보내기</button>`;

    const msg = form.querySelector('.vmc-msg');
    const btn = form.querySelector('.vmc-submit');
    const show = (text, ok) => { msg.textContent = text; msg.dataset.state = ok ? 'ok' : 'error'; };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const data = Object.fromEntries(fd.entries());
      data.agree = form.agree.checked;
      data.elapsed = Date.now() - opened;
      if (!data.problem.trim() || !data.name.trim() || !data.contact.trim()) { show('이름, 연락처, 문의 내용을 입력해 주세요.'); return; }
      if (!data.agree) { show('개인정보 수집·이용에 동의해 주세요.'); return; }
      btn.disabled = true; btn.textContent = '보내는 중…'; show('');
      try {
        const r = await fetch('/contact-send.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        const j = await r.json().catch(() => ({ ok: false, message: '전송에 실패했습니다. 대표전화 070-4914-3588로 연락해 주세요.' }));
        if (j.ok) {
          form.innerHTML = `<div class="vmc-done"><strong>문의가 접수되었습니다.</strong><p>남겨주신 연락처로 1영업일 안에 연락드리겠습니다.<br>급한 일은 대표전화 <a href="tel:070-4914-3588">070-4914-3588</a>로 연락해 주세요.</p></div>`;
          return;
        }
        show(j.message || '전송에 실패했습니다.');
      } catch (_) {
        show('전송에 실패했습니다. 대표전화 070-4914-3588 또는 visionmatebiz@gmail.com으로 연락해 주세요.');
      }
      btn.disabled = false; btn.textContent = '문의 보내기';
    });
    return form;
  }

  let t = 0;
  function run() {
    t = 0;
    const card = document.querySelector('main.contact-route-page .contact-locked:not([data-vmc])');
    if (!card) return;
    card.dataset.vmc = '1';
    const h3 = card.querySelector('h3');
    if (h3) h3.textContent = '문의 남기기';
    const intro = h3 && h3.nextElementSibling && h3.nextElementSibling.tagName === 'P' ? h3.nextElementSibling : null;
    if (intro) intro.textContent = '아래 내용을 남겨주시면 검토 후 연락드립니다. 기술이나 기능 목록은 몰라도 괜찮습니다.';
    const form = build(card);
    (intro || h3 || card.firstChild).after(form);
    const or = document.createElement('p');
    or.className = 'vmc-or';
    or.textContent = '또는 바로 연락하기';
    form.after(or);
  }
  new MutationObserver(() => { if (!t) t = setTimeout(run, 30); }).observe(document.body, { childList: true, subtree: true });
  run();
})();
