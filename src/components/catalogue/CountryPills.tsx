import { useLang } from "../../i18n";

/** Malaysia is the only country in the catalogue today. The other three
 * destinations render as disabled pills rather than disappearing, so the
 * page reads as "more coming" instead of "we only cover one country." */
export default function CountryPills() {
  const { t } = useLang();
  const countries = [
    { label: t.nav.malaysia, active: true },
    { label: t.nav.romania, active: false },
    { label: t.nav.georgia, active: false },
    { label: t.nav.china, active: false },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {countries.map((country) =>
        country.active ? (
          <span
            key={country.label}
            className="label-caps rounded-full border-2 border-coral bg-coral/10 px-3.5 py-1.5 text-navy"
          >
            {country.label}
          </span>
        ) : (
          <span
            key={country.label}
            className="label-caps flex items-center gap-1.5 rounded-full border-2 border-ink/10 px-3.5 py-1.5 text-ink/30"
          >
            {country.label}
            <span className="text-[10px] font-semibold normal-case tracking-normal">
              · {t.catalogue.countryComingSoon}
            </span>
          </span>
        ),
      )}
    </div>
  );
}
