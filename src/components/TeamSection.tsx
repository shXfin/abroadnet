import { useRef } from "react";
import { useLang } from "../i18n";
import { TEAM } from "../data/team";
import { assetPath } from "../lib/assetPath";

// A warm gold, used only here — the point is to mark this specific row as
// "people worth celebrating," a step up from the coral/navy used everywhere
// else, not a new brand color to spread around the rest of the site.
const GOLD = "#B8860B";

function TeamCard({ member, lang }: { member: (typeof TEAM)[number]; lang: "en" | "bn" }) {
  return (
    <div className="w-60 shrink-0 rounded-2xl border hairline bg-paper p-5 shadow-[0_8px_20px_-12px_rgba(28,23,64,0.25)] transition-all hover:-translate-y-1 hover:shadow-[0_16px_28px_-14px_rgba(184,134,11,0.35)]">
      <div className="aspect-square overflow-hidden rounded-xl bg-parchment ring-1 ring-inset ring-[#B8860B]/15">
        {member.photo && (
          <img
            src={assetPath(member.photo)}
            alt={member.name}
            className="h-full w-full object-cover object-top"
          />
        )}
      </div>
      <p className="label-caps mt-4" style={{ color: GOLD }}>
        {member.role[lang]}
      </p>
      <p className="mt-1 font-display text-lg text-navy">{member.name}</p>
      {member.phone && (
        <a
          href={`tel:${member.phone.replace(/\s/g, "")}`}
          className="mt-1 block text-sm text-ink/50 hover:text-coral"
        >
          {member.phone}
        </a>
      )}
    </div>
  );
}

/** Leadership focus: the CEO as a wide feature card, then the rest of the
 * team (senior consultant included) as an infinite, self-scrolling row —
 * no scrollbar, no buttons, just a slow continuous drift that pauses on
 * hover so names are easy to read. */
export default function TeamSection() {
  const { t, lang } = useLang();
  const [ceo, ...rest] = TEAM;
  const scroller = useRef<HTMLDivElement>(null);

  function scrollBy(direction: 1 | -1) {
    scroller.current?.scrollBy({ left: direction * 240, behavior: "smooth" });
  }

  return (
    <section className="border-y hairline bg-parchment/30 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <p className="label-caps text-ink/50">{t.about.teamLead}</p>
        <h2 className="mt-3 max-w-2xl font-display text-4xl md:text-5xl">{t.about.teamTitle}</h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/60">{t.about.teamSub}</p>

        {/* Featured: CEO */}
        <div className="mt-12 grid overflow-hidden rounded-2xl border hairline bg-paper md:grid-cols-[minmax(0,300px)_1fr]">
          <div className="aspect-[4/5] overflow-hidden bg-parchment md:aspect-auto">
            <img
              src={assetPath(ceo.photo!)}
              alt={ceo.name}
              className="h-full w-full object-cover object-top"
            />
          </div>
          <div className="flex flex-col justify-center p-8 md:p-12">
            <p className="label-caps text-coral">{ceo.role[lang]}</p>
            <h3 className="mt-3 font-display text-3xl md:text-4xl">{ceo.name}</h3>
            {ceo.bio && (
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink/65">{ceo.bio[lang]}</p>
            )}
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink/50">
              <span>
                {ceo.city}, {ceo.country}
              </span>
              {ceo.phone && (
                <a href={`tel:${ceo.phone.replace(/\s/g, "")}`} className="hover:text-coral">
                  {ceo.phone}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* The rest of the team. A real scrollable row with arrows — not a
            CSS-animation marquee, since that silently freezes on some
            Windows/browser combos and leaves the row looking stuck. Framed
            a step above the site's usual coral/navy treatment: these are
            the people behind the work, so the row gets a gold accent and a
            fade at the edges instead of cards clipping hard against the
            container boundary. */}
        <div className="mt-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="inline-block h-1 w-14 rounded-full" style={{ backgroundColor: GOLD }} />
            <h3 className="mt-3 font-display text-3xl font-bold md:text-4xl" style={{ color: GOLD }}>
              {t.about.teamMore}
            </h3>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <button
              onClick={() => scrollBy(-1)}
              className="flex h-11 w-11 items-center justify-center border hairline text-lg transition-colors hover:border-coral hover:text-coral"
              aria-label="Previous"
            >
              ←
            </button>
            <button
              onClick={() => scrollBy(1)}
              className="flex h-11 w-11 items-center justify-center border hairline text-lg transition-colors hover:border-coral hover:text-coral"
              aria-label="Next"
            >
              →
            </button>
          </div>
        </div>

        <div
          className="relative -mx-6 mt-5 px-6"
          style={{
            WebkitMaskImage: "linear-gradient(90deg, transparent, black 24px, black calc(100% - 24px), transparent)",
            maskImage: "linear-gradient(90deg, transparent, black 24px, black calc(100% - 24px), transparent)",
          }}
        >
          <div
            ref={scroller}
            className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto py-1"
          >
            {rest.map((member) => (
              <div key={member.name} className="snap-start">
                <TeamCard member={member} lang={lang} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
