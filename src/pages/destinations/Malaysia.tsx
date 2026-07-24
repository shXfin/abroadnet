import DestinationSteps from "../../components/DestinationSteps";
import { MALAYSIA_UNIVERSITIES } from "../../data/universities";
import { useLang } from "../../i18n";

function MalaysiaExtras() {
  const { t } = useLang();
  const m = t.malaysia;

  return (
    <>
      <section className="border-y hairline bg-parchment/40 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="label-caps text-ink/50">{m.whoCanApplyKicker}</p>
          <div className="mt-6 grid gap-px border hairline bg-ink/15 sm:grid-cols-2 lg:grid-cols-5">
            {m.whoCanApply.map((row) => (
              <div key={row.from} className="bg-paper p-6">
                <p className="label-caps text-ink/40">{row.from}</p>
                <p className="mt-2 font-display text-lg text-navy">{row.to}</p>
              </div>
            ))}
          </div>

          <p className="label-caps mt-14 text-ink/50">{m.eligibilityKicker}</p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b-2 border-ink/15">
                  <th className="py-3 pr-4 font-semibold text-ink/50">{m.eligibilityHeaders.program}</th>
                  <th className="py-3 pr-4 font-semibold text-ink/50">{m.eligibilityHeaders.academic}</th>
                  <th className="py-3 font-semibold text-ink/50">{m.eligibilityHeaders.english}</th>
                </tr>
              </thead>
              <tbody>
                {m.eligibility.map((row) => (
                  <tr key={row.program} className="border-b hairline">
                    <td className="py-3 pr-4 font-display text-lg text-navy">{row.program}</td>
                    <td className="py-3 pr-4 text-ink/70">{row.academic}</td>
                    <td className="py-3 text-ink/70">{row.english}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="label-caps mt-14 text-ink/50">{m.requirementsKicker}</p>
          <div className="mt-6 grid gap-px border hairline bg-ink/15 sm:grid-cols-3">
            {m.requirements.map((req) => (
              <div key={req.label} className="bg-paper p-6">
                <p className="label-caps text-ink/40">{req.label}</p>
                <p className="mt-2 font-display text-xl text-navy">{req.value}</p>
              </div>
            ))}
          </div>

          <p className="label-caps mt-14 text-ink/50">{m.englishTestsKicker}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {m.englishTests.map((testName) => (
              <span
                key={testName}
                className="rounded-full border-2 border-navy/15 px-5 py-2 text-sm font-semibold text-navy"
              >
                {testName}
              </span>
            ))}
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/60">{m.englishTestsNote}</p>

          <p className="label-caps mt-14 text-ink/50">{m.studyGapKicker}</p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/60">{m.studyGapNote}</p>
          <div className="mt-6 grid gap-px border hairline bg-ink/15 sm:grid-cols-5">
            {m.studyGap.map((row) => (
              <div key={row.program} className="bg-paper p-6">
                <p className="label-caps text-ink/40">{row.program}</p>
                <p className="mt-2 font-display text-lg text-navy">{row.gap}</p>
              </div>
            ))}
          </div>

          <p className="label-caps mt-14 text-ink/50">{m.programsKicker}</p>
          <div className="mt-6 grid gap-8 md:grid-cols-3">
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
              <h3 className="font-display text-2xl">{m.bachelorLabel}</h3>
              <ul className="mt-4 space-y-2 text-sm text-ink/70">
                {m.bachelorList.map((program) => (
                  <li key={program} className="border-b hairline pb-2">
                    {program}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="label-caps mt-14 text-ink/50">{m.documentsKicker}</p>
          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {m.documents.map((group) => (
              <div key={group.label}>
                <h3 className="font-display text-xl">{group.label}</h3>
                <ul className="mt-4 space-y-2 text-sm text-ink/70">
                  {group.list.map((doc) => (
                    <li key={doc} className="border-b hairline pb-2">
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="label-caps mt-14 text-ink/50">{m.embassyKicker}</p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/60">{m.embassyIntro}</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {m.embassyDocuments.map((doc) => (
              <li key={doc} className="border-b hairline pb-2 text-sm text-ink/70">
                {doc}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink/60">{m.financialProofNote}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="label-caps text-ink/50">{m.costKicker}</p>
        <div className="mt-6 grid gap-px border hairline bg-ink/15 sm:grid-cols-2 md:grid-cols-5">
          {m.tuition.map((row) => (
            <div key={row.program} className="bg-paper p-6">
              <p className="label-caps text-ink/40">{row.program}</p>
              <p className="mt-2 font-display text-lg text-navy">{row.value}</p>
            </div>
          ))}
          <div className="bg-navy p-6 text-white">
            <p className="label-caps text-white/50">{m.livingCostLabel}</p>
            <p className="mt-2 font-display text-lg">{m.livingCostValue}</p>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/60">{m.scholarshipsNote}</p>

        <p className="label-caps mt-14 text-ink/50">{m.intakesKicker}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {m.intakes.map((intake) => (
            <span
              key={intake}
              className="rounded-full border-2 border-navy/15 px-5 py-2 text-sm font-semibold text-navy"
            >
              {intake}
            </span>
          ))}
        </div>

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-ink/60">{m.partTimeNote}</p>
        <div className="mt-6 grid gap-8 sm:grid-cols-2">
          <div>
            <p className="label-caps text-ink/40">{m.partTimeApprovedKicker}</p>
            <ul className="mt-3 space-y-2 text-sm text-ink/70">
              {m.partTimeApproved.map((job) => (
                <li key={job} className="border-b hairline pb-2">
                  {job}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label-caps text-ink/40">{m.partTimeRestrictedKicker}</p>
            <ul className="mt-3 space-y-2 text-sm text-ink/70">
              {m.partTimeRestricted.map((job) => (
                <li key={job} className="border-b hairline pb-2">
                  {job}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y hairline bg-parchment/40 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="label-caps text-ink/50">{m.creditTransferKicker}</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl md:text-4xl">{m.creditTransferTitle}</h2>

          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <ul className="space-y-3 text-sm text-ink/70">
              {m.creditTransferWho.map((who) => (
                <li key={who} className="border-b hairline pb-3">
                  {who}
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-2 gap-px border hairline bg-ink/15">
              {m.creditTransferBenefits.map((benefit) => (
                <div key={benefit} className="bg-paper p-5">
                  <p className="font-display text-base text-navy">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-ink/50">{m.creditTransferNote}</p>

          <p className="label-caps mt-14 text-ink/50">{m.transferCountriesKicker}</p>
          <h3 className="mt-3 max-w-2xl font-display text-2xl md:text-3xl">{m.transferCountriesTitle}</h3>
          <div className="mt-6 flex flex-wrap gap-3">
            {m.transferCountries.map((country) => (
              <span
                key={country}
                className="rounded-full border-2 border-navy/15 px-5 py-2 text-sm font-semibold text-navy"
              >
                {country}
              </span>
            ))}
          </div>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink/50">{m.transferCountriesNote}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="label-caps text-coral">{m.faqKicker}</p>
        <h2 className="mt-3 font-display text-3xl md:text-4xl">{m.faqTitle}</h2>

        <div className="mt-10 divide-y hairline border-t hairline">
          {m.faq.map((item) => (
            <details key={item.q} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-lg text-navy md:text-xl">
                {item.q}
                <span className="shrink-0 text-2xl text-coral transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/60">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
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
      heroImage="photos/malaysia-mahsa-visit.jpg"
    />
  );
}
