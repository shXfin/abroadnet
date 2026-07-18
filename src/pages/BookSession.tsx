import { useLang } from "../i18n";

// TODO: decide booking tool — Calendly / Cal.com embed is simplest for a free 1h session.
const BOOKING_EMBED_URL = "";

export default function BookSession() {
  const { t } = useLang();

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-20">
      <p className="label-caps text-coral">{t.book.kicker}</p>
      <h1 className="mt-4 max-w-3xl font-display text-5xl tracking-tight md:text-7xl">
        {t.book.titleA} <em>{t.book.titleB}</em>
      </h1>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/70">{t.book.sub}</p>

      <div className="mt-14">
        {BOOKING_EMBED_URL ? (
          <iframe
            title="Book a session"
            src={BOOKING_EMBED_URL}
            className="h-[680px] w-full border hairline"
          />
        ) : (
          <a
            href="https://www.facebook.com/abroadnet25/"
            target="_blank"
            rel="noreferrer"
            className="flex aspect-[16/7] items-center justify-center border hairline bg-parchment/40 px-6 text-center transition-colors hover:border-coral"
          >
            <p className="font-display text-xl text-ink/50">{t.book.placeholder}</p>
          </a>
        )}
      </div>
    </div>
  );
}
