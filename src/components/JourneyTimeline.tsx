import { useLang } from "../i18n";

/**
 * The whole "how this works" block: one heading covers both the step
 * breakdown and the destination grid that follows it (rendered by the
 * parent, Home.tsx), so the two never read as separate sections.
 *
 * Numbered-circle-and-line layout, reflowing into a wrapping grid instead
 * of forcing a single row — the original's `overflow-x-auto` meant a
 * horizontal scroll on anything narrower than ~900px, which is most
 * phones. The connecting line only renders at the lg breakpoint, where all
 * 7 steps genuinely sit in one row; below that they wrap and a line only
 * makes sense within a row.
 *
 * Every circle is identical (no highlighted "step 1", no hover/cursor
 * affordance) — nothing here implies you're mid-journey or that a circle
 * is a button. Tapping one is a quiet fidget, not a feature: it replays a
 * quick scale/glow (.step-tap in index.css), discoverable by curiosity
 * rather than advertised. Same remove/reflow/add restart trick as
 * assessmentJump's flash, so repeat taps on the same circle still play.
 */
function handleTap(e: React.MouseEvent<HTMLSpanElement>) {
  const el = e.currentTarget;
  el.classList.remove("step-tap");
  void el.offsetWidth;
  el.classList.add("step-tap");
}

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
                onClick={handleTap}
                className="z-10 flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-full border-2 border-navy/25 bg-paper font-mono text-xs font-bold text-navy"
              >
                {i + 1}
              </span>
              <span className={`hidden h-[2px] flex-1 bg-navy/15 lg:block ${i === steps.length - 1 ? "opacity-0" : ""}`} />
            </div>
            <p className="mt-4 font-display text-lg text-navy">{step.label}</p>
            <p className="mt-2 max-w-[180px] text-xs leading-relaxed text-ink/60">{step.copy}</p>
          </div>
        ))}
      </div>
    </>
  );
}
