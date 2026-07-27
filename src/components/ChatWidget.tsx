import { useState } from "react";
import { useLang } from "../i18n";
import { assetPath } from "../lib/assetPath";

/** Floating chat launcher + panel shell. Groundwork only: no assistant is
 * wired up yet (see project notes on the serverless + LLM plan) — this just
 * establishes the UI so the real thing can be dropped in without a redesign. */
export default function ChatWidget() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label={t.chat.title}
          className="fixed bottom-[calc(8.5rem+env(safe-area-inset-bottom))] right-4 z-[60] flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border hairline bg-paper shadow-[0_30px_60px_-20px_rgba(28,23,64,0.35)] lg:bottom-28 lg:right-8"
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
