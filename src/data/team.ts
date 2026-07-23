export type TeamMember = {
  name: string;
  city: string;
  country: string;
  phone: string;
  role: { en: string; bn: string };
  photo?: string;
  bio?: { en: string; bn: string };
};

// Real consultants, confirmed from the client's own marketing materials.
// The three with photos are the leadership focus; more consultants operate
// globally beyond these.
export const TEAM: TeamMember[] = [
  {
    name: "SM Faiaz Alam",
    city: "Timișoara",
    country: "Romania",
    phone: "+40 73 258 9327",
    role: { en: "Founder & CEO", bn: "প্রতিষ্ঠাতা ও সিইও" },
    photo: "photos/team-faiaz.jpg",
    bio: {
      en: "Studied at West University of Timișoara, Romania. Former student representative at MAHSA University and past president of the Bangladeshi Youth Alliance Malaysia. He has walked every route we place students on.",
      bn: "রোমানিয়ার ওয়েস্ট ইউনিভার্সিটি অব তিমিসোয়ারায় পড়াশোনা করেছেন। মাহসা ইউনিভার্সিটির সাবেক স্টুডেন্ট রিপ্রেজেন্টেটিভ এবং বাংলাদেশি ইয়ুথ অ্যালায়েন্স মালয়েশিয়ার সাবেক প্রেসিডেন্ট। যে পথে আমরা শিক্ষার্থীদের পাঠাই, তার প্রতিটি তিনি নিজে পাড়ি দিয়েছেন।",
    },
  },
  {
    name: "Shafayat Uddin",
    city: "Chandpur",
    country: "Bangladesh",
    phone: "+880 163 435 3683",
    role: { en: "Consultant", bn: "কাউন্সেলর" },
    photo: "photos/team-shafayat.jpg",
  },
  {
    name: "Arman Mojumdar",
    city: "Kuala Lumpur",
    country: "Malaysia",
    phone: "+60 13 498 5110",
    role: { en: "Senior Consultant", bn: "সিনিয়র কাউন্সেলর" },
    photo: "photos/team-arman.jpg",
  },
  {
    name: "Saleh Ferdous Sunny",
    city: "Kuala Lumpur",
    country: "Malaysia",
    phone: "+60 11 606 69330",
    role: { en: "Consultant", bn: "কাউন্সেলর" },
  },
];
