import AbroadMark from "../AbroadMark";
import { useLang } from "../../i18n";

/**
 * Side panel visual for the assessment: our own flight-path motif (echoing
 * the hero map) instead of a stock illustrated character, so it stays
 * recognizably Abroad Net rather than borrowed from a reference site.
 */
export default function QuizVisual() {
  const { t } = useLang();

  return (
    <div className="relative hidden h-full min-h-[420px] flex-col justify-between overflow-hidden rounded-2xl bg-navy p-8 text-white md:flex">
      <svg viewBox="0 0 300 300" className="pointer-events-none absolute inset-0 h-full w-full opacity-40" aria-hidden="true">
        <path
          id="quiz-route"
          d="M40,260 C 90,150 170,80 260,50"
          fill="none"
          stroke="#F0633B"
          strokeOpacity="0.5"
          strokeWidth="2"
          strokeDasharray="6 8"
        />
        <path d="M0,-6 L13,0 L0,6 L3,0 Z" fill="#F0633B">
          <animateMotion dur="6s" repeatCount="indefinite" rotate="auto">
            <mpath href="#quiz-route" />
          </animateMotion>
        </path>
        <circle cx="40" cy="260" r="5" fill="#006A4E" />
        <circle cx="260" cy="50" r="5" fill="#F0633B" />
      </svg>

      <div className="relative flex items-center gap-2">
        <AbroadMark className="w-9" slabColor="#FFFFFF" />
        <span className="text-lg font-extrabold">abroad</span>
      </div>

      <p className="relative max-w-[220px] text-2xl font-bold leading-snug">{t.quiz.title}</p>
    </div>
  );
}
