import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import BoardingPassCta from "./BoardingPassCta";
import { useLang } from "../i18n";
import { assetPath } from "../lib/assetPath";
import { handleAssessmentLinkClick } from "../lib/assessmentJump";

type Props = {
  country: string;
  code: string;
  intro: string;
  steps: { title: string; description: string }[];
  partnerUniversities: string[];
  extra?: ReactNode;
  heroImage?: string;
};

const DESTINATION_ORDER = [
  { code: "KUL", to: "/destinations/malaysia", nameKey: "malaysia" as const },
  { code: "OTP", to: "/destinations/romania", nameKey: "romania" as const },
  { code: "TBS", to: "/destinations/georgia", nameKey: "georgia" as const },
  { code: "PEK", to: "/destinations/china", nameKey: "china" as const },
];

export default function DestinationSteps({
  country,
  code,
  intro,
  steps,
  partnerUniversities,
  extra,
  heroImage,
}: Props) {
  const { t } = useLang();
  const [expanded, setExpanded] = useState<number | null>(null);

  const currentIndex = DESTINATION_ORDER.findIndex((d) => d.code === code);
  const prevDestination = DESTINATION_ORDER[(currentIndex - 1 + DESTINATION_ORDER.length) % DESTINATION_ORDER.length];
  const nextDestination = DESTINATION_ORDER[(currentIndex + 1) % DESTINATION_ORDER.length];

  // The folder rail: cards start laid out one after another like a normal
  // list, then continuously slide toward a stacked pile as you scroll —
  // timed against the real content's height so the pile finishes forming
  // exactly as that content ends, not sooner and not with gaps in between.
  const railOuterRef = useRef<HTMLDivElement>(null);
  const firstCardRef = useRef<HTMLButtonElement>(null);
  const [cardHeight, setCardHeight] = useState(96);
  const [progress, setProgress] = useState(0);

  const STICKY_TOP = 104; // px — matches the sticky wrapper's top offset below
  const WRAPPER_HEIGHT = 560; // px — the sticky wrapper's own fixed height

  useLayoutEffect(() => {
    function measureCard() {
      if (firstCardRef.current) setCardHeight(firstCardRef.current.offsetHeight);
    }
    measureCard();
    window.addEventListener("resize", measureCard);
    return () => window.removeEventListener("resize", measureCard);
  }, [steps.length]);

  useEffect(() => {
    let raf = 0;
    function update() {
      raf = 0;
      const el = railOuterRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollableDistance = Math.max(rect.height - WRAPPER_HEIGHT, 1);
      const scrolled = STICKY_TOP - rect.top;
      setProgress(Math.min(1, Math.max(0, scrolled / scrollableDistance)));
    }
    function onScroll() {
      if (!raf) raf = requestAnimationFrame(update);
    }
    update();
    const ro = new ResizeObserver(onScroll);
    if (railOuterRef.current) ro.observe(railOuterRef.current);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-20">
        <div className={heroImage ? "grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-center" : undefined}>
          <div>
            <p className="label-caps text-coral">
              {t.destination.kicker} · <span className="font-mono">{code}</span>
            </p>
            <h1 className="mt-4 font-display text-6xl tracking-tight md:text-8xl">{country}</h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-ink/70">{intro}</p>
          </div>
          {heroImage && (
            <div className="overflow-hidden rounded-2xl border hairline">
              <img src={assetPath(heroImage)} alt="" className="block h-auto w-full" />
            </div>
          )}
        </div>
      </section>

      <section className="border-y hairline bg-parchment/40 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="label-caps text-ink/50">{t.destination.itineraryKicker}</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">{t.destination.itineraryTitle}</h2>

          {/* Mobile: a plain compact index, same hairline-row language the rest of
              the site already uses — no cards, no scroll, clears in a glance. */}
          <ol className="mt-8 divide-y hairline border-y hairline md:hidden">
            {steps.map((step, i) => (
              <li key={step.title} className="flex items-center gap-3 py-2.5">
                <span className="w-6 shrink-0 font-mono text-xs text-coral">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-sm text-ink/70">{step.title}</span>
              </li>
            ))}
          </ol>

          {/* Desktop: the folder stack lives in a narrow rail beside the REAL content
              (the per-country details and partner universities below) instead of
              gating it — it collapses into a pile of filed folders as you read, and
              stays resting there through to the end of this destination's content. */}
          <div className="md:mt-12 md:grid md:grid-cols-[220px_1fr] md:gap-12">
            <div ref={railOuterRef} className="relative hidden md:block">
              <ol className="sticky" style={{ top: STICKY_TOP, height: WRAPPER_HEIGHT }}>
                {steps.map((step, i) => {
                  const isOpen = expanded === i;
                  // At progress 0, cards sit one after another like a normal list.
                  // At progress 1, they've slid into a tight, barely-peeking pile.
                  // `progress` is driven by actual scroll position against the
                  // real content's height, so the pile finishes forming exactly
                  // when that content ends.
                  const naturalY = i * (cardHeight + 14);
                  // Keep enough clearance even at full pile that a later card's tab
                  // never lands on an earlier card's title text — just its blank
                  // top padding.
                  const pileY = i * 44;
                  const y = naturalY + (pileY - naturalY) * progress;
                  return (
                    <li key={step.title} className="absolute inset-x-0" style={{ top: y, zIndex: isOpen ? steps.length + 1 : i + 1 }}>
                      <button
                        type="button"
                        ref={i === 0 ? firstCardRef : undefined}
                        onClick={() => setExpanded(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        className="relative block w-full text-left"
                      >
                        <span
                          className="absolute -top-5 flex h-7 w-16 items-center justify-center rounded-t-lg border hairline border-b-0 bg-navy font-display text-sm font-bold text-white/90"
                          style={{ left: `${6 + (i % 4) * 16}%` }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="relative block overflow-hidden rounded-xl border hairline bg-paper px-5 pb-5 pt-8 shadow-[0_16px_32px_-20px_rgba(28,23,64,0.4)] transition-shadow hover:shadow-[0_16px_32px_-14px_rgba(28,23,64,0.5)]">
                          <h3 className="truncate font-display text-base leading-snug">{step.title}</h3>
                          {isOpen && (
                            <span className="mt-2 block text-sm leading-relaxed text-ink/60">{step.description}</span>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div>
              {extra}

              <section className="py-20">
                <p className="label-caps text-ink/50">{t.destination.unisKicker}</p>
                <h2 className="mt-3 font-display text-4xl md:text-5xl">{t.destination.unisTitle}</h2>
                <ul className="mt-10 grid gap-px border hairline bg-ink/15 sm:grid-cols-2">
                  {partnerUniversities.map((uni) => (
                    <li key={uni} className="bg-paper p-6 font-display text-xl">
                      {uni}
                    </li>
                  ))}
                </ul>
                <p className="mt-8 text-sm text-ink/50">
                  <Link
                    to="/#assessment"
                    onClick={handleAssessmentLinkClick}
                    className="underline decoration-coral underline-offset-4 hover:text-coral"
                  >
                    {t.destination.unisNote}
                  </Link>
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>

      {/* Browse to the next (or previous) destination — a plain utility, deliberately
          outside the folder metaphor so it reads as "what's next," not part of the pile. */}
      <nav className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-px border hairline bg-ink/15 sm:grid-cols-2">
          <Link to={prevDestination.to} className="group flex items-center gap-4 bg-paper p-6 transition-colors hover:bg-navy hover:text-white">
            <span className="text-xl transition-transform group-hover:-translate-x-1">←</span>
            <span>
              <span className="label-caps block text-ink/40 group-hover:text-white/50">{t.destination.prevLabel}</span>
              <span className="mt-1 block font-display text-xl">{t.nav[prevDestination.nameKey]}</span>
            </span>
          </Link>
          <Link to={nextDestination.to} className="group flex items-center justify-end gap-4 bg-paper p-6 text-right transition-colors hover:bg-navy hover:text-white">
            <span>
              <span className="label-caps block text-ink/40 group-hover:text-white/50">{t.destination.nextLabel}</span>
              <span className="mt-1 block font-display text-xl">{t.nav[nextDestination.nameKey]}</span>
            </span>
            <span className="text-xl transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </nav>

      <BoardingPassCta />
    </>
  );
}
