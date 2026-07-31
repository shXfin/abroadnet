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
import {
  CITIES,
  UNIVERSITIES,
  UNIVERSITY_COUNT_BY_CITY,
  UNIVERSITY_COUNT_BY_LEVEL,
  UNIVERSITY_LEVELS,
  filterUniversities,
  formatFeeRange,
} from "../../data/catalogue";
import { LEVEL_ORDER, levelLabel, type Level } from "../../data/catalogue/types";
import { useCatalogueFilters } from "../../lib/useCatalogueFilters";

export default function Universities() {
  const { t, lang } = useLang();
  const c = t.catalogue;
  const { get, getAll, setValue, toggleValue, clearAll, activeCount } = useCatalogueFilters();

  const q = get("q");
  const levels = getAll("level") as Level[];
  const cities = getAll("city");
  const partnersOnly = get("partners") === "1";

  const results = useMemo(
    () => filterUniversities(UNIVERSITIES, { q, levels, cities, partnersOnly }),
    [q, levels.join(), cities.join(), partnersOnly],
  );

  const chips = [
    ...(partnersOnly
      ? [{ key: "partners", label: c.partnersOnly, onRemove: () => setValue("partners", "") }]
      : []),
    ...levels.map((l) => ({
      key: `level-${l}`,
      label: levelLabel(l, lang),
      onRemove: () => toggleValue("level", l),
    })),
    ...cities.map((city) => ({
      key: `city-${city}`,
      label: city,
      onRemove: () => toggleValue("city", city),
    })),
    ...(q ? [{ key: "q", label: `"${q}"`, onRemove: () => setValue("q", "") }] : []),
  ];

  const filters = (
    <>
      <FilterGroup label={c.filters}>
        <SearchField value={q} onChange={(v) => setValue("q", v)} placeholder={c.searchUniPlaceholder} />
        <div className="mt-4">
          <CheckRow
            label={c.partnersOnly}
            checked={partnersOnly}
            onToggle={() => setValue("partners", partnersOnly ? "" : "1")}
          />
        </div>
      </FilterGroup>

      <FilterGroup label={c.levelLabel}>
        {UNIVERSITY_LEVELS.map((l) => (
          <CheckRow
            key={l}
            label={levelLabel(l, lang)}
            count={UNIVERSITY_COUNT_BY_LEVEL[l]}
            checked={levels.includes(l)}
            onToggle={() => toggleValue("level", l)}
          />
        ))}
      </FilterGroup>

      <FilterGroup label={c.cityLabel}>
        {CITIES.map((city) => (
          <CheckRow
            key={city}
            label={city}
            count={UNIVERSITY_COUNT_BY_CITY[city]}
            checked={cities.includes(city)}
            onToggle={() => toggleValue("city", city)}
          />
        ))}
      </FilterGroup>
    </>
  );

  const countWord = results.length === 1 ? c.uniCount_one : c.uniCount_other;

  return (
    <>
      <header className="mx-auto max-w-6xl px-6 pb-10 pt-16">
        <div className="mb-5">
          <CountryPills />
        </div>
        <h1 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">{c.uniTitle}</h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/70">{c.uniSub}</p>
      </header>

      <CatalogueShell
        filters={filters}
        filterLabel={c.filters}
        doneLabel={c.done}
        activeCount={activeCount}
        toolbar={
          <>
            <div className="min-w-0 flex-1 md:hidden">
              <SearchField value={q} onChange={(v) => setValue("q", v)} placeholder={c.searchUniPlaceholder} />
            </div>
            <p className="hidden text-sm font-semibold text-ink/50 md:block">
              <span className="tabular-nums text-ink">{results.length}</span> {countWord}
            </p>
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
            {results.map((u) => {
              const range = u.feeRanges[0];
              return (
                <li key={u.id} className="border-b hairline last:border-b-0">
                  <Link
                    to={`/universities/${u.slug}`}
                    className="group flex items-center gap-4 py-5 transition-colors hover:bg-parchment/40 sm:gap-5"
                  >
                    <UniversityLogo logo={u.logo} name={u.name.en} size="md" />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                        <h2 className="font-display text-lg leading-snug text-navy group-hover:text-coral md:text-xl">
                          {u.name.en}
                        </h2>
                        {u.isPartner && (
                          <span className="label-caps rounded-full bg-navy px-2 py-0.5 text-[10px] text-white">
                            {c.partnerBadge}
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink/50">
                        {u.city && <span>{u.city}{u.state && u.state !== u.city ? `, ${u.state}` : ""}</span>}
                        {u.courseCount > 0 && (
                          <span className="text-ink/70">
                            {u.courseCount} {c.coursesAt}
                          </span>
                        )}
                        {u.levels.length > 0 && (
                          <span className="hidden sm:inline">
                            {LEVEL_ORDER.filter((l) => u.levels.includes(l))
                              .map((l) => levelLabel(l, lang))
                              .slice(0, 3)
                              .join(" · ")}
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="hidden shrink-0 text-right sm:block">
                      {range ? (
                        <>
                          <p className="label-caps text-ink/35">{c.indicativeFees}</p>
                          <p className="font-display text-sm text-navy">
                            {formatFeeRange(range.minTotal, range.maxTotal)}
                          </p>
                        </>
                      ) : (
                        <p className="text-xs text-ink/35">{c.feesOnRequest}</p>
                      )}
                    </div>

                    <span className="shrink-0 text-ink/25 transition-all group-hover:translate-x-1 group-hover:text-coral">
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

export function EmptyState({
  title,
  body,
  cta,
  onClear,
}: {
  title: string;
  body: string;
  cta: string;
  onClear: () => void;
}) {
  return (
    <div className="border hairline bg-parchment/30 px-6 py-16 text-center">
      <p className="font-display text-2xl text-navy">{title}</p>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink/60">{body}</p>
      <button onClick={onClear} className="btn-primary mt-6">
        {cta}
      </button>
    </div>
  );
}
