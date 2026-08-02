import { useLang } from "../i18n";
import { assetPath } from "../lib/assetPath";
import { buildWhatsAppUrl } from "../lib/whatsapp";
import WhatsAppIcon from "../components/icons/WhatsAppIcon";

const WHATSAPP_MESSAGE =
  "Hi, I'd like to register for the Cambridge Linguaskill test through Abroad Net's Englishology partnership.";

function CheckIcon({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4.5 10.5 8 14l7.5-8" />
    </svg>
  );
}

export default function Linguaskill() {
  const { t } = useLang();
  const l = t.linguaskill;
  const whatsappUrl = buildWhatsAppUrl(WHATSAPP_MESSAGE);

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-20">
        <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-center">
          <div>
            <p className="label-caps text-coral">{l.kicker}</p>
            <h1 className="mt-4 font-display text-5xl tracking-tight md:text-7xl">{l.title}</h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/70">{l.intro}</p>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-whatsapp mt-6">
              <WhatsAppIcon className="h-5 w-5" />
              {l.whatsappButton}
            </a>
          </div>
          <div className="overflow-hidden rounded-2xl border hairline">
            <img src={assetPath("photos/englishology-partnership-signing.jpg")} alt="Abroad Net × Englishology partnership" className="block h-auto w-full" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <p className="label-caps text-coral">{l.vsKicker}</p>
        <h2 className="mt-3 font-display text-3xl md:text-4xl">{l.vsTitle}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {l.vsPoints.map((point) => (
            <div key={point.title} className="rounded-2xl border hairline bg-paper p-6">
              <p className="font-display text-lg text-navy">{point.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{point.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y hairline bg-parchment/40 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2">
          <div>
            <p className="label-caps text-ink/50">{l.whyKicker}</p>
            <ul className="mt-6 space-y-2.5">
              {l.whyList.map((item) => (
                <li key={item} className="flex items-center gap-3 rounded-xl border hairline bg-paper px-4 py-3.5 text-sm text-ink/70">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-coral/10 text-coral">
                    <CheckIcon />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label-caps text-ink/50">{l.whyUsKicker}</p>
            <ul className="mt-6 space-y-2.5">
              {l.whyUsList.map((item) => (
                <li key={item} className="flex items-center gap-3 rounded-xl border hairline bg-paper px-4 py-3.5 text-sm text-ink/70">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-coral/10 text-coral">
                    <CheckIcon />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-center">
          <div>
            <p className="label-caps text-ink/50">{l.broaderKicker}</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">{l.broaderTitle}</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/60">{l.broaderCopy}</p>
          </div>
          <div className="flex items-center justify-center rounded-2xl border hairline bg-paper p-10">
            <img src={assetPath("photos/englishology-logo.png")} alt="Englishology" className="max-h-16 w-auto" />
          </div>
        </div>
      </section>

      <section className="border-y hairline bg-navy py-20">
        <div className="mx-auto max-w-2xl px-6">
          <div className="rounded-2xl border hairline bg-paper p-8 text-center shadow-[0_30px_60px_-20px_rgba(28,23,64,0.5)] md:p-12">
            <p className="label-caps text-coral">{l.formKicker}</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">{l.whatsappTitle}</h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink/60">{l.whatsappBody}</p>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-whatsapp mx-auto mt-8">
              <WhatsAppIcon className="h-5 w-5" />
              {l.whatsappButton}
            </a>
            <p className="mt-8 text-xs leading-relaxed text-ink/40">{l.footerNote}</p>
          </div>
        </div>
      </section>
    </>
  );
}
