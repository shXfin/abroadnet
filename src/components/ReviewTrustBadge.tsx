import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../i18n";
import { getApprovedReviews } from "../lib/reviewApi";

const ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT ?? "";

/** Compact social proof next to the assessment CTA, plus an always-present
 * way to leave a review. The star summary stays hidden until real approved
 * reviews exist — a placeholder average would undercut the exact thing
 * this is meant to build (trust) — but "drop your review" isn't gated on
 * that, since someone eligible should always be able to find the page. */
export default function ReviewTrustBadge() {
  const { t } = useLang();
  const [stats, setStats] = useState<{ avg: number; count: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    getApprovedReviews(ENDPOINT).then((reviews) => {
      if (cancelled || reviews.length === 0) return;
      const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      setStats({ avg, count: reviews.length });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5">
      {stats && (
        <Link to="/feedback" className="flex items-center gap-2 text-sm hover:opacity-70">
          <span className="text-coral" aria-hidden="true">
            {"★".repeat(Math.round(stats.avg))}
            <span className="text-ink/15">{"★".repeat(5 - Math.round(stats.avg))}</span>
          </span>
          <span className="font-semibold text-navy">{stats.avg.toFixed(1)}</span>
          <span className="text-ink/50">
            · {stats.count} {t.review.heroTeaserLabel}
          </span>
        </Link>
      )}
      <Link
        to="/feedback"
        className="text-sm font-semibold text-coral underline decoration-coral/40 underline-offset-4 hover:decoration-coral"
      >
        {t.review.dropYourReview}
      </Link>
    </div>
  );
}
