import { Link } from "react-router-dom";
import AbroadMark from "./AbroadMark";
import { useLang } from "../i18n";

const HOME = { x: 96, y: 432 };

function FlightRoutes() {
  const { t } = useLang();

  const destinations = [
    {
      id: "geo",
      x: 230,
      y: 66,
      curve: "C 130,300 170,150 230,66",
      label: t.hero.tbs,
      anchor: "start" as const,
      dy: -22,
      planeColor: "#241E5E",
      duration: "9s",
      delay: "0.8s",
    },
    {
      id: "ro",
      x: 380,
      y: 42,
      curve: "C 190,300 280,110 380,42",
      label: t.hero.otp,
      anchor: "start" as const,
      dy: -22,
      planeColor: "#F0633B",
      duration: "9.5s",
      delay: "0s",
    },
    {
      id: "cn",
      x: 566,
      y: 96,
      curve: "C 300,380 460,230 566,96",
      label: t.hero.pek,
      anchor: "end" as const,
      dy: -22,
      planeColor: "#241E5E",
      duration: "10.5s",
      delay: "1.6s",
    },
    {
      id: "my",
      x: 582,
      y: 380,
      curve: "C 250,380 430,370 582,380",
      label: t.hero.kul,
      anchor: "end" as const,
      dy: 38,
      planeColor: "#F0633B",
      duration: "7s",
      delay: "0.4s",
    },
  ];

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 640 520"
        className="w-full"
        role="img"
        aria-label="Flight routes from Dhaka to Malaysia, Romania, Georgia and China"
      >
        {/* স্বপ্ন (dream), watermarked over the sky */}
        <text
          x="330"
          y="330"
          textAnchor="middle"
          fontSize="170"
          fontWeight="800"
          fill="#241E5E"
          opacity="0.05"
          style={{ fontFamily: '"Anek Bangla", sans-serif' }}
          transform="rotate(-6 330 300)"
        >
          স্বপ্ন
        </text>

        {/* The delta: rivers under home */}
        <g fill="none" stroke="#241E5E" strokeLinecap="round">
          <path d="M-10,470 C 90,455 170,475 250,462" strokeWidth="10" strokeOpacity="0.06" />
          <path d="M-10,492 C 110,478 200,500 300,486" strokeWidth="14" strokeOpacity="0.05" />
          <path d="M20,449 C 90,441 140,452 200,446" strokeWidth="6" strokeOpacity="0.07" />
        </g>

        {destinations.map((d, i) => (
          <path
            key={d.id}
            id={`route-${d.id}`}
            d={`M${HOME.x},${HOME.y} ${d.curve}`}
            fill="none"
            stroke="#241E5E"
            strokeOpacity="0.3"
            strokeWidth="2.5"
            className="route-path"
            style={{ animationDelay: `${i * 0.25}s` }}
          />
        ))}

        {destinations.map((d) => (
          <path key={`plane-${d.id}`} d="M0,-7 L16,0 L0,7 L4,0 Z" fill={d.planeColor}>
            <animateMotion
              dur={d.duration}
              begin={d.delay}
              repeatCount="indefinite"
              rotate="auto"
              keyPoints="0;1;1"
              keyTimes="0;0.6;1"
              calcMode="linear"
            >
              <mpath href={`#route-${d.id}`} />
            </animateMotion>
          </path>
        ))}

        {/* Shakrain kites in the sky */}
        <g className="kite-sway">
          <g transform="translate(300,195) rotate(14)">
            <polygon points="0,-24 16,0 0,24 -16,0" fill="#F0633B" />
            <line x1="0" y1="-24" x2="0" y2="24" stroke="#F7F4EE" strokeWidth="1.6" />
            <line x1="-16" y1="0" x2="16" y2="0" stroke="#F7F4EE" strokeWidth="1.6" />
            <path d="M0,24 q -8,18 2,32 q 8,12 -2,26" fill="none" stroke="#F0633B" strokeWidth="1.8" strokeOpacity="0.7" />
            <circle cx="-1" cy="46" r="2.6" fill="#241E5E" />
            <circle cx="1" cy="70" r="2.6" fill="#241E5E" />
          </g>
        </g>
        <g className="kite-sway" style={{ animationDelay: "1.6s", animationDuration: "6.5s" }}>
          <g transform="translate(470,270) rotate(-10) scale(0.62)">
            <polygon points="0,-24 16,0 0,24 -16,0" fill="#006A4E" />
            <line x1="0" y1="-24" x2="0" y2="24" stroke="#F7F4EE" strokeWidth="1.6" />
            <line x1="-16" y1="0" x2="16" y2="0" stroke="#F7F4EE" strokeWidth="1.6" />
            <path d="M0,24 q 8,18 -2,32 q -8,12 2,26" fill="none" stroke="#006A4E" strokeWidth="1.8" strokeOpacity="0.7" />
            <circle cx="1" cy="46" r="2.6" fill="#F42A41" />
          </g>
        </g>

        {/* Home: the flag of Bangladesh, flying over the rivers */}
        <g transform={`translate(${HOME.x},${HOME.y})`}>
          <circle r="20" fill="#006A4E" opacity="0.3" className="node-pulse" />
          <circle r="4" fill="#1C1740" />
          <line x1="0" y1="0" x2="0" y2="-40" stroke="#1C1740" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M0,-40 C 11,-44 22,-37 36,-41 L36,-17 C 22,-13 11,-20 0,-16 Z" fill="#006A4E" />
          <circle cx="15" cy="-28.5" r="6" fill="#F42A41" />
        </g>

        {/* Destinations */}
        {destinations.map((d) => (
          <g key={d.id}>
            <circle cx={d.x} cy={d.y} r="16" fill="#F0633B" opacity="0.35" className="node-pulse" />
            <circle cx={d.x} cy={d.y} r="6.5" fill="#F0633B" />
            <circle cx={d.x} cy={d.y} r="6.5" fill="none" stroke="#F7F4EE" strokeWidth="2.5" />
            <text
              x={d.x}
              y={d.y + d.dy}
              textAnchor={d.anchor}
              fontSize="17"
              fontWeight="600"
              fill="#1C1740"
              opacity="0.75"
            >
              {d.label}
              <tspan fill="#006A4E" fontWeight="700">
                {" "}
                ✓
              </tspan>
            </text>
          </g>
        ))}

        {/* Home label */}
        <text x="96" y="474" textAnchor="start" fontSize="19" fontWeight="600" fill="#1C1740" opacity="0.75">
          {t.hero.dhk}
        </text>
      </svg>
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
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/onboarding" className="btn-primary">
              {t.hero.ctaPrimary} →
            </Link>
            <Link to="/book-session" className="btn-ghost">
              {t.hero.ctaSecondary}
            </Link>
          </div>
          <p className="mt-8 text-sm font-medium text-ink/45">{t.hero.strip.join("  ·  ")}</p>
        </div>

        <FlightRoutes />
      </div>
    </section>
  );
}
