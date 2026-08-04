import { useEffect, useRef, useState } from "react";
import { useLang } from "../i18n";
import { assetPath } from "../lib/assetPath";

const CHAT_API_URL = "https://api.abroadnetedu.com/chat.php";

type Message = { role: "user" | "assistant"; text: string };

/** Floating chat launcher + panel. Talks to a PHP proxy on a BahariHost
 * subdomain (see server/chat-api/) that holds the Gemini key server-side
 * — this component never sees or sends any credential, just plain chat
 * text over HTTPS. */
export default function ChatWidget() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;

    const nextMessages: Message[] = [...messages, { role: "user", text }];
    setMessages(nextMessages);
    setInput("");
    setSending(true);
    setError(false);

    try {
      const res = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: nextMessages.slice(0, -1).map((m) => ({ role: m.role, text: m.text })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.reply) throw new Error(data.error || "no reply");
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label={t.chat.title}
          className="fixed bottom-[calc(11rem+env(safe-area-inset-bottom))] right-4 z-[60] flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border hairline bg-paper shadow-[0_30px_60px_-20px_rgba(28,23,64,0.35)] lg:bottom-[13rem] lg:right-8"
        >
          <div className="flex items-center gap-3 bg-navy px-4 py-3.5 text-white">
            <img src={assetPath("icons/chat-mascot.png")} alt="" aria-hidden="true" className="h-9 w-9 object-contain" />
            <div className="flex-1">
              <p className="font-display text-base leading-tight">{t.chat.title}</p>
              <p className="text-xs text-white/50">{t.chat.subtitle}</p>
            </div>
          </div>

          <div ref={scrollRef} className="max-h-96 flex-1 overflow-y-auto bg-parchment/30 p-4 space-y-3">
            <div className="flex items-start gap-2.5">
              <img src={assetPath("icons/chat-mascot.png")} alt="" aria-hidden="true" className="mt-1 h-6 w-6 shrink-0 object-contain" />
              <p className="max-w-[85%] rounded-2xl rounded-tl-sm bg-paper border hairline px-3.5 py-2.5 text-sm leading-relaxed text-ink/80">
                {t.chat.greeting}
              </p>
            </div>

            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <p className="max-w-[85%] rounded-2xl rounded-tr-sm bg-navy px-3.5 py-2.5 text-sm leading-relaxed text-white">
                    {m.text}
                  </p>
                </div>
              ) : (
                <div key={i} className="flex items-start gap-2.5">
                  <img src={assetPath("icons/chat-mascot.png")} alt="" aria-hidden="true" className="mt-1 h-6 w-6 shrink-0 object-contain" />
                  <p className="max-w-[85%] rounded-2xl rounded-tl-sm bg-paper border hairline px-3.5 py-2.5 text-sm leading-relaxed text-ink/80">
                    {m.text}
                  </p>
                </div>
              ),
            )}

            {sending && (
              <div className="flex items-start gap-2.5">
                <img src={assetPath("icons/chat-mascot.png")} alt="" aria-hidden="true" className="mt-1 h-6 w-6 shrink-0 object-contain" />
                <p className="rounded-2xl rounded-tl-sm bg-paper border hairline px-3.5 py-2.5 text-sm text-ink/50">
                  {t.chat.thinking}
                </p>
              </div>
            )}

            {error && <p className="text-center text-xs text-coral">{t.chat.errorFallback}</p>}
          </div>

          <div className="border-t hairline bg-paper p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                placeholder={t.chat.placeholder}
                disabled={sending}
                className="flex-1 rounded-full border hairline bg-parchment/40 px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-coral focus:outline-none disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSend}
                disabled={sending || !input.trim()}
                aria-label={t.chat.send}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-white transition-colors hover:bg-coral disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12h16M14 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Always visible, in the same spot — it morphs into a close button
          rather than disappearing, same as Intercom/Drift/Tidio-style widgets. */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? t.chat.close : t.chat.launcherLabel}
        aria-expanded={open}
        className={`fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] right-4 z-[60] flex h-16 w-16 items-center justify-center rounded-full bg-paper shadow-[0_16px_30px_-10px_rgba(28,23,64,0.45)] ring-[3px] ring-coral transition-transform hover:-translate-y-0.5 active:scale-95 lg:bottom-8 lg:right-8 ${
          open ? "" : "chat-launcher-attn"
        }`}
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="h-7 w-7 text-navy" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <img src={assetPath("icons/chat-mascot.png")} alt="" aria-hidden="true" className="h-11 w-11 object-contain" />
        )}
      </button>
    </>
  );
}
