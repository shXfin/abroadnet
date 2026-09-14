import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useLang } from "../i18n";
import { checkReviewStatus, submitReview, type ReviewStatus } from "../lib/reviewApi";
import { buildWhatsAppUrl } from "../lib/whatsapp";
import { handleAssessmentLinkClick } from "../lib/assessmentJump";

const ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT ?? "";

type Stage = "lookup" | "checking" | ReviewStatus | "submitted";

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          className={`text-4xl leading-none transition-transform hover:scale-110 ${n <= value ? "text-coral" : "text-ink/15"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function Feedback() {
  const { t } = useLang();
  const [stage, setStage] = useState<Stage>("lookup");
  const [identity, setIdentity] = useState("");
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [consent, setConsent] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const isEmail = identity.includes("@");

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    if (!identity.trim()) return;
    setStage("checking");
    const result = await checkReviewStatus(ENDPOINT, {
      email: isEmail ? identity.trim() : "",
      phone: isEmail ? "" : identity.trim(),
    });
    setName(result.name || "");
    setStage(result.status);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating) return;
    setSubmitting(true);
    await submitReview(ENDPOINT, {
      name,
      email: isEmail ? identity.trim() : "",
      phone: isEmail ? "" : identity.trim(),
      rating,
      comment,
      consentToShow: consent,
    });
    setSubmitting(false);
    setStage("submitted");
  }

  const whatsappMessage = t.review.callPendingWhatsappMessage.replace("{name}", name || "");

  return (
    <section className="mx-auto max-w-xl px-6 py-20">
      <Helmet>
        <title>{t.review.pageTitle} — Abroad Net</title>
      </Helmet>

      <p className="label-caps text-coral">{t.review.wallKicker}</p>
      <h1 className="mt-3 font-display text-4xl">{t.review.pageTitle}</h1>
      <p className="mt-4 text-sm leading-relaxed text-ink/60">{t.review.pageSub}</p>

      <div className="mt-10 rounded-2xl border hairline bg-white p-6">
        {stage === "lookup" || stage === "checking" ? (
          <form onSubmit={handleCheck} className="space-y-4">
            <label className="block">
              <span className="label-caps text-ink/50">{t.review.lookupLabel}</span>
              <input
                type="text"
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                placeholder={t.review.lookupPlaceholder}
                className="mt-2 w-full rounded-xl border hairline px-4 py-3 text-sm outline-none focus:border-coral"
                required
              />
            </label>
            <button type="submit" disabled={stage === "checking"} className="btn-primary w-full disabled:opacity-60">
              {stage === "checking" ? t.review.checking : t.review.lookupButton}
            </button>
          </form>
        ) : null}

        {stage === "not_found" && (
          <div className="space-y-5">
            <p className="text-sm text-ink/70">{t.review.notFound}</p>
            <Link
              to="/#assessment"
              onClick={handleAssessmentLinkClick}
              className="btn-primary inline-flex"
            >
              {t.review.notFoundCta}
            </Link>
            <button onClick={() => setStage("lookup")} className="block label-caps text-coral hover:opacity-70">
              ← {t.review.lookupButton}
            </button>
          </div>
        )}

        {stage === "unknown" && (
          <div className="space-y-4">
            <p className="text-sm text-ink/70">{t.review.notFound}</p>
            <button onClick={() => setStage("lookup")} className="label-caps text-coral hover:opacity-70">
              ← {t.review.lookupButton}
            </button>
          </div>
        )}

        {stage === "call_pending" && (
          <div className="space-y-5">
            <p className="text-sm leading-relaxed text-ink/70">
              {t.review.callPending.replace("{name}", name || "")}
            </p>
            <a
              href={buildWhatsAppUrl(whatsappMessage)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              {t.review.callPendingWhatsapp}
            </a>
          </div>
        )}

        {stage === "already_reviewed" && <p className="text-sm text-ink/70">{t.review.alreadyReviewed}</p>}

        {stage === "eligible" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <p className="label-caps text-ink/50">{t.review.ratingLabel}</p>
              <div className="mt-3">
                <StarPicker value={rating} onChange={setRating} />
              </div>
            </div>
            <label className="block">
              <span className="label-caps text-ink/50">{t.review.commentLabel}</span>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t.review.commentPlaceholder}
                rows={4}
                className="mt-2 w-full rounded-xl border hairline px-4 py-3 text-sm outline-none focus:border-coral"
              />
            </label>
            <label className="flex items-start gap-3 text-sm text-ink/70">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-coral"
              />
              {t.review.consentLabel}
            </label>
            <button type="submit" disabled={!rating || submitting} className="btn-primary w-full disabled:opacity-60">
              {submitting ? t.review.submitting : t.review.submit}
            </button>
          </form>
        )}

        {stage === "submitted" && <p className="text-sm font-semibold text-navy">{t.review.submitted}</p>}
      </div>

      <Link to="/" className="mt-8 inline-block text-sm font-semibold text-ink/50 hover:text-coral">
        ← Abroad Net
      </Link>
    </section>
  );
}
