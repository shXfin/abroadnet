import { Link, Navigate, useParams } from "react-router-dom";
import { useLang } from "../../i18n";
import UniversityLogo from "../../components/catalogue/UniversityLogo";
import { handleAssessmentLinkClick } from "../../lib/assessmentJump";
import { buildWhatsAppUrl } from "../../lib/whatsapp";
import WhatsAppIcon from "../../components/icons/WhatsAppIcon";
import {
  coursesForUniversity,
  durationLabel,
  formatFeeRange,
  universityBySlug,
} from "../../data/catalogue";
import { LEVEL_ORDER, departmentLabel, levelLabel } from "../../data/catalogue/types";

export default function UniversityDetail() {
  const { slug } = useParams();
  const { t, lang } = useLang();
  const c = t.catalogue;
  const uni = slug ? universityBySlug(slug) : undefined;

  if (!uni) return <Navigate to="/universities" replace />;

  const courses = coursesForUniversity(uni.id);
  const whatsappUrl = buildWhatsAppUrl(`Hi, I want to apply at ${uni.name.en}.`);
  const byLevel = LEVEL_ORDER.map((level) => ({
    level,
    items: courses.filter((x) => x.level === level),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      <section className="mx-auto max-w-5xl px-6 pb-12 pt-12">
        <Link to="/universities" className="label-caps text-ink/40 hover:text-coral">
          ← {c.backToUnis}
        </Link>

        <div className="mt-8 flex flex-wrap items-start gap-6">
          <UniversityLogo logo={uni.logo} name={uni.name.en} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-3xl tracking-tight md:text-4xl">{uni.name.en}</h1>
              {uni.isPartner && (
                <span className="label-caps rounded-full bg-navy px-2.5 py-1 text-[10px] text-white">
                  {c.partnerBadge}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-ink/60">
              {uni.city ? `${uni.city}${uni.state && uni.state !== uni.city ? `, ${uni.state}` : ""}, Malaysia` : "Malaysia"}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-px border hairline bg-ink/15 sm:grid-cols-3">
          <Fact label={c.programme} value={courses.length > 0 ? String(courses.length) : "—"} />
          <Fact
            label={c.levelsOffered}
            value={
              uni.levels.length
                ? LEVEL_ORDER.filter((l) => uni.levels.includes(l))
                    .map((l) => levelLabel(l, lang))
                    .join(", ")
                : "—"
            }
          />
          <Fact
            label={c.indicativeFees}
            value={
              uni.feeRanges[0]
                ? formatFeeRange(uni.feeRanges[0].minTotal, uni.feeRanges[0].maxTotal)
                : c.feesOnRequest
            }
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-whatsapp">
            <WhatsAppIcon className="h-5 w-5" />
            {c.chatOnWhatsapp}
          </a>
          <Link to="/#assessment" onClick={handleAssessmentLinkClick} className="btn-ghost">
            {c.takeAssessment}
          </Link>
          {courses.length > 0 && (
            <Link to={`/courses?uni=${uni.id}`} className="btn-ghost">
              {c.viewCourses}
            </Link>
          )}
        </div>

        <p className="mt-6 max-w-2xl text-xs leading-relaxed text-ink/40">{c.aboutFees}</p>
      </section>

      {byLevel.length > 0 ? (
        <section className="border-t hairline bg-parchment/30 py-16">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="font-display text-2xl md:text-3xl">{c.viewCourses}</h2>
            <div className="mt-8 space-y-10">
              {byLevel.map((group) => (
                <div key={group.level}>
                  <p className="label-caps text-coral">{levelLabel(group.level, lang)}</p>
                  <ul className="mt-3 border-y hairline bg-paper">
                    {group.items.map((course) => {
                      const dur = durationLabel(course.durationMonths, lang);
                      return (
                        <li key={course.id} className="border-b hairline last:border-b-0">
                          <Link
                            to={`/courses/${course.slug}`}
                            className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-parchment/50"
                          >
                            <span className="min-w-0 flex-1">
                              <span className="block font-semibold leading-snug text-navy group-hover:text-coral">
                                {course.name.en}
                              </span>
                              <span className="mt-0.5 block text-xs text-ink/45">
                                {departmentLabel(course.department, lang)}
                                {dur && ` · ${dur}`}
                                {course.campus && ` · ${course.campus}`}
                              </span>
                            </span>
                            <span className="shrink-0 text-ink/25 transition-all group-hover:translate-x-1 group-hover:text-coral">
                              →
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-10 text-xs text-ink/35">{c.dataNote}</p>
          </div>
        </section>
      ) : (
        <section className="border-t hairline bg-parchment/30 py-16">
          <div className="mx-auto max-w-5xl px-6">
            <div className="border hairline bg-paper px-6 py-12 text-center">
              <p className="font-display text-xl text-navy">{c.noCoursesYet}</p>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink/60">{c.emptyBody}</p>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-whatsapp mt-6">
                <WhatsAppIcon className="h-5 w-5" />
                {c.chatOnWhatsapp}
              </a>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-paper p-5">
      <p className="label-caps text-ink/40">{label}</p>
      <p className="mt-1.5 font-display text-base leading-snug text-navy">{value}</p>
    </div>
  );
}
