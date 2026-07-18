import { useLang } from "../i18n";

export default function About() {
  const { t } = useLang();

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-20">
        <p className="label-caps text-coral">{t.about.kicker}</p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl tracking-tight md:text-7xl">
          {t.about.titleA} <em>{t.about.titleB}</em>
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/70">{t.about.sub}</p>
      </section>

      <section className="border-y hairline bg-parchment/40 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2">
          <div>
            <p className="label-caps text-ink/50">{t.about.officeKicker}</p>
            <h2 className="mt-3 font-display text-4xl">{t.about.officeTitle}</h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/60">{t.about.officeCopy}</p>
          </div>
          <div className="aspect-[4/3] border hairline bg-paper p-6">
            <p className="font-mono text-xs text-ink/30">OFFICE PHOTOS / MAP PLACEHOLDER</p>
          </div>
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
