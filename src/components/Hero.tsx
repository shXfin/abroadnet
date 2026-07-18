import { Link } from "react-router-dom";
import { useLang } from "../i18n";

function FlightRoutes() {
  const { t } = useLang();

  return (
    <div className="relative w-full">
      <svg viewBox="0 0 640 520" className="w-full" role="img" aria-label="Flight routes from Dhaka to Malaysia and Romania">
        {/* Routes */}
        <path
          id="route-otp"
          d="M96,432 C 120,280 170,140 268,84"
          fill="none"
          stroke="#241E5E"
          strokeOpacity="0.3"
          strokeWidth="2.5"
          className="route-path"
        />
        <path
          id="route-kul"
          d="M96,432 C 250,340 430,330 552,392"
          fill="none"
          stroke="#241E5E"
          strokeOpacity="0.3"
          strokeWidth="2.5"
          className="route-path"
          style={{ animationDelay: "0.4s" }}
        />

        {/* Planes riding the routes */}
        <path d="M0,-7 L16,0 L0,7 L4,0 Z" fill="#F0633B">
          <animateMotion dur="7s" repeatCount="indefinite" rotate="auto" keyPoints="0;1;1" keyTimes="0;0.6;1" calcMode="linear">
            <mpath href="#route-kul" />
          </animateMotion>
        </path>
        <path d="M0,-7 L16,0 L0,7 L4,0 Z" fill="#241E5E">
          <animateMotion dur="8.5s" begin="1.2s" repeatCount="indefinite" rotate="auto" keyPoints="0;1;1" keyTimes="0;0.55;1" calcMode="linear">
            <mpath href="#route-otp" />
          </animateMotion>
        </path>

        {/* Nodes */}
        {[
          { x: 96, y: 432, label: t.hero.dhk, anchor: "start" as const, dy: 34 },
          { x: 268, y: 84, label: t.hero.otp, anchor: "start" as const, dy: -18 },
          { x: 552, y: 392, label: t.hero.kul, anchor: "end" as const, dy: 34 },
        ].map((node) => (
          <g key={node.label}>
            <circle cx={node.x} cy={node.y} r="18" fill="#F0633B" opacity="0.35" className="node-pulse" />
            <circle cx={node.x} cy={node.y} r="7" fill="#F0633B" />
            <circle cx={node.x} cy={node.y} r="7" fill="none" stroke="#F7F4EE" strokeWidth="2.5" />
            <text
              x={node.x}
              y={node.y + node.dy}
              textAnchor={node.anchor}
              className="font-sans"
              fontSize="15"
              fontWeight="600"
              fill="#1C1740"
              opacity="0.75"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>

      {/* Route chips */}
      <span className="absolute left-[46%] top-[57%] rounded-full bg-navy px-4 py-1.5 text-xs font-bold text-white">
        {t.hero.chipMalaysia}
      </span>
      <span className="absolute left-[24%] top-[36%] rounded-full bg-white px-4 py-1.5 text-xs font-bold text-navy shadow-sm ring-1 ring-ink/10">
        {t.hero.chipRomania}
      </span>
    </div>
  );
}

export default function Hero() {
  const { t } = useLang();

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 pb-10 pt-14 lg:min-h-[calc(100vh-140px)] lg:grid-cols-[1fr_1.05fr] lg:gap-6 lg:pb-0 lg:pt-0">
        <div>
          <p className="text-sm font-semibold text-coral">{t.hero.kicker}</p>
          <h1 className="mt-5 font-display text-6xl leading-[1.02] md:text-7xl xl:text-8xl">
            {t.hero.titleLines.map((line, i) => (
              <span key={line} className="block">
                {i === t.hero.titleLines.length - 1 ? <em>{line}</em> : line}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-sm text-lg font-medium text-ink/70">{t.hero.sub}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/apply" className="btn-primary">
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
