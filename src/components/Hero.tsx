import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AbroadMark from "./AbroadMark";
import AssessmentQuiz from "./AssessmentQuiz";
import { useLang } from "../i18n";
import { assetPath } from "../lib/assetPath";
import { MALAYSIA_UNIVERSITIES, ROMANIA_UNIVERSITIES, GEORGIA_UNIVERSITIES, CHINA_UNIVERSITIES } from "../data/universities";

const HOME_POS = { left: "14%", top: "81%" };

// Real students, placed in the map's empty gaps — never force-cropped, each
// sized by its own aspect ratio. Ribbon labels are real facts already
// established elsewhere on the site (StudentStoriesGrid), not invented —
// there's no China photo here because we have no confirmed China placement yet.
const STUDENT_PHOTOS = [
  {
    src: "photos/malaysia-arrival-imran-full.jpg",
    aspect: 1,
    pos: { left: "23%", top: "40%" },
    title: "Imran Hossain Shanto",
    destination: "Malaysia",
  },
  {
    src: "photos/romania-visa-mehedi.jpg",
    aspect: 820 / 850,
    pos: { left: "52%", top: "38%" },
    title: "Mehedi Hasan Supto",
    destination: "Romania",
  },
  {
    src: "photos/georgia-visa-rakibul-full.jpg",
    aspect: 1,
    pos: { left: "62%", top: "82%" },
    title: "Md Rakibul Islam",
    destination: "Georgia",
  },
];
// A percentage of the container's own width, not a fixed pixel size, so
// cards shrink proportionally on mobile instead of overwhelming a narrow view.
const PHOTO_WIDTH_PCT = 15;

function realCount(list: string[]) {
  return list.filter((u) => !u.startsWith("TODO")).length;
}

function splitLabel(label: string) {
  const [code, country] = label.split(" · ");
  return { code, country };
}

function CheckBadge({ className }: { className?: string }) {
  return (
    <span className={`flex items-center justify-center rounded-full bg-emerald-600 text-white ${className}`}>
      <svg viewBox="0 0 20 20" className="h-2.5 w-2.5" fill="currentColor" aria-hidden="true">
        <path d="M8 13.4 4.8 10.2l-1.4 1.4L8 16.2l9-9-1.4-1.4z" />
      </svg>
    </span>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M5 5l10 10M15 5 5 15" />
    </svg>
  );
}

const FLAGS: Record<string, JSX.Element> = {
  tbs: (
    <svg viewBox="0 0 30 20" className="h-3.5 w-5 rounded-[2px] border border-black/10">
      <rect width="30" height="20" fill="white" />
      <rect x="12" width="6" height="20" fill="#FF0000" />
      <rect y="7" width="30" height="6" fill="#FF0000" />
      <path d="M5 2.5h2v5H5z M3.5 4h5v2h-5z M23 2.5h2v5h-2z M21.5 4h5v2h-5z M5 12.5h2v5H5z M3.5 14h5v2h-5z M23 12.5h2v5h-2z M21.5 14h5v2h-5z" fill="#FF0000" />
    </svg>
  ),
  otp: (
    <svg viewBox="0 0 30 20" className="h-3.5 w-5 rounded-[2px] border border-black/10">
      <rect width="10" height="20" x="0" fill="#002B7F" />
      <rect width="10" height="20" x="10" fill="#FCD116" />
      <rect width="10" height="20" x="20" fill="#CE1126" />
    </svg>
  ),
  pek: (
    <svg viewBox="0 0 30 20" className="h-3.5 w-5 rounded-[2px]">
      <rect width="30" height="20" fill="#DE2910" />
      <text x="3" y="10" fontSize="9" fill="#FFDE00">★</text>
    </svg>
  ),
  kul: (
    <svg viewBox="0 0 28 14" className="h-3.5 w-5 rounded-[2px] border border-black/10">
      <rect width="28" height="14" fill="white" />
      <rect width="28" height="2" fill="#CC0001" />
      <rect y="4" width="28" height="2" fill="#CC0001" />
      <rect y="8" width="28" height="2" fill="#CC0001" />
      <rect y="12" width="28" height="2" fill="#CC0001" />
      <rect width="14" height="8" fill="#010066" />
    </svg>
  ),
  dhk: (
    <svg viewBox="0 0 20 12" className="h-3.5 w-5 rounded-[2px]">
      <rect width="20" height="12" fill="#006A4E" />
      <circle cx="9" cy="6" r="4.2" fill="#F42A41" />
    </svg>
  ),
};

