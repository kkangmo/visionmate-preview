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
$description = $item['shortDescription'] ?? $item['description'] ?? $page['metaDescription'] ?? '';
$title = $item['seoTitle'] ?? ($item ? $heading . ' | 비전메이트' : ($page['seoTitle'] ?? '페이지를 찾을 수 없습니다. | 비전메이트'));
$canonical = $origin . ($path === '/' ? '/' : $path);
$robots = (!$found || $slug === 'admin') ? 'noindex,nofollow' : 'index,follow';
$settings = $data['settings'];
$labels = ['legal_name'=>'상호', 'representative_name'=>'대표자', 'business_number'=>'사업자등록번호', 'company_address'=>'사업장 주소', 'company_phone'=>'대표 전화', 'company_email'=>'문의 이메일'];
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
<?php foreach (['problem'=>'해결할 문제', 'whatWeBuild'=>'구축 범위', 'useCases'=>'적용 가능한 업무', 'buildProcess'=>'진행 과정', 'deliverables'=>'산출물', 'capabilities'=>'주요 기능', 'flow'=>'사용 흐름'] as $key=>$label): ?>
<?php if (!empty($item[$key])): ?><section><h2><?= $label ?></h2><p><?= $escape($item[$key]) ?></p></section><?php endif; ?>
<?php endforeach; ?>
<?php elseif ($found && in_array($slug, ['home','solutions','products'], true)): ?>
<?php foreach (($slug === 'home' ? ['solutions','products'] : [$slug]) as $group): ?>
<section><h2><?= $group === 'solutions' ? 'AI 솔루션' : '직접 만들고 운영하는 서비스' ?></h2>
<?php foreach ($data[$group] as $entry): ?><article><h3><a style="color:#99caff" href="/<?= $group ?>/<?= $escape($entry['slug']) ?>"><?= $escape($entry['title'] ?? $entry['name']) ?></a></h3><p><?= $escape($entry['shortDescription'] ?? $entry['description']) ?></p></article><?php endforeach; ?></section>
<?php endforeach; ?>
<?php elseif ($found && $slug === 'about'): $about = $section('ABOUT_CONTENT'); ?>
<section><h2><?= $escape($about['visionTitle']) ?></h2><p><?= $escape($about['visionBody']) ?></p>
<?php foreach ($about['cards'] as $card): ?><h3><?= $escape($card['title']) ?></h3><p><?= $escape($card['description']) ?></p><?php endforeach; ?></section>
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
