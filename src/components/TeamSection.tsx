import { useLang } from "../i18n";
import { TEAM } from "../data/team";
import { assetPath } from "../lib/assetPath";

/** Leadership focus: the CEO as a wide feature card, two lead consultants
 * beside/under him, then a note that a wider team operates globally.
 * Card language matches the rest of the site (hairline borders, parchment,
 * coral caps) rather than a generic circular-avatar team grid. */
export default function TeamSection() {
  const { t, lang } = useLang();
  const [ceo, ...rest] = TEAM;
  const leads = rest.filter((m) => m.photo);

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
              <a href={`tel:${ceo.phone.replace(/\s/g, "")}`} className="hover:text-white">
                {ceo.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Lead consultants */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {leads.map((member) => (
            <div
              key={member.name}
              className="flex items-center gap-5 rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10"
            >
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-white/10">
                <img
                  src={assetPath(member.photo!)}
                  alt={member.name}
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div>
                <p className="label-caps text-coral">{member.role[lang]}</p>
                <p className="mt-1.5 font-display text-xl">{member.name}</p>
                <p className="mt-1 text-sm text-white/50">
                  {member.city}, {member.country}
                </p>
                <a
                  href={`tel:${member.phone.replace(/\s/g, "")}`}
                  className="text-sm text-white/50 hover:text-white"
                >
                  {member.phone}
                </a>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm text-white/45">
          <span className="text-coral">✦</span> {t.about.teamMore}
        </p>
      </div>
    </section>
  );
}
