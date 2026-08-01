import { useLang } from "../../i18n";
import { LEVEL_ORDER, countryLabel, levelLabel, type JoinedUniversity } from "../../data/catalogue/types";

const icons = {
  badge: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 4 5.5V11c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V5.5L12 2Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  book: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" />
      <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20" />
    </svg>
  ),
  layers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.4" />
    </svg>
  ),
};

/** A short, data-driven row of highlights on the university profile,
 * Airbnb-amenity style. Every line is derived from fields already on the
 * record, never invented specifics (like nearby transit) we have no data
 * for — that would be a claim we can't back up for 64 institutions. */
export default function UniversityHighlights({ uni }: { uni: JoinedUniversity }) {
  const { t, lang } = useLang();
  const c = t.catalogue;

  const orderedLevels = LEVEL_ORDER.filter((l) => uni.levels.includes(l));
  const levelSpan =
    orderedLevels.length > 1
      ? `${levelLabel(orderedLevels[0], lang)} → ${levelLabel(orderedLevels[orderedLevels.length - 1], lang)}`
      : orderedLevels[0]
        ? levelLabel(orderedLevels[0], lang)
        : null;

  const items = [
    {
      icon: icons.badge,
      title: uni.isPartner ? c.highlightPartnerTitle : c.highlightVerifiedTitle,
      body: uni.isPartner ? c.highlightPartnerBody : c.highlightVerifiedBody,
    },
    uni.courseCount > 0 && {
      icon: icons.book,
      title: `${uni.departments.length} ${uni.departments.length === 1 ? c.highlightFieldLabel : c.highlightFieldsLabel}`,
      body: c.highlightProgrammesBody,
    },
    levelSpan && {
      icon: icons.layers,
      title: levelSpan,
      body: c.highlightLevelsBody,
    },
    uni.city && {
      icon: icons.pin,
      title: `${uni.city}, ${countryLabel(uni.country)}`,
      body: c.highlightLocationBody,
    },
  ].filter((x): x is { icon: JSX.Element; title: string; body: string } => Boolean(x));

  if (items.length === 0) return null;

  return (
    <div className="mt-10">
      <p className="label-caps text-ink/40">{c.highlightsKicker}</p>
      <ul className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3.5">
            <span className="mt-0.5 h-6 w-6 shrink-0 text-navy">{item.icon}</span>
            <span>
              <span className="block text-sm font-semibold text-navy">{item.title}</span>
              {item.body && <span className="mt-0.5 block text-xs leading-relaxed text-ink/55">{item.body}</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
