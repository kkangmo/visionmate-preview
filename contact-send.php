<?php
// Project inquiry form handler: validates input and emails it to the company inbox.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

const TO_EMAIL = 'visionmatebiz@gmail.com';
const FROM_EMAIL = 'noreply@visionmate.co.kr';

function reply($ok, $message, $code = 200) {
    http_response_code($code);
    echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    reply(false, '잘못된 요청입니다.', 405);
}

// Only accept posts from our own pages.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && !preg_match('#^https://(www\.)?visionmate\.co\.kr$#', $origin)) {
    reply(false, '잘못된 요청입니다.', 403);
}

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    reply(false, '입력 내용을 읽지 못했습니다.', 400);
}

$field = function ($key, $max) use ($input) {
    $value = trim((string) ($input[$key] ?? ''));
    $value = str_replace(["\r\n", "\r"], "\n", $value);
    return mb_substr($value, 0, $max, 'UTF-8');
};

// Spam checks: hidden field must stay empty, and the form must be open for a few seconds.
if ($field('website', 200) !== '') {
    reply(true, '문의가 접수되었습니다.');
}
$elapsed = (int) ($input['elapsed'] ?? 0);
if ($elapsed < 3000) {
    reply(false, '잠시 후 다시 보내주세요.', 429);
}

$type = $field('type', 40);
$name = $field('name', 60);
$company = $field('company', 80);
$contact = $field('contact', 120);
$problem = $field('problem', 3000);
$goal = $field('goal', 2000);
$budget = $field('budget', 40);
$schedule = $field('schedule', 40);
$agree = !empty($input['agree']);

if ($name === '' || $contact === '' || $problem === '') {
    reply(false, '이름, 연락처, 문의 내용을 입력해 주세요.', 422);
}
if (!$agree) {
    reply(false, '개인정보 수집·이용에 동의해 주세요.', 422);
}
$isEmail = filter_var($contact, FILTER_VALIDATE_EMAIL) !== false;
$isPhone = preg_match('/^[0-9+\-\s()]{8,20}$/', $contact) === 1;
if (!$isEmail && !$isPhone) {
    reply(false, '연락처는 이메일 또는 전화번호로 입력해 주세요.', 422);
}

// Simple rate limit: at most 5 inquiries per IP per hour.
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateFile = sys_get_temp_dir() . '/vm-contact-' . md5($ip);
$times = [];
if (is_file($rateFile)) {
    $times = array_filter(array_map('intval', explode(',', (string) file_get_contents($rateFile))), function ($t) { return $t > time() - 3600; });
}
if (count($times) >= 5) {
    reply(false, '짧은 시간에 문의가 많습니다. 전화나 이메일로 연락해 주세요.', 429);
}
$times[] = time();
@file_put_contents($rateFile, implode(',', $times));

$now = date('Y-m-d H:i');
$lines = [
    '비전메이트 홈페이지 프로젝트 문의',
    '접수 시각: ' . $now,
    '',
    '문의 종류: ' . ($type ?: '-'),
    '이름: ' . $name,
    '회사/기관: ' . ($company ?: '-'),
    '연락처: ' . $contact,
    '예산: ' . ($budget ?: '-'),
    '일정: ' . ($schedule ?: '-'),
    '',
    '[지금 하는 일과 불편한 점]',
    $problem,
    '',
    '[원하는 변화]',
    $goal ?: '-',
    '',
    '개인정보 수집·이용 동의: 예',
];
$body = implode("\n", $lines);

// Backup copy outside the public web folder, so an inquiry is not lost if mail fails.
$privateDir = dirname(__DIR__) . '/private_html';
if (is_dir($privateDir) && is_writable($privateDir)) {
    @file_put_contents($privateDir . '/contact-inquiries.log', str_repeat('=', 40) . "\n" . $body . "\n", FILE_APPEND | LOCK_EX);
}

$subject = '=?UTF-8?B?' . base64_encode('[홈페이지 문의] ' . ($type ?: '프로젝트') . ' - ' . $name) . '?=';
$headers = [
    'From: =?UTF-8?B?' . base64_encode('비전메이트 홈페이지') . '?= <' . FROM_EMAIL . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
];
if ($isEmail) {
    $headers[] = 'Reply-To: ' . $contact;
}

$sent = @mail(TO_EMAIL, $subject, chunk_split(base64_encode($body)), implode("\r\n", $headers), '-f' . FROM_EMAIL);
if (!$sent) {
    reply(false, '메일 전송에 실패했습니다. 대표전화 070-4914-3588 또는 visionmatebiz@gmail.com으로 연락해 주세요.', 500);
}

reply(true, '문의가 접수되었습니다.');
