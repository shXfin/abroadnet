import { useState } from "react";
import { useLang } from "../i18n";
import { assetPath } from "../lib/assetPath";

type Story = {
  name: string;
  destination: string;
  university: string;
  outcome: "visaApproved" | "arrived";
  photo: string;
};

// Real placements, confirmed from the client's own marketing materials.
// Captions state the outcome factually rather than inventing quotes for real people.
const FEATURED: Story = {
  name: "Md Rakibul Islam",
  destination: "Georgia",
  university: "Alte University",
  outcome: "visaApproved",
  photo: "photos/georgia-visa-rakibul.jpg",
};

const STORIES: Story[] = [
  {
    name: "Imran Hossain Shanto",
    destination: "Malaysia",
    university: "Mahsa Avenue International College",
    outcome: "arrived",
    photo: "photos/malaysia-arrival-imran.jpg",
  },
  {
    name: "Md Ruhel Miah",
    destination: "Malaysia",
    university: "Mahsa Avenue International College",
    outcome: "arrived",
    photo: "photos/malaysia-arrival-ruhel.jpg",
  },
  {
    name: "Mehedi Hasan Supto",
    destination: "Romania",
    university: "West University of Timișoara · Bachelor of Informatics",
    outcome: "visaApproved",
    photo: "photos/romania-visa-mehedi.jpg",
  },
  {
    name: "Sunny Saleh",
    destination: "Malaysia",
    university: "Universiti Tun Abdul Razak · Bachelor of Computer Science",
    outcome: "visaApproved",
    photo: "photos/malaysia-visa-sunny.jpg",
  },
];

function Photo({ src, alt, fallbackLabel }: { src: string; alt: string; fallbackLabel: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <span className="font-mono text-xs text-ink/30">{fallbackLabel}</span>;
  }
  return (
    <img
      src={assetPath(src)}
      alt={alt}
      className="h-full w-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}

/** The real-placement proof section: one featured story (photo + real quote)
 * up top, the rest in a clean row underneath. Used inline on the homepage
 * and on the standalone /success-stories page, so it's never gated behind a click. */
export default function StudentStoriesGrid() {
  const { t } = useLang();

  return (
    <div className="space-y-8">
      {/* Featured */}
      <div className="grid gap-8 border hairline bg-parchment/30 p-6 md:grid-cols-[280px_1fr] md:p-10">
        <div className="flex aspect-square items-center justify-center overflow-hidden border hairline bg-paper">
          <Photo src={FEATURED.photo} alt={FEATURED.name} fallbackLabel="PHOTO PENDING" />
        </div>
        <div className="flex flex-col justify-center">
          <p className="label-caps text-coral">{t.spotlight.kicker}</p>
          <blockquote className="mt-3 font-display text-2xl md:text-3xl">"{t.spotlight.quote}"</blockquote>
          <p className="mt-5 text-sm font-semibold text-navy">{FEATURED.name}</p>
          <p className="text-sm text-ink/50">{t.spotlight.meta}</p>
        </div>
      </div>

      {/* Supporting proof */}
      <div className="grid gap-px border hairline bg-ink/15 sm:grid-cols-2 md:grid-cols-4">
        {STORIES.map((story) => (
          <figure key={story.name} className="flex flex-col bg-paper">
            <div className="flex aspect-square items-center justify-center overflow-hidden bg-parchment/40">
              <Photo src={story.photo} alt={story.name} fallbackLabel="PHOTO PENDING" />
            </div>
            <figcaption className="p-5">
              <p className="label-caps text-coral">
                {story.outcome === "visaApproved" ? t.students.outcomeVisaApproved : t.students.outcomeArrived}
              </p>
              <p className="mt-2 text-sm font-semibold text-navy">{story.name}</p>
              <p className="text-xs text-ink/50">
                {story.university} · {story.destination}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
