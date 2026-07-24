import { useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import StudentStoriesGrid from "../components/StudentStoriesGrid";
import Ticker from "../components/Ticker";
import BoardingPassCta from "../components/BoardingPassCta";
import FacebookCarousel from "../components/FacebookCarousel";
import JourneyTimeline from "../components/JourneyTimeline";
import { TEAM } from "../data/team";
import { MALAYSIA_UNIVERSITIES } from "../data/universities";
import { assetPath } from "../lib/assetPath";
import { useLang } from "../i18n";

const TEAM_FACES = TEAM.filter((m) => m.photo).slice(0, 4);

type FaqItem = { q: string; a: string };

/** A tabbed FAQ, not two stacked lists — the Malaysia-specific questions
 * (most-traveled route, so people ask about it most) live one tap away
 * instead of doubling the page's scroll length. */
function FaqSection({
  kicker,
  title,
  generalLabel,
  generalItems,
  malaysiaItems,
  malaysiaLabel,
}: {
  kicker: string;
  title: string;
  generalLabel: string;
  generalItems: FaqItem[];
  malaysiaItems: FaqItem[];
  malaysiaLabel: string;
}) {
  const [tab, setTab] = useState<"general" | "malaysia">("general");
  const items = tab === "general" ? generalItems : malaysiaItems;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="label-caps text-coral">{kicker}</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl md:text-4xl">{title}</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTab("general")}
            className={`label-caps rounded-full border-2 px-5 py-2 transition-colors ${
              tab === "general" ? "border-navy bg-navy text-white" : "border-navy/15 text-ink/60 hover:border-navy/30"
            }`}
          >
            {generalLabel}
          </button>
          <button
            onClick={() => setTab("malaysia")}
            className={`label-caps rounded-full border-2 px-5 py-2 transition-colors ${
              tab === "malaysia" ? "border-navy bg-navy text-white" : "border-navy/15 text-ink/60 hover:border-navy/30"
            }`}
          >
            {malaysiaLabel}
          </button>
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
              className="group relative flex flex-col overflow-hidden bg-navy text-white"
            >
              {/* Mobile: the photo sits as its own banner, text stays on solid navy below */}
              <div className="aspect-[2048/1163] md:hidden">
                <img
                  src={assetPath("photos/malaysia-mahsa-visit.jpg")}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Desktop: full-bleed background photo behind the text, with a gradient for contrast */}
              <img
                src={assetPath("photos/malaysia-mahsa-visit.jpg")}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 hidden h-full w-full object-cover object-[78%_78%] opacity-95 md:block"
              />
              <div
                className="absolute inset-0 hidden transition-[background] md:block group-hover:[background:linear-gradient(to_right,rgba(28,23,64,0.95)_0%,rgba(28,23,64,0.88)_26%,rgba(28,23,64,0.4)_40%,rgba(28,23,64,0.3)_60%,rgba(28,23,64,0.3)_100%)]"
                style={{
                  background:
                    "linear-gradient(to right, rgba(36,30,94,0.95) 0%, rgba(36,30,94,0.88) 26%, rgba(36,30,94,0.4) 40%, rgba(36,30,94,0.3) 60%, rgba(36,30,94,0.3) 100%)",
                }}
              />

              <div className="relative p-8 md:p-12">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm tracking-widest text-coral">KUL</span>
                  <span className="label-caps text-white/40">{t.routes.leadTag}</span>
                </div>

                <div className="mt-6 grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
                  <div>
                    <h3 className="font-display text-5xl md:text-7xl">{t.nav.malaysia}</h3>
                    <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/60 md:text-base">
                      {t.routes.malaysiaTag}
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-white/50">
                      <span>{MALAYSIA_UNIVERSITIES.length} {t.routes.partnerUnis}</span>
                      <p className="label-caps flex items-center gap-2 text-coral">
                        {t.routes.explore}
                        <span className="transition-transform group-hover:translate-x-2">→</span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-6 md:border-t-0 md:border-l md:pl-10 md:pt-0">
                    {bachelorTuition && (
                      <div>
                        <p className="label-caps text-white/40">{t.malaysia.bachelorLabel.split(" (")[0]}</p>
                        <p className="mt-2 font-display text-lg leading-tight">{bachelorTuition.value}</p>
                      </div>
                    )}
                    <div>
                      <p className="label-caps text-white/40">{t.malaysia.livingCostLabel}</p>
                      <p className="mt-2 font-display text-lg leading-tight">{t.malaysia.livingCostValue}</p>
                    </div>
                    <div>
                      <p className="label-caps text-white/40">{t.malaysia.intakesKicker}</p>
                      <p className="mt-2 font-display text-lg leading-tight">{t.malaysia.intakes.length}×/{t.routes.perYear}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <div className="grid gap-px bg-ink/15 sm:grid-cols-3">
              {[
                { to: "/destinations/romania", code: "OTP", name: t.nav.romania, tag: t.routes.romaniaTag },
                { to: "/destinations/georgia", code: "TBS", name: t.nav.georgia, tag: t.routes.georgiaTag },
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

      <FaqSection
        kicker={t.homeFaq.kicker}
        title={t.homeFaq.title}
        generalLabel={t.homeFaq.generalTab}
        generalItems={t.homeFaq.items}
        malaysiaItems={t.malaysia.faq}
        malaysiaLabel={t.nav.malaysia}
      />


      <BoardingPassCta />
    </>
  );
}
