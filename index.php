<?php
// Initial HTML and the interactive application share the same published content.
header('Content-Type: text/html; charset=utf-8');
$origin = 'https://www.visionmate.co.kr';
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
if (($_SERVER['HTTP_HOST'] ?? '') === 'visionmate.co.kr') {
    header('Location: ' . $origin . $path, true, 301);
    exit;
}
$path = '/' . trim($path, '/');
$data = json_decode(file_get_contents(__DIR__ . '/mock-cms.json'), true)['data'];
$escape = function ($value) { return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); };
$section = function ($key) use ($data) { return json_decode($data['sections'][$key] ?? '{}', true) ?: []; };
$parts = explode('/', trim($path, '/'));
$slug = $parts[0] ?: 'home';
$page = null;
foreach ($data['pages'] as $candidate) {
    if ($candidate['slug'] === $slug) { $page = $candidate; break; }
}
$item = null;
$collection = in_array($slug, ['solutions', 'products', 'cases'], true) ? $slug : null;
if ($collection && isset($parts[1])) {
    foreach ($data[$collection] as $candidate) {
        if ($candidate['slug'] === $parts[1]) { $item = $candidate; break; }
    }
}
$found = $page !== null && count($parts) <= ($collection ? 2 : 1) && (!isset($parts[1]) || $item !== null);
if (!$found) { http_response_code(404); }
$heading = $item['title'] ?? $item['name'] ?? $page['title'] ?? '페이지를 찾을 수 없습니다.';
$description = $item['publishedDescription'] ?? $item['shortDescription'] ?? $item['description'] ?? $item['subtitle'] ?? $page['metaDescription'] ?? '';
$title = $item['seoTitle'] ?? $item['publishedTitle'] ?? ($item ? $heading . ' | 비전메이트' : ($page['seoTitle'] ?? '페이지를 찾을 수 없습니다. | 비전메이트'));
$canonical = $origin . ($path === '/' ? '/' : $path);
$robots = (!$found || $slug === 'admin') ? 'noindex,nofollow' : 'index,follow';
$settings = $data['settings'];
$labels = ['legal_name'=>'상호', 'representative_name'=>'대표자', 'business_number'=>'사업자등록번호', 'company_address'=>'본사', 'company_seoul_address'=>'서울사무소', 'company_phone'=>'대표전화', 'company_mobile'=>'휴대전화', 'company_email'=>'문의 이메일', 'privacy_officer'=>'개인정보 보호책임자'];
$company = [];
foreach ($labels as $key => $label) {
    if (($settings['company_info_enabled'] ?? '') === 'true' && ($settings[$key . '_visible'] ?? '') === 'true' && trim($settings[$key] ?? '') !== '') {
        $company[$key] = $settings[$key];
    }
}
$organization = ['@type'=>'Organization', '@id'=>$origin . '/#organization', 'name'=>'비전메이트', 'alternateName'=>'VisionMate', 'url'=>$origin . '/', 'logo'=>$origin . '/assets/visionmate-logo.png'];
if (isset($company['legal_name'])) { $organization['legalName'] = $company['legal_name']; }
if (isset($company['company_phone'])) { $organization['telephone'] = $company['company_phone']; }
if (isset($company['company_email'])) { $organization['email'] = $company['company_email']; }
if (isset($company['company_address'])) { $organization['address'] = $company['company_address']; }
$graph = [$organization, ['@type'=>'WebSite', '@id'=>$origin . '/#website', 'name'=>'비전메이트', 'url'=>$origin . '/', 'inLanguage'=>'ko-KR'], ['@type'=>'WebPage', 'name'=>$heading, 'description'=>$description, 'url'=>$canonical, 'isPartOf'=>['@id'=>$origin . '/#website']]];
if ($item && $slug === 'solutions') {
    $graph[] = ['@type'=>'Service', 'name'=>$heading, 'description'=>$description, 'url'=>$canonical, 'provider'=>['@id'=>$origin . '/#organization'], 'serviceType'=>$item['capabilities']];
}
$navLabel = ['solutions'=>'AI 솔루션', 'cases'=>'구축 사례', 'products'=>'자체 서비스', 'ai-search'=>'AEO·GEO', 'about'=>'비전메이트', 'insights'=>'인사이트', 'contact'=>'프로젝트 문의', 'privacy'=>'개인정보 처리방침'];
if ($found && $slug !== 'home') {
    $crumbs = [['@type'=>'ListItem', 'position'=>1, 'name'=>'비전메이트', 'item'=>$origin . '/']];
    $crumbs[] = ['@type'=>'ListItem', 'position'=>2, 'name'=>$navLabel[$slug] ?? $heading, 'item'=>$origin . '/' . $slug];
    if ($item) { $crumbs[] = ['@type'=>'ListItem', 'position'=>3, 'name'=>$heading, 'item'=>$canonical]; }
    $graph[] = ['@type'=>'BreadcrumbList', 'itemListElement'=>$crumbs];
}
$aiSearchFaq = [
    ['question'=>'AEO와 GEO는 무엇인가요?', 'answer'=>'AEO는 고객이 자주 묻는 질문에 딱 맞는 답을 만들어 검색 답변에 쓰이기 좋게 정리하는 일입니다. GEO는 ChatGPT·제미나이 같은 AI가 회사를 정확히 알고 소개할 수 있도록 정보를 정리하는 일입니다.'],
    ['question'=>'효과가 나타나기까지 얼마나 걸리나요?', 'answer'=>'검색은 하루아침에 바뀌지 않습니다. 회사마다 다르지만 보통 몇 달 동안 매달 꾸준히 홈페이지, 글, 기사를 쌓아야 효과가 나타납니다.'],
    ['question'=>'검색 순위나 AI 답변 노출을 보장하나요?', 'answer'=>'보장하지 않습니다. 검색 순위, 기사 게재, AI 답변 노출은 약속할 수 없으며, 대신 매달 현황을 확인하고 개선 방향을 보고합니다.'],
    ['question'=>'어떤 일부터 시작하나요?', 'answer'=>'첫 달에는 지금 검색과 AI 답변에서 회사가 어떻게 보이는지 경쟁사와 비교해 살펴보고, 무엇부터 할지 정합니다.'],
];
$faqItems = [];
if ($item && $slug === 'solutions' && !empty($item['faq'])) { $faqItems = json_decode($item['faq'], true) ?: []; }
if ($found && $slug === 'ai-search') { $faqItems = $aiSearchFaq; }
if ($faqItems) {
    $graph[] = ['@type'=>'FAQPage', 'mainEntity'=>array_map(function ($f) { return ['@type'=>'Question', 'name'=>$f['question'], 'acceptedAnswer'=>['@type'=>'Answer', 'text'=>$f['answer']]]; }, $faqItems)];
}
if ($found && $slug === 'ai-search') {
    $graph[] = ['@type'=>'Service', 'name'=>'AEO·GEO 마케팅', 'serviceType'=>'SEO · AEO · GEO · 디지털 PR · 콘텐츠 · 월간 보고', 'description'=>$description, 'url'=>$canonical, 'provider'=>['@id'=>$origin . '/#organization'], 'areaServed'=>'KR'];
}
$html = file_get_contents(__DIR__ . '/index.html');
$html = preg_replace('~<title>.*?</title>~s', '<title>' . $escape($title) . '</title>', $html);
$html = preg_replace('~<meta name="description"[^>]*>~', '<meta name="description" content="' . $escape($description) . '" />', $html);
$html = preg_replace('~<meta name="robots"[^>]*>~', '<meta name="robots" content="' . $robots . '" />', $html);
$metadata = '<link rel="canonical" data-visionmate-canonical="true" href="' . $escape($canonical) . '" />';
foreach (['og:title'=>$title, 'og:description'=>$description, 'og:url'=>$canonical, 'og:type'=>'website', 'og:site_name'=>'비전메이트', 'og:locale'=>'ko_KR'] as $key=>$value) {
    $metadata .= '<meta property="' . $key . '" content="' . $escape($value) . '" />';
}
$metadata .= '<script type="application/ld+json" data-visionmate-schema="true">' . json_encode(['@context'=>'https://schema.org', '@graph'=>$graph], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP) . '</script>';
$html = str_replace('</head>', $metadata . '</head>', $html);
ob_start();
?>
<div class="public-site" style="background:#070e18;color:#edf4ff;min-height:100vh;padding:32px;box-sizing:border-box;font-family:Arial,sans-serif">
<header><a href="/" style="color:#edf4ff">VisionMate · 비전메이트</a>
<nav aria-label="주요 메뉴"><?php foreach ($data['navigation'] as $nav): ?><a style="display:inline-block;margin:16px;color:#99caff" href="<?= $escape($nav['route']) ?>"><?= $escape($nav['label']) ?></a><?php endforeach; ?></nav></header>
<main style="max-width:1160px;margin:64px auto;line-height:1.9">
<h1 style="font-size:clamp(32px,5vw,64px);line-height:1.3;white-space:pre-line"><?= $escape($heading) ?></h1>
<p><?= $escape($description) ?></p>
<?php if ($found && $item): ?>
<?php foreach (['subtitle'=>'요약', 'positioning'=>'서비스 성격', 'problem'=>'해결할 문제', 'systemBuilt'=>'만든 것', 'whatWeBuild'=>'구축 범위', 'useCases'=>'적용 가능한 업무', 'buildProcess'=>'진행 과정', 'deliverables'=>'산출물', 'capabilities'=>'주요 기능', 'approach'=>'접근 방식', 'howItWorks'=>'진행 흐름', 'flow'=>'사용 흐름', 'keywords'=>'핵심 기능', 'currentStage'=>'진행 단계'] as $key=>$label): ?>
<?php if (!empty($item[$key])): ?><section><h2><?= $label ?></h2><p><?= $escape($item[$key]) ?></p></section><?php endif; ?>
<?php endforeach; ?>
<?php if ($faqItems): ?><section><h2>자주 묻는 질문</h2><?php foreach ($faqItems as $f): ?><h3><?= $escape($f['question']) ?></h3><p><?= $escape($f['answer']) ?></p><?php endforeach; ?></section><?php endif; ?>
<?php $links = ['mategift'=>'https://mategift.co.kr', 'mategift-lab'=>'https://recommend.visionmate.co.kr/lab-v3', 'pungsumate'=>'https://pungsumate.pages.dev/', 'trendmate'=>'https://www.trendmate.co.kr/']; if ($slug === 'products' && isset($links[$item['slug']])): ?><p><a style="color:#99caff" href="<?= $links[$item['slug']] ?>">서비스 바로가기</a></p><?php endif; ?>
<?php foreach ($data['cases'] as $c): if ($slug === 'products' && $c['slug'] === $item['slug']): ?><p>관련 구축 사례: <a style="color:#99caff" href="/cases/<?= $escape($c['slug']) ?>"><?= $escape($c['name']) ?></a></p><?php endif; endforeach; ?>
<?php elseif ($found && in_array($slug, ['home','solutions','products','cases'], true)): ?>
<?php if ($slug === 'home'): ?><section><h2>가능성을 읽고, 작동하는 비즈니스를 만듭니다.</h2><p>아이디어가 서비스가 되고, 흩어진 업무가 하나의 흐름이 되도록. 비전메이트는 전략과 AI·데이터·개발을 연결하는 비즈니스 빌더입니다.</p><p>발견 → 설계 → 구축 → 연결 → 운영. 각 단계의 결과가 다음 판단의 근거가 됩니다.</p></section>
<section><h2>흩어진 업무를, 하나의 흐름으로.</h2><p>반복되는 업무, 따로 노는 도구, 연결되지 않는 데이터. 비전메이트는 사람과 AI의 역할을 나누고, 업무가 하나의 운영 흐름으로 이어지도록 설계합니다.</p><p>운영비 최소화: 실행 중 AI 호출을 최소화해, 한 번 만들면 이용이 늘어도 운영비가 쌓이지 않도록 설계합니다.</p></section>
<section><h2>구글과 AI가 먼저 찾는 회사로</h2><p>SEO·AEO·GEO로 구글 검색과 AI 답변에서 회사가 발견되도록 몇 달에 걸쳐 꾸준히 관리합니다. <a style="color:#99caff" href="/ai-search">AEO·GEO 마케팅 보기</a></p></section><?php endif; ?>
<?php foreach (($slug === 'home' ? ['solutions','cases','products'] : [$slug]) as $group): ?>
<section><h2><?= ['solutions'=>'AI 솔루션', 'cases'=>'구축 사례', 'products'=>'직접 만들고 운영하는 서비스'][$group] ?></h2>
<?php foreach ($data[$group] as $entry): ?><article><h3><a style="color:#99caff" href="/<?= $group ?>/<?= $escape($entry['slug']) ?>"><?= $escape($entry['title'] ?? $entry['name']) ?></a></h3><p><?= $escape($entry['shortDescription'] ?? $entry['description'] ?? $entry['subtitle'] ?? '') ?></p><?php if ($group === 'cases' && !empty($entry['problem'])): ?><p><?= $escape($entry['problem']) ?></p><?php endif; ?></article><?php endforeach; ?></section>
<?php endforeach; ?>
<?php elseif ($found && $slug === 'about'): $about = $section('ABOUT_CONTENT'); ?>
<section><h2><?= $escape($about['visionTitle']) ?></h2><p><?= $escape($about['visionBody']) ?></p>
<?php foreach ($about['cards'] as $card): ?><h3><?= $escape($card['title']) ?></h3><p><?= $escape($card['description']) ?></p><?php endforeach; ?></section>
<?php elseif ($found && $slug === 'insights'): ?>
<section><h2>TrendMate 인사이트</h2><p>비전메이트가 운영하는 웹매거진 <a style="color:#99caff" href="https://www.trendmate.co.kr/">TrendMate</a>의 글입니다.</p>
<?php foreach ($data['insights'] as $post): ?><article><h3><a style="color:#99caff" href="<?= $escape($post['sourceUrl']) ?>"><?= $escape($post['title']) ?></a></h3><p><?= $escape($post['category'] ?? '') ?><?php if (!empty($post['publishedAt'])): ?> · <?= $escape(substr($post['publishedAt'], 0, 10)) ?><?php endif; ?></p><p><?= $escape($post['excerpt']) ?></p></article><?php endforeach; ?></section>
<?php elseif ($found && $slug === 'ai-search'): ?>
<section><h2>검색은 하루아침에 바뀌지 않습니다.</h2><p>구글과 AI는 오랫동안 꾸준히 쌓인 정보를 믿습니다. 광고처럼 돈을 내면 바로 나오는 방식이 아니라서, 몇 달 동안 매달 조금씩 쌓아야 효과가 나타납니다. 비전메이트는 그 과정을 매달 함께 관리합니다.</p></section>
<section><h2>AEO·GEO·SEO, 쉽게 말하면 이렇습니다.</h2>
<h3>SEO · 검색에 잘 나오게</h3><p>구글·네이버가 우리 홈페이지를 잘 읽고 보여 주도록 고칩니다.</p>
<h3>AEO · 질문에 답하는 글</h3><p>고객이 자주 묻는 질문에 딱 맞는 답을 글로 만들어, 검색 답변에 쓰이기 좋게 정리합니다.</p>
<h3>GEO · AI가 우리를 소개하게</h3><p>ChatGPT·제미나이 같은 AI가 우리 회사를 정확히 알고 말해 줄 수 있도록 정보를 정리합니다.</p>
<h3>PR · 기사로 알리기</h3><p>보도자료를 만들어 언론에 소개될 기회를 만듭니다.</p>
<h3>콘텐츠 · 믿을 수 있는 글 쌓기</h3><p>누가 썼는지, 근거가 무엇인지 분명한 전문 글을 꾸준히 올립니다.</p>
<h3>보고 · 매달 확인하고 알려 드리기</h3><p>검색과 AI 답변에 우리 회사가 어떻게 나오는지 매달 살펴보고 보고합니다.</p></section>
<section><h2>한 달씩, 차근차근 쌓습니다.</h2><ol><li>1개월 · 살펴보기: 지금 검색과 AI 답변에서 우리 회사가 어떻게 보이는지, 경쟁사와 비교해 확인합니다.</li><li>2~3개월 · 기초 다지기: 홈페이지 정보를 바로잡고, 자주 묻는 질문과 사례를 정리하고, 첫 전문 글을 올립니다.</li><li>4~6개월 · 넓히기: 전문 글을 꾸준히 올리고 기사와 외부 소개를 늘리며, AI 답변에 우리 회사가 나오는지 확인합니다.</li><li>그 이후 · 매달 다듬기: 무엇이 효과가 있었는지 보고 다음 달 계획을 세웁니다.</li></ol><p>일정은 회사마다 다릅니다. 검색 순위, 기사 게재, AI 답변 노출을 약속하지는 않습니다.</p></section>
<section><h2>비전메이트가 다른 점</h2><p>직접 해 보고 있습니다: 비전메이트 홈페이지와 웹매거진 TrendMate에 같은 방법을 적용하고 있습니다.</p><p>하나로 묶어 관리합니다: 홈페이지, 글, 기사, 확인을 한 계획 안에서 매달 관리합니다.</p><p>사실만 씁니다: 실제 정보와 근거만 사용하고, 가짜 후기나 돈으로 산 링크는 쓰지 않습니다.</p></section>
<section><h2>자주 묻는 질문</h2><?php foreach ($aiSearchFaq as $f): ?><h3><?= $escape($f['question']) ?></h3><p><?= $escape($f['answer']) ?></p><?php endforeach; ?></section>
<?php elseif ($found && $slug === 'contact'): $contact = $section('CONTACT_CONTENT'); ?>
<section><h2><?= $escape($contact['title']) ?></h2><p style="white-space:pre-line"><?= $escape($contact['body']) ?></p><p><?= $escape($contact['lockedBody']) ?></p></section>
<?php endif; ?>
<?php if ($company): ?><section aria-label="회사 정보"><h2>회사 정보</h2><dl><?php foreach ($company as $key=>$value): ?><dt><?= $labels[$key] ?></dt><dd><?= $escape($value) ?></dd><?php endforeach; ?></dl></section><?php endif; ?>
<p><a href="/contact" style="color:#99caff">프로젝트 문의</a></p>
</main></div>
<?php
$initialContent = ob_get_clean();
$html = str_replace('<div data-generated-space-root="" data-generated-space-slug="visionmate-website"></div>', '<div data-generated-space-root="" data-generated-space-slug="visionmate-website">' . $initialContent . '</div>', $html);
echo $html;
