const CHECK_TIMEOUT_MS = 8000;
// Apps Script cold-starts can genuinely take longer than that — give the
// reviews fetch specifically more room before giving up.
const REVIEWS_TIMEOUT_MS = 20000;

export type ReviewStatus = "not_found" | "call_pending" | "already_reviewed" | "eligible" | "unknown";

type StatusResult = { status: ReviewStatus; name?: string };

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

/** Firing a slow request while the page is still loading keeps the browser
 * tab's loading spinner alive until it settles — bad for perceived speed
 * and for how crawlers read page-load state. Deferring it past the page's
 * own load event keeps this fetch from ever counting toward that. */
function afterPageLoad(): Promise<void> {
  if (!isBrowser()) return Promise.resolve();
  if (document.readyState === "complete") return Promise.resolve();
  return new Promise((resolve) => window.addEventListener("load", () => resolve(), { once: true }));
}

/** Same JSONP idiom as leadChecks.ts — the Apps Script endpoint only speaks
 * JSONP for GET, so a plain fetch can't read the response. */
function jsonp<T>(endpoint: string, params: Record<string, string>, fallback: T, timeoutMs = CHECK_TIMEOUT_MS): Promise<T> {
  if (!endpoint || !isBrowser()) return Promise.resolve(fallback);

  return new Promise((resolve) => {
    const callbackName = `__abroadnetReviewApi_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement("script");
    const timer = window.setTimeout(() => finish(fallback), timeoutMs);

    function finish(result: T) {
      window.clearTimeout(timer);
      script.remove();
      delete (window as typeof window & Record<string, unknown>)[callbackName];
      resolve(result);
    }

    (window as typeof window & Record<string, (payload?: T) => void>)[callbackName] = (payload) => {
      finish(payload ?? fallback);
    };

    const url = new URL(endpoint);
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
    url.searchParams.set("callback", callbackName);

    script.onerror = () => finish(fallback);
    script.src = url.toString();
    document.head.appendChild(script);
  });
}

export async function checkReviewStatus(endpoint: string, identity: { email: string; phone: string }): Promise<StatusResult> {
  const result = await jsonp<{ ok?: boolean; status?: string; name?: string }>(
    endpoint,
    { action: "checkReviewStatus", email: identity.email, phone: identity.phone },
    {}
  );
  if (!result.ok || !result.status) return { status: "unknown" };
  return { status: result.status as ReviewStatus, name: result.name };
}

export type ApprovedReview = { name: string; rating: number; comment: string };

const REVIEWS_CACHE_KEY = "abroadnet-approved-reviews";
let reviewsRequest: Promise<ApprovedReview[]> | null = null;

function readSessionCache(): ApprovedReview[] | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.sessionStorage.getItem(REVIEWS_CACHE_KEY);
    return raw ? (JSON.parse(raw) as ApprovedReview[]) : null;
  } catch {
    return null;
  }
}

function writeSessionCache(reviews: ApprovedReview[]) {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.setItem(REVIEWS_CACHE_KEY, JSON.stringify(reviews));
  } catch {
    // storage unavailable or full — fine, it's just a speed optimization
  }
}

/** Every caller on the page (hero badge, reviews wall) shares one in-flight
 * request instead of each hitting the slow Apps Script endpoint separately,
 * and a session-cached copy renders instantly on a refresh while a fresh
 * fetch quietly updates it underneath. */
function fetchAndCache(endpoint: string): Promise<ApprovedReview[]> {
  if (!reviewsRequest) {
    reviewsRequest = afterPageLoad()
      .then(() =>
        jsonp<{ ok?: boolean; reviews?: ApprovedReview[] }>(
          endpoint,
          { action: "getApprovedReviews" },
          {},
          REVIEWS_TIMEOUT_MS
        )
      )
      .then((result) => {
        // Only a genuine response gets cached — a timeout/error fallback
        // (no "ok") must never be mistaken for "confirmed zero reviews".
        if (result.ok) writeSessionCache(result.reviews ?? []);
        return result.reviews ?? [];
      })
      .finally(() => {
        reviewsRequest = null;
      });
  }
  return reviewsRequest;
}

export function getApprovedReviews(endpoint: string): Promise<ApprovedReview[]> {
  const cached = readSessionCache();
  if (cached) {
    // Stale-while-revalidate: this reload gets the instant cached copy,
    // and a quiet background refresh keeps the cache fresh for the next one.
    fetchAndCache(endpoint);
    return Promise.resolve(cached);
  }
  return fetchAndCache(endpoint);
}

export async function submitReview(
  endpoint: string,
  payload: { name: string; email: string; phone: string; rating: number; comment: string; consentToShow: boolean }
) {
  if (!endpoint || !isBrowser()) return;
  await fetch(endpoint, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "submitReview", ...payload }),
  });
}
