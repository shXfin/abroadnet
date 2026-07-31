import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useLang } from "../i18n";
import { assetPath } from "../lib/assetPath";
import { courseBySlug, universityById, universityBySlug } from "../data/catalogue";
import { buildWhatsAppUrl } from "../lib/whatsapp";

/** Floating chat launcher + panel shell. Groundwork only: no assistant is
 * wired up yet (see project notes on the serverless + LLM plan) — this just
 * establishes the UI so the real thing can be dropped in without a redesign.
 * On the universities/courses catalogue, this swaps to a floating WhatsApp
 * button instead — by that point the visitor has already picked a specific
 * institution or programme, so a live chat handoff beats a stubbed bot. */
export default function ChatWidget() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { slug } = useParams();

  const onCatalogue = pathname.startsWith("/universities") || pathname.startsWith("/courses");

  if (onCatalogue) {
    const course = slug ? courseBySlug(slug) : undefined;
    const uni = course ? universityById(course.universityId) : slug ? universityBySlug(slug) : undefined;
    const message = course
      ? `Hi, I'm interested in ${course.name.en}${uni ? ` at ${uni.name.en}` : ""}.`
      : uni
        ? `Hi, I want to apply at ${uni.name.en}.`
        : "Hi, I'd like help choosing a university or course.";

    return (
      <a
        href={buildWhatsAppUrl(message)}
        target="_blank"
        rel="noreferrer"
        aria-label={t.catalogue.chatOnWhatsapp}
        className="fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] right-4 z-[60] flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_16px_30px_-10px_rgba(28,23,64,0.45)] transition-transform hover:-translate-y-0.5 active:scale-95 lg:bottom-8 lg:right-8"
      >
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor" aria-hidden="true">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.14.82.84-3.06-.2-.31a8.19 8.19 0 0 1-1.26-4.4c0-4.53 3.69-8.22 8.24-8.22 4.55 0 8.24 3.69 8.24 8.22 0 4.54-3.7 8.28-8.23 8.28Zm4.52-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.71-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.36-.77-1.86-.2-.49-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01a.92.92 0 0 0-.67.31c-.23.25-.87.85-.87 2.08s.89 2.41 1.02 2.58c.12.17 1.75 2.68 4.25 3.75.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.23-.17-.48-.29Z" />
        </svg>
      </a>
    );
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

          <div className="max-h-96 flex-1 overflow-y-auto bg-parchment/30 p-4">
            <div className="flex items-start gap-2.5">
              <img src={assetPath("icons/chat-mascot.png")} alt="" aria-hidden="true" className="mt-1 h-6 w-6 shrink-0 object-contain" />
              <p className="max-w-[85%] rounded-2xl rounded-tl-sm bg-paper border hairline px-3.5 py-2.5 text-sm leading-relaxed text-ink/80">
                {t.chat.greeting}
              </p>
            </div>
          </div>

          <div className="border-t hairline bg-paper p-3">
            <p className="mb-2 px-1 text-xs leading-relaxed text-ink/40">{t.chat.comingSoon}</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                disabled
                placeholder={t.chat.placeholder}
                className="flex-1 rounded-full border hairline bg-parchment/40 px-4 py-2.5 text-sm text-ink/50 placeholder:text-ink/40 disabled:cursor-not-allowed"
              />
              <button
                disabled
                aria-label={t.chat.placeholder}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy/30 text-white disabled:cursor-not-allowed"
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
