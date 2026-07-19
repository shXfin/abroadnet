import { useLang } from "../i18n";

/**
 * Horizontal step timeline: consult, document, fly, arrive, receive, study,
 * after-help. Scrolls horizontally on small screens, lays flat on desktop.
 */
export default function JourneyTimeline() {
  const { t } = useLang();

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <p className="label-caps text-ink/50">{t.why.kicker}</p>
      <h2 className="mt-3 max-w-2xl font-display text-4xl md:text-5xl">{t.why.title}</h2>

      <div className="relative mt-14 overflow-x-auto pb-4">
        <div className="flex min-w-[900px] gap-0 md:min-w-0">
          {t.why.steps.map((step, i) => (
            <div key={step.label} className="relative flex-1 px-3 first:pl-0 last:pr-0">
              <div className="flex items-center">
                <span
                  className={`z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${
                    i === 0 ? "bg-navy text-white" : "border-2 border-navy/30 bg-paper text-navy"
                  }`}
                >
                  {i + 1}
                </span>
                <span
                  className={`h-[2px] flex-1 ${i === t.why.steps.length - 1 ? "opacity-0" : "bg-navy/20"}`}
                />
              </div>
              <p className="mt-4 font-display text-lg">{step.label}</p>
              <p className="mt-2 max-w-[160px] text-xs leading-relaxed text-ink/60">{step.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
