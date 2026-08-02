import { useLang } from "../i18n";

/**
 * The whole "how this works" block: one heading covers both the step
 * breakdown and the destination grid that follows it (rendered by the
 * parent, Home.tsx), so the two never read as separate sections.
 *
 * Same numbered-circle-and-line idea as the original, but reflowing into a
 * wrapping grid instead of forcing a single row — the original's
 * `overflow-x-auto` meant a horizontal scroll on anything narrower than
 * ~900px, which is most phones. The connecting line only renders at the lg
 * breakpoint, where all 7 steps genuinely sit in one row; below that they
 * wrap onto multiple rows and a line only makes sense within a row.
 */
export default function JourneyTimeline() {
  const { t } = useLang();
  const steps = t.why.steps;

  return (
    <>
      <p className="label-caps text-ink/50">{t.why.kicker}</p>
      <h2 className="mt-3 max-w-2xl font-display text-4xl md:text-5xl">{t.why.title}</h2>

      <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:grid-cols-7 lg:gap-x-3">
        {steps.map((step, i) => (
          <div key={step.label} className="relative">
            <div className="flex items-center">
              <span
                className={`z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${
                  i === 0 ? "bg-coral text-white" : "border-2 border-navy/25 bg-paper text-navy"
                }`}
              >
                {i + 1}
              </span>
              <span
                className={`hidden h-[2px] flex-1 lg:block ${i === steps.length - 1 ? "opacity-0" : "bg-navy/15"}`}
              />
            </div>
            <p className="mt-4 font-display text-lg text-navy">{step.label}</p>
            <p className="mt-2 max-w-[180px] text-xs leading-relaxed text-ink/60">{step.copy}</p>
          </div>
        ))}
      </div>
    </>
  );
}
