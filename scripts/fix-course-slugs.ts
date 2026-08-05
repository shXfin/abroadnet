/**
 * One-off patch: courses.generated.ts has course records whose `id` is
 * university-prefixed ("apu:diploma-in-accounting") but whose `slug` had the
 * prefix stripped ("diploma-in-accounting") — colliding across universities
 * whenever a course name repeats. Only touches records whose `id` contains
 * a colon (i.e. produced by the old buggy sync-unis.ts); hand-authored
 * records (Italy/China/Romania) already have correct unique slugs and are
 * left untouched. Run once with: bun scripts/fix-course-slugs.ts
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const path = join(import.meta.dir, "..", "src", "data", "catalogue", "generated", "courses.generated.ts");
const text = readFileSync(path, "utf8");

let changed = 0;
const seenSlugs = new Set<string>();

const fixedLines = text.split("\n").map((line) => {
  const idMatch = line.match(/id:\s*"([^"]+)"/);
  const slugMatch = line.match(/slug:\s*"([^"]+)"/);
  if (!idMatch || !slugMatch || !idMatch[1].includes(":")) return line;

  let correctSlug = idMatch[1].replace(/:/g, "-");

  // A handful of records (same university, same course name offered at two
  // different levels, e.g. Politehnica Bucharest's "Artificial Intelligence"
  // as both a bachelor's and a master's) still collide even after the
  // colon-prefix fix, because they were given fully identical ids in the
  // source data. Disambiguate by level rather than crash.
  let disambiguated = false;
  if (seenSlugs.has(correctSlug)) {
    const levelMatch = line.match(/level:\s*"([^"]+)"/);
    const withLevel = levelMatch ? `${correctSlug}-${levelMatch[1]}` : correctSlug;
    if (seenSlugs.has(withLevel)) {
      throw new Error(`Still colliding after level disambiguation: ${withLevel}`);
    }
    correctSlug = withLevel;
    disambiguated = true;
  }
  seenSlugs.add(correctSlug);

  if (slugMatch[1] === correctSlug) return line;
  changed++;
  let newLine = line.replace(/slug:\s*"[^"]+"/, `slug: "${correctSlug}"`);
  // id isn't used as a lookup key anywhere today, but keep it paired with
  // slug for anyone reading the data file directly.
  if (disambiguated) {
    newLine = newLine.replace(/id:\s*"[^"]+"/, `id: "${correctSlug}"`);
  }
  return newLine;
});

writeFileSync(path, fixedLines.join("\n"));
console.log(`Patched ${changed} course slugs.`);
