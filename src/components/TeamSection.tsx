import { useRef } from "react";
import { useLang } from "../i18n";
import { TEAM } from "../data/team";
import { assetPath } from "../lib/assetPath";

function TeamCard({ member, lang }: { member: (typeof TEAM)[number]; lang: "en" | "bn" }) {
  return (
    <div className="w-56 shrink-0 rounded-2xl border hairline bg-paper p-5">
      <div className="aspect-square overflow-hidden rounded-xl bg-parchment">
        {member.photo && (
          <img
            src={assetPath(member.photo)}
            alt={member.name}
            className="h-full w-full object-cover object-top"
          />
        )}
      </div>
      <p className="label-caps mt-4 text-coral">{member.role[lang]}</p>
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
            Windows/browser combos and leaves the row looking stuck. */}
        <div className="mt-10 flex items-end justify-between gap-6">
          <p className="label-caps text-ink/60">{t.about.teamMore}</p>
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
          ref={scroller}
          className="scrollbar-hide mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1"
        >
          {rest.map((member) => (
            <div key={member.name} className="snap-start">
              <TeamCard member={member} lang={lang} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
