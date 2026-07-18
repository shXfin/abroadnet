import { useLang } from "../i18n";

type Story = {
  name: string;
  destination: string;
  university: string;
  quote: string;
};

// TODO: fill with real students — name, university, quote, photo, proof (visa/offer letter).
const STORIES: Story[] = [];

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
        {STORIES.length === 0 ? (
          <div className="grid gap-px border hairline bg-ink/15 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex aspect-[4/5] flex-col justify-between bg-paper p-8">
                <span className="font-mono text-xs text-ink/30">STUDENT 0{i}</span>
                <div>
                  <p className="font-display text-2xl text-ink/40">
                    {t.students.placeholderQuote}
                  </p>
                  <p className="mt-4 text-xs text-ink/40">{t.students.placeholderMeta}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-px border hairline bg-ink/15 md:grid-cols-3">
            {STORIES.map((story) => (
              <figure key={story.name} className="flex flex-col justify-between bg-paper p-8">
                <blockquote className="font-display text-2xl">"{story.quote}"</blockquote>
                <figcaption className="mt-6 text-sm">
                  <p className="font-semibold text-navy">{story.name}</p>
                  <p className="text-ink/50">
                    {story.university} · {story.destination}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
