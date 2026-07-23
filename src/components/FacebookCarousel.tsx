import { useEffect, useRef } from "react";
import { useLang } from "../i18n";

/**
 * Facebook reel/video embeds. Add post/video URLs from the page and they render
 * as tall frames in the carousel, e.g.:
 *   "https://www.facebook.com/abroadnet25/videos/1234567890"
 */
const VIDEO_URLS: string[] = [
  "https://www.facebook.com/reel/1513538156853389",
  "https://www.facebook.com/reel/1243813271069198",
  "https://www.facebook.com/reel/1029349623150062",
];

// Reels are vertical (9:16) — pass matching width/height to the plugin itself
// so Facebook renders the player natively instead of letterboxing it inside a
// mismatched box.
const REEL_WIDTH = 315;
const REEL_HEIGHT = 560;

function fbVideoEmbed(url: string) {
  // Browsers only allow autoplay when muted, so autoplay implies mute here.
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=${REEL_WIDTH}&height=${REEL_HEIGHT}&autoplay=true&mute=true`;
}

export default function FacebookCarousel() {
  const { t } = useLang();
  const scroller = useRef<HTMLDivElement>(null);

  function scrollBy(direction: 1 | -1) {
    scroller.current?.scrollBy({ left: direction * 372, behavior: "smooth" });
  }

  // A one-time nudge on mobile: shift the row a little and settle back, so it
  // reads as scrollable at a glance instead of looking like a single fixed card.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    if (window.matchMedia("(min-width: 768px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setTimeout(() => {
      el.scrollBy({ left: 90, behavior: "smooth" });
      window.setTimeout(() => el.scrollBy({ left: -90, behavior: "smooth" }), 500);
    }, 700);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="border-y hairline bg-parchment/40 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div>
            <p className="label-caps text-coral">{t.moments.kicker}</p>
            <h2 className="mt-3 max-w-xl font-display text-4xl md:text-5xl">{t.moments.title}</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/60">{t.moments.sub}</p>
          </div>
          <div className="flex shrink-0 items-center gap-3 self-end sm:self-auto">
            <button
              onClick={() => scrollBy(-1)}
              className="flex h-11 w-11 items-center justify-center border hairline text-lg transition-colors hover:border-coral hover:text-coral"
              aria-label="Previous"
            >
              ←
            </button>
            <button
              onClick={() => scrollBy(1)}
              className="flex h-11 w-11 items-center justify-center border hairline text-lg transition-colors hover:border-coral hover:text-coral"
              aria-label="Next"
            >
              →
            </button>
          </div>
        </div>

        <div ref={scroller} className="scrollbar-hide mt-10 flex snap-x snap-mandatory gap-8 overflow-x-auto pb-4">
          {VIDEO_URLS.map((url) => (
            <div key={url} className="shrink-0 snap-start">
              <iframe
                src={fbVideoEmbed(url)}
                title="Abroad Net video"
                width={REEL_WIDTH}
                height={REEL_HEIGHT}
                className="border hairline bg-white"
                allow="encrypted-media"
                allowFullScreen
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
