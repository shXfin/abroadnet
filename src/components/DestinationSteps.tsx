import type { ReactNode } from "react";
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

          {/* Mobile: a quick, non-blocking scan of the steps — no sticky/stacking here,
              so nothing stands between a mobile visitor and the real information below. */}
          <div className="mt-8 flex gap-3 overflow-x-auto pb-2 md:hidden">
            {steps.map((step, i) => (
              <div key={step.title} className="w-40 shrink-0 rounded-xl border hairline bg-paper p-4">
                <span className="font-mono text-xs text-coral">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-1 font-display text-sm leading-snug">{step.title}</p>
              </div>
            ))}
          </div>

          {/* Desktop: the folder stack lives in a narrow rail beside the REAL content
              (the per-country details below) instead of gating it — it collapses into
              a pile of filed folders as you read, rather than sitting in front of
              everything you actually came here to read. */}
          <div className="md:mt-12 md:grid md:grid-cols-[220px_1fr] md:gap-12">
            <div className="relative hidden md:block">
              <ol>
                {steps.map((step, i) => (
                  <li
                    key={step.title}
                    className="sticky mb-2 last:mb-0"
                    style={{ top: `calc(6rem + ${i * 8}px)`, zIndex: i + 1 }}
                  >
                    <div
                      className="absolute -top-4 flex h-5 w-14 items-center justify-center rounded-t-lg border hairline border-b-0 bg-navy text-[10px] font-mono text-white/80"
                      style={{ left: `${6 + (i % 3) * 20}%` }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="relative overflow-hidden rounded-xl border hairline bg-paper p-3.5 shadow-[0_16px_32px_-20px_rgba(28,23,64,0.4)]">
                      <span className="font-mono text-xs text-coral">{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="mt-1 font-display text-sm leading-snug">{step.title}</h3>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div>{extra}</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="label-caps text-ink/50">{t.destination.unisKicker}</p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">{t.destination.unisTitle}</h2>
        <ul className="mt-10 grid gap-px border hairline bg-ink/15 sm:grid-cols-2 md:grid-cols-3">
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

      <BoardingPassCta />
    </>
  );
}
