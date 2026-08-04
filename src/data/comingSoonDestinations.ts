export type ComingSoonDestination = {
  slug: string;
  nameEn: string;
  nameBn: string;
  continent: "Europe" | "Asia" | "Oceania";
};

// Destinations we're expanding into but don't yet have a verified partner
// guide for — real content (tuition, eligibility, documents) goes up once
// we have a source to build it from, same as Malaysia/Romania/Georgia/China.
export const COMING_SOON_DESTINATIONS: ComingSoonDestination[] = [
  { slug: "hungary", nameEn: "Hungary", nameBn: "হাঙ্গেরি", continent: "Europe" },
  { slug: "netherlands", nameEn: "Netherlands", nameBn: "নেদারল্যান্ডস", continent: "Europe" },
  { slug: "iceland", nameEn: "Iceland", nameBn: "আইসল্যান্ড", continent: "Europe" },
  { slug: "slovakia", nameEn: "Slovakia", nameBn: "স্লোভাকিয়া", continent: "Europe" },
  { slug: "denmark", nameEn: "Denmark", nameBn: "ডেনমার্ক", continent: "Europe" },
  { slug: "sweden", nameEn: "Sweden", nameBn: "সুইডেন", continent: "Europe" },
  { slug: "belgium", nameEn: "Belgium", nameBn: "বেলজিয়াম", continent: "Europe" },
  { slug: "new-zealand", nameEn: "New Zealand", nameBn: "নিউজিল্যান্ড", continent: "Oceania" },
];
