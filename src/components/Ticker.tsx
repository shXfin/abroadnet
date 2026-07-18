import { MALAYSIA_UNIVERSITIES } from "../data/universities";

/** Marquee of partner universities. */
export default function Ticker() {
  const row = MALAYSIA_UNIVERSITIES.map((uni) => (
    <span key={uni} className="flex items-center gap-6 pr-6">
      <span className="whitespace-nowrap font-display text-lg">{uni}</span>
      <span className="text-coral">✦</span>
    </span>
  ));

  return (
    <div className="overflow-hidden border-y hairline bg-navy py-3 text-white">
      <div className="flex w-max animate-marquee">
        <div className="flex">{row}</div>
        <div className="flex" aria-hidden="true">
          {row}
        </div>
      </div>
    </div>
  );
}
