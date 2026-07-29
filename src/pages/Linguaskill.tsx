import { useState } from "react";
import { useLang } from "../i18n";
import { assetPath } from "../lib/assetPath";
import { checkLeadDuplicate } from "../lib/leadChecks";
import { combineCountryCode, hasSubmitted, rememberSubmission } from "../lib/submissionGuards";

const FORM_ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT ?? "";

export default function Linguaskill() {
  const { t, lang } = useLang();
  const l = t.linguaskill;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    testDate: "",
    destination: "",
    purpose: "",
  });
  const [countryCode, setCountryCode] = useState("+880");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "duplicate" | "error">("idle");

  const canSubmit = Boolean(form.name && form.email && form.phone);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || status === "submitting") return;

    const email = form.email.trim().toLowerCase();
    const phone = combineCountryCode(countryCode, form.phone.trim());

    if (hasSubmitted({ email, phone })) {
      setStatus("duplicate");
      return;
    }

    setStatus("submitting");
    const duplicateStatus = await checkLeadDuplicate(FORM_ENDPOINT, { email, phone });
    if (duplicateStatus === "duplicate") {
      rememberSubmission({ email, phone });
      setStatus("duplicate");
      return;
    }

    if (!FORM_ENDPOINT) {
      setStatus("error");
      return;
    }

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({
          formType: "linguaskill",
          source: "website-linguaskill",
          language: lang,
          name: form.name.trim(),
          email,
          phone,
          destination: form.destination.trim(),
          notes: `Preferred test date: ${form.testDate.trim() || "n/a"}; Purpose: ${form.purpose.trim() || "n/a"}`,
        }),
      });
      if (!res.ok) throw new Error("bad status");
      rememberSubmission({ email, phone });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-20">
        <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-center">
          <div>
            <p className="label-caps text-coral">{l.kicker}</p>
            <h1 className="mt-4 font-display text-5xl tracking-tight md:text-7xl">{l.title}</h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/70">{l.intro}</p>
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
            <div className="mt-6 divide-y hairline border-y hairline">
              {l.whyList.map((item) => (
                <div key={item} className="flex items-center gap-3 bg-paper py-3.5 text-sm text-ink/70">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-coral/10 text-xs text-coral">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="label-caps text-ink/50">{l.whyUsKicker}</p>
            <div className="mt-6 divide-y hairline border-y hairline">
              {l.whyUsList.map((item) => (
                <div key={item} className="flex items-center gap-3 bg-paper py-3.5 text-sm text-ink/70">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-coral/10 text-xs text-coral">✓</span>
                  {item}
                </div>
              ))}
            </div>
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
          <div className="rounded-2xl border hairline bg-paper p-8 shadow-[0_30px_60px_-20px_rgba(28,23,64,0.5)] md:p-12">
            <p className="label-caps text-coral">{l.formKicker}</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">{l.formTitle}</h2>

            {status === "done" ? (
              <div className="mt-8 rounded-xl border hairline bg-parchment/40 p-8">
                <p className="font-display text-2xl">{l.successTitle}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{l.successCopy}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                {status === "duplicate" && (
                  <p className="rounded-lg bg-parchment/60 p-3 text-sm text-ink/70">{l.duplicateNote}</p>
                )}
                {status === "error" && (
                  <p className="rounded-lg bg-parchment/60 p-3 text-sm text-ink/70">{l.errorNote}</p>
                )}
                <div>
                  <label className="label-caps text-ink/50">{l.formName} *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder={l.formNamePh}
                    autoComplete="name"
                    className="mt-1 w-full border-0 border-b-2 hairline bg-transparent py-2.5 text-lg font-semibold placeholder:text-ink/30 focus:border-coral focus:outline-none"
                  />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="label-caps text-ink/50">{l.formEmail} *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="you@email.com"
                      autoComplete="email"
                      className="mt-1 w-full border-0 border-b-2 hairline bg-transparent py-2.5 text-lg font-semibold placeholder:text-ink/30 focus:border-coral focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="label-caps text-ink/50">{l.formPhone} *</label>
                    <div className="mt-1 grid grid-cols-[90px_1fr] gap-3">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        autoComplete="tel-country-code"
                        className="border-0 border-b-2 hairline bg-transparent py-2.5 text-lg font-semibold focus:border-coral focus:outline-none"
                      >
                        <option value="+880">+880</option>
                        <option value="+60">+60</option>
                        <option value="+40">+40</option>
                        <option value="+995">+995</option>
                        <option value="+86">+86</option>
                      </select>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        placeholder="1712345678"
                        autoComplete="tel-national"
                        className="border-0 border-b-2 hairline bg-transparent py-2.5 text-lg font-semibold placeholder:text-ink/30 focus:border-coral focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="label-caps text-ink/50">{l.formTestDate}</label>
                    <input
                      type="date"
                      value={form.testDate}
                      onChange={(e) => setForm((f) => ({ ...f, testDate: e.target.value }))}
                      className="mt-1 w-full border-0 border-b-2 hairline bg-transparent py-2.5 text-lg font-semibold focus:border-coral focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="label-caps text-ink/50">{l.formDestination}</label>
                    <input
                      value={form.destination}
                      onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))}
                      placeholder={l.formDestinationPh}
                      className="mt-1 w-full border-0 border-b-2 hairline bg-transparent py-2.5 text-lg font-semibold placeholder:text-ink/30 focus:border-coral focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="label-caps text-ink/50">{l.formPurpose}</label>
                  <input
                    value={form.purpose}
                    onChange={(e) => setForm((f) => ({ ...f, purpose: e.target.value }))}
                    placeholder={l.formPurposePh}
                    className="mt-1 w-full border-0 border-b-2 hairline bg-transparent py-2.5 text-lg font-semibold placeholder:text-ink/30 focus:border-coral focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!canSubmit || status === "submitting"}
                  className="mt-4 w-full rounded-full bg-coral px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-navy disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {status === "submitting" ? l.submitting : l.submit}
                </button>
              </form>
            )}

            <p className="mt-8 text-xs leading-relaxed text-ink/40">{l.footerNote}</p>
          </div>
        </div>
      </section>
    </>
  );
}
