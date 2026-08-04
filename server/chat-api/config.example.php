<?php
// Copy this file to config.php (that filename is gitignored — it holds a
// live key and must never be committed) and fill in the real value below.
// Not served directly by anything on the site — PHP files execute rather
// than return their source, so requesting this URL directly just returns
// a blank page, not the key. Still, keep this file's permissions tight in
// cPanel File Manager (644 is fine; don't make it world-writable).

define('GEMINI_API_KEY', 'PASTE_YOUR_GEMINI_API_KEY_HERE');

// Free-tier Gemini model. If Google retires this name, swap it here only.
define('GEMINI_MODEL', 'gemini-2.0-flash');

// Only these origins may call chat.php — locks the key's usage to your
// own site even though the key itself isn't visible to the browser.
define('ALLOWED_ORIGINS', [
    'https://abroadnetedu.com',
    'https://www.abroadnetedu.com',
]);
