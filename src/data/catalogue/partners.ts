/** Joins the hand-curated partner list to catalogue records.
 *
 * Deliberately depends on `src/data/universities.ts` rather than replacing it.
 * That file is the consultancy's own "Study in Malaysia" partner list — a
 * business fact, not extracted data — and five components already read it in
 * ways that fail silently if it changes:
 *
 *   - Home.tsx renders `.length` as the partner count
 *   - AssessmentQuiz.tsx indexes it positionally (`[0]`, `.slice(0, 3)`)
 *   - Hero.tsx `realCount()` filters on the literal substring "TODO"
 *   - Ticker.tsx maps it straight into the marquee
 *   - DestinationSteps takes it as `partnerUniversities: string[]`
 *
 * Pointing the dependency this way means the catalogue can grow to every
 * institution in Malaysia without any of those five changing behaviour.
 */

import { MALAYSIA_UNIVERSITIES } from "../universities";

/** Legacy display string -> stable catalogue id. The legacy string is the join
 * key because it is what the partner list actually contains; the id is what
 * courses hang off. Keep ids immutable even if an institution rebrands. */
export const PARTNER_ID_BY_LEGACY_NAME: Record<string, string> = {
  "Universiti Tun Abdul Razak (UNIRAZAK)": "unirazak",
  "Mahsa Avenue International College (MAIC)": "maic",
  "Asia Pacific University (APU)": "apu",
  "MAHSA University": "mahsa",
  "University of Cyberjaya": "cyberjaya",
  "INTI International University": "inti",
  "SEGi University": "segi",
  "UCSI University": "ucsi",
  "Taylor's University": "taylors",
  "Sunway University": "sunway",
  "ALFA University": "alfa",
  "City University Malaysia": "city-university",
  "Lincoln University College": "lincoln",
  UNIMY: "unimy",
  "Veritas University College": "veritas",
  "Reliance College": "reliance",
};

export type PartnerInfo = { isPartner: boolean; partnerOrder: number; legacyName?: string };

/** id -> { isPartner, partnerOrder }, derived from the live array so the two
 * can never drift. Order is meaningful: UNIRAZAK is first because it is the
 * confirmed real-visa-success case the quiz leads with. */
const PARTNER_INFO: Record<string, PartnerInfo> = Object.fromEntries(
  MALAYSIA_UNIVERSITIES.map((legacyName, index) => {
    const id = PARTNER_ID_BY_LEGACY_NAME[legacyName];
    return [id ?? `unmapped-${index}`, { isPartner: true, partnerOrder: index, legacyName }];
  }),
);

export function partnerInfo(id: string): PartnerInfo {
  return PARTNER_INFO[id] ?? { isPartner: false, partnerOrder: Number.MAX_SAFE_INTEGER };
}

/** Ids in the partner list that have no mapping above — a typo in either file
 * would otherwise silently produce a non-partner. Surfaced by the sync script
 * and by the dev-only check below rather than throwing in production. */
export function unmappedPartnerNames(): string[] {
  return MALAYSIA_UNIVERSITIES.filter((n) => !PARTNER_ID_BY_LEGACY_NAME[n]);
}

if (import.meta.env.DEV) {
  const missing = unmappedPartnerNames();
  if (missing.length > 0) {
    console.warn(
      `[catalogue] ${missing.length} partner name(s) have no id mapping in partners.ts:`,
      missing,
    );
  }
}
