import { Link } from "react-router-dom";
import AbroadMark from "./AbroadMark";
import AssessmentQuiz from "./AssessmentQuiz";
import { useLang } from "../i18n";
import { assetPath } from "../lib/assetPath";

const HOME = { x: 96, y: 432 };

// Real students, placed in the map's empty gaps. Same white card + shadow
// language as the destination flag cards, framed as photo chips sized to
// each photo's own aspect ratio — never force-cropped.
const PHOTO_PAD = 4;
const PHOTO_HEIGHT = 76;

const STUDENT_PHOTOS = [
  { src: "photos/romania-visa-mehedi.jpg", aspect: 820 / 850, x: 140, y: 230 },
  { src: "photos/airport-pickup.jpg", aspect: 1044 / 950, x: 594, y: 214 },
  { src: "photos/malaysia-arrival-ruhel-full.jpg", aspect: 1, x: 494, y: 448 },
].map((p) => ({ ...p, w: p.aspect * PHOTO_HEIGHT, h: PHOTO_HEIGHT }));

/** Splits a "CODE · Country" translation string into its parts; the airport
 * code stays Latin in both languages, only the country name is translated. */
function splitLabel(label: string) {
  const [code, country] = label.split(" · ");
  return { code, country };
}

function FlightRoutes() {
  const { t } = useLang();
  const geo = splitLabel(t.hero.tbs);
  const ro = splitLabel(t.hero.otp);
  const cn = splitLabel(t.hero.pek);
  const my = splitLabel(t.hero.kul);
  const dhk = splitLabel(t.hero.dhk);

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 640 520"
        className="w-full"
        role="img"
        aria-label="Flight routes from Dhaka to Malaysia, Romania, Georgia and China"
      >
        <defs>
          <radialGradient id="sky" cx="65%" cy="20%" r="70%">
            <stop offset="0%" stopColor="#DDD8F0" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F7F4EE" stopOpacity="0" />
          </radialGradient>
          <filter id="cs" x="-30%" y="-80%" width="160%" height="300%">
            <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="#241E5E" floodOpacity="0.11" />
          </filter>
          {STUDENT_PHOTOS.map((p, i) => (
            <clipPath key={`clip-${i}`} id={`student-clip-${i}`}>
              <rect x={p.x - p.w / 2} y={p.y - p.h / 2} width={p.w} height={p.h} rx="8" />
            </clipPath>
          ))}
        </defs>

        {/* Sky atmosphere */}
        <rect width="640" height="520" fill="url(#sky)" />

        {/* Cloud puffs */}
        <ellipse cx="514" cy="156" rx="64" ry="17" fill="#241E5E" fillOpacity="0.05" />
        <ellipse cx="551" cy="151" rx="44" ry="13" fill="#241E5E" fillOpacity="0.05" />
        <ellipse cx="480" cy="162" rx="36" ry="11" fill="#241E5E" fillOpacity="0.05" />
        <ellipse cx="162" cy="135" rx="48" ry="13" fill="#241E5E" fillOpacity="0.038" />
        <ellipse cx="196" cy="130" rx="34" ry="10" fill="#241E5E" fillOpacity="0.038" />

        {/* স্বপ্ন (dream), watermarked over the sky */}
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

        {/* Delta rivers */}
        <path d="M-10,470 C 90,455 170,475 250,462" fill="none" stroke="#241E5E" strokeWidth="10" strokeOpacity="0.05" strokeLinecap="round" />
        <path d="M-10,492 C 110,478 200,500 300,486" fill="none" stroke="#241E5E" strokeWidth="14" strokeOpacity="0.04" strokeLinecap="round" />
        <path d="M20,449 C 90,441 140,452 200,446" fill="none" stroke="#241E5E" strokeWidth="6" strokeOpacity="0.06" strokeLinecap="round" />

        {/* Route glow (depth layer) */}
        <path d="M96,432 C 130,300 170,150 230,66" fill="none" stroke="#241E5E" strokeWidth="9" strokeOpacity="0.055" strokeLinecap="round" />
        <path d="M96,432 C 190,300 280,110 380,42" fill="none" stroke="#F0633B" strokeWidth="9" strokeOpacity="0.05" strokeLinecap="round" />
        <path d="M96,432 C 300,380 460,230 566,96" fill="none" stroke="#241E5E" strokeWidth="9" strokeOpacity="0.055" strokeLinecap="round" />
        <path d="M96,432 C 250,380 430,370 582,380" fill="none" stroke="#F0633B" strokeWidth="9" strokeOpacity="0.05" strokeLinecap="round" />

        {/* Route dashes (animated draw) */}
        <path id="route-geo" d="M96,432 C 130,300 170,150 230,66" className="route-path" fill="none" stroke="#241E5E" strokeOpacity="0.28" strokeWidth="2.5" />
        <path id="route-ro" d="M96,432 C 190,300 280,110 380,42" className="route-path" fill="none" stroke="#241E5E" strokeOpacity="0.28" strokeWidth="2.5" style={{ animationDelay: "0.25s" }} />
        <path id="route-cn" d="M96,432 C 300,380 460,230 566,96" className="route-path" fill="none" stroke="#241E5E" strokeOpacity="0.28" strokeWidth="2.5" style={{ animationDelay: "0.5s" }} />
        <path id="route-my" d="M96,432 C 250,380 430,370 582,380" className="route-path" fill="none" stroke="#241E5E" strokeOpacity="0.28" strokeWidth="2.5" style={{ animationDelay: "0.75s" }} />

        {/* Kite A — coral */}
        <g className="kite-shake-a">
          <g transform="translate(298,190) rotate(14)">
            <polygon points="0,-28 20,0 0,28 -20,0" fill="#F0633B" />
            <line x1="0" y1="-28" x2="0" y2="28" stroke="#F7F4EE" strokeWidth="2" />
            <line x1="-20" y1="0" x2="20" y2="0" stroke="#F7F4EE" strokeWidth="2" />
            <polygon points="0,-14 5,-8 0,-2 -5,-8" fill="#F7F4EE" fillOpacity="0.35" />
            <polygon points="0,2 5,8 0,14 -5,8" fill="#F7F4EE" fillOpacity="0.35" />
            <path d="M0,28 q -10,20 4,38 q 10,16 -4,30 q -8,12 3,20" fill="none" stroke="#F0633B" strokeWidth="2.2" strokeOpacity="0.6" />
            <circle cx="-1" cy="54" r="3.2" fill="#241E5E" />
            <circle cx="1" cy="80" r="2.8" fill="#241E5E" />
          </g>
        </g>

        {/* Kite B — green */}
        <g className="kite-shake-b">
          <g transform="translate(468,266) rotate(-10) scale(0.65)">
            <polygon points="0,-26 18,0 0,26 -18,0" fill="#006A4E" />
            <line x1="0" y1="-26" x2="0" y2="26" stroke="#F7F4EE" strokeWidth="1.8" />
            <line x1="-18" y1="0" x2="18" y2="0" stroke="#F7F4EE" strokeWidth="1.8" />
            <path d="M0,26 q 8,18 -2,34 q -8,12 2,26" fill="none" stroke="#006A4E" strokeWidth="2" strokeOpacity="0.7" />
            <circle cx="1" cy="48" r="3" fill="#F42A41" />
            <circle cx="-1" cy="68" r="2.4" fill="#F42A41" />
          </g>
        </g>

        {/* Kite C — tiny coral, fills upper-right void */}
        <g className="kite-shake-c">
          <g transform="translate(538,200) rotate(20) scale(0.44)">
            <polygon points="0,-24 16,0 0,24 -16,0" fill="#F0633B" fillOpacity="0.8" />
            <line x1="0" y1="-24" x2="0" y2="24" stroke="#F7F4EE" strokeWidth="1.8" />
            <line x1="-16" y1="0" x2="16" y2="0" stroke="#F7F4EE" strokeWidth="1.8" />
            <path d="M0,24 q 6,14 -2,26 q -5,8 2,14" fill="none" stroke="#F0633B" strokeWidth="1.8" strokeOpacity="0.6" />
            <circle cx="1" cy="38" r="2.8" fill="#241E5E" />
          </g>
        </g>

        {/* Planes (animated) */}
        <path d="M0,-7 L16,0 L0,7 L4,0 Z" fill="#241E5E">
          <animateMotion dur="9s" begin="0.8s" repeatCount="indefinite" rotate="auto" keyPoints="0;1;1" keyTimes="0;0.6;1" calcMode="linear">
            <mpath href="#route-geo" />
          </animateMotion>
        </path>
        <path d="M0,-7 L16,0 L0,7 L4,0 Z" fill="#F0633B">
          <animateMotion dur="9.5s" begin="0s" repeatCount="indefinite" rotate="auto" keyPoints="0;1;1" keyTimes="0;0.6;1" calcMode="linear">
            <mpath href="#route-ro" />
          </animateMotion>
        </path>
        <path d="M0,-7 L16,0 L0,7 L4,0 Z" fill="#241E5E">
          <animateMotion dur="10.5s" begin="1.6s" repeatCount="indefinite" rotate="auto" keyPoints="0;1;1" keyTimes="0;0.6;1" calcMode="linear">
            <mpath href="#route-cn" />
          </animateMotion>
        </path>
        <path d="M0,-7 L16,0 L0,7 L4,0 Z" fill="#F0633B">
          <animateMotion dur="7s" begin="0.4s" repeatCount="indefinite" rotate="auto" keyPoints="0;1;1" keyTimes="0;0.6;1" calcMode="linear">
            <mpath href="#route-my" />
          </animateMotion>
        </path>

        {/* Georgia TBS (230,66) — card right */}
        <circle cx="230" cy="66" r="20" fill="#F0633B" fillOpacity="0.2" className="node-pulse" />
        <circle cx="230" cy="66" r="8" fill="#F0633B" />
        <circle cx="230" cy="66" r="8" fill="none" stroke="#F7F4EE" strokeWidth="2.8" />
        <rect x="244" y="34" width="136" height="28" rx="14" fill="white" fillOpacity="0.93" stroke="#241E5E" strokeOpacity="0.07" strokeWidth="0.8" filter="url(#cs)" />
        <rect x="254" y="41" width="20" height="14" rx="1.5" fill="white" stroke="#DCDCDC" strokeWidth="0.7" />
        <rect x="254" y="46.5" width="20" height="2.8" fill="#CC0000" />
        <rect x="262" y="41" width="2.8" height="14" fill="#CC0000" />
        <text x="280" y="53" fontSize="11" fontWeight="700" fill="#F0633B" letterSpacing="0.09em">{geo.code}</text>
        <text x="304" y="53" fontSize="10.5" fontWeight="500" fill="#1C1740" fillOpacity="0.52">· {geo.country}</text>
        <text x="353" y="53" fontSize="11" fontWeight="700" fill="#006A4E">✓</text>
        <line x1="244" y1="48" x2="238" y2="66" stroke="#241E5E" strokeOpacity="0.15" strokeWidth="1.5" />

        {/* Romania OTP (380,42) — card right, above */}
        <circle cx="380" cy="42" r="20" fill="#F0633B" fillOpacity="0.2" className="node-pulse" style={{ animationDelay: "0.7s" }} />
        <circle cx="380" cy="42" r="8" fill="#F0633B" />
        <circle cx="380" cy="42" r="8" fill="none" stroke="#F7F4EE" strokeWidth="2.8" />
        <rect x="392" y="8" width="142" height="28" rx="14" fill="white" fillOpacity="0.93" stroke="#241E5E" strokeOpacity="0.07" strokeWidth="0.8" filter="url(#cs)" />
        <rect x="402" y="15" width="7" height="14" rx="1.5" fill="#002B7F" />
        <rect x="409" y="15" width="7" height="14" fill="#FCD116" />
        <rect x="416" y="15" width="7" height="14" rx="1.5" fill="#CE1126" />
        <text x="429" y="27" fontSize="11" fontWeight="700" fill="#F0633B" letterSpacing="0.09em">{ro.code}</text>
        <text x="452" y="27" fontSize="10.5" fontWeight="500" fill="#1C1740" fillOpacity="0.52">· {ro.country}</text>
        <text x="511" y="27" fontSize="11" fontWeight="700" fill="#006A4E">✓</text>
        <line x1="394" y1="36" x2="382" y2="40" stroke="#241E5E" strokeOpacity="0.15" strokeWidth="1.5" />

        {/* China PEK (566,96) — card left */}
        <circle cx="566" cy="96" r="20" fill="#F0633B" fillOpacity="0.2" className="node-pulse" style={{ animationDelay: "1.4s" }} />
        <circle cx="566" cy="96" r="8" fill="#F0633B" />
        <circle cx="566" cy="96" r="8" fill="none" stroke="#F7F4EE" strokeWidth="2.8" />
        <rect x="428" y="78" width="128" height="28" rx="14" fill="white" fillOpacity="0.93" stroke="#241E5E" strokeOpacity="0.07" strokeWidth="0.8" filter="url(#cs)" />
        <rect x="438" y="85" width="20" height="14" rx="1.5" fill="#DE2910" />
        <text x="443" y="95" fontSize="9" fill="#FFDE00">★</text>
        <text x="464" y="97" fontSize="11" fontWeight="700" fill="#F0633B" letterSpacing="0.09em">{cn.code}</text>
        <text x="487" y="97" fontSize="10.5" fontWeight="500" fill="#1C1740" fillOpacity="0.52">· {cn.country}</text>
        <text x="530" y="97" fontSize="11" fontWeight="700" fill="#006A4E">✓</text>
        <line x1="556" y1="92" x2="558" y2="95" stroke="#241E5E" strokeOpacity="0.15" strokeWidth="1.5" />

        {/* Malaysia KUL (582,380) — card left */}
        <circle cx="582" cy="380" r="20" fill="#F0633B" fillOpacity="0.2" className="node-pulse" style={{ animationDelay: "0.35s" }} />
        <circle cx="582" cy="380" r="8" fill="#F0633B" />
        <circle cx="582" cy="380" r="8" fill="none" stroke="#F7F4EE" strokeWidth="2.8" />
        <rect x="438" y="362" width="140" height="28" rx="14" fill="white" fillOpacity="0.93" stroke="#241E5E" strokeOpacity="0.07" strokeWidth="0.8" filter="url(#cs)" />
        <rect x="448" y="369" width="20" height="14" rx="1.5" fill="white" />
        <rect x="448" y="369" width="20" height="2" fill="#CC0001" />
        <rect x="448" y="373" width="20" height="2" fill="#CC0001" />
        <rect x="448" y="377" width="20" height="2" fill="#CC0001" />
        <rect x="448" y="381" width="20" height="2" fill="#CC0001" />
        <rect x="448" y="369" width="10" height="7" fill="#010066" />
        <text x="474" y="381" fontSize="11" fontWeight="700" fill="#F0633B" letterSpacing="0.09em">{my.code}</text>
        <text x="497" y="381" fontSize="10.5" fontWeight="500" fill="#1C1740" fillOpacity="0.52">· {my.country}</text>
        <text x="557" y="381" fontSize="11" fontWeight="700" fill="#006A4E">✓</text>
        <line x1="578" y1="376" x2="574" y2="378" stroke="#241E5E" strokeOpacity="0.15" strokeWidth="1.5" />

        {/* Real students, framed as photo chips in the map's empty gaps.
            Each frame matches its photo's own aspect ratio, so the whole
            image shows — nothing is cropped. */}
        {STUDENT_PHOTOS.map((p, i) => (
          <g key={`student-${i}`}>
            <rect
              x={p.x - p.w / 2 - PHOTO_PAD}
              y={p.y - p.h / 2 - PHOTO_PAD}
              width={p.w + PHOTO_PAD * 2}
              height={p.h + PHOTO_PAD * 2}
              rx="10"
              fill="white"
              fillOpacity="0.95"
              stroke="#241E5E"
              strokeOpacity="0.07"
              strokeWidth="0.8"
              filter="url(#cs)"
            />
            <image
              href={assetPath(p.src)}
              x={p.x - p.w / 2}
              y={p.y - p.h / 2}
              width={p.w}
              height={p.h}
              preserveAspectRatio="xMidYMid meet"
              clipPath={`url(#student-clip-${i})`}
            />
            <rect
              x={p.x - p.w / 2}
              y={p.y - p.h / 2}
              width={p.w}
              height={p.h}
              rx="8"
              fill="none"
              stroke="#241E5E"
              strokeOpacity="0.08"
              strokeWidth="1"
            />
          </g>
        ))}

        {/* Home node — map pin */}
        <circle cx={HOME.x} cy="400" r="34" fill="#006A4E" fillOpacity="0.08" className="home-ring" />
        <ellipse cx={HOME.x} cy="434" rx="10" ry="3.5" fill="#1C1740" fillOpacity="0.12" />
        <path d="M76,400 A20,20 0 1,1 116,400 L96,432 Z" fill="#006A4E" />
        <path d="M78,393 A20,20 0 0,1 114,393" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.18" strokeLinecap="round" />
        <circle cx={HOME.x} cy="396" r="8" fill="#F42A41" />

        {/* Home label card */}
        <rect x="56" y="448" width="140" height="26" rx="13" fill="white" fillOpacity="0.9" stroke="#241E5E" strokeOpacity="0.07" strokeWidth="0.8" filter="url(#cs)" />
        <rect x="66" y="455" width="18" height="12" rx="1.5" fill="#006A4E" />
        <circle cx="75" cy="461" r="3.5" fill="#F42A41" />
        <text x="91" y="465" fontSize="11" fontWeight="600" fill="#1C1740" fillOpacity="0.7" letterSpacing="0.04em">
          {dhk.code} · {dhk.country}
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
            <a href="#assessment" className="btn-primary">
              {t.hero.ctaPrimary} →
            </a>
            <Link to="/book-session" className="btn-ghost">
              {t.hero.ctaSecondary}
            </Link>
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
