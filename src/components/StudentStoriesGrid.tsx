import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../i18n";
import { assetPath } from "../lib/assetPath";
import { computeJustifiedRows } from "../lib/justifiedRows";

const FB_URL = "https://www.facebook.com/abroadnet25/";
const GAP = 16;

// Rakibul's photo lives in the pull-quote itself (it's a native 1:1 square,
// so a square slot shows the whole thing, no crop) rather than in the wall.
const QUOTE_PHOTO = "photos/georgia-visa-rakibul-full.jpg";

type Item = {
  photo: string;
  aspect: number; // natural width / height — used to lay out without cropping
  title: string;
  destination: string;
  highlight?: boolean; // shown in the homepage's compact preview
};

// Real moments from the consultancy's own Facebook feed, used at their
// natural aspect ratio (never cropped).
const ITEMS: Item[] = [
  { photo: "photos/malaysia-arrival-imran-full.jpg", aspect: 1, title: "Imran Hossain Shanto", destination: "Malaysia", highlight: true },
  { photo: "photos/romania-visa-mehedi.jpg", aspect: 820 / 850, title: "Mehedi Hasan Supto", destination: "Romania", highlight: true },
  { photo: "photos/airport-pickup.jpg", aspect: 1044 / 950, title: "Airport pickup", destination: "Malaysia", highlight: true },
  { photo: "photos/malaysia-arrival-ruhel-full.jpg", aspect: 1, title: "Md Ruhel Miah", destination: "Malaysia" },
  { photo: "photos/malaysia-arrival-duo.jpg", aspect: 1536 / 2048, title: "Arrived in Kuala Lumpur", destination: "Malaysia" },
  { photo: "photos/malaysia-arrival-trio.jpg", aspect: 1080 / 1440, title: "Landed in Malaysia", destination: "Malaysia" },
  { photo: "photos/malaysia-visa-sunny.jpg", aspect: 1550 / 815, title: "Sunny Saleh", destination: "Malaysia" },
];

function useContainerWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => setWidth(entries[0].contentRect.width));
    observer.observe(el);
    setWidth(el.clientWidth);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
}

function MomentCard({ item, width, height }: { item: Item; width: number; height: number }) {
  const [failed, setFailed] = useState(false);

  return (
    <figure className="overflow-hidden rounded-2xl border hairline bg-paper" style={{ width }}>
      {failed ? (
        <div style={{ width, height }} className="flex items-center justify-center bg-parchment/50">
          <span className="font-mono text-xs text-ink/30">PHOTO PENDING</span>
        </div>
      ) : (
        <img
          src={assetPath(item.photo)}
          alt={item.title}
          width={width}
          height={height}
          className="block"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
      <figcaption className="p-3">
        <p className="truncate text-sm font-semibold text-navy">{item.title}</p>
        <p className="text-xs text-ink/50">{item.destination}</p>
      </figcaption>
    </figure>
  );
}

function JustifiedWall({ items, targetHeight }: { items: Item[]; targetHeight: number }) {
  const [containerRef, width] = useContainerWidth();
  const rows = computeJustifiedRows(items, width, targetHeight, GAP);

  return (
    <div ref={containerRef}>
      <div className="flex flex-col" style={{ gap: GAP }}>
        {rows.map((row, i) => (
          <div key={i} className="flex" style={{ gap: GAP }}>
            {row.items.map((item) => (
              <MomentCard key={item.photo} item={item} width={item.aspect * row.height} height={row.height} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** A compact, fixed-height row of real thumbnails (not stretched to fill
 * width like the main wall) — a "peek" so the see-more card doesn't read
 * as an empty box. Each thumbnail keeps its full natural aspect ratio. */
function PeekStrip({ items }: { items: Item[] }) {
  const [failedSet, setFailedSet] = useState<Set<string>>(new Set());
  const height = 68;

  return (
    <div className="flex gap-2 overflow-hidden">
      {items.map((item) => {
        const failed = failedSet.has(item.photo);
        return (
          <div
            key={item.photo}
            className="shrink-0 overflow-hidden rounded-lg border hairline bg-paper"
            style={{ width: failed ? height : item.aspect * height, height }}
          >
            {failed ? (
              <div className="h-full w-full bg-parchment/50" />
            ) : (
              <img
                src={assetPath(item.photo)}
                alt=""
                height={height}
                className="block h-full"
                loading="lazy"
                onError={() => setFailedSet((s) => new Set(s).add(item.photo))}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Proof wall: a photo-backed pull-quote (Rakibul's real, uncropped square
 * photo alongside his words), then more real feed moments laid out in
 * justified rows (Flickr-style: uniformly scaled per row, never cropped,
 * never leaving a ragged gap the way CSS-column masonry does).
 * - Homepage (`full=false`): quote + 3 highlights + a "see more" card with
 *   a peek strip, linking to the full students page.
 * - Students page (`full`): every moment + a link out to Facebook. */
export default function StudentStoriesGrid({ full = false }: { full?: boolean }) {
  const { t } = useLang();
  const items = full ? ITEMS : ITEMS.filter((i) => i.highlight);
  const peekItems = ITEMS.filter((i) => !i.highlight);

  return (
    <div>
      {/* Pull quote, held by Rakibul's own (uncropped, native square) photo */}
      <figure className="grid gap-8 overflow-hidden rounded-2xl bg-navy text-white md:grid-cols-[280px_1fr] md:items-center">
        <img
          src={assetPath(QUOTE_PHOTO)}
          alt="Md Rakibul Islam"
          className="block w-full"
        />
        <div className="p-8 pt-0 md:p-12 md:pl-0">
          <span className="font-display text-5xl leading-none text-coral">"</span>
          <blockquote className="-mt-3 font-display text-2xl leading-snug md:text-3xl">
            {t.spotlight.quote}
          </blockquote>
          <figcaption className="mt-5 text-sm text-white/55">{t.students.quoteAttrib}</figcaption>
        </div>
      </figure>

      <div className="mt-8">
        <JustifiedWall items={items} targetHeight={full ? 230 : 300} />
      </div>

      {full ? (
        /* Many more → Facebook (students page only) */
        <div className="mt-4 flex flex-col items-start justify-between gap-6 rounded-2xl border-2 border-coral/30 bg-coral/5 p-8 md:flex-row md:items-center md:p-10">
          <div>
            <h3 className="font-display text-2xl md:text-3xl">{t.students.moreTitle}</h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/60">{t.students.moreSub}</p>
          </div>
          <a href={FB_URL} target="_blank" rel="noreferrer" className="btn-primary shrink-0">
            {t.students.moreCta} →
          </a>
        </div>
      ) : (
        /* See more → students page (homepage only), with a peek of what's there */
        <div className="mt-4 rounded-2xl border-2 border-navy/15 bg-navy/[0.03] p-8 md:p-10">
          <PeekStrip items={peekItems} />
          <div className="mt-6 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h3 className="font-display text-2xl md:text-3xl">{t.students.seeMoreTitle}</h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/60">{t.students.seeMoreSub}</p>
            </div>
            <Link to="/success-stories" className="btn-primary shrink-0">
              {t.students.seeMore} →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
