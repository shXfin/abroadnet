import type { LogoRef } from "../../data/catalogue/types";
import { assetPath } from "../../lib/assetPath";

/** Monogram tones. Text colour is picked per tone from measured contrast, not
 * by eye: paper-on-coral is only 2.95:1, which fails even the large-bold AA
 * threshold of 3:1, so coral carries ink text instead. The other three clear
 * 13:1 or better. */
const TONES = [
  { bg: "bg-ink", text: "text-paper" },
  { bg: "bg-navy", text: "text-paper" },
  { bg: "bg-coral", text: "text-ink" },
  { bg: "bg-parchment", text: "text-ink" },
] as const;

const SIZES = {
  sm: { box: "h-10 w-10 rounded-lg", scale: 0.72 },
  md: { box: "h-14 w-14 rounded-xl", scale: 1 },
  lg: { box: "h-20 w-20 rounded-2xl", scale: 1.45 },
} as const;

/** Short forms run from "UC" to "UNIRAZAK", so the type has to shrink with the
 * string or an 8-character mark spills out of its tile. */
function typeSize(initials: string, scale: number) {
  const base = initials.length <= 3 ? 15 : initials.length <= 4 ? 12.5 : initials.length <= 6 ? 10 : 8;
  return `${(base * scale).toFixed(1)}px`;
}

/** Renders a university mark. Real logos and monograms share the same fixed
 * box, so swapping a monogram for a real logo later causes no layout shift. */
export default function UniversityLogo({
  logo,
  name,
  size = "md",
}: {
  logo: LogoRef;
  name: string;
  size?: keyof typeof SIZES;
}) {
  const s = SIZES[size];

  if (logo.kind === "image") {
    return (
      <span className={`flex shrink-0 items-center justify-center overflow-hidden border hairline bg-white ${s.box}`}>
        <img src={assetPath(logo.src)} alt={name} className="h-full w-full object-contain p-1.5" loading="lazy" />
      </span>
    );
  }

  const tone = TONES[logo.tone];
  return (
    <span
      aria-hidden="true"
      style={{ fontSize: typeSize(logo.initials, s.scale) }}
      className={`flex shrink-0 items-center justify-center font-display font-bold leading-none tracking-tight ${s.box} ${tone.bg} ${tone.text}`}
    >
      {logo.initials}
    </span>
  );
}
