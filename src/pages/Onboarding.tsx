import { useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../i18n";
import { quizSteps } from "../data/quizSteps";
import {
  MALAYSIA_UNIVERSITIES,
  ROMANIA_UNIVERSITIES,
  GEORGIA_UNIVERSITIES,
  CHINA_UNIVERSITIES,
} from "../data/universities";
import QuizVisual from "../components/quiz/QuizVisual";

// TODO: replace with the real Formspree form ID (or Airtable webhook) once created.
const FORM_ENDPOINT = "https://formspree.io/f/REPLACE_ME";

type ContactInfo = { name: string; email: string; phone: string };

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
function localizeNumber(n: number, lang: string) {
  if (lang !== "bn") return String(n);
  return String(n)
    .split("")
    .map((d) => BN_DIGITS[Number(d)] ?? d)
    .join("");
}

function matchedUniversities(destination: string | undefined) {
  if (destination === "malaysia") return { key: "malaysia" as const, list: MALAYSIA_UNIVERSITIES.slice(0, 3) };
  if (destination === "romania") return { key: "romania" as const, list: ROMANIA_UNIVERSITIES.slice(0, 3) };
  if (destination === "georgia") return { key: "georgia" as const, list: GEORGIA_UNIVERSITIES.slice(0, 3) };
  if (destination === "china") return { key: "china" as const, list: CHINA_UNIVERSITIES.slice(0, 3) };
  return {
    key: "both" as const,
    list: [MALAYSIA_UNIVERSITIES[0], ROMANIA_UNIVERSITIES[0], GEORGIA_UNIVERSITIES[0]],
  };
}

export default function Onboarding() {
  const { t, lang } = useLang();
  const steps = quizSteps[lang];
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [contact, setContact] = useState<ContactInfo>({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const step = steps[stepIndex];
  const totalSteps = steps.length;
  const canContinue =
    step.kind === "single"
      ? Boolean(answers[step.id])
      : step.kind === "contact"
        ? Boolean(contact.name && contact.email && contact.phone)
        : true;

  function goBack() {
    setStepIndex((i) => Math.max(0, i - 1));
  }

  async function handleContinue() {
    if (step.kind === "contact") {
      setSubmitting(true);
      setSubmitError(false);
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({ ...answers, ...contact }),
        });
        if (!res.ok) setSubmitError(true);
      } catch {
        setSubmitError(true);
      } finally {
        setSubmitting(false);
      }
    }
    setStepIndex((i) => Math.min(totalSteps - 1, i + 1));
  }

  const match = matchedUniversities(answers.destination);
  const destinationLabelMap = {
    malaysia: t.nav.malaysia,
    romania: t.nav.romania,
    georgia: t.nav.georgia,
    china: t.nav.china,
    both: `${t.nav.malaysia} / ${t.nav.romania} / ${t.nav.georgia}`,
  } as const;
  const destinationLabel = destinationLabelMap[match.key];

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <div className="grid gap-6 md:grid-cols-[280px_1fr]">
        <QuizVisual />

        <div className="rounded-2xl border hairline bg-paper p-6 md:p-8">
          {step.kind !== "summary" && (
            <>
              <div className="flex items-center justify-between">
                <p className="label-caps text-coral">{t.quiz.kicker}</p>
                <p className="text-xs font-semibold text-ink/40">
                  {localizeNumber(stepIndex + 1, lang)} {t.quiz.stepOf} {localizeNumber(totalSteps, lang)}
                </p>
              </div>
              <div className="mt-3 flex gap-1.5">
                {steps.map((s, i) => (
                  <span
                    key={s.id}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      i <= stepIndex ? "bg-navy" : "bg-ink/10"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {step.kind === "single" && (
            <div className="mt-8">
              <h1 className="font-display text-3xl md:text-4xl">{step.question}</h1>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {step.options.map((option) => {
                  const selected = answers[step.id] === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setAnswers((a) => ({ ...a, [step.id]: option.value }))}
                      className={`rounded-xl border-2 px-5 py-4 text-left text-sm font-semibold transition-colors ${
                        selected
                          ? "border-coral bg-coral/10 text-navy"
                          : "border-ink/15 text-ink/80 hover:border-ink/30"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-6 rounded-lg bg-parchment/60 px-4 py-3 text-sm text-ink/60">{step.tip}</p>
            </div>
          )}

          {step.kind === "contact" && (
            <div className="mt-8">
              <h1 className="font-display text-3xl md:text-4xl">{step.question}</h1>
              <div className="mt-8 space-y-5">
                <div>
                  <label className="label-caps text-ink/50">{t.quiz.contactName}</label>
                  <input
                    value={contact.name}
                    onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                    placeholder={t.quiz.contactNamePh}
                    className="mt-1 w-full border-0 border-b-2 hairline bg-transparent py-2.5 text-lg font-semibold placeholder:text-ink/30 focus:border-coral focus:outline-none"
                  />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="label-caps text-ink/50">{t.quiz.contactEmail}</label>
                    <input
                      type="email"
                      value={contact.email}
                      onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                      placeholder="you@email.com"
                      className="mt-1 w-full border-0 border-b-2 hairline bg-transparent py-2.5 text-lg font-semibold placeholder:text-ink/30 focus:border-coral focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="label-caps text-ink/50">{t.quiz.contactPhone}</label>
                    <input
                      value={contact.phone}
                      onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                      placeholder="+880..."
                      className="mt-1 w-full border-0 border-b-2 hairline bg-transparent py-2.5 text-lg font-semibold placeholder:text-ink/30 focus:border-coral focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              <p className="mt-6 rounded-lg bg-parchment/60 px-4 py-3 text-sm text-ink/60">{step.tip}</p>
              {submitError && <p className="mt-3 text-sm text-coral">{t.quiz.contactError}</p>}
            </div>
          )}

          {step.kind === "summary" && (
            <div>
              <p className="label-caps text-coral">{t.quiz.resultsKicker}</p>
              <h1 className="mt-3 font-display text-4xl md:text-5xl">
                {t.quiz.resultsTitle} <em>{destinationLabel}</em>
              </h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/60">{t.quiz.resultsSub}</p>

              <p className="label-caps mt-8 text-ink/50">{t.quiz.resultsUniKicker}</p>
              <ul className="mt-3 grid gap-px border hairline bg-ink/15 sm:grid-cols-3">
                {match.list.map((uni) => (
                  <li key={uni} className="bg-paper p-5 font-display text-lg">
                    {uni}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/book-session" className="btn-primary">
                  {t.quiz.bookSession} →
                </Link>
                <Link to="/apply" className="btn-ghost">
                  {t.quiz.fullApplication}
                </Link>
              </div>
            </div>
          )}

          {step.kind !== "summary" && (
            <div className="mt-10 flex items-center justify-between">
              {stepIndex > 0 ? (
                <button onClick={goBack} className="text-sm font-semibold text-ink/50 hover:text-ink">
                  ← {t.quiz.back}
                </button>
              ) : (
                <span />
              )}
              <button
                onClick={handleContinue}
                disabled={!canContinue || submitting}
                className="btn-primary disabled:opacity-40"
              >
                {step.kind === "contact"
                  ? submitting
                    ? "..."
                    : `${t.quiz.seeMyMatches} →`
                  : `${t.quiz.continue} →`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
