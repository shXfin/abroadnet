<?php
/**
 * Chat proxy for the Abroad Net site's floating chat widget.
 *
 * The browser never sees the Gemini key — it POSTs a message here, this
 * script attaches the key (from config.php) and a system prompt built
 * from the site's own data, and returns just the reply text.
 *
 * Deploy target: api.abroadnetedu.com/chat.php on BahariHost cPanel.
 * See ../../CHATBOT_SETUP.md for the DNS/subdomain/upload steps — this
 * script alone does nothing without that subdomain resolving here.
 */

require __DIR__ . '/config.php';

// --- CORS: only the live site may call this, not an arbitrary page that
// happens to know the URL. The key itself is never exposed either way,
// but this stops someone else's site from burning your free-tier quota. ---
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, ALLOWED_ORIGINS, true)) {
    header("Access-Control-Allow-Origin: $origin");
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST only']);
    exit;
}

// --- Very light per-IP rate limit: a flat file counter, not a database.
// Free-tier quota is the real constraint here — this just stops one
// visitor (or a bot) from burning through it alone. ---
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateDir = __DIR__ . '/_rate';
if (!is_dir($rateDir)) {
    mkdir($rateDir, 0700, true);
}
$rateFile = $rateDir . '/' . hash('sha256', $ip) . '.json';
$now = time();
$window = 3600; // 1 hour
$limit = 30;    // messages per hour per IP
$state = ['count' => 0, 'resetAt' => $now + $window];
if (is_file($rateFile)) {
    $decoded = json_decode(file_get_contents($rateFile), true);
    if (is_array($decoded) && $decoded['resetAt'] > $now) {
        $state = $decoded;
    }
}
if ($state['count'] >= $limit) {
    http_response_code(429);
    echo json_encode(['error' => 'Too many messages. Please try again later, or message us on WhatsApp.']);
    exit;
}
$state['count']++;
file_put_contents($rateFile, json_encode($state));

// --- Parse and validate the request body ---
$body = json_decode(file_get_contents('php://input'), true);
$message = trim($body['message'] ?? '');
$history = is_array($body['history'] ?? null) ? $body['history'] : [];

if ($message === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Empty message']);
    exit;
}
if (mb_strlen($message) > 800) {
    http_response_code(400);
    echo json_encode(['error' => 'Message too long']);
    exit;
}
// Cap history so one long-running chat can't balloon the prompt size/cost.
$history = array_slice($history, -10);

// --- The knowledge base. Everything here should match what's actually
// live on the site — this is the model's only source of truth, it isn't
// told to browse the site or invent anything beyond this. ---
$systemPrompt = <<<PROMPT
You are the Abroad Net Education assistant, embedded as a chat widget on abroadnetedu.com.

Abroad Net Education is a Bangladeshi study-abroad consultancy (motto: "Dream, Faith, Success") that guides students from Bangladesh through choosing a university, applying, getting a visa, and settling in abroad. Contact: WhatsApp +60 14-520 3749, email info@abroadnetedu.com, phone +880 1634-353682, office at 510, Majid Villa, GT Road (North), Chairman Ghat, Chandpur, Bangladesh.

Destinations with full guides on the site (in order of how many universities are listed for each):
- Malaysia: the primary/most-traveled destination, 16 confirmed partner universities the consultancy places students at directly, plus dozens more listed for fee reference. Multiple intakes a year. English-taught degrees, world-ranked campuses.
- Italy: 30 universities listed (e.g. University of Bologna, Sapienza University of Rome, Politecnico di Milano, Bocconi University). EU/Schengen degree, free or heavily subsidised tuition via regional scholarships (DSU), main intake September/October.
- China: 25 institutions listed (e.g. Tsinghua University, Peking University, Fudan University), including some diploma-tier colleges. Strong in engineering, medicine, business, AI. Chinese Government Scholarship (CSC) is a major draw. Main intake September, spring intake February/March at some universities.
- Romania: 13 universities listed (e.g. University of Bucharest, Babeș-Bolyai University, Politehnica University of Bucharest). EU degree, affordable tuition, main intake October.
- Georgia: coming soon, not yet live with full university data, but the consultancy has placed students there before (e.g. medicine).

The site has a browsable catalogue at /universities and /courses with filters by country, level of study, and field. There's also a free 9-question assessment quiz (linked from "Get matched" in the nav, or /#assessment) that matches a student to universities based on their goals, budget, and destination.

How to behave:
- Keep answers short: 2-3 sentences, warm and professional, never a wall of text. This is a hard limit, not a suggestion — always finish your last sentence completely within it. Never trail off mid-word or mid-sentence.
- Never invent specific tuition figures, scholarship amounts, or admission odds beyond the ranges given above — for exact numbers, say a counselor will confirm the latest figures, and point to the free assessment quiz or WhatsApp.
- If asked something you don't have solid info on (a specific university's exact fee, a personal visa case, anything outside study-abroad topics), say so plainly and suggest the free assessment or WhatsApp instead of guessing.
- Don't ask the student for sensitive personal information (passport numbers, financial details) in this chat — that belongs in the assessment quiz or a counselor conversation.
- If asked who built the site or about unrelated topics, redirect politely back to how you can help with studying abroad.
PROMPT;

// --- Build Gemini's expected contents array: prior turns + the new message ---
$contents = [];
foreach ($history as $turn) {
    $role = ($turn['role'] ?? '') === 'assistant' ? 'model' : 'user';
    $text = trim($turn['text'] ?? '');
    if ($text !== '') {
        $contents[] = ['role' => $role, 'parts' => [['text' => $text]]];
    }
}
$contents[] = ['role' => 'user', 'parts' => [['text' => $message]]];

$payload = [
    'contents' => $contents,
    'systemInstruction' => ['parts' => [['text' => $systemPrompt]]],
    'generationConfig' => [
        'temperature' => 0.4,
        'maxOutputTokens' => 220,
    ],
    // No thinkingConfig needed: gemini-flash-lite-latest doesn't do the
    // hidden reasoning pass that ate into the answer budget on
    // gemini-flash-latest, so this cap now applies entirely to visible text.
];

$url = 'https://generativelanguage.googleapis.com/v1beta/models/' . GEMINI_MODEL . ':generateContent?key=' . GEMINI_API_KEY;

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_TIMEOUT => 20,
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($response === false || $httpCode >= 400) {
    http_response_code(502);
    echo json_encode(['error' => 'The assistant is unavailable right now. Please try WhatsApp instead.']);
    exit;
}

$data = json_decode($response, true);
$reply = $data['candidates'][0]['content']['parts'][0]['text'] ?? null;

if (!$reply) {
    http_response_code(502);
    echo json_encode(['error' => 'No reply generated. Please try again or use WhatsApp.']);
    exit;
}

echo json_encode(['reply' => trim($reply)]);
