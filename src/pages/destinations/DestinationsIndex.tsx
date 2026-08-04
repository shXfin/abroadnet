import { Link } from "react-router-dom";
import { useLang } from "../../i18n";
import { COMING_SOON_DESTINATIONS } from "../../data/comingSoonDestinations";

const LIVE_DESTINATIONS = [
  { to: "/destinations/malaysia", nameKey: "malaysia" as const },
  { to: "/destinations/italy", nameKey: "italy" as const },
  { to: "/destinations/romania", nameKey: "romania" as const },
  { to: "/destinations/georgia", nameKey: "georgia" as const },
  { to: "/destinations/china", nameKey: "china" as const },
];

const CONTINENTS = ["Europe", "Asia", "Oceania"] as const;

export default function DestinationsIndex() {
  const { t, lang } = useLang();

  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <p className="label-caps text-coral">{t.destination.indexKicker}</p>
      <h1 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">{t.destination.indexTitle}</h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/70">{t.destination.indexBody}</p>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {LIVE_DESTINATIONS.map((d) => (
          <Link
            key={d.to}
            to={d.to}
            className="group flex items-center justify-between rounded-2xl border hairline bg-white px-6 py-5 transition-colors hover:border-coral"
          >
            <span className="font-display text-xl text-navy">{t.nav[d.nameKey]}</span>
            <span className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-600/10 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                {t.destination.indexLiveLabel}
              </span>
              <span className="text-ink/30 transition-transform group-hover:translate-x-1 group-hover:text-coral">→</span>
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-14 space-y-8">
        {CONTINENTS.map((continent) => {
          const items = COMING_SOON_DESTINATIONS.filter((d) => d.continent === continent);
          if (items.length === 0) return null;
          return (
            <div key={continent}>
              <p className="label-caps text-ink/40">{continent}</p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {items.map((d) => (
                  <Link
                    key={d.slug}
                    to={`/destinations/${d.slug}`}
                    className="flex items-center gap-2 rounded-full border hairline bg-paper px-4 py-2 text-sm font-semibold text-ink/70 transition-colors hover:border-coral hover:text-coral"
                  >
                    {lang === "bn" ? d.nameBn : d.nameEn}
                    <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink/40">
                      {t.destination.indexSoonLabel}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
