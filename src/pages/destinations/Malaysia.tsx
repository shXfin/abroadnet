import DestinationSteps from "../../components/DestinationSteps";
import { MALAYSIA_UNIVERSITIES } from "../../data/universities";
import { useLang } from "../../i18n";

function MalaysiaExtras() {
  const { t } = useLang();
  const m = t.malaysia;

  return (
    <section className="border-y hairline bg-parchment/40 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <p className="label-caps text-ink/50">{m.requirementsKicker}</p>
        <div className="mt-8 grid gap-px border hairline bg-ink/15 sm:grid-cols-3">
          {m.requirements.map((req) => (
            <div key={req.label} className="bg-paper p-6">
              <p className="label-caps text-ink/40">{req.label}</p>
              <p className="mt-2 font-display text-xl text-navy">{req.value}</p>
            </div>
          ))}
        </div>

        <p className="label-caps mt-14 text-ink/50">{m.programsKicker}</p>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="font-display text-2xl">{m.diplomaLabel}</h3>
            <ul className="mt-4 space-y-2 text-sm text-ink/70">
              {m.diplomaList.map((program) => (
                <li key={program} className="border-b hairline pb-2">
                  {program}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display text-2xl">{m.foundationLabel}</h3>
            <ul className="mt-4 space-y-2 text-sm text-ink/70">
              {m.foundationList.map((program) => (
                <li key={program} className="border-b hairline pb-2">
                  {program}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Malaysia() {
  const { t } = useLang();
  return (
    <DestinationSteps
      country={t.malaysia.country}
      code="KUL"
      intro={t.malaysia.intro}
      steps={t.malaysia.steps}
      partnerUniversities={MALAYSIA_UNIVERSITIES}
      extra={<MalaysiaExtras />}
    />
  );
}
