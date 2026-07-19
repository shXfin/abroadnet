import { useState, type FormEvent } from "react";
import { useLang } from "../i18n";

// TODO: replace with the real Formspree form ID (or Airtable webhook) once created.
const FORM_ENDPOINT = "https://formspree.io/f/REPLACE_ME";

const inputClass =
  "w-full border-0 border-b hairline bg-transparent px-0 py-3 font-display text-xl placeholder:text-ink/30 focus:border-coral focus:outline-none focus:ring-0";

export default function Apply() {
  const { t } = useLang();
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(e.currentTarget),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <p className="label-caps text-coral">{t.apply.doneKicker}</p>
        <h1 className="mt-4 font-display text-4xl">{t.apply.doneTitle}</h1>
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

      <form onSubmit={handleSubmit} className="mt-12 space-y-8">
        <div>
          <label htmlFor="fullName" className="label-caps text-ink/50">
            {t.apply.fullName}
          </label>
          <input
            id="fullName"
            name="fullName"
            required
            placeholder={t.apply.fullNamePh}
            className={inputClass}
          />
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="label-caps text-ink/50">
              {t.apply.email}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@email.com"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="phone" className="label-caps text-ink/50">
              {t.apply.phone}
            </label>
            <input id="phone" name="phone" required placeholder="+880..." className={inputClass} />
          </div>
        </div>
        <div>
          <label htmlFor="destination" className="label-caps text-ink/50">
            {t.apply.destination}
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
        {status === "error" && <p className="text-sm text-coral">{t.apply.error}</p>}
      </form>
    </div>
  );
}
