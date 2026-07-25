import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../i18n";
import { combineCountryCode, hasSubmitted, rememberSubmission } from "../lib/submissionGuards";

const FORM_ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT ?? "";

const inputClass =
  "w-full border-0 border-b hairline bg-transparent px-0 py-3 font-display text-xl placeholder:text-ink/30 focus:border-coral focus:outline-none focus:ring-0";

export default function Apply() {
  const { t } = useLang();
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error" | "duplicate">("idle");
  const [countryCode, setCountryCode] = useState("+880");
  const [customCountryCode, setCustomCountryCode] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const form = new FormData(e.currentTarget);
      const email = String(form.get("email") || "").trim();
      const activeCountryCode = countryCode === "other" ? customCountryCode.trim() : countryCode;
      const phone = combineCountryCode(activeCountryCode, String(form.get("phone") || "").trim());

      if (hasSubmitted({ email, phone })) {
        setStatus("duplicate");
        return;
      }

      const payload = {
        source: "website-application",
        formType: "application",
        name: String(form.get("fullName") || ""),
        email,
        phone,
        destination: String(form.get("destination") || ""),
        notes: String(form.get("notes") || ""),
      };

      if (!FORM_ENDPOINT) {
        setStatus("error");
        return;
      }

      await fetch(FORM_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      rememberSubmission({ email, phone });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24">
        <div className="rounded-3xl border border-ink/10 bg-white/70 p-8 shadow-[0_30px_80px_-50px_rgba(28,23,64,0.25)] backdrop-blur-sm md:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-coral/30 bg-coral/10 text-2xl text-coral motion-safe:animate-pulse">
            ✓
          </div>
          <div className="mt-8 text-center">
            <p className="label-caps text-coral">{t.apply.doneKicker}</p>
            <h1 className="mt-4 font-display text-4xl md:text-5xl">{t.apply.doneTitle}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink/60">{t.apply.doneSub}</p>
            <div className="mx-auto mt-6 flex w-fit items-center gap-2 text-coral/80">
              <span className="h-2 w-2 rounded-full bg-coral motion-safe:animate-pulse" />
              <span className="h-2 w-8 rounded-full bg-coral/35 motion-safe:animate-pulse [animation-delay:150ms]" />
              <span className="h-2 w-2 rounded-full bg-coral motion-safe:animate-pulse [animation-delay:300ms]" />
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <Link to="/success-stories" className="btn-primary justify-center">
              {t.apply.doneStudents} →
            </Link>
            <a
              href="https://www.facebook.com/abroadnet25/"
              target="_blank"
              rel="noreferrer"
              className="btn-ghost justify-center"
            >
              {t.apply.doneFacebook}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 pb-24 pt-20">
      <p className="label-caps text-coral">{t.apply.kicker}</p>
      <h1 className="mt-4 font-display text-5xl tracking-tight md:text-6xl">
        {t.apply.titleA} <em>{t.apply.titleB}</em>
      </h1>
      <p className="mt-4 text-sm text-ink/60">{t.apply.sub}</p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.28em] text-ink/40">{t.apply.requiredNote}</p>

      <form onSubmit={handleSubmit} className="mt-12 space-y-8">
        <div>
          <label htmlFor="fullName" className="label-caps text-ink/50">
            {t.apply.fullName} *
          </label>
          <input
            id="fullName"
            name="fullName"
            required
            placeholder={t.apply.fullNamePh}
            autoComplete="name"
            className={inputClass}
          />
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="label-caps text-ink/50">
              {t.apply.email} *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@email.com"
              autoComplete="email"
              className={inputClass}
            />
          </div>
          <div>
            <label className="label-caps text-ink/50">
              {t.apply.phone} *
            </label>
            <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
              <div>
                <label htmlFor="phoneCode" className="label-caps text-ink/50">
                  {t.apply.phoneCode}
                </label>
                <select
                  id="phoneCode"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className={inputClass}
                  autoComplete="tel-country-code"
                >
                  <option value="+880">+880</option>
                  <option value="+60">+60</option>
                  <option value="+40">+40</option>
                  <option value="+995">+995</option>
                  <option value="+86">+86</option>
                  <option value="+1">+1</option>
                  <option value="other">Other</option>
                </select>
                {countryCode === "other" && (
                  <input
                    value={customCountryCode}
                    onChange={(e) => setCustomCountryCode(e.target.value)}
                    placeholder="+971"
                    required
                    className={`${inputClass} mt-3`}
                  />
                )}
              </div>
              <div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="1712345678"
                  autoComplete="tel-national"
                  className={inputClass}
                />
                <p className="mt-2 text-xs leading-relaxed text-ink/45">
                  Enter the local number with or without the leading `0`. We’ll normalize it for you.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="destination" className="label-caps text-ink/50">
            {t.apply.destination} *
          </label>
          <select
            id="destination"
            name="destination"
            required
            className={inputClass}
            defaultValue=""
          >
            <option value="" disabled>
              {t.apply.destinationPh}
            </option>
            <option value="malaysia">{t.apply.malaysia}</option>
            <option value="romania">{t.apply.romania}</option>
            <option value="georgia">{t.apply.georgia}</option>
            <option value="china">{t.apply.china}</option>
            <option value="undecided">{t.apply.undecided}</option>
          </select>
        </div>
        <div>
          <label htmlFor="notes" className="label-caps text-ink/50">
            {t.apply.notes}
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            placeholder={t.apply.notesPh}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="btn-primary disabled:opacity-50"
        >
          {status === "submitting" ? t.apply.submitting : `${t.apply.submit} →`}
        </button>
        {status === "duplicate" && <p className="text-sm text-coral">{t.apply.duplicateError}</p>}
        {status === "error" && <p className="text-sm text-coral">{t.apply.error}</p>}
      </form>
    </div>
  );
}
