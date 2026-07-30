/** Shared types for the university + course catalogue.
 *
 * Catalogue records live here rather than in `src/i18n/translations.ts` on
 * purpose: `bn` is typed `typeof en`, so every English key needs a structural
 * Bengali twin. That's fine for a few dozen prose strings and unworkable for
 * ~1,500 course names. This follows the `comingSoonDestinations.ts` precedent
 * instead — bilingual fields carried per record.
 */

export type Localized = {
  en: string;
  /** May legitimately equal `en`. Degree titles are conventionally written in
   * English in Bangladeshi counselling, and a wrong Bengali degree name is
   * worse than an English one. Pair with `bnPending` rather than guessing. */
  bn: string;
};

/** The seven levels the filter sidebar offers. Stored as stable slugs so the
 * display label can be retranslated without invalidating any data. */
export type Level =
  | "foundation"
  | "certificate"
  | "diploma"
  | "advanced-diploma"
  | "bachelor"
  | "masters"
  | "phd";

/** Display order for filter lists — ascending by academic level, not
 * alphabetical, because students scan these as a ladder. */
export const LEVEL_ORDER: Level[] = [
  "foundation",
  "certificate",
  "diploma",
  "advanced-diploma",
  "bachelor",
  "masters",
  "phd",
];

export const LEVEL_LABELS: Record<Level, Localized> = {
  foundation: { en: "Foundation / A-level", bn: "ফাউন্ডেশন / এ-লেভেল" },
  certificate: { en: "Certificate", bn: "সার্টিফিকেট" },
  diploma: { en: "Diploma", bn: "ডিপ্লোমা" },
  "advanced-diploma": { en: "Advanced Diploma", bn: "অ্যাডভান্সড ডিপ্লোমা" },
  bachelor: { en: "Bachelor Degree", bn: "ব্যাচেলর ডিগ্রি" },
  masters: { en: "Masters Degree", bn: "মাস্টার্স ডিগ্রি" },
  phd: { en: "Doctoral Degree (PhD)", bn: "ডক্টরাল ডিগ্রি (পিএইচডি)" },
};

export type Department =
  | "business-management"
  | "computing-it"
  | "engineering"
  | "health-medicine"
  | "hospitality-tourism"
  | "design-creative-arts"
  | "law"
  | "education"
  | "science"
  | "social-sciences-humanities"
  | "mass-comm-media"
  | "built-environment"
  | "agriculture-environment"
  | "aviation"
  | "other";

export const DEPARTMENT_LABELS: Record<Department, Localized> = {
  "business-management": { en: "Business & Management", bn: "ব্যবসা ও ব্যবস্থাপনা" },
  "computing-it": { en: "Computing & IT", bn: "কম্পিউটিং ও আইটি" },
  engineering: { en: "Engineering", bn: "ইঞ্জিনিয়ারিং" },
  "health-medicine": { en: "Health & Medicine", bn: "স্বাস্থ্য ও চিকিৎসা" },
  "hospitality-tourism": { en: "Hospitality & Tourism", bn: "হসপিটালিটি ও ট্যুরিজম" },
  "design-creative-arts": { en: "Design & Creative Arts", bn: "ডিজাইন ও ক্রিয়েটিভ আর্টস" },
  law: { en: "Law", bn: "আইন" },
  education: { en: "Education", bn: "শিক্ষা" },
  science: { en: "Science", bn: "বিজ্ঞান" },
  "social-sciences-humanities": { en: "Social Sciences & Humanities", bn: "সমাজবিজ্ঞান ও মানবিক" },
  "mass-comm-media": { en: "Mass Communication & Media", bn: "গণযোগাযোগ ও মিডিয়া" },
  "built-environment": { en: "Built Environment", bn: "বিল্ট এনভায়রনমেন্ট" },
  "agriculture-environment": { en: "Agriculture & Environment", bn: "কৃষি ও পরিবেশ" },
  aviation: { en: "Aviation", bn: "অ্যাভিয়েশন" },
  other: { en: "Other", bn: "অন্যান্য" },
};

export type OfferLetterType = "free" | "fees-apply" | "unknown";

/** Universities without a real logo render a brand monogram instead. Both
 * variants render into the same fixed box, so dropping a real logo in later
 * causes no layout shift. */
export type LogoRef =
  | { kind: "image"; src: string }
  | { kind: "monogram"; initials: string; tone: 0 | 1 | 2 | 3 };

