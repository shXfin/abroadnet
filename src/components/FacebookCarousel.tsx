import { useRef } from "react";
import { useLang } from "../i18n";

const PAGE_URL = "https://www.facebook.com/abroadnet25";

/**
 * Facebook reel/video embeds. Add post/video URLs from the page and they render
 * as tall frames in the carousel, e.g.:
 *   "https://www.facebook.com/abroadnet25/videos/1234567890"
 */
const VIDEO_URLS: string[] = [];

function fbVideoEmbed(url: string) {
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&height=560`;
}

function fbPageEmbed() {
  return `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(PAGE_URL)}&tabs=timeline&width=340&height=560&small_header=true&adapt_container_width=false&hide_cover=false&show_facepile=false`;
}

export default function FacebookCarousel() {
  const { t } = useLang();
  const scroller = useRef<HTMLDivElement>(null);

  function scrollBy(direction: 1 | -1) {
    scroller.current?.scrollBy({ left: direction * 372, behavior: "smooth" });
  }

  return (
    <section className="border-y hairline bg-parchment/40 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="label-caps text-coral">{t.moments.kicker}</p>
            <h2 className="mt-3 max-w-xl font-display text-4xl md:text-5xl">{t.moments.title}</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/60">{t.moments.sub}</p>
          </div>
          <div className="hidden shrink-0 items-center gap-3 md:flex">
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

        <div ref={scroller} className="mt-10 flex snap-x snap-mandatory gap-8 overflow-x-auto pb-4">
          {/* Live page timeline in a tall frame */}
          <div className="shrink-0 snap-start">
            <iframe
              src={fbPageEmbed()}
              title="Abroad Net on Facebook"
              width={340}
              height={560}
              className="border hairline bg-white"
              style={{ overflow: "hidden" }}
              allow="encrypted-media"
            />
          </div>

          {VIDEO_URLS.map((url) => (
            <div key={url} className="shrink-0 snap-start">
              <iframe
                src={fbVideoEmbed(url)}
                title="Abroad Net video"
                width={340}
                height={560}
                className="border hairline bg-white"
                allow="encrypted-media"
                allowFullScreen
              />
            </div>
          ))}

          {VIDEO_URLS.length === 0 &&
            [1, 2].map((i) => (
              <a
                key={i}
                href={PAGE_URL}
                target="_blank"
                rel="noreferrer"
                className="flex h-[560px] w-[340px] shrink-0 snap-start flex-col justify-between border hairline bg-paper p-7 transition-colors hover:border-coral"
              >
                <span className="font-mono text-xs text-ink/30">REEL 0{i}</span>
                <div>
                  <p className="font-display text-2xl text-ink/60">{t.moments.follow}</p>
                  <p className="mt-2 text-xs text-ink/40">facebook.com/abroadnet25</p>
                </div>
              </a>
            ))}
        </div>
      </div>
    </section>
  );
}
