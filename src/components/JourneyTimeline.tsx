import { useRef } from "react";
import { useLang } from "../i18n";

const CASCADE_DELAY_MS = 130;

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
 * affordance) — nothing implies a circle is a button. Tapping one lights
 * up every step after it in a staggered cascade, like a lit fuse running
 * down the line — a quiet fidget, not a feature; there's no hidden info
 * behind it. Same remove/reflow/add restart trick as assessmentJump's
 * flash, so the same circle can be tapped again mid-cascade.
 */
export default function JourneyTimeline() {
  const { t } = useLang();
  const steps = t.why.steps;
  const circleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function pulse(el: HTMLSpanElement | null) {
    if (!el) return;
    el.classList.remove("step-tap");
    void el.offsetWidth;
    el.classList.add("step-tap");
  }

  function handleTap(startIndex: number) {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    for (let i = startIndex; i < steps.length; i++) {
      const delay = (i - startIndex) * CASCADE_DELAY_MS;
      timers.current.push(setTimeout(() => pulse(circleRefs.current[i]), delay));
    }
  }

  return (
    <>
      <p className="label-caps text-ink/50">{t.why.kicker}</p>
      <h2 className="mt-3 max-w-2xl font-display text-4xl md:text-5xl">{t.why.title}</h2>

      {/* Below sm: a single horizontally-scrolling strip (number + title
          chips, no description) — a swipeable row rather than a tall
          stack. At sm+ it switches to the card grid, each with its own
          copy underneath. */}
      <div className="scrollbar-hide -mx-6 mt-8 flex gap-3 overflow-x-auto px-6 pb-2 sm:mx-0 sm:mt-14 sm:grid sm:grid-cols-4 sm:gap-x-6 sm:gap-y-10 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-7 lg:gap-x-3">
        {steps.map((step, i) => (
          <div
            key={step.label}
            className="relative flex shrink-0 items-center gap-2 rounded-full border hairline bg-paper py-2 pl-2 pr-4 sm:block sm:shrink sm:gap-0 sm:rounded-none sm:border-none sm:bg-transparent sm:py-0 sm:pl-0 sm:pr-0"
          >
            <div className="flex items-center">
              <span
                ref={(el) => (circleRefs.current[i] = el)}
                onClick={() => handleTap(i)}
                className="z-10 flex h-7 w-7 shrink-0 select-none items-center justify-center rounded-full border-2 border-navy/25 bg-paper font-mono text-xs font-bold text-navy"
              >
                {i + 1}
              </span>
              <span className={`hidden h-[2px] flex-1 bg-navy/15 lg:block ${i === steps.length - 1 ? "opacity-0" : ""}`} />
            </div>
            <p className="whitespace-nowrap font-display text-base text-navy sm:mt-4 sm:whitespace-normal sm:text-lg">
              {step.label}
            </p>
            <p className="hidden max-w-[180px] text-xs leading-relaxed text-ink/60 sm:mt-2 sm:block">{step.copy}</p>
          </div>
        ))}
      </div>
    </>
  );
}