type DestKey = "tbs" | "otp" | "pek" | "kul";

function useMeasuredArcs(containerRef: React.RefObject<HTMLDivElement>, destKeys: DestKey[]) {
  const [paths, setPaths] = useState<Record<DestKey, string>>({} as Record<DestKey, string>);

  useLayoutEffect(() => {
    function measure() {
      const container = containerRef.current;
      if (!container) return;
      const cRect = container.getBoundingClientRect();
      const homeEl = container.querySelector<HTMLElement>("[data-node='dhk']");
      if (!homeEl) return;
      const hRect = homeEl.getBoundingClientRect();
      const startX = hRect.left + hRect.width / 2 - cRect.left;
      const startY = hRect.top + hRect.height / 2 - cRect.top;

      const next = {} as Record<DestKey, string>;
      destKeys.forEach((key) => {
        const el = container.querySelector<HTMLElement>(`[data-node='${key}']`);
        if (!el) return;
        const r = el.getBoundingClientRect();
        const endX = r.left + r.width / 2 - cRect.left;
        const endY = r.top + r.height / 2 - cRect.top;
        const dx = endX - startX;
        const dy = endY - startY;
        const midX = startX + dx * 0.5;
        const midY = startY + dy * 0.5 - Math.abs(dx) * 0.18;
        next[key] = `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;
      });
      setPaths(next);
    }

    measure();
    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return paths;
}

function DestinationBadge({
  destKey,
  code,
  country,
  className,
  active,
  onEnter,
  onLeave,
  onOpen,
}: {
  destKey: DestKey;
  code: string;
  country: string;
  className: string;
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      data-node={destKey}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onOpen}
      className={`group absolute z-20 flex w-max -translate-x-1/2 -translate-y-1/2 items-center gap-1 whitespace-nowrap rounded-full border bg-white py-1 pl-1.5 pr-2 shadow-[0_8px_20px_-8px_rgba(28,23,64,0.35)] transition-transform sm:gap-1.5 sm:py-1.5 sm:pl-2 sm:pr-2.5 ${
        active ? "scale-105 border-coral" : "border-navy/10 hover:scale-105"
      } ${className}`}
    >
      <span className="[&>svg]:h-2.5 [&>svg]:w-[14px] sm:[&>svg]:h-3.5 sm:[&>svg]:w-5">{FLAGS[destKey]}</span>
      <span className="font-mono text-[8px] font-bold tracking-wide text-coral sm:text-[11px]">{code}</span>
      <span className="text-[7px] font-semibold text-navy/60 sm:text-[10px]">· {country}</span>
      <CheckBadge className="h-2.5 w-2.5 shrink-0 sm:h-3.5 sm:w-3.5" />
    </button>
  );
}

function DestinationDrawer({ destKey, onClose }: { destKey: DestKey; onClose: () => void }) {
  const { t } = useLang();
  const map = {
    tbs: { label: t.hero.tbs, to: "/destinations/georgia", intro: t.georgia.intro, unis: realCount(GEORGIA_UNIVERSITIES) },
    otp: { label: t.hero.otp, to: "/destinations/romania", intro: t.romania.intro, unis: realCount(ROMANIA_UNIVERSITIES) },
    pek: { label: t.hero.pek, to: "/destinations/china", intro: t.china.intro, unis: realCount(CHINA_UNIVERSITIES) },
    kul: { label: t.hero.kul, to: "/destinations/malaysia", intro: t.malaysia.intro, unis: realCount(MALAYSIA_UNIVERSITIES) },
  } as const;
  const data = map[destKey];
  const { code, country } = splitLabel(data.label);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border hairline bg-paper shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b hairline bg-white p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border hairline bg-parchment/60">
              {FLAGS[destKey]}
            </span>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-xl text-navy">{country}</h3>
              <span className="rounded-full bg-coral/10 px-2.5 py-0.5 font-mono text-xs font-bold text-coral">{code}</span>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="flex h-8 w-8 items-center justify-center rounded-full bg-parchment/60 text-ink/50 hover:text-ink">
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <p className="text-sm leading-relaxed text-ink/70">{data.intro}</p>
          {data.unis > 0 && (
            <div className="rounded-xl border hairline bg-white p-4">
              <p className="label-caps text-ink/40">{destKey === "kul" ? t.routes.partnerUnis : "Partner universities"}</p>
              <p className="mt-1 font-display text-lg text-navy">{data.unis}</p>
            </div>
          )}
          <Link to={data.to} onClick={onClose} className="label-caps flex items-center gap-2 text-coral hover:opacity-70">
            {t.routes.explore}
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Lightbox({ photo, onClose }: { photo: (typeof STUDENT_PHOTOS)[number]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/70 p-4 backdrop-blur-md" onClick={onClose}>
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-3" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Close" className="absolute -top-4 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-navy text-white">
          <CloseIcon className="h-4 w-4" />
        </button>
        <img src={assetPath(photo.src)} alt={photo.title} className="max-h-[70vh] w-full rounded-xl object-contain" />
        <p className="mt-3 pb-1 text-center text-sm font-semibold text-navy">
          {photo.title} · {photo.destination}
        </p>
      </div>
    </div>
  );
}

function PhotoCard({ photo, rotate, onOpen }: { photo: (typeof STUDENT_PHOTOS)[number]; rotate: string; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      style={{ left: photo.pos.left, top: photo.pos.top, width: `${PHOTO_WIDTH_PCT}%` }}
      className={`group absolute z-20 min-w-[52px] max-w-[108px] -translate-x-1/2 -translate-y-1/2 rounded-lg border hairline bg-white p-1 pb-1.5 shadow-[0_12px_28px_-10px_rgba(28,23,64,0.35)] transition-transform sm:rounded-xl sm:p-1.5 sm:pb-2 ${rotate} hover:rotate-0 hover:scale-105`}
    >
      <span className="absolute -top-1.5 left-1/2 h-2.5 w-6 -translate-x-1/2 rounded-sm bg-white/70 shadow-sm sm:-top-2 sm:h-3.5 sm:w-8" />
      <span className="relative block overflow-hidden rounded-md sm:rounded-lg" style={{ aspectRatio: photo.aspect }}>
        <img src={assetPath(photo.src)} alt={photo.title} className="h-full w-full object-cover" />
      </span>
      <span className="mt-1 block truncate text-center text-[6px] font-bold text-navy sm:mt-1.5 sm:text-[9px]">{photo.title}</span>
      <span className="hidden text-center text-[8px] font-medium text-ink/40 sm:block">{photo.destination}</span>
    </button>
  );
}

const PHOTO_ROTATIONS = ["-rotate-3", "rotate-2", "-rotate-2"];

function FlightRoutes() {
  const { t } = useLang();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeKey, setActiveKey] = useState<DestKey | null>(null);
  const [openDrawer, setOpenDrawer] = useState<DestKey | null>(null);
  const [openPhoto, setOpenPhoto] = useState<(typeof STUDENT_PHOTOS)[number] | null>(null);

  const destinations: { key: DestKey; label: string; className: string }[] = [
    { key: "kul", label: t.hero.kul, className: "left-[32%] top-[12%]" },
    { key: "otp", label: t.hero.otp, className: "left-[74%] top-[13%]" },
    { key: "pek", label: t.hero.pek, className: "left-[88%] top-[42%]" },
    { key: "tbs", label: t.hero.tbs, className: "left-[86%] top-[74%]" },
  ];
  const dhk = splitLabel(t.hero.dhk);
  const paths = useMeasuredArcs(containerRef, destinations.map((d) => d.key));

  return (
    <div ref={containerRef} className="relative aspect-[640/520] w-full overflow-visible">
      {/* World dot-grid network texture, standing in for a map backdrop.
          Faded via a CSS mask (exact to the box edges) rather than an SVG
          radial gradient, whose bounding-box math falls short on non-square
          boxes and left a visible line at the top/bottom. */}
      <svg
        viewBox="0 0 640 520"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 18%, black 82%, transparent), linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)",
          WebkitMaskComposite: "source-in",
          maskImage:
            "linear-gradient(to right, transparent, black 18%, black 82%, transparent), linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)",
          maskComposite: "intersect",
        }}
      >
        <defs>
          <pattern id="networkGrid" width="26" height="26" patternUnits="userSpaceOnUse">
            <rect x="1" y="1" width="7" height="7" rx="1.5" fill="#D6C8AA" fillOpacity="0.28" />
          </pattern>
          <radialGradient id="sky" cx="65%" cy="15%" r="70%">
            <stop offset="0%" stopColor="#E05228" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#FAF7F0" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="640" height="520" fill="url(#sky)" />
        <rect width="640" height="520" fill="url(#networkGrid)" />
        <g stroke="#E05228" strokeOpacity="0.08" strokeWidth="1" strokeDasharray="3 5">
          <line x1="0" y1="173" x2="640" y2="173" />
          <line x1="0" y1="346" x2="640" y2="346" />
          <line x1="213" y1="0" x2="213" y2="520" />
          <line x1="426" y1="0" x2="426" y2="520" />
        </g>
        <text
          x="330"
          y="330"
          textAnchor="middle"
          fontSize="170"
          fontWeight="800"
          fill="#241E5E"
          fillOpacity="0.045"
          style={{ fontFamily: '"Anek Bangla", sans-serif' }}
          transform="rotate(-6 330 300)"
        >
          স্বপ্ন
        </text>
      </svg>

      {/* Floating kite accents */}
      <div className="pointer-events-none absolute left-[50%] top-[3%] z-20 animate-float-slow opacity-90">
        <svg width="46" height="78" viewBox="0 0 68 110" fill="none">
          <path d="M34 0 L68 40 L34 80 L0 40 Z" fill="#F0633B" />
          <path d="M34 0 L34 80 M0 40 L68 40" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.6" />
          <path d="M34 80 C 20 90, 45 98, 30 110" stroke="#F0633B" strokeWidth="2" fill="none" strokeDasharray="3 3" />
        </svg>
      </div>
      <div className="pointer-events-none absolute left-[90%] top-[43%] z-20 animate-float-delayed opacity-85">
        <svg width="40" height="70" viewBox="0 0 48 85" fill="none">
          <path d="M24 0 L48 30 L24 60 L0 30 Z" fill="#006A4E" />
          <path d="M24 0 L24 60 M0 30 L48 30" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.6" />
          <path d="M24 60 C 15 68, 32 75, 20 85" stroke="#006A4E" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      {/* Measured route arcs — recomputed on resize so they always meet the badges exactly */}
      <svg className="absolute inset-0 z-10 h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <filter id="pathGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {destinations.map((d) => {
          const isActive = activeKey === d.key;
          const isDimmed = activeKey !== null && !isActive;
          return (
            <path
              key={d.key}
              d={paths[d.key] || ""}
              fill="none"
              stroke="#E05228"
              strokeOpacity={isDimmed ? 0.12 : isActive ? 0.85 : undefined}
              strokeWidth={isActive ? 3 : 2}
              strokeDasharray="6 6"
              filter={isActive ? "url(#pathGlow)" : undefined}
              className={!isDimmed ? `route-flow${isActive ? "" : " route-glow-pulse"}` : undefined}
              style={{ transition: "stroke-width 0.2s" }}
            />
          );
        })}
        {destinations.map((d) => (
          <circle key={`dot-${d.key}`} data-arc-end={d.key} r="4" fill="#E05228" opacity="0" />
        ))}
      </svg>

      {/* Real students, framed as tilted photo cards — each ribbon states a real, established fact */}
      {STUDENT_PHOTOS.map((p, i) => (
        <PhotoCard key={p.src} photo={p} rotate={PHOTO_ROTATIONS[i]} onOpen={() => setOpenPhoto(p)} />
      ))}

      {/* Home node — Dhaka, the round logo hub */}
      <div data-node="dhk" style={{ left: HOME_POS.left, top: HOME_POS.top }} className="absolute z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 sm:gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-parchment bg-white shadow-xl sm:h-16 sm:w-16">
          <AbroadMark className="h-4.5 w-4.5 sm:h-8 sm:w-8" />
        </span>
        <span className="flex items-center gap-1 whitespace-nowrap rounded-full border hairline bg-white px-1.5 py-1 shadow-sm sm:gap-1.5 sm:px-3 sm:py-1.5">
          <span className="[&>svg]:h-2.5 [&>svg]:w-[14px] sm:[&>svg]:h-3.5 sm:[&>svg]:w-5">{FLAGS.dhk}</span>
          <span className="text-[7px] font-bold text-navy/70 sm:text-[10px]">
            <span className="text-coral">{dhk.code}</span> · {dhk.country}
          </span>
        </span>
      </div>

      {/* Destination badges — hover glows the route, click opens real destination info */}
      {destinations.map((d) => {
        const { code, country } = splitLabel(d.label);
        return (
          <DestinationBadge
            key={d.key}
            destKey={d.key}
            code={code}
            country={country}
            className={d.className}
            active={activeKey === d.key}
            onEnter={() => setActiveKey(d.key)}
            onLeave={() => setActiveKey(null)}
            onOpen={() => setOpenDrawer(d.key)}
          />
        );
      })}

      {openDrawer && <DestinationDrawer destKey={openDrawer} onClose={() => setOpenDrawer(null)} />}
      {openPhoto && <Lightbox photo={openPhoto} onClose={() => setOpenPhoto(null)} />}
    </div>
  );
}

export default function Hero() {
  const { t, lang } = useLang();
  const lastIndex = t.hero.titleLines.length - 1;

  // Hat offsets tuned per script so it clips onto the letter tops like the logo.
  const hatClass =
    lang === "en"
      ? "absolute right-[0.28em] -top-[0.16em] w-[0.58em] rotate-[-6deg]"
      : "absolute right-[0.02em] -top-[0.08em] w-[0.55em] rotate-[-6deg]";

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-6 pb-12 pt-14 lg:min-h-[calc(100vh-140px)] lg:grid-cols-[1fr_1.05fr] lg:gap-6 lg:pb-0 lg:pt-0">
        <div>
          <p className="text-sm font-semibold text-coral">{t.hero.kicker}</p>
          <h1 className="mt-5 font-display text-[3.4rem] leading-[1.04] md:text-7xl xl:text-8xl">
            {t.hero.titleLines.map((line, i) => {
              if (i !== lastIndex) {
                return (
                  <span key={line} className="block">
                    {line}
                  </span>
                );
              }
              // Perch the hat mark on the final word, like the brand lockup.
              const words = line.split(" ");
              const lastWord = words.pop();
              return (
                <span key={line} className="block">
                  {words.length > 0 && <em>{words.join(" ")} </em>}
                  <span className="relative inline-block">
                    <em>{lastWord}</em>
                    <AbroadMark className={hatClass} />
                  </span>
                </span>
              );
            })}
          </h1>

          {/* The other language, stamped below like a visa approval */}
          <span
            className="mt-6 inline-block -rotate-2 rounded-lg border-[2.5px] border-navy/80 px-5 py-2 text-xl font-bold leading-snug text-navy md:text-2xl"
            style={{
              fontFamily:
                t.hero.altFont === "bn" ? '"Anek Bangla", sans-serif' : '"Manrope", sans-serif',
            }}
          >
            {t.hero.altLine}
          </span>

          <p className="mt-6 max-w-md text-base leading-relaxed text-ink/70 md:text-lg">{t.hero.sub}</p>
          <div className="mt-8">
            <a
              href="#assessment"
              className="group inline-flex items-center rounded-full bg-navy py-2 pl-7 pr-2 shadow-[0_10px_30px_-12px_rgba(28,23,64,0.55)] transition-transform hover:-translate-y-0.5"
            >
              <span className="text-base font-bold text-white md:text-lg">{t.hero.ctaPrimary}</span>
              <span className="ml-4 flex items-center gap-1.5 rounded-full bg-coral py-2.5 pl-3 pr-4 text-xs font-bold uppercase tracking-caps text-white transition-colors group-hover:bg-white group-hover:text-coral">
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                  <path d="M10 1.5l1.9 5.3 5.3 1.9-5.3 1.9L10 16l-1.9-5.4L2.8 8.7l5.3-1.9z" />
                </svg>
                {t.hero.ctaSecondary}
              </span>
            </a>
          </div>
        </div>

        <FlightRoutes />
      </div>

      {/* The assessment, part of the same hero block, not a separate section */}
      <div id="assessment" className="mx-auto max-w-6xl px-6 pb-20 pt-6 lg:pt-2">
        <AssessmentQuiz />
      </div>
    </section>
  );
}
