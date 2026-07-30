/**
 * Sync catalogues from a Google Sheet.
 * Run: bun run sync:unis
 *
 * Pulls from the Sheet's gviz CSV endpoints, filters to published rows only,
 * and regenerates the compiled data files (universities.generated.ts, courses.generated.ts).
 * The Sheet is the source of truth; this script is the import pipeline.
 */

import { writeFileSync } from "fs";
import { join } from "path";

const SHEET_ID = "1AUoR3BRNAPhG4OpgSh9Flwm_2rVdjJdAgGzHLBtgYJc";
const UNIVERSITIES_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Universities`;
const COURSES_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Courses`;

const GENERATED_DIR = join(import.meta.dir, "generated");

interface UniversityRow {
  id: string;
  name_en: string;
  city: string;
  state: string;
  levels: string;
  departments: string;
  course_count: string;
  detail_tier: "full" | "directory";
  offer_letter_type: string;
  logo_file?: string;
  status: string;
  [key: string]: string | undefined;
}

interface CourseRow {
  university_id: string;
  name_en: string;
  level: string;
  department: string;
  campus?: string;
  duration_months?: string;
  intakes?: string;
  total_myr?: string;
  status: string;
  [key: string]: string | undefined;
}

async function fetchCSV(url: string): Promise<string[][]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  const text = await res.text();
  return parseCSV(text);
}

function parseCSV(text: string): string[][] {
  const lines = text.trim().split("\n");
  return lines.map((line) => {
    const cells: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        cells.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
    cells.push(current);
    return cells;
  });
}

function makeRecord<T extends Record<string, unknown>>(
  headers: string[],
  row: string[],
): T {
  const rec: Record<string, unknown> = {};
  headers.forEach((h, i) => {
    rec[h] = row[i] || "";
  });
  return rec as T;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function syncUniversities() {
  console.log("Fetching Universities...");
  const rows = await fetchCSV(UNIVERSITIES_URL);
  const headers = rows[0];
  const dataRows = rows.slice(1).filter((r) => r[0]); // skip empty rows

  // Only published rows
  const unis = dataRows
    .map((r) => makeRecord<UniversityRow>(headers, r))
    .filter((u) => u.status === "published");

  console.log(`  ${unis.length} published universities`);

  const usedSlugs = new Set<string>();
  const records = unis
    .sort((a, b) => a.name_en.localeCompare(b.name_en))
    .map((u) => {
      let slug = slugify(u.id);
      while (usedSlugs.has(slug)) slug += "-x";
      usedSlugs.add(slug);

      const levels = u.levels ? u.levels.split("|").filter(Boolean) : [];
      const departments = u.departments ? u.departments.split("|").filter(Boolean) : [];

      return {
        id: u.id,
        slug,
        name: { en: u.name_en, bn: u.name_en },
        country: "malaysia" as const,
        city: u.city || "",
        state: u.state || undefined,
        levels,
        departments,
        offerLetterType: (u.offer_letter_type || "unknown") as "free" | "fees-apply" | "unknown",
        detailTier: u.detail_tier,
        courseCount: 0, // will be set by course count below
        feeRanges: [],
        logo: u.logo_file
          ? { kind: "image" as const, src: u.logo_file }
          : {
              kind: "monogram" as const,
              initials: monogramInitials(u.name_en),
              tone: monogramTone(u.id) as 0 | 1 | 2 | 3,
            },
        bnPending: true,
        updatedAt: new Date().toISOString().split("T")[0],
      };
    });

  return records;
}

async function syncCourses() {
  console.log("Fetching Courses...");
  const rows = await fetchCSV(COURSES_URL);
  const headers = rows[0];
  const dataRows = rows.slice(1).filter((r) => r[0]); // skip empty rows

  // Only published rows
  const courses = dataRows
    .map((r) => makeRecord<CourseRow>(headers, r))
    .filter((c) => c.status === "published");

  console.log(`  ${courses.length} published courses`);

  const seenIds = new Set<string>();
  const records = courses
    .sort((a, b) =>
      a.university_id === b.university_id
        ? a.name_en.localeCompare(b.name_en)
        : a.university_id.localeCompare(b.university_id),
    )
    .map((c) => {
      const base = slugify(c.name_en).slice(0, 70) || "course";
      let cid = `${c.university_id}:${base}`;
      let n = 2;
      while (seenIds.has(cid)) {
        cid = `${c.university_id}:${base}-${n}`;
        n++;
      }
      seenIds.add(cid);

      return {
        id: cid,
        slug: cid.split(":")[1],
        universityId: c.university_id,
        name: { en: c.name_en, bn: c.name_en },
        level: c.level,
        department: c.department,
        durationMonths: c.duration_months ? parseInt(c.duration_months) : undefined,
        intakes: c.intakes ? c.intakes.split("|").filter(Boolean) : undefined,
        campus: c.campus || undefined,
        bnPending: true,
        updatedAt: new Date().toISOString().split("T")[0],
      };
    });

  return records;
}

function monogramInitials(name: string): string {
  const paren = name.match(/\(([A-Za-z]{2,8})\)/);
  if (paren) return paren[1].toUpperCase();

  for (const w of name.replace(/[^A-Za-z\s]/g, " ").split(/\s+/)) {
    if (/^[A-Z]{3,8}$/.test(w)) return w;
  }

  const words = name
    .replace(/[^A-Za-z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !/^(of|the|and|for)$/i.test(w));

  return words.slice(0, 3).map((w) => w[0].toUpperCase()).join("") || name.slice(0, 2).toUpperCase();
}

function monogramTone(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return h % 4;
}

function emitTypeScript(name: string, records: any[]) {
  const lines = [
    "// GENERATED FILE - do not edit by hand.",
    "// Produced by sync:unis from the Google Sheet.",
    "// Regenerate with: bun run sync:unis",
    "",
  ];

  if (name === "universities") {
    lines.push('import type { University } from "../types";');
    lines.push("", "export const UNIVERSITIES: University[] = [");
  } else {
    lines.push('import type { Course } from "../types";');
    lines.push("", "export const COURSES: Course[] = [");
  }

  records.forEach((rec) => {
    lines.push("  " + JSON.stringify(rec) + ",");
  });

  lines.push("];", "");
  const path = join(GENERATED_DIR, `${name}.generated.ts`);
  writeFileSync(path, lines.join("\n"));
  console.log(`  wrote ${path}`);
}

async function main() {
  try {
    console.log("Syncing catalogue from Sheet...\n");

    const universities = await syncUniversities();
    const courses = await syncCourses();

    // Count courses per university
    const coursesByUni = new Map<string, number>();
    courses.forEach((c) => {
      coursesByUni.set(c.universityId, (coursesByUni.get(c.universityId) || 0) + 1);
    });
    universities.forEach((u) => {
      u.courseCount = coursesByUni.get(u.id) || 0;
    });

    console.log("\nEmitting TypeScript...");
    emitTypeScript("universities", universities);
    emitTypeScript("courses", courses);

    console.log("\n✅ Sync complete.");
    console.log(`   ${universities.length} universities`);
    console.log(`   ${courses.length} courses`);
  } catch (err) {
    console.error("❌ Sync failed:", err);
    process.exit(1);
  }
}

main();
