import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../i18n";
import { getApprovedReviews } from "../lib/reviewApi";

const ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT ?? "";

/** Compact social proof next to the assessment CTA. Tapping it jumps down
 * to the reviews section on this same page, rather than away to /feedback
 * — "drop a review" lives as its own button there instead. Renders nothing
 * until real approved reviews exist, since a placeholder average would
 * undercut the exact thing this is meant to build (trust). */
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

  if (!stats) return null;

  return (
    <Link to="/#reviews" className="mt-4 flex items-center gap-2 text-sm hover:opacity-70">
      <span className="text-coral" aria-hidden="true">
        {"★".repeat(Math.round(stats.avg))}
        <span className="text-ink/15">{"★".repeat(5 - Math.round(stats.avg))}</span>
      </span>
      <span className="font-semibold text-navy">{stats.avg.toFixed(1)}</span>
      <span className="text-ink/50 underline decoration-ink/20 underline-offset-4">
        · {stats.count} {t.review.heroTeaserLabel}
      </span>
    </Link>
  );
}
