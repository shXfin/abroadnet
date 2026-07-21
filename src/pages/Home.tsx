import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import StudentStoriesGrid from "../components/StudentStoriesGrid";
import Ticker from "../components/Ticker";
import BoardingPassCta from "../components/BoardingPassCta";
import FacebookCarousel from "../components/FacebookCarousel";
import JourneyTimeline from "../components/JourneyTimeline";
import { useLang } from "../i18n";

export default function Home() {
  const { t } = useLang();

  return (
    <>
      <Hero />

      {/* Proof, right after the assessment, not tucked behind a nav link */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="label-caps text-coral">{t.students.kicker}</p>
        <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
          {t.students.titleA} <em>{t.students.titleB}</em>
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/70">{t.students.sub}</p>
        <div className="mt-10">
          <StudentStoriesGrid />
        </div>
      </section>

      <Ticker />

      {/* Facebook carousel, right beneath the hero */}
      <FacebookCarousel />

      <JourneyTimeline />

      {/* Destinations */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="label-caps text-ink/50">{t.routes.kicker}</p>
        <h2 className="mt-3 font-display text-4xl md:text-6xl">{t.routes.title}</h2>

        <div className="mt-12 grid gap-px border hairline bg-ink/15 md:grid-cols-2">
          {[
            { to: "/destinations/malaysia", code: "KUL", name: t.nav.malaysia, tag: t.routes.malaysiaTag },
            { to: "/destinations/romania", code: "OTP", name: t.nav.romania, tag: t.routes.romaniaTag },
            { to: "/destinations/georgia", code: "TBS", name: t.nav.georgia, tag: t.routes.georgiaTag },
            { to: "/destinations/china", code: "PEK", name: t.nav.china, tag: t.routes.chinaTag },
          ].map((route) => (
            <Link
              key={route.code}
              to={route.to}
              className="group flex flex-col justify-between bg-paper p-8 transition-colors hover:bg-navy hover:text-white md:min-h-[260px] md:p-10"
            >
              <span className="font-mono text-sm tracking-widest text-coral">{route.code}</span>
              <div>
                <h3 className="font-display text-4xl md:text-5xl">{route.name}</h3>
                <p className="mt-4 max-w-sm text-sm leading-relaxed opacity-60">{route.tag}</p>
                <p className="label-caps mt-8 flex items-center gap-2 text-coral">
                  {t.routes.explore}
                  <span className="transition-transform group-hover:translate-x-2">→</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <BoardingPassCta />
    </>
  );
}
