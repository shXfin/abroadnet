import { useState } from "react";
import { useLang } from "../i18n";

type Story = {
  name: string;
  destination: string;
  university: string;
  outcome: "visaApproved" | "arrived";
  photo: string;
};

// Real placements, confirmed from the client's own marketing materials.
// Captions state the outcome factually rather than inventing quotes for real people.
const STORIES: Story[] = [
  {
    name: "Md Rakibul Islam",
    destination: "Georgia",
    university: "Alte University",
    outcome: "visaApproved",
    photo: "/photos/georgia-visa-rakibul.jpg",
  },
  {
    name: "Imran Hossain Shanto",
    destination: "Malaysia",
    university: "Mahsa Avenue International College",
    outcome: "arrived",
    photo: "/photos/malaysia-arrival-imran.jpg",
  },
  {
    name: "Md Ruhel Miah",
    destination: "Malaysia",
    university: "Mahsa Avenue International College",
    outcome: "arrived",
    photo: "/photos/malaysia-arrival-ruhel.jpg",
  },
  {
    name: "Mehedi Hasan Supto",
    destination: "Romania",
    university: "West University of Timișoara · Bachelor of Informatics",
    outcome: "visaApproved",
    photo: "/photos/romania-visa-mehedi.jpg",
  },
  {
    name: "Sunny Saleh",
    destination: "Malaysia",
    university: "Universiti Tun Abdul Razak · Bachelor of Computer Science",
    outcome: "visaApproved",
    photo: "/photos/malaysia-visa-sunny.jpg",
  },
];

function StoryPhoto({ story }: { story: Story }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <span className="font-mono text-xs text-ink/30">PHOTO PENDING</span>;
  }
  return (
    <img
      src={story.photo}
      alt={story.name}
      className="h-full w-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}

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
        <div className="grid gap-px border hairline bg-ink/15 sm:grid-cols-2 md:grid-cols-3">
          {STORIES.map((story) => (
            <figure key={story.name} className="flex flex-col bg-paper">
              <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-parchment/40">
                <StoryPhoto story={story} />
              </div>
              <figcaption className="p-6">
                <p className="label-caps text-coral">
                  {story.outcome === "visaApproved" ? t.students.outcomeVisaApproved : t.students.outcomeArrived}
                </p>
                <p className="mt-2 font-semibold text-navy">{story.name}</p>
                <p className="text-sm text-ink/50">
                  {story.university} · {story.destination}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
