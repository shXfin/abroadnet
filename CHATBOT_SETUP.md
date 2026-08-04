# Chat widget backend — setup steps

The chat widget on the site calls `https://api.abroadnetedu.com/chat.php`.
That subdomain doesn't exist yet — it needs to be created on BahariHost
and pointed at the two files in `server/chat-api/`. The main site itself
stays on GitHub Pages; only this one subdomain lives on BahariHost.

## 1. Add a DNS record for the subdomain

In BahariHost's cPanel → **Domains → Zone Editor** (same place the
GitHub Pages A records were added earlier):

- Add an **A record**
- Name: `api`
- Points to: `188.40.147.141` (BahariHost's server IP)

## 2. Create the subdomain in cPanel

cPanel → **Domains → Create A New Domain** (or **Subdomains**, depending
on the cPanel theme):

- Domain: `api.abroadnetedu.com`
- Document root: something like `public_html/api` (cPanel will suggest a
  path — that's fine)

Wait for DNS to propagate (same as before, up to a few hours, usually
faster) before continuing.

## 3. Enable SSL

Once `api.abroadnetedu.com` resolves, go to cPanel → **SSL/TLS Status**
and run **AutoSSL** (or wait — it often runs automatically once DNS is
correct). The chat widget calls `https://`, so this step isn't optional.

## 4. Upload the two files

Using cPanel **File Manager**, go into the subdomain's document root
(the folder from step 2) and upload:

- `server/chat-api/config.php` — **this file is not in the git repo** (it
  holds your live API key, and this repo is public). It exists locally
  on this machine with your key already filled in, at
  `server/chat-api/config.php` — upload that exact local file directly.
  If you ever need to recreate it, copy `config.example.php` and fill in
  the key.
- `server/chat-api/chat.php`

To rotate the key later, edit `config.php` directly on the server via
File Manager — no need to redeploy the site for that.

## 5. Test it

Visit `https://api.abroadnetedu.com/chat.php` directly in a browser —
you should get a small JSON error like `{"error":"POST only"}`. That
means the script is running. (A blank page or a 404 means the subdomain
or upload isn't done yet.)

Then open the site, click the chat bubble, and send a real message.

## What these files do

- `config.php` — holds the Gemini API key, the model name, and the list
  of origins allowed to call the endpoint (locked to abroadnetedu.com so
  nobody else can use your key through this script).
- `chat.php` — receives `{message, history}` from the widget, adds a
  system prompt describing the site's destinations/universities/contact
  info, calls Gemini, and returns `{reply}`. Includes a simple per-IP
  rate limit (30 messages/hour) stored in flat files under `_rate/` next
  to the script, since there's no database — that folder is created
  automatically the first time someone chats.

## Keeping the knowledge current

If a destination's intake dates, university count, or contact details
change, update the `$systemPrompt` string in `chat.php` on the server to
match — the chatbot only knows what's written there, it doesn't read the
live site.
