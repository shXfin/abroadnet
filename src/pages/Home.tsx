import { Link } from "react-router-dom";
import Ticker from "../components/Ticker";
import BoardingPassCta from "../components/BoardingPassCta";
import FacebookCarousel from "../components/FacebookCarousel";
import { useLang } from "../i18n";

export default function Home() {
  const { t } = useLang();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <svg
          viewBox="0 0 44 30"
          className="pointer-events-none absolute -right-24 top-8 h-72 w-auto opacity-[0.05] md:h-[480px]"
          aria-hidden="true"
        >
          <polygon points="6,2 42,0 34,13 0,16" fill="#241E5E" />
          <polygon points="12,19 37,16 30,29 17,26" fill="#F0633B" />
        </svg>

        <div className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
          <p className="label-caps text-coral">{t.hero.kicker}</p>
          <h1 className="mt-6 max-w-4xl font-display text-6xl leading-[1.02] tracking-tight md:text-8xl">
            {t.hero.titleA}
            <br />
            <em className="text-navy">{t.hero.titleB}</em>
          </h1>
          <div className="mt-10 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="max-w-md text-base leading-relaxed text-ink/70">{t.hero.sub}</p>
              <p className="mt-5 flex items-center gap-2 text-xs font-medium text-ink/50">
                <span className="text-coral">★★★★★</span>
                {t.hero.trust}
              </p>
            </div>
            <div className="flex shrink-0 gap-4">
              <Link to="/apply" className="btn-primary">
                {t.hero.ctaPrimary} →
              </Link>
              <Link to="/book-session" className="btn-ghost">
                {t.hero.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Ticker />

      {/* Facebook carousel, right beneath the hero */}
      <FacebookCarousel />

      {/* Stats */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 divide-x hairline md:grid-cols-4">
          {t.stats.map((stat) => (
            <div key={stat.label} className="px-6 py-4 first:pl-0">
              <p className="font-display text-4xl text-navy md:text-5xl">{stat.value}</p>
              <p className="mt-2 text-xs leading-snug text-ink/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Destinations */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="label-caps text-ink/50">{t.routes.kicker}</p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">{t.routes.title}</h2>

        <div className="mt-12 grid gap-px border hairline bg-ink/15 md:grid-cols-2">
          {[
            { to: "/destinations/malaysia", code: "KUL", name: t.nav.malaysia, tag: t.routes.malaysiaTag },
            { to: "/destinations/romania", code: "OTP", name: t.nav.romania, tag: t.routes.romaniaTag },
          ].map((route) => (
            <Link
              key={route.code}
              to={route.to}
              className="group flex flex-col justify-between bg-paper p-10 transition-colors hover:bg-parchment/60 md:min-h-[320px]"
            >
              <span className="font-mono text-sm tracking-widest text-coral">{route.code}</span>
              <div>
                <h3 className="font-display text-5xl md:text-6xl">{route.name}</h3>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/60">{route.tag}</p>
                <p className="label-caps mt-8 flex items-center gap-2 text-ink/50 transition-colors group-hover:text-coral">
                  {t.routes.explore}
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="bg-navy py-24 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <p className="label-caps text-coral">{t.process.kicker}</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl md:text-5xl">{t.process.title}</h2>
          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {t.process.steps.map((step, i) => (
              <div key={step.title} className="border-t border-white/20 pt-6">
                <span className="font-mono text-sm text-coral">0{i + 1}</span>
                <h3 className="mt-3 font-display text-3xl italic">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{step.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BoardingPassCta />
    </>
  );
}
