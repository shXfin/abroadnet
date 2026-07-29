import { useLang } from "../i18n";
import { assetPath } from "../lib/assetPath";

/** A static, single featured testimonial — deliberately not another moving
 * strip, since the page already has the partner-university ticker right
 * below it and two auto-scrolling rows fighting for attention reads as
 * cluttered. More real quotes replace the placeholder note as they come in. */
export default function TestimonialsMarquee() {
  const { t } = useLang();
  const a = t.about;
  const featured = a.testimonials[0];

  return (
    <section className="border-y hairline bg-parchment/30 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <p className="label-caps text-ink/50">{a.testimonialsKicker}</p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">{a.testimonialsTitle}</h2>

        {featured && (
          <figure className="mt-10 max-w-2xl border hairline bg-paper p-8 md:p-10">
            <span className="font-display text-4xl leading-none text-coral">"</span>
            <blockquote className="mt-2 text-base leading-relaxed text-ink/80 md:text-lg">{featured.quote}</blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <img src={assetPath(featured.photo)} alt={featured.name} className="h-11 w-11 rounded-full object-cover" />
              <span>
                <span className="block font-display text-sm text-ink">{featured.name}</span>
                <span className="block text-xs text-ink/50">{featured.role}</span>
              </span>
            </figcaption>
          </figure>
        )}

        <p className="mt-5 text-sm text-ink/40">{a.testimonialsComingSoon}</p>
      </div>
    </section>
  );
}
