import { useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import StudentStoriesGrid from "../components/StudentStoriesGrid";
import Ticker from "../components/Ticker";
import BoardingPassCta from "../components/BoardingPassCta";
import FacebookCarousel from "../components/FacebookCarousel";
import TestimonialsMarquee from "../components/TestimonialsMarquee";
import PartnershipBanner from "../components/PartnershipBanner";
import JourneyTimeline from "../components/JourneyTimeline";
import { TEAM } from "../data/team";
import { MALAYSIA_UNIVERSITIES } from "../data/universities";
import { assetPath } from "../lib/assetPath";
import { useLang } from "../i18n";

const TEAM_FACES = TEAM.filter((m) => m.photo).slice(0, 4);

type FaqItem = { q: string; a: string };
type FaqGroup = { key: string; label: string; items: FaqItem[] };

/** A tabbed FAQ, not stacked lists — country-specific questions live one tap
 * away instead of doubling the page's scroll length. Takes a plain list of
 * groups rather than named general/malaysia props, so adding another
 * country's FAQ later is a data change at the call site, not a prop-shape
 * change here. Groups with no items are skipped by the caller. */
function FaqSection({ kicker, title, groups }: { kicker: string; title: string; groups: FaqGroup[] }) {
  const [tab, setTab] = useState(groups[0]?.key);
  const items = groups.find((g) => g.key === tab)?.items ?? [];

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="label-caps text-coral">{kicker}</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl md:text-4xl">{title}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {groups.map((g) => (
            <button
              key={g.key}
              onClick={() => setTab(g.key)}
              className={`label-caps rounded-full border-2 px-5 py-2 transition-colors ${
                tab === g.key ? "border-navy bg-navy text-white" : "border-navy/15 text-ink/60 hover:border-navy/30"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 divide-y hairline border-t hairline">
        {items.map((item) => (
          <details key={item.q} className="group py-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-lg text-navy md:text-xl">
              {item.q}
              <span className="shrink-0 text-2xl text-coral transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/60">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const { t } = useLang();
  const bachelorTuition = t.malaysia.tuition.find((row) => row.program === t.malaysia.bachelorLabel.split(" (")[0]);

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

      <TestimonialsMarquee />

      <Ticker />

      {/* Facebook carousel, right beneath the hero */}
      <FacebookCarousel />

      {/* The journey and where it leads, unified in one block */}
      <section id="routes" className="border-y hairline bg-parchment/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <JourneyTimeline />

          <div className="mt-10 grid gap-px border hairline bg-ink/15">
            {/* Malaysia leads: the most-traveled route, given the room to show it */}
            <Link
              to="/destinations/malaysia"
              className="group relative flex flex-col overflow-hidden bg-paper text-ink transition-colors duration-300 hover:bg-navy hover:text-white"
            >
              {/* Mobile: the photo sits as its own banner, text stays on the same paper panel
                  Romania/Georgia/China use below it — flips navy only on a real hover (desktop). */}
              <div className="aspect-[2048/1163] md:hidden">
                <img
                  src={assetPath("photos/malaysia-mahsa-visit.jpg")}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Desktop: full-bleed background photo behind the text. A uniform wash (not a
                  fade) keeps contrast even everywhere text can land — same paper/navy the other
                  three cards use, just laid over the photo instead of replacing it, so it reads
                  as one flat card color with the photo as a faint texture underneath. */}
              <img
                src={assetPath("photos/malaysia-mahsa-visit.jpg")}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 hidden h-full w-full object-cover object-[78%_78%] transition-transform duration-500 md:block md:group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 hidden bg-paper/90 transition-colors duration-300 md:block md:group-hover:bg-navy/90" />

              <div className="relative p-8 md:p-12">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm tracking-widest text-coral">KUL</span>
                  <span className="label-caps text-ink/40 group-hover:text-white/40">{t.routes.leadTag}</span>
                </div>

                <div className="mt-6 grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
                  <div>
                    <h3 className="font-display text-5xl md:text-7xl">{t.nav.malaysia}</h3>
                    <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink/60 group-hover:text-white/60 md:text-base">
                      {t.routes.malaysiaTag}
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-ink/50 group-hover:text-white/50">
                      <span>{MALAYSIA_UNIVERSITIES.length} {t.routes.partnerUnis}</span>
                      <p className="label-caps flex items-center gap-2 text-coral">
                        {t.routes.explore}
                        <span className="transition-transform group-hover:translate-x-2">→</span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6 border-t border-ink/10 pt-6 group-hover:border-white/10 md:border-t-0 md:border-l md:pl-10 md:pt-0">
                    {bachelorTuition && (
                      <div>
                        <p className="label-caps text-ink/40 group-hover:text-white/40">{t.malaysia.bachelorLabel.split(" (")[0]}</p>
                        <p className="mt-2 font-display text-lg leading-tight">{bachelorTuition.value}</p>
                      </div>
                    )}
                    <div>
                      <p className="label-caps text-ink/40 group-hover:text-white/40">{t.malaysia.livingCostLabel}</p>
                      <p className="mt-2 font-display text-lg leading-tight">{t.malaysia.livingCostValue}</p>
                    </div>
                    <div>
                      <p className="label-caps text-ink/40 group-hover:text-white/40">{t.malaysia.intakesKicker}</p>
                      <p className="mt-2 font-display text-lg leading-tight">{t.malaysia.intakes.length}×/{t.routes.perYear}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <div className="grid gap-px bg-ink/15 sm:grid-cols-3">
              {[
                { to: "/destinations/romania", code: "OTP", name: t.nav.romania, tag: t.routes.romaniaTag },
                { to: "/destinations/italy", code: "FCO", name: t.nav.italy, tag: t.routes.italyTag },
                { to: "/destinations/china", code: "PEK", name: t.nav.china, tag: t.routes.chinaTag },
              ].map((route) => (
                <Link
                  key={route.code}
                  to={route.to}
                  className="group flex flex-col justify-between bg-paper p-6 transition-colors hover:bg-navy hover:text-white sm:min-h-[220px]"
                >
                  <span className="font-mono text-sm tracking-widest text-coral">{route.code}</span>
                  <div>
                    <h3 className="font-display text-3xl md:text-4xl">{route.name}</h3>
                    <p className="mt-3 text-sm leading-relaxed opacity-60">{route.tag}</p>
                    <p className="label-caps mt-6 flex items-center gap-2 text-coral">
                      {t.routes.explore}
                      <span className="transition-transform group-hover:translate-x-2">→</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <Link
              to="/destinations"
              className="label-caps flex items-center justify-center gap-2 bg-paper px-6 py-5 text-ink/40 transition-colors hover:text-coral"
            >
              {t.routes.seeAllDestinations}
              <span>→</span>
            </Link>
          </div>

          {/* The "one counselor" promise, backed by real faces */}
          <Link
            to="/about"
            className="mt-10 flex items-center gap-4 border-t hairline pt-8 transition-opacity hover:opacity-70"
          >
            <div className="flex -space-x-3">
              {TEAM_FACES.map((m) => (
                <img
                  key={m.name}
                  src={assetPath(m.photo!)}
                  alt={m.name}
                  className="h-10 w-10 rounded-full border-2 border-paper object-cover"
                />
              ))}
            </div>
            <p className="text-sm text-ink/60">
              {t.why.teamNote}{" "}
              <span className="font-semibold text-navy underline decoration-coral underline-offset-4">
                {t.why.teamCta}
              </span>
            </p>
          </Link>
        </div>
      </section>

      <PartnershipBanner />

      <FaqSection
        kicker={t.homeFaq.kicker}
        title={t.homeFaq.title}
        groups={[
          { key: "general", label: t.homeFaq.generalTab, items: t.homeFaq.items },
          { key: "malaysia", label: t.nav.malaysia, items: t.malaysia.faq },
          { key: "romania", label: t.nav.romania, items: t.romania.faq },
        ].filter((g) => g.items.length > 0)}
      />


      <BoardingPassCta />
    </>
  );
}
