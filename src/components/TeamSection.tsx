import { useLang } from "../i18n";
import { TEAM } from "../data/team";
import { assetPath } from "../lib/assetPath";
import { buildWhatsAppUrl } from "../lib/whatsapp";

// Flat, image-forward, no border/shadow "card" chrome — closer to how
// Apple's own leadership grid presents people: the photo carries the
// section, name and role sit quietly underneath. Full color always; these
// are real community members, not a moody studio shoot.
function TeamCard({ member, lang }: { member: (typeof TEAM)[number]; lang: "en" | "bn" }) {
  return (
    <div>
      <div className="aspect-square overflow-hidden rounded-xl bg-parchment">
        {member.photo && (
          <img
            src={assetPath(member.photo)}
            alt={member.name}
            className="h-full w-full object-cover object-center"
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

// An open seat in the same grid, same footprint as a real card, so it reads
// as "one of us, not yet hired" rather than a banner bolted on the side.
// Dashed border is the universal "upload/placeholder" visual, borrowed on
// purpose so it's instantly legible as an empty slot waiting for a photo.
function JoinUsCard({ t }: { t: ReturnType<typeof useLang>["t"] }) {
  const waUrl = buildWhatsAppUrl(t.about.joinUsMessage);
  return (
    <a href={waUrl} target="_blank" rel="noreferrer" className="group block">
      <div className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink/25 bg-transparent text-center transition-colors group-hover:border-coral">
        <span className="text-3xl text-ink/30 transition-colors group-hover:text-coral">+</span>
        <span className="px-4 text-xs leading-snug text-ink/40 transition-colors group-hover:text-coral">
          {t.about.joinUsPhotoHint}
        </span>
      </div>
      <p className="label-caps mt-4 text-coral">{t.about.joinUsKicker}</p>
      <p className="mt-1 font-display text-lg text-navy transition-colors group-hover:text-coral">
        {t.about.joinUsTitle}
      </p>
    </a>
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

        {/* The rest of the team, as a wrapping grid rather than a scroller —
            no card ever slices at an edge because nothing scrolls; every
            card is always shown in full. auto-fill means this scales with
            the roster on its own: add 3 people or 30, it just grows more
            rows at the same card size, no layout changes needed. */}
        <div className="mt-16">
          <h3 className="font-display text-3xl font-bold text-navy md:text-4xl">{t.about.teamMore}</h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/60">{t.about.teamMoreSub}</p>
        </div>

        <div className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-x-6 gap-y-10 sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
          {rest.map((member) => (
            <TeamCard key={member.name} member={member} lang={lang} />
          ))}
          <JoinUsCard t={t} />
        </div>
      </div>
    </section>
  );
}
