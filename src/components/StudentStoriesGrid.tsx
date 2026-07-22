import { useState } from "react";
import { useLang } from "../i18n";
import { assetPath } from "../lib/assetPath";

type Story = {
  name: string;
  destination: string;
  university: string;
  outcome: "visaApproved" | "arrived";
  photo: string;
  focus?: string; // object-position, defaults to top
};

// Real placements, confirmed from the client's own marketing materials.
// Captions state the outcome factually rather than inventing quotes for real people.
const FEATURED: Story = {
  name: "Md Rakibul Islam",
  destination: "Georgia",
  university: "Alte University",
  outcome: "visaApproved",
  photo: "photos/georgia-visa-rakibul.jpg",
  focus: "center 35%",
};

const STORIES: Story[] = [
  {
    name: "Imran Hossain Shanto",
    destination: "Malaysia",
    university: "Mahsa Avenue International College",
    outcome: "arrived",
    photo: "photos/malaysia-arrival-imran.jpg",
    focus: "center 20%",
  },
  {
    name: "Md Ruhel Miah",
    destination: "Malaysia",
    university: "Mahsa Avenue International College",
    outcome: "arrived",
    photo: "photos/malaysia-arrival-ruhel.jpg",
    focus: "center 30%",
  },
  {
    name: "Sunny Saleh",
    destination: "Malaysia",
    university: "Universiti Tun Abdul Razak · BSc Computer Science",
    outcome: "visaApproved",
    photo: "photos/malaysia-visa-sunny.jpg",
    focus: "center 25%",
  },
  {
    name: "Mehedi Hasan Supto",
    destination: "Romania",
    university: "West University of Timișoara · BSc Informatics",
    outcome: "visaApproved",
    photo: "photos/romania-visa-mehedi.jpg",
    focus: "center 30%",
  },
];

function StoryImage({ story, className }: { story: Story; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-parchment/50">
        <span className="font-mono text-xs text-ink/30">PHOTO PENDING</span>
      </div>
    );
  }
  return (
    <img
      src={assetPath(story.photo)}
      alt={story.name}
      className={`h-full w-full object-cover ${className ?? ""}`}
      style={{ objectPosition: story.focus ?? "center top" }}
      onError={() => setFailed(true)}
    />
  );
}

function OutcomePill({ outcome }: { outcome: Story["outcome"] }) {
  const { t } = useLang();
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-navy/90 px-3 py-1 text-[10px] font-bold uppercase tracking-caps text-white backdrop-blur">
      <span className="h-1.5 w-1.5 rounded-full bg-coral" />
      {outcome === "visaApproved" ? t.students.outcomeVisaApproved : t.students.outcomeArrived}
    </span>
  );
}

/** The real-placement proof section: one featured story (photo + real quote)
 * beside a strip of supporting arrivals. Marketing-poster photos are unified
 * under a consistent overlay-pill layer and top-anchored crops. Used inline on
 * the homepage and on /success-stories, never gated behind a click. */
export default function StudentStoriesGrid() {
  const { t } = useLang();

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Featured story */}
      <figure className="relative flex flex-col overflow-hidden rounded-2xl border hairline bg-navy text-white lg:col-span-7">
        <div className="relative aspect-[16/11] w-full overflow-hidden">
          <StoryImage story={FEATURED} />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent" />
          <div className="absolute left-5 top-5">
            <OutcomePill outcome={FEATURED.outcome} />
          </div>
        </div>
        <figcaption className="flex flex-1 flex-col p-7 md:p-9">
          <span className="font-display text-5xl leading-none text-coral">"</span>
          <blockquote className="-mt-4 font-display text-2xl leading-snug md:text-3xl">
            {t.spotlight.quote}
          </blockquote>
          <div className="mt-6">
            <p className="font-semibold">{FEATURED.name}</p>
            <p className="text-sm text-white/55">{t.spotlight.meta}</p>
          </div>
        </figcaption>
      </figure>

      {/* Supporting arrivals: 2x2 */}
      <div className="grid grid-cols-2 gap-6 lg:col-span-5">
        {STORIES.map((story) => (
          <figure
            key={story.name}
            className="group relative overflow-hidden rounded-2xl border hairline bg-paper"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <StoryImage story={story} className="transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
              <div className="absolute left-3 top-3">
                <OutcomePill outcome={story.outcome} />
              </div>
              <figcaption className="absolute inset-x-0 bottom-0 p-4 text-white">
                <p className="text-sm font-semibold leading-tight">{story.name}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-white/70">{story.university}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-caps text-coral">
                  {story.destination}
                </p>
              </figcaption>
            </div>
          </figure>
        ))}
      </div>
    </div>
  );
}
