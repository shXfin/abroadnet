import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../i18n";
import { getApprovedReviews, type ApprovedReview } from "../lib/reviewApi";
import { handleAssessmentLinkClick } from "../lib/assessmentJump";

const ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT ?? "";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="text-coral" aria-hidden="true">
      {"★".repeat(rating)}
      <span className="text-ink/15">{"★".repeat(5 - rating)}</span>
    </div>
  );
}

/** Renders a skeleton while the (often slow) Apps Script fetch is in
 * flight, so the section reserves its real height instead of popping in
 * and shoving everything below it down. Collapses to nothing only once we
 * actually know there's nothing to show. */
export default function ReviewsWall() {
  const { t } = useLang();
  const [reviews, setReviews] = useState<ApprovedReview[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    getApprovedReviews(ENDPOINT).then((result) => {
      if (!cancelled) setReviews(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (reviews === null) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-20" aria-hidden="true">
        <div className="h-4 w-40 animate-pulse rounded bg-ink/10" />
        <div className="mt-3 h-9 w-96 max-w-full animate-pulse rounded bg-ink/10" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl border hairline bg-ink/5" />
          ))}
        </div>
      </section>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="label-caps text-coral">{t.review.wallKicker}</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl md:text-4xl">{t.review.wallTitle}</h2>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Link
            to="/#assessment"
            onClick={handleAssessmentLinkClick}
            className="label-caps flex items-center gap-2 rounded-full border-2 border-navy/15 px-5 py-2.5 text-navy transition-colors hover:border-navy/30"
          >
            {t.review.notFoundCta}
          </Link>
          <Link to="/feedback" className="btn-primary">
            {t.review.dropYourReview}
          </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review, i) => (
          <div key={i} className="rounded-2xl border hairline bg-white p-6">
            <Stars rating={review.rating} />
            {review.comment && (
              <p className="mt-4 text-base font-semibold leading-relaxed text-navy">{review.comment}</p>
            )}
            <p className="mt-4 text-sm text-ink/50">{review.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
