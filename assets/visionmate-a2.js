/* VisionMate A2 home sections: replaces the sections below the hero on the home route only.
   The hero (.pin-journey) is never touched. Original sections stay in the DOM (hidden) so internal links still route through the app. */
(() => {
  const HTML = "<section class=\"manifesto\"><div class=\"wrap\">\n  <div class=\"kicker r\">Vision → Business</div>\n  <h2 class=\"r lines\"><span><i>가능성을 읽고,</i></span><span><i><em>작동하는 비즈니스</em>를</i></span><span><i>만듭니다.</i></span></h2>\n  <p class=\"lead r\">아이디어가 서비스가 되고, 흩어진 업무가 하나의 흐름이 되도록. 비전메이트는 전략과 AI·데이터·개발을 연결하는 비즈니스 빌더입니다.</p>\n</div></section>\n\n<section><div class=\"wrap\">\n  <div class=\"head r\"><h2 class=\"mid\">흩어진 업무를,<br><em>하나의 흐름</em>으로.</h2><span class=\"no\">01 / AX</span></div>\n  <div class=\"ax\">\n    <div>\n      <p class=\"lead r\">반복되는 업무, 따로 노는 도구, 연결되지 않는 데이터. 비전메이트는 사람과 AI의 역할을 나누고, 업무가 하나의 운영 흐름으로 이어지도록 설계합니다.</p><div class=\"cost r\"><b>운영비 최소화</b><span>실행 중 AI 호출을 최소화해, 한 번 만들면 이용이 늘어도 운영비가 쌓이지 않도록 설계합니다.</span></div>\n      <div class=\"state r\"><button data-s=\"0\">지금의 업무</button><button data-s=\"1\" class=\"act\">연결된 뒤</button></div>\n      <div class=\"points\">\n        <div class=\"r\"><b>01</b><h4>어떤 기회를 발견했나요?</h4><p>시장과 고객, 현재 업무에서 출발합니다.</p></div>\n        <div class=\"r\"><b>02</b><h4>무엇을 실제로 만들까요?</h4><p>필요한 서비스와 시스템을 구체화합니다.</p></div>\n        <div class=\"r\"><b>03</b><h4>어떻게 운영하고 개선할까요?</h4><p>사람과 AI의 역할을 나누고 연결합니다.</p></div>\n      </div>\n    </div>\n    <div class=\"stage r\" id=\"stage\" aria-label=\"흩어진 업무가 AI를 중심으로 연결되는 개념 그림\">\n      <svg viewBox=\"0 0 100 100\" preserveAspectRatio=\"none\" id=\"links\"></svg>\n      <div class=\"tag\" id=\"tag\">BEFORE · <b>흩어진 업무</b></div>\n      <div class=\"core\">AI<br>WORKFLOW</div>\n    </div>\n  </div>\n  <p class=\"cap r\"><a class=\"more-link\" data-go=\"/about\" href=\"/about\">비전메이트의 방식 자세히 보기 →</a><br>개념 그림 · 실제 고객 사례나 성과 데이터가 아닙니다.</p>\n</div></section>\n\n<section><div class=\"wrap\">\n  <div class=\"head r\"><h2 class=\"mid\">직접 만들고,<br>운영에서 배웁니다.</h2><span class=\"no\">02 / BUILT &amp; OPERATED</span></div>\n  <div class=\"prod\">\n    <div>\n      <div class=\"kicker r\">AI Campaign Planning</div>\n      <div class=\"big r\" style=\"margin-top:24px\">MateGift<br>Lab</div>\n      <p class=\"lead r\" style=\"margin-top:28px\"><strong style=\"color:var(--text)\">판촉물을 고르는 대신, 캠페인을 설계합니다.</strong> 목적·인원·예산을 입력하면 배포 전략부터 상품·브랜드·예산 구성까지 실행 가능한 판촉 캠페인으로 만들어드립니다.</p>\n      <div class=\"steps r\"><span>01 상황 입력</span><span>02 운영안 설계</span><span>03 예산 배분</span><span>04 상품·브랜드</span><span>05 실제 견적</span></div>\n      <a class=\"btn r\" href=\"https://recommend.visionmate.co.kr/lab-v3\" target=\"_blank\" rel=\"noopener\">MateGift Lab 체험하기 →</a>\n    </div>\n    <div class=\"r\">\n      <div class=\"screen spot\">\n        <div class=\"bar\"><i></i><i></i><i></i><span>MateGift Lab · 추천 운영안</span><em>EXAMPLE</em></div>\n        <div class=\"inrow\"><small>입력</small>박람회 부스 · 3일 · 브랜드 선호 있음</div>\n        <div class=\"rows\">\n          <div><span>일반 방문객<small>방문 기념</small></span><b>350명</b><u style=\"--w:70%\"></u></div>\n          <div><span>상담 완료 고객<small>상담 감사</small></span><b>120명</b><u style=\"--w:40%\"></u></div>\n          <div><span>VIP · 핵심고객<small>관계 강화</small></span><b>30명</b><u style=\"--w:18%\"></u></div>\n        </div>\n        <div class=\"sum\"><small>예산</small><b>5,000,000원</b></div>\n      </div>\n      <p class=\"cap\">예시 화면 · 숫자는 이해를 돕기 위한 가상의 조건입니다.</p>\n    </div>\n  </div>\n  <div class=\"mg r spot\">\n    <div class=\"kicker\">자체 서비스</div>\n    <div><h4>메이트기프트</h4><p>목적과 예산에 맞는 판촉 상품을 찾고, 캠페인 구성과 상담으로 이어지는 판촉 기획·판매 서비스입니다.</p></div>\n    <a class=\"btn ghost\" data-go=\"/products/mategift\" href=\"/products/mategift\">자세히 보기 →</a>\n  </div>\n</div></section>\n\n<section><div class=\"wrap\">\n  <div class=\"head r\"><h2 class=\"mid\">지금 필요한<br><em>변화부터.</em></h2><span class=\"no\">03 / AI SOLUTIONS</span></div>\n  <div class=\"idx\">\n    <a class=\"r\" data-go=\"/solutions/ai-business\" href=\"/solutions/ai-business\"><small>01</small><h4>AI Business</h4><p>아이디어를 첫 서비스로.</p><i>→</i>\n      <div class=\"more\"><div><div><em>구축 범위</em><span>사업 구조 설계</span><span>서비스 기획</span><span>MVP</span></div><div><em>이런 일에</em><p>사업 아이디어 검토 · 신규 서비스 MVP · 고객 경험 설계</p></div></div></div></a>\n    <a class=\"r\" data-go=\"/solutions/ai-system\" href=\"/solutions/ai-system\"><small>02</small><h4>AI Systems</h4><p>AI와 데이터를 실제 업무로.</p><i>→</i>\n      <div class=\"more\"><div><div><em>구축 범위</em><span>웹 서비스</span><span>데이터 연동</span><span>AI 기능</span></div><div><em>이런 일에</em><p>고객용 웹 서비스 · 내부 업무 도구 · AI 추천 흐름</p></div></div></div></a>\n    <a class=\"r\" data-go=\"/solutions/automation\" href=\"/solutions/automation\"><small>03</small><h4>Automation</h4><p>반복을 줄이고, 판단에 집중하도록.</p><i>→</i>\n      <div class=\"more\"><div><div><em>구축 범위</em><span>워크플로</span><span>API 연동</span><span>결과 기록</span></div><div><em>이런 일에</em><p>반복 자료 정리 · 알림 및 보고 · 도구 간 데이터 연결</p></div></div></div></a>\n    <a class=\"r\" data-go=\"/solutions/growth\" href=\"/solutions/growth\"><small>04</small><h4>Growth Systems</h4><p>검색과 콘텐츠를 쌓이는 자산으로.</p><i>→</i>\n      <div class=\"more\"><div><div><em>구축 범위</em><span>검색 구조</span><span>콘텐츠 운영</span><span>유입 분석</span></div><div><em>이런 일에</em><p>정보 구조 정리 · 콘텐츠 운영 · 유입 및 문의 흐름 점검</p></div></div></div></a>\n  </div>\n</div></section>\n\n<section><div class=\"wrap\">\n  <div class=\"head r\"><h2 class=\"mid\">아이디어의 다음 장면을,<br>함께 만들어 갑니다.</h2><span class=\"no\">04 / HOW WE BUILD</span></div>\n  <ol class=\"proc r\">\n    <li><small>01 DISCOVER</small><h4>문제를 발견합니다.</h4><p>누가, 어떤 상황에서, 무엇을 어려워하는지 살펴봅니다.</p></li>\n    <li><small>02 DESIGN</small><h4>실행할 구조를 만듭니다.</h4><p>사용자 경험과 데이터, 사람이 판단할 지점을 설계합니다.</p></li>\n    <li><small>03 BUILD</small><h4>작동하는 버전으로 검증합니다.</h4><p>핵심 기능부터 구현해 실제 사용 환경에서 확인합니다.</p></li>\n    <li><small>04 CONNECT</small><h4>업무의 사이를 연결합니다.</h4><p>흩어진 도구와 데이터를 하나의 운영 흐름으로 잇습니다.</p></li>\n    <li><small>05 OPERATE</small><h4>운영에서 다음을 찾습니다.</h4><p>사용 과정에서 얻은 피드백을 다음 개선에 반영합니다.</p></li>\n  </ol>\n</div></section>\n\n<section class=\"cta\"><div class=\"cta-shader\" id=\"ctaShader\" aria-hidden=\"true\"></div><div class=\"wrap\">\n  <div class=\"kicker r\" style=\"justify-content:center\">Get Started</div>\n  <h2 class=\"r\">아이디어를<br><em>실제 비즈니스</em>로.</h2>\n  <p class=\"lead r\" style=\"margin:0 auto\">반복되는 업무, 필요한 AI 서비스, 연결되지 않는 시스템. 지금의 과제와 원하는 변화를 알려주세요.</p>\n  <div class=\"row r\"><a class=\"btn\" data-go=\"/contact\" href=\"/contact\">프로젝트 문의하기 →</a><a class=\"btn ghost\" data-go=\"/solutions\" href=\"/solutions\">솔루션 살펴보기</a></div>\n</div></section>";
  let root = null;
  function go(path) {
    const a = [...document.querySelectorAll('a[href]')].find((x) => !x.closest('#vm-a2') && (x.getAttribute('href') || '').replace(/\/$/, '').endsWith(path));
    if (a) { a.click(); return; }
    const ref = [...document.querySelectorAll('a[href$="/contact"]')].find((x) => !x.closest('#vm-a2'));
    const base = ref ? ref.getAttribute('href').slice(0, -'/contact'.length) : '';
    history.pushState({}, '', base + path);
    dispatchEvent(new PopStateEvent('popstate'));
    scrollTo(0, 0);
  }
  function mount(main) {
    root = document.createElement('div');
    root.id = 'vm-a2';
    root.innerHTML = HTML;
    main.after(root);
    document.documentElement.classList.add('vm-a2-on');
    const ref = [...document.querySelectorAll('a[href$="/contact"]')].find((x) => !x.closest('#vm-a2'));
    const base = ref ? ref.getAttribute('href').slice(0, -'/contact'.length) : '';
    root.querySelectorAll('[data-go]').forEach((a) => {
      a.setAttribute('href', base + a.dataset.go);
      a.addEventListener('click', (e) => { if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); go(a.dataset.go); });
    });
    run(root);
  }
  function unmount() {
    if (root) root.remove();
    root = null;
    document.documentElement.classList.remove('vm-a2-on');
  }
  function check() {
    const main = document.querySelector('.home-route main.home-cinematic');
    if (main && main.querySelector(':scope > section.pin-journey')) {
      if (!root || !root.isConnected || root.previousElementSibling !== main) { unmount(); mount(main); }
    } else if (root) unmount();
  }
  function run(root) {

/* AX scene: scattered tasks -> connected around AI */
const tasks=['자료 정리','엑셀 집계','메일 확인','고객 문의','재고 확인','견적 작성','보고서','알림 전송'];
const scatter=[[18,14,-8],[72,10,6],[40,30,-4],[86,36,9],[12,52,7],[64,58,-10],[30,82,5],[80,86,-6]];
const stage=root.querySelector('#stage'),svg=root.querySelector('#links');
const nodes=tasks.map((t,i)=>{const n=document.createElement('div');n.className='node';n.textContent=t;n.style.setProperty('--rot',scatter[i][2]+'deg');stage.appendChild(n);return n});
const ring=tasks.map((_,i)=>{const a=i/tasks.length*Math.PI*2-Math.PI/2;return[50+Math.cos(a)*36,50+Math.sin(a)*36]});
svg.innerHTML=ring.map((p,i)=>`<path class="link" id="l${i}" d="M50 50 L${p[0]} ${p[1]}"/><circle class="pulse" r=".9"><animateMotion dur="${2+i%3*.5}s" repeatCount="indefinite" begin="${i*.25}s"><mpath href="#l${i}"/></animateMotion></circle>`).join('')+`<circle class="link" cx="50" cy="50" r="36"/>`;
function setState(on){stage.classList.toggle('on',on);nodes.forEach((n,i)=>{const p=on?ring[i]:scatter[i];n.style.left=p[0]+'%';n.style.top=p[1]+'%'});
  root.querySelectorAll('.state button').forEach(b=>b.classList.toggle('act',(b.dataset.s==='1')===on));
  root.querySelector('#tag').innerHTML=on?'AFTER · <b>연결된 흐름</b>':'BEFORE · <b>흩어진 업무</b>'}
setState(false);
root.querySelectorAll('.state button').forEach(b=>b.onclick=()=>{auto=false;setState(b.dataset.s==='1')});
let auto=true;
new IntersectionObserver(([e])=>{if(e.isIntersecting&&auto)setTimeout(()=>auto&&setState(true),700)},{threshold:.4}).observe(stage);

const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');e.target.querySelectorAll('.r').forEach(c=>c.classList.add('in'));io.unobserve(e.target)}}),{threshold:0,rootMargin:'0px 0px -8% 0px'});
root.querySelectorAll('.r').forEach((el,i)=>{el.style.transitionDelay=(i%4*70)+'ms';io.observe(el)});
/* Safety net: reveal anything already on screen even if the observer is late */
let sn=0;const sweep=()=>{sn=0;root.querySelectorAll('.r:not(.in)').forEach(el=>{const b=el.getBoundingClientRect();if(b.top<innerHeight&&b.bottom>0){el.classList.add('in');el.querySelectorAll('.r').forEach(c=>c.classList.add('in'))}});
  const st=root.querySelector('#stage');if(auto&&st&&!st.classList.contains('on')){const b=st.getBoundingClientRect();if(b.top<innerHeight*.8&&b.bottom>innerHeight*.2)setTimeout(()=>auto&&setState(true),500)}};
document.addEventListener('scroll',()=>{if(!sn)sn=setTimeout(sweep,120)},{passive:true,capture:true});
setTimeout(sweep,1500);

root.addEventListener('pointermove',e=>{const c=e.target.closest&&e.target.closest('.spot');if(!c)return;const r=c.getBoundingClientRect();c.style.setProperty('--mx',e.clientX-r.left+'px');c.style.setProperty('--my',e.clientY-r.top+'px')},{passive:true});
const man=root.querySelector('.manifesto');
if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.addEventListener('scroll',()=>{const r=man.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;man.style.backgroundPositionY=`calc(50% + ${r.top*-.15}px)`},{passive:true,capture:true});
/* Paper Shaders mesh behind CTA (loads when near) */
const cs=root.querySelector('#ctaShader');
new IntersectionObserver(([e],o)=>{if(!e.isIntersecting)return;o.disconnect();
  import('https://cdn.jsdelivr.net/npm/@paper-design/shaders@0.0.81/+esm').then(({ShaderMount,meshGradientFragmentShader:f,getShaderColorFromString:c})=>{
    const cols=['#05080F','#0B2A3A','#0E7C86','#1B2F66'].map(c);const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
    new ShaderMount(cs,f,{u_colors:cols,u_colorsCount:4,u_distortion:.8,u_swirl:.2,u_grainMixer:0,u_grainOverlay:0,u_fit:2,u_scale:1,u_rotation:0,u_offsetX:0,u_offsetY:0,u_originX:.5,u_originY:.5,u_worldWidth:0,u_worldHeight:0},undefined,still?0:.3,0,1,1920*1080);
    cs.classList.add('ready')}).catch(()=>{})},{rootMargin:'300px'}).observe(cs);

  }
  let f = 0;
  new MutationObserver(() => { if (!f) f = setTimeout(() => { f = 0; check(); }, 30); }).observe(document.body, { childList: true, subtree: true });
  check();
})();
