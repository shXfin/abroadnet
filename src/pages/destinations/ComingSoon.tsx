import { useParams, Link, Navigate } from "react-router-dom";
import { useLang } from "../../i18n";
import { handleAssessmentLinkClick } from "../../lib/assessmentJump";
import { COMING_SOON_DESTINATIONS } from "../../data/comingSoonDestinations";

/** A lightweight placeholder for destinations we're expanding into but don't
 * yet have a verified partner guide for — real content goes up once we have
 * a source to build it from, same as Malaysia/Romania/Georgia/China. No
 * invented tuition, eligibility, or document lists here. */
export default function ComingSoon() {
  const { slug } = useParams();
  const { t, lang } = useLang();
  const destination = COMING_SOON_DESTINATIONS.find((d) => d.slug === slug);

  if (!destination) return <Navigate to="/" replace />;

  const name = lang === "bn" ? destination.nameBn : destination.nameEn;

  return (
    <section className="mx-auto max-w-3xl px-6 py-24 text-center">
      <p className="label-caps text-coral">{t.destination.comingSoonKicker}</p>
      <h1 className="mt-4 font-display text-5xl tracking-tight md:text-7xl">{name}</h1>
      <h2 className="mt-3 font-display text-2xl text-ink/50 md:text-3xl">{t.destination.comingSoonTitle}</h2>
      <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink/70">{t.destination.comingSoonBody}</p>
      <Link
        to="/#assessment"
        onClick={handleAssessmentLinkClick}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-navy px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-coral"
      >
        {t.destination.comingSoonCta} →
      </Link>
    </section>
  );
}
