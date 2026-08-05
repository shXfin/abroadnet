import { useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../i18n";
import { quizSteps } from "../data/quizSteps";
import {
  MALAYSIA_UNIVERSITIES,
  ROMANIA_UNIVERSITIES,
  GEORGIA_UNIVERSITIES,
  CHINA_UNIVERSITIES,
  ITALY_UNIVERSITIES,
} from "../data/universities";
import { checkLeadDuplicate } from "../lib/leadChecks";
import { combineCountryCode, rememberSubmission } from "../lib/submissionGuards";
import { buildWhatsAppUrl } from "../lib/whatsapp";
import WhatsAppIcon from "./icons/WhatsAppIcon";
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

function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`animate-spin ${className}`} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// Placeholder entries (e.g. Georgia's still-TODO seats) must never reach a
// student's screen — filter them out rather than showing "TODO: ...".
function realOnly(list: string[]) {
  return list.filter((name) => !name.startsWith("TODO"));
}

/** Keyed strictly by the destination the student actually picked — a match
 * list from an unrelated country is worse than no list at all. "other" (or
 * any destination without curated partners) is marked unavailable instead
 * of silently substituting a different country's universities. */
function matchedUniversities(destination: string | undefined) {
  const byDestination: Record<string, { key: string; source: string[] }> = {
    malaysia: { key: "malaysia", source: MALAYSIA_UNIVERSITIES },
    romania: { key: "romania", source: ROMANIA_UNIVERSITIES },
    georgia: { key: "georgia", source: GEORGIA_UNIVERSITIES },
    china: { key: "china", source: CHINA_UNIVERSITIES },
    italy: { key: "italy", source: ITALY_UNIVERSITIES },
  };
  const match = destination ? byDestination[destination] : undefined;
  const list = match ? realOnly(match.source).slice(0, 3) : [];
  return { key: (match?.key ?? "other") as string, list, unavailable: list.length === 0 };
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
  const [waUrl, setWaUrl] = useState("");

  function answerLabel(stepId: string, value: string | undefined) {
    if (!value) return "";
    const found = steps.find((s) => s.id === stepId);
    if (!found || found.kind !== "single") return value;
    return found.options.find((o) => o.value === value)?.label ?? value;
  }

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

  // A single click on "Show my matches" now does everything: dup-check,
  // save the lead to Sheets, build the WhatsApp message, and advance to the
  // results screen — the student no longer has to click a second button
  // just to get their data actually recorded. The old flow only saved to
  // Sheets on a *second* "Continue on WhatsApp" click, so anyone who saw
  // their matches and left never made it into the sheet at all.
  //
  // A student reported feeling like tapping "Show my matches" jumped
  // straight to a new page with no duplicate check happening first. The
  // check genuinely does run before the Sheets write either way — but real
  // browsers only allow window.open() to succeed when it's called
  // synchronously inside the click itself; delay it past even one `await`
  // (to run the dup-check first) and Chrome silently blocks it as an
  // unrequested popup. That's a hard constraint, not a preference — tried
  // reordering it once already and broke the auto-open entirely. So the
  // WhatsApp tab still opens immediately, but its own loading screen now
  // says "Checking your details..." to be honest about what's actually
  // happening in that first moment, instead of implying nothing is.
  async function handleContinue() {
    if (step.kind !== "contact") {
      setStepIndex((i) => Math.min(totalSteps - 1, i + 1));
      return;
    }

    setSubmitting(true);
    setSubmitError(false);
    setSubmitErrorMessage("");

    // Opened synchronously, still inside the click's user-activation window,
    // so the browser won't treat it as an unrequested popup once we redirect
    // it below — after the `await`s past this point, window.open() on its
    // own would get silently blocked. It briefly shows a blank tab otherwise,
    // which reads as broken and tempts people to close it before the Sheet
    // write even finishes, so it gets a loading page immediately.
    const waWindow = window.open("", "_blank");
    if (waWindow) {
      // This is a completely separate raw document, not part of the built
      // app, so it doesn't inherit the app's own <html lang>, fonts, or
      // viewport meta tag. Without the viewport tag mobile browsers render
      // it at desktop width and shrink it down. Without lang="bn" and a
      // Bengali-capable font in the stack, Bengali text can fall back to a
      // font with no Bengali glyphs and render as boxes. Both fixed here,
      // plus a manual way back in case the WhatsApp redirect is slow or
      // silently blocked, so nobody's stuck looking at a spinner forever.
      const siteUrl = window.location.origin;
      waWindow.document.write(`<!doctype html><html lang="${lang}"><head><meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Abroad Net</title>
        <style>
          html,body{height:100%;margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans Bengali",Roboto,sans-serif;background:#F5F1EA;color:#1C1740;}
          .wrap{min-height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:32px 24px;}
          .spinner{width:44px;height:44px;border-radius:50%;border:3px solid rgba(28,23,64,0.15);border-top-color:#FF6B4A;animation:spin 0.8s linear infinite;margin-bottom:24px;}
          @keyframes spin{to{transform:rotate(360deg)}}
          h1{font-size:22px;margin:0 0 12px;line-height:1.3;}
          p{font-size:15px;line-height:1.5;color:rgba(28,23,64,0.65);max-width:340px;margin:0;}
          a.back{margin-top:28px;font-size:14px;font-weight:600;color:#1C1740;text-decoration:none;border-bottom:1px solid rgba(28,23,64,0.3);padding-bottom:2px;}
        </style>
        </head><body><div class="wrap">
          <div class="spinner"></div>
          <h1>${t.apply.whatsappPreparingTitle}</h1>
          <p>${t.apply.whatsappPreparingBody}</p>
          <a class="back" href="${siteUrl}">${t.apply.whatsappBackToSite}</a>
        </div></body></html>`);
      waWindow.document.close();
    }

    try {
      const email = contact.email.trim();
      const activeCountryCode = countryCode === "other" ? customCountryCode.trim() : countryCode;
      const phone = combineCountryCode(activeCountryCode, contact.phone.trim());

      const duplicateStatus = await checkLeadDuplicate(FORM_ENDPOINT, { email, phone });
      if (duplicateStatus === "duplicate") {
        waWindow?.close();
        setSubmitError(true);
        setSubmitErrorMessage(t.quiz.duplicateError);
        return;
      }

      if (!FORM_ENDPOINT) {
        waWindow?.close();
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
        waWindow?.close();
        setSubmitError(true);
        setSubmitErrorMessage(t.quiz.contactError);
        return;
      }

      rememberSubmission({ email, phone });

      const destination =
        answers.destination === "other" ? otherInfo.destination.trim() : answerLabel("destination", answers.destination);
      const field = answers.field === "other" ? otherInfo.field.trim() : answerLabel("field", answers.field);
      const message = [
        `Hi, I just completed the free assessment on abroadnetedu.com.`,
        `Name: ${contact.name.trim()}`,
        `Destination: ${destination}`,
        `Level: ${answerLabel("level", answers.level)}`,
        `Field: ${field}`,
        `Budget: ${answerLabel("budget", answers.budget)}`,
        `Intake: ${answerLabel("intake", answers.intake)}`,
        `Email: ${email}`,
      ]
        .filter((line) => !line.endsWith(": "))
        .join("\n");
      const url = buildWhatsAppUrl(message);
      setWaUrl(url);

      // Redirected immediately, not after a delay — Chrome blocks a
      // window.open()'d tab's navigation outright once it decides too much
      // time has passed since the click, so "wait a bit so they see the
      // results first" isn't a safe option here (confirmed: it broke the
      // auto-open, showing "Pop-ups blocked" instead). The results below
      // still render on this same page and stay there — switching back to
      // this tab always shows them, whenever the student does it.
      if (waWindow) {
        waWindow.location.href = url;
      }

      setSubmitted(true);
      setStepIndex((i) => Math.min(totalSteps - 1, i + 1));
    } catch {
      setSubmitError(true);
      setSubmitErrorMessage(t.quiz.contactError);
    } finally {
      setSubmitting(false);
    }
  }

  // Fallback only: re-opens the same WhatsApp message without re-submitting
  // to Sheets (that already happened in handleContinue above), for anyone
  // whose auto-opened tab got closed or blocked.
  function reopenWhatsApp() {
    if (waUrl) window.open(waUrl, "_blank");
  }

  const match = matchedUniversities(answers.destination);
  const destinationLabelMap: Record<string, string> = {
    malaysia: t.nav.malaysia,
    romania: t.nav.romania,
    georgia: t.nav.georgia,
    china: t.nav.china,
    italy: t.nav.italy,
  };
  const destinationLabel =
    answers.destination === "other"
      ? otherInfo.destination.trim() || answerLabel("destination", answers.destination)
      : destinationLabelMap[match.key] ?? answerLabel("destination", answers.destination);

  const isSending = step.kind === "contact" && submitting;
  const visualStage = isSending ? "sending" : step.kind === "summary" && submitted ? "done" : "default";

  return (
    <div className="grid gap-6 md:grid-cols-[280px_1fr]">
      <QuizVisual stage={visualStage} />

      <div id="assessment-card" className="rounded-2xl border hairline bg-paper p-6 md:p-8">
        {step.kind !== "summary" && !isSending && (
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

        {isSending && (
          <div className="flex min-h-[320px] flex-col items-center justify-center py-10 text-center">
            <Spinner className="h-10 w-10 text-coral" />
            <h2 className="mt-6 max-w-xs font-display text-2xl md:text-3xl">{t.quiz.sendingTitle}</h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink/60">{t.quiz.sendingBody}</p>
          </div>
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
            {step.id === "english" && (
              <Link
                to="/linguaskill"
                className="mt-3 flex items-center gap-2 rounded-lg border hairline bg-paper px-4 py-3 text-sm font-semibold text-coral transition-colors hover:border-coral"
              >
                {t.quiz.linguaskillNudge}
                <span>→</span>
              </Link>
            )}
          </div>
        )}

        {step.kind === "contact" && !isSending && (
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

        {/* One results screen, shown only once the lead is already saved and
            WhatsApp already opened (handleContinue does both before we ever
            land here) — no second "did you mean to submit?" click required. */}
        {step.kind === "summary" && submitted && (
          <div>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-coral/30 bg-coral/10 text-xl text-coral">
                ✓
              </div>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-coral">{t.quiz.sentConfirmation}</p>
            </div>

            <p className="label-caps mt-10 text-coral">{t.quiz.resultsKicker}</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">
              {t.quiz.resultsTitle} <em>{destinationLabel}</em>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/60">{t.quiz.resultsSub}</p>

            <p className="label-caps mt-8 text-ink/50">{t.quiz.resultsUniKicker}</p>
            {match.unavailable ? (
              <p className="mt-3 max-w-md rounded-lg bg-parchment/60 px-4 py-3 text-sm leading-relaxed text-ink/60">
                {t.quiz.resultsUniUnavailable}
              </p>
            ) : (
              <ul className="mt-3 grid gap-px border hairline bg-ink/15 sm:grid-cols-3">
                {match.list.map((uni) => (
                  <li key={uni} className="bg-paper p-5 font-display text-lg">
                    {uni}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8 flex flex-wrap gap-4">
              <button type="button" onClick={reopenWhatsApp} className="btn-whatsapp">
                <WhatsAppIcon className="h-5 w-5" />
                {t.quiz.reopenWhatsApp}
              </button>
              <Link to="/success-stories" className="btn-ghost">
                {t.apply.doneStudents} →
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSubmitError(false);
                  setSubmitErrorMessage("");
                  setSubmitted(false);
                  setStepIndex(0);
                }}
                className="btn-ghost"
              >
                {t.quiz.editAnswers}
              </button>
            </div>
          </div>
        )}

        {step.kind !== "summary" && !isSending && (
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
              className="btn-primary inline-flex items-center gap-2 disabled:opacity-70"
            >
              {step.kind === "contact" ? (
                `${t.quiz.seeMyMatches} →`
              ) : (
                `${t.quiz.continue} →`
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
