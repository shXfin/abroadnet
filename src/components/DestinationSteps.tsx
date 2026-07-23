import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import BoardingPassCta from "./BoardingPassCta";
import { useLang } from "../i18n";
import { assetPath } from "../lib/assetPath";

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

          <ol className="mt-14">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="grid gap-4 border-t hairline py-8 md:grid-cols-[100px_320px_1fr] md:gap-10"
              >
                <span className="font-mono text-sm text-coral">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display text-2xl md:text-3xl">{step.title}</h3>
                <p className="max-w-md text-sm leading-relaxed text-ink/60 md:pt-2">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {extra}

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
