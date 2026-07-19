export type TeamMember = {
  name: string;
  city: string;
  country: string;
  phone: string;
  role: { en: string; bn: string };
};

// Real consultants, confirmed from the client's own marketing materials.
export const TEAM: TeamMember[] = [
  {
    name: "Shafayat Uddin",
    city: "Chandpur",
    country: "Bangladesh",
    phone: "+880 163 435 3683",
    role: { en: "Consultant", bn: "কাউন্সেলর" },
  },
  {
    name: "Saleh Ferdous Sunny",
    city: "Kuala Lumpur",
    country: "Malaysia",
    phone: "+6011 606 69330",
    role: { en: "Consultant", bn: "কাউন্সেলর" },
  },
  {
    name: "Arman Mojumdar",
    city: "Kuala Lumpur",
    country: "Malaysia",
    phone: "+6013 498 5110",
    role: { en: "Consultant", bn: "কাউন্সেলর" },
  },
  {
    name: "SM Faiaz Alam",
    city: "Timișoara",
    country: "Romania",
    phone: "+4073 258 9327",
    role: { en: "CEO, Abroad Net Education", bn: "সিইও, অ্যাব্রোড নেট এডুকেশন" },
  },
];
