import { Link } from "react-router-dom";
import { useLang } from "../i18n";
import { assetPath } from "../lib/assetPath";

/** A real, visible feature of the Englishology partnership — not just a
 * quiet text link — since this is a genuine service (Cambridge Linguaskill
 * registration) worth putting in front of people, not hiding behind a nav. */
export default function PartnershipBanner() {
  const { t } = useLang();

  return (
    <section className="border-y hairline bg-paper py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Link
          to="/linguaskill"
          className="group grid overflow-hidden rounded-2xl border hairline bg-navy text-white transition-shadow hover:shadow-[0_30px_60px_-20px_rgba(28,23,64,0.5)] md:grid-cols-2"
        >
          <div className="order-2 flex flex-col justify-center p-8 md:order-1 md:p-12">
            <p className="label-caps text-coral">{t.linguaskill.kicker}</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">{t.linguaskill.title}</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">{t.linguaskill.intro}</p>
            <p className="label-caps mt-8 flex items-center gap-2 text-coral">
              {t.linguaskill.formKicker}
              <span className="transition-transform group-hover:translate-x-2">→</span>
            </p>
          </div>
          <div className="order-1 overflow-hidden md:order-2">
            <img
              src={assetPath("photos/englishology-partnership-signing.jpg")}
              alt="Abroad Net × Englishology partnership signing"
              className="h-full w-full object-cover"
            />
          </div>
        </Link>
      </div>
    </section>
  );
}
