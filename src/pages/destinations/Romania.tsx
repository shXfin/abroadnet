import DestinationSteps from "../../components/DestinationSteps";
import { ROMANIA_UNIVERSITIES } from "../../data/universities";
import { useLang } from "../../i18n";

function RomaniaExtras() {
  const { t } = useLang();
  const r = t.romania;

  return (
    <>
      <section className="border-y hairline bg-parchment/40 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="label-caps text-ink/50">{r.pathwayKicker}</p>
          <div className="mt-6 grid gap-px border hairline bg-ink/15 sm:grid-cols-3">
            {r.pathway.map((row) => (
              <div key={row.from} className="bg-paper p-6">
                <p className="label-caps text-ink/40">{row.from}</p>
                <p className="mt-2 font-display text-lg text-navy">{row.to}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/60">{r.pathwayNote}</p>

          <p className="label-caps mt-14 text-ink/50">{r.eligibilityKicker}</p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b-2 border-ink/15">
                  <th className="py-3 pr-4 font-semibold text-ink/50">{r.eligibilityHeaders.program}</th>
                  <th className="py-3 pr-4 font-semibold text-ink/50">{r.eligibilityHeaders.academic}</th>
                  <th className="py-3 font-semibold text-ink/50">{r.eligibilityHeaders.english}</th>
                </tr>
              </thead>
              <tbody>
                {r.eligibility.map((row) => (
                  <tr key={row.program} className="border-b hairline">
                    <td className="py-3 pr-4 font-display text-lg text-navy">{row.program}</td>
                    <td className="py-3 pr-4 text-ink/70">{row.academic}</td>
                    <td className="py-3 text-ink/70">{row.english}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="label-caps mt-14 text-ink/50">{r.requirementsKicker}</p>
          <div className="mt-6 grid gap-px border hairline bg-ink/15 sm:grid-cols-2">
            {r.requirements.map((req) => (
              <div key={req.label} className="bg-paper p-6">
                <p className="label-caps text-ink/40">{req.label}</p>
                <p className="mt-2 font-display text-xl text-navy">{req.value}</p>
              </div>
            ))}
          </div>

          <p className="label-caps mt-14 text-ink/50">{r.englishTestsKicker}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {r.englishTests.map((testName) => (
              <span
                key={testName}
                className="rounded-full border-2 border-navy/15 px-5 py-2 text-sm font-semibold text-navy"
              >
                {testName}
              </span>
            ))}
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/60">{r.englishTestsNote}</p>

          <p className="label-caps mt-14 text-ink/50">{r.studyGapKicker}</p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/60">{r.studyGapNote}</p>
          <div className="mt-6 grid gap-px border hairline bg-ink/15 sm:grid-cols-3">
            {r.studyGap.map((row) => (
              <div key={row.program} className="bg-paper p-6">
                <p className="label-caps text-ink/40">{row.program}</p>
                <p className="mt-2 font-display text-lg text-navy">{row.gap}</p>
              </div>
            ))}
          </div>

          <p className="label-caps mt-14 text-ink/50">{r.programsKicker}</p>
          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {r.programCategories.map((category) => (
              <div key={category.label}>
                <h3 className="font-display text-2xl">{category.label}</h3>
                <ul className="mt-4 space-y-2 text-sm text-ink/70">
                  {category.list.map((course) => (
                    <li key={course} className="border-b hairline pb-2">
                      {course}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="label-caps mt-14 text-ink/50">{r.documentsKicker}</p>
          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {r.documents.map((group) => (
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
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/60">{r.documentsNote}</p>

          <p className="label-caps mt-14 text-ink/50">{r.embassyKicker}</p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/60">{r.embassyIntro}</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {r.embassyDocuments.map((doc) => (
              <li key={doc} className="border-b hairline pb-2 text-sm text-ink/70">
                {doc}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink/60">{r.financialProofNote}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="label-caps text-ink/50">{r.costKicker}</p>
        <div className="mt-6 grid gap-px border hairline bg-ink/15 sm:grid-cols-2 md:grid-cols-4">
          {r.tuition.map((row) => (
            <div key={row.program} className="bg-paper p-6">
              <p className="label-caps text-ink/40">{row.program}</p>
              <p className="mt-2 font-display text-lg text-navy">{row.value}</p>
            </div>
          ))}
          <div className="bg-navy p-6 text-white">
            <p className="label-caps text-white/50">{r.livingCostLabel}</p>
            <p className="mt-2 font-display text-lg">{r.livingCostValue}</p>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/60">{r.scholarshipsNote}</p>

        <p className="label-caps mt-14 text-ink/50">{r.intakesKicker}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {r.intakes.map((intake) => (
            <span
              key={intake}
              className="rounded-full border-2 border-navy/15 px-5 py-2 text-sm font-semibold text-navy"
            >
              {intake}
            </span>
          ))}
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/60">{r.applicationWindowNote}</p>

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-ink/60">{r.partTimeNote}</p>
        <div className="mt-6">
          <p className="label-caps text-ink/40">{r.partTimeApprovedKicker}</p>
          <ul className="mt-3 grid gap-2 text-sm text-ink/70 sm:grid-cols-2">
            {r.partTimeApproved.map((job) => (
              <li key={job} className="border-b hairline pb-2">
                {job}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y hairline bg-parchment/40 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="label-caps text-ink/50">{r.processingKicker}</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl md:text-4xl">{r.processingTitle}</h2>
          <div className="mt-10 grid gap-px border hairline bg-ink/15 sm:grid-cols-2 md:grid-cols-4">
            {r.processing.map((row) => (
              <div key={row.stage} className="bg-paper p-6">
                <p className="text-sm text-ink/60">{row.stage}</p>
                <p className="mt-2 font-display text-lg text-navy">{row.time}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 font-display text-xl text-navy">{r.processingTotal}</p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/50">{r.processingNote}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="label-caps text-coral">{r.faqKicker}</p>
        <h2 className="mt-3 font-display text-3xl md:text-4xl">{r.faqTitle}</h2>

        <div className="mt-10 divide-y hairline border-t hairline">
          {r.faq.map((item) => (
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

export default function Romania() {
  const { t } = useLang();
  return (
    <DestinationSteps
      country={t.romania.country}
      code="OTP"
      intro={t.romania.intro}
      steps={t.romania.steps}
      partnerUniversities={ROMANIA_UNIVERSITIES}
      extra={<RomaniaExtras />}
    />
  );
}
