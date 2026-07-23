import { Link } from "react-router-dom";
import { useLang } from "../i18n";

/** Boarding-pass styled call-to-action for the free 1-on-1 session. */
export default function BoardingPassCta() {
  const { t } = useLang();

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="flex flex-col overflow-hidden rounded-xl bg-navy text-white shadow-[0_30px_60px_-30px_rgba(28,23,64,0.5)] md:flex-row">
        <div className="flex-1 p-10 md:p-14">
          <p className="label-caps text-coral">{t.pass.kicker}</p>
          <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
            {t.pass.titleA}
            <br />
            <em className="text-coral">{t.pass.titleB}</em>
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/60">{t.pass.sub}</p>
          <Link
            to="/#assessment"
            className="mt-8 inline-flex items-center gap-2 bg-coral px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-navy"
          >
            {t.pass.cta} →
          </Link>
        </div>

        <div className="relative hidden w-72 shrink-0 border-l border-dashed border-white/30 p-10 md:block">
          <span className="absolute -top-3 left-0 h-6 w-6 -translate-x-1/2 rounded-full bg-paper" />
          <span className="absolute -bottom-3 left-0 h-6 w-6 -translate-x-1/2 rounded-full bg-paper" />
          <div className="flex h-full flex-col justify-between text-sm">
            <div>
              <p className="label-caps text-white/40">{t.pass.passenger}</p>
              <p className="mt-1 font-display text-xl">{t.pass.passengerName}</p>
            </div>
            <div>
              <p className="label-caps text-white/40">{t.pass.fromTo}</p>
              <p className="mt-1 font-semibold">{t.pass.homeCampus}</p>
            </div>
            <div>
              <p className="label-caps text-white/40">{t.pass.duration}</p>
              <p className="mt-1 font-semibold">{t.pass.durationValue}</p>
            </div>
            <p className="font-mono text-xs tracking-widest text-white/40">ABN-2026-∙∙∙∙</p>
          </div>
        </div>
      </div>
    </section>
  );
}
