import { useState } from "react";
import { useLang } from "../i18n";
import { TEAM } from "../data/team";

function OfficePhoto() {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <p className="font-mono text-xs text-ink/30">OFFICE PHOTO PLACEHOLDER</p>;
  }
  return (
    <img
      src="/photos/office-opening.jpg"
      alt="Abroad Net office"
      className="h-full w-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}

export default function About() {
  const { t, lang } = useLang();

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-20">
        <p className="label-caps text-coral">{t.about.kicker}</p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl tracking-tight md:text-7xl">
          {t.about.titleA} <em>{t.about.titleB}</em>
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/70">{t.about.sub}</p>
        <p className="mt-4 text-xs font-semibold uppercase tracking-caps text-coral">{t.brand.motto}</p>
      </section>

      <section className="border-y hairline bg-parchment/40 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2">
          <div>
            <p className="label-caps text-ink/50">{t.about.officeKicker}</p>
            <h2 className="mt-3 font-display text-4xl">{t.about.officeTitle}</h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/60">{t.about.officeCopy}</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink/60">{t.footer.phone}</p>
            <p className="max-w-sm text-sm leading-relaxed text-ink/60">{t.footer.email}</p>
          </div>
          <div className="aspect-[4/3] overflow-hidden border hairline bg-paper p-6">
            <OfficePhoto />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="label-caps text-ink/50">{t.about.teamKicker}</p>
        <h2 className="mt-3 font-display text-4xl">{t.about.teamTitle}</h2>
        <div className="mt-10 grid gap-px border hairline bg-ink/15 sm:grid-cols-2 md:grid-cols-4">
          {TEAM.map((member) => (
            <div key={member.name} className="bg-paper p-6">
              <p className="font-display text-xl text-navy">{member.name}</p>
              <p className="mt-1 text-sm text-ink/60">{member.role[lang]}</p>
              <p className="mt-3 text-sm text-ink/50">
                {member.city}, {member.country}
              </p>
              <p className="mt-1 text-sm text-ink/50">{member.phone}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="label-caps text-ink/50">{t.about.portfolioKicker}</p>
        <h2 className="mt-3 font-display text-4xl">{t.about.portfolioTitle}</h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/60">{t.about.portfolioCopy}</p>
      </section>
    </>
  );
}
