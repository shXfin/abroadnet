import { useEffect, useState } from "react";
import { useLang } from "../i18n";
import { getApprovedReviews, type ApprovedReview } from "../lib/reviewApi";

const ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT ?? "";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="text-coral" aria-hidden="true">
      {"★".repeat(rating)}
      <span className="text-ink/15">{"★".repeat(5 - rating)}</span>
    </div>
  );
}

/** Only renders once real approved reviews come back — an empty state here
 * would just be a section-shaped hole on the homepage. */
export default function ReviewsWall() {
  const { t } = useLang();
  const [reviews, setReviews] = useState<ApprovedReview[]>([]);

  useEffect(() => {
    let cancelled = false;
    getApprovedReviews(ENDPOINT).then((result) => {
      if (!cancelled) setReviews(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <p className="label-caps text-coral">{t.review.wallKicker}</p>
      <h2 className="mt-3 font-display text-3xl md:text-4xl">{t.review.wallTitle}</h2>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review, i) => (
          <div key={i} className="rounded-2xl border hairline bg-white p-6">
            <Stars rating={review.rating} />
            {review.comment && <p className="mt-4 text-sm leading-relaxed text-ink/70">{review.comment}</p>}
            <p className="mt-4 text-sm font-semibold text-navy">{review.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
