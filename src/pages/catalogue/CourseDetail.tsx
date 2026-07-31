import { Link, Navigate, useParams } from "react-router-dom";
import { useLang } from "../../i18n";
import UniversityLogo from "../../components/catalogue/UniversityLogo";
import { handleAssessmentLinkClick } from "../../lib/assessmentJump";
import { buildWhatsAppUrl } from "../../lib/whatsapp";
import WhatsAppIcon from "../../components/icons/WhatsAppIcon";
import {
  courseBySlug,
  coursesForUniversity,
  durationLabel,
  formatFeeRange,
  universityById,
} from "../../data/catalogue";
import { departmentLabel, levelLabel } from "../../data/catalogue/types";

export default function CourseDetail() {
  const { slug } = useParams();
  const { t, lang } = useLang();
  const c = t.catalogue;
  const course = slug ? courseBySlug(slug) : undefined;

  if (!course) return <Navigate to="/courses" replace />;

  const uni = universityById(course.universityId);
  const dur = durationLabel(course.durationMonths, lang);
  // Fee range for this course's own level, not the institution's headline range.
  const range = uni?.feeRanges.find((f) => f.level === course.level);
  const siblings = uni
    ? coursesForUniversity(uni.id)
        .filter((x) => x.id !== course.id && x.department === course.department)
        .slice(0, 5)
    : [];
  const whatsappUrl = buildWhatsAppUrl(
    uni ? `Hi, I'm interested in ${course.name.en} at ${uni.name.en}.` : `Hi, I'm interested in ${course.name.en}.`,
  );

  return (
    <>
      <section className="mx-auto max-w-4xl px-6 pb-12 pt-12">
        <Link to="/courses" className="label-caps text-ink/40 hover:text-coral">
          ← {c.backToCourses}
        </Link>

        <p className="label-caps mt-8 text-coral">{levelLabel(course.level, lang)}</p>
        <h1 className="mt-3 font-display text-3xl leading-tight tracking-tight md:text-5xl">
          {course.name.en}
        </h1>

        {uni && (
          <Link
            to={`/universities/${uni.slug}`}
            className="group mt-6 inline-flex items-center gap-3 border hairline bg-paper py-2.5 pl-2.5 pr-5 transition-colors hover:border-coral"
          >
            <UniversityLogo logo={uni.logo} name={uni.name.en} size="sm" />
            <span>
              <span className="block text-sm font-semibold text-navy group-hover:text-coral">
                {uni.name.en}
              </span>
              {uni.city && <span className="block text-xs text-ink/45">{uni.city}, Malaysia</span>}
            </span>
            <span className="text-ink/25 transition-transform group-hover:translate-x-1 group-hover:text-coral">
              →
            </span>
          </Link>
        )}

        <div className="mt-8 grid gap-px border hairline bg-ink/15 sm:grid-cols-2 md:grid-cols-4">
          <Fact label={c.deptLabel} value={departmentLabel(course.department, lang)} />
          <Fact label={c.duration} value={dur || "—"} />
          <Fact label={c.intakes} value={course.intakes?.join(", ") || "—"} />
          <Fact
            label={c.indicativeFees}
            value={range ? formatFeeRange(range.minTotal, range.maxTotal) : c.feesOnRequest}
          />
        </div>

        {course.campus && (
          <p className="mt-4 text-sm text-ink/60">
            <span className="label-caps text-ink/40">{c.campus}</span> {course.campus}
          </p>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-whatsapp">
            <WhatsAppIcon className="h-5 w-5" />
            {c.chatOnWhatsapp}
          </a>
          <Link to="/#assessment" onClick={handleAssessmentLinkClick} className="btn-ghost">
            {c.takeAssessment}
          </Link>
          {uni && (
            <Link to={`/universities/${uni.slug}`} className="btn-ghost">
              {c.viewUniversity}
            </Link>
          )}
        </div>

        <p className="mt-6 max-w-2xl text-xs leading-relaxed text-ink/40">{c.aboutFees}</p>
      </section>

      {siblings.length > 0 && (
        <section className="border-t hairline bg-parchment/30 py-14">
          <div className="mx-auto max-w-4xl px-6">
            <p className="label-caps text-ink/40">{departmentLabel(course.department, lang)}</p>
            <ul className="mt-4 border-y hairline bg-paper">
              {siblings.map((s) => (
                <li key={s.id} className="border-b hairline last:border-b-0">
                  <Link
                    to={`/courses/${s.slug}`}
                    className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-parchment/50"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold leading-snug text-navy group-hover:text-coral">
                        {s.name.en}
                      </span>
                      <span className="mt-0.5 block text-xs text-ink/45">
                        {levelLabel(s.level, lang)}
                      </span>
                    </span>
                    <span className="shrink-0 text-ink/25 transition-all group-hover:translate-x-1 group-hover:text-coral">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
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
