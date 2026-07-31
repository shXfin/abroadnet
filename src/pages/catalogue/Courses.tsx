import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../../i18n";
import UniversityLogo from "../../components/catalogue/UniversityLogo";
import CountryPills from "../../components/catalogue/CountryPills";
import {
  ActiveChips,
  CatalogueShell,
  CheckRow,
  FilterGroup,
  SearchField,
} from "../../components/catalogue/Filters";
import { EmptyState } from "./Universities";
import {
  COURSES,
  COURSE_COUNT_BY_DEPARTMENT,
  COURSE_COUNT_BY_LEVEL,
  COURSE_DEPARTMENTS,
  COURSE_LEVELS,
  UNIVERSITIES,
  durationLabel,
  filterCourses,
  universityById,
  type CourseSort,
} from "../../data/catalogue";
import { departmentLabel, levelLabel, type Department, type Level } from "../../data/catalogue/types";
import { useCatalogueFilters } from "../../lib/useCatalogueFilters";

/** Only institutions that actually have courses belong in the university
 * filter — offering the other 41 would just produce empty result sets. */
const UNIS_WITH_COURSES = UNIVERSITIES.filter((u) => u.courseCount > 0);

export default function Courses() {
  const { t, lang } = useLang();
  const c = t.catalogue;
  const { get, getAll, setValue, toggleValue, clearAll, activeCount } = useCatalogueFilters();

  const q = get("q");
  const levels = getAll("level") as Level[];
  const departments = getAll("dept") as Department[];
  const universityIds = getAll("uni");
  const sort = (get("sort") || "relevance") as CourseSort;

  const results = useMemo(
    () => filterCourses(COURSES, { q, levels, departments, universityIds }, sort),
    [q, levels.join(), departments.join(), universityIds.join(), sort],
  );

  const chips = [
    ...levels.map((l) => ({
      key: `level-${l}`,
      label: levelLabel(l, lang),
      onRemove: () => toggleValue("level", l),
    })),
    ...departments.map((d) => ({
      key: `dept-${d}`,
      label: departmentLabel(d, lang),
      onRemove: () => toggleValue("dept", d),
    })),
    ...universityIds.map((id) => ({
      key: `uni-${id}`,
      label: universityById(id)?.name.en ?? id,
      onRemove: () => toggleValue("uni", id),
    })),
    ...(q ? [{ key: "q", label: `"${q}"`, onRemove: () => setValue("q", "") }] : []),
  ];

  const filters = (
    <>
      <FilterGroup label={c.filters}>
        <SearchField value={q} onChange={(v) => setValue("q", v)} placeholder={c.searchCoursePlaceholder} />
      </FilterGroup>

      <FilterGroup label={c.levelLabel}>
        {COURSE_LEVELS.map((l) => (
          <CheckRow
            key={l}
            label={levelLabel(l, lang)}
            count={COURSE_COUNT_BY_LEVEL[l]}
            checked={levels.includes(l)}
            onToggle={() => toggleValue("level", l)}
          />
        ))}
      </FilterGroup>

      <FilterGroup label={c.deptLabel}>
        {COURSE_DEPARTMENTS.map((d) => (
          <CheckRow
            key={d}
            label={departmentLabel(d, lang)}
            count={COURSE_COUNT_BY_DEPARTMENT[d]}
            checked={departments.includes(d)}
            onToggle={() => toggleValue("dept", d)}
          />
        ))}
      </FilterGroup>

      <FilterGroup label={c.uniLabel}>
        {UNIS_WITH_COURSES.map((u) => (
          <CheckRow
            key={u.id}
            label={u.name.en}
            count={u.courseCount}
            checked={universityIds.includes(u.id)}
            onToggle={() => toggleValue("uni", u.id)}
          />
        ))}
      </FilterGroup>
    </>
  );

  const countWord = results.length === 1 ? c.courseCount_one : c.courseCount_other;

  return (
    <>
      <header className="mx-auto max-w-6xl px-6 pb-10 pt-16">
        <div className="mb-5">
          <CountryPills />
        </div>
        <h1 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">{c.courseTitle}</h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/70">{c.courseSub}</p>
      </header>

      <CatalogueShell
        filters={filters}
        filterLabel={c.filters}
        doneLabel={c.done}
        activeCount={activeCount}
        toolbar={
          <>
            <div className="min-w-0 flex-1 md:hidden">
              <SearchField value={q} onChange={(v) => setValue("q", v)} placeholder={c.searchCoursePlaceholder} />
            </div>
            <p className="hidden text-sm font-semibold text-ink/50 md:block">
              <span className="tabular-nums text-ink">{results.length}</span> {countWord}
            </p>
            <label className="ml-auto flex shrink-0 items-center gap-2 text-xs text-ink/40">
              <span className="hidden sm:inline">{c.sortLabel}</span>
              <select
                value={sort}
                onChange={(e) => setValue("sort", e.target.value === "relevance" ? "" : e.target.value)}
                className="border-0 border-b-2 hairline bg-transparent py-1 text-xs font-semibold text-ink focus:border-coral focus:outline-none"
              >
                <option value="relevance">{c.sortRelevance}</option>
                <option value="name">{c.sortName}</option>
                <option value="duration">{c.sortDuration}</option>
              </select>
            </label>
          </>
        }
      >
        {chips.length > 0 && (
          <div className="mb-6">
            <ActiveChips chips={chips} onClear={clearAll} clearLabel={c.clearAll} />
          </div>
        )}

        {results.length === 0 ? (
          <EmptyState title={c.emptyTitle} body={c.emptyBody} cta={c.emptyCta} onClear={clearAll} />
        ) : (
          <ul className="border-y hairline">
            {results.map((course) => {
              const uni = universityById(course.universityId);
              const dur = durationLabel(course.durationMonths, lang);
              return (
                <li key={course.id} className="border-b hairline last:border-b-0">
                  <Link
                    to={`/courses/${course.slug}`}
                    className="group flex items-start gap-4 py-5 transition-colors hover:bg-parchment/40 sm:items-center sm:gap-5"
                  >
                    {uni && <UniversityLogo logo={uni.logo} name={uni.name.en} size="sm" />}

                    <div className="min-w-0 flex-1">
                      <h2 className="font-display text-base leading-snug text-navy group-hover:text-coral md:text-lg">
                        {course.name.en}
                      </h2>
                      <p className="mt-1 text-xs font-semibold text-ink/60">{uni?.name.en}</p>
                      <p className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-ink/40">
                        <span className="rounded-full bg-parchment px-2 py-0.5 font-semibold text-ink/60">
                          {levelLabel(course.level, lang)}
                        </span>
                        <span>{departmentLabel(course.department, lang)}</span>
                        {dur && <span>· {dur}</span>}
                        {course.intakes && course.intakes.length > 0 && (
                          <span className="hidden sm:inline">· {course.intakes.join(", ")}</span>
                        )}
                      </p>
                    </div>

                    <span className="mt-1 shrink-0 text-ink/25 transition-all group-hover:translate-x-1 group-hover:text-coral sm:mt-0">
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </CatalogueShell>
    </>
  );
}