/** The ONLY money ever rendered publicly. Exact per-course figures are
 * deliberately absent from this repo — a GitHub Pages bundle is fully public,
 * so anything imported here is published. Ranges are computed on the developer
 * machine at sync time from the counselor-only sheet. */
export type FeeRange = {
  level: Level;
  currency: "MYR";
  /** Whole-programme total unless `basis` says otherwise. */
  minTotal: number;
  maxTotal: number;
  basis: "total" | "per-year";
  /** How many courses backed this range. A range built from one course is a
   * point estimate wearing a costume — the UI should say so. */
  sampleSize: number;
  confidence: "high" | "medium" | "low";
  /** e.g. "2026-01" — fee structures go stale fast. */
  asOf: string;
};

export type University = {
  /** Immutable. Renaming the institution must not orphan its courses. */
  id: string;
  slug: string;
  name: Localized;
  /** The exact legacy string from the old MALAYSIA_UNIVERSITIES array, kept so
   * the back-compat shim reproduces it verbatim. */
  legacyName?: string;
  shortName?: string;
  country: "malaysia";
  city: string;
  state?: string;
  levels: Level[];
  departments: Department[];
  offerLetterType: OfferLetterType;
  /** "full" = curated course list. "directory" = listed only, courseCount 0.
   * The UI must handle 0 gracefully rather than rendering an empty shell. */
  detailTier: "full" | "directory";
  courseCount: number;
  feeRanges: FeeRange[];
  logo: LogoRef;
  intakes?: string[];
  blurb?: Localized;
  /** Both partner fields are absent from the generated data on purpose and are
   * filled by the join in `index.ts` from `partners.ts`, so the hand-curated
   * list in `src/data/universities.ts` stays the only source of that fact.
   *
   * isPartner: true only for the original 16 in the consultancy's own guide.
   * Home.tsx renders that count as "partner universities", so it must not
   * silently become "every institution we list".
   *
   * partnerOrder: preserves the hand-curated array order. AssessmentQuiz
   * indexes positionally, so ordering is behaviour, not presentation. */
  isPartner?: boolean;
  partnerOrder?: number;
  bnPending?: boolean;
  updatedAt: string;
};

/** A University after the partner join — both fields guaranteed present. */
export type JoinedUniversity = University & { isPartner: boolean; partnerOrder: number };

export type Course = {
  /** `${universityId}:${slug}` — uniqueness asserted at import. */
  id: string;
  slug: string;
  /** FK into University.id — existence asserted at import. */
  universityId: string;
  name: Localized;
  level: Level;
  department: Department;
  durationMonths?: number;
  intakes?: string[];
  /** INTI runs the same programme across IICP Penang / IICS Subang / IU Nilai. */
  campus?: string;
  /** Dual and franchise awards, e.g. University of Wollongong. */
  awardedBy?: string;
  /** Taylor's lists these as "◦" bullets inside one cell. They are sub-items of
   * a single programme, not separate courses. */
  specialisations?: string[];
  bnPending?: boolean;
  updatedAt: string;
};

export function levelLabel(level: Level, lang: "en" | "bn"): string {
  return LEVEL_LABELS[level][lang];
}

export function departmentLabel(dept: Department, lang: "en" | "bn"): string {
  return DEPARTMENT_LABELS[dept][lang];
}

/** Deterministic so a given institution keeps the same monogram colour on
 * every page — that's what makes it read as identity rather than as a gap. */
export function monogramTone(id: string): 0 | 1 | 2 | 3 {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return (h % 4) as 0 | 1 | 2 | 3;
}

/** Prefers the institution's own short form over invented initials:
 * "Asia Pacific University (APU)" -> APU (parenthetical)
 * "MAHSA University"             -> MAHSA (already an acronym in the name)
 * "Sunway University"            -> SU (fall back to initials)
 * Kept byte-identical to monogram_initials() in _gen_ts.py. */
export function monogramInitials(name: string): string {
  const paren = name.match(/\(([A-Za-z]{2,8})\)/);
  if (paren) return paren[1].toUpperCase();

  const caps = name.replace(/[^A-Za-z\s]/g, " ").split(/\s+/).find((w) => /^[A-Z]{3,8}$/.test(w));
  if (caps) return caps;

  const words = name
    .replace(/[^A-Za-z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !/^(of|the|and|for)$/i.test(w));
  return words.slice(0, 3).map((w) => w[0].toUpperCase()).join("") || name.slice(0, 2).toUpperCase();
}
