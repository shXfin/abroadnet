import { hasSubmitted } from "./submissionGuards";

type LeadIdentity = {
  email: string;
  phone: string;
};

type DuplicateCheckResult = "duplicate" | "unique" | "unknown";

const CHECK_TIMEOUT_MS = 8000;

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function canUseJsonp(endpoint: string) {
  return Boolean(endpoint) && isBrowser();
}

export async function checkLeadDuplicate(endpoint: string, identity: LeadIdentity): Promise<DuplicateCheckResult> {
  if (hasSubmitted(identity)) return "duplicate";
  if (!canUseJsonp(endpoint)) return "unknown";

  return new Promise((resolve) => {
    const callbackName = `__abroadnetLeadCheck_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement("script");
    const timer = window.setTimeout(() => finish("unknown"), CHECK_TIMEOUT_MS);

    function finish(result: DuplicateCheckResult) {
      window.clearTimeout(timer);
      script.remove();
      delete (window as typeof window & Record<string, unknown>)[callbackName];
      resolve(result);
    }

    (window as typeof window & Record<string, (payload?: { status?: string }) => void>)[callbackName] = (payload) => {
      finish(payload?.status === "duplicate" ? "duplicate" : "unique");
    };

    const url = new URL(endpoint);
    url.searchParams.set("action", "checkDuplicate");
    url.searchParams.set("email", identity.email);
    url.searchParams.set("phone", identity.phone);
    url.searchParams.set("callback", callbackName);

    script.onerror = () => finish("unknown");
    script.src = url.toString();
    document.head.appendChild(script);
  });
}
