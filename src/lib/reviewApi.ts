const CHECK_TIMEOUT_MS = 8000;

export type ReviewStatus = "not_found" | "call_pending" | "already_reviewed" | "eligible" | "unknown";

type StatusResult = { status: ReviewStatus; name?: string };

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

/** Same JSONP idiom as leadChecks.ts — the Apps Script endpoint only speaks
 * JSONP for GET, so a plain fetch can't read the response. */
function jsonp<T>(endpoint: string, params: Record<string, string>, fallback: T): Promise<T> {
  if (!endpoint || !isBrowser()) return Promise.resolve(fallback);

  return new Promise((resolve) => {
    const callbackName = `__abroadnetReviewApi_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement("script");
    const timer = window.setTimeout(() => finish(fallback), CHECK_TIMEOUT_MS);

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

export async function getApprovedReviews(endpoint: string): Promise<ApprovedReview[]> {
  const result = await jsonp<{ ok?: boolean; reviews?: ApprovedReview[] }>(
    endpoint,
    { action: "getApprovedReviews" },
    {}
  );
  return result.reviews ?? [];
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
