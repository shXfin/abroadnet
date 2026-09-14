import { useEffect, useState } from "react";
import { useLang } from "../i18n";
import { getApprovedReviews } from "../lib/reviewApi";

const ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT ?? "";

/** Compact social proof next to the assessment CTA. Renders nothing until
 * real approved reviews exist — a placeholder average would undercut the
 * exact thing this is meant to build (trust). */
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
    <div className="mt-4 flex items-center gap-2 text-sm">
      <span className="text-coral" aria-hidden="true">
        {"★".repeat(Math.round(stats.avg))}
        <span className="text-ink/15">{"★".repeat(5 - Math.round(stats.avg))}</span>
      </span>
      <span className="font-semibold text-navy">{stats.avg.toFixed(1)}</span>
      <span className="text-ink/50">
        · {stats.count} {t.review.heroTeaserLabel}
      </span>
    </div>
  );
}
