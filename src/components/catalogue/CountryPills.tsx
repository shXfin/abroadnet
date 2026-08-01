import { useLang } from "../../i18n";
import { CATALOGUE_COUNTRIES } from "../../data/catalogue";
import { useCatalogueFilters } from "../../lib/useCatalogueFilters";

/** Malaysia and Romania have real catalogue data; Georgia/China render as
 * disabled pills rather than disappearing, so the page reads as "more
 * coming" instead of "we only cover these two countries." Clicking a live
 * pill filters the current page to that country; clicking the active pill
 * again clears back to showing every country. */
export default function CountryPills() {
  const { t } = useLang();
  const { get, setValue } = useCatalogueFilters();
  const selected = get("country");

  const countries = [
    { value: "malaysia", label: t.nav.malaysia, hasData: true },
    { value: "romania", label: t.nav.romania, hasData: true },
    { value: "georgia", label: t.nav.georgia, hasData: false },
    { value: "china", label: t.nav.china, hasData: false },
  ] as const;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {countries.map((country) => {
        if (!country.hasData || !CATALOGUE_COUNTRIES.includes(country.value as never)) {
          return (
            <span
              key={country.value}
              className="label-caps flex items-center gap-1.5 rounded-full border-2 border-ink/10 px-3.5 py-1.5 text-ink/30"
            >
              {country.label}
              <span className="text-[10px] font-semibold normal-case tracking-normal">
                · {t.catalogue.countryComingSoon}
              </span>
            </span>
          );
        }

        const active = selected === country.value;
        return (
          <button
            key={country.value}
            type="button"
            onClick={() => setValue("country", active ? "" : country.value)}
            className={`label-caps rounded-full border-2 px-3.5 py-1.5 transition-colors ${
              active ? "border-coral bg-coral/10 text-navy" : "border-ink/15 text-ink/50 hover:border-ink/30"
            }`}
          >
            {country.label}
          </button>
        );
      })}
    </div>
  );
}
