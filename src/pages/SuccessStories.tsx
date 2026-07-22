import { useLang } from "../i18n";
import StudentStoriesGrid from "../components/StudentStoriesGrid";

export default function SuccessStories() {
  const { t } = useLang();

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-20">
        <p className="label-caps text-coral">{t.students.kicker}</p>
        <h1 className="mt-4 font-display text-5xl tracking-tight md:text-7xl">
          {t.students.titleA} <em>{t.students.titleB}</em>
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/70">{t.students.sub}</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <StudentStoriesGrid full />
      </section>
    </>
  );
}
