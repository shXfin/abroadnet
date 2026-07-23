import { useLang } from "../i18n";
import { TEAM } from "../data/team";
import { assetPath } from "../lib/assetPath";

function TeamCard({ member, lang }: { member: (typeof TEAM)[number]; lang: "en" | "bn" }) {
  return (
    <div className="w-56 shrink-0 rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/10">
      <div className="aspect-square overflow-hidden rounded-xl bg-white/10">
        {member.photo && (
          <img
            src={assetPath(member.photo)}
            alt={member.name}
            className="h-full w-full object-cover object-top"
          />
        )}
      </div>
      <p className="label-caps mt-4 text-coral">{member.role[lang]}</p>
      <p className="mt-1 font-display text-lg">{member.name}</p>
      {member.phone && (
        <a
          href={`tel:${member.phone.replace(/\s/g, "")}`}
          className="mt-1 block text-sm text-white/50 hover:text-white"
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

  return (
    <section className="border-y hairline bg-navy py-20 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <p className="label-caps text-coral">{t.about.teamLead}</p>
        <h2 className="mt-3 max-w-2xl font-display text-4xl md:text-5xl">{t.about.teamTitle}</h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60">{t.about.teamSub}</p>

        {/* Featured: CEO */}
        <div className="mt-12 grid overflow-hidden rounded-2xl bg-white/[0.04] ring-1 ring-white/10 md:grid-cols-[minmax(0,300px)_1fr]">
          <div className="aspect-[4/5] overflow-hidden bg-white/10 md:aspect-auto">
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
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/65">{ceo.bio[lang]}</p>
            )}
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-1 text-sm text-white/50">
              <span>
                {ceo.city}, {ceo.country}
              </span>
              {ceo.phone && (
                <a href={`tel:${ceo.phone.replace(/\s/g, "")}`} className="hover:text-white">
                  {ceo.phone}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* The rest of the team, drifting in an infinite, self-scrolling row */}
        <p className="label-caps mt-10 text-white/40">{t.about.teamMore}</p>

        <div
          className="relative mt-4 overflow-hidden"
          style={{
            WebkitMaskImage: "linear-gradient(90deg, transparent, black 6%, black 94%, transparent)",
            maskImage: "linear-gradient(90deg, transparent, black 6%, black 94%, transparent)",
          }}
        >
          <div className="flex w-max gap-4 animate-marquee-slow hover:[animation-play-state:paused]">
            <div className="flex gap-4">
              {rest.map((member) => (
                <TeamCard key={member.name} member={member} lang={lang} />
              ))}
            </div>
            <div className="flex gap-4" aria-hidden="true">
              {rest.map((member) => (
                <TeamCard key={`${member.name}-dup`} member={member} lang={lang} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
