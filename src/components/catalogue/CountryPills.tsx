import { useLang } from "../../i18n";
import { CATALOGUE_COUNTRIES } from "../../data/catalogue";
import { useCatalogueFilters } from "../../lib/useCatalogueFilters";

/** Every country the site talks about somewhere, listed once. Whether a
 * pill is live or "coming soon" is derived from CATALOGUE_COUNTRIES alone
 * — add a country's data there and its pill activates automatically,
 * instead of a second hand-maintained flag going stale (that's exactly how
 * the country-scoped-filter bug happened before). Exactly one country is
 * always active — Malaysia by default when the URL carries no explicit
 * choice, so the pill state always matches what's on screen. */
export default function CountryPills() {
  const { t } = useLang();
  const { get, setValue } = useCatalogueFilters();
  const selected = get("country") || "malaysia";

  const countries = [
    { value: "malaysia", label: t.nav.malaysia },
    { value: "italy", label: t.nav.italy },
    { value: "china", label: t.nav.china },
    { value: "romania", label: t.nav.romania },
    { value: "georgia", label: t.nav.georgia },
  ] as const;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {countries.map((country) => {
        const hasData = CATALOGUE_COUNTRIES.includes(country.value as never);
        if (!hasData) {
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
            onClick={() => setValue("country", country.value)}
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
