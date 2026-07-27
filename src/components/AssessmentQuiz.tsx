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
import { checkLeadDuplicate } from "../lib/leadChecks";
import { combineCountryCode, rememberSubmission } from "../lib/submissionGuards";
import QuizVisual from "./quiz/QuizVisual";

const FORM_ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT ?? "";

type ContactInfo = { name: string; email: string; phone: string };
type OtherInfo = { destination: string; field: string };

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

/** The 9-step lead-gen assessment. Embedded inline on the homepage (second
 * section, right under the hero) as well as reachable directly at /onboarding. */
export default function AssessmentQuiz() {
  const { t, lang } = useLang();
  const steps = quizSteps[lang];
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [otherInfo, setOtherInfo] = useState<OtherInfo>({ destination: "", field: "" });
  const [contact, setContact] = useState<ContactInfo>({ name: "", email: "", phone: "" });
  const [countryCode, setCountryCode] = useState("+880");
  const [customCountryCode, setCustomCountryCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [submitErrorMessage, setSubmitErrorMessage] = useState("");

  const step = steps[stepIndex];
  const totalSteps = steps.length;
  const needsOtherDestination = step.kind === "single" && step.id === "destination" && answers.destination === "other";
  const needsOtherField = step.kind === "single" && step.id === "field" && answers.field === "other";
  const canContinue =
    step.kind === "single"
      ? Boolean(
          answers[step.id] &&
            (!needsOtherDestination || otherInfo.destination.trim()) &&
            (!needsOtherField || otherInfo.field.trim()),
        )
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
      setSubmitErrorMessage("");
      try {
        const email = contact.email.trim();
        const activeCountryCode = countryCode === "other" ? customCountryCode.trim() : countryCode;
        const phone = combineCountryCode(activeCountryCode, contact.phone.trim());
        const duplicateStatus = await checkLeadDuplicate(FORM_ENDPOINT, { email, phone });
        if (duplicateStatus === "duplicate") {
          setSubmitError(true);
          setSubmitErrorMessage(t.quiz.duplicateError);
          return;
        }
      } finally {
        setSubmitting(false);
      }
    }
    setStepIndex((i) => Math.min(totalSteps - 1, i + 1));
  }

  async function handleSubmitApplication() {
    setSubmitting(true);
    setSubmitError(false);
    setSubmitErrorMessage("");
    try {
      const email = contact.email.trim();
      const activeCountryCode = countryCode === "other" ? customCountryCode.trim() : countryCode;
      const phone = combineCountryCode(activeCountryCode, contact.phone.trim());

      const duplicateStatus = await checkLeadDuplicate(FORM_ENDPOINT, { email, phone });
      if (duplicateStatus === "duplicate") {
        setSubmitError(true);
        setSubmitErrorMessage(t.quiz.duplicateError);
        return;
      }

      if (!FORM_ENDPOINT) {
        setSubmitError(true);
        setSubmitErrorMessage(t.quiz.contactError);
        return;
      }

      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          source: "website-assessment",
          language: lang,
          ...answers,
          destinationOther: answers.destination === "other" ? otherInfo.destination.trim() : "",
          fieldOther: answers.field === "other" ? otherInfo.field.trim() : "",
          ...contact,
          phone,
        }),
      });

      if (res.type !== "opaque" && !res.ok) {
        setSubmitError(true);
        setSubmitErrorMessage(t.quiz.contactError);
        return;
      }

      rememberSubmission({ email, phone });
      setSubmitted(true);
    } catch {
      setSubmitError(true);
      setSubmitErrorMessage(t.quiz.contactError);
    } finally {
      setSubmitting(false);
    }
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
    <div className="grid gap-6 md:grid-cols-[280px_1fr]">
      <QuizVisual />

      <div id="assessment-card" className="rounded-2xl border hairline bg-paper p-6 md:p-8">
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
            <h2 className="font-display text-3xl md:text-4xl">{step.question}</h2>
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
            {needsOtherDestination && (
              <div className="mt-5">
                <label className="label-caps text-ink/50">{t.quiz.destinationOther}</label>
                <input
                  value={otherInfo.destination}
                  onChange={(e) => setOtherInfo((info) => ({ ...info, destination: e.target.value }))}
                  placeholder={t.quiz.destinationOtherPh}
                  className="mt-1 w-full border-0 border-b-2 hairline bg-transparent py-2.5 text-lg font-semibold placeholder:text-ink/30 focus:border-coral focus:outline-none"
                />
              </div>
            )}
            {needsOtherField && (
              <div className="mt-5">
                <label className="label-caps text-ink/50">{t.quiz.fieldOther}</label>
                <input
                  value={otherInfo.field}
                  onChange={(e) => setOtherInfo((info) => ({ ...info, field: e.target.value }))}
                  placeholder={t.quiz.fieldOtherPh}
                  className="mt-1 w-full border-0 border-b-2 hairline bg-transparent py-2.5 text-lg font-semibold placeholder:text-ink/30 focus:border-coral focus:outline-none"
                />
              </div>
            )}
            <p className="mt-6 rounded-lg bg-parchment/60 px-4 py-3 text-sm text-ink/60">{step.tip}</p>
          </div>
        )}

        {step.kind === "contact" && (
          <div className="mt-8">
            <h2 className="font-display text-3xl md:text-4xl">{step.question}</h2>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.28em] text-ink/40">{t.apply.requiredNote}</p>
            <div className="mt-8 space-y-5">
              <div>
                <label className="label-caps text-ink/50">{t.quiz.contactName} *</label>
                <input
                  value={contact.name}
                  onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                  placeholder={t.quiz.contactNamePh}
                  autoComplete="name"
                  className="mt-1 w-full border-0 border-b-2 hairline bg-transparent py-2.5 text-lg font-semibold placeholder:text-ink/30 focus:border-coral focus:outline-none"
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="label-caps text-ink/50">{t.quiz.contactEmail} *</label>
                  <input
                    type="email"
                    value={contact.email}
                    onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                    placeholder="you@email.com"
                    autoComplete="email"
                    className="mt-1 w-full border-0 border-b-2 hairline bg-transparent py-2.5 text-lg font-semibold placeholder:text-ink/30 focus:border-coral focus:outline-none"
                  />
                </div>
                <div>
                  <label className="label-caps text-ink/50">{t.quiz.contactPhone} *</label>
                  <div className="mt-1 grid gap-3 sm:grid-cols-[120px_1fr]">
                    <div>
                      <label className="label-caps text-ink/50">{t.quiz.phoneCode}</label>
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        autoComplete="tel-country-code"
                        className="w-full border-0 border-b-2 hairline bg-transparent py-2.5 text-lg font-semibold focus:border-coral focus:outline-none"
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
                          className="mt-3 w-full border-0 border-b-2 hairline bg-transparent py-2.5 text-lg font-semibold placeholder:text-ink/30 focus:border-coral focus:outline-none"
                        />
                      )}
                    </div>
                    <div>
                      <input
                        type="tel"
                        value={contact.phone}
                        onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                        placeholder="1712345678"
                        autoComplete="tel-national"
                        className="mt-1 w-full border-0 border-b-2 hairline bg-transparent py-2.5 text-lg font-semibold placeholder:text-ink/30 focus:border-coral focus:outline-none"
                      />
                      <p className="mt-2 text-xs leading-relaxed text-ink/45">
                        Enter the local number with or without the leading `0`. We’ll normalize it for you.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-6 rounded-lg bg-parchment/60 px-4 py-3 text-sm text-ink/60">{step.tip}</p>
            {submitError && <p className="mt-3 text-sm text-coral">{submitErrorMessage || t.quiz.contactError}</p>}
          </div>
        )}

        {step.kind === "summary" && submitted && (
          <div className="py-2 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-coral/30 bg-coral/10 text-2xl text-coral motion-safe:animate-pulse">
              ✓
            </div>
            <p className="label-caps mt-8 text-coral">{t.apply.doneKicker}</p>
            <h2 className="mx-auto mt-4 max-w-xl font-display text-4xl md:text-5xl">{t.apply.doneTitle}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink/60">{t.apply.doneSub}</p>
            <div className="mx-auto mt-6 flex w-fit items-center gap-2 text-coral/80">
              <span className="h-2 w-2 rounded-full bg-coral motion-safe:animate-pulse" />
              <span className="h-2 w-8 rounded-full bg-coral/35 motion-safe:animate-pulse [animation-delay:150ms]" />
              <span className="h-2 w-2 rounded-full bg-coral motion-safe:animate-pulse [animation-delay:300ms]" />
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link to="/success-stories" className="btn-primary">
                {t.apply.doneStudents} →
              </Link>
              <a
                href="https://www.facebook.com/abroadnet25/"
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
              >
                {t.apply.doneFacebook}
              </a>
            </div>
          </div>
        )}

        {step.kind === "summary" && !submitted && (
          <div>
            <p className="label-caps text-coral">{t.quiz.resultsKicker}</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">
              {t.quiz.resultsTitle} <em>{destinationLabel}</em>
            </h2>
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
              <button type="button" onClick={handleSubmitApplication} disabled={submitting} className="btn-primary disabled:opacity-40">
                {submitting ? t.apply.submitting : `${t.quiz.submitApplication} →`}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubmitError(false);
                  setSubmitErrorMessage("");
                  setStepIndex(0);
                }}
                className="btn-ghost"
              >
                {t.quiz.editAnswers}
              </button>
            </div>
            {submitError && <p className="mt-3 text-sm text-coral">{submitErrorMessage || t.quiz.contactError}</p>}
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
  );
}
