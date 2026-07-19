import { useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../i18n";

const PHOTO_SRC = "/photos/georgia-visa-rakibul.jpg";

/**
 * Real-photo proof section, matching what both reference sites lead with
 * (a named student photo, not stock imagery). Falls back to a labeled
 * placeholder until the photo file lands in public/photos/.
 */
export default function StudentSpotlight() {
  const { t } = useLang();
  const [photoFailed, setPhotoFailed] = useState(false);

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <p className="label-caps text-ink/50">{t.spotlight.kicker}</p>
      <div className="mt-8 grid gap-8 border hairline bg-parchment/30 p-6 md:grid-cols-[280px_1fr] md:p-10">
        <div className="flex aspect-square items-center justify-center overflow-hidden border hairline bg-paper">
          {photoFailed ? (
            <p className="px-4 text-center font-mono text-xs text-ink/30">STUDENT PHOTO PLACEHOLDER</p>
          ) : (
            <img
              src={PHOTO_SRC}
              alt={t.spotlight.name}
              className="h-full w-full object-cover"
              onError={() => setPhotoFailed(true)}
            />
          )}
        </div>
        <div className="flex flex-col justify-center">
          <blockquote className="font-display text-2xl md:text-3xl">"{t.spotlight.quote}"</blockquote>
          <p className="mt-5 text-sm font-semibold text-navy">{t.spotlight.name}</p>
          <p className="text-sm text-ink/50">{t.spotlight.meta}</p>
          <Link
            to="/success-stories"
            className="label-caps mt-6 flex w-fit items-center gap-2 text-coral hover:underline"
          >
            {t.spotlight.cta} →
          </Link>
        </div>
      </div>
    </section>
  );
}
