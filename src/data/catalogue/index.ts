/** Public entry point for the catalogue. Components import from here, never
 * from `generated/` directly, so the partner join can never be skipped. */

import { UNIVERSITIES as RAW_UNIVERSITIES } from "./generated/universities.generated";
import { COURSES } from "./generated/courses.generated";
import { CATALOGUE_META } from "./generated/meta.generated";
import { partnerInfo } from "./partners";
import { LEVEL_ORDER } from "./types";
import type { Course, Department, JoinedUniversity, Level } from "./types";

/** Partners first, in their hand-curated order, then everyone else A-Z. That
 * ordering is the point of the directory: the institutions we actually place
 * students at should not be buried alphabetically. */
export const UNIVERSITIES: JoinedUniversity[] = RAW_UNIVERSITIES.map((u) => {
  const info = partnerInfo(u.id);
  return { ...u, isPartner: info.isPartner, partnerOrder: info.partnerOrder };
}).sort((a, b) => {
  if (a.isPartner !== b.isPartner) return a.isPartner ? -1 : 1;
  if (a.isPartner && b.isPartner) return a.partnerOrder - b.partnerOrder;
  return a.name.en.localeCompare(b.name.en);
});

export { COURSES, CATALOGUE_META };

const BY_ID = new Map(UNIVERSITIES.map((u) => [u.id, u]));
const BY_SLUG = new Map(UNIVERSITIES.map((u) => [u.slug, u]));

export function universityById(id: string) {
  return BY_ID.get(id);
}

export function universityBySlug(slug: string) {
  return BY_SLUG.get(slug);
}

export function courseBySlug(slug: string) {
  return COURSES.find((c) => c.slug === slug);
}

export function coursesForUniversity(id: string) {
  return COURSES.filter((c) => c.universityId === id).sort(
    (a, b) =>
      LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level) ||
      a.name.en.localeCompare(b.name.en),
  );
}

/** Facet values that actually occur, so the sidebar never offers a filter that
 * returns nothing. */
export const CITIES: string[] = [...new Set(UNIVERSITIES.map((u) => u.city).filter(Boolean))].sort();

export const UNIVERSITY_LEVELS: Level[] = LEVEL_ORDER.filter((l) =>
  UNIVERSITIES.some((u) => u.levels.includes(l)),
);

export const COURSE_LEVELS: Level[] = LEVEL_ORDER.filter((l) => COURSES.some((c) => c.level === l));

export const COURSE_DEPARTMENTS: Department[] = [
  ...new Set(COURSES.map((c) => c.department)),
].sort() as Department[];

/** Counts drive the "(12)" hints next to each filter row. Precomputed once
 * because recomputing per keystroke over 421 courses is wasteful. */
export const COURSE_COUNT_BY_LEVEL: Record<string, number> = COURSES.reduce<Record<string, number>>(
  (acc, c) => ({ ...acc, [c.level]: (acc[c.level] ?? 0) + 1 }),
  {},
);

export const COURSE_COUNT_BY_DEPARTMENT: Record<string, number> = COURSES.reduce<
  Record<string, number>
>((acc, c) => ({ ...acc, [c.department]: (acc[c.department] ?? 0) + 1 }), {});

export const UNIVERSITY_COUNT_BY_LEVEL: Record<string, number> = UNIVERSITIES.reduce<
  Record<string, number>
>((acc, u) => {
  u.levels.forEach((l) => {
    acc[l] = (acc[l] ?? 0) + 1;
  });
  return acc;
}, {});

export const UNIVERSITY_COUNT_BY_CITY: Record<string, number> = UNIVERSITIES.reduce<
  Record<string, number>
>((acc, u) => (u.city ? { ...acc, [u.city]: (acc[u.city] ?? 0) + 1 } : acc), {});

function norm(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export type UniversityFilters = {
  q: string;
  levels: Level[];
  cities: string[];
  partnersOnly: boolean;
};

export function filterUniversities(list: JoinedUniversity[], f: UniversityFilters) {
  const q = norm(f.q);
  return list.filter((u) => {
    if (f.partnersOnly && !u.isPartner) return false;
    if (f.levels.length && !f.levels.some((l) => u.levels.includes(l))) return false;
    if (f.cities.length && !f.cities.includes(u.city)) return false;
    if (q && !norm(`${u.name.en} ${u.city} ${u.state ?? ""}`).includes(q)) return false;
    return true;
  });
}

export type CourseFilters = {
  q: string;
  levels: Level[];
  departments: Department[];
  universityIds: string[];
};

export type CourseSort = "relevance" | "name" | "duration";

export function filterCourses(list: Course[], f: CourseFilters, sort: CourseSort = "relevance") {
  const q = norm(f.q);
  const out = list.filter((c) => {
    if (f.levels.length && !f.levels.includes(c.level)) return false;
    if (f.departments.length && !f.departments.includes(c.department)) return false;
    if (f.universityIds.length && !f.universityIds.includes(c.universityId)) return false;
    if (q) {
      const uni = BY_ID.get(c.universityId);
      if (!norm(`${c.name.en} ${uni?.name.en ?? ""} ${c.campus ?? ""}`).includes(q)) return false;
    }
    return true;
  });

  if (sort === "name") return [...out].sort((a, b) => a.name.en.localeCompare(b.name.en));
  if (sort === "duration")
    return [...out].sort((a, b) => (a.durationMonths ?? 999) - (b.durationMonths ?? 999));

  // relevance: partner institutions first, then by level ladder, then name
  return [...out].sort((a, b) => {
    const ua = BY_ID.get(a.universityId);
    const ub = BY_ID.get(b.universityId);
    const pa = ua?.isPartner ? 0 : 1;
    const pb = ub?.isPartner ? 0 : 1;
    return (
      pa - pb ||
      (ua?.partnerOrder ?? 999) - (ub?.partnerOrder ?? 999) ||
      LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level) ||
      a.name.en.localeCompare(b.name.en)
    );
  });
}

/** MYR figures, grouped so a range reads as one number rather than two.
 * "RM 36,900-42,900" not "RM 36,900 - RM 42,900". */
export function formatFeeRange(min: number, max: number) {
  const f = (n: number) => n.toLocaleString("en-MY");
  return min === max ? `RM ${f(min)}` : `RM ${f(min)}–${f(max)}`;
}

export function durationLabel(months: number | undefined, lang: "en" | "bn") {
  if (!months) return "";
  const years = months / 12;
  if (Number.isInteger(years)) {
    return lang === "bn" ? `${years} বছর` : `${years} year${years === 1 ? "" : "s"}`;
  }
  return lang === "bn" ? `${months} মাস` : `${months} months`;
}
