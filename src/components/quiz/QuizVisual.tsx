import { useEffect, useRef, useState } from "react";
import AbroadMark from "../AbroadMark";
import { useLang } from "../../i18n";

/**
 * Side panel for the assessment: a looping explainer of how the assessment
 * works (answers, shortlist, a real counselor, WhatsApp). It is type-led
 * SVG with built-in timing, generated per language and per country so the
 * shortlist it shows is always one the quiz really produces. Desktop only
 * (the panel is hidden on phones), so the SVGs load lazily and never cost
 * a mobile visitor anything.
 */
const VARIANTS = ["my", "ro", "it", "cn"] as const;
const LOOP_SECONDS = 12.4;
const FONT_HREF = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@700;800&display=swap";

const loaders: Record<string, () => Promise<{ default: string }>> = {
  "en-my": () => import("../../assets/explainer/explainer-en-my.svg?raw"),
  "en-ro": () => import("../../assets/explainer/explainer-en-ro.svg?raw"),
  "en-it": () => import("../../assets/explainer/explainer-en-it.svg?raw"),
  "en-cn": () => import("../../assets/explainer/explainer-en-cn.svg?raw"),
  "bn-my": () => import("../../assets/explainer/explainer-bn-my.svg?raw"),
  "bn-ro": () => import("../../assets/explainer/explainer-bn-ro.svg?raw"),
  "bn-it": () => import("../../assets/explainer/explainer-bn-it.svg?raw"),
  "bn-cn": () => import("../../assets/explainer/explainer-bn-cn.svg?raw"),
};

function ExplainerLoop() {
  const { lang } = useLang();
  const [index, setIndex] = useState(0);
  const [markup, setMarkup] = useState<string | null>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const advancedRef = useRef(false);

  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_HREF}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONT_HREF;
    document.head.appendChild(link);
  }, []);

  useEffect(() => setIndex(0), [lang]);

  useEffect(() => {
    let cancelled = false;
    loaders[`${lang}-${VARIANTS[index]}`]().then((m) => {
      if (!cancelled) setMarkup(m.default);
    });
    loaders[`${lang}-${VARIANTS[(index + 1) % VARIANTS.length]}`]();
    return () => {
      cancelled = true;
    };
  }, [lang, index]);

  useEffect(() => {
    const host = hostRef.current;
    const svg = host?.querySelector("svg");
    if (!host || !svg) return;
    advancedRef.current = false;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      svg.pauseAnimations();
      svg.setCurrentTime(6.2);
      return;
    }

    let visible = true;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) svg.unpauseAnimations();
      else svg.pauseAnimations();
    });
    observer.observe(host);

    const timer = window.setInterval(() => {
      if (visible && !advancedRef.current && svg.getCurrentTime() >= LOOP_SECONDS - 0.2) {
        advancedRef.current = true;
        setIndex((i) => (i + 1) % VARIANTS.length);
      }
    }, 200);

    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, [markup]);

  if (!markup) return null;
  return (
    <div
      ref={hostRef}
      className="absolute inset-0 [&>svg]:h-full [&>svg]:w-full"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}

export default function QuizVisual({ stage = "default" }: { stage?: "default" | "sending" | "done" }) {
  const { t } = useLang();
  const caption = stage === "sending" ? t.quiz.titleSending : stage === "done" ? t.quiz.titleDone : t.quiz.title;

  return (
    <div className="relative hidden h-full min-h-[420px] flex-col justify-between overflow-hidden rounded-2xl bg-navy p-8 text-white md:flex">
      <div className="relative flex items-center gap-2">
        <AbroadMark className="w-9" slabColor="#FFFFFF" />
        <span className="text-lg font-extrabold">abroad</span>
      </div>

      <div className="relative -mx-8 min-h-[340px] flex-1">
        <ExplainerLoop />
      </div>

      <p className="relative max-w-[220px] text-2xl font-bold leading-snug">{caption}</p>
    </div>
  );
}
